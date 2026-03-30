---
title: Connect to Azure Container Instances
description: Learn how to automate container deployments in Azure Container Instances by using Azure Logic Apps. Build workflows to create, manage, and optimize containers.
services: logic-apps, container-instances
ms.service: azure-logic-apps
ms.suite: integration
ms.reviewers: estfan, azla
ms.topic: how-to
ms.date: 02/24/2026
ms.custom: sfi-image-nochange
#Customer intent: As an integration developer who works with Azure Logic Apps, I want to connect, create, and manage container deployments in Azure Container Instances by building automation workflows in Azure Logic Apps.
---

# Create and manage container deployments in Azure Container Instances by using Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

When you need to automate container deployments, build a logic app workflow that uses the Azure Container Instance connector in Azure Logic Apps. For example, automate tasks such as deploying and managing [container groups](/azure/container-instances/container-instances-container-groups), retrieving properties, or accessing logs. The following list includes other tasks you can automate:

- Create, update, or delete a container group and container instances.
- Get the properties from a container group.
- Get a list of container groups.
- Get the logs for a container instance.

You can also use the output from these actions in other workflow actions.

This guide shows how to add an Azure Container Instance action to your workflow.

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- The container group with the container instance to connect from your workflow.

  For more information, see [Quickstart: Deploy a container instance in Azure using the Azure portal](/azure/container-instances/container-instances-quickstart-portal).

- The logic app workflow from where you want to access your container instance.

  The Azure Container Instance connector provides only actions, so your workflow needs to start with a trigger that best suits your business scenario. For example, to run a container workload on a schedule, use the **Recurrence** trigger. Or, to deploy a container group after a specific event, such as when the workflow receives an email in Outlook, use the trigger named **When a new email arrives**. For simplicity, this example uses the **Recurrence** trigger.

  To add a trigger to your workflow, follow the [general steps](../logic-apps/add-trigger-action-workflow.md#add-trigger) for the trigger you want. Set up the corresponding connection, if necessary.

  For more information, see:

  - [Create a Consumption logic app workflow](../logic-apps/quickstart-create-example-consumption-workflow.md)

  - [Create a Standard logic app workflow](../logic-apps/create-single-tenant-workflows-azure-portal.md)

## Connector technical reference

For more information about the operations and limits for this connector, see the connector's [reference page](/connectors/aci/) or container group [YAML reference](/azure/container-instances/container-instances-reference-yaml).

## Add an Azure Container Instance connector action

This section shows how to add an Azure Container Instance connector action to a workflow that already starts with a trigger.

1. In the [Azure portal](https://portal.azure.com), open your logic app resource and workflow in the designer.

1. Under the trigger, add the Azure Container Instance connector action you want by following the [general steps](../logic-apps/add-trigger-action-workflow.md#add-action).

   This example adds the action named **Create or update a container group**.

1. After the connection information pane opens, select the required **Authentication** type, and provide the corresponding information as prompted.

1. Provide the following information about the container group and one or more container instances in the group, for example:

   | Parameter | Description |
   |-----------|-------------|
   | **Subscription Id** | The Azure subscription for your container group. |
   | **Resource Group** | The Azure resource group for your container group. |
   | **Container Group Name** | The name for your container group.
   | **Container Group Location** | The Azure region for your container group. |
   | **ContainerGroup containers** | One or more container instances in your container group. |

   The following screenshot shows an example:

   :::image type="content" source="./media/connectors-create-api-container-instances/create-update-container-group.png" alt-text="Screenshot that shows the Azure portal, workflow designer, and selected action. Action pane shows information for the container group and container instances to create or update.":::

1. Save your workflow. On the designer toolbar, select **Save**.

1. Continue adding actions to your workflow, if necessary.

## Sample

For a sample that analyzes the sentiment of an email, see the [sample logic app](https://github.com/Azure-Samples/aci-logicapps-integration) that runs a container in Azure Container Instances.

## Related content

- [Connectors in Azure Logic Apps](introduction.md)
