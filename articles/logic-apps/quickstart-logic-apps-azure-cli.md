---
title: Create and manage logic apps with the Azure CLI
description: Use the Azure CLI to create a logic app, then manage your logic app using operations like list, show (get), update and delete.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, logicappspm
ms.topic: quickstart
ms.custom: mvc, devx-track-azurecli, contperf-fy21q2
ms.date: 11/23/2020
---

# Quickstart: Create and manage logic apps using the Azure CLI

This quickstart shows you how to create and manage logic apps by using the [Azure CLI Logic Apps extension](/cli/azure/logic) (`az logic`). From the command line, you can create a logic app by using the JSON file for a logic app workflow definition. You can then manage your logic app by running operations such as `list`, `show` (`get`), `update`, and `delete` from the command line.

> [!WARNING]
> The Azure CLI Logic Apps extension is currently *experimental* and *not covered by customer support*. Use this CLI extension with caution, especially if you choose to use the extension in production environments.

If you're new to Logic Apps, you can also learn how to create your first logic apps [through the Azure portal](quickstart-create-first-logic-app-workflow.md), [in Visual Studio](quickstart-create-logic-apps-with-visual-studio.md), and [in Visual Studio Code](quickstart-create-logic-apps-visual-studio-code.md).

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* The [Azure CLI](/cli/azure/install-azure-cli) installed on your local computer.
* The [Logic Apps Azure CLI extension](/cli/azure/azure-cli-extensions-list) installed on your computer. To install this extension, use this command: `az extension add --name logic`
* An [Azure resource group](#example---create-resource-group) in which to create your logic app.

### Prerequisite check

Validate your environment before you begin:

* Sign in to the Azure portal and check that your subscription is active by running `az login`.
* Check your version of the Azure CLI in a terminal or command window by running `az --version`. For the latest version, see the [latest release notes](/cli/azure/release-notes-azure-cli?tabs=azure-cli).
  * If you don't have the latest version, update your installation by following the [installation guide for your operating system or platform](/cli/azure/install-azure-cli).

### Example - create resource group

If you don't already have a resource group for your logic app, create the group with the command `az group create`. For example, the following command creates a resource group named `testResourceGroup` in the location `westus`.

```azurecli-interactive

az group create --name testResourceGroup --location westus

```

The output shows the `provisioningState` as `Succeeded` when your resource group is successfully created:

```output

<...>
  "name": "testResourceGroup",
  "properties": {
    "provisioningState": "Succeeded"
  },
<...>

```

## Workflow definition

Before you [create a new logic app](#create-logic-apps-from-cli) or [update an existing logic app](#update-logic-apps-from-cli) by using the Azure CLI, you need a workflow definition for your logic app. In the Azure portal, you can view your logic app's underlying workflow definition in JSON format by switching from **Designer** view to **Code view**.

When you run the commands to create or update your logic app, your workflow definition is uploaded as a required parameter (`--definition`). You must create your workflow definition as a JSON file that follows the [Workflow Definition Language schema](./logic-apps-workflow-definition-language.md).

## Create logic apps from CLI

You can create a logic app workflow from the Azure CLI using the command [`az logic workflow create`](/cli/azure/logic/workflow#az_logic_workflow_create) with a JSON file for the definition.

```azurecli

az logic workflow create --definition
                         --location
                         --name
                         --resource-group
                         [--access-control]
                         [--endpoints-configuration]
                         [--integration-account]
                         [--integration-service-environment]
                         [--state {Completed, Deleted, Disabled, Enabled, NotSpecified, Suspended}]
                         [--tags]

```

Your command must include the following [required parameters](/cli/azure/logic/workflow#az_logic_workflow_create-required-parameters):

| Parameter | Value | Description |
| --------- | ----- | ----------- |
| Workflow definition | `--definition` | A JSON file with your logic app's [workflow definition](#workflow-definition). |
| Location | `--location -l` | The Azure region in which your logic app is located. |
| Name | `--name -n` | The name of your logic app. The name can contain only letters, numbers, hyphens (`-`), underscores (`_`), parentheses (`()`), and periods (`.`). The name must also be unique across regions. |
| Resource group name | `--resource-group -g` | The [Azure resource group](../azure-resource-manager/management/overview.md) in which you want to create your logic app. [Create a resource group](#example---create-resource-group) before you begin if you don't already have one for your logic app. |

You can also include additional [optional parameters](/cli/azure/logic/workflow#az_logic_workflow_create-optional-parameters) to configure your logic app's access controls, endpoints, integration account, integration service environment, state, and resource tags.

### Example - create logic app

In this example, a workflow named `testLogicApp` is created in the resource group `testResourceGroup` in the location `westus`. The JSON file `testDefinition.json` contains the workflow definition.

```azurecli-interactive

az logic workflow create --resource-group "testResourceGroup" --location "westus" --name "testLogicApp" --definition "testDefinition.json"

```

When your workflow is successfully created, the CLI shows your new workflow definition's JSON code. If your workflow creation fails, see the [list of possible errors](#errors).

## Update logic apps from CLI

You can also update a logic app's workflow from the Azure CLI using the command [`az logic workflow create`](/cli/azure/logic/workflow#az_logic_workflow_create).

Your command must include the same [required parameters](/cli/azure/logic/workflow#az_logic_workflow_create-required-parameters) as when you [create a logic app](#create-logic-apps-from-cli). You can also add the same [optional parameters](/cli/azure/logic/workflow#az_logic_workflow_create-optional-parameters) as when creating a logic app.

```azurecli

az logic workflow create --definition
                         --location
                         --name
                         --resource-group
                         [--access-control]
                         [--endpoints-configuration]
                         [--integration-account]
                         [--integration-service-environment]
                         [--state {Completed, Deleted, Disabled, Enabled, NotSpecified, Suspended}]
                         [--tags]

```

### Example - update logic app

In this example, the [sample workflow created in the previous section](#example---create-logic-app) is updated to use a different JSON definition file, `newTestDefinition.json`, and add two resource tags, `testTag1` and `testTag2` with description values.

```azurecli-interactive

az logic workflow create --resource-group "testResourceGroup" --location "westus" --name "testLogicApp" --definition "newTestDefinition.json" --tags "testTag1=testTagValue1" "testTag2=testTagValue"

```

When your workflow is successfully updated, the CLI shows your logic app's updated workflow definition. If your update fails, see the [list of possible errors](#errors).

## Delete logic apps from CLI

You can delete a logic app's workflow from the Azure CLI using the command [`az logic workflow delete`](/cli/azure/logic/workflow#az_logic_workflow_delete).

Your command must include the following [required parameters](/cli/azure/logic/workflow#az_logic_workflow_delete-required-parameters):

| Parameter | Value | Description |
| --------- | ----- | ----------- |
| Name | `--name -n` | The name of your logic app. |
| Resource group name | `-resource-group -g` | The resource group in which your logic app is located. |

You can also include an [optional parameter](/cli/azure/logic/workflow#az_logic_workflow_delete-optional-parameters) to skip confirmation prompts, `--yes -y`.

```azurecli

az logic workflow delete --name
                         --resource-group
                         [--yes]

```

The CLI then prompts you to confirm the deletion of your logic app. You can skip the confirmation prompt by using the optional parameter `--yes -y` with your command.

```azurecli

Are you sure you want to perform this operation? (y/n):

```

You can confirm a logic app's deletion by [listing your logic apps in the CLI](#list-logic-apps-in-cli), or by viewing your logic apps in the Azure portal.

### Example - delete logic app

In this example, the [sample workflow created in a previous section](#example---create-logic-app) is deleted.

```azurecli-interactive

az logic workflow delete --resource-group "testResourceGroup" --name "testLogicApp"

```

After you respond to the confirmation prompt with `y`, the logic app is deleted.

## Show logic apps in CLI

You can get a specific logic app workflow using the command [`az logic workflow show`](/cli/azure/logic/workflow#az_logic_workflow_show).

```azurecli

az logic workflow show --name
                       --resource-group

```

Your command must include the following [required parameters](/cli/azure/logic/workflow#az_logic_workflow_show-required-parameters)

| Parameter | Value | Description |
| --------- | ----- | ----------- |
| Name | `--name -n` | The name of your logic app. |
| Resource group name | `--resource-group -g` | The name of the resource group in which your logic app is located. |

### Example - get logic app

In this example, the logic app `testLogicApp` in the resource group `testResourceGroup` is returned with full logs for debugging.

```azurecli-interactive

az logic workflow show --resource-group "testResourceGroup" --name "testLogicApp" --debug

```

## List logic apps in CLI

You can list your logic apps by subscription using the command [`az logic workflow list`](/cli/azure/logic/workflow#az_logic_workflow_list). This command returns the JSON code for your logic apps' workflows.

You can filter your results by the following [optional parameters](/cli/azure/logic/workflow#az_logic_workflow_list-optional-parameters):

| Parameter | Value | Description |
| --------- | ----- | ----------- |
| Resource group name | `--resource-group -g` | The name of the resource group by which you want to filter your results. |
| Number of items | `--top` | The number of items that are included in your results. |
| Filter | `--filter` | The type of filter that you're using on your list. You can filter by state (`State`), trigger (`Trigger`), and the identifier of the referenced resource (`ReferencedResourceId`). |

```azurecli

az logic workflow list [--filter]
                       [--resource-group]
                       [--top]

```

### Example - list logic apps

In this example, all enabled workflows in the resource group `testResourceGroup` are returned in an ASCII table format.

```azurecli-interactive

az logic workflow list --resource-group "testResourceGroup" --filter "(State eq 'Enabled')" --output "table"

```

## Errors

The following error indicates that the Azure Logic Apps CLI extension isn't installed. Follow the steps in the prerequisites to [install the Logic Apps extension](#prerequisites) on your computer.

```output

az: 'logic' is not in the 'az' command group. See 'az --help'. If the command is from an extension, please make sure the corresponding extension is installed. To learn more about extensions, please visit https://docs.microsoft.com/cli/azure/azure-cli-extensions-overview

```

The following error might indicate that the file path for uploading your workflow definition is incorrect.

```output

Expecting value: line 1 column 1 (char 0)

```

## Global parameters

You can use the following optional global Azure CLI parameters with your `az logic` commands:

| Parameter | Value | Description |
| --------- | ----- | ----------- |
| Output format | `--output -o` | Change the [output format](/cli/azure/format-output-azure-cli) from the default JSON. |
| Only show errors | `--only-show-errors` | Suppress warnings and only show errors. |
| Verbose | `--verbose` | Show verbose logs. |
| Debug | `--debug` | Shows all debug logs. |
| Help message | `--help -h` | Show help dialog. |
| Query | `--query` | Set a JMESPath query string for JSON output. |

## Next steps

For more information on the Azure CLI, see the [Azure CLI documentation](/cli/azure/).

You can find additional Logic Apps CLI script samples in [Microsoft's code samples browser](/samples/browse/?products=azure-logic-apps).

Next, you can create an example app logic through the Azure CLI using a sample script and workflow definition.

> [!div class="nextstepaction"]
> [Create logic app using sample script](sample-logic-apps-cli-script.md).
