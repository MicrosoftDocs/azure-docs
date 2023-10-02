---
title: Manage reliability and performance with Azure Dev/Test subscriptions
description: Build reliability into your applications with Dev/Test subscriptions. 
author: jenp
ms.author: jenp
ms.prod: visual-studio-windows
ms.topic: how-to
ms.date: 10/12/2021
ms.custom: devtestoffer
---

# Reliability Management  

While production services won't be in a dev/test subscription, you may use other stages in your Azure dev/test subscription to ensure reliability in production.  

When using your organization dev/test subscriptions, you have to decide how you’re going to:  

- Control data  
- Control security and access  
- Manage the uptime of that production system  

Typically, there are different stages of deployment that you go through before production – shared, QA, integration, staging, and failover. Depending on how your company defines these stages, your use of an organization dev/test subscription may change.  

If you're running mission-critical services like customer-facing applications, don't use a dev/test subscription. Dev/Test subscriptions don't carry a financially backed SLA. These subscriptions are for pre-production testing and development.  

## Site Reliability Engineering (SRE)  

To learn more about reliability engineering and management, consider site reliability management - an engineering discipline devoted to helping organizations sustainably achieve appropriate reliability in its systems, services, and products.  

How SRE and DevOps differ is still under discussion in the field. Some broadly agreed upon differences include:  

- SRE is an engineering discipline focused on reliability. DevOps is a cultural movement that emerged from the urge to break down the silos associated with Development and Operations organizations.  
- SRE can be the name of a role as in "I’m a site reliability engineer (SRE)". DevOps can't.  
- SRE tends to be prescriptive. DevOps is intentionally not. Nearly universal adoption of continuous integration/continuous delivery, and Agile principles are the closest DevOps comes.  

If you want to learn more about the practice of SRE, check out these links:  

- [SRE in Context](/training/modules/intro-to-site-reliability-engineering/3-sre-in-context)  
- [Key SRE Principles and Practices: virtuous cycles](/training/modules/intro-to-site-reliability-engineering/4-key-principles-1-virtuous-cycles)  
- [Key SRE Principles and Practices: The human side of SRE](/training/modules/intro-to-site-reliability-engineering/5-key-principles-2-human-side-of-sre)  
- [Getting Started with SRE](/training/modules/intro-to-site-reliability-engineering/6-getting-started)  

## Service Level Agreements  

Enterprise Dev/Test is exclusively for the development and testing of your applications. Use of the subscription doesn't carry a financially backed SLA.  

## Learn to Use Different Types of Dev/Test Subscriptions  

Whether you need [Monthly Azure Credits for Visual Studio subscribers](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/), [Enterprise Dev/Test Subscriptions](https://azure.microsoft.com/offers/ms-azr-0148p/), or a [Pay-As-You-Go Dev/Test Subscription](https://azure.microsoft.com/offers/ms-azr-0023p/) (PAYG), you can easily find offers that work for individuals or a team.  

## Managing Individual Credit Subscriptions  

Visual Studio Azure credits are an individual benefit, for individual Dev/Test and inner loop development. You can’t pool credits between developers. Credit subscriptions are still Azure subscriptions, but a specific Azure offer. Manage your credit subscriptions in the same way you manage other Azure subscriptions so you can work within groups and teams. You can remove individual spending limits with a credit card, or if your enterprise Dev/Test subscription goes to your company's chosen procurement method.  

Developer inner loop activities often use credits, but then switch to enterprise or organization Azure Dev/Test subscriptions, including pay as you go. This way as you follow DevOps processes, you can inner loop with your individual credit subscription. In the DevOps outer loop, non-production targets are in enterprise Dev/Test - prod goes to prod.  

Manage your credit subscriptions, enterprise dev/test subscriptions, and PAYG subscriptions and segment your developers using [management groups](../../governance/management-groups/how-to/protect-resource-hierarchy.md) that each have a unique hierarchy.  

## Using Your Organization Azure Dev/Test Offers  

If you need an organization Azure Dev/Test subscription, you have two offers to choose from.  

- [Pay-As-You-Go (PAYG) Dev/Test (0023P)](https://azure.microsoft.com/offers/ms-azr-0023p/)  
- [Enterprise Dev/Test (0148P)](https://azure.microsoft.com/offers/ms-azr-0148p/)  

Each comes with their own set of discounts and require a Visual Studio Subscription.  

Each subscription offer allows you to get your team up and running with dev/test environments in the cloud using pre-configured virtual machines. Create multiple Azure subscriptions and manage them from one account. You can maintain isolated environments and a separate bill for different projects or teams.  

Enterprise Dev/Test Subscriptions require an enterprise agreement (EA). Pay-As-You-Go Dev/Test Subscriptions don't require an EA but can be used with an enterprise agreement account.  

## Why would I use PAYG offers vs Enterprise Dev/Test Offers?  

A PAYG Dev/Test offer might be the right fit to use as a Visual Studio subscriber. Unlike credit subscriptions for individual use, PAYG offers are great for team development and allow you to have multiple users within one subscription. A PAYG Dev/Test offer might be right for you if:  

- You don't have an enterprise agreement. In this case, you can only create a PAYG account with a Visual Studio license.  
- You're creating an enterprise agreement, but you need to set up a subscription that doesn't use your organization’s agreement. You may have a unique project that requires its own subscription or to create an isolated environment billed separately for projects or teams.  
- You prefer to keep identities isolated. You may need certain identities to remain separate from others to protect access to data, resources, and apps.  
