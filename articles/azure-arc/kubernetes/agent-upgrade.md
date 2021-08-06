---
title: "Upgrading Azure Arc–enabled Kubernetes agents"
services: azure-arc
ms.service: azure-arc
ms.date: 03/03/2021
ms.topic: article
author: shashankbarsin
ms.author: shasb
description: "Control agent upgrades for Azure Arc–enabled Kubernetes"
keywords: "Kubernetes, Arc, Azure, K8s, containers, agent, upgrade"
---

# Upgrading Azure Arc–enabled Kubernetes agents

Azure Arc–enabled Kubernetes provides auto-upgrade and manual-upgrade capabilities for its agents. If use disable auto-upgrade and instead rely on manual-upgrade, version support policy is applicable for Arc agents and the underlying Kubernetes cluster.

## Toggle auto-upgrade on or off when connecting cluster to Azure Arc

Azure Arc–enabled Kubernetes provides its agents with out- of-the-box auto-upgrade capabilities.

The following command connects a cluster to Azure Arc with auto-upgrade **enabled**:

```console
az connectedk8s connect --name AzureArcTest1 --resource-group AzureArcTest
```

With auto-upgrade enabled, the agent polls Azure hourly for availability of a newer version of agents. If the agent finds an available newer version, it triggers a Helm chart upgrade for the Azure Arc agents.

To opt-out of auto-upgrade, specify the `--disable-auto-upgrade` parameter while connecting the cluster to Azure Arc. The following command connects a cluster to Azure Arc with auto-upgrade **disabled**:

```console
az connectedk8s connect --name AzureArcTest1 --resource-group AzureArcTest --disable-auto-upgrade
```

> [!TIP]
> If you plan to disable auto-upgrade, please refer to the [version support policy](#version-support-policy) for Azure Arc–enabled Kubernetes.

## Toggle auto-upgrade on/off after connecting cluster to Azure Arc

After you connect a cluster to Azure Arc, you can toggle the auto-upgrade capability with the `az connectedk8s update` command, as shown below:

```console
az connectedk8s update --name AzureArcTest1 --resource-group AzureArcTest --auto-upgrade false
```

## Manually upgrade agents

If you have disabled auto-upgrade for agents, you can manually initiate upgrades for these agents using the `az connectedk8s upgrade` command as shown below:

```console
az connectedk8s upgrade -g AzureArcTest1 -n AzureArcTest --agent-version 1.1.0
```

Azure Arc–enabled Kubernetes follows the standard [semantic versioning scheme](https://semver.org/) of `MAJOR.MINOR.PATCH` for versioning its agents. 

Each number in the version indicates general compatibility with the previous version:

* **Major versions** change when there are incompatible API updates or backwards-compatibility may be broken.
* **Minor versions** change when functionality changes are backwards-compatible to other minor releases.
* **Patch versions** change when backwards-compatible bug fixes are made.

## Version support policy

When you create support issues, Azure Arc–enabled Kubernetes practices the following version support policy:

* Azure Arc–enabled Kubernetes agents have a support window of "N-2" where 'N' is the latest minor release of agents. 
  * For example, if Azure Arc–enabled Kubernetes introduces 0.28.a today, versions 0.28.a, 0.28.b, 0.27.c, 0.27.d, 0.26.e, and 0.26.f are supported by Azure Arc.

* Kubernetes clusters connecting to Azure Arc have a support window of "N-2", where 'N' is the latest stable minor release of [upstream Kubernetes](https://github.com/kubernetes/kubernetes/releases). 
  * For example, if Kubernetes introduces 1.20.a today, versions 1.20.a, 1.20.b, 1.19.c, 1.19.d, 1.18.e, and 1.18.f are supported.

### How often are minor version releases of Azure Arc–enabled Kubernetes available?

One minor version of Azure Arc–enabled Kubernetes agents is released approximately once a month.

### What happens if I'm using an agent version or a Kubernetes version outside the official support window?

'Outside of Support' means that the versions you're running are outside the "N-2" supported versions of agents and upstream Kubernetes clusters. To proceed with the support issue, you'll be asked to upgrade the cluster and the agents to a supported version.

## Next steps

* Walk through our quickstart to [connect a Kubernetes cluster to Azure Arc](./quickstart-connect-cluster.md).
* Already have a Kubernetes cluster connected Azure Arc? [Create configurations on your Azure Arc–enabled Kubernetes cluster](./tutorial-use-gitops-connected-cluster.md).
* Learn how to [use Azure Policy to apply configurations at scale](./use-azure-policy.md).
