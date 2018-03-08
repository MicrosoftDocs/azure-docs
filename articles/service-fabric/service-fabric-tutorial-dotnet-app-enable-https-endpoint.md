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
ms.date: 03/08/2018
ms.author: ryanwi
ms.custom: mvc

---

# Tutorial: add an HTTPS endpoint to an ASP.NET Core Web API front-end service
This tutorial is part three of a series.  You will learn how to ... When you're finished, you have .... If you don't want to manually create the voting application, you can [download the source code](https://github.com/Azure-Samples/service-fabric-dotnet-quickstart/) for the completed application and skip ahead to [Walk through the voting sample application](#walkthrough_anchor).

![Application Diagram](./media/service-fabric-tutorial-create-dotnet-app/application-diagram.png)

In part three of the series, you learn how to:

> [!div class="checklist"]
> * 

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

## Create a self-signed development certificate
Use the New-SelfSignedCertificate Powershell cmdlet to generate a suitable certificate for development:

```powershell
PS C:\Users\sfuser>New-SelfSignedCertificate -NotBefore (Get-Date) -NotAfter (Get-Date).AddYears(1) -Subject "localhost" -KeyAlgorithm "RSA" -KeyLength 2048 -HashAlgorithm "SHA256" -CertStoreLocation "Cert:\CurrentUser\My" -KeyUsage KeyEncipherment -FriendlyName "HTTPS development certificate" -TextExtension @("2.5.29.19={critical}{text}","2.5.29.37={critical}{text}1.3.6.1.5.5.7.3.1","2.5.29.17={critical}{text}DNS=localhost")

   PSParentPath: Microsoft.PowerShell.Security\Certificate::CurrentUser\My

Thumbprint                                Subject
----------                                -------
8C612A748F4558A508AB87FEAB7DD160A0B90865  CN=localhost
```

## Update the service and application manifests and parameters file
In the service manifest, add an endpoint:

```xml
<Endpoint Protocol="https" Name="EndpointHttps" Type="Input" Port="443" CertificateRef="MySslCert"/>
```

In the application manifest, add a parameter, endpoint binding policy, and certificate.  **EndpointBindingPolicy** references the endpoint in the service manifest.  Using a paremeter for the certificate thumbprint allows you to use different certs for development and production.

```xml
<?xml version="1.0" encoding="utf-8"?>
<ApplicationManifest xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ApplicationTypeName="VotingType" ApplicationTypeVersion="1.0.0" xmlns="http://schemas.microsoft.com/2011/01/fabric">
  <Parameters>
    <Parameter Name="VotingData_MinReplicaSetSize" DefaultValue="3" />
    <Parameter Name="VotingData_PartitionCount" DefaultValue="1" />
    <Parameter Name="VotingData_TargetReplicaSetSize" DefaultValue="3" />
    <Parameter Name="VotingWeb_InstanceCount" DefaultValue="-1" />
    <Parameter Name="MySslCert" DefaultValue="" />
  </Parameters>
  <!-- Import the ServiceManifest from the ServicePackage. The ServiceManifestName and ServiceManifestVersion 
       should match the Name and Version attributes of the ServiceManifest element defined in the 
       ServiceManifest.xml file. -->
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="VotingDataPkg" ServiceManifestVersion="1.0.0" />
    <ConfigOverrides />
  </ServiceManifestImport>
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="VotingWebPkg" ServiceManifestVersion="1.0.0" />
    <ConfigOverrides />
    <Policies>
      <EndpointBindingPolicy EndpointRef="EndpointHttps" CertificateRef="HttpsCertificate" />
    </Policies>
  </ServiceManifestImport>
  <DefaultServices>
    <!-- The section below creates instances of service types, when an instance of this 
         application type is created. You can also create one or more instances of service type using the 
         ServiceFabric PowerShell module.
         
         The attribute ServiceTypeName below must match the name defined in the imported ServiceManifest.xml file. -->
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
  <Certificates>
    <EndpointCertificate X509FindValue="[MySslCert]" Name="HttpsCertificate" />
  </Certificates>
</ApplicationManifest>
```

Open *ApplicationParameters->Local.5Node.xml* and add the certificate thumbprint value:

```xml
<?xml version="1.0" encoding="utf-8"?>
<Application xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" Name="fabric:/Voting" xmlns="http://schemas.microsoft.com/2011/01/fabric">
  <Parameters>
    <Parameter Name="VotingData_PartitionCount" Value="1" />
    <Parameter Name="VotingData_MinReplicaSetSize" Value="3" />
    <Parameter Name="VotingData_TargetReplicaSetSize" Value="3" />
    <Parameter Name="VotingWeb_InstanceCount" Value="1" />
    <Parameter Name="MySslCert" Value="8C 61 2A 74 8F 45 58 A5 08 AB 87 FE AB 7D D1 60 A0 B9 08 65" />
  </Parameters>
</Application>
```

## Configure Kestrel
Open VotingWeb.cs

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
                        opt.Listen(IPAddress.Loopback, 443, listenOptions =>
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



## Run the application locally
In Solution Explorer, select the **Voting** application and set the **Application URL** property to "https://localhost:443".

Save all files, hit F5.

## Deploy the application to Azure



## Next steps
In this part of the tutorial, you learned how to:

> [!div class="checklist"]
> * 

Advance to the next tutorial:
> [!div class="nextstepaction"]
> [Configure CI/CD using Visual Studio Team Services](service-fabric-tutorial-deploy-app-with-cicd-vsts.md)
