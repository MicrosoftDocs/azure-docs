---
title: Package and deploy containers as a Service Fabric app in Azure | Microsoft Docs
description: In this tutorial, you learn how to generate an Azure Service Fabric application definition using Yeoman and package the application. 
services: service-fabric
documentationcenter: ''
author: suhuruli
manager: timlt
editor: suhuruli
tags: servicefabric
keywords: Docker, Containers, Microservices, Service Fabric, Azure

ms.assetid: 
ms.service: service-fabric
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/12/2017
ms.author: suhuruli
ms.custom: mvc
---
# Tutorial: Package and deploy containers as a Service Fabric application using Yeoman

This tutorial is part two in a series. In this tutorial, a template generator tool (Yeoman) is used to generate a Service Fabric application definition. This application can then be used to deploy containers to Service Fabric. In this tutorial you learn how to:

> [!div class="checklist"]
> * Install Yeoman
> * Create an application package using Yeoman
> * Configure settings in the application package for use with containers
> * Build the application
> * Deploy and run the application
> * Clean up the application

## Prerequisites

* The container images pushed to Azure Container Registry created in [Part 1](service-fabric-tutorial-create-container-images.md) of this tutorial series are used.
* Linux development environment is [set up](service-fabric-tutorial-create-container-images.md).

## Install Yeoman

Service fabric provides scaffolding tools to help create applications from terminal using Yeoman template generator. Follow the steps below to ensure you have the Yeoman template generator.

1. Install nodejs and NPM on your machine. Note that, Mac OSX users will have to use the package manager Homebrew

    ```bash
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
    nvm install node 
    ```
2. Install Yeoman template generator on your machine from NPM

    ```bash
    npm install -g yo
    ```
3. Install the Service Fabric Yeoman container generator

    ```bash 
    npm install -g generator-azuresfcontainer
    ```

## Package a Docker image container with Yeoman

1. To create a Service Fabric container application, in the 'container-tutorial' directory of the cloned repository, run the following command.

    ```bash
    yo azuresfcontainer
    ```
2. Please type in "TestContainer" to name your application
3. Please type in "azurevotefront" to name your application service.
4. Provide the container image path in ACR for the frontend repo - for example '\<acrName>.azurecr.io/azure-vote-front:v1'. The \<acrName> field must be the same as the value that was used in the previous tutorial.
5. Press Enter to leave the Commands section empty.
6. Specify an instance count of 1.

The following shows the input and output of running the yo command:

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

To add another container service to an application already created using Yeoman, perform the following steps:

1. Change directory one level to the **TestContainer** directory, for example, *./TestContainer*
2. Run `yo azuresfcontainer:AddService`
3. Name the service 'azurevoteback'
4. Provide the container image path for Redis - 'alpine:redis'
5. Press Enter to leave the Commands section empty
6. Specify an instance count of "1".

The entries for adding the service used are all shown:

```bash
? Name of the application service: azurevoteback
? Input the Image Name: alpine:redis
? Commands:
? Number of instances of guest container application: 1
   create TestContainer/azurevotebackPkg/ServiceManifest.xml
   create TestContainer/azurevotebackPkg/config/Settings.xml
   create TestContainer/azurevotebackPkg/code/Dummy.txt
```

For the remainder of this tutorial, we are working in the **TestContainer** directory. For example, *./TestContainer/TestContainer*. The contents of this directory should be as follows.

```bash
$ ls
ApplicationManifest.xml azurevotefrontPkg azurevotebackPkg
```

## Configure the application manifest with credentials for Azure Container Registry

For Service Fabric to pull the container images from Azure Container Registry, we need to provide the credentials in the **ApplicationManifest.xml**.

Log in to your ACR instance. Use the **az acr login** command to complete the operation. Provide the unique name given to the container registry when it was created.

```bash
az acr login --name <acrName>
```

The command returns a **Login Succeeded** message once completed.

Next, run the following command to get the password of your container registry. This password is used by Service Fabric to authenticate with ACR to pull the container images.

```bash
az acr credential show -n <acrName> --query passwords[0].value
```

In the **ApplicationManifest.xml**, add the code snippet under the **ServiceManifestImport** element for the front end service. Insert your **acrName** for the **AccountName** field and the password returned from the previous command is used for the **Password** field. A full **ApplicationManifest.xml** is provided at the end of this document.

```xml
<Policies>
  <ContainerHostPolicies CodePackageRef="Code">
    <RepositoryCredentials AccountName="<acrName>" Password="<password>" PasswordEncrypted="false"/>
  </ContainerHostPolicies>
</Policies>
```

## Configure communication and container port-to-host port mapping

### Configure communication port

Configure an HTTP endpoint so clients can communicate with your service. Open the *./TestContainer/azurevotefrontPkg/ServiceManifest.xml* file and declare an endpoint resource in the **ServiceManifest** element.  Add the protocol, port, and name. For this tutorial, the service listens on port 80. The following snippet is placed under the *ServiceManifest* tag in the resource.

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

Similarly, modify the Service Manifest for the backend service. Open the *./TestContainer/azurevotebackPkg/ServiceManifest.xml* and declare an endpoint resource in the **ServiceManifest** element. For this tutorial, the redis default of 6379 is maintained. The following snippet is placed under the *ServiceManifest* tag in the resource.

```xml
<Resources>
  <Endpoints>
    <!-- This endpoint is used by the communication listener to obtain the port on which to 
            listen. Please note that if your service is partitioned, this port is shared with 
            replicas of different partitions that are placed in your code. -->
    <Endpoint Name="azurevotebackTypeEndpoint" Port="6379" Protocol="tcp"/>
  </Endpoints>
</Resources>
```

Providing the **UriScheme**automatically registers the container endpoint with the Service Fabric Naming service for discoverability. A full ServiceManifest.xml example file for the backend service is provided at the end of this article as an example.

### Map container ports to a service

In order to expose the containers in the cluster, we also need to create a port binding in the 'ApplicationManifest.xml'. The **PortBinding** policy references the **Endpoints** we defined in the **ServiceManifest.xml** files. Incoming requests to these endpoints get mapped to the container ports that are opened and bounded here. In the **ApplicationManifest.xml** file, add the following code to bind port 80 and 6379 to the endpoints. A full **ApplicationManifest.xml** is available at the end of this document.

```xml
<ContainerHostPolicies CodePackageRef="Code">
    <PortBinding ContainerPort="80" EndpointRef="azurevotefrontTypeEndpoint"/>
</ContainerHostPolicies>
```

```xml
<ContainerHostPolicies CodePackageRef="Code">
    <PortBinding ContainerPort="6379" EndpointRef="azurevotebackTypeEndpoint"/>
</ContainerHostPolicies>
```

### Add a DNS name to the backend service

For Service Fabric to assign this DNS name to the backend service, the name needs to be specified in the **ApplicationManifest.xml**. Add the **ServiceDnsName** attribute to the **Service** element as shown:

```xml
<Service Name="azurevoteback" ServiceDnsName="redisbackend.testapp">
  <StatelessService ServiceTypeName="azurevotebackType" InstanceCount="1">
    <SingletonPartition/>
  </StatelessService>
</Service>
```

The frontend service reads an environment variable to know the DNS name of the Redis instance. This environment variable is already defined in the Dockerfile that was used to generate the Docker image and no action needs to be taken here.

```Dockerfile
ENV REDIS redisbackend.testapp
```

The following code snippet illustrates how the front-end Python code picks up the environment variable described in the Dockerfile. No action needs to be taken here.

```python
# Get DNS Name
redis_server = os.environ['REDIS']

# Connect to the Redis store
r = redis.StrictRedis(host=redis_server, port=6379, db=0)
```

At this point in the tutorial, the template for a Service Package application is available for deployment to a cluster. In the subsequent tutorial, this application is deployed and ran in a Service Fabric cluster.

## Create a Service Fabric cluster

To deploy the application to a cluster in Azure, create your own cluster.

Party clusters are free, limited-time Service Fabric clusters hosted on Azure. They are run by the Service Fabric team where anyone can deploy applications and learn about the platform. To get access to a Party Cluster, [follow the instructions](http://aka.ms/tryservicefabric).

In order to perform management operations on the secure party cluster, you can use Service Fabric Explorer, CLI, or Powershell. To use Service Fabric Explorer, you will need to download the PFX file from the Party Cluster website and import the certificate into your certificate store (Windows or Mac) or into the browser itself (Ubuntu). There is no password for the self-signed certificates from the party cluster.

To perform management operations with Powershell or CLI, you will need the PFX (Powershell) or PEM (CLI). To convert the PFX to a PEM file, please run the following command:

```bash
openssl pkcs12 -in party-cluster-1277863181-client-cert.pfx -out party-cluster-1277863181-client-cert.pem -nodes -passin pass:
```

For information about creating your own cluster, see [Create a Service Fabric cluster on Azure](service-fabric-tutorial-create-vnet-and-linux-cluster.md).

## Build and deploy the application to the cluster

You can deploy the application the Azure cluster using the Service Fabric CLI. If Service Fabric CLI is not installed on your machine, follow instructions [here](service-fabric-get-started-linux.md#set-up-the-service-fabric-cli) to install it.

Connect to the Service Fabric cluster in Azure. Replace the sample endpoint with your own. The endpoint must be a full URL similar to the one below.

```bash
sfctl cluster select --endpoint https://linh1x87d1d.westus.cloudapp.azure.com:19080 --pem party-cluster-1277863181-client-cert.pem --no-verify
```

Use the install script provided in the **TestContainer** directory to copy the application package to the cluster's image store, register the application type, and create an instance of the application.

```bash
./install.sh
```

Open a browser and navigate to Service Fabric Explorer at http://lin4hjim3l4.westus.cloudapp.azure.com:19080/Explorer. Expand the Applications node and note that there is an entry for your application type and another for the instance.

![Service Fabric Explorer][sfx]

In order to connect to the running application, open a web browser and go to the cluster url - for example http://lin0823ryf2he.cloudapp.azure.com:80. You should see the Voting application in the web UI.

![votingapp][votingapp]

## Clean up

Use the uninstall script provided in the template to delete the application instance from the cluster and unregister the application type. This command takes some time to clean up the instance and the 'install.sh' command cannot be run immediately after this script.

```bash
./uninstall.sh
```

## Examples of completed manifests

### ApplicationManifest.xml

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ApplicationManifest ApplicationTypeName="TestContainerType" ApplicationTypeVersion="1.0.0" xmlns="http://schemas.microsoft.com/2011/01/fabric" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="azurevotefrontPkg" ServiceManifestVersion="1.0.0"/>
    <Policies>
    <ContainerHostPolicies CodePackageRef="Code">
        <RepositoryCredentials AccountName="myaccountname" Password="<password>" PasswordEncrypted="false"/>
        <PortBinding ContainerPort="80" EndpointRef="azurevotefrontTypeEndpoint"/>
    </ContainerHostPolicies>
        </Policies>
  </ServiceManifestImport>
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="azurevotebackPkg" ServiceManifestVersion="1.0.0"/>
      <Policies>
        <ContainerHostPolicies CodePackageRef="Code">
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
            <ImageName>acrName.azurecr.io/azure-vote-front:v1</ImageName>
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
      <Endpoint Name="azurevotefrontTypeEndpoint" UriScheme="http" Port="80" Protocol="http"/>
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
            <ImageName>alpine:redis</ImageName>
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
      <Endpoint Name="azurevotebackTypeEndpoint" Port="6379" Protocol="tcp"/>
    </Endpoints>
  </Resources>
 </ServiceManifest>
```

## Next steps

In this tutorial, multiple containers were packaged into a Service Fabric application using Yeoman. This application was then deployed and run on a Service Fabric cluster. The following steps were completed:

> [!div class="checklist"]
> * Install Yeoman
> * Create an application package using Yeoman
> * Configure settings in the application package for use with containers
> * Build the application
> * Deploy and run the application
> * Clean up the application

Advance to the next tutorial to learn about failover and scaling of the application in Service Fabric.

> [!div class="nextstepaction"]
> [Learn about failover and scaling applications](service-fabric-tutorial-containers-failover.md)

[votingapp]: ./media/service-fabric-tutorial-deploy-run-containers/votingapp.png
[sfx]: ./media/service-fabric-tutorial-deploy-run-containers/containerspackagetutorialsfx.png