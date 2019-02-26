---
title: Use pod security policies in Azure Kubernetes Service (AKS)
description: Learn how to control pod admissions by using PodSecurityPolicy in Azure Kubernetes Service (AKS)
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: article
ms.date: 02/25/2019
ms.author: iainfou
---

# Secure your cluster using pod security policies in Azure Kubernetes Service (AKS)

To improve the security of your AKS cluster, you can limit what pods can be scheduled. Pods that request resources you don't allow can't run in the AKS cluster. You define this access using pod security policies. This article shows you how to use pod security policies to limit the deployment of pods in AKS.

> [!IMPORTANT]
> This feature is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

## Before you begin

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli] or [using the Azure portal][aks-quickstart-portal].

You need the Azure CLI version 2.0.58 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

To create or update an AKS cluster to use pod security policies, first enable a feature flag on your subscription. To register the *PodSecurityPolicyPreview* feature flag, use the [az feature register][az-feature-register] command as shown in the following example:

```azurecli-interactive
az feature register --name PodSecurityPolicyPreview --namespace Microsoft.ContainerService
```

It takes a few minutes for the status to show *Registered*. You can check on the registration status using the [az feature list][az-feature-list] command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/PodSecurityPolicyPreview')].{Name:name,State:properties.state}"
```

When ready, refresh the registration of the *Microsoft.ContainerService* resource provider using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Overview of pod security policies

In a Kubernetes cluster, an admission controller is used to intercept requests to the API server when a resource is to be created. The admission controller can then *validate* the resource request against a set of rules, or *mutate* the resource to change deployment parameters.

*PodSecurityPolicy* is an admission controller that validates a pod specification meets your defined requirements. These requirements may limit the use of privileged containers, access to certain types of storage, or the user or group the container can run as. When you try to deploy a resource where the pod specifications don't meet the requirements outlined in the pod security policy, the request is denied. This ability to control what pods can be scheduled in the AKS cluster prevents some possible security vulnerabilities or privilege escalations.

## Test the creation of a privileged pod

Before you enable PodSecurityPolicy, let's first test what happens when you schedule a pod with the security context of `privileged: true`. In the next step, a policy is created to block this type of request in a pod specification. Create a file named `nginx-privileged.yaml` and paste the following YAML manifest:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-privileged
spec:
  containers:
    - name: nginx-privileged
      image: nginx:1.14.2
      securityContext:
        privileged: true
```

Create the pod using the [kubectl apply][kubectl-apply] command and specify the name of your YAML manifest:

```console
kubectl apply -f nginx-privileged.yaml
```

The pod is successfully scheduled, as shown in the following example output:

```console
$ kubectl apply -f nginx-privileged.yaml

pod/nginx-privileged created

$ kubectl get pods

NAME               READY   STATUS    RESTARTS   AGE
nginx-privileged   1/1     Running   0          4m51s
```

Before you move on, delete this pod using [kubectl delete][kubectl-delete] command and specify the name of your YAML manifest:

```console
kubectl delete -f nginx-privileged.yaml
```

## Create a pod security policy

Before you can enable pod security policy in an AKS cluster, you first define what these policies are. Without policies in place, no pods can be created in your cluster.

Let's create a policy to reject pods that request privileged access like the one scheduled in the previous step. Create a file named `psp-deny-privileged.yaml` and paste the following YAML manifest:

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: psp-deny-privileged
spec:
  privileged: false
  seLinux:
    rule: RunAsAny
  supplementalGroups:
    rule: RunAsAny
  runAsUser:
    rule: RunAsAny
  fsGroup:
    rule: RunAsAny
  volumes:
  - '*'
```

Create the policy using the [kubectl apply][kubectl-apply] command and specify the name of your YAML manifest:

```console
kubectl apply -f psp-deny-privileged.yaml
```

## Allow user account to use the pod security policy

In the previous step, you created a pod security policy to reject pods that request privileged access. To allow the policy to be used, you first create a *Role* or a *ClusterRole*. Then, you associate one of these roles using a *RoleBinding* or *ClusterRoleBinding*. These roles and bindings are typically created at a group level, and give you the ability to target pod security policies at a specific namespace or across the whole cluster.

For this article, create a ClusterRole that allows you to *use* the *psp-deny-privileged* policy created in the previous step. Create a file named `psp-deny-privileged-clusterrole.yaml` and paste the following YAML manifest:

```yaml
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: psp-deny-privileged-clusterrole
rules:
- apiGroups:
  - extensions
  resources:
  - podsecuritypolicies
  resourceNames:
  - psp-deny-privileged
  verbs:
  - use
```

Create the ClusterRole using the [kubectl apply][kubectl-apply] command and specify the name of your YAML manifest:

```console
kubectl apply -f psp-deny-privileged-clusterrole.yaml
```

Now create a ClusterRoleBinding to use the ClusterRole created in the previous step. Create a file named `psp-deny-privileged-clusterrolebinding.yaml` and paste the following YAML manifest:

```yaml
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: psp-deny-privileged-clusterrolebinding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: psp-deny-privileged-clusterrole
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: Group
  name: system:serviceaccounts
```

Create a ClusterRoleBinding using the [kubectl apply][kubectl-apply] command and specify the name of your YAML manifest:

```console
kubectl apply -f psp-deny-privileged-clusterrolebinding.yaml
```

## Enable pod security policy on the AKS cluster

With a pod security policy applied to your AKS cluster, now enable pod security policy using the [az aks update-cluster][az-aks-update-cluster] command. The following example enables pod security policy on the cluster name *myAKSCluster* in the resource group named *myResourceGroup*:

```azurecli-interactive
az aks update-cluster \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --enable-pod-security-policy
```

## Test the creation of privileged pod again

With a pod security policy applied and a binding for the service account to use the policy, let's try to create a privileged pod again. Use the same `nginx-privileged.yaml` manifest to create the pod using the [kubectl apply][kubectl-apply] command:

```console
kubectl apply -f nginx-privileged.yaml
```

The pod fails to be scheduled when the pod security policy admission controller validates the requests in the pod specification. As the pod specification requested privileged escalation, the *psp-deny-privileged* policy denies the request before the API server creates the resource. The following example shows that the pod can't be scheduled:

```console
$ kubectl apply -f nginx-privileged.yaml

Error from server (Forbidden): error when creating "nginx-privileged.yaml": pods "nginx-privileged" is forbidden: unable to validate against any pod security policy: [spec.containers[0].securityContext.privileged: Invalid value: true: Privileged containers are not allowed]
```

### Test the creation of an unprivileged pod

If you try to create a regular deployment with pods that don't request the privilege escalation, the deployment is successful. The pod security policy admission controller validates that the pod specification complies with your policy definitions. To verify this behavior, create a file named `nginx-unprivileged.yaml` and paste the following YAML manifest:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-unprivileged
spec:
  containers:
    - name: nginx-unprivileged
      image: nginx:1.14.2
```

Create the pod using the [kubectl apply][kubectl-apply] command and specify the name of your YAML manifest:

```console
kubectl apply -f nginx-unprivileged.yaml
```

The pod is successfully scheduled.

## Clean up resources

Delete the NGINX unprivileged pod created in the previous step using [kubectl delete][kubectl-delete] command and specify the name of your YAML manifest:

```console
kubectl delete -f nginx-unprivileged.yaml
```

To disable pod security policy, use the [az aks update-cluster][az-aks-update-cluster] command again. The following example disables pod security policy on the cluster name *myAKSCluster* in the resource group named *myResourceGroup*:

```azurecli-interactive
az aks update-cluster \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --disable-pod-security-policy
```

Delete the ClusterRole and ClusterRoleBinding:

```console
kubectl delete -f psp-deny-privileged-clusterrolebinding.yaml
kubectl delete -f psp-deny-privileged-clusterrole.yaml
```

Finally, delete the network policy using [kubectl delete][kubectl-delete] command and specify the name of your YAML manifest:

```console
kubectl delete -f psp-deny-privileged.yaml
```

## Next steps

This article showed you how to create a pod security policy to prevent the use of privileged access. There are lots of features that a policy can enforce, such as type of volume or the RunAs user. For more information on the available options, see the [policy reference][kubernetes-policy-reference].

For more information about network resources, see [Network concepts for applications in Azure Kubernetes Service (AKS)][concepts-network].

<!-- LINKS - external -->
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-delete]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#delete
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/
[kubernetes-policy-reference]: https://kubernetes.io/docs/concepts/policy/pod-security-policy/#policy-reference

<!-- LINKS - internal -->
[aks-quickstart-cli]: kubernetes-walkthrough.md
[aks-quickstart-portal]: kubernetes-walkthrough-portal.md
[install-azure-cli]: /cli/azure/install-azure-cli
[concepts-network]: concepts-network.md
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-list]: /cli/azure/feature#az-feature-list
[az-provider-register]: /cli/azure/provider#az-provider-register
