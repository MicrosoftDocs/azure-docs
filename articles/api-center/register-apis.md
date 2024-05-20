---
title: Tutorial - Start your API inventory 
description: In this tutorial, start the API inventory in your API center by registering APIs using the Azure portal.
author: dlepow
ms.service: api-center
ms.topic: tutorial
ms.date: 04/19/2024
ms.author: danlep 
#customer intent: As the owner of an Azure API center, I want a step by step introduction to adding APIs to the API inventory.
---

# Tutorial: Register APIs in your API inventory

In this tutorial, start the API inventory in your organization's [API center](overview.md) by registering APIs and assigning metadata using the Azure portal. 

For background information about APIs, API versions, definitions, and other entities that you can inventory in Azure API Center, see [Key concepts](key-concepts.md).

In this tutorial, you learn how to use the portal to:
> [!div class="checklist"]
> * Register one or more APIs
> * Add an API version with an API definition

## Prerequisites

* An API center in your Azure subscription. If you haven't created one already, see [Quickstart: Create your API center](set-up-api-center.md).

* One or more APIs that you want to register in your API center. Here are two examples, with links to their OpenAPI definitions:

    * [Swagger Petstore API](https://github.com/swagger-api/swagger-petstore/blob/master/src/main/resources/openapi.yaml)
    * [Azure Demo Conference API](https://conferenceapi.azurewebsites.net?format=json)

* Complete the previous tutorial, [Define custom metadata](add-metadata-properties.md), to define custom metadata for your APIs.

## Register APIs

When you register (add) an API in your API center, the API registration includes:
* A title (name), type, and description
* Version information
* Optional links to documentation and contacts
* Built-in and custom metadata that you defined

After registering an API, you can add versions and definitions to the API.

The following steps register two sample APIs: Swagger Petstore API and Demo Conference API (see [Prerequisites](#prerequisites)). If you prefer, register APIs of your own.
 
1. In the [portal](https://portal.azure.com), navigate to your API center.

1. In the left menu, under **Assets**, select **APIs** > **+ Register an API**.

1. In the **Register an API** page, add the following information for the Swagger Petstore API. You'll see the custom *Line of business* and *Public-facing* metadata that you defined in the previous tutorial at the bottom of the page.

    |Setting|Value|Description|
    |-------|-----|-----------|
    |**API title**| Enter *Swagger Petstore API*.| Name you choose for the API.  |
    |**Identification**|After you enter the preceding title, Azure API Center generates this identifier, which you can override.| Azure resource name for the API.|
    |**API type**| Select **REST** from the dropdown.| Type of API.|
    | **Summary** | Optionally enter a summary. | Summary description of the API.  |
    | **Description** | Optionally enter a description. | Description of the API. |
    | **Version** | | |
    |**Version title**| Enter a version title of your choice, such as *v1*.|Name you choose for the API version.|
    |**Version identification**|After you enter the preceding title, Azure API Center generates this identifier, which you can override.| Azure resource name for the version.|
    |**Version lifecycle**  | Make a selection from the dropdown, for example, **Testing** or **Production**. | Lifecycle stage of the API version. |
    |**External documentation**     | Optionally add one or more links to external documentation.       | Name, description, and URL of documentation for the API.      |
    |**License**         |  Optionally add license information.       | Name, URL, and ID of a license for the API.      |    
    |**Contact information**         |  Optionally add information for one or more contacts.       | Name, email, and URL of a contact for the API.      |  
    | **Line of business** | If you added this metadata in the previous tutorial, make a selection from the dropdown, such as **Marketing**. | Custom metadata that identifies the business unit that owns the API. |
    | **Public-facing**  | If you added this metadata, select the checkbox.    |  Custom metadata that identifies whether the API is public-facing or internal only.     |

    :::image type="content" source="media/register-apis/register-api.png" alt-text="Screenshot of registering an API in the portal.":::

1. Select **Create**. The API is registered.

1. Repeat the preceding three steps to register another API, such as the Demo Conference API.

> [!TIP]
> When you register an API in the portal, you can select any of the predefined API types or enter another type of your choice. 

The APIs appear on the **APIs** page in the portal. When you've added a large number of APIs to the API center, use the search box and filters on this page to find the APIs you want.

:::image type="content" source="media/register-apis/apis-page.png" alt-text="Screenshot of the APIs page in the portal." lightbox="media/register-apis/apis-page.png":::

After registering an API, you can view or edit the API's properties. On the **APIs** page, select the API to see pages to manage the API registration. 

## Add an API version

Throughout its lifecycle, an API could have multiple versions. You can add a version to an existing API in your API center, optionally with a definition file or files. 

Here you add a version to one of your APIs:

1. In the portal, navigate to your API center.

1. In the left menu, select **APIs**, and then select an API, for example, *Demo Conference API*.

1. On the Demo Conference API page, under **Details**, select **Versions** > **+ Add version**.

    :::image type="content" source="media/register-apis/add-version.png" alt-text="Screenshot of adding an API version in the portal." lightbox="media/register-apis/add-version.png":::

1. On the **Add API version** page: 

    1. Enter or select the following information:

        |Setting|Value|Description|
        |-------|-----|-----------|
        |**Version title**| Enter a version title of your choice, such as *v2*.|Name you choose for the API version.|
        |**Version identification**|After you enter the preceding title, Azure API Center generates this identifier, which you can override.| Azure resource name for the version.|
        |**Version lifecycle**  | Make a selection from the dropdown, such as **Production**. | Lifecycle stage of the API version. |
    
    1. Select **Create**. The version is added.
    
## Add a definition to your version

Usually you'll want to add an API definition to your API version. Azure API Center supports definitions in common text specification formats, such as OpenAPI 2 and 3 for REST APIs.

To add an API definition to your version:

1. On the **Versions** page of your API, select your API version.

1. In the left menu of your API version, under **Details**, select **Definitions** > **+ Add definition**.

1. On the **Add definition** Page:

    1. Enter or select the following information:

        |Setting|Value|Description|
        |-------|-----|-----------|
        |**Title**| Enter a title of your choice, such as *v2 Definition*.|Name you choose for the API definition.|
        |**Identification**|After you enter the preceding title, Azure API Center generates this identifier, which you can override.| Azure resource name for the definition.|
        | **Description** | Optionally enter a description. | Description of the API definition. |
        | **Specification name** | For the Demo Conference API, select **OpenAPI**. | Specification format for the API.|
        | **Specification version** | Enter a version identifier of your choice, such as *2.0*. | Specification version. |
        |**Document**        | Browse to a local definition file for the Demo Conference API, or enter a URL. Example URL: `https://conferenceapi.azurewebsites.net?format=json`   |  API definition file.     |

        :::image type="content" source="media/register-apis/add-definition.png" alt-text="Screenshot of adding an API definition in the portal." lightbox="media/register-apis/add-definition.png" :::

    1. Select **Create**. The definition is added.

In this tutorial, you learned how to use the portal to:
> [!div class="checklist"]    
> * Register one or more APIs
> * Add an API version with an API definition

As you build out your API inventory, take advantage of automated tools to register APIs, such as the [Azure API Center extension for Visual Studio Code](use-vscode-extension.md) and the [Azure CLI](manage-apis-azure-cli.md).

## Next steps

Your API inventory is starting to take shape! Now you can add information about API environments and deployments.

> [!div class="nextstepaction"]
> [Add API environments and deployments](configure-environments-deployments.md)

