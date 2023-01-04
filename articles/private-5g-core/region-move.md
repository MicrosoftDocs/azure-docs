---
title: Move your deployment to a different region
titleSuffix: Azure Private 5G Core Preview
description: In this how-to guide, you'll learn how to move your Azure Private 5G Core deployment to a different region.
author: b-branco
ms.author: biancabranco
ms.service: private-5g-core
ms.topic: how-to 
ms.date: 01/04/2023
ms.custom: template-how-to
---

# Move your Azure Private 5G Core deployment to a different region

In this how-to guide, you'll learn how to move your Azure Private 5G Core deployment to a different region.

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.
- Verify pricing and charges associated with the target region to which you're moving.

## Prepare to move your deployment

### Back up SIMs

For security reasons, Azure Private 5G Core will never return the SIM credentials provided to the service as part of SIM creation. Therefore, it's not possible to export the SIM configuration in the same way as other Azure resources, and your SIMs will be lost over an Azure region move.

You can view your existing SIMs by following [View existing SIMs](manage-existing-sims.md#view-existing-sims). If you don't already have one, create a backup copy of all the information required for recreating your SIMs later. Refer to [Collect the required information for your SIMs](provision-sims-azure-portal.md#collect-the-required-information-for-your-sims) for the information you'll need to recreate each SIM.

### Delete SIMs

### Disable custom location

Follow [Modify the packet core instance in a site](modify-packet-core.md) to modify your packet core instance with the following changes:

1. In [Modify the packet core configuration](modify-packet-core.md#modify-the-packet-core-configuration), make a note of the custom location value in the **Custom ARC location** field.
1. Set the **Custom ARC location** field to **None**.
1. In [Submit and verify changes](modify-packet-core.md#submit-and-verify-changes), the packet core will be redeployed at an uninstalled state with the new configuration.

### Generate template

1. Navigate to your resource group.
1. In the resource menu, select **Export template**.
1. Select **Download**.

## Move deployment to another region

### Deploy template

1. Open the *template.json* file you downloaded in [Generate template](#generate-template).
1. For every resource described in the template, 
    1. Update the **location** parameter with the new region you're moving your deployment to. <!-- TODO: Use region code names as reference --> For example, to move from the East US to the West Europe region:
    
        ```json
        {
            ...
            "resources": [
              {
                ...
                "location": "eastus",
                ...
            ]
        }
        ```
        ```json
        {
            ...
            "resources": [
              {
                ...
                "location": "westeurope",
                ...
            ]
        }
        ```
    
    1. Update the resource **name** parameter to a unique name. This is so that you can deploy to a new region without having to delete your resources in the previous region.

1. [Create a resource group](/azure/azure-resource-manager/management/manage-resource-groups-portal) in the new region.
1. Deploy the template. 
    
    - To use the Azure portal, follow the instructions to deploy resources from a custom template in [Deploy resources with ARM templates and Azure portal](/azure/azure-resource-manager/templates/deploy-portal)
    - If you want to use PowerShell, navigate to the folder containing the *template.json* file and deploy using the command:

        ```azurepowershell
        az deployment group create --resource-group <new resource group name> --template-file template.json
        ```

1. In the Azure portal, navigate to the new resource group to verify that your resources have been successfully recreated.

### Restore SIMs

Retrieved your backed up SIM information and recreate your SIMs by following one of:

- [Provision new SIMs for Azure Private 5G Core Preview - Azure portal](provision-sims-azure-portal.md)
- [Provision new SIMs for Azure Private 5G Core Preview - ARM template](provision-sims-arm-template.md)

### Configure custom location

For each of your sites, follow [Modify the packet core instance in a site](modify-packet-core.md) to reconfigure your packet core custom location. In [Modify the packet core configuration](modify-packet-core.md#modify-the-packet-core-configuration), set the **Custom ARC location** field to the custom location value you noted down in [Disable custom location](#disable-custom-location).

## Next steps

- Use [Azure Monitor](monitor-private-5g-core-with-log-analytics.md) or the [packet core dashboards](packet-core-dashboards.md) to confirm your deployment is operating normally after the region move.
- If you no longer require a deployment in the old region, [delete the original resource group](/azure/azure-resource-manager/management/manage-resource-groups-portal).
<!-- TODO: Learn more about reliability in Azure Private 5G Core. -->