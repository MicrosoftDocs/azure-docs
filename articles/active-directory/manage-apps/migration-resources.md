---
title: Resources for migrating apps to Azure Active Directory | Microsoft Docs
description: Resources to help you migrate application access and authentication to Azure Active Directory (Azure AD). 
services: active-directory
author: barbkess
manager: mtillman
ms.service: active-directory
ms.component: app-mgmt
ms.topic: conceptual
ms.workload: identity
ms.date: 09/14/2018
ms.author: barbkess
ms.reviewer: baselden

---

# Resources for migrating applications to Azure Active Directory

Resources to help you migrate application access and authentication to Azure Active Directory (Azure AD). 

| Resource  | Description  |
|:-----------|:-------------|
|[Migrating your apps to Azure AD](https://aka.ms/migrateapps/whitepaper) | This white paper presents the benefits of migration, and describes how to plan for migration in four clearly-outlined phases: discovery, classification, migration, and ongoing management. You’ll be guided through how to think about the process and break down your project into easy-to-consume pieces. Throughout the document are links to important resources that will help you along the way. |
|[Solution guide: Migrating apps from Active Directory Federation Services (AD FS) to Azure AD](https://aka.ms/adfstoaadsolutionguide) | This solution guide walks you through the same four phases of planning and executing an application migration project described at a higher level in the migration whitepaper. In this guide, you’ll learn how to apply those phases for the specific goal of moving an application off of Azure Directory Federated Services (AD FS) to Azure AD.|
| [Tool: Active Directory Federation Services Migration Readiness Script](https://aka.ms/migrateapps/adfsscript) | This script can be run on your on-premises Active Directory Federation Services (AD FS) server to determine the readiness of apps for migration to Azure AD.|
| [Deployment plan: Migrating from AD FS to password hash sync](https://aka.ms/ADFSTOPHSDPDownload) | With Password Hash Synchronization, hashes of user passwords are synchronized from on-premises Active Directory to Azure AD, letting Azure AD to authenticate users with no interaction with the on-premises Active Directory.| 
| [Deployment plan: Migrating from AD FS to pass-through authentication](https://aka.ms/ADFSTOPTADPDownload)|Azure AD Pass-through Authentication helps your users sign in to both on-premises and cloud-based applications, using the same passwords. This feature provides your users a better experience - one less password to remember, and reduces IT helpdesk costs because your users are less likely to forget how to sign in. When people sign in using Azure AD, this feature validates users' passwords directly against your on-premises Active Directory.|
| [Deployment plan: Enabling Single Sign-on to a SaaS app with Azure AD](https://aka.ms/SSODPDownload) | Single sign-on helps you access all the apps and resources you need to do business, while signing in only once, using a single user account. After you've signed in, you can go from Microsoft Office to SalesForce, to Box without being required to authenticate (for example, type a password) a second time. 
| [Deployment plan: Extending apps to Azure AD with Application Proxy](https://aka.ms/AppProxyDPDownload)|Employees today want to be productive at any place, at any time, and from any device. They want to work on their own devices, whether they are tablets, phones, or laptops. And employees expect to be able to access all their applications, both SaaS apps in the cloud and corporate apps on-premises. Providing access to on-premises applications has traditionally involved virtual private networks (VPNs) or demilitarized zones (DMZs). Not only are these solutions complex and hard to make secure, but they are costly to set up and manage. There is a better way! - Azure AD Application Proxy|
| [Deployment plans](https://docs.microsoft.com/en-us/azure/active-directory/fundamentals/active-directory-deployment-plans) | Find more deployment plans for deploying features such as Multi-Factor Authentication, Conditional Access, User Provisioning, seamless SSO, Self-Service Password Reset, and more! |

Please feel free to email our team at aadappfeedback@microsoft.com with any feedback you might have. We would love to know what other resources would be helpful to your migration processes! 
