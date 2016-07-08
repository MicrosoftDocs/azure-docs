<properties
   pageTitle="Connect to a secure private cluster | Microsoft Azure"
   description="This article describes how to secure communication within the standalone or private cluster as well as between clients and the cluster."
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
   ms.date="07/08/2016"
   ms.author="dkshir"/>

# Secure a standalone cluster on Windows using X.509 certificates

This article describes how to secure the communication between the various nodes of your standalone Windows cluster, as well as how to authenticate clients connecting to this cluster, using X.509 certificates. This ensures that only authorized users can access the cluster, the deployed applications and perform management tasks.  Certificate security should be enabled on the cluster when the cluster is created.  

For more information on cluster security such as node-to-node security, client-to-node security, and role-based access control, see [Cluster security scenarios](service-fabric-cluster-security.md).

## Which certificates will you need?

To start with, [download the standalone cluster package](service-fabric-cluster-creation-for-windows-server.md#downloadpackage) to one of the nodes in your cluster. In the downloaded package, you will find a **ClusterConfig.X509.MultiMachine.json** file. Open the file and review the section for **security** under the **properties** section:

    "security": {
        "metadata": "The Credential type X509 indicates this is cluster is secured using X509 Certificates. The thumbprint format is - d5 ec 42 3b 79 cb e5 07 fd 83 59 3c 56 b9 d5 31 24 25 42 64.",
        "ClusterCredentialType": "X509",
        "ServerCredentialType": "X509",
        "CertificateInformation": {
			"ClusterCertificate": {
                "Thumbprint": "[Thumbprint]",
                "ThumbprintSecondary": "[Thumbprint]",
                "X509StoreName": "My"
            },
            "ServerCertificate": {
                "Thumbprint": "[Thumbprint]",
                "ThumbprintSecondary": "[Thumbprint]",
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

This section describes the certificates that you need for securing your standalone Windows cluster. To enable certificate-based security set the values of **ClusterCredentialType** and **ServerCredentialType** to *X509*.

>[AZURE.NOTE] A [thumbprint](https://en.wikipedia.org/wiki/Public_key_fingerprint) is the primary identity of a certificate. Read [How to retrieve thumbprint of a certificate](https://msdn.microsoft.com/library/ms734695.aspx) to find out the thumbprint of the certificates that you create.

The following table lists the certificates that you will need on your cluster setup:

|**CertificateInformation Setting**|**Description**|
|-----------------------|--------------------------|
|ClusterCertificate|This certificate is required to secure the communication between the nodes on a cluster. You can use two different certificates, a primary and a secondary for upgrade. Set the thumbprint of the primary certificate in the **Thumbprint** section and that of the secondary in the **ThumbprintSecondary** variables.|
|ServerCertificate|This certificate is presented to the client when it tries to connect to this cluster. For convenience, you can choose to use the same certificate for *ClusterCertificate* and *ServerCertificate*. You can use two different server certificates, a primary and a secondary for upgrade. Set the thumbprint of the primary certificate in the **Thumbprint** section and that of the secondary in the **ThumbprintSecondary** variables. |
|ClientCertificateThumbprints|This is a set of certificates that you want to install on the authenticated clients. You can have a number of different client certificates installed on the machines that you want to allow access to the cluster. Set the thumbprint of each certificate in the **CertificateThumbprint** variable. If you set the **IsAdmin** to *true*, then the client with this certificate installed on it can do administrator management activities on the cluster. If the **IsAdmin** is *false*, the client with this certificate can only perform the actions allowed for user access rights, typically read-only. For more information on roles read [Role based access control (RBAC)](service-fabric-cluster-security.md/#role-based-access-control-rbac)  |
|ClientCertificateCommonNames|Set the common name of the first client certificate for the **CertificateCommonName**. The **CertificateIssuerThumbprint** is the thumbprint for the issuer of this certificate. Read [Working with certificates](https://msdn.microsoft.com/library/ms731899.aspx) to know more about common names and the issuer.|

Here is example cluster configuration where the Cluster, Server, and Client certificates have been provided.

 ```
 {
    "name": "SampleCluster",
    "clusterManifestVersion": "1.0.0",
    "apiVersion": "2015-01-01-alpha",
    "nodes": [{
        "nodeName": "vm0",
		"metadata": "Replace the localhost below with valid IP address or FQDN",
        "iPAddress": "10.7.0.5",
        "nodeTypeRef": "NodeType0",
        "faultDomain": "fd:/dc1/r0",
        "upgradeDomain": "UD0"
    }, {
      "nodeName": "vm1",
      		"metadata": "Replace the localhost with valid IP address or FQDN",
        "iPAddress": "10.7.0.4",
        "nodeTypeRef": "NodeType0",
        "faultDomain": "fd:/dc1/r1",
        "upgradeDomain": "UD1"
    }, {
        "nodeName": "vm2",
      "iPAddress": "10.7.0.6",
      		"metadata": "Replace the localhost with valid IP address or FQDN",
        "nodeTypeRef": "NodeType0",
        "faultDomain": "fd:/dc1/r2",
        "upgradeDomain": "UD2"
    }],
    "diagnosticsFileShare": {
        "etlReadIntervalInMinutes": "5",
        "uploadIntervalInMinutes": "10",
        "dataDeletionAgeInDays": "7",
        "etwStoreConnectionString": "file:c:\\ProgramData\\SF\\FileshareETW",
        "crashDumpConnectionString": "file:c:\\ProgramData\\SF\\FileshareCrashDump",
        "perfCtrConnectionString": "file:c:\\ProgramData\\SF\\FilesharePerfCtr"
    },
    "properties": {
        "security": {
            "metadata": "The Credential type X509 indicates this is cluster is secured using X509 Certificates. The thumbprint format is - d5 ec 42 3b 79 cb e5 07 fd 83 59 3c 56 b9 d5 31 24 25 42 64.",
            "ClusterCredentialType": "X509",
            "ServerCredentialType": "X509",
            "CertificateInformation": {
                "ClusterCertificate": {
                    "Thumbprint": "a8 13 67 58 f4 ab 89 62 af 2b f3 f2 79 21 be 1d f6 7f 43 26",
                    "X509StoreName": "My"
                },
                "ServerCertificate": {
                    "Thumbprint": "a8 13 67 58 f4 ab 89 62 af 2b f3 f2 79 21 be 1d f6 7f 43 26",
                    "X509StoreName": "My"
                },
                "ClientCertificateThumbprints": [{
                    "CertificateThumbprint": "c4 c18 8e aa a8 58 77 98 65 f8 61 4a 0d da 4c 13 c5 a1 37 6e",
                    "IsAdmin": false
                }, {
                    "CertificateThumbprint": "71 de 04 46 7c 9e d0 54 4d 02 10 98 bc d4 4c 71 e1 83 41 4e",
                    "IsAdmin": true
                }]
            }
        },
        "reliabilityLevel": "Bronze",
        "nodeTypes": [{
            "name": "NodeType0",
            "clientConnectionEndpointPort": "19000",
            "clusterConnectionEndpoint": "19001",
            "httpGatewayEndpointPort": "19080",
            "applicationPorts": {
                "startPort": "20001",
                "endPort": "20031"
            },
            "ephemeralPorts": {
                "startPort": "20032",
                "endPort": "20062"
            },
            "isPrimary": true
        }
         ],
        "fabricSettings": [{
            "name": "Setup",
            "parameters": [{
                "name": "FabricDataRoot",
                "value": "C:\\ProgramData\\SF"
            }, {
                "name": "FabricLogRoot",
                "value": "C:\\ProgramData\\SF\\Log"
            }]
        }]
    }
}
 ```

## Aquire the X.509 certificates
To secure communication within the cluster, you will first need to obtain X.509 certificates for your cluster nodes. Additionally, to limit connection to this cluster to authorized machines/users, you will need to obtain and install certificates for the client machines.

For clusters that are running production workloads, you should use a [Certificate Authority (CA)](https://en.wikipedia.org/wiki/Certificate_authority) signed X.509 certificate to secure the cluster. For details on obtaining these certificates, go to [How to: Obtain a Certificate](http://msdn.microsoft.com/library/aa702761.aspx).

For clusters that you use for test purposes, you can choose to use a self-signed certificate.

## Optional: Create a self-signed certificate
One way to create a self-signed cert that can be secured correctly is to use the *CertSetup.ps1* script in the Service Fabric SDK folder in the directory *C:\Program Files\Microsoft SDKs\Service Fabric\ClusterSetup\Secure*. Edit this file and use this to create a certificate with a suitable name.

Now export the certificate to a PFX file with a protected password. First you need to get the thumbprint of the certificate. Run the certmgr.exe application. Navigate to the **Local Computer\Personal** folder and find the certificate you just created. Double-click the certificate to open it, select the *Details* tab and scroll down to the *Thumbprint* field. Copy the thumbprint value into the PowerShell command below, removing the spaces.  Change the *$pswd* value to a suitability secure password to protect it and run the PowerShell:

```   
$pswd = ConvertTo-SecureString -String "1234" -Force –AsPlainText
Get-ChildItem -Path cert:\localMachine\my\<Thumbprint> | Export-PfxCertificate -FilePath C:\mypfx.pfx -Password $pswd
```

To see the details of a certificate installed on the machine you can run the following PowerShell command:

```
$cert = Get-Item Cert:\LocalMachine\My\<Thumbprint>
Write-Host $cert.ToString($true)
```

Alternatively, if you have an Azure subscription, you can follow the section [Acquire the X.509 certificates](service-fabric-secure-azure-cluster-with-certs.md#acquirecerts) to create your certificates.

## Install the certificates
Once you have certificate(s), you can install them on the cluster nodes. Your nodes need to have the latest Windows PowerShell 3.x installed on them. You will need to repeat these steps on each node, for both Cluster and Server certificates and any secondary certificates.

1. Copy the .pfx file(s) to the node.
2. Open a PowerShell window as an administrator and enter the following commands. Replace the *$pswd* with the password that you used to create this certificate. Replace the *$PfxFilePath* with the full path of the .pfx copied to this node.

    ```
    $pswd = "1234"
    $PfcFilePath ="C:\mypfx.pfx"
    Import-PfxCertificate -Exportable -CertStoreLocation Cert:\LocalMachine\My -FilePath $PfxFilePath -Password (ConvertTo-SecureString -String $pswd -AsPlainText -Force)
    ```

3. Next you need to set the access control on this certificate so that the Service Fabric process, which runs under the Network Service account, can use it by running the following script. Provide the thumbprint of the certificate and "NETWORK SERVICE" for the service account. You can check that the ACLs on the certificate are correct using the certmgr.exe tool and looking at the Manage Private Keys on the cert.

    ```
    param
    (
        [Parameter(Position=1, Mandatory=$true)]
        [ValidateNotNullOrEmpty()]
        [string]$pfxThumbPrint,

        [Parameter(Position=2, Mandatory=$true)]
        [ValidateNotNullOrEmpty()]
        [string]$serviceAccount
        )

        $cert = Get-ChildItem -Path cert:\LocalMachine\My | Where-Object -FilterScript { $PSItem.ThumbPrint -eq $pfxThumbPrint; };

        # Specify the user, the permissions and the permission type
        $permission = "$($serviceAccount)","FullControl","Allow"
        $accessRule = New-Object -TypeName System.Security.AccessControl.FileSystemAccessRule -ArgumentList $permission;

        # Location of the machine related keys
        $keyPath = $env:ProgramData + "\Microsoft\Crypto\RSA\MachineKeys\";
        $keyName = $cert.PrivateKey.CspKeyContainerInfo.UniqueKeyContainerName;
        $keyFullPath = $keyPath + $keyName;

        # Get the current acl of the private key
        $acl = (Get-Item $keyFullPath).GetAccessControl('Access')

        # Add the new ace to the acl of the private key
        $acl.SetAccessRule($accessRule);

        # Write back the new acl
        Set-Acl -Path $keyFullPath -AclObject $acl -ErrorAction Stop

        #Observe the access rights currently assigned to this certificate.
        get-acl $keyFullPath| fl
        ```

4. Repeat the steps above for each server certificate. You can also use these steps to install the client certificates on the machines that you want to allow access to the cluster.

## Create the secure cluster
After configuring the **security** section of the **ClusterConfig.X509.MultiMachine.json** file, you can proceed to [Create your cluster](service-fabric-cluster-creation-for-windows-server.md#createcluster) section to configure the nodes and create the standalone cluster. Remember to use the **ClusterConfig.X509.MultiMachine.json** file while creating the cluster. For example, your command might look like the following:

```
.\CreateServiceFabricCluster.ps1 -ClusterConfigFilePath .\ClusterConfig.X509.MultiMachine.json -MicrosoftServiceFabricCabFilePath .\MicrosoftAzureServiceFabric.cab -AcceptEULA $true
```

Once you have the secure standalone Windows cluster successfully running, and have setup the authenticated clients to connect to it, follow the section [Connect to a secure cluster using PowerShell](service-fabric-connect-to-secure-cluster.md#connectsecurecluster) to connect to it. For example:

```
Connect-ServiceFabricCluster -ConnectionEndpoint 10.7.0.4:19000 -KeepAliveIntervalInSec 10 -X509Credential -ServerCertThumbprint 057b9544a6f2733e0c8d3a60013a58948213f551 -FindType FindByThumbprint -FindValue 057b9544a6f2733e0c8d3a60013a58948213f551 -StoreLocation CurrentUser -StoreName My
```

If you are logged on to one of the machines in the cluster, since this already has the certificate installed locally you can simply run the Powershell command to connect to the cluster and show a list of nodes:

```
Connect-ServiceFabricCluster
Get-ServiceFabricNode
```
To remove the cluster call the following command:

```
.\RemoveServiceFabricCluster.ps1 -ClusterConfigFilePath .\ClusterConfig.X509.MultiMachine.json   -MicrosoftServiceFabricCabFilePath .\MicrosoftAzureServiceFabric.cab
```
