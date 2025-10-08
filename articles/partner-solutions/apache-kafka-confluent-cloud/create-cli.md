---
title: "Create a Confluent Cloud Resource - Azure CLI"
description: Learn how to begin using Apache Kafka & Apache Flink on Confluent Cloud by creating an instance via the Azure CLI.
ms.topic: quickstart
ms.custom: devx-track-azurecli
ms.date: 1/31/2024

#customer intent: As a developer, I want to learn how to create a new instance of Apache Kafka & Apache Flink on Confluent Cloud by using the Azure CLI so that I can create my own resources.
---

# Quickstart: Create a Confluent Cloud resource by using the Azure CLI

In this quickstart, you use Azure Marketplace and the Azure CLI to create a resource in Apache Kafka & Apache Flink on Confluent Cloud, an Azure Native Integrations service.

## Prerequisites

- An Azure account. If you don't have an active Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- The Owner or Contributor role for your Azure subscription. Only users who are assigned one of these roles can set up integration between Azure and Confluent. Before you get started, [verify that you have the required access](../../role-based-access-control/check-access.md).

## Find offer

Use the Azure portal to find the Apache Kafka & Apache Flink on Confluent Cloud application:

1. Go to the [Azure portal](https://portal.azure.com/) and sign in.

1. Search for and then select **Marketplace**.

1. On the **Marketplace** page, choose from two billing options:

   - **Pay-as-you-go monthly plan**: Your Confluent Cloud consumption charges appear on your Azure monthly bill. This plan is publicly available.
   - **Commitment plan**: You sign up for a minimum spend amount and get a discount on your committed usage of Confluent Cloud. This plan is available to customers who are approved for a private offer.

   For **pay-as-you-go** customers, search for and then select the **Apache Kafka & Apache Flink on Confluent Cloud** offer.

   :::image type="content" source="media/search-pay-as-you-go.png" alt-text="Screenshot that shows a search for an Azure Marketplace offer.":::

   For **commitment** customers, select the **View private plans** link. The commitment requires you to sign up for a minimum spend amount. Use this option only when you know you need to use the service for an extended time.

   :::image type="content" source="media/view-private-offers.png" alt-text="Screenshot that shows the view private plans link.":::

   Search for and then select the **Apache Kafka & Apache Flink on Confluent Cloud** private plan.

   :::image type="content" source="media/select-from-private-offers.png" alt-text="Screenshot that shows the option to select a private plan.":::

## Create a resource

Start by preparing your environment for the Azure CLI:

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

After you sign in, use the [`az confluent organization create`](/cli/azure/confluent/organization#az-confluent-organization-create) command to create the new organization resource:

```azurecli
az confluent organization create --name "myOrganization" --resource-group "myResourceGroup" \
 --location "my location" \ 
 --offer-detail id="string" plan-id="string" plan-name="string" publisher-id="string" term-unit="string" \ 
 --user-detail email-address="contoso@microsoft.com" first-name="string" last-name="string" \ 
 --tags Environment="Dev" 
```

> [!NOTE]
> If you want the command to return before the `create` operation finishes, add the optional parameter `--no-wait`. The operation continues to run until the Confluent organization is created.

To pause CLI execution until an organization's specific event or condition occurs, use the [`az confluent organization wait`](/cli/azure/confluent/organization#az-confluent-organization-wait) command.

For example, to wait until an organization is created, run:

```azurecli
az confluent organization wait --name "myOrganization" --resource-group "myResourceGroup" --created
```

To see a list of existing organizations, use the [`az confluent organization list`](/cli/azure/confluent/organization#az-confluent-organization-list) command.

To view all organizations in your subscription, run:

```azurecli
az confluent organization list
```

To view all organizations in a resource group, run:

```azurecli
az confluent organization list --resource-group "myResourceGroup"
```

To see the properties of a specific organization, use the [az confluent organization show](/cli/azure/confluent/organization#az-confluent-organization-show) command.

To view the organization by name, run:

```azurecli
az confluent organization show --name "myOrganization" --resource-group "myResourceGroup"
```

To view the organization by resource ID, run:

```azurecli
az confluent organization show --ids "/subscriptions/{SubID}/resourceGroups/{myResourceGroup}/providers/Microsoft.Confluent/organizations/{myOrganization}"
```

If an error message appears, see [Troubleshoot Apache Kafka & Apache Flink on Confluent Cloud solutions](troubleshoot.md).

## Next step

> [!div class="nextstepaction"]
> [Manage your Confluent Cloud resource](manage.md)
