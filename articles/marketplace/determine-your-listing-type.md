---
title: Determine your listing type in Azure Marketplace
description: This article describes the eligibility criteria and publishing requirements partners trying to understand how to publish apps to the Azure Marketplace.
services: Marketplace, Compute, Storage, Networking, Blockchain, Security
documentationcenter:
author: ellacroi
manager: msmbaldwin
editor:

ms.assetid: e8d228c8-f9e8-4a80-9319-7b94d41c43a6
ms.service: marketplace
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: article
ms.date: 05/09/2018
ms.author: ellacroi

---

# Determine the Listing Type Right for Your Offer

Each storefront supports multiple publishing options and offer types. Select an offer type that best represents your application and service details. All publishing options will give partners access to lead sharing. 


## List

Use Contact Me when trial-level or transaction-level participation is not feasible. The benefit of this approach is that it enables publishers with an in-market solution to immediately begin receiving leads that can be nurtured into the foundational deals to start your business flywheel. However, the drawback is that customer engagement is limited, as compared with other offer types.

>[!IMPORTANT]
>Customer engagement is best with Trial and Transact offers. The value of Contact Me is the lead that you receive, so if you choose this type of listing, ensure that your lead destination is configured and you are ready to maximize the lead. 

When the offer consists primarily of professional services (for example, assessments, implementations, workshops), use the Consulting Services offer type. Offer scope, duration, and price must be fixed, must be for a single customer, and must be conducted on site.

## Trial

Providing a trial experience increases the engagement level offered to customers and therefore a richer exposure of your solution. A trial enables customers to explore your solution before buying. With a trial experience, you will have higher chances of promotion in the storefronts, and you should expect more and richer leads from customer engagements.
 
All trial options are deployed to your trial environment and/or Azure subscription, rather than to the customer's environment or Azure subscription. Trials should be customer led without any additional purchases and minimal, if any, additional configuration to complete a simple use case. Trials must include free support at least for the duration of the trial period. Trial users should be nurtured and monitored along a deliberate evaluation path for best results. Publishers are encouraged to use both marketplace leads and the publisher's own in-app intelligence to monitor and manage trial users.

There are three typical trial scenarios:

**Free trial**

Use a free trial when the solution or app offers a free-to-try, SaaS-based trial. This option drives high-quality leads from interested customers, to help you start your business flywheel. Free trials can be presented as limited-use or limited-duration trial accounts. They should include a call to action for accelerating conversion to paid use of your software.

|**Trial option**  |**Key benefits**  |**Choose this option if...**  |
|---------|---------|---------|
|**Free trial**    |     Enables a customer to try your product before they buy with an automatic method to convert to paid use. Also enables proofs of concept for the customer and joint engagement with Microsoft sales teams. |     Your solution is a virtual machine or solution template.<br><br> Your solution is an SaaS offering and you offer a multitenant SaaS product. <br><br>You have a first-run experience to get a customer up and running quickly. <br><br>You have a single tenant but are adding customers as guest users.|

**Test Drive**

Use a test drive when the solution is deployed via one or more virtual machines through IaaS or SaaS apps. The benefit of this approach is the automated provisioning of a virtual appliance or entire solution environment couched in a partner-hosted "guided tour" of the solution for customer evaluation at no additional cost to the customer. The customer does not need to be an existing Azure customer, to help generate higher-quality leads.

There are additional benefits to a test drive:

- 27% of user searches on the marketplace are refined by users to only show offers with test drives. 
- Offers with test drives generate 38% more leads than offers without. 
- 36% of new customer acquisitions on the marketplace come from customers that took a test drive. 
- Test drives enable Microsoft field sellers to better understand your product for co-sell efforts.

|**Trial option**  |**Key benefits**  |**Choose this option if...**  |
|---------|---------|---------|
|**Test drive**     |     Enables a customer to try your product before they buy. Also provides a guided experience of your solution on a pre-configured setup. |   Your solution is a virtual machine, solution template, or SaaS app with a single tenant, or is complicated to provision. <br><br>You don't have a method to convert your trial to a paid offer. |

**Interactive Demo**

Take your customers through a guided experience of your product by using an interactive demo. The benefit of this option is that you can provide a trial experience without complicated provisioning for complex solutions. This option gives customers a look around the solution. And it enables publishers to begin receiving leads that can be nurtured into foundational deals to start your business flywheel. 

|**Trial option**  |**Key benefits**  |**Choose this option if...**  |
|---------|---------|---------|
|**Interactive demo**    |  Allows customers to see your product in action without the complexity of setup.       |    Your solution requires complex setup that would be hard to achieve in the trial period.     |

## Transaction

In the Azure Marketplace, use a *virtual machine* when the solution is deployed as a virtual appliance to the customer's subscription. Virtual machines are fully commerce enabled via Pay-As-You-Go or BYOL-enabled licensing models. Microsoft hosts the commerce transaction and bills the customer on behalf of the publisher. The publisher gets the benefit of leveraging the customer's preferred payment relationship with Microsoft, including the Enterprise Agreement. 

>[!NOTE]
>At this time, an Enterprise Agreement's monetary commitments can be used against the virtual appliance's Azure usage, but not against the publisher's software license fees.

>[!NOTE]
>You can restrict the discovery and deployment of your virtual machine to a specific set of customers by listing the image and pricing as a Private offer. Private offers unlock the ability for publishers to create exclusive offers for their closest customers and offer customized software and terms to them. These customized terms enable publishers to light up a variety of scenarios, including field-led deals with specialized pricing and terms as well as early access to limited release software. This allows publishers to give specific pricing or products to a limited set of customers by creating a new SKU with those details. Learn more about [Private Offers](https://azure.microsoft.com/en-us/blog/private-offers-on-azure-marketplace/).

Use an *Azure Application solution template* when a solution requires additional deployment and configuration automation beyond the virtual appliance. Solution templates can automate the provisioning of one or more virtual machine resources and can provision networking and storage resources. Solution templates can provide automation benefits on single virtual machines and on entire IaaS-based solution environments. Learn more about building solution templates in [GitHub](https://github.com/MicrosoftDocs/azure-docs).

Use an *Azure managed app* when you're deploying either a virtual machine or an entire IaaS-based solution to a customer's subscription--and the publisher or customer wants the solution to be managed by a third party (for example, an SI or MSP). Learn more about building managed apps in [Azure managed applications overview](https://docs.microsoft.com/azure/managed-applications/overview). For a list of commonly asked questions, see [Marketplace FAQs](https://azure.microsoft.com/marketplace/faq/).

>[!NOTE]
> Managed apps must be deployable through the Marketplace. If customer communication is a concern, note that you can reach out to interested customers if you have lead sharing enabled.

For SaaS-based, technical solutions, use the *SaaS app* offer type to enable Azure customers to purchase your subscription to your solution via Azure Marketplace. To use this capability publishers must price and bill their service at flat, monthly rate and provide the ability to upgrade or cancel the service at any time. Like virtual machines, Microsoft hosts the commerce transaction and bills the customer on behalf of the publisher. To use bill a SaaS App as a subscription, publishers enable their own subscription management service API to communicate directly with the Azure Marketplace provisioning APIs to support service provisioning, upgrades, and cancelation from the Azure portal.

Use *containers* to publish your solution as a Docker container image to be provisioned to a Kubernetes-based Azure container service, like Azure Kubernetes Service or Azure Container Instances, the user’s choice of Kubernetes-based container runtime. Microsoft currently supports free and BYOL-enabled licensing models with more commerce capabilities coming over the next several months, including subscription and consumption-based billing options.

## Azure Certified program

All virtual machines published in the Azure Marketplace are tested for the Azure Certified program. The program:

- Assures customers that your virtual machine is compatible with the Azure platform and the Marketplace selling model.
- Tests for online image safety compliance, including viruses and malware.
- Enables badging at the offer level to enhance promotion to Microsoft enterprise customers as a validated solution.
- For more information please review [Microsoft Azure Certified](https://azure.microsoft.com/en-us/marketplace/programs/certified/).

## Publishing processes by product for Office, Dynamics, and Power BI
For AppSource apps that extend Office, Dynamics, and Power BI, you can learn more about the specific requirements in the product-specific documentation in this section. 


|Product |Publishing information  |
|---------|---------|
|Office 365     |    Review the [publishing process and guidelines]( https://docs.microsoft.com/office/dev/store/submit-to-the-office-store).     |
|Dynamics 365   for Finance and Operations  |   When you're building for Enterprise Edition, review the [publishing process and guidelines](https://docs.microsoft.com/dynamics365/unified-operations/dev-itpro/lcs-solutions/lcs-solutions-app-source).      |
|Dynamics 365 for Customer Engagement |Review the [publishing process and guidelines](https://docs.microsoft.com/dynamics365/customer-engagement/developer/publish-app-appsource). |
|Power BI   |     Review the [publishing process and guidelines]( https://docs.microsoft.com/power-bi/developer/office-store).    |
|Cortana Intelligence     |    Learn about [Cortana in AppSource](https://docs.microsoft.com/azure/machine-learning/team-data-science-process/cortana-intelligence-appsource-publishing-guide).     |
|AppSource Consulting Offers     |  Review the [guidelines and learn how to submit your offer](https://smp-cdn-prod.azureedge.net/documents/Microsoft%20AppSource%20Partner%20Listing%20Guidelines.pdf).    |
