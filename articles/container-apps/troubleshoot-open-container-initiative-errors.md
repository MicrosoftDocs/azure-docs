---
title: Troubleshooting Open Container Initiative (OCI) errors in Azure Container Apps
description: Learn to troubleshoot aOpen Container Initiative (OCI) errors in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 01/24/2025
ms.author: cshoe
ms.custom:
---

# Troubleshoot Open Container Initiative (OCI) errors in Azure Container Apps

An Open Container Initiative (OCI) runtime error is a failure in the container runtime during the execution or creation of a container. Failures can occur at any point in the container lifecycle, such as pulling the image, creating the container, or starting the container.

A container create failure happens when the container fails to initialize, pull the image, or run properly. An OCI runtime error directly contributes to this failure as it often occurs during the container creation phase.

For example:

- The container runtime might fail to instantiate the container due to an issue with the image or environment.

- The container might fail to execute required steps required during startup (such as mounting volumes or accessing network interfaces).

## Causes

Possible causes of OCI runtime errors include:

- **Corrupt or invalid image**: If the container image is corrupt, incomplete, or incompatible with the host environment, the runtime might fail to start the container.

- **Incompatible image architecture**: If the image is built for a different architecture (for example, ARM vs. x86), the runtime might be unable to create the container.

- **Incorrect or missing configuration files**: If there are incorrect Dockerfile settings, missing environment variables or missing required configuration files, the container might cause the runtime to fail during startup.

- **Incorrect volume mounts**: The container might fail to mount volumes if the path or permission settings are incorrect, causing a runtime failure.

- **Network configuration errors**: Incorrect networking settings (such as invalid bridge networks) might result in an error.

## Diagnostics

The Container Apps diagnostics features an intelligent and interactive experience that helps you troubleshoot your app with no configuration required. Use the following steps to access Azure Container Apps diagnostics.

1. Go to your container app in the Azure portal.

1. Select **Diagnose and solve problems**.

1. Under the troubleshooting categories, select the **Availability and Performance** category tile.  

1. In the left navigation of the *Availability and Performance* category, select **Container Create Failures**. The information returned provides details on the error along with recommended actions to resolve the issue and more troubleshooting information.  

    By selecting the required revision from the dropdown, you can inspect any container create failure events per revision in the last 24 hours.

    You can also look at the number of containers create failures per revision for your container app, by selecting **Click to show**.
