---
title: Monitor GitOps (Flux v2) status and activity
ms.date: 08/17/2023
ms.topic: how-to
description: Learn how to monitor status, compliance, resource consumption, and reconciliation activity for GitOps with Flux v2.
---

# Monitor GitOps (Flux v2) status and activity

We provide dashboards to help you monitor status, compliance, resource consumption, and reconciliation activity for GitOps with Flux v2 in your Azure Arc-enabled Kubernetes clusters or Azure Kubernetes Service (AKS) clusters. These JSON dashboards can be imported to Grafana to help you view and analyze your data in real time. You can also set up alerts for this information.

## Prerequisites

To import and use these dashboards, you need:

- One or more existing Arc-enabled Kubernetes clusters or AKS clusters.
- The [microsoft.flux extension](extensions-release.md#flux-gitops) installed on the clusters.
- At least one [Flux configuration](tutorial-use-gitops-flux2.md) created on the clusters.

## Monitor deployment and compliance status

Follow these steps to import dashboards that let you monitor Flux extension deployment and status across clusters, and the compliance status of Flux configuration on those clusters.

> [!NOTE]
> These steps describe the process for importing the dashboard to [Azure Managed Grafana](/azure/managed-grafana/overview). You can also [import this dashboard to any Grafana instance](https://grafana.com/docs/grafana/latest/dashboards/manage-dashboards/#import-a-dashboard). With this option, a service principal must be used; managed identity is not supported for data connection outside of Azure Managed Grafana.

1. Create an Azure Managed Grafana instance by using the [Azure portal](/azure/managed-grafana/quickstart-managed-grafana-portal) or [Azure CLI](/azure/managed-grafana/quickstart-managed-grafana-cli). Ensure that you're able to access Grafana by selecting its endpoint on the Overview page. You need at least **Grafana Editor** level permissions to view and edit dashboards. You can check your access by going to **Access control (IAM)** on the Grafana instance.  
1. If you're using a managed identity for the Azure Managed Grafana instance, follow these steps to assign it the **Monitoring Reader** role on the subscription(s):

   1. In the Azure portal, navigate to the subscription that you want to add.
   1. Select **Access control (IAM)**.
   1. Select **Add role assignment**.
   1. Select the **Monitoring Reader** role, then select **Next**.
   1. On the **Members** tab, select **Managed identity**, then choose **Select members**.
   1. From the **Managed identity** list, select the subscription where you created your Azure Managed Grafana Instance. Then select **Azure Managed Grafana** and the name of your Azure Managed Grafana instance.
   1. Select **Review + Assign**.

   If you're using a service principal, grant the **Monitoring Reader** role to the service principal that you'll use for your data source connection. Follow these same steps, but select **User, group, or service principal** in the **Members** tab, then select your service principal. (If you aren't using Azure Managed Grafana, you must use a service principal for data connection access.)

1. [Create the Azure Monitor Data Source connection](https://grafana.com/docs/grafana/latest/datasources/azure-monitor/) in your Azure Managed Grafana instance. This connection lets the dashboard access Azure Resource Graph data.
1. Download the [GitOps Flux - Application Deployments Dashboard](https://github.com/Azure/fluxv2-grafana-dashboards/blob/main/dashboards/GitOps%20Flux%20-%20Application%20Deployments%20Dashboard.json).
1. Follow the steps to [import the JSON dashboard to Grafana](/azure/managed-grafana/how-to-create-dashboard#import-a-json-dashboard).

After you have imported the dashboard, it will display information from the clusters that you're monitoring, with several panels that provide details. For more details on an item, select the link to visit the Azure portal, where you can find more information about configurations, errors and logs.

:::image type="content" source="media/monitor-gitops-flux2/flux-application-deployments-dashboard.png" alt-text="Screenshot of the Flux Application Deployments Dashboard." lightbox="media/monitor-gitops-flux2/flux-application-deployments-dashboard.png":::

The **Flux Extension Deployment Status** table lists all clusters where the Flux extension is deployed, along with current deployment status.

:::image type="content" source="media/monitor-gitops-flux2/flux-extension-deployments-status.png" alt-text="Screenshot showing the Flux Extension Deployments Status table in the Application Deployments dashboard." lightbox="media/monitor-gitops-flux2/flux-extension-deployments-status.png":::

The **Flux Configuration Compliance Status** table lists all Flux configurations created on the clusters, along with their compliance status. To see status and error logs for configuration objects such as Helm releases and kustomizations, select the **Non-Compliant** link from the **ComplianceState** column.

:::image type="content" source="media/monitor-gitops-flux2/flux-configuration-compliance.png" alt-text="Screenshot showing the Flux Configuration Compliance Status table in the Application Deployments dashboard." lightbox="media/monitor-gitops-flux2/flux-configuration-compliance.png":::

The **Count of Flux Extension Deployments by Status** chart shows the count of clusters, based on their provisioning state.

:::image type="content" source="media/monitor-gitops-flux2/flux-deployments-by-status.png" alt-text="Screenshot of the Flux Extension Deployments by Status pie chart in the Application Deployments dashboard.":::

The **Count of Flux Configurations by Compliance Status** chart shows the count of Flux configurations, based on their compliance status with respect to the source repository.

:::image type="content" source="media/monitor-gitops-flux2/flux-configurations-by-status.png" alt-text="Screenshot of the Flux Configuration by Compliance Status chart on the Application Deployments dashboard.":::

### Filter dashboard data to track application deployments

You can filter data in the **GitOps Flux - Application Deployments Dashboard** to change the information shown. For example, you can show data for only certain subscriptions or resource groups, or limit data to a particular cluster. To do so, select the filter option either from the top level dropdowns or from any column header in the tables.

For example, in the **Flux Configuration Compliance Status** table, you can select a specific commit from the **SourceLastSyncCommit** column. By doing so, you can track the status of a configuration deployment to all of the clusters affected by that commit.

### Create alerts for extension and configuration failures

After you've imported the dashboard as described in the previous section, you can set up alerts. These alerts notify you when Flux extensions or Flux configurations experience failures.

Follow the steps below to create an alert. Example queries are provided to detect extension provisioning or extension upgrade failures, or to detect compliance state failures.

1. In the left navigation menu of the dashboard, select **Alerting**.
1. Select **Alert rules**.
1. Select **+ Create alert rule**. The new alert rule page opens, with the **Grafana managed alerts** option selected by default.
1. In **Rule name**, add a descriptive name. This name is displayed in the alert rule list, and it will be the used as the `alertname` label for every alert instance created from this rule.
1. Under **Set a query and alert condition**:

   - Select a data source. The same data source used for the dashboard may be used here.
   - For **Service**, select **Azure Resource Graph**.
   - Select the subscriptions from the dropdown list.
   - Enter the query you want to use. For example, for extension provisioning or upgrade failures, you can enter this query:

      ```kusto
      kubernetesconfigurationresources
      | where type == "microsoft.kubernetesconfiguration/extensions"
      | extend provisioningState = tostring(properties.ProvisioningState)
      | where provisioningState == "Failed"
      | summarize count() by provisioningState
      ```

      Or for compliance state failures, you can enter this query: 

      ```kusto
      kubernetesconfigurationresources
      | where type == "microsoft.kubernetesconfiguration/fluxconfigurations"
      | extend complianceState=tostring(properties.complianceState)
      | where complianceState == "Non-Compliant"
      | summarize count() by complianceState
      ```

   - For **Threshold box**, select **A** for input type and set the threshold to **0** to receive alerts even if just one extension fails on the cluster. Mark this as the **Alert condition**.

   :::image type="content" source="media/monitor-gitops-flux2/application-dashboard-set-alerts.png" alt-text="Screenshot showing the alert creation process." lightbox="media/monitor-gitops-flux2/application-dashboard-set-alerts.png":::

1. Specify the alert evaluation interval:

   - For **Condition**, select the query or expression to trigger the alert rule.
   - For **Evaluate every**, enter the evaluation frequency as a multiple of 10 seconds.
   - For **Evaluate for**, specify how long the condition must be true before the alert is created.
   - In **Configure no data and error handling**, indicate what should happen when the alert rule returns no data or returns an error.
   - To check the results from running the query, select **Preview**.

1. Add the storage location, rule group, and any additional metadata that you want to associate with the rule.

   - For **Folder**, select the folder where the rule should be stored.
   - For **Group**, specify a predefined group.
   - If desired, add a description and summary to customize alert messages.
   - Add Runbook URL, panel, dashboard, and alert IDs as needed.

1. If desired, add any custom labels. Then select **Save**.

You can also [configure contact points](https://grafana.com/docs/grafana/latest/alerting/alerting-rules/manage-contact-points/) and [configure notification policies](https://grafana.com/docs/grafana/latest/alerting/alerting-rules/create-notification-policy/) for your alerts.

## Monitor resource consumption and reconciliations

Follow these steps to import dashboards that let you monitor Flux resource consumption, reconciliations, API requests, and reconciler status.

1. Follow the steps to [create an Azure Monitor Workspace](/azure/azure-monitor/essentials/azure-monitor-workspace-manage).
1. Create an Azure Managed Grafana instance by using the [Azure portal](/azure/managed-grafana/quickstart-managed-grafana-portal) or [Azure CLI](/azure/managed-grafana/quickstart-managed-grafana-cli).
1. Enable Prometheus metrics collection on the [AKS clusters](/azure/azure-monitor/containers/prometheus-metrics-enable) and/or [Arc-enabled Kubernetes clusters](/azure/azure-monitor/essentials/prometheus-metrics-from-arc-enabled-cluster) that you want to monitor.
1. Configure Azure Monitor Agent to scrape the Azure Managed Flux metrics by creating a [configmap](/azure/azure-monitor/essentials/prometheus-metrics-scrape-configuration):

   ```yaml
   kind: ConfigMap
   apiVersion: v1
   data:
     schema-version:
         #string.used by agent to parse config. supported versions are {v1}. Configs with other schema versions will be rejected by the agent.
       v1
     config-version:
       #string.used by customer to keep track of this config file's version in their source control/repository (max allowed 10 chars, other chars will be truncated)
       ver1
     default-scrape-settings-enabled: |-
       kubelet = true
       coredns = false
       cadvisor = true
       kubeproxy = false
       apiserver = false
       kubestate = true
       nodeexporter = true
       windowsexporter = false
       windowskubeproxy = false
       kappiebasic = true
       prometheuscollectorhealth = false
     # Regex for which namespaces to scrape through pod annotation based scraping.
     # This is none by default. Use '.*' to scrape all namespaces of annotated pods.
     pod-annotation-based-scraping: |-
       podannotationnamespaceregex = "flux-system"
     default-targets-scrape-interval-settings: |-
       kubelet = "30s"
       coredns = "30s"
       cadvisor = "30s"
       kubeproxy = "30s"
       apiserver = "30s"
       kubestate = "30s"
       nodeexporter = "30s"
       windowsexporter = "30s"
       windowskubeproxy = "30s"
       kappiebasic = "30s"
       prometheuscollectorhealth = "30s"
       podannotations = "30s"
   metadata:
     name: ama-metrics-settings-configmap
     namespace: kube-system
   ```
  
1. Download the [Flux Control Plane](https://github.com/Azure/fluxv2-grafana-dashboards/blob/main/dashboards/Flux%20Control%20Plane.json) and [Flux Cluster Stats](https://github.com/Azure/fluxv2-grafana-dashboards/blob/main/dashboards/Flux%20Cluster%20Stats.json) dashboards.
1. [Link the Managed Prometheus workspace to the Managed Grafana instance](/azure/azure-monitor/essentials/azure-monitor-workspace-manage#link-a-grafana-workspace). This takes a few minutes to complete.
1. Follow the steps to [import these JSON dashboards to Grafana](/azure/managed-grafana/how-to-create-dashboard#import-a-json-dashboard).

After you have imported the dashboards, they'll display information from the clusters that you're monitoring. To show information only for a particular cluster or namespace, use the filters near the top of each dashboard.

The **Flux Control Plane** dashboard shows details about status resource consumption, reconciliations at the cluster level, and Kubernetes API requests.

:::image type="content" source="media/monitor-gitops-flux2/flux-control-plane-dashboard.png" alt-text="Screenshot of the Flux Control Plane dashboard." lightbox="media/monitor-gitops-flux2/flux-control-plane-dashboard.png":::

The **Flux Cluster Stats** dashboard shows details about the number of reconcilers, along with the status and execution duration of each reconciler.

:::image type="content" source="media/monitor-gitops-flux2/flux-cluster-stats-dashboard.png" alt-text="Screenshot of the Flux Cluster Stats dashboard." lightbox="media/monitor-gitops-flux2/flux-cluster-stats-dashboard.png":::

### Create alerts for resource consumption and reconciliation issues

After you've imported the dashboard as described in the previous section, you can set up alerts. These alerts notify you of resource consumption and reconciliation issues that may require attention.

To enable these alerts, you deploy a Bicep template similar to the one shown here. The alert rules in this template are samples that can be modified as needed.

Once you've downloaded the Bicep template and made your changes, [follow these steps to deploy the template](/azure/azure-resource-manager/bicep/template-specs).

```bicep
param azureMonitorWorkspaceName string
param alertReceiverEmailAddress string

param kustomizationLookbackPeriodInMinutes int = 5
param helmReleaseLookbackPeriodInMinutes int = 5
param gitRepositoryLookbackPeriodInMinutes int = 5
param bucketLookbackPeriodInMinutes int = 5
param helmRepoLookbackPeriodInMinutes int = 5
param timeToResolveAlerts string = 'PT10M'
param location string = resourceGroup().location

resource azureMonitorWorkspace 'Microsoft.Monitor/accounts@2023-04-03' = {
  name: azureMonitorWorkspaceName
  location: location
}

resource fluxRuleActionGroup 'Microsoft.Insights/actionGroups@2023-01-01' = {
  name: 'fluxRuleActionGroup'
  location: 'global'
  properties: {
    enabled: true
    groupShortName: 'fluxGroup'
    emailReceivers: [
      {
        name: 'emailReceiver'
        emailAddress: alertReceiverEmailAddress
      }
    ]
  }
}

resource fluxRuleGroup 'Microsoft.AlertsManagement/prometheusRuleGroups@2023-03-01' = {
  name: 'fluxRuleGroup'
  location: location
  properties: {
    description: 'Flux Prometheus Rule Group'
    scopes: [
      azureMonitorWorkspace.id
    ]
    enabled: true
    interval: 'PT1M'
    rules: [
      {
        alert: 'KustomizationNotReady'
        expression: 'sum by (cluster, namespace, name) (gotk_reconcile_condition{type="Ready", status="False", kind="Kustomization"}) > 0'
        for: 'PT${kustomizationLookbackPeriodInMinutes}M'
        labels: {
          description: 'Kustomization reconciliation failing for last ${kustomizationLookbackPeriodInMinutes} minutes.'
        }
        annotations: {
          description: 'Kustomization reconciliation failing for last ${kustomizationLookbackPeriodInMinutes} minutes.'
        }
        enabled: true
        severity: 3
        resolveConfiguration: {
          autoResolved: true
          timeToResolve: timeToResolveAlerts
        }
        actions: [
          {
            actionGroupId: fluxRuleActionGroup.id
          }
        ]
      }
      {
        alert: 'HelmReleaseNotReady'
        expression: 'sum by (cluster, namespace, name) (gotk_reconcile_condition{type="Ready", status="False", kind="HelmRelease"}) > 0'
        for: 'PT${helmReleaseLookbackPeriodInMinutes}M'
        labels: {
          description: 'HelmRelease reconciliation failing for last ${helmReleaseLookbackPeriodInMinutes} minutes.'
        }
        annotations: {
          description: 'HelmRelease reconciliation failing for last ${helmReleaseLookbackPeriodInMinutes} minutes.'
        }
        enabled: true
        severity: 3
        resolveConfiguration: {
          autoResolved: true
          timeToResolve: timeToResolveAlerts
        }
        actions: [
          {
            actionGroupId: fluxRuleActionGroup.id
          }
        ]
      }
      {
        alert: 'GitRepositoryNotReady'
        expression: 'sum by (cluster, namespace, name) (gotk_reconcile_condition{type="Ready", status="False", kind="GitRepository"}) > 0'
        for: 'PT${gitRepositoryLookbackPeriodInMinutes}M'
        labels: {
          description: 'GitRepository reconciliation failing for last ${gitRepositoryLookbackPeriodInMinutes} minutes.'
        }
        annotations: {
          description: 'GitRepository reconciliation failing for last ${gitRepositoryLookbackPeriodInMinutes} minutes.'
        }
        enabled: true
        severity: 3
        resolveConfiguration: {
          autoResolved: true
          timeToResolve: timeToResolveAlerts
        }
        actions: [
          {
            actionGroupId: fluxRuleActionGroup.id
          }
        ]
      }
      {
        alert: 'BucketNotReady'
        expression: 'sum by (cluster, namespace, name) (gotk_reconcile_condition{type="Ready", status="False", kind="Bucket"}) > 0'
        for: 'PT${bucketLookbackPeriodInMinutes}M'
        labels: {
          description: 'Bucket reconciliation failing for last ${bucketLookbackPeriodInMinutes} minutes.'
        }
        annotations: {
          description: 'Bucket reconciliation failing for last ${bucketLookbackPeriodInMinutes} minutes.'
        }
        enabled: true
        severity: 3
        resolveConfiguration: {
          autoResolved: true
          timeToResolve: timeToResolveAlerts
        }
        actions: [
          {
            actionGroupId: fluxRuleActionGroup.id
          }
        ]
      }
      {
        alert: 'HelmRepositoryNotReady'
        expression: 'sum by (cluster, namespace, name) (gotk_reconcile_condition{type="Ready", status="False", kind="HelmRepository"}) > 0'
        for: 'PT${helmRepoLookbackPeriodInMinutes}M'
        labels: {
          description: 'HelmRepository reconciliation failing for last ${helmRepoLookbackPeriodInMinutes} minutes.'
        }
        annotations: {
          description: 'HelmRepository reconciliation failing for last ${helmRepoLookbackPeriodInMinutes} minutes.'
        }
        enabled: true
        severity: 3
        resolveConfiguration: {
          autoResolved: true
          timeToResolve: timeToResolveAlerts
        }
        actions: [
          {
            actionGroupId: fluxRuleActionGroup.id
          }
        ]
      }
    ]
  }
}

```


## Next steps

- Review our tutorial on [using GitOps with Flux v2 to manage configuration and application deployment](tutorial-use-gitops-flux2.md).
- Learn about [Azure Monitor Container Insights](../../azure-monitor/containers/container-insights-enable-arc-enabled-clusters.md?toc=/azure/azure-arc/kubernetes/toc.json&bc=/azure/azure-arc/kubernetes/breadcrumb/toc.json).
