---
title: Service Fabric tutorial - Package App | Microsoft Docs
description: Service Fabric tutorial - Package App 
services: service-fabric
documentationcenter: ''
author: suhuruli
manager: mfussel
editor: suhuruli
tags: servicefabric
keywords: Docker, Containers, Micro-services, Service Fabric, Azure

ms.assetid: 
ms.service: service-fabric
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/12/2017
ms.author: suhuruli
ms.custom: mvc
---

# Build a Service Fabric Application from Containers

This tutorial is part three in a series. In this tutorial, a template generator tool (Yeoman) is used to generate a Service Fabric application. This application can then be used to deploy containers to Service Fabric. Steps completed include: 

> [!div class="checklist"]
> * Install Yeoman  
> * Use Yeoman to Create an Application Package
> * Configure settings in the Application Package for use with containers

## Prerequisites

- The container images pushed to Azure Container Registry created in [Part 2](service-fabric-tutorial-prepare-acr.md) of this tutorial series are used.

## Install Yeoman
Service fabric provides scaffolding tools to help create applications from terminal using Yeoman template generator. Follow the steps below to ensure you have the Yeoman template generator. 

1. Install nodejs and NPM on your machine. 
```bash
sudo apt-get install npm
sudo apt install nodejs-legacy
```
2. Install Yeoman template generator on your machine from NPM 

```bash
sudo npm install -g yo
```

3. Install the Service Fabric Yeoman container generator

```bash 
sudo npm install -g generator-azuresfcontainer
```

## Package a Docker image container with Yeoman

1. To create a Service Fabric container application, in the 'container-tutorial' directory of the cloned repository, run the following command
```
yo azuresfcontainer
```
2. Name your application "TestContainer" and name the application service "azurevotefront."
3. Provide the container image path in ACR for the frontend repo '\<acrLoginServer>/azure-vote-front:\<version>'. 

4. Press Enter to leave the Commands section empty.
5. Specify an instance count of 1.

The entries for this container app used are all shown below

```bash
? Name your application TestContainer
? Name of the application service: azurevotefront
? Input the Image Name: <acrName>.azurecr.io/azure-vote-front:v1
? Commands: 
? Number of instances of guest container application: 1
   create TestContainer/TestContainer/ApplicationManifest.xml
   create TestContainer/TestContainer/azurevotefrontPkg/ServiceManifest.xml
   create TestContainer/TestContainer/azurevotefrontPkg/config/Settings.xml
   create TestContainer/TestContainer/azurevotefrontPkg/code/Dummy.txt
   create TestContainer/install.sh
   create TestContainer/uninstall.sh
```

To add another container service to an application already created using yeoman, perform the following steps:

1. Change directory to the root of the existing application.
```bash
cd TestContainer
```
2. Run `yo azuresfcontainer:AddService` 
3. Name the service 'azurevoteback'
4. Provide the container image path in ACR for the backend repo 
'\<acrLoginServer>/azure-vote-back:\<version>'. 

5. Press Enter to leave the Commands section empty.
6. Specify an instance count of "1". 

The entries for adding the service used are all shown below:

```bash
? Name of the application service: azurevoteback
? Input the Image Name: suhuruli.azurecr.io/azure-vote-back:v1
? Commands: 
? Number of instances of guest container application: 1
   create TestContainer/azurevotebackPkg/ServiceManifest.xml
   create TestContainer/azurevotebackPkg/config/Settings.xml
   create TestContainer/azurevotebackPkg/code/Dummy.txt
```

For the remainder of this tutorial, we are working in the `TestContainer` directory.

## Configure Application Manifest with credentials for Azure Container Registry
For Service Fabric to pull the container images from Azure container registry, we need to provide the credentials in the `ApplicationManifest.xml`. 

1. Log in to your ACR instance. Use the [az acr login](https://docs.microsoft.com/en-us/cli/azure/acr#az_acr_login) command to complete the operation. Provide the unique name given to the container registry when it was created.

```azurecli
az acr login --name <acrName>
```

The command returns a 'Login Succeeded’ message once completed.

Next, run the following command to get the password of your container registry. 

```azurecli
az acr credential show -n <acrName> --query passwords[0].value
```

In the `ApplicationManifest.xml`, add the code snippet under the `ServiceManifestImport` tag for each of the services. A full `ApplicationManifest.xml` is provided at the end of this document. 

```xml
<Policies>
  <ContainerHostPolicies CodePackageRef="Code">
    <RepositoryCredentials AccountName="<acrName>" Password="<password>" PasswordEncrypted="false"/>
  </ContainerHostPolicies>
</Policies>
```
## Configure communication and container port-to-host port mapping

1. Configure communication port 

Configure an HTTP endpoint so clients can communicate with your service.  Open the *./TestContainer/azurevotefrontPkg/ServiceManifest.xml* file and declare an endpoint resource in the **ServiceManifest** element.  Add the protocol, port, and name. For this tutorial, the service listens on port 80. 

```xml
<Resources>
  <Endpoints>
    <!-- This endpoint is used by the communication listener to obtain the port on which to 
           listen. Please note that if your service is partitioned, this port is shared with 
           replicas of different partitions that are placed in your code. -->
    <Endpoint Name="azurevotefrontTypeEndpoint" UriScheme="http" Port="80" Protocol="http"/>
  </Endpoints>
</Resources>

```

Similarly, modify the Service Manifest for the backend service. For this tutorial, the redis default of 6379 is maintained.
```xml
<Resources>
  <Endpoints>
    <!-- This endpoint is used by the communication listener to obtain the port on which to 
           listen. Please note that if your service is partitioned, this port is shared with 
           replicas of different partitions that are placed in your code. -->
    <Endpoint Name="azurevotebackTypeEndpoint" UriScheme="http" Port="6379" Protocol="http"/>
  </Endpoints>
</Resources>

```
Providing the `UriScheme` automatically registers the container endpoint with the Service Fabric Naming service for discoverability. A full ServiceManifest.xml example file for the backend service is provided at the end of this article as an example. 

2. Map container ports to a service

Map a container port to a service `Endpoint` using a `PortBinding` policy in `ContainerHostPolicies` of the ApplicationManifest.xml file.  For this quickstart, the frontend `ContainerPort` is 80 (the container exposes port 80) and the redis backend is 6379. `EndpointRef` is "azurevotefrontTypeEndpoint" (the endpoint previously defined in the service manifest) for the frontend and "azurevotebackTypeEndpoint" for the backend service. Incoming requests to these endpoints get mapped to the container ports that are opened and bounded here. The samples below are placed in the `ContainerHostPolicies` tag of the appropriate services. A full `ApplicationManifest.xml` is available at the end of this document. 

```xml
<PortBinding ContainerPort="80" EndpointRef="azurevotefrontTypeEndpoint"/>
```

```xml
<PortBinding ContainerPort="6379" EndpointRef="azurevotebackTypeEndpoint"/>
```

3. Add DNS name to backend service

The frontend service uses DNS to communicate with the backend service. The DNS name is provided in the Dockerfile for the frontend as shown below. 

```Dockerfile
ENV REDIS redisbackend.testapp
```

The python script that renders the front end uses this DNS name to resolve and connect to the backend redis store as shown below.

```python
# Get DNS Name
redis_server = os.environ['REDIS'] 

# Connect to the Redis store
r = redis.StrictRedis(host=redis_server, port=6379, db=0)
```

For Service Fabric to assign this DNS name to the backend service, the name needs to be specified in the `ApplicationManifest.xml`. Add the 'ServiceDnsName' field to the 'Service' field as shown below. 

```xml
<Service Name="azurevoteback" ServiceDnsName="redisbackend.testapp">
  <StatelessService ServiceTypeName="azurevotebackType" InstanceCount="1">
    <SingletonPartition/>
  </StatelessService>
</Service>
```
At this point in the tutorial, the template for a Service Package application is available for deployment to a cluster. In the subsequent tutorial, this application is deployed and ran in a Service Fabric cluster.

## Examples of Completed Manifests

### ApplicationManifest.xml
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ApplicationManifest ApplicationTypeName="TestContainerType" ApplicationTypeVersion="1.0.0" xmlns="http://schemas.microsoft.com/2011/01/fabric" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="azurevotefrontPkg" ServiceManifestVersion="1.0.0"/>
    <Policies> 
    <ContainerHostPolicies CodePackageRef="Code">
        <RepositoryCredentials AccountName="suhuruli" Password="/+=em0/=I5V==F=JBmOt/+zrAp1/F7HD" PasswordEncrypted="false"/>
        <PortBinding ContainerPort="80" EndpointRef="azurevotefrontTypeEndpoint"/>
    </ContainerHostPolicies>
        </Policies>
  </ServiceManifestImport>
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="azurevotebackPkg" ServiceManifestVersion="1.0.0"/>
      <Policies> 
        <ContainerHostPolicies CodePackageRef="Code">
          <RepositoryCredentials AccountName="suhuruli" Password="/+=em0/=I5V==F=JBmOt/+zrAp1/F7HD" PasswordEncrypted="false"/>
          <PortBinding ContainerPort="6379" EndpointRef="azurevotebackTypeEndpoint"/>
        </ContainerHostPolicies>
      </Policies>
  </ServiceManifestImport>
  <DefaultServices>
    <Service Name="azurevotefront">
      <StatelessService ServiceTypeName="azurevotefrontType" InstanceCount="1">
        <SingletonPartition/>
      </StatelessService>
    </Service>
    <Service Name="azurevoteback" ServiceDnsName="redisbackend.testapp">
      <StatelessService ServiceTypeName="azurevotebackType" InstanceCount="1">
        <SingletonPartition/>
      </StatelessService>
    </Service>
  </DefaultServices>
</ApplicationManifest>
```

### Front-end ServiceManifest.xml 
```xml
<?xml version="1.0" encoding="utf-8"?>
<ServiceManifest Name="azurevotefrontPkg" Version="1.0.0"
                 xmlns="http://schemas.microsoft.com/2011/01/fabric" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" >

   <ServiceTypes>
      <StatelessServiceType ServiceTypeName="azurevotefrontType" UseImplicitHost="true">
   </StatelessServiceType>
   </ServiceTypes>
   
   <CodePackage Name="code" Version="1.0.0">
      <EntryPoint>
         <ContainerHost>
            <ImageName>suhuruli.azurecr.io/azure-vote-front:v1</ImageName>
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
      <Endpoint Name="azurevotefrontTypeEndpoint" UriScheme="http" Port="8080" Protocol="http"/>
    </Endpoints>
  </Resources>

 </ServiceManifest>
```

### Redis ServiceManifest.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<ServiceManifest Name="azurevotebackPkg" Version="1.0.0"
                 xmlns="http://schemas.microsoft.com/2011/01/fabric" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" >

   <ServiceTypes>
      <StatelessServiceType ServiceTypeName="azurevotebackType" UseImplicitHost="true">
   </StatelessServiceType>
   </ServiceTypes>
   
   <CodePackage Name="code" Version="1.0.0">
      <EntryPoint>
         <ContainerHost>
            <ImageName>suhuruli.azurecr.io/azure-vote-back:v1</ImageName>
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
      <Endpoint Name="azurevotebackTypeEndpoint" UriScheme="http" Port="6379" Protocol="http"/>
    </Endpoints>
  </Resources>
 </ServiceManifest>
```
## Next steps

In this tutorial, multiple containers were prepared into a Service Fabric application using Yeoman. The following steps were completed:

> [!div class="checklist"]
> * Install Yeoman
> * Used Yeoman to generate a template for an application 
> * Configured container and service settings in the application and service manifests

Advance to the next tutorial to learn about building, deploying and running the application in a Service Fabric cluster.

> [!div class="nextstepaction"]
> [Deploy Service Fabric cluster](service-fabric-tutorial-deploy-run-containers.md)


