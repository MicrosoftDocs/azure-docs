---
title: Retrieve offer status | Azure Marketplace
description: API retrieves the current status of the offer.
author: dsindona
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: reference
ms.date: 04/08/2020
ms.author: dsindona
---


# Retrieve offer status

> [!NOTE]
> The Cloud Partner Portal APIs are integrated with Partner Center and will continue to work after your offers are migrated to Partner Center. The integration introduces small changes. Review the changes listed in [Cloud Partner Portal API Reference](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal-orig/cloud-partner-portal-api-overview) to ensure your code continues to work after the migration to Partner Center.

Retrieves the current status of the offer.

  `GET  https://cloudpartner.azure.com/api/publishers/<publisherId>/offers/<offerId>/status?api-version=2017-10-31`

## URI parameters

|  **Name**       |   **Description**                            |  **Data type** |
|  -------------  |  ------------------------------------------  |  ------------  |
|  publisherId    | Publisher identifier, for example `Contoso`  |     String     |
|  offerId        | GUID that uniquely identifies the offer      |     String     |
|  api-version    | Latest version of API                        |     Date       |
|  |  |


## Header


|  Name           |  Value               |
|  -------------  | -------------------  |
|  Content-Type   |  `application/json`  |
|  Authorization  | `Bearer YOUR_TOKEN`  |
|  |  |

## Body example


### Response

``` json
  {
      "status": "succeeded",
      "messages": [],
      "steps": [
      {
          "estimatedTimeFrame": "< 15 min",
          "id": "displaydummycertify",
          "stepName": "Validate Pre-Requisites",
          "description": "Offer settings provided are validated.",
          "status": "complete",
          "messages": [
              {
                  "messageHtml": "Step completed.",
                  "level": "information",
                  "timestamp": "2018-03-16T17:50:45.7215661Z"
              }
          ],       
          "progressPercentage": 100
      },
      {
          "estimatedTimeFrame": "~2-3 days",
          "id": "displaycertify",
          "stepName": "Certification",
          "description": "Your offer is analyzed by our certification systems for issues.",
          "status": "notStarted",
          "messages": [],
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
          "description": "Your virtual machine is being packaged for customers. Additionally, lead systems are being configured and set up.",
          "status": "notStarted",
          "messages": [],
          "progressPercentage": 0
      },
      {
          "estimatedTimeFrame": "< 1 hour",
          "id": "publisher-signoff",
          "stepName": "Publisher signoff",
          "description": "Offer is available to preview. Ensure that everything looks good before making your offer live.",
          "status": "complete",
          "messages": [],
          "progressPercentage": 0
      },
      {
          "estimatedTimeFrame": "~2-5 days",
          "id": "live",
          "stepName": "Live",
          "description": "Offer is publicly visible and is available for purchase.",
          "status": "complete",
          "messages": [],
          "progressPercentage": 0
      }
      ],
      "previewLinks": [],
      liveLinks": [],
  }
```


### Response body properties

|  **Name**             |    **Description**                                                                             |
| --------------------  |   -------------------------------------------------------------------------------------------- |
|  status               | The status of the offer. For the list of possible values, see [Offer status](#offer-status) below. |
|  messages             | Array of messages associated with the offer                                                    |
|  steps                | Array of the steps that the offer goes through during an offer publishing                      |
|  estimatedTimeFrame   | Estimate of time it would take to complete this step, in friendly format                       |
|  id                   | Identifier of the step                                                                         |
|  stepName             | Name of the step                                                                               |
|  description          | Description of the step                                                                        |
|  status               | Status of the step. For the list of possible values, see [Step status](#step-status) below.    |
|  messages             | Array of messages related to the step                                                          |
|  processPercentage    | Percentage completion of the step                                                              |
|  previewLinks         | *Not currently implemented*                                                                    |
|  liveLinks            | *Not currently implemented*                                                                    |
|  notificationEmails   | Deprecated for offers migrated to Partner Center. Notification emails for migrated offers will be sent to the email specified under the Seller contact info in Account settings.<br><br>For non-migrated offers, comma-separated list of email addresses to be notified of the progress of the operation        |
|  |  |

### Response status codes

| **Code** |   **Description**                                                                                 |
| -------  |   ----------------------------------------------------------------------------------------------- |
|  200     |  `OK` - The request was successfully processed, and the current status of the offer was returned. |
|  400     | `Bad/Malformed request` - The error response body may contain more information.                 |
|  404     | `Not found` - The specified entity doesn't exist.                                                |
|  |  |

### Offer status

|  **Name**                    |    **Description**                                       |
|  --------------------------  |  ------------------------------------------------------  |
|  NeverPublished              | Offer has never been published.                          |
|  NotStarted                  | Offer is new and not started.                            |
|  WaitingForPublisherReview   | Offer is waiting for publisher approval.                 |
|  Running                     | Offer submission is being processed.                     |
|  Succeeded                   | Offer submission has completed processing.               |
|  Canceled                    | Offer submission was canceled.                           |
|  Failed                      | Offer submission failed.                                 |
|  |  |

### Step Status

|  **Name**                    |    **Description**                           |
|  -------------------------   |  ------------------------------------------  |
|  NotStarted                  | Step has not started.                        |
|  InProgress                  | Step is running.                             |
|  WaitingForPublisherReview   | Step is waiting for publisher approval.      |
|  WaitingForApproval          | Step is waiting for process approval.        |
|  Blocked                     | Step is blocked.                             |
|  Rejected                    | Step is rejected.                            |
|  Complete                    | Step is complete.                            |
|  Canceled                    | Step was canceled.                           |
|  |  |
