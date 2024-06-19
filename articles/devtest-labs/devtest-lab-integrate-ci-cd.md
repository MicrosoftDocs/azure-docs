---
title: Integrate Azure DevTest Labs into Azure Pipelines
description: Learn how to integrate Azure DevTest Labs into Azure Pipelines continuous integration and delivery (CI/CD) pipelines.
ms.topic: how-to
ms.custom: devx-track-azurepowershell, UpdateFrequency2
ms.author: rosemalcolm
author: RoseHJM
ms.date: 12/28/2021
---

# Integrate DevTest Labs into Azure Pipelines

You can use the Azure DevTest Labs Tasks extension to integrate Azure DevTest Labs into Azure Pipelines continuous integration and delivery (CI/CD) pipelines. The extension installs several tasks into Azure Pipelines, including:

- Create a virtual machine (VM)
- Create a custom image from a VM
- Delete a VM

These tasks make it easy to, for example, quickly deploy a *golden image* VM, run a specific test, and then delete the VM.

This article shows how to use Azure DevTest Labs Tasks to create and deploy a VM, create a custom image, and then delete the VM, all in one release pipeline. You'd ordinarily perform these tasks separately in your own build, test, and deployment pipelines.

[!INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]

## Prerequisites

- In the Azure portal, [create a DevTest Labs lab](devtest-lab-create-lab.md), or use an existing one.
- Register or sign into your [Azure DevOps Services](https://dev.azure.com) organization, and [create a project](/vsts/organizations/projects/create-project), or use an existing project.
- Install the Azure DevTest Labs Tasks extension from Visual Studio Marketplace:
  
  1. Go to [Azure DevTest Labs Tasks](https://marketplace.visualstudio.com/items?itemName=ms-azuredevtestlabs.tasks).
  1. Select **Get it free**.
  1. Select your Azure DevOps Services organization from the dropdown list, and then select **Install**. 

## Create a template to build a lab VM 

First, construct an Azure Resource Manager (ARM) template that creates a lab VM on demand.

1. In your lab in the Azure portal, select **Add** in the top menu bar.
1. On the **Choose a base** screen, select a Windows base image for the VM.
1. On the **Create lab resource** screen, under **Artifacts**, select **Add or Remove Artifacts**.
1. On the **Add artifacts** screen, search for *winrm*, and then select the arrow next to **Configure WinRM**.
1. On the **Add artifact** pane, enter a fully qualified domain name (FQDN) for the VM, such as `contosolab00000000000000.westus3.cloudapp.azure.com`. Select **OK**, and then select **OK** again.
1. Select the **Advanced Settings** tab, and for **IP Address**, select **Public**.
   > [!NOTE]
   > If you use the WinRM artifact with a shared IP address, you must add a network address translation (NAT) rule to map an external port to the WinRM port. You don't need the NAT rule if you create the VM with a public IP address. For this walkthrough, create the VM with a public IP address.
1. Select **View ARM template**.
1. Copy the template code and save it as a file named *CreateVMTemplate.json* in your local source control branch.
1. Check in the template to your project's source control system.

For more information and details, see [Use a Resource Manager template](devtest-lab-use-resource-manager-template.md).

## Create a script to get VM properties

Next, create a script to collect the values that task steps like **Azure File Copy** and **PowerShell on Target Machines** use to deploy apps to VMs. You'd ordinarily use these tasks to deploy your own apps to your Azure VMs. The tasks require values such as the VM resource group name, IP address, and FQDN.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

Save the following script with a name like *GetLabVMParams.ps1*, and check it in to your project's source control system.

```powershell
Param( [string] $labVmId)

$labVmComputeId = (Get-AzResource -Id $labVmId).Properties.ComputeId

# Get lab VM resource group name
$labVmRgName = (Get-AzResource -Id $labVmComputeId).ResourceGroupName

# Get the lab VM Name
$labVmName = (Get-AzResource -Id $labVmId).Name

# Get lab VM public IP address
$labVMIpAddress = (Get-AzPublicIpAddress -ResourceGroupName $labVmRgName -Name $labVmName).IpAddress

# Get lab VM FQDN
$labVMFqdn = (Get-AzPublicIpAddress -ResourceGroupName $labVmRgName -Name $labVmName).DnsSettings.Fqdn

# Set a variable labVmRgName to store the lab VM resource group name
Write-Host "##vso[task.setvariable variable=labVmRgName;]$labVmRgName"

# Set a variable labVMIpAddress to store the lab VM Ip address
Write-Host "##vso[task.setvariable variable=labVMIpAddress;]$labVMIpAddress"

# Set a variable labVMFqdn to store the lab VM FQDN name
Write-Host "##vso[task.setvariable variable=labVMFqdn;]$labVMFqdn"
```

## Create a release pipeline in Azure Pipelines

Next, create the release pipeline in Azure Pipelines. The pipeline tasks use the values you assigned to the VM when you created the ARM template.

1. From your Azure DevOps Services project page, select **Pipelines** > **Releases** from the left navigation.
1. Select **New pipeline**.
1. In the **Select a template** pane, select **Empty job**.
1. Close the **Stage** pane.
1. On the **New release pipeline** page, select the **Variables** tab.
1. Select **Add**, and enter the following **Name** and **Value** pairs, selecting **Add** after adding each one.
   - *vmName*: The VM name you assigned in the ARM template.
   - *userName*: The username to access the VM.
   - *password*: Password for the username. Select the lock icon to hide and secure the password.

### Add an artifact

1. On the new release pipeline page, on the **Pipeline** tab, select **Add an artifact**.
1. On the **Add an artifact pane**, select **Azure Repo**.
1. In the **Project** list, select your DevOps project.
1. In the **Source (repository)** list, select your source repo.
1. In the **Default branch** list, select the branch to check out.
1. Select **Add**.

### Create a DevTest Labs VM

The next step creates a golden image VM to use for future deployments. This step uses the **Azure DevTest Labs Create VM** task.

1. On the new release pipeline page, on the **Pipeline** tab, select the hyperlinked text in **Stage 1**.
1. In the left pane, select the plus sign **+** next to **Agent job**.
1. Under **Add tasks** in the right pane, search for and select **Azure DevTest Labs Create VM**, and select **Add**. 
1. In the left pane, select the **Create Azure DevTest Labs VM** task.
1. In the right pane, fill out the form as follows:

   - **Azure RM Subscription**: Select your service connection or subscription from the dropdown list, and select **Authorize** if necessary.
     > [!NOTE]
     > For information about creating a more restricted permissions connection to your Azure subscription, see [Azure Resource Manager service endpoint](/azure/devops/pipelines/library/service-endpoints#sep-azure-resource-manager).
   - **Lab**: Select your DevTest Labs lab name.
   - **Virtual Machine Name**: the variable you specified for your virtual machine name: *$vmName*.
   - **Template**: Browse to and select the template file you checked in to your project repository.
   - **Parameters File**: If you checked a parameters file into your repository, browse to and select it.
   - **Parameter Overrides**: Enter `-newVMName '$(vmName)' -userName '$(userName)' -password '$(password)'`.
   - Drop down **Output Variables**, and under **Reference name**, enter the variable for the created lab VM ID. Let's enter *vm* for **Reference name** for simplicity. **labVmId** will be an attribute of this variable and will be referred to later as *$vm.labVmId*. If you use any other name, then remember to use it accordingly in the subsequent tasks.

     Lab VM ID will be in the following form: `/subscriptions/{subscription Id}/resourceGroups/{resource group Name}/providers/Microsoft.DevTestLab/labs/{lab name}/virtualMachines/{vmName}`.

### Collect the details of the DevTest Labs VM

Next, the pipeline runs the script you created to collect the details of the DevTest Labs VM.

1. On the release pipeline **Tasks** tab, select the plus sign **+** next to **Agent job**.
1. Under **Add tasks** in the right pane, search for and select **Azure PowerShell**, and select **Add**.
1. In the left pane, select the **Azure PowerShell script: FilePath** task.
1. In the right pane, fill out the form as follows:
   - **Azure Subscription**: Select your service connection or subscription.
   - **Script Type**: Select **Script File Path**.
   - **Script Path**: Browse to and select the PowerShell script that you checked in to your source code repository. You can use built-in properties to simplify the path, for example: `$(System.DefaultWorkingDirectory/Scripts/GetLabVMParams.ps1`.
   - **Script Arguments**: Enter the value as **-labVmId $(vm.labVmId)**.

The script collects the required values and stores them in environment variables within the release pipeline, so you can refer to them in later steps.

### Create a VM image from the DevTest Labs VM

The next task creates an image of the newly deployed VM in your lab. You can use the image to create copies of the VM on demand to do developer tasks or run tests.

1. On the release pipeline **Tasks** tab, select the plus sign **+** next to **Agent job**.
1. Under **Add tasks**, select **Azure DevTest Labs Create Custom Image**, and select **Add**.
1. In the left pane, select the **Azure DevTest Labs Create Custom Image** task.
1. In the right pane, fill out the form as follows:
   - **Azure RM Subscription**: Select your service connection or subscription.
   - **Lab**: Select your lab.
   - **Custom Image Name**: Enter a name for the custom image.
   - **Description**: Enter an optional description to make it easy to select the correct image.
   - **Source Lab VM**: The source **labVmId**. Enter the value as **$(vm.labVmId)**.
   - **Output Variables**: You can edit the name of the default Custom Image ID variable if necessary.
   
### Deploy your app to the DevTest Labs VM (optional)

You can add tasks to deploy your app to the new DevTest Labs VM. If you only want to experiment with creating a DevTest Labs VM and a custom image, without deploying an app, you can skip this step.

The tasks you usually use to deploy apps are **Azure File Copy** and **PowerShell on Target Machines**. You can find the VM information you need for the task parameters in three configuration variables named **labVmRgName**, **labVMIpAddress**, and **labVMFqdn** within the release pipeline. 

### Delete the VM

The final task is to delete the VM that you deployed in your lab. You'd ordinarily delete the VM after you do the developer tasks or run the tests that you need on the deployed VM.

1. On the release pipeline **Tasks** tab, select the plus sign **+** next to **Agent job**.
1. Under **Add tasks**, select **Azure DevTest Labs Delete VM**, and select **Add**. 
1. Configure the task as follows:
   - **Azure RM Subscription**: Select your service connection or subscription.
   - **Lab**: Select your lab.
   - **Virtual Machine**: Enter the value as **$(vm.labVmId)**.
   - **Output Variables**: Under **Reference name**, if you changed the default name of the **labVmId** variable, enter it here. The default value is **$(labVmId)**.
   
### Save the release pipeline

To save the new release pipeline:

1. Select **New release pipeline** at the top of the release pipeline page, and enter a new name for the pipeline.
1. Select **Save** at upper right.

## Create and run a release

To create and run a release using the new pipeline:

1. On the release pipeline page, select **Create release** at upper right. 
1. Under **Artifacts**, select the latest build, and then select **Create**.
   
At each release stage, you can refresh the view of your lab in the Azure portal to see the VM creation, image creation, and VM deletion.

You can use the custom image to create VMs whenever you need them.

## Next steps
- Learn how to [Create multi-VM environments with ARM templates](devtest-lab-create-environment-from-arm.md).
- Explore more quickstart ARM templates for DevTest Labs automation from the [public DevTest Labs GitHub repo](https://github.com/Azure/azure-quickstart-templates).
- If necessary, see [Azure Pipelines troubleshooting](/azure/devops/pipelines/troubleshooting).
 
