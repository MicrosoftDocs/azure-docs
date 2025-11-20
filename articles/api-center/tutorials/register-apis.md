---
title: Tutorial - Start Your API Inventory 
description: Learn how to start the API inventory in your API center by registering APIs using the Azure portal.
author: dlepow
ms.service: azure-api-center
ms.topic: tutorial
ms.date: 10/20/2025
ms.author: danlep 
#customer intent: As the owner of an Azure API center, I want a step by step introduction to adding APIs to the API inventory.
---

# Tutorial: Register APIs in your API inventory

This tutorial explains how to start the API inventory in your organization's [API center](../overview.md) by registering APIs and assigning metadata using the Azure portal. 

For more information about APIs, API versions, definitions, and other entities that you can inventory in Azure API Center, see [Key concepts](../key-concepts.md).

In this tutorial, you learn how to use the Azure portal to:
> [!div class="checklist"]
> - Register one or more APIs
> - Add an API version with an API definition

## Prerequisites

- An API center in your Azure subscription. To create one, see [Quickstart: Create your API center](../set-up-api-center.md).

- One or more APIs that you want to register in your API center. Here are two examples, with links to their OpenAPI definitions:

    - [Swagger Petstore API](https://github.com/swagger-api/swagger-petstore/blob/master/src/main/resources/openapi.yaml)
    - [Conference API](https://github.com/petender/ConferenceAPI)

- Define custom metadata for your APIs by completing the previous tutorial, [Define custom metadata](add-metadata-properties.md).

## Register APIs

When you register (add) an API in your API center, the API registration includes:
- A title (name), type, and description
- Version information
- Optional links to documentation and contacts
- Built-in and custom metadata that you defined

After registering an API, you can add versions and definitions to the API.

The following steps register two sample APIs: Swagger Petstore API and Conference API (see [Prerequisites](#prerequisites)). If you prefer, register APIs of your own.
 
1. Sign in to the [Azure portal](https://portal.azure.com), then navigate to your API center.

1. In the sidebar menu, under **Assets**, select **APIs** > **+ Register an API**.

1. In the **Register an API** page, add the following information for the Swagger Petstore API. You should see the custom *Line of business* and *Public-facing* metadata that you defined in the previous tutorial at the bottom of the page.

    |Setting|Value|Description|
    |-------|-----|-----------|
    |**API title**| Enter *Swagger Petstore API*.| Name you choose for the API  |
    |**Identification**|After you enter the preceding title, Azure API Center generates this identifier, which you can override.| Azure resource name for the API |
    |**API type**| Select **REST** from the dropdown.| Type of API |
    | **Summary** | Optionally enter a summary. | Summary description of the API  |
    | **Description** | Optionally enter a description. | Description of the API |
    | **Version** | | |
    |**Version title**| Enter a version title of your choice, such as *v1*.|Name you choose for the API version |
    |**Version identification**|After you enter the preceding title, Azure API Center generates this identifier, which you can override.| Azure resource name for the version |
    |**Version lifecycle**  | Make a selection from the dropdown, for example, **Testing** or **Production**. | Lifecycle stage of the API version |
    |**External documentation**     | Optionally add one or more links to external documentation.       | Name, description, and URL of documentation for the API     |
    |**License**         |  Optionally add license information.       | Name, URL, and ID of a license for the API     |
    |**Contact information**         |  Optionally add information for one or more contacts.       | Name, email, and URL of a contact for the API     |
    | **Line of business** | If you added this metadata in the previous tutorial, make a selection from the dropdown, such as **Marketing**. | Custom metadata that identifies the business unit that owns the API  |
    | **Public-facing**  | If you added this metadata, select the checkbox.    |  Custom metadata that identifies whether the API is public-facing or internal only    |

    :::image type="content" source="./media/register-apis/register-api.png" alt-text="Screenshot of the dialog box to register an API in the Azure portal." lightbox="./media/register-apis/register-api.png":::

1. Select **Create** to register the API.

1. Repeat the preceding three steps to register another API, such as the Conference API.

> [!TIP]
> When you register an API in the Azure portal, you can select any of the predefined API types or enter another type of your choice. 

The APIs appear on the **APIs** page in the portal. If you add a large number of APIs to the API center, use the search box and filters on this page to find the APIs you want.

:::image type="content" source="./media/register-apis/apis-page.png" alt-text="Screenshot of the APIs page in the portal." lightbox="./media/register-apis/apis-page.png":::

After registering an API, you can view or edit the API's properties. On the **APIs** page, select the API to see pages to manage the API registration. 

<a id="add-a-definition-to-your-version"></a>

## Add an API version

Throughout its lifecycle, an API can have multiple versions. You can add a version to an existing API in your API center, optionally with a definition file or files. 

Here you add a version to one of your APIs:

1. In the Azure portal, navigate to your API center.

1. In the sidebar menu, select **APIs**, and then select an API, for example, *Swagger Petstore*.

1. On the API page, under **Details**, select **Versions** > **+ Add version**.

    :::image type="content" source="./media/register-apis/add-version.png" alt-text="Screenshot of adding an API version in the portal." lightbox="./media/register-apis/add-version.png":::

1. On the **Add API version** page, enter or select the following information under **Version details**:

    |Setting|Value|Description|
    |-------|-----|-----------|
    |**Version title**| Enter a version title of your choice, such as *v2*.|Name you choose for the API version |
    |**Version identification**|After you enter the preceding title, Azure API Center generates this identifier, which you can override.| Azure resource name for the version |
    |**Version lifecycle**  | Make a selection from the dropdown, such as **Production**. | Lifecycle stage of the API version |

1. Azure API Center supports definitions in common text specification formats, such as OpenAPI 2 and 3 for REST APIs. To add an API definition, enter or select the following information under **Select a specification**:

    |Setting|Value|Description|
    |-------|-----|-----------|
    |**Definition title**| Enter a title of your choice, such as *v2 Definition*.|Name you choose for the API definition|
    |**Definition identification**|After you enter the preceding title, Azure API Center generates this identifier, which you can override.| Azure resource name for the definition|
    |**Description** | Optionally enter a description. | Description of the API definition |
    |**Specification format** | For the Petstore API, select **OpenAPI**. | Specification format for the API|
    |**Specification version** | Enter a version identifier of your choice, such as *3.0*. | Specification version |
    |**File** or **URL**   | Browse to a local definition file for the Petstore API, or enter a URL. Example URL: `https://raw.githubusercontent.com/swagger-api/swagger-petstore/refs/heads/master/src/main/resources/openapi.yaml`   |  API definition file   |

    :::image type="content" source="./media/register-apis/add-definition.png" alt-text="Screenshot of adding an API definition in the portal." lightbox="./media/register-apis/add-definition.png" :::

1. Select **Create**.

As you build out your API inventory, take advantage of automated tools to register APIs, such as the [Azure API Center extension for Visual Studio Code](../build-register-apis-vscode-extension.md) and the [Azure CLI](../manage-apis-azure-cli.md).

## Next step

Your API inventory is starting to take shape! Now you can add information about API environments and deployments.

> [!div class="nextstepaction"]
> [Add API environments and deployments](./configure-environments-deployments.md)

