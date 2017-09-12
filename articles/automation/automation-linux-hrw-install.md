---
title: Azure Automation Linux Hybrid Runbook Worker | Microsoft Docs
description: This article provides information on installing an Azure Automation Hybrid Runbook Worker that allows you to run runbooks on Linux-based computers in your local datacenter or cloud environment.
services: automation
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: tysonn

ms.assetid: 
ms.service: automation
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/07/2017
ms.author: magoedte
---

# How to deploy a Linux Hybrid Runbook Worker
Runbooks in Azure Automation cannot access resources in other clouds or in your on-premises environment since they run in the Azure cloud.  The Hybrid Runbook Worker feature of Azure Automation allows you to run runbooks directly on the computer hosting the role and against resources in the environment to manage those local resources. Runbooks are stored and managed in Azure Automation and then delivered to one or more designated computers.  

This functionality is illustrated in the following image:<br>  

![Hybrid Runbook Worker Overview](media/automation-offering-get-started/automation-infradiagram-networkcomms.png)

For a technical overview of the Hybrid Runbook Worker role, see [Automation architecture overview](automation-offering-get-started.md#automation-architecture-overview). Review the following information regarding the [hardware and software requirements](automation-offering-get-started.md#hybrid-runbook-worker) and [information for preparing your network](automation-offering-get-started.md#network-planning) before you begin deploying a Hybrid Runbook Worker.  After you have successfully deployed a runbook worker, review [run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md) to learn how to configure your runbooks to automate processes in your on-premises datacenter or other cloud environment.     

## Hybrid Runbook Worker groups
Each Hybrid Runbook Worker is a member of a Hybrid Runbook Worker group that you specify when you install the agent.  A group can include a single agent, but you can install multiple agents in a group for high availability.

When you start a runbook on a Hybrid Runbook Worker, you specify the group that it runs on.  The members of the group determine which worker services the request.  You cannot specify a particular worker.

## Installing Linux Hybrid Runbook Worker
To install and configure a Hybrid Runbook Worker on your Linux computer, you follow a very straight forward process to manually install and configure the role.   It requires enabling the **Automation Hybrid Worker** solution in your OMS workspace and then running a set of commands to register the computer as a worker and add it to a new or existing group. 

Before you proceed, you will need to note the Log Analytics workspace your Automation account is linked to and also the primary key for your Automation account.  You can find both from the portal by selecting your Automation account, and selecting **Workspace** for the Workspace ID, and selecting **Keys** for the primary key.  

1.	Enable the “Automation Hybrid Worker” solution in OMS. This can be done by either:

   1. From the Solutions Gallery in the [OMS portal](https://mms.microsoft.com) enable the **Automation Hybrid Worker** solution
   2. Run the following cmdlet:

        ```powershell
         $null = Set-AzureRmOperationalInsightsIntelligencePack -ResourceGroupName  <ResourceGroupName> -WorkspaceName <WorkspaceName> -IntelligencePackName  "AzureAutomation" -Enabled $true
        ```

2.	Run the following command changing the values for parameters *-w* and *-k* on your Linux computer.
    
    ```
    sudo python /opt/microsoft/omsconfig/modules/nxOMSAutomationWorker/DSCResources/MSFT_nxOMSAutomationWorkerResource/automationworker/scripts/onboarding.py --register -w <OMSworkspaceId> -k <AutomationSharedKey> --groupname <hybridgroupname> -e <automationendpoint>
    ```
3. After the command is complete, the Hybrid Worker Groups blade in the Azure portal will show the new group and number of members or if an existing group, the number of members is incremented.  You can select the group from the list on the **Hybrid Worker Groups** blade and select the **Hybrid Workers** tile.  On the **Hybrid Workers** blade, you see each member of the group listed.  

## Next Steps

* Review [run runbooks on a Hybrid Runbook Worker](automation-hrw-run-runbooks.md) to learn how to configure your runbooks to automate processes in your on-premises datacenter or other cloud environment.
* For instructions on how to remove Hybrid Runbook Workers, see [Remove Azure Automation Hybrid Runbook Workers](automation-remove-hrw.md)