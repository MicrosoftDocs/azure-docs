---
title: Create a virtual machine image and use a user-assigned managed identity to access files in an Azure storage account
description: In this article, you'll use Azure VM Image Builder to create a virtual machine image that can access files that are stored in Azure Storage with a user-assigned managed identity.
author: kof-f
ms.author: kofiforson
ms.reviewer: erd
ms.date: 11/28/2022
ms.topic: how-to
ms.service: virtual-machines
ms.subservice: image-builder
ms.custom: devx-track-azurecli
---

# Create an image and use a user-assigned managed identity to access files in an Azure storage account 

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets 

This article shows how to create a customized image by using Azure VM Image Builder. The service uses a [user-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) to access files in an Azure storage account, without your having to make the files publicly accessible.

Azure VM Image Builder supports using scripts and copying files from GitHub, Azure storage accounts, and other locations. If you want to use the locations, they must be externally accessible to VM Image Builder.

In the following example, you'll create two resource groups, one for the custom image and the other to host an Azure storage account that contains a script file. This example simulates a real-life scenario, where you might have build artifacts or image files in various storage accounts. You'll create a user-assigned identity and then grant the identity read permissions on the script file, but you won't allow public access to the file. You'll then use the shell customizer to download and run a script from the storage account.


## Create a resource group

1. Because you'll be using some pieces of information repeatedly, create some variables to store that information.


    ```console
    # Image resource group name 
    imageResourceGroup=aibmdimsi
    # Storage resource group
    strResourceGroup=aibmdimsistor
    # Location 
    location=WestUS2
    # Name of the image to be created
    imageName=aibCustLinuxImgMsi01
    # Image distribution metadata reference name
    runOutputName=u1804ManImgMsiro
    ```

1. Create a variable for your subscription ID:

    ```console
    subscriptionID=$(az account show --query id --output tsv)
    ```

1. Create resource groups for both the image and the script storage:

    ```console
    # Create a resource group for the image template
    az group create -n $imageResourceGroup -l $location
    # Create a resource group for the script storage
    az group create -n $strResourceGroup -l $location
    ```

1. Create a user-assigned identity, and set permissions on the resource group:

    VM Image Builder uses the provided [user identity](../../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md#user-assigned-managed-identity) to inject the image into the resource group. In this example, you create an Azure role definition with specific actions for distributing the image. The role definition is then assigned to the user identity.

    ```console
    # Create a user-assigned identity for VM Image Builder to access the storage account where the script is located
    identityName=aibBuiUserId$(date +'%s')
    az identity create -g $imageResourceGroup -n $identityName

    # Get an identity ID
    imgBuilderCliId=$(az identity show -g $imageResourceGroup -n $identityName --query clientId -o tsv)

    # Get the user-identity URI, which is needed for the template
    imgBuilderId=/subscriptions/$subscriptionID/resourcegroups/$imageResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/$identityName

    # Download the preconfigured role definition example
    curl https://raw.githubusercontent.com/azure/azvmimagebuilder/master/solutions/12_Creating_AIB_Security_Roles/aibRoleImageCreation.json -o aibRoleImageCreation.json

    # Update the definition
    sed -i -e "s/<subscriptionID>/$subscriptionID/g" aibRoleImageCreation.json
    sed -i -e "s/<rgName>/$imageResourceGroup/g" aibRoleImageCreation.json

    # Create role definitions
    az role definition create --role-definition ./aibRoleImageCreation.json

    # Grant the role definition to the user-assigned identity
    az role assignment create \
        --assignee $imgBuilderCliId \
        --role "Azure Image Builder Service Image Creation Role" \
        --scope /subscriptions/$subscriptionID/resourceGroups/$imageResourceGroup
    ```

1. Create the storage account, and copy the sample script into it from GitHub:

    ```azurecli-interactive
    # Script storage account
    scriptStorageAcc=aibstorscript$(date +'%s')

    # Script container
    scriptStorageAccContainer=scriptscont$(date +'%s')

    # Script URL
    scriptUrl=https://$scriptStorageAcc.blob.core.windows.net/$scriptStorageAccContainer/customizeScript.sh

    # Create the storage account and blob in the resource group
    az storage account create -n $scriptStorageAcc -g $strResourceGroup -l $location --sku Standard_LRS

    az storage container create -n $scriptStorageAccContainer --fail-on-exist --account-name $scriptStorageAcc

    # Copy in an example script from the GitHub repo 
    az storage blob copy start \
        --destination-blob customizeScript.sh \
        --destination-container $scriptStorageAccContainer \
        --account-name $scriptStorageAcc \
        --source-uri https://raw.githubusercontent.com/azure/azvmimagebuilder/master/quickquickstarts/customizeScript.sh
    ```

1. Give VM Image Builder permission to create resources in the image resource group. The `--assignee` value is the user-identity ID.

    ```azurecli-interactive
    az role assignment create \
        --assignee $imgBuilderCliId \
        --role "Storage Blob Data Reader" \
        --scope /subscriptions/$subscriptionID/resourceGroups/$strResourceGroup/providers/Microsoft.Storage/storageAccounts/$scriptStorageAcc/blobServices/default/containers/$scriptStorageAccContainer 
    ```

## Modify the example

Download the example JSON file and configure it with the variables you created earlier.

```console
curl https://raw.githubusercontent.com/azure/azvmimagebuilder/master/quickquickstarts/7_Creating_Custom_Image_using_MSI_to_Access_Storage/helloImageTemplateMsi.json -o helloImageTemplateMsi.json
sed -i -e "s/<subscriptionID>/$subscriptionID/g" helloImageTemplateMsi.json
sed -i -e "s/<rgName>/$imageResourceGroup/g" helloImageTemplateMsi.json
sed -i -e "s/<region>/$location/g" helloImageTemplateMsi.json
sed -i -e "s/<imageName>/$imageName/g" helloImageTemplateMsi.json
sed -i -e "s%<scriptUrl>%$scriptUrl%g" helloImageTemplateMsi.json
sed -i -e "s%<imgBuilderId>%$imgBuilderId%g" helloImageTemplateMsi.json
sed -i -e "s%<runOutputName>%$runOutputName%g" helloImageTemplateMsi.json
```

## Create the image

1. Submit the image configuration to the VM Image Builder service:

    ```azurecli-interactive
    az resource create \
        --resource-group $imageResourceGroup \
        --properties @helloImageTemplateMsi.json \
        --is-full-object \
        --resource-type Microsoft.VirtualMachineImages/imageTemplates \
        -n helloImageTemplateMsi01
    ```

1. Start the image build:

    ```azurecli-interactive
    az resource invoke-action \
        --resource-group $imageResourceGroup \
        --resource-type  Microsoft.VirtualMachineImages/imageTemplates \
        -n helloImageTemplateMsi01 \
        --action Run 
    ```

The build can take about 15 minutes to finish.

## Create a VM

1. Create a VM from the image: 

    ```azurecli
    az vm create \
    --resource-group $imageResourceGroup \
    --name aibImgVm00 \
    --admin-username aibuser \
    --image $imageName \
    --location $location \
    --generate-ssh-keys
    ```

1. After the VM has been created, start a Secure Shell (SSH) session with it.

    ```console
    ssh aibuser@<publicIp>
    ```

After the SSH connection is established, you should receive a "Message of the Day" saying that the image was customized:

```output

*******************************************************
**            This VM was built from the:            **
**      !! AZURE VM IMAGE BUILDER Custom Image !!    **
**         You have just been Customized :-)         **
*******************************************************
```

## Clean up your resources

If you no longer need the resources that were created during this process, you can delete them by running the following code:

```azurecli-interactive

az role definition delete --name "$imageRoleDefName"
```azurecli-interactive
az role assignment delete \
    --assignee $imgBuilderCliId \
    --role "$imageRoleDefName" \
    --scope /subscriptions/$subscriptionID/resourceGroups/$imageResourceGroup
az identity delete --ids $imgBuilderId
az resource delete \
    --resource-group $imageResourceGroup \
    --resource-type Microsoft.VirtualMachineImages/imageTemplates \
    -n helloImageTemplateMsi01
az group delete -n $imageResourceGroup
az group delete -n $strResourceGroup
```

## Next steps

If you have any problems using VM Image Builder, see [Troubleshoot Azure VM Image Builder](image-builder-troubleshoot.md?toc=%2fazure%2fvirtual-machines%context%2ftoc.json).
