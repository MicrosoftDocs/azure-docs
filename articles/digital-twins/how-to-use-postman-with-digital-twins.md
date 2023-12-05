---
title: Call the Azure Digital Twins APIs with Postman
titleSuffix: Azure Digital Twins
description: Learn how to authorize, configure, and use Postman to call the Azure Digital Twins APIs. This article shows you how to use both the control and data plane APIs.
ms.author: baanders
author: baanders
ms.service: digital-twins
services: digital-twins
ms.topic: how-to
ms.date: 01/23/2023
ms.custom: contperf-fy21q4
---

# How to send requests to the Azure Digital Twins APIs using Postman

[Postman](https://www.getpostman.com/) is a REST testing tool that provides key HTTP request functionalities in a desktop and plugin-based GUI. You can use it to craft HTTP requests and submit them to the [Azure Digital Twins REST APIs](concepts-apis-sdks.md). This article describes how to configure the [Postman REST client](https://www.getpostman.com/) to interact with the Azure Digital Twins APIs. This information is specific to the Azure Digital Twins service.

This article contains information about the following steps:

1. Use the Azure CLI to [get a bearer token](#get-bearer-token) that you'll use to make API requests in Postman.
1. Set up a [Postman collection](#about-postman-collections) and configure the Postman REST client to use your bearer token to authenticate. When setting up the collection, you can choose either of these options:
    1. [Import a pre-built collection of Azure Digital Twins API requests](#import-collection-of-azure-digital-twins-apis).
    1. [Create your own collection from scratch](#create-your-own-collection).
1. [Add requests to your configured collection](#add-an-individual-request) and send them to the Azure Digital Twins APIs.

Azure Digital Twins has two sets of APIs that you can work with: data plane and control plane. For more about the difference between these API sets, see [Azure Digital Twins APIs and SDKs](concepts-apis-sdks.md). This article contains information for both API sets.

## Prerequisites

To proceed with using Postman to access the Azure Digital Twins APIs, you need to set up an Azure Digital Twins instance and download Postman. The rest of this section walks you through these steps.

### Set up Azure Digital Twins instance

[!INCLUDE [digital-twins-prereq-instance.md](../../includes/digital-twins-prereq-instance.md)]

### Download Postman

Next, [download the desktop version of the Postman client](https://www.getpostman.com/apps).

## Get bearer token

Now that you've set up Postman and your Azure Digital Twins instance, you'll need to get a bearer token that Postman requests can use to authorize against the Azure Digital Twins APIs.

There are several possible ways to obtain this token. This article uses the [Azure CLI](/cli/azure/install-azure-cli) to sign into your Azure account and obtain a token.

If you have an [Azure CLI installed locally](/cli/azure/install-azure-cli), you can start a command prompt on your machine to run the following commands.
Otherwise, you can open an [Azure Cloud Shell](https://shell.azure.com) window in your browser and run the commands there.

1. First, make sure you're logged into Azure with the appropriate credentials, by running this command:

    ```azurecli-interactive
    az login
    ```

2. Next, use the [az account get-access-token](/cli/azure/account#az-account-get-access-token()) command to get a bearer token with access to the Azure Digital Twins service. In this command, you'll pass in the resource ID for the Azure Digital Twins service endpoint, in order to get an access token that can access Azure Digital Twins resources. 

    The required context for the token depends on which set of APIs you're using, so use the following tabs to select between [data plane](concepts-apis-sdks.md#data-plane-apis) and [control plane](concepts-apis-sdks.md#control-plane-apis) APIs.

    # [Data plane](#tab/data-plane)
    
    To get a token to use with the data plane APIs, use the following static value for the token context: `0b07f429-9f4b-4714-9392-cc5e8e80c8b0`. This value is the resource ID for the Azure Digital Twins service endpoint.
    
    ```azurecli-interactive
    az account get-access-token --resource 0b07f429-9f4b-4714-9392-cc5e8e80c8b0
    ```
    
    # [Control plane](#tab/control-plane)
    
    To get a token to use with the control plane APIs, use the following value for the token context: `https://management.azure.com/`.
    
    ```azurecli-interactive
    az account get-access-token --resource https://management.azure.com/
    ```
    ---

    >[!NOTE]
    > If you need to access your Azure Digital Twins instance using a service principal or user account that belongs to a different Microsoft Entra tenant from the instance, you'll need to request a token from the Azure Digital Twins instance's "home" tenant. For more information on this process, see [Write app authentication code](how-to-authenticate-client.md#authenticate-across-tenants).

3. Copy the value of `accessToken` in the result, and save it to use in the next section. This value is your **token value** that you'll provide to Postman to authorize your requests.

   :::image type="content" source="media/how-to-use-postman-with-digital-twins/console-access-token.png" alt-text="Screenshot of the console showing the result of the az account get-access-token command. The accessToken field with its sample value highlighted." lightbox="media/how-to-use-postman-with-digital-twins/console-access-token.png":::

>[!TIP]
>This token is valid for at least five minutes and a maximum of 60 minutes. If you run out of time allotted for the current token, you can repeat the steps in this section to get a new one.

Next, you'll set up Postman to use this token to make API requests to Azure Digital Twins.

## About Postman collections

Requests in Postman are saved in *collections* (groups of requests). When you create a collection to group your requests, you can apply common settings to many requests at once. Common settings can greatly simplify authorization if you plan to create more than one request against the Azure Digital Twins APIs, as you only have to configure these details once for the entire collection.

When working with Azure Digital Twins, you can get started by importing a [pre-built collection of all the Azure Digital Twins requests](#import-collection-of-azure-digital-twins-apis). You may want to import this collection if you're exploring the APIs and want to set up a project quickly with request examples.

Alternatively, you can also choose to start from scratch, by [creating your own empty collection](#create-your-own-collection) and populating it with individual requests that call only the APIs you need. 

The following sections describe both of these processes. The rest of the article takes place in your local Postman application, so go ahead and open the Postman application on your computer now.

## Import collection of Azure Digital Twins APIs

A quick way to get started with Azure Digital Twins in Postman is to import a pre-built collection of requests for the APIs. Follow the steps below to import a collection of popular Azure Digital Twins data plane API requests containing sample request data.

1. From the main Postman window, select the **Import** button.
    :::image type="content" source="media/how-to-use-postman-with-digital-twins/postman-import-collection.png" alt-text="Screenshot of a newly opened Postman window. The 'Import' button is highlighted." lightbox="media/how-to-use-postman-with-digital-twins/postman-import-collection.png":::

1. In the **Import** window that follows, select **Link** and enter the following URL: `https://raw.githubusercontent.com/microsoft/azure-digital-twins-postman-samples/main/postman_collection.json`. Then select **Import** to confirm.

   :::image type="content" source="media/how-to-use-postman-with-digital-twins/postman-import-collection-2.png" alt-text="Screenshot of Postman's 'Import' window, showing the file to import as a collection and the Import button." lightbox="media/how-to-use-postman-with-digital-twins/postman-import-collection-2.png":::

The newly imported collection can now be seen from your main Postman view, in the Collections tab.

:::image type="content" source="media/how-to-use-postman-with-digital-twins/postman-post-collection-imported.png" alt-text="Screenshot of the main Postman window. The newly imported collection is highlighted in the 'Collections' tab." lightbox="media/how-to-use-postman-with-digital-twins/postman-post-collection-imported.png":::

>[!TIP]
> To import the complete set of API calls for a certain version of the Azure Digital Twins APIs (including control plane or data plane), you can also import Swagger files as collections. For links to the Swagger files for the control plane and data plane APIs, see [Azure Digital Twins APIs and SDKs](concepts-apis-sdks.md).

Next, continue on to the next section to add a bearer token to the collection for authorization and connect it to your Azure Digital twins instance.

### Configure authorization

Next, edit the collection you've created to configure some access details. Highlight the collection you've created and select the **View more actions** icon to display action options. Select **Edit**.

:::image type="content" source="media/how-to-use-postman-with-digital-twins/postman-edit-collection.png" alt-text="Screenshot of Postman. The 'View more actions' icon for the imported collection is highlighted, and 'Edit' is highlighted in the options." lightbox="media/how-to-use-postman-with-digital-twins/postman-edit-collection.png":::

Follow these steps to add a bearer token to the collection for authorization. Use the token value you gathered in the [Get bearer token](#get-bearer-token) section in order to use it for all API requests in your collection.

1. In the edit dialog for your collection, make sure you're on the **Authorization** tab. 

    :::image type="content" source="media/how-to-use-postman-with-digital-twins/postman-authorization-imported.png" alt-text="Screenshot of the imported collection's edit dialog in Postman, showing the 'Authorization' tab." lightbox="media/how-to-use-postman-with-digital-twins/postman-authorization-imported.png":::

1. Set the Type to **OAuth 2.0** and paste your access token into the Access Token box. You must use the correct token for the type of API you're using, as there are different tokens for data plane APIs versus control plane APIs. Select **Save**.

    :::image type="content" source="media/how-to-use-postman-with-digital-twins/postman-paste-token-imported.png" alt-text="Screenshot of Postman edit dialog for the imported collection, on the 'Authorization' tab. Type is 'OAuth 2.0', and Access Token box is highlighted." lightbox="media/how-to-use-postman-with-digital-twins/postman-paste-token-imported.png":::

    > [!TIP]
    > You can choose to turn on token sharing if you want to store the token with the request on Postman cloud, and potentially share your token with others.

### Other configuration

You can help the collection connect easily to your Azure Digital Twins resources by setting some variables provided with the collection. When many requests in a collection require the same value (like the host name of your Azure Digital Twins instance), you can store the value in a variable that applies to every request in the collection. The Azure Digital Twins collection comes with pre-created variables that you can set at the collection level.

1. Still in the edit dialog for your collection, move to the **Variables** tab.

1. Use the following table to set the values of the variables in the collection:

    | Variable | API set | Description |
    | -------- | ------- | ----------- |
    | `digitaltwins-hostname` | Data plane | The host name of your Azure Digital Twins instance. You can find this value on the overview page for your instance in the Portal. |
    | `subscriptionId` | Control plane | Your Azure subscription ID. |
    | `digitalTwinInstance` | Control plane | The name of your Azure Digital Twins instance. |

    :::image type="content" source="media/how-to-use-postman-with-digital-twins/postman-variables-imported.png" alt-text="Screenshot of the imported collection's edit dialog in Postman, showing the 'Variables' tab. The 'CURRENT VALUE' field is highlighted." lightbox="media/how-to-use-postman-with-digital-twins/postman-variables-imported.png":::

1. If your collection has extra variables, fill and save those values as well.

1.  Select **Save**.

When you're finished with the above steps, you're done configuring the collection. You can close the editing tab for the collection if you want.

### Explore requests

Next, explore the requests inside the Azure Digital Twins API collection. You can expand the collection to view the pre-created requests (sorted by category of operation). 

Different requests require different information about your instance and its data. To see all the information required to craft a particular request, look up the request details in the [Azure Digital Twins REST API reference documentation](/rest/api/azure-digitaltwins/).

You can edit the details of a request in the Postman collection using these steps:

1. Select it from the list to pull up its editable details. 

1. Most of the requests in the sample collection are pre-configured to run without making any further changes.

1. The following screenshot shows the **DigitalTwinModels Add** API. On the **Body** tab you can see the JSON payload that defines the new model to add:

1. Fill in values for the variables listed in the **Params** tab under **Path Variables**.

    :::image type="content" source="media/how-to-use-postman-with-digital-twins/postman-request-details-imported.png" alt-text="Screenshot of Postman. The collection is expanded to show the body tab of a request." lightbox="media/how-to-use-postman-with-digital-twins/postman-request-details-imported.png":::

1. To run the request, use the **Send** button.

You can also add your own requests to the collection, using the process described in the [Add an individual request](#add-an-individual-request) section.

## Create your own collection

Instead of importing the existing collection of Azure Digital Twins APIs, you can also create your own collection from scratch. You can then populate it with individual requests using the [Azure Digital Twins REST API reference documentation](/rest/api/azure-digitaltwins/).

### Create a Postman collection

1. To create a collection, select the **New** button in the main Postman window.

    :::image type="content" source="media/how-to-use-postman-with-digital-twins/postman-new.png" alt-text="Screenshot of the main Postman window. The 'New' button is highlighted." lightbox="media/how-to-use-postman-with-digital-twins/postman-new.png":::

    Choose a type of **Collection**.

    :::image type="content" source="media/how-to-use-postman-with-digital-twins/postman-new-collection-2.png" alt-text="Screenshot of the 'Create New' dialog in Postman. The 'Collection' option is highlighted.":::

1. A tab opens. Fill in the details of the new collection. Select the Edit icon next to the collection's default name (**New Collection**) to replace it with your own choice of name. 

    :::image type="content" source="media/how-to-use-postman-with-digital-twins/postman-new-collection-3.png" alt-text="Screenshot of the new collection's edit dialog in Postman. The Edit icon next to the name 'New Collection' is highlighted." lightbox="media/how-to-use-postman-with-digital-twins/postman-new-collection-3.png":::

Next, continue on to the next section to add a bearer token to the collection for authorization.

### Configure authorization

Follow these steps to add a bearer token to the collection for authorization. Use the token value you gathered in the [Get bearer token](#get-bearer-token) section in order to use it for all API requests in your collection.

1. Still in the edit dialog for your new collection, move to the **Authorization** tab.

    :::image type="content" source="media/how-to-use-postman-with-digital-twins/postman-authorization-custom.png" alt-text="Screenshot of the new collection's edit dialog in Postman, showing the 'Authorization' tab." lightbox="media/how-to-use-postman-with-digital-twins/postman-authorization-custom.png":::

1. Set the Type to **OAuth 2.0**, paste your access token into the Access Token box, and select **Save**.

    :::image type="content" source="media/how-to-use-postman-with-digital-twins/postman-paste-token-custom.png" alt-text="Screenshot of the Postman edit dialog for the new collection, on the 'Authorization' tab. Type is 'OAuth 2.0', and Access Token box is highlighted." lightbox="media/how-to-use-postman-with-digital-twins/postman-paste-token-custom.png":::

When you're finished with the above steps, you're done configuring the collection. You can close the edit tab for the new collection if you want.

The new collection can be seen from your main Postman view, in the Collections tab.

:::image type="content" source="media/how-to-use-postman-with-digital-twins/postman-post-collection-custom.png" alt-text="Screenshot of the main Postman window. The newly created custom collection is highlighted in the 'Collections' tab." lightbox="media/how-to-use-postman-with-digital-twins/postman-post-collection-custom.png":::

## Add an individual request

Now that your collection is set up, you can add your own requests to the Azure Digital Twin APIs.

1. To create a request, use the **New** button again.

    :::image type="content" source="media/how-to-use-postman-with-digital-twins/postman-new.png" alt-text="Screenshot of the main Postman window. The 'New' button is highlighted." lightbox="media/how-to-use-postman-with-digital-twins/postman-new.png":::

    Choose a type of **Request**.

    :::image type="content" source="media/how-to-use-postman-with-digital-twins/postman-new-request-2.png" alt-text="Screenshot of the 'Create New' dialog in Postman. The 'Request' option is highlighted.":::

1. This action opens the SAVE REQUEST window, where you can enter a name for your request, give it an optional description, and choose the collection that it's a part of. Fill in the details and save the request to the collection you created earlier.

:::image type="content" source="media/how-to-use-postman-with-digital-twins/postman-save-request.png" alt-text="Screenshot of 'Save request' window in Postman showing the fields described. The 'Save to Azure Digital Twins collection' button is highlighted.":::

You can now view your request under the collection, and select it to pull up its editable details.

:::image type="content" source="media/how-to-use-postman-with-digital-twins/postman-request-details-custom.png" alt-text="Screenshot of Postman. The Azure Digital Twins collection is expanded to show the request's details." lightbox="media/how-to-use-postman-with-digital-twins/postman-request-details-custom.png":::

### Set request details

To make a Postman request to one of the Azure Digital Twins APIs, you'll need the URL of the API and information about what details it requires. You can find this information in the [Azure Digital Twins REST API reference documentation](/rest/api/azure-digitaltwins/).

To proceed with an example query, this article will use the [Azure Digital Twins Query API](/rest/api/digital-twins/dataplane/query/querytwins) to query for all the digital twins in an instance.

1. Get the request URL and type from the reference documentation. For the Query API, this is currently *POST* `https://digitaltwins-host-name/query?api-version=2020-10-31`.
1. In Postman, set the type for the request and enter the request URL, filling in placeholders in the URL as required. Use your instance's host name from the [Prerequisites section](#prerequisites).
    
   :::image type="content" source="media/how-to-use-postman-with-digital-twins/postman-request-url.png" alt-text="Screenshot of the new request's details in Postman. The query URL from the reference documentation has been filled into the request URL box." lightbox="media/how-to-use-postman-with-digital-twins/postman-request-url.png":::
    
1. Check that the parameters shown for the request in the **Params** tab match those described in the reference documentation. For this request in Postman, the `api-version` parameter was automatically filled when the request URL was entered in the previous step. For the Query API, this is the only required parameter, so this step is done.
1. In the **Authorization** tab, set the Type to **Inherit auth from parent**. This indicates that this request will use the authorization you set up earlier for the entire collection.
1. Check that the headers shown for the request in the **Headers** tab match those described in the reference documentation. For this request, several headers have been automatically filled. For the Query API, none of the header options are required, so this step is done.
1. Check that the body shown for the request in the **Body** tab matches the needs described in the reference documentation. For the Query API, a JSON body is required to provide the query text. Here's an example body for this request that queries for all the digital twins in the instance:

   :::image type="content" source="media/how-to-use-postman-with-digital-twins/postman-request-body.png" alt-text="Screenshot of the new request's details in Postman, on the Body tab. It contains a raw JSON body with a query of 'SELECT * FROM DIGITALTWINS'." lightbox="media/how-to-use-postman-with-digital-twins/postman-request-body.png":::

   For more information about crafting Azure Digital Twins queries, see [Query the twin graph](how-to-query-graph.md).

1. Check the reference documentation for any other fields that may be required for your type of request. For the Query API, all requirements have now been met in the Postman request, so this step is done.
1. Use the **Send** button to send your completed request.
   :::image type="content" source="media/how-to-use-postman-with-digital-twins/postman-request-send.png" alt-text="Screenshot of Postman showing the details of the new request. The Send button is highlighted." lightbox="media/how-to-use-postman-with-digital-twins/postman-request-send.png":::

After sending the request, the response details will appear in the Postman window below the request. You can view the response's status code and any body text.

:::image type="content" source="media/how-to-use-postman-with-digital-twins/postman-request-response.png" alt-text="Screenshot of the sent request in Postman. Below the request details, the response is shown. Status is 200 OK and body shows query results." lightbox="media/how-to-use-postman-with-digital-twins/postman-request-response.png":::

You can also compare the response to the expected response data given in the reference documentation, to verify the result or learn more about any errors that arise.

## Next steps

To learn more about the Digital Twins APIs, read [Azure Digital Twins APIs and SDKs](concepts-apis-sdks.md), or view the [reference documentation for the REST APIs](/rest/api/azure-digitaltwins/).
