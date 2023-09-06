---
title: Troubleshoot the Google AdWords connector
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to troubleshoot issues with the Google AdWords connector in Azure Data Factory and Azure Synapse Analytics. 
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: troubleshooting
ms.date: 04/12/2023
ms.author: jianleishen
ms.custom: has-adal-ref, synapse
---

# Troubleshoot the Google AdWords connector in Azure Data Factory and Azure Synapse

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article provides suggestions to troubleshoot common problems with the Google AdWords connector in Azure Data Factory and Azure Synapse.

## Migrate to the new version of Google Ads API

- **Symptoms**

    You see a hint on the Google AdWords linked service configuration page. It reminds you to upgrade your linked service to a newer version before the legacy API is deprecated by Google. 

- **Cause** 

    Due to the sunset of Google AdWords API by **April 27, 2022**, you are recommended to migrate your existing linked service to the new version of Google Ads API before the date. Starting **April 27, 2022**, connection will start to fail because of the deprecation of Google AdWords API (see this [link](https://ads-developers.googleblog.com/2021/04/upgrade-to-google-ads-api-from-adwords.html)). Migration steps:
    
    1. Open your Google AdWords connector linked service configuration page.
    2. Edit the linked service and choose the new API version (select **Google Ads**).
    
       :::image type="content" source="media/connector-troubleshoot-guide/update-google-adwords-linked-service.png" alt-text="Screenshot of updating the linked service configuration for Google AdWords.":::

    3. Apply the changes.

- **Known issues and recommendations**  

    1. The new Google Ads API doesn't provide a migration plan for below reports/tables:  
        a. AD_CUSTOMIZERS_FEED_ITEM_REPORT  
        b. CAMPAIGN_GROUP_PERFORMANCE_REPORT  
        c. CAMPAIGN_NEGATIVE_KEYWORDS_PERFORMANCE_REPORT  
        d. CAMPAIGN_NEGATIVE_LOCATIONS_REPORT  
        e. CAMPAIGN_NEGATIVE_PLACEMENTS_PERFORMANCE_REPORT  
        f. CREATIVE_CONVERSION_REPORT  
        g. CRITERIA_PERFORMANCE_REPORT  
        h. FINAL_URL_REPORT  
        i. KEYWORDLESS_CATEGORY_REPORT  
        j. MARKETPLACE_PERFORMANCE_REPORT  
        k. TOP_CONTENT_PERFORMANCE_REPORT  

    2. The syntax for Google Ads query language is similar to AWQL from the AdWords API, but not identical. You can refer this [document](https://developers.google.com/google-ads/api/docs/migration/querying) for more details.  


## Next steps

For more troubleshooting help, try these resources:

- [Connector troubleshooting guide](connector-troubleshoot-guide.md)
- [Data Factory blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/bg-p/AzureDataFactoryBlog)
- [Data Factory feature requests](/answers/topics/azure-data-factory.html)
- [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
- [Microsoft Q&A page](/answers/topics/azure-data-factory.html)
- [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)
