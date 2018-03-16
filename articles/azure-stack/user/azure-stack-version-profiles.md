---
title: Manage API version profiles in Azure Stack | Microsoft Docs
description: Learn about API version profiles in Azure Stack.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.assetid: 8A336052-8520-41D2-AF6F-0CCE23F727B4
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/25/2017
ms.author: mabrigg
ms.reviewer: 

---

# Manage API version profiles in Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

API profiles specify the Azure resource provider and the API version for Azure REST endpoints. You can create custom clients in different languages using API profiles. Each client uses an API profile to contact the right resource provider and API version for Azure Stack.

This topic helps you:
 - Understand API profiles for Azure Stack.
 - How you can use API profiles to develop your solutions.
 - Where to look for code-specific guidance.

## Azure Resource Manager API profiles

You can use profiles to specify a set of resource providers and API versions. Instead of specifying individual API-versions for each individual resource provider, you can align the application to a profile. The SDK, or a tool built with the SDK, will revert to the target api-version specified in the profile. With API profiles, you can specify a profile version that applies to an entire template and, at runtime, the Azure Resource Manager (ARM) selects the right version of the resource.

API profiles work with tools that use ARM, such as PowerShell, Azure CLI, code provided in the SDK, and Microsoft Visual Studio. Tools and SDKs can use profiles to read which version of the modules and libraries to include when building an application.

For example, if use PowerShell to create a storage account using the **Microsoft.Storage** resource provider, which supports api-version 2016-03-30 and a VM using the Microsoft.Compute resource provider with api-version 2015-12-01, you would need to look up  which PowerShell Module supports 2016-03-30 for Storage and which Module supports 2015-02-01 for Compute and install them. Instead, you can use a profile. Use the cmdlet **Install-Profile *profilename***, and PowerShell loads the right version of the modules.

Similarly, when using the Python SDK to build a Python-based application, you can specify the profile. The SDK loads the right modules for the resource providers that you have specified in your script.

As a developer, you can focus on writing your solution. Rather than researching which api-versions, resource provider, and which cloud works together, you use a profile and know that your code will work across all clouds that support that profile.

## Using API profiles with Azure Stack

An Azure resource provider supplies resources you can deploy and manage through the Azure Resource Manager. Each provider offers operations for working with resources. Some common resource providers include Microsoft.Compute, which supplies virtual machines, Microsoft.Storage, which supplies storage account resources, and Microsoft.Web, which supplies resources related to web apps. For more information, see [Resource providers and types](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-supported-services).

The following table for each resource provider indicates the supported version of the API version for Azure Stack.

### Microsoft.Authorization

You use role-based access control to manage the actions users in your organization can take on resources. This set of operations enables you to define roles, assign roles to users or groups, and get information about permissions. For more information, see [Authorization](https://docs.microsoft.com/rest/api/authorization/).

| Resource Types | API Versions |
|---------------------|--------------------|
| Locks | 2015-01-01 |
| Operations | 2015-07-01 |
| Permissions | 2015-7-01 |
| Policy Assignments | 2016-12-01 |
| Policy Definitions | 2016-12-01 |
| Provider Operations | 2015-07-01-preview |
| Role Assignments | 2015-07-01 |
| Role Definitions | 2015-07-01 |

### Microsoft.Commerce

| Resource Type | API Version |
|----------------------------------|----------------------|
| Delegated Provider Subscriptions | 2015-06-01 - preview |
| Delegated Usage Aggregates | 2015-06-01 - preview |
| Estimate Resource Spend | 2015-06-01 – preview |
| Operations | 2015-06-01 - preview |
| Subscriber Usage Aggregates | 2015-06-01 - preview |
| Usage Aggregates | 2015-06-01 - preview |

### Microsoft.Compute

The Azure Compute APIs give you programmatic access to virtual machines and their supporting resources. For more information, see [Azure Compute](https://docs.microsoft.com/en-us/rest/api/compute/).

| Resource Type | API Version |
|---------------------------------------------------------------|-------------|
| Availability Sets | 2016-03-30 |
| Locations | 2016-03-30 |
| Locations/operations | 2016-03-30 |
| Locations/publishers | 2016-03-30 |
| Locations/usages | 2016-03-30 |
| Locations/vmSizes | 2016-03-30 |
| Operations | 2016-03-30 |
| Virtual Machines | 2016-03-30 |
| Virtual Machines/extensions | 2016-03-30 |
| Virtual Machine Scale Sets | 2016-03-30 |
| Virtual Machine Scale Sets/extensions | 2016-03-30 |
| Virtual Machine Scale Sets/network Interfaces | 2016-03-30 |
| Virtual Machine Scale Sets/Virtual Machines | 2016-03-30 |
| Virtual Machines Scale Sets/virtualMachines/networkInterfaces | 2016-03-30 |

### Microsoft.Gallery

| Resource Type | API Version |
|------------------|-------------|
| Curation | 2015-04-01 |
| Curation Content | 2015-04-01 |
| Curation Extract | 2015-04-01 |
| Gallery Items | 2015-04-01 |
| Operations | 2015-04-01 |
| Portal | 2015-04-01 |
| Search | 2015-04-01 |
| Suggest | 2015-04-01 |

### Microsoft.Insights

| Resource Types | API Versions |
|--------------------|--------------------|
| Alert Rules | 2016-03-01 |
| Event Categories | 2017-03-01-preview |
| Event Types | 2017-03-01-preview |
| Metric Definitions | 2016-03-01 |
| Operations | 2015-04-01 |

### Microsoft.KeyVault

Managing your key vaults as well as the keys, secrets, and certificates within your key vaults. For more information, see [Azure Key Vault REST API reference](https://docs.microsoft.com/rest/api/keyvault/).

| Resource Types | API Versions |
|-------------------------|--------------|
| Operations | 2016-10-01 |
| Vaults | 2016-10-01 |
| Vaults/ Access Policies | 2016-10-01 |
| Vaults/secrets | 2016-10-01 |

### Microsoft.Keyvault.Admin

Managing your key vaults as well as the keys, secrets, and certificates within your key vaults. For more information, see [Azure Key Vault REST API reference](https://docs.microsoft.com/rest/api/keyvault/).

| Resource Types | API Versions |
|------------------|--------------------|
| Locations | 2017-02-01-preview |
| Locations/quotas | 2017-02-01-preview |

### Microsoft.Network 

Operations call result is a representation of available Network cloud operations list. For more information, see [Operation REST API](https://docs.microsoft.com/rest/api/operation/).

| Resource Types | API Versions |
|---------------------------|--------------|
| Connections | 2015-06-15 |
| DNS Zones | 2016-04-01 |
| Load Balancers | 2015-06-15 |
| Local Network Gateway | 2015-06-15 |
| Locations | 2016-04-01 |
| Location/operationResults | 2016-04-01 |
| Locations/operations | 2016-04-01 |
| Locations/usages | 2016-04-01 |
| Network Interfaces | 2015-06-15 |
| Network Security Groups | 2015-06-15 |
| Operations | 2015-06-15 |
| Public IP Address | 2015-06-15 |
| Route Tables | 2015-06-15 |
| Virtual Network Gateway | 2015-06-15 |
| Virtual Networks | 2015-06-15 |

### Microsoft.Resources

Azure Resource Manager enables you to deploy and manage the infrastructure for your Azure solutions. You organize related resources in resource groups, and deploy your resources with JSON templates. For an introduction to deploying and managing resources with Resource Manager, see [Azure Resource Manager overview](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview).

| Resource Types | API Versions |
|-----------------------------------------|--------------|
| Application Registrations | 2015-01-01 |
| Check Resource Name | 2015-01-01 |
| Delegated Providers | 2015-01-01 |
| Delegated Providers/offers | 2015-01-01 |
| DelegatedProviders/offers/estimatePrice | 2015-01-01 |
| Deployments | 2016-02-01 |
| Deployments/operations | 2016-02-01 |
| Extensions Metadata | 2015-01-01 |
| Links | 2015-01-01 |
| Locations | 2015-01-01 |
| Offers | 2015-01-01 |
| Operations | 2015-01-01 |
| Providers | 2015-01-01 |
| Resource Groups | 2015-01-01 |
| Resources | 2015-01-01 |
| Subscriptions | 2015-01-01 |
| Subscriptions/location | 2015-01-01 |
| Subscriptions/operation results | 2015-01-01 |
| Subscriptions/providers | 2015-01-01 |

### Microsoft.Storage 

The Storage Resource Provider (SRP) enables you to manage your storage account and keys programmatically. For more information, see [Azure Storage Resource Provider REST API Reference](https://docs.microsoft.com/rest/api/storagerp/).

| Resource Types | API Versions |
|-------------------------|--------------|
| Check Name Availability | 2016-01-01 |
| Locations | 2016-01-01 |
| Locations/quotas | 2016-01-01 |
| Operations | 2016-01-01 |
| StorageAccounts | 2016-01-01 |
| Usages | 2016-01-01 |

## API profile code samples

You can find code samples to help you integrate your solution with your preferred language with Azure Stack by using profiles. Currently, you can find guidance and samples for the following languages:

- **PowerShell**  
You can use the  **AzureRM.Bootstrapper** module available through the PowerShell Gallery to get the PowerShell cmdlets required to work with API version profiles.  For more information, see [Use API version profiles for PowerShell](azure-stack-version-profiles-powershell.md).
- **Azure CLI 2.0**  
For more information see [Use API version profiles for Azure CLI 2.0](azure-stack-version-profiles-azurecli2.md).
- **GO**  
For more information see [Use API version profiles for GO](azure-stack-version-profiles-go.md).

## Next steps
* [Install PowerShell for Azure Stack](azure-stack-powershell-install.md)
* [Configure the Azure Stack user's PowerShell environment](azure-stack-powershell-configure-user.md)  
