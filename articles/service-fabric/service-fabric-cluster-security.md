<properties
   pageTitle="Secure a Service Fabric cluster | Microsoft Azure"
   description="How to secure a Service Fabric cluster. What are the options?"
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
   ms.date="11/10/2015"
   ms.author="chackdan"/>

# Secure a Service Fabric cluster

An Azure Service Fabric cluster is a resource that you own. To prevent unauthorized access to the resource, you must secure it, especially when it has production workloads running on it. This article walks you through the process of securing a Service Fabric cluster.

##  Cluster security scenarios

Service Fabric provides security for the following scenarios:

1. **Node-to-node security:** This secures communication between the VMs and computers in the cluster. This ensures that only computers that are authorized to join the cluster can participate in hosting applications and services in the cluster.

	![Diagram of node-to-node communication][Node-to-Node]

2. **Client-to-node security:** This secures communication between a Service Fabric client and individual nodes in the cluster. This type of security authenticates and secures client communications, which ensures that only authorized users can access the cluster and the applications deployed on the cluster. Clients are uniquely identified through either their Windows Security credentials or their certificate security credentials.

	![Diagram of client-to-node communication][Client-to-Node]

	For either node-to-node or client-to-node security, you can use either [Certificate Security](https://msdn.microsoft.com/library/ff649801.aspx) or [Windows Security](https://msdn.microsoft.com/library/ff649396.aspx). The choices for node-to-node or client-to-node security are independent from each other, and can be the same or different.

	Azure Service Fabric uses X.509 server certificates that you specify as a part of the node-type configurations when you create a cluster. A quick overview of what these certificates are and how you can acquire or create them is provided at the end of this article.

3. **Role Based Access Control (RBAC):** This restricts admin operations on the cluster to a particular set of certificates.

4. **Service accounts and RunAs:** Service Fabric itself runs as a Windows Service process (Fabric.exe), and the security account under which the Fabric.exe process runs is configurable. You can secure the process accounts that Fabric.exe runs under on each node in the cluster, and you can also secure the service host processes that are activated for each service. Refer to [Application Security and RunAs](service-fabric-application-runas-security.md) for more details.

## Secure a Service Fabric cluster by using certificates.

To set up a secure Service Fabric cluster, you need at least one server X.509 certificate, which you upload to Azure Key Vault and use in the cluster creation process.

There are three distinct steps:

1. Acquire the X.509 certificate.
2. Upload the certificate to Azure Key Vault.
3. Provide the location and details of the certificate to the Service Fabric cluster creation process.

### Step 1: Acquire the X.509 certificate(s)

1. For clusters running production workloads, you must use a [Certificate Authority (CA)](https://en.wikipedia.org/wiki/Certificate_authority) signed X.509 certificate to secure the cluster. For details on obtaining these certificates go to [http://msdn.microsoft.com/library/aa702761.aspx](http://msdn.microsoft.com/library/aa702761.aspx).

2. For clusters that you use for test purposes only, you can use a self-signed certificate. Step 2.5 below explains how to do that.

### Step 2 : Upload the X.509 certificate to the Key Vault

This is an involved process, so we have a PowerShell module uploaded to a Git repository that does this for you.

**Step 2.1**: Copy this folder to your machine from this [Git repository](https://github.com/ChackDan/Service-Fabric/tree/master/Scripts/ServiceFabricRPHelpers).

**Step 2.2**: Make sure  Azure SDK 1.0+ is installed on your machine.

**Step 2.3**: Open a PowerShell window and import the ServiceFabricRPHelpers.psm.

```
Remove-Module ServiceFabricRPHelpers
```

Copy the following example and change the path to the .psm1 to match the path on your machine.

```
Import-Module "C:\Users\chackdan\Documents\GitHub\Service-Fabric\Scripts\ServiceFabricRPHelpers\ServiceFabricRPHelpers.psm1"
```

**Step 2.4**: If you are using a certificate that you have already  acquired, follow these steps. Otherwise, skip to Step 2.5.

Sign in to your Azure Account.

```
Login-AzureRmAccount
```

The following script will create a new resource group and/or a Key Vault if they are not already present.

```
Invoke-AddCertToKeyVault -SubscriptionId <your subscription id> -ResourceGroupName <string> -Location <region> -VaultName <Name of the Vault> -CertificateName <Name of the Certificate> -Password <Certificate password> -UseExistingCertificate -ExistingPfxFilePath <Full path to the .pfx file>
```
Here is a filled out script as an example.

```
Invoke-AddCertToKeyVault -SubscriptionId 35389201-c0b3-405e-8a23-9f1450994307 -ResourceGroupName chackdankeyvault4doc -Location westus -VaultName chackdankeyvault4doc  -CertificateName chackdantestcertificate2 -Password abcd123 -UseExistingCertificate -ExistingPfxFilePath C:\MyCertificates\ChackdanTestCertificate.pfx
```

On successful completion of the script, you will get an output like the one below, which you will need for Step 3.

1. **Certificate Thumbprint** : 2118C3BCE6541A54A0236E14ED2CCDD77EA4567A
2. **SourceVault** /Resource ID of the KeyVault :  /subscriptions/35389201-c0b3-405e-8a23-9f1450994307/resourceGroups/chackdankeyvault4doc/providers/Microsoft.KeyVault/vaults/chackdankeyvault4doc
3. **Certificate URL** /URL to the Certificate location in the Key Vault : https://chackdankeyvalut4doc.vault.azure.net:443/secrets/chackdantestcertificate3/ebc8df6300834326a95d05d90e0701ea

You now have the information you need to set up a secure cluster. Go to Step 3.

**Step 2.5**: To create a new self-signed certificate and upload it to the Key Vault, do the following:

Sign in to your Azure account.

```
Login-AzureRmAccount
```

The following script will create a new resource group and/or a Key Vault if they are not already present.

```
Invoke-AddCertToKeyVault -SubscriptionId <you subscription id> -ResourceGroupName <string> -Location <region> -VaultName <Name of the Vault> -CertificateName <Name of the Certificate> -Password <Certificate password> -CreateSelfSignedCertificate -DnsName <string- see note below.> -OutputPath <Full path to the .pfx file>
```
The OutputPath that you gave to the script will contain the new self-signed certificate that was uploaded to the Key Vault.

>[AZURE.NOTE] The DnsName string specifies one or more DNS names to put into the subject-alternative-name extension of the certificate when a certificate to be copied is not specified in the CloneCert parameter. The first DNS name is also saved as the Subject Name. If no signing certificate is specified, the first DNS name is also saved as the Issuer Name.

You can read more about creating a self-signed certificate at [https://technet.microsoft.com/library/hh848633.aspx](https://technet.microsoft.com/library/hh848633.aspx).

Here is a filled out script as an example.
```
Invoke-AddCertToKeyVault -SubscriptionId 35389201-c0b3-405e-8a23-9f1450994307 -ResourceGroupName chackdankeyvault4doc -Location westus -VaultName chackdankeyvault4doc  -CertificateName chackdantestcertificate3 -Password abcd123 -CreateSelfSignedCertificate -DnsName www.chackdan.westus.azure.com -OutputPath C:\MyCertificates
```

Since it is a self-signed certificate, you will need to import it into your machine's "trusted people" store, before you can use this certificate to connect to a secure cluster.

```
Import-PfxCertificate -Exportable -CertStoreLocation Cert:\CurrentUser\TrustedPeople -FilePath C:C:\MyCertificates\ChackdanTestCertificate.pfx -Password (Read-Host -AsSecureString -Prompt "Enter Certificate Password ")
```
```
Import-PfxCertificate -Exportable -CertStoreLocation Cert:\CurrentUser\My -FilePath C:C:\MyCertificates\ChackdanTestCertificate.pfx -Password (Read-Host -AsSecureString -Prompt "Enter Certificate Password ")
```

On successful completion of the script, you will get an output like the one below. You need these for Step 3.

1. **Certificate Thumbprint** : 64881409F4D86498C88EEC3697310C15F8F1540F
2. **SourceVault** /Resource ID of the Key Vault :  /subscriptions/35389201-c0b3-405e-8a23-9f1450994307/resourceGroups/chackdankeyvault4doc/providers/Microsoft.KeyVault/vaults/chackdankeyvault4doc
3. **Certificate URL** /URL to the certificate location in the Key Vault : https://chackdankeyvalut4doc.vault.azure.net:443/secrets/chackdantestcertificate3/fvc8df6300834326a95d05d90e0720ea

### Step 3: Set up a secure cluster

Follow the steps described in [Service Fabric cluster creation process](service-fabric-cluster-creation-via-portal.md), until you get to the Security configurations section. Then skip to the instructions shown here to set up your security configurations:

The certificates that you need to use are specified at the node-type level under Security Configurations. You have to specify this for every node type that you have in your cluster. Although this document walks though how to do this by using the portal, you can do the same by using an Azure Resource Manager template.

![Screen shot of Security Configurations in the Azure portal][SecurityConfigurations_01]

Mandatory parameters:

- **Security Mode.** Select **X509 Certificate**. That indicates to Service Fabric that you intend to set up a secure cluster.
- **Cluster protection level.** Refer to this [protection Level document](https://msdn.microsoft.com/library/aa347692.aspx) to understand what each of these values means. Although we allow three values here (EncryptAndSign, Sign, and None), it is best to keep the default of EncryptAndSign unless you know what you are doing.
- **Source Vault.** This refers to the Resource ID of the Key Vault. It should be in this format:

    ```
    /subscriptions/<Sub ID>/resourceGroups/<Resource group name>/providers/Microsoft.KeyVault/vaults/<vault name>
    ```

- **Certificate URL.** This refers to the location URL in your Key Vault where the certificate was uploaded. It should be in this format:

    ```
    https://<name of the vault>.vault.azure.net:443/secrets/<exact location>
    https://chackdan-kmstest-eastus.vault.azure.net:443/secrets/MyCert/6b5cc15a753644e6835cb3g3486b3812
    ```

- **Certificate Thumbprint.** This refers to the thumbprint of the certificate, which can be found at the URL that you specified earlier.

Optional parameters:

 - You can optionally specify additional certificates for client machines that you use to perform operations on the cluster. By default, the thumbprint that you specified in the mandatory parameters is added to the authorized list of thumbprints that are allowed to perform client operations.

Admin Client: This information is used to validate that the client that is connecting to the cluster management endpoint is presenting the right credential to perform admin and read-only actions on the cluster. You can specify more than one certificate that you want to authorize for admin operations.

- **Authorize By.** This indicates to Service Fabric whether it should look up this certificate by using the subject name or the thumbprint. Using the subject name to authorize is not a good security practice, but it adds flexibility.
- **Subject name.** This is needed only if you have specified that the authorization is by subject name.
- **Issuer Thumbprint** This provides an additional level of check that the server can perform when a client presents its credential to the server.

Read Only Client: This information is used to validate that the client that is connecting to the cluster management endpoint is presenting the right credential to perform read-only actions on the cluster. You can specify more than one certificate that you want to  authorize for read-only operations.

- **Authorize By.** This indicates to Service Fabric whether it should look up this certificate by using the subject name or the thumbprint. The use of the subject name to authorize is not a good security practice, but it adds flexibility.
- **Subject name.** This is needed only if you have specified that the authorization is by subject name.
- **Issuer Thumbprint.** This provides an additional level of check that the server can perform when a client presents its credential to the server.

## Update the certificates in the cluster

You can specify two certificates, a primary and a secondary. By default, the one that you specify at creation time is the primary certificate. To add another certificate, you must deploy that certificate to the VMs in the cluster. Step 2 above outlines how to upload a new certificate to the Key Vault. You can use the same Key Vault for this, as you did with the first certificate. For more information, see [Deploy certificates to VMs from a customer-managed Key Vault](http://blogs.technet.com/b/kv/archive/2015/07/14/vm_2d00_certificates.aspx).

Once that operation is completed, use the portal or Resource Manager to indicate to Service Fabric that you have a secondary certificate that can be used as well. All you need is a thumbprint.

Here is the process for adding a secondary certificate:

1. On the portal, browse to the cluster resource that you want to add this certificate to.
2. Under **Settings**, click **Certificates** and enter the secondary certificate thumbprint.
3. Click **Save**. A deployment will be started, and after completion of that deployment, you can use either the primary or the secondary certificate to perform management operations on the cluster.

![Screen shot of certificate thumbprints in the portal][SecurityConfigurations_02]

If later you want to remove one of the certificates, you can do so. Be sure to click **Save** after you remove it, so that a new deployment is started. After that new deployment is complete, the certificate that you removed can no longer be used to connect to the cluster. For a secure cluster, you will always need to have at least one valid (not revoked and not expired) certificate deployed or you will not be able to access the cluster.

There is a diagnostic event that lets you know if any of the certificates are near expiration.

## X.509 certificates

X.509 digital certificates are commonly used to authenticate clients and servers and to encrypt and digitally sign messages. For more details on these certificates, go to [Working with certificates](http://msdn.microsoft.com/library/ms731899.aspx) in the MSDN library.

>[AZURE.NOTE]
1. Certificates used in clusters that are running production workloads should be either created by using a correctly configured Windows Server certificate service or obtained from an approved [Certificate Authority (CA)](https://en.wikipedia.org/wiki/Certificate_authority).
2. Never use in production any temporary or test certificates that are created with tools such as MakeCert.exe.
3. For clusters that you use for test purposes only, you can choose to use a self-signed certificate.

## Server certificates and client certificates

**Server X.509 certificates**

Server certificates have the primary task of authenticating a server (node) to clients, or authenticating a server (node) to a server (node). One of the initial checks when a client or node authenticates a node is to check the value of the common name in the Subject field. Either this common name or one of the certificates' subject alternative names must be present in the list of allowed common names.

The following article describe how to generate certificates with subject alternative names (SAN):
[How to add a subject alternative name to a secure LDAP certificate](http://support.microsoft.com/kb/931351).

>[AZURE.NOTE] The Subject field can contain several values, each prefixed with an initialization to indicate the value type. Most commonly, the initialization is "CN" for common name; for example, "CN = www.contoso.com". It is also possible for the Subject field to be blank. If the optional Subject Alternative Name field is populated, it must contain both the common name of the certificate and one entry per subject alternative name. These are entered as DNS Name values.

The value of the Intended Purposes field of the certificate should include an appropriate value, such as "Server Authentication" or "Client Authentication".

**Client certificates**

Client certificates are not typically issued by a third-party certificate authority. Instead, the Personal store of the current user location typically contains client certificates placed there by a root authority, with an intended purpose of "Client Authentication". The client can use such a certificate when mutual authentication is required.

All management operations on a Service Fabric cluster require server certificates. Client certificates cannot be used for management.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
- [Service Fabric Cluster upgrade process and expectations from you](service-fabric-cluster-upgrade.md)
- [Managing your Service Fabric applications in Visual Studio](service-fabric-manage-application-in-visual-studio.md).
- [Service Fabric health model introduction](service-fabric-health-introduction.md)

<!--Image references-->
[SecurityConfigurations_01]: ./media/service-fabric-cluster-security/SecurityConfigurations_01.png
[SecurityConfigurations_02]: ./media/service-fabric-cluster-security/SecurityConfigurations_02.png
[Node-to-Node]: ./media/service-fabric-cluster-security/node-to-node.png
[Client-to-Node]: ./media/service-fabric-cluster-security/client-to-node.png
