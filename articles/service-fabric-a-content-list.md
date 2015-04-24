<properties
   pageTitle="Scratch TOC- Don't Publish"
   description=""
   services="service-fabric"
   documentationCenter=".net"
   authors="rwike77"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="04/24/2015"
   ms.author="ryanwi"/>

# Working List of Service Fabric Content
We will not be publishing this topic.  The ACOM landing page, learning map, and left-hand navigation TOCs will be built from this content.
## About
- [Overview](service-fabric-overview.md) **owner: mfussell**

- [Technical Overview](service-fabric-technical-overview.md)- Combines elements of what is, features and capabilities, key concepts: Cluster, nodes, applications, services, Programming models. **owner: mfussell**

- [Application Scenarios](service-fabric-application-scenarios.md) **owners: mfussell**


## Getting Started

[Get started with Service Fabric](service-fabric-get-started.md)  **owner: seanmck**

## Work with Applications and Services- task oriented, just enough conceptual info to perform a task.  Links to Further Reading sections.

### Develop a Service owner: vturecek

- [Choose a Programming Model](service-fabric-choose-framework.md) **owner: seanmck**

- [Reliable Service Programming Model Quick Start](service-fabric-reliable-services-quick-start.md) **owner: masnider**

- [Reliable Actors Programming Model Quick Start](service-fabric-reliable-actors-get-started.md)

- [Reliable Services Programming Model Introduction](service-fabric-reliable-services-introduction.md) **owner: masnider**

- [Communicating with Services](service-fabric-connect-and-communicate-with-services.md) **owner: kunalds**

- [Reliable Services Programming Model Advanced Usage](service-fabric-reliable-services-advanced-usage.md) **owner: jesseb**

- [Communicating with services](service-fabric-connect-and-communicate-with-services.md) **owner: kunalds**

- [Secure replication traffic of stateful services](service-fabric-replication-security.md)  **owner: leikong**


### Tutorials

- [Microsoft Azure Service Fabric Application Basic Management](service-fabric-get-started-basic-management.md)  **owner: bmerrill**

- [Implement a Communication Listener using Web API](service-fabric-get-started-communication-listener-with-web-api.md) **owner: bmerrill**

- [Getting Started with Microsoft Azure Service Fabric Stateless Services](service-fabric-get-started-hello-world-stateless) **owner: vturecek**

- [Hello World with Actors](service-fabric-get-started-hello-world-with-actors.md) **owner: bmerrill**

- [Echo Service using Web API](service-fabric-get-started-echo-service-using-web-api.md) **owner: bmerrill**

- [Todo Service using Web API](service-fabric-get-started-todo-service-with-web-api.md) **owner: bmerrill**



### Test a Service owner: vturecek, rsinha
- [Testability Overview](service-fabric-testability-overview.md) - P1 **owner: vturecek**

- [Run an action](service-fabric-testability-actions.md)  **owner: vturecek**

- [Run a scenario](service-fabric-testability-scenarios.md) - P1 **owner: vturecek**

- [Service Fabric Testability Scenarios: Service Communication](service-fabric-testability-scenarios-service-communication.md) **owner: vturecek**

- [Simulate failures during service workloads](service-fabric-testability-workload-tests.md)  **owner: anmola**


### Monitoring and Diagnostics owners: kunalds, toddpf, oanapl
- [How to Monitor and Diagnose Services locally](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally.md) - **owner:kunalds**

- [Setting up Application Insights for your Service Fabric application](service-fabric-diagnostics-application-insights-setup.md) **owner:mattrow**

- [Troubleshoot your local development cluster setup](service-fabric-troubleshoot-local-cluster-setup.md)  **owner: seanmck**

### Package, Deploy and Remove an Application

- [Service Model](service-fabric-service-model.md)

- [Application Model](service-fabric-application-model.md)

- [Package an Application](service-fabric-application-model.md) **owner: alexwun**

- [Deploy and Remove an Application](service-fabric-deploy-remove-applications.md) **owner: alexwun**

### Upgrading your Application owner: Mani

- [Service Fabric Application Upgrade](service-fabric-application-upgrade.md) **owner: subramar**

- [Upgrade Parameters](service-fabric-application-upgrade-parameters.md) **owner: subramar**

- [Advanced Topics](service-fabric-application-upgrade-advanced.md) **owner: subramar**

- [Troubleshooting Application Upgrade Failures](service-fabric-application-upgrade-troubleshooting.md) **owner: subramar**

- [Application Upgrade Tutorial/Walkthrough](service-fabric-application-upgrade-tutorial.md) **owner: subramar**

- [Service Fabric Application Upgrade: Data Serialization](service-fabric-application-upgrade-data-serialization.md) **owner: jesseb**

- [Troubleshooting a failed application upgrade](service-fabric-application-monitored-upgrade-troubleshooting.md) **owner:alexwun**


## Reference
### Managed Reference
### PowerShell Reference
### REST Reference

## Further Reading- Deep conceptual content, link back to Work with... topics

### Application Lifecycle
[Application Lifecycle](service-fabric-application-lifecycle.md) **owner: matt**

### FabricExplorer
[Visualizing your cluster using Service Fabric Explorer](service-fabric-visualizing-your-cluster.md)

### Health
[Introduction to Service Fabric Health Monitoring](service-fabric-health-introduction.md) **owner: oanapl**

[How to view Service Fabric health reports](service-fabric-view-entities-aggregated-health.md)
**owner: oanapl**

[Using System health reports for troubleshooting](service-fabric-understand-and-troubleshoot-with-system-health-reports.md)
**owner: oanapl**

[Adding custom Service Fabric health reports](service-fabric-report-health.md)
**owner: oanapl**

### Programming Models Owners: masnider, claudioc, vipulm, richhas
#### Actors
- [Introduction to the Service Fabric Actor Model](service-fabric-reliable-actors-introduction.md) **owner: claudioc**

- [Actor lifecycle and Garbage Collection](service-fabric-reliable-actors-lifecycle.md) **owner: claudioc**

- [Actor Model Design Patterns](service-fabric-reliable-actors-patterns-introduction.md)  **owner: claudioc**

- [Pattern: Smart Cache](winfab-reliable-actors-pattern-smartcache.md) **owner: claudioc**

- [Pattern: Distributed Networks and Graphs](service-fabric-reliable-actors-pattern-distributed-networks-and-graphs.md) **owner: claudioc**

- [Pattern: Resource Governance](service-fabric-reliable-actors-pattern-resource-governance.md) **owner: claudioc**

- [Pattern: Stateful Service Composition](service-fabric-reliable-actors-pattern-stateful-service-composition.md) **owner: claudioc**

- [Pattern: Internet of Things](service-fabric-reliable-actors-pattern-internet-of-things.md) **owner: claudioc**

- [Pattern: Distributed Computation](service-fabric-reliable-actors-pattern-distributed-computation.md) **owner: claudioc**

- [Some Anti-patterns](service-fabric-reliable-actors-anti-patterns.md) **owner: claudioc**

- [Actor Events](service-fabric-reliable-actors-events.md) **owner: myamanbh**

- [Actor Reentrancy](service-fabric-reliable-actors-reentrancy.md) **owner: myamanbh**

- [Actor Timers](service-fabric-reliable-actors-timers-reminders.md) **owner: myamanbh**

- [Actor Diagnostics](service-fabric-reliable-actors-diagnostics.md) **abhisram**

- [KVSActorStateProvider Configuration](service-fabric-reliable-actors-KVSActorstateprovider-configuration.md) **owner: sumukhs**

- [ReliableDictionaryActorStateProvider Configuration](service-fabric-reliable-actors-ReliableDictionaryStateProvider-configuration.md) **owner: sumukhs**

#### Reliable Services
- [Programming Model Overview](service-fabric-reliable-services-introduction.md)  **owners: masnider, richhas**

- [Architecture](service-fabric-reliable-services-platform-architecture.md) **owner: alanwar**

- [Reliable Collections](service-fabric-reliable-services-reliable-collections.md) **owners: mcoskun, tyadam**

- [API Discussion](service-fabric-reliable-services-service-api-description.md) **owners: tyadam, mcoskun**

- [Operations](service-fabric-manage-application-in-visual-studio.md) **owner: jesseb, alanwar**

- [Stateful Reliable Service Diagnostics](service-fabric-reliable-services-diagnostics.md) **owner: **



## P2 conceptual topics
### Partitioning, Scaling, Service State

- [Partition Service Fabric services](service-fabric-concepts-partitioning.md) **owner: aprameyr**
- [Scaling Service Fabric Applications](service-fabric-concepts-scalability.md) **owner: aprameyr**
- [Service State](service-fabric-concepts-state.md) **owner: aprameyr**
- [Availability of Service Fabric services](service-fabric-availability-services.md) **owner: aprameyr**

### PaaS v2 and Cloud Applications
### Applications, Services, Partitions, Replicas, and Replica Sets
### Cluster

### Application and Service Types
### Names and Properties/Naming Service
### Image Store

### System Services
Failover Manager Service

Cluster Manager Service

ImageStore Service

Naming Service
### Cluster Lifecycle
### Management APIs
### Application Security
### Cluster and Client Security
 Node-to-Node Security

 Client-to-Node Security

### Resource Balancing a Cluster
Balancing Strategies

Describe the Cluster

Describe Services

Proactive Metric Packing

### PaaSv2 compared to other systems...

### Replicas and Replica Sets owners: *aprameyr*
Replica Role and State Lifetime

 Replication and State Consistency

 The Copy Process

 Epochs, LSNs, and Progress Vectors

### Service Host Activation and Deactivation

### Glossary

## P2 how to topics

### Configure a Service Manifest P2  owner: vturecek
more advanced configuration stuff

### Configure an Application Manifest P2 owner: vturecek
more advanced configuration stuff

### Package and Deploy an Application P2
Package and deploy using VS. Explain VS template. **owner: vturecek**

Package and deploy using Cmdlets **owner: vturecek**

Create an Application Instance (PowerShell) **owner: vturecek**

Create a Service Instance (PowerShell) **owner: vturecek**

More advanced conceptual topics, this handled by VS **owner: vturecek**

### Add/Remove Services from Applications P2 owner: vturecek

### Remove an Application owner: vturecek
Remove an Application in Visual Studio **owner: vturecek**

Remove an Application **owner: vturecek**

Remove a Service and Application (PowerShell) **owner: vturecek**
