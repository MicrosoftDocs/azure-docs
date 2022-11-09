---
title: Create or modify an offer - Azure Marketplace
description: API to create a new or update an existing offer.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: reference
author: mingshen-ms
ms.author: mingshen
ms.date: 12/03/2021
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

## Header

|  **Name**        |  **Value**               |
|  ---------       |  ----------              | 
| Content-Type     | `application/json`       |
| Authorization    | `Bearer YOUR_TOKEN`      |

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

## Uploading artifacts

Artifacts, such as images and logos, should be shared by uploading them to an accessible location on the web, then including each as a URI in the PUT request, as in the example above. The system will detect that these files are not present in Azure Marketplace storage and download them. As a result, you will find that future GET requests will return an Azure Marketplace service URL for these files.

## Categories and industries

When creating a new offer, you must specify a category for your offer in the marketplace. Optionally, for some offer types you can also specify industries. Based on the offer type, provide the categories/industries applicable to the offer using specific key values from the following tables.

### Azure Marketplace categories

These categories and their respective keys are applicable for Azure apps, Virtual Machines, Core Virtual Machines, Containers, Container apps, IoT Edge modules, and SaaS offer types. Items in bold italic (like ***analytics***) are categories and standard text items (like data-insights) are subcategories below them. Use the exact key values, without changing spacing or capitalization.

| Category | SaaS keys | Azure App keys | Virtual Machine, Containers, Container apps, IoT Edge Module, Core Virtual Machine keys |
| --- | --- | --- | --- |
| ***Analytics*** | ***analytics*** | ***analytics-azure-apps*** | ***analytics-amp*** |
| Data Insights | data-insights | data-insights | data-insights |
| Data Analytics | data-analytics | data-analytics | data-analytics |
| Big Data | big-data | bigData | big-data |
| Predictive Analytics | predictive-analytics | predictive-analytics | predictive-analytics |
| Real-time/Streaming Analytics | real-time-streaming-analytics | real-time-streaming-analytics | real-time-streaming-analytics |
| Other | other | other-analytics | other |
| ***AI + Machine Learning*** | ***ArtificialIntelligence*** | ***ai-plus-machine-learning*** | ***ai-plus-machine-learning*** |
| Bot Services | bot-services | bot-services | bot-services |
| Cognitive Services | cognitive-services | cognitive-services | cognitive-services |
| ML Service | ml-service | ml-service | ml-service |
| Automated ML | automated-ml | automated-ml | automated-ml |
| Business/Robotic Process Automation | business-robotic-process-automation | business-robotic-process-automation | business-robotic-process-automation |
| Data Labelling | data-labelling | data-labelling | data-labelling |
| Data Preparation | data-preparation | data-preparation | data-preparation |
| Knowledge Mining | knowledge-mining | knowledge-mining | knowledge-mining |
| ML Operations | ml-operations | ml-operations | ml-operations |
| Other | other-AI-plus-machine-learning | other | other |
| ***Blockchain*** | ***blockchain*** | ***blockchain*** | ***blockchain*** |
| App Accelerators | app-accelerators | app-accelerators | app-accelerators |
| Single-node Ledger | single-node-ledger | single-node-ledger | single-node-ledger |
| Multi-node Ledger | multi-node-ledger | multi-node-ledger | multi-node-ledger |
| Tools | tools | tools | tools |
| Other | other | other | other |
| ***Compute*** | ***compute-saas*** | ***compute-azure-apps*** | ***compute*** |
| Application Infrastructure | appInfra | appInfrastructure | application-infrastructure |
| Operating Systems | clientOS | clientOS | operating-systems |
| Cache | cache | cache | cache |
| Other | other-compute | other-compute | other |
| ***Containers*** | ***containers*** | ***containers*** | ***containers*** |
| Container Apps | container-apps | container-apps | container-apps |
| Container Images | container-images | container-images | container-images |
| Get Started with Containers | get-started-with-containers | get-started-with-containers | get-started-with-containers |
| Other | other | other | other |
| ***Databases*** | ***databases-saas*** | ***database*** | ***databases*** |
| NoSQL Databases | nosql-databases | nosql-databases | nosql-databases |
| Relational Databases | relational-databases | relational-databases | relational-databases |
| Ledger/Blockchain Databases | ledger-blockchain-databases | ledger-blockchain-databases | ledger-blockchain-databases |
| Data Lakes | data-lakes | data-lakes | data-lakes |
| Data Warehouse | data-warehouse | data-warehouse | data-warehouse |
| Other | other-databases | other-databases | other |
| ***Developer Tools*** | ***developer-tools-saas*** | ***developer-tools-azure-apps*** | ***developer-tools*** |
| Tools | tools-developer-tools | tools-developer-tools | tools-developer-tools |
| Scripts | scripts | scripts | scripts |
| Developer Service | devService | devService | developer-service |
| Other | other-developer-tools | other-developer-tools | other |
| ***DevOps*** | ***devops*** | ***devops*** | ***devops*** |
| Other | other | other | other |
| ***Identity*** | ***identity*** | ***identity*** | ***identity*** |
| Access management | access-management | access-management | access-management |
| Other | other | other | other |
| ***Integration*** | ***integration*** | ***integration*** | ***integration*** |
| Messaging | messaging | messaging | messaging |
| Other | other | other | other |
| ***Internet of Things*** | ***IoT*** | ***internet-of-things-azure-apps*** | ***internet-of-things*** |
| IoT Core Services | N/A | iot-core-services | iot-core-services |
| IoT Edge Modules | N/A | iot-edge-modules | iot-edge-modules |
| IoT Solutions | iot-solutions | iot-solutions | iot-solutions |
| Data Analytics & Visualization | data-analytics-and-visualization | data-analytics-and-visualization | data-analytics-and-visualization |
| IoT Connectivity | iot-connectivity | iot-connectivity | iot-connectivity |
| Other | other-internet-of-things | other-internet-of-things | other |
| ***IT & Management Tools*** | ***ITandAdministration*** | ***it-and-management-tools-azure-apps*** | ***it-and-management-tools*** |
| Management Solutions | management-solutions | management-solutions | management-solutions |
| Business Applications | businessApplication | businessApplication | business-applications |
| Other | other-it-management-tools | other-it-management-tools | other |
| ***Monitoring & Diagnostics*** | ***monitoring-and-diagnostics*** | ***monitoring-and-diagnostics*** | ***monitoring-and-diagnostics*** |
| Other | other | other | other |
| ***Media*** | ***media*** | ***media*** | ***media*** |
| Media Services | media-services | media-services | media-services |
| Content Protection | content-protection | content-protection | content-protection |
| Live & On-Demand Streaming | live-and-on-demand-streaming | live-and-on-demand-streaming | live-and-on-demand-streaming |
| Other | other | other | other |
| ***Migration*** | ***migration*** | ***migration*** | ***migration*** |
| Data Migration | data-migration | data-migration | data-migration |
| Other | other | other | other |
| ***Mixed Reality*** | ***mixed-reality*** | ***mixed-reality*** | ***mixed-reality*** |
| Other | other | other | other |
| ***Networking*** | ***networking*** | ***networking*** | ***networking*** |
| Appliance Managers | appliance-managers | appliance-managers | appliance-managers |
| Connectivity | connectivity | connectivity | connectivity |
| Firewalls | firewalls | firewalls | firewalls |
| Load Balancers | load-balancers | load-balancers | load-balancers |
| Other | other | other | other |
| ***Security*** | ***security*** | ***security*** | ***security*** |
| Identity & Access Management | identity-and-access-management | identity-and-access-management | identity-and-access-management |
| Threat Protection | threat-protection | threat-protection | threat-protection |
| Information Protection | information-protection | information-protection | information-protection |
| Other | other | other | other |
| ***Storage*** | ***storage-saas*** | ***storage-azure-apps*** | ***storage*** |
| Backup & Recovery | backup | backup | backup-and-recovery |
| Enterprise Hybrid Storage | enterprise-hybrid-storage | enterprise-hybrid-storage | enterprise-hybrid-storage |
| File Sharing | file-sharing | file-sharing | file-sharing |
| Data Lifecycle Management | data-lifecycle-management | data-lifecycle-management | data-lifecycle-management |
| Other | other-storage | other-storage | other |
| ***Web*** | ***web*** | ***web*** | ***web*** |
| Blogs & CMSs | blogs-and-cmss | blogs-and-cmss | blogs-and-cmss |
| Starter Web Apps | starter-web-apps | starter-web-apps | starter-web-apps |
| Ecommerce | ecommerce | ecommerce | ecommerce |
| Web Apps Frameworks | web-apps-frameworks | web-apps-frameworks | web-apps-frameworks |
| Web Apps | web-apps | web-apps | web-apps |
| Other | other | other | other |

### Microsoft AppSource categories

These categories and their respective keys are applicable for SaaS, Power BI app, Dynamics 365 Business Central, Dynamics 365 apps on Dataverse and Power Apps, and Dynamics 365 Operations Apps offer types. Items in bold italic (like ***analytics***) are categories and standard text items (like advanced-analytics) are subcategories below them. Use the exact key values, without changing spacing or capitalization.

| Category | SaaS keys | Dynamics 365 Business Central, Dynamics 365 apps on Dataverse and Power Apps, Dynamics 365 Operations Apps keys | Power BI app keys |
| --- | --- | --- | --- |
| ***Analytics*** | ***analytics*** | ***Analytics*** | ***Analytics*** |
| Advanced Analytics | advanced-analytics | advanced-analytics | advanced-analytics |
| Visualization & Reporting | visualization-reporting | visualization-reporting | visualization-reporting |
| Other | other | other-analytics | other-analytics |
| ***AI + Machine Learning*** | ***ArtificialIntelligence*** | ***ai-plus-machine-learning-dynamics*** | ***ai-plus-machine-learning-appsource*** |
| AI for Business | ai-for-business | ai-for-business | ai-for-business |
| Bot Apps | bot-apps | bot-apps | bot-apps |
| Other | other-ai-plus-machine-learning | other-ai-plus-machine-learning | other-ai-plus-machine-learning |
| ***Collaboration*** | ***Collaboration*** | ***Collaboration*** | ***collaboration*** |
| Contact & People | contact-people | contact-people | contact-and-people |
| Meeting Management | meeting-management | meeting-management | meeting-management |
| Site Design & Management | site-design-management | site-design-management | site-design-and-management |
| Task & Project Management | task-project-management | task-project-management | task-and-project-management |
| Voice & Video Conferencing | voice-video-conferencing | voice-video-conferencing | voice-and-video-conferencing |
| Other | other-collaboration | other-collaboration | other |
| ***Compliance & Legal*** | ***compliance*** | ***compliance*** | ***compliance-and-legal*** |
| Tax & Audit | tax-audit | tax-audit | tax-and-audit |
| Legal | Legal | Legal | legal |
| Data, Governance & Privacy | data-governance-privacy | data-governance-privacy | data-governance-and-privacy |
| Health & Safety | health-safety | health-safety | health-and-safety |
| Other | other-compliance-legal | other-compliance-legal | other |
| ***Customer Service*** | ***CustomerService*** | ***CustomerService*** | ***customer-service*** |
| Contact Center | contact-center | contact-center | contact-center |
| Face to Face Service | face-to-face-service | face-to-face-service | face-to-face-service |
| Back Office & Employee Service | back-office-employee-service | back-office-employee-service | back-office-and-employee-service |
| Knowledge & Case Management | knowledge-case-management | knowledge-case-management | knowledge-and-case-management |
| Social Media & Omnichannel Engagement | social-media-omnichannel-engagement | social-media-omnichannel-engagement | social-media-and-omnichannel-engagement |
| Other | other-customer-service | other-customer-service | other |
| ***Finance*** | ***Finance*** | ***Finance*** | ***finance*** |
| Accounting | accounting | accounting | accounting |
| Asset Management | asset-management | asset-management | asset-management |
| Analytics, Consolidation & Reporting | analytics-consolidation-reporting | analytics-consolidation-reporting | analytics-consolidation-and-reporting |
| Credit & Collections | credit-collections | credit-collections | credit-and-collections |
| Compliance & Risk Management | compliance-risk-management | compliance-risk-management | compliance-and-risk-management |
| Other | other-finance | other-finance | other |
| ***Human Resources*** | ***HumanResources*** | ***HumanResources*** | ***human-resources*** |
| Talent Acquisition | talent-acquisition | talent-acquisition | talent-acquisition |
| Talent Management | talent-management | talent-management | talent-management |
| HR Operations | hr-operations | hr-operations | hr-operations |
| Workforce Planning & Analytics | workforce-planning-analytics | workforce-planning-analytics | workforce-planning-and-analytics |
| Other | other-human-resources | other-human-resources | other |
| ***Internet of Things*** | ***IoT*** | ***internet-of-things-dynamics*** | ***internet-of-things-appsource*** |
| Asset Management & Operations | asset-management-operations | asset-management-operations | asset-management-and-operations |
| Connected Products | connected-products | connected-products | connected-products |
| Intelligent Supply Chain | intelligent-supply-chain | intelligent-supply-chain | intelligent-supply-chain |
| Predictive Maintenance | predictive-maintenance | predictive-maintenance | predictive-maintenance |
| Remote Monitoring | remote-monitoring | remote-monitoring | remote-monitoring |
| Safety & Security | safety-security | safety-security | safety-and-security |
| Smart Infrastructure & Resources | smart-infrastructure-resources | smart-infrastructure-resources | smart-infrastructure-and-resources |
| Vehicles & Mobility | vehicles-mobility | vehicles-mobility | vehicles-and-mobility |
| Other | other-internet-of-things | other-internet-of-things | other |
| ***IT & Management Tools*** | ***ITandAdministration*** | ***ITandAdministration*** | ***it-and-management-tools*** |
| Management Solutions | management-solutions | management-solutions | management-solutions |
| Business Applications | businessApplication | businessApplication | business-applications |
| Other | other-it-management-tools | other-it-management-tools | other |
| ***Marketing*** | ***Marketing*** | ***Marketing*** | ***marketing*** |
| Advertisement | advertisement | advertisement | advertisement |
| Analytics | analytics-marketing | analytics-marketing | analytics-marketing |
| Campaign Management & Automation | campaign-management-automation | campaign-management-automation | campaign-management-and-automation |
| Email Marketing | email-marketing | email-marketing | email-marketing |
| L2 -Events & Resource Management | events-resource-management | events-resource-management | events-and-resource-management |
| Research & Analysis | research-analytics | research-analytics | research-and-analysis |
| Social Media | social-media | social-media | social-media |
| Other | other-marketing | other-marketing | other |
| ***Operations & Supply Chain*** | ***OperationsSupplyChain*** | ***OperationsSupplyChain*** | ***operations-and-supply-chain*** |
| Asset & Production Management | asset-production-management | asset-production-management | asset-and-production-management |
| Demand Forecasting | demand-forecasting | demand-forecasting | demand-forecasting |
| Information Management & Connectivity | information-management-connectivity | information-management-connectivity | information-management-and-connectivity |
| Planning, Purchasing & Reporting | planning-purchasing-reporting | planning-purchasing-reporting | planning-purchasing-and-reporting |
| Quality & Service Management | quality-service-management | quality-service-management | quality-and-service-management |
| Sales & Order Management | sales-order-management | sales-order-management | sales-and-order-management |
| Transportation & Warehouse Management | transportation-warehouse-management | transportation-warehouse-management | transportation-and-warehouse-management |
| Other | other-operations-supply-chain | other-operations-supply-chain | other |
| ***Productivity*** | ***Productivity*** | ***Productivity*** | ***productivity*** |
| Content Creation & Management | content-creation-management | content-creation-management | content-creation-and-management |
| Language & Translation | language-translation | language-translation | language-and-translation |
| Document Management | document-management | document-management | document-management |
| Email Management | email-management | email-management | email-management |
| Search & Reference | search-reference | search-reference | search-and-reference |
| Other | other-productivity | other-productivity | other |
| Gamification | Gamification | Gamification | gamification |
| ***Sales*** | ***Sales*** | ***Sales*** | ***Sales*** |
| Telesales | telesales | telesales | telesales |
| Configure, Price, Quote (CPQ) | configure-price-quote | configure-price-quote | configure-price-quote |
| Contract Management | contract-management | contract-management | contract-management |
| CRM | crm | crm | crm |
| E-commerce | e-commerce | e-commerce | e-commerce |
| Business Data Enrichment | business-data-enrichment | business-data-enrichment | business-data-enrichment |
| Sales Enablement | sales-enablement | sales-enablement | sales-enablement |
| Other | other-sales | other-sales | other-sales |
| ***Geolocation*** | ***geolocation*** | ***geolocation*** | ***geolocation*** |
| Maps | maps | maps | maps |
| News & Weather | news-and-weather | news-and-weather | news-and-weather |
| Other | other-geolocation | other-geolocation | other-geolocation |

### Microsoft AppSource industries

These industries and their respective keys are applicable for SaaS, Power BI app, Dynamics 365 Business Central, Dynamics 365 apps on Dataverse and Power Apps, and Dynamics 365 Operations Apps offer types. Items in bold italic (like ***Automotive***) are categories and standard text items (like AutomotiveL2) are subcategories below them. Use the exact key values, without changing spacing or capitalization.

| Industry | SaaS, Dynamics 365 Business Central, Dynamics 365 apps on Dataverse and Power Apps, Dynamics 365 Operations Apps keys | Power BI apps keys |
| --- | --- | --- |
| ***Automotive*** | ***Automotive*** | ***automotive*** |
| Automotive | AutomotiveL2 | AutomotiveL2 |
| ***Agriculture*** | ***Agriculture*** | ***agriculture*** |
| Other - Unsegmented | Agriculture\_OtherUnsegmented | other-unsegmented |
| ***Distribution*** | ***Distribution*** | ***distribution*** |
| Wholesale | Wholesale | wholesale |
| Parcel & Package Shipping | ParcelAndPackageShipping | parcel-and-package-shipping |
| ***Education*** | ***Education*** | ***education*** |
| Higher Education | HigherEducation | higher-education |
| Primary & Secondary Education / K-12 | PrimaryAndSecondaryEducationK12 | primary-and-secondary-education |
| Libraries & Museums | LibrariesAndMuseums | libraries-and-museums |
| ***Financial Services*** | ***FinancialServices*** | ***financial-services*** |
| Banking & Capital Markets | BankingAndCapitalMarkets | banking-and-capital-markets |
| Insurance | Insurance | insurance |
| ***Government*** | ***Government*** | ***government*** |
| Defense & Intelligence | DefenseAndIntelligence | defense-and-intelligence |
| Public Safety & Justice | PublicSafetyAndJustice | public-safety-and-justice |
| Civilian Government | CivilianGovernment | civilian-government |
| ***Healthcare*** | ***HealthCareandLifeSciences*** | ***healthcare*** |
| Health Payor | HealthPayor | health-payor |
| Health Provider | HealthProvider | health-provider |
| Pharmaceuticals | Pharmaceuticals | pharmaceuticals |
| ***Manufacturing & Resources*** | ***Manufacturing*** | ***manufacturing-and-resources*** |
| Chemical & Agrochemical | ChemicalAndAgrochemical | chemical-and-agrochemical |
| Discrete Manufacturing | DiscreteManufacturing | discrete-manufacturing |
| Energy | Energy | energy |
| ***Retail & Consumer Goods*** | ***RetailandConsumerGoods*** | ***retail-and-consumer-goods*** |
| Consumer Goods | ConsumerGoods | consumer-goods |
| Retailers | Retailers | retailers |
| ***Media & Communications*** | ***MediaAndCommunications*** | ***media-and-communications*** |
| Media & Entertainment | MediaandEntertainment | media-and-entertainment |
| Telecommunications | Telecommunications | telecommunications |
| ***Professional Services*** | ***ProfessionalServices*** | ***professional-services*** |
| Legal | Legal | legal |
| Partner Professional Services | PartnerProfessionalServices | partner-professional-services |
| ***Architecture & Construction*** | ***ArchitectureAndConstruction*** | ***architecture-and-construction*** |
| Other - Unsegmented | ArchitectureAndConstruction\_OtherUnsegmented | other-unsegmented |
| ***Hospitality & Travel*** | ***HospitalityandTravel*** | ***hospitality-and-travel*** |
|    Hotels & Leisure | HotelsAndLeisure | hotels-and-leisure |
| Travel & Transportation | TravelAndTransportation | travel-and-transportation |
| Restaurants & Food Services | RestaurantsAndFoodServices | restaurants-and-food-services |
| ***Other Public Sector Industries*** | ***OtherPublicSectorIndustries*** | ***other-public-sector-industries*** |
| Forestry & Fishing | ForestryAndFishing | forestry-and-fishing |
| Nonprofits | Nonprofits | nonprofits |
| ***Real Estate*** | ***RealEstate*** | ***real-estate*** |
| Other - Unsegmented | RealEstate\_OtherUnsegmented | other-unsegmented |
