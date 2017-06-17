
<a name="cs_0_csharpprogramexample_h2"/>
## C# program example

This section presents a C# program that uses ADO.NET to send Transact-SQL statements to the SQL database. The program performs the following action sequence:

1. [Connects to our SQL database, by using ADO.NET](#cs_1_connect).
    - The database product can be either Microsoft SQL Server, or our cloud version of it named Azure SQL Database.
2. [Creates temporary tables](#cs_2_createtemptables).
    - You have the option of editing the T-SQL to remove the leading **#**, to create the tables in your own database instead of in **tempdb**. The tables would persist until you drop them.
3. [Populates the tables with data, by issuing T-SQL INSERT statements](#cs_3_insert).
4. [Updates data by use of a join](#cs_4_updatejoin).
5. [Deletes data by use of a join](#cs_5_deletejoin).
6. [Selects data rows by use of a join](#cs_6_selectrows).
7. Closes the connection, which causes the database system to drop the temporary tables from tempdb.

The C# program contains:

- C# code to connect to the database.
- Methods that return the T-SQL source code.
- Two methods that submit the T-SQL to the database.
    - Optionally, you can copy and paste the T-SQL code into SQL Server Management Studio (SSMS), and then submit the T-SQL to the database.

#### One program logically, several blocks physically

This C# program is logically one .cs file. But here the program is physically divided into several code blocks, to make each block easier to see and understand. You can recreate the .cs file by copy and pasting each block into a file, in the same sequence that the blocks are presented here.

#### To compile

You can compile and run this C# program. The following minor tasks would be required:

- Edit the **Main** method, to assign actual values to **cb.DataSource** and to the other connection properties.
- Reference the assembly **System.Data.dll**.


<a name="cs_1_connect"/>
### C# block 1: Connect by using ADO.NET

- [Next](#cs_2_createtemptables)


```csharp
using System;
using System.Data.SqlClient;   // System.Data.dll 
//using System.Data;           // For:  SqlDbType , ParameterDirection

namespace csharp_db_test
{
   class Program
   {
      static void Main(string[] args)
      {
         try
         {
            var cb = new SqlConnectionStringBuilder();
            cb.DataSource = "your_server.database.windows.net";
            cb.UserID = "your_user";
            cb.Password = "your_password";
            cb.InitialCatalog = "your_database";

            using (var connection = new SqlConnection(cb.ConnectionString))
            {
               connection.Open();

               Submit_Tsql_NonQuery(connection, "2 - Create-Temp-Tables",
                  Build_2_Tsql_CreateTempTables());

               Submit_Tsql_NonQuery(connection, "3 - Inserts",
                  Build_3_Tsql_Inserts());

               Submit_Tsql_NonQuery(connection, "4 - Update-Join",
                  Build_4_Tsql_UpdateJoin(),
                  "@csharpParmDepartmentName", "Accounting");

               Submit_Tsql_NonQuery(connection, "5 - Delete-Join",
                  Build_5_Tsql_DeleteJoin(),
                  "@csharpParmDepartmentName", "Legal");

               Submit_6_Tsql_SelectEmployees(connection);
            }
         }
         catch (SqlException e)
         {
            Console.WriteLine(e.ToString());
         }
      }
```


<a name="cs_2_createtemptables"/>
### C# block 2: T-SQL to create the temporary tables

- [Previous](#cs_1_connect) &nbsp; / &nbsp; [Next](#cs_3_insert)

The leading **#** in front of the table names makes them be *temporary* tables, and they are created in the **tempdb** database. For our demonstration purposes, the temporary aspect is handy. This temporary aspect spares us from creating a database we can pollute, and from worrying about cleaning up after the demo. 


```csharp
      static string Build_2_Tsql_CreateTempTables()
      {
         return @"
DROP TABLE IF EXISTS #tabEmployee;
DROP TABLE IF EXISTS #tabDepartment;  -- Drop parent table last.


CREATE TABLE #tabDepartment
(
   DepartmentCode  nchar(4)          not null
      PRIMARY KEY,
   DepartmentName  nvarchar(128)     not null
);

CREATE TABLE #tabEmployee
(
   EmployeeGuid    uniqueIdentifier  not null  default NewId()
      PRIMARY KEY,
   EmployeeName    nvarchar(128)     not null,
   EmployeeLevel   int               not null,
   DepartmentCode  nchar(4)              null
      --REFERENCES #tabDepartment (DepartmentCode) -- REF disallowed on #temp tables.
);
";
      }
```

#### Entity Relationship Diagram (ERD)

The preceding CREATE TABLE statements involve the **REFERENCES** keyword to create a *foreign key* (FK) relationship between two tables.  In our case the `--REFERENCES` keyword is commented out by a pair of leading dashes, only because REFERENCES is not supported in the special case of temporary tables. Regardless, everything else in this demo about the tables, the data, and the joining is exactly the same in respecting the foreign key.

Next is an ERD that displays the relationship between the two tables. The values in the #tabEmployee.DepartmentCode *child* column are limited to the values present in the #tabDepartment.Department *parent* column.

![ERD showing foreign key](./media/sql-database-csharp-adonet-create-query-2/erd-dept-empl-fky-2.png)


<a name="cs_3_insert"/>
### C# block 3: T-SQL to insert data

- [Previous](#cs_2_createtemptables) &nbsp; / &nbsp; [Next](#cs_4_updatejoin)


```csharp
      static string Build_3_Tsql_Inserts()
      {
         return @"
-- The company has these departments.
INSERT INTO #tabDepartment
   (DepartmentCode, DepartmentName)
      VALUES
   ('acct', 'Accounting'),
   ('hres', 'Human Resources'),
   ('legl', 'Legal');

-- The company has these employees, each in one department.
INSERT INTO #tabEmployee
   (EmployeeName, EmployeeLevel, DepartmentCode)
      VALUES
   ('Alison'  , 19, 'acct'),
   ('Barbara' , 17, 'hres'),
   ('Carol'   , 21, 'acct'),
   ('Deborah' , 24, 'legl'),
   ('Elle'    , 15, null);
";
      }
```


<a name="cs_4_updatejoin"/>
### C# block 4: T-SQL to update-join

- [Previous](#cs_3_insert) &nbsp; / &nbsp; [Next](#cs_5_deletejoin)


```csharp
      static string Build_4_Tsql_UpdateJoin()
      {
         return @"
DECLARE @DName1  nvarchar(128) = @csharpParmDepartmentName;  --'Accounting';


-- Promote everyone in one department (see @parm...).
UPDATE empl
   SET
      empl.EmployeeLevel += 1
   FROM
      #tabEmployee   as empl
      INNER JOIN
      #tabDepartment as dept ON dept.DepartmentCode = empl.DepartmentCode
   WHERE
      dept.DepartmentName = @DName1;
";
      }
```


<a name="cs_5_deletejoin"/>
### C# block 5: T-SQL to delete-join

- [Previous](#cs_4_updatejoin) &nbsp; / &nbsp; [Next](#cs_6_selectrows)


```csharp
      static string Build_5_Tsql_DeleteJoin()
      {
         return @"
DECLARE @DName2  nvarchar(128);
SET @DName2 = @csharpParmDepartmentName;  --'Legal';


-- Right size the Legal department.
DELETE empl
   FROM
      #tabEmployee   as empl
      INNER JOIN
      #tabDepartment as dept ON dept.DepartmentCode = empl.DepartmentCode
   WHERE
      dept.DepartmentName = @DName2

-- Disband the Legal department.
DELETE #tabDepartment
   WHERE DepartmentName = @DName2;
";
      }
```



<a name="cs_6_selectrows"/>
### C# block 6: T-SQL to select rows

- [Previous](#cs_5_deletejoin) &nbsp; / &nbsp; [Next](#cs_6b_datareader)


```csharp
      static string Build_6_Tsql_SelectEmployees()
      {
         return @"
-- Look at all the final Employees.
SELECT
      empl.EmployeeGuid,
      empl.EmployeeName,
      empl.EmployeeLevel,
      empl.DepartmentCode,
      dept.DepartmentName
   FROM
      #tabEmployee   as empl
      LEFT OUTER JOIN
      #tabDepartment as dept ON dept.DepartmentCode = empl.DepartmentCode
   ORDER BY
      EmployeeName;
";
      }
```


<a name="cs_6b_datareader"/>
### C# block 6b: ExecuteReader

- [Previous](#cs_6_selectrows) &nbsp; / &nbsp; [Next](#cs_7_executenonquery)

This method is designed to run the T-SQL SELECT statement that is built by the **Build_6_Tsql_SelectEmployees** method.


```csharp
      static void Submit_6_Tsql_SelectEmployees(SqlConnection connection)
      {
         Console.WriteLine();
         Console.WriteLine("=================================");
         Console.WriteLine("Now, SelectEmployees (6)...");

         string tsql = Build_6_Tsql_SelectEmployees();

         using (var command = new SqlCommand(tsql, connection))
         {
            using (SqlDataReader reader = command.ExecuteReader())
            {
               while (reader.Read())
               {
                  Console.WriteLine("{0} , {1} , {2} , {3} , {4}",
                     reader.GetGuid(0),
                     reader.GetString(1),
                     reader.GetInt32(2),
                     (reader.IsDBNull(3)) ? "NULL" : reader.GetString(3),
                     (reader.IsDBNull(4)) ? "NULL" : reader.GetString(4));
               }
            }
         }
      }
```


<a name="cs_7_executenonquery"/>
### C# block 7: ExecuteNonQuery

- [Previous](#cs_6b_datareader) &nbsp; / &nbsp; [Next](#cs_8_output)

This method is called for operations that modify the data content of tables without returning any data rows.


```csharp
      static void Submit_Tsql_NonQuery(
         SqlConnection connection,
         string tsqlPurpose,
         string tsqlSourceCode,
         string parameterName = null,
         string parameterValue = null
         )
      {
         Console.WriteLine();
         Console.WriteLine("=================================");
         Console.WriteLine("T-SQL to {0}...", tsqlPurpose);

         using (var command = new SqlCommand(tsqlSourceCode, connection))
         {
            if (parameterName != null)
            {
               command.Parameters.AddWithValue(  // Or, use SqlParameter class.
                  parameterName,
                  parameterValue);
            }
            int rowsAffected = command.ExecuteNonQuery();
            Console.WriteLine(rowsAffected + " = rows affected.");
         }
      }
   } // EndOfClass
}
```


<a name="cs_8_output"/>
### C# block 8: Actual test output to the console

- [Previous](#cs_7_executenonquery)

This section captures the output that the program sent to the console. Only the guid values vary between test runs.


```text
[C:\csharp_db_test\csharp_db_test\bin\Debug\]
>> csharp_db_test.exe

=================================
Now, CreateTempTables (10)...

=================================
Now, Inserts (20)...

=================================
Now, UpdateJoin (30)...
2 rows affected, by UpdateJoin.

=================================
Now, DeleteJoin (40)...

=================================
Now, SelectEmployees (50)...
0199be49-a2ed-4e35-94b7-e936acf1cd75 , Alison , 20 , acct , Accounting
f0d3d147-64cf-4420-b9f9-76e6e0a32567 , Barbara , 17 , hres , Human Resources
cf4caede-e237-42d2-b61d-72114c7e3afa , Carol , 22 , acct , Accounting
cdde7727-bcfd-4f72-a665-87199c415f8b , Elle , 15 , NULL , NULL

[C:\csharp_db_test\csharp_db_test\bin\Debug\]
>>
```
