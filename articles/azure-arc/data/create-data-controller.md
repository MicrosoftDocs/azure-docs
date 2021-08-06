---
title: Create data controller
description: Create an Azure Arc data controller on a typical multi-node Kubernetes cluster which you already have deployed.
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 07/30/2021
ms.topic: how-to
---

# Create the Azure Arc data controller


## Overview of creating the Azure Arc data controller

Azure Arc—enabled data services can be created on multiple different types of Kubernetes clusters and managed Kubernetes services using multiple different approaches.

Currently, the supported list of Kubernetes services and distributions are the following:

- Azure Kubernetes Service (AKS)
- Azure Kubernetes Service on Azure Stack HCI
- Azure RedHat OpenShift (ARO)
- OpenShift Container Platform (OCP)
- AWS Elastic Kubernetes Service (EKS)
- Google Cloud Kubernetes Engine (GKE)
- Open source, upstream Kubernetes typically deployed using kubeadm

> [!IMPORTANT]
> * The minimum supported version of Kubernetes is v1.17. See [Known issues](./release-notes.md#known-issues) for additional information. 
> * The minimum supported version of OCP is 4.5.
> * See the [connectivity requirements](connectivity.md) to understand what connectivity is required between your environment and Azure.
> * See the [storage configuration guidance](storage-configuration.md) to understand the details of how to configure your persistent storage.
> * If you are using Azure Kubernetes Service, your cluster's worker node VM size should be at least **Standard_D8s_v3** and use **premium disks.** The cluster should not span multiple availability zones. 
> * If you are using another Kubernetes distribution or service, you should ensure that you have a minimum node size of 8 GB RAM and 4 cores and a sum total capacity of 32 GB RAM available across all of your Kubernetes nodes. For example, you could have 1 node at 32 GB RAM and 4 cores or you could have 2 nodes with 16GB RAM and 4 cores each.

> [!NOTE]
> If you are using Red Hat OpenShift Container Platform on Azure, it is recommended to use the latest available version.

Depending on the option you choose, certain tools will be _required_, but it is recommended to [install all the client tools](./install-client-tools.md) before you begin to create the Azure Arc data controller.

Regardless of the option you choose, during the creation process you will need to provide the following information:

- **Data controller name** - A descriptive name for your data controller - e.g. "Production data controller", "Seattle data controller".
- **Data controller username** - Any username for the data controller administrator user.
- **Data controller password** - A password for the data controller administrator user.
- **Name of your Kubernetes namespace** - the name of the Kubernetes namespace that you want to create the data controller in.
- **Connectivity mode** - Connectivity mode determines the degree of connectivity from your Azure Arc—enabled data services environment to Azure. Indirect connectivity mode is generally available. Direct connectivity mode is in preview.  For information, see [connectivity mode](./connectivity.md). 
- **Azure subscription ID** - The Azure subscription GUID for where you want the data controller resource in Azure to be created.
- **Azure resource group name** - The name of the resource group where you want the data controller resource in Azure to be created.
- **Azure location** - The Azure location where the data controller resource metadata will be stored in Azure. For a list of available regions, see [Azure global infrastructure / Products by region](https://azure.microsoft.com/global-infrastructure/services/?products=azure-arc). The metadata and billing information about the Azure resources managed by the data controller that you are deploying will be stored only in the location in Azure that you specify as the location parameter. If you are deploying in the directly connected mode, the location parameter for the data controller will be the same as the location of the custom location resource that you target.

## Next steps

There are multiple options for creating the Azure Arc data controller:

> **Just want to try things out?**  
> Get started quickly with [Azure Arc Jumpstart](https://azurearcjumpstart.io/azure_arc_jumpstart/azure_arc_data/) on Azure Kubernetes Service (AKS), AWS Elastic Kubernetes Service (EKS), Google Cloud Kubernetes Engine (GKE) or in an Azure VM!
> 
- [Create a data controller in indirect connected mode with CLI](create-data-controller-indirect-cli.md)
- [Create a data controller in indirect connected mode with Azure Data Studio](create-data-controller-indirect-azure-data-studio.md)
- [Create a data controller in indirect connected mode from the Azure portal via a Jupyter notebook in Azure Data Studio](create-data-controller-indirect-azure-portal.md)
- [Create a data controller in indirect connected mode with Kubernetes tools such as kubectl or oc](create-data-controller-using-kubernetes-native-tools.md)
- [Create a data controller in direct connected mode](create-data-controller-direct-prerequisites.md)
- [Create a data controller with Azure Arc Jumpstart for an accelerated experience of a test deployment](https://azurearcjumpstart.io/azure_arc_jumpstart/azure_arc_data/)
