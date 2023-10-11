---
title: View a list and description of all system reports available in Permissions Management reports
description: View a list and description of all system reports available in Permissions Management.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: overview
ms.date: 06/13/2023
ms.author: jfields
---

# View a list and description of system reports

Microsoft Entra Permissions Management has various types of system reports that capture specific sets of data. These reports allow management, auditors, and administrators to:

- Make timely decisions.
- Analyze trends and system/user performance.
- Identify trends in data and high risk areas so that management can address issues more quickly and improve their efficiency.

This article provides you with a list and description of the system reports available in Permissions Management. Depending on the report, you can download it in comma-separated values (**CSV**) format, portable document format (**PDF**), or Microsoft Excel Open XML Spreadsheet (**XLSX**) format.

## Download a system report

1. In the Permissions Management home page, select the **Reports** tab, and then select the **Systems Reports** subtab.
1. In the **Report Name** column, find the report you want, and then select the down arrow to the right of the report name to download the report.

    Or, from the ellipses **(...)** menu, select **Download**.

    The following message displays: **Successfully Started To Generate On Demand Report.**


## Summary of available system reports

| Report name                | Type of the report                | File format              | Description               | Availability                | Collated report?                 |
|----------------------------|-----------------------------------|--------------------------|---------------------------| ----------------------------|----------------------------------|
| Access Key Entitlements and Usage Report                | Summary </p>Detailed                | CSV                 | This report displays: </p> - Access key age, last rotation date, and last usage date availability in the summary report. Use this report to decide when to rotate access keys. </p> - Granted task and Permissions creep index (PCI) score. This report provides supporting information when you want to take the action on the keys.                | AWS</p>Azure</p>GCP                 | Yes      |
| All Permissions for Identity                 | Summary                 | CSV                | This report lists all the assigned permissions for the selected identities.                | AWS</p>Azure</p>GCP            | N/A      |
| Group Entitlements and Usage       | Summary                | CSV                | This report tracks all group level entitlements and the permission assignment, PCI. The number of members is also listed as part of this report.                 | AWS</p>Azure</p>GCP                 | Yes      |
| Identity Permissions                 | Summary                | CSV                 | This report tracks any, or specific, task usage per **User**, **Group**, **Role**, or **App**.                 | AWS</p>Azure</p>GCP                 | N/A      |
| AWS Role Policy Audit       | Detailed | CSV | This report gives the list of AWS roles, which can be assumed by **User**, **Group**, **resource** or **AWS Role**.                | AWS | N/A      |
| Cross Account Access Details| Detailed                 | CSV                 | This report helps track **User**, **Group** from other AWS accounts have cross account access to the specified AWS account.                | AWS                | N/A      |
| PCI History                 | Summary                 | CSV                 | This report helps track **Monthly PCI History** for each authorized system. It can be used to plot the trend of the PCI.                 | AWS</p>Azure</p>GCP                 | Yes      |
| Permissions Analytics Report (PAR)  |     Detailed                 | XSLX, PDF                 | This report lists the different key findings in the selected authorized systems. The key findings include **Super identities**, **Inactive identities**, **Over-provisioned active identities**, **Storage bucket hygiene**, **Access key age (AWS)**, and so on. </p>This report helps administrators to visualize the findings across the organization and make decisions.                    | AWS</p>Azure</p>GCP                | Yes for XSLX     |
| Role/Policy Details                 | Summary                 | CSV                | This report captures **Assigned/Unassigned** and **Custom/system policy with used/unused condition** for specific or all AWS accounts. </p>Similar data can be captured for Azure and GCP for assigned and unassigned roles.                | AWS</p>Azure</p>GCP                 | No      |
| User Entitlements and Usage     | Detailed <p>Summary <p> Permissions                | CSV                 | **Summary** This report provides the summary view of all the identities with Permissions Creep Index (PCI), granted and executed tasks per Azure subscription, AWS account, GCP project.     </p>**Detailed** This report provides a detailed view of Azure role assignments, GCP role assignments and AWS policy assignment along with Permissions Creep Index (PCI), tasks used by each identity. </p>**Permissions** This report provides the list of role assignments for Azure, GCP and policy assignments in AWS per identity.                 | AWS</p>Azure</p>GCP                | Yes      |


## Next steps

- For information on how to view system reports in the **Reports** dashboard, see [View system reports in the Reports dashboard](product-reports.md).
- For information about how to create, view, and share a system report, see [Create, view, and share a custom report](report-view-system-report.md).
- For information about how to create and view a custom report, see [Generate and view a custom report](report-create-custom-report.md).
- For information about how to create and view the Permissions analytics report, see [Generate and download the Permissions analytics report](product-permissions-analytics-reports.md).
