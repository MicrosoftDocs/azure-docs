---
title: Microsoft Azure Custom Decision Service get started (browser) | Microsoft Docs
description: How to get started with Microsoft Custom Decision Service, if you prefer to call our APIs directly from the browser.
services: cognitive-services
author: slivkins
manager: slivkins@microsoft.com

ms.service: cognitive-services
ms.topic: article
ms.date: 05/02/2017
ms.author: slivkins
---

# Getting started with Custom Decision Service (browser API calls)

This article explains how to get started with some basic options. The example here is for when you want to make calls to the Custom Decision Service APIs directly from the browser.

## Registering a new app on the portal

To start using Custom Decision Service for your application, the first step is to register it on our portal. Click the *My Portal* menu item in the top ribbon, highlighted in the image.

![Custom Decision Service home page](./media/custom-decision-service-get-started-browser/home.JPG)

If you are not already signed in, the portal prompts you to sign in with your [Microsoft Account](https://account.microsoft.com/account). Once signed in, you should see the portal with your Microsoft account in the top right corner of the page.

![Custom Decision Service portal](./media/custom-decision-service-get-started-browser/portal.PNG)

To register your application, click the *New* button. A pop-up should open for registering a new app. Let us see how to register an application in the *simple mode* that was described in the [Overview](custom-decision-service-overview.md). Choose an identifier for your application. Custom Decision Service expects a unique identifier for each application. If someone else has already taken this id, the system asks you to pick a different id. You can also create a name for an action set feed, along with an RSS or Atom end point currently. This feed communicates the available content for your app to the Custom Decision Service. An example for creating the RSS feed is described later.

If you want to register your application in the *advanced mode*, then click the check box *Advanced* in the bottom-left corner of the dialog. At this point, you can specify an [Azure Storage Account Connection String](https://docs.microsoft.com/en-us/azure/storage/storage-configure-connection-string). This account will contain all the data related to your application by Custom Decision Service.

## Using our APIs

The basic usage of our APIs is fairly easy (but see API reference for additional options and features). Recall that we model your application as having a *front page*, which links to several *article pages*. The front page uses Custom Decision Service to specify the ordering of the article pages. Insert the following code into the HTML head of the front page.

```html
// Define the "callback function" to render UI
<script> function callback(data) { … } </script>

// call to Ranking API
<script src="https://ds.microsoft.com/<domain>/rank/<actionSetId>" async></script>
```

The order matters: the callback function should be defined before the call to Ranking API. The `data` argument contains the ranking of URLs to be rendered. For more information, see the tutorial and API reference.

For each article page, make sure the [canonical URL](https://en.wikipedia.org/wiki/Canonical_link_element) is set and matches the URLs provided your RSS feed, and insert the following code into the HTML head to call Reward API:

```html
<script src="https://ds.microsoft.com/DecisionService.js"></script>
<script> window.DecisionService.trackPageView(); </script>
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
