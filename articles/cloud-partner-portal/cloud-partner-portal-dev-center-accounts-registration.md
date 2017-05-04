---
title: How to create a Microsoft Developer account for Azure Marketplace publishing  | Microsoft Docs
description: This article explains the steps to create a Microsoft Developer account for Azure Marketplace and publishing. 
services: cloud-partner-portal
documentationcenter: ''
author: rupeshazure
manager: hamidm

ms.service: cloud-partner-portal
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/03/2017
ms.author: rupesk@microsoft.com
ms.robots: NOINDEX, NOFOLLOW

---
# Create a Microsoft Developer account
This article walks you through the necessary account creation and registration process to become an approved Microsoft Developer for the Azure Marketplace publishing.

## 1. Create a Microsoft account
To start the publishing process, you will need to complete the **Microsoft Developer Center** registration.You will use the same registered account on the **[Cloud Partner Portal](https://cloudpartner.azure.com/)** to start the publishing process. You should have only one Microsoft account for your Azure Marketplace offerings. It should not be specific to services or offers.

The address that forms the user name should be on your domain and controlled by your IT team. All the publishing related activities should be done through this account.

> [!WARNING]
> Words like **"Azure"** and **"Microsoft"** are not supported for Microsoft account registration. Avoid using these words to complete the account creation and registration process.
>
>

### Guidelines for company accounts
When creating a company account, follow these guidelines if more than one person will need to access the account by logging in with the Microsoft account that opened the account.

> [!Important]
> Important To allow multiple users to access your Dev Center account, we recommend using Azure Active Directory to assign roles to individual users, who can access the account by signing in with their individual Azure AD credentials. For
more info, see [Manage account users](https://msdn.microsoft.com/windows/uwp/publish/manage-account-users).

* Create your Microsoft account using an email address that belongs to your company's domain, but not to a single individual—for example, windowsapps@fabrikam.com.
* Limit access to this Microsoft account to the smallest possible number of developers.
* Set up a corporate email distribution list that includes everyone who needs to access the developer account, and add this email address to your security info. This allows all of the employees on the list to receive security codes when needed and to manage your Microsoft account’s security info. If setting up a distribution list is not feasible, the owner of the individual email account will need to be available to access and share the security code when prompted (such as when new security info is added to the account or when it must be accessed from a new device).
* Add a company phone number that does not require an extension and is accessible to key team members.
* In general, have developers use trusted devices to log in to your company's developer account. All key team members should have access to these trusted devices. This will reduce the need for security codes to be sent when accessing the account.
* If you need to allow access to the account from a non-trusted PC, limit that access to a maximum of five developers. Ideally, these developers should access the account from machines that share the same geographical and network location.
* Frequently review your company’s security info at [https://account.live.com/proofs/Manage](https://account.live.com/proofs/Manage) to make sure it's all current.

Your developer account should be accessed primarily from trusted PCs. This is critical because there is a limit to the number of codes generated per account, per week. It also enables the most seamless sign-in experience.

For more information on additional developer account guidelines and security, click [here](https://msdn.microsoft.com/windows/uwp/publish/opening-a-developer-account#additional-guidelines-for-company-accounts).

### Instructions
1. Open a new Chrome Incognito or Internet Explorer InPrivate browsing session to ensure that you’re not signed in to an existing account.
2. Register the email (per the guidelines above e.g. windowsapp@fabrikam.com) as a Microsoft account by using the link [https://signup.live.com/signup.aspx](https://signup.live.com/signup.aspx). Follow the instructions below.

   	A. During registering your account as a Microsoft account, you need to provide a valid phone number for the system to send you an account verification code as a text message or an automated call.

   	B. During registering your account as a Microsoft account, you need to provide a valid email id for receiving an automated email for account verification.

	C. Verify the email address sent to the DL.

	D. You’re now ready to use the new Microsoft account in the Microsoft Developer Center.

## 2. Register your account in Microsoft Developer Center

The Microsoft Developer Center is used to register the company information once. The registrant must be a valid representative of the company, and must provide their personal information as a way to validate their identity. The person registering must use a Microsoft account that is shared for the company, **and the same account must be used in the Cloud Partner Portal.** You should check to make sure your company does not already have a Microsoft Developer Center account before you attempt to create one. During the process, we will collect company address information, bank account information, and tax information. These are typically obtainable from finance or business contacts.

> [!IMPORTANT]
> You must complete the following Developer profile components in order to progress through the various phases of offer creation and deployment.
>
>

| Developer profile | To start draft | Staging | Publish free and solution template | Publish commercial |
| --- | --- | --- | --- | --- |
| Company registration |Must have |Must have |Must have |Must have |
| Tax profile ID |Optional |Optional |Optional |Must have |
| Bank account |Optional |Optional |Optional |Must have |

> [!NOTE]
> Bring Your Own License (BYOL) is supported only for virtual machines and is considered a **free** offering.
>
>

### Register your company account
Step 1. Open a new  Internet Explorer InPrivate or Chrome Incognito browsing session to ensure that you’re not signed in to a personal account.

Step 2. Go to [http://dev.windows.com/registration?accountprogram=azure](http://dev.windows.com/registration?accountprogram=azure) to register yourself as a seller in the Dev Center. Please read the following important note before you proceed.

![drawing][img-verify]

   > [!IMPORTANT]
   > Ensure that the email id or distribution list (a distribution list is recommended to remove dependency from individuals) which you will be using for registering in the Dev Center is at first registered as a Microsoft account. If not, then please register using this [link](https://signup.live.com/signup?uaid=e479342fe2824efeb0c3d92c8f961fd3&lic=1). Also, **any email id under the Microsoft company domain i.e. @microsoft.com cannot be used** for Dev Center registration.
   >
   >

![Dev center sign in](./media/cloud-partner-portal-create-dev-center-registration/seller-dashboard-login.jpg)

Step 3. Complete the "Help us protect your account" wizard, which will verify your identity via phone number or email address.

Step 4. In the "Registration-Account Info" section, select your **Account country/region** from the dropdown menu.

 ![drawing](./media/cloud-partner-portal-create-dev-center-registration/imgRegisterCo_04.png)

   > [!WARNING]
   > **"Sell-from" Countries:** In order to sell your services on the Azure Marketplace, your registered entity needs to be from one of the approved “sell-from” countries above. This restriction is for payout and taxation reasons. We are actively looking to expand this list of countries in the near future, so stay tuned. For more information, see the  [Marketplace participation policies](http://go.microsoft.com/fwlink/?LinkID=526833).
   >


Step 5. Select your "Account Type" as **Company** and then click the **Next** button.

   > [!IMPORTANT]
   > To better understand account types and which is best for you to choose, please view page [Account types, locations, and fees](https://msdn.microsoft.com/library/windows/apps/jj863494.aspx)
   >
   >

   ![drawing](./media/cloud-partner-portal-create-dev-center-registration/imgRegisterCo_05.png)

Step 6. Enter the **Publisher display name**, typically the name of your company.

   > [!TIP]
   > The publisher display name entered in the Dev Center is not displayed in the Azure Marketplace once your offer goes listed. But this must be filled to complete the registration process.
   >


Step 7. Enter the **Contact info** for the account verification.

   > [!IMPORTANT]
   > You must provide accurate contact information because it will be used in our verification process for your company to be approved in the Developer Center.
   >


Step 8. Enter the contact information for the **Company Approver**. Company approver is the person who can verify that you are authorized to create an account in the Dev Center on behalf of your organization. Click on **Next** to move to the **"Payment section"** once you are finished.

   ![drawing](./media/cloud-partner-portal-create-dev-center-registration/imgRegisterCo_08.png)

Step 9. Enter your payment info to pay for your account. If you have a promo code that covers the cost of registration, you can enter that here. Otherwise, provide your credit card info (or PayPal in supported markets). When you are finished, click **Next** to move on to the **"Review screen"**.

  ![drawing](./media/cloud-partner-portal-create-dev-center-registration/imgRegisterCo_09.png)

Step 10. Review your account info and confirm that everything is correct. Then, read and accept the terms and conditions of the [Microsoft Azure Marketplace Publisher Agreement](http://go.microsoft.com/fwlink/?LinkID=699560). Check the box to indicate you have read and accepted these terms.

Step 11. Click **Finish** to confirm your registration. We'll send a confirmation message to your email address.

Step 12. If you are planning to publish only free offers, click **Go to to the [Cloud Partner Portal](https://cloudpartner.azure.com/).** and you can skip to section 3 of this document.

If you are planning to publish commercial offers (e.g. Virtual Machine offers with hourly billing model), click **Update your account information** where you must fill in the tax and banking information in your Developer Center account.

If you prefer to update your tax and bank information later, then you can move to the next section i.e. section 3 of this document.

> [!IMPORTANT]
> In case of commercial offers, you will not be able to push your offers to production without completing the tax and bank account information.
>
>

### Add tax and banking information
 If you want to publish commercial offers for purchase, you also need to add payout and tax information and submit it for validation in the Developer Center. If you will publish only free offers (or BYOL offers), then you do not need to add this information. You can add it later, but it takes some time to validate the tax information. If you know that you will offer commercial offers for purchase, we recommend that you add it as soon as possible.

**Bank Information**

1. Sign in to the [Microsoft Developer Center](http://dev.windows.com/registration?accountprogram=azure) with your Microsoft account.
2. Click **Payout account** in the left menu, under **Choose payment method** click **Bank account** or **PayPal**.

   > [!IMPORTANT]
   > If you have commercial offers that customers purchase in the Marketplace, this is the account where you will receive payout for those purchases.
   >
   >
3. Enter the payment info, and click **Save** when you are satisfied.

   > [!IMPORTANT]
   > If you need to update or change your payout account, follow the same steps above, replacing the current info with the new info. Changing your payout account can delay your payments by up to one payment cycle. This delay occurs because we need to verify the account change, just as we did when you first set up the payout account. You'll still get paid for the full amount after your account has been verified; any payments due for the current payment cycle will be added to the next one.
   >
   >
4. Click **Next**.

**Tax Information**

1. Sign in to the [Microsoft Developer Center](http://dev.windows.com/registration?accountprogram=azure) with your Microsoft account (if needed).
2. Click **Tax profile** in the left menu.
3. On the **Set up your tax form** page, select the country or region where you have permanent residency, and then select the country or region where you hold primary citizenship. Click **Next**.
4. Enter your tax details, and then click **Next**.

> [!WARNING]
> You will not be able to push to production your commercial offers without completing the tax and bank account information in your Microsoft Developer Center account.
>
>

If you have issues with Developer Center registration, please log a support ticket as below

1. Go to the support link [https://developer.microsoft.com/windows/support](https://developer.microsoft.com/windows/support)
2. Under **Contact Us** section, click on the button **Submit an incident** (as shown in the screen shot below)

  ![drawing](./media/cloud-partner-portal-create-dev-center-registration/imgAddTax_02.png)
3. Choose "Help with Dev Center" as **Problem type** and "Publish and manage apps" as **Category**. After that click on the button "Start email".

  ![drawing](./media/cloud-partner-portal-create-dev-center-registration/imgAddTax_03.png)
4. You will be provided with a login page. Use any Microsoft account sign in. If you do not have a Microsoft account then create one using this [link](https://signup.live.com/signup?uaid=0089f09ccae94043a0f07c2aaf928831&lic=1).
5. Fill in the details of the issue and subit the ticket by clicking on the **Submit** button.

  ![drawing](./media/cloud-partner-portal-create-dev-center-registration/imgAddTax_05.png)

## 3. Register your account in the cloud partner portal
The [Cloud Partner Portal](https://cloudpartner.azure.com/) is used to publish and manage your offer(s).

1. Open a new Chrome Incognito or Internet Explorer InPrivate browsing session to ensure that you’re not signed in to a personal account.
2. Go to [Cloud Partner Portal](https://cloudpartner.azure.com/).
3. If you are a new user and signing in to the [Cloud Partner Portal](https://cloudpartner.azure.com/) for the first time, then you must sign in with the same email id with which your Dev Center account is registered. In this way your Dev Center account and the cloud partner portal account will be linked with each other. You can later add the other members of the company, who are working on the application, as contributors or owners in the cloud partner portal by following the steps below.

If you are added as a contributor/owner in the cloud partner portal portal, then you can sign in with your own account.

> [!TIP]
> The participation policies are described on the [Azure website](https://azure.microsoft.com/support/legal/marketplace/participation-policies/).
>
>

## 4. Steps to manage users as owners or contributor in the cloud partner portal

[Steps to manage users on cloud partner portal](./cloud-partner-portal-manage-users.md)


## Next steps
Now that your account is created and registered, you can start the Azure marketplace publishing process.

[img-msalive]:media/cloud-partner-portal-create-dev-center-registration/creating-msa-account-msa-live.jpg
[img-email]:media/cloud-partner-portal-create-dev-center-registration/creating-msa-account-msa-verifyemail.jpg
[img-sd-url]:media/cloud-partner-portal-create-dev-center-registration/seller-dashboard-incognito.jpg
[img-signin]:media/cloud-partner-portal-create-dev-center-registration/seller-dashboard-login.jpg
[img-verify]:media/cloud-partner-portal-create-dev-center-registration/seller-dashboard-verify.jpg
[img-sd-top]:media/cloud-partner-portal-create-dev-center-registration/seller-dashboard-personal-acc-details.jpg
[img-sd-info]:media/cloud-partner-portal-create-dev-center-registration/seller-dashboard-personal.jpg

[img-sd-type]:media/cloud-partner-portal-create-dev-center-registration/seller-dashboard-personal-acc-type.jpg

[img-sd-mktg1]:media/cloud-partner-portal-create-dev-center-registration/seller-dashboard-personal-comp-det1.jpg
[img-sd-mktg2]:media/cloud-partner-portal-create-dev-center-registration/seller-dashboard-personal-comp-det2.jpg
[img-sd-addr]:media/cloud-partner-portal-create-dev-center-registration/seller-dashboard-personal-comp-add.jpg
[img-sd-legal]:media/cloud-partner-portal-create-dev-center-registration/seller-dashboard-personal-cmp.jpg
[img-sd-submit]:media/cloud-partner-portal-create-dev-center-registration/seller-dashboard-approval.jpg


[link-msdndoc]: https://msdn.microsoft.com/library/jj552460.aspx
[link-sellerdashboard]: http://sellerdashboard.microsoft.com/
[link-pubportal]: https://publish.windowsazure.com
[link-single-vm]:marketplace-publishing-vm-image-creation.md
[link-single-vm-prereq]:marketplace-publishing-vm-image-creation-prerequisites.md
[link-multi-vm]:marketplace-publishing-solution-template-creation.md
[link-multi-vm-prereq]:marketplace-publishing-solution-template-creation-prerequisites.md
[link-datasvc]:marketplace-publishing-data-service-creation.md
[link-datasvc-prereq]:marketplace-publishing-data-service-creation-prerequisites.md
[link-devsvc]:marketplace-publishing-dev-service-creation.md
[link-devsvc-prereq]:marketplace-publishing-dev-service-creation-prerequisites.md
[link-pushstaging]:marketplace-publishing-push-to-staging.md