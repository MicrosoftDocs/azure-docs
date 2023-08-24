---
title: Azure Active Directory SLA performance
description: Learn about the Azure AD SLA performance
services: active-directory
author: shlipsey3
manager: amycolannino
ms.service: active-directory
ms.topic: reference
ms.workload: identity
ms.subservice: report-monitor
ms.date: 05/22/2023
ms.author: sarahlipsey
ms.reviewer: besiler

ms.collection: M365-identity-device-management
---

# Azure Active Directory SLA performance 

As an identity admin, you may need to track the Azure Active Directory (Azure AD) service-level agreement (SLA) performance to make sure Azure AD can support your vital apps. This article shows how the Azure AD service has performed according to the [SLA for Azure Active Directory (Azure AD)](https://azure.microsoft.com/support/legal/sla/active-directory/v1_1/). 

You can use this article in discussions with app or business owners to help them understand the performance they can expect from Azure AD. 

## Service availability commitment 

Microsoft offers Premium Azure AD customers the opportunity to get a service credit if Azure AD fails to meet the documented SLA. When you request a service credit, Microsoft evaluates the SLA for your specific tenant; however, this global SLA can give you an indication of the general health of Azure AD over time. 

The SLA covers the following scenarios that are vital to businesses:

- **User authentication:** Users are able to sign in to the Azure AD service.

- **App access:** Azure AD successfully emits the authentication and authorization tokens required for users to sign in to applications connected to the service.

For full details on SLA coverage and instructions on requesting a service credit, see the [SLA for Azure Active Directory (Azure AD)](https://azure.microsoft.com/support/legal/sla/active-directory/v1_1/).


## No planned downtime 

You rely on Azure AD to provide identity and access management for your vital systems. To ensure Azure AD is available when business operations require it, Microsoft doesn't plan downtime for Azure AD system maintenance. Instead, maintenance is performed as the service runs, without customer impact. 

## Recent worldwide SLA performance 

To help you plan for moving workloads to Azure AD, we publish past SLA performance. These numbers show the level at which Azure AD met the requirements in the [SLA for Azure Active Directory (Azure AD)](https://azure.microsoft.com/support/legal/sla/active-directory/v1_1/), for all tenants. 

The SLA attainment is truncated at three places after the decimal. Numbers aren't rounded up, so actual SLA attainment is higher than indicated. 

| Month     | 2021    | 2022    | 2023    |
| ---       | ---     | ---     | ---     |
| January   |         | 99.998% | 99.998% |
| February  | 99.999% | 99.999% | 99.999% |
| March     | 99.568% | 99.998% | 99.999% |
| April     | 99.999% | 99.999% | 99.999% |
| May       | 99.999% | 99.999% | 99.999% |
| June      | 99.999% | 99.999% | 99.999% |
| July      | 99.999% | 99.999% | 99.999% |
| August    | 99.999% | 99.999% | |
| September | 99.999% | 99.998% | |
| October   | 99.999% | 99.999% | |
| November  | 99.998% | 99.999% | |
| December  | 99.978% | 99.999% | |

### How is Azure AD SLA measured? 

The Azure AD SLA is measured in a way that reflects customer authentication experience, rather than simply reporting on whether the system is available to outside connections. This distinction means that the calculation is based on if:

- Users can authenticate 
- Azure AD successfully issues tokens for target apps after authentication
  
The numbers in the table are a global total of Azure AD authentications across all customers and geographies. 
  
## Incident history 

All incidents that seriously impact Azure AD performance are documented in the [Azure status history](https://azure.status.microsoft/status/history/). Not all events documented in Azure status history are serious enough to cause Azure AD to go below its SLA. You can view information about the impact of incidents, and a root cause analysis of what caused the incident and what steps Microsoft took to prevent future incidents. 

## Tenant-level SLA (preview)

In addition to providing global SLA performance, Azure AD now provides tenant-level SLA performance. This feature is currently in preview.

To access your tenant-level SLA performance:

1. Navigate to the [Microsoft Entra admin center](https://entra.microsoft.com) using the Reports Reader role (or higher).
1. Go to **Azure AD**, select **Monitoring & health**, then select **Scenario Health** from the side menu.
1. Select the **SLA Monitoring** tab.
1. Hover over the graph to see the SLA performance for that month.

![Screenshot of the tenant-level SLA results.](media/reference-azure-ad-sla-performance/tenent-level-sla.png)

## Next steps

* [Azure AD reports overview](overview-reports.md)
* [Programmatic access to Azure AD reports](concept-reporting-api.md)
* [Azure Active Directory risk detections](../identity-protection/overview-identity-protection.md)
