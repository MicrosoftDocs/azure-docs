---
title: Integrate Azure DevTest Labs into your Azure Pipelines
description: Learn how to integrate Azure DevTest Labs into your Azure Pipelines continuous integration and delivery pipeline
ms.topic: article
ms.date: 06/26/2020
---

# Integrate Azure DevTest Labs into your Azure Pipelines CI/CD pipeline

You can use the *Azure DevTest Labs Tasks* extension to integrate your Azure Pipelines continuous integration and continuous delivery (CI/CD) build and release pipelines with Azure DevTest Labs. The extension installs several tasks, including: 

- Create a virtual machine (VM)
- Create a custom image from a VM
- Delete a VM 

These tasks make it easy to, for example, quickly deploy a *golden image* VM for a specific test task, and then delete the VM when the test is finished.

This article shows how to use Azure DevTest Labs Tasks to create and deploy a VM, create a custom image, and then delete the VM, all as one release pipeline. You would ordinarily perform the tasks individually in your own custom build, test, and deploy pipelines.

[!INCLUDE [devtest-lab-try-it-out](../../includes/devtest-lab-try-it-out.md)]

## Prerequisites

- Register or log into your [Azure DevOps](https://dev.azure.com) organization, and [create a project](/vsts/organizations/projects/create-project) in the organization. 
  
- Install the Azure DevTest Labs Tasks extension from Visual Studio Marketplace.
  
  1. Go to [Azure DevTest Labs Tasks](https://marketplace.visualstudio.com/items?itemName=ms-azuredevtestlabs.tasks).
  1. Select **Get it free**.
  1. Select your Azure DevOps organization from the dropdown, and select **Install**. 
  
## Create the template to build an Azure VM 

This section describes how to create the Azure Resource Manager template that you use to create an Azure VM on demand.

1. To create a Resource Manager template in your subscription, follow the procedure in [Use a Resource Manager template](devtest-lab-use-resource-manager-template.md).
   
1. Before you generate the Resource Manager template, add the [WinRM artifact](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts/windows-winrm) as part of creating the VM. Deployment tasks like *Azure File Copy* and *PowerShell on Target Machines* need WinRM access. The WinRM artifact requires a hostname as a parameter, which should be the fully qualified domain name (FQDN) of the VM. 
   
   > [!NOTE]
   > When you use WinRM with a shared IP address, you must add a NAT rule to map an external port to the WinRM port. You don't need the NAT rule if you create the VM with a public IP address.
   
   
1. Save the template to your computer as a file named *CreateVMTemplate.json*.
   
1. Check in the template to your source control system.

## Create a script to get VM properties

When you run task steps like *Azure File Copy* or *PowerShell on Target Machines* in the release pipeline, the following script collects the values that you need to deploy an app to a VM. You would ordinarily use these tasks to deploy your app to an Azure VM. The tasks require values such as the VM resource group name, IP address, and FQDN.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

To create the script file:

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

1. Save the file with a name like *GetLabVMParams.ps1*, and check it in to your source control system. 

## Create a release pipeline in Azure Pipelines

To create a new release pipeline:

1. From your Azure DevOps project page, select **Pipelines** > **Releases** from the left navigation.
1. Select **New Pipeline**.
1. Under **Select a template**, scroll down and select **Empty job**, and then select **Apply**.

### Add and set variables

The pipeline tasks use the values you assigned to the VM when you created the Resource Manager template in the Azure portal. 

To add variables for the values: 

1. On the pipeline page, select the **Variables** tab.
   
1. For each variable, select **Add** and enter the name and value:
   
   |Name|Value|
   |---|---|
   |*vmName*|VM name you assigned in the Resource Manager template|
   |*userName*|Username to access the VM|
   |*password*|Password for the username. Select the lock icon to hide and secure the password.

### Create a DevTest Labs VM

The next step is to create the golden image VM to use for future deployments. You create the VM within your Azure DevTest Labs instance by using the *Azure DevTest Labs Create VM* task.

1. On the release pipeline **Pipeline** tab, select the hyperlinked text in **Stage 1** to **View stage tasks**, and then select the plus sign **+** next to **Agent job**. 
   
1. Under **Add tasks**, select **Azure DevTest Labs Create VM**, and select **Add**. 
   
1. Select **Create Azure DevTest Labs VM** in the left pane. 

1. In the right pane, fill out the form as follows:
   
   |Field|Value|
   |---|---|
   |**Azure RM Subscription**|Select a service connection or subscription from **Available Azure Service Connections** or **Available Azure Subscriptions** in the dropdown, and select **Authorize** if necessary.<br /><br />**Note:** For information about creating a more restricted permissions connection to your Azure subscription, see [Azure Resource Manager service endpoint](/azure/devops/pipelines/library/service-endpoints#sep-azure-resource-manager).|
   |**Lab Name**|Select the name of an existing lab in which the lab VM will be created.|
   |**Template Name**|Enter the full path and name of the template file you saved to your source code repository. You can use built-in properties to simplify the path, for example:<br /><br />`$(System.DefaultWorkingDirectory)/Templates/CreateVMTemplate.json`|
   |**Template Parameters**|Enter the parameters for the variables you defined earlier:<br /><br />`-newVMName '$(vmName)' -userName '$(userName)' -password (ConvertTo-SecureString -String '$(password)' -AsPlainText -Force)`|
   |**Output Variables** > **Lab VM ID**|Enter the variable for the created lab VM ID. If you use the default **labVMId**, you can refer to the variable in subsequent tasks as *$(labVMId)*.<br /><br />You can create a name other than the default, but remember to use the correct name in subsequent tasks. You can write the Lab VM ID in the following form:<br /><br />`/subscriptions/{subscription Id}/resourceGroups/{resource group Name}/providers/Microsoft.DevTestLab/labs/{lab name}/virtualMachines/{vmName}`|

### Collect the details of the DevTest Labs VM

Execute the script you created earlier to collect the details of the DevTest Labs VM. 

1. On the release pipeline **Pipeline** tab, select the hyperlinked text in **Stage 1** to **View stage tasks**, and then select the plus sign **+** next to **Agent job**. 
   
1. Under **Add tasks**, select **Azure PowerShell**, and select **Add**. 
   
1. Select **Azure PowerShell script: FilePath** in the left pane. 
   
1. In the right pane, fill out the form as follows:
   
   |Field|Value|
   |---|---|
   |**Azure Connection Type**|Select **Azure Resource Manager**.|
   |**Azure Subscription**|Select your service connection or subscription.| 
   |**Script Type**|Select **Script File Path**.|
   |**Script Path**|Enter the full path and name of the PowerShell script that you saved to your source code repository. You can use built-in properties to simplify the path, for example:<br /><br />`$(System.DefaultWorkingDirectory/Scripts/GetLabVMParams.ps1`|
   |**Script Arguments**|Enter the name of the *labVmId* variable that was populated by the previous task, for example:<br /><br />`-labVmId '$(labVMId)'`|

The script collects the required values and stores them in environment variables within the release pipeline, so you can easily refer to them in subsequent steps.

### Create a VM image from the DevTest Labs VM

The next task is to create an image of the newly deployed VM in your Azure DevTest Labs instance. You can then use the image to create copies of the VM on demand whenever you want to execute a dev task or run some tests. 

1. On the release pipeline **Pipeline** tab, select the hyperlinked text in **Stage 1** to **View stage tasks**, and then select the plus sign **+** next to **Agent job**. 
   
1. Under **Add tasks**, select **Azure DevTest Labs Create Custom Image**, and select **Add**. 
   
1. Configure the task as follows:
   
   |Field|Value|
   |---|---|
   |**Azure RM Subscription**|Select your service connection or subscription.|
   |**Lab Name**|Select the name of an existing lab in which the image will be created.|
   |**Custom Image Name**|Enter a name for the custom image.|
   |**Description** (optional)|Enter a description to make it easy to select the correct image later.|
   |**Source Lab VM** > **Source Lab VM ID**|If you changed the default name of the LabVMId variable, enter it here. The default value is **$(labVMId)**.|
   |**Output Variables** > **Custom Image ID**|You can edit the default name of the variable if necessary.|
   
### Deploy your app to the DevTest Labs VM (optional)

You can add tasks to deploy your app to the new DevTest Labs VM. The tasks you usually use to deploy the app are *Azure File Copy* and *PowerShell on Target Machines*.

The VM information you need for the parameters of these tasks is stored in three configuration variables named **labVmRgName**, **labVMIpAddress**, and **labVMFqdn** within the release pipeline. If you only want to experiment with creating a DevTest Labs VM and a custom image, without deploying an app to it, you can skip this step.

### Delete the VM

The final task is to delete the VM that you deployed in your Azure DevTest Labs instance. You would ordinarily delete the VM after you execute the dev tasks or run the tests that you need on the deployed VM. 

1. On the release pipeline **Pipeline** tab, select the hyperlinked text in **Stage 1** to **View stage tasks**, and then select the plus sign **+** next to **Agent job**. 
   
1. Under **Add tasks**, select **Azure DevTest Labs Delete VM**, and select **Add**. 
   
1. Configure the task as follows:
   
   - Under **Azure RM Subscription**, select your service connection or subscription. 
   - For **Lab VM ID**, if you changed the default name of the LabVMId variable, enter it here. The default value is **$(labVMId)**.
   
### Save the release pipeline

To save the new release pipeline:

1. Select the name **New release pipeline** on the release pipeline page, and enter a new name for the pipeline. 
   
1. Select the **Save** icon at upper right. 

## Create and run a release

To create and run a release using the new pipeline:

1. Select **Create release** at upper right on the release pipeline page. 
   
1. Under **Artifacts**, select the latest build, and then select **Create**.
   
1. At each release stage, refresh the view of your DevTest Labs instance in the Azure portal to view the VM creation, image creation, and VM deletion.

You can use the custom image to create VMs whenever you need them.

## Next steps
- Learn how to [Create multi-VM environments with Resource Manager templates](devtest-lab-create-environment-from-arm.md).
- Explore more quickstart Resource Manager templates for DevTest Labs automation from the [public DevTest Labs GitHub repo](https://github.com/Azure/azure-quickstart-templates).
- If necessary, see the [Azure DevOps troubleshooting](https://docs.microsoft.com/azure/devops/pipelines/troubleshooting) page.
 
