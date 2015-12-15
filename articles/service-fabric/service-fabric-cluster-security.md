<properties
   pageTitle="How to secure a Service Fabric Cluster | Microsoft Azure"
   description="How to secure a Service Fabric Cluster. What are the options ?"
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

# Securing a Service Fabric cluster

A Service Fabric cluster is a resource that you own and in order to prevent unauthorized access to the resource, you must secure it, especially when it has production workloads running in it. This document walks you though the process on how to.

##  Cluster security scenarios you should think about?

Service Fabric provides security for the following scenarios:

1. **Node-to-Node Security**  or  Securing a cluster for node to node communication.Secures the communication between the VMs/computers in the cluster. This ensures only computers that are authorized to join the cluster can participate in hosting application and services in the cluster

	![Node-to-Node][Node-to-Node]

2. **Client-to-Node Security** or Security a fabric client communicating with a particular node in the cluster. Authenticates and secures client communications, which ensures that only authorized users are able to access the cluster and applications deployed on Windows Fabric cluster. Clients are uniquely identified through either their Windows Security credentials or their certificate security credentials.

	![Client-to-Node][Client-to-Node]

	For either type of communication scenarios (Node to Node or Client to Node), Service Fabric provides support for using either [Certificate Security](https://msdn.microsoft.com/library/ff649801.aspx) or [Windows Security](https://msdn.microsoft.com/library/ff649396.aspx). The choices for node-to-node or client-to-node security are independent, from each other, and could be the same or different for each.

	In Azure Service Fabric uses X509 Server certificates that you specify as a part of the Node Type configurations when you create a cluster. For a quick overview what these certificates are and how you can acquire/create them, please scroll down to the bottom of this page.

3. **Role Based Access Control (RBAC)** : Ability to restrict the admin operations from the read only operations on the cluster to a set of certificates. 

4. **Service Accounts and RunAs** : Service Fabric itself runs as a Windows Service process (Fabric.exe) and the security account under which the Fabric.exe process runs is configurable. The process accounts that Fabric.exe runs under on each node in the cluster can be secured as well as the service host processes that are activated for each service. Refer to [Application Security and Runas](service-fabric-application-runas-security.md) doc for more details
  

## How to secure Service Fabric cluster using certificates.

In order to set up a secure service fabric cluster, you will need at least one server / x509 certificate. That you then upload to the azure Key Vault and use it in the cluster creation process 

There are three distinct steps

1. Acquire the x509 certificate
2. Upload the certificate to the Azure Key Vault.
3. Provide the location and details of the certificate to the service fabric cluster creation process.

 
## Step 1: Acquire the x509 certificate(s)

1. For clusters running production workloads, you must use a [Certificate Authority (CA)](https://en.wikipedia.org/wiki/Certificate_authority) signed x509 certificate to secure the cluster. For details on obtaining these certificates go to [http://msdn.microsoft.com/library/aa702761.aspx](http://msdn.microsoft.com/library/aa702761.aspx).
2. For clusters that you use for test purposes only, you can choose to use a self signed certificate. Step 2.5 will go through the steps on how to.


## Step 2 : Uploading the x509 certificate to Key Vault

This is an involved process, so we have a powershell Module uploaded to a Git Repp, that does this for you. 

**Step 2.1**: Copy this folder down to your machine from this [Git repo](https://github.com/ChackDan/Service-Fabric/tree/master/Scripts/ServiceFabricRPHelpers).

**Step 2.2**: Make sure  Azure SDK 1.0+ installed on your machine.

**Step 2.3**: Open a Powershell window and import the ServiceFabricRPHelpers.psm

```
Remove-Module ServiceFabricRPHelpers
```

Copy the following and change the path to the .psm1 to be that of your machine. Here is an example

```
Import-Module "C:\Users\chackdan\Documents\GitHub\Service-Fabric\Scripts\ServiceFabricRPHelpers\ServiceFabricRPHelpers.psm1"
```
  

**Step 2.4**: If you are using a cert that you already have acquired, then follow these steps, Else skip to Step 2.5.


Log in to your Azure Account

```
Login-AzureRmAccount
```

The script will create a new resource group and/or a vault if they are not already present.

```
Invoke-AddCertToKeyVault -SubscriptionId <you subscription id> -ResourceGroupName <string> -Location <region> -VaultName <Name of the Vault> -CertificateName <Name of the Certificate> -Password <Certificate password> -UseExistingCertificate -ExistingPfxFilePath <Full path to the .pfx file> 
```
Here is a filled out script as an example.

```
Invoke-AddCertToKeyVault -SubscriptionId 35389201-c0b3-405e-8a23-9f1450994307 -ResourceGroupName chackdankeyvault4doc -Location westus -VaultName chackdankeyvault4doc  -CertificateName chackdantestcertificate2 -Password abcd123 -UseExistingCertificate -ExistingPfxFilePath C:\MyCertificates\ChackdanTestCertificate.pfx 
```

On successful completion of the script,you will now get an output like the one below, you need these for step #3.

1. **Certificate Thumbprint** : 2118C3BCE6541A54A0236E14ED2CCDD77EA4567A
2. **SourceVault** /Resource ID of the KeyVault :  /subscriptions/35389201-c0b3-405e-8a23-9f1450994307/resourceGroups/chackdankeyvault4doc/providers/Microsoft.KeyVault/vaults/chackdankeyvault4doc
3. **Certificate URL** /URL to the Certificate location in the key Vault : https://chackdankeyvalut4doc.vault.azure.net:443/secrets/chackdantestcertificate3/ebc8df6300834326a95d05d90e0701ea 

you are have the information you need to set up a secure cluster. Go to Step3.


**Step 2.5**: If want to create a new Self Signed Cert and upload it to the Key Vault. 

Log in to your Azure Account

```
Login-AzureRmAccount
```

The script will create a new resource group and/or a vault if they are not already present.

```
Invoke-AddCertToKeyVault -SubscriptionId <you subscription id> -ResourceGroupName <string> -Location <region> -VaultName <Name of the Vault> -CertificateName <Name of the Certificate> -Password <Certificate password> -CreateSelfSignedCertificate -DnsName <string- see note below.> -OutputPath <Full path to the .pfx file> 
```
The OutputPath you gave to the script will contain the new self-signed certificate that we uploaded to the keyvault.


**Note** The DnsName <String[]> Specifies one or more DNS names to put into the subject alternative name extension of the certificate when a certificate to be copied is not specified via the CloneCert parameter. The first DNS name is also saved as the Subject Name. If no signing certificate is specified, the first DNS name is also saved as the Issuer Name.

You can read more on creating a self signed cert in general at [https://technet.microsoft.com/library/hh848633.aspx](https://technet.microsoft.com/library/hh848633.aspx) 

Here is a filled out script as an example.
```
Invoke-AddCertToKeyVault -SubscriptionId 35389201-c0b3-405e-8a23-9f1450994307 -ResourceGroupName chackdankeyvault4doc -Location westus -VaultName chackdankeyvault4doc  -CertificateName chackdantestcertificate3 -Password abcd123 -CreateSelfSignedCertificate -DnsName www.chackdan.westus.azure.com -OutputPath C:\MyCertificates
```

Since it is a self-signed certificate, you will need to import it to your machines "trusted people" store, before you can use this certificate to connect to a secure cluster.
```
Import-PfxCertificate -Exportable -CertStoreLocation Cert:\CurrentUser\TrustedPeople -FilePath C:C:\MyCertificates\ChackdanTestCertificate.pfx -Password (Read-Host -AsSecureString -Prompt "Enter Certificate Password ")
```
```
Import-PfxCertificate -Exportable -CertStoreLocation Cert:\CurrentUser\My -FilePath C:C:\MyCertificates\ChackdanTestCertificate.pfx -Password (Read-Host -AsSecureString -Prompt "Enter Certificate Password ")
``` 

On successful completion of the script,you will now get an output like the one below, you need these for step #3.

1. **Certificate Thumbprint** : 64881409F4D86498C88EEC3697310C15F8F1540F
2. **SourceVault** /Resource ID of the KeyVault :  /subscriptions/35389201-c0b3-405e-8a23-9f1450994307/resourceGroups/chackdankeyvault4doc/providers/Microsoft.KeyVault/vaults/chackdankeyvault4doc
3. **Certificate URL** /URL to the Certificate location in the key Vault : https://chackdankeyvalut4doc.vault.azure.net:443/secrets/chackdantestcertificate3/fvc8df6300834326a95d05d90e0720ea 

##Step 3: Setting up a secure cluster 

Follow the steps described  in [Service Fabric Cluster creation process](service-fabric-cluster-creation-via-portal.md) document, till you get to the Security Configurations.  The following is how you set up Security Configurations.

The certificates that need to be used are specified at the NodeType level under Security Configurations. You have to specify this for every NodeType you have in your cluster. Although this document walks though how to do this using the portal, you can do the same using a ARM template.

![SecurityConfigurations_01][SecurityConfigurations_01]

Mandatory parameters

- **Security Mode** make sure to select 'x509 certificate'. it indicates to service fabric that you intend to set up a secure cluster. 
- **Cluster protection level** refer to this [protection Level document](https://msdn.microsoft.com/library/aa347692.aspx) to understand what each of these values mean.Although we allow three values here - EncryptAndSign, Sign, None. It is best to keep the default of "EncryptAndSign", unless you know what you are doing.
- **Source Vault** refers to the Resource ID of the key vault, is should be in the format of 
```
/subscriptions/<Sub ID>/resourceGroups/<Resource group name>/providers/Microsoft.KeyVault/vaults/<vault name>
```

- **Certificate URL** refers to the location URL in your key vault where the certificate was uploaded, it is should be in the format of 
```
https://<name of the vault>.vault.azure.net:443/secrets/<exact location>
https://chackdan-kmstest-eastus.vault.azure.net:443/secrets/MyCert/6b5cc15a753644e6835cb3g3486b3812
```
- **Certificate Thumbprint** refers to the thumbprint of the certificate, that can be found at the URL you specified earlier.

Optional parameters - you can optionally specify additional certificates that the client machines you use to perform operations on the cluster. By default the thumbprint that you specified in the Mandatory parameters is added to the authorized list of thumbprints that are allowed to per from client operations. 

Admin Client - This information is used to validate that the client connecting to the cluster management end point is indeed presenting the right credential to perform admin and read only actions on the cluster. you can specify more than one certificate that you want to be authorize for Admin operations.


- **Authorize By** - indicates to service fabric if it should look up this cert using the subject name or by thumbprint. The use of subject name to authorize is not a good security practice, however, it allows for more flexibility.


- **Subject name** is needed only if you have specified that the authorization is by Subject name
- **Issuer Thumbprint** this allows for an additional level of check that the server can perform when a client presents its credential to the server.

Read Only Client - This information is used to validate that the client connecting to the cluster management end point is indeed presenting the right credential to perform read only actions on the cluster. you can specify more than one certificate that you want to be authorize for read only operations.


- **Authorize By** - indicates to service fabric if it should look up this cert using the subject name or by thumbprint. The use of subject name to authorize is not a good security practice, however, it allows for more flexibility.

- **Subject name** is needed only if you have specified that the authorization is by Subject name
- **Issuer Thumbprint** this allows for an additional level of check that the server can perform when a client presents its credential to the server.


## How to update the certificates in the cluster

Service fabric allows you to specify two certificates a primary and a secondary. The one that you specified at creation time is defaulted to primary.
In order to add another certificate, you need deploy that certificate to the VMs in the cluster. Step #2 above outlines how you can upload a new cert to the the keyvalult. you can use the same keyvault for this, as you did with the first certificate.

Refer to  - [Deploy certificates to VMs from customer-managed key vault](http://blogs.technet.com/b/kv/archive/2015/07/14/vm_2d00_certificates.aspx) document on how to.

Once that operation is successfully completed, go to the portal or via ARM, indicate to the Service fabric that you have a secondary certificate that can can be used as well. All you need is a thumbprint.

Here is the process- On the portal, browse to the cluster resource you want add this certificate to, click on the certificate setting and enter the secondary certificate thumbprint and press Save. A deployment will get kicked off and on successful completion of that deployment, you can now use both the primary or the secondary certificate to perform management operations on the cluster.

![SecurityConfigurations_02][SecurityConfigurations_02]

if you would now like to remove one of the certificate, you can do so. Make sure to press save after you remove it, so that a new deployment is kicked off. once that deployment is complete, the certificate you removed can no longer be used to connect to the cluster. For a secure cluster, you will always need atleast one valid (non revoked or expired) certificate deployed, else you will not be able to access the cluster. 

There is a diagnostic event that lets you know if any of the certificates are near expiry. 



## What are X509 Certificates?

X509 digital certificates are commonly used to authenticate clients and servers, encrypt, and digitally sign messages. For more details on these certificates, please go to [http://msdn.microsoft.com/library/ms731899.aspx](http://msdn.microsoft.com/library/ms731899.aspx)

**Note** 

1. Certificates used in clusters running production workloads, These should be created using either a correctly configured Windows Server certificate service or obtained via an approved [Certificate Authority (CA)](https://en.wikipedia.org/wiki/Certificate_authority).
2. Never use temporary or test certificates created with tools such as MakeCert.exe in production
3. For clusters that you use for test purposes only, you can choose to use a self signed certificate. 


## What are Server Certificates and Client Certificates?

**Server/X509 Certificates**

Server certificates have the primary task of authenticating the server (node) to clients or server (node) to server (node). One of the initial checks when a client or node authenticates a node is to compare the value of the common name in the Subject field to ensure that it is present in the list of allowed common names that has been configured. Either this common name or one of the certificates subject alternative names must be present in the list of allowed common names.

The following article describe how to generate certificates with subject alternative names (SAN).
[http://support.microsoft.com/kb/931351](http://support.microsoft.com/kb/931351)
 
**Note:** that the subject field can contain several values, each prefixed with an initialization to indicate the value. Most commonly, the initialization is "CN" for common name, for example, "CN = www.contoso.com". It is also possible for the Subject field to be blank. Note also the optional Subject Alternative Name field; if populated, this must contain both the common name of the certificate, and one entry per subject alternative name. These are entered as DNS Name values.

Also note the value of the Intended Purposes field of the certificate should include an appropriate value, such as "Server Authentication" or "Client Authentication".

**Client Certificates**

Client certificates are not typically issued by a third-party certificate authority. Instead, the Personal store of the current user location typically contains certificates placed there by a root authority, with an intended purpose of "Client Authentication". The client can use such a certificate when mutual authentication is required.
All management operations on Service Fabric cluster require Server certificates. Client certificates should not be used.


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
- [Service Fabric Cluster upgrade process and expectations from you](service-fabric-cluster-upgrade.md)
- [Managing your Service Fabric applications in Visual Studio](service-fabric-manage-application-in-visual-studio.md).
- [Service Fabric Health model introduction](service-fabric-health-introduction.md)

<!--Image references-->
[SecurityConfigurations_01]: ./media/service-fabric-cluster-security/SecurityConfigurations_01.png
[SecurityConfigurations_02]: ./media/service-fabric-cluster-security/SecurityConfigurations_02.png
[Node-to-Node]: ./media/service-fabric-cluster-security/node-to-node.png
[Client-to-Node]: ./media/service-fabric-cluster-security/client-to-node.png
