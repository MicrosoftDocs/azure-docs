---
title: Create an Azure Service Fabric cluster 
description: Learn how to set up a secure Service Fabric cluster in Azure using Azure Resource Manager.  You can create a cluster using a default template or using your own cluster template.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
ms.custom: devx-track-azurecli, devx-track-azurepowershell, devx-track-arm-template
services: service-fabric
ms.date: 07/14/2022
---

# Create a Service Fabric cluster using Azure Resource Manager 
> [!div class="op_single_selector"]
> * [Azure Resource Manager](service-fabric-cluster-creation-via-arm.md)
> * [Azure portal](service-fabric-cluster-creation-via-portal.md)
>
>

An [Azure Service Fabric cluster](service-fabric-deploy-anywhere.md) is a network-connected set of virtual machines into which your microservices are deployed and managed.  A Service Fabric cluster running in Azure is an Azure resource and is deployed using the Azure Resource Manager. This article describes how to deploy a secure Service Fabric cluster in Azure using the Resource Manager. You can use a default cluster template or a custom template.  If you don't already have a custom template, you can [learn how to create one](service-fabric-cluster-creation-create-template.md).

The type of security chosen to secure the cluster (i.e.: Windows identity, X509 etc.) must be specified for the initial creation of the cluster, and cannot be changed thereafter. Before setting up a cluster, read [Service Fabric cluster security scenarios][service-fabric-cluster-security]. In Azure, Service Fabric uses x509 certificate to secure your cluster and its endpoints, authenticate clients, and encrypt data. Azure Active Directory is also recommended to secure access to management endpoints. For more information, read [Set up Azure AD to authenticate clients](service-fabric-cluster-creation-setup-aad.md).

If you are creating a production cluster to run production workloads, we recommend you first read through the [production readiness checklist](service-fabric-production-readiness-checklist.md).


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Prerequisites 
In this article, use the Service Fabric RM PowerShell or Azure CLI modules to deploy a cluster:

* [Azure PowerShell 4.1 and above][azure-powershell]
* [Azure CLI version 2.0 and above][azure-CLI]

You can find the reference documentation for the Service Fabric modules here:
* [Az.ServiceFabric](/powershell/module/az.servicefabric)
* [az SF CLI module](/cli/azure/sf)

### Sign in to Azure

Before running any of the commands in this article, first sign in to Azure.

```powershell
Connect-AzAccount
Set-AzContext -SubscriptionId <subscriptionId>
```

```azurecli
az login
az account set --subscription $subscriptionId
```

## Create a new cluster using a system generated self-signed certificate

Use the following commands to create a cluster secured with a system generated self-signed certificate. This command sets up a primary cluster certificate that is used for cluster security and to set up admin access to perform management operations using that certificate.  Self-signed certificates are useful for securing test clusters.  Production clusters should be secured with a certificate from a certificate authority (CA).

### Use the default cluster template that ships in the module

You can use either the following PowerShell or Azure CLI commands to create a cluster quickly using the default template.

The default template used is available here for [Windows](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/5-VM-Windows-1-NodeTypes-Secure-NSG)
 and here for [Ubuntu](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/5-VM-Ubuntu-1-NodeTypes-Secure).

The following commands can create either Windows or Linux clusters, depending on how you specify the OS parameter. Both PowerShell/CLI commands output the certificate in the specified *CertificateOutputFolder* (make sure the certificate folder location you specify already exists before running the command!).

> [!NOTE]
> The following PowerShell command only works with the Azure PowerShell `Az` module. To check the current version of Azure Resource Manager PowerShell version, run the following PowerShell command "Get-Module Az". Follow [this link](/powershell/azure/install-azure-powershell) to upgrade your Azure Resource Manager PowerShell version.

Deploy the cluster using PowerShell:

```powershell
$resourceGroupLocation="westus"
$resourceGroupName="mycluster"
$vaultName="myvault"
$vaultResourceGroupName="myvaultrg"
$CertSubjectName="mycluster.westus.cloudapp.azure.com"
$certPassword="Password123!@#" | ConvertTo-SecureString -AsPlainText -Force 
$vmpassword="Password4321!@#" | ConvertTo-SecureString -AsPlainText -Force
$vmuser="myadmin"
$os="WindowsServer2016DatacenterwithContainers"
$certOutputFolder="c:\certificates"

New-AzServiceFabricCluster -ResourceGroupName $resourceGroupName -Location $resourceGroupLocation -CertificateOutputFolder $certOutputFolder -CertificatePassword $certpassword -CertificateSubjectName $CertSubjectName -OS $os -VmPassword $vmpassword -VmUserName $vmuser
```

Deploy the cluster using Azure CLI:

```azurecli
declare resourceGroupLocation="westus"
declare resourceGroupName="mylinux"
declare vaultResourceGroupName="myvaultrg"
declare vaultName="myvault"
declare CertSubjectName="mylinux.westus.cloudapp.azure.com"
declare vmpassword="Password!1"
declare certpassword="Password!4321"
declare vmuser="myadmin"
declare vmOs="UbuntuServer1804"
declare certOutputFolder="c:\certificates"

az sf cluster create --resource-group $resourceGroupName --location $resourceGroupLocation  \
	--certificate-output-folder $certOutputFolder --certificate-password $certpassword  \
	--vault-name $vaultName --vault-resource-group $resourceGroupName  \
	--template-file $templateFilePath --parameter-file $parametersFilePath --vm-os $vmOs  \
	--vm-password $vmpassword --vm-user-name $vmuser
```

### Use your own custom template

If you need to author a custom template to suit your needs, it is highly recommended that you start with one of the templates that are available on the [Azure Service Fabric template samples](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master). Learn how to [customize your cluster template][customize-your-cluster-template].

If you already have a custom template, double-check that all the three certificate related parameters in the template and the parameter file are named as follows and values are null as follows:

```json
   "certificateThumbprint": {
      "value": ""
    },
    "sourceVaultValue": {
      "value": ""
    },
    "certificateUrlValue": {
      "value": ""
    },
```

Deploy the cluster using PowerShell:

```powershell
$resourceGroupLocation="westus"
$resourceGroupName="mycluster"
$CertSubjectName="mycluster.westus.cloudapp.azure.com"
$certPassword="Password!1" | ConvertTo-SecureString -AsPlainText -Force 
$certOutputFolder="c:\certificates"

$parameterFilePath="c:\mytemplates\mytemplateparm.json"
$templateFilePath="c:\mytemplates\mytemplate.json"

New-AzServiceFabricCluster -ResourceGroupName $resourceGroupName -CertificateOutputFolder $certOutputFolder -CertificatePassword $certpassword -CertificateSubjectName $CertSubjectName -TemplateFile $templateFilePath -ParameterFile $parameterFilePath 
```

Deploy the cluster using Azure CLI:

```azurecli
declare certPassword=""
declare resourceGroupLocation="westus"
declare resourceGroupName="mylinux"
declare certSubjectName="mylinuxsecure.westus.cloudapp.azure.com"
declare parameterFilePath="c:\mytemplates\linuxtemplateparm.json"
declare templateFilePath="c:\mytemplates\linuxtemplate.json"
declare certOutputFolder="c:\certificates"

az sf cluster create --resource-group $resourceGroupName --location $resourceGroupLocation  \
	--certificate-output-folder $certOutputFolder --certificate-password $certPassword  \
	--certificate-subject-name $certSubjectName \
	--template-file $templateFilePath --parameter-file $parametersFilePath
```

## Create a new cluster using your own X.509 certificate

You can use the following command to specify an existing certificate to create and secure a new cluster with.

If this is a CA signed certificate that you will end up using for other purposes as well, then it is recommended that you provide a distinct resource group specifically for your key vault. We recommend that you put the key vault into its own resource group. This action lets you remove the compute and storage resource groups, including the resource group that contains your Service Fabric cluster, without losing your keys and secrets. **The resource group that contains your key vault *must be in the same region* as the cluster that is using it.**

### Use the default five nodes, one node type template that ships in the module

The default template used is available here for [Windows](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/5-VM-Windows-1-NodeTypes-Secure-NSG)
 and here for [Ubuntu](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/5-VM-Ubuntu-1-NodeTypes-Secure).

Deploy the cluster using PowerShell:

```powershell
$resourceGroupLocation="westus"
$resourceGroupName="mycluster"
$vaultName="myvault"
$vaultResourceGroupName="myvaultrg"
$certPassword="Password!1" | ConvertTo-SecureString -AsPlainText -Force 
$vmpassword=("Password!4321" | ConvertTo-SecureString -AsPlainText -Force) 
$vmuser="myadmin"
$os="WindowsServer2016DatacenterwithContainers"

New-AzServiceFabricCluster -ResourceGroupName $resourceGroupName -Location $resourceGroupLocation -KeyVaultResourceGroupName $vaultResourceGroupName -KeyVaultName $vaultName -CertificateFile C:\MyCertificates\chackocertificate3.pfx -CertificatePassword $certPassword -OS $os -VmPassword $vmpassword -VmUserName $vmuser 
```

Deploy the cluster using Azure CLI:

```azurecli
declare vmPassword="Password!1"
declare certPassword="Password!1"
declare vmUser="myadmin"
declare resourceGroupLocation="westus"
declare resourceGroupName="mylinux"
declare vaultResourceGroupName="myvaultrg"
declare vaultName="myvault"
declare certificate-file="c:\certificates\mycert.pem"
declare vmOs="UbuntuServer1804"

az sf cluster create --resource-group $resourceGroupName --location $resourceGroupLocation  \
	--certificate-file $certificate-file --certificate-password $certPassword  \
	--vault-name $vaultName --vault-resource-group $vaultResourceGroupName  \
    --vm-os vmOs \
	--vm-password $vmPassword --vm-user-name $vmUser
```

### Use your own custom cluster template
If you need to author a custom template to suit your needs, it is highly recommended that you start with one of the templates that are available on the [Azure Service Fabric template samples](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master). Learn how to [customize your cluster template][customize-your-cluster-template].

If you already have a custom template, then make sure to double check that all the three certificate related parameters in the template and the parameter file are named as follows and values are null as follows.

```json
   "certificateThumbprint": {
      "value": ""
    },
    "sourceVaultValue": {
      "value": ""
    },
    "certificateUrlValue": {
      "value": ""
    },
```

Deploy the cluster using PowerShell:

```powershell
$resourceGroupLocation="westus"
$resourceGroupName="mycluster"
$vaultName="myvault"
$vaultResourceGroupName="myvaultrg"
$certPassword="Password!1" | ConvertTo-SecureString -AsPlainText -Force 
$os="WindowsServer2016DatacenterwithContainers"
$parameterFilePath="c:\mytemplates\mytemplateparm.json"
$templateFilePath="c:\mytemplates\mytemplate.json"
$certificateFile="C:\MyCertificates\chackonewcertificate3.pem"

New-AzServiceFabricCluster -ResourceGroupName $resourceGroupName -Location $resourceGroupLocation -TemplateFile $templateFilePath -ParameterFile $parameterFilePath -KeyVaultResourceGroupName $vaultResourceGroupName -KeyVaultName $vaultName -CertificateFile $certificateFile -CertificatePassword $certPassword
```

Deploy the cluster using Azure CLI:

```azurecli
declare certPassword="Password!1"
declare resourceGroupLocation="westus"
declare resourceGroupName="mylinux"
declare vaultResourceGroupName="myvaultrg"
declare vaultName="myvault"
declare parameterFilePath="c:\mytemplates\linuxtemplateparm.json"
declare templateFilePath="c:\mytemplates\linuxtemplate.json"

az sf cluster create --resource-group $resourceGroupName --location $resourceGroupLocation  \
	--certificate-file $certificate-file --certificate-password $password  \
	--vault-name $vaultName --vault-resource-group $vaultResourceGroupName  \
	--template-file $templateFilePath --parameter-file $parametersFilePath 
```

### Use a pointer to a secret uploaded into a key vault

To use an existing key vault, the key vault must be [enabled for deployment](../key-vault/general/manage-with-cli2.md#setting-key-vault-advanced-access-policies) to allow the compute resource provider to get certificates from it and install it on cluster nodes.

Deploy the cluster using PowerShell:

```powershell
Set-AzKeyVaultAccessPolicy -VaultName 'ContosoKeyVault' -EnabledForDeployment

$parameterFilePath="c:\mytemplates\mytemplate.json"
$templateFilePath="c:\mytemplates\mytemplateparm.json"
$secretID="https://test1.vault.azure.net:443/secrets/testcertificate4/55ec7c4dc61a462bbc645ffc9b4b225f"

New-AzServiceFabricCluster -ResourceGroupName $resourceGroupName -SecretIdentifier $secretID -TemplateFile $templateFilePath -ParameterFile $parameterFilePath 
```

Deploy the cluster using Azure CLI:

```azurecli
declare $resourceGroupName = "testRG"
declare $parameterFilePath="c:\mytemplates\mytemplate.json"
declare $templateFilePath="c:\mytemplates\mytemplateparm.json"
declare $secretID="https://test1.vault.azure.net:443/secrets/testcertificate4/55ec7c4dc61a462bbc645ffc9b4b225f"

az sf cluster create --resource-group $resourceGroupName --location $resourceGroupLocation  \
	--secret-identifier $secretID  \
	--template-file $templateFilePath --parameter-file $parameterFilePath 
```

## Next steps
At this point, you have a secure cluster running in Azure. Next, [connect to your cluster](service-fabric-connect-to-secure-cluster.md) and learn how to [manage application secrets](service-fabric-application-secret-management.md).

For the JSON syntax and properties to use a template, see [Microsoft.ServiceFabric/clusters template reference](/azure/templates/microsoft.servicefabric/clusters).

<!-- Links -->
[azure-powershell]:/powershell/azure/install-Az-ps
[azure-CLI]:/cli/azure/get-started-with-azure-cli
[service-fabric-cluster-security]: service-fabric-cluster-security.md
[customize-your-cluster-template]: service-fabric-cluster-creation-create-template.md
