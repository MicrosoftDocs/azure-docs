---
title: Using Azure Storage with a Jenkins continuous integration solution
description: This tutorial show how to use the Azure blob service as a repository for build artifacts created by a Jenkins continuous integration solution.
ms.topic: article
ms.author: tarcher

author: tarcher
services: devops
ms.service: storage
custom: jenkins
ms.date: 07/31/2018
ms.subservice: common
---

# Using Azure Storage with a Jenkins continuous integration solution

This article illustrates how to use Blob storage as a repository of build artifacts created by a Jenkins continuous integration (CI) solution, or as a source of downloadable files to be used in a build process. One of the scenarios where you would find this solution useful is when you're coding in an agile development environment (using Java or other languages), builds are running based on continuous integration, and you need a repository for your build artifacts, so that you could, for example, share them with other organization members, your customers, or maintain an archive. Another scenario is when your build job itself requires other files, for example, dependencies to download as part of the build input.

In this tutorial, you will be using the Azure Storage Plugin for Jenkins CI made available by Microsoft.

## Jenkins overview
Jenkins enables continuous integration of a software project by allowing developers to easily integrate their code changes and have builds produced automatically and frequently, thereby increasing the productivity of the developers. Builds are versioned, and build artifacts can be uploaded to various repositories. This article shows how to use Azure blob storage as the repository of the build artifacts. It will also show how to download dependencies from Azure blob storage.

More information about Jenkins can be found at [Meet Jenkins](https://wiki.jenkins-ci.org/display/JENKINS/Meet+Jenkins).

## Benefits of using the Blob service
Benefits of using the Blob service to host your agile development build artifacts include:

* High availability of your build artifacts and/or downloadable dependencies.
* Performance when your Jenkins CI solution uploads your build artifacts.
* Performance when your customers and partners download your build artifacts.
* Control over user access policies, with a choice between anonymous access, expiration-based shared access signature access, private access, etc.

## Prerequisites
* A Jenkins continuous integration solution.
  
    If you currently don't have a Jenkins CI solution, you can run a Jenkins CI solution using the following technique:
  
  1. On a Java-enabled machine, download jenkins.war from <https://jenkins-ci.org>.
  2. At a command prompt that is opened to the folder that contains jenkins.war, run:
     
      `java -jar jenkins.war`

  3. In your browser, open `http://localhost:8080/` to open the Jenkins dashboard, which you will use to install and configure the Azure Storage plugin.
     
      While a typical Jenkins CI solution would be set up to run as a service, running the Jenkins war at the command line will be sufficient for this tutorial.
* An Azure account. You can sign up for an Azure account at <https://www.azure.com>.
* An Azure storage account. If you don't already have a storage account, you can create one using the steps at [Create a Storage Account](../common/storage-quickstart-create-account.md).
* Familiarity with the Jenkins CI solution is recommended but not required, as the following content will use a basic example to show you the steps needed when using the Blob service as a repository for Jenkins CI build artifacts.

## How to use the Blob service with Jenkins CI
To use the Blob service with Jenkins, you'll need to install the Azure Storage plugin, configure the plugin to use your storage account, and then create a post-build action that uploads your build artifacts to your storage account. These steps are described in the following sections.

## How to install the Azure Storage plugin
1. Within the Jenkins dashboard, select **Manage Jenkins**.
2. In the **Manage Jenkins** page, select **Manage Plugins**.
3. Select the **Available** tab.
4. In the **Artifact Uploaders** section, check **Microsoft Azure Storage plugin**.
5. Select either **Install without restart** or **Download now and install after restart**.
6. Restart Jenkins.

## How to configure the Azure Storage plugin to use your storage account
1. Within the Jenkins dashboard, select **Manage Jenkins**.
2. In the **Manage Jenkins** page, select **Configure System**.
3. In the **Microsoft Azure Storage Account Configuration** section:
   1. Enter your storage account name, which you can obtain from the [Azure Portal](https://portal.azure.com).
   2. Enter your storage account key, also obtainable from the [Azure Portal](https://portal.azure.com).
   3. Use the default value for **Blob Service Endpoint URL** if you are using the global Azure cloud. If you are using a different Azure cloud, use the endpoint as specified in the [Azure Portal](https://portal.azure.com) for your storage account. 
   4. Select **Validate storage credentials** to validate your storage account. 
   5. [Optional] If you have additional storage accounts that you want made available to your Jenkins CI, select **Add more Storage Accounts**.
   6. Select **Save** to save your settings.

## How to create a post-build action that uploads your build artifacts to your storage account
For instructional purposes, you first need to create a job that will create several files, and then add in the post-build action to upload the files to your storage account.

1. Within the Jenkins dashboard, select **New Item**.
2. Name the job **MyJob**, select **Build a free-style software project**, and then select **OK**.
3. In the **Build** section of the job configuration, select **Add build step** and select **Execute Windows batch command**.
4. In **Command**, use the following commands:

	```   
	md text
	cd text
	echo Hello Azure Storage from Jenkins > hello.txt
	date /t > date.txt
	time /t >> date.txt
	```

5. In the **Post-build Actions** section of the job configuration, select **Add post-build action** and select **Upload artifacts to Azure Blob storage**.
6. For **Storage account name**, select the storage account to use.
7. For **Container name**, specify the container name. (The container will be created if it does not already exist when the build artifacts are uploaded.) You can use environment variables, so for this example enter `${JOB_NAME}` as the container name.
   
    **Tip**
   
    Below the **Command** section where you entered a script for **Execute Windows batch command** is a link to the environment variables recognized by Jenkins. Select that link to learn the environment variable names and descriptions. Environment variables that contain special characters, such as the **BUILD_URL** environment variable, are not allowed as a container name or common virtual path.
8. Select **Make new container public by default** for this example. (If you want to use a private container, you'll need to create a shared access signature to allow access, which is beyond the scope of this article. You can learn more about shared access signatures at [Using Shared Access Signatures (SAS)](../storage-dotnet-shared-access-signature-part-1.md).)
9. [Optional] Select **Clean container before uploading** if you want the container to be cleared of contents before build artifacts are uploaded (leave it unchecked if you do not want to clean the contents of the container).
10. For **List of Artifacts to upload**, enter `text/*.txt`.
11. For **Common virtual path for uploaded artifacts**, for purposes of this tutorial, enter `${BUILD\_ID}/${BUILD\_NUMBER}`.
12. Select **Save** to save your settings.
13. In the Jenkins dashboard, select **Build Now** to run **MyJob**. Examine the console output for status. Status messages for Azure storage will be included in the console output when the post-build action starts to upload build artifacts.
14. Upon successful completion of the job, you can examine the build artifacts by opening the public blob.
    1. Sign in to the [Azure Portal](https://portal.azure.com).
    2. Select **Storage**.
    3. Select the storage account name that you used for Jenkins.
    4. Select **Containers**.
    5. Select the container named **myjob**, which is the lowercase version of the job name that you assigned when you created the Jenkins job. Container names and blob names are lowercase (and case-sensitive) in Azure storage. Within the list of blobs for the container named **myjob**, you should see **hello.txt** and **date.txt**. Copy the URL for either of these items and open it in your browser. You will see the text file that was uploaded as a build artifact.

Only one post-build action that uploads artifacts to Azure blob storage can be created per job. The single post-build action to upload artifacts to Azure blob storage can specify different files (including wildcards) and paths to files within **List of Artifacts to upload** using a semi-colon as a separator. For example, if your Jenkins build produces JAR files and TXT files in your workspace's **build** folder, and you want to upload both to Azure blob storage, use the following value for the **List of Artifacts to upload** option: `build/\*.jar;build/\*.txt`. You can also use double-colon syntax to specify a path to use within the blob name. For example, if you want the JARs to get uploaded using **binaries** in the blob path and the TXT files to get uploaded using **notices** in the blob path, use the following value for the **List of Artifacts to upload** option: `build/\*.jar::binaries;build/\*.txt::notices`.

## How to create a build step that downloads from Azure blob storage
The following steps illustrate to configure a build step to download items from Azure blob storage, which is useful if you want to include items in your build. An example of using this pattern is JARs that you might want to persist in Azure blob storage.

1. In the **Build** section of the job configuration, select **Add build step** and select **Download from Azure Blob storage**.
2. For **Storage account name**, select the storage account to use.
3. For **Container name**, specify the name of the container that has the blobs you want to download. You can use environment variables.
4. For **Blob name**, specify the blob name. You can use environment variables. Also, you can use an asterisk, as a wildcard after you specify the initial letter(s) of the blob name. For example, **project\\*** would specify all blobs whose names start with **project**.
5. [Optional] For **Download path**, specify the path on the Jenkins machine where you want to download files from Azure blob storage. Environment variables can also be used. (If you do not provide a value for **Download path**, the files from Azure blob storage will be downloaded to the job's workspace.)

If you have additional items you want to download from Azure blob storage, you can create additional build steps.

After you run a build, you can check the build history console output, or look at your download location, to see whether the blobs you expected were successfully downloaded.  

## Components used by the Blob service
This section provides an overview of the Blob service components.

* **Storage Account**: All access to Azure Storage is done through a storage account. A storage account is the highest level of the namespace for accessing blobs. An account can contain an unlimited number of containers, as long as their total size is under 100 TB.
* **Container**: A container provides a grouping of a set of blobs. All blobs must be in a container. An account can contain an unlimited number of containers. A container can store an unlimited number of blobs.
* **Blob**: A file of any type and size. There are two types of blobs that can be stored in Azure Storage: block and page blobs. Most files are block blobs. A single block blob can be up to 200 GB in size. This tutorial uses block blobs. Page blobs, another blob type, can be up to 1 TB in size, and are more efficient when ranges of bytes in a file are modified frequently. For more information about blobs, see [Understanding Block Blobs, Append Blobs, and Page Blobs](https://msdn.microsoft.com/library/azure/ee691964.aspx).
* **URL format**: Blobs are addressable using the following URL format:
  
    `http://storageaccount.blob.core.windows.net/container_name/blob_name`
  
    (The format above applies to the global Azure cloud. If you are using a different Azure cloud, use the endpoint within the [Azure Portal](https://portal.azure.com) to determine your URL endpoint.)
  
    In the format above, `storageaccount` represents the name of your storage account, `container_name` represents the name of your container, and `blob_name` represents the name of your blob, respectively. Within the container name, you can have multiple paths, separated by a forward slash, **/**. The example container name used for this tutorial was **MyJob**, and **${BUILD\_ID}/${BUILD\_NUMBER}** was used for the common virtual path, resulting in the blob having a URL of the following form:
  
    `http://example.blob.core.windows.net/myjob/2014-04-14_23-57-00/1/hello.txt`

## Troubleshooting the Jenkins plugin

If you encounter any bugs with the Jenkins plugins, file an issue in the [Jenkins JIRA](https://issues.jenkins-ci.org/) for the specific component.

## Next steps
* [Meet Jenkins](https://wiki.jenkins-ci.org/display/JENKINS/Meet+Jenkins)
* [Azure Storage SDK for Java](https://github.com/azure/azure-storage-java)
* [Azure Storage Client SDK Reference](http://dl.windowsazure.com/storage/javadoc/)
* [Azure Storage Services REST API](https://msdn.microsoft.com/library/azure/dd179355.aspx)
* [Azure Storage Team Blog](https://blogs.msdn.com/b/windowsazurestorage/)

For more information, visit [Azure for Java developers](/java/azure).
