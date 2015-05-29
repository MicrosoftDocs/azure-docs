<properties 
	pageTitle="Develop Java MapReduce programs for Hadoop | Microsoft Azure" 
	description="Learn how to develop Java MapReduce programs on HDInsight emulator, how to deploy them to HDInsight." 
	services="hdinsight" 
	editor="cgronlun" 
	manager="paulettm" 
	authors="nitinme" 
	documentationCenter=""/>

<tags 
	ms.service="hdinsight" 
	ms.workload="big-data" 
	ms.tgt_pltfrm="na" 
	ms.devlang="Java" 
	ms.topic="article" 
	ms.date="04/01/2015" 
	ms.author="nitinme"/>

# Develop Java MapReduce programs for Hadoop in HDInsight
This tutorial walks you through an end-to-end scenario for developing a word-counting Hadoop MapReduce job in Java by using Apache Maven. The tutorial also shows how to test the application on the HDInsight Emulator for Azure and then deploy and run it on an Azure HDInsight cluster.

##<a name="prerequisites"></a>Prerequisites

Before you begin this tutorial, you must have completed the following:

- Install the HDInsight Emulator. For instructions, see [Get started using HDInsight Emulator][hdinsight-emulator]. Make sure all the required services are running. On the computer that has HDInsight Emulator installed, launch the Hadoop Command line from the Desktop shortcut, navigate to **C:\hdp**, and run the command **start_local_hdp_services.cmd**.	
- Install Azure PowerShell on the emulator computer. For instructions, see [Install and configure Azure PowerShell][powershell-install-configure].
- Install Java platform JDK 7 or higher on the emulator computer. This is already available on the emulator computer.
- Install and configure [Apache Maven](http://maven.apache.org/).
- Obtain an Azure subscription. For instructions, see [Purchase Options][azure-purchase-options], [Member Offers][azure-member-offers], or [Free Trial][azure-free-trial].


##<a name="develop"></a>Use Apache Maven to create a MapReduce program in Java

Create a word-counting MapReduce application. It is a simple application that counts the occurrences of each word in a given input set. In this section, we will performing the following tasks:

1. Create a project by using Apache Maven
2. Update the Project Object Model (POM)
3. Create the word-counting MapReduce application
4. Build and package the application

**To create a project by using Maven**

1. Create a directory **C:\Tutorials\WordCountJava\**.
2. From the command line in your development environment, change directories to the location you created.
3. Use the __mvn__ command, which is installed with Maven, to generate the scaffolding for the project.

		mvn archetype:generate -DgroupId=org.apache.hadoop.examples -DartifactId=wordcountjava -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false

	This will create a new directory in the current directory, with the name specified by the __artifactID__ parameter (**wordcountjava** in this example.) This directory will contain the following items:

	* __pom.xml__ - The [Project Object Model (POM)](http://maven.apache.org/guides/introduction/introduction-to-the-pom.html) that contains information and configuration details used to build the project.

	* __src__ - The directory that contains the __main\java\org\apache\hadoop\examples__ directory, where you will author the application.
3. Delete the __src\test\java\org\apache\hadoop\examples\apptest.java__ file, as it will not be used in this example.

**To update the POM**

1. Edit the __pom.xml__ file and add the following inside the `<dependencies>` section:

		<dependency>
		  <groupId>org.apache.hadoop</groupId>
          <artifactId>hadoop-mapreduce-examples</artifactId>
          <version>2.5.1</version>
        </dependency>
    	<dependency>
      	  <groupId>org.apache.hadoop</groupId>
      	  <artifactId>hadoop-mapreduce-client-common</artifactId>
      	  <version>2.5.1</version>
    	</dependency>
    	<dependency>                                                                                     
      	  <groupId>org.apache.hadoop</groupId>                                                                                                       
      	  <artifactId>hadoop-common</artifactId>                                                                                                         
      	  <version>2.5.1</version>                                                                                            
    	</dependency>

	This tells Maven that the project requires the libraries (listed within <artifactId\>) with a specific version (listed within <version\>). At compile time, this will be downloaded from the default Maven repository. You can use the [Maven repository search](http://search.maven.org/#artifactdetails%7Corg.apache.hadoop%7Chadoop-mapreduce-examples%7C2.5.1%7Cjar) to view more.

2. Add the following to the __pom.xml__ file. This must be inside the `<project>...</project>` tags in the file; for example, between `</dependencies>` and `</project>`.

		<build>
  		  <plugins>
    		<plugin>
      		  <groupId>org.apache.maven.plugins</groupId>
      		  <artifactId>maven-shade-plugin</artifactId>
      		  <version>2.3</version>
      		  <configuration>
        		<transformers>
          		  <transformer implementation="org.apache.maven.plugins.shade.resource.ApacheLicenseResourceTransformer">
		          </transformer>
        		</transformers>
      		  </configuration>
      		  <executions>
        		<execution>
          		  <phase>package</phase>
          			<goals>
            		  <goal>shade</goal>
          			</goals>
        	    </execution>
      		  </executions>
      	    </plugin>       
  		  </plugins>
	    </build>

	This configures the [Maven Shade Plugin](http://maven.apache.org/plugins/maven-shade-plugin/), which is used to prevent license duplication in the JAR file that is built by Maven. The reason this is used is that the duplicate license files cause an error at run time on the HDInsight cluster. Using the Maven Shade Plugin with the `ApacheLicenseResourceTransformer` implementation prevents this error.

	The Maven Shade Plugin will also produce an uberjar (sometimes called a fatjar), which contains all the dependencies required by the application.

3. Save the __pom.xml__ file.

**To create the word-counting application**

1. Go to the __wordcountjava\src\main\java\org\apache\hadoop\examples__ directory and rename the __app.java__ file to __WordCount.java__.
2. Open Notepad.
2. Copy and paste the following program into Notepad:

		package org.apache.hadoop.examples;
		
		import java.io.IOException;
		import java.util.StringTokenizer;
		import org.apache.hadoop.conf.Configuration;
		import org.apache.hadoop.fs.Path;
		import org.apache.hadoop.io.IntWritable;
		import org.apache.hadoop.io.Text;
		import org.apache.hadoop.mapreduce.Job;
		import org.apache.hadoop.mapreduce.Mapper;
		import org.apache.hadoop.mapreduce.Reducer;
		import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
		import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
		import org.apache.hadoop.util.GenericOptionsParser;

		public class WordCount {
		
		  public static class TokenizerMapper 
		       extends Mapper<Object, Text, Text, IntWritable>{
		    
		    private final static IntWritable one = new IntWritable(1);
		    private Text word = new Text();
		      
		    public void map(Object key, Text value, Context context
		                    ) throws IOException, InterruptedException {
		      StringTokenizer itr = new StringTokenizer(value.toString());
		      while (itr.hasMoreTokens()) {
		        word.set(itr.nextToken());
		        context.write(word, one);
		      }
		    }
		  }
		  
		  public static class IntSumReducer 
		       extends Reducer<Text,IntWritable,Text,IntWritable> {
		    private IntWritable result = new IntWritable();
		
		    public void reduce(Text key, Iterable<IntWritable> values, 
		                       Context context
		                       ) throws IOException, InterruptedException {
		      int sum = 0;
		      for (IntWritable val : values) {
		        sum += val.get();
		      }
		      result.set(sum);
		      context.write(key, result);
		    }
		  }
		
		  public static void main(String[] args) throws Exception {
		    Configuration conf = new Configuration();
		    String[] otherArgs = new GenericOptionsParser(conf, args).getRemainingArgs();
		    if (otherArgs.length != 2) {
		      System.err.println("Usage: wordcount <in> <out>");
		      System.exit(2);
		    }
		    Job job = new Job(conf, "word count");
		    job.setJarByClass(WordCount.class);
		    job.setMapperClass(TokenizerMapper.class);
		    job.setCombinerClass(IntSumReducer.class);
		    job.setReducerClass(IntSumReducer.class);
		    job.setOutputKeyClass(Text.class);
		    job.setOutputValueClass(IntWritable.class);
		    FileInputFormat.addInputPath(job, new Path(otherArgs[0]));
		    FileOutputFormat.setOutputPath(job, new Path(otherArgs[1]));
		    System.exit(job.waitForCompletion(true) ? 0 : 1);
		  }
		}

	Notice the package name is **org.apache.hadoop.examples** and the class name is **WordCount**. You will use these names when you submit the MapReduce job.
	
3. Save the file.

**To build and package the application**

1. Open a command prompt and change directories to the __wordcountjava__ directory.

2. Use the following command to build a JAR file containing the application:

		mvn clean package

	This will clean any previous build artifacts, download any dependencies that have not already been installed, and then build and package the application.

3. Once the command finishes, the __wordcountjava\target__ directory will contain a file named __wordcountjava-1.0-SNAPSHOT.jar__.

	> [AZURE.NOTE] The __wordcountjava-1.0-SNAPSHOT.jar__ file is an uberjar.


##<a name="test"></a>Test the program on the emulator

Testing the MapReduce job on the HDInsight Emulator includes the following procedures:

1. Upload the data files to the Hadoop Distributed File System (HDFS) on the emulator
2. Create a local user group
3. Run a word-counting MapReduce job
4. Retrieve the job results

By default, the HDInsight Emulator uses HDFS as the file system. Optionally, you can configure the HDInsight Emulator to use Azure Blob storage. For details, see [Get started with HDInsight Emulator][hdinsight-emulator-wasb]. 

In this tutorial, you will use the HDFS **copyFromLocal** command to upload the data files to HDFS. The next section shows you how to upload files to Azure Blob storage by using Azure PowerShell. For other methods for uploading files to Azure Blob storage, see [Upload data to HDInsight][hdinsight-upload-data].

This tutorial uses the following HDFS folder structure:

<table border="1">
<tr><td>Folder</td><td>Note</td></tr>
<tr><td>/WordCount</td><td>The root folder for the word-counting project. </td></tr>
<tr><td>/WordCount/Apps</td><td>The folder for the mapper and reducer executables.</td></tr>
<tr><td>/WordCount/Input</td><td>The MapReduce source file folder.</td></tr>
<tr><td>/WordCount/Output</td><td>The MapReduce output file folder.</td></tr>
<tr><td>/WordCount/MRStatusOutput</td><td>The job output folder.</td></tr>
</table>

This tutorial uses the .txt files located in the %hadoop_home% directory as the data files.

> [AZURE.NOTE] The Hadoop HDFS commands are case sensitive.

**To copy the data files to the emulator HDFS**

1. Open the Hadoop command line from your desktop. The Hadoop command line is installed by the emulator installer.
2. From the Hadoop command-line window, run the following command to make a directory for the input files:

		hadoop fs -mkdir /WordCount
		hadoop fs -mkdir /WordCount/Input

	The path used here is the relative path. It is equivalent to the following:

		hadoop fs -mkdir hdfs://localhost:8020/WordCount/Input

3. Run the following command to copy some text files to the input folder on HDFS:

		hadoop fs -copyFromLocal C:\hdp\hadoop-2.4.0.2.1.3.0-1981\share\doc\hadoop\common\*.txt /WordCount/Input

	The MapReduce job will count the words in these files.

4. Run the following command to list and verify the uploaded files:

		hadoop fs -ls /WordCount/Input

**To create a local user group**

To successfully run the MapReduce job on the cluster, you must create a user group called hdfs. To this group, you must also add a user called hadoop and the local user with which you log on to the emulator. Use the following commands from an elevated command prompt:

		# Add a user group called hdfs		
		net localgroup hdfs /add

		# Adds a user called hadoop to the group
		net localgroup hdfs hadoop /add

		# Adds the local user to the group
		net localgroup hdfs <username> /add

**To run the MapReduce job by using the Hadoop command line**

1. Open the Hadoop command line from your desktop.
2. Run the following command to delete the /WordCount/Output folder structure from HDFS. /WordCount/Output is the output folder of the word-counting MapReduce job. The MapReduce job will fail if the folder already exists. This step is necessary if this is the second time you're running the job.

		hadoop fs -rm - r /WordCount/Output

2. Run the following command:

		hadoop jar C:\Tutorials\WordCountJava\wordcountjava\target\wordcountjava-1.0-SNAPSHOT.jar org.apache.hadoop.examples.WordCount /WordCount/Input /WordCount/Output

	If the job finishes successfully, you should get an output similar to the following screenshot:

	![HDI.EMulator.WordCount.Run][image-emulator-wordcount-run]

	From the screenshot, you can see both map and reduce finished 100%. It also lists the job ID. The same report can be retrieved by opening the **Hadoop MapReduce status** shortcut from your desktop, and looking for the same job ID.

The other option for running a MapReduce job is using Azure PowerShell. For instructions, see [Get started with the HDInsight Emulator][hdinsight-emulator].

**To display the output from HDFS**

1. Open the Hadoop command line.
2. Run the following commands to display the output:

		hadoop fs -ls /WordCount/Output/
		hadoop fs -cat /WordCount/Output/part-r-00000

	You can append "|more" at the end of the command to get the page view. Or use the **findstr** command to find a string pattern:

		hadoop fs -cat /WordCount/Output/part-r-00000 | findstr "there"

You have now developed a word-counting MapReduce job and tested it successfully on the emulator. The next step is to deploy and run it on Azure HDInsight.



##<a id="upload"></a>Upload data and application to Azure Blob storage
Azure HDInsight uses Azure Blob storage for data storage. When an HDInsight cluster is provisioned, an Azure Blob storage container is used to store the system files. You can use either this default container or a different container (either on the same Azure Storage account or on a different Storage account located in the same datacenter as the cluster) for storing the data files. 

In this tutorial, you will create a container on a separate Storage account for the data files and the MapReduce application. The data files are the text files in the **C:\hdp\hadoop-2.4.0.2.1.3.0-1981\share\doc\hadoop\common** directory on your emulator workstation.

**To create a Blob storage account and a container**

1. Open Azure PowerShell.
2. Set the variables, and then run the commands:

		$subscriptionName = "<AzureSubscriptionName>"
		$storageAccountName_Data = "<AzureStorageAccountName>"  
		$containerName_Data = "<ContainerName>"
		$location = "<MicrosoftDataCenter>"  # For example, "East US"

	The **$subscripionName** variable is associated with your Azure subscription. You must name **$storageAccountName\_Data** and **$containerName\_Data**. For the naming restrictions, see [Naming and Referencing Containers, Blobs, and Metadata](http://msdn.microsoft.com/library/windowsazure/dd135715.aspx). 

3. Run the following commands to create a Storage account and a Blob storage container on the account:

		# Select an Azure subscription
		Select-AzureSubscription $subscriptionName
		
		# Create a Storage account
		New-AzureStorageAccount -StorageAccountName $storageAccountName_Data -location $location
				
		# Create a Blob storage container
		$storageAccountKey = Get-AzureStorageKey $storageAccountName_Data | %{ $_.Primary }
		$destContext = New-AzureStorageContext –StorageAccountName $storageAccountName_Data –StorageAccountKey $storageAccountKey  
		New-AzureStorageContainer -Name $containerName_Data -Context $destContext

4. Run the following commands to verify the Storage account and the container:

		Get-AzureStorageAccount -StorageAccountName $storageAccountName_Data
		Get-AzureStorageContainer -Context $destContext

**To upload the data files**

1. Open Azure PowerShell.
2. Set the first three variables, and then run the commands:

		$subscriptionName = "<AzureSubscriptionName>"
		$storageAccountName_Data = "<AzureStorageAccountName>"  
		$containerName_Data = "<ContainerName>"

		$localFolder = "C:\hdp\hadoop-2.4.0.2.1.3.0-1981\share\doc\hadoop\common\"
		$destFolder = "WordCount/Input"

	The **$storageAccountName\_Data** and **$containerName\_Data** variables are the same as you defined in the last procedure.

	Notice the source file folder is **c:\Hadoop\hadoop-1.1.0-SNAPSHOT**, and the destination folder is **WordCount/Input**.

3. Run the following commands to get a list of the .txt files in the source file folder:

		# Get a list of the .txt files
		$filesAll = Get-ChildItem $localFolder
		$filesTxt = $filesAll | where {$_.Extension -eq ".txt"}
		
4. Run the following commands to create a storage context object:

		# Create a storage context object
		Select-AzureSubscription $subscriptionName
		$storageaccountkey = get-azurestoragekey $storageAccountName_Data | %{$_.Primary}
		$destContext = New-AzureStorageContext -StorageAccountName $storageAccountName_Data -StorageAccountKey $storageaccountkey

5. Run the following commands to copy the files:

		# Copy the files from the local workstation to the Blob container        
		foreach ($file in $filesTxt){
		 
		    $fileName = "$localFolder\$file"
		    $blobName = "$destFolder/$file"
		
		    write-host "Copying $fileName to $blobName"
		
		    Set-AzureStorageBlobContent -File $fileName -Container $containerName_Data -Blob $blobName -Context $destContext
		}

6. Run the following commands to list the uploaded files:

		# List the uploaded files in the Blob storage container
        Write-Host "The Uploaded data files:" -BackgroundColor Green
		Get-AzureStorageBlob -Container $containerName_Data -Context $destContext -Prefix $destFolder

	You should see about the uploaded text data files.

**To upload the word-counting application**

1. Open Azure PowerShell.
2. Set the first three variables, and then run the commands:

		$subscriptionName = "<AzureSubscriptionName>"
		$storageAccountName_Data = "<AzureStorageAccountName>"  
		$containerName_Data = "<ContainerName>"

		$jarFile = "C:\Tutorials\WordCountJava\wordcountjava\target\wordcountjava-1.0-SNAPSHOT.jar"
		$blobFolder = "WordCount/jars"

	The **$storageAccountName\_Data** and **$containerName\_Data** variables are the same as you defined in the last procedure, which means you will upload both the data file and the application to the same container on the same Storage account.

	Notice the destination folder is **WordCount/jars**.

4. Run the following commands to create a storage context object:

		# Create a storage context object
		Select-AzureSubscription $subscriptionName
		$storageaccountkey = get-azurestoragekey $storageAccountName_Data | %{$_.Primary}
		$destContext = New-AzureStorageContext -StorageAccountName $storageAccountName_Data -StorageAccountKey $storageaccountkey

5. Run the following command to copy the applications:

		Set-AzureStorageBlobContent -File $jarFile -Container $containerName_Data -Blob "$blobFolder/WordCount.jar" -Context $destContext

6. Run the following commands to list the uploaded files:

		# List the uploaded files in the Blob storage container
        Write-Host "The Uploaded application file:" -BackgroundColor Green
		Get-AzureStorageBlob -Container $containerName_Data -Context $destContext -Prefix $blobFolder

	You should see the JAR file listed there.

##<a name="run"></a>Run the MapReduce job on Azure HDInsight

In this section, you will create an Azure PowerShell script that performs the following tasks:

1. Provisions an HDInsight cluster
	
	1. Create a Storage account that will be used as the default HDInsight cluster file system
	2. Create a Blob storage container 
	3. Create an HDInsight cluster

2. Submits the MapReduce job

	1. Create a MapReduce job definition
	2. Submit a MapReduce job
	3. Wait for the job to finish
	4. Display standard error
	5. Display standard output

3. Deletes the cluster

	1. Delete the HDInsight cluster
	2. Delete the Storage account used as the default HDInsight cluster file system


**To run the Azure PowerShell script**

1. Open Notepad.
2. Copy and paste the following code:
		
		# The Storage account and the HDInsight cluster variables
		$subscriptionName = "<AzureSubscriptionName>"
		$stringPrefix = "<StringForPrefix>"
		$location = "<MicrosoftDataCenter>"     ### Must match the data Storage account location
		$clusterNodes = <NumberOFNodesInTheCluster>

		$storageAccountName_Data = "<TheDataStorageAccountName>"
		$containerName_Data = "<TheDataBlobStorageContainerName>"
		
		$clusterName = $stringPrefix + "hdicluster"
		
		$storageAccountName_Default = $stringPrefix + "hdistore"
		$containerName_Default =  $stringPrefix + "hdicluster"

		# The MapReduce job variables
		$jarFile = "wasb://$containerName_Data@$storageAccountName_Data.blob.core.windows.net/WordCount/jars/WordCount.jar"
		$className = "org.apache.hadoop.examples.WordCount"
		$mrInput = "wasb://$containerName_Data@$storageAccountName_Data.blob.core.windows.net/WordCount/Input/"
		$mrOutput = "wasb://$containerName_Data@$storageAccountName_Data.blob.core.windows.net/WordCount/Output/"
		$mrStatusOutput = "wasb://$containerName_Data@$storageAccountName_Data.blob.core.windows.net/WordCount/MRStatusOutput/"
		
		# Create a PSCredential object. The user name and password are hardcoded here. You can change them if you want.
		$password = ConvertTo-SecureString "Pass@word1" -AsPlainText -Force
		$creds = New-Object System.Management.Automation.PSCredential ("Admin", $password) 
		
		Select-AzureSubscription $subscriptionName
		
		#=============================
		# Create a Storage account used as the default file system
		Write-Host "Create a storage account" -ForegroundColor Green
		New-AzureStorageAccount -StorageAccountName $storageAccountName_Default -location $location
		
		#=============================
		# Create a Blob storage container used as the default file system
		Write-Host "Create a Blob storage container" -ForegroundColor Green
		$storageAccountKey_Default = Get-AzureStorageKey $storageAccountName_Default | %{ $_.Primary }
		$destContext = New-AzureStorageContext –StorageAccountName $storageAccountName_Default –StorageAccountKey $storageAccountKey_Default
		
		New-AzureStorageContainer -Name $containerName_Default -Context $destContext
		
		#=============================
		# Create an HDInsight cluster
		Write-Host "Create an HDInsight cluster" -ForegroundColor Green
		$storageAccountKey_Data = Get-AzureStorageKey $storageAccountName_Data | %{ $_.Primary }
		
		$config = New-AzureHDInsightClusterConfig -ClusterSizeInNodes $clusterNodes |
		    Set-AzureHDInsightDefaultStorage -StorageAccountName "$storageAccountName_Default.blob.core.windows.net" -StorageAccountKey $storageAccountKey_Default -StorageContainerName $containerName_Default |
		    Add-AzureHDInsightStorage -StorageAccountName "$storageAccountName_Data.blob.core.windows.net" -StorageAccountKey $storageAccountKey_Data
		
		New-AzureHDInsightCluster -Name $clusterName -Location $location -Credential $creds -Config $config
		
		#=============================
		# Create a MapReduce job definition
		Write-Host "Create a MapReduce job definition" -ForegroundColor Green
		$mrJobDef = New-AzureHDInsightMapReduceJobDefinition -JobName mrWordCountJob  -JarFile $jarFile -ClassName $className -Arguments $mrInput, $mrOutput -StatusFolder /WordCountStatus
		
		#=============================
		# Run the MapReduce job
		Write-Host "Run the MapReduce job" -ForegroundColor Green
		$mrJob = Start-AzureHDInsightJob -Cluster $clusterName -JobDefinition $mrJobDef 
		Wait-AzureHDInsightJob -Job $mrJob -WaitTimeoutInSeconds 3600 
		
		Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $mrJob.JobId -StandardError 
		Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $mrJob.JobId -StandardOutput
				
		#=============================
		# Delete the HDInsight cluster
		Write-Host "Delete the HDInsight cluster" -ForegroundColor Green
		Remove-AzureHDInsightCluster -Name $clusterName  
		
		# Delete the default file system Storage account
		Write-Host "Delete the storage account" -ForegroundColor Green
		Remove-AzureStorageAccount -StorageAccountName $storageAccountName_Default

3. Set the first six variables in the script. The **$stringPrefix** variable is used to prefix the specified string to the HDInsight cluster name, the Storage account name, and the Blob storage container name. Because the names for these must be 3 to 24 characters, make sure the string you specify and the names this script uses, together, do not exceed the character limit for the name. You must use all lowercase for **$stringPrefix**. 
 
	The **$storageAccountName\_Data** and **$containerName\_Data** variables are the Storage account and container that are used for storing the data files and the application. The **$location** variable must match the data Storage account location.

4. Review the rest of the variables.
5. Save the script file.
6. Open Azure PowerShell.
7. Run the following command to set the execution policy to RemoteSigned:

		PowerShell -File <FileName> -ExecutionPolicy RemoteSigned

8. When prompted, enter the user name and password for the HDInsight cluster. Because you will delete the cluster at the end of the script and you will not need the user name and password anymore, the user name and password can be any strings. If you don't want to get prompted for the credentials, see [Working with Passwords, Secure Strings and Credentials in Windows PowerShell][powershell-PSCredential].


##<a name="retrieve"></a>Retrieve the MapReduce job output
This section shows you how to download and display the output. For the information on displaying the results in Excel, see [Connect Excel to HDInsight with the Microsoft Hive ODBC Driver][hdinsight-ODBC] and [Connect Excel to HDInsight with Power Query][hdinsight-power-query].


**To retrieve the output**

1. Open the Azure PowerShell window.
2. Change the directory to **C:\Tutorials\WordCountJava**. The default Azure PowerShell folder is **C:\Windows\System32\WindowsPowerShell\v1.0**. The cmdlets you will run will download the output file to the current folder. You don't have permissions to download the files to the system folders.
2. Run the following commands to set the values:

		$subscriptionName = "<AzureSubscriptionName>"
		$storageAccountName_Data = "<TheDataStorageAccountName>"
		$containerName_Data = "<TheDataBlobStorageContainerName>"
		$blobName = "WordCount/Output/part-r-00000"
	
3. Run the following commands to create an Azure storage context object: 
		
		Select-AzureSubscription $subscriptionName
		$storageAccountKey = Get-AzureStorageKey $storageAccountName_Data | %{ $_.Primary }
		$storageContext = New-AzureStorageContext –StorageAccountName $storageAccountName_Data –StorageAccountKey $storageAccountKey  

4. Run the following commands to download and display the output:

		Get-AzureStorageBlobContent -Container $containerName_Data -Blob $blobName -Context $storageContext -Force
		cat "./$blobName" | findstr "there"

After the job is completed, you have the option to export the data to SQL Server or Azure SQL Database by using [Sqoop][hdinsight-use-sqoop], or to export the data to Excel.  

##<a id="nextsteps"></a>Next steps
In this tutorial, you have learned how to develop a Java MapReduce job, how to test the application on the HDInsight Emulator, and how to write an Azure PowerShell script to provision an HDInsight cluster and run a MapReduce job on the cluster. To learn more, see the following articles:

- [Develop C# Hadoop streaming MapReduce programs for HDInsight][hdinsight-develop-streaming]
- [Get started with Azure HDInsight][hdinsight-get-started]
- [Get started with the HDInsight Emulator][hdinsight-emulator]
- [Use Azure Blob storage with HDInsight][hdinsight-storage]
- [Administer HDInsight using Azure PowerShell][hdinsight-admin-powershell]
- [Upload data to HDInsight][hdinsight-upload-data]
- [Use Hive with HDInsight][hdinsight-use-hive]
- [Use Pig with HDInsight][hdinsight-use-pig]
- [Connect Excel to HDInsight with Power Query][hdinsight-power-query]
- [Connect Excel to HDInsight with the Microsoft Hive ODBC Driver][hdinsight-ODBC]

[azure-purchase-options]: http://azure.microsoft.com/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/pricing/free-trial/

[hdinsight-use-sqoop]: hdinsight-use-sqoop.md
[hdinsight-ODBC]: hdinsight-connect-excel-hive-ODBC-driver.md
[hdinsight-power-query]: hdinsight-connect-excel-power-query.md

[hdinsight-develop-streaming]: hdinsight-hadoop-develop-deploy-streaming-jobs.md

[hdinsight-get-started]: hdinsight-get-started.md
[hdinsight-emulator]: hdinsight-get-started-emulator.md
[hdinsight-emulator-wasb]: hdinsight-get-started-emulator.md#blobstorage
[hdinsight-upload-data]: hdinsight-upload-data.md
[hdinsight-storage]: hdinsight-use-blob-storage.md
[hdinsight-admin-powershell]: hdinsight-administer-use-powershell.md
[hdinsight-use-hive]: hdinsight-use-hive.md
[hdinsight-use-pig]: hdinsight-use-pig.md
[hdinsight-power-query]: hdinsight-connect-excel-power-query.md

[powershell-PSCredential]: http://social.technet.microsoft.com/wiki/contents/articles/4546.working-with-passwords-secure-strings-and-credentials-in-windows-powershell.aspx
[powershell-install-configure]: install-configure-powershell.md



[image-emulator-wordcount-compile]: ./media/hdinsight-develop-deploy-java-mapreduce/HDI-Emulator-Compile-Java-MapReduce.png
[image-emulator-wordcount-run]: ./media/hdinsight-develop-deploy-java-mapreduce/HDI-Emulator-Run-Java-MapReduce.png

