<properties
	pageTitle="Continuous integration in VS Team Services using Azure Resource Group projects | Microsoft Azure"
	description="Describes how to set up continuous integration in Visual Studio Team Services by using Azure Resource Group deployment projects in Visual Studio."
	services="visual-studio-online"
	documentationCenter="na"
	authors="tfitzmac"
	manager="timlt"
	editor="" />

 <tags
	ms.service="azure-resource-manager"
	ms.devlang="multiple"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="na"
	ms.date="04/19/2016"
	ms.author="tomfitz" />

# Continuous integration in Visual Studio Team Services using Azure Resource Group deployment projects

To deploy an Azure template, you need to perform tasks to go through the various stages: Build, Test, Copy to Azure (also called "Staging"), and Deploy Template.  There are two different ways to do this in Visual Studio Team Services (VS Team Services). Both methods provide the same results, so choose the one that best fits your workflow.

-	Add a single step to your build definition that runs the PowerShell script that’s included in the Azure Resource Group deployment project (Deploy-AzureResourceGroup.ps1). The script copies artifacts and then deploys the template.
-	Add multiple VS Team Services build steps, each one performing a stage task.

This article demonstrates how to use the first option (use a build definition to run the PowerShell script). One advantage of this option is that the script used by developers in Visual Studio is the same script that is used by VS Team Services. This procedure assumes you already have a Visual Studio deployment project checked into VS Team Services.

## Copy artifacts to Azure 

Regardless of the scenario, if you have any artifacts that are needed for template deployment, you will need to give Azure Resource Manager access to them. These artifacts can include files such as:

-	Nested templates
-	Configuration scripts and DSC scripts
-	Application binaries

### Nested Templates and Configuration Scripts
When you use the templates provided by Visual Studio (or built with Visual Studio snippets), the PowerShell script not only stages the artifacts, it also parameterizes the URI for the resources for different deployments. The script then copies the artifacts to a secure container in Azure, creates a SaS token for that container, and then passes that information on to the template deployment. See [Create a template deployment](https://msdn.microsoft.com/library/azure/dn790564.aspx) to learn more about nested templates.

## Set up continuous deployment in VS Team Services

To call the PowerShell script in VS Team Services, you need to update your build definition. In brief, the steps are: 

1.	Edit the build definition.
1.	Set up Azure authorization in VS Team Services.
1.	Add an Azure PowerShell build step that references the PowerShell script in the Azure Resource Group deployment project.
1.	Set the value of the *-ArtifactsStagingDirectory* parameter to work with a project built in VS Team Services.

### Detailed walkthrough

The following steps will walk you through the steps necessary to configure continuous deployment in VS Team Services 

1.	Edit your VS Team Services build definition and add an Azure PowerShell build step. Choose the build definition under the **Build definitions** category and then choose the **Edit** link.

    ![][0]

1.	Add a new **Azure PowerShell** build step to the build definition and then choose the **Add build step…** button.

    ![][1]

1.	Choose the **Deploy task** category, select the **Azure PowerShell** task, and then choose its **Add** button.

    ![][2]

1.	Choose the **Azure PowerShell** build step and then fill in its values.

    1.	If you already have an Azure service endpoint added to VS Team Services, choose the subscription in the **Azure Subscription** drop down list box and then skip to the next section. 

        If you don’t have an Azure service endpoint in VS Team Services, you’ll need to add one. This subsection takes you through the process. If your Azure account uses a Microsoft account (such as Hotmail), you’ll need to take the following steps to get a Service Principal authentication.

    1.	Choose the **Manage** link next to the **Azure Subscription** drop down list box.

        ![][3]

    1. Choose **Azure** in the **New Service Endpoint** drop down list box.

        ![][4]

    1.	In the **Add Azure Subscription** dialog box, select the **Service Principal** option.

        ![][5]

    1.	Add your Azure subscription information to the **Add Azure Subscription** dialog box. You’ll need to provide the following items:
        -	Subscription Id
        -	Subscription Name
        -	Service Principal Id
        -	Service Principal Key
        -	Tenant Id

    1.	Add a name of your choice to the **Subscription** name box. This value will appear later in the **Azure Subscription** drop down list in VS Team Services. 

    1.	If you don’t know your Azure subscription ID, you can use one of the following commands to get it.
        
        For PowerShell scripts, use:

        `Get-AzureRmSubscription`

        For Azure CLI, use:

        `azure account show`
    

    1.	To get a Service Principal ID, Service Principal Key, and Tenant ID, follow the procedure in [Create Active Directory application and service principal using portal](resource-group-create-service-principal-portal.md) or [Authenticating a service principal with Azure Resource Manager](resource-group-authenticate-service-principal.md).

    1.	Add the Service Principal ID, Service Principal Key, and Tenant ID values to the **Add Azure Subscription** dialog box and then choose the **OK** button.

        You now have a valid Service Principal to use to run the Azure PowerShell script.

1.	Edit the build definition and choose the **Azure PowerShell** build step. Select the subscription in the **Azure Subscription** drop down list box. (If the subscription doesn't appear, choose the **Refresh** button next the **Manage** link.) 

    ![][8]

1.	Provide a path to the Deploy-AzureResourceGroup.ps1 PowerShell script. To do this, choose the ellipsis (…) button next to the **Script Path** box, navigate to the Deploy-AzureResourceGroup.ps1 PowerShell script in the **Scripts** folder of your project, select it, and then choose the **OK** button.	

    ![][9]

1. After you select the script, update the path to the script so that it’s run from the Build.StagingDirectory (the same directory that *ArtifactsLocation* is set to). You can do this by adding “$(Build.StagingDirectory)/” to the beginning of the script path.

    ![][10]

1.	In the **Script Arguments** box, enter the following parameters (in a single line). When you run the script in Visual Studio, you can see how VS uses the parameters in the **Output** window. You can use this as a starting point for setting the parameter values in your build step.

    | Parameter | Description|
    |---|---|
    | -ResourceGroupLocation           | The geo-location value where the resource group is located, such as **eastus** or **'East US'**. (Add single quotes if there's a space in the name.) See [Azure Regions](https://azure.microsoft.com/en-us/regions/) for more information.|                                                                                                                                                                                                                              |
    | -ResourceGroupName               | The name of the resource group used for this deployment.|                                                                                                                                                                                                                                                                                                                                                                                                                |
    | -UploadArtifacts                 | This parameter, when present, specifies that artifacts need to be uploaded to Azure from the local system. You only need to set this switch if your template deployment requires extra artifacts that you want to stage using the PowerShell script (such as configuration scripts or nested templates).                                                                                                                                                                 |
    | -StorageAccountName              | The name of the storage account used to stage artifacts for this deployment. This parameter is required only if you’re copying artifacts to Azure. This storage account will not be automatically created by the deployment, it must already exist.|                                                                                                                                                                                                                     |
    | -StorageAccountResourceGroupName | The name of the resource group associated with the storage account. This parameter is required only if you’re copying artifacts to Azure.|                                                                                                                                                                                                                                                                                                                               |
    | -TemplateFile                    | The path to the template file in the Azure Resource Group deployment project. To enhance flexibility, use a path for this parameter that is relative to the location of the PowerShell script instead of an absolute path.|
    | -TemplateParametersFile          | The path to the parameters file in the Azure Resource Group deployment project. To enhance flexibility, use a path for this parameter that is relative to the location of the PowerShell script instead of an absolute path.|
    | -ArtifactStagingDirectory        | This parameter lets the PowerShell script know the folder from where the project’s binary files should be copied. This value overrides the default value used by the PowerShell script. For VS Team Services use, set the value to: -ArtifactStagingDirectory $(Build.StagingDirectory)                                                                                                                                                                                              |

    Here’s a script arguments example (line broken for readability):

    ```	
    -ResourceGroupName 'MyGroup' -ResourceGroupLocation 'eastus' -TemplateFile '..\templates\azuredeploy.json' 
    -TemplateParametersFile '..\templates\azuredeploy.parameters.json' -UploadArtifacts -StorageAccountName 'mystorageacct' 
    –StorageAccountResourceGroupName 'Default-Storage-EastUS' -ArtifactStagingDirectory '$(Build.StagingDirectory)'	
    ```

    When you’re finished, the **Script Arguments** box should resemble the following.

    ![][11]

1.	After you’ve added all the required items to the Azure PowerShell build step, choose the **Queue** build button to build the project. The **Build** screen shows the output from the PowerShell script.

## Next steps

Read [Azure Resource Manager overview](resource-group-overview.md) to learn more about Azure Resource Manager and Azure resource groups.


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