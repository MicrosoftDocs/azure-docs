---
title: App Builder Configuration Reference - Azure Blockchain
description: Azure Blockchain App Builder configuration overview and reference.
# services: service-name-with-dashes-AZURE-ONLY
keywords: 
author: PatAltimore
ms.author: patricka
ms.date: 3/20/2018
ms.topic: article
# Use only one of the following. Use ms.service for services, ms.prod for on-prem. Remove the # before the relevant field.
# ms.service: service-name-from-white-list
# product-name-from-white-list

# ms.custom: mvc
ms.reviewer: zeyadr
manager: zeyadr
---
# Azure Blockchain App Builder Configuration Reference

Blockchain apps in app builder consist of two core pieces. configuration and business logic (one or more smart contracts)

configuration is the representation of the application as one or more workflows. The app and workflow is a state machine.  You have different states. Roles can take different actions depending on the state. Once you have defined that these applications can consist of one or more workflows.

for your configuration you can have one or more smart contract files that codify the configuration / workflow representation.  The smart contract is written in the appropriate language of the specified blockchain stack. solidity for etherium. go for hyperledger fabric. you can have one or more files that represent your business logic code.

The setup information for the application built in App Builder, such as states and user permissions

REVISED: A file detailing the properties, states, actions and parameters, role permissions, and other specifications for the [smart contract(s)] in the application

{The arrangement of parts, options, or features to produce a product that meets a specification, such as a customer order.}

{image}

App builder uses configuration schema to define blockchain applications and represents them as state machines. 

Represents the application, the associated workflows, the state machine for each workflow, the roles that can particpate in those workflows.  the actions the roles can take at specific states. And provides hints to the UI to UI consumers for visually representing content on the blockchain. 

represent state machine.  Action 1 has a table representing actions to next states.
## Application

The application is comprised of one or more smart contracts and a configuration file that describes them.  The files are uploaded to the associated App Builder’s storage and SQL DB services via the Gateway API. 

| Field | Description | Required | Sample value  |
|-------|-------------|:--------:|---------------|
| ApplicationName | Unique app name | Y | AssetTransfer |
| DisplayName | Friendly display name | Y | Asset Transfer |
| Description | Descriptive text | N | Transfer of assets between a buyer and seller |
| ApplicationRoles | Collection of [ApplicationRoles](#application-roles) | Y | Appraiser, Buyer |
| Workflows | Collection of  [Workflows](#workflows) | Y | AssetTransfer |

## Workflows

 An application consists of one or more workflows. Each workflow consists of one or more smart contracts.

| Field | Description | Required | Sample value  |
|-------|-------------|:--------:|---------------|
| Name | Unique name | Y | AssetTransfer |
| DisplayName | Friendly display name | Y |Asset Transfer|
| Description | Descriptive text | N | Business logic for the asset transfer scenario |
| Initiators | Collection of [ApplicationRoles](#application-roles) | Y | Owner |
| StartState | The initial state of the smart contract | Y | Active |
| Properties | Collection of [identifiers](#identifiers) declared for the smart contract | Y | State |
| [Constructor](#constructor) | Defines input parameters for creating a smart contract instance | Y | For sample, see [constructor](#constructor) |
| Functions | A collection of [functions](#functions) that can be executed on the smart contract. | N | Modify |
| States | A collection smart contract [states](#states). | Y | For sample, see [states](#states) |

## Constructor

Defines input parameters for a new instance of a smart contract.

| Field | Description | Required | Sample value  |
|-------|-------------|:--------:|---------------|
| Parameters | Collection of [identifiers](#identifiers) required to initiate a smart contract. | Y | price |
| Description | Descriptive text | N | Constructor for asset transfer? |
| Preconditions | Collection of [expressions](#expressions) that define requirements verified prior to constructing the smart contract instance? | N | `Equal(Properties('InstanceOwner'), Parameters('sender'))` |
| Postconditions | Collection of [expressions](#expressions) that define requirements verified after constructing the smart contract instance? | N | `Equal(Properties('AskingPrice'), Parameters('price'))` |

## Functions

Functions that can be executied on the smart contract.

| Field | Description | Required | Sample value  |
|-------|-------------|:--------:|---------------|
| Name | Unique name | Y | Modify |
| DisplayName | Friendly display name | Y | Modify |
| Description | Descriptive text | N | Modify the description/price attributes |
| Parameters | Collection of [identifiers](#identifiers) required to initiate a smart contract. | Y | description, price |
| Preconditions | Collection of [expressions](#expressions) that define requirements verified prior to executing the function? | N | `Equal(Properties('InstanceOwner'), Parameters('sender'))` |
| Postconditions | Collection of [expressions](#expressions) that define requirements verified after executing the function? | N | `Equal(Properties('AskingPrice'), Parameters('price'))` |

## States

A collection smart contract states.

| Field | Description | Required | Sample value  |
|-------|-------------|:--------:|---------------|
| Name | Unique name | Y | Active |
| DisplayName | Friendly display name | Y | Active |
| Description | Descriptive text | N | The initial state of the asset transfer workflow |
| PercentComplete | Value representing the percent completion at this state. | Y | 20 |
| Value | Order of the state - probably going away (calculated) | Y | 0 |
| Style | Guessing some kind of representation in UI | Y | Success |
| Transitions | Collection of available [transitions](#transitions) to the next state. | N | For sample, see [transitions](#transitions) |

## Transitions

Available actions to the next state.

| Field | Description | Required | Sample value  |
|-------|-------------|:--------:|---------------|
| AllowedRoles | List of roles allowed to initiate the transition? | N | Buyer |
| AllowedInstanceRoles | List of instance roles allowed to initiate the transition? | N | InstanceOwner |
| DisplayName | Friendly display name | Y | Make Offer |
| Description | Descriptive text | N | Make an offer for this asset |
| Function | Function to initiate for transition | Y | MakeOffer |
| NextState | Next contract state after transition | Y | OfferPlaced |

## Application Roles

Application roles control access by assigning users to actions in the workflow.

| Field | Description | Required | Sample value  |
|-------|-------------|:--------:|---------------|
| Name | Unique name | Y | Appraiser |
| Description | Descriptive text | N | User that signs off on the asset price |

## Identifiers

| Field | Description | Required | Sample value  |
|-------|-------------|:--------:|---------------|
| Name | Unique name | Y | AskingPrice |
| DisplayName | Friendly display name | Y | Asking Price |
| Description | Descriptive text | N | The asking price for the asset |
| Type | Collection of data types | Y | money |

## Expressions

An explaination of expressions.  Need to outline the syntax.

| Field | Description | Required | Sample value  |
|-------|-------------|:--------:|---------------|
| Expression | Expression to evaluate | Y | `Equal(Properties('InstanceOwner'), Parameters('sender'))` |
| Description | Descriptive text | N | Verify the sender is the instance owner? |

## Example configuration file

``` json
{
  "ApplicationName": "AssetTransfer",
  "DisplayName": "Asset Transfer",
  "Description": "Allows transfer of assets between a buyer and a seller, with appraisal/inspection functionality",
  "ApplicationRoles": [
    {
      "Name": "Appraiser",
      "Description": "User that signs off on the asset price"
    },
    {
      "Name": "Buyer",
      "Description": "User that places an offer on an asset"
    },
    {
      "Name": "Inspector",
      "Description": "User that inpsects the asset and signs off on inspection"
    },
    {
      "Name": "Owner",
      "Description": "User that signs off on the asset price"
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
        },
        {
          "Name": "Description",
          "DisplayName": "Description",
          "Description": "Describes the asset being sold",
          "Type": {
            "Name": "string"
          }
        },
        {
          "Name": "AskingPrice",
          "DisplayName": "Asking Price",
          "Description": "The asking price for the asset",
          "Type": {
            "Name": "money"
          }
        },
        {
          "Name": "OfferPrice",
          "DisplayName": "Offer Price",
          "Description": "The price being offered for the asset",
          "Type": {
            "Name": "money"
          }
        },
        {
          "Name": "InstanceAppraiser",
          "DisplayName": "Instance Appraiser",
          "Description": "The user that appraises the asset",
          "Type": {
            "Name": "Appraiser"
          }
        },
        {
          "Name": "InstanceBuyer",
          "DisplayName": "Instance Buyer",
          "Description": "The user that places an offer for this asset",
          "Type": {
            "Name": "Buyer"
          }
        },
        {
          "Name": "InstanceInspector",
          "DisplayName": "Instance Inspector",
          "Description": "The user that inspects this asset",
          "Type": {
            "Name": "Inspector"
          }
        },
        {
          "Name": "InstanceOwner",
          "DisplayName": "Instance Owner",
          "Description": "The seller of this particular asset",
          "Type": {
            "Name": "Owner"
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
          },
          {
            "Name": "price",
            "Description": "The price of this asset",
            "DisplayName": "Price",
            "Type": {
              "Name": "money"
            }
          }
        ],
        "Postconditions": [
          {
            "Expression": "Equal(Properties('Description'), Parameters('description'))"
          },
          {
            "Expression": "Equal(Properties('AskingPrice'), Parameters('price'))"
          },
          {
            "Expression": "Equal(Properties('InstanceOwner'), Parameters('sender'))"
          }
        ]
      },
      "Functions": [
        {
          "Name": "Modify",
          "DisplayName": "Modify",
          "Description": "Modify the description/price attributes of this asset transfer instance",
          "Parameters": [
            {
              "Name": "description",
              "Description": "The new description of the asset",
              "DisplayName": "Description",
              "Type": {
                "Name": "string"
              }
            },
            {
              "Name": "price",
              "Description": "The new price of the asset",
              "DisplayName": "Price",
              "Type": {
                "Name": "money"
              }
            }
          ],
          "Postconditions": [
            {
              "Expression": "Equal(Properties('Description'), Parameters('description'))"
            },
            {
              "Expression": "Equal(Properties('AskingPrice'), Parameters('price'))"
            }
          ]
        },
        {
          "Name": "Terminate",
          "DisplayName": "Terminate",
          "Description": "Used to cancel this particular instance of asset transfer",
          "Parameters": []
        },
        {
          "Name": "MakeOffer",
          "DisplayName": "Make Offer",
          "Description": "Place an offer for this asset",
          "Preconditions": [
            {
              "Expression": "Not(IsNull(Parameters('inspector')))"
            },
            {
              "Expression": "Not(IsNull(Parameters('appraiser')))"
            },
            {
              "Expression": "NotEqual(Parameters('offerPrice'), 0)"
            }
          ],
          "Parameters": [
            {
              "Name": "inspector",
              "Description": "Specify a user to inspect this asset",
              "DisplayName": "Inspector",
              "Type": {
                "Name": "Inspector"
              }
            },
            {
              "Name": "appraiser",
              "Description": "Specify a user to appraise this asset",
              "DisplayName": "Appraiser",
              "Type": {
                "Name": "Appraiser"
              }
            },
            {
              "Name": "offerPrice",
              "Description": "Specify your offer price for this asset",
              "DisplayName": "Offer Price",
              "Type": {
                "Name": "money"
              }
            }
          ],
          "Postconditions": [
            {
              "Expression": "Equal(Properties('InstanceInspector'), Parameters('inspector'))"
            },
            {
              "Expression": "Equal(Properties('InstanceAppraiser'), Parameters('appraiser'))"
            },
            {
              "Expression": "Equal(Properties('OfferPrice'), Parameters('offerPrice'))"
            },
            {
              "Expression": "Equal(Properties('InstanceBuyer'), Parameters('sender'))"
            }
          ]
        },
        {
          "Name": "Reject",
          "DisplayName": "Reject",
          "Description": "Reject the user's offer",
          "Parameters": []
        },
        {
          "Name": "AcceptOffer",
          "DisplayName": "Accept Offer",
          "Description": "Accept the user's offer",
          "Parameters": []
        },
        {
          "Name": "RescindOffer",
          "DisplayName": "Rescind Offer",
          "Description": "Rescind your placed offer",
          "Parameters": []
        },
        {
          "Name": "ModifyOffer",
          "DisplayName": "Modify Offer",
          "Description": "Modify the price of your placed offer",
          "Parameters": [
            {
              "Name": "offerPrice",
              "DisplayName": "Price",
              "Type": {
                "Name": "money"
              }
            }
          ],
          "Postconditions": [
            {
              "Expression": "Equal(Properties('OfferPrice'), Parameters('offerPrice'))"
            }
          ]
        },
        {
          "Name": "Accept",
          "DisplayName": "Accept",
          "Description": "Accept the inspection/appraisal results",
          "Parameters": []
        },
        {
          "Name": "MarkInspected",
          "DisplayName": "Mark Inspected",
          "Description": "Mark the asset as inspected",
          "Parameters": []
        },
        {
          "Name": "MarkAppraised",
          "DisplayName": "Mark Appraised",
          "Description": "Mark the asset as appraised",
          "Parameters": []
        }
      ],
      "States": [
        {
          "Name": "Active",
          "DisplayName": "Active",
          "Description": "The initial state of the asset transfer workflow",
          "PercentComplete": 20,
          "Value": 0,
          "Style": "Success",
          "Transitions": [
            {
              "AllowedRoles": [],
              "AllowedInstanceRoles": [ "InstanceOwner" ],
              "Description": "Cancels this instance of asset transfer",
              "Function": "Terminate",
              "NextState": "Terminated",
              "DisplayName": "Terminate Offer"
            },
            {
              "AllowedRoles": [ "Buyer" ],
              "AllowedInstanceRoles": [],
              "Description": "Make an offer for this asset",
              "Function": "MakeOffer",
              "NextState": "OfferPlaced",
              "DisplayName": "Make Offer"
            },
            {
              "AllowedRoles": [],
              "AllowedInstanceRoles": [ "InstanceOwner" ],
              "Description": "Modify attributes of this asset transfer instance",
              "Function": "Modify",
              "NextState": "Active",
              "DisplayName": "Modify"
            }
          ]
        },
        {
          "Name": "OfferPlaced",
          "DisplayName": "Offer Placed",
          "Description": "Offer has been placed for the asset",
          "PercentComplete": 30,
          "Style": "Success",
          "Value": 1,
          "Transitions": [
            {
              "AllowedRoles": [],
              "AllowedInstanceRoles": [ "InstanceOwner" ],
              "Description": "Accept the proposed offer for the asset",
              "Function": "AcceptOffer",
              "NextState": "PendingInspection",
              "DisplayName": "Accept Offer"
            },
            {
              "AllowedRoles": [],
              "AllowedInstanceRoles": [ "InstanceOwner" ],
              "Description": "Reject the proposed offer for the asset",
              "Function": "Reject",
              "NextState": "Active",
              "DisplayName": "Reject"
            },
            {
              "AllowedRoles": [],
              "AllowedInstanceRoles": [ "InstanceOwner" ],
              "Description": "Cancel this instance of asset transfer",
              "Function": "Terminate",
              "NextState": "Terminated",
              "DisplayName": "Terminate"
            },
            {
              "AllowedRoles": [],
              "AllowedInstanceRoles": [ "InstanceBuyer" ],
              "Description": "Rescind the offer you previously placed for this asset",
              "Function": "RescindOffer",
              "NextState": "Active",
              "DisplayName": "Rescind Offer"
            },
            {
              "AllowedRoles": [],
              "AllowedInstanceRoles": [ "InstanceBuyer" ],
              "Description": "Modify the price that you specified for your offer",
              "Function": "ModifyOffer",
              "NextState": "OfferPlaced",
              "DisplayName": "Modify Offer"
            }
          ]
        },
        {
          "Name": "PendingInspection",
          "DisplayName": "Pending Inspection",
          "Description": "Asset is pending inspection",
          "PercentComplete": 40,
          "Style": "Success",
          "Value": 2,
          "Transitions": [
            {
              "AllowedRoles": [],
              "AllowedInstanceRoles": [ "InstanceOwner" ],
              "Description": "Reject the offer",
              "Function": "Reject",
              "NextState": "Active",
              "DisplayName": "Reject"
            },
            {
              "AllowedRoles": [],
              "AllowedInstanceRoles": [ "InstanceOwner" ],
              "Description": "Cancel the offer",
              "Function": "Terminate",
              "NextState": "Terminated",
              "DisplayName": "Terminate"
            },
            {
              "AllowedRoles": [],
              "AllowedInstanceRoles": [ "InstanceBuyer" ],
              "Description": "Rescind the offer you placed for this asset",
              "Function": "RescindOffer",
              "NextState": "Active",
              "DisplayName": "Rescind Offer"
            },
            {
              "AllowedRoles": [],
              "AllowedInstanceRoles": [ "InstanceInspector" ],
              "Description": "Mark this asset as inspected",
              "Function": "MarkInspected",
              "NextState": "Inspected",
              "DisplayName": "Mark Inspected"
            },
            {
              "AllowedRoles": [],
              "AllowedInstanceRoles": [ "InstanceAppraiser" ],
              "Description": "Mark this asset as appraised",
              "Function": "MarkAppraised",
              "NextState": "Appraised",
              "DisplayName": "Mark Appraised"
            }
          ]
        },
        {
          "Name": "Inspected",
          "DisplayName": "Inspected",
          "PercentComplete": 45,
          "Style": "Success",
          "Value": 3,
          "Transitions": [
            {
              "AllowedRoles": [],
              "AllowedInstanceRoles": [ "InstanceOwner" ],
              "Description": "Reject the offer",
              "Function": "Reject",
              "NextState": "Active",
              "DisplayName": "Reject"
            },
            {
              "AllowedRoles": [],
              "AllowedInstanceRoles": [ "InstanceOwner" ],
              "Description": "Cancel the offer",
              "Function": "Terminate",
              "NextState": "Terminated",
              "DisplayName": "Terminate"
            },
            {
              "AllowedRoles": [],
              "AllowedInstanceRoles": [ "InstanceBuyer" ],
              "Description": "Rescind the offer you placed for this asset",
              "Function": "RescindOffer",
              "NextState": "Active",
              "DisplayName": "Rescind Offer"
            },
            {
              "AllowedRoles": [],
              "AllowedInstanceRoles": [ "InstanceAppraiser" ],
              "Description": "Mark this asset as appraised",
              "Function": "MarkAppraised",
              "NextState": "NotionalAcceptance",
              "DisplayName": "Mark Appraised"
            }
          ]
        },
        {
          "Name": "Appraised",
          "DisplayName": "Appraised",
          "Description": "Asset has been appraised, now awaiting inspection",
          "PercentComplete": 45,
          "Style": "Success",
          "Value": 4,
          "Transitions": [
            {
              "AllowedRoles": [],
              "AllowedInstanceRoles": [ "InstanceOwner" ],
              "Description": "Reject the offer",
              "Function": "Reject",
              "NextState": "Active",
              "DisplayName": "Reject"
            },
            {
              "AllowedRoles": [],
              "AllowedInstanceRoles": [ "InstanceOwner" ],
              "Description": "Cancel the offer",
              "Function": "Terminate",
              "NextState": "Terminated",
              "DisplayName": "Terminate"
            },
            {
              "AllowedRoles": [],
              "AllowedInstanceRoles": [ "InstanceBuyer" ],
              "Description": "Rescind the offer you placed for this asset",
              "Function": "RescindOffer",
              "NextState": "Active",
              "DisplayName": "Rescind Offer"
            },
            {
              "AllowedRoles": [],
              "AllowedInstanceRoles": [ "InstanceInspector" ],
              "Description": "Mark the asset as inspected",
              "Function": "MarkInspected",
              "NextState": "NotionalAcceptance",
              "DisplayName": "Mark Inspected"
            }
          ]
        },
        {
          "Name": "NotionalAcceptance",
          "DisplayName": "Notional Acceptance",
          "Description": "Asset has been inspected and appraised, awaiting final sign-off from buyer and seller",
          "PercentComplete": 50,
          "Style": "Success",
          "Value": 5,
          "Transitions": [
            {
              "AllowedRoles": [],
              "AllowedInstanceRoles": [ "InstanceOwner" ],
              "Description": "Sign-off on inspection and appraisal",
              "Function": "Accept",
              "NextState": "SellerAccepted",
              "DisplayName": "SellerAccept"
            },
            {
              "AllowedRoles": [],
              "AllowedInstanceRoles": [ "InstanceOwner" ],
              "Description": "Reject the proposed offer for the asset",
              "Function": "Reject",
              "NextState": "Active",
              "DisplayName": "Reject"
            },
            {
              "AllowedRoles": [],
              "AllowedInstanceRoles": [ "InstanceOwner" ],
              "Description": "Cancel this instance of asset transfer",
              "Function": "Terminate",
              "NextState": "Terminated",
              "DisplayName": "Terminate"
            },
            {
              "AllowedRoles": [],
              "AllowedInstanceRoles": [ "InstanceBuyer" ],
              "Description": "Sign-off on inspection and appraisal",
              "Function": "Accept",
              "NextState": "BuyerAccepted",
              "DisplayName": "BuyerAccept"
            },
            {
              "AllowedRoles": [],
              "AllowedInstanceRoles": [ "InstanceBuyer" ],
              "Description": "Rescind the offer you placed for this asset",
              "Function": "RescindOffer",
              "NextState": "Active",
              "DisplayName": "Rescind Offer"
            }
          ]
        },
        {
          "Name": "BuyerAccepted",
          "DisplayName": "Buyer Accepted",
          "Description": "Buyer has signed-off on inspection and appraisal",
          "PercentComplete": 75,
          "Style": "Success",
          "Value": 6,
          "Transitions": [
            {
              "AllowedRoles": [],
              "AllowedInstanceRoles": [ "InstanceOwner" ],
              "Description": "Sign-off on inspection and appraisal",
              "Function": "Accept",
              "NextState": "SellerAccepted",
              "DisplayName": "Accept"
            },
            {
              "AllowedRoles": [],
              "AllowedInstanceRoles": [ "InstanceOwner" ],
              "Description": "Reject the proposed offer for the asset",
              "Function": "Reject",
              "NextState": "Active",
              "DisplayName": "Reject"
            },
            {
              "AllowedRoles": [],
              "AllowedInstanceRoles": [ "InstanceOwner" ],
              "Description": "Cancel this instance of asset transfer",
              "Function": "Terminate",
              "NextState": "Terminated",
              "DisplayName": "Terminate"
            }
          ]
        },
        {
          "Name": "SellerAccepted",
          "DisplayName": "Seller Accepted",
          "Description": "Seller has signed-off on inspection and appraisal",
          "PercentComplete": 75,
          "Style": "Success",
          "Value": 7,
          "Transitions": [
            {
              "AllowedRoles": [],
              "AllowedInstanceRoles": [ "InstanceBuyer" ],
              "Description": "Sign-off on inspection and appraisal",
              "Function": "Accept",
              "NextState": "Accepted",
              "DisplayName": "Accept"
            },
            {
              "AllowedRoles": [],
              "AllowedInstanceRoles": [ "InstanceBuyer" ],
              "Description": "Rescind the offer you placed for this asset",
              "Function": "RescindOffer",
              "NextState": "Active",
              "DisplayName": "Rescind Offer"
            }
          ]
        },
        {
          "Name": "Accepted",
          "DisplayName": "Accepted",
          "Description": "Asset transfer process is complete",
          "PercentComplete": 100,
          "Style": "Success",
          "Value": 8,
          "Transitions": []
        },
        {
          "Name": "Terminated",
          "DisplayName": "Terminated",
          "Description": "Asset transfer has been cancelled",
          "PercentComplete": 100,
          "Style": "Failure",
          "Value": 9,
          "Transitions": []
        }
      ]
    }
  ]
}
```
## Next steps

Try out a tutorial.

* Create your first blockchain app

