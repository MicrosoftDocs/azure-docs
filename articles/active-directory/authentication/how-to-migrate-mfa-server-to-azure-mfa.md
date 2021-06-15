---
title: Migrate from Azure MFA Server to Azure multi-factor authentication - Azure Active Directory
description: Step-by-step guidance to migrate from Azure MFA Server on-premises to Azure multi-factor authentication

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 06/15/2021

ms.author: BarbaraSelden
author: justinha
manager: daveba
ms.reviewer: michmcla

ms.collection: M365-identity-device-management
---
# Getting started with the Azure Multi-Factor Authentication Server

Multi-factor authentication (MFA) is important to securing your infrastructure and assets from bad actors. Azure Multi-Factor Authentication Server (MFA Server) isn’t available for new deployments and will be deprecated. Customers who are using MFA Server should move to using cloud-based Azure Active Directory (Azure AD) multi-factor authentication. 
In this documentation, we assume that you have a hybrid environment where:

- You are using MFA Server for MFA.
- You are using federation on Azure AD with Active Directory Federation Services (AD FS) or another identity provider federation product.
  - While this article is scoped to AD FS, similar steps apply to other identity providers.
- Your MFA Server is integrated with AD FS. 
- You might have applications using AD FS for authentication.

There are multiple possible end states to your migration, depending on your goal.

| <br> | Goal: Decommission MFA Server ONLY | Goal: Decommission MFA Server and move to Azure AD Authentication | Goal: Decommission MFA Server and AD FS |
|------|------------------------------------|-------------------------------------------------------------------|-----------------------------------------|
|MFA provider | Change MFA provider from MFA Server to Azure AD MFA. | Change MFA provider from MFA Server to Azure AD MFA. |	Change MFA provider from MFA Server to Azure AD MFA. |
|User authentication  |Continue to use federation for Azure AD authentication. | Move to Azure AD with Password Hash Synchronization (preferred) or Passthrough Authentication **and** seamless single sign-on.| Move to Azure AD with Password Hash Synchronization (preferred) or Passthrough Authentication **and** seamless single sign-on. |
|Application authentication | Continue to use AD FS authentication for your applications. | Continue to use AD FS authentication for your applications. | Move apps to Azure AD before migrating to Azure MFA. |

If you can, move both your MFA and your user authentication to Azure. For step-by-step guidance, see [Moving to Azure AD MFA and Azure AD user authentication](how-to-migrate-mfa-server-to-azure-mfa-user-authentication.md). 

If you can’t move your user authentication, see the step-by-step guidance for [Moving to Azure AD MFA with federation](how-to-migrate-mfa-server-to-azure-mfa-with-federation.md).

## Prerequisites

## Considerations for all migration paths

### Migrating MFA user information

#### Migrating hardware security keys

### Additional migrations

### RADIUS clients and Azure AD MFA

#### Important considerations

### Resources for deploying NPS

## Next steps


