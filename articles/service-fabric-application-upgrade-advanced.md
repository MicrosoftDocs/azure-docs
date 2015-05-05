<properties
   pageTitle="Service Fabric Application Upgrade: Advanced Topics"
   description="This article covers some advanced topics pertaining to upgrading a Service Fabric application."
   services="service-fabric"
   documentationCenter=".net"
   authors="mani-ramaswamy"
   manager="samgeo"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="04/15/2015"
   ms.author="subramar"/>

# Service Fabric Application Upgrade: Advanced Topics

## Manual Upgrade Mode

> [AZURE.NOTE] Only for a failed or suspended upgrade, should the Unmonitored Manual mode be even considered. The Monitored mode is the upgrade mode recommended for Service Fabric applications.

Service Fabric provides multiple upgrade mode to support development and production cluster. Each of the deployment options are ideal for different environments. Monitored Rolling Application Upgrade is the most typical upgrade to be used in production. When the upgrade policy is specified, Service Fabric ensures that the application is healthy before the upgrade proceeds. In certain situation, where there are more customize or complex health evaluation policy is required or a non-conventional upgrade (application is already in data loss or etc.), the application administrator can use the Manual Rolling Application Upgrade mode to have total control over the progress of upgrade through the various upgrade domains. Finally, the Automated Rolling Application Upgrade is useful for development or testing environment to provide a fast iteration cycle during service development.

**Manual**- Stop the application upgrade at the current UD and change the upgrade mode to Unmonitored Manual. The administrator needs to manually call **MoveNextApplicationUpgradeDomainAsync** to proceed with the upgrade or trigger a roll-back by initiating a new upgrade. Once the upgrade enters into the Manual mode, it stays in the Manual mode until a new upgrade is initiated. The **GetApplicationUpgradeProgressAsync**command returns FABRIC\_APPLICATION\_UPGRADE\_STATE\_ROLLING\_FORWARD\_PENDING.

## Upgrading with a Diff package

A Service Fabric application can be upgraded by provisioning with a full, self-contained application package. An application can also be upgraded by using a diff package that contains only the updated application files, and updated application manifest and service manifest files.

A full application package contains all the files necessary to start and run a Service Fabric application. A diff package contains only the files that changed between the last provision and the current upgrade, plus the full application manifest and service manifest files. Any reference in the application manifest or service manifest which Service Fabric cannot find in the build layout, Service Fabric will search for the reference in the ImageStore (link TBA).

Full application packages are required for the first install of an application to the cluster. Subsequent updates can be either a full application package or a diff package.

Occasions when using a diff package would be a good choice:

* A diff package is preferred when you have a large application package which references several service manifest files and/or several code packages, config packages, or data packages.

* A diff package is preferred when you have a deployment system which generates the build layout directly from your application build process. In this case, even though nothing in the code has changed, newly built assemblies will have a different checksum. Using a full application package would require you to update the version on all code packages. Using a diff package, you only provide the files that changed and the manifest files where the version has changed.

## Next steps

[Upgrade Tutorial](service-fabric-application-upgrade-tutorial.md)

[Upgrade Parameters](service-fabric-application-upgrade-parameters.md)

[Data Serialization](service-fabric-application-upgrade-data-serialization.md)

[Troubleshooting Application Upgrade](service-fabric-application-upgrade-troubleshooting.md)
