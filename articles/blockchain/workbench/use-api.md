---
title: Using Azure Blockchain Workbench REST API 
description: Scenarios for how to use the Azure Blockchain Workbench REST API
services: azure-blockchain
keywords: 
author: PatAltimore
ms.author: patricka
ms.date: 10/1/2018
ms.topic: article
ms.service: azure-blockchain
ms.reviewer: zeyadr
manager: femila
#customer intent: As a developer, I want to understand the  Azure Blockchain Workbench REST API to so that I can integrate apps with Blockchain Workbench.
---
# Using the Azure Blockchain Workbench REST API 

Azure Blockchain Workbench REST API provides developers and information workers a way to build rich integrations to blockchain applications. This document walks you through several key methods of the Workbench REST API. Consider a scenario where a developer wants to create a custom blockchain client, which allows signed in users to view and interact with their assigned blockchain applications. The client allows users to view contract instances and take actions on smart contracts. The client uses the Workbench REST API in the context of the signed-in user to do the following:

* List applications
* List workflows for an application
* List smart contract instances for a workflow
* List available actions for a contract
* Execute an action for a contract

The example blockchain applications used in the scenarios, can be [downloaded from GitHub](https://github.com/Azure-Samples/blockchain). 

## List applications

Once a user has signed into the blockchain client, the first task is to retrieve all Blockchain Workbench applications for the user. In this scenario, the user has access to two applications:

1.  [Asset transfer](https://github.com/Azure-Samples/blockchain/blob/master/blockchain-workbench/application-and-smart-contract-samples/asset-transfer/readme.md)
2.  [Refrigerated transportation](https://github.com/Azure-Samples/blockchain/blob/master/blockchain-workbench/application-and-smart-contract-samples/refrigerated-transportation/readme.md)

Use the [Applications GET API](https://docs.microsoft.com/rest/api/azure-blockchain-workbench/applications/applicationsget):

``` http
GET /api/v1/applications 
Authorization : Bearer {access token}
```

The response lists all blockchain applications to which a user has access in Blockchain Workbench. Blockchain Workbench administrators get all blockchain applications, while non-Workbench administrators get all blockchains for which they have at least one associated application role or an associated smart contract instance role.

``` http
HTTP/1.1 200 OK
Content-type: application/json
{
    "nextLink": "/api/v1/applications?skip=2",
    "applications": [
        {
            "id": 1,
            "name": "AssetTransfer",
            "description": "Allows transfer of assets between a buyer and a seller, with appraisal/inspection functionality",
            "displayName": "Asset Transfer",
            "createdByUserId": 1,
            "createdDtTm": "2018-04-28T05:59:14.4733333",
            "enabled": true,
            "applicationRoles": null
        },
        {
            "id": 2,
            "name": "RefrigeratedTransportation",
            "description": "Application to track end-to-end transportation of perishable goods.",
            "displayName": "Refrigerated Transportation",
            "createdByUserId": 7,
            "createdDtTm": "2018-04-28T18:25:38.71",
            "enabled": true,
            "applicationRoles": null
        }
    ]
}
```

## List workflows for an application

Once a user selects the applicable blockchain application, in this case, **Asset Transfer**, the blockchain client retrieves all workflows of the specific blockchain application. Users can then select the applicable workflow before being shown all smart contract instances for the workflow. Each blockchain application has one or more workflows and each workflow has zero or smart contract instances. When building blockchain client applications, it is recommended to skip the user experience flow allowing users to select the appropriate workflow when there is only one workflow for the blockchain application. In this case, **Asset Transfer** has only one workflow, also called **Asset Transfer**.

Use the [Applications Workflows GET API](https://docs.microsoft.com/rest/api/azure-blockchain-workbench/applications/workflowsget):

``` http
GET /api/v1/applications/{applicationId}/workflows
Authorization: Bearer {access token}
```

Response lists all workflows of the specified blockchain application to which a user has access in Blockchain Workbench. Blockchain Workbench administrators get all blockchain workflows, while non-Workbench administrators get all workflows for which they have at least one associated application role or is associated with a smart contract instance role.

``` http
HTTP/1.1 200 OK
Content-type: application/json
{
    "nextLink": "/api/v1/applications/1/workflows?skip=1",
    "workflows": [
        {
            "id": 1,
            "name": "AssetTransfer",
            "description": "Handles the business logic for the asset transfer scenario",
            "displayName": "Asset Transfer",
            "applicationId": 1,
            "constructorId": 1,
            "startStateId": 1
        }
    ]
}
```

## List smart contract instances for a workflow

Once a user selects the applicable workflow, this case **Asset Transfer**, the blockchain client will retrieve all smart contract instances for the specified workflow. You can use this information to show all smart contract instances for the workflow and allow users to deep dive into any of the shown smart contract instances. In this example, consider a user would like to interact with one of the smart contract instances to take action.

Use the [Contracts GET API](https://docs.microsoft.com/rest/api/azure-blockchain-workbench/contracts/contractsget):

``` http
GET api/v1/contracts?workflowId={workflowId}
Authorization: Bearer {access token}
```

Response lists all smart contract instances of the specified workflow. Workbench administrators get all smart contract instances, while non-Workbench administrators get all smart contract instances for which they have at least one associated application role or is associated with a smart contract instance role.

``` http
HTTP/1.1 200 OK
Content-type: application/json
{
    "nextLink": "/api/v1/contracts?skip=3&workflowId=1",
    "contracts": [
        {
            "id": 1,
            "provisioningStatus": 2,
            "connectionID": 1,
            "ledgerIdentifier": "0xbcb6127be062acd37818af290c0e43479a153a1c",
            "deployedByUserId": 1,
            "workflowId": 1,
            "contractCodeId": 1,
            "contractProperties": [
                {
                    "workflowPropertyId": 1,
                    "value": "0"
                },
                {
                    "workflowPropertyId": 2,
                    "value": "My first car"
                },
                {
                    "workflowPropertyId": 3,
                    "value": "54321"
                },
                {
                    "workflowPropertyId": 4,
                    "value": "0"
                },
                {
                    "workflowPropertyId": 5,
                    "value": "0x0000000000000000000000000000000000000000"
                },
                {
                    "workflowPropertyId": 6,
                    "value": "0x0000000000000000000000000000000000000000"
                },
                {
                    "workflowPropertyId": 7,
                    "value": "0x0000000000000000000000000000000000000000"
                },
                {
                    "workflowPropertyId": 8,
                    "value": "0xd882530eb3d6395e697508287900c7679dbe02d7"
                }
            ],
            "transactions": [
                {
                    "id": 1,
                    "connectionId": 1,
                    "transactionHash": "0xf3abb829884dc396e03ae9e115a770b230fcf41bb03d39457201449e077080f4",
                    "blockID": 241,
                    "from": "0xd882530eb3d6395e697508287900c7679dbe02d7",
                    "to": null,
                    "value": 0,
                    "isAppBuilderTx": true
                }
            ],
            "contractActions": [
                {
                    "id": 1,
                    "userId": 1,
                    "provisioningStatus": 2,
                    "timestamp": "2018-04-29T23:41:14.9333333",
                    "parameters": [
                        {
                            "name": "Description",
                            "value": "My first car"
                        },
                        {
                            "name": "Price",
                            "value": "54321"
                        }
                    ],
                    "workflowFunctionId": 1,
                    "transactionId": 1,
                    "workflowStateId": 1
                }
            ]
        }
    ]
}
```

## List available actions for a contract

Once a user has decided to deep dive into one of the contracts, the blockchain client can then show all available actions to the user given the state of the contract. In this example, the user is looking at all available actions for a new smart contract they created:

* Modify: Allows the user to modify the description and price of an asset.
* Terminate: Allows the user to terminate the contract of the asset.

Use the [Contract Action GET API](https://docs.microsoft.com/rest/api/azure-blockchain-workbench/contracts/contractactionget):

``` http
GET /api/v1/contracts/{contractId}/actions
Authorization: Bearer {access token}
```

Response lists all actions to which a user can take given the current state of the specified smart contract instance. Users get all applicable actions if the user has an associated application role or is associated with a smart contract instance role for the current state of the specified smart contract instance.

``` http
HTTP/1.1 200 OK
Content-type: application/json
{
    "nextLink": "/api/v1/contracts/1/actions?skip=2",
    "workflowFunctions": [
        {
            "id": 2,
            "name": "Modify",
            "description": "Modify the description/price attributes of this asset transfer instance",
            "displayName": "Modify",
            "parameters": [
                {
                    "id": 1,
                    "name": "description",
                    "description": "The new description of the asset",
                    "displayName": "Description",
                    "type": {
                        "id": 2,
                        "name": "string",
                        "elementType": null,
                        "elementTypeId": 0
                    }
                },
                {
                    "id": 2,
                    "name": "price",
                    "description": "The new price of the asset",
                    "displayName": "Price",
                    "type": {
                        "id": 3,
                        "name": "money",
                        "elementType": null,
                        "elementTypeId": 0
                    }
                }
            ],
            "workflowId": 1
        },
        {
            "id": 3,
            "name": "Terminate",
            "description": "Used to cancel this particular instance of asset transfer",
            "displayName": "Terminate",
            "parameters": [],
            "workflowId": 1
        }
    ]
}
```

## Execute an action for a contract

A user can then decide to take action for the specified smart contract instance. In this case, consider the scenario where a user would like to modify the description and price of an asset to the following:

* Description: "My updated car"
* Price: 54321

Use the [Contract Action POST API](https://docs.microsoft.com/rest/api/azure-blockchain-workbench/contracts/contractactionpost):

``` http
POST /api/v1/contracts/{contractId}/actions
Authorization: Bearer {access token}
actionInformation: {
    "workflowFunctionId": 2,
    "workflowActionParameters": [
        {
            "name": "description",
            "value": "My updated car"
        },
        {
            "name": "price",
            "value": "54321"
        }
    ]
}
```

Users are only able to execute the action given the current state of the specified smart contract instance and the user's associated application role or smart contract instance role. If the post is successful, an HTTP 200 OK response is returned with no response body.

``` http
HTTP/1.1 200 OK
Content-type: application/json
```

## Next steps

> [!div class="nextstepaction"]
> [Azure Blockchain Workbench REST API reference](https://docs.microsoft.com/rest/api/azure-blockchain-workbench)