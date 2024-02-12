---
title: "Azure Arc-enabled Kubernetes agent overview"
ms.date: 08/24/2023
ms.topic: conceptual
description: "Learn about the Azure Arc agents deployed on the Kubernetes clusters when connecting them to Azure Arc."
---

# Azure Arc-enabled Kubernetes agent overview

[Azure Arc-enabled Kubernetes](overview.md) provides a centralized, consistent control plane to manage policy, governance, and security across Kubernetes clusters in different environments.

Azure Arc agents are deployed on Kubernetes clusters when you [connect them to Azure Arc](quickstart-connect-cluster.md). This article provides an overview of these agents.

## Deploy agents to your cluster

Most on-premises datacenters enforce strict network rules that prevent inbound communication on the network boundary firewall. Azure Arc-enabled Kubernetes works with these restrictions by not requiring inbound ports on the firewall. Azure Arc agents require outbound communication to a [set list of network endpoints](network-requirements.md).

This diagram provides a high-level view of Azure Arc components. Kubernetes clusters in on-premises datacenters or different clouds are connected to Azure through the Azure Arc agents. This allows the clusters to be managed in Azure using management tools and Azure services. The clusters can also be accessed through offline management tools.

:::image type="content" source="media/architectural-overview.png" alt-text="Diagram showing an architectural overview of the Azure Arc-enabled Kubernetes agents." lightbox="media/architectural-overview.png":::

The following high-level steps are involved in [connecting a Kubernetes cluster to Azure Arc](quickstart-connect-cluster.md):

1. Create a Kubernetes cluster on your choice of infrastructure (VMware vSphere, Amazon Web Services, Google Cloud Platform, etc.). The cluster must already exist before you connect it to Azure Arc.

1. Start the Azure Arc registration for your cluster.

   * The agent Helm chart is deployed on the cluster.
   * The cluster nodes initiate an outbound communication to the [Microsoft Container Registry](https://github.com/microsoft/containerregistry), pulling the images needed to create the following agents in the `azure-arc` namespace:

     | Agent | Description |
     | ----- | ----------- |
     | `deployment.apps/clusteridentityoperator` | Azure Arc-enabled Kubernetes currently supports only [system assigned identities](../../active-directory/managed-identities-azure-resources/overview.md). `clusteridentityoperator` initiates the first outbound communication. This first communication fetches the Managed Service Identity (MSI) certificate used by other agents for communication with Azure. |
     | `deployment.apps/config-agent` | Watches the connected cluster for source control configuration resources applied on the cluster. Updates the compliance state. |
     | `deployment.apps/controller-manager` | An operator of operators that orchestrates interactions between Azure Arc components. |
     | `deployment.apps/metrics-agent` | Collects metrics of other Arc agents to verify optimal performance. |
     | `deployment.apps/cluster-metadata-operator` | Gathers cluster metadata, including cluster version, node count, and Azure Arc agent version. |
     | `deployment.apps/resource-sync-agent` | Syncs the above-mentioned cluster metadata to Azure. |
     | `deployment.apps/flux-logs-agent` | Collects logs from the Flux operators deployed as a part of [source control configuration](conceptual-gitops-flux2.md). |
     | `deployment.apps/extension-manager` | Installs and manages lifecycle of extension Helm charts. |
     | `deployment.apps/kube-aad-proxy` | Used for authentication of requests sent to the cluster using cluster connect. |
     | `deployment.apps/clusterconnect-agent` | Reverse proxy agent that enables the cluster connect feature to provide access to `apiserver` of the cluster. Optional component deployed only if the [cluster connect](conceptual-cluster-connect.md) feature is enabled.  |
     | `deployment.apps/guard` | Authentication and authorization webhook server used for Microsoft Entra RBAC. Optional component deployed only if [Azure RBAC](conceptual-azure-rbac.md) is enabled on the cluster.   |

1. Once all the Azure Arc-enabled Kubernetes agent pods are in `Running` state, verify that your cluster is connected to Azure Arc. You should see:

   * An Azure Arc-enabled Kubernetes resource in [Azure Resource Manager](../../azure-resource-manager/management/overview.md). Azure tracks this resource as a projection of the customer-managed Kubernetes cluster, not the actual Kubernetes cluster itself.
   * Cluster metadata (such as Kubernetes version, agent version, and number of nodes) appearing on the Azure Arc-enabled Kubernetes resource as metadata.

## Next steps

* Walk through our quickstart to [connect a Kubernetes cluster to Azure Arc](./quickstart-connect-cluster.md).
* View release notes to see [details about the latest agent versions](release-notes.md).
* Learn about [upgrading Azure Arc-enabled Kubernetes agents](agent-upgrade.md).
* Learn more about the creating connections between your cluster and a Git repository as a [configuration resource with Azure Arc-enabled Kubernetes](./conceptual-configurations.md).
