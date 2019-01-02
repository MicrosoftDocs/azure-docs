---
title: Create an Azure Service Fabric cluster using certificate common name | Microsoft Docs
description: Learn how to create a Service Fabric cluster using certificate common name from a template.
services: service-fabric
documentationcenter: .net
author: rwike77
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 04/24/2018
ms.author: ryanwi

---
# Deploy a Service Fabric cluster that uses certificate common name instead of thumbprint
No two certificates can have the same thumbprint, which makes cluster certificate rollover or management difficult. Multiple certificates, however, can have the same common name or subject.  A cluster using certificate common names makes certificate management much simpler. This article describes how to deploy a Service Fabric cluster to use the certificate common name instead of the certificate thumbprint.
 
## Get a certificate
First, get a certificate from a [certificate authority (CA)](https://wikipedia.org/wiki/Certificate_authority).  The common name of the certificate should be the host name of the cluster.  For example, "myclustername.southcentralus.cloudapp.azure.com".  

For testing purposes, you could get a CA signed certificate from a free or open certificate authority.

> [!NOTE]
> Self-signed certificates, including those generated when deploying a Service Fabric cluster in the Azure portal, are not supported.

## Upload the certificate to a key vault
In Azure, a Service Fabric cluster is deployed on a virtual machine scale set.  Upload the certificate to a key vault.  When the cluster deploys, the certificate installs on the virtual machine scale set that the cluster is running on.

```powershell
Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser -Force

$SubscriptionId  =  "<subscription ID>"

# Sign in to your Azure account and select your subscription
Login-AzureRmAccount -SubscriptionId $SubscriptionId

$region = "southcentralus"
$KeyVaultResourceGroupName  = "mykeyvaultgroup"
$VaultName = "mykeyvault"
$certFilename = "C:\users\sfuser\myclustercert.pfx"
$certname = "myclustercert"
$Password  = "P@ssw0rd!123"

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
```

## Download and update a sample template
This article uses the [5-node secure cluster example](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/5-VM-Windows-1-NodeTypes-Secure) template and template parameters. Download the *azuredeploy.json* and *azuredeploy.parameters.json* files to your computer.

### Update parameters file
First, open the *azuredeploy.parameters.json* file in a text editor and add the following parameter value:
```json
"certificateCommonName": {
    "value": "myclustername.southcentralus.cloudapp.azure.com"
},
```

Next, set the *certificateCommonName*, *sourceVaultValue*, and *certificateUrlValue* parameter values to those returned by the preceding script:
```json
"certificateCommonName": {
    "value": "myclustername.southcentralus.cloudapp.azure.com"
},
"sourceVaultValue": {
  "value": "/subscriptions/<subscription>/resourceGroups/testvaultgroup/providers/Microsoft.KeyVault/vaults/testvault"
},
"certificateUrlValue": {
  "value": "https://testvault.vault.azure.net:443/secrets/testcert/5c882b7192224447bbaecd5a46962655"
},
```

### Update the template file
Next, open the *azuredeploy.json* file in a text editor and make three updates to support certificate common name.

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

2. Set the value of the *sfrpApiVersion* variable to "2018-02-01":
    ```json
    "sfrpApiVersion": "2018-02-01",
    ```

3. In the **Microsoft.Compute/virtualMachineScaleSets** resource, update the virtual machine extension to use the common name in certificate settings instead of the thumbprint.  In **virtualMachineProfile**->**extensionProfile**->**extensions**->**properties**->**settings**->**certificate**, add 
    ```json
       "commonNames": [
        "[parameters('certificateCommonName')]"
       ],
    ```

    and remove `"thumbprint": "[parameters('certificateThumbprint')]",`.

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
                  "commonNames": [
                     "[parameters('certificateCommonName')]"
                  ],
                  "x509StoreName": "[parameters('certificateStoreValue')]"
                }
              },
              "typeHandlerVersion": "1.0"
            }
          },
    ```

4.  In the **Microsoft.ServiceFabric/clusters** resource, update the API version to "2018-02-01".  Also add a **certificateCommonNames** setting with a **commonNames** property and remove the **certificate** setting (with the thumbprint property) as in the following example:
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
# Variables.
$groupname = "testclustergroup"
$clusterloc="southcentralus"  
$id="<subscription ID"

# Sign in to your Azure account and select your subscription
Login-AzureRmAccount -SubscriptionId $id 

# Create a new resource group and deploy the cluster.
New-AzureRmResourceGroup -Name $groupname -Location $clusterloc

New-AzureRmResourceGroupDeployment -ResourceGroupName $groupname -TemplateParameterFile "C:\temp\cluster\AzureDeploy.Parameters.json" -TemplateFile "C:\temp\cluster\AzureDeploy.json" -Verbose
```

## Next steps
* Learn about [cluster security](service-fabric-cluster-security.md).
* Learn how to [rollover a cluster certificate](service-fabric-cluster-rollover-cert-cn.md)
* [Update and Manage cluster certificates](service-fabric-cluster-security-update-certs-azure.md)
* Simplify Certificate Management by [Changing cluster from certificate thumbprint to common name](service-fabric-cluster-change-cert-thumbprint-to-cn.md)

[image1]: .\media\service-fabric-cluster-change-cert-thumbprint-to-cn\PortalViewTemplates.png
