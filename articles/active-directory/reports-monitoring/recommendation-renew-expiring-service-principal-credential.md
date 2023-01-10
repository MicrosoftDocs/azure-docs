---
title: Azure Active Directory recommendation - Renew expiring service principal credentials | Microsoft Docs
description: Learn why you should renew expiring service principal credentials.
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: reference
ms.workload: identity
ms.subservice: report-monitor
ms.date: 01/09/2023
ms.author: sarahlipsey
ms.reviewer: hafowler
ms.collection: M365-identity-device-management
---
# Azure AD recommendation: Renew expiring service principal credentials

[Azure AD recommendations](overview-recommendations.md) is a feature that provides you with personalized insights and actionable guidance to align your tenant with recommended best practices.

This article covers the recommendation to renew expiring service principal credentials.

## Description

An Azure Active Directory (Azure AD) service principal is the local representation of an application object in a single tenant or directory. The service principal defines who can access an application and what resources the application can access. Authentication of service principals is often completed using certificate credentials, which have a lifespan. If the credentials expire, the application will not be able to authenticate with your tenant. 

## Logic 

This recommendation shows up if your tenant has service principals with credentials that will expire soon. 

## Value 

Renewing the service principal credential(s) before expiration ensures the application continues to function and reduces the possibility of downtime due to an expired credential.

## Action plan

1. Navigate to **Azure AD** > **Enterprise applications**. The status of the service principal appears in the **Certificate Expiry Status** column.
1. Select the service principal with the credential that needs to be rotated, then select **Single sign-on** from the side menu.
1. Edit the **SAML signing certificate** section and follow the prompts to add a new certificate.
1. After adding the certificate, change its properties to make the certificate active. This will make the other certificate inactive.
1. Once the certificate is successfully added and activated, update the service code to ensure it works with the new credential and has no negative customer impact. You should use Azure AD’s sign-in logs to validate that the thumbprint of the certificate matches the one that was just uploaded.
1. After validating the new credential, navigate back to the **Certificates and Secrets** area for the app and remove the old credential.
 
## Next steps

- [What is Azure Active Directory recommendations](overview-recommendations.md)
- [Learn about securing service principals](../fundamentals/service-accounts-principal.md)
- [Learn about app and service principal objects in Azure AD](../develop/app-objects-and-service-principals.md)