---
title: Manage Azure AI Gallery data
titleSuffix: ML Studio (classic) - Azure
description: You can export and delete your in-product user data from Azure AI Gallery using the interface or AI Gallery Catalog API. This article shows you how.
services: machine-learning
ms.service: machine-learning
ms.subservice: studio
ms.topic: how-to

author: likebupt
ms.author: keli19
ms.custom:  seodec18
ms.date: 05/25/2018
ms.reviewer: jmartens, mldocs
---

# View and delete in-product user data from Azure AI Gallery

[!INCLUDE [Notebook deprecation notice](../../../includes/aml-studio-notebook-notice.md)]

You can view and delete your in-product user data from Azure AI Gallery using the interface or AI Gallery Catalog API. This article tells you how.

[!INCLUDE [GDPR-related guidance](../../../includes/gdpr-dsr-and-stp-note.md)]

[!INCLUDE [GDPR-related guidance](../../../includes/gdpr-intro-sentence.md)]

## View your data in AI Gallery with the UI

You can view items you published through the Azure AI Gallery website UI. Users can view both public and unlisted solutions, projects, experiments, and other published items:

1.    Sign in to the [Azure AI Gallery](https://gallery.azure.ai/).
2.    Click the profile picture in the top-right corner, and then the account name to load your profile page.
3.    The profile page displays all items published to the gallery, including unlisted entries.

## Use the AI Gallery Catalog API to view your data

You can programmatically view data collected through the AI Gallery Catalog API, which is accessible at https://catalog.cortanaanalytics.com/entities. To view data, you need your Author ID. To view unlisted entities through the Catalog API, you need an access token.

Catalog responses are returned in JSON format.

### Get an author ID
The author ID is based on the email address used when publishing to the Azure AI Gallery. It doesn't change:

1.    Sign in to [Azure AI Gallery](https://gallery.azure.ai/).
2.    Click the profile picture in the top-right corner, and then the account name to load your profile page.
3.    The URL in the address bar displays the alphanumeric ID following `authorId=`. For example, for the URL: 
    `https://gallery.azure.ai/Home/Author?authorId=99F1F5C6260295F1078187FA179FBE08B618CB62129976F09C6AF0923B02A5BA`
        
    Author ID: 
    `99F1F5C6260295F1078187FA179FBE08B618CB62129976F09C6AF0923B02A5BA`

### Get your access token

You need an access token to view unlisted entities through the Catalog API. Without an Access Token, users can still view public entities and other user info.

To get an access token, you need to inspect the `DataLabAccessToken` header of an HTTP request the browser makes to the Catalog API while logged in:

1.    Sign in to the [Azure AI Gallery](https://gallery.azure.ai/).
2.    Click the profile picture in the top-right corner, and then the account name to load your profile page.
3.    Open the browser Developer Tools pane by pressing F12, select the Network tab, and refresh the page. 
4. Filter requests on the string *catalog* by typing into the Filter text box.
5.    In requests to the URL `https://catalog.cortanaanalytics.com/entities`, find a GET request and select the *Headers* tab. Scroll down to the *Request Headers* section.
6.    Under the header `DataLabAccessToken` is the alphanumeric token. To help keep your data secure, don't share this token.

### View user information
Using the author ID you got in the previous steps, view information in a user's profile by replacing `[AuthorId]` in the following URL:

    https://catalog.cortanaanalytics.com/users/[AuthorID]

For example, this URL request:
    
    https://catalog.cortanaanalytics.com/users/99F1F5C6260295F1078187FA179FBE08B618CB62129976F09C6AF0923B02A5BA

Returns a response such as:

    {"entities_count":9,"contribution_score":86.351575190956922,"scored_at":"2018-05-07T14:30:25.9305671+00:00","contributed_at":"2018-05-07T14:26:55.0381756+00:00","created_at":"2017-12-15T00:49:15.6733094+00:00","updated_at":"2017-12-15T00:49:15.6733094+00:00","name":"First Last","slugs":["First-Last"],"tenant_id":"14b2744cf8d6418c87ffddc3f3127242","community_id":"9502630827244d60a1214f250e3bbca7","id":"99F1F5C6260295F1078187FA179FBE08B618CB62129976F09C6AF0923B02A5BA","_links":{"self":"https://catalog.azureml.net/tenants/14b2744cf8d6418c87ffddc3f3127242/communities/9502630827244d60a1214f250e3bbca7/users/99F1F5C6260295F1078187FA179FBE08B618CB62129976F09C6AF0923B02A5BA"},"etag":"\"2100d185-0000-0000-0000-5af063010000\""}


### View public entities

The Catalog API stores information about published entities to the Azure AI Gallery that you can also view directly on the [AI Gallery website](https://gallery.azure.ai/). 

To view published entities, visit the following URL, replacing `[AuthorId]` with the Author ID obtained in [Get an author ID](#get-an-author-id) above.

    https://catalog.cortanaanalytics.com/entities?$filter=author/id eq '[AuthorId]'

For example:

    https://catalog.cortanaanalytics.com/entities?$filter=author/id eq '99F1F5C6260295F1078187FA179FBE08B618CB62129976F09C6AF0923B02A5BA'

### View unlisted and public entities

This query displays only public entities. To view all your entities, including unlisted ones, provide the access token obtained from the previous section.

1.    Using a tool like [Postman](https://www.getpostman.com), create an HTTP GET request to the catalog URL as described in [Get your access token](#get-your-access-token).
2.    Create an HTTP request header called `DataLabAccessToken`, with the value set to the access token.
3.    Submit the HTTP request.

> [!TIP]
> If unlisted entities are not showing up in responses from the Catalog API, the user may have an invalid or expired access token. Sign out of the Azure AI Gallery, and then repeat the steps in [Get your access token](#get-your-access-token) to renew the token. 
