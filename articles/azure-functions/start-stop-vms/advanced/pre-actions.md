---
title: Adding Pre Actions to Start Stop Workflows
description: This article describes the process to add a pre action to your Start Stop Workflow.
ms.topic: advanced
ms.service: azure-functions
ms.subservice: start-stop-vms
ms.date: 06/08/2022
---

# Start Stop Pre Actions

Start Stop uses [Azure Logic App](https://learn.microsoft.com/en-us/azure/logic-apps/logic-apps-overview) to manage its workflows. This make it quite simple to add actions before executing a Start/Stop VM actions. For more details, check the [Azure Logic App](https://learn.microsoft.com/en-us/azure/logic-apps/logic-apps-overview) documentation.

# Adding a new Step

> [!NOTE]
> Currently, Start Stop only supports pre actions. This is a limitation happens due the functions apps don't wait for the VMs to actually be Start/Stops, it only calls the function and continue it's execution.

To modify the existing workflow, add new steps inside the "Function-Try" step: 

 1. Add two steps after the existing action, the second one must be an Azure Function action.
 2. Select the function that represents the workflow you want to perform (AutoStop for AutoStop Worflow and Scheduled for Scheduled and Sequenced).
 3. Copy and paste the parameters for the first step into the last one.
 4. Finally, delete the first step. 

> [!NOTE]
> If your workflow fails due to any reason, it should execute the steps defined in the "Terminate" action.

Now you should have the Azure Function steps at the end of the workflow. Modify the first action to perform the step you need. 

# Troubleshoot
Follow the [Troubleshoot Guide](https://github.com/MicrosoftDocs/azure-docs/blob/main/articles/azure-functions/start-stop-vms/troubleshoot.md) or create an issue on [Start Stop V2 Deployments](https://github.com/microsoft/startstopv2-deployments) GitHub repo, so we can help you.
