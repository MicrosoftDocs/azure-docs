---
title: RunToCompletion semantics and specifications
description: Learn about Service Fabric RunToCompletion semantics and specifications, and see complete code examples and considerations.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# RunToCompletion

Starting with version 7.1, Service Fabric supports **RunToCompletion** semantics for [containers][containers-introduction-link] and [guest executable applications][guest-executables-introduction-link]. These semantics enable applications and services that complete a task and exit, in contrast to always running applications and services.

Before you proceed with this article, be familiar with the [Service Fabric application model][application-model-link] and the [Service Fabric hosting model][hosting-model-link].

> [!NOTE]
> RunToCompletion semantics aren't supported for services that use the [Reliable Services][reliable-services-link] programming model.
 
## RunToCompletion semantics and specification

You can specify RunToCompletion semantics as an `ExecutionPolicy` when you [import the ServiceManifest][application-and-service-manifests-link]. All the CodePackages comprising the ServiceManifest inherit the specified policy. The following snippet from *ApplicationManifest.xml* provides an example:

```xml
<ServiceManifestImport>
  <ServiceManifestRef ServiceManifestName="RunToCompletionServicePackage" ServiceManifestVersion="1.0"/>
  <Policies>
    <ExecutionPolicy Type="RunToCompletion" Restart="OnFailure"/>
  </Policies>
</ServiceManifestImport>
```
`ExecutionPolicy` allows two attributes:

- `Type` has `RunToCompletion` as the only allowed value.
- `Restart` specifies the restart policy to apply to CodePackages in the ServicePackage on failure. A CodePackage that exits with a non-zero exit code is considered to have failed. Allowed values for this attribute are `OnFailure` and `Never`, with `OnFailure` as the default.

  - With restart policy set to `OnFailure`, any CodePackage that fails with a non-zero exit code restarts, with back-offs between repeated failures.

  - With restart policy set to `Never`, if any CodePackage fails, the deployment status of the DeployedServicePackage is marked **Failed**, but other CodePackages continue execution.

If all the CodePackages in the ServicePackage run to successful completion with exit code `0`, the deployment status of the DeployedServicePackage is marked **RanToCompletion**.

## Code example using RunToCompletion semantics

Let's look at a complete example that uses RunToCompletion semantics.

> [!IMPORTANT]
> The following example assumes familiarity with [creating Windows container applications using Service Fabric and Docker][containers-getting-started-link].
>
> Windows Server containers aren't compatible across all versions of a host OS. This example references `mcr.microsoft.com/windows/nanoserver:1809`. For more information, see [Windows container version compatibility](/virtualization/windowscontainers/deploy-containers/version-compatibility).

The following *ServiceManifest.xml* describes a ServicePackage consisting of two CodePackages, which represent containers. `RunToCompletionCodePackage1` just logs a message to **stdout** and exits. `RunToCompletionCodePackage2` pings the loopback address for a while and then exits with an exit code of either `0`, `1`, or `2`.

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

The following *ApplicationManifest.xml* describes an application based on the *ServiceManifest.xml* discussed above. The code specifies RunToCompletion ExecutionPolicy for `WindowsRunToCompletionServicePackage` with a restart policy of `OnFailure`.

Upon `WindowsRunToCompletionServicePackage` activation, its constituent CodePackages are started. `RunToCompletionCodePackage1` should exit successfully on the first activation. `RunToCompletionCodePackage2` can fail with a non-zero exit code, and will restart because the restart policy is `OnFailure`.

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
## Query deployment status of a DeployedServicePackage

You can query deployment status of a DeployedServicePackage.

- From PowerShell, use the [Get-ServiceFabricDeployedServicePackage][deployed-service-package-link]
- From C#, use the [FabricClient][fabric-client-link] API [GetDeployedServicePackageListAsync(String, Uri, String)][deployed-service-package-fabricclient-link].

## Considerations for RunToCompletion semantics

Consider the following points about RunToCompletion support:

- RunToCompletion semantics are supported only for [containers][containers-introduction-link] and [guest executable applications][guest-executables-introduction-link].
- Upgrade scenarios for applications with RunToCompletion semantics aren't allowed. You need to delete and recreate such applications if necessary.
- Failover events can cause CodePackages to re-execute after successful completion, on the same node or on other nodes of the cluster. Examples of failover events are node restarts and Service Fabric runtime upgrades on a node.
- RunToCompletion is incompatible with `ServicePackageActivationMode="SharedProcess"`. Service Fabric runtime version 9.0 and higher fails validation for such services. `SharedProcess` is the default value, so you must specify `ServicePackageActivationMode="ExclusiveProcess"` to use RunToCompletion semantics.

## Next steps

- [Service Fabric and containers][containers-introduction-link]
- [Service Fabric and guest executables][guest-executables-introduction-link]

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
[deployed-code-package-link]: /powershell/module/servicefabric/get-servicefabricdeployedcodepackage
[deployed-service-package-link]: /powershell/module/servicefabric/get-servicefabricdeployedservicepackage
[fabric-client-link]: /dotnet/api/system.fabric.fabricclient
[deployed-service-package-fabricclient-link]: /dotnet/api/system.fabric.fabricclient.queryclient.getdeployedservicepackagelistasync
