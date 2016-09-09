<properties
   pageTitle="Row-level security with Power BI Embedded"
   description="Details about row-level security with Power BI Embedded"
   services="power-bi-embedded"
   documentationCenter=""
   authors="minewiskan"
   manager="NA"
   editor=""
   tags=""/>
<tags
   ms.service="power-bi-embedded"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="powerbi"
   ms.date="07/05/2016"
   ms.author="owend"/>

# Row level security with Power BI Embedded

Row level security (RLS) can be used to restrict user access to particular data within a report or dataset, allowing for multiple different users to use the same report while all seeing different data. Power BI Embedded now supports datasets configured with RLS.

![](media\power-bi-embedded-rls\pbi-embedded-rls-flow-1.png)

In order to take advantage of RLS, it’s important you understand three main concepts; Users, Roles, and Rules. Let’s take a closer look at each:

**Users** –  These are the actual end-users viewing reports. In Power BI Embedded, users are identified by the username property in an App Token.

**Roles** – Users belong to roles. A role is a container for rules and can be named something like “Sales Manager” or “Sales Rep”. In Power BI Embedded, users are identified by the roles property in an App Token.

**Rules** – Roles have rules, and those rules are the actual filters that are going to be applied to the data. This could be as simple as “Country = USA” or something much more dynamic.

### Example

For the rest of this article, we’ll provide an example of authoring RLS, and then consuming that within an embedded application. Our example uses the [Retail Analysis Sample](http://go.microsoft.com/fwlink/?LinkID=780547) PBIX file.

![](media\power-bi-embedded-rls\pbi-embedded-rls-scenario-2.png)

Our Retail Analysis sample shows sales for all the stores in a particular retail chain. Without RLS, no matter which district manager signs in and views the report, they’ll see the same data. Senior management has determined each district manager should only see the sales for the stores they manage, and to do this, we can use RLS.

RLS is authored in Power BI Desktop. When the dataset and report are opened, we can switch to diagram view to see the schema:

![](media\power-bi-embedded-rls\pbi-embedded-rls-diagram-view-3.png)

Here are a few things to notice with this schema:

-	All measures, like **Total Sales**, are stored in the **Sales** fact table.
-	There are four additional related dimension tables: **Item**, **Time**, **Store**, and **District**.
-	The arrows on the relationship lines indicate which way filters can flow from one table to another. For example, if a filter is placed on **Time[Date]**, in the current schema it would only filter down values in the **Sales** table. No other tables would be affected by this filter since all of the arrows on the relationship lines point to the sales table and not away.
-	The **District** table indicates who the manager is for each district:

    ![](media\power-bi-embedded-rls\pbi-embedded-rls-district-table-4.png)

Based on this schema, if we apply a filter to the **District Manager** column in the District table, and if that filter matches the user viewing the report, that filter will also filter down the **Store** and **Sales** tables to only show data for that particular district manager.

Here’s how:

1.	On the Modeling tab, click **Manage Roles**.  
![](media\power-bi-embedded-rls\pbi-embedded-rls-modeling-tab-5.png)

2.	Create a new role called **Manager**.  
![](media\power-bi-embedded-rls\pbi-embedded-rls-manager-role-6.png)

3.	In the **District** table enter the following DAX expression: **[District Manager] = USERNAME()**  
![](media\power-bi-embedded-rls\pbi-embedded-rls-manager-role-7.png)

4.	To make sure the rules are working, on the **Modeling** tab, click **View as Roles**, and then enter the following:  
![](media\power-bi-embedded-rls\pbi-embedded-rls-view-as-roles-8.png)

    The reports will now show data as if you were signed in as **Andrew Ma**.

Applying the filter, the way we did here, will filter down all records in the **District**, **Store**, and **Sales** tables. However, because of the filter direction on the relationships between **Sales** and **Time**, **Sales** and **Item**, and **Item** and **Time** tables will not be filtered down.

![](media\power-bi-embedded-rls\pbi-embedded-rls-diagram-view-9.png)

That may be ok for this requirement, however, if we don’t want managers to see items for which they don’t have any sales, we could turn on bidirectional cross-filtering for the relationship and flow the security filter in both directions. This can be done by editing the relationship between **Sales** and **Item**, like this:

![](media\power-bi-embedded-rls\pbi-embedded-rls-edit-relationship-10.png)

Now, filters can also flow from the Sales table to the **Item** table:

![](media\power-bi-embedded-rls\pbi-embedded-rls-diagram-view-11.png)

**Note** If you're using DirectQuery mode for your data, you will need to enable bidirectional-cross filtering by selecting these two options:

1.	**File** -> **Options and Settings** -> **Preview Features** -> **Enable cross filtering in both directions for DirectQuery**.
2.	**File** -> **Options and Settings** -> **DirectQuery** -> **Allow unrestricted measure in DirectQuery mode**.


To learn more about bidirectional cross-filtering, download the [Bidirectional cross-filtering in SQL Server Analysis Services 2016 and Power BI Desktop](http://download.microsoft.com/download/2/7/8/2782DF95-3E0D-40CD-BFC8-749A2882E109/Bidirectional cross-filtering in Analysis Services 2016 and Power BI.docx) whitepaper.

This wraps up all the work that needs to be done in Power BI Desktop, but there’s one more piece of work that needs to be done to make the RLS rules we defined work in Power BI Embedded. Users are authenticated and authorized by your application and App tokens are used to grant that user access to a specific Power BI Embedded report. Power BI Embedded doesn’t have any specific information on who your user is. For RLS to work, you’ll need to pass some additional context as part of your app token:
-	**username** (optional) – Used with RLS this is a string that can be used to help identify the user when applying RLS rules. See Using Row Level Security with Power BI Embedded
-	**roles** – A string containing the roles to select when applying Row Level Security rules. If passing more than one role, they should be passed as a string array.

If the username property is present, you must also pass at least one value in roles.

The full app token will look something like this:

![](media\power-bi-embedded-rls\pbi-embedded-rls-app-token-string-12.png)

Now, with all the pieces together, when someone logs into our application to view this report, they’ll only be able to see the data that they are allowed to see, as defined by our row-level security.

![](media\power-bi-embedded-rls\pbi-embedded-rls-dashboard-13.png)

## See also
[Row-level security (RLS) with Power](https://powerbi.microsoft.com/en-us/documentation/powerbi-admin-rls/)
