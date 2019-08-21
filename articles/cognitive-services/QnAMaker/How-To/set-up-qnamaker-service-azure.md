---
title: Setup a QnA Maker service - QnA Maker
titleSuffix: Azure Cognitive Services
description: Before you can create any QnA Maker knowledge bases, you must first set up a QnA Maker service in Azure. Anyone with authorization to create new resources in a subscription can set up a QnA Maker service. 
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: conceptual
ms.date: 08/21/2019
ms.author: diberry
ms.custom: seodec18
---
# Create a QnA Maker service

Before you can create any QnA Maker knowledge bases, you must first set up a QnA Maker service in Azure. Anyone with authorization to create new resources in a subscription can set up a QnA Maker service.

## Create a new service

This procedure deploys a few Azure resources. Together, these resources manage the knowledge base content and provide question-answering capabilities though an endpoint.

1. Sign in to the Azure portal and [create a QnA Maker](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesQnAMaker) resource.

1. Select **Create** after reading the terms and conditions.

    ![Create a new QnA Maker service](../media/qnamaker-how-to-setup-service/create-new-resource-button.png)

1. In **QnA Maker**, select the appropriate tiers and regions.

    ![Create a new QnA Maker service - pricing tier and regions](../media/qnamaker-how-to-setup-service/enter-qnamaker-info.png)

    * Fill the **Name** with a unique name to identify this QnA Maker service. This name also identifies the QnA Maker endpoint to which your knowledge bases will be associated.
    * Choose the **Subscription** in which the QnA Maker resource will be deployed.
    * Select the **Pricing tier** for the QnA Maker management services (portal and management APIs). See [here](https://aka.ms/qnamaker-pricing) for details on the pricing of the SKUs.
    * Create a new **Resource Group** (recommended) or use an existing one in which to deploy this QnA Maker resource. QnA Maker creates several Azure resources; when you create a resource group to hold these resources, you can easily find, manage, and delete these resources by the resource group name.
    * Select a **Resource group location**.
    * Choose the **Search pricing tier** of the Azure Search service. If you see the Free tier option greyed out, it means you already have a Free Azure Search tier deployed in your subscription. In that case, you will need to start with the Basic Azure Search tier. See details of Azure search pricing [here](https://azure.microsoft.com/pricing/details/search/).
    * Choose the **Search Location** where you want Azure Search data to be deployed. Restrictions in where customer data must be stored will inform the location you choose for Azure Search.
    * Give a name to your App service in **App name**.
    * By default the App service defaults to the standard (S1) tier. You can change the plan after creation. See more details of App service pricing [here](https://azure.microsoft.com/pricing/details/app-service/).
    * Choose the **Website location** where the App Service will be deployed.

        > [!NOTE]
	    > The Search Location can be different from the Website Location.

    * Choose whether you want to enable **Application Insights** or not. If **Application Insights** is enabled, QnA Maker collects telemetry on traffic, chat logs, and errors.
    * Choose the **App insights location** where Application Insights resource will be deployed.
    * For cost savings measures, you can [share](upgrade-qnamaker-service.md?#share-existing-services-with-qna-maker) some but not all Azure resources created for QnA Maker. 

1. Once all the fields are validated, you can select **Create** to start deployment of these services in your subscription. It will take a few minutes to complete.

1. Once the deployment is done, you will see the following resources created in your subscription.

    ![Resource created a new QnA Maker service](../media/qnamaker-how-to-setup-service/resources-created.png)

## Region of management service

The management service of QnA Maker, only used for the portal & for initial data processing, is available only in West US. No customer data is stored in this West US service.

## How to manage keys in QnA Maker

Your QnA Maker service deals with two kinds of keys, **subscription keys** and **endpoint keys**.

![key management](../media/qnamaker-how-to-key-management/key-management.png)

1. **Subscription Keys**: These keys are used to access the [QnA Maker management service APIs](https://go.microsoft.com/fwlink/?linkid=2092179). These APIs let you perform edit your knowledge base.  

2. **Endpoint Keys**: These keys are used to access the knowledge base endpoint to get a response for a user question. You would typically use this endpoint in your chat bot, or client application code that consumes the QnA Maker service.
 
## Subscription Keys
You can view and reset your subscription keys from the Azure portal where you created the QnA Maker resource. 
1. Go to the QnA Maker resource in the Azure portal.

    ![QnA Maker resource list](../media/qnamaker-how-to-key-management/qnamaker-resource-list.png)

2. Go to **Keys**.

    ![subscription key](../media/qnamaker-how-to-key-management/subscription-key.PNG)

## Endpoint Keys

Endpoint keys can be managed from the [QnA Maker portal](https://qnamaker.ai).

1. Log in to the [QnA Maker portal](https://qnamaker.ai), go to your profile, and then click **Service settings**.

    ![endpoint key](../media/qnamaker-how-to-key-management/Endpoint-keys.png)

2. View or reset your keys.

    ![endpoint key manager](../media/qnamaker-how-to-key-management/Endpoint-keys1.png)

    >[!NOTE]
    >Refresh your keys if you feel they have been compromised. This may require corresponding changes to your client application or bot code.

## Share or upgrade your QnA Maker service
Share or upgrade your QnA Maker services in order to manage the resources better. 

You can choose to upgrade individual components of the QnA Maker stack after the initial creation. See the details of the dependent components and SKU selection [here](https://aka.ms/qnamaker-docs-capacity).

## Share existing services with QnA Maker

QnA Maker creates several Azure resources. In order to reduce management and benefit from cost sharing, use the following table to understand what you can and can't share:

|Service|Share|
|--|--|
|Cognitive Services|X|
|App service plan|✔|
|App service|X|
|Application Insights|✔|
|Search service|✔|

## Upgrade QnA Maker Management SKU

When you need to have more questions and answers in your knowledge base, beyond your current tier, upgrade your QnA Maker service pricing tier. 

To upgrade the QnA Maker management SKU:

1. Go to your QnA Maker resource in the Azure portal, and select **Pricing tier**.

    ![QnA Maker resource](../media/qnamaker-how-to-upgrade-qnamaker/qnamaker-resource.png)

2. Choose the appropriate SKU and press **Select**.

    ![QnA Maker pricing](../media/qnamaker-how-to-upgrade-qnamaker/qnamaker-pricing-page.png)

## Upgrade App service

 When your knowledge base needs to serve more requests from your client app, upgrade your app service pricing tier.

You can [scale up](https://docs.microsoft.com/azure/app-service/manage-scale-up) or scale down the App service.

1. Go to the App service resource in the Azure portal, and select **scale up** or **scale down** options as required.

    ![QnA Maker app service scale](../media/qnamaker-how-to-upgrade-qnamaker/qnamaker-appservice-scale.png)

## Upgrade Azure Search service

When you plan to have many knowledge bases, upgrade your Azure Search service pricing tier. 

Currently it is not possible to perform an in place upgrade of the Azure search SKU. However, you can create a new Azure search resource with the desired SKU, restore the data to the new resource, and then link it to the QnA Maker stack.

1. Create a new Azure search resource in the Azure portal, and choose the desired SKU.

    ![QnA Maker Azure search resource](../media/qnamaker-how-to-upgrade-qnamaker/qnamaker-azuresearch-new.png)

2. Restore the indexes from your original Azure search resource to the new one. See the backup restore sample code [here](https://github.com/pchoudhari/QnAMakerBackupRestore).

3. Once the data is restored, go to your new Azure search resource, select **Keys**, and note down the **Name** and the **Admin key**.

    ![QnA Maker Azure search keys](../media/qnamaker-how-to-upgrade-qnamaker/qnamaker-azuresearch-keys.png)

4. To link the new Azure search resource to the QnA Maker stack, go to the QnA Maker App service.

    ![QnA Maker appservice](../media/qnamaker-how-to-upgrade-qnamaker/qnamaker-resource-list-appservice.png)

5. Select **Application settings** and replace the **AzureSearchName** and **AzureSearchAdminKey** fields from step 3.

    ![QnA Maker appservice setting](../media/qnamaker-how-to-upgrade-qnamaker/qnamaker-appservice-settings.png)

6. Restart the App service.

    ![QnA Maker appservice restart](../media/qnamaker-how-to-upgrade-qnamaker/qnamaker-appservice-restart.png)

## # Troubleshooting tips to support the QnA Maker service and runtime

QnAMaker comprises resources hosted in the user's Azure subscription. Debugging may require users to manipulate their Azure QnAMaker resources or provide the QnAMaker support team with additional information about their setup.

## How to get latest QnAMaker runtime updates

The QnAMaker runtime is part of the Azure App Service deployed when you [create a QnAMaker service](./set-up-qnamaker-service-azure.md) in Azure portal. Updates are made periodically to the runtime. QnA Maker App Service is on auto-update mode after the Apr 2019 site extension release (version 5+). This is already designed to take care of ZERO downtime during upgrades. 

You can check your current version at https://www.qnamaker.ai/UserSettings. If your version is older than version 5.x, you must restart the App Service to apply the latest updates.

1. Go to your QnAMaker service (resource group) in the [Azure portal](https://portal.azure.com)

    ![QnAMaker Azure resource group](../media/qnamaker-how-to-troubleshoot/qnamaker-azure-resourcegroup.png)

1. Click on the App Service and open the Overview section

     ![QnAMaker App Service](../media/qnamaker-how-to-troubleshoot/qnamaker-azure-appservice.png)

1. Restart the App service. It should complete within a couple of seconds. Note that any dependent applications or bots that use this QnAMaker service will be unavailable to end-users during this restart period.

    ![QnAMaker appservice restart](../media/qnamaker-how-to-upgrade-qnamaker/qnamaker-appservice-restart.png)

## Next steps

> [!div class="nextstepaction"]
> [Create and publish a knowledge base](../Quickstarts/create-publish-knowledge-base.md)
