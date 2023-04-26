import http from "k6/http";
import { sleep, check, group } from "k6";
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.1.0/index.js';

export function getPublicCrocId() {
    let responses;
    group('fetch_individual_public_crocs', () => {
      responses = http.batch(
            [
                ['GET', `${globalThis.BACKEND_URL}/public/crocodiles/1/`, { tags: {name: 'Batch-PublicCrocIds-1'} }],
                ['GET', `${globalThis.BACKEND_URL}/public/crocodiles/2/`, { tags: {name: 'Batch-PublicCrocIds-2'} }],
                ['GET', `${globalThis.BACKEND_URL}/public/crocodiles/3/`, { tags: {name: 'Batch-PublicCrocIds-3'} }],
                ['GET', `${globalThis.BACKEND_URL}/public/crocodiles/4/`, { tags: {name: 'Batch-PublicCrocIds-4'} }],
            ],
        );
    });
    
    responses.forEach(res => {
        check(res, {
          'status was 200': (res) => res.status === 200,
        });
    });

    sleep(randomIntBetween(globalThis.PAUSE_MIN, globalThis.PAUSE_MAX));
}

export function getAllPublicCrocs() {
    let response;
    group('fetch_all_public_crocs', () => {
        response = http.get(`${globalThis.BACKEND_URL}/public/crocodiles/`, {
          tags: {name: 'PublicAllCrocs'},
        });
    });

    check(response, {
        'status was 200': (res) => res.status === 200,
    });

    sleep(randomIntBetween(globalThis.PAUSE_MIN, globalThis.PAUSE_MAX));
}
