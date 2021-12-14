---
title: Microsoft CloudKnox Permissions Management product reports
description: How to use Microsoft CloudKnox Permissions Management's system reports.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 12/09/2021
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management product reports

Microsoft CloudKnox Permissions Management has various types of system reports available that capture specific sets of data. These reports allow management to:
-  Make timely decisions.
- Analyze trends and system/user performance.
- Identify trends in data and high risk areas so that management can address issues more quickly and improve their efficiency.

## CloudKnox reports

CloudKnox offers the following reports for management associated with the authorization systems noted in parenthesis:

- **Access key entitlements and usage**:
	- **Summary of report:** Provides information about access key - permissions, usage, rotation date, and so on.
	- **Applies to:** Amazon Web Services (AWS) and Microsoft Azure
	- **Report output type:** CSV
	- **Ability to collate report:** Yes
	- **Type of report:** Summary and Detailed
	- **Use cases:** 
		- The access key age, last rotation date, and last usage date is available in the summary report to help with key rotation. 
		- The granted task and PCI score to take the action on the keys. 

- **User entitlements and usage**: 
	- **Summary of report:** Provides information about the identities' permissions - entitlement, usage, PCI, and so on.
	- **Applies to:** AWS, Azure, Google Cloud Platform (GCP), and VCENTER
	- **Report output type:** A comma-separated values (CSV) file
	- **Ability to collate report:** Yes
	- **Type of report:** Summary and Detailed
	- **Use cases:** 
		 - The data displayed on the **Usage Analytics** screen is downloaded as part of the **Summary** report. The user's detailed permissions usage is listed in the Detailed report. 

- **Group entitlements and usage**:
	- **Summary of report:** Provides information about the group's permissions - entitlement, usage, PCI, and so on.
	- **Applies to:** AWS, Azure, GCP, and VCENTER
	- **Report output type:** CSV
	- **Ability to collate report:** Yes
	- **Type of report:** Summary
	- **Use cases:** 
		 - All group level entitlements and permission assignments, PCIs, and the number of members are listed as part of this report. 

- **Identity permissions**:
	- **Summary of report:** Report on identities that have specific permissions, for example, identities that have permission to delete any S3 buckets.
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
		 - This report lists the different key findings in the selected auth systems. The key findings include Super identities, Inactive identities, Over provisioned active identities, storage bucket hygiene, Access key age (AWS), and so on. This report will help administrators in visualizing the findings across the organization. 

	For more information, see Permissions analytics report.

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
		 - Assigned/Unassigned and custom/system policy with the used/unused condition is captured in this report for any specific, or all, AWS accounts. Similar data can be captured for Azure/GCP for the assigned/unassigned roles. 

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
- **Category** - Lists the type of report, for example, **Permission**, **Compliance**, and so on.
- **Authorization System** - Displays which authorizations the custom report applies to.
- **Format** - Displays the output format the report can be generated in, for example, CSV.

    - To download the report, select the menu, select **Download**, and then select **Download**.

      The following message displays across the top of the screen in green if the download is successful: **Successfully Started to Generate On Demand Report**.

## How to view a custom report

- To view the following information, select the **Custom Reports** tab:
     - **Report Name** - Displays the name of the report.
     - **Category** - Describes the type of report, for example, **Permission**, **Compliance**, and so on.
     - **Authorization Systems** - Displays which authorizations the custom report applies to.
     - **Format** - Displays the output format the report can be generated in, for example, CSV.
     - **Schedule** - Displays the date and time the next report will be generated.
     - **Next On** - Displays the date the next custom report will be generated on.


## How to create a new custom report

1. Select **New Custom Report**.

 	The **New Custom Report** box opens.
2. Enter a name for the new report in the **Report Name** box.
3. Select an option from the **Report Based on** list.

 	- To view which authorization systems the report applies to, hover over each report option.
    - To view a description of the report, select the required option.
4. Select **Next**.
5. Under the **Authorization Systems** tab, select the appropriate authorization system type (AWS, Azure, GCP, and vCenter), and check or uncheck the appropriate authorization system under the applicable authorization system type.

	Use **Search** to find an authorization system.
6. To add specific users from each authorization system type, select the **Identities** tab.

     - To find users, select each authorization system type. 
     - To find a specific user, select **Search** under **Users**, and add user names.
7. Select the **Report Format** tab and check the following options, if applicable:
	- **Detailed** - Check **CSV** for a detailed report.
	- **Summary** - Check **CSV** or **PDF** for a summary of the report.
	- **Dashboard** - Check **CSV** for a dashboard view of the report.
8. Select the **Schedule** tab and choose from **None** up to **Monthly**.

	For **Hourly** and **Daily** options, you can set the start date by choosing from the **Calendar** dropdown, and can input a specific time of the day they want to receive the report. 

    In addition to date and time, the **Weekly** and **Biweekly** options you to select what day(s)of the week the report should repeat on.

	When you select the time options for the schedule, the **Share With** option appears in the left side bar. 
9. Select the **Share With** tab. 

	The current user's email appears under **Email**, and other email addresses can be added by typing them into the **Search Email to add** box.

	The **User Status** column displays the type of user the email address is associate with. 
    - To remove them from the list, select the **X** to the right of the users name.
10. Select **Save**.

      The following message displays across the top of the screen in green if the download is successful: **Report has been created**.
11. To view the report, select **Custom Reports**.

## How to make changes to a saved or scheduled report

1. Hover over the report name on the **Custom Reports** tab.

	- To rename the report. select the **Pencil** icon and enter a new name.

	- To update the report settings, select the **Gear** icon.

		 Select this option to return to the Report interface as described in creating a new custom report. You can make any necessary updates and save the changes.

	- To download a copy of the report, select the **Down arrow** icon.
2. To perform actions to the report and select from the following options, select the ellipses (**...**) icon:

	 Reports not created by the current user are listed as **Duplicate**.

	- **Download** - Downloads a copy of the report.

	- **Report Settings** - Displays the settings on the report, including scheduling, authorization system type, and so on.

	- **Duplicate** - Creates a duplicate of the report called **"Copy of XXX"**

		 After selecting **Duplicate**, a pop-up box appears asking if the user is sure they want to create a duplicate. Select **Confirm**.

         **Report generated successfully** appears across the top of the screen in green if successfully duplicated.

	- **API Settings** - Download the report using API.

		 When this option is selected, **API Settings** window opens and displays **Report ID** and **Secret Key**. Select **Generate New Key**.

	- **Delete** - Select this option to delete the report.

		 After selecting **Delete**, a pop-up box appears asking if the user is sure they want to delete the report. Select **Confirm**. 

        **Report is deleted successfully** appears across the top of the screen in green if successfully deleted.

	- **Unsubscribe** - Unsubscribe the user from receiving scheduled reports and notifications.

		 This option is only available after a report has been scheduled.

<!---## Next steps--->