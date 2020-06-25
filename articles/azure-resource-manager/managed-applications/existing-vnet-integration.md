---
title: Deploy to existing virtual network
description: Describes how to enable users of your managed application to select an existing virtual network. The virtual network can be outside of the managed application.
author: tfitzmac

ms.topic: conceptual
ms.date: 05/11/2020
ms.author: tomfitz

---
# Use existing virtual network with Azure Managed Applications

This article shows you how to define an Azure Managed Application that integrates with an existing virtual network in the consumer's subscription. The managed application lets the consumer decide whether to create a new virtual network or use an existing one. The existing virtual network can be outside of the managed resource group.

## Main template

First, let's look at the **mainTemplate.json** file. The whole template for deploying a virtual machine and its associated resources is shown below. Later, you'll examine more closely the parts of the template that are related to using an existing virtual network.

:::code language="json" source="~/resourcemanager-templates/managed-app-existing-vnet/mainTemplate.json":::

Notice that the virtual network is [conditionally deployed](../templates/conditional-resource-deployment.md). The consumer passes in a parameter value that indicates whether to create a new or use existing virtual network. If the consumer selects a new virtual network, the resource is deployed. Otherwise, the resource is skipped during deployment.

:::code language="json" source="~/resourcemanager-templates/managed-app-existing-vnet/mainTemplate.json" range="111-132" highlight="2":::

The variable for the virtual network ID has two properties. One property returns the resource ID when a new virtual network is deployed. The other property returns the resource ID when an existing virtual network is used. The resource ID for the existing virtual network includes the name of the resource group that contains the virtual network.

The subnet ID is constructed from the value for the virtual network ID. It uses the value matches the consumers selection.

:::code language="json" source="~/resourcemanager-templates/managed-app-existing-vnet/mainTemplate.json" range="98-109" highlight="6-10":::

The network interface is set to the subnet ID variable.

:::code language="json" source="~/resourcemanager-templates/managed-app-existing-vnet/mainTemplate.json" range="142-163" highlight="16":::

## UI definition

Now, let's look at the **createUiDefinition.json** file. The whole file is:

:::code language="json" source="~/resourcemanager-templates/managed-app-existing-vnet/createUiDefinition.json":::

The file includes a virtual network element.

:::code language="json" source="~/resourcemanager-templates/managed-app-existing-vnet/createUiDefinition.json" range="53-81":::

That element lets the consumer select either a new or existing virtual network.

:::image type="content" source="./media/existing-vnet-integration/new-or-existing-vnet.png" alt-text="New or existing virtual network":::

In the outputs, you include a value that indicates whether the consumer selected a new or existing virtual network. There's also a managed identity value.

> [!NOTE]
> The output value for the managed identity must be named **managedIdentity**.

:::code language="json" source="~/resourcemanager-templates/managed-app-existing-vnet/createUiDefinition.json" range="136-148" highlight="6,12":::

## Next steps

To learn more about creating the UI definition file, see [CreateUiDefinition.json for Azure managed application's create experience](create-uidefinition-overview.md).
