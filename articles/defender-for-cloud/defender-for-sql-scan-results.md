---
title: How to consume and export scan results
description: Learn how to consume and export Defender for SQL's scan results.
ms.topic: how-to
ms.date: 05/29/2023
---

# How to consume and export scan results

Defender for SQL's Vulnerability Assessment (VA) ability scans your databases on a weekly basis and produces reports on any misconfigurations that are identified.

The service allows you to enable a built-in email automation or to use an export button that allows you to view the report based on SQL API results without Defender for Cloud's enrichment that's added before pushing the data to Azure Resource Graph Explorer (ARG).

This article describes several ways to consume and export your scan results.

## Query and export findings in ARG with Defender for Cloud

**To query and export your findings with ARG with Defender for Cloud**:

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Navigate to **Microsoft Defender for Cloud** > **Recommendations**.

1. Search for and select `SQL databases should have vulnerability findings resolved`.

1. Select **Open Query**.

1. Select either

    - **Query returning affected resources** - Returns a list of the resources that are currently affected.
    - **Query returning security findings** -  Returns a list of all security findings.

1. Select **Run query**.

1. Select **Download a CSV**, to export your results to a CSV file.

These queries are editable and can be customized to a specific resource, set of findings, findings status or more.

## Query and export findings in ARG

**To query and export your findings with ARG**:

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Navigate to **Resource Graph Explorer**.

1. Edit and enter the following query:

    ```bash
    // All findings status per DB
    let dbresourceid="/subscriptions/<your subscription ID>/resourcegroups/rgname/providers/microsoft.sql/servers/servername/databases/dbname";
    securityresources | where type =~ "microsoft.security/assessments/subassessments"
        | extend assessmentKey=extract(@"(?i)providers/Microsoft.Security/assessments/([^/]*)", 1, id), subAssessmentId=tostring(properties.id), parentResourceId= extract("(.+)/providers/Microsoft.Security", 1, id)
        | extend resourceId = tostring(properties.resourceDetails.id)
        | extend subAssessmentName=tostring(properties.displayName),
            subAssessmentDescription=tostring(properties.description),
            subAssessmentRemediation=tostring(properties.remediation),
            subAssessmentCategory=tostring(properties.category),
            subAssessmentImpact=tostring(properties.impact),
            severity=tostring(properties.status.severity),
            status=tostring(properties.status.code),
            cause=tostring(properties.status.cause),
            statusDescription=tostring(properties.status.description),
            additionalData=tostring(properties.additionalData)
        | where resourceId == dbresourceid
        | where assessmentKey == "82e20e14-edc5-4373-bfc4-f13121257c37"
        | project timeGenerated=todatetime(properties.timeGenerated), assessmentKey, subAssessmentId, subAssessmentName, subAssessmentCategory, severity, status, cause, statusDescription, subAssessmentDescription, subAssessmentRemediation, subAssessmentImpact
    ```
1. Select **Run query**.

1. Select **Download a CSV**, to export your results to a CSV file.

This query is editable and can be customized to a specific resource, set of findings, findings status or more.

## Automate email notifications with LogicApps

Logic App allows you to send a weekly vulnerability report for SQL databases on servers and machines. Once the logic app is triggered, the selected recipients receive an email report for every SQL server (for example, Azure SQL server and SQL server on virtual machines or on-premises) that's connected to Microsoft Defender for Cloud. 

The email report summarizes the weekly vulnerability scan for every database. After a successful deployment, you must authorize Office 365 connector to generate valid access tokens for authenticating your credentials.

Follow [these instructions](https://github.com/Azure/Microsoft-Defender-for-Cloud/tree/main/Workflow%20automation/Notify-SQLVulnerabilityReport), to learn how to use Logic Apps to automate email notifications.

The recipients receive emails with the findings of the scan results.

Sample email SQL PAAS:

:::image type="content" source="media/defender-for-sql-scan-results/sample-email-sql-paas.png" alt-text="Screenshot of a sample PAAS SQL results email.":::

Sample email SQL VM:

:::image type="content" source="media/defender-for-sql-scan-results/sample-email-sql-vm.png" alt-text="Screenshot of a sample virtual machine SQL results email.":::

## Other options

You can use [workflow automations](workflow-automation.md) to trigger actions based on changes to the recommendation's status.

You can also use the [Vulnerability Assessments workbook](defender-for-sql-on-machines-vulnerability-assessment.md) to view an interactive report of your findings. The data from the workbook can be exported, customized and a copy of the workbook can be stored.

You can also enable [Continuous export](continuous-export.md) to stream alerts and recommendations as they're generated or to define a schedule to send periodic snapshots of all of the new data.

## Next steps