<properties
   pageTitle="Use Data Lake Store Java SDK to develop applications | Azure"
   description="Use Azure Data Lake Store Java SDK to develop applications"
   services="data-lake-store"
   documentationCenter=""
   authors="nitinme"
   manager="jhubbard"
   editor="cgronlun"/>

<tags
   ms.service="data-lake-store"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="08/18/2016"
   ms.author="nitinme"/>

# Get started with Azure Data Lake Store using Java

> [AZURE.SELECTOR]
- [Portal](data-lake-store-get-started-portal.md)
- [PowerShell](data-lake-store-get-started-powershell.md)
- [.NET SDK](data-lake-store-get-started-net-sdk.md)
- [Java SDK](data-lake-store-get-started-java-sdk.md)
- [REST API](data-lake-store-get-started-rest-api.md)
- [Azure CLI](data-lake-store-get-started-cli.md)
- [Node.js](data-lake-store-manage-use-nodejs.md)

Learn how to use the Azure Data Lake Store Java SDK to create an Azure Data Lake account and perform basic operations such as create folders, upload and download data files, delete your account, etc. For more information about Data Lake, see [Azure Data Lake Store](data-lake-store-overview.md).

## Azure Data Lake Store Java SDK

Following links provide you the download location for the Java SDK for Data Lake Store and the Java SDK reference. For this tutorial, you do not need to download the SDK or follow the reference document. These links are for your information only.

* The source code for the Java SDK for Data Lake Store is available on [GitHub](https://github.com/Azure/azure-sdk-for-java).
* Java SDK Reference for Data Lake Store is available at [https://azure.github.io/azure-sdk-for-java/](https://azure.github.io/azure-sdk-for-java/).

## Prerequisites

* Java Development Kit (JDK) 8 (using Java version 1.8).
* IntelliJ or another suitable Java development environment. This is optional but recommended. The instructions below use IntelliJ.
* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
* **Enable your Azure subscription** for Data Lake Store public preview. See [instructions](data-lake-store-get-started-portal.md#signup).
* **Create an Azure Active Directory Application**. There are two ways you can authenticate using Azure Active Directory - **interactive** and **non-interactive**. There are different prerequisites based on how you want to authenticate.
	* **For interactive authentication** - In Azure Active Directory, you must create a **Native Client application**. Once you have created the application, retrieve the following values related to the application.
		- Get **client ID** and **redirect URI** for the application
		- Set delegated permissions

	* **For non-interactive authentication** (used in this article) - In Azure Active Directory, you must create a **Web application**. Once you have created the application, retrieve the following values related to the application.
		- Get **client ID**, **client secret**, and **redirect URI** for the application
		- Set delegated permissions
		- Assign the Azure Active Directory application to a role. The role can be at the level of the scope at which you want to give permission to the Azure Active Directory application. For example, you can assign the application at the subscription level or at the level of a resource group.

	See [Create Active Directory application and service principal using portal](../resource-group-create-service-principal-portal.md) for instructions on how to retrieve these values, set the permissions, and assign roles.

## How do I authenticate using Azure Active Directory?

The code snippet below provides code for **non-interactive** authentication, where the application provides its own credentials.

You need to give your application permission to create resources in Azure for this tutorial to work. It is **highly recommended** that you only give this application Contributor permissions to a new, unused, and empty resource group in your Azure subscription for the purposes of this tutorial.

## Create a Java application

1. Open IntelliJ and create a new Java project using the **Command Line App** template. Complete the wizard to create the project.

2. Open **File** -> **Project Structure** -> **Modules** (under Project Settings) -> **Dependencies** -> **+** -> **Library** -> **From Maven**.

3. Search for the following Maven packages and add them your project:

    * com.microsoft.azure:azure-mgmt-datalake-store:1.0.0-beta1.2
    * com.microsoft.azure:azure-mgmt-datalake-store-uploader:1.0.0-beta1.2
    * com.microsoft.azure:azure-client-authentication:1.0.0-beta2

4. From the left pane, navigate to **src**, **main**, **java**, **\<package name>**, and then open **Main.java** and replace the existing code block with the following code. Also, provide the values for parameters called out in the code snippet, such as **localFolderPath**, **DATA-LAKE-STORE-NAME**, **RESOURCE-GROUP-NAME** and replace placeholders for **CLIENT-ID**, **CLIENT-SECRET**, **TENANT-ID**, and **SUBSCRIPTION-ID** with information about your subscription and its Azure Active Directory. For information on how to find this information, see [the Azure guide to creating service principals](../resource-group-authenticate-service-principal.md).

    This code goes through the process of creating a Data Lake Store account, creating files in the store, concatenating files, downloading a file, and finally deleting the account.

        package com.company;

        import com.microsoft.azure.CloudException;
        import com.microsoft.azure.credentials.ApplicationTokenCredentials;
        import com.microsoft.azure.management.datalake.store.implementation.DataLakeStoreAccountManagementClientImpl;
        import com.microsoft.azure.management.datalake.store.implementation.DataLakeStoreFileSystemManagementClientImpl;
        import com.microsoft.azure.management.datalake.store.models.*;
        import com.microsoft.azure.management.datalake.store.uploader.*;
        import com.microsoft.rest.credentials.ServiceClientCredentials;
        import java.io.*;
        import java.nio.charset.Charset;
        import java.util.ArrayList;
        import java.util.List;

        public class Main {
            final static String ADLS_ACCOUNT_NAME = <DATA-LAKE-STORE-NAME>;
            final static String RESOURCE_GROUP_NAME = "<RESOURCE-GROUP-NAME>";
            final static String LOCATION = "East US 2";
            final static String TENANT_ID = "<TENANT-ID>";
            final static String SUBSCRIPTION_ID =  "<SUBSCRIPTION-ID>";
            final static String CLIENT_ID = "<CLIENT-ID>";
            final static String CLIENT_SECRET = "<CLIENT-SECRET>"; // TODO: For production scenarios, we recommend that you replace this line with a more secure way of acquiring the application client secret, rather than hard-coding it in the source code.

            private static DataLakeStoreAccountManagementClientImpl _adlsClient;
            private static DataLakeStoreFileSystemManagementClientImpl _adlsFileSystemClient;

            public static void main(String[] args) throws Exception {
                String localFolderPath = "C:\\local_path\\"; // TODO: Change this to any unused, new, empty folder on your local machine.

                // Authenticate
                ApplicationTokenCredentials creds = new ApplicationTokenCredentials(CLIENT_ID, TENANT_ID, CLIENT_SECRET, null);
                SetupClients(creds);

                // Create Data Lake Store account
                WaitForNewline("Authenticated.", "Creating NEW account.");
                CreateAccount();
                WaitForNewline("Account created.", "Displaying account(s).");

                // List Data Lake Store accounts that this app can access
                System.out.println(String.format("All ADL Store accounts that this app can access in subscription %s:", SUBSCRIPTION_ID));
                List<DataLakeStoreAccount> adlsListResult = _adlsClient.accounts().list().getBody();
                for (DataLakeStoreAccount acct : adlsListResult) {
                    System.out.println(acct.name());
                }
                WaitForNewline("Account(s) displayed.", "Uploading file.");

                // Upload a file to Data Lake Store: file1.csv
                UploadFile(localFolderPath + "file1.csv", "/file1.csv");
                WaitForNewline("File uploaded.", "Appending newline.");

                // Append newline to file1.csv
                AppendToFile("/file1.csv", "\r\n");
                WaitForNewline("Newline appended.", "Creating file.");

                // Create a new file in Data Lake Store: file2.csv
                CreateFile("/file2.csv", "456,def", true);
                WaitForNewline("File created.", "Concatenating files.");

                // Concatenate two files in Data Lake Store
                List<String> srcFilePaths = new ArrayList<String>();
                srcFilePaths.add("/file1.csv");
                srcFilePaths.add("/file2.csv");
                ConcatenateFiles(srcFilePaths, "/input.csv");
                WaitForNewline("Files concatenated.", "Downloading file.");

                // Download file from Data Lake Store
                DownloadFile("/input.csv", localFolderPath + "input.csv");
                WaitForNewline("File downloaded.", "Deleting file.");

                // Delete file from Data Lake Store
                DeleteFile("/input.csv");
                WaitForNewline("File deleted.", "Deleting account.");

                // Delete account
                DeleteAccount();
                WaitForNewline("Account deleted.", "DONE.");
            }

            //Set up clients
            public static void SetupClients(ServiceClientCredentials creds)
            {
                _adlsClient = new DataLakeStoreAccountManagementClientImpl(creds);
                _adlsFileSystemClient = new DataLakeStoreFileSystemManagementClientImpl(creds);
                _adlsClient.withSubscriptionId(SUBSCRIPTION_ID);
            }

            // Helper function to show status and wait for user input
            public static void WaitForNewline(String reason, String nextAction)
            {
                if (nextAction == null)
                    nextAction = "";
                if (!nextAction.isEmpty())
                {
                    System.out.println(reason + "\r\nPress ENTER to continue...");
                    try{System.in.read();}
                    catch(Exception e){}
                    System.out.println(nextAction);
                }
                else
                {
                    System.out.println(reason + "\r\nPress ENTER to continue...");
                    try{System.in.read();}
                    catch(Exception e){}
                }
            }

            // Create Data Lake Store account
            public static void CreateAccount() throws InterruptedException, CloudException, IOException {
                DataLakeStoreAccount adlsParameters = new DataLakeStoreAccount();
                adlsParameters.withLocation(LOCATION);

                _adlsClient.accounts().create(RESOURCE_GROUP_NAME, ADLS_ACCOUNT_NAME, adlsParameters);
            }

            // Create file
            public static void CreateFile(String path) throws IOException, AdlsErrorException {
                _adlsFileSystemClient.fileSystems().create(ADLS_ACCOUNT_NAME, path);
            }

            // Create file with contents
            public static void CreateFile(String path, String contents, boolean force) throws IOException, AdlsErrorException {
                byte[] bytesContents = contents.getBytes();

                _adlsFileSystemClient.fileSystems().create(ADLS_ACCOUNT_NAME, path, bytesContents, force);
            }

            // Append to file
            public static void AppendToFile(String path, String contents) throws IOException, AdlsErrorException {
                byte[] bytesContents = contents.getBytes();

                _adlsFileSystemClient.fileSystems().append(ADLS_ACCOUNT_NAME, path, bytesContents);
            }

            // Concatenate files
            public static void ConcatenateFiles(List<String> srcFilePaths, String destFilePath) throws IOException, AdlsErrorException {
                _adlsFileSystemClient.fileSystems().concat(ADLS_ACCOUNT_NAME, destFilePath, srcFilePaths);
            }

            // Delete concatenated file
            public static void DeleteFile(String filePath) throws IOException, AdlsErrorException {
                _adlsFileSystemClient.fileSystems().delete(ADLS_ACCOUNT_NAME, filePath);
            }

            // Get file or directory info
            public static FileStatusProperties GetItemInfo(String path) throws IOException, AdlsErrorException {
                return _adlsFileSystemClient.fileSystems().getFileStatus(ADLS_ACCOUNT_NAME, path).getBody().fileStatus();
            }

            // List files and directories
            public static List<FileStatusProperties> ListItems(String directoryPath) throws IOException, AdlsErrorException {
                return _adlsFileSystemClient.fileSystems().listFileStatus(ADLS_ACCOUNT_NAME, directoryPath).getBody().fileStatuses().fileStatus();
            }

            // Upload file
            public static void UploadFile(String srcPath, String destPath) throws Exception {
                UploadParameters parameters = new UploadParameters(srcPath, destPath, ADLS_ACCOUNT_NAME);
                FrontEndAdapter frontend = new DataLakeStoreFrontEndAdapterImpl(ADLS_ACCOUNT_NAME, _adlsFileSystemClient);
                DataLakeStoreUploader uploader = new DataLakeStoreUploader(parameters, frontend);
                uploader.execute();
            }

            // Download file
            public static void DownloadFile(String srcPath, String destPath) throws IOException, AdlsErrorException {
                InputStream stream = _adlsFileSystemClient.fileSystems().open(ADLS_ACCOUNT_NAME, srcPath).getBody();

                PrintWriter pWriter = new PrintWriter(destPath, Charset.defaultCharset().name());

                String fileContents = "";
                if (stream != null) {
                    Writer writer = new StringWriter();

                    char[] buffer = new char[1024];
                    try {
                        Reader reader = new BufferedReader(
                                new InputStreamReader(stream, "UTF-8"));
                        int n;
                        while ((n = reader.read(buffer)) != -1) {
                            writer.write(buffer, 0, n);
                        }
                    } finally {
                        stream.close();
                    }
                    fileContents =  writer.toString();
                }

                pWriter.println(fileContents);
                pWriter.close();
            }

            // Delete account
            public static void DeleteAccount() throws InterruptedException, CloudException, IOException {
                _adlsClient.accounts().delete(RESOURCE_GROUP_NAME, ADLS_ACCOUNT_NAME);
            }
        }


6. Run the application. Follow the prompts to run and complete the application.

## Next steps

- [Secure data in Data Lake Store](data-lake-store-secure-data.md)
- [Use Azure Data Lake Analytics with Data Lake Store](../data-lake-analytics/data-lake-analytics-get-started-portal.md)
- [Use Azure HDInsight with Data Lake Store](data-lake-store-hdinsight-hadoop-use-portal.md)
