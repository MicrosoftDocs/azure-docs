---
title: Learn Review tool concepts - Content Moderator
titleSuffix: Azure Cognitive Services
description: Learn about the Content Moderator Review tool, a website that coordinates a combined AI and human review moderation effort.
services: cognitive-services
author: PatrickFarley
manager: mikemcca

ms.date: 03/15/2019
ms.service: cognitive-services
ms.subservice: content-moderator
ms.topic: conceptual
ms.author: pafarley
#Conceptual on the Review tool. Includes settings and dashboard
---

# Content Moderator Review tool

[!INCLUDE [deprecation notice](../includes/tool-deprecation.md)]

Azure Content Moderator provides services to combine machine learning content moderation with human reviews. The [Review tool](https://contentmoderator.cognitive.microsoft.com) website is a user-friendly front end that gives detailed access to these services.

## What it does

The [Review tool](https://contentmoderator.cognitive.microsoft.com), when used in conjunction with the machine-assisted moderation APIs, allows you to accomplish the following tasks in the content moderation process:

- Use one set of tools to moderate content in multiple formats (text, image, and video).
- Automate the creation of human [reviews](../review-api.md#reviews) when moderation API results come in.
- Assign or escalate content reviews to multiple review teams, organized by content category or experience level.
- Use default or custom logic filters ([workflows](../review-api.md#workflows)) to sort and track content, without writing any code.
- Use [connectors](./configure.md#connectors) to process content with Microsoft PhotoDNA, Text Analytics, and Face services in addition to the Content Moderator APIs.
- Get key performance metrics on your content moderation processes.

## Review tool dashboard

On the **Dashboard** tab, you can see key metrics for content reviews done within the tool. See the number of total, complete, and pending reviews for image, text, and video content. 

The **Pending reviews** table shows the breakdown of users and subteams that have pending or completed reviews, as well as the SLA time remaining. You can select the items in the table to go to their reviews. The search box above the table lets you filter results by team name, and the **Filter** icon lets you filter by other metrics.

Switching to the **Completed reviews** tab shows the total number of items processed or completed by users and subteams. You can filter this data the same as the pending reviews.

Clicking the text in the upper right corner of the dashboard displays the Daily Personal Metrics, which reports the number of reviews completed for each content type.

> [!div class="mx-imgBorder"]
> ![The review tool dashboard in a browser](images/0-dashboard.png)

## Review tool credentials

When you sign up with the [Review tool](https://contentmoderator.cognitive.microsoft.com), you'll be prompted to select an Azure region for you account. This is because the [Review tool](https://contentmoderator.cognitive.microsoft.com) generates a free trial key for Azure Content Moderator services. You'll need this key to access any of the services from a REST call or client SDK. You can view your key and API endpoint URL by selecting **Admin** > **Credentials**.

> [!div class="mx-imgBorder"]
> ![Content Moderator Credentials](images/settings-6-credentials.png)

## Next steps

See [Configure the Review tool](./configure.md) to learn how to access Review tool resources and change settings.