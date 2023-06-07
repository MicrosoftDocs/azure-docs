---
title: Manage your Azure Maps account in the Azure portal | Microsoft Azure Maps 
description: Learn how to use the Azure portal to manage an Azure Maps account. See how to create a new account and how to delete an existing account.
author: eriklindeman
ms.author: eriklind
ms.date: 04/26/2021
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---

# Manage your Azure Maps account

You can manage your Azure Maps account through the Azure portal. After you have an account, you can implement the APIs in your website or mobile application.

## Prerequisites

- If you don't already have an Azure account, [sign up for a free account] before you continue.
- For picking account location, if you're unfamiliar with managed identities for Azure resources, see [managed identities for Azure resources].

## Account location

Picking a location for your Azure Maps account that aligns with other resources in your subscription, like managed identities, may help to improve the level of service for [control-plane] operations.

As an example, the managed identity infrastructure notifies the Azure Maps management services for changes to the identity resource such as credential renewal or deletion. Sharing the same Azure location enables a consistent infrastructure provisioning for all resources.

An Azure Maps account, regardless of location, can access any endpoint belonging to the Azure data-plane, such as `atlas.microsoft.com` and `*.atlas.microsoft.com`, when using Azure Maps REST API.

Read more about data-plane service coverage for Azure Maps services on [geographic coverage].

## Create a new account

1. Sign in to the [Azure portal].

2. Select **Create a resource** in the upper-left corner of the Azure portal.

3. Search for and select **Maps**. Then select **Create**.

4. Enter the information for your new account.

:::image type="content" source="./media/shared/create-account.png" lightbox="./media/shared/create-account.png" alt-text="A screenshot of the Create an Azure Maps Account resource page in the Azure portal.":::

## Delete an account

You can delete an account from the Azure portal. Navigate to the account overview page and select **Delete**.

[![Delete your Azure Maps account in the Azure portal](./media/how-to-manage-account-keys/account-delete-portal.png)](./media/how-to-manage-account-keys/account-delete-portal.png#lightbox)

You then see a confirmation page. You can confirm the deletion of your account by typing its name.

## Next steps

Set up authentication with Azure Maps and learn how to get an Azure Maps subscription key:
> [!div class="nextstepaction"]
> [Manage authentication]

Learn how to manage an Azure Maps account pricing tier:
> [!div class="nextstepaction"]
> [Manage a pricing tier]

Learn how to see the API usage metrics for your Azure Maps account:
> [!div class="nextstepaction"]
> [View usage metrics]

[Azure portal]: https://portal.azure.com
[control-plane]: ../azure-resource-manager/management/control-plane-and-data-plane.md
[geographic coverage]: geographic-coverage.md
[Manage a pricing tier]: how-to-manage-pricing-tier.md
[Manage authentication]: how-to-manage-authentication.md
[managed identities for Azure resources]: ../active-directory/managed-identities-azure-resources/overview.md
[sign up for a free account]: https://azure.microsoft.com/free/?WT.mc_id=A261C142F
[View usage metrics]: how-to-view-api-usage.md
