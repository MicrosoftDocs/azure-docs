---
title: Configure Content Moderator's Review Tool Settings | Microsoft Docs
description: Configure or get your team, tags, connectors, workflows, and credentials.
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 06/25/2017
ms.author: sajagtap
---

# About Review Tool settings #

Using the Settings tab on the Review Tool Dashboard, it is easy to define and change many components.

![Content Moderator Review Settings](images/settings-1.png)

## Team and Subteams ## 

Manage your team and subteams from this tab. You can only have one team, but you can create multiple subteams  and send invitations to future members. After you have sent out invites, you can monitor them, change permissions for team members, and invite additional users. After team members have accepted your invitation, you can assign those members to different subteams. You can set team members’ roles to be either administrators or reviewers: administrators can invite other users, while reviewers cannot.

![Content Moderator Team Settings](images/settings-2-team.png)

## Tags ##

This is where you can define your custom tags  by entering the short code, name, and description for your tags. After you have created it, it is available during reviews. You can use different tags for different reviews, by turning the visibility off and on.

![Content Moderator Tags Settings](images/settings-3-tags.png)

## Connectors ##

Workflows add functionality by using connectors to communicate with the Review Tool. The Review Tool calls the Content Moderator APIs with the default workflow for moderating content. When you sign up for the Review Tool, it auto-provisions the Moderator API credentials for you.  It also supports integrating other connector APIs, as long as a connector is available. We have made a few connectors available out of the box.

The Connectors tab is where you manage connectors . You can add or delete connectors, and find your subscription key for a particular connector. Click Connect to add these to your custom workflows. 

![Content Moderator Connectors Settings](images/settings-4-connectors.png)

## Workflows ##

Manage workflows from the Workflows tab. You can test workflows by uploading a sample file. You can also define [custom workflows](workflows.md) for image and text by using the available API connectors (found on the Connectors tab). 

![Content Moderator Workflow Settings](images/settings-5-workflows.png)

## Credentials ##

This tab provides quick access to your Content Moderator subscription key, which you will need to use the APIs included with Content Moderator (Image Moderation, Text Moderation, List Management, Workflow, and Review APIs).
 
![Content Moderator Credentials](images/settings-6-credentials.png)
