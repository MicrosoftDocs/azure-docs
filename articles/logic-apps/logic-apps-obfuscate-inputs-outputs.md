---
title: Obfuscate inputs and outputs in run history - Azure Logic Apps
description: Secure passwords, secrets, keys, and other sensitive data that appear as inputs and outputs in run history for triggers and actions in Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
ms.topic: conceptual
ms.date: 06/28/19
---

# Secure inputs and outputs in run history for Azure Logic Apps

When your logic app finishes running, you can access the history for that particular run, including the steps that ran along with the status, duration, inputs, and outputs for each action. This rich detail provides insight into how your logic app ran and where you might start troubleshooting any problems that arise. However, for actions that handle any secrets or sensitive information, you want to block others from viewing and accessing that data. For example, if your logic app gets a secret from Azure Key Vault to use as authentication for an HTTP action, you want to hide that secret from view.

To prevent showing the inputs and outputs in your logic app's run history, you can turn on obfuscation for all the inputs, outputs, or both in triggers and actions.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription yet, [sign up for a free Azure account](https://azure.microsoft.com/free/).

* The logic app where you want to secure inputs and outputs

  If you're new to logic apps, review [What is Azure Logic Apps](../logic-apps/logic-apps-overview.md) and [Quickstart: Create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md).

## Secure inputs or outputs

1. If your logic app isn't already open in the [Azure portal](https://portal.azure.com), open your logic app in the Logic App Designer.

   ![Open sample logic app](media/logic-apps-obfuscate-inputs-outputs/sample-logic-app.png)

1. On the trigger or action where you want to secure data, select the ellipses (**...**) button, and then select **Settings**.

   ![Open "Settings"](media/logic-apps-obfuscate-inputs-outputs/open-settings.png)

1. Turn on either **Secure inputs**, **Secure outputs**, or both. When you're finished, select **Done**.

   ![Turn on secure inputs or outputs](media/logic-apps-obfuscate-inputs-outputs/turn-on-secure-inputs-outputs.png)

   The action or trigger now shows a lock icon in the title bar.

   ![Lock icon on title bar](media/logic-apps-obfuscate-inputs-outputs/title-bar-lock-icon.png)

   Tokens that represent secured outputs from previous actions also show lock icons. For example, when you select such an output from the dynamic content list to use in an action, that token shows a lock icon.

   ![Select output](media/logic-apps-obfuscate-inputs-outputs/select-secured-token.png)

1. After the logic app runs, you can view the history for that run.

   1. On the logic app's **Overview** pane, select the run that you want to view.

   1. On the **Logic app run** pane, expand the actions that you want to review.

      Secured inputs and outputs are hidden from view.

      ![Hidden data in run history](media/logic-apps-obfuscate-inputs-outputs/hidden-data-run-history.png)

## Considerations when securing data

* If you secure the outputs from a trigger or action, and a later action explicitly uses those secured outputs as inputs, Logic Apps secures those inputs in the run history. However, if that later action produces outputs that are the same as the consumed secured inputs, Logic Apps doesn't secure those outputs in the run history.

  To continue securing this data, make sure that you explicitly secure outputs when they're the same as the secured inputs that the action consumes.

  ![Secured outputs as inputs](media/logic-apps-obfuscate-inputs-outputs/secure-outputs-as-inputs-flow.png)

* When you secure an action's inputs or outputs, you prevent that action from sending that secured data to Azure Log Analytics. You also can't add [tracked properties](logic-apps-monitor-your-logic-apps.md#azure-diagnostics-event-settings-and-details) to that action for monitoring.

* The [Logic Apps API for handling workflow history](https://docs.microsoft.com/rest/api/logic/) doesn't return secured outputs.

## Next steps

Learn more about [how to secure logic apps](logic-apps-securing-a-logic-app.md)