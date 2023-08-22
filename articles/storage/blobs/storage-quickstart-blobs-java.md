---
title: "Quickstart: Azure Blob Storage library - Java"
description: In this quickstart, you learn how to use the Azure Blob Storage client library for Java to create a container and a blob in Blob (object) storage. Next, you learn how to download the blob to your local computer, and how to list all of the blobs in a container.
author: pauljewellmsft
ms.author: pauljewell
ms.custom: devx-track-java, mode-api, passwordless-java, devx-track-extended-java
ms.date: 10/24/2022
ms.service: azure-blob-storage
ms.topic: quickstart
ms.devlang: java
---

# Quickstart: Azure Blob Storage client library for Java

Get started with the Azure Blob Storage client library for Java to manage blobs and containers. Follow these steps to install the package and try out example code for basic tasks.

> [!TIP]
> If you're working with Azure Storage resources in a Spring application, we recommend that you consider [Spring Cloud Azure](/azure/developer/java/spring-framework/) as an alternative. Spring Cloud Azure is an open-source project that provides seamless Spring integration with Azure services. To learn more about Spring Cloud Azure, and to see an example using Blob Storage, see [Upload a file to an Azure Storage Blob](/azure/developer/java/spring-framework/configure-spring-boot-starter-java-app-with-azure-storage).

[API reference documentation](/java/api/overview/azure/storage-blob-readme) | [Library source code](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/storage/azure-storage-blob) | [Package (Maven)](https://mvnrepository.com/artifact/com.azure/azure-storage-blob) | [Samples](../common/storage-samples-java.md?toc=/azure/storage/blobs/toc.json#blob-samples)

## Prerequisites

- Azure account with an active subscription - [create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- Azure Storage account - [create a storage account](../common/storage-account-create.md).
- [Java Development Kit (JDK)](/java/azure/jdk/) version 8 or above.
- [Apache Maven](https://maven.apache.org/download.cgi).

## Setting up

This section walks you through preparing a project to work with the Azure Blob Storage client library for Java.

### Create the project

Create a Java application named *blob-quickstart*.

1. In a console window (such as PowerShell or Bash), use Maven to create a new console app with the name *blob-quickstart*. Type the following **mvn** command to create a "Hello world!" Java project.

    # [PowerShell](#tab/powershell)

    ```powershell
    mvn archetype:generate `
        --define interactiveMode=n `
        --define groupId=com.blobs.quickstart `
        --define artifactId=blob-quickstart `
        --define archetypeArtifactId=maven-archetype-quickstart `
        --define archetypeVersion=1.4
    ```

    # [Bash](#tab/bash)

    ```bash
    mvn archetype:generate \
        --define interactiveMode=n \
        --define groupId=com.blobs.quickstart \
        --define artifactId=blob-quickstart \
        --define archetypeArtifactId=maven-archetype-quickstart \
        --define archetypeVersion=1.4
    ```

    ---

1. The output from generating the project should look something like this:

    ```console
    [INFO] Scanning for projects...
    [INFO]
    [INFO] ------------------< org.apache.maven:standalone-pom >-------------------
    [INFO] Building Maven Stub Project (No POM) 1
    [INFO] --------------------------------[ pom ]---------------------------------
    [INFO]
    [INFO] >>> maven-archetype-plugin:3.1.2:generate (default-cli) > generate-sources @ standalone-pom >>>
    [INFO]
    [INFO] <<< maven-archetype-plugin:3.1.2:generate (default-cli) < generate-sources @ standalone-pom <<<
    [INFO]
    [INFO]
    [INFO] --- maven-archetype-plugin:3.1.2:generate (default-cli) @ standalone-pom ---
    [INFO] Generating project in Batch mode
    [INFO] ----------------------------------------------------------------------------
    [INFO] Using following parameters for creating project from Archetype: maven-archetype-quickstart:1.4
    [INFO] ----------------------------------------------------------------------------
    [INFO] Parameter: groupId, Value: com.blobs.quickstart
    [INFO] Parameter: artifactId, Value: blob-quickstart
    [INFO] Parameter: version, Value: 1.0-SNAPSHOT
    [INFO] Parameter: package, Value: com.blobs.quickstart
    [INFO] Parameter: packageInPathFormat, Value: com/blobs/quickstart
    [INFO] Parameter: version, Value: 1.0-SNAPSHOT
    [INFO] Parameter: package, Value: com.blobs.quickstart
    [INFO] Parameter: groupId, Value: com.blobs.quickstart
    [INFO] Parameter: artifactId, Value: blob-quickstart
    [INFO] Project created from Archetype in dir: C:\QuickStarts\blob-quickstart
    [INFO] ------------------------------------------------------------------------
    [INFO] BUILD SUCCESS
    [INFO] ------------------------------------------------------------------------
    [INFO] Total time:  7.056 s
    [INFO] Finished at: 2019-10-23T11:09:21-07:00
    [INFO] ------------------------------------------------------------------------
        ```

1. Switch to the newly created *blob-quickstart* folder.

   ```console
   cd blob-quickstart
   ```

1. In side the *blob-quickstart* directory, create another directory called *data*. This folder is where the blob data files will be created and stored.

    ```console
    mkdir data
    ```

### Install the packages

Open the `pom.xml` file in your text editor. 

Add **azure-sdk-bom** to take a dependency on the latest version of the library. In the following snippet, replace the `{bom_version_to_target}` placeholder with the version number. Using **azure-sdk-bom** keeps you from having to specify the version of each individual dependency. To learn more about the BOM, see the [Azure SDK BOM README](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/boms/azure-sdk-bom/README.md).

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.azure</groupId>
            <artifactId>azure-sdk-bom</artifactId>
            <version>{bom_version_to_target}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

Then add the following dependency elements to the group of dependencies. The **azure-identity** dependency is needed for passwordless connections to Azure services.

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-storage-blob</artifactId>
</dependency>
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-identity</artifactId>
</dependency>
```

### Set up the app framework

From the project directory, follow steps to create the basic structure of the app:

1. Navigate to the */src/main/java/com/blobs/quickstart* directory
1. Open the `App.java` file in your editor
1. Delete the line `System.out.println("Hello world!");`
1. Add the necessary `import` directives

The code should resemble this framework:

```java
package com.blobs.quickstart;

/**
 * Azure Blob Storage quickstart
 */
import com.azure.identity.*;
import com.azure.storage.blob.*;
import com.azure.storage.blob.models.*;
import java.io.*;

public class App
{
    public static void main(String[] args) throws IOException
    {
        // Quickstart code goes here
    }
}
```

## Object model

Azure Blob Storage is optimized for storing massive amounts of unstructured data. Unstructured data doesn't adhere to a particular data model or definition, such as text or binary data. Blob storage offers three types of resources:

- The storage account
- A container in the storage account
- A blob in the container

The following diagram shows the relationship between these resources.

![Diagram of Blob storage architecture](./media/storage-blobs-introduction/blob1.png)

Use the following Java classes to interact with these resources:

- [BlobServiceClient](/java/api/com.azure.storage.blob.blobserviceclient): The `BlobServiceClient` class allows you to manipulate Azure Storage resources and blob containers. The storage account provides the top-level namespace for the Blob service.
- [BlobServiceClientBuilder](/java/api/com.azure.storage.blob.blobserviceclientbuilder): The `BlobServiceClientBuilder` class provides a fluent builder API to help aid the configuration and instantiation of `BlobServiceClient` objects.
- [BlobContainerClient](/java/api/com.azure.storage.blob.blobcontainerclient): The `BlobContainerClient` class allows you to manipulate Azure Storage containers and their blobs.
- [BlobClient](/java/api/com.azure.storage.blob.blobclient): The `BlobClient` class allows you to manipulate Azure Storage blobs.
- [BlobItem](/java/api/com.azure.storage.blob.models.blobitem): The `BlobItem` class represents individual blobs returned from a call to [listBlobs](/java/api/com.azure.storage.blob.blobcontainerclient.listblobs).

## Code examples

These example code snippets show you how to perform the following actions with the Azure Blob Storage client library for Java:

- [Authenticate to Azure and authorize access to blob data](#authenticate-to-azure-and-authorize-access-to-blob-data)
- [Create a container](#create-a-container)
- [Upload blobs to a container](#upload-blobs-to-a-container)
- [List the blobs in a container](#list-the-blobs-in-a-container)
- [Download blobs](#download-blobs)
- [Delete a container](#delete-a-container)
 
> [!IMPORTANT]
> Make sure you have the correct dependencies in pom.xml and the necessary directives for the code samples to work, as described in the [setting up](#setting-up) section.

### Authenticate to Azure and authorize access to blob data

[!INCLUDE [storage-quickstart-passwordless-auth-intro](../../../includes/storage-quickstart-passwordless-auth-intro.md)]

### [Passwordless (Recommended)](#tab/managed-identity)

`DefaultAzureCredential` is a class provided by the Azure Identity client library for Java. `DefaultAzureCredential` supports multiple authentication methods and determines which method should be used at runtime. This approach enables your app to use different authentication methods in different environments (local vs. production) without implementing environment-specific code.

The order and locations in which `DefaultAzureCredential` looks for credentials can be found in the [Azure Identity library overview](/java/api/overview/azure/identity-readme#defaultazurecredential).

For example, your app can authenticate using your Visual Studio Code sign-in credentials with when developing locally. Your app can then use a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md) once it has been deployed to Azure. No code changes are required for this transition.

#### Assign roles to your Azure AD user account

[!INCLUDE [assign-roles](../../../includes/assign-roles.md)]

#### Sign-in and connect your app code to Azure using DefaultAzureCredential

You can authorize access to data in your storage account using the following steps:

1. Make sure you're authenticated with the same Azure AD account you assigned the role to on your storage account. You can authenticate via the Azure CLI, Visual Studio Code, or Azure PowerShell.

    #### [Azure CLI](#tab/sign-in-azure-cli)

    Sign-in to Azure through the Azure CLI using the following command:

    ```azurecli
    az login
    ```

    #### [Visual Studio Code](#tab/sign-in-visual-studio-code)

    You'll need to [install the Azure CLI](/cli/azure/install-azure-cli) to work with `DefaultAzureCredential` through Visual Studio Code.

    On the main menu of Visual Studio Code, navigate to **Terminal > New Terminal**.

    Sign-in to Azure through the Azure CLI using the following command:

    ```azurecli
    az login
    ```

    #### [PowerShell](#tab/sign-in-powershell)

    Sign-in to Azure using PowerShell via the following command:

    ```azurepowershell
    Connect-AzAccount
    ```

2. To use `DefaultAzureCredential`, make sure that the **azure-identity** dependency is added in `pom.xml`:

    ```xml
    <dependency>
      <groupId>com.azure</groupId>
      <artifactId>azure-identity</artifactId>
    </dependency>
    ```

3. Add this code to the `Main` method. When the code runs on your local workstation, it will use the developer credentials of the prioritized tool you're logged into to authenticate to Azure, such as the Azure CLI or Visual Studio Code.

    :::code language="java" source="~/azure-storage-snippets/blobs/quickstarts/Java/blob-quickstart/src/main/java/com/blobs/quickstart/App.java" id="Snippet_CreateServiceClientDAC":::

4. Make sure to update the storage account name in the URI of your `BlobServiceClient`. The storage account name can be found on the overview page of the Azure portal.

    :::image type="content" source="./media/storage-quickstart-blobs-java/storage-account-name.png" alt-text="A screenshot showing how to find the storage account name.":::

    > [!NOTE]
    > When deployed to Azure, this same code can be used to authorize requests to Azure Storage from an application running in Azure. However, you'll need to enable managed identity on your app in Azure. Then configure your storage account to allow that managed identity to connect. For detailed instructions on configuring this connection between Azure services, see the [Auth from Azure-hosted apps](/azure/developer/java/sdk/identity-azure-hosted-auth) tutorial.

### [Connection String](#tab/connection-string)

A connection string includes the storage account access key and uses it to authorize requests. Always be careful to never expose the keys in an unsecure location.

> [!NOTE]
> To authorize data access with the storage account access key, you'll need permissions for the following Azure RBAC action: [Microsoft.Storage/storageAccounts/listkeys/action](../../role-based-access-control/resource-provider-operations.md#microsoftstorage). The least privileged built-in role with permissions for this action is [Reader and Data Access](../../role-based-access-control/built-in-roles.md#reader-and-data-access), but any role which includes this action will work.

[!INCLUDE [retrieve credentials](../../../includes/retrieve-credentials.md)]

#### Configure your storage connection string

After you copy the connection string, write it to a new environment variable on the local machine running the application. To set the environment variable, open a console window, and follow the instructions for your operating system. Replace `<yourconnectionstring>` with your actual connection string.

**Windows**:

```cmd
setx AZURE_STORAGE_CONNECTION_STRING "<yourconnectionstring>"
```

After you add the environment variable in Windows, you must start a new instance of the command window.

**Linux**:

```bash
export AZURE_STORAGE_CONNECTION_STRING="<yourconnectionstring>"
```

The code below retrieves the connection string for the storage account from the environment variable created earlier, and uses the connection string to construct a service client object.

Add this code to the end of the `Main` method:

```java
// Retrieve the connection string for use with the application. 
String connectStr = System.getenv("AZURE_STORAGE_CONNECTION_STRING");

// Create a BlobServiceClient object using a connection string
BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
    .connectionString(connectStr)
    .buildClient();

```

> [!IMPORTANT]
> The account access key should be used with caution. If your account access key is lost or accidentally placed in an insecure location, your service may become vulnerable. Anyone who has the access key is able to authorize requests against the storage account, and effectively has access to all the data. `DefaultAzureCredential` provides enhanced security features and benefits and is the recommended approach for managing authorization to Azure services.

---

### Create a container

Decide on a name for the new container. The code below appends a UUID value to the container name to ensure that it's unique.

> [!IMPORTANT]
> Container names must be lowercase. For more information about naming containers and blobs, see [Naming and Referencing Containers, Blobs, and Metadata](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).

Next, create an instance of the [BlobContainerClient](/java/api/com.azure.storage.blob.blobcontainerclient) class, then call the [create](/java/api/com.azure.storage.blob.blobcontainerclient.create) method to actually create the container in your storage account.

Add this code to the end of the `Main` method:

:::code language="java" source="~/azure-storage-snippets/blobs/quickstarts/Java/blob-quickstart/src/main/java/com/blobs/quickstart/App.java" id="Snippet_CreateContainer":::

To learn more about creating a container, and to explore more code samples, see [Create a blob container with Java](storage-blob-container-create-java.md).

### Upload blobs to a container

Add this code to the end of the `Main` method:

:::code language="java" source="~/azure-storage-snippets/blobs/quickstarts/Java/blob-quickstart/src/main/java/com/blobs/quickstart/App.java" id="Snippet_UploadBlobFromFile":::

The code snippet completes the following steps:

1. Creates a text file in the local *data* directory.
1. Gets a reference to a [BlobClient](/java/api/com.azure.storage.blob.blobclient) object by calling the [getBlobClient](/java/api/com.azure.storage.blob.blobcontainerclient.getblobclient) method on the container from the [Create a container](#create-a-container) section.
1. Uploads the local text file to the blob by calling the [uploadFromFile](/java/api/com.azure.storage.blob.blobclient.uploadfromfile) method. This method creates the blob if it doesn't already exist, but won't overwrite it if it does.

To learn more about uploading blobs, and to explore more code samples, see [Upload a blob with Java](storage-blob-upload-java.md).

### List the blobs in a container

List the blobs in the container by calling the [listBlobs](/java/api/com.azure.storage.blob.blobcontainerclient.listblobs) method. In this case, only one blob has been added to the container, so the listing operation returns just that one blob.

Add this code to the end of the `Main` method:

:::code language="java" source="~/azure-storage-snippets/blobs/quickstarts/Java/blob-quickstart/src/main/java/com/blobs/quickstart/App.java" id="Snippet_ListBlobs":::

To learn more about listing blobs, and to explore more code samples, see [List blobs with Java](storage-blobs-list-java.md).

### Download blobs

Download the previously created blob by calling the [downloadToFile](/java/api/com.azure.storage.blob.specialized.blobclientbase.downloadtofile) method. The example code adds a suffix of "DOWNLOAD" to the file name so that you can see both files in local file system.

Add this code to the end of the `Main` method:

:::code language="java" source="~/azure-storage-snippets/blobs/quickstarts/Java/blob-quickstart/src/main/java/com/blobs/quickstart/App.java" id="Snippet_DownloadBlob":::

To learn more about downloading blobs, and to explore more code samples, see [Download a blob with Java](storage-blob-download-java.md).

### Delete a container

The following code cleans up the resources the app created by removing the entire container using the [delete](/java/api/com.azure.storage.blob.blobcontainerclient.delete) method. It also deletes the local files created by the app.

The app pauses for user input by calling `System.console().readLine()` before it deletes the blob, container, and local files. This is a good chance to verify that the resources were created correctly, before they're deleted.

Add this code to the end of the `Main` method:

:::code language="java" source="~/azure-storage-snippets/blobs/quickstarts/Java/blob-quickstart/src/main/java/com/blobs/quickstart/App.java" id="Snippet_DeleteContainer":::

To learn more about deleting a container, and to explore more code samples, see [Delete and restore a blob container with Java](storage-blob-container-delete-java.md).

## Run the code

This app creates a test file in your local folder and uploads it to Blob storage. The example then lists the blobs in the container and downloads the file with a new name so that you can compare the old and new files.

Follow steps to compile, package, and run the code

1. Navigate to the directory containing the `pom.xml` file and compile the project by using the following `mvn` command:
    ```console
    mvn compile
    ```
1. Package the compiled code in its distributable format:
    ```console
    mvn package
    ```
1. Run the following `mvn` command to execute the app:
    ```console
    mvn exec:java -D exec.mainClass=com.blobs.quickstart.App -D exec.cleanupDaemonThreads=false
    ```
    To simplify the run step, you can add `exec-maven-plugin` to `pom.xml` and configure as shown below:
    ```xml
    <plugin>
      <groupId>org.codehaus.mojo</groupId>
      <artifactId>exec-maven-plugin</artifactId>
      <version>1.4.0</version>
      <configuration>
        <mainClass>com.blobs.quickstart.App</mainClass>
        <cleanupDaemonThreads>false</cleanupDaemonThreads>
      </configuration>
    </plugin>
    ```
    With this configuration, you can execute the app with the following command:
    ```console
    mvn exec:java
    ```
    

The output of the app is similar to the following example (UUID values omitted for readability):

```output
Azure Blob Storage - Java quickstart sample

Uploading to Blob storage as blob:
        https://mystorageacct.blob.core.windows.net/quickstartblobsUUID/quickstartUUID.txt

Listing blobs...
        quickstartUUID.txt

Downloading blob to
        ./data/quickstartUUIDDOWNLOAD.txt

Press the Enter key to begin clean up

Deleting blob container...
Deleting the local source and downloaded files...
Done
```

Before you begin the cleanup process, check your *data* folder for the two files. You can compare them and observe that they're identical.

## Clean up resources

After you've verified the files and finished testing, press the **Enter** key to delete the test files along with the container you created in the storage account. You can also use [Azure CLI](storage-quickstart-blobs-cli.md#clean-up-resources) to delete resources.

## Next steps

In this quickstart, you learned how to upload, download, and list blobs using Java.

To see Blob storage sample apps, continue to:

> [!div class="nextstepaction"]
> [Azure Blob Storage library for Java samples](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/storage/azure-storage-blob/src/samples/java/com/azure/storage/blob)

- To learn more, see the [Azure Blob Storage client libraries for Java](/java/api/overview/azure/storage-blob-readme).
- For tutorials, samples, quickstarts, and other documentation, visit [Azure for Java developers](/azure/developer/java/sdk/overview).
