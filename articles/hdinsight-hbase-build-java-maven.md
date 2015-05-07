<properties
	pageTitle="Build an HBase application using Maven | Microsoft Azure"
	description="Learn how to use Apache Maven to build a Java-based Apache HBase application, then deploy it to Azure HDInsight."
	services="hdinsight"
	documentationCenter=""
	authors="Blackmist"
	manager="paulettm"
	editor=""/>

<tags
	ms.service="hdinsight"
	ms.workload="big-data"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/31/2014"
	ms.author="larryfr"/>

#Use Maven to build Java applications that use HBase with HDInsight (Hadoop)

Learn how to create and build an [Apache HBase](http://hbase.apache.org/) application in Java by using Apache Maven. Then use the application with Azure HDInsight (Hadoop).

[Maven](http://maven.apache.org/) is a software project management and comprehension tool that allows you to build software, documentation, and reports for Java projects. In this article, you will learn how to use it to create a basic Java application that that creates, queries, and deletes an HBase table on an Azure HDInsight cluster.

##Requirements

* [Java platform JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html) 7 or later

* [Maven](http://maven.apache.org/)

* [An Azure HDInsight cluster with HBase](hdinsight-hbase-get-started.md#create-hbase-cluster)

##Create the project

1. From the command-line in your development environment, change directories to the location where you want to create the project, for example, `cd code\hdinsight`.

2. Use the __mvn__ command, which is installed with Maven, to generate the scaffolding for the project.

		mvn archetype:generate -DgroupId=com.microsoft.examples -DartifactId=hbaseapp -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false

	This creates a new directory in the current directory, with the name specified by the __artifactID__ parameter (**hbaseapp** in this example.) This directory will contain the following items:

	* __pom.xml__:  The Project Object Model ([POM](http://maven.apache.org/guides/introduction/introduction-to-the-pom.html)) contains information and configuration details used to build the project.

	* __src__: The directory that contains the __main\java\com\microsoft\examples__ directory, where you will author the application.

3. Delete the __src\test\java\com\microsoft\examples\apptest.java__ file because it will not be used in this example.

##Update the Project Object Model

1. Edit the __pom.xml__ file and add the following code inside the `<dependencies>` section:

		<dependency>
      	  <groupId>org.apache.hbase</groupId>
          <artifactId>hbase-client</artifactId>
          <version>0.98.4-hadoop2</version>
        </dependency>

	This tells Maven that the project requires __hbase-client__ version __0.98.4-hadoop2__. At compile time, this will be downloaded from the default Maven repository. You can use the [Maven Central Repository Search](http://search.maven.org/#artifactdetails%7Corg.apache.hbase%7Chbase-client%7C0.98.4-hadoop2%7Cjar) to learn more about this dependency.

2. Add the following code to the __pom.xml__ file. This must be inside the `<project>...</project>` tags in the file, for example, between `</dependencies>` and `</project>`.

		<build>
		  <sourceDirectory>src</sourceDirectory>
		  <resources>
	        <resource>
	          <directory>${basedir}/conf</directory>
	          <filtering>false</filtering>
	          <includes>
	            <include>hbase-site.xml</include>
	          </includes>
	        </resource>
	      </resources>
		  <plugins>
		    <plugin>
        	  <groupId>org.apache.maven.plugins</groupId>
        	  <artifactId>maven-compiler-plugin</artifactId>
						<version>3.3</version>
        	  <configuration>
          	    <source>1.6</source>
          	    <target>1.6</target>
        	  </configuration>
      		</plugin>
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

	This configures a resource (__conf\hbase-site.xml__,) that contains configuration information for HBase.

	> [AZURE.NOTE] You can also set configuration values via code. See the comments in the __CreateTable__ example that follows for how to do this.

	This also configures the [Maven Compiler Plugin](http://maven.apache.org/plugins/maven-compiler-plugin/) and [Maven Shade Plugin](http://maven.apache.org/plugins/maven-shade-plugin/). The compiler plug-in is used to compile the topology. The shade plug-in is used to prevent license duplication in the JAR package that is built by Maven. The reason this is used is that the duplicate license files cause an error at run time on the HDInsight cluster. Using maven-shade-plugin with the `ApacheLicenseResourceTransformer` implementation prevents this error.

	The maven-shade-plugin also produces an uber jar (or fat jar,) that contains all the dependencies required by the application.

3. Save the __pom.xml__ file.

4. Create a new directory named __conf__ in the __hbaseapp__ directory. In the __conf__ directory, create a new file named __hbase-site.xml__ and use the following as the contents:

		<?xml version="1.0"?>
		<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
		<!--
		/**
		 * Copyright 2010 The Apache Software Foundation
		 *
		 * Licensed to the Apache Software Foundation (ASF) under one
		 * or more contributor license agreements.  See the NOTICE file
		 * distributed with this work for additional information
		 * regarding copyright ownership.  The ASF licenses this file
		 * to you under the Apache License, Version 2.0 (the
		 * "License"); you may not use this file except in compliance
		 * with the License.  You may obtain a copy of the License at
		 *
		 *     http://www.apache.org/licenses/LICENSE-2.0
		 *
		 * Unless required by applicable law or agreed to in writing, software
		 * distributed under the License is distributed on an "AS IS" BASIS,
		 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
		 * See the License for the specific language governing permissions and
		 * limitations under the License.
		 */
		-->
		<configuration>
		  <property>
		    <name>hbase.cluster.distributed</name>
		    <value>true</value>
		  </property>
		  <property>
		    <name>hbase.zookeeper.quorum</name>
		    <value>zookeeper0,zookeeper1,zookeeper2</value>
		  </property>
		  <property>
		    <name>hbase.zookeeper.property.clientPort</name>
		    <value>2181</value>
		  </property>
		</configuration>

	This file will be used to load the HBase configuration for an HDInsight cluster.

	> [AZURE.NOTE] This is a very minimal hbase-site.xml file, and it contains the bare minimum settings for the HDInsight cluster. For a full version of the hbase-site.xml configuration file used by HDInsight, see [Manage Hadoop clusters in HDInsight by using the Azure portal](hdinsight-administer-use-management-portal.md#rdp). The hbase-site.xml file is located in the C:\apps\dist\hbase-&lt;version number>-hadoop2\conf directory. The version number portion of the file path will change as HBase is updated on the cluster.

3. Save the __hbase-site.xml__ file.

##Create the application

1. Go to the __hbaseapp\src\main\java\com\microsoft\examples__ directory and rename the app.java file to __CreateTable.java__.

2. Open the __CreateTable.java__ file and replace the existing contents with the following:

		package com.microsoft.examples;
		import java.io.IOException;

		import org.apache.hadoop.conf.Configuration;
		import org.apache.hadoop.hbase.HBaseConfiguration;
		import org.apache.hadoop.hbase.client.HBaseAdmin;
		import org.apache.hadoop.hbase.HTableDescriptor;
		import org.apache.hadoop.hbase.TableName;
		import org.apache.hadoop.hbase.HColumnDescriptor;
		import org.apache.hadoop.hbase.client.HTable;
		import org.apache.hadoop.hbase.client.Put;
		import org.apache.hadoop.hbase.util.Bytes;

		public class CreateTable {
		  public static void main(String[] args) throws IOException {
		    Configuration config = HBaseConfiguration.create();

		    // Example of setting zookeeper values for HDInsight
			//   in code instead of an hbase-site.xml file
			//
		    // config.set("hbase.zookeeper.quorum",
		    //            "zookeepernode0,zookeepernode1,zookeepernode2");
		    //config.set("hbase.zookeeper.property.clientPort", "2181");
		    //config.set("hbase.cluster.distributed", "true");

		    // create an admin object using the config
		    HBaseAdmin admin = new HBaseAdmin(config);

		    // create the table...
		    HTableDescriptor tableDescriptor = new HTableDescriptor(TableName.valueOf("people"));
		    // ... with two column families
		    tableDescriptor.addFamily(new HColumnDescriptor("name"));
		    tableDescriptor.addFamily(new HColumnDescriptor("contactinfo"));
		    admin.createTable(tableDescriptor);

		    // define some people
		    String[][] people = {
		        { "1", "Marcel", "Haddad", "marcel@fabrikam.com"},
		        { "2", "Franklin", "Holtz", "franklin@contoso.com" },
		        { "3", "Dwayne", "McKee", "dwayne@fabrikam.com" },
		        { "4", "Rae", "Schroeder", "rae@contoso.com" },
		        { "5", "Rosalie", "burton", "rosalie@fabrikam.com"},
		        { "6", "Gabriela", "Ingram", "gabriela@contoso.com"} };

		    HTable table = new HTable(config, "people");

		    // Add each person to the table
		    //   Use the `name` column family for the name
		    //   Use the `contactinfo` column family for the email
		    for (int i = 0; i< people.length; i++) {
		      Put person = new Put(Bytes.toBytes(people[i][0]));
		      person.add(Bytes.toBytes("name"), Bytes.toBytes("first"), Bytes.toBytes(people[i][1]));
		      person.add(Bytes.toBytes("name"), Bytes.toBytes("last"), Bytes.toBytes(people[i][2]));
		      person.add(Bytes.toBytes("contactinfo"), Bytes.toBytes("email"), Bytes.toBytes(people[i][3]));
		      table.put(person);
		    }
		    // flush commits and close the table
		    table.flushCommits();
		    table.close();
		  }
		}

	This is the __CreateTable__ class, which will create a table named __people__ and populate it with some predefined users.

3. Save the __CreateTable.java__ file.

4. In the __hbaseapp\src\main\java\com\microsoft\examples__ directory, create a new file named __SearchByEmail.java__. Use the following as the contents of this file:

		package com.microsoft.examples;
		import java.io.IOException;

		import org.apache.hadoop.conf.Configuration;
		import org.apache.hadoop.hbase.HBaseConfiguration;
		import org.apache.hadoop.hbase.client.HTable;
		import org.apache.hadoop.hbase.client.Scan;
		import org.apache.hadoop.hbase.client.ResultScanner;
		import org.apache.hadoop.hbase.client.Result;
		import org.apache.hadoop.hbase.filter.RegexStringComparator;
		import org.apache.hadoop.hbase.filter.SingleColumnValueFilter;
		import org.apache.hadoop.hbase.filter.CompareFilter.CompareOp;
		import org.apache.hadoop.hbase.util.Bytes;
		import org.apache.hadoop.util.GenericOptionsParser;

		public class SearchByEmail {
		  public static void main(String[] args) throws IOException {
		    Configuration config = HBaseConfiguration.create();

		    // Use GenericOptionsParser to get only the parameters to the class
		    // and not all the parameters passed (when using WebHCat for example)
		    String[] otherArgs = new GenericOptionsParser(config, args).getRemainingArgs();
		    if (otherArgs.length != 1) {
		      System.out.println("usage: [regular expression]");
		      System.exit(-1);
		    }

			// Open the table
		    HTable table = new HTable(config, "people");

			// Define the family and qualifiers to be used
		    byte[] contactFamily = Bytes.toBytes("contactinfo");
		    byte[] emailQualifier = Bytes.toBytes("email");
		    byte[] nameFamily = Bytes.toBytes("name");
		    byte[] firstNameQualifier = Bytes.toBytes("first");
		    byte[] lastNameQualifier = Bytes.toBytes("last");

			// Create a new regex filter
		    RegexStringComparator emailFilter = new RegexStringComparator(otherArgs[0]);
			// Attach the regex filter to a filter
			//   for the email column
		    SingleColumnValueFilter filter = new SingleColumnValueFilter(
		      contactFamily,
		      emailQualifier,
		      CompareOp.EQUAL,
		      emailFilter
		    );

			// Create a scan and set the filter
		    Scan scan = new Scan();
		    scan.setFilter(filter);

			// Get the results
		    ResultScanner results = table.getScanner(scan);
			// Iterate over results and print  values
		    for (Result result : results ) {
		      String id = new String(result.getRow());
		      byte[] firstNameObj = result.getValue(nameFamily, firstNameQualifier);
		      String firstName = new String(firstNameObj);
		      byte[] lastNameObj = result.getValue(nameFamily, lastNameQualifier);
		      String lastName = new String(lastNameObj);
		      System.out.println(firstName + " " + lastName + " - ID: " + id);
			  byte[] emailObj = result.getValue(contactFamily, emailQualifier);
		      String email = new String(emailObj);
			  System.out.println(firstName + " " + lastName + " - " + email + " - ID: " + id);
		    }
		    results.close();
			table.close();
		  }
		}

	The __SearchByEmail__ class can be used to query for rows by email address. Because it uses a regular expression filter, you can provide either a string or a regular expression when using the class.

5. Save the __SearchByEmail.java__ file.

6. In the __hbaseapp\src\main\hava\com\microsoft\examples__ directory, create a new file named __DeleteTable.java__. Use the following as the contents of this file:

		package com.microsoft.examples;
		import java.io.IOException;

		import org.apache.hadoop.conf.Configuration;
		import org.apache.hadoop.hbase.HBaseConfiguration;
		import org.apache.hadoop.hbase.client.HBaseAdmin;

		public class DeleteTable {
		  public static void main(String[] args) throws IOException {
		    Configuration config = HBaseConfiguration.create();

		    // Create an admin object using the config
		    HBaseAdmin admin = new HBaseAdmin(config);

		    // Disable, and then delete the table
		    admin.disableTable("people");
		    admin.deleteTable("people");
		  }
		}

	This class is for cleaning up this example by disabling and dropping the table created by the __CreateTable__ class.

7. Save the __DeleteTable.java__ file.

##Build and package the application

1. Open a command prompt and change directories to the __hbaseapp__ directory.

2. Use the following command to build a JAR file that contains the application:

		mvn clean package

	This cleans any previous build artifacts, downloads any dependencies that have not already been installed, then builds and packages the application.

3. When the command completes, the __hbaseapp\target__ directory will contain a file named __hbaseapp-1.0-SNAPSHOT.jar__.

	> [AZURE.NOTE] The __hbaseapp-1.0-SNAPSHOT.jar__ file is an uber jar (sometimes called a fat jar,) which contains all the dependencies required to run the application.

##Upload the JAR file and start a job

> [AZURE.NOTE] There are many ways to upload a file to your HDInsight cluster, as described in [Upload data for Hadoop jobs in HDInsight](hdinsight-upload-data.md). The following steps use [Azure PowerShell](install-configure-powershell.md).

1. After installing and configuring Azure PowerShell, create a new file named __hbase-runner.psm1__. Use the following as the contents of this file:

		<#
		.SYNOPSIS
		    Copies a file to the primary storage of an HDInsight cluster.
		.DESCRIPTION
		    Copies a file from a local directory to the blob container for
		    the HDInsight cluster.
		.EXAMPLE
		    Start-HBaseExample -className "com.microsoft.examples.CreateTable"
		        -clusterName "MyHDInsightCluster"

		.EXAMPLE
		    Start-HBaseExample -className "com.microsoft.examples.SearchByEmail"
		        -clusterName "MyHDInsightCluster"
		        -emailRegex "contoso.com"

		.EXAMPLE
		    Start-HBaseExample -className "com.microsoft.examples.SearchByEmail"
		        -clusterName "MyHDInsightCluster"
		        -emailRegex "^r" -showErr
		#>

		function Start-HBaseExample {
		    [CmdletBinding(SupportsShouldProcess = $true)]
		    param(
		        #The class to run
		        [Parameter(Mandatory = $true)]
		        [String]$className,

		        #The name of the HDInsight cluster
		        [Parameter(Mandatory = $true)]
		        [String]$clusterName,

		        #Only used when using SearchByEmail
		        [Parameter(Mandatory = $false)]
		        [String]$emailRegex,

		        #Use if you want to see stderr output
		        [Parameter(Mandatory = $false)]
		        [Switch]$showErr
		    )

		    Set-StrictMode -Version 3

		    # Is the Azure module installed?
		    FindAzure

		    # The JAR
		    $jarFile = "wasb:///example/jars/hbaseapp-1.0-SNAPSHOT.jar"

		    # The job definition
		    $jobDefinition = New-AzureHDInsightMapReduceJobDefinition `
		      -JarFile $jarFile `
		      -ClassName $className `
		      -Arguments $emailRegex

		    # Get the job output
		    $job = Start-AzureHDInsightJob -Cluster $clusterName -JobDefinition $jobDefinition
		    Write-Host "Wait for the job to complete ..." -ForegroundColor Green
		    Wait-AzureHDInsightJob -Job $job
		    if($showErr)
		    {
		        Write-Host "STDERR"
		        Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $job.JobId -StandardError
		    }
		    Write-Host "Display the standard output ..." -ForegroundColor Green
		    Get-AzureHDInsightJobOutput -Cluster $clusterName -JobId $job.JobId -StandardOutput
		}

		<#
		.SYNOPSIS
		    Copies a file to the primary storage of an HDInsight cluster.
		.DESCRIPTION
		    Copies a file from a local directory to the blob container for
		    the HDInsight cluster.
		.EXAMPLE
		    Add-HDInsightFile -localPath "C:\temp\data.txt"
		        -destinationPath "example/data/data.txt"
		        -ClusterName "MyHDInsightCluster"
		.EXAMPLE
		    Add-HDInsightFile -localPath "C:\temp\data.txt"
		        -destinationPath "example/data/data.txt"
		        -ClusterName "MyHDInsightCluster"
		        -Container "MyContainer"
		#>

		function Add-HDInsightFile {
		    [CmdletBinding(SupportsShouldProcess = $true)]
		    param(
		        #The path to the local file.
		        [Parameter(Mandatory = $true)]
		        [String]$localPath,

		        #The destination path and file name, relative to the root of the container.
		        [Parameter(Mandatory = $true)]
		        [String]$destinationPath,

		        #The name of the HDInsight cluster
		        [Parameter(Mandatory = $true)]
		        [String]$clusterName,

		        #If specified, overwrites existing files without prompting
		        [Parameter(Mandatory = $false)]
		        [Switch]$force
		    )

		    Set-StrictMode -Version 3

		    # Is the Azure module installed?
		    FindAzure

		    # Does the local path exist?
		    if (-not (Test-Path $localPath))
		    {
		        throw "Source path '$localPath' does not exist."
		    }

		    # Get the primary storage container
		    $storage = GetStorage -clusterName $clusterName

		    # Upload file to storage, overwriting existing files if -force was used.
		    Set-AzureStorageBlobContent -File $localPath -Blob $destinationPath -force:$force `
		                                -Container $storage.container `
		                                -Context $storage.context
		}

		function FindAzure {
		    # Is the Azure module installed?
		    if (-not(Get-Module -ListAvailable Azure))
		    {
		        throw "Azure PowerShell not found! For help, see http://www.windowsazure.com/documentation/articles/install-configure-powershell/"
		    }

		    # Is there an active Azure subscription?
		    $sub = Get-AzureSubscription -ErrorAction SilentlyContinue
		    if(-not($sub))
		    {
		        throw "No active Azure subscription found! If you have a subscription, use the Add-AzureAccount or Import-PublishSettingsFile cmdlets to make the Azure account available to Windows PowerShell."
		    }
		}

		function GetStorage {
		    param(
		        [Parameter(Mandatory = $true)]
		        [String]$clusterName
		    )
		    $hdi = Get-AzureHDInsightCluster -name $clusterName
		    # Does the cluster exist?
		    if (!$hdi)
		    {
		        throw "HDInsight cluster '$clusterName' does not exist."
		    }
		    # Create a return object for context & container
		    $return = @{}
		    $storageAccounts = @{}
		    # Get the primary storage account information
		    $storageAccountName = $hdi.DefaultStorageAccount.StorageAccountName.Split(".",2)[0]
		    $storageAccountKey = $hdi.DefaultStorageAccount.StorageAccountKey
		    # Build the hash of storage account name/keys
		    $storageAccounts.Add($hdi.DefaultStorageAccount.StorageAccountName, $storageAccountKey)
		    foreach($account in $hdi.StorageAccounts)
		    {
		        $storageAccounts.Add($account.StorageAccountName, $account.StorageAccountKey)
		    }
		    # Get the storage context, as we can't depend
		    # on using the default storage context
		    $return.context = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey
		    # Get the container, so we know where to
		    # find/store blobs
		    $return.container = $hdi.DefaultStorageAccount.StorageContainerName
		    # Return storage accounts to support finding all accounts for
		    # a cluster
		    $return.storageAccounts = $storageAccounts

		    return $return
		}
		# Only export the verb-phrase things
		export-modulemember *-*

	This file contains two modules:

	* __Add-HDInsightFile__ - used to upload files to HDInsight

	* __Start-HBaseExample__ - used to run the classes created earlier

2. Save the __hbase-runner.psm1__ file.

3. Open a new Azure PowerShell window, change directories to the __hbaseapp__ directory, and then run the following command.

		PS C:\ Import-Module c:\path\to\hbase-runner.psm1

	Change the path to the location of the __hbase-runner.psm1__ file created earlier. This registers the module for this Azure PowerShell session.

2. Use the following command to upload the __hbaseapp-1.0-SNAPSHOT.jar__ to your HDInsight cluster.

		Add-HDInsightFile -localPath target\hbaseapp-1.0-SNAPSHOT.jar -destinationPath example/jars/hbaseapp-1.0-SNAPSHOT.jar -clusterName hdinsightclustername

	Replace __hdinsightclustername__ with the name of your HDInsight cluster. The command will then upload the __hbaseapp-1.0-SNAPSHOT.jar__ to the __example/jars__ location in the primary storage for your HDInsight cluster.

3. After the files are uploaded, use the following code to create a new table using the __hbaseapp__:

		Start-HBaseExample -className com.microsoft.examples.CreateTable -clusterName hdinsightclustername

	Replace __hdinsightclustername__ with the name of your HDInsight cluster.

	This command creates a new table named __people__ in your HDInsight cluster. This command does not show any output in the console window.

2. To search for entries in the table, use the following command:

		Start-HBaseExample -className com.microsoft.examples.SearchByEmail -clusterName hdinsightclustername -emailRegex contoso.com

	Replace __hdinsightclustername__ with the name of your HDInsight cluster.

	This command uses the **SearchByEmail** class to search for any rows where the __contactinformation__ column family and the __email__ column, contains the string __contoso.com__. You should receive the following results:

		Franklin Holtz - ID: 2
		Franklin Holtz - franklin@contoso.com - ID: 2
		Rae Schroeder - ID: 4
		Rae Schroeder - rae@contoso.com - ID: 4
		Gabriela Ingram - ID: 6
		Gabriela Ingram - gabriela@contoso.com - ID: 6

	Using __fabrikam.com__ for the `-emailRegex` value will return the users that have __fabrikam.com__ in the email field. Since this search is implemented by using a regular expression-based filter, you can also enter regular expressions, such as __^r__, which will return entries where the email begins with the letter 'r'.

##Delete the table

When you are done with the example, use the following command from the Azure PowerShell session to delete the __people__ table used in this example:

	Start-HBaseExample -className com.microsoft.examples.DeleteTable -clusterName hdinsightclustername

Replace __hdinsightclustername__ with the name of your HDInsight cluster.

##Troubleshooting

###No results or unexpected results when using Start-HBaseExample

Use the `-showErr` parameter to view the standard error (STDERR) that is produced while running the job.
