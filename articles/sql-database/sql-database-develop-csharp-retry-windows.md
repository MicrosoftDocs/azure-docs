<properties
	pageTitle="C# retry logic to connect to SQL Database | Microsoft Azure"
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
	ms.date="03/15/2016"
	ms.author="annemill"/>


# Code sample: Retry logic in C# for connecting to SQL Database



[AZURE.INCLUDE [sql-database-develop-includes-selector-language-platform-depth](../../includes/sql-database-develop-includes-selector-language-platform-depth.md)] 



This topic provides a C# code sample that demonstrates custom retry logic. The retry logic is designed to gracefully process temporary errors or *transient faults* that tend to go away if the program waits a few seconds and retries.


ADO.NET classes that you use to connect to your local Microsoft SQL Server can also connect to Azure SQL Database. However, by themselves the ADO.NET classes cannot provide all the robustness and reliability necessary in production use. Your client program can encounter transient faults from which it should silently and gracefully recover on its own.


A couple examples of transient faults are:


- A connection over the Internet is subject to brief network outages, after which the connection can be recreated.

- Cloud computing involves load balancing which can briefly block attempts to connect or query.


## Identify transient errors


Your program must distinguish between transient errors versus persistent errors. If you program has a misspelling of the target database name, the "No such database found" error will persist and will reoccur every time you rerun the program.


The list of error numbers that are categorized as transient faults is available at:


- [Error messages for SQL Database client programs](sql-database-develop-error-messages.md#bkmk_connection_errors)
 - See the top section about *Transient Errors, Connection-Loss Errors*.


## C# code sample


The C# code sample in the present topic contains custom detection and retry logic to handle transient errors. The sample assumes .NET Framework 4.5.1 or later is installed.


The code sample follows a few basic guidelines or recommendations that apply regardless of which technology you use to interact with Azure SQL Database. You can see the general recommendations at:


- [Connecting to SQL Database: Links, Best Practices and Design Guidelines](sql-database-connect-central-recommendations.md)


The C# code sample consists of one file named Program.cs.  Its code is pasted into the next section.


### Capture and compile the code sample


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
using D = System.Data;
using C = System.Data.SqlClient;
using X = System.Text;
using H = System.Threading;

namespace RetryAdo2
{
	class Program
	{
		static void Main(string[] args)
		{
			Program program = new Program();
			bool returnBool;

			returnBool = program.Run(args);
			if (returnBool == false)
			{
				Console.WriteLine("Something failed.  :-( ");
			}
			return;
		}

		bool Run(string[] _args)
		{
			C.SqlConnectionStringBuilder sqlConnectionSB;
			C.SqlConnection sqlConnection;
			D.IDbCommand dbCommand;
			D.IDataReader dataReader;
			X.StringBuilder sBuilder = new X.StringBuilder(256);
			int retryIntervalSeconds = 10;
			bool returnBool = false;

			for (int tries = 1; tries <= 5; tries++)
			{
				try
				{
					if (tries > 1)
					{
						H.Thread.Sleep(1000 * retryIntervalSeconds);
						retryIntervalSeconds = Convert.ToInt32(retryIntervalSeconds * 1.5);
					}
					this.GetSqlConnectionStringBuilder(out sqlConnectionSB);

					sqlConnection = new C.SqlConnection(sqlConnectionSB.ToString());

					dbCommand = sqlConnection.CreateCommand();
					dbCommand.CommandText = @"
SELECT TOP 3
      ob.name,
      CAST(ob.object_id as nvarchar(32)) as [object_id]
   FROM sys.objects as ob
   WHERE ob.type='IT'
   ORDER BY ob.name;";

					sqlConnection.Open();
					dataReader = dbCommand.ExecuteReader();

					while (dataReader.Read())
					{
						sBuilder.Length = 0;
						sBuilder.Append(dataReader.GetString(0));
						sBuilder.Append("\t");
						sBuilder.Append(dataReader.GetString(1));

						Console.WriteLine(sBuilder.ToString());
					}
					returnBool = true;
					break;
				}

				catch (C.SqlException sqlExc)
				{
					if (this.m_listTransientErrorNumbers.Contains(sqlExc.Number) == true)
					{ continue; }
					else
					{ throw sqlExc; }
				}
			}
			return returnBool;
		}

		void GetSqlConnectionStringBuilder(out C.SqlConnectionStringBuilder _sqlConnectionSB)
		{
			// Prepare the connection string to Azure SQL Database.
			_sqlConnectionSB = new C.SqlConnectionStringBuilder();

			// Change these values to your values.
			_sqlConnectionSB["Server"] = "tcp:myazuresqldbserver.database.windows.net,1433";
			_sqlConnectionSB["User ID"] = "MyLogin";  // "@yourservername"  as suffix sometimes.
			_sqlConnectionSB["Password"] = "MyPassword";
			_sqlConnectionSB["Database"] = "MyDatabase";

			// Adjust these values if you like. (.NET 4.5.1 or later.)
			_sqlConnectionSB["ConnectRetryCount"] = 3;
			_sqlConnectionSB["ConnectRetryInterval"] = 10;  // Seconds.

			// Leave these values as they are.
			_sqlConnectionSB["Trusted_Connection"] = false;
			_sqlConnectionSB["Integrated Security"] = false;
			_sqlConnectionSB["Encrypt"] = true;
			_sqlConnectionSB["Connection Timeout"] = 30;
		}

		Program()   // Constructor.
		{
			int[] arrayOfTransientErrorNumbers =
				{ 4060, 40197, 40501, 40613, 49918, 49919, 49920
					//,11001   // 11001 for testing, pretend network error is transient.
				};
			m_listTransientErrorNumbers = new G.List<int>(arrayOfTransientErrorNumbers);
		}

		private G.List<int> m_listTransientErrorNumbers;
	}
}
```


### Run the program


The **RetryAdo2.exe** executable inputs no parameters. To run the .exe in Visual Studio:


1. Set a breakpoint on the **return;** statement in the **Main** method.

2. Click the green start arrow button. A console window is displayed.

3. When the debugger stops at the end in **Main**, switch to the console window.

4. See three rows perhaps identical to the following:


```
database_firewall_rules_table   245575913
filestream_tombstone_2073058421 2073058421
filetable_updates_2105058535    2105058535
```


## Test your retry logic


One handy way to test retry logic is to:


1. Temporarily add **11001** to your collection of **SqlConnection.Number** values that shall be considered as transient errors.

2. Recompile your program.

3. Disconnect your client computer from the network.

4. Run your program in a debugger, with a breakpoint in the loop.
 - The first loop will fail with error 11001.

5. When the program is resting on a breakpoint during the second loop, reconnect your computer to the network.

6. Resume running your program. It succeeds during the second loop.


### Another test option


Another way could be to add logic to your program to recognize a command line parameter value of "test". In response to the parameter, the program would:


1. Temporarily append junk letters to misspell the SQL Database server name.

2. Temporarily add **40615** to the list of transient errors.

3. At the start of its second loop, meaning its first retry loop, the program would:
 - Undo the server misspelling.
 - Remove 40615 from the transient list.


Run the program with the "test" parameter, and verify it first fails but then succeeds on its second loop.


## Related links


- [Client quick-start code samples to SQL Database](sql-database-develop-quick-start-client-code-samples.md)

- [Try SQL Database: Use C# to create a SQL database with the SQL Database Library for .NET](sql-database-get-started-csharp.md)
