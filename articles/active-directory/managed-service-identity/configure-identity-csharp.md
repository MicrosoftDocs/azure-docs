---
title: How to configure an MSI-enabled Azure VM using C#
description: Step by step instructions for configuring an Azure VM, using C#.
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

To use the code sample provided to create an Azure VM with managed identity enabled, complete the following sections in the [Create and manage Windows VMs in Azure using C#] (https://docs.microsoft.com/en-us/azure/virtual-machines/windows/csharp) article:  

- [Create a Visual Studio Project](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/csharp#create-a-visual-studio-project)
- [Install the package](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/csharp#install-the-package)
- [Create the authorization file](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/csharp#create-the-authorization-file)



## Create the Azure VM with managed identity enabled

1. Copy the following code into your Visual Studio project.  

```csharp
using System;
using Microsoft.Azure.Management.Compute.Fluent;
using Microsoft.Azure.Management.Compute.Fluent.Models;
using Microsoft.Azure.Management.Fluent;
using Microsoft.Azure.Management.ResourceManager.Fluent;
using Microsoft.Azure.Management.ResourceManager.Fluent.Core;

namespace ManagedIdentityVM
{
    class Program
    {
        public static void RunSample(IAzure azure)
        {
            var virtualMachine = azure.VirtualMachines.Define("myVM")
                .WithRegion(Region.USWestCentral)
                .WithNewResourceGroup("myRG")
                .WithNewPrimaryNetwork("10.0.0.0/28")
                .WithPrimaryPrivateIPAddressDynamic()
                .WithNewPrimaryPublicIPAddress("IP1")
                .WithPopularWindowsImage(KnownWindowsVirtualMachineImage.WindowsServer2012R2Datacenter)
                .WithAdminUsername("azureuser")
                .WithAdminPassword("Azure12345678")
                .WithComputerName("myVM")
                .WithSize(VirtualMachineSizeTypes.StandardDS2V2)
                .WithSystemAssignedManagedServiceIdentity()
                .Create();
        }
        static void Main(string[] args)
        {
            var credentials = SdkContext.AzureCredentialsFactory.FromFile(Environment.GetEnvironmentVariable("AZURE_AUTH_LOCATION"));
            var azure = Azure
                .Configure()
                .WithLogLevel(HttpLoggingDelegatingHandler.Level.Basic)
                .Authenticate(credentials)
                .WithDefaultSubscription();
            RunSample(azure);
        }
    }
}

```  

2. To run the console application, click **Start**.  

## Enable and remove managed identity for an Azure VM

It is recommended to use Azure CLI to enable or remove managed identity from an Azure VM.  For instructions on how to enable and remove managed identity for an Azure VM using CLI:

- [Enable MSI on an existing Azure VM](https://docs.microsoft.com/azure/active-directory/managed-service-identity/qs-configure-cli-windows-vm#enable-msi-on-an-existing-azure-vm)
- [Remove MSI from an Azure VM](https://docs.microsoft.com/azure/active-directory/managed-service-identity/qs-configure-cli-windows-vm#remove-msi-from-an-azure-vm)

## Next steps
- Learn more about using [Managed Service Identity (MSI) for Azure resources](overview.md)