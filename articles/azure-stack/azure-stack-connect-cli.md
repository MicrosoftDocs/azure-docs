---
title: Connect to Azure Stack with CLI | Microsoft Docs
description: Learn how to use the cross-platform command-line interface (CLI) to manage and deploy resources on Azure Stack
services: azure-stack
documentationcenter: ''
author: SnehaGunda
manager: byronr
editor: ''

ms.assetid: f576079c-5384-4c23-b5a4-9ae165d1e3c3
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/31/2016
ms.author: sngun

---
# Install and configure Azure Stack CLI

In this document, we guide you through the process of using Azure Command-line Interface (CLI) to manage Azure Stack resources on Linux and Mac client platforms. You can use the steps described in this article either from the [Azure Stack POC computer](azure-stack-connect-azure-stack.md#connect-with-remote-desktop) or from an external client if you are [connected through VPN](azure-stack-connect-azure-stack.md#connect-with-vpn).

## Install Azure Stack CLI

Azure Stack requires the 2.0 version of Azure CLI, which you can install by using the steps described in the [Install Azure CLI 2.0](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) article. To verify if the installation was successful, open the command prompt and run the following command:

```
az --version
```

You should see the version number of Azure CLI and other dependent libraries installed on your computer.

## Connect to Azure Stack

Use the following steps to connect to Azure Stack:

1. Disable the SSL certificate validation by running the following commands:

   * If you are connecting from a windows-based computer:
     ```
     set AZURE_CLI_DISABLE_CONNECTION_VERIFICATION=1  
     set ADAL_PYTHON_SSL_NO_VERIFY=1
     ```
   * If you are connecting from macOS:
     ```
     export AZURE_CLI_DISABLE_CONNECTION_VERIFICATION=1  
     export ADAL_PYTHON_SSL_NO_VERIFY=1
     ```

2. Get your Azure Stack environment’s active directory resource Id endpoint by navigating to the following link in a browser: 

   * For the **administrative** environment:
     ```
     https://adminmanagement.local.azurestack.external/metadata/endpoints?api-version=2015-01-01
     ```

   * For the **User** environment:
     ```
     https://management.local.azurestack.external/metadata/endpoints?api-version=2015-01-01
     ```

   When you navigate to the previous link, a file named **endpoints** is downloaded. Open this file and make a note of the value assigned to the **audiences** parameter, which is in the format: `https://management.<aadtenant>.onmicrosoft.com/<active-directory-resource-id>`. You will use this value in the next step.

3. Register your Azure Stack environment by running the following command:

   * To register the **administrative** environment:
     ```
     az cloud register -n AzureStackAdmin --endpoint-resource-manager https://adminmanagement.local.azurestack.external/ --endpoint-active-directory https://login.windows.net/ --endpoint-active-directory-resource-id <active-directory-resource-Id-endpoint that you retrieved in Step2>  --endpoint-active-directory-graph-resource-id https://graph.windows.net/ --suffix-storage-endpoint local.azurestack.external
     ```

   * To register the **user** environment:
     ```
     az cloud register -n AzureStackUser --endpoint-resource-manager https://management.local.azurestack.external/ --endpoint-active-directory https://login.windows.net/ --endpoint-active-directory-resource-id <active-directory-resource-Id-endpoint that you retrieved in Step2>  --endpoint-active-directory-graph-resource-id https://graph.windows.net/ --suffix-storage-endpoint local.azurestack.external 
     ```

4. Update your environment configuration to use the Azure Stack API version profile. Run the following command to update the configuration:
   ```
   az cloud update --profile 2017-03-09-profile-preview
   ```

5. Set the active environment and sign in by using the following commands:

   * For the **administrative** environment:
     ```
     az cloud set -n AzureStackAdmin

     az login -u <Active directory global administrator account. Example: username@<aadtenant>.onmicrosoft.com>
     ```

   * For the **user** environment:
     ```
     az cloud set -n AzureStackUser

     az login -u < Active directory user account. Example: username@<aadtenant>.onmicrosoft.com>
     ```

## Test the connectivity

Now that we've got everything set up, let's use CLI to create resources within Azure Stack. For example, you can create a resource group for an application and add a virtual machine. Use the following command to create a resource group named `MyResourceGroup`:

```
az group create -n “MyResourceGroup” -l “local”
```

If the resource group is created successfully, the previous command outputs the following properties of the newly created resource:

![RG create output](media/azure-stack-connect-cli/image1.png)

There are some known issues when using CLI 2.0 in Azure Stack, to learn about them, see [Known issues in Azure Stack CLI topic](azure-stack-troubleshooting.md#cli). 

## Next steps

[Deploy templates with Azure CLI](azure-stack-deploy-template-command-line.md)

[Connect with PowerShell](azure-stack-connect-powershell.md)

[Manage user permissions](azure-stack-manage-permissions.md)

