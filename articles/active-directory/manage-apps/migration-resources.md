---
title: Resources for migrating apps to Microsoft Entra ID
description: Resources to help you migrate application access and authentication to Microsoft Entra ID.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 05/31/2023
ms.author: jomondi
ms.reviewer: alamaral
ms.custom: not-enterprise-apps
---

# Resources for migrating applications to Microsoft Entra ID

Resources to help you migrate application access and authentication to Microsoft Entra ID.

| Resource  | Description  |
|:-----------|:-------------|
|[Migrating your apps to Microsoft Entra ID](https://aka.ms/migrateapps/whitepaper) | This article is an introduction to a series of articles that describe how to plan for migration in four clearly-outlined phases: discovery, classification, migration, and ongoing management. You're guided through how to think about the process and break down your project into easy-to-consume pieces. Throughout the series are links to important resources that help you along the way. |
|[Developer tutorial: AD FS to Microsoft Entra application migration playbook for developers](https://aka.ms/adfsplaybook) | This set of ASP.NET code samples and accompanying tutorials help you learn how to safely and securely migrate your applications integrated with Active Directory Federation Services (AD FS) to Microsoft Entra ID. This tutorial is focused towards developers who not only need to learn how to configure apps on both AD FS and Microsoft Entra ID, but also become aware and confident of changes their code base will require in this process.|
| [Tool: Active Directory Federation Services Migration Readiness Script](https://aka.ms/migrateapps/adfstools) | This is a script you can run on your on-premises Active Directory Federation Services (AD FS) server to determine the readiness of apps for migration to Microsoft Entra ID.|
| [Deployment plan: Migrating from AD FS to password hash sync](https://aka.ms/ADFSTOPHSDPDownload) | With password hash synchronization, hashes of user passwords are synchronized from on-premises Active Directory to Microsoft Entra ID. This allows Microsoft Entra ID to authenticate users without interacting with the on-premises Active Directory.|
| [Deployment plan: Migrating from AD FS to pass-through authentication](https://aka.ms/ADFSTOPTADPDownload)|Microsoft Entra pass-through authentication helps users sign in to both on-premises and cloud-based applications by using the same password. This feature provides your users with a better experience since they have one less password to remember. It also reduces IT help desk costs because users are less likely to forget how to sign in when they only need to remember one password. When people sign in using Microsoft Entra ID, this feature validates users' passwords directly against your on-premises Active Directory.|
| [Deployment plan: Enabling single sign-on to a SaaS app with Microsoft Entra ID](https://aka.ms/SSODPDownload) | Single sign-on (SSO) helps you access all the apps and resources you need to do business, while signing in only once, using a single user account. For example, after a user has signed in, the user can move from Microsoft Office, to SalesForce, to Box without authenticating (for example, typing a password) a second time.
| [Deployment plan: Extending apps to Microsoft Entra ID with Application Proxy](../app-proxy/application-proxy-deployment-plan.md)| Providing access from employee laptops and other devices to on-premises applications has traditionally involved virtual private networks (VPNs) or demilitarized zones (DMZs). Not only are these solutions complex and hard to make secure, but they're costly to set up and manage. Microsoft Entra application proxy makes it easier to access on-premises applications. |
| [Other deployment plans](../architecture/deployment-plans.md) | Find more deployment plans for deploying features such as Microsoft Entra multifactor authentication, Conditional Access, user provisioning, seamless SSO, self-service password reset, and more! |
| [Migrating apps from Symantec SiteMinder to Microsoft Entra ID](https://azure.microsoft.com/mediahandler/files/resourcefiles/migrating-applications-from-symantec-siteminder-to-azure-active-directory/Migrating-applications-from-Symantec-SiteMinder-to-Azure-Active-Directory.pdf) | Get step by step guidance on application migration and integration options with an example that walks you through migrating applications from Symantec SiteMinder to Microsoft Entra ID. |
| [Identity governance for applications](../governance/identity-governance-applications-prepare.md)| This guide outlines what you need to do if you're migrating identity governance for an application from a previous identity governance technology, to connect Microsoft Entra ID to that application.|
| [Active Directory Federation Services (AD FS) decommission guide](/windows-server/identity/ad-fs/decommission/adfs-decommission-guide) | This guide explains the prerequisites for decommissioning, including migrating user authentication and applications to Microsoft Entra ID. It also provides step-by-step instructions for decommissioning the AD FS servers, including removing load balancer entries, uninstalling WAP and AD FS servers, and deleting SSL certificates and databases. |
| [Videos - Phases of migrating apps from ADFS to Microsoft Entra ID](app-management-videos.md#phases-of-migrating-apps-from-adfs-to-azure-ad) | These videos illustrate the five phases of a typical migration of an application from ADFS to Microsoft Entra ID.
