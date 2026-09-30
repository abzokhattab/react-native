/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 * @format
 */

import '@react-native/fantom/src/setUpDefaultReactNativeEnvironment';

describe('globalEvalWithSourceUrl', () => {
  it('is installed on the bridgeless runtime', () => {
    // $FlowFixMe[prop-missing]
    expect(typeof global.globalEvalWithSourceUrl).toBe('function');
  });

  it('evaluates source via JSI, documenting how that differs from JS eval', () => {
    // $FlowFixMe[prop-missing]
    const helper = global.globalEvalWithSourceUrl;
    expect(typeof helper).toBe('function');

    // Same shape Metro serves for a lazy chunk (source, not bytecode).
    const source = 'globalThis.__fantomEvalMarker = 17; 17';

    let evalError: mixed = null;
    try {
      // eslint-disable-next-line no-eval
      eval(source);
    } catch (e) {
      evalError = e;
    }

    const helperResult = helper(source, 'globalEvalWithSourceUrl-itest.bundle');

    expect(globalThis.__fantomEvalMarker).toBe(17);
    expect(helperResult).toBe(17);

    if (evalError != null) {
      // Lean Hermes: JS eval() is the unsupported path; the helper is JSI.
      expect(String(evalError.message || evalError)).toMatch(
        /Parsing source code unsupported|eval/i,
      );
    }
  });
});
