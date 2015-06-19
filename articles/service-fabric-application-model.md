<properties
   pageTitle="Service Fabric application model"
   description="How to model an application in Service Fabric"
   services="service-fabric"
   documentationCenter=".net"
   authors="alexwun"
   manager="timlt"
   editor="mani-ramaswamy"/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="04/23/2015"
   ms.author="alexwun"/>

# Model an application in Service Fabric

This article provides an overview the Service Fabric application model and describes how to define an application and service via manifest files and get the application packaged and ready for deployment.

## Understand the application model

An application is a collection of constituent services that perform a certain function(s). A service performs a complete and standalone function (they can start and run independent of other services) and is composed of code, configuration, and data. For each service, code consists of the executable binaries, configuration consists of service settings that can be loaded at runtime, and data consists of arbitrary static data to be consumed by the service. Each component in this hierarchical application model can be versioned and upgraded independently.

![][1]


An application type is a categorization of an application, consisting of a bundle of service types. A service type is a categorization of a service, which can have different settings and configurations but the core functionality remains the same. The instances of a service are the different service configuration variations of the same service type.  

Classes (or "types") of applications and services are described using XML files (application manifests and service manifests) that are the templates against which applications can be instantiated. The code for different application instances will run as separate processes even when hosted by the same Service Fabric node. Furthermore, the lifecycle of each application instance can be managed (i.e. upgraded) independently. The following diagram shows how application types are composed of service types, which in turn are composed of code, configuration, and packages.

![Service Fabric ApplicationTypes and ServiceTypes][Image1]

Two different manifest files are used to describe applications and services: the service manifest and application manifest, which are covered in detail in the ensuing sections.

There can be one or more instances of a service type active in the cluster. For example, Stateful service instances, or replicas, achieve high reliability by replicating state between replicas located on different nodes in the cluster (essentially providing redundancy for the service to be available even if one node in a cluster fails). A [partitioned service](service-fabric-concepts-partitioning.md) further divides its state (and access patterns to that state) across nodes in the cluster. 

The following diagram shows the relationship between applications and service instances, partitions, and replicas.

![Partitions and Replicas within a Service][Image2]


## Describe a service

The service manifest declaratively defines the service type and version and specifies service metadata such as service type, health properties, load balancing metrics, and the service binaries and configuration files.  Put another way, it describes the code, configuration, and data packages that compose a service package to support one or more service types. Here is a simple example service manifest:

~~~
<?xml version="1.0" encoding="utf-8" ?>
<ServiceManifest Name="MyServiceManifest" Version="SvcManifestVersion1" xmlns="http://schemas.microsoft.com/2011/01/fabric" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Description>An example service manifest</Description>
  <ServiceTypes>
    <StatelessServiceType ServiceTypeName="MyServiceType" />
  </ServiceTypes>
  <CodePackage Name="MyCode" Version="CodeVersion1">
    <SetupEntryPoint>
      <ExeHost>
        <Program>MySetup.bat</Program>
      </ExeHost>
    </SetupEntryPoint>
    <EntryPoint>
      <ExeHost>
        <Program>MyServiceHost.exe</Program>
      </ExeHost>
    </EntryPoint>
  </CodePackage>
  <ConfigPackage Name="MyConfig" Version="ConfigVersion1" />
  <DataPackage Name="MyData" Version="DataVersion1" />
</ServiceManifest>
~~~

**Version** attributes are unstructured strings and not parsed by the system. These are used to version each component for upgrades.

**ServiceTypes** declares what service types are supported by the **CodePackages** in this manifest. When a service is instantiated against one of these service types, all code packages declared in this manifest are activated by running their entry points. The resulting processes are expected to register the supported service types at runtime. Note that service types are declared at the manifest level and not the code package level. So when there are multiple code packages, they are all activated whenever the system looks for any one of the declared service types.

**SetupEntryPoint** is a privileged entry point that runs with the same credentials as Service Fabric (typically the *LocalSystem* account) before any other entry point. The executable specified by **EntryPoint** is typically the long-running service host, so having a separate setup entry point avoids having to run the service host with high privileges for extended periods of time. The executable specified by **EntryPoint** is run after **SetupEntryPoint** exits successfully. The resulting process is monitored and re-started (beginning again with **SetupEntryPoint**) if it ever terminates or crashes.

**DataPackage** declares a folder named by the **Name** attribute that contains arbitrary static data to be consumed by the process at runtime.

**ConfigPackage** declares a folder named by the **Name** attribute that contains a *Settings.xml* file. This file contains sections of user-defined, key-value pair settings that the process can read back at runtime. During upgrade, if only the **ConfigPackage** **version** has changed, then the running process is not restarted. Instead, a callback notifies the process that configuration settings have changed so they can be reloaded dynamically. Here is an example *Settings.xml*  file:

~~~
<Settings xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/2011/01/fabric">
  <Section Name="MyConfigurationSecion">
    <Parameter Name="MySettingA" Value="Foo" />
    <Parameter Name="MySettingB" Value="Bar" />
  </Section>
</Settings>
~~~

> [AZURE.NOTE] A service manifest can contain multiple code, configuration, and data packages, each of which can be versioned independently.

<!--
For more information about other features supported by service manifests, refer to the following articles:

*TODO: LoadMetrics, PlacementConstraints, ServicePlacementPolicies
*TODO: Resources
*TODO: Health properties
*TODO: Trace filters
*TODO: Configuration overrides
-->

## Describe an application


The application manifest declaratively describes the application type and version and specifies service composition metadata such as stable names, partitioning scheme, instance count/replication factor, security/isolation policy, placement constraints, configuration overrides, and constituent service types. The load balancing domains into which the application is placed are also described.
Thus, an application manifest describes elements at the application level and references one or more service manifests to compose an application type. Here is a simple example application manifest:

~~~
<?xml version="1.0" encoding="utf-8" ?>
<ApplicationManifest
      ApplicationTypeName="MyApplicationType"
      ApplicationTypeVersion="AppManifestVersion1"
      xmlns="http://schemas.microsoft.com/2011/01/fabric"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Description>An example application manifest</Description>
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="MyServiceManifest" ServiceManifestVersion="SvcManifestVersion1"/>
  </ServiceManifestImport>
  <DefaultServices>
     <Service Name="MyService">
         <StatelessService ServiceTypeName="MyServiceType" InstanceCount="1">
             <SingletonPartition/>
         </StatelessService>
     </Service>
  </DefaultServices>
</ApplicationManifest>
~~~

Like service manifests, **Version** attributes are unstructured strings and not parsed by the system. These are also used to version each component for upgrades.

**ServiceManifestImport** contains references to service manifests composing this application type. Imported service manifests determine what service types are valid within this application type.

**DefaultServices** declares service instances that are automatically created whenever an application is instantiated against this application type. Default services are just a convenience and behave like normal services in every respect after they have been created. They are upgraded along with any other services in the application instance and can be removed as well.

> [AZURE.NOTE] An application manifest can contain multiple service manifest imports and default services. Each service manifest import can be versioned independently.

<!--
For more information about other features supported by application manifests, refer to the following articles:

*TODO: Application parameters
*TODO: Security, Principals, RunAs, SecurityAccessPolicy
*TODO: Service Templates
-->

## Package an application

### Package layout

The application manifest, service manifest(s), and other necessary package files must be organized in a specific layout for deployment into a Service Fabric cluster. The example manifests in this article would need to be organized in the following directory structure:

~~~
PS D:\temp> tree /f .\MyApplicationType

D:\TEMP\MYAPPLICATIONTYPE
│   ApplicationManifest.xml
│
└───MyServiceManifest
    │   ServiceManifest.xml
    │
    ├───MyCode
    │       MyServiceHost.exe
    │
    ├───MyConfig
    │       Settings.xml
    │
    └───MyData
            init.dat
~~~

The folders are named to match the **Name** attributes of each corresponding element. For example, if the service manifest contained two code packages with names **MyCodeA** and **MyCodeB**, then there would need to be two folders with the same names containing the necessary binaries for each code package.

### Building a package using Visual Studio

If you use Visual Studio 2015 to create your application, you can use the Package command to automatically create a package that matches the layout described above.

To create a package, simply right click on the application project in Solution Explorer and choose the Package command, as shown below:

![][2]

When packaging is complete, you will find the location of the package in the Output window. Note that the packaging step occurs automatically when you deploy or debug your application in Visual Studio.

### Testing the package

The package structure can be locally verified through PowerShell using the **Test-ServiceFabricApplicationPackage** command, which will check for manifest parsing issues and verify all references. Note that this command only verifies the structural correctness of the directories and files in the package - it will not verify any of the code or data package contents beyond checking that all necessary files are present:

~~~
PS D:\temp> Test-ServiceFabricApplicationPackage .\MyApplicationType
False
Test-ServiceFabricApplicationPackage : The EntryPoint MySetup.bat is not found.
FileName: C:\Users\servicefabric\AppData\Local\Temp\TestApplicationPackage_7195781181\nrri205a.e2h\MyApplicationType\MyServiceManifest\ServiceManifest.xml
~~~

This error shows that the *MySetup.bat* file referenced in the service manifest **SetupEntryPoint** is missing from the code package. After adding the missing file, the application verification passes:

~~~
PS D:\temp> tree /f .\MyApplicationType

D:\TEMP\MYAPPLICATIONTYPE
│   ApplicationManifest.xml
│
└───MyServiceManifest
    │   ServiceManifest.xml
    │
    ├───MyCode
    │       MyServiceHost.exe
    │       MySetup.bat
    │
    ├───MyConfig
    │       Settings.xml
    │
    └───MyData
            init.dat

PS D:\temp> Test-ServiceFabricApplicationPackage .\MyApplicationType
True
PS D:\temp>
~~~

Once the application is packaged correctly and passes verification, then it's ready for deployment.

## Next steps

[Deploy and remove applications][10]

<!--Image references-->
[1]: ./media/service-fabric-application-model/application-model.jpg
[2]: ./media/service-fabric-application-model/vs-package-command.png
[Image1]: media/service-fabric-application-model/Service1.jpg
[Image2]: media/service-fabric-application-model/Service2.jpg

<!--Link references--In actual articles, you only need a single period before the slash-->
[10]: ./service-fabric-deploy-remove-applications.md

