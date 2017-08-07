---
title: Deploy Java apps to Azure with Jenkins | Microsoft Docs
description: Set up a CI/CD pipeline to Azure App Service for your Java apps using your existing Jenkins configuration.
author: rloutlaw
manager: douge
ms.service: jenkins
ms.devlang: java
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: web
ms.date: 08/02/2017
ms.author: routlaw
ms.custom: Jenkins
---

# Deploy your Java apps to Azure with Jenkins

This quickstart walks through setting up a Jenkins continuous integration and deployment (CI/CD) pipeline to deploy a [Spring Boot](https://spring.pivotal.io) Java app hosted in a GitHub repo to [App Service Web App on Linux](/azure/app-service-web/app-service-linux-intro). 

![Hello World Docker](media/jenkins-java-quickstart/hello_docker_world.png)

## Prerequisites

To complete this quickstart, you'll need:

* [Jenkins](https://jenkins.io/). If you don't have a Jenkins configuration, create one now in [an Azure virtual machine](/azure/virtual-machines/linux/tutorial-jenkins-github-docker-cicd#create-jenkins-instance). The Jenkins deployment must have a JDK configured.
* A [GitHub](https://github.com) account.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Install Jenkins plug-ins

1. Open a web browser to your Jenkins web console and select **Manage Jenkins** from the left-hand menu, then select **Manage Plugins**.
2. Select the **Available** tab.
3. Search for and select the checkbox next to the following plug-ins. If the plugins do not appear, make sure they aren't already installed by checking the **Installed** tab.
    a. [Azure App Service Plugin](https://plugins.jenkins.io/azure-app-service)
    b. [GitHub Branch Source Plugin](https://plugins.jenkins.io/github-branch-source)
4. Select **Download now and install after restart** to enable the plugins in your Jenkins configuration.

## Fork the GitHub repo 

1. Open the [Spring Boot sample application repo](https://github.com/spring-guides/gs-spring-boot-docker) and fork it to your own GitHub account by selecting **Fork** in the top right-hand corner.   
    ![Fork from GitHub](media/jenkins-java-quickstart/fork_github_repo.png)

## Create a Jenkins job

1. In the Jenkins web console, select **New Item**, then enter a name **DeployToAzure** and select **Freestyle project**, then select **OK**.   
    ![New Jenkins Freestyle Project](media/jenkins-java-quickstart/jenkins_freestyle.png)
2. Under the **General** section, select **GitHub** project and enter your forked repo URL, such as https://github.com/raisa/gs-spring-boot-docker
3. Under the **Source code management**  section, select **Git**, enter your forked repo .git URL, such as https://github.com/raisa/gs-spring-boot-docker.git
4. Under the **Build Triggers** section, select **GitHub hook trigger for GITscm polling**.
5. Under the **Build** section, select **Add build step** and choose **Execute shell**. Enter the following script into the **Command** field to use the Maven wrapped included in the repo to build the project.
    
    ```bash
    chmod +x complete/mvnw
    cd complete
    ./mvnw package
    ```

7. Select **Save**. You can test your build now by selecting **Build Now** from the project page.

## Configure Azure App Service 

1. Using the Azure CLI or Cloud Shell, create a new Web App on Linux.
   
    ```azurecli-interactive
    az group create --name myResourceGroupJenkins --location westus
    az appservice plan create --is-linux --name myLinuxAppServicePlan --resource-group myResourceGroupJenkins 
    az webapp create --name deployToAzure --resource-group myResourceGroupJenkins --plan myLinuxAppServicePlan
    ```

2. Create an Azure Container Registry to store the Docker images built by Jenkins and configure the web app to use the private registry.

    ```azurecli-interactive
    az acr create --name jenkinsregistry --resource-group myResourceGroupJenkins --sku Basic --admin-enabled
    az webapp config container set -c jenkinsregistry/webapp --resource-group myResourceGroupJenkins --name deployToAzure
    az webapp config appsettings set --resource-group myResourceGroupJenkins --name deployToAzure --settings PORT=8080
    ```

3. Create an Active Directory Service principal to allow Jenkins to push to the container registry and deploy to App Service.
    
    ```azurecli-interactive
    az ad sp create-for-rbac --name jenkins_sp --password secure_password
    ```

    ```json
    {
        "appId": "9257e114-7412-4c8c-802d-5c80fc1b493d",
        "displayName": "jenkins_sp",
        "name": "http://jenkins_sp",
        "password": "secure_password",
        "tenant": "67ab7f0c-b1d4-4b79-af8b-17a6ed3b3db2"
    }
    ```
 
    Record the output of this command. You'll use it in the next section to configure Jenkins.

## Configure the Azure App Service Jenkins plug-in

1. In the Jenkins web console, select the **SpringBootToAzure** job you created earlier and select **Configure** on the left hand of the page.
2. Scroll down to **Post-build Actions** , then select **Add post-build action** and choose **Publish an Azure Web App** 
3. Under Azure Profile Configuration, select **Add** next to **Azure Credentials**, then choose **Jenkins**.
4. In the **Add Credentials** page , select **Microsoft Azure Service Principal** from the **Kind** drop-down.
5. Provide the credentials from the service principal created in the previous step. If you don't know your subscription ID, you can query it using the CLI:
     
     ```azurecli-interactive
     az account list
     ```

    ![Configure Azure Service Principal](media/jenkins-java-quickstart/azure_service_principal.png)
6. Verify the service principal authenticates with Azure by selecting **Verify Service Principal**. Select **Add** to save the credentials to the Jenkins configuration.
7. Select the service principal credentials you just created in the **Azure Credentials** drop-down when you are back to the **Publish an Azure Web App** configuration.
8. Under **App Configuration** , choose your resource group where you created the Linux Web App and the App Name from the drop-down.
9. Select the **Publish via Docker** radio button.
10. Enter `complete/Dockerfile` for **Dockerfile path**.
11. Enter `https://jenkinsregistry.azurecr.io` in the registry URL field.
12. Select **Add** next to **Registry Credentials**.
13. Enter the admin username for the Azure Container registry you created for **Username**.
14. Enter the password for the Azure Container registry in the **Password** field. You can get your username and password from the Azure portal or through the following CLI command:
    ```azurecli-interactive
    az acr credential show -n jenkinsregistry
    ```
15. Select **Add** to save the credential.
16. Select the newly created credential from the **Registry credentials** drop-down in the **App Configuration** panel for the **Publish an Azure Web App**.
17. Select **Save** to save the job configuration.

## Deploy the app from GitHub

1. From the Jenkins project, select **Build Now** to deplo the sample app to Azure.
2. Once the build completes, your app will be staged in Azure and available through the its URL of http://deployToAzure.azurewebsites.net.

## Push changes and redeploy

1. From your Github fork, browse to `src/main/java/Hello/Application.java`. Select the **Edit this file** link from the GitHub UI.
2. Make the following change to the `home()` method and commit the change to the repo's master branch.
    ```java
    return "Hello Docker World on Azure";
    ```
3. A new build will start in Jenkins, triggered by the commit on the `master` branch of the repo. Once it completes, reload your app on Azure.
  

 
