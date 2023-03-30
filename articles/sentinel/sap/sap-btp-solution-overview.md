---
title: Microsoft Sentinel Solution for SAP BTP overview
description: This article introduces the Microsoft Sentinel Solution for SAP BTP.
author: limwainstein
ms.author: lwainstein
ms.topic: conceptual
ms.date: 03/22/2023
---

# Microsoft Sentinel Solution for SAP BTP overview

This article introduces the Microsoft Sentinel Solution for SAP BTP. The solution monitors and protects your SAP Business Technology Platform (BTP) system, by collecting audits and activity logs from the BTP infrastructure and BTP based apps, and detecting threats, suspicious activities, illegitimate activities, and more.

SAP BTP is a cloud-based solution that provides a wide range of tools and services for developers to build, run, and manage applications. One of the key features of SAP BTP is its low-code development capabilities. Low-code development allows developers to create applications quickly and efficiently by using visual drag-and-drop interfaces and pre-built components, rather than writing code from scratch.

> [!IMPORTANT]
> The Microsoft Sentinel Solution for SAP BTP is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

### Why it's important to monitor BTP activity

While low-code development platforms have become increasingly popular among businesses looking to accelerate their application development processes, there are also security risks that organizations must consider. One key concern is the risk of security vulnerabilities introduced by citizen developers, some of whom may lack the security awareness of traditional pro-dev community. To counter this, it's crucial for organizations to quickly detect and respond to threats on BTP applications.

Beyond the low-code aspect, BTP applications:

- Access very sensitive business data, such as customers, opportunities, orders, financial data, and manufacturing processes.
- Access and integrate with multiple different business applications and data stores​.
- Enable key business processes​.
- Are created by citizen developers who may not be security savvy or aware of cyber threats.
- Used by wide range of users, internal and external​.

Therefore, it's important to protect your BTP system against these risks.

## How the solution addresses BTP security risks

With the Microsoft Sentinel Solution for SAP BTP, you can:

- Gain visibility to activities **on** BTP applications, including creation, modification, permissions change, execution, and more.
- Gain visibility to activities **in** BTP applications, including who uses the application, which business applications the BTP application accesses, business data Create, Read, Update, Delete (CRUD) activities, and more.
- Detect suspicious or illegitimate activities, including suspicious logins, illegitimate changes of application settings and user permission, data exfiltration, bypassing of SOD policies, and more.
- Investigate and respond to threats origination from the BTP application, including finding an application owner, understanding relationships between applications, suspending applications or users, and more.
- Monitor on-prem and SaaS​ SAP environments​.

The solution includes:

- The **SAP BTP** connector, which allows you to connect your BTP sub-account to Microsoft Sentinel via the [Audit Log service for SAP BTP API](https://help.sap.com/docs/btp/sap-business-technology-platform/security-events-logged-by-cf-services). Learn how to [install the solution and data connector](deploy-sap-btp-solution.md).
- **[Built-in analytics rules](sap-btp-security-content.md#built-in-analytics-rules)** for identity management and low-code application development scenarios using the Trust and Authorization Provider and Business Application Studio (BAS) event sources in BTP.
- The **[BTP activity workbook](sap-btp-security-content.md#sap-btp-workbook)**, which provides a dashboard overview of sub-accounts and a grid of identity management events.
  
## Next steps

In this article, you learned about the Microsoft Sentinel solution for SAP BTP.

> [!div class="nextstepaction"]
> [Deploy the Microsoft Sentinel solution for SAP BTP](deploy-sap-btp-solution.md)
