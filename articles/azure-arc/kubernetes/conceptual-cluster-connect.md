---
title: "Cluster Connect - Azure Arc enabled Kubernetes"
services: azure-arc
ms.service: azure-arc
ms.date: 04/05/2021
ms.topic: conceptual
author: shashankbarsin
ms.author: shasb
description: "This article provides a conceptual overview of Cluster Connect capability of Azure Arc enabled Kubernetes"
---

# Cluster connect on Azure Arc enabled Kubernetes

The Azure Arc enabled Kubernetes *cluster connect* feature provides connectivity to the `apiserver` of the cluster without requiring any inbound port to be enabled on the firewall. A Hybrid Connections resource on the Azure service side is mapped to every Arc enabled Kubernetes cluster. A reverse proxy agent running on the cluster can securely start a session with the Hybrid Connection resource in an outbound manner. 

Cluster connect allows developers to access their clusters from anywhere for interactive development and debugging. You can even use hosted agents/runners of Azure Pipelines, GitHub Actions, or any other hosted CI/CD service to deploy applications to on-prem clusters, without requiring self-hosted agents.

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

## Architecture

[ ![Cluster connect architecture](./media/conceptual-cluster-connect.png) ](./media/conceptual-cluster-connect.png#lightbox)

For every Azure Arc enabled Kubernetes resource, a Hybrid Connections resource is provisioned in Microsoft tenant by Azure Arc services. On the cluster side, a reverse proxy agent called `clusterconnect-agent` makes outbound calls to the Hybrid Connections resource to establish the session.

When the user calls `az connectedk8s proxy`:
1. A client-side proxy binary is downloaded and spun up as a process on the client machine. 
1. The client-side proxy fetches a `kubeconfig` file associated with the Azure Arc enabled Kubernetes cluster on which the `az connectedk8s proxy` is invoked.
  * The client side proxy uses the caller's Azure access token and the Azure Resource Manager ID name. 
1. The `kubeconfig` file, saved on the machine by client-side proxy, points the server URL to an endpoint on the client-side proxy process.

When a user sends a request using this `kubeconfig` file:
1. The client-side proxy maps the endpoint receiving the request to the appropriate Hybrid Connections resource. 
1. The Hybrid Connections resource forwards the request to the `clusterconnect-agent` running on the cluster. 
1. The `clusterconnect-agent` passes on the request to the `kube-aad-proxy` component, which performs AAD authentication on the calling entity. 
1. After AAD authentication, `kube-aad-proxy` uses Kubernetes [user impersonation](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#user-impersonation) feature to forward the request to the cluster's `apiserver`.

## Next steps

* Use our quickstart to [connect a Kubernetes cluster to Azure Arc](./quickstart-connect-cluster.md).
* [Access your cluster](./cluster-connect.md) securely from anywhere using Cluster connect.