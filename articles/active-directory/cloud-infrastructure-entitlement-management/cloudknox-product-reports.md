---
title: View an overview of available system report types in Microsoft CloudKnox Permissions Management 
description: How to view an overview of available system report types in Microsoft CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 01/31/2022
ms.author: v-ydequadros
---

# View an overview of available system report types

Microsoft CloudKnox Permissions Management (CloudKnox) has various types of system report types available that capture specific sets of data. These reports allow management to:

- Make timely decisions.
- Analyze trends and system/user performance.
- Identify trends in data and high risk areas so that management can address issues more quickly and improve their efficiency.

## Explore the Reports dashboard

The reports dashboard provides a table of information with both system reports and custom reports. The **Reports** page defaults to the **System reports** tab, which has the following details:

- **Report Name** - Lists the name of the report.
- **Category** - Lists the type of report. For example, **Permission**, **Compliance**, and so on.
- **Authorization System** - Displays which authorizations the custom report applies to.
- **Format** - Displays the output format the report can be generated in. For example, CSV.

    - To download a report, select the menu, select **Download**.

      The following message displays across the top of the screen in green if the download is successful: **Successfully started to generate on demand report**.

## Available system reports

CloudKnox offers the following reports for management associated with the authorization systems noted in parenthesis:

- **Access key entitlements and usage**:
	- **Summary of report**: Provides information about access key - permissions, usage, and rotation date.
	- **Applies to**: Amazon Web Services (AWS) and Microsoft Azure
	- **Report output type**: CSV
	- **Ability to collate report**: Yes
	- **Type of report**: Summary and Detailed
	- **Use cases**: 
		- The access key age, last rotation date, and last usage date is available in the summary report to help with key rotation.
		- The granted task and Permissions creep index (PCI) score to take action on the keys.

- **User entitlements and usage**: 
	- **Summary of report**: Provides information about the identities' permissions: entitlement, usage, and PCI.
	- **Applies to**: AWS, Azure, Google Cloud Platform (GCP), and VCENTER
	- **Report output type**: A comma-separated values (CSV) file
	- **Ability to collate report**: Yes
	- **Type of report**: Summary and Detailed
	- **Use cases**: 
		 - The data displayed on the **Usage Analytics** screen is downloaded as part of the **Summary** report. The user's detailed permissions usage is listed in the **Detailed** report.

- **Group entitlements and usage**:
	- **Summary of report**: Provides information about the group's permissions: entitlement, usage, and PCI.
	- **Applies to**: AWS, Azure, GCP, and VCENTER
	- **Report output type**: CSV
	- **Ability to collate report**: Yes
	- **Type of report**: Summary
	- **Use cases**: 
		 - All group level entitlements and permission assignments, PCIs, and the number of members are listed as part of this report. 

- **Identity permissions**:
	- **Summary of report**: Report on identities that have specific permissions. For example, identities that have permission to delete any S3 buckets.
	- **Applies to**: AWS, Azure, GCP, VCENTER
	- **Report output type**: CSV
	- **Ability to collate report**: No
	- **Type of report**: Summary
	- **Use cases**: 
		 - Any task usage or specific task usage via User/Group/Role/App can be tracked with this report.

- **Identity privilege activity report** 
	- **Summary of report**: Provides information about permission changes that have occurred in the selected duration.
	- **Applies to**: AWS, Azure, GCP, VCENTER
	- **Report output type**: PDF
	- **Ability to collate report**: No
	- **Type of report**: Summary
	- **Use cases**: 
		- Any identity permission change can be captured using this report. 
		- The **Identity Privilege Activity** report has the following main sections: **User Summary**, **Group Summary**, **Role Summary**, and **Delete Task Summary**. 
		- The **User** summary lists the current granted permissions and high-risk permissions and resources accessed in 1 day, 7 days, or 30 days. There are subsections for newly added or deleted users, users with PCI change, and High-risk active/inactive users. 
		- The **Group** summary lists the administrator level groups with the current granted permissions and high-risk permissions and resources accessed in 1 day, 7 days, or 30 days. There are subsections for newly added or deleted groups, groups with PCI change, and High-risk active/inactive groups.
		- The **Role summary** lists similar details as Group Summary. 
		- The **Delete Task summary** section lists the number of times the **Delete task** has been executed in the given time period. 

- **Permissions analytics report** 
	- **Summary of report**: Provides information about the violation of key security best practices.
	- **Applies to**: AWS, Azure, GCP, VCENTER
	- **Report output type**: CSV
	- **Ability to collate report**: Yes
	- **Type of report**: Detailed
	- **Use cases**: 
		 - This report lists the different key findings in the selected auth systems. The key findings include super identities, inactive identities, over provisioned active identities, storage bucket hygiene, and access key age (for AWS only). The report helps administrators to visualize the findings across the organization. 

	<!---For more information, see Permissions analytics report.--->

- **CIS Benchmarks** 
	- **Summary of report**: Provides results of CIS Benchmarks.
	- **Applies to**: AWS, Azure, GCP, VCENTER
	- **Report output type**: CSV and PDF
	- **Ability to collate report**: Yes
	- **Type of report**: Summary, Detailed, and Dashboard
	- **Use cases**: 
		-  The **Dashboard** report tracks the overall progress of the CIS benchmark, and lists the percentage passing, overall pass/fail of test control and the break up of L1/L2 per authorization system. 
		- The **Summary** report for each authorization system lists the test control pass/fail per authorization system, and the number of resources evaluated per test control.
		- The **Detailed** report helps auditors/administrators track the resource level pass/fail per test control.

- **NIST 800-53** 
	- **Summary of report**: Provides results of National Institute of Standards and Technology (NIST) 500-53 compliance controls.
	- **Applies to**: AWS, Azure, GCP, VCENTER
	- **Report output type**: CSV and PDF
	- **Ability to collate report**: Yes
	- **Type of report**: Summary, Detailed, and Dashboard
	- **Use cases**: 
		-  The **Dashboard** report tracks the overall progress of NIST 800-53, and lists the percentage passing, overall pass/fail of test control and the break up of L1/L2 per authorization system. 
		- The **Summary** report for each authorization system lists the test control pass/fail per authorization system, and the number of resources evaluated per test control.
		- The **Detailed** report helps auditors/administrators track the resource level pass/fail per test control.

- **Well-Architected Framework** 
	- **Summary of report**: Provides results of Well-Architected Framework security pillar recommendations.
	- **Applies to**: AWS
	- **Report output type**: CSV and PDF
	- **Ability to collate report**: Yes
	- **Type of report**: Summary, Detailed, and Dashboard
	- **Use Cases**: 
		- The **Dashboard** report tracks the overall progress of the **Well-Architected Framework**, and lists the percentage passing, overall pass/fail of test control and the break up of L1/L2 per authorization system. 
		- The **Summary** report for each authorization system lists the test control pass/fail per authorization system, and the number of resources evaluated per test control.
		- The **Detailed** report helps auditors/administrators track the resource level pass/fail per test control.

- **Role/Policy Details**
	- **Summary of report**: Provides information about roles and policies.
	- **Applies to**: AWS, Azure, GCP
	- **Report output type**: CSV
	- **Ability to collate report**: No
	- **Type of report**: Summary
	- **Use cases**: 
		 - Assigned/Unassigned, custom/system policy, and the used/unused condition is captured in this report for any specific, or all, AWS accounts. Similar data can be captured for Azure/GCP for the assigned/unassigned roles.

- **PCI DSS**
	- **Summary of report**: Provides results of PCI Data Security Standards (DSS) security pillar recommendations.
	- **Applies to**: AWS, Azure, GCP
	- **Report output type**: CSV 
	- **Ability to collate report**: Yes
	- **Type of report**: Summary, Detailed, and Dashboard
	- **Use cases**: 
		- The **Dashboard** report tracks the overall progress of PCI DSS, and lists the percentage passing, overall pass/fail of test control and the break up of L1/L2 per authorization system. 
		- The **Summary** report for each authorization system lists the test control pass/fail per authorization system, and the number of resources evaluated per test control.
		- The **Detailed** report helps auditors/administrators track the resource level pass/fail per test control.

- **PCI History**
	- **Summary of report**: Provides a report of PCI history.
	- **Applies to**: AWS, Azure, GCP
	- **Report output type**: CSV
	- **Ability to collate report**: Yes
	- **Type of report**: Summary
	- **Use cases**: 
		 - This report plots the trend of the PCI by displaying the monthly PCI history for each authorization system.

- **All Permissions for Identity** 
	- **Summary of report**: Provides results of all permissions for identities.
	- **Applies to**: AWS, Azure, GCP
	- **Report output type**: CSV
	- **Ability to collate report**: Yes
	- **Type of report**: Detailed
	- **Use cases**: 
		 - This report lists all the assigned permissions for the selected identities. 




## Next steps

- For a detailed overview of available system reports, see [View a list and description of system reports](cloudknox-all-reports.md).
- For information about how to generate and view a system report, see [Generate and view a system report](cloudknox-report-view-system-report.md).
- For information about how to create and view a custom report, see [Generate and view a custom report](cloudknox-report-create-custom-report.md).
- For information about how to create and view the Permissions analytics report, see [Generate and download the Permissions analytics report](cloudknox-product-permissions-analytics-reports.md).
