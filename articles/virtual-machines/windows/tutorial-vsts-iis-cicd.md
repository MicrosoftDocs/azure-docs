---
title: Create a CI/CD pipeline in Azure with VSTS | Microsoft Docs
description: Learn how to create a VSTS pipeline for continuous integration and delivery that deploys a web app to IIS on a Windows VM
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

# Create a continuous integration pipeline with VSTS and IIS on a Windows virtual machine in Azure

## Create new project in VSTS
1. Open VSTS dashboard, click **New project**.
2. Enter *myWebApp* for the **Project name**. Leave all other defaults to use **Git** version control and **Agile** work item process.
3. Select the option to **Share with** *Team Members* and then click **Create**.
5. To get started with your new project, select the option **Initialize with a README or gitignore** and then click **Initialize**.
6. Select **Dashboards** across the top, then select **Open in Visual Studio**.


## Create ASP.NET web appplication
Visual Studio opens the **Team Explorer** window to connect to your project.

1. Click **Clone** to create a local git repo of your VSTS project.
2. Under **Solutions**, click **New**.
3. Select the **Web** templates section, and then choose the **ASP.NET Web Application** template.
    a. Enter a name for your application, such as *myWebApp*, and uncheck the box for **Create directory for solution**.
    b. For this tutorial, uncheck the box to **Add Application Insights to project** if the option is available.
    c. Click **OK**.
4. Select **MVC** from the template list.
    a. Click **Change Authentication**, select **No Authentication**, and click **OK**.
    b. Click **OK**
5. In the **Team Explorer** window, click **Changes**.
6. In the commit text box, enter *Initial commit*. Select **Commit All and Sync** from the drop-down menu.


## Create build definition
1. In VSTS, you should be on the *myWebApp* project landing page.
2. To create a build definition, click **Build & Release** across the top, then select **Builds**.
3. Click **+ New definition**.
4. Select the **ASP.NET (PREVIEW)** template and click **Apply**.
5. You can leave all the default tasks. Under **Get sources**, ensure the *myWebApp* repository and *master* branch are selected.
6. On the **Triggers** tab, click the slider for **Enable this trigger** to *Enabled*.
7. Save the build definition and queue a new build by selecting the **Save & queue** , then **Save & queue** again. Leave the defaults and click **Queue**.

Watch as the build is scheduled on a hosted agent, then begins to build.


## Create VM
Create a Windows Server 2016 VM using [this script sample](../scripts/virtual-machines-windows-powershell-sample-create-vm?toc=%2fpowershell%2fmodule%2ftoc.json). It takes a few minutees for the script to run and create the VM. Once the VM has been created, open port 80 for web traffic:

```powershell
Get-AzureRmNetworkSecurityGroup `
  -ResourceGroupName "myResourceGroup" `
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


## Create VSTS deployment group
1. In VSTS, click **Build & Release** and then **Deployment groups**.
2. Click **Add Deployment group**.
3. Enter a name for the group, such as *myIIS*, and click **Create**.
4. In the **Register machines** section, ensure *Windows* is selected, then click the checkbox to **Use a personal access token in the script for authentication**.
5. Click **Copy script to clipboard**.


### Add IIS VM to the deployment group
1. Back in your **Administrator PowerShell** session on your VM, paste and run the script copied from VSTS.
4. When prompted to configure tags for the agent, press *Y* and enter *web*.
5. When prompted for the user account, press *Return* to accept the defaults.
6. Wait for the script to finish with a message `Service vstsagent.account.computername started successfully`.
7. In the **Deployment groups** page of the **Build & Release** menu, open the *myIIS* deployment group. On the **Machines** tab, verify that your VM is listed.


## Create release definition

1. Click **Build & Release**, then select **Builds**. Select the build definition created in a previous step.
2. Under **Recently completed**, click the most recent build and then click **Release**.
3. Click **Yes** to create a release definition.
4. Select the **IIS Website and SQL Database Deployment** template and click **Next**.
5. Verify the project and source build definition are populated with your project.
6. Select the **Continuous deployment** check box, and then choose **Create**.
7. Select the **IIS Web App Manage (Preview)** task and click the red cross to delete it.
8. Select the **SQL Deployment** section containing the **SQL DB Deploy** task and delete it.
9. Click the **IIS Deployment** parent task to associate with your deployment group as follows:
    a. For **Deployment Group**, select the deployment group you created earlier, such as *myIIS*.
    b. In the **Machine tags** box, click **Add** and select the *web* tag.
10. Click the **Deploy: IIS Web App Deploy** task to configure your IIS instance settings as follows:
    a. For **Website Name**, enter *Default Web Site*. If you created a different website on the IIS servers, use that name instead.
    b. Leave all the other default settings.
11. Click **Save**, then click **OK** twice.


## Create release and publish
1. In your release definition, click **+ Release**, then click **Create Release**.
2. Verify that the latest build is selected in the drop-down list, along with **Automated deployment: After release creation**. Click **Create**.
3. A small banner appears across the top of you release definition, such as *Release 'Release-1' has been created*. Click the release link.
4. Open the **Logs** tab to watch the release progress.
5. After the release is complete, open a web browser and enter the public IIP address of your VM. Your ASP.NET website is running.


## Test the whole CI/CD pipeline
1. In Visual Studio, open the **Solution Explorer** window.
2. Navigate to and open *WmyWebApp | Views | Home | Index.cshtml*
3. Edit line 6 (`<h1>ASP.NET</h1>`) to read:

    `<h1>ASP.NET with VSTS and CI/CD!</h1>`

4. Save the file.
5. Open Team Explorer window, select the *myWebApp* project, and click **Changes**.
6. Enter commit message, such as *Testing CI/CD pipeline*, and then select **Commit All and Sync** from the drop-down menu.
7. In VSTS workspace, a new build is triggered from the code commit. Click **Build & Release**, then **Builds**. Select your build definition, then click the **Queued & running** build to watch as the build progresses.
8. Once the build is successful, a new release is triggered. Click **Build & Release**, then **Releases** to see the web deploy package pushed to your IIS VM. Click the **Refresh** icon to update the status. When the *Environments* column shows a green check mark, the release has successfully deployed to IIS.
9. Refresh your IIS website in a browser to see your changes applied.


## Next steps