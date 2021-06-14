---
title: Assign a managed identity to an application role using Azure CLI - Azure AD
description: Step-by-step instructions for assigning a managed identity access to another application's role, using Azure CLI.
services: active-directory
documentationcenter: 
author: lishakur
manager:
editor: 

ms.service: active-directory
ms.subservice: msi
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 23/05/2021
ms.author: lishakur
ms.collection: M365-identity-device-management
---

# Assign a managed identity access to an application role using Azure CLI

Managed identities for Azure resources provide Azure services with an identity in Azure Active Directory. They work without needing credentials in your code. Azure services use this identity to authenticate to services that support Azure AD authentication. Application roles provide a form of role-based access control, and allow a service to implement authorization rules.

In this article, you learn how to assign a managed identity to an application role exposed by another application using Azure CLI and a REST API call.

## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, check out the [overview section](overview.md). **Be sure to review the [difference between a system-assigned and user-assigned managed identity](overview.md#managed-identity-types)**.
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before continuing.
- You can run all the commands in this article either in the cloud or locally:
    - To run in the cloud, use the [Azure Cloud Shell](../../cloud-shell/overview.md).
    - To run locally, install the [Azure CLI](/cli/azure/install-azure-cli).

## Obtain a bearer access token

1. If running locally, sign into Azure through the Azure CLI:

    ```
    az login
    ``` 

## Assign a managed identity access to another application's app role

1. Enable managed identity on an Azure resource, [such as an Azure VM](qs-configure-cli-windows-vm.md).

1. Find the object ID of the managed identity's service principal. You can find the object ID on the Azure portal on the resource's **Identity** page. You can also use the following az cli command to find the object ID.

    ```azurecli-interactive
    az ad sp list --display-name "<managed identity name>" --query "[0].objectId"
    ```

1. Create a new application registration to represent the service that your managed identity will send a request to. If the API or service that exposes the app role grant to the managed identity already has a service principal in your Azure AD tenant, skip this step. For example, if you want to grant the managed identity access to the Microsoft Graph API, you can skip this step.

1. Find the object ID of the service application's service principal. You can find this using the Azure portal. Go to Azure Active Directory and open the **Enterprise applications** page, then find the application and look for the **Object ID**. You can also find the service principal's object ID by its display name using the following az cli command:

    ```azurecli-interactive
    az ad sp list --display-name "<application name>" --query "[0].objectId"
    ```

    > [!NOTE]
    > Display names for applications are not unique, so you should verify that you obtain the correct application's service principal.

1. Add an [app role](../develop/howto-add-app-roles-in-azure-ad-apps.md) to the application you created in step 3. You can create the role using the Azure portal or using Microsoft Graph. For example, you could add an app role like this:

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
    * `managed_identity_object_id`: the object ID of the managed identity's service principal, which you found in step 2.
    * `server_service_principal_object_id`: the object ID of the server application's service principal, which you found in step 4.
    * `app_role_id`: the ID of the app role exposed by the server app, which you generated in step 5 - in the example, the app role ID is `0566419e-bb95-4d9d-a4f8-ed9a0f147fa6`.
    * `tenant_id` : your Azure Subscription ID.
   
   Execute the following az cli command to add the role assignment:

    ```azurecli-interactive
    json="{\"id\": $app_role_id,\"principalId\": $managed_identity_object_id,\"resourceId\": $server_service_principal_object_id}"
   
    az rest -m post -u "https://graph.windows.net/$tenant_id/servicePrincipals/$managed_identity_object_id/appRoleAssignments?api-version=1.6" -b $json
    ```

## Complete script

This example script shows how to assign an Azure web app's managed identity to an app role.

```azurecli-interactive

# Your Sub ID (in the Azure portal, under Azure Active Directory > Overview).
subscription_id=$(az account show --query "id")

# Your tenant ID (in the Azure portal, under Azure Active Directory > Overview).
tenant_id=$(az account show --query "homeTenantId" -o tsv))

az account set --subscription $subscription_id

# The name of your web app, which has a managed identity that should be assigned to the server app's app role.
web_app_name="<web-app-name>"
resource_group_name="<resource-group-name-containing-web-app>"

# The name of the server app that exposes the app role.
server_application_name="<server-application-name>" # For example, MyApi

# The name of the app role that the managed identity should be assigned to.
app_role_name="<app-role-name>" # For example, MyApi.Read.All

# Look up the web app's managed identity's object ID.
managed_identity_object_id=$(az webapp show --name $web_app_name --resource-group $resource_group_name --query "identity.principalId")

# Look up the details about the server app's service principal and app role.
server_service_principal_object_id = $(az ad sp list --display-name $server_application_name --query "[0].objectId")
app_role_id = $(az ad sp list --display-name $server_application_name --query "[0] .appRoles [?value=='$app_role_name'].id | [0]")

# Assign the managed identity access to the app role.

json="{\"id\":$app_role_id,\"principalId\": $managed_identity_object_id,\"resourceId\":$server_service_principal_object_id}"
   
az rest -m post -u "https://graph.windows.net/$tenant_id/servicePrincipals/$managed_identity_object_id/appRoleAssignments?api-version=1.6" -b $json
```

## Next steps

- [Managed identity for Azure resources overview](overview.md)
- To enable managed identity on an Azure VM, see [Configure managed identities for Azure resources on an Azure VM using Azure CLI](qs-configure-cli-windows-vm.md).
