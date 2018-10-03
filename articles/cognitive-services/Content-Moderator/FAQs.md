---
title: Frequently Asked Questions - Content Moderator
titlesuffix: Azure Cognitive Services
description: Get answers to frequently asked questions about Content Moderator.
services: cognitive-services
author: sanjeev3
manager: cgronlun

ms.service: cognitive-services
ms.component: content-moderator
ms.topic: faq
ms.date: 11/21/2016
ms.author: sajagtap
---

# Frequently asked questions (FAQ)

#### What does my Content Moderator subscription include?
Your Content Moderator subscription includes access to the review tool and the APIs. You can decide whether you want to use one or the other, or both, depending on your business needs.

#### What are the limits/restrictions of the content that can be moderated by using the API?
When using the API, images need to have a minimum of 128 pixels and a maximum file size of 4 MB. Text can be at most 1024 characters long. There is no limit on the video duration.

#### What happens if the content passed to the text API or the image API exceeds the size limits?
The text API returns an error code that informs that the text is longer than permitted. The image API also returns an error code that informs that the image does not meet the size requirements.

#### Do you keep the images, text, or videos that are submitted for moderation?
Your content is your own and may not be retained by Microsoft without your consent. Microsoft uses industry-leading security measures to help protect your content.

#### Can I use Content Moderator to screen for illegal child exploitation images?
No. However, qualified organizations can use the [PhotoDNA Cloud Service](https://www.microsoft.com/photodna "Microsoft PhotoDNA Cloud Service") to screen for this type of content.

#### Up to how many review teams can a user join? Can the user switch between teams?
A user can join one team at a time.

#### What kind of team member roles are supported by the review tool? How are they different?
The Studio currently allows assigning Administrator and Reviewer roles. The Administrators can invite other users and have access to the configuration settings while reviewers can only review moderation results and tag or untag content.

#### What is a tag? Does the review tool support custom tags?
A tag is a one or two-letter short code that denotes a moderation flag, such as 'a' for adult, 'r' for racy and so on. Administrators can define new tags for their business as needed.

#### How many team members can I have in my review team?
You can have a maximum of five team members, including the administrator in a team.
