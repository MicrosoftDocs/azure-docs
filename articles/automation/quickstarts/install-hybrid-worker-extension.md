---
title: Azure Quickstart - Install Hybrid Worker extension on Azure portal
titleSuffix: Azure Automation
description: This article helps you get startedon how to install Hybrid Worker extension on Azure portal
services: automation
keywords: hybrid worker extension, automation
ms.date: 02/25/2024
ms.topic: quickstart
author: SnehaSudhir 
ms.author: sudhirsneha
---

# Quickstart: Install Hybrid Worker extension on Virtual Machines using the Azure Portal

Azure Automation User Hybrid Worker enables execution of PowerShell and Python scripts directly on machines for managing guest workloads or as a gateway to environments that are not accessible from Azure. You can configure Windows & Linux Azure Virtual Machine. [Azure Arc-enabled Server](../../azure-arc/servers/overview.md), [Arc-enabled VMware vSphere VM](../../azure-arc/vmware-vsphere/overview.md) and [Azure Arc-enabled SCVMM](../../azure-arc/system-center-virtual-machine-manager/overview.md) as User Hybrid Worker by installing Hybrid Worker extension.

This quickstart shows you how to install Azure Automation Hybrid Worker extension on an Azure Virtual Machine through the Extensions blade on Azure portal. 

You can follow similar steps for installing Hybrid Worker extension on all other machine types.  

## Prerequisites

- An Azure Automation account in a supported region
- A Windows Azure Virtual machine on which Hybrid Worker extension would be installed.
- Enable system-assigned managed identity on Azure Virtual machine. If the system-assigned managed identity isn't enabled, it will be enabled as part of the adding process. For more information, see [detailed prerequisites](../extension-based-hybrid-runbook-worker-install.md).
- 



Ihttps://learn.microsoft.com/en-us/azure/automation/extension-based-hybrid-runbook-worker-install?tabs=windows%2Cbicep-template#prerequisites



 

 

## Next steps

In this quickstart, you enabled an Azure Linux VM for State Configuration, created a configuration for a LAMP stack, and deployed the configuration to the VM. To learn how you can use Azure Automation State Configuration to enable continuous deployment, continue to the article:

> [!div class="nextstepaction"]
> [Set up continuous deployment with Chocolatey](../automation-dsc-cd-chocolatey.md)
