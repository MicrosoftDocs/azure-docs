<properties
   pageTitle="Authenticate client access to a cluster | Microsoft Azure"
   description="Describes how to authenticate client access to a Service Fabric cluster using certificates and how to secure communication between clients and a cluster."
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
   ms.date="08/25/2016"
   ms.author="ryanwi"/>

# Connect to a secure cluster without AAD
When a client connects to a Service Fabric cluster node, the client can be authenticated and secure communication established using certificate security. This authentication ensures that only authorized users can access the cluster and deployed applications and perform management tasks.  Certificate security must have been previously enabled on the cluster when the cluster was created.  At least two certificates should be used for securing the cluster, one for the cluster and server certificate and another for client access.  We recommend that you also use additional secondary certificates and client access certificates.  For more information on cluster security scenarios, see [Cluster security](service-fabric-cluster-security.md).

To secure the communication between a client and a cluster node using certificate security, you first need to obtain and install the client certificate. The certificate can be installed into the Personal (My) store of the local computer or the current user.  You also need the thumbprint of the server certificate so that the client can authenticate the cluster.


Run the following PowerShell cmdlet to set up the client certificate on the computer from which you access the cluster.

```powershell
Import-PfxCertificate -Exportable -CertStoreLocation Cert:\CurrentUser\My `
        -FilePath C:\docDemo\certs\DocDemoClusterCert.pfx `
        -Password (ConvertTo-SecureString -String test -AsPlainText -Force)
```

If it is a self-signed certificate, you need to import it to your machine's "trusted people" store before you can use this certificate to connect to a secure cluster.

```powershell
Import-PfxCertificate -Exportable -CertStoreLocation Cert:\CurrentUser\TrustedPeople `
-FilePath C:\docDemo\certs\DocDemoClusterCert.pfx `
-Password (ConvertTo-SecureString -String test -AsPlainText -Force)
```
<a id="connectsecureclustercli"></a> 
## Connect to a secure cluster using Azure CLI without AAD

The following Azure CLI commands describe how to connect to a secure cluster. The certificate details must match a certificate on the cluster nodes. 
 
If your certificate has Certificate Authorities (CAs), you need to add the parameter `--ca-cert-path` as shown in the following example: 

```
 azure servicefabric cluster connect --connection-endpoint https://ip:19080 --client-key-path /tmp/key --client-cert-path /tmp/cert --ca-cert-path /tmp/ca1,/tmp/ca2 
```
If you have multiple CAs, use commas as the delimiter. 

 
If your Common Name in the certificate does not match the connection endpoint, you could use the parameter `--strict-ssl-false` to bypass the verification. 

```
azure servicefabric cluster connect --connection-endpoint https://ip:19080 --client-key-path /tmp/key --client-cert-path /tmp/cert --ca-cert-path /tmp/ca1,/tmp/ca2 --strict-ssl-false 
```
 
If you would like to skip the CA verification, you could add the ``--reject-unauthorized-false`` parameter, like the following command:

```
azure servicefabric cluster connect --connection-endpoint https://ip:19080 --client-key-path /tmp/key --client-cert-path /tmp/cert --reject-unauthorized-false 
```
 
For connecting to a cluster secured with a self-signed certificate, use the following command removing both the CA verification and Common Name verification:

```
azure servicefabric cluster connect --connection-endpoint https://ip:19080 --client-key-path /tmp/key --client-cert-path /tmp/cert --strict-ssl-false --reject-unauthorized-false
```

After you connect, you should be able to run other CLI commands to interact with the cluster. 

<a id="connectsecurecluster"></a>
## Connect to a secure cluster using PowerShell without AAD

Run the following PowerShell command to connect to a secure cluster. The certificate details must match a certificate on the cluster nodes.

```powershell
Connect-ServiceFabricCluster -ConnectionEndpoint <Cluster FQDN>:19000 `
          -KeepAliveIntervalInSec 10 `
          -X509Credential -ServerCertThumbprint <Certificate Thumbprint> `
          -FindType FindByThumbprint -FindValue <Certificate Thumbprint> `
          -StoreLocation CurrentUser -StoreName My
```

*ServerCertThumbprint* is the thumbprint of the server certificate installed on the cluster nodes. *FindValue* is the thumbprint of the admin client certificate.
When the parameters are filled in, the command looks like the following example: 

```powershell
Connect-ServiceFabricCluster -ConnectionEndpoint clustername.westus.cloudapp.azure.com:19000 `
          -KeepAliveIntervalInSec 10 `
          -X509Credential -ServerCertThumbprint A8136758F4AB8962AF2BF3F27921BE1DF67F4326 `
          -FindType FindByThumbprint -FindValue 71DE04467C9ED0544D021098BCD44C71E183414E `
          -StoreLocation CurrentUser -StoreName My
```




## Connect to a secure cluster using the FabricClient APIs

For more information on FabricClient APIs, see [FabricClient](https://msdn.microsoft.com/library/system.fabric.fabricclient.aspx). The nodes in the cluster must have valid certificates whose common name or DNS name in SAN appears in the [RemoteCommonNames property](https://msdn.microsoft.com/library/azure/system.fabric.x509credentials.remotecommonnames.aspx) set on [FabricClient](https://msdn.microsoft.com/library/system.fabric.fabricclient.aspx). Following this process enables mutual authentication between the client and the cluster nodes.

```csharp
string clientCertThumb = "71DE04467C9ED0544D021098BCD44C71E183414E";
string serverCertThumb = "A8136758F4AB8962AF2BF3F27921BE1DF67F4326";
string CommonName = "www.clustername.westus.azure.com";
string connection = "clustername.westus.cloudapp.azure.com:19000";

X509Credentials xc = GetCredentials(clientCertThumb, serverCertThumb, CommonName);
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

static X509Credentials GetCredentials(string clientCertThumb, string serverCertThumb, string name)
{
    X509Credentials xc = new X509Credentials();

    // Client certificate
    xc.StoreLocation = StoreLocation.CurrentUser;
    xc.StoreName = "MY";
    xc.FindType = X509FindType.FindByThumbprint;
    xc.FindValue = thumb;

    // Server certificate
    xc.RemoteCertThumbprints.Add(thumb);
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
