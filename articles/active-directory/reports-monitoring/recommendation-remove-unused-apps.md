---
title: Microsoft Entra recommendation - Remove unused apps (preview)
description: Learn why you should remove unused apps.
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: reference
ms.workload: identity
ms.subservice: report-monitor
ms.date: 09/21/2023
ms.author: sarahlipsey
ms.reviewer: saumadan
---
# Microsoft Entra recommendation: Remove unused applications (preview)
[Microsoft Entra recommendations](overview-recommendations.md) is a feature that provides you with personalized insights and actionable guidance to align your tenant with recommended best practices.

This article covers the recommendation to investigate unused applications. This recommendation is called `UnusedApps` in the recommendations API in Microsoft Graph. 

## Description

This recommendation shows up if your tenant has applications that haven't been used in more than 30 days, so haven't been issued any tokens. Applications or service principals that were added but never used show up as unused apps, which will also trigger this recommendation.

## Value 

Removing unused applications improves the security posture and promotes good application hygiene. It reduces the risk of application compromise by someone discovering an unused application and misusing it to get tokens. Depending on the permissions granted to the application and the resources that it exposes, an application compromise could expose sensitive data in an organization.

## Action plan

Applications that the recommendation identified appear in the list of **Impacted resources** at the bottom of the recommendation. 

1. Take note of the application name and ID that the recommendation identified.
1. Browse to **Identity** > **Applications** > **App registrations** and locate the application that was surfaced as part of this recommendation.

    ![Screenshot of the Microsoft Entra app registration page.](media/recommendation-remove-unused-apps/app-registrations-list.png)

1. Determine if the identified application is needed.
    - If the application is no longer needed, remove it from your tenant.
    - If the application is needed, we suggest you take appropriate steps to ensure the application is used in intervals of less than 30 days.

## Known limitations

Take note of the following common scenarios or known limitations of the "Remove unused applications" recommendation.

* The time frame for application usage that triggers this recommendation can't be customized.

* The following apps won't show up as a part of this recommendation, but are currently under review for future enhancements: 
    - Microsoft-owned applications
    - Password single sign-on
    - Linked single sign-on
    - App proxy
    - Add-in apps

* The current unused app processor identifies any apps that were created recently. In some instances newly created apps might need more time to deploy the code that uses the application registration. Progress is underway to filter out apps that were created within the past 60 days so they don't show as unused.

## Next steps

- [Review the Microsoft Entra recommendations overview](overview-recommendations.md)
- [Learn how to use Microsoft Entra recommendations](howto-use-recommendations.md)
- [Explore the Microsoft Graph API properties for recommendations](/graph/api/resources/recommendation)
