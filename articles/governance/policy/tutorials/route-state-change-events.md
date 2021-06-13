---
title: "Tutorial: Route policy state change events to Event Grid with Azure CLI"
description: In this tutorial, you configure Event Grid to listen for policy state change events and call a webhook.
ms.date: 03/29/2021
ms.topic: tutorial
ms.custom: devx-track-azurecli
---
# Tutorial: Route policy state change events to Event Grid with Azure CLI

In this article, you learn how to set up Azure Policy event subscriptions to send policy state
change events to a web endpoint. Azure Policy users can subscribe to events emitted when policy
state changes occur on resources. These events can trigger web hooks,
[Azure Functions](../../../azure-functions/index.yml),
[Azure Storage Queues](../../../storage/queues/index.yml), or any other event handler that is
supported by [Azure Event Grid](../../../event-grid/index.yml). Typically, you send events to an
endpoint that processes the event data and takes actions. However, to simplify this tutorial, you
send the events to a web app that collects and displays the messages.

## Prerequisites

- If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/)
  account before you begin.

- This quickstart requires that you run Azure CLI version 2.0.76 or later. To find the version, run
  `az --version`. If you need to install or upgrade, see
  [Install Azure CLI](/cli/azure/install-azure-cli).

- Even if you've previously used Azure Policy or Event Grid, re-register their respective resource
  providers:

  ```azurecli-interactive
  # Log in first with az login if you're not using Cloud Shell

  # Provider register: Register the Azure Policy provider
  az provider register --namespace Microsoft.PolicyInsights

  # Provider register: Register the Azure Event Grid provider
  az provider register --namespace Microsoft.EventGrid
  ```

[!INCLUDE [cloud-shell-try-it.md](../../../../includes/cloud-shell-try-it.md)]

## Create a resource group

Event Grid topics are Azure resources, and must be placed in an Azure resource group. The resource
group is a logical collection into which Azure resources are deployed and managed.

Create a resource group with the [az group create](/cli/azure/group) command.

The following example creates a resource group named `<resource_group_name>` in the _westus_
location. Replace `<resource_group_name>` with a unique name for your resource group.

```azurecli-interactive
# Log in first with az login if you're not using Cloud Shell

az group create --name <resource_group_name> --location westus
```

## Create an Event Grid system topic

Now that we have a resource group, we create a
[system topic](../../../event-grid/system-topics.md). A system topic in Event Grid represents one or
more events published by Azure services such as Azure Policy and Azure Event Hubs. This system topic
uses the `Microsoft.PolicyInsights.PolicyStates` topic type for Azure Policy state changes. Replace
`<SubscriptionID>` in the **scope** parameter with the ID of your subscription and
`<resource_group_name>` in **resource-group** parameter with the previously created resource group.

```azurecli-interactive
# Log in first with az login if you're not using Cloud Shell

az eventgrid system-topic create --name PolicyStateChanges --location global --topic-type Microsoft.PolicyInsights.PolicyStates --source "/subscriptions/<SubscriptionID>" --resource-group "<resource_group_name>"
```

## Create a message endpoint

Before subscribing to the topic, let's create the endpoint for the event message. Typically, the
endpoint takes actions based on the event data. To simplify this quickstart, you deploy a
[pre-built web app](https://github.com/Azure-Samples/azure-event-grid-viewer) that displays the
event messages. The deployed solution includes an App Service plan, an App Service web app, and
source code from GitHub.

Replace `<your-site-name>` with a unique name for your web app. The web app name must be unique
because it's part of the DNS entry.

```azurecli-interactive
# Log in first with az login if you're not using Cloud Shell

az deployment group create \
  --resource-group <resource_group_name> \
  --template-uri "https://raw.githubusercontent.com/Azure-Samples/azure-event-grid-viewer/master/azuredeploy.json" \
  --parameters siteName=<your-site-name> hostingPlanName=viewerhost
```

The deployment may take a few minutes to complete. After the deployment has succeeded, view your web
app to make sure it's running. In a web browser, navigate to:
`https://<your-site-name>.azurewebsites.net`

You should see the site with no messages currently displayed.

## Subscribe to the system topic

You subscribe to a topic to tell Event Grid which events you want to track and where to send those
events. The following example subscribes to the system topic you created, and passes the URL from
your web app as the endpoint to receive event notifications. Replace `<event_subscription_name>`
with a name for your event subscription. For `<resource_group_name>` and `<your-site-name>`, use the
values you created earlier.

The endpoint for your web app must include the suffix `/api/updates/`.

```azurecli-interactive
# Log in first with az login if you're not using Cloud Shell

# Create the subscription
az eventgrid system-topic event-subscription create \
  --name <event_subscription_name> \
  --resource-group <resource_group_name> \
  --system-topic-name PolicyStateChanges \
  --endpoint https://<your-site-name>.azurewebsites.net/api/updates
```

View your web app again, and notice that a subscription validation event has been sent to it. Select
the eye icon to expand the event data. Event Grid sends the validation event so the endpoint can
verify that it wants to receive event data. The web app includes code to validate the subscription.

:::image type="content" source="../media/route-state-change-events/view-subscription-event.png" alt-text="Screenshot of the Event Grid subscription validation event in the pre-built web app.":::

## Create a policy assignment

In this quickstart, you create a policy assignment and assign the **Require a tag on resource
groups** definition. This policy definition identifies resource groups that are missing the tag
configured during policy assignment.

Run the following command to create a policy assignment scoped to the resource group you created to
hold the event grid topic:

```azurecli-interactive
# Log in first with az login if you're not using Cloud Shell

az policy assignment create --name 'requiredtags-events' --display-name 'Require tag on RG' --scope '<ResourceGroupScope>' --policy '<policy definition ID>' --params '{ "tagName": { "value": "EventTest" } }'
```

The preceding command uses the following information:

- **Name** - The actual name of the assignment. For this example, _requiredtags-events_ was used.
- **DisplayName** - Display name for the policy assignment. In this case, you're using _Require tag
  on RG_.
- **Scope** - A scope determines what resources or grouping of resources the policy assignment gets
  enforced on. It could range from a subscription to resource groups. Be sure to replace
  &lt;scope&gt; with the name of your resource group. The format for a resource group scope is
  `/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroup>`.
- **Policy** - The policy definition ID, based on which you're using to create the assignment. In
  this case, it's the ID of policy definition _Require a tag on resource groups_. To get the policy
  definition ID, run this command:
  `az policy definition list --query "[?displayName=='Require a tag on resource groups']"`

After creating the policy assignment, wait for a **Microsoft.PolicyInsights.PolicyStateCreated**
event notification to appear in the web app. The resource group we created show a
`data.complianceState` value of _NonCompliant_ to start.

:::image type="content" source="../media/route-state-change-events/view-policystatecreated-event.png" alt-text="Screenshot of the Event Grid subscription Policy State Created event for the resource group in the pre-built web app.":::

> [!NOTE]
> If the resource group inherits other policy assignments from the subscription or management group
> hierarchy, events for each is also displayed. Confirm the event is for the assignment in this
> tutorial by evaluating the `data.policyDefinitionId` property.

## Trigger a change on the resource group

To make the resource group compliant, a tag with the name **EventTest** is required. Add the tag to
the resource group with the following command replacing `<SubscriptionID>` with your subscription ID
and `<ResourceGroup>` with the name of the resource group:

```azurecli-interactive
# Log in first with az login if you're not using Cloud Shell

az tag create --resource-id '/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroup>' --tags EventTest=true
```

After adding the required tag to the resource group, wait for a
**Microsoft.PolicyInsights.PolicyStateChanged** event notification to appear in the web app. Expand
the event and the `data.complianceState` value now shows _Compliant_.

## Clean up resources

If you plan to continue working with this web app and Azure Policy event subscription, don't clean
up the resources created in this article. If you don't plan to continue, use the following command
to delete the resources you created in this article.

Replace `<resource_group_name>` with the resource group you created above.

```azurecli-interactive
az group delete --name <resource_group_name>
```

## Next steps

Now that you know how to create topics and event subscriptions for Azure Policy, learn more about
policy state change events and what Event Grid can help you do:

- [Reacting to Azure Policy state change events](../concepts/event-overview.md)
- [Azure Policy schema details for Event Grid](../../../event-grid/event-schema-policy.md)
- [About Event Grid](../../../event-grid/overview.md)
