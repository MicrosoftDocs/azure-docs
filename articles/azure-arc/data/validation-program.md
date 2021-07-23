---
title: "Azure Arc-enabled data services validation program"
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.date: 07/30/2021
ms.topic: conceptual
author: MikeRayMSFT
ms.author: mikeray
description: "Describes validation program for Kubernetes distributions for Azure Arc-enabled data services."
keywords: "Kubernetes, Arc, Azure, K8s, validation, data services, SQL Managed Instance"
---

# Azure Arc-enabled data services Kubernetes validation program

Azure Arc-enabled data services team has worked with industry partners to validate specific distributions and solutions to host Azure Arc-enabled data services. This validation extends the [Azure Arc-enabled Kubernetes validation](../kubernetes/validation-program.md) for the data services. This article identifies partner solutions, versions, Kubernetes versions, SQL Server versions, and PostgreSQL Hyperscale versions that have been verified to support the data services. 

> [!NOTE]
> At the current time, Azure Arc-enabled SQL Managed Instance is generally available in select regions.
>
> Azure Arc-enabled PostgreSQL Hyperscale is available for preview in select regions.

## Partners

### Dell

|Solution and version | Kubernetes version | Azure Arc-enabled data services version | SQL Server version | PostgreSQL Hyperscale version
|-----|-----|-----|-----|-----|
| Dell EMC PowerFlex |1.19.7|20.3.3|SQL Server 2019 (15.0.4123) | |
| PowerFlex version 3.6 |1.19.7|20.3.3|SQL Server 2019 (15.0.4123) | |
| PowerFlex CSI version 1.4 |1.19.7|20.3.3|SQL Server 2019 (15.0.4123) | |
| PowerStore X|1.20.6|20.3.3|SQL Server 2019 (15.0.4123) |postgres 12.3 (Ubuntu 12.3-1) |
| Powerstore T|1.20.6|20.3.3|SQL Server 2019 (15.0.4123) |postgres 12.3 (Ubuntu 12.3-1)|

### Red Hat

|Solution and version | Kubernetes version | Azure Arc-enabled data services version | SQL Server version | PostgreSQL Hyperscale version
|-----|-----|-----|-----|-----|
| OpenShift v.7.13 | 1.20.0 | 20.3.5 | SQL Server 2019 (15.0.4138)|postgres 12.3 (Ubuntu 12.3-1)|

### Nutanix

|Solution and version | Kubernetes version | Azure Arc-enabled data services version | SQL Server version | PostgreSQL Hyperscale version
|-----|-----|-----|-----|-----|
| Karbon 2.2<br/>AOS: 5.19.1.5<br/>AHV:20201105.1021<br/>PC: Version pc.2021.3.02<br/> | 1.19.8-0 | 20.3.4 | SQL Server 2019 (15.0.4123)|postgres 12.3 (Ubuntu 12.3-1)|

### PureStorage

|Solution and version | Kubernetes version | Azure Arc-enabled data services version | SQL Server version | PostgreSQL Hyperscale version
|-----|-----|-----|-----|-----|
| Portworx Enterprise 2.7 | 1.20.7 | 20.3.5 | SQL Server 2019 (15.0.4138)||

### VMware

|Solution and version | Kubernetes version | Azure Arc-enabled data services version | SQL Server version | PostgreSQL Hyperscale version
|-----|-----|-----|-----|-----|
| TKGm v1.3.1 | 1.20.5 | 20.3.3 | SQL Server 2019 (15.0.4123)|postgres 12.3 (Ubuntu 12.3-1)|

## Validated distributions

!!!!!(This section is copied from [Azure Arc-enabled Kubernetes validation](../kubernetes/validation-program.md)) REPLACE!!!!

The following Microsoft provided Kubernetes distributions and infrastructure providers have successfully passed the conformance tests for Azure Arc-enabled data services:

| Distribution and infrastructure provider | Version |
| ---------------------------------------- | ------- |
| Cluster API Provider on Azure            | Release version: [0.4.12](https://github.com/kubernetes-sigs/cluster-api-provider-azure/releases/tag/v0.4.12); Kubernetes version: [1.18.2](https://github.com/kubernetes/kubernetes/releases/tag/v1.18.2) |
| AKS on Azure Stack HCI                   | Release version: [December 2020 Update](https://github.com/Azure/aks-hci/releases/tag/AKS-HCI-2012); Kubernetes version: [1.18.8](https://github.com/kubernetes/kubernetes/releases/tag/v1.18.8) |

The following providers and their corresponding Kubernetes distributions have successfully passed the conformance tests for Azure Arc-enabled Kubernetes:

| Provider name | Distribution name | Version |
| ------------ | ----------------- | ------- |
| RedHat       | [OpenShift Container Platform](https://www.openshift.com/products/container-platform) | [4.7.13](https://docs.openshift.com/container-platform/4.7/release_notes/ocp-4-7-release-notes.html) |
| Nutanix      | [Karbon](https://www.nutanix.com/products/karbon)    | Version 2.2.1 |

The Azure Arc team also ran the conformance tests and validated Azure Arc-enabled Kubernetes scenarios on the following public cloud providers:

| Public cloud provider name | Distribution name | Version |
| -------------------------- | ----------------- | ------- |
| Amazon Web Services        | Elastic Kubernetes Service (EKS) | v1.18.9  |
| Google Cloud Platform      | Google Kubernetes Engine (GKE) | v1.17.15 |

## Scenarios validated

!!!!!(This section is copied from [Azure Arc-enabled Kubernetes validation](../kubernetes/validation-program.md)) REPLACE!!!!

The conformance tests run as part of the Azure Arc-enabled Kubernetes validation cover the following scenarios:

1. Connect Kubernetes clusters to Azure Arc: 
    * Deploy Azure Arc-enabled Kubernetes agent Helm chart on cluster.
    * Set up Managed System Identity (MSI) certificate on cluster.
    * Agents send cluster metadata to Azure.

2. Configuration: 
    * Create configuration on top of Azure Arc-enabled Kubernetes resource.
    * [Flux](https://docs.fluxcd.io/), needed for setting up GitOps workflow, is deployed on the cluster.
    * Flux pulls manifests and Helm charts from demo Git repo and deploys to cluster.

## Next steps

[Create a data controller](create-data-controller.md)