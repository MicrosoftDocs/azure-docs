<properties 
	pageTitle="CREATE ASSEMBLY on Azure SQL Database with CSharp"
	description="Provides C# source code to issue CREATE ASSEMBLY to Azure SQL Database after first encoding a DLL file into a string that contains a long hexadecimal number." 
	services="sql-database" 
	documentationCenter="" 
	authors="MightyPen" 
	manager="jeffreyg" 
	editor=""/>

<tags 
	ms.service="sql-database" 
	ms.workload="data-management" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/14/2015" 
	ms.author="genemi"/>


# CREATE ASSEMBLY on Azure SQL Database with CSharp


<!--
GeneMi , Latest edit = 2015-March-25  Wednesday  10:22am
Converting plain text "CREATE ASSEMBLY" into a link to the MSDN topic, ms189524.aspx. And ms186755.aspx for "CREATE FUNCTION".
-->


This topic provides a C# code sample you can use to issue a [CREATE ASSEMBLY](http://msdn.microsoft.com/library/ms189524.aspx) statement to Azure SQL Database. For SQL Database, the FROM clause cannot accept the simple format of a path on the local computer that hosts the database. An alternative is to first encode the binary bits of the assembly DLL into a long string containing a hexadecimal number. Then give the string as the value on the FROM clause.


### Prerequisites


To understand this topic, you must have already partially know the following:


- [CLR Table-Valued Functions](http://msdn.microsoft.com/library/ms131103.aspx)<br/>Explains how the CREATE ASSEMBLY Transact-SQL statement works with other statements for the on-premises Microsoft SQL Server.


## A. Overall Technique


1. DROP FUNCTION and DROP ASSEMBLY, if necessary to clean up a previous run.
2. Remember the location of the Microsoft .NET Framework assembly DLL file that you compiled from your own code. You provide the location in the next step. 
3. Run the EXE for which the C# source code is given in this topic. Tell the EXE where your DLL file is.
 - Encodes your binary DLL into a long string containing a hexadecimal number.
 - Issues a CREATE ASSEMBLY statement with the hex string given in the FROM clause.
4. [CREATE FUNCTION](http://msdn.microsoft.com/library/ms186755.aspx) to reference a method in your assembly.
5. T-SQL SELECT statement to call and test your function.


The preceding list makes no mention of...<br/>
**execute sp_configure 'clr enabled', 1;**<br/>
...because this is not needed for Azure SQL Database, even though it is needed for Microsoft SQL Server.


If necessary for reruns, the T-SQL code to drop the function and assembly is the following:


    DROP FUNCTION fnCompareStringsCaseSensitive;
    DROP ASSEMBLY CreateAssemblyFunctions3;


## B. Simple Assembly DLL for T-SQL Function to Reference


The trivial C# code sample in this section can be compiled into an assembly DLL file.


This code sample contains the method **CompareCaseSensitiveNet** which is referenced later in a T-SQL CREATE FUNCTION statement. Notice that the method is decorated with a .NET attribute named **SqlFunction**. A method that is decorated with this attribute can be called by your T-SQL as a function.


	using           System;   // C#
	using SDSqTyp = System.Data.SqlTypes;
	using MSqServ = Microsoft.SqlServer.Server;
	
	namespace CreateAssemblyFunctions3
	{
	    public class SqlFunctionMethodsForSprocs
	    {
	        /// <summary> This method is referenced
	        /// by a T-SQL CREATE FUNCTION statement. </summary>
	        [MSqServ.SqlFunction(IsDeterministic = true, IsPrecise = true)]
	        static public SDSqTyp.SqlInt32 CompareCaseSensitiveNet(string strA, string strB)
	        {
	            return String.Compare(strA, strB, false);
	        }
	    }
	}


## C. C&#x23; Code Sample for EXE that Issues CREATE ASSEMBLY


The following sequence occurs when you run the EXE that is built from this C# sample:


1. The command line run of the EXE calls the **Main** method.
2. Main calls the **ObtainHexStringOfAssembly** method.
 - The method outputs a SqlString that stores the assembly as a hexadecimal number.
3. Main calls the **SubmitCreateAssemblyToAzureSqlDb** method.
 - The primary input is the SqlString.
 - The output is a CREATE ASSEMBLY call that is sent to Azure SQL Database.


			using             System;   // C#
			using SDat      = System.Data;
			using SDSClient = System.Data.SqlClient;
			using SGlo      = System.Globalization;
			using SIo       = System.IO;
			using STex      = System.Text;
			
			namespace CreateAssemblyFromHexString6
			{
			    /// <summary>
			    /// Run the Main method on your local computer console, so it can issue a
			    /// a CREATE ASSEMBLY statement to your Azure SQL Database server:
			    /// </summary>
			    class Program
			    {
			        /// <summary>
			        /// Calls the methods in the proper sequence.
			        /// </summary>
			        /// <param name="args">
			        /// Parameters for the cmd.exe command line
			        ///    run of CreateAssemblyFromHexString6.exe:
			        /// args[0] = FullDirPathFileNameOfAssembly.
			        /// args[1] = AssemblyName.
			        ///    For the CREATE ASSEMBLY assemblyName statement.
			        /// args[2] = Azure SQL Database - ServerName, including a suffix like .database.windows.net .
			        /// args[3] = Azure SQL Database - DatabaseName.
			        /// args[4] = Azure SQL Database - LoginName.
			        /// args[5] = Azure SQL Database - Password for login.
			        ///    (Better if from .config file.)
			        /// </param>
			        static int Main(string[] args)
			        {
			            int returnCode = 1; // Only 0 (zero) means Good Success.
			            string
			                fullPathNameAssemblyFile,
			                assemblyName,
			                AzureSqlDbServerName,
			                AzureSqlDbDatabaseName,
			                AzureSqlDbLoginName,
			                AzureSqlDbPassword;
			
			            try
			            {
			                fullPathNameAssemblyFile = args[0];
			                assemblyName             = args[1];
			                AzureSqlDbServerName     = args[2];
			                AzureSqlDbDatabaseName   = args[3];
			                AzureSqlDbLoginName      = args[4];
			                AzureSqlDbPassword       = args[5];
			
			                string hexStringOfAssembly = Program
			                    .ObtainHexStringOfAssembly(fullPathNameAssemblyFile);
			
			                Program.SubmitCreateAssemblyToAzureSqlDb(
			                    hexStringOfAssembly,
			                    assemblyName,
			                    AzureSqlDbServerName,
			                    AzureSqlDbDatabaseName,
			                    AzureSqlDbLoginName,
			                    AzureSqlDbPassword);
			
			                returnCode = 0;
			            }
			            catch (Exception ex)
			            {
			                Console.WriteLine("Bad, Failure.");
			                throw ex;
			            }
			            Console.WriteLine("Good, Success.");
			            return returnCode;
			        }
			
			        /// <summary> Encodes the binary bits of the assembly DLL into a 
			        /// string containing a hexadecimal number. </summary>
			        /// <param name="fullPathToAssembly"
			        /// >Full directory path plus the file name, to the .DLL file.</param>
			        /// <returns>A string containing a hexadecimal number that encodes
			        /// the binary bits of the .DLL file.</returns>
			        static private string ObtainHexStringOfAssembly
			            (string fullPathToAssembly)
			        {
			            STex.StringBuilder sbuilder = new STex.StringBuilder("0x");
			            using (SIo.FileStream fileStream = new SIo.FileStream(
			                fullPathToAssembly,
			                SIo.FileMode.Open, SIo.FileAccess.Read, SIo.FileShare.Read)
			                )
			            {
			                int byteAsInt;
			                while (true)
			                {
			                    byteAsInt = fileStream.ReadByte();
			                    if (-1 >= byteAsInt) { break; }
			                    sbuilder.Append(byteAsInt.ToString
			                        ("X2", SGlo.CultureInfo.InvariantCulture));
			                }
			            }
			            return sbuilder.ToString();
			        }
			
			        /// <summary>
			        /// Sends a Transact-SQL CREATE ASSEMBLY FROM hexString.
			        /// </summary>
			        static private void SubmitCreateAssemblyToAzureSqlDb(
			            string hexStringOfAssembly,
			            string assemblyName,
			            string AzureSqlDbServerName,
			            string AzureSqlDbDatabaseName,
			            string AzureSqlDbLoginName,
			            string AzureSqlDbPassword)
			        {
			            string sqlCreateAssembly = "CREATE ASSEMBLY [" + assemblyName
			                + "] FROM " + hexStringOfAssembly + ";";
			            STex.StringBuilder sbuilderConnection = new STex.StringBuilder();
			
			            sbuilderConnection.Append("Server=tcp:");
			            sbuilderConnection.Append(AzureSqlDbServerName);
			            sbuilderConnection.Append(",1433;");
			
			            sbuilderConnection.Append("Database=");
			            sbuilderConnection.Append(AzureSqlDbDatabaseName);
			            sbuilderConnection.Append(";");
			
			            sbuilderConnection.Append("Trusted_Connection=False;");
			            sbuilderConnection.Append("Connection Timeout=30;");
			
			            sbuilderConnection.Append("User ID=");
			            sbuilderConnection.Append(AzureSqlDbLoginName);
			            sbuilderConnection.Append(";");
			
			            sbuilderConnection.Append("Password=");
			            sbuilderConnection.Append(AzureSqlDbPassword);
			            sbuilderConnection.Append(";");
			
			            using (SDSClient.SqlConnection sqlConnection =
			                new SDSClient.SqlConnection())
			            {
			                SDSClient.SqlCommand sqlCommand;
			                sqlConnection.ConnectionString = sbuilderConnection.ToString();
			                sqlCommand = sqlConnection.CreateCommand();
			                sqlCommand.CommandType = SDat.CommandType.Text;
			                sqlCommand.CommandText = sqlCreateAssembly;
			                sqlConnection.Open();
			                sqlCommand.ExecuteNonQuery();
			            }
			            return;
			        }
			    }
			}


### C.1 Compile References and Versions


When we compiled and tested the sample code for the EXE tool, we used the following:


- Visual Studio 2013, update 4
 - Our project template type was the simple console application.
- .NET Framework 4.5


Our Visual Studio project referenced the following assemblies for compile:


- Microsoft.CSharp
- System
- System.Core
- System.Data
- System.Data.DataSetExtensions
- System.Xml
- System.Xml.Linq


### C.2 Command Line to Run the EXE


The following code block displays an example of the command line that you would enter to run the EXE from the console. The parameters in the command line are artificially wrapped here for better display.


	CreateAssemblyFromHexString6.exe
		C:\my\bin\debug\CreateAssemblyFunctions3.dll
		CreateAssemblyFunctions3
		myazuresqldbsvr2.database.windows.net
		myazuresqldbdab4
		myazurelogin
		Mypassword123


For simplicity of explanation this example passes the password as a command line parameter. A better design is to have the C# code obtain the password from a CONFIG file.


## D. Run a CREATE FUNCTION Statement


After the assembly is stored in your Azure SQL Database server, you must run a Transact-SQL CREATE FUNCTION statement that references the method in the assembly.


The following block of Transact-SQL code includes a couple of nonessential SELECT statements to show proof that the database system has records for your assembly and your function. Finally there is a SELECT that calls the function.


	SELECT a11.*, am2.*
		FROM           sys.assemblies       AS a11
		    INNER JOIN sys.assembly_modules AS am2 ON am2.assembly_id = a11.assembly_id
		WHERE a11.name = 'CreateAssemblyFunctions3';
	GO
	
	CREATE FUNCTION fnCompareStringsCaseSensitive
	    (@strA nvarchar(128), @strB nvarchar(128))
	    returns int
	    AS EXTERNAL NAME
	        CreateAssemblyFunctions3
	            .[CreateAssemblyFunctions3.SqlFunctionMethodsForSprocs]
	                .CompareCaseSensitiveNet;
	GO
	SELECT * FROM sys.objects WHERE name = 'fnCompareStringsCaseSensitive';
	
	 -- Use the new function.
	SELECT dbo.fnCompareStringsCaseSensitive('BLUE', 'blue') as returnedValue;
	GO


The preceding Transact-SQL code block ends with a SELECT statement that calls the new function. You could place the SELECT statement into a stored procedure.


<!-- EndOfFile -->

 
