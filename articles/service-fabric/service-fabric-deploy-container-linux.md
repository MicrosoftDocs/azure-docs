---
title: Service Fabric and Deploying Containers in Linux | Microsoft Docs
description: Service Fabric and the use of Linux containers to deploy microservice applications. This article describes the capabilities that Service Fabric provides for containers and how to deploy a Linux container image into a cluster
services: service-fabric
documentationcenter: .net
author: msfussell
manager: timlt
editor: ''

ms.assetid: 4ba99103-6064-429d-ba17-82861b6ddb11
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 6/29/2017
ms.author: msfussell

---
# Deploy a Linux container to Service Fabric
> [!div class="op_single_selector"]
> * [Deploy Windows Container](service-fabric-deploy-container.md)
> * [Deploy Linux Container](service-fabric-deploy-container-linux.md)
>
>

This article walks you through building containerized services in Docker containers on Linux.

Service Fabric has several container capabilities that help you with building applications that are composed of microservices that are containerized. These services are called containerized services.

The capabilities include;

* Container image deployment and activation
* Resource governance
* Repository authentication
* Container port to host port mapping
* Container-to-container discovery and communication
* Ability to configure and set environment variables

## Packaging a docker container with yeoman
When packaging a container on Linux, you can choose either to use a yeoman template or [create the application package manually](#manually).

A Service Fabric application can contain one or more containers, each with a specific role in delivering the application's functionality. The Service Fabric SDK for Linux includes a [Yeoman](http://yeoman.io/) generator that makes it easy to create your application and add a container image. Let's use Yeoman to create an application with a single Docker container called *SimpleContainerApp*. You can add more services later by editing the generated manifest files.

## Install Docker on your development box

Run the following commands to install docker on your Linux development box (if you are using the vagrant image on OSX, docker is already installed):

```bash
    sudo apt-get install wget
    wget -qO- https://get.docker.io/ | sh
```

## Create the application
1. In a terminal, type `yo azuresfcontainer`.
2. Name your application - for example, mycontainerap
3. Provide the URL for the container image from a DockerHub repo. The image parameter takes the form [repo]/[image name]
4. If the image does not have a workload entry-point defined, then you need to explicitly specify input commands with a comma-delimited set of commands to run inside the container, which will keep the container running after startup.

![Service Fabric Yeoman generator for containers][sf-yeoman]

## Deploy the application

### Using XPlat CLI
Once the application is built, you can deploy it to the local cluster using the Azure CLI.

1. Connect to the local Service Fabric cluster.

    ```bash
    azure servicefabric cluster connect
    ```

2. Use the install script provided in the template to copy the application package to the cluster's image store, register the application type, and create an instance of the application.

    ```bash
    ./install.sh
    ```

3. Open a browser and navigate to Service Fabric Explorer at http://localhost:19080/Explorer (replace localhost with the private IP of the VM if using Vagrant on Mac OS X).
4. Expand the Applications node and note that there is now an entry for your application type and another for the first instance of that type.
5. Use the uninstall script provided in the template to delete the application instance and unregister the application type.

    ```bash
    ./uninstall.sh
    ```

### Using Azure CLI 2.0

See the reference doc on managing an [application life cycle using the Azure CLI 2.0](service-fabric-application-lifecycle-azure-cli-2-0.md).

For an example application, [checkout the Service Fabric container code samples on GitHub](https://github.com/Azure-Samples/service-fabric-dotnet-containers)

## Adding more services to an existing application

To add another container service to an application already created using `yo`, perform the following steps:

1. Change directory to the root of the existing application.  For example, `cd ~/YeomanSamples/MyApplication`, if `MyApplication` is the application created by Yeoman.
2. Run `yo azuresfcontainer:AddService`

<a id="manually"></a>

## Manually package and deploy a container image
The process of manually packaging a containerized service is based on the following steps:

1. Publish the containers to your repository.
2. Create the package directory structure.
3. Edit the service manifest file.
4. Edit the application manifest file.

## Deploy and activate a container image
In the Service Fabric [application model](service-fabric-application-model.md), a container represents an application host in which multiple service replicas are placed. To deploy and activate a container, put the name of the container image into a `ContainerHost` element in the service manifest.

In the service manifest, add a `ContainerHost` for the entry point. Then set the `ImageName` to be the name of the container repository and image. The following partial manifest shows an example of how to deploy the container called `myimage:v1` from a repository called `myrepo`:

```xml
    <CodePackage Name="Code" Version="1.0">
        <EntryPoint>
          <ContainerHost>
            <ImageName>myrepo/myimage:v1</ImageName>
            <Commands></Commands>
          </ContainerHost>
        </EntryPoint>
    </CodePackage>
```

You can provide input commands by specifying the optional `Commands` element with a comma-delimited set of commands to run inside the container.

> [!NOTE]
> If the image does not have a workload entry-point defined, then you need to explicitly specify input commands inside `Commands` element with a comma-delimited set of commands to run inside the container, which will keep the container running after startup.

## Understand resource governance
Resource governance is a capability of the container that restricts the resources that the container can use on the host. The `ResourceGovernancePolicy`, which is specified in the application manifest is used to declare resource limits for a service code package. Resource limits can be set for the following resources:

* Memory
* MemorySwap
* CpuShares (CPU relative weight)
* MemoryReservationInMB  
* BlkioWeight (BlockIO relative weight).

> [!NOTE]
> In a future release, support for specifying specific block IO limits such as IOPs, read/write BPS, and others will be included.
>
>

```xml
    <ServiceManifestImport>
        <ServiceManifestRef ServiceManifestName="FrontendServicePackage" ServiceManifestVersion="1.0"/>
        <Policies>
            <ResourceGovernancePolicy CodePackageRef="FrontendService.Code" CpuShares="500"
            MemoryInMB="1024" MemorySwapInMB="4084" MemoryReservationInMB="1024" />
        </Policies>
    </ServiceManifestImport>
```

## Authenticate a repository
To download a container, you might have to provide sign-in credentials to the container repository. The sign-in credentials, specified in the application manifest, are used to specify the sign-in information, or SSH key, for downloading the container image from the image repository. The following example shows an account called *TestUser* along with the password in clear text (*not* recommended):

```xml
    <ServiceManifestImport>
        <ServiceManifestRef ServiceManifestName="FrontendServicePackage" ServiceManifestVersion="1.0"/>
        <Policies>
            <ContainerHostPolicies CodePackageRef="FrontendService.Code">
                <RepositoryCredentials AccountName="TestUser" Password="12345" PasswordEncrypted="false"/>
            </ContainerHostPolicies>
        </Policies>
    </ServiceManifestImport>
```

We recommend that you encrypt the password by using a certificate that's deployed to the machine.

The following example shows an account called *TestUser*, where the password was encrypted by using a certificate called *MyCert*. You can use the `Invoke-ServiceFabricEncryptText` PowerShell command to create the secret cipher text for the password. For more information, see the article [Managing secrets in Service Fabric applications](service-fabric-application-secret-management.md).

The private key of the certificate that's used to decrypt the password must be deployed to the local machine in an out-of-band method. (In Azure, this method is Azure Resource Manager.) Then, when Service Fabric deploys the service package to the machine, it can decrypt the secret. By using the secret along with the account name, it can then authenticate with the container repository.

```xml
    <ServiceManifestImport>
        <ServiceManifestRef ServiceManifestName="FrontendServicePackage" ServiceManifestVersion="1.0"/>
        <Policies>
            <ContainerHostPolicies CodePackageRef="FrontendService.Code">
                <RepositoryCredentials AccountName="TestUser" Password="[Put encrypted password here using MyCert certificate ]" PasswordEncrypted="true"/>
            </ContainerHostPolicies>
        </Policies>
    </ServiceManifestImport>
```

## Configure container port-to-host port mapping
You can configure a host port used to communicate with the container by specifying a `PortBinding` in the application manifest. The port binding maps the port to which the service is listening inside the container to a port on the host.

```xml
    <ServiceManifestImport>
        <ServiceManifestRef ServiceManifestName="FrontendServicePackage" ServiceManifestVersion="1.0"/>
        <Policies>
            <ContainerHostPolicies CodePackageRef="FrontendService.Code">
                <PortBinding ContainerPort="8905"/>
            </ContainerHostPolicies>
        </Policies>
    </ServiceManifestImport>
```

## Configure container-to-container discovery and communication
By using the `PortBinding` policy, you can map a container port to an `Endpoint` in the service manifest. The endpoint `Endpoint1` can specify a fixed port (for example, port 80). It can also specify no port at all, in which case a random port from the cluster's application port range is chosen for you.

If you specify an endpoint, using the `Endpoint` tag in the service manifest of a guest container, Service Fabric can automatically publish this endpoint to the Naming service. Other services that are running in the cluster can thus discover this container using the REST queries for resolving.

```xml
    <ServiceManifestImport>
        <ServiceManifestRef ServiceManifestName="FrontendServicePackage" ServiceManifestVersion="1.0"/>
        <Policies>
            <ContainerHostPolicies CodePackageRef="FrontendService.Code">
                <PortBinding ContainerPort="8905" EndpointRef="Endpoint1"/>
            </ContainerHostPolicies>
        </Policies>
    </ServiceManifestImport>
```

By registering with the Naming service, you can easily do container-to-container communication in the code within your container by using the [reverse proxy](service-fabric-reverseproxy.md). Communication is performed by providing the reverse proxy http listening port and the name of the services that you want to communicate with as environment variables. For more information, see the next section.

## Configure and set environment variables
Environment variables can be specified for each code package in the service manifest, both for services that are deployed in containers or for services that are deployed as processes/guest executables. These environment variable values can be overridden specifically in the application manifest or specified during deployment as application parameters.

The following service manifest XML snippet shows an example of how to specify environment variables for a code package:

```xml
    <ServiceManifest Name="FrontendServicePackage" Version="1.0" xmlns="http://schemas.microsoft.com/2011/01/fabric" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <Description>a guest executable service in a container</Description>
        <ServiceTypes>
            <StatelessServiceType ServiceTypeName="StatelessFrontendService"  UseImplicitHost="true"/>
        </ServiceTypes>
        <CodePackage Name="FrontendService.Code" Version="1.0">
            <EntryPoint>
            <ContainerHost>
                <ImageName>myrepo/myimage:v1</ImageName>
                <Commands></Commands>
            </ContainerHost>
            </EntryPoint>
            <EnvironmentVariables>
                <EnvironmentVariable Name="HttpGatewayPort" Value=""/>
                <EnvironmentVariable Name="BackendServiceName" Value=""/>
            </EnvironmentVariables>
        </CodePackage>
    </ServiceManifest>
```

These environment variables can be overridden at the application manifest level:

```xml
    <ServiceManifestImport>
        <ServiceManifestRef ServiceManifestName="FrontendServicePackage" ServiceManifestVersion="1.0"/>
        <EnvironmentOverrides CodePackageRef="FrontendService.Code">
            <EnvironmentVariable Name="BackendServiceName" Value="[BackendSvc]"/>
            <EnvironmentVariable Name="HttpGatewayPort" Value="19080"/>
        </EnvironmentOverrides>
    </ServiceManifestImport>
```

In the previous example, we specified an explicit value for the `HttpGateway` environment variable (19000), while we set the value for `BackendServiceName` parameter via the `[BackendSvc]` application parameter. These settings enable you to specify the value for `BackendServiceName`value when you deploy the application and not have a fixed value in the manifest.

## Complete examples for application and service manifest

An example application manifest follows:

```xml
    <ApplicationManifest ApplicationTypeName="SimpleContainerApp" ApplicationTypeVersion="1.0" xmlns="http://schemas.microsoft.com/2011/01/fabric" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <Description>A simple service container application</Description>
        <Parameters>
            <Parameter Name="ServiceInstanceCount" DefaultValue="3"></Parameter>
            <Parameter Name="BackEndSvcName" DefaultValue="bkend"></Parameter>
        </Parameters>
        <ServiceManifestImport>
            <ServiceManifestRef ServiceManifestName="FrontendServicePackage" ServiceManifestVersion="1.0"/>
            <EnvironmentOverrides CodePackageRef="FrontendService.Code">
                <EnvironmentVariable Name="BackendServiceName" Value="[BackendSvcName]"/>
                <EnvironmentVariable Name="HttpGatewayPort" Value="19080"/>
            </EnvironmentOverrides>
            <Policies>
                <ResourceGovernancePolicy CodePackageRef="Code" CpuShares="500" MemoryInMB="1024" MemorySwapInMB="4084" MemoryReservationInMB="1024" />
                <ContainerHostPolicies CodePackageRef="FrontendService.Code">
                    <RepositoryCredentials AccountName="username" Password="****" PasswordEncrypted="true"/>
                    <PortBinding ContainerPort="8905" EndpointRef="Endpoint1"/>
                </ContainerHostPolicies>
            </Policies>
        </ServiceManifestImport>
    </ApplicationManifest>
```

An example service manifest (specified in the preceding application manifest) follows:

```xml
    <ServiceManifest Name="FrontendServicePackage" Version="1.0" xmlns="http://schemas.microsoft.com/2011/01/fabric" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <Description> A service that implements a stateless front end in a container</Description>
        <ServiceTypes>
            <StatelessServiceType ServiceTypeName="StatelessFrontendService"  UseImplicitHost="true"/>
        </ServiceTypes>
        <CodePackage Name="FrontendService.Code" Version="1.0">
            <EntryPoint>
            <ContainerHost>
                <ImageName>myrepo/myimage:v1</ImageName>
                <Commands></Commands>
            </ContainerHost>
            </EntryPoint>
            <EnvironmentVariables>
                <EnvironmentVariable Name="HttpGatewayPort" Value=""/>
                <EnvironmentVariable Name="BackendServiceName" Value=""/>
            </EnvironmentVariables>
        </CodePackage>
        <ConfigPackage Name="FrontendService.Config" Version="1.0" />
        <DataPackage Name="FrontendService.Data" Version="1.0" />
        <Resources>
            <Endpoints>
                <Endpoint Name="Endpoint1" UriScheme="http" Port="80" Protocol="http"/>
            </Endpoints>
        </Resources>
    </ServiceManifest>
```

## Next steps
Now that you have deployed a containerized service, learn how to manage its lifecycle by reading [Service Fabric application lifecycle](service-fabric-application-lifecycle.md).

* [Overview of Service Fabric and containers](service-fabric-containers-overview.md)
* [Interacting with Service Fabric clusters using the Azure CLI](service-fabric-azure-cli.md)

<!-- Images -->
[sf-yeoman]: ./media/service-fabric-deploy-container-linux/sf-container-yeoman1.png

## Related articles

* [Getting started with Service Fabric and Azure CLI 2.0](service-fabric-azure-cli-2-0.md)
* [Getting started with Service Fabric XPlat CLI](service-fabric-azure-cli.md)
