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
ms.date: 04/17/2018
ms.author: spelluru
---

# Integrate Azure DevTest Labs into your Azure DevOps continuous integration and delivery pipeline
You can use the *Azure DevTest Labs Tasks* extension that's installed in Azure DevOps to easily integrate your CI/CD build-and-release pipeline with Azure DevTest Labs. The extension installs three tasks: 
* Create a VM
* Create a custom image from a VM
* Delete a VM 

The process makes it easy to, for example, quickly deploy a "golden image" for a specific test task and then delete it when the test is finished.

This article shows how to create and deploy a VM, create a custom image, and then delete the VM, all as one complete pipeline. You would ordinarily perform each task individually in your own custom build-test-deploy pipeline.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Before you begin
Before you can integrate your CI/CD pipeline with Azure DevTest Labs, you must install the extension from Visual Studio Marketplace.
1. Go to [Azure DevTest Labs Tasks](https://marketplace.visualstudio.com/items?itemName=ms-azuredevtestlabs.tasks).
1. Select **Install**.
1. Complete the wizard.

## Create a Resource Manager template
This section describes how to create the Azure Resource Manager template that you use to create an Azure virtual machine on demand.

1. To create a Resource Manager template in your subscription, complete the procedure in [Use a Resource Manager template](devtest-lab-use-resource-manager-template.md).
1. Before you generate the Resource Manager template, add the [WinRM artifact](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts/windows-winrm) as part of creating the VM.

   WinRM access is required to use deployment tasks such as *Azure File Copy* and *PowerShell on Target Machines*.

   > [!NOTE]
   > When you use WinRM with a shared IP address, you must add a NAT rule to map an external port to the WinRM port. This step is not required if you create the VM with a public IP address.
   >
   >

1. Save the template as a file on your computer. Name the file **CreateVMTemplate.json**.
1. Check the template in to your source control system.
1. Open a text editor, and paste the following script into it.

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

1. Check the script in to your source control system. Name it something like **GetLabVMParams.ps1**.

   When you run this script on the agent as part of the release pipeline, and if you use task steps such as *Azure File Copy* or *PowerShell on Target Machines*, the script collects the values that you need to deploy your app to the VM. You would ordinarily use these tasks to deploy apps to an Azure VM. The tasks require values such as the VM Resource Group name, IP address, and fully qualified domain name (FQDN).

## Create a release pipeline in Release Management
To create the release pipeline, do the following:

1. On the **Releases** tab of the **Build & Release** hub, select the plus sign (+) button.
1. In the **Create release definition** window, select the **Empty** template, and then select **Next**.
1. Select **Choose Later**, and then select **Create** to create a new release pipeline with one default environment and no linked artifacts.
1. To open the shortcut menu, in the new release pipeline, select the ellipsis (...) next to the environment name, and then select **Configure variables**. 
1. In the **Configure - environment** window, for the variables that you use in the release pipeline tasks, enter the following values:

   a. For **vmName**, enter the name that you assigned to the VM when you created the Resource Manager template in the Azure portal.

   b. For **userName**, enter the username that you assigned to the VM when you created the Resource Manager template in the Azure portal.

   c. For **password**, enter the password that you assigned to the VM when you created the Resource Manager template in the Azure portal. Use the "padlock" icon to hide and secure the password.

### Create a VM

The next stage of the deployment is to create the VM to use as the "golden image" for subsequent deployments. You create the VM within your Azure DevTest Lab instance by using the task that's specially developed for this purpose. 

1. In the release pipeline, select **Add tasks**.
1. On the **Deploy** tab, add an *Azure DevTest Labs Create VM* task. Configure the task as follows:

   > [!NOTE]
   > To create the VM to use for subsequent deployments, see [Azure DevTest Labs tasks](https://marketplace.visualstudio.com/items?itemName=ms-azuredevtestlabs.tasks).

   a. For **Azure RM Subscription**, select a connection in the **Available Azure Service Connections** list, or create a more restricted permissions connection to your Azure subscription. For more information, see [Azure Resource Manager service endpoint](https://docs.microsoft.com/azure/devops/pipelines/library/service-endpoints#sep-azure-rm).

   b. For **Lab Name**, select the name of the instance that you created earlier.

   c. For **Template Name**, enter the full path and name of the template file that you saved to your source code repository. You can use the built-in properties of Release Management to simplify the path, for example:

   ```
   $(System.DefaultWorkingDirectory)/Contoso/ARMTemplates/CreateVMTemplate.json
   ```

   d. For **Template Parameters**, enter the parameters for the variables that are defined in the template. Use the names of the variables that you defined in the environment, for example:

   ```
   -newVMName '$(vmName)' -userName '$(userName)' -password (ConvertTo-SecureString -String '$(password)' -AsPlainText -Force)
   ```

   e. For **Output Variables - Lab VM ID**, you need the ID of the newly created VM for subsequent steps. You set the default name of the environment variable that is automatically populated with this ID in the **Output Variables** section. You can edit the variable if necessary, but remember to use the correct name in subsequent tasks. The Lab VM ID is written in the following form:

   ```
   /subscriptions/{subId}/resourceGroups/{rgName}/providers/Microsoft.DevTestLab/labs/{labName}/virtualMachines/{vmName}
   ```

1. Execute the script you created earlier to collect the details of the DevTest Labs VM. 
1. In the release pipeline, select **Add tasks** and then, on the **Deploy** tab, add an *Azure PowerShell* task. Configure the task as follows:

   > [!NOTE]
   > To collect the details of the DevTest Labs VM, see [Deploy: Azure PowerShell](https://github.com/Microsoft/azure-pipelines-tasks/tree/master/Tasks/AzurePowerShellV3) and execute the script.

   a. For **Azure Connection Type**, select **Azure Resource Manager**.

   b. For **Azure RM Subscription**, select a connection from the list under **Available Azure Service Connections**, or create a more restricted permissions connection to your Azure subscription. For more information, see [Azure Resource Manager service endpoint](https://docs.microsoft.com/azure/devops/pipelines/library/service-endpoints#sep-azure-rm).

   c. For **Script Type**, select **Script File**.
 
   d. For **Script Path**, enter the full path and name of the script that you saved to your source code repository. You can use the built-in properties of Release Management to simplify the path, for example:
      ```
      $(System.DefaultWorkingDirectory/Contoso/Scripts/GetLabVMParams.ps1
      ```
   e. For **Script Arguments**, enter the name of the environment variable that was automatically populated with the ID of the lab VM by the previous task, for example: 
      ```
      -labVmId '$(labVMId)'
      ```
    The script collects the required values and stores them in environment variables within the release pipeline so that you can easily refer to them in subsequent steps.

1. Deploy your app to the new DevTest Labs VM. The tasks you ordinarily use to deploy the app are *Azure File Copy* and *PowerShell on Target Machines*.
   The information about the VM you need for the parameters of these tasks is stored in three configuration variables named **labVmRgName**, **labVMIpAddress**, and **labVMFqdn** within the release pipeline. If you only want to experiment with creating a DevTest Labs VM and a custom image, without deploying an app to it, you can skip this step.

### Create an image

The next stage is to create an image of the newly deployed VM in your Azure DevTest Labs instance. You can then use the image to create copies of the VM on demand whenever you want to execute a dev task or run some tests. 

1. In the release pipeline, select **Add tasks**.
1. On the **Deploy** tab, add an **Azure DevTest Labs Create Custom Image** task. Configure it as follows:

   > [!NOTE]
   > To create the image, see [Azure DevTest Labs tasks](https://marketplace.visualstudio.com/items?itemName=ms-azuredevtestlabs.tasks).

   a. For **Azure RM Subscription**, in the **Available Azure Service Connections** list, select a connection from the list, or create a more restricted permissions connection to your Azure subscription. For more information, see [Azure Resource Manager service endpoint](https://docs.microsoft.com/azure/devops/pipelines/library/service-endpoints#sep-azure-rm).

   b. For **Lab Name**, select the name of the instance you created earlier.

   c. For **Custom Image Name**, enter a name for the custom image.

   d. (Optional) For **Description**, enter a description to make it easy to select the correct image later.

   e. For **Source Lab VM - Source Lab VM ID**, if you changed the default name of the environment variable that was automatically populated with the ID of the lab VM by an earlier task, edit it here. The default value is **$(labVMId)**.

   f. For **Output Variables - Custom Image ID**, you need the ID of the newly created image when you want to manage or delete it. The default name of the environment variable that is automatically populated with this ID is set in the **Output Variables** section. You can edit the variable if necessary.

### Delete the VM

The final stage is to delete the VM that you deployed in your Azure DevTest Labs instance. You would ordinarily delete the VM after you execute the dev tasks or run the tests that you need on the deployed VM. 

1. In the release pipeline, select **Add tasks** and then, on the **Deploy** tab, add an *Azure DevTest Labs Delete VM* task. Configure it as follows:

      > [!NOTE]
      > To delete the VM, see [Azure DevTest Labs Tasks](https://marketplace.visualstudio.com/items?itemName=ms-azuredevtestlabs.tasks).

   a. For **Azure RM Subscription**, select a connection in the **Available Azure Service Connections** list, or create a more restricted permissions connection to your Azure subscription. For more information, see [Azure Resource Manager service endpoint](https://docs.microsoft.com/azure/devops/pipelines/library/service-endpoints#sep-azure-rm).
 
   b. For **Lab VM ID**, if you changed the default name of the environment variable that was automatically populated with the ID of the lab VM by an earlier task, edit it here. The default value is **$(labVMId)**.

1. Enter a name for the release pipeline, and then save it.
1. Create a new release, select the latest build, and deploy it to the single environment in the pipeline.

At each stage, refresh the view of your DevTest Labs instance in the Azure portal to view the VM and image that are being created, and the VM that's being deleted again.

You can now use the custom image to create VMs when they're required.


[!INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]

## Next steps
* Learn how to [Create multi-VM environments with Resource Manager templates](devtest-lab-create-environment-from-arm.md).
* Explore more quickstart Resource Manager templates for DevTest Labs automation from the [public DevTest Labs GitHub repo](https://github.com/Azure/azure-quickstart-templates).
* If necessary, see the [Azure DevOps Troubleshooting](https://docs.microsoft.com/azure/devops/pipelines/troubleshooting) page.
 
