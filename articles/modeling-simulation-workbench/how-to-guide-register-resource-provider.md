---
title: "Register resource provider: Azure Modeling and Simulation Workbench"
description: Register the Azure Modeling and Simulation Workbench resource provider.
author: yousefi-msft
ms.author: yousefi
ms.service: azure-modeling-simulation-workbench
ms.topic: how-to
ms.date: 08/20/2024

#CustomerIntent: As an administrator, I want to register the resource provider so I can install Azure Modeling and Simulation Workbench
---
# Register Azure Modeling and Simulation Workbench resource provider

To install the Azure Modeling and Simulation Workbench, the resource provider must be registered with the target subscription. Registering the resource provider gives the subscription access to the application. You should only register the resource providers you intend to use with the subscription.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* The Azure account must have permission to manage resource providers and to manage resources for the subscription. The permission is included in the Contributor and Owner roles.

* The Azure account must have permission to manage applications in Microsoft Entra ID. The following Microsoft Entra roles include the required permissions:
  * [Application administrator](/azure/active-directory/roles/permissions-reference#application-administrator)
  * [Application developer](/azure/active-directory/roles/permissions-reference#application-developer)
  * [Cloud application administrator](/azure/active-directory/roles/permissions-reference#cloud-application-administrator)

* A Microsoft Entra tenant.

## Register the resource provider

[!INCLUDE [register-resource-provider](includes/register-resource-provider.md)]

## Re-register the resource provider

Some application issues and certain updates require the resource provider to be re-registered.

1. On the Azure portal menu, search for **Subscriptions**. Select it from the available options.

   :::image type="content" source="/azure/azure-resource-manager/management/media/resource-providers-and-types/search-subscriptions.png" alt-text="Screenshot of the Azure portal in a web browser, showing search subscriptions.":::

1. On the **Subscriptions** page, select the subscription you want to view. In the example, 'Documentation Testing 1' is shown as an example.

   :::image type="content" source="/azure/azure-resource-manager/management/media/resource-providers-and-types/select-subscription.png" alt-text="Screenshot of the Azure portal in a web browser, showing select subscriptions.":::

1. On the left menu, under **Settings**, select **Resource providers**.

   :::image type="content" source="/azure/azure-resource-manager/management/media/resource-providers-and-types/select-resource-providers.png" alt-text="Screenshot of the Azure portal in a web browser, showing select resource providers.":::

1. Select the *Microsoft.ModSimWorkbench* resource provider. Then select **Unregister**, wait for the operation to complete, then select **Register**.

   :::image type="content" source="./media/quickstart-create-portal/register-resource-provider.png" alt-text="Screenshot of the Azure portal in a web browser, showing register resource providers.":::
