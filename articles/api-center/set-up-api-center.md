---
title: Tutorial - Get started with Azure API Center (Preview) | Microsoft Docs
description: Follow this tutorial to set up your API center for API discovery, reuse, and governance. Register APIs, add versions and specifications, apply metadata properties, and more.
author: dlepow
ms.service: api-center
ms.topic: tutorial
ms.date: 05/16/2023
ms.author: danlep
ms.custom: 
---

# Tutorial: Get started with your API center (Preview)

Set up your [API center](overview.md) to help catalog your organization's APIs. 

In this tutorial, you learn how to use the portal to:
> [!div class="checklist"]
> * Create an API center
> * Define metadata properties in a schema
> * Register one or more APIs in your API center
> * Add information about API environments and deployments


## Prerequisites

* Access to the API Center preview in your subscription. [Sign up for the preview](https://aka.ms/apicenter/joinpreview). 

* At least a Contributor role assignment or equivalent permissions in the Azure subscription. 

* One or more APIs that you want to register in your API center. Here are two examples, with links to their OpenAPI specifications for download:

    * [Azure Demo Conference API](https://conferenceapi.azurewebsites.net?format=json)
    * [Swagger Petstore API](https://petstore.swagger.io/v2/swagger.json)

> [!NOTE]
> If you want to add an API specification to your API center inventory, you can only upload it from a local file.

## Register the API Center provider

After you've been added to the API Center preview, you need to register the API Center resource provider in your subscription. You can register the resource provider using the [portal](../azure-resource-manager/management/resource-providers-and-types.md) or other tools. You only need to register the resource provider once.

To register the API Center resource provider using the portal:

1. [Sign in](https://portal.azure.com) to the portal. 

1. In the search bar, enter *Subscriptions*, and select your subscription.

1.  In the left menu, select **Resource providers**.

1. Search for *Microsoft.ApiCenter*, and then select **Register**.

## Create an API center

1. [Sign in](https://portal.azure.com) to the portal. 

1. In the search bar, enter *API Centers*. 

1. Select **+ Create**. 

1. On the **Basics** tab, select or enter the following settings: 

    1. Select your Azure subscription. 

    1. Select an existing resource group, or select **New** to create a new one. 

    1. Enter a **Name** for your API center. It must be unique in your subscription. 

    1. In **Region**, select one of the [available regions](overview.md#preview-limitations) for API Center preview. 

1. Optionally, on the **Tags** tab, add one or more name/value pairs to help you categorize your Azure resources.

1. Select **Review + create**. 

1. After validation completes, select **Create**.

After a short time, your API center is ready to use.

## Define properties in metadata schema

Each API center provides a configurable metadata schema to help you organize APIs and other assets according to properties that you define. Here you define two example properties: *Line of business* and *Public facing*. You'll apply them later to APIs you add in the API center. If you prefer, define properties of your own.

1. In the left menu, select **Metadata > + Add property**. 

1. On the **Details** tab, enter information about the property. 

    1. In **Title**, enter *Line of Business* 
    
    1. Select type **Predefined choices** and enter choices such as *Marketing, Finance, IT, Sales*, and so on. Optionally enable **Allow additional choices**. 

1. On the **Assignments tab**, select **Required** for APIs. Select **Optional** for Deployments and Environments. 

1. On the **Review + Create** tab, review the settings and select **Create**. 
 
    The property is added to the **Metadata** list. 

1. Select **+ Add property** to add another property.

1. On the **Details** tab, enter information about the property. 

    1. In **Title**, enter *Public facing*. 
    
    1. Select type **Boolean**. 

1. On the **Assignments tab**, select **Required** for APIs. Select **Not applicable** for Deployments and Environments. 

    The property is added to the **Metadata** list.

1. Select **View schema > API** to see the properties that you added to the schema for APIs.

:::image type="content" source="media/set-up-api-center/metadata-schema.png" alt-text="Screenshot of metadata schema in the portal.":::

## Add APIs

Now add (register) APIs in your API center. Each API registration includes: 

* Information such as the name and API type
* A version identifier and optional API specification
* Optional links to documentation and contacts
* Any required API properties defined in your metadata schema 

The following steps register two sample APIs: Azure Demo Conference API and Swagger Petstore API (see [Prerequisites](#prerequisites)). If you prefer, register APIs of your own.
 
1. In the portal, navigate to your API center.

1. In the left menu, select **APIs** > **+ Register API**.

1. In the **Register API** window, add the following information for the Demo Conference API. You'll see the *Line of business* and *Public facing* metadata properties that you defined in the preceding section at the bottom of the window.

    |Setting|Value|Description|
    |-------|-----|-----------|
    |**API title**| Enter *Demo Conference API*.| Name you choose for the API.  |
    |**Identification**|After you enter the preceding title, API Center generates this identifier, which you can override.| Azure resource name for the API.|
    |**API type**| Select **REST** from the dropdown.| Type of API.|
    | **Summary** | Optionally enter a  summary. | Summary description of the API.  |
    | **Description** | Optionally enter a description. | Description of the API. |
    | **Version** | | |
    |**Version title**| Enter a version title of your choice, such as *v1*.|Name you choose for the API version.|
    |**Version identification**|After you enter the preceding title, API Center generates this identifier, which you can override.| Azure resource name for the version.|
    |**Version lifecycle**  | Make a selection from the dropdown, such as **Testing**. | Lifecycle stage of the API version. |
    |**Specification**        | Optionally upload  Demo Conference API JSON file.      |  API specification file, such as an OpenAPI specification for a REST API.     |
    |**External documentation**     | Optionally add one or more links to external documentation.       | Name, description, and URL of documentation for the API.      |  
    |**Contact**         |  Optionally add information for one or more contacts.       | Name, email, and URL of a contact for the API.      |  
    | **Line of business** | If you added this custom property, make a selection from the dropdown, such as **Marketing**. | Custom metadata property that identifies the business unit that consumes the API. |
    | **Public facing**  | If you added this custom property, select the checkbox.    |  Custom metadata property that identifies whether the API is public facing or internal only.     |

1. Select **Create**. 
1. Repeat the preceding three steps to register the Swagger Petstore API.

The APIs appear on the **APIs** page in the portal. When you've added a large number of APIs to the API center, use the search box and filters on this page to find the APIs you want.

:::image type="content" source="media/set-up-api-center/apis-page.png" alt-text="Screenshot of the APIs page in the portal.":::

> [!TIP]
> After registering an API, you can view or edit the API's properties and continue to add API versions. On the **APIs** page, select the API to see options to manage the API registration. 

## Add an environment

API center helps you keep track of your real-world API environments. For example, you might use Azure API Management or another solution to distribute, secure, and monitor some of your APIs. Or you might directly serve certain APIs using a compute service or a Kubernetes cluster. You can add multiple environments to your API center, each aligned with a phase such as development, testing, staging, or production.

Here you add a fictitious Azure API Management environment to your API center. If you prefer, add information about one of your existing environments. 

1. In the portal, navigate to your API center.

1. In the left menu, select **Environments** > **Add environment**.

1. In the **Create environment** window, add the following information.

    |Setting|Value|Description|
    |-------|-----|-----------|
    |**Title**| Enter *My Testing*.| Name you choose for the environment.  |
    |**Identification**|After you enter the preceding title, API Center generates this identifier, which you can override.| Azure resource name for the environment.|
    |**Environment type**| Optionally select **Testing** from the dropdown.| Type of environment for APIs.|
    | **Description** | Optionally enter a description. | Description of the environment. |
    | **Server** | | |
    |**Type**| Optionally select **Azure API Management** from the dropdown.|Type of API management solution used.|
    | **Management portal URL** | Optionally enter a URL such as `https://admin.contoso.com` | URL of management interface. |
    | **Onboarding** | | |
    | **Development portal URL** | Optionally enter a URL such as `https://developer.contoso.com` | URL of interface for developer onboarding. |
    | **Instructions** | Optionally select **Edit** and enter onboarding instructions in standard Markdown. | Instructions to onboard to APIs from the environment. |
    | **Line of business** | If you added this custom property, optionally make a selection from the dropdown, such as **IT**. | Custom metadata property that identifies the business unit that consumes APIs from the environment. |

## Add a deployment

API center can also help you catalog your API deployments - the environments where specific API versions are deployed. 

Here you associate one of your API versions with the environment you created in the previous section. 

1. In the portal, navigate to your API center.

1. In the left menu, select **APIs** and then select the *Demo Conference API*.

1. On the **Demo Conference API** page, select **Versions** and then select a version.

1. On the Version page, select **Deployments**.

    :::image type="content" source="media/set-up-api-center/deployments.png" alt-text="Screenshot of API deployments in the portal.":::

1. Select **+ Add deployment**.

1. In the **Add deployment** window, add the following information.

    |Setting|Value|Description|
    |-------|-----|-----------|
    |**Title**| Enter *v1 Deployment*.| Name you choose for the deployment.  |
    |**Identification**|After you enter the preceding title, API Center generates this identifier, which you can override.| Azure resource name for the deployment.|
    | **Description** | Optionally enter a description. | Description of the deployment. |
    | **Environment** | Make a selection from the dropdown, such as *My Testing*, or optionally select **Create new**.| New or existing environment where the API version is deployed. |
    | **Runtime URL** | Enter a base URL such as `https://api.contoso.com/conference`. | Base runtime URL for the API in the envionment.  |
    | **Line of business** | If you added this custom property, optionally make a selection from the dropdown, such as **IT**. | Custom metadata property that identifies the business unit that consumes APIs from the environment. |

## Next steps

In this tutorial, you learned how to use the portal to:
> [!div class="checklist"]
> * Create an API center
> * Define metadata properties in a schema
> * Register one or more APIs in your API center
> * Add information about API environments and deployments

> [!div class="nextstepaction"]
> [Learn more about API Center](key-concepts.md)