---
title: Java HBase client - Azure HDInsight 
description: Learn how to use Apache Maven to build a Java-based Apache HBase application, then deploy it to HBase on Azure HDInsight.
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 04/30/2018
ms.author: jasonh

---
# Build Java applications for Apache HBase

Learn how to create an [Apache HBase](http://hbase.apache.org/) application in Java. Then use the application with HBase on Azure HDInsight.

The steps in this document use [Maven](http://maven.apache.org/) to create and build the project. Maven is a software project management and comprehension tool that allows you to build software, documentation, and reports for Java projects.

> [!NOTE]
> The steps in this document were most recently tested with HDInsight 3.6.

> [!IMPORTANT]
> The steps in this document require an HDInsight cluster that uses Linux. Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight retirement on Windows](../hdinsight-component-versioning.md#hdinsight-windows-retirement).

## Requirements

* [Java platform JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html) 8 or later.

    > [!NOTE]
    > HDInsight 3.5 and greater requires Java 8. Earlier versions of HDInsight require Java 7.

* [Maven](http://maven.apache.org/)

* [A Linux-based Azure HDInsight cluster with HBase](apache-hbase-tutorial-get-started-linux.md#create-hbase-cluster)

## Create the project

1. From the command line in your development environment, change directories to the location where you want to create the project, for example, `cd code\hbase`.

2. Use the **mvn** command, which is installed with Maven, to generate the scaffolding for the project.

    ```bash
    mvn archetype:generate -DgroupId=com.microsoft.examples -DartifactId=hbaseapp -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
    ```

    > [!NOTE]
    > If you are using PowerShell, you must enclose the `-D` parameters in double quotes.
    >
    > `mvn archetype:generate "-DgroupId=com.microsoft.examples" "-DartifactId=hbaseapp" "-DarchetypeArtifactId=maven-archetype-quickstart" "-DinteractiveMode=false"`

    This command creates a directory with the same name as the **artifactID** parameter (**hbaseapp** in this example.) This directory contains the following items:

   * **pom.xml**:  The Project Object Model ([POM](http://maven.apache.org/guides/introduction/introduction-to-the-pom.html)) contains information and configuration details used to build the project.
   * **src**: The directory that contains the **main/java/com/microsoft/examples** directory, where you author the application.

3. Delete the `src/test/java/com/microsoft/examples/apptest.java` file. It is not be used in this example.

## Update the Project Object Model

1. Edit the `pom.xml` file and add the following code inside the `<dependencies>` section:

   ```xml
    <dependency>
        <groupId>org.apache.hbase</groupId>
        <artifactId>hbase-client</artifactId>
        <version>1.1.2</version>
    </dependency>
    <dependency>
        <groupId>org.apache.phoenix</groupId>
        <artifactId>phoenix-core</artifactId>
        <version>4.4.0-HBase-1.1</version>
    </dependency>
   ```

    This section indicates that the project needs **hbase-client** and **phoenix-core** components. At compile time, these dependencies are downloaded from the default Maven repository. You can use the [Maven Central Repository Search](http://search.maven.org/#artifactdetails%7Corg.apache.hbase%7Chbase-client%7C0.98.4-hadoop2%7Cjar) to learn more about this dependency.

   > [!IMPORTANT]
   > The version number of the hbase-client must match the version of HBase that is provided with your HDInsight cluster. Use the following table to find the correct version number.

   | HDInsight cluster version | HBase version to use |
   | --- | --- |
   | 3.2 |0.98.4-hadoop2 |
   | 3.3, 3.4, 3.5, and 3.6 |1.1.2 |

    For more information on HDInsight versions and components, see [What are the different Hadoop components available with HDInsight](../hdinsight-component-versioning.md).

3. Add the following code to the **pom.xml** file. This text must be inside the `<project>...</project>` tags in the file, for example, between `</dependencies>` and `</project>`.

   ```xml
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
                <source>1.8</source>
                <target>1.8</target>
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
   ```

    This section configures a resource (`conf/hbase-site.xml`) that contains configuration information for HBase.

   > [!NOTE]
   > You can also set configuration values via code. See the comments in the `CreateTable` example.

    This section also configures the [Maven Compiler Plugin](http://maven.apache.org/plugins/maven-compiler-plugin/) and [Maven Shade Plugin](http://maven.apache.org/plugins/maven-shade-plugin/). The compiler plug-in is used to compile the topology. The shade plug-in is used to prevent license duplication in the JAR package that is built by Maven. This plugin is used to prevent a "duplicate license files" error at run time on the HDInsight cluster. Using maven-shade-plugin with the `ApacheLicenseResourceTransformer` implementation prevents the error.

    The maven-shade-plugin also produces an uber jar that contains all the dependencies required by the application.

4. Save the `pom.xml` file.

5. Create a directory named `conf` in the `hbaseapp` directory. This directory is used to hold configuration information for connecting to HBase.

6. Use the following command to copy the HBase configuration from the HBase cluster to the `conf` directory. Replace `USERNAME` with the name of your SSH login. Replace `CLUSTERNAME` with your HDInsight cluster name:

    ```bash
    scp USERNAME@CLUSTERNAME-ssh.azurehdinsight.net:/etc/hbase/conf/hbase-site.xml ./conf/hbase-site.xml
    ```

   For more information on using `ssh` and `scp`, see [Use SSH with HDInsight](../hdinsight-hadoop-linux-use-ssh-unix.md).

## Create the application

1. Go to the `hbaseapp/src/main/java/com/microsoft/examples` directory and rename the app.java file to `CreateTable.java`.

2. Open the `CreateTable.java` file and replace the existing contents with the following text:

   ```java
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
        // in code instead of an hbase-site.xml file
        //
        // config.set("hbase.zookeeper.quorum",
        //            "zookeepernode0,zookeepernode1,zookeepernode2");
        //config.set("hbase.zookeeper.property.clientPort", "2181");
        //config.set("hbase.cluster.distributed", "true");
        //
        //NOTE: Actual zookeeper host names can be found using Ambari:
        //curl -u admin:PASSWORD -G "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/hosts"

        //Linux-based HDInsight clusters use /hbase-unsecure as the znode parent
        config.set("zookeeper.znode.parent","/hbase-unsecure");

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
   ```

    This code is the **CreateTable** class, which creates a table named **people** and populate it with some predefined users.

3. Save the `CreateTable.java` file.

4. In the `hbaseapp/src/main/java/com/microsoft/examples` directory, create a file named `SearchByEmail.java`. Use the following text as the contents of this file:

   ```java
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

        // Create a regex filter
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
   ```

    The **SearchByEmail** class can be used to query for rows by email address. Because it uses a regular expression filter, you can provide either a string or a regular expression when using the class.

5. Save the `SearchByEmail.java` file.

6. In the `hbaseapp/src/main/hava/com/microsoft/examples` directory, create a file named `DeleteTable.java`. Use the following text as the contents of this file:

   ```java
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
   ```

    This class cleans up the HBase tables created in this example by disabling and dropping the table created by the `CreateTable` class.

7. Save the `DeleteTable.java` file.

## Build and package the application

1. From the `hbaseapp` directory, use the following command to build a JAR file that contains the application:

    ```bash
    mvn clean package
    ```

    This command builds and packages the application into a .jar file.

2. When the command completes, the `hbaseapp/target` directory contains a file named `hbaseapp-1.0-SNAPSHOT.jar`.

   > [!NOTE]
   > The `hbaseapp-1.0-SNAPSHOT.jar` file is an uber jar. It contains all the dependencies required to run the application.


## Upload the JAR and run jobs (SSH)

The following steps use `scp` to copy the JAR to the primary head node of your HBase on HDInsight cluster. The `ssh` command is then used to connect to the cluster and run the example directly on the head node.

1. To upload the jar to the cluster, use the following command:

    ```bash
    scp ./target/hbaseapp-1.0-SNAPSHOT.jar USERNAME@CLUSTERNAME-ssh.azurehdinsight.net:hbaseapp-1.0-SNAPSHOT.jar
    ```

    Replace `USERNAME` with the name of your SSH login. Replace `CLUSTERNAME` with your HDInsight cluster name.

2. To connect to the HBase cluster, use the following command:

    ```bash
    ssh USERNAME@CLUSTERNAME-ssh.azurehdinsight.net
    ```

    Replace `USERNAME` the name of your SSH login. Replace `CLUSTERNAME` with your HDInsight cluster name.

3. To create an HBase table using the Java application, use the following command:

    ```bash
    yarn jar hbaseapp-1.0-SNAPSHOT.jar com.microsoft.examples.CreateTable
    ```

    This command creates a HBase table named **people**, and populates it with data.

4. To search for email addresses stored in the table, use the following command:

    ```bash
    yarn jar hbaseapp-1.0-SNAPSHOT.jar com.microsoft.examples.SearchByEmail contoso.com
    ```

    You receive the following results:

        Franklin Holtz - ID: 2
        Franklin Holtz - franklin@contoso.com - ID: 2
        Rae Schroeder - ID: 4
        Rae Schroeder - rae@contoso.com - ID: 4
        Gabriela Ingram - ID: 6
        Gabriela Ingram - gabriela@contoso.com - ID: 6

5. To delete the table, use the following command:

    ```bash
    yarn jar hbaseapp-1.0-SNAPSHOT.jar com.microsoft.examples.DeleteTable
    ```

## Upload the JAR and run jobs (PowerShell)

The following steps use Azure PowerShell to upload the JAR to the default storage for your HBase cluster. HDInsight cmdlets are then used to run the examples remotely.

1. After installing and configuring Azure PowerShell, create a file named `hbase-runner.psm1`. Use the following text as the contents of this file:

   ```powershell
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

    # Get the login for the HDInsight cluster
    $creds=Get-Credential -Message "Enter the login for the cluster" -UserName "admin"

    # The JAR
    $jarFile = "wasb:///example/jars/hbaseapp-1.0-SNAPSHOT.jar"

    # The job definition
    $jobDefinition = New-AzureRmHDInsightMapReduceJobDefinition `
        -JarFile $jarFile `
        -ClassName $className `
        -Arguments $emailRegex

    # Get the job output
    $job = Start-AzureRmHDInsightJob `
        -ClusterName $clusterName `
        -JobDefinition $jobDefinition `
        -HttpCredential $creds
    Write-Host "Wait for the job to complete ..." -ForegroundColor Green
    Wait-AzureRmHDInsightJob `
        -ClusterName $clusterName `
        -JobId $job.JobId `
        -HttpCredential $creds
    if($showErr)
    {
    Write-Host "STDERR"
    Get-AzureRmHDInsightJobOutput `
                -Clustername $clusterName `
                -JobId $job.JobId `
                -HttpCredential $creds `
                -DisplayOutputType StandardError
    }
    Write-Host "Display the standard output ..." -ForegroundColor Green
    Get-AzureRmHDInsightJobOutput `
                -Clustername $clusterName `
                -JobId $job.JobId `
                -HttpCredential $creds
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

        # Get authentication for the cluster
        $creds=Get-Credential

        # Does the local path exist?
        if (-not (Test-Path $localPath))
        {
            throw "Source path '$localPath' does not exist."
        }

        # Get the primary storage container
        $storage = GetStorage -clusterName $clusterName

        # Upload file to storage, overwriting existing files if -force was used.
        Set-AzureStorageBlobContent -File $localPath `
            -Blob $destinationPath `
            -force:$force `
            -Container $storage.container `
            -Context $storage.context
    }

    function FindAzure {
        # Is there an active Azure subscription?
        $sub = Get-AzureRmSubscription -ErrorAction SilentlyContinue
        if(-not($sub))
        {
            throw "No active Azure subscription found! If you have a subscription, use the Connect-AzureRmAccount cmdlet to login to your subscription."
        }
    }

    function GetStorage {
        param(
            [Parameter(Mandatory = $true)]
            [String]$clusterName
        )
        $hdi = Get-AzureRmHDInsightCluster -ClusterName $clusterName
        # Does the cluster exist?
        if (!$hdi)
        {
            throw "HDInsight cluster '$clusterName' does not exist."
        }
        # Create a return object for context & container
        $return = @{}
        $storageAccounts = @{}

        # Get storage information
        $resourceGroup = $hdi.ResourceGroup
        $storageAccountName=$hdi.DefaultStorageAccount.split('.')[0]
        $container=$hdi.DefaultStorageContainer
        $storageAccountKey=(Get-AzureRmStorageAccountKey `
            -Name $storageAccountName `
        -ResourceGroupName $resourceGroup)[0].Value
        # Get the resource group, in case we need that
        $return.resourceGroup = $resourceGroup
        # Get the storage context, as we can't depend
        # on using the default storage context
        $return.context = New-AzureStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $storageAccountKey
        # Get the container, so we know where to
        # find/store blobs
        $return.container = $container
        # Return storage accounts to support finding all accounts for
        # a cluster
        $return.storageAccount = $storageAccountName
        $return.storageAccountKey = $storageAccountKey

        return $return
    }
    # Only export the verb-phrase things
    export-modulemember *-*
   ```

    This file contains two modules:

   * **Add-HDInsightFile** - used to upload files to the cluster
   * **Start-HBaseExample** - used to run the classes created earlier

2. Save the `hbase-runner.psm1` file.

3. Open a new Azure PowerShell window, change directories to the `hbaseapp` directory, and then run the following command:

    ```powershell
    PS C:\ Import-Module c:\path\to\hbase-runner.psm1
    ```

    Change the path to the location of the `hbase-runner.psm1` file created earlier. This command registers the module with Azure PowerShell.

4. Use the following command to upload the `hbaseapp-1.0-SNAPSHOT.jar` to your cluster.

    ```powershell
    Add-HDInsightFile -localPath target\hbaseapp-1.0-SNAPSHOT.jar -destinationPath example/jars/hbaseapp-1.0-SNAPSHOT.jar -clusterName hdinsightclustername
    ```

    Replace `hdinsightclustername` with the name of your cluster. When prompted, enter the cluster login (admin) name and password. The command uploads the `hbaseapp-1.0-SNAPSHOT.jar` to the `example/jars` location in the primary storage for your cluster.

5. To create a table using the `hbaseapp`, use the following command:

    ```powershell
    Start-HBaseExample -className com.microsoft.examples.CreateTable -clusterName hdinsightclustername
    ```

    Replace `hdinsightclustername` with the name of your cluster. When prompted, enter the cluster login (admin) name and password.

    This command creates a table named **people** in HBase on your HDInsight cluster. This command does not show any output in the console window.

6. To search for entries in the table, use the following command:

    ```powershell
    Start-HBaseExample -className com.microsoft.examples.SearchByEmail -clusterName hdinsightclustername -emailRegex contoso.com
    ```

    Replace `hdinsightclustername` with the name of your cluster. When prompted, enter the cluster login (admin) name and password.

    This command uses the `SearchByEmail` class to search for any rows where the `contactinformation` column family and the `email` column, contains the string `contoso.com`. You should receive the following results:

          Franklin Holtz - ID: 2
          Franklin Holtz - franklin@contoso.com - ID: 2
          Rae Schroeder - ID: 4
          Rae Schroeder - rae@contoso.com - ID: 4
          Gabriela Ingram - ID: 6
          Gabriela Ingram - gabriela@contoso.com - ID: 6

    Using **fabrikam.com** for the `-emailRegex` value returns the users that have **fabrikam.com** in the email field. You can also use regular expressions as the search term. For example, **^r** returns email addresses that begin with the letter 'r'.

### No results or unexpected results when using Start-HBaseExample

Use the `-showErr` parameter to view the standard error (STDERR) that is produced while running the job.

## Delete the table

When you are done with the example, use the following to delete the **people** table used in this example:

__From an `ssh` session__:

`yarn jar hbaseapp-1.0-SNAPSHOT.jar com.microsoft.examples.DeleteTable`

__From Azure PowerShell__:

`Start-HBaseExample -className com.microsoft.examples.DeleteTable -clusterName hdinsightclustername`

## Next steps

[Learn how to use SQuirreL SQL with HBase](apache-hbase-phoenix-squirrel-linux.md)
