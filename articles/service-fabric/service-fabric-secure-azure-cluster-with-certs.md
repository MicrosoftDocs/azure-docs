<properties
   pageTitle="Secure a Service Fabric cluster with certificates | Microsoft Azure"
   description="How to secure a Service Fabric cluster using X.509 certificates."
   services="service-fabric"
   documentationCenter=".net"
   authors="ChackDan"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/27/2016"
   ms.author="chackdan"/>

# Secure a Service Fabric cluster on Azure using certificates

An Azure Service Fabric cluster is a resource that you own. To prevent unauthorized access to the resource you must secure it, especially when it has production workloads running on it. To set up a secure Service Fabric cluster using X.509 certificates, you need at least one server X.509 certificate which you upload to Azure Key Vault and use in the cluster creation process.

This article corresponds to [Step 3: Configure security](service-fabric-cluster-creation-via-portal.md#step-3--configure-security) of the cluster creation process. For more information on how Service Fabric uses X.509 certificates, see [Cluster security scenarios](service-fabric-cluster-security.md).

There are three distinct steps:

1. Acquire the X.509 certificate.
2. Upload the certificate to Azure Key Vault.
3. Provide the location and details of the certificate to the Service Fabric cluster creation process.

<a id="acquirecerts"></a>
## Step 1: Acquire the X.509 certificate(s)

For clusters that are running production workloads, you must use a [Certificate Authority (CA)](https://en.wikipedia.org/wiki/Certificate_authority) signed X.509 certificate to secure the cluster. For details on obtaining these certificates, go to [How to: Obtain a Certificate](http://msdn.microsoft.com/library/aa702761.aspx).

For clusters that you use for test purposes only, you can choose to use a self-signed certificate. Step 2.5 below explains how to do that.

## Step 2 : Upload the X.509 certificate to the Key Vault

This is an involved process, so we have a PowerShell module uploaded to a Git repository that does this for you.

### Step 2.1
Make sure that Azure PowerShell 1.0+ is installed on your machine. If you have not done this before, follow the steps outlined in [How to install and configure Azure PowerShell.](../powershell-install-configure.md)

### Step 2.2
Copy the *ServiceFabricRPHelpers* folder from this [Git repository](https://github.com/ChackDan/Service-Fabric/tree/master/Scripts/ServiceFabricRPHelpers) to your computer.

### Step 2.3
Open a PowerShell window and go to the directory where you downloaded the module.  Then import the module using the following command.

```powershell
Import-Module .\ServiceFabricRPHelpers.psm1
```

### Step 2.4
If you are using a certificate that you have already acquired, follow the procedure in this step. Otherwise, skip to Step 2.5, which explains how to create and deploy the self-signed certificate to the key vault.

You can use an existing resource group and key vault to store the certificate, or you can create a new resource group and/or a key vault if they are not already present. An existing key vault must first be configured to support deployment by using this script.

```powershell
Login-AzureRmAccount

Set-AzureRmKeyVaultAccessPolicy -VaultName <Name of the Vault> -ResourceGroupName <string> -EnabledForDeployment
```

To upload the certificate to your resource group and key vault, run the following script.  The resource group and key vault will be created if they do not already exist.

```powershell
Login-AzureRmAccount
Invoke-AddCertToKeyVault -SubscriptionId <your subscription id> -ResourceGroupName <string> -Location <region> -VaultName <Name of the Vault> -CertificateName <Name of the Certificate> -Password <Certificate password> -UseExistingCertificate -ExistingPfxFilePath <Full path to the .pfx file>
```
Here is a filled out script as an example.

```powershell
Login-AzureRmAccount
Invoke-AddCertToKeyVault -SubscriptionId 35389201-c0b3-405e-8a23-9f1450994307 -ResourceGroupName chackdankeyvault4doc -Location westus -VaultName chackdankeyvault4doc  -CertificateName chackdantestcertificate2 -Password abcd123 -UseExistingCertificate -ExistingPfxFilePath C:\MyCertificates\ChackdanTestCertificate.pfx
```

On successful completion of the script, you will get an output like the one below, which you will need for Step 3 (Set up a secure cluster).

```
Certificate Thumbprint: 2118C3BCE6541A54A0236E14ED2CCDD77EA4567A

SourceVault /Resource ID of the key vault :  /subscriptions/35389201-c0b3-405e-8a23-9f1450994307/resourceGroups/chackdankeyvault4doc/providers/Microsoft.KeyVault/vaults/chackdankeyvault4doc

Certificate URL /URL to the certificate location in the key vault : https://chackdankeyvalut4doc.vault.azure.net:443/secrets/chackdantestcertificate3/ebc8df6300834326a95d05d90e0701ea
```

You now have the information you need to set up a secure cluster. Go to Step 3.

### Step 2.5
If you *do not* have a certificate, and you want to create a new self-signed certificate and upload it to the key vault, follow these steps.  Self-signed certificates should only be used for test clusters and not for product clusters.

You can use an existing resource group and key vault to store the certificate, or you can create a new resource group and/or a key vault if they are not already present. An existing key vault must first be configured to support deployment by using this script.

```powershell
Login-AzureRmAccount
Set-AzureRmKeyVaultAccessPolicy -VaultName <Name of the Vault> -ResourceGroupName <string> -EnabledForDeployment
```

The following script will create a new resource group and/or key vault if they are not already present, create and upload a self signed certificate to the key vault, and output the new certificate to *OutputPath*.

```powershell
Login-AzureRmAccount
Invoke-AddCertToKeyVault -SubscriptionId <you subscription id> -ResourceGroupName <string> -Location <region> -VaultName <Name of the Vault> -CertificateName <Name of the Certificate> -Password <Certificate password> -CreateSelfSignedCertificate -DnsName <string- see note below.> -OutputPath <Full path to the .pfx file>
```
The *DnsName* string specifies one or more DNS names to put into the subject-alternative-name extension of the certificate when a certificate to be copied is not specified in the CloneCert parameter. The first DNS name is also saved as the Subject Name. If no signing certificate is specified, the first DNS name is also saved as the Issuer Name. The *Invoke-AddCertToKeyVault* cmdlet uses the [New-SelfSignedCertificate cmdlet](https://technet.microsoft.com/library/hh848633.aspx) to create the self-signed certificate.

Here is a filled out script as an example.

```powershell
Login-AzureRmAccount
Invoke-AddCertToKeyVault -SubscriptionId 35389201-c0b3-405e-8a23-9f1450994307 -ResourceGroupName chackdankeyvault4doc -Location westus -VaultName chackdankeyvault4doc  -CertificateName chackdantestcertificate3 -Password abcd123 -CreateSelfSignedCertificate -DnsName www.chackdan.westus.azure.com -OutputPath C:\MyCertificates
```

On successful completion of the script, you will get an output like the one below. You need these for Step 3.

```
Certificate Thumbprint: 64881409F4D86498C88EEC3697310C15F8F1540F

SourceVault /Resource ID of the key vault : /subscriptions/35389201-c0b3-405e-8a23-9f1450994307/resourceGroups/chackdankeyvault4doc/providers/Microsoft.KeyVault/vaults/chackdankeyvault4doc

Certificate URL /URL to the certificate location in the key vault: https://chackdankeyvalut4doc.vault.azure.net:443/secrets/chackdantestcertificate3/fvc8df6300834326a95d05d90e0720ea
```

## Step 3: Set up a secure cluster

Once your certificate(s) are uploaded to an Azure key vault you can create a cluster secured with those certificates. This step corresponds to [Step 3: Configure security](service-fabric-cluster-creation-via-portal.md#step-3--configure-security) of the cluster creation process and shows how to set up your security configurations.

>[AZURE.NOTE]
The needed certificates are specified at the Node Type level under Security Configurations. You have to specify this for every node type that you have in your cluster. Although this document walks though how to do this by using the portal, you can do the same by using an Azure Resource Manager template.

![Screen shot of Security Configurations in the Azure portal][SecurityConfigurations_01]

### Mandatory parameters

- **Security Mode** Select **X509 Certificate** to set up a cluster secured with X.509 certificates.
- **Cluster protection level** Refer to this [Protection Level document](https://msdn.microsoft.com/library/aa347692.aspx) to understand what each of these values means. Although we allow three values here (EncryptAndSign, Sign, and None), it is best to keep the default of EncryptAndSign unless you know what you are doing.
- **Source Vault** This refers to the Resource ID of the key vault. It should be in this format:

    ```
    /subscriptions/<Sub ID>/resourceGroups/<Resource group name>/providers/Microsoft.KeyVault/vaults/<vault name>
    ```

- **Certificate URL** This refers to the location URL in your key vault where the certificate was uploaded. It should be in this format:

    ```
    https://<name of the vault>.vault.azure.net:443/secrets/<exact location>
```
```
    https://chackdan-kmstest-eastus.vault.azure.net:443/secrets/MyCert/6b5cc15a753644e6835cb3g3486b3812
    ```

- **Certificate Thumbprint** This refers to the thumbprint of the certificate, which can be found at the URL that you specified earlier.

### Optional parameters

 You can optionally specify additional certificates for client machines that you use to perform operations on the cluster. By default, the thumbprint that you specified in the mandatory parameters is added to the authorized list of thumbprints that are allowed to perform client operations.

**Admin Client**: This information is used to validate that the client that is connecting to the cluster management endpoint is presenting the right credential to perform admin and read-only actions on the cluster. You can specify more than one certificate that you want to authorize for admin operations.

- **Authorize By** This indicates to Service Fabric whether it should look up this certificate by using the subject name or the thumbprint. Using the subject name to authorize is not a good security practice, but it adds flexibility.
- **Subject Name** This is needed only if you have specified that the authorization is by subject name.
- **Issuer Thumbprint** This provides an additional level of check that the server can perform when a client presents its credential to the server.

**Read Only Client**: This information is used to validate that the client that is connecting to the cluster management endpoint is presenting the right credential to perform read-only actions on the cluster. You can specify more than one certificate that you want to authorize for read-only operations.

- **Authorize By** This indicates to Service Fabric whether it should look up this certificate by using the subject name or the thumbprint. The use of the subject name to authorize is not a good security practice, but it adds flexibility.
- **Subject Name** This is needed only if you have specified that the authorization is by subject name.
- **Issuer Thumbprint** This provides an additional level of check that the server can perform when a client presents its credential to the server.

## Next steps
After configuring certificate security on your cluster, resume the cluster creation process in [Step 4: Complete the cluster creation](service-fabric-cluster-creation-via-portal.md#step-4--complete-the-cluster-creation).

After the cluster has been created certificate security, you can later [Update a certificate](service-fabric-cluster-security-update-certs-azure.md).


<!--Image references-->
[SecurityConfigurations_01]: ./media/service-fabric-cluster-azure-secure-with-certs/SecurityConfigurations_01.png
[SecurityConfigurations_02]: ./media/service-fabric-cluster-azure-secure-with-certs/SecurityConfigurations_02.png
