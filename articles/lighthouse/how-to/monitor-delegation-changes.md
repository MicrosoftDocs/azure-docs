---
title: Monitor delegation changes in your managing tenant
description: Learn how to monitor delegation activity from customer tenants to your managing tenant. 
ms.date: 02/18/2021
ms.topic: how-to
---

# Monitor delegation changes in your managing tenant

As a service provider, you may want to be aware when customer subscriptions or resource groups are delegated to your tenant through [Azure Lighthouse](../overview.md), or when previously delegated resources are removed.

In the managing tenant, the [Azure activity log](../../azure-monitor/essentials/platform-logs-overview.md) tracks delegation activity at the tenant level. This logged activity includes any added or removed delegations from customer tenants.

This topic explains the permissions needed to monitor delegation activity to your tenant (across all of your customers). It also includes a sample script that shows one method for querying and reporting on this data.

> [!IMPORTANT]
> All of these steps must be performed in your managing tenant, rather than in any customer tenants.
>
> Though we refer to service providers and customers in this topic, [enterprises managing multiple tenants](../concepts/enterprise.md) can use the same processes.

## Enable access to tenant-level data

To access tenant-level Activity Log data, an account must be assigned the [Monitoring Reader](../../role-based-access-control/built-in-roles.md#monitoring-reader) Azure built-in role at root scope (/). This assignment must be performed by a user who has the Global Administrator role with additional elevated access.

### Elevate access for a Global Administrator account

To assign a role at root scope (/), you will need to have the Global Administrator role with elevated access. This elevated access should be added only when you need to make the role assignment, then removed when you are done.

For detailed instructions on adding and removing elevation, see [Elevate access to manage all Azure subscriptions and management groups](../../role-based-access-control/elevate-access-global-admin.md).

After you elevate your access, your account will have the User Access Administrator role in Azure at root scope. This role assignment allows you to view all resources and assign access in any subscription or management group in the directory, as well as to make role assignments at root scope.

### Assign the Monitoring Reader role at root scope

Once you have elevated your access, you can assign the appropriate permissions to an account so that it can query tenant-level activity log data. This account will need to have the [Monitoring Reader](../../role-based-access-control/built-in-roles.md#monitoring-reader) Azure built-in role assigned at the root scope of your managing tenant.

> [!IMPORTANT]
> Granting a role assignment at root scope means that the same permissions will apply to every resource in the tenant. Because this is a broad level of access, you may wish to [assign this role to a service principal account and using that account to query data](#use-a-service-principal-account-to-query-the-activity-log). You can also assign the Monitoring Reader role at root scope to individual users or to user groups so that they can [view delegation information directly in the Azure portal](#view-delegation-changes-in-the-azure-portal). If you do so, be aware that this is a broad level of access which should be limited to the fewest number of users possible.

Use one of the following methods to make the root scope assignment.

#### PowerShell

```azurepowershell-interactive
# Log in first with Connect-AzAccount if you're not using Cloud Shell

New-AzRoleAssignment -SignInName <yourLoginName> -Scope "/" -RoleDefinitionName "Monitoring Reader"  -ObjectId <objectId> 
```

#### Azure CLI

```azurecli-interactive
# Log in first with az login if you're not using Cloud Shell

az role assignment create --assignee 00000000-0000-0000-0000-000000000000 --role "Monitoring Reader" --scope "/"
```

### Remove elevated access for the Global Administrator account

After you've assigned the Monitoring Reader role at root scope to the desired account, be sure to [remove the elevated access](../../role-based-access-control/elevate-access-global-admin.md#remove-elevated-access) for the Global Administrator account, as this level of access will no longer be needed.

## View delegation changes in the Azure portal

Users who has been assigned the Monitoring Reader role at root scope can view delegation changes directly in the Azure portal.

1. Navigate to the **My customers** page, then select **Activity log** from the left-hand navigation menu.
1. Ensure that **Directory Activity** is selected in the filter near the top of the screen.

A list of delegation changes will appear. You can select **Edit columns** to show or hide the **Status**, **Event category**, **Time**, **Time stamp**, **Subscription**, **Event initiated by**, **Resource group**, **Resource type**, and **Resource** values.

:::image type="content" source="../media/delegation-activity-portal.jpg" alt-text="Screenshot of delegation changes in the Azure portal.":::

## Use a service principal account to query the activity log

Because the Monitoring Reader role at root scope is such a broad level of access, you may wish to assign the role to a service principal account and use that account to query data using the script below.

> [!IMPORTANT]
> Currently, tenants with a large amount of delegation activity may run into errors when querying this data.

When using a service principal account to query the activity log, we recommend the following best practices:

- [Create a new service principal account](../../active-directory/develop/howto-create-service-principal-portal.md) to be used only for this function, rather than assigning this role to an existing service principal used for other automation.
- Be sure that this service principal does not have access to any delegated customer resources.
- [Use a certificate to authenticate](../../active-directory/develop/howto-create-service-principal-portal.md#authentication-two-options) and [store it securely in Azure Key Vault](../../key-vault/general/security-features.md).
- Limit the users who have access to act on behalf of the service principal.

Once you've created a new service principal account with Monitoring Reader access to the root scope of your managing tenant, you can use it to query and report on delegation activity in your tenant.

[This Azure PowerShell script](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/tools/monitor-delegation-changes) can be used to query the past 1 day of activity and reports on any added or removed delegations (or attempts that were not successful). It queries the [Tenant Activity Log](/rest/api/monitor/TenantActivityLogs/List) data, then constructs the following values to report on delegations that are added or removed:

- **DelegatedResourceId**: The ID of the delegated subscription or resource group
- **CustomerTenantId**: The customer tenant ID
- **CustomerSubscriptionId**: The subscription ID that was delegated or that contains the resource group that was delegated
- **CustomerDelegationStatus**: The status change for the delegated resource (succeeded or failed)
- **EventTimeStamp**: The date and time at which the delegation change was logged

When querying this data, keep in mind:

- If multiple resource groups are delegated in a single deployment, separate entries will be returned for each resource group.
- Changes made to a previous delegation (such as updating the permission structure) will be logged as an added delegation.
- As noted above, an account must have the Monitoring Reader Azure built-in role at root scope (/) in order to access this tenant-level data.
- You can use this data in your own workflows and reporting. For example, you can use the [HTTP Data Collector API (public preview)](../../azure-monitor/logs/data-collector-api.md) to log data to Azure Monitor from a REST API client, then use [action groups](../../azure-monitor/alerts/action-groups.md) to create notifications or alerts.

```azurepowershell-interactive
# Log in first with Connect-AzAccount if you're not using Cloud Shell

# Azure Lighthouse: Query Tenant Activity Log for registered/unregistered delegations for the last 1 day

$GetDate = (Get-Date).AddDays((-1))

$dateFormatForQuery = $GetDate.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")

# Getting Azure context for the API call
$currentContext = Get-AzContext

# Fetching new token
$azureRmProfile = [Microsoft.Azure.Commands.Common.Authentication.Abstractions.AzureRmProfileProvider]::Instance.Profile
$profileClient = [Microsoft.Azure.Commands.ResourceManager.Common.RMProfileClient]::new($azureRmProfile)
$token = $profileClient.AcquireAccessToken($currentContext.Tenant.Id)

$listOperations = @{
    Uri     = "https://management.azure.com/providers/microsoft.insights/eventtypes/management/values?api-version=2015-04-01&`$filter=eventTimestamp ge '$($dateFormatForQuery)'"
    Headers = @{
        Authorization  = "Bearer $($token.AccessToken)"
        'Content-Type' = 'application/json'
    }
    Method  = 'GET'
}
$list = Invoke-RestMethod @listOperations

# First link can be empty - and point to a next link (or potentially multiple pages)
# While you get more data - continue fetching and add result
while($list.nextLink){
    $list2 = Invoke-RestMethod $list.nextLink -Headers $listOperations.Headers -Method Get
    $data+=$list2.value;
    $list.nextLink = $list2.nextlink;
}

$showOperations = $data;

if ($showOperations.operationName.value -eq "Microsoft.Resources/tenants/register/action") {
    $registerOutputs = $showOperations | Where-Object -FilterScript { $_.eventName.value -eq "EndRequest" -and $_.resourceType.value -and $_.operationName.value -eq "Microsoft.Resources/tenants/register/action" }
    foreach ($registerOutput in $registerOutputs) {
        $eventDescription = $registerOutput.description | ConvertFrom-Json;
    $registerOutputdata = [pscustomobject]@{
        Event                    = "An Azure customer has registered delegated resources to your Azure tenant";
        DelegatedResourceId      = $eventDescription.delegationResourceId; 
        CustomerTenantId         = $eventDescription.subscriptionTenantId;
        CustomerSubscriptionId   = $eventDescription.subscriptionId;
        CustomerDelegationStatus = $registerOutput.status.value;
        EventTimeStamp           = $registerOutput.eventTimestamp;
        }
        $registerOutputdata | Format-List
    }
}
if ($showOperations.operationName.value -eq "Microsoft.Resources/tenants/unregister/action") {
    $unregisterOutputs = $showOperations | Where-Object -FilterScript { $_.eventName.value -eq "EndRequest" -and $_.resourceType.value -and $_.operationName.value -eq "Microsoft.Resources/tenants/unregister/action" }
    foreach ($unregisterOutput in $unregisterOutputs) {
        $eventDescription = $registerOutput.description | ConvertFrom-Json;
    $unregisterOutputdata = [pscustomobject]@{
        Event                    = "An Azure customer has unregistered delegated resources from your Azure tenant";
        DelegatedResourceId      = $eventDescription.delegationResourceId;
        CustomerTenantId         = $eventDescription.subscriptionTenantId;
        CustomerSubscriptionId   = $eventDescription.subscriptionId;
        CustomerDelegationStatus = $unregisterOutput.status.value;
        EventTimeStamp           = $unregisterOutput.eventTimestamp;
        }
        $unregisterOutputdata | Format-List
    }
}
else {
    Write-Output "No new delegation events for tenant: $($currentContext.Tenant.TenantId)"
}
```

## Next steps

- Learn how to onboard customers to [Azure Lighthouse](../concepts/azure-delegated-resource-management.md).
- Learn about [Azure Monitor](../../azure-monitor/index.yml) and the [Azure activity log](../../azure-monitor/essentials/platform-logs-overview.md).
- Review the [Activity Logs by Domain](https://github.com/Azure/Azure-Lighthouse-samples/tree/master/templates/workbook-activitylogs-by-domain) sample workbook to learn how to display Azure Activity logs across subscriptions with an option to filter them by domain name.
