---
title: 'Define dynamic network group membership in Azure Virtual Network Manager with Azure Policy (Preview)'
description: Learn how to define dynamic network group membership in Azure Virtual Network Manager with Azure Policy.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: how-to
ms.date: 11/02/2021
ms.custom: template-concept, ignite-fall-2021
---

# Define dynamic network group membership in Azure Virtual Network Manager with Azure Policy (Preview)

In this article, you'll learn how to use Azure Policy conditional statements to create network groups with dynamic membership. You create these conditional statements using the basic editor by selecting parameters and operators from a drop-down menu. You'll also learn how to use the advanced editor to update conditional statements of an existing network group.

[Azure Policy](../governance/policy/overview.md) is a service to enable you to enforce per-resource governance at scale. It can be used to specify conditional expressions that define group membership, as opposed to explicit lists of virtual networks. This condition will continue to power your network groups dynamically, allowing virtual networks to join and leave the group automatically as their fulfillment of the condition changes, with no Network Manager operation required.

> [!IMPORTANT]
> Azure Virtual Network Manager is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## <a name="parameters"></a> Parameters and operators

Virtual networks with dynamic memberships are selected using conditional statements. You can define more than one conditional statement by using *logical operators* such as **AND** and **OR** for scenarios where you need to further narrow the selected virtual networks. 

List of supported parameters:

| Parameters | Advanced editor field |
| ---------- | ------------------------- |
| Name | `Name` |
| ID | `Id` |
| Tags| `tag['tagName']` |
| Subscription Name | `[subscription().Name]` |
| Subscription ID | `[subscription().Id]` |
| Subscription Tags | `[subscription().tags['tagName']]` |
| Resource Group Name | `[resourceGroup().Name]` |
| Resource Group ID | `[resourceGroup().Id]` |
| Resource Group Tags | `[resourceGroup().tags['tagName']]` |

List of supported operators:

| Operators | Advanced editor |
| --------- | --------------- |
| Contains | `"contains": <>` |
| Doesn't contain | `"notcontains": <>` |
| In | `"in": <>` |
| Not In | `"notin": <>` |
| Equals | `"equals": <>` |
| Doesn't equal | `"notequals": <>` |
| Contains any of | `"contains": <>` |
| Contains all of | `"contains": <>` |
| Doesn't contain any of | `"notcontains": <>` |
| Exists | `"exists": true` |
| Doesn't exist | `"exists": false` |

> [!NOTE]
> The *Exists* and *Does not exist* operators are only used with the **Tags** parameter.

## Basic editor

Assume you have the following virtual networks in your subscription. Each virtual network has either a *Production* or *Test* tag associated. You only want to select virtual networks with the Production tag and contain **VNet-A** in the name.

* VNet-A-EastUS - *Production*
* VNet-A-WestUS - *Production*
* VNet-B-WestUS - *Test*
* VNet-C-WestUS - *Test*
* VNetA - *Production*
* VNetB - *Test*

To begin using the basic editor to create your conditional statement, you need to create a new network group.

1. Go to your Azure Virtual Network Manager instance and select **Network Groups** under *Settings*. Then select **+ Create** to create a new network group.

1. Enter a **Name** and an optional **Description** for the network group, and select **Add**.
1. Select the network group from the list and select **Create Azure Policy**.
1. Enter a **Policy name** and leave the **Scope** selections unless changes are needed.
1. Under **Criteria**, select **Tags** from the drop-down under *Parameter* and then select **Exist** from the drop-down under *Operator*.

1. Enter **Prod** under *Condition*, then select **Save**. 
1. After a few minutes, select your network group and select **Group Members** under *Settings*. You should only see VNet-A-EastUS, VNet-A-WestUS, and VNetA show up in the list.

> [!NOTE] 
> The **basic editor** is only available during the creation of an Azure Policy. 

## Advanced editor

The advanced editor can be used to select virtual network during the creation of a network group or when updating an existing network group. Based in [JSON](../governance/policy/concepts/assignment-structure.md), the advanced editor is useful for creating and updating complex Azure Policy conditional statements by experienced users.

1. Select the network group created in the previous section. Then select the **Conditional statements** tab.

1. You'll see the conditional statements for the network group in the advance editor view as followed:

    ```json
    {
       "allOf": [
          {
             "field": "tags['Environment']",
             "exists": true
          },
          {
             "field": "Name",
             "contains": "VNet-A"
          }
       ]
    }
    ```

    The `"allOf"` parameter contains both the conditional statements that are separated by the **AND** logical operator.

1. To add another conditional statement for a *Name* field *not containing* **WestUS**, enter the following into the advanced editor:

    ```json
    {
       "allOf": [
          {
             "field": "tags['Environment']",
             "exists": true
          },
          {
             "field": "Name",
             "contains": "VNet-A"
          },
          {
             "field": "Name",
             "notcontains": "WestUS"
          }
       ]
    }
    ```

1. Then select **Evaluate**. You should only see VNet-A-EastUS virtual network in the list.

1. Select **Review + save** and then select **Save** once validation has passed.

See [Parameter and operators](#parameters) for the complete list of parameters and operators you can use with the advanced editor. See below for more examples:

## More examples

### Example 1: OR operator only

This example uses the **OR** logical operator to separate two conditional statements.

* Basic editor:

    :::image type="content" source="./media/how-to-exclude-elements/or-operator.png" alt-text="Screenshot of network group conditional statement using the OR logical operator.":::

* Advanced operator:

    ```json
    {
       "anyOf": [
          {
             "field": "Name",
             "contains": "VNet-A"
          },
          {
             "field": "Name",
             "contains": "VNetA"
          }
       ]
    }
    ```

The `"anyOf"` parameter contains both the conditional statements that are separated by the **OR** logical operator.

### Example 2: AND and OR operator at the same time

* Basic editor:

    :::image type="content" source="./media/how-to-exclude-elements/both-operator.png" alt-text="Screenshot of network group conditional statement using both OR and AND logical operator.":::

* Advanced editor:

```json
{
   "allOf": [
      {
         "anyOf": [
            {
               "field": "Name",
               "contains": "VNet-A"
            },
            {
               "field": "Name",
               "contains": "VNetA"
            }
         ]
      },
      {
         "field": "Name",
         "notcontains": "West"
      }
   ]
}
```

Both `"allOf"` and `"anyOf"` are used in the code. Since the **AND** operator is last in the list, it is on the outer part of the code containing the two conditional statements with the **OR** operator.

> [!NOTE]
> Conditionals should filter on resource type Microsoft.Network/virtualNetwork to improve efficiency.
> This condition is prepended for you on any conditionals specified through the portal.
## Next steps

- Learn about [Network groups](concept-network-groups.md).
- Create an [Azure Virtual Network Manager](create-virtual-network-manager-portal.md) instance.
