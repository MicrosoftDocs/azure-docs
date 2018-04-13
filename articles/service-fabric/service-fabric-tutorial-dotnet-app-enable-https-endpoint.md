---
title: Add an HTTPS endpoint to an Azure Service Fabric application | Microsoft Docs
description: In this tutorial, you learn how to add an HTTPS endpoint to an ASP.NET Core front-end web servcie and deploy the application to a cluster.
services: service-fabric
documentationcenter: .net
author: rwike77
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: tutorial
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 04/12/2018
ms.author: ryanwi
ms.custom: mvc

---

# Tutorial: Add an HTTPS endpoint to an ASP.NET Core Web API front-end service
This tutorial is part three of a series.  You will learn how to enable HTTPS in an ASP.NET Core service running on Service Fabric. When you're finished, you have a voting application with an HTTPS-enabled ASP.NET Core web front-end. If you don't want to manually create the voting application in [Build a .NET Service Fabric application](service-fabric-tutorial-deploy-app-to-party-cluster.md), you can [download the source code](https://github.com/Azure-Samples/service-fabric-dotnet-quickstart/) for the completed application.

In part three of the series, you learn how to:

> [!div class="checklist"]
> * Define an HTTPS endpoint in the service
> * Configure Kestrel to use HTTPS
> * Install the SSL certificate on the remote cluster nodes
> * Give NETWORK SERVICE access to the certificate's private key
> * Open port 443 in the Azure load balancer
> * Deploy the application to a remote cluster

In this tutorial series you learn how to:
> [!div class="checklist"]
> * [Build a .NET Service Fabric application](service-fabric-tutorial-deploy-app-to-party-cluster.md)
> * [Deploy the application to a remote cluster](service-fabric-tutorial-deploy-app-to-party-cluster.md)
> * Add an HTTPS endpoint to an ASP.NET Core front-end service
> * [Configure CI/CD using Visual Studio Team Services](service-fabric-tutorial-deploy-app-with-cicd-vsts.md)
> * [Set up monitoring and diagnostics for the application](service-fabric-tutorial-monitoring-aspnet.md)

## Prerequisites
Before you begin this tutorial:
- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- [Install Visual Studio 2017](https://www.visualstudio.com/) version 15.5 or later with the **Azure development** and **ASP.NET and web development** workloads.
- [Install the Service Fabric SDK](service-fabric-get-started.md)

## Obtain a certificate or create a self-signed development certificate
In order to enable HTTPS you need a digital certificate.  For production applications, use a certificate from a [certificate authority (CA)](https://wikipedia.org/wiki/Certificate_authority). For development and test purposes, you can create and use a self-signed certificate. Open a command prompt as administrator and use the New-SelfSignedCertificate Powershell cmdlet to generate a self-signed certificate for development:

```powershell
PS C:\Users\sfuser>New-SelfSignedCertificate -NotBefore (Get-Date) -NotAfter (Get-Date).AddYears(1) -Subject "localhost" -KeyAlgorithm "RSA" -KeyLength 2048 -HashAlgorithm "SHA256" -CertStoreLocation "Cert:\LocalMachine\My" -KeyUsage KeyEncipherment -FriendlyName "HTTPS development certificate" -TextExtension @("2.5.29.19={critical}{text}","2.5.29.37={critical}{text}1.3.6.1.5.5.7.3.1","2.5.29.17={critical}{text}DNS=localhost")

   PSParentPath: Microsoft.PowerShell.Security\Certificate::LocalMachine\My

Thumbprint                                Subject
----------                                -------
A2A3C6529DC9BE3C667B7833E519F51DE6F04994  CN=localhost
```

## Define an HTTPS endpoint in the service manifest
In the service manifest, add an endpoint in the **Endpoints** section.  Set the protocol to *https*, the type to *Input*, and port to *443*.

```xml
<?xml version="1.0" encoding="utf-8"?>
<ServiceManifest Name="VotingWebPkg"
                 Version="1.0.0"
                 xmlns="http://schemas.microsoft.com/2011/01/fabric"
                 xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <ServiceTypes>
    <StatelessServiceType ServiceTypeName="VotingWebType" />
  </ServiceTypes>

  <CodePackage Name="Code" Version="1.0.0">
    <EntryPoint>
      <ExeHost>
        <Program>VotingWeb.exe</Program>
        <WorkingFolder>CodePackage</WorkingFolder>
      </ExeHost>
    </EntryPoint>
  </CodePackage>

  <ConfigPackage Name="Config" Version="1.0.0" />

  <Resources>
    <Endpoints>
      <!-- This endpoint is used by the communication listener to obtain the port on which to 
           listen. Please note that if your service is partitioned, this port is shared with 
           replicas of different partitions that are placed in your code. -->
      <Endpoint Protocol="https" Name="EndpointHttps" Type="Input" Port="443" />
    </Endpoints>
  </Resources>
</ServiceManifest>
```


## Configure Kestrel to use HTTPS
Open VotingWeb.cs.  Add the following using statements: 
```csharp
using System.Net;
using Microsoft.Extensions.Configuration;
using System.Security.Cryptography.X509Certificates;
```

Update the `ServiceInstanceListener` to use the new *EndpointHttps* endpoint and listen on port 443. 

```csharp
new ServiceInstanceListener(
serviceContext =>
    new KestrelCommunicationListener(
        serviceContext,
        "EndpointHttps",
        (url, listener) =>
        {
            ServiceEventSource.Current.ServiceMessage(serviceContext, $"Starting Kestrel on {url}");

            return new WebHostBuilder()
                .UseKestrel(opt =>
                {
                    opt.Listen(IPAddress.IPv6Any, 443, listenOptions =>
                    {
                        listenOptions.UseHttps(GetCertificateFromStore());
                        listenOptions.NoDelay = true;
                    });
                })
                .ConfigureAppConfiguration((builderContext, config) =>
                {
                    config.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
                })

                .ConfigureServices(
                    services => services
                        .AddSingleton<HttpClient>(new HttpClient())
                        .AddSingleton<FabricClient>(new FabricClient())
                        .AddSingleton<StatelessServiceContext>(serviceContext))
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseStartup<Startup>()
                .UseServiceFabricIntegration(listener, ServiceFabricIntegrationOptions.None)
                .UseUrls(url)
                .Build();
        }))
```

Also add the following method so that Kestrel can get the certificate from the LocalMachine store.  Replace "&lt;your_CN_value&gt;" with "localhost" if you created a self-signed certificate with the previous PowerShell command, or use the CN of your certificate.

```csharp
private X509Certificate2 GetCertificateFromStore()
{
	var store = new X509Store(StoreName.My, StoreLocation.LocalMachine);
	try
	{
		store.Open(OpenFlags.ReadOnly);
		var certCollection = store.Certificates;
		var currentCerts = certCollection.Find(X509FindType.FindBySubjectDistinguishedName, "CN=<your_CN_value>", false);
		return currentCerts.Count == 0 ? null : currentCerts[0];
	}
	finally
	{
		store.Close();
	}
}
```

## Run the application locally
In Solution Explorer, select the **Voting** application and set the **Application URL** property to "https://localhost:443".

Save all files and hit F5 to run the application locally.

## Install certificate on cluster nodes

```powershell
Connect-AzureRmAccount

$vaultname="sftestvault"
$certname="VotingApp2PFX"
$certpw="!Password321#"
$groupname="voting_RG"
$clustername = "votinghttps"
$ExistingPfxFilePath="C:\Users\sfuser\votingappcert.pfx"

$appcertpwd = ConvertTo-SecureString –String $certpw –AsPlainText –Force  

Write-Host "Reading pfx file from $ExistingPfxFilePath"
$cert = new-object System.Security.Cryptography.X509Certificates.X509Certificate2 $ExistingPfxFilePath, $certpw

$bytes = [System.IO.File]::ReadAllBytes($ExistingPfxFilePath)
$base64 = [System.Convert]::ToBase64String($bytes)

$jsonBlob = @{
   data = $base64
   dataType = 'pfx'
   password = $certpw
   } | ConvertTo-Json

$contentbytes = [System.Text.Encoding]::UTF8.GetBytes($jsonBlob)
$content = [System.Convert]::ToBase64String($contentbytes)

$secretValue = ConvertTo-SecureString -String $content -AsPlainText -Force

# Upload the certificate to the key vault as a secret
Write-Host "Writing secret to $certname in vault $vaultname"
$secret = Set-AzureKeyVaultSecret -VaultName $vaultname -Name $certname -SecretValue $secretValue

# Add a certificate to all the VMs in the cluster.
Add-AzureRmServiceFabricApplicationCertificate -ResourceGroupName $groupname -Name $clustername -SecretIdentifier $secret.Id -Verbose
```

## Give NETWORK SERVICE access to the certificate's private key
The SSL certificate is now installed on all the nodes in the cluster, but the front-end must have access to the certificate's private key.  By default, services run under the NETWORK SERVICE account. 

## Open port 443 in the Azure load balancer
Open port 443 in the load balancer if it isn't already.  

```powershell
$probename = "AppPortProbe6"
$rulename="AppPortLBRule6"
$RGname="voting_RG"
$port=443

# Get the load balancer resource
$resource = Get-AzureRmResource | Where {$_.ResourceGroupName –eq $RGname -and $_.ResourceType -eq "Microsoft.Network/loadBalancers"} 
$slb = Get-AzureRmLoadBalancer -Name $resource.Name -ResourceGroupName $RGname

# Add a new probe configuration to the load balancer
$slb | Add-AzureRmLoadBalancerProbeConfig -Name $probename -Protocol Tcp -Port $port -IntervalInSeconds 15 -ProbeCount 2

# Add rule configuration to the load balancer
$probe = Get-AzureRmLoadBalancerProbeConfig -Name $probename -LoadBalancer $slb
$slb | Add-AzureRmLoadBalancerRuleConfig -Name $rulename -BackendAddressPool $slb.BackendAddressPools[0] -FrontendIpConfiguration $slb.FrontendIpConfigurations[0] -Probe $probe -Protocol Tcp -FrontendPort $port -BackendPort $port

# Set the goal state for the load balancer
$slb | Set-AzureRmLoadBalancer
```

## Deploy the application to Azure

Right-click, publish app to remote cluster.

## Next steps
In this part of the tutorial, you learned how to:

> [!div class="checklist"]
> * Define an HTTPS endpoint in the service
> * Configure Kestrel to use HTTPS
> * Install the SSL certificate on the remote cluster nodes
> * Give NETWORK SERVICE access to the certificate's private key
> * Open port 443 in the Azure load balancer
> * Deploy the application to a remote cluster 

Advance to the next tutorial:
> [!div class="nextstepaction"]
> [Configure CI/CD using Visual Studio Team Services](service-fabric-tutorial-deploy-app-with-cicd-vsts.md)
