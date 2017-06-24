---
title: CI/CD from Jenkins to Azure VMs | Microsoft Docs
description: Set up continuous integration (CI) and continuous deployment (CD) of an app using Jenkins to Azure VMs from Release Management in Visual Studio Team Services (VSTS) or Microsoft Team Foundation Server (TFS)
author: ahomer
manager: douge
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 06/15/2017
ms.author: ahomer
ms.custom: mvc
---

# Implement continuous deployment of your app using Jenkins to Azure VMs

Continuous integration (CI) and continuous deployment (CD) is a pipeline by which you can build, release, and deploy your code. Team Services provides a complete, fully-featured set of CI/CD automation tools for deployment to Azure. Jenkins is a popular 3rd-party CI/CD server-based tool that also provides CI/CD automation. You can use both together to customize how you deliver your cloud app or service.

In this tutorial, you set up CI/CD for a Node.js app by using Jenkins to build it, and Visual Studio Team Services to deploy it to an Azure deployment group. 

You will:

> [!div class="checklist"]
> * Build your app in Jenkins
> * Configure Jenkins for CI with Team Services or TFS
> * Create a deployment group for the Azure virtual machines
> * Create a release definition that configures the VMs and deploys the app

## Before you begin

You'll need a [Team Services account](https://www.visualstudio.com/en-us/docs/setup-admin/team-services/sign-up-for-visual-studio-team-services) to start. You can get a [free Team Services account](https://go.microsoft.com/fwlink/?LinkId=307137&clcid=0x409&wt.mc_id=o~msft~vscom~home-vsts-hero~27308&campaign=o~msft~vscom~home-vsts-hero~27308) if you don't have one already.

For a quick guide on connecting to Team Services, read [Connect to Team Services](https://www.visualstudio.com/en-us/docs/setup-admin/team-services/connect-to-visual-studio-team-services).

You'll also need an app that you want to deploy stored in a Git repository. Using it, you'll configure the required plugins in Jenkins to interface with Team Services for automated deployment to Azure. This tutorial uses a sample app (provided below) that you can use as you follow along if you don't have one yet.

You can skip the next two sections if you have your own app in a Git repo.

## Get the sample app

For this tutorial, we recommend you use [this sample app available from
GitHub](https://github.com/azooinmyluggage/fabrikam-node). You can
copy this app into your own Git repository if you prefer; just take note of the new location (URL) for use in future steps.

## About the sample app

This section describes the sample app you'll use in this tutorial. You can skip to [Configure Jenkins plugins](#Configure Jenkins plugins) if you just want to keep going.

The app was built using [Yeoman](http://yeoman.io/learning/index.html);
it uses **Express**, **bower**, and **grunt**; and it has some **npm** packages as dependencies.

The sample app contains a set of
[Azure Resource Manager (ARM) templates](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-overview#template-deployment)
that are used to create the deployment group and virtual machines for deployment on Azure. These templates are used by tasks in the [Team
Services release definition](https://www.visualstudio.com/en-us/docs/build/actions/work-with-release-definitions).

The main template creates a network security group, a virtual machine, 
and a virtual network. It assigns a public IP address and opens inbound
port 80. It also adds a tag that is used by the deployment group to 
select the machines to receive the deployment.

The [Team Service parameters template]() contains the values that override settings in
the main template when the release definition processes that particular template
for each of the virtual machines.

The sample also contains a script that is executed on each of the virtual
machines after the deployment has succeeded. This script:

* Installs Node, Nginx, and PM2

* Configures Nginx and PM2, then starts the Node app

Optionally, run the following script from `bash` (or other shell) to confirm the app:

```bash
sudo apt-get update
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash - 
sudo apt-get install -y nodejs
ln -sf /usr/bin/nodejs /usr/bin/node
sudo apt-get install -y nginx
sudo rm -f /etc/nginx/sites-enabled/default
sudo cp node-app-nginx-config /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/node-app-nginx-config /etc/nginx/sites-enabled/node-app-nginx-config
sudo service nginx restart
sudo npm install -g pm2
sudo pm2 start -f app.js
sudo pm2 startup systemd
sudo pm2 save
```

## Configure Jenkins plugins

First, configure two Jenkins plugins for:
* NodeJS
* Integration with Team Services

To start the configuration, open your Jenkins account and choose **Manage Jenkins**.

In the **Manage Jenkins** page, choose **Manage Plugins**.

Filter the list to locate the the **NodeJS** plugin and install it without restart.

![Adding the NodeJS plugin to Jenkins](media/tutorial-build-deploy-jenkins/jenkins-nodejs-plugin.png)

Filter the list to find the **Team Foundation Server** plugin and install it. (This plug-in works for both Team Services and Team Foundation Server.) Restarting Jenkins is not necessary.

## Configure Jenkins build for Node.js

In Jenkins, create a new build project and configure it as follows:

In the **General** tab, enter a name for your build project.

In the **Source Code Management** tab, select **Git** and enter details
of the repository and branch containing your app code.

TODO: NEED DETAILS HERE. HELP USER FILL OUT ACCURATELY FOR THIS SAMPLE. NEEDS SCREENSHOT.

In the **Build Triggers** tab, select **Poll SCM** and enter the schedule `H/03 * * * *`
to poll the Git repository for changes every three minutes. 

In the **Build Environment** tab, select **Provide Node &amp; npm bin/ folder PATH**
and enter `NodeJS` for the Node JS Installation value. Leave **npmrc file** set to
"use system default".

In the **Build** tab, enter the command `npm install` to ensure all dependencies are updated.

## Configure Jenkins for Team Services integration

In the **Post-build Actions** tab:
 
   - For **Files to archive**, enter `**/*` to include all files.

   - For **Trigger release in TFS/Team Services**, enter the full URL of your account
     (such as `https://your-account-name.visualstudio.com`), the project name,
     the name of the release definition you will create, and the credentials to connect to your account.<p /> 

   ![Configuring Jenkins Post-build Actions](media/tutorial-build-deploy-jenkins/trigger-release-from-jenkins.png)

  > [!NOTE]
  > Do you need a personal access token (PAT)for Jenkins to access your account?
  > Read [How do I create a personal access token for Team Services and TFS?](https://www.visualstudio.com/docs/setup-admin/team-services/use-personal-access-tokens-to-authenticate.md) to learn how to generate one.

Save the build project.

## Configure Team Services

Now, you'll need to create a connection to Jenkins from Team Services so that Team Services can 
download the build artifacts and deploy them. (Build artifacts are the results of the Jenkins build, including the deployable code objects, framework libraries, and other output files.)

First, open the **Services** tab of the Team Services administration page, and add a new **Jenkins** service endpoint.

![Adding a Jenkins service endpoint](media/tutorial-build-deploy-jenkins/jenkins-service-endpoint.png)

In the **Add new Jenkins Connection** dialog, enter a name you will use to refer to the service endpoint.

Enter the URL of your Jenkins server, and the Jenkins credentials to connect to it.

Use the **Verify connection** link to check the connection, and then choose **OK**.

## Create a deployment group

Now, you need a deployment group containing the virtual machines you will deploy to.
To create a deployment group in Team Services:
 
Open the **Releases** tab of the **Build &amp; Release** hub, then
open the **Deployment groups** tab, and choose **+ New**.

Enter a name for the deployment group, and an optional description.
Then choose **Create**.

The virtual machines to populate the new deployment group will be created
by the Azure Resource Group Deployment task. You don't need to register them manually.

## Create a release definition

To create the release definition in Team Services:

Open the **Releases** tab of the **Build &amp; Release** hub, open the **+** drop-down
in the list of release definitions, and choose the **Create release definition**. 

Select the **Empty** template and choose **Next**.

In the **Artifacts** section, choose **Jenkins** and select your Jenkins service endpoint connection. Then select the Jenkins source job and choose **Create**.

In the new release definition, choose **+ Add tasks** and add an **Azure Resource Group Deployment** task to the default environment.

Choose the drop-down arrow next to the **+ Add tasks** link and add a deployment group phase to the definition.

![Adding a deployment group phase](media/tutorial-build-deploy-jenkins/deployment-group-phase-in-release-definition.png) 

In the Task catalog, open the **Utility** section and add an instance of the **Shell Script** task.

Configure the tasks as follows (see the screen below):

   > **Deployment Step 1**: Create the deployment group using an [Azure Resource Group template](https://github.com/Microsoft/vsts-tasks/tree/master/Tasks/AzureResourceGroupDeployment). 
   > Populate the Azure Resource Group template with the following:
   >
   > * **Azure Subscription:** Select a connection from the list under **Available Azure Service Connections**. 
   >
   >   If no connections appear, choose **Manage**, select **New Service Endpoint** then **Azure Resource Manager**, and follow the prompts.
   > Return to your release definition, refresh the **AzureRM Subscription** 
   >list, and select the connection you just created.
   > * **Resource group**: Enter a name of the resource group you created earlier.
   > * **Location**: Select a region for the deployment.
   > * **Template location**: `URL of the file`
   > * **Template link**: `{your-git-repo}/{branch}/ARM-Templates/UbuntuWeb1.json`
   > * **Template parameters link**: `{your-git-repo}/{branch}/ARM-Templates/UbuntuWeb1.parameters.json`
   > * **Override template parameters**: A list of the override values, for example: `-location {location} -virtualMachineName {machine] -virtualMachineSize Standard_DS1_v2 -adminUsername {username} -virtualNetworkName fabrikam-node-rg-vnet -networkInterfaceName fabrikam-node-websvr1 -networkSecurityGroupName fabrikam-node-websvr1-nsg -adminPassword $(adminpassword) -diagnosticsStorageAccountName fabrikamnodewebsvr1 -diagnosticsStorageAccountId Microsoft.Storage/storageAccounts/fabrikamnodewebsvr1 -diagnosticsStorageAccountType Standard_LRS -addressPrefix 172.16.8.0/24 -subnetName default -subnetPrefix 172.16.8.0/24 -publicIpAddressName fabrikam-node-websvr1-ip -publicIpAddressType Dynamic`
   > * **Enable prerequisites**: `Configure with Deployment Group agent`
   > * **TFS/VSTS endpoint**: Select the Jenkins service endpoint connection you created earlier.
   > * **Team project**: Select your current project.
   > * **Deployment Group**: Enter the same deployment group name as you used for the **Resource group** parameter above.

   > **Deployment Step 2**: Provide the configuration for a script to run on each server to install Node.js and start the app.
   >
   > * **Script Path**: `$(System.DefaultWorkingDirectory)/Fabrikam-Node/deployscript.sh`
   > * **Specify Working Directory**: `Checked`
   > * **Working Directory**: `$(System.DefaultWorkingDirectory)/Fabrikam-Node`
   
   The default settings for the Azure Resource Group Deployment task are to create or update a resource,
   and to do so incrementally. The task will create the VMs the first time it runs, and subsequently just update them.

Optionally, change the name of the environment by clicking on the name. 

Edit the name of the release definition to the name you specified in the
**Post-build Actions** tab of the build in Jenkins. This is necessary for 
Jenkins to be able to trigger a new release when the source artifacts are updated.

Choose **Save**, and choose **OK**.

## Start a manual deployment

Choose **+ Release** and select **Create Release**.

Select the build you just completed in the highlighted drop-down list and choose **Create**.

Choose the release link in the popup message. For example: "Release **Release-1** has been created".

Open the **Logs** tab to watch the release console output.

## View the deployed app

In your browser, open the URL of one of the servers you added to your deployment group. For example, enter
`http://{your-server-ip-address}`

## Start a CI/CD deployment

In the release definition, uncheck the **Enabled** checkbox in the **Control Options**
section of the settings for the Azure Resource Group Deployment task.
For future deployments to the existing deployment group, you do not need
to re-execute this task.

Go to your source Git repository and modify one of the application files.

After a few minutes, you will see a new release created in the **Releases** 
page of Team Services or TFS. Open the release to see the deployment taking place. Congratulations!

## Next Steps
In this tutorial, you automated the deployment of an app to Azure using Jenkins build and Team Services for release. You learned how to:

> [!div class="checklist"]
> * Build your app in Jenkins
> * Configure Jenkins for CI with Team Services or TFS
> * Create a deployment group for the Azure virtual machines
> * Create a release definition that configures the VMs and deploys the app

Follow this link to see pre-built virtual machine script samples.

> [!div class="nextstepaction"]
> [Team Services CI/CD documentation](https://www.visualstudio.com/en-us/docs/build/overview)
