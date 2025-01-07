---
title: 'Guide to build and publish Microsoft Sentinel solutions'
description: This article walks you through the entire lifecycle of how to build and publish solutions to Microsoft Sentinel.
author: anilgodavarthy
ms.author: angodavarthy
ms.service: microsoft-sentinel
ms.topic: conceptual 
ms.date: 01/07/2025

#CustomerIntent: As an ISV interested to build solutions for Microsoft Sentinel, I should be able to know all the details that will help me get started and guide me through the entire lifecycle of developing and publishing Microsoft Sentinel solutions.
---

# Build and publish Microsoft Sentinel solutions

Security Operations teams use Microsoft Sentinel to generate detections and investigate and remediate threats. Offering your data, detections, automation, analysis and packaged expertise, to customers via integration with Microsoft Sentinel enables security teams with the right information at the right time to execute informed security responses. 

This section covers everything independent software developers (ISVs) need to build and optimize high-quality solutions for Microsoft Sentinel. At a high level, the roadmap to success from concept to completion contains the following steps. In the remainder of this article, you find details on how to proceed with each step in your journey. 

   :::image type="content" source="media/sentinel-integration-guide/sentinel-integration-timeline.png" alt-text="Image showing the end-to-end steps involved in building and publishing solutions to Microsoft Sentinel." lightbox="media/sentinel-integration-guide/sentinel-integration-timeline.png":::   

# Learn about Microsoft Sentinel Integrations

## What is Microsoft Sentinel?
Microsoft Sentinel is a scalable, cloud-native security information and event management (SIEM) that delivers an intelligent and comprehensive solution for SIEM and security orchestration, automation, and response (SOAR). Microsoft Sentinel provides cyberthreat detection, investigation, response, and proactive hunting, with a bird's-eye view across your enterprise.
- [What is Microsoft Sentinel?](/azure/sentinel/overview)

## What should I build?
The most important step to a great integration is deciding which types of content to include in your integration, to match your product’s capabilities. Explore the following resources to understand the types of content you can contribute to Microsoft Sentinel -

- [Technology Integration Scenarios with Microsoft Sentinel](/azure/sentinel/partner-integrations)
- [Building Microsoft Sentinel Integrations - Part 1: Onboarding](https://www.youtube.com/watch?v=eK5bmKhy2iI)

## Review the docs
You find a rich collection of documentation to support with your journey. Below are some key resources to get you started - 

- [Guide to building Microsoft Sentinel Solutions](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions#guide-to-building-microsoft-sentinel-solutions)
- [Become familiar with Microsoft Sentinel Solutions repo on GitHub](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions)
- [ASIM Normalized Schema: Advanced Security Information Model (ASIM) security content | Microsoft Docs](/azure/sentinel/normalization-content)
- [Kusto query language: Getting Started with the Kusto Query Language (KQL) | Microsoft Docs](/archive/blogs/msdn/ben/getting-started-with-the-kusto-query-language)  

## Become a Cloud Partner and create a Publisher Account
Microsoft Sentinel solutions are published on the Azure Commercial Marketplace. To publish to the marketplace, join the cloud partner program - 

- [Overview of the Microsoft commercial marketplace](/partner-center/marketplace-offers/overview)
- [Create a commercial marketplace account in Partner Center](/partner-center/account-settings/create-account)
- [Join ISV Success program](https://www.microsoft.com/isv/offer-benefits)
- [Sign up for Microsoft for Startups program, if applicable](https://www.microsoft.com/startups)

# Build your solution

## Provision environment
To help you get started with building and testing your solution, we recommend you sign up for an Azure Free Trial and a Microsoft Sentinel Free Trial.
- [Sign up for an Azure Free Trial ](https://azure.microsoft.com/pricing/purchase-options/azure-account?icid=azurefreeaccount)
- [Then sign up for a Microsoft Sentinel Free Trial (Scroll down to 'Free trial')](https://azure.microsoft.com/pricing/details/microsoft-sentinel/)
 
## Complete the training lab
We highly recommend the training lab to get fully ramped up with Microsoft Sentinel. This lab provides hands-on practical experience for product features, capabilities, and scenarios.

- [Complete the Microsoft Sentinel Training Lab](https://azure.microsoft.com/pricing/purchase-options/azure-account?icid=azurefreeaccount)
 
## Build a connector
Microsoft Sentinel is built on data. Most solutions start with bringing the data from a customer’s environment into Microsoft Sentinel. To understand how to build a connector, refer to the following resources -

- [Guide to Building Microsoft Sentinel Data Experiences](https://github.com/Azure/Azure-Sentinel/blob/master/DataConnectors/ReadMe.md)
- [Webinar: Creating Data Connectors](https://www.youtube.com/watch?v=wXCh17rgtLU)
- [Microsoft Sentinel Tech Blog](https://techcommunity.microsoft.com/category/microsoft-sentinel/blog/microsoftsentinelblog)

## Build your content
In addition to data, your solution can offer a rich array of other components to help customers get the most out of your data. For example, you can offer detections, workbooks, playbooks, and hunting queries to make your offering readily usable by customers. For more information on building content, see [What can you contribute and how can you create contributions?](https://github.com/Azure/Azure-Sentinel/wiki).

 ## Open a pull request
Once your solution is ready for review, raise a pull request (PR) in the Microsoft Sentinel solutions repository. The PR will be reviewed by the Microsoft Sentinel engineering staff for best practices.
- [Create a Microsoft Sentinel Pull Request](https://github.com/Azure/Azure-Sentinel?tab=readme-ov-file#pull-request)

# Test your solution 

## Resolve technical feedback
After opening your pull request, a member of the Microsoft Sentinel engineering staff will review for best practices. If more changes are needed before publishing, you'll find the necessary changes described in the comments attached to the pull request. 

## Microsoft merges PR & generates package
Upon the successful completion of all technical feedback, Microsoft Sentinel engineering staff merges the pull request into the main branch, and generate the final package you need to submit with your offer.

# Publish to Azure Commercial Marketplace

## Create an offer
After your solution has been merged into the Microsoft Sentinel solutions repository, you’re ready to create an offer in the commercial marketplace. For more information on how to publish your solution, see the following resources -
- [Publish Solutions to Microsoft Sentinel](/azure/sentinel/publish-sentinel-solutions)

## Test Offer Preview
During the preview creation phase, we create a version of your offer that is accessible only to the preview audience you specified during offer creation. This is to ensure that your solution can be tested by specific audience that you configure before it's broadly shared with all customers.
- [Status of Microsoft Sentinel solution after publishing in the Microsoft Partner center](/azure/sentinel/sentinel-solutions-post-publish-tracking)

## 'Go Live' to Publish Offer
Ensure that you validated all aspects of your solution in preview phase before you make the offer live. Ensure that you validate all aspects of your solution in preview phase before you make the offer live. For more information, see [Publishing a Microsoft Sentinel Solution](/azure/sentinel/sentinel-solutions-post-publish-tracking#step-3-publisher-approval).

## Fix certification issues
Offers submitted to the commercial marketplace must be certified before being published. If your offer fails any of the checks or if you aren't eligible to submit an offer of that type, a certification failure report is sent to your email address. The errors also show up within Action Center in Partner Center. For more information, see [Certification issues](/azure/sentinel/sentinel-solutions-post-publish-tracking#step-4-certification).

# Preview

## Inform customers
Socialize the availability of your solution with your customers so that they can test and provide feedback on the solution.

## Resolve support issues
As customers use the preview version of your solution, they may encounter issues. Be prepared to address these issues as they arise. In addition to issues, customers may also request new features or enhancements. Depending on the feedback, you may need to iterate on your solution before making it generally available.

## Continue for four weeks
We recommend keeping your solution in preview for at least four weeks to gather feedback from customers and address any issues that arise.

# Go to Market

## Remove preview flag
After the preview period, you can remove the preview flag from your offer to make it generally available to all customers. 

## Listen for customers feedback
Continue to monitor feedback and support requests as your solution gains traction. This ensures that you can quickly address any issues that arise.

## Enhance solution
Based on customer feedback, you may need to enhance your solution to meet customer needs. Be prepared to iterate on your solution to ensure that it meets the needs of your customers.