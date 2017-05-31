---
title: Microsoft Azure Custom Decision Service get started (server) | Microsoft Docs
description: How to get started with Microsoft Custom Decision Service, if you call our APIs from a smartphone app.
services: cognitive-services
author: slivkins
manager: slivkins

ms.service: cognitive-services
ms.topic: article
ms.date: 05/03/2017
ms.author: slivkins
---

# Getting started with Custom Decision Service (app version)

This article explains how to get started with some basic options. The example here is for when you want to make calls to the Custom Decision Service APIs from a smartphone app.

## Registering a new app on the portal

To start using Custom Decision Service for your application, the first step is to register it on our portal. Click the **My Portal** menu item in the top ribbon, highlighted in the image.

![Custom Decision Service home page](./media/custom-decision-service-get-started-app/home.png)

If you are not already signed in, the portal prompts you to sign in with your [Microsoft Account](https://account.microsoft.com/account). Once signed in, you should see the portal with your Microsoft account in the top right corner of the page.

![Custom Decision Service portal](./media/custom-decision-service-get-started-app/portal.png)

To register your application, click the **New App** button. A pop-up should open for registering a new app. Let us see how to register an application in the *pooled learning mode* that was described in the [Overview](custom-decision-service-overview.md#pooled-learning-mode). Choose an identifier for your application. Custom Decision Service expects a unique identifier for each application. If someone else has already taken this id, the system asks you to pick a different id.

Specify an Action Set API: an RSS or Atom feed that communicates the available content for your application to Custom Decision Service. Enter a name for the feed, along with the URL from which it is served. You can also do it later by clicking **Feeds** button, and then **New feed** button. An example for creating an RSS feed is described later.

If you want to register your application in the [application-specific learning mode](custom-decision-service-overview.md#application-specific-learning-mode), then click the check box *Advanced* in the bottom-left corner of the dialog. Enter a [connection string](../../storage/storage-configure-connection-string.md) for the Azure Storage account where your application data would be logged. For more information on how to create an Azure Storage account, see [here](../../storage/storage-create-storage-account.md).

## Using our APIs

The basic usage of our APIs is fairly easy (but see the API reference for additional options and features). There are two API calls you make from your smartphone app to the Custom Decision Service: a call to Ranking API to obtain a ranked list of your content, and a call to Reward API to report a reward. Here we provide the sample calls in [cURL](https://en.wikipedia.org/wiki/CURL).

We start with the call to Ranking API. Create a file `<request.json>`, which contains the "action set id": the name of the corresponding RSS/Atom feed that you entered on the portal.

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

Here `<appId>` is the name of your application that you register on our portal. You should receive an ordered set of content items, which you can render in your application. A sample return looks like:

```json
[{  "ranking":[{"id":"actionId1"}, {"id":"actionId2"}, {"id":"actionId3"}],
   "eventId":"<opaque event string>",
   "appId":"<your app id>",
   "actionSets":[{"id":"<A1>","lastRefresh":"2017-04-29T22:34:25.3401438Z"},
                 {"id":"<A2>","lastRefresh":"2017-04-30T22:34:25.3401438Z"}]}]
```

The first part of the return contains a list of ordered actions, specified by their action Ids. For an article, action id is a URL. The overall request also has a unique `<eventId>`, created by our system.

At a later point, you can specify if you observed a click on the first content item from this event, that is `<actionId1>`. In this case, you can report a reward on this `<eventId>` to the Custom Decision Service via the Reward API, with another request such as:

```javascript
curl -v https://ds.microsoft.com/<appId>/reward/<eventId> -X POST
```

Finally, you need to provide the Action Set API, which returns the list of articles (a.k.a., actions) to be considered by Custom Decision Service. Implement this API as an RSS feed, as shown here:

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

Here each top-level `<item>` element describes an article. `<link>` is mandatory, used as action id by Custom Decision Service. Specify `<date>` (in a standard RSS format) if you have more than 15 articles. The 15 most recent ones are used. `<title>` is optional, and is used in creating text-related features for the article.