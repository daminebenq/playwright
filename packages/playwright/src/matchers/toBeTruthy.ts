/**
 * Copyright Microsoft Corporation. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { expectTypes, callLogText } from '../util';
import { matcherHint } from './matcherHint';
import type { MatcherResult } from './matcherHint';
import { currentExpectTimeout } from '../common/globals';
import type { ExpectMatcherContext } from './expect';
import type { Locator } from 'playwright-core';

export async function toBeTruthy(
  this: ExpectMatcherContext,
  matcherName: string,
  receiver: Locator,
  receiverType: string,
  expected: string,
  unexpected: string,
  arg: string,
  query: (isNot: boolean, timeout: number) => Promise<{ matches: boolean, log?: string[], received?: any, timedOut?: boolean }>,
  options: { timeout?: number } = {},
): Promise<MatcherResult<any, any>> {
  expectTypes(receiver, [receiverType], matcherName);

  const matcherOptions = {
    isNot: this.isNot,
    promise: this.promise,
  };

  const timeout = currentExpectTimeout(options);
  const { matches, log, timedOut } = await query(!!this.isNot, timeout);
  const actual = matches ? expected : unexpected;
  const message = () => {
    const header = matcherHint(this, receiver, matcherName, 'locator', arg, matcherOptions, timedOut ? timeout : undefined);
    const logText = callLogText(log);
    return matches ? `${header}Expected: not ${expected}\nReceived: ${expected}${logText}` :
      `${header}Expected: ${expected}\nReceived: ${unexpected}${logText}`;
  };
  return { locator: receiver, message, pass: matches, actual, name: matcherName, expected };
}
