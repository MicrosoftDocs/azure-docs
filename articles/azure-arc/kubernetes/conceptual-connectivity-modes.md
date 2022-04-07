---
title: "Azure Arc-enabled Kubernetes connectivity modes"
services: azure-arc
ms.service: azure-arc
ms.date: 11/23/2021
ms.topic: conceptual
author: shashankbarsin
ms.author: shasb
description: "This article provides an overview of the connectivity modes supported by Azure Arc-enabled Kubernetes"
keywords: "Kubernetes, Arc, Azure, containers"
---

# Azure Arc-enabled Kubernetes connectivity modes

Azure Arc-enabled Kubernetes requires deployment of Azure Arc agents on your Kubernetes clusters using which capabilities like configurations (GitOps), extensions, Cluster Connect and Custom Location are made available on the cluster. Kubernetes clusters deployed on the edge may not have constant network connectivity and as a result the agents may not be able to always reach the Azure Arc services. This semi-connected mode however is a supported scenario. To support semi-connected modes of deployment, for features like configurations and extensions, agents rely on pulling of desired state specification from the Arc services and later realizing this state on the cluster.

## Understand connectivity modes

| Connectivity mode | Description |
| ----------------- | ----------- |
| Fully connected | Agents can consistently communicate with Azure with little delay in propagating GitOps configurations, enforcing Azure Policy and Gatekeeper policies, and collecting workload metrics and logs in Azure Monitor. |
| Semi-connected | The managed identity certificate pulled down by the `clusteridentityoperator` is valid for up to 90 days before the certificate expires. Upon expiration, the Azure Arc-enabled Kubernetes resource stops working. To reactivate all Azure Arc features on the cluster, delete, and recreate the Azure Arc-enabled Kubernetes resource and agents. During the 90 days, connect the cluster at least once every 30 days. |
| Disconnected | Kubernetes clusters in disconnected environments unable to access Azure are currently unsupported by Azure Arc-enabled Kubernetes. If this capability is of interest to you, submit or up-vote an idea on [Azure Arc's UserVoice forum](https://feedback.azure.com/d365community/forum/5c778dec-0625-ec11-b6e6-000d3a4f0858).


## Connectivity status

The connectivity status of a cluster is determined by the time of the latest heartbeat received from the Arc agents deployed on the cluster:

| Status | Description |
| ------ | ----------- |
| Connecting | Azure Arc-enabled Kubernetes resource is created in Azure Resource Manager, but service hasn't received the agent heartbeat yet. |
| Connected | Azure Arc-enabled Kubernetes service received an agent heartbeat sometime within the previous 15 minutes. |
| Offline | Azure Arc-enabled Kubernetes resource was previously connected, but the service hasn't received any agent heartbeat for 15 minutes. |
| Expired | Managed identity certificate of the cluster has an expiration window of 90 days after it is issued. Once this certificate expires, the resource is considered `Expired` and all features such as configuration, monitoring, and policy stop working on this cluster. More information on how to address expired Azure Arc-enabled Kubernetes resources can be found [in the FAQ article](./faq.md#how-do-i-address-expired-azure-arc-enabled-kubernetes-resources). |

## Next steps

* Walk through our quickstart to [connect a Kubernetes cluster to Azure Arc](./quickstart-connect-cluster.md).
* Learn more about the creating connections between your cluster and a Git repository as a [configuration resource with Azure Arc-enabled Kubernetes](./conceptual-configurations.md).
