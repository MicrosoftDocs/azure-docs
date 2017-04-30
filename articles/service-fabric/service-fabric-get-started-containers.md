---
title: Create an Azure Service Fabric container app | Microsoft Docs
description: Create your first container app on Azure Service Fabric.
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
ms.date: 04/28/2017
ms.author: ryanwi

---

# Create your first Service Fabric container app
Running an existing web application in a Windows container on Service Fabric doesn't require any changes to your app. This quickstart walks you through creating a Docker image containing your app, packaging it, and deploying it to a cluster.  This article assumes a basic understanding of Docker. You can learn about Docker by reading the [Docker Overview](https://docs.docker.com/engine/understanding-docker/).

## Prerequisites
The development computer must be running:
* Visual Studio 2015 or Visual Studio 2017.
* [Service Fabric SDK and tools](service-fabric-get-started.md).
*  Docker for Windows.  [Get Docker CE for Windows (stable)](https://store.docker.com/editions/community/docker-ce-desktop-windows?tab=description). After installing and starting Docker, right-click on the tray icon and select **Switch to Windows containers**. This is required to run Docker images based on Windows. This command takes a few seconds to execute.

* A Windows cluster with 3 or more nodes running on Windows Server 2016 with Containers. Not a development cluster. [Create a cluster](service-fabric-get-started-azure-cluster.md)

* Azure container registry - Create a container registry in your Azure subscription. For example, use the Azure portal or the Azure CLI 2.0.

## Create a simple web app
Collect all the assets that you need to load into a Docker image in one place. For this quickstart, create a Hello World web app on your development computer.

1. Create a new directory, such as *c:\temp\helloworldapp*.
2. Create a sub-directory *c:\temp\helloworldapp\content*.
3. In *c:\temp\helloworldapp\content*, create a new file *index.html*.
4. Edit *index.html* and add the following line:
    ```
    <h1>Hello World!</h1>
    ```
5. Save your changes to *index.html*.

## Build the Docker image
Build an image based on the [microsft/iis image](https://hub.docker.com/r/microsoft/iis/) located on Docker Hub. The microsoft/iis base image is a Windows Server image which contains Windows Server Core and Internet Information Services (IIS).  Running this image in your container automatically starts IIS and installed websites.

Define your Docker image in a Dockerfile. The Dockerfile contains instructions for the base image, additional components, the app you want to run, and other configuration images. The Dockerfile is the input to the docker build command, which creates the image. 

1. Create a new file *Dockerfile* (with no file extension) in *c:\temp\helloworldapp* and add the following:

    ```
    # The `FROM` instruction specifies the base image. You are
    # extending the `microsoft/iis` image.
    FROM microsoft/iis

    # Create a directory to hold the web app in the container.
    RUN mkdir C:\site

    # Import and start IIS in the container.
    RUN powershell -NoProfile -Command \
        Import-module IISAdministration; \
        New-IISSite -Name "Site" -PhysicalPath C:\site -BindingInformation "*:8000:"

    # Opens port 8000 on the container.
    EXPOSE 8000

    # The final instruction copies the web app you created earlier into the container.
    ADD content/ /site
    ```

    There is no ```ENTRYPOINT``` command in this Dockerfile. You don't need one. When running Windows Server with IIS, the IIS process is the entrypoint, which is configured to start in the aspnet base image.

2. Run the Docker build command to create the image that runs your web app. Open a PowerShell window and navigate to *c:\temp\helloworldapp*. Run the following command:

    ```
    docker build -t helloworldwebapp .
    ```
    This command will build the new image using the instructions in your Dockerfile, naming (-t tagging) the image as helloworldwebapp. Building an image pulls the base image down from Docker Hub and then adds your app to that image.  The [microsft/iis image](https://hub.docker.com/r/microsoft/iis/) is 10.5 GB takes a while to download locally.  You might consider going out for a cup of coffee.

3. Once the build command completes, run the ```docker images``` command to see information on the new image:

    ```
    docker images
    
    REPOSITORY                    TAG                 IMAGE ID            CREATED             SIZE
    helloworldwebapp              latest              86838648aab6        2 minutes ago       10.1 GB
    ```

## Verify the image
You can verify your image locally before pushing it the container registry.  

1. Start the container with ```docker run```:

    ```
    docker run -d -p 8000:8000 --name my-web-site helloworldapp
    ```

    *name* gives a name to the running container (instead of the container ID).

2. Once the container starts, find its IP address so that you can connect to your running container from a browser:
    ```
    docker inspect -f "{{ .NetworkSettings.Networks.nat.IPAddress }}" my-web-site
    172.31.194.61
    ```

3. Connect to the running container.  Open a web browser and browse to "http://172.31.194.61:8000". You should see the title "Hello World!".

4. To stop your container, issue a docker stop command:

    ```
    docker stop my-web-site
    ```

5. Delete the container from your development machine:

    ```
    docker rm my-web-site
    ```

    After packaging and deploying the container in a Service Fabric app, you can delete the image.  

## Push the image to the container registry
After you verify that the container runs on your development machine, push the image to the Azure container registry.

1. Run ``docker login`` to log in to your container registry with your [registry credentials](../container-registry/container-registry-authentication.md).

    The following example passes the ID and password of an Azure Active Directory [service principal](../active-directory/active-directory-application-objects.md). For example, you might have assigned a service principal to your registry for an automation scenario.

    ```
    docker login myregistry.azurecr.io -u xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -p myPassword
    ```

2. The following command creates an alias of the image, with a fully qualified path to your registry. This example specifies the ```samples``` namespace to avoid clutter in the root of the registry.

    ```
    docker tag helloworldapp myregistry.azurecr.io/samples/helloworldapp
    ```

3.  Push the image to your registry:

    ```
    docker push myregistry.azurecr.io/samples/helloworldapp
    ```

## Package the container image in Visual Studio
Visual Studio provides a Service Fabric service template to help you deploy a container to a Service Fabric cluster.

1. Run Visual Studio as administrator.  Select **File** > **New** > **Project**.
2. Select **Service Fabric application**, name it "MyFirstContainer", and click **OK**.
3. Select **Guest Container** from the list of **service templates**.
4. In **Image Name** enter "myregistry.azurecr.io/samples/helloworldapp", the image you pushed to your container repository. 
5. Give your service a name, and click **OK**.
6. If your containerized service needs an endpoint for communication, you can now add the protocol, port, and type to the ServiceManifest.xml file. For example: 

    ```xml
    <Endpoint Name="Guest1TypeEndpoint" UriScheme="http" Port="80" Protocol="http"/>
    ```
    By providing the UriScheme this automatically registers the container endpoint with the Service Fabric Naming service for discoverability. The port can either be fixed (as shown in the preceding example) or dynamically allocated (left blank and a port is allocated from the designated application port range) just as you would with any service. You also need to configure the container port-to-host port mapping by specifying a PortBinding policy in the application manifest as described below.
7. Add PortBinding.  If your container needs to authenticate with a private repository then add ```RepositoryCredentials```.

    ```xml
    <Policies>
        <ContainerHostPolicies CodePackageRef="Code">
            <RepositoryCredentials AccountName="myregistry" Password="=P==/==/=8=/=+u4lyOB=+=nWzEeRfF=" PasswordEncrypted="false"/>
            <PortBinding ContainerPort="8000" EndpointRef="Guest1TypeEndpoint"/>
        </ContainerHostPolicies>
    </Policies>
    ```
8. Open *Cloud.xml* under **PublishProfiles**.  Add the cluster name and connection port to **ClusterConnectionParameters**.  For example:
    ```xml
    <ClusterConnectionParameters ConnectionEndpoint="containercluster.westus2.cloudapp.azure.com:19000" />
    ```
    
9. Save all files and build your project.  

10. To package your app right-click on **MyFirstContainer** in Solution Explorer and select **Package**. 

11. To publish your app right-click on **MyFirstContainer** in Solution Explorer and select **Publish**.

12. Open Service Fabric Explorer and follow the app deployment.  The app will be in error state until the image is downloaded on the cluster nodes:
    ![Error][1]

13. App will be in Ready state when it's ready:
    ![Ready][2]

## Deploy the container app


## Clean up
Delete your cluster
Delete the image from dev machine

## Application and Service Manifests
### ServiceManifest.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<ServiceManifest Name="Guest1Pkg"
                 Version="1.0.0"
                 xmlns="http://schemas.microsoft.com/2011/01/fabric"
                 xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <ServiceTypes>
    <!-- This is the name of your ServiceType.
         The UseImplicitHost attribute indicates this is a guest service. -->
    <StatelessServiceType ServiceTypeName="Guest1Type" UseImplicitHost="true" />
  </ServiceTypes>

  <!-- Code package is your service executable. -->
  <CodePackage Name="Code" Version="1.0.0">
    <EntryPoint>
      <!-- Follow this link for more information about deploying Windows containers to Service Fabric: https://aka.ms/sfguestcontainers -->
      <ContainerHost>
        <ImageName>myregistry.azurecr.io/samples/helloworldapp</ImageName>
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
      <Endpoint Name="Guest1TypeEndpoint" UriScheme="http" Port="80" Protocol="http"/>
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
    <Parameter Name="Guest1_InstanceCount" DefaultValue="-1" />
  </Parameters>
  <!-- Import the ServiceManifest from the ServicePackage. The ServiceManifestName and ServiceManifestVersion 
       should match the Name and Version attributes of the ServiceManifest element defined in the 
       ServiceManifest.xml file. -->
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="Guest1Pkg" ServiceManifestVersion="1.0.0" />
    <ConfigOverrides />
    <Policies>
      <ContainerHostPolicies CodePackageRef="Code">
        <RepositoryCredentials AccountName="myregistry" Password="=P==/==/=8=/=+u4lyOB=+=nWzEeRfF=" PasswordEncrypted="false"/>
        <PortBinding ContainerPort="8000" EndpointRef="Guest1TypeEndpoint"/>
      </ContainerHostPolicies>
    </Policies>
  </ServiceManifestImport>
  <DefaultServices>
    <!-- The section below creates instances of service types, when an instance of this 
         application type is created. You can also create one or more instances of service type using the 
         ServiceFabric PowerShell module.
         
         The attribute ServiceTypeName below must match the name defined in the imported ServiceManifest.xml file. -->
    <Service Name="Guest1">
      <StatelessService ServiceTypeName="Guest1Type" InstanceCount="[Guest1_InstanceCount]">
        <SingletonPartition />
      </StatelessService>
    </Service>
  </DefaultServices>
</ApplicationManifest>
```

## Next steps

[1]: ./media/service-fabric-get-started-containers/MyFirstContainerError.png
[2]: ./media/service-fabric-get-started-containers/MyFirstContainerReady.png