---
title: Azure Operator Nexus FAQ
description: Answers to the most frequently asked questions about Azure Operator Nexus.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 06/28/2023
ms.custom: template-reference
---

# Azure Operator Nexus frequently asked questions (FAQ)
The following sections covers some of the frequently asked questions for Azure Operator Nexus:

## Platform - General

### What services does Azure Operator Nexus provide?
Azure Operator Nexus is a managed hybrid cloud platform that supports carrier-grade network workloads. Here, the management plane lives in Azure and the control plane and user plane gets deployed on operators' premises or in Azure. It simplifies provisioning of new network services and optimizes deployment of network functions and applications on premises. The end customer can deploy containerized applications (on an on premises Nexus AKS cluster) or a virtualized workload to run these network functions. Customer gets out of the box integration with many Azure services such as Azure Monitor, Azure Container Registry, and Azure Kubernetes Services.
          
### How do I interact with Operator Nexus instance?
You can interact with Operator Nexus like any other Azure services using AZ CLI, API, ARM template, or portal. You can alternatively use BICEP templates.  

### Does customer need to deploy any resources in their subscription to deploy Azure Operator Nexus instances?
Yes, there are some resources that customer needs to create in the respective region under their Azure subscriptions. Some of these include creation of a pair of Network Fabric Controller and Cluster Manager resource, Log Analytics Workspace, a storage account. For more details, please refer to [Azure Operator Nexus documentation](howto-azure-operator-nexus-prerequisites.md).

### Does Azure Operator Nexus rely on connectivity with Azure? What happens when there's a disconnection?
Yes, you need an ExpressRoute connection for its connectivity back to Azure and for Orchestration, Management and Operation purposes. During disconnection, the workloads will continue to run as is but you may lose the capability to orchestrate any new resources.

### Do I have to use the BOM (Bill of Material) specified by Microsoft?
Yes, to ensure carrier-grade performance and high degrees of automation, you'll need to use equipment specified as per one of our BOMs.

### How should I plan for a resilient Operator Nexus instance? How does Operator Nexus handle disaster recovery?
Customers should design their services with Intra-rack redundancy, Inter-rack redundancy and globally load balancing across multiple instances. Also, for high availability, plan to spread your instances across multiple Azure regions.

### How do updates work to on-premises and to Azure components?
Upgrades to Operator Nexus are made in two phases - Management bundle upgrades and Runtime bundle upgrades. Management bundle upgrades deals with the upgrades of Controllers in Azure, Cluster Managers in customer subscription and on-premises instances. In on-premises instances, it includes the Kubernetes controllers responsible for maintaining the state of infra resources. 
          
Updates of Management bundle may cause interruptions to provisioning activities but it doesn't impacts the customers running workloads. Customers don't control or drive these upgrades, but these upgrades are essential to provide customers with the options to update to new runtime-based upgrades within their on-premises instances.
          
On the other hand, Runtime bundle upgrades deals with the components that require updates to the OS (Operating System) and/or workload supporting components. The update of the runtime bundle is entirely under the control of the customer and APIs can be used to perform these updates. You might observe some workload impacts during this upgrade.

### Is the storage appliance a must required device?
For near-edge SKUs, Storage appliance is a part of the Hardware infrastructure that Operator needs to procure. 

### Does Operator Nexus provide best practices or blueprints for deploying network functions on Operator Nexus?
Yes, Operator Nexus comes with Nexus Ready program. With this program, Microsoft is working with industry leading Network Function partners to validate that their network functions to ensure they can run on Nexus platform. We validate these network functions on regular intervals to ensure that they stay compliant with newer versions of Nexus. Operators can now get consistent and scalable deployment of multi-vendor network functions with the Nexus Ready program. 

### What data stays on premises and what is available in Azure?
From Infrastructure perspective, the data is managed via Azure APIs. The telemetry from these layers gets collected and is visible under customer subscription. Customers can use Log Analytics Workspace, storage accounts or other Analytics services in Azure to look into the telemetry from Infra layers.
          
For tenant workloads, the images get stored in ACRs (Azure Container Registry) and once deployed. Microsoft provides an option to collect the telemetry from tenant workloads into Azure but Customers can choose alternative tooling they wish to collect telemetry data or to analyze it.

### If an Azure region doesn't exist in my country, can I still use Operator Nexus?
Yes, all you need is ExpressRoute connectivity to an Azure region. ExpressRoute connectivity is available at many locations. For more information, see the [Geo-locations](../expressroute/expressroute-locations.md#locations) and [connectivity providers](../expressroute/expressroute-locations.md#partners). 

### Can I move my resources from one subscription to another?
Currently, we don't support resource moves. If you need to move resources, you can consider deleting the existing controllers and using the ARM template to create another one in another location.

### How many instances can be associated to a cluster manager/fabric controller pair? 
The number of Azure Operator Nexus instances, a single pair of Network Fabric Controller and Cluster Manager can manage depends on multiple factors. It can be influenced by factors like size of Operator Nexus instances, ExpressRoute circuit bandwidth, number and frequency of optional metrics collection, number of workloads running in Instance, destination for workload telemetry data collection and other factors. 
          
For more information, see [limits & quotas](reference-limits-and-quotas.md).

## Compute

### Does Azure Operator Nexus support creation of Virtual Machines (VMs)?
Yes, Azure Operator Nexus provides the ability to create customized VMs for hosting VNFs within a telco network. The Azure Operator Nexus platform provides Azure CLI command to create a customized VM. To host a VNF on your VM, have it Azure Arc enrolled, and provide a way to SSH to it via the Azure CLI. You can use your image when you’re creating Azure Operator Nexus virtual machines. Make sure that each image that you use to create your workload VMs is a containerized image in either qcow2 or raw disk format. Upload these images to Azure Container Registry.

### How do I update a bare metal server?
To update a bare metal server within an Azure Operator Nexus instance, you can use the Azure APIs. Any update for bare metal server is part of runtime bundle upgrade. This upgrade requires the Nexus instance connectivity back to Azure.
          
### What OS runs on the bare metal server? Can I bring my own?
Bare metal servers are deployed with Microsoft Azure Linux (previously called CBL Mariner OS), which is thoroughly tested and is compatible with required Azure agents. There are no plans to support any other OS offering for Bare metal servers.

### How many servers does Operator Nexus support? How many racks?
An Operator Nexus instance can have up to eight compute racks and each rack hosting upto 16 servers. These compute servers are used for running actual tenant workloads.

## Networks

### Does Operator Nexus support IPv6?
Yes, Azure Operator Nexus provides support for both IPV4 and IPV6 configuration across all layers of the stack. 
          
### What are the networking requirements for Azure Operator Nexus?
Here are some of the network requirements for Azure Operator Nexus:
* Customers need to work with Microsoft partners for setting up ExpressRoute connections, 
* PE (Provider Edge) device supports 400G or 100G connections to CE (Customer Edge) device in Operator Nexus instance
* PE must have routes to ExpressRoutes
* IP address blocks defined for various services, VLANs for iDrac, PXE, Storage, OAM etc. 
          
For more information, see [Network fabric controller](howto-configure-network-fabric-controller.md) and [Network fabric](howto-configure-network-fabric.md).
          
### What is an isolation domain?
Isolation domains enable Layer 2 or Layer 3 connectivity between workloads hosted across the Azure Operator Nexus instance and external networks. These constructs segment a network into authentication domains and enforces communication within required boundaries.
          
### Does Operator Nexus support a single ToR (Top of Rack) device?
For near-edge, the fabric is designed based on high availability model and the reason you can't have just one ToR switch.  

### Is Network packet Broker (NPB) a hard requirement?
For near-edge SKUs, NPBs will be part of the BOM. 

### How do I configure the load balancing service in a Nexus Kubernetes cluster?
The load balancer allows external services to access the services running within the cluster. You can refer to the [load balancer](./howto-kubernetes-service-load-balancer.md) article for more information.
      
## Tenant workloads

### Can I bring my own K8S cluster? 
Nexus platform offers customers an option to either create Nexus AKS clusters with multiple Kubernetes versions or Virtual Machines for running their workloads.

### What VNFs (Virtualized Network Functions) and CNFs (Containerized Network Functions) are certified on the platform?
Validation of VNF and CNF functions is an ongoing activity. We'll publish the list of certified VNFs and CNFs soon.

### If a VNF or CNF isn't certified, can I still use it?
Indeed, you can collaborate with the Nexus team to ensure there are no limitations that would prevent you from deploying these workloads. 

### How do I deploy a VM/Container?
Customers can use APIs to deploy VM and Nexus AKS clusters in an Operator Nexus instance. For a richer experience, Microsoft offers another service AOSM (Azure Operator Service Manager) which allows you to automate deployment of your Containerized (CNF) and Virtualized (VNF) Network Functions.

### What storage classes can I use for my containers within AKS clusters?
Nexus AKS clusters have a support for Read Write Many (RWX) & Read Write Once (RWO) storage classes.

### How can Operator Nexus VMs be made highly available?
The Operators can choose to deploy VMs across multiple bare metal machines and across racks to achieve high availability. 

## Observability

### How do I monitor my Azure Operator Nexus instance?
Azure Operator Nexus provides customers to monitor the health of Nexus instance and its connected resources by collecting telemetry into customer subscription. Customers  can collect and analyze all the logs in Azure Log Analytics Workspace/Azure Data Explorer where those can be additionally retained for longer durations.

### What metrics are available for compute, networking, storage? Can I alert on them? Can I integrate with my own monitoring solution?
A wide and curated set of metrics are delivered to customer from across the layers in the Azure Operator Nexus instance stack. These include the metrics essential for assessing the health based of compute, storage and networking incl. resource quotas and utilization. Customers can set appropriate alert rules based on the telemetry collected to ensure that notifications are triggered whenever the configured thresholds are met.

For more information, see the [list of metrics](list-of-metrics-collected.md).