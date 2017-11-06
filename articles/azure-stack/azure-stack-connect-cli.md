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
ms.date: 08/29/2017
ms.author: sngun

---
# Install and configure CLI for the Azure Stack user's environment

In this document, we guide you through the process of using Azure Command-line Interface (CLI) to manage Azure Stack Development Kit resources from Linux and Mac client platforms. 

## Prerequisites

Before you can use CLI to manage Azure Stack resources, make sure that the following are available to you:

* Get the [Azure Stack CA root certificate](azure-stack-cli-admin.md#export-the-azure-stack-ca-root-certificate) from your Azure Stack operator. 
* Get the [virtual machine aliases endpoint](azure-stack-cli-admin.md#set-up-the-virtual-machine-aliases-endpoint) from your Azure Stack operator.
 
## Install CLI

Next you should sign in to your development workstation and install CLI. Azure Stack requires the 2.0 version of Azure CLI, which you can install by using the steps described in the [Install Azure CLI 2.0](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) article. To verify if the installation was successful, open a terminal or a command prompt window and run the following command:

```azurecli
az --version
```

You should see the version of Azure CLI and other dependent libraries that are installed on your computer.

## Trust the Azure Stack CA root certificate

To trust the Azure Stack CA root certificate, you should append it to the existing python certificate. If you are running CLI from a Linux machine that is created within the Azure Stack environment, the certificate is already available within the virtual machine. So you need to run the following bash command to append the certificate to the Python certificate:

```bash
sudo cat /var/lib/waagent/Certificates.pem >> ~/lib/azure-cli/lib/python2.7/site-packages/certifi/cacert.pem
```

If you are running CLI from a machine outside the Azure Sack environment, you must first set up [VPN connectivity to Azure Stack](azure-stack-connect-azure-stack.md). Now copy the PEM certificate that you received from your Azure Stack operator onto your development workstation and run the following commands depending on your development workstation's OS:

### Linux

```bash
sudo cat PATH_TO_PEM_FILE >> ~/lib/azure-cli/lib/python2.7/site-packages/certifi/cacert.pem
```

### macOS

```bash
sudo cat PATH_TO_PEM_FILE >> ~/lib/azure-cli/lib/python2.7/site-packages/certifi/cacert.pem
```

### Windows

```powershell
$pemFile = "<Fully qualified path to the PEM certificate Ex: C:\Users\user1\Downloads\root.pem>"

$root = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2
$root.Import($pemFile)

Write-Host "Extracting needed information from the cert file"
$md5Hash=(Get-FileHash -Path $pemFile -Algorithm MD5).Hash.ToLower()
$sha1Hash=(Get-FileHash -Path $pemFile -Algorithm SHA1).Hash.ToLower()
$sha256Hash=(Get-FileHash -Path $pemFile -Algorithm SHA256).Hash.ToLower()

$issuerEntry = [string]::Format("# Issuer: {0}", $root.Issuer)
$subjectEntry = [string]::Format("# Subject: {0}", $root.Subject)
$labelEntry = [string]::Format("# Label: {0}", $root.Subject.Split('=')[-1])
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

## Connect to Azure Stack

Use the following steps to connect to Azure Stack:

1. Register the Azure Stack user environment by running the az cloud register command. Make sure that you get the URI of the virtual machine image aliases document and register it with the cloud. The `endpoint-vm-image-alias-doc` parameter in the `az cloud register` command is used for this purpose.

   ```azurecli
   az cloud register \ 
     -n AzureStackUser \ 
     --endpoint-resource-manager "https://management.local.azurestack.external" \ 
     --suffix-storage-endpoint "local.azurestack.external" \ 
     --suffix-keyvault-dns ".vault.local.azurestack.external" \ 
     --endpoint-active-directory-graph-resource-id "https://graph.windows.net/" \
     --endpoint-vm-image-alias-doc <URI of the document which contains virtual machine image aliases>
   ```

2. Set the active environment and update your environment configuration to use the Azure Stack specific API version profile:

   ```azurecli
   az cloud set \
     -n AzureStackUser

   az cloud update \
     --profile 2017-03-09-profile
   ```

3. Sign in to your Azure Stack environment by using the **az login** command. You can sign in to the Azure Stack environment either as a user or as a [service principal](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-application-objects). 

   * Sign in as a **user**: You can either specify the username and password directly within the az login command or authenticate using a browser. You would have to do the latter, if your account has multi-factor authentication enabled.

   ```azurecli
   az login \
     -u <Active directory user account. For example: username@<aadtenant>.onmicrosoft.com> \
     --tenant <Azure Active Directory Tenant name. For example: myazurestack.onmicrosoft.com>
   ```

   > [!NOTE]
   > If your user account has Multi factor authentication enabled, you can use the az login command without providing the -u parameter. Running the command gives you a URL and a code that you must use to authenticate.
   
   * Sign in as a **service principal**: Before you sign in, [Create a service principal through the Azure portal](azure-stack-create-service-principals.md) or CLI and assign it a role. Now, log in by using the following command:

   ```azurecli
   az login \
     --tenant <Azure Active Directory Tenant name. For example: myazurestack.onmicrosoft.com> \
     --service-principal \
     -u <Application Id of the Service Principal> \
     -p <Key generated for the Service Principal>
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

