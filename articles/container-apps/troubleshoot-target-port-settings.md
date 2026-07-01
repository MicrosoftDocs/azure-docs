---
title: Troubleshoot Target Port Settings in Azure Container Apps
description: Learn to troubleshoot target port settings in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 04/01/2026
ms.author: cshoe
ms.custom:
---

# Troubleshoot target port settings in Azure Container Apps

Incorrect target port settings in a container app prevent incoming requests from reaching the correct port where the container listens for traffic. This port mismatch stops the container app from routing external traffic to the right application inside the container. Such misconfiguration can cause app downtime or delays in serving requests, reducing service availability. Additionally, if the app scales and the target port is misconfigured, new instances might not function correctly, which can negatively impact overall performance and scalability.

## Causes

- **Port not exposed in dockerfile or app configuration**: This error comes when there's a mismatch between the container configuration and the port where the application is listening. For instance:

  - If the container configurations don't expose the required port using the `EXPOSE` directive.

  - If the containerized application inside the app isn't configured to listen on the container app's expected routing or networking port.

    Then the ports are mismatched. For example, the container might be configured to listen on port `8080`, but the container app expects it to be on port `80`.

- **Multiple containers and service ports conflicts**: In a scenario where multiple containers are running in the same app, there could be conflicts between different services trying to use the same port. Ensuring that each service listens to a unique port or that the routing is configured correctly is essential.

## Diagnostics

Container Apps features an intelligent and interactive diagnostics experience that helps you troubleshoot your app with no configuration required. Use the following steps to access Container Apps diagnostics.

1. Go to your container app in the Azure portal.

1. Select **Diagnose and solve problems** in the sidebar menu.

1. Under the troubleshooting categories, select the **Availability and Performance** category tile.

1. Select **Ingress Port settings check** to diagnose and troubleshoot the issue.

    Select the required revision of your container app from the dropdown. The latest revision would be populated by default.

    :::image type="content" source="media/troubleshooting/port-mismatch.png" alt-text="Screenshot of port mismatch report.":::

    This report provides details on the issue, possible causes, and recommended resolutions.

    These errors are only raised when the container app is trying to start or scale. If the tool doesn't find any issues during a given period, try running the detector during a time when you know the container app is expected to start or scale. In the case when the app isn't receiving any traffic, try to browse the issue or trigger it.
