---
title: Delete sites
titleSuffix: Azure Private 5G Core
description: This how-to guide shows how to delete sites in your private mobile network. 
author: James-Green-Microsoft
ms.author: jamesgreen
ms.service: private-5g-core
ms.topic: how-to 
ms.date: 11/02/2022
ms.custom: template-how-to
---
# Delete sites using the Azure portal

 In this how-to guide, you'll learn how to delete one or more sites and associated ARM resources using the Azure portal. This includes resources created during site creation and network functions associated with the sites.

## Prerequisites

- You must already have a site, in your deployment, that you want to delete.
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.

## Delete a single mobile network site and resources

You can delete an existing site in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select the **Site** resource representing the private mobile network site that you want to delete.
1. Select the **Delete** button.
  :::image type="content" source="media/delete-a-site/site-view-delete-button.png" alt-text="Screenshot of the Azure portal the delete button on the site overview.":::
1. Review the list of resources that will be deleted.
  :::image type="content" source="media/delete-a-site/review-resources-delete.png" alt-text="Screenshot of the Azure portal showing the review resources tab for site deletion.":::
1. If you want to proceed, type the name of the site and select **Delete**.
  :::image type="content" source="media/delete-a-site/confirm-delete.png" alt-text="Screenshot of the Azure portal showing the conformation window to delete a site.":::
1. Confirm that you want to delete this site on the confirmation window by selecting **Delete**.

## Delete multiple mobile network sites and resources

You can delete your existing sites in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select the **Network** containing the private mobile network sites that you want to delete.
1. Select the **Sites** blade from the menu on the left side.
1. Select the checkbox next to each of the sites that you want to delete.
1. Select the **Delete** button at the top of the list.
1. Review the list of resources that will be deleted.
  :::image type="content" source="media/delete-a-site/review-resources-multiple-delete.png" alt-text="Screenshot of the Azure portal showing the review resources tab for deletion of multiple sites.":::
1. If you want to proceed, type "delete" and select **Delete**.
1. Confirm that you want to delete these sites on the confirmation window by selecting **Delete**.

## Next steps

Deploy one or more new sites, if required.

- [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md)
- [Collect the required information for a site](collect-required-information-for-a-site.md)
- [Create a site](create-a-site.md)
