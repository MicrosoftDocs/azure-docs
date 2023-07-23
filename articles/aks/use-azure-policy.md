---
title: Use Azure Policy to secure your Azure Kubernetes Service (AKS) clusters
description: Learn how to use Azure Policy to secure your Azure Kubernetes Service (AKS) clusters.
ms.topic: how-to
ms.date: 06/20/2023
ms.custom: template-how-to
---

# Secure your Azure Kubernetes Service (AKS) clusters with Azure Policy

You can apply and enforce built-in security policies on your Azure Kubernetes Service (AKS) clusters using [Azure Policy][azure-policy]. Azure Policy helps enforce organizational standards and assess compliance at-scale. After you install the [Azure Policy add-on for AKS][kubernetes-policy-reference], you can apply individual policy definitions or groups of policy definitions called initiatives (sometimes called policysets) to your cluster. See [Azure Policy built-in definitions for AKS][aks-policies] for a complete list of AKS policy and initiative definitions.

This article shows you how to apply policy definitions to your cluster and verify those assignments are being enforced.

## Prerequisites

- This article assumes you have an existing AKS cluster. If you need an AKS cluster, you can create one using [Azure CLI][aks-quickstart-cli], [Azure PowerShell][aks-quickstart-powershell], or [Azure portal][aks-quickstart-portal].
- You need the [Azure Policy add-on for AKS installed on your AKS cluster][azure-policy-addon].

## Assign a built-in policy definition or initiative

You can apply a policy definition or initiative in the Azure portal using the following steps:

1. Navigate to the Azure Policy service in Azure portal called **Policy**.
1. In the left pane of the Azure Policy page, select **Definitions**.
1. Under **Categories**, select `Kubernetes`.
1. Choose the policy definition or initiative you want to apply. For this example, select the **Kubernetes cluster pod security baseline standards for Linux-based workloads** initiative.
1. Select **Assign**.
1. Set the **Scope** to the resource group of the AKS cluster with the Azure Policy add-on enabled.
1. Select the **Parameters** page and update the **Effect** from `audit` to `deny` to block new deployments violating the baseline initiative. You can also add extra namespaces to exclude from evaluation. For this example, keep the default values.
1. Select **Review + create** > **Create** to submit the policy assignment.

## Create and assign a custom policy definition

Custom policies allow you to define rules for using Azure. For example, you can enforce the following types of rules:

- Security practices
- Cost management
- Organization-specific rules (like naming or locations)

Before creating a custom policy, check the [list of common patterns and samples][azure-policy-samples] to see if your case is already covered.

Custom policy definitions are written in JSON. To learn more about creating a custom policy, see [Azure Policy definition structure][azure-policy-definition-structure] and [Create a custom policy definition][custom-policy-tutorial-create].

> [!NOTE]
> Azure Policy now utilizes a new property known as *templateInfo* that allows you to define the source type for the constraint template. When you define *templateInfo* in policy definitions, you don’t have to define *constraintTemplate* or *constraint* properties. You still need to define *apiGroups* and *kinds*. For more information on this, see [Understanding Azure Policy effects][azure-policy-effects-audit].

Once you create your custom policy definition, see [Assign a policy definition][custom-policy-tutorial-assign] for a step-by-step walkthrough of assigning the policy to your Kubernetes cluster.

## Validate an Azure Policy is running

- Confirm the policy assignments are applied to your cluster using the following `kubectl get` command.

    ```azurecli-interactive
    kubectl get constrainttemplates
    ```

    > [!NOTE]
    > Policy assignments can take [up to 20 minutes to sync][azure-policy-assign-policy] into each cluster.

    Your output should be similar to the following example output:

    ```output
    NAME                                     AGE
    k8sazureallowedcapabilities              23m
    k8sazureallowedusersgroups               23m
    k8sazureblockhostnamespace               23m
    k8sazurecontainerallowedimages           23m
    k8sazurecontainerallowedports            23m
    k8sazurecontainerlimits                  23m
    k8sazurecontainernoprivilege             23m
    k8sazurecontainernoprivilegeescalation   23m
    k8sazureenforceapparmor                  23m
    k8sazurehostfilesystem                   23m
    k8sazurehostnetworkingports              23m
    k8sazurereadonlyrootfilesystem           23m
    k8sazureserviceallowedports              23m
    ```

### Validate rejection of a privileged pod

Let's first test what happens when you schedule a pod with the security context of `privileged: true`. This security context escalates the pod's privileges. The initiative disallows privileged pods, so the request is denied, which results in the deployment being rejected.

1. Create a file named `nginx-privileged.yaml` and paste in the following YAML manifest.

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

2. Create the pod using the [`kubectl apply`][kubectl-apply] command and specify the name of your YAML manifest.

    ```azurecli-interactive
    kubectl apply -f nginx-privileged.yaml
    ```

    As expected, the pod fails to be scheduled, as shown in the following example output:

    ```output
    Error from server ([denied by azurepolicy-container-no-privilege-00edd87bf80f443fa51d10910255adbc4013d590bec3d290b4f48725d4dfbdf9] Privileged container is not allowed: nginx-privileged, securityContext: {"privileged": true}): error when creating "privileged.yaml": admission webhook "validation.gatekeeper.sh" denied the request: [denied by azurepolicy-container-no-privilege-00edd87bf80f443fa51d10910255adbc4013d590bec3d290b4f48725d4dfbdf9] Privileged container is not allowed: nginx-privileged, securityContext: {"privileged": true}
    ```

    The pod doesn't reach the scheduling stage, so there are no resources to delete before you move on.

### Test creation of an unprivileged pod

In the previous example, the container image automatically tried to use root to bind NGINX to port 80. The policy initiative denies this request, so the pod fails to start. Now, let's try running that same NGINX pod without privileged access.

1. Create a file named `nginx-unprivileged.yaml` and paste in the following YAML manifest.

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

2. Create the pod using the [`kubectl apply`][kubectl-apply] command and specify the name of your YAML manifest.

    ```azurecli-interactive
    kubectl apply -f nginx-unprivileged.yaml
    ```

3. Check the status of the pod using the [`kubectl get pods`][kubectl-get] command.

    ```azurecli-interactive
    kubectl get pods
    ```

    Your output should be similar to the following example output, which shows the pod is successfully scheduled and has a status of *Running*:

    ```output
    NAME                 READY   STATUS    RESTARTS   AGE
    nginx-unprivileged   1/1     Running   0          18s
    ```

    This example shows the baseline initiative affecting only the deployments that violate policies in the collection. Allowed deployments continue to function.

4. Delete the NGINX unprivileged pod using the [`kubectl delete`][kubectl-delete] command and specify the name of your YAML manifest.

    ```azurecli-interactive
    kubectl delete -f nginx-unprivileged.yaml
    ```

## Disable a policy or initiative

You can remove the baseline initiative in the Azure portal using the following steps:

1. Navigate to the **Policy** pane on the Azure portal.
2. Select **Assignments**.
3. Select the **...** button next to the **Kubernetes cluster pod security baseline standards for Linux-based workload** initiative.
4. Select **Delete assignment**.

## Next steps

For more information about how Azure Policy works, see the following articles:

- [Azure Policy overview][azure-policy]
- [Azure Policy initiatives and policies for AKS][aks-policies]
- Remove the [Azure Policy add-on][azure-policy-addon-remove].

<!-- LINKS - external -->
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-delete]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#delete
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get

<!-- LINKS - internal -->
[aks-policies]: policy-reference.md
[aks-quickstart-cli]: ./learn/quick-kubernetes-deploy-cli.md
[aks-quickstart-portal]: ./learn/quick-kubernetes-deploy-portal.md
[aks-quickstart-powershell]: ./learn/quick-kubernetes-deploy-powershell.md
[azure-policy]: ../governance/policy/overview.md
[azure-policy-addon]: ../governance/policy/concepts/policy-for-kubernetes.md#install-azure-policy-add-on-for-aks
[azure-policy-addon-remove]: ../governance/policy/concepts/policy-for-kubernetes.md#remove-the-add-on-from-aks
[azure-policy-assign-policy]: ../governance/policy/concepts/policy-for-kubernetes.md#assign-a-policy-definition
[kubernetes-policy-reference]: ../governance/policy/concepts/policy-for-kubernetes.md
[azure-policy-effects-audit]: ../governance/policy/concepts/effects.md#audit-properties
[custom-policy-tutorial-create]: ../governance/policy/tutorials/create-custom-policy-definition.md
[custom-policy-tutorial-assign]: ../governance/policy/concepts/policy-for-kubernetes.md#assign-a-policy-definition
[azure-policy-samples]: ../governance/policy/samples/index.md
[azure-policy-definition-structure]: ../governance/policy/concepts/definition-structure.md
