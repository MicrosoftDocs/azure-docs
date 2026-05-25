---
title: Manage your Datadog resource - Azure Native Integration
description: Learn how to manage your Datadog resource in Azure, including configuring metrics, logs, agents, SSO, multi-subscription monitoring, API keys, billing, and resource deletion.
ms.topic: how-to
ms.date: 03/10/2025
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-desc
  - ai-seo-date:12/03/2024
  - ai-gen-title
  - sfi-image-nochange
#customer intent: As a developer or cloud engineer, I want to manage my Datadog resource on Azure so I can configure monitoring, troubleshoot issues, and optimize my setup.
---

# Manage your Datadog resource

This article covers day-to-day management tasks for your Datadog Azure Native Integration resource. It includes configuring metrics and logs, managing agents, setting up multi-subscription monitoring, and more.

## Resource overview

To open your Datadog resource:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Open the [Datadog resources browse view](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Datadog%2Fmonitors) (or search for **Datadog** in the global search bar and select **Datadog – An Azure Native ISV Service**).
1. Select your Datadog resource. The Azure portal opens the **Overview** pane by default.

:::image type="content" source="media/manage/resource-overview.png" alt-text="A screenshot of a Datadog resource in the Azure portal with the overview displayed in the working pane." lightbox="media/manage/resource-overview.png":::

The overview pane shows these details:

| Detail | Description |
|--------|-------------|
| Resource group name | The resource group containing this Datadog resource |
| Location | The Azure region where the resource is deployed |
| Subscription / Subscription ID | The Azure subscription linked to this resource |
| Tags | Azure resource tags applied to this resource |
| Datadog organization | The Datadog organization linked to this resource |
| Status | Active, Creating, or Failed |
| Pricing Plan | The current Datadog billing plan |
| Billing Term | Monthly or annual billing term |

Below the essentials, you can navigate to:

- **View Dashboards** — Insights on health and performance in the Datadog portal
- **View Logs** — Search and analyze logs with ad-hoc queries in the Datadog portal
- **View host maps** — A complete view of all monitored hosts (Azure Virtual Machines, Azure Virtual Machine Scale Sets, Azure App Service plans)

The working pane also shows a summary of monitored resources:

| Column | Description |
|--------|-------------|
| Resource type | Azure resource type |
| Total resources | Count of all resources for the resource type |
| Resources sending logs | Count of resources sending logs to Datadog through the integration |
| Resources sending metrics | Count of resources sending metrics to Datadog through the integration |

## Reconfigure rules for metrics and logs

To change which resources send metrics and logs to Datadog:

1. Select **Datadog organization configurations > Metrics and Logs** from the service menu.
2. Update the tag rules or toggle individual settings. See [tag rules for sending metrics](../metrics-logs.md#tag-rules-for-sending-metrics) and [tag rules for sending logs](../metrics-logs.md#tag-rules-for-sending-logs) for include/exclude examples.
3. Changes take effect within a few minutes as diagnostic settings are updated on matching resources.

For a full reference on what data is forwarded and how tag rules behave, see [Monitor & Observe Azure resources with Azure Native Integrations](../metrics-logs.md).

## Resource collection and Cloud Security Posture Management

The **Resource collection** blade (under **Datadog organization configurations**) controls two features:

| Setting | Default | What it does |
|---------|---------|--------------|
| **Enable resource collection** | On | Datadog collects metadata (types, tags, configurations) for every Azure resource in the linked subscription and populates the Datadog [Resource Catalog](https://docs.datadoghq.com/infrastructure/resource_catalog/). There's no additional Datadog charge. |
| **Enable Datadog Cloud Security Posture Management** | Off | Continuously assesses your Azure configuration against CIS, PCI DSS, SOC 2, HIPAA, and other benchmarks. Learn more about [Cloud Security Posture Management](https://www.datadoghq.com/knowledge-center/cloud-security-posture-management/). |

To change these settings:

1. Open your Datadog resource and select **Datadog organization configurations > Resource collection** from the service menu.
1. Toggle **Enable resource collection** and/or **Enable Datadog Cloud Security Posture Management**.
1. Select **Save** from the command bar.

> [!IMPORTANT]
> Cloud Security Posture Management can be enabled only when **Enable resource collection** is on. If you clear **Enable resource collection**, the CSPM checkbox is automatically disabled and any active CSPM scanning stops for the subscription.

## View monitored resources

To view the list of resources emitting logs to Datadog, select **Datadog organization configurations > Monitored Resources** in the service menu.

> [!TIP]
> You can filter the list of resources by resource type, subscription, resource group name, location, and whether the resource is sending logs and metrics.

The column **Logs to Datadog** indicates whether the resource is sending logs to Datadog. If a resource you expect to see isn't sending data, check:

- The resource type supports Azure Monitor diagnostic logs. See [supported categories](/azure/azure-monitor/essentials/resource-logs-categories).
- Your tag rules include (not exclude) the resource.
- The resource hasn't reached the limit of five diagnostic settings.

## Monitor multiple subscriptions

A single Datadog resource can monitor Azure resources across multiple subscriptions. This capability is useful when you have separate subscriptions for dev, staging, and production but want unified monitoring.

When you add or remove subscriptions for Datadog monitoring, the system updates the Monitoring Reader role assignment on the System Managed Identity linked to the resource.

### Prerequisites

- To perform these actions, you must have both of the following Azure permissions:

   - `Microsoft.Authorization/roleAssignments/write`
   - `Microsoft.Authorization/roleAssignments/delete`

- The resource provider for Datadog (`Microsoft.Datadog`) must be registered in the target subscription. See [Verify resource provider registration](prerequisites.md#verify-resource-provider-registration).

### Add subscriptions

To monitor multiple subscriptions:

1. Select **Datadog organization configurations > Monitored Subscriptions**.

1. Select **Add subscriptions** from the Command bar.

    The **Add Subscriptions** experience that opens and shows subscriptions you have _Owner_ role assigned to and any Datadog resource created in those subscriptions that is already linked to the same Datadog organization as the current resource.

    If the subscription you want to monitor has a resource already linked to the same Datadog org, delete the Datadog resources to avoid shipping duplicate data and incurring double the charges.

1. Select the subscriptions you want to monitor through the Datadog resource and select **Add**.

    > [!IMPORTANT]
    > - When you link a subscription to a Datadog resource, ensure that the subscription isn't scope locked (read-only or delete locks). Scope locks can prevent the addition and removal of diagnostic settings. For more information, see [Lock your Azure resources](../../azure-resource-manager/management/lock-resources.md).
    > - Setting separate tag rules for different subscriptions isn't supported. The tag rules from the primary resource apply to all monitored subscriptions.

    Diagnostics settings are automatically added to the subscription's resources that match the defined tag rules.

    Select **Refresh** to view the subscriptions and their monitoring status.

Once the subscription is added, the status changes to *Active*.

### Remove subscriptions

> [!IMPORTANT]
> When you unlink a subscription from a Datadog resource, ensure that the subscription isn't scope locked (read-only or delete locks). Scope locks can prevent the addition and removal of diagnostic settings. For more information, see [Lock your Azure resources](../../azure-resource-manager/management/lock-resources.md).

To unlink subscriptions from a Datadog resource:

1. Select **Datadog organization configurations > Monitored Subscriptions** from the service menu.

1. Select the subscription you want to remove.

1. Choose **Remove subscriptions**.

To view the updated list of monitored subscriptions, select **Refresh** from the Command bar.

## API keys

To view and manage API keys for your Datadog resource:

1. Select **Settings > Keys** from the service menu.

    The Azure portal provides a read-only view of the API keys.

1. To create or manage keys, select the **Datadog portal** link.

    The Datadog portal opens in a new tab.

After making changes in the Datadog portal, refresh the Azure portal view.

> [!IMPORTANT]
> One API key must be set as the **Default Key**. This key is used when deploying Datadog agents to VMs and App Services. If no default key is set, agent installations fail.

## Monitor resources with Datadog agents

You can install Datadog agents on virtual machines, App Service extensions, Azure Kubernetes Services, and Azure Arc Machines.

> [!IMPORTANT]
> If a default key isn't selected, your Datadog agent installation fails. See [API keys](#api-keys).

The agent collects detailed host-level metrics, traces, and logs that aren't available through Azure platform metrics alone. This includes process-level data, custom application metrics, and APM traces.

#### [Virtual machines](#tab/virtual-machines)

Select **Datadog organization configurations > Virtual machine agent** from the service menu to see every running VM in the linked subscription. The pane shows the VM name, power state, current Datadog Agent version, Agent status (Running/Stopped/Not installed), install method, and whether the Agent is forwarding logs.

To install the Datadog Agent as a VM extension:

1. Make sure a [default API key](#api-keys) is set. Installation fails without it.
1. Select the target VM (must be in **Running** state).
1. Select **Install Extension** and confirm. Azure installs the Datadog Agent as a VM extension using the default API key, and the status changes from **Installing** to **Installed**. The Datadog Agent doesn't require a host reboot.

To uninstall, select the VM and choose **Uninstall Extension**. If the Agent was installed by another method (Chef, Ansible, manual install, etc.), this pane shows status but the Azure-managed uninstall option is disabled.

#### [App Service](#tab/app-service)

Select **Datadog organization configurations > App Service extension** from the service menu to see all App Services in the linked subscription, with the App Service plan, Datadog extension version, and install status for each.

To install the Datadog extension on an App Service:

1. Confirm a [default API key](#api-keys) is set.
1. Select an App Service in **Running** state with a [Datadog-supported runtime](https://docs.datadoghq.com/serverless/azure_app_services/#requirements).
1. Select **Install Extension** and confirm.

    Azure adds the following app settings, restarts the App Service, and installs the extension:

    - `DD_API_KEY = <default API key>`
    - `DD_SITE = us3.datadoghq.com`

To uninstall, select the App Service and choose **Uninstall Extension**. The portal removes the extension and the Datadog app settings.

> [!NOTE]
> Installing or uninstalling the extension restarts your App Service.

#### [Azure Kubernetes Service](#tab/azure-kubernetes-services)

Select **Datadog organization configurations > Azure Kubernetes Services** from the service menu to see AKS clusters in the linked subscription. The Datadog Agent is deployed to AKS through the **Datadog AKS Cluster Extension**.

To install:

1. Select the AKS cluster(s) from the list.
1. Select **Install Extension**.
1. Azure installs the Datadog AKS Cluster Extension on the selected cluster(s) using the default API key.

To uninstall, select the AKS cluster and choose **Uninstall Extension**.

#### [Azure Arc machines](#tab/azure-arc-machines)

Select **Datadog organization configurations > Azure Arc Machines** from the service menu to install the Datadog Agent on hybrid and multicloud machines projected into Azure through Azure Arc.

1. Confirm a [default API key](#api-keys) is set.
1. Select the Arc-enabled machine and choose **Install Extension**.

Status transitions from **Installing** to **Installed** once the Arc agent provisions the Datadog extension on the target host. To uninstall, select the machine and choose **Uninstall Extension**.

---

## Reconfigure single sign-on

[!INCLUDE [reconfigure-sso](../includes/reconfigure-sso.md)]

## Change your billing plan

To change the Datadog billing plan associated with your resource:

1. On the **Overview** pane of your Datadog resource, select **Change Plan** from the command bar.

    Azure retrieves all Datadog plans available to your tenant, including any [private offers](/marketplace/private-offers-in-azure-marketplace) you've accepted.

1. Select the new plan and choose **Change Plan**.

Usage on Marketplace-billed Datadog plans counts toward your organization's [Microsoft Azure Consumption Commitment (MACC)](/marketplace/azure-consumption-commitment-benefit), where applicable.

## Manage logs and metrics

To stop sending logs and metrics from Azure to Datadog:

1. Open your Datadog resource from the [Datadog resources browse view](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Datadog%2Fmonitors).
1. Select **Disable** from the command bar.

> [!IMPORTANT]
> Disabling the integration stops the flow of Azure platform metrics and logs to Datadog. However, billing continues for other Datadog services that aren't related to monitoring Azure metrics and logs (such as APM, infrastructure agents, or log indexing in Datadog).

## Delete a resource

[!INCLUDE [delete-resource](../includes/delete-resource.md)]

> [!NOTE]
> Deleting the Datadog resource in Azure stops Azure data forwarding and billing through Azure Marketplace. It doesn't delete your Datadog organization or any data stored in Datadog.

## Get support

Contact [Datadog](https://www.datadoghq.com/support) for customer support.

You can also request support in the Azure portal from the [resource overview](#resource-overview).

Select **Support + Troubleshooting** > **New support request** from the service menu, then choose the link to [log a support request in the Datadog portal](https://www.datadoghq.com/support).

## Related content

- [Troubleshooting Datadog on Azure](troubleshoot.md)

