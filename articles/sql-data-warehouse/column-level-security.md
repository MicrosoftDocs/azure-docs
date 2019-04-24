---
title: Azure SQL Data Warehouse column-level security | Microsoft Docs
description: Column-Level Security (CLS) enables customers to control access to database table columns based on the user's execution context or their group membership. CLS simplifies the design and coding of security in your application. CLS enables you to implement restrictions on column access.
services: sql-data-warehouse
author: KavithaJonnakuti
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.subservice: security
ms.date: 04/02/2019
ms.author: kavithaj
ms.reviewer: igorstan, carlrab
---

# Column-level Security
Column-Level Security (CLS) enables customers to control access to database table columns based on the user's execution context or their group membership.

> [!VIDEO https://www.youtube.com/embed/OU_ESg0g8r8]

CLS simplifies the design and coding of security in your application. CLS enables you to implement restrictions on column access to protect sensitive data. For example, ensuring that specific users can access only certain columns of a table pertinent to their department. The access restriction logic is located in the database tier rather than away from the data in another application tier. The database applies the access restrictions every time that data access is attempted from any tier. This restriction makes your security system more reliable and robust by reducing the surface area of your overall security system. In addition, CLS also eliminates the need for introducing views to filter out columns for imposing access restrictions on the users.

You could implement CLS with the [GRANT](https://docs.microsoft.com/sql/t-sql/statements/grant-transact-sql) T-SQL statement. With this mechanism, both SQL and Azure Active Directory (AAD) authentication are supported.

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

Create ‘Membership’ table with SSN column used to store social security numbers:

```sql
CREATE TABLE Membership
  (MemberID int IDENTITY,
   FirstName varchar(100) NULL,
   SSN char(9) NOT NULL,
   LastName varchar(100) NOT NULL,
   Phone varchar(12) NULL,
   Email varchar(100) NULL);
```

Allow ‘TestUser’ to access all columns except for SSN column that has sensitive data:

```sql
GRANT SELECT ON Membership(MemberID, FirstName, LastName, Phone, Email) TO TestUser;
```

Queries executed as ‘TestUser’ will fail if they include the SSN column:

```sql
SELECT * FROM Membership;

Msg 230, Level 14, State 1, Line 12
The SELECT permission was denied on the column 'SSN' of the object 'Membership', database 'CLS_TestDW', schema 'dbo'.
```

## Use Cases
Some examples of how CLS is being used today:
- A financial services firm allows only account managers to have access to customer social security numbers (SSN), phone numbers, and other personally identifiable information (PII).
- A health care provider allows only doctors and nurses to have access to sensitive medical records while not allowing members of the billing department to view this data.
