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

Logic Apps provides a rich run history providing a view of the steps the instance the logic app has taken, the status of each action as well as the inputs and outputs of each action. This provides great insight as to how your logic apps are executing. Sometimes data that is passed in and out of actions are either secrets or contain sensitive data that you don’t want operators or developers to see or have access to. For example, if you are retrieving a secret from Key Vault that you need to pass to an HTTP action as authentication information, you don’t want to let others see those secrets. 

Configuring secure outputs and secure inputs on your actions prevents the outputs and/or inputs from being accessible from the run history. If you enable secure outputs on an action, not only is the action output not visible but the logic app engine will also will block the action input history to whatever action explicitly references that output.



> [!NOTE]
> If you use secured output as input to another action, that input is treated as secure only if that action produces the same data as the input that was passed to that action. So, make sure that you also enable secure outputs on that action.

When secured outputs are enabled for a run instance, the **Workflow history** API doesn't return those outputs when secure outputs were enabled for a run instance. Also, when secured inputs or outputs are enabled, you can't add Tracked Properties to that action to prevent any secure data from being emitted to Log Analytics.


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