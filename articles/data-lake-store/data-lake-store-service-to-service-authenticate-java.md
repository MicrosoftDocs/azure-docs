---
title: Service-to-service authentication - Data Lake Storage Gen2 – Java SDK
description: Learn how to achieve service-to-service authentication with Azure Data Lake Storage Gen2 using Azure Active Directory with Java

author: normesta
ms.service: data-lake-store
ms.topic: how-to
ms.date: 05/29/2018
ms.custom: devx-track-java, devx-track-extended-java
ms.author: normesta
---
# Service-to-service authentication with Azure Data Lake Storage Gen2 using Java

> [!div class="op_single_selector"]
> * [Using Java](data-lake-store-service-to-service-authenticate-java.md)
> * [Using .NET SDK](data-lake-store-service-to-service-authenticate-net-sdk.md)
> * [Using Python](data-lake-store-service-to-service-authenticate-python.md)
> * [Using REST API](data-lake-store-service-to-service-authenticate-rest-api.md)
>
>  

In this article, you learn about how to use the Java SDK to do service-to-service authentication with Azure Data Lake Storage Gen2. End-user authentication with Data Lake Storage Gen2 using the Java SDK isn't supported.

## Prerequisites

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

* **Create an Azure Active Directory "Web" Application**. You must have completed the steps in [Service-to-service authentication with Data Lake Storage Gen2 using Azure Active Directory](data-lake-store-service-to-service-authenticate-using-active-directory.md).

* [Maven](https://maven.apache.org/install.html). This tutorial uses Maven for build and project dependencies. Although it is possible to build without using a build system like Maven or Gradle, these systems make it much easier to manage dependencies.

* (Optional) An IDE like [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) or [Eclipse](https://www.eclipse.org/downloads/) or similar.

## Service-to-service authentication

1. Create a Maven project using [mvn archetype](https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html) from the command line or using an IDE. For instructions on how to create a Java project using IntelliJ, see [here](https://www.jetbrains.com/help/idea/2016.1/creating-and-running-your-first-java-application.html). For instructions on how to create a project using Eclipse, see [here](https://help.eclipse.org/mars/index.jsp?topic=%2Forg.eclipse.jdt.doc.user%2FgettingStarted%2Fqs-3.htm).

2. Add the following dependencies to your Maven **pom.xml** file. Add the following snippet before the **\</project>** tag:

    ```xml
    <dependencies>
      <dependency>
          <groupId>com.azure</groupId>
          <artifactId>azure-storage-file-datalake</artifactId>
          <version>12.6.0</version>
      </dependency>
      <dependency>
          <groupId>com.azure</groupId>
          <artifactId>azure-identity</artifactId>
          <version>1.3.3</version>
      </dependency>
      <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-nop</artifactId>
        <version>1.7.21</version>
      </dependency>
    </dependencies>
    ```

    The first dependency is to use the Data Lake Storage Gen2 SDK (`azure-storage-file-datalake`) from the Maven repository. The second dependency is to specify the logging framework (`slf4j-nop`) to use for this app. The Data Lake Storage Gen2 SDK uses the [slf4j](https://www.slf4j.org/) logging façade, which lets you choose from a number of popular logging frameworks, like log4j, Java logging, logback, or no logging. For this example, we disable logging, hence we use the **slf4j-nop** binding. To use other logging options in your app, see [Declaring project dependencies for logging](https://www.slf4j.org/manual.html#projectDep).

3. Add the following import statements to your application.

    ```java
    import com.azure.identity.ClientSecretCredential;
    import com.azure.identity.ClientSecretCredentialBuilder;
    import com.azure.storage.file.datalake.DataLakeDirectoryClient;
    import com.azure.storage.file.datalake.DataLakeFileClient;
    import com.azure.storage.file.datalake.DataLakeServiceClient;
    import com.azure.storage.file.datalake.DataLakeServiceClientBuilder;
    import com.azure.storage.file.datalake.DataLakeFileSystemClient;
    import com.azure.storage.file.datalake.models.ListPathsOptions;
    import com.azure.storage.file.datalake.models.PathAccessControl;
    import com.azure.storage.file.datalake.models.PathPermissions;
    ```

4. Use the following snippet in your Java app to obtain a token for the Active Directory web app you created earlier using one of the class of `StorageSharedKeyCredential` (the following example uses `credential`). The token provider caches the credentials used to obtain the token in memory, and automatically renews the token if it's about to expire. It's possible to create your own subclasses of `StorageSharedKeyCredential` so tokens are obtained by your customer code. For now, let's just use the one provided in the SDK.

    Replace **FILL-IN-HERE** with the actual values for the Azure Active Directory Web application.

    ```java
    private static String clientId = "FILL-IN-HERE";
    private static String tenantId = "FILL-IN-HERE";
    private static String clientSecret = "FILL-IN-HERE";
   
    ClientSecretCredential credential = new ClientSecretCredentialBuilder().clientId(clientId).tenantId(tenantId).clientSecret(clientSecret).build();
    ```

The Data Lake Storage Gen2 SDK provides convenient methods that let you manage the security tokens needed to talk to the Data Lake Storage Gen2 account. However, the SDK doesn't mandate that only these methods be used. You can use any other means of obtaining token as well, like using the [Azure Identity client library](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/identity/azure-identity) or your own custom code.

## Next steps

In this article, you learned how to use end-user authentication to authenticate with Data Lake Storage Gen2 using Java SDK. You can now look at the following articles that talk about how to use the Java SDK to work with Data Lake Storage Gen2.

* [Data operations on Data Lake Storage Gen2 using Java SDK](data-lake-store-get-started-java-sdk.md)
