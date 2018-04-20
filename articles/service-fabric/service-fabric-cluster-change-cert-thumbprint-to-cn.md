---
title: Azure Service Fabric cluster scaling | Microsoft Docs
description: Learn about scaling Service Fabric clusters in or out and up or down.
services: service-fabric
documentationcenter: .net
author: rwike77
manager: timlt
editor: ''

ms.assetid: 5441e7e0-d842-4398-b060-8c9d34b07c48
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 04/19/2018
ms.author: ryanwi;aljo

---
# Rollover from thumbprint to common name
This article describes how to update a running Service Fabric cluster to use the certificate common name instead of the certificate thumbprint.
 
## Get a certificate
First, get a certificate from a [certificate authority](https://wikipedia.org/wiki/Certificate_authority).  The common name of the certificate should be the host name of the cluster.  For example, "myclustername.southcentralus.cloudapp.azure.com".  

You can use a self-signed certificate if the cluster is for testing and is not running production work loads. The Service Fabric SDK provides the CertSetup.ps1 script, which creates a self-signed certificate and imports it into the `Cert:\LocalMachine\My certificate` store. Open a command prompt as administrator and run the following command to create a cert with the subject "CN=myclustername.southcentralus.cloudapp.azure.com":

```powershell
PS C:\program files\microsoft sdks\service fabric\clustersetup\secure> .\CertSetup.ps1 -Install -CertSubjectName CN=myclustername.southcentralus.cloudapp.azure.com
```

Next, export the self-signed certificate to a PFX file. Open the certlm.msc application and navigate to **Personal**>**Certificates**. Right-click on the **myclustername.southcentralus.cloudapp.azure.com** certificate, and select **All Tasks**>**Export**.  In the export wizard, choose **Yes, export the private key**, enter a password, and choose the Personal Information Exchange (PFX) format. Export the file to *C:\Users\sfuser\myclustercert.pfx*.


## Upload the certificate to keyvault and install in the virtual machine scale set
In Azure, a Service Fabric cluster is deployed on a virtual machine scale set.  Upload the certificate to a key vault and then install it on the virtual machine scale set that the cluster is running on.

```powershell
Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser -Force

$SubscriptionId  =  <subscription ID>

# Sign in to your Azure account and select your subscription
Login-AzureRmAccount -SubscriptionId $SubscriptionId

$region = "southcentralus"
$KeyVaultResourceGroupName  = "mykeyvaultgropu"
$VaultName = "mykeyvault"
$certFilename = "C:\users\sfuser\myclustercert.pfx"
$certname = "myclustercert"
$Password  = "P@ssw0rd!123"
$VmssResourceGroupName     = "myclustergroup"
$VmssName                  = "prnninnxj"

# Create new Resource Group 
New-AzureRmResourceGroup -Name $KeyVaultResourceGroupName -Location $region

# Create the new key vault
$newKeyVault = New-AzureRmKeyVault -VaultName $VaultName -ResourceGroupName $KeyVaultResourceGroupName -Location $region -EnabledForDeployment 
$resourceId = $newKeyVault.ResourceId 

# Add the certificate to the key vault.
$PasswordSec = ConvertTo-SecureString -String $Password -AsPlainText -Force
$KVSecret = Import-AzureKeyVaultCertificate -VaultName $vaultName -Name $certName  -FilePath $certFilename -Password $PasswordSec

$CertificateThumbprint = $KVSecret.Thumbprint
$CertificateURL = $KVSecret.SecretId
$SourceVault = $resourceId
$CommName    = $KVSecret.Certificate.SubjectName.Name

Write-Host "CertificateThumbprint    :"  $CertificateThumbprint
Write-Host "CertificateURL           :"  $CertificateURL
Write-Host "SourceVault              :"  $SourceVault
Write-Host "Common Name              :"  $CommName    

Set-StrictMode -Version 3
$ErrorActionPreference = "Stop"

$certConfig = New-AzureRmVmssVaultCertificateConfig -CertificateUrl $CertificateURL -CertificateStore "My"

# Get current VM scale set 
$vmss = Get-AzureRmVmss -ResourceGroupName $VmssResourceGroupName -VMScaleSetName $VmssName

# Add new secret to the VM scale set.
$vmss = Add-AzureRmVmssSecret -VirtualMachineScaleSet $vmss -SourceVaultId $SourceVault -VaultCertificate $certConfig

# Update the VM scale set 
Update-AzureRmVmss -ResourceGroupName $VmssResourceGroupName -Name $VmssName -VirtualMachineScaleSet $vmss  -Verbose
```

## Download and update the template from the portal
The certificate has been installed on the underlying scale set, but you also need to update the Service Fabric cluster to use that certificate and its common name.  Now, download the template for your cluster deployment.  Log in to the [Azure portal](https://portal.azure.com) and navigate to the resource group hosting the cluster.  In **Settings**, select **Deployments**.  Select the most recent deployment and click **View template**.

![View templates][image1]

Download the template and parameters JSON files to your local computer.

Next, open the template file in a text editor and make three updates to support certificate common name.

1. In the **parameters** section, add a *certificateCommonName* parameter:
    ```json
    "certificateCommonName": {
      "type": "string",
      "metadata": {
        "description": "Certificate Commonname"
      }
    },
    ```

    Also consider removing the *certificateThumbprint*, it may no longer be needed.

2. In the **Microsoft.Compute/virtualMachineScaleSets** resource, update the virtual machine extension to use the common name in certificate settings instead of the thumbprint.  In **virtualMachineProfile**->**extenstionProfile**->**extensions**->**properties**->**settings**->**certificate**, add `"commonNames": "[parameters('certificateCommonName')]",` and remove `"thumbprint": "[parameters('certificateThumbprint')]",`.
    ```json
    "virtualMachineProfile": {
              "extensionProfile": {
                "extensions": [
                  {
                    "name": "[concat('ServiceFabricNodeVmExt','_vmNodeType0Name')]",
                    "properties": {
                      "type": "ServiceFabricNode",
                      "autoUpgradeMinorVersion": true,
                      "protectedSettings": {
                        "StorageAccountKey1": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', variables('supportLogStorageAccountName')),'2015-05-01-preview').key1]",
                        "StorageAccountKey2": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', variables('supportLogStorageAccountName')),'2015-05-01-preview').key2]"
                      },
                      "publisher": "Microsoft.Azure.ServiceFabric",
                      "settings": {
                        "clusterEndpoint": "[reference(parameters('clusterName')).clusterEndpoint]",
                        "nodeTypeRef": "[variables('vmNodeType0Name')]",
                        "dataPath": "D:\\SvcFab",
                        "durabilityLevel": "Bronze",
                        "enableParallelJobs": true,
                        "nicPrefixOverride": "[variables('subnet0Prefix')]",
                        "certificate": {
                          "commonNames": "[parameters('certificateCommonName')]",                          
                          "x509StoreName": "[parameters('certificateStoreValue')]"
                        }
                      },
                      "typeHandlerVersion": "1.0"
                    }
                  },
    ```

3.  In the **Microsoft.ServiceFabric/clusters** resource, update the API version to "2018-02-01".  Also add a **certificateCommonNames** setting with a **commonNames** property as in the following example:
    ```json
    {
        "apiVersion": "2018-02-01",
        "type": "Microsoft.ServiceFabric/clusters",
        "name": "[parameters('clusterName')]",
        "location": "[parameters('clusterLocation')]",
        "dependsOn": [
        "[concat('Microsoft.Storage/storageAccounts/', variables('supportLogStorageAccountName'))]"
        ],
        "properties": {
        "addonFeatures": [
            "DnsService",
            "RepairManager"
        ],
        /*
        "certificate": {
            "thumbprint": "[parameters('certificateThumbprint')]",
            "x509StoreName": "[parameters('certificateStoreValue')]"
        },
        */
        "certificateCommonNames": {
            "commonNames": [
            {
                "certificateCommonName": "[parameters('certificateCommonName')]",
                "certificateIssuerThumbprint": ""
            }
            ],
            "x509StoreName": "[parameters('certificateStoreValue')]"
        },
        ...
    ```

## Deploy the updated template
Redeploy the updated template after making the changes.

```powershell
$groupname = "sfclustertutorialgroup"

New-AzureRmResourceGroupDeployment -ResourceGroupName $groupname -TemplateParameterFile "C:\temp\cluster\parameters.json" -TemplateFile "C:\temp\cluster\template.json" -Verbose
```

## Next steps
* Learn about [cluster security](service-fabric-cluster-security.md).
* Learn how to [rollover a cluster certificate](service-fabric-cluster-rollover-cert-cn.md)
* [Update and Manage cluster certificates](service-fabric-cluster-security-update-certs-azure.md)

[image1]: .\media\service-fabric-cluster-change-cert-thumbprint-to-cn\PortalViewTemplates.png