
<!--
includes/sql-database-include-connection-string-40-config.md

Latest Freshness check:  2015-09-04 , GeneMi.

## Connection string
-->


### Example config file for connection string security


It is unsound to put the connection string as literals in your C# code. It is better to put the connection string in a config file. There you can edit the string any time without the need to recompile.

Let's assume your compiled C# program is named **ConsoleApplication1.exe**, and that this .exe resides in a **bin\debug\** directory.

In this example, most parts of your connection string are stored in a config file named exactly **ConsoleApplication1.exe.config**. This config file must also reside in **bin\debug\**.

In the XML of the following config file you see a connection string named **ConnectionString4NoUserIDNoPassword**. The C# code looks for this string.

You must edit real names in for the placeholders:

- {your_serverName_here}
- {your_databaseName_here}



		<?xml version="1.0" encoding="utf-8" ?>
		<configuration>
		    <startup> 
		        <supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.5" />
		    </startup>
		
		    <connectionStrings>
		        <clear />
		        <add name="ConnectionString4NoUserIDNoPassword"
		        providerName="System.Data.ProviderName"
		
		        connectionString=
				"Server=tcp:{your_serverName_here}.database.windows.net,1433;
				Database={your_databaseName_here};
				Connection Timeout=30;
				Encrypt=True;
				TrustServerCertificate=False;" />
		    </connectionStrings>
		</configuration>



For this illustration we chose to omit two parameters:

- User ID={your_userName_here};
- Password={your_password_here};


You can include them, but sometimes it is better to have your program get those values from keyboard input by the user. It depends.



<!--
These three includes/ files are a sequenced set, but you can pick and choose:

includes/sql-database-include-connection-string-20-portalshots.md
includes/sql-database-include-connection-string-30-compare.md
includes/sql-database-include-connection-string-40-config.md
-->
