---
title: Plan Azure Arc—enabled data services deployment
description: Explains considerations for planning the Azure Arc—enabled data services deployment
services: azure-arc
ms.service: azure-arc-data
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 07/30/2021
ms.topic: how-to
---
# Plan to deploy Azure Arc—enabled data services

This article describes how to plan to deploy Azure Arc—enabled data services.


First, deployment of Azure Arc data services involves proper understanding of the database workloads and the business requirements for those workloads. For example, consider things like availability, business continuity, and capacity requirements for memory, CPU, and storage for those workloads. Second, the infrastructure to support those database workloads needs to be prepared based on the business requirements.

## Prerequisites

Before you deploy the Azure Arc—enabled data services, it's important to understand the prerequisites and have all the necessary information ready, infrastructure environment properly configured with right level of access, appropriate capacity for storage, CPU, and memory. so you can have a successful deployment at the end.

Review the following sections:
- [Sizing guidance](sizing-guidance.md)
- [Storage configuration](storage-configuration.md)
- [Connectivity modes and their requirements](connectivity.md)

Verify that you have:
- installed the [`arcdata` CLI extension](install-arcdata-extension.md).
- installed the other [client tools](install-client-tools.md).
- access to the Kubernetes cluster.
- your `kubeconfig` file configured. It should point to the Kubernetes cluster you want to deploy to. Run the following command to verify the current context of your cluster you will be deploying to:
   ```console
   kubectl cluster-info
   ```
- an Azure subscription to which resources such as Azure Arc data controller, Azure Arc—enabled SQL managed instance or Azure Arc—enabled PostgreSQL Hyperscale server will be projected and billed to.

Once the infrastructure is prepared, deploy Azure Arc—enabled data services in the following way:
1. Create an Azure Arc—enabled data controller on one of the validated distributions of a Kubernetes cluster
1. Create an Azure Arc—enabled SQL managed instance and/or an Azure Arc—enabled PostgreSQL Hyperscale server group.

## Overview: Create the Azure Arc—enabled data controller

You can create Azure Arc—enabled data services on multiple different types of Kubernetes clusters and managed Kubernetes services using multiple different approaches.

Currently, the validated list of Kubernetes services and distributions includes:


- AWS Elastic Kubernetes Service (EKS)
- Azure Kubernetes Service (AKS)
- Azure Kubernetes Service on Azure Stack HCI
- Azure RedHat OpenShift (ARO)
- Google Cloud Kubernetes Engine (GKE)
- Open source, upstream Kubernetes typically deployed using kubeadm
- OpenShift Container Platform (OCP)

> [!IMPORTANT]
> * The minimum supported version of Kubernetes is v1.19. See [Known issues](./release-notes.md#known-issues) for additional information.
> * The minimum supported version of OCP is 4.7.
> * If you are using Azure Kubernetes Service, your cluster's worker node VM size should be at least **Standard_D8s_v3** and use **premium disks.** 
> * The cluster should not span multiple availability zones. 
> * See [Known issues](./release-notes.md#known-issues) for additional information.

Regardless of the option you choose, during the creation process you will need to provide the following information:

- **Data controller name** - descriptive name for your data controller - e.g. "production-dc", "seattle-dc". The name must meet [Kubernetes naming standards](https://kubernetes.io/docs/concepts/overview/working-with-objects/names/).
- **username** - username for the Kibana/Grafana administrator users.
- **password** - password for the Kibana/Grafana administrator user.
- **Name of your Kubernetes namespace** - the name of the Kubernetes namespace that you want to create the data controller in.
- **Connectivity mode** - Connectivity mode determines the degree of connectivity from your Azure Arc—enabled data services environment to Azure. Indirectly connected mode is generally available. Directly connected mode is in preview.  The choice of connectivity mode determines the options for deployment methods.  For information, see [connectivity mode](./connectivity.md).
- **Azure subscription ID** - The Azure subscription GUID for where you want the data controller resource in Azure to be created.  All Azure Arc—enabled SQL Managed Instances and PostgreSQL Hyperscale server groups will also be created in this subscription and billed to that subscription.
- **Azure resource group name** - The name of the resource group where you want the data controller resource in Azure to be created.  All Azure Arc—enabled SQL Managed Instances and PostgreSQL Hyperscale server groups will also be created in this resource group.
- **Azure location** - The Azure location where the data controller resource metadata will be stored in Azure. For a list of available regions, see [Azure global infrastructure / Products by region](https://azure.microsoft.com/global-infrastructure/services/?products=azure-arc). The metadata and billing information about the Azure resources managed by the data controller that you are deploying will be stored only in the location in Azure that you specify as the location parameter. If you are deploying in the directly connected mode, the location parameter for the data controller will be the same as the location of the custom location resource that you target.
- **Service Principal information** - as described in the [Upload prerequisites](upload-metrics-and-logs-to-azure-monitor.md) article, you will need the Service Principal information during Azure Arc data controller create when deploying in *direct* connectivity mode. For *indirect* connectivity mode, the Service Principal is still needed to export and upload manually but after the Azure Arc data controller is created.
- **Infrastructure** - For billing purposes, it is required to indicate the infrastructure on which you are running Azure Arc—enabled data services.  The options are `alibaba`, `aws`, `azure`, `gcp`, `onpremises`, or `other`.

## Additional concepts for direct connected mode

As described in the [connectivity modes](./connectivity.md), Azure Arc data controller can be deployed in **direct** or **indirect** connectivity modes. Deploying Azure Arc data services in **direct** connected mode requires understanding of some additional concepts and considerations.
First, the Kubernetes cluster where the Azure Arc—enabled data services will be deployed needs to be an [Azure Arc—enabled Kubernetes cluster](../kubernetes/overview.md). Onboarding the Kubernetes cluster to Azure Arc provides Azure connectivity that is leveraged for capabilities such as automatic upload of usage information, logs, metrics etc. Connecting your Kubernetes cluster to Azure also allows you to deploy and manage Azure Arc data services to your cluster directly from the Azure portal.

Connecting your Kubernetes cluster to Azure involves the following steps:
- [Connect your cluster to Azure](../kubernetes/quickstart-connect-cluster.md)

Second, after the Kubernetes cluster is onboarded to Azure Arc, deploying Azure Arc—enabled data services on an Azure Arc—enabled Kubernetes cluster involves the following:
- Create the Arc data services extension, learn more about [cluster extensions](../kubernetes/conceptual-extensions.md)
- Create a custom location, learn more about [custom locations](../kubernetes/conceptual-custom-locations.md)
- Create the Azure Arc data controller

All three of these steps can be performed in a single step by using the Azure Arc data controller creation wizard in the Azure portal.

After the Azure Arc data controller is installed, data services such as Azure Arc—enabled SQL Managed Instance or Azure Arc—enabled PostgreSQL Hyperscale Server Group can be created.


## Next steps

There are multiple options for creating the Azure Arc data controller:

> **Just want to try things out?**
> Get started quickly with [Azure Arc Jumpstart](https://azurearcjumpstart.io/azure_arc_jumpstart/azure_arc_data/) on Azure Kubernetes Service (AKS), AWS Elastic Kubernetes Service (EKS), Google Cloud Kubernetes Engine (GKE) or in an Azure VM!
>
- [Create a data controller in direct connected mode with the Azure portal](create-data-controller-direct-prerequisites.md)
- [Create a data controller in indirect connected mode with CLI](create-data-controller-indirect-cli.md)
- [Create a data controller in indirect connected mode with Azure Data Studio](create-data-controller-indirect-azure-data-studio.md)
- [Create a data controller in indirect connected mode from the Azure portal via a Jupyter notebook in Azure Data Studio](create-data-controller-indirect-azure-portal.md)
- [Create a data controller in indirect connected mode with Kubernetes tools such as kubectl or oc](create-data-controller-using-kubernetes-native-tools.md)
