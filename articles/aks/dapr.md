---
title: Dapr extension for Azure Kubernetes Service (AKS) and Arc-enabled Kubernetes
description: Install and configure Dapr on your Azure Kubernetes Service (AKS) and Arc-enabled Kubernetes clusters using the Dapr cluster extension.
author: greenie-msft
ms.author: nigreenf
ms.service: container-service
ms.topic: article
ms.date: 05/16/2022
ms.custom: devx-track-azurecli, ignite-fall-2021, event-tier1-build-2022
---

# Dapr extension for Azure Kubernetes Service (AKS) and Arc-enabled Kubernetes

[Dapr](https://dapr.io/) is a portable, event-driven runtime that makes it easy for any developer to build resilient, stateless and stateful applications that run on the cloud and edge and embraces the diversity of languages and developer frameworks. Leveraging the benefits of a sidecar architecture, Dapr helps you tackle the challenges that come with building microservices and keeps your code platform agnostic. In particular, it helps with solving problems around services calling other services reliably and securely, building event-driven apps with pub-sub, and building applications that are portable across multiple cloud services and hosts (e.g., Kubernetes vs. a VM).

By using the Dapr extension to provision Dapr on your AKS or Arc-enabled Kubernetes cluster, you eliminate the overhead of downloading Dapr tooling and manually installing and managing the runtime on your AKS cluster. Additionally, the extension offers support for all [native Dapr configuration capabilities][dapr-configuration-options] through simple command-line arguments.

> [!NOTE]
> If you plan on installing Dapr in a Kubernetes production environment, please see the [Dapr guidelines for production usage][kubernetes-production] documentation page.

## How it works

The Dapr extension uses the Azure CLI to provision the Dapr control plane on your AKS or Arc-enabled Kubernetes cluster. This will create:

- **dapr-operator**: Manages component updates and Kubernetes services endpoints for Dapr (state stores, pub/subs, etc.)
- **dapr-sidecar-injector**: Injects Dapr into annotated deployment pods and adds the environment variables `DAPR_HTTP_PORT` and `DAPR_GRPC_PORT` to enable user-defined applications to easily communicate with Dapr without hard-coding Dapr port values.
- **dapr-placement**: Used for actors only. Creates mapping tables that map actor instances to pods
- **dapr-sentry**: Manages mTLS between services and acts as a certificate authority. For more information read the [security overview][dapr-security].

Once Dapr is installed on your cluster, you can begin to develop using the Dapr building block APIs by [adding a few annotations][dapr-deployment-annotations] to your deployments. For a more in-depth overview of the building block APIs and how to best use them, please see the [Dapr building blocks overview][building-blocks-concepts].

> [!WARNING]
> If you install Dapr through the AKS or Arc-enabled Kubernetes extension, our recommendation is to continue using the extension for future management of Dapr instead of the Dapr CLI. Combining the two tools can cause conflicts and result in undesired behavior.

## Currently supported

### Dapr versions

The Dapr extension support varies depending on how you manage the runtime. 

**Self-managed**  
For self-managed runtime, the Dapr extension supports:
- [The latest version of Dapr and 1 previous version (N-1)][dapr-supported-version]
- Upgrading minor version incrementally (for example, 1.5 -> 1.6 -> 1.7) 

Self-managed runtime requires manual upgrade to remain in the support window. To upgrade Dapr via the extension, follow the [Update extension instance instructions][update-extension].

**Auto-upgrade**  
Enabling auto-upgrade keeps your Dapr extension updated to the latest minor version. You may experience breaking changes between updates.

### Components

Azure + open source components are supported. Alpha and beta components are supported via best effort.

### Clouds/regions

Global Azure cloud is supported with Arc support on the regions listed by [Azure Products by Region][supported-cloud-regions].

## Prerequisites 

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Install the latest version of the [Azure CLI](/cli/azure/install-azure-cli-windows).
- If you don't have one already, you need to create an [AKS cluster][deploy-cluster] or connect an [Arc-enabled Kubernetes cluster][arc-k8s-cluster].

### Set up the Azure CLI extension for cluster extensions

You will need the `k8s-extension` Azure CLI extension. Install this by running the following commands:
  
```azurecli-interactive
az extension add --name k8s-extension
```

If the `k8s-extension` extension is already installed, you can update it to the latest version using the following command:

```azurecli-interactive
az extension update --name k8s-extension
```

## Create the extension and install Dapr on your AKS or Arc-enabled Kubernetes cluster

When installing the Dapr extension, use the flag value that corresponds to your cluster type:

- **AKS cluster**: `--cluster-type managedClusters`. 
- **Arc-enabled Kubernetes cluster**: `--cluster-type connectedClusters`.

Create the Dapr extension, which installs Dapr on your AKS or Arc-enabled Kubernetes cluster. For example, for an AKS cluster:

```azure-cli-interactive
az k8s-extension create --cluster-type managedClusters \
--cluster-name myAKSCluster \
--resource-group myResourceGroup \
--name myDaprExtension \
--extension-type Microsoft.Dapr
```

You have the option of allowing Dapr to auto-update its minor version by specifying the `--auto-upgrade-minor-version` parameter and setting the value to `true`:

```azure-cli-interactive
--auto-upgrade-minor-version true
```

## Configuration settings

The extension enables you to set Dapr configuration options by using the `--configuration-settings` parameter. For example, to provision Dapr with high availability (HA) enabled, set the `global.ha.enabled` parameter to `true`:

```azure-cli-interactive
az k8s-extension create --cluster-type managedClusters \
--cluster-name myAKSCluster \
--resource-group myResourceGroup \
--name myDaprExtension \
--extension-type Microsoft.Dapr \
--auto-upgrade-minor-version true \
--configuration-settings "global.ha.enabled=true" \
--configuration-settings "dapr_operator.replicaCount=2"
```

> [!NOTE]
> If configuration settings are sensitive and need to be protected, for example cert related information, pass the `--configuration-protected-settings` parameter and the value will be protected from being read.

If no configuration-settings are passed, the Dapr configuration defaults to:

```yaml
  ha:
    enabled: true
    replicaCount: 3
    disruption:
      minimumAvailable: ""
      maximumUnavailable: "25%"
  prometheus:
    enabled: true
    port: 9090
  mtls:
    enabled: true
    workloadCertTTL: 24h
    allowedClockSkew: 15m
```

For a list of available options, please see [Dapr configuration][dapr-configuration-options].

## Targeting a specific Dapr version

> [!NOTE]
> Dapr is supported with a rolling window, including only the current and previous versions. It is your operational responsibility to remain up to date with these supported versions. If you have an older version of Dapr, you may have to do intermediate upgrades to get to a supported version.

The same command-line argument is used for installing a specific version of Dapr or rolling back to a previous version. Set `--auto-upgrade-minor-version` to `false` and `--version` to the version of Dapr you wish to install. If the `version` parameter is omitted, the extension will install the latest version of Dapr. For example, to use Dapr X.X.X: 

```azure-cli-interactive
az k8s-extension create --cluster-type managedClusters \
--cluster-name myAKSCluster \
--resource-group myResourceGroup \
--name myDaprExtension \
--extension-type Microsoft.Dapr \
--auto-upgrade-minor-version false \
--version X.X.X
```

## Limiting the extension to certain nodes (`nodeSelector`)

In some configurations you may only want to run Dapr on certain nodes. This can be accomplished by passing a `nodeSelector` in the extension configuration. Note that if the desired `nodeSelector` contains `.`, you must escape them from the shell and the extension. For example, the following configuration will install Dapr to only nodes with `kubernetes.io/os=linux`:

```azure-cli-interactive
az k8s-extension create --cluster-type managedClusters \
--cluster-name myAKSCluster \
--resource-group myResourceGroup \
--name myDaprExtension \
--extension-type Microsoft.Dapr \
--auto-upgrade-minor-version true \
--configuration-settings "global.ha.enabled=true" \
--configuration-settings "dapr_operator.replicaCount=2" \
--configuration-settings "global.nodeSelector.kubernetes\.io/os=linux"
```

## Show current configuration settings

Use the `az k8s-extension show` command to show the current Dapr configuration settings:  

```azure-cli-interactive
az k8s-extension show --cluster-type managedClusters \
--cluster-name myAKSCluster \
--resource-group myResourceGroup \
--name myDaprExtension
```

## Update configuration settings

> [!IMPORTANT]
> Some configuration options cannot be modified post-creation. Adjustments to these options require deletion and recreation of the extension. This is applicable to the following settings:
> * `global.ha.*`
> * `dapr_placement.*`

> [!NOTE]
> High availability (HA) can be enabled at any time. However, once enabled, disabling it requires deletion and recreation of the extension. If you aren't sure if high availability is necessary for your use case, we recommend starting with it disabled to minimize disruption.

To update your Dapr configuration settings, simply recreate the extension with the desired state. For example, assume we have previously created and installed the extension using the following configuration:

```azurecli-interactive
az k8s-extension create --cluster-type managedClusters \
--cluster-name myAKSCluster \
--resource-group myResourceGroup \
--name myDaprExtension \
--extension-type Microsoft.Dapr \
--auto-upgrade-minor-version true \  
--configuration-settings "global.ha.enabled=true" \
--configuration-settings "dapr_operator.replicaCount=2" 
```

To update the `dapr_operator.replicaCount` from 2 to 3, use the following:

```azurecli-interactive
az k8s-extension create --cluster-type managedClusters \
--cluster-name myAKSCluster \
--resource-group myResourceGroup \
--name myDaprExtension \
--extension-type Microsoft.Dapr \
--auto-upgrade-minor-version true \
--configuration-settings "global.ha.enabled=true" \
--configuration-settings "dapr_operator.replicaCount=3"
```

## Troubleshooting extension errors

If the extension fails to create or update, you can inspect where the creation of the extension failed by running the `az k8s-extension list` command. For example, if a wrong key is used in the configuration-settings, such as `global.ha=false` instead of `global.ha.enabled=false`: 

```azure-cli-interactive
az k8s-extension list --cluster-type managedClusters --cluster-name myAKSCluster --resource-group myResourceGroup
```

The below JSON is returned, and the error message is captured in the `message` property.

```json
"statuses": [
      {
        "code": "InstallationFailed",
        "displayStatus": null,
        "level": null,
        "message": "Error: {failed to install chart from path [] for release [dapr-1]: err [template: dapr/charts/dapr_sidecar_injector/templates/dapr_sidecar_injector_poddisruptionbudget.yaml:1:17: executing \"dapr/charts/dapr_sidecar_injector/templates/dapr_sidecar_injector_poddisruptionbudget.yaml\" at <.Values.global.ha.enabled>: can't evaluate field enabled in type interface {}]} occurred while doing the operation : {Installing the extension} on the config",
        "time": null
      }
],
```

### Troubleshooting Dapr

Troubleshoot Dapr errors via the [common Dapr issues and solutions guide][dapr-troubleshooting].

## Delete the extension

If you need to delete the extension and remove Dapr from your AKS cluster, you can use the following command: 

```azure-cli-interactive
az k8s-extension delete --resource-group myResourceGroup --cluster-name myAKSCluster --cluster-type managedClusters --name myDaprExtension
```

## Next Steps

- Once you have successfully provisioned Dapr in your AKS cluster, try deploying a [sample application][sample-application].

<!-- LINKS INTERNAL -->
[deploy-cluster]: ./tutorial-kubernetes-deploy-cluster.md
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-list]: /cli/azure/feature#az-feature-list
[az-provider-register]: /cli/azure/provider#az-provider-register
[sample-application]: ./quickstart-dapr.md
[k8s-version-support-policy]: ./supported-kubernetes-versions.md?tabs=azure-cli#kubernetes-version-support-policy
[arc-k8s-cluster]: /azure-arc/kubernetes/quickstart-connect-cluster.md
[update-extension]: ./cluster-extensions.md#update-extension-instance

<!-- LINKS EXTERNAL -->
[kubernetes-production]: https://docs.dapr.io/operations/hosting/kubernetes/kubernetes-production
[building-blocks-concepts]: https://docs.dapr.io/developing-applications/building-blocks/
[dapr-configuration-options]: https://github.com/dapr/dapr/blob/master/charts/dapr/README.md#configuration
[sample-application]: https://github.com/dapr/quickstarts/tree/master/hello-kubernetes#step-2---create-and-configure-a-state-store
[dapr-security]: https://docs.dapr.io/concepts/security-concept/
[dapr-deployment-annotations]: https://docs.dapr.io/operations/hosting/kubernetes/kubernetes-overview/#adding-dapr-to-a-kubernetes-deployment
[dapr-oss-support]: https://docs.dapr.io/operations/support/support-release-policy/
[dapr-supported-version]: https://docs.dapr.io/operations/support/support-release-policy/#supported-versions
[dapr-troubleshooting]: https://docs.dapr.io/operations/troubleshooting/common_issues/
[supported-cloud-regions]: https://azure.microsoft.com/global-infrastructure/services/?products=azure-arc
