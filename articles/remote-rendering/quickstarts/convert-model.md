---
title: Convert a model
description: Quickstart that shows the conversion steps for a custom model.
author: florianborn71
ms.author: flborn
ms.date: 01/23/2020
ms.topic: quickstart
---

# Quickstart: Convert a model for rendering

In [Quickstart: Render a model with Unity](render-model.md), you learned how to use the Unity sample project to render a built-in model. This guide shows how to convert your own models.

You'll learn how to:

> [!div class="checklist"]
>
> * Set up an Azure blob storage account for input and output
> * Upload and convert a 3D model for use with Azure Remote Rendering
> * Include the converted 3D model in an application for rendering

## Prerequisites

* Complete [Quickstart: Render a model with Unity](render-model.md)
* Install Azure PowerShell [(documentation)](https://docs.microsoft.com/powershell/azure/)
  * Open a PowerShell with admin rights
  * Run: `Install-Module -Name Az -AllowClobber`

## Overview

The renderer on the server can't work directly with source model formats such as FBX or GLTF. Instead, it requires the model to be in a proprietary binary format.
The conversion service consumes models from Azure blob storage and writes converted models back to a provided Azure blob storage container.

You need:

* An Azure subscription
* A 'StorageV2' account in your subscription
* A blob storage container for your input model
* A blob storage container for your output data
* A model to convert, see [sample models](../samples/sample-model.md)
  * See the list of [supported source formats](../how-tos/conversion/model-conversion.md#supported-source-formats)
  * To use the sample conversion script make sure you prepare an input folder which contains the model and all external dependencies (like external textures or geometry)

## Azure setup

If you do not have an account yet, go to [https://azure.microsoft.com/get-started/](https://azure.microsoft.com/get-started/), click on the free account option, and follow the instructions.

Once you have an Azure account, go to [https://ms.portal.azure.com/#home](https://ms.portal.azure.com/#home).

### Storage account creation

To create blob storage, you first need a storage account.
To create one, click on the "Create a resource" button:

![Azure - add resource](media/azure-add-a-resource.png)

From the new screen, choose **Storage** on the left side and then **Storage account - blob, file, table, queue** from the next column:

![Azure - add storage](media/azure-add-storage.png)

Clicking this button will bring up the following screen with storage properties to fill out:

![Azure Setup](media/azure-setup1.png)

Fill out the form in the following manner:

* Create a new Resource Group from the link below the drop-down box and name this **ARR_Tutorial**
* For the **Storage account name**, enter a unique name here. **This name must be globally unique**, otherwise there will be a prompt that informs you that the name is ready given. In the scope of this quickstart, we name it **arrtutorialstorage**. Accordingly, you need to replace it with your name for any occurrence in this quickstart.
* Select a **location** close to you. Ideally use the same location as used for setting up the rendering in the other quickstart.
* **Performance** set to 'Standard'
* **Account kind** set to 'StorageV2 (general purpose v2)'
* **Replication** set to 'Read-access geo-redundant storage (RA-GRS)'
* **Access tier** set to 'Hot'

None of the properties in other tabs have to be changed, so you can proceed with **"Review + create"** and then follow the steps to complete the setup.

The website now informs you about the progress of your deployment and reports "Your deployment is complete" eventually. Click on the **"Go to resource"** button for the next steps:

![Azure Storage creation complete](./media/storage-creation-complete.png)

### Blob storage creation

Next we need two blob containers, one for input and one for output.

From the **"Go to resource"** button above, you get to a page with a panel on the left that contains a list menu. In that list under the **"Blob service"** category, click on the **"Containers"** button:

![Azure - add Containers](./media/azure-add-containers.png)

Press the **"+ Container"** button to create the **input** blob storage container.
Use the following settings when creating it:
  
* Name = arrinput
* Public access level = Private

After the container has been created, click **+ Container** again and repeat with these settings for the **output** container:

* Name = arroutput
* Public access level = Private

You should now have two blob storage containers:

![Blob Storage Setup](./media/blob-setup.png)

## Run the conversion

To make it easier to call the asset conversion service, we provide a utility script. It is located in the *Scripts* folder and is called **Conversion.ps1**.

In particular, this script

1. uploads all files in a given directory from local disk to the input storage container
1. calls the [the asset conversion REST API](../how-tos/conversion/conversion-rest-api.md) which will retrieve the data from the input storage container and start a conversion which will return a conversion id
1. poll the conversion status API with the retrieved conversion id until the conversion process terminates with success or failure
1. retrieves a link to the converted asset in the output storage

The script reads its configuration from the file *Scripts\arrconfig.json*. Open that JSON file in a text editor.

```json
{
    "accountSettings": {
        "arrAccountId": "8*******-****-****-****-*********d7e",
        "arrAccountKey": "R***************************************l04=",
        "region": "<your-region>"
    },
    "renderingSessionSettings": {
        "vmSize": "standard",
        "maxLeaseTime": "1:00:00"
    },
    "assetConversionSettings": {
        "localAssetDirectoryPath": "D:\\tmp\\robot",
        "resourceGroup": "ARR_Tutorial",
        "storageAccountName": "arrexamplestorage",
        "blobInputContainerName": "arrinput",
        "inputFolderPath": "robotConversion",
        "inputAssetPath": "robot.fbx",
        "blobOutputContainerName": "arroutput",
        "outputFolderPath":"converted/robot",
        "outputAssetFileName": "robot.arrAsset"
    }
}
```

The configuration within the **accountSettings** group (account ID and key) should be filled out analogous to the credentials in the [Render a model with Unity quickstart](render-model.md).

Inside the **assetConversionSettings** group, make sure to change **resourceGroup**, **blobInputContainerName**, and **blobOutputContainerName** as seen above.
Note that the value **arrtutorialstorage** needs to be replaced with the unique name you picked during storage account creation.

Change **localAssetDirectoryPath** to point to the directory on your disk which contains the model you intend to convert. Be careful to properly escape backslashes ("\\") in the path using double backslashes ("\\\\").

All data from the path given in **localAssetDirectoryPath** will be uploaded to the **blobInputContainerName** blob container under a subpath given by **inputFolderPath**. So in the example configuration above the content of the "D:\\tmp\\robot" directory will be uploaded to the blob container "arrinput" of the storage account "arrtutorialstorage" under the path "robotConversion". Already existing files will be overwritten.

Change **inputAssetPath** to the path of the model to be converted - the path is relative to localAssetDirectoryPath. Use "/" instead of "\\" as the path separator. So for a "robot.fbx" file which is located directly in "D:\\tmp\\robot" use "robot.fbx".

Once the model was converted it will be written back to the storage container given by **blobOutputContainerName**. A subpath can be specified by providing the optional **outputFolderPath**. In the example above the resulting "robot.arrAsset" will be copied to the output blob container under "converted/robot".

The config setting **outputAssetFileName** determines the name of the converted asset - the parameter is optional and the output filename will be deduced from the input file name otherwise. 

Open a PowerShell, make sure you installed the *Azure PowerShell* as mentioned in the [prerequisites](#prerequisites). Then log into your subscription with the following command and follow the on-screen directions:

```PowerShell
Connect-AzAccount
```

> [!NOTE]
> In case your organization has more than one subscription you might need to specify the SubscriptionId and Tenant arguments. Find details in the [Connect-AzAccount documentation](https://docs.microsoft.com/powershell/module/az.accounts/connect-azaccount).

Change to the `azure-remote-rendering\Scripts` directory and run the conversion script:

```PowerShell
.\Conversion.ps1 -UseContainerSas
```

You should see something like this:
![Conversion.ps1](./media/successful-conversion.png)

The conversion script generates a *Shared Access Signature (SAS)* URI for the converted model. You can now copy this URI as the **Model Name** into the quickstart sample app (see [Quickstart: Render a model with Unity](render-model.md)).

![Replace model in Unity](./media/replace-model-in-unity.png)

 The sample should now load and render your custom model!

## Optional: Re-creating a SAS URI

The SAS URI created by the conversion script will only be valid for 24 hours. However, after it expired you do not need to convert your model again. Instead, you can create a new SAS in the portal as described in the next steps:

1. Go to the [Azure portal](https://www.portal.azure.com)
1. Click on your **Storage account** resource:
![Signature Access](./media/portal-storage-accounts.png)
1. In the following screen, click on **Storage explorer** in the left panel and find your output model (*.arrAsset* file) in the *arroutput* blob storage container. Right-click on the file and select **Get Shared Access Signature** from the context menu:
![Signature Access](./media/portal-storage-explorer.png)
1. A new screen opens where you can select an expiry date. Press **Create**, and copy the URI that is shown in the next dialog. This new URI replaces the temporary URI that the script created.

## Next steps

Now that you know the basics, have a look at our tutorials to gain more in-depth knowledge.

If you want to learn the details of model conversion, check out [the model conversion REST API](../how-tos/conversion/conversion-rest-api.md).

> [!div class="nextstepaction"]
> [Tutorial: Setting up a Unity project from scratch](../tutorials/unity/project-setup.md)
