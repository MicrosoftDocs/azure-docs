---
title: Filter and query user activity in Microsoft Entra Permissions Management
description: How to filter and query user activity in Microsoft Entra Permissions Management.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 06/19/2023
ms.author: jfields
---

# Filter and query user activity

The **Audit** dashboard in Permissions Management details all user activity performed in your authorization system. It captures all high risk activity in a centralized location, and allows system administrators to query the logs. The **Audit** dashboard enables you to:

- Create and save new queries so you can access key data points easily.
- Query across multiple authorization systems in one query.

## Filter information by authorization system

If you haven't used filters before, the default filter is the first authorization system in the filter list.

If you have used filters before, the default filter is last filter you selected.

1. To display the **Audit** dashboard, on the Permissions Management home page, select **Audit**.

1. To select your authorization system type, in the **Authorization System Type** box, select Amazon Web Services (**AWS**), Microsoft Azure (**Azure**), Google Cloud Platform (**GCP**), or Platform (**Platform**).

1. To select your authorization system, in the **Authorization System** box:

    - From the **List** subtab, select the accounts you want to use.
    - From the **Folders** subtab, select the folders you want to use.

1. To view your query results, select **Apply**.

## Create, view, modify, or delete a query

There are several different query parameters you can configure individually or in combination. The query parameters and corresponding instructions are listed in the following sections.

- To create a new query, select **New Query**.
- To view an existing query, select **View** (the eye icon).
- To edit an existing query, select **Edit** (the pencil icon).
- To delete a function line in a query, select **Delete** (the minus sign **-** icon).
- To create multiple queries at one time, select **Add New Tab** to the right of the **Query** tabs that are displayed.

  You can open a maximum number of six query tab pages at the same time. A message appears when you've reached the maximum.

## Create a query with specific parameters

### Create a query with a date

1. In the **New Query** section, the default parameter displayed is **Date In "Last day"**.

    The first-line parameter always defaults to **Date** and can't be deleted.

1. To edit date details, select **Edit** (the pencil icon).

    To view query details, select **View** (the eye icon).

1. Select **Operator**, and then select an option:
    - **In**: Select this option to set a time range from the past day to the past year.
    - **Is**: Select this option to choose a specific date from the calendar.
    - **Custom**: Select this option to set a date range from the **From** and **To** calendars.

1. To run the query on the current selection, select **Search**.

1. To save your query, select **Save**.

    To clear the recent selections, select **Reset**.

### View operator options for identities

The **Operator** menu displays the following options depending on the identity you select in the first dropdown:

- **Is** / **Is Not**: View a list of all available usernames. You can either select or enter a username in the box.
- **Contains** / **Not Contains**: Enter text that the **Username** should or shouldn't contain, for example, *Permissions Management*.
- **In** / **Not In**: View a list all available usernames and select multiple usernames.

### Create a query with a username

1. In the **New query** section, select **Add**.

1. From the menu, select **Username**.

1. From the **Operator** menu, select the required option.

1. To add criteria to this section, select **Add**.

    You can change the operation between **And** / **Or** statements, and select other criteria. For example, the first set of criteria selected can be **Is** with the username **Test**.

1. Select the plus (**+**) sign, select **Or** with **Contains**, and then enter a username, for example, *Permissions Management*.

1. To remove a row of criteria, select **Remove** (the minus sign **-** icon).

1. To run the query on the current selection, select **Search**.

1. To clear the recent selections, select **Reset**.

### Create a query with a resource name

1. In the **New query** section, select **Add**.

1. From the menu, select **Resource Name**.

1. From the **Operator** menu, select the required option.

1. To add criteria to this section, select **Add**.

      You can change the operation between **And** / **Or** statements, and select other criteria. For example, the first set of criteria selected can be **Is** with resource name **Test**.

1. Select the plus (**+**) sign, select **Or** with **Contains**, and then enter a username, for example, *Permissions Management*.

1. To remove a row of criteria, select **Remove** (the minus sign **-** icon).

1. To run the query on the current selection, select **Search**.

1. To clear the recent selections, select **Reset**.

### Create a query with a resource type

1. In the **New Query** section, select **Add**.

1. From the menu, select **Resource Type**.

1. From the **Operator** menu, select the required option.

1. To add criteria to this section, select **Add**.

1. Change the operation between **And** / **Or** statements, and select other criteria. For example, the first set of criteria selected can be **Is** with resource type **s3::bucket**.

1. Select the plus (**+**) sign, select **Or** with **Is**, and then enter or select  `ec2::instance`.

1. To remove a row of criteria, select **Remove** (the minus sign **-** icon).

1. To run the query on the current selection, select **Search**.

1. To clear the recent selections, select **Reset**.


### Create a query with a task name

1. In the **New Query** section, select **Add**.

1. From the menu, select **Task Name**.

1. From the **Operator** menu, select the required option.

1. To add criteria to this section, select **Add**.

1. Change the operation between **And** / **Or** statements, and select other criteria. For example, the first set of criteria selected can be **Is** with task name **s3:CreateBucket**.

1. Select **Add**, select **Or**  with **Is**, and then enter or select `ec2:TerminateInstance`.

1. To remove a row of criteria, select **Remove** (the minus sign **-** icon).

1. To run the query on the current selection, select **Search**.

1. To clear the recent selections, select **Reset**.

### Create a query with a state

1. In the **New Query** section, select **Add**.

1. From the menu, select **State**.

1. From the **Operator** menu, select the required option.

    - **Is** / **Is not**: Allows a user to select in the value field and select **Authorization Failure**, **Error**, or **Success**.

1. To add criteria to this section, select **Add**.

1. Change the operation between **And** / **Or** statements, and select other criteria. For example, the first set of criteria selected can be **Is** with State **Authorization Failure**.

1. Select the **Add** icon, select **Or** with **Is**, and then select **Success**.

1. To remove a row of criteria, select **Remove** (the minus sign **-** icon).

1. To run the query on the current selection, select **Search**.

1. To clear the recent selections, select **Reset**.

### Create a query with a role name

1. In the **New query** section, select **Add**.

2. From the menu, select **Role Name**.

3. From the **Operator** menu, select the required option.

4. To add criteria to this section, select **Add**.

5. Change the operation between **And** / **Or** statements, and select other criteria. For example, the first set of criteria selected can be **Contains** with free text **Test**.

6. Select the **Add** icon, select **Or** with **Contains**, and then enter your criteria, for example *Permissions Management*.

7. To remove a row of criteria, select **Remove** (the minus sign **-** icon).

8. To run the query on the current selection, select **Search**.

9. To clear the recent selections, select **Reset**.

### Create a query with a role session name

1. In the **New Query** section, select **Add**.

2. From the menu, select **Role Session Name**.

3. From the **Operator** menu, select the required option.

4. To add criteria to this section, select **Add**.

5. Change the operation between **And** / **Or** statements, and select other criteria. For example, the first set of criteria selected can be **Contains** with free text **Test**.

6. Select the **Add** icon, select **Or** with **Contains**, and then enter your criteria, for example *Permissions Management*.

7. To remove a row of criteria, select **Remove** (the minus sign **-** icon).

8. To run the query on the current selection, select **Search**.

9. To clear the recent selections, select **Reset**.

### Create a query with an access key ID

1. In the **New Query** section, select **Add**.

2. From the menu, select **Access Key ID**.

3. From the **Operator** menu, select the required option.

4. To add criteria to this section, select **Add**.

5. Change the operation between **And** / **Or** statements, and select other criteria. For example, the first set of criteria selected can be **Contains** with free `AKIAIFXNDW2Z2MPEH5OQ`.

6. Select the **Add** icon, select **Or** with **Not** **Contains**, and then enter `AKIAVP2T3XG7JUZRM7WU`.

7. To remove a row of criteria, select **Remove** (the minus sign **-** icon).

8. To run the query on the current selection, select **Search**.

9. To clear the recent selections, select **Reset**.

### Create a query with a tag key

1. In the **New Query** section, select **Add**.

2. From the menu, select **Tag Key**.

3. From the **Operator** menu, select the required option.

4. To add criteria to this section, select **Add**.

5. Change the operation between **And** / **Or** statements, and select other criteria. For example, the first set of criteria selected can be **Is** and type in, or select **Test**.

6. Select the **Add** icon, select **Or** with **Is**, and then enter your criteria, for example *Permissions Management*.

7. To remove a row of criteria, select **Remove** (the minus sign **-** icon).

8. To run the query on the current selection, select **Search**.

9. To clear the recent selections, select **Reset**.

### Create a query with a tag key value

1. In the **New Query** section, select **Add**.

2. From the menu, select **Tag Key Value**.

3. From the **Operator** menu, select the required option.

4. To add criteria to this section, select **Add**.

5. Change the operation between **And** / **Or** statements, and select other criteria. For example, the first set of criteria selected can be **Is** and type in, or select **Test**.

6. Select the **Add** icon, select **Or** with **Is**, and then enter your criteria, for example *Permissions Management*.

7. To remove a row of criteria, select **Remove** (the minus sign **-** icon).

8. To run the query on the current selection, select **Search**.

9. To clear the recent selections, select **Reset**.

### View query results

1. In the **Activity** table, your query results display in columns.

     The results display all executed tasks that aren't read-only.

1. To sort each column by ascending or descending value, select the up or down arrows next to the column name.

    - **Identity Details**: The name of the identity, for example the name of the role session performing the task.

        - To view the **Raw Events Summary**, which displays the full details of the event, next to the **Name** column, select **View**.

    - **Resource Name**: The name of the resource on which the task is being performed.

        If the column displays **Multiple**, it means multiple resources are listed in the column.

1. To view a list of all resources, hover over **Multiple**.

    - **Resource Type**: Displays the type of resource, for example, *Key* (encryption key) or *Bucket* (storage).
    - **Task Name**: The name of the task performed by the identity.

         An exclamation mark (**!**) next to the task name indicates that the task failed.

    - **Date**: The date when the task was performed.

    - **IP Address**: The IP address from where the user performed the task.

    - **Authorization System**: The authorization system name in which the task was performed.

1. To download the results in comma-separated values (CSV) file format, select **Download**.

## Save a query

1. After you complete your query selections from the **New Query** section, select **Save**.

2. In the **Query Name** box, enter a name for your query, and then select **Save**.

3. To save a query with a different name, select the ellipses (**...**) next to **Save**, and then select **Save As**.

4. Make your query selections from the **New Query** section, select the ellipses (**...**), and then select **Save As**.

5. To save a new query, in the **Save Query** box, enter the name for the query, and then select **Save**.

6. To save an existing query you've modified, select the ellipses (**...**).

      - To save a modified query under the same name, select **Save**.
      - To save a modified query under a different name, select **Save As**.

### View a saved query

1. Select **Saved Queries**, and then select a query from the **Load Queries** list.

      A message box opens with the following options: **Load with the saved authorization system** or **Load with the currently selected authorization system**.

1. Select the appropriate option, and then select **Load Queries**.

1. View the query information:

      - **Query Name**: Displays the name of the saved query.
      - **Query Type**: Displays whether the query is a *System* query or a *Custom* query.
      - **Schedule**: Displays how often a report is generated. You can schedule a one-time report or a monthly report.
      - **Next On**: Displays the date and time the next report will be generated.
      - **Format**: Displays the output format for the report, for example, CSV.
      - **Last Modified On**: Displays the date in which the query was last modified on.

1. To view or set schedule details, select the gear icon, select **Create Schedule**, and then set the details.

   If a schedule has already been created, select the gear icon to open the **Edit Schedule** box.

      - **Repeat**: Sets how often the report should repeat.
      - **Start On**: Sets the date when you want to receive the report.
      - **At**: Sets the specific time when you want to receive the report.
      - **Report Format**: Select the output type for the file, for example, CSV.
      - **Share Report With**: The email address of the user who is creating the schedule is displayed in this field. You can add other email addresses.

1. After selecting your options, select **Schedule**.


### Save a query under a different name

- Select the ellipses (**...**).

    System queries have only one option:

    - **Duplicate**: Creates a duplicate of the query and names the file *Copy of XXX*.

    Custom queries have the following options:

    - **Rename**: Enter the new name of the query and select **Save**.
    - **Delete**: Delete the saved query.

        The **Delete Query** box opens, asking you to confirm that you want to delete the query. Select **Yes** or **No**.

    - **Duplicate**: Creates a duplicate of the query and names it *Copy of XXX*.
    - **Delete Schedule**: Deletes the schedule details for this query.

        This option isn't available if you haven't yet saved a schedule.

        The **Delete Schedule** box opens, asking you to confirm that you want to delete the schedule. Select **Yes** or **No**.


## Export the results of a query as a report

- To export the results of the query, select **Export**.

    Permissions Management exports the results in comma-separated values (**CSV**) format, portable document format (**PDF**), or Microsoft Excel Open XML Spreadsheet (**XLSX**) format.


## Next steps

- For information on how to view how users access information, see [Use queries to see how users access information](ui-audit-trail.md).
- For information on how to create a query, see [Create a custom query](how-to-create-custom-queries.md).
- For information on how to generate an on-demand report from a query, see [Generate an on-demand report from a query](how-to-audit-trail-results.md).
