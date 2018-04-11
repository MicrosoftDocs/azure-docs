---
title: How to assign a user-assigned MSI access to an Azure resource, using Azure CLI
description: Step by step instructions for assigning a user-assigned MSI on one resource, access to another resource, using Azure CLI.
services: active-directory
documentationcenter: 
author: daveba
manager: mtillman
editor: 

ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 12/22/2017
ms.author: daveba
ROBOTS: NOINDEX,NOFOLLOW
---

# Assign a user-assigned Managed Service Identity (MSI) access to a resource, using Azure CLI

[!INCLUDE[preview-notice](~/includes/active-directory-msi-preview-notice-ua.md)]

Once you've created a user-assigned MSI, you can give the MSI access to another resource, just like any security principal. This example shows you how to give a user-assigned MSI access to an Azure storage account, using Azure CLI.

## Prerequisites

[!INCLUDE [msi-core-prereqs](~/includes/active-directory-msi-core-prereqs-ua.md)]

To run the CLI script examples in this tutorial, you have two options:

- Use [Azure Cloud Shell](~/articles/cloud-shell/overview.md) either from the Azure portal, or via the "Try It" button, located in the top right corner of each code block.
- [Install the latest version of CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli) (2.0.23 or later) if you prefer to use a local CLI console. Then sign in to Azure using [az login](/cli/azure/reference-index#az_login). Use an account that is associated with the Azure subscription under which you would like to deploy the user-assigned MSI and VM:

   ```azurecli
   az login
   ```

## Use RBAC to assign the MSI access to another resource

In order to use an MSI with a host resource (such as a VM), for sign-in or resource access, the MSI must first be granted resource access via role assignment. You can do this before associating the MSI with the host, or after. For the complete steps on creating and associating with a VM, see [Configure a user-assigned MSI for a VM, using Azure CLI](msi-qs-configure-cli-windows-vm.md).

In the following example, a user-assigned MSI is given access to a storage account.  

1. In order to give the MSI access, you need the client ID (also known as app ID) of the MSI's service principal. The client ID is provided by [az identity create](/cli/azure/identity#az_identity_create), upon provisioning of the MSI and its service principal (shown here for reference):

   ```azurecli-interactive
   az identity create -g rgPrivate -n msiServiceApp
   ```

   A successful response contains the client ID of the user-assigned MSI's service principal, in the `clientId` property:

   ```json
   {
        "clientId": "9391e5b1-dada-4a8z-834a-43ad44f296bl",
        "clientSecretUrl": "https://control-westcentralus.identity.azure.net/subscriptions/90z696ff-5efa-4909-a64d-f1b616f423ll/resourcegroups/rgPrivate/providers/Microsoft.ManagedIdentity/userAssignedIdentities/msiServiceApp/credentials?tid=733a8f0p-ec41-4e69-8adz-971fc4b533bl&oid=z4baa4fc-fce4-4202-8250-5fb359abblll&aid=9391e5b1-dada-4a8z-834a-43ad44f296bl",
        "id": "/subscriptions/90z696ff-5efa-4909-a64d-f1b616f423ll/resourcegroups/rgPrivate/providers/Microsoft.ManagedIdentity/userAssignedIdentities/msiServiceApp",
        "location": "westcentralus",
        "name": "msiServiceApp",
        "principalId": "z4baa4fc-fce4-4202-8250-5fb359abblll",
        "resourceGroup": "rgPrivate",
        "tags": {},
        "tenantId": "733a8f0p-ec41-4e69-8adz-971fc4b533bl",
        "type": "Microsoft.ManagedIdentity/userAssignedIdentities"
   }
   ```

2. Once the client ID is known, use [az role assignment create](/cli/azure/role/assignment#az_role_assignment_create) to assign the MSI access to another resource. Be sure to use your client ID for the `--assignee` parameter, and the matching subscription ID and resource group name, as returned when you run `az identity create`. Here the MSI is assigned "Reader" access to a storage account called "myStorageAcct":

   ```azurecli-interactive
   az role assignment create --assignee 9391e5b1-dada-4a8z-834a-43ad44f296bl --role Reader --scope /subscriptions/90z696ff-5efa-4909-a64d-f1b616f423ll/resourcegroups/rgPrivate/providers/Microsoft.Storage/storageAccounts/myStorageAcct
   ```

   A successful response looks similar to the following output:

   ```json
   {
        "id": "/subscriptions/90z696ff-5efa-4909-a64d-f1b616f423ll/resourcegroups/rgPrivate/providers/Microsoft.Storage/storageAccounts/myStorageAcct/providers/Microsoft.Authorization/roleAssignments/f4766864-9493-43c6-91d7-abd131c3c017",
        "name": "f4766864-9493-43c6-91d7-abd131c3c017",
        "properties": {
            "additionalProperties": {
            "createdBy": null,
            "createdOn": "2017-12-21T20:49:37.5590544Z",
            "updatedBy": "pd78b21f-17a4-41az-b7db-9aadec3376bl",
            "updatedOn": "2017-12-21T20:49:37.5590544Z"
            },
        "principalId": "z4baa4fc-fce4-4202-8250-5fb359abblll",
        "roleDefinitionId": "/subscriptions/90z696ff-5efa-4909-a64d-f1b616f423ll/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7",
        "scope": "/subscriptions/90z696ff-5efa-4909-a64d-f1b616f423ll/resourcegroups/rgPrivate/providers/Microsoft.Storage/storageAccounts/myStorageAcct"
        },
        "resourceGroup": "rgPrivate",
        "type": "Microsoft.Authorization/roleAssignments"
   }
   ```

## Next steps

- For an overview of MSI, see [Managed Service Identity overview](msi-overview.md).
- To enable a user-assigned MSI on an Azure VM, see [Configure a user-assigned Managed Service Identity (MSI) for a VM, using Azure CLI](msi-qs-configure-cli-windows-vm.md).

Use the following comments section to provide feedback and help us refine and shape our content.

