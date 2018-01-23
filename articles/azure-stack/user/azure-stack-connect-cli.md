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
ms.date: 08/18/2017
ms.author: sngun

---
# Install and configure CLI for use with Azure Stack

In this document, we guide you through the process of using Azure Command-line Interface (CLI) to manage Azure Stack Development Kit resources from Linux and Mac client platforms. 

## Export the Azure Stack CA root certificate

If you are using CLI from a virtual machine that is running within the Azure Stack Development Kit environment, the Azure Stack root certificate is already installed within the virtual machine so you can directly retrieve. Whereas if you are use CLI from a workstation outside the development kit, you must export the Azure Stack CA root certificate from the development kit and add it to the Python certificate store of your development workstation(external Linux or Mac platform). 

Sign in to your development kit and run the following script to export the Azure Stack root certificate in PEM format:

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
```

## Install CLI

Next you should sign in to your development workstation and install CLI. Azure Stack requires the 2.0 version of Azure CLI, which you can install by using the steps described in the [Install Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli) article. To verify if the installation was successful, open a terminal or a command prompt window and run the following command:

```azurecli
az --version
```

You should see the version of Azure CLI and other dependent libraries that are installed on your computer.

## Trust the Azure Stack CA root certificate

To trust the Azure Stack CA root certificate, you should append it to the existing python certificate. If you are running CLI from a Linux machine that is created within the Azure Stack environment, run the following bash command:

```bash
sudo cat /var/lib/waagent/Certificates.pem >> ~/lib/azure-cli/lib/python2.7/site-packages/certifi/cacert.pem
```

If you are running CLI from a machine outside the Azure Sack environment, you must first set up [VPN connectivity to Azure Stack](azure-stack-connect-azure-stack.md). Now copy the PEM certificate that you exported earlier onto your development workstation and run the following commands depending on your development workstation's OS,:

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

## Set up the virtual machine aliases endpoint

Before users can create virtual machines by using CLI, the cloud administrator should set up a publicly accessible endpoint that contains virtual machine image aliases and register this endpoint with the cloud. The `endpoint-vm-image-alias-doc` parameter in the `az cloud register` command is used for this purpose. Cloud administrators must download the image to the Azure Stack marketplace before they add it to image aliases endpoint.
   
For example, Azure contains uses following URI: 
https://raw.githubusercontent.com/Azure/azure-rest-api-specs/master/arm-compute/quickstart-templates/aliases.json. The cloud administrator should set up a similar endpoint for Azure Stack with the images that are available in the Azure Stack marketplace.

## Connect to Azure Stack

Use the following steps to connect to Azure Stack:

1. Register your Azure Stack environment by running the az cloud register command.
   
   a. To register the **cloud administrative** environment, use:

   ```azurecli
   az cloud register \ 
     -n AzureStackAdmin \ 
     --endpoint-resource-manager "https://adminmanagement.local.azurestack.external" \ 
     --suffix-storage-endpoint "local.azurestack.external" \ 
     --suffix-keyvault-dns ".adminvault.local.azurestack.external" \ 
     --endpoint-active-directory-graph-resource-id "https://graph.windows.net/" \
     --endpoint-vm-image-alias-doc <URI of the document which contains virtual machine image aliases>
   ```

   b. To register the **user** environment, use:

   ```azurecli
   az cloud register \ 
     -n AzureStackUser \ 
     --endpoint-resource-manager "https://management.local.azurestack.external" \ 
     --suffix-storage-endpoint "local.azurestack.external" \ 
     --suffix-keyvault-dns ".vault.local.azurestack.external" \ 
     --endpoint-active-directory-graph-resource-id "https://graph.windows.net/" \
     --endpoint-vm-image-alias-doc <URI of the document which contains virtual machine image aliases>
   ```

2. Set the active environment by using the following commands:

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

3. Update your environment configuration to use the Azure Stack specific API version profile. To update the configuration, run the following command:

   ```azurecli
   az cloud update \
     --profile 2017-03-09-profile
   ```

4. Sign in to your Azure Stack environment by using the **az login** command. You can sign in to the Azure Stack environment either as a user or as a [service principal](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-application-objects). 

   * Sign in as a **user**: You can either specify the username and password directly within the az login command or authenticate using a browser. You would have to do the latter, if your account has multi-factor authentication enabled.

   ```azurecli
   az login \
     -u <Active directory global administrator or user account. For example: username@<aadtenant>.onmicrosoft.com> \
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

## Next steps

[Deploy templates with Azure CLI](azure-stack-deploy-template-command-line.md)

[Manage user permissions](azure-stack-manage-permissions.md)

