---
title: Introduction to Azure Health Data Services
description: Learn how Azure Health Data Services empowers healthcare organizations to manage data securely, support interoperability, and enable analytics.
author: msjasteppe
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: conceptual
ms.date: 06/10/2024
ms.author: jasteppe
---

# Introduction to Azure Health Data Services

Azure Health Data Services offers a suite of technologies that empower healthcare organizations to manage health data securely and compliantly. Azure Health Data Services streamlines the handling of various health data types, supports interoperability, and enables advanced analytics.

## Get an Azure account

Before you create a workspace in the Azure portal, you need an Azure account subscription. For more information, see [Create your free Azure account today](https://azure.microsoft.com/free/search/?OCID=AID2100131_SEM_c4b0772dc7df1f075552174a854fd4bc:G:s&ef_id=c4b0772dc7df1f075552174a854fd4bc:G:s&msclkid=c4b0772dc7df1f075552174a854fd4bc). 

## The role of workspaces

Workspaces in Azure Health Data Services serve as logical containers for instances of the FHIR&reg; service, DICOM&reg; service, and MedTech service. Workplaces ensure healthcare data is managed within a secure boundary, adhering to HIPAA and HITRUST standards.

After you deploy the Azure Health Data Services resource group, enter the workspace subscription and instance details. For steps, see [Deploy an Azure Health Data Services workspace by using the Azure portal](healthcare-apis-quickstart.md).

> [!NOTE] 
> You can deploy multiple data services within a workspace, and by design they work seamlessly with one another. Use a workspace to organize all your organization's Azure Health Data Services instances and manage configuration settings that are shared among all the underlying datasets and services where it's applicable. 

:::image type="content" source="media/health-data-services-workspace.png" alt-text="Screenshot showing the Azure Health Data Services workspace." lightbox="media/health-data-services-workspace.png#lightbox":::

## The role of resource groups 

To use Azure Health Data Services, you need to [create a resource](https://portal.azure.com/#create/hub) in the Azure portal. Enter **Azure Health Data Services** in the **Search services and marketplace** box. Resource groups function as organizational units that group related services and instances.

:::image type="content" source="media/healthcare-apis-quickstart/search-services-marketplace.png" alt-text="Screenshot showing the Azure search services and marketplace text box." lightbox="media/healthcare-apis-quickstart/search-services-marketplace.png":::

After you locate the Azure Health Data Services resource, select **Create**.

:::image type="content" source="media/healthcare-apis-quickstart/create-health-data-services-resource.png" alt-text="Image alt text." lightbox="media/healthcare-apis-quickstart/create-health-data-services-resource.png":::

## User access and permissions

Azure Health Data Services is a collection of secured managed services using Microsoft Entra ID. For Azure Health Data Services to access Azure resources such as storage accounts and event hubs, you need to enable the system managed identity, and grant proper permissions to it. Client applications are registered in the Microsoft Entra ID and can be used to access the Azure Health Data Services. User data access controls are managed in the applications or services that implement business logic.

Authenticated users and client applications of the Azure Health Data Services must be assigned to the right [application roles](./../healthcare-apis/authentication-authorization.md#application-roles). After being granted with proper application roles, the [authenticated users and client applications](./../healthcare-apis/authentication-authorization.md#authorization) can access Azure Health Data Services by obtaining a valid [access token](./../healthcare-apis/authentication-authorization.md#access-token) issued by Microsoft Entra ID, and perform specific operations defined by the application roles. For more information, see [Authentication and Authorization for Azure Health Data Services](authentication-authorization.md).

To access Azure Health Data Services, you [register a client application](register-application.md) in the Microsoft Entra ID. By doing these steps, you can find the [application (client) ID](./../healthcare-apis/register-application.md#application-id-client-id), and configure the [authentication setting](./../healthcare-apis/register-application.md#authentication-setting-confidential-vs-public) to allow public client flows or to a confidential client application.

As a requirement for the DICOM service, you configure the user access [API permissions](./../healthcare-apis/register-application.md#api-permissions) or role assignments for Azure Health Data Services managed through [Azure role-based access control (Azure RBAC)](configure-azure-rbac.md).  

## FHIR service

The FHIR&reg; service in Azure Health Data Services enables rapid exchange of data through FHIR APIs backed by a managed Platform-as-a-Service (PaaS) offering. It makes it easier for anyone working with health data to ingest, manage, and persist Protected Health Information (PHI) in the cloud.  

The FHIR service is secured by a Microsoft Entra ID that can't be disabled. To access the service API, create a client application, also known as a service principal in Microsoft Entra ID, and then grant it the right permissions. You can create or register a client application in the [Azure portal](register-application.md), or by using PowerShell and Azure CLI scripts. The client application can be used for one or more FHIR service instances. You can also use it for other services in Azure Health Data Services.

You can also:
- Grant access permissions.
- Perform create, read (search), update, and delete (CRUD) transactions against the FHIR service in healthcare applications.
- Get an access token for the FHIR service. 
- Access the FHIR service by using tools such as cURL, Postman, and REST client.
- Load data directly by using the POST or PUT method against the FHIR service.
- Export ($export) data to Azure Storage.
- Convert [HL7 v2](./../healthcare-apis/fhir/convert-data-overview.md) and other format data to FHIR
- Create Power BI dashboard reports with FHIR data. 

For more information, see [Get started with FHIR service](./../healthcare-apis/fhir/get-started-with-fhir.md).

## DICOM service

The DICOM&reg; service is a managed service in Azure Health Data Services that ingests and persists DICOM objects at multiple thousands of images per second. It facilitates communication and transmission of imaging data with any DICOMweb-enabled systems or applications with DICOMweb Standard APIs like [Store (STOW-RS)](./../healthcare-apis/dicom/dicom-services-conformance-statement.md#store-stow-rs), [Search (QIDO-RS)](./../healthcare-apis/dicom/dicom-services-conformance-statement.md#search-qido-rs), [Retrieve (WADO-RS)](./../healthcare-apis/dicom/dicom-services-conformance-statement.md#retrieve-wado-rs). 

The DICOM service is secured by Microsoft Entra ID, which can't be disabled. To access the service API, you create a client application, also known as a service principal in Microsoft Entra ID, and then grant it with the right permissions. You can create or register a client application from the [Azure portal](register-application.md), or by using PowerShell and Azure CLI scripts. You can use the client application for one or more DICOM service instances. It can also be used for other services in Azure Health Data Services.

You can also:
- Grant access permissions or assign roles in the [Azure portal](./../healthcare-apis/configure-azure-rbac.md), or by using PowerShell and Azure CLI scripts.
- Perform create, read (search), update, and delete (CRUD) transactions against the DICOM service in healthcare applications or by using tools such as Postman, REST client, cURL, and Python.
- Get a Microsoft Entra access token by using PowerShell, Azure CLI, REST CLI, or .NET SDK.
- Access the DICOM service by using tools such as .NET C#, cURL, Python, Postman, and REST client.

For more information, see [Manage medical imaging data with the DICOM service](./../healthcare-apis/dicom/dicom-data-lake.md).

## MedTech service

The MedTech service transforms device data into FHIR-based observation resources and then persists the transformed messages into the FHIR Service in Azure Health Data Services. The MedTech service provides a unified approach to health data access, standardization, and trend capture, enabling the discovery of operational and clinical insights, connection of new device applications, and enablement of new research projects. 

The MedTech service needs access permissions to Azure Event Hubs and FHIR service. Assign the Azure Event Hubs Data Receiver role to allow the MedTech service to receive data from the event hub. For more information, see [Authentication & Authorization for Azure Health Data Services](./../healthcare-apis/authentication-authorization.md)

You can also:
- Create a new FHIR service or use an existing one in the same or different workspace.
- Create a new event hub or use an existing one. 
- Assign roles to allow the MedTech service to access [Event Hubs](./../healthcare-apis/iot/deploy-iot-connector-in-azure.md#granting-access-to-the-device-message-event-hub) and [FHIR service](./../healthcare-apis/iot/deploy-iot-connector-in-azure.md#granting-access-to-the-fhir-service).
- Send data to the event hub, which is associated with the MedTech service.

For more information, see [Get started with the MedTech service](./../healthcare-apis/iot/get-started.md).

## Related content

[Azure Health Data Services quickstart](healthcare-apis-quickstart.md)

[Authentication and authorization for Azure Health Data Services](authentication-authorization.md).

[Azure Health Data Services FAQ](healthcare-apis-faqs.md).

[!INCLUDE [FHIR and DICOM trademark statement](./includes/healthcare-apis-fhir-dicom-trademark.md)]
