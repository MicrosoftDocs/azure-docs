---
title: Resources for migrating apps to Azure Active Directory | Microsoft Docs
description: Resources to help you migrate application access and authentication to Azure Active Directory (Azure AD). 
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 02/29/2020
ms.author: kenwith
ms.reviewer: baselden
ms.collection: M365-identity-device-management
---

# Resources for migrating applications to Azure Active Directory

Resources to help you migrate application access and authentication to Azure Active Directory (Azure AD). Take this short survey (https://aka.ms/AppsMigrationFeedback) to provide feedback on your experience migrating apps to Azure AD (including blockers to migration, need for tooling / guidance, or reasons for retaining your on-premises IDP). 

| Resource  | Description  |
|:-----------|:-------------|
|[Migrating your apps to Azure AD](https://aka.ms/migrateapps/whitepaper) | This white paper presents the benefits of migration, and describes how to plan for migration in four clearly-outlined phases: discovery, classification, migration, and ongoing management. You’ll be guided through how to think about the process and break down your project into easy-to-consume pieces. Throughout the document are links to important resources that will help you along the way. |
|[Solution guide: Migrating apps from Active Directory Federation Services (AD FS) to Azure AD](https://aka.ms/migrateapps/adfssolutionguide) | This solution guide walks you through the same four phases of planning and executing an application migration project described at a higher level in the migration whitepaper. In this guide, you’ll learn how to apply those phases to the specific goal of moving an application from Azure Directory Federated Services (AD FS) to Azure AD.|
| [Tool: Active Directory Federation Services Migration Readiness Script](https://aka.ms/migrateapps/adfstools) | This is a script you can run on your on-premises Active Directory Federation Services (AD FS) server to determine the readiness of apps for migration to Azure AD.|
| [Deployment plan: Migrating from AD FS to password hash sync](https://aka.ms/ADFSTOPHSDPDownload) | With password hash synchronization, hashes of user passwords are synchronized from on-premises Active Directory to Azure AD. This allows Azure AD to authenticate users without interacting with the on-premises Active Directory.| 
| [Deployment plan: Migrating from AD FS to pass-through authentication](https://aka.ms/ADFSTOPTADPDownload)|Azure AD pass-through authentication helps users sign in to both on-premises and cloud-based applications by using the same password. This feature provides your users with a better experience since they have one less password to remember. It also reduces IT helpdesk costs because users are less likely to forget how to sign in when they only need to remember one password. When people sign in using Azure AD, this feature validates users' passwords directly against your on-premises Active Directory.|
| [Deployment plan: Enabling Single Sign-on to a SaaS app with Azure AD](https://aka.ms/SSODPDownload) | Single sign-on (SSO) helps you access all the apps and resources you need to do business, while signing in only once, using a single user account. For example, after a user has signed in, the user can move from Microsoft Office, to SalesForce, to Box without authenticating (for example, typing a password) a second time. 
| [Deployment plan: Extending apps to Azure AD with Application Proxy](https://aka.ms/AppProxyDPDownload)| Providing access from employee laptops and other devices to on-premises applications has traditionally involved virtual private networks (VPNs) or demilitarized zones (DMZs). Not only are these solutions complex and hard to make secure, but they are costly to set up and manage. Azure AD Application Proxy makes it easier to access on-premises applications. |
| [Deployment plans](../fundamentals/active-directory-deployment-plans.md) | Find more deployment plans for deploying features such as multi-Factor authentication, Conditional Access, user provisioning, seamless SSO, self-service password reset, and more! |


