---
title: Modify a packet core instance
titleSuffix: Azure Private 5G Core
description: In this how-to guide, you'll learn how to modify a packet core instance using the Azure portal. 
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to
ms.date: 03/31/2023
ms.custom: template-how-to
---

# Modify a packet core instance

Each Azure Private 5G Core site contains a packet core instance, which is a cloud-native implementation of the 3GPP standards-defined 5G Next Generation Core (5G NGC or 5GC). In this how-to guide, you'll learn how to modify a packet core instance using the Azure portal; this includes modifying the packet core's custom location, connected Azure Stack Edge (ASE) device, and access network configuration. You'll also learn how to add, modify and remove the data networks attached to the packet core instance.

If you want to modify a packet core instance's local access configuration, follow [Modify the local access configuration in a site](modify-local-access-configuration.md).

## Prerequisites

- If you want to make changes to the packet core configuration or access network, refer to [Collect packet core configuration values](collect-required-information-for-a-site.md#collect-packet-core-configuration-values) and [Collect access network values](collect-required-information-for-a-site.md#collect-access-network-values) to collect the new values and make sure they're in the correct format.

    > [!NOTE]
    > You can't update a packet core instance's **Technology type** or **Version** field.
    >
    > - To change the technology type, you'll need to [delete the site](delete-a-site.md) and [recreate it](create-a-site.md).
    > - To change the version, [upgrade the packet core instance](upgrade-packet-core-azure-portal.md).

- If you want to make changes to the attached data networks, refer to [Collect data network values](collect-required-information-for-a-site.md#collect-data-network-values) to collect the new values and make sure they're in the correct format.
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.
- If you use Microsoft Entra ID to authenticate access to your local monitoring tools and you're making a change that requires a packet core reinstall, ensure your local machine has core kubectl access to the Azure Arc-enabled Kubernetes cluster. This requires a core kubeconfig file, which you can obtain by following [Core namespace access](set-up-kubectl-access.md#core-namespace-access).

## Plan a maintenance window

The following changes will trigger components of the packet core software to restart, during which your service will be unavailable for approximately 8-12 minutes:

- Attaching a new or existing data network to the packet core instance.
- Changing the following configuration on an attached data network:
  - Dynamic UE IP pool prefixes
  - Static UE IP pool prefixes
  - Network address and port translation parameters
  - DNS addresses
- Changing the UE Maximum Transmission Unit (MTU) signaled by the packet core.

The following changes will trigger the packet core to reinstall, during which your service will be unavailable for up to two hours:

- Detaching a data network from the packet core instance.
- Changing the packet core instance's custom location.
- Changing the N2, N3 or N6 interface configuration on an attached data network.

The following changes require you to manually perform a reinstall, during which your service will be unavailable for up to two hours, before they take effect:

- Changing access network configuration.

If you're making any of these changes to a healthy packet core instance, we recommend running this process during a maintenance window to minimize the impact on your service. Changes not listed here should not trigger a service interruption, but we recommend using a maintenance window in case of misconfiguration.

## Back up deployment information

The following list contains the data that will be lost over a packet core reinstall. If you're making a change that requires a reinstall, back up any information you'd like to preserve; after the reinstall, you can use this information to reconfigure your packet core instance. If your packet core instance is in **Uninstalled**, **Uninstalling** or **Failed** state, or if you're connecting an ASE device for the first time, you can skip this step and proceed to [Select the packet core instance to modify](#select-the-packet-core-instance-to-modify).

1. Depending on your authentication method when signing in to the [distributed tracing](distributed-tracing.md) and [packet core dashboards](packet-core-dashboards.md):
    - If you use Microsoft Entra ID, save a copy of the Kubernetes Secret Object YAML file you created in [Create Kubernetes Secret Objects](enable-azure-active-directory.md#create-kubernetes-secret-objects).
    - If you use local usernames and passwords and want to keep using the same credentials, save a copy of the current passwords to a secure location.
1. All traces are deleted during upgrade and cannot be retrieved. If you want to retain any traces, [export and save](distributed-tracing-share-traces.md#export-trace-from-the-distributed-tracing-web-gui) them securely before continuing.
1. Any customizations made to the packet core dashboards won't be carried over the reinstall. Refer to [Exporting a dashboard](https://grafana.com/docs/grafana/v6.1/reference/export_import/#exporting-a-dashboard) in the Grafana documentation to save a backed-up copy of your dashboards.
1. Most UEs will automatically re-register and recreate any sessions after the reinstall completes. If you have any special devices that require manual operations to recover from a packet core outage, gather a list of these UEs and their recovery steps.

## Select the packet core instance to modify

In this step, you'll navigate to the **Packet Core Control Plane** resource representing your packet core instance.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select the **Mobile Network** resource representing the private mobile network.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for a Mobile Network resource.":::

1. In the **Resource** menu, select **Sites**.
1. Select the site containing the packet core instance you want to modify.
1. Under the **Network function** heading, select the name of the **Packet Core Control Plane** resource shown next to **Packet Core**.

    :::image type="content" source="media/packet-core-field.png" alt-text="Screenshot of the Azure portal showing the Packet Core field.":::

1. Select **Modify packet core**.

    :::image type="content" source="media/modify-packet-core/modify-packet-core-configuration.png" alt-text="Screenshot of the Azure portal showing the Modify packet core option.":::

1. If you're making a change that requires a packet core reinstall, enable the **Enable changes to configuration that require a reinstall to take effect** toggle.
1. Choose the next step:
   - If you want to make changes to the packet core configuration or access network values, go to [Modify the packet core configuration](#modify-the-packet-core-configuration).
   - If you want to configure a new or existing data network and attach it to the packet core instance, go to [Attach a data network](#attach-a-data-network).
   - If you want to make changes to a data network that's already attached to the packet core instance, go to [Modify attached data network configuration](#modify-attached-data-network-configuration).

## Modify the packet core configuration

To modify the packet core and/or access network configuration:

1. If you haven't already, [select the packet core instance to modify](#select-the-packet-core-instance-to-modify).
1. In the **Configuration** tab, fill out the fields with any new values.
  
   - Use the information you collected in [Collect packet core configuration values](collect-required-information-for-a-site.md#collect-packet-core-configuration-values) for the top-level configuration values.
   - Use the information you collected in [Collect access network values](collect-required-information-for-a-site.md#collect-access-network-values) for the configuration values under **Access network**.
   - If you want to enable UE Metric monitoring, use the information collected in [Collect UE Usage Tracking values](collect-required-information-for-a-site.md#collect-ue-usage-tracking-values) to fill out the **Azure Event Hub Namespace**, **Event Hub name** and **User Assigned Managed Identity** values.
    > [!NOTE]
    > You must reinstall the packet core control pane** in order to use UE Metric monitoring if it was not already configured.
1. Choose the next step:
   - If you've finished modifying the packet core instance, go to [Submit and verify changes](#submit-and-verify-changes).
   - If you want to configure a new or existing data network and attach it to the packet core instance, go to [Attach a data network](#attach-a-data-network).
   - If you want to make changes to a data network that's already attached to the packet core instance, go to [Modify attached data network configuration](#modify-attached-data-network-configuration).

## Attach a data network

> [!IMPORTANT]
> You must configure the ASE device with interfaces corresponding to the data networks before you can attach them to the packet core. See [Changing ASE configuration after deployment](commission-cluster.md#changing-ase-configuration-after-deployment).

To configure a new or existing data network and attach it to your packet core instance:

1. If you haven't already, [select the packet core instance to modify](#select-the-packet-core-instance-to-modify).
1. Select the **Data networks** tab.
1. Select **Attach data network**.

    :::image type="content" source="media/modify-packet-core/modify-packet-core-data-networks-attach.png" alt-text="Screenshot of the Azure portal showing the Modify packet core Data networks tab. The option to attach a data network is highlighted.":::

1. In the **Data network** field, choose an existing data network from the dropdown or select **Create new** to create a new one. Use the information you collected in [Collect data network values](collect-required-information-for-a-site.md#collect-data-network-values) to fill out the remaining fields.

    :::image type="content" source="media/modify-packet-core/modify-packet-core-attach-data-network.png" alt-text="Screenshot of the Azure portal showing the Attach data network screen.":::

1. Select **Attach**.
1. Repeat the steps above for each additional data network you want to configure.
1. Choose the next step:
   - If you've finished modifying the packet core instance, go to [Submit and verify changes](#submit-and-verify-changes).
   - If you want to make changes to a data network that's already attached to the packet core instance, go to [Modify attached data network configuration](#modify-attached-data-network-configuration).

## Modify attached data network configuration

To make changes to a data network attached to your packet core instance:

1. If you haven't already, [select the packet core instance to modify](#select-the-packet-core-instance-to-modify).
1. Select the **Data networks** tab.
1. Select the data network you want to modify.

    :::image type="content" source="media/modify-packet-core/modify-packet-core-data-networks-modify.png" alt-text="Screenshot of the Azure portal showing the Modify packet core Data networks tab. A data network is highlighted.":::

1. Use the information you collected in [Collect data network values](collect-required-information-for-a-site.md#collect-data-network-values) to fill out the fields in the **Modify attached data network** window.

    :::image type="content" source="media/modify-packet-core/modify-packet-core-modify-data-network.png" alt-text="Screenshot of the Azure portal showing the Modify attached data network screen.":::

1. Select **Modify**. You should see your changes under the **Data networks** tab.
1. Go to [Submit and verify changes](#submit-and-verify-changes).

## Remove an attached data network

To remove a data network attached to the packet core:

1. Select the checkbox for the data network you want to delete.
1. Select **Delete**.

:::image type="content" source="media/modify-packet-core/modify-packet-core-delete-attached-data-network.png" alt-text="Screenshot of the Azure portal showing a selected data network and delete button.":::

This change will require a manual packet core reinstall to take effect, see [Next steps](#next-steps).

## Submit and verify changes

1. Select **Modify**.
1. Azure will now redeploy the packet core instance with the new configuration. The Azure portal will display the following confirmation screen when this deployment is complete.

    :::image type="content" source="media/site-deployment-complete.png" alt-text="Screenshot of the Azure portal showing the confirmation of a successful deployment of a packet core instance.":::

1. Navigate to the **Packet Core Control Plane** resource as described in [Select the packet core instance to modify](#select-the-packet-core-instance-to-modify).

    - If you made changes to the packet core configuration, check that the fields under **Connected ASE device**, **Azure Arc Custom Location** and **Access network** contain the updated information.
    - If you made changes to the attached data networks, check that the fields under **Data networks** contain the updated information.

## Remove data network resource

If you removed an attached data network from the packet core and it is no longer attached to any packet cores or referenced by any SIM policies, you can remove the data network from the resource group:  
> [!NOTE]
> The data network that you want to delete must have no SIM policies associated with it. If the data network has one or more associated SIM policies data network removal will be prevented.

1. If you need to delete data network from a SIM policy's configuration:
    1. Navigate to the **SIM Policy** resource.
    1. Select **Modify SIM Policy**.
    1. Either:

        - Select the **Delete** button for the network slice containing the associated data network.
        - Or
            1. Select the **Edit** button for the network slice containing the associated data network.
            1. Select a new **Data network** to be associated with the network slice.
            1. Select **Modify**.
    1. Select **Review + Modify**.
    1. Select **Modify**.
1. Navigate to the resource group containing your AP5GC resources.
1. Select the checkbox for the data network resource you want to delete.
1. Select **Delete**.

## Restore backed up deployment information

If you made changes that triggered a packet core reinstall, reconfigure your deployment using the information you gathered in [Back up deployment information](#back-up-deployment-information).

1. Depending on your authentication method when signing in to the [distributed tracing](distributed-tracing.md) and [packet core dashboards](packet-core-dashboards.md):
    
    - If you use Microsoft Entra ID, [reapply the Secret Object for distributed tracing and the packet core dashboards](enable-azure-active-directory.md#apply-kubernetes-secret-objects).
    - If you use local usernames and passwords, follow [Access the distributed tracing web GUI](distributed-tracing.md#access-the-distributed-tracing-web-gui) and [Access the packet core dashboards](packet-core-dashboards.md#access-the-packet-core-dashboards) to restore access to your local monitoring tools.

1. If you backed up any packet core dashboards, follow [Importing a dashboard](https://grafana.com/docs/grafana/v6.1/reference/export_import/#importing-a-dashboard) in the Grafana documentation to restore them.
1. If you have UEs that require manual operations to recover from a packet core outage, follow their recovery steps.

## Next steps

- If you made a configuration change that requires you to manually perform packet core reinstall, follow [Reinstall the packet core instance in a site](reinstall-packet-core.md).
- Use [Azure Monitor](monitor-private-5g-core-with-platform-metrics.md) or the [packet core dashboards](packet-core-dashboards.md) to confirm your packet core instance is operating normally after you modify it.
