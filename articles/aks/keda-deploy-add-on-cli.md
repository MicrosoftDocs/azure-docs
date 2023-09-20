---
title: Install the Kubernetes Event-driven Autoscaling (KEDA) add-on by using Azure CLI
description: Use Azure CLI to deploy the Kubernetes Event-driven Autoscaling (KEDA) add-on to Azure Kubernetes Service (AKS).
author: raorugan
ms.author: raorugan
ms.topic: article
ms.date: 10/10/2022
ms.custom: template-how-to, devx-track-azurecli
---

# Install the Kubernetes Event-driven Autoscaling (KEDA) add-on by using Azure CLI

This article shows you how to install the Kubernetes Event-driven Autoscaling (KEDA) add-on to Azure Kubernetes Service (AKS) by using Azure CLI. The article includes steps to verify that it's installed and running.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
- [Azure CLI installed](/cli/azure/install-azure-cli).
- Firewall rules are configured to allow access to the Kubernetes API server. ([learn more][aks-firewall-requirements])

## Install the KEDA add-on with Azure CLI

To install the KEDA add-on, use `--enable-keda` when creating or updating a cluster.

The following example creates a *myResourceGroup* resource group. Then it creates a *myAKSCluster* cluster with the KEDA add-on.

```azurecli-interactive
az group create --name myResourceGroup --location eastus

az aks create \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --enable-keda 
```

For existing clusters, use `az aks update` with `--enable-keda` option. The following code shows an example.

```azurecli-interactive
az aks update \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --enable-keda 
```

## Get the credentials for your cluster

Get the credentials for your AKS cluster by using the `az aks get-credentials` command. The following example command gets the credentials for *myAKSCluster* in the *myResourceGroup* resource group:

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```

## Verify that the KEDA add-on is installed on your cluster

To see if the KEDA add-on is installed on your cluster, verify that the `enabled` value is `true` for `keda` under `workloadAutoScalerProfile`. 

The following example shows the status of the KEDA add-on for *myAKSCluster* in *myResourceGroup*:

```azurecli-interactive
az aks show -g "myResourceGroup" --name myAKSCluster --query "workloadAutoScalerProfile.keda.enabled" 
```

## Verify that KEDA is running on your cluster

You can verify KEDA that's running on your cluster. Use `kubectl` to display the operator and metrics server installed in the AKS cluster under kube-system namespace. For example:

```azurecli-interactive
kubectl get pods -n kube-system 
```

The following example output shows that the KEDA operator and metrics API server are installed in the AKS cluster along with its status.

```output
kubectl get pods -n kube-system

keda-admission-webhooks-**********-2n9zl           1/1     Running   0            3d18h
keda-admission-webhooks-**********-69dkg           1/1     Running   0            3d18h
keda-operator-*********-4hb5n                      1/1     Running   0            3d18h
keda-operator-*********-pckpx                      1/1     Running   0            3d18h
keda-operator-metrics-apiserver-**********-gqg4s   1/1     Running   0            3d18h
keda-operator-metrics-apiserver-**********-trfcb   1/1     Running   0            3d18h
```

To verify the version of your KEDA, use `kubectl get crd/scaledobjects.keda.sh -o yaml `. For example:

```azurecli-interactive
kubectl get crd/scaledobjects.keda.sh -o yaml 
```

The following example output shows the configuration of KEDA in the `app.kubernetes.io/version` label:

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  annotations:
    controller-gen.kubebuilder.io/version: v0.9.0
    meta.helm.sh/release-name: aks-managed-keda
    meta.helm.sh/release-namespace: kube-system
  creationTimestamp: "2023-08-09T15:58:56Z"
  generation: 1
  labels:
    app.kubernetes.io/component: operator
    app.kubernetes.io/managed-by: Helm
    app.kubernetes.io/name: keda-operator
    app.kubernetes.io/part-of: keda-operator
    app.kubernetes.io/version: 2.10.1
    helm.toolkit.fluxcd.io/name: keda-adapter-helmrelease
    helm.toolkit.fluxcd.io/namespace: 64d3b6fd3365790001260647
  name: scaledobjects.keda.sh
  resourceVersion: "1421"
  uid: 29109c8c-638a-4bf5-ac1b-c28ad9aa11fa
spec:
  conversion:
    strategy: None
  group: keda.sh
  names:
    kind: ScaledObject
    listKind: ScaledObjectList
    plural: scaledobjects
    shortNames:
    - so
    singular: scaledobject
  scope: Namespaced
  # Redacted due to length
```

While KEDA provides various customization options, the KEDA add-on currently provides basic common configuration.

If you have requirement to run with another custom configurations, such as namespaces that should be watched or tweaking the log level, then you may edit the KEDA YAML manually and deploy it.

However, when the installation is customized there will no support offered for custom configurations.

## Disable KEDA add-on from your AKS cluster

When you no longer need KEDA add-on in the cluster, use the `az aks update` command with--disable-keda option. This execution will disable KEDA workload auto-scaler.

```azurecli-interactive
az aks update \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --disable-keda 
```

## Next steps

This article showed you how to install the KEDA add-on on an AKS cluster using Azure CLI. The steps to verify that KEDA add-on is installed and running are included. With the KEDA add-on installed on your cluster, you can [deploy a sample application][keda-sample] to start scaling apps.

You can troubleshoot KEDA add-on problems in [this article][keda-troubleshoot].

To learn more, view the [upstream KEDA docs][keda].

<!-- LINKS - internal -->
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-show]: /cli/azure/feature#az-feature-show
[az-aks-create]: /cli/azure/aks#az-aks-create
[az aks install-cli]: /cli/azure/aks#az-aks-install-cli
[az aks get-credentials]: /cli/azure/aks#az-aks-get-credentials
[az aks update]: /cli/azure/aks#az-aks-update
[az-group-delete]: /cli/azure/group#az-group-delete
[keda-troubleshoot]: /troubleshoot/azure/azure-kubernetes/troubleshoot-kubernetes-event-driven-autoscaling-add-on?context=/azure/aks/context/aks-context
[aks-firewall-requirements]: outbound-rules-control-egress.md#azure-global-required-network-rules

[kubectl]: https://kubernetes.io/docs/user-guide/kubectl
[keda]: https://keda.sh/
[keda-scalers]: https://keda.sh/docs/scalers/
[keda-sample]: https://github.com/kedacore/sample-dotnet-worker-servicebus-queue
