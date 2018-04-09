## Create a Media Services account

You first need to create a Media Services account. This section shows what you need for the acount creation using CLI 2.0.

### Log in to Azure

Log in to the [Azure portal](http://portal.azure.com) and launch **CloudShell** to execute CLI commands.

### Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. Just click the **Copy** button to copy the code, paste it into the Cloud Shell, and then press enter to run it.  There are a few ways to launch the Cloud Shell:

|  |   |
|-----------------------------------------------|---|
| Click **Try It** in the upper right corner of a code block. | ![Cloud Shell in this article](./media/media-services-cli-create-v3-account-include/cli-try-it.png) |
| Open Cloud Shell in your browser. | [![https://shell.azure.com/bash](./media/media-services-cli-create-v3-account-include/launchcloudshell.png)](https://shell.azure.com/bash) |
| Click the **Cloud Shell** button on the menu in the upper right of the [Azure portal](https://portal.azure.com). |	![Cloud Shell in the portal](./media/media-services-cli-create-v3-account-include/cloud-shell-menu.png) |
|  |  |

### Create a resource group

Create a resource group using the following command. An Azure resource group is a logical container into which resources like Azure Media Services accounts and the associated Storage accounts are deployed and managed.

```azurecli-interactive
az group create --name amsResourcegroup --location westus2
```

### Create a storage account

When creating a Media Services account, you need to supply the ID of an Azure Storage account resource. The specified storage account is attached to your Media Services account. 

The following command creates a Storage account that is going to be associated with the Media Services account. In the script below, substitute the `storageaccountforams` placeholder. The account name must have length less than 24.

```azurecli-interactive
az storage account create --name <storageaccountforams> --resource-group amsResourcegroup
```

### Create a Media Services account

Below you can find the Azure CLI commands that creates a new Media Services account. You just need to replace the following highlighted values: `amsaccountname` and `storageaccountforams`.

```azurecli-interactive
az ams create --name <amsaccountname> --resource-group amsResourcegroup --storage-account <storageaccountforams>
```