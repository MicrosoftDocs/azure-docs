---
title: Update an existing offer for Azure Marketplace
description: Update an existing offer for Azure Marketplace
services: Azure, Marketplace, Cloud Partner Portal, 
documentationcenter:
author: qianw211
manager: pbutlerm  
editor:

ms.assetid: 
ms.service: marketplace
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: conceptual
ms.date: 09/13/2018
ms.author: pbutlerm
---


Update an existing offer for Azure Marketplace 
==============================================

There are various kinds of updates that you may want to do to your offer
once it goes live.

1.  Adding new \"Package\" to an existing SKU
2.  Adding new SKUs to an existing Offer
3.  Updating offer/SKU marketplace metadata

You need to update your offer in the Cloud Partner Portal and
republish. This article walks you through the different aspects of
updating your Azure Application offer.

Unpermitted changes to Azure Application offer/SKU 
--------------------------------------------------

There are attributes of an Azure Application offer/SKU that cannot be modified once the offer goes live in Azure Marketplace.

1.  Offer ID and Publisher ID of the offer.
2.  SKU ID of existing SKUs.
3.  Update a package that has been published.

Adding a new Package to an existing SKU 
---------------------------------------

The publisher may want to add a new version of the package in order to update an existing package. This could be done by uploading a new package with a different version number.

1.  Sign in to the [Cloud Partner Portal](http://cloudpartner.azure.com)
2.  In All offers find the offer you would like to update
3.  On the SKUs form, click on the SKU who\'s package you had like to update
4.  Click on \"New Package\" and provide a new version
5.  Upload a new .zip file containing the updated template file
6.  Click on Publish to kick off the publish workflow to have your new
    SKU go live.

Adding a new SKU to an existing Offer
-------------------------------------

You may choose to make a new SKU available for your existing offer. To
enable this, follow the below steps.

1.  Login to the [Cloud Partner Portal](http://cloudpartner.azure.com)
2.  In All offers find the offer you would like to update
3.  On the SKUs form, clik on Add new SKU and provide a SKU ID in the
    pop-up.
4.  Follow the rest of the steps as specified
    [here](./cloud-partner-portal-managed-app-publish.md).
5.  Click on Publish to kick off the publish workflow to have your new
    SKU go live.

Updating Offer Marketplace metadata 
-----------------------------------

You may have scenarios where you need to update the marketplace metadata
associated with your offer like updating your company logos, etc. Follow the steps below.

1.  Sign in to the Cloud Partner Portal
2.  In All offers find the offer you would like to update
3.  Goto the Marketplace form and follow the instructions
    [here](https://docs.microsoft.com/azure/marketplace-publishing/marketplace-publishing-push-to-staging)
    to make any changes.
4.  Click on Publish to kick off the publish workflow to have your
    changes go live.
