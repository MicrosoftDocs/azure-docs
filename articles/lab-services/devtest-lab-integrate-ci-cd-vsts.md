---
title: Integrate Azure DevTest Labs into your Azure Pipelines continuous integration and delivery pipeline | Microsoft Docs
description: Learn how to integrate Azure DevTest Labs into your Azure Pipelines continuous integration and delivery pipeline
services: devtest-lab,virtual-machines,lab-services
documentationcenter: na
author: spelluru
manager: femila
editor: ''

ms.assetid: a26df85e-2a00-462b-aac1-dd3539532569
ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/24/2019
ms.author: spelluru
---

# Integrate Azure DevTest Labs into your Azure Pipelines CI/CD pipeline

You can use the *Azure DevTest Labs Tasks* extension to integrate your Azure Pipelines continuous integration and continuous delivery (CI/CD) build and release pipelines with Azure DevTest Labs. The extension installs several tasks, including: 

- Create a virtual machine (VM)
- Create a custom image from a VM
- Delete a VM 

These tasks make it easy to, for example, quickly deploy a *golden image* VM for a specific test task, and then delete the VM when the test is finished.

This article shows how to create and deploy a VM, create a custom image, and then delete the VM, all in one pipeline. You would ordinarily perform the tasks individually in your own custom build, test, and deploy pipelines.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Prerequisite

Install the Azure DevTest Labs Tasks extension from Visual Studio Marketplace.

1. Go to [Azure DevTest Labs Tasks](https://marketplace.visualstudio.com/items?itemName=ms-azuredevtestlabs.tasks).
1. Select **Get it free**.
1. Select your Azure DevOps organization from the dropdown, and select **Install**. 

## Create a Resource Manager template

This section describes how to create the Azure Resource Manager template that you use to create an Azure VM on demand.

1. To create a Resource Manager template in your subscription, complete the procedure in [Use a Resource Manager template](devtest-lab-use-resource-manager-template.md).
1. Before you generate the Resource Manager template, add the [WinRM artifact](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts/windows-winrm) as part of creating the VM. Deployment tasks like *Azure File Copy* and *PowerShell on Target Machines* need WinRM access.
   
   > [!NOTE]
   > When you use WinRM with a shared IP address, you must add a NAT rule to map an external port to the WinRM port. You don't need this step if you create the VM with a public IP address.
   >
   
1. Save the template to your computer as a file named *CreateVMTemplate.json* .
1. Check the template in to your source control system.
1. Open a new blank text editor, and paste the following script into it.
   
   ```powershell
   Param( [string] $labVmId)

   $labVmComputeId = (Get-AzResource -Id $labVmId).Properties.ComputeId

   # Get lab VM resource group name
   $labVmRgName = (Get-AzResource -Id $labVmComputeId).ResourceGroupName

   # Get the lab VM Name
   $labVmName = (Get-AzResource -Id $labVmId).Name

   # Get lab VM public IP address
   $labVMIpAddress = (Get-AzPublicIpAddress -ResourceGroupName $labVmRgName
                   -Name $labVmName).IpAddress

   # Get lab VM FQDN
   $labVMFqdn = (Get-AzPublicIpAddress -ResourceGroupName $labVmRgName
              -Name $labVmName).DnsSettings.Fqdn

   # Set a variable labVmRgName to store the lab VM resource group name
   Write-Host "##vso[task.setvariable variable=labVmRgName;]$labVmRgName"

   # Set a variable labVMIpAddress to store the lab VM Ip address
   Write-Host "##vso[task.setvariable variable=labVMIpAddress;]$labVMIpAddress"

   # Set a variable labVMFqdn to store the lab VM FQDN name
   Write-Host "##vso[task.setvariable variable=labVMFqdn;]$labVMFqdn"
   ```

1. Save the file with a name like *GetLabVMParams.ps1*, and check it in to your source control system. 

   When you run this script on the agent as part of the release pipeline, and use task steps such as *Azure File Copy* or *PowerShell on Target Machines*, the script collects the values that you need to deploy your app to the VM. You would ordinarily use these tasks to deploy apps to an Azure VM. The tasks require values such as the VM resource group name, IP address, and fully qualified domain name (FQDN).

## Create a release pipeline in Azure Pipelines

To create the release pipeline, do the following:

1. Select or create a [project](/vsts/organizations/projects/create-project) in your Azure DevOps organization. 
1. From your project page, select **Pipelines** > **Releases** from the left navigation.
1. Select **New** or **New Pipeline**.
1. Under **Select a template**, scroll down and select **Empty job**, and then select **Apply**.

### Add and set variables

1. On the pipeline page, select the **Variables** tab.
1. Select **Add** to add the following variables to use in release pipeline tasks:
   - Add *vmName*, and enter the name that you assigned to the VM when you created the Resource Manager template in the Azure portal.
   - Add *userName*, and enter the username that you assigned to the VM when you created the Resource Manager template in the Azure portal.
   - Add *password*, and enter the password that you assigned to the VM when you created the Resource Manager template in the Azure portal. Select the lock icon to hide and secure the password.

### Create a VM

The next step of the deployment is to create the VM to use as the golden image for subsequent deployments. You create the VM within your Azure DevTest Lab instance by using the task that's specially developed for this purpose.

1. On the release pipeline **Pipeline** tab, select the hyperlinked text **1 job, 0 task** in **Stage 1**, and then select the **+** next to **Agent job**. 
   
1. Under **Add tasks**, select **Azure DevTest Labs Create VM**, and select **Add**. 
   
1. Select **Create Azure DevTest Labs VM** in the left pane. 

1. In the right pane:
   
   1. Under **Azure RM Subscription**, select a service connection or subscription from **Available Azure Service Connections** or **Available Azure Subscriptions** dropdown, and select **Authorize** if necessary. 
      
      > [!NOTE]
      > For information about creating a more restricted permissions connection to your Azure subscription, see [Azure Resource Manager service endpoint](/azure/devops/pipelines/library/service-endpoints#sep-azure-rm).
      
   1. Under **Lab Name**, select the name of an existing lab in which the lab VM will be created.
   
   1. Under **Template Name**, enter the full path and name of the template file you saved to your source code repository. You can use built-in properties to simplify the path, for example:
      
      `$(System.DefaultWorkingDirectory)/Contoso/Templates/CreateVMTemplate.json`
      
   1. Under **Template Parameters**, enter the parameters for the variables you defined earlier:
      
      `-newVMName '$(vmName)' -userName '$(userName)' -password (ConvertTo-SecureString -String '$(password)' -AsPlainText -Force)`
   
   1. Under **Output Variables** > **Lab VM ID**, enter the variable for the created lab VM ID. If you use the default of *labVMId*, you can refer to the variable in subsequent tasks as $(labVMId). 
      
      You can create a name other than the default, but remember to use the correct name in subsequent tasks. You can write the Lab VM ID in the following form:
      
      `/subscriptions/{subId}/resourceGroups/{rgName}/providers/Microsoft.DevTestLab/labs/{labName}/virtualMachines/{vmName}`

## Run the script to collect the details of the DevTest Lab VM

Execute the script you created earlier to collect the details of the DevTest Labs VM. 

1. On the release pipeline **Pipeline** tab, under **Stages**, select the hyperlinked text **1 job, 1 task**, and then select the **+** next to **Agent job**. 
   
1. Under **Add tasks**, select **Azure PowerShell**, and select **Add**. 
   
1. Select **Azure PowerShell script: FilePath** in the left pane. 
   
1. In the right pane:
   
   1. For **Azure Connection Type**, select **Azure Resource Manager**.
   
   1. Under **Azure Subscription**, select your service connection or subscription. 
   
   1. For **Script Type**, select **Script File Path**.
   
   1. For **Script Path**, enter the full path and name of the script that you saved to your source code repository. You can use built-in properties to simplify the path, for example:
      
      `$(System.DefaultWorkingDirectory/Contoso/Scripts/GetLabVMParams.ps1`
      
   1. For **Script Arguments**, enter the name of the labVmId variable that was populated by the previous task, for example: 
      
      `-labVmId '$(labVMId)'`
      
The script collects the required values and stores them in environment variables within the release pipeline, so that you can easily refer to them in subsequent steps.

### Deploy your app to the new DevTest Labs VM (optional)

Add tasks to deploy your app to the new DevTest Labs VM. The tasks you ordinarily use to deploy the app are **Azure File Copy** and **PowerShell on Target Machines**.

The information about the VM you need for the parameters of these tasks is stored in three configuration variables named **labVmRgName**, **labVMIpAddress**, and **labVMFqdn** within the release pipeline. If you only want to experiment with creating a DevTest Labs VM and a custom image, without deploying an app to it, you can skip this step.

### Create an image

The next stage is to create an image of the newly deployed VM in your Azure DevTest Labs instance. You can then use the image to create copies of the VM on demand whenever you want to execute a dev task or run some tests. 

1. On the release pipeline **Pipeline** tab, under **Stages**, select the hyperlinked text **1 job, 2 tasks**, and then select the **+** next to **Agent job**. 
   
1. Under **Add tasks**, select **Azure DevTest Labs Create Custom Image**, and select **Add**. 
   
1. Configure the task as follows:
   
   1. Under **Azure RM Subscription**, select your service connection or subscription. 
   
   1. Under **Lab Name**, select the name of an existing lab in which the image will be created.
   
   1. For **Custom Image Name**, enter a name for the custom image.
   
   1. (Optional) For **Description**, enter a description to make it easy to select the correct image later.
   
   1. For **Source Lab VM** > **Source Lab VM ID**, if you changed the default name of the LabVMId variable, enter it here. The default value is **$(labVMId)**.
   
   1. Under **Output Variables** > **Custom Image ID**, change the default name of the variable if necessary.
   
### Delete the VM

The final task is to delete the VM that you deployed in your Azure DevTest Labs instance. You would ordinarily delete the VM after you execute the dev tasks or run the tests that you need on the deployed VM. 

1. On the release pipeline **Pipeline** tab, under **Stages**, select the hyperlinked text **1 job, 3 tasks**, and then select the **+** next to **Agent job**. 
   
1. Under **Add tasks**, select **Azure DevTest Labs Delete VM**, and select **Add**. 
   
1. Configure the task as follows:
   
   1. Under **Azure RM Subscription**, select your service connection or subscription. 
   
   1. For **Lab VM ID**, if you changed the default name of the LabVMId variable, enter it here. The default value is **$(labVMId)**.
   
1. Select the name **New release pipeline** on the pipeline page, and enter a name for the release pipeline. 
   
1. Select the **Save** icon at upper right to save the release pipeline. 

## Create and run the release

1. Select **Create release** at upper right on your pipeline page to create a new release. 
   
1. In **Create a new release** under **Artifacts**, select the latest build, and then select **Create**.

At each release stage, refresh the view of your DevTest Labs instance in the Azure portal to view the VM creation, image creation, and VM deletion.

You can use the custom image to create VMs whenever they're required.

[!INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]

## Next steps
- Learn how to [Create multi-VM environments with Resource Manager templates](devtest-lab-create-environment-from-arm.md).
- Explore more quickstart Resource Manager templates for DevTest Labs automation from the [public DevTest Labs GitHub repo](https://github.com/Azure/azure-quickstart-templates).
- If necessary, see the [Azure DevOps troubleshooting](https://docs.microsoft.com/azure/devops/pipelines/troubleshooting) page.
 
