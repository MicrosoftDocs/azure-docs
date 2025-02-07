---
title: Troubleshoot image pull failures in Azure Container Apps
description: Learn to troubleshoot image pull failures in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 01/24/2025
ms.author: cshoe
ms.custom:
---

# Troubleshoot image pull failures in Azure Container Apps

If Azure can't pull the container image from the specified registry, the container can't be created or executed, leading to a failure in launching the application. An image pull failure is when the Azure platform is unable to download (described as a "pull") the container image required by the application.

## Causes

The following list details possible causes for image pull failures:

- **Incorrect image name or tag**: This error occurs when the image name or tag specified in the configuration is incorrect or misspelled. These errors could include incorrect image repository names, the image tags, or the image version.

- **Authentication issues (private registry)**: If the image is stored in a private registry like Azure Container Registry or a private Docker Hub registry, you need to make sure you provide proper authentication credentials to pull the image. If these credentials are missing, incorrect, or expired, the pull operation fails.

- **Registry unavailability or network issues**: If the container registry is down or unreachable (due to network issues or misconfiguration), then the pull request doesn't complete successfully. This failure could also stem from DNS issues, firewalls, or connectivity problems between Azure Container Apps and the registry. When there are network issues, the image can't pull from the registry, causing the container creation to fail.

- **Rate limits or quota exceeded**: Many container registries, including Docker Hub, enforce rate limits on how frequently images can be pulled. If the rate limit or quota is exceeded (for example, too many image pulls in a short period), the image pull is temporarily blocked. When the pull is blocked, the container doesn't start because Azure Container Apps can't retrieve the image which blocks the deployment.

- **Image not found**: This failure could happen if the image doesn't exist, or if the wrong tag or repository is specified.

## Diagnostics

The Container Apps diagnostics features an intelligent and interactive experience that helps you troubleshoot your app with no configuration required. Use the following steps to access Azure Container Apps diagnostics.

1. Go to your container app in the Azure portal.

1. Select **Diagnose and solve problems**.

1. Under the troubleshooting categories, select the **Availability and Performance** category tile.

1. In the left navigation, select **Image Pull Failures** to diagnose and troubleshoot the issue.

    This report provides details on the issue, possible causes, and recommended resolutions.

    You can also look at the image pull failures per revision in the last 24 hours, by selecting the required revision from the dropdown.  

    To view the number of image pull failures per revision for your container app, select **Click to show**.  
