---
title: Azure CLI script sample - create a logic app
description: Sample script to create a logic app through the Logic Apps extension in the Azure CLI.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, logicappspm
ms.topic: article
ms.custom: mvc, devx-track-azurecli
ms.date: 07/30/2020
---

# Azure CLI script sample - create a logic app

This script creates a sample logic app through the [Azure CLI Logic Apps extension](/cli/azure/logic), (`az logic`). For a detailed guide to creating and managing logic apps through the Azure CLI, see the [Logic Apps quickstart for the Azure CLI](quickstart-logic-apps-azure-cli.md).

> [!WARNING]
> The Azure CLI Logic Apps extension is currently *experimental* and *not covered by customer support*. Use this CLI extension with caution, especially if you choose to use the extension in production environments.

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* The [Azure CLI](/cli/azure/install-azure-cli) installed on your local computer.
* The [Logic Apps Azure CLI extension](/cli/azure/azure-cli-extensions-list) installed on your computer. To install this extension, use this command: `az extension add --name logic`
* A [workflow definition](quickstart-logic-apps-azure-cli.md#workflow-definition) for your logic app. This JSON file must follow the [Workflow Definition language schema](logic-apps-workflow-definition-language.md).
* An API connection to an email account through a supported [Logic Apps connector](../connectors/apis-list.md) in the same resource group as your logic app. This example uses the [Office 365 Outlook](../connectors/connectors-create-api-office365-outlook.md) connector, but you can also use other connectors like [Outlook.com](../connectors/connectors-create-api-outlook.md).

### Prerequisite check

Validate your environment before you begin:

* Sign in to the Azure portal and check that your subscription is active by running `az login`.

* Check your version of the Azure CLI in a terminal or command window by running `az --version`. For the latest version, see the [latest release notes](/cli/azure/release-notes-azure-cli).

  * If you don't have the latest version, update your installation by following the [installation guide for your operating system or platform](/cli/azure/install-azure-cli).

### Sample workflow explanation

This example workflow definition file creates the same basic logic app as the [Logic Apps quickstart for the Azure portal](quickstart-create-first-logic-app-workflow.md). 

This sample workflow: 

1. Specifies a schema, `$schema`, for the logic app.

1. Defines a trigger for the logic app in the list of triggers, `triggers`. The trigger recurs (`recurrence`) every 3 hours. The actions are triggered when a new feed item is published (`When_a_feed_item_is_published`) for the specified RSS feed (`feedUrl`).

1. Defines an action for the logic app in the list of actions, `actions`. The action sends an email (`Send_an_email_(V2)`) through Microsoft 365 with details from the RSS feed items as specified in the body section (`body`) of the action's inputs (`inputs`).

## Sample workflow definition

Before you run the sample script, you must first create a sample [workflow definition](#prerequisites).

1. Create a JSON file, `testDefinition.json` on your computer. 

1. Copy the following content into the JSON file: 
    ```json
    
    {
        "definition": {
            "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
            "actions": {
                "Send_an_email_(V2)": {
                    "inputs": {
                        "body": {
                            "Body": "<p>@{triggerBody()?['publishDate']}<br>\n@{triggerBody()?['title']}<br>\n@{triggerBody()?['primaryLink']}</p>",
                            "Subject": "@triggerBody()?['title']",
                            "To": "test@example.com"
                        },
                        "host": {
                            "connection": {
                                "name": "@parameters('$connections')['office365']['connectionId']"
                            }
                        },
                        "method": "post",
                        "path": "/v2/Mail"
                    },
                    "runAfter": {},
                    "type": "ApiConnection"
                }
            },
            "contentVersion": "1.0.0.0",
            "outputs": {},
            "parameters": {
                "$connections": {
                    "defaultValue": {},
                    "type": "Object"
                }
            },
            "triggers": {
                "When_a_feed_item_is_published": {
                    "inputs": {
                        "host": {
                            "connection": {
                                "name": "@parameters('$connections')['rss']['connectionId']"
                            }
                        },
                        "method": "get",
                        "path": "/OnNewFeed",
                        "queries": {
                            "feedUrl": "https://www.pbs.org/now/rss.xml"
                        }
                    },
                    "recurrence": {
                        "frequency": "Hour",
                        "interval": 3
                    },
                    "splitOn": "@triggerBody()?['value']",
                    "type": "ApiConnection"
                }
            }
        },
        "parameters": {
            "$connections": {
                "value": {
                    "office365": {
                        "connectionId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testResourceGroup/providers/Microsoft.Web/connections/office365",
                        "connectionName": "office365",
                        "id": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Web/locations/westus/managedApis/office365"
                    },
                    "rss": {
                        "connectionId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testResourceGroup/providers/Microsoft.Web/connections/rss",
                        "connectionName": "rss",
                        "id": "/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Web/locations/westus/managedApis/rss"
                    }
                }
            }
        }
    }
    
    ```

1. Update the placeholder values with your own information:

    1. Replace the placeholder email address (`"To": "test@example.com"`). You need to use an email address compatible with Logic Apps connectors. For more information, see the [prerequisites](#prerequisites).

    1. Replace additional connector details if you're using another email connector than the Office 365 Outlook connector.

    1. Replace the placeholder subscription values (`00000000-0000-0000-0000-000000000000`) for your connection identifiers (`connectionId` and `id`) under the connections parameter (`$connections`) with your own subscription values.

1. Save your changes.

## Sample script

> [!NOTE]
> This sample is written for the `bash` shell. If you want to run this sample in another shell, such as Windows PowerShell or Command Prompt, you might need to make modifications to your script.

Before you run this sample script, run this command to connect to Azure:

```azurecli-interactive

az login

```

Next, navigate to the directory in which you created your workflow definition. For example, if you created the workflow definition JSON file on your desktop:

```azurecli

cd ~/Desktop

```

Then, run this script to create a logic app. 

```azurecli-interactive

#!/bin/bash

# Create a resource group

az group create --name testResourceGroup --location westus

# Create your logic app

az logic workflow create --resource-group "testResourceGroup" --location "westus" --name "testLogicApp" --definition "testDefinition.json"

```

### Clean up deployment

After you've finished using the sample script, run the following command to remove your resource group and all of its nested resources, including the logic app.

```azurecli-interactive

az group delete --name testResourceGroup --yes

```

## Script explanation

This sample script uses the following commands to create a new resource group and logic app.

| Command | Notes |
| ------- | ----- |
| [`az group create`](/cli/azure/group#az_group_create) | Creates a resource group in which your logic app's resources are stored. |
| [`az logic workflow create`](/cli/azure/logic/workflow#az_logic_workflow_create) | Creates a logic app based on the workflow defined in the parameter `--definition`. |
| [`az group delete`](/cli/azure/vm/extension) | Deletes a resource group and all of its nested resources. |

## Next steps

For more information on the Azure CLI, see the [Azure CLI documentation](/cli/azure/).

You can find additional Logic Apps CLI script samples in [Microsoft's code samples browser](/samples/browse/?products=azure-logic-apps).
