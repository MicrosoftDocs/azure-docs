---
title: How to configure Salesforce connected App
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to configure Salesforce connected App by using a copy activity in an Azure Data Factory or Azure Synapse Analytics pipeline.
ms.author: jianleishen
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.custom: synapse
ms.date: 02/29/2024
---

# Salesforce Connected App Configuration 

You can refer to the [official doc](https://help.salesforce.com/s/articleView?id=sf.connected_app_client_credentials_setup.htm&type=5) to configure your Salesforce Connected APP or refer to the below steps:

1. Create your connected app, and complete its [basic information](https://help.salesforce.com/s/articleView?id=sf.connected_app_create_basics.htm&type=5) and [OAuth settings](https://help.salesforce.com/s/articleView?id=sf.connected_app_create_api_integration.htm&type=5) for the connected app.
    1. Configure the **Connected App Name**, **API Name** and **Contact Email**.
    1. Select **Enable OAuth Settings**.
    1. Callback url can be random as Client Credential Flow don't need callback, for example: `https://login.salesforce.com/services/oauth2/callback` 
    1. Setup OAuth access token scope, it's better to set up "**Full access**" for Azure Data Factory in case of permission issue.
    <br/>If you want to keep the mini scope, at least the "**Manage user data via APIs (api)**" should be added.
    <br/>If you don't set proper scope, you may get following similar message like: **Unauthorized, This session is not valid for use with the REST API**
    1. Select **Enable Client Credentails FLow**.

    :::image type="content" source="media/connector-salesforce/configure-basic-information.png" alt-text="Screenshot of configuring basic information for the Salesforce connector app.":::

1. Get Client Id and Secret through **Manage Consumer Details**.

    :::image type="content" source="media/connector-salesforce/manage-consumer-details.png" alt-text="Screenshot of the manage consumer details.":::

1. Copy the client id and secret to a txt file for Azure Data Factory linked service.

    :::image type="content" source="media/connector-salesforce/client-id-secret.png" alt-text="Screenshot of the Client Id and Secret.":::

1. Create a user who has the API Only User permission.

    1. Set up a permission set which only have API only permission.
    :::image type="content" source="media/connector-salesforce/set-up-a-permission.png" alt-text="Screenshot of setting system permissions.":::
    1. Specify the **API Enabled** and **Api Only User**.
    :::image type="content" source="media/connector-salesforce/system-permissions.png" alt-text="Screenshot of the system permissions.":::

1. Create a new user and link the permission set in the user detail page: **Permission Set Assignments**.
    :::image type="content" source="media/connector-salesforce/permission-set-assignments.png" alt-text="Screenshot of the permission set assignments.":::

1. From the connected app detail page, click Manage, Click **Edit Policies**. For **Run As**, select an execution user who has the API Only User permission. Set the **Timeout Value** value to None.

    :::image type="content" source="media/connector-salesforce/connected-app-detail.png" alt-text="Screenshot of the connected app detail.":::
    
    :::image type="content" source="media/connector-salesforce/edit-policies.png" alt-text="Screenshot of the edit policies.":::