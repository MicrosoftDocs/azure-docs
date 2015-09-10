

# Develop SQLIP User defined operators

Learn how to develop user defined operators to be used in Kona jobs. You will develop a a custom operator to calculate a score for each athlete based on the medals using the following formula: 

	GoldMedalScore * 5 + SilverMentalScore * 3 + BronzeMentalScore
	


[jgao: I think it is better to separate the following two into a different topic]

- Share your processor with team members through registering it to Kona catalog.
- Use user defined operator shared by others. 




**Prerequisites**

- Visual Studio 2015, Visual Studio 2013 with update 4, or Visual Studio 2012 with Visual C++ Installed 
- Microsoft Azure SDK for .NET version 2.5 or above.  Install it using the Web platform installer.
- A Kona account.  See kona-get-started-portal.md or knoa-get-started-powershell.md.
- Gone through the [Get started with Kona SQLIP using Visual Studio]() tutorial.
- Upload data, see [Get started with Kona SQLIP using Visual Studio]() 


## Connect to a Kona account

[jgao:  It doesn't cache the login information. This might change before the product release]

**To connect to Kona**

1. Open Visual Studio.
2. From the **SQLIP** menu, click **Options and Settings**.
4. Click **Sign In**, or **Change User** if someone has signed in, and follow the instructions to sign in.
5. Click **OK** to close the Options and Settings dialog.

**To browse your Kona accounts**

1. From Visual Studio, open **Server Explorer** by press **CTRL+ALT+S**.
2. From **Server Explorer**, expand **Azure**, and then expand **SQL IP**. You shall see a list of your Kona accounts.


## Upload source data files

Now you have connected to your Kona account.  You will still need some data to run a Kona job. The data file used in this tutorial is a tab separated file with the following fields:

        Athlete              string,
        Age                  string,
        Country              string,
        Year                 string,
        ClosingCeremonyDate  string,
        Sport                string,
        GoldMedals           string,
        SilverMedals         string,
        BronzeMedals         string,
        TotalMedals          string,

You can download a data file from [Github](https://github.com/MicrosoftBigData/ProjectKona/tree/master/SQLIPSamples/SampleData/OlympicAthletes.tsv) to your workstation.

**To upload the file to the dependent Azure Data Lake account**

1. From **Server Explorer** (open by pressing CTRL+ALT+S), expand **Azure**, expand **SQLIP**, expand your kona account, expand **Linked Storage**, right-click your Azure Data Lake Account, and then click **Explorer**.  It opens the SQlIPStudio Explorer pane.  In the left, it shows a tree view, the content view is on the right.
2. Right-click any blank space in the content view, and then click **New Folder** to create a folder called **SampleData**.

	![SQLIP Visual Studio explorer](./media/kona-sqlip-studio-get-started/kona-sqlip-studio-explorer.png)
3. Double-click **SampleData** to open its content in the content view.
4. Right-click any blank space in the content view, click **Upload**, click **As Text**. Follow the instruction to upload OlympicAthletes.tsv.

**To upload the file to a Azure Blob storage account**

See [Get started with HDInsight Tools for Visual Studio]()



## Define and call a user defined operator in SQLIP


**To create and submit a SQLIP job** 

1. From the **File** menu, click **New**, and then click **Project**.
2. Type or select the following:

	- **Templates**: SQL IP
	- **Template**: SQL Information Production Project
	- **Name**: AthleteScore
	- **Location**: c:\tutorials\kona

	![new SQLIP Visual Studio project](./media/kona-sqlip-studio-get-started/kona-sqlip-studio-new-project.png)

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

	Until now, I haven't defined the custom operator.

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

1. From **Server Explorer**, expand **Azure**, expand **SQL IP**, expand your Kona account, expand **Linked Storage**, right-click the dependent Azure Data Lake account, and then click **Explorer**. 
2.  Double-click **SampleData**.
3.  Double-click **OlympicAthletes_Score.tsv**.


##See also

- Get started with Kona using PowerShell
- Get started with Kona using the Azure portal
- Get started using Kona SQLIP Studio