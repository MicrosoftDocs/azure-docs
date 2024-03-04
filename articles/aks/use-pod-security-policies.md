---
title: Use pod security policies in Azure Kubernetes Service (AKS) (deprecated)
description: Learn how to control pod admissions using PodSecurityPolicy in Azure Kubernetes Service (AKS)
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 08/01/2023
ROBOTS: NOINDEX
---

# Secure your cluster using pod security policies in Azure Kubernetes Service (AKS) (preview)

> [!IMPORTANT]
>
> The pod security policy feature was deprecated on 1st August 2023 and removed from AKS versions *1.25* and higher. 
>
>  We recommend you migrate to [pod security admission controller](use-psa.md) or [Azure policy](use-azure-policy.md) to stay within Azure support. Pod Security Admission is a built-in policy solution for single cluster implementations. If you are looking for enterprise-grade policy, then Azure policy is a better choice.

## Before you begin

* This article assumes you have an existing AKS cluster. If you need an AKS cluster, create one using [Azure CLI][aks-quickstart-cli], [Azure PowerShell][aks-quickstart-powershell], or the [Azure portal][aks-quickstart-portal].
* You need the Azure CLI version 2.0.61 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [install Azure CLI][install-azure-cli].

## Install the `aks-preview` Azure CLI extension

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

1. Install the aks-preview extension using the [`az extension add`][az-extension-add] command.

    ```azurecli
    az extension add --name aks-preview
    ```

2. Update to the latest version of the extension using the [`az extension update`][az-extension-update] command.

    ```azurecli
    az extension update --name aks-preview
    ```

## Register the `PodSecurityPolicyPreview` feature flag

1. Register the `PodSecurityPolicyPreview` feature flag using the [`az feature register`][az-feature-register] command.

    ```azurecli-interactive
    az feature register --namespace "Microsoft.ContainerService" --name "PodSecurityPolicyPreview"
    ```

    It takes a few minutes for the status to show *Registered*.

2. Verify the registration status using the [`az feature show`][az-feature-show] command.

    ```azurecli-interactive
    az feature show --namespace "Microsoft.ContainerService" --name "PodSecurityPolicyPreview"
    ```

3. When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider using the [`az provider register`][az-provider-register] command.

    ```azurecli-interactive
    az provider register --namespace Microsoft.ContainerService
    ```

## Overview of pod security policies

Kubernetes clusters use admission controllers to intercept requests to the API server when a resource is going to be created. The admission controller can then *validate* the resource request against a set of rules, or *mutate* the resource to change deployment parameters.

`PodSecurityPolicy` is an admission controller that validates a pod specification meets your defined requirements. These requirements may limit the use of privileged containers, access to certain types of storage, or the user or group the container can run as. When you try to deploy a resource where the pod specifications don't meet the requirements outlined in the pod security policy, the request is denied. This ability to control what pods can be scheduled in the AKS cluster prevents some possible security vulnerabilities or privilege escalations.

When you enable pod security policy in an AKS cluster, some default policies are applied. These policies provide an out-of-the-box experience to define what pods can be scheduled. However, you might run into problems deploying your pods until you define your own policies. The recommended approach is to:

1. Create an AKS cluster.
2. Define your own pod security policies.
3. Enable the pod security policy feature.

### Behavior changes between pod security policy and Azure Policy

|Scenario| Pod security policy | Azure Policy |
|---|---|---|
|Installation|Enable pod security policy feature |Enable Azure Policy Add-on
|Deploy policies| Deploy pod security policy resource| Assign Azure policies to the subscription or resource group scope. The Azure Policy Add-on is required for Kubernetes resource applications.
| Default policies | When pod security policy is enabled in AKS, default Privileged and Unrestricted policies are applied. | No default policies are applied by enabling the Azure Policy Add-on. You must explicitly enable policies in Azure Policy.
| Who can create and assign policies | Cluster admin creates a pod security policy resource | Users must have a minimum role of 'owner' or 'Resource Policy Contributor' permissions on the AKS cluster resource group. - Through API, users can assign policies at the AKS cluster resource scope. The user should have minimum of 'owner' or 'Resource Policy Contributor' permissions on AKS cluster resource. - In the Azure portal, policies can be assigned at the Management group/subscription/resource group level.
| Authorizing policies| Users and Service Accounts require explicit permissions to use pod security policies. | No additional assignment is required to authorize policies. Once policies are assigned in Azure, all cluster users can use these policies.
| Policy applicability | The admin user bypasses the enforcement of pod security policies. | All users (admin & non-admin) see the same policies. There's no special casing based on users. Policy application can be excluded at the namespace level.
| Policy scope | Pod security policies aren't namespaced | Constraint templates used by Azure Policy aren't namespaced.
| Deny/Audit/Mutation action | Pod security policies support only deny actions. Mutation can be done with default values on create requests. Validation can be done during update requests.| Azure Policy supports both audit & deny actions. Mutation isn't yet supported.
| Pod security policy compliance | There's no visibility into compliance of pods that existed before enabling pod security policy. Non-compliant pods created after enabling pod security policies are denied. | Non-compliant pods that existed before applying Azure policies would show up in policy violations. Non-compliant pods created after enabling Azure policies are denied if policies are set with a deny effect.
| How to view policies on the cluster | `kubectl get psp` | `kubectl get constrainttemplate` - All policies are returned.
| Pod security policy standard - Privileged | A privileged pod security policy resource is created by default when enabling the feature. | Privileged mode implies no restriction, as a result it's equivalent to not having any Azure Policy assignment.
| [Pod security policy standard - Baseline/default](https://kubernetes.io/docs/concepts/security/pod-security-standards/#baseline-default) | User installs a pod security policy baseline resource. | Azure Policy provides a [built-in baseline initiative](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicySetDefinitions%2Fa8640138-9b0a-4a28-b8cb-1666c838647d) which maps to the baseline pod security policy.
| [Pod security policy standard - Restricted](https://kubernetes.io/docs/concepts/security/pod-security-standards/#restricted) | User installs a pod security policy restricted resource. | Azure Policy provides a [built-in restricted initiative](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicySetDefinitions%2F42b8ef37-b724-4e24-bbc8-7a7708edfe00) which maps to the restricted pod security policy.

## Enable pod security policy on an AKS cluster

> [!NOTE]
> For real-world use, don't enable the pod security policy until you define your own custom policies. In this article, we enable pod security policy as the first step to see how the default policies limit pod deployments.

* Enable the pod security policy using the [`az aks update`][az-aks-update] command.

    ```azurecli-interactive
    az aks update \
        --resource-group myResourceGroup \
        --name myAKSCluster \
        --enable-pod-security-policy
    ```

## Default AKS policies

When you enable pod security policy, AKS creates one default policy named *privileged*. Don't edit or remove the default policy. Instead, create your own policies that define the settings you want to control. Let's first look at what these default policies are how they impact pod deployments.

1. View the available policies using the [`kubectl get psp`][kubectl-get] command.

    ```console
    kubectl get psp
    ```

    Your output will look similar to the following example output:

    ```output
    NAME         PRIV    CAPS   SELINUX    RUNASUSER          FSGROUP     SUPGROUP    READONLYROOTFS   VOLUMES
    privileged   true    *      RunAsAny   RunAsAny           RunAsAny    RunAsAny    false            *     configMap,emptyDir,projected,secret,downwardAPI,persistentVolumeClaim
    ```

    The *privileged* pod security policy is applied to any authenticated user in the AKS cluster. This assignment is controlled by `ClusterRoles` and `ClusterRoleBindings`.

2. Search for the *default:privileged:* binding in the *kube-system* namespace using the [`kubectl get rolebindings`][kubectl-get] command.

    ```console
    kubectl get rolebindings default:privileged -n kube-system -o yaml
    ```

    The following condensed example output shows the *psp:privileged* `ClusterRole` is assigned to any *system:authenticated* users. This ability provides a basic level of privilege without your own policies being defined.

    ```output
    apiVersion: rbac.authorization.k8s.io/v1
    kind: RoleBinding
    metadata:
      [...]
      name: default:privileged
      [...]
    roleRef:
      apiGroup: rbac.authorization.k8s.io
      kind: ClusterRole
      name: psp:privileged
    subjects:
   - apiGroup: rbac.authorization.k8s.io
      kind: Group
      name: system:masters
    ```

It's important to understand how these default policies interact with user requests to schedule pods before you start to create your own pod security policies. In the next few sections, we schedule some pods to see the default policies in action.

## Create a test user in an AKS cluster

When you use the [`az aks get-credentials`][az-aks-get-credentials] command, the *admin* credentials for the AKS cluster are added to your `kubectl` config by default. The admin user bypasses the enforcement of pod security policies. If you use Azure Active Directory integration for your AKS clusters, you can sign in with the credentials of a non-admin user to see the enforcement of policies in action.

1. Create a sample namespace named *psp-aks* for test resources using the [`kubectl create namespace`][kubectl-create] command.

    ```console
    kubectl create namespace psp-aks
    ```

2. Create a service account named *nonadmin-user* using the [`kubectl create serviceaccount`][kubectl-create] command.

    ```console
    kubectl create serviceaccount --namespace psp-aks nonadmin-user
    ```

3. Create a RoleBinding for the *nonadmin-user* to perform basic actions in the namespace using the [`kubectl create rolebinding`][kubectl-create] command.

    ```console
    kubectl create rolebinding \
        --namespace psp-aks \
        psp-aks-editor \
        --clusterrole=edit \
        --serviceaccount=psp-aks:nonadmin-user
    ```

### Create alias commands for admin and non-admin user

When using `kubectl`, you can highlight the differences between the regular admin user and the non-admin user by creating two command-line aliases:

1. The **kubectl-admin** alias for the regular admin user, which is scoped to the *psp-aks* namespace.
2. The **kubectl-nonadminuser** alias for the *nonadmin-user* created in the previous step, which is scoped to the *psp-aks* namespace.

* Create the two aliases using the following commands.

    ```console
    alias kubectl-admin='kubectl --namespace psp-aks'
    alias kubectl-nonadminuser='kubectl --as=system:serviceaccount:psp-aks:nonadmin-user --namespace psp-aks'
    ```

## Test the creation of a privileged pod

Let's test what happens when you schedule a pod with the security context of `privileged: true`. This security context escalates the pod's privileges. The default *privilege* AKS security policy should deny this request.

1. Create a file named `nginx-privileged.yaml` and paste in the contents of following YAML manifest.

    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: nginx-privileged
    spec:
      containers:
        - name: nginx-privileged
          image: mcr.microsoft.com/oss/nginx/nginx:1.14.2-alpine
          securityContext:
            privileged: true
    ```

2. Create the pod using the [`kubectl apply`][kubectl-apply] command and specify the name of your YAML manifest.

    ```console
    kubectl-nonadminuser apply -f nginx-privileged.yaml
    ```

    The following example output shows the pod failed to be scheduled:

    ```output
    Error from server (Forbidden): error when creating "nginx-privileged.yaml": pods "nginx-privileged" is forbidden: unable to validate against any pod security policy: []
    ```

    Since the pod doesn't reach the scheduling stage, there are no resources to delete before you move on.

## Test creation of an unprivileged pod

In the previous example, the pod specification requested privileged escalation. This request is denied by the default *privilege* pod security policy, so the pod fails to be scheduled. Let's try running the same NGINX pod without the privilege escalation request.

1. Create a file named `nginx-unprivileged.yaml` and paste in the contents of the following YAML manifest.

    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: nginx-unprivileged
    spec:
      containers:
        - name: nginx-unprivileged
          image: mcr.microsoft.com/oss/nginx/nginx:1.14.2-alpine
    ```

2. Create the pod using the [`kubectl apply`][kubectl-apply] command and specify the name of your YAML manifest.

    ```console
    kubectl-nonadminuser apply -f nginx-unprivileged.yaml
    ```

    The following example output shows the pod failed to be scheduled:

    ```output
    Error from server (Forbidden): error when creating "nginx-unprivileged.yaml": pods "nginx-unprivileged" is forbidden: unable to validate against any pod security policy: []
    ```

    Since the pod doesn't reach the scheduling stage, there are no resources to delete before you move on.

## Test creation of a pod with a specific user context

In the previous example, the container image automatically tried to use root to bind NGINX to port 80. This request was denied by the default *privilege* pod security policy, so the pod fails to start. Let's try running the same NGINX pod with a specific user context, such as `runAsUser: 2000`.

1. Create a file named `nginx-unprivileged-nonroot.yaml` and paste in the following YAML manifest.

    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: nginx-unprivileged-nonroot
    spec:
      containers:
        - name: nginx-unprivileged
          image: mcr.microsoft.com/oss/nginx/nginx:1.14.2-alpine
          securityContext:
            runAsUser: 2000
    ```

2. Create the pod using the [`kubectl apply`][kubectl-apply] command and specify the name of your YAML manifest.

    ```console
    kubectl-nonadminuser apply -f nginx-unprivileged-nonroot.yaml
    ```

    The following example output shows the pod failed to be scheduled:

    ```output
    Error from server (Forbidden): error when creating "nginx-unprivileged-nonroot.yaml": pods "nginx-unprivileged-nonroot" is forbidden: unable to validate against any pod security policy: []
    ```

    Since the pod doesn't reach the scheduling stage, there are no resources to delete before you move on.

## Create a custom pod security policy

Now that you've seen the behavior of the default pod security policies, let's provide a way for the *nonadmin-user* to successfully schedule pods.

We'll create a policy to reject pods that request privileged access. Other options, such as *runAsUser* or allowed *volumes*, aren't explicitly restricted. This type of policy denies a request for privileged access, but allows the cluster to run the requested pods.

1. Create a file named `psp-deny-privileged.yaml` and paste in the following YAML manifest.

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

2. Create the policy using the [`kubectl apply`][kubectl-apply] command and specify the name of your YAML manifest.

    ```console
    kubectl apply -f psp-deny-privileged.yaml
    ```

3. View the available policies using the [`kubectl get psp`][kubectl-get] command.

    ```console
    kubectl get psp
    ```

    In the following example output, compare the *psp-deny-privileged* policy with the default *privilege* policy that was enforced in the previous examples to create a pod. Only the use of *PRIV* escalation is denied by your policy. There are no restrictions on the user or group for the *psp-deny-privileged* policy.

    ```output
    NAME                  PRIV    CAPS   SELINUX    RUNASUSER          FSGROUP     SUPGROUP    READONLYROOTFS   VOLUMES
    privileged            true    *      RunAsAny   RunAsAny           RunAsAny    RunAsAny    false            *
    psp-deny-privileged   false          RunAsAny   RunAsAny           RunAsAny    RunAsAny    false            *          
    ```

## Allow user account to use the custom pod security policy

In the previous step, you created a pod security policy to reject pods that request privileged access. To allow the policy to be used, you create a *Role* or a *ClusterRole*. Then, you associate one of these roles using a *RoleBinding* or *ClusterRoleBinding*. For this example, we'll create a ClusterRole that allows you to *use* the *psp-deny-privileged* policy created in the previous step.

1. Create a file named `psp-deny-privileged-clusterrole.yaml` and paste in the following YAML manifest.

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

2. Create the ClusterRole using the [`kubectl apply`][kubectl-apply] command and specify the name of your YAML manifest.

    ```console
    kubectl apply -f psp-deny-privileged-clusterrole.yaml
    ```

3. Create a file named `psp-deny-privileged-clusterrolebinding.yaml` and paste in the following YAML manifest.

    ```yaml
    apiVersion: rbac.authorization.k8s.io/v1
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

4. Create the ClusterRoleBinding using the [`kubectl apply`][kubectl-apply] command and specify the name of your YAML manifest.

    ```console
    kubectl apply -f psp-deny-privileged-clusterrolebinding.yaml
    ```

> [!NOTE]
> In the first step of this article, the pod security policy feature was enabled on the AKS cluster. The recommended practice was to only enable the pod security policy feature after you've defined your own policies. This is the stage where you would enable the pod security policy feature. One or more custom policies have been defined, and user accounts have been associated with those policies. You can now safely enable the pod security policy feature and minimize problems caused by the default policies.

## Test the creation of an unprivileged pod again

With your custom pod security policy applied and a binding for the user account to use the policy, let's try to create an unprivileged pod again.

This example shows how you can create custom pod security policies to define access to the AKS cluster for different users or groups. The default AKS policies provide tight controls on what pods can run, so create your own custom policies to then correctly define the restrictions you need.

1. Use the `nginx-privileged.yaml` manifest to create the pod using the [`kubectl apply`][kubectl-apply] command.

    ```console
    kubectl-nonadminuser apply -f nginx-unprivileged.yaml
    ```

2. Check the status of the pod using the [`kubectl get pods`][kubectl-get] command.

    ```output
    kubectl-nonadminuser get pods
    ```

    The following example output shows the pod was successfully scheduled and is *Running*:

    ```output
    NAME                 READY   STATUS    RESTARTS   AGE
    nginx-unprivileged   1/1     Running   0          7m14s
    ```

3. Delete the NGINX unprivileged pod using the [`kubectl delete`][kubectl-delete] command and specify the name of your YAML manifest.

    ```console
    kubectl-nonadminuser delete -f nginx-unprivileged.yaml
    ```

## Clean up resources

1. Disable pod security policy using the [`az aks update`][az-aks-update] command.

    ```azurecli-interactive
    az aks update \
        --resource-group myResourceGroup \
        --name myAKSCluster \
        --disable-pod-security-policy
    ```

2. Delete the ClusterRole and ClusterRoleBinding using the [`kubectl delete`][kubectl-delete] command.

    ```console
    kubectl delete -f psp-deny-privileged-clusterrole.yaml
    ```

3. Delete the ClusterRoleBinding using the [`kubectl delete`][kubectl-delete] command.

    ```console
    kubectl delete -f psp-deny-privileged-clusterrolebinding.yaml
    ```

4. Delete the security policy using [`kubectl delete`][kubectl-delete] command and specify the name of your YAML manifest.

    ```console
    kubectl delete -f psp-deny-privileged.yaml
    ```

5. Delete the *psp-aks* namespace using the [`kubectl delete`][kubectl-delete] command.

    ```console
    kubectl delete namespace psp-aks
    ```

## Next steps

This article showed you how to create a pod security policy to prevent the use of privileged access. Policies can enforce a lot of features, such as type of volume or the RunAs user. For more information on the available options, see the [Kubernetes pod security policy reference docs][kubernetes-policy-reference].

For more information about limiting pod network traffic, see [Secure traffic between pods using network policies in AKS][network-policies].

<!-- LINKS - external -->
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-delete]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#delete
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-create]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#create
[kubernetes-policy-reference]: https://kubernetes.io/docs/concepts/policy/pod-security-policy/#policy-reference
<!-- LINKS - internal -->
[aks-quickstart-cli]: ./learn/quick-kubernetes-deploy-cli.md
[aks-quickstart-portal]: ./learn/quick-kubernetes-deploy-portal.md
[aks-quickstart-powershell]: ./learn/quick-kubernetes-deploy-powershell.md
[install-azure-cli]: /cli/azure/install-azure-cli
[network-policies]: use-network-policies.md
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-show]: /cli/azure/feature#az-feature-show
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[az-aks-update]: /cli/azure/aks#az_aks_update
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
