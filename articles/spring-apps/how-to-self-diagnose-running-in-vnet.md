---
title: "How to self-diagnose Azure Spring Apps with virtual networks"
description: Learn how to self-diagnose and solve problems in Azure Spring Apps running in virtual networks.
author: KarlErickson
ms.author: karler
ms.service: spring-apps
ms.topic: how-to
ms.date: 04/28/2023
ms.custom: devx-track-java, event-tier1-build-2022
---

# Self-diagnose running Azure Spring Apps in virtual networks

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This article shows you how to use Azure Spring Apps diagnostics to diagnose and solve problems in Azure Spring Apps running in virtual networks.

Azure Spring Apps diagnostics supports interactive troubleshooting applications running in virtual networks without configuration. Azure Spring Apps diagnostics identifies problems and guides you to information that helps troubleshoot issues and resolve them.

## Navigate to the diagnostics page

Use the following steps to start diagnostics for networked applications.

1. Sign in to the Azure portal.
1. Go to your Azure Spring Apps instance.
1. Select **Diagnose and solve problems** in the navigation pane.
1. Select **Networking**.

   :::image type="content" source="media/how-to-self-diagnose-running-in-vnet/self-diagnostic-title.png" alt-text="Screenshot of the Azure portal showing the Diagnose and solve problems page with the Networking troubleshooting category highlighted." lightbox="media/how-to-self-diagnose-running-in-vnet/self-diagnostic-title.png":::

## View a diagnostic report

After you select the **Networking** category, you can view two issues related to networking specific to your virtual-network injected Azure Spring Apps instances: **DNS Resolution** and **Required Outbound Traffic**.

   :::image type="content" source="media/how-to-self-diagnose-running-in-vnet/self-diagnostic-dns-req-outbound-options.png" alt-text="Screenshot of the Azure portal showing the Network troubleshooting page for diagnose and solve problems." lightbox="media/how-to-self-diagnose-running-in-vnet/self-diagnostic-dns-req-outbound-options.png":::

Select your target issue to view the diagnostic report. A summary of diagnostics displays, such as:

* *Resource has been removed.*
* *Resource isn't deployed in your own virtual network*.

Some results contain related documentation. Different subnets display the results separately.

## DNS resolution

If you select **DNS Resolution**, results indicate whether there are DNS issues with applications. Examples of healthy applications are shown the following examples:

* *DNS issues resolved with no issues in subnet 'subnet01'*.
* *DNS issues resolved with no issues in subnet 'subnet02'*.

The following diagnostic report example indicates that the health of the application is unknown. The reporting time frame doesn't include the time when the health status was reported. Assume that the context end time is `2021-03-03T04:20:00Z`. The latest TIMESTAMP in the **DNS Resolution Table Renderings** is `2021-03-03T03:39:00Z`, the previous day. The health check log may not have been sent out because of a blocked network.

The unknown health status results contain related documentation. You can select the left angle bracket to see the drop-down display.

:::image type="content" source="media/how-to-self-diagnose-running-in-vnet/self-diagnostic-dns-unknown.png" alt-text="Screenshot of the Azure portal showing the Summary and Troubleshooting suggestions for a DNS Resolution issue in diagnose and solve problems." lightbox="media/how-to-self-diagnose-running-in-vnet/self-diagnostic-dns-unknown.png":::

If you misconfigured your Private DNS Zone record set, a critical result appears such as: `Failed to resolve the Private DNS in subnet xxx`.

In **DNS Resolution Table Renderings**, detailed message information displays from which you can check your configurations.

If your VNET uses a custom DNS server instead of the default Azure-provided DNS server, configure your DNS server to forward unresolved DNS queries to `168.63.129.16`. Azure recursive resolvers uses this IP address to resolve requests. If you don't use the Azure recursive resolvers, the Azure Spring Apps environment won't function as expected. For more information, see the [Name resolution that uses your own DNS server](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server) section of [Name resolution for resources in Azure virtual networks](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md)

## Required Outbound Traffic

If you select **Required Outbound Traffic**, results indicate whether there are outbound traffic issues with applications. The following examples are results for healthy applications:

* *Required outbound traffic resolved with no issues in subnet 'subnet01'.
* *Required outbound traffic resolved with no issues in subnet 'subnet02'.

If any subnet is blocked because of NSG or firewall rules, and if you haven't blocked the log, endpoint check failures display in the summary for the issue. The following destination endpoints fail because no rule is matched:

* `http://clr3.gigicert.com`
* `http://mscrl.microsoft.com`
* `http://crl.microsoft.com`

You can check whether you overlooked any customer responsibilities. For more information, see [Customer responsibilities for running Azure Spring Apps in a virtual network](./vnet-customer-responsibilities.md).

If there's no data displayed for **Required Outbound Traffic Table Renderings** within 30 minutes, the result is `health status unknown`.
Your network may be blocked or the log service is down.

## Next steps

* [How to self diagnose Azure Spring Apps](./how-to-self-diagnose-solve.md)
