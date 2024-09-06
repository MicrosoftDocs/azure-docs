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
* Original Publish Date: 7/26/2024

## Overview
IMPROVING RESILIENCY FOR CLOUD NATIVE NETWORK FUNCTIONS WITH AZURE OPERATOR SERVICE MANAGER CLUSTER REGISTRY

Applies to:
* AOSM ARM API Version: 2023-09-01
* AOSM CNF Arc for Kubernetes Extension Build Number: 1.0.2711-7

## Overview
Azure Operator Service Manager (AOSM) cluster registry enables a local copy of container images in the Nexus K8s cluster. When the containerized network function (CNF) is installed using AOSM with the cluster registry feature turned on, the container images are pulled from the AOSM Artifact Store (supported by Azure Container Registry) and saved locally in the cluster registry. This will ensure that the CNF running in the Nexus K8s cluster can access container images even if there are connectivity issues with the AOSM artifact store.

### Key use cases
Cloud native network functions (CNF) need access to container images not only during the initial deployment using AOSM artifact store but also to keep the network function operational. Some of these scenarios include:
* Pod restarts: pod restarts executed by stopping a pod and starting a pod might also result in the new pod being instantiated on a cluster node without the required images and resulting in container image pulls from that node.
* Kubernetes scheduler operations: Kubernetes scheduler assigns pods to nodes and according to the scheduler profile, Kubernetes might re-assign pods to nodes to meet the profile criteria. This may result in pods being assigned by Kubernetes to nodes without required container images cached locally on the node.

In the above scenarios, if there is a temporary issue with accessing the AOSM artifact store, the cluster registry will provide the necessary container images to prevent disruption to the running CNF. Also, the AOSM cluster registry feature will decrease the number of images pull requests on AOSM artifact store since each Nexus K8s node will pull container images from the cluster registry instead of the AOSM artifact store.

## How cluster registry works
AOSM cluster registry is enabled using the Network Function Operator Arc K8s extension. The CLI example below shows how cluster registry is enabled on a Nexus K8s cluster.
```
az k8s-extension create --name networkfunction-operator --cluster-name <CLUSTER_NAME> --resource-group <RESOURCE_GROUP_NAME> --cluster-type connectedClusters --extension-type Microsoft.Azure.HybridNetwork --scope cluster --release-namespace azurehybridnetwork --config Microsoft.CustomLocation.ServiceAccount=azurehybridnetwork-networkfunctionoperator --config global.networkfunctionextension.enableClusterRegistry=true --config global.networkfunctionextension.clusterRegistry.storageSize=100Gi --version 1.0.2711-7 --auto-upgrade-minor-version false --release-train stable
```
When the cluster registry feature is enabled in the Network Function Operator Arc K8s extension, any container images deployed from AOSM artifact store will be accessible locally in the Nexus K8s cluster. The user can choose the persistent storage size for the cluster registry. If the user does not provide any input, a default persistent volume of 100GB will be set up to store the container images.

## Frequently Asked Questions

### CAN I USE AOSM CLUSTER REGISTRY WITH A CNF APPLICATION PREVIOUSLY INSTALLED USING AOSM APIS?
If there is a CNF application already installed using AOSM on a Nexus Kubernetes cluster, and the AOSM cluster registry feature is turned on, the cluster registry will not have the container images automatically. To use this feature, the cluster registry should be turned on before deploying the network function with AOSM.

### WHICH NEXUS K8S STORAGE CLASS IS USED WITH AOSM CLUSTER REGISTRY?
AOSM cluster registry feature uses nexus-volume storage class to store the container images in the Nexus Kubernetes cluster. By default, a 100GB persistent volume will be created if the user does not specify the size of the cluster registry.

### CAN I CHANGE THE STORAGE SIZE OF THE AOSM CLUSTER REGISTRY AFTER THE INITIAL 
DEPLOYMENT?
It is important to plan for the persistent volume storage size before you install the cluster registry on the Nexus K8s cluster. It cannot be modified after the initial deployment. We recommend to configure the size of the volume by 3x to 4x of the starting installation size of the network function that goes on that cluster.

