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

## Requirements to install Service Fabric plug-in in an existing Jenkins environment
If you are adding the Service Fabric plug-in to an existing Jenkins environment, you need the following:

- The [Service Fabric CLI](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-cli) (sfctl).
   > [!NOTE]
   > Be sure to install the CLI at the system level rather than at the user level, so Jenkins can run CLI commands. 
- To develop Java applications, install both [Gradle and Open JDK 8.0](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-get-started-linux#set-up-java-development). 
- To develop .NetCore 2.0 applications, install the [.NET Core 2.0 SDK](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-get-started-linux#set-up-net-core-20-development). 


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
4. Sign in to the Jenkins portal with the following steps:

   1. Sign in to a Jenkins shell from your host. Use the first four digits of the container ID. For example, if the container ID is  `2d24a73b5964`, use `2d24`.

      ```sh
      docker exec -it [first-four-digits-of-container-ID] /bin/bash
      ```
   2. From the Jenkins shell, get the admin password for your container instance:

      ```sh
      cat /var/jenkins_home/secrets/initialAdminPassword
      ```      
   3. To sign in to the Jenkins dashboard, open the following URL in a web browser: `http://<HOST-IP>:8080`. Use the password from the previous step to unlock Jenkins.
   4. (Optional.) After you sign in for the first time, you can create your own user account and use that for the following steps, or you can continue to use the administrator account. If you create a user, you need to continue with that user.
5. Set up GitHub to work with Jenkins by using the steps in [Generating a new SSH key and adding it to the SSH agent](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/).
   * Use the instructions provided by GitHub to generate the SSH key, and to add the SSH key to the GitHub account that is hosting the repository.
   * Run the commands mentioned in the preceding link in the Jenkins Docker shell (and not on your host).
   * To sign in to the Jenkins shell from your host, use the following command:

      ```sh
      docker exec -t -i [first-four-digits-of-container-ID] /bin/bash
      ```

Ensure that the cluster or machine where the Jenkins container image is hosted has a public-facing IP. This enables the Jenkins instance to receive notifications from GitHub.


## Create and configure a Jenkins job

The steps in this section show you how to configure a Jenkins job to respond to changes in a GitHub repo, fetch the changes, build them, and deploy the application to a Service Factor cluster. There are two ways to configure Jenkins to deploy your application to a Service Fabric cluster: 
   
* You can configure Jenkins with your Service Fabric Management endpoint. This is suitable for development and test environments. 
* For production environments, Microsoft recommends that you configure Jenkins with Azure credentials. Using Azure credentials lets you limit the access that a Jenkins job has to your Azure resources. 

If you choose to use Azure credentials, be sure to follow the instructions in the **Prerequisites** to create an Azure Active Directory service principal. You need the service principal to configure the job's post-build actions.


### Prerequisites

1. If you want to set up your job to deploy the application to your Service Fabric cluster using Azure credentials, follow the steps in [Use the portal to create an Azure Active Directory application and service principal](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-create-service-principal-portal). 

   * While following the steps in the topic, be sure to copy and save the following values: *Application ID*, *Application key*, *Directory ID (Tenant ID)*, and *Subscription ID*. You need them to configure the Azure credentials in Jenkins.
   * If you don't have the [required permissions](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-create-service-principal-portal#required-permissions) on your directory, you'll need to ask an administrator to either grant you the permissions or create the service principal for you, or you'll need to configure the management endpoint for your cluster in the **Post-Build Actions** for your job in Jenkins.
   * In the [Create an Azure Active Directory application](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-create-service-principal-portal#create-an-azure-active-directory-application) section, you can enter any well-formed URL for the **Sign-on URL**.
   * In the [Assign application to a Role](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-create-service-principal-portal#assign-application-to-role) section, you can assign your application the *Reader* role on the resource group for your cluster.

2. The steps in this section use the *Service Fabric Getting Started Sample* on GitHub: [https://github.com/Azure-Samples/service-fabric-java-getting-started](https://github.com/Azure-Samples/service-fabric-java-getting-started). You can fork this repository to follow along or, with some modification to the instructions, use your own GitHub project.

### Steps
1. On the Jenkins dashboard, click  **New Item**.
2. Enter an item name (for example, **MyJob**). Select **free-style project**, and click **OK**.
3. The Job configuration page opens. (To get to the configuration from the Jenkins dashboard, click the job, and then click **Configure**).

4. On the **General** tab, check the box for **GitHub project**, and specify your GitHub project URL. This URL hosts the Service Fabric Java application that you want to integrate with the Jenkins continuous integration, continuous deployment (CI/CD) flow (for example, `https://github.com/{your-github-account}/service-fabric-java-getting-started`).

5. On the **Source Code Management** tab, select **Git**. Specify the repository URL that hosts the Service Fabric Java application that you want to integrate with the Jenkins CI/CD flow (for example, `https://github.com/{your-github-account}/service-fabric-java-getting-started`). You can also specify which branch to build (for example, `/master`).
6. Configure your *GitHub* repository to talk to Jenkins:

   a. On your GitHub repository page, go to **Settings** > **Integrations and Services**.

   b. Select **Add Service**, type **Jenkins**, and select the **Jenkins-GitHub plugin**.

   c. Enter your Jenkins webhook URL (by default, it should be `http://<PublicIPorFQDN>:8081/github-webhook/`). Click **add/update service**.

   d. A test event is sent to your Jenkins instance. You should see a green check by the webhook in GitHub, and your project will build.

7. On the **Build Triggers** tab in Jenkins, select which build option you want. For this example, you want to trigger a build whenever a push to the repository happens, so select **GitHub hook trigger for GITScm polling**. (Previously, this option was called **Build when a change is pushed to GitHub**.)
8. On the **Build** tab, do one of the following depending on whether you are building a Java application or a .NET Core application:

   * **For Java Applications:** From the **Add build step** drop-down, select **Invoke Gradle Script**. Click **Advanced**. In the advanced menu, specify the path to **Root build script** for your application. It picks up build.gradle from the path specified and works accordingly. For the [ActorCounter application](https://github.com/Azure-Samples/service-fabric-java-getting-started/tree/master/reliable-services-actor-sample/Actors/ActorCounter), this is: `${WORKSPACE}/reliable-services-actor-sample/Actpr/ActorCounter`.

     ![Service Fabric Jenkins Build action][build-step]

   * **For .Net Core Applications:** From the **Add build step** drop-down, select **Execute Shell**. In the command box that appears, the directory first needs to be changed to the path where the build.sh file is located. Once the directory has been changed the build.sh script can be run and will build the application.

      ```sh
      cd /var/jenkins_home/workspace/[Job Name]/[Path to build.sh]  # change directory to location of build.sh file
      ./build.sh
      ```

     The following screenshot shows an example of the commands that are used to build the [Counter Service](https://github.com/Azure-Samples/service-fabric-dotnet-core-getting-started/tree/master/Services/CounterService) sample with a Jenkins job name of CounterServiceApplication.

      ![Service Fabric Jenkins Build action][build-step-dotnet]

9. To configure Jenkins to deploy your app to a Service Fabric cluster post-build, you need the location of that cluster's certificate in your Jenkins container. Choose one of the following depending on whether your Jenkins container is running inside or outside of your cluster:

   * **For Jenkins running inside your cluster:** The path to the certificate can be found by echoing the value of the *Certificates_JenkinsOnSF_Code_MyCert_PEM* environment variable from within the container.

      ```sh
      echo $Certificates_JenkinsOnSF_Code_MyCert_PEM
      ```
   
   * **For Jenkins running outside your cluster:** Follow these steps to copy the cluster certificate to your container:
      1. Your certificate must be in PEM format. If you don't have a PEM file, you can create one from the certificate PFX file. If your PFX file is not password protected, run the following command from your host:
         ```sh
         openssl pkcs12 -in clustercert.pfx -out clustercert.pem -nodes -passin pass:
         ``` 
      If the PFX file is password protected, include the password in the `-passin` parameter. For example:
         ```sh
         openssl pkcs12 -in clustercert.pfx -out clustercert.pem -nodes -passin pass:MyPassword1234!
         ``` 
      2. To get the image name for your Jenkins container, run `docker ps` from your host and note the NAME value for your container.
      3. Copy the PEM file to your container with the following Docker command:
      
         ```sh
         docker cp clustercert.pem <container-name>:/var/jenkins_home
         ``` 

10. To configure Jenkins to deploy the application post-build using the cluster management endpoint, follow these steps:

    > [!NOTE]
    > Using the cluster management endpoint to deploy your application is suitable for development and test environments. If you are deploying to a production environment, skip ahead to the next step (11) to configure an Azure Active Directory service principal as the Azure Credential to use during deployment.    
    
   1. Click the **Post-build Actions** tab. 
   2. From the **Post-Build Actions** drop-down, select **Deploy Service Fabric Project**. 
   3. Under **Service Fabric Cluster Configuration**, select the **Fill the Service Fabric Management Endpoint** radio button.
   4. For **Management Host**, enter the connection endpoint for your cluster; for example `{your-cluster}.eastus.cloudapp.azure.com`.
   5. For **Client Key** and **Client Cert**, enter the location of the PEM file in your Jenkins container (see step 9). For example `/var/jenkins_home/clustercert.pem`.
   6. Under **Application Configuration**, configure the **Application Name**, **Application Type**, and the (relative) **Path to Application Manifest** fields.

        ![Service Fabric Jenkins Post-Build action configure management endpoint](./media/service-fabric-cicd-your-linux-application-with-jenkins/post-build-endpoint.png)

   7. Click **Verify Configuration**. On successful verification, click **Save**.
   8. Skip ahead to [Next steps](#next-steps) to test your deployment.

11. To configure Jenkins to deploy the application post-build using an Azure Active Directory service principal, follow these steps: 
    > [!NOTE]
    > Configuring an Azure credential is strongly recommended for production environments. These steps show you how to configure an Azure Active Directory  service principal as your Azure credential. You can assign service principals to roles to limit the permissions of the Jenkins job in your directory. For development and test, you can use configure Azure credentials or the cluster management endpoint to deploy your application. For details about how to configure a cluster management endpoint, see the previous step (10).   


   1. Click the **Post-build Actions** tab.
   2. From the **Post-Build Actions** drop-down, select **Deploy Service Fabric Project**. 
   3. Under **Service Fabric Cluster Configuration**, Select the **Select the Service Fabric Cluster** radio button. Click **Add** next to **Azure Credentials**. Click **Jenkins** to select the Jenkins Credentials Provider.
   4. In the Jenkins Credentials Provider, select **Microsoft Azure Service Principal** from the **Kind** drop-down.
   5. From the values you saved when setting up your service principal in **Prerequisites**, enter the following:

       * **Client ID** : *Application ID*
       * **Client Secret** : *Application key*
       * **Tenant ID** : *Directory ID*
       * **Subscription ID** : *Subscription ID*
   6. Enter a descriptive **ID** that you use to select the credential in Jenkins and a brief **Description**. Then click **Verify Service Principal**. If the verification succeeds, click **Add**.
      ![Service Fabric Jenkins enter Azure credentials](./media/service-fabric-cicd-your-linux-application-with-jenkins/enter-azure-credentials.png)
   7. Back under **Service Fabric Cluster Configuration**, ensure that your new credential is selected for **Azure Credentials**. 
   8. From the **Resource Group** drop-down select the resource group of the cluster you want to deploy the application to.
   9. From the **Service Fabric** drop-down select the cluster that you wan to deploy the application to.
   10. For **Client Key** and **Client Cert**, enter the location of the PEM file in your Jenkins container. For example `/var/jenkins_home/clustercert.pem`. 
   11. Under **Application Configuration**, configure the **Application Name**, **Application Type**, and the (relative) **Path to Application Manifest** fields.
      ![Service Fabric Jenkins Post-Build action configure Azure credentials](./media/service-fabric-cicd-your-linux-application-with-jenkins/post-build-credentials.png)
   12. Click **Verify Configuration**. On successful verification, click **Save**.

## Next steps
GitHub and Jenkins are now configured. Consider making some sample change in your `MyActor` project in the repository example, https://github.com/{your-github-username}/service-fabric-java-getting-started. Push your changes to a remote `master` branch (or any branch that you have configured to work with). This triggers the Jenkins job, `MyJob`, that you configured. It fetches the changes from GitHub, builds them, and deploys the application to the cluster endpoint you specified in post-build actions.  

  <!-- Images -->
  [build-step]: ./media/service-fabric-cicd-your-linux-application-with-jenkins/build-step.png
  [build-step-dotnet]: ./media/service-fabric-cicd-your-linux-application-with-jenkins/build-step-dotnet.png
  [post-build-step]: ./media/service-fabric-cicd-your-linux-application-with-jenkins/post-build-step.png

