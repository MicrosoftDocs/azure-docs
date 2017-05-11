---
title: Create a CI/CD pipeline in Azure with Team Services | Microsoft Docs
description: Learn how to create a Team Services pipeline for continuous integration and delivery that deploys a web app to IIS on a Windows VM
services: virtual-machines-windows
documentationcenter: virtual-machines
author: iainfoulds
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 05/09/2017
ms.author: iainfou
---

# Create a continuous integration pipeline with Visual Studio Team Services and IIS
To automate the build and test phase of application development, you can use a continuous integration and deployment (CI/CD) pipeline. In this tutorial, you create a CI/CD pipeline using Visual Studio Team Services and a Windows virtual machine (VM) in Azure that runs IIS. You learn how to:

> [!div class="checklist"]
> * Publish an ASP.NET web application to a Team Services project
> * Create a build definition that is triggered by code commits
> * Install and configure IIS on a virtual machine in Azure
> * Add the IIS instance to a deployment group in Team Services
> * Create a release definition to publish new web deploy packages to IIS
> * Test the CI/CD pipeline

This tutorial requires the Azure PowerShell module version 3.6 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps).

## Create project in Team Services
To manage the code commit process, build definitions, and release definitions, create a project in Team Services as follows:

1. Open your Team Services dashboard in a web browser and click **New project**.
2. Enter *myWebApp* for the **Project name**. Leave all other default values to use *Git* version control and *Agile* work item process.
3. Select the option to **Share with** *Team Members*, then click **Create**.
5. Once your project has been created, select the option to **Initialize with a README or gitignore**, then click **Initialize**.
6. Inside your new project, select **Dashboards** across the top, then click **Open in Visual Studio**.


## Create ASP.NET web application
In the previous step, you created a project in Team Services. The final step opens your new project in Visual Studio. You manage your code and commits in the **Team Explorer** window. Create a local copy of your new project, then create an ASP.NET web application from a template as follows:

1. Click **Clone** to create a local git repo of your Team Services project.
    
    ![Clone repo from Team Services project](media/tutorial-vsts-iis-cicd/clone_repo.png)

2. Under **Solutions**, click **New**.

    ![Create web application solution](media/tutorial-vsts-iis-cicd/new_solution.png)

3. Select **Web** templates, and then choose the **ASP.NET Web Application** template.
    1. Enter a name for your application, such as *myWebApp*, and uncheck the box for **Create directory for solution**.
    2. If the option is available, uncheck the box to **Add Application Insights to project**. Application Insights requires you to authorize your web application with Azure Application Insights. To keep it simple in this tutorial, skip this process.
    3. Click **OK**.
4. Select **MVC** from the template list.
    1. Click **Change Authentication**, select **No Authentication**, then click **OK**.
    2. Click **OK** to create your solution.
5. In the **Team Explorer** window, click **Changes**.

    ![Commit local changes to Team Services git repo](media/tutorial-vsts-iis-cicd/commit_changes.png)

6. In the commit text box, enter *Initial commit*. Select **Commit All and Sync** from the drop-down menu.


## Create build definition
In Team Services, you use a build definition to outline how your application should be built. In this tutorial, we create a basic definition that takes our source code, builds the solution, then creates web deploy package we can use to run the web app on an IIS server.

1. Within your Team Services project, click **Build & Release** across the top, then select **Builds**.
3. Click **+ New definition**.
4. Select the **ASP.NET (PREVIEW)** template and click **Apply**.
5. Leave all the default task values. Under **Get sources**, ensure that the *myWebApp* repository and *master* branch are selected.

    ![Create build definition in Team Services project](media/tutorial-vsts-iis-cicd/create_build_definition.png)

6. On the **Triggers** tab, click the slider for **Enable this trigger** to *Enabled*.
7. Save the build definition and queue a new build by selecting the **Save & queue** , then **Save & queue** again. Leave the defaults and click **Queue**.

Watch as the build is scheduled on a hosted agent, then begins to build.

![Successful build of Team Services project](media/tutorial-vsts-iis-cicd/successful_build.png)


## Create virtual machine
Create a Windows Server 2016 VM using [this script sample](../scripts/virtual-machines-windows-powershell-sample-create-vm.md?toc=%2fpowershell%2fmodule%2ftoc.json). It takes a few minutes for the script to run and create the VM. Once the VM has been created, open port 80 for web traffic:

```powershell
Get-AzureRmNetworkSecurityGroup `
  -ResourceGroupName $resourceGroup `
  -Name "myNetworkSecurityGroup" | `
Add-AzureRmNetworkSecurityRuleConfig `
  -Name "myNetworkSecurityGroupRuleWeb" `
  -Protocol "Tcp" `
  -Direction "Inbound" `
  -Priority "1001" `
  -SourceAddressPrefix "*" `
  -SourcePortRange "*" `
  -DestinationAddressPrefix "*" `
  -DestinationPortRange "80" `
  -Access "Allow" | `
Set-AzureRmNetworkSecurityGroup
```

Obtain the public IP address of your VM:

```powershell
Get-AzureRmPublicIpAddress -ResourceGroupName $resourceGroup | Select IpAddress
```

Create a remote desktop session to your VM:

```cmd
mstsc /v:<publicIpAddress>
```

Open an **Administrator PowerShell** command prompt. Install IIS and required .NET features as follows:

```powershell
Install-WindowsFeature Web-Server,Web-Asp-Net45,NET-Framework-Features
```


## Create Team Services deployment group
To push out the web deploy package to the IIS server, you define a deployment group in Team Services. This group allows you to specify which servers are the target of new builds as you commit code to Team Services.

1. In Team Services, click **Build & Release** and then **Deployment groups**.
2. Click **Add Deployment group**.
3. Enter a name for the group, such as *myIIS*, then click **Create**.
4. In the **Register machines** section, ensure *Windows* is selected, then click the checkbox to **Use a personal access token in the script for authentication**.
5. Click **Copy script to clipboard**.


### Add IIS VM to the deployment group
With the deployment group created, you add each IIS instance to the group. Team Services generates a script that downloads and configures a build agent on the VM that receives new web deploy packages then applies it to IIS.

1. Back in your **Administrator PowerShell** session on your VM, paste and run the script copied from Team Services.
2. When prompted to configure tags for the agent, press *Y* and enter *web*.
3. When prompted for the user account, press *Return* to accept the defaults.
4. Wait for the script to finish with a message *Service vstsagent.account.computername started successfully*.
5. In the **Deployment groups** page of the **Build & Release** menu, open the *myIIS* deployment group. On the **Machines** tab, verify that your VM is listed.

    ![VM successfully added to Team Services deployment group](media/tutorial-vsts-iis-cicd/deployment_group.png)


## Create release definition
To publish your builds, you create a release definition in Team Services. This definition is triggered automatically by a successful build of your application. You select the deployment group to push your web deploy package to, and define the appropriate IIS settings.

1. Click **Build & Release**, then select **Builds**. Select the build definition created in a previous step.
2. Under **Recently completed**, select the most recent build, then click **Release**.
3. Click **Yes** to create a release definition.
4. Select the **Empty** template, then click **Next**.
5. Verify the project and source build definition are populated with your project.
6. Select the **Continuous deployment** check box, then click **Create**.
7. Click the drop-down box next to **+ Add tasks** and select *Add a deployment group phase*.
    
    ![Add task to release definition in Team Services](media/tutorial-vsts-iis-cicd/add_release_task.png)
8. Click **Add** next to **IIS Web App Deploy(Preview)**, then click **Close**.
9. Click the **Run on deployment group** parent task.
    1. For **Deployment Group**, select the deployment group you created earlier, such as *myIIS*.
    2. In the **Machine tags** box, click **Add** and select the *web* tag.
    
    ![Release definition deployment group task for IIS](media/tutorial-vsts-iis-cicd/release_definition_iis.png)
 
11. Click the **Deploy: IIS Web App Deploy** task to configure your IIS instance settings as follows:
    1. For **Website Name**, enter *Default Web Site*. If you created a different website on the IIS servers, use that name instead.
    2. Leave all the other default settings.
12. Click **Save**, then click **OK** twice.


## Create release and publish
You can now push your web deploy package as a new release. This step reaches out to the build agent on each instance that is part of the deployment group, pushes the web deploy package, then configures IIS to run the updated web application.

1. In your release definition, click **+ Release**, then click **Create Release**.
2. Verify that the latest build is selected in the drop-down list, along with **Automated deployment: After release creation**. Click **Create**.
3. A small banner appears across the top of your release definition, such as *Release 'Release-1' has been created*. Click the release link.
4. Open the **Logs** tab to watch the release progress.
    
    ![Successful Team Services release and web deploy package push](media/tutorial-vsts-iis-cicd/successful_release.png)

5. After the release is complete, open a web browser and enter the public IIP address of your VM. Your ASP.NET web application is running.

    ![ASP.NET web app running on IIS VM](media/tutorial-vsts-iis-cicd/running_web_app.png)


## Test the whole CI/CD pipeline
With your web application running on IIS, now try the whole CI/CD pipeline. After you make a change in Visual Studio and commit your code, a build is triggered which then triggers a release of your updated web deploy package to IIS.

1. In Visual Studio, open the **Solution Explorer** window.
2. Navigate to and open *myWebApp | Views | Home | Index.cshtml*
3. Edit line 6 to read:

    `<h1>ASP.NET with VSTS and CI/CD!</h1>`

4. Save the file.
5. Open the **Team Explorer** window, select the *myWebApp* project, then click **Changes**.
6. Enter a commit message, such as *Testing CI/CD pipeline*, then select **Commit All and Sync** from the drop-down menu.
7. In Team Services workspace, a new build is triggered from the code commit. 
    - Click **Build & Release**, then **Builds**. 
    - Select your build definition, then click the **Queued & running** build to watch as the build progresses.
9. Once the build is successful, a new release is triggered.
    - Click **Build & Release**, then **Releases** to see the web deploy package pushed to your IIS VM. 
    - Click the **Refresh** icon to update the status. When the *Environments* column shows a green check mark, the release has successfully deployed to IIS.
11. To see your changes applied, refresh your IIS website in a browser.

    ![ASP.NET web app running on IIS VM from CI/CD pipeline](media/tutorial-vsts-iis-cicd/running_web_app_cicd.png)


## Next steps

In this tutorial, you created an ASP.NET web application in Team Services and configured build and release definitions to deploy new web deploy packages to IIS on each code commit. You learned how to:

> [!div class="checklist"]
> * Publish an ASP.NET web application to a Team Services project
> * Create a build definition that is triggered by code commits
> * Install and configure IIS on a virtual machine in Azure
> * Add the IIS instance to a deployment group in Team Services
> * Create a release definition to publish new web deploy packages to IIS
> * Test the CI/CD pipeline

Follow this link to see pre-built virtual machine script samples.

> [!div class="nextstepaction"]
> [Windows virtual machine script samples](./powershell-samples.md)