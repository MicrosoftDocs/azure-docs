---
title: Tutorial - Deploy Java web apps from GitHub to Azure with Jenkins
description: Set up continuous integration (CI) and continuous deployment (CD) in Jenkins for Java web apps from GitHub to Azure App Service
services: jenkins
ms.service: jenkins
keywords: jenkins, azure, devops, app service, continuous integration, ci, continuous deployment, cd
author: tomarcher
ms.author: tarcher
manager: jeconnoc
ms.topic: tutorial
ms.date: 11/01/2018
---

# Tutorial: Deploy Java web apps from GitHub to Azure with Jenkins through continuous integration and deployment

This tutorial shows how to set up continuous integration and deployment 
(CI/CD) in Jenkins so you can deploy a sample Java web app from GitHub to 
[Azure App Service Web Apps on Linux](/azure/app-service/containers/app-service-linux-intro), 
and keep that app updated when new commits get pushed in GitHub. 
The sample web app in this tutorial was developed by using the 
[Spring Boot](http://projects.spring.io/spring-boot/) framework. 

In this tutorial, you'll complete these tasks:

> [!div class="checklist"]
> * Install and set up the Azure App Service Jenkins 
> plug-ins so you can deploy to Azure App Service.
> * Create an Azure service principal for authentication 
> so you don't have to sign in with your user name and password.
> * Define a Jenkins pipeline job that builds your web app from a GitHub repo when a new commit is pushed.
> * Deploy the sample app to Azure App Service with a manual build.
> * Trigger a Jenkins build and update the web app by pushing changes to GitHub.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete this tutorial, you need these items:

* A [Jenkins](https://jenkins.io/) server with the Java Development Kit (JDK) 
and Maven tools installed on an Azure Linux VM

  If you don't have a Jenkins server, 
  complete these steps now in the Azure portal: 
  [Create Jenkins server on an Azure Linux VM](/azure/jenkins/install-jenkins-solution-template)

* A [GitHub](https://github.com) account

* [Azure CLI](/cli/azure), working either from your local command 
line or [Azure Cloud Shell](/azure/cloud-shell/overview)

## Install Jenkins plug-ins

1. From your web browser, sign in to your Jenkins web console at this location:

   `https://<your-Jenkins-server>.<Azure-region>.cloudapp.azure.com`

1. From the Jenkins home menu, select **Manage Jenkins** > **Manage Plugins**.

   ![Manage Jenkins plug-ins](media/jenkins-java-quickstart/manage-jenkins-plugins.png)

1. On the **Available** tab, select these plug-ins:

   - [Azure App Service](https://plugins.jenkins.io/azure-app-service)
   - [GitHub Branch Source](https://plugins.jenkins.io/github-branch-source)
   - Jenkins [Environment Injector Plugin](https://plugins.jenkins.io/envinject)

   If these plug-ins don't appear, make sure they're not 
   already installed by checking the **Installed** tab.

1. To install your selected plug-ins, choose 
**Download now and install after restart**.

1. After you're done, on the Jenkins menu, select **Manage Jenkins** 
so you can return to the Jenkins management page.

## Set up Jenkins for GitHub

To have Jenkins monitor and get [events from GitHub](https://developer.github.com/webhooks/) 
when new commits for your web app are pushed to your local GitHub repo, 
enable webhooks for GitHub in Jenkins.

1. In Jenkins, on the **Manage Jenkins** page, select **Configure System**. 

   ![Configure system](media/jenkins-java-quickstart/manage-jenkins-configure-system.png)

1. In **GitHub** section, provide details for your GitHub server, 
if you haven't already. Choose **Add GitHub Server**, and select **GitHub Server**. 

   ![Add GitHub server](media/jenkins-java-quickstart/add-GitHub-server.png)

1. If the **Manage hooks** property isn't selected, select this property. 
Choose **Advanced** so you can specify other settings. 

   ![Choose "Advanced" for more settings](media/jenkins-java-quickstart/advanced-GitHub-settings.png)

1. Choose **Manage additional GitHub actions**, 
and select **Convert login and password to token**.

   ![Choose "Manage additional GitHub actions"](media/jenkins-java-quickstart/manage-additional-actions.png)

1. Select **From login and password**, 
enter your GitHub username and password, 
and choose **Create token credentials**, 
which creates a [GitHub Personal Access Token (PAT)](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/).   

   ![Create GitHub PAT from login and password](media/jenkins-java-quickstart/create-github-token-credentials.png)

1. In the **GitHub Server** section, open the **Credentials** list, 
and select your new token. Check that authentication is working 
by choosing **Test connection**.

   ![Check connection to GitHub server with new PAT](media/jenkins-java-quickstart/check-github-connection.png)

> [!NOTE]
> 
> If your GitHub account has two-factor authentication enabled, 
> create your token on GitHub and set up Jenkins to use that token. 
> For more information, see the documentation for the 
> [Jenkins GitHub plug-in](https://wiki.jenkins.io/display/JENKINS/Github+Plugin).

## Create service principal

In a later section, you'll create a pipeline job in Jenkins for building your app. 
To authenticate running the pipeline job from a script, create an 
[Azure Active Directory service principal](azure/active-directory/develop/app-objects-and-service-principals). 
A service principal is an identity you can assign specific permissions and 
use for accessing Azure resources without using your own credentials. 
To create the service principal, run the Azure CLI 
[**az ad sp create-for-rbac**](cli/azure/create-an-azure-service-principal-azure-cli) 
command, either from your local command line or Azure Cloud Shell:

```azurecli-interactive
az ad sp create-for-rbac --name your-service-principal-ID --password your-secure-password
```

```json
{
   "appId": "<web-app-client-ID>",
   "displayName": "<your-service-principal-ID>",
   "name": "http://<your-service-prinicipal-ID>",
   "password": "<your-secure-password>",
   "tenant": "<Azure-Active-Directory-tenant-ID>"
}
```

## Fork sample repo and create pipeline job 

Now create your working copy, or fork, for the GitHub repo that has the sample Java 
web app. You'll then create the pipeline job in Jenkins for building that app.

1. Go to the [GitHub repo for the Spring Boot sample app](https://github.com/spring-guides/gs-spring-boot). 
To fork the repo to your GitHub account, choose **Fork** in the upper-right corner.

   ![Fork sample repo from GitHub](media/jenkins-java-quickstart/fork-github-repo.png)

1. Return to your Jenkins home page, and select **New Item**. 

   ![Select "New Item"](media/jenkins-java-quickstart/jenkins-select-new-item.png)

1. Provide a name for your pipeline job, for example, 
"My-Java-Web-App-pipeline", and select **Pipeline**. 
At the bottom, choose **OK**.   

   ![Select "Pipeline"](media/jenkins-java-quickstart/jenkins-select-pipeline.png)

1. On the **General** tab, select **Prepare an environment for the run**. 

   ![Select "Prepare an environment for the run"](media/jenkins-java-quickstart/prepare-environment-for-run.png)

   Next, set up Jenkins with your service principal so you can 
   run the pipeline job and deploy to Azure by using a script.

1. In the **Properties Content** box that appears, 
add these environment variables:

   ```text
   AZURE_CRED_ID=<your-Azure-service-principal-ID>
   RES_GROUP=<Azure-resource-group-name>
   WEB_APP=<your-Java-web-app-name>
   ```

1. When you're done, choose **Save**.

## Create build config and script files

1. In your local repo's `src/main/resources/` folder, 
create a file named `web.config` that contains this XML 
but replaces `$(JAR_FILE_NAME)` with `gs-spring-boot-0.1.0.jar`:

   ```xml
   <?xml version="1.0" encoding="UTF-8">
   <configuration>
      <system.webServer>
         <handlers>
            <add name="httpPlatformHandler" path="*" verb="*" modules="httpPlatformHandler" resourceType="Unspecified" />
         </handlers>
         <httpPlatform processPath="%JAVA_HOME%\bin\java.exe"
        arguments="-Djava.net.preferIPv4Stack=true -Dserver.port=%HTTP_PLATFORM_PORT% -jar &quot;%HOME%\site\wwwroot\${JAR_FILE_NAME}&quot;"></httpPlatform>
      </system.webServer>
   </configuration>
   ```

1. In your local repo's root folder, create a script 
file named `Jenkinsfile` that contains this text 
([source in GitHub here](https://github.com/Microsoft/todo-app-java-on-azure/blob/master/doc/resources/jenkins/Jenkinsfile-webapp-se)):

   ```text  
   node {
      stage('init') {
         checkout scm
      }
      stage('build') {
         sh '''
            mvn clean package
            cd target
            cp ../src/main/resources/web.config web.config
            cp todo-app-java-on-azure-1.0-SNAPSHOT.jar app.jar 
            zip todo.zip app.jar web.config
         '''
      }
      stage('deploy') {
         azureWebAppPublish azureCredentialsId: env.AZURE_CRED_ID,
         resourceGroup: env.RES_GROUP, appName: env.WEB_APP, filePath: "**/todo.zip"
      }
   }
   ```

1. Commit both `web.config` and `Jenkinsfile` to your local repo, 
and push your changes.

1. From your Jenkins home page, select your previously created pipeline job. 

   ![Select pipeline job for your web app](media/jenkins-java-quickstart/select-pipeline-job.png)

1. On the left menu, select **Configure**.

1. On the **Pipeline** tab, from the **Definition** list, 
select **Pipeline script from SCM**.

   1. After the **SCM** box appears, 
   select **Git** as your source control. 

   1. In the **Repositories** section, for **Repository URL**, 
   enter the URL for your GitHub fork location, for example: 

      `https://github.com/<your-GitHub-username>/gs-spring-boot`

   1. For **Credentials**, select your service principal ID.

   1. In the **Script Path** box, 
   add the path to your "Jenkinsfile" script.

   1. When you're done, choose **Save**.

1. To test your pipeline job, return to your pipeline job's main page in Jenkins, 
and select **Build Now**.

   ![Test build your app](media/jenkins-java-quickstart/test-build-project.png)

## Set up deployment to Azure

By using the Azure CLI, either from the command line or Azure Cloud Shell, create an 
[App Service Web App on Linux](/azure/app-service/containers/app-service-linux-intro) 
so you can deploy your Java web app to Azure. Make sure you use a unique name for 
your own app.
   
```azurecli-interactive
az group create --name your-Jenkins-resource-group-name --location your-Azure-region
az appservice plan create --is-linux --name your-Linux-App-Service-Plan --resource-group your-Jenkins-resource-group-name 
az webapp create --name your-Java-web-app-name --resource-group your-Jenkins-resource-group-name --plan your-Linux-App-Service-Plan --runtime "java|1.8|Tomcat|8.5"
```

## Deploy to Azure

1. In Jenkins, select your pipeline job, and then select **Build Now**.

1. After the build finishes, your app is deployed and running live on 
Azure at the publication URL, for example: 

   `http://your-java-web-app-name.azurewebsites.net`

   ![View your deployed app on Azure](media/jenkins-java-quickstart/greeetings-unedited.png)

## Push changes and redeploy

1. In your web browser, go to this location in your GitHub fork:

   `complete/src/main/java/Hello/Application.java`
   
1. From the upper-right corner in GitHub, choose **Edit this file**.

1. Make this change to the `commandLineRunner()` method, 
and commit the change to the repo's `master` branch.
   
   ```java
   System.out.println("Let's inspect the beans provided by Spring Boot on Azure");
   ```

   This commit in the `master` branch starts a build in Jenkins. 
   When the build finishes, reload your app in Azure.     

   ![View your deployed app on Azure](media/jenkins-java-quickstart/greeetings-edited.png)

## Troubleshoot Jenkins plug-ins

If you find any bugs with the Jenkins plug-ins, 
open an issue for that specific component in the 
[Jenkins JIRA](https://issues.jenkins-ci.org/).

## Next steps

> [!div class="nextstepaction"]
> [Use Azure VMs as build agents](/azure/jenkins/jenkins-azure-vm-agents)