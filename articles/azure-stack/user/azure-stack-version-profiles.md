---
title: Manage API version profiles in Azure Stack | Microsoft Docs
description: Learn about API version profiles in Azure Stack.
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila

ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/17/2018
ms.author: sethm
ms.reviewer: sijuman

---

# Manage API version profiles in Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

API profiles specify the Azure resource provider and the API version for Azure REST endpoints. You can create custom clients in different languages using API profiles. Each client uses an API profile to contact the correct resource provider and API version for Azure Stack.

You can create an app to work with Azure resource providers without having to sort out exactly which version of each resource provider API is compatible with Azure Stack. Just align your application to a profile; the SDK reverts to the correct API version.

This topic helps you:

 - Understand API profiles for Azure Stack.
 - Learn how you can use API profiles to develop your solutions.
 - See where to find code-specific guidance.

## Summary of API profiles

- API profiles are used to represent a set of Azure resource providers and their API versions.
- API profiles were created for you to create templates across multiple Azure clouds. Profiles are designed to meet your need for a compatible and stable interface.
- Profiles are released four times a year.
- Three profile naming conventions are used:
    - **latest**  
        Contains the most recent API versions released in global Azure.
    - **yyyy-mm-dd-hybrid**  
    Released at a biannual cadence, this release focuses on consistency and stability across multiple clouds. This profile targets optimal Azure Stack compatibility.
    - **yyyy-mm-dd-profile**
    Sits between optimal stability and the latest features.

## Azure API profiles and Azure Stack compatibility

The newest Azure API profiles are not compatible with Azure Stack. You can use the following naming conventions to identify which profiles to use for your Azure Stack solutions.

**Latest**  
This profile has the most up-to-date API versions found in global Azure, which won't work in Azure Stack. **Latest** has the largest number of breaking changes. The profile puts aside stability and compatibility with other clouds. If you're trying to use the most up-to-date API versions, **Latest** is the profile you should use.

**Yyyy-mm-dd-hybrid**  
This profile is released in March and September every year. This profile has optimal stability and compatibility with the various clouds. **Yyyy-mm-dd-hybrid** is designed to target global Azure and Azure Stack. The Azure API versions listed in this profile will be the same as the ones that are listed on Azure Stack. You can use this profile to develop code for hybrid cloud solutions.

**yyyy-mm-dd-profile**  
This profile is released for global Azure in June and December. This profile won't work against Azure Stack; typically, there will be many breaking changes. Although it sits between optimal stability and latest features, the difference between **Latest** and this profile is that **Latest** will always consist of the newest API versions, regardless of when the API was released. For example, if a new API version is created for the Compute API tomorrow, that API version will be listed in the **Latest**, but not in the **yyyy-mm-dd-profile** because this profile already exists.  **yyyy-mm-dd-profile** covers the most up-to-date versions released before June or before December.

## Azure Resource Manager API profiles

Azure Stack does not use the latest version of the API versions found in global Azure. When you're creating a solution, you need to find the API version for each Azure resource provider that's compatible with Azure Stack.

Rather than research every resource provider and the specific version supported by Azure Stack, you can use an API profile. The profile specifies a set of resource providers and API versions. The SDK, or a tool built with the SDK, will revert to the target api-version specified in the profile. With API profiles, you can specify a profile version that applies to an entire template and, at runtime, the Azure Resource Manager selects the right version of the resource.

API profiles work with tools that use Azure Resource Manager, such as PowerShell, Azure CLI, code provided in the SDK, and Microsoft Visual Studio. Tools and SDKs can use profiles to read which version of the modules and libraries to include when building an application.

For example, if you use PowerShell to create a storage account using the **Microsoft.Storage** resource provider, which supports api-version 2016-03-30 and a VM using the Microsoft.Compute resource provider with api-version 2015-12-01, you would need to look up  which PowerShell Module supports 2016-03-30 for Storage and which Module supports 2015-02-01 for Compute and install them. Instead, you can use a profile. Use the cmdlet **Install-Profile *profilename***, and PowerShell loads the right version of the modules.

Similarly, when using the Python SDK to build a Python-based application, you can specify the profile. The SDK loads the right modules for the resource providers that you have specified in your script.

As a developer, you can focus on writing your solution. Rather than researching which api-versions, resource provider, and which cloud works together, you use a profile and know that your code will work across all clouds that support that profile.

## API profile code samples

You can find code samples to help you integrate your solution with your preferred language with Azure Stack by using profiles. Currently, you can find guidance and samples for the following languages:

- **.NET**
You can use the .NET API profile to get the latest, most stable version of each resource type in a resource provider package. For more information, see [Use API version profiles with .NET in Azure Stack](azure-stack-version-profiles-net.md).
- **PowerShell**  
You can use the  **AzureRM.Bootstrapper** module available through the PowerShell Gallery to get the PowerShell cmdlets required to work with API version profiles. For information, see [Use API version profiles for PowerShell](azure-stack-version-profiles-powershell.md).
- **Azure CLI**  
You can update your environment configuration to use the Azure Stack specific API version profile. For information, see [Use API version profiles for Azure CLI](azure-stack-version-profiles-azurecli2.md).
- **GO**  
In the GO SDK, a profile is a combination of different resource types with different versions from different services. profiles are available under the profiles/ path, with their version in the **YYYY-MM-DD** format. For information, see [Use API version profiles for GO](azure-stack-version-profiles-go.md).
- **Ruby**  
The Ruby SDK for the Azure Stack Resource Manager provides tools to help you build and manage your infrastructure. Resource providers in the SDK include compute, virtual networks, and storage with the Ruby language. For information, see [Use API version profiles with Ruby](azure-stack-version-profiles-ruby.md)
- **Python**  
The Python SDK supports API version profiles to target different cloud platforms such as Azure Stack and global Azure. You can use API profiles in creating solutions for a hybrid cloud. For information, see [Use API version profiles with Python](azure-stack-version-profiles-python.md)

## Next steps

* [Install PowerShell for Azure Stack](azure-stack-powershell-install.md)
* [Configure the Azure Stack user's PowerShell environment](azure-stack-powershell-configure-user.md)
* [Review details about resource provider API versions supported by the profiles](azure-stack-profiles-azure-resource-manager-versions.md).
