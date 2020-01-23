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

To deliver this experience with your hybrid machines hosted outside of Azure, the Azure Connected Machine agent needs to be installed on each machine that you plan on connecting to Azure. This agent does not deliver any other functionality, and it doesn't replace the Azure [Log Analytics agent](../azure-monitor/platform/log-analytics-agent.md). The Log Analytics agent for Windows and Linux is required when you want to proactively monitor the OS and workloads running on the machine, manage it using Automation runbooks or solutions like Update Management, or use other Azure services like [Azure Security Center](../security-center/security-center-intro.md).

>[!NOTE]
>The Public Preview release is designed for evaluation purposes and we recommend not managing critical production resources.
>

## Supported scenarios

Azure Arc for servers (preview) supports the following scenarios with connected machines:

- Assign [Azure Policy guest configurations](../governance/policy/concepts/guest-configuration.md) using the same experience as policy assignment for Azure virtual machines.
- Log data collected by the Log Analytics agent and stored in the Log Analytics workspace the machine is registered with now contains properties specific to the machine, such as Resource ID, which can be used to support [resource-context](../azure-monitor/platform/design-logs-deployment#access-mode.md) log access.

## Prerequisites

### Supported operating systems

The following versions of the Windows and Linux operating system are officially supported for the Azure Connected Machine agent: 

- Windows Server 2012 R2 and higher
- Ubuntu 16.04 and 18.04

## Azure Subscription and Service Limits

Please make sure you read the Azure Resource Manager limits, and plan for the number of the machines to be connected according to the guideline listed for the [subscription](../../azure-resource-manager/management/azure-subscription-service-limits.md#subscription-limits---azure-resource-manager), and for the [resource groups](../../azure-resource-manager/management/azure-subscription-service-limits.md#resource-group-limits). In particular, by default there is a limit of 800 servers per resource group.

## Networking Configuration

During installation and runtime, the agent requires connectivity to **Azure Arc service endpoints**. If outbound connectivity is blocked by Firewalls, make sure that the following URLs are not blocked by default. All connections are outbound from the agent to Azure, and are secured with **SSL**. All traffic can be routed via an **HTTPS** proxy. If you allow the IP ranges or domain names that the servers are allowed to connect to, you must allow port 443 access to the following Service Tags and DNS Names.

Service Tags:

* AzureActiveDirectory
* AzureTrafficManager

For a list of IP addresses for each service tag/region, see the JSON file - [Azure IP Ranges and Service Tags – Public Cloud](https://www.microsoft.com/download/details.aspx?id=56519). Microsoft publishes weekly updates containing each Azure Service and the IP ranges it uses. See [Service tags](https://docs.microsoft.com/azure/virtual-network/security-overview#service-tags), for more details.

These DNS Names are provided in addition to the Service Tag IP range information because the majority of services do not currently have a Service Tag registration and, as such, the IPs are subject to change. If IP ranges are required for your firewall configuration, then the **AzureCloud** Service Tag should be used to allow access to all Azure services. Do not disable security monitoring or inspection of these URLs, but allow them as you would other internet traffic.

| Domain Environment | Required Azure service endpoints |
|---------|---------|
|management.azure.com|Azure Resource Manager|
|login.windows.net|Azure Active Directory|
|dc.services.visualstudio.com|Application Insights|
|agentserviceapi.azure-automation.net|Guest Configuration|
|*-agentservice-prod-1.azure-automation.net|Guest Configuration|
|*.his.hybridcompute.azure-automation.net|Hybrid Identity Service|

### Installation Network Requirements

Download the [Azure Connected Machine Agent package](https://aka.ms/AzureConnectedMachineAgent) from our official distribution servers the below sites must be accessible from your environment. You may choose to download the package to a file share and have the agent installed from there. In this case, the onboarding script generated from the Azure portal may need to be modified.

Windows:

* `aka.ms`
* `download.microsoft.com`

Linux:

* `aka.ms`
* `packages.microsoft.com`

See the section [Proxy server configuration](quickstart-onboard-powershell.md#proxy-server-configuration), for information on how to configure the agent to use your proxy.

## Register the required Resource Providers

In order to use Azure Arc for Servers, you must register the required Resource Providers.

* **Microsoft.HybridCompute**
* **Microsoft.GuestConfiguration**

You can register the resource providers with the following commands:

Azure PowerShell:

```azurepowershell-interactive
Login-AzAccount
Set-AzContext -SubscriptionId [subscription you want to onboard]
Register-AzResourceProvider -ProviderNamespace Microsoft.HybridCompute
Register-AzResourceProvider -ProviderNamespace Microsoft.GuestConfiguration
```

Azure CLI:

```azurecli-interactive
az account set --subscription "{Your Subscription Name}"
az provider register --namespace 'Microsoft.HybridCompute'
az provider register --namespace 'Microsoft.GuestConfiguration'
```

You can also register the Resource Providers using the portal by following the steps under [Azure portal](../../azure-resource-manager/management/resource-providers-and-types.md#azure-portal).

## Machine changes after installing the agent

If you have a change tracking solution deployed in your environment, you can use the list below to track, identify, and allow the changes made by the **Azure Connected Machine Agent (AzCMAgent)** installation package.

After you install the agent you see the following changes made to your servers.

### Windows

Services installed:

* `Himds` - The **Azure Connected Machine Agent** service.
* `Dscservice` or `gcd` - The **Guest Configuration** service.

Files added to the server:

* `%ProgramFiles%\AzureConnectedMachineAgent\*.*` - Location of **Azure Connected Machine Agent** files.
* `%ProgramData%\GuestConfig\*.*` - **Guest Configuration** logs.

Registry key locations:

* `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Azure Connected Machine Agent` - Registry keys for **Azure Connected Machine Agent**.

### Linux

Services installed:

* `Himdsd` - The **Azure Connected Machine Agent** service.
* `dscd` or `gcd` - The **Guest Configuration** service.

Files added to the server:

* `/var/opt/azcmagent/**` - Location of **Azure Connected Machine Agent** files.
* `/var/lib/GuestConfig/**` - **Guest Configuration** logs.



## Installing the agent 

Connecting machines in your hybrid environment directly with Azure can be accomplished using different methods depending on your requirements. The following table highlights each method to determine which works best for your organization.

| Method | Description | 
|--------|-------------|
| Interactively | Manually install the agent on a single or small number of machines following the [Portal Quickstart](quickstart-onboard-portal.md).<br> From the Azure portal you can generate a script and execute it on the machine to automate the install and configuration steps.|
| At scale | Install and configure the agent for multiple machines following the [PowerShell Quickstart](quickstart-onboard-powershell.md).<br> This method creates a service principal to connect machines non-interactively.|
 
 ## Next steps

