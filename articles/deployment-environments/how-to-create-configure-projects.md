---
title: Create and configure a project by using the Azure CLI
titleSuffix: Azure Deployment Environments
description: Learn how to create a project in Azure Deployment Environments and associate the project with a dev center using Azure CLI.
author: renato-marciano
ms.author: remarcia
ms.service: deployment-environments
ms.custom: devx-track-azurecli, build-2023
ms.topic: quickstart
ms.date: 04/28/2023
---

# Create and configure a project by using the Azure CLI

This quickstart shows you how to create a project in Azure Deployment Environments. Then, you associate the project with the dev center you created in [Quickstart: Create and configure a dev center](./quickstart-create-and-configure-devcenter.md).

A platform engineering team typically creates projects and provides project access to development teams. Development teams then create [environments](concept-environments-key-concepts.md#environments) by using [environment definitions](concept-environments-key-concepts.md#environment-definitions), connect to individual resources, and deploy applications.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure role-based access control role with permissions to create and manage resources in the subscription, such as [Contributor](../role-based-access-control/built-in-roles.md#contributor) or [Owner](../role-based-access-control/built-in-roles.md#owner).

## Create a project

To create a project in your dev center:

1. Sign in to the Azure CLI:

    ```azurecli
    az login
    ```

1. Install the Azure Dev Center extension for the CLI.

   ```azurecli
   az extension add --name devcenter --upgrade
   ```

1. Configure the default subscription as the subscription where your dev center resides:

   ```azurecli
   az account set --subscription <name>
   ```

1. Configure the default resource group as the resource group where your dev center resides:

   ```azurecli
   az configure --defaults group=<name>
   ```

1. Configure the default location as the location where your dev center resides. Location of project must match the location of dev center:

   ```azurecli
   az configure --defaults location=eastus
   ```

1. Retrieve dev center resource ID:

    ```azurecli
    DEVCID=$(az devcenter admin devcenter show -n <devcenter name> --query id -o tsv)
    echo $DEVCID
    ```

1. Create project in dev center:

    ```azurecli
    az devcenter admin project create -n <project name> \
    --description "My first project." \
    --dev-center-id $DEVCID
    ```

1. Confirm that the project was successfully created:

    ```azurecli
    az devcenter admin project show -n <project name>
    ```

### Assign a managed identity the owner role to the subscription
Before you can create environment types, you must give the managed identity that represents your dev center access to the subscriptions where you configure the [project environment types](concept-environments-key-concepts.md#project-environment-types). 

In this quickstart, you assign the Owner role to the system-assigned managed identity that you configured previously: [Attach a system-assigned managed identity](quickstart-create-and-configure-devcenter.md#attach-a-system-assigned-managed-identity).

1. Retrieve Subscription ID:

    ```azurecli
    SUBID=$(az account show -n <name> --query id -o tsv)
    echo $SUBID
    ```

1. Retrieve Object ID of Dev Center's Identity using name of dev center resource:

    ```azurecli
    OID=$(az ad sp list --display-name <devcenter name> --query [].id -o tsv)
    echo $SUBID
    ```

1. Assign dev center the Role of Owner on the Subscription:

    ```azurecli
    az role assignment create --assignee $OID \
    --role "Owner" \
    --scope "/subscriptions/$SUBID"
    ```

## Configure a project

To configure a project, add a [project environment type](how-to-configure-project-environment-types.md):

1. Retrieve Role ID for the Owner of Subscription

    ```azurecli
    # Remove group default scope for next command. Leave blank for group.
    az configure --defaults group=

    ROID=$(az role definition list -n "Owner" --scope /subscriptions/$SUBID --query [].name -o tsv)
    echo $ROID

    # Set default resource group again
    az configure --defaults group=<group name>
    ```

1. Show allowed environment type for project:

    ```azurecli
    az devcenter admin project-allowed-environment-type list --project <project name> --query [].name
    ```

1. Choose an environment type and create it for the project:

    ```azurecli
    az devcenter admin project-environment-type create -n <available env type> \
    --project <project name> \
    --identity-type "SystemAssigned" \
    --roles "{\"${ROID}\":{}}" \
    --deployment-target-id "/subscriptions/${SUBID}" \
    --status Enabled
    ```

> [!NOTE]
> At least one identity (system-assigned or user-assigned) must be enabled for deployment identity. The identity is used to perform the environment deployment on behalf of the developer. Additionally, the identity attached to the dev center should be [assigned the Owner role](how-to-configure-managed-identity.md) for  access to the deployment subscription for each environment type.

## Assign environment access

In this quickstart, you give access to your own ID. Optionally, you can replace the value of `--assignee` for the following commands with another member's object ID.

1. Retrieve your own Object ID:

    ```azurecli
    MYOID=$(az ad signed-in-user show --query id -o tsv)
    echo $MYOID
    ```

1. Assign admin access:

    ```azurecli
    az role assignment create --assignee $MYOID \
    --role "DevCenter Project Admin" \
    --scope "/subscriptions/$SUBID"
    ```

1. Optionally, you can assign Dev Environment User:

    ```azurecli
    az role assignment create --assignee $MYOID \
    --role "Deployment Environments User" \
    --scope "/subscriptions/$SUBID"
    ```


[!INCLUDE [note-deployment-environments-user](includes/note-deployment-environments-user.md)]

## Next steps

In this quickstart, you created a project and granted project access to your development team. To learn about how your development team members can create environments, advance to the next quickstart.

> [!div class="nextstepaction"]
> [Create and access an environment with Azure CLI](how-to-create-access-environments.md)
