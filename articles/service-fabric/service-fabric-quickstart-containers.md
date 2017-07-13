---
title: Create an Azure Service Fabric container application | Microsoft Docs
description: Create your first Windows container application on Azure Service Fabric.  
services: service-fabric
documentationcenter: .net
author: rwike77
manager: timlt
editor: 'vturecek'

ms.assetid: 
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: get-started-article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 07/01/2017
ms.author: ryanwi

---

# Create your first Service Fabric container application on Windows
> [!div class="op_single_selector"]
> * [Windows](service-fabric-quickstart-containers.md)
> * [Linux](service-fabric-quickstart-containers-linux.md)

Running an existing application in a Windows container on a Service Fabric cluster doesn't require any changes to your application. This quickstart shows you how to deploy a prebuilt Docker container image in a Service Fabric application.

## Prerequisites
* An Azure subscription (you can create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)).
* A development computer running:
  * Visual Studio 2015 or Visual Studio 2017.
  * [Service Fabric SDK and tools](service-fabric-get-started.md).

## Package a Docker image container with Visual Studio
The Service Fabric SDK and tools provide a service template to help you deploy a container to a Service Fabric cluster.

Start Visual Studio as "Administrator".  Select **File** > **New** > **Project**.

Select **Service Fabric application**, name it "MyFirstContainer", and click **OK**.

Select **Container** from the list of **service templates**.

In **Image Name** enter "nanoserver/iis", the [Windows Server 2016 Nano Server and IIS base image](https://hub.docker.com/r/nanoserver/iis/). 

Name your service "MyContainerService", and click **OK**.

## Configure communication and container port-to-host port mapping
The service needs an endpoint for communication, you can now add the protocol, port, and type to an `Endpoint` in the ServiceManifest.xml file. For this quick start, the containerized service listens on port 80: 

```xml
<Endpoint Name="MyContainerServiceTypeEndpoint" UriScheme="http" Port="80" Protocol="http"/>
```
Providing the `UriScheme` automatically registers the container endpoint with the Service Fabric Naming service for discoverability. A full ServiceManifest.xml example file is provided at the end of this article. 

Configure the container port-to-host port mapping by specifying a `PortBinding` policy in `ContainerHostPolicies` of the ApplicationManifest.xml file.  For this quick start, `ContainerPort` is 80 and `EndpointRef` is "MyContainerServiceTypeEndpoint" (the endpoint defined in the service manifest).  Incoming requests to the service on port 80 are mapped to port 80 on the container.  

```xml
<ServiceManifestImport>
...
  <Policies>
    <ContainerHostPolicies CodePackageRef="Code">
      <PortBinding ContainerPort="80" EndpointRef="MyContainerServiceTypeEndpoint"/>
    </ContainerHostPolicies>
  </Policies>
</ServiceManifestImport>
```

A full ApplicationManifest.xml example file is provided at the end of this article.

## Create a cluster
A Service Fabric cluster is a network-connected set of virtual or physical machines into which your microservices are deployed and managed.  Open a PowerShell window and create a test cluster with a single node.  Later, you'll deploy your container application onto this test cluster.  You can find your Azure subscription ID in the [Azure portal](http://portal.azure.com).

```powershell
Login-AzureRmAccount

Select-AzureRmSubscription -SubscriptionId "SubscriptionID"

$clusterloc="SouthCentralUS"
$groupname="mysfclustergroup"
$certpwd="Password#1234" | ConvertTo-SecureString -AsPlainText -Force
$certfolder="c:\mycertificates\"
$clustername = "mysfcluster"
$vmpassword = "VmPassword#1234" | ConvertTo-SecureString -AsPlainText -Force
$subname="$clustername.$clusterloc.cloudapp.azure.com"    
$clustersize=1 


New-AzureRmServiceFabricCluster -Name $clustername -ResourceGroupName $groupname `
    -Location $clusterloc -ClusterSize $clustersize -VmPassword $vmpassword `
    -CertificateSubjectName $subname -CertificatePassword $certpwd -CertificateOutputFolder $certfolder `
    -OS WindowsServer2016DatacenterwithContainers 

$pfxfile = (Get-ChildItem $certfolder -Recurse -Include "*.pfx" | Select-Object -First 1).Name
  
$certfilepath=$certfolder+$pfxfile    
$thumbprint = (Import-PfxCertificate -Exportable -CertStoreLocation Cert:\CurrentUser\My `
        -FilePath $certfilepath `
        -Password $certpwd).Thumbprint

Write-Host "Cluster connection endpoint: " $subname":19000"
Write-Host "Certificate thumbprint: " $thumbprint
```

Take note of the cluster connection endpoint and the certificate thumbprint, you'll need this info in the following step.

## Build and package the Service Fabric application
Save all changes in your files. To package your application, right-click on **MyFirstContainer** in Solution Explorer and select **Package**. 

## Deploy the container application
To publish your application, right-click on **MyFirstContainer** in **Solution Explorer** and select **Publish**.  In the publish diaglog, enter "mysfcluster.southcentralus.cloudapp.azure.com:19000" as the **Connection Endpoint**.  Select **Advanced Connection Properties** and enter the certificate thumbprint.  Click **Publish**.

![Publish application][publish-dialog]

Open a browser and navigate to http://mysfcluster.southcentralus.cloudapp.azure.com:80. You should see the IIS default web page:
![IIS default web page][iis-default]

## Clean up
You continue to incur charges while the cluster is running, consider deleting your cluster.

### Delete the cluster
A cluster is made up of other Azure resources in addition to the cluster resource itself. The simplest way to delete the cluster and all the resources it consumes is to delete the resource group.

```powershell
Login-AzureRmAccount
Select-AzureRmSubscription -SubscriptionId "Subcription ID"

$groupname="mysfclustergroup"
Remove-AzureRmResourceGroup -Name $groupname -Force
```
### Remove the certificate from your local store
You can also remove the certificate from your local store.  Open a PowerShell window as Administrator and run the following:

```powershell
# Access MY store of CurrentUser profile 
$store = New-Object System.Security.Cryptography.X509Certificates.X509Store("My","CurrentUser")
$store.Open("ReadWrite")

# Find the cert we want to delete.
$cert = $store.Certificates.Find("FindByThumbprint",$thumbprint,$FALSE)[0]

if ($cert -ne $null)
{
# Found the cert. Delete it (need admin permissions to do this).
$store.Remove($cert)

Write-Host "Certificate with thumbprint" $thumbprint "has been deleted"
}
else
{
# Didn't find the cert. Exit.
Write-Host "Certificate with thumbprint" $thumbprint "could not be found"
}

$store.Close()
```

## Complete example Service Fabric application and service manifests
Here are the complete service and application manifests used in this quick start.

### ServiceManifest.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<ServiceManifest Name="MyContainerServicePkg"
                 Version="1.0.0"
                 xmlns="http://schemas.microsoft.com/2011/01/fabric"
                 xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <ServiceTypes>
    <!-- This is the name of your ServiceType.
         The UseImplicitHost attribute indicates this is a guest service. -->
    <StatelessServiceType ServiceTypeName="MyContainerServiceType" UseImplicitHost="true" />
  </ServiceTypes>

  <!-- Code package is your service executable. -->
  <CodePackage Name="Code" Version="1.0.0">
    <EntryPoint>
      <!-- Follow this link for more information about deploying Windows containers to Service Fabric: https://aka.ms/sfguestcontainers -->
      <ContainerHost>
        <ImageName>nanoserver/iis</ImageName>
      </ContainerHost>
    </EntryPoint>
    <!-- Pass environment variables to your container: -->
    <!--
    <EnvironmentVariables>
      <EnvironmentVariable Name="VariableName" Value="VariableValue"/>
    </EnvironmentVariables>
    -->
  </CodePackage>

  <!-- Config package is the contents of the Config directoy under PackageRoot that contains an 
       independently-updateable and versioned set of custom configuration settings for your service. -->
  <ConfigPackage Name="Config" Version="1.0.0" />

  <Resources>
    <Endpoints>
      <!-- This endpoint is used by the communication listener to obtain the port on which to 
           listen. Please note that if your service is partitioned, this port is shared with 
           replicas of different partitions that are placed in your code. -->
      <Endpoint Name="MyContainerServiceTypeEndpoint" UriScheme="http" Port="80" Protocol="http"/>
    </Endpoints>
  </Resources>
</ServiceManifest>
```
### ApplicationManifest.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<ApplicationManifest ApplicationTypeName="MyFirstContainerType"
                     ApplicationTypeVersion="1.0.0"
                     xmlns="http://schemas.microsoft.com/2011/01/fabric"
                     xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Parameters>
    <Parameter Name="MyContainerService_InstanceCount" DefaultValue="-1" />
  </Parameters>
  <!-- Import the ServiceManifest from the ServicePackage. The ServiceManifestName and ServiceManifestVersion 
       should match the Name and Version attributes of the ServiceManifest element defined in the 
       ServiceManifest.xml file. -->
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="MyContainerServicePkg" ServiceManifestVersion="1.0.0" />
    <ConfigOverrides />
    <Policies>
      <ContainerHostPolicies CodePackageRef="Code">
        <PortBinding ContainerPort="80" EndpointRef="MyContainerServiceTypeEndpoint"/>
      </ContainerHostPolicies>
    </Policies>
  </ServiceManifestImport>
  <DefaultServices>
    <!-- The section below creates instances of service types, when an instance of this 
         application type is created. You can also create one or more instances of service type using the 
         ServiceFabric PowerShell module.
         
         The attribute ServiceTypeName below must match the name defined in the imported ServiceManifest.xml file. -->
    <Service Name="MyContainerService" ServicePackageActivationMode="ExclusiveProcess">
      <StatelessService ServiceTypeName="MyContainerServiceType" InstanceCount="[MyContainerService_InstanceCount]">
        <SingletonPartition />
      </StatelessService>
    </Service>
  </DefaultServices>
</ApplicationManifest>
```

## Next steps
* Learn more about running [containers on Service Fabric](service-fabric-containers-overview.md).
* Read the [Deploy a .NET application in a container](service-fabric-host-app-in-a-container.md) tutorial.
* Learn about the Service Fabric [application life-cycle](service-fabric-application-lifecycle.md).
* Checkout the [Service Fabric container code samples](https://github.com/Azure-Samples/service-fabric-dotnet-containers) on GitHub.

[iis-default]: ./media/service-fabric-quickstart-containers/iis-default.png
[publish-dialog]: ./media/service-fabric-quickstart-containers/publish-dialog.png
