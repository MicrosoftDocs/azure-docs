---
title: Configure Postman
titleSuffix: Azure Digital Twins
description: Learn how to configure and use Postman to test the Azure Digital Twins APIs.
ms.author: baanders
author: baanders
ms.service: digital-twins
services: digital-twins
ms.topic: how-to
ms.date: 10/29/2020
---

# How to configure Postman for the Azure Digital Twins APIs

[Postman](https://www.getpostman.com/) is a REST testing tool that provides key HTTP request functionalities in a desktop and plugin-based GUI. You can use it to craft HTTP requests and submit them to the [Azure Digital Twins REST APIs](how-to-use-apis-sdks.md).

This article describes how to configure the [Postman REST client](https://www.getpostman.com/) to interact with the Azure Digital Twins APIs. Specifically, it describes:

* How to configure an Azure Active Directory (Azure AD) application to use the OAuth 2.0 implicit grant flow.
* How to use the Postman REST client to make token-bearing HTTP requests to your APIs.
* How to use Postman to make multipart POST requests to your APIs.

## Prerequisites

To proceed with using Postman to access the Azure Digital Twins APIs, you need to set up an Azure Digital Twins instance and download Postman. The rest of this section walks you through these steps.

### Set up Azure Digital Twins instance and app registration

[!INCLUDE [digital-twins-prereq-instance.md](../../includes/digital-twins-prereq-instance.md)]

[!INCLUDE [digital-twins-prereq-registration.md](../../includes/digital-twins-prereq-registration.md)]

You will also need to gather your Azure **tenant's domain name**. Visit the [Azure Active Directory](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) page in the Azure portal (you can use this link or search for *Azure Active Directory* in the [portal](https://portal.azure.com) search bar). This will open up your tenant's information.

Take note of the *Primary domain* value.

:::image type="content" source="media/how-to-configure-postman-apis/tenant-information.png" alt-text="Azure portal page of the Azure Active Directory overview page. There is a highlight around the 'Primary domain' value in the 'Tenant information' box." lightbox="media/how-to-configure-postman-apis/tenant-information.png":::

### Download Postman

Next, download the desktop version of the Postman client. Navigate to [*www.getpostman.com/apps*](https://www.getpostman.com/apps) and follow the prompts to download the app.

## Configure app registration to use the OAuth 2.0 implicit grant flow

Now that you've set up Postman, your Azure Digital Twins instance, and an app registration, you'll need to configure the app registration to work with the OAuth 2.0 implicit grant flow that Postman will use. This will allow requests from Postman to use your app registration to authorize against the Azure Digital Twins APIs.

This step happens in the [Azure portal](https://portal.azure.com).

Visit the [App registrations](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) page in the Azure portal and select the name of your **app registration** that you created in the previous section from the list.

Select *Authentication* from the registration's menu, and hit *+ Add a platform*.

:::image type="content" source="media/how-to-configure-postman-apis/authentication-pre.png" alt-text="Azure portal page of the Authentication details for an app registration. There is a highlight around an 'Add a platform' button" lightbox="media/how-to-configure-postman-apis/authentication-pre.png":::

In the *Configure platforms* page that follows, select *Web*.
Fill the configuration details as follows:
* **Redirect URIs**: Add a redirect URI of *https://www.getpostman.com/oauth2/callback*.
* **Implicit grant**: Check the box for *Access tokens*. This will allow the OAuth 2.0 implicit grant flow to be used

Hit *Configure* to finish.

:::row:::
    :::column:::
        :::image type="content" source="media/how-to-configure-postman-apis/authentication-configure-web.png" alt-text="The Configure platforms page, highlighting the info described above onscreen":::
    :::column-end:::
    :::column:::
    :::column-end:::
:::row-end:::

Now you have a web configuration configured that Postman will use. The Authentication tab in the Azure portal should reflect this. After verifying the sections below, hit *Save*.

:::image type="content" source="media/how-to-configure-postman-apis/authentication-post.png" alt-text="Azure portal page of the Authentication details for an app registration. There are highlights around a Web platform section with a redirect URI of https://www.getpostman.com/oauth2/callback, and Implicit Grant being enabled for access tokens. The Save button is also highlighted.":::

## Set up Postman

Next, set up Postman to make API requests.
These steps happens in your local Postman application, so go ahead and open the Postman application on your computer.

### Create a Postman collection

You can create a **collection** in Postman to group your requests and apply common settings to many requests at once. Although you can make requests without placing them in any collection, a collection can greatly simplify authorization if you plan to create more than one request against the Azure Digital Twins APIs. Grouping them this way allows you to configure authentication once for the entire collection, instead of repeatedly for each individual request.

To create a collection, hit the *+ New Collection* button.

:::image type="content" source="media/how-to-configure-postman-apis/postman-new-collection.png" alt-text="View of a newly-opened Postman window. The 'New Collection' button is highlighted":::

In the *CREATE A NEW COLLECTION* window that follows, provide a name and optional description for your collection.

Then, continue on to the next section to set up authorization details for the collection.

### Set up authorization for the collection

In the *CREATE A NEW COLLECTION* dialog, move to the *Authorization* tab. This is where you will use the values of your app registration to get an OAuth 2.0 token that you can use for all API requests in your collection.

:::image type="content" source="media/how-to-configure-postman-apis/postman-authorization.png" alt-text="The 'CREATE A NEW COLLECTION' Postman window, showing the 'Authorization' tab.":::

Set the *Type* to _**OAuth 2.0**_, and hit the button for *Get New Access Token*.

:::image type="content" source="media/how-to-configure-postman-apis/postman-authorization-values.png" alt-text="The 'CREATE A NEW COLLECTION' Postman window, showing the 'Authorization' tab. A Type of 'OAuth 2.0' is selected, and the 'Get New Access Token' button is highlighted.":::

In the *GET NEW ACCESS TOKEN* window that appears, fill in the following fields.
* **Token Name**: Name the token however you'd like.
* **Grant Type**: Select *Implicit*.
* **Callback URL**: Enter *https://www.getpostman.com/oauth2/callback*.
* **Auth URL**: You will craft this URL using your Azure **tenant's domain name** from the [*Prerequisites*](#prerequisites) section (which looks something like `<your-company>.onmicrosoft.com`). Enter `https://login.microsoftonline.com/<YOUR_AZURE_TENANT_DOMAIN>/oauth2/authorize?resource=0b07f429-9f4b-4714-9392-cc5e8e80c8b0`.
* **Client ID**: Enter your app registration's **Application (client) ID** from the [*Prerequisites*](#prerequisites) section.
* **Scope**: Leave blank.
* **State**: Leave blank.
* **Client Authentication**: Select *Send as Basic Auth header*.

Then, select *Request Token*.

:::image type="content" source="media/how-to-configure-postman-apis/postman-token-values.png" alt-text="The 'GET NEW ACCESS TOKEN' Postman window, showing fields populated with the values detailed above. The 'Request Token' button is highlighted.":::

This will open the *MANAGE ACCESS TOKENS* window with a token that has been generated based on the information you've provided. Select *Use Token*.
  
:::image type="content" source="media/how-to-configure-postman-apis/postman-use-token.png" alt-text="The 'MANAGE ACCESS TOKENS' Postman window, showing the details of the token that has been created. The 'Use Token' button is highlighted.":::

### Finish collection

Back on the *CREATE A NEW COLLECTION* dialog, hit *Create* to finish creating your collection.

Your new collection can now be seen from your main Postman view, under *Collections*.

:::image type="content" source="media/how-to-configure-postman-apis/postman-post-collection.png" alt-text="View of the main Postman window. The newly-created collection is highlighted in the 'Collections' tab.":::

## Make a multipart POST request

After completing the previous steps, configure Postman to make an authenticated HTTP multipart POST request:

1. Under the **Headers** tab, add an HTTP request header key **Content-Type** with value `multipart/mixed`.

   :::image type="content" source="media/how-to-configure-postman/configure-postman-content-type.png" alt-text="Specify content type multipart/mixed" lightbox="media/how-to-configure-postman/configure-postman-content-type.png":::

1. Serialize non-text data into files. JSON data would be saved as a JSON file.
1. Under the **Body** tab, select `form-data`. 
1. Add each file by assigning a **key** name, selecting `File`.
1. Then, select each file through the **Choose File** button.

   :::image type="content" source="media/how-to-configure-postman/configure-postman-form-body.png" alt-text="Postman client form body example" lightbox="media/how-to-configure-postman/configure-postman-form-body.png":::

   >[!NOTE]
   > * The Postman client does not require that multipart chunks have a manually assigned **Content-Type** or **Content-Disposition**.
   > * You do not need to specify those headers for each part.
   > * You must select `multipart/mixed` or another appropriate  **Content-Type** for the entire request.

1. Lastly, select **Send** to submit your multipart HTTP POST request. A status code of `200` or `201` indicates a successful request. The appropriate response message will appear in the client interface.

1. Validate your HTTP POST request data by calling the API endpoint: 

   ```URL
   YOUR_MANAGEMENT_API_URL/spaces/blobs?includes=description
   ```

## Next steps

- To learn about the Digital Twins APIs, and how to use them, read [*How-to: Use the Azure Digital Twins APIs and SDKs](how-to-use-apis-sdks.md).