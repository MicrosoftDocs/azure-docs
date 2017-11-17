---
title: CI/CD from Jenkins to Azure VMs with VSTS | Microsoft Docs
description: Set up continuous integration (CI) and continuous deployment (CD) of a Node.js app using Jenkins to Azure VMs from Release Management in Visual Studio Team Services (VSTS) or Microsoft Team Foundation Server (TFS)
author: ahomer
manager: douge
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 10/19/2017
ms.author: ahomer
ms.custom: mvc
---

# Deploy your app to Linux VMs using Jenkins and VSTS

Continuous integration (CI) and continuous deployment (CD) is a pipeline by which you can build, release, and deploy your code. Visual Studio Team Services (VSTS) provides a complete, fully featured set of CI/CD automation tools for deployment to Azure. Jenkins is a popular 3rd-party CI/CD server-based tool that also provides CI/CD automation. You can use both together to customize how you deliver your cloud app or service.

In this tutorial, you use Jenkins to build a **Node.js web app**, and VSTS or Team Foundation Server (TFS) to deploy it
to a [deployment group](https://www.visualstudio.com/docs/build/concepts/definitions/release/deployment-groups/) containing Linux virtual machines.

You will:

> [!div class="checklist"]
> * Get the sample app
> * Configure Jenkins plugins
> * Configure a Jenkins Freestyle project for Node.js
> * Configure Jenkins for VSTS integration
> * Create a Jenkins service endpoint
> * Create a deployment group for the Azure virtual machines
> * Create a VSTS release definition
> * Execute manual and CI triggered deployments

## Before you begin

* You need access to a Jenkins server. If you have not yet created a Jenkins server,
  see [Create a Jenkins master on an Azure Virtual Machine](https://docs.microsoft.com/en-us/azure/jenkins/install-jenkins-solution-template). 

* Sign in to your VSTS account (`https://{youraccount}.visualstudio.com`). 
  You can get a [free VSTS account](https://go.microsoft.com/fwlink/?LinkId=307137&clcid=0x409&wt.mc_id=o~msft~vscom~home-vsts-hero~27308&campaign=o~msft~vscom~home-vsts-hero~27308).

  > [!NOTE]
  > For more information, see [Connect to VSTS](https://www.visualstudio.com/docs/setup-admin/team-services/connect-to-visual-studio-team-services).

*  You need a Linux virtual machine for a deployment target.  For more information, see [Create and Manage Linux VMs with the Azure CLI](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/tutorial-manage-vm).

*  Open inbound port 80 for your virtual machine.  For more information, see [Create network security groups using the Azure portal](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-networks-create-nsg-arm-pportal).

## Get the sample app

You need an app to deploy stored in a Git repository.
For this tutorial, we recommend you use [this sample app available from
GitHub](https://github.com/azooinmyluggage/fabrikam-node).  This tutorial contains a sample script used for installing Node.js and an application.  If you want to work with your own repository, you should configure a similar sample.

1. Create a fork of this app and take note of the location (URL) for use in later steps of this tutorial.  For more information, see [Fork a repo](https://help.github.com/articles/fork-a-repo/)    

> [!NOTE]
> The app was built using [Yeoman](http://yeoman.io/learning/index.html);
> it uses **Express**, **bower**, and **grunt**; and it has some **npm** packages as dependencies.
> The sample also contains a script that sets up Nginx and deploys the app. It is executed on the virtual machines. 
> Specifically, the script installs Node, Nginx, and PM2; configures Nginx and PM2; then starts the Node app.

## Configure Jenkins plugins

First, you must configure two Jenkins plugins for **NodeJS** and **VS Team Services Continuous Deployment**.

1. Open your Jenkins account and choose **Manage Jenkins**.
2. In the **Manage Jenkins** page, choose **Manage Plugins**.
3. Filter the list to locate the **NodeJS** plugin and choose the **Install without restart** option.
    ![Adding the NodeJS plugin to Jenkins](media/tutorial-build-deploy-jenkins/jenkins-nodejs-plugin.png)
4. Filter the list to find the **VS Team Services Continuous Deployment** plugin and choose the **Install without restart** option.
5. Navigate back to the Jenkins dashboard and choose **Manage Jenkins**.
6. Choose **Global Tool Configuration**.  Find **NodeJS** and click **NodeJS installations**.
7. Enable the **Install automatically** option, and then enter a **Name** value.
8. Click **Save**.

## Configure a Jenkins Freestyle project for Node.js

1. Click **New Item**.  Enter an **item name**.
2. Choose **Freestyle project**.  Click **OK**.
3. In the **Source Code Management** tab, select **Git** and enter the details
   of the repository and the branch containing your app code.    
    ![Add a repo to your build](media/tutorial-build-deploy-jenkins/jenkins-git.png)
4. In the **Build Triggers** tab, select **Poll SCM** and enter the schedule `H/03 * * * *`
   to poll the Git repository for changes every three minutes. 
5. In the **Build Environment** tab, select **Provide Node &amp; npm bin/ folder PATH**
   and select the **NodeJS Installation** value. Leave **npmrc file** set to
   "use system default."
6. In the **Build** tab, choose **Execute shell** and enter the command `npm install` to ensure all dependencies are updated.


## Configure Jenkins for VSTS integration

1.  Create a personal access token (PAT) in your VSTS account if you don't already have one. Jenkins requires this information to access your VSTS account.  Ensure you **store** the token information for upcoming steps in this section.
  Read [How do I create a personal access token for VSTS and TFS](https://www.visualstudio.com/docs/setup-admin/team-services/use-personal-access-tokens-to-authenticate) to learn how to generate one.
2. In the **Post-build Actions** tab, click **Add post-build action**. Choose **Archive the artifacts**.
3. For **Files to archive**, enter `**/*` to include all files.
4. To create another action, click **Add post-build action**.
5. Choose **Trigger release in TFS/Team Services**, enter the uri for your VSTS account such as:
	 `https://{your-account-name}.visualstudio.com`.
6. Enter the **Team Project** name.
7. Choose a name for the **release definition** (you create this release definition later in VSTS).
8. Choose credentials to connect to your VSTS or TFS environment.  Leave the **Username** blank if you are using VSTS.
   You need your user name and the PAT you created earlier for VSTS.  Enter a **Username and Password** if you are using an on-premise version of TFS.    
    ![Configuring Jenkins Post-build Actions](media/tutorial-build-deploy-jenkins/trigger-release-from-jenkins.png)
5. **Save** the jenkins project.

## Create a Jenkins service endpoint

A service endpoint allows VSTS to connect to Jenkins.

1. Open the **Services** page in VSTS, open the **New Service Endpoint** list, and choose **Jenkins**.
    ![Add a Jenkins endpoint](media/tutorial-build-deploy-jenkins/add-jenkins-endpoint.png)
2. Enter a name for the connection.
3. Enter the URL of your Jenkins server, and tick the **Accept untrusted SSL certificates** option.  An example URL is:
 	`http://{YourJenkinsURL}.westcentralus.cloudapp.azure.com`
4. Enter the **user name and password** for your Jenkins account.
5. Choose **Verify connection** to check that the information is correct.
6. Choose **OK** to create the service endpoint.

## Create a deployment group for Azure Virtual Machines

You need a [deployment group](https://www.visualstudio.com/docs/build/concepts/definitions/release/deployment-groups/) to register the VSTS agent so the release definition can deploy to your virtual machine.  Deployment groups make it easy to define logical groups of target machines for deployment, and install the required agent on each machine.

1. Open the **Releases** tab of the **Build &amp; Release** hub, then
   open **Deployment groups**, and choose **+ New**.
2. Enter a name for the deployment group, and an optional description.
   Then choose **Create**.
3. Choose the operating system for your deployment target virtual machine.  For example, choose **Ubuntu 16.04+**.
4. Tick the **Use a personal access token in the script for authentication**.
5. Check the **System prerequisites**.
6. **Copy** the script.
7. **Log in** to your deployment target virtual machine and **execute** the script with **sudo** privileges.
8. After the installation, you are prompted for deployment group tags.  Accept the defaults.
9. In VSTS, check for your newly registered virtual machine in **Targets** under **Deployment Groups**.

## Create a VSTS release definition

A release definition specifies the process VSTS executes to deploy the app.  In this example, we execute a shell script.

To create the release definition in VSTS:

1. Open the **Releases** on the **Build &amp; Release** hub, and choose **Create release definition**. 
2. Select the **Empty** template by choosing start with an **Empty process**.
3. In the **Artifacts** section, click on **+ Add Artifact** and choose **Jenkins** for **Source type**. Select your Jenkins service endpoint connection. Then select the Jenkins source job and choose **Add**.
4.  Click the ellipsis next to **Environment 1**.  Click **Add deployment group phase**.
5.  Choose your **Deployment group**.
5. Click **+** to add a task to the **Deployment group phase**.
6. Choose the **Shell Script** task and click **Add**.    
	The **Shell Script** task is used to provide the configuration for a script to run on each server to install Node.js and start the app. Configure it as follows:
8. **Script Path**:     
	`$(System.DefaultWorkingDirectory)/Fabrikam-Node/deployscript.sh`
9.  Click **Advanced**, and then enable **Specify Working Directory**.
10.  **Working Directory**: `$(System.DefaultWorkingDirectory)/Fabrikam-Node`
11. Edit the name of the release definition to the name you specified in the
   **Post-build Actions** tab of the build in Jenkins. Jenkins requires this name
   to be able to trigger a new release when the source artifacts are updated.
12. Click **Save**, and click **OK** to save the release definition.

## Execute manual and CI triggered deployments

1. Choose **+ Release** and select **Create Release**.
2. Select the build you completed in the highlighted drop-down list and choose **Queue**.
3. Choose the release link in the popup message. For example: "Release **Release-1** has been created."
4. Open the **Logs** tab to watch the release console output.
5. In your browser, open the URL of one of the servers you added to your deployment group. For example, enter `http://{your-server-ip-address}`
6. Go to the source Git repository and modify the contents of the **h1** heading in the file app/views/index.jade with some changed text.
7. **Commit** your change.
8. After a few minutes, you will see a new release created in the **Releases** 
   page of VSTS or TFS. Open the release to see the deployment taking place. Congratulations!

## Next Steps

In this tutorial, you automated the deployment of an app to Azure using Jenkins build and VSTS for release. You learned how to:

> [!div class="checklist"]
> * Build your app in Jenkins
> * Configure Jenkins for VSTS integration
> * Create a deployment group for the Azure virtual machines
> * Create a release definition that configures the VMs and deploys the app

Advance to the next tutorial to learn more about how to deploy a LAMP (Linux, Apache, MySQL, and PHP) stack.

> [!div class="nextstepaction"]
> [Deploy LAMP stack](tutorial-lamp-stack.md)