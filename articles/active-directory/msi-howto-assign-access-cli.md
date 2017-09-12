---
title: How to assign an MSI access to an Azure resource, using Azure CLI
description: Step by step instructions for assigning an MSI on one resource, access to another resource, using Azure CLI.
services: active-directory
documentationcenter: 
author: bryanla
manager: mbaldwin
editor: 

ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/14/2017
ms.author: bryanla
---

# How to assign a Managed Service Identity (MSI) access to a resource, using Azure CLI

Once you've configured an Azure resource with an MSI, you can give the MSI access to another resource, just like any security principal. This example shows you how to give an Azure virtual machine's MSI access to an Azure storage account, using Azure CLI.

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../includes/msi-qs-configure-prereqs.md)]

To run the CLI script examples, you have three options:

- Use [Azure Cloud Shell](../cloud-shell/overview.md) from the Azure portal (see next section).
- Use the embedded Azure Cloud Shell via the "Try It" button, located in the top right corner of each code block.
- [Install the latest version of CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli) (2.0.13 or later) if you prefer to use a local CLI console. 

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Use Role Based Access Control (RBAC) to assign the MSI access to another resource

After you've enabled MSI on an Azure resource, [such as an Azure VM](msi-qs-configure-cli-windows-vm.md). 

1. If you're not using Azure Cloud Shell from the Azure portal, first sign in to Azure using [az login](/cli/azure/#login). Use an account that is associated with the Azure subscription under which you would like to deploy the VM:

   ```azurecli-interactive
   az login
   ```

2. In this example, we are giving an Azure VM access to a storage account. First we use [az resource list](/cli/azure/resource/#list) to get the service principal for the VM named "myVM", which was created when we enabled MSI. Then, we use [az role assignment create](/cli/azure/role/assignment#az_role_assignment_create) to give the VM "Reader" access to a storage account called "myStorageAcct":

   ```azurecli-interactive
   az resource list -n myVM | grep principalId			
   az role assignment create --assignee <spID> --role 'Reader' --scope /subscriptions/<mySubscriptionID>/resourceGroups/<myResourceGroup>/providers/Microsoft.Storage/storageAccounts/myStorageAcct
   ```

## Troubleshooting

If the MSI for the resource does not show up in the list of available identities, verify that the MSI has been enabled correctly. In our case, we can go back to the Azure VM in the [Azure portal](https://portal.azure.com) and:

- look at the "Configuration" page and ensure MSI enabled = "Yes."
- look at the "Extensions" page and ensure the MSI extension deployed successfully.

If either is incorrect, you may need to redeploy the MSI on your resource again, or troubleshoot the deployment failure.

## Related content

- For an overview of MSI, see [Managed Service Identity overview](msi-overview.md).
- To enable MSI on an Azure VM, see [Configure an Azure VM Managed Service Identity (MSI) using Azure CLI](msi-qs-configure-cli-windows-vm.md).

Use the following comments section to provide feedback and help us refine and shape our content.

