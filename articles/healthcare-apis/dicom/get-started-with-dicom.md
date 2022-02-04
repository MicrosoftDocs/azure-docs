---
title: Get started with the DICOM service - Azure Healthcare APIs
description: This document describes how to get started with the DICOM service in Azure Healthcare APIs.
author: stevewohl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 01/06/2022
ms.author: zxue
ms.custom: mode-api
---

# Get started with the DICOM service

This article outlines the basic steps to get started with the DICOM service in [Azure Healthcare APIs](../healthcare-apis-overview.md). 

As a prerequisite, you'll need an Azure subscription and have been granted proper permissions to create Azure resource groups and deploy Azure resources. You can follow all the steps, or skip some if you have an existing environment. Also, you can combine all the steps and complete them in PowerShell, Azure CLI, and REST API scripts.

[![Get Started with DICOM](media/get-started-with-dicom.png)](media/get-started-with-dicom.png#lightbox)

## Create a workspace in your Azure Subscription

You can create a workspace from the [Azure portal](../healthcare-apis-quickstart.md) or using PowerShell, Azure CLI, and REST API. You can find scripts from the [Healthcare APIs samples](https://github.com/microsoft/healthcare-apis-samples/tree/main/src/scripts).

> [!NOTE]
> There are limits to the number of workspaces and the number of DICOM service instances you can create in each Azure subscription.

## Create a DICOM service in the workspace

You can create a DICOM service instance from the [Azure portal](deploy-dicom-services-in-azure.md) or using PowerShell, Azure CLI, and REST API. You can find scripts from the [Healthcare APIs samples](https://github.com/microsoft/healthcare-apis-samples/tree/main/src/scripts).

Optionally, you can create a [FHIR service](../fhir/fhir-portal-quickstart.md) and [IoT connector](../iot/deploy-iot-connector-in-azure.md) in the workspace.

## Access the DICOM service

The DICOM service is secured by Azure Active Directory (Azure AD) that can't be disabled. To access the service API, you must create a client application that's also referred to as a service principal in Azure AD and grant it with the right permissions.

### Register a client application

You can create or register a client application from the [Azure portal](../register-application.md), or using PowerShell and Azure CLI scripts. This client application can be used for one or more DICOM service instances. It can also be used for other services in Azure Healthcare APIs.

If the client application is created with a certificate or client secret, ensure that you renew the certificate or client secret before expiration and replace the client credentials in your applications.

You can delete a client application. Before doing that, ensure that it's not used in production, dev, test, or quality assurance (QA) environments.

### Grant access permissions

You can grant access permissions or assign roles from the [Azure portal](../configure-azure-rbac.md), or using PowerShell and Azure CLI scripts.

### Perform create, read, update, and delete (CRUD) transactions

You can perform create, read (search), update and delete (CRUD) transactions against the DICOM service in your applications or by using tools such as Postman, REST Client, cURL, and Python. Because the DICOM service is secured by default, you must obtain an access token and include it in your transaction request.

#### Get an access token

You can obtain an Azure AD access token using PowerShell, Azure CLI, REST CLI, or .NET SDK.  For more information, see [Get access token](../get-access-token.md).

#### Access using existing tools

- [Postman](../fhir/use-postman.md)
- [REST Client](../fhir/using-rest-client.md)
- [.NET C#](dicomweb-standard-apis-c-sharp.md)
- [cURL](dicomweb-standard-apis-curl.md)
- [Python](dicomweb-standard-apis-python.md)

### DICOMweb standard APIs and change feed

You can find more details on DICOMweb standard APIs and change feed in the [DICOM service](dicom-services-overview.md) documentation.

#### DICOMCast

You can use the Open Source [DICOMCast](https://github.com/microsoft/dicom-server/tree/main/converter/dicom-cast) project to work with FHIR data. In the future, this capability will be available in the managed service.

## Next steps

This article described the basic steps to get started using the DICOM service. For information about deploying the DICOM service in the workspace, see

>[!div class="nextstepaction"]
>[Deploy DICOM service using the Azure portal](deploy-dicom-services-in-azure.md)
