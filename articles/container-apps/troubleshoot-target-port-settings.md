---
title: Troubleshoot target port settings in Azure Container Apps
description: Learn to troubleshoot target port settings in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 01/24/2025
ms.author: cshoe
ms.custom:
---

# Troubleshoot target port settings in Azure Container Apps

Incorrect target port settings in a container app prevent incoming requests from reaching the correct port where the container listens for traffic. This port mismatch stops the container app from routing external traffic to the right application inside the container. Such misconfiguration can cause app downtime or delays in serving requests, reducing service availability. Additionally, if the app scales and the target port is misconfigured, new instances might not function correctly, negatively impacting overall performance and scalability.

## Causes

- **Port not exposed in dockerfile or app configuration**: This error comes when there's a mismatch between the container configuration and the port where the application is listening. For instance, if:

  - The container configurations don't expose the required port using the `EXPOSE` directive.

  - The containerized application inside the app isn't configured to listen on the container app's expected routing or networking port.

    Then the ports are mismatched. For example, the container might be configured to listen on port `8080`, but the container app is expecting it to be on port `80`.

- **Multiple containers and service ports conflicts**: In a scenario where multiple containers are running in the same app, there could be conflicts between different services trying to use the same port. Ensuring that each service listens to a unique port or that the routing is configured correctly is essential.

## Diagnostics

The Container Apps diagnostics features an intelligent and interactive experience that helps you troubleshoot your app with no configuration required. Use the following steps to access Azure Container Apps diagnostics.

1. Go to your container app in the Azure portal.

1. Select **Diagnose and solve problems**.

1. Under the troubleshooting categories, select the **Availability and Performance** category tile.

1. In the left navigation, select **Container Apps Ingress Port settings check** to diagnose and troubleshoot the issue.

    Select the required revision of your container app from the dropdown. The latest revision would be populated by default.

    :::image type="content" source="media/troubleshooting/port-mismatch.png" alt-text="Screenshot of port mismatch report.":::

    This report provides details on the issue, possible causes, and recommended resolutions.

    These errors are only raised when the container app is trying to start or scale. Therefore, if the tool doesn't find any issues during a given period, try running the detector during a time when you know the container app is expected to start or scale. In the case when the app isn't receiving any traffic, try to browse the issue or trigger it.
