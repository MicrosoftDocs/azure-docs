---
title: Tutorial - Create a CI/CD pipeline in Azure with Azure DevOps Services | Microsoft Docs
description: In this tutorial, you learn how to create a Azure DevOps Services pipeline for continuous integration and delivery that deploys a web app to IIS on a Windows VM in Azure.
services: virtual-machines-windows
documentationcenter: virtual-machines
author: cynthn
manager: jeconnoc
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 05/12/2017
ms.author: cynthn
ms.custom: mvc

#Customer intent: As a developer, I want to learn about CI/CD features in Azure so that I can use services like Azure DevOps Services to build and deploy my applications automatically.
---

# Tutorial: Create a continuous integration pipeline with Azure DevOps Services and IIS
To automate the build, test, and deployment phases of application development, you can use a continuous integration and deployment (CI/CD) pipeline. In this tutorial, you create a CI/CD pipeline using Azure DevOps Services and a Windows virtual machine (VM) in Azure that runs IIS. You learn how to:

> [!div class="checklist"]
> * Publish an ASP.NET web application to a Azure DevOps Services project
> * Create a build pipeline that is triggered by code commits
> * Install and configure IIS on a virtual machine in Azure
> * Add the IIS instance to a deployment group in Azure DevOps Services
> * Create a release pipeline to publish new web deploy packages to IIS
> * Test the CI/CD pipeline

This tutorial requires the Azure PowerShell module version 5.7.0 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps).

## Create a project in Azure DevOps Services
Azure DevOps Services allows for easy collaboration and development without maintaining an on-premises code management solution. Azure DevOps Services provides cloud code testing, build, and application insights. You can choose a version control repo and IDE that best fits your code development. For this tutorial, you can use a free organization to create a basic ASP.NET web app and CI/CD pipeline. If you do not already have a Azure DevOps Services organization, [create one](http://go.microsoft.com/fwlink/?LinkId=307137).

To manage the code commit process, build pipelines, and release pipelines, create a project in Azure DevOps Services as follows:

1. Open your Azure DevOps Services dashboard in a web browser and choose **New project**.
2. Enter *myWebApp* for the **Project name**. Leave all other default values to use *Git* version control and *Agile* work item process.
3. Choose the option to **Share with** *Team Members*, then select **Create**.
5. Once your project has been created, choose the option to **Initialize with a README or gitignore**, then **Initialize**.
6. Inside your new project, choose **Dashboards** across the top, then select **Open in Visual Studio**.


## Create ASP.NET web application
In the previous step, you created a project in Azure DevOps Services. The final step opens your new project in Visual Studio. You manage your code commits in the **Team Explorer** window. Create a local copy of your new project, then create an ASP.NET web application from a template as follows:

1. Select **Clone** to create a local git repo of your Azure DevOps Services project.
    
    ![Clone repo from Azure DevOps Services project](media/tutorial-vsts-iis-cicd/clone_repo.png)

2. Under **Solutions**, select **New**.

    ![Create web application solution](media/tutorial-vsts-iis-cicd/new_solution.png)

3. Select **Web** templates, and then choose the **ASP.NET Web Application** template.
    1. Enter a name for your application, such as *myWebApp*, and uncheck the box for **Create directory for solution**.
    2. If the option is available, uncheck the box to **Add Application Insights to project**. Application Insights requires you to authorize your web application with Azure Application Insights. To keep it simple in this tutorial, skip this process.
    3. Select **OK**.
4. Choose **MVC** from the template list.
    1. Select **Change Authentication**, choose **No Authentication**, then select **OK**.
    2. Select **OK** to create your solution.
5. In the **Team Explorer** window, choose **Changes**.

    ![Commit local changes to Azure Repos Git repo](media/tutorial-vsts-iis-cicd/commit_changes.png)

6. In the commit text box, enter a message such as *Initial commit*. Choose **Commit All and Sync** from the drop-down menu.


## Create build pipeline
In Azure DevOps Services, you use a build pipeline to outline how your application should be built. In this tutorial, we create a basic pipeline that takes our source code, builds the solution, then creates web deploy package we can use to run the web app on an IIS server.

1. In your Azure DevOps Services project, choose **Build & Release** across the top, then select **Builds**.
3. Select **+ New definition**.
4. Choose the **ASP.NET (PREVIEW)** template and select **Apply**.
5. Leave all the default task values. Under **Get sources**, ensure that the *myWebApp* repository and *master* branch are selected.

    ![Create build pipeline in Azure DevOps Services project](media/tutorial-vsts-iis-cicd/create_build_definition.png)

6. On the **Triggers** tab, move the slider for **Enable this trigger** to *Enabled*.
7. Save the build pipeline and queue a new build by selecting **Save & queue** , then **Save & queue** again. Leave the defaults and select **Queue**.

Watch as the build is scheduled on a hosted agent, then begins to build. The output is similar to the following example:

![Successful build of Azure DevOps Services project](media/tutorial-vsts-iis-cicd/successful_build.png)


## Create virtual machine
To provide a platform to run your ASP.NET web app, you need a Windows virtual machine that runs IIS. Azure DevOps Services uses an agent to interact with the IIS instance as you commit code and builds are triggered.

Create a Windows Server 2016 VM with [New-AzureRmVM](/powershell/module/azurerm.compute/new-azurermvm). The following example creates a VM named *myVM* in the *East US* location. The resource group *myResourceGroupAzureDevOpsServices* and supporting network resources are also created. To allow web traffic, TCP port *80* is opened to the VM. When prompted, provide a username and password to be used as the login credentials for the VM:

```powershell
# Create user object
$cred = Get-Credential -Message "Enter a username and password for the virtual machine."

# Create a virtual machine
New-AzureRmVM `
  -ResourceGroupName "myResourceGroupAzureDevOpsServices" `
  -Name "myVM" `
  -Location "East US" `
  -ImageName "Win2016Datacenter" `
  -VirtualNetworkName "myVnet" `
  -SubnetName "mySubnet" `
  -SecurityGroupName "myNetworkSecurityGroup" `
  -PublicIpAddressName "myPublicIp" `
  -Credential $cred `
  -OpenPorts 80
```

To connect to your VM, obtain the public IP address with [Get-AzureRmPublicIpAddress](/powershell/module/azurerm.network/get-azurermpublicipaddress) as follows:

```powershell
Get-AzureRmPublicIpAddress -ResourceGroupName "myResourceGroup" | Select IpAddress
```

Create a remote desktop session to your VM:

```cmd
mstsc /v:<publicIpAddress>
```

On the VM, open an **Administrator PowerShell** command prompt. Install IIS and required .NET features as follows:

```powershell
Install-WindowsFeature Web-Server,Web-Asp-Net45,NET-Framework-Features
```


## Create deployment group

To push out the web deploy package to the IIS server, you define a deployment group in Azure DevOps Services. This group allows you to specify which servers are the target of new builds as you commit code to Azure DevOps Services and builds are completed.

1. In Azure DevOps Services, choose **Build & Release** and then select **Deployment groups**.
2. Choose **Add Deployment group**.
3. Enter a name for the group, such as *myIIS*, then select **Create**.
4. In the **Register machines** section, ensure *Windows* is selected, then check the box to **Use a personal access token in the script for authentication**.
5. Select **Copy script to clipboard**.


### Add IIS VM to the deployment group
With the deployment group created, add each IIS instance to the group. Azure DevOps Services generates a script that downloads and configures an agent on the VM that receives new web deploy packages then applies it to IIS.

1. Back in the **Administrator PowerShell** session on your VM, paste and run the script copied from Azure DevOps Services.
2. When prompted to configure tags for the agent, choose *Y* and enter *web*.
3. When prompted for the user account, press *Return* to accept the defaults.
4. Wait for the script to finish with a message *Service vstsagent.account.computername started successfully*.
5. In the **Deployment groups** page of the **Build & Release** menu, open the *myIIS* deployment group. On the **Machines** tab, verify that your VM is listed.

    ![VM successfully added to Azure DevOps Services deployment group](media/tutorial-vsts-iis-cicd/deployment_group.png)


## Create release pipeline
To publish your builds, you create a release pipeline in Azure DevOps Services. This pipeline is triggered automatically by a successful build of your application. You choose the deployment group to push your web deploy package to, and define the appropriate IIS settings.

1. Choose **Build & Release**, then select **Builds**. Choose the build pipeline created in a previous step.
2. Under **Recently completed**, choose the most recent build, then select **Release**.
3. Choose **Yes** to create a release pipeline.
4. Choose the **Empty** template, then select **Next**.
5. Verify the project and source build pipeline are populated with your project.
6. Select the **Continuous deployment** check box, then select **Create**.
7. Select the drop-down box next to **+ Add tasks** and choose *Add a deployment group phase*.
    
    ![Add task to release pipeline in Azure DevOps Services](media/tutorial-vsts-iis-cicd/add_release_task.png)

8. Choose **Add** next to **IIS Web App Deploy(Preview)**, then select **Close**.
9. Select the **Run on deployment group** parent task.
    1. For **Deployment Group**, select the deployment group you created earlier, such as *myIIS*.
    2. In the **Machine tags** box, select **Add** and choose the *web* tag.
    
    ![Release pipeline deployment group task for IIS](media/tutorial-vsts-iis-cicd/release_definition_iis.png)
 
11. Select the **Deploy: IIS Web App Deploy** task to configure your IIS instance settings as follows:
    1. For **Website Name**, enter *Default Web Site*.
    2. Leave all the other default settings.
12. Choose **Save**, then select **OK** twice.


## Create a release and publish
You can now push your web deploy package as a new release. This step communicates with the agent on each instance that is part of the deployment group, pushes the web deploy package, then configures IIS to run the updated web application.

1. In your release pipeline, select **+ Release**, then choose **Create Release**.
2. Verify that the latest build is selected in the drop-down list, along with **Automated deployment: After release creation**. Select **Create**.
3. A small banner appears across the top of your release pipeline, such as *Release 'Release-1' has been created*. Select the release link.
4. Open the **Logs** tab to watch the release progress.
    
    ![Successful Azure DevOps Services release and web deploy package push](media/tutorial-vsts-iis-cicd/successful_release.png)

5. After the release is complete, open a web browser and enter the public IIP address of your VM. Your ASP.NET web application is running.

    ![ASP.NET web app running on IIS VM](media/tutorial-vsts-iis-cicd/running_web_app.png)


## Test the whole CI/CD pipeline
With your web application running on IIS, now try the whole CI/CD pipeline. After you make a change in Visual Studio and commit your code, a build is triggered which then triggers a release of your updated web deploy package to IIS:

1. In Visual Studio, open the **Solution Explorer** window.
2. Navigate to and open *myWebApp | Views | Home | Index.cshtml*
3. Edit line 6 to read:

    `<h1>ASP.NET with Azure DevOps Services and CI/CD!</h1>`

4. Save the file.
5. Open the **Team Explorer** window, select the *myWebApp* project, then choose **Changes**.
6. Enter a commit message, such as *Testing CI/CD pipeline*, then choose **Commit All and Sync** from the drop-down menu.
7. In Azure DevOps Services workspace, a new build is triggered from the code commit. 
    - Choose **Build & Release**, then select **Builds**. 
    - Choose your build pipeline, then select the **Queued & running** build to watch as the build progresses.
9. Once the build is successful, a new release is triggered.
    - Choose **Build & Release**, then **Releases** to see the web deploy package pushed to your IIS VM. 
    - Select the **Refresh** icon to update the status. When the *Environments* column shows a green check mark, the release has successfully deployed to IIS.
11. To see your changes applied, refresh your IIS website in a browser.

    ![ASP.NET web app running on IIS VM from CI/CD pipeline](media/tutorial-vsts-iis-cicd/running_web_app_cicd.png)


## Next steps

In this tutorial, you created an ASP.NET web application in Azure DevOps Services and configured build and release pipelines to deploy new web deploy packages to IIS on each code commit. You learned how to:

> [!div class="checklist"]
> * Publish an ASP.NET web application to a Azure DevOps Services project
> * Create a build pipeline that is triggered by code commits
> * Install and configure IIS on a virtual machine in Azure
> * Add the IIS instance to a deployment group in Azure DevOps Services
> * Create a release pipeline to publish new web deploy packages to IIS
> * Test the CI/CD pipeline

Advance to the next tutorial to learn how to install a SQL&#92;IIS&#92;.NET stack on a pair of Windows VMs.

> [!div class="nextstepaction"]
> [SQL&#92;IIS&#92;.NET stack](tutorial-iis-sql.md)
