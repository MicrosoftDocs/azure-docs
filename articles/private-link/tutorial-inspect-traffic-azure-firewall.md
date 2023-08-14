---
title: 'Tutorial: Inspect private endpoint traffic with Azure Firewall'
description: Learn how to inspect private endpoint traffic with Azure Firewall.
author: asudbring
ms.author: allensu
ms.service: private-link
ms.topic: tutorial
ms.custom: mvc
ms.date: 08/14/2023

---
# Tutorial: Inspect private endpoint traffic with Azure Firewall

Azure Private Endpoint is the fundamental building block for Azure Private Link. Private endpoints enable Azure resources deployed in a virtual network to communicate privately with private link resources.

Private endpoints allow resources access to the private link service deployed in a virtual network. Access to the private endpoint through virtual network peering and on-premises network connections extend the connectivity.

You may need to inspect or block traffic from clients to the services exposed via private endpoints. Complete this inspection by using [Azure Firewall](../firewall/overview.md) or a third-party network virtual appliance.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network and bastion host for the test virtual machine.
> * Create the private endpoint virtual network.
> * Create a test virtual machine.
> * Deploy Azure Firewall.
> * Create an Azure SQL database.
> * Create a private endpoint for Azure SQL.
> * Create a network peer between the private endpoint virtual network and the test virtual machine virtual network.
> * Link the virtual networks to a private DNS zone.
> * Configure application rules in Azure Firewall for Azure SQL.
> * Route traffic between the test virtual machine and Azure SQL through Azure Firewall.
> * Test the connection to Azure SQL and validate in Azure Firewall logs.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- An Azure account with an active subscription.

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com).

[!INCLUDE [virtual-network-create-with-bastion.md](../../includes/virtual-network-create-with-bastion.md)]

[!INCLUDE [virtual-network-create-private-endpoint.md](../../includes/virtual-network-create-private-endpoint.md)]

[!INCLUDE [create-test-virtual-machine.md](../../includes/create-test-virtual-machine.md)]

## Deploy Azure Firewall




[!INCLUDE [portal-clean-up.md](../../includes/portal-clean-up.md)]

## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button](contribute-get-started-mvc.md)
