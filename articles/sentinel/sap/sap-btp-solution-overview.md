---
title: Microsoft Sentinel Solution for SAP BTP overview
description: This article introduces the Microsoft Sentinel Solution for SAP BTP.
author: batamig
ms.author: bagol
ms.topic: concept-article
ms.date: 08/08/2024


#Customer intent: As a security analyst, I want to monitor and protect SAP BTP applications so that I can detect and respond to security threats and suspicious activities effectively.

---

# Microsoft Sentinel Solution for SAP BTP overview

SAP BTP is a cloud-based solution that provides a wide range of tools and services for developers to build, run, and manage applications. One of the key features of SAP BTP is its low-code development capabilities. Low-code development allows developers to create applications quickly and efficiently by using visual drag-and-drop interfaces and prebuilt components, rather than writing code from scratch.

The Microsoft Sentinel solution for SAP BTP monitors and protects your SAP Business Technology Platform (BTP) system by collecting audits and activity logs from the BTP infrastructure and BTP based apps, and detecting threats, suspicious activities, illegitimate activities, and more.

## Solution architecture

The following image illustrates how Microsoft Sentinel retrieves the complete BTP's audit log information. The Microsoft Sentinel solution for SAP BTP provides built-in analytics rules and detections for selected scenarios, which you can extend to cover more of the audit log information and events.

:::image type="content" source="media/deploy-sap-btp-solution/sap-btp-solution-overview.png" alt-text="Diagram that shows an SAP BTP landscape integrated with Microsoft Sentinel." lightbox="media/deploy-sap-btp-solution/sap-btp-solution-overview.png" border="false":::


## Why it's important to monitor BTP activity

While low-code development platforms have become increasingly popular among businesses looking to accelerate their application development processes, there are also security risks that organizations must consider. One key concern is the risk of security vulnerabilities introduced by citizen developers, some of whom might lack the security awareness of traditional pro-dev community. To counter these vulnerabilities, it's crucial for organizations to quickly detect and respond to threats on BTP applications.

Beyond the low-code aspect, BTP applications have the following aspects that make them a target for cyber threats:

- **Access sensitive business data**, such as customers, opportunities, orders, financial data, and manufacturing processes.
- **Access and integrate** with multiple different business applications and data stores​.
- **Enable key business processes**​.
- **Are created by citizen developers** who might not be security savvy or aware of cyber threats.
- **Used by wide range of users**, internal and external​.

For more information, see [Nice patch SAP! Revisiting your SAP BTP security measures after AI Core vulnerability fix](https://community.sap.com/t5/technology-blogs-by-members/nice-patch-sap-revisiting-your-sap-btp-security-measures-after-ai-core/ba-p/13770662) (blog).

## How the solution addresses BTP security risks

With the Microsoft Sentinel Solution for SAP BTP, you can:

- Gain visibility to activities **on** BTP applications, including creation, modification, permissions change, execution, and more.
- Gain visibility to activities **in** BTP applications, including who uses the application, which business applications the BTP application accesses, business data Create, Read, Update, Delete (CRUD) activities, and more.
- Detect suspicious or illegitimate activities. The activities include: suspicious logins, illegitimate changes of application settings and user permission, data exfiltration, bypassing of SOD policies, and more.
- Investigate and respond to threats originating from the BTP application: Find an application owner, understand relationships between applications, suspend applications or users, and more.
- Monitor on-premises and SaaS​ SAP environments​.

The solution includes:

- The **SAP BTP** connector, which allows you to connect your BTP subaccounts and global account to Microsoft Sentinel via the [Audit Log service for SAP BTP API](https://help.sap.com/docs/btp/sap-business-technology-platform/security-events-logged-by-cf-services). Learn how to [install the solution and data connector](deploy-sap-btp-solution.md).
- **[Built-in analytics rules](sap-btp-security-content.md#built-in-analytics-rules)** for identity management and low-code application development scenarios using the Trust and Authorization Provider and Business Application Studio (BAS) event sources in BTP.
- The **[BTP activity workbook](sap-btp-security-content.md#sap-btp-workbook)**, which provides a dashboard overview of subaccounts and a grid of identity management events.
  
## Next steps

> [!div class="nextstepaction"]
> [Deploy the Microsoft Sentinel Solution for SAP BTP](deploy-sap-btp-solution.md)
