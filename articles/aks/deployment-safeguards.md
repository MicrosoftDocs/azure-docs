---
title: Use deployment safeguards to enforce best practices in Azure Kubernetes Service (AKS)
description: Learn how to use deployment safeguards to enforce best practices on an Azure Kubernetes Service (AKS) cluster.
author: schaffererin
ms.topic: how-to
ms.custom:
  - build-2024
ms.date: 04/25/2024
ms.author: schaffererin
---

# Use deployment safeguards to enforce best practices in Azure Kubernetes Service (AKS) (Preview)

This article shows you how to use deployment safeguards to enforce best practices on an Azure Kubernetes Service (AKS) cluster.

## Overview

Throughout the development lifecycle, it's common for bugs, issues, and other problems to arise if the initial deployment of your Kubernetes resources includes misconfigurations. To ease the burden of Kubernetes development, Azure Kubernetes Service (AKS) offers deployment safeguards (preview). Deployment safeguards enforce Kubernetes best practices in your AKS cluster through Azure Policy controls.

Deployment safeguards offer two levels of configuration:

  * `Warning`: Displays warning messages in the code terminal to alert you of any noncompliant cluster configurations but still allows the request to go through.
  * `Enforcement`: Enforces compliant configurations by denying and mutating deployments if they don't follow best practices.

After you configure deployment safeguards for 'Warning' or 'Enforcement', Deployment safeguards programmatically assess your clusters at creation or update time for compliance. Deployment safeguards also display aggregated compliance information across your workloads at a per resource level via Azure Policy's compliance dashboard in the [Azure portal][Azure-Policy-compliance-portal] or in your CLI or terminal. Running a noncompliant workload indicates that your cluster isn't following best practices and that workloads on your cluster are at risk of experiencing issues caused by your cluster configuration.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Prerequisites

* You need to enable the Azure Policy add-on for AKS. For more information, see [Enable Azure Policy on your AKS cluster][policy-for-kubernetes].
* To configure deployment safeguards, you must have version `2.0.0b1` or later of the `aks-preview` extension. To install the extension, see [Install the aks-preview CLI extension](#install-the-aks-preview-cli-extension). We also recommend updating the Azure CLI to ensure you have the latest version installed.
* To create and modify the configuration for deployment safeguards, you need a subscription with the [following permissions on your AKS cluster][Azure-Policy-RBAC-permissions]:

    * *Microsoft.Authorization/policyAssignments/write*
    * *Microsoft.Authorization/policyAssignments/read*

* You need to register the deployment safeguards feature flag. To register the feature flag, see [Register the feature flag for deployment safeguards](#register-the-deployment-safeguards-feature-flag).

### Install the aks-preview CLI extension

1. Install the `aks-preview` CLI extension using the [`az extension add`][az-extension-add] command.

    ```azurecli-interactive
    az extension add --name aks-preview
    ```

2. Update the extension to ensure you have the latest version installed using the [`az extension update`][az-extension-update] command.

    ```azurecli-interactive
    az extension update --name aks-preview
    ```

### Register the deployment safeguards feature flag

1. Register the `SafeguardsPreview` feature flag using the [`az feature register`][az-feature-register] command.

    ```azurecli-interactive
    az feature register --namespace Microsoft.ContainerService --name SafeguardsPreview
    ```

    It takes a few minutes for the status to show *Registered*.

2. Verify the registration status using the [`az feature show`][az-feature-show] command.

    ```azurecli-interactive
    az feature show --namespace Microsoft.ContainerService --name SafeguardsPreview
    ```

3. When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider using the [`az provider register`][az-provider-register] command.
 
    ```azurecli-interactive
    az provider register --namespace Microsoft.ContainerService
    ```

## Deployment safeguards policies

>[!NOTE]
> The `ReadOnlyRootFilesystem` and `RootfilesystemInitContainers` policies are currently only available on Linux.

The following table lists the policies that become active and the Kubernetes resources they target when you enable deployment safeguards. You can view the [currently available deployment safeguards][deployment-safeguards-list] in the Azure portal as an Azure Policy definition or at [Azure Policy built-in definitions for Azure Kubernetes Service][Azure-Policy-built-in-definition-docs]. The intention behind this collection is to create a common and generic list of best practices applicable to most users and use cases.

| Deployment safeguard policy | Targeted Kubernetes resource | Mutation outcome if available |
|--------------|--------------|--------------|
| [Preview]: Cannot Edit Individual Nodes | Node | N/A |
| Kubernetes cluster containers CPU and memory resource limits shouldn't exceed the specified limits | Pod | Sets CPU resource limits to 500m if not set and sets memory limits to 500Mi if no path is present |
| [Preview]: Must Have Anti Affinity Rules Set | Deployment, StatefulSet, ReplicationController, ReplicaSet | N/A |
| [Preview]: No AKS Specific Labels | Deployment, StatefulSet, Replicaset | N/A |
| Kubernetes cluster containers should only use allowed images | Pod | N/A |
| [Preview]: Reserved System Pool Taints | Node | Removes the `CriticalAddonsOnly` taint from a user node pool if not set. AKS uses the `CriticalAddonsOnly` taint to keep customer pods away from the system pool. This configuration ensures a clear separation between AKS components and customer pods and prevents eviction of customer pods that don't tolerate the `CriticalAddonsOnly` taint. |
| Ensure cluster containers have readiness or liveness probes configured | Pod | N/A |
| Kubernetes clusters should use Container Storage Interface (CSI) driver StorageClass | StorageClass | N/A|
| [Preview]: Kubernetes cluster containers should only pull images when image pull secrets are present | Pod | N/A|
| [Preview]: Kubernetes cluster should implement accurate Pod Disruption Budgets | Deployment, ReplicaSet, StatefulSet | Sets `maxUnavailable` in PodDisruptionBudget resource to 1.|
| [Preview]: Kubernetes cluster services should use unique selectors | Service | N/A| 
| [Preview]: `ReadOnlyRootFilesystem` in Pod spec is set to true | Pod | Sets `readOnlyRootFilesystem` in the Pod spec to `true` if not set. This configuration prevents containers from writing to the root filesystem. |
| [Preview]: `RootfilesystemInitContainers` in Pod spec is set to true | Pod | Sets `rootFilesystemInitContainers` in the Pod spec to `true` if not set. |
| [Preview]: Kubernetes cluster container images should not include latest image tag | Deployment, StatefulSet, ReplicationController, ReplicaSet | N/A |
| [Preview]: Kubernetes cluster container images must include the preStop hook | Deployment, StatefulSet, ReplicationController, ReplicaSet | N/A |


If you want to submit an idea or request for deployment safeguards, open an issue in the [AKS GitHub repository][aks-gh-repo] and add `[deployment safeguards request]` to the beginning of the title.

## Enable deployment safeguards

>[!NOTE]
> If you enabled Azure Policy for the first time to use deployment safeguards, you might need to wait *up to 20 minutes* for Azure Policy to take effect.
>
> Using the deployment safeguards `Enforcement` level means you're opting in to deployments being blocked and mutated. Please consider how these policies might work with your AKS cluster before enabling `Enforcement`.

### Enable deployment safeguards on a new cluster

Enable deployment safeguards on a new cluster using the [`az aks create`][az-aks-create] command with the `--safeguards-level` and `--safeguards-version` flags.

If you want to receive noncompliance warnings, set the `--safeguards-level` to `Warning`. If you want to deny or mutate all noncompliant deployments, set it to `Enforcement`. To receive warnings, set the `--safeguards-level` to "Warning". To deny or mutate all deployments that don't adhere to deployment safeguards, set the `--safeguards-level` to "Enforcement". To set the deployment safeguards version, use the `--safeguards-version` flag. Currently, V2.0.0 is the latest version of deployment safeguards.

```azurecli-interactive
az aks create --name myAKSCluster --resource-group myResourceGroup --enable-addons azure-policy --safeguards-level Warning --safeguards-version v2.0.0
```

### Enable deployment safeguards on an existing cluster

Enable deployment safeguards on an existing cluster that has the Azure Policy add-on enabled using the [`az aks update`][az-aks-update] command with the `--safeguards-level` and `--safeguards-version` flags. If you want to receive noncompliance warnings, set the `--safeguards-level` to `Warning`. If you want to deny or mutate all noncompliant deployments, set it to `Enforcement`.

```azurecli-interactive
az aks update --name myAKSCluster --resource-group myResourceGroup --safeguards-level Enforcement --safeguards-version v2.0.0
```

If you want to update the deployment safeguards level of an existing cluster, use the [`az aks update`][az-aks-update] command with the `--safeguards-level` flag set to `Warning` or `Enforcement`.

```azurecli-interactive
az aks update --name myAKSCluster --resource-group myResourceGroup --safeguards-level Enforcement
```

### Excluding namespaces

You can also exclude certain namespaces from deployment safeguards. When you exclude a namespace, activity in that namespace is unaffected by deployment safeguards warnings or enforcement.

For example, to exclude the namespaces `ns1` and `ns2`, use a comma-separated list of namespaces with the `--safeguards-excluded-ns` flag, as shown in the following example:

```azurecli-interactive
az aks update --name myAKSCluster --resource-group myResourceGroup --safeguards-level Warning --safeguards-version v2.0.0 --safeguards-excluded-ns ns1,ns2 
```

### Update your deployment safeguard version

>[!NOTE]
> v2.0.0 is the latest version of deployment safeguards.

Update your deployment safeguards version using the [`az aks update`][az-aks-update] command with the `--safeguards-version` flag set to the new version. The following example updates an existing cluster to use version 2.0.0:

```azurecli-interactive
az aks update --name myAKSCluster --resource-group myResourceGroup --safeguards-version v2.0.0
```

## Verify compliance across clusters

After deploying your Kubernetes manifest, you see warnings or a potential denial message in your CLI or terminal if the cluster isn't compliant with deployment safeguards, as shown in the following examples:

**Warning**

```
$ kubectl apply -f pod.yml
Warning: [azurepolicy-k8sazurev2containerenforceprob-0e8a839bcd103e7b96a8] Container <my-container> in your Pod <my-pod> has no <livenessProbe>. Required probes: ["readinessProbe", "livenessProbe"]
Warning: [azurepolicy-k8sazurev2containerenforceprob-0e8a839bcd103e7b96a8] Container <my-container> in your Pod <my-pod> has no <readinessProbe>. Required probes: ["readinessProbe", "livenessProbe"]
Warning: [azurepolicy-k8sazurev1restrictedlabels-67c4210cc58f28acdfdb] Label <{"kubernetes.azure.com"}> is reserved for AKS use only
Warning: [azurepolicy-k8sazurev3containerlimits-a8754961dbd4c1d8b49d] container <my-container> has no resource limits
Warning: [azurepolicy-k8sazurev1containerrestrictedi-bde07e1776cbcc9aa8b8] my-pod in default does not have imagePullSecrets. Unauthenticated image pulls are not recommended.
pod/my-pod created
```

**Enforcement**

With deployment safeguard mutations, the `Enforcement` level mutates your Kubernetes resources when applicable. However, your Kubernetes resources still need to pass all safeguards to deploy successfully. If any safeguard policies fail, your resource is denied and won't be deployed.

```
$ kubectl apply -f pod.yml
Error from server (Forbidden): error when creating ".\pod.yml": admission webhook "validation.gatekeeper.sh" denied the request: [azurepolicy-k8sazurev2containerenforceprob-0e8a839bcd103e7b96a8] Container <my-container> in your Pod <my-pod> has no <livenessProbe>. Required probes: ["readinessProbe", "livenessProbe"]
[azurepolicy-k8sazurev2containerenforceprob-0e8a839bcd103e7b96a8] Container <my-container> in your Pod <my-pod> has no <readinessProbe>. Required probes: ["readinessProbe", "livenessProbe"]
[azurepolicy-k8sazurev2containerallowedimag-1ff6d14b2f8da22019d7] Container image my-image for container my-container has not been allowed.
[azurepolicy-k8sazurev1restrictedlabels-67c4210cc58f28acdfdb] Label <{"kubernetes.azure.com"}> is reserved for AKS use only
[azurepolicy-k8sazurev1containerrestrictedi-bde07e1776cbcc9aa8b8] my-pod in default does not have imagePullSecrets. Unauthenticated image pulls are not recommended.
```

If your Kubernetes resources comply with the applicable mutation safeguards and meet all other safeguard requirements, they will be successfully deployed, as shown in the following example:

```
$ kubectl apply -f pod.yml
pod/my-pod created
```

## Verify compliance across clusters using the Azure Policy dashboard

To verify deployment safeguards have been applied and to check on your cluster's compliance, navigate to the Azure portal page for your cluster and select **Policies**, then select **go to Azure Policy**.

From the list of policies and initiatives, select the initiative associated with deployment safeguards. You see a dashboard showing compliance state across your AKS cluster.

> [!NOTE]
> To properly assess compliance across your AKS cluster, the Azure Policy initiative must be scoped to your cluster's resource group.

## Disable deployment safeguards

Disable deployment safeguards on your cluster using the [`az aks update`][az-aks-update] command and set the `--safeguards-level` to `Off`.

```azurecli-interactive
az aks update --name myAKSCluster --resource-group myResourceGroup --safeguards-level Off
```

--

## FAQ

#### I enabled deployment safeguards with Azure Policy for the first time. Why don't I see any warnings? Why aren't my pods being declined?

Azure Policy can take up to 35 minutes to sync with your cluster after it is enabled for the first time.

#### I just switched from Warning to Enforcement. Will this take effect immediately?

When switching deployment safeguard levels, you may need to wait up to 15 minutes for the new level to take effect.

#### Can I create my own mutations?

No. If you have an idea for a safeguard, open an issue in the [AKS GitHub repository][aks-gh-repo] and add `[deployment safeguards request]` to the beginning of the title.

#### Can I pick and choose which mutations I want in Enforcement?

No. Deployment safeguards is all or nothing. Once you turn on Warning or Enforcement, all safeguards will be active.

#### Why did my deployment resource get admitted even though it wasn't following best practices?

Deployment safeguards enforce best practice standards through Azure Policy controls and has policies that validate against Kubernetes resources. To evaluate and enforce cluster components, Azure Policy extends [Gatekeeper](https://open-policy-agent.github.io/gatekeeper/website/). Gatekeeper enforcement also currently operates in a [`fail-open` model](https://open-policy-agent.github.io/gatekeeper/website/docs/failing-closed/#considerations). As there's no guarantee that Gatekeeper will respond to our networking call, we make sure that in that case, the validation is skipped so that the deny doesn't block your deployments.

To learn more, see [workload validation in Gatekeeper](https://open-policy-agent.github.io/gatekeeper/website/docs/workload-resources/).

## Next steps

* Learn more about [best practices][best-practices] for operating an AKS cluster.

<!-- LINKS -->
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
[best-practices]: ./best-practices.md
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-show]: /cli/azure/feature#az-feature-show
[aks-gh-repo]: https://github.com/Azure/AKS
[policy-for-kubernetes]: /azure/governance/policy/concepts/policy-for-kubernetes#install-azure-policy-add-on-for-aks
[deployment-safeguards-list]: https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/InitiativeDetail.ReactView/id/%2Fproviders%2FMicrosoft.Authorization%2FpolicySetDefinitions%2Fc047ea8e-9c78-49b2-958b-37e56d291a44/scopes/
[Azure-Policy-built-in-definition-docs]: /azure/aks/policy-reference#policy-definitions
[Azure-Policy-compliance-portal]: https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyMenuBlade/~/Compliance
[Azure-Policy-RBAC-permissions]: /azure/governance/policy/overview#azure-rbac-permissions-in-azure-policy
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-update]: /cli/azure/aks#az-aks-update
