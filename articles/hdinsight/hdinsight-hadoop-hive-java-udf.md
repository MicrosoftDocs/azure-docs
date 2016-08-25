<properties
pageTitle="Use a Java user-defined function (UDF) with Hive in HDInsight | Microsoft Azure"
description="Learn how to create and use a Java user-defined function (UDF) from Hive in HDInsight."
services="hdinsight"
documentationCenter=""
authors="Blackmist"
manager="paulettm"
editor="cgronlun"/>

<tags
ms.service="hdinsight"
ms.devlang="java"
ms.topic="article"
ms.tgt_pltfrm="na"
ms.workload="big-data"
ms.date="07/07/2016"
ms.author="larryfr"/>

#Use a Java UDF with Hive in HDInsight

Hive is great for working with data in HDInsight, but sometimes you need a more general purpose language. Hive allows you to create user-defined functions (UDF) using a variety of programming languages. In this document, you will learn how to use a Java UDF from Hive.

## Requirements

* An Azure subscription

* An HDInsight cluster (Windows or Linux-based)

    > [AZURE.NOTE] Most steps in this document will work on both cluster types; however, the steps used to upload the compiled UDF to the cluster and run it are specific to Linux-based clusters. Links are provided to information that can be used with Windows-based clusters.

* [Java JDK](http://www.oracle.com/technetwork/java/javase/downloads/) 7 or later (or an equivalent, such as OpenJDK)

* [Apache Maven](http://maven.apache.org/)

* A text editor or Java IDE

    > [AZURE.IMPORTANT] If you are using a Linux-based HDInsight server, but creating the Python files on a Windows client, you must use an editor that uses LF as a line ending. If you are not sure whether your editor uses LF or CRLF, see the [Troubleshooting](#troubleshooting) section for steps on removing the CR character using utilities on the HDInsight cluster.

## Create an example UDF

1. From a command line, use the following to create a new Maven project:

        mvn archetype:generate -DgroupId=com.microsoft.examples -DartifactId=ExampleUDF -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false

    > [AZURE.NOTE] If you are using PowerShell, you must put quotes around the parameters. For example, `mvn archetype:generate "-DgroupId=com.microsoft.examples" "-DartifactId=ExampleUDF" "-DarchetypeArtifactId=maven-archetype-quickstart" "-DinteractiveMode=false"`.

    This will create a new directory named __exampleudf__, which will contain the Maven project.

2. Once the project has been created, delete the __exampleudf/src/test__ directory that was created as part of the project; it will not be used for this example.

3. Open the __exampleudf/pom.xml__, and replace the existing `<dependencies>` entry with the following:

        <dependencies>
            <dependency>
                <groupId>org.apache.hadoop</groupId>
                <artifactId>hadoop-client</artifactId>
                <version>2.7.1</version>
                <scope>provided</scope>
            </dependency>
            <dependency>
                <groupId>org.apache.hive</groupId>
                <artifactId>hive-exec</artifactId>
                <version>1.2.1</version>
                <scope>provided</scope>
            </dependency>
        </dependencies>

    These entries specify the version of Hadoop and Hive included with HDInsight 3.3 and 3.4 clusters. You can find information on the versions of Hadoop and Hive provided with HDInsight from the [HDInsight component versioning](hdinsight-component-versioning.md) document.

    Save the file after making this change.

4. Rename __exampleudf/src/main/java/com/microsoft/examples/App.java__ to __ExampleUDF.java__, and then open the file in your editor.

5. Replace the contents of the __ExampleUDF.java__ file with the following, then save the file.

        package com.microsoft.examples;

        import org.apache.hadoop.hive.ql.exec.Description;
        import org.apache.hadoop.hive.ql.exec.UDF;
        import org.apache.hadoop.io.*;

        // Description of the UDF
        @Description(
            name="ExampleUDF",
            value="returns a lower case version of the input string.",
            extended="select ExampleUDF(deviceplatform) from hivesampletable limit 10;"
        )
        public class ExampleUDF extends UDF {
            // Accept a string input
            public String evaluate(String input) {
                // If the value is null, return a null
                if(input == null)
                    return null;
                // Lowercase the input string and return it
                return input.toLowerCase();
            }
        }

    This implements a UDF that accepts a string value, and returns a lowercase version of the string.

## Build and install the UDF

1. Use the following command to compile and package the UDF:

        mvn compile package

    This will build, then package the UDF into __exampleudf/target/ExampleUDF-1.0-SNAPSHOT.jar__.

2. Use the `scp` command to copy the file to the HDInsight cluster.

        scp ./target/ExampleUDF-1.0-SNAPSHOT.jar myuser@mycluster-ssh.azurehdinsight

    Replace __myuser__ with the SSH user account for your cluster. Replace __mycluster__ with the cluster name. If you used a password to secure the SSH account, you will be prompted to enter the password. If you used a certificate, you may need to use the `-i` parameter to specify the private key file.

3. Connect to the cluster using SSH. 

        ssh myuser@mycluster-ssh.azurehdinsight.net

    For more information on using SSH with HDInsight, see the following documents.

    * [Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X](hdinsight-hadoop-linux-use-ssh-unix.md)

    * [Use SSH with Linux-based Hadoop on HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)

4. From the SSH session, copy the jar file to HDInsight storage.

        hdfs dfs -put ExampleUDF-1.0-SNAPSHOT.jar /example/jars

## Use the UDF from Hive

1. Use the following to start the Beeline client from the SSH session.

        beeline -u 'jdbc:hive2://localhost:10001/;transportMode=http' -n admin

    This command assumes that you used the default of __admin__ for the login account for your cluster.

2. Once you arrive at the `jdbc:hive2://localhost:10001/>` prompt, enter the following to add the UDF to Hive and expose it as a function.

        ADD JAR wasbs:///example/jar/ExampleUDF-1.0-SNAPSHOT.jar;
        CREATE TEMPORARY FUNCTION tolower as 'com.microsoft.examples.ExampleUDF';

3. Use the UDF to convert values retrieved from a table to lower case strings.

        SELECT tolower(deviceplatform) FROM hivesampletable LIMIT 10;

    This will select the device platform (Android, Windows, iOS, etc.) from the table, convert the string to lower case, and then display them. The output will appear similar to the following.

        +----------+--+
        |   _c0    |
        +----------+--+
        | android  |
        | android  |
        | android  |
        | android  |
        | android  |
        | android  |
        | android  |
        | android  |
        | android  |
        | android  |
        +----------+--+

## Next steps

For other ways to work with Hive, see [Use Hive with HDInsight](hdinsight-use-hive.md).

For more information on Hive User-Defined Functions, see [Hive Operators and User-Defined Functions](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+UDF) section of the Hive wiki at apache.org.