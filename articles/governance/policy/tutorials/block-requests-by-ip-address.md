---
title: "Tutorial: Block resource deletion from specific IP addresses (preview)"
description: In this tutorial, you use Azure Policy IP filtering to block requests that delete Azure SQL databases when they come from a disallowed IP address range.
ms.date: 11/23/2026
ms.topic: tutorial
---

# Tutorial: Block resource deletion from specific IP addresses with Azure Policy (preview)

Azure Policy can block requests based on the IP address they come from. With IP filtering, Azure Policy evaluates both the request header content, such as the client IP address, and the resource payload in the request body. You can use it to block requests from disallowed IP addresses at any scope where you can assign a policy, such as a management group, subscription, or resource group.

> [!IMPORTANT]
> IP filtering with the `requestContext().clientIpAddress` function is currently in PREVIEW. It's supported only in policy definitions that use the `deny` or `denyAction` effect, and your tenant must be enabled for the preview before you can use it.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In this tutorial, you protect the Azure SQL databases in a subscription so that they can't be deleted by requests that come from a disallowed IP address range. You learn how to:

> [!div class="checklist"]
> - Create a custom policy definition that uses `ipRangeContains()` and `requestContext().clientIpAddress`
> - Assign the policy definition and set the disallowed IP range
> - Review the assignment and its compliance results
> - Test that deletion requests from the disallowed range are blocked
> - Clean up the resources you created

## Prerequisites

- An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/) before you begin.
- A tenant that is enabled for the IP filtering preview. [Add how customers request preview enablement.]
- Permissions to create policy definitions and assignments at the target scope, such as the [Resource Policy Contributor](/azure/role-based-access-control/built-in-roles#resource-policy-contributor) role.
- An Azure SQL database to test with. Use a non-production database, because a successful deletion request removes it.
- [Azure PowerShell](/powershell/azure/install-azure-powershell) or the [Azure CLI](/cli/azure/install-azure-cli) to test the policy.
- The IP address or range that you want to block, in a format that `ipRangeContains()` supports: a single IP address, a CIDR range, or a range defined by start and end IP addresses. To test the block, include the public IP address of the machine you test from.

## Create the policy definition

The following policy definition targets resources of type `Microsoft.Sql/servers/databases`. When a delete request for one of these resources comes from an IP address within the disallowed range, the `denyAction` effect blocks it.

```json
{
  "properties": {
    "displayName": "Disallow SQL database deletion from a disallowed IP range",
    "policyType": "Custom",
    "mode": "All",
    "version": "1.0.0",
    "parameters": {
      "disallowedIPAddressRange": {
        "type": "String",
        "metadata": {
          "displayName": "Disallowed IP address range",
          "description": "Delete requests for SQL databases that come from within this IP address or range are blocked. Example: 203.0.113.0/24"
        }
      }
    },
    "policyRule": {
      "if": {
        "allOf": [
          {
            "field": "type",
            "equals": "Microsoft.Sql/servers/databases"
          },
          {
            "value": "[ipRangeContains(parameters('disallowedIPAddressRange'), requestContext().clientIpAddress)]",
            "equals": true
          }
        ]
      },
      "then": {
        "effect": "denyAction",
        "details": {
          "actionNames": [
            "delete"
          ]
        }
      }
    }
  }
}
```

The IP filtering condition passes the disallowed range as the _range_ argument of `ipRangeContains()` and the IP address of the incoming request as the _targetRange_ argument. The function returns `true` when the request comes from within the disallowed range. For more information about these functions, see [Policy functions](../concepts/definition-structure-policy-rule.md#policy-functions).

To create the definition in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com), search for **Policy**, and select it.
1. Under **Authoring**, select **Definitions**, and then select **+ Policy definition**.
1. For **Definition location**, select the management group or subscription where you want to store the definition.
1. Enter a **Name**, such as *Disallow SQL database deletion from a disallowed IP range*, and select or create a **Category**.
1. In **Policy rule**, paste the JSON from the previous example, and then select **Save**.

To create the definition with the Azure CLI instead, save the `policyRule` object to *rules.json* and the `parameters` object to *params.json*, and then run:

```azurecli
az policy definition create \
  --name "disallow-sql-db-delete-from-ip-range" \
  --display-name "Disallow SQL database deletion from a disallowed IP range" \
  --mode All \
  --rules rules.json \
  --params params.json
```

## Assign the policy definition

Assign the definition to the scope you want to protect. This tutorial uses a subscription, but you can also assign it to a management group or a resource group.

1. In **Policy** > **Definitions**, select your new definition, and then select **Assign policy**.
1. On the **Basics** tab, select the **Scope**.
1. On the **Parameters** tab, enter the IP address or range to block in **Disallowed IP address range**, such as `203.0.113.0/24`.
1. Select **Review + create**, and then select **Create**.

With the Azure CLI:

```azurecli
az policy assignment create \
  --name "disallow-sql-db-delete-from-ip-range" \
  --policy "disallow-sql-db-delete-from-ip-range" \
  --scope "/subscriptions/<subscriptionId>" \
  --params '{ "disallowedIPAddressRange": { "value": "203.0.113.0/24" } }'
```

## Review the assignment

In **Policy** > **Assignments**, select your assignment. The **Parameters** tab shows the parameter value that specifies the disallowed IP range.

## Review compliance

Select **View compliance** to open the compliance page for the assignment. The page lists the applicable resources, in this case the SQL databases in the scope. Because the assignment uses the `denyAction` effect, these resources show a compliance state of **Protected**: they can't be deleted by a request that comes from the disallowed IP range.

> [!NOTE]
> Compliance scans, such as the daily scan, don't have an incoming request, so there's no client IP address to evaluate. During a compliance scan, only the other conditions in the policy rule, such as the resource type, determine which resources are applicable. The IP address condition is enforced when a request arrives.

## Test the policy

Wait a few minutes after you create the assignment so that it takes effect. Then, from a machine whose public IP address is within the disallowed range, try to delete one of the SQL databases in scope.

With Azure PowerShell:

```azurepowershell
Remove-AzSqlDatabase -ResourceGroupName "<resourceGroupName>" -ServerName "<serverName>" -DatabaseName "<databaseName>"
```

With the Azure CLI:

```azurecli
az sql db delete --resource-group "<resourceGroupName>" --server "<serverName>" --name "<databaseName>"
```

The request is blocked. The error message says that deletion of the resource was disallowed by policy and lists the policy assignment and policy definition that blocked it.

A delete request for the same database that comes from an IP address outside the disallowed range isn't blocked by this assignment.

## Variations

- **Allow only a trusted range.** To block requests that come from outside an allowed range instead, rename the parameter (for example, `allowedIPAddressRange`) and change the IP condition to `"equals": false`.
- **Block several ranges.** `ipRangeContains()` accepts one range per call. To block more than one distinct range, such as an IPv4 range and an IPv6 range, add one condition per range inside an `anyOf` operator. For an example, see [IP filtering policy rule examples (preview)](../concepts/definition-structure-policy-rule.md#ip-filtering-policy-rule-examples-preview).
- **Block create and update requests.** To block create and update requests from the disallowed range, use the [deny](../concepts/effect-deny.md) effect instead of [denyAction](../concepts/effect-deny-action.md).
- **Protect other resource types.** Change the `type` condition, or combine the IP condition with other conditions, to narrow enforcement to the resources you need to protect.

## Preview limitations

- **Supported effects.** IP filtering is supported only for the `deny` and `denyAction` effects.
- **Compliance results.** Compliance scans don't evaluate the IP address condition, because there's no incoming request to evaluate. Only the other conditions in the policy rule determine applicability.
- **IP address changes in forwarded requests.** In some scenarios, the IP address changes as the original request is forwarded on the user's behalf. This change happens for some batch API calls, some managed resource scenarios, and some Azure portal experiences. In these scenarios, the evaluated IP address might not match the IP address of the original request, so requests might be blocked unexpectedly. Test the tools and workflows that your teams use before you assign the policy broadly.

## Provide feedback

[Add the preview feedback and support channel.]

## Clean up resources

If you no longer need the assignment and definition from this tutorial, delete them.

1. In **Policy** > **Assignments**, select the assignment, and then select **Delete assignment**.
1. In **Policy** > **Definitions**, select the definition, and then select **Delete definition**.

With the Azure CLI:

```azurecli
az policy assignment delete --name "disallow-sql-db-delete-from-ip-range" --scope "/subscriptions/<subscriptionId>"
az policy definition delete --name "disallow-sql-db-delete-from-ip-range"
```

## Next steps

In this tutorial, you blocked the deletion of SQL databases by requests that come from a disallowed IP address range. To learn more about the functions and effects used in this tutorial, see:

> [!div class="nextstepaction"]
> [Azure Policy definition structure policy rule](../concepts/definition-structure-policy-rule.md)

- [Azure Policy definitions denyAction effect](../concepts/effect-deny-action.md)
- [Azure Policy definitions deny effect](../concepts/effect-deny.md)
- [Get compliance data of Azure resources](../how-to/get-compliance-data.md)
