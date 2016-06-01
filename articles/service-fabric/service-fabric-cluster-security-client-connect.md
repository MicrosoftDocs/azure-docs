<properties
   pageTitle="Secure client access to a cluster | Microsoft Azure"
   description="How to secure a Service Fabric cluster. What are the options?"
   services="service-fabric"
   documentationCenter=".net"
   authors="rwike77"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/27/2016"
   ms.author="ryanwi"/>

# Authenticate and secure communication between a client and a cluster using certificate security
When a client connects to a Service Fabric cluster node, certificate security can be used to authenticate the client and secure communication with the cluster. This ensures that only authorized users can access the cluster and the applications deployed on the cluster.  Certificate security must have been previously enabled on the cluster when the cluster was created.

To secure the communication between a client and a  cluster node using Certificate Security, you first need to obtain and install the client certificate into the personal (My) store on the local computer or the Personal store for the current user. Note that if My store is used, the certificates needs to be added to the access control list (ACL).

Run the following PowerShell cmdlet to set up the certificate on the computer from which you will use to access the cluster.

```powershell
Import-PfxCertificate -Exportable -CertStoreLocation Cert:\CurrentUser\My `
        -FilePath C:\docDemo\certs\DocDemoClusterCert.pfx `
        -Password (ConvertTo-SecureString -String test -AsPlainText -Force)
```

If it is a self-signed certificate, you will need to import it to your machine's "trusted people" store before you can use this certificate to connect to a secure cluster.

```powershell
Import-PfxCertificate -Exportable -CertStoreLocation Cert:\CurrentUser\TrustedPeople `
-FilePath C:\docDemo\certs\DocDemoClusterCert.pfx `
-Password (ConvertTo-SecureString -String test -AsPlainText -Force)
```

## Connect to a secure cluster using PowerShell

Run the following PowerShell command to connect to a secure cluster. The certificate details are the same ones that you gave when setting up the cluster.

```powershell
Connect-ServiceFabricCluster -ConnectionEndpoint <Cluster FQDN>:19000 `
          -KeepAliveIntervalInSec 10 `
          -X509Credential -ServerCertThumbprint <Certificate Thumbprint> `
          -FindType FindByThumbprint -FindValue <Certificate Thumbprint> `
          -StoreLocation CurrentUser -StoreName My
```

For example, the PowerShell command above should look similar to the following:

```powershell
Connect-ServiceFabricCluster -ConnectionEndpoint clustername.westus.cloudapp.azure.com:19000 `
          -KeepAliveIntervalInSec 10 `
          -X509Credential -ServerCertThumbprint C179E609BBF0B227844342535142306F3913D6ED `
          -FindType FindByThumbprint -FindValue C179E609BBF0B227844342535142306F3913D6ED `
          -StoreLocation CurrentUser -StoreName My
```

## Connect to a secure cluster using the FabricClient APIs
The following [FabricClient](https://msdn.microsoft.com/library/system.fabric.fabricclient.aspx). The nodes in the cluster must have valid certificates whose common name or DNS name in SAN appears in the [RemoteCommonNames property](https://msdn.microsoft.com/library/azure/system.fabric.x509credentials.remotecommonnames.aspx) set on [FabricClient](https://msdn.microsoft.com/library/system.fabric.fabricclient.aspx). This enables mutual authentication between the client and the cluster node.

```csharp
string thumb = "C179E609BBF0B227844342535142306F3913D6ED";
string CommonName = "www.clustername.westus.azure.com";
string connection = "clustername.westus.cloudapp.azure.com:19000";

X509Credentials xc = GetCredentials(thumb, CommonName);
FabricClient fc = new FabricClient(xc, connection);
Task<bool> t = fc.PropertyManager.NameExistsAsync(new Uri("fabric:/any"));
try
{
    bool result = t.Result;
    Console.WriteLine("Cluster is connected");
}
catch (AggregateException ae)
{
    Console.WriteLine("Connect failed: {0}", ae.InnerException.Message);
}
catch (Exception e)
{
    Console.WriteLine("Connect failed: {0}", e.Message);
}

...

static X509Credentials GetCredentials(string thumb, string name)
{
    X509Credentials xc = new X509Credentials();
    xc.StoreLocation = StoreLocation.CurrentUser;
    xc.StoreName = "MY";
    xc.FindType = X509FindType.FindByThumbprint;
    xc.FindValue = thumb;
    xc.RemoteCommonNames.Add(name);
    xc.ProtectionLevel = ProtectionLevel.EncryptAndSign;
    return xc;
}
```


## Next steps

- [Service Fabric Cluster upgrade process and expectations from you](service-fabric-cluster-upgrade.md)
- [Managing your Service Fabric applications in Visual Studio](service-fabric-manage-application-in-visual-studio.md).
- [Service Fabric Health model introduction](service-fabric-health-introduction.md)
- [Application Security and RunAs](service-fabric-application-runas-security.md)
