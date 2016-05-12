<properties
	pageTitle="Retry logic in C#, for SQL Database | Microsoft Azure"
	description="C# sample includes retry logic for reliably interacting with Azure SQL Database."
	services="sql-database"
	documentationCenter=""
	authors="annemill"
	manager="jhubbard"
	editor=""/>


<tags
	ms.service="sql-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="04/08/2016"
	ms.author="annemill"/>


# Code sample: Retry logic in C# for connecting to SQL Database



[AZURE.INCLUDE [sql-database-develop-includes-selector-language-platform-depth](../../includes/sql-database-develop-includes-selector-language-platform-depth.md)] 



This topic provides a C# code sample that demonstrates custom retry logic. The retry logic is designed to gracefully process temporary errors or *transient faults* that tend to go away if the program waits several seconds and retries.


The ADO.NET classes for connecting to your local Microsoft SQL Server can also connect to Azure SQL Database. However, by themselves the ADO.NET classes cannot provide all the robustness and reliability necessary in production use. Your client program can encounter transient faults from which it should silently and gracefully recover and continue on its own.


A couple examples of transient faults are:


- A connection over the Internet is subject to brief network outages, after which the connection can be recreated.
- Cloud computing involves load balancing which can briefly block attempts to connect or query.


## A. Identify transient errors


Your program must distinguish between transient errors versus persistent errors. If you program has a misspelling of the target database name, the "No such database found" error will persist and will reoccur every time you rerun the program.

The list of error numbers that are categorized as transient faults is available at:

- [Error messages for SQL Database client programs](sql-database-develop-error-messages.md#bkmk_connection_errors)
  - See the top section about *Transient Errors, Connection-Loss Errors*.


The C# code sample later in this topic lists the transient error numbers in a field named **TransientErrorNumbers**.



## B. C# code sample


The C# code sample in the present topic contains custom detection and retry logic to handle transient errors. The sample assumes .NET Framework 4.5.1 or later is installed.


The code sample follows a few basic guidelines or recommendations that apply regardless of which technology you use to interact with Azure SQL Database. You can see the general recommendations at:


- [Connecting to SQL Database: Links, Best Practices and Design Guidelines](sql-database-connect-central-recommendations.md)


The C# code sample consists of one file named Program.cs. Its code is provided in the next section.


### B.1 Capture and compile the code sample


You can compile the sample with the following steps:


1. In the [free Visual Studio Community edition](https://www.visualstudio.com/products/visual-studio-community-vs), create a new project from the C# Console Application template.
  - File > New > Project > Installed > Templates > Visual C# > Windows > Classic Desktop > Console Application
  - Name the project **RetryAdo2**.
2. Open the Solution Explorer pane.
  - See the name of your project.
  - See the name of the Program.cs file.
3. Open the Program.cs file.
4. Entirely replace the contents of the Program.cs file with the code in the following code block.
5. Click the menu Build > Build Solution.


#### C# source code to paste


Paste this code into your **Program.cs** file.


Then you must edit the strings for server name, password, and so on. You can find these strings in the method named **GetSqlConnectionStringBuilder**.



```
using System;   // C#
using G = System.Collections.Generic;
using S = System.Data.SqlClient;
using T = System.Threading;
   
namespace RetryAdo2
{
   public class Program
   {
      static public int Main(string[] args)
      {
         bool succeeded = false;
         int totalNumberOfTimesToTry = 4;
         int retryIntervalSeconds = 10;
   
         for (int tries = 1;
            tries <= totalNumberOfTimesToTry;
            tries++)
         {
            try
            {
               if (tries > 1)
               {
                  Console.WriteLine
                     ("Transient error encountered. Will begin attempt number {0} of {1} max...",
                     tries, totalNumberOfTimesToTry
                     );
                  T.Thread.Sleep(1000 * retryIntervalSeconds);
                  retryIntervalSeconds = Convert.ToInt32
                     (retryIntervalSeconds * 1.5);
               }
               AccessDatabase();
               succeeded = true;
               break;
            }
   
            catch (S.SqlException sqlExc)
            {
               if (TransientErrorNumbers.Contains
                  (sqlExc.Number) == true)
               {
                  Console.WriteLine("{0}: transient occurred.", sqlExc.Number);
                  continue;
               }
               else
               {
                  Console.WriteLine(sqlExc);
                  succeeded = false;
                  break;
               }
            }
   
            catch (TestSqlException sqlExc)
            {
               if (TransientErrorNumbers.Contains
                  (sqlExc.Number) == true)
               {
                  Console.WriteLine("{0}: transient occurred. (TESTING.)", sqlExc.Number);
                  continue;
               }
               else
               {
                  Console.WriteLine(sqlExc);
                  succeeded = false;
                  break;
               }
            }
   
            catch (Exception Exc)
            {
               Console.WriteLine(Exc);
               succeeded = false;
               break;
            }
         }
   
         if (succeeded == true)
         {
            return 0;
         }
         else
         {
            Console.WriteLine("ERROR: Unable to access the database!");
            return 1;
         }
      }
   
      /// <summary>
      /// Connects to the database, reads,
      /// prints results to the console.
      /// </summary>
      static public void AccessDatabase()
      {
         //throw new TestSqlException(4060); //(7654321);  // Uncomment for testing.
   
         using (var sqlConnection = new S.SqlConnection
                  (GetSqlConnectionString()))
         {
            using (var dbCommand = sqlConnection.CreateCommand())
            {
               dbCommand.CommandText = @"
SELECT TOP 3
      ob.name,
      CAST(ob.object_id as nvarchar(32)) as [object_id]
   FROM sys.objects as ob
   WHERE ob.type='IT'
   ORDER BY ob.name;";
   
               sqlConnection.Open();
               var dataReader = dbCommand.ExecuteReader();
   
               while (dataReader.Read())
               {
                  Console.WriteLine("{0}\t{1}",
                     dataReader.GetString(0),
                     dataReader.GetString(1));
               }
            }
         }
      }
   
      /// <summary>
      /// You must edit the four 'my' string values.
      /// </summary>
      /// <returns>An ADO.NET connection string.</returns>
      static private string GetSqlConnectionString()
      {
         // Prepare the connection string to Azure SQL Database.
         var sqlConnectionSB = new S.SqlConnectionStringBuilder();
   
         // Change these values to your values.
         sqlConnectionSB.DataSource = "tcp:myazuresqldbserver.database.windows.net,1433"; //["Server"]
         sqlConnectionSB.InitialCatalog = "MyDatabase"; //["Database"]
   
         sqlConnectionSB.UserID = "MyLogin";  // "@yourservername"  as suffix sometimes.
         sqlConnectionSB.Password = "MyPassword";
         sqlConnectionSB.IntegratedSecurity = false;
   
         // Adjust these values if you like. (ADO.NET 4.5.1 or later.)
         sqlConnectionSB.ConnectRetryCount = 3;
         sqlConnectionSB.ConnectRetryInterval = 10;  // Seconds.
   
         // Leave these values as they are.
         sqlConnectionSB.IntegratedSecurity = false;
         sqlConnectionSB.Encrypt = true;
         sqlConnectionSB.ConnectTimeout = 30;
   
         return sqlConnectionSB.ToString();
      }
   
      static public G.List<int> TransientErrorNumbers =
         new G.List<int> { 4060, 40197, 40501, 40613,
         49918, 49919, 49920, 11001 };
   }
   
   /// <summary>
   /// For testing retry logic, you can have method
   /// AccessDatabase start by throwing a new
   /// TestSqlException with a Number that does
   /// or does not match a transient error number
   /// present in TransientErrorNumbers.
   /// </summary>
   internal class TestSqlException : ApplicationException
   {
      internal TestSqlException(int testErrorNumber)
      { this.Number = testErrorNumber; }
   
      internal int Number
      { get; set; }
   }
}
```



## C. Run the program


The **RetryAdo2.exe** executable inputs no parameters. To run the .exe:

1. Open a console window to where you have compiled the RetryAdo2.exe binary.
2. Run RetryAdo2.exe, with no input parameters.



```
database_firewall_rules_table   245575913
filestream_tombstone_2073058421 2073058421
filetable_updates_2105058535    2105058535
```



## D. Ways to test your retry logic

There are a variety of ways you can simulate a transient error to test your retry logic.


### D.1 Throw a test exception

The code sample includes:

- A small second class named **TestSqlException**, which a property named **Number**.
- `//throw new TestSqlException(4060);` , which you can uncomment.

If you uncomment the throw, and recompile, the next run of **RetryAdo2.exe** outputs something similar to the following.



```
[C:\_MainW\VS15\RetryAdo2\RetryAdo2\bin\Debug\]
>> RetryAdo2.exe
4060: transient occurred. (TESTING.)
Transient error encountered. Will begin attempt number 2 of 4 max...
4060: transient occurred. (TESTING.)
Transient error encountered. Will begin attempt number 3 of 4 max...
4060: transient occurred. (TESTING.)
Transient error encountered. Will begin attempt number 4 of 4 max...
4060: transient occurred. (TESTING.)
ERROR: Unable to access the database!

[C:\_MainW\VS15\RetryAdo2\RetryAdo2\bin\Debug\]
>>
```



#### Retest with a persistent error


To prove the code handles persistent errors correctly, rerun the preceding test except do not use the number of a real transient error like 4060. Instead use the nonsense number 7654321. The program should treat this as a persistent error, and should bypass any retry.



### D.2 Disconnect from the network

1. Disconnect your client computer from the network.
  - For a desktop, unplug the network cable.
  - For a laptop, press the function combination of keys to turn off the network adapter.
2. Start RetryAdo2.exe, and wait for the console to display the first transient error, probably 11001.
3. Reconnect to the network, while RetryAdo2.exe continues to run.
4. Watch the console report success on a subsequent retry.


### D.3 Temporarily misspell the server name

1. Temporarily add 40615 as another error number to **TransientErrorNumbers**, and recompile.
2. Set a breakpoint on the line: `new S.SqlConnectionStringBuilder()`.
3. Use the *Edit and Continue* feature to purposely misspell the server name, a couple lines below.
  - Let the program run and come back to your breakpoint.
  - The error 40615 occurs.
4. Fix the misspelling.
5. Let the program run and finish successfully.
6. Remove 40615, and recompile.


## E. Related links

- [Client quick-start code samples to SQL Database](sql-database-develop-quick-start-client-code-samples.md)
- [Try SQL Database: Use C# to create a SQL database with the SQL Database Library for .NET](sql-database-get-started-csharp.md)
