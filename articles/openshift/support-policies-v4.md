---
title: Azure Red Hat OpenShift 4 cluster support policy
description: Understand support policy requirements for Red Hat OpenShift 4.
author: sakthi-vetrivel
ms.author: suvetriv
ms.service: container-service
ms.topic: conceptual
ms.date: 04/24/2020
---

# Azure Red Hat OpenShift 4 cluster support policy

This article outlines configuration requirements for Azure Red Hat OpenShift 4 clusters to maintain cluster supportability. In the Azure Red Hat OpenShift 4 service, cluster administrators can modify internal cluster components. Modifications must be made within the policy outlined in this document to maintain support from Microsoft and Red Hat.

> [!NOTE]
> Features marked Technology Preview in OpenShift Container Platform are not supported in Azure Red Hat OpenShift.

## Cluster configuration requirements

* All OpenShift Cluster operators must remain in a managed state. The list of cluster operators can be returned by running `oc get clusteroperators`.
* The cluster Prometheus and Alertmanager services must not be removed or modified.  Service Alertmanager rules must not be removed.
* The Azure Red Hat OpenShift service sets the OpenShift cluster version.  It must not be modified.
* Azure Red Hat OpenShift service logging (mdsd pods) must not be removed or modified.
* The 'arosvc.azurecr.io' cluster pull secret must not be removed or modified.
* All cluster virtual machines must have outbound internet access, at least to the Azure Resource Manager (ARM) and service logging (Geneva) endpoints.
* The Azure Red Hat OpenShift service accesses your cluster via Private Link Service.  Service access must not be removed or modified.
* Non-RHCOS compute nodes are not supported. For example, you cannot use a RHEL compute node.

## Supported virtual machine sizes

Azure Red Hat OpenShift 4 supports worker node instances on the following virtual machine sizes:

### General purpose

|Series|Size|vCPU|Memory: GiB|
|-|-|-|-|
|Dasv4|Standard_D4as_v4|4|16|
|Dasv4|Standard_D8as_v4|8|32|
|Dasv4|Standard_D16as_v4|16|64|
|Dasv4|Standard_D32as_v4|32|128|
|Dsv3|Standard_D4s_v3|4|16|
|Dsv3|Standard_D8s_v3|8|32|
|Dsv3|Standard_D16s_v3|16|64|
|Dsv3|Standard_D32s_v3|32|128|

### Memory optimized

|Series|Size|vCPU|Memory: GiB|
|-|-|-|-|
|Esv3|Standard_E4s_v3|4|32|
|Esv3|Standard_E8s_v3|8|64|
|Esv3|Standard_E16s_v3|16|128|
|Esv3|Standard_E32s_v3|32|256|

### Compute optimized

|Series|Size|vCPU|Memory: GiB|
|-|-|-|-|
|Fsv2|Standard_F4s_v2|4|8|
|Fsv2|Standard_F8s_v2|8|16|
|Fsv2|Standard_F16s_v2|16|32|
|Fsv2|Standard_F32s_v2|32|64|
