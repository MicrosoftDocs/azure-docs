---
title: Troubleshoot the Salesforce and Salesforce Service Cloud connectors
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to troubleshoot issues with the Salesforce and Salesforce Service Cloud connectors in Azure Data Factory and Azure Synapse Analytics. 
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: troubleshooting
ms.date: 03/04/2024
ms.author: jianleishen
ms.custom: has-adal-ref, synapse
---

# Troubleshoot the Salesforce and Salesforce Service Cloud connectors in Azure Data Factory and Azure Synapse

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article provides suggestions to troubleshoot common problems with the Salesforce and Salesforce Service Cloud connectors in Azure Data Factory and Azure Synapse.

## Error code: SalesforceOauth2ClientCredentialFailure

- **Cause**: You encounter this error code as you don't complete the Salesforce Connected App configuration.

- **Recommendation**: <br/>To configure your Salesforce Connected App, follow these steps:
    1. Create your connected app, and complete its [basic information](https://help.salesforce.com/s/articleView?id=sf.connected_app_create_basics.htm&type=5) and [OAuth settings](https://help.salesforce.com/s/articleView?id=sf.connected_app_create_api_integration.htm&type=5) for the connected app.
        1. Configure the **Connected App Name**, **API Name** and **Contact Email**.
        1. Select **Enable OAuth Settings**.
        1. Callback url can be random as Client Credential Flow don't need callback, for example: `https://login.salesforce.com/services/oauth2/callback` 
        1. Setup OAuth access token scope, it's better to set up "**Full access**" for Azure Data Factory in case of permission issue.
        <br/>If you want to keep the mini scope, at least the "**Manage user data via APIs (api)**" should be added.
        <br/>If you don't set proper scope, you may get following similar message like: **Unauthorized, This session is not valid for use with the REST API**
        1. Select **Enable Client Credentials Flow**.
    
        :::image type="content" source="media/connector-salesforce/configure-basic-information.png" alt-text="Screenshot of configuring basic information for the Salesforce connector app.":::

    1. Get Client ID and Secret through **Manage Consumer Details**.

        :::image type="content" source="media/connector-salesforce/manage-consumer-details.png" alt-text="Screenshot of the manage consumer details.":::

    1. Copy the client ID and secret to a txt file for Azure Data Factory linked service.

        :::image type="content" source="media/connector-salesforce/client-id-secret.png" alt-text="Screenshot of the Client ID and Secret.":::

    1. Create a user who has the API Only User permission.

        1. Set up a permission set which only has API only permission.
        :::image type="content" source="media/connector-salesforce/set-up-a-permission.png" alt-text="Screenshot of setting system permissions.":::
        1. Specify the **API Enabled** and **Api Only User**.
        :::image type="content" source="media/connector-salesforce/system-permissions.png" alt-text="Screenshot of the system permissions.":::
    
    1. Create a new user and link the permission set in the user detail page: **Permission Set Assignments**.
        :::image type="content" source="media/connector-salesforce/permission-set-assignments.png" alt-text="Screenshot of the permission set assignments.":::

    1. From the connected app detail page, click Manage, click **Edit Policies**. For **Run As**, select an execution user who has the API Only User permission. For **Timeout Value**, you can select a proper value or remain default None.
    
        :::image type="content" source="media/connector-salesforce/connected-app-detail.png" alt-text="Screenshot of the connected app detail.":::
        
        :::image type="content" source="media/connector-salesforce/edit-policies.png" alt-text="Screenshot of the edit policies.":::

## Related content

For more troubleshooting help, try these resources:

- [Connector troubleshooting guide](connector-troubleshoot-guide.md)
- [Data Factory blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/bg-p/AzureDataFactoryBlog)
- [Data Factory feature requests](/answers/topics/azure-data-factory.html)
- [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
- [Microsoft Q&A page](/answers/topics/azure-data-factory.html)
- [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)
