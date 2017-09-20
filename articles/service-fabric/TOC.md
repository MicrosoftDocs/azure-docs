# [Service Fabric Documentation](/azure/service-fabric)
# Overview
## [What is Service Fabric?](service-fabric-overview.md)

# Quickstarts
## [Create .NET application](service-fabric-quickstart-dotnet.md)
## [Deploy a Windows container application](service-fabric-quickstart-containers.md)
## [Deploy a Linux container application](service-fabric-quickstart-containers-linux.md)

# Tutorials
## Deploy a .NET app
### [1- Build a .NET application](service-fabric-tutorial-create-dotnet-app.md)
### [2- Deploy the application](service-fabric-tutorial-deploy-app-to-party-cluster.md)
### [3- Configure CI/CD](service-fabric-tutorial-deploy-app-with-cicd-vsts.md)

## Containerize an existing .NET app
### [1- Create a secure cluster on Azure](service-fabric-tutorial-create-cluster-azure-ps.md)
### [2- Deploy a .NET app using Docker Compose](service-fabric-host-app-in-a-container.md)

# Samples
## [Code samples](https://azure.microsoft.com/en-us/resources/samples/?service=service-fabric)
## [PowerShell](service-fabric-powershell-samples.md)
## [Service Fabric CLI](samples-cli.md)
# Concepts
## [Understand microservices](service-fabric-overview-microservices.md)
## [Big picture](service-fabric-content-roadmap.md)
## [Application scenarios](service-fabric-application-scenarios.md)
## [Patterns and scenarios](service-fabric-patterns-and-scenarios.md)
## [Architecture](service-fabric-architecture.md)
## [Terminology](service-fabric-technical-overview.md)

## Build applications and services
### Supported programming models
#### [Overview](service-fabric-choose-framework.md)
#### Containers
##### [Overview](service-fabric-containers-overview.md)
##### [Docker compose (preview)](service-fabric-docker-compose.md)
##### [Resource governance](service-fabric-resource-governance.md)
#### Reliable Services
##### [Overview](service-fabric-reliable-services-introduction.md)
##### [Reliable Services lifecycle - C#](service-fabric-reliable-services-lifecycle.md)
##### [Reliable Services lifecycle - Java](service-fabric-reliable-services-lifecycle-java.md)
##### [Reliable Collections](service-fabric-reliable-services-reliable-collections.md)
##### [Reliable Collection guidelines & recommendations](service-fabric-reliable-services-reliable-collections-guidelines.md)
##### [Working with Reliable Collections](service-fabric-work-with-reliable-collections.md)
##### [Transactions and locks](service-fabric-reliable-services-reliable-collections-transactions-locks.md)
##### [Reliable Concurrent Queue](service-fabric-reliable-services-reliable-concurrent-queue.md)
##### [Reliable Collection serialization](service-fabric-reliable-services-reliable-collections-serialization.md)
##### [Reliable State Manager and Reliable Collection internals](service-fabric-reliable-services-reliable-collections-internals.md)
##### [Advanced usage](service-fabric-reliable-services-advanced-usage.md)

#### Reliable Actors
##### [Overview](service-fabric-reliable-actors-introduction.md)
##### [Architecture](service-fabric-reliable-actors-platform.md)
##### [Lifecycle and garbage collection](service-fabric-reliable-actors-lifecycle.md)
##### [State management](service-fabric-reliable-actors-state-management.md)
##### [Polymorphism](service-fabric-reliable-actors-polymorphism.md)
##### [Reentrancy](service-fabric-reliable-actors-reentrancy.md)
##### [Type serialization](service-fabric-reliable-actors-notes-on-actor-type-serialization.md)

### [Application model](service-fabric-application-model.md)
### [Hosting model](service-fabric-hosting-model.md)

### Services
#### [Service resources](service-fabric-service-manifest-resources.md)
#### [Service state](service-fabric-concepts-state.md)
#### [Service partitioning](service-fabric-concepts-partitioning.md)
#### [Availability of services](service-fabric-availability-services.md)
#### Service communication
##### [Overview](service-fabric-connect-and-communicate-with-services.md)
##### [DNS service](service-fabric-dnsservice.md)
##### [Reverse proxy](service-fabric-reverseproxy.md)
##### [Configure reverse proxy for secure communication](service-fabric-reverseproxy-configure-secure-communication.md)
##### [Reverse proxy diagnostics](service-fabric-reverse-proxy-diagnostics.md)
### [Scalability of applications](service-fabric-concepts-scalability.md)
### [ASP.NET Core](service-fabric-reliable-services-communication-aspnetcore.md)

### [Plan application capacity](service-fabric-capacity-planning.md)

## Manage applications
### [Overview](service-fabric-application-lifecycle.md)
### [The ImageStoreConnectionString setting](service-fabric-image-store-connection-string.md)
### Application upgrade
#### [Overview](service-fabric-application-upgrade.md)
#### [Configuration](service-fabric-visualstudio-configure-upgrade.md)
#### [Application upgrade parameters](service-fabric-application-upgrade-parameters.md)
#### [Data serialization in application upgrades](service-fabric-application-upgrade-data-serialization.md)
#### [Application upgrades advanced topics](service-fabric-application-upgrade-advanced.md)
### [Fault analysis overview](service-fabric-testability-overview.md)

## Create and manage clusters
### [Overview](service-fabric-deploy-anywhere.md)
### [Service Fabric on Linux](service-fabric-linux-overview.md)
### Plan and prepare
#### [Capacity planning](service-fabric-cluster-capacity.md)
#### [Disaster recovery](service-fabric-disaster-recovery.md)
### [Describing a cluster](service-fabric-cluster-resource-manager-cluster-description.md)
### [Cluster security](service-fabric-cluster-security.md)
### [Feature differences between Linux and Windows](service-fabric-linux-windows-differences.md)
### Clusters on Azure
#### [Node types and VM Scale Sets](service-fabric-cluster-nodetypes.md)
#### [Cluster networking patterns](service-fabric-patterns-networking.md)
### Cluster resource manager
#### [Overview](service-fabric-cluster-resource-manager-introduction.md)
#### [Architecture](service-fabric-cluster-resource-manager-architecture.md)
#### [Describe a cluster](service-fabric-cluster-resource-manager-cluster-description.md)
#### [Application groups overview](service-fabric-cluster-resource-manager-application-groups.md)
#### [Configure Cluster Resource Manager settings](service-fabric-cluster-resource-manager-configure-services.md)
#### [Resource consumption metrics](service-fabric-cluster-resource-manager-metrics.md)
#### [Use service affinity](service-fabric-cluster-resource-manager-advanced-placement-rules-affinity.md)
#### [Service placement policies](service-fabric-cluster-resource-manager-advanced-placement-rules-placement-policies.md)
#### [Manage a cluster](service-fabric-cluster-resource-manager-management-integration.md)
#### [Cluster defragmentation](service-fabric-cluster-resource-manager-defragmentation-metrics.md)
#### [Balance a cluster](service-fabric-cluster-resource-manager-balancing.md)
#### [Throttling](service-fabric-cluster-resource-manager-advanced-throttling.md)
#### [Service movement](service-fabric-cluster-resource-manager-movement-cost.md)

## [Integrate with API Management](service-fabric-api-management-overview.md)

## Monitor and diagnose
### [Overview](service-fabric-diagnostics-overview.md)
### [Health model](service-fabric-health-introduction.md)
### [Diagnostics in stateful Reliable Services](service-fabric-reliable-services-diagnostics.md)
### [Diagnostics in Reliable Actors](service-fabric-reliable-actors-diagnostics.md)
### [Performance counters for Reliable Service Remoting](service-fabric-reliable-serviceremoting-diagnostics.md)

# How-to guides
## Set up your development environment
### [Windows](service-fabric-get-started.md)
### [Linux](service-fabric-get-started-linux.md)
### [Mac OS](service-fabric-get-started-mac.md)

## Build an application
### [Create your first C# app in Visual Studio](service-fabric-create-your-first-application-in-visual-studio.md)
### Build a guest executable service
#### [Host a Node.js application on Windows](quickstart-guest-app.md)
#### [Deploy a guest executable](service-fabric-deploy-existing-app.md)
#### [Deploy multiple guest executables](service-fabric-deploy-multiple-apps.md)
### Build a container service
#### [Create a Windows container application](service-fabric-get-started-containers.md)
#### [Create a Linux container application](service-fabric-get-started-containers-linux.md)
#### [Container security](service-fabric-securing-containers.md)
#### [Docker compose (preview)](service-fabric-docker-compose.md)
#### [Resource governance for containers and services](service-fabric-resource-governance.md)
#### [Volume and logging drivers](service-fabric-containers-volume-logging-drivers.md)
#### [Services inside containers](service-fabric-services-inside-containers.md)
#### [Container networking modes](service-fabric-networking-modes.md)

### Build a Reliable Services service
#### [Overview](service-fabric-reliable-services-introduction.md)
#### Concepts
##### [Reliable Services lifecycle - C#](service-fabric-reliable-services-lifecycle.md)
##### [Reliable Services lifecycle - Java](service-fabric-reliable-services-lifecycle-java.md)

#### Reliable Collections
##### [Reliable Collections](service-fabric-reliable-services-reliable-collections.md)
##### [Reliable Collection guidelines & recommendations](service-fabric-reliable-services-reliable-collections-guidelines.md)
##### [Working with Reliable Collections](service-fabric-work-with-reliable-collections.md)
##### [Transactions and locks](service-fabric-reliable-services-reliable-collections-transactions-locks.md)
##### [Reliable Concurrent Queue](service-fabric-reliable-services-reliable-concurrent-queue.md)
##### [Reliable Collection serialization](service-fabric-reliable-services-reliable-collections-serialization.md)
##### [Reliable State Manager and Reliable Collection internals](service-fabric-reliable-services-reliable-collections-internals.md)

#### Get started
##### [C# on Windows](service-fabric-reliable-services-quick-start.md)
##### [Java on Linux](service-fabric-reliable-services-quick-start-java.md)
##### [Create C# application on Linux](service-fabric-create-your-first-linux-application-with-csharp.md)
#### Communicate with services
##### [Communicate with Reliable Services](service-fabric-reliable-services-communication.md)

##### [Service Remoting - C#](service-fabric-reliable-services-communication-remoting.md)
##### [Service Remoting - Java](service-fabric-reliable-services-communication-remoting-java.md)
##### [WCF](service-fabric-reliable-services-communication-wcf.md)
##### [Secure communications - C#](service-fabric-reliable-services-secure-communication.md)
##### [Secure communications - Java](service-fabric-reliable-services-secure-communication-java.md)

#### [Configure](service-fabric-reliable-services-configuration.md)
#### [Send notifications](service-fabric-reliable-services-notifications.md)
#### [Backup and restore](service-fabric-reliable-services-backup-restore.md)

### Build a Reliable Actors service
#### Get started
##### [C# on Windows](service-fabric-reliable-actors-get-started.md)
##### [Java on Linux](service-fabric-reliable-actors-get-started-java.md)
##### [Java Actor on Linux](service-fabric-create-your-first-linux-application-with-java.md)
#### [Send notifications](service-fabric-reliable-actors-events.md)
#### [Set timers and reminders](service-fabric-reliable-actors-timers-reminders.md)
#### [Configure KvsActorStateProvider](service-fabric-reliable-actors-kvsactorstateprovider-configuration.md)
#### [Configure communications settings](service-fabric-reliable-actors-fabrictransportsettings.md)
#### [Configure ReliableDictionaryActorStateProvider](service-fabric-reliable-actors-reliabledictionarystateprovider-configuration.md)

### [Migrate old Java Application to support Maven](service-fabric-migrate-old-javaapp-to-use-maven.md)

### [Configure reverse proxy for secure communication](service-fabric-reverseproxy-configure-secure-communication.md)

### [Build an ASP.NET Core service](service-fabric-add-a-web-frontend.md)

### Configure security
#### [Manage application secrets](service-fabric-application-secret-management.md)  
#### [Configure security policies for your application](service-fabric-application-runas-security.md)

## Work in a Windows dev environment
### [Manage applications in Visual Studio](service-fabric-manage-application-in-visual-studio.md)
### [Configure secure connections in Visual Studio](service-fabric-visualstudio-configure-secure-connections.md)
### [Configure your application for multiple environments](service-fabric-manage-multiple-environment-app-configuration.md)
### [Debug a .NET service in VS](service-fabric-debugging-your-application.md)
### [Common errors and exceptions](service-fabric-errors-and-exceptions.md)
### [Monitor and diagnose locally](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally.md)

## Work in a Linux dev environment
### [Get started with Eclipse plugin for Java development](service-fabric-get-started-eclipse.md)
### [Debug a Java service in Eclipse](service-fabric-debugging-your-application-java.md)
### [Monitor and diagnose locally](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally-linux.md)

## [Deploy API Management and Service Fabric to Azure](service-fabric-api-management-quick-start.md)

## Migrate from Cloud Services
### [Compare Cloud Services with Service Fabric](service-fabric-cloud-services-migration-differences.md)
### [Migrate to Service Fabric](service-fabric-cloud-services-migration-worker-role-stateless-service.md)
### [Recommended practices](/azure/architecture/service-fabric/migrate-from-cloud-services)

## Manage application lifecycle
### [Package an application](service-fabric-package-apps.md)

### Deploy or remove applications
#### [Deploy applications on a local cluster](service-fabric-get-started-with-a-local-cluster.md)
#### [PowerShell](service-fabric-deploy-remove-applications.md)
#### [Service Fabric CLI](service-fabric-application-lifecycle-sfctl.md)
#### [Visual Studio](service-fabric-publish-app-remote-cluster.md)
#### [FabricClient APIs](service-fabric-deploy-remove-applications-fabricclient.md)

### Upgrade applications
#### [Upgrade using PowerShell](service-fabric-application-upgrade-tutorial-powershell.md)
#### [Upgrade using Visual Studio](service-fabric-application-upgrade-tutorial.md)
#### [Troubleshoot application upgrades](service-fabric-application-upgrade-troubleshooting.md)

### Test applications and services
#### [Test service-to-service communication](service-fabric-testability-scenarios-service-communication.md)
#### Simulate failures
##### [Using controlled chaos](service-fabric-controlled-chaos.md)
##### [Using test actions](service-fabric-testability-actions.md)
##### [During workloads](service-fabric-testability-workload-tests.md)
##### [Using test scenarios](service-fabric-testability-scenarios.md)
##### [Using the node transition APIs](service-fabric-node-transition-apis.md)
#### [Load test your application](service-fabric-vso-load-test.md)

### Set up continuous integration
#### [Set up continuous integration with VSTS](service-fabric-set-up-continuous-integration.md)
#### [Deploy your Linux Java application using Jenkins](service-fabric-cicd-your-linux-java-application-with-jenkins.md)

## Create and manage clusters
### Clusters on Azure
#### Create
##### [Create your first cluster on Azure](service-fabric-get-started-azure-cluster.md)
##### [Azure portal](service-fabric-cluster-creation-via-portal.md)
##### [Azure Resource Manager](service-fabric-cluster-creation-via-arm.md)
#### Scale
##### [Manually](service-fabric-cluster-scale-up-down.md)
##### [Programmatically](service-fabric-cluster-programmatic-scaling.md)
#### [Upgrade](service-fabric-cluster-upgrade.md)
#### [Set access control](service-fabric-cluster-security-roles.md)
#### [Configure](service-fabric-cluster-fabric-settings.md)
#### [Open a port in the load balancer](create-load-balancer-rule.md)
#### [Manage cluster certificates](service-fabric-cluster-security-update-certs-azure.md)
#### [Delete](service-fabric-cluster-delete.md)

### Standalone clusters
#### [Plan and prepare for your deployment](service-fabric-cluster-standalone-deployment-preparation.md)
#### Create
##### [Create your first standalone cluster](service-fabric-get-started-standalone-cluster.md)
##### [Create on-premises](service-fabric-cluster-creation-for-windows-server.md)
##### [Secure using certs](service-fabric-windows-cluster-x509-security.md)  
##### [Secure using Windows security](service-fabric-windows-cluster-windows-security.md)
##### [Contents of the standalone package](service-fabric-cluster-standalone-package-contents.md)
#### [Scale](service-fabric-cluster-windows-server-add-remove-nodes.md)
#### [Set access control](service-fabric-cluster-security-roles.md)
#### [Configure](service-fabric-cluster-manifest.md)
#### [Upgrade](service-fabric-cluster-upgrade-windows-server.md)

### [Visualize a cluster](service-fabric-visualizing-your-cluster.md)
### [Connect to a secure cluster](service-fabric-connect-to-secure-cluster.md)

### [Getting started with Service Fabric CLI](service-fabric-cli.md)
### [Patch cluster nodes](service-fabric-patch-orchestration-application.md)

### Manage and orchestrate cluster resources
#### [Cluster Resource Manager overview](service-fabric-cluster-resource-manager-introduction.md)
#### [Cluster Resource Manager architecture](service-fabric-cluster-resource-manager-architecture.md)
#### [Describe a cluster](service-fabric-cluster-resource-manager-cluster-description.md)
#### [Application groups overview](service-fabric-cluster-resource-manager-application-groups.md)
#### [Configure Cluster Resource Manager settings](service-fabric-cluster-resource-manager-configure-services.md)
#### [Resource consumption metrics](service-fabric-cluster-resource-manager-metrics.md)
#### [Use service affinity](service-fabric-cluster-resource-manager-advanced-placement-rules-affinity.md)
#### [Service placement policies](service-fabric-cluster-resource-manager-advanced-placement-rules-placement-policies.md)
#### [Manage a cluster](service-fabric-cluster-resource-manager-management-integration.md)
#### [Cluster defragmentation](service-fabric-cluster-resource-manager-defragmentation-metrics.md)
#### [Balance a cluster](service-fabric-cluster-resource-manager-balancing.md)
#### [Throttling](service-fabric-cluster-resource-manager-advanced-throttling.md)
#### [Service movement](service-fabric-cluster-resource-manager-movement-cost.md)

## Monitor and diagnose
### [Monitor and diagnose applications](service-fabric-diagnostics-overview.md)
### Generate events
#### [Generate platform level events](service-fabric-diagnostics-event-generation-infra.md)
##### [Operational channel](service-fabric-diagnostics-event-generation-operational.md)
##### [Reliable Services events](service-fabric-reliable-services-diagnostics.md)
##### [Reliable Actors events](service-fabric-reliable-actors-diagnostics.md)
##### [Performance metrics](service-fabric-diagnostics-event-generation-perf.md)
#### [Generate application level events](service-fabric-diagnostics-event-generation-app.md)
### Inspect application and cluster health
#### [Monitor Service Fabric health](service-fabric-health-introduction.md)
#### [Report and check service health](service-fabric-diagnostics-how-to-report-and-check-service-health.md)
#### [Add custom health reports](service-fabric-report-health.md)
#### [Troubleshoot with system health reports](service-fabric-understand-and-troubleshoot-with-system-health-reports.md)
#### [View health reports](service-fabric-view-entities-aggregated-health.md)
#### [Monitor Windows Server containers](service-fabric-diagnostics-containers-windowsserver.md)
### Aggregate events
#### [Aggregate events with EventFlow](service-fabric-diagnostics-event-aggregation-eventflow.md)
#### Aggregate events with Azure Diagnostics
##### [Windows](service-fabric-diagnostics-event-aggregation-wad.md)
##### [Linux](service-fabric-diagnostics-event-aggregation-lad.md)
### Analyze events
#### [Analyze events with Application Insights](service-fabric-diagnostics-event-analysis-appinsights.md)
#### [Analyze events with OMS](service-fabric-diagnostics-event-analysis-oms.md)
### [Troubleshoot your local cluster](service-fabric-troubleshoot-local-cluster-setup.md)

# Reference
## [PowerShell (Azure)](/powershell/module/azurerm.servicefabric/)
## [PowerShell](/powershell/module/servicefabric/?view=azureservicefabricps)
## [Azure CLI](/cli/azure/sf)
## [Java API](/java/api/overview/azure/servicefabric)
## [.NET](/dotnet/api/overview/azure/service-fabric?view=azure-dotnet)
## [REST](/rest/api/servicefabric)

# Resources
## [Azure Roadmap](https://azure.microsoft.com/roadmap/)
## [Common questions](service-fabric-common-questions.md)
## [Learning path](https://azure.microsoft.com/documentation/learning-paths/service-fabric/)
## [MSDN Forum](https://social.msdn.microsoft.com/Forums/home?forum=AzureServiceFabric)
## [Pricing](https://azure.microsoft.com/pricing/details/service-fabric/)
## [Pricing calculator](https://azure.microsoft.com/pricing/calculator/)
## [Sample code](http://aka.ms/servicefabricsamples)
## [Support options](service-fabric-support.md)
## [Service Updates](https://azure.microsoft.com/updates/?product=service-fabric)
## [Videos](https://azure.microsoft.com/documentation/videos/index/?services=service-fabric)
