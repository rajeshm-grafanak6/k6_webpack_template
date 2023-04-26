import { check, fail } from 'k6';

export function verifyResponse({
  response,
  expectedStatus,
  expectedContent,
  failOnError,
  printOnError,
  doCheck = true,
  verbose = false,
  dynamicIds,
  dynamicIdPlaceholder = '[id]',
}) {
  if (!response) throw 'No response object provided';
  if (!expectedStatus && !expectedContent) throw 'No expected status or content specified in call to verifyResponse for URL ' + response.url;

  // sort dynamic IDs by length so that the longest IDs are replaced first
  // some basic filtering first to ensure we don't have any falsey values
  
  let filteredDynamicIds = [];
  if (dynamicIds) {
    filteredDynamicIds = dynamicIds.filter(Boolean);
    filteredDynamicIds.sort((a, b) => b.length - a.length);
  }

  if (Array.isArray(response)) {
    response.forEach((r) => {
      verify(
        r,
        expectedStatus,
        expectedContent,
        failOnError,
        printOnError,
        doCheck,
        verbose,
        filteredDynamicIds,
        dynamicIdPlaceholder);
    });
  } else {
    verify(
      response,
      expectedStatus,
      expectedContent,
      failOnError,
      printOnError,
      doCheck,
      verbose,
      filteredDynamicIds,
      dynamicIdPlaceholder);
  }
}

function verify(
  response,
  expectedStatus,
  expectedContent,
  failOnError,
  printOnError,
  doCheck,
  verbose,
  dynamicIds,
  dynamicIdPlaceholder,
) {
  let url = response.url;
  let contentCheckResult, statusCheckResult;

  // replace dynamic IDs in the URL
  if (dynamicIds) {
    dynamicIds.forEach((dynamicId) => {
      if (response.url.includes(dynamicId)) {
        url = url.replace(dynamicId, dynamicIdPlaceholder);
      }
    });
  }

  // status check
  if (expectedStatus) {
    const statusText = `${response.request.method} ${url} status ${expectedStatus}`;
    statusCheckResult = response.status === expectedStatus;

    if (doCheck) {
      check(response, {
        [statusText]: () => statusCheckResult
      });
    }

    if (statusCheckResult && verbose) console.debug(statusText);
  }

  // content check
  if (expectedContent) {
    const contentText = `"${expectedContent}" in ${url}`;

    try {
      contentCheckResult = response.body.includes(expectedContent);
    } catch (err) { // no response.body
      contentCheckResult = false;
    }

    if (doCheck) {
      check(response, {
        [contentText]: (r) => contentCheckResult,
      });
    }

    if (contentCheckResult && verbose) console.debug(contentText);
  }

  // if either check failed...
  if (typeof statusCheckResult !== 'undefined' && !statusCheckResult || !contentCheckResult && expectedContent) {
    // print the response body if it exists (timeouts won't have any)
    if (printOnError && response.body) console.warn("Unexpected response:\n" + response.body);

    if (failOnError) {
      // if both checks failed:
      if (!statusCheckResult && (!contentCheckResult && expectedContent)) {
        fail(`${response.request.method} ${url} unexpected status ${response.status} and "${expectedContent}" not found in response`);
      }
      else {
        if (!statusCheckResult && expectedStatus) {
          fail(`Received unexpected status code ${response.status} for URL: ${url}, expected ${expectedStatus}`);
        }
        else if (!contentCheckResult) {
          fail(`"${expectedContent}" not found in response for URL: ${url}`);
        }
      }
    }
  }
}


export function randChunkSplit(arr, min, max) {
  let newArr = arr.slice();
  let arrs = [],
    size = 1;
  min = min || 1;
  max = max || min || 1;
  while (newArr.length > 0) {
    size = Math.min(max, Math.floor(Math.random() * max + min));
    arrs.push(newArr.splice(0, size));
  }

  return arrs;
}

export function getHeaders(customHeaders = {}) {
  return {
    "X-TEST-TOKEN": "<<x-token>>",
    ...customHeaders,
  };
}

