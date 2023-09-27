---
title: Column-level security for dedicated SQL pool
description: Column-Level Security allows customers to control access to database table columns based on the user's execution context or group membership, simplifying the design and coding of security in your application, and allowing you to implement restrictions on column access.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.date: 09/19/2023
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: conceptual
tags: azure-synapse
---
# Column-level security

Column-Level security allows customers to control access to table columns based on the user's execution context or group membership.

Column-level security simplifies the design and coding of security in your application, allowing you to restrict column access to protect sensitive data. For example, ensuring that specific users can access only certain columns of a table pertinent to their department. The access restriction logic is located in the database tier rather than away from the data in another application tier. The database applies the access restrictions every time data access is attempted from any tier. This restriction makes your security more reliable and robust by reducing the surface area of your overall security system. In addition, column-level security also eliminates the need for introducing views to filter out columns for imposing access restrictions on the users.

You can implement column-level security with the [GRANT Object Permissions](/sql/t-sql/statements/grant-object-permissions-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true) T-SQL syntax. With this mechanism, both SQL authentication and Microsoft Entra ID ([formerly Azure Active Directory](/azure/active-directory/fundamentals/new-name)) authentication are supported.

Consider also the ability to enforce [Row level security](/sql/relational-databases/security/row-level-security?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true) on tables, based on a `WHERE` clause filter.

:::image type="content" source="./media/column-level-security/cls.png" alt-text="Diagram shows a schematic table with the first column headed by a closed padlock and its cells an orange color while the other columns are white cells.":::

## Syntax

The syntax of the `GRANT` statement for object permissions allows for granting permissions to comma-delimited column lists on a table.

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

## Examples

The following example shows how to restrict `TestUser` from accessing the `SSN` column of the `Membership` table:

Create `Membership` table with `SSN` column used to store social security numbers:

```sql
CREATE TABLE Membership
  (MemberID int IDENTITY,
   FirstName varchar(100) NULL,
   SSN char(9) NOT NULL,
   LastName varchar(100) NOT NULL,
   Phone varchar(12) NULL,
   Email varchar(100) NULL);
```

Allow `TestUser` to access all columns *except* for the `SSN` column, which has the sensitive data:

```sql
GRANT SELECT ON Membership(MemberID, FirstName, LastName, Phone, Email) TO TestUser;
```

Queries executed as `TestUser` fail if they include the `SSN` column:

```sql
SELECT * FROM Membership;
```

With the resulting error: 

```output 
Msg 230, Level 14, State 1, Line 12
The SELECT permission was denied on the column 'SSN' of the object 'Membership', database 'CLS_TestDW', schema 'dbo'.
```

## Use cases

Some examples of how column-level security is being used today:

- A financial services firm allows only account managers to have access to customer social security numbers (SSN), phone numbers, and other personal data.
- A health care provider allows only doctors and nurses to have access to sensitive medical records while preventing members of the billing department from viewing this data.

## Next steps

- [GRANT Object Permissions (Transact-SQL)](/sql/t-sql/statements/grant-object-permissions-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true)
- [Row level security](/sql/relational-databases/security/row-level-security?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true)
- [Dynamic Data Masking](/sql/relational-databases/security/dynamic-data-masking?view=azure-sqldw-latest&preserve-view=true)
- [Encrypt a Column of Data](/sql/relational-databases/security/encryption/encrypt-a-column-of-data?view=azure-sqldw-latest&preserve-view=true)
- [Permissions (Database Engine)](/sql/relational-databases/security/permissions-database-engine?view=azure-sqldw-latest&preserve-view=true)