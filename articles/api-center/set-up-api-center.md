---
title: Tutorial - Get started with Azure API Center (preview) | Microsoft Docs
description: In this tutorial, set up an API center for API discovery, reuse, and governance. Register APIs, add versions and definitions, set metadata properties, and more.
author: dlepow
ms.service: api-center
ms.topic: tutorial
ms.date: 08/31/2023
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
> * Add a version with an API definition to an API
> * Add information about API environments and deployments

For background information about APIs, deployments, and other entities that you can inventory in API Center, see [Key concepts](key-concepts.md).

[!INCLUDE [api-center-preview-feedback](includes/api-center-preview-feedback.md)]


## Prerequisites

* At least a Contributor role assignment or equivalent permissions in the Azure subscription. 

* One or more APIs that you want to register in your API center. Here are two examples, with links to their OpenAPI definitions for download:

    * [Swagger Petstore API](https://github.com/swagger-api/swagger-petstore/blob/master/src/main/resources/openapi.yaml)
    * [Azure Demo Conference API](https://conferenceapi.azurewebsites.net?format=json)

## Register the API Center provider

If you haven't already, you need to register the **Microsoft.ApiCenter** resource provider in your subscription, using the portal or other tools. You only need to register the resource provider once. For steps, see [Register resource provider](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider). 

## Create an API center

1. [Sign in](https://portal.azure.com) to the Azure portal.

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

You organize your APIs and other entities in by setting values of metadata properties, which can be used for searching and filtering and to enforce governance standards. Several common properties such as "API type" and "Version lifecycle" are built-in. Each API center provides a configurable metadata schema to help you define custom properties that are specific to your organization. 

Here you define two example properties: *Line of business* and *Public-facing*; if you prefer, define other properties of your own. When you add or update APIs, deployments, and environments, you'll set values for these properties and any common built-in properties.

> [!IMPORTANT]
> Take care not to include any sensitive, confidential, or personal information in the titles (names) of metadata properties you define. These titles are visible in monitoring logs that are used by Microsoft to improve the functionality of the service. However, other metadata details and values are your protected customer data. 

1. In the left menu, select **Metadata schema > + Add property**. 

1. On the **Details** tab, enter information about the property. 

    1. In **Title**, enter *Line of business*. 
    
    1. Select type **Predefined choices** and enter choices such as *Marketing, Finance, IT, Sales*, and so on. Optionally enable **Allow selection of multiple values**. 

    :::image type="content" source="media/set-up-api-center/metadata-property-details.png" alt-text="Screenshot of metadata schema property in the portal.":::

1. On the **Assignments** tab, select **Required** for APIs. Select **Optional** for Deployments and Environments. 

    :::image type="content" source="media/set-up-api-center/metadata-property-assignments.png" alt-text="Screenshot of metadata property assignments in the portal.":::

1. On the **Review + Create** tab, review the settings and select **Create**. 
 
    The property is added to the list. 

1. Select **+ Add property** to add another property.

1. On the **Details** tab, enter information about the property. 

    1. In **Title**, enter *Public-facing*. 
    
    1. Select type **Boolean**. 

1. On the **Assignments** tab, select **Required** for APIs. Select **Not applicable** for Deployments and Environments. 

1. On the **Review + Create** tab, review the settings and select **Create**. 

    The property is added to the list.

1. Select **View schema > API** to see the metadata schema for APIs, which includes built-in properties and the properties that you added.

    :::image type="content" source="media/set-up-api-center/metadata-schema.png" alt-text="Screenshot of metadata schema in the portal." lightbox="media/set-up-api-center/metadata-schema.png":::

> [!NOTE]
> * Add properties in the schema at any time and apply them to APIs and other entities in your API center. 
> * After adding a property, you can change its assignment to an entity, for example from required to optional for APIs.
> * You can't delete, unassign, or change the type of properties that are currently set in entities. Remove them from the entities first, and then you can delete or change them.

## Add APIs

Now add (register) APIs in your API center. Each API registration includes:
* a title (name), type, and description
* version information
* optional links to documentation and contacts
* built-in and custom metadata properties that you defined

The following steps register two sample APIs: Swagger Petstore API and Demo Conference API (see [Prerequisites](#prerequisites)). If you prefer, register APIs of your own.
 
1. In the portal, navigate to your API center.

1. In the left menu, select **APIs** > **+ Register API**.

1. In the **Register API** page, add the following information for the Swagger Petstore API. You'll see the custom *Line of business* and *Public-facing* metadata properties that you defined in a preceding section at the bottom of the page.

    |Setting|Value|Description|
    |-------|-----|-----------|
    |**API title**| Enter *Swagger Petstore API*.| Name you choose for the API.  |
    |**Identification**|After you enter the preceding title, API Center generates this identifier, which you can override.| Azure resource name for the API.|
    |**API type**| Select **REST** from the dropdown.| Type of API.|
    | **Summary** | Optionally enter a summary. | Summary description of the API.  |
    | **Description** | Optionally enter a description. | Description of the API. |
    | **Version** | | |
    |**Version title**| Enter a version title of your choice, such as *v1*.|Name you choose for the API version.|
    |**Version identification**|After you enter the preceding title, API Center generates this identifier, which you can override.| Azure resource name for the version.|
    |**Version lifecycle**  | Make a selection from the dropdown, for example, **Testing** or **Production**. | Lifecycle stage of the API version. |
    |**External documentation**     | Optionally add one or more links to external documentation.       | Name, description, and URL of documentation for the API.      |  
    |**Contact information**         |  Optionally add information for one or more contacts.       | Name, email, and URL of a contact for the API.      |  
    | **Line of business** | If you added this custom property, make a selection from the dropdown, such as **Marketing**. | Custom metadata property that identifies the business unit that owns the API. |
    | **Public-facing**  | If you added this custom property, select the checkbox.    |  Custom metadata property that identifies whether the API is public-facing or internal only.     |

    :::image type="content" source="media/set-up-api-center/register-api.png" alt-text="Screenshot of registering an API in the portal.":::

1. Select **Create**.
1. Repeat the preceding three steps to register another API, such as the Demo Conference API.

The APIs appear on the **APIs** page in the portal. When you've added a large number of APIs to the API center, use the search box and filters on this page to find the APIs you want.

:::image type="content" source="media/set-up-api-center/apis-page.png" alt-text="Screenshot of the APIs page in the portal.":::

> [!TIP]
> After registering an API, you can view or edit the API's properties. On the **APIs** page, select the API to see options to manage the API registration. 

## Add an API version

Throughout its lifecycle, an API could have multiple versions. You can add a version to an existing API in your API center, optionally with a definition file or files. 

Here you add a version to one of your APIs:

1. In the portal, navigate to your API center.

1. In the left menu, select **APIs**, and then select an API, for example, *Demo Conference API*.

1. On the Demo Conference API page, select **Versions** > **+ Add version**.

    :::image type="content" source="media/set-up-api-center/add-version.png" alt-text="Screenshot of adding an API version in the portal.":::

1. In the **Add API version** page: 
    1. Enter or select the following information:

        |Setting|Value|Description|
        |-------|-----|-----------|
        |**Version title**| Enter a version title of your choice, such as *v2*.|Name you choose for the API version.|
        |**Version identification**|After you enter the preceding title, API Center generates this identifier, which you can override.| Azure resource name for the version.|
        |**Version lifecycle**  | Make a selection from the dropdown, such as **Production**. | Lifecycle stage of the API version. |
    
    1. Select **Create**.
    
1. To add an API definition to your version, in the left menu of your API version, select **Definitions** > **+ Add definition**.

1. In the **Add definition** Page:

    1. Enter or select the following information:

        |Setting|Value|Description|
        |-------|-----|-----------|
        |**Title**| Enter a title of your choice, such as *OpenAPI 2*.|Name you choose for the API definition.|
        |**Identification**|After you enter the preceding title, API Center generates this identifier, which you can override.| Azure resource name for the definition.|
        | **Description** | Optionally enter a description. | Description of the API definition. |
        | **Specification name** | For the Demo Conference API, select **OpenAPI**. | Specification format for the API.|
        | **Specification version** | Enter a version identifier of your choice, such as *2.0*. | Specification version. |
        |**Document**        | Browse to a definition file for the Demo Conference API.      |  API definition file.     |

        :::image type="content" source="media/set-up-api-center/add-definition.png" alt-text="Screenshot of adding an API definition in the portal." lightbox="media/set-up-api-center/add-definition.png":::


    1. Select **Create**.

## Add an environment

Use your API center to keep track of your real-world API environments. For example, you might use Azure API Management or another solution to distribute, secure, and monitor some of your APIs. Or you might directly serve some APIs using a compute service or a Kubernetes cluster. You can add multiple environments to your API center, each aligned with a lifecycle stage such as development, testing, staging, or production.

Here you add information about a fictitious Azure API Management environment to your API center. If you prefer, add information about one of your existing environments. You'll configure both built-in properties and any custom metadata properties you've defined.

1. In the portal, navigate to your API center.

1. In the left menu, select **Environments** > **+ Add environment**.

1. In the **Create environment** page, add the following information. You'll see the custom *Line of business* metadata property that you defined at the bottom of the page.

    |Setting|Value|Description|
    |-------|-----|-----------|
    |**Title**| Enter *My Testing*.| Name you choose for the environment.  |
    |**Identification**|After you enter the preceding title, API Center generates this identifier, which you can override.| Azure resource name for the environment.|
    |**Environment type**| Select **Testing** from the dropdown.| Type of environment for APIs.|
    | **Description** | Optionally enter a description. | Description of the environment. |
    | **Server** | | |
    |**Type**| Optionally select **Azure API Management** from the dropdown.|Type of API management solution used.|
    | **Management portal URL** | Optionally enter a URL such as `https://admin.contoso.com` | URL of management interface for environment. |
    | **Onboarding** | | |
    | **Development portal URL** | Optionally enter a URL such as `https://developer.contoso.com` | URL of interface for developer onboarding in the environment. |
    | **Instructions** | Optionally select **Edit** and enter onboarding instructions in standard Markdown. | Instructions to onboard to APIs from the environment. |
    | **Line of business** | If you added this custom property, optionally make a selection from the dropdown, such as **IT**. | Custom metadata property that identifies the business unit that manages APIs in the environment. |

    :::image type="content" source="media/set-up-api-center/create-environment.png" alt-text="Screenshot of adding an API environment in the portal." :::

1. Select **Create**.

## Add a deployment

API center can also help you catalog your API deployments - the runtime environments where the APIs you track are deployed. 

Here you add a deployment by associating one of your APIs with the environment you created in the previous section. You'll configure both built-in properties and any custom metadata properties you've defined.

1. In the portal, navigate to your API center.

1. In the left menu, select **APIs** and then select an API, for example, the *Demo Conference API*.

1. On the **Demo Conference API** page, select **Deployments** > **+ Add deployment**.

1. In the **Add deployment** page, add the following information. You'll see the custom *Line of business* metadata property that you defined at the bottom of the page.

    |Setting|Value|Description|
    |-------|-----|-----------|
    |**Title**| Enter *v1 Deployment*.| Name you choose for the deployment.  |
    |**Identification**|After you enter the preceding title, API Center generates this identifier, which you can override.| Azure resource name for the deployment.|
    | **Description** | Optionally enter a description. | Description of the deployment. |
    | **Environment** | Make a selection from the dropdown, such as *My Testing*, or optionally select **Create new**.| New or existing environment where the API version is deployed. |
    | **Definition** | Select or add an API definition file for the Demo Conference API. | API definition file. |
    | **Runtime URL** | Enter a base URL such as `https://api.contoso.com/conference`. | Base runtime URL for the API in the environment.  |
    | **Line of business** | If you added this custom property, optionally make a selection from the dropdown, such as **IT**. | Custom metadata property that identifies the business unit that manages APIs in the environment. |

    :::image type="content" source="media/set-up-api-center/add-deployment.png" alt-text="Screenshot of adding an API deployment in the portal." :::

1. Select **Create**.

In this tutorial, you learned how to use the portal to:
> [!div class="checklist"]
> * Create an API center
> * Define metadata properties in the schema
> * Register one or more APIs in your API center
> * Add a version with an API definition to an API
> * Add information about API environments and deployments

## Next steps

> [!div class="nextstepaction"]
> [Learn more about API Center](key-concepts.md)

