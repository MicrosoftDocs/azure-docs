---
title: Protect your Domain Name System (DNS) with the Defender for DNS plan - Microsoft Defender for Cloud
titleSuffix: Microsoft Defender for Cloud
description: Learn how to enable the Defender for DNS plan on your Azure subscription for Microsoft Defender for Cloud.
ms.topic: install-set-up-deploy
ms.date: 06/29/2023
---

# Protect your Domain Name System (DNS) with Defender for DNS

Defender for DNS in Microsoft Defender for Cloud provides another layer of protection for resources that use [Azure-provided name resolution](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#azure-provided-name-resolution) capability.

From within Azure DNS, Defender for DNS monitors the queries from these resources and detects suspicious activities without the need for any extra agents on your resources.

## Prerequisites

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- You must [enable Microsoft Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) on your Azure subscription.

## Enable the DNS plan

**To enable Defender for DNS on your subscription**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Environment settings**.

1. Select the relevant subscription.

1. On the Defender plans page, toggle the DNS plan to **On**.

    :::image type="content" source="media/tutorial-enable-dns-plan/enable-dns.png" alt-text="Screenshot that shows where on the screen you need to select on, to turn on the  Defender for DNS plan." lightbox="media/tutorial-enable-dns-plan/enable-dns.png":::

1. Select **Save**.

## Next steps

[Respond to Microsoft Defender for DNS alerts](defender-for-dns-alerts.md).
