---
title: Configure Azure Resource Health alerts for Azure Red Hat OpenShift (ARO) clusters
description: Learn how to configure Azure Monitor alerts for Azure Red Hat OpenShift (ARO) clusters.
author: johnmarco
ms.author: johnmarc
ms.service: azure-redhat-openshift
keywords: openshift, red hat, monitor, cluster, alerts
ms.topic: how-to
ms.date: 01/22/2024
ms.custom: template-how-to
---

# Configure Azure Resource Health alerts for Azure Red Hat OpenShift (ARO) clusters

[Azure Resource Health](/azure/service-health/resource-health-overview?WT.mc_id=Portal-Microsoft_Azure_Health) is a component of Azure Monitor that can be configured to generate alerts based on signals from Azure Red Hat OpenShift clusters. These alerts help you prepare for such actions as planned maintenance operations and unplanned events that can disrupt workloads or make the cluster unreachable.

You can configure Resource Health alert signals for the following conditions:

- **Critical update pending:** This signal is enabled whenever the ARO service is ready with a critical fix for the ARO cluster, and that fix requires rolling reboots of nodes. The signal should provide more details of when the signal was enabled, and the time window within which the fix is likely to be rolled out to the cluster. 

- **Critical update completed:** This signal is enabled whenever the ARO service completes a critical fix for the ARO cluster. The signal should provide more details of when the fix rollout was started, when it was completed, and nodes/resources that were impacted. 

- **Upgrade available:** This signal is enabled whenever the ARO service is ready with a newer cluster software version as compared to the current version running on the cluster. The signal should provide more details of when the signal was enabled, and list the version(s) available for upgrade. 

- **Unsupported version:** This signal is enabled whenever the software version of an ARO cluster falls off the ARO supported versions list. The signal should provide more details of how the customer can remediate the situation (details like versions to which the customer can upgrade, and expected duration for which those versions may be supported). 

- **Cluster unreachable:** This signal is enabled whenever the ARO RP detects a failure to reach a customer cluster. 

> [!NOTE]
> In additional to the Resource Health signals described in this article, Azure Monitor also supports other log search and activity log signal types.
> 

Configuring Resource Health alerts for an ARO cluster requires an alert rule. Alert rules define the conditions in which alert signals are generated.

1. In the [Azure portal](https://ms.portal.azure.com/), go to the ARO cluster for which you want to configure alerts.

1. Select **Resource health**, then select **Add resource health alert**.

1. Enter all applicable parameters for the alert rule in the window, then select **Review + Create**.

For detailed instructions on using and creating alert rules, see [What are Azure Monitor alerts?](/azure/azure-monitor/alerts/alerts-overview)

## Cluster alert notifications

When Azure Monitor detects an alert on the cluster, a detailed email is sent describing the issue. The recipient(s) of this email are configured in ??

## View cluster alerts in Azure portal

You can view the status of the cluster at any time from the Azure portal. Simply go the applicable cluster in the portal and select **Resource health** to see if the cluster is available or unavailable and any events associated with it. For more information, see [Resource Health overview](/azure/service-health/resource-health-overview).

You can also view the alert rule you created for the cluster. Viewing the alert rule in the portal allows you to see any alerts fired against the rule.


