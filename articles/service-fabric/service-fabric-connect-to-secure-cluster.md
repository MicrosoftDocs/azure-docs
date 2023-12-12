---
title: Connect securely to an Azure Service Fabric cluster 
description: Describes how to authenticate client access to a Service Fabric cluster and how to secure communication between clients and a cluster.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# Connect to a secure cluster

When a client connects to a Service Fabric cluster node, the client can be authenticated and secure communication established using certificate security or Microsoft Entra ID. This authentication ensures that only authorized users can access the cluster and deployed applications and perform management tasks.  Certificate or Microsoft Entra security must have been previously enabled on the cluster when the cluster was created.  For more information on cluster security scenarios, see [Cluster security](service-fabric-cluster-security.md). If you are connecting to a cluster secured with certificates, [set up the client certificate](service-fabric-connect-to-secure-cluster.md#connectsecureclustersetupclientcert) on the computer that connects to the cluster. 

<a id="connectsecureclustercli"></a> 

## Connect to a secure cluster using Azure Service Fabric CLI (sfctl)

There are a few different ways to connect to a secure cluster using the Service Fabric CLI (sfctl). When using a client
certificate for authentication, the certificate details must match a certificate deployed to the cluster nodes. If your
certificate has Certificate Authorities (CAs), you need to additionally specify the trusted CAs.

You can connect to a cluster using the `sfctl cluster select` command.

Client certificates can be specified in two different fashions, either as a cert and key pair, or as a single PFX
file. For password protected PEM files, you will be prompted automatically to enter the password. If you obtained the client certificate as a PFX file, first convert the PFX file to a PEM file using the following command. 

```shell
openssl pkcs12 -in your-cert-file.pfx -out your-cert-file.pem -nodes -passin pass:your-pfx-password
```

If your .pfx file is not password protected, use -passin pass: for the last parameter.

To specify the client certificate as a pem file, specify the file path in the `--pem` argument. For example:

```shell
sfctl cluster select --endpoint https://testsecurecluster.com:19080 --pem ./client.pem
```

Password protected pem files will prompt for password prior to running any command.

To specify a cert, key pair use the `--cert` and `--key` arguments to specify the file paths to each respective
file.

```shell
sfctl cluster select --endpoint https://testsecurecluster.com:19080 --cert ./client.crt --key ./keyfile.key
```

Sometimes certificates used to secure test or dev clusters fail certificate validation. To bypass certificate
verification, specify the `--no-verify` option. For example:

> [!WARNING]
> Do not use the `no-verify` option when connecting to production Service Fabric clusters.

```shell
sfctl cluster select --endpoint https://testsecurecluster.com:19080 --pem ./client.pem --no-verify
```

In addition, you can specify paths to directories of trusted CA certs, or individual certs. To specify these
paths, use the `--ca` argument. For example:

```shell
sfctl cluster select --endpoint https://testsecurecluster.com:19080 --pem ./client.pem --ca ./trusted_ca
```

After you connect, you should be able to [run other sfctl commands](service-fabric-cli.md) to interact
with the cluster.

<a id="connectsecurecluster"></a>

## Connect to a cluster using PowerShell
Before you perform operations on a cluster through PowerShell, first establish a connection to the cluster. The cluster connection is used for all subsequent commands in the given PowerShell session.

### Connect to an unsecure cluster

To connect to an unsecure cluster, provide the cluster endpoint address to the **Connect-ServiceFabricCluster** command:

```powershell
Connect-ServiceFabricCluster -ConnectionEndpoint <Cluster FQDN>:19000 
```

<a name='connect-to-a-secure-cluster-using-azure-active-directory'></a>

### Connect to a secure cluster using Microsoft Entra ID

To connect to a secure cluster that uses Microsoft Entra ID to authorize cluster administrator access, provide the cluster certificate thumbprint and use the *AzureActiveDirectory* flag.  

```powershell
Connect-ServiceFabricCluster -ConnectionEndpoint <Cluster FQDN>:19000 `
-ServerCertThumbprint <Server Certificate Thumbprint> `
-AzureActiveDirectory
```

### Connect to a secure cluster using a client certificate
Run the following PowerShell command to connect to a secure cluster that uses client certificates to authorize administrator access. 

#### Connect using certificate common name
Provide the cluster certificate common name and the common name of the client certificate that has been granted permissions for cluster management. The certificate details must match a certificate on the cluster nodes.

```powershell
Connect-serviceFabricCluster -ConnectionEndpoint $ClusterName -KeepAliveIntervalInSec 10 `
    -X509Credential `
    -ServerCommonName <certificate common name>  `
    -FindType FindBySubjectName `
    -FindValue <certificate common name> `
    -StoreLocation CurrentUser `
    -StoreName My 
```
*ServerCommonName* is the common name of the server certificate installed on the cluster nodes. *FindValue* is the common name of the admin client certificate. When the parameters are filled in, the command looks like the following example:
```powershell
$ClusterName= "sf-commonnametest-scus.southcentralus.cloudapp.azure.com:19000"
$certCN = "sfrpe2eetest.southcentralus.cloudapp.azure.com"

Connect-serviceFabricCluster -ConnectionEndpoint $ClusterName -KeepAliveIntervalInSec 10 `
    -X509Credential `
    -ServerCommonName $certCN  `
    -FindType FindBySubjectName `
    -FindValue $certCN `
    -StoreLocation CurrentUser `
    -StoreName My 
```

#### Connect using certificate thumbprint
Provide the cluster certificate thumbprint and the thumbprint of the client certificate that has been granted permissions for cluster management. The certificate details must match a certificate on the cluster nodes.

```powershell
Connect-ServiceFabricCluster -ConnectionEndpoint <Cluster FQDN>:19000 `  
          -KeepAliveIntervalInSec 10 `  
          -X509Credential -ServerCertThumbprint <Certificate Thumbprint> `  
          -FindType FindByThumbprint -FindValue <Certificate Thumbprint> `  
          -StoreLocation CurrentUser -StoreName My
```

*ServerCertThumbprint* is the thumbprint of the server certificate installed on the cluster nodes. *FindValue* is the thumbprint of the admin client certificate.  When the parameters are filled in, the command looks like the following example:

```powershell
Connect-ServiceFabricCluster -ConnectionEndpoint clustername.westus.cloudapp.azure.com:19000 `  
          -KeepAliveIntervalInSec 10 `  
          -X509Credential -ServerCertThumbprint A8136758F4AB8962AF2BF3F27921BE1DF67F4326 `  
          -FindType FindByThumbprint -FindValue 71DE04467C9ED0544D021098BCD44C71E183414E `  
          -StoreLocation CurrentUser -StoreName My 
```

### Connect to a secure cluster using Windows Active Directory
If your standalone cluster is deployed using AD security, connect to the cluster by appending the switch "WindowsCredential".

```powershell
Connect-ServiceFabricCluster -ConnectionEndpoint <Cluster FQDN>:19000 `
          -WindowsCredential
```

<a id="connectsecureclusterfabricclient"></a>

## Connect to a cluster using the FabricClient APIs
The Service Fabric SDK provides the [FabricClient](/dotnet/api/system.fabric.fabricclient) class for cluster management. To use the FabricClient APIs, get the Microsoft.ServiceFabric NuGet package.

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

The nodes in the cluster must have valid certificates whose common name or DNS name in SAN appears in the [RemoteCommonNames property](/dotnet/api/system.fabric.x509credentials) set on [FabricClient](/dotnet/api/system.fabric.fabricclient). Following this process enables mutual authentication between the client and the cluster nodes.

```csharp
using System.Fabric;
using System.Security.Cryptography.X509Certificates;

string clientCertThumb = "71DE04467C9ED0544D021098BCD44C71E183414E";
string serverCertThumb = "A8136758F4AB8962AF2BF3F27921BE1DF67F4326";
string CommonName = "www.clustername.westus.azure.com";
string connection = "clustername.westus.cloudapp.azure.com:19000";

var xc = GetCredentials(clientCertThumb, serverCertThumb, CommonName);
var fc = new FabricClient(xc, connection);

try
{
    var ret = fc.ClusterManager.GetClusterManifestAsync().Result;
    Console.WriteLine(ret.ToString());
}
catch (Exception e)
{
    Console.WriteLine("Connect failed: {0}", e.Message);
}

static X509Credentials GetCredentials(string clientCertThumb, string serverCertThumb, string name)
{
    X509Credentials xc = new X509Credentials();
    xc.StoreLocation = StoreLocation.CurrentUser;
    xc.StoreName = "My";
    xc.FindType = X509FindType.FindByThumbprint;
    xc.FindValue = clientCertThumb;
    xc.RemoteCommonNames.Add(name);
    xc.RemoteCertThumbprints.Add(serverCertThumb);
    xc.ProtectionLevel = ProtectionLevel.EncryptAndSign;
    return xc;
}
```

<a name='connect-to-a-secure-cluster-interactively-using-azure-active-directory'></a>

### Connect to a secure cluster interactively using Microsoft Entra ID

The following example uses Microsoft Entra ID for client identity and server certificate for server identity.

A dialog window automatically pops up for interactive sign-in upon connecting to the cluster.

```csharp
string serverCertThumb = "A8136758F4AB8962AF2BF3F27921BE1DF67F4326";
string connection = "clustername.westus.cloudapp.azure.com:19000";

var claimsCredentials = new ClaimsCredentials();
claimsCredentials.ServerThumbprints.Add(serverCertThumb);

var fc = new FabricClient(claimsCredentials, connection);

try
{
    var ret = fc.ClusterManager.GetClusterManifestAsync().Result;
    Console.WriteLine(ret.ToString());
}
catch (Exception e)
{
    Console.WriteLine("Connect failed: {0}", e.Message);
}
```

<a name='connect-to-a-secure-cluster-non-interactively-using-azure-active-directory'></a>

### Connect to a secure cluster non-interactively using Microsoft Entra ID

The following example relies on Microsoft.Identity.Client, Version: 4.37.0.

For more information on Microsoft Entra token acquisition, see [Microsoft.Identity.Client](/dotnet/api/microsoft.identity.client?view=azure-dotnet&preserve-view=true).

```csharp
string tenantId = "C15CFCEA-02C1-40DC-8466-FBD0EE0B05D2";
string clientApplicationId = "118473C2-7619-46E3-A8E4-6DA8D5F56E12";
string webApplicationId = "53E6948C-0897-4DA6-B26A-EE2A38A690B4";
string[] scopes = new string[] { "user.read" };

var pca = PublicClientApplicationBuilder.Create(clientApplicationId)
    .WithAuthority($"https://login.microsoftonline.com/{tenantId}")
    .WithRedirectUri("urn:ietf:wg:oauth:2.0:oob")
    .Build();

var accounts = await pca.GetAccountsAsync();
var result = await pca.AcquireTokenInteractive(scopes)
    .WithAccount(accounts.FirstOrDefault())
    .ExecuteAsync();

string token = result.AccessToken;

string serverCertThumb = "A8136758F4AB8962AF2BF3F27921BE1DF67F4326";
string connection = "clustername.westus.cloudapp.azure.com:19000";

var claimsCredentials = new ClaimsCredentials();
claimsCredentials.ServerThumbprints.Add(serverCertThumb);
claimsCredentials.LocalClaims = token;

var fc = new FabricClient(claimsCredentials, connection);

try
{
    var ret = fc.ClusterManager.GetClusterManifestAsync().Result;
    Console.WriteLine(ret.ToString());
}
catch (Exception e)
{
    Console.WriteLine("Connect failed: {0}", e.Message);
}
```

<a name='connect-to-a-secure-cluster-without-prior-metadata-knowledge-using-azure-active-directory'></a>

### Connect to a secure cluster without prior metadata knowledge using Microsoft Entra ID

The following example uses non-interactive token acquisition, but the same approach can be used to build a custom interactive token acquisition experience. The Microsoft Entra metadata needed for token acquisition is read from cluster configuration.

```csharp
string serverCertThumb = "A8136758F4AB8962AF2BF3F27921BE1DF67F4326";
string connection = "clustername.westus.cloudapp.azure.com:19000";

var claimsCredentials = new ClaimsCredentials();
claimsCredentials.ServerThumbprints.Add(serverCertThumb);

var fc = new FabricClient(claimsCredentials, connection);

fc.ClaimsRetrieval += async (o, e) =>
{
    var accounts = await PublicClientApplicationBuilder
        .Create("<client_id>")
        .WithAuthority(AzureCloudInstance.AzurePublic, "<tenant_id>")
        .WithRedirectUri("<redirect_uri>")
        .Build()
        .GetAccountsAsync();

    var result = await PublicClientApplicationBuilder
        .Create("<client_id>")
        .WithAuthority(AzureCloudInstance.AzurePublic, "<tenant_id>")
        .WithRedirectUri("<redirect_uri>")
        .Build()
        .AcquireTokenInteractive(new[] { "<scope>" })
        .WithAccount(accounts.FirstOrDefault())
        .ExecuteAsync();

    return result.AccessToken;
};

try
{
    var ret = fc.ClusterManager.GetClusterManifestAsync().Result;
    Console.WriteLine(ret.ToString());
}
catch (Exception e)
{
    Console.WriteLine("Connect failed: {0}", e.Message);
}
```

<a id="connectsecureclustersfx"></a>

## Connect to a secure cluster using Service Fabric Explorer
To reach [Service Fabric Explorer](service-fabric-visualizing-your-cluster.md) for a given cluster, point your browser to:

`http://<your-cluster-endpoint>:19080/Explorer`

The full URL is also available in the cluster essentials pane of the Azure portal.

For connecting to a secure cluster on Windows or OS X using a browser, you can import the client certificate, and the browser will prompt you for the certificate to use for connecting to the cluster.  On Linux machines, the certificate will have to be imported using advanced browser settings (each browser has different mechanisms) and point it to the certificate location on disk. Read [Set up a client certificate](#connectsecureclustersetupclientcert) for more information.

<a name='connect-to-a-secure-cluster-using-azure-active-directory'></a>

### Connect to a secure cluster using Microsoft Entra ID

To connect to a cluster that is secured with Microsoft Entra ID, point your browser to:

`https://<your-cluster-endpoint>:19080/Explorer`

You are automatically be prompted to sign in with Microsoft Entra ID.

### Connect to a secure cluster using a client certificate

To connect to a cluster that is secured with certificates, point your browser to:

`https://<your-cluster-endpoint>:19080/Explorer`

You are automatically be prompted to select a client certificate.

<a id="connectsecureclustersetupclientcert"></a>

## Set up a client certificate on the remote computer

At least two certificates should be used for securing the cluster, one for the cluster and server certificate and another for client access.  We recommend that you also use additional secondary certificates and client access certificates.  To secure the communication between a client and a cluster node using certificate security, you first need to obtain and install the client certificate. The certificate can be installed into the Personal (My) store of the local computer or the current user.  You also need the thumbprint of the server certificate so that the client can authenticate the cluster.

* On Windows: Double-click the PFX file and follow the prompts to install the certificate in your personal store, `Certificates - Current User\Personal\Certificates`. Alternatively, you can use the PowerShell command:

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

* On Mac: Double-click the PFX file and follow the prompts to install the certificate in your Keychain.

## Next steps

* [Service Fabric Cluster upgrade process and expectations from you](service-fabric-cluster-upgrade.md)
* [Managing your Service Fabric applications in Visual Studio](service-fabric-manage-application-in-visual-studio.md)
* [Service Fabric Health model introduction](service-fabric-health-introduction.md)
* [Application Security and RunAs](service-fabric-application-runas-security.md)
* [Getting started with Service Fabric CLI](service-fabric-cli.md)
