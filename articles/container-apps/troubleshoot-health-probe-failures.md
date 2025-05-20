---
title: Troubleshoot health probe failures in Azure Container Apps
description: Learn to troubleshoot health probe failures in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 01/24/2025
ms.author: cshoe
ms.custom:
---

# Troubleshoot health probe failures in Azure Container Apps

Health probe failures for in Azure Container Apps indicates that the container app doesn't pass the required health checks and could be considered unhealthy or unready.

Health Probes are a great way to determine application health. Specifically, health probes help work around performance issues related to timeouts during container startup, deadlocks when running the container, and serving traffic when the container is not ready to accept traffic.

## Causes

Factors related to the container configuration and environments that can lead to a health probe failures include::

- **Incorrect health probe configuration**: Configuration errors surrounding protocols, endpoint addresses, paths, ports, and response codes result in probe failures and mark the container as unhealthy.

- **Application not ready or not responding**: The application inside the container might not be ready to serve traffic when the health probe attempts its check. Delays could be due to slow initialization, long startup times, or missing dependencies. In this case, the readiness probe fails, and the container might be marked as not ready to handle traffic.

- **Unreachable health check endpoint**: If the health check endpoint (such as `/health` or `/readiness`) isn't correctly exposed, or the application isn't listening on the correct port, the health probe can't access the endpoint. In this case, the probe fails because it can't reach the endpoint.

## Diagnostics

The Container Apps diagnostics features an intelligent and interactive experience that helps you troubleshoot your app with no configuration required. Use the following steps to access Azure Container Apps diagnostics.

1. Go to your container app in the Azure portal.

1. Select **Diagnose and solve problems**.

1. Under the troubleshooting categories, select the **Availability and Performance** category tile.

1. In the left navigation of the *Availability and Performance* section, select **Health Probe Failures**.

    This report provides details on the issue, possible causes, and recommended resolutions.

    You can review health probe failure events by revision by selecting the required revision of your container app.  

    From this page you can view health probe failure events per revision by health probe type, inside a time frame, and by failure type.

    You can also review the health probe configuration per revision for your container app by selecting the required revision from the dropdown.

    To view the number of storage mount failures per revision, select **Click to show**.
