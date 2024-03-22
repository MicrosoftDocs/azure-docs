---
title: Considerations for deployment in Azure public MEC
description: Learn about considerations for customers to plan for before they deploy applications in an Azure public multi-access edge compute (MEC) solution.
author: m0nikama
ms.author: monikama
ms.service: public-multi-access-edge-compute-mec
ms.topic: conceptual
ms.date: 11/22/2022
ms.custom: template-concept
---

# Considerations for deployment in Azure public MEC

Azure public multi-access edge compute (MEC) sites are small-footprint extensions of Azure. They're placed in or near mobile operators' data centers in metro areas, and are designed to run workloads that require low latency while being attached to the mobile network. This article focuses on the considerations that customers should plan for before they deploy applications in the Azure public MEC.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- Add an allowlisted subscription to your Azure account, which allows you to deploy resources in Azure public MEC. If you don't have an active allowed subscription, contact the [Azure public MEC product team](https://aka.ms/azurepublicmec).

## Best practices

For Azure public MEC, follow these best practices:

- Deploy in Azure public MEC only those components of the application that are latency sensitive or need low latency compute at the Azure public MEC. Deploy in the parent Azure region those components of the application that perform control plane and management plane functionalities.

- To access VMs deployed in the Azure public MEC, deploy jump box virtual machines (VMs) or Azure Bastion in a virtual network (VNet) in the parent region.

- For compute resources in the Azure public MEC, deploy Azure Key Vault in the Azure region to provide secrets management and key management services.

- Use VNet peering between the VNets in the Azure public MEC and the VNets in the parent region. IaaS resources can communicate privately through the Microsoft network and don't need to access the public internet.

## Azure public MEC architecture

Deploy application components that require low latencies in the Azure public MEC, and components that are non-latency sensitive in the Azure region. For more information, see [Azure public multi-access edge compute deployment](/azure/architecture/example-scenario/hybrid/public-multi-access-edge-compute-deployment).

### Azure region

The Azure region should run the components of the application that perform control and management plane functions and aren't latency sensitive.

The following sections show some examples.

#### Azure database and storage

- Azure databases: Azure SQL, Azure Database for MySQL, and so on
- Storage accounts
- Azure Blob Storage

#### AI and Analytics

- Azure Machine Learning Services
- Azure Analytics Services
- Power BI
- Azure Stream Analytics

#### Identity services

- Microsoft Entra ID

#### Secrets management

- Azure Key Vault

### Azure public MEC

Azure public MEC should run components that are latency sensitive and need faster response times from compute resources. To do so, run your application on compute services such as Azure Virtual Machines and Azure Kubernetes Service in the public MEC.

## Availability and resiliency

Applications you deploy in the Azure public MEC can be made available and resilient by using the following methods:

- [Deploy resources in active/standby](/azure/architecture/example-scenario/hybrid/multi-access-edge-compute-ha), with primary resources in the Azure public MEC and standby resources in the parent Azure region. If there's a failure in the Azure public MEC, the resources in the parent region become active.

- Use the [Azure backup and disaster recovery solution](/azure/architecture/framework/resiliency/backup-and-recovery), which provides [Azure Site Recovery](../site-recovery/site-recovery-overview.md) and Azure Backup features. This solution:
  - Actively replicates VMs from the Azure public MEC to the parent region and makes them available to fail over and fail back if there's an outage.
  - Backs up VMs to prevent data corruption or lost data.

   > [!NOTE]
   > The Azure backup and disaster recovery solution for Azure public MEC supports only Azure Virtual Machines.

A trade-off exists between availability and latency. Although failing over the application from the Azure public MEC to the Azure region ensures that the application is available, it might increase the latency to the application.

Architect your edge applications by utilizing the Azure Region for the  components that are less latency sensitive, need to be persistent or need to be shared between public MEC sites. This will allow for the applications to be more resilient and cost effective. The public MEC can host the latency sensitive components.

## Data residency
> [!IMPORTANT]
Azure public MEC doesn't store or process customer data outside the region you deploy the service instance in.

## Next steps

To deploy a virtual machine in Azure public MEC using an Azure Resource Manager (ARM) template, advance to the following article:

> [!div class="nextstepaction"]
> [Quickstart: Deploy a virtual machine in Azure public MEC using an ARM template](quickstart-create-vm-azure-resource-manager-template.md)
