<properties
	pageTitle="Preparations C# query your SQL Database | Microsoft Azure"
	description="Details about IP addresses, contained users, port numbers, and connection strings to enable your C# program to connect to your Azure SQL Database database in the cloud, by using ADO.NET."
	services="sql-database"
	documentationCenter=""
	authors="MightyPen"
	manager="jeffreyg"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="get-started-article"
	ms.date="09/03/2015"
	ms.author="genemi"/>


# Preparations and C# to query your SQL Database


<!-- ?? Remove this comment before publishing!
GeneMi ,   2015-09-03  Thursday  16:08pm

OLD TITLE:  "Connect to and query your SQL Database with C#"

In-progress of rewriting.
Far enough that now want Jeff.G feedback before finalizing.
-->



You want to write a C# program that uses ADO.NET to connect to an Azure SQL Database database in the cloud. 

This topic describes every step for people who are new to Azure SQL Database and C#. Others who are experienced with Microsoft SQL Server and C# will skip some steps to focus on those that are particular to SQL Database.


## Prerequisites


To run the C# code sample, you must have:


- An Azure account and subscription. You can sign up for a [free trial](http://azure.microsoft.com/pricing/free-trial/).


- An **AdventureWorksLT** demonstration database on the Azure SQL Database service.
 - [Create the demo database](sql-database-get-started.md) in minutes.


- Visual Studio 2013 update 4 (or later). Microsoft now provides Visual Studio for *free*.
 - [Visual Studio Community, download](http://www.visualstudio.com/products/visual-studio-community-vs)
 - [More options for free Visual Studio](http://www.visualstudio.com/products/free-developer-offers-vs.aspx)
 - Or, let the [step](#InstallVSForFree) later in this topic describe how the [Azure preview portal](http://portal.azure.com/) guides you to the install of Visual Studio.


## Step 1: Get the connection string


Use the [Azure preview portal](http://portal.azure.com/) to copy the connection string for your database.

Your first use will be to connect Visual Studio to your Azure SQL Database **AdventureWorksLT** database.


[AZURE.INCLUDE [sql-database-include-connection-string-20-portalshots](../../includes/sql-database-include-connection-string-20-portalshots.md)]


[AZURE.INCLUDE [sql-database-include-connection-string-30-compare](../../includes/sql-database-include-connection-string-30-compare.md)]


[AZURE.INCLUDE [sql-database-include-connection-string-40-config](../../includes/sql-database-include-connection-string-40-config.md)]


<a name="InstallVSForFree" id="InstallVSForFree"></a>

&nbsp;

## Step 2: Install Visual Studio (VS) for free


If you need to install Visual Studio, you can:

- Install VS by navigating your browser Visual Studio product webpages that provide free downloads and other options; or
- Let the [Azure preview portal](http://portal.azure.com/) guide you to the download webpage, which described next.


### Visual Studio through the Azure preview portal


1. Login through the [Azure preview portal](http://portal.azure.com/).

2. Click **BROWSE* ALL** > **SQL databases**. A blade opens that searches for databases.

3. In the filter text box near the top, start typing the name of your **AdventureWorksLT** database.

4. When you see the row for your database on your server, click the row. A blade opens for your database.

5. For convenience, click the minimize control on each of the previous blades.

6. Click the **Open in Visual Studio** button near the top on your database blade. A new blade about Visual Studio opens with links to install locations for Visual Studio. 
 
	![Open in Visual Studio button][20-OpenInVisualStudioButton]

7. Click the **Community (free)** link, or a similar link. A new webpage is added.

8. Use links on the new webpage to install Visual Studio.

9. After Visual Studio is installed, on the **Open In Visual Studio** blade click the **Open In Visual Studio** button. VS opens.

10. For the benefit its **SQL Server Object Explorer** pane, Visual Studio asks you to fill in connection string fields in a dialog.
 - Choose **SQL Server Authentication**, not **Windows Authentication**.
 - Remember to specify your **AdventureWorksLT** database (**Options** > **Connection Properties** in the dialog).

11. In the **SQL Server Object Explorer**, expand the node for your database.


## Step 3: Create a new project in Visual Studio


In Visual Studio, create a new project that is based on the starter template for C# > Windows > **Console Application**.


1. Click **File** > **New** > **Project**. The **** dialog is displayed.

2. Under **Installed**, expand to C# and Windows, so that the **Console Application** option appears in the middle pane. 

	![The New Project dialog][30-VSNewProject]

2. For the **Name** enter **ConnectAndQuery_Example**. Click **OK**.


## Step 4: Paste in the sample C# code


1. In Visual Studio, use the **Solution Explorer** pane to open your **Program.cs** file. 

	![Paste in our sample C# program code][40-VSProgramCsOverlay]

2. Overlay all the starter code in Program.cs by pasting in the following sample C# code. 


		using System;  // C#
		using G = System.Configuration;   // System.Configuration.dll
		using D = System.Data;            // System.Data.dll
		using C = System.Data.SqlClient;  // System.Data.dll
		using T = System.Text;
		
		namespace ConnectAndQuery_Example
		{
		    class Program
		    {
		        static void Main()
		        {
		            string connectionString4NoUserIDNoPassword,
		                password, userName, SQLConnectionString;
		
		            // Get most of the connection string from ConsoleApplication1.exe.config
		            // file, in the same directory where ConsoleApplication1.exe resides.
		            connectionString4NoUserIDNoPassword = Program.GetConnectionStringFromExeConfig
		                ("ConnectionString4NoUserIDNoPassword");
		            // Get the user name from keyboard input.
		            Console.WriteLine("Enter your User ID, without the trailing @ and server name: ");
		            userName = Console.ReadLine();
		            // Get the password from keyboard input.
		            password = Program.GatherPasswordFromConsole();
		            SQLConnectionString = "Password=" + password + ';' +
		                "User ID=" + userName + ";" + connectionString4NoUserIDNoPassword;
		
		            // Create an SqlConnection from the provided connection string.
		            using (C.SqlConnection connection = new C.SqlConnection(SQLConnectionString))
		            {
		                // Formulate the command.
		                C.SqlCommand command = new C.SqlCommand();
		                command.Connection = connection;
		
		                // Specify the query to be executed.
		                command.CommandType = D.CommandType.Text;
		                command.CommandText = @"
		                    SELECT TOP 9 CustomerID, NameStyle, Title, FirstName, LastName
		                    FROM SalesLT.Customer;  -- In AdventureWorksLT database.
		                    ";
		                // Open a connection to database.
		                connection.Open();
		
		                // Read data returned for the query.
		                C.SqlDataReader reader = command.ExecuteReader();
		                while (reader.Read())
		                {
		                    Console.WriteLine("Values:  {0}, {1}, {2}, {3}, {4}",
		                        reader[0], reader[1], reader[2], reader[3], reader[4]);
		                }
		            }
		            Console.WriteLine("View the results here, then press any key to finish...");
		            Console.ReadKey(true);
		        }
		
		
		        static string GetConnectionStringFromExeConfig(string connectionStringNameInConfig)
		        {
		            string returnConnectionString = null;
		            G.ConnectionStringSettingsCollection connectionStringSettings =
		                G.ConfigurationManager.ConnectionStrings;
		
		            if (connectionStringSettings != null)
		            {
		                foreach (G.ConnectionStringSettings connStringSetting in connectionStringSettings)
		                {
		                    if (connStringSetting.Name == connectionStringNameInConfig)
		                    {
		                        returnConnectionString = connStringSetting.ConnectionString;
		                        break;
		                    }
		                }
		            }
		
		            if (returnConnectionString == null)
		            {
		                throw new ApplicationException(String.Format
		                    ("Error. Connection string not found for name '{0}'.",
		                    connectionStringNameInConfig));
		            }
		            return returnConnectionString;
		        }
		
		
		        static string GatherPasswordFromConsole()
		        {
		            T.StringBuilder passwordBuilder = new T.StringBuilder(32);
		            ConsoleKeyInfo key;
		            Console.WriteLine("Enter your password: ");
		            do
		            {
		                key = Console.ReadKey(true);
		                if (key.Key != ConsoleKey.Backspace)
		                {
		                    passwordBuilder.Append(key.KeyChar);
		                    Console.Write("*");
		                }
		                else  // Backspace char was entered.
		                {
		                    // Retreat the cursor, overlay '*' with ' ', retreat again.
		                    Console.Write("\b \b");
		                    passwordBuilder.Length = passwordBuilder.Length - 1;
		                }
		            }
		            while (key.Key != ConsoleKey.Enter); // Enter key will end the looping.
		            Console.WriteLine(Environment.NewLine);
		            return passwordBuilder.ToString();
		        }
		    }
		}


### Summary of actions in the sample program


1. Reads most of the SQL connection string from a config file.

2. Gathers user name and password from the keyboard, and adds them to complete the connection string.

3. Uses the connection string, and ADO.NET classes, to connect to the **AdventureWorksLT** demonstration database on Azure SQL Database.

4. Issues an SQL **SELECT** to read from the **SalesLT** table.

5. Prints the returned rows to the console.


We try to keep the C# sample short. Yet we added code to read a config file to honor several requests from customers like you. We agree that production quality programs should use config files instead of literals hardcoded in the .exe.


> [AZURE.WARNING] In the interest of code brevity, we opted not to include code for exception handling and retry logic in this educational sample. However your production programs that interact with a cloud database should include both.
>
> [Here](sql-database-develop-csharp-retry-windows.md) is a link to a code sample that has retry logic.


## Step 5: Add an assembly reference for config processing


Our C# sample uses the .NET Framework assembly **System.Configuration.dll**, so let's add a reference to it.


1. In the **Solution Explorer** pane, right-click **References** > **Add Reference**. The **Reference Manager** window is displayed.

2. Expand **Assemblies** > **Framework**.

3. Scroll then click to highlight **System.Configuration**. Ensure that its check box if selected.

4. Click **OK**.

5. Compile your program by menu **BUILD** > **Build Solution**.


## Step 6: Edit the config file


1. Find the directory that contains your new **ConnectAndQuery_Example.exe** file, and its companion config file.
 - In the same directory, Visual Studio has placed a file named **ConnectAndQuery_Example.exe.config**. 

2.  Edit the config file, to paste in the whole `<connectionStrings> </connectionStrings>` section, after the `</startup>` close tag.
 - Remember to edit the placeholders such as **{your_serverName_here}**.


## Step 7: Add allowed IP addresses in the server firewall


For an Azure SQL Database server, you can use its firewall to create a whitelist of IP address ranges from which clients are allowed to connect. Your C# program will fail to connect if its IP address is not in the whitelist.

Firewall rules can be set at the server or database level. For information see:


- [sp_set_firewall_rule](http://msdn.microsoft.com/library/dn270017.aspx) or [sp_set_database_firewall_rule](http://msdn.microsoft.com/library/dn270010.aspx) - to add ranges of allowed IP addresses to connect.
- [sys.firewall_rules](http://msdn.microsoft.com/library/dn269980.aspx) or [sys.database_firewall_rules](http://msdn.microsoft.com/library/Dn269982.aspx) - to see what ranges are presently allowed.
- [How to: Configure firewall settings on SQL Database](sql-database-configure-firewall-settings.md) - for discussion of the whole area, including code examples and portal UI examples.


> [AZURE.TIP] If your C# program fails because its IP address is absent from the allowed list, the error message tells you the exact IP address that you need to add.



<!-- ??

## Step 8: ??_TEST_Allow outbound communication on port 1433 in your client firewall. LUIZ.F.S ??

-->


## Step 8: Run the program


1. In Visual Studio, run your program by menu **DEBUG** > **Start Debugging**. A console window is displayed

2. You enter your user name and password, as directed.

3. Rows of data are displayed.


## Related links


- [Client quick-start code samples to SQL Database](sql-database-develop-quick-start-client-code-samples.md)

- If your client program runs on an Azure VM, learn about TCP ports other than 1433 at:<br/>[Ports beyond 1433 for ADO.NET 4.5 and SQL Database V12](sql-database-develop-direct-route-ports-adonet-v12.md).



<!-- Image references. -->

[20-OpenInVisualStudioButton]: ./media/sql-database-connect-query/connqry-free-vs-e.png

[30-VSNewProject]: ./media/sql-database-connect-query/connqry-vs-new-project-f.png

[40-VSProgramCsOverlay]: ./media/sql-database-connect-query/connqry-vs-program-cs-overlay-g.png
