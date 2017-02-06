---
title: Exporting an API to PowerApps | Microsoft Docs
description: Overview of how to expose an API hosted in App Service to PowerApps
services: app-service
documentationcenter: ''
author: mattchenderson
manager: erikre
editor: ''

ms.assetid: 
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: multiple
ms.topic: article
ms.date: 12/09/2016
ms.author: mahender

---
# Exporting an API to PowerApps

## Creating custom APIs for PowerApps

[PowerApps](https://powerapps.com) is a service for building and using custom business apps that connect to your data and works across platforms – without having to write a single line of code.  PowerApps comes with a variety of built-in connectors to data sources such as Office 365, Dynamics 365, Salesforce, and more. PowerApps users also need to be able to leverage data sources and APIs being built by their organization. To learn more about PowerApps, see the [PowerApps Guided Learning](https://powerapps.microsoft.com/guided-learning/learning-introducing-powerapps/).

[Azure App Service](https://azure.microsoft.com/services/app-service/) is a platform-as-a-service offering that allows developers to quickly and easily build enterprise-grade web, mobile, and API applications. Developers that want to expose their APis more broadly within the organization may want to make their APIs available to PowerApps users. To learn more about App Service, see [What is App Service?](https://docs.microsoft.com/azure/app-service/app-service-value-prop-what-is)

This topic will show you how to expose an API built with Azure App Service to PowerApps. 

## Sharing an API definition

APIs are often described using an [Open API document](https://www.openapis.org/) (sometimes referred to as a "Swagger" document). This contains all of the information about what operations are available and how the data should be structured. PowerApps can create custom connectors for any Open API 2.0 document. Once a connector is created, it can be used exactly the same as one of the built-in connectors and can quickly be integrated into an application.

Azure App Service has [built-in support](../app-service-api/app-service-api-metadata) for creating, hosting, and managing an Open API document. In order to create a custom connector for an App Service application, two steps will be needed:

1. [Retrieving the API definition from App Service](#export)
2. [Importing the API definition into PowerApps](#import)

It is possible that these two steps will need to be carried out by separate individuals within an organization, as a given user may not have permission to perform both actions. In this case, a developer who has contributor access to the App Service application will need to obtain the API definition (a single JSON file) and provide it to a PowerApps user that can create the custom API in PowerApps.

> [!NOTE]
> Because a copy of the API definition is being used, PowerApps will not immediately know about updates or breaking changes to the App Service application. If a new version of the API is made available, these steps should be repeated for the new version. 

<a name="export"></a>
## Retrieving the API definition from App Service

In this section, you will export the API definition for your App Service API, to be used later in PowerApps.

1. Open the [Azure Portal](https://portal.azure.com) and navigate to your App Service application.

2. Select **API definition**. If an API definition has been provided, you will see an **Export to PowerApps/Flow** button. Click this button to begin the export process.

3. Under **Download**. This will provide you with the Open API document as a JSON file. This file will be provided to PowerApps in the next section.
 
> [!NOTE]
> If your API requires authentication, this should be documented as a _security definition_ in your Open API document. During import PowerApps will detect this and will prompt for security information. PowerApps uses this to log users in so that they can access the API.
> 
> If using Azure Active Directory authentication, a new AAD app registration will be needed which has delegated access to your API and a reply URL of _https://msmanaged-na.consent.azure-apim.net/redirect_. Please see [this example](
https://powerapps.microsoft.com/tutorials/customapi-azure-resource-manager-tutorial/) for more detail, substituting your API for ARM.
>
> If another individual will be importing the API definition into PowerApps, you will provide the client ID and client secret **of the new registration**, as well as the resource URL of your API, in addition to the API definition file. Make sure that these secrets are managed securely. **Do not share the security credentials of the API itself.**
 
<a name="import"></a>
## Importing the API definition into PowerApps

In this section, you will create a custom API in PowerApps using the API definition obtained earlier. For more information on custom APIs, see [Register custom APIs in PowerApps](https://powerapps.microsoft.com/tutorials/register-custom-api/).

1. Open the [Powerapps web portal](https://web.powerapps.com) and select **Connections**. Click **New connection**.

2. Select **Custom**, and then click **New custom API**.

3. Provide a name for your API, and then upload the Swagger definition. Click **Next**.

4. If you are prompted to provide authentication details, enter the values obtained in the previous section. If not, proceed to the next step.

5. Click **Create**.

Your App Service API is now registered within PowerApps and can be used in applications.