---
title: "Azure Analysis Services tutorial supplemental lesson: Dynamic security | Microsoft Docs"
description: Describes how to use dynamic security by using row filters in the Azure Analysis Services tutorial.
services: analysis-services
documentationcenter: ''
author: minewiskan
manager: erikre
editor: ''
tags: ''

ms.assetid: 
ms.service: analysis-services
ms.devlang: NA
ms.topic: get-started-article
ms.tgt_pltfrm: NA
ms.workload: na
ms.date: 05/26/2017
ms.author: owend
---
# Supplemental lesson - Dynamic security

[!INCLUDE[analysis-services-appliesto-aas-sql2017-later](../../../includes/analysis-services-appliesto-aas-sql2017-later.md)]

In this supplemental lesson, you create an additional role that implements dynamic security. Dynamic security provides row-level security based on the user name or login id of the user currently logged on. 
  
To implement dynamic security, you add a table to your model containing the user names of those users that can connect to the model and browse model objects and data. The model you create using this tutorial is in the context of Adventure Works; however, to complete this lesson, you must add a table containing users from your own domain. You do not need the passwords for the user names that are added. To create an EmployeeSecurity table, with a small sample of users from your own domain, you use the Paste feature, pasting employee data from an Excel spreadsheet. In a real-world scenario, the table containing user names would typically be a table from an actual database as a data source; for example, a real DimEmployee table.  
  
To implement dynamic security, you use two DAX functions: [USERNAME Function (DAX)](http://msdn.microsoft.com/22dddc4b-1648-4c89-8c93-f1151162b93f) and [LOOKUPVALUE Function (DAX)](http://msdn.microsoft.com/73a51c4d-131c-4c33-a139-b1342d10caab). These functions, applied in a row filter formula, are defined in a new role. By using the LOOKUPVALUE function, the formula specifies a value from the EmployeeSecurity table. The formula then passes that value to the USERNAME function, which specifies the user name of the user logged on belongs to this role. The user can then browse only data specified by the role’s row filters. In this scenario, you specify that sales employees can only browse Internet sales data for the sales territories in which they are a member.  
  
Those tasks that are unique to this Adventure Works tabular model scenario, but would not necessarily apply to a real-world scenario are identified as such. Each task includes additional information describing the purpose of the task.  
  
Estimated time to complete this lesson: **30 minutes**  
  
## Prerequisites  
This supplemental lesson topic is part of a tabular modeling tutorial, which should be completed in order. Before performing the tasks in this supplemental lesson, you should have completed all previous lessons.  
  
## Add the DimSalesTerritory table to the AW Internet Sales Tabular Model Project  
To implement dynamic security for this Adventure Works scenario, you must add two additional tables to your model. The first table you add is DimSalesTerritory (as Sales Territory) from the same AdventureWorksDW database. You later apply a row filter to the SalesTerritory table that defines the particular data the logged on user can browse.  
  
#### To add the DimSalesTerritory table  
  
1.  In Tabular Model Explorer > **Data Sources**, right-click your connection, and then click **Import New Tables**.  

    If the Impersonation Credentials dialog box appears, type the impersonation credentials you used in Lesson 2: Add Data.
  
2.  In Navigator, select the **DimSalesTerritory** table, and then click **OK**.    
  
3.  In Query Editor, click the **DimSalesTerritory** query, and then remove **SalesTerritoryAlternateKey** column.  
  
7.  Click **Import**.  
  
    The new table is added to the model workspace. Objects and data from the source DimSalesTerritory table are then imported into your AW Internet Sales Tabular Model.  
  
9. After the table has been imported successfully, click **Close**.  

## Add a table with user name data  
The DimEmployee table in the AdventureWorksDW sample database contains users from the AdventureWorks domain. Those user names do not exist in your own environment. You must create a table in your model that contains a small sample (at least three) of actual users from your organization. You then add these users as members to the new role. You do not need the passwords for the sample user names, but you do need actual Windows user names from your own domain.  
  
#### To add an EmployeeSecurity table  
  
1.  Open Microsoft Excel, creating a worksheet.  
  
2.  Copy the following table, including the header row, and then paste it into the worksheet.  

    ```
      |EmployeeId|SalesTerritoryId|FirstName|LastName|LoginId|  
      |---------------|----------------------|--------------|-------------|------------|  
      |1|2|<user first name>|<user last name>|\<domain\username>|  
      |1|3|<user first name>|<user last name>|\<domain\username>|  
      |2|4|<user first name>|<user last name>|\<domain\username>|  
      |3|5|<user first name>|<user last name>|\<domain\username>|  
    ```

3.  Replace the first name, last name, and domain\username with the names and login ids of three users in your organization. Put the same user on the first two rows, for EmployeeId 1, showing this user belongs to more than one sales territory. Leave the EmployeeId and SalesTerritoryId fields as they are.  
  
4.  Save the worksheet as **SampleEmployee**.  
  
5.  In the worksheet, select all the cells with employee data, including the headers, then right-click the selected data, and then click **Copy**.  
  
6.  In SSDT, click the **Edit** menu, and then click **Paste**.  
  
    If Paste is grayed out, click any column in any table in the model designer window, and try again.  
  
7.  In the **Paste Preview** dialog box, in **Table Name**, type **EmployeeSecurity**.  
  
8.  In **Data to be pasted**, verify the data includes all the user data and headers from the SampleEmployee worksheet.  
  
9. Verify **Use first row as column headers** is checked, and then click **Ok**.  
  
    A new table named EmployeeSecurity with employee data copied from the SampleEmployee worksheet is created.  
  
## Create relationships between FactInternetSales, DimGeography, and DimSalesTerritory table  
The FactInternetSales, DimGeography, and DimSalesTerritory table all contain a common column, SalesTerritoryId. The SalesTerritoryId column in the DimSalesTerritory table contains values with a different Id for each sales territory.  
  
#### To create relationships between the FactInternetSales, DimGeography, and the DimSalesTerritory table  
  
1.  In Diagram View, in the **DimGeography** table, click, and hold on the **SalesTerritoryId** column, then drag the cursor to the **SalesTerritoryId** column in the **DimSalesTerritory** table, and then release.  
  
2.  In the **FactInternetSales** table, click, and hold on the **SalesTerritoryId** column, then drag the cursor to the **SalesTerritoryId** column in the **DimSalesTerritory** table, and then release.  
  
    Notice the Active property for this relationship is False, meaning it's inactive. The FactInternetSales table already has another active relationship.  
  
## Hide the EmployeeSecurity Table from client applications  
In this task, you hide the EmployeeSecurity table, keeping it from appearing in a client application’s field list. Keep in-mind that hiding a table does not secure it. Users can still query EmployeeSecurity table data if they know how. To secure the EmployeeSecurity table data, preventing users from being able to query any of its data, you apply a filter in a later task.  
  
#### To hide the EmployeeSecurity table from client applications  
  
-   In the model designer, in Diagram View, right-click the **Employee** table heading, and then click **Hide from Client Tools**.  
  
## Create a Sales Employees by Territory user role  
In this task, you create a user role. This role includes a row filter defining which rows of the DimSalesTerritory table are visible to users. The filter is then applied in the one-to-many relationship direction to all other tables related to DimSalesTerritory. You also apply a filter that secures the entire EmployeeSecurity table from being queryable by any user that is a member of the role.  
  
> [!NOTE]  
> The Sales Employees by Territory role you create in this lesson restricts members to browse (or query) only sales data for the sales territory to which they belong. If you add a user as a member to the Sales Employees by Territory role that also exists as a member in a role created in [Lesson 11: Create Roles](../tutorials/aas-lesson-11-create-roles.md), you get a combination of permissions. When a user is a member of multiple roles, the permissions, and row filters defined for each role are cumulative. That is, the user has the greater permissions determined by the combination of roles.  
  
#### To create a Sales Employees by Territory user role  
  
1.  In SSDT, click the **Model** menu, and then click **Roles**.  
  
2.  In **Role Manager**, click **New**.  
  
    A new role with the None permission is added to the list.  
  
3.  Click the new role, and then in the **Name** column, rename the role to **Sales Employees by Territory**.  
  
4.  In the **Permissions** column, click the dropdown list, and then select the **Read** permission.  
  
5.  Click the **Members** tab, and then click **Add**.  
  
6.  In the **Select User or Group** dialog box, in **Enter the object named to select**, type the first sample user name you used when creating the EmployeeSecurity table. Click **Check Names** to verify the user name is valid, and then click **Ok**.  
  
    Repeat this step, adding the other sample user names you used when creating the EmployeeSecurity table.  
  
7.  Click the **Row Filters** tab.  
  
8.  For the **EmployeeSecurity** table, in the **DAX Filter** column, type the following formula:  
  
    ```
      =FALSE()  
    ```
  
    This formula specifies that all columns resolve to the false Boolean condition. No columns for the EmployeeSecurity table can be queried by a member of the Sales Employees by Territory user role.  
  
9. For the **DimSalesTerritory** table, type the following formula:  

    ```  
    ='Sales Territory'[Sales Territory Id]=LOOKUPVALUE('Employee Security'[Sales Territory Id], 
      'Employee Security'[Login Id], USERNAME(), 
      'Employee Security'[Sales Territory Id], 
      'Sales Territory'[Sales Territory Id]) 
    ```
  
    In this formula, the LOOKUPVALUE function returns all values for the DimEmployeeSecurity[SalesTerritoryId] column, where the EmployeeSecurity[LoginId] is the same as the current logged on Windows user name, and EmployeeSecurity[SalesTerritoryId] is the same as the DimSalesTerritory[SalesTerritoryId].  
  
    The set of sales territory IDs returned by LOOKUPVALUE is then used to restrict the rows shown in the DimSalesTerritory table. Only rows where the SalesTerritoryID for the row is in the set of IDs returned by the LOOKUPVALUE function are displayed.  
  
10. In Role Manager, click **Ok**.  
  
## Test the Sales Employees by Territory User Role  
In this task, you use the Analyze in Excel feature in SSDT to test the efficacy of the Sales Employees by Territory user role. You specify one of the user names you added to the EmployeeSecurity table and as a member of the role. This user name is then used as the effective user name in the connection created between Excel and the model.  
  
#### To test the Sales Employees by Territory user role  
  
1.  In SSDT, click the **Model** menu, and then click **Analyze in Excel**.  
  
2.  In the **Analyze in Excel** dialog box, in **Specify the user name or role to use to connect to the model**, select **Other Windows User**, and then click **Browse**.  
  
3.  In the **Select User or Group** dialog box, in **Enter the object name to select**, type a user name you included in the EmployeeSecurity table, and then click **Check Names**.  
  
4.  Click **Ok** to close the **Select User or Group** dialog box, and then click **Ok** to close the **Analyze in Excel** dialog box.  
  
    Excel opens with a new workbook. A PivotTable is automatically created. The PivotTable Fields list includes most of the data fields available in your new model.  
  
    Notice the EmployeeSecurity table is not visible in the PivotTable Fields list. You hid this table from client tools in a previous task.  
  
5.  In the **Fields** list, in **∑ Internet Sales** (measures), select the **InternetTotalSales** measure. The measure is entered into the **Values** fields.  
  
6.  Select the **SalesTerritoryId** column from the **DimSalesTerritory** table. The column is entered into the **Row Labels** fields.  
  
    Notice Internet sales figures appear only for the one region to which the effective user name you used belongs. If you select another column, like City from the DimGeography table as Row Label field, only cities in the sales territory to which the effective user belongs are displayed.  
  
    This user cannot browse or query any Internet sales data for territories other than the one they belong to. This restriction is because the row filter defined for the DimSalesTerritory table, in the Sales Employees by Territory user role, secures data for all data related to other sales territories.  
  
## See Also  
[USERNAME Function (DAX)](https://msdn.microsoft.com/library/hh230954.aspx)  
[LOOKUPVALUE Function (DAX)](https://msdn.microsoft.com/library/gg492170.aspx)  
[CUSTOMDATA Function (DAX)](https://msdn.microsoft.com/library/hh213140.aspx)  