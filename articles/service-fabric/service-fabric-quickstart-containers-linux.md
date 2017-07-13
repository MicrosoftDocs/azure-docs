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
ms.date: 06/28/2017
ms.author: ryanwi

---

# Create your first Service Fabric container application on Linux
> [!div class="op_single_selector"]
> * [Windows](service-fabric-quickstart-containers.md)
> * [Linux](service-fabric-quickstart-containers-linux.md)

Running an existing application in a Linux container on a Service Fabric cluster doesn't require any changes to your application. This quickstart shows you how to deploy a prebuilt Docker container image in a Service Fabric application.

## Prerequisites
A development computer running:
* [Service Fabric SDK and tools](service-fabric-get-started-linux.md).
  
## Package a Docker image container with Yeoman
The Service Fabric SDK for Linux includes a [Yeoman](http://yeoman.io/) generator that makes it easy to create your application and add a container image. 

To create a Service Fabric container application, open a terminal window and run `yo azuresfcontainer`.  

Name your application "MyFirstContainer". 

Provide the container image name "nginx:latest" (the [nginx container image](https://hub.docker.com/r/_/nginx/) on Docker Hub). 

This image has a workload entry-point defined, so need to explicitly specify input commands. 

Specify an instance count of "1".

![Service Fabric Yeoman generator for containers][sf-yeoman]

## Configure communication and container port-to-host port mapping
Configure an HTTP endpoint so clients can communicate with your service.  In the ServiceManifest.xml file, declare an endpoint resource in the **ServiceManifest** element and add the protocol, port, and name. For this quick start, the service listens on port 80: 

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

Map a container port to a service `Endpoint` using a `PortBinding` policy in `ContainerHostPolicies` of the ApplicationManifest.xml file.  For this quick start, `ContainerPort` is 80 (the container exposes port 80) and `EndpointRef` is "myserviceTypeEndpoint" (the endpoint previously defined in the service manifest).  Incoming requests to the service on port 80 are mapped to port 80 on the container.  

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

## Deploy the application
Once the application is built, you can deploy it to the local cluster using the XPlat CLI.

Connect to the local Service Fabric cluster.

```bash
azure servicefabric cluster connect
```

Use the install script provided in the template to copy the application package to the cluster's image store, register the application type, and create an instance of the application.

```bash
./install.sh
```

Open a browser and navigate to Service Fabric Explorer at http://localhost:19080/Explorer (replace localhost with the private IP of the VM if using Vagrant on Mac OS X). Expand the Applications node and note that there is now an entry for your application type and another for the first instance of that type.

Connect to the running container.  Open a web browser pointing to the IP address returned on port 80, for example "http://localhost:80". You should see the nginx welcome page display in the browser.

![Nginx][nginx]

## Clean up
Use the uninstall script provided in the template to delete the application instance from the local development cluster and unregister the application type.

```bash
./uninstall.sh
```

## Complete example Service Fabric application and service manifests
Here are the complete service and application manifests used in this quick start.

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
* Learn more about running [containers on Service Fabric](service-fabric-containers-overview.md).
* Read the [Deploy a .NET application in a container](service-fabric-host-app-in-a-container.md) tutorial.
* Learn about the Service Fabric [application life-cycle](service-fabric-application-lifecycle.md).
* Checkout the [Service Fabric container code samples](https://github.com/Azure-Samples/service-fabric-dotnet-containers) on GitHub.

[nginx]: ./media/service-fabric-quickstart-containers-linux/nginx.png
[sf-yeoman]: ./media/service-fabric-quickstart-containers-linux/YoSF.png
