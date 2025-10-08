---
title: "Create a Confluent Cloud Resource - Azure PowerShell"
description: Learn how to begin using Apache Kafka & Apache Flink on Confluent Cloud by creating an instance via Azure PowerShell.
ms.topic: quickstart
ms.custom: devx-track-azurepowershell
ms.date: 1/31/2024

#customer intent: As a developer, I want to learn how to create a new instance of Apache Kafka & Apache Flink on Confluent Cloud by using Azure PowerShell so that I can create my own resources.
---

# Quickstart: Create a Confluent Cloud resource by using Azure PowerShell

In this quickstart, you use Azure Marketplace and Azure PowerShell to create a resource in Apache Kafka & Apache Flink on Confluent Cloud, an Azure Native Integrations service.

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

Start by preparing your environment for Azure PowerShell:

[!INCLUDE [azure-powershell-requirements-no-header.md](~/reusable-content/ce-skilling/azure/includes/azure-powershell-requirements-no-header.md)]

> [!IMPORTANT]
> Currently, the `Az.Confluent` PowerShell module is in preview. During the preview, you must install the module separately by using the `Install-Module` cmdlet:

```azurepowershell
Install-Module -Name Az.Confluent -Scope CurrentUser -Repository PSGallery -Force
```

After you sign in, use the [`New-AzConfluentOrganization`](/powershell/module/az.confluent/new-azconfluentorganization) cmdlet to create the new organization resource:

```azurepowershell
$ConfluentOrgParams = @{
    Name = 'myOrganization'
    ResourceGroupName = 'myResourceGroup'
    Location = 'my location'
    OfferDetailId = 'string'
    OfferDetailPlanId = 'string'
    OfferDetailPlanName = 'string'
    OfferDetailPublisherId = 'string'
    OfferDetailTermUnit = 'string'
    UserDetailEmailAddress = 'contoso@microsoft.com'
    UserDetailFirstName = 'string'
    UserDetailLastName = 'string'
    Tag = @{Environment='Dev'}
}

New-AzConfluentOrganization @ConfluentOrgParams
```

> [!NOTE]
> If you want the command to return before the `create` operation finishes, add the optional parameter `-NoWait`. The operation continues to run until the Confluent organization is created.

To see a list of existing organizations, use the [`Get-AzConfluentOrganization`](/powershell/module/az.confluent/get-azconfluentorganization) cmdlet.

To view all organizations in your subscription:

```azurepowershell
Get-AzConfluentOrganization
```

To view all organizations in a resource group:

```azurepowershell
Get-AzConfluentOrganization -ResourceGroupName myResourceGroup
```

To see the properties of a specific organization, use the `Get-AzConfluentOrganization` cmdlet and the `Name` and `ResourceGroupName` parameters.

You can view the organization by name:

```azurepowershell
Get-AzConfluentOrganization -Name myOrganization -ResourceGroupName myResourceGroup
```

If you get an error, see [Troubleshoot Apache Kafka & Apache Flink on Confluent Cloud solutions](troubleshoot.md).

## Next step

> [!div class="nextstepaction"]
> [Manage your Confluent Cloud resource](manage.md)
