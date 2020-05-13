---
title: RunToCompletion semantics in Service Fabric
description: Describes RunToCompletion semantics in Service Fabric.
author: shsha-msft

ms.topic: conceptual
ms.date: 03/11/2020
ms.author: shsha
---
# RunToCompletion

Starting with version 7.1, Service Fabric supports **RunToCompletion** semantics for [containers][containers-introduction-link] and [guest executable][guest-executables-introduction-link] applications. These semantics enable applications and services which complete a task and exit, in contrast to, always running applications and services.

Before proceeding with this article, we recommend getting familiar with the [Service Fabric application model][application-model-link] and the [Service Fabric hosting model][hosting-model-link].

> [!NOTE]
> RunToCompletion semantics are currently not supported for services written using the [Reliable Services][reliable-services-link] programming model.
 
## RunToCompletion semantics and specification
RunToCompletion semantics can be specified as an **ExecutionPolicy** when [importing the ServiceManifest][application-and-service-manifests-link]. The specified policy is inherited by all the CodePackages comprising the ServiceManifest. The following ApplicationManifest.xml snippet provides an example.

```xml
<ServiceManifestImport>
  <ServiceManifestRef ServiceManifestName="RunToCompletionServicePackage" ServiceManifestVersion="1.0"/>
  <Policies>
    <ExecutionPolicy Type="RunToCompletion" Restart="OnFailure"/>
  </Policies>
</ServiceManifestImport>
```
**ExecutionPolicy** allows the following two attributes:
* **Type:** **RunToCompletion** is currently the only allowed value for this attribute.
* **Restart:** This attribute specifies the restart policy that is applied to CodePackages comprising the ServicePackage, on failure. A CodePackage exiting with a **non-zero exit code** is considered to have failed. Allowed values for this attribute are **OnFailure** and **Never** with **OnFailure** being the default.

With restart policy set to **OnFailure**, if any CodePackage fails **(non-zero exit code)**, it is restarted, with back-offs between repeated failures. With restart policy set to **Never**, if any CodePackage fails, the deployment status of the DeployedServicePackage is marked as **Failed** but other CodePackages are allowed to continue execution. If all the CodePackages comprising the ServicePackage run to successful completion **(exit code 0)**, the deployment status of the DeployedServicePackage is marked as **RanToCompletion**. 

## Complete example using RunToCompletion semantics

Let's look at a complete example using RunToCompletion semantics.

> [!IMPORTANT]
> The following example assumes familiarity with creating [Windows container applications using Service Fabric and Docker][containers-getting-started-link].
>
> This example references mcr.microsoft.com/windows/nanoserver:1809. Windows Server containers are not compatible across all versions of a host OS. To learn more, see [Windows Container Version Compatibility](https://docs.microsoft.com/virtualization/windowscontainers/deploy-containers/version-compatibility).

The following ServiceManifest.xml describes a ServicePackage consisting of two CodePackages, which represent containers. *RunToCompletionCodePackage1* just logs a message to **stdout** and exits. *RunToCompletionCodePackage2* pings the loopback address for a while and then exits with an exit code of either **0**, **1** or **2**.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ServiceManifest Name="WindowsRunToCompletionServicePackage" Version="1.0" xmlns="http://schemas.microsoft.com/2011/01/fabric" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Description>Windows RunToCompletion Service</Description>
  <ServiceTypes>
    <StatelessServiceType ServiceTypeName="WindowsRunToCompletionServiceType"  UseImplicitHost="true"/>
  </ServiceTypes>
  <CodePackage Name="RunToCompletionCodePackage1" Version="1.0">
    <EntryPoint>
      <ContainerHost>
        <ImageName>mcr.microsoft.com/windows/nanoserver:1809</ImageName>
        <Commands>/c,echo Hi from RunToCompletionCodePackage1 &amp;&amp; exit 0</Commands>
        <EntryPoint>cmd</EntryPoint>
      </ContainerHost>
    </EntryPoint>
  </CodePackage>

  <CodePackage Name="RunToCompletionCodePackage2" Version="1.0">
    <EntryPoint>
      <ContainerHost>
        <ImageName>mcr.microsoft.com/windows/nanoserver:1809</ImageName>
        <Commands>/v,/c,ping 127.0.0.1 &amp;&amp; set /a exitCode=%random% % 3 &amp;&amp; exit !exitCode!</Commands>
        <EntryPoint>cmd</EntryPoint>
      </ContainerHost>
    </EntryPoint>
  </CodePackage>
</ServiceManifest>
```

The following ApplicationManifest.xml describes an application based on the ServiceManifest.xml discussed above. It specifies **RunToCompletion** **ExecutionPolicy** for *WindowsRunToCompletionServicePackage* with a restart policy of **OnFailure**. Upon activation of *WindowsRunToCompletionServicePackage*, its constituent CodePackages will be started. *RunToCompletionCodePackage1* should exit successfully on the first activation. However, *RunToCompletionCodePackage2* can fail **(non-zero exit code)**, in which case it will be restarted since the restart policy is **OnFailure**.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ApplicationManifest ApplicationTypeName="WindowsRunToCompletionApplicationType" ApplicationTypeVersion="1.0" xmlns="http://schemas.microsoft.com/2011/01/fabric" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

  <Description>Windows RunToCompletion Application</Description>

  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="WindowsRunToCompletionServicePackage" ServiceManifestVersion="1.0"/>
    <Policies>
      <ExecutionPolicy Type="RunToCompletion" Restart="OnFailure"/>
    </Policies>
  </ServiceManifestImport>

  <DefaultServices>
    <Service Name="WindowsRunToCompletionService" ServicePackageActivationMode="ExclusiveProcess">
      <StatelessService ServiceTypeName="WindowsRunToCompletionServiceType" InstanceCount="1">
        <SingletonPartition />
      </StatelessService>
    </Service>
  </DefaultServices>
</ApplicationManifest>
```
## Querying deployment status of a DeployedServicePackage
Deployment status of a DeployedServicePackage can be queried from PowerShell using [Get-ServiceFabricDeployedServicePackage][deployed-service-package-link] or from C# using [FabricClient][fabric-client-link] API [GetDeployedServicePackageListAsync(String, Uri, String)][deployed-service-package-fabricclient-link]

## Considerations when using RunToCompletion semantics

The following points should be noted for the current RunToCompletion support.
* These semantics are only supported for [containers][containers-introduction-link] and [guest executable][guest-executables-introduction-link] applications.
* Upgrade scenarios for applications with RunToCompletion semantics are not allowed. Users should delete and recreate such applications, if necessary.
* Failover events can cause CodePackages to re-execute after successful completion, on the same node, or other nodes of the cluster. Examples of failover events are, node restarts and Service Fabric runtime upgrades on a node.

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
[application-and-service-manifests-link]: service-fabric-application-and-service-manifests.md
[setup-entry-point-link]: service-fabric-run-script-at-service-startup.md
[deployed-service-package-working-with-link]: service-fabric-hosting-model.md#work-with-a-deployed-service-package
[deployed-code-package-link]: https://docs.microsoft.com/powershell/module/servicefabric/get-servicefabricdeployedcodepackage
[deployed-service-package-link]: https://docs.microsoft.com/powershell/module/servicefabric/get-servicefabricdeployedservicePackage
[fabric-client-link]: https://docs.microsoft.com/dotnet/api/system.fabric.fabricclient
[deployed-service-package-fabricclient-link]: https://docs.microsoft.com/dotnet/api/system.fabric.fabricclient.queryclient.getdeployedservicepackagelistasync

