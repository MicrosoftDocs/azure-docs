---
title: Convert Azure Cloud Services apps to Service Fabric 
description: This guide compares Cloud Services Web and Worker Roles and Service Fabric stateless services to help migrate from Cloud Services to Service Fabric.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# Guide to converting Web and Worker Roles to Service Fabric stateless services
This article describes how to migrate your Cloud Services Web and Worker Roles to Service Fabric stateless services. This is the simplest migration path from Cloud Services to Service Fabric for applications whose overall architecture is going to stay roughly the same.

## Cloud Service project to Service Fabric application project
 A Cloud Service project and a Service Fabric Application project have a similar structure and both represent the deployment unit for your application - that is, they each define the complete package that is deployed to run your application. A Cloud Service project contains one or more Web or Worker Roles. Similarly, a Service Fabric Application project contains one or more services. 

The difference is that the Cloud Service project couples the application deployment with a VM deployment and thus contains VM configuration settings in it, whereas the Service Fabric Application project only defines an application that will be deployed to a set of existing VMs in a Service Fabric cluster. The Service Fabric cluster itself is only deployed once, either through an Resource Manager template or through the Azure portal, and multiple Service Fabric applications can be deployed to it.

![Service Fabric and Cloud Services project comparison][3]

## Worker Role to stateless service
Conceptually, a Worker Role represents a stateless workload, meaning every instance of the workload is identical and requests can be routed to any instance at any time. Each instance is not expected to remember the previous request. State that the workload operates on is managed by an external state store, such as Azure Table Storage or Azure Cosmos DB. In Service Fabric, this type of workload is represented by a Stateless Service. The simplest approach to migrating a Worker Role to Service Fabric can be done by converting Worker Role code to a Stateless Service.

![Worker Role to Stateless Service][4]

## Web Role to stateless service
Similar to Worker Role, a Web Role also represents a stateless workload, and so conceptually it too can be mapped to a Service Fabric stateless service. However, unlike Web Roles, Service Fabric does not support IIS. To migrate a web application from a Web Role to a stateless service requires first moving to a web framework that can be self-hosted and does not depend on IIS or System.Web, such as ASP.NET Core 1.

| **Application** | **Supported** | **Migration path** |
| --- | --- | --- |
| ASP.NET Web Forms |No |Convert to ASP.NET Core 1 MVC |
| ASP.NET MVC |With Migration |Upgrade to ASP.NET Core 1 MVC |
| ASP.NET Web API |With Migration |Use self-hosted server or ASP.NET Core 1 |
| ASP.NET Core 1 |Yes |N/A |

## Entry point API and lifecycle
Worker Role and Service Fabric service APIs offer similar entry points: 

| **Entry Point** | **Worker Role** | **Service Fabric service** |
| --- | --- | --- |
| Processing |`Run()` |`RunAsync()` |
| VM start |`OnStart()` |N/A |
| VM stop |`OnStop()` |N/A |
| Open listener for client requests |N/A |<ul><li> `CreateServiceInstanceListener()` for stateless</li><li>`CreateServiceReplicaListener()` for stateful</li></ul> |

### Worker Role
```csharp

using Microsoft.WindowsAzure.ServiceRuntime;

namespace WorkerRole1
{
    public class WorkerRole : RoleEntryPoint
    {
        public override void Run()
        {
        }

        public override bool OnStart()
        {
        }

        public override void OnStop()
        {
        }
    }
}

```

### Service Fabric Stateless Service
```csharp

using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;

namespace Stateless1
{
    public class Stateless1 : StatelessService
    {
        protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
        {
        }

        protected override Task RunAsync(CancellationToken cancelServiceInstance)
        {
        }
    }
}

```

Both have a primary "Run" override in which to begin processing. Service Fabric services  combine `Run`, `Start`, and `Stop` into a single entry point, `RunAsync`. Your service should begin working when `RunAsync` starts, and should stop working when the `RunAsync` method's CancellationToken is signaled. 

There are several key differences between the lifecycle and lifetime of Worker Roles and Service Fabric services:

* **Lifecycle:** The biggest difference is that a Worker Role is a VM and so its lifecycle is tied to the VM, which includes events for when the VM starts and stops. A Service Fabric service has a lifecycle that is separate from the VM lifecycle, so it does not include events for when the host VM or machine starts and stop, as they are not related.
* **Lifetime:** A Worker Role instance will recycle if the `Run` method exits. The `RunAsync` method in a Service Fabric service however can run to completion and the service instance will stay up. 

Service Fabric provides an optional communication setup entry point for services that listen for client requests. Both the RunAsync and communication entry point are optional overrides in Service Fabric services - your service may choose to only listen to client requests, or only run a processing loop, or both - which is why the RunAsync method is allowed to exit without restarting the service instance, because it may continue to listen for client requests.

## Application API and environment
The Cloud Services environment API provides information and functionality for the current VM instance as well as information about other VM role instances. Service Fabric provides information related to its runtime and some information about the node a service is currently running on. 

| **Environment Task** | **Cloud Services** | **Service Fabric** |
| --- | --- | --- |
| Configuration Settings and change notification |`RoleEnvironment` |`CodePackageActivationContext` |
| Local Storage |`RoleEnvironment` |`CodePackageActivationContext` |
| Endpoint Information |`RoleInstance` <ul><li>Current instance: `RoleEnvironment.CurrentRoleInstance`</li><li>Other roles and instance: `RoleEnvironment.Roles`</li> |<ul><li>`NodeContext` for current Node address</li><li>`FabricClient` and `ServicePartitionResolver` for service endpoint discovery</li> |
| Environment Emulation |`RoleEnvironment.IsEmulated` |N/A |
| Simultaneous change event |`RoleEnvironment` |N/A |

## Configuration settings
Configuration settings in Cloud Services are set for a VM role and apply to all instances of that VM role. These settings are key-value pairs set in ServiceConfiguration.*.cscfg files and can be accessed directly through RoleEnvironment. In Service Fabric, settings apply individually to each service and to each application, rather than to a VM, because a VM can host multiple services and applications. A service is composed of three packages:

* **Code:** contains the service executables, binaries, DLLs, and any other files a service needs to run.
* **Config:** all configuration files and settings for a service.
* **Data:** static data files associated with the service.

Each of these packages can be independently versioned and upgraded. Similar to Cloud Services, a config package can be accessed programmatically through an API and events are available to notify the service of a config package change. A Settings.xml file can be used for key-value configuration and programmatic access similar to the app settings section of an App.config file. However, unlike Cloud Services, a Service Fabric config package can contain any configuration files in any format, whether it's XML, JSON, YAML, or a custom binary format. 

### Accessing configuration
#### Cloud Services
Configuration settings from ServiceConfiguration.*.cscfg can be accessed through `RoleEnvironment`. These settings are globally available to all role instances in the same Cloud Service deployment.

```csharp

string value = RoleEnvironment.GetConfigurationSettingValue("Key");

```

#### Service Fabric
Each service has its own individual configuration package. There is no built-in mechanism for global configuration settings accessible by all applications in a cluster. When using Service Fabric's special Settings.xml configuration file within a configuration package, values in Settings.xml can be overwritten at the application level, making application-level configuration settings possible.

Configuration settings are accesses within each service instance through the service's `CodePackageActivationContext`.

```csharp

ConfigurationPackage configPackage = this.Context.CodePackageActivationContext.GetConfigurationPackageObject("Config");

// Access Settings.xml
KeyedCollection<string, ConfigurationProperty> parameters = configPackage.Settings.Sections["MyConfigSection"].Parameters;

string value = parameters["Key"]?.Value;

// Access custom configuration file:
using (StreamReader reader = new StreamReader(Path.Combine(configPackage.Path, "CustomConfig.json")))
{
    MySettings settings = JsonConvert.DeserializeObject<MySettings>(reader.ReadToEnd());
}

```

### Configuration update events
#### Cloud Services
The `RoleEnvironment.Changed` event is used to notify all role instances when a change occurs in the environment, such as a configuration change. This is used to consume configuration updates without recycling role instances or restarting a worker process.

```csharp

RoleEnvironment.Changed += RoleEnvironmentChanged;

private void RoleEnvironmentChanged(object sender, RoleEnvironmentChangedEventArgs e)
{
   // Get the list of configuration changes
   var settingChanges = e.Changes.OfType<RoleEnvironmentConfigurationSettingChange>();
foreach (var settingChange in settingChanges) 
   {
      Trace.WriteLine("Setting: " + settingChange.ConfigurationSettingName, "Information");
   }
}

```

#### Service Fabric
Each of the three package types in a service - Code, Config, and Data - have events that notify a service instance when a package is updated, added, or removed. A service can contain multiple packages of each type. For example, a service may have multiple config packages, each individually versioned and upgradeable. 

These events are available to consume changes in service packages without restarting the service instance.

```csharp

this.Context.CodePackageActivationContext.ConfigurationPackageModifiedEvent +=
                    this.CodePackageActivationContext_ConfigurationPackageModifiedEvent;

private void CodePackageActivationContext_ConfigurationPackageModifiedEvent(object sender, PackageModifiedEventArgs<ConfigurationPackage> e)
{
    this.UpdateCustomConfig(e.NewPackage.Path);
    this.UpdateSettings(e.NewPackage.Settings);
}

```

## Startup tasks
Startup tasks are actions that are taken before an application starts. A startup task is typically used to run setup scripts using elevated privileges. Both Cloud Services and Service Fabric support start-up tasks. The main difference is that in Cloud Services, a startup task is tied to a VM because it is part of a role instance, whereas in Service Fabric a startup task is tied to a service, which is not tied to any particular VM.

| Service Fabric | Cloud Services |
| --- | --- |
| Configuration location |ServiceDefinition.csdef |
| Privileges |"limited" or "elevated" |
| Sequencing |"simple", "background", "foreground" |

### Cloud Services
In Cloud Services a startup entry point is configured per role in ServiceDefinition.csdef. 

```xml

<ServiceDefinition>
    <Startup>
        <Task commandLine="Startup.cmd" executionContext="limited" taskType="simple" >
            <Environment>
                <Variable name="MyVersionNumber" value="1.0.0.0" />
            </Environment>
        </Task>
    </Startup>
    ...
</ServiceDefinition>

```

### Service Fabric
In Service Fabric a startup entry point is configured per service in ServiceManifest.xml:

```xml

<ServiceManifest>
  <CodePackage Name="Code" Version="1.0.0">
    <SetupEntryPoint>
      <ExeHost>
        <Program>Startup.bat</Program>
      </ExeHost>
    </SetupEntryPoint>
    ...
</ServiceManifest>

``` 

## A note about development environment
Both Cloud Services and Service Fabric are integrated with Visual Studio with project templates and support for debugging, configuring, and deploying both locally and to Azure. Both Cloud Services and Service Fabric also provide a local development runtime environment. The difference is that while the Cloud Service development runtime emulates the Azure environment on which it runs, Service Fabric does not use an emulator - it uses the complete Service Fabric runtime. The Service Fabric environment you run on your local development machine is the same environment that runs in production.

## Next steps
Read more about Service Fabric Reliable Services and the fundamental differences between Cloud Services and Service Fabric application architecture to understand how to take advantage of the full set of Service Fabric features.

* [Getting started with Service Fabric Reliable Services](service-fabric-reliable-services-quick-start.md)
* [Conceptual guide to the differences between Cloud Services and Service Fabric](service-fabric-cloud-services-migration-differences.md)

<!--Image references-->
[3]: ./media/service-fabric-cloud-services-migration-worker-role-stateless-service/service-fabric-cloud-service-projects.png
[4]: ./media/service-fabric-cloud-services-migration-worker-role-stateless-service/worker-role-to-stateless-service.png
