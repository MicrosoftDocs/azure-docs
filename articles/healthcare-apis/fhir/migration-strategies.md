---
title: Migration strategies
description: Learn how to migrate FHIR data from Azure API for FHIR to the Azure Health Data Services FHIR service. This article provides steps and tools for a smooth transition.
services: healthcare-apis
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: tutorial
ms.author: evach
author: evachen96
ms.date: 9/27/2023
---

# Migration strategies for moving from Azure API for FHIR

[!INCLUDE [retirement banner](../includes/healthcare-apis-azure-api-fhir-retirement.md)]

Azure Health Data Services FHIR service is the next-generation platform for health data integration. It offers managed, enterprise-grade FHIR, DICOM, and MedTech services for diverse health data exchange. 

By migrating their FHIR data from Azure API for FHIR to Azure Health Data Services FHIR service, organizations can benefit from improved performance, scalability, security, and compliance. Organizations can also access new features and capabilities that are not available in Azure API for FHIR. 

Azure API for FHIR will be retired on September 30, 2026, so you need to migrate your FHIR data to Azure Health Data Services FHIR service as soon as feasible. To make the process easier, we created some tools and tips that will help you assess your readiness, prepare your data, migrate your applications, and cutover to the new service.

## Recommended Approach

At a high level, the recommended approach is:

-   Step 1: Assess Readiness
-   Step 2: Prepare to migrate
-   Step 3: Migrate data and application workloads
-   Step 4: Cutover from Azure API for FHIR to Azure Health Data Services

## 1) Assess Readiness

-   Learn about Azure Health Data Services [here.](https://learn.microsoft.com/en-us/azure/healthcare-apis/fhir/)
-   Compare the capabilities of Azure API for FHIR with Azure Health Data Services. *(insert link to below table TODO)*

| **Areas**               | **Azure API for FHIR**                                                                                                                                                 | **Azure Health Data Services**                                                                                                                                                              |
|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Settings**            | *Supported :*  *Local RBAC*  *SMART on FHIR Proxy*                                                                                                                     | *Planned deprecation:*  *Local RBAC (9/6/23)* *SMART on FHIR Proxy (9/21/26)*                                                                                                               |
| **Data storage Volume** | *More than 4TB*                                                                                                                                                        | *Current support is 4TB.a need for more than 4TB.*                                                                                                                                          |
| **Data Ingress**        | *Tools available in OSS*                                                                                                                                               | *Import operation*                                                                                                                                                                          |
| **Autoscaling**         | *Supported on request and incurs charge*                                                                                                                               | *Enabled by default and no additional charge*                                                                                                                                               |
| **Search Parameters**   | *Bundle type supported: Batch*  *Include and revinclude, iterate modifier not supported*  *Sorting supported by first name, last name , birthdate and clinical date.*  | *Bundle Type supported: Batch and Transaction.*  *Selectable search parameters*  *Include and revinclude, iterate modifier is supported*  *Sorting supported by string and dateTime fields* |
| **Events**              | *Not Supported*                                                                                                                                                        | *Supported*                                                                                                                                                                                 |
| **Infrastructure**      | *Supported* *Customer Managed Keys* *AZ Support and PITR* *Cross Region DR*                                                                                            | *Supported : Data Recovery* *Upcoming*  *AZ support*  *Customer Managed Keys*                                                                                                               |

Only the capabilities that differ between the two products are called out above.

-   Review your architecture and assess if any changes need to be made.
    -   Things to consider that may affect your architecture:
        -   Sync Agent is being deprecated. If you were using Sync Agent to connect to Dataverse, please see [Overview of Data integration toolkit \| Microsoft Learn](https://learn.microsoft.com/en-us/dynamics365/industry/healthcare/data-integration-toolkit-overview?toc=%2Findustry%2Fhealthcare%2Ftoc.json&bc=%2Findustry%2Fbreadcrumb%2Ftoc.json)
        -   FHIR Proxy is being deprecated. If you were using FHIR Proxy for eventing in , please refer to the new [eventing](https://learn.microsoft.com/en-us/azure/healthcare-apis/events/events-overview) feature built in. Alternatives can also be customized and built using the new [Azure Health Data Services Toolkit](https://github.com/microsoft/azure-health-data-services-toolkit).
        -   SMART on FHIR proxy is being deprecated. You will need to use the new SMART on FHIR capability, more information here: <https://learn.microsoft.com/en-us/azure/healthcare-apis/fhir/smart-on-fhir>
        -   
        -   Azure Health Data Services FHIR Service does not support local RBAC and custom authority. The token issuer authority will have to be the authentication endpoint for the tenant that the FHIR Service is running in.
        -   IoT Connector migration:
            -   The IoT connector is only supported using an [Azure API for FHIR](https://docs.microsoft.com/azure/healthcare-apis/azure-api-for-fhir/overview) service. The IoT Connector is succeeded by the MedTech service. You will need to deploy a MedTech service and corresponding FHIR service within an existing or new Azure Health Data Services workspace and point your devices to the new Azure Events Hubs device event hub. You can utilize their existing IoT connector device and destination mapping files with the MedTech service deployment if you choose. If you want to migrate existing IoT connector device FHIR data from your Azure API for FHIR service to the new AHDS FHIR service, you can accomplish this using the bulk export and import functionality using the Migration tool \<Add URL for Migration Guidance and github repository\>. Another migration path would be to deploy a new MedTech service and replay the IoT device messages through the MedTech service.

## 2) Prepare to migrate

-   Create a migration plan.
    -   We recommend the following migration patterns. Depending on your organization’s tolerance for downtime, you may choose to use certain migration patterns and tools to help facilitate your migration.

| Migration Pattern | Details                                                                                                                                                                                          | How?                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
|-------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Lift and Shift    | The simplest pattern. Ideal if your data pipelines can afford large downtime.                                                                                                                    | Choose the option that works best for your organization: Configure a workflow to [\$export](https://learn.microsoft.com/en-us/azure/healthcare-apis/azure-api-for-fhir/export-data) your data on Azure API for FHIR, then [\$import](https://learn.microsoft.com/en-us/azure/healthcare-apis/fhir/configure-import-data) into Azure Health Data Services FHIR Service. The Github repo has some tips on running these commands, as well as a script to help automate creating the \$import payload [here](https://github.com/Azure/apiforfhir-migration-tool/blob/main/v0/V0_README.md).  Or, you can create your own tool to migrate the data using \$export and \$import. |
| Incremental copy  | Continuous version of lift and shift, with less downtime. Ideal for large amounts of data that take longer to copy, or if you want to continue running Azure API for FHIR during the migration.  | Choose the option that works best for your organization: We have created an OSS migration tool that can help with this migration pattern (insert link to github) Or, you can create your own tool to migrate the data in an incremental fashion.                                                                                                                                                                                                                                                                                                                                                                                                                            |

-   If you choose to use the OSS migration tool, review and understand the migration tool’s capabilities and limitations (*insert link to Github below).*
-   Prepare Azure API for FHIR server
    -   Identify data to migrate.
        -   Take this opportunity to clean up data or FHIR servers that you no longer use.
        -   Decide if you want to migrate historical versions or not. See below “Deploy a new Azure Health Data Services FHIR Service server” for more information.
    -   If you’re planning to use the migration tool:
        -   See “Azure API for FHIR preparation” (link to github below) for additional things to note.
-   Deploy a new Azure Health Data Services FHIR Service server
    -   Deploy an Azure Health Data Services Workspace first
    -   Then deploy a Azure Health Data Services FHIR Service server ([Deploy a FHIR service within Azure Health Data Services \| Microsoft Learn)](https://learn.microsoft.com/en-us/azure/healthcare-apis/fhir/fhir-portal-quickstart)
        -   Configure your new Azure Health Data Services FHIR Service server. If you’d like to use the same configurations that you had in Azure API for FHIR for your new Azure Health Data Services FHIR Service server, see a recommended list of what to check for here (link to Github section [Migration Tool Documentation.docx](https://microsoft.sharepoint.com/:w:/t/msh/Eb7WohSv_6JNlG1xAI8TyvoBbAPfhxnPzr4wv9py1InEww?e=QeSbo3&nav=eyJoIjoiMTUwODIzNzMifQ)) Configure settings that are needed “pre-migration”.

## 3) Migrate data

-   Choose the migration pattern that works best for your organization. (link to above table for migration patterns)
    -   If you are using OSS migration tools, please follow instructions on Github (*Insert link to Github documentation)*

## 4) Migrate applications and reconfigure settings

-   Migrate applications that were pointing to the old FHIR server.
    -   Change the endpoints on your applications so that they point to the new FHIR server’s URL.
        -   (insert link on how to find the new server’s URL)
    -   Set up permissions again for these apps.
        -   <https://learn.microsoft.com/en-us/azure/storage/blobs/assign-azure-role-data-access>
-   Reconfigure any remaining settings in the new Azure Health Data Services FHIR Service server “post-migration” (Insert link below)
    -   If you’d like to doublecheck to make sure that the Azure Health Data Services FHIR Service and Azure API for FHIR servers have the same configurations, you can check both [metadata endpoints](https://learn.microsoft.com/en-us/azure/healthcare-apis/fhir/use-postman#get-capability-statement) to compare and contrast the two servers.
-   Set up any jobs that were previously running in your old Azure API for FHIR server (for example, \$export jobs)

### 

## 5) Cutover from Azure API for FHIR to Azure Health Data Services FHIR Service

After you’re confident that your Azure Health Data Services FHIR Service server is stable, you can begin using Azure Health Data Services FHIR Service to satisfy your business scenarios. Turn off any remaining pipelines that are running on Azure API for FHIR, delete data from the intermediate storage account that was used in the migration tool (if you used it), delete data from your Azure API for FHIR server, and decommission your Azure API for FHIR account.

## Appendix

## Azure API for FHIR and Azure Health Data Services capabilities

# FAQ

(to be added as first response to Q&A page also)

-   When will Azure API for FHIR be retired?

Azure API for FHIR will be retired on 30 September 2026.

-   Why are we retiring Azure API for FHIR?

Azure API for FHIR is a service that was purpose built for protected health information (PHI), meeting regional compliance requirements. In March 2022, we announced the general availability of [Azure Health Data Services](https://learn.microsoft.com/en-us/azure/healthcare-apis/healthcare-apis-overview), that enables quick deployment of managed, enterprise-grade FHIR, DICOM, and MedTech services for diverse health data integration. See below for detailed benefits of migrating to Azure Health Data Services FHIR service. With this new experience, we’re retiring Azure API for FHIR

-   What are the benefits of migrating to Azure Health Data Services FHIR service?

AHDS FHIR service offers a rich set of capabilities such as

-   Consumption-based pricing model where customers pay only for used storage & throughput
-   Support for transaction bundles
-   Chained search improvements
-   Improved ingress & egress of data with \$import, \$export including new features such as incremental import (preview)
-   Events to trigger new workflows when FHIR resources are created, updated or deleted
-   Connectors to Azure Synapse Analytics, Power BI and Azure Machine Learning for enhanced analytics
-   SMART on FHIR Proxy is planned for deprecation in Gen2, as we migrate from Gen1 what are the steps for enabling SMART on FHIR in Gen2?

SMART on FHIR proxy will be retiring, please transition to the SMART on FHIR (Enhanced) which uses Azure Health Data and AI OSS samples by **21 September 2026**. After 21 September 2026, applications relying on SMART on FHIR proxy will report errors in accessing the FHIR service.

SMART on FHIR (Enhanced) provides added capabilities than SMART on FHIR proxy and can be considered to meet requirements with SMART on FHIR Implementation Guide (v 1.0.0) and §170.315(g)(10) Standardized API for patient and population services criterion.

-   What will happen after the service is retired on 30 September 2026?

Customers will not be able to do the following:

-   Create or manage Azure API for FHIR accounts
-   Access the data through the Azure portal or APIs/SDKs/client tools
-   Receive service updates to Azure API for FHIR or APIs/SDKs/client tools
-   Access customer support (phone, email, web)
-   Where can customers go to learn more about migrating to Azure Health Data Services FHIR service?

You can start with \<Link to Azure Docs migration guidance \> to learn more about Azure API for FHIR to Azure Health Data Services FHIR service migration. Please be advised that the migration from Azure API for FHIR to Azure Health Data Services FHIR service involves data migration as well updating the applications to use Azure Health Data Services FHIR service. You can find more documentation on the step-by-step approach to migrating your data and applications in this migration tool \<Link to github repo\>.

-   Where can customers go for answers to questions?

Customers have multiple options to get answers to questions.

-   Get answers from community experts in Microsoft Q&A \<Link to Microsoft Q&A Page\><mailto:APIforFHIRtoAHDSFHIRMigrationQA@service.microsoft.com>
-   If you have a support plan and require technical support, please [contact us.](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest)
1.  Under Issue type, select Technical.
2.  Under Subscription, select your subscription.
3.  Under Service, click My services, then Azure API for FHIR
4.  Under Summary, type a description of your issue.
5.  Under Problem type, Troubleshoot configuration issue
6.  Under Problem subtype, my issue is not listed

TODO when to use CSS vs use github issues

