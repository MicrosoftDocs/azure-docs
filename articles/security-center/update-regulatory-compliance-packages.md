---
title: How to update to dynamic regulatory compliance monitoring in your Azure Security Center regulatory compliance dashboard | Microsoft Docs
description: Updating your regulatory compliance packages
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: c42d02e4-201d-4a95-8527-253af903a5c6
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/04/2019
ms.author: memildin

---
# Customizing the set of standards in your regulatory compliance dashboard

Azure Security Center continually compares the configuration of your resources with requirements in industry standards, regulations, and benchmarks. The **regulatory compliance dashboard** provides insights into your compliance posture based on how you're meeting specific compliance controls and requirements.


## Overview of compliance packages

Industry standards, regulatory standards, and benchmarks are represented in Security Center as *compliance packages*.  Each package is an initiative defined in Azure Policy. To see compliance data mapped as assessments in your dashboard, add a compliance package to your management group or subscription from within the **Security policy** page. (Learn more about Azure Policy and initiatives in [Working with security policies](tutorial-security-policy.md).)

When you've onboarded a standard or benchmark to your selected scope, it assigns the initiative to the scope and the standard appears in your regulatory compliance dashboard with all associated compliance data mapped as assessments. You can also download summary reports for any of the standards that have been onboarded.

Microsoft also tracks the regulatory standards themselves and automatically improves its coverage in some of the packages over time. When Microsoft releases new content for the initiative (new policies that map to more controls in the standard), the additional content appears automatically in your dashboard.

> [!TIP]
> One standard which improves over time as Microsoft releases new content is **Azure CIS 1.1.0 (new)** (more formally, the [CIS Microsoft Azure Foundations Benchmark version 1.1.0](https://www.cisecurity.org/benchmark/azure/)). You'll need to add this to your dashboard alongside "Azure CIS 1.1.0", the representation of Azure CIS that is configured by default in every Security Center environment. That package relies on a static set of rules. The newer package includes more policies and will automatically update over time. Update to the new dynamic package as described below.


## Available packages

You can add standards such as NIST SP 800-53 R4, SWIFT CSP CSCF-v2020, UK Official and UK NHS, Canada Federal PBMM, and Azure CIS 1.1.0 (new) - a more complete representation of Azure CIS 1.1.0. 

In addition, you can add **Azure Security Benchmark**, the Microsoft-authored, Azure-specific guidelines for security and compliance best practices based on common compliance frameworks. ([Learn more about Azure Security Benchmark](https://docs.microsoft.com/azure/security/benchmarks/introduction).)

Additional standards will be supported in the dashboard as they become available. 


## Adding a regulatory standard to your dashboard

The following steps explain how to add a package to monitor your compliance with one of the supported regulatory standards.

> [!NOTE]
> Only users who are owner or policy contributor have the necessary permissions to add compliance standards. 

1. From Security Center's sidebar, select **Regulatory compliance** to open the regulatory compliance dashboard. Here you can see the compliance standards currently assigned to the currently selected subscriptions.   

1. From the top of the page, select **Manage compliance policies**. The Policy Management page appears.

1. Select the subscription or management group for which you want to manage the regulatory compliance posture. 

    > [!TIP]
    > We recommend selecting the highest scope for which the standard is applicable so that compliance data is aggregated and tracked for all nested resources. 

1. To add the standards relevant to your organization, click **Add more standards**. 

1. From the **Add regulatory compliance standards** page, you can search for packages for any of the available standards. Some of the standards available are:

    - **Azure Security Benchmark**
    - **NIST SP 800-53 R4**
    - **SWIFT CSP CSCF-v2020**
    - **UKO and UK NHS**
    - **Canada PBMM**
    
    ![Adding regulatory packages to Azure Security Center's regulatory compliance dashboard](./media/update-regulatory-compliance-packages/dynamic-regulatory-compliance-additional-standards.png)

1. From Security Center's sidebar, select **Regulatory compliance** again to go back to the regulatory compliance dashboard.
    * Your new standard appears in your list of Industry & regulatory standards. 
    * If you've added **Azure CIS 1.1.0 (New)**, the original *static* view of your Azure CIS 1.1.0 compliance will also remain alongside it. It may be automatically removed in the future.

    > [!NOTE]
    > It may take a few hours for a newly added standard to appear in the compliance dashboard.

    [![Regulatory compliance dashboard showing old and new Azure CIS](media/update-regulatory-compliance-packages/regulatory-compliance-dashboard-with-benchmark-small.png)](media/update-regulatory-compliance-packages/regulatory-compliance-dashboard-with-benchmark.png#lightbox)

## Next steps

In this article, you learned how to **add compliance packages** to monitor your compliance with additional standards. 

For other related material, see the following articles: 

- [Azure Security Benchmark](https://docs.microsoft.com/azure/security/benchmarks/introduction)
- [Security center regulatory compliance dashboard](security-center-compliance-dashboard.md)
- [Working with security policies](tutorial-security-policy.md)