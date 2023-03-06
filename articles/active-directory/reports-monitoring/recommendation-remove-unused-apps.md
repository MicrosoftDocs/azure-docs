---
title: Azure Active Directory recommendation - Remove unused apps (preview) | Microsoft Docs
description: Learn why you should remove unused apps.
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: reference
ms.workload: identity
ms.subservice: report-monitor
ms.date: 03/06/2023
ms.author: sarahlipsey
ms.reviewer: hafowler
ms.collection: M365-identity-device-management
---
# Azure AD recommendation: Remove unused applications (preview)
[Azure AD recommendations](overview-recommendations.md) is a feature that provides you with personalized insights and actionable guidance to align your tenant with recommended best practices.

This article covers the recommendation to investigate unused applications. This recommendation is called `UnusedApps` in the recommendations API in Microsoft Graph. 

## Description

This recommendation shows up if your tenant has applications that haven't been used in more than 30 days, so haven't been issued any tokens. Applications or service principals that were added but never used will show up as unused apps, which will also trigger this recommendation.

## Value 

Removing unused applications improves the security posture and promotes good application hygiene. It reduces the risk of application compromise by someone discovering an unused application and misusing it to get tokens. Depending on the permissions granted to the application and the resources that it exposes, an application compromise could expose sensitive data in an organization.

## Action plan

Applications that the recommendation identified appear in the list of **Impacted resources** at the bottom of the recommendation. 

1. Take note of the application name and ID that the recommendation identified.
1. Go to **Azure AD** > **App registration** and locate the application that was surfaced as part of this recommendation.

    ![Screenshot of the Azure AD app registration area, with the App registrations menu item highlighted.](media/recommendation-remove-unused-apps/app-registrations-list.png)

1. We suggest you take appropriate steps to ensure the application is not used in longer intervals of more than 30 days. If so, we recommend updating the frequency of access such that the application’s last used time is within 30 days from its last access date.

## Known limitations

Take note of the following common scenarios or known limitations of the "Remove unused applications" recommendation.

* The time frame for application usage that triggers this recommendation cannot be customized.

* The following apps will not show up as a part of this recommendation, but are currently under review for future enhancements: 
    - Microsoft-owned applications
    - Password single sign-on
    - Linked single sign-on
    - App proxy
    - Add-in apps

* This recommendation currently surfaces applications that were created within the past 30 days *and* shows as unused. Updates to the recommendation to filter out newly-created apps so that they can complete a full cycle are in progress.

## Next steps

- [Review the Azure AD recommendations overview](overview-recommendations.md)
- [Learn how to use Azure AD recommendations](howto-use-recommendations.md)
- [Explore the Microsoft Graph API properties for recommendations](/graph/api/resources/recommendation)
