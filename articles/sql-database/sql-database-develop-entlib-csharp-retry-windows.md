<properties 
	pageTitle="EntLib retry to connect to SQL Database | Microsoft Azure"
	description="Enterprise Library is designed to ease several tasks for client programs of cloud services, including the integration of retry logic for transient faults."
	services="sql-database"
	documentationCenter=""
	authors="MightyPen"
	manager="jeffreyg"
	editor="" />


<tags 
	ms.service="sql-database" 
	ms.workload="data-management" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="10/15/2015" 
	ms.author="genemi"/>


# Code sample: Retry logic from Enterprise Library 6, in C&#x23; for connecting to SQL Database


This topic presents a complete code sample that demonstrates the Enterprise Library(EntLib).  EntLib eases many tasks for client programs that interact with cloud services such as Azure SQL Database. Our sample focuses on the important task of including retry logic for transient faults.


EntLib classes are designed to distinguish two categories of run time errors:

- Errors which will never self-correct, such as a misspelled server name.
- Transient faults, such as the server suspending for several seconds its acceptance of new connections, while the Azure system load balances.

Enterprise Library 6 (EntLib60) is the latest version, and was released in April 2013.


## Prerequisites


#### .NET Framework 4.0 or higher


Microsoft .NET Framework 4.0 or higher must be installed. Version 4.6 is available as of this writing, and we recommend the latest.


#### Visual Studio Community edition, is free


You need a way to compile the source code from this sample. One way is to install the [free Microsoft Visual Studio *Community* edition](http://www.visualstudio.com/products/free-developer-offers-vs.aspx).


You might need to register your email address with MSDN. The steps are similar to the following:


1. [Go to MSDN](http://msdn.microsoft.com/).
2. Click **MSDN subscriptions** near the top.
3. Click **Sign up now**.
4. Fill in the form with your information.
5. Click **Create an account** at the bottom.


#### Enterprise Library 6 (EntLib60)


Ways you can install EntLib60:


- Use the *NuGet* package manager feature in Visual Studio:
 - In NuGet, search for **enterpriselibrary**.


- In the [home documentation topic for EntLib60](http://msdn.microsoft.com/library/dn169621.aspx), find the row labeled **Downloads**, and then click [Microsoft Enterprise Library 6](http://go.microsoft.com/fwlink/?linkid=290898) to download the binary .DLL assembly files.


EntLib60 has several .DLL assembly files whose names start with the same prefix **Microsoft.Practices.EnterpriseLibrary.&#x2a;.dll**, but this code sample is only interested in the following two assemblies:

- Microsoft.Practices.EnterpriseLibrary.**TransientFaultHandling**.dll
- Microsoft.Practices.EnterpriseLibrary.**TransientFaultHandling.Data**.dll


## How EntLib classes fit together


EntLib classes are used to construct other EntLib classes. In this code sample, the construction and use sequence is as listed next: 


1. Construct an **ExponentialBackoff** object.
2. Construct an **SqlDatabaseTransientErrorDetectionStrategy** object.
3. Construct a **RetryPolicy** object. Input parameters are:
 - **ExponentialBackoff** object.
 - **SqlDatabaseTransientErrorDetectionStrategy** object.
4. Construct a **ReliableSqlConnection** object. Input parameters are:
 - A **String** object - with server name and the other connection info.
5. Call to connect, made through the **RetryPolicy .ExecuteAction** method.
6. Call the **ReliableSqlConnection .CreateCommand** method.
 - Returns a **System.SqlClient.Data.DbCommand** object, part of ADO.NET.
7. Call to query, made through the **RetryPolicy .ExecuteAction** method.


## Compile and run the code sample


The Program.cs source code sample is given later in this topic. You can compile and run the sample with the following steps:


1. In Visual Studio, create a new project from the C# Console Application template.

2. In the solution Explorer pane, edit the nearly empty Program.cs file by replacing its starter contents with the Program.cs code given later in this topic.

3. Use the Build > Build Solution menu in Visual Studio to compile your project.

4. In a cmd.exe command window, run the program as shown next. Actual output from a run is also shown:


```
[C:\MyVS\EntLib60Retry\EntLib60Retry\bin\Debug\]
>> EntLib60Retry.exe

database_firewall_rules_table   245575913
filestream_tombstone_2073058421 2073058421
filetable_updates_2105058535    2105058535

[C:\MyVS\EntLib60Retry\EntLib60Retry\bin\Debug\]
>>
```


&nbsp;


## Program.cs source code


All the source code for this EntLib sample is contained in the following Program.cs file.


```
using     System;   // C#
using G = System.Collections.Generic;
using D = System.Data;
using C = System.Data.SqlClient;
using X = System.Text;
using H = System.Threading;
using Y = Microsoft.Practices.EnterpriseLibrary.TransientFaultHandling;

namespace EntLib60Retry
{
   class Program
   {
      static void Main(string[] args)
      {
         Program program = new Program();

         if (program.Run(args) == false)
         {
            Console.WriteLine("Something was unable to complete.  :-( ");
         }
      }

      bool Run(string[] _args)
      {
         int retryIntervalSeconds = 10;
         bool returnBool = false;

         this.InitializeEntLibObjects();

         for (int tries = 1; tries <= 3; tries++)
         {
            if (tries > 1)
            {
               H.Thread.Sleep(1000 * retryIntervalSeconds);
               retryIntervalSeconds = Convert.ToInt32(retryIntervalSeconds * 1.5);
            }

            try
            {
               this.reliableSqlConnection = new Y.ReliableSqlConnection(
                  this.sqlConnectionSB.ToString(),
                  null, null    // Letting RetryPolicy.ExecuteAction method handle retries.
                  );
               this.retryPolicy.ExecuteAction(this.OpenTheConnection_action);  // Open the connection.

               this.dbCommand = this.reliableSqlConnection.CreateCommand();
               this.dbCommand.CommandText = @"
SELECT TOP 3
      ob.name,
      CAST(ob.object_id as nvarchar(32)) as [object_id]
   FROM sys.objects as ob
   WHERE ob.type='IT'
   ORDER BY ob.name;";

               // We retry connection .Open after transient faults, but
               // we do not retry commands that use the connection.
               this.IssueTheQuery();  // Run the query, loop through results.

               returnBool = true;
               break;
            }

            catch (C.SqlException sqlExc)
            {
               if (false == this.sqlDatabaseTransientErrorDetectionStrategy.IsTransient(sqlExc))
               {
                  throw sqlExc;
               }
            }
         }
         return returnBool;
      }

      void OpenTheConnection()  // Called by .ExecuteAction.
      {
         this.reliableSqlConnection.Open();
      }

      void IssueTheQuery()      // Called by .ExecuteAction.
      {
         X.StringBuilder sBuilder = new X.StringBuilder(256);

         this.dataReader = this.dbCommand.ExecuteReader();

         while (this.dataReader.Read())
         {
            sBuilder.Length = 0;
            sBuilder.Append(this.dataReader.GetString(0));
            sBuilder.Append("\t");
            sBuilder.Append(this.dataReader.GetString(1));

            Console.WriteLine(sBuilder.ToString());
         }
      }

      void InitializeEntLibObjects()
      {
         this.InitializeSqlConnectionStringBuilder();

         this.exponentialBackoff = new Y.ExponentialBackoff(
            "exponentialBackoff",
             3,                    // Maximum number of times to retry, then let exception bubble up.
             TimeSpan.FromMilliseconds(10000), // Minimum interval between retries.
             TimeSpan.FromMilliseconds(30000), // Maximum interval between retries.
             TimeSpan.FromMilliseconds( 2000)  // For random differences in interval between retries.
            );
         this.sqlDatabaseTransientErrorDetectionStrategy =
            new Y.SqlDatabaseTransientErrorDetectionStrategy();
         this.retryPolicy = new Y.RetryPolicy(
               this.sqlDatabaseTransientErrorDetectionStrategy,
               this.exponentialBackoff
               );
         this.OpenTheConnection_action = delegate() { this.OpenTheConnection(); };
      }

      void InitializeSqlConnectionStringBuilder()
      {
         // Prepare the connection string to Azure SQL Database.
         this.sqlConnectionSB = new C.SqlConnectionStringBuilder();

         // Change these values to your values.
         this.sqlConnectionSB["Server"] = "tcp:myazuresqldbserver.database.windows.net,1433";
         this.sqlConnectionSB["User ID"] = "MyLogin";  // "@yourservername"  as suffix sometimes.
         this.sqlConnectionSB["Password"] = "MyPassword";
         this.sqlConnectionSB["Database"] = "MyDatabase";

         // Leave these values as they are.
         this.sqlConnectionSB["Trusted_Connection"] = false;
         this.sqlConnectionSB["Integrated Security"] = false;
         this.sqlConnectionSB["Encrypt"] = true;
         this.sqlConnectionSB["Connection Timeout"] = 30;
      }

      Program()   // Constructor.
      {
         int[] arrayOfTransientErrorNumbers =
                { 4060, 10928, 10929, 40197, 40501, 40613, 49918, 49919, 49920
                    //,11001   // 11001 for testing, pretend network error is transient.
                    //,18456   // 18456 for testing, purposely misspell database name.
                };
         listTransientErrorNumbers = new G.List<int>(arrayOfTransientErrorNumbers);
      }

      // Fields.
      private G.List<int> listTransientErrorNumbers;

      private Y.ReliableSqlConnection reliableSqlConnection;
      private Y.ExponentialBackoff exponentialBackoff;
      private Y.SqlDatabaseTransientErrorDetectionStrategy
                   sqlDatabaseTransientErrorDetectionStrategy;
      private Y.RetryPolicy retryPolicy;

      private Action OpenTheConnection_action;

      private C.SqlConnectionStringBuilder sqlConnectionSB;
      private D.IDbCommand dbCommand;
      private D.IDataReader dataReader;
   }
}
```


&nbsp;


## Related links


- Numerous links to further information is provided in: 
[Enterprise Library 6 – April 2013](http://msdn.microsoft.com/library/dn169621.aspx)
 - This topic has a button at its top that offers to [download the EntLib60 source code](http://go.microsoft.com/fwlink/p/?LinkID=290898), if you are curious to see the source code.


- Free ebook in .PDF format from Microsoft: 
[Developer's Guide to Microsoft Enterprise Library, 2nd Edition](http://www.microsoft.com/download/details.aspx?id=41145).


- [Microsoft.Practices.EnterpriseLibrary.TransientFaultHandling Namespace](http://msdn.microsoft.com/library/microsoft.practices.enterpriselibrary.transientfaulthandling.aspx)


- [Enterprise Library 6 Class Library reference](http://msdn.microsoft.com/library/dn170426.aspx)


- [Code sample: Retry logic in C# for connecting to SQL Database with ADO.NET](sql-database-develop-csharp-retry-windows.md)


- [Client quick-start code samples to SQL Database](sql-database-develop-quick-start-client-code-samples.md)

