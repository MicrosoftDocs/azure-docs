---
title: Azure Arc for servers Overview
description: Learn how to use Azure Arc for servers to manage machines that are hosted outside of Azure as if it is an Azure resource.
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-servers
author: mgoedtel
ms.author: magoedte
keywords: azure automation, DSC, powershell, desired state configuration, update management, change tracking, inventory, runbooks, python, graphical, hybrid
ms.date: 01/23/2020
ms.custom: mvc
ms.topic: overview
---

# What is Azure Arc for servers (preview)

Azure Arc for servers (preview) allows you to manage your Windows and Linux machines hosted outside of Azure on your corporate network or other cloud provider, similarly to how you manage native Azure virtual machines. When a hybrid machine is connected to Azure, it becomes a **Connected Machine** and is treated as a resource in Azure. Each **Connected Machine** has a Resource ID, is managed as part of a resource group inside a subscription, and benefits from standard Azure constructs such as Azure Policy and applying tags.

To deliver this experience with your hybrid machines hosted outside of Azure, the Azure Connected Machine agent needs to be installed on each machine that you plan on connecting to Azure. This agent does not deliver any other functionality, and it doesn't replace the Azure [Log Analytics agent](../../azure-monitor/platform/log-analytics-agent.md). The Log Analytics agent for Windows and Linux is required when you want to proactively monitor the OS and workloads running on the machine, manage it using Automation runbooks or solutions like Update Management, or use other Azure services like [Azure Security Center](../../security-center/security-center-intro.md).

>[!NOTE]
>This preview release is intended for evaluation purposes and we recommend you don't manage critical production machines.
>

## Supported scenarios

Azure Arc for servers (preview) supports the following scenarios with connected machines:

- Assign [Azure Policy guest configurations](../../governance/policy/concepts/guest-configuration.md) using the same experience as policy assignment for Azure virtual machines.
- Log data collected by the Log Analytics agent and stored in the Log Analytics workspace the machine is registered with now contains properties specific to the machine, such as Resource ID, which can be used to support [resource-context](../../azure-monitor/platform/design-logs-deployment.md#access-mode) log access.

## Prerequisites

### Supported operating systems

The following versions of the Windows and Linux operating system are officially supported for the Azure Connected Machine agent: 

- Windows Server 2012 R2 and higher
- Ubuntu 16.04 and 18.04

>[!NOTE]
>This preview release of the Connected Machine agent for Windows only supports Windows Server configured to use the English language.
>

### Azure subscription and service limits

Before configuring your machines with Azure Arc for servers (preview), you should review the Azure Resource Manager [subscription limits](../../azure-resource-manager/management/azure-subscription-service-limits.md#subscription-limits---azure-resource-manager) and [resource group limits](../../azure-resource-manager/management/azure-subscription-service-limits.md#resource-group-limits) to plan for the number of machines to be connected.

### Networking Configuration

The Connected Machine agent for Linux and Windows communicates outbound securely to Azure Arc over TCP port 443. If the machine connects through a firewall or proxy server to communicate over the Internet, review requirements below to understand the network configuration requirements.

If outbound connectivity is restricted by your firewall or proxy server, make sure the URLs listed below are not blocked. If you only allow the IP ranges or domain names required for the agent to communicate with the service, you must also allow access to the following Service Tags and URLs.

Service Tags:

- AzureActiveDirectory
- AzureTrafficManager

URLs:

| Agent resource | Description |
|---------|---------|
|management.azure.com|Azure Resource Manager|
|login.windows.net|Azure Active Directory|
|dc.services.visualstudio.com|Application Insights|
|agentserviceapi.azure-automation.net|Guest Configuration|
|*-agentservice-prod-1.azure-automation.net|Guest Configuration|
|*.his.hybridcompute.azure-automation.net|Hybrid Identity Service|

For a list of IP addresses for each service tag/region, see the JSON file - [Azure IP Ranges and Service Tags – Public Cloud](https://www.microsoft.com/download/details.aspx?id=56519). Microsoft publishes weekly updates containing each Azure Service and the IP ranges it uses. See [Service tags](https://docs.microsoft.com/azure/virtual-network/security-overview#service-tags), for more details.

The URLs in the previous table are required in addition to the Service Tag IP address range information because the majority of services do not currently have a Service Tag registration. As such, the IP addresses are subject to change. If IP address ranges are required for your firewall configuration, then the **AzureCloud** Service Tag should be used to allow access to all Azure services. Do not disable security monitoring or inspection of these URLs, allow them as you would other Internet traffic.

### Register the required resource providers

Azure Arc for servers depends on the following Azure resource providers in your subscription in order to use this service:

- **Microsoft.HybridCompute**
- **Microsoft.GuestConfiguration**

If they are not registered, you can register them using the following commands:

Azure PowerShell:

```azurepowershell-interactive
Login-AzAccount
Set-AzContext -SubscriptionId [subscription you want to onboard]
Register-AzResourceProvider -ProviderNamespace Microsoft.HybridCompute
Register-AzResourceProvider -ProviderNamespace Microsoft.GuestConfiguration
```

Azure CLI:

```azurecli-interactive
az account set --subscription "{Your Subscription Name}"
az provider register --namespace 'Microsoft.HybridCompute'
az provider register --namespace 'Microsoft.GuestConfiguration'
```

You can also register the Resource Providers from the Azure portal by following the steps under [Azure portal](../../azure-resource-manager//management/resource-providers-and-types.md#azure-portal).

## Installing the agent

Connecting machines in your hybrid environment directly with Azure can be accomplished using different methods depending on your requirements. The following table highlights each method to determine which works best for your organization.

| Method | Description |
|--------|-------------|
| Interactively | Manually install the agent on a single or small number of machines following the [Portal Quickstart](quickstart-onboard-portal.md).<br> From the Azure portal you can generate a script and execute it on the machine to automate the install and configuration steps.|
| At scale | Install and configure the agent for multiple machines following the [PowerShell Quickstart](quickstart-onboard-powershell.md).<br> This method creates a service principal to connect machines non-interactively.|

## Next steps
