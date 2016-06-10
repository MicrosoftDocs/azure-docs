<properties 
   pageTitle="Develop U-SQL User defined operators for Azure Data Lake Analytics jobs | Azure" 
   description="Learn how to develop user defined operators to be used and reused in Data Lake Analytics jobs. " 
   services="data-lake-analytics" 
   documentationCenter="" 
   authors="edmacauley" 
   manager="paulettm" 
   editor="cgronlun"/>
 
<tags
   ms.service="data-lake-analytics"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data" 
   ms.date="05/16/2016"
   ms.author="edmaca"/>


# Develop U-SQL User defined operators for Azure Data Lake Analytics jobs

Learn how to develop user defined operators to be used and reused in Data Lake Analytics jobs. You will develop a custom operator to convert country names.

##Prerequisites

- Visual Studio 2015, Visual Studio 2013 update 4, or Visual Studio 2012 with Visual C++ Installed 
- Microsoft Azure SDK for .NET version 2.5 or above.  Install it using the Web platform installer.
- A Data Lake Analytics account.  See [Get Started with Azure Data Lake Analytics using Azure Portal](data-lake-analytics-get-started-portal.md).
- Go through the [Get started with Azure Data Lake Analytics U-SQL Studio](data-lake-analytics-u-sql-get-started.md) tutorial.
- Connect to Azure, see [Get started with Azure Data Lake Analytics U-SQL Studio](data-lake-analytics-u-sql-get-started.md#connect-to-azure). 
- Upload the source data, see [Get started with Azure Data Lake Analytics U-SQL Studio](data-lake-analytics-u-sql-get-started.md#upload-source-data-files). 

## Define and use user defined operator in U-SQL

**To create and submit a U-SQL job** 

1. From the **File** menu, click **New**, and then click **Project**.
2. Select the **U-SQL Project** type.

	![new U-SQL Visual Studio project](./media/data-lake-analytics-data-lake-tools-get-started/data-lake-analytics-data-lake-tools-new-project.png)

3. Click **OK**. Visual studio creates a solution with a Script.usql file.
4. From **Solution Explorer**, expand Script.usql, and then double-click **Script.usql.cs**.
5. Paste the following code into the file:

		using Microsoft.Analytics.Interfaces;
		using System.Collections.Generic;
		
		namespace USQL_UDO
		{
			public class CountryName : IProcessor
			{
				private static IDictionary<string, string> CountryTranslation = new Dictionary<string, string>
				{
					{
						"Deutschland", "Germany"
					},
					{
						"Schwiiz", "Switzerland"
					},
					{
						"UK", "United Kingdom"
					},
					{
						"USA", "United States of America"
					},
					{
						"中国", "PR China"
					}
				};
		
				public override IRow Process(IRow input, IUpdatableRow output)
				{
		
					string UserID = input.Get<string>("UserID");
					string Name = input.Get<string>("Name");
					string Address = input.Get<string>("Address");
					string City = input.Get<string>("City");
					string State = input.Get<string>("State");
					string PostalCode = input.Get<string>("PostalCode");
					string Country = input.Get<string>("Country");
					string Phone = input.Get<string>("Phone");
		
					if (CountryTranslation.Keys.Contains(Country))
					{
						Country = CountryTranslation[Country];
					}
					output.Set<string>(0, UserID);
					output.Set<string>(1, Name);
					output.Set<string>(2, Address);
					output.Set<string>(3, City);
					output.Set<string>(4, State);
					output.Set<string>(5, PostalCode);
					output.Set<string>(6, Country);
					output.Set<string>(7, Phone);
		
					return output.AsReadOnly();
				}
			}
		}

5. Open Script.usql, and paste the following U-SQL script:

		@drivers =
			EXTRACT UserID      string,
					Name        string,
					Address     string,
					City        string,
					State       string,
					PostalCode  string,
					Country     string,
					Phone       string
			FROM "/Samples/Data/AmbulanceData/Drivers.txt"
			USING Extractors.Tsv(Encoding.Unicode);
		
		@drivers_CountryName =
			PROCESS @drivers
			PRODUCE UserID string,
					Name string,
					Address string,
					City string,
					State string,
					PostalCode string,
					Country string,
					Phone string
			USING new USQL_UDO.CountryName();    
		
		OUTPUT @drivers_CountryName
			TO "/Samples/Outputs/Drivers.csv"
			USING Outputters.Csv(Encoding.Unicode);

6. From **Solution Explorer**, right click **Script.usql**, and then click **Build Script**.
6. From **Solution Explorer**, right click **Script.usql**, and then click **Submit Script**.
7. If you haven't connect to your Azure subscription, you will be prompt to enter your Azure account credentials.
7. Click **Submit**. Submission results and job link are available in the Results window when the submission is completed.
8. You must click the Refresh button to see the latest job status and refresh the screen.

**To see the job output**

1. From **Server Explorer**, expand **Azure**, expand **Data Lake Analytics**, expand your Data Lake Analytics account, expand **Storage Accounts**, right-click the Default Storage, and then click **Explorer**. 
2. Expand Samples, expand Outputs, and then double-click **Drivers.csv**.


##See also

- [Get started with Data Lake Analytics using PowerShell](data-lake-analytics-get-started-powershell.md)
- [Get started with Data Lake Analytics using the Azure portal](data-lake-analytics-get-started-portal.md)
- [Use Data Lake Tools for Visual Studio for developing U-SQL applications](data-lake-analytics-data-lake-tools-get-started.md)