---
title: Manage Azure Data Lake Analytics using Azure Java SDK
description: This article describes how to use the Azure Java SDK to write apps that manage Data Lake Analytics jobs, data sources, & users.
ms.service: data-lake-analytics
ms.reviewer: whhender
ms.topic: how-to
ms.date: 01/27/2023
ms.custom: devx-track-java, devx-track-extended-java
---

# Manage Azure Data Lake Analytics using a Java app

[!INCLUDE [manage-selector](../../includes/data-lake-analytics-selector-manage.md)]

[!INCLUDE [retirement-flag](includes/retirement-flag.md)]

This article describes how to manage Azure Data Lake Analytics accounts, data sources, users, and jobs using an app written using the Azure Java SDK. 

## Prerequisites

* **Java Development Kit (JDK) 8** (using Java version 1.8).
* **IntelliJ** or another suitable Java development environment. The instructions in this document use IntelliJ.
* Create a Microsoft Entra application and retrieve its **Client ID**, **Tenant ID**, and **Key**. For more information about Microsoft Entra applications and instructions on how to get a client ID, see [Create Active Directory application and service principal using portal](../active-directory/develop/howto-create-service-principal-portal.md). The Reply URI and Key is available from the portal once you have the application created and key generated.

<a name='authenticating-using-azure-active-directory'></a>

## Authenticating using Microsoft Entra ID

The code following snippet provides code for **non-interactive** authentication, where the application provides its own credentials.

## Create a Java application

1. Open IntelliJ and create a Java project using the **Command-Line App** template.
2. Right-click on the project on the left-hand side of your screen and click **Add Framework Support**. Choose **Maven** and select **OK**.
3. Open the newly created **"pom.xml"** file and add the following snippet of text between the **\</version>** tag and the **\</project>** tag:

```xml
<dependencies>
    <dependency>
      <groupId>com.azure.resourcemanager</groupId>
      <artifactId>azure-resourcemanager-datalakeanalytics</artifactId>
      <version>1.0.0-beta.1</version>
    </dependency>
    <dependency>
      <groupId>com.azure.resourcemanager</groupId>
      <artifactId>azure-resourcemanager-datalakestore</artifactId>
      <version>1.0.0-beta.1</version>
    </dependency>
    <dependency>
      <groupId>com.azure</groupId>
      <artifactId>azure-storage-file-datalake</artifactId>
      <version>12.7.2</version>
    </dependency>
    <dependency>
      <groupId>com.azure</groupId>
      <artifactId>azure-identity</artifactId>
      <version>1.4.1</version>
    </dependency>
</dependencies>
```

Go to **File > Settings > Build > Execution > Deployment**. Select **Build Tools > Maven > Importing**. Then check **Import Maven projects automatically**.

Open `Main.java` and replace the existing code block with the following code:

```java
import com.azure.core.credential.TokenCredential;
import com.azure.core.management.AzureEnvironment;
import com.azure.core.management.profile.AzureProfile;
import com.azure.identity.ClientSecretCredential;
import com.azure.identity.ClientSecretCredentialBuilder;
import com.azure.resourcemanager.datalakeanalytics.DataLakeAnalyticsManager;
import com.azure.resourcemanager.datalakeanalytics.models.DataLakeAnalyticsAccount;
import com.azure.resourcemanager.datalakestore.DataLakeStoreManager;
import com.azure.resourcemanager.datalakestore.models.DataLakeStoreAccount;
import com.azure.storage.file.datalake.DataLakeFileClient;
import com.azure.storage.file.datalake.DataLakeFileSystemClient;
import com.azure.storage.file.datalake.DataLakeServiceClient;
import com.azure.storage.file.datalake.DataLakeServiceClientBuilder;
import com.azure.storage.file.datalake.models.PathAccessControl;
import com.azure.storage.file.datalake.models.PathPermissions;

import java.io.ByteArrayInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Collections;
import java.util.UUID;

public class Main {
    private static String adlsAccountName;
    private static String adlaAccountName;
    private static String resourceGroupName;
    private static String location;

    private static String tenantId;
    private static String subscriptionId;
    private static String clientId;
    private static String clientSecret;
    private static String fileSystemName;
    private static String localFolderPath;

    private static DataLakeAnalyticsManager analyticsManager;
    private static DataLakeStoreManager storeManager;
    private static DataLakeStoreAccount storeAccount;
    private static DataLakeAnalyticsAccount analyticsAccount;
    private static DataLakeServiceClient serviceClient;
    private static DataLakeFileSystemClient fileSystemClient;
    private static DataLakeFileClient fileClient;

    public static void main(String[] args) throws Exception {
        adlsAccountName = "<DATA-LAKE-STORE-NAME>";
        adlaAccountName = "<DATA-LAKE-ANALYTICS-NAME>";
        resourceGroupName = "<RESOURCE-GROUP-NAME>";
        location = "East US 2";

        tenantId = "<TENANT-ID>";
        subscriptionId = "<SUBSCRIPTION-ID>";
        clientId = "<CLIENT-ID>";
        clientSecret = "<CLIENT-SECRET>";
        fileSystemName = "<DATALAKE-FILE-SYSTEM-NAME>";

        localFolderPath = "C:\\local_path\\";

        // ----------------------------------------
        // Authenticate
        // ----------------------------------------
        AzureProfile profile = new AzureProfile(AzureEnvironment.AZURE);
        ClientSecretCredential creds = new ClientSecretCredentialBuilder()
                .clientId(clientId).tenantId(tenantId).clientSecret(clientSecret)
                .authorityHost("https://login.microsoftonline.com/" + tenantId + "/oauth2/token")
                .build();
        setupClients(creds, profile);

        // ----------------------------------------
        // List Data Lake Store and Analytics accounts that this app can access
        // ----------------------------------------
        System.out.println(String.format("All ADL Store accounts that this app can access in subscription %s:", subscriptionId));
        storeManager.accounts().list().forEach(acct -> System.out.println(acct.name()));

        System.out.println(String.format("All ADL Analytics accounts that this app can access in subscription %s:", subscriptionId));
        analyticsManager.accounts().list().forEach(acct -> System.out.println(acct.name()));
        waitForNewline("Accounts displayed.", "Creating files.");

        // ----------------------------------------
        // Create a file in Data Lake Store: input1.csv
        // ----------------------------------------
        createFile("input1.csv", "123,abc", true);
        waitForNewline("File created.", "Submitting a job.");

        // ----------------------------------------
        // Submit a job to Data Lake Analytics
        // ----------------------------------------
        String script = "@input = EXTRACT Row1 string, Row2 string FROM \"/input1.csv\" USING Extractors.Csv(); OUTPUT @input TO @\"/output1.csv\" USING Outputters.Csv();";
        UUID jobId = submitJobByScript(script, "testJob", creds);
        waitForNewline("Job submitted.", "Getting job status.");

        // ----------------------------------------
        // Download job output from Data Lake Store
        // ----------------------------------------
        downloadFile("output1.csv", localFolderPath + "output1.csv");
        waitForNewline("Job output downloaded.", "Deleting file.");

        deleteFile("output1.csv");
        waitForNewline("File deleted.", "Done.");
    }

    public static void setupClients(TokenCredential creds, AzureProfile profile) {

        analyticsManager = DataLakeAnalyticsManager.authenticate(creds, profile);

        storeManager = DataLakeStoreManager.authenticate(creds, profile);

        createAccounts();

        serviceClient = new DataLakeServiceClientBuilder().endpoint(storeAccount.endpoint()).credential(creds).buildClient();

        fileSystemClient = serviceClient.createFileSystem(fileSystemName);

    }

    public static void waitForNewline(String reason, String nextAction) {
        if (nextAction == null)
            nextAction = "";

        System.out.println(reason + "\r\nPress ENTER to continue...");
        try {
            System.in.read();
        } catch (Exception e) {
        }

        if (!nextAction.isEmpty()) {
            System.out.println(nextAction);
        }
    }

    // Create accounts
    public static void createAccounts() {
        // Create ADLS account
        storeAccount = storeManager.accounts().define(adlsAccountName)
                .withRegion(location)
                .withExistingResourceGroup(resourceGroupName)
                .create();

        analyticsAccount = analyticsManager.accounts().define(adlaAccountName)
                .withRegion(location).withExistingResourceGroup(resourceGroupName)
                .withDefaultDataLakeStoreAccount(adlsAccountName)
                .withDataLakeStoreAccounts(Collections.EMPTY_LIST)
                .create();
    }

    // Create a file
    public static void createFile(String path, String contents, boolean force) {
        byte[] bytesContents = contents.getBytes();

        DataLakeFileClient fileClient = fileSystemClient.createFile(path,force);
        PathAccessControl accessControl = fileClient.getAccessControl();
        fileClient.setPermissions(PathPermissions.parseOctal("744"), accessControl.getGroup(), accessControl.getOwner());
        fileClient.upload(new ByteArrayInputStream(bytesContents), bytesContents.length);
    }

    // Delete a file
    public static void deleteFile(String filePath) {
        fileSystemClient.getFileClient(filePath).delete();
    }

    // Download a file
    private static void downloadFile(String srcPath, String destPath) throws IOException {

        fileClient = fileSystemClient.getFileClient(srcPath);
        OutputStream outputStream = new FileOutputStream(destPath);
        fileClient.read(outputStream);
        outputStream.close();
    }

}
```

Provide the values for parameters called out in the code snippet:
* `adlsAccountName`
* `adlaAccountName`
* `resourceGroupName`
* `location`
* `tenantId`
* `subscriptionId`
* `clientId`
* `clientSecret`
* `fileSystemName`
* `localFolderPath`

## Next steps

* To learn U-SQL, see [Get started with Azure Data Lake Analytics U-SQL language](data-lake-analytics-u-sql-get-started.md), and [U-SQL language reference](/u-sql/).
* For management tasks, see [Manage Azure Data Lake Analytics using Azure portal](data-lake-analytics-manage-use-portal.md).
* To get an overview of Data Lake Analytics, see [Azure Data Lake Analytics overview](data-lake-analytics-overview.md).
