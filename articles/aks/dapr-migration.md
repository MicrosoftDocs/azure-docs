---
title: Migrate from Dapr OSS to the Dapr extension for Azure Kubernetes Service (AKS) 
description: Learn how to migrate from Dapr OSS to the Dapr extension for AKS
author: hhunter-ms
ms.author: hannahhunter
ms.reviewer: nigreenf
ms.service: container-service
ms.topic: article
ms.date: 07/21/2022
ms.custom: devx-track-azurecli
---

# Migrate from Dapr OSS to the Dapr extension for Azure Kubernetes Service (AKS)

You've installed and configured Dapr OSS on your Kubernetes cluster and want to migrate to the Dapr extension on AKS. Before you can successfully migrate to the Dapr extension, you need to fully remove Dapr OSS from your AKS cluster. In this guide, you will migrate from Dapr OSS by:

> [!div class="checklist"]
> - Uninstalling Dapr, including CRDs and the `dapr-system` namespace
> - Installing Dapr via the Dapr extension for AKS
> - Applying your components
> - Restarting your applications that use Dapr

> [!NOTE]
> Expect downtime of approximately 10 minutes while migrating to Dapr extension for AKS. Downtime may take longer depending on varying factors. During this downtime, no Dapr functionality should be expected to run.

## Uninstall Dapr 

#### [Dapr CLI](#tab/cli)

1. Run the following command to uninstall Dapr and all CRDs:

```bash
dapr uninstall -k –-all
```

1. Uninstall the Dapr namespace:

```bash
kubectl delete namespace dapr-system
```

> [!NOTE]
> `dapr-system` is the default namespace installed with `dapr init -k`. If you created a custom namespace, replace `dapr-system` with your namespace.

#### [Helm](#tab/helm)

1. Run the following command to uninstall Dapr:

```bash
dapr uninstall -k –-all
```

1. Uninstall CRDs: 

```bash
kubectl delete crd components.dapr.io
kubectl delete crd configurations.dapr.io
kubectl delete crd subscriptions.dapr.io
kubectl delete crd resiliencies.dapr.io
```

1. Uninstall the Dapr namespace:

```bash
kubectl delete namespace dapr-system
```

> [!NOTE]
> `dapr-system` is the default namespace while doing a Helm install. If you created a custom namespace (`helm install dapr dapr/dapr --namespace <my-namespace>`), replace `dapr-system` with your namespace.

---

## Register the `KubernetesConfiguration` service provider

If you have not previously used cluster extensions, you may need to register the service provider with your subscription. You can check the status of the provider registration using the [az provider list][az-provider-list] command, as shown in the following example:

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

## Install Dapr via the AKS extension

Once you've uninstalled Dapr from your system, install the [Dapr extension for AKS and Arc-enabled Kubernetes](./dapr.md#create-the-extension-and-install-dapr-on-your-aks-or-arc-enabled-kubernetes-cluster).

```bash
az k8s-extension create --cluster-type managedClusters \                                               
--cluster-name <dapr-cluster-name> \
--resource-group <dapr-resource-group> \
--name <dapr-ext> \
--extension-type Microsoft.Dapr
```

## Apply your components

```bash
kubectl apply -f <component.yaml>
```

## Restart your applications that use Dapr

Restarting the deployment will create a new sidecar from the new Dapr installation.

```bash
kubectl rollout restart <deployment-name>
```

## Next steps

Learn more about [the cluster extension](./dapr-overview.md) and [how to use it](./dapr.md).