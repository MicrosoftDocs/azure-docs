---
title: Azure SQL Data Warehouse column-level security | Microsoft Docs
description: Column-Level Security (CLS) enables customers to control access to database table columns based on the user's execution context or their group membership. CLS simplifies the design and coding of security in your application. CLS enables you to implement restrictions on column access. 
services: sql-data-warehouse
author: KavithaJonnakuti
manager: craigg-msft
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.component: manage
ms.date: 06/12/2018
ms.author: kavithaj
ms.reviewer: igorstan, carlrab
---

# Column-level Security 
Column-Level Security (CLS) enables customers to control access to database table columns based on the user's execution context or their group membership.  

CLS simplifies the design and coding of security in your application. CLS enables you to implement restrictions on column access. For example, ensuring that specific users can access only certain columns of a table pertinent to their department. The access restriction logic is located in the database tier rather than away from the data in another application tier. The database applies the access restrictions every time that data access is attempted from any tier. This makes your security system more reliable and robust by reducing the surface area of your overall security system. In addition, this also eliminates the need for introducing views to filter out columns for imposing access restrictions on the users. 

You could implement CLS by using [GRANT](https://docs.microsoft.com/sql/t-sql/statements/grant-transact-sql) T-SQL statement.  

![cls](./media/column-level-security/cls.png)
 
## Syntax 

```sql
GRANT <permission> [ ,...n ] ON    
    [ OBJECT :: ][ schema_name ]. object_name [ ( column [ ,...n ] ) ]   
    TO <database_principal> [ ,...n ]    
    [ WITH GRANT OPTION ]   
    [ AS <database_principal> ]   
<permission> ::=   
     SELECT 
  | UPDATE  
<database_principal> ::=    
       Database_user    
    | Database_role    
    | Database_user_mapped_to_Windows_User    
    | Database_user_mapped_to_Windows_Group    
```

## Example 
The following example shows how to restrict ‘TestUser’ from accessing ‘SSN’ column of ‘Membership’ table: 

```sql
CREATE TABLE Membership   
  (MemberID int IDENTITY PRIMARY KEY,   
   FirstName varchar(100) NULL,   
   SSN char(9) NOT NULL, 
   LastName varchar(100) NOT NULL,   
   Phone varchar(12) NULL,   
   Email varchar(100) NULL);  
```
 
A new user is created and granted SELECT permission on the table. Queries executed as ‘TestUser’ will fail if they include the SSN column: 

```sql
CREATE USER TestUser WITHOUT LOGIN;   
GRANT SELECT ON Membership(MemberID, FirstName, LastName, Phone, Email) TO TestUser;   
EXECUTE AS USER = 'TestUser';   
SELECT * FROM Membership;   
Msg 230, Level 14, State 1, Line 12 

The SELECT permission was denied on the column 'SSN' of the object 'Membership', database 'CLS_TestDW', schema 'dbo'. 
``` 
## Use Cases 
Here are some real-world examples on how CLS can be used: 
- A financial organization wants to restrict access to columns like SSN to a specific set of employees. 
- A health-care company wants to allow nurses to access only a specific set of columns while allowing doctors to access all columns. 
- An IT organization wants to restrict interns from accessing specific columns but give unrestricted access to full-time employees. 