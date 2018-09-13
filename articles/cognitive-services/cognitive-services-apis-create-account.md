---
title: Create a Cognitive Services APIs account in the Azure portal
titlesuffix: Azure Cognitive Services
description: How to create a Microsoft Cognitive Services APIs account in the Azure portal.
services: cognitive-services
author: garyericson
manager: cgronlun

ms.service: cognitive-services
ms.topic: conceptual
ms.date: 02/01/2018
ms.author: garye
---

# Create a Cognitive Services APIs account in the Azure portal

To use Microsoft Cognitive Service APIs, you first need to create an account in the Azure portal.

1. Sign in to the [Azure portal](http://portal.azure.com).

2. Click **+ Create a resource**.

3. Under Azure Marketplace, select **AI + Cognitive Services** and discover the list of available APIs. Click on **See all** to see the entire list of Cognitive Services APIs. Click on the API of your choice to proceed.

    ![Select Cognitive Services APIs](media/cognitive-services-apis-create-account/select-cognitive-services-apis.png)

4. On the **Create** page, provide the following information:

   - **Account Name:** Name of the account. We recommend using a descriptive name, for example *AFaceAPIAccount*.

   - **Subscription:** Select one of the available Azure subscriptions in which you have at least Contributor permissions.

   - **API Type:** Choose the Cognitive Services API you want to use. For more information about the various Cognitive Services APIs available, visit the [Cognitive Services](https://azure.microsoft.com/services/cognitive-services/) site.

   - **Pricing tier:** The cost of your Cognitive Services account depends on the actual usage and the options you choose. For more information about pricing for each API, refer to the [pricing pages](https://azure.microsoft.com/pricing/details/cognitive-services/).

   - **Resource Group:** A resource group is a collection of resources that share the same lifecycle, permissions, and policies. To learn more about Resource Groups, see [Manage Azure resources through portal](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-portal).

   - **Resource Group Location:** This is required only if the API selected is global (not bound to a location). If the API is global and not bound to a location, however, you must specify a location for the resource group where the metadata associated with the Cognitive Services API account resides. This location has no impact on the runtime availability of your account. To learn more about resource group, see [Manage Azure resources through portal](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-portal).

   - **Explicit acknowledgment of Online Service Terms:** In order to create an account, subscription Owners or Contributors (as defined by [Azure Role-Based Access Control](https://docs.microsoft.com/azure/role-based-access-control/overview)) need to explicitly acknowledge the terms that apply to Cognitive Services in [Online Service Terms](https://www.microsoft.com/en-us/Licensing/product-licensing/products.aspx). 

     The subscription Owner can disable the creation of Cognitive Services account for a specific resource group or subscription through [Azure policies](../azure-policy/azure-policy-introduction.md) by following the article [Using Azure portal to assign and manage resource policies](../azure-policy/assign-policy-definition.md) and assigning a “Not allowed resource types” policy definition and specifying **Microsoft.CognitiveServices/accounts** as the target resource type.

     If account creation was disabled, the following error would be displayed at the time of account creation:

     ![Account creation error](media/cognitive-services-apis-create-account/error-message.png)

5. To pin the account to the Azure portal dashboard, click **Pin to Dashboard**.

6. Click **Create** to create the account.

After the Cognitive Services account is successfully deployed,
click the tile in the dashboard to view the account information.

You can use the **Endpoint URL** in the **Overview** section and keys in the **Keys** section to start making API calls in your applications.

![Display account information](media/cognitive-services-apis-create-account/display-account.png)

![Display account keys](media/cognitive-services-apis-create-account/account-keys.png)

### Next Steps

For more information about all the Microsoft Cognitive Services available, see [Cognitive Services](https://azure.microsoft.com/services/cognitive-services/).

For quickstart guides to using some example Cognitive Services APIs:

 - [Computer Vision C# quickstarts](computer-vision/quickstarts/csharp.md)
 - [Text Analytics with Python](text-analytics/quickstarts/python.md)
 - [Face API with JavaScript](face/quickstarts/javascript.md)
