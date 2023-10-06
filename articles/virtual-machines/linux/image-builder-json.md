---
title: Create an Azure Image Builder Bicep file or ARM template JSON template
description: Learn how to create a Bicep file or ARM template JSON template to use with Azure Image Builder.
author: kof-f
ms.author: kofiforson
ms.reviewer: erd
ms.date: 10/03/2023
ms.topic: reference
ms.service: virtual-machines
ms.subservice: image-builder
ms.custom: references_regions, devx-track-bicep, devx-track-arm-template, devx-track-linux
---

# Create an Azure Image Builder Bicep or ARM template JSON template

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets

Azure Image Builder uses a Bicep file or an ARM template JSON template file to pass information into the Image Builder service. In this article we go over the sections of the files, so you can build your own. For latest API versions, see [template reference](/azure/templates/microsoft.virtualmachineimages/imagetemplates?tabs=bicep&pivots=deployment-language-bicep). To see examples of full .json files, see the [Azure Image Builder GitHub](https://github.com/Azure/azvmimagebuilder/tree/main/quickquickstarts).

The basic format is:

# [JSON](#tab/json)

```json
{
  "type": "Microsoft.VirtualMachineImages/imageTemplates",
  "apiVersion": "2022-02-14",
  "location": "<region>",
  "tags": {
    "<name>": "<value>",
    "<name>": "<value>"
  },
  "identity": {},
  "properties": {
    "buildTimeoutInMinutes": <minutes>,
    "customize": [],
    "errorHandling":[],
    "distribute": [],
    "optimize": [],
    "source": {},
    "stagingResourceGroup": "/subscriptions/<subscriptionID>/resourceGroups/<stagingResourceGroupName>",
    "validate": {},
    "vmProfile": {
      "vmSize": "<vmSize>",
      "osDiskSizeGB": <sizeInGB>,
      "vnetConfig": {
        "subnetId": "/subscriptions/<subscriptionID>/resourceGroups/<vnetRgName>/providers/Microsoft.Network/virtualNetworks/<vnetName>/subnets/<subnetName>",
        "proxyVmSize": "<vmSize>"
      },
      "userAssignedIdentities": [
              "/subscriptions/<subscriptionID>/resourceGroups/<identityRgName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identityName1>",
        "/subscriptions/<subscriptionID>/resourceGroups/<identityRgName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identityName2>",
        "/subscriptions/<subscriptionID>/resourceGroups/<identityRgName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identityName3>",
        ...
      ]
    }
  }
}
```

# [Bicep](#tab/bicep)

```bicep
resource azureImageBuilder 'Microsoft.VirtualMachineImages/imageTemplates@2022-02-14' = {
  name: azureImageBuilderName
  location: '<region>'
  tags:{
    <name>: '<value>'
    <name>: '<value>'
  }
  identity:{}
  properties:{
    buildTimeoutInMinutes: <minutes>
    customize: []
    distribute: []
    source: {}
    stagingResourceGroup: '/subscriptions/<subscriptionID>/resourceGroups/<stagingResourceGroupName>'
    validate: {}
    vmProfile:{
      vmSize: '<vmSize>'
      osDiskSizeGB: <sizeInGB>
      vnetConfig: {
        subnetId: '/subscriptions/<subscriptionID>/resourceGroups/<vnetRgName>/providers/Microsoft.Network/virtualNetworks/<vnetName>/subnets/<subnetName>'
        proxyVmSize: '<vmSize>'
      }
      userAssignedIdentities: [
        '/subscriptions/<subscriptionID>/resourceGroups/<identityRgName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identityName1>'
        '/subscriptions/<subscriptionID>/resourceGroups/<identityRgName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identityName2>'
        '/subscriptions/<subscriptionID>/resourceGroups/<identityRgName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identityName3>'
        ...
      ]
    }
  }
}

```

---

## Type and API version

The `type` is the resource type, which must be `Microsoft.VirtualMachineImages/imageTemplates`. The `apiVersion` will change over time as the API changes. See [What's new in Azure VM Image Builder](../image-builder-api-update-release-notes.md) for all major API changes and feature updates for the Azure VM Image Builder service.

# [JSON](#tab/json)

```json
"type": "Microsoft.VirtualMachineImages/imageTemplates",
"apiVersion": "2022-02-14",
```

# [Bicep](#tab/bicep)

```bicep
resource azureImageBuilder 'Microsoft.VirtualMachineImages/imageTemplates@2022-02-14' = {}
```

---

## Location

The location is the region where the custom image is created. The following regions are supported:

- East US
- East US 2
- West Central US
- West US
- West US 2
- West US 3
- South Central US
- North Europe
- West Europe
- South East Asia
- Australia Southeast
- Australia East
- UK South
- UK West
- Brazil South
- Canada Central
- Central India
- Central US
- France Central
- Germany West Central
- Japan East
- North Central US
- Norway East
- Switzerland North
- Jio India West
- UAE North
- East Asia
- Korea Central
- South Africa North
- Qatar Central
- USGov Arizona (Public Preview)
- USGov Virginia (Public Preview)
- China North 3 (Public Preview)
- Sweden Central
- Poland Central

> [!IMPORTANT]
> Register the feature `Microsoft.VirtualMachineImages/FairfaxPublicPreview` to access the Azure Image Builder public preview in Azure Government regions (USGov Arizona and USGov Virginia).

> [!IMPORTANT]
> Register the feature `Microsoft.VirtualMachineImages/MooncakePublicPreview` to access the Azure Image Builder public preview in the China North 3 region.

To access the Azure VM Image Builder public preview in the Azure Government regions (USGov Arizona and USGov Virginia), you must register the *Microsoft.VirtualMachineImages/FairfaxPublicPreview* feature. To do so, run the following command in either PowerShell or Azure CLI:

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Register-AzProviderPreviewFeature -ProviderNamespace Microsoft.VirtualMachineImages -Name FairfaxPublicPreview
```

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az feature register --namespace Microsoft.VirtualMachineImages --name FairfaxPublicPreview
```

---

To access the Azure VM Image Builder public preview in the China North 3 region, you must register the *Microsoft.VirtualMachineImages/MooncakePublicPreview* feature. To do so, run the following command in either PowerShell or Azure CLI:

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Register-AzProviderPreviewFeature -ProviderNamespace Microsoft.VirtualMachineImages -Name MooncakePublicPreview
```

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az feature register --namespace Microsoft.VirtualMachineImages --name MooncakePublicPreview
```

---

# [JSON](#tab/json)

```json
"location": "<region>"
```

# [Bicep](#tab/bicep)

```bicep
location: '<region>'
```

---

### Data residency

The Azure VM Image Builder service doesn't store or process customer data outside regions that have strict single region data residency requirements when a customer requests a build in that region. If a service outage for regions that have data residency requirements, you need to create Bicep files/templates in a different region and geography.

### Zone redundancy

Distribution supports zone redundancy, VHDs are distributed to a Zone Redundant Storage (ZRS) account by default and the Azure Compute Gallery (formerly known as Shared Image Gallery) version will support a [ZRS storage type](../disks-redundancy.md#zone-redundant-storage-for-managed-disks) if specified.

## Tags

Tags are key/value pairs you can specify for the image that's generated.

## Identity

There are two ways to add user assigned identities explained below.

### User-assigned identity for Azure Image Builder image template resource

Required - For Image Builder to have permissions to read/write images, and read in scripts from Azure Storage, you must create an Azure user-assigned identity that has permissions to the individual resources. For details on how Image Builder permissions work, and relevant steps, see [Create an image and use a user-assigned managed identity to access files in an Azure storage account](image-builder-user-assigned-identity.md).

# [JSON](#tab/json)

```json
"identity": {
    "type": "UserAssigned",
    "userAssignedIdentities": {
        "<imgBuilderId>": {}
    }
}
```

# [Bicep](#tab/bicep)

```bicep
identity:{
  type:'UserAssigned'
  userAssignedIdentities:{
    '<imgBuilderId>': {}
  }
}
```

---

The Image Builder service User Assigned Identity:

- Supports a single identity only.
- Doesn't support custom domain names.

To learn more, see [What is managed identities for Azure resources?](../../active-directory/managed-identities-azure-resources/overview.md).
For more information on deploying this feature, see [Configure managed identities for Azure resources on an Azure VM using Azure CLI](../../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md#user-assigned-managed-identity).

### User-assigned identity for the Image Builder Build VM

This property is only available in API versions `2021-10-01` or newer.

Optional - The Image Builder Build VM that is created by the Image Builder service in your subscription is used to build and customize the image. For the Image Builder Build VM to have permissions to authenticate with other services like Azure Key Vault in your subscription, you must create one or more Azure User Assigned Identities that have permissions to the individual resources. Azure Image Builder can then associate these User Assigned Identities with the Build VM. Customizer scripts running inside the Build VM can then fetch tokens for these identities and interact with other Azure resources as needed. Be aware, the user assigned identity for Azure Image Builder must have the "Managed Identity Operator" role assignment on all the user assigned identities for Azure Image Builder to be able to associate them to the build VM.

> [!NOTE]
> Be aware that multiple identities can be specified for the Image Builder Build VM, including the identity you created for the [image template resource](#user-assigned-identity-for-azure-image-builder-image-template-resource). By default, the identity you created for the image template resource won't automatically be added to the build VM.

# [JSON](#tab/json)

```json
"properties": {
  "vmProfile": {
    "userAssignedIdentities": [
      "/subscriptions/<subscriptionID>/resourceGroups/<identityRgName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identityName>"
    ]
  }
}
```

# [Bicep](#tab/bicep)

```bicep
properties:{
  vmProfile:{
    userAssignedIdentities: [
      '/subscriptions/<subscriptionID>/resourceGroups/<identityRgName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identityName>'
    ]
  }
}
```

---

The Image Builder Build VM User Assigned Identity:

- Supports a list of one or more user assigned managed identities to be configured on the VM.
- Supports cross subscription scenarios (identity created in one subscription while the image template is created in another subscription under the same tenant).
- Doesn't support cross tenant scenarios (identity created in one tenant while the image template is created in another tenant).

To learn more, see:

- [How to use managed identities for Azure resources on an Azure VM to acquire an access token](../../active-directory/managed-identities-azure-resources/how-to-use-vm-token.md)
- [How to use managed identities for Azure resources on an Azure VM for sign-in](../../active-directory/managed-identities-azure-resources/how-to-use-vm-sign-in.md)

## Properties: buildTimeoutInMinutes

Maximum duration to wait while building the image template (includes all customizations, validations, and distributions).

If you don't specify the property or set the value to 0, the default value is used, which is 240 minutes or four hours. The minimum value is 6 minutes, and the maximum value is 960 minutes or 16 hours. When the timeout value is hit (whether or not the image build is complete), you see an error similar to:

```text
[ERROR] Failed while waiting for packerizer: Timeout waiting for microservice to
[ERROR] complete: 'context deadline exceeded'
```

For Windows, we don't recommend setting `buildTimeoutInMinutes` below 60 minutes. If you find you're hitting the timeout, review the [logs](image-builder-troubleshoot.md#customization-log) to see if the customization step is waiting on something like user input. If you find you need more time for customizations to complete, increase the  `buildTimeoutInMinutes` value. But, don't set it too high because you might have to wait for it to time out before seeing an error.

## Properties: customize

Image Builder supports multiple "customizers", which are functions used to customize your image, such as running scripts, or rebooting servers.

When using `customize`:

- You can use multiple customizers.
- Customizers execute in the order specified in the template.
- If one customizer fails, then the whole customization component will fail and report back an error.
- Test the scripts thoroughly before using them in a template. Debugging the scripts by themselves is easier.
- Don't put sensitive data in the scripts. Inline commands can be viewed in the image template definition. If you have sensitive information (including passwords, SAS token, authentication tokens, etc.), it should be moved into scripts in Azure Storage, where access requires authentication.
- The script locations need to be publicly accessible, unless you're using [MSI](./image-builder-user-assigned-identity.md).

The `customize` section is an array. The supported customizer types are: File, PowerShell, Shell, WindowsRestart, and WindowsUpdate.

# [JSON](#tab/json)

```json
"customize": [
  {
    "type": "File",
    "destination": "string",
    "sha256Checksum": "string",
    "sourceUri": "string"
  },
  {
    "type": "PowerShell",
    "inline": [ "string" ],
    "runAsSystem": "bool",
    "runElevated": "bool",
    "scriptUri": "string",
    "sha256Checksum": "string",
    "validExitCodes": [ "int" ]
  },
  {
    "type": "Shell",
    "inline": [ "string" ],
    "scriptUri": "string",
    "sha256Checksum": "string"
  },
  {
    "type": "WindowsRestart",
    "restartCheckCommand": "string",
    "restartCommand": "string",
    "restartTimeout": "string"
  },
  {
    "type": "WindowsUpdate",
    "filters": [ "string" ],
    "searchCriteria": "string",
    "updateLimit": "int"
  }
]
```

# [Bicep](#tab/bicep)

```bicep
customize: [
  {
    type: 'File'
    destination: 'string'
    sha256Checksum: 'string'
    sourceUri: 'string'
  }
  {
    type: 'PowerShell'
    inline: [
      'string'
    ]
    runAsSystem: bool
    runElevated: bool
    scriptUri: 'string'
    sha256Checksum: 'string'
    validExitCodes: [
      int
    ]
  }
  {
    type: 'Shell'
    inline: [
      'string'
    ]
    scriptUri: 'string'
    sha256Checksum: 'string'
  }
  {
    type: 'WindowsRestart'
    restartCheckCommand: 'string'
    restartCommand: 'string'
    restartTimeout: 'string'
  }
  {
    type: 'WindowsUpdate'
    filters: [
      'string'
    ]
    searchCriteria: 'string'
    updateLimit: int
  }
]
```

---

### Shell customizer

The `Shell` customizer supports running shell scripts on Linux. The shell scripts must be publicly accessible or you must have configured an [MSI](./image-builder-user-assigned-identity.md) for Image Builder to access them.

# [JSON](#tab/json)

```json
"customize": [
  {
    "type": "Shell",
    "name": "<name>",
    "scriptUri": "<link to script>",
    "sha256Checksum": "<sha256 checksum>"
  }
],
"customize": [
  {
    "type": "Shell",
    "name": "<name>",
    "inline": "<commands to run>"
  }
]
```

# [Bicep](#tab/bicep)

```bicep
customize: [
  {
    type: 'Shell'
    name: '<name>'
    scriptUri: '<link to script>'
    sha256Checksum: '<sha256 checksum>'
  }
  {
    type: 'Shell'
    name: '<name>'
    inline: '<commands to run>'
  }
]
```

---

Customize properties:

- **type** – Shell.
- **name** - name for tracking the customization.
- **scriptUri** - URI to the location of the file.
- **inline** - array of shell commands, separated by commas.
- **sha256Checksum** - Value of sha256 checksum of the file, you generate this value locally, and then Image Builder will checksum and validate.

    To generate the sha256Checksum, using a terminal on Mac/Linux run: `sha256sum <fileName>`

> [!NOTE]
> Inline commands are stored as part of the image template definition, you can see these when you dump out the image definition. If you have sensitive commands or values (including passwords, SAS token, authentication tokens etc), it's recommended these are moved into scripts, and use a user identity to authenticate to Azure Storage.

#### Super user privileges

Prefix the commands with `sudo` to run them with super user privileges. You can add the commands into scripts or use it inline commands, for example:

# [JSON](#tab/json)

```json
"type": "Shell",
"name": "setupBuildPath",
"inline": [
    "sudo mkdir /buildArtifacts",
    "sudo cp /tmp/index.html /buildArtifacts/index.html"
]
```

# [Bicep](#tab/bicep)

```bicep
type: 'Shell'
name: 'setupBuildPath'
inline: [
    'sudo mkdir /buildArtifacts'
    'sudo cp /tmp/index.html /buildArtifacts/index.html'
]
```

---

Example of a script using sudo that you can reference using scriptUri:

```bash
#!/bin/bash -e

echo "Telemetry: creating files"
mkdir /myfiles

echo "Telemetry: running sudo 'as-is' in a script"
sudo touch /myfiles/somethingElevated.txt
```

### Windows restart customizer

The `WindowsRestart` customizer allows you to restart a Windows VM and wait for the VM come back online, this customizer allows you to install software that requires a reboot.

# [JSON](#tab/json)

```json
"customize": [
  {
    "type": "WindowsRestart",
    "restartCommand": "shutdown /r /f /t 0",
    "restartCheckCommand": "echo Azure-Image-Builder-Restarted-the-VM  > c:\\buildArtifacts\\azureImageBuilderRestart.txt",
    "restartTimeout": "5m"
  }
]
```

# [Bicep](#tab/bicep)

```bicep
customize: [
  {
    type: 'WindowsRestart'
    restartCommand: 'shutdown /r /f /t 0'
    restartCheckCommand: 'echo Azure-Image-Builder-Restarted-the-VM  > c:\\buildArtifacts\\azureImageBuilderRestart.txt'
    restartTimeout: '5m'
  }
]
```

---

Customize properties:

- **Type**: WindowsRestart.
- **restartCommand** - Command to execute the restart (optional). The default is `'shutdown /r /f /t 0 /c \"packer restart\"'`.
- **restartCheckCommand** – Command to check if restart succeeded (optional).
- **restartTimeout** - Restart time out specified as a string of magnitude and unit. For example, `5m` (5 minutes) or `2h` (2 hours). The default is: `5m`.

> [!NOTE]
> There is no Linux restart customizer.

### PowerShell customizer

The `PowerShell` customizer supports running PowerShell scripts and inline command on Windows, the scripts must be publicly accessible for the IB to access them.

# [JSON](#tab/json)

```json
"customize": [
  {
    "type": "PowerShell",
    "name":   "<name>",
    "scriptUri": "<path to script>",
    "runElevated": <true false>,
    "runAsSystem": <true false>,
    "sha256Checksum": "<sha256 checksum>"
  },
  {
    "type": "PowerShell",
    "name": "<name>",
    "inline": "<PowerShell syntax to run>",
    "validExitCodes": [<exit code>],
    "runElevated": <true or false>,
    "runAsSystem": <true or false>
  }
]
```

# [Bicep](#tab/bicep)

```bicep
customize: [
  {
    type: 'PowerShell'
    name:   '<name>'
    scriptUri: '<path to script>'
    runElevated: <true false>
    runAsSystem: <true false>
    sha256Checksum: '<sha256 checksum>'
  }
  {
    type: 'PowerShell'
    name: '<name>'
    inline: '<PowerShell syntax to run>'
    validExitCodes: [<exit code>]
    runElevated: <true or false>
    runAsSystem: <true or false>
  }
]
```

---

Customize properties:

- **type** – PowerShell.
- **scriptUri** - URI to the location of the PowerShell script file.
- **inline** – Inline commands to be run, separated by commas.
- **validExitCodes** – Optional, valid codes that can be returned from the script/inline command. The property avoids reported failure of the script/inline command.
- **runElevated** – Optional, boolean, support for running commands and scripts with elevated permissions.
- **runAsSystem** - Optional, boolean, determines whether the PowerShell script should be run as the System user.
- **sha256Checksum** - generate the SHA256 checksum of the file locally, update the checksum value to lowercase, and Image Builder will validate the checksum during the deployment of the image template.

    To generate the sha256Checksum, use the [Get-FileHash](/powershell/module/microsoft.powershell.utility/get-filehash) cmdlet in PowerShell.

### File customizer

The `File` customizer lets Image Builder download a file from a GitHub repo or Azure storage. The customizer supports both Linux and Windows. If you have an image build pipeline that relies on build artifacts, you can set the file customizer to download from the build share, and move the artifacts into the image. 


# [JSON](#tab/json)

```json
"customize": [
  {
    "type": "File",
    "name": "<name>",
    "sourceUri": "<source location>",
    "destination": "<destination>",
    "sha256Checksum": "<sha256 checksum>"
  }
]
```

# [Bicep](#tab/bicep)

```bicep
customize: [
  {
    type: 'File'
    name: '<name>'
    sourceUri: '<source location>'
    destination: '<destination>'
    sha256Checksum: '<sha256 checksum>'
  }
]
```

---

File customizer properties:

- **sourceUri** - an accessible storage endpoint, this endpoint can be GitHub or Azure storage. You can only download one file, not an entire directory. If you need to download a directory, use a compressed file, then uncompress it using the Shell or PowerShell customizers.

  > [!NOTE]
  > If the sourceUri is an Azure Storage Account, irrespective if the blob is marked public, you'll need to grant the Managed User Identity permissions to read access on the blob. See this [example](./image-builder-user-assigned-identity.md#create-a-resource-group) to set the storage permissions.

- **destination** – the full destination path and file name. Any referenced path and subdirectories must exist, use the Shell or PowerShell customizers to set up these paths up beforehand. You can use the script customizers to create the path.

This customizer is supported by Windows directories and Linux paths, but there are some differences:

- Linux – the only path Image builder can write to is /tmp.
- Windows – No path restriction, but the path must exist.

If there's an error trying to download the file, or put it in a specified directory, then customize step fails, and this error will be in the customization.log.

> [!NOTE]
> The file customizer is only suitable for small file downloads, < 20MB. For larger file downloads, use a script or inline command, then use code to download files, such as, Linux `wget` or `curl`, Windows, `Invoke-WebRequest`. For files that are in Azure storage, ensure that you assign an identity with permissions to view that file to the build VM by following the documentation here: [User Assigned Identity for the Image Builder Build VM](#user-assigned-identity-for-the-image-builder-build-vm). Any file that is not stored in Azure must be publicly accessible for Azure Image Builder to be able to download it.

- **sha256Checksum** - generate the SHA256 checksum of the file locally, update the checksum value to lowercase, and Image Builder will validate the checksum during the deployment of the image template.

    To generate the sha256Checksum, use the [Get-FileHash](/powershell/module/microsoft.powershell.utility/get-filehash) cmdlet in PowerShell.

### Windows update customizer


The `WindowsUpdate` customizer is built on the [community Windows Update Provisioner](https://github.com/rgl/packer-plugin-windows-update) for Packer, which is an open source project maintained by the Packer community. Microsoft tests and validate the provisioner with the Image Builder service, and will support investigating issues with it, and work to resolve issues, however the open source project isn't officially supported by Microsoft. For detailed documentation on and help with the Windows Update Provisioner, see the project repository.


# [JSON](#tab/json)

```json
"customize": [
  {
    "type": "WindowsUpdate",
    "searchCriteria": "IsInstalled=0",
    "filters": [
      "exclude:$_.Title -like '*Preview*'",
      "include:$true"
    ],
    "updateLimit": 20
  }
]
```

# [Bicep](#tab/bicep)

```bicep
customize: [
  {
    type: 'WindowsUpdate'
    searchCriteria: 'IsInstalled=0'
    filters: [
     'exclude:$_.Title -like \'*Preview*\''
     'include:$true'
    ]
    updateLimit: 20
  }
]
```

---

Customizer properties:

- **type**  – WindowsUpdate.
- **searchCriteria** - Optional, defines which type of updates are installed (like Recommended or Important), BrowseOnly=0 and IsInstalled=0 (Recommended) is the default.
- **filters** – Optional, allows you to specify a filter to include or exclude updates.
- **updateLimit** – Optional, defines how many updates can be installed, default 1000.

> [!NOTE]
> The Windows Update customizer can fail if there are any outstanding Windows restarts, or application installations still running, typically you may see this error in the customization.log, `System.Runtime.InteropServices.COMException (0x80240016): Exception from HRESULT: 0x80240016`. We strongly advise you consider adding in a Windows Restart, and/or allowing applications enough time to complete their installations using [sleep](/powershell/module/microsoft.powershell.utility/start-sleep) or wait commands in the inline commands or scripts before running Windows Update.

### Generalize

By default, Azure Image Builder will also run `deprovision` code at the end of each image customization phase, to generalize the image. Generalizing is a process where the image is set up so it can be reused to create multiple VMs. For Windows VMs, Azure Image Builder uses Sysprep. For Linux, Azure Image Builder runs `waagent -deprovision`.

The commands Image Builder users to generalize may not be suitable for every situation, so Azure Image Builder allows you to customize this command, if needed.

If you're migrating existing customization, and you're using different Sysprep/waagent commands, you can use the Image Builder generic commands, and if the VM creation fails, use your own Sysprep or waagent commands.

If Azure Image Builder creates a Windows custom image successfully, and you create a VM from it, then find that the VM creation fails or doesn't complete successfully, you need to review the Windows Server Sysprep documentation or raise a support request with the Windows Server Sysprep Customer Services Support team, who can troubleshoot and advise on the correct Sysprep usage.

#### Default Sysprep command

```azurepowershell-interactive
Write-Output '>>> Waiting for GA Service (RdAgent) to start ...'
while ((Get-Service RdAgent).Status -ne 'Running') { Start-Sleep -s 5 }
Write-Output '>>> Waiting for GA Service (WindowsAzureTelemetryService) to start ...'
while ((Get-Service WindowsAzureTelemetryService) -and ((Get-Service WindowsAzureTelemetryService).Status -ne 'Running')) { Start-Sleep -s 5 }
Write-Output '>>> Waiting for GA Service (WindowsAzureGuestAgent) to start ...'
while ((Get-Service WindowsAzureGuestAgent).Status -ne 'Running') { Start-Sleep -s 5 }
if( Test-Path $Env:SystemRoot\system32\Sysprep\unattend.xml ) {
  Write-Output '>>> Removing Sysprep\unattend.xml ...'
  Remove-Item $Env:SystemRoot\system32\Sysprep\unattend.xml -Force
}
if (Test-Path $Env:SystemRoot\Panther\unattend.xml) {
  Write-Output '>>> Removing Panther\unattend.xml ...'
  Remove-Item $Env:SystemRoot\Panther\unattend.xml -Force
}
Write-Output '>>> Sysprepping VM ...'
& $Env:SystemRoot\System32\Sysprep\Sysprep.exe /oobe /generalize /quiet /quit
while($true) {
  $imageState = (Get-ItemProperty HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Setup\State).ImageState
  Write-Output $imageState
  if ($imageState -eq 'IMAGE_STATE_GENERALIZE_RESEAL_TO_OOBE') { break }
  Start-Sleep -s 5
}
Write-Output '>>> Sysprep complete ...'
```

#### Default Linux deprovision command

```bash
WAAGENT=/usr/sbin/waagent
waagent -version 1> /dev/null 2>&1
if [ $? -eq 0 ]; then
  WAAGENT=waagent
fi
$WAAGENT -force -deprovision+user && export HISTSIZE=0 && sync
```

#### Overriding the Commands

To override the commands, use the PowerShell or Shell script provisioners to create the command files with the exact file name, and put them in the correct directories:

- Windows: c:\DeprovisioningScript.ps1
- Linux: /tmp/DeprovisioningScript.sh

Image Builder reads these commands, these commands are written out to the AIB logs, `customization.log`. See [troubleshooting](image-builder-troubleshoot.md#customization-log) on how to collect logs.

## Properties: errorHandling

The `errorHandling` property allows you to configure how errors are handled during image creation.

# [JSON](#tab/json)

```json
{
  "errorHandling": {
    "onCustomizerError": "abort",
    "onValidationError": "cleanup"
  }
}
```

# [Bicep](#tab/bicep)

```bicep
errorHandling: {
  onCustomizerError: 'abort',
  onValidationError: 'cleanup'
}
```

---

- **onCustomizerError**: Specifies the action to take when an error occurs during the customizer phase of image creation.
- **onValidationError**: Specifies the action to take when an error occurs during validation of the image template.

Both `cleanup` and `abort` values are valid for both `onCustomizerError` and `onValidationError`. The distinction is that `onCustomizerError` handles errors during the customizer phase of image creation, while `onValidationError` handles errors during validation of the image template.

## Properties: distribute

Azure Image Builder supports three distribution targets:

- **ManagedImage** - Managed image.
- **sharedImage** - Azure Compute Gallery.
- **VHD** - VHD in a storage account.

You can distribute an image to both of the target types in the same configuration.

> [!NOTE]
> The default AIB sysprep command doesn't include "/mode:vm", however this property maybe required when create images that will have the HyperV role installed. If you need to add this command argument, you must override the sysprep command.

Because you can have more than one target to distribute to, Image Builder maintains a state for every distribution target that can be accessed by querying the `runOutputName`.  The `runOutputName` is an object you can query post distribution for information about that distribution. For example, you can query the location of the VHD, or regions where the image version was replicated to, or SIG Image version created. This is a property of every distribution target. The `runOutputName` must be unique to each distribution target. Here's an example for querying an Azure Compute Gallery distribution:

```azurecli-interactive
subscriptionID=<subcriptionID>
imageResourceGroup=<resourceGroup of image template>
runOutputName=<runOutputName>

az resource show \
  --ids "/subscriptions/$subscriptionID/resourcegroups/$imageResourceGroup/providers/Microsoft.VirtualMachineImages/imageTemplates/ImageTemplateLinuxRHEL77/runOutputs/$runOutputName"  \
  --api-version=2021-10-01
```

Output:

```output
{
  "id": "/subscriptions/xxxxxx/resourcegroups/rheltest/providers/Microsoft.VirtualMachineImages/imageTemplates/ImageTemplateLinuxRHEL77/runOutputs/rhel77",
  "identity": null,
  "kind": null,
  "location": null,
  "managedBy": null,
  "name": "rhel77",
  "plan": null,
  "properties": {
    "artifactId": "/subscriptions/xxxxxx/resourceGroups/aibDevOpsImg/providers/Microsoft.Compute/galleries/devOpsSIG/images/rhel/versions/0.24105.52755",
    "provisioningState": "Succeeded"
  },
  "resourceGroup": "rheltest",
  "sku": null,
  "tags": null,
  "type": "Microsoft.VirtualMachineImages/imageTemplates/runOutputs"
}
```

### Distribute: managedImage

The image output is a managed image resource.

# [JSON](#tab/json)

```json
{
  "type":"ManagedImage",
  "imageId": "<resource ID>",
  "location": "<region>",
  "runOutputName": "<name>",
  "artifactTags": {
      "<name>": "<value>",
      "<name>": "<value>"
  }
}
```

# [Bicep](#tab/bicep)

```bicep
{
  type:'ManagedImage'
  imageId: '<resource ID>'
  location: '<region>'
  runOutputName: '<name>'
  artifactTags: {
      <name>: '<value>'
      <name>: '<value>'
  }
}
```

---

Distribute properties:

- **type** – ManagedImage
- **imageId** – Resource ID of the destination image, expected format: /subscriptions/\<subscriptionId>/resourceGroups/\<destinationResourceGroupName>/providers/Microsoft.Compute/images/\<imageName>
- **location** - location of the managed image.
- **runOutputName** – unique name for identifying the distribution.
- **artifactTags** - Optional user specified key\value tags.

> [!NOTE]
> The destination resource group must exist.
> If you want the image distributed to a different region, it will increase the deployment time.

### Distribute: sharedImage

The Azure Compute Gallery is a new Image Management service that allows managing of image region replication, versioning and sharing custom images. Azure Image Builder supports distributing with this service, so you can distribute images to regions supported by Azure Compute Galleries.

an Azure Compute Gallery is made up of:

- **Gallery** - Container for multiple images. A gallery is deployed in one region.
- **Image definitions** - a conceptual grouping for images.
- **Image versions** - an image type used for deploying a VM or scale set. Image versions can be replicated to other regions where VMs need to be deployed.

Before you can distribute to the gallery, you must create a gallery and an image definition, see [Create a gallery](../create-gallery.md).

> [!NOTE]
> The image version ID needs to be distinct or different from any image versions that are in the existing Azure Compute Gallery.


# [JSON](#tab/json)

```json
{
  "type": "SharedImage",
  "galleryImageId": "<resource ID>",
  "runOutputName": "<name>",
  "artifactTags": {
      "<name>": "<value>",
      "<name>": "<value>"
  }
}
```

# [Bicep](#tab/bicep)

```bicep
{
  type: 'SharedImage'
  galleryImageId: '<resource ID>'
  runOutputName: '<name>'
  artifactTags: {
      <name>: '<value>'
      <name>: '<value>'
  }
}
```
---

The following JSON is an example of how to use the `replicationRegions` field to distribute to an Azure Compute Gallery.

# [JSON](#tab/json)
```json
  "replicationRegions": [
      "<region where the gallery is deployed>",
      "<region>"
  ]
```


# [Bicep](#tab/bicep)
```bicep
replicationRegions: [
    '<region where the gallery is deployed>',
    '<region>'
]
```
---

> [!NOTE]
>`replicationRegions` is deprecated for gallery distributions as `targetRegions` is updated property. For more information, see [targetRegions](../image-builder-api-update-release-notes.md#version-2022-07-01).

#### Distribute: targetRegions

The following JSON is an example of how to use the targetRegions field to distribute to an Azure Compute Gallery.

# [JSON](#tab/json)
```json
"distribute": [
      {
        "type": "SharedImage",
        "galleryImageId": "<resource ID>",
        "runOutputName": "<name>",
        "artifactTags": {
          "<name>": "<value>",
          "<name>": "<value>"
        },
        "targetRegions": [
             {
              "name": "eastus",
              "replicaCount": 2,
              "storageAccountType": "Standard_ZRS"
             },
             {
              "name": "eastus2",
              "replicaCount": 3,
              "storageAccountType": "Premium_LRS"
             }
          ]
       },
    ]
```
# [Bicep](#tab/bicep)
```bicep
distribute: [
    {
        type: 'SharedImage'
        galleryImageId: '<resource ID>'
        runOutputName: '<name>'
        artifactTags: {
            '<name>': '<value>'
            '<name>': '<value>'
        }
        targetRegions: [
            {
                name: 'eastus'
                replicaCount: 2
                storageAccountType: 'Standard_ZRS'
            }
            {
                name: 'eastus2'
                replicaCount: 3
                storageAccountType: 'Premium_LRS'
            }
        ]
    }
]
```
---


Distribute properties for galleries:

- **type** - sharedImage
- **galleryImageId** – ID of the Azure Compute Gallery, this property can be specified in two formats:

  - Automatic versioning - Image Builder generates a monotonic version number for you, this property is useful for when you want to keep rebuilding images from the same template: The format is: `/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Compute/galleries/<sharedImageGalleryName>/images/<imageGalleryName>`.
  - Explicit versioning - You can pass in the version number you want image builder to use. The format is:
  `/subscriptions/<subscriptionID>/resourceGroups/<rgName>/providers/Microsoft.Compute/galleries/<sharedImageGalName>/images/<imageDefName>/versions/<version - for example: 1.1.1>`

- **runOutputName** – unique name for identifying the distribution.
- **artifactTags** - optional user specified key\value tags.
- **replicationRegions** - array of regions for replication. One of the regions must be the region where the Gallery is deployed. Adding regions mean an increase of build time, as the build doesn't complete until the replication has completed. This field is deprecated as of API version 2022-07-01, please use `targetRegions` when distributing a "SharedImage" type.
- **targetRegions** -  an array of regions for replication. It's newly introduced as part of the [2022-07-01 API](../../virtual-machines/image-builder-api-update-release-notes.md#version-2022-07-01) and applies only to the `SharedImage` type distribute.
- **excludeFromLatest** (optional) - allows you to mark the image version you create not be used as the latest version in the gallery definition, the default is 'false'.
- **storageAccountType** (optional) - AIB supports specifying these types of storage for the image version that is to be created:

  - "Standard_LRS"
  - "Standard_ZRS","


> [!NOTE]
> If the image template and referenced `image definition` aren't in the same location, you'll see additional time to create images. Image Builder currently doesn't have a `location` parameter for the image version resource, we take it from its parent `image definition`. For example, if an image definition is in `westus` and you want the image version replicated to `eastus`, a blob is copied to `westus`, an image version resource in `westus` is created, and then replicate to `eastus`. To avoid the additional replication time, ensure the `image definition` and image template are in the same location.




## versioning

The **versioning** property is for the `sharedImage` distribute type only. It's an enum with two possible values:
- **latest** - New strictly increasing schema per design
- **source** - Schema based upon the version number of the source image.

The default version numbering schema is `latest`. The latest schema has an additional property, “major” which specifies the major version under which to generate the latest version. 

> [!NOTE]
> The existing version generation logic for `sharedImage` distribution is deprecated. Two new options are provided: monotonically increasing versions that are always the latest version in a gallery, and versions generated based on the version number of the source image. The enum specifying the version generation schema allows for expansion in the future with additional version generation schemas.



```json
    "distribute": [
        "versioning": {
            "scheme": "Latest",
            "major": 1
        }
    ]
```
---

versioning properties:
- **scheme** - Generate new version number for distribution. `Latest` or `Source` are two possible values.
- **major** - Specifies the major version under which to generate the latest version. Only applicable when the `scheme` is set to `Latest`. For example, in a gallery with the following versions published: 0.1.1, 0.1.2, 1.0.0, 1.0.1, 1.1.0, 1.1.1, 1.2.0, 2.0.0, 2.0.1, 2.1.0
    - With major not set or major set to 2, The `Latest` scheme generates version 2.1.1
    - With major set to 1, the Latest scheme generates version 1.2.1
    - With major set to 0, the Latest scheme generates version 0.1.3

### Distribute: VHD

You can output to a VHD. You can then copy the VHD, and use it to publish to Azure MarketPlace, or use with Azure Stack.

# [JSON](#tab/json)

```json
{
  "type": "VHD",
  "runOutputName": "<VHD name>",
  "artifactTags": {
      "<name>": "<value>",
      "<name>": "<value>"
  }
}
```

# [Bicep](#tab/bicep)

```bicep
{
  type: 'VHD'
  runOutputName: '<VHD name>'
  artifactTags: {
      <name>: '<value>'
      <name>: '<value>'
  }
}
```

---

OS Support: Windows and Linux

Distribute VHD parameters:

- **type** - VHD.
- **runOutputName** – unique name for identifying the distribution.
- **tags** - Optional user specified key value pair tags.

Azure Image Builder doesn't allow the user to specify a storage account location, but you can query the status of the `runOutputs` to get the location.

```azurecli-interactive
az resource show \
  --ids "/subscriptions/$subscriptionId/resourcegroups/<imageResourceGroup>/providers/Microsoft.VirtualMachineImages/imageTemplates/<imageTemplateName>/runOutputs/<runOutputName>"  | grep artifactUri
```

> [!NOTE]
> Once the VHD has been created, copy it to a different location, as soon as possible. The VHD is stored in a storage account in the temporary resource group created when the image template is submitted to the Azure Image Builder service. If you delete the image template, then you'll lose the VHD.

The following JSON distributes the image as a VHD to a custom storage account.

# [JSON](#tab/json)

```json
"distribute": [
  {
    "type": "VHD",
    "runOutputName": "<VHD name>",
    "artifactTags": {
        "<name>": "<value>",
        "<name>": "<value>"
    },
    "uri": "<replace with Azure storage URI>"
  }
]
```

# [Bicep](#tab/bicep)

```bicep
resource distribute 'Microsoft.Compute/galleries/images/runOutputs' = {
  name: '<VHD name>'
  properties: {
    type: 'VHD'
    artifactTags: {
      '<name>': '<value>'
      '<name>': '<value>'
    }
    uri: '<replace with Azure storage URI>'
  }
}
```

---

VHD distribute properties:

**uri** - Optional Azure Storage URI for the distributed VHD blob. Omit to use the default (empty string) in which case VHD would be published to the storage account in the staging resource group.

## Properties: optimize

The `optimize` property can be enabled while creating a VM image and allows VM optimization to improve image creation time.

# [JSON](#tab/json)

```json
"optimize": { 
      "vmboot": { 
        "state": "Enabled" 
      }
    }
```

# [Bicep](#tab/bicep)

```bicep
optimize: {
      vmboot: {
        state: 'Enabled'
      }
    }
```
---

- **vmboot**: A configuration related to the booting process of the virtual machine (VM), used to control optimizations that can improve boot time or other performance aspects.
- state: The state of the boot optimization feature within `vmboot`, with the value `Enabled` indicating that the feature is turned on to improve image creation time.

## Properties: source

The `source` section contains information about the source image that will be used by Image Builder. Azure Image Builder only supports generalized images as source images, specialized images aren't supported at this time.

The API requires a `SourceType` that defines the source for the image build, currently there are three types:

- PlatformImage - indicated the source image is a Marketplace image.
- ManagedImage - used when starting from a regular managed image.
- SharedImageVersion - used when you're using an image version in an Azure Compute Gallery as the source.

> [!NOTE]
> When using existing Windows custom images, you can run the Sysprep command up to three times on a single Windows 7 or Windows Server 2008 R2 image, or 1001 times on a single Windows image for later versions; for more information, see the [sysprep](/windows-hardware/manufacture/desktop/sysprep--generalize--a-windows-installation#limits-on-how-many-times-you-can-run-sysprep) documentation.

### PlatformImage source

Azure Image Builder supports Windows Server and client, and Linux  Azure Marketplace images, see [Learn about Azure Image Builder](../image-builder-overview.md#os-support) for the full list.

# [JSON](#tab/json)

```json
"source": {
  "type": "PlatformImage",
  "publisher": "Canonical",
  "offer": "UbuntuServer",
  "sku": "18.04-LTS",
  "version": "latest"
}
```

# [Bicep](#tab/bicep)

```bicep
source:{
  type: 'PlatformImage'
  publisher: 'Canonical'
  offer: 'UbuntuServer'
  sku: '18.04-LTS'
  version: 'latest'
}
```

---

The properties here are the same that are used to create VM's, using AZ CLI, run the below to get the properties:

```azurecli-interactive
az vm image list -l westus -f UbuntuServer -p Canonical --output table --all
```

You can use `latest` in the version, the version is evaluated when the image build takes place, not when the template is submitted. If you use this functionality with the Azure Compute Gallery destination, you can avoid resubmitting the template, and rerun the image build at intervals, so your images are recreated from the most recent images.

#### Support for market place plan information

You can also specify plan information, for example:

# [JSON](#tab/json)

```json
"source": {
  "type": "PlatformImage",
  "publisher": "RedHat",
  "offer": "rhel-byos",
  "sku": "rhel-lvm75",
  "version": "latest",
  "planInfo": {
    "planName": "rhel-lvm75",
    "planProduct": "rhel-byos",
    "planPublisher": "redhat"
  }
}
```

# [Bicep](#tab/bicep)

```bicep
source: {
  type: 'PlatformImage'
  publisher: 'RedHat'
  offer: 'rhel-byos'
  sku: 'rhel-lvm75'
  version: 'latest'
  planInfo: {
    planName: 'rhel-lvm75'
    planProduct: 'rhel-byos'
    planPublisher: 'redhat'
  }
}
```

---

### ManagedImage source

Sets the source image as an existing managed image of a generalized VHD or VM.

> [!NOTE]
> The source managed image must be of a supported OS and the image must reside in the same subscription and region as your Azure Image Builder template.

# [JSON](#tab/json)

```json
"source": {
  "type": "ManagedImage",
  "imageId": "/subscriptions/<subscriptionId>/resourceGroups/{destinationResourceGroupName}/providers/Microsoft.Compute/images/<imageName>"
}
```

# [Bicep](#tab/bicep)

```bicep
source: {
  type: 'ManagedImage',
  imageId: '/subscriptions/<subscriptionId>/resourceGroups/{destinationResourceGroupName}/providers/Microsoft.Compute/images/<imageName>'
}
```

---

The `imageId` should be the ResourceId of the managed image. Use `az image list` to list available images.

### SharedImageVersion source

Sets the source image as an existing image version in an Azure Compute Gallery.

> [!NOTE]
> The source shared image version must be of a supported OS and the image version must reside in the same region as your Azure Image Builder template, if not, replicate the image version to the Image Builder Template region.

# [JSON](#tab/json)

```json
"source": {
  "type": "SharedImageVersion",
  "imageVersionID": "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.Compute/galleries/<sharedImageGalleryName>/images/<imageDefinitionName/versions/<imageVersion>"
}
```

# [Bicep](#tab/bicep)

```bicep
source: {
    type: 'SharedImageVersion'
    imageVersionId: '/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.Compute/galleries/<sharedImageGalleryName>/images/<imageDefinitionName>/versions/<imageVersion>'
}
```

---
- imageVersionId - ARM template resource ID of the image version. When image version name is 'latest', the version is evaluated when the image build takes place. The `imageVersionId` should be the `ResourceId` of the image version. Use [az sig image-version list](/cli/azure/sig/image-version#az-sig-image-version-list) to list image versions.


The following JSON sets the source image as an image stored in a [Direct Shared Gallery](/azure/virtual-machines/shared-image-galleries?tabs=azure-cli#sharing).

> [!NOTE]
> The Direct Shared Gallery is currently in preview availability.

# [JSON](#tab/json)

```json
    source: {
      "type": "SharedImageVersion",      
      "imageVersionId": "<replace with resourceId of the image stored in the Direct Shared Gallery>"      
    },
```

# [Bicep](#tab/bicep)

```bicep
source: {
  type: 'SharedImageVersion'
  imageVersionId: '<replace with resourceId of the image stored in the Direct Shared Gallery>'
}
```
---

The following JSON sets the source image as the latest image version for an image stored in an Azure Compute Gallery.

# [JSON](#tab/json)

```json
"properties": {
    "source": {
        "type": "SharedImageVersion",
        "imageVersionId": "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Compute/galleries/<azureComputeGalleryName>/images/<imageDefinitionName>/versions/latest"
    }
},
```

# [Bicep](#tab/bicep)

```bicep
properties: {
    source: {
        type: 'SharedImageVersion'
        imageVersionId: '/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Compute/galleries/<azureComputeGalleryName>/images/<imageDefinitionName>/versions/latest'
    }
}
```
---

SharedImageVersion properties:

**imageVersionId** - ARM template resource ID of the image version. When the image version name is 'latest', the version is evaluated when the image build takes place.


## Properties: stagingResourceGroup

The `stagingResourceGroup` property contains information about the staging resource group that the Image Builder service creates for use during the image build process. The `stagingResourceGroup` is an optional property for anyone who wants more control over the resource group created by Image Builder during the image build process. You can create your own resource group and specify it in the `stagingResourceGroup` section or have Image Builder create one on your behalf.

> [!IMPORTANT]
> The staging resource group specified cannot be associated with another image template, must be empty (no resources inside), in the same region as the image template, and have either "Contributor" or "Owner" RBAC applied to the identity assigned to the Azure Image Builder image template resource.

# [JSON](#tab/json)

```json
"properties": {
  "stagingResourceGroup": "/subscriptions/<subscriptionID>/resourceGroups/<stagingResourceGroupName>"
}
```

# [Bicep](#tab/bicep)

```bicep
properties: {
  stagingResourceGroup: '/subscriptions/<subscriptionID>/resourceGroups/<stagingResourceGroupName>'
}
```

---

### Template creation scenarios

- **The stagingResourceGroup property is left empty**

  If the `stagingResourceGroup` property isn't specified or specified with an empty string, the Image Builder service creates a staging resource group with the default name convention "IT_***". The staging resource group has the default tags applied to it: `createdBy`, `imageTemplateName`, `imageTemplateResourceGroupName`. Also, the default RBAC is applied to the identity assigned to the Azure Image Builder template resource, which is "Contributor".

- **The stagingResourceGroup property is specified with a resource group that exists**

  If the `stagingResourceGroup` property is specified with a resource group that does exist, then the Image Builder service checks to make sure the resource group isn't associated with another image template, is empty (no resources inside), in the same region as the image template, and has either "Contributor" or "Owner" RBAC applied to the identity assigned to the Azure Image Builder image template resource. If any of the aforementioned requirements aren't met, an error is thrown. The staging resource group has the following tags added to it: `usedBy`, `imageTemplateName`, `imageTemplateResourceGroupName`. Pre-existing tags aren't deleted.
  
> [!IMPORTANT]
> You will need to assign the contributor role to the resource group for the service principal corresponding to Azure Image Builder's first party app when trying to specify a pre-existing resource group and VNet to the Azure Image Builder service with a Windows source image. For the CLI command and portal instructions on how to assign the contributor role to the resource group see the following documentation [Troubleshoot VM Azure Image Builder: Authorization error creating disk](./image-builder-troubleshoot.md#authorization-error-creating-disk)

- **The stagingResourceGroup property is specified with a resource group that doesn't exist**

  If the `stagingResourceGroup` property is specified with a resource group that doesn't exist, then the Image Builder service creates a staging resource group with the name provided in the `stagingResourceGroup` property. There will be an error if the given name doesn't meet Azure naming requirements for resource groups. The staging resource group has the default tags applied to it: `createdBy`, `imageTemplateName`, `imageTemplateResourceGroupName`. By default the identity assigned to the Azure Image Builder image template resource has the "Contributor" RBAC applied to it in the resource group.

### Template deletion

Any staging resource group created by the Image Builder service will be deleted after the image template is deleted. The deletion includes staging resource groups that were specified in the `stagingResourceGroup` property, but didn't exist prior to the image build.

If Image Builder didn't create the staging resource group, but the resources inside of the resource group, those resources will be deleted after the image template is deleted, given the Image Builder service has the appropriate permissions or role required to delete resources.

## Properties: validate

You can use the `validate` property to validate platform images and any customized images you create regardless of if you used Azure Image Builder to create them.

Azure Image Builder supports a 'Source-Validation-Only' mode that can be set using the `sourceValidationOnly` property. If the `sourceValidationOnly` property is set to true, the image specified in the `source` section will directly be validated. No separate build will be run to generate and then validate a customized image.

The `inVMValidations` property takes a list of validators that will be performed on the image. Azure Image Builder supports File, PowerShell and Shell validators.

The `continueDistributeOnFailure` property is responsible for whether the output image(s) will be distributed if validation fails. By default, if validation fails and this property is set to false, the output image(s) won't be distributed. If validation fails and this property is set to true, the output image(s) will still be distributed. Use this option with caution as it may result in failed images being distributed for use. In either case (true or false), the end to end image run will be reported as a failed if a validation failure. This property has no effect on whether validation succeeds or not.

When using `validate`:

- You can use multiple validators.
- Validators execute in the order specified in the template.
- If one validator fails, then the whole validation component will fail and report back an error.
- It's advised you test the script thoroughly before using it in a template. Debugging the script on your own VM will be easier.
- Don't put sensitive data in the scripts.
- The script locations need to be publicly accessible, unless you're using [MSI](./image-builder-user-assigned-identity.md).

How to use the `validate` property to validate Windows images:

# [JSON](#tab/json)

```json
{
   "properties":{
      "validate":{
         "continueDistributeOnFailure":false,
         "sourceValidationOnly":false,
         "inVMValidations":[
            {
               "type":"File",
               "destination":"string",
               "sha256Checksum":"string",
               "sourceUri":"string"
            },
            {
               "type":"PowerShell",
               "name":"test PowerShell validator inline",
               "inline":[
                  "<command to run inline>"
               ],
               "validExitCodes":"<exit code>",
               "runElevated":"<true or false>",
               "runAsSystem":"<true or false>"
            },
            {
               "type":"PowerShell",
               "name":"<name>",
               "scriptUri":"<path to script>",
               "runElevated":"<true false>",
               "sha256Checksum":"<sha256 checksum>"
            }
         ]
      }
   }
}
```

# [Bicep](#tab/bicep)

```bicep
{
  properties: {
    validate: {
      continueDistributeOnFailure: false
      sourceValidationOnly: false
      inVMValidations: [
        {
          type: 'PowerShell'
          name: 'test PowerShell validator inline'
          inline: [
            '<command to run inline>'
          ]
          validExitCodes: <exit code>
          runElevated: <true or false>
          runAsSystem: <true or false>
        }
        {
          type: 'PowerShell'
          name: '<name>'
          scriptUri: '<path to script>'
          runElevated: <true false>,
          sha256Checksum: '<sha256 checksum>'
        }
      ]
    }
  }
}
```

---

`inVMValidations` properties:

- **type** – PowerShell.
- **name** - name of the validator
- **scriptUri** - URI of the PowerShell script file.
- **inline** – array of commands to be run, separated by commas.
- **validExitCodes** – Optional, valid codes that can be returned from the script/inline command, this avoids reported failure of the script/inline command.
- **runElevated** – Optional, boolean, support for running commands and scripts with elevated permissions.
- **sha256Checksum** - Value of sha256 checksum of the file, you generate this locally, and then Image Builder will checksum and validate.

    To generate the sha256Checksum, using a PowerShell on Windows [Get-Hash](/powershell/module/microsoft.powershell.utility/get-filehash)

How to use the `validate` property to validate Linux images:

# [JSON](#tab/json)

```json
{
  "properties": {
    "validate": {
      "continueDistributeOnFailure": false,
      "sourceValidationOnly": false,
      "inVMValidations": [
        {
          "type": "Shell",
          "name": "<name>",
          "inline": [
            "<command to run inline>"
          ]
        },
        {
          "type": "Shell",
          "name": "<name>",
          "scriptUri": "<path to script>",
          "sha256Checksum": "<sha256 checksum>"
        },
        {
          "type": "File",
          "destination": "string",
          "sha256Checksum": "string",
          "sourceUri": "string"
        }
      ]
    }
  }
}
```

# [Bicep](#tab/bicep)

```bicep
{
  properties: {
    validate: {
      continueDistributeOnFailure: false
      sourceValidationOnly: false
      inVMValidations: [
        {
          type: 'Shell'
          name: '<name>'
          inline: [
            '<command to run inline>'
          ]
        }
        {
          type: 'Shell'
          name: '<name>'
          scriptUri: '<path to script>'
          sha256Checksum: '<sha256 checksum>'
        }
      ]
    }
  }
}
```

---

`inVMValidations` properties:

- **type** – Shell or File specified as the validation type to be performed.
- **name** - name of the validator
- **scriptUri** - URI of the script file
- **inline** - array of commands to be run, separated by commas.
- **sha256Checksum** - Value of sha256 checksum of the file, you generate this locally, and then Image Builder will checksum and validate.

    To generate the sha256Checksum, using a terminal on Mac/Linux run: `sha256sum <fileName>`
- **destination** - Destination of the file.
- **sha256Checksum** - Specifies the SHA256 checksum of the file.
- **sourceUri** - The source URI of the file.

<a id="vmprofile"></a>

## Properties: vmProfile

### vmSize (optional)

Image Builder uses a default SKU size of `Standard_D1_v2` for Gen1 images and `Standard_D2ds_v4` for Gen2 images. The generation is defined by the image you specify in the `source`. You can override vmSize for these reasons:

- Performing customizations that require increased memory, CPU and handling large files (GBs).
- Running Windows builds, you should use "Standard_D2_v2" or equivalent VM size.
- Require [VM isolation](../isolation.md).
- Customize an image that requires specific hardware. For example, for a GPU VM, you need a GPU VM size.
- Require end to end encryption at rest of the build VM, you need to specify the support build [VM size](../azure-vms-no-temp-disk.yml) that doesn't use local temporary disks.

### osDiskSizeGB

By default, Image Builder doesn't change the size of the image, it uses the size from the source image. You can optionally **only** increase the size of the OS Disk (Win and Linux), and a value of 0 means leaving the same size as the source image. You can't reduce the OS Disk size to smaller than the size from the source image.

# [JSON](#tab/json)

```json
{
  "osDiskSizeGB": 100
}
```

# [Bicep](#tab/bicep)

```bicep
  osDiskSizeGB: 100
```

---

### vnetConfig (optional)

If you don't specify any VNet properties, Image Builder creates its own VNet, Public IP, and network security group (NSG). The Public IP is used for the service to communicate with the build VM. If you don't want to have a Public IP or you want Image Builder to have access to your existing VNet resources, such as configuration servers (DSC, Chef, Puppet, Ansible), file shares, then you can specify a VNet. For more information, review the [networking documentation](image-builder-networking.md).

# [JSON](#tab/json)

```json
"vnetConfig": {
  "subnetId": "/subscriptions/<subscriptionID>/resourceGroups/<vnetRgName>/providers/Microsoft.Network/virtualNetworks/<vnetName>/subnets/<subnetName>"
}
```

# [Bicep](#tab/bicep)

```bicep
vnetConfig: {
  subnetId: '/subscriptions/<subscriptionID>/resourceGroups/<vnetRgName>/providers/Microsoft.Network/virtualNetworks/<vnetName>/subnets/<subnetName>'
}
```

---

## Image Template Operations

### Starting an Image Build

To start a build, you need to invoke 'Run' on the Image Template resource, examples of `run` commands:

```azurepowershell-interactive
Invoke-AzResourceAction -ResourceName $imageTemplateName -ResourceGroupName $imageResourceGroup -ResourceType Microsoft.VirtualMachineImages/imageTemplates -ApiVersion "2021-10-01" -Action Run -Force
```

```azurecli-interactive
az resource invoke-action \
  --resource-group $imageResourceGroup \
  --resource-type  Microsoft.VirtualMachineImages/imageTemplates \
  -n helloImageTemplateLinux01 \
  --action Run
```

### Cancelling an Image Build

If you're running an image build that you believe is incorrect, waiting for user input, or you feel will never complete successfully, then you can cancel the build.

The build can be canceled anytime. If the distribution phase has started you can still cancel, but you need to clean up any images that may not be completed. The cancel command doesn't wait for cancel to complete, monitor `lastrunstatus.runstate` for canceling progress, using these status [commands](image-builder-troubleshoot.md#customization-log).

Examples of `cancel` commands:

```azurepowershell-interactive
Invoke-AzResourceAction -ResourceName $imageTemplateName -ResourceGroupName $imageResourceGroup -ResourceType Microsoft.VirtualMachineImages/imageTemplates -ApiVersion "2021-10-01" -Action Cancel -Force
```

```azurecli-interactive
az resource invoke-action \
  --resource-group $imageResourceGroup \
  --resource-type  Microsoft.VirtualMachineImages/imageTemplates \
  -n helloImageTemplateLinux01 \
  --action Cancel
```

## Next steps

There are sample .json files for different scenarios in the [Azure Image Builder GitHub](https://github.com/azure/azvmimagebuilder).
