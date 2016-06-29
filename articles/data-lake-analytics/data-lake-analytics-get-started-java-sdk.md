<properties
   pageTitle="Use Data Lake Analytics Java SDK to develop applications | Azure"
   description="Use Azure Data Lake Analytics Java SDK to develop applications"
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

# Tutorial: Get started with Azure Data Lake Analytics using Java SDK

[AZURE.INCLUDE [get-started-selector](../../includes/data-lake-analytics-selector-get-started.md)]

Learn how to use the Azure Data Lake Analytics Java SDK to create an Azure Data Lake account and perform basic operations such as create folders, upload and download data files, delete your account, and work with jobs. For more information about Data Lake, see [Azure Data Lake Analytics](data-lake-analytics-overview.md).

In this tutorial, you will develop a Java console application which contains samples of common administrative tasks as well as creating test data and submitting a job.  To go through the same tutorial using other supported tools, click the tabs on the top of this section.

[AZURE.INCLUDE [basic-process-include](../../includes/data-lake-analytics-basic-process.md)]

## Prerequisites

* Java Development Kit (JDK) 8 (using Java version 1.8).
* IntelliJ or another suitable Java development environment. This is optional but recommended. The instructions below use IntelliJ.
* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
* **Enable your Azure subscription** for Data Lake Analytics public preview. See [instructions](data-lake-analytics-get-started-portal.md#signup).
* Create an Azure Active Directory (AAD) application and retrieve its **Client ID**, **Tenant ID**, and **Key**. For more information about AAD applications and instructions on how to get a client ID, see [Create Active Directory application and service principal using portal](../resource-group-create-service-principal-portal.md). The Reply URI and Key will also be available from the portal once you have the application created and key generated.

## How do I authenticate using Azure Active Directory?

The code snippet below provides code for **non-interactive** authentication, where the application provides its own credentials.

You will need to give your application permission to create resources in Azure for this tutorial to work. It is **highly recommended** that you only give this application Contributor permissions to a new, unused, and empty resource group in your Azure subscription for the purposes of this tutorial.

## Create a Java application

1. Open IntelliJ and create a new Java project using the **Command Line App** template.

2. Right-click on the project on the left-hand side of your screen and click **Add Framework Support**. Choose **Maven** and click **OK**.

3. Open the newly created **"pom.xml"** file and add the following snippet of text between the **\</version>** tag and the **\</project>** tag:

    NOTE: This step is temporary until the Azure Data Lake Analytics SDK is available in Maven. This article will be updated once the SDK is available in Maven. All future updates to this SDK will be availble through Maven.

        <repositories>
        	<repository>
	            <id>adx-snapshots</id>
	            <name>Azure ADX Snapshots</name>
	            <url>http://adxsnapshots.azurewebsites.net/</url>
	            <layout>default</layout>
	            <snapshots>
                	<enabled>true</enabled>
            	</snapshots>
        	</repository>
        	<repository>
	            <id>oss-snapshots</id>
	            <name>Open Source Snapshots</name>
	            <url>https://oss.sonatype.org/content/repositories/snapshots/</url>
	            <layout>default</layout>
	            <snapshots>
	                <enabled>true</enabled>
	                <updatePolicy>always</updatePolicy>
	            </snapshots>
        	</repository>
    	</repositories>
    	<dependencies>
	        <dependency>
	            <groupId>com.microsoft.azure</groupId>
	            <artifactId>azure-client-authentication</artifactId>
	            <version>1.0.0-20160513.000802-24</version>
	        </dependency>
	        <dependency>
	            <groupId>com.microsoft.azure</groupId>
	            <artifactId>azure-client-runtime</artifactId>
	            <version>1.0.0-20160513.000812-28</version>
	        </dependency>
	        <dependency>
	            <groupId>com.microsoft.rest</groupId>
	            <artifactId>client-runtime</artifactId>
	            <version>1.0.0-20160513.000825-29</version>
	        </dependency>
	        <dependency>
	            <groupId>com.microsoft.azure</groupId>
	            <artifactId>azure-mgmt-datalake-store</artifactId>
	            <version>1.0.0-SNAPSHOT</version>
	        </dependency>
	        <dependency>
	            <groupId>com.microsoft.azure</groupId>
	            <artifactId>azure-mgmt-datalake-analytics</artifactId>
	            <version>1.0.0-SNAPSHOT</version>
	        </dependency>
    	</dependencies>


4. Go to **File**, then **Settings**, then **Build**, **Execution**, **Deployment**. Select **Build Tools**, **Maven**, **Importing**. Then check **Import Maven projects automatically**.

5. Open **Main.java** and replace the existing code block with the following code. Also, provide the values for parameters called out in the code snippet, such as **localFolderPath**, **_adlaAccountName**, **_adlsAccountName**, **_resourceGroupName** and replace placeholders for **CLIENT-ID**, **CLIENT-SECRET**, **TENANT-ID**, and **SUBSCRIPTION-ID**.

	This code goes through the process of creating Data Lake Store and Data Lake Analytics accounts, creating files in the store, running a job, getting job status, downloading job output, and finally deleting the account.

	>[AZURE.NOTE] There is currently a known issue with the Azure Data Lake Service.  If the sample app is interrupted or encounters an error, you may need to manually delete the Data Lake Store & Data Lake Analytics accounts that the script creates.  If you're not familiar with the Portal, the [Manage Azure Data Lake Analytics using Azure Portal](data-lake-analytics-manage-use-portal.md) guide will get you started.


		package com.company;

		import com.microsoft.azure.CloudException;
		import com.microsoft.azure.credentials.ApplicationTokenCredentials;
		import com.microsoft.azure.management.datalake.store.*;
		import com.microsoft.azure.management.datalake.store.models.*;
		import com.microsoft.azure.management.datalake.analytics.*;
		import com.microsoft.azure.management.datalake.analytics.models.*;
		import com.microsoft.rest.credentials.ServiceClientCredentials;
		import java.io.*;
		import java.nio.charset.Charset;
		import java.nio.file.Files;
		import java.nio.file.Paths;
		import java.util.ArrayList;
		import java.util.UUID;
		import java.util.List;
		
		public class Main {
		    private static String _adlsAccountName;
		    private static String _adlaAccountName;
		    private static String _resourceGroupName;
		    private static String _location;
		
		    private static String _tenantId;
		    private static String _subId;
		    private static String _clientId;
		    private static String _clientSecret;
		
		    private static DataLakeStoreAccountManagementClient _adlsClient;
		    private static DataLakeStoreFileSystemManagementClient _adlsFileSystemClient;
		    private static DataLakeAnalyticsAccountManagementClient _adlaClient;
		    private static DataLakeAnalyticsJobManagementClient _adlaJobClient;
		    private static DataLakeAnalyticsCatalogManagementClient _adlaCatalogClient;
		
		    public static void main(String[] args) throws Exception {
		        _adlsAccountName = "<DATA-LAKE-STORE-NAME>";
		        _adlaAccountName = "<DATA-LAKE-ANALYTICS-NAME>";
		        _resourceGroupName = "<RESOURCE-GROUP-NAME>";
		        _location = "East US 2";
		
		        _tenantId = "<TENANT-ID>";
		        _subId =  "<SUBSCRIPTION-ID>";
		        _clientId = "<CLIENT-ID>";
		
		        _clientSecret = "<CLIENT-SECRET>"; // TODO: For production scenarios, we recommend that you replace this line with a more secure way of acquiring the application client secret, rather than hard-coding it in the source code.
		
		        String localFolderPath = "C:\\local_path\\"; // TODO: Change this to any unused, new, empty folder on your local machine.
		
		        // Authenticate
		        ApplicationTokenCredentials creds = new ApplicationTokenCredentials(_clientId, _tenantId, _clientSecret, null);
		        SetupClients(creds);
		
		        // Create Data Lake Store and Analytics accounts
		        WaitForNewline("Authenticated.", "Creating NEW accounts.");
		        CreateAccounts();
		        WaitForNewline("Accounts created.", "Displaying accounts.");
		
		        // List Data Lake Store and Analytics accounts that this app can access
		        System.out.println(String.format("All ADL Store accounts that this app can access in subscription %s:", _subId));
		        List<DataLakeStoreAccount> adlsListResult = _adlsClient.getAccountOperations().list().getBody();
		        for (DataLakeStoreAccount acct : adlsListResult) {
		            System.out.println(acct.getName());
		        }
		        System.out.println(String.format("All ADL Analytics accounts that this app can access in subscription %s:", _subId));
		        List<DataLakeAnalyticsAccount> adlaListResult = _adlaClient.getAccountOperations().list().getBody();
		        for (DataLakeAnalyticsAccount acct : adlaListResult) {
		            System.out.println(acct.getName());
		        }
		        WaitForNewline("Accounts displayed.", "Creating files.");
		
		        // Create a file in Data Lake Store: input1.csv
		        // TODO: these change order in the next patch
		        byte[] bytesContents = "123,abc".getBytes();
		        _adlsFileSystemClient.getFileSystemOperations().create(_adlsAccountName, "/input1.csv", bytesContents, true);
		
		        WaitForNewline("File created.", "Submitting a job.");
		
		        // Submit a job to Data Lake Analytics
		        UUID jobId = SubmitJobByScript("@input =  EXTRACT Data string FROM \"/input1.csv\" USING Extractors.Csv(); OUTPUT @input TO @\"/output1.csv\" USING Outputters.Csv();", "testJob");
		        WaitForNewline("Job submitted.", "Getting job status.");
		
		        // Wait for job completion and output job status
		        System.out.println(String.format("Job status: %s", GetJobStatus(jobId)));
		        System.out.println("Waiting for job completion.");
		        WaitForJob(jobId);
		        System.out.println(String.format("Job status: %s", GetJobStatus(jobId)));
		        WaitForNewline("Job completed.", "Downloading job output.");
		
		        // Download job output from Data Lake Store
		        DownloadFile("/output1.csv", localFolderPath + "output1.csv");
		        WaitForNewline("Job output downloaded.", "Deleting file.");
		
		        // Delete file from Data Lake Store
		        DeleteFile("/output1.csv");
		        WaitForNewline("File deleted.", "Deleting account.");
		
		        // Delete account
		        _adlsClient.getAccountOperations().delete(_resourceGroupName, _adlsAccountName);
		        _adlaClient.getAccountOperations().delete(_resourceGroupName, _adlaAccountName);
		        WaitForNewline("Account deleted.", "DONE.");
		    }
		
		    //Set up clients
		    public static void SetupClients(ServiceClientCredentials creds)
		    {
		        _adlsClient = new DataLakeStoreAccountManagementClientImpl(creds);
		        _adlsFileSystemClient = new DataLakeStoreFileSystemManagementClientImpl(creds);
		        _adlaClient = new DataLakeAnalyticsAccountManagementClientImpl(creds);
		        _adlaJobClient = new DataLakeAnalyticsJobManagementClientImpl(creds);
		        _adlaCatalogClient = new DataLakeAnalyticsCatalogManagementClientImpl(creds);
		        _adlsClient.setSubscriptionId(_subId);
		        _adlaClient.setSubscriptionId(_subId);
		    }
		
		    // Helper function to show status and wait for user input
		    public static void WaitForNewline(String reason, String nextAction)
		    {
		        if (nextAction == null)
		            nextAction = "";
		
		        System.out.println(reason + "\r\nPress ENTER to continue...");
		        try{System.in.read();}
		        catch(Exception e){}
		
		        if (!nextAction.isEmpty())
		        {
		            System.out.println(nextAction);
		        }
		    }
		
		    // Create Data Lake Store and Analytics accounts
		    public static void CreateAccounts() throws InterruptedException, CloudException, IOException {
		        // Create ADLS account
		        DataLakeStoreAccount adlsParameters = new DataLakeStoreAccount();
		        adlsParameters.setLocation(_location);
		
		        _adlsClient.getAccountOperations().create(_resourceGroupName, _adlsAccountName, adlsParameters);
		
		        // Create ADLA account
		        DataLakeStoreAccountInfo adlsInfo = new DataLakeStoreAccountInfo();
		        adlsInfo.setName(_adlsAccountName);
		
		        DataLakeStoreAccountInfoProperties adlsInfoProperties = new DataLakeStoreAccountInfoProperties();
		        adlsInfo.setProperties(adlsInfoProperties);
		
		        List<DataLakeStoreAccountInfo> adlsInfoList = new ArrayList<DataLakeStoreAccountInfo>();
		        adlsInfoList.add(adlsInfo);
		
		        DataLakeAnalyticsAccountProperties adlaProperties = new DataLakeAnalyticsAccountProperties();
		        adlaProperties.setDataLakeStoreAccounts(adlsInfoList);
		        adlaProperties.setDefaultDataLakeStoreAccount(_adlsAccountName);
		
		        DataLakeAnalyticsAccount adlaParameters = new DataLakeAnalyticsAccount();
		        adlaParameters.setLocation(_location);
		        adlaParameters.setName(_adlaAccountName);
		        adlaParameters.setProperties(adlaProperties);
		
		            /* If this line generates an error message like "The deep update for property 'DataLakeStoreAccounts' is not supported", please delete the ADLS and ADLA accounts via the portal and re-run your script. */
		
		        _adlaClient.getAccountOperations().create(_resourceGroupName, _adlaAccountName, adlaParameters);
		    }
		
		    //todo: this changes in the next version of the API
		    public static void CreateFile(String path, String contents, boolean force) throws IOException, CloudException {
		        byte[] bytesContents = contents.getBytes();
		
		        _adlsFileSystemClient.getFileSystemOperations().create(_adlsAccountName, path, bytesContents, force);
		    }
		
		    public static void DeleteFile(String filePath) throws IOException, CloudException {
		        _adlsFileSystemClient.getFileSystemOperations().delete(filePath, _adlsAccountName);
		    }
		
		    // Download file
		    public static void DownloadFile(String srcPath, String destPath) throws IOException, CloudException {
		        InputStream stream = _adlsFileSystemClient.getFileSystemOperations().open(srcPath, _adlsAccountName).getBody();
		
		        PrintWriter pWriter = new PrintWriter(destPath, Charset.defaultCharset().name());
		
		        String fileContents = "";
		        if (stream != null) {
		            Writer writer = new StringWriter();
		
		            char[] buffer = new char[1024];
		            try {
		                Reader reader = new BufferedReader(
		                        new InputStreamReader(stream, "UTF-8"));
		                int n;
		                while ((n = reader.read(buffer)) != -1) {
		                    writer.write(buffer, 0, n);
		                }
		            } finally {
		                stream.close();
		            }
		            fileContents =  writer.toString();
		        }
		
		        pWriter.println(fileContents);
		        pWriter.close();
		    }
		
		    // Submit a U-SQL job by providing script contents.
		    // Returns the job ID
		    public static UUID SubmitJobByScript(String script, String jobName) throws IOException, CloudException {
		        UUID jobId = java.util.UUID.randomUUID();
		        USqlJobProperties properties = new USqlJobProperties();
		        properties.setScript(script);
		        JobInformation parameters = new JobInformation();
		        parameters.setName(jobName);
		        parameters.setJobId(jobId);
		        parameters.setType(JobType.USQL);
		        parameters.setProperties(properties);
		
		        JobInformation jobInfo = _adlaJobClient.getJobOperations().create(_adlaAccountName, jobId, parameters).getBody();
		
		        return jobId;
		    }
		
		    // Wait for job completion
		    public static JobResult WaitForJob(UUID jobId) throws IOException, CloudException {
		        JobInformation jobInfo = _adlaJobClient.getJobOperations().get(_adlaAccountName, jobId).getBody();
		        while (jobInfo.getState() != JobState.ENDED)
		        {
		            jobInfo = _adlaJobClient.getJobOperations().get(_adlaAccountName,jobId).getBody();
		        }
		        return jobInfo.getResult();
		    }
		
		    // Get job status
		    public static String GetJobStatus(UUID jobId) throws IOException, CloudException {
		        JobInformation jobInfo = _adlaJobClient.getJobOperations().get(_adlaAccountName, jobId).getBody();
		        return jobInfo.getState().toValue();
		    }
		}

6. Follow the prompts to run and complete the application.


## See also

- To see the same tutorial using other tools, click the tab selectors on the top of the page.
- To see a more complex query, see [Analyze Website logs using Azure Data Lake Analytics](data-lake-analytics-analyze-weblogs.md).
- To get started developing U-SQL applications, see [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md).
- To learn U-SQL, see [Get started with Azure Data Lake Analytics U-SQL language](data-lake-analytics-u-sql-get-started.md), and [U-SQL language reference](http://go.microsoft.com/fwlink/?LinkId=691348).
- For management tasks, see [Manage Azure Data Lake Analytics using Azure Portal](data-lake-analytics-manage-use-portal.md).
- To get an overview of Data Lake Analytics, see [Azure Data Lake Analytics overview](data-lake-analytics-overview.md).
