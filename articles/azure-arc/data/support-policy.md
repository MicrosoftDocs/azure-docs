---
description: "Explains the support policy for Azure Arc-enabled data services"
title: "Azure Arc-enabled data services support policy"
ms.date: "08/08/2022"
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.reviewer: "MikeRayMSFT"
ms.topic: conceptual
author: "dnethi"
ms.author: "dinethi"
---
# Azure Arc-enabled data services support policy. 

This article describes the support policies and troubleshooting boundaries for Azure Arc-enabled data services. This article specifically explains support for Azure Arc data controller and SQL Managed Instance enabled by Azure Arc.

## Support policy
- Azure Arc-enabled data services follow [Microsoft Modern Lifecycle Policy](https://support.microsoft.com/help/30881/modern-lifecycle-policy).
- Read the original [Modern Lifecycle Policy announcement](https://support.microsoft.com/help/447912/announcing-microsoft-modern-lifecycle-policy).
- For additional information, see [Modern Policy FAQs](https://support.microsoft.com/help/30882/modern-lifecycle-policy-faq).

## Support versions

Microsoft supports Azure Arc-enabled data services for one year from the date of the release of that specific version. This support applies to the data controller, and any supported data services. For example, this support also applies to SQL Managed Instance enabled by Azure Arc. 

For descriptions, and instructions on how to identify a version release date, see [Supported versions](upgrade-overview.md#supported-versions). 

Microsoft releases new versions periodically. [Version log](version-log.md) shows the history of releases.

To plan updates, see [Upgrade Azure Arc-enabled data services](upgrade-overview.md).

## Support by components

Microsoft supports Azure Arc-enabled data services, including the data controller, and the data services (like SQL Managed Instance enabled by Azure Arc) that we provide. Arc-enabled data services require a Kubernetes distribution deployed in a customer operated environment. Microsoft does not provide support for the Kubernetes distribution. Support for the environment and hardware that hosts Kubernetes is provided by the operator of the environment and hardware.

Microsoft has worked with industry partners to validate specific distributions for Azure Arc-enabled data services. You can see a list of partners and validated solutions in [Azure Arc-enabled data services Kubernetes validation](validation-program.md).

Microsoft recommends that you run Azure Arc-enabled data services on a validated solution.

## See also

[SQL Server running in Linux containers](/troubleshoot/sql/general/support-policy-sql-server)