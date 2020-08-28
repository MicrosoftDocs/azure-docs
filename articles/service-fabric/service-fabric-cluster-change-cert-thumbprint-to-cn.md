---
title: Update a cluster to use certificate common name 
description: Learn how to switch a Service Fabric cluster from using certificate thumbprints to using certificate common name.

ms.topic: conceptual
ms.date: 09/06/2019
---
# Change cluster from certificate thumbprint to common name
No two certificates can have the same thumbprint, which makes cluster certificate rollover or management difficult. Multiple certificates, however, can have the same common name or subject.  Switching a deployed cluster from using certificate thumbprints to using certificate common names makes certificate management much simpler. This article describes how to update a running Service Fabric cluster to use the certificate common name instead of the certificate thumbprint.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Get a certificate
First, get a certificate from a [certificate authority (CA)](https://wikipedia.org/wiki/Certificate_authority).  The common name of the certificate should be for the custom domain you own, and bought from a domain registrar. For example, "azureservicefabricbestpractices.com"; those whom are not Microsoft employees cannot provision certs for MS domains, so you cannot use the DNS names of your LB or Traffic Manager as common names for your certificate, and you will need to provision a [Azure DNS Zone](../dns/dns-delegate-domain-azure-dns.md) if your custom domain to be resolvable in Azure. You will also want to declare your custom domain you own as your cluster's "managementEndpoint" if you want portal to reflect the custom domain alias for your cluster.

For testing purposes, you could get a CA signed certificate from a free or open certificate authority.

> [!NOTE]
> Self-signed certificates, including those generated when deploying a Service Fabric cluster in the Azure portal, are not supported. 

## Upload the certificate and install it in the scale set
In Azure, a Service Fabric cluster is deployed on a virtual machine scale set.  Upload the certificate to a key vault and then install it on the virtual machine scale set that the cluster is running on. The below script can be bypassed for a certificate already in Key Vault by [updating the ARM definition of the virtual machine scale set](../virtual-machine-scale-sets/virtual-machine-scale-sets-faq.md#how-do-i-securely-ship-a-certificate-to-the-vm).

```powershell
Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser -Force

$SubscriptionId  =  "<subscription ID>"

# Sign in to your Azure account and select your subscription
Login-AzAccount -SubscriptionId $SubscriptionId

$region = "southcentralus"
$KeyVaultResourceGroupName  = "mykeyvaultgroup"
$VaultName = "mykeyvault"
$certFilename = "C:\users\sfuser\myclustercert.pfx"
$certname = "myclustercert"
$Password  = "P@ssw0rd!123"
$VmssResourceGroupName     = "myclustergroup"
$VmssName                  = "prnninnxj"

# Create new Resource Group 
New-AzResourceGroup -Name $KeyVaultResourceGroupName -Location $region

# Create the new key vault
$newKeyVault = New-AzKeyVault -VaultName $VaultName -ResourceGroupName $KeyVaultResourceGroupName `
    -Location $region -EnabledForDeployment 
$resourceId = $newKeyVault.ResourceId 

# Add the certificate to the key vault.
$PasswordSec = ConvertTo-SecureString -String $Password -AsPlainText -Force
$KVSecret = Import-AzKeyVaultCertificate -VaultName $vaultName -Name $certName `
    -FilePath $certFilename -Password $PasswordSec

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

$certConfig = New-AzVmssVaultCertificateConfig -CertificateUrl $CertificateURL -CertificateStore "My"

# Get current VM scale set 
$vmss = Get-AzVmss -ResourceGroupName $VmssResourceGroupName -VMScaleSetName $VmssName

# Add new secret to the VM scale set.
$vmss = Add-AzVmssSecret -VirtualMachineScaleSet $vmss -SourceVaultId $SourceVault `
    -VaultCertificate $certConfig

# Update the VM scale set 
Update-AzVmss -ResourceGroupName $VmssResourceGroupName -Verbose `
    -Name $VmssName -VirtualMachineScaleSet $vmss 
```

>[!NOTE]
> Scale set secrets do not support the same resource ID for two separate secrets, as each secret is a versioned, unique resource. 

## Bring cluster to a valid starting state
An upgrade from thumbprint-based certificate declaration to common-name based certificate declaration represents a change in both how nodes in the cluster choose which certificate to present to each other, and how they validate those certificates. Review the [presentation and validation rules for both configurations](cluster-security-certificates.md#certificate-configuration-rules) before proceeding. A misconfigured upgrade can cause a partition in the cluster. For instructions on how to carry out any of the upgrades described below, please see [this document](service-fabric-cluster-security-update-certs-azure.md).

There are multiple valid starting states before the conversion, but the important similarity is that the cluster is already using the goal-state certificate, as declared by thumbprint, before the upgrade begins. We consider `GoalCert`, `OldCert1`, `OldCert2`:

#### Valid States
- `Thumbprint: GoalCert, ThumbprintSecondary: None`
- `Thumbprint: GoalCert, ThumbprintSecondary: OldCert1`, where `GoalCert` has a later `NotAfter` date than `OldCert1`
- `Thumbprint: OldCert1, ThumbprintSecondary: GoalCert`, where `GoalCert` has a later `NotAfter` date than `OldCert1`

#### Invalid States
- `Thumbprint: OldCert1, ThumbprintSecondary: None`
  - If `GoalCert` has a later `NotAfter` date than `OldCert1`, upgrade to `Thumbprint: OldCert1, ThumbprintSecondary: GoalCert`
  - Otherwise upgrade to `Thumbprint: GoalCert, ThumbprintSecondary: OldCert1`, then to `Thumbprint: GoalCert, ThumbprintSecondary: None`

- `Thumbprint: OldCert1, ThumbprintSecondary: GoalCert`, where `OldCert1` has a later `NotAfter` date than `GoalCert`
  - Upgrade to `Thumbprint: GoalCert, ThumbprintSecondary: None`

- `Thumbprint: GoalCert, ThumbprintSecondary: OldCert1`, where `OldCert1` has a later `NotAfter` date than `GoalCert`
  - Upgrade to `Thumbprint: GoalCert, ThumbprintSecondary: None`

- `Thumbprint: OldCert1, ThumbprintSecondary: OldCert2`
  - Remove one of `OldCert1` or `OldCert2` to get to state `Thumbprint: OldCertx, ThumbprintSecondary: None`, then proceed as described above

## Decide between Common-name validation or Common-name validation with Issuer Pinning
The difference is described [here](cluster-security-certificates.md#common-name-based-certificate-validation-declarations) and determines whether to populate the parameter `certificateIssuerThumbprintList` below, or leave it empty.

## Download and update the template from the portal
The certificate has been installed on the underlying scale set, but you also need to update the Service Fabric cluster to use that certificate and its common name.  Now, download the template for your cluster deployment.  Sign in to the [Azure portal](https://portal.azure.com) and navigate to the resource group hosting the cluster.  In **Settings**, select **Deployments**.  Select the most recent deployment and click **View template**.

![View templates][image1]

Download the template and parameters JSON files to your local computer.

First, open the parameters file in a text editor and add the following parameter value:
```json
"certificateCommonName": {
    "value": "myclustername.southcentralus.cloudapp.azure.com"
},
"certificateIssuerThumbprintList": {
    "value": ""
},
```

Next, open the template file in a text editor and make three updates to support certificate common name.

1. In the **parameters** section, add a *certificateCommonName* parameter:
    ```json
    "certificateCommonName": {
        "type": "string",
        "metadata": {
            "description": "Certificate Commonname"
        }
    },
    "certificateIssuerThumbprintList": {
        "type": "string",
        "metadata": {
            "description": "A comma-delimited list that includes the direct issuer of the cert, and all other trusted possible direct issuers of the cluster cert"
        }
    },
    ```

Also consider removing the *certificateThumbprint*, it may no longer be referenced in the Resource Manager template.

2. In the **Microsoft.Compute/virtualMachineScaleSets** resource, update the virtual machine extension to use the common name in certificate settings instead of the thumbprint.  In **virtualMachineProfile**->**extensionProfile**->**extensions**->**properties**->**settings**->**certificate**, add `"commonNames": ["[parameters('certificateCommonName')]"],` and remove `"thumbprint": "[parameters('certificateThumbprint')]",`.
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

3.  In the **Microsoft.ServiceFabric/clusters** resource, update the API version to "2018-02-01".  Also add a **certificateCommonNames** setting with a **commonNames** property and remove the **certificate** setting (with the thumbprint property) as in the following example:
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
                        "certificateIssuerThumbprint": "[parameters('certificateIssuerThumbprintList')]"
                    }
                ],
                "x509StoreName": "[parameters('certificateStoreValue')]"
            },
        ...
    ```

For additional information, see [Deploy a Service Fabric cluster that uses certificate common name instead of thumbprint.](./service-fabric-create-cluster-using-cert-cn.md)

## Deploy the updated template
Redeploy the updated template after making the changes.

```powershell
$groupname = "sfclustertutorialgroup"

New-AzResourceGroupDeployment -ResourceGroupName $groupname -Verbose `
    -TemplateParameterFile "C:\temp\cluster\parameters.json" -TemplateFile "C:\temp\cluster\template.json" 
```

## Next steps
* Learn about [cluster security](service-fabric-cluster-security.md).
* Learn how to [rollover a cluster certificate by common name](service-fabric-cluster-rollover-cert-cn.md)
* Learn how to [configure a cluster for touchless autorollover](cluster-security-certificate-management.md)

[image1]: ./media/service-fabric-cluster-change-cert-thumbprint-to-cn/PortalViewTemplates.png
