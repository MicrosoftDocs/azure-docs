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
ms.date: 07/24/2017
ms.author: sngun

---
# Install and configure CLI for use with Azure Stack

In this document, we guide you through the process of using Azure Command-line Interface (CLI) to manage Azure Stack resources on Linux and Mac client platforms. You can use the steps described in this article either from the [Azure Stack Development Kit](azure-stack-connect-azure-stack.md#connect-with-remote-desktop) or from an external client if you are [connected through VPN](azure-stack-connect-azure-stack.md#connect-with-vpn).

## Install Azure Stack CLI

Azure Stack requires the 2.0 version of Azure CLI, which you can install by using the steps described in the [Install Azure CLI 2.0](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) article. To verify if the installation was successful, open a command prompt window and run the following command:

```azurecli
az --version
```

You should see the version of Azure CLI and other dependent libraries that are installed on your computer.

## Connect to Azure Stack

Use the following steps to connect to Azure Stack:

1. If your Azure Stack deployment doesn't contain a certificate that is issued by a publicly trusted certificate authority, you should add the root certificate to the Python certifi package store. If you are using CLI from a Windows-based OS, use the following script to add the certificate:

   ```powershell
    $label = "AzureStackSelfSignedRootCert"
    Write-Host "Getting certificate from the current user trusted store with subject CN=$label"
    $root = Get-ChildItem Cert:\CurrentUser\Root | Where-Object Subject -eq "CN=$label" | select -First 1
    if (-not $root)
    {
        Log-Error "Cerficate with subject CN=$label not found"
        return
    }

    Write-Host "Exporting certificate"
    Export-Certificate -Type CERT -FilePath root.cer -Cert $root

    Write-Host "Converting certificate to PEM format"
    certutil -encode root.cer root.pem

    Write-Host "Extracting needed information from the cert file"
    $md5Hash=(Get-FileHash -Path root.pem -Algorithm MD5).Hash.ToLower()
    $sha1Hash=(Get-FileHash -Path root.pem -Algorithm SHA1).Hash.ToLower()
    $sha256Hash=(Get-FileHash -Path root.pem -Algorithm SHA256).Hash.ToLower()

    $issuerEntry = [string]::Format("# Issuer: {0}", $root.Issuer)
    $subjectEntry = [string]::Format("# Subject: {0}", $root.Subject)
    $labelEntry = [string]::Format("# Label: {0}", $label)
    $serialEntry = [string]::Format("# Serial: {0}", $root.GetSerialNumberString().ToLower())
    $md5Entry = [string]::Format("# MD5 Fingerprint: {0}", $md5Hash)
    $sha1Entry  = [string]::Format("# SHA1 Finterprint: {0}", $sha1Hash)
    $sha256Entry = [string]::Format("# SHA256 Fingerprint: {0}", $sha256Hash)
    $certText = (Get-Content -Path root.pem -Raw).ToString().Replace("`r`n","`n")

    $rootCertEntry = "`n" + $issuerEntry + "`n" + $subjectEntry + "`n" + $labelEntry + "`n" + `
    $serialEntry + "`n" + $md5Entry + "`n" + $sha1Entry + "`n" + $sha256Entry + "`n" + $certText

    Write-Host "Adding the certificate content to Python Cert store"
    Add-Content "${env:ProgramFiles(x86)}\Microsoft SDKs\Azure\CLI2\Lib\site-packages\certifi\cacert.pem" $rootCertEntry

    Write-Host "Python Cert store was updated for allowing the azure stack CA root certificate" 
   ```

2. Register your Azure Stack environment by running the following command:

   a. To register the **cloud administrative** environment, use:

   ```azurecli
   az cloud register \ 
     -n AzureStackAdmin \ 
     --endpoint-resource-manager "https://adminmanagement.local.azurestack.external" \ 
     --suffix-storage-endpoint "local.azurestack.external" \ 
     --suffix-keyvault-dns ".adminvault.local.azurestack.external"
   ```

   b. To register the **user** environment, use:

   ```azurecli
   az cloud register \ 
     -n AzureStackUser \ 
     --endpoint-resource-manager "https://management.local.azurestack.external" \ 
     --suffix-storage-endpoint "local.azurestack.external" \ 
     --suffix-keyvault-dns ".vault.local.azurestack.external"
   ```

3. Set the active environment by using the following commands:

   a. For the **cloud administrative** environment, use:

   ```azurecli
   az cloud set \
     -n AzureStackAdmin
   ```

   b. For the **user** environment, use:

   ```azurecli
   az cloud set \
     -n AzureStackUser
   ```


4. Update your environment configuration to use the Azure Stack specific API version profile. To update the configuration, run the following command:

   ```azurecli
   az cloud update \
     --profile 2017-03-09-profile
   ```

5. Sign in to your Azure Stack environment by using the following commands:

   a. For the **cloud administrative** environment, use:

   ```azurecli
   az login \
     -u <Active directory global administrator account. For example: username@<aadtenant>.onmicrosoft.com>
   ```

   b. For the **user** environment, use:

   ```azurecli
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

