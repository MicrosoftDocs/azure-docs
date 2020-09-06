---
title: Create data controller
description: Create an Azure Arc data controller on a typical multi-node Kubernetes cluster which you already have deployed.
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Deploy the Azure Arc data controller

## Overview of installing the Azure Arc data controller

Azure Arc enabled data services can be deployed on multiple different types of Kubernetes clusters and managed Kubernetes services using multiple different approaches.

Currently, the supported list of Kubernetes services and distributions are the following:

- Azure Kubernetes Service (AKS)
- Azure Kubernetes Engine (AKE) on Azure Stack
- Azure Kubernetes Service on Azure Stack HCI
- Azure RedHat OpenShift (ARO)
- OpenShift Container Platform (OCP)
- AWS Elastic Kubernetes Service (EKS)
- Google Cloud Kubernetes Engine (GKE)
- Open source, upstream Kubernetes typically deployed using kubeadm

> **Important:** The minimum supported version of Kubernetes is v1.14.

> **Important:** See the [connectivity requirements](/connectivity.md) to understand what connectivity is required between your environment and Azure.

> **Important:** See the [storage configuration guidance](/storage-configuration.md) to understand the details of how to configure your persistent storage.

> **Important:** If you are using Azure Kubernetes Service, your cluster's worker node VM size should be at least **Standard_D8s_v3** and use **premium disks.**   If you are using another Kubernetes distribution or service, you should ensure that you have a minimum node size of 8 GB RAM and 4 cores and a sum total capacity of 32 GB RAM available across all of your Kubernetes nodes.  For example, you could have 1 node at 32 GB RAM and 4 cores or you could have 2 nodes with 16GB RAM and 4 cores each.

Depending on the deployment option you choose, certain tools will be _required_, but it is recommended to [install all the client tools](install-client-tools.md) before you begin your Azure Arc data controller deployment.

Regardless of the deployment option you choose, during the deployment you will need to provide the following information:

- **Data controller name** - A descriptive name for your data controller - e.g. "Production data controller", "Seattle data controller".
- **Data controller username** - Any username for the data controller administrator user.
- **Data controller password** - A password for the data controller administrator user.
- **Name of your Kubernetes namespace** - the name of the Kubernetes namespace that you want to deploy the data controller into.
- **Connectivity mode** - The [connectivity mode](connectivity.md) of your cluster. Currently only "indirect" is supported.
- **Azure subscription ID** - the Azure subscription GUID for where you want the data controller resource in Azure to be created.
- **Azure resource group name** - the name of the resource group where you want the data controller resource in Azure to be created
- **Azure location** - the Azure location where the data controller resource will be created in Azure - enter one of the following: 
  - eastus
  - eastus2
  - australiaeast
  - centralus
  - westus2
  - westeurope
  - southeastasia
  - koreacentral
  - northeurope
  - westeurope
  - uksouth
  - francecentral

## Next steps

There are multiple options for deploying the Azure Arc data controller:

> **Just want to try things out?**  
> Get started quickly with [Azure Arc JumpStart](https://github.com/microsoft/azure_arc#azure-arc-enabled-data-services) on Azure Kubernetes Service (AKS), AWS Elastic Kubernetes Service (EKS), Google Cloud Kubernetes Engine (GKE) or in an Azure VM!
> 
- [Use the Azure Data CLI (azdata)](create-data-controller-using-azdata.md)
- [Use Azure Data Studio](create-data-controller-azure-data-studio.md)
- [Use the Azure Portal to create a notebook which can be run in Azure Data Studio](create-data-controller-resource-in-azure-portal.md)
- [Use Kubernetes native tools such as kubectl or oc](create-data-controller-using-k8s-native-tools.md)
- [Use Azure Arc JumpStart](https://github.com/microsoft/azure_arc#azure-arc-enabled-data-services)
