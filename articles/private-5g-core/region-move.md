---
title: Move your resources to a different region
titleSuffix: Azure Private 5G Core Preview
description: In this how-to guide, you'll learn how to move your Azure Private 5G Core resources to a different region.
author: b-branco
ms.author: biancabranco
ms.service: private-5g-core
ms.topic: how-to 
ms.date: 01/04/2023
ms.custom: template-how-to
---

# Move your Azure Private 5G Core resources to a different region

In this how-to guide, you'll learn how to move your Azure Private 5G Core resources to a different region. This involves exporting your resources from the source region's resource group and recreating them in a new resource group deployed in the target region.

If you also want to move your Arc-enabled Kubernetes cluster, contact your support representative. 

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.
- Refer to [Products available by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/) to ensure Azure Private 5G Core supports the region to which you want to move your resources.
- Verify pricing and charges associated with the target region to which you want to move your resources.
- Choose a name for your new resource group in the target region. This must be different to the source region's resource group name.
- If you want to move your Arc-enabled Kubernetes cluster, ensure you have access to [Azure CLI](/cli/azure/get-started-with-azure-cli).

## Plan a maintenance window

Depending on the resources you want to move and whether you want the deployment in the source region to remain operational during and after the region move, you may need to plan for a service outage.

If you're moving your Arc-enabled Kubernetes cluster, we recommend performing the move during a maintenance window to minimize the impact on your service. You should allow up to two hours for the process to complete. <!-- TODO: check outage time advice -->

If you're not moving your Arc-enabled Kubernetes cluster and you want the deployment in the source region to remain operational during the region move, you'll have the option to move your resources without causing an outage in the original deployment. This will involve making additional changes to your deployment's template to delete all SIMs and custom location entries.

## Back up deployment information

The following list contains the data that will be lost over the region move. Back up any information you'd like to preserve; after the move, you can use this information to reconfigure your deployment.

1. For security reasons, your SIM configuration won't be carried over a region move. Refer to [Collect the required information for your SIMs](provision-sims-azure-portal.md#collect-the-required-information-for-your-sims) to take a backup of all the information you'll need to recreate your SIMs.
1. If you want to keep using the same credentials when signing in to [distributed tracing](distributed-tracing.md), save a copy of the current password to a secure location.
1. If you want to keep using the same credentials when signing in to the [packet core dashboards](packet-core-dashboards.md), save a copy of the current password to a secure location.
1. Any customizations made to the packet core dashboards won't be carried over the region move. Refer to [Exporting a dashboard](https://grafana.com/docs/grafana/v6.1/reference/export_import/#exporting-a-dashboard) in the Grafana documentation to save a backed-up copy of your dashboards.
1. Most UEs will automatically re-register and recreate any sessions after the region move completes. If you have any special devices that require manual operations to recover from a packet core outage, gather a list of these UEs and their recovery steps.

## Prepare to move your resources

### Optionally, delete the custom location

Only follow this step if you want to move your Arc-enabled Kubernetes cluster. Deleting the custom location will initiate an outage in the source region.

1. Log in to Azure CLI.
1. Delete the custom location you want to move:

    ```azurecli
    az customlocation delete -n <custom location name> -g <resource group name> 
    ```

### Remove SIMs and custom location

If you want to avoid an outage in the source region's deployment during the region move, skip this step. You'll need to make additional modifications to the export template in [Prepare template](#prepare-template).

Before moving your resources, you'll need to delete all SIMs in your deployment. If you didn't delete the custom location in the previous step, you'll also need to uninstall all packet core instances you want to move by changing their **Custom ARC location** field to **None**. 

1. Follow [Delete SIMs](manage-existing-sims.md#delete-sims) to delete all the SIMs in your deployment.
1. For each site that you want to move, follow [Modify the packet core instance in a site](modify-packet-core.md) to modify your packet core instance with the changes below. You can ignore the sections about attaching and modifying data networks.

    1. In *Modify the packet core configuration*, make a note of the custom location value in the **Custom ARC location** field.
    1. Set the **Custom ARC location** field to **None**.
    1. In *Submit and verify changes*, the packet core will be uninstalled.

### Generate template

Your mobile network resources can now be exported via an Azure Resource Manager (ARM) template.

1. Navigate to the resource group containing your private mobile network resources.
1. In the resource menu, select **Export template**.

    :::image type="content" source="media/region-move/region-move-export-template.png" alt-text="Screenshot of the Azure portal showing the resource menu Export template option.":::

1. Once Azure finishes generating the template, select **Download**.

    :::image type="content" source="media/region-move/region-move-download-template.png" alt-text="Screenshot of the Azure portal showing the option to download a template.":::

## Move resources to a new region

### Optionally, move the Arc-enabled Kubernetes cluster

You can skip this step if you don't want to move your Arc-enabled Kubernetes cluster

1. Move the Arc-enabled Kubernetes cluster by following the steps in [Move Arc-enabled Kubernetes clusters across Azure regions](/azure/azure-arc/kubernetes/move-regions).
1. Follow the steps in TODO <!-- TODO: link to MOP once ASE setup docs are ready --> to recreate the Arc-enabled Kubernetes cluster. 

### Prepare template

You'll need to customize your template to ensure all your resources are correctly deployed to the new region.

1. Open the *template.json* file you downloaded in [Generate template](#generate-template).
1. Find every instance of the original region's code name and replace it with the target region you're moving your deployment to. This involves updating the **location** parameter for every resource. See TODO:link for instructions on how to obtain the target region's code name.
1. Find every instance of the original region's resource group name and replace it with the target region's resource group name you defined in [Prerequisites](#prerequisites).
1. If you skipped [Remove SIMs and custom location](#remove-sims-and-custom-location) because you need your deployment to stay online in the original region, make the additional changes to the template:
    1. Remove all the SIM resources.
    1. Remove all custom location entries, including any dependencies from other resources.
1. Remove any other resources you don't want to move to the target region.

### Deploy template

1. [Create a resource group](/azure/azure-resource-manager/management/manage-resource-groups-portal) in the target region. Use the resource group name you defined in [Prerequisites](#prerequisites).
1. Deploy the *template.json* file you downloaded in [Generate template](#generate-template).
    
    - If you want to use the Azure portal, follow the instructions to deploy resources from a custom template in [Deploy resources with ARM templates and Azure portal](/azure/azure-resource-manager/templates/deploy-portal).
    - If you want to use PowerShell, navigate to the folder containing the *template.json* file and deploy using the command:

        ```azurepowershell
        az deployment group create --resource-group <new resource group name> --template-file template.json
        ```

1. In the Azure portal, navigate to the new resource group and verify that your resources have been successfully recreated.

## Configure custom location

You can now install your packet core instances in the new region. If you moved your Arc-enabled Kubernetes cluster, you'll also need to reinstall the packet core instances that use it in the original region.

For each site in your deployment, follow [Modify the packet core instance in a site](modify-packet-core.md) to reconfigure your packet core custom location. In *Modify the packet core configuration*, set the **Custom ARC location** field to the custom location value you noted down in [Remove SIMs and custom location](#remove-sims-and-custom-location). You can ignore the sections about attaching and modifying data networks.

## Restore backed up deployment information

Configure your deployment in the new region using the information you gathered in [Back up deployment information](#back-up-deployment-information).

1. Retrieve your backed up SIM information and recreate your SIMs by following one of:

    - [Provision new SIMs for Azure Private 5G Core Preview - Azure portal](provision-sims-azure-portal.md)
    - [Provision new SIMs for Azure Private 5G Core Preview - ARM template](provision-sims-arm-template.md)

1. Follow [Access the distributed tracing web GUI](distributed-tracing.md#access-the-distributed-tracing-web-gui) to restore access to distributed tracing.
1. Follow [Access the packet core dashboards](packet-core-dashboards.md#access-the-packet-core-dashboards) to restore access to your packet core dashboards.
1. If you backed up any packet core dashboards, follow [Importing a dashboard](https://grafana.com/docs/grafana/v6.1/reference/export_import/#importing-a-dashboard) in the Grafana documentation to restore them.
1. If you have UEs that require manual operations to recover from a packet core outage, follow their recovery steps.

## Next steps

- Use [Azure Monitor](monitor-private-5g-core-with-log-analytics.md) or the [packet core dashboards](packet-core-dashboards.md) to confirm your deployment is operating normally after the region move.
- If you no longer require a deployment in the source region, [delete the original resource group](/azure/azure-resource-manager/management/manage-resource-groups-portal).
<!-- TODO: Learn more about reliability in Azure Private 5G Core. -->