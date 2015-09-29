<properties
   pageTitle="Pre-requisites for creating a virtual machine image for the Azure Marketplace | Microsoft Azure"
   description="Understand the requirements for creating and deploying a virtual machine image to the Azure Marketplace for others to purchase."
   services="marketplace-publishing"
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
  ms.author="hascipio; v-divte"/>

# Pre-requisites for creating a virtual machine image for the Azure Marketplace

Read the process thoroughly before beginning and understand where and why each step is performed. You should prepare as much of your company information and other data as possible before beginning the process. This should be clear from reviewing the process itself.  

## Get Approved via Microsoft Azure Certification Program
> [AZURE.WARNING] You must be approved via the Azure Certification program to start the virtual machine image creation and publishing process. For a detailed overview of the Microsoft Azure Certification program and its benefits, visit http://azure.com/certified

The first step on the path to getting your application or service certified and onboarded to Azure Marketplace is to fill out the application form on the Microsoft Azure Certified web page.
If you meet the basic eligibility criteria we will ask you to share some more details about your business and the application or service that you want to certify. When we have all the details from you we will review your application to ensure is it’s a good fit for Azure Marketplace and if your application is approved we will start working with you to onboard your solution to Azure Marketplace.
Take these steps to get started:
-	Visit the Microsoft Azure Certified web page: https://azure.microsoft.com/en-us/marketplace/partner-program/ to learn more about the program

-	If you are working with a Partner Account Manager or a DX Partner Manager please request them to nominate you for the Azure Certification program. Or go to the Microsoft Azure Certified web page, click on **Request Information** and fill in the application form.

## Download needed tools & applications
You should have the following items ready before beginning the process:
- Depending on which operating system you are targeting, install the Azure PowerShell cmdlets or Linux command line interface tool from the Azure Downloads Page.
- Install Azure Storage Explorer from CodePlex.
- Download and install “Certification Test Tool for Azure Certified”:
  - http://go.microsoft.com/fwlink/?LinkID=526913. You will need a Windows-based computer to run the certification tool. If you do not have a Windows-based computer available, you can run the tool using a Windows-based VM in Azure.


## Ensure you are registered as a seller with Microsoft
For detailed instructions on registering a seller account with Microsoft, go to [Account Creation & Registration](marketplace-publishing-accounts-creation-registration.md).
- If you are already registered, find out who in your company owns it or which credentials were used to register
- If you are not the owner of the publishing account, you can have the account owner add your Microsoft Account as a co-admin to the Publishing portal -> Publishers -> Administrators
- Ensure that stakeholders in the Azure publishing process receive the email that goes to this address. It must be monitored and responded to in order to complete the publishing process.
- Avoid having the account associated with a single person. If that person leaves your company, they could impact your ability to access information about and publish your SKUs.

<!--
For instructions on creating and submitting a Microsoft seller profile, visit [Microsoft Seller Account Creation & Registration][link-acct-creation].
-->
<!--
If you are not registered, you will need to collect the Company Tax and Payout Information (banking information) and then register your company as a seller in the [Seller Dashboard](https://sellerdashboard.microsoft.com).

A company can register only once as seller with Microsoft.
- If you don't know the seller registration stats of your company, please contact us through your Sharepoint site ('Need help?' section) or you can email us at AzureMarketOnboard@microsoft.com
- If you are already registered, find out who in your company owns it? Alternatively, which credentials were used to register? This information can be obtained form your Finance or Marketing Team
-->

> [AZURE.IMPORTANT] You do not have to complete company tax and banking information if you are planning to publish only free offers (or bring your own license).



> [AZURE.TIP] The company registration must be completed to get started. However, while your company works on the tax and bank information in the Seller Dashboard account, the developers can start working on creating the virtual machine image in the [Publishing Portal](https:publishl.windowsazure.com), getting them certified and testing them in Azure Staging Environment. You will need the complete seller account approval only for the final step of publishing your offer to the Marketplace.

> [AZURE.TIP] If you have issues with Seller Registration completion, please log a Support ticket as below:
1. Contact [Support](http://go.microsoft.com/fwlink?LinkId=272975)
2. Choose **Seller Dashboard registration and your account**
3. Choose **Registering for a developer account**
4. Choose contact **method**

## Acquire an Azure "pay-as-you-go" Subscription

This is the subscription you will use to create your VM images and hand over the images to [Azure Marketplace](http://azure.microsoft.com/marketplace). If you do not have an existing subscription, then please sign up here, https://account.windowsazure.com/signup?offer=ms-azr-0003p

## Platforms supported
You can develop Azure-based VMs on Windows or Linux. Some elements of the publishing process—such as creating an Azure-compatible VHD—use different tools and steps depending on which operating system you are using.  
- If you are using Linux, refer to “Create an Azure-compatible VHD (Linux-based)” section of the [Virtual Machine Image Publishing Guide](marketplace-publishing-vm-image-creation.md).
- If you are using Windows, refer to “Create an Azure-compatible VHD (Windowsbased)” section of the [Virtual Machine Image Publishing Guide](marketplace-publishing-vm-image-creation.md).

## Developing your VHD
It is possible to develop Azure VHDs in the **cloud** or **on-premises**.
- Cloud-based development means all development steps are performed remotely on a VHD resident on Azure.
- On-premises development requires downloading a VHD and developing it using on-premises infrastructure. While this is possible, we do not recommend it. Note that developing for Windows or SQL on premises requires you to have the relevant on-premises license keys. You cannot include or install SQL Server after creating a VM, and you must base your offer on an approved SQL Image from the Azure Portal. If you decide to develop on-premises, you must perform some steps differently than if you were developing in the cloud. You can find relevant information in Appendix 2.

## "Sell-from" countries
> [AZURE.WARNING]
In order to sell your services on Microsoft Azure Marketplace, your registered entity needs to be from one of the approved “sell from” countries. This restriction is for payout and taxation reasons. We are actively looking to expand this list of countries in the near future, so please stay tuned. For the complete list, please see section 1b of the document at link http://go.microsoft.com/fwlink/?LinkID=526833&clcid=0x409.
<!-- Anchor to "Sell-from" countries section -->

## Next Steps
Now that you reviewed the pre-requisites and completed the necessary task, you can move forward with the creating your Virtual Machine Image offer as detailed in the [Virtual Machine Image Publishing Guide](marketplace-publishing-vm-image-creation.md)

[link-acct-creation]:marketplace-publishing-accounts-creation-registration.md
