---
title: Connect Azure AD Identity Protection data to Azure Sentinel
description: Learn how to stream logs and alerts from Azure AD Identity Protection into Azure Sentinel to view dashboards, create custom alerts, and improve investigation.
author: yelevin
manager: rkarlin
ms.assetid: 91c870e5-2669-437f-9896-ee6c7fe1d51d
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: how-to
ms.date: 06/24/2020
ms.author: yelevin
---
# Connect data from Azure Active Directory (Azure AD) Identity Protection

You can stream logs from [Azure AD Identity Protection](../active-directory/identity-protection/overview-identity-protection.md) into Azure Sentinel to stream alerts into Azure Sentinel to view dashboards, create custom alerts, and improve investigation. Azure Active Directory Identity Protection provides a consolidated view at risk users, risk detections and vulnerabilities, with the ability to remediate risk immediately, and set policies to auto-remediate future events. The service is built on Microsoft’s experience protecting consumer identities and gains tremendous accuracy from the signal from over 13 billion log-ins a day. 

## Prerequisites

- You must have an [Azure AD Premium P2 subscription](https://azure.microsoft.com/pricing/details/active-directory/).
- You must have a user with global administrator or security administrator permissions.


## Connect to Azure AD Identity Protection

If you have an Azure AD Premium P2 subscription, Azure AD Identity Protection is included. If any [policies are enabled](../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md) and generating alerts, the alert data can easily be streamed into Azure Sentinel.

1. In Azure Sentinel, select **Data connectors** and then click the **Azure AD Identity Protection** tile.

1. Click **Connect** to start streaming Azure AD Identity Protection events into Azure Sentinel.

1. To use the relevant schema in Log Analytics for the Azure AD Identity Protection alerts, search for **SecurityAlert**.

If you want to test the connector, you can [simulate detections](../active-directory/identity-protection/howto-identity-protection-simulate-risk.md) to generate sample alerts that will be streamed into Azure Sentinel.

## Next steps

In this document, you learned how to connect Azure AD Identity Protection to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
