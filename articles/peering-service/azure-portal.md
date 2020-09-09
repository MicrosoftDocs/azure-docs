---
title: Register Azure Peering Service - Azure portal
description: Learn how to register Azure Peering Service by using the Azure portal
services: peering-service
author: derekolo
ms.service: peering-service
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: Infrastructure-services
ms.date: 05/18/2020
ms.author: derekol
---

# Register Peering Service by using the Azure portal

Azure Peering Service is a networking service that enhances customer connectivity to Microsoft cloud services such as Office 365, Dynamics 365, software as a service (SaaS) services, Azure, or any Microsoft services accessible via the public internet.

In this article, you'll learn how to register a Peering Service connection by using the Azure portal.

If you don't have an Azure subscription, create an [account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) now.

> 

## Prerequisites

You must have the following:

### Azure account

You must have a valid and active Microsoft Azure account. This account is required to set up the Peering Service connection. Peering Service is a resource within Azure subscriptions. 

### Connectivity provider

You can work with an internet service provider or internet exchange partner to obtain Peering Service to connect your network with the Microsoft network.

Make sure the [connectivity providers](location-partners.md) are partnered with Microsoft.



## Sign in to the Azure portal

From a browser, go to the Azure portal and sign in with your Azure account.

## Register a Peering Service connection

1. To register a Peering Service connection, select **Create a resource** > **Peering Service**.

    ![Register Peering Service](./media/peering-service-portal/peering-servicecreate.png)
1. Enter the following details on the **Basics** tab on the **Create a peering service connection** page.

 
1. Select the subscription and the resource group associated with the subscription.

   ![Register Peering basic tab](./media/peering-service-portal/peering-servicebasics.png)

1. Enter a **Name** to which the Peering Service instance should be registered.
 
1. Now, select the **Next:Configuration** button at the bottom of the page. The **Configuration** page appears.

## Configure the Peering Service connection

1. On the **Configuration** page, select the location to which the Peering Service must be enabled by selecting the same from the **Peering service location** drop-down list.

1. Select the service provider from whom the Peering Service must be obtained by selecting a provider name from the **Peering service provider** drop-down list.
 
1. Select **Create new prefix** at the bottom of the **Prefixes** section, and text boxes appear. Now, enter the name of the prefix resource and the prefixes that are associated with the service provider.

1. Select **Prefix Key** and add the Prefix Key that has been given to you by your provider (ISP or IXP). This key allows MS to validate the prefix and provider who have allocated your IP prefix.
   > ![Register Peering Service configuration tab](./media/peering-service-portal/peering-serviceconfiguration.png)

1. Select the **Review + create** button at the lower left of the page. The **Review + create** page appears, and Azure validates your configuration.
    

1. When you see the **Validation passed** message as shown, select **Create**.

   > ![Register Peering Service configuration tab](./media/peering-service-portal/peering-service-prefix.png)


1. After you register a Peering Service connection, additional validation is performed on the included prefixes. You can review the validation status under the **Prefixes** section of the resource name. If the validation fails, one of the following error messages is displayed:

   - Invalid Peering Service prefix, the prefix should be valid format, only Ipv4 prefix is supported.
   - Prefix was not received from Peering Service provider.
   - Prefix announcement does not have a valid BGP community,  contact Peering Service provider.
   - Backup route not found, contact Peering Service provider.
   - Prefix received with longer AS path, contact Peering Service provider.
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
- To register the connection by using Azure PowerShell, see [Register a Peering Service connection - Azure PowerShell](powershell.md).
- To register the connection by using the Azure CLI, see [Register a Peering Service connection - Azure CLI](cli.md).
