---
title: Add an HTTPS endpoint using Kestrel to a Service Fabric app in Azure | Microsoft Docs
description: In this tutorial, you learn how to add an HTTPS endpoint to an ASP.NET Core front-end web service using Kestrel and deploy the application to a cluster.
services: service-fabric
documentationcenter: .net
author: aljo-microsoft
manager: chackdan
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: tutorial
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 01/17/2019
ms.author: aljo
ms.custom: mvc

---
# Tutorial: Add an HTTPS endpoint to an ASP.NET Core Web API front-end service using Kestrel

This tutorial is part three of a series.  You will learn how to enable HTTPS in an ASP.NET Core service running on Service Fabric. When you're finished, you have a voting application with an HTTPS-enabled ASP.NET Core web front-end listening on port 443. If you don't want to manually create the voting application in [Build a .NET Service Fabric application](service-fabric-tutorial-deploy-app-to-party-cluster.md), you can [download the source code](https://github.com/Azure-Samples/service-fabric-dotnet-quickstart/) for the completed application.

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
> * [Configure CI/CD using Azure Pipelines](service-fabric-tutorial-deploy-app-with-cicd-vsts.md)
> * [Set up monitoring and diagnostics for the application](service-fabric-tutorial-monitoring-aspnet.md)


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Prerequisites

Before you begin this tutorial:

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
* [Install Visual Studio 2019](https://www.visualstudio.com/) version 15.5 or later with the **Azure development** and **ASP.NET and web development** workloads.
* [Install the Service Fabric SDK](service-fabric-get-started.md)

## Obtain a certificate or create a self-signed development certificate

For production applications, use a certificate from a [certificate authority (CA)](https://wikipedia.org/wiki/Certificate_authority). For development and test purposes, you can create and use a self-signed certificate. The Service Fabric SDK provides the *CertSetup.ps1* script, which creates a self-signed certificate and imports it into the `Cert:\LocalMachine\My` certificate store. Open a command prompt as administrator and run the following command to create a cert with the subject "CN=mytestcert":

```powershell
PS C:\program files\microsoft sdks\service fabric\clustersetup\secure> .\CertSetup.ps1 -Install -CertSubjectName CN=mytestcert
```

If you already have a certificate PFX file, run the following to import the certificate into the `Cert:\LocalMachine\My` certificate store:

```powershell

PS C:\mycertificates> Import-PfxCertificate -FilePath .\mysslcertificate.pfx -CertStoreLocation Cert:\LocalMachine\My -Password (ConvertTo-SecureString "!Passw0rd321" -AsPlainText -Force)


   PSParentPath: Microsoft.PowerShell.Security\Certificate::LocalMachine\My

Thumbprint                                Subject
----------                                -------
3B138D84C077C292579BA35E4410634E164075CD  CN=zwin7fh14scd.westus.cloudapp.azure.com
```

## Define an HTTPS endpoint in the service manifest

Launch Visual Studio as an **administrator** and open the Voting solution. In Solution Explorer, open *VotingWeb/PackageRoot/ServiceManifest.xml*. The service manifest defines the service endpoints.  Find the **Endpoints** section and edit the existing "ServiceEndpoint" endpoint.  Change the name to "EndpointHttps", set the protocol to *https*, the type to *Input*, and port to *443*.  Save your changes.

```xml
<?xml version="1.0" encoding="utf-8"?>
<ServiceManifest Name="VotingWebPkg"
                 Version="1.0.0"
                 xmlns="http://schemas.microsoft.com/2011/01/fabric"
                 xmlns:xsd="https://www.w3.org/2001/XMLSchema"
                 xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance">
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
      <Endpoint Protocol="https" Name="EndpointHttps" Type="Input" Port="443" />
    </Endpoints>
  </Resources>
</ServiceManifest>
```

## Configure Kestrel to use HTTPS

In Solution Explorer, open the *VotingWeb/VotingWeb.cs* file.  Configure Kestrel to use HTTPS and lookup the certificate in the `Cert:\LocalMachine\My` store. Add the following using statements:

```csharp
using System.Net;
using Microsoft.Extensions.Configuration;
using System.Security.Cryptography.X509Certificates;
```

Update the `ServiceInstanceListener` to use the new *EndpointHttps* endpoint and listen on port 443. When configuring the web host to use Kestrel server, you must configure Kestrel to listen for IPv6 addresses on all network interfaces: `opt.Listen(IPAddress.IPv6Any, port, listenOptions => {...}`.

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
                    int port = serviceContext.CodePackageActivationContext.GetEndpoint("EndpointHttps").Port;
                    opt.Listen(IPAddress.IPv6Any, port, listenOptions =>
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

Also add the following method so that Kestrel can find the certificate in the `Cert:\LocalMachine\My` store using the subject.  

Replace "&lt;your_CN_value&gt;" with "mytestcert" if you created a self-signed certificate with the previous PowerShell command, or use the CN of your certificate.

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

## Give NETWORK SERVICE access to the certificate's private key

In a previous step, you imported the certificate into the `Cert:\LocalMachine\My` store on the development computer.  Now, explicitly give the account running the service (NETWORK SERVICE, by default) access to the certificate's private key. You can do this step manually (using the certlm.msc tool), but it's better to automatically run a PowerShell script by [configuring a startup script](service-fabric-run-script-at-service-startup.md) in the **SetupEntryPoint** of the service manifest.

### Configure the service setup entry point

In Solution Explorer, open *VotingWeb/PackageRoot/ServiceManifest.xml*.  In the **CodePackage** section, add **SetupEntryPoint** node and then a **ExeHost** node.  In **ExeHost**, set **Program** to "Setup.bat" and **WorkingFolder** to "CodePackage".  When the VotingWeb service starts, the Setup.bat script executes in the CodePackage folder before VotingWeb.exe starts.

```xml
<?xml version="1.0" encoding="utf-8"?>
<ServiceManifest Name="VotingWebPkg"
                 Version="1.0.0"
                 xmlns="http://schemas.microsoft.com/2011/01/fabric"
                 xmlns:xsd="https://www.w3.org/2001/XMLSchema"
                 xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance">
  <ServiceTypes>
    <StatelessServiceType ServiceTypeName="VotingWebType" />
  </ServiceTypes>

  <CodePackage Name="Code" Version="1.0.0">
    <SetupEntryPoint>
      <ExeHost>
        <Program>Setup.bat</Program>
        <WorkingFolder>CodePackage</WorkingFolder>
      </ExeHost>
    </SetupEntryPoint>

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
      <Endpoint Protocol="https" Name="EndpointHttps" Type="Input" Port="443" />
    </Endpoints>
  </Resources>
</ServiceManifest>
```

### Add the batch and PowerShell setup scripts

To run PowerShell from the **SetupEntryPoint** point, you can run PowerShell.exe in a batch file that points to a PowerShell file. First, add the batch file the service project.  In Solution Explorer, right-click **VotingWeb** and select **Add**->**New Item** and add a new file named "Setup.bat".  Edit the *Setup.bat* file and add the following command:

```bat
powershell.exe -ExecutionPolicy Bypass -Command ".\SetCertAccess.ps1"
```

Modify the *Setup.bat* file properties to set **Copy to Output Directory** to "Copy if newer".

![Set file properties][image1]

In Solution Explorer, right-click **VotingWeb** and select **Add**->**New Item** and add a new file named "SetCertAccess.ps1".  Edit the *SetCertAccess.ps1* file and add the following script:

```powershell
$subject="mytestcert"
$userGroup="NETWORK SERVICE"

Write-Host "Checking permissions to certificate $subject.." -ForegroundColor DarkCyan

$cert = (gci Cert:\LocalMachine\My\ | where { $_.Subject.Contains($subject) })[-1]

if ($cert -eq $null)
{
    $message="Certificate with subject:"+$subject+" does not exist at Cert:\LocalMachine\My\"
    Write-Host $message -ForegroundColor Red
    exit 1;
}elseif($cert.HasPrivateKey -eq $false){
    $message="Certificate with subject:"+$subject+" does not have a private key"
    Write-Host $message -ForegroundColor Red
    exit 1;
}else
{
    $keyName=$cert.PrivateKey.CspKeyContainerInfo.UniqueKeyContainerName

    $keyPath = "C:\ProgramData\Microsoft\Crypto\RSA\MachineKeys\"
    $fullPath=$keyPath+$keyName
    $acl=(Get-Item $fullPath).GetAccessControl('Access')


    $hasPermissionsAlready = ($acl.Access | where {$_.IdentityReference.Value.Contains($userGroup.ToUpperInvariant()) -and $_.FileSystemRights -eq [System.Security.AccessControl.FileSystemRights]::FullControl}).Count -eq 1

    if ($hasPermissionsAlready){
        Write-Host "Account $userGroup already has permissions to certificate '$subject'." -ForegroundColor Green
        return $false;
    } else {
        Write-Host "Need add permissions to '$subject' certificate..." -ForegroundColor DarkYellow

	    $permission=$userGroup,"Full","Allow"
	    $accessRule=new-object System.Security.AccessControl.FileSystemAccessRule $permission
	    $acl.AddAccessRule($accessRule)
	    Set-Acl $fullPath $acl

	    Write-Output "Permissions were added"

        return $true;
    }
}

```

Modify the *SetCertAccess.ps1* file properties to set **Copy to Output Directory** to "Copy if newer".

### Run the setup script as a local administrator

By default, the service setup entry point executable runs under the same credentials as Service Fabric (typically the NetworkService account). The *SetCertAccess.ps1* requires administrator privileges. In the application manifest, you can change the security permissions to run the startup script under a local administrator account.

In Solution Explorer, open *Voting/ApplicationPackageRoot/ApplicationManifest.xml*. First, create a **Principals** section and add a new user (for example, "SetupAdminUser". Add the SetupAdminUser user account to the Administrators system group.
Next, in the VotingWebPkg **ServiceManifestImport** section, configure a **RunAsPolicy** to apply the SetupAdminUser principal to the setup entry point. This policy tells Service Fabric that the Setup.bat file runs as SetupAdminUser (with administrator privileges).

```xml
<?xml version="1.0" encoding="utf-8"?>
<ApplicationManifest xmlns:xsd="https://www.w3.org/2001/XMLSchema" xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance" ApplicationTypeName="VotingType" ApplicationTypeVersion="1.0.0" xmlns="http://schemas.microsoft.com/2011/01/fabric">
  <Parameters>
    <Parameter Name="VotingData_MinReplicaSetSize" DefaultValue="3" />
    <Parameter Name="VotingData_PartitionCount" DefaultValue="1" />
    <Parameter Name="VotingData_TargetReplicaSetSize" DefaultValue="3" />
    <Parameter Name="VotingWeb_InstanceCount" DefaultValue="-1" />
  </Parameters>
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="VotingDataPkg" ServiceManifestVersion="1.0.0" />
    <ConfigOverrides />
  </ServiceManifestImport>
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="VotingWebPkg" ServiceManifestVersion="1.0.0" />
    <ConfigOverrides />
    <Policies>
      <RunAsPolicy CodePackageRef="Code" UserRef="SetupAdminUser" EntryPointType="Setup" />
    </Policies>
  </ServiceManifestImport>
  <DefaultServices>
    <Service Name="VotingData">
      <StatefulService ServiceTypeName="VotingDataType" TargetReplicaSetSize="[VotingData_TargetReplicaSetSize]" MinReplicaSetSize="[VotingData_MinReplicaSetSize]">
        <UniformInt64Partition PartitionCount="[VotingData_PartitionCount]" LowKey="0" HighKey="25" />
      </StatefulService>
    </Service>
    <Service Name="VotingWeb" ServicePackageActivationMode="ExclusiveProcess">
      <StatelessService ServiceTypeName="VotingWebType" InstanceCount="[VotingWeb_InstanceCount]">
        <SingletonPartition />
      </StatelessService>
    </Service>
  </DefaultServices>
  <Principals>
    <Users>
      <User Name="SetupAdminUser">
        <MemberOf>
          <SystemGroup Name="Administrators" />
        </MemberOf>
      </User>
    </Users>
  </Principals>
</ApplicationManifest>
```

## Run the application locally

In Solution Explorer, select the **Voting** application and set the **Application URL** property to "https:\//localhost:443".

Save all files and hit F5 to run the application locally.  After the application deploys, a web browser opens to https:\//localhost:443. If you are using a self-signed certificate, you see a warning that your PC doesn't trust this website's security.  Continue on to the web page.

![Voting application][image2]

## Install certificate on cluster nodes

Before deploying the application to the Azure, install the certificate into the `Cert:\LocalMachine\My` store of all the remote cluster nodes.  Services can move to different nodes of the cluster.  When the front-end web service starts on a cluster node, the startup script will lookup the certificate and configure access permissions.

First, export the certificate to a PFX file. Open the certlm.msc application and navigate to **Personal**>**Certificates**.  Right-click on the *mytestcert* certificate, and select **All Tasks**>**Export**.

![Export certificate][image4]

In the export wizard, choose **Yes, export the private key** and choose the Personal Information Exchange (PFX) format.  Export the file to *C:\Users\sfuser\votingappcert.pfx*.

Next, install the certificate on the remote cluster using the [Add-AzServiceFabricApplicationCertificate](/powershell/module/az.servicefabric/Add-azServiceFabricApplicationCertificate) cmdlet.

> [!Warning]
> A self-signed certificate is sufficient for development and testing applications. For production applications, use a certificate from a [certificate authority (CA)](https://wikipedia.org/wiki/Certificate_authority) instead of a self-signed certificate.

```powershell
Connect-AzAccount

$vaultname="sftestvault"
$certname="VotingAppPFX"
$certpw="!Password321#"
$groupname="voting_RG"
$clustername = "votinghttps"
$ExistingPfxFilePath="C:\Users\sfuser\votingappcert.pfx"

$appcertpwd = ConvertTo-SecureString -String $certpw -AsPlainText -Force

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
Add-AzServiceFabricApplicationCertificate -ResourceGroupName $groupname -Name $clustername -SecretIdentifier $secret.Id -Verbose
```

## Open port 443 in the Azure load balancer

Open port 443 in the load balancer if it isn't already.

```powershell
$probename = "AppPortProbe6"
$rulename="AppPortLBRule6"
$RGname="voting_RG"
$port=443

# Get the load balancer resource
$resource = Get-AzResource | Where {$_.ResourceGroupName –eq $RGname -and $_.ResourceType -eq "Microsoft.Network/loadBalancers"}
$slb = Get-AzLoadBalancer -Name $resource.Name -ResourceGroupName $RGname

# Add a new probe configuration to the load balancer
$slb | Add-AzLoadBalancerProbeConfig -Name $probename -Protocol Tcp -Port $port -IntervalInSeconds 15 -ProbeCount 2

# Add rule configuration to the load balancer
$probe = Get-AzLoadBalancerProbeConfig -Name $probename -LoadBalancer $slb
$slb | Add-AzLoadBalancerRuleConfig -Name $rulename -BackendAddressPool $slb.BackendAddressPools[0] -FrontendIpConfiguration $slb.FrontendIpConfigurations[0] -Probe $probe -Protocol Tcp -FrontendPort $port -BackendPort $port

# Set the goal state for the load balancer
$slb | Set-AzLoadBalancer
```

## Deploy the application to Azure

Save all files, switch from Debug to Release, and hit F6 to rebuild.  In Solution Explorer, right-click on **Voting** and select **Publish**. Select the connection endpoint of the cluster created in [Deploy an application to a cluster](service-fabric-tutorial-deploy-app-to-party-cluster.md), or select another cluster.  Click **Publish** to publish the application to the remote cluster.

When the application deploys, open a web browser and navigate to [https://mycluster.region.cloudapp.azure.com:443](https://mycluster.region.cloudapp.azure.com:443) (update the URL with the connection endpoint for your cluster). If you are using a self-signed certificate, you see a warning that your PC doesn't trust this website's security.  Continue on to the web page.

![Voting application][image3]

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
> [Configure CI/CD using Azure Pipelines](service-fabric-tutorial-deploy-app-with-cicd-vsts.md)

[image1]: ./media/service-fabric-tutorial-dotnet-app-enable-https-endpoint/SetupBatProperties.png
[image2]: ./media/service-fabric-tutorial-dotnet-app-enable-https-endpoint/VotingAppLocal.png
[image3]: ./media/service-fabric-tutorial-dotnet-app-enable-https-endpoint/VotingAppAzure.png
[image4]: ./media/service-fabric-tutorial-dotnet-app-enable-https-endpoint/ExportCert.png
