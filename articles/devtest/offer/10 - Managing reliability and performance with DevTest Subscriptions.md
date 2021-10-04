---
title: Managing reliability and performance with Dev/Test subscriptions
description: A guide to building reliability into your applications with Dev/Test subscriptions. 
author: j-martens
ms.author: jmartens
ms.prod: visual-studio-windows
ms.topic: how-to
ms.date: 10/04/2021
ms.custom: devtestoffer
---

# Reliability Management  

As an organization, you must manage the reliability of an application for your developers and users. Whether it’s a website, a service, an API, your job is to manage the production service. The production service will not be in a dev/test subscription. However, there are other stages you may use within an Azure dev/test subscription to ensure the reliability of your production application.  

When using your organization dev/test subscriptions, you have to decide how you’re going to:  

- Control data  
- Control security and access  
- Manage the uptime of that production system  

Typically, there are different stages of deployment that you go through before production – shared, QA, integration, staging, and failover. Depending on how your company defines these stages, your use of an organization dev/test subscription may change.  

It’s important to note that if you are running mission-critical services like customer-facing applications, you should not use a dev/test subscription. Dev/Test subscriptions do not carry a financially backed SLA. These subscriptions are for pre-production testing and development.  

## Site Reliability Engineering  

If you want to learn more about reliability engineering and management, you should consider the practice of site reliability management - an engineering discipline devoted to helping an organization sustainably achieve the appropriate level of reliability in its systems, services, and products.  

A successful operations process, one that achieves the desired reliability and sustains it, is as much dependent on how we treat the machines as it is how we treat the humans responsible for that environment. Site reliability engineering acknowledges this truth in several ways that are crucial to its practice.  

How SRE and DevOps differ is a topic still under considerable discussion in the field. There are some broadly agreed upon differences, including:  

- SRE is an engineering discipline that focuses on reliability, DevOps is a cultural movement that emerged from the urge to break down the silos typically associated with separate Development and Operations organizations.  
- SRE can be the name of a role as in "I’m a site reliability engineer (SRE)", DevOps can't. No one, strictly speaking, is a "DevOps" for a living.  
- SRE tends to be more prescriptive, DevOps is intentionally not so. Nearly universal adoption of continuous integration/continuous delivery and Agile principles are the closest it comes in this regard.  

If you want to learn more about the practice of SRE, check out these links: 

- [SRE in Context](/learn/modules/intro-to-site-reliability-engineering/3-sre-in-context.md)  
- [Key SRE Principles and Practices: virtuous cycles](/learn/modules/intro-to-site-reliability-engineering/4-key-principles-1-virtuous-cycles.md)  
- [Key SRE Principles and Practices: The human side of SRE](/learn/modules/intro-to-site-reliability-engineering/5-key-principles-2-human-side-of-sre.md)  
- [Getting Started with SRE](/learn/modules/intro-to-site-reliability-engineering/6-getting-started.md)  

## Service Level Agreements  

Enterprise Dev/Test is exclusively for the development and testing of your applications. Usage within the subscription does not carry a financially backed SLA.  

## Learn to Use Different Types of Dev/Test Subscriptions  

Whether you need [Monthly Azure Credits for Visual Studio subscribers](https://azure.microsoft.com/en-us/pricing/member-offers/msdn-benefits-details/), [Enterprise Dev/Test Subscriptions](https://azure.microsoft.com/en-us/offers/ms-azr-0148p/), or a [Pay-As-You-Go Dev/Test Subscription](https://azure.microsoft.com/en-us/offers/ms-azr-0023p/) (PAYG), you can easily find offers that work for individuals or a team.  

## Managing Individual Credit Subscriptions  

Visual Studio Azure credits are an individual benefit, for individual Dev/Test and inner loop development. You can’t pool credits between developers. Credit subscriptions are still Azure subscriptions, but a specific Azure offer (e.g. pricing type). You can manage these credit subscriptions in multiple ways and in the same way you manage other Azure subscriptions - so you can work within groups and teams. You can remove individual spending limits with a credit card, or if using enterprise Dev/Test goes to your companies chosen procurement method.  

It is not uncommon for developer inner loop activities to use credits, but then use enterprise or organization Azure Dev/Test subscriptions, including pay as you go, for organization purposes. This way as you follow DevOps processes, you can inner loop with your individual credit subscription (like your laptop). In the DevOps outer loop, non-production targets are in enterprise Dev/Test - prod goes to prod.  

You can manage your credit subscriptions, enterprise dev/test subscriptions, and PAYG subscriptions and segment your developers using [management groups](../../governance/management-groups/how-to/protect-resource-hierarchy.md) that each have a unique hierarchy.  

Learn more about Security with Azure Dev/Test subscriptions: (link – Security within Dev/Test subscriptions).  

Follow our process guide: (link – Creating a Developer tenant)  

## Using Your Organization Azure Dev/Test Offers  

If you need an organization Azure Dev/Test subscription, you have two offers to choose from.  

- [Pay-As-You-Go (PAYG) Dev/Test (0023P)](https://azure.microsoft.com/en-us/offers/ms-azr-0023p/-)  
- [Enterprise Dev/Test (0148P)](https://azure.microsoft.com/en-us/offers/ms-azr-0148p/)  

Each come with their own set of discounts and require a Visual Studio Subscription.  

Each subscription offers allow you to quickly get your team up and running with dev/test environments in the cloud using pre-configured virtual machines. You have the flexibility to create multiple Azure subscriptions and manage them from one account, enabling you to maintain isolated environments and a separate bill for different projects or teams.  

Enterprise Dev/Test Subscriptions require an enterprise agreement (EA). Pay-As-You-Go Dev/Test Subscriptions do not require an EA but can be used with an enterprise agreement account.  

## Why would I use PAYG offers vs Enterprise Dev/Test Offers?  

There are three reasons why a PAYG Dev/Test offer would be the right fit to use as a Visual Studio subscriber. Unlike credit subscriptions for individual use, PAYG offers are great for team development and allow you to have multiple users within one subscription.  

1. You do not currently have an enterprise agreement. In this case, you can only create a PAYG account with a Visual Studio license.  
2. You are creating an enterprise agreement, but you need to set up a subscription that does not use your organization’s agreement. You may have a unique project that requires its own subscription or create an isolated environment billed separately for projects or teams.  
3. The last reason you may need to use a PAYG offer over the Enterprise Dev/Test Offer is to keep identities isolated. You may need certain identities to remain separate from others to protect access to data, resources, and apps.  

Learn more about Security with Azure Dev/Test subscriptions: (link – Security within Dev/Test subscriptions).  

Follow our process guide: (link – Creating a Developer tenant)  