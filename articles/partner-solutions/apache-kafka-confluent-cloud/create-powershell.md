---
title: Create Apache Kafka for Confluent Cloud through Azure PowerShell
description: This article describes how to use Azure PowerShell to create an instance of Apache Kafka for Confluent Cloud.

ms.topic: quickstart
ms.custom: devx-track-azurepowershell
ms.date: 11/20/2023

---

# QuickStart: Get started with Apache Kafka for Confluent Cloud - Azure PowerShell

In this quickstart, you'll use the Azure Marketplace and Azure PowerShell to create an instance of Apache Kafka for Confluent Cloud.

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

Start by preparing your environment for Azure PowerShell:

[!INCLUDE [azure-powershell-requirements-no-header.md](../../../includes/azure-powershell-requirements-no-header.md)]

> [!IMPORTANT]
> While the **Az.Confluent** PowerShell module is in preview, you must install it separately using the `Install-Module` cmdlet.

```azurepowershell
Install-Module -Name Az.Confluent -Scope CurrentUser -Repository PSGallery -Force
```

After you sign in, use the [New-AzConfluentOrganization](/powershell/module/az.confluent/new-azconfluentorganization) cmdlet to create the new organization resource:

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
> If you want the command to return before the create operation completes, add the optional parameter `-NoWait`. The operation continues to run until the Confluent organization is created.

To see a list of existing organizations, use the [Get-AzConfluentOrganization](/powershell/module/az.confluent/get-azconfluentorganization) cmdlet.

You can view all of the organizations in your subscription:

```azurepowershell
Get-AzConfluentOrganization
```

Or, view the organizations in a resource group:

```azurepowershell
Get-AzConfluentOrganization -ResourceGroupName myResourceGroup
```

To see the properties of a specific organization, use the `Get-AzConfluentOrganization` cmdlet with the `Name` and `ResourceGroupName` parameters.

You can view the organization by name:

```azurepowershell
Get-AzConfluentOrganization -Name myOrganization -ResourceGroupName myResourceGroup
```

If you get an error, see [Troubleshooting Apache Kafka for Confluent Cloud solutions](troubleshoot.md).

## Next steps

> [!div class="nextstepaction"]
> [Manage the Confluent Cloud resource](manage.md)
