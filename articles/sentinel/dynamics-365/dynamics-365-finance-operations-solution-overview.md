---
title: Microsoft Sentinel solution for Dynamics 365 Finance and Operations overview
description: This article introduces the Microsoft Sentinel Solution for Dynamics 365 Finance and Operations.
author: limwainstein
ms.author: lwainstein
ms.topic: conceptual
ms.date: 05/14/2023
---

# Microsoft Sentinel solution for Dynamics 365 Finance and Operations overview

This article introduces the Microsoft Sentinel Solution for Dynamics 365 Finance and Operations. The solution monitors and protects your Dynamics 365 Finance and Operations system: It collects audits and activity logs from the Dynamics 365 Finance and Operations environment, and detects threats, suspicious activities, illegitimate activities, and more.

[Dynamics 365 for Finance and Operations](/dynamics365/finance) is a comprehensive Enterprise Resource Planning (ERP) solution that combines financial and operational capabilities to help businesses manage their day-to-day operations. It offers a range of features that enable businesses to streamline workflows, automate tasks, and gain insights into operational performance.

> [!IMPORTANT]
> - The Microsoft Sentinel Solution for Dynamics 365 Finance and Operations is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> - The solution is a premium offering. Pricing information will be available before the solution becomes generally available.

### Why it's important to monitor Dynamics 365 for Finance and Operations activity

Finance and Operations applications:

- Enable important business processes like finance, procurement, operations, and supply chain.
- Store and process sensitive business data, like payments, orders, account receivables, and suppliers.​
- Are administered by non-security savvy administrators.
- Are used by a wide range of users, internal and external​.
- Integrate with many adjacent systems, both internal and external​.

Therefore, it's important to protect your Finance and Operations system against these risks.

## How the solution addresses Dynamics 365 Finance and Operations security risks

To monitor and detect threats and security risks in Dynamics 365 Finance and operations you need: 

- Visibility to user activities, like user logins and sign-ins, Create, Read, Update, Delete (CRUD) activities, configurations changes, or activities by external applications and APIs. 
- The ability to detect suspicious or illegitimate activities, like suspicious logins, illegitimate changes of settings and user permissions, data exfiltration, or bypassing of SOD policies. 
- The ability to investigate and respond to related incidents, like limiting user access, notifying business admins, or rolling back changes. 

The solution includes:

- A **Dynamics 365 F&O** data connector, which allows you to ingest Dynamics 365 Finance and Operations admin activities and audit logs as well as user business process and application activities logs into Microsoft Sentinel. Learn how to [install the solution and data connector](deploy-dynamics-365-finance-operations-solution.md).
- [**Built-in analytics rules**](dynamics-365-finance-operations-security-content.md) to detect suspicious activity in your Dynamics 365 Finance and Operations environment, like changes in bank account details, multiple user account updates or deletions, suspicious sign-in events, changes to workload identities, and more.
  
## Next steps

In this article, you learned about the Microsoft Sentinel Solution for Dynamics 365 Finance and Operations.

> [!div class="nextstepaction"]
> [Deploy the Microsoft Sentinel Solution for Dynamics 365 Finance and Operations](deploy-dynamics-365-finance-operations-solution.md)