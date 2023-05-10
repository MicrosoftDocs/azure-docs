---
title: Connect to Azure services via Dapr components in the Azure portal
description: Easily create Dapr components via the Azure portal using Service Connector. 
author: hhunter-ms
ms.author: hannahhunter
ms.reviewer: nickgreenf
ms.service: container-apps
ms.topic: how-to 
ms.date: 05/10/2023
ms.custom: template-tutorial, service-connector
---

# Connect to Azure services via Dapr components in the Azure portal

Using a combination of [Service Connector](../service-connector/overview.md) and [Dapr](https://docs.dapr.io/), you can author Dapr components via an improved component creation feature in the Azure Container App portal. 

With this new component creation feature, you no longer need to know or remember the Dapr open source metadata concepts. Instead, you simply enter the component information while Service Connector automatically maps your entries to the required component metadata. By managing component creation for you, this feature:
- Reduces the likelihood for misconfiguration 
- Simplifies the process for developers 

This guide demonstrates creating a Dapr component by selecting:
- Pub/sub as component type 
- Azure Service Bus as the component

Azure Container Apps + Dapr + Service Connector then authors the pub/sub component resource on your behalf, including configuring managed identity for authentication. 

## Prerequisites
- An Azure account with an active subscription. [Create a free Azure account](https://azure.microsoft.com/free).
- [An existing Azure Container App](./quickstart-portal.md).

## Create a Dapr component

Start by navigating to the Dapr component creation feature.

1. In the Azure portal, navigate to your Container Apps environment.
1. In the left-side menu, under **Settings**, select **Dapr components**. 
1. From the top menu, select **Add** > **Azure component (preview)** to open the **Add Dapr Component** configuration pane.

   :::image type="content" source="media/dapr-component-connection/select-azure-component.png" alt-text="Screenshot of selecting Azure Component from the drop down menu.":::

   > [!NOTE]
   > Currently, creating Dapr components using Service Connector in the Azure portal only works with Azure services (Azure Service Bus, Azure Cosmos DB, etc.). To create non-Azure Dapr components (Redis), use the manual component creation option.    

### Provide required metadata

To enable Service Connector to map to the required component metadata, start by selecting the following from pre-defined dropdowns:
- The type of component (pub/sub, binding, etc.) that match the [Dapr building block](https://docs.dapr.io/developing-applications/building-blocks/) you wish to use 
- An existing Azure service in your subscription that matches the component type 

In the **Basics** tab, enter the Dapr component details. For example, for a pub/sub Azure Service Bus component:

| Field | Example | Description |
| ----- | ------- | ----------- |
| Component name | mycomponent | Enter a name for your Dapr component. The name must match the component referenced in your application code. |
| Building block | Pub/sub | Select the building block/API for your component from the drop-down. |
| Component type | Service Bus | Select a component type from the drop-down. |

The component creation pane populates with different fields depending on the building block and component type you select. For example, the following table and image demonstrate the fields associated with an Azure Service Bus pub/sub component type, but the fields you see may vary.  

| Field | Example | Description |
| ----- | ------- | ----------- |
| Subscription | My subscription | Select your Azure subscription |
| Namespace | mynamespace | Select the Service Bus namespace |
| Authentication | User assigned managed identity | Select the subscription that contains the component you're looking for. Recommended: User assigned managed identity. |
| User assigned managed identity | testidentity | Select an existing identity from the drop-down. If you don’t  already have one, you can create a new managed identity client ID. |  

:::image type="content" source="media/dapr-component-connection/add-pubsub-component.png" alt-text="Screenshot of the Azure platform showing the Basics tab of adding a Dapr Pub/sub component.":::

**What happened?**   

Now that you've filled out these required fields, Service Connector and Dapr can automatically map your entries to the required component metadata. In this Service Bus example, the only required metadata is the connection string. Service Connector takes the information you provided and maps the input to create a connection string in the component YAML file.  

### Provide optional metadata

While Service Connector automatically populates all required metadata for the component, you can also customize the component by adding optional metadata. 

1. Select **Next : Metadata + Scopes**. 
   
1. Under **Metadata**, select **Add** to select extra, optional metadata for your Dapr component from a drop-down of supported fields. 
   
1. Under **Scopes**, select **Add** or type in the app IDs for the container apps that you want to load this component.
   - By default, when the scope is unspecified, Dapr applies the component to all app IDs.

1. Select **Review + Create** to review the component values.

1. Select **Create**. 

### Save the component YAML

Once the component has been added to the Container Apps environment, the portal displays the YAML (or Bicep) for the component. 

1. Copy and save the YAML file for future use.

1. Select **Done** to exit the configuration pane. 

You can then check the YAML/Bicep artifact into a repo and recreate it outside of the portal experience.

## Manage Dapr components

1. In your Container Apps environment, go to **Settings** > **Dapr components**.
1. The Dapr components that are tied to your Container Apps environment are listed on this page. Review the list and select the **Delete** icon to delete a component, or select a component's name to review or edit its details.

   :::image type="content" source="media/dapr-component-connection/manage-dapr-component.png" alt-text="Screenshot of the Azure platform showing existing Dapr Components.":::

## Next steps

Learn more about:
- [Using Dapr with Azure Container Apps](./dapr-overview.md)
- [Connecting to cloud services using Service Connector](./service-connector.md)