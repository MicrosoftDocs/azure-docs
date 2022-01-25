---
title: Azure Virtual Desktop limits
description: Azure Virtual Desktop limitations.
ms.topic: include
ms.date: 01/25/2021
author: thhickli
ms.author: thhickli
ms.service: azure-virtual-desktop
---

<!-- Used in /azure/azure-resource-manager/management/azure-subscription-service-limits.md -->

The following table describes the maximum limits for Azure Virtual Desktop.

| **Azure Virtual Desktop Object**                    | **Parent Container Object**                     | **Service Limit**   |
|-----------------------------------------------------|-------------------------------------------------|--------------------------------------------------|
| Workspace                                           | Azure Active Directory Tenant                   | 1300 |
| HostPool                                            | Workspace                                       | 400 |
| Application group                                   | HostPool                                        | 200 |
| RemoteApp                                           | Application group                               | 500 |
| Role Assignment                                     | Any AVD Object                                  | 200 |
| Session Host                                        | HostPool                                        | 10,000 |

To get started with Azure Virtual desktop, use the [getting started guide!](https://docs.microsoft.com/en-us/azure/virtual-desktop/overview).
For deeper architectural content for Azure Virtual Desktop, use the [Azure Virtual Desktop section of the Cloud Adoption Framework!](https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/scenarios/wvd/).
For pricing information for Azure Virtual Desktop add "Azure Virtual Desktop" within the Compute section of the [Azure Pricing Calculator!](https://azure.microsoft.com/en-gb/pricing/calculator).
