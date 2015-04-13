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
   ms.date="02/18/2015"
   ms.author="ryanwi"/>

# Working List of WinFabric/PaaS v2 Content
We will not be publishing this topic.  The ACOM landing page, learning map, and left-hand navigation TOCs will be built from this content.
## About
[Technical Overview](../service-fabric-technical-overview)- Combines elements of what is, features and capabilities, key concepts: Cluster, nodes, applications, services, Programming models. **owner: Mark**

Learning Map P2 **owner:Andy**

[Application Scenarios](../service-fabric-application-scenarios) **owners: mark**

PaaS v2 compared to other things(?)- short blurb, point to competitive analysis topics **owner: claudio**

PaaS v2 vs Cloud Services- PaaS v2 is so much better, technical comparison. Is this really technical marketing info? **owner: mark**

## Getting Started
Sign Up for a Free Account  **owner: Vas**

Install the Development Runtime, SDK, and VS Tools **owner: Sean**

Run HelloWorld Quick Start- Deploy Locally, Test, Deploy to Cloud **owner: Sean**

Install and extend the Samples **owner: Vas**


## Work with Applications and Services- task oriented, just enough conceptual info to perform a task.  Links to Further Reading sections.

### Develop a Service owner: Vas

How to Choose a Programming Model- need decision making info here

How to Create a Stateful Application **owner: Haishi** 

How to Create a Stateless Application **owner: Haishi** 

How to Create an ASP.NET v5 Application **owner: Haishi**

Create Windows Fabric Stateful  applications using .NET Distributed Collections (C#)

Create Stateless and Stateful applications using .NET Actor Framework  (volatile, durable stateful)

Communicate with a Service

### Configure a Service Manifest P2  owner: Vas
more advanced configuration stuff

### Migrate an existing Cloud Service to PaaS v2 owner: Haishi

### Configure an Application Manifest P2 owner: Vas
more advanced configuration stuff

### Package and Deploy an Application P2 owner: Vas
Package and deploy using VS. Explain VS template.

Package and deploy using Cmdlets

How to Create an Application Instance (PowerShell)

How to Create a Service Instance (PowerShell)

More advanced conceptual topics, this handled by VS

### Test a Service owner: Vas
How To Remove a Service and Application (PowerShell)

How to Run the Failover Test Scenario (PowerShell)

How to Run the Chaos Test Scenario

How to Run the Chaos Test Scenario (PowerShell)

### Upgrading your Application owner: Mani

a.      Sample Walkthrough

b.      Upgrade Modes: 

            i.       Automatic (MonitoredAuto)
            
            ii.      Manual (MonitoredManual)
            
c.      Upgrade Concepts & Parameters

             i.     Commonly Used
             
            ii.     Advanced
            
d.      Troubleshooting Application Upgrades (Alex/Chacko)

### Scale Services and Partitions owner: Vas

### Diagnose and Troubleshoot an Application owner: Kunal
How to write application and system events as ETW

How to configure WAD to collect logs and crash dumps

How to view events in VS during one-box development

How to configure Application Insights in VS for perf monitoring and telemetry

 
### Query and Evaluate Application, Service, Partition, Replica Health owner: Kunal

How to Query Health State and Events (PowerShell)

### Add/Remove Services from Applications P2 owner: Vas
 
### Remove an Application owner: Vas
How to Remove an Application in Visual Studio

How to Remove an Application

How To Remove a Service and Application (PowerShell)

## Work with Clusters- task oriented, just enough conceptual info to perform a task.  Links to Further Reading sections. (Phosphorus)

### Plan for Capacity owner: chacko (phosphorus)

### Choose a Security Model for a Cluster and Clients owner: mark (phosphorus)

### Create/configure a cluster ARM document (phosphorus)
Create from template
 
### Deploy a Cluster (Phosphorus) owner: chacko

### Upgrade and Scale a Cluster (Phosphorus) owner: chacko

### Upgrade a Certificate (Phosphorus) owner: mark

### Diagnose and Troubleshoot a Cluster (Phosphorus) owner: kunal
 
### Query and Evaluate Cluster Health (Phosphorus) owner: kunal

### Delete a Cluster (Phosphorus) owner: chacko

## Reference
### Managed Reference
### PowerShell Reference
### REST Reference
### Application Manifest Schema and Settings P2
### Service Manifest Schema and Settings P2
### Cluster Manifest Schema and Settings (Phosphorus)

## Further Reading- Deep conceptual content, link back to Work with... topics
### Programming Models
 [Introduction to the Service Fabric Actor Model](../service-fabric-fabact-introduction) **owner: claudio**

 Distributed Collections  **owner: matt**

 State and Replica Management APIs

### PaaS v2 and Cloud Applications
### Applications, Services, Partitions, Replicas, and Replica Sets
### Cluster
### Service State
### Service Model
### Application and Service Types
### Health Model owner: kunal
### Names and Properties/Naming Service
### Image Store
### Monitoring and Diagnostics owner: kunal

### System Services 
Failover Manager Service

Cluster Manager Service

ImageStore Service

Naming Service
### Application Lifecyle  owner: matt
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

### Replicas and Replica Sets
Replica Role and State Lifetime

 Replication and State Consistency

 The Copy Process

 Epochs, LSNs, and Progress Vectors

### Service Host Activation and Deactivation

### FabricExplorer

### Glossary

