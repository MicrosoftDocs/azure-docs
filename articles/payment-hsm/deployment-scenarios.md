---
title: Troubleshoot Dedicated HSM - Azure Dedicated HSM | Microsoft Docs
description: Overview of Azure Dedicated HSM provides key storage capabilities within Azure that meets FIPS 140-2 Level 3 certification
services: dedicated-hsm
author: msmbaldwin
manager: rkarlin
tags: azure-resource-manager

ms.service: key-vault
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.custom: "mvc, seodec18"
ms.date: 03/25/2021
ms.author: keithp

#Customer intent: As an IT Pro, Decision maker I am looking for key storage capability within Azure Cloud that meets FIPS 140-2 Level 3 certification and that gives me exclusive access to the hardware.

---
# Deployment scenarios

Microsoft deploys payment HSM devices in stamps within a region and multi-region to enable high availability and disaster recovery. In a region, HSMs are deployed across different stamps to prevent single rack failure, customers must provision 2 devices in a region from 2 separate stamps in order to achieve high availability. For disaster recovery, customer must provision HSM devices in an alternative region.

Thales do no provide PayShield SDK to Customers which supports HA over a cluster (a collection of HSMs initialized with same LMK). However, the customers usage scenario of the Thales PayShield devices is like a Stateless Server - thus no synchronization is required between HSMs during application runtime. Therefore, Customers handle the HA using their custom client. One way of implementing would be to load balance between healthy HSMs connected to the application. Customers are responsible to implement high availability by provisioning multi devices, load balancing them and using any kind of available backup mechanism to back up keys.

## Recommended High Availability Deployment

:::image type="content" source="./media/deployment1.png" alt-text="Output after Key Vault creation completes":::
 
For High Availability, customer must allocate HSM between stamp 1 and stamp 2 (i.e., no two HSMs from same stamp)

## Recommended Disaster Recovery Deployment
 
:::image type="content" source="./media/deployment2.png" alt-text="Output after Key Vault creation completes":::

This scenario caters to regional level failure (i.e., DR scenario), the usual strategy is to switch entirely the application stack (and its HSMs), rather than trying to reach an HSM in Region 2 from application in Region 1 due to latency. 
