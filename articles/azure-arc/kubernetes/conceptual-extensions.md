---
title: "Cluster extensions - Azure Arc-enabled Kubernetes"
services: azure-arc
ms.service: azure-arc
ms.date: 07/12/2022
ms.topic: conceptual
description: "This article provides a conceptual overview of cluster extensions capability of Azure Arc-enabled Kubernetes"
---

# Cluster extensions

[Helm charts](https://helm.sh/) help you manage Kubernetes applications by providing the building blocks needed to define, install, and upgrade even the most complex Kubernetes applications. The cluster extension feature builds on top of the packaging components of Helm by providing an Azure Resource Manager-driven experience for installation and lifecycle management of different Azure capabilities on top of your Kubernetes cluster.

A cluster operator or admin can use the cluster extensions feature to:

- Install and manage key management, data, and application offerings on your Kubernetes cluster. List of available extensions can be found [here](extensions.md#currently-available-extensions)
- Use Azure Policy to automate at-scale deployment of cluster extensions across all clusters in your environment. 
- Subscribe to release trains (for example, preview or stable) for each extension.
- Set up auto-upgrade for extensions or pin to a specific version and manually upgrade versions.
- Update extension properties or delete extension instances.

An extension can be [cluster-scoped or scoped to a namespace](extensions.md#extension-scope). Each extension type (such as Azure Monitor for containers, Microsoft Defender for Cloud, Azure App services) defines the scope at which they operate on the cluster.

## Architecture

[ ![Cluster extensions architecture](./media/conceptual-extensions.png) ](./media/conceptual-extensions.png#lightbox)

The cluster extension instance is created as an extension Azure Resource Manager resource (`Microsoft.KubernetesConfiguration/extensions`) on top of the Azure Arc-enabled Kubernetes resource (represented by `Microsoft.Kubernetes/connectedClusters`) in Azure Resource Manager. This representation in Azure Resource Manager allows you to author a policy that checks for all the Azure Arc-enabled Kubernetes resources with or without a specific cluster extension. Once you've determined which clusters are missing the cluster extensions with desired property values, you can remediate these non-compliant resources using Azure Policy.

The `config-agent` running in your cluster tracks new and updated extension resources on the Azure Arc-enabled Kubernetes resource. The `extensions-manager` agent running in your cluster reads the extension type that needs to be installed and pulls the associated Helm chart from Azure Container Registry or Microsoft Container Registry and installs it on the cluster. 

Both the `config-agent` and `extensions-manager` components running in the cluster handle extension instance updates, version updates and extension instance deletion. These agents use the system-assigned managed identity of the cluster to securely communicate with Azure services. 

> [!NOTE]
> `config-agent` checks for new or updated extension instances on top of Azure Arc-enabled Kubernetes cluster. The agents require connectivity for the desired state of the extension to be pulled down to the cluster. If agents are unable to connect to Azure, propagation of the desired state to the cluster is delayed.
>
> Protected configuration settings for an extension instance are stored for up to 48 hours in the Azure Arc-enabled Kubernetes services. As a result, if the cluster remains disconnected during the 48 hours after the extension resource was created on Azure, the extension changes from a `Pending` state to `Failed` state. To prevent this, we recommend bringing clusters online regularly.

## Next steps

- Use our quickstart to [connect a Kubernetes cluster to Azure Arc](./quickstart-connect-cluster.md).
- [Deploy cluster extensions](./extensions.md) on your Azure Arc-enabled Kubernetes cluster.
