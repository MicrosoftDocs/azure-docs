---
title: Azure Custom Decision Service get started (server) | Microsoft Docs
description: How to get started with Azure Custom Decision Service if you call the APIs from a smartphone app.
services: cognitive-services
author: slivkins
manager: slivkins

ms.service: cognitive-services
ms.topic: article
ms.date: 05/03/2017
ms.author: slivkins
---

# Get started with Custom Decision Service (app version)

This article explains how to get started with some basic options. The example here is for when you want to make calls to the Azure Custom Decision Service APIs from a smartphone app.

## Register a new app on the portal

1. To use Custom Decision Service for your application, register it on the portal. On the ribbon, click **My Portal**, as highlighted in the image:

    ![Custom Decision Service home page](./media/custom-decision-service-get-started-app/home.png)

    If you are not already signed in, the portal prompts you to sign in with your [Microsoft account](https://account.microsoft.com/account). After you have signed in, the portal displays your Microsoft account in the upper-right corner of the page.

2. To register your application, click the **New App** button. In this example, you register an application in the **pooled learning mode** as described in the [overview](custom-decision-service-overview.md#pooled-learning-mode). 

3. In the dialog box, choose an identifier for your application. Custom Decision Service requires a unique ID for each application. If someone else has already taken this ID, the system asks you to pick a different ID.

    ![Custom Decision Service portal](./media/custom-decision-service-get-started-app/portal.png)

4. Specify an Action Set API. This setting is an RSS or Atom feed that communicates the available content for your application to Custom Decision Service. Enter a name for the feed, and enter the URL from which it is served. To do this step later, click the **Feeds** button and then click the **New feed** button. An example that creates an RSS feed is described later.

5. To register your application in the [application-specific learning mode](custom-decision-service-overview.md#application-specific-learning-mode), select the **Advanced** check box in the lower-left corner. Enter a [connection string](../../storage/storage-configure-connection-string.md) for the Azure storage account where your application data is logged. For more information on how to create a storage account, see [How to create, manage, or delete a storage account](../../storage/storage-create-storage-account.md).

## Use the APIs

The APIs are fairly easy to use. (See the API reference for additional options and features.) There are two API calls you make from your smartphone app to Custom Decision Service: a call to the Ranking API to obtain a ranked list of your content and a call to the Reward API to report a reward. Here we provide the sample calls in [cURL](https://en.wikipedia.org/wiki/CURL).

We start with the call to the Ranking API. Create the file `<request.json>`, which contains the action set ID. This ID is the name of the corresponding RSS or Atom feed that you entered on the portal:

```json
{"decisions":
     [{ "actionSets":[{"id":"<actionSetId>"}] }]}
```

Multiple action sets can be specified as follows:

```json
{"decisions":
    [{ "actionSets":[{"id":"<actionSetId1>"},
                     {"id":"<actionSetId2>"}] }]
```

This JSON file is then sent as part of the ranking request:

```javascript
curl -d @<request.json> -X POST https://ds.microsoft.com/<appId>/rank
```

Here `<appId>` is the name of your application that you register on the portal. You should receive an ordered set of content items, which you can render in your application. A sample return looks like this:

```json
[{  "ranking":[{"id":"actionId1"}, {"id":"actionId2"}, {"id":"actionId3"}],
   "eventId":"<opaque event string>",
   "appId":"<your app id>",
   "actionSets":[{"id":"<A1>","lastRefresh":"2017-04-29T22:34:25.3401438Z"},
                 {"id":"<A2>","lastRefresh":"2017-04-30T22:34:25.3401438Z"}]}]
```

The first part of the return contains a list of ordered actions, specified by their action IDs. For an article, the action ID is a URL. The overall request also has a unique `<eventId>`, created by the system.

At a later point, you can specify whether you observed a click on the first content item from this event, which is `<actionId1>`. In this case, you can report a reward on this `<eventId>` to Custom Decision Service via the Reward API, with another request such as:

```javascript
curl -v https://ds.microsoft.com/<appId>/reward/<eventId> -X POST
```

Finally, you need to provide the Action Set API, which returns the list of articles (actions) to be considered by Custom Decision Service. Implement this API as an RSS feed, as shown here:

```xml
<rss version="2.0">
<channel>
   <item>
      <title><![CDATA[title (possibly with url) ]]></title>
      <link>url</link>
      <pubDate>Thu, 27 Apr 2017 16:30:52 GMT</pubDate>
    </item>
   <item>
       ....
   </item>
</channel>
</rss>
```

Here each top-level `<item>` element describes an article. `<link>` is mandatory and is used as an action ID by Custom Decision Service. Specify `<date>` (in a standard RSS format) if you have more than 15 articles. The 15 most recent articles are used. `<title>` is optional and is used to create text-related features for the article.
