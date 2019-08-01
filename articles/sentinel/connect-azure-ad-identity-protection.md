---
title: Connecting Azure AD Identity Protection data to Azure Sentinel Preview| Microsoft Docs
description: Learn how to connect Azure AD Identity Protection data to Azure Sentinel.
services: sentinel
documentationcenter: na
author: rkarlin
manager: rkarlin
editor: ''

ms.assetid: 91c870e5-2669-437f-9896-ee6c7fe1d51d
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/07/2019
ms.author: rkarlin

---
# Connect data from Azure AD Identity Protection

> [!IMPORTANT]
> Azure Sentinel is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

You can stream logs from [Azure AD Identity Protection](https://docs.microsoft.com/azure/information-protection/reports-aip) into Azure Sentinel to stream alerts into Azure Sentinel to view dashboards, create custom alerts, and improve investigation. Azure Active Directory Identity Protection provides a consolidated view at risk users, risk events and vulnerabilities, with the ability to remediate risk immediately, and set policies to auto-remediate future events. The service is built on Microsoft’s experience protecting consumer identities and gains tremendous accuracy from the signal from over 13 billion log-ins a day. 


## Prerequisites

- You must have an [Azure Active Directory Premium P1 or P2 license](https://azure.microsoft.com/pricing/details/active-directory/)
- User with global administrator or security administrator permissions


## Connect to Azure AD Identity Protection

If you already have Azure AD Identity Protection, make sure it is [enabled on your network](../active-directory/identity-protection/enable.md).
If Azure AD Identity Protection is deployed and getting data, the alert data can easily be streamed into Azure Sentinel.


1. In Azure Sentinel, select **Data connectors** and then click the **Azure AD Identity Protection** tile.

2. Click **Connect** to start streaming Azure AD Identity Protection events into Azure Sentinel.


6. To use the relevant schema in Log Analytics for the Azure AD Identity Protection alerts, search for **IdentityProtectionLogs_CL**.

## Next steps
In this document, you learned how to connect Azure AD Identity Protection to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).
