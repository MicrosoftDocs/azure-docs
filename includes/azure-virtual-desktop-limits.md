---
title: Azure Virtual Desktop limitations
description: Azure Virtual Desktop limitations.
ms.topic: include
ms.date: 01/25/2021
author: thhickli
ms.author: thhickli
ms.service: virtual-desktop
---

<!-- Used in /azure/azure-resource-manager/management/azure-subscription-service-limits.md -->

The following table describes the maximum limits for Azure Virtual Desktop.

| **Azure Virtual Desktop Object**                    | **Per Parent Container Object**                     | **Service Limit**   |
|-----------------------------------------------------|-------------------------------------------------|--------------------------------------------------|
| Workspace                                           | Azure Active Directory Tenant                   | 1300 |
| HostPool                                            | Workspace                                       | 400 |
| Application group                                   | Azure Active Directory Tenant                   | 500<sup>1</sup>  |
| RemoteApp                                           | Application group                               | 500 |
| Role Assignment                                     | Any Azure Virtual Desktop Object                | 200 |
| Session Host                                        | HostPool                                        | 10,000 |

<sup>1</sup>If you require over 500 Application groups then please raise a support ticket via the Azure portal.

All other Azure resources used in Azure Virtual Desktop such as Virtual Machines, Storage, Networking etc. are all subject to their own resource limitations documented in the relevant sections of this article. 
To visualise the relationship between all the Azure Virtual Desktop objects, review this article [Relationships between Azure Virtual Desktop logical components](/azure/architecture/example-scenario/wvd/windows-virtual-desktop#azure-virtual-desktop-limitations).

To get started with Azure Virtual Desktop, use the [getting started guide](../articles/virtual-desktop/overview.md).
For deeper architectural content for Azure Virtual Desktop, use the [Azure Virtual Desktop section of the Cloud Adoption Framework](/azure/cloud-adoption-framework/scenarios/wvd/).
For pricing information for Azure Virtual Desktop, add "Azure Virtual Desktop" within the Compute section of the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator).
