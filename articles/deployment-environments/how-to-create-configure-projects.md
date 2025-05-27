---
title: Create and configure a project by using Azure CLI
titleSuffix: Azure Deployment Environments
description: Learn how to use Azure CLI to create a project in Azure Deployment Environments and associate the project with a dev center.
author: renato-marciano
ms.author: remarcia
ms.service: azure-deployment-environments
ms.custom: devx-track-azurecli, build-2023
ms.topic: quickstart
ms.date: 03/19/2025

#customer intent: As a platform engineer, I want to create a project in Azure Deployment Environments so that my teams can deploy applications.
---

# Create and configure a project by using Azure CLI

In this quickstart, you create a project in Azure Deployment Environments. You then associate the project with the dev center you created in [Create and configure a dev center by using the Azure CLI](how-to-create-configure-dev-center.md).

A platform engineering team typically creates projects and provides project access to development teams. Development teams then create [environments](concept-environments-key-concepts.md#environments) by using [environment definitions](concept-environments-key-concepts.md#environment-definitions), connect to individual resources, and deploy applications.

## Prerequisites

|Category|Requirement|
|-|-|
|**Subcription**|An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).|
|**Permissions**| Azure role-based access control role with permissions to create and manage resources in the subscription, such as [Contributor](../role-based-access-control/built-in-roles.md#contributor) or [Owner](../role-based-access-control/built-in-roles.md#owner).|
|**Resource**|- A [dev center](how-to-create-configure-dev-center.md).|

## Create a project

To create a project in your dev center:

1. Sign in to the Azure CLI:

    ```azurecli
    az login
    ```

1. Install the Azure CLI *devcenter* extension:

   ```azurecli
   az extension add --name devcenter --upgrade
   ```

1. Configure the default subscription as the subscription where your dev center resides:

   ```azurecli
   az account set --subscription <subscriptionName>
   ```

1. Configure the default resource group as the resource group where your dev center resides:

   ```azurecli
   az configure --defaults group=<resourceGroupName>
   ```

1. Configure the default location as the location where your dev center resides. The location of the project must match the location of the dev center.

   ```azurecli
   az configure --defaults location=eastus
   ```

1. Retrieve the dev center resource ID:

    ```azurecli
    $DEVCID = az devcenter admin devcenter show -n <devcenterName> --query id -o tsv
    Write-Output $DEVCID
    ```

1. Create the project in the dev center:

    ```azurecli
    az devcenter admin project create -n <projectName> `
    --description "My first project." `
    --dev-center-id $DEVCID
    ```

1. Confirm that the project was successfully created:

    ```azurecli
    az devcenter admin project show -n <projectName>
    ```

### Assign the Owner role to a managed identity

Before you can create environment types, you must give the managed identity that represents your dev center access to the subscriptions where you configure the [project environment types](concept-environments-key-concepts.md#project-environment-types). 

In this quickstart, you assign the Owner role to the system-assigned managed identity that you configured previously: [Attach a system-assigned managed identity](quickstart-create-and-configure-devcenter.md#attach-a-system-assigned-managed-identity).

1. Retrieve the subscription ID:

    ```azurecli
    $SUBID = az account show --name <subscriptionName> --query id -o tsv
    Write-Output $SUBID
    ```

1. Retrieve the object ID of the dev center's identity by using the name of the dev center resource:

    ```azurecli
    $OID = az ad sp list --display-name <devcenterName> --query [].id -o tsv
    Write-Output $OID
    ```

1. Assign the role of Owner to the dev center on the subscription:

    ```azurecli
    az role assignment create --assignee $OID `
    --role "Owner" `
    --scope "/subscriptions/$SUBID"
    ```

## Configure a project

To configure a project, add a [project environment type](how-to-configure-project-environment-types.md):

1. Retrieve the role ID for the owner of the subscription:

    ```azurecli
    # Remove the group default scope for next the command. 
    az configure --defaults group=

    $ROID = az role definition list -n "Owner" --scope /subscriptions/$SUBID --query [].name -o tsv
    Write-Output $ROID

    # Set the default resource group again.
    az configure --defaults group=<resourceGroupName>
    ```

1. Show allowed environment types for the project:

    ```azurecli
    az devcenter admin project-allowed-environment-type list --project <projectName> --query [].name
    ```

1. Choose an environment type and create it for the project:

    ```azurecli
    $roles = "{`"$($ROID)`":{}}"
    az devcenter admin project-environment-type create `
        -n <availableEnvironmentType> `
        --project <projectName> `
        --identity-type "SystemAssigned" `
        --roles $roles `
        --deployment-target-id "/subscriptions/$SUBID" `
        --status Enabled
    ```

> [!NOTE]
> At least one identity (system-assigned or user-assigned) must be enabled for deployment identity. The identity is used to perform the environment deployment on behalf of the developer. Additionally, the identity attached to the dev center should be [assigned the Owner role](how-to-configure-managed-identity.md) for access to the deployment subscription for each environment type.

## Assign environment access

In this quickstart, you give access to your own ID. Optionally, you can replace the value of `--assignee` for the following commands with another member's object ID.

1. Retrieve your own object ID:

    ```azurecli
    $MYOID = az ad signed-in-user show --query id -o tsv
    Write-Output $MYOID
    ```

1. Assign admin access:

    ```azurecli
    az role assignment create --assignee $MYOID `
    --role "DevCenter Project Admin" `
    --scope "/subscriptions/$SUBID"
    ```

1. Optionally, you can assign the Dev Environment User role:

    ```azurecli
    az role assignment create --assignee $MYOID `
    --role "Deployment Environments User" `
    --scope "/subscriptions/$SUBID"
    ```


[!INCLUDE [note-deployment-environments-user](includes/note-deployment-environments-user.md)]

## Next step

In this quickstart, you created a project and granted project access to your development team. To learn how your development team members can create environments, go to the next quickstart:

> [!div class="nextstepaction"]
> [Create and access an environment by using the Azure CLI](how-to-create-access-environments.md)
