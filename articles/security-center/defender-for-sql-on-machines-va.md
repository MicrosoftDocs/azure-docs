---
title: Understanding security policies, initiatives, and recommendations in Azure Security Center
description: Learn about security policies, initiatives, and recommendations in Azure Security Center.
author: memildin
ms.author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: conceptual
ms.date: 02/24/2021
---
# Using the integrated vulnerability assessment scanner for your SQL servers

## Explore vulnerability assessment reports

The vulnerability assessment service scans your databases once a week. The scans run on the same day of the week on which you enabled the service.

The vulnerability assessment dashboard provides an overview of your assessment results across all your databases, along with a summary of healthy and unhealthy databases, and an overall summary of failing checks according to risk distribution.

You can view the vulnerability assessment results directly from Security Center.

1. From Security Center's sidebar, open the **Recommendations** page.
1. Select the recommendation **Vulnerability assessment findings on your SQL servers on machines should be remediated (Preview)**. For more information, see the [Security Center recommendations reference page](security-center-recommendations.md). 

    :::image type="content" source="./media/security-center-advanced-iaas-data/data-and-storage-sqldb-vulns-on-vm.png" alt-text="Vulnerability Assessment findings on your SQL servers on machines should be remediated (Preview)":::

    The detailed view for this recommendation appears.

    :::image type="content" source="./media/defender-for-sql-on-machines-va/sql-vulnerability-findings.png" alt-text="Detailed view for the recommendation":::

1. For more details, drill down:

    - For an overview of scanned resources (databases) and the list of security checks that were tested, open the **Affected resources** and select the server of interest.

    - For an overview of the vulnerabilities grouped by a specific SQL database, select the database of interest.

    In each view, the security checks are sorted by **Severity**. Select a specific security check to see a details pane with a **Description**, how to **Remediate** it, and other related information such as **Impact** or **Benchmark**.

## Disable specific findings (preview)

If you have an organizational need to ignore a finding, rather than remediate it, you can optionally disable it. Disabled findings don't impact your secure score or generate unwanted noise.

When a finding matches the criteria you've defined in your disable rules, it won't appear in the list of findings. Typical scenarios include:

- Disable findings with severity below medium
- Disable findings that are non-patchable
- Disable findings from benchmarks that aren't of interest for a defined scope

> [!IMPORTANT]
> To create a rule, you need permissions to edit a policy in Azure Policy. Learn more in [Azure RBAC permissions in Azure Policy](../governance/policy/overview.md#azure-rbac-permissions-in-azure-policy).

To create a rule:

1. From the recommendations detail page for **Vulnerability assessment findings on your SQL servers on machines should be remediated**, select **Disable rule**.

1. Select the relevant scope.

1. Define your criteria. You can use any of the following criteria: 
    - Finding ID 
    - Severity 
    - Benchmarks 

    :::image type="content" source="./media/defender-for-sql-on-machines-va/disable-rule-vulnerability-findings-sql.png" alt-text="Create a disable rule for VA findings on SQL servers on machines":::

1. Select **Apply rule**. Changes might take up to 24hrs to take effect.

1. To view, override, or delete a rule: 
    1. Select **Disable rule**.
    1. From the scope list, subscriptions with active rules show as **Rule applied**.
        :::image type="content" source="./media/remediate-vulnerability-findings-vm/modify-rule.png" alt-text="Modify or delete an existing rule":::
    1. To view or delete the rule, select the ellipsis menu ("...").

## Next steps

Learn more about Security Center's protections for SQL resources in [Introduction to Azure Defender for SQL](defender-for-sql-introduction.md).