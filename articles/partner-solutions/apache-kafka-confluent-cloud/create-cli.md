---
title: Create Apache Kafka for Confluent Cloud through Azure CLI
description: This article describes how to use the Azure CLI to create an instance of Apache Kafka for Confluent Cloud.
ms.topic: quickstart
ms.custom: devx-track-azurecli
ms.date: 06/07/2021
author: flang-msft
ms.author: franlanglois
---

# QuickStart: Get started with Apache Kafka for Confluent Cloud - Azure CLI

In this quickstart, you'll use the Azure Marketplace and Azure CLI to create an instance of Apache Kafka for Confluent Cloud.

## Prerequisites

- An Azure account. If you don't have an active Azure subscription, create a [free account](https://azure.microsoft.com/free/).
- You must have the _Owner_ or _Contributor_ role for your Azure subscription. The integration between Azure and Confluent can only be set up by users with _Owner_ or _Contributor_ access. Before getting started, [confirm that you have the appropriate access](../../role-based-access-control/check-access.md).

## Find offer

Use the Azure portal to find the Apache Kafka for Confluent Cloud application.

1. In a web browser, go to the [Azure portal](https://portal.azure.com/) and sign in.

1. If you've visited the **Marketplace** in a recent session, select the icon from the available options. Otherwise, search for _Marketplace_.

    :::image type="content" source="media/marketplace.png" alt-text="Marketplace icon.":::

1. From the **Marketplace** page, you have two options based on the type of plan you want. You can sign up for a pay-as-you-go plan or commitment plan. Pay-as-you-go is publicly available. The commitment plan is available to customers who have been approved for a private offer.

   - For **pay-as-you-go** customers, search for _Apache Kafka on Confluent Cloud_. Select the offer for Apache Kafka on Confluent Cloud.

     :::image type="content" source="media/search-pay-as-you-go.png" alt-text="search Azure Marketplace offer.":::

   - For **commitment** customers, select the link to **View Private offers**. The commitment requires you to sign up for a minimum spend amount. Use this option only when you know you need the service for an extended time.

     :::image type="content" source="media/view-private-offers.png" alt-text="view private offers.":::

     Look for _Apache Kafka on Confluent Cloud_.

     :::image type="content" source="media/select-from-private-offers.png" alt-text="select private offer.":::

## Create resource

After you've selected the offer for Apache Kafka on Confluent Cloud, you're ready to set up the application.

Start by preparing your environment for the Azure CLI:

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

After you sign in, use the [az confluent organization create](/cli/azure/confluent/organization#az-confluent-organization-create) command to create the new organization resource:

```azurecli
az confluent organization create --name "myOrganization" --resource-group "myResourceGroup" \
 --location "my location" \ 
 --offer-detail id="string" plan-id="string" plan-name="string" publisher-id="string" term-unit="string" \ 
 --user-detail email-address="contoso@microsoft.com" first-name="string" last-name="string" \ 
 --tags Environment="Dev" 
```

> [!NOTE]
> If you want the command to return before the create operation completes, add the optional parameter `--no-wait`. The operation continues to run until the Confluent organization is created.
 
To pause CLI execution until an organization's specific event or condition occurs, use the [az confluent organization wait](/cli/azure/confluent/organization#az-confluent-organization-wait) command. For example, to wait until an organization is created:

```azurecli
az confluent organization wait --name "myOrganization" --resource-group "myResourceGroup" --created
```

To see a list of existing organizations, use the [az confluent organization list](/cli/azure/confluent/organization#az-confluent-organization-list) command.

You can view all of the organizations in your subscription:

```azurecli
az confluent organization list
```

Or, view the organizations in a resource group:

```azurecli
az confluent organization list --resource-group "myResourceGroup"
```

To see the properties of a specific organization, use the [az confluent organization show](/cli/azure/confluent/organization#az-confluent-organization-show) command.

You can view the organization by name:

```azurecli
az confluent organization show --name "myOrganization" --resource-group "myResourceGroup"
```

Or, view the organization by resource ID:

```azurecli
az confluent organization show --ids "/subscriptions/{SubID}/resourceGroups/{myResourceGroup}/providers/Microsoft.Confluent/organizations/{myOrganization}"
```

If you get an error, see [Troubleshooting Apache Kafka for Confluent Cloud solutions](troubleshoot.md).

## Next steps

> [!div class="nextstepaction"]
> [Manage the Confluent Cloud resource](manage.md)
