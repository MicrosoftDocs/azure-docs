---
title: Azure Red Hat OpenShift 4 cluster support policy
description: Understand support policy requirements for Red Hat OpenShift 4.
author: sakthi-vetrivel
ms.author: suvetriv
ms.service: container-service
ms.topic: conceptual
ms.date: 04/24/2020
---

# Azure Red Hat OpenShift support policy

Certain configurations for Azure Red Hat OpenShift 4 clusters can affect your cluster's supportability. Azure Red Hat OpenShift 4 allows cluster administrators to make changes to internal cluster components, but not all changes are supported. The support policy below shares what modifications violate the policy and void support from Microsoft and Red Hat.

> [!NOTE]
> Features marked Technology Preview in OpenShift Container Platform are not supported in Azure Red Hat OpenShift.

## Cluster configuration requirements

* All OpenShift Cluster operators must remain in a managed state. The list of cluster operators can be returned by running `oc get clusteroperators`.
* Don't remove or modify the cluster Prometheus and Alertmanager services.
* Don't remove Service Alertmanager rules.
* Don't modify the OpenShift cluster version.
* Don't remove or modify Azure Red Hat OpenShift service logging (mdsd pods).
* Don't remove or modify the 'arosvc.azurecr.io' cluster pull secret.
* All cluster virtual machines must have direct outbound internet access, at least to the Azure Resource Manager (ARM) and service logging (Geneva) endpoints.  No form of HTTPS proxying is supported.
* Don't modify the DNS configuration of the cluster's virtual network. The default Azure DNS resolver must be used.
* Don't override any of the cluster's MachineConfig objects (for example, the kubelet configuration) in any way.
* The Azure Red Hat OpenShift service accesses your cluster via Private Link Service.  Don't remove or modify service access.
* Non-RHCOS compute nodes aren't supported. For example, you can't use a RHEL compute node.

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

### Master nodes

|Series|Size|vCPU|Memory: GiB|
|-|-|-|-|
|Dsv3|Standard_D8s_v3|8|32|
|Dsv3|Standard_D16s_v3|16|64|
|Dsv3|Standard_D32s_v3|32|128|
