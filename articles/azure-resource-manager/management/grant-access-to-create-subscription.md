---
title: Grant access to create Azure Enterprise subscriptions
description: Learn how to give a user or service principal the ability to programmatically create Azure Enterprise subscriptions.
author: jureid
manager: jureid
ms.topic: conceptual
ms.date: 05/23/2019
ms.author: jureid
---

# Grant access to create Azure Enterprise subscriptions (preview)

As an Azure customer on [Enterprise Agreement (EA)](https://azure.microsoft.com/pricing/enterprise-agreement/), you can give another user or service principal permission to create subscriptions billed to your account. In this article, you learn how to use [Role-Based Access Control (RBAC)](../../active-directory/role-based-access-control-configure.md) to share the ability to create subscriptions, and how to audit subscription creations. You must have the Owner role on the account you wish to share.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Grant access

To [create subscriptions under an enrollment account](programmatically-create-subscription.md), users must have the [RBAC Owner role](../../role-based-access-control/built-in-roles.md#owner) on that account. You can grant a user or a group of users the RBAC Owner role on an enrollment account by following these steps:

1. Get the object ID of the enrollment account you want to grant access to

    To grant others the RBAC Owner role on an enrollment account, you must either be the Account Owner or an RBAC Owner of the account.

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

    Use the `principalName` property to identify the account that you want to grant RBAC Owner access to. Copy the `name` of that account. For example, if you wanted to grant RBAC Owner access to the SignUpEngineering@contoso.com enrollment account, you'd copy ```747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx```. This is the object ID of the enrollment account. Paste this value somewhere so that you can use it in the next step as `enrollmentAccountObjectId`.

    # [PowerShell](#tab/azure-powershell)

    Use the [Get-AzEnrollmentAccount](/powershell/module/az.billing/get-azenrollmentaccount) cmdlet to list all enrollment accounts you have access to. Select **Try it** to open [Azure Cloud Shell](https://shell.azure.com/). To paste the code, right-click the shell windows, and the select **Paste**.

    ```azurepowershell-interactive
    Get-AzEnrollmentAccount
    ```

    Azure responds with a list of enrollment accounts you have access to:

    ```azurepowershell
    ObjectId                               | PrincipalName
    747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx   | SignUpEngineering@contoso.com
    4cd2fcf6-xxxx-xxxx-xxxx-xxxxxxxxxxxx   | BillingPlatformTeam@contoso.com
    ```

    Use the `principalName` property to identify the account you want to grant RBAC Owner access to. Copy the `ObjectId` of that account. For example, if you wanted to grant RBAC Owner access to the SignUpEngineering@contoso.com enrollment account, you'd copy ```747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx```. Paste this object ID somewhere so that you can use it in the next step as the `enrollmentAccountObjectId`.

    # [Azure CLI](#tab/azure-cli)

    Use the [az billing enrollment-account list](https://aka.ms/EASubCreationPublicPreviewCLI) command to list all enrollment accounts you have access to. Select **Try it** to open [Azure Cloud Shell](https://shell.azure.com/). To paste the code, right-click the shell windows, and the select **Paste**.

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

    Use the `principalName` property to identify the account that you want to grant RBAC Owner access to. Copy the `name` of that account. For example, if you wanted to grant RBAC Owner access to the SignUpEngineering@contoso.com enrollment account, you'd copy ```747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx```. This is the object ID of the enrollment account. Paste this value somewhere so that you can use it in the next step as `enrollmentAccountObjectId`.

1. <a id="userObjectId"></a>Get object ID of the user or group you want to give the RBAC Owner role to

    1. In the Azure portal, search on **Azure Active Directory**.
    1. If you want to grant a user access, click on **Users** in the menu on the left. If you want to grant access to a group, click **Groups**.
    1. Select the User or Group you want to give the RBAC Owner role to.
    1. If you selected a User, you'll find the object ID in the Profile page. If you selected a Group, the object ID will be in the Overview page. Copy the **ObjectID** by clicking the icon to the right of the text box. Paste this somewhere so that you can use it in the next step as `userObjectId`.

1. Grant the user or group the RBAC Owner role on the enrollment account

    Using the values you collected in the first two steps, grant the user or group the RBAC Owner role on the enrollment account.

    # [REST](#tab/rest-2)

    Run the following command, replacing ```<enrollmentAccountObjectId>``` with the `name` you copied in the first step (```747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx```). Replace ```<userObjectId>``` with the object ID you copied from the second step.

    ```json
    PUT  https://management.azure.com/providers/Microsoft.Billing/enrollmentAccounts/<enrollmentAccountObjectId>/providers/Microsoft.Authorization/roleAssignments/<roleAssignmentGuid>?api-version=2015-07-01

    {
      "properties": {
        "roleDefinitionId": "/providers/Microsoft.Billing/enrollmentAccounts/providers/Microsoft.Authorization/roleDefinitions/<ownerRoleDefinitionId>",
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

    Run the following [New-AzRoleAssignment](../../active-directory/role-based-access-control-manage-access-powershell.md) command, replacing ```<enrollmentAccountObjectId>``` with the `ObjectId` collected in the first step (```747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx```). Replace ```<userObjectId>``` with the object ID collected in the second step.

    ```azurepowershell-interactive
    New-AzRoleAssignment -RoleDefinitionName Owner -ObjectId <userObjectId> -Scope /providers/Microsoft.Billing/enrollmentAccounts/<enrollmentAccountObjectId>
    ```

    # [Azure CLI](#tab/azure-cli-2)

    Run the following [az role assignment create](../../active-directory/role-based-access-control-manage-access-azure-cli.md) command, replacing ```<enrollmentAccountObjectId>``` with the `name` you copied in the first step (```747ddfe5-xxxx-xxxx-xxxx-xxxxxxxxxxxx```). Replace ```<userObjectId>``` with the object ID collected in the second step.

    ```azurecli-interactive
    az role assignment create --role Owner --assignee-object-id <userObjectId> --scope /providers/Microsoft.Billing/enrollmentAccounts/<enrollmentAccountObjectId>
    ```

    Once a user becomes an RBAC Owner for your enrollment account, they can [programmatically create subscriptions](programmatically-create-subscription.md) under it. A subscription created by a delegated user still has the original Account Owner as Service Admin, but it also has the delegated user as an RBAC Owner by default.

    ---

## Audit who created subscriptions using activity logs

To track the subscriptions created via this API, use the [Tenant Activity Log API](/rest/api/monitor/tenantactivitylogs). It's currently not possible to use PowerShell, CLI, or Azure portal to track subscription creation.

1. As a tenant admin of the Azure AD tenant, [elevate access](../../active-directory/role-based-access-control-tenant-admin-access.md) then assign a Reader role to the auditing user over the scope `/providers/microsoft.insights/eventtypes/management`.
1. As the auditing user, call the [Tenant Activity Log API](/rest/api/monitor/tenantactivitylogs) to see subscription creation activities. Example:

    ```
    GET "/providers/Microsoft.Insights/eventtypes/management/values?api-version=2015-04-01&$filter=eventTimestamp ge '{greaterThanTimeStamp}' and eventTimestamp le '{lessThanTimestamp}' and eventChannels eq 'Operation' and resourceProvider eq 'Microsoft.Subscription'"
    ```

To conveniently call this API from the command line, try [ARMClient](https://github.com/projectkudu/ARMClient).

## Next steps

* Now that the user or service principal has permission to create a subscription, you can use that identity to [programmatically create Azure Enterprise subscriptions](programmatically-create-subscription.md).
* For an example on creating subscriptions using .NET, see [sample code on GitHub](https://github.com/Azure-Samples/create-azure-subscription-dotnet-core).
* To learn more about Azure Resource Manager and its APIs, see [Azure Resource Manager overview](overview.md).
* To learn more about managing large numbers of subscriptions using management groups, see [Organize your resources with Azure management groups](../../governance/management-groups/overview.md)
* To see a comprehensive best practice guidance for large organizations on subscription governance, see [Azure enterprise scaffold - prescriptive subscription governance](/azure/architecture/cloud-adoption-guide/subscription-governance)
