---
title: "Data exchanged between Azure Arc-enabled Kubernetes cluster and Azure"
ms.date: 08/08/2023
ms.topic: conceptual
description: "The scenarios enabled by Azure Arc-enabled Kubernetes involve exchange of desired state configurations, metadata, and other scenario specific operational data."
---

# Data exchanged between Azure Arc-enabled Kubernetes cluster and Azure

Azure Arc-enabled Kubernetes scenarios involve exchange of desired state configurations, metadata, and other scenario specific operational data between the Azure Arc-enabled Kubernetes cluster environment and Azure service. For all types of data, the Azure Arc agents initiate outbound communication to Azure services and thus require only egress access to endpoints listed under the [network prerequisites](network-requirements.md). Enabling inbound ports on firewall is not required for Azure Arc agents.

The following table presents a per-scenario breakdown of the data exchanged between these environments.

## Data exchange between cluster and Azure

| Scenario | Metadata | Communication mode |
| --------- | -------- | ------------------ |
| Cluster metadata | Kubernetes cluster version | Agent pushes to Azure |
| Cluster metadata | Number of nodes in the cluster | Agent pushes to Azure |
| Cluster metadata | Agent version | Agent pushes to Azure |
| Cluster metadata | Kubernetes distribution type | Azure CLI pushes to Azure |
| Cluster metadata | Infrastructure type (AWS/GCP/vSphere/...) | Azure CLI pushes to Azure |
| Cluster metadata | vCPU count of nodes in the cluster | Agent pushes to Azure |
| Resource Health | Agent heartbeat | Agent pushes to Azure |
| Diagnostics and supportability | Resource consumption (memory/CPU) by agents | Agent pushes to Azure |
| Diagnostics and supportability | Logs of all agent containers | Agent pushes to Azure |
| Agent upgrade | Agent upgrade availability | Agent pulls from Azure |
| Configuration (GitOps) | Desired state of configuration: Git repository URL, flux operator parameters, private key, known hosts content, HTTPS username, token, or password | Agent pulls from Azure |
| Configuration (GitOps) | Status of flux operator installation | Agent pushes to Azure |
| Extensions | Desired state of extension: extension type, configuration settings, protected configuration settings, release train, auto-upgrade settings | Agent pulls from Azure |
| Azure Policy | Azure Policy assignments that need Gatekeeper enforcement within cluster | Agent pulls from Azure |
| Azure Policy | Audit and compliance status of in-cluster policy enforcements | Agent pushes to Azure |
| Azure Monitor | Metrics and logs of customer workloads | Agent pushes to Log Analytics workspace resource in customer's tenant and subscription |
| Cluster Connect | Requests sent to cluster | Outbound session established with Arc service by clusterconnect-agent used to send requests to cluster |
| Custom Location | Metadata on namespace and ClusterRoleBinding/RoleBinding for authorization | Outbound session established with Arc service by clusterconnect-agent used to send requests to cluster |
| Resources on top of custom location | Desired specifications of databases or application instances | Outbound session established with Arc service by clusterconnect-agent used to send requests to cluster |

## Next steps

* Walk through our quickstart to [connect a Kubernetes cluster to Azure Arc](./quickstart-connect-cluster.md).
* Learn about creating connections between your cluster and a Git repository as a [configuration resource with Azure Arc-enabled Kubernetes](./conceptual-configurations.md).


