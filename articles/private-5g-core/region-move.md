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

If you also want to move your Azure Stack Edge (ASE) resources, see TODO:link. 

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.
- Verify pricing and charges associated with the target region to which you're moving.
- Choose a name for your new resource group in the target region. This must be different to the source region's resource group name.

## Prepare to move your resources

### Back up and delete SIMs

For security reasons, Azure Private 5G Core will never return the SIM credentials provided to the service as part of SIM creation. Therefore, it's not possible to export the SIM configuration in the same way as other Azure resources, and you'll need to delete your SIMs to avoid errors before performing an Azure region move.

1. Refer to [Collect the required information for your SIMs](provision-sims-azure-portal.md#collect-the-required-information-for-your-sims) to take a backup of all the information you'll need to recreate your SIMs. You can view all your SIMs and SIM groups by following [View existing SIMs](manage-existing-sims.md#view-existing-sims).
1. Follow [Delete SIMs](manage-existing-sims.md#delete-sims) to delete all the SIMs in your deployment.

### Disable custom location

Before moving your resources, you'll need to uninstall all your packet core instances.

1. For each site in your deployment, follow [Modify the packet core instance in a site](modify-packet-core.md) to modify your packet core instance with the following changes:

    1. In [Modify the packet core configuration](modify-packet-core.md#modify-the-packet-core-configuration), make a note of the custom location value in the **Custom ARC location** field.
    1. Set the **Custom ARC location** field to **None**.
    1. In [Submit and verify changes](modify-packet-core.md#submit-and-verify-changes), the packet core will be redeployed at an uninstalled state.

### Generate template

Your mobile network resources can now be exported via an Azure Resource Manager (ARM) template.

1. Navigate to the resource group containing your private mobile network resources.
1. In the resource menu, select **Export template**.

    :::image type="content" source="media/region-move/region-move-export-template.png" alt-text="Screenshot of the Azure portal showing the resource menu Export template option.":::

1. Once Azure finishes generating the template, select **Download**.

    :::image type="content" source="media/region-move/region-move-download-template.png" alt-text="Screenshot of the Azure portal showing the option to download a template.":::

## Move resources to a new region

### Prepare template

You'll need to customize your template to ensure all your resources are correctly deployed to the new region.

1. Open the *template.json* file you downloaded in [Generate template](#generate-template).
1. Find every instance of the original region's code name and replace it with the target region you're moving your deployment to. This involves updating the **location** parameter for every resource. See TODO:link for instructions on how to obtain the target region's code name.
1. Find every instance of the original region's resource group name and replace it with the target region's resource group name you defined in [Prerequisites](#prerequisites).

### Deploy template

1. [Create a resource group](/azure/azure-resource-manager/management/manage-resource-groups-portal) in the target region. Use the resource group name you defined in [Prerequisites](#prerequisites).
1. Deploy the *template.json* file you downloaded in [Generate template](#generate-template).
    
    - If you want to use the Azure portal, follow the instructions to deploy resources from a custom template in [Deploy resources with ARM templates and Azure portal](/azure/azure-resource-manager/templates/deploy-portal).
    - If you want to use PowerShell, navigate to the folder containing the *template.json* file and deploy using the command:

        ```azurepowershell
        az deployment group create --resource-group <new resource group name> --template-file template.json
        ```

1. In the Azure portal, navigate to the new resource group and verify that your resources have been successfully recreated.

### Restore SIMs

1. Retrieve your backed up SIM information and recreate your SIMs by following one of:

    - [Provision new SIMs for Azure Private 5G Core Preview - Azure portal](provision-sims-azure-portal.md)
    - [Provision new SIMs for Azure Private 5G Core Preview - ARM template](provision-sims-arm-template.md)

    If you only want to use your target region from now on, recreate your SIMs in the target region's resource group. If you want to use both your original and target regions, recreate your SIMs in both resource groups.

### Configure custom location

You can now reinstall your packet core instances in the new region.

1. For each site in your deployment, follow [Modify the packet core instance in a site](modify-packet-core.md) to reconfigure your packet core custom location. In [Modify the packet core configuration](modify-packet-core.md#modify-the-packet-core-configuration), set the **Custom ARC location** field to the custom location value you noted down in [Disable custom location](#disable-custom-location).

## Next steps

- Use [Azure Monitor](monitor-private-5g-core-with-log-analytics.md) or the [packet core dashboards](packet-core-dashboards.md) to confirm your deployment is operating normally after the region move.
- If you no longer require a deployment in the old region, [delete the original resource group](/azure/azure-resource-manager/management/manage-resource-groups-portal).
<!-- TODO: Learn more about reliability in Azure Private 5G Core. -->