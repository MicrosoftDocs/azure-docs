# Working List of WinFabric/PaaS v2 Content
We will not be publishing this topic.  The ACOM landing page, learning map, and left-hand navigation TOCs will be built from this content.
## About
[Technical Overview](../winfab-technical-overview)- Combines elements of what is, features and capabilities, key concepts: Cluster, nodes, applications, services, Programming models. **owner: Mark**

Learning Map P2 **owner:Andy**

[Application Scenarios](../winfab-application-scenarios) **owners: mark**

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

DPE tutorials- stateless, stateful, ASP.NET 

Create Windows Fabric Stateless applications 

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

### Upgrade an Application owner: Vas
How to Perform an Un-monitored Automatic Application Upgrade

How to Perform a Monitored Automatic Application Upgrade

How to Perform an Un-monitored Manual Application Upgrade

How to Upgrade an Application (PowerShell)

### Scale Services and Partitions owner: Vas

### Diagnose and Troubleshoot an Application owner: Kunal
 
### Query and Evaluate Application, Service, Partition, Replica Health owner: Kunal

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
### PaaS v2 and Cloud Applications
### Applications, Services, Partitions, Replicas, and Replica Sets
### Cluster
### Service State
### Service Model
### Application and Service Types
### Health Model
### Names and Properties/Naming Service
### Image Store
### System Services 
Failover Manager Service

Cluster Manager Service

ImageStore Service

Naming Service
### Application Lifecyle
### Cluster Lifecycle
### Management APIs
### Application Security
### Cluster and Client Security
 Node-to-Node Security

 Client-to-Node Security

### Monitoring and Diagnostics
### Programming Models
 Actor Model

 Distributed Collections

 State and Replica Management APIs

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
