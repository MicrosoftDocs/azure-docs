---
title: Block Connector Usage
description: Learn to prevent creating or using API connections for workflows in Azure Logic Apps by using Azure Policy.
services: logic-apps
ms.suite: integration
ms.reviewers: estfan, azla
ms.topic: how-to
ms.custom: sfi-image-nochange
ms.date: 10/28/2025
#Customer intent: As an integration developer who works with Azure Logic Apps, I want to block specific connections for workflows in Azure Logic Apps by using Azure Policy.
---

# Block connector usage in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

If your organization doesn't permit connecting to restricted or unapproved resources using their [managed connectors](../connectors/managed.md) in Azure Logic Apps, you can block the capability to create and use those connections in logic app workflows. With Azure Policy, you can define and enforce [policies](../governance/policy/overview.md#policy-definition) that prevent creating or using connections for connectors that you want to block. For example, for security reasons, you might want to block connections to specific social media platforms or other services and systems.

This guide shows you how to set up a policy that blocks specific connections by using the Azure portal. You can also create policy definitions in other ways. For example, you can use the Azure REST API, Azure PowerShell, Azure CLI, or Azure Resource Manager templates. For more information, see [Create and manage policies to enforce compliance](../governance/policy/tutorials/create-and-manage.md).

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [create a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- The reference ID for the connector that you want to block. This guide shows how to find this reference ID.

<a name="connector-reference-ID"></a>

## Find connector reference ID

If you already have a logic app workflow with the connection that you want to block, skip this section. Otherwise, follow these steps to find the connector reference ID:

<a name="connector-ID-doc-reference"></a>

### Find the ID using the connector reference doc

1. Review the [list of all Azure Logic Apps managed connectors](/connectors/connector-reference/connector-reference-logicapps-connectors).

1. Find the reference page for the connector that you want to block.

   For example, if you want to block the Gmail connector, go to this page:

   `https://learn.microsoft.com/connectors/gmail/`

1. From the page's URL, copy and save the connector reference ID at the end without the forward slash (`/`), for example, `gmail`.

   Later, when you create your policy definition, you use this ID in the definition's condition statement, for example:

   `"like": "*managedApis/gmail"`

<a name="connector-ID-portal"></a>

### Find the ID using the Azure portal

1. In the [Azure portal](https://portal.azure.com), open your logic app resource.

1. On the resource sidebar, select one of the following options:
   
   - Consumption logic app: Under **Development Tools**, select **API connections**.

   - Standard logic app: Under **Workflows**, select **Connections**. On the **Connections** pane, select **API Connections** if not already selected.

1. On the **API connections** page, select the connection. After the connection page opens, in the upper right corner, select **JSON View**.

1. Find the `api` object, which contains an `id` property and value that has the following format: 

   `"id": "/subscriptions/{Azure-subscription-ID}/providers/Microsoft.Web/locations/{Azure-region}/managedApis/{connection-name}"`

   The following example shows the `id` property and value for an Gmail connection:

   `"id": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/providers/Microsoft.Web/locations/westus/managedApis/gmail"`

1. From the `id` property value, copy and save the connector reference ID, which appears at the end, for example, `gmail`.

   Later, when you create your policy definition, you use this ID in the definition's condition statement, for example:

   `"like": "*managedApis/gmail"`

<a name="create-policy-connections"></a>

## Block creating connections

To block creating a connection in a workflow, follow these steps:

1. In the [Azure portal](https://portal.azure.com) search box, enter *policy*, and select **Policy**.

   :::image type="content" source="./media/block-connections-connectors/find-select-azure-policy.png" alt-text="Screenshot shows the Azure portal search box with policy entered and Policy highlighted.":::

1. On the **Policy** menu, under **Authoring**, select **Definitions**. On the **Definitions** toolbar, select **Policy definition**.

   :::image type="content" source="./media/block-connections-connectors/add-new-policy-definition.png" alt-text="Screenshot shows the Definitions page with Policy definition highlighted.":::

1. On the **Policy definition** page, provide the information for your policy definition, based on the properties in the table that follow the image:

   :::image type="content" source="./media/block-connections-connectors/policy-definition-create-connection.png" alt-text="Screenshot shows the policy definition values for blocking Gmail.":::

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **Definition location** | Yes | <*Azure-subscription-name*> | The Azure subscription to use for the policy definition <br><br>1. To find your subscription, select the ellipses (**...**). <br>2. From the **Subscription** list, find and select your subscription. <br>3. When you're done, select **Select**. |
   | **Name** | Yes | <*policy-definition-name*> | The name to use for the policy definition. |
   | **Description** | No | <*policy-definition-name*> | A description for the policy definition. |
   | **Category** | Yes | **Logic apps** | The name for an existing category or new category for the policy definition. |

1. Under **Policy rule**, the JSON edit box is prepopulated with a policy definition template. Replace this template with your [policy definition](../governance/policy/concepts/definition-structure.md) based on the properties described in the following table and using this syntax:

   ```json
   {
      "mode": "All",
      "policyRule": {
         "if": {
            "field": "Microsoft.Web/connections/api.id",
            "like": "*managedApis/{connector-name}"
         },
         "then": {
            "effect": "deny"
         }
      },
      "parameters": {}
    }
    ```

   | Keyword | Value | Description |
   |---------|-------|-------------|
   | `mode` | `All` | The mode that determines the resource types that the policy evaluates. <br><br>This scenario sets `mode` to `All`, which applies the policy to Azure resource groups, subscriptions, and all resource types. <br><br>For more information, see [Policy definition structure - mode](../governance/policy/concepts/definition-structure.md#mode). |
   | `if` | `{condition-to-evaluate}` | The condition that determines when to enforce the policy rule <br><br>In this scenario, the `{condition-to-evaluate}` determines whether the `api.id` value in `Microsoft.Web/connections/api.id` matches on `*managedApis/{connector-name}`, which specifies a wildcard (*) value. <br><br>For more information, see [Policy definition structure - Policy rule](../governance/policy/concepts/definition-structure-policy-rule.md). |
   | `field` | `Microsoft.Web/connections/api.id` | The `field` value to compare against the condition <br><br>In this scenario, the `field` uses the [*alias*](../governance/policy/concepts/definition-structure-alias.md), `Microsoft.Web/connections/api.id`, to access the value in the connector property, `api.id`. |
   | `like` | `*managedApis/{connector-name}` | The logical operator and value to use for comparing the `field` value <br><br>In this scenario, the `like` operator and the wildcard (*) character both make sure that the rule works regardless of region, and the string, `*managedApis/{connector-name}`, is the value to match where `{connector-name}` is the ID for the connector that you want to block. <br><br>For example, suppose that you want to block creating connections to social media platforms or databases: <br><br>- X: `x` <br>- Facebook: `facebook` <br>- Pinterest: `pinterest` <br>- SQL Server or Azure SQL: `sql` <br><br>To find these connector IDs, see [Find connector reference ID](#connector-reference-ID) earlier in this article. |
   | `then` | `{effect-to-apply}` | The effect to apply when the `if` condition is met <br><br>In this scenario, the `{effect-to-apply}` is to block and fail a request or operation that doesn't comply with the policy. <br><br>For more information, see [Policy definition structure - Policy rule](../governance/policy/concepts/definition-structure-policy-rule.md). |
   | `effect` | `deny` | The `effect` is to block the request, which is to create the specified connection <br><br>For more information, see [Understand Azure Policy effects - Deny](../governance/policy/concepts/effect-deny.md). |

   For example, suppose that you want to block creating connections with the Gmail connector. Here's the policy definition that you can use:

   ```json
   {
      "mode": "All",
      "policyRule": {
         "if": {
            "field": "Microsoft.Web/connections/api.id",
            "like": "*managedApis/gmail"
         },
         "then": {
            "effect": "deny"
         }
      },
      "parameters": {}
   }
   ```

   Here's the way that the **Policy rule** box appears:

   :::image type="content" source="./media/block-connections-connectors/policy-definition-create-connection-rule.png" alt-text="Screenshot shows the Policy rule box with a policy rule example.":::

   For multiple connectors, you can add more than one condition, for example:

   ```json
   {
      "mode": "All",
      "policyRule": {
         "if": {
            "anyOf": [
               {
                  "field": "Microsoft.Web/connections/api.id",
                  "like": "*managedApis/x"
               },
               {
                  "field": "Microsoft.Web/connections/api.id",
                  "like": "*managedApis/facebook"
               },
               {
                  "field": "Microsoft.Web/connections/api.id",
                  "like": "*managedApis/pinterest"
               }
            ]
         },
         "then": {
            "effect": "deny"
         }
      },
      "parameters": {}
    }
    ```

1. When you're done, select **Save**.

   After you save the policy definition, Azure Policy generates and adds more property values to the policy definition.

To assign the policy definition where you want to enforce the policy, create a policy assignment, as described later in this article.

For more information about Azure Policy definitions, see:

- [Azure Policy definition structure](../governance/policy/concepts/definition-structure.md)
- [Create and manage policies to enforce compliance](../governance/policy/tutorials/create-and-manage.md)
- [Azure Policy built-in policy definitions for Azure Logic Apps](./policy-reference.md)

<a name="create-policy-connector-usage"></a>

## Block associating connections with logic apps
   
When you create a connection in a workflow, this connection exists as separate Azure resource. If you delete only the workflow or logic app resource, the connection resource isn't automatically deleted and continues to exist until deleted. You might have a scenario where the connection resource already exists or where you have to create the connection resource for use outside the logic app resource.

You can still block the capability to associate the connection with a different logic app resource by creating a policy that prevents saving workflows that try to use the restricted or unapproved connection. This policy affects only workflows that don't already use the connection.
   
1. In the [Azure portal](https://portal.azure.com) search box, enter *policy*, and select **Policy**.

   :::image type="content" source="./media/block-connections-connectors/find-select-azure-policy.png" alt-text="Screenshot shows the Azure portal search box with policy entered and Policy highlighted.":::

1. On the **Policy** menu, under **Authoring**, select **Definitions**. On the **Definitions** page toolbar, select **Policy definition**.

   :::image type="content" source="./media/block-connections-connectors/add-new-policy-definition.png" alt-text="Screenshot shows the Definitions page with Policy definition highlighted.":::

1. Under **Policy definition**, provide the information for your policy definition, based on the properties in the table that follows the image.

   :::image type="content" source="./media/block-connections-connectors/policy-definition-use-connection.png" alt-text="Screenshot shows policy definition values for saving Gmail connections.":::

   | Parameter | Required | Value | Description |
   |-----------|----------|-------|-------------|
   | **Definition location** | Yes | <*Azure-subscription-name*> | The Azure subscription to use for the policy definition <br><br>1. To find your subscription, select the ellipses (**...**) button. <br>2. From the **Subscription** list, find and select your subscription. <br>3. When you're done, select **Select**. |
   | **Name** | Yes | <*policy-definition-name*> | The name to use for the policy definition |
   | **Description** | No | <*policy-definition-name*> | A description for the policy definition |
   | **Category** | Yes | **Logic apps** | The name for an existing category or new category for the policy definition |

1. Under **Policy Rule**, the JSON edit box is prepopulated with a policy definition template. Replace this template with your [policy definition](../governance/policy/concepts/definition-structure.md) based on the properties described in the following table and using this syntax:

   ```json
   {
      "mode": "All",
      "policyRule": {
         "if": {
            "value": "[string(field('Microsoft.Logic/workflows/parameters'))]",
            "contains": "{connector-name}"
         },
         "then": {
            "effect": "deny"
         }
      },
      "parameters": {}
    }
    ```

   | Keyword | Value | Description |
   |---------|-------|-------------|
   | `mode` | `All` | The mode that determines the resource types that the policy evaluates. <br><br>This scenario sets `mode` to `All`, which applies the policy to Azure resource groups, subscriptions, and all resource types. <br><br>For more information, see [Policy definition structure - mode](../governance/policy/concepts/definition-structure.md#mode). |
   | `if` | `{condition-to-evaluate}` | The condition that determines when to enforce the policy rule <br><br>In this scenario, the `{condition-to-evaluate}` determines whether the string output from `[string(field('Microsoft.Logic/workflows/parameters'))]`, contains the string, `{connector-name}`. <br><br>For more information, see [Policy definition structure - Policy rule](../governance/policy/concepts/definition-structure-policy-rule.md). |
   | `value` | `[string(field('Microsoft.Logic/workflows/parameters'))]` | The value to compare against the condition <br><br>In this scenario, the `value` is the string output from `[string(field('Microsoft.Logic/workflows/parameters'))]`, which converts the `$connectors` object inside the `Microsoft.Logic/workflows/parameters` object to a string. |
   | `contains` | `{connector-name}` | The logical operator and value to use for comparing with the `value` property <br><br>In this scenario, the `contains` operator makes sure that the rule works regardless where `{connector-name}` appears, where the string, `{connector-name}`, is the ID for the connector that you want to restrict or block. <br><br>For example, suppose that you want to block using connections to social media platforms or databases: <br><br>- X: `x` <br>- Facebook: `facebook` <br>- Pinterest: `pinterest` <br>- SQL Server or Azure SQL: `sql` <br><br>To find these connector IDs, see [Find connector reference ID](#connector-reference-ID) earlier in this article. |
   | `then` | `{effect-to-apply}` | The effect to apply when the `if` condition is met <br><br>In this scenario, the `{effect-to-apply}` is to block and fail a request or operation that doesn't comply with the policy. <br><br>For more information, see [Policy definition structure - Policy rule](../governance/policy/concepts/definition-structure-policy-rule.md). |
   | `effect` | `deny` | The `effect` is to `deny` or block the request to save a logic app that uses the specified connection <br><br>For more information, see [Understand Azure Policy effects - Deny](../governance/policy/concepts/effect-deny.md). |

   For example, suppose that you want to block saving logic apps that use Gmail connections. Here's the policy definition that you can use:

   ```json
   {
      "mode": "All",
      "policyRule": {
         "if": {
            "value": "[string(field('Microsoft.Logic/workflows/parameters'))]",
            "contains": "gmail"
         },
         "then": {
            "effect": "deny"
         }
      },
      "parameters": {}
    }
    ```

   Here's the way that the policy definition rule appears:

   :::image type="content" source="./media/block-connections-connectors/policy-definition-use-connection-rule.png" alt-text="Screenshot shows a policy definition rule.":::

1. When you're done, select **Save**.

   After you save the policy definition, Azure Policy generates and adds more property values to the policy definition.

To assign the policy definition where you want to enforce the policy, create a policy assignment, as described later in this guide.

For more information about Azure Policy definitions, see:

- [Azure Policy definition structure](../governance/policy/concepts/definition-structure.md)
- [Create and manage policies to enforce compliance](../governance/policy/tutorials/create-and-manage.md)
- [Azure Policy built-in policy definitions for Azure Logic Apps](./policy-reference.md)

<a name="create-policy-assignment"></a>

## Create policy assignment

You need to assign the policy definition where you want to enforce the policy. For example, you might assign the policy definition to a single resource group, multiple resource groups, a Microsoft Entra tenant, or an Azure subscription. For this task, follow these steps to create a policy assignment:

1. In the [Azure portal](https://portal.azure.com) search box, enter *policy*, and select **Policy**.

   :::image type="content" source="./media/block-connections-connectors/find-select-azure-policy.png" alt-text="Screenshot shows the Azure portal search box with policy entered and Policy highlighted.":::

1. On the **Policy** menu, under **Authoring**, select **Assignments**. On the **Assignments** toolbar, select **Assign policy**.

   :::image type="content" source="./media/block-connections-connectors/add-new-policy-assignment.png" alt-text="Screenshot shows Assignments toolbar with Assign policy highlighted." lightbox="./media/block-connections-connectors/add-new-policy-assignment.png":::

1. On the **Assign policy** page, under **Basics**, provide this information for the policy assignment:

   | Parameter | Required | Description |
   |-----------|----------|-------------|
   | **Scope** | Yes | The resources where you want to enforce the policy assignment. <br><br>1. Next to the **Scope** box, select the ellipses (**...**) button. <br>2. From the **Subscription** list, select the Azure subscription. <br>3. Optionally, from the **Resource Group** list, select the resource group. <br>4. When you're done, select **Select**. |
   | **Exclusions** | No | Any Azure resources to exclude from the policy assignment. <br><br>1. Next to the **Exclusions** box, select the ellipses (**...**) button. <br>2. From the **Resource** list, select the resource > **Add to Selected Scope**. <br>3. When you're done, select **Save**. |
   | **Resource selectors** | No | |
   | **Policy definition** | Yes | The name for the policy definition that you want to assign and enforce. This example continues with the example Gmail policy, *Block Gmail connections*. <br><br>1. Next to the **Policy definition** box, select the ellipses (**...**) button. <br>2. Find and select the policy definition by using the **Type** filter or **Search** box. <br>3. When you're done, select **Select**. |
   | **Overrides** | No | |
   | **Assignment name** | Yes | The name to use for the policy assignment, if different from the policy definition. |
   | **Description** | No | A description for the policy assignment. |
   | **Policy enforcement** | Yes | The setting that enables or disables the policy assignment. |

   For example, to assign the policy to an Azure resource group by using the Gmail example:

   :::image type="content" source="./media/block-connections-connectors/policy-assignment-basics.png" alt-text="Screenshot shows policy assignment values.":::

1. When you're done, select **Review + create**.

   After you create a policy, you might have to wait up to 15 minutes before the policy takes effect. Changes might also have similar delayed effects.

After the policy takes effect, test your policy in the next section.

For more information, see [Quickstart: Create a policy assignment to identify noncompliant resources](../governance/policy/assign-policy-portal.md).

<a name="test-policy"></a>

## Test the policy

To try your policy, start creating a connection by using the now restricted connector in the workflow designer. Continuing with the Gmail example, when you sign in to Gmail, you get an error that your workflow failed to create the connection.

The error message includes this information:

| Description | Content |
|-------------|---------|
| Reason for the failure | `"Resource 'gmail' was disallowed by policy."` |
| Assignment name | `"Block Gmail connections"` |
| Assignment ID | `"/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/MyLogicApp-RG/providers/Microsoft.Authorization/policyAssignments/4231890fc3bd4352acb0b673"` |
| Policy definition ID | `"/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/providers/Microsoft.Authorization/policyDefinitions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e"` |

## Related content

- Learn more about [Azure Policy](../governance/policy/overview.md)
