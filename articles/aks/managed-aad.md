---
title: Use Azure AD in Azure Kubernetes Service
description: Learn how to use Azure AD in Azure Kubernetes Service (AKS)
ms.topic: article
ms.date: 03/02/2023
ms.author: miwithro
---

# AKS-managed Azure Active Directory integration

AKS-managed Azure Active Directory (Azure AD) integration simplifies the Azure AD integration process. Previously, you were required to create a client and server app, and the Azure AD tenant had to grant Directory Read permissions. Now, the AKS resource provider manages the client and server apps for you.

## Azure AD authentication overview

Cluster administrators can configure Kubernetes role-based access control (Kubernetes RBAC) based on a user's identity or directory group membership. Azure AD authentication is provided to AKS clusters with OpenID Connect. OpenID Connect is an identity layer built on top of the OAuth 2.0 protocol. For more information on OpenID Connect, see the [Open ID connect documentation][open-id-connect].

Learn more about the Azure AD integration flow in the [Azure AD documentation](concepts-identity.md#azure-ad-integration).

## Limitations

* AKS-managed Azure AD integration can't be disabled.
* Changing an AKS-managed Azure AD integrated cluster to legacy Azure AD isn't supported.
* Clusters without Kubernetes RBAC enabled aren't supported with AKS-managed Azure AD integration.

## Before you begin

* Make sure Azure CLI version 2.29.0 or later is installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).
* You need `kubectl`, with a minimum version of [1.18.1](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.18.md#v1181) or [`kubelogin`](https://github.com/Azure/kubelogin). The difference between the minor versions of Kubernetes and `kubectl` shouldn't be more than 1 version. You'll experience authentication issues if you don't use the correct version.
* If you're using [helm](https://github.com/helm/helm), you need a minimum version of helm 3.3.
* This article requires that you have an Azure AD group for your cluster. This group will be registered as an admin group on the cluster to grant cluster admin permissions. If you don't have an existing Azure AD group, you can create one using the [`az ad group create`](/cli/azure/ad/group#az_ad_group_create) command.

## Create an AKS cluster with Azure AD enabled

1. Create an Azure resource group using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    az group create --name myResourceGroup --location centralus
    ```

2. Create an AKS cluster and enable administration access for your Azure AD group using the [`az aks create`][az-aks-create] command.

    ```azurecli-interactive
    az aks create -g myResourceGroup -n myManagedCluster --enable-aad --aad-admin-group-object-ids <id> [--aad-tenant-id <id>]
    ```

    A successful creation of an AKS-managed Azure AD cluster has the following section in the response body:

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

## Access an Azure AD enabled cluster

Before you access the cluster using an Azure AD defined group, you need the [Azure Kubernetes Service Cluster User](../role-based-access-control/built-in-roles.md#azure-kubernetes-service-cluster-user-role) built-in role.

1. Get the user credentials to access the cluster using the [`az aks get-credentials`][az-aks-get-credentials] command.

    ```azurecli-interactive
    az aks get-credentials --resource-group myResourceGroup --name myManagedCluster
    ```

2. Follow the instructions to sign in.

3. Use the `kubectl get nodes` command to view nodes in the cluster.

    ```azurecli-interactive
    kubectl get nodes
    ```

4. Set up [Azure role-based access control (Azure RBAC)](./azure-ad-rbac.md) to configure other security groups for your clusters.

## Troubleshooting access issues with Azure AD

> [!IMPORTANT]
> The steps described in this section bypass the normal Azure AD group authentication. Use them only in an emergency.

If you're permanently blocked by not having access to a valid Azure AD group with access to your cluster, you can still obtain the admin credentials to access the cluster directly. You need to have access to the [Azure Kubernetes Service Cluster Admin](../role-based-access-control/built-in-roles.md#azure-kubernetes-service-cluster-admin-role) built-in role.

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name myManagedCluster --admin
```

## Enable AKS-managed Azure AD integration on your existing cluster

Enable AKS-managed Azure AD integration on your existing Kubernetes RBAC enabled cluster using the [`az aks update`][az-aks-update] command. Make sure to set your admin group to keep access on your cluster.

```azurecli-interactive
az aks update -g MyResourceGroup -n MyManagedCluster --enable-aad --aad-admin-group-object-ids <id-1> [--aad-tenant-id <id>]
```

A successful activation of an AKS-managed Azure AD cluster has the following section in the response body:

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

Download user credentials again to access your cluster by following the steps in [access an Azure AD enabled cluster][access-cluster].

## Upgrade to AKS-managed Azure AD integration

If your cluster uses legacy Azure AD integration, you can upgrade to AKS-managed Azure AD integration with no downtime using the [`az aks update`][az-aks-update] command.

```azurecli-interactive
az aks update -g myResourceGroup -n myManagedCluster --enable-aad --aad-admin-group-object-ids <id> [--aad-tenant-id <id>]
```

A successful migration of an AKS-managed Azure AD cluster has the following section in the response body:

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

In order to access the cluster, follow the steps in [access an Azure AD enabled cluster][access-cluster] to update kubeconfig.

## Non-interactive sign in with kubelogin

There are some non-interactive scenarios, such as continuous integration pipelines, that aren't currently available with `kubectl`. You can use [`kubelogin`](https://github.com/Azure/kubelogin) to connect to the cluster with a non-interactive service principal credential.

## Disable local accounts

When you deploy an AKS cluster, local accounts are enabled by default. Even when enabling RBAC or Azure AD integration, `--admin` access still exists as a non-auditable backdoor option. You can disable local accounts using the parameter `disable-local-accounts`. The `properties.disableLocalAccounts` field has been added to the managed cluster API to indicate whether the feature is enabled or not on the cluster.

> [!NOTE]
>
> * On clusters with Azure AD integration enabled, users assigned to an Azure AD administrators group specified by `aad-admin-group-object-ids` can still gain access using non-administrator credentials. On clusters without Azure AD integration enabled and `properties.disableLocalAccounts` set to `true`, any attempt to authenticate with user or admin credentials will fail.
>
> * After disabling local user accounts on an existing AKS cluster where users might have authenticated with local accounts, the administrator must [rotate the cluster certificates](certificate-rotation.md) to revoke certificates they might have had access to. If this is a new cluster, no action is required.

### Create a new cluster without local accounts

Create a new AKS cluster without any local accounts using the [`az aks create`][az-aks-create] command with the `disable-local-accounts` flag.

```azurecli-interactive
az aks create -g <resource-group> -n <cluster-name> --enable-aad --aad-admin-group-object-ids <aad-group-id> --disable-local-accounts
```

In the output, confirm local accounts have been disabled by checking the field `properties.disableLocalAccounts` is set to `true`.

```output
"properties": {
    ...
    "disableLocalAccounts": true,
    ...
}
```

Attempting to get admin credentials will fail with an error message indicating the feature is preventing access:

```azurecli-interactive
az aks get-credentials --resource-group <resource-group> --name <cluster-name> --admin

Operation failed with status: 'Bad Request'. Details: Getting static credential isn't allowed because this cluster is set to disable local accounts.
```

### Disable local accounts on an existing cluster

Disable local accounts on an existing Azure AD integration enabled AKS cluster using the [`az aks update`][az-aks-update] command with the `disable-local-accounts` parameter.

```azurecli-interactive
az aks update -g <resource-group> -n <cluster-name> --disable-local-accounts
```

In the output, confirm local accounts have been disabled by checking the field `properties.disableLocalAccounts` is set to `true`.

```output
"properties": {
    ...
    "disableLocalAccounts": true,
    ...
}
```

Attempting to get admin credentials will fail with an error message indicating the feature is preventing access:

```azurecli-interactive
az aks get-credentials --resource-group <resource-group> --name <cluster-name> --admin

Operation failed with status: 'Bad Request'. Details: Getting static credential isn't allowed because this cluster is set to disable local accounts.
```

### Re-enable local accounts on an existing cluster

AKS supports enabling a disabled local account on an existing cluster using the [`az aks update`][az-aks-update] command with the `enable-local-accounts` parameter.

```azurecli-interactive
az aks update -g <resource-group> -n <cluster-name> --enable-local-accounts
```

In the output, confirm local accounts have been re-enabled by checking the field `properties.disableLocalAccounts` is set to `false`.

```output
"properties": {
    ...
    "disableLocalAccounts": false,
    ...
}
```

Attempting to get admin credentials will succeed:

```azurecli-interactive
az aks get-credentials --resource-group <resource-group> --name <cluster-name> --admin

Merged "<cluster-name>-admin" as current context in C:\Users\<username>\.kube\config
```

## Use Conditional Access with Azure AD and AKS

When integrating Azure AD with your AKS cluster, you can also use [Conditional Access][aad-conditional-access] to control access to your cluster.

> [!NOTE]
> Azure AD Conditional Access is an Azure AD Premium capability.

Create an example Conditional Access policy to use with AKS:

1. In the Azure portal, go to the **Azure Active Directory** page and select **Enterprise applications**.
2. Select **Conditional Access** > **Policies** >**New policy**.
    :::image type="content" source="./media/managed-aad/conditional-access-new-policy.png" alt-text="Adding a Conditional Access policy":::
3. Enter a name for the policy, for example **aks-policy**.
4. Under **Assignments** select **Users and groups**. Choose the users and groups you want to apply the policy to. In this example, choose the same Azure AD group that has administrator access to your cluster.
    :::image type="content" source="./media/managed-aad/conditional-access-users-groups.png" alt-text="Selecting users or groups to apply the Conditional Access policy":::
5. Under **Cloud apps or actions > Include**, select **Select apps**. Search for **Azure Kubernetes Service** and select **Azure Kubernetes Service AAD Server**.
    :::image type="content" source="./media/managed-aad/conditional-access-apps.png" alt-text="Selecting Azure Kubernetes Service AD Server for applying the Conditional Access policy":::
6. Under **Access controls > Grant**, select **Grant access**, **Require device to be marked as compliant**, and **Require all the selected controls**.
    :::image type="content" source="./media/managed-aad/conditional-access-grant-compliant.png" alt-text="Selecting to only allow compliant devices for the Conditional Access policy":::
7. Confirm your settings, set **Enable policy** to **On**, and then select **Create**.
    :::image type="content" source="./media/managed-aad/conditional-access-enable-policy.png" alt-text="Enabling the Conditional Access policy":::

After creating the Conditional Access policy, verify it has been successfully listed:

1. Get the user credentials to access the cluster using the [`az aks get-credentials`][az-aks-get-credentials] command.

    ```azurecli-interactive
     az aks get-credentials --resource-group myResourceGroup --name myManagedCluster
    ```

2. Follow the instructions to sign in.

3. View the nodes in the cluster using the `kubectl get nodes` command.

    ```azurecli-interactive
    kubectl get nodes
    ```

4. In the Azure portal, navigate to **Azure Active Directory** and select **Enterprise applications** > **Activity** > **Sign-ins**.

5. Under the **Conditional Access** column you shoul see a status of **Success**. Select the event and then select **Conditional Access** tab. Your Conditional Access policy will be listed.
    :::image type="content" source="./media/managed-aad/conditional-access-sign-in-activity.png" alt-text="Screenshot that shows failed sign-in entry due to Conditional Access policy.":::

## Configure just-in-time cluster access with Azure AD and AKS

Another option for cluster access control is to use Privileged Identity Management (PIM) for just-in-time requests.

>[!NOTE]
> PIM is an Azure AD Premium capability requiring a Premium P2 SKU. For more on Azure AD SKUs, see the [pricing guide][aad-pricing].

Integrate just-in-time access requests with an AKS cluster using AKS-managed Azure AD integration:

1. In the Azure portal, go to **Azure Active Directory** and select **Properties**.
2. Note the value listed under **Tenant ID**. It will be referenced in a later step as `<tenant-id>`.
    :::image type="content" source="./media/managed-aad/jit-get-tenant-id.png" alt-text="In a web browser, the Azure portal screen for Azure Active Directory is shown with the tenant's ID highlighted.":::
3. Select **Groups** > **New group**.
    :::image type="content" source="./media/managed-aad/jit-create-new-group.png" alt-text="Shows the Azure portal Active Directory groups screen with the 'New Group' option highlighted.":::
4. Verify the group type **Security** is selected and specify a group name, such as **myJITGroup**. Under the option **Azure AD roles can be assigned to this group (Preview)**, select **Yes** and then select **Create**.
    :::image type="content" source="./media/managed-aad/jit-new-group-created.png" alt-text="Shows the Azure portal's new group creation screen.":::
5. On the **Groups** page, select the group you just created and note the Object ID. It will be referenced in a later step as `<object-id>`.
    :::image type="content" source="./media/managed-aad/jit-get-object-id.png" alt-text="Shows the Azure portal screen for the just-created group, highlighting the Object Id":::
6. Create the AKS cluster with AKS-managed Azure AD integration using the [`az aks create`][az-aks-create] command with the `--aad-admin-group-objects-ids` and `--aad-tenant-id parameters` and include the values noted in the steps earlier.

    ```azurecli-interactive
    az aks create -g myResourceGroup -n myManagedCluster --enable-aad --aad-admin-group-object-ids <object-id> --aad-tenant-id <tenant-id>
    ```

7. In the Azure portal, select **Activity** > **Privileged Access (Preview)** > **Enable Privileged Access**.
    :::image type="content" source="./media/managed-aad/jit-enabling-priv-access.png" alt-text="The Azure portal's Privileged access (Preview) page is shown, with 'Enable privileged access' highlighted":::
8. To grant access, select **Add assignments**.
    :::image type="content" source="./media/managed-aad/jit-add-active-assignment.png" alt-text="The Azure portal's Privileged access (Preview) screen after enabling is shown. The option to 'Add assignments' is highlighted.":::
9. From the **Select role** drop-down list, select the users and groups you want to grant cluster access. These assignments can be modified at any time by a group administrator. Then select **Next**.
    :::image type="content" source="./media/managed-aad/jit-adding-assignment.png" alt-text="The Azure portal's Add assignments Membership screen is shown, with a sample user selected to be added as a member. The option 'Next' is highlighted.":::
10. Under **Assignment type**, select **Active** and then specify the desired duration. Provide a justification and then select **Assign**. For more information about assignment types, see [Assign eligibility for a privileged access group (preview) in Privileged Identity Management][aad-assignments].
    :::image type="content" source="./media/managed-aad/jit-set-active-assignment-details.png" alt-text="The Azure portal's Add assignments Setting screen is shown. An assignment type of 'Active' is selected and a sample justification has been given. The option 'Assign' is highlighted.":::

Once the assignments have been made, verify just-in-time access is working by accessing the cluster:

1. Get the user credentials to access the cluster using the [`az aks get-credentials`][az-aks-get-credentials] command.

    ```azurecli-interactive
    az aks get-credentials --resource-group myResourceGroup --name myManagedCluster
    ```

2. Follow the steps to sign in.

3. Use the `kubectl get nodes` command to view the nodes in the cluster.

    ```azurecli-interactive
    kubectl get nodes
    ```

4. Note the authentication requirement and follow the steps to authenticate. If successful, you should see an output similar to the following  example output:

    ```output
    To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code AAAAAAAAA to authenticate.
    NAME                                STATUS   ROLES   AGE     VERSION
    aks-nodepool1-61156405-vmss000000   Ready    agent   6m36s   v1.18.14
    aks-nodepool1-61156405-vmss000001   Ready    agent   6m42s   v1.18.14
    aks-nodepool1-61156405-vmss000002   Ready    agent   6m33s   v1.18.14
    ```

### Apply just-in-time access at the namespace level

1. Integrate your AKS cluster with [Azure RBAC](manage-azure-rbac.md).
2. Associate the group you want to integrate with just-in-time access with a namespace in the cluster using the [`az role assignment create`][az-role-assignment-create] command.

    ```azurecli-interactive
    az role assignment create --role "Azure Kubernetes Service RBAC Reader" --assignee <AAD-ENTITY-ID> --scope $AKS_ID/namespaces/<namespace-name>
    ```

3. Associate the group you configured at the namespace level with PIM to complete the configuration.

### Troubleshooting

If `kubectl get nodes` returns an error similar to the following:

```output
Error from server (Forbidden): nodes is forbidden: User "aaaa11111-11aa-aa11-a1a1-111111aaaaa" cannot list resource "nodes" in API group "" at the cluster scope
```

Make sure the admin of the security group has given your account an *Active* assignment.

## Next steps

* Learn about [Azure RBAC integration for Kubernetes Authorization][azure-rbac-integration].
* Learn about [Azure AD integration with Kubernetes RBAC][azure-ad-rbac].
* Use [kubelogin](https://github.com/Azure/kubelogin) to access features for Azure authentication that aren't available in kubectl.
* Learn more about [AKS and Kubernetes identity concepts][aks-concepts-identity].
* Use [Azure Resource Manager (ARM) templates][aks-arm-template] to create AKS-managed Azure AD enabled clusters.

<!-- LINKS - external -->
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
[access-cluster]: #access-an-azure-ad-enabled-cluster
[aad-assignments]: ../active-directory/privileged-identity-management/groups-assign-member-owner.md#assign-an-owner-or-member-of-a-group
[az-aks-update]: /cli/azure/aks#az_aks_update
[az-role-assignment-create]: /cli/azure/role/assignment#az_role_assignment_create
