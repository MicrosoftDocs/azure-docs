---
title: "Quickstart: Migrate Linux Consumption apps to Flex Consumption using GitHub Copilot"
description: Use GitHub Copilot with Azure skills to interactively migrate your Linux function apps from the Consumption plan to the Flex Consumption plan.
ms.service: azure-functions
ms.collection:
  - migration
ms.date: 04/07/2026
ms.topic: quickstart

#customer intent: As a developer, I want to use GitHub Copilot to more easily migrate my Linux Consumption plan function apps to the Flex Consumption plan so that I can get better performance and features.
---

# Quickstart: Migrate Linux Consumption apps to Flex Consumption using GitHub Copilot

In this quickstart, use GitHub Copilot with the Azure skills plugin to interactively migrate your Linux function apps from the [Consumption plan](../consumption-plan.md) to the [Flex Consumption plan](../flex-consumption-plan.md). Copilot automates most of the migration, including assessment, app creation, configuration, deployment, and validation.

> [!IMPORTANT]  
> This article demonstrates how to use Copilot to recreate an existing Linux Consumption app in a Flex Consumption plan. The [Azure skill](https://github.com/microsoft/GitHub-Copilot-for-Azure/blob/main/plugin/skills/azure-upgrade/references/services/functions/consumption-to-flex.md) that Copilot uses to achieve the migration work is designed to work with most Linux Consumption apps. For high-value production apps, apps with complex deployments or dependencies, and for Consumption apps running on Windows, follow [Migrate Consumption plan apps to the Flex Consumption plan](migrate-plan-consumption-to-flex.md).

You can review the specific skill used by Copilot when performing this migration in the [GitHub Copilot Azure skills repository](https://github.com/microsoft/GitHub-Copilot-for-Azure/blob/main/plugin/skills/azure-upgrade/references/services/functions/consumption-to-flex.md).  

## Prerequisites

+ An Azure subscription with one or more Linux function apps running on the Consumption plan.

+ The account used for the migration must have the **Owner** or **Contributor** role in the resource group containing your function apps. For the full list of required permissions, see [Prerequisites](migrate-plan-consumption-to-flex.md#prerequisites).

+ [Azure CLI](/cli/azure), version 2.77.0 or later.

+ Configure GitHub Copilot in your preferred mode:

    [!INCLUDE [functions-copilot-setup](~/includes/functions-copilot-setup.md)]

## Migrate your apps

Use this prompt to start an interactive migration that scans your subscription and lets you choose which apps to migrate:

```
migrate my linux function apps in azure from consumption to flex consumption
```

Copilot follows the [migration  guide](migrate-plan-consumption-to-flex.md) and identifies your eligible Linux Consumption apps, lets you choose which ones to migrate, and then handles assessment, app creation, and configuration migration for each app. 

You might be asked by Copilot for feedback during the migration, as needed for a successful migration.
## Migration results

When complete, Copilot generates helpful output, which includes: 

+ A summary table with the status of each migrated app. 
+ A brief summary of the overall tasks accomplished.
 + A list of any remaining post-migration tasks that it couldn't complete or that must be done by you. 

## Verify the migration

While Copilot does its best to validate the state of your migrated app, always verify that your new app works correctly:

1. In the [Azure portal](https://portal.azure.com), ensure that each new Flex Consumption app shows a **Status** of `Running`.

1. Call at least one HTTP trigger endpoint or otherwise trigger your new app to confirm it responds as expected.

## (Optional) Remove the original app

When you're confident the new app works correctly, remove the original Consumption plan app. If you keep the original app in place, remember to [disable any triggers](../disable-function.md) to avoid duplicate processing or competing with the new app.

Use this command to remove the original app:

```
delete my original consumption app <ORIGINAL_APP_NAME>
```

Copilot always asks for your explicit confirmation before deleting anything.

> [!IMPORTANT]
> Before deleting, make sure you migrate all functionality, verify no traffic goes to the original app, and back up any relevant logs or configuration.

## Next step

> [!div class="nextstepaction"]
> [How to use the Flex Consumption plan](../flex-consumption-how-to.md)
