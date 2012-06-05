# Hadoop on Windows Azure - Working With Data

This tutorial covers several techniques for storing and importing data for use in Hadoop jobs run with Apache Hadoop-based Service for Windows Azure. Apache(TM) Hadoop(TM) is a software framework that supports data-intensive distributed applications. While Hadoop is designed to store data for such applications with its own distributed file system (HDFS), cloud-based on-demand processing can also use other forms of cloud storage such as Windows Azure storage. Collecting and importing data in such scenarios is the subject of this tutorial. 

You will learn:

* Using Windows Azure Storage in MapReduce jobs
* Importing data files to HDFS using FTPS
* Importing SQL Server data with Sqoop

This tutorial is composed of the following segments:

1. [Using Windows Azure Storage in MapReduce](#segment1).
2. [Uploading data files to HDFS using FTPS](#segment2).
3. [Importing SQL Server data with Sqoop](#segment3).

<a name="segment1"> </a>
### Using Windows Azure Storage in MapReduce

While HDFS is the natural storage solution for Hadoop jobs, data needed can also be located on cloud based, large, and scalable storage systems such as Windows Azure storage. It is reasonable to expect that Hadoop, when running on Windows Azure, be able to read data directly from such cloud storage.

In this tutorial you will analyze IIS logs located in Windows Azure storage using a standard streaming map-reduce Hadoop job. The scenario demonstrates a Windows Azure web role that generates IIS logs using the Windows Azure diagnostic infrastructure. A simple Hadoop job reads the logs directly from storage and finds the 5 most popular URIs (web pages).

### Generating the IIS Logs 

To generate IIS logs and place them in storage, we need to create a simple ASP.NET web role, enable Windows Azure Diagnostics, and configure DiagnosticInfrastructureLogs. Run the web role and browse to different pages in the web site. After one minute, an IIS log will be persisted to Windows Azure storage.

> **Note:** More on Windows Azure diagnostics can be found [here](https://www.windowsazure.com/en-us/develop/net/common-tasks/diagnostics/).


Launch Visual Studio 2010 by right-clicking on the application and choosing **Run As Administrator**. In Visual Studio, select **File -> New Project** and from the **Installed Templates** select the **Cloud** category inside the **Visual C#** node.

![windows-azure-project-template](../media/windows-azure-project-template.png)

_Windows Azure Project template_

Select the  **Windows Azure Project** template. This template launches a wizard that allows us to select the type of role to use within our project.

Name your new project **WebRoleWithIISLogs** and click **OK**. Select **ASP.NET Web Role** from the **New Windows Azure Project** window.

![selectiing a webrole](../media/selectiing-a-webrole.png)

_Selecting the ASP.NET Web Role template_

Visual Studio will now creat a new solution that contains two project. The first project, named **WebRole1**, is a standard ASP.NET Web Application project with a few additional resources added. The second project is a new Windows Azure Project that references our ASP.NET project. It also contains configuration files that define the model for our Windows Azure solution.

In **Solution Explorer**, open the **WebRole.cs** file in the **WebRole1** project.

![Selecting WebRole.cs](../media/selecting-webrolecs.png "Selecting WebRole.cs")

_The WebRoleWithIISLogs solution_

Add the following code to the **OnStart** method:


	public override bool OnStart()
        {
            // Configure IIS Logging
           DiagnosticMonitorConfiguration diagMonitorConfig = DiagnosticMonitor.GetDefaultInitialConfiguration();
 
           diagMonitorConfig.DiagnosticInfrastructureLogs.ScheduledTransferLogLevelFilter = LogLevel.Information;
           diagMonitorConfig.DiagnosticInfrastructureLogs.ScheduledTransferLogLevelFilter = LogLevel.Information;
           diagMonitorConfig.DiagnosticInfrastructureLogs.ScheduledTransferPeriod = TimeSpan.FromMinutes(1);
 
           DiagnosticMonitor.Start("Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString", diagMonitorConfig);
           return base.OnStart();
        }


In the **WebRoleWithIISLogs** project double-click the **WebRole1** node, under the **Settings** tab, add  the details of your storage account to a diagnostics connection string.

![Adding a Diagnostics Connection String](../media/adding-a-diagnostics-connection-string.png "Adding a Diagnostics Connection String")

Press **F5** to run the application. When it is open, use it to browse to different pages in the web site.

#### Writing a Map-Reduce Streaming Job 

Hadoop Streaming is a utility that lets you create and run MapReduce jobs by creating an executable or a script in any language. Both the mapper and reducer read the input from STDIN and write the output to STDOUT. For more information about Hadoop Streaming, see the [Hadoop streaming decomentation](http://hadoop.apache.org/common/docs/current/streaming.html).


Open Microsoft Visual Studio 2010 as Administrator.

Click on **New Project...** and select **Console Application**. Name it **Map**, and click **OK**.

Add the following code to **main.cs**:


	static void Main(string[] args)
        {
            if (args.Length > 0)
            {
                 Console.SetIn(new StreamReader(args[0]));
            }
 
            var counters = new Dictionary<string, int>();
 
            string line;
            while ((line = Console.ReadLine()) != null)
            {
                var words = line.Split(' ');
                foreach (var uri in words)
                {
                    if ((uri.StartsWith(@"http://")) || (uri.EndsWith(".aspx")) || (uri.EndsWith(".html")))
                    {
                        if (!counters.ContainsKey(uri))
                            counters.Add(uri, 1);
                        else
                            counters[uri]++;
 
                        Console.WriteLine(string.Format("{0}\t{1}", uri, counters[uri]));
                    }
                }
            }
        }


Right-click on the solution in Solution Explorer and select **Add** and **New Project**. Select **Console Application**, name it **Reduce**, and click **OK**.

To this new project's **main.cs**, add the following code:


	private static void Main(string[] args)
        {
            if (args.Length > 0)
            {
                Console.SetIn(new StreamReader(args[0]));
            }
 
            // counter for each uri
            var UriCounters = new Dictionary<string, int>();
            // list of the uri ordered by the counter value
            var topUriList = new SortedList<int, string>();
 
            string line;
            while ((line = Console.ReadLine()) != null)
            {
                // parse the uri and the number of request
                var values = line.Split('\t');
                string uri = values[0];
                int numOfRequests = int.Parse(values[1]);
 
                // save the max number of requests for each uri in UriCounters
                if (!UriCounters.ContainsKey(uri))
                    UriCounters.Add(uri, numOfRequests);
                else if (UriCounters[uri] < numOfRequests)
                    UriCounters[uri] = numOfRequests;
            }
 
            //Create the ordered list
            foreach (var keyValue in UriCounters)
                if (!topUriList.ContainsKey(keyValue.Value))
                    topUriList.Add(keyValue.Value, keyValue.Key);
                else
                    topUriList[keyValue.Value] = string.Format("{0} , {1}", topUriList[keyValue.Value], keyValue.Key);
 
            // make the list descending
            var lst = topUriList.Reverse().ToArray();
 
            // print the results
            for (int i = 0; (i < 5) && (i < lst.Count()); i++)
                Console.WriteLine(string.Format("{0} {1}", lst[i].Key, lst[i].Value));    
            
        }


Press **F6** to build both projects.

#### Set Up ASV in the Cluster 

Providing the storage details of the cluster enables direct access from the map-reduce jobs to the storage content.  The prefix **asv://** is used to create a uri to a specific location in Windows Azure storage (such as **asv://container/blobname**).

Open the Hadoop cluster portal at <https://www.hadooponazure.com>.

Click the **Manage Cluster** icon.

![The Manage Cluster Icon](../media/the-manage-cluster-icon.png "The Manage Cluster Icon")

Click on **Set Up ASV**.

Enter the details of your storage account.

To simplify this tutorial, we will create two new containers in your storage account and call them **fivetopuri** and **fivetopuriresults**.

> **Note:** For Uploading, downloading, and browsing files in blobs is an easy task if you install a blob storage browsing application such as Azure Storage Explorer or the CloudBerry Explorer for Azure Blob Storage. The following steps are for the [Azure Storage Explorer](http://azurestorageexplorer.codeplex.com/) application; you can use the same techniques with CloudBerry Explorer, but the steps may differ.

Open Azure Storage Explorer from **Start | All Programs | Neudesic | Azure Storage Explorer**. In the storage accounts toolbar, click the **Add Accoun**t button. The **Add Storage Account** dialog will appear.

![Add storage account](../media/add-storage-account.png)

_The Add Storage Accoutndialog box_

Input the storage account name, and the storage access key (primary access key) of your account. Click the **Add Storage Account** button to add the storage account, and approve the information message if such appears.

Create the new blob containers by click the **New** button in the **Container** toolbar.

![container toolbar](../media/container-toolbar.png)
_The Container toolbar_

Donload the IIS log you created in the previous task from the container **wad-iis-logfiles**, name the file **iislog.txt**, and upload it to the container **fivetopuri**.

![download and upload blobs](../media/download-and-upload-blobs.png)

_Downloading and uploading the blobs_ 

![Set Up ASV](../media/set-up-asv.png "Set Up ASV")

#### Copy Map-Reduce Executable Files to HDFS 

Open the Hadoop cluster portal at <https://www.hadooponazure.com>.

Open the JavaScript interactive console by FLARGENESH.

Upload the file **map.exe** by entering the following command:

	JavaScript fs.put()


 and then browsing to the map.exe executable, located in FLARGENESH. Upload it to **/example/apps/map.exe**.

Repeat the last step with **reduce.exe**, uploading it to **/example/apps/reduce.exe**.

#### Creating and Executing a New Hadoop Job 

Open the Hadoop cluster portal at <https://www.hadooponazure.com>.

Click on the **Create Job** icon.

![The Create Job icon](../media/the-create-job-icon.png "The Create Job icon")

Enter the following details:

Name: **IIS Logs**

Jar File: Browse to  **hadoop-streaming.jar** provided in FLARGENESH.

**Parameter 0**: _-files "hdfs:///example/apps/map.exe,hdfs:///example/apps/reduce.exe"_

**Parameter 1**: _-input "asv://fivetopuri/iislog.txt" -output "asv://fivetopuriresults/results.txt"_

**Parameter 2**: _-mapper "map.exe" -reducer "reduce.exe"_

![Filled out form](../media/filled-out-form.png "Filled out form")

Click **Execute Job**.

After the job completes, open the blob **results.txt/part-00000** in the container **fivetopuriresults** and look at the results. For example:

![Results](../media/results.png "Results")

<a name="segment2"> </a>
### Uploading data files to HDFS using FTPS 

Map-Reduce jobs use input data located in HDFS. There are several ways to upload data to the distributed file system, one of which uses the FTPS protocol.

More on FTPS uploading can be found at <http://social.technet.microsoft.com/wiki/contents/articles/6985.how-to-upload-data-and-use-the-wordcount-sample-with-hadoop-services-for-windows-azure-video.aspx>.

To upload data files to HDFS, you need to download an FTPS agent. This tutorial will use curl.exe, which can be found at <http://curl.haxx.se/latest.cgi?curl=win64-ssl-sspi>.

To upload the files, we will write and execute a power-shell script. The script template can be found in each of the samples provided in the cluster portal.

Before running the script, you need to open the FTPS ports. To do so, click on the **Open Ports** icon at <https://www.hadooponazure.com> and toggle the FTPS port to be opened.

![Configure Ports](../media/configure-ports.png "Configure Ports")

Now run the script. Enter the following code in PowerShell:

	PowerShell
	$serverName = "XXSERVERNAMEXX.cloudapp.net"; $userName = "XXUSERNAMEXX"; 
	$password = "XXPASSWORDXX"; 
	$fileToUpload = "iislog.txt"; $destination = "/example/data/iislog.txt"; 
	$Md5Hasher = [System.Security.Cryptography.MD5]::Create();
	$hashBytes = $Md5Hasher.ComputeHash($([Char[]]$password)) 
	foreach ($byte in $hashBytes) { $passwordHash += “{0:x2}” -f $byte } 
	$curlCmd = "PATH_TO_CURL\curl-7.23.1-win64-ssl-sspi\curl -k --ftp-create-dirs -T $fileToUpload -u $userName" 
	$curlCmd += ":$passwordHash ftps://$serverName" + ":2226$destination" 
	invoke-expression $curlCmd

> **Note:** Replace the XXSERVERNAMEXX with the cluster name, which can be found on the top of the cluster home page. for the XXUSERNAMEXX and XXPASSWORDXX enter the username and password that were provided when the cluster was created. These should be the same username and password used to activate the remote desktop console of the cluster.
> 

> **Note:** Replace the PATH_TO_CURL, with the path to the curl client, and make sure the $fileToUpload is set with the correct path of the data file to be uploaded.




![Uploading the file](../media/uploading-the-file.png "Uploading the file")

To verify that the file was uploaded open the JavaScript interactive console and execute the following command:

	JavaScript #ls /example/data/


![Verification](../media/verification.png "Verification")

<a name="segment3"> </a>
### Importing SQL Server data with Sqoop 

While Hadoop is a natural choice for processing unstructured and semi-structured data like logs and files, there may be a need to process structured data stored in relational databases as well. Sqoop (SQL-to-Hadoop) is a tool the allows you to import structured data to Hadoop and use it in MapReduce and HIVE jobs.

Download the [Adventure Works for SQL Database](http://msftdbprodsamples.codeplex.com/releases/view/37304) database. Follow the installation instructions in the _"ReadMe.htm"_ file to set up the SQL Database version of the AdventureWorks2012. Open SQL Server Managment Studio and connect to the SQL Database Server. Open the _"AdventureWorks2012"_ database and 
click the **New Query** button.

![Creating a new query in SQL Server Managment Studio](../media/creating-a-new-query-in-sql-server-managment.png)

Since Sqoop currently adds square brackets to the table name, we need to add a synonym to support two-part naming for SQL Server tables. To do so, run the following query:

	
	CREATE SYNONYM [Sales.SalesOrderDetail] FOR Sales.SalesOrderDetail


Run the following query and review its result. 

	
	select top 200 * from [Sales.SalesOrderDetail]


In the Hadoop command prompt change the directory to _"c:\Apps\dist\sqoop\bin"_ and run the following command:

	
	sqoop import --connect  
	"jdbc:sqlserver://[serverName].database.windows.net;username=[userName]@[serverName];password=[password];database=AdventureWorks2012" --table Sales.SalesOrderDetail --target-dir /data/lineitemData -m 1


Go to the Hadoop on Windows Azure portal and open the interactive console. Run the #lsr command to list the file and directories on your HDFS.

![result of #lsr](../media/result-of-lsr.png)

Run the #tail command to view selected results from the **part-m-0000** file.


	#tail /user/RAdmin/data/SalesOrderDetail/part-m-00000
 
![#tail](../media/tail.png)

## Summary 

In this tutorial we have seen how a variety of the data sources that can be used for MapReduce jobs in Hadoop on Windows Azure. Data for Hadoop jobs can be located on cloud storage or on HDFS. We have also seen how relational data can be imported into HDFS using Sqoop and then be used in Hadoop jobs.