---
title: Secure a cluster on Windows by using certificates 
description: Secure communication within an Azure Service Fabric standalone or on-premises cluster, as well as between clients and the cluster.
author: dkkapur

ms.topic: conceptual
ms.date: 10/15/2017
ms.author: dekapur
---
# Secure a standalone cluster on Windows by using X.509 certificates
This article describes how to secure communication between the various nodes of your standalone Windows cluster. It also describes how to authenticate clients that connect to this cluster by using X.509 certificates. Authentication ensures that only authorized users can access the cluster and the deployed applications and perform management tasks. Certificate security should be enabled on the cluster when the cluster is created.  

For more information on cluster security, such as node-to-node security, client-to-node security, and role-based access control, see [Cluster security scenarios](service-fabric-cluster-security.md).

## Which certificates do you need?
To start with, [download the Service Fabric for Windows Server package](service-fabric-cluster-creation-for-windows-server.md#download-the-service-fabric-for-windows-server-package) to one of the nodes in your cluster. In the downloaded package, you find a ClusterConfig.X509.MultiMachine.json file. Open the file, and review the section for security under the properties section:

```JSON
"security": {
    "metadata": "The Credential type X509 indicates this cluster is secured by using X509 certificates. The thumbprint format is d5 ec 42 3b 79 cb e5 07 fd 83 59 3c 56 b9 d5 31 24 25 42 64.",
    "ClusterCredentialType": "X509",
    "ServerCredentialType": "X509",
    "CertificateInformation": {
        "ClusterCertificate": {
            "Thumbprint": "[Thumbprint]",
            "ThumbprintSecondary": "[Thumbprint]",
            "X509StoreName": "My"
        },        
        "ClusterCertificateCommonNames": {
            "CommonNames": [
            {
                "CertificateCommonName": "[CertificateCommonName]",
                "CertificateIssuerThumbprint": "[Thumbprint1,Thumbprint2,Thumbprint3,...]"
            }
            ],
            "X509StoreName": "My"
        },
        "ClusterCertificateIssuerStores": [
            {
                "IssuerCommonName": "[IssuerCommonName]",
                "X509StoreNames" : "Root"
            }
        ],
        "ServerCertificate": {
            "Thumbprint": "[Thumbprint]",
            "ThumbprintSecondary": "[Thumbprint]",
            "X509StoreName": "My"
        },
        "ServerCertificateCommonNames": {
            "CommonNames": [
            {
                "CertificateCommonName": "[CertificateCommonName]",
                "CertificateIssuerThumbprint": "[Thumbprint1,Thumbprint2,Thumbprint3,...]"
            }
            ],
            "X509StoreName": "My"
        },
        "ServerCertificateIssuerStores": [
            {
                "IssuerCommonName": "[IssuerCommonName]",
                "X509StoreNames" : "Root"
            }
        ],
        "ClientCertificateThumbprints": [
            {
                "CertificateThumbprint": "[Thumbprint]",
                "IsAdmin": false
            },
            {
                "CertificateThumbprint": "[Thumbprint]",
                "IsAdmin": true
            }
        ],
        "ClientCertificateCommonNames": [
            {
                "CertificateCommonName": "[CertificateCommonName]",
                "CertificateIssuerThumbprint": "[Thumbprint1,Thumbprint2,Thumbprint3,...]",
                "IsAdmin": true
            }
        ],
        "ClientCertificateIssuerStores": [
            {
                "IssuerCommonName": "[IssuerCommonName]",
                "X509StoreNames": "Root"
            }
        ]
        "ReverseProxyCertificate": {
            "Thumbprint": "[Thumbprint]",
            "ThumbprintSecondary": "[Thumbprint]",
            "X509StoreName": "My"
        },
        "ReverseProxyCertificateCommonNames": {
            "CommonNames": [
                {
                "CertificateCommonName": "[CertificateCommonName]"
                }
            ],
            "X509StoreName": "My"
        }
    }
},
```

This section describes the certificates that you need to secure your standalone Windows cluster. If you specify a cluster certificate, set the value of ClusterCredentialType to _X509_. If you specify a server certificate for outside connections, set the ServerCredentialType to _X509_. Although not mandatory, we recommend that you have both of these certificates for a properly secured cluster. If you set these values to *X509*, you also must specify the corresponding certificates or Service Fabric throws an exception. In some scenarios, you might want to specify only the _ClientCertificateThumbprints_ or the _ReverseProxyCertificate_. In those scenarios, you don't need to set _ClusterCredentialType_ or _ServerCredentialType_ to _X509_.


> [!NOTE]
> A [thumbprint](https://en.wikipedia.org/wiki/Public_key_fingerprint) is the primary identity of a certificate. To find out the thumbprint of the certificates that you create, see [Retrieve a thumbprint of a certificate](https://msdn.microsoft.com/library/ms734695.aspx).
> 
> 

The following table lists the certificates that you need on your cluster setup:

| **CertificateInformation setting** | **Description** |
| --- | --- |
| ClusterCertificate |Recommended for a test environment. This certificate is required to secure the communication between the nodes on a cluster. You can use two different certificates, a primary and a secondary, for upgrade. Set the thumbprint of the primary certificate in the Thumbprint section and that of the secondary in the ThumbprintSecondary variables. |
| ClusterCertificateCommonNames |Recommended for a production environment. This certificate is required to secure the communication between the nodes on a cluster. You can use one or two cluster certificate common names. The CertificateIssuerThumbprint corresponds to the thumbprint of the issuer of this certificate. If more than one certificate with the same common name is used, you can specify multiple issuer thumbprints.|
| ClusterCertificateIssuerStores |Recommended for a production environment. This certificate corresponds to the issuer of the cluster certificate. You can provide the issuer common name and corresponding store name under this section instead of specifying the issuer thumbprint under ClusterCertificateCommonNames.  This makes it easy to rollover cluster issuer certificates. Multiple issuers can be specified if more than one cluster certificate is used. An empty IssuerCommonName whitelists all certificates in the corresponding stores specified under X509StoreNames.|
| ServerCertificate |Recommended for a test environment. This certificate is presented to the client when it tries to connect to this cluster. For convenience, you can choose to use the same certificate for ClusterCertificate and ServerCertificate. You can use two different server certificates, a primary and a secondary, for upgrade. Set the thumbprint of the primary certificate in the Thumbprint section and that of the secondary in the ThumbprintSecondary variables. |
| ServerCertificateCommonNames |Recommended for a production environment. This certificate is presented to the client when it tries to connect to this cluster. The CertificateIssuerThumbprint corresponds to the thumbprint of the issuer of this certificate. If more than one certificate with the same common name is used, you can specify multiple issuer thumbprints. For convenience, you can choose to use the same certificate for ClusterCertificateCommonNames and ServerCertificateCommonNames. You can use one or two server certificate common names. |
| ServerCertificateIssuerStores |Recommended for a production environment. This certificate corresponds to the issuer of the server certificate. You can provide the issuer common name and corresponding store name under this section instead of specifying the issuer thumbprint under ServerCertificateCommonNames.  This makes it easy to rollover server issuer certificates. Multiple issuers can be specified if more than one server certificate is used. An empty IssuerCommonName whitelists all certificates in the corresponding stores specified under X509StoreNames.|
| ClientCertificateThumbprints |Install this set of certificates on the authenticated clients. You can have a number of different client certificates installed on the machines that you want to allow access to the cluster. Set the thumbprint of each certificate in the CertificateThumbprint variable. If you set IsAdmin to *true*, the client with this certificate installed on it can do administrator management activities on the cluster. If IsAdmin is *false*, the client with this certificate can perform the actions only allowed for user-access rights, typically read-only. For more information on roles, see [Role-Based Access Control (RBAC)](service-fabric-cluster-security.md#role-based-access-control-rbac). |
| ClientCertificateCommonNames |Set the common name of the first client certificate for the CertificateCommonName. The CertificateIssuerThumbprint is the thumbprint for the issuer of this certificate. To learn more about common names and the issuer, see [Work with certificates](https://msdn.microsoft.com/library/ms731899.aspx). |
| ClientCertificateIssuerStores |Recommended for a production environment. This certificate corresponds to the issuer of the client certificate (both admin and non-admin roles). You can provide the issuer common name and corresponding store name under this section instead of specifying the issuer thumbprint under ClientCertificateCommonNames.  This makes it easy to rollover client issuer certificates. Multiple issuers can be specified if more than one client certificate is used. An empty IssuerCommonName whitelists all certificates in the corresponding stores specified under X509StoreNames.|
| ReverseProxyCertificate |Recommended for a test environment. This optional certificate can be specified if you want to secure your [reverse proxy](service-fabric-reverseproxy.md). Make sure that reverseProxyEndpointPort is set in nodeTypes if you use this certificate. |
| ReverseProxyCertificateCommonNames |Recommended for a production environment. This optional certificate can be specified if you want to secure your [reverse proxy](service-fabric-reverseproxy.md). Make sure that reverseProxyEndpointPort is set in nodeTypes if you use this certificate. |

Here is an example cluster configuration where the cluster, server, and client certificates have been provided. For cluster/server/reverseProxy certificates, the thumbprint and the common name can't be configured together for the same certificate type.

 ```JSON
 {
    "name": "SampleCluster",
    "clusterConfigurationVersion": "1.0.0",
    "apiVersion": "10-2017",
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
    "properties": {
        "diagnosticsStore": {
        "metadata":  "Please replace the diagnostics store with an actual file share accessible from all cluster machines.",
        "dataDeletionAgeInDays": "7",
        "storeType": "FileShare",
        "IsEncrypted": "false",
        "connectionstring": "c:\\ProgramData\\SF\\DiagnosticsStore"
        },
        "security": {
            "metadata": "The Credential type X509 indicates this cluster is secured by using X509 certificates. The thumbprint format is d5 ec 42 3b 79 cb e5 07 fd 83 59 3c 56 b9 d5 31 24 25 42 64.",
            "ClusterCredentialType": "X509",
            "ServerCredentialType": "X509",
            "CertificateInformation": {
                "ClusterCertificateCommonNames": {
                  "CommonNames": [
                    {
                      "CertificateCommonName": "myClusterCertCommonName"
                    }
                  ],
                  "X509StoreName": "My"
                },
                "ClusterCertificateIssuerStores": [
                    {
                        "IssuerCommonName": "ClusterIssuer1",
                        "X509StoreNames" : "Root"
                    },
                    {
                        "IssuerCommonName": "ClusterIssuer2",
                        "X509StoreNames" : "Root"
                    }
                ],
                "ServerCertificateCommonNames": {
                  "CommonNames": [
                    {
                      "CertificateCommonName": "myServerCertCommonName",
                      "CertificateIssuerThumbprint": "7c fc 91 97 13 16 8d ff a8 ee 71 2b a2 f4 62 62 00 03 49 0d"
                    }
                  ],
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
            "clusterConnectionEndpointPort": "19001",
            "leaseDriverEndpointPort": "19002",
            "serviceConnectionEndpointPort": "19003",
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

## Certificate rollover
When you use a certificate common name instead of a thumbprint, certificate rollover doesn't require a cluster configuration upgrade. For issuer thumbprint upgrades, make sure that the new thumbprint list intersects with the old list. You first have to do a config upgrade with the new issuer thumbprints, and then install the new certificates (both cluster/server certificate and issuer certificates) in the store. Keep the old issuer certificate in the certificate store for at least two hours after you install the new issuer certificate.
If you are using issuer stores, then no config upgrade needs to be performed for issuer certificate rollover. Install the new issuer certificate with a latter expiration date in the corresponding certificate store and remove the old issuer certificate after a few hours.

## Acquire the X.509 certificates
To secure communication within the cluster, you first need to obtain X.509 certificates for your cluster nodes. Additionally, to limit connection to this cluster to authorized machines/users, you need to obtain and install certificates for the client machines.

For clusters that are running production workloads, use a [certificate authority (CA)](https://en.wikipedia.org/wiki/Certificate_authority)-signed X.509 certificate to secure the cluster. For more information on how to obtain these certificates, see [How to obtain a certificate](https://msdn.microsoft.com/library/aa702761.aspx). 

There are a number of properties that the certificate must have in order to function properly:

* The certificate's provider must be **Microsoft Enhanced RSA and AES Cryptographic Provider**

* When creating an RSA key, make sure the key is **2048 bits**.

* The Key Usage extension has a value of **Digital Signature, Key Encipherment (a0)**

* The Enhanced Key Usage extension has values of **Server Authentication** (OID: 1.3.6.1.5.5.7.3.1) and **Client Authentication** (OID: 1.3.6.1.5.5.7.3.2)

For clusters that you use for test purposes, you can choose to use a self-signed certificate.

For additional questions, consult [frequently asked certificate questions](https://docs.microsoft.com/azure/service-fabric/cluster-security-certificate-management#troubleshooting-and-frequently-asked-questions).

## Optional: Create a self-signed certificate
One way to create a self-signed certificate that can be secured correctly is to use the CertSetup.ps1 script in the Service Fabric SDK folder in the directory C:\Program Files\Microsoft SDKs\Service Fabric\ClusterSetup\Secure. Edit this file to change the default name of the certificate. (Look for the value CN=ServiceFabricDevClusterCert.) Run this script as `.\CertSetup.ps1 -Install`.

Now export the certificate to a .pfx file with a protected password. First, get the thumbprint of the certificate. 
1. From the **Start** menu, run **Manage computer certificates**. 

2. Go to the **Local Computer\Personal** folder, and find the certificate you created. 

3. Double-click the certificate to open it, select the **Details** tab, and scroll down to the **Thumbprint** field. 

4. Remove the spaces, and copy the thumbprint value into the following PowerShell command. 

5. Change the `String` value to a suitable secure password to protect it, and run the following in PowerShell:

   ```powershell   
   $pswd = ConvertTo-SecureString -String "1234" -Force –AsPlainText
   Get-ChildItem -Path cert:\localMachine\my\<Thumbprint> | Export-PfxCertificate -FilePath C:\mypfx.pfx -Password $pswd
   ```

6. To see the details of a certificate installed on the machine, run the following PowerShell command:

   ```powershell
   $cert = Get-Item Cert:\LocalMachine\My\<Thumbprint>
   Write-Host $cert.ToString($true)
   ```

Alternatively, if you have an Azure subscription, follow the steps in [Create a Service Fabric cluster by using Azure Resource Manager](service-fabric-cluster-creation-via-arm.md).

## Install the certificates
After you have certificates, you can install them on the cluster nodes. Your nodes need to have the latest Windows PowerShell 3.x installed on them. Repeat these steps on each node for both cluster and server certificates and any secondary certificates.

1. Copy the .pfx file or files to the node.

2. Open a PowerShell window as an administrator, and enter the following commands. Replace *$pswd* with the password that you used to create this certificate. Replace *$PfxFilePath* with the full path of the .pfx copied to this node.
   
    ```powershell
    $pswd = "1234"
    $PfxFilePath ="C:\mypfx.pfx"
    Import-PfxCertificate -Exportable -CertStoreLocation Cert:\LocalMachine\My -FilePath $PfxFilePath -Password (ConvertTo-SecureString -String $pswd -AsPlainText -Force)
    ```
3. Now set the access control on this certificate so that the Service Fabric process, which runs under the Network Service account, can use it by running the following script. Provide the thumbprint of the certificate and **NETWORK SERVICE** for the service account. You can check that the ACLs on the certificate are correct by opening the certificate in **Start** > **Manage computer certificates** and looking at **All Tasks** > **Manage Private Keys**.
   
    ```powershell
    param
    (
    [Parameter(Position=1, Mandatory=$true)]
    [ValidateNotNullOrEmpty()]
    [string]$pfxThumbPrint,
   
    [Parameter(Position=2, Mandatory=$true)]
    [ValidateNotNullOrEmpty()]
    [string]$serviceAccount
    )
   
    $cert = Get-ChildItem -Path cert:\LocalMachine\My | Where-Object -FilterScript { $PSItem.ThumbPrint -eq $pfxThumbPrint; }
   
    # Specify the user, the permissions, and the permission type
    $permission = "$($serviceAccount)","FullControl","Allow" # "NT AUTHORITY\NetworkService" is the service account
    $accessRule = New-Object -TypeName System.Security.AccessControl.FileSystemAccessRule -ArgumentList $permission
   
    # Location of the machine-related keys
    $keyPath = Join-Path -Path $env:ProgramData -ChildPath "\Microsoft\Crypto\RSA\MachineKeys"
    $keyName = $cert.PrivateKey.CspKeyContainerInfo.UniqueKeyContainerName
    $keyFullPath = Join-Path -Path $keyPath -ChildPath $keyName
   
    # Get the current ACL of the private key
    $acl = (Get-Item $keyFullPath).GetAccessControl('Access')
   
    # Add the new ACE to the ACL of the private key
    $acl.SetAccessRule($accessRule)
   
    # Write back the new ACL
    Set-Acl -Path $keyFullPath -AclObject $acl -ErrorAction Stop
   
    # Observe the access rights currently assigned to this certificate
    get-acl $keyFullPath| fl
    ```
4. Repeat the previous steps for each server certificate. You also can use these steps to install the client certificates on the machines that you want to allow access to the cluster.

## Create the secure cluster
After you configure the security section of the ClusterConfig.X509.MultiMachine.json file, you can proceed to the [Create the cluster](service-fabric-cluster-creation-for-windows-server.md#create-the-cluster) section to configure the nodes and create the standalone cluster. Remember to use the ClusterConfig.X509.MultiMachine.json file while you create the cluster. For example, your command might look like the following:

```powershell
.\CreateServiceFabricCluster.ps1 -ClusterConfigFilePath .\ClusterConfig.X509.MultiMachine.json
```

After you have the secure standalone Windows cluster successfully running and have set up the authenticated clients to connect to it, follow the steps in the section [Connect to a cluster using PowerShell](service-fabric-connect-to-secure-cluster.md#connect-to-a-cluster-using-powershell) to connect to it. For example:

```powershell
$ConnectArgs = @{  ConnectionEndpoint = '10.7.0.5:19000';  X509Credential = $True;  StoreLocation = 'LocalMachine';  StoreName = "MY";  ServerCertThumbprint = "057b9544a6f2733e0c8d3a60013a58948213f551";  FindType = 'FindByThumbprint';  FindValue = "057b9544a6f2733e0c8d3a60013a58948213f551"   }
Connect-ServiceFabricCluster $ConnectArgs
```

You can then run other PowerShell commands to work with this cluster. For example, you can run [Get-ServiceFabricNode](https://docs.microsoft.com/powershell/module/servicefabric/get-servicefabricnode?view=azureservicefabricps) to show a list of nodes on this secure cluster.


To remove the cluster, connect to the node on the cluster where you downloaded the Service Fabric package, open a command line, and go to the package folder. Now run the following command:

```powershell
.\RemoveServiceFabricCluster.ps1 -ClusterConfigFilePath .\ClusterConfig.X509.MultiMachine.json
```

> [!NOTE]
> Incorrect certificate configuration might prevent the cluster from coming up during deployment. To self-diagnose security issues, look in the Event Viewer group **Applications and Services Logs** > **Microsoft-Service Fabric**.
> 
> 

