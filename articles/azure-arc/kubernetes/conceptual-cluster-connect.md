---
title: "Cluster connect access to Azure Arc-enabled Kubernetes clusters"
ms.date: 07/22/2022
ms.topic: conceptual
description: "Cluster connect allows developers to access their Azure Arc-enabled Kubernetes clusters from anywhere for interactive development and debugging."
---

# Cluster connect access to Azure Arc-enabled Kubernetes clusters

The Azure Arc-enabled Kubernetes *cluster connect* feature provides connectivity to the `apiserver` of the cluster without requiring any inbound port to be enabled on the firewall. A reverse proxy agent running on the cluster can securely start a session with the Azure Arc service in an outbound manner.

Cluster connect allows developers to access their clusters from anywhere for interactive development and debugging. It also lets cluster users and administrators access or manage their clusters from anywhere. You can even use hosted agents/runners of Azure Pipelines, GitHub Actions, or any other hosted CI/CD service to deploy applications to on-premises clusters, without requiring self-hosted agents.

## Architecture

[ ![Cluster connect architecture](./media/conceptual-cluster-connect.png) ](./media/conceptual-cluster-connect.png#lightbox)

On the cluster side, a reverse proxy agent called `clusterconnect-agent` deployed as part of the agent Helm chart, makes outbound calls to the Azure Arc service to establish the session.

When the user calls `az connectedk8s proxy`:

1. The Azure Arc proxy binary is downloaded and spun up as a process on the client machine.
1. The Azure Arc proxy fetches a `kubeconfig` file associated with the Azure Arc-enabled Kubernetes cluster on which the `az connectedk8s proxy` is invoked.
    * The Azure Arc proxy uses the caller's Azure access token and the Azure Resource Manager ID name.
1. The `kubeconfig` file, saved on the machine by the Azure Arc proxy, points the server URL to an endpoint on the Azure Arc proxy process.

When a user sends a request using this `kubeconfig` file:

1. The Azure Arc proxy maps the endpoint receiving the request to the Azure Arc service.
1. The Azure Arc service then forwards the request to the `clusterconnect-agent` running on the cluster.
1. The `clusterconnect-agent` passes on the request to the `kube-aad-proxy` component, which performs Microsoft Entra authentication on the calling entity.
1. After Microsoft Entra authentication, `kube-aad-proxy` uses Kubernetes [user impersonation](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#user-impersonation) to forward the request to the cluster's `apiserver`.

## Next steps

* Use our quickstart to [connect a Kubernetes cluster to Azure Arc](./quickstart-connect-cluster.md).
* [Access your cluster](./cluster-connect.md) securely from anywhere using cluster connect.
