---
title: Cloud Services (extended support) Migration
description: Frequently asked questions for Cloud Services (extended support) Migration
ms.topic: conceptual
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Cloud Services (extended support) Migration 

This article covers frequently asked questions related to Cloud Services (extended support) Migration.

## How do I migrate my Cloud Services (classic) to Cloud Services (extended support)? 

- Identify all your subscriptions and create a catalog of all your Cloud Services (classic) deployments. You can use look at all your deployment on Cloud Services (classic) Portal blade or Resource Graph Explorer using Portal or PowerShell.  

- Understand the set of features used and blockers for migration 

- Build a catalog of custom tools, automations, dashboard built that need to update to start using newer APIs, PS/CLI commands & SDKs. 

- Reach out to microsoft for assistance with migration if needed. (Support, Cloud Solution Architects, Technical Account Managers, Microsoft Q&A) 

- Build a detailed migration plan and execution timeline.  

- Start and complete migration. Customers can either do a lift & shift migration (create parallel deployment on ARM, thoroughly test the deployment, migrate traffic from old to new deployment) or migrate within microsoft provided migration tool (will be soon released).  

## What other compute products are available for migration and how to migrate? 

Customers have a range of offering for all workloads and scenarios available other than Cloud Services (extended support) for migration. The Choosing an Azure compute service document can help you get started.   

Migration to any of the other compute offering will mostly require changes to your architecture, application code and deployment files. Complexity of the migration will depend on complexity of your application, list of features unsupported on other products, volume of migration and many other factors.  

Migration process will look like any other migration: 

First, create a catalog of your deployments, list of features used, scenarios required and custom tools, automations, scripts, dashboard developed.  

Understand the features & scenarios supported on your new compute product and identify work around for blockers. This can be done through public documentation, community forums or using microsoft resources like Fast Track, Cloud Solution Architects, Technical Account Managers and Azure Migration Program.  

Define the migration plan and timeline. This definitely should include how to create a parallel deployment on your new compute product, how to test this new deployment and how to migrate traffic from old to new deployment.  

Execute on the migration. Many of the microsoft resources will work with you throughout the execution and provide help with blockers. Make sure to define detailed timeline with multiple intermediate milestones to track the progress.  

Celebrate the victory upon migration completion. You have just taken the first step towards a brighter, prosperous future.  

## Why do I need to migrate? 

ASM is built on an old cloud architecture and therefore has points of failure, low security & reliability compared to ARM, lower value for money & minimal scope of growth.  

Most Virtual Machines (classic) customers and many Cloud Services (classic) customers have either already migrated or are actively migrating their existing deployments to ARM.  

Since ASM customers are the early adopters of Azure, we value your business a lot and want the best tools and experience Azure has to offer.  

## Why do I need to migrate now especially when Cloud Services (extended support) is still in Preview? 

Estimating the time required, complexity and efforts for migration is very difficult due to influence of range of variables. We have seen big customers take anywhere from 3 months to 2 years to complete the migration.  

Planning is the most time consuming but the most effective step to understand the scope of work, blockers, complexity for migration and many other factors.  

We therefore ask all customers to at least build a catalog of features & scenarios used today, understand what different compute products have to offer, test migration on test deployments and define a detailed plan.  .  

If Cloud Services (extended support) is the path for you, early start gives you an opportunity to raise blockers ensuring the product is ready for you immediately after general availability. 

## What Microsoft resources are available for me to migrate? 

Microsoft Q&A, Stack Overview, GitHub, Public documents are available for self-help content, community support and to ask microsoft for assistance. This is available for all customers. 

Microsoft Fast Track & Azure Migration Program can assist customers with planning and execution of migration. Dedicated microsoft personals work with customer throughout the migration. This is available for all customers. (Still onboarding AMP) 

Microsoft Support is available for technical assistance and to handle migration failures.  

## Why am I able to see a Load Balancer resource in my subscription and resource group? 

Cloud services (extended support) aim to give customers more control and/or visibility into their 	deployment. The load balancer is now an explicit 'read only' resource automatically created by the platform; customers only need to provide the load balancer name in the ARM template. 

## Why is a Virtual Network mandatory for my cloud service (extended support) deployments? 

Virtual Network (VNet) is a fundamental building block and isolation boundary in Azure for deployments created through the Resource Manager. Cloud service (extended support) deployments always need to be in a VNet, that must be referenced in the customers config (cscfg) file. 

## Can I use an existing ARM VNet for deploying cloud services (extended support)? 

Yes, you can. Cloud services (extended support) can be deployed either in a new VNet created in ARM or any existing VNet that has other resources deployed in the same VNet. However, you cannot mix cloud services in the same subnet as other native ARM resources. 

## Can I use an existing Reserved IP address (classic) to associate with a new cloud service (extended support) deployment? 

Cloud services (extended support) can only use 'Basic' SKU Public IPs in ARM. You can either create new or use an existing 'Basic' SKU public IP resource and reference it in the 'Reserved IP' section of the cscfg. If you wish to use an existing Reserved IP address (classic), you will first need to migrate it to ARM. 

## Do I get a DNS name for my cloud services (extended support)? 

Yes, cloud services (extended support) can also be given a DNS name. With Azure Resource Manager, the DNS label is an optional property of the Public IP address that is assigned to the cloud service. The format of the DNS name for ARM based deployments as `userlabel.region.cloudapp.azure.com `