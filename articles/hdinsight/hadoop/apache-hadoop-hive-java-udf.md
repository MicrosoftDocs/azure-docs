---
title: Java user-defined function (UDF) with Apache Hive Azure HDInsight
description: Learn how to create a Java-based user-defined function (UDF) that works with Apache Hive. This example UDF converts a table of text strings to lowercase.
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive, hdiseo17may2017, devx-track-java, devx-track-extended-java
ms.date: 07/20/2023
---

# Use a Java UDF with Apache Hive in HDInsight

Learn how to create a Java-based user-defined function (UDF) that works with Apache Hive. The Java UDF in this example converts a table of text strings to all-lowercase characters.

## Prerequisites

* A Hadoop cluster on HDInsight. See [Get Started with HDInsight on Linux](./apache-hadoop-linux-tutorial-get-started.md).
* [Java Developer Kit (JDK) version 8](/azure/developer/java/fundamentals/java-support-on-azure)
* [Apache Maven](https://maven.apache.org/download.cgi) properly [installed](https://maven.apache.org/install.html) according to Apache.  Maven is a project build system for Java projects.
* The [URI scheme](../hdinsight-hadoop-linux-information.md#URI-and-scheme) for your clusters primary storage. This would be wasb:// for Azure Storage, abfs:// for Azure Data Lake Storage Gen2 or adl:// for Azure Data Lake Storage Gen1. If secure transfer is enabled for Azure Storage, the URI would be `wasbs://`.  See also, [secure transfer](../../storage/common/storage-require-secure-transfer.md).

* A text editor or Java IDE

    > [!IMPORTANT]  
    > If you create the Python files on a Windows client, you must use an editor that uses LF as a line ending. If you are not sure whether your editor uses LF or CRLF, see the [Troubleshooting](#troubleshooting) section for steps on removing the CR character.

## Test environment

The environment used for this article was a computer running Windows 10.  The commands were executed in a command prompt, and the various files were edited with Notepad. Modify accordingly for your environment.

From a command prompt, enter the commands below to create a working environment:

```cmd
IF NOT EXIST C:\HDI MKDIR C:\HDI
cd C:\HDI
```

## Create an example Java UDF

1. Create a new Maven project by entering the following command:

    ```cmd
    mvn archetype:generate -DgroupId=com.microsoft.examples -DartifactId=ExampleUDF -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
    ```

    This command creates a directory named `exampleudf`, which contains the Maven project.

2. Once the project has been created, delete the `exampleudf/src/test` directory that was created as part of the project by entering the following command:

    ```cmd
    cd ExampleUDF
    rmdir /S /Q "src/test"
    ```

3. Open `pom.xml` by entering the command below:

    ```cmd
    notepad pom.xml
    ```

    Then replace the existing `<dependencies>` entry with the following XML:

    ```xml
    <dependencies>
        <dependency>
            <groupId>org.apache.hadoop</groupId>
            <artifactId>hadoop-client</artifactId>
            <version>2.7.3</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>org.apache.hive</groupId>
            <artifactId>hive-exec</artifactId>
            <version>1.2.1</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>
    ```

    These entries specify the version of Hadoop and Hive included with HDInsight 3.6. You can find information on the versions of Hadoop and Hive provided with HDInsight from the [HDInsight component versioning](../hdinsight-component-versioning.md) document.

    Add a `<build>` section before the `</project>` line at the end of the file. This section should contain the following XML:

    ```xml
    <build>
        <plugins>
            <!-- build for Java 1.8. This is required by HDInsight 3.6  -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.3</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                </configuration>
            </plugin>
            <!-- build an uber jar -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-shade-plugin</artifactId>
                <version>3.2.1</version>
                <configuration>
                    <!-- Keep us from getting a can't overwrite file error -->
                    <transformers>
                        <transformer
                                implementation="org.apache.maven.plugins.shade.resource.ApacheLicenseResourceTransformer">
                        </transformer>
                        <transformer implementation="org.apache.maven.plugins.shade.resource.ServicesResourceTransformer">
                        </transformer>
                    </transformers>
                    <!-- Keep us from getting a bad signature error -->
                    <filters>
                        <filter>
                            <artifact>*:*</artifact>
                            <excludes>
                                <exclude>META-INF/*.SF</exclude>
                                <exclude>META-INF/*.DSA</exclude>
                                <exclude>META-INF/*.RSA</exclude>
                            </excludes>
                        </filter>
                    </filters>
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

    These entries define how to build the project. Specifically, the version of Java that the project uses and how to build an uberjar for deployment to the cluster.

    Save the file once the changes have been made.

4. Enter the command below to create and open a new file `ExampleUDF.java`:

    ```cmd
    notepad src/main/java/com/microsoft/examples/ExampleUDF.java
    ```

    Then copy and paste the Java code below into the new file. Then close the file.

    ```java
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
    ```

    This code implements a UDF that accepts a string value, and returns a lowercase version of the string.

## Build and install the UDF

In the commands below, replace `sshuser` with the actual username if different. Replace `mycluster` with the actual cluster name.

1. Compile and package the UDF by entering the following command:

    ```cmd
    mvn compile package
    ```

    This command builds and packages the UDF into the `exampleudf/target/ExampleUDF-1.0-SNAPSHOT.jar` file.

2. Use the `scp` command to copy the file to the HDInsight cluster by entering the following command:

    ```cmd
    scp ./target/ExampleUDF-1.0-SNAPSHOT.jar sshuser@mycluster-ssh.azurehdinsight.net:
    ```

3. Connect to the cluster using SSH by entering the following command:

    ```cmd
    ssh sshuser@mycluster-ssh.azurehdinsight.net
    ```

4. From the open SSH session, copy the jar file to HDInsight storage.

    ```bash
    hdfs dfs -put ExampleUDF-1.0-SNAPSHOT.jar /example/jars
    ```

## Use the UDF from Hive

1. Start the Beeline client from the SSH session by entering the following command:

    ```bash
    beeline -u 'jdbc:hive2://localhost:10001/;transportMode=http'
    ```

    This command assumes that you used the default of **admin** for the login account for your cluster.

2. Once you arrive at the `jdbc:hive2://localhost:10001/>` prompt, enter the following to add the UDF to Hive and expose it as a function.

    ```hiveql
    ADD JAR wasbs:///example/jars/ExampleUDF-1.0-SNAPSHOT.jar;
    CREATE TEMPORARY FUNCTION tolower as 'com.microsoft.examples.ExampleUDF';
    ```

3. Use the UDF to convert values retrieved from a table to lower case strings.

    ```hiveql
    SELECT tolower(state) AS ExampleUDF, state FROM hivesampletable LIMIT 10;
    ```

    This query selects the state from the table, convert the string to lower case, and then display them along with the unmodified name. The output appears similar to the following text:

    ```output
    +---------------+---------------+--+
    |  exampleudf   |     state     |
    +---------------+---------------+--+
    | california    | California    |
    | pennsylvania  | Pennsylvania  |
    | pennsylvania  | Pennsylvania  |
    | pennsylvania  | Pennsylvania  |
    | colorado      | Colorado      |
    | colorado      | Colorado      |
    | colorado      | Colorado      |
    | utah          | Utah          |
    | utah          | Utah          |
    | colorado      | Colorado      |
    +---------------+---------------+--+
    ```

## Troubleshooting

When running the hive job, you may come across an error similar to the following text:

```output
Caused by: org.apache.hadoop.hive.ql.metadata.HiveException: [Error 20001]: An error occurred while reading or writing to your custom script. It may have crashed with an error.
```

This problem may be caused by the line endings in the Python file. Many Windows editors default to using CRLF as the line ending, but Linux applications usually expect LF.

You can use the following PowerShell statements to remove the CR characters before uploading the file to HDInsight:

```PowerShell
# Set $original_file to the Python file path
$text = [IO.File]::ReadAllText($original_file) -replace "`r`n", "`n"
[IO.File]::WriteAllText($original_file, $text)
```

## Next steps

For other ways to work with Hive, see [Use Apache Hive with HDInsight](hdinsight-use-hive.md).

For more information on Hive User-Defined Functions, see [Apache Hive Operators and User-Defined Functions](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+UDF) section of the Hive wiki at apache.org.
