// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Saygm is Ownable {
    string public prompt = "Say gm";
    
    // emit an event when someone answers

    event NewAnswer (
        address indexed from,
        string answer
    );

    // struct answer
    struct Answer {
        address from;
        string answer;
    }

    // array of all the answers
    Answer[] answers;

    constructor() {}

    /// @dev update prompt and delete old answers
    /// @param newPrompt is a string for update
    function setPrompt(string memory newPrompt) public onlyOwner {
        prompt = newPrompt;
        delete answers;
    }

    function answer(string memory input) public {
        //create answer struct and push into answer array
        answers.push(Answer(
            msg.sender,
            input
        ));
        // emit the new answer event
        emit NewAnswer(
            msg.sender,
            input
        );
    }

    function getAnswers() public view returns(Answer[] memory) {
        return answers;
    }

    function getPrompt() public view returns(string memory){
        return prompt;
    }
}