<properties linkid="develop-java-how-to-jenkins-ci" urlDisplayName="Jenkins Continuous Integration" pageTitle="How to use Jenkins with the Windows Azure Blob service" metaKeywords="Jenkins, Windows Azure storage, Windows Azure Blob service, windows azure storage, azure jenkins" metaDescription="Describes how to use Jenkins with Windows Azure Blob storage as a repository for build artifacts." metaCanonical="" disqusComments="1" umbracoNaviHide="0" writer="waltpo" editor="mollybos" />

<div chunk="../chunks/article-left-menu.md" />

#Using Windows Azure Storage with a Jenkins Continuous Integration solution

The following information shows how to use the Windows Azure Blob service as a repository of build artifacts created by a Jenkins Continuous Integration (CI) solution. One of the scenarios where you would find this useful is when you’re coding in an agile development environment (using Java or other languages), builds are running based on continuous integration, and you need a repository for your build artifacts, so that you could, for example, share them with other organization members, your customers, or maintain an archive. 

In this tutorial you will be using the Windows Azure Storage Plugin for Jenkins CI made available by Microsoft Open Technologies, Inc.

## Table of Contents

-   [Benefits of using the Blob service][]
-   [Prerequisites][]
-   [How to use the Blob service with Jenkins CI][]
-   [How to install the Windows Azure Storage plugin][]
-   [How to configure the Windows Azure Storage plugin to use your storage account][]
-   [How to create a post-build action that uploads your build artifacts to your storage account][]
-   [Components used by the Blob service][]

<h2><a name="benefits"></a><span class="short header">Benefits</span>Benefits of using the Blob service</h2>

Benefits of using the Blob service to host your agile development build artifacts include:

- High availability of your build artifacts.
- Performance when your Jenkins CI solution uploads your build artifacts.
- Performance when your customers and partners download your build artifacts.
- Control over user access policies, with a choice between anonymous access, expiration-based shared access signature access, private access, etc.

<h2><a name="prerequisites"></a><span class="short header">Prequisites</span>Prequisites</h2>

You will need the following to use the Blob service with your Jenkins CI solution:

- A Jenkins Continuous Integration solution.

    If you currently don’t have a Jenkins CI solution, you can run a Jenkins CI solution using the following technique:

    1. On a Java-enabled machine, download jenkins.war from <http://jenkins-ci.org>.
    2. At a command prompt that is opened to the folder that contains jenkins.war, run:

        `java –jar jenkins.war`

    3. In your browser, open `http://localhost:8080/`. This will open the Jenkins dashboard, which you will use to install and configure the Windows Azure Storage plugin.

        While a typical Jenkins CI solution would be set up to run as a service, running the Jenkins war at the command line will be sufficient for this tutorial.

- A Windows Azure account. You can sign up for a Windows Azure account at <http://www.windowsazure.com>.

- A Windows Azure storage account. If you don’t already have a storage account, you can create one using the steps at [How to Create a Storage Account][].

- Familiarity with the Jenkins CI solution is recommended but not required, as the following content will use a basic example to show you the steps needed when using the Blob service as a repository for Jenkins CI build artifacts.

<h2><a name="howtouse"></a><span class="short header">How to use Blob service</span>How to use the Blob service with Jenkins CI</h2>

To use the Blob service with Jenkins, you’ll need to install the Windows Azure Storage plugin, configure the plugin to use your storage account, and then create a post-build action that uploads your build artifacts to your storage account. These steps are described in the following sections.

<h2><a name="howtoinstall"></a><span class="short header">How to install</span>How to install the Windows Azure Storage plugin</h2>

1. Within the Jenkins dashboard, click **Manage Jenkins**.
2. In the **Manage Jenkins** page, click **Manage Plugins**.
3. Click the **Available** tab.
4. In the **Artifact Uploaders** section, check **Windows Azure Storage plugin**.
5. Click either I**nstall without restart** or **Download now and install after restart**.
6. Restart Jenkins.

<h2><a name="howtoconfigure"></a><span class="short header">How to configure</span>How to configure the Windows Azure Storage plugin to use your storage account</h2>

1. Within the Jenkins dashboard, click **Manage Jenkins**.
2. In the **Manage Jenkins** page, click **Configure System**.
3. In the **Windows Azure Storage Account Configuration** section:
    1. Enter your storage account name, which you can obtain from the Windows Azure portal, <https://manage.windowsazure.com>.
    2. Enter your storage account key, also obtainable from the Windows Azure portal.
    3. Use the default value for **Blob Service Endpoint URL** if you are using the public Windows Azure cloud. If you are using a different Windows Azure cloud, use the endpoint as specified in the Windows Azure management portal for your storage account. 
    4. Click **Validate Storage Credentials** to validate your storage account. 
    5. [Optional] If you have additional storage accounts that you want made available to your Jenkins CI, click **Add more Storage Accounts**.
    6. Click **Save** to save your settings.

<h2><a name="howtocreatepostbuild"></a><span class="short header">How to create post-build action</span>How to create a post-build action that uploads your build artifacts to your storage account</h2>

For instruction purposes, first we’ll need to create a job that will create several files, and then add in the post-build action to upload the files to your storage account.

1. Within the Jenkins dashboard, click **New Job**.
2. Name the job **MyJob**, click **Build a free-style software project**, and then click **OK**.
3. In the **Build** section of the job configuration, click **Add build step** and choose **Execute Windows batch command**.
4. In **Command**, use the following commands:

        md text
        cd text
        echo Hello Windows Azure Storage from Jenkins > hello.txt
        date /t > date.txt
        time /t >> date.txt
 
5. In the **Post-build Actions** section of the job configuration, click **Add post-build action** and choose **Upload artifacts to Windows Azure Blob storage**.
6. For **Storage Account Name**, select the storage account to use.
7. For **Container Name**, specify the container name. (The container will be created if it does not already exist when the build artifacts are uploaded.) You can use environment variables, so for this example enter **${JOB_NAME}** as the container name.

    **Tip**
    
    Below the **Command** section where you entered a script for **Execute Windows batch command** is a link to the environment variables recognized by Jenkins. Click that link to learn the environment variable names and descriptions. Note that environment variables that contain special characters, such as the **BUILD_URL** environment variable, are not allowed as a container name or common virtual path.

8. Click **Make container public** for this example. (If you want to use a private container, you’ll need to create a shared access signature to allow access. That is beyond the scope of this topic. You can learn more about shared access signatures at [Creating a Shared Access Signature](http://go.microsoft.com/fwlink/?LinkId=279889).)
9. For **List of Artifacts to upload**, enter **text/*.txt**.
10. For **Common virtual path for uploaded artifacts**, enter **${BUILD\_ID}/${BUILD\_NUMBER}**.
11. Click **Save** to save your settings.
12. In the Jenkins dashboard, click **Build Now** to run **MyJob**. Examine the console output for status. Status messages for Windows Azure storage will be included in the console output when the post-build action starts to upload build artifacts.
13. Upon successful completion of the job, you can examine the build artifacts by opening the public blob.
    1. Login to the Windows Azure management portal, <https://manage.windowsazure.com>.
    2. Click **Storage**.
    3. Click the storage account name that you used for Jenkins.
    4. Click **Containers**.
    5. Click the container named **myjob**, which is the lowercase version of the job name that you assigned when you created the Jenkins job. Container names and blob names are lowercase (and case-sensitive) in Windows Azure storage. Within the list of blobs for the container named **myjob** you should see **hello.txt** and **date.txt**. Copy the URL for either of these items and open it in your browser. You will see the text file that was uploaded as a build artifact.

<h2><a name=""></a><span class="short header">Blob service components</span>Components used by the Blob service</h2>

The following provides an overview of the Blob service components.

- **Storage Account**: All access to Windows Azure Storage is done through a storage account. This is the highest level of the namespace for accessing blobs. An account can contain an unlimited number of containers, as long as their total size is under 100TB.
- **Container**: A container provides a grouping of a set of blobs. All blobs must be in a container. An account can contain an unlimited number of containers. A container can store an unlimited number of blobs.
- **Blob**: A file of any type and size. There are two types of blobs that can be stored in Windows Azure Storage: block and page blobs. Most files are block blobs. A single block blob can be up to 200GB in size. This tutorial uses block blobs. Page blobs, another blob type, can be up to 1TB in size, and are more efficient when ranges of bytes in a file are modified frequently. For more information about blobs, see [Understanding Block Blobs and Page Blobs](http://msdn.microsoft.com/en-us/library/windowsazure/ee691964.aspx).
- **URL format**: Blobs are addressable using the following URL format:

    `http://storageaccount.blob.core.windows.net/container_name/blob_name`
    
    (The format above applies to the public Windows Azure cloud. If you are using a different Windows Azure cloud, use the endpoint within the Windows Azure management portal to determine your URL endpoint.)

    In the format above, `storageaccount` represents the name of your storage account, `container_name` represents the name of your container, and `blob_name` represents the name of your blob, respectively. Within the container name, you can have multiple paths, separated by a forward slash, **/**. The example container name in this tutorial was **MyJob**, and **${BUILD\_ID/${BUILD\_NUMBER}** was used for the common virtual path, resulting in the blob having a URL of the following form:

    `http://example.blob.core.windows.net/myjob/2013-01-28_15-00-35/2/hello.txt`



  [Benefits of using the Blob service]: #benefits
  [Prerequisites]: #prerequisites
  [How to use the Blob service with Jenkins CI]: #howtouse
  [How to install the Windows Azure Storage plugin]: #howtoinstall
  [How to configure the Windows Azure Storage plugin to use your storage account]: #howtoconfigure
  [How to create a post-build action that uploads your build artifacts to your storage account]: #howtocreatepostbuild
  [Components used by the Blob service]: #components
  [How to Create a Storage Account]: http://go.microsoft.com/fwlink/?LinkId=279823
  