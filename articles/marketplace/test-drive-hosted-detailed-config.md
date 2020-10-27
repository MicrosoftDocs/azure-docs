---
title: Detailed configuration for a hosted test drive in the commercial marketplace
description: Explanation configuration steps for a hosted test drive in the commercial marketplace (Azure Marketplace)
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: keferna
ms.author: keferna
ms.date: 11/06/2020
---

# Detailed configuration for a hosted test drive

[Configure Microsoft Hosted Test Drive for Customer Engagement in Cloud Partner Portal](#CustomerEngagement)

[Configure Microsoft Hosted Test Drive for Dynamics 365 Operations in Cloud Partner Portal](#Dynamics365)

## Configure Microsoft Hosted Test Drive for Customer Engagement in Cloud Partner Portal

1. Log in to Cloud Partner Portal: [https://partner.microsoft.com](https://partner.microsoft.com/)
2. If you are not able to access the above link, you need to submit a request [here](https://appsource.microsoft.com/en-us/partners/list-an-app) to publish your application. Once we review the request, you will be granted access to start the publish process.
3. Navigate to existing **Dynamics 365 for Customer Engagement** offer or create a new **Dynamics 365 for Customer Engagement** offer.
4. Select the **Enable a test drive checkbox** and click **Save**.

[![](RackMultipart20201027-4-kqq5n7_html_33205b6aca1a65a2.jpg)](https://github.com/microsoft/AppSource/blob/master/Images/CE_OfferSetup.JPG)

- **Type of Test Drive** : Choose **Microsoft Hosted (Dynamics 365 for Customer Engagement &amp; PowerApps)** option. This indicates that Microsoft will host and maintain the service that performs the Test Drive user provisioning and deprovisioning.
5. Grant AppSource permission to provision and deprovision Test Drive users in your tenant using the instructions located [here](https://github.com/Microsoft/AppSource/blob/master/Microsoft%20Hosted%20Test%20Drive/Setup-your-Azure-subscription-for-Dynamics365-Microsoft-Hosted-Test-Drives.md). In this step you will generate the **Azure AD App Id** and **Azure AD App Key** values mentioned below.
6. Provide the following fields in the **Technical Configuration** section.

[![](RackMultipart20201027-4-kqq5n7_html_7a656fad28e321e5.jpg)](https://github.com/microsoft/AppSource/blob/master/Images/CE_TestDriveConfiguration.JPG)

- **Max Concurrent Test Drives** : Set this field to the number of concurrent users that can have an active Test Drive at any given point of time. Be aware that each user will consume a Dynamics license while their Test Drive is active, so you will need to ensure you have at least this many Dynamics licenses available for Test Drive users. Recommended value of 3-5.
- **Test Drive Duration (hours)**: Set this field to the number of hours the users Test Drive will be active for. After the set amount of time has expired, the user will be deprovisioned from your tenant. Recommended value of 2-24 hours depending on the complexity of your App. The user can always request another Test Drive if they run out of time and want to access the Test Drive again.
- **Instance URL** : Provide a URL that the Test Drive user will initially be navigated to when they start the Test Drive. This is typically the URL of your Dynamics 365 instance that has your App and sample data installed onto. Example Value: https://testdrive.crm.dynamics.com
- **Azure AD Tenant Id** : Provide the ID of the Azure Tenant for your Dynamics 365 Instance. To retrieve this value, login to Azure portal and navigate to **Azure Active Directory** \&gt; From the menu, select **Properties** \&gt; Copy the Directory ID. Example value: 72f988bf-86f1-41af-91ab-2d7cd0111234
- **Azure AD App Id** : ID of the Azure AD App you created in Step 6.
 Example Value: 53852862-a2ae-4e43-9461-faa49650a096
- **Azure AD App Key** : Secret for the Azure AD App created in Step 6.
 Example Value: IJUgaIOfq9b9LbUjeQmzNBW4VGn6grr1l/n3aMrnfdk=
- **Azure AD Tenant Name** : Provide the name of the Azure Tenant for your Dynamics 365 Instance. Use the format of \&lt;tenantname\&gt;.onmicrosoft.com. Example Value: testdrive.onmicrosoft.com
- **Instance Web API URL** : Provide the Web API URL for your Dynamics 365 Instance. You can retrieve this value by logging into your Microsoft Dynamics 365 instance and navigating to Setting \&gt; Customization \&gt; Developer Resources \&gt; Instance Web API (Copy this URL). Example value: https://testdrive.api.crm.dynamics.com/api/data/v9.0 [![](RackMultipart20201027-4-kqq5n7_html_380b36e69c1480b.png)](https://github.com/Microsoft/AppSource/blob/patch-1/Images/InstanceWebApiUrl.png)
- **Role name** : Provide the name of the custom Dynamics 365 Security Role you have created for Test Drive or you can use existing role as well. If you create a new role it should have minimum required privileges added to the role to login into Customer Engagement instance. Refer [link](https://community.dynamics.com/crm/b/crminogic/archive/2016/11/24/minimum-privileges-required-to-login-microsoft-dynamics-365) to review minimum required privileges. This is the role that will be assigned to users during their Test Drive. Example Value: testdriverole
- **Please ensure that security group check is not added for user to get synced to Customer Engagement instance**
7. Provide the Marketplace listing details. Click Language value in Marketplace listing to see further required fields.

[![](RackMultipart20201027-4-kqq5n7_html_c0e532dc7942a4f6.jpg)](https://github.com/microsoft/AppSource/blob/master/Images/CE_MarketListing.JPG)

- **Description** : Provide an overview of your Test Drive. This text will be shown to the user while the Test Drive is being provisioned. This field supports HTML if you want to provide formatted content.
- **User Manual** : Upload a detailed user manual (file of type .pdf) which helps Test Drive users understand how to use your App.
- **Test Drive Demo Video** : Optionally upload a video that showcases your App.

# Configure Microsoft Hosted Test Drive for Dynamics 365 Operations in Cloud Partner Portal

1. Login to [Cloud Partner Portal](https://partner.microsoft.com/).
2. If you are not able to access the above link, you need to submit a request [here](https://appsource.microsoft.com/en-us/partners/list-an-app) to publish your application. Once we review the request, you will be granted access to start the publish process.
3. Navigate to existing **Dynamics 365 for Operations** offer or create a new **Dynamics 365 for Operations** offer.
4. Select the **Enable a test drive** checkbox and click **Save**.

[![](RackMultipart20201027-4-kqq5n7_html_b9d6997c6a1e79b4.jpg)](https://github.com/microsoft/AppSource/blob/master/Images/FO_OfferSetup.JPG)

- **Type of Test Drive** : Choose **Microsoft Hosted (Dynamics 365 for Operations)** option. This indicates that Microsoft will host and maintain the service that performs the Test Drive user provisioning and deprovisioning.

1. Grant AppSource permission to provision and deprovision Test Drive users in your tenant using the instructions located [here](https://github.com/Microsoft/AppSource/blob/master/Microsoft%20Hosted%20Test%20Drive/Setup-your-Azure-subscription-for-Dynamics365-Operations-Microsoft-Hosted-Test-Drives.md). In this step you will generate the **Azure AD App Id** and **Azure AD App Key** values mentioned below.
2. Provide the following fields in the **Technical Configuration** section.

[![](RackMultipart20201027-4-kqq5n7_html_eca44890444be7ed.jpg)](https://github.com/microsoft/AppSource/blob/master/Images/FO_TestDriveConfiguration.JPG)

- **Max Concurrent Test Drives** : Set this field to the number of concurrent users that can have an active Test Drive at any given point of time. Be aware that each user will consume a Dynamics license while their Test Drive is active, so you will need to ensure you have at least this many Dynamics licenses available for Test Drive users. Recommended value of 3-5.
- **Test Drive Duration (hours)**: Set this field to the number of hours the users Test Drive will be active for. Afterthe set amount of time has expired, the user will be deprovisioned from your tenant. Recommended value of 2-24 hours depending on the complexity of your App. The user can always request another Test Drive if they run out of time and want to access the Test Drive again.
- **Instance URL** : Provide an URL that the Test Drive user will initially be navigated to when they start the Test Drive. This is typically the URL of your Dynamics 365 instance that has your App and sample data installed onto. Example Value: https://testdrive.crm.dynamics.com
- **Azure AD Tenant Id** : Provide the ID of the Azure Tenant for your Dynamics 365 Instance. To retrieve this value, login to Azure portal and navigate to **Azure Active Directory** \&gt; From the menu, select **Properties** \&gt; Copy the Directory ID. Example value: 72f988bf-86f1-41af-91ab-2d7cd0111234
- **Azure AD App Id** : ID of the Azure AD App you created in Step6.
 Example Value: 53852862-a2ae-4e43-9461-faa49650a096
- **Azure AD App Key** : Secret for the Azure AD App created in Step6.
 Example Value: IJUgaIOfq9b9LbUjeQmzNBW4VGn6grr1l/n3aMrnfdk=
- **Azure AD Tenant Name** : Provide the name of the Azure Tenant for your Dynamics 365 Instance. Use the format of \&lt;tenantname\&gt;.onmicrosoft.com. Example Value: testdrive.onmicrosoft.com
- **Trail Legal Entity** : Provide a Legal Entity to assign a trail user. You can create a new one using [link](https://technet.microsoft.com/en-us/library/hh242184.aspx).
- **Role name** : Provide the  **AOT name**  of the custom Dynamics 365 Security Role you have created for Test Drive. This is the role that will be assigned to users during their Test Drive.

[![](RackMultipart20201027-4-kqq5n7_html_420fcd2faff4e7f0.jpg)](https://github.com/Microsoft/AppSource/blob/master/Images/AOTNameOfRole.JPG)

3. Provide the Marketplace listing details. Click Language value in Marketplace listing to see further required fields.

[![](RackMultipart20201027-4-kqq5n7_html_c0e532dc7942a4f6.jpg)](https://github.com/microsoft/AppSource/blob/master/Images/CE_MarketListing.JPG)

- **Description** : Provide an overview of your Test Drive. This text will be shown to the user while the Test Drive is being provisioned. This field supports HTML if you want to provide formatted content.
- **User Manual** : Upload a detailed user manual (file of type .pdf) which helps Test Drive users understand how to use your App.
- **Test Drive Demo Video** : Optionally upload a video that showcases your App.

## Next step

- [Test drive technical configuration](test-drive-technical-configuration.md)
