---
title: Hosted Test Drive | Azure Marketplace
description: How to setup an maintain a Marketplace Hosted Test Drive
services: Azure, Marketplace, Cloud Partner Portal, 
author: pbutlerm
manager: Ricardo.Villalobos  
ms.service: marketplace
ms.topic: conceptual
ms.date: 09/13/2018
ms.author: pabutler
---

# Hosted Test Drive

A Hosted Test Drive removes the complexity of setup by Microsoft hosting and maintain the service that performs the Test Drive user provisioning and deprovisioning. This article is for Publishers who have their offer on AppSource or are building a new one and want to offer a Hosted Test Drive, which connects with a Dynamics 365 for Customer Engagement, Dynamics 365 for Finance and Operations, or Dynamics 365 Business Central instance.

## How to publish a Test Drive

Navigate to existing offer or create a new offer.

Select the Test Drive option from the side menu.

Select \'Yes\' for \'Enable a Test Drive\' option.

Provide the following fields in the \'Details\' section.

- **Description**: Provide an overview of your Test Drive. This text will be shown to the user while the Test Drive is being provisioned. This field supports HTML if you want to provide formatted content.
- **User Manual**: Upload a detailed user manual (file of type .pdf) which helps Test Drive users understand how to use your App.
- **Test Drive Demo Video**: Optionally upload a video that showcases your App.

Grant AppSource permission to provision and deprovision Test Drive users in your tenant using the instructions located [here](https://github.com/Microsoft/AppSource/blob/patch-1/Microsoft%20Hosted%20Test%20Drive/Setup-your-Azure-subscription-for-Dynamics365-Microsoft-Hosted-Test-Drives.md).

In this step, you will generate the \'Azure AD App Id\' and \'Azure AD App Key\' values mentioned below.

Provide the following fields in the \'Technical Configuration\' section:

- **Type of Test Drive**: Choose \'Microsoft Hosted (example Dynamics 365 for Customer Engagement)' option. This indicates that Microsoft will host and maintain the service that performs the Test Drive user
    provisioning and deprovisioning.
- **Max Concurrent Test Drives**: Set this field to the number of concurrent users that can have an active Test Drive at any given point of time. Each user will consume a Dynamics license while their Test Drive is active, so you will need to ensure you have at least this many Dynamics licenses available for Test
    Drive users. Recommended value of 3-5.
- **Test Drive Duration (hours)**: Set this field to the number of hours the users Test Drive will be active for. After this many hours, the user will be deprovisioned from your tenant. Recommended
    value of 2-24 hours depending on the complexity of your App. The user can always request another Test Drive if they run out of time and want to access the Test Drive again.
- **Instance URL**: Provide a URL that the Test Drive user will initially be navigated to when they start the Test Drive. This is typically the URL of your Dynamics 365 instance that has your App and sample data installed onto. Example Value: https:\//testdrive.crm.dynamics.com
- **Azure AD Tenant ID**: Provide the ID of the Azure Tenant for your Dynamics 365 Instance. To retrieve this value, login to Azure portal and navigate to \'Azure Active Directory\' -\> Select Properties
    from menu blade -\> Copy the Directory ID. Example value: 72f988bf-86f1-41af-91ab-2d7cd0111234
- **Azure AD App ID**: ID of the Azure AD App you created in step 7.\ Example Value: 53852862-a2ae-4e43-9461-faa49650a096
- **Azure AD App Key**: Secret for the Azure AD App created in step 7.\ Example Value: IJUgaIOfq9b9LbUjeQmzNBW4VGn6grr1l/n3aMrnfdk=
- **Azure AD Tenant Name**: Provide the name of the Azure Tenant for your Dynamics 365 Instance. Use the format of \<tenantname.\>onmicrosoft.com. Example Value: testdrive.onmicrosoft.com
- **Instance Web API URL**: Provide the Web API URL for your Dynamics 365 Instance. You can retrieve this value by logging into your Microsoft Dynamics 365 instance and navigating to Setting -\> Customization -\> Developer Resources -\> Instance Web API (Copy this URL). Example value:  https:\//testdrive.crm.dynamics.com/api/data/v9.0 
- **Role name**: Provide the name of the custom Dynamics 365 Security Role you have created for Test Drive. This is the role that will be assigned to users during their Test Drive. Example Value: testdriverole

## Next steps

When ready **publish** your offer, after your app has passed certification, you will have a **preview** of your offer. Start a Test Drive in the UI and verify that your Test Drives are running correctly. Once you feel comfortable with your preview offering, now it is time to **go live!**
