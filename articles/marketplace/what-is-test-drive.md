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

A test drive is a great way to showcase your offer to potential customers by giving them the option to *try before you buy*, resulting in increased conversion and generation of highly qualified leads. A test drive brings your product to life in a real-world implementation scenario while also generating highly qualified leads.

Test drives are managed instances that deploy your solution or application on-demand for customers who request it. Once a test drive instance is assigned, it is available for use for a set amount of time, then deleted to create room for another customer.

As a publisher, you manage and configure the test drive settings in Partner Center. Technical configuration details vary depending on the type of offer you are working with. For detailed guidance, see the link under [Next step](#next-step) at the end of this topic.

Potential customers discover your test drive on the commercial marketplace. They provide their contact information and agree to your offer's terms and privacy policy, and then gain access your pre-configured environment to try it for a fixed period of time. Customers receive a hands-on, self-guided trial of your product's key features and benefits and you receive a valuable lead.

## How does it work?

As a publisher, you manage and configure the test drive settings within Partner Center. After setup, it becomes a managed instance that will be deployed on-demand for the customer requesting it. Once a test drive instance is assigned, it is available for use for a set amount of time, then deleted to create room for another customer.

## Types of test drives

There are different test drives available on the commercial marketplace for select offers depending on the type of product, scenario, and marketplace you are on:

- Azure Resource Manager
- Hosted test drive
    - Dynamics 365 for Business Central
    - Dynamics 365 for Customer Engagement
    - Dynamics 365 for Operations
- Logic app
- Power BI

For details on configuring one of these test drives, see the link under [Next step](#next-step) at the end of this topic.

### Azure Resource Manager test drive

This deployment template contains all the Azure resources that comprise your solution. Products that fit this scenario use only Azure resources. This is the only test drive option for virtual machine or Azure app offers.

### Hosted test drive

A hosted test drive removes the complexity of setup by letting Microsoft host and maintain the service that performs the test drive user provisioning, deployment, and de-provisioning. If you have an offer on Microsoft AppSource, build your test drive to connect with a Dynamics AX/CRM instance or any other resource beyond just Azure. Use this type for AppSource offers to connect with these Dynamics 365 offers:

- Use [Dynamics 365 for Business Central](https://docs.microsoft.com/azure/marketplace/partner-center-portal/create-new-operations-offer) for a Business Central enterprise resource planning system such as finance, operations, supply chain, and CRM.
- Use [Dynamics 365 for Customer Engagement](https://docs.microsoft.com/azure/marketplace/partner-center-portal/create-new-customer-engagement-offer) for a Customer Engagement system such as sales, service, project service, and field service.
- Use [Dynamics 365 for Operations](https://docs.microsoft.com/azure/marketplace/partner-center-portal/create-new-operations-offer) for a Finance and Operations enterprise resource planning system such as finance, operations, and manufacturing, supply chain.

### Logic app test drive

This type of test drive is not hosted by Microsoft. Use it to connect with a Dynamics 365 offer or other custom resource.

### Power BI test drive

This is simply an embedded link to a custom-built dashboard. Any product that only demonstrates an interactive Power BI visual should use this type of test drive.

## Transforming examples

The process of turning an architecture of resources into a test drive can be daunting. Check out these examples of how to best transform current architectures.

[Transform a website template into a test drive](https://github.com/Azure/AzureTestDrive/wiki/Transforming-Website-Deployment-Template-for-Test-Drive)

[Transform a virtual machine template into a test drive](https://github.com/Azure/AzureTestDrive/wiki/Transforming-Virtual-Machine-Deployment-Template-for-Test-Drive)

[Transform an existing Resource Manager template into a test drive](https://github.com/Azure/AzureTestDrive/wiki/Deploying-Existing-Solutions)

## Generate leads from your test drive

A commercial marketplace test drive is a great tool for marketers. We recommend you incorporate it in your go-to-market efforts when you launch to generate more leads for your business. For detailed guidance, see [Customer leads from your commercial marketplace offer](https://github.com/partner-center-portal/commercial-marketplace-get-customer-leads.md).

If you close a deal with a test drive lead, be sure to register it at [Microsoft Partner Sales Connect](https://support.microsoft.com/help/3155788/getting-started-with-microsoft-partner-sales-connect). Also, we would love to hear about your customer wins where a test drive played a role.

## Other resources

Additional test drive resources:

- [Technical best practices](https://github.com/Azure/AzureTestDrive/wiki/Test-Drive-Best-Practices)
- [Overview](https://assetsprod.microsoft.com/mpn/azure-marketplace-appsource-test-drives.pdf) (PDF; make sure your pop-up blocker is off)

## Next step

- [Test drive technical configuration](test-drive-technical-configuration.md)
