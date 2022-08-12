---
title: How to enable zone redundancy in Azure Managed Grafana
description: Learn how to create a zone-redundant Managed Grafana instance. 
ms.service: managed-grafana
ms.topic: how-to
author: maud-lv
ms.author: malev
ms.date: 03/08/2022

--- 

# Enable zone redundancy in Azure Managed Grafana

Azure Managed Grafana offers a zone-redundant option to protect your instance against datacenter failure. Enabling zone redundancy for Managed Grafana lets you deploy your Managed Grafana resources across a minimum of three [Azure availability zones](/azure/availability-zones/az-overview#azure-regions-with-availability-zones) within the same Azure region.

In this how-to guide, learn how to enable zone redundancy for Azure Managed Grafana during the creation of your Managed Grafana instance.

> [!NOTE]
> Zone redundancy for Managed Grafana is a billable option. [See prices](https://azure.microsoft.com/pricing/details/managed-grafana/#pricing).

> [!NOTE]
> Zone redundancy is enabled during the creation of the Managed Grafana instance and can't be activated after the instance has been created
>  
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

This command will prompt your web browser to launch and load an Azure sign-in page. If the browser fails to open, use device code flow with `az login --use-device-code`. For more sign-in options, go to [sign in with the Azure CLI](/cli/azure/authenticate-azure-cli).

---

## Create a Managed Grafana workspace

Create an workspace and enable zone-redundancy with the Azure portal or the CLI.

### [Portal](#tab/azure-portal)

1. In the upper-left corner of the home page, select **Create a resource**. In the **Search resources, services, and docs (G+/)** box, enter *Azure Managed Grafana* and select **Azure Managed Grafana**.

    :::image type="content" source="media/quickstart-portal/find-azure-portal-grafana.png" alt-text="Screenshot of the Azure platform. Find Azure Managed Grafana in the marketplace." :::

1. Select **Create**.

1. In the **Basics** pane, enter the following settings.

    | Setting             | Description                                                                                                                                                                                              | Example             |
    |---------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------|
    | Subscription ID     | Select the Azure subscription you want to use.                                                                                                                                                           | *my-subscription*   |
    | Resource group name | Create a resource group for your Azure Managed Grafana resources.                                                                                                                                        | *my-resource-group* |
    | Location            | Use Location to specify the geographic location in which to host your resource. Choose the location closest to you.                                                                                      | *(US) East US*      |
    | Name                | Enter a unique resource name. It will be used as the domain name in your Managed Grafana instance URL.                                                                                                   | *my-grafana*        |
    | Zone Redundancy     | Set **Enable Zone Redundancy** to **Enable**. Zone redundancy automatically provisions and manages a standby replica of the Managed Grafana instance in a different availability zone within one region. | *Enabled*           |

    :::image type="content" source="media/quickstart-portal/create-form-basics.png" alt-text="Screenshot of the Azure portal. Create workspace form. Basics.":::

1. Select **Next : Advanced >** to access API key creation and statics IP address options. **Enable API key creation** and **Enable a static IP address** options are set to **Disable** by default. Optionally enable API key creation and enable a static IP address.

    :::image type="content" source="media/quickstart-portal/create-form-advanced.png" alt-text="Screenshot of the Azure portal. Create workspace form. Advanced.":::

1. Select **Next : Permission >** to control access rights for your Grafana instance and data sources:
   1. **System assigned managed identity** is set to **On**.

   1. The box **Add role assignment to this identity with 'Monitoring Reader' role on target subscription** is checked.

   1. The box **Include myself** under **Grafana administrator role** is checked. This grants you the Grafana administrator role, and lets you manage access rights. You can give this right to more members by selecting **Add**.

    If you uncheck this option, or if the option grays out for you, someone with the Owner role on the subscription can assign you the Grafana Admin role.

    :::image type="content" source="media/quickstart-portal/create-form-permission.png" alt-text="Screenshot of the Azure portal. Create workspace form. permission.":::

1. Optionally select **Next : Tags** and add tags to categorize resources.

1. Select **Next : Review + create >**. After validation runs, select **Create**. Your Azure Managed Grafana resource is deploying.

### [Azure CLI](#tab/azure-cli)

1. Run the code below to create a resource group to organize the Azure resources needed. Skip this step if you already have a resource group you want to use.

    | Parameter  | Description                                                                                                                                                                                           | Example      |
    |------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|
    | --name     | Choose a unique name for your new resource group.                                                                                                                                                     | *grafana-rg* |
    | --location | Choose an Azure region where Managed Grafana is available. For more info, go to [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=managed-grafana). | *eastus*     |

    ```azurecli
    az group create --location <location> --name <resource-group-name>
    ```

1. Run the code below to create an Azure Managed Grafana workspace.

    | Parameter         | Description                                                      | Example                     |
    |-------------------|------------------------------------------------------------------|-----------------------------|
    | --name            | Choose a unique name for your new Managed Grafana instance.      | *grafana-test*              |
    | --resource-group  | Choose a resource group for your Managed Grafana instance.       | *my-resource-group*         |
    | --zone-redundancy | Enter `enabled` to enable zone redundancy for this new instance. | *--zone-redundancy enabled* |

    ```azurecli
    az grafana create --name <managed-grafana-resource-name> --resource-group <resource-group-name> --zone-redundancy enabled
    ```

Once the deployment is complete, you'll see a note in the output of the command line stating that the instance was successfully created, alongside with additional information about the deployment.

> [!NOTE]
> The CLI experience for Azure Managed Grafana is part of the amg extension for the Azure CLI (version 2.30.0 or higher). The extension will automatically install the first time you run an `az grafana` command.

---

## Access your new Managed Grafana instance

### [Portal](#tab/azure-portal)

Now let's check if you can access your new Managed Grafana instance.

1. Take note of the **endpoint** URL ending by `eus.grafana.azure.com`, listed in the CLI output.  

1. Open a browser and enter the endpoint URL. Single sign-on via Azure Active Directory has been configured for you automatically. If prompted, enter your Azure account. You should now see your Azure Managed Grafana instance. From there, you can finish setting up your Grafana installation.

   :::image type="content" source="media/quickstart-portal/grafana-ui.png" alt-text="Screenshot of a Managed Grafana instance.":::

### [Azure CLI](#tab/azure-cli)

1. Once the deployment is complete, select **Go to resource** to open your resource.  

    :::image type="content" source="media/quickstart-portal/deployment-complete.png" alt-text="Screenshot of the Azure portal. Message: Your deployment is complete.":::

1. In the **Overview** tab's Essentials section, select the **Endpoint** URL. Single sign-on via Azure Active Directory has been configured for you automatically. If prompted, enter your Azure account.

    :::image type="content" source="media/quickstart-portal/overview-essentials.png" alt-text="Screenshot of the Azure portal. Endpoint URL display.":::

    :::image type="content" source="media/quickstart-portal/grafana-ui.png" alt-text="Screenshot of a Managed Grafana instance.":::

---

## Next steps

> [!div class="nextstepaction"]
> [How to configure data sources](./how-to-data-source-plugins-managed-identity.md)
