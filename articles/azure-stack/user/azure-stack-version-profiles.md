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

Profiles specify a combination of resource provider for the resource types and the API version for Azure Platform REST endpoints to be contacted by clients created in different languages.

## Azure Resource Manager API Profiles

You can use profiles to specify a set of resource providers and API versions. Instead of specifying individual API-versions for each individual resource provider, you can align the application to a profile. The SDK, or a tool built with the SDK, will revert to the target api-version specified in the profile. With API profiles, you can can specify a profile version that applies to an entire template and, at runtime, the Azure Resource Manager (ARM) selects the right version of the resource.

API profiles work with tools that use ARM, such as PowerShell, Azure CLI, code provided in the SDK, and Microsoft Visual Studio. Tools and SDKs can use profiles to read which version of the modules and libraries to include when building an application.

For example, if use PowerShell to create a storage account using the Microsoft.Storage resource provider which supports api-version 2016-03-30 and a VM using the Microsoft.Compute resource provider with api-version 2015-12-01, you would need to look up  which PowerShell Module supports 2016-03-30 for Storage and which Module supports 2015-02-01 for Compute and install them. Instead, you can use a profile. Use the cmdlet **Install-Profile *profilename***, and PowerShell loads the right version of the modules.

Similarly, when using the Python SDK to build a Python-based application, you can specify the profile. The SDK will load the right modules for the resource providers that you have specified in your script.

As a developer, you can focus on writing your solution. Rather than researching which api-versions, resource provider, and which cloud will work together, you use a profile and know that your code will work across all clouds that support that profile.

## Design Principles

<Summary>

### Which services get defined in a profile?

The list of services that will be defined in a profile going forward is a union of the below sets

1. Azure Ring 0 services
2. Services that ship on Azure Stack that do not belong in #1

### Will profiles be defined at Azure Cadence or Azure Stack cadence? – 

We should decouple profile definitions from any one cloud’s cadence. We should agree on defining profiles on a consistent, predictable cadence of its own that will benefit customers.

To get started, we will define profiles four times a year corresponding to our Sprint planning cycles Eg: For 2018, we will define a profile for Scandium and one for Titanium. We will announce said profiles during our major conferences in the year - Build and Ignite.

Defining them too often will make them as complicated as API-versions and defining them to sparsely will cause a drift in tooling support and will become an overhead and not provide any customer value.

### What Profiles will be available for the developers to use? 

The concept of API Profiles was created to make it easier for our developers to write automation and create templates that would work across many Azure Clouds. This concept evolved to also address the need of our developers for a varying degree of compatibility and stability. The naming schema for profiles is 'latest,' 'yyyy-mm-dd-hybrid,'yy-mm-dd-Profile.' 

### Latest 

The 'latest' API Profile is for developers whom would like to target the most recent API versions released in Azure. 

#### YYYY-MM-DD-Hybrid 

This Profile will be available for a developer who seek consistency and stability across the multiple clouds. The API versions in this profile will reflect compatibility with Azure Stack and as such, code written against this profile will work as-is across the various Azure clouds.

The ‘-hybrid’ profiles will be coined at the two ecosystem wide milestones every year: //build and Ignite.

#### YYYY-MM-DD-Profile 

This Profile version sits between the optimal compatibility and stability of “-hybrid” and the cutting edge of “latest”. The main objective of this profile is to handle breaking changes in tooling. We will coin such profile a couple of times a year, intermittently with the “-hybrid” profile.

### What is the next profile?

| Resource Provider                 | 2018-03-01-hybrid (scandium)                        |
|-----------------------------------|-----------------------------------------------------|
| Microsoft.Compute                 | 2017-03-30                                          |
| Microsoft.Network                 | 2015-06-15                                          |
| VPN Gateway will be 2017-03-01    |                                                     |
| Microsoft.Storage (Data Plane)    |                                                     |
| Microsoft.Storage (Control Plane) | 2017-04-17                                          |
| 2016-01-01                        |                                                     |
| Microsoft.Websites                | 2016-08-01 which is the latest (as of now) in Azure |
| Microsoft.KeyVault                | 2016-10-01 (Not changing)                           |
 

## Public Facing, External Documentation

### Problems that exist today with Hybrid App development

-	When building hybrid applications, developers often run into the problem of different API versions being supported across different clouds. In fact, different namespaces (et: Compute, Network, Storage) within the same cloud support resource types that are at a different api-version from one another.
-	At an ARM Template level, knowing and specifying individual API versions for individual resources is complicated. Adding to that when the template is deployed to another cloud, identifying if the api-versions per resources type will be supported in the second cloud is a complicated task.
-	At an SDK level, finding the right version of these APIs across each namespace and finding the right libraries/modules to be able to write the application and re-compiling them to fit each cloud is a pain stacking and time-consuming process.
While using tools such as Azure PowerShell, CLI etc.., being able to know and import the right versions of the Modules for each namespace for each cloud is a painstaking process as well.

## Next steps
* [Install PowerShell for Azure Stack](azure-stack-powershell-install.md)
* [Configure the Azure Stack user's PowerShell environment](azure-stack-powershell-configure-user.md)  
