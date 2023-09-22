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

By migrating your FHIR data from Azure API for FHIR to Azure Health Data Services FHIR service, your organization can benefit from improved performance, scalability, security, and compliance. Organizations can also access new features and capabilities that are not available in Azure API for FHIR. 

Azure API for FHIR will be retired on September 30, 2026, so you need to migrate your FHIR data to Azure Health Data Services FHIR service as soon as feasible. To make the process easier, we created some tools and tips to help you assess your readiness, prepare your data, migrate your applications, and cut over to the new service.

## Recommended approach

To migrate your data, follow these steps:

- Step 1: Assess readiness
- Step 2: Prepare to migrate
- Step 3: Migrate data and application workloads
- Step 4: Cut over from Azure API for FHIR to Azure Health Data Services

## Step 1: Assess readiness

Compare the differences between Azure API for FHIR and Azure Health Data Services. Also review your architecture and assess if any changes need to be made.
 
| **Capabilities**               | **Azure API for FHIR**                                                                                                                                             | **Azure Health Data Services**                                                                                                                                                            |   |   |
|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---|---|
| **Settings**            | Supported:   Local RBAC   • SMART on FHIR Proxy                                                                                                                  | Planned deprecation - Local RBAC (9/6/23)  - SMART on FHIR Proxy (9/21/26)                                                                                                                |   |   |
| **Data storage Volume** | More than 4TB                                                                                                                                                       | Current support is 4 TB. Reach out to CSS team if you need more than 4 TB.                                                                                                                |   |   |
| **Data ingress**        | Tools available in OSS                                                                                                                                             | $import operation                                                                                                                                                                         |   |   |
| **Autoscaling**         | Supported on request and incurs charge                                                                                                                             | Enabled by default at no additional charge                                                                                                                                                |   |   |
| **Search parameters**   | - Bundle type supported: Batch - Include and revinclude, iterate modifier not supported  - Sorting supported by first name, last name, birthdate and clinical date | - Bundle Type supported: Batch and transaction  - Selectable search parameters  - Include, revinclude,and iterate modifier is supported - Sorting supported by string and dateTime fields |   |   |
| **Events**              | Not Supported                                                                                                                                                      | Supported                                                                                                                                                                                 |   |   |
| **Infrastructure**      | Supported: - Customer managed keys  - AZ support and PITR  - Cross region DR                                                                                       | Supported - Data recovery - Upcoming: -- AZ support -- Customer managed keys                                                                                                              |   |   |


### Things to consider that may affect your architecture

- **Sync agent is being deprecated**. If you're using sync agent to connect to Dataverse, see [Overview of data integration toolkit](https://learn.microsoft.com/dynamics365/industry/healthcare/data-integration-toolkit-overview?toc=%2Findustry%2Fhealthcare%2Ftoc.json&bc=%2Findustry%2Fbreadcrumb%2Ftoc.json)

- **FHIR Proxy is being deprecated**. If you're using FHIR Proxy for events, refer to the built-in [eventing](https://learn.microsoft.com/azure/healthcare-apis/events/events-overview) feature. Alternatives can be customized and built using the [Azure Health Data Services toolkit](https://github.com/microsoft/azure-health-data-services-toolkit).

- **SMART on FHIR proxy is being deprecated**. You need to use the new SMART on FHIR capability. More information: [SMART on FHIR](/healthcare-apis/fhir/smart-on-fhir)

- **Azure Health Data Services FHIR Service does not support local RBAC and custom authority**. The token issuer authority will have to be the authentication endpoint for the tenant that the FHIR Service is running in.

- **The IoT connector is only supported using an [Azure API for FHIR](https://docs.microsoft.com/azure/healthcare-apis/azure-api-for-fhir/overview) service**. The IoT connector is succeeded by the MedTech service. You need to deploy a MedTech service and corresponding FHIR service within an existing or new Azure Health Data Services workspace and point your devices to the new Azure Events Hubs device event hub. Use the existing IoT connector device and destination mapping files with the MedTech service deployment.

If you want to migrate existing IoT connector device FHIR data from your Azure API for FHIR service to the Azure Health Data Services FHIR service, use the bulk export and import functionality in the migration tool. Another migration path would be to deploy a new MedTech service and replay the IoT device messages through the MedTech service.

## Step 2: Prepare to migrate

First, create a migration plan. We recommend the migration patterns described in the table. Depending on your organization’s tolerance for downtime, you may decide to use certain patterns and tools to help facilitate your migration.

| Migration Pattern | Details                                                                                                                                                                                          | How?                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
|-------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Lift and shift    | The simplest pattern. Ideal if your data pipelines can afford longer downtime.                                                                                                                    | Choose the option that works best for your organization: Configure a workflow to [\$export](https://learn.microsoft.com/azure/healthcare-apis/azure-api-for-fhir/export-data) your data on Azure API for FHIR, and then [\$import](https://learn.microsoft.com/azure/healthcare-apis/fhir/configure-import-data) into Azure Health Data Services FHIR Service. The [Github repo](https://github.com/Azure/apiforfhir-migration-tool/blob/main/v0/V0_README.md) provides tips on running these commands, as well as a script to help automate creating the \$import payload.  Or, create your own tool to migrate the data using \$export and \$import. |
| Incremental copy  | Continuous version of lift and shift, with less downtime. Ideal for large amounts of data that take longer to copy, or if you want to continue running Azure API for FHIR during the migration.  | Choose the option that works best for your organization. We created an [OSS migration tool](https://github.com/Azure/apiforfhir-migration-tool/blob/main/v0/V0_README.md) to help with this migration pattern. Or, create your own tool to migrate the data incrementally.                                                                                                                                                                                                                                                                                                                                                                                                                            

## Use the OSS migration tool

If you decide to use the OSS migration tool, review and understand the migration tool’s capabilities and limitations.
-   Prepare Azure API for FHIR server
    -   Identify data to migrate.
        -   Take this opportunity to clean up data or FHIR servers that you no longer use.
        -   Decide if you want to migrate historical versions or not. See below “Deploy a new Azure Health Data Services FHIR Service server” for more information.
    -   If you’re planning to use the migration tool:
        -   See “Azure API for FHIR preparation” (link to github below) for additional things to note.
-   Deploy a new Azure Health Data Services FHIR Service server
    -   Deploy an Azure Health Data Services Workspace first
    -   Then deploy a Azure Health Data Services FHIR Service server ([Deploy a FHIR service within Azure Health Data Services \| Microsoft Learn)](https://learn.microsoft.com/azure/healthcare-apis/fhir/fhir-portal-quickstart)
        -   Configure your new Azure Health Data Services FHIR Service server. If you’d like to use the same configurations that you had in Azure API for FHIR for your new Azure Health Data Services FHIR Service server, see a recommended list of what to check for here (link to Github section [Migration Tool Documentation.docx](https://microsoft.sharepoint.com/:w:/t/msh/Eb7WohSv_6JNlG1xAI8TyvoBbAPfhxnPzr4wv9py1InEww?e=QeSbo3&nav=eyJoIjoiMTUwODIzNzMifQ)) Configure settings that are needed “pre-migration”.

## 3) Migrate data

-   Choose the migration pattern that works best for your organization. 
    -   If you are using OSS migration tools, please follow instructions on Github.
    - 
## 4) Migrate applications and reconfigure settings

-   Migrate applications that were pointing to the old FHIR server.
    -   Change the endpoints on your applications so that they point to the new FHIR server’s URL.
        -   (insert link on how to find the new server’s URL)
    -   Set up permissions again for these apps.
        -   <https://learn.microsoft.com/azure/storage/blobs/assign-azure-role-data-access>
-   Reconfigure any remaining settings in the new Azure Health Data Services FHIR Service server “post-migration” (Insert link below)
    -   If you’d like to doublecheck to make sure that the Azure Health Data Services FHIR Service and Azure API for FHIR servers have the same configurations, you can check both [metadata endpoints](https://learn.microsoft.com/azure/healthcare-apis/fhir/use-postman#get-capability-statement) to compare and contrast the two servers.
-   Set up any jobs that were previously running in your old Azure API for FHIR server (for example, \$export jobs)

## 5) Cut over to Azure Health Data Services FHIR Services

After you’re confident that your Azure Health Data Services FHIR Service server is stable, you can begin using Azure Health Data Services FHIR Service to satisfy your business scenarios. Turn off any remaining pipelines that are running on Azure API for FHIR, delete data from the intermediate storage account that was used in the migration tool (if you used it), delete data from your Azure API for FHIR server, and decommission your Azure API for FHIR account.
