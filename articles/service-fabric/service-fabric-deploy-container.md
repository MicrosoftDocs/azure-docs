---
title: Service Fabric and deploying containers | Microsoft Docs
description: Service Fabric and the use of containers to deploy microservice applications. This article describes the capabilities that Service Fabric provides for containers and how to deploy a Windows container image into a cluster.
services: service-fabric
documentationcenter: .net
author: msfussell
manager: timlt
editor: ''

ms.assetid: 799cc9ad-32fd-486e-a6b6-efff6b13622d
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 5/16/2017
ms.author: msfussell

---
# Deploy a Windows container to Service Fabric
> [!div class="op_single_selector"]
> * [Deploy Windows Container](service-fabric-deploy-container.md)
> * [Deploy Docker Container](service-fabric-deploy-container-linux.md)
> 
> 

This article walks you through the process of building containerized services in Windows containers.

Service Fabric has several container capabilities that help you with building applications that are composed of microservices that are containerized. 

The capabilities include:

* Container image deployment and activation
* Resource governance
* Repository authentication
* Container port-to-host port mapping
* Container-to-container discovery and communication
* Ability to configure and set environment variables

Let's look at how each of capabilities works when you're packaging a containerized service to be included in your application.

## Package a Windows container
When you package a container, you can choose to use either a Visual Studio project template or [create the application package manually](#manually).  When you use Visual Studio, the application package structure and manifest files are created by the New Project template for you.

> [!TIP]
> The easiest way to package an existing container image into a service is to use Visual Studio.

## Use Visual Studio to package an existing container image
Visual Studio provides a Service Fabric service template to help you deploy a container to a Service Fabric cluster.

1. Choose **File** > **New Project**, and create a Service Fabric application.
2. Choose **Guest Container** as the service template.
3. Choose **Image Name** and provide the path to the image in your container repository such as at https://hub.docker.com/ for example myrepo/myimage:v1 
4. Give your service a name, and click **OK**.
5. If your containerized service needs an endpoint for communication, you can now add the protocol, port, and type to the ServiceManifest.xml file. For example: 
     
    `<Endpoint Name="MyContainerServiceEndpoint" Protocol="http" Port="80" UriScheme="http" PathSuffix="myapp/" Type="Input" />`
    
    By providing the `UriScheme` this automatically registers the container endpoint with the Service Fabric Naming service for discoverability. The port can either be fixed (as shown in the preceding example) or dynamically allocated (left blank and a port is allocated from the designated application port range) just as you would with any service.
    You also need to configure the container port-to-host port mapping by specifying a `PortBinding` policy in the application manifest as described below.
6. If your container needs resource governance then add a `ResourceGovernancePolicy`.
8. If your container needs to authenticate with a private repository then add `RepositoryCredentials`.
7. You can now use the package and publish action against your local cluster if this is Windows Server 2016 with container support activated. 
8. When ready, you can publish the application to a remote cluster or check in the solution to source control. 

For an example application [checkout the Service Fabric container code samples on GitHub](https://github.com/Azure-Samples/service-fabric-dotnet-containers)

## Creating a Windows Server 2016 cluster
To deploy your containerized application, you need to create a cluster running Windows Server 2016 with container support enabled. 
This can either be on your local development machine or deployed via Azure Resource Manager (ARM) in Azure. 

To deploy a cluster using ARM, choose the **Windows Server 2016 with Containers** image option in Azure. 
See the article [Create a Service Fabric cluster by using Azure Resource Manager](service-fabric-cluster-creation-via-arm.md). Ensure that you use the following ARM settings:

```xml
"vmImageOffer": { "type": "string","defaultValue": "WindowsServer"     },
"vmImageSku": { "defaultValue": "2016-Datacenter-with-Containers","type": "string"     },
"vmImageVersion": { "defaultValue": "latest","type": "string"     },  
```
You can also use the [5 Node ARM template here](https://github.com/Azure/azure-quickstart-templates/tree/master/service-fabric-secure-cluster-5-node-1-nodetype)
to create a cluster. Alternatively read [Leok's blog post here](https://loekd.blogspot.com/2017/01/running-windows-containers-on-azure.html) on using Service Fabric and Windows containers.

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
By using the `PortBinding` policy, you can map a container port to an `Endpoint` in the service manifest as shown in the following example. The endpoint `Endpoint1` can specify a fixed port (for example, port 80). It can also specify no port at all, in which case a random port from the cluster's application port range is chosen for you.

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
* For an example application [checkout the Service Fabric container code samples on GitHub](https://github.com/Azure-Samples/service-fabric-dotnet-containers)
