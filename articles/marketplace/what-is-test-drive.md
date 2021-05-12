---
title: What is a test drive? Microsoft commercial marketplace
description: Explanation of Marketplace test drive feature
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: trkeya
ms.author: trkeya
ms.date: 06/19/2020
---

# What is a test drive?

A test drive is a great way to showcase your offer to potential customers by giving them the option to try before you buy, generating highly qualified leads and resulting in increased conversion. A test drive brings your product to life in a real-world implementation scenario. Customers who try out your product are demonstrating a clear intent to buy a similar solution. Use this to your advantage by following up with more advanced leads.

Your customers benefit from a test drive as well. By allowing them to try your product first, you are reducing the friction of the purchase process. In addition, test drive is pre-provisioned, i.e., customers don’t have to download, set up or configure the product.

## How does it work?

Test drives are managed instances that launch your solution or application on-demand for customers who request it. Once a test drive instance is assigned, it is available for use by that customer for a set period. After the period has ended, it is then deleted to create room for another customer.

As a publisher, you manage and configure the test drive settings in Partner Center. Technical configuration details vary depending on the type of offer. For detailed guidance, see the [Test drive technical configuration](./test-drive-technical-configuration.md).

Potential customers discover your test drive as a CTA on your offer on [AppSource](https://appsource.microsoft.com/en-US/). They provide their contact information and agree to your offer's terms and privacy policy, then gain access to your pre-configured environment to try it for a fixed period. Customers receive a hands-on, self-guided trial of your product's key features and benefits and you receive a valuable lead.

## Types of test drives

There are different test drives available on the commercial marketplace for select offers depending on the type of product, scenario, and marketplace you are on:

- Azure Resource Manager
    - Azure Applications
    - SaaS
    - Virtual Machines
- Hosted test drive
    - Dynamics 365 for Business Central (currently not supported)
    - Dynamics 365 for Customer Engagement
    - Dynamics 365 for Operations
- Logic app (in support mode only)
- Power BI

For details on configuring one of these test drives, see [Test drive technical configuration](./test-drive-technical-configuration.md). 

### Azure Resource Manager test drive

This deployment template contains all the Azure resources that comprise your solution. Products that fit this scenario use only Azure resources. The Azure Resource Manager test drive is available for these offer types: 

- Azure applications
- SaaS
- Virtual machines

>[!NOTE]
>This is the only test drive option for virtual machine and Azure application offers.

### Hosted test drive (Recommended)

A hosted test drive removes the complexity of setup by letting Microsoft host and maintain the service that performs the test drive user provisioning, and de-provisioning. If you have an offer on Microsoft AppSource, build your test drive to connect with a Dynamics AX/CRM instance. You can use the following AppSource offers types:

- Use [Dynamics 365 for Customer Engagement and Power Apps](dynamics-365-customer-engage-offer-setup.md) for a Customer Engagement system such as sales, service, project service, and field service.
- Use [Dynamics 365 for Operations](partner-center-portal/create-new-operations-offer.md) for a Finance and Operations enterprise resource planning system such as finance, operations, and manufacturing, supply chain.

### Logic app test drive

This type of test drive is not hosted by Microsoft and uses Azure Resource Manager (ARM) templates for Dynamics AX/CRM offer types. You will need to run the ARM template to create required resources in your Azure subscription. Logic App Test Drive is currently on support mode only and is not recommended by Microsoft For details on configuring a Logic App Test Drive, see [Test drive technical configuration](./test-drive-technical-configuration.md).

### Power BI test drive

This is simply an embedded link to a custom-built dashboard. Any product that only demonstrates an interactive Power BI visual should use this type of test drive.

## Transforming examples

The process of turning an architecture of resources into a test drive can be daunting. Check out these examples of how to best transform current architectures.

[Transform a website template into a test drive](https://github.com/Azure/AzureTestDrive/wiki/Transforming-Website-Deployment-Template-for-Test-Drive)

[Transform a virtual machine template into a test drive](https://github.com/Azure/AzureTestDrive/wiki/Transforming-Virtual-Machine-Deployment-Template-for-Test-Drive)

[Transform an existing Resource Manager template into a test drive](https://github.com/Azure/AzureTestDrive/wiki/Deploying-Existing-Solutions)

## Generate leads from your test drive

A commercial marketplace test drive is a great tool for marketers. We recommend you incorporate it in your go-to-market efforts when you launch to generate more leads for your business. For detailed guidance, see [Customer leads from your commercial marketplace offer](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/marketplace/partner-center-portal/commercial-marketplace-get-customer-leads.md).

If you close a deal with a test drive lead, be sure to register it at [Microsoft Partner Sales Connect](https://support.microsoft.com/help/3155788/getting-started-with-microsoft-partner-sales-connect). Also, we would love to hear about your customer wins where a test drive played a role.

## Other resources

Additional test drive resources:

- [Test Drive best practices](https://github.com/Azure/AzureTestDrive/wiki/Test-Drive-Best-Practices)
- [Overview](https://assetsprod.microsoft.com/mpn/azure-marketplace-appsource-test-drives.pdf) (PDF; make sure your pop-up blocker is off)

## Next step

- [Test drive technical configuration](test-drive-technical-configuration.md)