---
title: Azure Storage Mover service prerequisites
description: Learn about the prerequisites for using Azure Storage Mover, including the implementation of private networking.
author: stevenmatthew
ms.author: shaas
ms.service: azure-storage-mover
ms.topic: conceptual
ms.date: 10/22/2025
---

# Azure Storage Mover service prerequisites

Azure Storage Mover is a fully managed service that facilitates the migration of data from on-premises or cloud locations to Azure Storage. Data within your various workloads, such as an applications or file shares, can be stored either on-premises or in another cloud environment. Examples of such data sources include on-premises file servers, Network Attached Storage (NAS) devices, or cloud storage services such as Amazon Web Services (AWS) Simple Storage Service (S3) buckets.

While migrating on-premises data, Azure Storage Mover uses agents installed on your on-premises infrastructure. Cloud data sources are migrated directly via the Storage Mover service itself, without the need for on-premises agents. In both cases, Storage Mover quickly and efficiently transfer large volumes of data from these various sources, to Azure Storage.

To use Azure Storage Mover, you need to meet certain prerequisites related to your Azure subscription, networking configuration, and the environment where the Storage Mover agents are deployed. This article outlines these prerequisites to help you prepare for a successful deployment and on-premises migration using Azure Storage Mover.

> [!NOTE]
> There might be different prerequisites depending on your specific migration scenario. This article covers the general prerequisites for using Azure Storage Mover to migrate on-premises data.

## Azure subscription prerequisites

Your subscription must be in the same Microsoft Entra tenant as the target Azure storage accounts into which your data is being migrated. First, you need to choose an Azure subscription and resource group for your top-level storage mover resource. The next steps depend on how you deploy, and which actions you or another admin perform.

### Resource provider namespaces

Before a service is used for the first time in an Azure subscription, its resource provider namespace must be registered once with the chosen subscription. Azure Storage Mover has the same requirement. A subscription *Owner* or *Contributor* can perform this action. Performing this registration action before the actual storage mover resource deployment enables admins with less access to deploy and use the Storage Mover service and the resources it depends on.

> [!IMPORTANT]
> The subscription must be registered with the resource provider namespaces *Microsoft.StorageMover* and *Microsoft.HybridCompute*.

Register a resource provider:

- [via the Azure portal](../azure-resource-manager/management/resource-providers-and-types.md#azure-portal)
- [via Azure PowerShell](../azure-resource-manager/management/resource-providers-and-types.md#azure-powershell)
- [via Azure CLI](../azure-resource-manager/management/resource-providers-and-types.md#azure-cli)

> [!TIP]
> When you deploy a storage mover resource as a subscription *Owner* or *Contributor* through the Azure portal, your subscription is automatically registered with both of these resource provider namespaces. You only need to perform the registration manually when using Azure PowerShell or CLI.

After a subscription is enabled for both of these resource provider namespaces, it remains enabled until manually unregistered. You can even delete the last storage mover resource and your subscription still remains enabled. Subsequent storage mover resource deployments then require reduced permissions from an admin. The following section contains a breakdown of different management scenarios and their required permissions.

## Permissions

Azure Storage Mover requires special care for the permissions an admin needs for various management scenarios. The service exclusively uses Role Based Access Control (RBAC) for management actions in the control plane, and for target storage access in the data plane. The following table outlines the required permissions for the various management scenarios.

| Management scenario                     | Minimal required RBAC roles                                                                |
|------------------------------------------------------------|---------------------------------------------------------------------------|
| Register a resource provider namespace with a subscription | Subscription: `Contributor`                                               |
| Deploy a storage mover resource                            | Subscription: `Reader` <br> Resource group: `Contributor`                 |
| Register an agent                                          | Subscription: `Reader` <br> Resource group: `Contributor` <br> Storage mover: `Contributor` |
| Start a migration (the initial job for a specific target)  | Subscription: `Reader` <br> Resource group: `Contributor` <br> Storage mover: `Contributor` <br> Target storage account: `Owner` |
| Rerun a migration (subsequent jobs for a specific target)  | Subscription: `Reader` <br> Resource group: `Contributor` <br> Target storage mover: `Contributor` <br> Target storage account: *none* |

## Storage mover agent 

Storage Mover utilizes one or more migration agents to facilitate on-premises migrations. An agent is a virtual machine that runs within your network. It's also the name of a resource, parented to the top-level storage mover resource you deploy in your resource group.

The agent itself is responsible for performing the data transfer tasks during a migration. It connects to various Azure services to receive job assignments, report progress, and send logs. The agent also connects to your on-premises data sources to read the data that needs to be migrated.

Keep in mind, there are two main sets of prerequisites: those for setting up the agent VM itself, and those for completing the registration process.

### Agent deployment
 
To begin deploying an agent, you need to create a virtual machine (VM) on your on-premises hypervisor, such as Hyper-V or VMware. Next, download the Agent VM image from [https://aka.ms/StorageMover/agent](https://aka.ms/StorageMover/agent) and follow the setup instructions within the [How to deploy an Azure Storage Mover agent](agent-deploy.md) article.
 
After your agent VM is created and running, you can register it with your Storage Mover resource and ARC services using the Agent VM's shell menu.

### Agent registration

To register an agent with your storage mover resource, the following prerequisites must be met:

- You need to have an Azure Storage Mover resource deployed in your Azure subscription.
- You must have the necessary permissions to register an agent, as outlined in the [Permissions](#permissions) section.
- You need to deploy the agent VM within your network using the provided agent image. The VM must meet the compute, memory, and storage requirements outlined in the next section.

The registration process typically involves you connecting to the Agent over SSH, choosing the "Register" option, and providing the necessary inputs when prompted. For more detailed instructions, see the [How to register an Azure Storage Mover agent](agent-register.md) article.
 
### Agent VM compute and memory resources 

In order to run the storage mover agent, your virtual machine (VM) must meet certain compute and memory requirements. The following table outlines the minimum specifications for the agent VM:

| Migration scale*  | Memory (RAM) | Virtual processor cores, 2 GHz min. |
|-------------------|--------------|-------------------------------------|
| 1 million items   | 8 GiB        | 4 virtual cores                     |
| 10 million items  | 8 GiB        | 4 virtual cores                     |
| 30 million items  | 12 GiB       | 6 virtual cores                     |
| 50 million items  | 16 GiB       | 8 virtual cores                     |
| 100 million items | 16 GiB       | 8 virtual cores                     |

<sup>*</sup> *Migration scale* refers to the total number of files and folders in the source.

> [!IMPORTANT]
> While agent VM minimal specs might work for your migration, performance is suboptimal and therefore not supported. For optimal performance, consider using higher specs than the minimum requirements. The [Performance targets](performance-targets.md) article contains test results from different source namespaces and VM resources.

### Agent VM local storage capacity 

At minimum, the agent image requires 100 GiB of local storage. The amount required might increase if a large number of small files are cached during a migration. 

### Agent VM image 

Images for agent VMs are hosted on the Microsoft Download Center as a `zip` file. Download the latest agent image at [https://aka.ms/StorageMover/agent](https://aka.ms/StorageMover/agent) and extract the agent's virtual hard disk (VHD) image to your virtualization host.

### Agent network connectivity

The agent VM must have network connectivity to various Azure services to function correctly. Some of these services support private endpoints, while others require public endpoint access. For detailed information about the required network connectivity, see the [Networking prerequisites for Storage Mover](network-prerequisites.md) article.

## Storage Mover Endpoint

A Storage Mover Endpoint is a resource that represents a connection to a specific data source or target. Endpoints are used to define the source from which data is migrated and the target to which data is moved. Each endpoint contains the necessary configuration details, such as authentication credentials, network settings, and data format specifications.

In order to create Target Endpoints in Azure, it's necessary to have at least one Azure storage account available as a target. For storing Azure Blob data, a target container within the storage account is also required. For Azure File data, a target file share within the storage account is needed. 

Azure storage accounts with an enabled firewall must be configured to permit traffic from the agent. When using an SMB source, configure Azure KeyVaults with an enabled firewall to permit traffic from the agent.
