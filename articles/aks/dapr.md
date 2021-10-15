---
title: Dapr extension for Azure Kubernetes Service (AKS) (preview)
description: Install and configure Dapr on your Azure Kubernetes Service (AKS) cluster using the Dapr cluster extension.
author: greenie-msft 
ms.author: nigreenf
ms.service: container-service
ms.topic: article
ms.date: 10/15/2021
ms.custom: devx-track-azurecli
---

# Dapr extension for Azure Kubernetes Service (AKS) (preview)

<!-- TODO: Add Nick's blurb about Dapr -->

By using the AKS Dapr extension to provision Dapr on your AKS cluster, you eliminate the overhead of downloading Dapr tooling and manually installing and managing the runtime on your AKS cluster. Additionally, the extension offers support for all native Dapr configuration capabilities through simple command-line arguments.

> [!NOTE]
> If you plan on installing Dapr in a Kubernetes production environment, please see our [guidelines for production usage][kubernetes-production] documentation page.

## How it works

The AKS Dapr extension uses the Azure CLI to provision the Dapr control plane on your AKS cluster. This will create:

- **dapr-operator**: Manages component updates and Kubernetes services endpoints for Dapr (state stores, pub/subs, etc.)
- **dapr-sidecar-injector**: Injects Dapr into annotated deployment pods and adds the environment variables `DAPR_HTTP_PORT` and `DAPR_GRPC_PORT` to enable user-defined applications to easily communicate with Dapr without hard-coding Dapr port values.
- **dapr-placement**: Used for actors only. Creates mapping tables that map actor instances to pods
- **dapr-sentry**: Manages mTLS between services and acts as a certificate authority. For more information read the security overview.

Once Dapr is installed on your AKS cluster, your application services now have the Dapr sidecar running alongside them. This enables you to immediately start using the Dapr building block APIs. For a more in-depth overview of the building block APIs and how to best use them, please see the [Dapr building blocks overview][building-blocks-concepts].

> [!WARNING]
> If you install Dapr through the AKS extension, our recommendation is to continue using the extension for future management of Dapr instead of the Dapr CLI. Combining the two tools can cause conflicts and result in undesired behavior.

## Prerequisites 
- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Before you start, install the latest version of the [Azure CLI](/cli/azure/install-azure-cli-windows) and the *aks-preview* extension.
- You will also need an [AKS cluster][deploy-cluster].

<!-- TODO: Is there a minimum required K8s version? If so add it to prerequisites -->

## Register the `Extensions` and `AKS-Dapr` preview features

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

To create an AKS cluster that can use the Dapr extension, you must enable the `Extensions` and `AKS-Dapr` feature flags on your subscription.

Register the `Extensions` and `AKS-Dapr` feature flags by using the [az feature register][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.KubernetesConfiguration" --name "Extensions"
az feature register --namespace "Microsoft.ContainerService" --name "AKS-Dapr"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [az feature list][az-feature-list] command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.KubernetesConfiguration/Extensions')].{Name:name,State:properties.state}"
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/AKS-Dapr')].{Name:name,State:properties.state}"
```

When ready, refresh the registration of the *Microsoft.KubernetesConfiguration* and *Microsoft.ContainerService* resource providers by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.KubernetesConfiguration
az provider register --namespace Microsoft.ContainerService
```

## Create the extension and install Dapr on your AKS cluster

Once your subscription is registered to use Kubernetes extensions, you can create the Dapr extension, which will install Dapr on your AKS cluster. For example:

<!-- TODO: get link to az k8s-extension CLI reference -->

```azure-cli-interactive
az k8s-extension create --cluster-type managedClusters \
--cluster-name myAKSCluster \
--resource-group myResourceGroup \
--name myDaprExtension \
--extension-type Microsoft.Dapr \
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
--configuration-settings "dapr_operator.replicaCount=2" \
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

The same command-line argument is used for installing a specific version of Dapr or rolling back to a previous version. Set `--auto-upgrade-minor-version` to `false` and `--version` to the version of Dapr you wish to install. If the `version` parameter is omitted, the extension will install the latest version of Dapr. For example, to use Dapr 1.4.3: 

```azure-cli-interactive
az k8s-extension create --cluster-type managedClusters \
--cluster-name myAKSCluster \
--resource-group myResourceGroup 
--name myDaprExtension \
--extension-type Microsoft.Dapr \
--auto-upgrade-minor-version false \
--version 1.4.3 \
```

## Show current configuration settings

Use the `az k8s-extension show` command to show the current Dapr configuration settings:  

```azure-cli-interactive
az k8s-extension show --cluster-type managedClusters \
--cluster-name myAKSCluster \
--resource-group myResourceGroup \
--name myDaprExtension
```

### Troubleshooting extension errors

If the extension fails to create or update, you can inspect where the creation of the extension failed by running the `az k8s-extension list` command. For example, if a wrong key is used in the configuration-settings for `global.ha=false`: 

<!-- TODO: Needs a little clarity. Is "global.ha=false" the incorrect key? Is it meant to read "global.ha.enabled=false"? 
           Perhaps something like "For example, assume an incorrect key has been provided in the configuration-settings for 'global.ha.enabled' is more 
           straightforward

-->
<!-- TODO: add az k8s-extension list CLI reference -->

```bash
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

### Delete the extension

If you need to delete the extension and remove Dapr from your AKS cluster, you can use the following command: 

```bash
az k8s-extension delete --resource-group myResourceGroup --cluster-name myAKSCluster --cluster-type managedClusters --name myDaprExtension --debug -y --no-wait
```

### Next Steps
- Once you have successfully provisioned Dapr in your AKS cluster, you can try one of the [sample applications][sample-applications]


<!-- LINKS INTERNAL -->
[deploy-cluster]: ./tutorial-kubernetes-deploy-cluster.md
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-provider-register]: /cli/azure/provider#az_provider_register

<!-- LINKS EXTERNAL -->

[kubernetes-production]: https://docs.dapr.io <!-- TODO: fill in with real link -->
[building-blocks-concepts]: https://docs.dapr.io/concepts/building-blocks-concept
[dapr-configuration-options]: https://github.com/dapr/dapr/blob/master/charts/dapr/README.md#configuration
[sample-applications]: https://docs.dapr.io <!-- TODO: fill in with real link -->