---
title: Use the Java SDK to develop applications in Azure Data Lake Store | Microsoft Docs
description: Use Azure Data Lake Store Java SDK to create a Data Lake Store account and perform basic operations in the Data Lake Store
services: data-lake-store
documentationcenter: ''
author: nitinme
manager: jhubbard
editor: cgronlun

ms.assetid: d10e09db-5232-4e84-bb50-52efc2c21887
ms.service: data-lake-store
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 04/28/2017
ms.author: nitinme

---
# Get started with Azure Data Lake Store using Java
> [!div class="op_single_selector"]
> * [Portal](data-lake-store-get-started-portal.md)
> * [PowerShell](data-lake-store-get-started-powershell.md)
> * [.NET SDK](data-lake-store-get-started-net-sdk.md)
> * [Java SDK](data-lake-store-get-started-java-sdk.md)
> * [REST API](data-lake-store-get-started-rest-api.md)
> * [Azure CLI 2.0](data-lake-store-get-started-cli-2.0.md)
> * [Node.js](data-lake-store-manage-use-nodejs.md)
> * [Python](data-lake-store-get-started-python.md)
>
> 

Learn how to use the Azure Data Lake Store Java SDK to perform basic operations such as create folders, upload and download data files, etc. For more information about Data Lake, see [Azure Data Lake Store](data-lake-store-overview.md).

You can access the Java SDK API docs for Azure Data Lake Store at [Azure Data Lake Store Java API docs](https://azure.github.io/azure-data-lake-store-java/javadoc/).

## Prerequisites
* Java Development Kit (JDK 7 or higher, using Java version 1.7 or higher)
* Azure Data Lake Store account. Follow the instructions at [Get started with Azure Data Lake Store using the Azure Portal](data-lake-store-get-started-portal.md).
* [Maven](https://maven.apache.org/install.html). This tutorial uses Maven for build and project dependencies. Although it is possible to build without using a build system like Maven or Gradle, these systems make is much easier to manage dependencies.
* (Optional) And IDE like [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) or [Eclipse](https://www.eclipse.org/downloads/) or similar.

## How do I authenticate using Azure Active Directory?
In this tutorial we use a Azure AD application client secret to retrieve an Azure Active Directory token (service-to-service authentication). We use this token to create an Data Lake Store client object to perform operations file and directory operations. For instructions on how to authenticate with Azure Data Lake Store using the client secret, we perform the following high-level steps:

1. Create an Azure AD web application
2. Retrieve the client ID, client secret, and token endpoint for the Azure AD web application.
3. Configure access for the Azure AD web application on the Data Lake Store file/folder that you want to access from the Java application you are creating.

For instructions on how to perform these steps, see [Create an Active Directory application](data-lake-store-authenticate-using-active-directory.md).

Azure Active Directory provides other options as well to retrieve a token. You can pick from a number of different authentication mechanisms to suit your scenario, for example, an application running in a browser, an application distributed as a desktop application, or a server application running on-premises or in an Azure virtual machine. You can also pick from different types of credentials like passwords, certificates, 2-factor authentication, etc. In addition, Azure Active Directory allows you to synchronize your on-premises Active Directory users with the cloud. For details, see [Authentication Scenarios for Azure Active Directory](../active-directory/active-directory-authentication-scenarios.md). 

## Create a Java application
The code sample available [on GitHub](https://azure.microsoft.com/documentation/samples/data-lake-store-java-upload-download-get-started/) walks you through the process of creating files in the store, concatenating files, downloading a file, and deleting some files in the store. This section of the article walk you through the main parts of the code.

1. Create a Maven project using [mvn archetype](https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html) from the command-line or using an IDE. For instructions on how to create a Java project using IntelliJ, see [here](https://www.jetbrains.com/help/idea/2016.1/creating-and-running-your-first-java-application.html). For instructions on how to create a project using Eclipse, see [here](http://help.eclipse.org/mars/index.jsp?topic=%2Forg.eclipse.jdt.doc.user%2FgettingStarted%2Fqs-3.htm). 
2. Add the following dependencies to your Maven **pom.xml** file. Add the following snippet of text between the **\</version>** tag and the **\</project>** tag:
   
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
   
    The first dependency is to use the Data Lake Store SDK (`azure-data-lake-store-sdk`) from the maven repository. The second dependency (`slf4j-nop`) is to specify which logging framework to use for this application. The Data Lake Store SDK uses [slf4j](http://www.slf4j.org/) logging façade, which lets you choose from a number of popular logging frameworks, like log4j, Java logging, logback, etc., or no logging. For this example, we will disable logging, hence we use the **slf4j-nop** binding. To use other logging options in your app, see [here](http://www.slf4j.org/manual.html#projectDep).

### Add the application code
There are three main parts to the code.

1. Obtain the Azure Active Directory token
2. Use the token to create a Data Lake Store client.
3. Use the Data Lake Store client to perform operations.

#### Step 1: Obtain an Azure Active Directory token.
The Data Lake Store SDK provides convenient methods that let you manage the security tokens needed to talk to the Data Lake Store account. However, the SDK does not mandate that only these methods be used. You can use any other means of obtaining token as well, like using the [Azure Active Directory SDK](https://github.com/AzureAD/azure-activedirectory-library-for-java), or your own custom code.

To use the Data Lake Store SDK to obtain token for the Active Directory Web application you created earlier, use one of the subclasses of `AccessTokenProvider` (the example below uses `ClientCredsTokenProvider`). The token provider caches the creds used to obtain the token in memory, and automatically renews the token if it is about to expire. It is possible to create your own subclasses of `AccessTokenProvider` so tokens are obtained by your customer code, but for now let's just use the one provided in the SDK.

Replace **FILL-IN-HERE** with the actual values for the Azure Active Directory Web application.

    private static String clientId = "FILL-IN-HERE";
    private static String authTokenEndpoint = "FILL-IN-HERE";
    private static String clientKey = "FILL-IN-HERE";

    AccessTokenProvider provider = new ClientCredsTokenProvider(authTokenEndpoint, clientId, clientKey);

#### Step 2: Create an Azure Data Lake Store client (ADLStoreClient) object
Creating an [ADLStoreClient](https://azure.github.io/azure-data-lake-store-java/javadoc/) object requires you to specify the Data Lake Store account name and the token provider you generated in the last step. Note that the Data Lake Store account name needs to be a fully qualified domain name. For example, replace **FILL-IN-HERE** with something like **mydatalakestore.azuredatalakestore.net**.

    private static String accountFQDN = "FILL-IN-HERE";  // full account FQDN, not just the account name
    ADLStoreClient client = ADLStoreClient.createClient(accountFQDN, provider);

### Step 3: Use the ADLStoreClient to perform file and directory operations
The code below contains example snippets of some common operations. You can look at the full [Data Lake Store Java SDK API docs](https://azure.github.io/azure-data-lake-store-java/javadoc/) of the **ADLStoreClient** object to see other operations.

Note that files are read from and written into using standard Java streams. This means that you can layer any of the Java streams on top of the Data Lake Store streams to benefit from standard Java functionality (e.g., Print streams for formatted output, or any of the compression or encryption streams for additional functionality on top, etc.).

     // create file and write some content
     String filename = "/a/b/c.txt";
     OutputStream stream = client.createFile(filename, IfExists.OVERWRITE  );
     PrintStream out = new PrintStream(stream);
     for (int i = 1; i <= 10; i++) {
         out.println("This is line #" + i);
         out.format("This is the same line (%d), but using formatted output. %n", i);
     }
     out.close();
    
    // set file permission
    client.setPermission(filename, "744");

    // append to file
    stream = client.getAppendStream(filename);
    stream.write(getSampleContent());
    stream.close();

    // Read File
    InputStream in = client.getReadStream(filename);
    byte[] b = new byte[64000];
    while (in.read(b) != -1) {
        System.out.write(b);
    }
    in.close();

    // concatenate the two files into one
    List<String> fileList = Arrays.asList("/a/b/c.txt", "/a/b/d.txt");
    client.concatenateFiles("/a/b/f.txt", fileList);

    //rename the file
    client.rename("/a/b/f.txt", "/a/b/g.txt");

    // list directory contents
    List<DirectoryEntry> list = client.enumerateDirectory("/a/b", 2000);
    System.out.println("Directory listing for directory /a/b:");
    for (DirectoryEntry entry : list) {
        printDirectoryInfo(entry);
    }

    // delete directory along with all the subdirectories and files in it
    client.deleteRecursive("/a");

#### Step 4: Build and run the application
1. To run from within an IDE, locate and press the **Run** button. To run from Maven, use [exec:exec](http://www.mojohaus.org/exec-maven-plugin/exec-mojo.html).
2. To produce a standalone jar that you can run from command-line build the jar with all dependencies included, using the [Maven assembly plugin](http://maven.apache.org/plugins/maven-assembly-plugin/usage.html). The pom.xml in the [example source code on github](https://github.com/Azure-Samples/data-lake-store-java-upload-download-get-started/blob/master/pom.xml) has an example of how to do this.

## Next steps
* [Explore JavaDoc for the Java SDK](https://azure.github.io/azure-data-lake-store-java/javadoc/)
* [Secure data in Data Lake Store](data-lake-store-secure-data.md)
* [Use Azure Data Lake Analytics with Data Lake Store](../data-lake-analytics/data-lake-analytics-get-started-portal.md)
* [Use Azure HDInsight with Data Lake Store](data-lake-store-hdinsight-hadoop-use-portal.md)

