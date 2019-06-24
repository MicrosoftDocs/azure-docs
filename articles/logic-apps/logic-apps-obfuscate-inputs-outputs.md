---
title: Obfuscate inputs and outputs - Azure Logic Apps
description: Secure data with obfuscation in Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
ms.topic: conceptual
ms.date: 06/28/19
---

# Secure inputs and outputs with obfuscation in Azure Logic Apps

When your logic app finishes running, you get access to the history for that specific run, including the steps that the run took along with the status, duration, inputs, and outputs for each action. This rich detail helps provide insight into how well your logic app runs. However, some actions might handle data that contains secrets or sensitive information, which you don't want others to view or have access. For example, if you need to get a secret from Azure Key Vault to use as authentication for an HTTP action, you want to hide that secret from view.

To prevent showing inputs and outputs in your logic app's run history, you can secure those inputs and outputs on triggers and actions. If you secure outputs on an action, not only does Logic Apps hide this data, the service blocks that action's input history for any action that explicitly references that output.

Here are some considerations when using secured inputs and outputs:

* If another action uses secured output as input, that input is treated as secure only if that action produces the same data as the input that was passed to that action. So, make sure that you also enable secure outputs on that action.

* When secured outputs are enabled, the **Workflow history** API doesn't return those outputs. 

* When secured inputs or outputs are enabled, you can't add Tracked Properties to that action, which prevents sending secured data Azure Log Analytics.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription yet, [sign up for a free Azure account](https://azure.microsoft.com/free/).

* The logic app where you want to secure inputs and outputs

  If you're new to logic apps, review [What is Azure Logic Apps](../logic-apps/logic-apps-overview.md) 
  and [Quickstart: Create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md).

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

   When you view your logic app's run history, the secured inputs and outputs appear hidden.

   ![Hidden data in run history](media/logic-apps-obfuscate-inputs-outputs/hidden-data-run-history.png)

## Next steps

Learn more about [how to secure logic apps](logic-apps-securing-a-logic-apps.md)