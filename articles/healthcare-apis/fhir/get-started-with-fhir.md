---
title: Get started with the FHIR service in Azure Health Data Services
description: Learn how to set up the FHIR service in Azure Health Data Services with steps to create workspaces, register apps, and manage data.
author: expekesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: quickstart
ms.date: 06/11/2026
ms.author: kesheth
ai-usage: ai-assisted
ms.custom:
  - mode-api
  - sfi-image-blocked
---

# Get started with the FHIR service

This article outlines the basic steps to get started with the FHIR&reg; service in [Azure Health Data Services](../healthcare-apis-overview.md).


:::image type="content" source="media/get-started-with-fhir.png" alt-text="Get started with the FHIR service flow diagram." lightbox="media/get-started-with-fhir.png":::

## Prerequisites

To complete the steps in this article, you need:
- An [Azure subscription](https://azure.microsoft.com/free/).
- Permissions to create resources in the Azure subscription. 
- An Azure Health Data Services workspace. To create and deploy a workspace, see [Deploy workspace in the Azure portal](../healthcare-apis-quickstart.md).
- A FHIR service instance. You can create a [FHIR service instance in the Azure portal](deploy-azure-portal.md).   

## Access the FHIR service

Microsoft Entra ID secures the FHIR service and you can't disable it. To access the service API, you must create a client application (also referred to as a service principal) in Microsoft Entra ID, and grant it the right permissions.

### Register a client application

Create or register a client application from the [Azure portal](../register-application.md), or by using PowerShell or Azure CLI scripts. Use this client application for one or more FHIR service instances. You can also use it for DICOM services in Azure Health Data Services.

If you create the client application with a certificate or client secret, renew the certificate or client secret before expiration and replace the client credentials in your applications.

You can delete a client application. Before you delete a client application, ensure it isn't used in production, dev, test, or quality assurance (QA) environments.

### Grant access permissions

You can grant access permissions or assign roles in the [Azure portal](../configure-azure-rbac.md), or by using [PowerShell and Azure CLI scripts](../configure-azure-rbac-using-scripts.md).

### Perform create, read, update, and delete (CRUD) transactions

You can perform Create, Read (search), Update, and Delete - CRUD - transactions against the FHIR service in your applications or by using tools such as REST Client and cURL. Because the FHIR service is secured by default, you need to obtain an access token and include it in your transaction request.

#### Get an access token

You can obtain a Microsoft Entra access token by using PowerShell, Azure CLI, REST CCI, or .NET SDK. For more information, see [Get an access token](../get-access-token.md).

#### Access using existing tools

- [REST Client](using-rest-client.md)
- [cURL](using-curl.md)
- There are tools available online that offer intuitive interfaces for API testing and development. To use tools for accessing the FHIR service, refer to the open-source sample. [Starter collection of FHIR sample queries](https://github.com/Azure-Samples/azure-health-data-services-samples/tree/main/samples/sample-postman-queries) 

#### Load data

You can load data directly using the POST or PUT method against the FHIR service. To bulk load data, use the $import operation. For information, see [import operation](import-data.md).

### CMS, search, profile validation, and reindex

To learn more about how to configure the FHIR service for the Centers for Medicare and Medicaid Services (CMS) Interoperability and Patient Access rule, see [Centers for Medicare and Medicaid Services (CMS) Interoperability and Patient Access rule](centers-for-medicare-tutorial-introduction.md).   

To learn more about search parameters, see [Selectable search parameters for the FHIR service in Azure Health Data Services](selectable-search-parameters.md) and [Custom search parameters](how-to-do-custom-search.md). In cases where you need to reindex your FHIR service database, see [Running a reindex job](how-to-run-a-reindex.md).

The FHIR service in Azure Health Data Services allows you to validate resources against profiles to see if the resources conform to the profiles. For more information, see [Validate FHIR resources against profiles in Azure Health Data Services](validation-against-profiles.md).

### Export data

Optionally, you can [export data](export-data.md) to Azure Storage and use it in your analytics or machine-learning projects. You can export the data "as-is" or [de-identified](deidentified-export.md) in `ndjson` format. 

### Convert data

Optionally, you can [convert data](convert-data-overview.md) from HL7 v2 and other formats to FHIR R4.

### Using FHIR data in Power BI dashboard

Optionally, you can create Power BI dashboard reports with FHIR data. For more information, see [Power Query connector for FHIR](/power-query/connectors/fhir/fhir).


## Next step

> [!div class="nextstepaction"]
> [Deploy a FHIR service in Azure Health Data Services](deploy-azure-portal.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
