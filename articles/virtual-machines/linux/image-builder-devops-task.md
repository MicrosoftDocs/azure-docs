---
title: Azure Image Builder Service DevOps Task
description: Azure DevOps task to inject build artifacts into a VM image so you can install and configure your application and OS.
author: danielsollondon
ms.author: danis
ms.date: 01/27/2021
ms.topic: article
ms.service: virtual-machines
ms.subservice: image-builder
ms.collection: linux
---

# Azure Image Builder Service DevOps Task

This article shows you how to use an Azure DevOps task to inject build artifacts into a VM image so you can install and configure your application and OS.

## DevOps Task versions
There are two Azure VM Image Builder (AIB) DevOps Tasks:

* ['Stable' AIB Task](https://marketplace.visualstudio.com/items?itemName=AzureImageBuilder.devOps-task-for-azure-image-builder), this is the latest stable build that has been tested, and telemetry shows no issues. 


* ['Unstable' AIB Task](https://marketplace.visualstudio.com/items?itemName=AzureImageBuilder.devOps-task-for-azure-image-builder-canary), this allows us to put in the latest updates and features, allow customers to test them, before we promote it to the 'stable' task. If there are no reported issues, and our telemetry shows no issues, approximately 1 week later, we will promote the task code to 'stable'. 

## Prerequisites

* Install the [Stable DevOps Task from Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=AzureImageBuilder.devOps-task-for-azure-image-builder).
* You must have a VSTS DevOps account, and a Build Pipeline created
* Register and enable the Image Builder feature requirements in the subscription used by the pipelines:
    * [Az PowerShell](../windows/image-builder-powershell.md#register-features)
    * [Az CLI](../windows/image-builder.md#register-the-features)
    
* Create a Standard Azure Storage Account in the source image Resource Group, you can use other Resource Group/Storage accounts. The storage account is used transfer the build artifacts from the DevOps task to the image.

    ```powerShell
    # Az PowerShell
    $timeInt=$(get-date -UFormat "%s")
    $storageAccName="aibstorage"+$timeInt
    $location=westus
    # create storage account and blob in resource group
    New-AzStorageAccount -ResourceGroupName $strResourceGroup -Name $storageAccName -Location $location -SkuName Standard_LRS
    ```

    ```bash
    # Az CLI
    location=westus
    scriptStorageAcc=aibstordot$(date +'%s')
    # create storage account and blob in resource group
    az storage account create -n $scriptStorageAcc -g $strResourceGroup -l $location --sku Standard_LRS
    ```

## Add Task to Release Pipeline

Select **Release Pipeline** > **Edit**

On the User Agent, select *+* to add then search for **Image Builder**. Select **Add**.

Set the following task properties:

### Azure Subscription

Select from the drop-down menu which subscription you want the Image Builder to run. Use the same subscription where your source images are located and where the images are to be distributed. You need to authorize the image builder contributor access to the Subscription or Resource Group.

### Resource Group

Use the resource group where the temporary image template artifact will be stored. When creating a template artifact, an additional temporary Image Builder resource group `IT_<DestinationResourceGroup>_<TemplateName>_guid` is created. The temporary resource group stores the image metadata, such as scripts. At the end of the task, the image template artifact and temporary Image Builder resource group is deleted.
 
### Location

The location is the region where the Image Builder will run. Only a set number of [regions](../image-builder-overview.md#regions) are supported. The source images must be present in this location. For example, if you are using Shared Image Gallery, a replica must exist in that region.

### Managed Identity (Required)
Image Builder requires a Managed Identity, which it uses to read source custom images, connect to Azure Storage, and create custom images. See [here](../image-builder-overview.md#permissions) for more details.

### VNET Support

Currently the DevOps task does not support specifying an existing Subnet, this is on the roadmap, but if you want to utilize an existing VNET, you can use an ARM template, with an Image Builder template nested inside, please see the Windows Image Builder template examples on how this is achieved, or alternatively use [AZ AIB PowerShell](../windows/image-builder-powershell.md).

### Source

The source images must be of the supported Image Builder OSs. You can choose existing custom images in the same region as Image Builder is running from:
* Managed Image - You need to pass in the resourceId, for example:
    ```json
    /subscriptions/<subscriptionID>/resourceGroups/<rgName>/providers/Microsoft.Compute/images/<imageName>
    ```
* Azure Shared Image Gallery - You need to pass in the resourceId of the image version, for example:
    ```json
    /subscriptions/$subscriptionID/resourceGroups/$sigResourceGroup/providers/Microsoft.Compute/galleries/$sigName/images/$imageDefName/versions/<versionNumber>
    ```

    If you need to get the latest Shared Image Gallery version, you can have an AZ PowerShell or AZ CLI task before that will get the latest version and set a DevOps variable. Use the variable in the AZ VM Image Builder DevOps task. For more information, see the [examples](https://github.com/danielsollondon/azvmimagebuilder/tree/master/solutions/8_Getting_Latest_SIG_Version_ResID#getting-the-latest-image-version-resourceid-from-shared-image-gallery).

* (Marketplace) Base Image
    There is a drop-down list of popular images, these will always use the 'latest' version of the supported OS's. 

    If the base image is not in the list, you can specify the exact image using `Publisher:Offer:Sku`.

    Base Image Version (optional) - You can supply the version of the image you want to use, default is `latest`.

### Customize

#### Provisioner

Initially, two customizers are supported - **Shell** and **PowerShell**. Only inline is supported. If you want to download scripts, then you can pass inline commands to do so.

For your OS, select PowerShell or Shell.

#### Windows Update Task

For Windows only, the task runs Windows Update at the end of the customizations. It handles the required reboots.

The following Windows Update configuration is executed:
```json
    "type": "WindowsUpdate",
    "searchCriteria": "IsInstalled=0",
    "filters": [
        "exclude:$_.Title -like '*Preview*'",
        "include:$true"
```
It installs important and recommended Windows Updates that are not preview.

#### Handling Reboots
Currently the DevOps task does not have support for rebooting Windows builds, if you try to reboot with PowerShell code, the build will fail. However, you can use code to reboot Linux builds.

#### Build Path

The task is designed to be able to inject DevOps Build release artifacts into the image. To make this work, you need to set up a build pipeline. In the setup of the release pipeline, you must add the repo of the build artifacts.

:::image type="content" source="./media/image-builder-devops-task/add-artifact.png" alt-text="Selecting add an artifact in the release pipeline.":::

Select the **Build Path** button to choose the build folder you want to be placed on the image. The Image Builder task copies all files and directories within it. When the image is being created, Image Builder deploys the files and directories into different paths, depending on OS.

> [!IMPORTANT]
> When adding a repo artifact, you may find the directory is prefixed with an underscore *_*. The underscore can cause issues with the inline commands. Use the appropriate quotes in the commands.
> 

The following example explains how this works:

:::image type="content" source="./media/image-builder-devops-task/build-artifacts.png" alt-text="A directory structure showing hierarchy.":::


* Windows - Files exist in `C:\`. A directory named `buildArtifacts` is created which includes the `webapp` directory.

* Linux - Files exist in  `/tmp`. The `webapp` directory is created which includes all files and directories. You must move the files from this directory. Otherwise, they will be deleted since it is in the temporary directory.

#### Inline customization script

* Windows - You can enter PowerShell inline commands separated by commas. If you want to run a script in your build directory, you can use:

    ```PowerShell
    & 'c:\buildArtifacts\webapp\webconfig.ps1'
    ```

   You can reference multiple scripts, or add more commands, for example:

    ```PowerShell
    & 'c:\buildArtifacts\webapp\webconfig.ps1'
    & 'c:\buildArtifacts\webapp\installAgent.ps1'
    ```
* Linux - On Linux systems the build artifacts are put into the `/tmp` directory. However, on many Linux OSs, on a reboot, the /tmp directory contents are deleted. If you want the artifacts to exist in the image, you must create another directory and copy them over.  For example:

    ```bash
    sudo mkdir /lib/buildArtifacts
    sudo cp -r "/tmp/_ImageBuilding/webapp" /lib/buildArtifacts/.
    ```
    
    If you are ok using the "/tmp" directory, then you can use the code below to execute the script.
    
    ```bash
    # grant execute permissions to execute scripts
    sudo chmod +x "/tmp/_ImageBuilding/webapp/coreConfig.sh"
    echo "running script"
    sudo . "/tmp/AppsAndImageBuilderLinux/_WebApp/coreConfig.sh"
    ```
    
#### What happens to the build artifacts after the image build?

> [!NOTE]
> Image Builder does not automatically remove the build artifacts, it is strongly suggested that you always have code to remove the build artifacts.
> 

* Windows - Image builder deploys files to the `c:\buildArtifacts` directory. The directory is persisted you must remove the directory. You can remove it in the  script you execute. For example:

    ```PowerShell
    # Clean up buildArtifacts directory
    Remove-Item -Path "C:\buildArtifacts\*" -Force -Recurse
    
    # Delete the buildArtifacts directory
    Remove-Item -Path "C:\buildArtifacts" -Force 
    ```
    
* Linux - The build artifacts are put into the `/tmp` directory. However, on many Linux OSs, on a reboot, the `/tmp` directory contents are deleted. It is suggested that you have code to remove the contents and not rely on the OS to remove the contents. For example:

    ```bash
    sudo rm -R "/tmp/AppsAndImageBuilderLinux"
    ```
    
#### Total length of image build

Total length cannot be changed in the DevOps pipeline task yet. It uses the default of 240 minutes. If you want to increase the [buildTimeoutInMinutes](./image-builder-json.md#properties-buildtimeoutinminutes), then you can use an AZ CLI task in the Release Pipeline. Configure the task to copy a template and submit it. For an example, see this [solution](https://github.com/danielsollondon/azvmimagebuilder/tree/master/solutions/4_Using_ENV_Variables#using-environment-variables-and-parameters-with-image-builder), or use Az PowerShell.


#### Storage Account

Select the storage account you created in the prerequisites. If you do not see it in the list, Image Builder does not have permissions to it.

When the build starts, Image Builder will create a container called `imagebuilder-vststask`. The container is where the build artifacts from the repo are stored.

> [!NOTE]
> You need to manually delete the storage account or container after each build.
>

### Distribute

There are 3 distribute types supported.

#### Managed Image

* ResourceID:
    ```bash
    /subscriptions/<subscriptionID>/resourceGroups/<rgName>/providers/Microsoft.Compute/images/<imageName>
    ```

* Locations

#### Azure Shared Image Gallery

The Shared Image Gallery **must** already exist.

* ResourceID: 
    ```bash
    /subscriptions/<subscriptionID>/resourceGroups/<rgName>/providers/Microsoft.Compute/galleries/<galleryName>/images/<imageDefName>
    ```

* Regions: list of regions, comma separated. For example, westus, eastus, centralus

#### VHD

You cannot pass any values to this, Image Builder will emit the VHD to the temporary Image Builder resource group, `IT_<DestinationResourceGroup>_<TemplateName>`, in the *vhds* container. When you start the release build, image builder emits logs. When it has finished, it will emit the VHD URL.

### Optional Settings

* [VM Size](image-builder-json.md#vmprofile) - You can override the VM size, from the default of *Standard_D1_v2*. You may override to reduce total customization time, or because you want to create the images that depend on certain VM sizes, such as GPU / HPC etc.

## How it works

When you create the release, the task creates a container in the storage account, named *imagebuilder-vststask*. It zips and uploads your build artifacts and creates a SAS Token for the zip file.

The task uses the properties passed to the task to create the Image Builder Template artifact. The task does the following:
* Downloads the build artifact zip file and any other associated scripts. The files are saved in a storage account in the temporary Image Builder resource group `IT_<DestinationResourceGroup>_<TemplateName>`.
* Creates a template prefixed *t_* and a 10-digit monotonic integer. The template is saved to the resource group you selected. The template exists for the duration of the build in the resource group. 

Example output:

```text
start reading task parameters...
found build at:  /home/vsts/work/r1/a/_ImageBuilding/webapp
end reading parameters
getting storage account details for aibstordot1556933914
created archive /home/vsts/work/_temp/temp_web_package_21475337782320203.zip
Source for image:  { type: 'SharedImageVersion',
  imageVersionId: '/subscriptions/<subscriptionID>/resourceGroups/<rgName>/providers/Microsoft.Compute/galleries/<galleryName>/images/<imageDefName>/versions/<imgVersionNumber>' }
template name:  t_1556938436xxx
starting put template...
```

When the image build starts, the run status is reported in the release logs:

```text
starting run template...
```

When the image build completes, you see output similar to following text:

```text
2019-05-06T12:49:52.0558229Z starting run template...
2019-05-06T13:36:33.8863094Z run template:  Succeeded
2019-05-06T13:36:33.8867768Z getting runOutput for  SharedImage_distribute
2019-05-06T13:36:34.6652541Z ==============================================================================
2019-05-06T13:36:34.6652925Z ## task output variables ##
2019-05-06T13:36:34.6658728Z $(imageUri) =  /subscriptions/<subscriptionID>/resourceGroups/aibwinsig/providers/Microsoft.Compute/galleries/my22stSIG/images/winWAppimages/versions/0.23760.13763
2019-05-06T13:36:34.6659989Z ==============================================================================
2019-05-06T13:36:34.6663500Z deleting template t_1557146959485...
2019-05-06T13:36:34.6673713Z deleting storage blob imagebuilder-vststask\webapp/18-1/webapp_1557146958741.zip
2019-05-06T13:36:34.9786039Z blob imagebuilder-vststask\webapp/18-1/webapp_1557146958741.zip is deleted
2019-05-06T13:38:37.4884068Z delete template:  Succeeded
```

The image template and `IT_<DestinationResourceGroup>_<TemplateName>` is deleted.

You can take the '$(imageUri)' VSTS variable and use it in the next task or just use the value and build a VM.

## Output DevOps Variables

Pub/offer/SKU/Version of the source marketplace image:
* $(pirPublisher)
* $(pirOffer)
* $(pirSku)
* $(pirVersion)

Image URI - The ResourceID of the distributed image:
* $(imageUri)

## FAQ

### Can I use an existing image template I have already created, outside of DevOps?

Currently, not at this time.

### Can I specify the image template name?

No. A unique template name is used and then deleted.

### The image builder failed. How can I troubleshoot?

If there is a build failure, the DevOps task does not delete the staging resource group. You can access the staging resource group that contains the build customization log.

You will see an error in the DevOps log for the VM Image Builder task, and see the customization.log location. For example:

:::image type="content" source="./media/image-builder-devops-task/devops-task-error.png" alt-text="Example DevOps task error that shows a failure.":::

For more information on troubleshooting, see [Troubleshoot Azure Image Builder Service](image-builder-troubleshoot.md). 

After investigating the failure, you can delete the staging resource group. First, delete the Image Template Resource artifact. The artifact is prefixed with *t_* and can be found in the DevOps task build log:

```text
...
Source for image:  { type: 'SharedImageVersion',
  imageVersionId: '/subscriptions/<subscriptionID>/resourceGroups/<rgName>/providers/Microsoft.Compute/galleries/<galleryName>/images/<imageDefName>/versions/<imgVersionNumber>' }
...
template name:  t_1556938436xxx
...

```

The Image Template resource artifact is in the resource group specified initially in the task. When you're done troubleshooting delete the artifact. If deleting using the Azure portal, within the resource group, select **Show Hidden Types**, to view the artifact.


## Next steps

For more information, see [Azure Image Builder overview](../image-builder-overview.md).
