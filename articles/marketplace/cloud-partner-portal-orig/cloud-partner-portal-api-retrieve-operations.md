---
title: Retrieve operations API | Azure Marketplace
description: Retrieves all the operations on the offer or to get a particular operation for the specified operationId.
author: dsindona
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: reference
ms.date: 04/08/2020
ms.author: dsindona
---


# Retrieve operations

> [!NOTE]
> The Cloud Partner Portal APIs are integrated with Partner Center and will continue to work after your offers are migrated to Partner Center. The integration introduces small changes. Review the changes listed in [Cloud Partner Portal API Reference](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal-orig/cloud-partner-portal-api-overview) to ensure your code continues to work after the migration to Partner Center.

Retrieves all the operations on the offer or to get a particular operation for the specified operationId. The client may use
query parameters to filter on running operations.

``` https

  GET https://cloudpartner.azure.com/api/publishers/<publisherId>/offers/<offerId>/submissions/?api-version=2017-10-31&status=<filteredStatus>

  GET https://cloudpartner.azure.com/api/publishers/<publisherId>/offers/<offerId>/operations/<operationId>?api-version=2017-10-31

```


## URI parameters

|  **Name**          |      **Description**                                                                                           | **Data type** |
|  ----------------  |     --------------------------------------------------------------------------------------------------------   |  -----------  |
|  publisherId       |  Publisher identifier, for example `Contoso`                                                                   |  String       |
|  offerId           |  Offer identifier                                                                                              |  String       |
|  operationId       |  GUID that uniquely identifies the operation on the offer. The operationId may be retrieved by using this API, and is also returned in the HTTP header of the response for any long running operation, such as the [Publish offer](./cloud-partner-portal-api-publish-offer.md) API.  |   Guid   |
|  api-version       | Latest version of API |    Date      |
|  |  |  |

## Header


|  **Name**          |  **Value**           |
|  ---------------   | -------------------- |
|  Content-Type      | `application/json`   |
|  Authorization     | `Bearer YOUR_TOKEN`  |
|  |  |


## Body example

### Response

#### GET operations

``` json
    [
        {
            "id": "5a63deb5-925b-4ee0-938b-7c86fbf287c5",
            "offerId": "56615b67-2185-49fe-80d2-c4ddf77bb2e8",
            "offerVersion": 1,
            "offerTypeId": "microsoft-azure-virtualmachines",
            "publisherId": "contoso",
            "submissionType": "publish",
            "submissionState": "running",
            "publishingVersion": 2,
            "slot": "staging",
            "version": 636576975611768314,
            "definition": {
                "metadata": {
                    "emails": "jdoe@contoso.com"
                }
            },
            "changedTime": "2018-03-26T21:46:01.179948Z"
        }
    ]
```

#### GET operation

``` json
    [
        {
            "status" : "running",
            "messages" : [],
            "publishingVersion" : 2,
            "offerVersion" : 1,
            "cancellationRequestState": "canCancel",
            "steps": [
                        {
                            "estimatedTimeFrame": "< 15 min",
                            "id": "displaydummycertify",
                            "stepName": "Validate Pre-Requisites",
                            "description": "Offer settings provided are validated",
                            "status": "complete",
                            "messages": 
                            [
                                {
                                    "messageHtml": "Step completed.",
                                    "level": "information",
                                    "timestamp": "2017-03-28T19:50:36.500052Z"
                                }
                            ],
                            "progressPercentage": 100
                        },
                        {
                            "estimatedTimeFrame": "< 5 day",
                            "id": "displaycertify",
                            "stepName": "Certification",
                            "description": "Your offer is analyzed by our certification systems for issues.",
                            "status": "blocked",
                            "messages": 
                            [
                                {
                                    "messageHtml": "No virtual machine image was found for the plan contoso.",
                                    "level": "error",
                                    "timestamp": "2017-03-28T19:50:39.5506018Z"
                                },
                                {
                                    "messageHtml": "This step has not started yet.",
                                    "level": "information",
                                    "timestamp": "2017-03-28T19:50:39.5506018Z"
                                }
                            ],
                            "progressPercentage": 0
                        },
                        {
                            "estimatedTimeFrame": "< 1 day",
                            "id": "displayprovision",
                            "stepName": "Provisioning",
                            "description": "Your virtual machine is being replicated in our production systems.",
                            "status": "notStarted",
                            "messages": [],
                            "progressPercentage": 0
                        },
                        {
                            "estimatedTimeFrame": "< 1 hour",
                            "id": "displaypackage",
                            "stepName": "Packaging and Lead Generation Registration",
                            "description": "Your virtual machine is packaged for being shown to your customers. Additionally, we hookup our lead generation systems to send leads for your offer.",
                            "status": "notStarted",
                            "messages": [],
                            "progressPercentage": 0
                        },
                        {
                            "id": "publisher-signoff",
                            "stepName": "Publisher signoff",
                            "description": "Offer is available to preview. Ensure that everything looks good before making your offer live.",
                            "status": "notStarted",
                            "messages": [],
                            "progressPercentage": 0
                        },
                        {
                            "estimatedTimeFrame": "~2-5 days",
                            "id": "live",
                            "stepName": "Live",
                            "description": "Offer is publicly visible and is available for purchase.",
                            "status": "notStarted",
                            "messages": [],
                            "progressPercentage": 0
                        }
                    ],
                "previewLinks": [],
                "liveLinks": [],
            }
        }
    ]
```

### Response body properties

|  **Name**                    |  **Description**                                                                                  |
|  --------------------        |  ------------------------------------------------------------------------------------------------ |
|  id                          | GUID that uniquely identifies the operation                                                       |
|  submissionType              | Identifies the type of operation being reported for the offer, for example `Publish/GoLive`      |
|  createdDateTime             | UTC datetime when the operation was created                                                       |
|  lastActionDateTime          | UTC datetime when the last update was done on the operation                                       |
|  status                      | Status of the operation, either `not started` \| `running` \| `failed` \| `completed`. Only one operation can have status `running` at a time. |
|  error                       | Error message for failed operations                                                               |
|  |  |

### Response step properties

|  **Name**                    |  **Description**                                                                                  |
|  --------------------        |  ------------------------------------------------------------------------------------------------ |
| estimatedTimeFrame | The estimated duration of this operation |
| id | The unique identifier for the step process |
| description | Description of the step |
| stepName | The friendly name for the step |
| status | The status of the step, either `notStarted` \| `running` \| `failed` \| `completed` |
| messages | Any notifications or warnings encountered during the step. Array of strings |
| progressPercentage | An integer from 0 to 100 indicating the progression of the step |
| | |

### Response status codes

| **Code**  |   **Description**                                                                                  |
|  -------- |   -------------------------------------------------------------------------------------------------|
|  200      | `OK` - The request was successfully processed and the operation(s) requested were returned.        |
|  400      | `Bad/Malformed request` - The error response body may contain more information.                    |
|  403      | `Forbidden` - The client doesn't have access to the specified namespace.                          |
|  404      | `Not found` - The specified entity does not exist.                                                 |
|  |  |
