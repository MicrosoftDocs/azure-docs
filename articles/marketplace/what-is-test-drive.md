---
title: What is a test drive? Microsoft commercial marketplace
description: Explanation of Marketplace test drive feature
author: dsindona
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
ms.date: 06/19/2020
ms.author: dsindona
---

# What is a test drive?

A test drive is a great way to showcase your offer to potential customers by giving them the option to "try before you buy", resulting in increased conversion and generation of highly qualified leads. A test drive lets you bring your product to life while generating highly qualified leads.

## The customer experience

After providing their contact information, customers can access your pre-built test drive experience: a hands-on, self-guided trial of your product's key features and benefits being demonstrated in a real-world implementation scenario.

A potential customer discovers your application on the commercial marketplace. After they sign in and agree to your Terms and Conditions and Privacy Policy, they receive your pre-configured environment to try for a fixed period of time while you receive a highly qualified lead.
<!--
![Commercial marketplace offer sign-in screen](media/test-drive/sign-in-azure.png)

The customer agrees to your Terms and Conditions and Privacy Policy:

![Step three. Marketplace Offer publisher agreement screen](media/test-drive/terms-agreement.png) -->

## How does it work?

The test drive service continuously supports and serves your customers without requiring any manual effort from you. As a publisher, you manage and configure the test drive settings within Partner Center.

After setting up your test drive, it becomes a managed instance that will be deployed on-demand for the customer requesting it. Once a test drive instance is assigned, it is available for use for a set amount of time, then deleted to create room for another customer.

## Types of test drives

No matter how complex your application, there's a Microsoft test drive for your product. There are different types of test drives based on the type of product, scenario, and marketplace you are on.

### Azure Resource Manager

This deployment template contains all the Azure resources that comprise your solution. Products that fit this scenario use only Azure resources.

### Dynamics 365 logic app

This deployment template encompasses all complex solution architectures. All Dynamics applications or custom products should use this type of test drive. If you have an offer on AppSource, build your test drive to connect with a Dynamics AX/CRM instance or any other resource beyond just Azure. Microsoft hosts and maintains the test drive service (including provisioning and deployment).

- Use [Dynamics 365 for Business Central](https://docs.microsoft.com/azure/marketplace/partner-center-portal/create-new-operations-offer) for a Business Central enterprise resource planning system such as finance, operations, supply chain, and CRM.
- Use [Dynamics 365 for Customer Engagement](https://docs.microsoft.com/azure/marketplace/partner-center-portal/create-new-customer-engagement-offer) for a Customer Engagement system such as sales, service, project service, and field service.
- Use [Dynamics 365 for Operations](https://docs.microsoft.com/azure/marketplace/partner-center-portal/create-new-operations-offer) for a Finance and Operations enterprise resource planning system such as finance, operations, and manufacturing, supply chain.

Detailed documentation for logic app test drives is at
[Operations](https://github.com/Microsoft/AppSource/blob/master/Setup-your-Azure-subscription-for-Dynamics365-Operations-Test-Drives.md) and [Customer engagement](https://github.com/Microsoft/AppSource/wiki/Setting-up-Test-Drives-for-Dynamics-365-app).

### Power BI

This is simply an embedded link to a custom-built dashboard. Any product that only demonstrates an interactive Power BI visual should use this type of test drive. All you need to upload here is your embedded Power BI URL.

For more information on Power BI, see [What are Power BI apps?](https://docs.microsoft.com/power-bi/service-template-apps-overview)

### Hosted test drive

A hosted test drive removes the complexity of setup by letting Microsoft host and maintain the service that performs the test drive user provisioning and de-provisioning. Use this type for AppSource offers to connect with a Dynamics 365 for Customer Engagement, Dynamics 365 for Finance and Operations, or Dynamics 365 Business Central instance.

## Transforming examples

The process of turning an architecture of resources into a test drive can be daunting. Check out these examples of how to best transform current architectures.

[Transform a website template into a test drive](https://github.com/Azure/AzureTestDrive/wiki/Transforming-Website-Deployment-Template-for-Test-Drive)

[Transform a virtual machine template into a test drive](https://github.com/Azure/AzureTestDrive/wiki/Transforming-Virtual-Machine-Deployment-Template-for-Test-Drive)

[Transform an existing Resource Manager template into a test drive](https://github.com/Azure/AzureTestDrive/wiki/Deploying-Existing-Solutions)

## Lead management

A commercial marketplace test drive is a great tool for marketers. We recommend you incorporate it in your go-to-market efforts when you launch to generate more leads for your business.

When your test drive is generating highly qualified leads, ensure you incorporate these leads into your sales and marketing channels and engage with prospects to turn them into paying customers. Here are some recommendations for driving leads through your sales cycle:

- Make contact with the lead within 24 hours of them taking the test drive. You will get the lead in your CRM of choice immediately after the customer deploys the test drive; be sure to send them an email within the first 24 hours while they are still warm. Request scheduling a phone call with them to better understand if your product is a good solution for their problem.
- Follow up a couple of times, but don't bombard them. We recommend you email these lead a few times before you close them out, but don't give up after the first attempt. Remember, these customers directly engaged with your product and spent time in a free trial. They are great prospects!
- If you close a deal with a test drive lead, be sure to register it at Partner sales connect. Also, we would love to hear about your customer wins where test drive played a role! <!-- HOW? AND WHERE IS SALES CONNECT? -->

## Other resources

Additional test drive resources:

- [Technical best practices](https://github.com/Azure/AzureTestDrive/wiki/Test-Drive-Best-Practices)
- [Overview](https://assetsprod.microsoft.com/mpn/azure-marketplace-appsource-test-drives.pdf) (PDF; make sure your pop-up blocker is off)

## Next steps

- Continue with [Test drive technical configuration](test-drive-technical-configuration.md).
