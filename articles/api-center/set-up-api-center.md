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

* One or more APIs that you want to register in your API center. Here are two examples, with links to their OpenAPI specifications which you can download:

    * [Azure Demo Conference API](https://conferenceapi.azurewebsites.net?format=json)
    * [Swagger Petstore API](https://petstore.swagger.io/v2/swagger.json)

> [!NOTE]
> If you want to add an API specification to your API center inventory, you need to upload it from a local file.

## Create an API center

1. [Sign in](https://portal.azure.com) to the portal. 

1. In the search bar, enter *API Centers*. 

1. Select **+ Create**. 

1. On the **Basics** tab, select or enter the following settings: 

    1. Select your Azure subscription. 

    1. Select an existing resource group, or select **New** to create a new one. 

    1. Provide a **Name** for your API center. 

    1. In **Region**, select one of the [available regions](overview.md#preview-limitations) for API Center preview. 

1. Optionally, on the **Tags** tab, add one or more name/value pairs to help you categorize your Azure resources.

1. Select **Review + create**. 

1. After validation completes, select **Create**.

After a short time, your API center is ready for use.

## Define properties in metadata schema

Each API center provides a configurable metadata schema to describe the metadata properties available to apply to APIs and other assets. Here you add custom properties to the schema that you apply later to APIs in the API center.

1. In the left menu, select **Metadata > + Add property**. 

1. On the **Details** tab, enter information about the property. 

    1. In **Title**, enter *Line of Business* 
    
    1. Select type **Predefined choices** and enter choices such as Marketing, Finance, IT, Sales, and so on. Optionally enable **Allow additional choices**. 

1. On the **Assignments tab**, select **Required** for APIs. Select **Optional** for Deployments and Environments. 

1. On the **Review + Create** tab, review the settings and select **Create**. 
 
    The property is added to the **Metadata** list. 

1. Select **+ Add property** to add another property.

1. On the **Details** tab, enter information about the property. 

    1. In **Title**, enter *Public facing*. 
    
    1. Select type **Boolean**. 

1. On the **Assignments tab**, select **Required** for APIs. Select **Not applicable** for Deployments and Environments. 

    The property is added to the **Metadata** list.

1. Select **View schema > API** to see the schema configured for APIs.

:::image type="content" source="media/set-up-api-center/metadata-schema.png" alt-text="Screenshot of metadata schema in the portal.":::


## Register APIs

Now register APIs in your API center. For each API, add descriptive information such as the name and API type, identify the version and optionally an API specification, link to documentation and a contact, and set custom metadata properties defined in your metadata schema. The following steps register two sample APIs: Azure Demo Conference API and Swagger Petstore API
 
1. In the portal, navigate to your API center.

1. In the left menu, select **APIs** > **+ Register API**.

1. In the **Register API** window, add the following information for the Demo Conference API. Note that the *Line of business* and *Public facing* metadata properties that you defined in the preceding section appear at the bottom of the window.

    |Setting|Value|Description|
    |-------|-----|-----------|
    |**API title**| Enter *Demo Conference API*| Name you choose for the API.  |
    |**Identification**|After you enter the preceding title, API Center generates this identifier, which you can override.| Azure resource name for the API.|
    |**API type**| Select **REST** from the dropdown.| Type of API.|
    | **Summary** | Optionally enter a  summary. | Summary description of the API.  |
    | **Description** | Optionally enter a description. | Description of the API. |
    |**Version title**| Enter a version title of your choice, such as *v1*.|Name you choose for the API version.|
    |**Version identification**|After you enter the preceding title, API Center generates this identifier, which you can override.| Azure resource name for the version.|
    |**Version lifecycle**  | Make a selection from the dropdown, such as **Testing**  | Lifecycle stage of the API version |
    |**Specification**        | Optionally upload  Demo Conference API JSON file.      |       |
    |**External documentation**     | Optionally add one or more links to external documentation        | Name, description, and URL of documentation for the API.      |  
    |**Contact**         |  Optionally add information for one or more contacts.       | Name, email, and URL of a contact for the API.      |  
    | **Line of business** | Make a selection from the dropdown, such as **Marketing** | Custom metadata property that identifies the business unit that consumes the API. |
    | **Public facing**  | Select the checkbox.    |  Custom metadata property that identifies whether the API is public facing or internal only.     |

1. Select **Create**. 
1. Repeat the preceding three steps to register the Swagger Petstore API.

The APIs appear on the **APIs** page in the portal. 

:::image type="content" source="media/set-up-api-center/apis-page.png" alt-text="Screenshot of the APIs page in the portal.":::

To help you find APIs in your API center, use the search box on the APIs page, or apply filters to select values of metadata properties.

> [!TIP]
> Optional information to help a user be more successful

## Add an environment

l


## Next steps

> [!div class="nextstepaction"]
