---
title: Marketplace Participation Policies | Azure
description: Microsoft Azure Marketplace Participation Policies apply to all publishers and offerings in the Microsoft Azure Marketplace.
services: Azure, Marketplace, Compute, Storage, Networking, Blockchain, Security
documentationcenter:
author: qianw211
manager: Patrick.Butler
editor:

ms.assetid: 
ms.service: marketplace
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: article
ms.date: 1/2/2019
ms.author: ellacroi

---
# Azure Marketplace participation policies

These Microsoft Azure Marketplace Participation Policies apply to all publishers and offerings in the Microsoft Azure Marketplace. These policies are in addition to the terms and conditions set forth in the Microsoft Marketplace Publisher Agreement. To participate in the Azure Marketplace, publishers must always comply with the policies described, and/or referenced in this document. If a publisher fails to meet all terms and conditions at any given time, Microsoft may remove the publisher’s offering from the Azure Marketplace. We may update this document from time to time.

## Base Criteria

1. Software and services offered in the Azure Marketplace must meet at least one of the following criteria: 

    * *Run on Microsoft Azure*: The primary function of the software or service must run on Microsoft Azure.
    * *Deployable to Microsoft Azure*: Publishers must describe in their offering listing information how the software or service is deployed on Microsoft Azure.
    * *Integrate with or extend a Microsoft Azure service*: In their offer listing information, publishers must describe which Azure service the software or service integrates or extends. How the software or service integrates or extends the Azure service.

1. Publishers must be located in a sell-from country supported by the Azure Marketplace. The Azure Marketplace currently supports the following sell-from countries:  Afghanistan, Albania, Algeria, Angola, Antigua and Barbuda, Argentina, Armenia, Australia, Austria, Azerbaijan, Bahrain, Bangladesh, Belarus, Belgium, Benin, Bolivia, Bosnia and Herzegovina, Botswana, Brazil, Bulgaria, Burkina Faso, Burundi, Cambodia, Cameroon, Canada, Central African Republic, Chad, Chile, Colombia, Comoros, Congo (DRC), Congo (Republic of), Costa Rica, Cote D'Ivoire, Croatia, Cyprus, Czech Republic, Denmark, Dominica, Dominican Republic, Ecuador, Egypt, El Salvador, Eritrea, Estonia, Ethiopia, Fiji Islands, Finland, France, Georgia, Germany, Ghana, Greece, Guatemala, Guinea, Haiti, Honduras, Hong Kong SAR, Hungary, Iceland, India, Indonesia, Iraq, Ireland, Israel, Italy, Jamaica, Japan, Jordan, Kazakhstan, Kenya, Korea (South), Kuwait, Laos, Latvia, Lebanon, Liberia, Liechtenstein, Lithuania, Luxembourg, Madagascar, Malawi, Malaysia, Mali, Malta, Mauritius, Mexico, Monaco, Mongolia, Montenegro, Morocco, Mozambique, Nepal, The Netherlands, New Zealand, Nicaragua, Niger, Nigeria, Norway, Oman, Pakistan, Panama, Paraguay, Peru, Philippines, Poland, Portugal, Qatar, Romania, Russia, Rwanda, Saudi Arabia, Senegal, Serbia, Sierra Leone, Singapore, Slovakia, Slovenia, Somalia, South Africa, Spain, Sri Lanka, Sweden, Switzerland, Tajikistan, Tanzania, Thailand, Timor-Leste, Togo, Tonga, Trinidad and Tobago, Tunisia, Turkey, Turkmenistan, Uganda, Ukraine, United Arab Emirates, United Kingdom, United States, Uruguay, Uzbekistan, Venezuela, Vietnam, Zambia, Zimbabwe.

1. For each offering, publishers must make the offering available in at least one sell-to country supported by the Azure Marketplace. The Azure Marketplace currently supports the following sell-to countries: Algeria, Argentina, Australia, Austria, Bahrain, Belarus, Belgium, Brazil, Bulgaria, Canada, Chile, Colombia, Costa Rica, Croatia, Cyprus, Czech Republic, Denmark, Dominican Republic, Ecuador, Egypt, El Salvador, Estonia, Finland, France, Germany, Greece, Guatemala, Hong Kong, Hungary, Iceland, India, Indonesia, Ireland, Israel, Italy, Japan, Jordan, Kazakhstan, Kenya, Kuwait, Latvia, Liechtenstein, Lithuania, Luxembourg, Macedonia, Malaysia, Malta, Mexico, Montenegro, Morocco, Netherlands, New Zealand, Nigeria, Norway, Oman, Pakistan, Panama, Paraguay, Peru, Philippines, Poland, Portugal, Puerto Rico, Qatar, Romania, Russia, Saudi Arabia, Serbia, Singapore, Slovakia, Slovenia, South Africa, South Korea, Spain, Sri Lanka, Sweden, Switzerland, Taiwan, Thailand, Trinidad and Tobago, Tunisia, Turkey, Ukraine, United Arab Emirates, United Kingdom, United States, Uruguay, Venezuela.

1. Publishers must remain in good financial standing.

1. Publisher offerings in the Azure Marketplace must be of limited or general availability, and must have an established customer base.

1. Offerings in the Azure Marketplace cannot use or depend on any product or component that is not supported, or no longer commercially available.

1. Publishers must make detailed technical documentation available.  The documentation needs to describe how to use their offerings on Microsoft Azure.  Each offering must provide or link to such documentation in their listing information.

1. Publishers must announce the availability of their offering in the Azure Marketplace on their public website, and must include hyperlinks to their offer listing pages on [https://azuremarketplace.microsoft.com/marketplace/](https://azuremarketplace.microsoft.com/marketplace/).

1. Publishers must classify each offering based on one or more classification taxonomies provided by Microsoft, including the categories described in the **Offering Classification Definitions** section of this document. If Microsoft considers a publisher-selected classification to be inaccurate, it reserves the right to reclassify any offering.

1. If a publisher’s offering is Microsoft Azure Certified, and does not run primarily on Microsoft Azure, the publisher must make a paid version of the offering available in the Marketplace, within 90 days of publishing a free or BYOL version of the offering.

## Publishing offers

1. Publishers must publish at least one offering in the Azure Marketplace, within 60 days of executing the Microsoft Marketplace Publisher Agreement.

1. Publishers must adhere to Azure Marketplace technical requirements for onboarding, as defined in the Marketplace Publication Guidelines and as may be further identified in the Publishing Portal.

## Offer listings

1. Publishers must include detailed offer information in their offer listing pages, which must be accurate and up-to-date. Such information must include, as applicable:
    * *Offering description*
        * Minimum offer description
            * SKU information
            * Value proposition
        * Recommended offer description
            * Detailed SKU information
            * Detailed value proposition
            * Features: 3-5 factual statements about the offering
            * Benefits: 3-5 results produced by offering features
    * *Pricing model*: The offering must be compatible with [pricing models](./marketplace-faq-publisher-guide.md) supported by the Azure Marketplace, as described in the **Pricing Models** section of this document.
    * *Link to customer support details*: Publishers must provide commercially reasonable customer support for their offerings in the Azure Marketplace.  They can either include it as part of user fees associated with the offering, or as a support offering to be purchased separately.
    * *Offer resources*: Resources include, but are not limited to, demo videos, screenshots, white papers, case studies, testimonials, and detailed technical documentation on how to use the publisher’s offering on Microsoft Azure.
    * *Customer refund policy*
    * *Terms of Use*
    * *Privacy Policy*

1. Publishers may not redirect or up-sell Azure customers within their offer listing page to software or services other than what is available in the Azure Marketplace. This restriction does not apply to support services that publishers sell outside of the Azure Marketplace.

1. Publishers may not promote within the Azure Marketplace the availability of their offerings on other cloud platforms.

1. Microsoft reserves the right to edit and revise offer listing page details for quality assurance. If Microsoft makes any changes to any listing page details, Microsoft is to inform publishers before the publication of their offering listing pages in the Azure Marketplace.

## Offering classification

|     |    |
| :------------------- | :-------------------|
| **Virtual Machine Image** | Pre-configured virtual machine (VM) image with a fully installed operating system, and one or more applications. Virtual Machine Image offerings may include a single VM image or multiple VM images tied together by a Resource Manager template. <br> <br> A virtual machine image (“Image”) provides the information necessary to create and deploy virtual machines in the Azure Virtual Machines service. An Image comprises an operating system, virtual hard drive, and zero or more data disk virtual hard drives. Customers can deploy any number of virtual machines from a single Image. |
| **Virtual Machine Extension** | VM agents that can be added to new VMs using various options, including via REST API, the Azure portal, or Azure PowerShell cmdlets. VM Extensions can also be manually installed on existing VMs, and can be configured for either Windows Server or Linux-based VMs. <br> <br> A virtual machine extension (“**VM Extension**”) is mechanism for installing a software application, or suite of software applications, within Azure virtual machines. A VM Extension may include software applications.  Once it is installed within or executed by a virtual machine, it may download and install one or more software applications from an external location. For clarity, any software or other data installed by your VM Extension, even if retrieved from an external location, is considered Offering Contents for purposes of this Agreement. You are responsible, and must provide support to Customers, for any VM Extension handlers associated with your VM Extension Offerings. |
| **Services** | Fully managed services for information workers, business analysts, developers, or IT pros to use in custom application development or system management. The Marketplace supports three types of services: <br> <br> **Application Services** provide functionality to enable customers to quickly develop cloud scale applications on Azure. <br> <br> Customers must have an Azure subscription to purchase Application Services. Publishers are responsible for metering customers’ usage of Application Services and for reporting usage information to Microsoft, as detailed in the Microsoft Marketplace Publisher Agreement.|
| **Web Application** | Application package that can be used to install and deploy open source or proprietary website content or management platforms in the Azure Websites Service. Web Applications must comply with the Microsoft [Web Application Gallery Principles](https://www.iis.net/learn/develop/windows-web-application-gallery/windows-web-application-gallery-principles). <br> <br> In this Agreement, a “**Web Application**” is an application package used by Customers to install and deploy open source or proprietary website applications in the Azure Website Service. |
| **Catalog Listing** | Offerings that are not available to Azure customers directly through the Marketplace, but the Marketplace displays a link, icon, and software/service product listing.  Customers are directed to the publisher’s web site, or provided instructions on how to obtain and use the offering on Azure. A “**Catalog-Only Listing**” is an Offering that is not available to Customers directly through the Marketplace. Instead, a link, icon, and/or description is displayed in the Marketplace, that directs customers to your website. Furthermore, instructions are provided on how customers may obtain and use the Offering in Azure. For clarity, any software or data referenced by a Catalog-Only Listing is considered Offering Contents in this Agreement. |
| **Azure Resource Manager (Resource Manager) Template** | Resource Manager template can reference multiple, distinct offerings, including offerings published by other publishers.  It enables Azure customers to deploy one or more offerings in a single, coordinated fashion. <br> <br> An “**Azure Resource Manager (Azure Resource Manager) Template**” is a data structure that references one or more Offerings and includes metadata about the Offering(s).  The data structure is associated with Listing Information. Resource Manager templates are used by the Marketplace Service to display and enable customers to deploy certain categories of Offerings. Publishers may publish ARM Templates in the Marketplace that reference multiple, distinct Offerings, including offerings published by other publishers. |
| | |

If you wish to publish an application or service not in any of the categories already discussed, enter a request on the [Azure Marketplace Forum](https://feedback.azure.com/forums/216369-azure-marketplace).

## Pricing models

The following table describes the pricing models currently supported by the Azure Marketplace. An offering may include different SKUs that utilize different pricing models.

| **Pricing Model** | **Description** | **Applicable to** |
| :---------------- | :---------------| :-----------------|
| **Free** | Free SKU. Customers are not charged Azure Marketplace fees for use of the offering. Prices for free SKUs may not be increased to non-zero amounts. | <ul><li>Virtual Machine Images</li><li>VM Extensions</li><li>Services</li><li>Resource Manager templates</li></ul> |
| **Free Trial** <br> **(Try it now)** | Promotional free SKU for a limited period of time. Customers are not charged Azure Marketplace fees for use of the offering through a trial period. Upon expiration of the trial period, customers are automatically charged based on standard rates for use of the offering. The Marketplace is currently not able to prevent customers from creating multiple subscriptions to Free Trial offerings. Publishers who wish to restrict the number of subscriptions customers may create for Free Trial offerings, are responsible for including appropriate restrictions in their Terms of Use. | <ul><li>Virtual Machine Images</li><li>Services</li></ul> |
**BYOL** | Bring-Your-Own-License (BYOL) SKU. If they have obtained access or use of the offering outside of the Azure Marketplace, customers are not charged Azure Marketplace fees. | Virtual Machine Images |
| **Monthly Subscription** | Customers are charged a fixed monthly fee for a subscription to the offering. Monthly subscriptions begin on the date of customer purchase except as described below. Monthly fees are not prorated for mid-month customer cancellations, or unused services. Monthly fees may be prorated if the customer's licensing terms require calendar monthly billing, or if the customer upgrades or downgrades its subscription in the middle of the month. Upgrades and downgrades are only supported if the Publisher configures the offering accordingly. | Services |
| **Usage-Based** | Customers are charged based on the extent of their use of the offering. For Virtual Machine Images, customers are charged an hourly Azure Marketplace fee, as set by publishers, for use of virtual machines deployed from the images. The hourly fee may be uniform or varied across virtual machine sizes. Partial hours are charged by the minute. <br><br> For Application Services, publishers are responsible for defining the unit of measurement for billing purposes. (for example, number of transactions, number of emails sent, etc.) Publishers can define multiple meters for the same Application Service plan. Publishers are responsible for tracking individual customers’ usage, with each meter defined by the offering. They also need to report this tracking information to Microsoft on an hourly basis, using reporting mechanisms provided by Microsoft. Microsoft charges customers based on the usage information reported by publishers for the applicable billing period. | <ul><li>Services</li><li>Virtual Machine Images</li></ul> |
| | | |

Publishers can now lower their user fees for virtual machine offerings already published. All other types of price alterations for existing offerings are currently not supported in the Marketplace. Publishers who wish to change the user fees associated with an offering, should first remove the offering from the Marketplace.  Removal should be done in accordance to the requirements of the Microsoft Marketplace Publisher Agreement and this document.  Then the publisher can publish a new offering that includes the new user fees.

After publishing a Services Offering in the Marketplace, Publishers must maintain their own data logs for a minimum of two (2) previous calendar years. The data logs contain the provisioning of their Offering to customers. If there are any conflicts in the data between the Publisher’s data logs and Microsoft’s data logs, Microsoft’s data logs take precedence.

## Offering suspension and removal

1. Microsoft reserves the right to suspend or remove an offering from the Azure Marketplace for any reason. Reasons Microsoft may remove an offering include, but are not limited to:
    * The offering hasn't been provisioned by any customers for six or more months;
    * The offering has a high cancellation rate for paid SKUs;
    * The offering consistently receives negative customer feedback;
    * The offering consistently receives many support tickets; or
    * The publisher has failed to comply with terms and conditions in the Microsoft Marketplace Publisher Agreement, the Marketplace Publication Guidelines, or this document.

1. For various reasons, you may decide to remove your offer from the Marketplace. Offer Removal ensures that new customers may no longer purchase or deploy your offer, but has no impact on existing customers. Offer Termination is the process of terminating the service and/or licensing agreement between you and your existing customers. Guidance and policies related to offer removal and termination are governed by Microsoft Marketplace Publisher Agreement (see "Payment terms" section). You may request removal or termination by logging a support ticket.

## Payment terms

Publishers are paid applicable Publisher Net Revenues, as defined in the Microsoft Marketplace Publisher Agreement, within 45 days after each calendar month.

## Microsoft software products

Microsoft permits publishers to include the following Microsoft Software Products in their Image Offerings, subject to the terms and conditions of Exhibit B of the Microsoft Marketplace Publisher Agreement:

* Windows Server®
* SQL Server®
* Microsoft Dynamics NAV®

## Taxes

1. **Responsibility for Taxes on End Customer Sales.**

    1. In general, each of Microsoft’s and publisher’s responsibilities for taxes on end customer sales depend on the country and the purchase scenario in which offers are sold.

    1. In certain countries (**Microsoft Managed Countries**) Microsoft assumes responsibility for managing end customer taxation, which may include validating the business status of customers by obtaining tax registration numbers or exemption certificates, deeper managed relationships with customers and calculating, collecting and/or remitting taxes.  In cases where sales are made through partners, Microsoft assumes all partners are businesses and are appropriately discharging their tax obligations.  Additional information can be found in the [FAQs](https://automaticbillingspec.blob.core.windows.net/spec/FAQ%20for%20ISV%20Azure%20Marketplace%20Updates%20March%202019.pdf).

    1. For all countries that are not Microsoft Managed Countries (**ISV Managed Countries**), publishers acknowledge and agree that publishers have sole responsibility to determine and manage end customer taxation, such as registration, tax calculation, collection and remittance, validation of business status of customers and provision of tax invoices to customers, for all offers such publishers choose to make available in ISV Managed Countries.  Publishers acknowledge that, with respect to any sale in an ISV Managed Country, Microsoft currently may not be able to provide.

    1. End customers may purchase offers directly from Microsoft or from Microsoft partners to whom publisher licenses its product.  In addition, there are several different licensing programs.  In some instances, Microsoft Managed Countries may become ISV Managed Countries and vice versa (see the Section on **Microsoft Managed Countries**, below). Information regarding customer purchase scenarios can be found in [Azure Marketplace FAQ](https://docs.microsoft.com/azure/marketplace/marketplace-faq-publisher-guide).

1. **Microsoft Managed Countries.**

    1. The following countries are Microsoft Managed Countries for sales through all customer purchase scenarios: Armenia, Belarus, European Union, Canada, India, Ireland, Liechtenstein, Monaco, New Zealand, Norway, Puerto Rico, Russia, Saudi Arabia, Serbia, South Korea, Switzerland, Taiwan, Turkey, United Arab Emirates and United States. 

    1. Australia is a Microsoft Managed Country for sales through all customer purchase scenarios except the Enterprise Agreement customer purchase scenario.

    1. Microsoft manages end customer taxation for publisher as a convenience and has assumed the most common scenarios for determining the countries and strategies for managing end customer taxation.

    1. Microsoft makes no warranties that Microsoft’s actions will completely satisfy publishers obligations in Microsoft Managed Countries.  For all Microsoft Managed Countries, Microsoft strongly recommends publishers work with their own tax advisors to ascertain whether Microsoft Managed tax remittance sufficiently addresses the publishers’ compliance requirements.  This is particularly critical for any Microsoft Managed Countries from which publishers sell their products.  For example, a publisher established in and selling offers in Saudi Arabia may determine that relying on Microsoft to manage tax may not be sufficient to satisfy the publisher’s compliance obligations.

1. **ISV Managed Countries.**

    1. ISV Managed Countries include Australia, for all sales through the Enterprise Agreement customer purchase scenario, and all countries not referenced in the Section on **Microsoft Managed Countries**.

1. **Special Cases.**

    1. *Brazil*.  For sales in Brazil through all customer purchase scenarios except CSP, Brazil is a Microsoft Managed Country, and Microsoft acts as a reseller, rather than publishers’ agent.  For sales in Brazil through the CSP customer purchase scenario, Microsoft acts as publishers’ agent and sells from a Brazil entity to Brazilian CSPs that Microsoft assumes are tax compliant. 

    1. *Mexico*.  For sales in Mexico through the Enterprise Agreement customer purchase scenario, Mexico is a Microsoft Managed Country, and Microsoft acts as a reseller, rather than publishers’ agent.  For sales in Mexico through all customer purchase scenarios except Enterprise Agreement, Mexico is an ISV Managed Country and Microsoft acts as publishers’ agent.

## Security events

Publishers must report suspected security events, including security incidents and vulnerabilities of their Azure Marketplace software and service offerings, at the earliest opportunity. Publishers should log a support ticket using the process outlined [Azure security event support ticket](https://docs.microsoft.com/azure/security/azure-security-event-support-ticket), by providing the requested information.

## Next step

Visit the [Azure Marketplace and AppSource Publisher Guide](https://docs.microsoft.com/azure/marketplace/marketplace-publishers-guide) page.

---
