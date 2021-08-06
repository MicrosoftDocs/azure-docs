---
title: "Custom Locations - Azure Arc—enabled Kubernetes"
services: azure-arc
ms.service: azure-arc
ms.date: 05/25/2021
ms.topic: conceptual
author: shashankbarsin
ms.author: shasb
description: "This article provides a conceptual overview of Custom Locations capability of Azure Arc—enabled Kubernetes"
---

# Custom locations on top of Azure Arc—enabled Kubernetes

As an extension of the Azure location construct, *Custom Locations* provides a way for tenant administrators to use their Azure Arc—enabled Kubernetes clusters as target locations for deploying Azure services instances. Azure resources examples include Azure Arc—enabled SQL Managed Instance and Azure Arc—enabled PostgreSQL Hyperscale.

Similar to Azure locations, end users within the tenant with access to Custom Locations can deploy resources there using their company's private compute.

[ ![Arc platform layers](./media/conceptual-arc-platform-layers.png) ](./media/conceptual-arc-platform-layers.png#lightbox)

You can visualize Custom Locations as an abstraction layer on top of Azure Arc—enabled Kubernetes cluster, cluster connect, and cluster extensions. Custom Locations creates the granular [RoleBindings and ClusterRoleBindings](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#rolebinding-and-clusterrolebinding) necessary for other Azure services to access the cluster. These other Azure services require cluster access to manage resources the customer wants to deploy on their clusters.

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

## Architecture

When the admin enables the Custom Locations feature on the cluster, a ClusterRoleBinding is created on the cluster, authorizing the Azure AD application used by the Custom Locations Resource Provider (RP). Once authorized, Custom Locations RP can create ClusterRoleBindings or RoleBindings needed by other Azure RPs to create custom resources on this cluster. The cluster extensions installed on the cluster determines the list of RPs to authorize.

[ ![Use custom locations](./media/conceptual-custom-locations-usage.png) ](./media/conceptual-custom-locations-usage.png#lightbox)

When the user creates a data service instance on the cluster: 
1. The PUT request is sent to Azure Resource Manager.
1. The PUT request is forwarded to the Azure Arc—enabled Data Services RP. 
1. The RP fetches the `kubeconfig` file associated with the Azure Arc—enabled Kubernetes cluster, on which the Custom Location exists. 
   * Custom Location is referenced as `extendedLocation` in the original PUT request. 
1. Azure Arc—enabled Data Services RP uses the `kubeconfig` to communicate with the cluster to create a custom resource of the Azure Arc—enabled Data Services type on the namespace mapped to the Custom Location. 
   * The Azure Arc—enabled Data Services operator was deployed via cluster extension creation before the Custom Location existed. 
1. The Azure Arc—enabled Data Services operator reads the new custom resource created on the cluster and creates the data controller, translating into realization of the desired state on the cluster. 

The sequence of steps to create the SQL managed instance and PostgreSQL instance are identical to the sequence of steps described above.

## Next steps

* Use our quickstart to [connect a Kubernetes cluster to Azure Arc](./quickstart-connect-cluster.md).
* [Create a custom location](./custom-locations.md) on your Azure Arc—enabled Kubernetes cluster.
