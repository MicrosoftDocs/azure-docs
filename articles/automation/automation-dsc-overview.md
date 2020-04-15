---
title: Azure Automation State Configuration overview
description: This article is an overview of Azure Automation State Configuration (DSC), its terms, and its known issues.
keywords: powershell dsc, desired state configuration, powershell dsc azure
services: automation
ms.service: automation
ms.subservice: dsc
author: mgoedtel
ms.author: magoedte
ms.date: 11/06/2018
ms.topic: conceptual
manager: carmonm
---

# State Configuration overview

Azure Automation State Configuration is an Azure service that allows you to write, manage, and compile PowerShell Desired State Configuration (DSC) [configurations](/powershell/scripting/dsc/configurations/configurations). The service also imports [DSC resources](/powershell/scripting/dsc/resources/resources) and assigns configurations to target nodes, all in the cloud.

## Why use Azure Automation State Configuration?

Azure Automation State Configuration provides several advantages over using DSC outside of Azure.

### Built-in pull server

Azure Automation State Configuration provides a DSC pull server similar to the [Windows Feature DSC-Service](/powershell/scripting/dsc/pull-server/pullserver). Target nodes can automatically receive configurations, conform to the desired state, and report on their compliance. The built-in pull server in Azure Automation eliminates the need to set up and maintain your own pull server. Azure Automation can target virtual or physical Windows or Linux machines, in the cloud or on-premises.

### Manage all your DSC artifacts

Azure Automation State Configuration brings the same management layer to [PowerShell Desired State Configuration](/powershell/scripting/dsc/overview/overview) as it offers for PowerShell scripting. From the Azure portal or from PowerShell, you can manage all your DSC configurations, resources, and target nodes.

![Screenshot of the Azure Automation page](./media/automation-dsc-overview/azure-automation-blade.png)

### Import reporting data into Azure Monitor logs

Nodes that are managed with Azure Automation State Configuration send detailed reporting status data to the built-in pull server. You can configure Azure Automation State Configuration to send this data to your Log Analytics workspace. For more information, see [Forward Azure Automation State Configuration reporting data to Azure Monitor logs](automation-dsc-diagnostics.md).

## Prerequisites

Consider the following requirements when you use Azure Automation State Configuration for DSC.

### Operating system requirements

For nodes running Windows, the following versions are supported:

- Windows Server 2019
- Windows Server 2016
- Windows Server 2012R2
- Windows Server 2012
- Windows Server 2008 R2 SP1
- Windows 10
- Windows 8.1
- Windows 7

>[!NOTE]
>Because the [Microsoft Hyper-V Server](/windows-server/virtualization/hyper-v/hyper-v-server-2016) standalone product SKU doesn't contain an implementation of DSC, it can't be managed by PowerShell DSC or Azure Automation State Configuration.

For nodes running Linux, the DSC Linux extension supports all the Linux distributions listed under [Supported Linux Distributions](https://github.com/Azure/azure-linux-extensions/tree/master/DSC#4-supported-linux-distributions).

### DSC requirements

For all Windows nodes running in Azure,
[Windows Management Framework 5.1](https://docs.microsoft.com/powershell/scripting/wmf/setup/install-configure)
is installed during onboarding. For nodes running Windows Server 2012 and Windows 7, [WinRM](https://docs.microsoft.com/powershell/scripting/dsc/troubleshooting/troubleshooting#winrm-dependency) is enabled.

For all Linux nodes running in Azure, [PowerShell DSC for Linux](https://github.com/Microsoft/PowerShell-DSC-for-Linux)
is installed during onboarding.

### <a name="network-planning"></a>Configuration of private networks

If your nodes are located in a private network, the following port and URLs are required. These resources provide network connectivity for the managed node and allow DSC to communicate with Azure Automation.

* Port: Only TCP 443 required for outbound internet access
* Global URL: ***.azure-automation.net**
* Global URL of US Gov Virginia: ***.azure-automation.us**
* Agent service: **https://\<workspaceId\>.agentsvc.azure-automation.net**

If you are using DSC resources that communicate between nodes,
such as the [WaitFor* resources](https://docs.microsoft.com/powershell/scripting/dsc/reference/resources/windows/waitForAllResource), you also need to allow traffic between nodes. See the documentation for each DSC resource to understand these network requirements.

#### Proxy support

Proxy support for the DSC agent is available in Windows version 1809 and later. You enable this option by setting the values for `ProxyURL` and `ProxyCredential` in the [metaconfiguration script](automation-dsc-onboarding.md#generate-dsc-metaconfigurations) that's used to register nodes.

>[!NOTE]
>Azure Automation State Configuration doesn't provide DSC proxy support for earlier versions of Windows.

For Linux nodes, the DSC agent supports the proxy and uses the `http_proxy` variable to determine the URL.

#### Azure Automation State Configuration network ranges and namespace

When you're defining exceptions, we recommend that you use the IP addresses listed in the following table. For IP addresses, you can download the [Microsoft Azure Datacenter IP Ranges](https://www.microsoft.com/download/details.aspx?id=41653) XML file from the Microsoft Download Center. This file contains the currently deployed ranges and any upcoming changes to the IP ranges. It is updated weekly.

If you have an Automation account that's defined for a specific region, you can restrict communication to that regional datacenter. The following table provides the DNS record for each region:

| **Region** | **DNS record** |
| --- | --- |
| West Central US | wcus-jobruntimedata-prod-su1.azure-automation.net</br>wcus-agentservice-prod-1.azure-automation.net |
| South Central US |scus-jobruntimedata-prod-su1.azure-automation.net</br>scus-agentservice-prod-1.azure-automation.net |
| East US    | eus-jobruntimedata-prod-su1.azure-automation.net</br>eus-agentservice-prod-1.azure-automation.net |
| East US 2 |eus2-jobruntimedata-prod-su1.azure-automation.net</br>eus2-agentservice-prod-1.azure-automation.net |
| Canada Central |cc-jobruntimedata-prod-su1.azure-automation.net</br>cc-agentservice-prod-1.azure-automation.net |
| West Europe |we-jobruntimedata-prod-su1.azure-automation.net</br>we-agentservice-prod-1.azure-automation.net |
| North Europe |ne-jobruntimedata-prod-su1.azure-automation.net</br>ne-agentservice-prod-1.azure-automation.net |
| South East Asia |sea-jobruntimedata-prod-su1.azure-automation.net</br>sea-agentservice-prod-1.azure-automation.net|
| Central India |cid-jobruntimedata-prod-su1.azure-automation.net</br>cid-agentservice-prod-1.azure-automation.net |
| Japan East |jpe-jobruntimedata-prod-su1.azure-automation.net</br>jpe-agentservice-prod-1.azure-automation.net |
| Australia South East |ase-jobruntimedata-prod-su1.azure-automation.net</br>ase-agentservice-prod-1.azure-automation.net |
| UK South | uks-jobruntimedata-prod-su1.azure-automation.net</br>uks-agentservice-prod-1.azure-automation.net |
| US Gov Virginia | usge-jobruntimedata-prod-su1.azure-automation.us<br>usge-agentservice-prod-1.azure-automation.us |

> [!NOTE]
> The Azure Datacenter IP address XML file lists the IP address ranges that are used in the Microsoft Azure datacenters. The file includes compute, SQL, and storage ranges.
>
>An updated file is posted weekly. The file reflects the currently deployed ranges and any upcoming changes to the IP ranges. New ranges that appear in the file aren't used in the datacenters for at least one week. It's a good idea to download a new XML file every week. Then, you can update your site to correctly identify services running in Azure. 

If you're an Azure ExpressRoute user, note that this file is used to update the Border Gateway Protocol (BGP) advertisement of Azure space in the first week of each month.

## Next steps

- To get started using DSC in Azure Automation State Configuration, see [Get started with Azure Automation State Configuration](automation-dsc-getting-started.md).
- To learn how to onboard nodes, see [Onboard machines for management by Azure Automation State Configuration](automation-dsc-onboarding.md).
- To learn about compiling DSC configurations so that you can assign them to target nodes, see [Compile configurations in Azure Automation State Configuration](automation-dsc-compile.md).
- For a PowerShell cmdlet reference, see [Az.Automation](https://docs.microsoft.com/powershell/module/az.automation/?view=azps-3.7.0#automation).
- For pricing information, see [Azure Automation State Configuration pricing](https://azure.microsoft.com/pricing/details/automation/).
- For an example of using Azure Automation State Configuration in a continuous deployment pipeline, see [Continuous deployment to virtual machines using Azure Automation State Configuration and Chocolatey](automation-dsc-cd-chocolatey.md).
