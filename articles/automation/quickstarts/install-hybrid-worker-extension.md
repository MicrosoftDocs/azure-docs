---
title: Azure Quickstart - Install Hybrid Worker extension on Azure portal.
titleSuffix: Azure Automation
description: This article helps you get started on how to install Hybrid Worker extension on Azure portal.
services: automation
keywords: hybrid worker extension, automation
ms.date: 03/05/2024
ms.topic: quickstart
author: SnehaSudhir 
ms.author: sudhirsneha
---

# Quickstart: Install Hybrid Worker extension on Virtual Machines using the Azure portal

The Azure Automation User Hybrid Worker enables the execution of PowerShell and Python scripts directly on machines for managing guest workloads or as a gateway to environments that aren't accessible from Azure. You can configure Windows and Linux Azure Virtual Machine. [Azure Arc-enabled Server](../../azure-arc/servers/overview.md), [Arc-enabled VMware vSphere VM](../../azure-arc/vmware-vsphere/overview.md), and [Azure Arc-enabled SCVMM](../../azure-arc/system-center-virtual-machine-manager/overview.md) as User Hybrid Worker by installing Hybrid Worker extension.

This quickstart shows you how to install Azure Automation Hybrid Worker extension on an Azure Virtual Machine through the Extensions blade on Azure portal. 

You can follow similar steps for installing Hybrid Worker extension on all other machine types.  

## Prerequisites

- An Azure Automation account in a supported region.
- A Windows Azure Virtual Machine on which Hybrid Worker extension would be installed.
- Enable system-assigned managed identity on Azure Virtual Machine. If the system-assigned managed identity isn't enabled, it will be enabled as part of the adding process. For more information, see [detailed prerequisites](../extension-based-hybrid-runbook-worker-install.md).

## Install Hybrid Worker extension

1. Sign in to the [Azure portal](https://portal.azure.com) and search for Virtual Machines.
1. On the **Virtual Machines** page, from the list, select the machine on which you want to install Hybrid Worker extension.
1. Under **Settings**, select **Extensions + applications** for Azure VMs or select **Extensions**.

   :::image type="content" source="./media/install-hybrid-worker-extension/select-extensions.png" alt-text="Screenshot that shows the menu option to install extensions." lightbox="./media/install-hybrid-worker-extension/select-extensions.png":::

 1. Select **+Add**, and in the **Install an Extension**, search and select **Azure Automation Windows Hybrid Worker** from the list, and then select  **Next**.
 
    :::image type="content" source="./media/install-hybrid-worker-extension/select-hybrid-worker.png" alt-text="Screenshot that shows the search option to select Automation Windows Hybrid Worker." lightbox="./media/install-hybrid-worker-extension/select-hybrid-worker.png":::

1. Complete the installation by providing the Automation Account Name, Automation Account Region, and Automation Account Hybrid Runbook Worker Group Name, where you want to add the machine selected in Step 2.

   > [!NOTE]
   > If you don't have an existing Automation account or Hybrid Runbook Worker Group, provide the new names, and resources would be created automatically in your subscription.  
 
    :::image type="content" source="./media/install-hybrid-worker-extension/configure-hybrid-worker-extension.png" alt-text="Screenshot that shows how to configure Automation Windows Hybrid Worker Extension." lightbox="./media/install-hybrid-worker-extension/configure-hybrid-worker-extension.png":::
    
1. After you confirm the required information, select **Review+ Create**.

   A summary of the deployment is displayed and you can review the status of the deployment. The Hybrid Worker extension gets installed on the machine and the Hybrid Worker gets registered to the Hybrid Worker group. The machine can now be used to execute Azure Automation jobs.  

## Next steps

- To learn about Hybrid Runbook Worker, benefits, limitations, see [An overview of Automation Hybrid Runbook Worker](../automation-hybrid-runbook-worker.md)

- To learn about deploying a User Hybrid Runbook Worker on Windows and Linux machines, see [Run Automation runbooks on a Hybrid Runbook Worker](../automation-hrw-run-runbooks.md)

- To learn about the benefits of extension based User Hybrid Runbook and how to migrate an existing Agent based User Hybrid Worker to Extension based Hybrid Workers, see [Migrate the existing agent-based hybrid workers to extension-based hybrid workers](../migrate-existing-agent-based-hybrid-worker-to-extension-based-workers.md)

