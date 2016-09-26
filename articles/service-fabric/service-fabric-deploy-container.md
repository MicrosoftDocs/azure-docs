<properties
   pageTitle="Service Fabric and Deploying Containers | Microsoft Azure"
   description="Service Fabric and the use of containers to deploy microservice applications. This article the capabilities that Service Fabric provides for containers and how to deploy a container image into a cluster"
   services="service-fabric"
   documentationCenter=".net"
   authors="msfussell"
   manager=""
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="09/25/2016"
   ms.author="msfussell"/>

# Preview: Deploy a container to Service Fabric

>[AZURE.NOTE] This feature is in preview for Linux and not currently available on Windows Server. This will be in preview for Windows Server on the next release of Service Fabric after Windows Server 2016 GA and supported in the subsequent release after that.

Service Fabric has several container capabilities that help you with building applications that are composed of microservices that are containerized. These are called containerized services. The capabilities include;

- Container image deployment and activation
- Resource governance
- Repository authentication
- Container port to host port mapping
- Container-to-container discovery and communication
- Ability to configure and set environment variables

Lets look at each of capabilities in turn when packaging a containerized service to be included into your application.

## Packaging a container

When packaging a container, you can choose either to use a Visual Studio project template or [create the application package manually](#manually). Using Visual Studio, the application package structure and manifest files are created by the new project wizard for you.

## Using Visual Studio to package an existing executable

>[AZURE.NOTE] In a future release of the Visual Studio tooling SDK, you will be able to add a container to an application in a similar way that you can add a guest executable today. See [Deploy a guest executable to Service Fabric](service-fabric-deploy-existing-app.md) topic. Currently you have to do manual packaging as described below.

<a id="manually"></a>
## Manually packaging and deploying container
The process of manually packaging a containerized service is based on the following steps:

1. Published the containers to your repository.
2. Create the package directory structure.
3. Edit the service manifest file.
4. Edit the application manifest file.

## Container image deployment and activation.
In the Service Fabric [application model](service-fabric-application-model.md), a container represents an application host in which multiple service replicas are placed. To deploy and activate a container, put the name of the container image into a `ContainerHost` element in the service manifest.

In the service manifest add a `ContainerHost` for the entry point and set the `ImageName` to be the name of the container repository and image. The following partial manifest shows an example of deploying the container called *myimage:v1* from a repository called *myrepo*

    <CodePackage Name="Code" Version="1.0">
        <EntryPoint>
          <ContainerHost>
            <ImageName>myrepo/myimagename:v1</ImageName>
            <Commands></Commands>
          </ContainerHost>
        </EntryPoint>
    </CodePackage>

You can provide input commands to the container image by specifying the optional `Commands` element with a comma delimited set of commands to run inside the container. 

## Resource governance
Resource governance is a capability of the container and restricts the resources that the container can use on the host. The `ResourceGovernancePolicy`, specified in the application manifest, provides the ability to declare resource limits for a service code package. Resource limits can be set for;

- Memory
- MemorySwap
- CpuShares (CPU relative weight)
- MemoryReservationInMB  
- BlkioWeight (BlockIO relative weight). 

>[AZURE.NOTE] In a future release, support for specifying specific block IO limits such as IOPs, read/write BPS and others will be possible.


    <ServiceManifestImport>
        <ServiceManifestRef ServiceManifestName="FrontendServicePackage" ServiceManifestVersion="1.0"/>
        <Policies>
            <ResourceGovernancePolicy CodePackageRef="FrontendService.Code" CpuShares="500" 
            MemoryInMB="1024" MemorySwapInMB="4084" MemoryReservationInMB="1024" />
        </Policies>
    </ServiceManifestImport>


## Repository authentication
To download a container you may have to provide login credentials to the container repository. The login credentials, specified in the *application* manifest are used to specify the login information, or SSH key, for downloading the container image from the image repository.  The following example shows an account called *TestUser* along with the password in clear text. This is **not** recommended.


    <ServiceManifestImport>
        <ServiceManifestRef ServiceManifestName="FrontendServicePackage" ServiceManifestVersion="1.0"/>
        <Policies>
            <ContainerHostPolicies CodePackageRef="FrontendService.Code">
                <RepositoryCredentials AccountName="TestUser" Password="12345" PasswordEncrypted="false"/>
            </ContainerHostPolicies>
        </Policies>
    </ServiceManifestImport>

The password can and should be encrypted using a certificate deployed to the machine.

The following example shows an account called *TestUser* with the password encrypted using a certificate called *MyCert*. You can use the `Invoke-ServiceFabricEncryptText` Powershell command to create the secret cipher text for the password. See this article [Managing secrets in Service Fabric applications](service-fabric-application-secret-management.md) for details on how. The private key of the certificate to decrypt the password must be deployed to the local machine in an out-of-band method (in Azure this is via the Resource Manager). Then, when Service Fabric deploys the service package to the machine, it is able to decrypt the secret and along with the account name, authenticate with the container repository using these credentials.


    <ServiceManifestImport>
        <ServiceManifestRef ServiceManifestName="FrontendServicePackage" ServiceManifestVersion="1.0"/>
        <Policies>
            <ContainerHostPolicies CodePackageRef="FrontendService.Code">
                <RepositoryCredentials AccountName="TestUser" Password="[Put encrypted password here using MyCert certificate ]" PasswordEncrypted="true"/>
            </ContainerHostPolicies>
            <SecurityAccessPolicies>
                <SecurityAccessPolicy ResourceRef="MyCert" PrincipalRef="TestUser" GrantRights="Full" ResourceType="Certificate" />
            </SecurityAccessPolicies>
        </Policies>
    </ServiceManifestImport>

## Container port to host port mapping
You can configure a host port used to communicate with the container by specifying a `PortBinding` in application manifest. The port binding maps the port that the service is listening on inside the container to a port on the host.


    <ServiceManifestImport>
        <ServiceManifestRef ServiceManifestName="FrontendServicePackage" ServiceManifestVersion="1.0"/>
        <Policies>
            <ContainerHostPolicies CodePackageRef="FrontendService.Code">
                <PortBinding ContainerPort="8905"/>
            </ContainerHostPolicies>
        </Policies>
    </ServiceManifestImport>


## Container-to-container discovery and communication
Using the `PortBinding` policy you can map a container port to an `Endpoint` in the service manifest as shown in the following example. The endpoint `Endpoint1` can specify a fixed port, for example port 80 or specify no port at all, in which case a random port from the clusters' application port range is chosen for you.

For guest containers, specifying an `Endpoint` like this in the service manifest enables Service Fabric to automatically publish this endpoint to the Naming service so that other services running in the cluster can discover this container using the resolve service REST queries. 

    <ServiceManifestImport>
        <ServiceManifestRef ServiceManifestName="FrontendServicePackage" ServiceManifestVersion="1.0"/>
        <Policies>
            <ContainerHostPolicies CodePackageRef="FrontendService.Code">
                <PortBinding ContainerPort="8905" EndpointRef="Endpoint1"/>
            </ContainerHostPolicies>
        </Policies>
    </ServiceManifestImport>

By registering with the Naming service, you can easily do container-to-container communication in the code within your container using the [reverse proxy](service-fabric-reverseproxy.md). All you need to do is provide the reverse proxy http listening port and the name of the services that you want to communicate with by setting these as environment variables. See the next section on how to do this.  

## Configure and set environment variables
Environment variables can be specified foe each code package in the service manifest for both services deployed in containers or as processes/guest executables. These environment variable values can be overridden specifically in the application manifest or specified during deployment as application parameters.

The following service manifest XML snippet shows an example of how to specify environment variables for a code package. 

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

These environment variables can be overridden at the application manifest level:

    <ServiceManifestImport>
        <ServiceManifestRef ServiceManifestName="FrontendServicePackage" ServiceManifestVersion="1.0"/>
        <EnvironmentOverrides CodePackageRef="FrontendService.Code">
            <EnvironmentVariable Name="BackendServiceName" Value="[BackendSvc]"/>
            <EnvironmentVariable Name="HttpGatewayPort" Value="19080"/>
        </EnvironmentOverrides>
    </ServiceManifestImport>

In the above example, we have specified an explicit value for the `HttpGateway` environment variable (19000) while the value for `BackendServiceName` parameter is set via the `[BackendSvc]` application parameter. This enables you to specify the value for `BackendServiceName`value at the time of deploying the application and not have a fixed value in the manifest. 

## Complete examples for application and service manifest
The following is an example application manifest that shows the container features.


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


The following is an example service manifest (specified in the preceding application manifest) that shows the container features

    <ServiceManifest Name="FrontendServicePackage" Version="1.0" xmlns="http://schemas.microsoft.com/2011/01/fabric" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <Description> A service that implements a stateless frontend in a container</Description>
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
            <Eendpoints>
                <Endpoint Name="Endpoint1" Port="80"  UriScheme="http" />
            </Eendpoints>
        </Resources>
    </ServiceManifest>
