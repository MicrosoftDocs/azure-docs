---
title: Delete a private mobile network
titlesuffix: Azure Private 5G Core Preview
description: Learn how to delete a private mobile network deployed through Azure Private 5G Core 
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: how-to
ms.date: 01/20/2022
ms.custom: template-how-to
---

# Delete a private mobile network

You can delete a private mobile network if you no longer need it. In this how-to guide, we'll learn how to delete a private mobile network through the Azure portal.

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md).
- Identify the resource group containing your private mobile network resources.

## Delete the private mobile network

1. Sign in to the Azure portal at [https://aka.ms/PMNSPortal](https://aka.ms/PMNSPortal).
1. Search for and select the resource group containing your private mobile network resources.
1. Tick the **Show hidden types** checkbox.
1. Delete the resource types in the following order. Make sure you delete all resources of a particular type before moving on to the next type.

    - **microsoft.mobilenetwork/packetcorecontrolplanes/packetcoredataplanes/attacheddatanetworks**
    - **microsoft.mobilenetwork/packetcorecontrolplanes/packetcoredataplanes**
    - **Arc for network functions – Packet Core**
    - **Mobile Network Site**
    - **SIMs**
    - **SIM policies**
    - **Services**
    - **Mobile Network**

## Next steps

- If you need to deploy a replacement mobile network, follow the instructions in [Deploy a private mobile network](how-to-guide-deploy-a-private-mobile-network-azure-portal.md)