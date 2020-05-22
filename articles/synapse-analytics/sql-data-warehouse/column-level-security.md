---
title: What is column-level security for Azure Synapse? 
description: Column-Level Security allows customers to control access to database table columns based on the user's execution context or group membership, simplifying the design and coding of security in your application, and allowing you to implement restrictions on column access.
services: synapse-analytics
author: julieMSFT
manager: craigg
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: 
ms.date: 04/19/2020
ms.author: jrasnick
ms.reviewer: igorstan, carlrab
ms.custom: seo-lt-2019
tags: azure-synapse
---
# Column-level Security

Column-Level Security allows customers to control access to table columns based on the user's execution context or group membership.

> [!VIDEO https://www.youtube.com/embed/OU_ESg0g8r8]
Since this video was posted [Row level Security](/sql/relational-databases/security/row-level-security?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest) became available for Azure Synapse.

Column-level security simplifies the design and coding of security in your application, allowing you to restrict column access to protect sensitive data. For example, ensuring that specific users can access only certain columns of a table pertinent to their department. The access restriction logic is located in the database tier rather than away from the data in another application tier. The database applies the access restrictions every time data access is attempted from any tier. This restriction makes your security more reliable and robust by reducing the surface area of your overall security system. In addition, column-level security also eliminates the need for introducing views to filter out columns for imposing access restrictions on the users.

You could implement column-level security with the [GRANT](/sql/t-sql/statements/grant-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest) T-SQL statement. With this mechanism, both SQL and Azure Active Directory (AAD) authentication are supported.

![cls](./media/column-level-security/cls.png)

## Syntax

```syntaxsql
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

The following example shows how to restrict `TestUser` from accessing the `SSN` column of the `Membership` table:

Create `Membership` table with SSN column used to store social security numbers:

```sql
CREATE TABLE Membership
  (MemberID int IDENTITY,
   FirstName varchar(100) NULL,
   SSN char(9) NOT NULL,
   LastName varchar(100) NOT NULL,
   Phone varchar(12) NULL,
   Email varchar(100) NULL);
```

Allow `TestUser` to access all columns except for the SSN column,  which has the sensitive data:

```sql
GRANT SELECT ON Membership(MemberID, FirstName, LastName, Phone, Email) TO TestUser;
```

Queries executed as `TestUser` will fail if they include the SSN column:

```sql
SELECT * FROM Membership;

-- Msg 230, Level 14, State 1, Line 12
-- The SELECT permission was denied on the column 'SSN' of the object 'Membership', database 'CLS_TestDW', schema 'dbo'.
```

## Use Cases

Some examples of how column-level security is being used today:

- A financial services firm allows only account managers to have access to customer social security numbers (SSN), phone numbers, and other personally identifiable information (PII).
- A health care provider allows only doctors and nurses to have access to sensitive medical records while preventing members of the billing department from viewing this data.
