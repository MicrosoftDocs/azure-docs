---
title: Specifying Service Fabric service endpoints 
description: How to describe endpoint resources in a service manifest, including how to set up HTTPS endpoints
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---

# Specify resources in a service manifest
## Overview
Service Fabric applications and services are defined and versioned using manifest files. For a higher-level overview of ServiceManifest.xml and ApplicationManifest.xml, see [Service Fabric application and service manifests](service-fabric-application-and-service-manifests.md).

The service manifest allows resources that are used by the service to be declared, or changed, without changing the compiled code. Service Fabric supports configuration of endpoint resources for the service. The access to the resources that are specified in the service manifest can be controlled via the SecurityGroup in the application manifest. The declaration of resources allows these resources to be changed at deployment time, meaning the service doesn't need to introduce a new configuration mechanism. The schema definition for the ServiceManifest.xml file is installed with the Service Fabric SDK and tools to *C:\Program Files\Microsoft SDKs\Service Fabric\schemas\ServiceFabricServiceModel.xsd*, and is documented in [ServiceFabricServiceModel.xsd schema documentation](service-fabric-service-model-schema.md).

## Endpoints
When an endpoint resource is defined in the service manifest, Service Fabric assigns ports from the reserved application port range when a port isn't specified explicitly. For example, look at the endpoint *ServiceEndpoint1* specified in the manifest snippet provided after this paragraph. Additionally, services can also request a specific port in a resource. Service replicas running on different cluster nodes can be assigned different port numbers, while replicas of a service running on the same node share the port. The service replicas can then use these ports as needed for replication and listening for client requests.

Upon activating a service that specifies an https endpoint, Service Fabric will set the access control entry for the port, bind the specified server certificate to the port, and also grant the identity that the service is running as permissions to the certificate's private key. The activation flow is invoked every time Service Fabric starts, or when the certificate declaration of the application is changed via an upgrade. The endpoint certificate will also be monitored for changes/renewals, and permissions will be periodically reapplied as necessary.

Upon the termination of the service, Service Fabric will clean up the endpoint access control entry, and remove the certificate binding. However, any permissions applied to the certificate's private key will not be cleaned up.

> [!WARNING] 
> By design static ports should not overlap with application port range specified in the ClusterManifest. If you specify a static port, assign it outside of application port range, otherwise it will result in port conflicts. With release 6.5CU2 we will issue a **Health Warning** when we detect such a conflict but let the deployment continue in sync with the shipped 6.5 behaviour. However, we may prevent the application deployment from the next major releases.
>
> With release 7.0 we will issue a **Health Warning** when we detect application port range usage goes beyond HostingConfig::ApplicationPortExhaustThresholdPercentage(default 80%).
>

```xml
<Resources>
  <Endpoints>
    <Endpoint Name="ServiceEndpoint1" Protocol="http"/>
    <Endpoint Name="ServiceEndpoint2" Protocol="http" Port="80"/>
    <Endpoint Name="ServiceEndpoint3" Protocol="https"/>
  </Endpoints>
</Resources>
```

If there are multiple code packages in a single service package, then the code package also needs to be referenced in the **Endpoints** section.  For example, if **ServiceEndpoint2a** and **ServiceEndpoint2b** are endpoints from the same service package referencing different code packages, the code package corresponding to each endpoint is clarified as follows:

```xml
<Resources>
  <Endpoints>
    <Endpoint Name="ServiceEndpoint2a" Protocol="http" Port="802" CodePackageRef="Code1"/>
    <Endpoint Name="ServiceEndpoint2b" Protocol="http" Port="801" CodePackageRef="Code2"/>
  </Endpoints>
</Resources>
```

Refer to [Configuring stateful Reliable Services](service-fabric-reliable-services-configuration.md) to read more about referencing endpoints from the config package settings file (settings.xml).

## Example: specifying an HTTP endpoint for your service
The following service manifest defines one TCP endpoint resource and two HTTP endpoint resources in the &lt;Resources&gt; element.

```xml
<?xml version="1.0" encoding="utf-8"?>
<ServiceManifest Name="Stateful1Pkg"
                 Version="1.0.0"
                 xmlns="http://schemas.microsoft.com/2011/01/fabric"
                 xmlns:xsd="https://www.w3.org/2001/XMLSchema"
                 xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance">
  <ServiceTypes>
    <!-- This is the name of your ServiceType.
         This name must match the string used in the RegisterServiceType call in Program.cs. -->
    <StatefulServiceType ServiceTypeName="Stateful1Type" HasPersistedState="true" />
  </ServiceTypes>

  <!-- Code package is your service executable. -->
  <CodePackage Name="Code" Version="1.0.0">
    <EntryPoint>
      <ExeHost>
        <Program>Stateful1.exe</Program>
      </ExeHost>
    </EntryPoint>
  </CodePackage>

  <!-- Config package is the contents of the Config directory under PackageRoot that contains an
       independently updateable and versioned set of custom configuration settings for your service. -->
  <ConfigPackage Name="Config" Version="1.0.0" />

  <Resources>
    <Endpoints>
      <!-- This endpoint is used by the communication listener to obtain the port number on which to
           listen. Note that if your service is partitioned, this port is shared with
           replicas of different partitions that are placed in your code. -->
      <Endpoint Name="ServiceEndpoint1" Protocol="http"/>
      <Endpoint Name="ServiceEndpoint2" Protocol="http" Port="80"/>
      <Endpoint Name="ServiceEndpoint3" Protocol="https"/>
      <Endpoint Name="ServiceEndpoint4" Protocol="https" Port="14023"/>

      <!-- This endpoint is used by the replicator for replicating the state of your service.
           This endpoint is configured through the ReplicatorSettings config section in the Settings.xml
           file under the ConfigPackage. -->
      <Endpoint Name="ReplicatorEndpoint" />
    </Endpoints>
  </Resources>
</ServiceManifest>
```

## Example: specifying an HTTPS endpoint for your service
The HTTPS protocol provides server authentication and is also used for encrypting client-server communication. To enable HTTPS on your Service Fabric service, specify the protocol in the *Resources -> Endpoints -> Endpoint* section of the service manifest, as shown earlier for the endpoint *ServiceEndpoint3*.

> [!NOTE]
> A service’s protocol cannot be changed during application upgrade. If it is changed during upgrade, it is a breaking change.
> 

> [!WARNING] 
> When using HTTPS, do not use the same port and certificate for different service instances (independent of the application) deployed to the same node. Upgrading two different services using the same port in different application instances will result in an upgrade failure. For more information, see [Upgrading multiple applications with HTTPS endpoints
](service-fabric-application-upgrade.md#upgrading-multiple-applications-with-https-endpoints).
>

Here is an example ApplicationManifest demonstrating the configuration required for an HTTPS endpoint. The server/endpoint certificate may be declared by thumbprint or subject common name, and a value must be provided. The EndpointRef is a reference to EndpointResource in ServiceManifest, and whose protocol must have been set to the 'https' protocol. You can add more than one EndpointCertificate.  

```xml
<?xml version="1.0" encoding="utf-8"?>
<ApplicationManifest ApplicationTypeName="Application1Type"
                     ApplicationTypeVersion="1.0.0"
                     xmlns="http://schemas.microsoft.com/2011/01/fabric"
                     xmlns:xsd="https://www.w3.org/2001/XMLSchema"
                     xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance">
  <Parameters>
    <Parameter Name="Stateful1_MinReplicaSetSize" DefaultValue="3" />
    <Parameter Name="Stateful1_PartitionCount" DefaultValue="1" />
    <Parameter Name="Stateful1_TargetReplicaSetSize" DefaultValue="3" />
  </Parameters>
  <!-- Import the ServiceManifest from the ServicePackage. The ServiceManifestName and ServiceManifestVersion
       should match the Name and Version attributes of the ServiceManifest element defined in the
       ServiceManifest.xml file. -->
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="Stateful1Pkg" ServiceManifestVersion="1.0.0" />
    <ConfigOverrides />
    <Policies>
      <EndpointBindingPolicy CertificateRef="SslCertByTP" EndpointRef="ServiceEndpoint3"/>
      <EndpointBindingPolicy CertificateRef="SslCertByCN" EndpointRef="ServiceEndpoint4"/>
    </Policies>
  </ServiceManifestImport>
  <DefaultServices>
    <!-- The section below creates instances of service types when an instance of this
         application type is created. You can also create one or more instances of service type by using the
         Service Fabric PowerShell module.

         The attribute ServiceTypeName below must match the name defined in the imported ServiceManifest.xml file. -->
    <Service Name="Stateful1">
      <StatefulService ServiceTypeName="Stateful1Type" TargetReplicaSetSize="[Stateful1_TargetReplicaSetSize]" MinReplicaSetSize="[Stateful1_MinReplicaSetSize]">
        <UniformInt64Partition PartitionCount="[Stateful1_PartitionCount]" LowKey="-9223372036854775808" HighKey="9223372036854775807" />
      </StatefulService>
    </Service>
  </DefaultServices>
  <Certificates>
    <EndpointCertificate Name="SslCertByTP" X509FindValue="FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF F0" X509StoreName="MY" />  
    <EndpointCertificate Name="SslCertByCN" X509FindType="FindBySubjectName" X509FindValue="ServiceFabric-EndpointCertificateBinding-Test" X509StoreName="MY" />  
  </Certificates>
</ApplicationManifest>
```

For Linux clusters, the **MY** store defaults to the folder **/var/lib/sfcerts**.

For an example of a full application that makes use of an HTTPS endpoint, see [add an HTTPS endpoint to an ASP.NET Core Web API front-end service using Kestrel](./service-fabric-tutorial-dotnet-app-enable-https-endpoint.md#define-an-https-endpoint-in-the-service-manifest).

## Port ACLing for HTTP Endpoints
Service Fabric will automatically ACL HTTP(S) endpoints specified by default. It will **not** perform automatic ACLing if an endpoint does not have a [SecurityAccessPolicy](service-fabric-assign-policy-to-endpoint.md) associated with it and Service Fabric is configured to run using an account with Administrator privileges.

## Overriding Endpoints in ServiceManifest.xml

In the ApplicationManifest, add a ResourceOverrides section, which will be a sibling to ConfigOverrides section. In this section, you can specify the override for the Endpoints section in the resources section specified in the Service manifest. Overriding endpoints is supported in runtime 5.7.217/SDK 2.7.217 and higher.

In order to override EndPoint in ServiceManifest using ApplicationParameters, change the ApplicationManifest as such:

In the ServiceManifestImport section, add a new section "ResourceOverrides".

```xml
<ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="Stateless1Pkg" ServiceManifestVersion="1.0.0" />
    <ConfigOverrides />
    <ResourceOverrides>
      <Endpoints>
        <Endpoint Name="ServiceEndpoint" Port="[Port]" Protocol="[Protocol]" Type="[Type]" />
        <Endpoint Name="ServiceEndpoint1" Port="[Port1]" Protocol="[Protocol1] "/>
      </Endpoints>
    </ResourceOverrides>
        <Policies>
           <EndpointBindingPolicy CertificateRef="SslCertByTP" EndpointRef="ServiceEndpoint"/>
        </Policies>
  </ServiceManifestImport>
```

In the Parameters add below:

```xml
  <Parameters>
    <Parameter Name="Port" DefaultValue="" />
    <Parameter Name="Protocol" DefaultValue="" />
    <Parameter Name="Type" DefaultValue="" />
    <Parameter Name="Port1" DefaultValue="" />
    <Parameter Name="Protocol1" DefaultValue="" />
  </Parameters>
```

While deploying the application, you can pass in these values as ApplicationParameters.  For example:

```powershell
PS C:\> New-ServiceFabricApplication -ApplicationName fabric:/myapp -ApplicationTypeName "AppType" -ApplicationTypeVersion "1.0.0" -ApplicationParameter @{Port='1001'; Protocol='https'; Type='Input'; Port1='2001'; Protocol='http'}
```

Note: If the value provided for a given ApplicationParameter is empty, we go back to the default value provided in the ServiceManifest for the corresponding EndPointName.

For example:

If in the ServiceManifest you specified

```xml
  <Resources>
    <Endpoints>
      <Endpoint Name="ServiceEndpoint1" Protocol="tcp"/>
    </Endpoints>
  </Resources>
```

Assume the Port1 and Protocol1 value for Application parameters is null or empty. The port will be decided by ServiceFabric and the Protocol will be tcp.

Suppose you specify a wrong value. Say for Port you specified a string value "Foo" instead of an int.  New-ServiceFabricApplication command will fail with an error:
`The override parameter with name 'ServiceEndpoint1' attribute 'Port1' in section 'ResourceOverrides' is invalid. The value specified is 'Foo' and required is 'int'.`

## Next Steps

This article explained how to define endpoints in Service Fabric's service manifest. For more detailed examples, see:

> [!div class="nextstepaction"]
> [Application and service manifest examples](service-fabric-manifest-examples.md)

For a walk-through of packaging and deploying an existing application on a Service Fabric cluster, see:

> [!div class="nextstepaction"]
> [Package and deploy an existing executable to Service Fabric](service-fabric-deploy-existing-app.md)
