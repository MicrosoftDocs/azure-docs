---
title: FAQs for Content Moderator | Microsoft Docs
description: Get answers to frequently asked questions about the Content Moderator.
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 11/21/2016
ms.author: sajagtap
---

# Frequently Asked Questions (FAQs) #

#### What does my Content Moderator subscription include? ####
Your Content Moderator subscription includes access to the review tool and the APIs. You can decide whether you want to use one or the other, or both, depending on your business needs.

#### When do I use review tool vs. the API, or both? ####
**The API:** If you have an existing implementation for reviewing and/or taking action on flagged content, just use the APIs to scan your content and process the results at your end.

**The Review tool:** If you are looking to moderate your content with human review teams, while complying with your escalation workflows and content policies, the review tool is a great new product to try out. We will be constantly adding support for new content types and adding more extensibility options.

**Both:** You either have an existing API subscription that you would like to use with the review tool, or you could be trying out the review tool with one content type (images) while using your own systems for another content type (text). In any or all combinations of these scenarios, it's completely fine to use both the review tool and the API.

#### What are the limits/restrictions of the content that can be moderated by using the API? ####
When using the API, images need to have a minimum of 128 pixels and a maximum file size of 4MB. Text can be at most 1024 characters long. There is no limit on the video other than those imposed by the Azure Media Service if any.

#### What happens if the content passed to the text API or the image API exceeds the size limits? ####
The text API will return an error code that informs that the text is longer than permitted. The image API will also return an error code that informs that the image does not meet the size requirements.

#### Do you keep the images, text, or videos that are submitted for moderation? ####
Data privacy is our top priority. Your content is your own and may not be retained by Microsoft without your consent. Microsoft uses industry-leading security measures to help protect your content.

#### Can I use Content Moderator to screen for illegal child exploitation images? ####
No. However, qualified organizations can use the [PhotoDNA Cloud Service](https://www.microsoft.com/photodna "Microsoft PhotoDNA Cloud Service") to screen for this type of content.

#### What type of content (text, images, videos) can be reviewed within the review tool? ####
As of now, images from automated image moderation results can be reviewed and collaborated upon within the review tool.

#### Up to how many review teams can a user join? Can the user switch between teams? ####
A user can join one team at a time.

#### What kind of team member roles are supported by the review tool? How are they different? ####
The Studio currently allows assigning Administrator and Reviewer roles. The Administrators can invite other users and have access to the configuration settings while reviewers can only review moderation results and tag or untag content.

#### What is a tag? Can we add our custom tags? ####
A tag is a one or two-letter short code that denotes a moderation flag, such as 'a' for adult, 'r' for racy and so on. Administrators can define new tags for their business as needed.

#### How many team members can I have in my review team? ####
You can have a maximum of five team members, including the administrator in a team.
