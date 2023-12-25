---
title: Remote write to Azure Monitor Managed Service
description: Describes how to configure remote write to send data from the default Prometheus server running in your ARO cluster
author: srpadala 
ms.topic: conceptual
ms.date: 09/21/2023
---
# Configure remote write to send data to Azure Monitor Workspace from the default Prometheus server in your Azure Red Hat OpenShift (ARO) cluster

Azure Red Hat OpenShift comes preinstalled with a default Prometheus server that shouldn't be removed as per the [support policy](support-policies-v4.md). There are scenarios where there's a need to centralize data from self-managed Prometheus clusters for long-term data retention and to create a centralized view across your clusters. Azure Monitor managed service for Prometheus allows you to collect and analyze metrics at scale using a Prometheus-compatible monitoring solution, based on the [Prometheus](https://aka.ms/azureprometheus-promio) project from the Cloud Native Computing Foundation.  you can use [remote_write](https://prometheus.io/docs/operating/integrations/#remote-endpoints-and-storage) to send data from the in-cluster Prometheus servers into the Azure managed service.

## Prerequisites
- Data for Azure Monitor managed service for Prometheus is stored in an [Azure Monitor workspace](../azure-monitor/essentials/azure-monitor-workspace-overview.md). You must [create a new workspace](../azure-monitor/essentials/azure-monitor-workspace-manage.md#create-an-azure-monitor-workspace) if you don't already have one.

## Create Microsoft Entra ID application
Follow the procedure at [Register an application with Microsoft Entra ID and create a service principal](../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-azure-ad-and-create-a-service-principal) to register an application for Prometheus remote-write and create a service principal.

Copy the tenant ID and client ID of the created service principal
1. Browse to **Identity > Applications > App registrations**, then select your application.
2. On the app's overview page, copy the Directory (tenant) ID value and store it in your application code.
3. Copy the Application (client) ID value and store it in your application code.

Create a new client secret as described in [Create new client secret](../active-directory/develop/howto-create-service-principal-portal.md#option-3-create-a-new-client-secret) and copy the value of the created secret.

set the values of the collected tenant ID, client ID and client secret
```
export TENANT_ID=<tenant-id>
export CLIENT_ID=<client-id>
export CLIENT_SECRET=<client-secret>
```

## Assign Monitoring Metrics Publisher role on the data collection rule to the application
The application requires the *Monitoring Metrics Publisher* role on the data collection rule associated with your Azure Monitor workspace.

1. From the menu of your Azure Monitor Workspace account, select the **Data collection rule** to open the **Overview** page for the data collection rule.

2. Select **Access control (IAM)** in the **Overview** page for the data collection rule.

3. Select **Add** and then **Add role assignment**.

4. Select **Monitoring Metrics Publisher** role and select **Next**.

5. Select **User, group, or service principal** and then select **Select members**. Select the application that you created and select **Select**.

6. Select **Review + assign** to complete the role assignment.

## Create secret in the ARO cluster

We're using the OAuth 2.0 authentication method from the [supported remote write authentication settings](https://docs.openshift.com/container-platform/4.11/monitoring/configuring-the-monitoring-stack.html#supported_remote_write_authentication_settings_configuring-the-monitoring-stack)
To facilitate this approach, create a secret with the client ID and client secret

```
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
  
## Configure remote write

To [configure](https://docs.openshift.com/container-platform/4.11/monitoring/configuring-the-monitoring-stack.html#configuring_remote_write_storage_configuring-the-monitoring-stack) remote write for default platform monitoring, we need to update the cluster-monitoring-config config map in the openshift-monitoring namespace
1. Replace the INGESTION-URL in the configuration with the **Metrics ingestion endpoint** from the **Overview** page for the Azure Monitor workspace
2. Replace the TENANT_ID in the configuration with the tenant ID of the service principal

Edit the configmap

```
oc edit -n openshift-monitoring cm cluster-monitoring-config
```

and update the configuration

```
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

## Visualize metrics using Azure Managed Grafana Workspace
The captured metrics can be visualized using community Grafana dashboards or create contextual dashboards as required.

1. Create an [Azure Managed Grafana workspace](../managed-grafana/quickstart-managed-grafana-portal.md)
2. [Link](../azure-monitor/essentials/azure-monitor-workspace-manage.md?tabs=azure-portal#link-a-grafana-workspace) the created Grafana workspace to the Azure Monitor workspace
3. [Import](../managed-grafana/how-to-create-dashboard.md?tabs=azure-portal#import-a-grafana-dashboard) the community Grafana Dashboard with ID 3870 [OpenShift/K8 Cluster Overview](https://grafana.com/grafana/dashboards/3870-openshift-k8-cluster-overview/) into the Grafana workspace
4. Specify the Azure Monitor Workspace as the datasource
5. Save the dashboard
6. Access the dashboard from **Home -> Dashboards**   

## Troubleshooting
See [Azure Monitor managed service for Prometheus remote write](../azure-monitor/containers/prometheus-remote-write.md#hitting-your-ingestion-quota-limit).

## Next steps

- [Learn more about Azure Monitor managed service for Prometheus](../azure-monitor/essentials/prometheus-metrics-overview.md).
