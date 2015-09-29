<properties
   pageTitle="Creating and Registering Publisher Account Process | Microsoft Azure"
   description="Instructions for creating a Microsoft Seller account so, upon approval, one can sell various offer types on the Azure Marketplace."
   services="Azure Marketplace"
   documentationCenter=""
   authors="HannibalSII"
   manager=""
   editor=""/>

<tags
   ms.service="AzureStore"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="Azure"
   ms.workload="na"
   ms.date="09/29/2015"
   ms.author="hascipio"/>

# Registering a Microsoft seller account
## 1. Create a Microsoft Account (MSA)
> [AZURE.WARNING] In order to complete the publishing process, you will need to create a Microsoft account. This account will be used to register for and to log in to both the Publishing Portal and the Seller Dashboard. You should only have one Microsoft Account for your Azure Marketplace offerings. They should not be specific to individual VMs.

The address that forms the user name should be on your domain and controlled by your IT team (such as azurepublishing@yourcompany.com). Payment, tax information, and reporting will be routed through this account.

1. Create a Distribution List (DL) or Security Group (SG) within your company's domain.
  - Add your onboarding team to the DL
  - DL must be live to receive confirmation email
  - This needs to be completed in your internal systems.For e.g. AzureStore@yourcompany.com
2. Open a new Chrome Incognito or IE InPrivate browsing session to ensure that you’re not logged into an existing account
3. Register for your a Microsoft Account (MSA) using the Distribution List Email.
 - You can register for a MSA at https://signup.live.com/signup.aspx
 - Use AzureStore@yourcompany.com as the email address
 - Your MSA ID is now AzureStore@yourcompany.com

    ![drawing][img-msalive]

4. When registering, use a valid phone number. The system will send a verification code as a text message or an automated call if identify verification is required.
5. Verify the email address sent to the DL

  ![drawing][img-email]

6. You’re now ready to use the new MSA in the Seller Dashboard.
> [AZURE.IMPORTANT] Using the DL allows multiple people to receive email notifications that are important reporting of payout information, and also insures that ownership of the MSA can be transferred and isn’t tied to a single individual.

## 2. Create your Seller Dashboard account
The Microsoft Seller Dashboard is used to register the company information once. The registrant must be a valid representative of the company, and must provide their personal information as a way to validate their identity. The person registering must use a Microsoft account (MSA) that is shared for the company, and the same account must be used in the Azure Publishing Portal. You should check to make sure your company does not already have a Seller Dashboard account before attempting to create one. During the process, we will collect bank account information, tax information, and company address information. These are typically obtainable from finance or business contacts. For complete instructions on how to create a Seller Dashboard account, see [Create Your Account and Add Payout Information in the Microsoft][link-msdndoc].

1. Open a new  IE InPrivate or Chrome Incognito browsing session to ensure that you’re not logged into a personal account

2. Go to http://sellerdashboard.microsoft.com

  ![drawing][img-sd-url]

3. Sign in with your company registration Microsoft Account (MSA) (i.e. AzureStore@yourcompany.com)

  ![drawing][img-signin]

4. Complete the "Help us protect your account" wizard, which will verify your identity via phone number or email address.

  ![drawing][img-verify]

5. Go to Account Details. On this screen, you will enter your PERSONAL information, which is only used for identity verification. That means your name, email address, residential address, and personal phone number. This information is not shared with anyone outside of Microsoft.

  ![drawing][img-sd-top]

  ![drawing][img-sd-info]

6. Register on behalf of your company by designating your account type as Company, NOT Individual. Click Next.

  ![drawing][img-sd-type]

7. Fill in the Company details. This needs to be accurate information – headquarters, reference, will all be checked by a team at Microsoft.

  ![drawing][img-sd-mktg1]

8. Company name in below details is used by publisher portal hence should be accurate

      ![drawing][img-sd-mktg2]
9. Use the address of your company head quarters

      ![drawing][img-sd-addr]
10. Use reference that will be accessible & recognizable as a company representative

      ![drawing][img-sd-legal]
11. Click Submit for Approval and you are done.

      ![drawing][img-sd-submit]

<!--
8. You must provide payout and tax information and submit it for validation. In order to add payout and tax information, go to Account > Payout & Tax and click Add. Enter your company's information. You will be required to provide a Tax Identification Number and other tax information matching the country in which your business is headquartered.
-->
Once you register your company, you can continue working in parallel while the verification of your registration is completed by the Seller Dashboard team. You can monitor the status of your approvals via the [Azure Publishing Portal][link-pubportal].

## 3. Register your account in the Publishing Portal
The Azure Publishing Portal is used to publish and manage your offer(s). Think of it as the CMS for your offerings/artifacts. All remaining work is completed here.

> [AZURE.WARNING] The same company Microsoft Account that was used in the Seller Dashboard registration MUST be used here. Additional users can be added to assist once the master publisher account has been created.

1.	Open a new Chrome Incognito or IE InPrivate browsing session to ensure that you’re not logged into a personal account
2.	Go to http://publish.windowsazure.com
3.	 Sign in with your company registration Microsoft Account (MSA) (i.e. AzureStore@yourcompany.com) and you can add co-admins as necessary.
4.	Read & accept the terms of the Publisher Agreement (first time logging into Publishing Portal) and you are done here.
  > [AZURE.IMPORTANT] The participation policies are mentioned [here](http://azure.microsoft.com/support/legal/marketplace/participation-policies/).

  > [AZURE.TIP] The Publisher Portal is how you will manage the details of your Add-on, including marketing copy, pricing and endpoints for your Resource Provider. Read the Publisher Portal Guide to get started. This step can be done in parallel with Steps 1, 3 and 4.

| Seller Profile | To start draft | Staging | Publish Free | Publish Commercial |
|---|--|--|--|--|
|Company Registration | Must Have | Must Have | Must Have | Must Have |
|Tax Profile ID | Optional | Optional | Optional | Must Have |
|Bank Account | Optional | Optional | Optional | Must Have |

## "Sell-from" countries of the offer
In order to sell your services on Microsoft Azure Marketplace, your registered entity needs to be from one of the approved “sell from” countries. This restriction is for payout and taxation reasons. We are actively looking to expand this list of countries in the near future, so please stay tuned. For the complete list, please see section 1b of the document at link http://go.microsoft.com/fwlink/?LinkID=526833&clcid=0x409.

## Next Steps
Now that your account is created and registered, click on the type of artifact (virtual machine, developer service, data service, solution template) that you would like to publish to the Azure Marketplace. Visit one of the following articles to learn how to publish your respective offer:

| Virtual Machine Image | Developer Service | Data Service | Solution Template |
|----|---|----|----|
|[VM Image Publishing Guide Pre-requisites][link-single-vm-prereq] | [Developer Service Publishing Pre-requisites][link-devsvc-prereq] | Data Service Publishing Pre-requisites  | [Solution Template Publishing Pre-requisites][link-multi-vm-prereq] |
| [VM Image Publishing Guide][link-single-vm] | [Developer Service Publishing Guide][link-devsvc] | Data Service Publishing Guide | [Solution Template Publishing Guide][link-multi-vm] |

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
[link-single-vm]:marketplace-publishing-virtual-machine-creation.md
[link-single-vm-prereq]:marketplace-publishing-vm-image-creation-prerequisites.md
[link-multi-vm]:marketplace-publishing-solution-template-creation.md
[link-multi-vm-prereq]:marketplace-publishing-solution-template-creation-prerequisites.md
[link-datasvc]:marketplace-publishing-data-service-creation.md
[link-datasvc-prereq]:marketplace-publishing-data-service-creation-prerequisites.md
[link-devsvc]:marketplace-publishing-dev-service-creation.md
[link-devsvc-prereq]:marketplace-publishing-dev-service-creation-prerequisites.md
