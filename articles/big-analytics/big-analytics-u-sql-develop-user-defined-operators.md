<properties 
   pageTitle="Develop U-SQL User defined operators for Azure Big Analytics jobs | Azure" 
   description="Learn how to develop user defined operators to be used and reused in Big Analytics jobs. " 
   services="big-analytics" 
   documentationCenter="" 
   authors="mumian" 
   manager="paulettm" 
   editor="cgronlun"/>
 
<tags
   ms.service="big-analytics"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data" 
   ms.date="09/29/2015"
   ms.author="jgao"/>


# Develop U-SQL User defined operators for Azure Big Analytics jobs

Learn how to develop user defined operators to be used and reused in Big Analytics jobs. You will develop a custom operator to calculate a score for each athlete based on the medals using the following formula: 

	GoldMedalScore * 5 + SilverMentalScore * 3 + BronzeMentalScore

[jgao: I think it is better to separate the following two into a different topic]

- Share your processor with team members through registering it to Big Analytics catalog.
- Use user defined operator shared by others. 


**Prerequisites**

- Visual Studio 2015, Visual Studio 2013 update 4, or Visual Studio 2012 with Visual C++ Installed 
- Microsoft Azure SDK for .NET version 2.5 or above.  Install it using the Web platform installer.
- A Big Analytics account.  See [Get Started with Azure Big Analytics using Azure Preview Portal](big-analytics-get-started-portal.md) or [Get Started with Azure Big Analytics using Azure PowerShell](big-analytics-get-started-powershell.md).
- Go through the [Get started with Azure Big Analytics U-SQL Studio](big-analytics-u-sql-studio-get-started.md) tutorial.
- Connect to Azure, see [Get started with Azure Big Analtyics U-SQL Studio](big-analytics-u-sql-studio-get-started.md#connect-to-azure). 
- Upload inbound data, see [Get started with Azure Big Analtyics U-SQL Studio](big-analytics-u-sql-studio-get-started.md#upload-source-data-files). 

## Define and call a user defined operator in SQLIP

**To create and submit a SQLIP job** 

1. From the **File** menu, click **New**, and then click **Project**.
2. Type or select the following:

	- **Templates**: SQL IP
	- **Template**: SQL Information Production Project
	- **Name**: AthleteScore
	- **Location**: c:\tutorials\aba

	![new SQLIP Visual Studio project](./media/big-analytics-u-sql-studio-get-started/big-analytics-u-sql-studio-new-project.png)

3. Click **OK**. Visual studio creates a solution with a Script.sip file.
4. Enter the following script into the Script.sip file:

		@athletes =
		    EXTRACT
		        Athlete              string,
		        Age                  string,
		        Country              string,
		        Year                 string,
		        ClosingCeremonyDate  string,
		        Sport                string,
		        GoldMedals           string,
		        SilverMedals         string,
		        BronzeMedals         string,
		        TotalMedals          string
		    FROM @"/SampleData/OlympicAthletes.tsv"
		    USING new DefaultTextExtractor();
		
		@athletes_Score =
		    PROCESS @athletes
		    PRODUCE Athlete string,
		            Age string,
		            Country string,
		            Year string,
		            ClosingCeremonyDate string,
		            Sport string,
		            GoldMedals string,
		            SilverMedals string,
		            BronzeMedals string,
		            TotalMedals string
		    USING new AthletesScore.AthletesScoreProcessor();
		
		OUTPUT @athletes_Score
		TO @"wasb://<yourContainer>@<yourStorageAccount>/OlympicAthletes_Score.tsv"
		USING new DefaultTextOutputter();

	In the script, DefaultTextExtractor is used to read data from the default Azure Data Lake account.  I then create another variable called @athletes_Score using a custom operator.  At the end, I output @athletes_Score to my Azure Data Lake account. 

	Until now, I haven't defined the custom operator yet.

5. From **Solution Explorer**, expand **Script.sip**, and then double-click **Script.sip.cs** to open it.
6. Paste the following code into Script.sip.cs:

		using Microsoft.SCOPE.Types;
		using Microsoft.SCOPE.Interfaces;
		using System;
		using System.Collections.Generic;
		using System.IO;
		using System.Text;
		
		namespace AthletesScope
		{
		    public class AthletesScoreProcessor : IProcessor
		    {
		        public override IRow Process(IRow input, IUpdatableRow output)
		        {
		            {
		                string Score;
		                int GoldMedalScore, SilverMentalScore, BronzeMentalScore;
		                string Athlete = input.Get<string>("Athlete");
		                string Age = input.Get<string>("Age");
		                string Country = input.Get<string>("Country");
		                string Year = input.Get<string>("Year");
		                string ClosingCeremonyDate = input.Get<string>("ClosingCeremonyDate");
		                string Sport = input.Get<string>("Sport");
		                string GoldMedals = input.Get<string>("GoldMedals");
		                string SilverMedals = input.Get<string>("SilverMedals");
		                string BronzeMedals = input.Get<string>("BronzeMedals");
		                string TotalMedals = input.Get<string>("TotalMedals");

		                int.TryParse(GoldMedals, out GoldMedalScore);
		                int.TryParse(SilverMedals, out SilverMentalScore);
		                int.TryParse(BronzeMedals, out BronzeMentalScore);
		                Score = (GoldMedalScore * 5 + SilverMentalScore * 3 + BronzeMentalScore).ToString();
		
		                output.Set(0, Athlete);
		                output.Set(1, Age);
		                output.Set(2, Country);
		                output.Set(3, Year);
		                output.Set(4, ClosingCeremonyDate);
		                output.Set(5, Sport);
		                output.Set(6, Score);
		                output.Set(7, TotalMedals);
		
		                return output.AsReadOnly();
		            }
		        }
		    } 
		}

6. From **Solution Explorer**, right click **Script.sip**, and then click **Build Script**.
6. From **Solution Explorer**, right click **Script.sip**, and then click **Submit Script**.
7. If you haven't connect to your Azure subscription, you will be prompt to enter your Azure account credentials.
7. Click **Submit**. Submission results and job link are available in the SqlipStudio Results window when the submission is completed.
8. You must click the Refresh button to see the latest job status and refresh the screen.

**To see the job output**

1. From **Server Explorer**, expand **Azure**, expand **SQL IP**, expand your Big Analytics account, expand **Linked Storage**, right-click the dependent Azure Data Lake account, and then click **Explorer**. 
2.  Double-click **SampleData**.
3.  Double-click **OlympicAthletes_Score.tsv**.


##See also

- [Get started with Big Analytics using PowerShell](big-analytics-get-started-powershell.md)
- [Get started with Big Analytics using the Azure portal](big-analytics-get-started-portal.md)
- [Get started using Big Analytics SQLIP Studio](big-analytics-u-sql-studio-get-started.md)