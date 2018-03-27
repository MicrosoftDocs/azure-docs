---
title: How to configure an MSI-enabled Azure VM using C#
description: How to guidance for configuring an Azure VM, using C#.
services: active-directory
documentationcenter: ''
author: daveba
manager: mtillman
editor: ''

ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 03/26/2018
ms.author: daveba
---

# Configure a VM Managed Service Identity (MSI) using C#

Managed Service Identity provides Azure services with an automatically managed identity in Azure Active Directory. You can use this identity to authenticate to any service that supports Azure AD authentication, without having credentials in your code. 

## Prerequisites

If you are unfamiliar with creating an Azure VM using C#, refer to the following articles:

- [Create and manage Windows VMs in Azure using C#] (https://docs.microsoft.com/en-us/azure/virtual-machines/windows/csharp)
- [Azure virtual machine libraries for .NET](https://docs.microsoft.com/dotnet/api/overview/azure/virtualmachines?view=azure-dotnet)

## Create the Azure VM with managed identity enabled

To enable Managed Identity during the creation of a VM, add the line `.WithSystemAssignedManagedServiceIdentity()` as seen in the following code sample:  

```csharp
var virtualMachine = azure.VirtualMachines.Define("myVM")
    // code for configuration settings
    .WithSystemAssignedManagedServiceIdentity()
    .Create();

```  
## Enable managed identity for an Azure VM

To enable Managed identity on an existing VM, refer to the following code sample:

```csharp
virtualMachine.Update()
    //code for configuration updates
    .WithSystemAssignedManagedServiceIdentity()
    .Apply();

```

## Remove MSI from an Azure VM

To remove Managed Identity on an existing VM, refer to the following code sample:

```csharp



```


## Next steps
- Learn more about using [Managed Service Identity (MSI) for Azure resources](overview.md)