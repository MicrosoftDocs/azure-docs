# Overview
## [Service Fabric overview](service-fabric-overview.md)
## [Understand microservices](service-fabric-overview-microservices.md)
## [Service Fabric terminology](service-fabric-technical-overview.md)
## [Service Fabric applications](service-fabric-application-scenarios.md)
## [Service Fabric architecture](service-fabric-architecture.md)

# Get Started
## [Learning path for Service Fabric](https://azure.microsoft.com/documentation/learning-paths/service-fabric/)
## Set up your development environment
### [Windows](service-fabric-get-started.md)
### [Linux](service-fabric-get-started-linux.md)
### [Mac OS](service-fabric-get-started-mac.md)
## Create your first application
### [Using C# on Windows](service-fabric-create-your-first-application-in-visual-studio.md)
### [Using Java on Linux](service-fabric-create-your-first-linux-application-with-java.md)
### [Using C# on Linux](service-fabric-create-your-first-linux-application-with-csharp.md)
## [Deploy and upgrade your application on a local cluster](service-fabric-get-started-with-a-local-cluster.md)

# How To
## Build an application
### Basics
#### [Programming model overview](service-fabric-choose-framework.md)
#### [Application model overview](service-fabric-application-model.md)
#### [Service communication overview](service-fabric-connect-and-communicate-with-services.md)
#### [Tools to develop your application](service-fabric-manage-application-in-visual-studio.md)
#### [Build a web front-end for your application](service-fabric-reliable-services-communication-webapi.md)
#### [Debug your application](service-fabric-debugging-your-application.md)
#### Monitor and diagnose services locally
##### [Windows](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally.md)
##### [Linux](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally-linux.md)
#### [Configure security policies for your application](service-fabric-application-runas-security.md)
#### [Configure your application for multiple environments](service-fabric-manage-multiple-environment-app-configuration.md)

### Reliable Service application
#### [Reliable Services overview](service-fabric-reliable-services-introduction.md)
#### Get started with Reliable Services
##### [Using C# on Windows](service-fabric-reliable-services-quick-start.md)
##### [Using Java on Linux](service-fabric-reliable-services-quick-start-java.md)
#### [Reliable Services architecture](service-fabric-reliable-services-platform-architecture.md)
#### [Reliable Collections overview](service-fabric-reliable-services-reliable-collections.md)
#### [Use Reliable Collections](service-fabric-work-with-reliable-collections.md)
#### [Configure Reliable Collections](service-fabric-reliable-services-configuration.md)
#### [Notifications in Reliable Collections](service-fabric-reliable-services-notifications.md)
#### [Backup and restore Reliable Collections](service-fabric-reliable-services-backup-restore.md)
#### [Communicate with Reliable Services](service-fabric-reliable-services-communication.md)
#### [Communicate using ASP.NET](service-fabric-reliable-services-communication-webapi.md)
#### [Communicate using Service Remoting](service-fabric-reliable-services-communication-remoting.md)
#### [Communicate using WCF](service-fabric-reliable-services-communication-wcf.md)
#### [Communicate using Service Fabric Reverse Proxy](service-fabric-reverseproxy.md)
#### [Reliable Services advanced usage](service-fabric-reliable-services-advanced-usage.md)

### Reliable Actor application
#### [Reliable Actors overview](service-fabric-reliable-actors-introduction.md)
#### Get Started with Reliable Actors
##### [Using C# on Windows](service-fabric-reliable-actors-get-started.md)
##### [Using Java on Linux](service-fabric-reliable-actors-get-started-java.md)
#### [Reliable Actors architecture](service-fabric-reliable-actors-platform.md)
#### [Lifecycle and garbage collection](service-fabric-reliable-actors-lifecycle.md)
#### [Polymorphism in Reliable Actors](service-fabric-reliable-actors-polymorphism.md)
#### [Reentrancy in Reliable Actors](service-fabric-reliable-actors-reentrancy.md)
#### [Timers and reminders in Reliable Actors](service-fabric-reliable-actors-timers-reminders.md)
#### [Events in Reliable Actors](service-fabric-reliable-actors-events.md)
#### [State management in Reliable Actors](service-fabric-reliable-actors-state-management.md)
#### [Configure Reliable Actors state provider](service-fabric-reliable-actors-kvsactorstateprovider-configuration.md)
#### [Type serialization in Reliable Actors](service-fabric-reliable-actors-notes-on-actor-type-serialization.md)

### Guest executable application
#### [Deploy a guest executable](service-fabric-deploy-existing-app.md)
#### [Deploy multiple guest executables](service-fabric-deploy-multiple-apps.md)

### Container application
#### [Containers overview](service-fabric-containers-overview.md)
#### Get started with containers
##### [Deploy Windows container](service-fabric-deploy-container.md)
##### [Deploy Docker container](service-fabric-deploy-container-linux.md)

## Migrate from Cloud Services
### [Compare Cloud Services with Service Fabric](service-fabric-cloud-services-migration-differences.md)
### [Migrate from Cloud Services to Service Fabric](service-fabric-cloud-services-migration-worker-role-stateless-service.md)

## Create and manage clusters

### Basics
#### [Cluster overview](service-fabric-deploy-anywhere.md)
#### [Describe a cluster](service-fabric-cluster-resource-manager-cluster-description.md)
#### [Cluster capacity planning](service-fabric-cluster-capacity.md)
#### [Visualize a cluster with Service Fabric Explorer](service-fabric-visualizing-your-cluster.md)
#### [Connect to a secure cluster](service-fabric-connect-to-secure-cluster.md)
#### [Cluster security](service-fabric-cluster-security.md)
#### [Cluster disaster recovery](service-fabric-disaster-recovery.md)

### Clusters on Azure
#### Create a cluster on Azure
##### [Using Azure portal](service-fabric-cluster-creation-via-portal.md)
##### [Using Azure Resource Manager](service-fabric-cluster-creation-via-arm.md)
#### [Node types and VM Scale Sets in the cluster](service-fabric-cluster-nodetypes.md)
#### [Scale the cluster up or down](service-fabric-cluster-scale-up-down.md)
#### [Upgrade the cluster](service-fabric-cluster-upgrade.md)
#### [Delete the cluster](service-fabric-cluster-delete.md)
#### [Access control for the cluster](service-fabric-cluster-security-roles.md)
#### [Configure the cluster](service-fabric-cluster-fabric-settings.md)
#### [Try a Party Cluster on Azure for free](http://aka.ms/tryservicefabric)

### Standalone clusters
#### [Create a standalone cluster](service-fabric-cluster-creation-for-windows-server.md)
#### [Scale the cluster in and out](service-fabric-cluster-windows-server-add-remove-nodes.md)
#### [Upgrade the cluster](service-fabric-cluster-upgrade-windows-server.md)
#### [Secure the cluster](service-fabric-windows-cluster-x509-security.md)
#### [Access control for the cluster](service-fabric-cluster-security-roles.md)
#### [Configure the cluster](service-fabric-cluster-manifest.md)

## Manage and orchestrate cluster resources
### [Cluster Resource Manager overview](service-fabric-cluster-resource-manager-introduction.md)
### [Cluster Resource Manager architecture](service-fabric-cluster-resource-manager-architecture.md)
### [Describe a cluster](service-fabric-cluster-resource-manager-cluster-description.md)
### [Application groups overview](service-fabric-cluster-resource-manager-application-groups.md)
### [Configure Cluster Resource Manager settings](service-fabric-cluster-resource-manager-configure-services.md)
### [Resource consumption metrics](service-fabric-cluster-resource-manager-metrics.md)
### [Use service affinity](service-fabric-cluster-resource-manager-advanced-placement-rules-affinity.md)
### [Service placement policies](service-fabric-cluster-resource-manager-advanced-placement-rules-placement-policies.md)
### [Manage cluster using Cluster Resource Manager](service-fabric-cluster-resource-manager-management-integration.md)
### [Cluster defragmentation](service-fabric-cluster-resource-manager-defragmentation-metrics.md)
### [Balance your cluster](service-fabric-cluster-resource-manager-balancing.md)
### [Throttling in Cluster Resource Manager](service-fabric-cluster-resource-manager-advanced-throttling.md)
### [Service movement using Cluster Resource Manager](service-fabric-cluster-resource-manager-movement-cost.md)

## Manage application lifecycle
### [Application lifecycle overview](service-fabric-application-lifecycle.md)
### [Setup continuous integration](service-fabric-set-up-continuous-integration.md)
### Deploy or remove applications
#### [Using PowerShell](service-fabric-deploy-remove-applications.md)
#### [Using Visual Studio](service-fabric-publish-app-remote-cluster.md)
### [Application upgrade overview](service-fabric-application-upgrade.md)
### [Configure application upgrade](service-fabric-visualstudio-configure-upgrade.md)
### [Application upgrade parameters](service-fabric-application-upgrade-parameters.md)
### Upgrade an application
#### [Using PowerShell](service-fabric-application-upgrade-tutorial-powershell.md)
#### [Using Visual Studio](service-fabric-application-upgrade-tutorial.md)
### [Troubleshoot application upgrades](service-fabric-application-upgrade-troubleshooting.md)
### [Data serialization in application upgrades](service-fabric-application-upgrade-data-serialization.md)
### [Application upgrades advanced topics](service-fabric-application-upgrade-advanced.md)
### [REST-based application lifecycle sample](service-fabric-rest-based-application-lifecycle-sample.md)

## Inspect application and cluster health
### [Monitor Service Fabric health](service-fabric-health-introduction.md)
### [Report and check service health](service-fabric-diagnostics-how-to-report-and-check-service-health.md)
### [Add custom health reports](service-fabric-report-health.md)
### [Troubleshoot with system health reports](service-fabric-understand-and-troubleshoot-with-system-health-reports.md)
### [View health reports](service-fabric-view-entities-aggregated-health.md)

## Monitor and diagnose
### Monitor and diagnose services locally
#### [Windows](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally.md)
#### [Linux](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally-linux.md)
### Azure Diagnostics logs
#### [Windows](service-fabric-diagnostics-how-to-setup-wad.md)
#### [Linux](service-fabric-diagnostics-how-to-setup-lad.md)
### [Service Fabric application trace](service-fabric-diagnostic-how-to-use-elasticsearch.md)
### [Diagnostics in Reliable Actors](service-fabric-reliable-actors-diagnostics.md)
### [Diagnostics in stateful Reliable Services](service-fabric-reliable-services-diagnostics.md)
### [Troubleshoot your local cluster](service-fabric-troubleshoot-local-cluster-setup.md)
### [Troubleshoot common issues](service-fabric-diagnostics-troubleshoot-common-scenarios.md)

## Scale applications
### [Partition Reliable Services](service-fabric-concepts-partitioning.md)
### [Availability of services](service-fabric-availability-services.md)
### [Scale applications](service-fabric-concepts-scalability.md)
### [Plan capacity of applications](service-fabric-capacity-planning.md)

## Test applications and services
### [Fault Analysis overview](service-fabric-testability-overview.md)
### [Test service to service communication](service-fabric-testability-scenarios-service-communication.md)
### Simulate failures
#### [Using controlled Chaos](service-fabric-controlled-chaos.md)
#### [Using Test actions](service-fabric-testability-actions.md)
#### [During workloads](service-fabric-testability-workload-tests.md)
#### [By invoking data loss](service-fabric-use-data-loss-api.md)
#### [Using Test scenarios](service-fabric-testability-scenarios.md)
### [Load test your application](service-fabric-vso-load-test.md)

# Reference
## [Reliable Actors managed reference](https://go.microsoft.com/fwlink/p/?linkid=833398)
## [Reliable Actors WCF managed reference](https://go.microsoft.com/fwlink/p/?linkid=833401)
## [Reliable Services managed reference](https://go.microsoft.com/fwlink/p/?linkid=833402)
## [Reliable Services WCF managed reference](https://go.microsoft.com/fwlink/p/?linkid=833403)
## [Data managed reference](https://go.microsoft.com/fwlink/p/?linkid=833404)
## [Data Interfaces managed reference](https://go.microsoft.com/fwlink/p/?linkid=833406)
## [System managed reference](https://go.microsoft.com/fwlink/p/?linkid=833407)
## [PowerShell reference](https://go.microsoft.com/fwlink/p/?linkid=833408)
## [REST API reference](https://go.microsoft.com/fwlink/p/?LinkID=532910)
## [Java API Reference](https://go.microsoft.com/fwlink/p/?linkid=833410)
## [Sample code](http://aka.ms/servicefabricsamples)