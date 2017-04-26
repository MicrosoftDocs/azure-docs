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

Azure security center helps you gain visibility into the configuration of Azure resources as related to security best practices. It also provides integrated security monitoring, which can detect threats that may otherwise go unnoticed. This tutorial provides a brief overview of Azure security center and describes how to use it with Azure virtual machines.   

## Security Center overview

Azure security center helps you identify potential Azure VM configuration issues and targeted threats. Some examples include identifying VMs with missing network security groups, no data encryption, or missing an anti-virus solution. This information is presented in the Azure security center dashboard in easily consumable graphs.  

The Azure security center dashboard can be accessed by clicking on **Security Center** on the left-hand navigation pane of the Azure portal. The dashboard provides high level view of resource health, security alerts, and configuration recommendations. From here you can easily asses the security health of your Azure environment, find a count of current recommendations, and asses the current state of threat alerts. Each of these high-level charts can be expanded, which provides more detail into the area of focus.

![ASC Dashboard](./media/tutorial-azure-security/asc-dash.png)

Azure security center extends beyond data discovery by providing recommendations for detected issues. For instance, if a VM has been deployed without an attached network security group, Azure security center flags this as an issue, and offer a recommendation that a network security group should be created for the VM. You are then given an option to create an attach a network security group directly from within the Azure security center.

![Recommendations](./media/tutorial-azure-security/recommendations.png)

## Configure data collection

Before you can gain visibility into VM security configurations, Azure security center data collection needs to be configured. This involves enabling data collection and creating and Azure storage account to hold the collected data. 

1. From the Azure security center dashboard click on **Security Policy** and select your subscription. 
2. Under **Data collection**, enable or disable desired policies. 
3. Click on **Choose a storage account** and create a new storage account.
4. Select **OK** when done.
5. Click **Save** on the **Security Policy** blade. 

When this action is completed, the Azure security center data collection agent installed on all virtual machines and data collection will start. VMs can be omitted from this process, which is discussed later in this document. 

## Configure virtual machine

Once data collection is enabled, nothing more needs to be configured to begin monitoring Azure VMs. As VMs are deployed, Azure security center will auto populate with data from new VMs. 

As data is collected, the resource health for each VM and related Azure resource is aggregated and presented in an easy to read chart. To view resource health, return to the Azure security center dashboard. Under **Resource security health** click on **Compute**. Finally, on the **Compute** blade, click on **Virtual machines**. This view provides a summary view of the configuration status for all VMs.

![Compute Health](./media/tutorial-azure-security/compute-health.png)

## Configure security policy

A security policy defines the security controls for which data is collected and recommendations are made.  By default, Azure resources are evaluated against all recommendations. Individual configuration can be disabled globally for all Azure resource, or disabled per resource group. This gives you’re the ability to apply different security policies to different sets of Azure resources. 

To configure an Azure security center security policy for all Azure resources:

1. From the Azure security center dashboard click on **Security Policy** and then select your subscription. 
2. Click on **Prevention policy**.
3. Enable or disable the policies that need to be applied to all Azure resources.
4. Click **OK** when done.
5. Click **Save** on the **Security Policy** blade. 

To configure a policy for a specific resource group, including disabling data collection, follow the same steps, however instead of selecting the subscription on the security policy blade, select a resource group. When configuring the policy, select **Unique** under **Inheritance**. 

## Remediate issues

Once Azure security center begins to populate with configuration data, recommendations are made against the configured security policy. For instance, if a VM has been configured without an associated network security group, a recommendation is made to create one. To see a list of all recommendations: 

1. From the Azure security center dashboard click on **Recommendations**.
3. Select a specific recommendation, this opens a blade with a list of all resources for which the recommendation applies.
4. Select a specific resource for which you would like to address.
5. Follow the on-screen instructions for remediation steps. 

In many cases, Azure security center provides actionable steps for addressing the recommendation without leaving the context of Azure security center. For instance, in the following example, an NSG was detected with an unrestricted inbound rule. From this recommendation, the **Edit inbound rule** button can be selected which provides the proper UI needed to modify the rule. 

![Recommendations](./media/tutorial-azure-security/remediation.png)

## Threat detection

![Security Alerts](./media/tutorial-azure-security/security-alerts.png)