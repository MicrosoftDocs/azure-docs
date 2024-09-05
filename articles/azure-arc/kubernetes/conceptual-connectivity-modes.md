---
title: "Azure Arc-enabled Kubernetes connectivity modes"
ms.date: 03/26/2024
ms.topic: conceptual
description: "This article provides an overview of the connectivity modes supported by Azure Arc-enabled Kubernetes"
---

# Azure Arc-enabled Kubernetes connectivity modes

Azure Arc-enabled Kubernetes requires deployment of Azure Arc agents on your Kubernetes clusters so that capabilities such as [configurations (GitOps)](conceptual-gitops-flux2.md), extensions, [cluster connect](conceptual-cluster-connect.md), and [custom location](conceptual-custom-locations.md) are made available on the cluster. Because Kubernetes clusters deployed on the edge may not have constant network connectivity, the agents may not always be able to reach the Azure Arc services while in a semi-connected mode.

## Understand connectivity modes

When working with Azure Arc-enabled Kubernetes clusters, it's important to understand how network connectivity modes impact your operations.

- **Fully connected**: With ongoing network connectivity, agents can consistently communicate with Azure. In this mode, there is typically little delay with tasks such as propagating GitOps configurations, enforcing Azure Policy and Gatekeeper policies, or collecting workload metrics and logs in Azure Monitor.

- **Semi-connected**:  Azure Arc agents can pull desired state specification from the Arc services, then later realize this state on the cluster.

  > [!IMPORTANT]
  > The managed identity certificate pulled down by the `clusteridentityoperator` is valid for up to 90 days before it expires. The agents will try to renew the certificate during this time period; however, if there is no network connectivity, the certificate may expire, and the Azure Arc-enabled Kubernetes resource will stop working. Because of this, we recommend ensuring that the connected cluster has network connectivity at least once every 30 days. If the certificate expires, you'll need to delete and then recreate the Azure Arc-enabled Kubernetes resource and agents in order to reactivate Azure Arc features on the cluster.

- **Disconnected**: Kubernetes clusters in disconnected environments that are unable to access Azure are not currently supported by Azure Arc-enabled Kubernetes.

## Connectivity status

The connectivity status of a cluster is determined by the time of the latest heartbeat received from the Arc agents deployed on the cluster:

| Status | Description |
| ------ | ----------- |
| Connecting | The Azure Arc-enabled Kubernetes resource has been created in Azure, but the service hasn't received the agent heartbeat yet. |
| Connected | The Azure Arc-enabled Kubernetes service received an agent heartbeat within the previous 15 minutes. |
| Offline | The Azure Arc-enabled Kubernetes resource was previously connected, but the service hasn't received any agent heartbeat for at least 15 minutes. |
| Expired | The managed identity certificate of the cluster has expired. In this state, Azure Arc features will no longer work on the cluster. For more information on how to address expired Azure Arc-enabled Kubernetes resources, see the [FAQ](./faq.md#how-do-i-address-expired-azure-arc-enabled-kubernetes-resources). |

## Next steps

- Walk through our quickstart to [connect a Kubernetes cluster to Azure Arc](./quickstart-connect-cluster.md).
- Learn more about creating connections between your cluster and a Git repository as a [configuration resource with Azure Arc-enabled Kubernetes](./conceptual-configurations.md).
- Review the [Azure Arc networking requirements](network-requirements.md).
