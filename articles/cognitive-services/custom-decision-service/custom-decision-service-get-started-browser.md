---
title: Microsoft Azure Custom Decision Service get started (browser) | Microsoft Docs
description: How to get started with Microsoft Custom Decision Service to optimize a webpage, making API calls directly from a browser.
services: cognitive-services
author: slivkins
manager: slivkins

ms.service: cognitive-services
ms.topic: article
ms.date: 05/03/2017
ms.author: slivkins
---

# Getting started with Custom Decision Service (browser version)

This article explains how to get started with some basic options. The example here is for when you want to make calls to the Custom Decision Service APIs directly from the browser.

## Registering a new app on the portal

To start using Custom Decision Service for your application, the first step is to register it on our portal. Click the **My Portal** menu item in the top ribbon, highlighted in the image.

![Custom Decision Service home page](./media/custom-decision-service-get-started-browser/home.png)

If you are not already signed in, the portal prompts you to sign in with your [Microsoft Account](https://account.microsoft.com/account). Once signed in, you should see the portal with your Microsoft account in the top right corner of the page.

![Custom Decision Service portal](./media/custom-decision-service-get-started-browser/portal.png)

To register your application, click the **New App** button. A pop-up should open for registering a new app. Let us see how to register an application in the *pooled learning mode* that was described in the [Overview](custom-decision-service-overview.md#pooled-learning-mode). Choose an identifier for your application. Custom Decision Service expects a unique identifier for each application. If someone else has already taken this id, the system asks you to pick a different id.

Specify an Action Set API: an RSS or Atom feed that communicates the available content for your application to Custom Decision Service. Enter a name for the feed, along with the URL from which it is served. You can also do it later by clicking **Feeds** button, and then **New Feed** button. An example for creating an RSS feed is described later.

If you want to register your application in the [application-specific learning mode](custom-decision-service-overview.md#application-specific-learning-mode), then click the check box *Advanced* in the bottom-left corner of the dialog. Enter a [connection string](../../storage/storage-configure-connection-string.md) for the Azure Storage account where your application data would be logged. For more information on how to create an Azure Storage account, see [here](../../storage/storage-create-storage-account.md).

## Using our APIs

The basic usage of our APIs is fairly easy (but see API reference for additional options and features). Recall that we model your application as having a *front page*, which links to several *article pages*. The front page uses Custom Decision Service to specify the ordering of the article pages. Insert the following code into the HTML head of the front page.

```html
// Define the "callback function" to render UI
<script> function callback(data) { … } </script>

// call Ranking API, after callback() is defined
<script src="https://ds.microsoft.com/<appId>/rank/<actionSetId>" async></script>
```

The `data` argument contains the ranking of URLs to be rendered. For more information, see the [API reference](custom-decision-service-api-reference.md).

Invoke the following code on the front page when handling a click on the top article:

```javascript
// call Reward API to report a click
$.ajax({
    type: "POST",
    url: '//ds.microsoft.com/<appId>/reward/' + data.eventId,,
    contentType: "application/json" })
```

Here `data` is the argument to the `callback()` function, as described previously. We provide an implementation example in the [tutorial](custom-decision-service-tutorial.md#our-apis).

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
