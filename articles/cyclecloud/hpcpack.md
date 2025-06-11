---
title: Microsoft HPC Pack Integration
description: Microsoft HPC Pack configuration in Azure CycleCloud
author: padmalathas
ms.date: 06/10/2025
ms.author: padmalathas
monikerRange : '>= cyclecloud-8'
---

# Microsoft HPC Pack

 [Microsoft HPC Pack](/powershell/high-performance-computing/overview)  is a free HPC solution built on Microsoft Azure with Windows Server technologies and supports a wide range of HPC workloads. This page articulates the capabilities and configuration details for HPC Pack integration with Cyclecloud.

## Limitations and supported versions

**Microsoft HPC Pack 2016 (with Update 3)** and **Microsoft HPC Pack 2019** are supported in CycleCloud with below limitations:

- The cluster must be created in an Active Directory Domain.
- The cluster can contain only a single head node.
- High availability on the head node isn't supported yet.
- Head node VM image customization isn't supported.
- Linux compute nodes aren't supported yet.
- The head node requires outbound internet access to download Nuget binary and Python3.
- CLI and cloud-init configuration isn't supported yet.

## Prerequisites

### Active Directory Domain

Currently all HPC Pack nodes must be joined into an Active Directory Domain. If you're deploying the HPC Pack cluster in a virtual network which has a Site-to-Site VPN or ExpressRoute connection with your corporate network, typically there's already an existing Active Directory Domain. If you don't have an AD domain in your virtual network yet, you can choose to create a new AD domain by promoting the head node as domain controller.

### Azure Key Vault

Microsoft HPC Pack requires a PFX certificate to secure the node communication,  and it also requires AD domain user credentials to join the nodes into AD domain. While you can directly specify a PFX file, protection password, and user password in the template, we strongly recommend using Azure Key Vault for secure handling of the certificate and user password. Refer to [Create an Azure Key Vault Certificate](/powershell/high-performance-computing/deploy-an-hpc-pack-cluster-in-azure#create-azure-key-vault-certificate-on-azure-portal).

The cluster also requires Username and Password of an AD administrator account to join nodes to the domain as they're created. We strongly recommend using Azure Key Vault.

### Azure User Assigned Managed Identity

In order to use Azure Key Vault for the certificate and credentials, you need to create an Azure User Assigned Managed Identity and grant **Get**' permission for both Secret and the Certificate of the Azure Key Vault.

You can refer to this [Key Vault tutorial](/azure/active-directory/managed-identities-azure-resources/tutorial-windows-vm-access-nonaad) for creating your Key Vault and a Managed Identity with Key Vault access.

We recommend using [Azure Role-Based Access Control](/azure/key-vault/general/rbac-guide?tabs=azure-cli) to assign Key Vault permissions to the Managed Identity.

## HPC Pack node roles

There are three different node roles in  HPC Pack cluster:

- **Head node**: Provides the cluster management and job scheduling services. Currently, only a single head node with local databases is supported.
- **Broker node**: Receives requests from an SOA client, distributes them to the service hosts on the compute nodes, and then collects responses and sends them back to the client. The broker nodes are created in the **broker** node array. You must create broker nodes if you want to run an SOA workload in the cluster.
- **Compute node**: Accepts and runs cluster jobs. The compute nodes are created in the **cn** node array.

## Create a new  HPC Pack Cluster

You can click the **Microsoft HPC Pack** icon under **Schedulers** to create a new Microsoft HPC Pack cluster.

On the **About** page, specify a unique **Cluster Name** for the cluster. Since it's used as the NetBIOS computer name of the head node, make sure it's unique in the AD domain and complies with the [naming conventions](/troubleshoot/windows-server/identity/naming-conventions-for-computer-domain-site-ou#netbios-domain-names).

### Basic Settings

- **HPC Pack Version**: You can select **HPC Pack 2019** or **HPC Pack 2016 (with Update 3)**. We recommend that you use the latest HPC Pack version, that is, HPC Pack 2019.
- **Virtual Machines**: You can select the Azure **Region** where you want to create the HPC Pack cluster, and the **VM Type** for each cluster node role. You can also specify **Num. Brokers** to create one or more Broker nodes if you want to run SOA workloads in the cluster.

### Auto-Scaling

The cluster is started without any compute nodes. You can enable **Autoscale** to automatically scale up/down the compute nodes depending on the cluster workloads, you can use **Max Cores** to specify the maximum number of compute vCPU cores of your cluster. The autoscaler runs every minute as a Windows Scheduled Task on the head node.

There are two scale-down options for compute nodes: **Deallocate** or **Terminate**. If you choose the **Terminate** option, the HPC Pack cluster always removes the compute node VMs on scale-down. If you choose the **Deallocate** option, the HPC Pack cluster deallocates the compute node VMs on scale-down, and maintain them for up to a configurable number of days (**VM Retention Days**). The deallocated compute nodes isn't removed from the HPC Pack cluster as long as they're still retained. However, they're taken offline and shown as unreachable in the HPC Pack cluster. The **Deallocate** option is recommended for the HPC Pack cluster since it can significantly reduce the node preparation time on scale-up, and you only pay for the disk storage of the deallocated VMs.

### Infrastructure Settings

- **Virtual Network**: You can select an existing virtual network and subnet in which the HPC Pack cluster is created.
- **Active Directory Domain**: If there's already an AD domain in your virtual network, specify the full **Domain Name** and the **OU Path** in which the cluster nodes are joined. Or select **New AD Domain** to create a new AD domain by promoting the head node as a domain controller.
- **Secrets and Certificate**: We strongly recommend that you select **Use KeyVault** to use Azure Key Vault to pass the node communication certificate and user password. In **MSI Identity**, select Azure User Assigned Identity which you created in **Prerequisites** from the dropdown list, and specify the Azure Key **Vault Name** created in **Prerequisites**.
- **User Credentials**: In **Username**, specify the domain user name. In **Password Secret**, specify the Azure Key Vault secret name you created in **Prerequisites** to store the domain user password.
- **PFX Certificate**: In **Certificate Name**, specify the Azure Key Vault Certificate name you created in **Prerequisites**.

### Advanced Settings

- **Azure Settings**: Select the Azure cloud **Credentials** from the dropdown list.
- **Cluster Software**: Specify the operating system (**OS**) for each cluster node role.
- **Advanced Networking**: By default the DNS servers configured in the virtual network are applied to all the HPC nodes, you can optionally specify **DNS Server** if you want to use a different DNS server. You can also optionally select **HN Public IP** to assign a public IP address for the head node.

## azhpcpack CLI

The _azhpcpack.ps1_ CLI is the main interface for all autoscaling behavior (the Scheduled Task calls `azhpcpack.ps1 autoscale`). The CLI is available in _C:\cycle\hpcpack-autoscaler\bin_)

The CLI can be used to diagnose issues with autoscaling or to manually control cluster scaling from inside the Head Node.

| Command | Description |
| :---    | :---        |
| autoscale            | End-to-end autoscale process, including creation, deletion, and joining of nodes. |
| buckets              | Prints autoscale bucket information, like limits etc., |
| config               | Writes the effective autoscale config, after any preprocessing, to stdout |
| create_nodes         | Create a set of nodes given various constraints. A CLI version of the nodemanager interface. |
| default_output_columns | Output what are the default output columns for an optional command. |
| delete_nodes         | Delete the node and evict from the cluster. |
| initconfig           | Creates an initial autoscale config. Writes to stdout. |
| limits               | Writes a detailed set of limits for each bucket. Defaults to json due to number of fields. |
| nodes                | Query nodes. |
| refresh_autocomplete | Refreshes local autocomplete information for cluster specific resources and nodes. |
| retry_failed_nodes   | Retries all nodes in a failed state. |
| validate_constraint  | Validates then outputs as JSON one or more constraints. |
