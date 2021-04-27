---
title: Using the regulatory compliance dashboard in Azure Security Center
description: Learn how to add and remove regulatory standards from the regulatory compliance dashboard in Security Center
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: how-to
ms.date: 04/21/2021
ms.author: memildin

---
# Customize the set of standards in your regulatory compliance dashboard

Azure Security Center continually compares the configuration of your resources with requirements in industry standards, regulations, and benchmarks. The **regulatory compliance dashboard** provides insights into your compliance posture based on how you're meeting specific compliance requirements.

> [!TIP]
> Learn more about Security Center's regulatory compliance dashboard in the [frequently asked questions](security-center-compliance-dashboard.md#faq---regulatory-compliance-dashboard).

## How are regulatory compliance standards represented in Security Center?

Industry standards, regulatory standards, and benchmarks are represented in Security Center's regulatory compliance dashboard. Each standard is an initiative defined in Azure Policy.

To see compliance data mapped as assessments in your dashboard, add a compliance standard to your management group or subscription from within the **Security policy** page. To learn more about Azure Policy and initiatives, see [Working with security policies](tutorial-security-policy.md).

When you've assigned a standard or benchmark to your selected scope, the standard appears in your regulatory compliance dashboard with all associated compliance data mapped as assessments. You can also download summary reports for any of the standards that have been assigned.

Microsoft tracks the regulatory standards themselves and automatically improves its coverage in some of the packages over time. When Microsoft releases new content for the initiative, it will appear automatically in your dashboard as new policies mapped to controls in the standard.


## What regulatory compliance standards are available in Security Center?

By default, every subscription has the **Azure Security Benchmark** assigned. This is the Microsoft-authored, Azure-specific guidelines for security and compliance best practices based on common compliance frameworks. [Learn more about Azure Security Benchmark](https://docs.microsoft.com/security/benchmark/azure/introduction).

You can also add standards such as:

- NIST SP 800-53
- SWIFT CSP CSCF-v2020
- UK Official and UK NHS
- Canada Federal PBMM
- Azure CIS 1.3.0
- CMMC Level 3
- New Zealand ISM Restricted

Standards are added to the dashboard as they become available.


## Add a regulatory standard to your dashboard

The following steps explain how to add a package to monitor your compliance with one of the supported regulatory standards.

> [!NOTE]
> To add standards to your dashboard, the subscription must have Azure Defender enabled. Also, only users who are owner or policy contributor have the necessary permissions to add compliance standards. 

1. From Security Center's sidebar, select **Regulatory compliance** to open the regulatory compliance dashboard. Here you can see the compliance standards currently assigned to the currently selected subscriptions.   

1. From the top of the page, select **Manage compliance policies**. The Policy Management page appears.

1. Select the subscription or management group for which you want to manage the regulatory compliance posture. 

    > [!TIP]
    > We recommend selecting the highest scope for which the standard is applicable so that compliance data is aggregated and tracked for all nested resources. 

1. To add the standards relevant to your organization, click **Add more standards**. 

1. From the **Add regulatory compliance standards** page, you can search for any of the available standards, including:

    - **NIST SP 800-53**
    - **NIST SP 800 171**
    - **SWIFT CSP CSCF v2020**
    - **UKO and UK NHS**
    - **Canada Federal PBMM**
    - **HIPAA HITRUST**
    - **Azure CIS 1.3.0**
    - **CMMC Level 3**
    - **New Zealand ISM Restricted**
    
    ![Adding regulatory standards to Azure Security Center's regulatory compliance dashboard](./media/update-regulatory-compliance-packages/dynamic-regulatory-compliance-additional-standards.png)

1. Select **Add** and enter all the necessary details for the specific initiative such as scope, parameters, and remediation.

1. From Security Center's sidebar, select **Regulatory compliance** again to go back to the regulatory compliance dashboard.

    Your new standard appears in your list of Industry & regulatory standards. 

    > [!NOTE]
    > It may take a few hours for a newly added standard to appear in the compliance dashboard.

    :::image type="content" source="./media/security-center-compliance-dashboard/compliance-dashboard.png" alt-text="Regulatory compliance dashboard" lightbox="./media/security-center-compliance-dashboard/compliance-dashboard.png":::

## Remove a standard from your dashboard

If any of the supplied regulatory standards isn't relevant to your organization, it's a simple process to remove them from the UI. This lets you further customize the regulatory compliance dashboard, and focus only on the standards that are applicable to you.

To remove a standard:

1. From Security Center's menu, select **Security policy**.

1. Select the relevant subscription from which you want to remove a standard.

    > [!NOTE]
    > You can remove a standard from a subscription, but not from a management group. 

    The security policy page opens. For the selected subscription, it shows the default policy, the industry and regulatory standards, and any custom initiatives you've created.

    :::image type="content" source="./media/update-regulatory-compliance-packages/remove-standard.png" alt-text="Removing a regulatory standard from your regulatory compliance dashboard in Azure Security Center":::

1. For the standard you want to remove, select **Disable**. A confirmation window appears.

    :::image type="content" source="./media/update-regulatory-compliance-packages/remove-standard-confirm.png" alt-text="Confirm that you really want to remove the regulatory standard you selected":::

1. Select **Yes**. The standard will be removed. 


## Next steps

In this article, you learned how to **add compliance standards** to monitor your compliance with regulatory and industry standards.

For related material, see the following pages:

- [Azure Security Benchmark](https://docs.microsoft.com/security/benchmark/azure/introduction)
- [Security center regulatory compliance dashboard](security-center-compliance-dashboard.md) - Learn how to track and export your regulatory compliance data with Security Center and external tools
- [Working with security policies](tutorial-security-policy.md)