---
title: Assign a managed identity to an application role using Azure CLI
description: Step-by-step instructions for assigning a managed identity access to another application's role, using Azure CLI.
services: active-directory
author: xstof

ms.service: active-directory
ms.subservice: msi
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 11/03/2021
ms.author: christoc
ms.collection: M365-identity-device-management 
ms.custom: devx-track-azurecli
ms.devlang: azurecli
---

# Assign a managed identity access to an application role using Azure CLI

Managed identities for Azure resources provide Azure services with an identity in Microsoft Entra ID. They work without needing credentials in your code. Azure services use this identity to authenticate to services that support Microsoft Entra authentication. Application roles provide a form of role-based access control, and allow a service to implement authorization rules.

> [!NOTE]
> The tokens which your application receives are cached by the underlying infrastructure, which means that any changes to the managed identity's roles can take significant time to take effect. For more information, see [Limitation of using managed identities for authorization](managed-identity-best-practice-recommendations.md#limitation-of-using-managed-identities-for-authorization).

In this article, you learn how to assign a managed identity to an application role exposed by another application using Azure CLI.

## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, check out the [overview section](overview.md). **Be sure to review the [difference between a system-assigned and user-assigned managed identity](overview.md#managed-identity-types)**.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## Assign a managed identity access to another application's app role

1. Enable managed identity on an Azure resource, [such as an Azure VM](qs-configure-cli-windows-vm.md).

1. Find the object ID of the managed identity's service principal.

   **For a system-assigned managed identity**, you can find the object ID on the Azure portal on the resource's **Identity** page. You can also use the following script to find the object ID. You'll need the resource ID of the resource you created in step 1, which is available in the Azure portal on the resource's **Properties** page.

    ```azurecli
    resourceIdWithManagedIdentity="/subscriptions/{my subscription ID}/resourceGroups/{my resource group name}/providers/Microsoft.Compute/virtualMachines/{my virtual machine name}"
    
    oidForMI=$(az resource show --ids $resourceIdWithManagedIdentity --query "identity.principalId" -o tsv | tr -d '[:space:]')
    echo "object id for managed identity is: $oidForMI"
    ```

    **For a user-assigned managed identity**, you can find the managed identity's object ID on the Azure portal on the resource's **Overview** page. You can also use the following script to find the object ID. You'll need the resource ID of the user-assigned managed identity.

    ```azurecli
    userManagedIdentityResourceId="/subscriptions/{my subscription ID}/resourceGroups/{my resource group name}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{my managed identity name}"
    
    oidForMI=$(az resource show --id $userManagedIdentityResourceId --query "properties.principalId" -o tsv | tr -d '[:space:]')
    echo "object id for managed identity is: $oidForMI"
    ```

1. Create a new application registration to represent the service that your managed identity will send a request to. If the API or service that exposes the app role grant to the managed identity already has a service principal in your Microsoft Entra tenant, skip this step.

1. Find the object ID of the service application's service principal. You can find this using the Azure portal. Go to Microsoft Entra ID and open the **Enterprise applications** page, then find the application and look for the **Object ID**. You can also find the service principal's object ID by its display name using the following script:

    ```azurecli
    appName="{name for your application}"
    serverSPOID=$(az ad sp list --filter "displayName eq '$appName'" --query '[0].id' -o tsv | tr -d '[:space:]')
    echo "object id for server service principal is: $serverSPOID"
    ```

    > [!NOTE]
    > Display names for applications are not unique, so you should verify that you obtain the correct application's service principal.

    Alternatively you can find the Object ID by the unique Application ID for your application registration:

    ```azurecli
    appID="{application id for your application}"
    serverSPOID=$(az ad sp list --filter "appId eq '$appID'" --query '[0].id' -o tsv | tr -d '[:space:]')
    echo "object id for server service principal is: $serverSPOID"
    ```

1. Add an [app role](../develop/howto-add-app-roles-in-apps.md) to the application you created in step 3. You can create the role using the Azure portal or using Microsoft Graph. For example, you could add an app role like this:

    ```json
    {
        "allowedMemberTypes": [
            "Application"
        ],
        "displayName": "Read data from MyApi",
        "id": "0566419e-bb95-4d9d-a4f8-ed9a0f147fa6",
        "isEnabled": true,
        "description": "Allow the application to read data as itself.",
        "value": "MyApi.Read.All"
    }
    ```

1. Assign the app role to the managed identity. You'll need the following information to assign the app role:
    * `managedIdentityObjectId`: the object ID of the managed identity's service principal, which you found in step 2.
    * `serverServicePrincipalObjectId`: the object ID of the server application's service principal, which you found in step 4.
    * `appRoleId`: the ID of the app role exposed by the server app, which you generated in step 5 - in the example, the app role ID is `0566419e-bb95-4d9d-a4f8-ed9a0f147fa6`.
   
   Execute the following script to add the role assignment.  Note that this functionality is not directly exposed on the Azure CLI and that a REST command is used here instead:

    ```azurecli
    roleguid="0566419e-bb95-4d9d-a4f8-ed9a0f147fa6"
    az rest -m POST -u https://graph.microsoft.com/v1.0/servicePrincipals/$oidForMI/appRoleAssignments -b "{\"principalId\": \"$oidForMI\", \"resourceId\": \"$serverSPOID\",\"appRoleId\": \"$roleguid\"}"
    ```

## Next steps

- [Managed identity for Azure resources overview](overview.md)
- To enable managed identity on an Azure VM, see [Configure managed identities for Azure resources on an Azure VM using PowerShell](qs-configure-cli-windows-vm.md).
