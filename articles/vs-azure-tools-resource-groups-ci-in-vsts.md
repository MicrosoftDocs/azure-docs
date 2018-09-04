---
title: Continuous integration in Azure DevOps Services using Azure Resource Group projects | Microsoft Docs
description: Describes how to set up continuous integration in Azure DevOps Services by using Azure Resource Group deployment projects in Visual Studio.
services: visual-studio-online
documentationcenter: na
author: mlearned
manager: erickson-doug
editor: ''

ms.assetid: b81c172a-be87-4adc-861e-d20b94be9e38
ms.service: azure-resource-manager
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/01/2016
ms.author: mlearned

---
# Continuous integration in Azure DevOps Services using Azure Resource Group deployment projects
To deploy an Azure template, you perform tasks in various stages: Build, Test, Copy to Azure (also called "Staging"), and Deploy Template. There are two different ways to deploy templates to Azure DevOps Services. Both methods provide the same results, so choose the one that best fits your workflow.

1. Add a single step to your build pipeline that runs the PowerShell script that’s included in the Azure Resource Group deployment project (Deploy-AzureResourceGroup.ps1). The script copies artifacts and then deploys the template.
2. Add multiple Azure DevOps Services build steps, each one performing a stage task.

This article demonstrates both options. The first option has the advantage of using the same script used by developers in Visual Studio and providing consistency throughout the lifecycle. The second option offers a convenient alternative to the built-in script. Both procedures assume you already have a Visual Studio deployment project checked into Azure DevOps Services.

## Copy artifacts to Azure
Regardless of the scenario, if you have any artifacts that are needed for template deployment, you must give Azure Resource Manager access to them. These artifacts can include files such as:

* Nested templates
* Configuration scripts and DSC scripts
* Application binaries

### Nested Templates and Configuration Scripts
When you use the templates provided by Visual Studio (or built with Visual Studio snippets), the PowerShell script not only stages the artifacts, it also parameterizes the URI for the resources for different deployments. The script then copies the artifacts to a secure container in Azure, creates a SaS token for that container, and then passes that information on to the template deployment. See [Create a template deployment](https://msdn.microsoft.com/library/azure/dn790564.aspx) to learn more about nested templates.  When using tasks in Azure DevOps Services, you must select the appropriate tasks for your template deployment and if necessary, pass parameter values from the staging step to the template deployment.

## Set up continuous deployment in Azure Pipelines
To call the PowerShell script in Azure Pipelines, you need to update your build pipeline. In brief, the steps are: 

1. Edit the build pipeline.
2. Set up Azure authorization in Azure Pipelines.
3. Add an Azure PowerShell build step that references the PowerShell script in the Azure Resource Group deployment project.
4. Set the value of the *-ArtifactsStagingDirectory* parameter to work with a project built in Azure Pipelines.

### Detailed walkthrough for Option 1
The following procedures walk you through the steps necessary to configure continuous deployment in Azure DevOps Services using a single task that runs the PowerShell script in your project. 

1. Edit your Azure DevOps Services build pipeline and add an Azure PowerShell build step. Choose the build pipeline under the **Build pipelines** category and then choose the **Edit** link.
   
   ![Edit build pipeline][0]
2. Add a new **Azure PowerShell** build step to the build pipeline and then choose the **Add build step…** button.
   
   ![Add build step][1]
3. Choose the **Deploy task** category, select the **Azure PowerShell** task, and then choose its **Add** button.
   
   ![Add tasks][2]
4. Choose the **Azure PowerShell** build step and then fill in its values.
   
   1. If you already have an Azure service endpoint added to Azure DevOps Services, choose the subscription in the **Azure Subscription** drop-down list box and then skip to the next section. 
      
      If you don’t have an Azure service endpoint in Azure DevOps Services, you need to add one. This subsection takes you through the process. If your Azure account uses a Microsoft account (such as Hotmail), you must take the following steps to get a Service Principal authentication.

   2. Choose the **Manage** link next to the **Azure Subscription** drop-down list box.
      
      ![Manage Azure subscriptions][3]
   3. Choose **Azure** in the **New Service Endpoint** drop-down list box.
      
      ![New service endpoint][4]
   4. In the **Add Azure Subscription** dialog box, select the **Service Principal** option.
      
      ![Service principal option][5]
   5. Add your Azure subscription information to the **Add Azure Subscription** dialog box. You need to provide the following items:
      
      * Subscription Id
      * Subscription Name
      * Service Principal Id
      * Service Principal Key
      * Tenant Id
   6. Add a name of your choice to the **Subscription** name box. This value appears later in the **Azure Subscription** drop-down list in Azure DevOps Services. 

   7. If you don’t know your Azure subscription ID, you can use one of the following commands to retrieve it.
      
      For PowerShell scripts, use:
      
      `Get-AzureRmSubscription`
      
      For Azure CLI, use:
      
      `azure account show`
   8. To get a Service Principal ID, Service Principal Key, and Tenant ID, follow the procedure in [Create Active Directory application and service principal using portal](resource-group-create-service-principal-portal.md) or [Authenticating a service principal with Azure Resource Manager](resource-group-authenticate-service-principal.md).
   9. Add the Service Principal ID, Service Principal Key, and Tenant ID values to the **Add Azure Subscription** dialog box and then choose the **OK** button.
      
      You now have a valid Service Principal to use to run the Azure PowerShell script.
5. Edit the build pipeline and choose the **Azure PowerShell** build step. Select the subscription in the **Azure Subscription** drop-down list box. (If the subscription doesn't appear, choose the **Refresh** button next the **Manage** link.) 
   
   ![Configure Azure PowerShell build task][8]
6. Provide a path to the Deploy-AzureResourceGroup.ps1 PowerShell script. To do this, choose the ellipsis (…) button next to the **Script Path** box, navigate to the Deploy-AzureResourceGroup.ps1 PowerShell script in the **Scripts** folder of your project, select it, and then choose the **OK** button.    
   
   ![Select path to script][9]
7. After you select the script, update the path to the script so that it’s run from the Build.StagingDirectory (the same directory that *ArtifactsLocation* is set to). You can do this by adding “$(Build.StagingDirectory)/” to the beginning of the script path.
   
    ![Edit path to script][10]
8. In the **Script Arguments** box, enter the following parameters (in a single line). When you run the script in Visual Studio, you can see how VS uses the parameters in the **Output** window. You can use this as a starting point for setting the parameter values in your build step.
   
   | Parameter | Description |
   | --- | --- |
   | -ResourceGroupLocation |The geo-location value where the resource group is located, such as **eastus** or **'East US'**. (Add single quotes if there's a space in the name.) See [Azure Regions](https://azure.microsoft.com/regions/) for more information. |
   | -ResourceGroupName |The name of the resource group used for this deployment. |
   | -UploadArtifacts |This parameter, when present, specifies that artifacts that need to be uploaded to Azure from the local system. You only need to set this switch if your template deployment requires extra artifacts that you want to stage using the PowerShell script (such as configuration scripts or nested templates). |
   | -StorageAccountName |The name of the storage account used to stage artifacts for this deployment. This parameter is only used if you are staging artifacts for deployment. If this parameter is supplied, a new storage account is created if the script has not created one during a previous deployment. If the parameter is specified, the storage account must already exist. |
   | -StorageAccountResourceGroupName |The name of the resource group associated with the storage account. This parameter is required only if you provide a value for the StorageAccountName parameter. |
   | -TemplateFile |The path to the template file in the Azure Resource Group deployment project. To enhance flexibility, use a path for this parameter that is relative to the location of the PowerShell script instead of an absolute path. |
   | -TemplateParametersFile |The path to the parameters file in the Azure Resource Group deployment project. To enhance flexibility, use a path for this parameter that is relative to the location of the PowerShell script instead of an absolute path. |
   | -ArtifactStagingDirectory |This parameter lets the PowerShell script know the folder from where the project’s binary files should be copied. This value overrides the default value used by the PowerShell script. For Azure DevOps Services use, set the value to: -ArtifactStagingDirectory $(Build.StagingDirectory) |
   
   Here’s a script arguments example (line broken for readability):
   
   ```    
   -ResourceGroupName 'MyGroup' -ResourceGroupLocation 'eastus' -TemplateFile '..\templates\azuredeploy.json' 
   -TemplateParametersFile '..\templates\azuredeploy.parameters.json' -UploadArtifacts -StorageAccountName 'mystorageacct' 
   –StorageAccountResourceGroupName 'Default-Storage-EastUS' -ArtifactStagingDirectory '$(Build.StagingDirectory)'    
   ```
   
   When you’re finished, the **Script Arguments** box should resemble the following list:
   
   ![Script arguments][11]
9. After you’ve added all the required items to the Azure PowerShell build step, choose the **Queue** build button to build the project. The **Build** screen shows the output from the PowerShell script.

### Detailed walkthrough for Option 2
The following procedures walk you through the steps necessary to configure continuous deployment in Azure DevOps Services using the built-in tasks.

1. Edit your Azure DevOps Services build pipeline to add two new build steps. Choose the build pipeline under the **Build definitions** category and then choose the **Edit** link.
   
   ![Edit build defintion][12]
2. Add the new build steps to the build pipeline using the **Add build step…** button.
   
   ![Add build step][13]
3. Choose the **Deploy** task category, select the **Azure File Copy** task, and then choose its **Add** button.
   
   ![Add Azure File Copy task][14]
4. Choose the **Azure Resource Group Deployment** task, then choose its **Add** button and then **Close** the **Task Catalog**.
   
   ![Add Azure Resource Group Deployment task][15]
5. Choose the **Azure File Copy** task and fill in its values.
   
   If you already have an Azure service endpoint added to Azure DevOps Services, choose the subscription in the **Azure Subscription** drop-down list box. If you do not have a subscription, see [Option 1](#detailed-walkthrough-for-option-1) for instructions on setting one up in Azure DevOps Services.
   
   * Source - enter **$(Build.StagingDirectory)**
   * Azure Connection Type - select **Azure Resource Manager**
   * Azure RM Subscription - select the subscription for the storage account you want to use in the **Azure Subscription** drop-down list box. If the subscription doesn't appear, choose the **Refresh** button next the **Manage** link.
   * Destination Type - select **Azure Blob**
   * RM Storage Account - select the storage account you would like to use for staging artifacts
   * Container Name - enter the name of the container you would like to use for staging; it can be any valid container name, but use one dedicated to this build pipeline
   
   For the output values:
   
   * Storage Container URI - enter **artifactsLocation**
   * Storage Container SAS Token - enter **artifactsLocationSasToken**
   
   ![Configure Azure File Copy task][16]
6. Choose the **Azure Resource Group Deployment** build step and then fill in its values.
   
   * Azure Connection Type - select **Azure Resource Manager**
   * Azure RM Subscription - select the subscription for deployment in the **Azure Subscription** drop-down list box. This will usually be the same subscription used in the previous step
   * Action - select **Create or Update Resource Group**
   * Resource Group - select a resource group or enter the name of a new resource group for the deployment
   * Location - select the location for the resource group
   * Template - enter the path and name of the template to be deployed prepending **$(Build.StagingDirectory)**, for example: **$(Build.StagingDirectory/DSC-CI/azuredeploy.json)**
   * Template Parameters - enter the path and name of the parameters to be used, prepending **$(Build.StagingDirectory)**, for example: **$(Build.StagingDirectory/DSC-CI/azuredeploy.parameters.json)**
   * Override Template Parameters - enter or copy and paste the following code:
     
     ```    
     -_artifactsLocation $(artifactsLocation) -_artifactsLocationSasToken (ConvertTo-SecureString -String "$(artifactsLocationSasToken)" -AsPlainText -Force)
     ```
     ![Configure Azure Resource Group Deployment Task][17]
7. After you’ve added all the required items, save the build pipeline and choose **Queue new build** at the top.

## Next steps
Read [Azure Resource Manager overview](azure-resource-manager/resource-group-overview.md) to learn more about Azure Resource Manager and Azure resource groups.

[0]: ./media/vs-azure-tools-resource-groups-ci-in-vsts/walkthrough1.png
[1]: ./media/vs-azure-tools-resource-groups-ci-in-vsts/walkthrough2.png
[2]: ./media/vs-azure-tools-resource-groups-ci-in-vsts/walkthrough3.png
[3]: ./media/vs-azure-tools-resource-groups-ci-in-vsts/walkthrough4.png
[4]: ./media/vs-azure-tools-resource-groups-ci-in-vsts/walkthrough5.png
[5]: ./media/vs-azure-tools-resource-groups-ci-in-vsts/walkthrough6.png
[8]: ./media/vs-azure-tools-resource-groups-ci-in-vsts/walkthrough9.png
[9]: ./media/vs-azure-tools-resource-groups-ci-in-vsts/walkthrough10.png
[10]: ./media/vs-azure-tools-resource-groups-ci-in-vsts/walkthrough11b.png
[11]: ./media/vs-azure-tools-resource-groups-ci-in-vsts/walkthrough12.png
[12]: ./media/vs-azure-tools-resource-groups-ci-in-vsts/walkthrough13.png
[13]: ./media/vs-azure-tools-resource-groups-ci-in-vsts/walkthrough14.png
[14]: ./media/vs-azure-tools-resource-groups-ci-in-vsts/walkthrough15.png
[15]: ./media/vs-azure-tools-resource-groups-ci-in-vsts/walkthrough16.png
[16]: ./media/vs-azure-tools-resource-groups-ci-in-vsts/walkthrough17.png
[17]: ./media/vs-azure-tools-resource-groups-ci-in-vsts/walkthrough18.png
