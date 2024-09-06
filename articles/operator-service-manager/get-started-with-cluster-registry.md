---
title: Get started with Azure Operator Service Manager Cluster Registry
description: Azure Operator Service Manager cluster registry feature provides a locally resilent edge registry service to host Nexus K8s container image artifacts.
author: msftadam
ms.author: adamdor
ms.date: 09/06/2024
ms.topic: get-started
ms.service: azure-operator-service-manager
---

# Get started with Cluster Registry
AOSM CNF CLUSTER REGISTRY
* Original Author: Tobias Weisserth
* Original Publish Date: July 26th, 2024

## Overview
IMPROVING RESILIENCY FOR CLOUD NATIVE NETWORK FUNCTIONS WITH AZURE OPERATOR SERVICE MANAGER CLUSTER REGISTRY

Applies to:
* AOSM ARM API Version: 2023-09-01
* AOSM CNF Arc for Kubernetes Extension Build Number: 1.0.2711-7

## Introduction
Azure Operator Service Manager (AOSM) cluster registry (CR) enables a local copy of container images in the Nexus K8s cluster. When the containerized network function (CNF) is installed with cluster registry enabled, the container images are pulled from the remote AOSM artifact store and saved to a local regitsry. With cluster register, CNF access to container images survives loss of connectivity to the remove artifact store.

### Key use cases
Cloud native network functions (CNF) need access to container images, not only during the initial deployment using AOSM artifact store, but also to keep the network function operational. Some of these scenarios include:
* Pod restarts: Stopping and starting a pod can result in a cluster node pulling container images from the registry.
* Kubernetes scheduler operations: When reassigning pods to new nodes, according to scheduler profile rules, if the new node does not have the container images locally cached, the node will pull container images from the registry.

In the above scenarios, if there is a temporary issue with accessing the AOSM artifact store, the cluster registry provides the necessary container images to prevent disruption to the running CNF. Also, the AOSM cluster registry feature decreases the number of image pull requests on AOSM artifact store since each Nexus K8s node pulls container images from the cluster registry instead of the AOSM artifact store.

## How cluster registry works
AOSM cluster registry is enabled using the Network Function Operator Arc K8s extension. The following CLI shows how cluster registry is enabled on a Nexus K8s cluster.
```
az k8s-extension create --name networkfunction-operator --cluster-name <CLUSTER_NAME> --resource-group <RESOURCE_GROUP_NAME> --cluster-type connectedClusters --extension-type Microsoft.Azure.HybridNetwork --scope cluster --release-namespace azurehybridnetwork --config Microsoft.CustomLocation.ServiceAccount=azurehybridnetwork-networkfunctionoperator --config global.networkfunctionextension.enableClusterRegistry=true --config global.networkfunctionextension.clusterRegistry.storageSize=100Gi --version 1.0.2711-7 --auto-upgrade-minor-version false --release-train stable
```
When the cluster registry feature is enabled in the Network Function Operator Arc K8s extension, any container images deployed from AOSM artifact store are accessible locally in the Nexus K8s cluster. The user can choose the persistent storage size for the cluster registry. 

> [!NOTE]
> If the user does not provide any input, a default persistent volume of 100 GB is used.

## Frequently Asked Questions

### CAN I USE AOSM CLUSTER REGISTRY WITH A CNF APPLICATION PREVIOUSLY INSTALLED USING AOSM APIS?
If there is a CNF application already installed using AOSM on a Nexus Kubernetes cluster, and the AOSM cluster registry feature is turned on, the cluster registry doest not have the container images automatically. To use this feature, the cluster registry should be turned on before deploying the network function with AOSM.

### WHICH NEXUS K8S STORAGE CLASS IS USED WITH AOSM CLUSTER REGISTRY?
AOSM cluster registry feature uses nexus-volume storage class to store the container images in the Nexus Kubernetes cluster. By default, a 100 GB persistent volume is created if the user does not specify the size of the cluster registry.

### CAN I CHANGE THE STORAGE SIZE OF THE AOSM CLUSTER REGISTRY AFTER THE INITIAL 
DEPLOYMENT?
It is important to plan for the persistent volume storage size before you install the cluster registry on the Nexus K8s cluster. It cannot be modified after the initial deployment. We recommend configuring the size of the volume by 3x to 4x of the starting installation size of the network function that goes on that cluster.

