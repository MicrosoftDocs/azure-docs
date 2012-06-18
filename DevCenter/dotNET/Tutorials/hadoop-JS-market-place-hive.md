# Running Hadoop Jobs on Windows Azure, Importing Data from Windows Azure Marketplace, and Analysing the Data with the Excel Hive Add-In 

This tutorial shows two ways run MapReduce programs in a cluster using Apache™ Hadoop™-based Services for Windows Azure and how to analyse data imported into the cluster from Excel using Hive-based connectivity. 

The first way to run a MapReduce program is with a Hadoop jar file using the **Create Job** UI. The second way is with a query using the fluent API layered on Pig that is provided by the **Interactive Console**. The first approach uses a MapReduce program written in Java; the second uses a script written in Javascript. The tutorial also shows how to upload files to the HDFS cluster that are needed as input for a MapReduce program and how to read the MapReduce output files from the HDFS cluster to exmine the results of an analysis.

The Windows Azure Marketplace collects data, imagery, and real-time web services from leading commercial data providers and authoritative public data sources. It simplifies the purchase and consumption of a wide variety of data including demographic, environment, financial, retail and sports. This tutorial shows how to upload this data into a Hadoop on Windows Azure and query is using Hive scripts.

A key feature of Microsoft’s Big Data Solution is the integration of Hadoop with Microsoft Business Intelligence (BI) components. A good example of this is the ability for Excel to connect to the Hive data warehouse framework in the Hadoop cluster. This tutorial shows how to use Excel via the Hive ODBC driver to access and view data in the cluster. 
	
You will learn: 

* How to run a basic Java MapReduce program using a Hadoop jar file
* How to upload input files to the HDFS cluster and read output files from the HDFS cluster  
* How to run a JavaScript MapReduce script with a query using the fluent API on Pig that is provided by the Interactive JavaScript Console.
* How to import data from DataMarket into an Hadoop on Windows Azure cluster using the Interactive Hive Console.
* How to use Excel to query data stored in an Hadoop on Windows Azure cluster. 

This tutorial is composed of the following segments:

1. [How to run a basic Java MapReduce program using a Hadoop jar file with the Create Job UI](#segment1).
2. [How to run a JavaScript MapReduce script using the Interactive Console](#segment2).
3. [How to import data with the Hive Interactive  Console from DataMarket](#segment3).
4. [How to connect to and query Hive data in a cluster from Excel](#segment4).

<a name="setup"></a>
### Setup and Configuration 

You must have an account to access Hadoop on Windows Azure and have created a cluster to work through this tutorial. To obtain an account and create an Hadoop cluster, follow the instructions outlined in the _Getting started with Microsoft Hadoop on Windows Azure_ section of the _[Introduction to Apache Hadoop-based Sevice for Windows Azure](/en-us/develop/net/tutorials/intro-to-hadoop/)_ topic.


<a name="segment1"></a>
### How to run a basic Java MapReduce program using a Hadoop jar file with the Create Job UI 

From your **Account** page, click on the **Create Job** icon in the **Your Tasks** section. This brings up the **Create Job** UI.
![CreateJobUI](../media/createjobui.png "The Create Job UI")

To run a MapReduce program you need to specify the Job Name and the JAR File to use. Parameters are added to specify the name of the MapReduce program to run, the location of input and code files, and an output directory.

To see a simple example of how this interface is used to run the MapReduce job, let's look at the Pi Estimator sample. Return to your **Account** page. Scroll down to the **Samples** icon in the **Manage your account** section and click on it. 

From your **Account** page, scroll down to the **Samples** icon in the **Manage your account** section and click on it.   

Click on the **Pi Estimator** sample icon in the Hadoop Sample Gallery.
![PiEstimatorSample](../media/piestimatorsample.png "Pi Estimator Sample")

On the **Pi Estimator** page, information is provided about the application and downloads are make available for Java MapReduce programs and the jar file that contains the files needed by Hadoop on Windows Azure to deploy the application.

Click on the **Deploy to your cluster** button on the right side to deploy the files to the cluster.
![PiEstimatorCreateJob](../media/piestimatorcreatejob.png "Pi Estimator Create Job UI")

The fields on the **Create Job** page are populated for you in this example. The first parameter value defaults to "pi 16 10000000". The first number indicates how many maps to create (default is 16) and the second number indicates how many samples are generated per map (10 million by default). So this program uses 160 million random points to make its estimate of Pi. The **Final Command** is automatically constructed for you from the specified parameters and jar file.

To run the program on the Hadoop cluster, simply click on the blue **Execute job** button on the right side of the page.

The status of the job is displayed on the page and will change to  _Completed Sucessfully_ when it is done.The result is displayed at the bottom of the Output(stdout) section. For the default parameters, the result is Pi = 3.14159155000000000000 which is accurate to 8 decimal place, when rounded.

![PiEstimatorSampleResult](../media/piestimatorsampleresult.png "Pi Estimator Sample Result")

<a name="segment2"></a>
### How to run a JavaScript MapReduce script using the Interactive Console 
This segment shows how to run a MapReduce job with a  query using the fluent API layered on Pig that is provided by the **Interactive Console**. This example requires an input data file. The WordCount sample that we will use here has already had this file uploaded to the cluster. But the sample does require that the .js script be uploaded to the cluster and we will use this step to show the procedure for uploading files to HDFS from the **Interactive Console**.

First we need to download a copy of the WordCount.js script to your local machine. We need it to be stored locally to upload it the the cluster. Click [here](http://isoprodstore.blob.core.windows.net/isotopectp/examples/WordCount.js "JavaScript.js") and save a copy of the WordCount.js file to your local ../downloads directory. In addition we need to download the _The Notebooks of Leonardo Da Vinci_, available [here](http://isoprodstore.blob.core.windows.net/isotopectp/examples/davinci.txt). 

To get to the Interactive JavaScript console, return to your [Account](https://www.hadooponazure.com/Account) page. Scroll down to the **Your Cluster** section and click on the **Interactive Console** icon to bring up the [Interactive JavaScript console](https://www.hadooponazure.com/Cluster/InteractiveJS).
![InteractiveJsPage](../media/interactivejspage.png "Interactive JS Page")

To upload the JavaScript.js file to the cluster, enter the upload command `fs.put()` at the js> console and select the Wordcount.js form your downloads folder, for the Destination parameter use **./WordCount.js/**.

![WordCountSampleUploadWindow](../media/wordcountsampleuploadwindow.png "WordCount Sample Upload Window")	
Click the **Browse** button for the **Source**, navigate to the ../downloads directory and select the WordCount.js file. Enter the **Destination** value as shown and click the **Upload** button.

Repeat this step to upload the **davinci.txt** file using **./example/data/** for the Destination.

Execute the MapReduce program from the js> console using the following command:

`
pig.from("/example/data/davinci.txt").mapReduce("WordCount.js", "word, count:long").orderBy("count DESC").take(10).to("DaVinciTop10Words")`

Scroll to the right and click on **view log** if you want to observe the details of the job's progress. This log will also provide diagnostics if the job fails to complete. 

To display the results in the DaVinciTop10Words directory once the job completes, use the `file = fs.read("DaVinciTop10Words")`	command at the js> prompt.

![WordCountSampleReadTop10](../media/wordcountsamplereadtop10.png "WordCount Sample Read Top10")


<a name="segment3"></a>
### How to import data with the Hive Interactive  Console from DataMarket 

Open the [Windows Azure Marketplace](https://datamarket.azure.com/ "DataMarket") page in a browser and sign in with a valid Windlows Live ID.

![DataMarketFrontPage](../media/datamarketfrontpage.png "DataMarketFrontPage")

Click on the **MyAccount** tab and complete the Registration form to open a subscription account.

![DataMarketRegistration](../media/datamarketregistration.png "Data Market Registration")	
	
Note the value of the default Account key assigned to your account. Account keys are used by applications to access your Windows Azure Marketplace dataset subscriptions.

![DataMarketAccountKeys](../media/datamarketaccountkeys.png "Data Market Account Keys")


Click on the **Data** menu icon in the middle of the menu bar near the top of the page. Enter "crime" into the search the marketplace box on the upper right of the page and **Enter**.

![DataMarketCrimeDataSearch](../media/datamarketcrimedatasearch.png "DataMarket Crime Data Search")

Select the 2006-2008 Crime in the United States (Data.gov) date.

![DataMarketCrimeData](../media/datamarketcrimedata.png "Data Market Crime Data")

Press the **SUBSCRIBE** button on the right side of the page. Note that there is no cost for subscribing. Agree to the conditions on the Sign Up page and click the **Sign Up** button.

![DataMarketCrimeDataExplore](../media/datamarketcrimedataexplore.png "DataMarket Crime Data Explore")

This brings up the RECEIPT page. Press the **EXPLORE THIS DATASET** button to bring up a window where you can build your query.

![DataMarketQueryCrimeData](../media/datamarketquerycrimedata.png "DataMarket Query Crime Data")


Press the **RUN QUERY** button on the right side of the page to run the query without any parameters. Note the name of the query and the name of the table, and then click on the **DEVELOP** tab to reveal the query that was auto generated.  Copy this query.

![DataMarketQueryCrimeResult](../media/datamarketquerycrimeresult.png "DataMarket Query Crime Result")

Return to your Hadoop on Windows Azure Account page, scroll down to the **Your Cluster** section and click on **Manage Cluster** icon.  
![ManageClosterIconOnAccountPage](../media/manageclostericononaccountpage.png "Manage Closter Icon On Account Page")

Select the **DataMarket** icon option for importing data from Windows Azure DataMarket. 

![ManageClusterDataMarketOption](../media/manageclusterdatamarketoption.png "Manage Cluster Data Market Option")
		
Enter the subcription **User name** and **passkey**, **Query** and **Hive table name** obtained from your DataMarket account. Your user name is the email used for you Live ID. The value for the passkey is the account key default value assigned to you when you opened your Marketplace account.It can also be found as the Primary Account Key value on you Marketplace Account Details page. After the parameters are entered, press the **Import Data** button.

![ImportFromDataMarket](../media/importfromdatamarket.png "Import From Data Market")

The progress made importing is reported on the Data Market Import page that appears.

![CrimeDataImportProgress](../media/crimedataimportprogress.png "Crime Data Import Progress")

When the import task completes, return to your Account page and select the **Interactive Console** icon from the **Your Cluster** section. Then press the **Hive** option on the console page.

![crimedatahiveconsole](../media/crimedatahiveconsole.png "Crime Data Hive Console")

Enter this code snippet - 

	create table crime_results as select city, max(violentcrime) 
	as maxviolentcrime from crime_data 
	group by city order by maxviolentcrime desc limit 10



Then press the **Evaluate** button.

![CrimeDataHiveConsoleWithQuery](../media/crimedatahiveconsolewithquery.png "Crime Data Hive Console With Query")




<a name="segment4"></a>
### How to connect to and query Hive data in a cluster from Excel 

Return to your Account page and select the **Open Ports** icon from the **Your Cluster** section to open the Configure Ports page. Open the ODBC Server on port 10000 by clicking on its Toggle button.

![OpenODBCPort10000](../media/openodbcport10000.png "Open ODBC Port 10000")

Return to your Account page and select the **Downloads** icon from the **Manage your account** section and select the appropriate .msi file to install the Hive ODBC drivers and Excel Hive Add-In.

![DownloadLinkHiveODBC](../media/downloadlinkhiveodbc.png "Download Link Hive ODBC")

Select the **Run anyway** option from the **SmartScreen Filter** window that pops up.
  
![RunawayHiveODBC](../media/runawayhiveodbc.png "Runaway Hive ODBC")

Open Excel after the installation completes.  Under data menu click on the **Hive Panel**.

![ExcelDataMenuHivePanel](../media/exceldatamenuhivepanel.png "Excel Data Menu Hive Panel")

Press the **Enter Cluster Details** button on the **Hive Query** panel on the left.

![ExcelHiveCredentials](../media/excelhivecredentials.png "Excel Hive Credentials")

Provide a description for your cluster, enter localhost for the Host value and 10000 for the port number. Enter your credentials for your Hadoop on Windows Azure cluster in the Unsername/Password option in the **Authentication** section. Then click **OK**.

![ExcelODBCHiveSetupWindow](../media/excelodbchivesetupwindow.png "Excel ODBC Hive Setup Window")

From the **Hive Query** panel, select crime_results from **Select the Hive Object to Query** menu. Then check city and maxviolentcrime in the **Columns** section.  
Click on the HiveQL to reveal the query: `select city, mazviolentcrime from crime_results limit 200`

Click on **Execute Query** button.

![ExcelExecuteHiveQuery](../media/excelexecutehivequery.png "Excel Execute Hive Query")

This should display the the cities with the most violent crime. From the **Insert** menu, select the Bar option to insert a bar chart on to the page to obtain a visualization of the data.

![ExcelHiveQueryResults](../media/excelhivequeryresults.png "Excel Hive Query Results")


---

<a name="summary"></a>
## Summary 
 
In this tutorial, you have seen two ways to run MapReduce jobs using the Hadoop on Windows Azure portal. One used the **Create Job** UI to run a Java MapReduce program using a jar file. The other used the **Interactive Console** to run a MapReduce job using a .js script within a Pig query.
You have also seen how to upload this data into Hadoop on Windows Azure and query it using Hive scripts from the **Interactive Console**. 
Finally, you have seen how to use Excel via the Hive ODBC driver to access and view data that is stored in the HDFS cluster.