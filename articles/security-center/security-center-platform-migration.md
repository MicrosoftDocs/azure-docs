---
title: Azure Security Center Platform Migration | Microsoft Docs
description: This document explains some changes to the way Azure Security Center data is collected.
services: security-center
documentationcenter: na
author: YuriDio
manager: mbaldwin
editor: ''

ms.assetid: 80246b00-bdb8-4bbc-af54-06b7d12acf58
ms.service: security-center
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/23/2017
ms.author: yurid

---
# Azure Security Center platform migration

Beginning in early June 2017, Azure Security Center rolls out important changes to the way security data is collected and stored.  These changes unlock new capabilities like the ability to easily search security data and better aligns with other Azure management and monitoring services.

> [!NOTE]
> The platform migration should not impact your production resources, and no action is necessary from your side.


## What’s happening during this platform migration?

Previously, Security Center used the Azure Monitoring Agent to collect security data from your VMs. This includes information about security configurations, which are used to identify vulnerabilities, and security events, which are used to detect threats. This data was stored in your Storage account(s) in Azure.

Going forward, Security Center uses the Microsoft Monitoring Agent – this is the same agent used by the Operations Management Suite and Log Analytics service. Data collected from this agent is stored in either an existing *Log Analytics* [workspace](../log-analytics/log-analytics-manage-access.md) associated with your Azure subscription or a new workspace(s), taking into account the geolocation of the VM.

## Agent

As part of the transition, the Microsoft Monitoring Agent (for [Windows](../log-analytics/log-analytics-windows-agents.md) or [Linux](../log-analytics/log-analytics-linux-agents.md)) are installed on all Azure VMs from which data is currently being collected.  If the VM already has the Microsoft Monitoring Agent installed, Security Center leverages the current installed agent.

For a period of time (typically a few days), both agents will run side by side to ensure a smooth transition without any loss of data. This will enable Microsoft to validate that the new data pipeline is operational before discontinuing use of the current pipeline. Once verified, the Azure Monitoring Agent will be removed from your VMs. No work is required on your part. An email will notify you when all customers have been migrated.
 
It is not recommended that you manually uninstall the Azure Monitoring Agent during the migration as gaps in security data could result. Please consult [Microsoft Customer Service and Support](https://support.microsoft.com/contactus/) if you need further assistance. 

The Microsoft Monitoring Agent for Windows requires use TCP port 443, read [Azure Security Center Troubleshooting Guide](security-center-troubleshooting-guide.md) for more information.


> [!NOTE] 
> Because the Microsoft Monitoring Agent may be used by other Azure management and monitoring services, the agent will not be uninstalled automatically when you turn off data collection in Security Center. However, you can manually uninstall the agent if needed.

## Workspace

As described previously, data collected from the Microsoft Monitoring Agent (on behalf of Security Center) are stored in either an existing Log Analytics workspace(s) associated with your Azure subscription or a new workspace(s), taking into account the geolocation of the VM.

In the Azure portal, you can browse to see a list of your Log Analytics workspaces, including any created by Security Center. A related resource group will be created for new workspaces. Both follow this naming convention:

- Workspace: *DefaultWorkspace-[subscription-ID]-[geo]*
- Resource Group: *DefaultResouceGroup-[geo]* 
 
For workspaces created by Security Center, data is retained for 30 days. For existing workspaces, retention is based on the workspace pricing tier.

> [!NOTE]
> Data previously collected by Security Center remains in your Storage account(s). After the migration is complete, you can delete these Storage accounts.

### OMS Security Solution 

For existing customers that don’t have OMS Security solution installed, Microsoft is installing it on their workspace, but targeting only Azure VMs. Do not uninstall this solution, as there is no automatic remediation if this is done from OMS management console.


## Other updates

In conjunction with the platform migration, we are rolling out some additional minor updates:

- Additional OS versions will be supported. See the list [here](security-center-faq.md#virtual-machines).
- The list of OS vulnerabilities will be expanded. See the list [here](https://gallery.technet.microsoft.com/Azure-Security-Center-a789e335).
- [Pricing](https://azure.microsoft.com/pricing/details/security-center/) will be pro-rated hourly (previously it was daily), which will result in cost savings for some customers.
- Data Collection will be required and automatically enabled for customers on the Standard pricing tier.
- Azure Security Center will begin discovering antimalware solutions that were not deployed via Azure extensions. Discovery of Symantec Endpoint Protection and Defender for Windows 2016 will be available first.

