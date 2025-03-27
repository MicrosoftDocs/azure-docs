---
title: Troubleshoot container create failures in Azure Container Apps
description: Learn to troubleshoot container create failures in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 01/24/2025
ms.author: cshoe
ms.custom:
---

# Troubleshoot container create failures in Azure Container Apps

Container exit events indicate that a container is stopped or exited. These exit events can significantly impact the availability, stability, and performance of your container app. The underlying issues that trigger these events can potentially lead to downtime or degraded service. Each event is recorded to provide insights into the container's lifecycle, helping you diagnose issues related to the container's execution.

When a container exits, it could exit with a nonzero exit code (indicating failure) or a zero exit code (indicating a normal exit). Azure logs each exit event to give you visibility into what happened during the container's run.

## Causes

The following list details different reasons your application can experience container exit events:

- **Application crash or exception**: If the application inside the container encounters an error or exception that it can't recover from, the error can cause the container to exit. Application errors are among the most common reasons for container exit events.

- **Out of memory (OOM) errors**: If the container consumes more memory than the allocated limit, the system might kill the container due to out-of-memory (OOM) errors.

- **Incorrect exit code or misconfiguration in the container**: The container might exit intentionally (but improperly) if the application inside the container exits with a nonzero exit code, indicating an abnormal termination. Additionally, misconfigurations in the container can lead to immediate container shutdown. Misconfigurations that affect the app include missing environment variables, incorrect startup command, or invalid container entry point.  

- **Application termination (normal exit)**: A container might exit normally as the application inside completes its task, for example a batch job or a one-off process. This exit condition is expected behavior when the container is configured for short-lived tasks or single-use jobs.

## Diagnostics

The Container Apps diagnostics features an intelligent and interactive experience that helps you troubleshoot your app with no configuration required. Use the following steps to access Azure Container Apps diagnostics.

1. Go to your container app in the Azure portal.

1. Select **Diagnose and solve problems**.

1. Under the troubleshooting categories, select the **Availability and Performance** category tile.

1. Select **Container Exit Events** to diagnose and troubleshoot the issue.

    This report provides details on the issue, possible causes, and recommended resolutions.

    To view the container exit events per revision in the last 24 hours, select the required revision from the dropdown. You can also look at the exit code the container app reported as it terminated.  

    To see the number of container exit events per revision, select **Click to show**.  
