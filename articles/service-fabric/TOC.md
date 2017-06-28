
# Overview
## [What is Service Fabric?](service-fabric-overview.md)
## [Understand microservices](service-fabric-overview-microservices.md)
## [Big picture](service-fabric-content-roadmap.md)
## [Application scenarios](service-fabric-application-scenarios.md)
## [Patterns and scenarios](service-fabric-patterns-and-scenarios.md)
## [Architecture](service-fabric-architecture.md)
## [Terminology](service-fabric-technical-overview.md)

# Get started
## Set up your development environment
### [Windows](service-fabric-get-started.md)
### [Linux](service-fabric-get-started-linux.md)
### [Mac OS](service-fabric-get-started-mac.md)
## Create your first application
### [C# on Windows](service-fabric-create-your-first-application-in-visual-studio.md)
### [Java on Linux](service-fabric-create-your-first-linux-application-with-java.md)
### [C# on Linux](service-fabric-create-your-first-linux-application-with-csharp.md)
## [Deploy apps on a local cluster](service-fabric-get-started-with-a-local-cluster.md)
## [Deploy .NET apps in a container](service-fabric-host-app-in-a-container.md)
## [Create your first cluster on Azure](service-fabric-get-started-azure-cluster.md)
## [Create your first standalone cluster](service-fabric-get-started-standalone-cluster.md)
## [Create your first container app](service-fabric-get-started-containers.md)

# How To
## Build an application
  
### Concepts
#### [Supported programming models](service-fabric-choose-framework.md)
#### [Application model](service-fabric-application-model.md)
#### [Hosting model](service-fabric-hosting-model.md)
#### [Service manifest resources](service-fabric-service-manifest-resources.md)
#### [Service state](service-fabric-concepts-state.md)
#### [Service partitioning](service-fabric-concepts-partitioning.md)
#### [Availability of services](service-fabric-availability-services.md)
#### [Scalability of applications](service-fabric-concepts-scalability.md)
#### [ASP.NET Core](service-fabric-reliable-services-communication-aspnetcore.md)

### [Plan app capacity](service-fabric-capacity-planning.md)

### Build a guest executable service
#### [Deploy a guest executable](service-fabric-deploy-existing-app.md)
#### [Deploy multiple guest executables](service-fabric-deploy-multiple-apps.md)

### Build a container service
#### [Overview](service-fabric-containers-overview.md)
#### [Deploy Windows container](service-fabric-deploy-container.md)
#### [Deploy Linux container](service-fabric-deploy-container-linux.md)
#### [Docker compose (preview)](service-fabric-docker-compose.md)
#### [Resource governance for containers and services](service-fabric-resource-governance.md)
#### [Volume and logging drivers](service-fabric-containers-volume-logging-drivers.md)

### Build a Reliable Service service
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

#### [Configure](service-fabric-reliable-services-configuration.md)
#### [Send notifications](service-fabric-reliable-services-notifications.md)
#### [Backup and restore](service-fabric-reliable-services-backup-restore.md)

#### Communicate with services
##### [Communicate with Reliable Services](service-fabric-reliable-services-communication.md)
##### [Service Remoting - C#](service-fabric-reliable-services-communication-remoting.md)
##### [Service Remoting - Java](service-fabric-reliable-services-communication-remoting-java.md)
##### [WCF](service-fabric-reliable-services-communication-wcf.md)
##### [Secure communications - C#](service-fabric-reliable-services-secure-communication.md)
##### [Secure communications - Java](service-fabric-reliable-services-secure-communication-java.md)

#### [Advanced usage](service-fabric-reliable-services-advanced-usage.md)

### Build a Reliable Actor service
#### [Overview](service-fabric-reliable-actors-introduction.md)
#### Concepts
##### [Architecture](service-fabric-reliable-actors-platform.md)
##### [Lifecycle and garbage collection](service-fabric-reliable-actors-lifecycle.md)
##### [State management](service-fabric-reliable-actors-state-management.md)
##### [Polymorphism](service-fabric-reliable-actors-polymorphism.md)
##### [Reentrancy](service-fabric-reliable-actors-reentrancy.md)
##### [Type serialization](service-fabric-reliable-actors-notes-on-actor-type-serialization.md)

#### Get started
##### [C# on Windows](service-fabric-reliable-actors-get-started.md)
##### [Java on Linux](service-fabric-reliable-actors-get-started-java.md)

#### [Send notifications](service-fabric-reliable-actors-events.md) 
#### [Set timers and reminders](service-fabric-reliable-actors-timers-reminders.md)
#### [Configure KvsActorStateProvider](service-fabric-reliable-actors-kvsactorstateprovider-configuration.md)
#### [Configure communications settings](service-fabric-reliable-actors-fabrictransportsettings.md) 
#### [Configure ReliableDictionaryActorStateProvider](service-fabric-reliable-actors-reliabledictionarystateprovider-configuration.md)

### Communicate with services
#### [Service communication](service-fabric-connect-and-communicate-with-services.md)
#### [DNS service](service-fabric-dnsservice.md)
#### [Reverse proxy](service-fabric-reverseproxy.md)
#### [Configure reverse proxy for secure communication](service-fabric-reverseproxy-configure-secure-communication.md)

### [Add a web front end](service-fabric-add-a-web-frontend.md)

### Work in an IDE
#### [Get started with Eclipse plugin for Java development](service-fabric-get-started-eclipse.md)
#### [Manage apps in Visual Studio](service-fabric-manage-application-in-visual-studio.md)
#### [Configure secure connections in Visual Studio](service-fabric-visualstudio-configure-secure-connections.md)
#### [Configure your application for multiple environments](service-fabric-manage-multiple-environment-app-configuration.md)

### Configure security
#### [Manage application secrets](service-fabric-application-secret-management.md)  
#### [Configure security policies for your application](service-fabric-application-runas-security.md)

### Debug
#### [Debug a C# service in VS](service-fabric-debugging-your-application.md)
#### [Debug a Java service in Eclipse](service-fabric-debugging-your-application-java.md)
#### [Common errors and exceptions](service-fabric-errors-and-exceptions.md)

### Monitor and diagnose locally
#### [Windows](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally.md)
#### [Linux](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally-linux.md)

### Integrate with API Management
#### [Overview](service-fabric-api-management-overview.md)
#### [Quick start](service-fabric-api-management-quick-start.md)

### Migrate from Cloud Services
#### [Compare Cloud Services with Service Fabric](service-fabric-cloud-services-migration-differences.md)
#### [Migrate to Service Fabric](service-fabric-cloud-services-migration-worker-role-stateless-service.md)
#### [Recommended practices](/azure/architecture/service-fabric/migrate-from-cloud-services)

## Manage application lifecycle
### [Overview](service-fabric-application-lifecycle.md)
### [Package an application](service-fabric-package-apps.md)
### [Understand the ImageStoreConnectionString setting](service-fabric-image-store-connection-string.md)
### Deploy or remove applications
#### [PowerShell](service-fabric-deploy-remove-applications.md)
#### [Visual Studio](service-fabric-publish-app-remote-cluster.md)
#### [FabricClient APIs](service-fabric-deploy-remove-applications-fabricclient.md)
### Upgrade an application
#### [Overview](service-fabric-application-upgrade.md)
#### [Configure application upgrade](service-fabric-visualstudio-configure-upgrade.md)
#### [Application upgrade parameters](service-fabric-application-upgrade-parameters.md)
#### Upgrade
##### [PowerShell](service-fabric-application-upgrade-tutorial-powershell.md)
##### [Visual Studio](service-fabric-application-upgrade-tutorial.md)
#### [Troubleshoot application upgrades](service-fabric-application-upgrade-troubleshooting.md)
#### [Data serialization in application upgrades](service-fabric-application-upgrade-data-serialization.md)
#### [Application upgrades advanced topics](service-fabric-application-upgrade-advanced.md)

### Test applications and services
#### [Fault analysis overview](service-fabric-testability-overview.md)
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
#### [Deploy your Linux Java app using Jenkins](service-fabric-cicd-your-linux-java-application-with-jenkins.md)

## Create and manage clusters

### [Overview](service-fabric-deploy-anywhere.md)
### Concepts
#### [Describe a cluster](service-fabric-cluster-resource-manager-cluster-description.md)
#### [Cluster security](service-fabric-cluster-security.md)
#### [Feature differences between Linux and Windows](service-fabric-linux-windows-differences.md)

### Plan and prepare
#### [Capacity planning](service-fabric-cluster-capacity.md)
#### [Disaster recovery](service-fabric-disaster-recovery.md)

### Clusters on Azure
#### Concepts
##### [Node types and VM Scale Sets](service-fabric-cluster-nodetypes.md)
##### [Cluster networking patterns](service-fabric-patterns-networking.md)
#### Create 
##### [Azure portal](service-fabric-cluster-creation-via-portal.md)
##### [Azure Resource Manager](service-fabric-cluster-creation-via-arm.md)
##### [Visual Studio and Azure Resource Manager](service-fabric-cluster-creation-via-visual-studio.md)
#### Scale 
##### [Manually](service-fabric-cluster-scale-up-down.md)
##### [Programmatically](service-fabric-cluster-programmatic-scaling.md)
#### [Upgrade](service-fabric-cluster-upgrade.md)
#### [Set access control](service-fabric-cluster-security-roles.md)
#### [Configure](service-fabric-cluster-fabric-settings.md)
#### [Manage cluster certificates](service-fabric-cluster-security-update-certs-azure.md) 
#### [Delete](service-fabric-cluster-delete.md)

### Standalone clusters
#### [Plan and prepare for your deployment](service-fabric-cluster-standalone-deployment-preparation.md)
#### Create
##### [Create on-premises](service-fabric-cluster-creation-for-windows-server.md)
##### [Create on Azure virtual machines](service-fabric-cluster-creation-with-windows-azure-vms.md)
##### [Secure using certs](service-fabric-windows-cluster-x509-security.md)  
##### [Secure using Windows security](service-fabric-windows-cluster-windows-security.md)
##### [Contents of the standalone package](service-fabric-cluster-standalone-package-contents.md)
#### [Scale](service-fabric-cluster-windows-server-add-remove-nodes.md)
#### [Set access control](service-fabric-cluster-security-roles.md)
#### [Configure](service-fabric-cluster-manifest.md)
#### [Upgrade](service-fabric-cluster-upgrade-windows-server.md) 

### [Visualize a cluster](service-fabric-visualizing-your-cluster.md)
### [Connect to a secure cluster](service-fabric-connect-to-secure-cluster.md)

### [Manage a cluster using Azure CLI](service-fabric-azure-cli.md)
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
#### [Generate infrastructure level events](service-fabric-diagnostics-event-generation-infra.md)
##### [Reliable Services events](service-fabric-reliable-services-diagnostics.md)
##### [Reliable Actors events](service-fabric-reliable-actors-diagnostics.md)
#### [Generate application level events](service-fabric-diagnostics-event-generation-app.md)
### Inspect application and cluster health
#### [Monitor Service Fabric health](service-fabric-health-introduction.md)
#### [Report and check service health](service-fabric-diagnostics-how-to-report-and-check-service-health.md)
#### [Add custom health reports](service-fabric-report-health.md)
#### [Troubleshoot with system health reports](service-fabric-understand-and-troubleshoot-with-system-health-reports.md)
#### [View health reports](service-fabric-view-entities-aggregated-health.md)
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
## [.NET](/dotnet/api/overview/azure/servicefabric?view=azure-dotnet)
## [REST](/rest/api/servicefabric)

# Resources
## [Azure Roadmap](https://azure.microsoft.com/roadmap/)
## [Common questions about Service Fabric](service-fabric-common-questions.md)
## [Learning path](https://azure.microsoft.com/documentation/learning-paths/service-fabric/)
## [MSDN Forum](https://social.msdn.microsoft.com/Forums/home?forum=AzureServiceFabric)
## [Pricing](https://azure.microsoft.com/pricing/details/service-fabric/)
## [Sample code](http://aka.ms/servicefabricsamples)
## [Service Fabric support options](service-fabric-support.md)
## [Service Updates](https://azure.microsoft.com/updates/?product=service-fabric)
## [Videos](https://azure.microsoft.com/documentation/videos/index/?services=service-fabric)
