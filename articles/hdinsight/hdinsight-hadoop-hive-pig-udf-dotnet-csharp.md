---
title: Use C# with Hive and Pig on Hadoop in HDInsight - Azure | Microsoft Docs
description: Learn how to use C# user-defined functions (UDF) with Hive and Pig streaming in Azure HDInsight.
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: jhubbard
editor: cgronlun
tags: azure-portal

ms.assetid: d83def76-12ad-4538-bb8e-3ba3542b7211
ms.service: hdinsight
ms.custom: hdinsightactive
ms.workload: big-data
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 07/12/2017
ms.author: larryfr

---
# Use C# user-defined functions with Hive and Pig streaming on Hadoop in HDInsight

Learn how to use C# user defined functions (UDF) with Apache Hive and Pig on HDInsight.

> [!IMPORTANT]
> The steps in this document work with both Linux-based and Windows-based HDInsight clusters. Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight component versioning](hdinsight-component-versioning.md).

Both Hive and Pig can pass data to external applications for processing. This process is known as _streaming_. When using a .NET applciation, the data is passed to the application on STDIN, and the application returns the results on STDOUT. To read and write from STDIN and STDOUT, you can use `Console.ReadLine()` and `Console.WriteLine()` from a console application.

## Prerequisites

* A familiarity with writing and building C# code that targets .NET Framework 4.5.

    * Use whatever IDE you want. We recommend [Visual Studio](https://www.visualstudio.com/vs) 2015, 2017, or [Visual Studio Code](https://code.visualstudio.com/). The steps in this document use Visual Studio 2017.

* A way to upload .exe files to the cluster and run Pig and Hive jobs. We recommend the Data Lake Tools for Visual Studio, Azure PowerShell and Azure CLI. The steps in this document use the Data Lake Tools for Visual Studio to upload the files and run the example Hive query.

    For information on other ways to run Hive queries and Pig jobs, see the following documents:

    * [Use Apache Hive with HDInsight](hdinsight-use-hive.md)

    * [Use Apache Pig with HDInsight](hdinsight-use-pig.md)

* A Hadoop on HDInsight cluster. For more information on creating a cluster, see [Create an HDInsight cluster](hdinsight-provision-clusters.md).

## .NET on HDInsight

* __Linux-based HDInsight__ clusters using [Mono (https://mono-project.com)](https://mono-project.com) to run .NET applications. Mono version 4.2.1 is included with HDInsight version 3.5.

    For more information on Mono compatibility with .NET Framework versions, see [Mono compatibility](http://www.mono-project.com/docs/about-mono/compatibility/).

    To use a specific version of Mono, see the [Install or update Mono](hdinsight-hadoop-install-mono.md) document.

* __Windows-based HDInsight__ clusters use the Microsoft .NET CLR to run .NET applications.

For more information on the version of the .NET framework and Mono included with HDInsight versions, see [HDInsight component versions](hdinsight-component-versioning.md).

## Create the C\# projects

### Hive UDF

1. Open Visual Studio and create a solution. For the project type, select **Console App (.NET Framework)**, and name the new project **HiveCSharp**.

    > [!IMPORTANT]
    > Select __.NET Framework 4.5__ if you are using a Linux-based HDInsight cluster. For more information on Mono compatibility with .NET Framework versions, see [Mono compatibility](http://www.mono-project.com/docs/about-mono/compatibility/).

2. Replace the contents of **Program.cs** with the following:

    ```csharp
    using System;
    using System.Security.Cryptography;
    using System.Text;
    using System.Threading.Tasks;

    namespace HiveCSharp
    {
        class Program
        {
            static void Main(string[] args)
            {
                string line;
                // Read stdin in a loop
                while ((line = Console.ReadLine()) != null)
                {
                    // Parse the string, trimming line feeds
                    // and splitting fields at tabs
                    line = line.TrimEnd('\n');
                    string[] field = line.Split('\t');
                    string phoneLabel = field[1] + ' ' + field[2];
                    // Emit new data to stdout, delimited by tabs
                    Console.WriteLine("{0}\t{1}\t{2}", field[0], phoneLabel, GetMD5Hash(phoneLabel));
                }
            }
            /// <summary>
            /// Returns an MD5 hash for the given string
            /// </summary>
            /// <param name="input">string value</param>
            /// <returns>an MD5 hash</returns>
            static string GetMD5Hash(string input)
            {
                // Step 1, calculate MD5 hash from input
                MD5 md5 = System.Security.Cryptography.MD5.Create();
                byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(input);
                byte[] hash = md5.ComputeHash(inputBytes);

                // Step 2, convert byte array to hex string
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < hash.Length; i++)
                {
                    sb.Append(hash[i].ToString("x2"));
                }
                return sb.ToString();
            }
        }
    }
    ```

3. Build the project.

### Pig UDF

1. Open Visual Studio and create a solution. For the project type, select **Console Application**, and name the new project **PigUDF**.

2. Replace the contents of the **Program.cs** file with the following code:

    ```csharp
    using System;

    namespace PigUDF
    {
        class Program
        {
            static void Main(string[] args)
            {
                string line;
                // Read stdin in a loop
                while ((line = Console.ReadLine()) != null)
                {
                    // Fix formatting on lines that begin with an exception
                    if(line.StartsWith("java.lang.Exception"))
                    {
                        // Trim the error info off the beginning and add a note to the end of the line
                        line = line.Remove(0, 21) + " - java.lang.Exception";
                    }
                    // Split the fields apart at tab characters
                    string[] field = line.Split('\t');
                    // Put fields back together for writing
                    Console.WriteLine(String.Join("\t",field));
                }
            }
        }
    }
    ```

    This application parses the lines sent from Pig, and reformat lines that begin with `java.lang.Exception`.

3. Save **Program.cs**, and then build the project.

## Upload to storage

1. In Visual Studio, open **Server Explorer**.

2. Expand **Azure**, and then expand **HDInsight**.

3. If prompted, enter your Azure subscription credentials, and then click **Sign In**.

4. Expand the HDInsight cluster that you wish to deploy this application to. An entry with the text __(Default Storage Account)__ is listed.

    ![Server Explorer showing the storage account for the cluster](./media/hdinsight-hadoop-hive-pig-udf-dotnet-csharp/storage.png)

    * If this entry can be expanded, you are using an __Azure Storage Account__ as default storage for the cluster. To view the files on the default storage for the cluster, expand the entry and then double-click the __(Default Container)__.

    * If this entry cannot be expanded, you are using __Azure Data Lake Store__ as the default storage for the cluster. To view the files on the default storage for the cluster, double-click the __(Default Storage Account)__ entry.

6. To upload the .exe files, use one of the following methods:

    * If using an __Azure Storage Account__, click the upload icon, and then browse to the **bin\debug** folder for the **HiveCSharp** project. Finally, select the **HiveCSharp.exe** file and click **Ok**.

        ![upload icon](./media/hdinsight-hadoop-hive-pig-udf-dotnet-csharp/upload.png)
    
    * If using __Azure Data Lake Store__, right-click an empty area in the file listing, and then select __Upload__. Finally, select the **HiveCSharp.exe** file and click **Open**.

    Once the __HiveCSharp.exe__ upload has finished, repeat the upload process for the __PigUDF.exe__ file.

## Run a Hive query

1. In Visual Studio, open **Server Explorer**.

2. Expand **Azure**, and then expand **HDInsight**.

3. Right-click the cluster that you deployed the **HiveCSharp** application to, and then select **Write a Hive Query**.

4. Use the following text for the Hive query:

    ```hiveql
    -- Uncomment the following if you are using Azure Storage
    -- add file wasb:///HiveCSharp.exe;
    -- Uncomment the following if you are using Azure Data Lake Store
    -- add file adl:///HiveCSharp.exe;

    SELECT TRANSFORM (clientid, devicemake, devicemodel)
    USING 'HiveCSharp.exe' AS
    (clientid string, phoneLabel string, phoneHash string)
    FROM hivesampletable
    ORDER BY clientid LIMIT 50;
    ```

    > [!IMPORTANT]
    > Uncomment the `add file` statement that matches the type of default storage used for your cluster.

    This query selects the `clientid`, `devicemake`, and `devicemodel` fields from `hivesampletable`, and passes the fields to the HiveCSharp.exe application. The query expects the application to return three fields, which are stored as `clientid`, `phoneLabel`, and `phoneHash`. The query also expects to find HiveCSharp.exe in the root of the default storage container.

5. Click **Submit** to submit the job to the HDInsight cluster. The **Hive Job Summary** window opens.

6. Click **Refresh** to refresh the summary until **Job Status** changes to **Completed**. To view the job output, click **Job Output**.

## Run a Pig job

1. Use one of the following methods to connect to your HDInsight cluster:

    * If you are using a __Linux-based__ HDInsight cluster, use SSH. For example, `ssh sshuser@mycluster-ssh.azurehdinsight.net`. For more information, see [Use SSH withHDInsight](hdinsight-hadoop-linux-use-ssh-unix.md)
    
    * If you are using a __Windows-based__ HDInsight cluster, [Connect to the cluster using Remote Desktop](hdinsight-administer-use-management-portal.md#connect-to-clusters-using-rdp)

2. Use one the following command to start the Pig command line:

        pig

    > [!IMPORTANT]
    > If you are using a Windows-based cluster, use the following commands instead:
    > ```
    > cd %PIG_HOME%
    > bin\pig
    > ```

    A `grunt>` prompt is displayed.

3. Enter the following to run a Pig job that uses the .NET Framework application:

        DEFINE streamer `PigUDF.exe` CACHE('/PigUDF.exe');
        LOGS = LOAD '/example/data/sample.log' as (LINE:chararray);
        LOG = FILTER LOGS by LINE is not null;
        DETAILS = STREAM LOG through streamer as (col1, col2, col3, col4, col5);
        DUMP DETAILS;

    The `DEFINE` statement creates an alias of `streamer` for the pigudf.exe applications, and `CACHE` loads it from default storage for the cluster. Later, `streamer` is used with the `STREAM` operator to process the single lines contained in LOG and return the data as a series of columns.

    > [!NOTE]
    > The application name that is used for streaming must be surrounded by the \` (backtick) character when aliased, and ' (single quote) when used with `SHIP`.

4. After entering the last line, the job should start. It returns output similar to the following text:

        (2012-02-03 20:11:56 SampleClass5 [WARN] problem finding id 1358451042 - java.lang.Exception)
        (2012-02-03 20:11:56 SampleClass5 [DEBUG] detail for id 1976092771)
        (2012-02-03 20:11:56 SampleClass5 [TRACE] verbose detail for id 1317358561)
        (2012-02-03 20:11:56 SampleClass5 [TRACE] verbose detail for id 1737534798)
        (2012-02-03 20:11:56 SampleClass7 [DEBUG] detail for id 1475865947)

## Next steps

In this document, you have learned how to use a .NET Framework application from Hive and Pig on HDInsight. If you would like to learn how to use Python with Hive and Pig, see [Use Python with Hive and Pig in HDInsight](hdinsight-python.md).

For other ways to use Pig and Hive, and to learn about using MapReduce, see the following documents:

* [Use Hive with HDInsight](hdinsight-use-hive.md)
* [Use Pig with HDInsight](hdinsight-use-pig.md)
* [Use MapReduce with HDInsight](hdinsight-use-mapreduce.md)
