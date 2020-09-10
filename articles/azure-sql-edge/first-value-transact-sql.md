---
title: FIRST_VALUE (Transact-SQL) - Azure SQL Edge
description: Learn about using FIRST_VALUE in Azure SQL Edge
keywords: FIRST_VALUE, SQL Edge
services: sql-edge
ms.service: sql-edge
ms.topic: reference
author: SQLSourabh
ms.author: sourabha
ms.reviewer: sstein
ms.date: 09/22/2020
---

# FIRST_VALUE (Transact-SQL)

Returns the first value in an ordered set of values.


## Syntax  

```syntaxsql
FIRST_VALUE ( [scalar_expression ] )  [ IGNORE NULLS | RESPECT NULLS ]
    OVER ( [ partition_by_clause ] order_by_clause [ rows_range_clause ] )

```


## Arguments
 *scalar_expression*  
 Is the value to be returned. *scalar_expression* can be a column, subquery, or other arbitrary expression that results in a single value. Other analytic functions are not permitted.  

 [ IGNORE NULLS | RESPECT NULLS ]     
 **Applies to**: Azure SQL Edge
 
 IGNORE NULLS - Ignore null values in the dataset when computing the first value over a partition.     
 RESPECT NULLS - Respect null values in the dataset when computing first value over a partition.     
 
 For more information refer [Imputing missing values](./imputing-missing-values.md).
  
 OVER **(** [ *partition_by_clause* ] *order_by_clause* [ *rows_range_clause* ] **)**  
 *partition_by_clause* divides the result set produced by the FROM clause into partitions to which the function is applied. If not specified, the function treats all rows of the query result set as a single group. *order_by_clause* determines the logical order in which the operation is performed. *order_by_clause* is required. *rows_range_clause* further limits the rows within the partition by specifying start and end points. For more information, see [OVER Clause &#40;Transact-SQL&#41;](/sql/t-sql/queries/select-over-clause-transact-sql/).
  
## Return types  
 Is the same type as *scalar_expression*.
  
## General remarks  
 FIRST_VALUE is nondeterministic. For more information, see [Deterministic and Nondeterministic Functions](/sql/relational-databases/user-defined-functions/deterministic-and-nondeterministic-functions/).  
  
## Examples  
  
### A. Using FIRST_VALUE over a query result set
 The following example uses FIRST_VALUE to return the name of the product that is the least expensive in a given product category.
  
```  
USE AdventureWorks2012;  
GO  
SELECT Name, ListPrice,   
       FIRST_VALUE(Name) OVER (ORDER BY ListPrice ASC) AS LeastExpensive   
FROM Production.Product  
WHERE ProductSubcategoryID = 37;  
```  
  
Here is the result set.
  
```  
  
Name                    ListPrice             LeastExpensive  
----------------------- --------------------- --------------------  
Patch Kit/8 Patches     2.29                  Patch Kit/8 Patches  
Road Tire Tube          3.99                  Patch Kit/8 Patches  
Touring Tire Tube       4.99                  Patch Kit/8 Patches  
Mountain Tire Tube      4.99                  Patch Kit/8 Patches  
LL Road Tire            21.49                 Patch Kit/8 Patches  
ML Road Tire            24.99                 Patch Kit/8 Patches  
LL Mountain Tire        24.99                 Patch Kit/8 Patches  
Touring Tire            28.99                 Patch Kit/8 Patches  
ML Mountain Tire        29.99                 Patch Kit/8 Patches  
HL Road Tire            32.60                 Patch Kit/8 Patches  
HL Mountain Tire        35.00                 Patch Kit/8 Patches  
  
```  
  
### B. Using FIRST_VALUE over partitions  
 The following example uses FIRST_VALUE to return the employee with the fewest number of vacation hours compared to other employees with the same job title. The PARTITION BY clause partitions the employees by job title and the FIRST_VALUE function is applied to each partition independently. The ORDER BY clause specified in the OVER clause determines the logical order in which the FIRST_VALUE function is applied to the rows in each partition. The ROWS UNBOUNDED PRECEDING clause specifies the starting point of the window is the first row of each partition.  
  
```  
USE AdventureWorks2012;   
GO  
SELECT JobTitle, LastName, VacationHours,   
       FIRST_VALUE(LastName) OVER (PARTITION BY JobTitle   
                                   ORDER BY VacationHours ASC  
                                   ROWS UNBOUNDED PRECEDING  
                                  ) AS FewestVacationHours  
FROM HumanResources.Employee AS e  
INNER JOIN Person.Person AS p   
    ON e.BusinessEntityID = p.BusinessEntityID  
ORDER BY JobTitle;  
```  
  
 Here is a partial result set.  
  
```  
  
JobTitle                            LastName                  VacationHours FewestVacationHours  
----------------------------------- ------------------------- ------------- -------------------  
Accountant                          Moreland                  58            Moreland  
Accountant                          Seamans                   59            Moreland  
Accounts Manager                    Liu                       57            Liu  
Accounts Payable Specialist         Tomic                     63            Tomic  
Accounts Payable Specialist         Sheperdigian              64            Tomic  
Accounts Receivable Specialist      Poe                       60            Poe  
Accounts Receivable Specialist      Spoon                     61            Poe  
Accounts Receivable Specialist      Walton                    62            Poe  
```  
  
## Next steps

[Filling time gaps and imputing missing values](imputing-missing-values.md)
[LAST_VALUE (Transact-SQL)](last-value-transact-sql.md)
