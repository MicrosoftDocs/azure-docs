---
 title: include file
 description: include file
 services: media-services
 author: Juliako
 ms.service: media-services
 ms.topic: include
 ms.date: 04/13/2018
 ms.author: juliako
 ms.custom: include file
---

## Create a Media Services account

You first need to create a Media Services account. This section shows what you need for the acount creation using CLI 2.0.

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
