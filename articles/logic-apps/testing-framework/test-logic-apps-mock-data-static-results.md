---
title: Test Workflows with Mock Outputs
description: Set up static results to test workflows with mock outputs in Azure Logic Apps without touching production environments.
services: azure-logic-apps
ms.suite: integration
author: ecfan
ms.reviewer: estfan, azla
ms.topic: how-to
ms.update-cycle: 1095-days
ms.date: 09/11/2026
---

# Test workflows with mock outputs in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../../includes/logic-apps-sku-consumption-standard.md)]

Test your workflow without touching production by setting up and returning mock outputs, or *static results*, from your workflow operations. You don't have to call your live apps, data, services, or systems.

When you set up mock outputs, you can:

- Test different action paths based on various conditions.
- Force errors to check failure handling.
- Provide specific message response bodies.
- Skip steps that you don't want to run.

Setting up mock outputs from an action doesn't run that action in production, but returns the test output instead.

For example, if you set up mock outputs for the Outlook 365 send mail action, Azure Logic Apps returns the mock outputs that you provided, rather than send an email.

In this guide, you learn how to:

- [Set up mock outputs on an action](#set-up-mock-outputs)
- [Find runs that use mock outputs](#find-runs-mock-data)
- [Disable mock outputs](#disable-mock-outputs)

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- The logic app resource and workflow where you want to set up mock outputs. This article uses a **Recurrence** trigger and **HTTP** action as an example workflow.

  If you're new to logic apps, create a workflow first:

  - [Create a Consumption workflow](../quickstart-create-example-consumption-workflow.md)
  - [Create a Standard workflow](../create-single-tenant-workflows-azure-portal.md)

## Limitations

- Mock outputs (static results) are available only for actions, not triggers.

- No option currently exists to dynamically or programmatically enable and disable mock outputs.

- No indications exist at the logic app level that mock outputs are enabled. Instead, look for these signs:

  - On the action shape, the lower-right corner shows the test beaker icon (![Icon for static result](./media/test-logic-apps-mock-data-static-results/static-result-test-beaker-icon.png)).

  - On the action's details pane, on **Testing** tab, the **Static Result** option is enabled.

  - In code view, the action's JSON definition includes the following properties in the **`runtimeConfiguration`** JSON object:

    ```json
    "runtimeConfiguration": {
        "staticResult": {
            "name": "{action-name-ordinal}",
            "staticResultOptions": "Enabled"
        }
    }
    ```

  - In the workflow's run history, the **Static Results** column appears with the word **Enabled** next to any run where at least one action has this capability enabled.

<a name="set-up-mock-outputs"></a>

## Set up mock outputs on an action

### [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app workflow in the designer.

1. On the designer, select the action where you want to return mock outputs.

1. On the action information pane, select **Testing**, for example:

   :::image type="content" source="media/test-logic-apps-mock-data-static-results/select-testing.png" alt-text="Screenshot that shows the Azure portal, Consumption workflow designer, HTTP action information pane, and Testing selected." lightbox="media/test-logic-apps-mock-data-static-results/select-testing.png":::

1. On the **Testing** tab, select **Enable Static Result**.

1. From the **Select Fields** list, select the properties where you want to specify mock outputs to return in the action's response.

   The available properties differ based on the selected action type. For example, the HTTP action has the following sections and properties:

   | Section or property | Required | Description |
   |---------------------|----------|-------------|
   | **Status** | Yes | The action status to return. <br><br>- If you select **Succeeded**, you must also select **Outputs** from the **Select Fields** list. <br><br>- If you select **Failed**, you must also select **Error** from the **Select Fields** list. |
   | **Code** | No | The specific code to return for the action |
   | **Error** | Yes, when the **Status** is **Failed** | The error message and an optional error code to return |
   | **Output** | Yes, when the **Status** is **Succeeded** | The status code, header content, and an optional body to return |

   The following example shows when **Status** is set to **Failed**, which requires that you select the **Error** field and provide values for the **Error Message** and **Error Code** properties:

   :::image type="content" source="media/test-logic-apps-mock-data-static-results/enable-static-result.png" alt-text="Screenshot that shows Consumption workflow and Testing pane after selecting Enable Static Result with the Status and Error fields also selected." lightbox="media/test-logic-apps-mock-data-static-results/enable-static-result.png":::

1. When you're ready, select **Save**.

   The action's lower-right corner now shows a test beaker icon (![Icon for static result](./media/test-logic-apps-mock-data-static-results/static-result-test-beaker-icon.png)), which indicates that you enabled static results.

   :::image type="content" source="media/test-logic-apps-mock-data-static-results/static-result-enabled.png" alt-text="Screenshot shows Consumption workflow with HTTP action and static result icon." lightbox="media/test-logic-apps-mock-data-static-results/static-result-enabled.png":::

   To find workflow runs that use mock outputs, see [Find runs that use static results](#find-runs-mock-data) later in this guide.

### [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app workflow in the designer.

1. On the designer, select the action where you want to return mock outputs.

1. On the action information pane, select **Testing**, for example:

   :::image type="content" source="media/test-logic-apps-mock-data-static-results/select-testing-standard.png" alt-text="Screenshot shows Standard workflow with HTTP action details pane, and Testing selected." lightbox="media/test-logic-apps-mock-data-static-results/select-testing-standard.png":::

1. On the **Testing** tab, select **Enable Static Result**.

1. From the **Select Fields** list, select the properties where you want to specify mock outputs to return in the action's response.

   The available properties differ based on the selected action type. For example, the HTTP action has the following sections and properties:

   | Section or property | Required | Description |
   |---------------------|----------|-------------|
   | **Status** | Yes | The action status to return. <br><br>- If you select **Succeeded**, you must also select **Outputs** from the **Select Fields** list. <br><br>- If you select **Failed**, you must also select **Error** from the **Select Fields** list. |
   | **Code** | No | The specific code to return for the action |
   | **Error** | Yes, when the **Status** is **Failed** | The error message and an optional error code to return |
   | **Output** | Yes, when the **Status** is **Succeeded** | The status code, header content, and an optional body to return |

   The following example shows when **Status** is set to **Failed**, which requires that you select the **Error** field and provide values for the **Error Message** and **Error Code** properties:

   :::image type="content" source="media/test-logic-apps-mock-data-static-results/enable-static-result-standard.png" alt-text="Screenshot shows Standard workflow and Testing pane after selecting Enable Static Result with the Status and Error fields also selected." lightbox="media/test-logic-apps-mock-data-static-results/enable-static-result-standard.png":::

1. When you're ready, select **Save**.

   The action's lower-right corner now shows a test beaker icon (![Icon for static result](./media/test-logic-apps-mock-data-static-results/static-result-test-beaker-icon.png)), which indicates that you enabled static results.

   :::image type="content" source="media/test-logic-apps-mock-data-static-results/static-result-enabled.png" alt-text="Screenshot shows Standard workflow with HTTP action and static result icon." lightbox="media/test-logic-apps-mock-data-static-results/static-result-enabled.png":::

   To find workflow runs that use mock outputs, see [Find runs that use static results](#find-runs-mock-data) later in this guide.

---

<a name="find-runs-mock-data"></a>

## Find runs that use mock outputs (Consumption only)

To find earlier workflow runs where the actions use mock outputs, review that workflow's run history. This section applies only to Consumption workflows. For Standard workflows, see [View workflow run history](../view-workflow-status-run-history.md).

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app workflow in the designer.

1. On your logic app resource menu, select **Overview**.

1. Under the **Essentials** section, select **Runs history**, if not selected.

1. In the **Runs history** table, find the **Static Results** column.

   Any run that includes actions with mock outputs has the **Static Results** column set to **Enabled**, for example:

   :::image type="content" source="media/test-logic-apps-mock-data-static-results/run-history.png" alt-text="Screenshot shows Consumption workflow run history with the Static Results column." lightbox="media/test-logic-apps-mock-data-static-results/run-history.png":::

1. To view the actions in a run that uses mock outputs, select the run where the **Static Results** column is set to **Enabled**.

   In the workflow run details pane, actions that use static results show the test beaker icon (![Icon for static result](./media/test-logic-apps-mock-data-static-results/static-result-test-beaker-icon.png)), for example:

   :::image type="content" source="media/test-logic-apps-mock-data-static-results/run-history-static-result.png" alt-text="Screenshot shows Consumption workflow run history with actions that use static results." lightbox="media/test-logic-apps-mock-data-static-results/run-history-static-result.png":::

## Disable mock outputs

Turning off static results on an action doesn't remove the values from your last setup. If you turn on static results again on the same action, you can continue using your previous values.

1. In the [Azure portal](https://portal.azure.com), open your logic app workflow in the designer.

1. Find and select the action where you want to disable mock outputs.

1. In the action details pane, select the **Testing** tab.

1. Select **Disable Static Result** > **Save**.

   :::image type="content" source="media/test-logic-apps-mock-data-static-results/disable-static-result.png" alt-text="Screenshot shows logic app workflow, HTTP action, and Testing tab with Disable Static Result selected." lightbox="media/test-logic-apps-mock-data-static-results/disable-static-result.png":::

## Reference

For more information about this setting in your underlying workflow definitions, see:

- [Static results schema reference](../logic-apps-workflow-definition-language.md#static-results)
- [runtimeConfiguration.staticResult settings](../logic-apps-workflow-actions-triggers.md#runtime-configuration-settings)

## Related content

- [What is Azure Logic Apps?](../logic-apps-overview.md)
