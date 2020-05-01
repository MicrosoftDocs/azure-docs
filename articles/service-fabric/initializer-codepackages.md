---
title: Initializer CodePackages in Service Fabric
description: Describes Initializer CodePackages in Service Fabric.
author: shsha-msft

ms.topic: conceptual
ms.date: 03/10/2020
ms.author: shsha
---
# Initializer CodePackages

Starting with version 7.1, Service Fabric supports **Initializer CodePackages** for [containers][containers-introduction-link] and [guest executable][guest-executables-introduction-link] applications. Initializer CodePackages provide the opportunity to perform initializations at the ServicePackage scope before other CodePackages begin execution. Their relationship to a ServicePackage is analogous to what a [SetupEntryPoint][setup-entry-point-link] is for a CodePackage.

Before proceeding with this article, we recommend getting familiar with the [Service Fabric application model][application-model-link] and the [Service Fabric hosting model][hosting-model-link].

> [!NOTE]
> Initializer CodePackages are currently not supported for services written using the [Reliable Services][reliable-services-link] programming model.
 
## Semantics

An Initializer CodePackage is expected to run to **successful completion (exit code 0)**. A failed Initializer CodePackage is restarted until it successfully completes. Multiple Initializer CodePackages are allowed and are executed to **successful completion**, **sequentially**, **in a specified order** before other CodePackages in the ServicePackage begin execution.

## Specifying Initializer CodePackages
You can mark a CodePackage as an Initializer by setting the **Initializer** attribute to **true** in the ServiceManifest. When there are multiple Initializer CodePackages, their order of execution can be specified via the **ExecOrder** attribute. **ExecOrder** must be a non-negative integer and is only valid for Initializer CodePackages. Initializer CodePackages with lower values of **ExecOrder** are executed first. If **ExecOrder** is not specified for an Initializer CodePackage, a default value of 0 is assumed. Relative execution order of Initializer CodePackages with the same value of **ExecOrder** is unspecified.

The following ServiceManifest snippet describes three CodePackages two of which are marked as Initializers. When this ServicePackage is activated, *InitCodePackage0* is executed first since it has the lowest value of **ExecOrder**. On successful completion (exit code 0) of *InitCodePackage0*, *InitCodePackage1* is executed. Finally, on successful completion of *InitCodePackage1*, *WorkloadCodePackage* is executed.

```xml
<CodePackage Name="InitCodePackage0" Version="1.0" Initializer="true" ExecOrder="0">
  ...
</CodePackage>

<CodePackage Name="InitCodePackage1" Version="1.0" Initializer="true" ExecOrder="1">
  ...
</CodePackage>

<CodePackage Name="WorkloadCodePackage" Version="1.0">
  ...
</CodePackage>
```
## Complete example using Initializer CodePackages

Let's look at a complete example using Initializer CodePackages.

> [!IMPORTANT]
> The following example assumes familiarity with creating [Windows container applications using Service Fabric and Docker][containers-getting-started-link].
>
> This example references mcr.microsoft.com/windows/nanoserver:1809. Windows Server containers are not compatible across all versions of a host OS. To learn more, see [Windows Container Version Compatibility](https://docs.microsoft.com/virtualization/windowscontainers/deploy-containers/version-compatibility).

The following ServiceManifest.xml builds upon the ServiceManifest snippet described earlier. *InitCodePackage0*, *InitCodePackage1* and *WorkloadCodePackage* are CodePackages which represent containers. Upon activation, *InitCodePackage0* is executed first. It logs a message to a file and exits. Next, *InitCodePackage1* is executed which also logs a message to a file and exits. Finally, the *WorkloadCodePackage* begins execution. It also logs a message to a file, outputs the contents of the file to **stdout** and then pings forever.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ServiceManifest Name="WindowsInitCodePackageServicePackage" Version="1.0" xmlns="http://schemas.microsoft.com/2011/01/fabric" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Description>Windows Init CodePackage Service</Description>
  <ServiceTypes>
    <StatelessServiceType ServiceTypeName="WindowsInitCodePackageServiceType"  UseImplicitHost="true"/>
  </ServiceTypes>
  <CodePackage Name="InitCodePackage0" Version="1.0" Initializer="true" ExecOrder="0">
    <EntryPoint>
      <ContainerHost>
        <ImageName>mcr.microsoft.com/windows/nanoserver:1809</ImageName>
        <Commands>/c,echo Hi from InitCodePackage0. &gt; C:\WorkspaceOnContainer\log.txt</Commands>
        <EntryPoint>cmd</EntryPoint>
      </ContainerHost>
    </EntryPoint>
  </CodePackage>

  <CodePackage Name="InitCodePackage1" Version="1.0" Initializer="true" ExecOrder="1">
    <EntryPoint>
      <ContainerHost>
        <ImageName>mcr.microsoft.com/windows/nanoserver:1809</ImageName>
        <Commands>/c,echo Hi from InitCodePackage1. &gt;&gt; C:\WorkspaceOnContainer\log.txt</Commands>
        <EntryPoint>cmd</EntryPoint>
      </ContainerHost>
    </EntryPoint>
  </CodePackage>

  <CodePackage Name="WorkloadCodePackage" Version="1.0">
    <EntryPoint>
      <ContainerHost>
        <ImageName>mcr.microsoft.com/windows/nanoserver:1809</ImageName>
        <Commands>/c,echo Hi from WorkloadCodePackage. &gt;&gt; C:\WorkspaceOnContainer\log.txt &amp;&amp; type C:\WorkspaceOnContainer\log.txt &amp;&amp; ping -t 127.0.0.1 &gt; nul</Commands>
        <EntryPoint>cmd</EntryPoint>
      </ContainerHost>
    </EntryPoint>
  </CodePackage>
</ServiceManifest>
```

The following ApplicationManifest.xml describes an application based on the ServiceManifest.xml discussed above. Note that it specifies the same **Volume** mount for all the containers, i.e. **C:\WorkspaceOnHost** is mounted at **C:\WorkspaceOnContainer** on all three containers. The net effect is that all the containers write to the same log file in the order in which they are activated.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ApplicationManifest ApplicationTypeName="WindowsInitCodePackageApplicationType" ApplicationTypeVersion="1.0" xmlns="http://schemas.microsoft.com/2011/01/fabric" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

  <Description>Windows Init CodePackage Application</Description>

  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="WindowsInitCodePackageServicePackage" ServiceManifestVersion="1.0"/>
    <Policies>
      <ContainerHostPolicies CodePackageRef="InitCodePackage0" ContainersRetentionCount="2" RunInteractive="true">
        <Volume Source="C:\WorkspaceOnHost" Destination="C:\WorkspaceOnContainer" IsReadOnly="false" />
      </ContainerHostPolicies>

     <ContainerHostPolicies CodePackageRef="InitCodePackage1" ContainersRetentionCount="2" RunInteractive="true">
        <Volume Source="C:\WorkspaceOnHost" Destination="C:\WorkspaceOnContainer" IsReadOnly="false" />
      </ContainerHostPolicies>

      <ContainerHostPolicies CodePackageRef="WorkloadCodePackage" ContainersRetentionCount="2" RunInteractive="true">
        <Volume Source="C:\WorkspaceOnHost" Destination="C:\WorkspaceOnContainer" IsReadOnly="false" />
      </ContainerHostPolicies>
    </Policies>
  </ServiceManifestImport>

  <DefaultServices>
    <Service Name="WindowsInitCodePackageService" ServicePackageActivationMode="ExclusiveProcess">
      <StatelessService ServiceTypeName="WindowsInitCodePackageServiceType" InstanceCount="1">
        <SingletonPartition />
      </StatelessService>
    </Service>
  </DefaultServices>
</ApplicationManifest>
```
Once the ServicePackage has been successfully activated, the contents of **C:\WorkspaceOnHost\log.txt** should be the following.

```console
C:\Users\test>type C:\WorkspaceOnHost\log.txt
Hi from InitCodePackage0.
Hi from InitCodePackage1.
Hi from WorkloadCodePackage.
```

## Next steps

See the following articles for related information.

* [Service Fabric and containers.][containers-introduction-link]
* [Service Fabric and guest executables.][guest-executables-introduction-link]

<!-- Links -->
[containers-introduction-link]: service-fabric-containers-overview.md
[containers-getting-started-link]: service-fabric-get-started-containers.md
[guest-executables-introduction-link]: service-fabric-guest-executables-introduction.md
[reliable-services-link]: service-fabric-reliable-services-introduction.md
[application-model-link]: service-fabric-application-model.md
[hosting-model-link]: service-fabric-hosting-model.md
[setup-entry-point-link]: service-fabric-run-script-at-service-startup.md

