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

## Prerequisites

To complete this quickstart, you'll need:

* [Jenkins](https://jenkins.io/). If you don't have a Jenkins configuration, create one now in [an Azure virtual machine](/azure/virtual-machines/linux/tutorial-jenkins-github-docker-cicd#create-jenkins-instance). The Jenkins deployment must have a JDK and Docker support configured.
* A [GitHub](https://github.com) account.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Install Jenkins plug-ins

1. Open a web browser to your Jenkins web console and select **Manage Jenkins**, then select **Manage Plugins**.
2. Select the **Available** tab.
3. Select the checkbox next to the following plug-ins:
    a. Azure App Service Plugin
    b. Azure Credentials
    c. GitHub Branch Source Plugin
4. Select **Download now and install after restart** to enable the plugins in your Jenkins configuration.

## Fork the GitHub repo 

1. Open the [Spring Boot sample application repo] and fork it to your own GitHub account by selecting **Fork** in the top right-hand corner.
2. From your fork, copy the repo URL on the web and the clone URL for the project along with the Git clone URL.

## Create a Jenkins job

1. In the Jenkins web console, select **New Item**, then enter a name **SpringBootToAzure** and select **Freestyle project**.
2. Under the **General** section, select **GitHub** project and enter your forked repo URL, such as https://github.com/raisa/gs-gs-spring-boot-docker
4. Under the **Source code management**  section, select **Git**, enter your forked repo .git URL, such as https://github.com/raisa/gs-gs-spring-boot-docker.git
5. Under the **Build Triggers** section, select **GitHub hook trigger for GITscm polling**.
6. Under the **Build** section, select **Add build step** and choose **Invoke Gradle Script**. Select the **Use Gradle Wrapper** and enter `complete` into the **Wrapper location** field and `build` into the **Tasks** field.
7. Select **Save**.

## Configure Azure App Service 

1. Using the Azure CLI or Cloud shell, create a new Web App on Linux.
   
    ```azurecli-interactive
    az appservice plan create --is-linux -n myLinuxAppServicePlan -g myResourceGroupJenkins -l westus
    az webapp create -n <unique_webapp_id> -g myResourceGroupJenkins -p myLinuxAppServicePlan
    ```

2. Create an Azure Container Registry to store your Docker images built by Jenkins and configure the web app to use the private registry.

    ```azurecli-interactive
    az acr create -n <unique_name> -g myResourceGroupJenkins -l westus --sku Basic --admin-enabled
    az webapp config container set -c <unique_name>/springboot -g myResourceGroupJenkins -n <unique_webapp_id>
    ```

3. Create an Active Directory Service principal to allow Jenkins to push to the container registry and deploy to App Service.
    
    ```azurecli-interactive
    az ad sp create-for-rbac --name jenkins_sp --password <secure_password>
    ```
 
    Record the output of this command in a convenient place. You'll use it in the next section to configure Jenkins.

## Configure the Azure App Service Jenkins plug-in

1. In the Jenkins web console, select the **SpringBootToAzure** job you created earlier and select **Configure** on the left hand of the page.
2. Scroll down to **Post-build Actions** , then select **Add post-build action** and choose **Publish an Azure Web App** 
3. Under Azure Profile Configuration, select **Add** next to **Azure Credentials**, then choose **Jenkins**.
4. In the **Add Credentials** page , select **Microsoft Azure Service Principal** from the **Kind** drop-down.
5. Provide the credentials from the service principal created in the previous step. If you don't know your subscription ID, you can query it using the CLI:
     
     ```azurecli-interactive
     az account list
     ```
6. Verify the service principal by selecting **Verify Service Principal**, then select **Add**.
7. Select the service principal credentials you just created in the **Azure Credentials** drop-down when you are back to the **Publish an Azure Web App** configuration.
8. Under **App Configuration** , select **Publish via Docker**.
9.  Enter `complete/Dockerfile` for **Dockerfile path**.
10. Enter `https://unique_name.azurecr.io` in the registry URL field. 
11. Select **Add** next to **Registry Credentials**.
12. Enter the admin username for the Azure Container registry you created for **Username**
13. Enter the password for the Azure COntainer registry you created for **Password**
14. 

## Deploy the app from GitHub

## Push changes and redeploy


 
