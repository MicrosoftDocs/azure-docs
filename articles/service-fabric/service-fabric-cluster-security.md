<properties
   pageTitle="How to make a Service Fabric Cluster secure | Microsoft Azure"
   description="How to make a Service Fabric Cluster secure. What are the options ?"
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

# How to secure Service Fabric cluster using certificates.

In order to set up a secure service fabric cluster, you will need at least one server / x509 certificate. That you then upload to the azure Key Vault and use it in the cluster creation process outlined in [Service Fabric Cluster creation process](service-fabric-cluster-creation-via-portal.md)

There are three distinct steps

1. Acquire the x509 certificate
2. Upload the certificate to the Azure Key Vault.
3. Provide the location and details of the certificate to the service fabric cluster creation process.

Before we get into too much detail, let us get to some of the basics of what scenarios are . 

##  What scenarios are covered?

Service Fabric provides security for the following scenarios:

1. Securing a cluster for node to node communication.
2. Security a fabric client communicating with a particular node in the cluster
3. Role Based Access Control (RBAC) - Ability to restrict the admin operations from the read only operations on the cluster to a set of certificates.   

Service Fabric uses X509 Server certificates that you specify as a part of the Node Type configurations when you create a cluster. For a quick overview what these certificates are and how you can acquire/create them, please scroll down to the bottom of this page.

 
## Acquire the x509 certificate(s)

1. For clusters running production workloads, you must use a [Certificate Authority (CA)](https://en.wikipedia.org/wiki/Certificate_authority) signed x509 certificate to secure the cluster. For details on obtaining these certificates go to [http://msdn.microsoft.com/library/aa702761.aspx](http://msdn.microsoft.com/library/aa702761.aspx).
2. For clusters that you use for test purposes only, you can choose to use a self signed certificate.


## Creating a self signed certificate for test purposes

The details on creating a self signed cert are at [https://technet.microsoft.com/library/hh848633.aspx](https://technet.microsoft.com/library/hh848633.aspx) 
    
Here is the PS I use for creating my Test certificates, but make sure to read the above document to make sure that it meets your needs.
```
$password = Read-Host -AsSecureString 
```
```
New-SelfSignedCertificate -CertStoreLocation Cert:\CurrentUser\My -DnsName ChackdanTestCertificate | Export-PfxCertificate -FilePath E:\MyCertificates\ChackdanTestCertificate.pfx -Password $password
```

**Note** The DnsName <String[]> Specifies one or more DNS names to put into the subject alternative name extension of the certificate when a certificate to be copied is not specified via the CloneCert parameter. The first DNS name is also saved as the Subject Name. If no signing certificate is specified, the first DNS name is also saved as the Issuer Name.

## Uploading the x509 certificate to Key Vault

Instructions on how to upload a certificate to key vault is here [link to key vault documentation](https://azure.microsoft.com/documentation/articles/key-vault-get-started/).

Make sure to take a note of the Source Vault URL, certificate URL and the certificate thumbprint. you will need these in setting up the secure Service Fabric cluster.The data you need will look like the following



1. **Resource ID of the KeyVault/Source Vault URL** : /subscriptions/6c653126-e4ba-42cd-a1dd-f7bf96af7a47/resourceGroups/chackdan-keyvault/providers/Microsoft.KeyVault/vaults/chackdan-kmstest
2. **URL to the Certificate location in the key Vault** : https://chackdan-kmstest.vault.azure.net:443/secrets/MyCert/dcf17bdbb86b42ad864e8e827c268431 
3. **Certificate ThumbPrint** : 2118C3BCE6541A54A0236E14ED2CCDD77EA4567A



##Setting up a secure cluster 

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
In order to add another certificate, you need deploy that certificate to the VMs in the cluster. Refer to  - [Deploy certificates to VMs from customer-managed key vault](http://blogs.technet.com/b/kv/archive/2015/07/14/vm_2d00_certificates.aspx) document on how to.

Once that operation is successfully completed, go to the portal or via ARM, indicate to the Service fabric that you have a secondary certificate that can can be used as well. All you need is a thumbprint.

On the portal, browse to the cluster resource you want add this certificate to, click on the certificate setting and enter the secondary certificate thumbprint and press Save. A deployment will get kicked off and on successful completion of that deployment, you can now use both the primary or the secondary certificate to perform management operations on the cluster.

![SecurityConfigurations_02][SecurityConfigurations_02]

if you would now like to remove one of the certificate, you can do so. Make sure to press save after you remove it, so that a new deployment is kicked off. once that deployment is complete, the certificate you removed can no longer be used to connect to the cluster. For a secure cluster, you will always need atleast one valid (non revoked or expired) certificate deployed, else you will not be able to access the cluster. 

There is a diagnostic event that lets you know if any of the certificates are near expiry. 



## What are X509 Certificates?

X509 digital certificates are commonly used to authenticate clients and servers, encrypt, and digitally sign messages. For more details on these certificates, please go to [http://msdn.microsoft.com/library/ms731899.aspx](http://msdn.microsoft.com/library/ms731899.aspx)

**Note** 

1. Certificates used in clusters running production workloads, you ahould be created using either a correctly configured Windows Server certificate service or obtained via an approved [Certificate Authority (CA)](https://en.wikipedia.org/wiki/Certificate_authority).
2. Never use temporary or test certificates created with tools such as MakeCert.exe in production
3. For clusters that you use for test purposes only, you can choose to use a self signed certificate. 


##What are Server Certificates and Client Certificates?

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
