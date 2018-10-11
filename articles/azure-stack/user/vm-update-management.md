---
title: VM update and management with Azure Stack | Microsoft Docs
description: Learn how to use the Update Management, Change Tracking, and Inventory solutions in Azure Automation to manage Windows VMs that are deployed in Azure Stack. 
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/12/2018
ms.author: jeffgilb
ms.reviewer: rtiberiu
---

# Azure Stack VM update and management
You can use the following Azure Automation solutions to manage Windows VMs that are deployed to Azure Stack:

- **[Update Management](https://docs.microsoft.com/azure/automation/automation-update-management)**. With the Update Management solution, you can quickly assess the status of available updates on all agent computers and manage the process of installing required updates for these Windows VMs.

- **[Change Tracking](https://docs.microsoft.com/azure/automation/automation-change-tracking)**. Changes to installed software, Windows services, Windows registry, and files on the monitored servers are sent to the Log Analytics service in the cloud for processing. Logic is applied to the received data and the cloud service records the data. By using the information on the Change Tracking dashboard, you can easily see the changes that were made in your server infrastructure.

- **[Inventory](https://docs.microsoft.com/azure/automation/automation-vm-inventory)**. The Inventory tracking for an Azure Stack Windows virtual machine provides a browser-based user interface for setting up and configuring inventory collection. 

These solutions are the same as the ones used to manage Azure VMs. Both Azure and Azure Stack Windows VMs are managed in the same way, from the same interface, using the same tools.

## Prerequisites
Several prerequisites must be met before using these solutions to update and manage Azure Stack Windows VMs. These include steps that must be taken in the Azure portal as well as the Azure Stack administration portal.

### In the Azure portal
To configure the Update Management, Change Tracking, and Inventory solutions for Azure Stack Windows VMs, you first need to enable these solutions in Azure.

> [!NOTE]
> If you already have these solutions enabled for Azure VMs, you can directly use the LogAnalytics WorkspaceID and Key, and go to the Azure Stack Administration Portal section.

The first step in enabling these solutions is to [create a LogAnalytics Workspace](https://docs.microsoft.com/azure/log-analytics/log-analytics-quick-create-workspace) in your Azure subscription. After you have created a workspace, note the WorkspaceID and Key. To view this information, go to the workspace blade, click on **Advanced settings**, and review the **Workspace ID** and **Primary Key** values.

Next, you must [create an Automation Account](https://docs.microsoft.com/azure/automation/automation-create-standalone-account). Once the automation account is created, you need to enable the Update Management, Change Tracking, and Inventory solutions. To do this, in the Azure portal go to the Automation Account and, under the **Update Management**, enable the solutions using the LogAnalytics workspace and the Automation Account.

  ![The Update Management solution, after it was enabled](media/vm-update-management/1.PNG) 

### In the Azure Stack Administration Portal
After enabling the Azure Automation solutions in the Azure portal, you next need to sign in to the Azure Stack administration portal as a cloud administrator and download the **Azure Update and Configuration Management** extension Azure Stack marketplace item. 

  ![Azure update and configuration management extension marketplace item](media/vm-update-management/2.PNG) 

## Enable Update Management for Azure Stack virtual machines
Follow these steps to enable update management for Azure Stack Windows VMs.

1. Log into the Azure Stack user portal.

2. In the Azure Stack user-portal, go to the Extensions blade of the Windows virtual machines for which you want to enable these solutions, click Add, and then select the **Azure Update and Configuration Management** solution:

    ![Windows VM extension blade](media/vm-update-management/3.PNG) 

3. Provide the WorkspaceID and Key we have previously created, so that the agent will be linked to the LogAnalytics workspace created previously:

    ![Providing the WorkspaceID and Key](media/vm-update-management/4.PNG) 

As described in the [automation update management documentation](https://docs.microsoft.com/azure/automation/automation-update-management) you need to enable the Update Management solution for each VM that you want to manage. 

To simplify adding multiple VMs through the portal, in the Azure portal, under Update Management, click the **Manage Machines** and select the **Enable on all available and future machines**. This way, all the VMs that report to the workspace will have the solution enabled automatically.

  ![Providing the WorkspaceID and Key](media/vm-update-management/5.PNG) 

Once enabled, a scan is performed twice per day for each managed Windows VM. The Windows API is called every 15 minutes to query for the last update time to determine whether the status has changed. If the status has changed, a compliance scan is initiated.

After the VMs are scanned, they will appear in the Azure Automation account in the Update Management solution: 

  ![Providing the WorkspaceID and Key](media/vm-update-management/6.PNG)

> [!IMPORTANT]
> It can take between 30 minutes and 6 hours for the dashboard to display updated data from managed computers.

The Azure Stack Windows VMs can now be included in scheduled update deployments together with the Azure VMs.

## Enable Update Management for multiple VMs
If you have a large number of Azure Stack Windows VMs, you can use [this ARM template](https://github.com/Azure/AzureStack-QuickStart-Templates/tree/master/MicrosoftMonitoringAgent-ext-win) to deploy the solution on all the VMs.
 
## Next steps
[Download the ASDK deployment package](asdk-download.md)
