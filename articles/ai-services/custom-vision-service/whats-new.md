---
title: What's new in Custom Vision?
titleSuffix: Azure AI services
description: This article contains news about Custom Vision.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-custom-vision
ms.topic: whats-new
ms.date: 09/27/2021
ms.author: pafarley
---

# What's new in Custom Vision

Learn what's new in the service. These items may be release notes, videos, blog posts, and other types of information. Bookmark this page to keep up to date with the service.

## May 2022

### Estimated Minimum Budget
- In Custom Vision Portal, users are now able to view the minimum estimated budget needed to train their project. This estimate (shown in hours) is calculated based on volume of images uploaded by user and domain selected by user.

## October 2020 

### Custom base model

- Some applications have a large amount of joint training data but need to fine-tune their models separately; this results in better performance for images from different sources with minor differences. In this case, you can train the first model as usual with a large volume of training data. Then call **TrainProject** in the 3.4 public preview API with _CustomBaseModelInfo_ in the request body to use the first stage trained model as the base model for downstream projects. If the source project and the downstream target project have similar images characteristics, you can expect better performance. 

### New domain information

- The domain information returned from **GetDomains** in the Custom Vision 3.4 public preview API now includes supported exportable platforms, a brief description of model architecture, and the size of the model for compact domains.

### Training divergence feedback

- The Custom Vision 3.4 public preview API now returns **TrainingErrorDetails** from the **GetIteration** call. On failed iterations, this reveals whether the failure was caused by training divergence, which can be remedied with more and higher-quality training data.

## July 2020

### Azure role-based access control

* Custom Vision supports Azure role-based access control (Azure RBAC), an authorization system for managing individual access to Azure resources. To learn how to manage access to your Custom Vision projects, see [Azure role-based access control](./role-based-access-control.md).

### Subset training

* When training an object detection project, you can optionally train on only a subset of your applied tags. You may want to do this if you haven't applied enough of certain tags yet, but you do have enough of others. Follow the [Client library quickstart](./quickstarts/object-detection.md) for C# or Python to learn more.

### Azure storage notifications

* You can integrate your Custom Vision project with an Azure blob storage queue to get push notifications of project training/export activity and backup copies of published models. This feature is useful to avoid continually polling the service for results when long operations are running. Instead, you can integrate the storage queue notifications into your workflow. See the [Storage integration](./storage-integration.md) guide to learn more.

### Copy and move projects

* You can now copy projects from one Custom Vision account into others. You might want to move a project from a development to production environment, or back up a project to an account in a different Azure region for increased data security. See the [Copy and move projects](./copy-move-projects.md) guide to learn more.

## September 2019

### Suggested tags

* The Smart Labeler tool on the [Custom Vision website](https://www.customvision.ai/) generates suggested tags for your training images. This lets you label a large number of images more quickly when training a Custom Vision model. For instructions on how to use this feature, see [Suggested tags](./suggested-tags.md).

## Azure AI services updates

[Azure update announcements for Azure AI services](https://azure.microsoft.com/updates/?product=cognitive-services)
