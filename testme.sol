// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title testMe
 * @dev A simple contract with a counter that increments on external calls.
 */
contract testMe {
    uint256 public counter;

    /**
     * @dev Emitted when the counter is incremented.
     */
    event CounterUpdated(uint256 newCounterValue);

    /**
     * @dev Increments the counter by one and emits an event with the new value.
     */
    function incrementCounter() public {
        counter++;
        emit CounterUpdated(counter);
    }
}
