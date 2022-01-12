---
title: Microsoft CloudKnox Permissions Management - Overview of available system report types
description: An overview of available system report types in Microsoft CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 01/11/2022
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management - Overview of available system report types

Microsoft CloudKnox Permissions Management (CloudKnox) has various types of system report types available that capture specific sets of data. These reports allow management to:

- Make timely decisions.
- Analyze trends and system/user performance.
- Identify trends in data and high risk areas so that management can address issues more quickly and improve their efficiency.

## Available system reports

CloudKnox offers the following reports for management associated with the authorization systems noted in parenthesis:

- **Access key entitlements and usage**:
	- **Summary of report:** Provides information about access key - permissions, usage, rotation date, and so on.
	- **Applies to:** Amazon Web Services (AWS) and Microsoft Azure
	- **Report output type:** CSV
	- **Ability to collate report:** Yes
	- **Type of report:** Summary and Detailed
	- **Use cases:** 
		- The access key age, last rotation date, and last usage date is available in the summary report to help with key rotation.
		- The granted task and PCI score to take action on the keys.

- **User entitlements and usage**: 
	- **Summary of report:** Provides information about the identities' permissions: entitlement, usage, PCI, and so on.
	- **Applies to:** AWS, Azure, Google Cloud Platform (GCP), and VCENTER
	- **Report output type:** A comma-separated values (CSV) file
	- **Ability to collate report:** Yes
	- **Type of report:** Summary and Detailed
	- **Use cases:** 
		 - The data displayed on the **Usage Analytics** screen is downloaded as part of the **Summary** report. The user's detailed permissions usage is listed in the **Detailed** report.

- **Group entitlements and usage**:
	- **Summary of report:** Provides information about the group's permissions: entitlement, usage, PCI, and so on.
	- **Applies to:** AWS, Azure, GCP, and VCENTER
	- **Report output type:** CSV
	- **Ability to collate report:** Yes
	- **Type of report:** Summary
	- **Use cases:** 
		 - All group level entitlements and permission assignments, PCIs, and the number of members are listed as part of this report. 

- **Identity permissions**:
	- **Summary of report:** Report on identities that have specific permissions. For example, identities that have permission to delete any S3 buckets.
	- **Applies to:** AWS, Azure, GCP, VCENTER
	- **Report output type:** CSV
	- **Ability to collate report:** No
	- **Type of report:** Summary
	- **Use cases:** 
		 - Any task usage or specific task usage via User/Group/Role/App can be tracked with this report.

- **Identity privilege activity report** 
	- **Summary of report:** Provides information about permission changes that have occurred in the selected duration.
	- **Applies to:** AWS, Azure, GCP, VCENTER
	- **Report output type:** PDF
	- **Ability to collate report:** No
	- **Type of report:** Summary
	- **Use cases:** 
		- Any identity permission change can be captured using this report. 
		- The **Identity Privilege Activity** report has the following main sections: **User Summary**, **Group Summary**, **Role Summary**, and **Delete Task Summary**. 
		- The **User** summary lists the current granted permissions and high-risk permissions and resources accessed in 1 day, 7 days, or 30 days. There are subsections for newly added or deleted users, users with PCI change, and High-risk active/inactive users. 
		- The **Group** summary lists the administrator level groups with the current granted permissions and high-risk permissions and resources accessed in 1 day, 7 days, or 30 days. There are subsections for newly added or deleted groups, groups with PCI change, and High-risk active/inactive groups.
		- The **Role summary** lists similar details as Group Summary. 
		- The **Delete Task summary** section lists the number of times the **Delete task** has been executed in the given time period. 

- **Permissions analytics report** 
	- **Summary of report:** Provides information about the violation of key security best practices.
	- **Applies to:** AWS, Azure, GCP, VCENTER
	- **Report output type:** CSV
	- **Ability to collate report:** Yes
	- **Type of report:** Detailed
	- **Use cases:** 
		 - This report lists the different key findings in the selected auth systems. The key findings include super identities, inactive identities, over provisioned active identities, storage bucket hygiene, access key age (for AWS only), and so on. The report helps administrators to visualize the findings across the organization. 

	<!---For more information, see Permissions analytics report.--->

- **CIS Benchmarks** 
	- **Summary of report:** Provides results of CIS Benchmarks.
	- **Applies to:** AWS, Azure, GCP, VCENTER
	- **Report output type:** CSV and PDF
	- **Ability to collate report:** Yes
	- **Type of report:** Summary, Detailed, and Dashboard
	- **Use cases:** 
		-  The **Dashboard** report tracks the overall progress of the CIS benchmark, and lists the percentage passing, overall pass/fail of test control and the break up of L1/L2 per authorization system. 
		- The **Summary** report for each authorization system lists the test control pass/fail per authorization system, and the number of resources evaluated per test control.
		- The **Detailed** report helps auditors/administrators track the resource level pass/fail per test control.

- **NIST 800-53** 
	- **Summary of report:** Provides results of NIST 500-53 compliance controls.
	- **Applies to:** AWS, Azure, GCP, VCENTER
	- **Report output type:** CSV and PDF
	- **Ability to collate report:** Yes
	- **Type of report:** Summary, Detailed, and Dashboard
	- **Use cases:** 
		-  The **Dashboard** report tracks the overall progress of NIST 800-53, and lists the percentage passing, overall pass/fail of test control and the break up of L1/L2 per authorization system. 
		- The **Summary** report for each authorization system lists the test control pass/fail per authorization system, and the number of resources evaluated per test control.
		- The **Detailed** report helps auditors/administrators track the resource level pass/fail per test control.

- **Well-Architected Framework** 
	- **Summary of report:** Provides results of Well-Architected Framework security pillar recommendations.
	- **Applies to:** AWS
	- **Report output type:** CSV and PDF
	- **Ability to collate report:** Yes
	- **Type of report:** Summary, Detailed, and Dashboard
	- **Use Cases:** 
		- The **Dashboard** report tracks the overall progress of the **Well-Architected Framework**, and lists the percentage passing, overall pass/fail of test control and the break up of L1/L2 per authorization system. 
		- The **Summary** report for each authorization system lists the test control pass/fail per authorization system, and the number of resources evaluated per test control.
		- The **Detailed** report helps auditors/administrators track the resource level pass/fail per test control.

- **Role/Policy Details**
	- **Summary of report:** Provides information about roles and policies.
	- **Applies to:** AWS, Azure, GCP
	- **Report output type:** CSV
	- **Ability to collate report:** No
	- **Type of report:** Summary
	- **Use cases:** 
		 - Assigned/Unassigned, custom/system policy, and the used/unused condition is captured in this report for any specific, or all, AWS accounts. Similar data can be captured for Azure/GCP for the assigned/unassigned roles.

- **PCI DSS**
	- **Summary of report:** Provides results of PCI DSS security pillar recommendations.
	- **Applies to:** AWS, Azure, GCP
	- **Report output type:** CSV 
	- **Ability to collate report:** Yes
	- **Type of report:** Summary, Detailed, and Dashboard
	- **Use cases:** 
		- The **Dashboard** report tracks the overall progress of PCI DSS, and lists the percentage passing, overall pass/fail of test control and the break up of L1/L2 per authorization system. 
		- The **Summary** report for each authorization system lists the test control pass/fail per authorization system, and the number of resources evaluated per test control.
		- The **Detailed** report helps auditors/administrators track the resource level pass/fail per test control.

- **PCI History**
	- **Summary of report:** Provides a report of PCI history.
	- **Applies to:** AWS, Azure, GCP
	- **Report output type:** CSV
	- **Ability to collate report:** Yes
	- **Type of report:** Summary
	- **Use cases:** 
		 - This report plots the trend of the PCI by displaying the monthly PCI history for each authorization system.

- **All Permissions for Identity** 
	- **Summary of report:** Provides results of all permissions for identities.
	- **Applies to:** AWS, Azure, GCP
	- **Report output type:** CSV
	- **Ability to collate report:** Yes
	- **Type of report:** Detailed
	- **Use cases:** 
		 - This report lists all the assigned permissions for the selected identities. 

## How to read the Reports dashboard

The reports dashboard provides a table of information with both System Reports and Custom Reports. The **Reports** page defaults to the **System Reports** tab, which has the following details:

- **Report Name** - Lists the name of the report.
- **Category** - Lists the type of report. For example, **Permission**, **Compliance**, and so on.
- **Authorization System** - Displays which authorizations the custom report applies to.
- **Format** - Displays the output format the report can be generated in. For example, CSV.

    - To download the report, select the menu, select **Download**.

      The following message displays across the top of the screen in green if the download is successful: **Successfully Started to Generate On Demand Report**.

## How to view a custom report

- To view the following information, select the **Custom Reports** tab:
     - **Report Name** - Displays the name of the report.
     - **Category** - Describes the type of report. For example, **Permission**, **Compliance**, and so on.
     - **Authorization Systems** - Displays which authorizations the custom report applies to.
     - **Format** - Displays the output format for the report, for example, CSV.
     - **Schedule** - Displays the date and time the next report will be generated.
     - **Next On** - Displays the date the next custom report will be generated on.




<!---## Next steps--->

<!---For information about how to view a system report, see [View a system report](cloudknox-report-view-system-report.html).--->
<!---For information about how to create and view a custom report, see [Create and view a custom report](cloudknox-report-create-custom-report.html).--->
<!---For a list of available system reports, see [List of system reports](cloudknox-all-reports.html).--->
<!---For information about how to create and view the Permissions Analytics report, see [The Permissions Analytics report](cloudknox-product-permissions-analytics-reports).--->
