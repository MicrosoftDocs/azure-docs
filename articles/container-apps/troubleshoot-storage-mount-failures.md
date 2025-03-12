---
title: Troubleshoot storage mount failures in Azure Container Apps
description: Learn to troubleshoot storage mount failures in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 01/24/2025
ms.author: cshoe
ms.custom:
---

# Troubleshoot storage mount failures in Azure Container Apps

Azure Container Apps allow containers to interact with external storage systems, such as Azure Files, Azure Blob Storage, or Azure Managed Disks, for persisting data. These storage resources are mounted to the container's file system during container startup.

Storage mount failures occur when your app's container is unable to successfully mount or access required storage resources, such as volumes or file systems.

## Causes

- **Incorrect configuration of storage mounts**: This error occurs when the configuration settings for mounting a storage resource (such as a volume, Azure Files share, or blob) are incorrect.

- **Invalid or expired credentials**: This error occurs when the authentication credentials are invalid, expired, or misconfigured.

- **Misconfigured storage class or mount type**: If a container app is configured to use a storage class or mount type incompatible with the storage system or configuration, the mount fails.

- **Storage resource deletion or modification**: This error occurs when the storage resource (for example, an Azure Files share or disk) is deleted or modified while the container app is running.

## Diagnostics

The Container Apps diagnostics features an intelligent and interactive experience that helps you troubleshoot your app with no configuration required. Use the following steps to access Azure Container Apps diagnostics.

1. Go to your container app in the Azure portal.

1. Select **Diagnose and solve problems**.

1. Under the troubleshooting categories, select the **Availability and Performance** category tile.

1. From the left navigation, select **Storage Mount Failures** to diagnose and troubleshoot the issue.

    This report provides details on the issue, possible causes, and recommended resolutions.

    By selecting the required revision from the dropdown, you can view storage mount failure events in the last 24 hours, and the storage mount configuration per revision for your container app.

    Additionally, you can find the number of storage mount failures per revision for your container app, by selecting **Click to show**.
