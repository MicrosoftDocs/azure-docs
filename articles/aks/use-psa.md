---
title: Use Pod Security Admission in Azure Kubernetes Service (AKS)
description: Learn how to enable and use Pod Security Admission with Azure Kubernetes Service (AKS).
ms.topic: article
ms.date: 08/08/2022

---

# Use Pod Security Admission in Azure Kubernetes Service (AKS)

Pod Security Admission enforces Pod Security Standards policies on pods running in a namespace. Pod Security Admission is enabled by default in AKS and is controlled by adding labels to a namespace. For more information about Pod Security Admission, see [Enforce Pod Security Standards with Namespace Labels][kubernetes-psa]. For more information about the Pod Security Standards used by Pod Security Admission, see [Pod Security Standards][kubernetes-pss].

Pod Security Admission is a built-in policy solution for single cluster implementations. If you are looking for enterprise-grade policy, then [Azure policy](use-azure-policy.md) is a better choice.

## Before you begin

- An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
- [Azure CLI installed](/cli/azure/install-azure-cli).
- An existing AKS cluster running Kubernetes version 1.23 or higher.

## Enable Pod Security Admission for a namespace in your cluster

To enable PSA for a namespace in your cluster, set the `pod-security.kubernetes.io/enforce` label with the policy value you want to enforce. For example:

```azurecli-interactive
kubectl label --overwrite ns NAMESPACE pod-security.kubernetes.io/enforce=restricted
```

The above command enforces the `restricted` policy for the *NAMESPACE* namespace. 

You can also enable Pod Security Admission for all your namespaces. For example: 

```azurecli-interactive
kubectl label --overwrite ns --all pod-security.kubernetes.io/warn=baseline
```

The above example will generate a user-facing warning if any pods are deployed to any namespace that does not meet the `baseline` policy.

## Example of enforcing a Pod Security Admission policy with a deployment

Create two namespaces, one with the `restricted` policy and one with the `baseline` policy.

```azurecli-interactive
kubectl create namespace test-restricted
kubectl create namespace test-privileged
kubectl label --overwrite ns test-restricted pod-security.kubernetes.io/enforce=restricted pod-security.kubernetes.io/warn=restricted
kubectl label --overwrite ns test-privileged pod-security.kubernetes.io/enforce=privileged pod-security.kubernetes.io/warn=privileged
```

Both the `test-restricted` and `test-privileged` namespaces will block running pods as well as generate a user-facing warning if any pods attempt to run that do not meet the configured policy.

Attempt to deploy pods to the `test-restricted` namespace.

```azurecli-interactive
kubectl apply --namespace test-restricted -f https://raw.githubusercontent.com/Azure-Samples/azure-voting-app-redis/master/azure-vote-all-in-one-redis.yaml
```

Notice you get a warning that the pods violate the configured policy.

```output
...
Warning: would violate PodSecurity "restricted:latest": allowPrivilegeEscalation != false (container "azure-vote-back" must set securityContext.allowPrivilegeEscalation=false), unrestricted capabilities (container "azure-vote-back" must set securityContext.capabilities.drop=["ALL"]), runAsNonRoot != true (pod or container "azure-vote-back" must set securityContext.runAsNonRoot=true), seccompProfile (pod or container "azure-vote-back" must set securityContext.seccompProfile.type to "RuntimeDefault" or "Localhost")
deployment.apps/azure-vote-back created
service/azure-vote-back created
Warning: would violate PodSecurity "restricted:latest": allowPrivilegeEscalation != false (container "azure-vote-front" must set securityContext.allowPrivilegeEscalation=false), unrestricted capabilities (container "azure-vote-front" must set securityContext.capabilities.drop=["ALL"]), runAsNonRoot != true (pod or container "azure-vote-front" must set securityContext.runAsNonRoot=true), seccompProfile (pod or container "azure-vote-front" must set securityContext.seccompProfile.type to "RuntimeDefault" or "Localhost")
deployment.apps/azure-vote-front created
service/azure-vote-front created
```

Confirm there are no pods running in the `test-restricted` namespace.

```azurecli-interactive
kubectl get pods --namespace test-restricted
```

```output
$ kubectl get pods --namespace test-restricted
No resources found in test-restricted namespace.
```

Attempt to deploy pods to the `test-privileged` namespace.

```azurecli-interactive
kubectl apply --namespace test-privileged -f https://raw.githubusercontent.com/Azure-Samples/azure-voting-app-redis/master/azure-vote-all-in-one-redis.yaml
```

Notice there are no warnings about pods not meeting the configured policy.

Confirm you have pods running in the `test-privileged` namespace.

```azurecli-interactive
kubectl get pods --namespace test-privileged
```

```output
$ kubectl get pods --namespace test-privileged
NAME                               READY   STATUS    RESTARTS   AGE
azure-vote-back-6fcdc5cbd5-svbdf   1/1     Running   0          2m29s
azure-vote-front-5f4b8d498-tqzwv   1/1     Running   0          2m28s
```

Delete both the `test-restricted` and `test-privileged` namespaces.

```azurecli-interactive
kubectl delete namespace test-restricted test-privileged
```

## Next steps

In this article, you learned how to enable Pod Security Admission an AKS cluster. For more information about Pod Security Admission, see [Enforce Pod Security Standards with Namespace Labels][kubernetes-psa]. For more information about the Pod Security Standards used by Pod Security Admission, see [Pod Security Standards][kubernetes-pss].

<!-- LINKS - Internal -->
[kubernetes-psa]: https://kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/
[kubernetes-pss]: https://kubernetes.io/docs/concepts/security/pod-security-standards/
