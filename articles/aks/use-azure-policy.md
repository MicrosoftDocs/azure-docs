---
title: Use Azure Policy to secure your cluster
description: Use Azure Policy to secure an Azure Kubernetes Service (AKS) cluster.
ms.service: container-service
ms.topic: how-to 
ms.date: 02/17/2021
ms.custom: template-how-to
---

# Secure your cluster with Azure Policy

To improve the security of your Azure Kubernetes Service (AKS) cluster, you can apply and enforce built-in security policies on your cluster using Azure Policy. [Azure Policy][azure-policy] helps to enforce organizational standards and to assess compliance at-scale. After installing the [Azure Policy Add-on for AKS][kubernetes-policy-reference], you can apply individual policies or groups or policies called initiatives to your cluster. See [Azure Policy built-in definitions for AKS][aks-policies] for a complete list of AKS polices and initiatives.

This article shows you how to apply policies to your cluster and verify those polices are being enforced.

## Prerequisites

- An existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli] or [using the Azure portal][aks-quickstart-portal].
- The Azure Policy Add-on for AKS installed on an AKS cluster. Follow these [steps to install the Azure Policy Add-on][azure-policy-addon].

## Assign a built-in policy definition or initiative

> [!TIP]
> All policies default to an audit effect. Effects can be updated to deny at any time through Azure Policy.

To apply the baseline initiative, we can assign through the Azure portal.

1. Navigate to the Policy service in Azure portal
1. In the left pane of the Azure Policy page, select **Definitions**
1. Search for "Baseline Profile" on the search pane to the right of the page
1. Select `Kubernetes Pod Security Standards Baseline Profile for Linux-based workloads` from the `Kubernetes` category
1. Set the **Scope** to the subscription level or only the resource group holding AKS clusters with the Azure Policy Add-on enabled
1. Select the **Parameters** page and update the **Effect** from `audit` to `deny` to block new deployments violating the baseline initiative
1. Add additional namespaces to exclude from evaluation during create, update, and audit. Some namespaces, such as _kube-system_, _gatekeeper-system_, and _aks-periscope_ are automatically excluded from policy evaluation.
    ![update effect](media/use-pod-security-on-azure-policy/update-effect.png)
1. Select **Review + create** to submit the policies

## Validate a Azure Policy is running

Confirm policies are applied to your cluster by running `kubectl get constrainttemplates`.

> [!NOTE]
> Policies can take [up to 20 minutes to sync](../governance/policy/concepts/policy-for-kubernetes.md#assign-a-built-in-policy-definition) into each cluster.

The output should be similar to:

```console
$ kubectl get constrainttemplate
NAME                                     AGE
k8sazureallowedcapabilities              30m
k8sazureblockhostnamespace               30m
k8sazurecontainernoprivilege             30m
k8sazurehostfilesystem                   30m
k8sazurehostnetworkingports              30m
```

### Validate rejection of a privileged pod

Let's first test what happens when you schedule a pod with the security context of `privileged: true`. This security context escalates the pod's privileges. The baseline initiative disallows privileged pods, so the request will be denied resulting in the deployment being rejected.

Create a file named `nginx-privileged.yaml` and paste the following YAML manifest:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-privileged
spec:
  containers:
    - name: nginx-privileged
      image: mcr.microsoft.com/oss/nginx/nginx:1.15.5-alpine
      securityContext:
        privileged: true
```

Create the pod with [kubectl apply][kubectl-apply] command and specify the name of your YAML manifest:

```console
kubectl apply -f nginx-privileged.yaml
```

As expected the pod fails to be scheduled, as shown in the following example output:

```console
$ kubectl apply -f privileged.yaml

Error from server ([denied by azurepolicy-container-no-privilege-00edd87bf80f443fa51d10910255adbc4013d590bec3d290b4f48725d4dfbdf9] Privileged container is not allowed: nginx-privileged, securityContext: {"privileged": true}): error when creating "privileged.yaml": admission webhook "validation.gatekeeper.sh" denied the request: [denied by azurepolicy-container-no-privilege-00edd87bf80f443fa51d10910255adbc4013d590bec3d290b4f48725d4dfbdf9] Privileged container is not allowed: nginx-privileged, securityContext: {"privileged": true}
```

The pod doesn't reach the scheduling stage, so there are no resources to delete before you move on.

### Test creation of an unprivileged pod

In the previous example, the container image automatically tried to use root to bind NGINX to port 80. This request was denied by the baseline policy initiative, so the pod fails to start. Let's try now running that same NGINX pod without privileged access.

Create a file named `nginx-unprivileged.yaml` and paste the following YAML manifest:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-unprivileged
spec:
  containers:
    - name: nginx-unprivileged
      image: mcr.microsoft.com/oss/nginx/nginx:1.15.5-alpine
```

Create the pod using the [kubectl apply][kubectl-apply] command and specify the name of your YAML manifest:

```console
kubectl apply -f nginx-unprivileged.yaml
```

The pod is successfully scheduled. When you check the status of the pod using the [kubectl get pods][kubectl-get] command, the pod is *Running*:

```console
$ kubectl get pods

NAME                 READY   STATUS    RESTARTS   AGE
nginx-unprivileged   1/1     Running   0          18s
```

This example shows the baseline initiative affecting only deployments which violate policies in the collection. Allowed deployments continue to function.

Delete the NGINX unprivileged pod using the [kubectl delete][kubectl-delete] command and specify the name of your YAML manifest:

```console
kubectl delete -f nginx-unprivileged.yaml
```

## Disable a policy or initiative

To remove the baseline initiative:

1. Navigate to the Policy pane on the Azure portal
1. Select **Assignments** from the left pane
1. Click the "..." button next to the Baseline Profile
1. Select "Delete assignment"

![Delete assignment](media/use-pod-security-on-azure-policy/delete-assignment.png)

## Next steps

For more information about how Azure Policy works:

- [Azure Policy Overview][azure-policies]
- [Azure Policy initiatives and polices for AKS][aks-policies]
- Remove the [Azure Policy Add-on][azure-policy-addon-remove].

<!-- LINKS - external -->
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-delete]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#delete
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-create]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#create
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe
[kubectl-logs]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#logs

<!-- LINKS - internal -->
[aks-policies]: policy-reference.md
[aks-quickstart-cli]: kubernetes-walkthrough.md
[aks-quickstart-portal]: kubernetes-walkthrough-portal.md
[azure-policy]: ../governance/policy/overview.md
[azure-policy-addon]: ../governance/policy/concepts/policy-for-kubernetes.md#install-azure-policy-add-on-for-aks
[azure-policy-addon-remove]: ../governance/policy/concepts/policy-for-kubernetes.md#remove-the-add-on-from-aks
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[kubernetes-policy-reference]: ../governance/policy/concepts/policy-for-kubernetes.md