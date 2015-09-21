<properties
   pageTitle="Pre-requisites for Publishing Virtual Machine Images"
   description="Virtual Machine Image pre-requisites"
   services="marketplace-publishing"
   documentationCenter=""
   authors="HannibalSII"
   manager=""
   editor=""/>

<tags
   ms.service="required"
   ms.devlang="may be required"
   ms.topic="article"
   ms.tgt_pltfrm="may be required"
   ms.workload="na"
   ms.date="09/20/2015"
   ms.author="hascipio" />

# Virtual Machine Images Publishing Guide - Pre-requisites

## Accounts use in the process

In order to complete this process, you will need two accounts:
- Microsoft publishing account for your company
- Personal account for the person representing the business.
- An Azure Pay-As-You-Go subscription to pay for bandwidth and storage during the development process.

### Microsoft publishing account
Create an email address on your domain such as *marketplacepublish@yourcompany.com*. Use it when you register at the Seller Dashboard, and when you log in to the Azure Publishing Portal. This address represents your company as a seller on the Azure Marketplace.

- If you are already registered, find out who in your company owns it or which credentials were used to register
- If you are not the owner of the publishing account, you can have the account owner add your Microsoft Account as a co-admin to the Publishing portal -> Publishers -> Administrators
- Ensure that stakeholders in the Azure publishing process receive the email that goes to this address. It must be monitored and responded to in order to complete the publishing process.
- Avoid having the account associated with a single person. If that person leaves your company, they could impact your ability to access information about and publish your SKUs.

### Personal Account
- This information is only used to verify that the person registering the company is a real person and a valid representative of the company. This takes place in step 2.3 Create Your Seller Dashboard Account.
- The person performing that step needs to provide their personal email address, phone number, and other information—NOT that of the company they represent. This information is only used for verification purposes and is not shared with anybody outside of Microsoft.
- Part of the review process may involve a phone contact from our identity verification team, so the person responsible for this step must provide a valid phone number. We may also ask to speak with representatives of the company who can confirm that the individual is authorized to act on behalf of the organization.  

## Acquire an Azure "pay-as-you-go" Subscription

This is the subscription you will use to create your VM images and hand over the images to [Azure Marketplace](http://azure.microsoft.com/marketplace). If you do not have an existing subscription, then please sign up here, https://account.windowsazure.com/signup?offer=ms-azr-0003p

## Platforms supported
You can develop Azure-based VMs on Windows or Linux. Some elements of the publishing process—such as creating an Azure-compatible VHD—use different tools and steps depending on which operating system you are using.  
- If you are using Linux, refer to “Create an Azure-compatible VHD (Linux-based)” section of the [Virtual Machine Image Publishing Guide](marketplace-publishing-vm-image-publication.md).
- If you are using Windows, refer to “Create an Azure-compatible VHD (Windowsbased)” section of the [Virtual Machine Image Publishing Guide](marketplace-publishing-vm-image-publication.md).

## Developing your VHD
It is possible to develop Azure VHDs in the **cloud** or **on-premises**.
- Cloud-based development means all development steps are performed remotely on a VHD resident on Azure.
- On-premises development requires downloading a VHD and developing it using on-premises infrastructure. While this is possible, we do not recommend it. Note that developing for Windows or SQL on premises requires you to have the relevant on-premises license keys. You cannot include or install SQL Server after creating a VM, and you must base your offer on an approved SQL Image from the Azure Portal. If you decide to develop on-premises, you must perform some steps differently than if you were developing in the cloud. You can find relevant information in Appendix 2.

## "Sell-from" countries of the offer
In order to sell your services on Microsoft Azure Marketplace (DataMarket), your registered entity needs to be from one of the approved “sell from” countries. This restriction is for payout and taxation reasons. We are actively looking to expand this list of countries in the near future, so please stay tuned. For the complete list, please see section 1b of the document at link http://go.microsoft.com/fwlink/?LinkID=526833&clcid=0x409.


## Ensure you are registered as a seller with Microsoft
A company can register only once as seller with Microsoft.
- If you don't know the seller registration stats of your company, please contact us through your Sharepoint site ('Need help?' section) or you can email us at AzureMarketOnboard@microsoft.com
- If you are already registered, find out who in your company owns it? Alternatively, which credentials were used to register? This information can be obtained form your Finance or Marketing Team

If you are not registered, you will need to collect the Company Tax and Payout Information (banking information) and then register your company as a seller in the [Seller Dashboard](https://sellerdashboard.microsoft.com).

> **Note:** You do not have to create a seller dashboard account if you are planning to publish only free offers (or worldwide, or bring-your-own-licence).

For instructions on creating and submitting a Microsoft seller profile, visit [Microsoft Seller Account Creation & Registration][link-acct-creation]. And for more details on how to edit approved Seller Profile and filling out Tax and Payout information, refer to Seller Dashboard Help http://msdn.microsoft.com/en-us/library/dn800952.aspx

> **Note:** While you company works on the Seller Profile, the developers can start working on creating the Solution Template Topologies in the [Publishing Portal](https:publishl.windowsazure.com), getting them certified and testing them in Azure Staging Environment. You will need seller approval only for the final step of publishing your offer to Marketplace.

> **Note:** If you have issues with Seller Registration completion, please log a Support ticket as below:
1. Contact [Support](http://go.microsoft.com/fwlink?LinkId=272975)
2. Choose "Seller Dashboard registration and your account"
3. Choose "Registering for a developer account"
4. Choose contact method
