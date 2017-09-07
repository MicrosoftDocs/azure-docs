---
title: Deploy to Azure App Service with Jenkins Plugin | Microsoft Docs
description: Learn how to use Azure App Service Jenkins plugin to deploy a Java web app to Azure in Jenkins
services: app-service\web
documentationcenter: ''
author: mlearned
manager: douge
editor: ''

ms.assetid: 
ms.service: multiple
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: web
ms.date: 7/24/2017
ms.author: mlearned
ms.custom: Jenkins
---

# Deploy to Azure App Service with Jenkins plugin 
To deploy a Java web app to Azure, you can use Azure CLI in [Jenkins Pipeline](/azure/jenkins/execute-cli-jenkins-pipeline) or you can make use of the [Azure App Service Jenkins plugin](https://plugins.jenkins.io/azure-app-service). In this tutorial, you learn how to:

> [!div class="checklist"]
> * Configure Jenkins to deploy to Azure App Service through FTP 
> * Configure Jenkins to deploy to Azure App Service on Linux through Docker 

## Create and Configure Jenkins instance
If you do not already have a Jenkins master, start with the [Solution Template](install-jenkins-solution-template.md), which includes JDK8 and the following required plugins:

* [Jenkins Git client plugin](https://plugins.jenkins.io/git-client) v.2.4.6 
* [Docker Commons Plugin](https://plugins.jenkins.io/docker-commons) v.1.4.0
* [Azure Credentials](https://plugins.jenkins.io/azure-credentials) v.1.2
* [Azure App Service](https://plugins.jenkins.io/azure-app-server) v.0.1

You can use the App Service plugin to deploy Web App in all languages (for instance, C#, PHP, Java, and node.js etc.) supported by Azure App Service. In this tutorial, we are using the sample Java app, [Simple Java Web App for Azure](https://github.com/azure-devops/javawebappsample). To fork the repo to your own GitHub account, click the **Fork** button in the top right-hand corner.  

Java JDK and Maven are required for building the Java project. Make sure you install the components in the Jenkins master or the VM agent if you use one for continuous integration. 

To install, log in to the Jenkins instance using SSH and run the following commands:

```bash
sudo apt-get install -y openjdk-7-jdk
sudo apt-get install -y maven
```

For deploying to App Service on Linux, you also need to install Docker on the Jenkins master or the VM agent used for build. Refer to this article to install Docker: https://docs.docker.com/engine/installation/linux/ubuntu/.

## Add Azure service principal to Jenkins credential

An Azure service principal is needed to deploy to Azure. 

<ol>
<li>Use [Azure CLI](/cli/azure/create-an-azure-service-principal-azure-cli?toc=%2fazure%2fazure-resource-manager%2ftoc.json) or [Azure portal](/azure/azure-resource-manager/resource-group-create-service-principal-portal) to create an Azure service principal</li>
<li>Within the Jenkins dashboard, click **Credentials -> System ->**. Click **Global credentials(unrestricted)**.</li>
<li>Click **Add Credentials** to add a Microsoft Azure service principal by filling out the Subscription ID, Client ID, Client Secret, and OAuth 2.0 Token Endpoint. Provide an ID, **mySp**, for use in subsequent steps.</li>
</ol>

## Azure App Service plugin

Azure App Service plugin v1.0 supports continuous deployment to Azure Web App through:

* Git and FTP
* Docker for Web App on Linux

## Configure Jenkins to deploy Web App through FTP using the Jenkins dashboard

To deploy your project to Azure Web App, you can upload your build artifacts (for example, .war file in Java) using Git or FTP.

Before setting up the job in Jenkins, you need an Azure App Service plan and a Web App for running the Java app.


1. Create an Azure App Service plan with the **FREE** pricing tier using the  [az appservice plan create](/cli/azure/appservice/plan#create) CLI command. The appservice plan defines the physical resources used to host your apps. All applications assigned to an appservice plan share these resources, allowing you to save cost when hosting multiple apps.
2. Create a Web App. You can either use the [Azure portal](/azure/app-service-web/web-sites-configure) or use the following Az CLI command:
```azurecli-interactive	
az webapp create --name <myAppName> --resource-group <myResourceGroup> --plan <myAppServicePlan>
```

3. Make sure you set up the Java runtime configuration that your app needs. The following Azure CLI command configures the web app to run on a recent Java 8 JDK and [Apache Tomcat](http://tomcat.apache.org/) 8.0.
```azurecli-interactive
az webapp config set \
--name <myAppName> \
--resource-group <myResourceGroup> \
--java-version 1.8 \
--java-container Tomcat \
--java-container-version 8.0
```

### Set up the Jenkins job


1. Create a new **freestyle** project in Jenkins Dashboard
2. Configure **Source Code Management** to use your local fork of [Simple Java Web App for Azure](https://github.com/azure-devops/javawebappsample) by providing the **Repository URL**. For example: http://github.com/&lt;yourID>/javawebappsample.
3. Add a Build step to build the project using Maven. Do so by adding an **Execute shell**. For this example, we need an additional step to rename the *.war file in target folder to ROOT.war.   
```bash
mvn clean package
mv target/*.war target/ROOT.war
```

4. Add a post-build action by selecting **Publish an Azure Web App**.
5. Supply, "mySp", the Azure service principal stored in previous step.
6. In **App Configuration** section, choose the resource group and web app in your subscription. The plugin automatically detects whether the Web App is Windows or Linux-based. For a Windows-based Web App, the option "Publish Files" is presented.
7. Fill in the files you want to deploy (for example, a war package if you're using Java.) Source Directory and Target Directory are optional. The parameters allow you to specify source and target folders when uploading files. Java web app on Azure is run in a Tomcat server. So you upload you war package to webapps folder. For this example, set **Source Directory** to "target" and supply "webapps" for **Target Directory**.
8. If you want to deploy to a slot other than production, you can also set **Slot** Name.
9. Save the project and build it. Your web app is deployed to Azure when build is complete.

### Deploy Web App through FTP using Jenkins pipeline

The plugin is pipeline-ready. You can refer to a sample in the GitHub repo.

1. In GitHub web UI, open **Jenkinsfile_ftp_plugin** file. Click the pencil icon to edit this file to update the resource group and name of your web app on line 11 and 12 respectively.    
```java
def resourceGroup = '<myResourceGroup>'
def webAppName = '<myAppName>'
```

2. Change line 14 to update credential ID in your Jenkins instance.    
```java
withCredentials([azureServicePrincipal('<mySp>')]) {
```

### Create a Jenkins pipeline

1. Open Jenkins in a web browser, click **New Item**.
2. Provide a name for the job and select **Pipeline**. Click **OK**.
3. Click the **Pipeline** tab next.
4. For **Definition**, select **Pipeline script from SCM**.
5. For **SCM**, select **Git**. Enter the GitHub URL for your forked repo: https:&lt;your forked repo>.git
6. Update **Script Path** to "Jenkinsfile_ftp_plugin"
7. Click **Save** and run the job.

## Configure Jenkins to deploy Web App on Linux through Docker

Apart from Git/FTP, Web App on Linux supports deployment using Docker. To deploy using Docker, you need to provide a Dockerfile that packages your web app with service runtime into a docker image. Then the plugin builds the image, pushes it to a docker registry and deploys the image to your web app.

Web App on Linux also supports traditional ways like Git and FTP, but only for built-in languages (.NET Core, Node.js, PHP, and Ruby). For other languages, you need to package your application code and service runtime together into a docker image and use docker to deploy.

Before setting up the job in Jenkins, you need an Azure app service on Linux. A container registry is also needed to store and manage your private Docker container images. You can use DockerHub; we are using Azure Container Registry for this example.

* You can follow the steps [here](../app-service/containers/quickstart-nodejs.md) to create a Web App on Linux 
* Azure Container Registry is a managed [Docker registry] (https://docs.docker.com/registry/) service based on the open-source Docker Registry 2.0. Follow the steps [here] (/azure/container-registry/container-registry-get-started-azure-cli) for more guidance on how to do so. You can also use DockerHub.

### To deploy using docker:

1. Create a new freestyle project in Jenkins Dashboard.
2. Configure **Source Code Management** to use your local fork of [Simple Java Web App for Azure](https://github.com/azure-devops/javawebappsample) by providing the **Repository URL**. For example: http://github.com/&lt;yourid>/javawebappsample.
Add a Build step to build the project using Maven. Do so by adding an **Execute shell** and add the following line in **Command**:    
```bash
mvn clean package
```

3. Add a post-build action by selecting **Publish an Azure Web App**.
4. Supply, **mySp**, the Azure service principal stored in previous step as Azure Credentials.
5. In **App Configuration** section, choose the resource group and a Linux web app in your subscription.
6. Choose Publish via Docker.
7. Fill in **Dockerfile** path. You can keep the default "/Dockerfile"
For **Docker registry URL**, supply in the format of https://&lt;myRegistry>.azurecr.io if you use Azure Container Registry. Leave it blank if you use DockerHub.
8. For **Registry credentials**, add the credential for the Azure Container Registry. You can get the userid and password by running the following commands in Azure CLI. The first command enables the administrator account.    
```azurecli-interactive
az acr update -n <yourRegistry> --admin-enabled true
az acr credential show -n <yourRegistry>
```

9. The docker image name and tag in **Advanced** tab are optional. By default, image name is obtained from the image name you configured in Azure portal (in Docker Container setting.) The tag is generated from $BUILD_NUMBER. Make sure you specify the image name in either Azure portal or supply a value for **Docker Image** in **Advanced** tab. For this example, supply "&lt;yourRegistry>.azurecr.io/calculator" for **Docker image** and leave **Docker Image Tag** blank.
10. Note deployment fails if you use built-in Docker image setting. Make sure you change docker config to use custom image in Docker Container setting in Azure portal. For built-in image, use file upload approach to deploy.
11. Similar to file upload approach, you can choose a different slot other than production.
12. Save and build the project. You see your container image is pushed to your registry and web app is deployed.

### Deploy to Web App on Linux through Docker using Jenkins pipeline

1. In GitHub web UI, open **Jenkinsfile_container_plugin** file. Click the pencil icon to edit this file to update the resource group and name of your web app on line 11 and 12 respectively.    
```java
def resourceGroup = '<myResourceGroup>'
def webAppName = '<myAppName>'
```

2. Change line 13 to your container registry server    
```java
def registryServer = '<registryURL>'
```    

3. Change line 16 to update credential ID in your Jenkins instance    
```java
azureWebAppPublish azureCredentialsId: '<mySp>', publishType: 'docker', resourceGroup: resourceGroup, appName: webAppName, dockerImageName: imageName, dockerImageTag: imageTag, dockerRegistryEndpoint: [credentialsId: 'acr', url: "http://$registryServer"]
```    
### Create Jenkins pipeline    

1. Open Jenkins in a web browser, click **New Item**.
2. Provide a name for the job and select **Pipeline**. Click **OK**.
3. Click the **Pipeline** tab next.
4. For **Definition**, select **Pipeline script from SCM**.
5. For **SCM**, select **Git**.
6. Enter the GitHub URL for your forked repo: https:&lt;your forked repo>.git</li>
7, Update **Script Path** to "Jenkinsfile_container_plugin"
8. Click **Save** and run the job.

## Verify your web app

1. To verify the WAR file is deployed successfully to your web app. Open a web browser.
2. Go to http://&lt;app_name>.azurewebsites.net/api/calculator/ping
You see:    
        Welcome to Java Web App!!! This is updated!
        Sun Jun 17 16:39:10 UTC 2017
3. Go to http://&lt;app_name>.azurewebsites.net/api/calculator/add?x=&lt;x>&y=&lt;y> (substitute &lt;x> and &lt;y> with any numbers) to get the sum of x and y        
	![Calculator: add](./media/execute-cli-jenkins-pipeline/calculator-add.png)

### For App service on Linux

* To verify, in Azure CLI, run:

    ```
    az acr repository list -n <myRegistry> -o json
    ```

    You get the following result:
    
    ```
    [
    "calculator"
    ]
    ```
    
    Go to http://&lt;app_name>.azurewebsites.net/api/calculator/ping. You see the message: 
    
        Welcome to Java Web App!!! This is updated!
        Sun Jul 09 16:39:10 UTC 2017

    Go to http://&lt;app_name>.azurewebsites.net/api/calculator/add?x=&lt;x>&y=&lt;y> (substitute &lt;x> and &lt;y> with any numbers) to get the sum of x and y
    
## Next steps

In this tutorial, you use the Azure App Service plugin to deploy to Azure.

You learned how to:

> [!div class="checklist"]
> * Configure Jenkins to deploy Azure App Service through FTP 
> * Configure Jenkins to deploy to Azure App Service on Linux through Docker 