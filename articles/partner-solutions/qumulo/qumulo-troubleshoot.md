---
title: Troubleshoot Azure Native Qumulo Scalable File Service
description: This article provides information about troubleshooting Azure Native Qumulo Scalable File Service.

ms.topic: conceptual
ms.date: 01/18/2023

---

# Troubleshoot Azure Native Qumulo Scalable File Service

This article describes how to fix common problems when you're working with Azure Native Qumulo Scalable File Service.

Try the troubleshooting information in this article first. If that doesn't work, you can use one of the following methods to open a request form for Qumulo support:

- Go to the [Qumulo support page](https://aka.ms/partners/Qumulo/Support) and select **Open a case**.
- Go to the Azure portal and select **New Support request** on the left pane.

:::image type="content" source="media/qumulo-troubleshooting/qumulo-support-request.png" alt-text="Screenshot that shows a request form for Qumulo support.":::

## You got a purchase error related to a payment method

A purchase can fail because a valid credit card is not connected to the Azure subscription, or because a payment method is not associated with the subscription.

Try using a different Azure subscription. Or, add or update the credit card or payment method for the subscription. For more information, see [Update the credit and payment method](../../cost-management-billing/manage/change-credit-card.md).

## You got a purchase error related to an Enterprise Agreement

Some Microsoft Enterprise Agreement (EA) subscriptions don't allow Azure Marketplace purchases.

Try using a different subscription, or [enable your subscription for Azure Marketplace purchases](../../cost-management-billing/manage/ea-azure-marketplace.md#enabling-azure-marketplace-purchases).

## You can't create a resource

To set up Azure Native Qumulo Scalable File Service integration, you must have **Owner** or **Contributor** access on the Azure subscription. Ensure that you have the proper access on both the subnet resource group and the Qumulo service resource group before you start the setup.

For successful creation of a Qumulo service, custom role-based access control (RBAC) roles need to have the following permissions in the subnet and Qumulo service resource groups:

  - Qumulo.Storage/\*

  - Microsoft.Network/virtualNetworks/subnets/join/action

## Next steps

- [Manage Azure Native Qumulo Scalable File Service](qumulo-how-to-manage.md)
- Get started with Azure Native Qumulo Scalable File Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Qumulo.Storage%2FfileSystems)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/qumulo1584033880660.qumulo-saas-mpp?tab=Overview)