<properties
   pageTitle="Page title that displays in the browser tab and search results"
   description="Article description that will be displayed on landing pages and in most search results"
   services="service-name"
   documentationCenter="dev-center-name"
   authors="GitHub-alias-of-only-one-author"
   manager="manager-alias"
   editor=""/>

<tags
   ms.service="required"
   ms.devlang="may be required"
   ms.topic="article"
   ms.tgt_pltfrm="may be required"
   ms.workload="required"
   ms.date="mm/dd/yyyy"
   ms.author="Your MSFT alias or your full email address;semicolon separates two or more"/>

# Publisher Account Creation & Registration Process
## Create a Microsoft Account
> Important: In order to complete the publishing process, you will need to create a Microsoft account. This account will be used to register for and to log in to both the Publishing Portal and the Seller Dashboard. You should only have one Microsoft Account for your Azure Marketplace offerings. They should not be specific to individual VMs.

The address that forms the user name should be on your domain and controlled by your IT team (such as azurepublishing@yourcompany.com). Payment, tax information, and reporting will be routed through this account.

1. Within your own domain, create a Distribution List (DL) or Security Group (SG) with an email address such as azurepublishing@yourcompany.com.
2. Add your Azure VM publishing team to the DL. The DL must be live to receive the confirmation email necessary to create your account.
3. Register for your a Microsoft Account using Distribution List Email using the DL email. You can register for a Microsoft Account at https://signup.live.com/signup.aspx
4. When registering, use a valid phone number. The system will send a verification code as a text message or an automated call if identify verification is required.
5. Respond to the verification email sent to the Azure VM publishing DL.

## Create your Seller Dashboard account
The Microsoft Seller Dashboard is used to register the company information once. The registrant must be a valid representative of the company, and must provide their personal information as a way to validate their identity. The person registering must use a Microsoft account (MSA) that is shared for the company, and the same account must be used in the Azure Publishing Portal. You should check to make sure your company does not already have a Seller Dashboard account before attempting to create one. During the process, we will collect bank account information, tax information, and company address information. These are typically obtainable from finance or business contacts. For complete instructions on how to create a Seller Dashboard account, see [Create Your Account and Add Payout Information in the Microsoft][link-msdndoc].

1. Go to the [Seller Dashboard][link-sellerdashboard]
2. Complete the "Help us protect your account" wizard, which will verify your identity via phone number or email address.
3. Go to Account Details. On this screen, you will enter your PERSONAL information, which is only used for identity verification. That means your name, email address, residential address, and personal phone number. This information is not shared with anyone outside of Microsoft.
4. Designate your account type as Company, NOT Individual. Click Next.
5. Fill out the Company details. This is the marketing profile for your company. When it is complete, click Submit for approval.
6. You must provide payout and tax information and submit it for validation. In order to add payout and tax information, go to Account > Payout & Tax and click Add. Enter your company's information. You will be required to provide a Tax Identification Number and other tax information matching the country in which your business is headquartered.

Once you register your company, you can continue working in parallel while the verification of your registration is completed by the Seller Dashboard team. You can monitor the status of your approvals via the [Azure Publishing Portal][link-pubportal].

## Register your account in the Publishing Portal
The Azure Publishing Portal is used to publish and manage your offer(s). Think of it as the CMS for your offerings/artifacts. All remaining work is completed here.

> Important: The same company Microsoft Account that was used in the Seller Dashboard registration MUST be used here. Additional users can be added to assist once the master publisher account has been created.

1. Go to the [Azure Publishing Portal][link-pubportal].
2. Read and agree to the terms of the publishing portal.
3. Click on the type of artifact (virtual machine, developer service, data service, solution template) that you would like to publish to the Azure Marketplace.

## Next Steps
Now that your accounts are created and registered, visit one of the following articles to learn how to publish your respective offer:
 - [Publish a virtual machine][0]
 - [Publish a developer service][0]
 - [Publish a data service][0]
 - [Publish a solution template][0]

[0]: http://.
[link-msdndoc]: https://msdn.microsoft.com/en-us/library/jj552460.aspx
[link-sellerdashboard]: http://sellerdashboard.microsoft.com/
[link-pubportal]: https://publish.windowsazure.com
