---
title: Add an existing Azure subscription to your tenant
description: Instructions about how to add an existing Azure subscription to your Microsoft Entra tenant.
services: active-directory
author: barclayn
manager: amycolannino

ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: how-to
ms.date: 09/12/2023
ms.author: barclayn
ms.reviewer: jeffsta
---
# Associate or add an Azure subscription to your Microsoft Entra tenant

All Azure subscriptions have a trust relationship with a Microsoft Entra tenant. Subscriptions rely on this tenant (directory) to authenticate and authorize security principals and devices. When a subscription expires, the trusted instance remains, but the security principals lose access to Azure resources. Subscriptions can only trust a single directory while one Microsoft Entra tenant may be trusted by multiple subscriptions.

When a user signs up for a Microsoft cloud service, a new Microsoft Entra tenant is created and the user is made a Global Administrator. However, when an owner of a subscription joins their subscription to an existing tenant, the owner isn't assigned to the Global Administrator role.

While users may only have a single authentication *home* directory, users may participate as guests in multiple directories. You can see both the home and guest directories for each user in Microsoft Entra ID.

:::image type="content" source="media/how-subscriptions-associated-directory/trust-relationship.png" alt-text="Screenshot that shows the trust relationship between Azure subscriptions and Azure active directories.":::

> [!IMPORTANT]
> When a subscription is associated with a different directory, users who have roles assigned using [Azure role-based access control](../../role-based-access-control/role-assignments-portal.md) lose their access. Classic subscription administrators, including Service Administrator and Co-Administrators, also lose access.
>
> Moving your Azure Kubernetes Service (AKS) cluster to a different subscription, or moving the cluster-owning subscription to a new tenant, causes the cluster to lose functionality due to lost role assignments and service principal's rights. For more information about AKS, see [Azure Kubernetes Service (AKS)](../../aks/index.yml).

## Before you begin

Before you can associate or add your subscription, do the following steps:

- Review the following list of changes that will occur after you associate or add your subscription, and how you might be affected:    
    - Users that have been assigned roles using Azure RBAC will lose their access.
    - Service Administrator and Co-Administrators will lose access.
    - If you have any key vaults, they'll be inaccessible, and you'll have to fix them after association.
    - If you have any managed identities for resources such as Virtual Machines or Logic Apps, you must re-enable or recreate them after the association.
    - If you have a registered Azure Stack, you'll have to re-register it after association.
  
  For more information, see [Transfer an Azure subscription to a different Microsoft Entra directory](../../role-based-access-control/transfer-subscription.md).

- Sign in using an account that:
    - Has an [Owner](../../role-based-access-control/built-in-roles.md#owner) role assignment for the subscription. For information about how to assign the Owner role, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).
    - Exists in both the current directory and in the new directory. The current directory is associated with the subscription. You'll associate the new directory with the subscription. For more information about getting access to another directory, see [Add Microsoft Entra B2B collaboration users in the Azure portal](../external-identities/add-users-administrator.md).
    - Make sure that you're not using an Azure Cloud Service Providers (CSP) subscription (MS-AZR-0145P, MS-AZR-0146P, MS-AZR-159P), a Microsoft Internal subscription (MS-AZR-0015P), or a Microsoft Azure for Students Starter subscription (MS-AZR-0144P).

## Associate a subscription to a directory<a name="to-associate-an-existing-subscription-to-your-azure-ad-directory"></a>

To associate an existing subscription with your Microsoft Entra ID, follow these steps:

1. Sign to the [Azure portal](https://portal.azure.com) with the [Owner](../../role-based-access-control/built-in-roles.md#owner) role assignment for the subscription.

1. Browse to **Subscriptions**. 

1. Select the name of the subscription you want to use.

1. Select **Change directory**.

   :::image type="content" source="media/how-subscriptions-associated-directory/change-directory-in-azure-subscriptions.png" alt-text="Screenshot that shows the Subscriptions page, with the Change directory option highlighted.":::

1. Review any warnings that appear, and then select **Change**.

   :::image type="content" source="media/how-subscriptions-associated-directory/edit-directory-ui.png" alt-text="Screenshot that shows the Change the directory page with a sample directory and the Change button highlighted.":::

   After the directory is changed for the subscription, you'll get a success message.

1. Select **Switch directories** on the subscription page to go to your new directory.

   :::image type="content" source="media/how-subscriptions-associated-directory/directory-switcher.png" alt-text="Screenshot that shows the Directory switcher page with sample information.":::

   It can take several hours for everything to show up properly. If it seems to be taking too long, check the **Global subscription filter**. Make sure the moved subscription isn't hidden. You may need to sign out of the Azure portal and sign back in to see the new directory.

Changing the subscription directory is a service-level operation, so it doesn't affect subscription billing ownership. To delete the original directory, you must transfer the subscription billing ownership to a new Account Admin. To learn more about transferring billing ownership, see [Transfer ownership of an Azure subscription to another account](../../cost-management-billing/manage/billing-subscription-transfer.md).

## Post-association steps

After you associate a subscription with a different directory, you might need to do the following tasks to resume operations:

- If you have any key vaults, you must change the key vault tenant ID. For more information, see [Change a key vault tenant ID after a subscription move](../../key-vault/general/move-subscription.md).

- If you used system-assigned Managed Identities for resources, you must re-enable these identities. If you used user-assigned Managed Identities, you must re-create these identities. After re-enabling or recreating the Managed Identities, you must re-establish the permissions assigned to those identities. For more information, see [What are managed identities for Azure resources?](../managed-identities-azure-resources/overview.md).

- If you've registered an Azure Stack using this subscription, you must re-register. For more information, see [Register Azure Stack Hub with Azure](/azure-stack/operator/azure-stack-registration).

- For more information, see [Transfer an Azure subscription to a different Microsoft Entra directory](../../role-based-access-control/transfer-subscription.md).

## Next steps

- To create a new Microsoft Entra tenant, see [Quickstart: Create a new tenant in Microsoft Entra ID](./create-new-tenant.md).

- To learn more about how Microsoft Azure controls resource access, see [Azure roles, Microsoft Entra roles, and classic subscription administrator roles](../../role-based-access-control/rbac-and-directory-admin-roles.md).

- To learn more about how to assign roles in Microsoft Entra ID, see [Assign administrator and non-administrator roles to users with Microsoft Entra ID](./how-subscriptions-associated-directory.md).
