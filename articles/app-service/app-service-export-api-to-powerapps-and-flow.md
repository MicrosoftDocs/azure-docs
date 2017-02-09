---
title: Exporting an Azure hosted API to PowerApps and Microsoft Flow | Microsoft Docs
description: Overview of how to expose an API hosted in App Service to PowerApps and Microsoft Flow
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
ms.date: 02/06/2017
ms.author: mahender

---
# Exporting an Azure hosted API to PowerApps and Microsoft Flow

## Creating custom APIs for PowerApps and Microsoft Flow

The [Microsoft Business Application Platform](https://businessplatform.microsoft.com/) includes a variety of products that help power users get more done. [PowerApps](https://powerapps.com) is a service for building and using custom business apps that connect to your data and work across platforms. [Microsoft Flow](https://flow.microsoft.com) makes it easy to automate workflows and business processes between your favorite apps and services. Both PowerApps and Microsoft Flow come with a variety of built-in connectors to data sources such as Office 365, Dynamics 365, Salesforce, and more. However, users also need to be able to leverage data sources and APIs being built by their organization.

Similarly, developers that want to expose their APIs more broadly within the organization may want to make their APIs available to PowerApps and Microsoft Flow users. This topic will show you how to expose an API built with Azure App Service or Azure Functions to PowerApps and Microsoft Flow. [Azure App Service](https://azure.microsoft.com/services/app-service/) is a platform-as-a-service offering that allows developers to quickly and easily build enterprise-grade web, mobile, and API applications. [Azure Functions](https://azure.microsoft.com/services/functions/) is an event-based serverless compute solution that allows you to quickly author code that can react to other parts of your system and scale based on demand.

To learn more about these services, see:
- [PowerApps Guided Learning](https://powerapps.microsoft.com/guided-learning/learning-introducing-powerapps/) 
- [Microsoft Flow Guided Learning](https://flow.microsoft.com/guided-learning/learning-introducing-flow/)
- [What is App Service?](https://docs.microsoft.com/azure/app-service/app-service-value-prop-what-is)
- [What is Azure Functions](https://docs.microsoft.com/azure/azure-functions/functions-overview)

## Sharing an API definition

APIs are often described using an [Open API document](https://www.openapis.org/) (sometimes referred to as a "Swagger" document). This contains all of the information about what operations are available and how the data should be structured. PowerApps and Microsoft Flow can create custom APIs for any Open API 2.0 document. Once a custom API is created, it can be used in exactly the same way as one of the built-in connectors and can quickly be integrated into an application.

Azure App Service and Azure Functions have [built-in support](https://docs.microsoft.com/azure/app-service-api/app-service-api-metadata) for creating, hosting, and managing an Open API document. In order to create a custom connector for a web, mobile, API, or function app, two steps will be needed:

1. [Retrieving the API definition from App Service or Azure Functions](#export)
2. [Importing the API definition into PowerApps](#import)

It is possible that these two steps will need to be carried out by separate individuals within an organization, as a given user may not have permission to perform both actions. In this case, a developer who has contributor access to the App Service or Azure Functions application will need to obtain the API definition (a single JSON file) or a link to it. They will then need to provide that definition to a PowerApps or Microsoft Flow owner. That owner can use the metadata to create the custom API.

> [!NOTE]
> Because a copy of the API definition is being used, PowerApps and Microsoft Flow will not immediately know about updates or breaking changes to the application. If a new version of the API is made available, these steps should be repeated for the new version. 

<a name="export"></a>
## Retrieving the API definition from App Service or Azure Functions

In this section, you will export the API definition for your App Service API, to be used later in PowerApps.

1. Open the [Azure Portal](https://portal.azure.com) and navigate to your App Service or Azure Functions application.

    If using Azure App Service, select **API definition** from the settings list. 
    
    If using Azure Functions, select **Function app settings** and then **Configure API metadata**.

2. If an API definition has been provided, you will see an **Export to PowerApps + Microsoft Flow** button. Click this button to begin the export process.

3. You can choose to either **Download the API definition** or **Get a link**. Whichever you choose, the result will be provided to PowerApps in the next section. Select one of these options and follow the instructions.
 
4. If your API definition includes any security definitions, these will be called out in step #2. During import, PowerApps and Microsoft Flow will detect these and will prompt for security information. The services use this to log users in, so that they can access the API. If your API requires authentication, ensure that it is captured as a _security definition_ in your Open API document.

    Gather the credentials related to each definition for use in the next section. For a list of identity providers which PowerApps supports natively and the credentials each requires, see [Register custom APIs in PowerApps] and [Register custom APIs in Microsoft Flow].
 
> [!NOTE]
> If using Azure Active Directory authentication, a new AAD app registration will be needed which has delegated access to your API and a reply URL of _https://msmanaged-na.consent.azure-apim.net/redirect_. Please see [this example](
https://powerapps.microsoft.com/tutorials/customapi-azure-resource-manager-tutorial/) for more detail, substituting your API for Azure Resource Manager (ARM).
>
> If another individual will be importing the API definition into PowerApps, you will provide the client ID and client secret **of the new registration**, as well as the resource URL of your API, in addition to the API definition file. Make sure that these secrets are managed securely. **Do not share the security credentials of the API itself.**

<a name="import"></a>
## Importing the API definition into PowerApps and Microsoft Flow

In this section, you will create a custom API in PowerApps and Microsoft Flow using the API definition obtained earlier. Custom APIs are shared between the two services, so you only need to import the definition once. For more information on custom APIs, see [Register custom APIs in PowerApps] and [Register custom APIs in Microsoft Flow].

**To import into PowerApps:**

1. Open the [Powerapps web portal](https://web.powerapps.com), sign in, and select **Connections**. Click **New connection**.

2. Select **Custom**, and then click **New custom API**.

3. Provide a name for your API, and then upload the Swagger definition or paste in the metadata URL. Click **Next**.

4. If you are prompted to provide authentication details, enter the values obtained in the previous section. If not, proceed to the next step.

5. Click **Create**.

**To import into Microsoft Flow:**

1. Open the [Microsoft Flow web portal](https://flow.microsoft.com/) and sign in. 

2. Click the **Settings** button at the upper right of the page (it looks like a gear) and select **Custom APIs**. Click **Create custom API**.

3. Upload the Swagger definition and click **Continue**.

4. If you are prompted to provide authentication details, enter the values obtained in the previous section. If not, proceed to the next step.

5. Click the checkbox at the top of the screen.



[Register custom APIs in PowerApps]: https://powerapps.microsoft.com/tutorials/register-custom-api/
[Register custom APIs in Microsoft Flow]: https://flow.microsoft.com/documentation/register-custom-api/
