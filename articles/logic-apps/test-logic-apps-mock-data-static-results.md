---
title: Test workflows with mock outputs
description: Set up static results to test workflows with mock outputs in Azure Logic Apps without affecting production environments.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 07/24/2024
---

# Test workflows with mock outputs in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

To test your workflow without affecting your production environments, you can set up and return mock outputs, or *static results*, from your workflow operations. That way, you don't have to call or access your live apps, data, services, or systems. For example, you might want to test different action paths based on various conditions, force errors, provide specific message response bodies, or even try skipping some steps. Setting up mock results from an action doesn't run the operation, but returns the test output instead.

For example, if you set up mock outputs for the Outlook 365 send mail action, Azure Logic Apps just returns the mock outputs that you provided, rather than call Outlook and send an email.

This guide shows how to set up mock outputs for an action in a Consumption or Standard logic app workflow.

## Prerequisites

* An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* The logic app resource and workflow where you want to set up mock outputs. This article uses a **Recurrence** trigger and **HTTP** action as an example workflow.

  If you're new to logic apps, see the following documentation:

  * [Create an example Consumption logic app workflow in multitenant Azure Logic Apps](quickstart-create-example-consumption-workflow.md)

  * [Create an example Standard logic app workflow in single-tenant Azure Logic Apps](create-single-tenant-workflows-azure-portal.md)

## Limitations

- This capability is available only for actions, not triggers.

- No option currently exists to dynamically or programmatically enable and disable this capability.

- No indications exist at the logic app level that this capability is enabled. The following list describes where you can find indications that this capability is enabled:

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

   :::image type="content" source="media/test-logic-apps-mock-data-static-results/select-testing.png" alt-text="Screenshot shows the Azure portal, Consumption workflow designer, HTTP action information pane, and Testing selected." lightbox="media/test-logic-apps-mock-data-static-results/select-testing.png":::

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

   :::image type="content" source="media/test-logic-apps-mock-data-static-results/enable-static-result.png" alt-text="Screenshot shows Consumption workflow and Testing pane after selecting Enable Static Result with the Status and Error fields also selected." lightbox="media/test-logic-apps-mock-data-static-results/enable-static-result.png":::

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

   The action's lower-right corner now shows a test beaker icon (![Icon for static result](./media/test-logic-apps-mock-data-static-results/static-result-test-beaker-icon.png)), which indicates that you've enabled static results.

   :::image type="content" source="media/test-logic-apps-mock-data-static-results/static-result-enabled.png" alt-text="Screenshot shows Standard workflow with HTTP action and static result icon." lightbox="media/test-logic-apps-mock-data-static-results/static-result-enabled.png":::

   To find workflow runs that use mock outputs, see [Find runs that use static results](#find-runs-mock-data) later in this guide.

---

<a name="find-runs-mock-data"></a>

## Find runs that use mock outputs

### [Consumption](#tab/consumption)

To find earlier workflow runs where the actions use mock outputs, review that workflow's run history.

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app workflow in the designer.

1. On your logic app resource menu, select **Overview**.

1. Under the **Essentials** section, select **Runs history**, if not selected.

1. In the **Runs history** table, find the **Static Results** column.

   Any run that includes actions with mock outputs has the **Static Results** column set to **Enabled**, for example:

   :::image type="content" source="media/test-logic-apps-mock-data-static-results/run-history.png" alt-text="Screenshot shows Consumption workflow run history with the Static Results column." lightbox="media/test-logic-apps-mock-data-static-results/run-history.png":::

1. To view the actions in a run that uses mock outputs, select the run where the **Static Results** column is set to **Enabled**.

   In the workflow run details pane, actions that use static results show the test beaker icon (![Icon for static result](./media/test-logic-apps-mock-data-static-results/static-result-test-beaker-icon.png)), for example:

   :::image type="content" source="media/test-logic-apps-mock-data-static-results/run-history-static-result.png" alt-text="Screenshot shows Consumption workflow run history with actions that use static results." lightbox="media/test-logic-apps-mock-data-static-results/run-history-static-result.png":::

### [Standard](#tab/standard)

To find earlier or other workflow runs where the actions use mock outputs, review each workflow's run history.

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app workflow in the designer.

1. On the workflow menu, select **Overview**.

1. Under the **Essentials** section, select **Run History**, if not selected.

1. In the **Run History** table, find the **Static Results** column.

   Any run that includes actions with mock outputs has the **Static Results** column set to **Enabled**, for example:

   :::image type="content" source="media/test-logic-apps-mock-data-static-results/select-run-standard.png" alt-text="Screenshot shows Standard workflow run history with the Static Results column." lightbox="media/test-logic-apps-mock-data-static-results/select-run-standard.png":::

1. To view the actions in a run that uses mock outputs, select the run where the **Static Results** column is set to **Enabled**.

   On the run details pane, any actions that use static results show the test beaker icon (![Icon for static result](./media/test-logic-apps-mock-data-static-results/static-result-test-beaker-icon.png)), for example:

   :::image type="content" source="media/test-logic-apps-mock-data-static-results/run-history-static-result.png" alt-text="Screenshot shows Standard workflow run history with actions that use static results." lightbox="media/test-logic-apps-mock-data-static-results/run-history-static-result.png":::

---

## Disable mock outputs

Turning off static results on an action doesn't remove the values from your last setup. So, if you turn on static results again on the same action, you can continue using your previous values.

1. In the [Azure portal](https://portal.azure.com), open your logic app workflow in the designer.

1. Find and select the action where you want to disable mock outputs.

1. In the action details pane, select the **Testing** tab.

1. Select **Disable Static Result** > **Save**.

   :::image type="content" source="media/test-logic-apps-mock-data-static-results/disable-static-result.png" alt-text="Screenshot shows logic app workflow, HTTP action, and Testing tab with Disable Static Result selected." lightbox="media/test-logic-apps-mock-data-static-results/disable-static-result.png":::

## Reference

For more information about this setting in your underlying workflow definitions, see [Static results - Schema reference for Workflow Definition Language](logic-apps-workflow-definition-language.md#static-results) and [runtimeConfiguration.staticResult - Runtime configuration settings](logic-apps-workflow-actions-triggers.md#runtime-configuration-settings).

## Next steps

* Learn more about [Azure Logic Apps](logic-apps-overview.md)
