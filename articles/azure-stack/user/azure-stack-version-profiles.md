---
title: Manage API version profiles in Azure Stack | Microsoft Docs
description: Learn about API version profiles in Azure Stack.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila

ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/02/2018
ms.author: mabrigg
ms.reviewer: sijuman

---

# Manage API version profiles in Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

API profiles specify the Azure resource provider and the API version for Azure REST endpoints. You can create custom clients in different languages using API profiles. Each client uses an API profile to contact the right resource provider and API version for Azure Stack. 

You can create an app to work with Azure resource providers without having to sort out exactly which version of each resource provider API is compatible with Azure Stack. Just align your application to a profile; the SDK reverts to the right API-versions.


This topic helps you:
 - Understand API profiles for Azure Stack.
 - How you can use API profiles to develop your solutions.
 - Where to look for code-specific guidance.

## Summary of API profiles

- API Profiles are used to represent a set of Azure resource providers and their API versions.
- API Profiles were created for developers to create templates across multiple Azure Clouds. They are designed to meet your need for a compatible and stable interfaces.
- Profiles are released four times a year.
- Three profile naming conventions are:
    - **latest**  
        Most recent API versions released in Azure.
    - **yyyy-mm-dd-hybrid**  
    Released at a biannual cadence, this release focused on consistency and stability across multiple clouds.
    - **yyyy-mm-dd-profile**  
    Sits between optimal stability and the latest features.

## Azure Resource Manager API profiles

Azure Stack does not use the latest version of of the API versions found in global Azure. In creating your own solution, you need to find the API version for each resource provider in Azure that is compatible with Azure Stack.

Rather than research each resource provider and the specific version supported by Azure Stack, you can use an API profile. The profile specifies a set of resource providers and API versions. The SDK, or a tool built with the SDK, will revert to the target api-version specified in the profile. With API profiles, you can specify a profile version that applies to an entire template and, at runtime, the Azure Resource Manager selects the right version of the resource.

API profiles work with tools that use Azure Resource Manager, such as PowerShell, Azure CLI, code provided in the SDK, and Microsoft Visual Studio. Tools and SDKs can use profiles to read which version of the modules and libraries to include when building an application.

For example, if use PowerShell to create a storage account using the **Microsoft.Storage** resource provider, which supports api-version 2016-03-30 and a VM using the Microsoft.Compute resource provider with api-version 2015-12-01, you would need to look up  which PowerShell Module supports 2016-03-30 for Storage and which Module supports 2015-02-01 for Compute and install them. Instead, you can use a profile. Use the cmdlet **Install-Profile *profilename***, and PowerShell loads the right version of the modules.

Similarly, when using the Python SDK to build a Python-based application, you can specify the profile. The SDK loads the right modules for the resource providers that you have specified in your script.

As a developer, you can focus on writing your solution. Rather than researching which api-versions, resource provider, and which cloud works together, you use a profile and know that your code will work across all clouds that support that profile.

## API profile code samples

You can find code samples to help you integrate your solution with your preferred language with Azure Stack by using profiles. Currently, you can find guidance and samples for the following languages:

- **PowerShell**  
You can use the  **AzureRM.Bootstrapper** module available through the PowerShell Gallery to get the PowerShell cmdlets required to work with API version profiles.  
For information, see [Use API version profiles for PowerShell](azure-stack-version-profiles-powershell.md).
- **Azure CLI 2.0**  
You can update your environment configuration to use the Azure Stack specific API version profile.  
For information see [Use API version profiles for Azure CLI 2.0](azure-stack-version-profiles-azurecli2.md).
- **GO**  
In the GO SDK, a profile is a combination of different resource types with different versions from different services. profiles are available under the profiles/ path, with their version in the **YYYY-MM-DD** format.  
For information see [Use API version profiles for GO](azure-stack-version-profiles-go.md).

## Next steps
* [Install PowerShell for Azure Stack](azure-stack-powershell-install.md)
* [Configure the Azure Stack user's PowerShell environment](azure-stack-powershell-configure-user.md)
* [Review details about resource provider API versions supported by the profiles](azure-stack-profiles-azure-resource-manager-versions.md).
