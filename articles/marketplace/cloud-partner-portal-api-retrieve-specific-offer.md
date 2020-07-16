---
title: Retrieve a specific offer API - Azure Marketplace
description: API to retrieve the specified offer within the publisher namespace.
author: dsindona
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: reference
ms.date: 06/19/2020
ms.author: dsindona
---


Retrieve a specific offer
=========================

> [!NOTE]
> The Cloud Partner Portal APIs are integrated with Partner Center and will continue to work after your offers are migrated to Partner Center. The integration introduces small changes. Review the changes listed in [Cloud Partner Portal API Reference](./cloud-partner-portal-api-overview.md) to ensure your code continues to work after the migration to Partner Center.

Retrieves the specified offer within the publisher namespace.  

You can also retrieve a particular version of the offer, or retrieve the offer in draft, view, or production slots. If a slot is not specified, the default is `draft`. Attempting to retrieve an offer that has not been previewed or published will result in a `404 Not Found` error.

> [!WARNING]
> The secret values for secret type fields will not be retrieved by this API.

``` http
    GET https://cloudpartner.azure.com/api/publishers/<publisherId>/offers/<offerId>?api-version=2017-10-31

    GET https://cloudpartner.azure.com/api/publishers/<publisherId>/offers/<offerId>/versions/<version>?api-version=2017-10-31

    GET https://cloudpartner.azure.com/api/publishers/<publisherId>/offers/<offerId>/slot/<slotId>?api-version=2017-10-31

```


URI parameters
--------------


| **Name**    | **Description**                                                                          | **Data type** |
|-------------|------------------------------------------------------------------------------------------|---------------|
| publisherId | publisherId. For example, Contoso                                                        | String        |
| offerId     | Guid that uniquely identifies the offer.                                                 | String        |
| version     | Version of the offer being retrieved. By default, the latest offer version is retrieved. | Integer       |
| slotId      | The slot from which the offer is to be retrieved, can be one of:      <br/>  - `Draft` (default) retrieves the offer version currently in draft.  <br/>  -  `Preview` retrieves the offer version currently in preview.     <br/>  -  `Production` retrieves the offer version currently in production.          |      enum |
| api-version | Latest version of API                                                                    | Date          |
|  |  |  |


Header
------

|  **Name**          |   **Value**            |
|  ---------------   |  --------------        |
|  Content-Type      | `application/json`     |
|  Authorization     | `Bearer YOUR_TOKEN`    |
|  |  |


Body example
------------

### Response

``` json
{
    "offerTypeId": "microsoft-azure-virtualmachines",
    "publisherId": "contoso",
    "status": "failed",
    "id": "059afc24-07de-4126-b004-4e42a51816fe",
    "version": 5,
    "definition": {
        "displayText": "Contoso Virtual Machine Offer",
        "offer": {
            "microsoft-azure-marketplace-testdrive.enabled": false,
            "microsoft-azure-marketplace-testdrive.videos": [],
            "microsoft-azure-marketplace.title": "Contoso App",
            "microsoft-azure-marketplace.summary": "Contoso App makes dev ops a breeze",
            "microsoft-azure-marketplace.longSummary": "Contoso App makes dev ops a breeze",
            "microsoft-azure-marketplace.description": "Contoso App makes dev ops a breeze",
            "microsoft-azure-marketplace.offerMarketingUrlIdentifier": "contosoapp",
            "microsoft-azure-marketplace.allowedSubscriptions": [
                "59160c40-2e25-4dcf-a2fd-6514cb08bf08"
            ],
            "microsoft-azure-marketplace.usefulLinks": [
            {
                "linkTitle": "Contoso App for Azure",
                "linkUrl": "https://azuremarketplace.microsoft.com"
            }
            ],
                "microsoft-azure-marketplace.categoryMap": [
                {
                "categoryL1": "analytics",
                "categoryL2-analytics": [
                "visualization-and-reporting"
                ]
                },
                {
                "categoryL1": "ai-plus-machine-learning",
                "categoryL2-ai-plus-machine-learning": [
                "bot-services",
                "cognitive-services",
                "other"
                ]
                }
            ],
            "microsoft-azure-marketplace.smallLogo": "https://publishingapistore.blob.core.windows.net/testcontent/D6191_publishers_contoso/contosovirtualmachine/6218c455-9cbc-450c-9920-f2e7a69ee132.png?sv=2014-02-14&sr=b&sig=6O8MM9dgiJ48VK0MwddkyVbprRAnBszyhVkVHGShhkI%3D&se=2019-03-28T19%3A46%3A50Z&sp=r",
            "microsoft-azure-marketplace.mediumLogo": "https://publishingapistore.blob.core.windows.net/testcontent/D6191_publishers_contoso/contosovirtualmachine/557e714b-2f31-4e12-b0cc-e48dd840edf4.png?sv=2014-02-14&sr=b&sig=NwL67NTQf9Gc9VScmZehtbHXpYmxhwZc2foy3o4xavs%3D&se=2019-03-28T19%3A46%3A49Z&sp=r",
            "microsoft-azure-marketplace.largeLogo": "https://publishingapistore.blob.core.windows.net/testcontent/D6191_publishers_contoso/contosovirtualmachine/142485da-784c-44cb-9523-d4f396446258.png?sv=2014-02-14&sr=b&sig=xaMxhwx%2FlKYfz33mJGIg8UBdVpsOwVvqhjTJ883o0iY%3D&se=2019-03-28T19%3A46%3A49Z&sp=r",
            "microsoft-azure-marketplace.wideLogo": "https://publishingapistore.blob.core.windows.net/testcontent/D6191_publishers_contoso/contosovirtualmachine/48af9013-1df7-4c94-8da8-4626e5039ce0.png?sv=2014-02-14&sr=b&sig=%2BnN7f2tprkrqb45ID6JlT01zXcy1PMTkWXtLKD6nfoE%3D&se=2019-03-28T19%3A46%3A49Z&sp=r",
            "microsoft-azure-marketplace.screenshots": [],
            "microsoft-azure-marketplace.videos": [],
            "microsoft-azure-marketplace.leadDestination": "None",
            "microsoft-azure-marketplace.tableLeadConfiguration": {},
            "microsoft-azure-marketplace.blobLeadConfiguration": {},
            "microsoft-azure-marketplace.salesForceLeadConfiguration": {},
            "microsoft-azure-marketplace.crmLeadConfiguration": {},
            "microsoft-azure-marketplace.httpsEndpointLeadConfiguration": {},
            "microsoft-azure-marketplace.marketoLeadConfiguration": {},
            "microsoft-azure-marketplace.privacyURL": "https://azuremarketplace.microsoft.com",
            "microsoft-azure-marketplace.termsOfUse": "Terms of use",
            "microsoft-azure-marketplace.engineeringContactName": "Jon Doe",
            "microsoft-azure-marketplace.engineeringContactEmail": "jondoe@outlook.com",
            "microsoft-azure-marketplace.engineeringContactPhone": "555-555-5555",
            "microsoft-azure-marketplace.supportContactName": "Jon Doe",
            "microsoft-azure-marketplace.supportContactEmail": "jondoe@outlook.com",
            "microsoft-azure-marketplace.supportContactPhone": "555-555-5555",
            "microsoft-azure-marketplace.publicAzureSupportUrl": "",
            "microsoft-azure-marketplace.fairfaxSupportUrl": ""
            },
            "plans": [
            {
                "planId": "contososkuidentifier",
                "microsoft-azure-virtualmachines.skuTitle": "Contoso App",
                "microsoft-azure-virtualmachines.skuSummary": "Contoso App makes dev ops a breeze.",
                "microsoft-azure-virtualmachines.skuDescription": "This is a description for the Contoso App that makes dev ops a breeze.",
                "microsoft-azure-virtualmachines.hideSKUForSolutionTemplate": false,
                "microsoft-azure-virtualmachines.cloudAvailability": [
                    "PublicAzure"
                ],
                "microsoft-azure-virtualmachines.certificationsFairfax": [],
                "virtualMachinePricing": {
                    "isByol": true,
                    "freeTrialDurationInMonths": 0
                },
                "microsoft-azure-virtualmachines.operatingSystemFamily": "Windows",
                "microsoft-azure-virtualmachines.windowsOSType": "Other",
                "microsoft-azure-virtualmachines.operationSystem": "Contoso App",
                "microsoft-azure-virtualmachines.recommendedVMSizes": [
                    "a0-basic",
                    "a0-standard",
                    "a1-basic",
                    "a1-standard",
                    "a2-basic",
                    "a2-standard"
                ],
                "microsoft-azure-virtualmachines.openPorts": [],
                "microsoft-azure-virtualmachines.vmImages": {
                    "1.0.1": {
                    "osVhdUrl": "http://contosoteststorage.blob.core.windows.net/test/contosoVM.vhd?sv=2014-02-14&sig=WlDo6Q4xwYH%2B5QEJbItPUVdgHhBcrVxPBmntZ2vU96w%3D&st=2016-06-25T18%3A30%3A00Z&se=2017-06-25T18%3A30%3A00Z&sp=rl",
                    "lunVhdDetails": []
                    }
                },
                "regions": [
                    "DZ",
                    "AR"
                ]
            }
            ]
        },
        "changedTime": "2017-06-07T06:15:39.7349221Z"
    }
}
```


### Response body properties

|  **Name**       |   **Description**                                                                                                               |
|  -------------  |   -----------------------------------------------------------------------------------------------------                         |
|  offerTypeId    | Identifies the type of offer                                                                                                    |
|  publisherId    | Unique Identifier of the publisher                                                                                              |
|  status         | Status of the offer. For the list of possible values, see [Offer status](#offer-status) below.                                  |
|  Id             | GUID that uniquely identifies the offer                                                                                         |
|  version        | Current version of the offer. The version property cannot be modified by the client. It's incremented after each publishing.    |
|  definition     | Actual definition of the workload                                                                                               |
|  changedTime    | UTC datetime when the offer was last modified                                                                                   |
|  |  |


### Response status codes

| **Code**  | **Description**                                                                                                                 |
|  ------   | ------------------------------------------------------------------------------------------------------------------------------- |
|  200      | `OK` - The request was successfully processed and all the offers under the publisher were returned to the client.               |
|  400      | `Bad/Malformed request` - The error response body may contain more information.                                                 |
|  403      | `Forbidden` - The client doesn't have access to the specified namespace.                                                        |
|  404      | `Not found` - The specified entity doesn't exist. Client should check the publisherId, offerId, and version (if specified).      |
|  |  |


### Offer status

|  **Name**                   |   **Description**                             |
| --------------------------- |  -------------------------------------------- |
|  NeverPublished             | Offer has never been published.               |
|  NotStarted                 | Offer is new but is not started.              |
|  WaitingForPublisherReview  | Offer is waiting for publisher approval.      |
|  Running                    | Offer submission is being processed.          |
|  Succeeded                  | Offer submission has completed processing.    |
|  Canceled                   | Offer submission was canceled.                |
|  Failed                     | Offer submission failed.                      |
|  |  |
