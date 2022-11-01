---
title: Upgrade a packet core instance - ARM template
titleSuffix: Azure Private 5G Core Preview
description: In this how-to guide, you'll learn how to upgrade a packet core instance using an Azure Resource Manager template (ARM template). 
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: how-to
ms.date: 05/16/2022
ms.custom: template-how-to
---

# Upgrade the packet core instance in a site - ARM template

Each Azure Private 5G Core Preview site contains a packet core instance, which is a cloud-native implementation of the 3GPP standards-defined 5G Next Generation Core (5G NGC or 5GC). You'll need to periodically upgrade your packet core instances to get access to the latest Azure Private 5G Core features and maintain support for your private mobile network. In this how-to guide, you'll learn how to upgrade a packet core instance using an Azure Resource Manager template (ARM template).

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your deployment contains multiple sites, we recommend upgrading a single packet core instance first to ensure the upgrade is successful before upgrading the remaining instances.

If your environment meets the prerequisites, you're familiar with using ARM templates and you've [planned for the upgrade](#plan-for-your-upgrade), select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure.](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.mobilenetwork%2Fmobilenetwork-update-packet-core-control-plane%2Fazuredeploy.json/createUIDefinitionUri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.mobilenetwork%2Fmobilenetwork-update-packet-core-control-plane%2FcreateUiDefinition.json)

## Prerequisites

- You must have a running packet core. Use Log Analytics or the packet core dashboards to confirm your packet core instance is operating normally.
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.
- Identify the name of the site that hosts the packet core instance you want to upgrade.
- Make a note of your current packet core version. You'll need this information in case you encounter any issues and need to revert the upgrade.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/mobilenetwork-update-packet-core-control-plane). To view the template, see [azuredeploy.json](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.mobilenetwork/mobilenetwork-update-packet-core-control-plane/azuredeploy.json).

The template modifies the version of an existing [**Microsoft.MobileNetwork/packetCoreControlPlanes**](/azure/templates/microsoft.mobilenetwork/packetcorecontrolplanes) resource. This causes an uninstall and reinstall of the packet core with the new resource version - no other resources are modified during this process, unless you change the configuration of the new version. The resource provides configuration for the control plane network functions of the packet core instance, including IP configuration for the N2 interface.

## Plan for your upgrade

We recommend upgrading your packet core instance during a maintenance window or a period of low traffic to minimize the impact of the upgrade on your service.

When planning for your upgrade, make sure you're allowing sufficient time for an upgrade and a possible rollback in the event of any issues. In addition, consider the following points for pre- and post-upgrade steps you may need to plan for when scheduling your maintenance window:

- Refer to the [release notes](azure-private-5g-core-release-notes-2210.md) for the current version of packet core and whether it's supported by the version your Azure Stack Edge (ASE) is currently running.
- If your ASE version is incompatible with the latest packet core, you'll need to upgrade ASE first. Refer to [Update your Azure Stack Edge Pro GPU](/azure/databox-online/azure-stack-edge-gpu-install-update) for the latest available version of ASE.
  - If you're currently running a packet core version that the ASE version you're upgrading to supports, you can upgrade ASE and packet core independently.
  - If you're currently running a packet core version that the ASE version you're upgrading to doesn't support, it's possible that packet core won't operate normally with the new ASE version. In this case, we recommend planning a maintenance window that allows you time to fully upgrade both ASE and packet core. Refer to [Update your Azure Stack Edge Pro GPU](/azure/databox-online/azure-stack-edge-gpu-install-update) for how long the ASE upgrade will take.
- Prepare a testing plan with any steps you'll need to follow to validate your deployment post-upgrade. This plan should include testing some registered devices and sessions, and you'll execute it as part of [Verify upgrade](#verify-upgrade).
- Review [Restore backed up deployment information](#restore-backed-up-deployment-information) and [Verify upgrade](#verify-upgrade) for the post-upgrade steps you'll need to follow to ensure your deployment is fully operational. Make sure your upgrade plan allows sufficient time for these steps.

## Upgrade the packet core instance

### Back up deployment information

The following list contains data that will get lost over a packet core upgrade. Back up any information you'd like to preserve; after the upgrade, you can use this information to reconfigure your packet core instance.

1. If you want to keep using the same credentials when signing in to [distributed tracing](distributed-tracing.md), save a copy of the current password to a secure location.
2. If you want to keep using the same credentials when signing in to the [packet core dashboards](packet-core-dashboards.md), save a copy of the current password to a secure location.
3. Any customizations made to the packet core dashboards won't be carried over the upgrade. Refer to [Exporting a dashboard](https://grafana.com/docs/grafana/v6.1/reference/export_import/#exporting-a-dashboard) in the Grafana documentation to save a backed-up copy of your dashboards.
4. Most UEs will automatically re-register and recreate any sessions after the upgrade completes. If you have any special devices that require manual operations to recover from a packet core outage, gather a list of these UEs and their recovery steps.

### Upgrade ASE

If you determined in [Plan for your upgrade](#plan-for-your-upgrade) that you need to upgrade your ASE, follow the steps in [Update your Azure Stack Edge Pro GPU](/azure/databox-online/azure-stack-edge-gpu-install-update).

### Upgrade packet core

1. Select the following link to sign in to Azure and open the template.

    [![Deploy to Azure.](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.mobilenetwork%2Fmobilenetwork-update-packet-core-control-plane%2Fazuredeploy.json/createUIDefinitionUri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.mobilenetwork%2Fmobilenetwork-update-packet-core-control-plane%2FcreateUiDefinition.json)

1. Select or enter the following values, using the information you retrieved in [Prerequisites](#prerequisites).

    - **Subscription:** select the Azure subscription you used to create your private mobile network.
    - **Resource group:** select the resource group containing the mobile network resource representing your private mobile network.
    - **Region:** select **East US**.
    - **Existing packet core:** select the name of the packet core instance you want to upgrade.
    - **New version:** enter the version to which you want to upgrade the packet core instance.

    :::image type="content" source="media/upgrade-packet-core-arm-template/upgrade-arm-template-configuration-fields.png" alt-text="Screenshot of the Azure portal showing the configuration fields for the upgrade ARM template.":::

    > [!NOTE]
    > If a warning appears about an incompatibility between the selected packet core version and the current Azure Stack Edge version, you'll need to upgrade ASE first. Select **Upgrade ASE** from the warning prompt and follow the instructions in [Update your Azure Stack Edge Pro GPU](/azure/databox-online/azure-stack-edge-gpu-install-update). Once you've finished updating your ASE, go back to the beginning of this step to upgrade packet core.

1. Select **Review + create**.
1. Azure will now validate the configuration values you've entered. You should see a message indicating that your values have passed validation.

     If the validation fails, you'll see an error message and the **Configuration** tab(s) containing the invalid configuration will be flagged. Select the flagged tab(s) and use the error messages to correct invalid configuration before returning to the **Review + create** tab.

1. Once your configuration has been validated, select **Create** to upgrade the packet core instance. The Azure portal will display a confirmation screen when the packet core instance has been upgraded.

### Review deployed resources

1. Select **Go to resource group**.

    :::image type="content" source="media/template-deployment-confirmation.png" alt-text="Screenshot of the Azure portal showing a deployment confirmation for the ARM template.":::

1. Select the **Packet Core Control Plane** resource representing the control plane function of the packet core instance in the site.
1. Check the **Version** field under the **Configuration** heading to confirm that it displays the new software version.

### Restore backed up deployment information

Reconfigure your deployment using the information you gathered in [Back up deployment information](#back-up-deployment-information).

1. Follow [Access the distributed tracing web GUI](distributed-tracing.md#access-the-distributed-tracing-web-gui) to restore access to distributed tracing.
2. Follow [Access the packet core dashboards](packet-core-dashboards.md#access-the-packet-core-dashboards) to restore access to your packet core dashboards.
3. If you backed up any packet core dashboards, follow [Importing a dashboard](https://grafana.com/docs/grafana/v6.1/reference/export_import/#importing-a-dashboard) in the Grafana documentation to restore them.
4. If you have UEs that require manual operations to recover from a packet core outage, follow their recovery steps.

### Verify upgrade

Once the upgrade completes, check if your deployment is operating normally.

1. Use [Log Analytics](monitor-private-5g-core-with-log-analytics.md) or the [packet core dashboards](packet-core-dashboards.md) to confirm your packet core instance is operating normally.
2. Execute the testing plan you prepared in [Plan for your upgrade](#plan-for-your-upgrade).

## Rollback

If you encountered issues after the upgrade, you can roll back the packet core instance to the previous version.

Note that any configuration you set while your packet core instance was running a newer version will be lost if you roll back to a version that doesn't support this configuration. Check the packet core release notes for information on when new features were introduced.

1. Ensure you have a backup of your deployment information. If you need to back up again, follow [Back up deployment information](#back-up-deployment-information).
2. Select the following link to sign in to Azure and open the template.

    [![Deploy to Azure.](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.mobilenetwork%2Fmobilenetwork-update-packet-core-control-plane%2Fazuredeploy.json/createUIDefinitionUri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.mobilenetwork%2Fmobilenetwork-update-packet-core-control-plane%2FcreateUiDefinition.json)

3. Select or enter the following values, using the information you retrieved in [Prerequisites](#prerequisites).

    - **Subscription:** select the Azure subscription you used to create your private mobile network.
    - **Resource group:** select the resource group containing the mobile network resource representing your private mobile network.
    - **Region:** select **East US**.
    - **Existing packet core:** select the name of the packet core instance you want to upgrade.
    - **New version:** enter the packet core version you want to downgrade to.

    :::image type="content" source="media/upgrade-packet-core-arm-template/upgrade-arm-template-configuration-fields.png" alt-text="Screenshot of the Azure portal showing the configuration fields for the upgrade ARM template.":::

4. Select **Review + create**.
5. Azure will now validate the configuration values you've entered. You should see a message indicating that your values have passed validation.

     If the validation fails, you'll see an error message and the **Configuration** tab(s) containing the invalid configuration will be flagged. Select the flagged tab(s) and use the error messages to correct invalid configuration before returning to the **Review + create** tab.

6. Once your configuration has been validated, select **Create** to upgrade the packet core instance. The Azure portal will display a confirmation screen when the packet core instance has been downgraded.
7. Follow the steps in [Verify upgrade](#verify-upgrade) to check if the rollback was successful.

## Next steps

You've finished upgrading your packet core instance. You can now use Log Analytics or the packet core dashboards to monitor your deployment.

- [Monitor Azure Private 5G Core with Log Analytics](monitor-private-5g-core-with-log-analytics.md)
- [Packet core dashboards](packet-core-dashboards.md)
