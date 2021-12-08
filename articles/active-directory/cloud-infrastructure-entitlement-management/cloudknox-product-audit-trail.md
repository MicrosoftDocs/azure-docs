---
title: Microsoft CloudKnox Permissions Management audit trail
description: How to use the Microsoft CloudKnox Permissions Management audit trail to view activities performed in the cloud.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 12/08/2021
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management audit trail

Microsoft CloudKnox Permissions Management's audit trail details all user activity performed in the Cloud, capturing high risk activity in a centralized location, and allowing system administrators the ability to query the logs. The audit trail screen provides: 
- The ability to set and save new queries and easily access key data points.
- The functionality to query across multiple authorization systems at once.

## How to filter by the authorization system

1. To view all applicable authorization systems, click **Authorization System**. 

    If you have not used filters before, the default filter is the first authorization system in the filter list. 

    If you have used filters before, the default filter is last filter you selected.

2. To automatically select all options for a single authorization system, next to the authorization system name, click **Only**.

3. To filter by the selection, click **Apply**.

## How to create a new query

There are 11 different query parameters that you can configure individually or in combination with other parameters. The query parameters and corresponding instructions are listed in the following sections.

### Query options

- To create a new query, click **New Query**.
- To view an existing query, click **View**.
- To edit an existing query, click **Edit**.
- To delete a function line in a query, click **Delete**.
- To create multiple queries at one time, click the icon next to the **New Query** tab. 

  You can open a maximum number of 6 query tab pages at the same time. A message will appear when you've reached the maximum.

### How to create a query with a date

1. In the **New Query** section, the default displayed is **DATE IN "Last Day"**.

    The first line item defaults to **Date**. This item cannot be deleted.

2. To edit date details, click **Edit**.

3. Click **Operator**, and then select an option:
    - **In** - Select this option to set a time range from the past day to the past year.
    - **Is** - Select this option to choose a specific date from the calendar.
    - **Custom** - Select this option to set a date range from the **From** and **To** calendars.

4. To search on the current selection, click **Search**. 

5. To clear the recent selections, click **Reset**.

### Operator options

The **Operator** menu contains the following options:

- **Is** / **Is Not** - View a list of all available usernames. You can either select or enter a username in the box.
- **Contains** / **Not Contains** - Enter text that the **Username** should or shouldn't contain, for example, *CloudKnox*.
- **In** / **Not In** - View a list all available usernames and select multiple usernames.

### How to create a query with a username

1. In the **New Query** section, click **Add**.

2. From the menu, select **Username**.

3. From the **Operator** menu, select the required option.

4. To add additional criteria to this section, click **Add**.

    You can change the operation between **And** / **Or** statements, and select additional criteria. For example, the first set of criteria selected can be **Is** with the username **Test**.

5. Click the plus (**+**) sign, select **Or** with **Contains**, and then enter a username, for example, *CloudKnox*.

6. To remove a row of criteria, click **Remove**.

7. To search on the current selection, click **Search**. 

8. To clear the recent selections, click **Reset**.

### How to create a query with a resource name

1. In the **New Query** section, click **Add**.

2. From the menu, select **Resource Name**.

3. From the **Operator** menu, select the required option.

4. To add additional criteria to this section, click **Add**.   

      You can change the operation between **And** / **Or** statements, and select additional criteria. For example, the first set of criteria selected can be **Is** with resource name **Test**. 

5. Click the plus (**+**) sign, select **Or** with **Contains**, and then enter a username, for example, *CloudKnox*. 

6. To remove a row of criteria, click **Remove**.

7. To search on the current selection, click **Search**. 

8. To clear the recent selections, click **Reset**.

### How to create a query with a resource type

1. In the **New Query** section, click **Add**.

2. From the menu, select **Resource Type**.

3. From the **Operator** menu, select the required option.

4. To add additional criteria to this section, click **Add**.

5. Change the operation between **And** / **Or** statements, and select additional criteria. For example, the first set of criteria selected can be **Is** with resource type **s3::bucket**. 

6. Click the plus (**+**) sign, select **Or** with **Is**, and then enter or select  `ec2::instance`. 

7. To remove a row of criteria, click **Remove**.

8. To search on the current selection, click **Search**.

9. To clear the recent selections, click **Reset**.


### How to create a query with a task name

1. In the **New Query** section, click **Add**.

2. From the menu, select **Task Name**.

3. From the **Operator** menu, select the required option.

4. To add additional criteria to this section, click **Add**. 

5. Change the operation between **And** / **Or** statements, and select additional criteria. For example, the first set of criteria selected can be **Is** with task name **s3:CreateBucket**. 

6. Click **Add**, select **Or**  with **Is**, and then enter or select `ec2:TerminateInstance`. 

7. To remove a row of criteria, click **Remove**.

8. To search on the current selection, click **Search**. 

9. To clear the recent selections, click **Reset**.

### How to create a query with a state

1. In the **New Query** section, click **Add**.

2. From the menu, select **State**.

3. From the **Operator** menu, select the required option.

    - **Is** / **Is Not** - Allows a user to click in the value field and select **Authorization Failure**, **Error**, or **Success**.

4. To add additional criteria to this section, click **Add**. 

5. Change the operation between **And** / **Or** statements, and select additional criteria. For example, the first set of criteria selected can be **Is** with State **Authorization Failure**. 

6. Click the **Add** icon, select **Or** with **Is**, and then select **Success**. 

7. To remove a row of criteria, click **Remove**.

8. To search on the current selection, click **Search**. 

9. To clear the recent selections, click **Reset**.

### How to create a query with a role name

1. In the **New Query** section, click **Add**.

2. From the menu, select **Role Name**.

3. From the **Operator** menu, select the required option.

4. To add additional criteria to this section, click **Add**. 

5. Change the operation between **And** / **Or** statements, and select additional criteria. For example, the first set of criteria selected can be **Contains** with free text **Test**. 

6. Click the **Add** icon, select **Or** with **Contains**, and then enter your criteria, for example *CloudKnox*. 

7. To remove a row of criteria, click **Remove**.

8. To search on the current selection, click **Search**. 

9. To clear the recent selections, click **Reset**.

### How to create a query with a role session name

1. In the **New Query** section, click **Add**.

2. From the menu, select **Role Session Name**.

3. From the **Operator** menu, select the required option.

4. To add additional criteria to this section, click **Add**. 

5. Change the operation between **And** / **Or** statements, and select additional criteria. For example, the first set of criteria selected can be **Contains** with free text **Test**. 

6. Click the **Add** icon, select **Or** with **Contains**, and then enter your criteria, for example *CloudKnox*. 

7. To remove a row of criteria, click **Remove**.

8. To search on the current selection, click **Search**. 

9. To clear the recent selections, click **Reset**.

### How to create a query with an access key ID

1. In the **New Query** section, click **Add**.

2. From the menu, select **Access Key ID**.

3. From the **Operator** menu, select the required option.

4. To add additional criteria to this section, click **Add**. 

5. Change the operation between **And** / **Or** statements, and select additional criteria. For example, the first set of criteria selected can be **Contains** with free `AKIAIFXNDW2Z2MPEH5OQ`. 

6. Click the **Add** icon, select **Or** with **Not** **Contains**, and then enter `AKIAVP2T3XG7JUZRM7WU`. 

7. To remove a row of criteria, click **Remove**.

8. To search on the current selection, click **Search**. 

9. To clear the recent selections, click **Reset**.

### How to create a query with a tag key

1. In the **New Query** section, click **Add**.

2. From the menu, select **Tag Key**.

3. From the **Operator** menu, select the required option.

4. To add additional criteria to this section, click **Add**. 

5. Change the operation between **And** / **Or** statements, and select additional criteria. For example, the first set of criteria selected can be **Is** and type in, or select **Test**. 

6. Click the **Add** icon, select **Or** with **Is**, and then enter your criteria, for example *CloudKnox*. 

7. To remove a row of criteria, click **Remove**.

8. To search on the current selection, click **Search**. 

9. To clear the recent selections, click **Reset**.

### How to create a query with a tag key value

1. In the **New Query** section, click **Add**.

2. From the menu, select **Tag Key Value**.

3. From the **Operator** menu, select the required option.

4. To add additional criteria to this section, click **Add**. 

5. Change the operation between **And** / **Or** statements, and select additional criteria. For example, the first set of criteria selected can be **Is** and type in, or select **Test**. 

6. Click the **Add** icon, select **Or** with **Is**, and then enter your criteria, for example *CloudKnox*. 

7. To remove a row of criteria, click **Remove**.

8. To search on the current selection, click **Search**. 

9. To clear the recent selections, click **Reset**.

### How to read query search results

1. In the **Activity** section, your search results display in columns. 

     The results display all executed tasks that are not read-only.

2. To sort each column by ascending or descending value, click the up or down arrows next to the column name.

    - **Username or Role Session Name** - The name of the identity, for example user, AWS resource, Azure Application, GCP Service Account, or the name of the role session performing the task, for example AWS.

        - To view the **Raw Events Summary**, which displays the full details of the event, next to the **Name** column, click **View**.

    - **Resource Name** - The name of the resource on which the task is being performed.

        If the column displays **Multiple**, this means multiple resources are listed in the column. 

3. To view a list of all resources, hover over **Multiple**.

    - **Resource Type** - Displays the type of resource, for example, *Key* (encryption key) or *Bucket* (storage).
    - **Task Name** - The name of the task that was performed by the identity.

         An exclamation mark (**!**) next to the task name indicates that the task failed.

    - **Date** - The date when the task was performed.

    - **IP Address** - The IP address from where the user performed the task.

    - **Authorization System** - The authorization system name in which the task was performed.

4. To download the results in comma-separated values (CSV) file format, click **Download**.

## How to save a query

1. After you complete your query selections from the **New Query** section, click **Save**.

2. In the **Query Name** box, enter a name for your query, and then click **Save**.

3. To save a query with a different name, click the ellipses (**...**) next to **Save**, and then click **Save As**. 

4. Make your query selections from the **New Query** section, click the ellipses (**...**), and then click **Save As**.

5. To save a new query, in the **Save Query** box, enter the name for the query, and then click **Save**.  

      The following message displays in green at the top of the screen to indicate the query was saved successfully: **Saved Query as XXX**.

6. To save an existing query you've modified, click the ellipses (**...**). 

      - To save a modified query under the same name, click **Save**.
      - To save a modified query under a different name, click **Save As**.

### How to view a saved query

1. Click **Saved Queries**, and then select the appropriate option from the list.  

      A message box opens with the following options: **Load with the saved authorization system** or **Load with the currently selected authorization system**. 

2. Select the appropriate option, and then click **Load Query**.

3. View the query information:

      - **Query** - Displays the name of the saved query.
      - **Query Type** - Displays whether the query is a *System* query or a *Custom* query.
      - **Schedule** - Displays how often a report will be generated. This can be a one-time report or a monthly report.
      - **Next On** - Displays the date and time the next report will be generated.
      - **Format** - Displays the output format for the report, for example, CSV.

4. To view or set schedule details, click the gear icon, click **Create Schedule**, and then set the details.

   If a schedule has already been created, click the gear icon to open the **Edit Schedule** box.

      - **Repeats** - Sets how often the report should repeat.
      - **Date** - Sets the date when you want to receive the report.
      - **hh:mm** - Sets the specific time when you want to receive the report.
      - **Report File Format** - Select the output type for the file, for example, CSV.
      - **Share Report with People** - The email address of the user who is creating the schedule is displayed in this field. You can add additional email addresses.

4. After selecting your options, click **Schedule**.

5. To export the results of the query, click the downward facing arrow icon.

6. To make changes to the query and select from the following options, click the ellipses (**...**).  

    System queries only have the option to **Duplicate**.   

      - **Duplicate** - Creates a duplicate of the query and names it *Copy of XXX*.

    Custom queries have the following options: 

      - **Rename** - Enter the new name of the query and click **Save**.
      - **Delete** - Delete the saved query.  

           The **Delete Query** box opens, asking you to confirm that you want to delete the query. Click **Yes** or **No**.

      - **Duplicate** - Creates a duplicate of the query and names it *Copy of XXX*.
      - **Delete Schedule** - Deletes the schedule details for this query.

           This option is not available if you have not yet saved a schedule.

           The **Delete Schedule** box opens, asking you to confirm that you want to delete the schedule. Click **Yes** or **No**.

## Next steps

Links to come.