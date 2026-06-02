---
title: Host a Web App in an App Service Environment
description: Create a web app that uses an App Service Environment, and host the isolated app in a virtual network/subnet configuration. Follow procedures in the Azure portal to create the web app, enable encryption, diagnostic logging, and more.
author: seligj95
ms.topic: how-to
ms.date: 03/06/2026
ms.author: jordanselig
ms.service: azure-app-service
# customer intent: As a developer, I want to use an App Service Environment for my App Service web app, so I can host isolated apps in my virtual network.
---

# Host a web app in an App Service Environment

An App Service Environment is a single-tenant deployment of Azure App Service that integrates with an Azure Virtual Network instance and subnet. In this scenario, you can host your web app in an isolated environment where you're the only user of the system. The apps you deploy are subject to the networking features applied to the virtual network subnet for the App Service Environment. No other features are required for your web apps to access the networking features. 

When you create the web app in your App Service Environment, you follow the standard creation process with a slightly different approach:

- For the web app region, rather than choosing a geographic location for app deployment, select an App Service Environment.
- For a new App Service plan in the App Service Environment, select an isolated v2 pricing tier.

This article describes how to create the App Service web app in an App Service Environment by following procedures in the Azure portal.

## Prerequisites

- An App Service Environment. To create a new environment, follow the steps in [Quickstart: Create an App Service Environment](creation.md).

- When you create your app, keep in mind that Windows and Linux apps can be in the same App Service Environment, but they can't be in the same App Service plan.

## Create the web app

In the Azure portal, create a web app in an App Service Environment:

1. Sign into the [Azure portal](https://portal.azure.com).

1. Select **Create a resource**, locate **Web App** in the list of resources, and select **Create**.

   The **Create Web App** pane opens to the **Basic** tab:

   :::image type="content" source="./media/using/create-application.png" border="false" alt-text="Screenshot that shows how to create a web app in an App Service Environment in the Azure portal.":::

1. In the **Basic** tab, select your **Subscription**.

1. Select an existing **Resource group** or select **Create new** for a new instance.

1. Enter a **Name** for the new web app.

   If you previously selected an App Service plan in an App Service Environment, the domain name for the app reflects the domain name of the App Service Environment. For example, for the app `zava-hosted-web-app` and App Service Environment `zava-app-service-envrionment-1`, the domain name for the app is `zava-hosted-web-app-zava-app-service-envrionment-1.appserviceenvironment.net`.

1. Configure the **Publish**, **Runtime stack**, and **Operating System** settings according to your app requirements.

1. For the **Region** setting, use the dropdown list to make your selection.

   - To use an existing App Service Environment, select the environment under the **App Service Environments v3** section in the dropdown list.
   
   - To create a new App Service Environment, select a region under the **Regions** section in the dropdown list. After you select a region, the **Create Web App** pane adds a section with configuration options for the new App Service Environment. You complete the steps for the new environment later in this procedure.
   
   You can filter the **Region** list to show matching items in the list for both environments and regions. The example filters the list to match _Canada_.

   :::image type="content" source="./media/using/select-region-environment.png" alt-text="Screenshot that shows how to select an App Service Environment as the app region with a filter for items matching 'Canada'.":::

1. For the **Pricing plans** options, specify the App Service plan name and the plan pricing tier.

   - For the App Service **Linux plan**, use the dropdown list and select an existing plan, or select **Create new** for a new plan.

   - For the **Pricing plan** tier, if you selected an existing plan, the value populates with the pricing tier for your current plan.
   
      If you're creating a new App Service plan, use the dropdown list and select the tier size. The list shows **Popular plans**. The only SKU you can select for your app is an _Isolated v2_ pricing SKU.
      
      :::image type="content" source="./media/using/select-plan-tier.png" alt-text="Screenshot that shows how to select the pricing tier for the App Service plan in the Azure portal.":::

      You can select **Explore pricing plans** to compare the plan features. The following image shows an example of pricing plans and features. In the **Select App Service Pricing plan** pane, select a plan in the list and then choose **Select**.

      :::image type="content" source="./media/using/plan-tiers-features.png" alt-text="Screenshot that shows App Service plan pricing tiers with their features and hardware in the Azure portal.":::

      Creating the new App Service plan takes about 20 minutes.

1. If you're creating a new App Service Environment as part of creating your new App Service plan, configure the following **App Service Environment** settings:

   - Enter an **App Service Environment Name**.

   - Select the **Virtual IP Type** (Internal or External). For more information about this setting, see [Plan the access level for the app](#plan-the-access-level-for-the-app).

   :::image type="content" source="./media/using/configure-new-environment.png" alt-text="Screenshot that shows how to configure a new App Service Environment in the Azure portal.":::

1. Switch to the **Networking** tab in the **Create Web App** pane, and configure the settings.

   - If you're creating a new App Service Environment:
   
      - Identify the **Virtual Network** and **Subnet** to use for the deployment. You can choose existing resources or create new instances.
      
      <a name="configure-dns-setting"></a>

      - Configure the **DNS** setting. If you want the system to configure the DNS for you in the virtual network of your App Service Environment, select **Azure DNS Private zone**.
      
         If you prefer to configure DNS manually, select **Manual**. After the deployment completes, you can modify the configuration to [use your own DNS server](#use-your-own-dns-server) or specify [Azure DNS private zones](#configure-dns-in-azure-dns-private-zone).

      - Configure the **Inbound IP address** setting. Choose **Automatic** (system-assigned IP address from the subnet) or **Manual** (enter your preferred IP address).

   - If you're using an existing App Service Environment for the deployment, configure the **Virtual network integration** option as needed.

1. (Optional) Configure options on the remaining tabs in the **Create web app** pane according to your app requirements. Most settings are disabled by default.

   - **Deployment**: Configure continuous deployment, authentication, and GitHub settings.
   - **Monitor + Secure**: Use Azure Monitor Application Insights or Microsoft Defender for Cloud.
   - **Tags**: Define tags for the app.

   If you're creating a new App Service Environment, also confirm the settings on the **Hosting** tab.

1. Select **Review + create**. Confirm the web app configuration is correct, and select **Create**.

## Review scaling options

Every App Service app runs in an App Service plan. App Service Environments hold App Service plans, and App Service plans hold apps. When you scale an app, you also scale the App Service plan and all the apps in that same plan.

When you scale an App Service plan, the required infrastructure is added automatically. Be aware there's a time delay for the scale operations while the infrastructure is being added. For example, when you scale an App Service plan, and you have another scale operation of the same operating system and size running, there might be a delay of a few minutes until the requested scale starts.

A scale operation on one size and operating system doesn't affect scaling of the other combinations of size and operating system. For example, if you're scaling a Windows I2v2 App Service plan, a scale operation to a Windows I3v2 App Service plan starts immediately. Scaling normally takes less than 15 minutes but can take up to 45 minutes.

In a multitenant App Service scenario, scaling is immediate because a pool of shared resources is readily available to support it. App Service Environment is a single-tenant service, so there's no shared buffer, and resources are allocated based on need.

## Plan the access level for the app

In an App Service Environment with an internal virtual IP (VIP), the domain suffix used for app creation is `<app-service-environment-name>.appserviceenvironment.net`. For an App Service Environment named `zava-environment` that hosts an app named `hosted-web-app`, you reach the environment by using the following URLs:

- `hosted-web-app.zava-environment.appserviceenvironment.net`
- `hosted-web-app.scm.zava-environment.appserviceenvironment.net`

Apps hosted on an App Service Environment that uses an internal VIP are only accessible if you're in the same virtual network, or you're connected to that virtual network. Similarly, publishing is only possible if you're in the same virtual network or you're connected to that virtual network. 

In an App Service Environment with an external VIP, the domain suffix used for app creation is `<app-service-environment-name>.p.azurewebsites.net`. If an App Service Environment named `zava-environment` that hosts an app named `hosted-web-app`, you reach the environment by using the following URLs:

- `hosted-web-app.zava-environment.p.azurewebsites.net`
- `hosted-web-app.scm.zava-environment.p.azurewebsites.net`

You use the `scm` URL to access the Kudu console, or publish your app by using web deploy. For more information, see [Kudu service for Azure App Service](../resources-kudu.md). The Kudu console gives you a web UI for debugging, uploading files, and editing files.

### Configure DNS

If your App Service Environment is made with an external VIP, your apps are automatically put into public DNS. If your App Service Environment is made with an internal VIP, you might need to configure DNS manually.

- When you created your app, if you selected [automatic configuration of Azure DNS private zones](#configure-dns-setting), the DNS is configured for you in the virtual network of your App Service Environment.

- If you chose to [configure DNS manually](#configure-dns-setting), you need to use your own DNS server or configure Azure DNS private zones, as described in the following sections.

You can find the IP addresses for the App Service Environment in the Azure portal:

1. In the Azure portal, go to the **Overview** page for the App Service Environment for your app.

1. In the left menu, selecting **Settings** > **IP addresses**.

The **IP Addresses** page shows **Inbound** and **Outbound** IP addresses:

:::image type="content" source="./media/using/environment-ip-addresses.png" alt-text="Screenshot that shows how to find the inbound IP address for the App Service Environment in the Azure portal.":::

### Use your own DNS server

If you want to use your own DNS server, add the following records:

1. In your DNS server, create a **DNS zone** with the name of your App Service Environment, `<app-service-environment-name>.appserviceenvironment.net`. Later steps in this procedure refer to this zone as _zone-main_.

1. Create an `A` record in _zone-main_ that points the asterisk `*` (wildcard notation) to the inbound IP address used by your App Service Environment.

1. Create an `A` record in _zone-main_ that points the at symbol `@` notation to the inbound IP address used by your App Service Environment.

1. Create a zone within _zone-main_ named `scm`. 

1. Create an `A` record in the `scm` zone that points the asterisk `*` (wildcard notation) to the inbound address used by your App Service Environment.

### Configure DNS in Azure DNS private zone

To configure DNS in Azure DNS private zones:

1. Create an Azure **Private DNS zone** resource. with the name of your App Service Environment, `<app-service-environment-name>.appserviceenvironment.net`. Later steps in this procedure refer to this zone as _zone-main_.

1. Create an `A` record in _zone-main_ that points the asterisk `*` (wildcard notation) to the inbound IP address.

1. Create an `A` record in _zone-main_ that points the at symbol `@` notation to the inbound IP address.

1. Create an `A` record in _zone-main_ that points the `*.scm` zone notation to the inbound IP address.

The DNS settings for the default domain suffix of your App Service Environment don't restrict access to your apps to only the values you specify. You can set a custom domain name without any validation on your apps in an App Service Environment. If you later create a zone named `zava-new-zone.net`, you can point it to the inbound IP address.

The custom domain name works for app requests. If the custom domain suffix certificate includes a wildcard SAN for scm, the custom domain name also works for the `scm` site. You can create a `*.scm` record and point it to the inbound IP address.

## Publish the web app

You can publish your web app by any of the following methods:

- Web deployment
- Continuous integration (CI)
- Drag-and-drop in the Kudu console
- An integrated development environment (IDE), such as Visual Studio, Eclipse, or IntelliJ IDEA

With an internal VIP App Service Environment, the publishing endpoints are available only through the inbound address. If you don't have network access to the inbound IP address, you can't publish any apps on that App Service Environment. Your IDE must also have network access to the inbound address on the App Service Environment to publish directly to it.

Without other changes, internet-based CI systems like GitHub and Azure DevOps don't work with an internal VIP App Service Environment. The publishing endpoint isn't internet accessible. You can enable publishing to an internal VIP App Service Environment from Azure DevOps by installing a self-hosted release agent in the virtual network. 

## Configure storage for your web app

You have 1 TB of storage for all the apps in your App Service Environment. An App Service plan in the isolated pricing SKU has a limit of 250 GB. In an App Service Environment, 250 GB of storage is added per App Service plan, up to the 1-TB limit. You can have more App Service plans than just four, but there's no other storage beyond the 1-TB limit.

## Monitor the App Service Environment

Microsoft monitors and manages the platform infrastructure in App Service Environment v3, and scales as needed. As a customer, you should monitor only the App Service plans and your individual running apps, and take the appropriate actions. You can [configure diagnostic settings for monitoring](#enable-diagnostic-logging) to support your scenario.

In the Azure portal, you can see some metrics for an App Service Environment. However, these metrics are for App Service Environment v1 and two resources. Metrics for App Service Environment v3 resources aren't visible. For earlier versions of App Service Environment, review the feature differences in the [App Service Environment overview](overview.md#feature-differences).

## Review logging scenarios and messages

You can integrate with Azure Monitor to send logs to Azure Storage, Azure Event Hubs, or Azure Monitor Logs.

The following tables show the scenarios and messages you can log.

| App Service Environment status | Message |
|---|---|
| Subnet almost full | `The specified App Service Environment is in a subnet that is almost out of space. There are {0} remaining addresses. Once these addresses are exhausted, the App Service Environment will not be able to scale.` |
| Environment near instance limit | `The specified App Service Environment is approaching the total instance limit of the App Service Environment. It currently contains {0} App Service Plan instances of a maximum 200 instances.` |
| Environment suspended | `The specified App Service Environment is suspended. The App Service Environment suspension may be due to an account shortfall or an invalid virtual network configuration. Resolve the root cause and resume the App Service Environment to continue serving traffic.` |
| Upgrade started | `A platform upgrade to the specified App Service Environment has begun. Expect delays in scaling operations.` |
| Upgrade complete | `A platform upgrade to the specified App Service Environment has finished.` |

| App Service plan creation | Message |
|---|---|
| Started | `An App Service plan ({0}) creation has started. Desired state: {1} I{2}v2 workers.` |
| Complete | `An App Service plan ({0}) creation has finished. Current state: {1} I{2}v2 workers.` |
| Failed | `An App Service plan ({0}) creation has failed. This may be due to the App Service Environment operating at peak number of instances, or run out of subnet addresses.` |

| Scaling operations | Message |
|---|---|
| Started | `An App Service plan ({0}) has begun scaling. Current state: {1} I(2)v2. Desired state: {3} I{4}v2 workers.` |
| Complete | `An App Service plan ({0}) has finished scaling. Current state: {1} I{2}v2 workers.` |
| Interrupted | `An App Service plan ({0}) was interrupted while scaling. Previous desired state: {1} I{2}v2 workers. New desired state: {3} I{4}v2 workers.` |
| Failed | `An App Service plan ({0}) has failed to scale. Current state: {1} I{2}v2 workers.` |

### Enable diagnostic logging

To enable diagnostic logging for your web app, follow these steps:

1. In the Azure portal, go to the **Overview** page for your web app.

1. In the left menu, select **Monitoring** > **Diagnostic settings**.

1. In the **Diagnostic settings** page, select **Add diagnostic setting**.

   :::image type="content" source="./media/using/environment-diagnostic-settings.png" alt-text="Screenshot that shows how to select 'Add diagnostic setting' for an App Service Environment in the Azure portal.":::

1. In the **Diagnostic setting** pane, provide a **Diagnostic setting name** for the log integration, such as `networking-logs`.

1. Select and configure your preferred **Logs**. For this example, select **App Service Platform Logs**.

1. Select your preferred **Destinations**.

1. If you want the diagnostics to include metrics data, select **Metrics**.

1. Select **Save**.

The **Diagnostic settings** page refreshes to show the new log added to the list.

If you integrate with Azure Monitor Logs, you can see the logs by selecting **Logs** from the App Service Environment portal, and creating a query against **AppServicePlatformLogs**. Logs are only emitted when your App Service Environment has an event that triggers the logs. If your App Service Environment doesn't have such an event, no logs are gathered. To quickly see an example of logs, perform a scale operation with an App Service plan. You can then run a query against **AppServicePlatformLogs** to see the generated logs.

### Create alert rule

To create an alert against your web app logs, follow the detailed instructions in [Create or edit a log search alert rule - Azure Monitor](/azure/azure-monitor/alerts/alerts-create-log-alert-rule).

Here are basic steps to create an alert rule for your hosted web app:

1. In the Azure portal, go to the **Monitoring** > **Alerts** page for your App Service Environment, and select **Create alert rule**.

1. In the **Scope** tab, confirm the **Scope level** is set to your subscription, and set **Resource** to your Azure Monitor Logs workspace.

1. In the **Condition** tab, specify the query for the rule and configure the conditions.

   1. Set the **Signal name** to use a **Custom log search**. The **Logs** pane opens.

   1. In the **Logs** pane, build a query for the alert. For example, `AppServicePlatformLogs | where ResultDescription contains 'has begun scaling'`. You can also start with a predefined query and modify as needed. Save your query.

   1. Configure other conditions for the rule, such as the **Threshold value** in the **Alert logic** group. 

1. In the **Details** tab, provide details about the rule:

   - For the **Project details**, confirm the **Subscription** and **Resource group** are specified as expected.
   
   - For the **Alert rule details**, select the rule **Severity** and the **Region**, and enter a **Name** for the new alert.
   
   - For the log query **Identity**, select the identity to use when running the log query.

   - (Optional) Configure **Advanced options** as needed.

1. (Optional) Configure options on the remaining tabs in the **Create an alert rule** pane:

   - **Actions**: Add or create an action group. The action group is where you define the response to the alert, such as sending an email or an SMS message.

   - **Tags**: Define tags for the web app alert rule.

1. Select **Review + create**. Confirm the alert configuration is correct, and select **Create**.

## Configure internal encryption

You can't see the internal components or the communication within the App Service Environment system. To enable higher throughput, encryption isn't enabled by default between internal components. The system is secure because the traffic is inaccessible to monitoring and access.

If you have a compliance requirement for complete encryption of the data path, you can enable the functionality:

1. In the Azure portal, go to the **Overview** page for your App Service Environment.

1. In the left menu, selecting **Settings** > **Configuration**.

1. In the **App Service Environment Configuration** pane, select the **Internal encryption** checkbox, and then select **Apply**.

:::image type="content" source="./media/using/enable-internal-encryption.png" alt-text="Screenshot that shows how to enable internal encryption for the App Service Environment in the Azure portal.":::

This option encrypts internal network traffic, and also encrypts the pagefile and worker disks.

> [!IMPORTANT]
> Enabling encryption can affect your system performance. The App Service Environment is in an unstable state until the change fully propagates. Complete propagation of the change can take several hours to complete, depending on how the number of instances to update.
> 
> Avoid enabling encryption while you're using the App Service Environment. To enable encryption while the environment is in use, divert traffic to a backup until the operation completes.

## Configure upgrade preference

If you have multiple App Service Environments, you might want one or more to upgrade before the others.

For each environment, configure the **Upgrade preference** setting:

1. In the Azure portal, go to the **Overview** page for the App Service Environment.

1. In the left menu, selecting **Settings** > **Configuration**.

1. In the **App Service Environment Configuration** pane, select your preference for the upgrades.

   - **Automatic**: Automatically upgrade the App Service Environment according to your selection:

      - `None`: (Default) Upgrade automatically during the upgrade process for the region.
      - `Early`: Upgrade automatically with a high prioritization compared with other resources in the region.
      - `Late`: Upgrade automatically with a low prioritization compared with other resources in the region. 

   - **Manual** Receive a notification when an upgrade is available, and start the process within 15 days. After 15 days, the upgrade occurs with other automatic upgrades in the region. For more information, see [Upgrade preference for App Service Environment planned maintenance](how-to-upgrade-preference.md).

1. To save your changes, select **Apply**.

:::image type="content" source="./media/using/set-upgrade-preference.png" alt-text="Screenshot that shows how to set the upgrade preference for an App Service Environment in the Azure portal.":::

This feature makes the most sense when you have multiple App Service Environments, and you might benefit from sequencing the upgrades. For example, you might set your development and test App Service Environments to upgrade early, and your production App Service Environments to upgrade later.

## Delete App Service Environment

Follow these steps to delete the App Service Environment:

1. In the Azure portal, on the **Overview** page for the **App Service Environment**, select **Delete**.

1. Confirm the delete action by entering the name of your App Service Environment, and select **OK**.

When you delete an App Service Environment, you also delete all content and resources within the environment.

:::image type="content" source="./media/using/delete-environment.png" alt-text="Screenshot that shows how to delete an App Service Environment in the Azure portal.":::

## Related content

- [Azure App Service on Linux pricing](https://azure.microsoft.com/pricing/details/app-service/)
- [Upgrade preference for App Service Environment planned maintenance](how-to-upgrade-preference.md)
- [Create alert rule using the Azure CLI, PowerShell, or ARM template](/azure/azure-monitor/alerts/alerts-create-rule-cli-powershell-arm)
