---
title: Manage multiple environments in Service Fabric | Microsoft Docs
description: Service Fabric applications can be run on clusters that range in size from one machine to thousands of machines. In some cases, you will want to configure your application differently for those varied environments. This article covers how to define different application parameters per environment.
services: service-fabric
documentationcenter: .net
author: mikkelhegn
manager: timlt
editor: ''

ms.assetid: f406eac9-7271-4c37-a0d3-0a2957b60537
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 06/07/2017
ms.author: mikkelhegn

---
# Manage application parameters for multiple environments
You can create Azure Service Fabric clusters by using anywhere from one to many thousands of machines. While application binaries can run without modification across this wide spectrum of environments, you often want to configure the application differently, depending on the number of machines you're deploying to.

As a simple example, consider `InstanceCount` for a stateless service. When you are running applications in Azure, you generally want to set this parameter to the special value of "-1". This configuration ensures that your service is running on every node in the cluster (or every node in the node type if you have set a placement constraint). However, this configuration is not suitable for a single-machine cluster since you cannot have multiple processes listening on the same endpoint on a single machine. Instead, you typically set `InstanceCount` to "1".

## Specifying environment-specific parameters
The solution to this configuration issue is a set of parameterized default services and application parameter files that fill in those parameter values for a given environment. Default services and application parameters are configured in the application and service manifests. The schema definition for the ServiceManifest.xml and ApplicationManifest.xml files is installed with the Service Fabric SDK and tools to *C:\Program Files\Microsoft SDKs\Service Fabric\schemas\ServiceFabricServiceModel.xsd*.

### Default services
Service Fabric applications are made up of a collection of service instances. While it is possible for you to create an empty application and then create all service instances dynamically, most applications have a set of core services that should always be created when the application is instantiated. These are referred to as "default services". They are specified in the application manifest, with placeholders for per-environment configuration included in square brackets:

```xml
  <DefaultServices>
      <Service Name="Stateful1">
          <StatefulService
              ServiceTypeName="Stateful1Type"
              TargetReplicaSetSize="[Stateful1_TargetReplicaSetSize]"
              MinReplicaSetSize="[Stateful1_MinReplicaSetSize]">

              <UniformInt64Partition
                  PartitionCount="[Stateful1_PartitionCount]"
                  LowKey="-9223372036854775808"
                  HighKey="9223372036854775807"
              />
        </StatefulService>
    </Service>
  </DefaultServices>
```

Each of the named parameters must be defined within the Parameters element of the application manifest:

```xml
    <Parameters>
        <Parameter Name="Stateful1_MinReplicaSetSize" DefaultValue="2" />
        <Parameter Name="Stateful1_PartitionCount" DefaultValue="1" />
        <Parameter Name="Stateful1_TargetReplicaSetSize" DefaultValue="3" />
    </Parameters>
```

The DefaultValue attribute specifies the value to be used in the absence of a more-specific parameter for a given environment.

> [!NOTE]
> Not all service instance parameters are suitable for per-environment configuration. In the example above, the LowKey and HighKey values for the service's partitioning scheme are explicitly defined for all instances of the service since the partition range is a function of the data domain, not the environment.
> 
> 

### Per-environment service configuration settings
The [Service Fabric application model](service-fabric-application-model.md) enables services to include configuration packages that contain custom key-value pairs that are readable at run time. The values of these settings can also be differentiated by environment by specifying a `ConfigOverride` in the application manifest.

Suppose that you have the following setting in the Config\Settings.xml file for the `Stateful1` service:

```xml
  <Section Name="MyConfigSection">
     <Parameter Name="MaxQueueSize" Value="25" />
  </Section>
```
To override this value for a specific application/environment pair, create a `ConfigOverride` when you import the service manifest in the application manifest.

```xml
  <ConfigOverrides>
     <ConfigOverride Name="Config">
        <Settings>
           <Section Name="MyConfigSection">
              <Parameter Name="MaxQueueSize" Value="[Stateful1_MaxQueueSize]" />
           </Section>
        </Settings>
     </ConfigOverride>
  </ConfigOverrides>
```
This parameter can then be configured by environment as shown above. You can do this by declaring it in the parameters section of the application manifest and specifying environment-specific values in the application parameter files.

> [!NOTE]
> In the case of service configuration settings, there are three places where the value of a key can be set: the service configuration package, the application manifest, and the application parameter file. Service Fabric will always choose from the application parameter file first (if specified), then the application manifest, and finally the configuration package.
> 
> 

### Setting and using environment variables 
You can specify and set environment variables in the ServiceManifest.xml file and then override these in the ApplicationManifest.xml file on a per instance basis.
The example below shows two environment variables, one with a value set and the other is overridden. You can use application parameters to set environment variables values in the same way that these were used for config overrides.

```xml
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
    <EnvironmentVariables>
      <EnvironmentVariable Name="MyEnvVariable" Value=""/>
      <EnvironmentVariable Name="HttpGatewayPort" Value="19080"/>
    </EnvironmentVariables>
  </CodePackage>
  <ConfigPackage Name="MyConfig" Version="ConfigVersion1" />
  <DataPackage Name="MyData" Version="DataVersion1" />
</ServiceManifest>
```
To override the environment variables in the ApplicationManifest.xml, reference the code package in the ServiceManifest with the `EnvironmentOverrides` element.

```xml
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="FrontEndServicePkg" ServiceManifestVersion="1.0.0" />
    <EnvironmentOverrides CodePackageRef="MyCode">
      <EnvironmentVariable Name="MyEnvVariable" Value="mydata"/>
    </EnvironmentOverrides>
  </ServiceManifestImport>
 ``` 
 Once the named service instance is created you can access the environment variables from code. e.g. In C# you can do the following

```csharp
    string EnvVariable = Environment.GetEnvironmentVariable("MyEnvVariable");
```

### Service Fabric environment variables
Service Fabric has built in environment variables set for each service instance. The full list of environment variables is below, where the ones in bold are the ones that you will use in your service, the other being used by Service Fabric runtime. 

* Fabric_ApplicationHostId
* Fabric_ApplicationHostType
* Fabric_ApplicationId
* **Fabric_ApplicationName**
* Fabric_CodePackageInstanceId
* **Fabric_CodePackageName**
* **Fabric_Endpoint_[YourServiceName]TypeEndpoint**
* **Fabric_Folder_App_Log**
* **Fabric_Folder_App_Temp**
* **Fabric_Folder_App_Work**
* **Fabric_Folder_Application**
* Fabric_NodeId
* **Fabric_NodeIPOrFQDN**
* **Fabric_NodeName**
* Fabric_RuntimeConnectionAddress
* Fabric_ServicePackageInstanceId
* Fabric_ServicePackageName
* Fabric_ServicePackageVersionInstance
* FabricPackageFileName

The code belows shows how to list the Service Fabric environment variables
 ```csharp
    foreach (DictionaryEntry de in Environment.GetEnvironmentVariables())
    {
        if (de.Key.ToString().StartsWith("Fabric"))
        {
            Console.WriteLine(" Environment variable {0} = {1}", de.Key, de.Value);
        }
    }
```
The following are examples of environment variables for an application type called `GuestExe.Application` with a service type called `FrontEndService` when run on your local dev machine.

* **Fabric_ApplicationName = fabric:/GuestExe.Application**
* **Fabric_CodePackageName = Code**
* **Fabric_Endpoint_FrontEndServiceTypeEndpoint = 80**
* **Fabric_NodeIPOrFQDN = localhost**
* **Fabric_NodeName = _Node_2**

### Application parameter files
The Service Fabric application project can include one or more application parameter files. Each of them defines the specific values for the parameters that are defined in the application manifest:

```xml
    <!-- ApplicationParameters\Local.xml -->

    <Application Name="fabric:/Application1" xmlns="http://schemas.microsoft.com/2011/01/fabric">
        <Parameters>
            <Parameter Name ="Stateful1_MinReplicaSetSize" Value="2" />
            <Parameter Name="Stateful1_PartitionCount" Value="1" />
            <Parameter Name="Stateful1_TargetReplicaSetSize" Value="3" />
        </Parameters>
    </Application>
```
By default, a new application includes three application parameter files, named Local.1Node.xml, Local.5Node.xml, and Cloud.xml:

![Application parameter files in Solution Explorer][app-parameters-solution-explorer]

To create a parameter file, simply copy and paste an existing one and give it a new name.

## Identifying environment-specific parameters during deployment
At deployment time, you need to choose the appropriate parameter file to apply with your application. You can do this through the Publish dialog in Visual Studio or through PowerShell.

### Deploy from Visual Studio
You can choose from the list of available parameter files when you publish your application in Visual Studio.

![Choose a parameter file in the Publish dialog][publishdialog]

### Deploy from PowerShell
The `Deploy-FabricApplication.ps1` PowerShell script included in the application project template accepts a publish profile as a parameter and the PublishProfile contains a reference to the application parameters file.

  ```PowerShell
    ./Deploy-FabricApplication -ApplicationPackagePath <app_package_path> -PublishProfileFile <publishprofile_path>
  ```

## Next steps
To learn more about some of the core concepts that are discussed in this topic, see the [Service Fabric technical overview](service-fabric-technical-overview.md). For information about other app management capabilities that are available in Visual Studio, see [Manage your Service Fabric applications in Visual Studio](service-fabric-manage-application-in-visual-studio.md).

<!-- Image references -->

[publishdialog]: ./media/service-fabric-manage-multiple-environment-app-configuration/publish-dialog-choose-app-config.png
[app-parameters-solution-explorer]:./media/service-fabric-manage-multiple-environment-app-configuration/app-parameters-in-solution-explorer.png
