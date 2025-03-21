---
title: Relocate an Azure Kubernetes Service cluster to another region
description: Learn how to relocate an Azure Kubernetes Service cluster to another region
author: anaharris-ms
ms.author: anaharris
ms.reviewer: anaharris
ms.date: 09/03/2024
ms.service: azure-automation
ms.topic: how-to
ms.custom:
  - subject-relocation
---

# Relocate an Azure Kubernetes Service (AKS) cluster to another region

This article covers guidance for relocating an [Azure Kubernetes Service cluster](/azure/aks/what-is-aks) to another region.

[!INCLUDE [relocate-reasons](./includes/service-relocation-reason-include.md)]

>[!NOTE]
>Customers with fast release cycles often leverage CI/CD pipelines. In those cases, you might consider altering the build and release pipelines instead of re-deploying the AKS clusters in the target region.

## Prerequisites

Before you begin the relocation planning stage, first review the following prerequisites:

- Ensure that the target region has enough capacity (VM SKUs) to accommodate the new cluster nodes.

- Validate that you have resource creation permissions to the target subscription. Check that Azure policy isn’t restricting the regions to which AKS can be deployed.

- (Optional) Collect the Infrastructure as code (IaC) templates or scripts with which you provisioned the source AKS cluster.

- Collect the Kubernetes manifests in order to re-create the application workload within the target cluster.
    
    >[!TIP]
    >Evaluate a GitOps approach to workload deployment where Kubernetes configuration manifests are stored in a git repo and automatically applied by a GitOps operator running within the cluster, such as [Flux](/azure/azure-arc/kubernetes/conceptual-gitops-flux2). A GitOps approach makes re-deploying workloads to different clusters as simple as installing the GitOps controller and pointing it at the repo.

- Review cluster ingress implementation.

- Document the DNS changes required to point a public domain to the cluster ingress endpoint.

- Review whether the cluster stores any state data, such as any persistent volumes, that you need to migrate to the target cluster.

- Document public TLS certificate management and distribution.

- Capture any IP addresses defined in the AKS API service allowlist.

- Understand all dependent resources. Some of the resources could be:

    - Queues, Message Buses, Cache engines
    - [Azure Key Vault](./relocation-key-vault.md)
    - [Managed Identity](./relocation-managed-identity.md)
    - [Virtual Network configuration](./relocation-virtual-network.md). Define sufficient subnet sizes to allow container IP growth if using the Azure advanced networking model
    - Public IP address
    - Virtual Network Gateway (VNG). If site-to-site communication is required to an on-premises environment in the target region, a VNG must be created in the target virtual network.
    - Azure Private Endpoint. Azure PaaS resources utilizing private link endpoints must be reviewed, and new private link instances created in the target region such as ACR, Azure SQL DB, KeyVault, etc.
    - [Azure Application Gateway](./relocation-app-gateway.md)
    - Azure DNS
    - [Azure Firewall](./relocation-firewall.md)
    - [Azure Monitor (Container Insights)](./relocation-log-analytics.md)
    - [Azure Container registry](relocation-container-registry.md) can replicate images between ACR instances. For optimal performance when pulling images, the registry should exist in the target region. 
        >[!NOTE]
        >If you use Azure Container Registry to authenticate to the container registry, the new AKS cluster’s managed identity can be the granted `AcrPull` RBAC role.
    - Azure Managed Disks
    - Azure Files

## Prepare

Before you begin the cluster relocation process, make sure to complete the following preparations:

1. To accommodate the AKS cluster nodes and pods, if using Azure CNI networking, deploy the virtual network with many subnets of sufficient size. 

1. If you're using Azure Key Vault, [Deploy the Key Vault](./relocation-key-vault.md).

1. Ensure that the relevant TLS ingress certificates are available for deployment, ideally in a secure store such as Azure Key Vault.

1. Deploy a container registry. Either sync the source registry images automatically or rebuild and push new images to the target registry using a CI/CD pipeline or script.

1. [Deploy an Azure Monitor workspace](./relocation-log-analytics.md).

1. (Optional) [Deploy Azure Application Gateway](./relocation-app-gateway.md) to handle ingress traffic Application Gateway Ingress Controller (AGIC) can tightly integrate with the cluster

1. Deploy any data sources required by the cluster workload and restore or sync the source data.

1. Execute existing IaC artifacts defined in a CI/CD pipeline that were used to deploy the source cluster and the services it depends upon. Change the code or template input parameters to redeploy to a different resource group and Azure region.



## Redeploy

Deploy the AKS cluster without any data migration, by following these steps:

1. To create the target environment in Azure, manually run the existing IaC artifacts on a local workstation.

1. If there are no existing IaC assets, the current cluster configuration [can be exported as an ARM template](/azure/azure-resource-manager/templates/export-template-portal) and executed against the target region. [IaC templates](/azure/templates/) are created from scratch or are modified versions of sample templates using Bicep, JSON, Terraform, or another solution. 

    >[!NOTE]
    >- Private Link connections, ACR connected registries and Azure Monitor workspace data sources are not currently exported using this method and must therefore be removed from the generated template before execution.
    
1.  Deploy the container workload to the AKS cluster, which can be achieved in two ways:
    - *Pull* Manifests are pulled from a repo and applied by a controller running within the cluster, known as a GitOps approach.
    - *Push.* Manifests are pushed to the cluster using the Kubernetes API service and kubectl command line tool, either from a CI/CD pipeline or local workstation.

1. To ensure that the new cluster performs as anticipated, perform testing and validation.

1. Change your public DNS entries to point to the external ingress IP of the target cluster (Azure Public Load Balancer IP or Application Gateway Public IP).

1. A deployment using global load-balancing solution such as Azure DNS or Azure Traffic Manager needs to add the region to the configuration.

## Redeploy with data migration

AKS workloads that use local storage, such as persistent volumes, to store data or host database services within the cluster can be backed up on a source cluster and restored to a target cluster. To learn how to perform backup and restoration, see [Back up Azure Kubernetes Service using Azure CLI](/azure/backup/azure-kubernetes-service-cluster-backup-using-cli).


## Related content


- [Use Azure portal to export a template](/azure/azure-resource-manager/templates/export-template-portal)
- [Cluster creation - Bicep](/azure/templates/microsoft.containerservice/managedclusters?tabs=bicep)
- [Cluster creation - JSON](/azure/templates/microsoft.containerservice/managedclusters?tabs=json)
- [Cluster creation - Terraform](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/kubernetes_cluster)
- [Baseline architecture for an Azure Kubernetes Service (AKS) cluster](/azure/architecture/reference-architectures/containers/aks/secure-baseline-aks)
- [Azure Kubernetes Services (AKS) day-2 operations guide](/azure/architecture/operator-guides/aks/day-2-operations-guide)
- [Best practices for storage and backups in Azure Kubernetes Service (AKS)](/azure/aks/operator-best-practices-storage)