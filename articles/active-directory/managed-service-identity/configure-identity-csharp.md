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

This article covers creating an Azure VM with managed identity enabled. You will learn how to:

> [!div class="checklist"]
> * Create a Visual Studio project
> * Install the package
> * Create credentials
> * Create the VM

## Create a Visual Studio project

1. If you haven't already, install [Visual Studio](https://docs.microsoft.com/visualstudio/install/install-visual-studio). Select **.NET desktop development** on the Workloads page, and then click **Install**. In the summary, you can see that **.NET Framework 4 - 4.6 development tools** is automatically selected for you. If you have already installed Visual Studio, you can add the .NET workload using the Visual Studio Launcher.
2. In Visual Studio, click **File** > **New** > **Project**.
3. In **Templates** > **Visual C#**, select **Console App (.NET Framework)**, enter *myDotnetProject* for the name of the project, select the location of the project, and then click **OK**.


## Install the package

NuGet packages are the easiest way to install the libraries that you need to finish these steps. To get the libraries that you need in Visual Studio, do these steps:

1. Click **Tools** > **Nuget Package Manager**, and then click **Package Manager Console**.
2. Type this command in the console:

    ```
    Install-Package Microsoft.Azure.Management.Fluent
    ```

## Create credentials

Before you start this step, make sure that you have access to an [Active Directory service principal](../../azure-resource-manager/resource-group-create-service-principal-portal.md). You should also record the application ID, the authentication key, and the tenant ID that you need in a later step.

### Create the authorization file

1. In Solution Explorer, right-click *myDotnetProject* > **Add** > **New Item**, and then select **Text File** in *Visual C# Items*. Name the file *azureauth.properties*, and then click **Add**.
2. Add these authorization properties:

    ```
    subscription=<subscription-id>
    client=<application-id>
    key=<authentication-key>
    tenant=<tenant-id>
    managementURI=https://management.core.windows.net/
    baseURL=https://management.azure.com/
    authURL=https://login.windows.net/
    graphURL=https://graph.windows.net/
    ```

    Replace **&lt;subscription-id&gt;** with your subscription identifier, **&lt;application-id&gt;** with the Active Directory application identifier, **&lt;authentication-key&gt;** with the application key, and **&lt;tenant-id&gt;** with the tenant identifier.

3. Save the azureauth.properties file. 
4. Set an environment variable in Windows named AZURE_AUTH_LOCATION with the full path to authorization file that you created. For example, the following PowerShell command can be used:

    ```
    [Environment]::SetEnvironmentVariable("AZURE_AUTH_LOCATION", "C:\Visual Studio 2017\Projects\myDotnetProject\myDotnetProject\azureauth.properties", "User")

## Create the Azure VM with managed identity enabled

1. Copy the following code sample into your Visual Studio project.  

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

2.  To run the console application, click **Start**.

## Next steps
- Learn more about using [Managed Service Identity (MSI) for Azure resources](overview.md)