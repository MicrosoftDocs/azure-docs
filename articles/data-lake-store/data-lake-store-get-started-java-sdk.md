---
title: Java SDK - Filesystem operations on Data Lake Storage Gen1 - Azure
description: Use the Java SDK for Azure Data Lake Storage Gen1 to perform filesystem operations on Data Lake Storage Gen1 such as creating folders, and uploading and downloading data files.

author: normesta
ms.service: data-lake-store
ms.topic: how-to
ms.date: 02/23/2022
ms.custom: devx-track-java, devx-track-extended-java
ms.author: normesta
---
# Filesystem operations on Azure Data Lake Storage Gen1 using Java SDK
> [!div class="op_single_selector"]
> * [.NET SDK](data-lake-store-data-operations-net-sdk.md)
> * [Java SDK](data-lake-store-get-started-java-sdk.md)
> * [REST API](data-lake-store-data-operations-rest-api.md)
> * [Python](data-lake-store-data-operations-python.md)
>
> 

Learn how to use the Azure Data Lake Storage Gen1 Java SDK to perform basic operations such as create folders, upload and download data files, etc. For more information about Data Lake Storage Gen1, see [Azure Data Lake Storage Gen1](data-lake-store-overview.md).

You can access the Java SDK API docs for Data Lake Storage Gen1 at [Azure Data Lake Storage Gen1 Java API docs](https://azure.github.io/azure-data-lake-store-java/javadoc/).

## Prerequisites
* Java Development Kit (JDK 7 or higher, using Java version 1.7 or higher)
* Data Lake Storage Gen1 account. Follow the instructions at [Get started with Azure Data Lake Storage Gen1 using the Azure portal](data-lake-store-get-started-portal.md).
* [Maven](https://maven.apache.org/install.html). This tutorial uses Maven for build and project dependencies. Although it is possible to build without using a build system like Maven or Gradle, these systems make is much easier to manage dependencies.
* (Optional) And IDE like [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) or [Eclipse](https://www.eclipse.org/downloads/) or similar.

## Create a Java application
The code sample available [on GitHub](https://azure.microsoft.com/documentation/samples/data-lake-store-java-upload-download-get-started/) walks you through the process of creating files in the store, concatenating files, downloading a file, and deleting some files in the store. This section of the article walks you through the main parts of the code.

1. Create a Maven project using [mvn archetype](https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html) from the command line or using an IDE. For instructions on how to create a Java project using IntelliJ, see [here](https://www.jetbrains.com/help/idea/2016.1/creating-and-running-your-first-java-application.html). For instructions on how to create a project using Eclipse, see [here](https://help.eclipse.org/mars/index.jsp?topic=%2Forg.eclipse.jdt.doc.user%2FgettingStarted%2Fqs-3.htm). 

2. Add the following dependencies to your Maven **pom.xml** file. Add the following snippet before the **\</project>** tag:
   
    ```xml
    <dependencies>
        <dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>azure-data-lake-store-sdk</artifactId>
        <version>2.1.5</version>
        </dependency>
        <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-nop</artifactId>
        <version>1.7.21</version>
        </dependency>
    </dependencies>
    ```
   
    The first dependency is to use the Data Lake Storage Gen1 SDK (`azure-data-lake-store-sdk`) from the maven repository. The second dependency is to specify the logging framework (`slf4j-nop`) to use for this application. The Data Lake Storage Gen1 SDK uses [SLF4J](https://www.slf4j.org/) logging façade, which lets you choose from a number of popular logging frameworks, like Log4j, Java logging, Logback, etc., or no logging. For this example, we disable logging, hence we use the **slf4j-nop** binding. To use other logging options in your app, see [here](https://www.slf4j.org/manual.html#projectDep).

3. Add the following import statements to your application.

    ```java
    import com.microsoft.azure.datalake.store.ADLException;
    import com.microsoft.azure.datalake.store.ADLStoreClient;
    import com.microsoft.azure.datalake.store.DirectoryEntry;
    import com.microsoft.azure.datalake.store.IfExists;
    import com.microsoft.azure.datalake.store.oauth2.AccessTokenProvider;
    import com.microsoft.azure.datalake.store.oauth2.ClientCredsTokenProvider;

    import java.io.*;
    import java.util.Arrays;
    import java.util.List;
    ```

## Authentication

* For end-user authentication for your application, see [End-user-authentication with Data Lake Storage Gen1 using Java](data-lake-store-end-user-authenticate-java-sdk.md).
* For service-to-service authentication for your application, see [Service-to-service authentication with Data Lake Storage Gen1 using Java](data-lake-store-service-to-service-authenticate-java.md).

## Create a Data Lake Storage Gen1 client
Creating an [ADLStoreClient](https://azure.github.io/azure-data-lake-store-java/javadoc/) object requires you to specify the Data Lake Storage Gen1 account name and the token provider you generated when you authenticated with Data Lake Storage Gen1 (see [Authentication](#authentication) section). The Data Lake Storage Gen1 account name needs to be a fully qualified domain name. For example, replace **FILL-IN-HERE** with something like **mydatalakestoragegen1.azuredatalakestore.net**.

```java
private static String accountFQDN = "FILL-IN-HERE";  // full account FQDN, not just the account name
ADLStoreClient client = ADLStoreClient.createClient(accountFQDN, provider);
```

The code snippets in the following sections contain examples of some common filesystem operations. You can look at the full [Data Lake Storage Gen1 Java SDK API docs](https://azure.github.io/azure-data-lake-store-java/javadoc/) of the **ADLStoreClient** object to see other operations.

## Create a directory

The following snippet creates a directory structure in the root of the Data Lake Storage Gen1 account you specified.

```java
// create directory
client.createDirectory("/a/b/w");
System.out.println("Directory created.");
```

## Create a file

The following snippet creates a file (c.txt) in the directory structure and writes some data to the file.

```java
// create file and write some content
String filename = "/a/b/c.txt";
OutputStream stream = client.createFile(filename, IfExists.OVERWRITE  );
PrintStream out = new PrintStream(stream);
for (int i = 1; i <= 10; i++) {
    out.println("This is line #" + i);
    out.format("This is the same line (%d), but using formatted output. %n", i);
}
out.close();
System.out.println("File created.");
```

You can also create a file (d.txt) using byte arrays.

```java
// create file using byte arrays
stream = client.createFile("/a/b/d.txt", IfExists.OVERWRITE);
byte[] buf = getSampleContent();
stream.write(buf);
stream.close();
System.out.println("File created using byte array.");
```

The definition for `getSampleContent` function used in the preceding snippet is available as part of the sample [on GitHub](https://azure.microsoft.com/documentation/samples/data-lake-store-java-upload-download-get-started/). 

## Append to a file

The following snippet appends content to an existing file.

```java
// append to file
stream = client.getAppendStream(filename);
stream.write(getSampleContent());
stream.close();
System.out.println("File appended.");
```

The definition for `getSampleContent` function used in the preceding snippet is available as part of the sample [on GitHub](https://azure.microsoft.com/documentation/samples/data-lake-store-java-upload-download-get-started/).

## Read a file

The following snippet reads content from a file in a Data Lake Storage Gen1 account.

```java
// Read File
InputStream in = client.getReadStream(filename);
BufferedReader reader = new BufferedReader(new InputStreamReader(in));
String line;
while ( (line = reader.readLine()) != null) {
    System.out.println(line);
}
reader.close();
System.out.println();
System.out.println("File contents read.");
```

## Concatenate files

The following snippet concatenates two files in a Data Lake Storage Gen1 account. If successful, the concatenated file replaces the two existing files.

```java
// concatenate the two files into one
List<String> fileList = Arrays.asList("/a/b/c.txt", "/a/b/d.txt");
client.concatenateFiles("/a/b/f.txt", fileList);
System.out.println("Two files concatenated into a new file.");
```

## Rename a file

The following snippet renames a file in a Data Lake Storage Gen1 account.

```java
//rename the file
client.rename("/a/b/f.txt", "/a/b/g.txt");
System.out.println("New file renamed.");
```

## Get metadata for a file

The following snippet retrieves the metadata for a file in a Data Lake Storage Gen1 account.

```java
// get file metadata
DirectoryEntry ent = client.getDirectoryEntry(filename);
printDirectoryInfo(ent);
System.out.println("File metadata retrieved.");
```

## Set permissions on a file

The following snippet sets permissions on the file that you created in the previous section.

```java
// set file permission
client.setPermission(filename, "744");
System.out.println("File permission set.");
```

## List directory contents

The following snippet lists the contents of a directory, recursively.

```java
// list directory contents
List<DirectoryEntry> list = client.enumerateDirectory("/a/b", 2000);
System.out.println("Directory listing for directory /a/b:");
for (DirectoryEntry entry : list) {
    printDirectoryInfo(entry);
}
System.out.println("Directory contents listed.");
```

The definition for `printDirectoryInfo` function used in the preceding snippet is available as part of the sample [on GitHub](https://azure.microsoft.com/documentation/samples/data-lake-store-java-upload-download-get-started/).

## Delete files and folders

The following snippet deletes the specified files and folders in a Data Lake Storage Gen1 account, recursively.

```java
// delete directory along with all the subdirectories and files in it
client.deleteRecursive("/a");
System.out.println("All files and folders deleted recursively");
promptEnterKey();
```

## Build and run the application
1. To run from within an IDE, locate and press the **Run** button. To run from Maven, use [exec:exec](https://www.mojohaus.org/exec-maven-plugin/exec-mojo.html).
2. To produce a standalone jar that you can run from command-line build the jar with all dependencies included, using the [Maven assembly plugin](https://maven.apache.org/plugins/maven-assembly-plugin/usage.html). The pom.xml in the [example source code on GitHub](https://github.com/Azure-Samples/data-lake-store-java-upload-download-get-started/blob/master/pom.xml) has an example.

## Next steps
* [Explore JavaDoc for the Java SDK](https://azure.github.io/azure-data-lake-store-java/javadoc/)
* [Secure data in Data Lake Storage Gen1](data-lake-store-secure-data.md)
