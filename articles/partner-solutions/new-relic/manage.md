---
title: Manage Azure Native New Relic Service
description: Learn how to manage your Azure Native New Relic Service settings.
ms.topic: how-to
ms.date: 01/10/2025

---

# Manage Azure Native New Relic Service

This article describes how to manage the settings for Azure Native New Relic Service.

## Resource overview 

[!INCLUDE [change-plan](../includes/manage.md)]

:::image type="content" source="media/manage/resource-overview.png" alt-text="A screenshot of a New Relic resource in the Azure portal with the overview displayed in the working pane.":::

The *Essentials* details include:

- Resource group
- Region
- Subscription
- Tags
- New Relic account
- New Relic organization
- Status
- Pricing plan
- Billing term

Select the links next to corresponding details to manage your resource.

Below the essentials, you can navigate to other details about your resource by selecting a tab.

- The **Get started** tab provides deep links to New Relic dashboards, logs, and alerts.
- The **Monitoring** tab provides a summary of the resources that send logs and metrics to New Relic.

### Monitoring tab

If you select **Monitoring**, the pane that opens includes a table with information about the Azure resources that are sending logs and metrics to New Relic.

:::image type="content" source="media/manage/resource-overview-monitoring.png" alt-text="A screenshot of a New Relic resource's Monitoring information displayed in the working pane of Azure portal.":::

The columns in the table denote valuable information for your resource:

|Property                  | Description                                                                      |
|--------------------------|----------------------------------------------------------------------------------|
| **Resource type**        | Azure resource type                                                              |
| **Total resources**      | Count of all resources for the resource type                                     |
| **Logs to New Relic**    | Count of logs for the resource type                                              |
| **Metrics to New Relic** | Count of resources sending metrics to New Relic through the integration          |

## Reconfigure rules for metrics and logs

To change the configuration rules for metrics and [logs](overview.md#logs), select **New Relic account config** > **Metrics and logs** from the *Service menu*. 

:::image type="content" source="media/manage/resource-overview-monitoring.png" alt-text="A screenshot of a New Relic resource's Metrics and logs displayed in the working pane of the Azure portal.":::

## View monitored resources

To see the list of resources sending metrics and logs to New Relic, select **New Relic account config** > **Monitored resources** from the *Service menu*. 

You can filter the list of resources by resource type, resource group name, region, and whether the resource is sending metrics and logs.

The column **Logs to New Relic** indicates whether the resource is sending logs to New Relic. 

## Monitor multiple subscriptions

You can now monitor all your subscriptions through a single New Relic resource using **Monitored Subscriptions**. You don't have to set up a New Relic resource in every subscription that you intend to monitor. Instead, monitor multiple subscriptions by linking them to a single New Relic resource tied to a New Relic organization. This provides a single pane view for all resources across multiple subscriptions.

To monitor multiple subscriptions:

1. Select **New Relic account config** > **Monitored Subscriptions** from the *Service menu*. 

1. Select **Add subscriptions**. 

    Subscriptions you have _Owner_ role assigned to and New Relic resource(s) created in those subscriptions which are linked to the same New Relic organization as the current resource display in the Add subscriptions panel.

    > [!TIP]
    > If the subscription you want to monitor has a resource already linked to the same New Relic org, we recommended that you delete the New Relic resources to avoid shipping duplicate data, and incurring double the charges.

1. Select the subscriptions you want to monitor through the New Relic resource and select the **Add** button.

    If the list doesn’t update automatically, select **Refresh**.  When the subscription is successfully added, you see the status is updated to **Active**. If a subscription fails to get added, **Monitoring Status** shows as **Failed**.

The set of tag rules for metrics and logs defined for the New Relic resource apply to all subscriptions that are added for monitoring. Setting separate tag rules for different subscriptions isn't supported. Diagnostics settings are automatically added to resources in the added subscriptions that match the tag rules defined for the New Relic resource.

If you have existing New Relic resources that are linked to the account for monitoring, duplication of logs can result in added charges. To prevent duplicate charges, delete redundant New Relic resources that are already linked to the account. We recommended consolidating subscriptions into the same New Relic resource where possible.

The tag rules and logs that you defined for the New Relic resource apply to all the subscriptions that you select to be monitored.

## Connected New Relic resources

To access all New Relic resources and deployments you created using the Azure or New Relic portal experience, go to the **Connected New Relic resources** tab in any of your Azure New Relic resources.

:::image type="content" source="media/new-relic-how-to-manage/connected-new-relic-resources.png" alt-text="Screenshot showing Connected New Relic resources selected in the Resource menu.":::

You can easily manage the corresponding New Relic deployments or Azure resources using the links, provided you have owner or contributor rights to those deployments and resources.

## Monitor virtual machines using the New Relic agent

You can install the New Relic agent on virtual machines as an extension. Select **Virtual Machines** on the left pane. The **Virtual machine agent** pane shows a list of all virtual machines in the subscription.

:::image type="content" source="media/new-relic-how-to-manage/new-relic-virtual-machines.png" alt-text="Screenshot that shows virtual machines for a New Relic resource.":::

For each virtual machine, the following info appears:

  |  Property | Description |
  |--|--|
  | **Virtual machine name** | Name of the virtual machine. |
  | **Resource status**  | Indicates whether the virtual machine is stopped or running. The New Relic agent can be installed only on virtual machines that are running. If the virtual machine is stopped, installing the New Relic agent is disabled. |
  | **Agent status**  | Indicates whether the New Relic agent is running on the virtual machine. |
  | **Agent version**    | Version number of the New Relic agent. |

> [!NOTE]
> If a virtual machine shows that an agent is installed, but the option **Uninstall extension** is disabled, the agent was configured through a different New Relic resource in the same Azure subscription. To make any changes, go to the other New Relic resource in the Azure subscription.

## Monitor Azure Virtual Machine Scale Sets using the New Relic agent

You can install New Relic agent on Azure Virtual Machine Scale Sets as an extension.

1. Select **Virtual Machine Scale Sets** under **New Relic account config** in the Resource menu.
1. In the working pane, you see a list of all virtual machine scale sets in the subscription.

Virtual Machine Scale Sets is an Azure Compute resource that can be used to deploy and manage a set of identical VMs. For more information, see [Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/overview).

For more information on the orchestration modes available [orchestration modes](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes).

Use  native integration to install an agent on both the uniform and flexible scale-sets. The new instances (VMs) of a scale set, in any mode, receive the agent extension during scale-up. Virtual Machine Scale Sets resources in a uniform orchestration mode support _Automatic_, _Rolling_, and _Manual_ upgrade policy. Resources in Flexible orchestration mode only support manual upgrade.

If a manual upgrade policy is set for a resource, upgrade the instances manually by installing the agent extension for the already scaled up instances. For more information on autoscaling and instance orchestration, see [autoscaling-and-instance-orchestration](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes#autoscaling-and-instance-orchestration).

> [!NOTE]
> In manual upgrade policy, preexisting VM instances don't receive the extension automatically. The agent status shows as **Partially Installed**. Upgrade the VM instances by manually installing the extension on them from the VM extensions Resource menu, or go to specific Virtual Machine Scale Sets and select **Instances** from the Resource menu.

> [!NOTE]
> The agent installation dashboard supports the automatic and rolling upgrade policy for Flex orchestration mode in the next release when similar support is available from Virtual Machine Scale Sets Flex resources.

## Monitor app services using the New Relic agent

You can install the New Relic agent on app services as an extension. Select **App Services** on the left pane. The working pane shows a list of all app services in the subscription.

:::image type="content" source="media/new-relic-how-to-manage/new-relic-app-services.png" alt-text="Screenshot that shows app services for a New Relic resource.":::

For each app service, the following information appears:

 |Property |         Description |
 |--|----|
 | **Resource name**         | App service name.|
 | **Resource status**       | Indicates whether the App service is running or stopped. The New Relic agent can be installed only on app services that are running.|
 | **App Service plan**      | The plan configured for the app service.|
 | **Agent status**          | Status of the agent. |
  
To install the New Relic agent, select the app service and then select **Install Extension**. The application settings for the selected app service are updated, and the app service is restarted to complete the configuration of the New Relic agent.

> [!NOTE]
> App Service extensions are currently supported only for app services that are running on Windows operating systems. The list doesn't show app services that use Linux operating systems.

> [!NOTE]
> This page currently shows only the web app type of app services. Managing agents for function apps isn't supported at this time.

## Change billing plan

[!INCLUDE [change-plan](../includes/change-plan.md)]

## Delete a New Relic resource

[!INCLUDE [delete-resource](../includes/delete-resource.md)]

> [!NOTE]
> If you have other New Relic resources linked to the New Relic account, billing for those other resources continues through the Azure Marketplace.

## Next steps

- [Troubleshoot Azure Native New Relic Service](troubleshoot.md)

