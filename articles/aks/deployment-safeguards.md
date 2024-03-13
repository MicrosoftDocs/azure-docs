---
title: Use deployment safeguards to enforce best practices
description: Learn how to use deployment safeguards to enforce best practices on an Azure Kubernetes Service (AKS) cluster.
author: nickomang
ms.topic: how-to
ms.date: 03/11/2024
ms.author: nickoman
---

# Deployment safeguards (preview)

It's well known that Kubernetes can be difficult to understand and use. Throughout the development lifecycle, it's common for bugs, issues, and other problems to arise if misconfigurations have taken place during the initial deployment of your Kubernetes resources. To ease the burden of Kubernetes development, Azure Kubernetes Service (AKS) offers deployment safeguards; a new feature that enforces Kubernetes best practices in your AKS cluster through Azure Policy controls.

Deployment safeguards offers two levels of configuration. `Warning`  will populate warning messages in the code terminal when a cluster isn't following best practices, letting you know your cluster configuration is non-compliant but allowing the request to go through. `Enforcement` will provide enforcement of compliant configurations, denying deployments if they are not following best practices.

Once you set the configuration level to 'Warning' or 'Enforcement' mode, Azure Policy programmatically assesses your clusters at creation/update time and also displays aggregated compliance across your workloads at a per resource level via Azure Policy's compliance dashboard in the [Azure portal][Azure-Policy-compliance-portal] as well as your CLI/terminal. Running a non-compliant workload indicates that your cluster isn't following best practices and that workloads on your cluster are at risk of experiencing issues caused by your cluster configuration.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Before you get started

### Prerequisites

- Azure Policy's Add-On for AKS must be enabled. For more details, see [enabling Azure Policy on your AKS cluster][policy-for-kubernetes].

- Deployment safeguards requires at least version `2.0.0b1` of the aks-preview extension. Please install the latest version of Azure CLI and the `aks-preview` CLI extension

- In order to create and modify deployment safeguards-related configuration, you'll need a subscription with the [following permissions on your AKS cluster][Azure-Policy-RBAC-permissions]:

    - *Microsoft.Authorization/policyAssignments/write*

    - *Microsoft.Authorization/policyAssignments/read*

#### Install the `aks-preview` CLI extension

1. Install the `aks-preview` CLI extension using the [`az extension add`][az-extension-add] command.

    ```azurecli-interactive
    az extension add --name aks-preview
    ```

2. Update the extension to ensure you have the latest version installed using the [`az extension update`][az-extension-update] command.

    ```azurecli-interactive
    az extension update --name aks-preview
    ```

#### Register the 'deployment SafeguardsPreview' feature flag

Register the `SafeguardsPreview` feature flag by using the [az feature register][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace Microsoft.ContainerService --name SafeguardsPreview
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [az feature show][az-feature-show] command:

```azurecli-interactive
az feature show --namespace Microsoft.ContainerService --name SafeguardsPreview
```

When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Deployment safeguards policies

Below is the list of deployment safeguard policies. These are the policies that will be active when you enable deployment safeguards. You can see the [currently available deployment safeguards][deployment-safeguards-list] in the Azure portal as an Azure Policy definition, or view them at [Azure Policy built-in definitions for Azure Kubernetes Service][Azure-Policy-built-in-definition-docs]. The intention behind this collection is to create a common and generic list of best practices applicable to most users and use cases.

|  Deployment safeguard policies |
|--------------|
| [Preview]: Cannot Edit Individual Nodes |
| Kubernetes cluster containers CPU and memory resource limits should not exceed the specified limits |
| [Preview]: Must Have Anti Affinity Rules Set |
| [Preview]: No AKS Specific Labels |
| Kubernetes cluster containers should only use allowed images |
| [Preview]: Reserved System Pool Taints |
| Ensure cluster containers have readiness or liveness probes configured |
| Kubernetes clusters should use Container Storage Interface(CSI) driver StorageClass |
| [Preview]: Kubernetes cluster containers should only pull images when image pull secrets are present |
| [Preview]: Kubernetes cluster should implement accurate Pod Disruption Budgets |
| [Preview]: Kubernetes cluster services should use unique selectors |

If you would like to submit an idea or request for deployment safeguards, open an issue in the [AKS GitHub repository][aks-gh-repo] and add `[deployment safeguards request]` to the beginning of the title.


## Enable deployment safeguards

>[!NOTE]
> If you have enabled Azure Policy for the first time to use deployment safeguards, you may need to wait up to 35 minutes for Azure Policy to take effect.

>[!NOTE]
> By using deployment safeguards `Enforcement` mode, you are opting in to your deployments being blocked as well. Please be aware of how these policies will work with your AKS cluster before you enable `Enforcement`.

To enable deployment safeguards on a new cluster, use the `--safeguards-level` fkag.

To receive "Warnings", set the --safeguards-level to "Warning".
To deny all deployments that do not adhere to deployment safeguards, set the --safeguards-level to "Enforcement".

```azurecli-interactive
az aks create --name myAKSCluster --resource-group myResourceGroup --enable-addons azure-policy --safeguards-level Warning
```

You can also update an existing cluster to enable deployment safeguards, assuming Azure Policy has already been enabled.

```azurecli-interactive
az aks update --name myAKSCluster --resource-group myResourceGroup --safeguards-level Enforcement
```

### Excluding namespaces

It's also possible to exclude certain namespaces from deployment safeguards. This means all activity in the excluded namespaces won't be impacted by deployment safeguards warnings or enforcement.

For example, to exclude the namespaces `ns1` and `ns2`, use a comma-separated list.

```azurecli-interactive
az aks update --name myAKSCluster --resource-group myResourceGroup --safeguards-level Warning --safeguards-excluded-ns ns1,ns2 
```

## Verify compliance across cluster via your CLI/terminal

After deploying your Kubernetes manifest, you will see warnings or a potential denial message in your CLI/terminal. Below are examples of what that experience might look like for you.

**Warning**
```
PS C:\Users\testUser\Code>  kubectl apply -f pod.yml
Warning: [azurepolicy-k8sazurev2containerenforceprob-0e8a839bcd103e7b96a8] Container <my-container> in your Pod <my-pod> has no <livenessProbe>. Required probes: ["readinessProbe", "livenessProbe"]
Warning: [azurepolicy-k8sazurev2containerenforceprob-0e8a839bcd103e7b96a8] Container <my-container> in your Pod <my-pod> has no <readinessProbe>. Required probes: ["readinessProbe", "livenessProbe"]
Warning: [azurepolicy-k8sazurev1restrictedlabels-67c4210cc58f28acdfdb] Label <{"kubernetes.azure.com"}> is reserved for AKS use only
Warning: [azurepolicy-k8sazurev3containerlimits-a8754961dbd4c1d8b49d] container <my-container> has no resource limits
Warning: [azurepolicy-k8sazurev1containerrestrictedi-bde07e1776cbcc9aa8b8] my-pod in default does not have imagePullSecrets. Unauthenticated image pulls are not recommended.
pod/my-pod created
```

**Enforcement**
```
PS C:\Users\testUser\Code>  kubectl apply -f pod.yml
Error from server (Forbidden): error when creating ".\pod.yml": admission webhook "validation.gatekeeper.sh" denied the request: [azurepolicy-k8sazurev2containerenforceprob-0e8a839bcd103e7b96a8] Container <my-container> in your Pod <my-pod> has no <livenessProbe>. Required probes: ["readinessProbe", "livenessProbe"]
[azurepolicy-k8sazurev2containerenforceprob-0e8a839bcd103e7b96a8] Container <my-container> in your Pod <my-pod> has no <readinessProbe>. Required probes: ["readinessProbe", "livenessProbe"]
[azurepolicy-k8sazurev2containerallowedimag-1ff6d14b2f8da22019d7] Container image my-image for container my-container has not been allowed.
[azurepolicy-k8sazurev1restrictedlabels-67c4210cc58f28acdfdb] Label <{"kubernetes.azure.com"}> is reserved for AKS use only
[azurepolicy-k8sazurev3containerlimits-a8754961dbd4c1d8b49d] container <my-container> has no resource limits
[azurepolicy-k8sazurev1containerrestrictedi-bde07e1776cbcc9aa8b8] my-pod in default does not have imagePullSecrets. Unauthenticated image pulls are not recommended.
```


## Verify compliance across cluster via the Azure Policy Dashboard

To verify deployment safeguards have been applied and to check on your cluster's compliance, navigate to the Azure portal page for your cluster and select **Policies**, then select **go to Azure Policy**.

From the list of policies and initiatives, select the initiative associated with deployment safeguards.

You'll see a dashboard showing compliance state across your AKS cluster.

> [!NOTE]
> To properly assess compliance across your AKS cluster, the Azure Policy initiative must be scoped to your cluster's resource group.

## Disable deployment safeguards

To disable deployment safeguards on your cluster, set the `--safeguards-level` to `Off`.

```azurecli-interactive
az aks update --name myAKSCluster --resource-group myResourceGroup --safeguards-level Off
```
--

## FAQ

### I just enabled deployment safeguards with Azure Policy for the first time. Why don't I see any warnings? Why doesn't my pods get declined?

Azure Policy can take up to 35 minutes to sync with your cluster when it is turned on for the first time.

### I just switched from Warning to Enforcement. Will this take effect immediately?

When switching deployment safeguard levels, you may need to wait up to 15 minutes for the new level to take effect.

### Why did my deployment resource get admitted even though it wasn't following best practices?

Deployment safeguards enforces best practice standards through Azure Policy controls and has policies that validate against pods as well as deployments. To evaluate and enforce cluster components (i.e. pods, namespaces), Azure Policy extends [Gatekeeper](https://open-policy-agent.github.io/gatekeeper/website/). Gatekeeper enforcement also currently operates in a [`fail-open` model](https://open-policy-agent.github.io/gatekeeper/website/docs/failing-closed/#considerations). As there is no guarantee that Gatekeeper will respond to our networking call, we make sure that in that case, the validation will be skipped so that the deny does not block your deployments.

To learn more, see [workload validation in Gatekeeper](https://open-policy-agent.github.io/gatekeeper/website/docs/workload-resources/).


## Next steps

- Learn more about [best practices][best-practices] for operating an AKS cluster.

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
[Azure-Policy-built-in-definition-docs]: https://learn.microsoft.com/azure/aks/policy-reference#policy-definitions
[Azure-Policy-compliance-portal]: https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyMenuBlade/~/Compliance
[Azure-Policy-RBAC-permissions]: https://learn.microsoft.com/azure/governance/policy/overview#azure-rbac-permissions-in-azure-policy
