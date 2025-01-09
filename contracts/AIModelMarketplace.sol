// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AIModelMarketplace {
    struct Model {
        uint256 id;
        string name;
        string description;
        uint256 price;
        address payable creator;
        uint8 ratingCount;
        uint256 totalRating;
    }

    uint256 public modelCount;
    mapping(uint256 => Model) public models;
    mapping(uint256 => mapping(address => bool)) public purchasedModels; // Tracks if a user has purchased a model

    // Events
    event ModelListed(uint256 id, string name, uint256 price, address creator);
    event ModelPurchased(uint256 id, address buyer);
    event ModelRated(uint256 id, uint8 rating, address rater);

    // List a new AI model
    function listModel(string memory name, string memory description, uint256 price) public {
        require(price > 0, "Price must be greater than zero");

        modelCount++;
        models[modelCount] = Model(
            modelCount,
            name,
            description,
            price,
            payable(msg.sender),
            0,
            0
        );

        emit ModelListed(modelCount, name, price, msg.sender);
    }

    // Purchase a specific AI model
    function purchaseModel(uint256 modelId) public payable {
        Model storage model = models[modelId];
        require(model.id > 0, "Model does not exist");
        require(msg.value == model.price, "Incorrect payment amount");
        require(msg.sender != model.creator, "Creator cannot purchase their own model");

        model.creator.transfer(msg.value);
        purchasedModels[modelId][msg.sender] = true;

        emit ModelPurchased(modelId, msg.sender);
    }

    // Rate a purchased AI model
    function rateModel(uint256 modelId, uint8 rating) public {
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");
        require(purchasedModels[modelId][msg.sender], "You must purchase the model to rate it");

        Model storage model = models[modelId];
        require(model.id > 0, "Model does not exist");

        model.ratingCount++;
        model.totalRating += rating;

        emit ModelRated(modelId, rating, msg.sender);
    }

    // Withdraw funds from the contract (for admin or future upgrades)
    function withdrawFunds() public {
        address payable owner = payable(msg.sender);
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        owner.transfer(balance);
    }

    // Retrieve model details
    function getModelDetails(uint256 modelId) public view returns (
        string memory name,
        string memory description,
        uint256 price,
        address creator,
        uint8 averageRating
    ) {
        Model storage model = models[modelId];
        require(model.id > 0, "Model does not exist");

        uint8 avgRating = model.ratingCount > 0 ? uint8(model.totalRating / model.ratingCount) : 0;
        return (model.name, model.description, model.price, model.creator, avgRating);
    }
}
