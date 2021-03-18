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

1. Use the [Azure CLI](/cli/azure/install-azure-cli) to get a bearer token that you will use to make API requests in Postman.
1. Set up a Postman collection and configure the Postman REST client to use your bearer token to authenticate.
1. Use the configured Postman to create and send a request to the Azure Digital Twins APIs.

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

1. Next, use the [az account get-access-token](/cli/azure/account#az_account_get_access_token) command to get a bearer token with access to the Azure Digital Twins service. In this command, you'll pass in the resource ID for the Azure Digital Twins service endpoint (a static value of `0b07f429-9f4b-4714-9392-cc5e8e80c8b0`), in order to get an access token that can access Azure Digital Twins resources.

    ```azurecli-interactive
    az account get-access-token --resource 0b07f429-9f4b-4714-9392-cc5e8e80c8b0
    ```

1. Copy the value of `accessToken` in the result, and save it to use in the next section. This is your **token value** that you will provide to Postman to authenticate your requests.

    :::image type="content" source="media/how-to-use-postman/console-access-token.png" alt-text="View of a local console window showing the result of the az account get-access-token command. One of the fields in the result is called accessToken and its sample value--beginning with ey--is highlighted.":::

>[!TIP]
>This token is valid for at least five minutes and a maximum of 60 minutes. If you run out of time allotted for the current token, you can repeat the steps in this section to get a new one.

## Set up Postman collection and authorization

Next, set up Postman to make API requests.
These steps happen in your local Postman application, so go ahead and open the Postman application on your computer.

### Create a Postman collection

Requests in Postman are saved in **collections** (groups of requests). When you create a collection to group your requests, you can apply common settings to many requests at once. This can greatly simplify authorization if you plan to create more than one request against the Azure Digital Twins APIs, as you only have to configure authentication once for the entire collection.

1. To create a collection, hit the *+ New Collection* button.

    :::image type="content" source="media/how-to-use-postman/postman-new-collection.png" alt-text="View of a newly opened Postman window. The 'New Collection' button is highlighted":::

1. In the *CREATE A NEW COLLECTION* window that follows, provide a **Name** and optional **Description** for your collection.

Next, continue on to the next section to add a bearer token to the collection for authorization.

### Add authorization token and finish collection

1. In the *CREATE A NEW COLLECTION* dialog, move to the *Authorization* tab. This is where you will place the **token value** you gathered in the [Get bearer token](#get-bearer-token) section in order to use it for all API requests in your collection.

    :::image type="content" source="media/how-to-use-postman/postman-authorization.png" alt-text="The 'CREATE A NEW COLLECTION' Postman window, showing the 'Authorization' tab.":::

1. Set the *Type* to _**OAuth 2.0**_, and paste your access token into the *Access Token* box.

    :::image type="content" source="media/how-to-use-postman/postman-paste-token.png" alt-text="The 'CREATE A NEW COLLECTION' Postman window, showing the 'Authorization' tab. A Type of 'OAuth 2.0' is selected, and Access Token box where the access token value can be pasted is highlighted.":::

1. After pasting in your bearer token, hit *Create* to finish creating your collection.

Your new collection can now be seen from your main Postman view, under *Collections*.

:::image type="content" source="media/how-to-use-postman/postman-post-collection.png" alt-text="View of the main Postman window. The newly created collection is highlighted in the 'Collections' tab.":::

## Create a request

After completing the previous steps, you can create requests to the Azure Digital Twin APIs.

1. To create a request, hit the *+ New* button.

    :::image type="content" source="media/how-to-use-postman/postman-new-request.png" alt-text="View of the main Postman window. The 'New' button is highlighted":::

1. Choose *Request*.

    :::image type="content" source="media/how-to-use-postman/postman-new-request-2.png" alt-text="View of the options you can select to create something new. The 'Request' option is highlighted":::

1. This action opens the *Save request* window, where you can enter a name for your request, give it an optional description, and choose the collection that it's a part of. Fill in the details and save the request to the collection you created earlier.

    :::row:::
        :::column:::
            :::image type="content" source="media/how-to-use-postman/postman-save-request.png" alt-text="View of the 'Save request' window where you can fill out the fields described. The 'Save to Azure Digital Twins collection' button is highlighted":::
        :::column-end:::
        :::column:::
        :::column-end:::
    :::row-end:::

You can now view your request under the collection, and select it to pull up its editable details.

:::image type="content" source="media/how-to-use-postman/postman-request-details.png" alt-text="View of the main Postman window. The Azure Digital Twins collection is expanded, and the 'Query twins' request is highlighted. Details of the request are shown in the center of the page." lightbox="media/how-to-use-postman/postman-request-details.png":::

### Set request details

To make a Postman request to one of the Azure Digital Twins APIs, you'll need the URL of the API and information about what details it requires. You can find this information in the [Azure Digital Twins REST API reference documentation](/rest/api/azure-digitaltwins/).

To proceed with an example query, this article will use the Query API (and its [reference documentation](/rest/api/digital-twins/dataplane/query/querytwins)) to query for all the digital twins in an instance.

1. Get the request URL and type from the reference documentation. For the Query API, this is currently *POST `https://digitaltwins-hostname/query?api-version=2020-10-31`*.
1. In Postman, set the type for the request and enter the request URL, filling in placeholders in the URL as required. This is where you will use your instance's **host name** from the [*Prerequisites*](#prerequisites) section.
    
   :::image type="content" source="media/how-to-use-postman/postman-request-url.png" alt-text="In the details of the new request, the query URL from the reference documentation has been filled into the request URL box." lightbox="media/how-to-use-postman/postman-request-url.png":::
    
1. Check that the parameters shown for the request in the *Params* tab match those described in the reference documentation. For this request in Postman, the `api-version` parameter was automatically filled when the request URL was entered in the previous step. For the Query API, this is the only required parameter, so this step is done.
1. In the *Authorization* tab, set the *Type* to *Inherit auth from parent*. This indicates that this request will use the authentication you set up earlier for the entire collection.
1. Check that the headers shown for the request in the *Headers* tab match those described in the reference documentation. For this request, several headers have been automatically filled. For the Query API, none of the header options are required, so this step is done.
1. Check that the body shown for the request in the *Body* tab matches the needs described in the reference documentation. For the Query API, a JSON body is required to provide the query text. Here is an example body for this request that queries for all the digital twins in the instance:

   :::image type="content" source="media/how-to-use-postman/postman-request-body.png" alt-text="In the details of the new request, the Body tab is shown. It contains a raw JSON body with a query of 'SELECT * FROM DIGITALTWINS'." lightbox="media/how-to-use-postman/postman-request-body.png":::

   For more information about crafting Azure Digital Twins queries, see [*How-to: Query the twin graph*](how-to-query-graph.md).

1. Check the reference documentation for any other fields that may be required for your type of request. For the Query API, all requirements have now been met in the Postman request, so this step is done.
1. Use the *Send* button to send your completed request.
   :::image type="content" source="media/how-to-use-postman/postman-request-send.png" alt-text="Near the details of the new request, the Send button is highlighted." lightbox="media/how-to-use-postman/postman-request-send.png":::

After sending the request, the response details will appear in the Postman window below the request. You can view the response's status code and any body text.

:::image type="content" source="media/how-to-use-postman/postman-request-response.png" alt-text="Below the details of the sent request, the details of the response are highlighted. There is a Status of 200 OK and body text describing digital twins that were returned by the query." lightbox="media/how-to-use-postman/postman-request-response.png":::

You can also compare the response to the expected response data given in the reference documentation, to verify the result or learn more about any errors that arise.

## Next steps

To learn more about the Digital Twins APIs, read [*How-to: Use the Azure Digital Twins APIs and SDKs*](how-to-use-apis-sdks.md), or view the [reference documentation for the REST APIs](/rest/api/azure-digitaltwins/).