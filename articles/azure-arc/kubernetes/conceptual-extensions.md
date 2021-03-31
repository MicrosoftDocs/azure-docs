---
title: "Cluster extensions - Azure Arc enabled Kubernetes"
services: azure-arc
ms.service: azure-arc
ms.date: 03/05/2021
ms.topic: conceptual
author: shashankbarsin
ms.author: shasb
description: "This article provides a conceptual overview of cluster extensions capability of Azure Arc enabled Kubernetes"
---

# Cluster extensions on Azure Arc enabled Kubernetes

[Helm charts](https://helm.sh/) help you manage Kubernetes applications by providing the building blocks needed to define, install, and upgrade even the most complex Kubernetes applications. Cluster extension feature seeks to build on top of the packaging components of Helm. It does so by providing an Azure Resource Manager driven experience for installation and lifecycle management of cluster extensions such as Azure Monitor and Azure Defender for Kubernetes. The Cluster extensions feature provide the following extra benefits over and above what is already available natively with Helm charts:

- Get an inventory of all clusters and the extensions installed on those clusters.
- Use Azure Policy to automate at-scale deployment of cluster extensions.
- Subscribe to release trains of every extension.
- Set up auto-upgrade for extensions.
- Supportability for the extension instance creation and lifecycle management events of update and delete.

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

## Architecture

[ ![Cluster extensions architecture](./media/conceptual-extensions.png) ](./media/conceptual-extensions.png#lightbox)

The cluster extension instance is created as an extension Azure Resource Manager resource (`Microsoft.KubernetesConfiguration/extensions`) on top of the Azure Arc enabled Kubernetes resource (represented by `Microsoft.Kubernetes/connectedClusters`) in Azure Resource Manager. This Azure Resource Manager representation makes it possible to author a policy that checks for all the Azure Arc enabled Kubernetes resources that have or don't have a specific cluster extension created on them. Once it's determined that a cluster doesn't have the cluster extension with desired property values, it's then possible to use Azure Policy remediate those resources by creating the cluster extension resource on top of these clusters.

The `config-agent` running in your cluster is responsible for tracking new or updated extension resources on the Azure Arc enabled Kubernetes resource. The `extensions-manager` running in your cluster is responsible for pulling the Helm chart from Azure Container Registry or Microsoft Container Registry and then installing it on the cluster. Version updates and deletion of the extension instance are also handled in a similar manner by the `config-agent` and `extensions-manager` component running in the cluster.

> [!NOTE]
> * `config-agent` monitors for new or updated extension resources to be available on the Arc enabled Kubernetes resource. Thus agents require connectivity for the desired state to be pulled down to the cluster. If agents are unable to connect to Azure, there is a delay in propagating the desired state to the cluster.
> * Protected configuration settings for an extension are not stored for more than 48 hours in the Azure Arc enabled Kubernetes services. As a result if the cluster remains disconnected during the 48 hours after the extension resource was created on Azure, the extension transitions from a `Pending` state to `Failed` state. It's thus advisable to bring the clusters online as regularly as possible.

## Next steps

* Walk through our quickstart to [connect a Kubernetes cluster to Azure Arc](./quickstart-connect-cluster.md).
* Already have a Kubernetes cluster connected Azure Arc? [Deploy cluster extensions on your Arc enabled Kubernetes cluster](./extensions.md).