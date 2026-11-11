---
title: Configure and view live data
description: Use the operations experience web UI or the VS Code extension to view live data streamed from your assets.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 11/09/2026

#CustomerIntent: As an IT administrator, I want to enable and govern live data access for my Azure IoT Operations environments. As an OT professional, I want to view the live data streamed by my assets, so that I can effectively monitor and troubleshoot my environment and build data flows.
---

# Configure and view live data

Viewing live data in Azure IoT Operations lets you inspect messages in near real time to verify that data is arriving, with the shape and values that you expect. The operations experience web UI lets you view datasets, while the Azure IoT Operations Data Flow extension for Visual Studio Code lets you inspect select MQTT topics. For operational technology (OT) users, these capabilities greatly enhance their ability to monitor and troubleshoot their Azure IoT Operations environment. Information technology (IT) administrators maintain control over enabling Live Data on Azure IoT Operations instances and governing access to the data.

Currently, Live Data is supported on Azure IoT Operations version 1.6.x (preview) and later. Live Data requires an [Event Grid namespace with MQTT enabled](/azure/event-grid/mqtt-overview).

## Live Data infrastructure and user sessions

When an IT administrator enables Live Data on an Azure IoT Operations instance, shared, instance-level infrastructure is provisioned and configured:

- An observability topic space is configured in the Event Grid namespace.
- A dedicated data flow profile and an Event Grid MQTT data flow endpoint are configured on the Azure IoT Operations instance.
- The outbound identity and the per-instance observability endpoint entry (keyed by the instance's custom location) are configured in the Azure Device Registry (ADR) namespace.

The IT administrator also enables Live Data for each intended user, controlling whether they can view data in the operations experience web UI, the VS Code extension, or both. Some additional configuration is necessary for users to view data in the VS Code extension.

The OT user experience and IT governance scenario is slightly different between the operations experience web UI and the VS Code extension:

- **Operations experience**:

  - The IT administrator enables Live Data for the OT user.
  - The OT user can view datasets from any asset in the ADR namespace, but not events or streams.

- **Azure IoT Operations Data Flow VS Code extension**:

  - The IT administrator enables Live Data for the OT user. During enablement, the Azure CLI grants the `EventGrid TopicSpaces Subscriber` role on the live-data topic space configured for the Azure IoT Operations instance on the Event Grid namespace. The administrator grants additional Azure roles to the OT user on the resource group containing the Azure IoT Operations instance and on the subscription.
  - An OT user can select MQTT topics in the live-data topic space, including wildcard topic filters, and view messages published to those topics. Unlike the operations experience, this path isn't constrained by ADR asset authorization or limited to datasets.

When an OT user starts viewing live data, Azure IoT Operations creates a session-specific data flow graph that uses the shared infrastructure configured by the IT administrator. The data flow graph routes messages from the Azure IoT Operations MQTT broker through the Live Data Event Grid data flow endpoint to the instance's Live Data topic space in Event Grid. When the viewing session ends, the session data flow graph is deleted; the shared Live Data infrastructure remains available for other users and future sessions.

How the user receives those messages depends on the client.

- In the operations experience, the user selects an asset and dataset, and ADR verifies that the user has read access to the ADR namespace and selected asset before the Live Data session starts. ADR subscribes to Event Grid for the Live Data messages and streams the selected dataset's messages to the operations experience.

- In the VS Code extension, the user instead selects one or more MQTT topics, including wildcard topic filters, and the extension subscribes to the Live Data topic space in Event Grid. The VS Code path therefore doesn't use ADR asset authorization and requires the user to have permission to create and delete the session data flow graph and to subscribe to the Event Grid Live Data topic space.

## Prerequisites

- A preview instance of Azure IoT Operations (version 1.6.0-preview.60 (2610) or later) deployed in a Kubernetes cluster. For more information, see [Deploy Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md). Ensure you select a preview version of Azure IoT Operations in the Azure portal when following the deployment instructions.

- The Azure CLI installed on your development machine. Check [Available Azure CLI extensions](/cli/azure/azure-cli-extensions-list) for the minimum required version to use the **azure-iot-ops** extension. Use `az --version` to check your version and `az upgrade` to update if necessary. For more information, see [Install the Azure CLI](/cli/azure/install-azure-cli).

- The Azure IoT Operations extension for the Azure CLI. Use the following command to add the extension or update it to the latest version:

  ```azurecli
  az extension add --upgrade --name azure-iot-ops
  ```

  > [!IMPORTANT]
  > Ensure that the version of the azure-iot-ops extension is 2.11.2 or later. Use `az extension show --name azure-iot-ops` to check the installed version.

- An Event Grid namespace with MQTT enabled. If you don't have one, see [Create, view, and manage Azure Event Grid namespaces](/azure/event-grid/create-view-manage-namespaces).

  - Set the `Maximum client sessions per authentication name` property on the Event Grid namespace to a value that permits the number of concurrent live-data sessions you expect, such as 10. The default value of 1 prevents concurrent live-data sessions that share an authentication identity. Update this property under **Settings > Properties** in the Azure portal.

- The IT administrator must have the necessary permissions to configure and manage Live Data on the Azure IoT Operations instance. Ensure the following Azure roles are assigned:

    | Resource | Azure role | Comments |
    | ---|---|---|
    | Azure IoT Operations resource group | [**Contributor**](/azure/role-based-access-control/built-in-roles/privileged#contributor) | Used by `az iot ops live-data enable` to configure the Azure IoT Operations instance and related resources for live data. |
    | Azure IoT Operations subscription | [**Role Based Access Control Administrator**](/azure/role-based-access-control/built-in-roles/privileged#role-based-access-control-administrator) | Used by the IT administrator when configuring VS Code users to assign [**Reader**](/azure/role-based-access-control/built-in-roles/general#reader) on the subscription and **Contributor** on the Azure IoT Operations resource group to each user. |
    | Azure Device Registry namespace | **Contributor** | Used by `az iot ops live-data enable` to configure the Azure Device Registry namespace for live data. |
    | Azure Device Registry namespace | **Role Based Access Control Administrator** | Used by `az iot ops live-data enable` to assign **Reader** on the Azure Device Registry namespace to each user specified with `--user-object-ids`. |
    | Event Grid namespace | [**EventGrid Contributor**](/azure/role-based-access-control/built-in-roles/integration#eventgrid-contributor) | Used by `az iot ops live-data enable` to create and configure the Event Grid resources required for live data. |
    | Event Grid namespace | **Role Based Access Control Administrator** | Used by `az iot ops live-data enable` to assign [**EventGrid TopicSpaces Publisher**](/azure/role-based-access-control/built-in-roles/integration#eventgrid-topicspaces-publisher) to the Azure IoT Operations identity and [**EventGrid TopicSpaces Subscriber**](/azure/role-based-access-control/built-in-roles/integration#eventgrid-topicspaces-subscriber) to the Azure Device Registry outbound identity. Also used to assign **EventGrid TopicSpaces Subscriber** to each (VS Code) user specified with `--subscriber-object-ids`. Used by the IT administrator when disabling VS Code users to remove **EventGrid TopicSpaces Subscriber** for the user on the live-data topic space. |

- To use VS Code to view live data, install the latest version of the [Azure IoT Operations Data Flow VS Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azureiotoperations.azure-iot-operations-data-flow-vscode).

- [!INCLUDE [iot-operations-entra-id-setup](../includes/iot-operations-entra-id-setup.md)]

[!INCLUDE [set-environment-variables](../includes/set-environment-variables.md)]

## Configure Live Data on an Azure IoT Operations instance

An IT administrator must configure and enable Live Data on an Azure IoT Operations instance before an OT user can view asset data in the Operations experience web UI or the VS Code extension. The administrator must ensure that the appropriate permissions are granted to the OT users for accessing live data.

Use the [az iot ops live-data](/cli/azure/iot/ops/live-data) Azure CLI command group to configure and manage Live Data on your Azure IoT Operations instance. The commands in this group are currently in preview.

For simplicity, the commands in this section assume that the ADR namespace, Event Grid namespace, and Azure IoT Operations instance are all located in the same subscription and resource group. The commands might need to be adjusted if your resources are in different subscriptions or resource groups.

To configure Live Data for a user on your Azure IoT Operations instance, follow these steps:

1. Sign in to Azure CLI and select your subscription.

   ```azurecli
   az login
   ```

   Select your subscription from the list of subscriptions displayed by the `az login` command after you're authenticated.

1. Set the resource ID for your Event Grid namespace as an environment variable. Replace `<event-grid-namespace-name>` with your Event Grid namespace name.

   ```azurecli
   EVENT_GRID_NAMESPACE_ID=$(az eventgrid namespace show --name <event-grid-namespace-name> --resource-group $RESOURCE_GROUP --query id -o tsv)
   ```

1. Get the Microsoft Entra user object ID for the user you want to grant access to live data. Replace `<user-principal-name>` with the user principal name of the user.

   ```azurecli
   USER_OBJECT_ID=$(az ad user show --id <user-principal-name> --query id -o tsv)
   ```

1. Enable viewing live data on the Azure IoT Operations instance. The commands in this step configure the necessary infrastructure and permissions for the user to view live data.

    - Enable viewing live data in the operations experience web UI for a user.

        ```azurecli
        az iot ops live-data enable --instance $AIO_INSTANCE_NAME -g $RESOURCE_GROUP --eg-resource-id $EVENT_GRID_NAMESPACE_ID --ra-scope topic-space --user-object-ids $USER_OBJECT_ID
        ```

        The user or users specified in the `--user-object-ids` parameter are assigned the `Reader` role on the ADR namespace so they can view live data in the operations experience web UI.

    - Enable viewing live data in the VS Code extension for a user:

        ```azurecli
        az iot ops live-data enable --instance $AIO_INSTANCE_NAME -g $RESOURCE_GROUP --eg-resource-id $EVENT_GRID_NAMESPACE_ID --ra-scope topic-space --subscriber-object-ids $USER_OBJECT_ID
        ```

        The user or users specified in the `--subscriber-object-ids` parameter are assigned the `EventGrid TopicSpaces Subscriber` role on the Event Grid namespace so they can subscribe to live data from the topic space.

    This command provisions and configures the shared, instance-level infrastructure required for Live Data, using default settings, with the exception of the `ra-scope` parameter which specifies the Event Grid topic space scope for role assignments. After the command runs successfully, the following role assignments are in place:

    - The system-assigned managed identity is used for the Event Grid data flow endpoint and the ADR namespace outbound identity.
    - The `EventGrid TopicSpaces Subscriber` role on the Event Grid namespace is assigned to the ADR namespace outbound identity.
    - The `EventGrid TopicSpaces Publisher` role on the Event Grid namespace is assigned to the Azure IoT Operations identity.
    - Users specified in the `--subscriber-object-ids` parameter are assigned the `EventGrid TopicSpaces Subscriber` role on the Event Grid namespace, so they can subscribe to live data from the topic space.
    - Users specified in the `--user-object-ids` parameter are assigned the `Reader` role on the ADR namespace, so they can view live data in the operations experience web UI.

    The command is idempotent. You can specify a list of users in one command or specify the command again to add more users. You can specify both `--subscriber-object-ids` and `--user-object-ids` in the same command. The value of the `--ra-scope` parameter isn't remembered between commands, so specify it each time you run the command if you want to restrict access to the Event Grid topic space rather than the Event Grid itself.

    For more details, see [az iot ops live-data enable](/cli/azure/iot/ops/live-data#az-iot-ops-live-data-enable).

1. Granting access to a user for the VS Code extension requires additional role assignments.

    1. Assign the `Reader` role on the subscription to the user.

        ```azurecli
        az role assignment create --assignee-object-id $USER_OBJECT_ID --assignee-principal-type User --role "Reader" --scope "/subscriptions/$SUBSCRIPTION_ID"
        ```

    1. Assign the `Contributor` role on the resource group that contains your Azure IoT Operations instance and its custom location to the user.

        ```azurecli
        az role assignment create --assignee-object-id $USER_OBJECT_ID --assignee-principal-type User --role "Contributor" --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP"
        ```

## View live data on an asset

# [Operations experience](#tab/portal)

After an IT administrator enables Live Data for the OT user, the user can view live data by using the operations experience web UI.

To view live data for an asset, follow these steps:

1. In the operations experience web UI, select **Assets** in the left navigation pane. Then select the asset you want to view live data for.

1. Select **View Live Data** from the top menu of the asset details page.

1. On the **Start live data session** page, select the source dataset, the message rate, and check the confirmation prompt. Then select **Start session** to begin viewing live data from the asset.

    :::image type="content" source="media/howto-view-live-data/live-data-select-dataset.png" alt-text="Screenshot that shows how to start a live data session in the operations experience." lightbox="media/howto-view-live-data/live-data-select-dataset.png":::

1. The Live data session opens and after a few moments, you start seeing live data from the asset displayed.

    :::image type="content" source="media/howto-view-live-data/live-data-view-messages.png" alt-text="Screenshot that shows how to view messages in a live data session in the operations experience." lightbox="media/howto-view-live-data/live-data-view-messages.png":::

    Select individual messages to view their details. Select **Jump to latest** to quickly navigate to the most recent message in the session.

1. To stop viewing live data, select **End session** on the live data session page.

# [VS Code](#tab/vscode)

After an IT administrator enables Live Data and assigns the necessary roles to the OT user, the user can view live data by using the VS Code extension.

To view live data, follow these steps:

1. In the Azure IoT Operations extension, select **Select an IoT Operations Instance** then use the pickers to select your subscription and Azure IoT Operations instance.

    :::image type="content" source="media/howto-view-live-data/vscode-select-instance.png" alt-text="Screenshot that shows how to select an Azure IoT Operations instance in the VS Code extension." lightbox="media/howto-view-live-data/vscode-select-instance.png":::

    - If your Azure IoT Operations instance has traffic across many topics, you can configure `aio.liveData.topics` in your user or workspace settings to select MQTT topics.

        :::image type="content" source="media/howto-view-live-data/vscode-configure-mqtt-topics.png" alt-text="Screenshot that shows how to configure MQTT topics in the VS Code extension." lightbox="media/howto-view-live-data/vscode-configure-mqtt-topics.png":::

    - Access other settings for live data control via the gear icon or by selecting **Configure Live Data Settings**.

        :::image type="content" source="media/howto-view-live-data/vscode-view-and-configure.png" alt-text="Screenshot that shows how to open live data settings in the VS Code extension." lightbox="media/howto-view-live-data/vscode-view-and-configure.png":::

1. After you configure your live data settings, select **View Live Data** or run the command `F1 -> >Azure IoT Operations Data Flow: View Live Data` to view live data from your Azure IoT Operations instance.

1. Inspect the Live Data messages tree view and view connection status in the status bar.  Messages also display in the output pane. The extension decodes messages if possible but otherwise defaults to hex.

    :::image type="content" source="media/howto-view-live-data/vscode-view-live-data.png" alt-text="Screenshot that shows how to view live data in the VS Code extension." lightbox="media/howto-view-live-data/vscode-view-live-data.png":::

    More connection details are available in the **AIO Live Data View** output channel.

1. When you're done viewing live data, end the live data session. For example, select the **Stop** button in the Live Data messages tree view.

---

## Disable live data for a user

An IT administrator can disable Live Data for a specific user by removing the Azure role assignments they need to access live data. Disabling Live Data for a user prevents them from starting live data sessions. Removing an assignment might not immediately end an active session. Ensure you retain any subscription or resource-group permissions that the user might need for other work.

# [Operations experience](#tab/portal)

To disable live data for a user on the operations experience web UI, follow these steps:

1. Get the resource ID of the ADR namespace associated with the Azure IoT Operations instance and save it in a variable.

    ```azurecli
    ADR_NAMESPACE_RESOURCE_ID=$(az iot ops show -n $AIO_INSTANCE_NAME -g $RESOURCE_GROUP --query "properties.adrNamespaceRef.resourceId" -o tsv)
    ```

1. Get the Microsoft Entra user object ID for the user you want to remove access for.  Replace `<user-principal-name>` with the user principal name of the user.

   ```azurecli
   USER_OBJECT_ID=$(az ad user show --id <user-principal-name> --query id -o tsv)
   ```

1. To disable live data for the user on the operations experience web UI, remove their `Reader` role assignment on the Azure Device Registry namespace.

    ```azurecli
    az role assignment delete --assignee-object-id "$USER_OBJECT_ID" --role "Reader" --scope "$ADR_NAMESPACE_RESOURCE_ID"
    ```

# [VS Code](#tab/vscode)

To disable live data for a user in the VS Code extension, follow these steps:

1. Get the Microsoft Entra user object ID for the user you want to remove access for. Replace `<user-principal-name>` with the user principal name of the user.

   ```azurecli
   USER_OBJECT_ID=$(az ad user show --id <user-principal-name> --query id -o tsv)
   ```

1. Remove the `Reader` role assignment on the subscription from the user.

    ```azurecli
    az role assignment delete --assignee-object-id $USER_OBJECT_ID --role Reader --scope /subscriptions/$SUBSCRIPTION_ID
    ```

1. Remove the `Contributor` role assignment on the resource group that contains your Azure IoT Operations instance and its custom location from the user.

    ```azurecli
    az role assignment delete --assignee-object-id $USER_OBJECT_ID --role Contributor --scope /subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP
    ```

1. Get the resource ID of the live-data topic space configured for your Azure IoT Operations instance and save it in a variable.

    ```azurecli
    TOPIC_SPACE_NAME=$(az iot ops live-data show -i $AIO_INSTANCE_NAME -g $RESOURCE_GROUP --query "eventGrid.topicSpace.name" -o tsv)
    TOPIC_SPACE_RESOURCE_ID=${EVENT_GRID_NAMESPACE_ID}/topicSpaces/${TOPIC_SPACE_NAME}
    ```

1. Remove the `EventGrid TopicSpaces Subscriber` role assignment on the live-data topic space configured for your Azure IoT Operations instance from the user.

    ```azurecli
    az role assignment delete --assignee-object-id $USER_OBJECT_ID --role "EventGrid TopicSpaces Subscriber" --scope $TOPIC_SPACE_RESOURCE_ID
    ```

---

> [!NOTE]
> Other assignments, such as those inherited from a role at the subscription or resource group level, might still grant access.

## Disable live data on an Azure IoT Operations instance

An IT administrator can disable Live Data on an Azure IoT Operations instance. Disabling Live Data prevents live data sessions from being started for the instance.

1. To disable live data, run the following Azure CLI command:

    ```azurecli
    az iot ops live-data disable --instance $AIO_INSTANCE_NAME --resource-group $RESOURCE_GROUP
    ```

    This command removes the dedicated data flow profile, the Event Grid data flow endpoint, and the observability topic space. It also removes the instance's observability endpoint entry from the Azure Device Registry namespace. For more information about the actions performed by this command, see [az iot ops live-data disable](/cli/azure/iot/ops/live-data#az-iot-ops-live-data-disable).

    Event Grid namespace-scoped managed-identity role assignments are preserved; topic-space-scoped managed-identity assignments are removed together with the topic space. The same condition applies to users added with the `--subscriber-object-ids` parameter. `Reader` assignments created for users added with the `--user-object-ids` parameter are always scoped to the ADR namespace, are unaffected by `--ra-scope`, and are preserved.

1. Verify that live data is disabled by running the following command:

    ```azurecli
    az iot ops live-data show --instance $AIO_INSTANCE_NAME --resource-group $RESOURCE_GROUP
    ```

    The output should indicate that live data isn't enabled for the specified Azure IoT Operations instance.

1. If you don't intend to re-enable live data on the Azure IoT Operations instance:

    1. Clean up any remaining Azure role assignments associated with the live data configuration, such as Event Grid namespace-scoped assignments on the managed identities and the `Reader` assignments on the ADR namespace created for users added with the `--user-object-ids` parameter.

    1. If you assigned users the additional roles needed to view live data via the VS Code extension, remove those roles.

    These steps ensure that users and managed identities no longer have permissions related to live data after you disable it.
