---
title: Secure pods with Azure Policy in Azure Kubernetes Service (AKS)
description: Learn how to secure pods with Azure Policy on Azure Kubernetes Service (AKS)
services: container-service
ms.topic: article
ms.date: 07/06/2020
---

# Preview - Secure pods using Azure Policy in Azure Kubernetes Service (AKS)

To improve the security of your AKS cluster, you can limit what pods can be scheduled and audit for anything running against policy. You define this access using specific policies enabled by the [Azure Policy Add-on](../governance/policy/concepts/policy-for-kubernetes.md). This article shows you how to use Azure Policy to limit the deployment of pods in AKS.

> [!IMPORTANT]
> AKS preview features are self-service opt-in. Previews are provided "as-is" and "as available" and are excluded from the service level agreements and limited warranty. AKS Previews are partially covered by customer support on best effort basis. As such, these features are not meant for production use. For additional information, please see the following support articles:
>
> * [AKS Support Policies][aks-support-policies]
> * [Azure Support FAQ][aks-faq]

## Before you begin

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli] or [using the Azure portal][aks-quickstart-portal].

### Install the Azure Policy Add-on for AKS

To secure AKS pods through Azure Policy, you need to install the Azure Policy Add-on for AKS on an AKS cluster. Follow these [steps to install the Azure Policy Add-on](../governance/policy/concepts/policy-for-kubernetes.md#install-azure-policy-add-on-for-aks).

This document assumes you have the following which are deployed in the walk-through linked above.

* Registered the `AKS-AzurePolicyAutoApprove` preview feature flag
* Azure CLI installed with the `aks-preview` extension version 0.4.53 or greater
* An AKS cluster on a supported version of 1.15 or greater installed with the Azure Policy Add-on

## Limitations

* During preview, there is a limit of 200 pods to run in the cluster with Azure Policy enabled.
* Pod security policy and the Azure Policy Add-on for AKS cannot both be enabled. If installing the Azure Policy Add-on into a cluster with pod security policy enabled, disable the pod security policy with the [following instructions](use-pod-security-policies.md#enable-pod-security-policy-on-an-aks-cluster).

## Overview of securing pods through Azure Policy

In a Kubernetes cluster, an admission controller is used to intercept requests to the API server when a resource is to be created. The admission controller can then *validate* the resource request against a set of rules, or *mutate* the resource to change deployment parameters.

Previously, a feature called pod security policy was enabled through the Kubernetes project to support the protection of what pods can be deployed by provisioning a dedicated admission controller. By using Azure Policy for Kubernetes, an AKS cluster can instrument a set of built-in Azure policies which support securing pods and more.

The policy language used by Azure Policy for Kubernetes is built on the open-source Open Policy Agent which relies on Rego and is [explained further here](../governance/policy/concepts/policy-for-kubernetes.md#policy-language).

This document covers the scenarios of using Azure Policy to secure pods similar to what was enabled through pod security policies.

## How do pod security policies map to Azure Policy built-in policies
	
|Scenario| Pod security policy | Azure Policy |
|---|---|---|
|Installation|Enable PSP Admission Controller|Enable Azure Policy Add-on
|Deploy policies| Deploy PSP resource| Assign Azure PSP Policies to subscription/resourceGroup scope. Azure Policy Add-on installs the policies.
| Default policies | When PSP is enabled in AKS, some default policies are applied | No default policies applied on enabling Azure Policy Add-on. User has to explicitly do an assignment in Azure.
| Who can create and assign policies | Cluster admin creates PSP resource | In Azure Portal, policies can be assigned at Management group/subscription/resource group level. The user should have minimum of 'owner' or 'Resource Policy Contributor' permissions on AKS cluster resource group. Through API, user can assign policies at more granular level at AKS cluster resource scope. The user should have minimum of 'owner' or 'Resource Policy Contributor' permissions on AKS cluster resource.
| Authorizing policies| Users/ServiceAccounts should be given permissions to use PSP policies. | No additional cluster level assignment required. Once policies are assigned in Azure, all cluster users can use these policies.
| Policy applicability | The admin user bypasses the enforcement of pod security policies. | All users (admin & non-admin) sees the same policies. There is no special casing based on users. Policy applicability can be excluded at namespace level.
| Policy scope |Cluster scope: PSP resources are not namespaced. | Cluster scope: Constraint templates are not namespaced.
| Deny/Audit/Mutation action | - Support only deny action - Mutate with default values on create request. - Only validation during update requests.| - Support audit & deny actions. - No mutation for now, planned for later.
| PSP compliance of cluster | - There is no visibility on compliance of pods that existed before enabling PSPs. - Non-compliant pods created after enabling PSPs are denied. | - Any non-compliant pods that existed before applying PSPs would show up in policy violations. - Non-compliant pods created after enabling PSPs are denied (if policies are installed in deny mode). 
| How to view PSP policies on cluster? | `kubectl get psp` | `kubectl get constrainttemplate` - All policies including PSPs and non PSPs are listed. - Listing only PSP policies is not supported as of now.
| PSP standard - Privileged | Privileged PSP resource is created by default on enabling PSP feature. | Privileged mode implies no restriction. This is equivalent to not doing any Azure Policy assignment.
| PSP standard - Baseline/default | User installs standard PSP baseline resource. | Azure Policy provides an built-in initiative for baseline PSP. User assigns this initiative at cluster scope.
| PSP standard - Restricted | User installs standard PSP restricted resource. | Azure Policy provides an built-in initiative for restricted PSP. User assigns this initiative at cluster scope.
| PSP custom policies | User can build their own custom PSP resource YAML and install it on cluster. | User needs to create a custom initiative in Azure and assign the initiative at cluster scope |

## Namespace exclusion

AKS requires system pods to run on a cluster to provide critical services such as DNS resolution. The application of policies through Azure Policy can negatively impact the ability for system pods to complete their function. As a result, the following namespaces are excluded from policy enforcement by default:

1. kube-system
1. gatekeeper-system
1. azure-arc
1. aks-periscope

The ability to define additional custom namespaces to be excluded is not supported yet.

## Enable Azure policies for pod security

After installing the Azure Policy Add-on, no policies are applied by default. You can select from built-in policies to be audited or enforced against a given AKS cluster. 

For each policy the behavior can be customized with an effect. Policies on AKS support the following effects:

1. Audit: allow deployments against policy to continue, but flag clusters which are running pods against policy.
1. Deny: disallow deployments from being created which go against policy.

Read more about [Azure Policy effects](../governance/policy/concepts/effects).

### Use built-in initiatives

An initiative in Azure Policy is a collection of policy definitions that are tailored towards achieving a singular overarching goal. The use of initiatives can simplify the management and assignment of policies across AKS clusters. An initiative exists as a single object, read more about [Azure Policy initiatives](../governance/policy/overview#initiative-definition).

Azure Policy for Kubernetes offers two built-in initiatives which focus on pod security, baseline and restricted. These initiatives have been built out of the [definitions used in pod security policy from Kubernetes](https://github.com/kubernetes/website/blob/master/content/en/examples/policy/baseline-psp.yaml).

#### Baseline initiative

The baseline initiative includes the following policies.
* host-namespaces - Defaults are built-in to the template (hostPID and hostIPC set as false)
* privileged-containers - Defaults are built-in to the template (privileged set as false)
* capabilities
  * Default should be allowedCapabilities set as an empty array (nothing additional is allowed)
  * Default [capabilities for Moby](https://github.com/moby/moby/blob/master/oci/caps/defaults.go)
* host-network-ports
  * Defaults should be hostNetwork set as false and both min/max set as 0
* host-filesystem
  * Used to forbid any hostpath volumes
  * An empty constraint will deny everything. Anything added in the constraint will allow those hostpaths.

#### Restricted initiative

This initiative includes all policies from baseline/default. In addition to policies defined in baseline/default, included policies in restricted are:

* volumes
  * Empty constraint will deny everything. Anything added will allow those types.
  * By default, the allowed volumes are:
    1. 'configMap'
    1. 'emptyDir'
    1. 'projected'
    1. 'secret'
    1. 'downwardAPI'
    1. 'persistentVolumeClaim'
* allow-privilege-escalation
  * Defaults are built-in to the template (allowPrivilegeEscalation set as false)

#### Custom initiative

If the built-in initiatives to address pod security do not match your requirements, you can choose your own policies to exist in a custom initiative. Read more about [building custom initatives in Azure Policy](../governance/policy/tutorials/create-and-manage#create-and-assign-an-initiative-definition).

## Create a test user to validate the baseline initiative

By default, when you use the [az aks get-credentials][az-aks-get-credentials] command, the *admin* credentials for the AKS cluster are added to your `kubectl` config. The admin user bypasses the enforcement of pod security policies. If you use Azure Active Directory integration for your AKS clusters, you could sign in with the credentials of a non-admin user to see the enforcement of policies in action. In this article, let's create a test user account in the AKS cluster that you can use.

Create a sample namespace named *psp-aks* for test resources using the [kubectl create namespace][kubectl-create] command. Then, create a service account named *nonadmin-user* using the [kubectl create serviceaccount][kubectl-create] command:

```console
kubectl create namespace psp-aks
kubectl create serviceaccount --namespace psp-aks nonadmin-user
```

Next, create a RoleBinding for the *nonadmin-user* to perform basic actions in the namespace using the [kubectl create rolebinding][kubectl-create] command:

```console
kubectl create rolebinding \
    --namespace psp-aks \
    psp-aks-editor \
    --clusterrole=edit \
    --serviceaccount=psp-aks:nonadmin-user
```

### Create alias commands for admin and non-admin user

To highlight the difference between the regular admin user when using `kubectl` and the non-admin user created in the previous steps, create two command-line aliases:

* The **kubectl-admin** alias is for the regular admin user, and is scoped to the *psp-aks* namespace.
* The **kubectl-nonadminuser** alias is for the *nonadmin-user* created in the previous step, and is scoped to the *psp-aks* namespace.

Create these two aliases as shown in the following commands:

```console
alias kubectl-admin='kubectl --namespace psp-aks'
alias kubectl-nonadminuser='kubectl --as=system:serviceaccount:psp-aks:nonadmin-user --namespace psp-aks'
```

## Test the creation of a privileged pod

Let's first test what happens when you schedule a pod with the security context of `privileged: true`. This security context escalates the pod's privileges. In the previous section which enabled a policy to disallow privileged containers, the request should be denied resulting in the deployment request being rejected.

Create a file named `nginx-privileged.yaml` and paste the following YAML manifest:

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
kubectl-nonadminuser apply -f nginx-privileged.yaml
```

The pod fails to be scheduled, as shown in the following example output:

```console
$ kubectl-nonadminuser apply -f nginx-privileged.yaml

Error from server (Forbidden): error when creating "nginx-privileged.yaml": pods "nginx-privileged" is forbidden: unable to validate against any pod security policy: []
```

The pod doesn't reach the scheduling stage, so there are no resources to delete before you move on.

## Test creation of an unprivileged pod

In the previous example, the pod specification requested privileged escalation. This request is denied by the policy to disallow privileged pods, so the pod fails to be scheduled. Let's try now running that same NGINX pod without the privilege escalation request.

Create a file named `nginx-unprivileged.yaml` and paste the following YAML manifest:

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
kubectl-nonadminuser apply -f nginx-unprivileged.yaml
```

The pod fails to be scheduled, as shown in the following example output:

```console
$ kubectl-nonadminuser apply -f nginx-unprivileged.yaml

Error from server (Forbidden): error when creating "nginx-unprivileged.yaml": pods "nginx-unprivileged" is forbidden: unable to validate against any pod security policy: []
```

The pod doesn't reach the scheduling stage, so there are no resources to delete before you move on.

## Test creation of a pod with a specific user context

In the previous example, the container image automatically tried to use root to bind NGINX to port 80. This request was denied by the default *privilege* pod security policy, so the pod fails to start. Let's try now running that same NGINX pod with a specific user context, such as `runAsUser: 2000`.

Create a file named `nginx-unprivileged-nonroot.yaml` and paste the following YAML manifest:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-unprivileged-nonroot
spec:
  containers:
    - name: nginx-unprivileged
      image: nginx:1.14.2
      securityContext:
        runAsUser: 2000
```

Create the pod using the [kubectl apply][kubectl-apply] command and specify the name of your YAML manifest:

```console
kubectl-nonadminuser apply -f nginx-unprivileged-nonroot.yaml
```

The pod fails to be scheduled, as shown in the following example output:

```console
$ kubectl-nonadminuser apply -f nginx-unprivileged-nonroot.yaml

Error from server (Forbidden): error when creating "nginx-unprivileged-nonroot.yaml": pods "nginx-unprivileged-nonroot" is forbidden: unable to validate against any pod security policy: []
```

The pod doesn't reach the scheduling stage, so there are no resources to delete before you move on.

With your custom pod security policy applied and a binding for the user account to use the policy, let's try to create an unprivileged pod again. Use the same `nginx-privileged.yaml` manifest to create the pod using the [kubectl apply][kubectl-apply] command:

```console
kubectl-nonadminuser apply -f nginx-unprivileged.yaml
```

The pod is successfully scheduled. When you check the status of the pod using the [kubectl get pods][kubectl-get] command, the pod is *Running*:

```
$ kubectl-nonadminuser get pods

NAME                 READY   STATUS    RESTARTS   AGE
nginx-unprivileged   1/1     Running   0          7m14s
```

This example shows how you can create custom pod security policies to define access to the AKS cluster for different users or groups. The default AKS policies provide tight controls on what pods can run, so create your own custom policies to then correctly define the restrictions you need.

Delete the NGINX unprivileged pod using the [kubectl delete][kubectl-delete] command and specify the name of your YAML manifest:

```console
kubectl-nonadminuser delete -f nginx-unprivileged.yaml
```

## Clean up resources

To disable the Azure Policy Add-on, use the [az aks disable-addons][az-aks-disable-addons] command.

```azure-cli
# Log in first with az login if you're not using Cloud Shell

az aks disable-addons --addons azure-policy --name MyAKSCluster --resource-group MyResourceGroup
```

Learn how to remove the [Azure Policy Add-on from Azure portal](../governance/policy/concepts/policy-for-kubernetes.md#remove-the-add-on-from-aks).

## Next steps

This article showed you how to apply an Azure policy which restricts privileged pods from being deployed to prevent the use of privileged access. There are many policies which can be applied, such as those which restrict use of volumes. For more information on the available options, see the [Azure Policy for Kubernetes reference docs][kubernetes-policy-reference].

For more information about limiting pod network traffic, see [Secure traffic between pods using network policies in AKS][network-policies].

<!-- LINKS - external -->
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-delete]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#delete
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-create]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#create
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe
[kubectl-logs]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#logs
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/
[kubernetes-policy-reference]: 

<!-- LINKS - internal -->
[aks-quickstart-cli]: kubernetes-walkthrough.md
[aks-quickstart-portal]: kubernetes-walkthrough-portal.md
[install-azure-cli]: /cli/azure/install-azure-cli
[network-policies]: use-network-policies.md
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-list]: /cli/azure/feature#az-feature-list
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[az-aks-update]: /cli/azure/ext/aks-preview/aks#ext-aks-preview-az-aks-update
[az-extension-add]: /cli/azure/extension#az-extension-add
[aks-support-policies]: support-policies.md
[aks-faq]: faq.md
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
