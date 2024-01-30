---
title: "Azure Arc-enabled Kubernetes and GitOps frequently asked questions"
ms.date: 05/04/2023
ms.topic: conceptual
description: "This article contains a list of frequently asked questions related to Azure Arc-enabled Kubernetes and Azure GitOps."
ms.custom: references_regions
---

# Frequently Asked Questions - Azure Arc-enabled Kubernetes and GitOps

This article addresses frequently asked questions about Azure Arc-enabled Kubernetes and GitOps.

## What is the difference between Azure Arc-enabled Kubernetes and Azure Kubernetes Service (AKS)?

AKS is the managed Kubernetes offering by Azure. AKS simplifies deploying a managed Kubernetes cluster in Azure by offloading much of the complexity and operational overhead to Azure. Since the Kubernetes masters are managed by Azure, you only manage and maintain the agent nodes.

Azure Arc-enabled Kubernetes allows you to extend Azure’s management capabilities (like Azure Monitor and Azure Policy) by connecting Kubernetes clusters to Azure. You maintain the underlying Kubernetes cluster itself.

## Do I need to connect my AKS clusters running on Azure to Azure Arc?

Currently, connecting an Azure Kubernetes Service (AKS) cluster to Azure Arc is not required for most scenarios. You may want to connect a cluster to run certain Azure Arc-enabled services such as App Services and Data Services on top of the cluster. This can be done using the [custom locations](custom-locations.md) feature of Azure Arc-enabled Kubernetes.

## Should I connect my AKS-HCI cluster and Kubernetes clusters on Azure Stack Edge to Azure Arc?

Connecting your AKS-HCI cluster or Kubernetes clusters on Azure Stack Edge to Azure Arc provides clusters with resource representation in Azure Resource Manager. This resource representation extends capabilities like Cluster Configuration, Azure Monitor, and Azure Policy (Gatekeeper) to connected Kubernetes clusters.

If the Azure Arc-enabled Kubernetes cluster is on Azure Stack Edge, AKS on Azure Stack HCI (>= April 2021 update), or AKS on Windows Server 2019 Datacenter (>= April 2021 update), then the Kubernetes configuration is included at no charge.

## How do I address expired Azure Arc-enabled Kubernetes resources?

The system-assigned managed identity associated with your Azure Arc-enabled Kubernetes cluster is only used by the Azure Arc agents to communicate with the Azure Arc services. The certificate associated with this system assigned managed identity has an expiration window of 90 days, and the agents will attempt to renew this certificate between Day 46 to Day 90. To avoid having your managed identity certificate expire, be sure that the cluster comes online at least once between Day 46 and Day 90 so that the certificate can be renewed.

If the managed identity certificate expires, the resource is considered `Expired` and all Azure Arc features (such as configuration, monitoring, and policy) will stop working on the cluster.

To check when the managed identity certificate will expire for a given cluster, run the following command:

```azurecli
az connectedk8s show -n <name> -g <resource-group>
```

In the output, the value of the `managedIdentityCertificateExpirationTime` indicates when the managed identity certificate will expire (90D mark for that certificate).

If the value of `managedIdentityCertificateExpirationTime` indicates a timestamp from the past, then the `connectivityStatus` field in the above output will be set to `Expired`. In such cases, to get your Kubernetes cluster working with Azure Arc again:

1. Delete the Azure Arc-enabled Kubernetes resource and agents on the cluster.

    ```azurecli
    az connectedk8s delete -n <name> -g <resource-group>
    ```

1. Recreate the Azure Arc-enabled Kubernetes resource by deploying agents on the cluster.

    ```azurecli
    az connectedk8s connect -n <name> -g <resource-group>
    ```

> [!NOTE]
> `az connectedk8s delete` will also delete configurations and cluster extensions on top of the cluster. After running `az connectedk8s connect`, recreate the configurations and cluster extensions on the cluster, either manually or using Azure Policy.

## If I am already using CI/CD pipelines, can I still use Azure Arc-enabled Kubernetes or AKS and GitOps configurations?

Yes, you can still use configurations on a cluster receiving deployments via a CI/CD pipeline. Compared to traditional CI/CD pipelines, GitOps configurations feature some extra benefits.

### Drift reconciliation

The CI/CD pipeline applies changes only once during pipeline run. However, the GitOps operator on the cluster continuously polls the Git repository to fetch the desired state of Kubernetes resources on the cluster. If the GitOps operator finds the desired state of resources to be different from the actual state of resources on the cluster, this drift is reconciled.

### Apply GitOps at scale

CI/CD pipelines are useful for event-driven deployments to your Kubernetes cluster (for example, a push to a Git repository). However, to deploy the same configuration to all of your Kubernetes clusters, you need to manually configure each Kubernetes cluster's credentials to the CI/CD pipeline.

For Azure Arc-enabled Kubernetes, since Azure Resource Manager manages your GitOps configurations, you can automate creating the same configuration across all Azure Arc-enabled Kubernetes and AKS resources using Azure Policy, within the scope of a subscription or a resource group. This capability is even applicable to Azure Arc-enabled Kubernetes and AKS resources created after the policy assignment.

This feature applies baseline configurations (like network policies, role bindings, and pod security policies) across the entire Kubernetes cluster inventory to meet compliance and governance requirements.

### Cluster compliance

The compliance state of each GitOps configuration is reported back to Azure. This lets you keep track of any failed deployments.

## Does Azure Arc-enabled Kubernetes store any customer data outside of the cluster's region?

The feature to enable storing customer data in a single region is currently only available in the Southeast Asia Region (Singapore) of the Asia Pacific Geo and Brazil South (Sao Paulo State) Region of Brazil Geo. For all other regions, customer data is stored in Geo. This is applicable for Azure Arc-enabled Open Service Mesh and Azure Key Vault Secrets Provider extensions supported in Azure Arc-enabled Kubernetes. For other cluster extensions, please see their documentation to learn how they store customer data. For more information, see [Trust Center](https://azure.microsoft.com/global-infrastructure/data-residency/).

## Next steps

* Walk through our quickstart to [connect a Kubernetes cluster to Azure Arc](./quickstart-connect-cluster.md).
* Already have an AKS cluster or an Azure Arc-enabled Kubernetes cluster? [Create GitOps configurations on your Azure Arc-enabled Kubernetes cluster](./tutorial-use-gitops-flux2.md).
* Learn how to [setup a CI/CD pipeline with GitOps](./tutorial-gitops-flux2-ci-cd.md).
* Learn how to [use Azure Policy to apply configurations at scale](./use-azure-policy.md).
* Experience Azure Arc-enabled Kubernetes automated scenarios with [Azure Arc Jumpstart](https://azurearcjumpstart.com/azure_arc_jumpstart/azure_arc_k8s).
