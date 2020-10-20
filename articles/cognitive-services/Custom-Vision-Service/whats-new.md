---
title: What's new in Custom Vision?
titleSuffix: Azure Cognitive Services
description: This article contains news about Custom Vision.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: custom-vision
ms.topic: overview
ms.date: 06/29/2020
ms.author: pafarley
---

# What's new in Custom Vision

Learn what's new in the service. These items may be release notes, videos, blog posts, and other types of information. Bookmark this page to keep up-to-date with the service.

## July 2020

### Role-based access control

* Custom Vision supports Azure role-based access control (Azure RBAC), an authorization system for managing individual access to Azure resources. To learn how to manage access to your Custom Vision projects, see [Role-based access control](./role-based-access-control.md).

### Subset training

* When training an object detection project, you can optionally train on only a subset of your applied tags. You may want to do this if you haven't applied enough of certain tags yet, but you do have enough of others. Follow the [Client library quickstart](./quickstarts/object-detection.md) for C# or Python to learn more.

### Azure storage notifications

* You can integrate your Custom Vision project with an Azure blob storage queue to get push notifications of project training/export activity and backup copies of published models. This feature is useful to avoid continually polling the service for results when long operations are running. Instead, you can integrate the storage queue notifications into your workflow. See the [Storage integration](./storage-integration.md) guide to learn more.

### Copy and move projects

* You can now copy projects from one Custom Vision account into others. You might want to move a project from a development to production environment, or back up a project to an account in a different Azure region for increased data security. See the [Copy and move projects](./copy-move-projects.md) guide to learn more.

## September 2019

### Suggested tags

* The Smart Labeler tool on the [Custom Vision website](https://www.customvision.ai/) generates suggested tags for your training images. This lets you label a large number of images more quickly when training a Custom Vision model. For instructions on how to use this feature, see [Suggested tags](./suggested-tags.md).

## Cognitive Service updates

[Azure update announcements for Cognitive Services](https://azure.microsoft.com/updates/?product=cognitive-services)