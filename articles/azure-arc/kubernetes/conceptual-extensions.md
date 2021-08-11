---
title: "Cluster extensions - Azure Arc-enabled Kubernetes"
services: azure-arc
ms.service: azure-arc
ms.date: 04/05/2021
ms.topic: conceptual
author: shashankbarsin
ms.author: shasb
description: "This article provides a conceptual overview of cluster extensions capability of Azure Arc-enabled Kubernetes"
---

# Cluster extensions on Azure Arc-enabled Kubernetes

[Helm charts](https://helm.sh/) help you manage Kubernetes applications by providing the building blocks needed to define, install, and upgrade even the most complex Kubernetes applications. Cluster extension feature seeks to build on top of the packaging components of Helm. It does so by providing an Azure Resource Manager driven experience for installation and lifecycle management of cluster extensions such as Azure Monitor and Azure Defender for Kubernetes. The cluster extensions feature provide the following extra benefits over and above what is already available natively with Helm charts:

- Get an inventory of all clusters and the extensions installed on those clusters.
- Use Azure Policy to automate at-scale deployment of cluster extensions.
- Subscribe to release trains of every extension.
- Set up auto-upgrade for extensions.
- Supportability for the extension instance creation and lifecycle management events of update and delete.

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

## Architecture

[ ![Cluster extensions architecture](./media/conceptual-extensions.png) ](./media/conceptual-extensions.png#lightbox)

The cluster extension instance is created as an extension Azure Resource Manager resource (`Microsoft.KubernetesConfiguration/extensions`) on top of the Azure Arc-enabled Kubernetes resource (represented by `Microsoft.Kubernetes/connectedClusters`) in Azure Resource Manager. Representation in Azure Resource Manager allows you to author a policy that checks for all the Azure Arc-enabled Kubernetes resources with or without a specific cluster extension. Once you've determined which clusters lack cluster extensions with desired property values, you can remediate these non-compliant resources using Azure Policy.

The `config-agent` running in your cluster tracks new or updated extension resources on the Azure Arc-enabled Kubernetes resource. The `extensions-manager` running in your cluster pulls the Helm chart from Azure Container Registry or Microsoft Container Registry and installs it on the cluster. 

Both the `config-agent` and `extensions-manager` components running in the cluster handle version updates and extension instance deletion.

> [!NOTE]
> * `config-agent` monitors for new or updated extension resources to be available on the Azure Arc-enabled Kubernetes resource. Thus, agents require connectivity for the desired state to be pulled down to the cluster. If agents are unable to connect to Azure, propagation of the desired state to the cluster is delayed.
> * Protected configuration settings for an extension are stored for up to 48 hours in the Azure Arc-enabled Kubernetes services. As a result, if the cluster remains disconnected during the 48 hours after the extension resource was created on Azure, the extension transitions from a `Pending` state to `Failed` state. We advise bringing the clusters online as regularly as possible.

## Next steps

* Use our quickstart to [connect a Kubernetes cluster to Azure Arc](./quickstart-connect-cluster.md).
* [Deploy cluster extensions](./extensions.md) on your Azure Arc-enabled Kubernetes cluster.
