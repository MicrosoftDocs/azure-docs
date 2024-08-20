---
title: Set up remote write for Azure Monitor managed service for Prometheus
description: Learn how to set up remote write to send data from the default Prometheus server running in your Azure Red Hat OpenShift cluster to your Azure Monitor workspace.
author: johnmarco
ms.author: johnmarc
ms.service: azure-redhat-openshift
ms.topic: conceptual
ms.date: 01/02/2023
---

# Send data to an Azure Monitor workspace from your Prometheus server

Azure Red Hat OpenShift is preinstalled with a default Prometheus server. As detailed in the Azure Red Hat OpenShift [support policy](support-policies-v4.md), this default Prometheus server shouldn't be removed.

In some scenarios, you might want to centralize data from self-managed Prometheus clusters for long-term data retention to create a centralized view across your clusters. You can use Azure Monitor managed service for Prometheus to collect and analyze metrics at scale by using a Prometheus-compatible monitoring solution that's based on the [Prometheus](https://aka.ms/azureprometheus-promio) project from the Cloud Native Computing Foundation. You can use [remote write](https://prometheus.io/docs/operating/integrations/#remote-endpoints-and-storage) to send data from Prometheus servers in your cluster to the Azure managed service.

## Prerequisites

To send data from a Prometheus server by using remote write, you need:

- An [Azure Monitor workspace](../azure-monitor/essentials/azure-monitor-workspace-overview.md). If you don't already have a workspace, you must [create a new workspace](../azure-monitor/essentials/azure-monitor-workspace-manage.md#create-an-azure-monitor-workspace).

## Register an application with Microsoft Entra ID

1. Complete the steps to [register an application with Microsoft Entra ID](../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-azure-ad-and-create-a-service-principal) and create a service principal.

1. Copy the tenant ID and client ID of the service principal:

   1. In the [Microsoft Entra admin center](https://entra.microsoft.com), go to **Identity** > **Applications** > **App registrations**, and then select your application.
   1. Go to the **Overview** page for the app.
   1. Copy and retain the **Directory (tenant) ID** value.
   1. Copy and retain the **Application (client) ID** value.

1. Create a [new client secret](../active-directory/develop/howto-create-service-principal-portal.md#option-3-create-a-new-client-secret). Copy and retain the value of the secret.

1. In your application code, set the values of the tenant ID, client ID, and client secret that you copied:

   ```bash
   export TENANT_ID=<tenant-id>
   export CLIENT_ID=<client-id>
   export CLIENT_SECRET=<client-secret>
   ```

## Assign the Monitoring Metrics Publisher role to the application

The application must have the Monitoring Metrics Publisher role for the data collection rule that is associated with your Azure Monitor workspace.

1. In the Azure portal, go to the instance of Azure Monitor for your subscription.

1. On the resource menu, select **Data Collection Rules**.

1. Select the data collection rule that is associated with your Azure Monitor workspace.

1. On the **Overview** page for the data collection rule, select **Access control (IAM)**.

1. Select **Add**, and then select **Add role assignment**.

1. Select the **Monitoring Metrics Publisher** role, and then select **Next**.

1. Select **User, group, or service principal**, and then choose **Select members**. Select the application that you registered, and then choose **Select**.

1. To complete the role assignment, select **Review + assign**.

## Create a secret in your Azure Red Hat OpenShift cluster

To authenticate by using a remote write endpoint, you use the OAuth 2.0 authentication method from the [supported remote write authentication settings](https://docs.openshift.com/container-platform/4.11/monitoring/configuring-the-monitoring-stack.html#supported_remote_write_authentication_settings_configuring-the-monitoring-stack).

To begin, create a secret by using the client ID and client secret:

```yaml
cat << EOF | oc apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: oauth2-credentials
  namespace: openshift-monitoring
stringData:
  id: "${CLIENT_ID}"
  secret: "${CLIENT_SECRET}"
EOF
```
  
## Set up remote write

To [set up remote write](https://docs.openshift.com/container-platform/4.11/monitoring/configuring-the-monitoring-stack.html#configuring_remote_write_storage_configuring-the-monitoring-stack) for the default platform monitoring, update the *cluster-monitoring-config* config map YAML file in the openshift-monitoring namespace.

1. Open the config map file for editing:

   ```bash
    oc edit -n openshift-monitoring cm cluster-monitoring-config
    ```

    ```yaml
    data:
      config.yaml: |
        prometheusK8s:
          remoteWrite:
            - url: "<INGESTION-URL>"
              oauth2:
                clientId:
                  secret:
                    name: oauth2-credentials
                    key: id
                clientSecret:
                  name: oauth2-credentials
                  key: secret
                tokenUrl: "https://login.microsoftonline.com/<TENANT_ID>/oauth2/v2.0/token"
                scopes:
                  - "https://monitor.azure.com/.default"
    ```

1. Update the config map file:

   1. Replace `INGESTION-URL` in the config map file with the value for **Metrics ingestion endpoint** from the **Overview** page for the Azure Monitor workspace.

   1. Replace `TENANT_ID` in the config map file with the tenant ID of the service principal.

## Visualize metrics by using Azure Managed Grafana

You can use community Grafana dashboards to visualize the captured metrics, or you can create contextual dashboards.

1. Create an [Azure Managed Grafana workspace](../managed-grafana/quickstart-managed-grafana-portal.md).

1. [Link the Azure Managed Grafana workspace](../azure-monitor/essentials/azure-monitor-workspace-manage.md?tabs=azure-portal#link-a-grafana-workspace) to your Azure Monitor workspace.

1. [Import](../managed-grafana/how-to-create-dashboard.md?tabs=azure-portal#import-a-grafana-dashboard) the community Grafana dashboard [Openshift/K8 Cluster Overview](https://grafana.com/grafana/dashboards/3870-openshift-k8-cluster-overview/) (ID 3870)  to the Grafana workspace.

1. For the data source, use your Azure Monitor workspace.

1. Save the dashboard.

To access the dashboard, in your Azure Managed Grafana workspace, go to **Home** > **Dashboards**, and then select the dashboard.

## Troubleshoot

For troubleshooting information, see [Azure Monitor managed service for Prometheus remote write](../azure-monitor/containers/prometheus-remote-write-troubleshooting.md#ingestion-quotas-and-limits).

## Related content

- [Learn more about Azure Monitor managed service for Prometheus](../azure-monitor/essentials/prometheus-metrics-overview.md)
