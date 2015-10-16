<properties
   pageTitle="Creating and registering the publisher account | Microsoft Azure"
   description="Instructions for creating a Microsoft seller account so, upon approval, you can sell various offer types on the Azure Marketplace."
   services="Azure Marketplace"
   documentationCenter=""
   authors="HannibalSII"
   manager=""
   editor=""/>

<tags
   ms.service="marketplace-publishing"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="10/09/2015"
   ms.author="hascipio"/>

# Create a Microsoft seller account
This article walks you through the necessary account creation and registration process to become an approved Microsoft seller for the Azure Marketplace.

## 1. Create a Microsoft account
> [AZURE.WARNING] In order to complete the publishing process, you will need to create a Microsoft account. This account will be used to register for and to sign in to both the Publishing Portal and the Seller Dashboard. You should have only one Microsoft account for your Azure Marketplace offerings. It should not be specific to services or offers.

The address that forms the user name should be on your domain and controlled by your IT team (such as publishing@*yourcompany*.com). Payment, tax information, and reporting will be routed through this account.

  > [AZURE.WARNING] Words like "Azure" and "Microsoft" are not supported for Microsoft account registration. Avoid using these words to complete the account creation and registration process.

1. Create a distribution list (DL) or security group (SG) within your company's domain.
  - Add your onboarding team to the DL.
  - The DL must be live to receive a confirmation email.
  - Use marketplace@*yourcompany*.com as the email address for the DL.
  - This needs to be completed in your internal systems.
2. Open a new Chrome Incognito or Internet Explorer InPrivate browsing session to ensure that you’re not signed in to an existing account.
3. Register for a Microsoft account by using the DL email.
 - You can register for a Microsoft account at [https://signup.live.com/signup.aspx](https://signup.live.com/signup.aspx).
 - Use marketplace@*yourcompany*.com as the email address.
 - Your Microsoft account ID is now marketplace@*yourcompany*.com.

    ![drawing][img-msalive]

4. When registering, use a valid phone number. The system will send a verification code as a text message or an automated call if identity verification is required.
5. Verify the email address sent to the DL.

    ![drawing][img-email]

6. You’re now ready to use the new Microsoft account in the Seller Dashboard.

> [AZURE.IMPORTANT] Using the DL allows multiple people to receive email notifications that are important for reporting of payout information. It also ensures that ownership of the Microsoft account can be transferred and isn’t tied to a single individual.

## 2. Create your Seller Dashboard account
The Microsoft Seller Dashboard is used to register the company information once. The registrant must be a valid representative of the company, and must provide their personal information as a way to validate their identity. The person registering must use a Microsoft account that is shared for the company, and the same account must be used in the Azure Publishing Portal. You should check to make sure your company does not already have a Seller Dashboard account before you attempt to create one. During the process, we will collect bank account information, tax information, and company address information. These are typically obtainable from finance or business contacts.

> [AZURE.IMPORTANT] You must complete the following seller profile components in order to progress through the various phases of offer creation and deployment.


| Seller profile | To start draft | Staging | Publish free and solution template | Publish commercial |
|----|----|----|----|----|
|Company registration | Must have | Must have | Must have | Must have |
|Tax profile ID | Optional | Optional | Optional | Must have |
|Bank account | Optional | Optional | Optional | Must have |


> [AZURE.NOTE] Bring Your Own License (BYOL) is supported only for virtual machines and is considered a **free** offering.


### Register your company account
1. Open a new  Internet Explorer InPrivate or Chrome Incognito browsing session to ensure that you’re not signed in to a personal account.

2. Go to [http://sellerdashboard.microsoft.com](http://sellerdashboard.microsoft.com).

    ![drawing][img-sd-url]

3. Sign in with your company registration Microsoft account (e.g., marketplace@*yourcompany*.com).

    ![drawing][img-signin]

4. Complete the "Help us protect your account" wizard, which will verify your identity via phone number or email address.

    ![drawing][img-verify]

5. Go to **Account Details**. On this screen, you will enter your personal information, which is used only for identity verification. That means your name, email address, residential address, and personal phone number. This information is not shared with anyone outside of Microsoft.

    ![drawing][img-sd-top]

    ![drawing][img-sd-info]

6. Register on behalf of your company by designating your account type as **Company**, not **Individual**. Click **Next**.

    ![drawing][img-sd-type]

7. Fill in the company details. This needs to be accurate information--headquarters and reference will be checked by a team at Microsoft.

    ![drawing][img-sd-mktg1]

8. The company name in the details below is used by the Publishing Portal, so it should be accurate.

    ![drawing][img-sd-mktg2]

9. Use the address of your company headquarters.

    ![drawing][img-sd-addr]

10. Use a reference that will be accessible and recognizable as a company representative.

    ![drawing][img-sd-legal]

11. Click **Submit for Approval** and you are done.

    ![drawing][img-sd-submit]


If you are planning to publish only free offers, then you can skip to section 3, "Register your account in the Publishing Portal".

If you are planning to publish commercial offers, you must complete tax and banking information in your Seller Dashboard account.

> [AZURE.IMPORTANT] You will not be able to properly test your offers in staging and will not be able to push your offers to production without completing the tax and bank account information.

If you prefer to update your tax and bank information later, you can go to section 3, "Register your account in the Publishing Portal", and come back later by using links in the Publishing Portal.

### Add tax and banking information
 If you want to publish commercial offers for purchase, you also need to add payout and tax information and submit it for validation in the Seller Dashboard. If you will publish only free offers (or BYOL offers), then you do not need to add this information. You can add it later, but it takes some time to validate the tax information. If you know that you will offer commercial offers for purchase, we recommend that you add it as soon as possible.

1. Sign in to the [Seller Dashboard](http://sellerdashboard.microsoft.com) with your Microsoft account.

2. Click the **ACCOUNT** tab, and then click **payout & tax**.

3. Click **ADD PAYOUT AND TAX INFO**.

4. On the **Choose a payment method** page, under **New payment method**, click **Bank account** or **PayPal**.

> [AZURE.IMPORTANT] If you have commercial offers that customers purchase in the Marketplace, this is the account where you will receive payout for those purchases.

5. Enter details for a bank account or a PayPal account.

6. Click **NEXT**.

7. On the **Tax Information** page, select the country or region where you have permanent residency, and then select the country or region where you hold primary citizenship. Click **NEXT**.

8. Enter your tax details, and then click **NEXT**.

9. Click **Submit**.
  If you are not ready to submit your tax information for validation yet, you can click **Save** or **Save and Exit**. It takes some time to validate the tax information, so we recommend that you submit it for validation as soon as possible.

> [AZURE.WARNING] You will not be able to push to production your commercial offers without completing the tax and bank account information in your Seller Dashboard account.

## 3. Register your account in the Publishing Portal
The Azure Publishing Portal is used to publish and manage your offer(s). You will find some useful information in the Publishing Portal that will guide you through your offer creation process.

> [AZURE.WARNING] The same company Microsoft account that was used in the Seller Dashboard registration must be used here. Additional users can be added to assist once the master publisher account has been created.

1.	Open a new Chrome Incognito or Internet Explorer InPrivate browsing session to ensure that you’re not signed in to a personal account.
2.	Go to [http://publish.windowsazure.com](http://publish.windowsazure.com).
3.	 Sign in with your company registration Microsoft account (i.e., marketplace@*yourcompany*.com), and you can add co-admins as necessary.
4.	Read and accept the terms of the publisher agreement (first time signing in to the Publishing Portal), and you are done here.

  > [AZURE.TIP] The participation policies are described on the [Azure website](http://azure.microsoft.com/support/legal/marketplace/participation-policies/).

  > If you have issues with Seller Registration completion, please log a support ticket as below:
  1. Contact [Support](http://go.microsoft.com/fwlink?LinkId=272975).
  2. Choose **Seller Dashboard registration and your account**.
  3. Choose **Registering for a developer account**.
  4. Choose a contact method.

### "Sell-from" countries

> [AZURE.WARNING]
In order to sell your services on the Azure Marketplace, your registered entity needs to be from one of the approved “sell-from” countries. This restriction is for payout and taxation reasons. We are actively looking to expand this list of countries in the near future, so stay tuned. For the complete list, see section 1b of the  [Marketplace participation policies](http://go.microsoft.com/fwlink/?LinkID=526833).




## Next steps
Now that your account is created and registered, click the type of artifact (virtual machine, developer service, data service, or solution template) that you would like to publish to the Azure Marketplace. Visit one of the following articles to learn how to publish your respective offer:

|| Virtual machine image | Developer service | Data service | Solution template |
|----|-----|-----|-----|-----|
|**Step 2: Create your offer** |[General non-technical prerequisites](marketplace-publishing-pre-requisites.md)| [General non-technical prerequisites](marketplace-publishing-pre-requisites.md)| [General non-technical prerequisites](marketplace-publishing-pre-requisites.md)| [General non-technical prerequisites](marketplace-publishing-pre-requisites.md)|
|| [VM image technical prerequisites][link-single-vm-prereq] | Developer service technical prerequisites | Data service technical prerequisites  | [Solution template technical prerequisites](marketplace-publishing-solution-template-creation-prerequisites.md) |
|| [VM image publishing guide][link-single-vm] | Developer service publishing guide | Data service publishing guide | [Solution template publishing guide](marketplace-publishing-solution-template-creation.md) |
|| [Azure Marketplace marketing content guide][link-pushstaging] | [Azure Marketplace marketing content guide][link-pushstaging] | [Azure Marketplace marketing content guide][link-pushstaging] | [Azure Marketplace marketing content guide][link-pushstaging] |

## See also
- [Getting started: How to publish an offer to the Azure Marketplace](marketplace-publishing-getting-started.md)

[img-msalive]:media/marketplace-publishing-accounts-creation-registration/creating-msa-account-msa-live.jpg
[img-email]:media/marketplace-publishing-accounts-creation-registration/creating-msa-account-msa-verifyemail.jpg
[img-sd-url]:media/marketplace-publishing-accounts-creation-registration/seller-dashboard-incognito.jpg
[img-signin]:media/marketplace-publishing-accounts-creation-registration/seller-dashboard-login.jpg
[img-verify]:media/marketplace-publishing-accounts-creation-registration/seller-dashboard-verify.jpg
[img-sd-top]:media/marketplace-publishing-accounts-creation-registration/seller-dashboard-personal-acc-details.jpg
[img-sd-info]:media/marketplace-publishing-accounts-creation-registration/seller-dashboard-personal.jpg
[img-sd-type]:media/marketplace-publishing-accounts-creation-registration/seller-dashboard-personal-acc-type.jpg
[img-sd-mktg1]:media/marketplace-publishing-accounts-creation-registration/seller-dashboard-personal-comp-det1.jpg
[img-sd-mktg2]:media/marketplace-publishing-accounts-creation-registration/seller-dashboard-personal-comp-det2.jpg
[img-sd-addr]:media/marketplace-publishing-accounts-creation-registration/seller-dashboard-personal-comp-add.jpg
[img-sd-legal]:media/marketplace-publishing-accounts-creation-registration/seller-dashboard-personal-cmp.jpg
[img-sd-submit]:media/marketplace-publishing-accounts-creation-registration/seller-dashboard-approval.jpg

[link-msdndoc]: https://msdn.microsoft.com/en-us/library/jj552460.aspx
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
