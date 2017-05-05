---
title: Microsoft Azure Custom Decision Service tutorial | Microsoft Docs
description: An end-to-end tutorial for Microsoft Custom Decision Service, a cloud-based API for contextual decision-making that sharpens with experience.
services: cognitive-services
author: slivkins
manager: slivkins

ms.service: cognitive-services
ms.topic: article
ms.date: 05/04/2017
ms.author: slivkins
---

# Tutorial for Custom Decision Service

This tutorial focuses on personalizing the selection of articles on the front page of a website. We consider a typical scenario in which Custom Decision Service is applied to *multiple* lists of articles on the same front page. For concreteness, suppose we have a news website that covers only politics and sports. This website features three ranked lists of articles: `politics`, `sports` and `recent`. We assume the news website has enough traffic for the application-specific learning mode.

# Framing

First, let us explain how to fit your scenario into our framework. We create three applications, one for each list being optimized: respectively, "app-politics", "app-sports", and "app-recent". To specify the candidate articles for each application, we maintain two action sets: one for `politics` and one for `sports`. The action set for "app-recent" is obtain automatically as a union of the other two. Custom Decision Service allows action sets to be shared across applications.

# Prepare action set feeds

Custom Decision Service consumes action sets via RSS or Atom feeds provided by the customer. In our scenario, you need to provide two feeds: one for `politics` and one for `sports`. For concreteness, suppose they are served from
`http://www.domain.com/feeds/<feed-name>`. For details on the format of the feeds, see Action Set API section in the [API reference](custom-decision-service-api-reference.md).

# Registration

Sign in with your [Microsoft Account](https://account.microsoft.com/account), and click on *My Portal* menu item in the top ribbon.

![Custom Decision Service portal](./media/custom-decision-service-tutorial/portal.png)

To register a new application, click the "new application" button. Give your application a unique name and enter it in "app ID" field of the pop-up dialog. (The system may ask you to pick a different app id if this name is already in use by anothe customer.) Check "advanced" and enter the [connection string](../../storage/storage-configure-connection-string.md) for your Azure Storage account. Normally you would use the same Azure Storage account for all your applications.

![New app dialog](./media/custom-decision-service-tutorial/new-app-dialog.png)

Once all three applications are registered, you can should them listed as follows:

![List of apps](./media/custom-decision-service-tutorial/apps.png)

(You can come back to this list by clicking the "Apps" button.)

You may use the "new app" dialog to specify an action feed. Action feeds can also be specified by clicking "Feeds" button, and then "New feed".

![List of feeds](./media/custom-decision-service-tutorial/feeds.png)

Action feeds can be used by any app, regardless of whether they are specified. Once both action feeds are specified, you should see them listed as follows:

![List of apps](./media/custom-decision-service-tutorial/apps.png)

(You can come back to this list by clicking the "Apps" button.)
