---
title: Tutorial - Get started with Azure API Center (preview) | Microsoft Docs
description: Follow this tutorial to set up your API center for API discovery, reuse, and governance. Register APIs, add versions and specifications, set metadata properties, and more.
author: dlepow
ms.service: api-center
ms.topic: tutorial
ms.date: 06/05/2023
ms.author: danlep
ms.custom:
---

# Tutorial: Get started with your API center (preview)

Set up your [API center](overview.md) to start an inventory of your organization's APIs. API Center enables tracking APIs in a centralized location for discovery, reuse, and governance.

In this tutorial, you learn how to use the portal to:
> [!div class="checklist"]
> * Create an API center
> * Define metadata properties in the schema
> * Register one or more APIs in your API center
> * Add a version to an API
> * Add information about API environments and deployments

For background information about the assets you can organize in API Center, see [Key concepts](key-concepts.md).

[!INCLUDE [api-center-preview-feedback](includes/api-center-preview-feedback.md)]


## Prerequisites

* At least a Contributor role assignment or equivalent permissions in the Azure subscription. 

* One or more APIs that you want to register in your API center. Here are two examples, with links to their OpenAPI specifications for download:

    * [Swagger Petstore API](https://github.com/swagger-api/swagger-petstore/blob/master/src/main/resources/openapi.yaml)
    * [Azure Demo Conference API](https://conferenceapi.azurewebsites.net?format=json)

## Register the API Center provider

After you've been added to the API Center preview, you need to register the **Microsoft.ApiCenter** resource provider in your subscription, using the portal or other tools. You only need to register the resource provider once. For steps, see [Register resource provider](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider). 

## Create an API center

1. [Sign in to the Azure portal using this link](https://aka.ms/apicenter/azureportal).

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

After deployment, your API center is ready to use!

## Define properties in the metadata schema

Each API center provides a configurable metadata schema to help you organize APIs and other assets according to properties that you define. Here you define two example properties: *Line of business* and *Public-facing*; if you prefer, define other properties of your own. When you add or update APIs and other assets in your API center, you'll set values for these properties and any common built-in properties.

> [!IMPORTANT]
> Take care not to include any sensitive, confidential, or personal information in the titles (names) of metadata properties you define. These titles are visible in monitoring logs that are used by Microsoft to improve the functionality of the service. However, other metadata details and values are your protected customer data. 

1. In the left menu, select **Metadata > + Add property**. 

1. On the **Details** tab, enter information about the property. 

    1. In **Title**, enter *Line of business*. 
    
    1. Select type **Predefined choices** and enter choices such as *Marketing, Finance, IT, Sales*, and so on. Optionally enable **Allow additional choices**. 

1. On the **Assignments tab**, select **Required** for APIs. Select **Optional** for Deployments and Environments. 

1. On the **Review + Create** tab, review the settings and select **Create**. 
 
    The property is added to the **Metadata** list. 

1. Select **+ Add property** to add another property.

1. On the **Details** tab, enter information about the property. 

    1. In **Title**, enter *Public-facing*. 
    
    1. Select type **Boolean**. 

1. On the **Assignments tab**, select **Required** for APIs. Select **Not applicable** for Deployments and Environments. 

    The property is added to the **Metadata** list.

1. Select **View schema > API** to see the properties that you added to the schema for APIs.

    :::image type="content" source="media/set-up-api-center/metadata-schema.png" alt-text="Screenshot of metadata schema in the portal.":::

## Add APIs

Now add (register) APIs in your API center. Each API registration includes an optional API specification file and built-in and custom metadata properties, including:

* API name, description, and summary
* Links to external documentation
* Version identifier
* Custom properties, like the *Line of business* property you defined in the previous section

The following steps register two sample APIs: Swagger Petstore API and Demo Conference API (see [Prerequisites](#prerequisites)). If you prefer, register APIs of your own.
 
1. In the portal, navigate to your API center.

1. In the left menu, select **APIs** > **+ Register API**.

1. In the **Register API** page, add the following information for the Swagger Petstore API. You'll see the custom *Line of business* and *Public-facing* metadata properties that you defined in the preceding section at the bottom of the page.

    |Setting|Value|Description|
    |-------|-----|-----------|
    |**API title**| Enter *Swagger Petstore API*.| Name you choose for the API.  |
    |**Identification**|After you enter the preceding title, API Center generates this identifier, which you can override.| Azure resource name for the API.|
    |**API type**| Select **REST** from the dropdown.| Type of API.|
    | **Summary** | Optionally enter a  summary. | Summary description of the API.  |
    | **Description** | Optionally enter a description. | Description of the API. |
    | **Version** | | |
    |**Version title**| Enter a version title of your choice, such as *v1*.|Name you choose for the API version.|
    |**Version identification**|After you enter the preceding title, API Center generates this identifier, which you can override.| Azure resource name for the version.|
    |**Version lifecycle**  | Make a selection from the dropdown, for example, **Testing** or **Production**. | Lifecycle stage of the API version. |
    |**Specification**        | Optionally upload YAML file for Swagger Petstore API.      |  API specification file, such as an OpenAPI specification for a REST API.     |
    |**External documentation**     | Optionally add one or more links to external documentation.       | Name, description, and URL of documentation for the API.      |  
    |**Contact**         |  Optionally add information for one or more contacts.       | Name, email, and URL of a contact for the API.      |  
    | **Line of business** | If you added this custom property, make a selection from the dropdown, such as **Marketing**. | Custom metadata property that identifies the business unit that owns the API. |
    | **Public-facing**  | If you added this custom property, select the checkbox.    |  Custom metadata property that identifies whether the API is public-facing or internal only.     |

1. Select **Create**. 
1. Repeat the preceding three steps to register another API, such as the Demo Conference API.

The APIs appear on the **APIs** page in the portal. When you've added a large number of APIs to the API center, use the search box and filters on this page to find the APIs you want.

:::image type="content" source="media/set-up-api-center/apis-page.png" alt-text="Screenshot of the APIs page in the portal.":::

> [!TIP]
> After registering an API, you can view or edit the API's properties. On the **APIs** page, select the API to see options to manage the API registration. 

## Add an API version

Throughout its lifecycle, an API could have multiple versions. You can add a version to an existing API in your API center, optionally with an updated specification file. 

Here you add a version to one of your APIs:

1. In the portal, navigate to your API center.

1. In the left menu, select **APIs**, and then select an API, for example, *Demo Conference API*.

1. Select **Versions** > **+ Add version**.

    :::image type="content" source="media/set-up-api-center/add-version.png" alt-text="Screenshot of adding an API version in the portal.":::

1. In the **Add version** page, enter or select the following information:
    
    |Setting|Value|Description|
    |-------|-----|-----------|
    |**Version title**| Enter a version title of your choice, such as *v2*.|Name you choose for the API version.|
    |**Version identification**|After you enter the preceding title, API Center generates this identifier, which you can override.| Azure resource name for the version.|
    |**Version lifecycle**  | Make a selection from the dropdown, such as **Production**. | Lifecycle stage of the API version. |
    |**Specification**        | Optionally upload an updated Demo Conference API JSON file.      |  API specification file, such as an OpenAPI specification for a REST API.     |

## Add an environment

Your API center helps you keep track of your real-world API environments. For example, you might use Azure API Management or another solution to distribute, secure, and monitor some of your APIs. Or you might directly serve some APIs using a compute service or a Kubernetes cluster. You can add multiple environments to your API center, each aligned with a phase such as development, testing, staging, or production.

Here you add a fictitious Azure API Management environment to your API center. If you prefer, add information about one of your existing environments. You'll configure both built-in properties and any custom metadata properties you've defined.


1. In the portal, navigate to your API center.

1. In the left menu, select **Environments** > **Add environment**.

1. In the **Create environment** page, add the following information. You'll see the custom *Line of business* metadata property that you defined at the bottom of the page.

    |Setting|Value|Description|
    |-------|-----|-----------|
    |**Title**| Enter *My Testing*.| Name you choose for the environment.  |
    |**Identification**|After you enter the preceding title, API Center generates this identifier, which you can override.| Azure resource name for the environment.|
    |**Environment type**| Optionally select **Testing** from the dropdown.| Type of environment for APIs.|
    | **Description** | Optionally enter a description. | Description of the environment. |
    | **Server** | | |
    |**Type**| Optionally select **Azure API Management** from the dropdown.|Type of API management solution used.|
    | **Management portal URL** | Optionally enter a URL such as `https://admin.contoso.com` | URL of management interface for environment. |
    | **Onboarding** | | |
    | **Development portal URL** | Optionally enter a URL such as `https://developer.contoso.com` | URL of interface for developer onboarding in the environment. |
    | **Instructions** | Optionally select **Edit** and enter onboarding instructions in standard Markdown. | Instructions to onboard to APIs from the environment. |
    | **Line of business** | If you added this custom property, optionally make a selection from the dropdown, such as **IT**. | Custom metadata property that identifies the business unit that manages APIs in the environment. |

## Add a deployment

API center can also help you catalog your API deployments - the environments where specific API versions are deployed. 

Here you create a deployment by associating one of your API versions with the environment you created in the previous section. You'll configure both built-in properties and any custom metadata properties you've defined.

1. In the portal, navigate to your API center.

1. In the left menu, select **APIs** and then select an API, for example, the *Demo Conference API*.

1. On the **Demo Conference API** page, select **Versions** and then select a version, such as *v1*.

1. On the Version page, select **Deployments**.

    :::image type="content" source="media/set-up-api-center/deployments.png" alt-text="Screenshot of API deployments in the portal.":::

1. Select **+ Add deployment**.

1. In the **Add deployment** page, add the following information. You'll see the custom *Line of business* metadata property that you defined at the bottom of the page.

    |Setting|Value|Description|
    |-------|-----|-----------|
    |**Title**| Enter *v1 Deployment*.| Name you choose for the deployment.  |
    |**Identification**|After you enter the preceding title, API Center generates this identifier, which you can override.| Azure resource name for the deployment.|
    | **Description** | Optionally enter a description. | Description of the deployment. |
    | **Environment** | Make a selection from the dropdown, such as *My Testing*, or optionally select **Create new**.| New or existing environment where the API version is deployed. |
    | **Runtime URL** | Enter a base URL such as `https://api.contoso.com/conference`. | Base runtime URL for the API in the environment.  |
    | **Line of business** | If you added this custom property, optionally make a selection from the dropdown, such as **IT**. | Custom metadata property that identifies the business unit that consumes APIs from the deployment. |

## Next steps

In this tutorial, you learned how to use the portal to:
> [!div class="checklist"]
> * Create an API center
> * Define metadata properties in the schema
> * Register one or more APIs in your API center
> * Add a version to an API
> * Add information about API environments and deployments

> [!div class="nextstepaction"]
> [Learn more about API Center](key-concepts.md)

