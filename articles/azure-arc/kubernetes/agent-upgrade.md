---
title: "Agent upgrade"
services: azure-arc
ms.service: azure-arc
ms.date: 05/19/2020
ms.topic: article
author: shashankbarsin
ms.author: shasb
description: "Control agent upgrades for Azure Arc enabled Kubernetes"
keywords: "Kubernetes, Arc, Azure, K8s, containers, agent, upgrade"
---

# Agent upgrade

## Toggle auto-upgrade on/off when connecting cluster to Azure Arc
Azure Arc enabled Kubernetes provides auto upgrade capabilities for its agents out of the box, unless one specifically opts out of the same at the time of connecting the cluster to Azure Arc.

Following command is an example of connecting a cluster to Azure Arc with auto-upgrade of agents **enabled**:

```console
az connectedk8s connect --name AzureArcTest1 --resource-group AzureArcTest
```

When auto-upgrade is enabled, the agent polls Azure every hour to check if there is a newer version of agents available to upgrade to. If a newer version is available, a Helm chart upgrade for the Azure Arc agents is initiated.

Following command is an example of connecting a cluster to Azure Arc with auto-upgrade of agents **disabled**

```console
az connectedk8s connect --name AzureArcTest1 --resource-group AzureArcTest --disable-auto-upgrade
```

> [!TIP]
> If you are disabling auto-upgrade of agents, you can find more information about the version support policy followed for Azure Arc enabled Kubernetes [here](#version-support-policy)

## Toggle auto-upgrade on/off after connecting cluster to Azure Arc

After a cluster has been connected to Azure Arc, if you want to switch on/off the auto-upgrade capability, you can do so with the `az connectedk8s update` command as shown below:

```console
az connectedk8s update --name AzureArcTest1 --resource-group AzureArcTest --auto-upgrade false
```

## Manually upgrade agents

If you have disabled auto-upgrade for agents, you can manually initiate upgrades for these agents using the `az connectedk8s upgrade` command as shown below:

```console
az connectedk8s upgrade -g AzureArcTest1 -n AzureArcTest --agent-version 0.2.28
```

Azure Arc enabled Kubernetes follows the standard [semantic versioning scheme](https://semver.org/) of `MAJOR.MINOR.PATCH` for versioning its agents. 

Each number in the version indicates general compatibility with the previous version:

* **Major versions** change when incompatible API changes or backwards compatibility may be broken.
* **Minor versions** change when functionality changes are made that are backwards compatible to the other minor releases.
* **Patch versions** change when backwards-compatible bug fixes are made.

Release notes for the Azure Arc enabled Kubernetes agents can be found [here](https://aka.ms/ArcK8sAgentReleaseNotes).

## Version support policy

Azure Arc enabled Kubernetes provides the following version support policy on the Azure Arc enabled Kubernetes agents and their compatibility with underlying Kubernetes cluster:

* Azure Arc enabled Kubernetes agents have a support window of "N-2" where 'N' is the latest minor release of agents. So if Azure Arc enabled Kubernetes introduces 0.28.a today, the following versions are supported by Azure Arc: 0.28.a, 0.28.b, 0.27.c, 0.27.d, 0.26.e, 0.26.f.

* Kubernetes clusters being connected to Azure Arc also have a support window of "N-2" where 'N' is the latest stable minor release of [upstream Kubernetes](https://github.com/kubernetes/kubernetes/releases). So if Kubernetes introduces 1.20.a today, the following versions are supported for connection to Azure Arc: 1.20.a, 1.20.b, 1.19.c, 1.19.d, 1.18.e, 1.18.f.

### How often are minor version releases of Azure Arc enabled Kubernetes available

The current plan is to introduce one minor version of agents approximately every 1 month

### What happens if I'm using agent version or Kubernetes cluster version outside the official support window?

'Outside of Support' means that the versions you're running is outside of the "N-2" supported versions list of agents and upstream Kubernetes clusters. So, you'll be asked to upgrade the cluster and the agents to a supported version when requesting support.

    
