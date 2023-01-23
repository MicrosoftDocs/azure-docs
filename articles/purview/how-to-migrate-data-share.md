---
title: Updated Data Sharing experience in Microsoft Purview Data Sharing starting 2023
description: Migration from classic data sharing to updated data sharing in Microsoft Purview in 2023.
author: sidontha
ms.author: sidontha
ms.service: purview
ms.subservice: purview-data-share
ms.topic: how-to
ms.date: 01/22/2023
---
# Migration from classic data sharing to updated data sharing in Microsoft Purview in 2023

This article compares classic data sharing with the currently available updated data sharing in Microsoft Purview and outlines the migration process to the updated experience.

> [!IMPORTANT]
> This migration is applicable only to users of data sharing in Microsoft Purview that started using data sharing prior to the public preview of the current updated data sharing experience in February 2023. 

If you're a new user of data sharing in Microsoft Purview, you will receive updated data sharing experience and migration is not necessary.

##	Feature comparison

| | **Classic Data Sharing** | **Updated Data Sharing** |
|---|---|---|
|Microsoft Purview Permissions|Data Share Contributor|None to use data sharing SDK. Minimum of Data Reader for data sharing user experience in Microsoft Purview portal|
|User experience|Share center for creating and managing shares|ADLSGen2 and Blob storage assets in the Microsoft Purview Catalog for creating and managing shares from the respective accounts|
|Share assets| |Discover sent share and received share assets in the Catalog|
|Share lineage| |See share lineage at the sent share and received share assets|

##	Migration process

Microsoft Purview portal users of classic data sharing experience will be seamlessly migrated over to the updated data sharing experience, with no extra action needed. 

Once the updated data sharing experience becomes available, if you're a user of classic data sharing, you will see both classic and updated data sharing experiences for two weeks after which you are migrated completely to the updated experience only. 

Once the automatic migration process is complete, you'll be able to see all the shares created previously and continue using the updated data sharing experience.   

> [!IMPORTANT]
> **Action required** - User action is required only for SDK users of classic data sharing experience. Migrate your application to the new [Data Sharing APIs](/rest/api/purview/).

## Next steps to use the updated Data Sharing experience

* [Data sharing quickstart](quickstart-data-share.md)
* [How to Share data](how-to-share-data.md)
* [How to receive a share](how-to-receive-share.md)
* [REST API reference](/rest/api/purview/)
* [Data Sharing FAQ](how-to-data-share-faq.md)
* Data Sharing Lineage

##	Help and support

If you have a support plan and you need technical help, [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

1. For Issue type, select Technical.  
1. For Subscription, select your subscription.  
1. For Service, click My services, then select Service type.  
1. Select the Microsoft Purview resource that you're creating a support request for.  
1. For Summary, type a description of your issue. Mention if it's a migration related issue and if you are seeing the issue in the classic experience or the updated experience.  
1. For Problem type, select Data Share.  
1. For problem subtype, select appropriately. 