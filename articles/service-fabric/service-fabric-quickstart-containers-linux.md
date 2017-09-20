---
title: Create an Azure Service Fabric container application on Linux | Microsoft Docs
description: Create your first Linux container application on Azure Service Fabric.  Build a Docker image with your application, push the image to a container registry, build and deploy a Service Fabric container application.
services: service-fabric
documentationcenter: .net
author: rwike77
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: get-started-article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 09/05/2017
ms.author: ryanwi

---

# Deploy a Service Fabric Linux container application on Azure
Azure Service Fabric is a distributed systems platform for deploying and managing scalable and reliable microservices and containers. 

Running an existing application in a Linux container on a Service Fabric cluster doesn't require any changes to your application. This quickstart shows you how to deploy a prebuilt Docker container image in a Service Fabric application. When you're finished, you'll have a running nginx container.  This quickstart describes deploying a Linux container, read [this quickstart](service-fabric-quickstart-containers.md) to deploy a Windows container.

![Nginx][nginx]

In this quickstart, you learn how to:
> [!div class="checklist"]
> * Package a Docker image container
> * Configure communication
> * Build and package the Service Fabric application
> * Deploy the container application to Azure

## Prerequisites
Install the [Service Fabric SDK, Service Fabric CLI, and the Service Fabric yeoman template generators](service-fabric-get-started-linux.md).
  
## Package a Docker image container with Yeoman
The Service Fabric SDK for Linux includes a [Yeoman](http://yeoman.io/) generator that makes it easy to create your application and add a container image. 

To create a Service Fabric container application, open a terminal window and run `yo azuresfcontainer`.  

Name your application "MyFirstContainer" and name the application service "MyContainerService."

Provide the container image name "nginx:latest" (the [nginx container image](https://hub.docker.com/r/_/nginx/) on Docker Hub). 

This image has a workload entry-point defined, so you need to explicitly specify input commands. 

Specify an instance count of "1".

![Service Fabric Yeoman generator for containers][sf-yeoman]

## Configure communication and container port-to-host port mapping
Configure an HTTP endpoint so clients can communicate with your service.  Open the *./MyFirstContainer/MyContainerServicePkg/ServiceManifest.xml* file and declare an endpoint resource in the **ServiceManifest** element.  Add the protocol, port, and name. For this quickstart, the service listens on port 80: 

```xml
<Resources>
  <Endpoints>
    <!-- This endpoint is used by the communication listener to obtain the port on which to 
           listen. Please note that if your service is partitioned, this port is shared with 
           replicas of different partitions that are placed in your code. -->
    <Endpoint Name="myserviceTypeEndpoint" UriScheme="http" Port="80" Protocol="http"/>
  </Endpoints>
</Resources>

```
Providing the `UriScheme` automatically registers the container endpoint with the Service Fabric Naming service for discoverability. A full ServiceManifest.xml example file is provided at the end of this article. 

Map a container port to a service `Endpoint` using a `PortBinding` policy in `ContainerHostPolicies` of the ApplicationManifest.xml file.  For this quickstart, `ContainerPort` is 80 (the container exposes port 80) and `EndpointRef` is "myserviceTypeEndpoint" (the endpoint previously defined in the service manifest).  Incoming requests to the service on port 80 are mapped to port 80 on the container.  

```xml
<Policies>
  <ContainerHostPolicies CodePackageRef="Code">
    <PortBinding ContainerPort="80" EndpointRef="myserviceTypeEndpoint"/>
  </ContainerHostPolicies>
</Policies>
```

## Build and package the Service Fabric application
The Service Fabric Yeoman templates include a build script for [Gradle](https://gradle.org/), which you can use to build the application from the terminal. Save all your changes.  To build and package the application, run the following:

```bash
cd MyFirstContainer
gradle
```
## Create a cluster
To deploy the application to a cluster in Azure, you can either choose to create your own cluster, or use a party cluster.

Party clusters are free, limited-time Service Fabric clusters hosted on Azure and run by the Service Fabric team where anyone can deploy applications and learn about the platform. To get access to a party cluster, [follow the instructions](http://aka.ms/tryservicefabric).  

For information about creating your own cluster, see [Create your first Service Fabric cluster on Azure](service-fabric-get-started-azure-cluster.md).

Take note of the connection endpoint, which you use in the following step.

## Deploy the application to Azure
Once the application is built, you can deploy it to the Azure cluster using the Service Fabric CLI.

Connect to the Service Fabric cluster in Azure.

```bash
sfctl cluster select --endpoint http://lnxt10vkfz6.westus.cloudapp.azure.com:19080
```

Use the install script provided in the template to copy the application package to the cluster's image store, register the application type, and create an instance of the application.

```bash
./install.sh
```

Open a browser and navigate to Service Fabric Explorer at http://lnxt10vkfz6.westus.cloudapp.azure.com:19080/Explorer. Expand the Applications node and note that there is now an entry for your application type and another for the first instance of that type.

![Service Fabric Explorer][sfx]

Connect to the running container.  Open a web browser pointing to the IP address returned on port 80, for example "lnxt10vkfz6.westus.cloudapp.azure.com:80". You should see the nginx welcome page display in the browser.

![Nginx][nginx]

## Clean up
Use the uninstall script provided in the template to delete the application instance from the cluster and unregister the application type.

```bash
./uninstall.sh
```

## Complete example Service Fabric application and service manifests
Here are the complete service and application manifests used in this quickstart.

### ServiceManifest.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<ServiceManifest Name="MyContainerServicePkg" Version="1.0.0"
                 xmlns="http://schemas.microsoft.com/2011/01/fabric" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" >

   <ServiceTypes>
      <StatelessServiceType ServiceTypeName="MyContainerServiceType" UseImplicitHost="true">
   </StatelessServiceType>
   </ServiceTypes>
   
   <CodePackage Name="code" Version="1.0.0">
      <EntryPoint>
         <ContainerHost>
            <ImageName>nginx:latest</ImageName>
            <Commands></Commands>
         </ContainerHost>
      </EntryPoint>
      <EnvironmentVariables> 
      </EnvironmentVariables> 
   </CodePackage>
<Resources>
    <Endpoints>
      <!-- This endpoint is used by the communication listener to obtain the port on which to 
           listen. Please note that if your service is partitioned, this port is shared with 
           replicas of different partitions that are placed in your code. -->
      <Endpoint Name="myserviceTypeEndpoint" UriScheme="http" Port="80" Protocol="http"/>
    </Endpoints>
  </Resources>
 </ServiceManifest>

```
### ApplicationManifest.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<ApplicationManifest  ApplicationTypeName="MyFirstContainerType" ApplicationTypeVersion="1.0.0"
                      xmlns="http://schemas.microsoft.com/2011/01/fabric" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
   
   <ServiceManifestImport>
      <ServiceManifestRef ServiceManifestName="MyContainerServicePkg" ServiceManifestVersion="1.0.0" />
   <Policies>
      <ContainerHostPolicies CodePackageRef="Code">
        <PortBinding ContainerPort="80" EndpointRef="myserviceTypeEndpoint"/>
      </ContainerHostPolicies>
    </Policies>
</ServiceManifestImport>
   
   <DefaultServices>
      <Service Name="MyContainerService">
        <!-- On a local development cluster, set InstanceCount to 1.  On a multi-node production 
        cluster, set InstanceCount to -1 for the container service to run on every node in 
        the cluster.
        -->
        <StatelessService ServiceTypeName="MyContainerServiceType" InstanceCount="1">
            <SingletonPartition />
        </StatelessService>
      </Service>
   </DefaultServices>
   
</ApplicationManifest>

```

## Next steps
In this quickstart, you learn how to:
> [!div class="checklist"]
> * Package a Docker image container
> * Configure communication
> * Build and package the Service Fabric application
> * Deploy the container application to Azure

* Learn more about running [containers on Service Fabric](service-fabric-containers-overview.md).
* Read the [Deploy a .NET application in a container](service-fabric-host-app-in-a-container.md) tutorial.
* Learn about the Service Fabric [application life-cycle](service-fabric-application-lifecycle.md).
* Checkout the [Service Fabric container code samples](https://github.com/Azure-Samples/service-fabric-dotnet-containers) on GitHub.

[sfx]: ./media/service-fabric-quickstart-containers-linux/SFX.png
[nginx]: ./media/service-fabric-quickstart-containers-linux/nginx.png
[sf-yeoman]: ./media/service-fabric-quickstart-containers-linux/YoSF.png
