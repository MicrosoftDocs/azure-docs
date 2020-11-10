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

1. Configure an [Azure Active Directory (Azure AD)](../active-directory/fundamentals/active-directory-whatis.md) app registration to use the OAuth 2.0 implicit grant flow.
1. Set up a Postman collection and configure the Postman REST client to use the app registration for token authentication.
1. Use the configured Postman to create and send a request to the Azure Digital Twins APIs.

## Prerequisites

To proceed with using Postman to access the Azure Digital Twins APIs, you need to set up an Azure Digital Twins instance and download Postman. The rest of this section walks you through these steps.

### Set up Azure Digital Twins instance and app registration

[!INCLUDE [digital-twins-prereq-instance.md](../../includes/digital-twins-prereq-instance.md)]

[!INCLUDE [digital-twins-prereq-registration.md](../../includes/digital-twins-prereq-registration.md)]

### Download Postman

Next, download the desktop version of the Postman client. Navigate to [*www.getpostman.com/apps*](https://www.getpostman.com/apps) and follow the prompts to download the app.

## Configure app registration to use the OAuth 2.0 implicit grant flow

Now that you've set up Postman, your Azure Digital Twins instance, and an app registration, you'll need to configure the app registration to work with the OAuth 2.0 implicit grant flow that Postman will use. This will allow requests from Postman to use your app registration to authorize against the Azure Digital Twins APIs.

Start by going to the [Azure portal](https://portal.azure.com).

Visit the [App registrations](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) page in the Azure portal and select the name of your **app registration** that you created in the previous section from the list (you can use this link or look for it by name in the portal search bar).

Select *Authentication* from the registration's menu, and hit *+ Add a platform*.

:::image type="content" source="media/how-to-use-postman/authentication-pre.png" alt-text="Azure portal page of the Authentication details for an app registration. There is a highlight around an 'Add a platform' button" lightbox="media/how-to-use-postman/authentication-pre.png":::

In the *Configure platforms* page that follows, select *Web*.
Fill the configuration details as follows:
* **Redirect URIs**: Add a redirect URI of *https://www.getpostman.com/oauth2/callback*.
* **Implicit grant**: Check the box for *Access tokens*. This will allow the OAuth 2.0 implicit grant flow to be used

Hit *Configure* to finish.

:::row:::
    :::column:::
        :::image type="content" source="media/how-to-use-postman/authentication-configure-web.png" alt-text="The Configure platforms page, highlighting the info described above onscreen":::
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

Now you have a web configuration configured that Postman will use. The Authentication tab in the Azure portal should reflect this. After verifying the sections below, hit *Save*.

:::image type="content" source="media/how-to-use-postman/authentication-post.png" alt-text="Azure portal page of the Authentication details for an app registration. There are highlights around a Web platform section with a redirect URI of https://www.getpostman.com/oauth2/callback, and Implicit Grant being enabled for access tokens. The Save button is also highlighted.":::

## Set up Postman

Next, set up Postman to make API requests.
These steps happens in your local Postman application, so go ahead and open the Postman application on your computer.

### Create a Postman collection

Requests in Postman are saved in **collections** (groups of requests). When you create a collection to group your requests, you can apply common settings to many requests at once. This can greatly simplify authorization if you plan to create more than one request against the Azure Digital Twins APIs, as you only have to configure authentication once for the entire collection.

To create a collection, hit the *+ New Collection* button.

:::image type="content" source="media/how-to-use-postman/postman-new-collection.png" alt-text="View of a newly-opened Postman window. The 'New Collection' button is highlighted":::

In the *CREATE A NEW COLLECTION* window that follows, provide a name and optional description for your collection.

Then, continue on to the next section to set up authorization details for the collection.

### Set up authorization for the collection

In the *CREATE A NEW COLLECTION* dialog, move to the *Authorization* tab. This is where you will use the values of your app registration to get an OAuth 2.0 token that you can use for all API requests in your collection.

:::image type="content" source="media/how-to-use-postman/postman-authorization.png" alt-text="The 'CREATE A NEW COLLECTION' Postman window, showing the 'Authorization' tab.":::

Set the *Type* to _**OAuth 2.0**_, and hit the button for *Get New Access Token*.

:::image type="content" source="media/how-to-use-postman/postman-authorization-values.png" alt-text="The 'CREATE A NEW COLLECTION' Postman window, showing the 'Authorization' tab. A Type of 'OAuth 2.0' is selected, and the 'Get New Access Token' button is highlighted.":::

In the *GET NEW ACCESS TOKEN* window that appears, fill in the following fields.
* **Token Name**: Name the token however you'd like.
* **Grant Type**: Select *Implicit*.
* **Callback URL**: Enter *https://www.getpostman.com/oauth2/callback*.
* **Auth URL**: Enter *https://login.microsoftonline.com/common/oauth2/authorize?resource=0b07f429-9f4b-4714-9392-cc5e8e80c8b0*.
* **Client ID**: Enter your app registration's **Application (client) ID** from the [*Prerequisites*](#prerequisites) section.
* **Scope**: Leave blank.
* **State**: Leave blank.
* **Client Authentication**: Select *Send as Basic Auth header*.

Then, select *Request Token*.

:::image type="content" source="media/how-to-use-postman/postman-token-values.png" alt-text="The 'GET NEW ACCESS TOKEN' Postman window, showing fields populated with the values detailed above. The 'Request Token' button is highlighted.":::

This will open the *MANAGE ACCESS TOKENS* window with a token that has been generated based on the information you've provided. Select *Use Token*.

:::image type="content" source="media/how-to-use-postman/postman-use-token.png" alt-text="The 'MANAGE ACCESS TOKENS' Postman window, showing the details of the token that has been created. The 'Use Token' button is highlighted.":::

### Finish collection

Back on the *CREATE A NEW COLLECTION* dialog, hit *Create* to finish creating your collection.

Your new collection can now be seen from your main Postman view, under *Collections*.

:::image type="content" source="media/how-to-use-postman/postman-post-collection.png" alt-text="View of the main Postman window. The newly-created collection is highlighted in the 'Collections' tab.":::

## Create a request

After completing the previous steps, you can create requests to the Azure Digital Twin APIs.

To create a request, hit the *+ New* button.

:::image type="content" source="media/how-to-use-postman/postman-new-request.png" alt-text="View of the main Postman window. The 'New' button is highlighted":::

Choose *Request*.

:::image type="content" source="media/how-to-use-postman/postman-new-request-2.png" alt-text="View of the options you can select to create something new. The 'Request' option is highlighted":::

This opens the *Save request* window, where you can enter a name for your request, give it an optional description, and choose the collection that it's a part of. Fill in the details and save the request to the collection you created earlier.

:::image type="content" source="media/how-to-use-postman/postman-save-request.png" alt-text="View of the 'Save request' window where you can fill out the fields described. The 'Save to Azure Digital Twins collection' button is highlighted":::

You can now view your request under the collection, and select it to pull up its editable details.

:::image type="content" source="media/how-to-use-postman/postman-request-details.png" alt-text="View of the main Postman window. The Azure Digital Twins collection is expanded, and the 'Query twins' request is highlighted. Details of the request are shown in the center of the page.":::

### Set request details

To make a Postman request to one of the Azure Digital Twins APIs, you'll need the URL of the API and information about what details it requires. You can find this information in the [Azure Digital Twins REST API reference documentation](/rest/api/azure-digitaltwins/).

To proceed with an example query, this article will use the Query API (and its [reference documentation](/rest/api/digital-twins/dataplane/query/querytwins)) to query for all the digital twins in an instance.

1. Get the request URL and type from the reference documentation. For the Query API, this is *POST https://digitaltwins-name.digitaltwins.azure.net/query?api-version=2020-10-31*.
1. In Postman, set the type for the request and enter the request URL, filling in placeholders in the URL as required. This is where you will use your instance's **host name** from the [*Prerequisites*](#prerequisites) section.
    
   :::image type="content" source="media/how-to-use-postman/postman-request-url.png" alt-text="In the details of the new request, the query URL from the reference documentation has been filled into the request URL box.":::
    
1. Check that the parameters shown for the request in the *Params* tab match those described in the reference documentation. For this request in Postman, the `api-version` parameter was auto-filled when the request URL was entered in the previous step. For the Query API, this is the only required parameter, so this step is done.
1. In the *Authorization* tab, set the *Type* to *Inherit auth from parent*. This indicates that this request will use the authentication you set up earlier for the entire collection.
1. Check that the headers shown for the request in the *Headers* tab match those described in the reference documentation. For this request, several headers have been auto-filled. For the Query API, none of the header options are required, so this step is done.
1. Check that the body shown for the request in the *Body* tab match the needs described in the reference documentation. For the Query API, a JSON body is required to provide the query text. Here is an example of a body for this request that queries for all the digital twins in the instance:

   :::image type="content" source="media/how-to-use-postman/postman-request-body.png" alt-text="In the details of the new request, the Body tab is shown. It contains a raw JSON body with a query of 'SELECT * FROM DIGITALTWINS'.":::

   For more information about crafting Azure Digital Twins queries, see [*How-to: Query the twin graph*](how-to-query-graph.md).

1. Check the reference documentation for any other fields that may be required for your type of request. For the Query API, all requirements have now been met in the Postman request, so this step is done.
1. Use the *Send* button to send your completed request.
   :::image type="content" source="media/how-to-use-postman/postman-request-send.png" alt-text="Near the details of the new request, the Send button is highlighted.":::

After sending the request, the response details will appear in the Postman window below the request. You can view the response's status code and any body text.

:::image type="content" source="media/how-to-use-postman/postman-request-response.png" alt-text="Below the details of the sent request, the details of the response are highlighted. There is a Status of 200 OK and body text describing digital twins that were returned by the query.":::

You can also compare the response to the expected response data given in the request's reference documentation, to verify the result or learn more about any errors that arise.

## Next steps

To learn more about the Digital Twins APIs, read [*How-to: Use the Azure Digital Twins APIs and SDKs*](how-to-use-apis-sdks.md).

You can also view the reference documentation for the REST APIs [here](/rest/api/azure-digitaltwins/).