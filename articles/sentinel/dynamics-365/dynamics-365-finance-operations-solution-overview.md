---
title: Microsoft Sentinel solution for D365 F&O overview
description: This article introduces the Microsoft Sentinel Solution for Dynamics 365 Finance and Operations (D365 F&O).
author: limwainstein
ms.author: lwainstein
ms.topic: conceptual
ms.date: 05/14/2023
---

# Microsoft Sentinel solution for D365 F&O overview

This article introduces the Microsoft Sentinel Solution for D365 F&O. The solution monitors and protects your Dynamics 365 Finance and Operations system: It collects audits and activity logs from the Dynamics 365 Finance and Operations environment, and detects threats, suspicious activities, illegitimate activities, and more.

[Dynamics 365 for Finance and Operations](/dynamics365/fin-ops-core/fin-ops/) is a comprehensive Enterprise Resource Planning (ERP) solution that combines financial and operational capabilities to help businesses manage their day-to-day operations. It offers a range of features that enable businesses to streamline workflows, automate tasks, and gain insights into operational performance.

> [!IMPORTANT]
> The Microsoft Sentinel Solution for D365 F&O is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

### Why it's important to monitor Dynamics 365 for Finance and Operations activity

While low-code development platforms have become increasingly popular among businesses looking to accelerate their application development processes, there are also security risks that organizations must consider. One key concern is the risk of security vulnerabilities introduced by citizen developers or administrators, some of whom may lack the security awareness of traditional pro-dev community. To counter these vulnerabilities, it's crucial for organizations to quickly detect and respond to threats on Finance and Operations applications.

Beyond the low-code aspect, Finance and Operations applications:

- Enable important business processes like finance, procurement, operations, and supply chain.
- Store and process sensitive business data, like payments, orders, account receivables, and suppliers.​
- Are administered by non-security savvy administrators.
- Are used by a wide range of users, internal and external​.
- Integrate with many adjacent systems, both internal and external​.

Therefore, it's important to protect your Finance and Operations system against these risks.

## How the solution addresses Dynamics 365 Finance and Operations security risks

With the Microsoft Sentinel Solution for D365 F&O, you can:

- Gain visibility to user activities, like user logins and sign-ins, Create, Read, Update, Delete (CRUD) activities, configurations changes, or activities by external applications and APIs.
- Detect suspicious or illegitimate activities, like suspicious logins, illegitimate changes of settings and user permissions, data exfiltration, or bypassing of SOD policies.
- Investigate and respond to related incidents, like limiting user access, notifying business admins, or rolling back changes.
- Monitor and protect a range of Microsoft Business Application environments, including Dynamics 365 Customer Engagement (CE), Dynamics 365 Finance and Operations, Power Apps, Power BI, and more.

The solution includes:

- The **Dynamics 365 F&O** connector, which allows you to stream Dynamics 365 Finance and Operations logs into Microsoft Sentinel, and to enable auditing on the relevant Finance and Operations data tables. Learn how to [install the solution and data connector](deploy-dynamics-365-finance-operations-solution.md).
- [**Built-in analytics rules**](dynamics-365-finance-operations-security-content.md) to detect suspicious activity in your Dynamics 365 Finance and Operations environment, like changes to user accounts, suspicious sign-in events, changes to workload identities, and more.
  
## Next steps

In this article, you learned about the Microsoft Sentinel Solution for D365 F&O.

> [!div class="nextstepaction"]
> [Deploy the Microsoft Sentinel Solution for D365 F&O](deploy-dynamics-365-finance-operations-solution.md)