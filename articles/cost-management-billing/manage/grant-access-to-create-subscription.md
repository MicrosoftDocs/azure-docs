---
title: Grant access to create Azure Enterprise subscriptions
description: Learn how to give a user or service principal the ability to programmatically create Azure Enterprise subscriptions.
author: bandersmsft
ms.service: cost-management-billing
ms.subservice: billing
ms.reviewer: andalmia
ms.topic: conceptual
ms.date: 04/05/2023
ms.author: banders
---

# Grant access to create Azure Enterprise subscriptions (legacy)

As an Azure customer with an [Enterprise Agreement (EA)](https://azure.microsoft.com/pricing/enterprise-agreement/), you can give another user or service principal permission to create subscriptions billed to your account. In this article, you learn how to use [Azure role-based access control (Azure RBAC)](../../role-based-access-control/role-assignments-portal.md) to share the ability to create subscriptions, and how to audit subscription creations. You must have the Owner role on the account you wish to share.

> [!NOTE]
> - This API only works with the [legacy APIs for subscription creation](programmatically-create-subscription-preview.md). 
> - Unless you have a specific need to use the legacy APIs, you should use the information for the [latest GA version](programmatically-create-subscription-enterprise-agreement.md) about the latest API version. **See [Enrollment Account Role Assignments - Put](/rest/api/billing/2019-10-01-preview/enrollment-account-role-assignments/put) to grant permission to create EA subscriptions with the latest API**. 
> - If you're migrating to use the newer APIs, you must grant owner permissions again using [2019-10-01-preview](/rest/api/billing/2019-10-01-preview/enrollment-account-role-assignments/put). Your previous configuration that uses the following APIs doesn't automatically convert for use with newer APIs.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Grant access

To [create subscriptions under an enrollment account](programmatically-create-subscription-enterprise-agreement.md), users must have the Azure RBAC [Owner role](../../role-based-access-control/built-in-roles.md#owner) on that account. You can grant a user or a group of users the Azure RBAC Owner role on an enrollment account by following these steps:

1. Get the object ID of the enrollment account you want to grant access to

    To grant others the Azure RBAC Owner role on an enrollment account, you must either be the Account Owner or an Azure RBAC Owner of the account.

    # [REST](#tab/rest)

    Request to list all enrollment accounts you have access to:

    ```json
    GET https://management.azure.com/providers/Microsoft.Billing/enrollmentAccounts?api-version=2018-03-01-preview
    ```

    Azure responds with a list of all enrollment accounts you have access to:

    ```json
    {
      "value": [
        {
          "id": "/providers/Microsoft.Billing/enrollmentAccounts/747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "name": "747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "type": "Microsoft.Billing/enrollmentAccounts",
          "properties": {
            "principalName": "SignUpEngineering@contoso.com"
          }
        },
        {
          "id": "/providers/Microsoft.Billing/enrollmentAccounts/4cd2fcf6-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "name": "4cd2fcf6-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "type": "Microsoft.Billing/enrollmentAccounts",
          "properties": {
            "principalName": "BillingPlatformTeam@contoso.com"
          }
        }
      ]
    }
    ```

    Use the `principalName` property to identify the account that you want to grant Azure RBAC Owner access to. Copy the `name` of that account. For example, if you wanted to grant Azure RBAC Owner access to the SignUpEngineering@contoso.com enrollment account, you'd copy ```747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx```. It's the object ID of the enrollment account. Paste this value somewhere so that you can use it in the next step as `enrollmentAccountObjectId`.

    # [PowerShell](#tab/azure-powershell)

    Use the [Get-AzEnrollmentAccount](/powershell/module/az.billing/get-azenrollmentaccount) cmdlet to list all enrollment accounts you have access to. Select **Try it** to open [Azure Cloud Shell](https://shell.azure.com/). To paste the code, select and hold (or right-click) the shell windows, and the select **Paste**.

    ```azurepowershell-interactive
    Get-AzEnrollmentAccount
    ```

    Azure responds with a list of enrollment accounts you have access to:

    ```azurepowershell
    ObjectId                               | PrincipalName
    747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx   | SignUpEngineering@contoso.com
    4cd2fcf6-xxxx-xxxx-xxxx-xxxxxxxxxxxx   | BillingPlatformTeam@contoso.com
    ```

    Use the `principalName` property to identify the account you want to grant Azure RBAC Owner access to. Copy the `ObjectId` of that account. For example, if you wanted to grant Azure RBAC Owner access to the SignUpEngineering@contoso.com enrollment account, you'd copy ```747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx```. Paste this object ID somewhere so that you can use it in the next step as the `enrollmentAccountObjectId`.

    # [Azure CLI](#tab/azure-cli)

    Use the [az billing enrollment-account list](/cli/azure/billing) command to list all enrollment accounts you have access to. Select **Try it** to open [Azure Cloud Shell](https://shell.azure.com/). To paste the code, select and hold (or right-click) the shell windows, and the select **Paste**.

    ```azurecli-interactive
    az billing enrollment-account list
    ```

    Azure responds with a list of enrollment accounts you have access to:

    ```json
    [
      {
        "id": "/providers/Microsoft.Billing/enrollmentAccounts/747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "name": "747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "principalName": "SignUpEngineering@contoso.com",
        "type": "Microsoft.Billing/enrollmentAccounts",
      },
      {
        "id": "/providers/Microsoft.Billing/enrollmentAccounts/747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "name": "4cd2fcf6-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "principalName": "BillingPlatformTeam@contoso.com",
        "type": "Microsoft.Billing/enrollmentAccounts",
      }
    ]
    ```

    ---

    Use the `principalName` property to identify the account that you want to grant Azure RBAC Owner access to. Copy the `name` of that account. For example, if you wanted to grant Azure RBAC Owner access to the SignUpEngineering@contoso.com enrollment account, you'd copy ```747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx```. It's the object ID of the enrollment account. Paste this value somewhere so that you can use it in the next step as `enrollmentAccountObjectId`.

1. <a id="userObjectId"></a>Get object ID of the user or group you want to give the Azure RBAC Owner role to

    1. In the Azure portal, search on **Microsoft Entra ID**.
    1. If you want to grant a user access, select **Users** in the menu on the left. To give access to a group, select **Groups**.
    1. Select the User or Group you want to give the Azure RBAC Owner role to.
    1. If you selected a User, you'll find the object ID in the Profile page. If you selected a Group, the object ID will be in the Overview page. Copy the **ObjectID** by selecting the icon to the right of the text box. Paste it somewhere so that you can use it in the next step as `userObjectId`.

1. Grant the user or group the Azure RBAC Owner role on the enrollment account

    Using the values you collected in the first two steps, grant the user or group the Azure RBAC Owner role on the enrollment account.

    # [REST](#tab/rest-2)

    Run the following command, replacing ```<enrollmentAccountObjectId>``` with the `name` you copied in the first step (```747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx```). Replace ```<userObjectId>``` with the object ID you copied from the second step.

    ```json
    PUT  https://management.azure.com/providers/Microsoft.Billing/enrollmentAccounts/<enrollmentAccountObjectId>/providers/Microsoft.Authorization/roleAssignments/<roleAssignmentGuid>?api-version=2015-07-01

    {
      "properties": {
        "roleDefinitionId": "/providers/Microsoft.Billing/enrollmentAccounts/<enrollmentAccountObjectId>/providers/Microsoft.Authorization/roleDefinitions/<ownerRoleDefinitionId>",
        "principalId": "<userObjectId>"
      }
    }
    ```

    When the Owner role is successfully assigned at the enrollment account scope, Azure responds with information of the role assignment:

    ```json
    {
      "properties": {
        "roleDefinitionId": "/providers/Microsoft.Billing/enrollmentAccounts/providers/Microsoft.Authorization/roleDefinitions/<ownerRoleDefinitionId>",
        "principalId": "<userObjectId>",
        "scope": "/providers/Microsoft.Billing/enrollmentAccounts/747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "createdOn": "2018-03-05T08:36:26.4014813Z",
        "updatedOn": "2018-03-05T08:36:26.4014813Z",
        "createdBy": "<assignerObjectId>",
        "updatedBy": "<assignerObjectId>"
      },
      "id": "/providers/Microsoft.Billing/enrollmentAccounts/providers/Microsoft.Authorization/roleDefinitions/<ownerRoleDefinitionId>",
      "type": "Microsoft.Authorization/roleAssignments",
      "name": "<roleAssignmentGuid>"
    }
    ```

    # [PowerShell](#tab/azure-powershell-2)

    Run the following [New-AzRoleAssignment](../../role-based-access-control/role-assignments-powershell.md) command, replacing ```<enrollmentAccountObjectId>``` with the `ObjectId` collected in the first step (```747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx```). Replace ```<userObjectId>``` with the object ID collected in the second step.

    ```azurepowershell-interactive
    New-AzRoleAssignment -RoleDefinitionName Owner -ObjectId <userObjectId> -Scope /providers/Microsoft.Billing/enrollmentAccounts/<enrollmentAccountObjectId>
    ```

    # [Azure CLI](#tab/azure-cli-2)

    Run the following [az role assignment create](../../role-based-access-control/role-assignments-cli.md) command, replacing ```<enrollmentAccountObjectId>``` with the `name` you copied in the first step (```747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx```). Replace ```<userObjectId>``` with the object ID collected in the second step.

    ```azurecli-interactive
    az role assignment create --role Owner --assignee-object-id <userObjectId> --scope /providers/Microsoft.Billing/enrollmentAccounts/<enrollmentAccountObjectId>
    ```

    Once a user becomes an Azure RBAC Owner for your enrollment account, they can [programmatically create subscriptions](programmatically-create-subscription-enterprise-agreement.md) under it. A subscription created by a delegated user still has the original Account Owner as Service Admin, but it also has the delegated user as an Azure RBAC Owner by default.

    ---

## Audit who created subscriptions using activity logs

To track the subscriptions created via this API, use the [Tenant Activity Log API](/rest/api/monitor/tenantactivitylogs). It's currently not possible to use PowerShell, CLI, or Azure portal to track subscription creation.

1. As a tenant admin of the Microsoft Entra tenant, [elevate access](../../role-based-access-control/elevate-access-global-admin.md) then assign a Reader role to the auditing user over the scope `/providers/microsoft.insights/eventtypes/management`. This access is available in the [Reader](../../role-based-access-control/built-in-roles.md#reader) role, the [Monitoring contributor](../../role-based-access-control/built-in-roles.md#monitoring-contributor) role, or a [custom role](../../role-based-access-control/custom-roles.md).
1. As the auditing user, call the [Tenant Activity Log API](/rest/api/monitor/tenantactivitylogs) to see subscription creation activities. Example:

    ```
    GET "/providers/Microsoft.Insights/eventtypes/management/values?api-version=2015-04-01&$filter=eventTimestamp ge '{greaterThanTimeStamp}' and eventTimestamp le '{lessThanTimestamp}' and eventChannels eq 'Operation' and resourceProvider eq 'Microsoft.Subscription'"
    ```

To conveniently call this API from the command line, try [ARMClient](https://github.com/projectkudu/ARMClient).

## Next steps

* Now that the user or service principal has permission to create a subscription, you can use that identity to [programmatically create Azure Enterprise subscriptions](programmatically-create-subscription-enterprise-agreement.md).
* For an example on creating subscriptions using .NET, see [sample code on GitHub](https://github.com/Azure-Samples/create-azure-subscription-dotnet-core).
* To learn more about Azure Resource Manager and its APIs, see [Azure Resource Manager overview](../../azure-resource-manager/management/overview.md).
* To learn more about managing large numbers of subscriptions using management groups, see [Organize your resources with Azure management groups](../../governance/management-groups/overview.md)
* To see a comprehensive best practice guidance for large organizations on subscription governance, see [Azure enterprise scaffold - prescriptive subscription governance](/azure/architecture/cloud-adoption-guide/subscription-governance)
