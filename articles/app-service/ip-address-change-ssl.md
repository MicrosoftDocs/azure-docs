---
title: Prepare for TLS/SSL IP Address Change
description: Learn how to release an existing TLS/SSL IP address and assign a new one if your TLS/SSL IP address is going to be changed.

ms.topic: how-to
ms.date: 11/17/2025
ms.update-cycle: 1095-days
ms.custom: UpdateFrequency3
ms.author: msangapu
author: msangapu-msft
ms.service: azure-app-service 

# Customer intent: As a developer, I want to learn what to do if my TLS/SSL IP address is going to change so that I can ensure that my app works after the change.
 
---

# Prepare for a TLS/SSL IP address change

If you received a notification that the Transport Layer Security and Secure Sockets Layer (TLS/SSL) IP address of your Azure App Service app is changing, follow the instructions in this article to release the existing TLS/SSL IP address and assign a new one.

> [!NOTE]
> Service endpoints aren't currently supported when enabling IP based SSL on App Service TLS/SSL bindings. 

## Release TLS/SSL IP addresses and assign new ones

First, release TLS/SSL IP addresses and assign new ones:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **App Services**, then select your App Service app from the list.

1. Under **Settings** in the sidebar menu, select **Custom domains**.

1. In the **Custom domains** section, look for the domain with the **Binding type** of *IP based SSL*. Select the three ellipses for that domain and select **Update binding**.

1. In the editor that opens, choose **SNI SSL** for the TLS/SSL type and select **Update**.

1. In the **Custom domains** section, select the same host name record. In the editor that opens, this time choose **IP based SSL** for the TLS/SSL type and select **Update**. When you see the operation success message, you've acquired a new IP address.

1. If an A record (DNS record pointing directly to your IP address) is configured in your domain registration portal (non-Microsoft DNS provider or Azure DNS), replace the existing IP address with the newly generated one. You can find the new IP address by following the instructions in the next section.

## Find the new SSL IP address in the Azure portal

Next, Find the new SSL IP address in the Azure portal.

1. Wait a few minutes, then select your app in **App Services**.

1. Under **Settings** in the sidebar menu, select **Properties**, and find the section labeled **Virtual IP address**.

1. Copy the IP address and reconfigure your domain record or IP mechanism.

## Related content

- [Inbound and outbound IP addresses in Azure App Service](overview-inbound-outbound-ips.md)
