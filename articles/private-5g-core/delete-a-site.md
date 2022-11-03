---
title: Delete a site
titleSuffix: Azure Private 5G Core Preview
description: This how-to guide shows how to delete a site in your private mobile network. 
author: James-Green-Microsoft
ms.author: jamesgreen
ms.service: private-5g-core
ms.topic: how-to 
ms.date: 11/02/2022
ms.custom: template-how-to
---
# Delete a site using the Azure portal

 In this how-to guide, you'll learn how to delete a site and associated ARM resources using the Azure portal. This includes resources created during site creation and network functions associated with the site.

## Prerequisites

- You must already have a site that you want to delete in your deployment.
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.

## Delete the mobile network site and resources

You can delete your existing sites in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select the **Site** resource representing the private mobile network site that you want to delete.
1. Select the **Delete** button.
1. Review the list of resources that will be deleted.
1. If you want to proceed, type the name of the site and select **Delete**.
1. Confirm that you want to delete this site on the confirmation modal by selecting **Delete**.

## Next steps

Deploy a new site, if required.

- [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md)
- [Collect the required information for a site](collect-required-information-for-a-site.md)
- [Create a site](create-a-site.md)
