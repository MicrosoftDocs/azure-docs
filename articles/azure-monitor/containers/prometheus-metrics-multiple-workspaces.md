---
title: Send Prometheus metrics to multiple Azure Monitor workspaces
description: Describes data collection rules required to send Prometheus metrics from a cluster in Azure Monitor to multiple Azure Monitor workspaces.
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 09/28/2022
ms.reviewer: aul
---

# Send Prometheus metrics to multiple Azure Monitor workspaces

Routing metrics to more Azure Monitor workspaces can be done through the creation of additional data collection rules. All metrics can be sent to all workspaces or different metrics can be sent to different workspaces.

## Send same metrics to multiple Azure Monitor workspaces

You can create multiple Data Collection Rules that point to the same Data Collection Endpoint for metrics to be sent to additional Azure Monitor workspaces from the same Kubernetes cluster. In case you have a very high volume of metrics, a new Data Collection Endpoint can be created as well. Please refer to the service limits [document](../service-limits.md) regarding ingestion limits. Currently, this is only available through onboarding through Resource Manager templates. You can follow the [regular onboarding process](prometheus-metrics-enable.md) and then edit the same Resource Manager templates to add additional DCRs and DCEs (if applicable) for your additional Azure Monitor workspaces. You'll need to edit the template to add an additional parameters for every additional Azure Monitor workspace, add another DCR for every additional Azure Monitor workspace, add another DCE (if applicable), add the Monitor Reader Role for the new Azure Monitor workspace and add an additional Azure Monitor workspace integration for Grafana.

- Add the following parameters:
  ```json
  "parameters": {
    "azureMonitorWorkspaceResourceId2": {
      "type": "string"
    },
    "azureMonitorWorkspaceLocation2": {
      "type": "string",
      "defaultValue": "",
      "allowedValues": [
        "eastus2euap",
        "centraluseuap",
        "centralus",
        "eastus",
        "eastus2",
        "northeurope",
        "southcentralus",
        "southeastasia",
        "uksouth",
        "westeurope",
        "westus",
        "westus2"
      ]
    },
  ...
  }
  ```

- For high metric volume, add an additional Data Collection Endpoint. You *must* replace `<dceName>`:
  ```json
    {
      "type": "Microsoft.Insights/dataCollectionEndpoints",
      "apiVersion": "2021-09-01-preview",
      "name": "[variables('dceName')]",
      "location": "[parameters('azureMonitorWorkspaceLocation2')]",
      "kind": "Linux",
      "properties": {}
    }
  ```
- Add an additional DCR with the same or a different Data Collection Endpoint. You *must* replace `<dcrName>`:
  ```json
  {
    "type": "Microsoft.Insights/dataCollectionRules",
    "apiVersion": "2021-09-01-preview",
    "name": "<dcrName>",
    "location": "[parameters('azureMonitorWorkspaceLocation2')]",
    "kind": "Linux",
    "properties": {
      "dataCollectionEndpointId": "[resourceId('Microsoft.Insights/dataCollectionEndpoints/', variables('dceName'))]",
      "dataFlows": [
        {
          "destinations": ["MonitoringAccount2"],
          "streams": ["Microsoft-PrometheusMetrics"]
        }
      ],
      "dataSources": {
        "prometheusForwarder": [
          {
            "name": "PrometheusDataSource",
            "streams": ["Microsoft-PrometheusMetrics"],
            "labelIncludeFilter": {}
          }
        ]
      },
      "description": "DCR for Azure Monitor Metrics Profile (Managed Prometheus)",
      "destinations": {
        "monitoringAccounts": [
          {
            "accountResourceId": "[parameters('azureMonitorWorkspaceResourceId2')]",
            "name": "MonitoringAccount2"
          }
        ]
      }
    },
    "dependsOn": [
      "[resourceId('Microsoft.Insights/dataCollectionEndpoints/', variables('dceName'))]"
    ]
  }
  ```

- Add an additional DCRA with the relevant Data Collection Rule. You *must* replace `<dcraName>`:
     ```json
    {
      "type": "Microsoft.Resources/deployments",
      "name": "<dcraName>",
      "apiVersion": "2017-05-10",
      "subscriptionId": "[variables('clusterSubscriptionId')]",
      "resourceGroup": "[variables('clusterResourceGroup')]",
      "dependsOn": [
        "[resourceId('Microsoft.Insights/dataCollectionEndpoints/', variables('dceName'))]",
        "[resourceId('Microsoft.Insights/dataCollectionRules', variables('dcrName'))]"
      ],
      "properties": {
        "mode": "Incremental",
        "template": {
          "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
          "contentVersion": "1.0.0.0",
          "parameters": {},
          "variables": {},
          "resources": [
            {
              "type": "Microsoft.ContainerService/managedClusters/providers/dataCollectionRuleAssociations",
              "name": "[concat(variables('clusterName'),'/microsoft.insights/', variables('dcraName'))]",
              "apiVersion": "2021-09-01-preview",
              "location": "[parameters('clusterLocation')]",
              "properties": {
                "description": "Association of data collection rule. Deleting this association will break the data collection for this AKS Cluster.",
                "dataCollectionRuleId": "[resourceId('Microsoft.Insights/dataCollectionRules', variables('dcrName'))]"
              }
            }
          ]
        },
        "parameters": {}
      }
    }
    ```
- Add an additional Grafana integration:
  ```json
  {
        "type": "Microsoft.Dashboard/grafana",
        "apiVersion": "2022-08-01",
        "name": "[split(parameters('grafanaResourceId'),'/')[8]]",
        "sku": {
          "name": "[parameters('grafanaSku')]"
        },
        "location": "[parameters('grafanaLocation')]",
        "properties": {
          "grafanaIntegrations": {
            "azureMonitorWorkspaceIntegrations": [
              // Existing azureMonitorWorkspaceIntegrations values (if any)
              // {
              //   "azureMonitorWorkspaceResourceId": "<value>"
              // },
              // {
              //   "azureMonitorWorkspaceResourceId": "<value>"
              // },
              {
                "azureMonitorWorkspaceResourceId": "[parameters('azureMonitorWorkspaceResourceId')]"
              },
              {
                "azureMonitorWorkspaceResourceId": "[parameters('azureMonitorWorkspaceResourceId2')]"
              }
            ]
          }
        }
      }
  ```
  - Assign `Monitoring Data Reader` role to read data from the new Azure Monitor Workspace:

  ```json
  {
    "type": "Microsoft.Authorization/roleAssignments",
    "apiVersion": "2022-04-01",
    "name": "[parameters('roleNameGuid')]",
    "scope": "[parameters('azureMonitorWorkspaceResourceId2')]",
    "properties": {
        "roleDefinitionId": "[concat('/subscriptions/', variables('clusterSubscriptionId'), '/providers/Microsoft.Authorization/roleDefinitions/', 'b0d8363b-8ddd-447d-831f-62ca05bff136')]",
        "principalId": "[reference(resourceId('Microsoft.Dashboard/grafana', split(parameters('grafanaResourceId'),'/')[8]), '2022-08-01', 'Full').identity.principalId]"
    }
  }

  ```
## Send different metrics to different Azure Monitor workspaces

If you want to send some metrics to one Azure Monitor workspace and other metrics to a different one, follow the above steps to add additional DCRs. The value of `microsoft_metrics_include_label` under the `labelIncludeFilter` in the DCR is the identifier for the workspace. To then configure which metrics are routed to which workspace, you can add an extra pre-defined label, `microsoft_metrics_account` to the metrics. The value should be the same as the corresponding `microsoft_metrics_include_label` in the DCR for that workspace. To add the label to the metrics, you can utilize `relabel_configs` in your scrape config. To send all metrics from one job to a certain workspace, add the following relabel config:

```yaml
relabel_configs:
- source_labels: [__address__]
  target_label: microsoft_metrics_account
  action: replace
  replacement: "MonitoringAccountLabel1"
```

The source label is `__address__` because this label will always exist so this relabel config will always be applied. The target label will always be `microsoft_metrics_account` and its value should be replaced with the corresponding label value for the workspace.


### Example

If you want to configure three different jobs to send the metrics to three different workspaces, then include the following in each data collection rule:

```json
"labelIncludeFilter": {
  "microsoft_metrics_include_label": "MonitoringAccountLabel1"
}
```

```json
"labelIncludeFilter": {
  "microsoft_metrics_include_label": "MonitoringAccountLabel2"
}
```

```json
"labelIncludeFilter": {
  "microsoft_metrics_include_label": "MonitoringAccountLabel3"
}
```

Then in your scrape config, include the same label value for each:
```yaml
scrape_configs:
- job_name: prometheus_ref_app_1
  kubernetes_sd_configs:
    - role: pod
  relabel_configs:
    - source_labels: [__meta_kubernetes_pod_label_app]
      action: keep
      regex: "prometheus-reference-app-1"
    - source_labels: [__address__]
      target_label: microsoft_metrics_account
      action: replace
      replacement: "MonitoringAccountLabel1"
- job_name: prometheus_ref_app_2
  kubernetes_sd_configs:
    - role: pod
  relabel_configs:
    - source_labels: [__meta_kubernetes_pod_label_app]
      action: keep
      regex: "prometheus-reference-app-2"
    - source_labels: [__address__]
      target_label: microsoft_metrics_account
      action: replace
      replacement: "MonitoringAccountLabel2"
- job_name: prometheus_ref_app_3
  kubernetes_sd_configs:
    - role: pod
  relabel_configs:
    - source_labels: [__meta_kubernetes_pod_label_app]
      action: keep
      regex: "prometheus-reference-app-3"
    - source_labels: [__address__]
      target_label: microsoft_metrics_account
      action: replace
      replacement: "MonitoringAccountLabel3"
```


## Next steps

- [Learn more about Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md).
- [Collect Prometheus metrics from AKS cluster](prometheus-metrics-enable.md).
