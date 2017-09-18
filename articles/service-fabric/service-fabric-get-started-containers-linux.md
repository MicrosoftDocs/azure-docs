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
> * [Windows](service-fabric-get-started-containers.md)
> * [Linux](service-fabric-get-started-containers-linux.md)

Running an existing application in a Linux container on a Service Fabric cluster doesn't require any changes to your application. This article walks you through creating a Docker image containing a Python [Flask](http://flask.pocoo.org/) web application and deploying it to a Service Fabric cluster.  You will also share your containerized application through [Azure Container Registry](/azure/container-registry/).  This article assumes a basic understanding of Docker. You can learn about Docker by reading the [Docker Overview](https://docs.docker.com/engine/understanding-docker/).

## Prerequisites
* A development computer running:
  * [Service Fabric SDK and tools](service-fabric-get-started-linux.md).
  * [Docker CE for Linux](https://docs.docker.com/engine/installation/#prior-releases). 
  * [Service Fabric CLI](service-fabric-cli.md)

* A registry in Azure Container Registry - [Create a container registry](../container-registry/container-registry-get-started-portal.md) in your Azure subscription. 

## Define the Docker container
Build an image based on the [Python image](https://hub.docker.com/_/python/) located on Docker Hub. 

Define your Docker container in a Dockerfile. The Dockerfile contains instructions for setting up the environment inside your container, loading the application you want to run, and mapping ports. The Dockerfile is the input to the `docker build` command, which creates the image. 

Create an empty directory and create the file *Dockerfile* (with no file extension). Add the following to *Dockerfile* and save your changes:

```
# Use an official Python runtime as a base image
FROM python:2.7-slim

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD . /app

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Make port 80 available outside this container
EXPOSE 80

# Define environment variable
ENV NAME World

# Run app.py when the container launches
CMD ["python", "app.py"]
```

Read the [Dockerfile reference](https://docs.docker.com/engine/reference/builder/) for more information.

## Create a simple web application
Create a Flask web application listening on port 80 that returns "Hello World!".  In the same directory, create the file *requirements.txt*.  Add the following and save your changes:
```
Flask
```

Also create the *app.py* file and add the following:

```python
from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello():
    
    return 'Hello World!'

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)
```

## Build the image
Run the `docker build` command to create the image that runs your web application. Open a PowerShell window and navigate to *c:\temp\helloworldapp*. Run the following command:

```bash
docker build -t helloworldapp .
```

This command builds the new image using the instructions in your Dockerfile, naming (-t tagging) the image "helloworldapp". Building an image pulls the base image down from Docker Hub and creates a new image that adds your application on top of the base image.  

Once the build command completes, run the `docker images` command to see information on the new image:

```bash
$ docker images
    
REPOSITORY                    TAG                 IMAGE ID            CREATED             SIZE
helloworldapp                 latest              86838648aab6        2 minutes ago       194 MB
```

## Run the application locally
Verify that your containerized application runs locally before pushing it the container registry.  

Run the application, mapping your computer's port 4000 to the container's exposed port 80:

```bash
docker run -d -p 4000:80 --name my-web-site helloworldapp
```

*name* gives a name to the running container (instead of the container ID).

Connect to the running container.  Open a web browser pointing to the IP address returned on port 4000, for example "http://localhost:4000". You should see the heading "Hello World!" display in the browser.

![Hello World!][hello-world]

To stop your container, run:

```bash
docker stop my-web-site
```

Delete the container from your development machine:

```bash
docker rm my-web-site
```

## Push the image to the container registry
After you verify that the application runs in Docker, push the image to your registry in Azure Container Registry.

Run `docker login` to log in to your container registry with your [registry credentials](../container-registry/container-registry-authentication.md).

The following example passes the ID and password of an Azure Active Directory [service principal](../active-directory/active-directory-application-objects.md). For example, you might have assigned a service principal to your registry for an automation scenario.  Or, you could login using your registry username and password.

```bash
docker login myregistry.azurecr.io -u xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -p myPassword
```

The following command creates a tag, or alias, of the image, with a fully qualified path to your registry. This example places the image in the `samples` namespace to avoid clutter in the root of the registry.

```bash
docker tag helloworldapp myregistry.azurecr.io/samples/helloworldapp
```

Push the image to your container registry:

```bash
docker push myregistry.azurecr.io/samples/helloworldapp
```

## Package the Docker image with Yeoman
The Service Fabric SDK for Linux includes a [Yeoman](http://yeoman.io/) generator that makes it easy to create your application and add a container image. Let's use Yeoman to create an application with a single Docker container called *SimpleContainerApp*.

To create a Service Fabric container application, open a terminal window and run `yo azuresfcontainer`.  

Name your application (for example, "mycontainer"). 

Provide the URL for the container image in a container registry (for example, "myregistry.azurecr.io/samples/helloworldapp"). 

This image has a workload entry-point defined, so need to explicitly specify input commands (commands run inside the container, which will keep the container running after startup). 

Specify an instance count of "1".

![Service Fabric Yeoman generator for containers][sf-yeoman]

## Configure port mapping and container repository authentication
Your containerized service needs an endpoint for communication.  Now add the protocol, port, and type to an `Endpoint` in the ServiceManifest.xml file. For this article, the containerized service listens on port 4000: 

```xml
<Endpoint Name="myServiceTypeEndpoint" UriScheme="http" Port="4000" Protocol="http"/>
```
Providing the `UriScheme` automatically registers the container endpoint with the Service Fabric Naming service for discoverability. A full ServiceManifest.xml example file is provided at the end of this article. 

Configure the container port-to-host port mapping by specifying a `PortBinding` policy in `ContainerHostPolicies` of the ApplicationManifest.xml file.  For this article, `ContainerPort` is 80 (the container exposes port 80, as specified in the Dockerfile) and `EndpointRef` is "myServiceTypeEndpoint" (the endpoint defined in the service manifest).  Incoming requests to the service on port 4000 are mapped to port 80 on the container.  If your container needs to authenticate with a private repository, then add `RepositoryCredentials`.  For this article, add the account name and password for the myregistry.azurecr.io container registry. 

```xml
<Policies>
    <ContainerHostPolicies CodePackageRef="Code">
        <RepositoryCredentials AccountName="myregistry" Password="=P==/==/=8=/=+u4lyOB=+=nWzEeRfF=" PasswordEncrypted="false"/>
        <PortBinding ContainerPort="80" EndpointRef="myServiceTypeEndpoint"/>
    </ContainerHostPolicies>
</Policies>
```

## Build and package the Service Fabric application
The Service Fabric Yeoman templates include a build script for [Gradle](https://gradle.org/), which you can use to build the application from the terminal. To build and package the application, run the following:

```bash
cd mycontainer
gradle
```

## Deploy the application
Once the application is built, you can deploy it to the local cluster using the Service Fabric CLI.

Connect to the local Service Fabric cluster.

```bash
sfctl cluster select --endpoint http://localhost:19080
```

Use the install script provided in the template to copy the application package to the cluster's image store, register the application type, and create an instance of the application.

```bash
./install.sh
```

Open a browser and navigate to Service Fabric Explorer at http://localhost:19080/Explorer (replace localhost with the private IP of the VM if using Vagrant on Mac OS X). Expand the Applications node and note that there is now an entry for your application type and another for the first instance of that type.

Connect to the running container.  Open a web browser pointing to the IP address returned on port 4000, for example "http://localhost:4000". You should see the heading "Hello World!" display in the browser.

![Hello World!][hello-world]

## Clean up
Use the uninstall script provided in the template to delete the application instance from the local development cluster and unregister the application type.

```bash
./uninstall.sh
```

After you push the image to the container registry you can delete the local image from your development computer:

```
docker rmi helloworldapp
docker rmi myregistry.azurecr.io/samples/helloworldapp
```

## Complete example Service Fabric application and service manifests
Here are the complete service and application manifests used in this article.

### ServiceManifest.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<ServiceManifest Name="myservicePkg"
                 Version="1.0.0"
                 xmlns="http://schemas.microsoft.com/2011/01/fabric"
                 xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <ServiceTypes>
    <!-- This is the name of your ServiceType.
         The UseImplicitHost attribute indicates this is a guest service. -->
    <StatelessServiceType ServiceTypeName="myserviceType" UseImplicitHost="true" />
  </ServiceTypes>

  <!-- Code package is your service executable. -->
  <CodePackage Name="Code" Version="1.0.0">
    <EntryPoint>
      <!-- Follow this link for more information about deploying Windows containers 
      to Service Fabric: https://aka.ms/sfguestcontainers -->
      <ContainerHost>
        <ImageName>myregistry.azurecr.io/samples/helloworldapp</ImageName>
        <Commands></Commands>
      </ContainerHost>
    </EntryPoint>
    <!-- Pass environment variables to your container: -->
    
    <EnvironmentVariables>
      <!--
      <EnvironmentVariable Name="VariableName" Value="VariableValue"/>
      -->
    </EnvironmentVariables>
    
  </CodePackage>

  <Resources>
    <Endpoints>
      <!-- This endpoint is used by the communication listener to obtain the port on which to 
           listen. Please note that if your service is partitioned, this port is shared with 
           replicas of different partitions that are placed in your code. -->
      <Endpoint Name="myServiceTypeEndpoint" UriScheme="http" Port="4000" Protocol="http"/>
    </Endpoints>
  </Resources>
</ServiceManifest>
```
### ApplicationManifest.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<ApplicationManifest ApplicationTypeName="mycontainerType"
                     ApplicationTypeVersion="1.0.0"
                     xmlns="http://schemas.microsoft.com/2011/01/fabric"
                     xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <!-- Import the ServiceManifest from the ServicePackage. The ServiceManifestName and ServiceManifestVersion 
       should match the Name and Version attributes of the ServiceManifest element defined in the 
       ServiceManifest.xml file. -->
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="myservicePkg" ServiceManifestVersion="1.0.0" />
    <ConfigOverrides />
    <Policies>
      <ContainerHostPolicies CodePackageRef="Code">
        <RepositoryCredentials AccountName="myregistry" Password="=P==/==/=8=/=+u4lyOB=+=nWzEeRfF=" PasswordEncrypted="false"/>
        <PortBinding ContainerPort="80" EndpointRef="myServiceTypeEndpoint"/>
      </ContainerHostPolicies>
    </Policies>
  </ServiceManifestImport>
  <DefaultServices>
    <!-- The section below creates instances of service types, when an instance of this 
         application type is created. You can also create one or more instances of service type using the 
         ServiceFabric PowerShell module.
         
         The attribute ServiceTypeName below must match the name defined in the imported ServiceManifest.xml file. -->
    <Service Name="myservice">
      <!-- On a local development cluster, set InstanceCount to 1.  On a multi-node production 
      cluster, set InstanceCount to -1 for the container service to run on every node in 
      the cluster.
      -->
      <StatelessService ServiceTypeName="myserviceType" InstanceCount="1">
        <SingletonPartition />
      </StatelessService>
    </Service>
  </DefaultServices>
</ApplicationManifest>
```
## Adding more services to an existing application

To add another container service to an application already created using yeoman, perform the following steps:

1. Change directory to the root of the existing application.  For example, `cd ~/YeomanSamples/MyApplication`, if `MyApplication` is the application created by Yeoman.
2. Run `yo azuresfcontainer:AddService`

<a id="manually"></a>


## Configure time interval before container is force terminated

You can configure a time interval for the runtime to wait before the container is removed after the service deletion (or a move to another node) has started. Configuring the time interval sends the `docker stop <time in seconds>` command to the container.   For more detail, see [docker stop](https://docs.docker.com/engine/reference/commandline/stop/). The time interval to wait is specified under the `Hosting` section. The following cluster manifest snippet shows how to set the wait interval:

```xml
{
        "name": "Hosting",
        "parameters": [
          {
            "ContainerDeactivationTimeout": "10",
	      ...
          }
        ]
}
```
The default time interval is set to 10 seconds. Since this configuration is dynamic, a config only upgrade on the cluster updates the timeout. 


## Configure the runtime to remove unused container images

You can configure the Service Fabric cluster to remove unused container images from the node. This configuration allows disk space to be recaptured if too many container images are present on the node.  To enable this feature, update the `Hosting` section in the cluster manifest as shown in the following snippet: 


```xml
{
        "name": "Hosting",
        "parameters": [
          {
	        "PruneContainerImages": “True”,
            "ContainerImagesToSkip": "microsoft/windowsservercore|microsoft/nanoserver|…",
	      ...
          }
        ]
} 
```

For images that should not be deleted, you can specify them under the `ContainerImagesToSkip` parameter. 


## Next steps
* Learn more about running [containers on Service Fabric](service-fabric-containers-overview.md).
* Read the [Deploy a .NET application in a container](service-fabric-host-app-in-a-container.md) tutorial.
* Learn about the Service Fabric [application life-cycle](service-fabric-application-lifecycle.md).
* Checkout the [Service Fabric container code samples](https://github.com/Azure-Samples/service-fabric-dotnet-containers) on GitHub.

[hello-world]: ./media/service-fabric-get-started-containers-linux/HelloWorld.png
[sf-yeoman]: ./media/service-fabric-get-started-containers-linux/YoSF.png
