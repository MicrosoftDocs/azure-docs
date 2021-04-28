---
title: Make requests with Postman
titleSuffix: Azure Digital Twins
description: Learn how to configure and use Postman to test the Azure Digital Twins APIs.
ms.author: baanders
author: baanders
ms.service: digital-twins
services: digital-twins
ms.topic: how-to
ms.date: 11/10/2020
---

# How to use Postman to send requests to the Azure Digital Twins APIs

[Postman](https://www.getpostman.com/) is a REST testing tool that provides key HTTP request functionalities in a desktop and plugin-based GUI. You can use it to craft HTTP requests and submit them to the [Azure Digital Twins REST APIs](how-to-use-apis-sdks.md).

This article describes how to configure the [Postman REST client](https://www.getpostman.com/) to interact with the Azure Digital Twins APIs, through the following steps:

1. Use the Azure CLI to [**get a bearer token**](#get-bearer-token) that you will use to make API requests in Postman.
1. Set up a [**Postman collection**](#about-postman-collections) and configure the Postman REST client to use your bearer token to authenticate. When setting up the collection, you can choose either of these options:
    1. [**Import**](#import-collection-of-azure-digital-twins-apis) a pre-built collection of Azure Digital Twins API requests.
    1. [**Create**](#create-your-own-collection) your own collection from scratch.
1. [**Add requests**](#add-an-individual-request) to your configured collection and send them to the Azure Digital Twins APIs.

Azure Digital Twins has two sets of APIs that you can work with: **data plane** and **control plane**. For more about the difference between these API sets, see [*How-to: Use the Azure Digital Twins APIs and SDKs*](how-to-use-apis-sdks.md). This article contains information for both API sets.

## Prerequisites

To proceed with using Postman to access the Azure Digital Twins APIs, you need to set up an Azure Digital Twins instance and download Postman. The rest of this section walks you through these steps.

### Set up Azure Digital Twins instance

[!INCLUDE [digital-twins-prereq-instance.md](../../includes/digital-twins-prereq-instance.md)]

### Download Postman

Next, download the desktop version of the Postman client. Navigate to [*www.getpostman.com/apps*](https://www.getpostman.com/apps) and follow the prompts to download the app.

## Get bearer token

Now that you've set up Postman and your Azure Digital Twins instance, you'll need to get a bearer token that Postman requests can use to authorize against the Azure Digital Twins APIs.

There are several possible ways to obtain this token. This article uses the [Azure CLI](/cli/azure/install-azure-cli) to sign into your Azure account and obtain a token that way.

If you have an Azure CLI [installed locally](/cli/azure/install-azure-cli), you can start a command prompt on your machine to run the following commands.
Otherwise, you can open an [Azure Cloud Shell](https://shell.azure.com) window in your browser and run the commands there.

1. First, make sure you're logged into Azure with the appropriate credentials, by running this command:

    ```azurecli-interactive
    az login
    ```

2. Next, use the [az account get-access-token](/cli/azure/account#az_account_get_access_token) command to get a bearer token with access to the Azure Digital Twins service. In this command, you'll pass in the resource ID for the Azure Digital Twins service endpoint, in order to get an access token that can access Azure Digital Twins resources. 

    The required context for the token depends on which set of APIs you're using, so use the tabs below to select between [data plane](how-to-use-apis-sdks.md#overview-data-plane-apis) and [control plane](how-to-use-apis-sdks.md#overview-control-plane-apis) APIs.

    # [Data plane](#tab/data-plane)
    
    To get a token to use with the **data plane** APIs, use the following static value for the token context: `0b07f429-9f4b-4714-9392-cc5e8e80c8b0`. This is the resource ID for the Azure Digital Twins service endpoint.
    
    ```azurecli-interactive
    az account get-access-token --resource 0b07f429-9f4b-4714-9392-cc5e8e80c8b0
    ```
    
    # [Control plane](#tab/control-plane)
    
    To get a token to use with the **control plane** APIs, use the following value for the token context: `https://management.azure.com/`.
    
    ```azurecli-interactive
    az account get-access-token --resource https://management.azure.com/
    ```
    ---

    >[!NOTE]
    > If you need to access your Azure Digital Twins instance using a service principal or user account that belongs to a different Azure Active Directory tenant from the instance, you'll need to request a **token** from the Azure Digital Twins instance's "home" tenant. For more information on this process, see [*How-to: Write app authentication code*](how-to-authenticate-client.md#authenticate-across-tenants).

3. Copy the value of `accessToken` in the result, and save it to use in the next section. This is your **token value** that you will provide to Postman to authorize your requests.

    :::image type="content" source="media/how-to-use-postman/console-access-token.png" alt-text="Screenshot of console showing the result of the az account get-access-token command. The accessToken field and its sample value is highlighted.":::

>[!TIP]
>This token is valid for at least five minutes and a maximum of 60 minutes. If you run out of time allotted for the current token, you can repeat the steps in this section to get a new one.

Next, you'll set up Postman to use this token to make API requests to Azure Digital Twins.

## About Postman collections

Requests in Postman are saved in **collections** (groups of requests). When you create a collection to group your requests, you can apply common settings to many requests at once. This can greatly simplify authorization if you plan to create more than one request against the Azure Digital Twins APIs, as you only have to configure these details once for the entire collection.

When working with Azure Digital Twins, you can get started by importing a [pre-built collection of all the Azure Digital Twins requests](#import-collection-of-azure-digital-twins-apis). You may want to do this if you're exploring the APIs and want to quickly set up a project with request examples.

Alternatively, you can also choose to start from scratch, by [creating your own empty collection](#create-your-own-collection) and populating it with individual requests that call only the APIs you need. 

The following sections describe both of these processes. The rest of the article takes place in your local Postman application, so go ahead and open the Postman application on your computer now.

## Import collection of Azure Digital Twins APIs

A quick way to get started with Azure Digital Twins in Postman is to import a pre-built collection of requests for the Azure Digital Twins APIs.

### Download the collection file

The first step in importing the API set is to download a collection. Choose the tab below for your choice of data plane or control plane to see the pre-built collection options.

# [Data plane](#tab/data-plane)

There are currently two Azure Digital Twins data plane collections available for you to choose from:
* [**Azure Digital Twins Postman Collection**](https://github.com/microsoft/azure-digital-twins-postman-samples): This collection provides a simple getting started experience for Azure Digital Twins in Postman. The requests include sample data, so you can run them with minimal edits required. Choose this collection if you want a digestible set of key API requests containing sample information.
    - To find the collection, navigate to the repo link and open the file named *postman_collection.json*.
* **[Azure Digital Twins data plane Swagger](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/digitaltwins/data-plane/Microsoft.DigitalTwins)**: This repo contains the complete Swagger file for the Azure Digital Twins API set, which can be downloaded and imported to Postman as a collection. This will provide a comprehensive set of every API request, but with empty data bodies rather than sample data. Choose this collection if you want to have access to every API call and fill in all the data yourself.
    - To find the collection, navigate to the repo link and choose the folder for the latest spec version. From here, open the file called *digitaltwins.json*.

# [Control plane](#tab/control-plane)

The collection currently available for control plane is the [**Azure Digital Twins control plane Swagger**](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/digitaltwins/data-plane/Microsoft.DigitalTwins). This repo contains the complete Swagger file for the Azure Digital Twins API set, which can be downloaded and imported to Postman as a collection. This will provide a comprehensive set of every API request.

To find the collection, navigate to the repo link and choose the folder for the latest spec version. From here, open the file called *digitaltwins.json*.

---

Here's how to download your chosen collection to your machine so that you can import it into Postman.
1. Use the links above to open the collection file in GitHub in your browser.
1. Select the **Raw** button to open the raw text of the file.
    :::image type="content" source="media/how-to-use-postman/swagger-raw.png" alt-text="Screenshot of the data plane digitaltwins.json file in GitHub. There is a highlight around the Raw button." lightbox="media/how-to-use-postman/swagger-raw.png":::
1. Copy the text from the window, and paste it into a new file on your machine.
1. Save the file with a *.json* extension (the file name can be whatever you want, as long as you can remember it to find the file later).

### Import the collection

Next, import the collection into Postman.

1. From the main Postman window, select the **Import** button.
    :::image type="content" source="media/how-to-use-postman/postman-import-collection.png" alt-text="Screenshot of a newly opened Postman window. The 'Import' button is highlighted." lightbox="media/how-to-use-postman/postman-import-collection.png":::

1. In the Import window that follows, select **Upload Files** and navigate to the collection file on your machine that you created earlier. Select Open.
1. Select the **Import** button to confirm.

    :::image type="content" source="media/how-to-use-postman/postman-import-collection-2.png" alt-text="Screenshot of Postman's 'Import' window, showing the file to import as a collection and the Import button.":::

The newly imported collection can now be seen from your main Postman view, in the Collections tab.

:::image type="content" source="media/how-to-use-postman/postman-post-collection-imported.png" alt-text="Screenshot of the main Postman window. The newly imported collection is highlighted in the 'Collections' tab." lightbox="media/how-to-use-postman/postman-post-collection-imported.png":::

Next, continue on to the next section to add a bearer token to the collection for authorization and connect it to your Azure Digital twins instance.

### Configure authorization

Next, edit the collection you've created to configure some access details. Highlight the collection you've created and select the **View more actions** icon to pull up a menu. Select **Edit**.

:::image type="content" source="media/how-to-use-postman/postman-edit-collection.png" alt-text="Screenshot of Postman. The 'View more actions' icon for the imported collection is highlighted, and 'Edit' is highlighted in the options." lightbox="media/how-to-use-postman/postman-edit-collection.png":::

Follow these steps to add a bearer token to the collection for authorization. This is where you'll use the **token value** you gathered in the [Get bearer token](#get-bearer-token) section in order to use it for all API requests in your collection.

1. In the edit dialog for your collection, make sure you're on the **Authorization** tab. 

    :::image type="content" source="media/how-to-use-postman/postman-authorization-imported.png" alt-text="Screenshot of the imported collection's edit dialog in Postman, showing the 'Authorization' tab." lightbox="media/how-to-use-postman/postman-authorization-imported.png":::

1. Set the Type to **OAuth 2.0**, paste your access token into the Access Token box, and select **Save**.

    :::image type="content" source="media/how-to-use-postman/postman-paste-token-imported.png" alt-text="Screenshot of Postman edit dialog for the imported collection, on the 'Authorization' tab. Type is 'OAuth 2.0', and Access Token box is highlighted." lightbox="media/how-to-use-postman/postman-paste-token-imported.png":::

### Additional configuration

# [Data plane](#tab/data-plane)

If you're making a [data plane](how-to-use-apis-sdks.md#overview-data-plane-apis) collection, help the collection connect easily to your Azure Digital Twins resources by setting some **variables** provided with the collections. When many requests in a collection require the same value (like the host name of your Azure Digital Twins instance), you can store the value in a variable that applies to every request in the collection. Both of the downloadable collections for Azure Digital Twins come with pre-created variables that you can set at the collection level.

1. Still in the edit dialog for your collection, move to the **Variables** tab.

1. Use your instance's **host name** from the [*Prerequisites*](#prerequisites) section to set the CURRENT VALUE field of the relevant variable. Select **Save**.

    :::image type="content" source="media/how-to-use-postman/postman-variables-imported.png" alt-text="Screenshot of the imported collection's edit dialog in Postman, showing the 'Variables' tab. The 'CURRENT VALUE' field is highlighted." lightbox="media/how-to-use-postman/postman-variables-imported.png":::

1. If your collection has additional variables, fill and save those values as well.

When you're finished with the above steps, you're done configuring the collection. You can close the editing tab for the collection if you want.

# [Control plane](#tab/control-plane)

If you're making a [control plane](how-to-use-apis-sdks.md#overview-control-plane-apis) collection, you've done everything that you need to configure the collection. You can close the editing tab for the collection if you want, and proceed to the next section.

--- 

### Explore requests

Next, explore the requests inside the Azure Digital Twins API collection. You can expand the collection to view the pre-created requests (sorted by category of operation). 

Different requests require different information about your instance and its data. To see all the information required to craft a particular request, look up the request details in the [Azure Digital Twins REST API reference documentation](/rest/api/azure-digitaltwins/).

You can edit the details of a request in the Postman collection using these steps:

1. Select it from the list to pull up its editable details. 

1. Fill in values for the variables listed in the **Params** tab under **Path Variables**.

    :::image type="content" source="media/how-to-use-postman/postman-request-details-imported.png" alt-text="Screenshot of Postman. The collection is expanded to show a request. The 'Path Variables' section is highlighted in the request details." lightbox="media/how-to-use-postman/postman-request-details-imported.png":::

1. Provide any necessary **Headers** or **Body** details in the respective tabs.

Once all the required details are provided, you can run the request with the **Send** button.

You can also add your own requests to the collection, using the process described in the [*Add an individual request*](#add-an-individual-request) section below.

## Create your own collection

Instead of importing the existing collection of all Azure Digital Twins APIs, you can also create your own collection from scratch. You can then populate it with individual requests using the [Azure Digital Twins REST API reference documentation](/rest/api/azure-digitaltwins/).

### Create a Postman collection

1. To create a collection, select the **New** button in the main postman window.

    :::image type="content" source="media/how-to-use-postman/postman-new.png" alt-text="Screenshot of the main Postman window. The 'New' button is highlighted." lightbox="media/how-to-use-postman/postman-new.png":::

    Choose a type of **Collection**.

    :::image type="content" source="media/how-to-use-postman/postman-new-collection-2.png" alt-text="Screenshot of the 'Create New' dialog in Postman. The 'Collection' option is highlighted.":::

1. This will open a tab for filling the details of the new collection. Select the Edit icon next to the collection's default name (**New Collection**) to replace it with your own choice of name. 

    :::image type="content" source="media/how-to-use-postman/postman-new-collection-3.png" alt-text="Screenshot of the new collection's edit dialog in Postman. The Edit icon next to the name 'New Collection' is highlighted." lightbox="media/how-to-use-postman/postman-new-collection-3.png":::

Next, continue on to the next section to add a bearer token to the collection for authorization.

### Configure authorization

Follow these steps to add a bearer token to the collection for authorization. This is where you'll use the **token value** you gathered in the [Get bearer token](#get-bearer-token) section in order to use it for all API requests in your collection.

1. Still in the edit dialog for your new collection, move to the **Authorization** tab.

    :::image type="content" source="media/how-to-use-postman/postman-authorization-custom.png" alt-text="Screenshot of the new collection's edit dialog in Postman, showing the 'Authorization' tab." lightbox="media/how-to-use-postman/postman-authorization-custom.png":::

1. Set the Type to **OAuth 2.0**, paste your access token into the Access Token box, and select **Save**.

    :::image type="content" source="media/how-to-use-postman/postman-paste-token-custom.png" alt-text="Screenshot of the Postman edit dialog for the new collection, on the 'Authorization' tab. Type is 'OAuth 2.0', and Access Token box is highlighted." lightbox="media/how-to-use-postman/postman-paste-token-custom.png":::

When you're finished with the above steps, you're done configuring the collection. You can close the edit tab for the new collection if you want.

The new collection can be seen from your main Postman view, in the Collections tab.

:::image type="content" source="media/how-to-use-postman/postman-post-collection-custom.png" alt-text="Screenshot of the main Postman window. The newly created custom collection is highlighted in the 'Collections' tab." lightbox="media/how-to-use-postman/postman-post-collection-custom.png":::

## Add an individual request

Now that your collection is set up, you can add your own requests to the Azure Digital Twin APIs.

1. To create a request, use the **New** button again.

    :::image type="content" source="media/how-to-use-postman/postman-new.png" alt-text="Screenshot of the main Postman window. The 'New' button is highlighted." lightbox="media/how-to-use-postman/postman-new.png":::

    Choose a type of **Request**.

    :::image type="content" source="media/how-to-use-postman/postman-new-request-2.png" alt-text="Screenshot of the 'Create New' dialog in Postman. The 'Request' option is highlighted.":::

1. This action opens the SAVE REQUEST window, where you can enter a name for your request, give it an optional description, and choose the collection that it's a part of. Fill in the details and save the request to the collection you created earlier.

    :::row:::
        :::column:::
            :::image type="content" source="media/how-to-use-postman/postman-save-request.png" alt-text="Screenshot of 'Save request' window in Postman showing the fields described. The 'Save to Azure Digital Twins collection' button is highlighted.":::
        :::column-end:::
        :::column:::
        :::column-end:::
    :::row-end:::

You can now view your request under the collection, and select it to pull up its editable details.

:::image type="content" source="media/how-to-use-postman/postman-request-details-custom.png" alt-text="Screenshot of Postman. The Azure Digital Twins collection is expanded to show the request's details." lightbox="media/how-to-use-postman/postman-request-details-custom.png":::

### Set request details

To make a Postman request to one of the Azure Digital Twins APIs, you'll need the URL of the API and information about what details it requires. You can find this information in the [Azure Digital Twins REST API reference documentation](/rest/api/azure-digitaltwins/).

To proceed with an example query, this article will use the Query API (and its [reference documentation](/rest/api/digital-twins/dataplane/query/querytwins)) to query for all the digital twins in an instance.

1. Get the request URL and type from the reference documentation. For the Query API, this is currently *POST `https://digitaltwins-hostname/query?api-version=2020-10-31`*.
1. In Postman, set the type for the request and enter the request URL, filling in placeholders in the URL as required. This is where you will use your instance's **host name** from the [*Prerequisites*](#prerequisites) section.
    
   :::image type="content" source="media/how-to-use-postman/postman-request-url.png" alt-text="Screenshot of the new request's details in Postman. The query URL from the reference documentation has been filled into the request URL box." lightbox="media/how-to-use-postman/postman-request-url.png":::
    
1. Check that the parameters shown for the request in the **Params** tab match those described in the reference documentation. For this request in Postman, the `api-version` parameter was automatically filled when the request URL was entered in the previous step. For the Query API, this is the only required parameter, so this step is done.
1. In the **Authorization** tab, set the Type to **Inherit auth from parent**. This indicates that this request will use the authorization you set up earlier for the entire collection.
1. Check that the headers shown for the request in the **Headers** tab match those described in the reference documentation. For this request, several headers have been automatically filled. For the Query API, none of the header options are required, so this step is done.
1. Check that the body shown for the request in the **Body** tab matches the needs described in the reference documentation. For the Query API, a JSON body is required to provide the query text. Here is an example body for this request that queries for all the digital twins in the instance:

   :::image type="content" source="media/how-to-use-postman/postman-request-body.png" alt-text="Screenshot of the new request's details in Postman, on the Body tab. It contains a raw JSON body with a query of 'SELECT * FROM DIGITALTWINS'." lightbox="media/how-to-use-postman/postman-request-body.png":::

   For more information about crafting Azure Digital Twins queries, see [*How-to: Query the twin graph*](how-to-query-graph.md).

1. Check the reference documentation for any other fields that may be required for your type of request. For the Query API, all requirements have now been met in the Postman request, so this step is done.
1. Use the **Send** button to send your completed request.
   :::image type="content" source="media/how-to-use-postman/postman-request-send.png" alt-text="Screenshot of Postman showing the details of the new request. The Send button is highlighted." lightbox="media/how-to-use-postman/postman-request-send.png":::

After sending the request, the response details will appear in the Postman window below the request. You can view the response's status code and any body text.

:::image type="content" source="media/how-to-use-postman/postman-request-response.png" alt-text="Screenshot of the sent request in Postman. Below the request details, the response is shown. Status is 200 OK and body shows query results." lightbox="media/how-to-use-postman/postman-request-response.png":::

You can also compare the response to the expected response data given in the reference documentation, to verify the result or learn more about any errors that arise.

## Next steps

To learn more about the Digital Twins APIs, read [*How-to: Use the Azure Digital Twins APIs and SDKs*](how-to-use-apis-sdks.md), or view the [reference documentation for the REST APIs](/rest/api/azure-digitaltwins/).