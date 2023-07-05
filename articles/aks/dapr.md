---
title: Dapr extension for Azure Kubernetes Service (AKS) and Arc-enabled Kubernetes
description: Install and configure Dapr on your Azure Kubernetes Service (AKS) and Arc-enabled Kubernetes clusters using the Dapr cluster extension.
author: greenie-msft
ms.author: nigreenf
ms.service: azure-kubernetes-service
ms.topic: article
ms.date: 03/06/2023
ms.custom: devx-track-azurecli, ignite-fall-2021, event-tier1-build-2022, references_regions
---

# Dapr extension for Azure Kubernetes Service (AKS) and Arc-enabled Kubernetes

As a portable, event-driven runtime, [Dapr](https://dapr.io/) simplifies building resilient, stateless, and stateful applications that run on the cloud and edge and embrace the diversity of languages and developer frameworks. With its sidecar architecture, Dapr helps you tackle the challenges that come with building microservices and keeps your code platform agnostic. In particular, it helps solve problems around services:
- Calling other services reliably and securely
- Building event-driven apps with pub-sub
- Building applications that are portable across multiple cloud services and hosts (for example, Kubernetes vs. a VM)

[Using the Dapr extension to provision Dapr on your AKS or Arc-enabled Kubernetes cluster](../azure-arc/kubernetes/conceptual-extensions.md) eliminates the overhead of:
- Downloading Dapr tooling
- Manually installing and managing the runtime on your AKS cluster

Additionally, the extension offers support for all [native Dapr configuration capabilities][dapr-configuration-options] through simple command-line arguments.

> [!NOTE]
> If you plan on installing Dapr in a Kubernetes production environment, see the [Dapr guidelines for production usage][kubernetes-production] documentation page.

## How it works

The Dapr extension uses the Azure CLI to provision the Dapr control plane on your AKS or Arc-enabled Kubernetes cluster, creating the following Dapr services:

| Dapr service | Description |
| ------------ | ----------- | 
| `dapr-operator` | Manages component updates and Kubernetes services endpoints for Dapr (state stores, pub/subs, etc.) |
| `dapr-sidecar-injector` | Injects Dapr into annotated deployment pods and adds the environment variables `DAPR_HTTP_PORT` and `DAPR_GRPC_PORT` to enable user-defined applications to easily communicate with Dapr without hard-coding Dapr port values. |
| `dapr-placement` | Used for actors only. Creates mapping tables that map actor instances to pods. |
| `dapr-sentry` | Manages mTLS between services and acts as a certificate authority. For more information, read the [security overview][dapr-security]. |

Once Dapr is installed on your cluster, you can begin to develop using the Dapr building block APIs by [adding a few annotations][dapr-deployment-annotations] to your deployments. For a more in-depth overview of the building block APIs and how to best use them, see the [Dapr building blocks overview][building-blocks-concepts].

> [!WARNING]
> If you install Dapr through the AKS or Arc-enabled Kubernetes extension, our recommendation is to continue using the extension for future management of Dapr instead of the Dapr CLI. Combining the two tools can cause conflicts and result in undesired behavior.

## Currently supported

### Dapr versions

The Dapr extension support varies depending on how you manage the runtime. 

**Self-managed**  
For self-managed runtime, the Dapr extension supports:
- [The latest version of Dapr and two previous versions (N-2)][dapr-supported-version]
- Upgrading minor version incrementally (for example, 1.5 -> 1.6 -> 1.7) 

Self-managed runtime requires manual upgrade to remain in the support window. To upgrade Dapr via the extension, follow the [Update extension instance](deploy-extensions-az-cli.md#update-extension-instance) instructions.

**Auto-upgrade**  
Enabling auto-upgrade keeps your Dapr extension updated to the latest minor version. You may experience breaking changes between updates.

### Components

Azure + open source components are supported. Alpha and beta components are supported via best effort.

### Clouds/regions

Global Azure cloud is supported with Arc support on the following regions:

| Region | AKS support | Arc for Kubernetes support |
| ------ | ----------- | -------------------------- |
| `australiaeast` | :heavy_check_mark: | :heavy_check_mark: |
| `australiasoutheast` | :heavy_check_mark: | :x: |
| `brazilsouth` | :heavy_check_mark: | :x: |
| `canadacentral` | :heavy_check_mark: | :heavy_check_mark: |
| `canadaeast` | :heavy_check_mark: | :heavy_check_mark: |
| `centralindia` | :heavy_check_mark: | :heavy_check_mark: |
| `centralus` | :heavy_check_mark: | :heavy_check_mark: |
| `eastasia` | :heavy_check_mark: | :heavy_check_mark: |
| `eastus` | :heavy_check_mark: | :heavy_check_mark: |
| `eastus2` | :heavy_check_mark: | :heavy_check_mark: |
| `eastus2euap` | :x: | :heavy_check_mark: |
| `francecentral` | :heavy_check_mark: | :heavy_check_mark: |
| `francesouth` | :heavy_check_mark: | :x: |
| `germanywestcentral` | :heavy_check_mark: | :heavy_check_mark: |
| `japaneast` | :heavy_check_mark: | :heavy_check_mark: |
| `japanwest` | :heavy_check_mark: | :x: |
| `koreacentral` | :heavy_check_mark: | :heavy_check_mark: |
| `koreasouth` | :heavy_check_mark: | :x: |
| `northcentralus` | :heavy_check_mark: | :heavy_check_mark: |
| `northeurope` | :heavy_check_mark: | :heavy_check_mark: |
| `norwayeast` | :heavy_check_mark: | :x: |
| `southafricanorth` | :heavy_check_mark: | :x: |
| `southcentralus` | :heavy_check_mark: | :heavy_check_mark: |
| `southeastasia` | :heavy_check_mark: | :heavy_check_mark: |
| `southindia` | :heavy_check_mark: | :x: |
| `swedencentral` | :heavy_check_mark: | :heavy_check_mark: |
| `switzerlandnorth` | :heavy_check_mark: | :heavy_check_mark: |
| `uaenorth` | :heavy_check_mark: | :x: |
| `uksouth` | :heavy_check_mark: | :heavy_check_mark: |
| `ukwest` | :heavy_check_mark: | :x: |
| `westcentralus` | :heavy_check_mark: | :heavy_check_mark: |
| `westeurope` | :heavy_check_mark: | :heavy_check_mark: |
| `westus` | :heavy_check_mark: | :heavy_check_mark: |
| `westus2` | :heavy_check_mark: | :heavy_check_mark: |
| `westus3` | :heavy_check_mark: | :heavy_check_mark: |


## Prerequisites 

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Install the latest version of the [Azure CLI][install-cli].
- If you don't have one already, you need to create an [AKS cluster][deploy-cluster] or connect an [Arc-enabled Kubernetes cluster][arc-k8s-cluster].
- Make sure you have [an Azure Kubernetes Service RBAC Admin role](../role-based-access-control/built-in-roles.md#azure-kubernetes-service-rbac-admin) 

### Set up the Azure CLI extension for cluster extensions

Install the `k8s-extension` Azure CLI extension by running the following commands:
  
```azurecli-interactive
az extension add --name k8s-extension
```

If the `k8s-extension` extension is already installed, you can update it to the latest version using the following command:

```azurecli-interactive
az extension update --name k8s-extension
```

### Register the `KubernetesConfiguration` service provider

If you haven't previously used cluster extensions, you may need to register the service provider with your subscription. You can check the status of the provider registration using the [az provider list][az-provider-list] command, as shown in the following example:

```azurecli-interactive
az provider list --query "[?contains(namespace,'Microsoft.KubernetesConfiguration')]" -o table
```

The *Microsoft.KubernetesConfiguration* provider should report as *Registered*, as shown in the following example output:

```output
Namespace                          RegistrationState    RegistrationPolicy
---------------------------------  -------------------  --------------------
Microsoft.KubernetesConfiguration  Registered           RegistrationRequired
```

If the provider shows as *NotRegistered*, register the provider using the [az provider register][az-provider-register] as shown in the following example:

```azurecli-interactive
az provider register --namespace Microsoft.KubernetesConfiguration
```

## Create the extension and install Dapr on your AKS or Arc-enabled Kubernetes cluster

When installing the Dapr extension, use the flag value that corresponds to your cluster type:

- **AKS cluster**: `--cluster-type managedClusters`. 
- **Arc-enabled Kubernetes cluster**: `--cluster-type connectedClusters`.

> [!NOTE]
> If you're using Dapr OSS on your AKS cluster and would like to install the Dapr extension for AKS, read more about [how to successfully migrate to the Dapr extension][dapr-migration]. 

Create the Dapr extension, which installs Dapr on your AKS or Arc-enabled Kubernetes cluster. For example, for an AKS cluster:

```azurecli
az k8s-extension create --cluster-type managedClusters \
--cluster-name myAKSCluster \
--resource-group myResourceGroup \
--name dapr \
--extension-type Microsoft.Dapr
```

You have the option of allowing Dapr to auto-update its minor version by specifying the `--auto-upgrade-minor-version` parameter and setting the value to `true`:

```azurecli
--auto-upgrade-minor-version true
```

When configuring the extension, you can choose to install Dapr from a particular `--release-train`. Specify one of the two release train values:

| Value    | Description                               |
| -------- | ----------------------------------------- |
| `stable` | Default.                                  |
| `dev`    | Early releases, can contain experimental features. Not suitable for production. |

For example:

```azurecli
--release-train stable
```

## Targeting a specific Dapr version

> [!NOTE]
> Dapr is supported with a rolling window, including only the current and previous versions. It is your operational responsibility to remain up to date with these supported versions. If you have an older version of Dapr, you may have to do intermediate upgrades to get to a supported version.

The same command-line argument is used for installing a specific version of Dapr or rolling back to a previous version. Set `--auto-upgrade-minor-version` to `false` and `--version` to the version of Dapr you wish to install. If the `version` parameter is omitted, the extension installs the latest version of Dapr. For example, to use Dapr X.X.X: 

```azurecli
az k8s-extension create --cluster-type managedClusters \
--cluster-name myAKSCluster \
--resource-group myResourceGroup \
--name dapr \
--extension-type Microsoft.Dapr \
--auto-upgrade-minor-version false \
--version X.X.X
```

## Troubleshooting extension errors

If the extension fails to create or update, try suggestions and solutions in the [Dapr extension troubleshooting guide](./dapr-troubleshooting.md).

### Troubleshooting Dapr

Troubleshoot Dapr errors via the [common Dapr issues and solutions guide][dapr-troubleshooting].

## Delete the extension

If you need to delete the extension and remove Dapr from your AKS cluster, you can use the following command: 

```azurecli
az k8s-extension delete --resource-group myResourceGroup --cluster-name myAKSCluster --cluster-type managedClusters --name dapr
```

## Next Steps

- Learn more about [extra settings and preferences you can set on the Dapr extension][dapr-settings].
- Once you have successfully provisioned Dapr in your AKS cluster, try deploying a [sample application][sample-application].
- Try out [Dapr Workflow on your Dapr extension for AKS][dapr-workflow]

<!-- LINKS INTERNAL -->
[deploy-cluster]: ./tutorial-kubernetes-deploy-cluster.md
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-list]: /cli/azure/feature#az-feature-list
[az-provider-register]: /cli/azure/provider#az-provider-register
[sample-application]: ./quickstart-dapr.md
[k8s-version-support-policy]: ./supported-kubernetes-versions.md?tabs=azure-cli#kubernetes-version-support-policy
[arc-k8s-cluster]: ../azure-arc/kubernetes/quickstart-connect-cluster.md
[install-cli]: /cli/azure/install-azure-cli
[dapr-migration]: ./dapr-migration.md
[dapr-settings]: ./dapr-settings.md
[dapr-workflow]: ./dapr-workflow.md

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
