<properties
	pageTitle="Overview of the Azure Resource Group project deployment script  | Microsoft Azure"
	description="Describes how the PowerShell script in the Azure Resource Group deployment project works."
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
	ms.date="05/08/2016"
	ms.author="tomfitz" />

# Overview of the Azure Resource Group project deployment script

Azure Resource Group deployment projects help you stage and deploy files and other artifacts to Azure. When you create an Azure Resource Manager deployment project in Visual Studio, a PowerShell script called **Deploy-AzureResourceGroup.ps1** is added to the project. This topic provides details about what this script does and how to execute it both within and outside of Visual Studio.

## What does the script do?

The Deploy-AzureResourceGroup.ps1 script does two things that are important to the deployment workflow.

- Upload any files or artifacts needed for the template deployment
- Deploy the template

The first portion of the script uploads the files and artifacts for deployment, and the last cmdlet in the script actually deploy the template. For example, if a virtual machine needs to be configured with a script, the deployment script first securely uploads the configuration script to an Azure storage account. This makes it available to Azure Resource Manager for configuring the virtual machine during provisioning.

Because not all template deployments need have extra artifacts that need to be uploaded, a switch parameter called *uploadArtifacts* is evaluated. If any artifacts need to be uploaded, set the *uploadArtifacts* switch when calling the script. Note that the main template file and parameters file don’t need to be uploaded. Only other files, such as configuration scripts, nested deployment templates, and application files need to be uploaded.

## Detailed script description

Following is a description of what select sections of the Deploy-AzureResourceGroup.ps1 Azure PowerShell script do.

>[AZURE.NOTE] This describes version 1.0 of the Deploy-AzureResourceGroup.ps1 script.

1.	Declare parameters needed by Azure Resource Manager deployment project. Some parameters have default values that were set when the project was created. You can change these default values in the script or add different parameter values before you execute the script.

    ```
    Param(
      [string] [Parameter(Mandatory=$true)] $ResourceGroupLocation,
      [string] $ResourceGroupName = 'AzureResourceGroup1',
      [switch] $UploadArtifacts,
      [string] $StorageAccountName,
      [string] $StorageAccountResourceGroupName,
      [string] $StorageContainerName = $ResourceGroupName.ToLowerInvariant() + '-stageartifacts',
      [string] $TemplateFile = '..\Templates\azuredeploy.json',
      [string] $TemplateParametersFile = '..\Templates\azuredeploy.parameters.json',
      [string] $ArtifactStagingDirectory = '..\bin\Debug\staging',
      [string] $AzCopyPath = '..\Tools\AzCopy.exe',
      [string] $DSCSourceFolder = '..\DSC'
    )
    ```

    |Parameter|Description|
    |---|---|
    |$ResourceGroupLocation|The region or data center location for the resource group, such as **West US** or **East Asia**.|
    |$ResourceGroupName|The name of the Azure resource group.|
    |$UploadArtifacts|A binary value that indicates whether artifacts need to be uploaded to Azure from your system.|
    |$StorageAccountName|The name of your Azure storage account where your artifacts are uploaded.|
    |$StorageAccountResourceGroupName|The name of the Azure resource group that contains the storage account.|
    |$StorageContainerName|The name of the storage container used for uploading artifacts.|
    |$TemplateFile|The path to the deployment file (`<app name>.json`) in your Azure Resource Group project.|
    |$TemplateParametersFile|The path to the parameters file (`<app name>.parameters.json`) in your Azure Resource Group project.|
    |$ArtifactStagingDirectory|The path on your system where artifacts are locally uploaded, including the PowerShell script root folder. This path can be absolute or relative to the script location.|
    |$AzCopyPath|The path where the AzCopy.exe tool copies its .zip files, including the PowerShell script root folder. This path can be absolute or relative to the script location.|
    |$DSCSourceFolder|The path to the DSC (Desired State Configuration) source folder, including the PowerShell script root folder. This path can be absolute or relative to the script location. See [Introducing the Azure PowerShell DSC (Desired State Configuration) extension](http://blogs.msdn.com/b/powershell/archive/2014/08/07/introducing-the-azure-powershell-dsc-desired-state-configuration-extension.aspx), if applicable, for more information.|

1.	Check to see whether artifacts need to be uploaded to Azure. If not, skip to step 11. Otherwise, perform the following steps.

1.	Convert any variables with relative paths to absolute paths. For example, change a path such as `..\Tools\AzCopy.exe` to `C:\YourFolder\Tools\AzCopy.exe`. Also, initialize the variables *ArtifactsLocationName* and *ArtifactsLocationSasTokenName* to null. *ArtifactsLocation* and *SaSToken* may be parameters to the template. If their values are null after reading in the parameters file, the script generates values for them.

    The Azure Tools use the parameter values *_artifactsLocation* and *_artifactsLocationSasToken* in the template to manage artifacts. If the PowerShell script finds parameters with those names, but the parameter values are not provided, the script uploads the artifacts and returns appropriate values for those parameters. It then passes them to the cmdlet via `@OptionsParameters`.

	|Variable|Description|
    |---|---|
    |ArtifactsLocationName|The path to where the Azure artifacts are located.|
    |ArtifactsLocationSasTokenName|The SAS (Shared Access Signature) token name that’s used by the script to authenticate to Service Bus. See [Shared Access Signature Authentication with Service Bus](service-bus-shared-access-signature-authentication.md) for more information.|

	```
    if ($UploadArtifacts) {
    # Convert relative paths to absolute paths if needed
    $AzCopyPath = [System.IO.Path]::Combine($PSScriptRoot, $AzCopyPath)
    $ArtifactStagingDirectory = [System.IO.Path]::Combine($PSScriptRoot, $ArtifactStagingDirectory)
    $DSCSourceFolder = [System.IO.Path]::Combine($PSScriptRoot, $DSCSourceFolder)

    Set-Variable ArtifactsLocationName '_artifactsLocation' -Option ReadOnly
    Set-Variable ArtifactsLocationSasTokenName '_artifactsLocationSasToken' -Option ReadOnly

    $OptionalParameters.Add($ArtifactsLocationName, $null)
    $OptionalParameters.Add($ArtifactsLocationSasTokenName, $null)
    ```

1.	This section checks whether the <app name>.parameters.json file (referred to as the “Parameters file”) has a parent node named **parameters** (in the `else` block). Otherwise, it has no parent node. Either format is acceptable.
    
	```
    if ($JsonParameters -eq $null) {
            $JsonParameters = $JsonContent
        }
        else {
            $JsonParameters = $JsonContent.parameters
        }
    ```

1.	Iterate through the collection of JSON parameters. If a parameter value has been assigned to *_artifactsLocation* or *_artifactsLocationSasToken*, then set the variable *$OptionalParameters* with those values. This prevents the script from inadvertently overwriting any parameter values you provide.

    ```
    $JsonParameters | Get-Member -Type NoteProperty | ForEach-Object {
        $ParameterValue = $JsonParameters | Select-Object -ExpandProperty $_.Name

        if ($_.Name -eq $ArtifactsLocationName -or $_.Name -eq $ArtifactsLocationSasTokenName) {
            $OptionalParameters[$_.Name] = $ParameterValue.value
        }
    }
    ```

1.	Get the Storage account key and context for the Storage account resource used to hold the artifacts for deployment.

    ```
    $StorageAccountKey = (Get-AzureRMStorageAccountKey -ResourceGroupName $StorageAccountResourceGroupName -Name $StorageAccountName).Key1

    $StorageAccountContext = (Get-AzureRmStorageAccount -ResourceGroupName $StorageAccountResourceGroupName -Name $StorageAccountName).Context
    ```

1.	If you're using PowerShell DSC to configure a virtual machine, the DSC extension requires the artifacts to be in a single zip file. So, create a .zip archive file for the DSC configuration. To do this, check to see if $DSCSourceFolder exists. If a DSC configuration exists, remove it and then create a new compressed file called dsc.zip.

    ```
    # Create DSC configuration archive
    if (Test-Path $DSCSourceFolder) {
    Add-Type -Assembly System.IO.Compression.FileSystem
        $ArchiveFile = Join-Path $ArtifactStagingDirectory "dsc.zip"
        Remove-Item -Path $ArchiveFile -ErrorAction SilentlyContinue
        [System.IO.Compression.ZipFile]::CreateFromDirectory($DSCSourceFolder, $ArchiveFile)
    }
    ```

1.	If no path for Azure artifacts is provided in the Parameters file, set a path for the PowerShell script to use when uploading artifacts. To do this, create a path using a combination of the Storage account’s endpoint path plus the Storage container name. Then, update the Parameters file with this new path.

    ```
    # Generate the value for artifacts location if it is not provided in the parameter file
    $ArtifactsLocation = $OptionalParameters[$ArtifactsLocationName]
    if ($ArtifactsLocation -eq $null) {
        $ArtifactsLocation = $StorageAccountContext.BlobEndPoint + $StorageContainerName
        $OptionalParameters[$ArtifactsLocationName] = $ArtifactsLocation
    }
    ```

1.	Use the **AzCopy** utility (included in the **Tools** folder of your Azure Resource Group deployment project) to copy any files from your local Storage drop path into your online Azure Storage account. If this step fails, exit the script since the deployment is not likely to succeed without the required artifacts.

    ```
    # Use AzCopy to copy files from the local storage drop path to the storage account container
    & $AzCopyPath """$ArtifactStagingDirectory""", $ArtifactsLocation, "/DestKey:$StorageAccountKey", "/S", "/Y", "/Z:$env:LocalAppData\Microsoft\Azure\AzCopy\$ResourceGroupName"
    if ($LASTEXITCODE -ne 0) { return }
    ```

1.	If an SAS token for the artifacts location isn’t provided in the Parameters file, create one to provide temporary read-only access to the online Storage container. Then, pass that SAS token on to the cmdline as an “optionalParameter.” Note that any parameters passed on the cmdline will take precedence over values provided in the parameters file.

    ```
    # Generate the value for artifacts location SAS token if it is not provided in the parameter file
    $ArtifactsLocationSasToken = $OptionalParameters[$ArtifactsLocationSasTokenName]
    if ($ArtifactsLocationSasToken -eq $null) {
       # Create a SAS token for the storage container - this gives temporary read-only access to the container
       $ArtifactsLocationSasToken = New-AzureStorageContainerSASToken -Container $StorageContainerName -Context $StorageAccountContext -Permission r -ExpiryTime (Get-Date).AddHours(4)
       $ArtifactsLocationSasToken = ConvertTo-SecureString $ArtifactsLocationSasToken -AsPlainText -Force
       $OptionalParameters[$ArtifactsLocationSasTokenName] = $ArtifactsLocationSasToken
    }
    ```

1.  Create the resource group if it does not already exist and check the template and parameters file for any validation errors that will prevent the deployment from succeeding.

    ```
	# Create or update the resource group using the specified template file and template parameters file
    New-AzureRMResourceGroup -Name $ResourceGroupName -Location $ResourceGroupLocation -Verbose -Force -ErrorAction Stop

	Test-AzureRmResourceGroupDeployment -ResourceGroupName $ResourceGroupName -TemplateFile $TemplateFile -TemplateParameterFile $TemplateParametersFile @OptionalParameters -ErrorAction Stop
    ```

1. Finally, deploy the template. This code creates a unique name for the deployment using a timestamp.

    ```
    New-AzureRMResourceGroupDeployment -Name ((Get-ChildItem $TemplateFile).BaseName + '-' + ((Get-Date).ToUniversalTime()).ToString('MMdd-HHmm')) `
        -ResourceGroupName $ResourceGroupName `
        -TemplateFile $TemplateFile `
        -TemplateParameterFile $TemplateParametersFile `
        @OptionalParameters `
        -Force -Verbose
    ```

## Deploy the resource group

### To deploy the resource group in Visual Studio

1. On the shortcut menu of the Azure Resource Group project, choose **Deploy** > **New Deployment**.

    ![][0]

1. In the **Deploy to Resource Group** dialog box, either choose an existing resource group in the dropdown list box to deploy to or choose **&lt;Create New…&gt;** to create a new resource group.

    ![][1]

1. If prompted, enter a resource group name and location in the **Create Resource Group** dialog box and then choose the **Create** button.

    ![][2]

1. Choose the **Edit Parameters** button to view the **Edit Parameters** dialog box and then enter any missing parameter values.

    ![][3]

	>[AZURE.NOTE] If any required parameters need values, this dialog automatically appears when you deploy.

    ![][4]

1. When you’re done enter parameter values, choose the **Save** button, and then choose the **Deploy** button.

    The deployment script (Deploy-AzureResourceGroup.ps1) runs and your template, along with any artifacts, deploys to Azure.

### To deploy the resource group by using PowerShell

If you want to run the script without using the Visual Studio Deploy command and UI, on the shortcut menu for the script, choose **Open with PowerShell ISE**.

![][5]


## Command deployment examples

### Deploy using default values

This example shows how to run the script using the default parameter values. (Because the location parameter does not have a default value, you have to provide one.)

`.\Deploy-AzureResourceGroup.ps1 -ResourceGroupLocation eastus`

### Deploy overriding the default values

This example shows how to run the script to deploy template and parameters files that differ from the default values.

```
.\Deploy-AzureResourceGroup.ps1 -ResourceGroupLocation eastus –TemplateFile ..\templates\AnotherTemplate.json –TemplateParametersFile ..\templates\AnotherTemplate.parameters.json
```

### Deploy using UploadArtifacts for staging

This example shows how to run the script to upload artifacts from the release folder and deploy non-default templates.

```
.\Deploy-AzureResourceGroup.ps1 -StorageAccountName 'mystorage' -StorageAccountResourceGroupName 'Default-Storage-EastUS' -ResourceGroupName 'myResourceGroup' -ResourceGroupLocation 'eastus' -TemplateFile '..\templates\windowsvirtualmachine.json' -TemplateParametersFile '..\templates\windowsvirtualmachine.parameters.json' -UploadArtifacts -ArtifactStagingDirectory ..\bin\release\staging
```

This example shows how to run the script in an Azure PowerShell task in Visual Studio Online.

```
$(Build.StagingDirectory)/AzureResourceGroup1/Scripts/Deploy-AzureResourceGroup.ps1 -StorageAccountName 'mystorage' -StorageAccountResourceGroupName 'Default-Storage-EastUS' -ResourceGroupName 'myResourceGroup' -ResourceGroupLocation 'eastus' -TemplateFile '..\templates\windowsvirtualmachine.json' -TemplateParametersFile '..\templates\windowsvirtualmachine.parameters.json' -UploadArtifacts -ArtifactStagingDirectory $(Build.StagingDirectory)
```

## Next steps
Learn more about Azure Resource Manager by reading [Azure Resource Manager overview](resource-group-overview.md).

[0]: ./media/vs-azure-tools-resource-groups-how-script-works/deploy1c.png
[1]: ./media/vs-azure-tools-resource-groups-how-script-works/deploy2bc.png
[2]: ./media/vs-azure-tools-resource-groups-how-script-works/deploy3bc.png
[3]: ./media/vs-azure-tools-resource-groups-how-script-works/deploy4bc.png
[4]: ./media/vs-azure-tools-resource-groups-how-script-works/deploy5c.png
[5]: ./media/vs-azure-tools-resource-groups-how-script-works/deploy6c.png