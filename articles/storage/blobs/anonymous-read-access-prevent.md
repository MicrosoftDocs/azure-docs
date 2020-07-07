---
title: Prevent anonymous public read access to containers and blobs
titleSuffix: Azure Storage
description: 
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 07/06/2020
ms.author: tamram
ms.reviewer: fryu
---

# Prevent anonymous public read access to containers and blobs

Anonymous public read access to containers and blobs in Azure Storage is a convenient way to share data, but may also present a security risk. It's important to enable anonymous access judiciously and to understand how to evaluate anonymous access to your data. Operational complexity, human error, or malicious attack against data that is publicly accessible can result in costly data breaches. Microsoft recommends that you enable anonymous access only when necessary for your application scenario.

By default, a storage account enables a user with appropriate permissions to configure public access to containers and blobs. You can disable this functionality at the level of the storage account, so that containers and blobs in the account cannot be configured for public access.

This article describes how to analyze anonymous requests against a storage account and how to prevent anonymous access for the entire storage account or for an individual container.

## Detect anonymous requests from client applications

When you disable public read access for a storage account, you risk rejecting requests to containers and blobs that are currently configured for public access. Disabling public access for a storage account overrides the public access settings for all containers in that storage account. When public access is disabled for the storage account, any future anonymous requests to that account will fail.

Before you disable public access for a storage account, Microsoft recommends that you enable logging and metrics for that account and analyze traffic to that account after an interval of time to determine patterns of anonymous requests.

When public access is enabled for a container, the container or blobs in the container can be accessed anonymously. The authentication type is captured as Anonymous in both Storage metrics and Storage logs. You can detect active public access cases by looking at metrics and logs.

