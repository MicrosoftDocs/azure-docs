---
title: Cluster access control with AKS-managed Microsoft Entra integration
description: Learn how to access clusters when integrating Microsoft Entra ID in your Azure Kubernetes Service (AKS) clusters.
ms.topic: article
ms.date: 04/20/2023
ms.custom: devx-track-azurecli
---

# Cluster access control with AKS-managed Microsoft Entra integration

When you integrate Microsoft Entra ID with your AKS cluster, you can use [Conditional Access][aad-conditional-access] or Privileged Identity Management (PIM) for just-in-time requests to control access to your cluster. This article shows you how to enable Conditional Access and PIM on your AKS clusters.

> [!NOTE]
> Microsoft Entra Conditional Access and Privileged Identity Management are Microsoft Entra ID P1 or P2 capabilities requiring a Premium P2 SKU. For more on Microsoft Entra ID SKUs, see the [pricing guide][aad-pricing].

## Before you begin

* See [AKS-managed Microsoft Entra integration](./managed-azure-ad.md) for an overview and setup instructions.

<a name='use-conditional-access-with-azure-ad-and-aks'></a>

## Use Conditional Access with Microsoft Entra ID and AKS

1. In the Azure portal, go to the **Microsoft Entra ID** page and select **Enterprise applications**.
2. Select **Conditional Access** > **Policies** > **New policy**.

    :::image type="content" source="./media/managed-aad/conditional-access-new-policy.png" alt-text="Screenshot of adding a Conditional Access policy." lightbox="./media/managed-aad/conditional-access-new-policy.png":::

3. Enter a name for the policy, such as *aks-policy*.

4. Under **Assignments**, select **Users and groups**. Choose the users and groups you want to apply the policy to. In this example, choose the same Microsoft Entra group that has administrator access to your cluster.

    :::image type="content" source="./media/managed-aad/conditional-access-users-groups.png" alt-text="Screenshot of selecting users or groups to apply the Conditional Access policy." lightbox="./media/managed-aad/conditional-access-users-groups.png":::

5. Under **Cloud apps or actions** > **Include**, select **Select apps**. Search for **Azure Kubernetes Service** and select **Azure Kubernetes Service Microsoft Entra Server**.

    :::image type="content" source="./media/managed-aad/conditional-access-apps.png" alt-text="Screenshot of selecting Azure Kubernetes Service AD Server for applying the Conditional Access policy." lightbox="./media/managed-aad/conditional-access-apps.png":::

6. Under **Access controls** > **Grant**, select **Grant access**, **Require device to be marked as compliant**, and **Require all the selected controls**.

    :::image type="content" source="./media/managed-aad/conditional-access-grant-compliant.png" alt-text="Screenshot of selecting to only allow compliant devices for the Conditional Access policy." lightbox="./media/managed-aad/conditional-access-grant-compliant.png" :::

7. Confirm your settings, set **Enable policy** to **On**, and then select **Create**.

    :::image type="content" source="./media/managed-aad/conditional-access-enable-policy.png" alt-text="Screenshot of enabling the Conditional Access policy." lightbox="./media/managed-aad/conditional-access-enable-policy.png":::

### Verify your Conditional Access policy has been successfully listed

1. Get the user credentials to access the cluster using the [`az aks get-credentials`][az-aks-get-credentials] command.

    ```azurecli-interactive
     az aks get-credentials --resource-group myResourceGroup --name myManagedCluster
    ```

2. Follow the instructions to sign in.

3. View the nodes in the cluster using the `kubectl get nodes` command.

    ```azurecli-interactive
    kubectl get nodes
    ```

4. In the Azure portal, navigate to **Microsoft Entra ID** and select **Enterprise applications** > **Activity** > **Sign-ins**.

5. Under the **Conditional Access** column you should see a status of *Success*. Select the event and then select the **Conditional Access** tab. Your Conditional Access policy will be listed.

    :::image type="content" source="./media/managed-aad/conditional-access-sign-in-activity.png" alt-text="Screenshot that shows failed sign-in entry due to Conditional Access policy." lightbox="./media/managed-aad/conditional-access-sign-in-activity.png":::

<a name='configure-just-in-time-cluster-access-with-azure-ad-and-aks'></a>

## Configure just-in-time cluster access with Microsoft Entra ID and AKS

1. In the Azure portal, go to **Microsoft Entra ID** and select **Properties**.

2. Note the value listed under **Tenant ID**. It will be referenced in a later step as `<tenant-id>`.

    :::image type="content" source="./media/managed-aad/jit-get-tenant-id.png" alt-text="Screenshot of the Azure portal screen for Microsoft Entra ID with the tenant's ID highlighted." lightbox="./media/managed-aad/jit-get-tenant-id.png":::

3. Select **Groups** > **New group**.

    :::image type="content" source="./media/managed-aad/jit-create-new-group.png" alt-text="Screenshot of the Azure portal Active Directory groups screen with the New Group option highlighted." lightbox="./media/managed-aad/jit-create-new-group.png":::

4. Verify the group type **Security** is selected and specify a group name, such as *myJITGroup*. Under the option **Microsoft Entra roles can be assigned to this group (Preview)**, select **Yes** and then select **Create**.

    :::image type="content" source="./media/managed-aad/jit-new-group-created.png" alt-text="Screenshot of the new group creation screen in the Azure portal." lightbox="./media/managed-aad/jit-new-group-created.png":::

5. On the **Groups** page, select the group you just created and note the Object ID. It will be referenced in a later step as `<object-id>`.

    :::image type="content" source="./media/managed-aad/jit-get-object-id.png" alt-text="Screenshot of the Azure portal screen for the just-created group with the Object ID highlighted." lightbox="./media/managed-aad/jit-get-object-id.png":::

6. Create the AKS cluster with AKS-managed Microsoft Entra integration using the [`az aks create`][az-aks-create] command with the `--aad-admin-group-objects-ids` and `--aad-tenant-id parameters` and include the values noted in the steps earlier.

    ```azurecli-interactive
    az aks create -g myResourceGroup -n myManagedCluster --enable-aad --aad-admin-group-object-ids <object-id> --aad-tenant-id <tenant-id>
    ```

7. In the Azure portal, select **Activity** > **Privileged Access (Preview)** > **Enable Privileged Access**.

    :::image type="content" source="./media/managed-aad/jit-enabling-priv-access.png" alt-text="Screenshot of the Privileged access (Preview) page in the Azure portal with Enable privileged access highlighted." lightbox="./media/managed-aad/jit-enabling-priv-access.png":::

8. To grant access, select **Add assignments**.

    :::image type="content" source="./media/managed-aad/jit-add-active-assignment.png" alt-text="Screenshot of the Privileged access (Preview) screen in the Azure portal after enabling. The option to Add assignments is highlighted." lightbox="./media/managed-aad/jit-add-active-assignment.png":::

9. From the **Select role** drop-down list, select the users and groups you want to grant cluster access. These assignments can be modified at any time by a group administrator. Then select **Next**.

    :::image type="content" source="./media/managed-aad/jit-adding-assignment.png" alt-text="Screenshot of the Add assignments Membership screen in the Azure portal with a sample user selected to be added as a member. The Next option is highlighted." lightbox="./media/managed-aad/jit-adding-assignment.png":::

10. Under **Assignment type**, select **Active** and then specify the desired duration. Provide a justification and then select **Assign**.

    :::image type="content" source="./media/managed-aad/jit-set-active-assignment-details.png" alt-text="Screenshot of the Add assignments Setting screen in the Azure portal. An assignment type of Active is selected and a sample justification has been given. The Assign option is highlighted." lightbox="./media/managed-aad/jit-set-active-assignment-details.png":::

For more information about assignment types, see [Assign eligibility for a privileged access group (preview) in Privileged Identity Management][aad-assignments].

### Verify just-in-time access is working by accessing the cluster

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

## Troubleshooting

If `kubectl get nodes` returns an error similar to the following:

```output
Error from server (Forbidden): nodes is forbidden: User "aaaa11111-11aa-aa11-a1a1-111111aaaaa" cannot list resource "nodes" in API group "" at the cluster scope
```

Make sure the admin of the security group has given your account an *Active* assignment.

## Next steps

* Use [kubelogin](https://github.com/Azure/kubelogin) to access features for Azure authentication that aren't available in kubectl.

<!-- LINKS - External -->
[aad-pricing]: https://azure.microsoft.com/pricing/details/active-directory/

<!-- LINKS - Internal -->
[aad-conditional-access]: ../active-directory/conditional-access/overview.md
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[az-role-assignment-create]: /cli/azure/role/assignment#az_role_assignment_create
[aad-assignments]: ../active-directory/privileged-identity-management/groups-assign-member-owner.md#assign-an-owner-or-member-of-a-group
[az-aks-create]: /cli/azure/aks#az_aks_create
