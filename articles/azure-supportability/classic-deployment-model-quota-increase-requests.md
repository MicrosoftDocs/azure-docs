---
title: Azure classic deployment model | Microsoft Docs
description: Azure classic deployment model 
author: sowmyavenkat86
ms.author: svenkat
ms.date: 06/20/2019
ms.topic: article
ms.service: azure
ms.assetid: ce37c848-ddd9-46ab-978e-6a1445728a3b

---

# Classic Deployment Model

Classic deployment model is the older generation Azure deployment mode land enforces a global vCPU quota limit for virtual machines and virtual machine scale sets. Classic deployment model is not recommended anymore and is now superseded by Resource Manager model. To learn more about these two deployment models and advantage of Resource Manager refer to Resource Manager Deployment Model page. 
When a new subscription is created, a default quota of vCPUs is assigned to it. Anytime a new VM is to be deployed using Classic deployment model, the sum of new and existing vCPUs usage across all regions must not exceed the vCPU quota approved for the Classic deployment model. 
Learn more about quotas on Azure subscription and service limits page.

You can request an increase in vCPUs limit for Classic deployment model via Help + Support blade or the Usages + Quota blade in the portal.

