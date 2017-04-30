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

*name* gives a name to the running container instead of the container ID.

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

1. Choose File > New Project, and create a Service Fabric application.
2. Choose Guest Container as the service template.
3. Choose Image Name and provide the path to the image in your container repository such as at https://hub.docker.com/ for example myrepo/myimage:v1 
4. Give your service a name, and click **OK**.
5. If your containerized service needs an endpoint for communication, you can now add the protocol, port, and type to the ServiceManifest.xml file. For example: 
<Endpoint Name="MyContainerServiceEndpoint" Protocol="http" Port="80" UriScheme="http" PathSuffix="myapp/" Type="Input" />
By providing the UriScheme this automatically registers the container endpoint with the Service Fabric Naming service for discoverability. The port can either be fixed (as shown in the preceding example) or dynamically allocated (left blank and a port is allocated from the designated application port range) just as you would with any service. You also need to configure the container port-to-host port mapping by specifying a PortBinding policy in the application manifest as described below.
6. If your container needs resource governance then add a ResourceGovernancePolicy.
7. If your container needs to authenticate with a private repository then add RepositoryCredentials.
8. You can now use the package and publish action against your local cluster if this is Windows Server 2016 with container support activated. 
9.When ready, you can publish the application to a remote cluster or check in the solution to source control. 

## Deploy the container app


## Clean up
Delete your cluster
Delete the container from your development machine:

```
docker rm my-web-site
```

## Next steps

