---
title: TBD - Azure API Center
description: TBD.
ms.service: api-center
ms.topic: how-to
ms.date: 07/24/2024
ms.author: danlep
author: dlepow
ms.custom: 
# Customer intent: As an API program manager, I want to automate a workflow for an individual to receive a Microsoft Teams notification to approve an API that is registered in my organization's API center.
---

# Set up a notification workflow for API approval in your Azure API center

This article shows how to set up a notification workflow for API approval in your organization's [API center](overview.md) using [Azure Logic Apps](../logic-apps/logic-apps-overview.md) and Microsoft Teams. A logic app workflow sends a notification to a designated individual when an API is registered in the API center. The individual can then approve or reject the API registration directly from the notification in Microsoft Teams.

## Prerequisites

* An API center in your Azure subscription. If you haven't created one already, see [Quickstart: Create your API center](set-up-api-center.md).
* A standard logic apps resource in your Azure subscription. If you haven't created one already, see [Create an example Standard workflow in single-tenant Azure Logic Apps with the Azure portal](../logic-apps/create-single-tenant-workflows-azure-portal.md).
* Permissions to....
* The Event Grid resource provider registered in your subscription. If you need to register the Event Grid resource provider, see [Subscribe to events published by a partner with Azure Event Grid](../event-grid/subscribe-to-partner-events.md#register-the-event-grid-resource-provider).

* For Azure CLI:
    [!INCLUDE [include](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

    [!INCLUDE [install-apic-extension](includes/install-apic-extension.md)]

## Add a managed identity in your API center

For this scenario, your API center uses a [managed identity](/entra/identity/managed-identities-azure-resources/overview) to access a logic app workflow. Depending on your needs, configure either a system-assigned or a user-assigned managed identity. 

The following examples show how to configure a system-assigned managed identity by using the Azure portal or the Azure CLI. At a high level, configuration steps are similar for a user-assigned managed identity. 

#### [Portal](#tab/portal)

1. In the [portal](https://azure.microsoft.com), navigate to your API center.
1. In the left menu, under **Security**, select **Managed identities**.
1. Select **System assigned**, and set the status to **On**.
1. Select **Save**.


#### [Azure CLI](#tab/cli)

Set the system-assigned identity in your API center using the following [az apic update](/cli/azure/apic#az-apic-update) command. Substitute the names of your API center and resource group:

```azurecli 
az apic update --name <api-center-name> --resource-group <resource-group-name> --identity '{"type": "SystemAssigned"}'
```

## Add a custom metadata property

Add a [custom metadata property](metadata.md) to the API registration in your API center to set *api-status*.

1. In the [Azure portal](https://portal.azure.com), navigate to your API center.
1. In the left menu, under **Assets**, select **Metadata** > **+ New metadata**.
1. In the **Details** tab, enter the following details:
    1. In **Title**, enter *api-status*.
    1. In **Type**, select **Predefined choices**.
    1. Add the following predefined choices: *new*, *pending*, *approved*. Select **Next**.
1. In the **Assignments** tab, next to **APIs**, select **Optional**. 
1. Optionally make assignments to **Deployments** and **Environments**. Select **Next**.
1. Review the configuration and select **Create**.

## Configure Logic Apps event subscription

This section provides the manual steps to configure an event subscription that triggers a logic app workflow when an API is registered in your API center.

1. In the [Azure portal](https://portal.azure.com), navigate to your API center.
1. In the left menu, select **Events** > **Logic Apps**.
1. Select **Sign in** to sign in to your Azure account.
<!-- Which authentication method should customer choose? -->
1. In the **When a resource event occurs** pane:
    1. Select **Microsoft.ApiCenter.Services** as the **Resource type**.
    1. In **Resource Name**, confirm the name of your API center.
    1. In **Event Type Item - 1**, select **Microsoft.ApiCenter.ApiAdded**.
    1. Select **+ New step**.
1. Select **Variables** > **Initialize variable**. In the **Initialize variable** pane:
    1. In **Name**, enter *subjectvar*.
    1. In **Type**, select **String**.
    1. In **Value**, select **Add dynamic content** > **Expression**. Enter `triggerBody()?['subject']`. Select **OK**.
    1. Select **+ New step**.
1. Select **Variables** > **Initialize variable**. In the **Initialize variable** pane:
    1. In **Name**, enter *versionvar*.
    1. In **Type**, select **String**.
    1. In **Value**, enter `?api-version=2024-03-01`. Select **OK**.
1. Select **Save as** to save your logic app workflow that you've configured so far. 
    1. In the **Create a logic app** pane, enter a name for your logic app.
    1. Optionally configure other settings. Select **Create**.

> [!NOTE]
> You'll continue configuring the logic app workflow in a later section, after configuring a managed identity in the logic app and testing the event subscription.
 
## Enable a managed identity in your logic app

For this scenario, the logic app uses a managed identity to access the Azure API center. Depending on your needs, configure either a system-assigned or user-assigned managed identity. For configuration steps, see [Authenticate access and connections to Azure resources with managed identities in Azure Logic Apps](../logic-apps/authenticate-with-managed-identity.md).

Assign the logic app managed identity the necessary permissions to access the API center. For this scenario, assign the **Contributor** role to the managed identity.

1. In the [Azure portal](https://portal.azure.com), navigate to your API center and select **Access control (IAM)**.
1. Select **+ Add > Add role assignment**.
1. Select **Privileged administrator roles** and then select **Contributor**. Select **Next**.
1. On the **Members** page, in **Assign access to**, select **Managed identity > + Select members**.
1. On the **Select managed identities** page, search for and select the managed identity of the function app. Click **Select** and then **Next**.
1. Review the role assignment, and select **Review + assign**.


## Test the event subscription

To test the event subscription, register an API in your API center. The event subscription triggers the logic app workflow when the API is registered.

1. In the [Azure portal](https://portal.azure.com), navigate to your logic app.
1. In the left menu, under **Developer Tools**, select **Run History**.
1. Check the status of the logic app run. If the logic app run has a status of **Succeeded**, select the run to see the details.
1. Select the **When a resource event occurs** pane at the top of the workflow. 
    1. Review the **Inputs** section to confirm that the `Microsoft.ApiCenter.ApiAdded` event was triggered.
    1. Review the **body** of the **Outputs** section to confirm that the event data was received by the logic app. 

## Continue configuration of the logic app workflow

1. In the left menu of the logic app, under **Developer Tools**, select **Logic app designer**.
1. Insert an action after the last step you configured previously.
1. In the search box, enter *HTTP*. Under **Actions**, select **HTTP**. In the **HTTP** pane:
    1. In **Method**, select **GET**.
    1. In **URI**, enter `https://management.azure.com/`. Select **Add dynamic content** and then select variables *subjectvar* and *versionvar*.
    1. Select **Add new parameter**. Select **Authentication**.
        1. In **Authentication type**, select **Managed Identity**. 
        1. In **Managed identity**, select **System-assigned managed identity**.
        1. In **Audience**, enter `https://management.azure.com/`.
    <!-- There's a validation note "Please enable managed identity for the logic app. Expected?? -->
        1. Select **+ New step**.
1. In the search box, enter *Parse JSON*. Under **Actions**, select **Parse JSON**. In the **Parse JSON** pane:
    1. In **Content**, select **Add dynamic content** > **Body**.
    1. In **Schema**, select **Use sample payload to generate schema** and then enter the following:
        ```json
        {
        "type": "object",
        "properties": {
                "id": {
                    "type": "string"
                },
                "topic": {
                    "type": "string"
                },
                "subject": {
                    "type": "string"
                },
                "data": {
                    "type": "object",
                    "properties": {}
                },
                "eventType": {
                    "type": "string"
                },
                "dataVersion": {
                    "type": "string"
                },
                "metadataVersion": {
                    "type": "string"
                },
                "eventTime": {
                    "type": "string"
                }
            }
        }
        ``` 
    1. Select **+ New step**.
1. Select **Variables** > **Initialize variable**. In the **Initialize variable** pane:
    1. In **Name**, enter *customPropertiesVariable*.
    1. In **Type**, select **String**.
    1. In **Value**, select **Add dynamic content**. Select 




## Related content

* [Event Grid schema for Azure API Center](../event-grid/event-schema-api-center.md)
