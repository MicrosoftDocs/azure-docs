---
title: "Custom Locations - Azure Arc enabled Kubernetes"
services: azure-arc
ms.service: azure-arc
ms.date: 04/05/2021
ms.topic: conceptual
author: shashankbarsin
ms.author: shasb
description: "This article provides a conceptual overview of Custom Locations capability of Azure Arc enabled Kubernetes"
---

# Custom locations on Azure Arc enabled Kubernetes

The Custom Locations is an extension of Azure location. It provides a way for tenant administrators to utilize their Azure Arc enabled Kubernetes clusters as target locations to deploy instances of Azure services such as Azure Arc enabled SQL Managed Instance and Azure Arc enabled PostgreSQL Hyperscale. Similar to locations, end users within the tenant who have access to Custom Locations can deploy resources there utilizing their company's private compute.

[ ![Arc platform layers](./media/conceptual-arc-platform-layers.png) ](./media/conceptual-arc-platform-layers.png#lightbox)

Custom location can be visualized as an abstraction layer on top of Azure Arc enabled Kubernetes cluster, cluster connect and cluster extensions. It is responsible for creation of granular RoleBindings and ClusterRoleBindings needed for other Azure services to be able to access the cluster for managing the resource instances that the customer wants to deploy on their clusters.

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

## Architecture

[ ![Enable custom locations](./media/conceptual-custom-locations-enable.png) ](./media/conceptual-custom-locations-enable.png#lightbox)

When the admin enables custom locations feature on the cluster, a ClusterRoleBinding is created on the cluster authorizing the Azure Active Directory application used by the Custom Locations Resource Provider (RP). This is needed so that Custom Locations RP can create ClusterRoleBindings or RoleBindings needed by other Azure RPs to create custom resources on this cluster. The list of RPs to authorize is determined based on the cluster extensions installed on the cluster.

[ ![Enable custom locations](./media/conceptual-custom-locations-usage.png) ](./media/conceptual-custom-locations-usage.png#lightbox)

When the user creates a Data service instance on the cluster, the PUT request is sent to Azure Resource Manager, from where it is then sent to the Azure Arc enabled Data Services RP. This RP then fetches the `kubeconfig` file associated with the Azure Arc enabled Kubernetes cluster on which the custom location (referenced as extended location in the original PUT request) exists. This `kubeconfig` is then used to communicate with the cluster to create a custom resource of the Azure Arc enabled Data Services type on the namespace mapped to the custom location. The Azure Arc enabled Data Services, which was deployed by the creation of cluster extension before creation of the custom location, now picks up the new custom resource specification and in turn goes about realizing this desired state on the cluster by creating the data controller. The request flow to create the SQL managed instance and PostgreSQL are identical to the sequence of steps described above.

## Next steps

* Walk through our quickstart to [connect a Kubernetes cluster to Azure Arc](./quickstart-connect-cluster.md).
* Already have a Kubernetes cluster connected to Azure Arc? [Create a custom location on your Arc enabled Kubernetes cluster](./custom-locations.md).