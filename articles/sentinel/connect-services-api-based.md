---
title: Connect Microsoft Sentinel to other Microsoft services with an API-based data connector
description: Learn how to connect Microsoft Sentinel to Microsoft services with API-based connections.
author: yelevin
ms.topic: how-to
ms.date: 02/24/2023
ms.author: yelevin
---

# Connect Microsoft Sentinel to other Microsoft services with an API-based data connector

This article describes how to make API-based connections to Microsoft Sentinel. Microsoft Sentinel uses the Azure foundation to provide built-in, service-to-service support for data ingestion from many Azure and Microsoft 365 services, Amazon Web Services, and various Windows Server services. There are a few different methods through which these connections are made.

This article presents information that is common to the group of API-based data connectors.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

## Prerequisites

- You must have read and write permissions on the Log Analytics workspace.
- You must have the Global administrator or Security administrator role on your Microsoft Sentinel workspace's tenant.
- Data connector specific requirements:
  
  |Data connector  |Licensing, costs, and other prerequisites  |
  |---------|---------|
  |Azure Active Directory Identity Protection   | - [Azure AD Premium P2 subscription](https://azure.microsoft.com/pricing/details/active-directory/)<br> - Other charges may apply      |
  |Dynamics 365     | - [Microsoft Dynamics 365 production license](/office365/servicedescriptions/microsoft-dynamics-365-online-service-description). Not available for sandbox environments.<br>- At least one user assigned a Microsoft/Office 365 [E1 or greater](/power-platform/admin/enable-use-comprehensive-auditing#requirements) license.<br>- Other charges may apply    |
  |Microsoft Defender for Cloud Apps|For Cloud Discovery logs, [enable Microsoft Sentinel as your SIEM in Microsoft Defender for Cloud Apps](/cloud-app-security/siem-sentinel)|
  |Microsoft Defender for Endpoint|Valid license for [Microsoft Defender for Endpoint deployment](/microsoft-365/security/defender-endpoint/production-deployment)|
  |Microsoft Defender for Office 365|Valid license for [Office 365 ATP Plan 2](/microsoft-365/security/office-365-security/office-365-atp#office-365-atp-plan-1-and-plan-2)|
  |Microsoft Office 365|- Your Office 365 deployment must be on the same tenant as your Microsoft Sentinel workspace.<br>- Other charges may apply.|
  |Microsoft Power BI|- Your Office 365 deployment must be on the same tenant as your Microsoft Sentinel workspace.<br>- Other charges may apply.|
  |Microsoft Purview Information Protection|- Your Office 365 deployment must be on the same tenant as your Microsoft Sentinel workspace.<br>- Other charges may apply.|
  |Microsoft Purview Insider Risk Management (IRM)    |- Valid subscription for Microsoft 365 E5/A5/G5, or their accompanying Compliance or IRM add-ons.<br>- [Microsoft Purview Insider Risk Management](/microsoft-365/compliance/insider-risk-management) fully onboarded, and [IRM policies](/microsoft-365/compliance/insider-risk-management-policies) defined and producing alerts.<br>- [Microsoft 365 IRM configured](/microsoft-365/compliance/insider-risk-management-settings#export-alerts-preview) to enable the export of IRM alerts to the Office 365 Management Activity API in order to receive the alerts through the Microsoft Sentinel connector. |



## Instructions

1. From the Microsoft Sentinel navigation menu, select **Data connectors**.

1. Select your service from the data connectors gallery, and then select **Open Connector Page** on the preview pane.

1. Select **Connect** to start streaming events and/or alerts from your service into Microsoft Sentinel.

1. If on the connector page there is a section titled **Create incidents - recommended!**, select **Enable** if you want to automatically create incidents from alerts.

You can find and query the data for each service using the table names that appear in the section for the service's connector in the [Data connectors reference](data-connectors-reference.md) page.

## Next steps

For more information, see:

- [Microsoft Sentinel solutions catalog](sentinel-solutions-catalog.md)
- [Threat intelligence integration in Microsoft Sentinel](threat-intelligence-integration.md)