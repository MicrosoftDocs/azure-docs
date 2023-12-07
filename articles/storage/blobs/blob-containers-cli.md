---
title: Manage blob containers using Azure CLI
titleSuffix: Azure Storage
description: Learn how to manage Azure storage containers using Azure CLI
services: storage
author: stevenmatthew

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 02/05/2022
ms.author: shaas
ms.devlang: azurecli
ms.custom: devx-track-azurecli
---

# Manage blob containers using Azure CLI

Microsoft Azure Blob Storage allows you to store large amounts of unstructured object data. You can use blob storage to gather or expose media, content, or application data to users. Because all blob data is stored within containers, you must create a storage container before you can begin to upload data. To learn more about blob storage, read the [Introduction to Azure Blob storage](storage-blobs-introduction.md).

The Azure CLI is Azure's cross-platform command-line experience for managing Azure resources. You can use it in your browser with Azure Cloud Shell. You can also install it on macOS, Linux, or Windows and run it locally from the command line.

In this how-to article, you learn to use the Azure CLI with Bash to work with container objects.

## Prerequisites

[!INCLUDE [storage-quickstart-prereq-include](../../../includes/storage-quickstart-prereq-include.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-h3.md)]

- It's always a good idea to install the latest version of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

### Authorize access to Blob storage

You can authorize access to Blob storage from the Azure CLI either with Microsoft Entra credentials or by using the storage account access key. Using Microsoft Entra credentials is recommended, and this article's examples use Microsoft Entra ID exclusively.

Azure CLI commands for data operations against Blob storage support the `--auth-mode` parameter, which enables you to specify how to authorize a given operation. Set the `--auth-mode` parameter to `login` to authorize with Microsoft Entra credentials. For more information, see [Authorize access to blob or queue data with Azure CLI](./authorize-data-operations-cli.md?toc=/azure/storage/blobs/toc.json).

Run the `login` command to open a browser and connect to your Azure subscription.

```azurecli-interactive
az login
```

## Create a container

To create a container with Azure CLI, call the [az storage container create](/cli/azure/storage/container#az-storage-container-create) command.The following example illustrates three options for the creation of blob containers with the `az storage container create` command. The first approach creates a single container, while the remaining two approaches use Bash scripting operations to automate container creation.

To use this example, supply values for the variables and ensure that you've logged in. Remember to replace the placeholder values in brackets with your own values.

```azurecli
#!/bin/bash
storageAccount="<storage-account>"
containerName="demo-container-1"
containerPrefix="demo-container-"

# Approach 1: Create a container
az storage container create \
    --name $containerName \
    --account-name $storageAccount \
    --auth-mode login

# Approach 2: Create containers with a loop
for value in {2..5}
do
    az storage container create \
        --name $containerPrefix$value \
        --account-name $storageAccount \
        --auth-mode login
done

# Approach 3: Create containers by splitting multiple values
containerList="${containerPrefix}6 ${containerPrefix}7 ${containerPrefix}8"
for container in $containerList
do
    az storage container create \
        --name $container \
        --account-name $storageAccount \
        --auth-mode login
done
```

## List containers

Use the `az storage container list` command to retrieve a list of storage containers. To return a list of containers whose names begin with a given character string, pass the string as the `--prefix` parameter value.

The `--num-results` parameter can be used to limit the number of containers returned by the request. Azure Storage limits the number of containers returned by a single listing operation to 5000. This limit ensures that manageable amounts of data are retrieved. If the number of containers returned exceeds either the `--num-results` value or the service limit, a continuation token is returned. This token allows you to use multiple requests to retrieve any number of containers.

You can also use the `--query` parameter to execute a [JMESPath query](/cli/azure/query-azure-cli) on the results of commands. JMESPath is a query language for JSON that allows you to select and modify data returned from CLI output. Queries are executed on the JSON output before it can be formatted. For more information, see [How to query Azure CLI command output using a JMESPath query](/cli/azure/query-azure-cli).

The following example first lists the maximum number of containers (subject to the service limit). Next, it lists three containers whose names begin with the prefix *container-* by supplying values for the `--num-results` and `--prefix` parameters. Finally, a single container is listed by supplying a known container name to the `--prefix` parameter.

Read more about the [az storage container list](/cli/azure/storage/container#az-storage-container-list).

```azurecli-interactive
#!/bin/bash
storageAccount="<storage-account>"
containerPrefix="demo-container-"
containerName="demo-container-1"
numResults="3"

# Approach 1: List maximum containers
az storage container list \
    --account-name $storageAccount \
    --auth-mode login

# Approach 2: List a defined number of named containers
az storage container list \
    --prefix $containerPrefix \
    --num-results $numResults \
    --account-name $storageAccount \
    --auth-mode login

# Approach 3: List an individual container
az storage container list \
    --prefix $containerPrefix \
    --query "[?name=='$containerName']" \
    --account-name $storageAccount \
    --auth-mode login
```

## Read container properties and metadata

A container exposes both system properties and user-defined metadata. System properties exist on each blob storage resource. Some properties are read-only, while others can be read or set. Under the covers, some system properties map to certain standard HTTP headers.

User-defined metadata consists of one or more name-value pairs that you specify for a blob storage resource. You can use metadata to store additional values with the resource. Metadata values are for your own purposes only, and don't affect how the resource behaves.

### Container properties

To display the properties of a container with Azure CLI, call the [az storage container show](/cli/azure/storage/container#az-storage-container-show) command.

In the following example, the first approach displays the properties of a single named container. Afterward, it retrieves all containers with the **demo-container-** prefix and iterates through them, listing their properties. Remember to replace the placeholder values with your own values.

```azurecli-interactive
#!/bin/bash
storageAccount="<storage-account>"
containerPrefix="demo-container-"
containerName="demo-container-1"

# Show a named container's properties
az storage container show \
    --name $containerName \
    --account-name $storageAccount \
    --auth-mode login

# List several containers and show their properties
containerList=$(az storage container list \
    --query "[].name" \
    --prefix $containerPrefix \
    --account-name $storageAccount \
    --auth-mode login \
    --output tsv)

for row in $containerList
do
  tmpRow=$(echo $row | sed -e 's/\r//g')
  az storage container show --name $tmpRow --account-name $storageAccount --auth-mode login
done
```

### Read and write container metadata

Users that have many thousands of objects within their storage account can quickly locate specific containers based on their metadata. To read the metadata, you'll use the `az storage container metadata show` command. To update metadata, you'll need to call the `az storage container metadata update` command. The method only accepts space-separated key-value pairs. For more information, see the [az storage container metadata](/cli/azure/storage/container/metadata) documentation.

The first example below updates and then retrieves a named container's metadata. The second example iterates the list of containers matching the `-prefix` value. Containers with names containing even numbers have their metadata set with values contained in the *metadata* variable.

```azurecli-interactive
#!/bin/bash
storageAccount="<storage-account>"
containerName="demo-container-1"
containerPrefix="demo-container-"

# Create metadata string
metadata="key=value pie=delicious"

# Update named container metadata
az storage container metadata update \
    --name $containerName \
    --metadata $metadata \
    --account-name $storageAccount \
    --auth-mode login

# Display metadata
az storage container metadata show \
    --name $containerName \
    --account-name $storageAccount \
    --auth-mode login

# Get list of containers
containerList=$(az storage container list \
    --query "[].name" \
    --prefix $containerPrefix \
    --account-name $storageAccount \
    --auth-mode login \
    --output tsv)

# Update and display metadata
for row in $containerList
do
  #Get the container's number
  tmpName=$(echo $row | sed -e 's/\r//g')
  if [ `expr ${tmpName: ${#containerPrefix}} % 2` == 0 ]
  then
    az storage container metadata update \
        --name $tmpName \
        --metadata $metadata \
        --account-name $storageAccount \
        --auth-mode login
    
    echo $tmpName

    az storage container metadata show \
    --name $tmpName \
    --account-name $storageAccount \
    --auth-mode login    
  fi
done
```

## Delete containers

Depending on your use case, you can delete a single container or a group of containers with the `az storage container delete` command. When deleting a list of containers, you'll need to use conditional operations as shown in the examples below.

> [!WARNING]
> Running the following examples may permanently delete containers and blobs. Microsoft recommends enabling container soft delete to protect containers and blobs from accidental deletion. For more info, see [Soft delete for containers](soft-delete-container-overview.md).

```azurecli-interactive
#!/bin/bash
storageAccount="<storage-account>"
containerName="demo-container-1"
containerPrefix="demo-container-"

# Delete a single named container
az storage container delete \
    --name $containerName \
    --account-name $storageAccount \
    --auth-mode login

# Delete containers by iterating a loop
list=$(az storage container list \
    --query "[].name" \
    --prefix $containerPrefix \
    --account-name $storageAccount \
    --auth-mode login \
    --output tsv)
for row in $list
do
    tmpName=$(echo $row | sed -e 's/\r//g')
    az storage container delete \
    --name $tmpName \
    --account-name $storageAccount \
    --auth-mode login
done
```

If you have container soft delete enabled for your storage account, then it's possible to retrieve containers that have been deleted. If your storage account's soft delete data protection option is enabled, the `--include-deleted` parameter will return containers deleted within the associated retention period. The `--include-deleted` parameter can only be used to return containers when used with the `--prefix` parameter. To learn more about soft delete, refer to the [Soft delete for containers](soft-delete-container-overview.md) article.

Use the following example to retrieve a list of containers deleted within the storage account's associated retention period.

```azurecli-interactive
#!/bin/bash
storageAccount="<storage-account>"
containerPrefix="demo-container-"

# Retrieve a list of containers including those recently deleted
az storage container list \
    --prefix $containerPrefix \
    --include-deleted \
    --account-name $storageAccount\
    --auth-mode login
```

## Restore a soft-deleted container

As mentioned in the [List containers](#list-containers) section, you can configure the soft delete data protection option on your storage account. When enabled, it's possible to restore containers deleted within the associated retention period. Before you can follow this example, you'll need to enable soft delete and configure it on at least one of your storage accounts.

The following examples explain how to restore a soft-deleted container with the `az storage container restore` command. You'll need to supply values for the `--name` and `--version` parameters to ensure that the correct version of the container is restored. If you don't know the version number, you can use the `az storage container list` command to retrieve it as shown in the first example. The second example finds and restores all deleted containers within a specific storage account.

To learn more about the soft delete data protection option, refer to the [Soft delete for containers](soft-delete-container-overview.md) article.

```azurecli-interactive
#!/bin/bash
storageAccount="<storage-account>"
containerName="demo-container-1"

# Restore an individual named container
containerVersion=$(az storage container list \
    --account-name $storageAccount \
    --query "[?name=='$containerName'].[version]" \
    --auth-mode login \
    --output tsv \
    --include-deleted | sed -e 's/\r//g')

az storage container restore \
    --name $containerName \
    --deleted-version $containerVersion \
    --account-name $storageAccount \
    --auth-mode login

# Restore a list of deleted containers
containerList=$(az storage container list \
    --account-name $storageAccount \
    --include-deleted \
    --auth-mode login \
    --query "[?deleted].{name:name,version:version}" \
    -o json)

for row in $(echo "${containerList}" | jq -c '.[]' )
do
    tmpName=$(echo $row | jq -r '.name')
    tmpVersion=$(echo $row | jq -r '.version')
    az storage container restore \
        --account-name $storageAccount \
        --name $tmpName \
        --deleted-version $tmpVersion \
        --auth-mode login
done
```

## Get a shared access signature for a container

A shared access signature (SAS) provides delegated access to Azure resources. A SAS gives you granular control over how a client can access your data. For example, you can specify which resources are available to the client. You can also limit the types of operations that the client can perform, and specify the interval over which the SAS is valid.

A SAS is commonly used to provide temporary and secure access to a client who wouldn't normally have permissions. To generate either a service or account SAS, you'll need to supply values for the `–-account-name` and `-–account-key` parameters. An example of this scenario would be a service that allows users read and write their own data to your storage account.

Azure Storage supports three types of shared access signatures: user delegation, service, and account SAS. For more information on shared access signatures, see the [Grant limited access to Azure Storage resources using shared access signatures](../common/storage-sas-overview.md) article.

> [!CAUTION]
> Any client that possesses a valid SAS can access data in your storage account as permitted by that SAS. It's important to protect a SAS from malicious or unintended use. Use discretion in distributing a SAS, and have a plan in place for revoking a compromised SAS.

The following example illustrates the process of configuring a service SAS for a specific container using the `az storage container generate-sas` command. Because it's generating a service SAS, the example first retrieves the storage account key to pass as the `--account-key` value.

The example will configure the SAS with start and expiry times and a protocol. It will also specify the **delete**, **read**, **write**, and **list** permissions in the SAS using the `--permissions` parameter. You can reference the full table of permissions in the [Create a service SAS](/rest/api/storageservices/create-service-sas) article.

Copy and paste the Blob SAS token value in a secure location. It will only be displayed once and can’t be retrieved once Bash is closed. To construct the SAS URL, append the SAS token (URI) to the URL for the storage service.

```azurecli-interactive
#!/bin/bash
storageAccount="<storage-account>"
containerName="demo-container-1"
permissions="drwl"
expiry=`date -u -d "30 minutes" '+%Y-%m-%dT%H:%MZ'`

accountKey=$(az storage account keys list \
    --account-name $storageAccount \
    --query "[?permissions == 'FULL'].[value]" \
    --output tsv)

accountKey=$( echo $accountKey | cut -d' ' -f1 )
 
az storage container generate-sas \
    --name $containerName \
    --https-only \
    --permissions dlrw \
    --expiry $expiry \
    --account-key $accountKey \
    --account-name $storageAccount
```

> [!NOTE]
> The SAS token returned by the Azure CLI does not include the delimiter character ('?') for the URL query string. If you are appending the SAS token to a resource URL, remember to append the delimiter character to the resource URL before appending the SAS token.

## Next steps

In this how-to article, you learned how to manage containers in Blob Storage. To learn more about working with blob storage by using Azure CLI, select an option below.

> [!div class="nextstepaction"]
> [Manage block blobs with Azure CLI](blob-cli.md)

> [!div class="nextstepaction"]
> [Azure CLI samples for Blob storage](storage-samples-blobs-cli.md?toc=/azure/storage/blobs/toc.json)
