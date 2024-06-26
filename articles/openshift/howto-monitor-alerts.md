---
title: Configure Azure Resource Health alerts for Azure Red Hat OpenShift (ARO) clusters
description: Learn how to configure Azure Monitor alerts for Azure Red Hat OpenShift (ARO) clusters.
author: johnmarco
ms.author: johnmarc
ms.service: azure-redhat-openshift
keywords: openshift, red hat, monitor, cluster, alerts
ms.topic: how-to
ms.date: 05/20/2024
ms.custom: template-how-to
---

# Configure Azure Resource Health alerts for Azure Red Hat OpenShift (ARO) clusters

[Azure Resource Health](/azure/service-health/resource-health-overview?WT.mc_id=Portal-Microsoft_Azure_Health) is a component of Azure Monitor that can be configured to generate alerts based on signals from Azure Red Hat OpenShift clusters. These alerts help you prepare for events such as planned and unplanned maintenance.

Resource Health signals can generate one or more of the following alerts:

- **Cluster maintenance operation pending:** This signal indicates that your Azure Red Hat OpenShift cluster will undergo a maintenance operation within the next two weeks. This may cause rolling reboots of nodes resulting in workload pod restarts.
- **Cluster maintenance operation in progress:** This signal indicates one of the following operation types:
    - **Planned:** A planned maintenance operation has started on your Azure Red Hat OpenShift cluster. This may cause rolling reboots of nodes resulting in workload pod restarts.
    - **Unplanned:** An unplanned maintenance operation has started on your Azure Red Hat OpenShift cluster. This may cause rolling reboots of nodes resulting in workload pod restarts.

- **Action needed to complete maintenance operation:** This signal indicates that action is needed to complete an ongoing maintenance operation of your Azure Red Hat OpenShift cluster. Contact Azure Support to complete the ongoing maintenance operation of your Azure Red Hat OpenShift cluster. 

- **Cluster API server is unreachable:** This signal indicates that the Azure Red Hat OpenShift service Resource Provider is unable to reach your cluster's API server. Your cluster is hence unable to be monitored and is unmanageable. 

Once the underlying condition causing an alert is remediated, the alert is cleared and the Resource Health is reported as *Available*.

> [!NOTE]
> This feature is not currently available for Azure Government cloud.

## Creating alert rules

Configuring Resource Health alerts for an ARO cluster requires an alert rule. Alert rules define the conditions in which alert signals are generated.

1. In the [Azure portal](https://ms.portal.azure.com/), go to the ARO cluster for which you want to configure alerts.

1. Select **Resource health**, then select **Add resource health alert**.

    :::image type="content" source="media/howto-monitor-alerts/resource-health.png" alt-text="Screenshot showing Resource health window with Add resource health alert button highlighted.":::

1. Enter all applicable parameters for the alert rule in the various tabs of the window, including an **Alert rule name** in the **Details** tab.
  
1. Select **Review + Create**.

## Cluster alert notifications

When Azure Monitor detects a signal related to the cluster, it generates an alert. For detailed instructions on using and creating alert rules, see [What are Azure Monitor alerts?](/azure/azure-monitor/alerts/alerts-overview)

## View cluster alerts in Azure portal

You can view the status of the cluster at any time from the Azure portal. Go the applicable cluster in the portal and select **Resource health** to see if the cluster is available or unavailable and any events associated with it. For more information, see [Resource Health overview](/azure/service-health/resource-health-overview).

You can also view the alert rule you created for the cluster. Viewing the alert rule in the portal allows you to see any alerts fired against the rule.
