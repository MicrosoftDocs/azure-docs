---
title: Get started with Azure Health Data Services
description: This document describes how to get started with Azure Health Data Services.
author: ginalee-dotcom
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 05/09/2022
ms.author: ranku
---

# Get started with Azure Health Data Services

This article outlines the basic steps to get started with Azure Health Data Services. Azure Health Data Services is a set of managed API services based on open standards and frameworks that enable workflows to improve healthcare and offer scalable and secure healthcare solutions. 

To get started with Azure Health Data Services, you'll need to create a workspace in the Azure portal. 

The workspace is a logical container for all your healthcare service instances such as Fast Healthcare Interoperability Resources (FHIR®) service, Digital Imaging and Communications in Medicine (DICOM®) service, and MedTech service. The workspace also creates a compliance boundary (HIPAA, HITRUST) within which protected health information can travel.

Before you can create a workspace in the Azure portal, you must have an Azure account subscription. If you don’t have an Azure subscription, see [Create your free Azure account today](https://azure.microsoft.com/free/search/?OCID=AID2100131_SEM_c4b0772dc7df1f075552174a854fd4bc:G:s&ef_id=c4b0772dc7df1f075552174a854fd4bc:G:s&msclkid=c4b0772dc7df1f075552174a854fd4bc). 

[![Screenshot of Azure Health Data Services flow diagram.](media/get-started-azure-health-data-services-diagram.png)](media/get-started-azure-health-data-services-diagram.png#lightbox)

## Deploy Azure Health Data Services 

To get started with Azure Health Data Services, you must [create a resource](https://ms.portal.azure.com/#create/hub) in the Azure portal. Enter *Azure Health Data Services* in the **Search services and marketplace** box.

[![Screenshot of the Azure search services and marketplace text box.](media/search-services-marketplace.png)](media/search-services-marketplace.png#lightbox)

After you've located the Azure Health Data Services resource, select **Create**.

[![Screenshot of the create Azure Health Data Services resource button.](media/create-azure-health-data-services-resource.png)](media/create-azure-health-data-services-resource.png#lightbox)

## Create workspace

After the Azure Health Data Services resource group is deployed, you can enter the workspace subscription and instance details. 

To be guided through these steps, see [Deploy Azure Health Data Services workspace using Azure portal](healthcare-apis-quickstart.md).

> [!Note] 
> You can provision multiple data services within a workspace, and by design, they work seamlessly with one another. With the workspace, you can organize all your Azure Health Data Services instances and manage certain configuration settings that are shared among all the underlying datasets and services where it's applicable. 

[![Screenshot of the Azure Health Data Services workspace.](media/health-data-services-workspace.png)](media/health-data-services-workspace.png#lightbox)

After you've created a workspace, you can deploy a FHIR service, DICOM service, and MedTech service.

## FHIR service

FHIR service in Azure Health Data Services enables rapid exchange of data through FHIR APIs that's backed by a managed Platform-as-a Service (PaaS) offering in the cloud. It makes it easier for anyone working with health data to ingest, manage, and persist Protected Health Information (PHI) in the cloud.  

FHIR service is secured by Azure Active Directory (Azure AD) that can't be disabled. To access the service API, you must create a client application that's also referred to as a service principal in Azure AD and grant it with the right permissions. For more information about registering a client application, granting access permissions, and assigning roles to the FHIR service, see [Get started with FHIR service](./../healthcare-apis/fhir/get-started-with-fhir.md).

## DICOM service

DICOM (Digital Imaging and Communications in Medicine) is the international standard to transmit, store, retrieve, print, process, and display medical imaging information, and is the primary medical imaging standard accepted across healthcare.

DICOM service is a managed service within Azure Health Data Services that ingests and persists DICOM objects at multiple thousands of images per second. It facilitates communication and transmission of imaging data with any DICOMweb™ enabled systems or applications via DICOMweb Standard APIs like [Store (STOW-RS)](./../healthcare-apis/dicom/dicom-services-conformance-statement.md#store-stow-rs), [Search (QIDO-RS)](./../healthcare-apis/dicom/dicom-services-conformance-statement.md#search-qido-rs), [Retrieve (WADO-RS)](./../healthcare-apis/dicom/dicom-services-conformance-statement.md#retrieve-wado-rs). 

DICOM service is secured by Azure AD that can't be disabled. To access the service API, you must create a client application that's also referred to as a service principal in Azure AD and grant it with the right permissions. For more information about registering a client application, granting access permissions, assigning roles, and obtaining an access token for the DICOM service, see [Get started with the DICOM service](./../healthcare-apis/dicom/get-started-with-dicom.md).

## MedTech service

MedTech service is an optional service of the Azure Health Data Services designed to ingest health data from multiple and disparate Internet of Medical Things (IoMT) devices and persisting the health data in a FHIR service.

MedTech service transforms device data into FHIR-based observation resources and then persists the transformed messages into Azure Health Data Services FHIR service. This allows for a unified approach to health data access, standardization, and trend capture enabling the discovery of operational and clinical insights, connecting new device applications, and enabling new research projects. 

MedTech service works with the Azure Event Hub and the FHIR service. You can create a new FHIR service or use an existing one in the same or different workspace. Similarly, you can create a new Event Hub or use an existing one. You assign roles to allow the MedTech service to access Event Hub and FHIR service. Additionally, you can send data to the Event Hub, which is associated with the MedTech service. For more information about assigning roles to allow the MedTech service to access Event Hub and the FHIR service, see [Get started with the MedTech service](./../healthcare-apis/iot/get-started-with-iot.md).

## Authentication and authorization

For Azure Health Data Services to access Azure resources, such as storage accounts and event hubs, you must enable the system managed identity, and grant proper permissions to the managed identity. For more information, see [Azure managed identities](../active-directory/managed-identities-azure-resources/overview.md).

Azure Health Data Services doesn't support other identity providers. However, customers can use their own identity provider to secure applications, and enable them to interact with the Health Data Services by managing client applications and user data access controls.

The client applications are registered in the Azure Active Directory (Azure AD) and can be used to access Azure Health Data Services. User data access controls are done in the applications or services that implement business logic.

### Register client application

The Microsoft identity platform performs identity and access management (IAM) only for registered applications. Whether it's a client application like a web or mobile app, or it's a web API that backs a client app, registering it establishes a trust relationship between your application and the identity provider, the Microsoft identity platform.

For more information about how to register a client application in Azure AD to access Azure Health Data Services, see [Register a client application in Azure Active Directory](./../healthcare-apis/register-application.md).

### Assign application roles

Authenticated users and client applications of Azure Health Data Services must be granted with proper application roles. To view a list of application roles for the FHIR service and DICOM service, see [Application roles](./../healthcare-apis/authentication-authorization.md#application-roles). 

* For information about assigning roles to the FHIR service, see [Assign roles for the FHIR service](./../healthcare-apis/configure-azure-rbac.md#assign-roles-for-the-fhir-service).

* For information about assigning roles to the DICOM service, see [Assign roles for the DICOM service](./../healthcare-apis/configure-azure-rbac.md#assign-roles-for-the-dicom-service)

> [!Note] 
> MedTech service doesn't require application roles, but it does rely on the "Azure Event Hubs Data Receiver" to retrieve data stored in the event hub of the customer's subscription. For more information, see [Granting MedTech service access](./../healthcare-apis/iot/deploy-iot-connector-in-azure.md#granting-medtech-service-access).

### Steps for authorization

After being granted with proper application roles, the authenticated users and client applications can access Azure Health Data Services by obtaining a valid access token issued by Azure AD, and perform specific operations defined by the application roles.

* For **FHIR service**, the access token is specific to the service or resource.
* For **DICOM service**, the access token is granted to the dicom.healthcareapis.azure.com resource, not a specific service.
* For **MedTech service**, the access token isn’t required because it isn’t exposed to the users or client applications.

For information about obtaining an access token for Azure Health Data Services, see the [steps for using authorization code flow](./../healthcare-apis/authentication-authorization.md#steps-for-authorization). 

## Access Azure Health Data Services

After you've provisioned a FHIR service, DICOM service, or MedTech service, you can access them in your applications using tools like Postman, cURL, REST Client in Visual Studio Code, and with programming languages such as Python and C#. For more information, see [Access Azure Health Data Services](./../healthcare-apis/access-healthcare-apis.md).

## Next steps

This article described the basic steps to get started using Azure Health Data Services. For more information about Azure Health Data Services, see

>[!div class="nextstepaction"]
>[Authentication and Authorization for Azure Health Data Services](authentication-authorization.md)

>[!div class="nextstepaction"]
>[What is Azure Health Data Services?](healthcare-apis-overview.md)

>[!div class="nextstepaction"]
>[Frequently asked questions about Azure Health Data Services](healthcare-apis-faqs.md)

