---
title: Create or modify an offer - Azure Marketplace
description: API to create a new or update an existing offer.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: reference
author: mingshen-ms
ms.author: mingshen
ms.date: 07/29/2020
---

# Create or modify an offer

> [!NOTE]
> The Cloud Partner Portal APIs are integrated with and will continue working in Partner Center. The transition introduces small changes. Review the changes listed in [Cloud Partner Portal API Reference](./cloud-partner-portal-api-overview.md) to ensure your code continues working after transitioning to Partner Center. CPP APIs should only be used for existing products that were already integrated before transition to Partner Center; new products should use Partner Center submission APIs.

This call updates a specific offer within the publisher namespace or creates a new offer.

  `PUT https://cloudpartner.azure.com/api/publishers/<publisherId>/offers/<offerId>?api-version=2017-10-31`

## URI parameters

|  **Name**         |  **Description**                      |  **Data type**  |
|  --------         |  ----------------                     |  -------------  |
| publisherId       |  Publisher identifier, for example `contoso` |   String |
| offerId           |  Offer identifier                     |   String        |
| api-version       |  Latest version of the API            |   Date           |
|  |  |  |

## Header

|  **Name**        |  **Value**               |
|  ---------       |  ----------              | 
| Content-Type     | `application/json`       |
| Authorization    | `Bearer YOUR_TOKEN`      |
|  |  |

## Body example

The following example creates an offer with offerID of `contosovirtualmachine`.

### Request

``` json
  {
      "publisherId": "contoso",
      "offerTypeId": "microsoft-azure-virtualmachines",
      "id": "contosovirtualmachine",
      "offerTypeVersions": {
          "microsoft-azure-virtualmachines": 87,
          "microsoft-azure-marketplace": 39
      },
      "definition": {
          "displayText": "Contoso Virtual Machine Offer",
          "offer": {
          "microsoft-azure-marketplace.title": "Contoso App",
          "microsoft-azure-marketplace.summary": "Contoso App makes dev ops a breeze",
          "microsoft-azure-marketplace.longSummary": "Contoso App makes dev ops a breeze",
          "microsoft-azure-marketplace.description": "Contoso App makes dev ops a breeze",
          "microsoft-azure-marketplace.offerMarketingUrlIdentifier": "contosoapp",
          "microsoft-azure-marketplace.allowedSubscriptions": ["59160c40-2e25-4dcf-a2fd-6514cb08bf08"],
          "microsoft-azure-marketplace.usefulLinks": [{
              "linkTitle": "Contoso App for Azure",
              "linkUrl": "https://azuremarketplace.microsoft.com"
          }],
          "microsoft-azure-marketplace.categoryMap": [
                {
                    "categoryL1": "analytics",
                    "categoryL2-analytics": [
                        "visualization-and-reporting"
                    ]
                },
                {
                    "categoryL1": "ai-plus-machine-learning",
                    "categoryL2-ai-plus-machine-learning":[
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
          "microsoft-azure-marketplace.heroLogo": "https://publishingapistore.blob.core.windows.net/testcontent/D6191_publishers_contoso/contosovirtualmachine/c46ec74d-d214-4fb5-9082-3cee55200eba.png?sv=2014-02-14&sr=b&sig=RfDvjowFGpP4WZGAHylbF2CuXwO2NXOrwycrXEJvJI4%3D&se=2019-03-28T19%3A46%3A49Z&sp=r",
          "microsoft-azure-marketplace.screenshots": [],
          "microsoft-azure-marketplace.videos": [],
          "microsoft-azure-marketplace.leadDestination": "None",
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
      "plans": 
      [
          {
              "planId": "contososkuidentifier",
              "microsoft-azure-virtualmachines.skuTitle": "Contoso App",
              "microsoft-azure-virtualmachines.skuSummary": "Contoso App makes dev ops a breeze.",
              "microsoft-azure-virtualmachines.skuDescription": "This is a description for the Contoso App that makes dev ops a breeze.",
              "microsoft-azure-virtualmachines.hideSKUForSolutionTemplate": false,
              "microsoft-azure-virtualmachines.cloudAvailability": ["PublicAzure"],
              "virtualMachinePricing": {
                  "isByol": true,
                  "freeTrialDurationInMonths": 0
              },
              "microsoft-azure-virtualmachines.operatingSystemFamily": "Windows",
              "microsoft-azure-virtualmachines.windowsOSType": "Other",
              "microsoft-azure-virtualmachines.operationSystem": "Contoso App",
              "microsoft-azure-virtualmachines.recommendedVMSizes": ["a0-basic", "a0-standard", "a1-basic", "a1-standard", "a2-basic", "a2-standard"],
              "microsoft-azure-virtualmachines.openPorts": [],
              "microsoft-azure-virtualmachines.vmImages": 
              {
                  "1.0.1": 
                  {
                      "osVhdUrl": "http://contosoteststorage.blob.core.windows.net/test/contosoVM.vhd?sv=2014-02-14&sr=c&sig=WlDo6Q4xwYH%2B5QEJbItPUVdgHhBcrVxPBmntZ2vU96w%3D&st=2016-06-25T18%3A30%3A00Z&se=2017-06-25T18%3A30%3A00Z&sp=rl",
                      "lunVhdDetails": []
                  }
              },
              "regions": ["AZ"]
          }
          ]
      },
      "eTag": "W/\"datetime'2017-06-07T06%3A15%3A40.4771399Z'\"",
      "version": 5
  }
```

### Response

``` json
 {
         "offerTypeId": "microsoft-azure-virtualmachines",
         "publisherId": "contoso",
         "status": "neverPublished",
         "id": "contosovirtualmachine",
         "version": 1,
         "definition": {
         "displayText": "Contoso Virtual Machine Offer",
         "offer": 
         {
             "microsoft-azure-marketplace-testdrive.videos": [],
             "microsoft-azure-marketplace.title": "Contoso App",
             "microsoft-azure-marketplace.summary": "Contoso App makes dev ops a breeze",
             "microsoft-azure-marketplace.longSummary": "Contoso App makes dev ops a breeze",
             "microsoft-azure-marketplace.description": "Contoso App makes dev ops a breeze",
             "microsoft-azure-marketplace.offerMarketingUrlIdentifier": "contosoapp",
             "microsoft-azure-marketplace.allowedSubscriptions": 
             [
                 "59160c40-2e25-4dcf-a2fd-6514cb08bf08"
             ],
             "microsoft-azure-marketplace.usefulLinks": 
             [
                 {
                     "linkTitle": "Contoso App for Azure",
                     "linkUrl": "https://azuremarketplace.microsoft.com"
                 }
             ],
             "microsoft-azure-marketplace.categoryMap":
             [
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
             "microsoft-azure-marketplace.smallLogo": "https://publishingstoredm.blob.core.windows.net/prodcontent/D6191_publishers_marketplace:2Dtest/testaoffer/8affcd28-60a5-4839-adf8-c560e069fd61.png?sv=2014-02-14&sr=b&sig=nGErAgn%2BDUecrX892wcmk32kh0MHgIZeJ5jcKyY%2Fuew%3D&se=2020-03-28T22%3A27%3A13Z&sp=r",
             "microsoft-azure-marketplace.mediumLogo": "https://publishingstoredm.blob.core.windows.net/prodcontent/D6191_publishers_marketplace:2Dtest/testaoffer/39550bca-1110-432c-9ea9-e12b3a2288cd.png?sv=2014-02-14&sr=b&sig=4X0hlkXYtuZOmcYq%2BsbYVZz3k5k26kngcFX6yBAJjNI%3D&se=2020-03-28T22%3A27%3A13Z&sp=r",
             "microsoft-azure-marketplace.largeLogo": "https://publishingstoredm.blob.core.windows.net/prodcontent/D6191_publishers_marketplace:2Dtest/testaoffer/ce3576e3-df12-4074-b0a3-0b8d3f329df1.png?sv=2014-02-14&sr=b&sig=mFhtCUQh%2FbFz10nlIWbqsz6jq5MBZ0M%2F5cIREE9P6V0%3D&se=2020-03-28T22%3A27%3A13Z&sp=r",
             "microsoft-azure-marketplace.wideLogo": "https://publishingstoredm.blob.core.windows.net/prodcontent/D6191_publishers_marketplace:2Dtest/testaoffer/476d6edd-12d3-4414-9def-d2970c4a9de4.png?sv=2014-02-14&sr=b&sig=pg4MDSZjAb8w8D%2FrQ9RT%2BodpynSy%2FlYOvpx0yeam2Bw%3D&se=2020-03-28T22%3A27%3A13Z&sp=r",
             "microsoft-azure-marketplace.heroLogo": "https://publishingstoredm.blob.core.windows.net/prodcontent/D6191_publishers_marketplace:2Dtest/testaoffer/46c85b7b-4438-4e0d-8218-24fb5651727a.png?sv=2014-02-14&sr=b&sig=wIsCOO5%2BDj8NsLVSwwzwTgogF71oA7Q1XjKhNB1ni5g%3D&se=2020-03-28T22%3A27%3A13Z&sp=r",
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
         "plans": 
         [
             {
                 "planId": "contososkuidentifier",
                 "microsoft-azure-virtualmachines.skuTitle": "Contoso App (Old Title)",
                 "microsoft-azure-virtualmachines.skuSummary": "Contoso App makes dev ops a breeze.",
                 "microsoft-azure-virtualmachines.skuDescription": "This is a description for the Contoso App that makes dev ops a breeze.",
                 "microsoft-azure-virtualmachines.hideSKUForSolutionTemplate": false,
                 "microsoft-azure-virtualmachines.cloudAvailability": 
                 [
                     "PublicAzure"
                 ],
                 "microsoft-azure-virtualmachines.certificationsFairfax": [],
                 "virtualMachinePricing": {
                     "isByol": true,
                     "freeTrialDurationInMonths": 0
                 },
                 "microsoft-azure-virtualmachines.operatingSystemFamily": "Windows",
                 "microsoft-azure-virtualmachines.operationSystem": "Contoso App",
                 "microsoft-azure-virtualmachines.recommendedVMSizes": 
                 [
                     "a0-basic",
                     "a0-standard",
                     "a1-basic",
                     "a1-standard",
                     "a2-basic",
                     "a2-standard"
                 ],
                 "microsoft-azure-virtualmachines.openPorts": [],
                 "microsoft-azure-virtualmachines.vmImages": 
                 {
                     "1.0.1": 
                     {
                         "osVhdUrl": "http://contosoteststorage.blob.core.windows.net/test/contosoVM.vhd?sv=2014-02-14&sr=c&sig=WlDo6Q4xwYH%2B5QEJbItPUVdgHhBcrVxPBmntZ2vU96w%3D&st=2016-06-25T18%3A30%3A00Z&se=2017-06-25T18%3A30%3A00Z&sp=rl",
                         "lunVhdDetails": []
                     }
                 },
                 "regions":
                 [
                     "AZ"
                 ]
             } 
         ]
     },
     "changedTime": "2018-03-28T22:27:13.8363879Z"
 }
```

> [!NOTE]
> To modify this offer, add an **If-Match** header set to * to the above request. Use the same request body as above, but modify the values as desired. 

### Response status codes

| **Code**  |  **Description**                                                                            |
| --------  |  ---------------                                                                            |
|  200      | `OK`. The request was successfully processed and offer was modified successfully.           |
|  201      | `Created`. The request was successfully processed and the offer was created successfully.   |
|  400      | `Bad/Malformed request`. The error response body could provide more information.            |
|  403      | `Forbidden`. The client doesn't have access to the requested namespace.                     |
|  404      | `Not found`. The entity referred to by the client does not exist.                           |
|  412      | The server does not meet one of the preconditions that the requester specified in the request. The client should check the ETAG sent with the request. |
|  |  |

## Uploading artifacts

Artifacts, such as images and logos, should be shared by uploading them to
an accessible location on the web, then including each as a URI in the PUT
request, as in the example above. The system will detect that these
files are not present in the Azure Marketplace storage and download
these files into storage.  As a result, you will find that future GET requests
will return an Azure Marketplace service URL for these files.

## Categories and industries

When creating a new offer, you must specify a category for your offer in the marketplace. Optionally, for some offer types you can specify industries. Based on the offer type, provide the categories/industries applicable to the offer using specific key values from the following table.

### Azure Marketplace categories

These categories and their respective keys are applicable for Azure apps, Virtual Machines, Core Virtual Machines, Containers, Container apps, IoT Edge modules and SaaS.

| Category | SaaS keys | Azure App keys | Virtual Machine, Containers, Container apps, IoT Edge Module, Core Virtual Machine keys |
| --- | --- | --- | --- |
| **L1 - Analytics** | **analytics** | **analytics-azure-apps** | **analytics-amp** |
| L2 - Data Insights | data-insights | data-insights | data-insights |
| L2 - Data Analytics | data-analytics | data-analytics | data-analytics |
| L2 - Big Data | big-data | bigData | big-data |
| L2 - Predictive Analytics | predictive-analytics | predictive-analytics | predictive-analytics |
| L2 - Real-time/Streaming Analytics | real-time-streaming-analytics | real-time-streaming-analytics | real-time-streaming-analytics |
| L2 - Other | other | other-analytics | other |
| **L1 - AI + Machine Learning** | **ArtificialIntelligence** | **ai-plus-machine-learning** | **ai-plus-machine-learning** |
| L2 - Bot Services | bot-services | bot-services | bot-services |
| L2 - Cognitive Services | cognitive-services | cognitive-services | cognitive-services |
| L2 - ML Service | ml-service | ml-service | ml-service |
| L2 - Automated ML | automated-ml | automated-ml | automated-ml |
| L2 - Business/Robotic Process Automation | business-robotic-process-automation | business-robotic-process-automation | business-robotic-process-automation |
| L2 - Data Labelling | data-labelling | data-labelling | data-labelling |
| L2 - Data Preparation | data-preparation | data-preparation | data-preparation |
| L2 - Knowledge Mining | knowledge-mining | knowledge-mining | knowledge-mining |
| L2 - ML Operations | ml-operations | ml-operations | ml-operations |
| L2 - Other | other-AI-plus-machine-learning | other | other |
| **L1 - Blockchain** | **blockchain** | **blockchain** | **blockchain** |
| L2 - App Accelerators | app-accelerators | app-accelerators | app-accelerators |
| L2 - Single-node Ledger | single-node-ledger | single-node-ledger | single-node-ledger |
| L2 - Multi-node Ledger | multi-node-ledger | multi-node-ledger | multi-node-ledger |
| L2 - Tools | tools | tools | tools |
| L2 - Other | other | other | other |
| **L1 - Compute** | **compute-saas** | **compute-azure-apps** | **compute** |
| L2 - Application Infrastructure | appInfra | appInfrastructure | application-infrastructure |
| L2 - Operating Systems | clientOS | clientOS | operating-systems |
| L2 - Cache | cache | cache | cache |
| L2 - Other | other-compute | other-compute | other |
| **L1 - Containers** | **containers** | **containers** | **containers** |
| L2 - Container Apps | container-apps | container-apps | container-apps |
| L2 - Container Images | container-images | container-images | container-images |
| L2 - Get Started with Containers | get-started-with-containers | get-started-with-containers | get-started-with-containers |
| L2 - Other | other | other | other |
| **L1 - Databases** | **databases-saas** | **database** | **databases** |
| L2 - NoSQL Databases | nosql-databases | nosql-databases | nosql-databases |
| L2 - Relational Databases | relational-databases | relational-databases | relational-databases |
| L2 - Ledger/Blockchain Databases | ledger-blockchain-databases | ledger-blockchain-databases | ledger-blockchain-databases |
| L2 - Data Lakes | data-lakes | data-lakes | data-lakes |
| L2 - Data Warehouse | data-warehouse | data-warehouse | data-warehouse |
| L2 - Other | other-databases | other-databases | other |
| **L1 - Developer Tools** | **developer-tools-saas** | **developer-tools-azure-apps** | **developer-tools** |
| L2 - Tools | tools-developer-tools | tools-developer-tools | tools-developer-tools |
| L2 - Scripts | scripts | scripts | scripts |
| L2 - Developer Service | devService | devService | developer-service |
| L2 - Other | other-developer-tools | other-developer-tools | other |
| **L1 - DevOps** | **devops** | **devops** | **devops** |
| L2 - Other | other | other | other |
| **L1 - Identity** | **identity** | **identity** | **identity** |
| L2 - Access management | access-management | access-management | access-management |
| L2 - Other | other | other | other |
| **L1 - Integration** | **integration** | **integration** | **integration** |
| L2 - Messaging | messaging | messaging | messaging |
| L2 - Other | other | other | other |
| **L1 - Internet of Things** | **IoT** | **internet-of-things-azure-apps** | **internet-of-things** |
| L2 - IoT Core Services | N/A | iot-core-services | iot-core-services |
| L2 - IoT Edge Modules | N/A | iot-edge-modules | iot-edge-modules |
| L2 - IoT Solutions | iot-solutions | iot-solutions | iot-solutions |
| L2 - Data Analytics & Visualization | data-analytics-and-visualization | data-analytics-and-visualization | data-analytics-and-visualization |
| L2 - IoT Connectivity | iot-connectivity | iot-connectivity | iot-connectivity |
| L2 - Other | other-internet-of-things | other-internet-of-things | other |
| **L1 - IT & Management Tools** | **ITandAdministration** | **it-and-management-tools-azure-apps** | **it-and-management-tools** |
| L2 - Management Solutions | management-solutions | management-solutions | management-solutions |
| L2 - Business Applications | businessApplication | businessApplication | business-applications |
| L2 - Other | other-it-management-tools | other-it-management-tools | other |
| **L1 - Monitoring & Diagnostics** | **monitoring-and-diagnostics** | **monitoring-and-diagnostics** | **monitoring-and-diagnostics** |
| L2 - Other | other | other | other |
| **L1 - Media** | **media** | **media** | **media** |
| L2 - Media Services | media-services | media-services | media-services |
| L2 - Content Protection | content-protection | content-protection | content-protection |
| L2 - Live & On-Demand Streaming | live-and-on-demand-streaming | live-and-on-demand-streaming | live-and-on-demand-streaming |
| L2 - Other | other | other | other |
| **L1 - Migration** | **migration** | **migration** | **migration** |
| L2 - Data Migration | data-migration | data-migration | data-migration |
| L2 - Other | other | other | other |
| **L1 - Mixed Reality** | **mixed-reality** | **mixed-reality** | **mixed-reality** |
| L2 - Other | other | other | other |
| **L1 - Networking** | **networking** | **networking** | **networking** |
| L2 - Appliance Managers | appliance-managers | appliance-managers | appliance-managers |
| L2 - Connectivity | connectivity | connectivity | connectivity |
| L2 - Firewalls | firewalls | firewalls | firewalls |
| L2 - Load Balancers | load-balancers | load-balancers | load-balancers |
| L2 - Other | other | other | other |
| **L1 - Security** | **security** | **security** | **security** |
| L2 - Identity & Access Management | identity-and-access-management | identity-and-access-management | identity-and-access-management |
| L2 - Threat Protection | threat-protection | threat-protection | threat-protection |
| L2 - Information Protection | information-protection | information-protection | information-protection |
| L2 - Other | other | other | other |
| **L1 - Storage** | **storage-saas** | **storage-azure-apps** | **storage** |
| L2 - Backup & Recovery | backup | backup | backup-and-recovery |
| L2 - Enterprise Hybrid Storage | enterprise-hybrid-storage | enterprise-hybrid-storage | enterprise-hybrid-storage |
| L2 - File Sharing | file-sharing | file-sharing | file-sharing |
| L2 - Data Lifecycle Management | data-lifecycle-management | data-lifecycle-management | data-lifecycle-management |
| L2 - Other | other-storage | other-storage | other |
| **L1 - Web** | **web** | **web** | **web** |
| L2 - Blogs & CMSs | blogs-and-cmss | blogs-and-cmss | blogs-and-cmss |
| L2 - Starter Web Apps | starter-web-apps | starter-web-apps | starter-web-apps |
| L2 - Ecommerce | ecommerce | ecommerce | ecommerce |
| L2 - Web Apps Frameworks | web-apps-frameworks | web-apps-frameworks | web-apps-frameworks |
| L2 - Web Apps | web-apps | web-apps | web-apps |
| L2 - Other | other | other | other |

### AppSource categories

These categories and their respective keys are applicable for SaaS, PowerBI app, Dynamics 365 business central, Dynamics 365 for customer engagement and Dynamics 365 for operation.

| Category | SaaS keys | Dynamics 365 business central, Dynamics 365 for customer engagement, Dynamics 365 for operation keys | PowerBI app keys |
| --- | --- | --- | --- |
| **L1 - Analytics** | **analytics** | **Analytics** | **Analytics** |
| L2 - Advanced Analytics | advanced-analytics | advanced-analytics | advanced-analytics |
| L2 – Visualization & Reporting | visualization-reporting | visualization-reporting | visualization-reporting |
| L2 - Other | other | other-analytics | other-analytics |
| **L1 – AI + Machine Learning** | **ArtificialIntelligence** | **ai-plus-machine-learning-dynamics** | **ai-plus-machine-learning-appsource** |
| L2 - AI for Business | ai-for-business | ai-for-business | ai-for-business |
| L2 - Bot Apps | bot-apps | bot-apps | bot-apps |
| L2 - Other | other-ai-plus-machine-learning | other-ai-plus-machine-learning | other-ai-plus-machine-learning |
| **L1 - Collaboration** | **Collaboration** | **Collaboration** | **collaboration** |
| L2 - Contact & People | contact-people | contact-people | contact-and-people |
| L2 – Meeting Management | meeting-management | meeting-management | meeting-management |
| L2 – Site Design & Management | site-design-management | site-design-management | site-design-and-management |
| L2 – Task & Project Management | task-project-management | task-project-management | task-and-project-management |
| L2 – Voice & Video Conferencing | voice-video-conferencing | voice-video-conferencing | voice-and-video-conferencing |
| L2 - Other | other-collaboration | other-collaboration | other |
| **L1 – Compliance & Legal** | **compliance** | **compliance** | **compliance-and-legal** |
| L2 – Tax & Audit | tax-audit | tax-audit | tax-and-audit |
| L2 – Legal | Legal | Legal | legal |
| L2 - Data, Governance & Privacy | data-governance-privacy | data-governance-privacy | data-governance-and-privacy |
| L2 – Health & Safety | health-safety | health-safety | health-and-safety |
| L2 - Other | other-compliance-legal | other-compliance-legal | other |
| **L1 – Customer Service** | **CustomerService** | **CustomerService** | **customer-service** |
| L2 - Contact Center | contact-center | contact-center | contact-center |
| L2 - Face to Face Service | face-to-face-service | face-to-face-service | face-to-face-service |
| L2 - Back Office & Employee Service | back-office-employee-service | back-office-employee-service | back-office-and-employee-service |
| L2 - Knowledge & Case Management | knowledge-case-management | knowledge-case-management | knowledge-and-case-management |
| L2 - Social Media & Omnichannel Engagement | social-media-omnichannel-engagement | social-media-omnichannel-engagement | social-media-and-omnichannel-engagement |
| L2 -Other | other-customer-service | other-customer-service | other |
| **L1 - Finance** | **Finance** | **Finance** | **finance** |
| L2 - Accounting | accounting | accounting | accounting |
| L2 - Asset Management | asset-management | asset-management | asset-management |
| L2 - Analytics, Consolidation & Reporting | analytics-consolidation-reporting | analytics-consolidation-reporting | analytics-consolidation-and-reporting |
| L2 - Credit & Collections | credit-collections | credit-collections | credit-and-collections |
| L2 - Compliance & Risk Management | compliance-risk-management | compliance-risk-management | compliance-and-risk-management |
| L2 - Other | other-finance | other-finance | other |
| **L1 – Human Resources** | **HumanResources** | **HumanResources** | **human-resources** |
| L2 – Talent Acquisition | talent-acquisition | talent-acquisition | talent-acquisition |
| L2 – Talent Management | talent-management | talent-management | talent-management |
| L2 – HR Operations | hr-operations | hr-operations | hr-operations |
| L2 – Workforce Planning & Analytics | workforce-planning-analytics | workforce-planning-analytics | workforce-planning-and-analytics |
| L2 - Other | other-human-resources | other-human-resources | other |
| **L1 – Internet of Things** | **IoT** | **internet-of-things-dynamics** | **internet-of-things-appsource** |
| L2 - Asset Management & Operations | asset-management-operations | asset-management-operations | asset-management-and-operations |
| L2 - Connected Products | connected-products | connected-products | connected-products |
| L2 - Intelligent Supply Chain | intelligent-supply-chain | intelligent-supply-chain | intelligent-supply-chain |
| L2 - Predictive Maintenance | predictive-maintenance | predictive-maintenance | predictive-maintenance |
| L2 - Remote Monitoring | remote-monitoring | remote-monitoring | remote-monitoring |
| L2 - Safety & Security | safety-security | safety-security | safety-and-security |
| L2 - Smart Infrastructure & Resources | smart-infrastructure-resources | smart-infrastructure-resources | smart-infrastructure-and-resources |
| L2 - Vehicles & Mobility | vehicles-mobility | vehicles-mobility | vehicles-and-mobility |
| L2 - Other | other-internet-of-things | other-internet-of-things | other |
| **L1 – IT & Management Tools** | **ITandAdministration** | **ITandAdministration** | **it-and-management-tools** |
| L2 – Management Solutions | management-solutions | management-solutions | management-solutions |
| L2 – Business Applications | businessApplication | businessApplication | business-applications |
| L2 - Other | other-it-management-tools | other-it-management-tools | other |
| **L1 - Marketing** | **Marketing** | **Marketing** | **marketing** |
| L2 - Advertisement | advertisement | advertisement | advertisement |
| L2 - Analytics | analytics-marketing | analytics-marketing | analytics-marketing |
| L2 - Campaign Management & Automation | campaign-management-automation | campaign-management-automation | campaign-management-and-automation |
| L2 - Email Marketing | email-marketing | email-marketing | email-marketing |
| L2 -Events & Resource Management | events-resource-management | events-resource-management | events-and-resource-management |
| L2 - Research & Analysis | research-analytics | research-analytics | research-and-analysis |
| L2 - Social Media | social-media | social-media | social-media |
| L2 - Other | other-marketing | other-marketing | other |
| **L1 – Operations & Supply Chain** | **OperationsSupplyChain** | **OperationsSupplyChain** | **operations-and-supply-chain** |
| L2 - Asset & Production Management | asset-production-management | asset-production-management | asset-and-production-management |
| L2 - Demand Forecasting | demand-forecasting | demand-forecasting | demand-forecasting |
| L2 - Information Management & Connectivity | information-management-connectivity | information-management-connectivity | information-management-and-connectivity |
| L2 - Planning, Purchasing & Reporting | planning-purchasing-reporting | planning-purchasing-reporting | planning-purchasing-and-reporting |
| L2 - Quality & Service Management | quality-service-management | quality-service-management | quality-and-service-management |
| L2 - Sales & Order Management | sales-order-management | sales-order-management | sales-and-order-management |
| L2 - Transportation & Warehouse Management | transportation-warehouse-management | transportation-warehouse-management | transportation-and-warehouse-management |
| L2 - Other | other-operations-supply-chain | other-operations-supply-chain | other |
| **L1 - Productivity** | **Productivity** | **Productivity** | **productivity** |
| L2 – Content Creation & Management | content-creation-management | content-creation-management | content-creation-and-management |
| L2 – Language & Translation | language-translation | language-translation | language-and-translation |
| L2 – Document Management | document-management | document-management | document-management |
| L2 - Email Management | email-management | email-management | email-management |
| L2 - Search & Reference | search-reference | search-reference | search-and-reference |
| L2 - Other | other-productivity | other-productivity | other |
| L2 - Gamification | Gamification | Gamification | gamification |
| **L1 - Sales** | **Sales** | **Sales** | **Sales** |
| L2 - Telesales | telesales | telesales | telesales |
| L2 - Configure, Price, Quote (CPQ) | configure-price-quote | configure-price-quote | configure-price-quote |
| L2 - Contract Management | contract-management | contract-management | contract-management |
| L2 - CRM | crm | crm | crm |
| L2 - E-commerce | e-commerce | e-commerce | e-commerce |
| L2 - Business Data Enrichment | business-data-enrichment | business-data-enrichment | business-data-enrichment |
| L2 - Sales Enablement | sales-enablement | sales-enablement | sales-enablement |
| L2 - Other | other-sales | other-sales | other-sales |
| **L1 - Geolocation** | **geolocation** | **geolocation** | **geolocation** |
| L2 – Maps | maps | maps | maps |
| L2 – News & Weather | news-and-weather | news-and-weather | news-and-weather |
| L2 - Other | other-geolocation | other-geolocation | other-geolocation |

### Microsoft AppSource industries

These industries and their respective keys are applicable for SaaS, PowerBI app, Dynamics 365 business central, Dynamics 365 for customer engagement and Dynamics 365 for operation.

| Industry | SaaS, Dynamics 365 business central, Dynamics 365 for customer engagement, Dynamics 365 for operation keys | PowerBI apps keys |
| --- | --- | --- |
| **L1 - Automotive** | **Automotive** | **automotive** |
| L2 - Automotive | AutomotiveL2 | AutomotiveL2 |
| **L1 - Agriculture** | **Agriculture** | **agriculture** |
| L2 – Other - Unsegmented | Agriculture\_OtherUnsegmented | other-unsegmented |
| **L1 - Distribution** | **Distribution** | **distribution** |
| L2 - Wholesale | Wholesale | wholesale |
| L2 – Parcel & Package Shipping | ParcelAndPackageShipping | parcel-and-package-shipping |
| **L1 - Education** | **Education** | **education** |
| L2 - Higher Education | HigherEducation | higher-education |
| L2 - Primary & Secondary Education / K-12 | PrimaryAndSecondaryEducationK12 | primary-and-secondary-education |
| L2 - Libraries & Museums | LibrariesAndMuseums | libraries-and-museums |
| **L1 – Financial Services** | **FinancialServices** | **financial-services** |
| L2 - Banking & Capital Markets | BankingAndCapitalMarkets | banking-and-capital-markets |
| L2 - Insurance | Insurance | insurance |
| **L1 - Government** | **Government** | **government** |
| L2 - Defense & Intelligence | DefenseAndIntelligence | defense-and-intelligence |
| L2 – Public Safety & Justice | PublicSafetyAndJustice | public-safety-and-justice |
| L2 – Civilian Government | CivilianGovernment | civilian-government |
| **L1 - Healthcare** | **HealthCareandLifeSciences** | **healthcare** |
| L2 - Health Payor | HealthPayor | health-payor |
| L2 - Health Provider | HealthProvider | health-provider |
| L2 - Pharmaceuticals | Pharmaceuticals | pharmaceuticals |
| **L1 – Manufacturing & Resources** | **Manufacturing** | **manufacturing-and-resources** |
| L2 - Chemical & Agrochemical | ChemicalAndAgrochemical | chemical-and-agrochemical |
| L2 - Discrete Manufacturing | DiscreteManufacturing | discrete-manufacturing |
| L2 - Energy | Energy | energy |
| **L1 – Retail & Consumer Goods** | **RetailandConsumerGoods** | **retail-and-consumer-goods** |
| L2 - Consumer Goods | ConsumerGoods | consumer-goods |
| L2 - Retailers | Retailers | retailers |
| **L1 - Media & Communications** | **MediaAndCommunications** | **media-and-communications** |
| L2 - Media & Entertainment | MediaandEntertainment | media-and-entertainment |
| L2 - Telecommunications | Telecommunications | telecommunications |
| **L1 – Professional Services** | **ProfessionalServices** | **professional-services** |
| L2 - Legal | Legal | legal |
| L2 – Partner Professional Services | PartnerProfessionalServices | partner-professional-services |
| **L1 - Architecture & Construction** | **ArchitectureAndConstruction** | **architecture-and-construction** |
| L2 – Other - Unsegmented | Other - Unsegmented (wrong key, the key should be `ArchitectureAndConstruction\_OtherUnsegmented`) | other-unsegmented |
| **L1 - Hospitality & Travel** | **HospitalityandTravel** | **hospitality-and-travel** |
|    L2 - Hotels & Leisure | HotelsAndLeisure | hotels-and-leisure |
| L2 – Travel & Transportation | TravelAndTransportation | travel-and-transportation |
| L2 – Restaurants & Food Services | RestaurantsAndFoodServices | restaurants-and-food-services |
| **L1 - Other Public Sector Industries** | **OtherPublicSectorIndustries** | **other-public-sector-industries** |
| L2 – Forestry & Fishing | ForestryAndFishing | forestry-and-fishing |
| L2 - Nonprofits | Nonprofits | nonprofits |
| **L1 - Real Estate** | **RealEstate** | **real-estate** |
| L2 – Other - Unsegmented | RealEstate\_OtherUnsegmented | other-unsegmented |
||||
