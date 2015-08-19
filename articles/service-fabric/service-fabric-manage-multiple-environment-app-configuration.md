<properties
   pageTitle="Manage multiple environments in Service Fabric"
   description="Service Fabric applications can be run on clusters ranging in size from one machine to thousands of machines. In some cases, you will want to configure your application differently for those varied environments. This article covers how to define different application instance parameters per environment."
   services="service-fabric"
   documentationCenter=".net"
   authors="seanmck"
   manager="coreysa"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotNet"
   ms.topic="hero-article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="08/18/2015"
   ms.author="seanmck"/>

# Managing application parameters for multiple environments

Service Fabric clusters can be formed using anywhere from one to many thousands of machines. While application binaries can run without modification across this wide spectrum of environments, you will often wish to configure the application differently depending on the number of machines you're deploying to.

As a simple example, consider the `InstanceCount` for a stateless service. When running in Azure, you will generally want to set this paramater to the special value of -1, ensuring that your service is running on every node in the cluster. This configuration is not suitable for a one-box cluster, however, since you can't have multiple processes listening on the same endpoint on a single machine. Instead, you will typically set the `InstanceCount` to 1.

## Specifying environment-specific parameters

The solution to this is a set of parameterized default services and application instance definition files that fill in those parameter values for a given environment.

### Default services

Service Fabric applications are made up of a collection of service instances. While it is possible to create an empty application and then create all service instances dynamically, most applications have a set of core services that should always be created when the application is instantiated. These are referred to as "default services" and are specified in the application manifest, with placeholders for per-environment configuration included in spare brackets:

    <DefaultServices>
        <Service Name="Stateful1">
            <StatefulService
                ServiceTypeName="Stateful1Type" TargetReplicaSetSize="[Stateful1_TargetReplicaSetSize]" MinReplicaSetSize="[Stateful1_MinReplicaSetSize]">

                <UniformInt64Partition
                    PartitionCount="[Stateful1_PartitionCount]" LowKey="-9223372036854775808"
                    HighKey="9223372036854775807"
                />

        </StatefulService>
    </Service>
</DefaultServices>

Each of the named parameters must defined within the Parameters element of the application manifest:

    <Parameters>
        <Parameter Name="Stateful1_MinReplicaSetSize" DefaultValue="2" />
        <Parameter Name="Stateful1_PartitionCount" DefaultValue="1" />
        <Parameter Name="Stateful1_TargetReplicaSetSize" DefaultValue="3" />
    </Parameters>

The DefaultValue attributes specifies the value to be used in the absence of a more specific parameter for a given environment.

>[AZURE.NOTE] Not all service instance parameters are suitable for per-environment configuration. In the example above, the LowKey and HighKey values for the service's partitioning scheme are explicitly defined for all instances of the service since the partition range is a function of your data domain, not of the environment.

### Application instance definition files

The Service Fabric application project can include one or more application instance definition files, each of which defines the specific values for the parameters defined in the application manifest:

    <!-- AppInstanceDefinition.Local.xml -->

    <Application Name="fabric:/Application1" xmlns="http://schemas.microsoft.com/2011/01/fabric">
        <Parameters>
            <Parameter Name ="Stateful1_MinReplicaSetSize" Value="2" />
            <Parameter Name="Stateful1_PartitionCount" Value="1" />
            <Parameter Name="Stateful1_TargetReplicaSetSize" Value="3" />
        </Parameters>
    </Application>

## Identifying environment-specific parameters during deployment

### Deploying from Visual Studio


### Deploying from PowerShell

## Changing parameters for an existing application

In some cases, you may need to modify the parameters for a given service instance after the application has been created.
