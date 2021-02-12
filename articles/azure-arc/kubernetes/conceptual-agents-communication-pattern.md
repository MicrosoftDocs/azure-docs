---
title: "Agents and communication pattern - Azure Arc enabled Kubernetes"
services: azure-arc
ms.service: azure-arc
ms.date: 02/08/2021
ms.topic: conceptual
author: shashankbarsin
ms.author: shasb
description: "This article provides an architectural overview of Azure Arc enabled Kubernetes agents and their communication pattern."
keywords: "Kubernetes, Arc, Azure, containers"
---

# Agents and communication pattern - Azure Arc enabled Kubernetes

[Kubernetes](https://kubernetes.io/) is an open-source container orchestration engine for automating the deployment, scaling, and management of containerized applications. Kubernetes has emerged as the go-to containerized workload deployment solution across hybrid and multi-cloud environments. Since Kubernetes’ rise in popularity, customers have an increasing need for a centralized control plane to consistently handle management scenarios like policy, governance, monitoring, and security. 

Azure Arc enabled Kubernetes meets this need by enabling [Azure Resource Manager](../../azure-resource-manager/management/overview.md) to handle customer-managed Kubernetes clusters on any environment (on-prem or hybrid). This article provides:

* An architectural overview of connecting a cluster to Azure Arc.
* The connectivity pattern followed by agents.
* A tabulation of the data exchanged between cluster environment and Azure.

## Deployment of agents on cluster

Most on-prem datacenters enforce strict network rules that prevent inbound communication on the firewall used at the network boundary. Azure Arc enabled Kubernetes works with these restrictions by only enabling selective egress endpoints for outbound communication and not any inbound ports on the firewall. Azure Arc enabled Kubernetes agents deployed on the customer-managed Kubernetes cluster initiate this outbound communication. 

![Architectural overview](./media/architectural-overview.png)

Connect a cluster to Azure Arc using the following steps:

1. Spin up a Kubernetes cluster on your choice of infrastructure (vSphere, AWS, GCP, etc.). 
> [!NOTE]
> Customers are required to handle the lifecycle management of their Kubernetes cluster separately, as Azure Arc enabled Kubernetes currently only supports attaching existing Kubernetes clusters to Azure Arc.  
> The Azure Arc team is prioritizing Arc-based cluster provisioning and lifecycle management.
1. Initiate the Azure Arc registration for your spun up cluster using Azure CLI.
    * Azure CLI internally uses Helm to deploy the agent Helm chart on the cluster.
    * The cluster nodes initiate an outbound communication to the Microsoft Container Registry and pull the images needed to create the following agents in the `azure-arc` namespace:
        | Agent | Description |
        | ----- | ----------- |
        | `deployment.apps/clusteridentityoperator` | Azure Arc enabled Kubernetes currently supports system assigned identity. clusteridentityoperator makes the first outbound communication needed to fetch the managed service identity (MSI) certificate used by other agents for communication with Azure. |
        | `deployment.apps/config-agent` | Watches the connected cluster for source control configuration resources applied on the cluster and updates compliance state |
        | `deployment.apps/controller-manager` | An operator of operators that orchestrates interactions between Azure Arc components |    
        | `deployment.apps/metrics-agent` | Collects metrics of other Arc agents to ensure that these agents are exhibiting optimal performance |
        | `deployment.apps/cluster-metadata-operator` | Gathers cluster metadata - cluster version, node count, and Azure Arc agent version |
        | `deployment.apps/resource-sync-agent` | Syncs the above mentioned cluster metadata to Azure |
        | `deployment.apps/flux-logs-agent` | Collects logs from the flux operators deployed as a part of source control configuration |
1. Once all the Azure Arc enabled Kubernetes agents are up and running, determine whether your cluster successfully connected to Azure Arc. You should see:
    * An Azure Arc enabled Kubernetes resource in Azure Resource Manager. This is a tracked resource in Azure acting as a projection of the customer-managed Kubernetes cluster. This is not the actual Kubernetes cluster itself.
    * Cluster metadata, like Kubernetes version, agent version, and number of nodes, appears on the Azure Arc enabled Kubernetes resource as metadata.

## Data exchange between cluster environment and Azure

| Data type | Scenario | Communication mode |
| --------- | -------- | ------------------ |
| Kubernetes cluster version | Cluster metadata | Agent pushes to Azure |
| Number of nodes in the cluster | Cluster metadata | Agent pushes to Azure |
| Agent version | Cluster metadata | Agent pushes to Azure |
| Kubernetes distribution type | Cluster metadata | Azure CLI pushes to Azure |
| Infrastructure type (AWS/GCP/vSphere/...) | Cluster metadata | Azure CLI pushes to Azure |
| vCPU count of nodes in the cluster | Billing | Azure CLI pushes to Azure |
| Agent heartbeat | Resource Health | Agent pushes to Azure |
| Resource consumption (memory/CPU) by agents | Diagnostics and supportability | Agent pushes to Azure |
| Logs of all agent containers | Diagnostics and supportability | Agent pushes to Azure |
| Agent upgrade availability | Agent upgrade | Agent pulls from Azure |
| Desired state of Configuration - Git repo URL, flux operator parameters, private key, known hosts content, HTTPS username, token/password | Configuration | Agent pulls from Azure |
| Status of flux operator installation | Configuration | Agent pushes to Azure |
| Azure Policy assignments that need Gatekeeper enforcement within cluster | Azure Policy | Agent pulls from Azure |
| Audit and compliance status of in-cluster policy enforcements | Azure Policy | Agent pushes to Azure |
| Metrics and logs of customer workloads | Azure Monitor | Agent pushes to Log Analytics workspace resource in customer's tenant and subscription |

## Connectivity status

| Status | Description |
| ------ | ----------- |
| Connecting | Azure Arc enabled Kubernetes resource created in Azure Resource Manager, but service hasn't received agent heartbeat yet. |
| Connected | Azure Arc enabled Kubernetes service received agent heartbeat sometime within the previous 15 minutes. |
| Offline | Azure Arc enabled Kubernetes resource was previously connected, but the service hasn't received any agent heartbeat for 15 minutes. |
| Expired | Managed service identity (MSI) certificate has expired. First, run `az connectedk8s delete` to delete Azure Arc enabled Kubernetes resource and agents on the cluster. Then run `az connectedk8s connect` again to create the Azure Arc enabled Kubernetes resource and deploy agents on the cluster. Note that `az connectedk8s delete` will also delete configurations on top of the cluster. After running `az connectedk8s connect`, create the configurations on the cluster again, either manually by you or by Azure Policy. |

## Understand connectivity modes

| Connectivity mode | Description |
| ----------------- | ----------- |
| Fully connected | Azure Arc enabled Kubernetes works seamlessly for fully connected mode of deployment where agents are always able to reach out to Azure. |
| Semi-connected | The managed service identity (MSI) certificate pulled down by the `clusteridentityoperator` is valid for 90 days maximum before the certificate expires. Once the certificate expires, the Azure Arc enabled Kubernetes resource stops working. Delete and recreate the Azure Arc enabled Kubernetes resource and agents to get all the Arc features to work on the cluster. During the 90 days, users are strongly recommended to connect the cluster at least once every 30 days. |
| Disconnected | Kubernetes clusters in completely disconnected environments without any access to Azure are currently not supported by Azure Arc enabled Kubernetes. If this capability is of interest to you, submit or up-vote an idea on [Azure Arc's UserVoice forum](https://feedback.azure.com/forums/925690-azure-arc).
