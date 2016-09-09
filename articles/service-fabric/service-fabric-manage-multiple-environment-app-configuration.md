<properties
   pageTitle="Manage multiple environments in Service Fabric | Microsoft Azure"
   description="Service Fabric applications can be run on clusters that range in size from one machine to thousands of machines. In some cases, you will want to configure your application differently for those varied environments. This article covers how to define different application parameters per environment."
   services="service-fabric"
   documentationCenter=".net"
   authors="seanmck"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotNet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="07/19/2016"
   ms.author="seanmck"/>

# Manage application parameters for multiple environments

You can create Azure Service Fabric clusters by using anywhere from one to many thousands of machines. While application binaries can run without modification across this wide spectrum of environments, you will often want to configure the application differently, depending on the number of machines you're deploying to.

As a simple example, consider `InstanceCount` for a stateless service. When you are running applications in Azure, you will generally want to set this parameter to the special value of "-1". This ensures that your service is running on every node in the cluster. However, this configuration is not suitable for a single-machine cluster since you can't have multiple processes listening on the same endpoint on a single machine. Instead, you will typically set `InstanceCount` to "1".

## Specifying environment-specific parameters

The solution to this configuration issue is a set of parameterized default services and application parameter files that fill in those parameter values for a given environment. Default services and application parameters are configured in the application and service manifests. The schema definition for the ServiceManifest.xml and ApplicationManifest.xml files is installed with the Service Fabric SDK and tools to *C:\Program Files\Microsoft SDKs\Service Fabric\schemas\ServiceFabricServiceModel.xsd*.

### Default services

Service Fabric applications are made up of a collection of service instances. While it is possible for you to create an empty application and then create all service instances dynamically, most applications have a set of core services that should always be created when the application is instantiated. These are referred to as "default services". They are specified in the application manifest, with placeholders for per-environment configuration included in square brackets:

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

Each of the named parameters must be defined within the Parameters element of the application manifest:

    <Parameters>
        <Parameter Name="Stateful1_MinReplicaSetSize" DefaultValue="2" />
        <Parameter Name="Stateful1_PartitionCount" DefaultValue="1" />
        <Parameter Name="Stateful1_TargetReplicaSetSize" DefaultValue="3" />
    </Parameters>

The DefaultValue attribute specifies the value to be used in the absence of a more-specific parameter for a given environment.

>[AZURE.NOTE] Not all service instance parameters are suitable for per-environment configuration. In the example above, the LowKey and HighKey values for the service's partitioning scheme are explicitly defined for all instances of the service since the partition range is a function of the data domain, not the environment.


### Per-environment service configuration settings

The [Service Fabric application model](service-fabric-application-model.md) enables services to include configuration packages that contain custom key-value pairs that are readable at run time. The values of these settings can also be differentiated by environment by specifying a `ConfigOverride` in the application manifest.

Suppose that you have the following setting in the Config\Settings.xml file for the `Stateful1` service:


    <Section Name="MyConfigSection">
      <Parameter Name="MaxQueueSize" Value="25" />
    </Section>

To override this value for a specific application/environment pair, create a `ConfigOverride` when you import the service manifest in the application manifest.

    <ConfigOverrides>
     <ConfigOverride Name="Config">
        <Settings>
           <Section Name="MyConfigSection">
              <Parameter Name="MaxQueueSize" Value="[Stateful1_MaxQueueSize]" />
           </Section>
        </Settings>
     </ConfigOverride>
  </ConfigOverrides>

This parameter can then be configured by environment as shown above. You can do this by declaring it in the parameters section of the application manifest and specifying environment-specific values in the application parameter files.

>[AZURE.NOTE] In the case of service configuration settings, there are three places where the value of a key can be set: the service configuration package, the application manifest, and the application parameter file. Service Fabric will always choose from the application parameter file first (if specified), then the application manifest, and finally the configuration package.


### Application parameter files

The Service Fabric application project can include one or more application parameter files. Each of them defines the specific values for the parameters that are defined in the application manifest:

    <!-- ApplicationParameters\Local.xml -->

    <Application Name="fabric:/Application1" xmlns="http://schemas.microsoft.com/2011/01/fabric">
        <Parameters>
            <Parameter Name ="Stateful1_MinReplicaSetSize" Value="2" />
            <Parameter Name="Stateful1_PartitionCount" Value="1" />
            <Parameter Name="Stateful1_TargetReplicaSetSize" Value="3" />
        </Parameters>
    </Application>

By default, a new application includes two application parameter files, named Local.xml and Cloud.xml:

![Application parameter files in Solution Explorer][app-parameters-solution-explorer]

To create a new parameter file, simply copy and paste an existing one and give it a new name.

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
