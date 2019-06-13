---
title: Describing Azure Service Fabric apps and services | Microsoft Docs
description: Describes how manifests are used to describe Service Fabric applications and services.
services: service-fabric
documentationcenter: .net
author: athinanthny
manager: chackdan
editor: mani-ramaswamy

ms.assetid: 17a99380-5ed8-4ed9-b884-e9b827431b02
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 12/19/2018
ms.author: atsenthi

---
# Service Fabric application and service manifests
This article describes how Service Fabric applications and services are defined and versioned using the ApplicationManifest.xml and ServiceManifest.xml files.  For more detailed examples, see [application and service manifest examples](service-fabric-manifest-examples.md).  The XML schema for these manifest files is documented in [ServiceFabricServiceModel.xsd schema documentation](service-fabric-service-model-schema.md).

> [!WARNING]
> The manifest XML file schema enforces correct ordering of child elements.  As a partial workaround, open "C:\Program Files\Microsoft SDKs\Service Fabric\schemas\ServiceFabricServiceModel.xsd" in Visual Studio while authoring or modifying any of the Service Fabric manifests. This will allow you to check the ordering of child elements and provides intelli-sense.

## Describe a service in ServiceManifest.xml
The service manifest declaratively defines the service type and version. It specifies service metadata such as service type, health properties, load-balancing metrics, service binaries, and configuration files.  Put another way, it describes the code, configuration, and data packages that compose a service package to support one or more service types. A service manifest can contain multiple code, configuration, and data packages, which can be versioned independently. Here is a service manifest for the ASP.NET Core web front-end service of the [Voting sample application](https://github.com/Azure-Samples/service-fabric-dotnet-quickstart) (and here are some [more detailed examples](service-fabric-manifest-examples.md)):

```xml
<?xml version="1.0" encoding="utf-8"?>
<ServiceManifest Name="VotingWebPkg"
                 Version="1.0.0"
                 xmlns="http://schemas.microsoft.com/2011/01/fabric"
                 xmlns:xsd="https://www.w3.org/2001/XMLSchema"
                 xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance">
  <ServiceTypes>
    <!-- This is the name of your ServiceType. 
         This name must match the string used in RegisterServiceType call in Program.cs. -->
    <StatelessServiceType ServiceTypeName="VotingWebType" />
  </ServiceTypes>

  <!-- Code package is your service executable. -->
  <CodePackage Name="Code" Version="1.0.0">
    <EntryPoint>
      <ExeHost>
        <Program>VotingWeb.exe</Program>
        <WorkingFolder>CodePackage</WorkingFolder>
      </ExeHost>
    </EntryPoint>
  </CodePackage>

  <!-- Config package is the contents of the Config directory under PackageRoot that contains an 
       independently-updateable and versioned set of custom configuration settings for your service. -->
  <ConfigPackage Name="Config" Version="1.0.0" />

  <Resources>
    <Endpoints>
      <!-- This endpoint is used by the communication listener to obtain the port on which to 
           listen. Please note that if your service is partitioned, this port is shared with 
           replicas of different partitions that are placed in your code. -->
      <Endpoint Protocol="http" Name="ServiceEndpoint" Type="Input" Port="8080" />
    </Endpoints>
  </Resources>
</ServiceManifest>
```

**Version** attributes are unstructured strings and not parsed by the system. Version attributes are used to version each component for upgrades.

**ServiceTypes** declares what service types are supported by **CodePackages** in this manifest. When a service is instantiated against one of these service types, all code packages declared in this manifest are activated by running their entry points. The resulting processes are expected to register the supported service types at run time. Service types are declared at the manifest level and not the code package level. So when there are multiple code packages, they are all activated whenever the system looks for any one of the declared service types.

The executable specified by **EntryPoint** is typically the long-running service host. **SetupEntryPoint** is a privileged entry point that runs with the same credentials as Service Fabric (typically the *LocalSystem* account) before any other entry point.  The presence of a separate setup entry point avoids having to run the service host with high privileges for extended periods of time. The executable specified by **EntryPoint** is run after **SetupEntryPoint** exits successfully. If the process ever terminates or crashes, the resulting process is monitored and restarted (beginning again with **SetupEntryPoint**).  

Typical scenarios for using **SetupEntryPoint** are when you run an executable before the service starts or you perform an operation with elevated privileges. For example:

* Setting up and initializing environment variables that the service executable needs. This is not limited to only executables written via the Service Fabric programming models. For example, npm.exe needs some environment variables configured for deploying a node.js application.
* Setting up access control by installing security certificates.

For more information on how to configure the SetupEntryPoint, see [Configure the policy for a service setup entry point](service-fabric-application-runas-security.md)

**EnvironmentVariables** (not set in the preceding example) provides a list of environment variables that are set for this code package. Environment variables can be overridden in the `ApplicationManifest.xml` to provide different values for different service instances. 

**DataPackage** (not set in the preceding example) declares a folder, named by the **Name** attribute, that contains arbitrary static data to be consumed by the process at run time.

**ConfigPackage** declares a folder, named by the **Name** attribute, that contains a *Settings.xml* file. The settings file contains sections of user-defined, key-value pair settings that the process reads back at run time. During an upgrade, if only the **ConfigPackage** **version** has changed, then the running process is not restarted. Instead, a callback notifies the process that configuration settings have changed so they can be reloaded dynamically. Here is an example *Settings.xml* file:

```xml
<Settings xmlns:xsd="https://www.w3.org/2001/XMLSchema" xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/2011/01/fabric">
  <Section Name="MyConfigurationSection">
    <Parameter Name="MySettingA" Value="Example1" />
    <Parameter Name="MySettingB" Value="Example2" />
  </Section>
</Settings>
```

A Service Fabric Service **Endpoint** is an example of a Service Fabric Resource. A Service Fabric Resource can be declared/changed without changing the compiled code. Access to the Service Fabric Resources that are specified in the service manifest can be controlled through the **SecurityGroup** in the application manifest. When an Endpoint Resource is defined in the service manifest, Service Fabric assigns ports from the reserved application port range when a port isn't specified explicitly. Read more about [specifying or overriding endpoint resources](service-fabric-service-manifest-resources.md).


<!--
For more information about other features supported by service manifests, refer to the following articles:

*TODO: LoadMetrics, PlacementConstraints, ServicePlacementPolicies
*TODO: Health properties
*TODO: Trace filters
*TODO: Configuration overrides
-->

## Describe an application in ApplicationManifest.xml
The application manifest declaratively describes the application type and version. It specifies service composition metadata such as stable names, partitioning scheme, instance count/replication factor, security/isolation policy, placement constraints, configuration overrides, and constituent service types. The load-balancing domains into which the application is placed are also described.

Thus, an application manifest describes elements at the application level and references one or more service manifests to compose an application type. Here is the application manifest for the [Voting sample application](https://github.com/Azure-Samples/service-fabric-dotnet-quickstart) (and here are some [more detailed examples](service-fabric-manifest-examples.md)):

```xml
<?xml version="1.0" encoding="utf-8"?>
<ApplicationManifest xmlns:xsd="https://www.w3.org/2001/XMLSchema" xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance" ApplicationTypeName="VotingType" ApplicationTypeVersion="1.0.0" xmlns="http://schemas.microsoft.com/2011/01/fabric">
  <Parameters>
    <Parameter Name="VotingData_MinReplicaSetSize" DefaultValue="3" />
    <Parameter Name="VotingData_PartitionCount" DefaultValue="1" />
    <Parameter Name="VotingData_TargetReplicaSetSize" DefaultValue="3" />
    <Parameter Name="VotingWeb_InstanceCount" DefaultValue="-1" />
  </Parameters>
  <!-- Import the ServiceManifest from the ServicePackage. The ServiceManifestName and ServiceManifestVersion 
       should match the Name and Version attributes of the ServiceManifest element defined in the 
       ServiceManifest.xml file. -->
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="VotingDataPkg" ServiceManifestVersion="1.0.0" />
    <ConfigOverrides />
  </ServiceManifestImport>
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="VotingWebPkg" ServiceManifestVersion="1.0.0" />
    <ConfigOverrides />
  </ServiceManifestImport>
  <DefaultServices>
    <!-- The section below creates instances of service types, when an instance of this 
         application type is created. You can also create one or more instances of service type using the 
         ServiceFabric PowerShell module.
         
         The attribute ServiceTypeName below must match the name defined in the imported ServiceManifest.xml file. -->
    <Service Name="VotingData">
      <StatefulService ServiceTypeName="VotingDataType" TargetReplicaSetSize="[VotingData_TargetReplicaSetSize]" MinReplicaSetSize="[VotingData_MinReplicaSetSize]">
        <UniformInt64Partition PartitionCount="[VotingData_PartitionCount]" LowKey="0" HighKey="25" />
      </StatefulService>
    </Service>
    <Service Name="VotingWeb" ServicePackageActivationMode="ExclusiveProcess">
      <StatelessService ServiceTypeName="VotingWebType" InstanceCount="[VotingWeb_InstanceCount]">
        <SingletonPartition />
      </StatelessService>
    </Service>
  </DefaultServices>
</ApplicationManifest>
```

Like service manifests, **Version** attributes are unstructured strings and are not parsed by the system. Version attributes are also used to version each component for upgrades.

**Parameters** defines the parameters used throughout the application manifest. The values of these parameters can be supplied when the application is instantiated and can override application or service configuration settings.  The default parameter value is used if the value is not changed during application instantiation. To learn how to maintain different application and service parameters for individual environments, see [Managing application parameters for multiple environments](service-fabric-manage-multiple-environment-app-configuration.md).

**ServiceManifestImport** contains references to service manifests that compose this application type. An application manifest can contain multiple service manifest imports, each one can be versioned independently. Imported service manifests determine what service types are valid within this application type. 
Within the ServiceManifestImport, you override configuration values in Settings.xml and environment variables in ServiceManifest.xml files. **Policies** (not set in the preceding example) for end-point binding, security and access, and package sharing can be set on imported service manifests.  For more information, see [Configure security policies for your application](service-fabric-application-runas-security.md).

**DefaultServices** declares service instances that are automatically created whenever an application is instantiated against this application type. Default services are just a convenience and behave like normal services in every respect after they have been created. They are upgraded along with any other services in the application instance and can be removed as well. An application manifest can contain multiple default services.

**Certificates** (not set in the preceding example) declares the certificates used to [setup HTTPS endpoints](service-fabric-service-manifest-resources.md#example-specifying-an-https-endpoint-for-your-service) or [encrypt secrets in the application manifest](service-fabric-application-secret-management.md).

**Policies** (not set in the preceding example) describes the log collection, [default run-as](service-fabric-application-runas-security.md), [health](service-fabric-health-introduction.md#health-policies), and [security access](service-fabric-application-runas-security.md) policies to set at the application level, including whether the service(s) have access to the Service Fabric runtime.

> [!NOTE] 
> By default, Service Fabric applications have access to the Service Fabric runtime, in the form of an endpoint accepting application-specific requests, and environment variables pointing to file paths on the host containing Fabric and application-specific files. Consider disabling this access when the application hosts untrusted code (i.e. code whose provenance is unknown, or which the application owner knows not to be safe to execute). For more information, please see [security best practices in Service Fabric](service-fabric-best-practices-security.md#platform-isolation). 
>

**Principals** (not set in the preceding example) describe the security principals (users or groups) required to [run services and secure service resources](service-fabric-application-runas-security.md).  Principals are referenced in the **Policies** sections.





<!--
For more information about other features supported by application manifests, refer to the following articles:

*TODO: Security, Principals, RunAs, SecurityAccessPolicy
*TODO: Service Templates
-->



## Next steps
- [Package an application](service-fabric-package-apps.md) and make it ready to deploy.
- [Deploy and remove applications](service-fabric-deploy-remove-applications.md).
- [Configure parameters and environment variables for different application instances](service-fabric-manage-multiple-environment-app-configuration.md).
- [Configure security policies for your application](service-fabric-application-runas-security.md).
- [Setup HTTPS endpoints](service-fabric-service-manifest-resources.md#example-specifying-an-https-endpoint-for-your-service).
- [Encrypt secrets in the application manifest](service-fabric-application-secret-management.md)

<!--Image references-->
[appmodel-diagram]: ./media/service-fabric-application-model/application-model.png
[cluster-imagestore-apptypes]: ./media/service-fabric-application-model/cluster-imagestore-apptypes.png
[cluster-application-instances]: media/service-fabric-application-model/cluster-application-instances.png



