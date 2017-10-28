---
title: Azure Custom Decision Service get started (browser) | Microsoft Docs
description: How to get started with Azure Custom Decision Service to optimize a webpage, making API calls directly from a browser.
services: cognitive-services
author: slivkins
manager: slivkins

ms.service: cognitive-services
ms.topic: article
ms.date: 06/02/2017
ms.author: slivkins,marcozo,alekh
---

# Get started with Custom Decision Service (browser version)

This article explains how to get started with some basic options. The example here is for when you want to make calls to the Azure Custom Decision Service APIs directly from a browser.

Register your application, as explained [here](custom-decision-service-get-started-register.md).

The APIs are fairly easy to use. (See the [API reference](custom-decision-service-api-reference.md) for additional options and features.) Your application is modeled as having a front page, which links to several article pages. The front page uses Custom Decision Service to specify the ordering of the article pages. Insert the following code into the HTML head of the front page:

```html
// Define the "callback function" to render UI
<script> function callback(data) { … } </script>

// call Ranking API, after callback() is defined
<script src="https://ds.microsoft.com/api/v2/<appId>/rank/<actionSetId>" async></script>
```

The `data` argument contains the ranking of URLs to be rendered. For more information, see the [API reference](custom-decision-service-api-reference.md).

To handle a click on the top article, invoke the following code on the front page:

```javascript
// call Reward API to report a click
$.ajax({
    type: "POST",
    url: '//ds.microsoft.com/api/v2/<appId>/reward/' + data.eventId,,
    contentType: "application/json" })
```

Here `data` is the argument to the `callback()` function, as described previously. We provide an implementation example in the [tutorial](custom-decision-service-tutorial.md#use-the-apis).

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