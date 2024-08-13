---
title: Create Standard workflows from prebuilt templates
description: Learn to use a prebuilt template as a starting point for building a Standard logic app workflow that runs in single-tenant Azure Logic Apps.
services: azure-logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 08/23/2024
# Customer intent: As a developer, I want to use a template as a faster way to build my Standard logic app workflow that runs in single-tenant Azure Logic Apps.
---

# Create a Standard logic app workflow from a prebuilt template (Preview)

> [!IMPORTANT]
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

Azure Logic Apps gives you a faster way to start creating integration applications by providing prebuilt templates to use when you build Standard workflows in the Azure portal. These workflow templates follow commonly used patterns and help you streamline development because they offer a starting point or baseline with predefined business logic and configurations.

This how-to guide shows how to use a template to kickstart your Standard workflow.

## Limitations

Workflow templates are currently available only for Standard logic apps and single workflows.

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A Standard logic app resource. For more information, see [Create an example Standard logic app workflow](create-single-tenant-workflows-azure-portal.md).

- Access or sign-in credentials for each connection that the template creates for the workflow.

- To authenticate access for connections that support using a managed identity, you need set up your logic app resource and the managed identity with the necessary permissions.

  A managed identity provides the best option for keeping your data secure because you don't need to provide account or user credentials to sign in. The managed identity removes the burden on you to rotate credentials, secrets, access tokens, and so on because Azure manages this identity. This option also reduces security risks because unauthorized users won't have access to your sign-in credentials.

  Before you can use a managed identity for authentication, you need set up your logic app resource and the managed identity with the necessary permissions. For more information, see the following documentation:

  - [What are managed identities for Azure resources](/entra/identity/managed-identities-azure-resources/overview)?
  - [Authenticate access to Azure resources with managed identities in Azure Logic Apps](authenticate-with-managed-identity.md?tabs=standard)

## Select a template from the gallery

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the logic app menu, under **Workflows**, select **Workflows**.

1. On the **Workflows** page toolbar, select **Add** > **Add from Template**, which opens the **Templates** gallery.

   :::image type="content" source="media/create-single-tenant-workflows-templates/templates-gallery.png" alt-text="Screenshot shows Azure portal and workflow templates gallery for Standard workflows." lightbox="media/create-single-tenant-workflows-templates/templates-gallery.png":::

1. Browse the gallery or find the template you want using the search box or filters.

1. Select your template, which opens the templates overview pane.

   This pane provides more information about the workflow's purpose along with a workflow preview.

1. Select **Use this template**.

## Create connections for the workflow

After the **Create a new workflow** pane appears, the **Connections** tab lists any connections that the template needs to create.

1. To create each listed connection, in the **Connection** column, select **Connect**.

1. For each connection type, follow the prompts to provide the necesary connection information.

   If a connection type supports using a managed identity to authenticate access, choose this option. 

1. On the **Parameters** tab, provide the necessary resources or other information that the connection needs to work.

## Provide workflow information

1. On the **Name + state** tab, under **Workflow name**, provide the name to use for your workflow.

1. Under **State type**, select either **Stateful** or **Stateless**, which determines whether to record the run history, inputs, outputs, and other data for the workflow.

   For more information, see [Stateful and stateless workflows](single-tenant-overview-compare.md#stateful-stateless).

1. On the **Review + create** tab, review all the provided information for your workflow.

1. When you're ready, select **Create**.

1. When Azure finishes creating your workflow, select **Go to my workflow**.

1. On the workflow menu, under **Developer**, select **Designer** to view the workflow.

1. Continue working on the workflow by adding or removing the operations that you want. 

1. Make sure to provide the information necessary for each operation.

## Related content

[Create and publish workflow templates for Azure Logic Apps](create-publish-workflow-templates)
