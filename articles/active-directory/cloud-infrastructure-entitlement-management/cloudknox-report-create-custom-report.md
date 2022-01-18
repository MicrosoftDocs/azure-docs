---
title: Microsoft CloudKnox Permissions Management - Create and view a custom report
description: How to create and view a custom report in the Microsoft CloudKnox Permissions Management.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 01/17/2022
ms.author: v-ydequadros
---

# Create and view a custom report

This topic describes how to create and view a custom report in Microsoft CloudKnox Permissions Management (CloudKnox).

## Create a custom report 

1. From the **Systems Reports** tab, under **Report Name**, select **New Custom Report**.
2. In the **New Custom Report** box, enter a name for your report.
3. From the **Report Based on** list, make a selection, and then select **Next**.

 	- To view which authorization systems the report applies to, hover over each report option.
    - To view a description of the report, select the required option.

4. In the **MyReport** box, select the **Authorization System** you want: Amazon Web Services (AWS), Microsoft Azure (Azure), and Google Cloud Platform (GCP).

    Deselect select the **Authorization System** you want to remove.

5. To add specific users from each authorization system type, select the **Identities** tab.

     - To find users, select each authorization system type. 
     - To find a specific user, select **Search** under **Users**, and add user names.
6. Select the **Report Format** tab and check the following options, if applicable:

	- **Detailed** - Check **CSV** for a detailed report.
	- **Summary** - Check **CSV** or **PDF** for a summary of the report.
	- **Dashboard** - Check **CSV** for a dashboard view of the report.
7. Select the **Schedule** tab and choose from **None** up to **Monthly**.

	For **Hourly** and **Daily** options, you can set the start date by choosing from the **Calendar** dropdown, and can input a specific time of the day they want to receive the report. 

    In addition to date and time, the **Weekly** and **Biweekly** options you to select what day(s)of the week the report should repeat on.

	When you select the time options for the schedule, the **Share With** option appears in the left side bar. 
8. Select the **Share With** tab. 

	The current user's email appears under **Email**, and other email addresses can be added by typing them into the **Search Email to add** box.

	The **User Status** column displays the type of user the email address is associate with. 
    - To remove them from the list, select the **X** to the right of the users name.
9. Select **Save**.

      The following message displays across the top of the screen in green if the download is successful: **Report has been created**.
The report name appears in the **Reports** table.


## View a custom report 

1. To view a list of custom reports, select **Reports**, and then select the **Custom Reports** tab.

    The **Custom Reports** tab displays the following options in the **Reports** table:

    - **Report Name** - The name of the report.
    - **Category** - The type of report: **Permission** or **Compliance**.
    - **Authorization System** - The authorization system in which you can view the report: Amazon Web Services (AWS), Microsoft Azure (Azure), and Google Cloud Platform (GCP).
    - **Format** - The format of the report.

2. To view a report, from the **Report Name** column, select the report you want.
3. To download a report, from the ellipses **(...)** menu, select **Download**.
4. To refresh the list of reports, select **Reload**.

## Search for a custom report 

1. On the **Custom Reports** tab, select **Search**.
2. In the **Search** box, enter the name of the report you want.

    The **Custom Reports** tab displays a list of reports that match your search criteria. 
3. Select the report you want.
4. To download a report, from the ellipses **(...)** menu, select **Download**.
5. To refresh the list of reports, select **Reload**.


## Modify a saved or scheduled report

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

<!---For information about how to view a system report, see [View a system report](cloudknox-report-view-system-report.html).--->
<!---For a list of available system reports, see [List of system reports](cloudknox-all-reports.html).--->
<!---For a detailed overview of available system reports, see [Overview of available system reports}(cloudknox-product-reports.html).--->
<!---For information about how to create and view the Permissions Analytics report, see [The Permissions Analytics report](cloudknox-product-permissions-analytics-reports).--->