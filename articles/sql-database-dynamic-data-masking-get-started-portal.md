<properties 
   pageTitle="Get started with SQL Database Dynamic Data Masking (Azure portal)" 
   description="How to get started with SQL Database Dynamic Data Masking in the Azure portal" 
   services="sql-database" 
   documentationCenter="" 
   authors="rmca14" 
   manager="jeffreyg" 
   editor="v-romcal"/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services" 
   ms.date="04/02/2015"
   ms.author="nadavh; ronmat; v-romcal; sstein"/>

# Get started with SQL Database Dynamic Data Masking (Azure portal)

> [AZURE.SELECTOR]
- [Dynamic Data Masking - Azure Preview portal](sql-database-dynamic-data-masking-get-started.md)

## Overview

SQL Database Dynamic Data Masking limits sensitive data exposure by masking it to non-privileged users. Dynamic data masking is in preview for Basic, Standard, and Premium service tiers in the V12 version of Azure SQL Database.

Dynamic data masking helps prevent unauthorized access to sensitive data by enabling customers to designate how much of the sensitive data to reveal with minimal impact on the application layer. It’s a policy-based security feature that hides the sensitive data in the result set of a query over designated database fields, while the data in the database is not changed.

For example, a call center support person may identify callers by several digits of their social security number or credit card number, but those data items should not be fully exposed to the support person. A developer can define a masking rule to be applied to each query result that masks all but the last four digits of any social security number or credit card number in the result set. For another example, by using the appropriate data mask to protect personally identifiable information (PII) data, a developer can query production environments for troubleshooting purposes without violating compliance regulations.

## SQL Database Dynamic Data Masking basics

You set up dynamic data masking policy in the Azure portal and complete the setup by using the security-enabled connection string used by the application or other clients that access the database.

> [AZURE.NOTE] To set up dynamic data masking in the Azure Preview portal, see [Get started with SQL Database Dynamic Data Masking (Azure Preview portal)](sql-database-dynamic-data-masking-get-started.md). 

### Dynamic data masking permissions

Dynamic data masking can be configured by the Azure Database admin, server admin, or security officer roles.

### Dynamic data masking policy

* **Privileged logins** - A set of logins that will get the unmasked data in the SQL queries results.
  
* **Masking rules** - A set of rules that define the designated fields that will be masked and the masking function that will be used. The designated fields can be defined using a database table name and column name or using an alias name.

* **Masking by** - Can be done at the source or destination. Masking can be configured at the source level by identifying the **Table** name and the **Column** name, or at the results level by identifying the **Alias** which is used in the query. If you are familiar with the data architecture of your database and want to limit the exposure of all query results, you may prefer a source mask rule. You may add a results mask rule when you want to limit the exposure to query results without analyzing the database data architecture or for a field that may arrive from different sources.  
  
* **Extended restriction** - Limits the exposure of sensitive data, but may adversely affect the functionality of some applications.

>[AZURE.TIP] Use the **Extended restriction** option to restrict access for developers that use a direct access to the database and run SQL queries for troubleshooting purposes.

* **Masking functions** - A set of methods that control the exposure of data for different scenarios.

| Masking Function | Masking Logic |
|----------|---------------|
| **Default**  |**Full masking according to the data types  of the designated fields**<br/><br/>• Use XXXXXXXX or fewer Xs if the size of the field is less than 8 characters for string data types (nchar, ntext, nvarchar).<br/>• Use a zero value for numeric data types (bigint, bit, decimal, int, money, numeric, smallint, smallmoney, tinyint, float, real).<br/>• Use current time for date/time data types (date, datetime2, datetime, datetimeoffset, smalldatetime, time).<br/>• For SQL variant, the default value of the current type is used.<br/>• For XML the document <masked/> is used.<br/>• Use an empty value for special data types (timestamp  table, hierarchyid, GUID, binary, image, varbinary spatial types).
| **Credit card** |**Masking method which exposes the last four digits of the designated fields** and adds a constant string as a prefix in the form of a credit card.<br/><br/>XXXX-XXXX-XXXX-1234|
| **Social security number** |**Masking method which exposes the last two digits of the designated fields** and adds a constant string as a prefix in the form of an American social security number.<br/><br/>XXX-XX-XX12 |
| **Email** | **Masking method which exposes the first letter and the domain** using a constant string as a prefix in the form of an email address.<br/><br/>aXX@XXXX.com |
| **Random number** | **Masking method which generates a random number** according to the selected boundaries and actual data types. If the designated boundaries are equal, then the masking function will be a constant number.<br/><br/>![Navigation pane][Image1] |
| **Custom text** | **Masking method which exposes the first and last letters** and adds a custom padding string in the middle.<br/>prefix[padding]suffix<br/><br/>![Navigation pane][Image2] |

  
<a name="Anchor1"></a>
### Security-enabled connection string

When you set up dynamic data masking Azure gives you a security-enabled connection string for the database. Only clients that use this connection string have their sensitive data masked according to the dynamic data masking policy. You also need to update existing clients (example: applications) to use the new connection string format.

* Original connection string format: <*server name*>.database.windows.net
* Security-enabled connection string: <*server name*>.database.**secure**.windows.net

You can also change the **SECURITY ENABLED ACCESS** setting from **OPTIONAL** to **REQUIRED**, which ensures there is no option to access the database with the original connection string and ignore the dynamic data masking policy. While you are experimenting with dynamic data masking using specific clients (example, a DEV phase application or SSMS), choose **OPTIONAL**. For production, choose **REQUIRED**.<br/><br/>

![Navigation pane][Image3]<br/><br/>

## Set up dynamic data masking for your database using the Azure portal

1. Launch the Azure portal at [https://manage.windowsazure.com](https://manage.windowsazure.com).

2. Click the database you want to mask, and then click the **AUDITING & SECURITY** tab.

3. Under **dynamic data masking**, click **ENABLED** to enable the dynamic data masking feature.  

4. Type the privileged logins that should have access to the unmasked sensitive data.

	>[AZURE.TIP] To make it so the application layer can display sensitive data for application privileged users, add the application login that is being used to query and the database. It’s highly recommended that this list should include a minimal number of logins to minimize exposure of the sensitive data.

	![Navigation pane][Image4]

5. At the bottom of the page in the menu bar, click **Add MASK** to open the masking rule configuration window.

6. Choose **Mask By** to indicate if the masking is done at the source or destination. Masking can be configured at the source level by identifying the **Table** name and the **Column** name, or at the results level by identifying the **Alias** which is used in the query. Please notice that the **Table** name refers to all of the schemas in the database and should not include a schema prefix. If you are familiar with the data architecture of your database and want to limit the exposure of all query results, you may prefer a source mask rule. You may add a results mask rule when you want to limit the exposure to query results without analyzing the database data architecture or for a field that may arrive from different sources.

7. Type the **Table** name and **Column** name, or **Alias** name, to define the designated fields that will be masked.

8. Choose a **MASKING FUNCTION** from the list of sensitive data masking categories.

	![Navigation pane][Image5] 
 	
9. Click **Update** in the data masking rule window to update the set of masking rules in the dynamic data masking policy.

10. Consider selecting **USE EXTENDED RESTRICTIONS** which limits the exposure of sensitive data through ad hoc queries.

11. Click **SAVE** to save the new or updated masking rule.

## Set up dynamic data masking for your database using REST API

See [Operations for Azure SQL Databases](https://msdn.microsoft.com/library/dn505719.aspx).

[Image1]: ./media/sql-database-dynamic-data-masking-get-started-portal/1_DDM_Random_number.png
[Image2]: ./media/sql-database-dynamic-data-masking-get-started-portal/2_DDM_Custom_text.png
[Image3]: ./media/sql-database-dynamic-data-masking-get-started-portal/3_DDM_Current_Preview.png
[Image4]: ./media/sql-database-dynamic-data-masking-get-started-portal/4_DMM_Policy_Classic_Portal.png
[Image5]: ./media/sql-database-dynamic-data-masking-get-started-portal/5_DDM_Add_Masking_Rule_Classic_Portal.png