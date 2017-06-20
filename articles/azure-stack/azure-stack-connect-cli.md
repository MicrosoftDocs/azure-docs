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
# Install and configure CLI for use with Azure Stack

In this document, we guide you through the process of using Azure Command-line Interface (CLI) to manage Azure Stack resources on Linux and Mac client platforms. You can use the steps described in this article either from the [Azure Stack POC computer](azure-stack-connect-azure-stack.md#connect-with-remote-desktop) or from an external client if you are [connected through VPN](azure-stack-connect-azure-stack.md#connect-with-vpn).

## Install Azure Stack CLI

Azure Stack requires the 2.0 version of Azure CLI, which you can install by using the steps described in the [Install Azure CLI 2.0](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) article. To verify if the installation was successful, open the command prompt and run the following command:

```azurecli
az --version
```

You should see the version number of Azure CLI and other dependent libraries installed on your computer.

## Connect to Azure Stack

Use the following steps to connect to Azure Stack:

1. Disable the SSL certificate validation by running the following commands:

   * If you are connecting from a windows-based computer, use:

   ```azurecli
   set AZURE_CLI_DISABLE_CONNECTION_VERIFICATION=1  
   set ADAL_PYTHON_SSL_NO_VERIFY=1
   ```
   * If you are connecting from a macOS, use:

   ```azurecli
   export AZURE_CLI_DISABLE_CONNECTION_VERIFICATION=1  
   export ADAL_PYTHON_SSL_NO_VERIFY=1
   ```

2. Get your Azure Stack environment’s active directory endpoint and active directory resource Id endpoint. You can get these values by navigating to one of the following links in a browser: 

   a. For the **administrative** environment, use:    `https://adminmanagement.local.azurestack.external/metadata/endpoints?api-version=2015-01-01`

   b. For the **user** environment, use:    
   `https://management.local.azurestack.external/metadata/endpoints?api-version=2015-01-01`

   When you navigate to the previous link, a file named **endpoints** is downloaded. Open this file and make a note of the values assigned to the **loginEndpoint** and **audiences** parameters, you will use these values in the next step. The *loginEndpoint* value is set to - `https://login.windows.net/` for AAD based deployments and `https://adfs.local.azurestack.external/adfs` for AD FS based deployments. And the *audiences* parameter has the format- `https://management.<aadtenant>.onmicrosoft.com/<active-directory-resource-id>`.

3. Register your Azure Stack environment by running the following command:

   a. To register the **administrative** environment, use:

   ```azurecli
   az cloud register \
     -n AzureStackAdmin \
     --endpoint-resource-manager https://adminmanagement.local.azurestack.external/ \
     --endpoint-active-directory <active-directory-endpoint that you retrieved in Step2> \
     --endpoint-active-directory-resource-id <active-directory-resource-Id-endpoint that you retrieved in Step2> \
     --endpoint-active-directory-graph-resource-id https://graph.windows.net/ \
     --suffix-storage-endpoint local.azurestack.external
   ```
   b. To register the **user** environment, use:

   ```azurecli
   az cloud register \
     -n AzureStackUser \
     --endpoint-resource-manager https://management.local.azurestack.external/ \
     --endpoint-active-directory <active-directory-endpoint that you retrieved in Step2> \
     --endpoint-active-directory-resource-id <active-directory-resource-Id-endpoint that you retrieved in Step2>  \
     --endpoint-active-directory-graph-resource-id https://graph.windows.net/ \
     --suffix-storage-endpoint local.azurestack.external 
   ```

4. Update your environment configuration to use the Azure Stack specific API version profile. To update the configuration, run the following command:

   ```azurecli
   az cloud update \
     --profile 2017-03-09-profile-preview
   ```

5. Set the active environment and sign in by using the following commands:

   a. For the **administrative** environment, use:

   ```azurecli
   az cloud set \
     -n AzureStackAdmin

   az login \
     -u <Active directory global administrator account. Example: username@<aadtenant>.onmicrosoft.com>
   ```

   b. For the **user** environment, use:

   ```azurecli
   az cloud set \
     -n AzureStackUser

   az login \
     -u < Active directory user account. Example: username@<aadtenant>.onmicrosoft.com>
   ```

## Test the connectivity

Now that we've got everything setup, let's use CLI to create resources within Azure Stack. For example, you can create a resource group for an application and add a virtual machine. Use the following command to create a resource group named "MyResourceGroup":

```azurecli
az group create \
  -n MyResourceGroup -l local
```

If the resource group is created successfully, the previous command outputs the following properties of the newly created resource:

![resource group create output](media/azure-stack-connect-cli/image1.png)

There are some known issues when using CLI 2.0 in Azure Stack, to learn about these issues, see the [Known issues in Azure Stack CLI](azure-stack-troubleshooting.md#cli) topic. 


## Next steps

[Deploy templates with Azure CLI](azure-stack-deploy-template-command-line.md)

[Connect with PowerShell](azure-stack-connect-powershell.md)

[Manage user permissions](azure-stack-manage-permissions.md)

