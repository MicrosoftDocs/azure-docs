---
title: Use Azure AD in Azure Kubernetes Service
description: Learn how to use Azure AD in Azure Kubernetes Service (AKS) 
services: container-service
ms.topic: article
ms.date: 02/1/2021
ms.author: miwithro
---

# AKS-managed Azure Active Directory integration

AKS-managed Azure AD integration is designed to simplify the Azure AD integration experience, where users were previously required to create a client app, a server app, and required the Azure AD tenant to grant Directory Read permissions. In the new version, the AKS resource provider manages the client and server apps for you.

## Azure AD authentication overview

Cluster administrators can configure Kubernetes role-based access control (Kubernetes RBAC) based on a user's identity or directory group membership. Azure AD authentication is provided to AKS clusters with OpenID Connect. OpenID Connect is an identity layer built on top of the OAuth 2.0 protocol. For more information on OpenID Connect, see the [Open ID connect documentation][open-id-connect].

Learn more about the Azure AD integration flow on the [Azure Active Directory integration concepts documentation](concepts-identity.md#azure-ad-integration).

## Limitations 

* AKS-managed Azure AD integration can't be disabled
* Changing a AKS-managed Azure AD integrated cluster to legacy AAD is not supported
* non-Kubernetes RBAC enabled clusters aren't supported for AKS-managed Azure AD integration
* Changing the Azure AD tenant associated with AKS-managed Azure AD integration isn't supported

## Prerequisites

* The Azure CLI version 2.11.0 or later
* Kubectl with a minimum version of [1.18.1](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.18.md#v1181) or [kubelogin](https://github.com/Azure/kubelogin)
* If you are using [helm](https://github.com/helm/helm), minimum version of helm 3.3.

> [!Important]
> You must use Kubectl with a minimum version of 1.18.1 or kubelogin. The difference between the minor versions of Kubernetes and kubectl should not be more than 1 version. If you don't use the correct version, you will notice authentication issues.

To install kubectl and kubelogin, use the following commands:

```azurecli-interactive
sudo az aks install-cli
kubectl version --client
kubelogin --version
```

Use [these instructions](https://kubernetes.io/docs/tasks/tools/install-kubectl/) for other operating systems.

## Before you begin

For your cluster, you need an Azure AD group. This group is needed as admin group for the cluster to grant cluster admin permissions. You can use an existing Azure AD group, or create a new one. Record the object ID of your Azure AD group.

```azurecli-interactive
# List existing groups in the directory
az ad group list --filter "displayname eq '<group-name>'" -o table
```

To create a new Azure AD group for your cluster administrators, use the following command:

```azurecli-interactive
# Create an Azure AD group
az ad group create --display-name myAKSAdminGroup --mail-nickname myAKSAdminGroup
```

## Create an AKS cluster with Azure AD enabled

Create an AKS cluster by using the following CLI commands.

Create an Azure resource group:

```azurecli-interactive
# Create an Azure resource group
az group create --name myResourceGroup --location centralus
```

Create an AKS cluster, and enable administration access for your Azure AD group

```azurecli-interactive
# Create an AKS-managed Azure AD cluster
az aks create -g myResourceGroup -n myManagedCluster --enable-aad --aad-admin-group-object-ids <id> [--aad-tenant-id <id>]
```

A successful creation of an AKS-managed Azure AD cluster has the following section in the response body
```output
"AADProfile": {
    "adminGroupObjectIds": [
      "5d24****-****-****-****-****afa27aed"
    ],
    "clientAppId": null,
    "managed": true,
    "serverAppId": null,
    "serverAppSecret": null,
    "tenantId": "72f9****-****-****-****-****d011db47"
  }
```

Once the cluster is created, you can start accessing it.

## Access an Azure AD enabled cluster

You'll need the [Azure Kubernetes Service Cluster User](../role-based-access-control/built-in-roles.md#azure-kubernetes-service-cluster-user-role) built-in role to do the following steps.

Get the user credentials to access the cluster:
 
```azurecli-interactive
 az aks get-credentials --resource-group myResourceGroup --name myManagedCluster
```
Follow the instructions to sign in.

Use the kubectl get nodes command to view nodes in the cluster:

```azurecli-interactive
kubectl get nodes

NAME                       STATUS   ROLES   AGE    VERSION
aks-nodepool1-15306047-0   Ready    agent   102m   v1.15.10
aks-nodepool1-15306047-1   Ready    agent   102m   v1.15.10
aks-nodepool1-15306047-2   Ready    agent   102m   v1.15.10
```
Configure [Azure role-based access control (Azure RBAC)](./azure-ad-rbac.md) to configure additional security groups for your clusters.

## Troubleshooting access issues with Azure AD

> [!Important]
> The steps described below are bypassing the normal Azure AD group authentication. Use them only in an emergency.

If you're permanently blocked by not having access to a valid Azure AD group with access to your cluster, you can still obtain the admin credentials to access the cluster directly.

To do these steps, you'll need to have access to the [Azure Kubernetes Service Cluster Admin](../role-based-access-control/built-in-roles.md#azure-kubernetes-service-cluster-admin-role) built-in role.

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name myManagedCluster --admin
```

## Enable AKS-managed Azure AD Integration on your existing cluster

You can enable AKS-managed Azure AD Integration on your existing Kubernetes RBAC enabled cluster. Ensure to set your admin group to keep access on your cluster.

```azurecli-interactive
az aks update -g MyResourceGroup -n MyManagedCluster --enable-aad --aad-admin-group-object-ids <id-1> [--aad-tenant-id <id>]
```

A successful activation of an AKS-managed Azure AD cluster has the following section in the response body

```output
"AADProfile": {
    "adminGroupObjectIds": [
      "5d24****-****-****-****-****afa27aed"
    ],
    "clientAppId": null,
    "managed": true,
    "serverAppId": null,
    "serverAppSecret": null,
    "tenantId": "72f9****-****-****-****-****d011db47"
  }
```

Download user credentials again to access your cluster by following the steps [here][access-cluster].

## Upgrading to AKS-managed Azure AD Integration

If your cluster uses legacy Azure AD integration, you can upgrade to AKS-managed Azure AD Integration.

```azurecli-interactive
az aks update -g myResourceGroup -n myManagedCluster --enable-aad --aad-admin-group-object-ids <id> [--aad-tenant-id <id>]
```

A successful migration of an AKS-managed Azure AD cluster has the following section in the response body

```output
"AADProfile": {
    "adminGroupObjectIds": [
      "5d24****-****-****-****-****afa27aed"
    ],
    "clientAppId": null,
    "managed": true,
    "serverAppId": null,
    "serverAppSecret": null,
    "tenantId": "72f9****-****-****-****-****d011db47"
  }
```

If you want to access the cluster, follow the steps [here][access-cluster].

## Non-interactive sign in with kubelogin

There are some non-interactive scenarios, such as continuous integration pipelines, that aren't currently available with kubectl. You can use [`kubelogin`](https://github.com/Azure/kubelogin) to access the cluster with non-interactive service principal sign-in.

## Use Conditional Access with Azure AD and AKS

When integrating Azure AD with your AKS cluster, you can also use [Conditional Access][aad-conditional-access] to control access to your cluster.

> [!NOTE]
> Azure AD Conditional Access is an Azure AD Premium capability.

To create an example Conditional Access policy to use with AKS, complete the following steps:

1. At the top of the Azure portal, search for and select Azure Active Directory.
1. In the menu for Azure Active Directory on the left-hand side, select *Enterprise applications*.
1. In the menu for Enterprise applications on the left-hand side, select *Conditional Access*.
1. In the menu for Conditional Access on the left-hand side, select *Policies* then *New policy*.
    :::image type="content" source="./media/managed-aad/conditional-access-new-policy.png" alt-text="Adding a Conditional Access policy":::
1. Enter a name for the policy such as *aks-policy*.
1. Select *Users and groups*, then under *Include* select *Select users and groups*. Choose the users and groups where you want to apply the policy. For this example, choose the same Azure AD group that has administration access to your cluster.
    :::image type="content" source="./media/managed-aad/conditional-access-users-groups.png" alt-text="Selecting users or groups to apply the Conditional Access policy":::
1. Select *Cloud apps or actions*, then under *Include* select *Select apps*. Search for *Azure Kubernetes Service* and select *Azure Kubernetes Service AAD Server*.
    :::image type="content" source="./media/managed-aad/conditional-access-apps.png" alt-text="Selecting Azure Kubernetes Service AD Server for applying the Conditional Access policy":::
1. Under *Access controls*, select *Grant*. Select *Grant access* then *Require device to be marked as compliant*.
    :::image type="content" source="./media/managed-aad/conditional-access-grant-compliant.png" alt-text="Selecting to only allow compliant devices for the Conditional Access policy":::
1. Under *Enable policy*, select *On* then *Create*.
    :::image type="content" source="./media/managed-aad/conditional-access-enable-policy.png" alt-text="Enabling the Conditional Access policy":::

Get the user credentials to access the cluster, for example:

```azurecli-interactive
 az aks get-credentials --resource-group myResourceGroup --name myManagedCluster
```

Follow the instructions to sign in.

Use the `kubectl get nodes` command to view nodes in the cluster:

```azurecli-interactive
kubectl get nodes
```

Follow the instructions to sign in again. Notice there is an error message stating you are successfully logged in, but your admin requires the device requesting access to be managed by your Azure AD to access the resource.

In the Azure portal, navigate to Azure Active Directory, select *Enterprise applications* then under *Activity* select *Sign-ins*. Notice an entry at the top with a *Status* of *Failed* and a *Conditional Access* of *Success*. Select the entry then select *Conditional Access* in *Details*. Notice your Conditional Access policy is listed.

:::image type="content" source="./media/managed-aad/conditional-access-sign-in-activity.png" alt-text="Failed sign-in entry due to Conditional Access policy":::

## Configure just-in-time cluster access with Azure AD and AKS

Another option for cluster access control is to use Privileged Identity Management (PIM) for just-in-time requests.

>[!NOTE]
> PIM is an Azure AD Premium capability requiring a Premium P2 SKU. For more on Azure AD SKUs, see the [pricing guide][aad-pricing].

To integrate just-in-time access requests with an AKS cluster using AKS-managed Azure AD integration, complete the following steps:

1. At the top of the Azure portal, search for and select Azure Active Directory.
1. Take note of the Tenant ID, referred to for the rest of these instructions as `<tenant-id>`
    :::image type="content" source="./media/managed-aad/jit-get-tenant-id.png" alt-text="In a web browser, the Azure portal screen for Azure Active Directory is shown with the tenant's ID highlighted.":::
1. In the menu for Azure Active Directory on the left-hand side, under *Manage* select *Groups* then *New Group*.
    :::image type="content" source="./media/managed-aad/jit-create-new-group.png" alt-text="Shows the Azure portal Active Directory groups screen with the 'New Group' option highlighted.":::
1. Make sure a Group Type of *Security* is selected and enter a group name, such as *myJITGroup*. Under *Azure AD Roles can be assigned to this group (Preview)*, select *Yes*. Finally, select *Create*.
    :::image type="content" source="./media/managed-aad/jit-new-group-created.png" alt-text="Shows the Azure portal's new group creation screen.":::
1. You will be brought back to the *Groups* page. Select your newly created group and take note of the Object ID, referred to for the rest of these instructions as `<object-id>`.
    :::image type="content" source="./media/managed-aad/jit-get-object-id.png" alt-text="Shows the Azure portal screen for the just-created group, highlighting the Object Id":::
1. Deploy an AKS cluster with AKS-managed Azure AD integration by using the `<tenant-id>` and `<object-id>` values from earlier:
    ```azurecli-interactive
    az aks create -g myResourceGroup -n myManagedCluster --enable-aad --aad-admin-group-object-ids <object-id> --aad-tenant-id <tenant-id>
    ```
1. Back in the Azure portal, in the menu for *Activity* on the left-hand side, select *Privileged Access (Preview)* and select *Enable Privileged Access*.
    :::image type="content" source="./media/managed-aad/jit-enabling-priv-access.png" alt-text="The Azure portal's Privileged access (Preview) page is shown, with 'Enable privileged access' highlighted":::
1. Select *Add Assignments* to begin granting access.
    :::image type="content" source="./media/managed-aad/jit-add-active-assignment.png" alt-text="The Azure portal's Privileged access (Preview) screen after enabling is shown. The option to 'Add assignments' is highlighted.":::
1. Select a role of *member*, and select the users and groups to whom you wish to grant cluster access. These assignments can be modified at any time by a group admin. When you're ready to move on, select *Next*.
    :::image type="content" source="./media/managed-aad/jit-adding-assignment.png" alt-text="The Azure portal's Add assignments Membership screen is shown, with a sample user selected to be added as a member. The option 'Next' is highlighted.":::
1. Choose an assignment type of *Active*, the desired duration, and provide a justification. When you're ready to proceed, select *Assign*. For more on assignment types, see [Assign eligibility for a privileged access group (preview) in Privileged Identity Management][aad-assignments].
    :::image type="content" source="./media/managed-aad/jit-set-active-assignment-details.png" alt-text="The Azure portal's Add assignments Setting screen is shown. An assignment type of 'Active' is selected and a sample justification has been given. The option 'Assign' is highlighted.":::

Once the assignments have been made, verify just-in-time access is working by accessing the cluster. For example:

```azurecli-interactive
 az aks get-credentials --resource-group myResourceGroup --name myManagedCluster
```

Follow the steps to sign in.

Use the `kubectl get nodes` command to view nodes in the cluster:

```azurecli-interactive
kubectl get nodes
```

Note the authentication requirement and follow the steps to authenticate. If successful, you should see output similar to the following:

```output
To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code AAAAAAAAA to authenticate.
NAME                                STATUS   ROLES   AGE     VERSION
aks-nodepool1-61156405-vmss000000   Ready    agent   6m36s   v1.18.14
aks-nodepool1-61156405-vmss000001   Ready    agent   6m42s   v1.18.14
aks-nodepool1-61156405-vmss000002   Ready    agent   6m33s   v1.18.14
```

### Troubleshooting

If `kubectl get nodes` returns an error similar to the following:

```output
Error from server (Forbidden): nodes is forbidden: User "aaaa11111-11aa-aa11-a1a1-111111aaaaa" cannot list resource "nodes" in API group "" at the cluster scope
```

Make sure the admin of the security group has given your account an *Active* assignment.

## Next steps

* Learn about [Azure RBAC integration for Kubernetes Authorization][azure-rbac-integration]
* Learn about [Azure AD integration with Kubernetes RBAC][azure-ad-rbac].
* Use [kubelogin](https://github.com/Azure/kubelogin) to access features for Azure authentication that aren't available in kubectl.
* Learn more about [AKS and Kubernetes identity concepts][aks-concepts-identity].
* Use [Azure Resource Manager (ARM) templates ][aks-arm-template] to create AKS-managed Azure AD enabled clusters.

<!-- LINKS - external -->
[kubernetes-webhook]:https://kubernetes.io/docs/reference/access-authn-authz/authentication/#webhook-token-authentication
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[aks-arm-template]: /azure/templates/microsoft.containerservice/managedclusters
[aad-pricing]: https://azure.microsoft.com/pricing/details/active-directory/

<!-- LINKS - Internal -->
[aad-conditional-access]: ../active-directory/conditional-access/overview.md
[azure-rbac-integration]: manage-azure-rbac.md
[aks-concepts-identity]: concepts-identity.md
[azure-ad-rbac]: azure-ad-rbac.md
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[az-group-create]: /cli/azure/group#az_group_create
[open-id-connect]:../active-directory/develop/v2-protocols-oidc.md
[az-ad-user-show]: /cli/azure/ad/user#az_ad_user_show
[rbac-authorization]: concepts-identity.md#role-based-access-controls-rbac
[operator-best-practices-identity]: operator-best-practices-identity.md
[azure-ad-rbac]: azure-ad-rbac.md
[azure-ad-cli]: azure-ad-integration-cli.md
[access-cluster]: #access-an-azure-ad-enabled-cluster
[aad-migrate]: #upgrading-to-aks-managed-azure-ad-integration
[aad-assignments]: ../active-directory/privileged-identity-management/groups-assign-member-owner.md#assign-an-owner-or-member-of-a-group
