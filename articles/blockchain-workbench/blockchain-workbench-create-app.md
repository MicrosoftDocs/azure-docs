---
title: Create a blockchain application in Azure Blockchain Workbench
description: How to create a blockchain application in Azure Blockchain Workbench.
services: azure-blockchain
keywords: 
author: PatAltimore
ms.author: patricka
ms.date: 4/9/2018
ms.topic: article
ms.service: azure-blockchain
ms.reviewer: zeyadr
manager: femila
#customer intent: As a developer, I want to use Azure Blockchain Workbench to create a blockchain app.
---
# Create a blockchain application in Azure Blockchain Workbench

You can use Azure Blockchain Workbench to create blockchain applications that represent multi-party workflows defined by configuration and smart contract code.

You'll learn how to:

> [!div class="checklist"]
> * Configure a blockchain application in Blockchain Workbench
> * Create a smart contract code file
> * Add a blockchain application to Blockchain Workbench
> * Add members to the blockchain application

## Prerequisites

* A Blockchain Workbench deployment. For more information, see [Azure Blockchain Workbench deployment](blockchain-workbench-deploy.md) for details on deployment.
* Azure Active Directory users in the tenant associated with Blockchain Workbench. For more information, see [add Azure AD users in Manage Users in Azure Blockchain Workbench]()
* A Blockchain Workbench member with administration rights. For more information, see [add Blockchain Workbench administrators in Manage Users in Azure Blockchain Workbench]()

## Scenario

Explain the scenario for the application. **TODO: Supply chain - refrigerated transportation** 


## Refrigerated transportation sample

A sample project for the asset transfer scenario is available on GitHub.

[Download a zip file](https://github.com/Azure-Samples) or clone the sample from GitHub.

```
git clone https://github.com/Azure-Samples/placeholder.git
```

Blockchain Workbench applications are multi-party workflows defined by configuration metadata and smart contract code. 

Configuration metadata defines the high-level workflows and interaction model of the blockchain application. **TODO: highlight configuration file in sample**

Smart contracts define the business logic of the blockchain application. Blockchain Workbench uses configuration and smart contract code to generate end-to-end blockchain application user experiences. **TODO: highlight code file in sample**

## Configuration file

Configuration metadata represents the workflow stages and interaction model of the blockchain application.

1. In an editor, open `AssetTransfer.json`.
2. Copy and paste the following JSON into the `AssetTransfer.json` configuration file. Save the changes. **TODO: Perhaps have a github repo with the sample to avoid copy paste a very large file**.

    ``` json
    {
      "ApplicationName": "AssetTransfer",
      "DisplayName": "Asset Transfer",
      "Description": "Allows transfer of assets",
      "ApplicationRoles": [
        {
          "Name": "Owner",
          "Description": "Description of owner"
        }
      ],
      "Workflows": [
        {
          "Name": "AssetTransfer",
          "DisplayName": "Asset Transfer",
          "Description": "Handles the business logic for the asset transfer scenario",
          "Initiators": [ "Owner" ],
          "StartState":  "Active",
          "Properties": [
            {
              "Name": "State",
              "DisplayName": "State",
              "Description": "Holds the state of the contract",
              "Type": {
                "Name": "state"
              }
            }
          ],
          "Constructor": {
            "Parameters": [
              {
                "Name": "description",
                "Description": "The description of this asset",
                "DisplayName": "Description",
                "Type": {
                  "Name": "string"
                 }
              }
             ]
            }
          }
       ]
    }
    ```

The configuration file includes:

* Information about the application including application name and description
* Application roles that define the user roles who can act or participate within the blockchain application.
* Workflows that define one or more stages and actions of the contract.

See [Azure Blockchain Workflow configuration reference]() for details about the contents of configuration files.

## Smart contract code file

Smart contracts represent the business logic of the blockchain application. Currently, Blockchain Workbench supports Ethereum for the blockchain ledger. Ethereum uses [Solidity](https://solidity.readthedocs.io) as its programming language for writing self-enforcing business logic for smart contracts.

Smart contracts in Solidity are similar to classes in object-oriented languages. Each contract contains state and functions to implement stages and actions of the smart contract.

In your favorite editor, create a file called `AssetTransfer.sol`.

### Version pragma

As a best practice, indicate the version of Solidity you are targeting. This helps avoid version incompatibilities with future Solidity versions. 

Add the following version pragma at the top of `AssetTransfer.sol` smart contract code file.


  ``` solidity
  pragma solidity ^0.4.10;
  ```

### Base class

**WorkbenchBase** base class enables Blockchain Workbench to create an update the contract. The base class is required for Blockchain Workbench specific smart contract code. Your contract needs to inherit from the **WorkbenchBase** base class.

In `AssetTransfer.sol` smart contract code file, find the **WorkbenchBase** class at the beginning of the file. 

```solidity
contract WorkbenchBase {
    event AppBuilderContractCreated(string applicationName, string workflowName, address originatingAddress);
    event AppBuilderContractUpdated(string applicationName, string workflowName, string action, address originatingAddress);
    
    string internal ApplicationName;
    string internal WorkflowName;

    function AppBuilderBase(string applicationName, string workflowName) internal {
        ApplicationName = applicationName;
        WorkflowName = workflowName;
    }

    function ContractCreated() internal {
        AppBuilderContractCreated(ApplicationName, WorkflowName, msg.sender);
    }

    function ContractUpdated(string action) internal {
        AppBuilderContractUpdated(ApplicationName, WorkflowName, action, msg.sender);
    }
}
```
The base class includes two important functions:


|Base class function  | Purpose  | When to call  |
|---------|---------|---------|
| ContractCreated() | Notifies Blockchain Workbench a contract has been created | Before exiting the contract constructor |
| ContractUpdated() | Notifies Blockchain Workbench a contract state has been updated | Before exiting a contract function |



### Configuration and smart contract code relationship

Blockchain Workbench uses the configuration file and smart contract code file to create a blockchain application. There is a relationship between what is defined in the configuration and the code in the smart contract. Contract details, functions, parameters and types are required to match to create the application. Blockchain Workbench verifies the files prior to application creation. 

### Contract

For Blockchain Workbench, contracts need to inherit from the **WorkbenchBase** base class. When declaring the contract, you need to pass the application name and the workflow name as arguments.

Add the **contract** header to your `AssetTransfer.sol` smart contract code file. 

```solidity
contract AssetTransfer is WorkbenchBase('AssetTransfer', 'AssetTransfer')
{
...
```

### State variables

State variables store values of the state for each contract instance. The state variables in your contract must match the workflow properties defined in the configuration file.

Add the state variables to your contract in your `AssetTransfer.sol` smart contract code file. 

```solidity
contract AssetTransfer is AppBuilderBase('AssetTransfer', 'AssetTransfer')
{
    enum AssetState { Active, OfferPlaced, PendingInspection, Inspected, Appraised, NotionalAcceptance, BuyerAccepted, SellerAccepted, Accepted, Terminated }
Address public InstanceOwner;
    string public Description;
    uint public AskingPrice;
    AssetState public State;
    
Address public InstanceBuyer;
    uint public OfferPrice;
Address public InstanceInspector;
Address public InstanceAppraiser;
...
```

### Constructor

The constructor defines input parameters for a new smart contract instance of a workflow. The contructor is declared as a function with the same name as the contract. Required parameters for the constructor are defined as constructor parameters in the configuration file. The number, order, and type of parameters must match in both files.

In the constructor function, write any business logic you want to perform prior to creating the contract. For example, initialize the state variables with starting values.

Before exiting the constructor function, call the `ContractCreated()` function. This notifies Blockchain Workbench a contract has been created.

Add the constructor function to your contract in your `AssetTransfer.sol` smart contract code file. 

```
function AssetTransfer(string description, uint256 price) public
{
    InstanceOwner = msg.sender;
    AskingPrice = price;
    Description = description;
    State = AssetState.Active;
    ContractCreated();
}
```

### Functions

Functions are the executable units of business logic within a contract. Required parameters for the function are defined as function parameters in the configuration file. The number, order, and type of parameters must match in both files. Functions are associated to transitions in a Blockchain Workbench workflow in the configuration file. A transition is an action performed to move to the next stage of an application's workflow as determined by the contract.

Write any business logic you want to perform in the function. For example, modifying a state variable's value.

Before exiting the function, call the `ContractUpdated()` function. This notifies Blockchain Workbench contract state has been updated. If you want to undo state changes made in the function, call revert(). This discards state changes made since the last call to ContractUpdated().

1. Add the following functions to your contract in your `AssetTransfer.sol` smart contract code file. 

    ``` solidity
        function Modify(string description, uint256 price) public
        {
            if (State != AssetState.Active)
            {
                revert();
            }
            if (InstanceOwner != msg.sender)
            {
                revert();
            }
    
            Description = description;
            AskingPrice = price;
            ContractUpdated('Modify');
        }
    
        function MakeOffer(address inspector, address appraiser, uint256 offerPrice) public
        {
            if (inspector == 0x0 || appraiser == 0x0 || offerPrice == 0)
            {
                revert();
            }
            if (State != AssetState.Active)
            {
                revert();
            }
            // Cannot enforce "AllowedRoles":["Buyer"] because Role information is unavailable
            if (InstanceOwner == msg.sender) // not expressible in the current specification language
            {
                revert();
            }
            
            InstanceBuyer = msg.sender;
            InstanceInspector = inspector;
            InstanceAppraiser = appraiser;
            OfferPrice = offerPrice;
            State = AssetState.OfferPlaced;
            ContractUpdated('MakeOffer');
        }
    ```

2. Save your `AssetTransfer.sol` smart contract code file.

## Azure Blockchain Workbench web application

Use the Blockchain Workbench web application to create and manage blockchain applications.
 
1. In a web browser, navigate to the Blockchain Workbench web address. For example, `https://contoso.com/` The web application is created when you deploy Blockchain Workbench. **TODO: instructions on how to find the address**
2. Sign in as a Blockchain Workbench administrator. Blockchain Workbench administrators and users are configured when you deploy Blockchain Workbench.

> [!IMPORTANT]
> Blockchain Workbench web application creation and initial user configuration occurs during Blockchain Workbench deployment.

## Add blockchain application to Blockchain Workbench

To add a blockchain application to Blockchain Workbench, you use the configuration and smart contract files to define the application.

1. Sign in as a Blockchain Workbench administrator.
2. Select **Applications** > **New**. The **New application** pane is displayed.
3. Select **Upload the contract configuration** > **Browse** to locate the **AssetTransfer** configuration file from the **TODO** sample. The configuration file is automatically validated. Select the **Show** link to display validation errors. Validation errors need to be fixed before you deploy the application.
4. Select **Upload the contract code** > **Browse** to locate a **TODO** sample smart contract code file. The code file is automatically validated. Select the **Show** link to display validation errors. Validation errors need to be fixed before you deploy the application.
5. Select **Deploy** to create the blockchain application based on the configuration and smart contract files.

Deployment of the blockchain application takes a few minutes. When deployment is finished, the new application is displayed in **Applications**. 

{Screenshot: Application pane with application tile}

> [!NOTE]
> You can also create blockchain applications by using the [Azure Blockchain Workbench REST API](https://docs.microsoft.com/rest/api/azure-blockchain-workbench). 

## Add blockchain application members

Add application members to your application to initiate and take actions on contracts.

1. Select **Applications** > **Asset Transfer**.
2. The number of members associated to the application is displayed in the upper right corner of the page.
    {screenshot: application with members}
3. Select the **members** link in the upper right corner of the page. This displays the current list of members for the application.
4. In the membership list, select **Add members**.
5. Select or enter the member's name.
6. Select the **Role** for the member.
7. Select **Add** to add the member with the associated role to the application.

## Next steps

* [Use the blockchain application]()
