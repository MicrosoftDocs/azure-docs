---
title: Integrate Azure DevTest Labs into your VSTS continuous integration and delivery pipeline | Microsoft Docs
description: Learn how to integrate Azure DevTest Labs into your VSTS continuous integration and delivery pipeline
services: devtest-lab,virtual-machines,visual-studio-online
documentationcenter: na
author: tomarcher
manager: douge
editor: ''

ms.assetid: a26df85e-2a00-462b-aac1-dd3539532569
ms.service: devtest-lab
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/07/2017
ms.author: tarcher

---

# Integrate Azure DevTest Labs into your VSTS continuous integration and delivery pipeline
You can use an extension installed in Visual Studio Team Services (VSTS) to easily integrate your CI/CD build and release pipeline with Azure DevTest Labs. The extension installs three tasks to create a VM, create a custom image from a VM, and delete a VM. This process makes it easy to, for example, quickly deploy a "golden image" for specific test task, then delete it when the test is finished.

This article shows how to create and deploy a VM, create a custom image, then delete the VM, all as one complete pipeline. Typically, though, you would use the tasks individually in your own custom build-test-deploy pipeline.

## Before you begin
Before you can integrate your CI/CD pipeline with Azure DevTest Labs, you must first install the extension from Visual Studio Marketplace.
1. Go to [Azure DevTest Labs Tasks](https://marketplace.visualstudio.com/items?itemName=ms-azuredevtestlabs.tasks)
1. Choose Install
1. Complete the wizard

## Create a Resource Manager template
This section describes how to create the Azure Resource Manager template that you use to create an Azure Virtual Machine on demand.

1. Follow the steps at [Use a Resource Manager template](devtest-lab-use-resource-manager-template.md) to create a Resource Manager template in your subscription.
1. Save the template as a file on your computer. Name the file **CreateVMTemplate.json**.
1. Configure the **CreateVMTemplate.json** file for Windows Remote Management (WinRM), as described in [this blog post](http://visualstudiogeeks.com/blog/DevOps/Configure-winrm-with-ARM-template-in-AzureDevTestLab-VM-deployment-using-PowerShell-artifact).

   WinRM access is required to use deploy tasks such as **Azure File Copy** and **PowerShell on Target Machines**.

1. Check the template into your source control system.
1. Open a text editor and copy the following script into it.

   ```powershell
   Param( [string] $labVmId)

   $labVmComputeId = (Get-AzureRmResource -Id $labVmId).Properties.ComputeId

   # Get lab VM resource group name
   $labVmRgName = (Get-AzureRmResource -Id $labVmComputeId).ResourceGroupName

   # Get the lab VM Name
   $labVmName = (Get-AzureRmResource -Id $labVmId).Name

   # Get lab VM public IP address
   $labVMIpAddress = (Get-AzureRmPublicIpAddress -ResourceGroupName $labVmRgName
                   -Name $labVmName).IpAddress

   # Get lab VM FQDN
   $labVMFqdn = (Get-AzureRmPublicIpAddress -ResourceGroupName $labVmRgName
              -Name $labVmName).DnsSettings.Fqdn

   # Set a variable labVmRgName to store the lab VM resource group name
   Write-Host "##vso[task.setvariable variable=labVmRgName;]$labVmRgName"

   # Set a variable labVMIpAddress to store the lab VM Ip address
   Write-Host "##vso[task.setvariable variable=labVMIpAddress;]$labVMIpAddress"

   # Set a variable labVMFqdn to store the lab VM FQDN name
   Write-Host "##vso[task.setvariable variable=labVMFqdn;]$labVMFqdn"
   ```

1. Check the script into your source control system. Name it something similar to **GetLabVMParams.ps1**.

   This script, when run on the agent as part of the release definition, collects values that you need to deploy your app to the VM if you use task steps such as **Azure File Copy** or **PowerShell on Target Machines**. You typically use these tasks to deploy apps to an Azure VM, and they require values such as the VM Resource Group name, IP address, and fully qualified domain name (FDQN).

## Create the release definition in Release Management
Perform these steps to create the release definition.

1. Open the **Releases** tab of the **Build & Release** hub and choose the "**+**" icon.
1. In the **Create release definition** dialog, select the **Empty** template, and choose **Next**.
1. In the next page, select **Choose Later** and then choose **Create** to create a new release definition with one default environment and no linked artifacts.
1. In the new release definition, choose the ellipses (...) next to the environment name to open the shortcut menu and select **Configure variables**. 
1. In the **Configure - environment** dialog, enter the following values for the variables you use in the release definition tasks:
   - **vmName**: Enter the name you assigned to the VM when you created the Resource Manager template in the Azure portal.
   - **userName**: Enter the username you assigned to the VM when you created the Resource Manager template in the Azure portal.
   - **password**: Enter the password you assigned to the VM when you created the Resource Manager template in the Azure portal. Use the "padlock" icon to hide and secure the password.

   **Create a VM**

   The first stage in this deployment is to create the VM to use as the "golden image" for subsequent deployments. You create the VM within your Azure DevTest Lab instance using the task specially developed for this purpose. In the release definition, select **+ Add tasks** and add an **Azure DevTest Labs Create VM** task from the Deploy tab. Configure it as follows:

   See [Azure DevTest Labs Tasks](https://marketplace.visualstudio.com/items?itemName=ms-azuredevtestlabs.tasks) to create the VM to use for subsequent deployments.
   - **Azure RM Subscription**: Select a connection from the list under **Available Azure Service Connections** or create a more restricted permissions connection to your Azure subscription. For more information, see [Azure Resource Manager service endpoint](https://docs.microsoft.com/en-us/vsts/build-release/concepts/library/service-endpoints#sep-azure-rm).
   - **Lab Name**: Select the name of the instance you created earlier.
   - **Template Name**: Enter the full path and name of the template file you saved into your source code repository. You can use the built-in properties of Release Management to simplify the path, for example:
      ```
      $(System.DefaultWorkingDirectory)/Contoso/ARMTemplates/CreateVMTemplate.json
      ```
   - **Template Parameters**: Enter the parameters for the variables defined in the template. Use the names of the variables you defined in the environment, for example:
      ```
      -newVMName '$(vmName)' -userName '$(userName)' -password (ConvertTo-SecureString -String '$(password)' -AsPlainText -Force)
      ```
   - **Output Variables - Lab VM ID**: You need the ID of the newly created VM for subsequent steps. The default name of the environment variable that is automatically populated with this ID is set in the **Output Variables** section. You can edit the variable if necessary, but remember to use the correct name in subsequent tasks. The Lab VM ID is in the form:
      ```
      /subscriptions/{subId}/resourceGroups/{rgName}/providers/Microsoft.DevTestLab/labs/{labName}/virtualMachines/{vmName}
      ```
1. Execute the script you created earlier to collect the details of the DevTest Labs VM. In the release definition, select **+ Add tasks** and add an **Azure PowerShell** task from the **Deploy** tab. Configure the task as follows:

   See [Deploy: Azure PowerShell](https://github.com/Microsoft/vsts-tasks/tree/master/Tasks/AzurePowerShell) and execute the script to collect the details of the DevTest Labs VM.

   - **Azure Connection Type**: Azure Resource Manager.
   - **Azure RM Subscription**: Select a connection from the list under **Available Azure Service Connections** or create a more restricted permissions connection to your Azure subscription. For more information, see [Azure Resource Manager service endpoint](https://docs.microsoft.com/en-us/vsts/build-release/concepts/library/service-endpoints#sep-azure-rm).
   - **Script Type**: Script File.
   - **Script Path**: Enter the full path and name of the script you saved into your source code repository. You can use the built-in properties of Release Management to simplify the path, for example:
      ```
      $(System.DefaultWorkingDirectory/Contoso/Scripts/GetLabVMParams.ps1
      ```
   - **Script Arguments**: Enter as the script argument the name of the environment variable that was automatically populated with the ID of the lab VM by the previous task, for example: 
      ```
      -labVmId '$(labVMId)'
      ```
   The script collects the required values and stores them in environment variables within the release definition so that you can easily refer to them in subsequent task steps.

1. Now you can deploy your app to the new DevTest Labs VM. The tasks you typically use to deploy are **Azure File Copy** and **PowerShell on Target Machines**.
   - The information about the VM you need for the parameters of these tasks is stored in three configuration variables named **labVmRgName**, **labVMIpAddress**, and **labVMFqdn** within the release definition.
   - If you just want to experiment with creating a DevTest Labs VM and a custom image, without deploying an app to it, you can skip this step.

   **Create an image**

   The next stage is to create an image of the newly deployed VM in your Azure DevTest Labs instance. You can then use this image to create copies of the VM on demand, whenever you want to execute a dev task or run some tests. In the release definition, select **+ Add tasks** and add an **Azure DevTest Labs Create Custom Image** task from the **Deploy** tab. Configure it as follows:

   See [Azure DevTest Labs Tasks](https://marketplace.visualstudio.com/items?itemName=ms-azuredevtestlabs.tasks) to create the image.
   - **Azure RM Subscription**: Select a connection from the list under **Available Azure Service Connections** or create a more restricted permissions connection to your Azure subscription. For more information, see [Azure Resource Manager service endpoint](https://docs.microsoft.com/en-us/vsts/build-release/concepts/library/service-endpoints#sep-azure-rm).
   - **Lab Name**: Select the name of the instance you created earlier.
   - **Custom Image Name**: Enter a name for the custom image.
   - **Description**: Optionally enter a description to make it easy to select the correct image later.
   - **Source Lab VM - Source Lab VM ID**: If you changed the default name of the environment variable that was automatically populated with the ID of the lab VM by an earlier task, edit it here. The default is *$(labVMId)*.
   - **Output Variables - Lab VM ID**: You need the ID of the newly created image when you want to manage or delete it. The default name of the environment variable that is automatically populated with this ID is set in the **Output Variables** section. You can edit the variable if necessary.
   
   **Delete the VM**
   
   The final stage in this example is to delete the VM you deployed in your Azure DevTest Labs instance. Typically, you delete the VM after you execute the dev tasks or run the tests you need on the deployed VM. In the release definition, select **+ Add tasks** and add an **Azure DevTest Labs Delete VM** task from the **Deploy** tab. Configure it as follows:

   See [Azure DevTest Labs Tasks](https://marketplace.visualstudio.com/items?itemName=ms-azuredevtestlabs.tasks) to delete the VM.
   - **Azure RM Subscription**: Select a connection from the list under **Available Azure Service Connections** or create a more restricted permissions connection to your Azure subscription. For more information, see [Azure Resource Manager service endpoint](https://docs.microsoft.com/en-us/vsts/build-release/concepts/library/service-endpoints#sep-azure-rm).
   - **Lab VM ID**: If you changed the default name of the environment variable that was automatically populated with the ID of the lab VM by an earlier task, edit it here. The default is *$(labVMId)*.
1. Enter a name for the release definition and save it.
1. Create a new release, select the latest build, and deploy it to the single environment in the definition.

At each stage, refresh the view of your DevTest Labs instance in the Azure portal to see the VM and image being created, and the VM being deleted again.

You can now use the custom image to create VMs when required.


[!INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]

## Next steps
* Learn how to [Create multi-VM environments with Resource Manager templates](devtest-lab-create-environment-from-arm.md).
* Explore more quickstart Resource Manager templates for DevTest Labs automation from the [public DevTest Labs GitHub repo](https://github.com/Azure/azure-quickstart-templates).
* If necessary, see the [VSTS Troubleshooting](https://docs.microsoft.com/vsts/build-release/actions/troubleshooting) page.
