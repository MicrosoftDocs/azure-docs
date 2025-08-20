---
title: Azure Operator Nexus cluster deployment overview
description: Get an overview of cluster deployment for Azure Operator Nexus.
author: sbatchu
ms.author: sbatchu
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 08/05/2024
ms.custom: template-concept
---

# Azure Operator Nexus cluster
Azure Operator Nexus is built on basic constructs like compute servers, storage appliances, and network fabric devices. Azure Operator Nexus cluster represents an on-premises deployment of the platform. The lifecycle of platform-specific resources is dependent on the cluster state.

## Cluster deployment overview

During the cluster deployment, cluster undergoes various lifecycle phases, which have specific roles designated to ensure the target state is achieved.

### Hardware Validation phase:

Hardware Validation is initiated during the cluster deployment process, assessing the state of hardware components for the machines provided through the Cluster's rack definition. Based on the results of these checks and any user skipped machines, a determination is done on whether sufficient nodes passed and/or are available to meet the thresholds necessary for deployment to continue.

> **Note:**  
> Hardware validation thresholds are enforced for various node types to ensure reliable cluster operation:
> Management nodes are divided into two roles: Kubernetes Control Plane (KCP) nodes and Nexus Management Plane Nodes (NMP) nodes.
> - **KCP nodes:** Must achieve a 100% hardware validation success rate since they make up the control plane.
> - **NMP nodes:** These are grouped into two management groups, with each group required to meet a 50% hardware validation success rate.
> - **Compute nodes:** Must meet the thresholds specified by the deployment input.

Hardware validation results for a given server are written into the Log Analytics Workspace(LAW), which is provided as part of the cluster creation. The results include the following categories:
- system_info
- drive_info
- network_info
- health_info
- boot_info

This article provides instructions on how to check hardware results information [Troubleshoot Hardware validation](troubleshoot-hardware-validation-failure.md)

### Bootstrap phase:

Once the Hardware Validation is successful and the thresholds necessary for deployment to continue are met, bootstrap image is generated for cluster deploy action on the cluster manager. This image iso URL is used to bootstrap the ephemeral node, which would deploy the target cluster components, which are provisioning the kubernetes control plane (KCP), Nexus Management plane (NMP), and storage appliance. These various states are reflected in the cluster status, which these stages are executed as part of the ephemeral bootstrap workflow.

The ephemeral bootstrap node sequentially provisions each KCP node, and if a KCP node fails to provision, the cluster deployment action fails, marking the cluster status as failed. The Bootstrap operator manages the provisioning process for bare-metal nodes using the PXE boot approach.

Once KCP nodes are successfully provisioned, the deployment action proceeds to provision NMP nodes in parallel. Each management group must achieve at least a 50% provisioning success rate. If this requirement is not met, the cluster deployment action fails, resulting in the cluster status being marked as failed.

Upon successful provisioning of NMP nodes, up to two storage appliances are created before the deployment action proceeds with provisioning the compute nodes. Compute nodes are provisioned in parallel, and once the defined compute node threshold is met, the cluster status transitions from Deploying to Running. However, the remaining nodes continue undergoing the provisioning process until they too are successfully provisioned.


## Cluster operations

- **List cluster**: List cluster information in the provided resource group or subscription.
- **Show cluster**: Get properties of the provided cluster.
- **Update cluster**: Update properties or tags of the provided cluster.
