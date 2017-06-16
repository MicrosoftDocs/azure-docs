---
title: Azure Custom Decision Service get started (app) | Microsoft Docs
description: How to get started with Azure Custom Decision Service if you call the APIs from a smartphone app.
services: cognitive-services
author: slivkins
manager: slivkins

ms.service: cognitive-services
ms.topic: article
ms.date: 06/02/2017
ms.author: slivkins;marcozo;alekh
---

# Get started with Custom Decision Service (app version)

This article explains how to get started with some basic options. The example here is for when you want to make calls to the Azure Custom Decision Service APIs from a smartphone app. 

Register your application, as explained [here](custom-decision-service-get-started-register.md).

The APIs are fairly easy to use. (See the [API reference](custom-decision-service-api-reference.md) for additional options and features.) There are two API calls you make from your smartphone app to Custom Decision Service: a call to the Ranking API to obtain a ranked list of your content and a call to the Reward API to report a reward. Here we provide the sample calls in [cURL](https://en.wikipedia.org/wiki/CURL).

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
curl -d @<request.json> -X POST https://ds.microsoft.com/api/v2/<appId>/rank
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
curl -v https://ds.microsoft.com/api/v2/<appId>/reward/<eventId> -X POST
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

### Next steps

* Work through a [tutorial](custom-decision-service-tutorial.md) for a more in-depth example.
* Consult the [API reference](custom-decision-service-api-reference.md) to learn more about the provided functionality.