---
title: How to develop with Azure Video Analyzer
description: This topic explains how to set up Azure Video Analyzer for development
ms.service: azure-video-analyzer
ms.topic: how-to
ms.date: 05/25/2021
---

# How-To: Set up Azure Video Analyzer for development
In this how-to guide, you will learn how to set up Azure Video Analyzer piece-by-piece. You will create an Azure Video Analyzer account and its accompanying resources using the Azure portal.
In addition to creating your Video Analyzer account, you will be creating managed identities, a storage account, an IoT hub.
You will also be deploying the Video Analyzer edge module.

## Prerequisite

* An active Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).  
[!INCLUDE [the video analyzer account and storage account must be in the same subscription and region](./includes/note-account-storage-same-subscription.md)]
* Create a [user-assigned managed identity for Video Analyzer](managed-identity.md)
* Create a [Video Analyzer account](create-video-analyzer-account.md)
