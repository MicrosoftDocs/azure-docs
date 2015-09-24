<properties
	pageTitle="Query SQL Database with C# | Microsoft Azure"
	description="Details about IP addresses, connection strings, config file for secure login, and free Visual Studio all to enable your C# program to connect to your Azure SQL Database database in the cloud, by using ADO.NET."
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
	ms.date="09/09/2015"
	ms.author="genemi"/>


# Connect to and query your SQL Database with C&#x23;


You want to write a C# program that uses ADO.NET to connect to an Azure SQL Database database in the cloud. 

This topic describes every step for people who are new to Azure SQL Database and C#. Others who are experienced with Microsoft SQL Server and C# may skip some steps and focus on those that are particular to SQL Database.


## Prerequisites


To run the C# code sample, you must have:


- An Azure account and subscription. You can sign up for a [free trial](http://azure.microsoft.com/pricing/free-trial/).


- An **AdventureWorksLT** demonstration database on the Azure SQL Database service.
 - [Create the demo database](sql-database-get-started.md) in minutes.


- Visual Studio 2013 update 4 (or later). Microsoft now provides Visual Studio Community for *free*.
 - [Visual Studio Community, download](http://www.visualstudio.com/products/visual-studio-community-vs)
 - [More options for free Visual Studio](http://www.visualstudio.com/products/free-developer-offers-vs.aspx)
 - Or, let the [step](#InstallVSForFree) later in this topic describe how the [Azure preview portal](http://portal.azure.com/) guides you to the install of Visual Studio.


<a name="InstallVSForFree" id="InstallVSForFree"></a>

&nbsp;

## Step 1: Install Visual Studio Community for free


If you need to install Visual Studio, you can:

- Install Visual Studio Community for free by navigating your browser to Visual Studio product webpages that provide free downloads and other options; or
- Let the [Azure preview portal](http://portal.azure.com/) guide you to the download webpage, which described next.


### Visual Studio through the Azure preview portal


1. Login through the [Azure preview portal](http://portal.azure.com/), http://portal.azure.com/.

2. Click **BROWSE* ALL** > **SQL databases**. A blade opens that searches for databases.

3. In the filter text box near the top, start typing the name of your **AdventureWorksLT** database.

4. When you see the row for your database on your server, click the row. A blade opens for your database.

5. For convenience, click the minimize control on each of the previous blades.

6. Click the **Open in Visual Studio** button near the top on your database blade. A new blade about Visual Studio opens with links to install locations for Visual Studio. 
 
	![Open in Visual Studio button][20-OpenInVisualStudioButton]

7. Click the **Community (free)** link, or a similar link. A new webpage is added.

8. Use links on the new webpage to install Visual Studio.

9. After Visual Studio is installed, on the **Open In Visual Studio** blade click the **Open In Visual Studio** button. Visual Studio opens.

10. For the benefit its **SQL Server Object Explorer** pane, Visual Studio asks you to fill in connection string fields in a dialog.
 - Choose **SQL Server Authentication**, not **Windows Authentication**.
 - Remember to specify your **AdventureWorksLT** database (**Options** > **Connection Properties** in the dialog).

11. In the **SQL Server Object Explorer**, expand the node for your database.


## Step 2: Create a new project in Visual Studio


In Visual Studio, create a new project that is based on the starter template for C# > Windows > **Console Application**.


1. Click **File** > **New** > **Project**. The **** dialog is displayed.

2. Under **Installed**, expand to C# and Windows, so that the **Console Application** option appears in the middle pane. 

	![The New Project dialog][30-VSNewProject]

2. For the **Name** enter **ConnectAndQuery_Example**. Click **OK**.


## Step 3: Add an assembly reference for config processing


Our C# sample uses the .NET Framework assembly **System.Configuration.dll**, so let's add a reference to it.


1. In the **Solution Explorer** pane, right-click **References** > **Add Reference**. The **Reference Manager** window is displayed.

2. Expand **Assemblies** > **Framework**.

3. Scroll then click to highlight **System.Configuration**. Ensure that its check box if selected.

4. Click **OK**.

5. Compile your program by menu **BUILD** > **Build Solution**.


## Step 4: Get the connection string


Use the [Azure preview portal](http://portal.azure.com/) to copy the connection string for your database.

Your first use will be to connect Visual Studio to your Azure SQL Database **AdventureWorksLT** database.


[AZURE.INCLUDE [sql-database-include-connection-string-20-portalshots](../../includes/sql-database-include-connection-string-20-portalshots.md)]


## Step 5: Add the connection string to the App.config file


1. In Visual Studio, open the App.config file from the Solution Explorer pane.

2. Add a **&#x3c;configuration&#x3e; &#x3c;/configuration&#x3e;** element as shown in the following example App.config code sample.
 - Replace the *{your_placeholders}* with your actual values:

```
	<?xml version="1.0" encoding="utf-8" ?>
	<configuration>
	    <startup> 
	        <supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.5" />
	    </startup>
	
		<connectionStrings>
			<clear />
			<add name="ConnectionString4NoUserIDNoPassword"
			connectionString="Server=tcp:{your_serverName_here}.database.windows.net,1433; Database={your_databaseName_here}; Connection Timeout=30; Encrypt=True; TrustServerCertificate=False;"
			/>
		</connectionStrings>
	</configuration>
```

3. Save the App.config change.

4. In the Solution Explorer pane, right-click the **App.config** node, and then click **Properties**.

5. Set the **Copy to Output Directory** to **Copy always**.
 - This causes the contents of your App.config file to replace the contents of the &#x2a;.exe.config file, in the directory where the &#x2a;.exe file is built to. The replacement occurs every time you recompile the &#x2a;.exe.
 - The &#x2a;.exe.config file is read when our sample C# program runs.

	![Copy to Output Directory = Copy always][50-VSCopyToOutputDirectoryProperty]


## Step 6: Paste in the sample C# code


1. In Visual Studio, use the **Solution Explorer** pane to open your **Program.cs** file. 

	![Paste in our sample C# program code][40-VSProgramCsOverlay]

2. Overwrite all the starter code in Program.cs by pasting in the following sample C# code. 
 - If you want a shorter code sample, you can assign the whole connection string as a literal to the variable **SQLConnectionString**. Then you can erase the two methods **GetConnectionStringFromExeConfig** and **GatherPasswordFromConsole**.


```
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
	
			// Get most of the connection string from ConnectAndQuery_Example.exe.config
			// file, in the same directory where ConnectAndQuery_Example.exe resides.
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
		//----------------------------------------------------------------------------------
	
		static string GetConnectionStringFromExeConfig(string connectionStringNameInConfig)
		{
			G.ConnectionStringSettings connectionStringSettings =
				G.ConfigurationManager.ConnectionStrings[connectionStringNameInConfig];
	
			if (connectionStringSettings == null)
			{
				throw new ApplicationException(String.Format
					("Error. Connection string not found for name '{0}'.",
					connectionStringNameInConfig));
			}
				return connectionStringSettings.ConnectionString;
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
```


### Compile your program


1. In Visual Studio, compile your program by clicking the menu **Build** > **Build Solution**.


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


## Step 7: Add allowed IP address range in the server firewall


Your client C# program cannot connect to Azure SQL Database until the IP address of the client computer has been added in the SQL Database firewall. Your program will fail with a handy error message that states the necessary IP address.


You can use the [Azure preview portal](http://portal.azure.com/) to add the IP address.



[AZURE.INCLUDE [sql-database-include-ip-address-22-v12portal](../../includes/sql-database-include-ip-address-22-v12portal.md)]



For more information, see:<br/>
[How to: Configure firewall settings on SQL Database](sql-database-configure-firewall-settings.md)



## Step 8: Run the program


1. In Visual Studio, run your program by menu **DEBUG** > **Start Debugging**. A console window is displayed.

2. You enter your user name and password, as directed.
 - A few connection tools require your user name to have "@{your_serverName_here}" appended, but for ADO.NET this suffix is optional. Don't bother typing the suffix.

3. Rows of data are displayed.


## Related links


- [Client quick-start code samples to SQL Database](sql-database-develop-quick-start-client-code-samples.md)

- If your client program runs on an Azure VM, learn about TCP ports other than 1433 at:<br/>[Ports beyond 1433 for ADO.NET 4.5 and SQL Database V12](sql-database-develop-direct-route-ports-adonet-v12.md).



<!-- Image references. -->

[20-OpenInVisualStudioButton]: ./media/sql-database-connect-query/connqry-free-vs-e.png

[30-VSNewProject]: ./media/sql-database-connect-query/connqry-vs-new-project-f.png

[40-VSProgramCsOverlay]: ./media/sql-database-connect-query/connqry-vs-program-cs-overlay-g.png

[50-VSCopyToOutputDirectoryProperty]: ./media/sql-database-connect-query/connqry-vs-appconfig-copytoputputdir-h.png
