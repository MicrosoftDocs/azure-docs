---
title: Manage an Dynatrace integration with Azure - Azure partner solutions
description: This article describes management of Dynatrace on the Azure portal. 
ms.topic: conceptual
ms.service: partner-services
ms.collection: na
author: flang-msft
ms.author: franlanglois
ms.date: 05/12/2022


---

# Manage the Dynatrace integration with Azure

This article describes how to manage the settings for your Azure integration with Dynatrace.

**Resource overview**

To see the details of your Dynatrace resource, select **Overview** in the left pane.

\$TODO: overview screenshot

The details include:

- Resource group name

- Region

- Subscription

- Tags

- Single sign-on link to Dynatrace environment

- Dynatrace billing plan

- Billing term

**Get started tab** also provides links to Dynatrace dashboards, logs and Smartscape Topology.

**Monitoring tab** provides a summary of the resources sending logs to Dynatrace.

\$TODO: Monitoring screenshot

- Resource type -- Azure resource type

- Total resources -- Count of all resources for the resource type

- Logs to Dynatrace -- Count of resources sending logs to Dynatrace through the integration.

**Reconfigure rules for logs**

To change the configuration rules for logs, select Metrics and logs in the left pane.

\$TODO: Metrics and logs screenshot for resource.

For more information, see [Configure metrics and logs](#create-new-dynatrace-environment).

**View monitored resources**

To see the list of resources emitting logs to Dynatrace, select Monitored Resources in the left pane.

\$TODO: Monitored resources screenshot.

You can filter the list of resources by resource type, resource group name, region and whether the resource is sending logs.

The column **Logs to Dynatrace** indicates whether the resource is sending logs to Dyntrace. If the resource is not sending logs, this field indicates why logs are not being sent. The reasons could be:

- Resource doesn't support sending logs. Only resource types with monitoring log categories can be configured to send logs. See [supported categories](https://docs.microsoft.com/en-us/azure/azure-monitor/essentials/resource-logs-categories).

- Limit of five diagnostic settings reached. Each Azure resource can have a maximum of five diagnostic settings. For more information, see [diagnostic settings](https://docs.microsoft.com/en-us/azure/azure-monitor/essentials/diagnostic-settings).

- Error -- The resource is configured to send logs to Dynatrace, but is blocked by an error.

- Logs not configured -- Only Azure resources that have the appropriate resource tags are configured to send logs to Dynatrace.

- Agent not configured. Virtual machines without the Dynatrace OneAgent installed doesn't emit logs to Dynatrace.

**Monitor virtual machines using Dynatrace OneAgent**

You can install Dynatrace OneAgent on virtual machines as an extension. Go to **Virtual machine agent** under **Dynatrace environment config** in the left pane. This screen shows the list of all virtual machines in the subscription.

For each virtual machine, the following info is displayed:

- Resource Name -- Virtual machine name

- Resource Status -- Whether the virtual machine is stopped or > running. Dynatrace OneAgent can only be installed on virtual > machines that are running. If the virtual machine is stopped, > installing the Dynatrace OneAgent will be disabled.

- Agent status -- Whether the Dynatrace OneAgent is running on the > virtual machine.

- Agent version -- The Dynatrace OneAgent version number.

- Auto-update -- Whether auto-update has been enabled for the > OneAgent.

- Log analytics -- Whether log monitoring option was selected when > OneAgent was installed.

- Monitoring mode -- Whether the Dynatrace OneAgent is monitoring > hosts in [[full-stack monitoring mode or infrastructure monitoring > mode]{.underline}](https://www.dynatrace.com/support/help/how-to-use-dynatrace/hosts/basic-concepts/get-started-with-infrastructure-monitoring).

Important note: If a virtual machine shows that an agent has been configured, but the options to manage the agent through extension are disabled, it means that the agent has been configured through a different Dynatrace resource in the same Azure subscription.

**Monitor App Services using Dynatrace OneAgent**

You can install Dynatrace OneAgent on App Services as an extension. Go to **App Service extension** in the left pane. This screen shows the list of all App Services in the subscription.

For each app service, the following information is displayed:

- Resource name -- App service name

- Resource status -- Whether the App service is running or stopped. Dynatrace OneAgent can only be installed on app services that are running.

- App Service plan -- The plan configured for the app service.

- Agent version -- The Dynatrace OneAgent version.

- Agent status -- status of the agent.

To install the Dynatrace OneAgent, select the app service and click **Install Extension.** The application settings for the selected app service is updated and the app service is restarted to complete the configuration of the Dynatrace OneAgent.

**Important note**: App Service extensions are currently supported only for App Services that are running on Windows OS. App Services using the Linux OS are not shown in the list.

**Important note:** This screen currently only shows App Services of type Web App. Managing agents for Function apps is not supported at this time.

**Reconfigure single sign-on**

If you would like to reconfigure single sign-on, select Single sign-on in the left pane.

If single sign-on was already configured, you can disable it.

To establish single sign-on or change the application, select **Enable single sign-on through Azure Active Directory**. The portal retrieves Dynatrace application from Azure Active Directory. The app comes from the enterprise app name selected during the [pre-configuration steps](#configure-pre-deployment).

**Delete Dynatrace resource**

Go to **overview** in left pane and select **Delete**. Confirm that you want to delete Dynatrace resource. Select **Delete**.

\$TODO: Screenshot of delete.

If only one Dynatrace resource is mapped to a Dynatrace environment, logs are no longer sent to Dynatrace. All billing through Azure Marketplace stops for Dynatrace.

If more than one Dynatrace resource is mapped to the Dynatrace environment using the link Azure subscription option, deleting the Dynatrace resource only stops sending logs for that Dynatrace resource. However, since other Dynatrace environment may be linked to other Dynatrace resources, billing continues through the Azure Marketplace.

## Next steps

For help with troubleshooting, see [Troubleshooting Dynatrace integration with Azure](dynatrace-troubleshoot.md).
