---
title: Exporting an Azure-hosted API to PowerApps and Microsoft Flow | Microsoft Docs
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
ms.date: 06/20/2017
ms.author: mahender

---
# Exporting an Azure-hosted API to PowerApps and Microsoft Flow

## Creating custom connectors for PowerApps and Microsoft Flow

[PowerApps](https://powerapps.com) is a service for building and using custom business apps that connect to your data and work across platforms. [Microsoft Flow](https://flow.microsoft.com) makes it easy to automate workflows and business processes between your favorite apps and services. Both PowerApps and Microsoft Flow come with a variety of built-in connectors to data sources such as Office 365, Dynamics 365, Salesforce, and more. However, users also need to be able to leverage data sources and APIs being built by their organization.

Similarly, developers that want to expose their APIs more broadly within the organization may want to make their APIs available to PowerApps and Microsoft Flow users. This topic will show you how to expose an API built with Azure App Service or Azure Functions to PowerApps and Microsoft Flow. [Azure App Service](https://azure.microsoft.com/services/app-service/) is a platform-as-a-service offering that allows developers to quickly and easily build enterprise-grade web, mobile, and API applications. [Azure Functions](https://azure.microsoft.com/services/functions/) is an event-based serverless compute solution that allows you to quickly author code that can react to other parts of your system and scale based on demand.

To learn more about these services, see:
- [PowerApps Guided Learning](https://powerapps.microsoft.com/guided-learning/learning-introducing-powerapps/) 
- [Microsoft Flow Guided Learning](https://flow.microsoft.com/guided-learning/learning-introducing-flow/)
- [What is App Service?](https://docs.microsoft.com/azure/app-service/app-service-value-prop-what-is)
- [What is Azure Functions](https://docs.microsoft.com/azure/azure-functions/functions-overview)

## Sharing an API definition

APIs are often described using an [OpenAPI document](https://www.openapis.org/) (sometimes referred to as a "Swagger" document). This contains all of the information about what operations are available and how the data should be structured. PowerApps and Microsoft Flow can create custom connectors for any OpenAPI 2.0 document. Once a custom connector is created, it can be used in exactly the same way as one of the built-in connectors and can quickly be integrated into an application.

Azure App Service and Azure Functions have [built-in support](https://docs.microsoft.com/azure/app-service-api/app-service-api-metadata) for creating, hosting, and managing an OpenAPI document. In order to create a custom connector for a web, mobile, API, or function app, PowerApps and Flow need to be given a copy of the definition.

> [!NOTE]
> Because a copy of the API definition is being used, PowerApps and Microsoft Flow will not immediately know about updates or breaking changes to the application. If a new version of the API is made available, these steps should be repeated for the new version. 

To provide PowerApps and Microsoft Flow with the hosted API definition for your app, follow these steps:

1. Open the [Azure Portal](https://portal.azure.com) and navigate to your App Service or Azure Functions application.

    If using Azure App Service, select **API definition** from the settings list. 
    
    If using Azure Functions, select your function app, and then choose **Platform features**, and then **API definition**. You could also choose to open the **API definition (preview)** tab instead.

2. If an API definition has been provided, you will see an **Export to PowerApps + Microsoft Flow** button. Click this button to begin the export process.

3. Select the **Export mode**. This determines the steps you will need to follow to create a connector. App Service offers two options for providing PowerApps and Microsoft Flow with your API definition:

    **Express** lets you create the custom connector from within the Azure portal. It requires that the curent logged-in user has permission to create connectors in the target environment. This is the recommended approach if that requirement can be met. If using this mode, follow the [Express export](#express) instructions below.

    **Manual** lets you export a copy of the API definiton which can be imported using the PowerApps or Microsoft Flow portals. This is the recommended approach if the Azure user and the user with permission to create connectors are different people or if the connector needs to be created in another tenant. If using this mode, follow the [Manual export and import](#manual) instructions below.

<a name="express"></a>
## Express export

In this section, you will create a new custom connector from within the Azure portal. You must be logged into the tenant to which you wish to export, and you must have permission to create a custom connector in the target environment.

1. Select the environment in which you would like to create the connector. Then provide a name for your custom connector.

2. If your API definition includes any security definitions, these will be called out in step #2. If required, provide the security configuration details needed to grant users access to your API. For more information, see [Authentication](#auth) below. 

3. Click **OK** to create your custom connector.


<a name="manual"></a>
## Manual export and import

In order to create a custom connector for a web, mobile, API, or function app, two steps will be needed:

1. [Retrieving the API definition from App Service or Azure Functions](#export)
2. [Importing the API definition into PowerApps and Microsoft Flow](#import)

It is possible that these two steps will need to be carried out by separate individuals within an organization, as a given user may not have permission to perform both actions. In this case, a developer who has contributor access to the App Service or Azure Functions application will need to obtain the API definition (a single JSON file) or a link to it. They will then need to provide that definition to a PowerApps or Microsoft Flow owner. That owner can use the metadata to create the custom connector.

<a name="export"></a>
### Retrieving the API definition from App Service or Azure Functions

In this section, you will export the API definition for your App Service API, to be used later in the PowerApps or Microsoft Flow portal.

1. You can choose to either **Download the API definition** or **Get a link**. Whichever you choose, the result will be provided in the next section. Select one of these options and follow the instructions.
 
2. If your API definition includes any security definitions, these will be called out in step #2. During import, PowerApps and Microsoft Flow will detect these and will prompt for security information. Gather the credentials related to each definition for use in the next section. For more information, see [Authentication](#auth) below. 

<a name="import"></a>
### Importing the API definition into PowerApps and Microsoft Flow

In this section, you will create a custom connector in PowerApps and Microsoft Flow using the API definition obtained earlier. Custom connectors are shared between the two services, so you only need to import the definition once. For more information on custom connectors, see [Register and use custom connectors in PowerApps] and [Register and use custom connectors in Microsoft Flow].

1. Open the [Powerapps web portal](https://web.powerapps.com) or the [Microsoft Flow web portal](https://flow.microsoft.com/), and sign in. 

2. Click the **Settings** button (the gear icon) at the upper right of the page and select **Custom connectors**. 

3. Click **Create custom connector**.

4. On the **General** tab, provide a name for your API, and then upload the OpenAPI definition or paste in the metadata URL. Click **Continue**.

4. On the **Security** tab, if you are prompted to provide authentication details, enter the values obtained in the previous section. If not, proceed to the next step.

5. On the **Definitions** tab, all the operations defined in your OpenAPI file are auto-populated. If all your required operations are defined, you can go to the next step. If not, you can add and modify operations here.

6. Click **Create connector**. If you want to test API calls, go to the next step.

7. On the **Test** tab, create a connection, select an operation to test, and enter any data required by the operation.

8. Click **Test operation**.


<a name="auth"></a>
## Authentication

PowerApps and Microsoft Flow natively support a collection of identity providers which can be used to log in users of your custom connector. If your API requires authentication, ensure that it is captured as a _security definition_ in your OpenAPI document. During export, you will need to provide configuration values that allow PowerApps an Microsoft Flow to perform login actions.

This section covers the authentication types which are supported by the express flow: API key, Azure Active Directory, and Generic OAuth 2.0. For a complete list of providers and the credentials each requires, see [Register and use custom connectors in PowerApps] and [Register and use custom connectors in Microsoft Flow].

### API key
When this security scheme is used, the users of your connector will be prompted to provide the key when they create a connection. You can provide an API key name to help them know which key is needed. For Azure Functions, this will typically be one of the host keys, covering several functions within the function app.

### Azure Active Directory
When configuring a custom connector that requires AAD login, two AAD application registrations are required: one to model the backend API, and one to model the connector in PowerApps and Flow.

Your API should be configured to work with the first registration, and this will already be taken care of if you used the [App Service Authentication/Authorization](https://docs.microsoft.com/azure/app-service-mobile/app-service-mobile-how-to-configure-active-directory-authentication) feature.

You will have to manually create the second registration for the connector, using the steps covered in [Adding an AAD application](https://docs.microsoft.com/azure/active-directory/develop/active-directory-integrating-applications#adding-an-application). The registration needs to have delegated access to your API and a reply URL of `https://msmanaged-na.consent.azure-apim.net/redirect`. Please see [this example](
https://powerapps.microsoft.com/tutorials/customapi-azure-resource-manager-tutorial/) for more detail, substituting your API for the Azure Resource Manager.

The following configuration values are required:
- **Client ID** - the client ID of your connector AAD registration
- **Client secret** - the client secret of your connector AAD registration
- **Login URL** - the base URL for AAD. In public Azure, this will typically be `https://login.windows.net`.
- **Tenant ID** - the ID of the tenant to be used for the login. This should be "common" or the ID of the tenant in which the connector is being created.
- **Resource URL** - the resource URL of your API backend AAD registration

> [!IMPORTANT]
> If another individual will be importing the API definition into PowerApps and Microsoft Flow as part of the manual flow, you will need to provide them with the client ID and client secret **of the connector registration**, as well as the resource URL of your API. Make sure that these secrets are managed securely. **Do not share the security credentials of the API itself.**

### Generic OAuth 2.0
The generic OAuth 2.0 support allows you to integrate with any OAuth 2.0 provider. This allows you to bring in any custom provider which is not natively supported.

The following configuration values are required:
- **Client ID** - the OAuth 2.0 client ID
- **Client secret** - the OAuth 2.0 client secret
- **Authorization URL** - the OAuth 2.0 authorization URL
- **Token URL** - the OAuth 2.0 token URL
- **Refresh URL** - the OAuth 2.0 refresh URL



[Register and use custom connectors in PowerApps]: https://powerapps.microsoft.com/tutorials/register-custom-api/
[Register and use custom connectors in Microsoft Flow]: https://flow.microsoft.com/documentation/register-custom-api/
