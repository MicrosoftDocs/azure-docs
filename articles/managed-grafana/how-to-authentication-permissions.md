---
title: How to set up authentication and permissions in Azure Managed Grafana
description: Learn how to set up Azure Managed Grafana authentication permissions using a system-assigned Managed identity or a Service Principal
ms.service: managed-grafana
ms.topic: how-to
author: maud-lv
ms.author: malev
ms.date: 12/13/2022
ms.custom: engagement-fy23
--- 

# Set up Azure Managed Grafana authentication and permissions

To process data, Azure Managed Grafana needs permission to access data sources. In this guide, learn how to set up authentication during the creation of the Azure Managed Grafana instance, so that Grafana can access data sources using a system-assigned managed identity or a service principal. This guide also introduces the option to add a Monitoring Reader role assignment on the target subscription.

## Prerequisite

An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).

## Sign in to Azure

Sign in to Azure with the Azure portal or with the Azure CLI.

### [Portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.  

### [Azure CLI](#tab/azure-cli)

Open your CLI and run the `az login` command to sign in to Azure.

```azurecli
az login
```

This command will prompt your web browser to launch and load an Azure sign-in page.

---

## Set up authentication and permissions during the creation of the instance

Create a workspace with the Azure portal or the CLI.

### [Portal](#tab/azure-portal)

#### Create a workspace: basic and advanced settings

1. In the upper-left corner of the home page, select **Create a resource**. In the **Search resources, services, and docs (G+/)** box, enter *Azure Managed Grafana* and select **Azure Managed Grafana**.

    :::image type="content" source="media/authentication/find-azure-portal-grafana.png" alt-text="Screenshot of the Azure platform. Find Azure Managed Grafana in the marketplace." :::

1. Select **Create**.

1. In the **Basics** pane, enter the following settings.

    | Setting             | Description                                                                                                                                                                                                                                                                                                              | Example             |
    |---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------|
    | Subscription ID     | Select the Azure subscription you want to use.                                                                                                                                                                                                                                                                           | *my-subscription*   |
    | Resource group name | Create a resource group for your Azure Managed Grafana resources.                                                                                                                                                                                                                                                        | *my-resource-group* |
    | Location            | Use Location to specify the geographic location in which to host your resource. Choose the location closest to you.                                                                                                                                                                                                      | *(US) East US*      |
    | Name                | Enter a unique resource name. It will be used as the domain name in your Managed Grafana instance URL.                                                                                                                                                                                                                   | *my-grafana*        |
    | Zone redundancy     | Zone redundancy is disabled by default. Zone redundancy automatically provisions and manages a standby replica of the Managed Grafana instance in a different availability zone within one region. There's an [additional charge](https://azure.microsoft.com/pricing/details/managed-grafana/#pricing) for this option. | *Disabled*          |

    :::image type="content" source="media/authentication/create-form-basics.png" alt-text="Screenshot of the Azure portal. Create workspace form. Basics.":::

1. Select **Next : Advanced >** to access API key creation and statics IP address options. **Enable API key creation** and **Deterministic outbound IP** options are set to **Disable** by default. Optionally enable API key creation and enable a static IP address.

1. Select **Next : Permission >** to control access rights for your Grafana instance and data sources:

#### Create a workspace: permission settings

Review below different methods to manage permissions to access data sources within Azure Managed Grafana.

##### With managed identity enabled

System-assigned managed identity is the default authentication method provided to all users who have the Owner or User Access Administrator role for the subscription.  

> [!NOTE]
> In the permissions tab, if Azure displays the message "You must be a subscription 'Owner' or 'User Access Administrator' to use this feature.", go to the next section of this doc to learn about setting up Azure Managed Grafana with system-assigned managed identity disabled.

1. The box **System assigned managed identity** is set to **On** by default.

1. The box **Add role assignment to this identity with 'Monitoring Reader' role on target subscription** is checked by default. If you uncheck this box, you will need to manually add role assignments for Azure Managed Grafana later on. For reference, go to [Modify access permissions to Azure Monitor](how-to-permissions.md).

1. Under **Grafana administrator role**, the box **Include myself** is checked by default. Optionally select **Add** to grant the Grafana administrator role to more members.

    :::image type="content" source="media/authentication/create-form-permission.png" alt-text="Screenshot of the Azure portal. Create workspace form. Permission.":::

##### With managed identity disabled

Azure Managed Grafana can also access data sources with managed identity disabled. You can use a service principal for authentication, using a client ID and secret.

1. In the **Permissions** tab, set the box **System assigned managed identity** to **Off**. The line **Add role assignment to this identity with 'Monitoring Reader' role on target subscription** is automatically grayed out.

1. Under **Grafana administrator role**, if you have the Owner or User Access Administrator role for the subscription, the box **Include myself** is checked by default. Optionally select **Add** to grant the Grafana administrator role to more members. If you don't have the necessary role, you won't be able to manage Grafana access rights yourself.

    :::image type="content" source="media/authentication/create-form-permission-disabled.png" alt-text="Screenshot of the Azure portal. Create workspace form. Permission tab with managed identity disabled.":::

> [!NOTE]
> Turning off system-assigned managed identity disables the Azure Monitor data source plugin for your Azure Managed Grafana instance. In this scenario, use a service principal instead of Azure Monitor to access data sources.

#### Create a workspace: tags and review + create

1. Select **Next : Tags** and optionally add tags to categorize resources.

1. Select **Next : Review + create >**. After validation runs, select **Create**. Your Azure Managed Grafana resource is deploying.

    :::image type="content" source="media/authentication/create-form-validation.png" alt-text="Screenshot of the Azure portal. Create workspace form. Validation.":::

### [Azure CLI](#tab/azure-cli)

Run the [az group create](/cli/azure/group#az-group-create) command below to create a resource group to organize the Azure resources needed. Skip this step if you already have a resource group you want to use.

| Parameter  | Description                                                                                                                                                                                           | Example      |
|------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|
| --name     | Choose a unique name for your new resource group.                                                                                                                                                     | *grafana-rg* |
| --location | Choose an Azure region where Managed Grafana is available. For more info, go to [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=managed-grafana). | *eastus*     |

```azurecli
az group create --location <location> --name <resource-group-name>
```

> [!NOTE]
> The CLI experience for Azure Managed Grafana is part of the amg extension for the Azure CLI (version 2.30.0 or higher). The extension will automatically install the first time you run an `az grafana` command.

#### With managed identity enabled

System-assigned managed identity is the default authentication method for Azure Managed Grafana. Run the [az grafana create](/cli/azure/grafana#az-grafana-create) command below to create an Azure Managed Grafana instance with system-assigned managed identity.

1. If you have the owner or administrator role on this subscription:

    | Parameter              | Description                                                                                                                                                                                                        | Example                       |
    |------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------|
    | --name                 | Choose a unique name for your new Managed Grafana instance.                                                                                                                                                        | *grafana-test*                |
    | --resource-group       | Choose a resource group for your Managed Grafana instance.                                                                                                                                                         | *my-resource-group*           |

    ```azurecli
    az grafana create --name <managed-grafana-resource-name> --resource-group <resource-group-name>
    ```

1. If you don't have the owner or administrator role on this subscription:

    | Parameter              | Description                                                                                                                                                                                                        | Example                       |
    |------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------|
    | --name                 | Choose a unique name for your new Managed Grafana instance.                                                                                                                                                        | *grafana-test*                |
    | --resource-group       | Choose a resource group for your Managed Grafana instance.                                                                                                                                                         | *my-resource-group*           |
    | --skip-role-assignment | Enter `true` to skip role assignment if you don't have an owner or administrator role on this subscription. Skipping role assignment lets you create an instance without the roles required to assign permissions. | *--skip-role-assignment true* |

    ```azurecli
    az grafana create --name <managed-grafana-resource-name> --resource-group <resource-group-name> --skip-role-assignment true
     ```

> [!NOTE]
> You must have the owner or administrator role on your subscription to use the system-assigned managed identity authentication method. If you don't have the necessary role, go to the next section to see how to create an Azure Managed Grafana instance with system-assigned managed identity disabled.

#### With managed identity disabled

Azure Managed Grafana can also access data sources with managed identity disabled. You can use a service principal for authentication, using a client ID and secret instead of a managed identity. To use this method, run the command below:

| Parameter                       | Description                                                                                                                                                                                                                     | Example                                |
|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------|
| --name                          | Choose a unique name for your new Managed Grafana instance.                                                                                                                                                                     | *grafana-test*                         |
| --resource-group                | Choose a resource group for your Managed Grafana instance.                                                                                                                                                                      | *my-resource-group*                    |
| --skip-system-assigned-identity | Enter `true` to disable system assigned identity. System-assigned managed identity is the default authentication method for Azure Managed Grafana. Use this option if you don't want to use a system-assigned managed identity. | *--skip-system-assigned-identity true* |
| --skip-role-assignment          | Enter `true` to skip role assignment if you don't have an owner or administrator role on this subscription. Skipping role assignment lets you create an instance without the roles required to assign permissions.              | *--skip-role-assignment true*          |

```azurecli
az grafana create --name <managed-grafana-resource-name> --resource-group <resource-group-name> --skip-role-assignment true --skip-system-assigned-identity true
```

> [!NOTE]
> Turning off system-assigned managed identity disables the Azure Monitor data source plugin for your Azure Managed Grafana instance. In this scenario, use a service principal instead of Azure Monitor to access data sources.

Once the deployment is complete, you'll see a note in the output of the command line stating that the instance was successfully created, alongside with additional information about the deployment.

---

## Update authentication and permissions

After your workspace has been created, you can still turn on or turn off system-assigned managed identity and update Azure role assignments for Azure Managed Grafana.

1. In the Azure portal, from the left menu, under **Settings**, select **Identity**.
1. Set the status for System assigned to **Off**, to deactivate the system assigned managed identity, or set it to **On** to activate this authentication method.
1. Under permissions, select **Azure role assignments** to set Azure roles.
1. When done, select **Save**

    :::image type="content" source="media/authentication/update-identity.jpg" alt-text="Screenshot of the Azure portal. Updating the system-assigned managed identity. Basics.":::

> [!NOTE]
> Disabling a system-assigned managed identity is irreversible. If you re-enable the identity in the future, Azure will create a new identity.

## Next steps

> [!div class="nextstepaction"]
> [Sync Grafana teams with Azure Active Directory groups](./how-to-sync-teams-with-azure-ad-groups.md)
