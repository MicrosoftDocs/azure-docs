---
title: "Upgrade Azure Arc-enabled Kubernetes agents"
ms.date: 08/28/2023
ms.topic: how-to
ms.custom: devx-track-azurecli
description: "Control agent upgrades for Azure Arc-enabled Kubernetes"
---

# Upgrade Azure Arc-enabled Kubernetes agents

Azure Arc-enabled Kubernetes provides both automatic and manual upgrade capabilities for its [agents](conceptual-agent-overview.md). If you disable automatic upgrade and instead rely on manual upgrade, a [version support policy](#version-support-policy) applies for Arc agents and the underlying Kubernetes clusters.

## Toggle automatic upgrade on or off when connecting a cluster to Azure Arc

By default, Azure Arc-enabled Kubernetes provides its agents with out-of-the-box automatic upgrade capabilities.

The following command connects a cluster to Azure Arc with automatic upgrade enabled:

```azurecli
az connectedk8s connect --name AzureArcTest1 --resource-group AzureArcTest
```

With automatic upgrade enabled, the agent polls Azure hourly to check for a newer version. When a newer version becomes available, it triggers a Helm chart upgrade for the Azure Arc agents.

> [!IMPORTANT]
> Be sure you allow [connectivity to all required endpoints](network-requirements.md). In particular, connectivity to `dl.k8s.io` is required for automatic upgrades.

To opt out of automatic upgrade, specify the `--disable-auto-upgrade` parameter while connecting the cluster to Azure Arc.

The following command connects a cluster to Azure Arc with auto-upgrade disabled:

```azurecli
az connectedk8s connect --name AzureArcTest1 --resource-group AzureArcTest --disable-auto-upgrade
```

> [!TIP]
> If you plan to disable automatic upgrade, be aware of the [version support policy](#version-support-policy) for Azure Arc-enabled Kubernetes.

## Toggle automatic upgrade on or off after connecting a cluster to Azure Arc

After you connect a cluster to Azure Arc, you can change the automatic upgrade selection by using the `az connectedk8s update` command and setting `--auto-upgrade` to either true or false.

> [!IMPORTANT]
> To change the automatic upgrade setting, you must use version 1.2.11 of the `connectedk8s` Azure CLI extension. We are working to enable this functionality in future releases.
>
> To ensure you are using this version, run the following commands:
>
> ```azurecli
> # remove existing extension
> az extension remove --name connectedk8s 
> 
> # add specific extension version
> az extension add --name connectedk8s --version 1.2.11 
> ```
>
> Once you've adjusted the automatic upgrade selection, use the following command to revert back to the latest version of the extension:
>
> ```azurecli
> # remove existing extension
> az extension remove --name connectedk8s 
> 
> # add latest extension version
> az extension add --name connectedk8s 
> ```

The following command turns automatic upgrade off for a connected cluster:

```azurecli
az connectedk8s update --name AzureArcTest1 --resource-group AzureArcTest --auto-upgrade false
```

## Check if automatic upgrade is enabled on a cluster

To check whether a cluster is enabled for automatic upgrade, run the following kubectl command. Note that the automatic upgrade configuration is not available in the public API for Azure Arc-enabled Kubernetes.

```console
kubectl -n azure-arc get cm azure-clusterconfig -o jsonpath="{.data['AZURE_ARC_AUTOUPDATE']}"
```

## Manually upgrade agents

If you've disabled automatic upgrade, you can manually initiate upgrades for the agents by using the `az connectedk8s upgrade` command. When doing so, you must specify the version to which you want to upgrade.

Azure Arc-enabled Kubernetes follows the standard [semantic versioning scheme](https://semver.org/) of `MAJOR.MINOR.PATCH` for versioning its agents. Each number in the version indicates general compatibility with the previous version:

* **Major versions** change when there are incompatible API updates or backwards-compatibility may be broken.
* **Minor versions** change when functionality changes are backwards-compatible to other minor releases.
* **Patch versions** change when backwards-compatible bug fixes are made.

While the schedule may vary, a new minor version of Azure Arc-enabled Kubernetes agents is released approximately once per month.

The following command manually upgrades the agent to version 1.8.14:

```azurecli
az connectedk8s upgrade -g AzureArcTest1 -n AzureArcTest --agent-version 1.8.14
```

## Check agent version

To list connected clusters and reported agent version, use the following command:

```azurecli
az connectedk8s list --query '[].{name:name,rg:resourceGroup,id:id,version:agentVersion}'
```

## Version support policy

When you [create support requests](../../azure-portal/supportability/how-to-create-azure-support-request.md) for Azure Arc-enabled Kubernetes, the following version support policy applies:

* Azure Arc-enabled Kubernetes agents have a support window of "N-2", where 'N' is the latest minor release of agents.
  * For example, if Azure Arc-enabled Kubernetes introduces 0.28.a today, versions 0.28.a, 0.28.b, 0.27.c, 0.27.d, 0.26.e, and 0.26.f are supported.

* Kubernetes clusters connecting to Azure Arc have a support window of "N-2", where 'N' is the latest stable minor release of [upstream Kubernetes](https://github.com/kubernetes/kubernetes/releases).
  * For example, if Kubernetes introduces 1.20.a today, versions 1.20.a, 1.20.b, 1.19.c, 1.19.d, 1.18.e, and 1.18.f are supported.

If you create a support request and are using a version that is outside of the support policy (older than the "N-2" supported versions of agents and upstream Kubernetes clusters), you'll be asked to upgrade the clusters and agents to a supported version.

## Next steps

* Walk through our quickstart to [connect a Kubernetes cluster to Azure Arc](./quickstart-connect-cluster.md).
* Already have a Kubernetes cluster connected Azure Arc? [Create configurations on your Azure Arc-enabled Kubernetes cluster](./tutorial-use-gitops-connected-cluster.md).
* Learn how to [use Azure Policy to apply configurations at scale](./use-azure-policy.md).
