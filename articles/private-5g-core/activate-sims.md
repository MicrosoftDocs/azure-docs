---
title: Activate SIMs for Azure Private 5G Core Preview
description: How-to guide for activating SIMs to allow them to use your private mobile network 
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: how-to
ms.date: 01/17/2022
ms.custom: template-how-to
---

# Activate SIMs

In this how-to guide, you'll learn how to activate the SIMs you have provisioned. You must activate a SIM before it can access your private mobile network.

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md).
- Ensure you've provisioned and assigned a SIM policy to the SIMs you want to activate, as described in [Provision SIMs - Azure portal](provision-sims-azure-portal.md).
- Get the name of the private mobile network containing the SIMs you want to activate.

## Activate your chosen SIMs

1. Sign in to the Azure portal at [https://aka.ms/PMNSPortal](https://aka.ms/PMNSPortal). <!-- need to confirm link -->
1. Search for and select the Mobile Network resource representing the private mobile network for which you want to activate SIMs.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal showing the results for a search for a Mobile Network resource.":::

1. In the resource menu, select **SIMs**.
1. You are shown a list of provisioned SIMs in the private mobile network. Tick the checkbox next to the name of each SIM you want to activate.
1. Click **Activate**.
1. In the pop-up that appears, click **Activate** to confirm that you want to activate your chosen SIMs.
1. The activation process can take a few minutes. During this time, the value in the **Activation** status column for each SIM will display as **Activating**. Keep refreshing the SIM resources using the Refresh button until the **Activation** status field for all of the relevant SIMs changes to **Activated**.

## Next steps

- [Learn more about policy control](policy-control.md)