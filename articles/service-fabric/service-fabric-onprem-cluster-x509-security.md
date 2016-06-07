<properties
   pageTitle="Connect to a secure private cluster | Microsoft Azure"
   description="This article describes how to secure communication within the on-premises or private cluster as well as between clients and the cluster."
   services="service-fabric"
   documentationCenter=".net"
   authors="dsk-2015"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="06/07/2016"
   ms.author="dkshir"/>

# Secure your on-premises cluster using certificates

This article describes how to secure the communication between the various nodes of your on-premises cluster, as well as how to authenticate clients connecting to this cluster, using X.509 certificates. This ensures that only authorized users can access the cluster and deployed applications and perform management tasks.  Certificate security should be enabled on the cluster when the cluster was created.  For more information on node-to-node security, client-to-node security, and role-based access control, see [Cluster security scenarios](service-fabric-cluster-security.md).

## Which certificates will you need?

To start with, [download the on-premises cluster package](service-fabric-cluster-creation-for-windows-server.md#downloadpackage) to one of the nodes in your cluster. In the downloaded package, you will find a **ClusterConfig.X509.json** file. Open the file in *Edit* mode and review the section for **security** under the **properties** tab:

    "security": {
        "metadata": "The Credential type X509 indicates this is cluster is secured using X509 Certificates. The thumbprint format is - d5 ec 42 3b 79 cb e5 07 fd 83 59 3c 56 b9 d5 31 24 25 42 64.",
        "ClusterCredentialType": "X509",
        "ServerCredentialType": "X509",
        "CertificateInformation": {
			"ClusterCertificate": {
                "Thumbprint": "[Thumbprint]",
                "ThumbprintSecondary": "[Thumbprint]",
                "X509FindValue": "ThumbprintB",
                "X509StoreName": "My"
            },
            "ServerCertificate": {
                "Thumbprint": "[Thumbprint]",
                "ThumbprintSecondary": "[Thumbprint]",
                "X509FindValue": "ThumbprintB",
                "X509StoreName": "My"
            },
            "ClientCertificateThumbprints": [{
                "CertificateThumbprint": "[Thumbprint]",
                "IsAdmin": false
            }, {
                "CertificateThumbprint": "[Thumbprint]",
                "IsAdmin": true
            }],
            "ClientCertificateCommonNames": [{
                "CertificateCommonName": "[CertificateCommonName]",
                "CertificateIssuerThumbprint" : "[Thumbprint]",
                "IsAdmin": true
            }]
        }
    },

This section describes all the certificates that you will need for securing your on-premises cluster. Enable certificate-based security by setting the values of **ClusterCredentialType** and **ServerCredentialType** to *X509*. 

>[Azure.NOTE] A [thumbprint](https://en.wikipedia.org/wiki/Public_key_fingerprint) is the primary identity of a certificate. Read [How to retrieve thumbprint of a certificate](https://msdn.microsoft.com/en-us/library/ms734695(v=vs.110).aspx) to find out the thumbprint of the certificates that you create. 

The following table lists out the actual certificates that you will need on your cluster setup:

|**CertificateInformation Setting**|**Description**|
|-----------------------|--------------------------|
|ClusterCertificate|This certificate is required to secure the communication between the nodes on a cluster. You can use two different certificates, a primary and a secondary for fall-over. Set the thumbprint of the primary certificate in the **Thumbprint** section and that of the secondary in the **ThumbprintSecondary** variables.|
|ServerCertificate|This certificate is presented to the client when it tries to connect to this cluster. For convenience, you can choose to use the same certificate for *ClusterCertificate* and *ServerCertificate*. You can use two different server certificates, a primary and a secondary for fall-over. Set the thumbprint of the primary certificate in the **Thumbprint** section and that of the secondary in the **ThumbprintSecondary** variables. |
|ClientCertificateThumbprints|This is a set of certificates that you want to install on the authenticated clients. You can have a number of different client certificates installed on the machines that you want to allow access to the cluster and the applications running on it. Set the thumbprint of each certificate in the **CertificateThumbprint** variable. If you set the **IsAdmin** to *true*, then the client with this certificate installed on it can do various management activities for the cluster. If the **IsAdmin** is *false*, it can only access the applications running on the cluster.|
|ClientCertificateCommonNames|Set the common name of the first client certificate for the **CertificateCommonName**. The **CertificateIssuerThumbprint** is the thumbprint for the issuer of this certificate. Read [Working with certificates](https://msdn.microsoft.com/en-us/library/ms731899(v=vs.110).aspx) to know more about common names and the issuer.|


## Install the certificates

To secure communication between the cluster, you will first need to obtain X.509 certificates for your cluster nodes. Additionally, to limit connection to this cluster to authorized machines/users, you will need to obtain and install certificates for these potential client machines. Read [How to obtain a certificate](https://msdn.microsoft.com/en-us/library/aa702761(v=vs.110).aspx) for steps to obtain the X.509 certificates. We recommend using a **.pfx** format to save the certificate since that will allow you to store your private key. Once you have this certificate, you can install it on the cluster nodes by using the following steps. Note that the steps assume your nodes already have the latest Windows PowerShell 3.x installed on them. You will need to repeat these steps on each node, for both Cluster and Server certificates and any secondary certificates for each of them.

- Copy the .pfx file to the node.

- Open a PowerShell window as an administrator and enter the following commands:
	
		Import-PfxCertificate -Exportable -CertStoreLocation Cert:\LocalMachine\My `
		-FilePath $PfxFilePath -Password (ConvertTo-SecureString -String $password -AsPlainText -Force)

Replace the *$password* with the password that you used to create this certificate. Replace the $PfxFilePath with the full path of the .pfx copied to this node. 

- Set the access control on this certificate so that the cluster service can use it by running the following script:

		$cert = get-item Cert:\LocalMachine\My\<CertificateThumbprint>
		$cert.PrivateKey.CspKeyContainerInfo.UniqueKeyContainerName

		#Note down the string output by this command, this is the container name for your private key. 

		$privateKeyFilePath = 'C:\ProgramData\Microsoft\Crypto\RSA\MachineKeys\<PrivateKeyContainerName>'
	
		#Observe the access rights currently assigned to this certificate.
		get-acl $privateKeyFilePath | fl

		#Set the ACL so that the cluster service can access it.
		$acl = get-acl $privateKeyFilePath
		$acl.SetAccessRule((New-Object System.Security.Accesscontrol.FileSystemAccessRule("NT AUTHORITY\NetworkService","FullControl","Allow")))
		Set-Acl $privateKeyFilePath $acl -ErrorAction Stop 
	

Use these steps to also install the client certificates on the machines that you want to allow access to the cluster. 


## Create the secure cluster

Create the cluster by running the following PowerShell command on one of the nodes of the cluster. Read [Create your cluster](service-fabric-cluster-creation-for-windows-server.md#createcluster) section for more information about the cluster creation process. 

	cd $ServiceFabricDeployAnywhereFolder
	.\CreateServiceFabricCluster.ps1 -ClusterConfigFilePath .\ClusterConfig.X509.json -MicrosoftServiceFabricCabFilePath .\MicrosoftAzureServiceFabric.cab -AcceptEULA $true -Verbose
	

## Next steps

Now that you have a secure cluster and authenticated clients to connect to it, follow the section [Connect to a secure cluster using PowerShell](service-fabric-connect-to-secure-cluster.md#connectsecurecluster) to connect to it. 






