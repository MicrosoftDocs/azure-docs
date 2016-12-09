---
title: Authenticate client access to a cluster | Microsoft Docs
description: Describes how to authenticate client access to a Service Fabric cluster and how to secure communication between clients and a cluster.
services: service-fabric
documentationcenter: .net
author: rwike77
manager: timlt
editor: ''

ms.assetid: 759a539e-e5e6-4055-bff5-d38804656e10
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/11/2016
ms.author: ryanwi

---
# Connect to a secure cluster
When a client connects to a Service Fabric cluster node, the client can be authenticated and secure communication established using certificate security or Azure Active Directory (AAD). This authentication ensures that only authorized users can access the cluster and deployed applications and perform management tasks.  Certificate or AAD security must have been previously enabled on the cluster when the cluster was created.  For more information on cluster security scenarios, see [Cluster security](service-fabric-cluster-security.md). If you are connecting to a cluster secured with certificates, [set up the client certificate](service-fabric-connect-to-secure-cluster.md#connectsecureclustersetupclientcert) on the computer that connects to the cluster.

<a id="connectsecureclustercli"></a> 

## Connect to a secure cluster using Azure CLI
The following Azure CLI commands describe how to connect to a secure cluster. 

### Connect to a secure cluster using a client certificate
The certificate details must match a certificate on the cluster nodes. 

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

After you connect, you should be able to [run other CLI commands](service-fabric-azure-cli.md) to interact with the cluster. 

<a id="connectsecurecluster"></a>

## Connect to a secure cluster using PowerShell
Before you perform operations on a cluster through PowerShell, first establish a connection to the cluster. The cluster connection is used for all subsequent commands in the given PowerShell session.

### Connect to an unsecure cluster

To connect to an unsecure cluster, provide the cluster endpoint address to the **Connect-ServiceFabricCluster** command:

```powershell
Connect-ServiceFabricCluster -ConnectionEndpoint <Cluster FQDN>:19000 
```

### Connect to a secure cluster using Azure Active Directory

To connect to a secure cluster that uses Azure Active Directory to authorize cluster administrator access, provide the cluster certificate thumbprint and use the *AzureActiveDirectory* flag.  

```powershell
Connect-ServiceFabricCluster -ConnectionEndpoint <Cluster FQDN>:19000 `
-ServerCertThumbprint <Server Certificate Thumbprint> `
-AzureActiveDirectory
```

### Connect to a secure cluster using a client certificate
Run the following PowerShell command to connect to a secure cluster that uses client certificates to authorize administrator access. Provide the cluster certificate thumbprint as well as the thumbprint of the client certificate that has been granted permissions for cluster management. The certificate details must match a certificate on the cluster nodes.

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


<a id="connectsecureclusterfabricclient"></a>

## Connect to a secure cluster using the FabricClient APIs
The Service Fabric SDK provides the [FabricClient](https://msdn.microsoft.com/library/system.fabric.fabricclient.aspx) class for cluster management. 

### Connect to an unsecure cluster

To connect to a remote unsecured cluster, create a FabricClient instance and provide the cluster address:

```csharp
FabricClient fabricClient = new FabricClient("clustername.westus.cloudapp.azure.com:19000");
```

For code that is running from within a cluster, for example, in a Reliable Service, create a FabricClient *without* specifying the cluster address. FabricClient connects to the local management gateway on the node the code is currently running on, avoiding an extra network hop.

```csharp
FabricClient fabricClient = new FabricClient();
```

### Connect to a secure cluster using a client certificate

The nodes in the cluster must have valid certificates whose common name or DNS name in SAN appears in the [RemoteCommonNames property](https://msdn.microsoft.com/library/azure/system.fabric.x509credentials.remotecommonnames.aspx) set on [FabricClient](https://msdn.microsoft.com/library/system.fabric.fabricclient.aspx). Following this process enables mutual authentication between the client and the cluster nodes.

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

### Connect to a secure cluster using Azure Active Directory

Following this process enables Azure Active Directory for client identity and server certificate for server identity.

To use interactive mode, which pops up an AAD interactive sign-in dialog:

```csharp
string serverCertThumb = "A8136758F4AB8962AF2BF3F27921BE1DF67F4326";
string connection = "clustername.westus.cloudapp.azure.com:19000";

ClaimsCredentials claimsCredentials = new ClaimsCredentials();
claimsCredentials.ServerThumbprints.Add(serverCertThumb);

FabricClient fc = new FabricClient(
    claimsCredentials,
    connection);

try
{
    var ret = fc.ClusterManager.GetClusterManifestAsync().Result;
    Console.WriteLine(ret.ToString());
}
catch (AggregateException ae)
{
    Console.WriteLine("Connect failed: {0}", ae.InnerException.Message);
}
catch (Exception e)
{
    Console.WriteLine("Connect failed: {0}", e.Message);
}
```

To use silent mode without any human interaction:

(This example relies on Microsoft.IdentityModel.Clients.ActiveDirectory, Version: 2.19.208020213

Refer to [Microsoft.IdentityModel.Clients.ActiveDirectory Namespace](https://msdn.microsoft.com/library/microsoft.identitymodel.clients.activedirectory.aspx) about how to acquire token and more information)

```csharp
string tenantId = "c15cfcea-02c1-40dc-8466-fbd0ee0b05d2";
string clientApplicationId = "118473c2-7619-46e3-a8e4-6da8d5f56e12";
string webApplicationId = "53E6948C-0897-4DA6-B26A-EE2A38A690B4";

string token = GetAccessToken(
    tenantId,
    webApplicationId,
    clientApplicationId,
    "urn:ietf:wg:oauth:2.0:oob"
    );

string serverCertThumb = "A8136758F4AB8962AF2BF3F27921BE1DF67F4326";
string connection = "clustername.westus.cloudapp.azure.com:19000";
ClaimsCredentials claimsCredentials = new ClaimsCredentials();
claimsCredentials.ServerThumbprints.Add(serverCertThumb);
claimsCredentials.LocalClaims = token;

FabricClient fc = new FabricClient(
   claimsCredentials,
   connection);

try
{
    var ret = fc.ClusterManager.GetClusterManifestAsync().Result;
    Console.WriteLine(ret.ToString());
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

static string GetAccessToken(
    string tenantId,
    string resource,
    string clientId,
    string redirectUri)
{
    string authorityFormat = @"https://login.microsoftonline.com/{0}";
    string authority = string.Format(CultureInfo.InvariantCulture, authorityFormat, tenantId);
    AuthenticationContext authContext = new AuthenticationContext(authority);

    string token = "";
    try
    {
        var authResult = authContext.AcquireToken(
            resource,
            clientId,
            new UserCredential("TestAdmin@clustenametenant.onmicrosoft.com", "TestPassword"));
        token = authResult.AccessToken;
    }
    catch (AdalException ex)
    {
        Console.WriteLine("Get AccessToken failed: {0}", ex.Message);
    }

    return token;
}

```

<a id="connectsecureclustersfx"></a>

## Connect to a secure cluster using Service Fabric Explorer
To reach [Service Fabric Explorer](service-fabric-visualizing-your-cluster.md) for a given cluster, point your browser to:

`http://<your-cluster-endpoint>:19080/Explorer`

The full URL is also available in the cluster essentials pane of the Azure portal.

### Connect to a secure cluster using Azure Active Directory

To connect to a cluster that is secured with AAD, point your browser to:

`https://<your-cluster-endpoint>:19080/Explorer`

You are automatically be prompted to log in with AAD.

### Connect to a secure cluster using a client certificate

To connect to a cluster that is secured with certifcates, point your browser to:

`https://<your-cluster-endpoint>:19080/Explorer`

You are automatically be prompted to select a client certificate.

<a id="connectsecureclustersetupclientcert"></a>
## Set up a client certificate on the remote computer
At least two certificates should be used for securing the cluster, one for the cluster and server certificate and another for client access.  We recommend that you also use additional secondary certificates and client access certificates.  To secure the communication between a client and a cluster node using certificate security, you first need to obtain and install the client certificate. The certificate can be installed into the Personal (My) store of the local computer or the current user.  You also need the thumbprint of the server certificate so that the client can authenticate the cluster.

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

## Next steps
* [Service Fabric Cluster upgrade process and expectations from you](service-fabric-cluster-upgrade.md)
* [Managing your Service Fabric applications in Visual Studio](service-fabric-manage-application-in-visual-studio.md).
* [Service Fabric Health model introduction](service-fabric-health-introduction.md)
* [Application Security and RunAs](service-fabric-application-runas-security.md)

