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

## Overview of securing pods through Azure Policy

>[!NOTE]
> This document details how to use Azure Policy to secure pods, which is the successor to the previous Kubernetes pod security policy feature in preview.
> 
> **Both the pod security policy (preview) feature and the Azure Policy Add-on for AKS cannot be enabled simultaneously.** If installing the Azure Policy Add-on into a cluster with pod security policy enabled, disable the pod security policy with the [following instructions](use-pod-security-policies.md#enable-pod-security-policy-on-an-aks-cluster).

In an AKS cluster, an admission controller is used to intercept requests to the API server when a resource is to be created and updated. The admission controller can then *validate* the resource request against a set of rules on whether it should be created.

Previously, a feature called pod security policy was enabled through the Kubernetes project to support the protection of what pods can be deployed by provisioning a dedicated admission controller. By using the Azure Policy Add-on, an AKS cluster can instrument a set of built-in Azure policies which support securing pods and other Kubernetes resources. This is enabled by deploying a managed instance of [Gatekeeper](https://github.com/open-policy-agent/gatekeeper), a dedicated validating admission controller.

The policy language used by Azure Policy for Kubernetes is built on the open-source Open Policy Agent which relies on Rego and is [explained further here](../governance/policy/concepts/policy-for-kubernetes.md#policy-language).

This document covers the scenarios of using Azure Policy to secure pods similar to what was enabled through pod security policies.

## Limitations

* During preview, there is a recommended limit of 200 pods with 20 Kubernetes policies to run in the cluster with Azure Policy enabled.
* Pod security policy and the Azure Policy Add-on for AKS cannot both be enabled. If installing the Azure Policy Add-on into a cluster with pod security policy enabled, disable the pod security policy with the [following instructions](use-pod-security-policies.md#enable-pod-security-policy-on-an-aks-cluster).

## Namespace exclusion

AKS requires system pods to run on a cluster to provide critical services such as DNS resolution. The application of policies through Azure Policy can negatively impact the ability for system pods to complete their function. As a result, the following namespaces are excluded from policy enforcement by default:

1. kube-system
1. gatekeeper-system
1. azure-arc
1. aks-periscope

The ability to define additional custom namespaces to be excluded is not supported yet.

## Azure policies to secure Kubernetes pods

After installing the Azure Policy Add-on, no policies are applied by default.

The following sixteen (16) built-in Azure policies can be enabled in an AKS cluster to specifically secure pods. These policies map to Kubernetes pod security policies, learn  about [how to migrate and how the features compare and contrast](#migrate-from-kubernetes-pod-security-policy-to-the-azure-policy).

For each policy the behavior can be customized with an effect. A [full list of AKS policies and their supported effects are listed here](policy-samples.md#microsoftcontainerservice). Read more about [Azure Policy effects](../governance/policy/concepts/effects.md).

### Use built-in initiatives

An initiative in Azure Policy is a collection of policy definitions that are tailored towards achieving a singular overarching goal. The use of initiatives can simplify the management and assignment of policies across AKS clusters. An initiative exists as a single object, read more about [Azure Policy initiatives](../governance/policy/overview.md#initiative-definition).

Azure Policy for Kubernetes offers two built-in initiatives which focus on pod security, baseline and restricted. These initiatives have been built out of the [definitions used in pod security policy from Kubernetes](https://github.com/kubernetes/website/blob/master/content/en/examples/policy/baseline-psp.yaml).

|[Pod security policy control](https://kubernetes.io/docs/concepts/policy/pod-security-policy/#what-is-a-pod-security-policy)| Azure Policy Definition | Baseline initiative | Restricted initiative |
|---|---|---|---|
|Running of privileged containers|[Public Cloud](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F95edb821-ddaf-4404-9732-666045e056b4)| Yes | Yes
|Usage of host namespaces|[Public Cloud](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F47a1ee2f-2a2a-4576-bf2a-e0e36709c2b8)| Yes | Yes
|Usage of host networking and ports|[Public Cloud](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F82985f06-dc18-4a48-bc1c-b9f4f0098cfe)| Yes | Yes
|Usage of the host filesystem|[Public Cloud](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F098fc59e-46c7-4d99-9b16-64990e543d75)| Yes | Yes
|Linux capabilities|[Public Cloud](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc26596ff-4d70-4e6a-9a30-c2506bd2f80c) | Yes | Yes
|Usage of volume types|[Public Cloud](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F16697877-1118-4fb1-9b65-9898ec2509ec)| No | Yes
|Restricting escalation to root privilege|[Public Cloud](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1c6e92c9-99f0-4e55-9cf2-0c234dc48f99) | No | Yes |
|Allow specific FlexVolume drivers|[Public Cloud](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff4a8fce0-2dd5-4c21-9a36-8f0ec809d663) | - | - |
|Allocating an FSGroup that owns the pod's volumes|[Public Cloud](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff06ddb64-5fa3-4b77-b166-acb36f7f6042) | - | - |
|The user and group IDs of the container|[Public Cloud](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff06ddb64-5fa3-4b77-b166-acb36f7f6042) | - | - |
|Requiring the use of a read only root file system|[Public Cloud](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fdf49d893-a74c-421d-bc95-c663042e5b80) | - | - |
|The SELinux context of the container|[Public Cloud](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe1e6c427-07d9-46ab-9689-bfa85431e636) | - | - |
|The Allowed Proc Mount types for the container|[Public Cloud](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff85eb0dd-92ee-40e9-8a76-db25a507d6d3) | - | - |
|The AppArmor profile used by containers|[Public Cloud](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F511f5417-5d12-434d-ab2e-816901e72a5e) | - | - |
|The seccomp profile used by containers|[Public Cloud](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F975ce327-682c-4f2e-aa46-b9598289b86c) | - | - |
|The sysctl profile used by containers|[Public Cloud](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F56d0a13f-712f-466b-8416-56fb354fb823) | - | - |

<!---
# Removing until custom initiatives are supported the week after preview

#### Custom initiative

If the built-in initiatives to address pod security do not match your requirements, you can choose your own policies to exist in a custom initiative. Read more about [building custom initatives in Azure Policy](../governance/policy/tutorials/create-and-manage#create-and-assign-an-initiative-definition).

--->

## Apply the baseline initiative

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

## Test creation of an unprivileged pod

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

## Migrate from Kubernetes pod security policy to the Azure Policy

To migrate from pod security policy you need to take the following actions.

1. Disable pod security policy on the cluster
1. Enable the Azure Policy Add-on by following these instructions
1. Enable the policies needed from [this list of Azure policies for Kubernetes]

Once migrated, the behavior changes between pod security policy and Azure Policy are the following.

|Scenario| Pod security policy | Azure Policy |
|---|---|---|
|Installation|Enable PSP Admission Controller|Enable Azure Policy Add-on
|Deploy policies| Deploy PSP resource| Assign Azure PSP Policies to subscription/resourceGroup scope. Azure Policy Add-on installs the policies.
| Default policies | When PSP is enabled in AKS, default Privileged, Unrestricted policies are applied | No default policies applied on enabling Azure Policy Add-on. User has to explicitly do an assignment in Azure.
| Who can create and assign policies | Cluster admin creates PSP resource | In Azure Portal, policies can be assigned at Management group/subscription/resource group level. The user should have minimum of 'owner' or 'Resource Policy Contributor' permissions on AKS cluster resource group. Through API, user can assign policies at more granular level at AKS cluster resource scope. The user should have minimum of 'owner' or 'Resource Policy Contributor' permissions on AKS cluster resource.
| Authorizing policies| Users/ServiceAccounts should be given permissions to use PSP policies. | No additional cluster level assignment required. Once policies are assigned in Azure, all cluster users can use these policies.
| Policy applicability | The admin user bypasses the enforcement of pod security policies. | All users (admin & non-admin) sees the same policies. There is no special casing based on users. Policy applicability can be excluded at namespace level.
| Policy scope |Cluster scope: PSP resources are not namespaced. | Cluster scope: Constraint templates are not namespaced.
| Deny/Audit/Mutation action | - Support only deny action - Mutate with default values on create request. - Only validation during update requests.| - Support audit & deny actions. - No mutation for now, planned for later.
| PSP compliance of cluster | - There is no visibility on compliance of pods that existed before enabling PSPs. - Non-compliant pods created after enabling PSPs are denied. | - Any non-compliant pods that existed before applying PSPs would show up in policy violations. - Non-compliant pods created after enabling PSPs are denied (if policies are installed in deny mode). 
| How to view PSP policies on cluster? | `kubectl get psp` | `kubectl get constrainttemplate` - All policies including PSPs and non PSPs are listed. - Listing only PSP policies is not supported as of now.
| PSP standard - Privileged | Privileged PSP resource is created by default on enabling PSP feature. | Privileged mode implies no restriction. This is equivalent to not doing any Azure Policy assignment.
| [PSP standard - Baseline/default](https://kubernetes.io/docs/concepts/security/pod-security-standards/#baseline-default) | User installs standard PSP baseline resource. | Azure Policy provides an built-in initiative for baseline PSP. User assigns this initiative at cluster scope.
| [PSP standard - Restricted](https://kubernetes.io/docs/concepts/security/pod-security-standards/#restricted) | User installs standard PSP restricted resource. | Azure Policy provides an built-in initiative for restricted PSP. User assigns this initiative at cluster scope.
| PSP custom policies | User can build their own custom PSP resource YAML and install it on cluster. | User needs to create a custom initiative in Azure and assign the initiative at cluster scope |

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
