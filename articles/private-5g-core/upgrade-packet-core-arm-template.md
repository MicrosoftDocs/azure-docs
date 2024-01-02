---
title: Upgrade a packet core instance - ARM template
titleSuffix: Azure Private 5G Core
description: In this how-to guide, you'll learn how to upgrade a packet core instance using an Azure Resource Manager template (ARM template). 
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to
ms.date: 05/16/2022
ms.custom: template-how-to, devx-track-arm-template
---

# Upgrade the packet core instance in a site - ARM template

Each Azure Private 5G Core site contains a packet core instance, which is a cloud-native implementation of the 3GPP standards-defined 5G Next Generation Core (5G NGC or 5GC). You'll need to periodically upgrade your packet core instances to get access to the latest Azure Private 5G Core features and maintain support for your private mobile network. In this how-to guide, you'll learn how to upgrade a packet core instance using an Azure Resource Manager template (ARM template).

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your deployment contains multiple sites, we recommend upgrading the packet core in a single site first and ensuring the upgrade is successful before upgrading the packet cores in the remaining sites.

If your environment meets the prerequisites, you're familiar with using ARM templates and you've [planned for the upgrade](#plan-for-your-upgrade), select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure.](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.mobilenetwork%2Fmobilenetwork-update-packet-core-control-plane%2Fazuredeploy.json/createUIDefinitionUri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.mobilenetwork%2Fmobilenetwork-update-packet-core-control-plane%2FcreateUiDefinition.json)

## Prerequisites

- You must have a running packet core. Use Azure monitor platform metrics or the packet core dashboards to confirm your packet core instance is operating normally.
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.
- Identify the name of the site that hosts the packet core instance you want to upgrade.
- If you use Microsoft Entra ID to authenticate access to your local monitoring tools, ensure your local machine has core kubectl access to the Azure Arc-enabled Kubernetes cluster. This requires a core kubeconfig file, which you can obtain by following [Core namespace access](set-up-kubectl-access.md#core-namespace-access).

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/mobilenetwork-update-packet-core-control-plane). To view the template, see [azuredeploy.json](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.mobilenetwork/mobilenetwork-update-packet-core-control-plane/azuredeploy.json).

The template modifies the version of an existing [**Microsoft.MobileNetwork/packetCoreControlPlanes**](/azure/templates/microsoft.mobilenetwork/packetcorecontrolplanes) resource. This causes an uninstall and reinstall of the packet core with the new resource version. No other resources are modified during this process unless you also change the configuration of the new version. The resource provides configuration for the control plane network functions of the packet core instance, including IP configuration for the N2 interface.

## Plan for your upgrade

We recommend upgrading your packet core instance during a maintenance window to minimize the impact of the upgrade on your service.

When planning for your upgrade, make sure you're allowing sufficient time for an upgrade and a possible rollback in the event of any issues. An upgrade and rollback of packet core can each take up to two hours to complete.

In addition, consider the following points for pre- and post-upgrade steps you may need to plan for when scheduling your maintenance window:

- Refer to the packet core release notes for the version of packet core you're upgrading to and whether it's supported by the version your Azure Stack Edge (ASE) is currently running.
- If your ASE version is incompatible with the packet core version you're upgrading to, you'll need to upgrade ASE first. Refer to [Update your Azure Stack Edge Pro GPU](../databox-online/azure-stack-edge-gpu-install-update.md) for the latest available version of ASE.
  - If you're currently running a packet core version that the ASE version you're upgrading to supports, you can upgrade ASE and packet core independently.
  - If you're currently running a packet core version that the ASE version you're upgrading to doesn't support, it's possible that packet core won't operate normally with the new ASE version. In this case, we recommend planning a maintenance window that allows you time to upgrade both ASE and packet core. Refer to [Update your Azure Stack Edge Pro GPU](../databox-online/azure-stack-edge-gpu-install-update.md) for how long the ASE upgrade will take.
- Prepare a testing plan with any steps you'll need to follow to validate your deployment post-upgrade. This plan should include testing some registered devices and sessions, and you'll execute it as part of [Verify upgrade](#verify-upgrade).
- Review [Restore backed up deployment information](#restore-backed-up-deployment-information) and [Verify upgrade](#verify-upgrade) for the post-upgrade steps you'll need to follow to ensure your deployment is fully operational. Make sure your upgrade plan allows sufficient time for these steps.

## Upgrade the packet core instance

### Back up deployment information

The following list contains the data that will be lost over a packet core upgrade. Back up any information you'd like to preserve; after the upgrade, you can use this information to reconfigure your packet core instance.

1. Depending on your authentication method when signing in to the [distributed tracing](distributed-tracing.md) and [packet core dashboards](packet-core-dashboards.md):
    - If you use Microsoft Entra ID, save a copy of the Kubernetes Secret Object YAML file you created in [Create Kubernetes Secret Objects](enable-azure-active-directory.md#create-kubernetes-secret-objects).
    - If you use local usernames and passwords and want to keep using the same credentials, save a copy of the current passwords to a secure location. 
1. All traces are deleted during upgrade and cannot be retrieved. If you want to retain any traces, [export and save](distributed-tracing-share-traces.md#export-trace-from-the-distributed-tracing-web-gui) them securely before continuing.
1. Any customizations made to the packet core dashboards won't be carried over the upgrade. Refer to [Exporting a dashboard](https://grafana.com/docs/grafana/v6.1/reference/export_import/#exporting-a-dashboard) in the Grafana documentation to save a backed-up copy of your dashboards.
1. Most UEs will automatically re-register and recreate any sessions after the upgrade completes. If you have any special devices that require manual operations to recover from a packet core outage, gather a list of these UEs and their recovery steps.

### Upgrade ASE

If you determined in [Plan for your upgrade](#plan-for-your-upgrade) that you need to upgrade your ASE, follow the steps in [Update your Azure Stack Edge Pro GPU](../databox-online/azure-stack-edge-gpu-install-update.md).

### Upgrade packet core

1. Select the following link to sign in to Azure and open the template.

    [![Deploy to Azure.](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.mobilenetwork%2Fmobilenetwork-update-packet-core-control-plane%2Fazuredeploy.json/createUIDefinitionUri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.mobilenetwork%2Fmobilenetwork-update-packet-core-control-plane%2FcreateUiDefinition.json)

1. Select or enter the following values, using the information you retrieved in [Prerequisites](#prerequisites).

    - **Subscription:** select the Azure subscription you used to create your private mobile network.
    - **Resource group:** select the resource group containing the mobile network resource representing your private mobile network.
    - **Region:** select the region in which you deployed the private mobile network.
    - **Existing packet core:** select the name of the packet core instance you want to upgrade.
    - **New version:** enter the version to which you want to upgrade the packet core instance.

    :::image type="content" source="media/upgrade-packet-core-arm-template/upgrade-arm-template-configuration-fields.png" alt-text="Screenshot of the Azure portal showing the configuration fields for the upgrade ARM template.":::

    > [!NOTE]
    > If a warning appears about an incompatibility between the selected packet core version and the current Azure Stack Edge version, you'll need to upgrade ASE first. Select **Upgrade ASE** from the warning prompt and follow the instructions in [Update your Azure Stack Edge Pro GPU](../databox-online/azure-stack-edge-gpu-install-update.md). Once you've finished updating your ASE, go back to the beginning of this step to upgrade packet core.

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

1. Depending on your authentication method when signing in to the [distributed tracing](distributed-tracing.md) and [packet core dashboards](packet-core-dashboards.md):
    
    - If you use Microsoft Entra ID, [reapply the Secret Object for distributed tracing and the packet core dashboards](enable-azure-active-directory.md#apply-kubernetes-secret-objects).
    - If you use local usernames and passwords, follow [Access the distributed tracing web GUI](distributed-tracing.md#access-the-distributed-tracing-web-gui) and [Access the packet core dashboards](packet-core-dashboards.md#access-the-packet-core-dashboards) to restore access to your local monitoring tools.

1. If you backed up any packet core dashboards, follow [Importing a dashboard](https://grafana.com/docs/grafana/v6.1/reference/export_import/#importing-a-dashboard) in the Grafana documentation to restore them.
1. If you have UEs that require manual operations to recover from a packet core outage, follow their recovery steps.

### Verify upgrade

Once the upgrade completes, check if your deployment is operating normally.

1. Use [Azure Monitor platform metrics](monitor-private-5g-core-with-platform-metrics.md) or the [packet core dashboards](packet-core-dashboards.md) to confirm your packet core instance is operating normally.
1. Execute the testing plan you prepared in [Plan for your upgrade](#plan-for-your-upgrade).

## Rollback

If you encountered issues after the upgrade, you can roll back the packet core instance to the previous version.

In this step, you'll roll back your packet core using a REST API request. Follow [Rollback - Azure portal](upgrade-packet-core-azure-portal.md#rollback) if you want to roll back using the Azure portal instead.

If any of the configuration options you set while your packet core instance was running a newer version aren't supported in the version that you want to roll back to, you'll need to revert to the previous configuration before you're able to perform a rollback. Check the packet core release notes for information on when new features were introduced.

1. Ensure you have a backup of your deployment information. If you need to back up again, follow [Back up deployment information](#back-up-deployment-information).
1. Perform a [rollback POST request](/rest/api/mobilenetwork/packet-core-control-planes/rollback?tabs=HTTP).
    
    > [!TIP]
    > For more information on how to use REST APIs, see [Azure REST API reference](/rest/api/azure/).

1. Follow the steps in [Restore backed up deployment information](#restore-backed-up-deployment-information) to reconfigure your deployment.
1. Follow the steps in [Verify upgrade](#verify-upgrade) to check if the rollback was successful.

## Next steps

You've finished upgrading your packet core instance.

- If your deployment contains multiple sites, upgrade the packet core instance in another site.
- Use [Azure Monitor platform metrics](monitor-private-5g-core-with-platform-metrics.md) or the [packet core dashboards](packet-core-dashboards.md) to monitor your deployment.
