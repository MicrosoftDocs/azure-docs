---
title: Create a blockchain application in Azure Blockchain Workbench
description: How to create a blockchain application in Azure Blockchain Workbench.
services: azure-blockchain
keywords: 
author: PatAltimore
ms.author: patricka
ms.date: 10/1/2018
ms.topic: article
ms.service: azure-blockchain
ms.reviewer: zeyadr
manager: femila
#customer intent: As a developer, I want to use Azure Blockchain Workbench to create a blockchain app.
---
# Create a blockchain application in Azure Blockchain Workbench

You can use Azure Blockchain Workbench to create blockchain applications that represent multi-party workflows defined by configuration and smart contract code.

You learn how to:

> [!div class="checklist"]
> * Configure a blockchain application
> * Create a smart contract code file
> * Add a blockchain application to Blockchain Workbench
> * Add members to the blockchain application

## Prerequisites

* A Blockchain Workbench deployment. For more information, see [Azure Blockchain Workbench deployment](deploy.md) for details on deployment.
* Azure Active Directory users in the tenant associated with Blockchain Workbench. For more information, see [add Azure AD users in Azure Blockchain Workbench](manage-users.md#add-azure-ad-users).
* A Blockchain Workbench administrator account. For more information, see add [Blockchain Workbench administrators in Azure Blockchain Workbench](manage-users.md#manage-blockchain-workbench-administrators).

## Hello, Blockchain!

Let's build a basic application in which a requestor sends a request and a responder send a response to the request. 
For example, a request can be, "Hello, how are you?", and the response can be, "I'm great!". Both the request and the response are recorded on the underlying blockchain. 

Follow the steps to create the application files or you can [download the sample from GitHub](https://github.com/Azure-Samples/blockchain/tree/master/blockchain-workbench/application-and-smart-contract-samples/hello-blockchain). 

## Configuration file

Configuration metadata defines the high-level workflows and interaction model of the blockchain application. Configuration metadata represents the workflow stages and interaction model of the blockchain application.

1. In your favorite editor, create a file named `HelloBlockchain.json`.
2. Add the following JSON to define the configuration of the blockchain application.

    ``` json
    {
      "ApplicationName": "HelloBlockchain",
      "DisplayName": "Hello, Blockchain!",
      "Description": "A simple application to send request and get response",
      "ApplicationRoles": [
        {
          "Name": "Requestor",
          "Description": "A person sending a request."
        },
        {
          "Name": "Responder",
          "Description": "A person responding to a request"
        }
      ],
      "Workflows": [
        {
          "Name": "HelloBlockchain",
          "DisplayName": "Request Response",
          "Description": "A simple workflow to send a request and receive a response.",
          "Initiators": [ "Requestor" ],
          "StartState": "Request",
          "Properties": [
            {
              "Name": "State",
              "DisplayName": "State",
              "Description": "Holds the state of the contract.",
              "Type": {
                "Name": "state"
              }
            },
            {
              "Name": "Requestor",
              "DisplayName": "Requestor",
              "Description": "A person sending a request.",
              "Type": {
                "Name": "Requestor"
              }
            },
            {
              "Name": "Responder",
              "DisplayName": "Responder",
              "Description": "A person sending a response.",
              "Type": {
                "Name": "Responder"
              }
            },
            {
              "Name": "RequestMessage",
              "DisplayName": "Request Message",
              "Description": "A request message.",
              "Type": {
                "Name": "string"
              }
            },
            {
              "Name": "ResponseMessage",
              "DisplayName": "Response Message",
              "Description": "A response message.",
              "Type": {
                "Name": "string"
              }
            }
          ],
          "Constructor": {
            "Parameters": [
              {
                "Name": "message",
                "Description": "...",
                "DisplayName": "Request Message",
                "Type": {
                  "Name": "string"
                }
              }
            ]
          },
          "Functions": [
            {
              "Name": "SendRequest",
              "DisplayName": "Request",
              "Description": "...",
              "Parameters": [
                {
                  "Name": "requestMessage",
                  "Description": "...",
                  "DisplayName": "Request Message",
                  "Type": {
                    "Name": "string"
                  }
                }
              ]
            },
            {
              "Name": "SendResponse",
              "DisplayName": "Response",
              "Description": "...",
              "Parameters": [
                {
                  "Name": "responseMessage",
                  "Description": "...",
                  "DisplayName": "Response Message",
                  "Type": {
                    "Name": "string"
                  }
                }
              ]
            }
          ],
          "States": [
            {
              "Name": "Request",
              "DisplayName": "Request",
              "Description": "...",
              "PercentComplete": 50,
              "Value": 0,
              "Style": "Success",
              "Transitions": [
                {
                  "AllowedRoles": ["Responder"],
                  "AllowedInstanceRoles": [],
                  "Description": "...",
                  "Function": "SendResponse",
                  "NextStates": [ "Respond" ],
                  "DisplayName": "Send Response"
                }
              ]
            },
            {
              "Name": "Respond",
              "DisplayName": "Respond",
              "Description": "...",
              "PercentComplete": 90,
              "Value": 1,
              "Style": "Success",
              "Transitions": [
                {
                  "AllowedRoles": [],
                  "AllowedInstanceRoles": ["Requestor"],
                  "Description": "...",
                  "Function": "SendRequest",
                  "NextStates": [ "Request" ],
                  "DisplayName": "Send Request"
                }
              ]
            }
          ]
        }
      ]
    }
    ```

3. Save the `HelloBlockchain.json` file.

The configuration file has several sections. Details about each section are as follows:

### Application metadata

The beginning of the configuration file contains information about the application including application name and description.

### Application roles

The application roles section defines the user roles who can act or participate within the blockchain application. You define a set of distinct roles based on functionality. In the request-response scenario, there is a distinction between the functionality of a requestor as an entity that produces requests and a responder as an entity that produces responses.

### Workflows

Workflows define one or more stages and actions of the contract. In the request-response scenario, the first stage (state) of the workflow is a requestor (role) takes an action (transition) to send a request (function). The next stage (state) is a responder (role) takes an action (transition) to send a response (function). An application's workflow can involve properties, functions, and states required describe the flow of a contract. 

For more information about the contents of configuration files, see [Azure Blockchain Workflow configuration reference](configuration.md).

## Smart contract code file

Smart contracts represent the business logic of the blockchain application. Currently, Blockchain Workbench supports Ethereum for the blockchain ledger. Ethereum uses [Solidity](https://solidity.readthedocs.io) as its programming language for writing self-enforcing business logic for smart contracts.

Smart contracts in Solidity are similar to classes in object-oriented languages. Each contract contains state and functions to implement stages and actions of the smart contract.

In your favorite editor, create a file called `HelloBlockchain.sol`.

### Version pragma

As a best practice, indicate the version of Solidity you are targeting. Specifying the version helps avoid incompatibilities with future Solidity versions. 

Add the following version pragma at the top of `HelloBlockchain.sol` smart contract code file.


  ``` solidity
  pragma solidity ^0.4.20;
  ```

### Base class

**WorkbenchBase** base class enables Blockchain Workbench to create and update the contract. The base class is required for Blockchain Workbench specific smart contract code. Your contract needs to inherit from the **WorkbenchBase** base class.

In `HelloBlockchain.sol` smart contract code file, add the **WorkbenchBase** class at the beginning of the file. 

```
contract WorkbenchBase {
    event WorkbenchContractCreated(string applicationName, string workflowName, address originatingAddress);
    event WorkbenchContractUpdated(string applicationName, string workflowName, string action, address originatingAddress);

    string internal ApplicationName;
    string internal WorkflowName;

    function WorkbenchBase(string applicationName, string workflowName) internal {
        ApplicationName = applicationName;
        WorkflowName = workflowName;
    }

    function ContractCreated() internal {
        WorkbenchContractCreated(ApplicationName, WorkflowName, msg.sender);
    }

    function ContractUpdated(string action) internal {
        WorkbenchContractUpdated(ApplicationName, WorkflowName, action, msg.sender);
    }
}
```
The base class includes two important functions:

|Base class function  | Purpose  | When to call  |
|---------|---------|---------|
| ContractCreated() | Notifies Blockchain Workbench a contract has been created | Before exiting the contract constructor |
| ContractUpdated() | Notifies Blockchain Workbench a contract state has been updated | Before exiting a contract function |

### Configuration and smart contract code relationship

Blockchain Workbench uses the configuration file and smart contract code file to create a blockchain application. There is a relationship between what is defined in the configuration and the code in the smart contract. Contract details, functions, parameters, and types are required to match to create the application. Blockchain Workbench verifies the files prior to application creation. 

### Contract

For Blockchain Workbench, contracts need to inherit from the **WorkbenchBase** base class. When declaring the contract, you need to pass the application name and the workflow name as arguments.

Add the **contract** header to your `HelloBlockchain.sol` smart contract code file. 

```
contract HelloBlockchain is WorkbenchBase('HelloBlockchain', 'HelloBlockchain') {
```

Your contract needs to inherit from the **WorkbenchBase** base class and pass in the parameters **ApplicationName**  and the workflow **Name** as defined in the configuration file. In this case, the application name and workflow name are the same.

### State variables

State variables store values of the state for each contract instance. The state variables in your contract must match the workflow properties defined in the configuration file.

Add the state variables to your contract in your `HelloBlockchain.sol` smart contract code file. 

```
    //Set of States
    enum StateType { Request, Respond}
    
    //List of properties
    StateType public  State;
    address public  Requestor;
    address public  Responder;
    
    string public RequestMessage;
    string public ResponseMessage;
```

### Constructor

The constructor defines input parameters for a new smart contract instance of a workflow. The constructor is declared as a function with the same name as the contract. Required parameters for the constructor are defined as constructor parameters in the configuration file. The number, order, and type of parameters must match in both files.

In the constructor function, write any business logic you want to perform prior to creating the contract. For example, initialize the state variables with starting values.

Before exiting the constructor function, call the `ContractCreated()` function. This function notifies Blockchain Workbench a contract has been created.

Add the constructor function to your contract in your `HelloBlockchain.sol` smart contract code file. 

```
    // constructor function
    function HelloBlockchain(string message) public
    {
        Requestor = msg.sender;
        RequestMessage = message;
        State = StateType.Request;
    
        // call ContractCreated() to create an instance of this workflow
        ContractCreated();
    }
```

### Functions

Functions are the executable units of business logic within a contract. Required parameters for the function are defined as function parameters in the configuration file. The number, order, and type of parameters must match in both files. Functions are associated to transitions in a Blockchain Workbench workflow in the configuration file. A transition is an action performed to move to the next stage of an application's workflow as determined by the contract.

Write any business logic you want to perform in the function. For example, modifying a state variable's value.

Before exiting the function, call the `ContractUpdated()` function. The function notifies Blockchain Workbench contract state has been updated. If you want to undo state changes made in the function, call revert(). Revert discards state changes made since the last call to ContractUpdated().

1. Add the following functions to your contract in your `HelloBlockchain.sol` smart contract code file. 

    ```
        // call this function to send a request
        function SendRequest(string requestMessage) public
        {
            if (Requestor != msg.sender)
            {
                revert();
            }
    
            RequestMessage = requestMessage;
            State = StateType.Request;
    
            // call ContractUpdated() to record this action
            ContractUpdated('SendRequest');
        }
    
        // call this function to send a response
        function SendResponse(string responseMessage) public
        {
            Responder = msg.sender;
    
            // call ContractUpdated() to record this action
            ResponseMessage = responseMessage;
            State = StateType.Respond;
            ContractUpdated('SendResponse');
        }
    }
    ```

2. Save your `HelloBlockchain.sol` smart contract code file.

## Add blockchain application to Blockchain Workbench

To add a blockchain application to Blockchain Workbench, you upload the configuration and smart contract files to define the application.

1. In a web browser, navigate to the Blockchain Workbench web address. For example, `https://{workbench URL}.azurewebsites.net/` The web application is created when you deploy Blockchain Workbench. For information on how to find your Blockchain Workbench web address, see [Blockchain Workbench Web URL](deploy.md#blockchain-workbench-web-url)
2. Sign in as a [Blockchain Workbench administrator](manage-users.md#manage-blockchain-workbench-administrators).
3. Select **Applications** > **New**. The **New application** pane is displayed.
4. Select **Upload the contract configuration** > **Browse** to locate the **HelloBlockchain.json** configuration file you created. The configuration file is automatically validated. Select the **Show** link to display validation errors. Fix validation errors before you deploy the application.
5. Select **Upload the contract code** > **Browse** to locate the **HelloBlockchain.sol** smart contract code file. The code file is automatically validated. Select the **Show** link to display validation errors. Fix validation errors before you deploy the application.
6. Select **Deploy** to create the blockchain application based on the configuration and smart contract files.

Deployment of the blockchain application takes a few minutes. When deployment is finished, the new application is displayed in **Applications**. 

> [!NOTE]
> You can also create blockchain applications by using the [Azure Blockchain Workbench REST API](https://docs.microsoft.com/rest/api/azure-blockchain-workbench). 

## Add blockchain application members

Add application members to your application to initiate and take actions on contracts. To add application members, you need to be a [Blockchain Workbench administrator](manage-users.md#manage-blockchain-workbench-administrators).

1. Select **Applications** > **Hello, Blockchain!**.
2. The number of members associated to the application is displayed in the upper right corner of the page. For a new application, the number of members will be zero.
3. Select the **members** link in the upper right corner of the page. A current list of members for the application is displayed.
4. In the membership list, select **Add members**.
5. Select or enter the member's name you want to add. Only Azure AD users that exist in the Blockchain Workbench tenant are listed. If the user is not found, you need to [add Azure AD users](manage-users.md#add-azure-ad-users).
6. Select the **Role** for the member. For the first member, select **Requestor** as the role.
7. Select **Add** to add the member with the associated role to the application.
8. Add another member to the application with the **Responder** role.

For more information about managing users in Blockchain Workbench, see [managing users in Azure Blockchain Workbench](manage-users.md)

## Next steps

In this how-to article, you've created a basic request and response application. To learn how to use the application, continue to the next how-to article.

> [!div class="nextstepaction"]
> [Using a blockchain application](use.md)
