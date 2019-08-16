---
title: Azure Blockchain Workbench messages integration overview
description: Overview of using messages in Azure Blockchain Workbench.
services: azure-blockchain
keywords: 
author: PatAltimore
ms.author: patricka
ms.date: 05/09/2019
ms.topic: article
ms.service: azure-blockchain
ms.reviewer: brendal
manager: femila
---

# Azure Blockchain Workbench messaging integration

In addition to providing a REST API, Azure Blockchain Workbench also provides messaging-based integration. Workbench publishes ledger-centric events via Azure Event Grid, enabling downstream consumers to ingest data or take action based on these events. For those clients that require reliable messaging, Azure Blockchain Workbench delivers messages to an Azure Service Bus endpoint as well.

## Input APIs

If you want to initiate transactions from external systems to create users, create contracts, and update contracts, you can use messaging input APIs to perform transactions on a ledger. See [messaging integration samples](https://aka.ms/blockchain-workbench-integration-sample) for a sample that demonstrates input APIs.

The following are the currently available input APIs.

### Create user

Creates a new user.

The request requires the following fields:

| **Name**             | **Description**                                      |
|----------------------|------------------------------------------------------|
| requestId            | Client supplied GUID                                |
| firstName            | First name of the user                              |
| lastName             | Last name of the user                               |
| emailAddress         | Email address of the user                           |
| externalId           | Azure AD object ID of the user                      |
| connectionId         | Unique identifier for the blockchain connection |
| messageSchemaVersion | Messaging schema version                            |
| messageName          | **CreateUserRequest**                               |

Example:

``` json
{
    "requestId": "e2264523-6147-41fc-bbbb-edba8e44562d",
    "firstName": "Ali",
    "lastName": "Alio",
    "emailAddress": "aa@contoso.com",
    "externalId": "6a9b7f65-ffff-442f-b3b8-58a35abd1bcd",
    "connectionId": 1,
    "messageSchemaVersion": "1.0.0",
    "messageName": "CreateUserRequest"
}
```

Blockchain Workbench returns a response with the following fields:

| **Name**              | **Description**                                                                                                             |
|-----------------------|-----------------------------------------------------------------------------------------------------------------------------|
| requestId             | Client supplied GUID |
| userId                | ID of the user that was created |
| userChainIdentifier   | Address of the user that was created on the blockchain network. In Ethereum, the address is the user's **on-chain** address. |
| connectionId          | Unique identifier for the blockchain connection|
| messageSchemaVersion  | Messaging schema version |
| messageName           | **CreateUserUpdate** |
| status                | Status of the user creation request.  If successful, value is **Success**. On failure, value is **Failure**.     |
| additionalInformation | Additional information provided based on the status |

Example successful **create user** response from Blockchain Workbench:

``` json
{ 
    "requestId": "e2264523-6147-41fc-bb59-edba8e44562d", 
    "userId": 15, 
    "userChainIdentifier": "0x9a8DDaCa9B7488683A4d62d0817E965E8f248398", 
    "connectionId": 1, 
    "messageSchemaVersion": "1.0.0", 
    "messageName": "CreateUserUpdate", 
    "status": "Success", 
    "additionalInformation": { } 
} 
```

If the request was unsuccessful, details about the failure are included in additional information.

``` json
{
    "requestId": "e2264523-6147-41fc-bb59-edba8e44562d", 
    "userId": 15, 
    "userChainIdentifier": null, 
    "connectionId": 1, 
    "messageSchemaVersion": "1.0.0", 
    "messageName": "CreateUserUpdate", 
    "status": "Failure", 
    "additionalInformation": { 
        "errorCode": 4000, 
        "errorMessage": "User cannot be provisioned on connection." 
    }
}
```

### Create contract

Creates a new contract.

The request requires the following fields:

| **Name**             | **Description**                                                                                                           |
|----------------------|---------------------------------------------------------------------------------------------------------------------------|
| requestId            | Client supplied GUID |
| userChainIdentifier  | Address of the user that was created on the blockchain network. In Ethereum, this address is the user’s **on chain** address. |
| applicationName      | Name of the application |
| version              | Version of the application. Required if you have multiple versions of the application enabled. Otherwise, version is optional. For more information on application versioning, see [Azure Blockchain Workbench application versioning](version-app.md). |
| workflowName         | Name of the workflow |
| parameters           | Parameters input for contract creation |
| connectionId         | Unique identifier for the blockchain connection |
| messageSchemaVersion | Messaging schema version |
| messageName          | **CreateContractRequest** |

Example:

``` json
{ 
    "requestId": "ce3c429b-a091-4baa-b29b-5b576162b211", 
    "userChainIdentifier": "0x9a8DDaCa9B7488683A4d62d0817E965E8f248398", 
    "applicationName": "AssetTransfer",
    "version": "1.0",
    "workflowName": "AssetTransfer", 
    "parameters": [ 
        { 
            "name": "description", 
            "value": "a 1969 dodge charger" 
        }, 
        { 
            "name": "price", 
            "value": "12345" 
        } 
    ], 
    "connectionId": 1, 
    "messageSchemaVersion": "1.0.0", 
    "messageName": "CreateContractRequest" 
}
```

Blockchain Workbench returns a response with the following fields:

| **Name**                 | **Description**                                                                   |
|--------------------------|-----------------------------------------------------------------------------------|
| requestId                | Client supplied GUID                                                             |
| contractId               | Unique identifier for the contract inside Azure Blockchain Workbench |
| contractLedgerIdentifier | Address of the contract on the ledger                                            |
| connectionId             | Unique identifier for the blockchain connection                               |
| messageSchemaVersion     | Messaging schema version                                                         |
| messageName              | **CreateContractUpdate**                                                      |
| status                   | Status of the contract creation request.  Possible values: **Submitted**, **Committed**, **Failure**.  |
| additionalInformation    | Additional information provided based on the status                              |

Example of a submitted **create contract** response from Blockchain Workbench:

``` json
{
    "requestId": "ce3c429b-a091-4baa-b29b-5b576162b211",
    "contractId": 55,
    "contractLedgerIdentifier": "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe",
    "connectionId": 1,
    "messageSchemaVersion": "1.0.0",
    "messageName": "CreateContractUpdate",
    "status": "Submitted",
    "additionalInformation": { }
}
```

Example of a committed **create contract** response from Blockchain Workbench:

``` json
{
    "requestId": "ce3c429b-a091-4baa-b29b-5b576162b211",
    "contractId": 55,
    "contractLedgerIdentifier": "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe",
    "connectionId": 1,
    "messageSchemaVersion": "1.0.0",
    "messageName": "CreateContractUpdate",
    "status": "Committed",
    "additionalInformation": { }
}
```

If the request was unsuccessful, details about the failure are included in additional information.

``` json
{
    "requestId": "ce3c429b-a091-4baa-b29b-5b576162b211",
    "contractId": 55,
    "contractLedgerIdentifier": null,
    "connectionId": 1,
    "messageSchemaVersion": "1.0.0",
    "messageName": "CreateContractUpdate",
    "status": "Failure",
    "additionalInformation": {
        "errorCode": 4000,
        "errorMessage": "Contract cannot be provisioned on connection."
    }
}
```

### Create contract action

Creates a new contract action.

The request requires the following fields:

| **Name**                 | **Description**                                                                                                           |
|--------------------------|---------------------------------------------------------------------------------------------------------------------------|
| requestId                | Client supplied GUID |
| userChainIdentifier      | Address of the user that was created on the blockchain network. In Ethereum, this address is the user’s **on chain** address. |
| contractLedgerIdentifier | Address of the contract on the ledger |
| version                  | Version of the application. Required if you have multiple versions of the application enabled. Otherwise, version is optional. For more information on application versioning, see [Azure Blockchain Workbench application versioning](version-app.md). |
| workflowFunctionName     | Name of the workflow function |
| parameters               | Parameters input for contract creation |
| connectionId             | Unique identifier for the blockchain connection |
| messageSchemaVersion     | Messaging schema version |
| messageName              | **CreateContractActionRequest** |

Example:

``` json
{
    "requestId": "a5530932-9d6b-4eed-8623-441a647741d3",
    "userChainIdentifier": "0x9a8DDaCa9B7488683A4d62d0817E965E8f248398",
    "contractLedgerIdentifier": "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe",
    "version": "1.0",
    "workflowFunctionName": "modify",
    "parameters": [
        {
            "name": "description",
            "value": "a 1969 dodge charger"
        },
        {
            "name": "price",
            "value": "12345"
        }
    ],
    "connectionId": 1,
    "messageSchemaVersion": "1.0.0",
    "messageName": "CreateContractActionRequest"
}
```

Blockchain Workbench returns a response with the following fields:

| **Name**              | **Description**                                                                   |
|-----------------------|-----------------------------------------------------------------------------------|
| requestId             | Client supplied GUID|
| contractId            | Unique identifier for the contract inside Azure Blockchain Workbench |
| connectionId          | Unique identifier for the blockchain connection |
| messageSchemaVersion  | Messaging schema version |
| messageName           | **CreateContractActionUpdate** |
| status                | Status of the contract action request. Possible values: **Submitted**, **Committed**, **Failure**.                         |
| additionalInformation | Additional information provided based on the status |

Example of a submitted **create contract action** response from Blockchain Workbench:

``` json
{
    "requestId": "a5530932-9d6b-4eed-8623-441a647741d3",
    "contractId": 105,
    "connectionId": 1,
    "messageSchemaVersion": "1.0.0",
    "messageName": "CreateContractActionUpdate",
    "status": "Submitted",
    "additionalInformation": { }
}
```

Example of a committed **create contract action** response from Blockchain Workbench:

``` json
{
    "requestId": "a5530932-9d6b-4eed-8623-441a647741d3",
    "contractId": 105,
    "connectionId": 1,
    "messageSchemaVersion": "1.0.0",
    "messageName": "CreateContractActionUpdate",
    "status": "Committed",
    "additionalInformation": { }
}
```

If the request was unsuccessful, details about the failure are included in additional information.

``` json
{
    "requestId": "a5530932-9d6b-4eed-8623-441a647741d3",
    "contractId": 105,
    "connectionId": 1,
    "messageSchemaVersion": "1.0.0",
    "messageName": "CreateContractActionUpdate",
    "status": "Failure",
    "additionalInformation": {
        "errorCode": 4000,
        "errorMessage": "Contract action cannot be provisioned on connection."
    }
}
```

### Input API error codes and messages

**Error code 4000: Bad request error**
- Invalid connectionId
- CreateUserRequest deserialization failed
- CreateContractRequest deserialization failed
- CreateContractActionRequest deserialization failed
- Application {identified by application name} does not exist
- Application {identified by application name} does not have workflow
- UserChainIdentifier does not exist
- Contract {identified by ledger identifier} does not exist
- Contract {identified by ledger identifier} does not have function {workflow function name}
- UserChainIdentifier does not exist

**Error code 4090: Conflict error**
- User already exists
- Contract already exists
- Contract action already exists

**Error code 5000: Internal server error**
- Exception messages

## Event notifications

Event notifications can be used to notify users and downstream systems of events that happen in Blockchain Workbench and the blockchain network it is connected to. Event notifications can be consumed directly in code or used with tools such as Logic Apps and Flow to trigger flow of data to downstream systems.

See [Notification message reference](#notification-message-reference)
for details of various messages that can be received.

### Consuming Event Grid events with Azure Functions

If a user wants to use Event Grid to be notified about events that happen in Blockchain Workbench, you can consume events from Event Grid by using Azure Functions.

1. Create an **Azure Function App** in the Azure portal.
2. Create a new function.
3. Locate the template for Event Grid. Basic template code for reading the message is shown. Modify the code as needed.
4. Save the Function. 
5. Select the Event Grid from Blockchain Workbench’s resource group.

### Consuming Event Grid events with Logic Apps

1. Create a new **Azure Logic App** in the Azure portal.
2. When opening the Azure Logic App in the portal, you will be prompted to select a trigger. Select **Azure Event Grid -- When a resource event occurs**.
3. When the workflow designer is displayed, you will be prompted to sign in.
4. Select the Subscription. Resource as **Microsoft.EventGrid.Topics**. Select the **Resource Name** from the name of the resource from the Azure Blockchain Workbench resource group.
5. Select the Event Grid from Blockchain Workbench's resource group.

## Using Service Bus Topics for notifications

Service Bus Topics can be used to notify users about events that happen in Blockchain Workbench. 

1. Browse to the Service Bus within the Workbench’s resource group.
2. Select **Topics**.
3. Select **egress-topic**.
4. Create a new subscription to this topic. Obtain a key for it.
5. Create a program, which subscribes to events from this subscription.

### Consuming Service Bus Messages with Logic Apps

1. Create a new **Azure Logic App** in the Azure portal.
2. When opening the Azure Logic App in the portal, you will be prompted to select a trigger. Type **Service Bus** into the search box and select the trigger appropriate for the type of interaction you want to have with the Service Bus. For example, **Service Bus -- When a message is received in a topic subscription (auto-complete)**.
3. When the workflow designer is displayed, specify the connection information for the Service Bus.
4. Select your subscription and specify the topic of **workbench-external**.
5. Develop the logic for your application that utilizes the message from
this trigger.

## Notification message reference

Depending on the **messageName**, the notification messages have one of the following message types.

### Block message

Contains information about individual blocks. The *BlockMessage* includes a section with block level information and a section with transaction information.

| Name | Description |
|------|-------------|
| block | Contains [block information](#block-information) |
| transactions | Contains a collection [transaction information](#transaction-information) for the block |
| connectionId | Unique identifier for the connection |
| messageSchemaVersion | Messaging schema version |
| messageName | **BlockMessage** |
| additionalInformation | Additional information provided |

#### Block information

| Name              | Description |
|-------------------|-------------|
| blockId           | Unique identifier for the block inside Azure Blockchain Workbench |
| blockNumber       | Unique identifier for a block on the ledger |
| blockHash         | The hash of the block |
| previousBlockHash | The hash of the previous block |
| blockTimestamp    | The timestamp of the block |

#### Transaction information

| Name               | Description |
|--------------------|-------------|
| transactionId      | Unique identifier for the transaction inside Azure Blockchain Workbench |
| transactionHash    | The hash of the transaction on the ledger |
| from               | Unique identifier on the ledger for the transaction origin |
| to                 | Unique identifier on the ledger for the transaction destination |
| provisioningStatus | Identifies the current status of the provisioning process for the transaction. Possible values are: </br>0 – The transaction has been created by the API in the database</br>1 – The transaction has been sent to the ledger</br>2 – The transaction has been successfully committed to the ledger</br>3 or 4 - The transaction failed to be committed to the ledger</br>5 - The transaction was successfully committed to the ledger |

Example of a *BlockMessage* from Blockchain Workbench:

``` json
{
    "block": {
        "blockId": 123,
        "blockNumber": 1738312,
        "blockHash": "0x03a39411e25e25b47d0ec6433b73b488554a4a5f6b1a253e0ac8a200d13fffff",
        "previousBlockHash": null,
        "blockTimestamp": "2018-10-09T23:35:58Z",
    },
    "transactions": [
        {
            "transactionId": 234,
            "transactionHash": "0xa4d9c95b581f299e41b8cc193dd742ef5a1d3a4ddf97bd11b80d123fec27ffff",
            "from": "0xd85e7262dd96f3b8a48a8aaf3dcdda90f60dffff",
            "to": null,
            "provisioningStatus": 1
        },
        {
            "transactionId": 235,
            "transactionHash": "0x5c1fddea83bf19d719e52a935ec8620437a0a6bdaa00ecb7c3d852cf92e1ffff",
            "from": "0xadd97e1e595916e29ea94fda894941574000ffff",
            "to": "0x9a8DDaCa9B7488683A4d62d0817E965E8f24ffff",
            "provisioningStatus": 2
        }
    ],
    "connectionId": 1,
    "messageSchemaVersion": "1.0.0",
    "messageName": "BlockMessage",
    "additionalInformation": {}
}
```

### Contract message

Contains information about a contract. The message includes a section with contract properties and a section with transaction information. All
transactions that have modified the contract for the particular block are included in the transaction section.

| Name | Description |
|------|-------------|
| blockId | Unique identifier for the block inside Azure Blockchain Workbench |
| blockHash | Hash of the block |
| modifyingTransactions | [Transactions that modified](#modifying-transaction-information) the contract |
| contractId | Unique identifier for the contract inside Azure Blockchain Workbench |
| contractLedgerIdentifier | Unique identifier for the contract on the ledger |
| contractProperties | [Properties of the contract](#contract-properties) |
| isNewContract | Indicates whether or not this contract was newly created. Possible values are: true: this contract was a new contract created. false: this contract is a contract update. |
| connectionId | Unique identifier for the connection |
| messageSchemaVersion | Messaging schema version |
| messageName | **ContractMessage** |
| additionalInformation | Additional information provided |

#### Modifying transaction information

| Name               | Description |
|--------------------|-------------|
| transactionId | Unique identifier for the transaction inside Azure Blockchain Workbench |
| transactionHash | The hash of the transaction on the ledger |
| from | Unique identifier on the ledger for the transaction origin |
| to | Unique identifier on the ledger for the transaction destination |

#### Contract properties

| Name               | Description |
|--------------------|-------------|
| workflowPropertyId | Unique identifier for the workflow property inside Azure Blockchain Workbench |
| name | Name of the workflow property |
| value | Value of the workflow property |

Example of a *ContractMessage* from Blockchain Workbench:

``` json
{
    "blockId": 123,
    "blockhash": "0x03a39411e25e25b47d0ec6433b73b488554a4a5f6b1a253e0ac8a200d13fffff",
    "modifyingTransactions": [
        {
            "transactionId": 234,
            "transactionHash": "0x5c1fddea83bf19d719e52a935ec8620437a0a6bdaa00ecb7c3d852cf92e1ffff",
            "from": "0xd85e7262dd96f3b8a48a8aaf3dcdda90f60dffff",
            "to": "0xf8559473b3c7197d59212b401f5a9f07ffff"
        },
        {
            "transactionId": 235,
            "transactionHash": "0xa4d9c95b581f299e41b8cc193dd742ef5a1d3a4ddf97bd11b80d123fec27ffff",
            "from": "0xd85e7262dd96f3b8a48a8aaf3dcdda90f60dffff",
            "to": "0xf8559473b3c7197d59212b401f5a9f07b429ffff"
        }
    ],
    "contractId": 111,
    "contractLedgerIdentifier": "0xf8559473b3c7197d59212b401f5a9f07b429ffff",
    "contractProperties": [
        {
            "workflowPropertyId": 1,
            "name": "State",
            "value": "0"
        },
        {
            "workflowPropertyId": 2,
            "name": "Description",
            "value": "1969 Dodge Charger"
        },
        {
            "workflowPropertyId": 3,
            "name": "AskingPrice",
            "value": "30000"
        },
        {
            "workflowPropertyId": 4,
            "name": "OfferPrice",
            "value": "0"
        },
        {
            "workflowPropertyId": 5,
            "name": "InstanceAppraiser",
            "value": "0x0000000000000000000000000000000000000000"
        },
        {
            "workflowPropertyId": 6,
            "name": "InstanceBuyer",
            "value": "0x0000000000000000000000000000000000000000"
        },
        {
            "workflowPropertyId": 7,
            "name": "InstanceInspector",
            "value": "0x0000000000000000000000000000000000000000"
        },
        {
            "workflowPropertyId": 8,
            "name": "InstanceOwner",
            "value": "0x9a8DDaCa9B7488683A4d62d0817E965E8f24ffff"
        },
        {
            "workflowPropertyId": 9,
            "name": "ClosingDayOptions",
            "value": "[21,48,69]"
        }
    ],
    "isNewContract": false,
    "connectionId": 1,
    "messageSchemaVersion": "1.0.0",
    "messageName": "ContractMessage",
    "additionalInformation": {}
}
```

### Event message: Contract function invocation

Contains information when a contract function is invoked, such as the function name, parameters input, and the caller of the function.

| Name | Description |
|------|-------------|
| eventName                   | **ContractFunctionInvocation** |
| caller                      | [Caller information](#caller-information) |
| contractId                  | Unique identifier for the contract inside Azure Blockchain Workbench |
| contractLedgerIdentifier    | Unique identifier for the contract on the ledger |
| functionName                | Name of the function |
| parameters                  | [Parameter information](#parameter-information) |
| transaction                 | Transaction information |
| inTransactionSequenceNumber | The sequence number of the transaction in the block |
| connectionId                | Unique identifier for the connection |
| messageSchemaVersion        | Messaging schema version |
| messageName                 | **EventMessage** |
| additionalInformation       | Additional information provided |

#### Caller information

| Name | Description |
|------|-------------|
| type | Type of the caller, like a user or a contract |
| id | Unique identifier for the caller inside Azure Blockchain Workbench |
| ledgerIdentifier | Unique identifier for the caller on the ledger |

#### Parameter information

| Name | Description |
|------|-------------|
| name | Parameter name |
| value | Parameter value |

#### Event message transaction information

| Name               | Description |
|--------------------|-------------|
| transactionId      | Unique identifier for the transaction inside Azure Blockchain Workbench |
| transactionHash    | The hash of the transaction on the ledger |
| from               | Unique identifier on the ledger for the transaction origin |
| to                 | Unique identifier on the ledger for the transaction destination |

Example of an *EventMessage ContractFunctionInvocation* from Blockchain Workbench:

``` json
{
    "eventName": "ContractFunctionInvocation",
    "caller": {
        "type": "User",
        "id": 21,
        "ledgerIdentifier": "0xd85e7262dd96f3b8a48a8aaf3dcdda90f60ffff"
    },
    "contractId": 34,
    "contractLedgerIdentifier": "0xf8559473b3c7197d59212b401f5a9f07b429ffff",
    "functionName": "Modify",
    "parameters": [
        {
            "name": "description",
            "value": "a new description"
        },
        {
            "name": "price",
            "value": "4567"
        }
    ],
    "transaction": {
        "transactionId": 234,
        "transactionHash": "0x5c1fddea83bf19d719e52a935ec8620437a0a6bdaa00ecb7c3d852cf92e1ffff",
        "from": "0xd85e7262dd96f3b8a48a8aaf3dcdda90f60dffff",
        "to": "0xf8559473b3c7197d59212b401f5a9f07b429ffff"
    },
    "inTransactionSequenceNumber": 1,
    "connectionId": 1,
    "messageSchemaVersion": "1.0.0",
    "messageName": "EventMessage",
    "additionalInformation": { }
}
```

### Event message: Application ingestion

Contains information when an application is uploaded to Workbench, such as the name and version of the application uploaded.

| Name | Description |
|------|-------------|
| eventName | **ApplicationIngestion** |
| applicationId | Unique identifier for the application inside Azure Blockchain Workbench |
| applicationName | Application name |
| applicationDisplayName | Application display name |
| applicationVersion | Application version |
| applicationDefinitionLocation | URL where the application configuration file is located |
| contractCodes | Collection of [contract codes](#contract-code-information) for the application |
| applicationRoles | Collection of [application roles](#application-role-information) for the application |
| applicationWorkflows | Collection of [application workflows](#application-workflow-information) for the application |
| connectionId | Unique identifier for the connection |
| messageSchemaVersion | Messaging schema version |
| messageName | **EventMessage** |
| additionalInformation | Additional information provided here includes the application workflow states and transition information. |

#### Contract code information

| Name | Description |
|------|-------------|
| id | Unique identifier for the contract code file inside Azure Blockchain Workbench |
| ledgerId | Unique identifier for the ledger inside Azure Blockchain Workbench |
| location | URL where the contract code file is located |

#### Application role information

| Name | Description |
|------|-------------|
| id | Unique identifier for the application role inside Azure Blockchain Workbench |
| name | Name of the application role |

#### Application workflow information

| Name | Description |
|------|-------------|
| id | Unique identifier for the application workflow inside Azure Blockchain Workbench |
| name | Application workflow name |
| displayName | Application workflow display name |
| functions | Collection of [functions for the application workflow](#workflow-function-information)|
| states | Collection of [states for the application workflow](#workflow-state-information) |
| properties | Application [workflow properties information](#workflow-property-information) |

##### Workflow function information

| Name | Description |
|------|-------------|
| id | Unique identifier for the application workflow function inside Azure Blockchain Workbench |
| name | Function name |
| parameters | Parameters for the function |

##### Workflow state information

| Name | Description |
|------|-------------|
| name | State name |
| displayName | State display name |
| style | State style (success or failure) |

##### Workflow property information

| Name | Description |
|------|-------------|
| id | Unique identifier for the application workflow property inside Azure Blockchain Workbench |
| name | Property name |
| type | Property type |

Example of an *EventMessage ApplicationIngestion* from Blockchain Workbench:

``` json
{
    "eventName": "ApplicationIngestion",
    "applicationId": 31,
    "applicationName": "AssetTransfer",
    "applicationDisplayName": "Asset Transfer",
    "applicationVersion": “1.0”,
    "applicationDefinitionLocation": "http://url",
    "contractCodes": [
        {
            "id": 23,
            "ledgerId": 1,
            "location": "http://url"
        }
    ],
    "applicationRoles": [
            {
                "id": 134,
                "name": "Buyer"
            },
            {
                "id": 135,
                "name": "Seller"
            }
       ],
    "applicationWorkflows": [
        {
            "id": 89,
            "name": "AssetTransfer",
            "displayName": "Asset Transfer",
            "functions": [
                {
                    "id": 912,
                    "name": "",
                    "parameters": [
                        {
                            "name": "description",
                            "type": {
                                "name": "string"
                             }
                        },
                        {
                            "name": "price",
                            "type": {
                                "name": "int"
                            }
                        }
                    ]
                },
                {
                    "id": 913,
                    "name": "modify",
                    "parameters": [
                        {
                            "name": "description",
                            "type": {
                                "name": "string"
                             }
                        },
                        {
                            "name": "price",
                            "type": {
                                "name": "int"
                            }
                        }
                    ]
                }
            ],
            "states": [ 
                 {
                      "name": "Created",
                      "displayName": "Created",
                      "style" : "Success"
                 },
                 {
                      "name": "Terminated",
                      "displayName": "Terminated",
                      "style" : "Failure"
                 }
            ],
            "properties": [
                {
                    "id": 879,
                    "name": "Description",
                    "type": {
                                "name": "string"
                     }
                },
                {
                    "id": 880,
                    "name": "Price",
                    "type": {
                                "name": "int"
                     }
                }
            ]
        }
    ],
    "connectionId": [ ],
    "messageSchemaVersion": "1.0.0",
    "messageName": "EventMessage",
    "additionalInformation":
        {
            "states" :
            [
                {
                    "Name": "BuyerAccepted",
                    "Transitions": [
                        {
                            "DisplayName": "Accept",
                            "AllowedRoles": [ ],
                            "AllowedInstanceRoles": [ "InstanceOwner" ],
                            "Function": "Accept",
                            "NextStates": [ "SellerAccepted" ]
                        }
                    ]
                }
            ]
        }
}
```

### Event message: Role assignment

Contains information when a user is assigned a role in Workbench, such as who performed the role assignment and the name of the role and corresponding application.

| Name | Description |
|------|-------------|
| eventName | **RoleAssignment** |
| applicationId | Unique identifier for the application inside Azure Blockchain Workbench |
| applicationName | Application name |
| applicationDisplayName | Application display name |
| applicationVersion | Application version |
| applicationRole        | Information about the [application role](#roleassignment-application-role) |
| assigner               | Information about the [assigner](#roleassignment-assigner) |
| assignee               | Information about the [assignee](#roleassignment-assignee) |
| connectionId           | Unique identifier for the connection |
| messageSchemaVersion   | Messaging schema version |
| messageName            | **EventMessage** |
| additionalInformation  | Additional information provided |

#### RoleAssignment application role

| Name | Description |
|------|-------------|
| id | Unique identifier for the application role inside Azure Blockchain Workbench |
| name | Name of the application role |

#### RoleAssignment assigner

| Name | Description |
|------|-------------|
| id | Unique identifier of the user inside Azure Blockchain Workbench |
| type | Type of the assigner |
| chainIdentifier | Unique identifier of the user on the ledger |

#### RoleAssignment assignee

| Name | Description |
|------|-------------|
| id | Unique identifier of the user inside Azure Blockchain Workbench |
| type | Type of the assignee |
| chainIdentifier | Unique identifier of the user on the ledger |

Example of an *EventMessage RoleAssignment* from Blockchain Workbench:

``` json
{
    "eventName": "RoleAssignment",
    "applicationId": 31,
    "applicationName": "AssetTransfer",
    "applicationDisplayName": "Asset Transfer",
    "applicationVersion": “1.0”,
    "applicationRole": {
        "id": 134,
        "name": "Buyer"
    },
    "assigner": {
        "id": 1,
        "type": null,
        "chainIdentifier": "0xeFFC7766d38aC862d79706c3C5CEEf089564ffff"
    },
    "assignee": {
        "id": 3,
        "type": null,
        "chainIdentifier": "0x9a8DDaCa9B7488683A4d62d0817E965E8f24ffff"
    },
    "connectionId": [ ],
    "messageSchemaVersion": "1.0.0",
    "messageName": "EventMessage",
    "additionalInformation": { }
}
```

## Next steps

- [Smart contract integration patterns](integration-patterns.md)
