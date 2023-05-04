---
title: Connect to Azure services via Dapr components in the Azure portal
description: Easily create Dapr components via the Azure portal using Service Connector. 
author: hhunter-ms
ms.author: hannahhunter
ms.reviewer: nickgreenf
ms.service: container-apps
ms.topic: how-to 
ms.date: 05/03/2023
ms.custom: template-tutorial, service-connector
---

# Connect to Azure services via Dapr components in the Azure portal

Using a combination of [Service Connector](../service-connector/overview.md) and [Dapr](https://docs.dapr.io/), you can use the Azure Container App portal for an improved experience for authoring Dapr components. The new component creation feature simplifies the process and reduces the likelihood for misconfiguration.

In the new experience, you select from pre-defined dropdowns:
- The type of component (pub/sub, binding, etc.) that match the [Dapr building block](https://docs.dapr.io/developing-applications/building-blocks/) you wish to use 
- An existing Azure service in your subscription that matches the component type 

This guide demonstrates selecting  pubsub as component type and the Azure Service Bus as the component. Azure Container Apps + Dapr + Service Connector authors the component resource on your behalf, including configuring managed identity for authentication. 

While Service Connector automatically populates all required metadata for the component, you can also customize the component by adding optional metadata. 

Once the component is successfully created, the portal displays the YAML (or Bicep) for the component. You can then check this artifact into a repo and recreate it outside of the portal experience.

## Prerequisites
- An Azure account with an active subscription. [Create a free Azure account](https://azure.microsoft.com/free).
- [An existing Azure Container App](./quickstart-portal.md)

## Create a Dapr component

1. In the Azure portal, navigate to your Container Apps environment.
1. In the left-side menu, under **Settings**, select **Dapr components**. 
1. From the top menu, select **Add** > **Azure component (preview)** to open the **Add Dapr Component** configuration pane.

   :::image type="content" source="media/dapr-component-connection/select-azure-component.png" alt-text="Screenshot of selecting Azure Component from the drop down menu.":::


   > [!NOTE]
   > Currently, creating Dapr components using Service Connector in the Azure portal only works with Azure services (Azure Service Bus, Azure Cosmos DB, etc.). To create non-Azure Dapr components (Redis), use the manual component creation option.    

1. In the **Basics** tab, enter the Dapr component details. For example, for a pub/sub Azure Service Bus component:

   | Field | Example | Description |
   | ----- | ------- | ----------- |
   | Component name | mycomponent | Enter a name for your Dapr component. The name must match the component referenced in your application code. |
   | Building block | Pub/sub | Select the building block/API for your component from the drop-down. |
   | Component type | Service Bus | Select a component type from the drop-down. |
   
   The component creation pane populates with different fields depending on the building block and component type you select. For example, the following table and image demonstrate the fields associated with an Azure Service Bus pub/sub component type, but the fields you see may vary.

   | Field | Example | Description |
   | ----- | ------- | ----------- |
   | Subscription | My subscription | Select your Azure subscription |
   | Namespace | mynamespace | Select the API type for your component |
   | Authentication | User assigned managed identity | Select the subscription that contains the component you're looking for. Recommended: User assigned managed identity. |
   | User assigned managed identity | test1 | Select an existing identity from the drop-down. If you don’t  already have one, you can create a new managed identity client ID. |  

   :::image type="content" source="media/dapr-component-connection/add-pubsub-component.png" alt-text="Screenshot of the Azure platform showing the Basics tab of adding a Dapr Pub/sub component.":::

1. Select **Next : Metadata & Scopes**. 
   
1. Under **Metadata**, select **Add** to select extra, optional metadata for your Dapr component from a drop-down of supported fields. 
   
1. Under **Scopes**, select **Add** to select app IDs from the drop-down that have been added to the scopes list.

1. Select **Review + Create**, review the component values, and select **Create**. 

1. Once the component has been added to the Container Apps environment, a YAML code containing information about your connection is displayed. Select **Done**. 

> [!TIP] 
> You can save this YAML for future use.


## Manage Dapr components

1. In your Container Apps environment, go to **Settings** > **Dapr components**.
1. The Dapr components that are tied to your Container Apps environment are listed on this page. Review the list and select the **Delete** icon to delete a component, or select a component's name to review or edit its details.

   :::image type="content" source="media/dapr-component-connection/manage-dapr-component.png" alt-text="Screenshot of the Azure platform showing existing Dapr Components.":::

## Next steps

Learn more about:
- [Using Dapr with Azure Container Apps](./dapr-overview.md)
- [Connecting to cloud services using Service Connector](./service-connector.md)