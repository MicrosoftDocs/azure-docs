---
title: Reducing cold-start time on Azure Container Apps
description: Learn best practices for creating rapid response times for container apps that have scaled to zero.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 03/20/2025
ms.author: cshoe
---

# Reducing cold-start time on Azure Container Apps

When your container app scales to zero during periods of inactivity, the next incoming request triggers a *cold start*. A cold-start is the time-consuming process of pulling your container image, provisioning resources, and starting your application code.

This delay impacts user experience, especially for applications that require rapid response times. Cold-starts are often most noticeable in scenarios involving large container images, complex application initialization, or ML/AI workloads.

This guide helps you mitigate cold-start times in Azure Container Apps.

## Optimize container image size

Machine learning and AI-heavy workloads are often associated with large container images. Whenever possible, reduce the size of these images as much as possible and eliminate any use of unnecessary libraries.

Often images transition training to inference usage with only minimal tweaks. Make sure to audit your containers to remove development tools and dependencies only required for model development as you prepare your container for inference use.

## Avoid far away image registries

Use container registries close to your Container Apps environment. Usually this means you want to use an Azure Container Registry deployed in the same region as your environment, or a premium registry that features global distribution.

## Use artifact streaming

Azure Container Registry [offers image streaming](/azure/container-apps/serverless-gpu-nim#enable-artifact-streaming-recommended-but-optional) which can speed up image startup by up to 15%.

## Implement custom liveness health probe or start listening early

Azure Container Apps automatically sets up a [liveness probe](health-probes.md) when ingress is enabled. Images and applications take a long time to start after the image is launched can cause issues with the container. Container Apps could kill the starting application because it fails the liveness probe.

To solve stop Container Apps from prematurely killing an image, implement a custom liveness probe to allow for longer startups. Alternatively, you can listen on the dedicated target port for simple connections earlier in the startup cycle to initialize your application after the port is open.

## Client-side accommodations

Cold-start times vary depending on your application. To reduce the perception of this time as much as possible, fine-tune your clients to accommodate the delay.

Signaling to users that a certain request could take longer and implementing retries is essential. You can also harden your code to avoid unexpected time-outs which exceed what your application can gracefully handle.

## Application-side instrumentation

For troubleshooting performance issues, implement application-side performance metrics and logging for every stage in your application lifecycle.

## Proactively wake your app

If the above recommendations don’t provide the desired performance, wake your app ahead of any actual usage. For example, consider setting up a job at 9am to wake the application ahead of employees starting their work day. This approach could eliminate lengthy cold-starts while still allowing for scale-to-zero cost-savings whenever the app isn't in use.
 