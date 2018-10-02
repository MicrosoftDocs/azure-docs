---
title: Call API from an app - Custom Decision Service
titlesuffix: Azure Cognitive Services
description: How to call the Custom Decision Service APIs from a smartphone app.
services: cognitive-services
author: slivkins
manager: cgronlun

ms.service: cognitive-services
ms.component: custom-decision-service
ms.topic: conceptual
ms.date: 05/10/2018
ms.author: slivkins
---

# Call API from an app

Make calls to the Azure Custom Decision Service APIs from a smartphone app. This article explains how to get started with some basic options.

Be sure to [Register your application](custom-decision-service-get-started-register.md), first.

There are two API calls you make from your smartphone app to Custom Decision Service: a call to the Ranking API to obtain a ranked list of your content and a call to the Reward API to report a reward. Here are the sample calls in [cURL](https://en.wikipedia.org/wiki/CURL).

For more information, see the reference [API](custom-decision-service-api-reference.md).

Start with the call to the Ranking API. Create the file `<request.json>`, which has the action set ID. This ID is the name of the corresponding RSS or Atom feed that you entered on the portal:

```json
{"decisions":
     [{ "actionSets":[{"id":{"id":"<actionSetId>"}}] }]}
```

Many action sets can be specified as follows:

```json
{"decisions":
    [{ "actionSets":[{"id":{"id":"<actionSetId1>"}},
                     {"id":{"id":"<actionSetId2>"}}] }]}
```

This JSON file is then sent as part of the ranking request:

```shell
curl -d @<request.json> -X POST https://ds.microsoft.com/api/v2/<appId>/rank --header "Content-Type: application/json"
```

Here, `<appId>` is the name of your application registered on the portal. You should receive an ordered set of content items, which you can render in your application. A sample return looks like:

```json
[{ "ranking":[{"id":"actionId3"}, {"id":"actionId1"}, {"id":"actionId2"}],
   "eventId":"<opaque event string>",
   "appId":"<your app id>",
   "rewardAction":"actionId3",
   "actionSets":[{"id":"<actionSetId1>","lastRefresh":"2017-04-29T22:34:25.3401438Z"},
                 {"id":"<actionSetId2>","lastRefresh":"2017-04-30T22:34:25.3401438Z"}]}]
```

The first part of the return has a list of ordered actions, specified by their action IDs. For an article, the action ID is a URL. The overall request also has a unique `<eventId>`, created by the system.

Later, you can specify if you observed a click on the first content item from this event, which is `<actionId3>`. You can then report a reward on this `<eventId>` to Custom Decision Service via the Reward API, with another request such as:

```shell
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

Here, each top-level `<item>` element describes an article. The `<link>` is mandatory and is used as an action ID by Custom Decision Service. Specify `<date>` (in a standard RSS format) if you've more than 15 articles. The 15 most recent articles are used. The `<title>` is optional and is used to create text-related features for the article.

## Next steps

* Work through a [tutorial](custom-decision-service-tutorial-news.md) for a more in-depth example.
* Consult the reference [API](custom-decision-service-api-reference.md) to learn more about the provided functionality.