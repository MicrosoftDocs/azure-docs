---
title: "Agents and communication pattern"
services: azure-arc
ms.service: azure-arc
ms.date: 02/08/2021
ms.topic: conceptual
author: shashankbarsin
ms.author: shasb
description: "This article provides an architectural overview of Azure Arc enabled Kubernetes agents and their communication pattern."
keywords: "Kubernetes, Arc, Azure, containers"
---

# Agents and communication pattern

[Kubernetes](https://kubernetes.io/) is an open source container orchestration engine for automating deployment, scaling, and management of containerized applications. The emergence of Kubernetes as the go-to option for deploying containerized workloads across different hybrid and multi-cloud environments has led to the need for a centralized control plane to consistently handle management scenarios like policy, governance, monitoring and security. Azure Arc enabled Kubernetes intends to solve this problem by allowing for customer managed Kubernetes clusters on any environment (on-prem or hybrid) to brought into the fold of [Azure Resource Manager](../../azure-resource-manager/management/overview.md). This document provides an architectural overview of how this is achieved.

## Deployment of agents on cluster

Most on-premise data centers have strict network rules in place that doesn't allow for enabling inbound communication on the firewall used at the network boundary. Azure Arc enabled Kubernetes addresses this constraint by only requiring enablement of selective egress endpoints for outbound communication and does not require any inbound ports to be enabled on the firewall. The outbound communication initiation is done by Azure Arc enabled Kubernetes agents deployed on the customer managed Kubernetes cluster.

![Architectural overview](./media/architectural-overview.png)

The sequence of steps involved in this is as follows:

1. Customer spins up a Kubernetes cluster on their choice of infrastructure (vSphere, AWS, GCP,...). Note that currently Azure Arc enabled Kubernetes only supports attaching existing Kubernetes clusters to Azure Arc. At this moment, lifecycle management of the Kubernetes cluster itself needs to be done by the customer separately. Having said that, Azure Arc based cluster provisioning and lifecycle management is high on the roadmap items the team is working on.
1. Customer uses Azure CLI on a machine having line of sight to this Kubernetes cluster to initiate registration of this cluster with Azure Arc. 
1. The Azure CLI internally uses Helm to deploy the agent Helm chart on the cluster
1. The images needed to spin up these agents are all pulled from Microsoft Container Registry. The image pull process is initiated by an outbound communication to the container registry initiated by the nodes of the cluster.
1. The following agents get created in the `azure-arc` namespace of the during this process:
    * `deployment.apps/clusteridentityoperator`: Azure Arc enabled Kubernetes currently supports system assigned identity. clusteridentityoperator makes the first outbound communication needed to fetch the managed service identity (MSI) certificate used by other agents for communication with Azure.
    * `deployment.apps/config-agent`: watches the connected cluster for source control configuration resources applied on the cluster and updates compliance state
    * `deployment.apps/controller-manager`: is an operator of operators and orchestrates interactions between Azure Arc components
    * `deployment.apps/metrics-agent`: collects metrics of other Arc agents to ensure that these agents are exhibiting optimal performance
    * `deployment.apps/cluster-metadata-operator`: gathers cluster metadata - cluster version, node count, and Azure Arc agent version
    * `deployment.apps/resource-sync-agent`: syncs the above mentioned cluster metadata to Azure
    * `deployment.apps/flux-logs-agent`: collects logs from the flux operators deployed as a part of source control configuration
1. At this stage, once all the Azure Arc enabled Kubernetes agents are up and running, you should be able to see the following:
    1. Azure Arc enabled Kubernetes resource in Azure Resource Manager. Note that this is a tracked resource in Azure acting as a projection of the customer managed Kubernetes cluster and is not the actual Kubernetes cluster itself.
    1. Cluster metadata like Kubernetes version, agent version and number of nodes visible on the Arc enabled Kubernetes resource as metadata. This indicates that the process of connecting the cluster to Arc was successful.

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

## Connectivity pattern - Fully connected, semi-connected and disconnected clusters

**Fully connected:** Azure Arc enabled Kubernetes works seamlessly for fully connected mode of deployed where agents are always able to reach out to Azure.

**Semi-connected:** The managed service identity (MSI) certificate pulled down by the `clusteridentityoperator` is valid for a maximum of 90 days before the certificate expires. Once the certificate expires, the Arc enabled Kubernetes resource stops working and the only way to get all the Arc features working on the cluster again is to delete the Arc enabled Kubernetes resource and agents and create them again. Note that while the certificate is valid for a maximum of 90 days, it is strongly recommended to connect the cluster at least once every 30 days.

**Completely disconnected:** Kubernetes clusters in completely disconnected environments not having any access to Azure is currently not supported by Azure Arc enabled Kubernetes. If this is of interest to you, please submit/up-vote an idea on [Azure Arc's UserVoice forum](https://feedback.azure.com/forums/925690-azure-arc).

