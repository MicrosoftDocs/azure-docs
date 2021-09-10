---
title: Create Azure Peering Service Connection - Azure portal
description: Learn how to create Azure Peering Service by using the Azure portal
services: peering-service
author: gthareja
ms.service: peering-service
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: Infrastructure-services
ms.date: 04/07/2021
ms.author: gatharej
---

# Create Peering Service Connection using the Azure portal

Azure Peering Service is a networking service that enhances customer connectivity to Microsoft public cloud services such as Microsoft 365, Dynamics 365, software as a service (SaaS) services, Azure, or any Microsoft services accessible via the public internet.

In this article, you'll learn how to Create a Peering Service connection by using the Azure portal.

If you don't have an Azure subscription, create an [account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) now.

> 

## Prerequisites

You must have the following:

### Azure account

You must have a valid and active Microsoft Azure account. This account is required to set up the Peering Service connection. Peering Service connection is a resource within Azure subscriptions. 

### Connectivity provider

You can work with any [Azure peering service provider](./location-partners.md) to obtain Peering Service to connect your network optimally with the Microsoft network.




## Sign in to the Azure portal

From a browser, go to the Azure portal and sign in with your Azure account.

## Create a Peering Service connection

1. To create a Peering Service connection, select **Create a resource** > **Peering Service**.

    ![Create Peering Service](./media/peering-service-portal/peering-servicecreate.png)

1. Enter the following details on the **Basics** tab on the **Create a peering service connection** page.

 
1. Select the subscription and the resource group associated with the subscription.

   ![Create Peering basic tab](./media/peering-service-portal/peering-servicebasics.png)

1. Enter a **Name** to which the Peering Service instance should be registered.
 
1. Now, select the **Next: Configuration** button at the bottom of the page. The **Configuration** page appears.

## Configure the Peering Service connection

1. On the **Configuration** page, select the customer network location to which the Peering Service must be enabled by selecting the same from the **Peering service location** drop-down list. 

1. Select the service provider from whom the Peering Service must be obtained by selecting a provider name from the **Peering service provider** drop-down list.

1. Select the **provider's primary peering location** closest to the customer network location. This is the peering service location between Microsoft and Partner.

1. Select the **provider's backup peering location** as the next closest to the customer network location. peering services will be active via backup location only in the event of failure of primary peering service location for disaster recovery. If "None" is selected, internet will be the default failover route in the event of primary peering service location failure.

 
1. Select **Create new prefix** at the bottom of the **Prefixes** section, and text boxes appear. Now, enter the name of the prefix resource and the prefixes that are associated with the service provider.

1. Select **Prefix Key** and add the Prefix Key that has been given to you by your provider (ISP or IXP). This key allows MS to validate the prefix and provider who have allocated your IP prefix.
   > ![Screenshot shows the Configuration tab of the Create a peering service connection page where you can enter the Prefix key.](./media/peering-service-portal/peering-serviceconfiguration.png)

1. Select the **Review + create** button at the lower left of the page. The **Review + create** page appears, and Azure validates your configuration.
    

1. When you see the **Validation passed** message as shown, select **Create**.

   > ![Screenshot shows the Review + create tab of the Create a peering service connection page.](./media/peering-service-portal/peering-service-prefix.png)


1. After you create a Peering Service connection, additional validation is performed on the included prefixes. You can review the validation status under the **Prefixes** section of the resource name. If the validation fails, one of the following error messages is displayed:

   - Invalid Peering Service prefix, the prefix should be valid format, only IPv4 prefix is supported currently.
   - Prefix was not received from Peering Service provider, contact Peering Service provider.
   - Prefix announcement does not have a valid BGP community,  contact Peering Service provider.
   - Prefix received with longer AS path(>3), contact Peering Service provider.
   - Prefix received with private AS in the path, contact Peering Service provider.

### Add or remove a prefix

Select **Add prefixes** on the **Prefixes** page to add prefixes.

Select the ellipsis (...) next to the listed prefix, and select the **Delete** option.

### Delete a Peering Service connection

On the **All Resources** page, select the check box on the Peering Service and select the **Delete** option at the top of the page.

> [!NOTE]
> You can't modify an existing prefix.
>

## Next steps

- To learn about Peering Service connection, see [Peering Service connection](connection.md).
- To learn about Peering Service connection telemetry, see [Peering Service connection telemetry](connection-telemetry.md).
- To measure telemetry, see [Measure connection telemetry](measure-connection-telemetry.md).
- To create the peering service connection by using Azure PowerShell, see [Create a Peering Service connection - Azure PowerShell](powershell.md).
- To create the connection by using the Azure CLI, see [Create a Peering Service connection - Azure CLI](cli.md).