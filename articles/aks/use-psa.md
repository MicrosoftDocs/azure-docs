---
title: Use Pod Security Admission in Azure Kubernetes Service (AKS)
description: Learn how to enable and use Pod Security Admission with Azure Kubernetes Service (AKS).
ms.custom: azure-kubernetes-service
ms.topic: article
ms.date: 09/12/2023
---

# Use Pod Security Admission in Azure Kubernetes Service (AKS)

Pod Security Admission (PSA) uses labels to enforce Pod Security Standards policies on pods running in a namespace. AKS enables Pod Security Admission is enabled by default. For more information about Pod Security Admission and Pod Security Standards, see [Enforce Pod Security Standards with namespace labels][kubernetes-psa] and [Pod Security Standards][kubernetes-pss].

Pod Security Admission is a built-in policy solution for single cluster implementations. If you want to use an enterprise-grade policy, we recommend you use [Azure policy](use-azure-policy.md).

## Before you begin

- An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
- [Azure CLI installed](/cli/azure/install-azure-cli).
- An existing AKS cluster running Kubernetes version 1.23 or higher.

## Enable Pod Security Admission for a namespace in your cluster

### Enable PSA for a single namespace

- Enable PSA for a single namespace in your cluster using the `kubectl label` command and set the `pod-security.kubernetes.io/enforce` label with the policy value you want to enforce. The following example enables the `restricted` policy for the *NAMESPACE* namespace.

    ```azurecli-interactive
    kubectl label --overwrite ns NAMESPACE pod-security.kubernetes.io/enforce=restricted
    ```

### Enable PSA for all namespaces

- Enable PSA for all namespaces in your cluster using the `kubectl label` command and set the `pod-security.kubernetes.io/warn` label with the policy value you want to enforce. The following example enables the `baseline` policy for all namespaces in your cluster. This policy generates a user-facing warning if any pods are deployed to a namespace that doesn't meet the *baseline* policy.

    ```azurecli-interactive
    kubectl label --overwrite ns --all pod-security.kubernetes.io/warn=baseline
    ```

## Enforce a Pod Security Admission policy with a deployment

1. Create two namespaces using the `kubectl create namespace` command.

    ```azurecli-interactive
    kubectl create namespace test-restricted
    kubectl create namespace test-privileged
    ```

1. Enable a PSA policy for each namespace, one with the `restricted` policy and one with the `baseline` policy, using the `kubectl label` command.

    ```azurecli-interactive
    kubectl label --overwrite ns test-restricted pod-security.kubernetes.io/enforce=restricted pod-security.kubernetes.io/warn=restricted
    kubectl label --overwrite ns test-privileged pod-security.kubernetes.io/enforce=privileged pod-security.kubernetes.io/warn=privileged
    ```

    This configures the `test-restricted` and `test-privileged` namespaces to block running pods and generate a user-facing warning if any pods that don't meet the configured policy attempt to run.

1. Attempt to deploy pods to the `test-restricted` namespace using the `kubectl apply` command. This command results in an error because the `test-restricted` namespace is configured to block pods that don't meet the `restricted` policy.

    ```azurecli-interactive
    kubectl apply --namespace test-restricted -f https://raw.githubusercontent.com/Azure-Samples/azure-voting-app-redis/master/azure-vote-all-in-one-redis.yaml
    ```

    The following example output shows a warning stating the pods violate the configured policy:

    ```output
    ...
    Warning: would violate PodSecurity "restricted:latest": allowPrivilegeEscalation != false (container "azure-vote-back" must set securityContext.allowPrivilegeEscalation=false), unrestricted capabilities (container "azure-vote-back" must set securityContext.capabilities.drop=["ALL"]), runAsNonRoot != true (pod or container "azure-vote-back" must set securityContext.runAsNonRoot=true), seccompProfile (pod or container "azure-vote-back" must set securityContext.seccompProfile.type to "RuntimeDefault" or "Localhost")
    deployment.apps/azure-vote-back created
    service/azure-vote-back created
    Warning: would violate PodSecurity "restricted:latest": allowPrivilegeEscalation != false (container "azure-vote-front" must set securityContext.allowPrivilegeEscalation=false), unrestricted capabilities (container "azure-vote-front" must set securityContext.capabilities.drop=["ALL"]), runAsNonRoot != true (pod or container "azure-vote-front" must set securityContext.runAsNonRoot=true), seccompProfile (pod or container "azure-vote-front" must set securityContext.seccompProfile.type to "RuntimeDefault" or "Localhost")
    deployment.apps/azure-vote-front created
    service/azure-vote-front created
    ```

1. Confirm there are no pods running in the `test-restricted` namespace using the `kubectl get pods` command.

    ```azurecli-interactive
    kubectl get pods --namespace test-restricted
    ```

    The following example output shows no pods running in the `test-restricted` namespace:

    ```output
    No resources found in test-restricted namespace.
    ```

1. Attempt to deploy pods to the `test-privileged` namespace using the `kubectl apply` command. This time, the pods should deploy successfully because the `test-privileged` namespace is configured to allow pods that violate the `privileged` policy.

    ```azurecli-interactive
    kubectl apply --namespace test-privileged -f https://raw.githubusercontent.com/Azure-Samples/azure-voting-app-redis/master/azure-vote-all-in-one-redis.yaml
    ```

    The following example output shows the pods deployed successfully:

    ```output
    deployment.apps/azure-vote-back created
    service/azure-vote-back created
    deployment.apps/azure-vote-front created
    service/azure-vote-front created
    ```

1. Confirm you have pods running in the `test-privileged` namespace using the `kubectl get pods` command.

    ```azurecli-interactive
    kubectl get pods --namespace test-privileged
    ```

    The following example output shows two pods running in the `test-privileged` namespace:

    ```output
    NAME                               READY   STATUS    RESTARTS   AGE
    azure-vote-back-6fcdc5cbd5-svbdf   1/1     Running   0          2m29s
    azure-vote-front-5f4b8d498-tqzwv   1/1     Running   0          2m28s
    ```

1. Remove the `test-restricted` and `test-privileged` namespaces using the `kubectl delete` command.

    ```azurecli-interactive
    kubectl delete namespace test-restricted test-privileged
    ```

## Next steps

In this article, you learned how to enable Pod Security Admission an AKS cluster. For more information about Pod Security Admission, see [Enforce Pod Security Standards with Namespace Labels][kubernetes-psa]. For more information about the Pod Security Standards used by Pod Security Admission, see [Pod Security Standards][kubernetes-pss].

<!-- LINKS - Internal -->
[kubernetes-psa]: https://kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/
[kubernetes-pss]: https://kubernetes.io/docs/concepts/security/pod-security-standards/
