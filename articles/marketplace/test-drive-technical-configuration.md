---
title: Test drive technical configuration, Microsoft commercial marketplace
description: Learn about test drives. Test drives allow new customers to test drive your offer before committing to the purchase. 
author: dsindona 
ms.author: dsindona 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
ms.date: 08/13/2019
---

# Test drive technical configuration

The test drive option in the Microsoft commercial marketplace lets you configure a hands-on, self-guided tour of your product's key features. With a test drive, new customers can try your offer before committing to purchase it. For more information, see [What is Test Drive?](what-is-test-drive.md)

If you no longer want to provide a test drive for your offer, return to the **Offer setup** page and clear the **Enable test drive** check box. Not all offer types have a test drive available.

## Azure Resource Manager test drive

This is the only test drive option for virtual machine or Azure app offers and also requires fairly detailed setup. Read the sections below for [Deployment subscription details](#deployment-subscription-details) and [Test drive listings](#test-drive-listings), then continue with the separate topic for [Azure Resource Manager test drive configuration](azure-resource-manager-test-drive.md).

## Hosted test drive

Microsoft can remove the complexity of setting up a test drive by hosting and maintaining the service provisioning and deployment using this type of test drive. The configuration for this type of hosted test drive is the same regardless of whether the test drive is targeting a Dynamics 365 Business Central, Dynamics 365 Customer Engagement, or Dynamics 365 Operations audience.

- **Max concurrent test drives** (required) – Set the maximum number of customers that can use your test drive at one time. Each concurrent user will consume a Dynamics 365 license while the test drive is active, so ensure you have enough licenses available to support the maximum limit set. The recommended value is 3-5.

- **Test drive duration** (required) – Enter the number of hours the test drive will stay active. After this time, the session will end and no longer consume one of your licenses. We recommend a value of 2-24 hours depending on the complexity of your offer. This duration may only be set in whole hours (for example, "2" hours is valid; "1.5" is not). The user can request a new session if they run out of time and want to access the test drive again.

- **Instance URL** (required) – The URL where the customer will begin their test drive. Typically the URL of your Dynamics 365 instance running your app with sample data installed (for example, `https://testdrive.crm.dynamics.com`).

- **Instance Web API URL** (required) – Retrieve the Web API URL for your Dynamics 365 instance by logging into your Microsoft 365 account and navigating to **Settings** > **Customization** > **Developer Resources** > **Instance Web API (Service Root URL)**, copy the URL found here (for example, `https://testdrive.crm.dynamics.com/api/data/v9.0`).

- **Role name** (required) – Provide the security role name you have defined in your custom Dynamics 365 test drive, which will be assigned to the user during their test drive (for example, test-drive-role).

For help on how to set up your Dynamics 365 environment for test drive and grant AppSource permission to provision and deprovision test drive users in your tenant, follow [these instructions](https://github.com/Microsoft/AppSource/blob/patch-1/Microsoft%20Hosted%20Test%20Drive/Setup-your-Azure-subscription-for-Dynamics365-Microsoft-Hosted-Test-Drives.md).

## Logic app test drive

This type of test drive is not hosted by Microsoft. Use it to connect with a Dynamics 365 offer or other custom resource, which encompasses a variety of complex solution architectures. For more information about setting up Logic App test drives, visit [Operations](https://github.com/Microsoft/AppSource/blob/master/Setup-your-Azure-subscription-for-Dynamics365-Operations-Test-Drives.md) and [Customer Engagement](https://github.com/Microsoft/AppSource/wiki/Setting-up-Test-Drives-for-Dynamics-365-app) on GitHub.

- **Region** (required, single-selection dropdown list) – Currently there are 26 Azure-supported regions where your test drive can be made available. The resources for your Logic app will be deployed in the region you select. If your Logic App has any custom resources stored in a specific region, make sure that region is selected here. The best way is to fully deploy your Logic App locally on your Azure subscription in the portal and verify that it functions correctly before making this selection.

- **Max concurrent test drives** (required) – Set the maximum number of customers that can use your test drive at one time. These test drives are already deployed, enabling customers to instantly access them without waiting for a deployment.

- **Test drive duration** (required) – Enter the length of time that the Test Drive will stay active, in # of hours. The test drive terminates automatically after this time period ends.

- **Azure resource group name** (required) – Enter the [Azure resource group](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview#resource-groups) name where your Logic App test drive is saved.

- **Azure logic app name** (required) – Enter the name of the Logic app that assigns the test drive to the user. This Logic app must be saved in the Azure resources group above.

- **Deprovision logic app name** (required) – Enter the name of the Logic app that de-provisions the test drive once the customer is finished. This Logic app must be saved in the Azure resources group above.

## Power BI test drive

Products that want to demonstrate an interactive Power BI visual can use an embedded link to share a custom-built dashboard as their test drive, no further technical configuration required. All you need to do here is upload your embedded Power BI URL.

For more information on setting up Power BI apps, see [What are Power BI apps?](https://docs.microsoft.com/power-bi/service-template-apps-overview)

## Deployment subscription details

To allow Microsoft to deploy the test drive on your behalf, create and provide a separate, unique Azure Subscription (not required for Power BI test drives).

- **Azure subscription ID** (required for Azure Resource Manager and Logic apps) – Enter the subscription ID to grant access to your Azure account services for resource usage reporting and billing. We recommend that you consider [creating a separate Azure subscription](https://docs.microsoft.com/azure/billing/billing-create-subscription) to use for test drives if you don't have one already. You can find your Azure subscription ID by logging in to the [Azure portal](https://portal.azure.com/) and navigating to the **Subscriptions** tab of the left-side menu. Selecting the tab will display your subscription ID (for example, "a83645ac-1234-5ab6-6789-1h234g764ghty").

- **Azure AD tenant ID** (required) – Enter your Azure Active Directory (AD) [tenant ID](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal#get-values-for-signing-in). To find this ID, sign in to the [Azure portal](https://portal.azure.com/), select the Active Directory tab in the left-menu, select **Properties**, then look for the **Directory ID** number listed (for example, 50c464d3-4930-494c-963c-1e951d15360e). You can also look up your organization's tenant ID using your domain name address at [https://www.whatismytenantid.com](https://www.whatismytenantid.com).

- **Azure AD tenant name** (required for Dynamic 365) – Enter your Azure Active Directory (AD) name. To find this name, sign in to the [Azure portal](https://portal.azure.com/), in the upper right corner your tenant name will be listed under your account name.

- **Azure AD app ID** (required) – Enter your Azure Active Directory (AD) [application ID](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal#get-values-for-signing-in). To find this ID, sign in to the [Azure portal](https://portal.azure.com/), select the Active Directory tab in the left-menu, select **App registrations**, then look for the **Application ID** number listed (such as `50c464d3-4930-494c-963c-1e951d15360e`).

- **Azure AD app client secret** (required) – Enter your Azure AD application [client secret](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal#certificates-and-secrets). To find this value, sign in to the [Azure portal](https://portal.azure.com/). Select the **Azure Active Directory** tab in the left menu, select **App registrations**, then select your test drive app. Next, select **Certificates and secrets**, select **New client secret**, enter a description, select **Never** under **Expires**, then choose **Add**. Make sure to copy down the value. Don't navigate away from the page before you copy the value.

## Test drive listings

The **Test Drive listings** option found under the **Test drive** tab in Partner Center displays the languages (and markets) where your test drive is available, currently English (United States) is the only location available. Additionally, this page displays the status of the language-specific listing and the date/time that it was added. You will need to define the test drive details (description, user manual, videos, etc.) for each language/market.

- **Description** (required): Describe your test drive, what will be demonstrated, objectives for the user to experiment with, features to explore, and any relevant information to help the user determine whether to acquire your offer. Up to 3,000 characters of text can be entered in this field.

- **Access information** (required for Azure Resource Manager and Logic test drives): Explain what a customer needs to know in order to access and use this test drive. Walk through a scenario for using your offer and exactly what the customer should know to access features throughout the test drive. Up to 10,000 characters of text can be entered in this field.

- **User Manual** (required): An in-depth walk-through of your test drive experience. The User Manual should cover exactly what you want the customer to gain from experiencing the test drive and serve as a reference for any questions that they may have. The file must be in PDF format and be named (255 characters max) after uploading.

- **Videos: Add videos** (optional): Videos hosted elsewhere can be referenced here with a link and thumbnail image (533 x 324 pixels) so a customer can view a walk-through of information to help them better understand the test drive, including how to successfully use the features of your offer and understand scenarios that highlight their benefits.
  - **Name** (required)
  - **URL** (YouTube or Vimeo only; required)
  - **Thumbnail** (533 x 324 pixels) – Image must be in PNG format.

If you are currently creating your test drive in Partner Center, select **Save draft** before continuing.

## Next step

- [Update an existing offer in the commercial marketplace](partner-center-portal/update-existing-offer.md)
