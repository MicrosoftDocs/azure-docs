---
title: Continuous build and integration for your Azure Service Fabric Linux applications using Jenkins | Microsoft Docs
description: Continuous build and integration for your Service Fabric Linux application using Jenkins
services: service-fabric
documentationcenter: java
author: sayantancs
manager: timlt
editor: ''

ms.assetid: 02b51f11-5d78-4c54-bb68-8e128677783e
ms.service: service-fabric
ms.devlang: java
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 3/9/2018
ms.author: saysa

---
# Use Jenkins to build and deploy your Linux applications
Jenkins is a popular tool for continuous integration and deployment of your apps. Here's how to build and deploy your Azure Service Fabric application by using Jenkins.

## General prerequisites
- Make sure Git is installed locally. You can install the appropriate Git version from [the Git downloads page](https://git-scm.com/downloads), based on your operating system. If you are new to Git, learn more about it from the [Git documentation](https://git-scm.com/docs).

## Set up Jenkins inside a Service Fabric cluster

You can set up Jenkins either inside or outside a Service Fabric cluster. The following sections show how to set it up inside a cluster while using an Azure storage account to save the state of the container instance.

### Prerequisites
1. Have a Service Fabric Linux cluster ready. A Service Fabric cluster created from the Azure portal already has Docker installed. If you are running the cluster locally, check if Docker is installed by using the command `docker info`. If it is not installed, install it by using the following commands:

   ```sh
   sudo apt-get install wget
   wget -qO- https://get.docker.io/ | sh
   ``` 

   > [!NOTE]
   > Ensure that the 8081 port is specified as a custom endpoint on the cluster.
   >

2. Clone the application, by using the following steps:
   ```sh
   git clone https://github.com/suhuruli/jenkins-container-application.git
   cd jenkins-container-application
   ```

3. Persist the state of the Jenkins container in a file-share:
   * Create an Azure storage account in the **same region** as your cluster with a name such as `sfjenkinsstorage1`.
   * Create a **File Share** under the storage Account with a name such as `sfjenkins`.
   * Click on **Connect** for the file-share and note the values it displays under **Connecting from Linux**, the value should look similar to the one below:
     ```sh
     sudo mount -t cifs //sfjenkinsstorage1.file.core.windows.net/sfjenkins [mount point] -o vers=3.0,username=sfjenkinsstorage1,password=<storage_key>,dir_mode=0777,file_mode=0777
     ```

   > [!NOTE]
   > To mount cifs shares, you need to have the cifs-utils package installed in the cluster nodes. 		
   >

4. Update the placeholder values in the `setupentrypoint.sh` script with the azure-storage details from step 3.
   ```sh
   vi JenkinsSF/JenkinsOnSF/Code/setupentrypoint.sh
   ```
   * Replace `[REMOTE_FILE_SHARE_LOCATION]` with the value `//sfjenkinsstorage1.file.core.windows.net/sfjenkins` from the output of the connect in step 3 above.
   * Replace `[FILE_SHARE_CONNECT_OPTIONS_STRING]` with the value `vers=3.0,username=sfjenkinsstorage1,password=GB2NPUCQY9LDGeG9Bci5dJV91T6SrA7OxrYBUsFHyueR62viMrC6NIzyQLCKNz0o7pepGfGY+vTa9gxzEtfZHw==,dir_mode=0777,file_mode=0777` from step 3 above.

5. **Secure Cluster Only:** In order to configure the deployment of applications on a secure cluster from Jenkins, the certificate must be accessible within the Jenkins container. On Linux clusters, the certificates(PEM) are simply copied over from the store specified by X509StoreName onto the container. In the ApplicationManifest under ContainerHostPolicies add this certificate reference and update the thumbprint value. The thumbprint value must be that of a certificate that is located on the node.
   ```xml
   <CertificateRef Name="MyCert" X509FindValue="[Thumbprint]"/>
   ```
   > [!NOTE]
   > The thumbprint value must be the same as the certificate that is used to connect to the secure cluster.	
   >

6. Connect to the cluster and install the container application.

   **Secure Cluster**
   ```sh
   sfctl cluster select --endpoint https://PublicIPorFQDN:19080  --pem [Pem] --no-verify # cluster connect command
   bash Scripts/install.sh
   ```

   **Unsecure Cluster**
   ```sh
   sfctl cluster select --endpoint http://PublicIPorFQDN:19080 # cluster connect command
   bash Scripts/install.sh
   ```

   This installs a Jenkins container on the cluster, and can be monitored by using the Service Fabric Explorer.

   > [!NOTE]
   > It may take a couple of minutes for the Jenkins image to be downloaded on the cluster.
   >

### Steps
1. From your browser, go to `http://PublicIPorFQDN:8081`. It provides the path of the initial admin password required to sign in. 
2. Look at the Service Fabric Explorer to determine on which node the Jenkins container is running. Secure Shell (SSH) sign in to this node.
   ```sh
   ssh user@PublicIPorFQDN -p [port]
   ``` 
3. Get the container instance ID by using `docker ps -a`.
4. Secure Shell (SSH) sign in to the container, and paste the path you were shown on the Jenkins portal. For example, if in the portal it shows the path `PATH_TO_INITIAL_ADMIN_PASSWORD`, run the following:

   ```sh
   docker exec -t -i [first-four-digits-of-container-ID] /bin/bash   # This takes you inside Docker shell
   ```
   ```sh
   cat PATH_TO_INITIAL_ADMIN_PASSWORD # This displays the pasword value
   ```
5. On the Jenkins Getting Started page, choose the Select plugins to install option, select the **None** checkbox, and click install.
6. Create a user or select to continue as an admin.

## Set up Jenkins outside a Service Fabric cluster

You can set up Jenkins either inside or outside of a Service Fabric cluster. The following sections show how to set it up outside a cluster.

### Prerequisites
Make sure that Docker is installed on your machine. The following commands can be used to install Docker from the terminal:

  ```sh
  sudo apt-get install wget
  wget -qO- https://get.docker.io/ | sh
  ```

When you run `docker info` in the terminal, the output should show that the Docker service is running.

### Steps
1. Pull the Service Fabric Jenkins container image: `docker pull rapatchi/jenkins:v10`. This image comes with Service Fabric Jenkins plugin pre-installed.
2. Run the container image: `docker run -itd -p 8080:8080 rapatchi/jenkins:v10`
3. Get the ID of the container image instance. You can list all the Docker containers with the command `docker ps –a`
4. Sign in to the Jenkins portal by using the following steps:

   * Sign in to a Jenkins shell from your host with the following command. Use the first four digits of the container ID. For example, if the container ID is  `2d24a73b5964`, use `2d24`.
      ```sh
      docker exec -it [first-four-digits-of-container-ID] /bin/bash
      ```
   * From the Jenkins shell, get the admin password for your container instance:
      ```sh
      cat /var/jenkins_home/secrets/initialAdminPassword
      ```      
   * To sign in to the Jenkins dashboard, open the following URL in a web browser: `http://<HOST-IP>:8080`. Use the password from the previous step to unlock Jenkins.
   * After you sign in for the first time, you can create your own user account and use that for the following steps, or you can continue to use the administrator account. If you create a user, you need to continue with that user.
1. Set up GitHub to work with Jenkins, by using the steps in [Generating a new SSH key and adding it to the SSH agent](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/).
   * Use the instructions provided by GitHub to generate the SSH key, and to add the SSH key to the GitHub account that is hosting the repository.
   * Run the commands mentioned in the preceding link in the Jenkins Docker shell (and not on your host).
   * To sign in to the Jenkins shell from your host, use the following command:

      ```sh
      docker exec -t -i [first-four-digits-of-container-ID] /bin/bash
      ```

Ensure that the cluster or machine where the Jenkins container image is hosted has a public-facing IP. This enables the Jenkins instance to receive notifications from GitHub.


## Create and configure a Jenkins job

1. Create a **new item** from dashboard.
2. Enter an item name (for example, **MyJob**). Select **free-style project**, and click **OK**.
3. Go the job page, and click **Configure**.

   a. In the general section, select the checkbox for **GitHub project**, and specify your GitHub project URL. This URL hosts the Service Fabric Java application that you want to integrate with the Jenkins continuous integration, continuous deployment (CI/CD) flow (for example, `https://github.com/sayantancs/SFJenkins`).

   b. Under the **Source Code Management** section, select **Git**. Specify the repository URL that hosts the Service Fabric Java application that you want to integrate with the Jenkins CI/CD flow (for example, `https://github.com/sayantancs/SFJenkins.git`). You can also specify which branch to build (for example, `/master`).
1. Configure your *GitHub* (which is hosting the repository) so that it is able to talk to Jenkins. Use the following steps:

   a. Go to your GitHub repository page. Go to **Settings** > **Integrations and Services**.

   b. Select **Add Service**, type **Jenkins**, and select the **Jenkins-GitHub plugin**.

   c. Enter your Jenkins webhook URL (by default, it should be `http://<PublicIPorFQDN>:8081/github-webhook/`). Click **add/update service**.

   d. A test event is sent to your Jenkins instance. You should see a green check by the webhook in GitHub, and your project will build.

   e. Under the **Build Triggers** section, select which build option you want. For this example, you want to trigger a build whenever a push to the repository happens, so select **GitHub hook trigger for GITScm polling**. (Previously, this option was called **Build when a change is pushed to GitHub**.)

   f. **Build Section for Java Applications:** Under the **Build section**, from the **Add build step** drop-down, select **Invoke Gradle Script**. In the widget that comes open the advanced menu, specify the path to **Root build script** for your application. It picks up build.gradle from the path specified and works accordingly. If you create a project named `MyActor` (using the Eclipse plug-in or Yeoman generator), the root build script should contain `${WORKSPACE}/MyActor`. See the following screenshot for an example of what this looks like:

    ![Service Fabric Jenkins Build action][build-step]

   g. **Build Section for .Net Core Applications:** Under the **Build section**, from the **Add build step** drop-down, select **Execute Shell**. In the command box that appears, the directory first needs to be changed to the path where the build.sh file is located. Once the directory has been changed the build.sh script can be run and will build the application.

      ```sh
      cd /var/jenkins_home/workspace/[Job Name]/[Path to build.sh]  # change directory to location of build.sh file
      ./build.sh
      ```

    Below is an exmaple of the commands that are used to build the [Counter Service](https://github.com/Azure-Samples/service-fabric-dotnet-core-getting-started/tree/master/Services/CounterService) sample with a Jenkins job name of CounterServiceApplication.

    ![Service Fabric Jenkins Build action][build-step-dotnet]
  
   h. From the **Post-Build Actions** drop-down, select **Deploy Service Fabric Project**. Here you need to provide cluster details where the Jenkins compiled Service Fabric application will be deployed. The path to the certificate can be found by echoing the value of the echo Certificates_JenkinsOnSF_Code_MyCert_PEM environment variable from within the container. This path can be used for the Client Key and the Client Cert fields.

      ```sh
      echo $Certificates_JenkinsOnSF_Code_MyCert_PEM
      ```
   
    You can also provide additional application details used to deploy the application. See the following screenshot for an example of what this looks like:

    ![Service Fabric Jenkins Build action][post-build-step]

      > [!NOTE]
      > The cluster here could be same as the one hosting the Jenkins container application, in case you are using Service Fabric to deploy the Jenkins container image.
      >

## Use Azure Active Directory Service Principal

1. Follow the steps in [Use the portal to create an Azure Active Directory application and service principal](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-create-service-principal-portal). 

   * If you don't have the [required permissions](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-create-service-principal-portal#required-permissions) on your directory, you'll need to ask an administrator to grant you the permissions or create the service principal for you, or you'll need to configure the cluster certificate (or a client certificate) in the **Post-Build Actions** for your job in Jenkins. For details about how to configure a certificate, see step 4.h in the preceding section.
   * Be sure to copy and save the following values. You'll need them to configure the Azure credentials in Jenkins:
      * *Application ID*
      * *Application key*
      * *Directory ID (Tenant ID)*
      * *Subscription ID*
   * In the [Create an Azure Active Directory application](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-create-service-principal-portal#create-an-azure-active-directory-application) section, make sure you select *Web app/API* for the **Application type**. You can enter any well-formed URL for the **Sign-on URL**.
   * In the [Assign application to a Role](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-create-service-principal-portal#assign-application-to-role) section, you can assign your application the *Reader* role on the resource group for your cluster.

2. From the **Post-Build Actions** drop-down, select **Deploy Service Fabric Project**. 
   1. Click the **Select the Service Fabric Cluster** button. Click **Add** next to **Azure Credentials**. Click **Jenkins** to select the Jenkins Credentials Provider.
   2. In the Jenkins Credentials Provider, select **Microsoft Azure Service Principal** from the **Kind** drop-down.
   3. From the values you saved when setting up your service principal, enter the following:
      * **Client ID** : *Application ID*
      * **Client Secret** : *Application key*
      * **Tenant ID** : *Directory ID*
      * **Subscription ID** : *Subscription ID*
   5. Enter a descriptive **ID** that you use to select the credential in Jenkins and a brief **Description**. Then click **Verify Service Principal**. If the verification succeeds, click **Add**.
   6. Back under **Service Fabric Cluster Configuration**, ensure that your new credential is selected for **Azure Credentials**. 
   7. From the **Resource Group** drop-down select the resource group of the cluster you want to deploy the application to.
   8. From the **Service Fabric** drop-down select the cluster that you wan to deploy the application to.
   9. Under **Application Configuration**, configure the **Application Name**, **Application Type**, and the (relative) **Path to Application Manifest** fields.

## Next steps
GitHub and Jenkins are now configured. Consider making some sample change in your `MyActor` project in the repository example, https://github.com/sayantancs/SFJenkins. Push your changes to a remote `master` branch (or any branch that you have configured to work with). This triggers the Jenkins job, `MyJob`, that you configured. It fetches the changes from GitHub, builds them, and deploys the application to the cluster endpoint you specified in post-build actions.  

  <!-- Images -->
  [build-step]: ./media/service-fabric-cicd-your-linux-application-with-jenkins/build-step.png
  [build-step-dotnet]: ./media/service-fabric-cicd-your-linux-application-with-jenkins/build-step-dotnet.png
  [post-build-step]: ./media/service-fabric-cicd-your-linux-application-with-jenkins/post-build-step.png

