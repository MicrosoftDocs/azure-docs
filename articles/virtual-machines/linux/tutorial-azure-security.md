---
title: Linux VM security with the Azure Security Center | Microsoft Docs
description: Tutorial - Linux VM security with the Azure Security Center
services: virtual-machines-linux
documentationcenter: virtual-machines
author: neilpeterson
manager: timlt
editor: tysonn
tags: azure-service-management

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 04/28/2017
ms.author: nepeters
---
# Monitor Linux VM security with the Azure Security Center

Azure Security Center helps you prevent, detect, and respond to threats with increased visibility into and control over the security of your Azure resources. It provides integrated security monitoring and policy management across your Azure subscriptions, helps detect threats that might otherwise go unnoticed, and works with a broad ecosystem of security solutions. This tutorial describes how to used Azure Security Center with Linux virtual machines.

## Security Center overview

When deploying a virtual machine in Azure, the VM is automatically configured with the security center monitoring agent. This agent collects data related to configuration and policy compliance, and stores it in Azure storage. This data is surfaced through the Azure security center which gives you an all up view into the configuration state and policy compliance of your virtual machines.  Azure security center extends beyond data discovery also allowing for auto-remediation of common issues.

Each component of Azure security center is described below.

### Dashboard

The Azure security center dashboard can be accessed by clicking on **Security Center** on the left-hand navigation pane of the Azure portal. The ASC dashboard provides high level view of resource health, security alerts, and configuration recommendations. Each of these high-level charts can be expanded, which will provide more details into the security area.

![ASC Dashboard](./media/tutorial-azure-security/asc-dash.png)

### Resource security health

Selecting **Compute** under the **Resource security health** chart open a detailed view into the current health of Azure resources. Selecting the **Virtual machines** tab filters the list to only VMs. From here you can see the current state of a VM as related to security updates, anti-virus, and encryption. Selecting an individual virtual machine will open will display the recomendations for that VM.

![Compute Health](./media/tutorial-azure-security/compute-health.png)

### Recommendations

Selecting a virtual machine from resource security health will display the recommendations for that virtual machine. To see recommendations for all Azure resources, select **Recommendations** from the Azure security center dashboard.

The recommendations feature aggregates all issues found, and provides recommended remediation steps and in some cases, provides automated remediation solutions. 
 
![Recommendations](./media/tutorial-azure-security/recommendations.png)

## Configure security policy

A security policy defines the set of controls, which are recommended for resources within the specified subscription or resource group. In Security Center, you define policies for your Azure subscriptions or resource group according to your company security needs and the type of applications or sensitivity of the data in each subscription.

![Prevention Policy](./media/tutorial-azure-security/prevention-policy.png)

## View security state
