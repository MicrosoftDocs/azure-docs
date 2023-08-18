---
title: Create an Azure Service Fabric container application on Linux 
description: Create your first Linux container application on Azure Service Fabric. Build a Docker image with your application, push the image to a container registry, build and deploy a Service Fabric container application.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
ms.custom: devx-track-python
services: service-fabric
ms.date: 07/14/2022
---

# Create your first Service Fabric container application on Linux
> [!div class="op_single_selector"]
> * [Windows](service-fabric-get-started-containers.md)
> * [Linux](service-fabric-get-started-containers-linux.md)

Running an existing application in a Linux container on a Service Fabric cluster doesn't require any changes to your application. This article walks you through creating a Docker image containing a Python [Flask](http://flask.pocoo.org/) web application and deploying it to a Service Fabric cluster. You will also share your containerized application through [Azure Container Registry](../container-registry/index.yml). This article assumes a basic understanding of Docker. You can learn about Docker by reading the [Docker Overview](https://docs.docker.com/engine/understanding-docker/).

> [!NOTE]
> This article applies to a Linux development environment.  The Service Fabric cluster runtime and the Docker runtime must be running on the same OS.  You cannot run Linux containers on a Windows cluster.

## Prerequisites
* A development computer running:
  * [Service Fabric SDK and tools](service-fabric-get-started-linux.md).
  * [Docker CE for Linux](https://docs.docker.com/engine/installation/#prior-releases). 
  * [Service Fabric CLI](service-fabric-cli.md)

* A Linux cluster with three or more nodes.

* A registry in Azure Container Registry - [Create a container registry](../container-registry/container-registry-get-started-portal.md) in your Azure subscription. 

## Define the Docker container
Build an image based on the [Python image](https://hub.docker.com/_/python/) located on Docker Hub. 

Specify your Docker container in a Dockerfile. The Dockerfile consists of instructions for setting up the environment inside your container, loading the application you want to run, and mapping ports. The Dockerfile is the input to the `docker build` command, which creates the image. 

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

## Create a basic web application
Create a Flask web application listening on port 80 that returns "Hello World!". In the same directory, create the file *requirements.txt*. Add the following and save your changes:
```
Flask
```

Also create the *app.py* file and add the following snippet:

```python
from flask import Flask

app = Flask(__name__)


@app.route("/")
def hello():

    return 'Hello World!'


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)
```

## Login to Docker and build the image

Next we'll create the image that runs your web application. When pulling public images from Docker (like `python:2.7-slim` in our Dockerfile), it's a best practice to authenticate with your Docker Hub account instead of making an anonymous pull request.

> [!NOTE]
> When making frequent anonymous pull requests you might see Docker errors similar to `ERROR: toomanyrequests: Too Many Requests.` or `You have reached your pull rate limit.` Authenticate to Docker Hub to prevent these errors. See [Manage public content with Azure Container Registry](../container-registry/buffer-gate-public-content.md) for more info.

Open a PowerShell window and navigate to the directory containing the Dockerfile. Then run the following commands:

```
docker login
docker build -t helloworldapp .
```

This command builds the new image using the instructions in your Dockerfile, naming (-t tagging) the image `helloworldapp`. To build a container image, the base image is first downloaded down from Docker Hub to which the application is added. 

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

Connect to the running container. Open a web browser pointing to the IP address returned on port 4000, for example "http:\//localhost:4000". You should see the heading "Hello World!" display in the browser.

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

Run `docker login` to sign in to your container registry with your [registry credentials](../container-registry/container-registry-authentication.md).

The following example passes the ID and password of an Azure Active Directory [service principal](../active-directory/develop/app-objects-and-service-principals.md). For example, you might have assigned a service principal to your registry for an automation scenario. Or, you could sign in using your registry username and password.

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
The Service Fabric SDK for Linux includes a [Yeoman](https://yeoman.io/) generator that makes it easy to create your application and add a container image. Let's use Yeoman to create an application with a single Docker container called *SimpleContainerApp*.

To create a Service Fabric container application, open a terminal window and run `yo azuresfcontainer`. 

Name your application (for example, `mycontainer`) and name the application service (for example, `myservice`).

For the image name, provide the URL for the container image in a container registry (for example, "myregistry.azurecr.io/samples/helloworldapp"). 

Since this image has a workload entry-point defined, you don't need to explicitly specify input commands (commands run inside the container, which will keep the container running after startup). 

Specify an instance count of "1".

Specify the port mapping in the appropriate format. For this article, you need to provide ```80:4000``` as the port mapping. By doing this you have configured that any incoming requests coming to port 4000 on the host machine are redirected to port 80 on the container.

![Service Fabric Yeoman generator for containers][sf-yeoman]

## Configure container repository authentication

See [Container Repository Authentication](configure-container-repository-credentials.md)to learn how to configure different types of authentication for container image downloading.

## Configure isolation mode
With the 6.3 runtime release, VM isolation is supported for Linux containers, thereby supporting two isolation modes for containers: process and Hyper-V. With the Hyper-V isolation mode, the kernels are isolated between each container and the container host. The Hyper-V isolation is implemented using [Clear Containers](https://software.intel.com/en-us/articles/intel-clear-containers-2-using-clear-containers-with-docker). The isolation mode is specified for Linux clusters in the `ServicePackageContainerPolicy` element in the application manifest file. The isolation modes that can be specified are `process`, `hyperv`, and `default`. The default is process isolation mode. The following snippet shows how the isolation mode is specified in the application manifest file.

```xml
<ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="MyServicePkg" ServiceManifestVersion="1.0.0"/>
      <Policies>
        <ServicePackageContainerPolicy Hostname="votefront" Isolation="hyperv">
          <PortBinding ContainerPort="80" EndpointRef="myServiceTypeEndpoint"/>
        </ServicePackageContainerPolicy>
    </Policies>
  </ServiceManifestImport>
```


## Configure resource governance
[Resource governance](service-fabric-resource-governance.md) restricts the resources that the container can use on the host. The `ResourceGovernancePolicy` element, which is specified in the application manifest, is used to declare resource limits for a service code package. Resource limits can be set for the following resources: Memory, MemorySwap, CpuShares (CPU relative weight), MemoryReservationInMB, BlkioWeight (BlockIO relative weight). In this example, service package Guest1Pkg gets one core on the cluster nodes where it is placed. Memory limits are absolute, so the code package is limited to 1024 MB of memory (and a soft-guarantee reservation of the same). Code packages (containers or processes) are not able to allocate more memory than this limit, and attempting to do so results in an out-of-memory exception. For resource limit enforcement to work, all code packages within a service package should have memory limits specified.

```xml
<ServiceManifestImport>
  <ServiceManifestRef ServiceManifestName="MyServicePKg" ServiceManifestVersion="1.0.0" />
  <Policies>
    <ServicePackageResourceGovernancePolicy CpuCores="1"/>
    <ResourceGovernancePolicy CodePackageRef="Code" MemoryInMB="1024"  />
  </Policies>
</ServiceManifestImport>
```




## Configure docker HEALTHCHECK 

Starting v6.1, Service Fabric automatically integrates [docker HEALTHCHECK](https://docs.docker.com/engine/reference/builder/#healthcheck) events to its system health report. This means that if your container has **HEALTHCHECK** enabled, Service Fabric will report health whenever the health status of the container changes as reported by Docker. An **OK** health report will appear in [Service Fabric Explorer](service-fabric-visualizing-your-cluster.md) when the *health_status* is *healthy* and **WARNING** will appear when *health_status* is *unhealthy*. 

Starting with the latest refresh release of v6.4, you have the option to specify that docker HEALTHCHECK evaluations should be reported as an error. If this option is enabled, an **OK** health report will appear when *health_status* is *healthy* and **ERROR** will appear when *health_status* is *unhealthy*.

The **HEALTHCHECK** instruction pointing to the actual check that is performed for monitoring container health must be present in the Dockerfile used while generating the container image.

![Screenshot shows details of the Deployed Service Package NodeServicePackage.][1]

![HealthCheckUnhealthyApp][2]

![HealthCheckUnhealthyDsp][3]

You can configure **HEALTHCHECK**  behavior for each container by specifying **HealthConfig** options as part of **ContainerHostPolicies** in ApplicationManifest.

```xml
<ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="ContainerServicePkg" ServiceManifestVersion="2.0.0" />
    <Policies>
      <ContainerHostPolicies CodePackageRef="Code">
        <HealthConfig IncludeDockerHealthStatusInSystemHealthReport="true"
		      RestartContainerOnUnhealthyDockerHealthStatus="false" 
		      TreatContainerUnhealthyStatusAsError="false" />
      </ContainerHostPolicies>
    </Policies>
</ServiceManifestImport>
```
By default *IncludeDockerHealthStatusInSystemHealthReport* is set to **true**, *RestartContainerOnUnhealthyDockerHealthStatus* is set to **false**, and *TreatContainerUnhealthyStatusAsError* is set to **false**. 

If *RestartContainerOnUnhealthyDockerHealthStatus* is set to **true**, a container repeatedly reporting unhealthy is restarted (possibly on other nodes).

If *TreatContainerUnhealthyStatusAsError* is set to **true**, **ERROR** health reports will appear when the container's *health_status* is *unhealthy*.

If you want to the disable the **HEALTHCHECK** integration for the entire Service Fabric cluster, you will need to set [EnableDockerHealthCheckIntegration](service-fabric-cluster-fabric-settings.md) to **false**.

## Deploy the application
Once the application is built, you can deploy it to the local cluster using the Service Fabric CLI.

Connect to the local Service Fabric cluster.

```bash
sfctl cluster select --endpoint http://localhost:19080
```

Use the install script provided in the templates at https://github.com/Azure-Samples/service-fabric-containers/ to copy the application package to the cluster's image store, register the application type, and create an instance of the application.


```bash
./install.sh
```

Open a browser and navigate to Service Fabric Explorer at http:\//localhost:19080/Explorer (replace localhost with the private IP of the VM if using Vagrant on Mac OS X). Expand the Applications node and note that there is now an entry for your application type and another for the first instance of that type.

Connect to the running container. Open a web browser pointing to the IP address returned on port 4000, for example "http:\//localhost:4000". You should see the heading "Hello World!" display in the browser.

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
                 xmlns:xsd="https://www.w3.org/2001/XMLSchema"
                 xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance">
  <ServiceTypes>
    <!-- This is the name of your ServiceType.
         The UseImplicitHost attribute indicates this is a guest service. -->
    <StatelessServiceType ServiceTypeName="myserviceType" UseImplicitHost="true" />
  </ServiceTypes>

  <!-- Code package is your service executable. -->
  <CodePackage Name="Code" Version="1.0.0">
    <EntryPoint>
      <!-- Follow this link for more information about deploying containers 
      to Service Fabric: https://aka.ms/sfguestcontainers -->
      <ContainerHost>
        <ImageName>myregistry.azurecr.io/samples/helloworldapp</ImageName>
        <!-- Pass comma delimited commands to your container: dotnet, myproc.dll, 5" -->
        <!--Commands> dotnet, myproc.dll, 5 </Commands-->
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
                     xmlns:xsd="https://www.w3.org/2001/XMLSchema"
                     xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance">
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
      <!-- On a local development cluster, set InstanceCount to 1. On a multi-node production 
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

1. Change directory to the root of the existing application. For example, `cd ~/YeomanSamples/MyApplication`, if `MyApplication` is the application created by Yeoman.
2. Run `yo azuresfcontainer:AddService`

<a id="manually"></a>


## Configure time interval before container is force terminated

You can configure a time interval for the runtime to wait before the container is removed after the service deletion (or a move to another node) has started. Configuring the time interval sends the `docker stop <time in seconds>` command to the container.  For more detail, see [docker stop](https://docs.docker.com/engine/reference/commandline/stop/). The time interval to wait is specified under the `Hosting` section. The following cluster manifest snippet shows how to set the wait interval:


```json
{
        "name": "Hosting",
        "parameters": [
          {
                "name": "ContainerDeactivationTimeout",
                "value" : "10"
          },
	      ...
        ]
}
```

The default time interval is set to 10 seconds. Since this configuration is dynamic, a config only upgrade on the cluster updates the timeout. 

## Configure the runtime to remove unused container images

You can configure the Service Fabric cluster to remove unused container images from the node. This configuration allows disk space to be recaptured if too many container images are present on the node. To enable this feature, update the `Hosting` section in the cluster manifest as shown in the following snippet: 


```json
{
        "name": "Hosting",
        "parameters": [
          {
                "name": "PruneContainerImages",
                "value": "True"
          },
          {
                "name": "ContainerImagesToSkip",
                "value": "mcr.microsoft.com/windows/servercore|mcr.microsoft.com/windows/nanoserver|mcr.microsoft.com/dotnet/framework/aspnet|..."
          }
          ...
          }
        ]
} 
```

For images that shouldn't be deleted, you can specify them under the `ContainerImagesToSkip` parameter. 

## Configure container image download time

The Service Fabric runtime allocates 20 minutes to download and extract container images, which works for the majority of container images. For large images, or when the network connection is slow, it might be necessary to increase the time to wait before aborting the image download and extraction. This timeout is set using the **ContainerImageDownloadTimeout** attribute in the **Hosting** section of the cluster manifest as shown in the following snippet:

```json
{
        "name": "Hosting",
        "parameters": [
          {
              "name": "ContainerImageDownloadTimeout",
              "value": "1200"
          }
        ]
}
```


## Set container retention policy

To assist with diagnosing container startup failures, Service Fabric (version 6.1 or higher) supports retaining containers that terminated or failed to start. This policy can be set in the **ApplicationManifest.xml** file as shown in the following snippet:

```xml
 <ContainerHostPolicies CodePackageRef="NodeService.Code" Isolation="process" ContainersRetentionCount="2"  RunInteractive="true"> 
```

The setting **ContainersRetentionCount** specifies the number of containers to retain when they fail. If a negative value is specified, all failing containers will be retained. When the **ContainersRetentionCount**  attribute is not specified, no containers will be retained. The attribute **ContainersRetentionCount** also supports Application Parameters so users can specify different values for test and production clusters. Use placement constraints to target the container service to a particular node when using this feature to prevent the container service from moving to other nodes. 
Any containers retained using this feature must be manually removed.

## Start the Docker daemon with custom arguments

With the 6.2 version of the Service Fabric runtime and greater, you can start the Docker daemon with custom arguments. When custom arguments are specified, Service Fabric does not pass any other argument to docker engine except the `--pidfile` argument. Hence, `--pidfile` shouldn't be passed as an argument. Additionally, the argument should continue to have the docker daemon listen on the default name pipe on Windows (or unix domain socket on Linux) for Service Fabric to communicate with the daemon. The custom arguments are specified in the cluster manifest under the **Hosting** section under **ContainerServiceArguments**. An example is shown in the following snippet: 
 

```json
{ 
        "name": "Hosting", 
        "parameters": [ 
          { 
            "name": "ContainerServiceArguments", 
            "value": "-H localhost:1234 -H unix:///var/run/docker.sock" 
          } 
        ] 
} 

```

## Next steps
* Learn more about running [containers on Service Fabric](service-fabric-containers-overview.md).
* Read the [Deploy a .NET application in a container](service-fabric-host-app-in-a-container.md) tutorial.
* Learn about the Service Fabric [application life-cycle](service-fabric-application-lifecycle.md).
* Checkout the [Service Fabric container code samples](https://github.com/Azure-Samples/service-fabric-containers) on GitHub.

[hello-world]: ./media/service-fabric-get-started-containers-linux/HelloWorld.png
[sf-yeoman]: ./media/service-fabric-get-started-containers-linux/YoSF.png

[1]: ./media/service-fabric-get-started-containers/HealthCheckHealthy.png
[2]: ./media/service-fabric-get-started-containers/HealthCheckUnhealthy_App.png
[3]: ./media/service-fabric-get-started-containers/HealthCheckUnhealthy_Dsp.png
