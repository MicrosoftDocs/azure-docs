---
title: Connect Azure AD Identity Protection data to Azure Sentinel
description: Learn how to connect Azure AD Identity Protection data to Azure Sentinel.
author: yelevin
manager: rkarlin
ms.assetid: 91c870e5-2669-437f-9896-ee6c7fe1d51d
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: conceptual
ms.date: 11/17/2019
ms.author: yelevin
---
# Connect data from Azure AD Identity Protection



You can stream logs from [Azure AD Identity Protection](https://docs.microsoft.com/azure/active-directory/identity-protection/overview-identity-protection) into Azure Sentinel to stream alerts into Azure Sentinel to view dashboards, create custom alerts, and improve investigation. Azure Active Directory Identity Protection provides a consolidated view at risk users, risk detections and vulnerabilities, with the ability to remediate risk immediately, and set policies to auto-remediate future events. The service is built on Microsoft’s experience protecting consumer identities and gains tremendous accuracy from the signal from over 13 billion log-ins a day. 


## Prerequisites

- You must have an [Azure Active Directory Premium P1 or P2 license](https://azure.microsoft.com/pricing/details/active-directory/)
- User with global administrator or security administrator permissions


## Connect to Azure AD Identity Protection

If you already have Azure AD Identity Protection, make sure it is [enabled on your network](../active-directory/identity-protection/overview-identity-protection.md).
If Azure AD Identity Protection is deployed and getting data, the alert data can easily be streamed into Azure Sentinel.


1. In Azure Sentinel, select **Data connectors** and then click the **Azure AD Identity Protection** tile.

2. Click **Connect** to start streaming Azure AD Identity Protection events into Azure Sentinel.


6. To use the relevant schema in Log Analytics for the Azure AD Identity Protection alerts, search for **SecurityAlert**.

## Next steps
In this document, you learned how to connect Azure AD Identity Protection to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
