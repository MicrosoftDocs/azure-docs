---
title: Add certificate to Keyvault | Microsoft Docs
description: This article describes how to set up a keyvault and upload your certificate to it. The certificate can then be used to set secure Service Fabric cluster in Azure or for use in your applications running in azure.
services: service-fabric
documentationcenter: .net
author: chackdan
manager: timlt
editor: chackdan
ms.assetid: 
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 06/23/2017
ms.author: chackdan

---
# Set up a Key Vault and upload your certificate to it using Azure Resource Manager

This step-by-step guide walks you through setting up a key vault and uploading an x509 certificate to it, such that it can be used for setting up  a secure Service Fabric Cluster. You follow the same steps for uploading additional certificates to the same keyvault, that you may need to roll over old certificates in your cluster.

##Prerequisites
 
You need to have [azure powershell 4.1.0][azure-powershell4.1.0] or higher installed.

## Sign in to your Azure account
Start a new PowerShell session, sign in to your Azure account and select your subscription before you execute Azure commands.

Sign in to your Azure account:

```powershell
Login-AzureRmAccount
```

Select your subscription:

```powershell
Get-AzureRmSubscription
Select-AzureRmSubscription -SubscriptionId <guid>
```

## Set up a key vault
This section discusses creating a key vault for a Service Fabric cluster in Azure and for Service Fabric applications. For a complete guide to Azure Key Vault, refer to the [Key Vault getting started guide][key-vault-get-started].

Service Fabric uses X.509 certificates to secure a cluster and provide application security features. You use Key Vault to manage certificates for Service Fabric clusters in Azure. When a cluster ARM template is deployed, the Azure resource provider that's responsible for creating virtual machine scale sets, pulls certificates from Key Vault and installs them on the VMs. 

The following diagram illustrates the relationship between Azure Key Vault, a Service Fabric cluster, and the Azure resource provider that uses certificates stored in a key vault when it creates a cluster:

![Diagram of certificate installation][cluster-security-cert-installation]

### Create a resource group
The first step is to create a resource group specifically for your key vault. 
We recommend that you put the key vault into its own resource group.  We recommend that you put the key vault into its own resource group. This action lets you keep your keys and secrets, even if you remove the resource group that contains your Service Fabric cluster. The resource group that contains your key vault _must be in the same region_ as the cluster that is using it.

If you plan to deploy clusters in multiple regions, we suggest that you name the resource group and the key vault in a way that indicates which region it belongs to.  

```powershell

    New-AzureRmResourceGroup -Name westus-mykeyvault -Location 'West US'
```
The output should look like this:

```powershell

    WARNING: The output object type of this cmdlet is going to be modified in a future release.

    ResourceGroupName : westus-mykeyvault
    Location          : westus
    ProvisioningState : Succeeded
    Tags              :
    ResourceId        : /subscriptions/<guid>/resourceGroups/westus-mykeyvault

```
<a id="new-key-vault"></a>

### Create a key vault in the new resource group
The key vault _must be enabled for deployment_ to allow the compute resource provider to get certificates from it and install it on virtual machine instances:

```powershell

    New-AzureRmKeyVault -VaultName 'mywestusvault' -ResourceGroupName 'westus-mykeyvault' -Location 'West US' -EnabledForDeployment

```

The output should look like this:

```powershell

    Vault Name                       : mywestusvault
    Resource Group Name              : westus-mykeyvault
    Location                         : West US
    Resource ID                      : /subscriptions/<guid>/resourceGroups/westus-mykeyvault/providers/Microsoft.KeyVault/vaults/mywestusvault
    Vault URI                        : https://mywestusvault.vault.azure.net
    Tenant ID                        : <guid>
    SKU                              : Standard
    Enabled For Deployment?          : False
    Enabled For Template Deployment? : False
    Enabled For Disk Encryption?     : False
    Access Policies                  :
                                       Tenant ID                :    <guid>
                                       Object ID                :    <guid>
                                       Application ID           :
                                       Display Name             :    
                                       Permissions to Keys      :    get, create, delete, list, update, import, backup, restore
                                       Permissions to Secrets   :    all


    Tags                             :
```
<a id="existing-key-vault"></a>

## Use an existing key vault

To use an existing key vault, you _must enable it for deployment_ to allow the compute resource provider to get certificates from it and install it on cluster nodes:

```powershell

Set-AzureRmKeyVaultAccessPolicy -VaultName 'ContosoKeyVault' -EnabledForDeployment

```

<a id="add-certificate-to-key-vault"></a>

## Add certificates to your key vault

Certificates are used in Service Fabric to provide authentication and encryption to secure various aspects of a cluster and its applications. For more information on how certificates are used in Service Fabric, see [Service Fabric cluster security scenarios][service-fabric-cluster-security].

### Cluster and server certificate (required)
This certificate is required to secure a cluster and prevent unauthorized access to it. It provides cluster security in two ways:

* Cluster authentication: Authenticates node-to-node communication for cluster federation. Only nodes that can prove their identity with this certificate can join the cluster.
* Server authentication: Authenticates the cluster management endpoints to a management client, so that the management client knows it is talking to the real cluster. This certificate also provides an SSL for the HTTPS management API and for Service Fabric Explorer over HTTPS.

To serve these purposes, the certificate must meet the following requirements:

* The certificate must contain a private key.
* The certificate must be created for key exchange, which is exportable to a Personal Information Exchange (.pfx) file.
* The certificate's subject name must match the domain that you use to access the Service Fabric cluster. This matching is required to provide an SSL for the cluster's HTTPS management endpoints and Service Fabric Explorer. You cannot obtain an SSL certificate from a certificate authority (CA) for the .cloudapp.azure.com domain. You must obtain a custom domain name for your cluster. When you request a certificate from a CA, the certificate's subject name must match the custom domain name that you use for your cluster.

### Application certificates (optional)
Any number of additional certificates can be installed on a cluster for application security purposes. Before creating your cluster, consider the application security scenarios that require a certificate to be installed on the nodes, such as:

* Encryption and decryption of application configuration values.
* Encryption of data across nodes during replication.

### Formatting certificates for use on clusters running Windows

For instructions on formatting certificates for use on Clusters running Linux, see [Formatting certificates for use on clusters running Windows](#secure-linux-clusters)

You can add and use private key files (.pfx) directly through your key vault. However, the Azure compute resource provider requires keys to be stored in a special JavaScript Object Notation (JSON) format. The format includes the .pfx file as a base 64-encoded string and the private key password. To accommodate these requirements, the keys must be placed in a JSON string and then stored as "secrets" in the key vault.

To make this process easier, a [PowerShell module is available on GitHub][service-fabric-rp-helpers]. To use the module, do the following:

1. Download the entire contents of the repo into a local directory.
2. Go to the local directory.
2. Import the ServiceFabricRPHelpers module in your PowerShell window:

```powershell

 Import-Module "C:\..\ServiceFabricRPHelpers\ServiceFabricRPHelpers.psm1"

```

The `Invoke-AddCertToKeyVault` command in this PowerShell module automatically formats a certificate private key into a JSON string and uploads it to the key vault. Use the command to add the cluster certificate and any additional application certificates to the key vault. Repeat this step for any additional certificates you want to install in your cluster.

#### Uploading an existing certificate

```powershell

 Invoke-AddCertToKeyVault -SubscriptionId <guid> -ResourceGroupName westus-mykeyvault -Location "West US" -VaultName mywestusvault -CertificateName mycert -Password "<password>" -UseExistingCertificate -ExistingPfxFilePath "C:\path\to\mycertkey.pfx"

```

If you get an error, such as the one shown here, it usually means that you have a resource URL conflict. To resolve the conflict, change the key vault name.

```
Set-AzureKeyVaultSecret : The remote name could not be resolved: 'westuskv.vault.azure.net'
At C:\Users\chackdan\Documents\GitHub\Service-Fabric\Scripts\ServiceFabricRPHelpers\ServiceFabricRPHelpers.psm1:440 char:11
+ $secret = Set-AzureKeyVaultSecret -VaultName $VaultName -Name $Certif ...
+           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : CloseError: (:) [Set-AzureKeyVaultSecret], WebException
    + FullyQualifiedErrorId : Microsoft.Azure.Commands.KeyVault.SetAzureKeyVaultSecret

```

After the conflict is resolved, the output should look like this:

```

    Switching context to SubscriptionId <guid>
    Ensuring ResourceGroup westus-mykeyvault in West US
    WARNING: The output object type of this cmdlet is going to be modified in a future release.
    Using existing value mywestusvault in West US
    Reading pfx file from C:\path\to\key.pfx
    Writing secret to mywestusvault in vault mywestusvault


Name  : CertificateThumbprint
Value : E21DBC64B183B5BF355C34C46E03409FEEAEF58D

Name  : SourceVault
Value : /subscriptions/<guid>/resourceGroups/westus-mykeyvault/providers/Microsoft.KeyVault/vaults/mywestusvault

Name  : CertificateURL
Value : https://mywestusvault.vault.azure.net:443/secrets/mycert/4d087088df974e869f1c0978cb100e47

```

>[!NOTE]
>You need the three preceding strings, CertificateThumbprint, SourceVault, and CertificateURL, to set up a secure Service Fabric cluster and to obtain any application certificates that you might be using for application security. If you do not save the strings, it can be difficult to retrieve them by querying the key vault later.

<a id="add-self-signed-certificate-to-key-vault"></a>

#### Creating a self-signed certificate and uploading it to the key vault

If you have already uploaded your certificates to the key vault, skip this step. This step is for generating a new self-signed certificate and uploading it to your key vault. After you change the parameters in the following script and then run it, you should be prompted for a certificate password.  

```powershell

$ResouceGroup = "chackowestuskv"
$VName = "chackokv2"
$SubID = "6c653126-e4ba-42cd-a1dd-f7bf96ae7a47"
$locationRegion = "westus"
$newCertName = "chackotestcertificate1"
$dnsName = "www.mycluster.westus.mydomain.com" #The certificate's subject name must match the domain used to access the Service Fabric cluster.
$localCertPath = "C:\MyCertificates" # location where you want the .PFX to be stored

 Invoke-AddCertToKeyVault -SubscriptionId $SubID -ResourceGroupName $ResouceGroup -Location $locationRegion -VaultName $VName -CertificateName $newCertName -CreateSelfSignedCertificate -DnsName $dnsName -OutputPath $localCertPath

```

If you get an error, such as the one shown here, it usually means that you have a resource URL conflict. To resolve the conflict, change the key vault name, RG name, and so forth.

```
Set-AzureKeyVaultSecret : The remote name could not be resolved: 'westuskv.vault.azure.net'
At C:\Users\chackdan\Documents\GitHub\Service-Fabric\Scripts\ServiceFabricRPHelpers\ServiceFabricRPHelpers.psm1:440 char:11
+ $secret = Set-AzureKeyVaultSecret -VaultName $VaultName -Name $Certif ...
+           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : CloseError: (:) [Set-AzureKeyVaultSecret], WebException
    + FullyQualifiedErrorId : Microsoft.Azure.Commands.KeyVault.SetAzureKeyVaultSecret

```

After the conflict is resolved, the output should look like this:

```
PS C:\Users\chackdan\Documents\GitHub\Service-Fabric\Scripts\ServiceFabricRPHelpers> Invoke-AddCertToKeyVault -SubscriptionId $SubID -ResourceGroupName $ResouceGroup -Location $locationRegion -VaultName $VName -CertificateName $newCertName -Password $certPassword -CreateSelfSignedCertificate -DnsName $dnsName -OutputPath $localCertPath
Switching context to SubscriptionId 6c343126-e4ba-52cd-a1dd-f8bf96ae7a47
Ensuring ResourceGroup chackowestuskv in westus
WARNING: The output object type of this cmdlet will be modified in a future release.
Creating new vault westuskv1 in westus
Creating new self signed certificate at C:\MyCertificates\chackonewcertificate1.pfx
Reading pfx file from C:\MyCertificates\chackonewcertificate1.pfx
Writing secret to chackonewcertificate1 in vault westuskv1


Name  : CertificateThumbprint
Value : 96BB3CC234F9D43C25D4B547sd8DE7B569F413EE

Name  : SourceVault
Value : /subscriptions/6c653126-e4ba-52cd-a1dd-f8bf96ae7a47/resourceGroups/chackowestuskv/providers/Microsoft.KeyVault/vaults/westuskv1

Name  : CertificateURL
Value : https://westuskv1.vault.azure.net:443/secrets/chackonewcertificate1/ee247291e45d405b8c8bbf81782d12bd

```

>[!NOTE]
>You need the three preceding strings, _CertificateThumbprint, SourceVault, and CertificateURL,_ to set up a secure Service Fabric cluster and to obtain any application certificates that you might be using for application security. If you do not save the strings, it can be difficult to retrieve them by querying the key vault later.

 At this point, you should have the following elements in place:

* The key vault resource group.
* The key vault and its URL (called SourceVault in the preceding PowerShell output).
* The cluster server authentication certificate and its URL in the key vault.
* The application certificates and their URLs in the key vault.


## Use the certificate you uploaded to Keyvault to Create or add to your Service Fabric cluster 

You have two options
1. Use the [Portal to deploy your cluster](service-fabric-cluster-creation-via-portal.md)
2. Use the [Azure Resource Manager template to deploy your cluster](service-fabric-cluster-creation-via-arm.md)


 <a name="secure-linux-cluster"></a>

## Formatting certificates for use on clusters running Linux 

You can add and use private key files (.pfx) or (.pem) directly through your key vault. However, the Azure compute resource provider requires keys to be stored in a special JavaScript Object Notation (JSON) format. The format includes the .pfx file as a base 64-encoded string and the private key password. To accommodate these requirements, the keys must be placed in a JSON string and then stored as "secrets" in the key vault.

To make the process easier, we have provided a [helper script](http://github.com/ChackDan/Service-Fabric/tree/master/Scripts/CertUpload4Linux). Before you use this helper script, ensure that you already have [Azure command-line interface (CLI 2.0 or higher)](https://azure.microsoft.com/downloads/) installed, and it is in your path. Make sure that the script has permissions to execute by running `chmod +x cert_helper.py` after downloading it. 


## Sign in to your Azure account using Azure  CLI 
Start a new session, sign in to your Azure account and select your subscription before you execute Azure commands.

Sign in to your Azure account:

```Azure CLI
az login
```

Select your subscription:

```Azure CLI
az account list [--all]
az account set --subscription
```

## Set up a key vault and uploading a certificate to it.
This section discusses creating a key vault for a Service Fabric cluster in Azure and for Service Fabric applications. For a complete guide to Azure Key Vault, refer to the [Key Vault getting started guide][key-vault-get-started].

Service Fabric uses X.509 certificates to secure a cluster and provide application security features. You use Key Vault to manage certificates for Service Fabric clusters in Azure. When a cluster Azure Resource Manager template is deployed, the Azure resource provider that's responsible for creating virtual machine scale sets, pulls certificates from Key Vault and installs them on the VMs. 

The following diagram illustrates the relationship between Azure Key Vault, a Service Fabric cluster, and the Azure resource provider that uses certificates stored in a key vault when it creates a cluster:

![Diagram of certificate installation][cluster-security-cert-installation]

### Create a resource group for the key vault
The first step is to create a resource group specifically for your key vault. We recommend that you put the key vault into its own resource group. This action lets you keep your keys and secrets, even if you remove the resource group that contains your Service Fabric cluster. The resource group that contains your key vault _must be in the same region_ as the cluster that is using it.

If you plan to deploy clusters in multiple regions, we suggest that you name the resource group and the key vault in a way that indicates which region it belongs to.  

To use an existing key vault, you _must enable it for deployment_ to allow the compute resource provider to get certificates from it and install it on cluster nodes

#### Uploading the certificate that you already have 
 
Use the helper script to create (or use an existing) Resource group and upload your CA signed certificate to the keyvault (new or existing).

The certificate's subject name must match the domain that you use to access the Service Fabric cluster. This match is required to provide an SSL for the cluster's HTTPS management endpoints and Service Fabric Explorer. You cannot obtain an SSL certificate from a CA for the `.cloudapp.azure.com` domain. You must obtain a custom domain name for your cluster. When you request a certificate from a CA, the certificate's subject name must match the custom domain name that you use for your cluster.

We recommend that you put the key vault into its own resource group. This action lets you keep your keys and secrets, even if you remove the resource group that contains your Service Fabric cluster. The resource group that contains your key vault _must be in the same region_ as the cluster that is using it.

If you plan to deploy clusters in multiple regions, we suggest that you name the resource group and the key vault in a way that indicates which region it belongs to.  The script below creates a new Resource group, if it does not exist.

```sh
./cert_helper.py [-h] CERT_TYPE [-ifile INPUT_CERT_FILE] [-sub SUBSCRIPTION_ID] [-rgname RESOURCE_GROUP_NAME] [-kv KEY_VAULT_NAME] [-sname CERTIFICATE_NAME] [-l LOCATION] [-p PASSWORD]
```

The -ifile parameter can take a .pfx file or a .pem file as input, with the certificate type (pfx or pem, or ss if it is a self-signed certificate).
The parameter -h prints out the help text.


This command returns the following three strings as the output:

* SourceVaultID, which is the ID for the new KeyVault ResourceGroup it created for you
* CertificateUrl for accessing the certificate
* CertificateThumbprint, which is used for authentication

The following example shows how to use the command:

```sh
./cert_helper.py pfx -sub "fffffff-ffff-ffff-ffff-ffffffffffff"  -rgname "mykvrg" -kv "mykevname" -ifile "/home/test/cert.pfx" -sname "mycert" -l "East US" -p "pfxtest"
```
Executing the preceding command gives you the three strings as follows:

```sh
SourceVault: /subscriptions/fffffff-ffff-ffff-ffff-ffffffffffff/resourceGroups/mykvrg/providers/Microsoft.KeyVault/vaults/mykvname
CertificateUrl: https://myvault.vault.azure.net/secrets/mycert/00000000000000000000000000000000
CertificateThumbprint: 0xfffffffffffffffffffffffffffffffffffffffff
```

>[!NOTE]
>You need the three preceding strings, CertificateThumbprint, SourceVault, and CertificateURL, to set up a secure Service Fabric cluster and to obtain any application certificates that you might be using for application security. If you do not save the strings, it can be difficult to retrieve them by querying the key vault later.

 At this point, you should have the following elements in place:

* The key vault resource group.
* The key vault and its URL (called SourceVault in the preceding output).
* The cluster server authentication certificate and its URL in the key vault.
* The application certificates and their URLs in the key vault.

#### Creating and Uploading a self-signed certificate  

If you want to use a self-signed certificate for testing, you can use the same script to generate one. You can then upload the certificate to your key vault by providing the flag `ss` instead of providing the certificate path and certificate name. Here is the command for creating and uploading a self-signed certificate:

The certificate's subject name must match the domain that you use to access the Service Fabric cluster. This match is required to provide an SSL for the cluster's HTTPS management endpoints and Service Fabric Explorer. 

```sh
./cert_helper.py ss -rgname "mykvrg" -sub "fffffff-ffff-ffff-ffff-ffffffffffff" -kv "mykevname"   -sname "mycert" -l "East US" -p "selftest" -subj "mytest.eastus.cloudapp.net"
```

This command returns the following three strings as the output:

* SourceVaultID, which is the ID for the new KeyVault ResourceGroup it created for you
* CertificateUrl for accessing the certificate
* CertificateThumbprint, which is used for authentication

>[!NOTE]
>You need the three preceding strings, CertificateThumbprint, SourceVault, and CertificateURL, to set up a secure Service Fabric cluster and to obtain any application certificates that you might be using for application security. If you do not save the strings, it can be difficult to retrieve them by querying the key vault later.

 At this point, you should have the following elements in place:

* The key vault resource group.
* The key vault and its URL (called SourceVault in the preceding output).
* The cluster server authentication certificate and its URL in the key vault.
* The application certificates and their URLs in the key vault.


## Next steps
Use the certificate you uploaded to Keyvault to Create or add to your Service Fabric cluster 

You have two options
1. Use the [Portal to deploy your secure Service Fabric cluster](service-fabric-cluster-creation-via-portal.md)
2. Use the [Azure Resource Manager template to deploy your secure Service Fabric cluster](service-fabric-cluster-creation-via-arm.md)

<!-- Links -->
[azure-powershell]:https://azure.microsoft.com/documentation/articles/powershell-install-configure/
[azure-powershell4.1.0]:https://azure.microsoft.com/downloads/ 
[key-vault-get-started]:../key-vault/key-vault-get-started.md
[service-fabric-rp-helpers]: https://github.com/ChackDan/Service-Fabric/tree/master/Scripts/ServiceFabricRPHelpers
[service-fabric-cluster-security]: service-fabric-cluster-security.md


<!-- Images -->
[cluster-security-arm-dependency-map]: ./media/service-fabric-cluster-creation-via-arm/cluster-security-arm-dependency-map.png

