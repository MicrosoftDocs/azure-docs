---
title: Configure remote write for Azure Monitor managed service for Prometheus
description: Use remote write to send metrics from a local Prometheus server to Azure Monitor managed service for Prometheus.
ms.topic: conceptual
ms.date: 09/15/2022
---

# Configure remote write for Azure Monitor managed service for Prometheus
Azure Monitor managed service for Prometheus is intended to be a replacement for self managed Prometheus so you don't need to manage a Prometheus server in your Kubernetes clusters. You may also choose to use the managed service to centralize data from self-managed Prometheus clusters for long term data retention and creating a centralized view across your clusters. In this case, you can use [remote_write](https://prometheus.io/docs/operating/integrations/#remote-endpoints-and-storage) to send data from your self-managed Prometheus into our managed service.

## Architecture
Azure Monitor provides a reverse proxy container (Azure Monitor side car container) that provides an abstraction for ingesting Prometheus remote write metrics and helps in authenticating packets. The Azure Monitor side car container currently supports User Assigned Identity and Azure Active Directory (AAD) based authentication to ingest Prometheus remote write metrics to Azure Monitor workspace. Certificates required for AAD based authentication are downloaded to the local mount on your cluster by the [CSI driver](../../aks/csi-secrets-store-driver.md).


## Configuration steps
Use the following steps to configure remote-write to Azure Monitor managed service for Prometheus. Each step is described in further detail in the sections below.

1. [Create Azure Monitor workspace](#create-azure-monitor-workspace) 
2. [Create data collection endpoint](#create-data-collection-endpoint) 
3. [Create data collection rule](#create-data-collection-rule) - 
4. [Grant access to User Assigned Identity or AAD app](#grant-access-to-user-assigned-identity-or-aad-app)
5. [Set up CSI driver](#set-up-csi-driver)
6. [Deploy the Azure Monitor side car container](#deploy-the-azure-monitor-side-car-container)


## Create Azure Monitor workspace
[Create an Azure Monitor workspace](azure-monitor-workspace-overview.md). This is where the collected data will be stored. You can use an existing Azure Monitor workspace if you already have one and want to consolidate your metrics.


## Create data collection endpoint
[Create a data collection endpoint](data-collection-endpoint-overview.md) in the same region as you Azure Monitor workspace. This is the endpoint that the remote Prometheus server will connect to.

## Create data collection rule
Create a [data collection rule](data-collection-rule-overview.md) that specifies data sent to the data collection endpoint is directed to the Azure Monitor workspace. It must be located in same region as the DCE and Azure Monitor workspace. You must create the rule using the following API request. Once DCR is created, note down the DCR immutable ID, which is returned as part of the response. This is used later to construct the ingestion url.


```rest
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Insights/dataCollectionRules/{dataCollectionRulesName}?api-version=2021-09-01-preview
```

Followint is the body of the PUT request. Replace the values in brackets with the values for your environment.

```json
{
    "properties": {
        "dataCollectionEndpointId": "<dataCollectionEndpointResourceId>",
        "dataSources": {
            "prometheusForwarder": [
                {
                    "name": "MyPromDataSource",
                    "streams": [
                        "Microsoft-PrometheusMetrics"
                    ],
                    "labels": [
                        "MonitoringData"
                    ]
                }
            ]
        },
        "destinations": {
            "monitoringAccounts": [
                {
                    "accountResourceId": "<azureMonitorWorkspaceResourceId>",
                    "accountId": "<azureMonitorWorkspaced>",
                    "name": "<azureMonitorWorkspaceName>"
                }
            ]
        },
        "dataFlows": [
            {
                "streams": [
                    "Microsoft-PrometheusMetrics"
                ],
                "destinations": [
                    "<azureMonitorWorkspaceName>"
                ]
            }
        ]
    },
    "location": "<region>"
}
```

## Grant access to User Assigned Identity or AAD app
The User Assigned Identity or the AAD app that is going to be used to push Prometheus remote write metrics should be assigned **Monitoring Metrics Publisher** role in the data collection rule. The role assignment can be done by following [Assign a managed identity access to a resource by using the Azure portal](../../active-directory/managed-identities-azure-resources/howto-assign-access-portal.md).


## Set up CSI driver

>[!IMPORTANT]
> This step is only required if you are using AAD based authentication. Do not complete this step if you're using User Assigned Identity.

The CSI driver will help in downloading a certificate to the local mount of your cluster in a compliant way. This driver provides three methods of authenticating:

- Azure Active Directory pod identity
- User assigned managed identity
- System assigned managed identity

Follow the procedure at [Use the Azure Key Vault Provider for Secrets Store CSI Driver for Azure Kubernetes Service secrets](../../aks/csi-secrets-store-driver.md) to setup the CSI driver.

Once the CSI driver is configured, follow the procedure at [Provide an identity to access the Azure Key Vault Provider for Secrets Store CSI Driver](../../aks/csi-secrets-store-identity-access.md) to create your *SecretProviderClass.yml* file which will specify the identity being used.

Necessary configurations while setting up CSI driver:

- The certificate stored in the key vault is used for AAD based authentication.
- In your secret provider class, specify the following. This will download the certificate with the secret which is necessary for authenticating packets.
  - `objectType` = *secret*
  - `objectFormat` = *pfx*
  - `objectEncoding` = *base64*. 

### Sample configuration
The following sample *SecretProviderClass.yml* uses system assigned identity. To use this file, modify it with the following values:

- \<YOUR-KEYVAULT\>: Name of your key vault where you have stored certificate which has publishing permissions on the MDM account.
- \<YOUR-CERTIFICATE-NAME\>: Certificate name as in your key vault.
- \<YOUR-TENANT-ID\>: Tenant Id.

```
# This is a SecretProviderClass example using system-assigned identity to access your key vault
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: azure-kvname-system-msi
spec:
  provider: azure
  parameters:
    usePodIdentity: "false"
    useVMManagedIdentity: "true"    # Set to true for using managed identity
    userAssignedIdentityID: ""      # If empty, then defaults to use the system assigned identity on the VM
    keyvaultName: <YOUR-KEYVAULT>
    cloudName: ""                   # [OPTIONAL for Azure] if not provided, the Azure environment defaults to AzurePublicCloud
    objects:  |
      array:
        - |
          objectName: <YOUR-CERTIFICATE-NAME>
          objectType: secret        # object types: secret, key, or cert
          objectFormat: pfx
          objectEncoding: base64
          objectVersion: ""         # [OPTIONAL] object versions, default to latest if empty
    tenantId: <YOUR-TENANT-ID>           # The tenant ID of the key vault
```

## Deploy the Azure Monitor side car container
The side car will act like a reverse proxy for ingesting metrics into your Azure Monitor workspace. This side car container needs to be deployed in the same pod where you run Prometheus. 

### Install kube-prometheus-stack

Run the following script to install `kube-prometheus-stack` helm chart. You can install Helm from [Installing Helm](https://helm.sh/docs/intro/install/).

```
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install prometheus prometheus-community/kube-prometheus-stack
```

### Deploy the sidecar
Modify the YAML file below with the following values:

- \<YOUR-AKS-CLUSTER-NAME\>: Cluster name of your AKS cluster.
- \<CONTAINER-IMAGE\>: Choose the latest stable container image from the table below.
- \<METRICS-INGESTION-URL\>: Metrics Ingestion endpoint from DCE in the format `https://<Metrics-Ingestion-URL>/dataCollectionRules/<DCR-Immutable-ID>/streams/Microsoft-PrometheusMetrics/api/v1/write?api-version=2021-11-01-preview`. This can be obtained from the DCE.
- \<YOUR-CERTIFICATE-NAME\>: Certificate name as in your key vault. Required only for AAD based auth.
- \<IDENTITY-TYPE\>: Type of identity used for auth. Possible values: "userAssigned" or "aadApplication".
- \<AZURE-CLIENT-ID\>: ClientID of the UserAssigned Identity or AAD app.
- \<AZURE-TENANT-ID\>: TenantID of AAD app. Required only for AAD based auth.


Verify the following paramters in the YAML file:

- If you are using AAD based authentication, uncomment sections of the YAML that is required for AAD based auth.
- Verify that the name of `secretProviderClass` is correct. The example below uses *azure-kvname-system-msi*.
- The sample uses the path */mnt/secrets-store* to download the certificate. Update this value if you use a different path.
- The sample uses *8081* as the listening port. Update this value if you use a different port.

```yaml
prometheus:
  prometheusSpec:
    externalLabels:
      cluster: <YOUR-AKS-CLUSTER-NAME>

    ## https://prometheus.io/docs/prometheus/latest/configuration/configuration/#remote_write
    ##
    remoteWrite:
    - url: "http://localhost:8081/api/v1/write"

    # Additional volumes on the output StatefulSet definition.
    # Required only for AAD based auth
    # volumes:
    # - name: secrets-store-inline
    #   csi:
    #     driver: secrets-store.csi.k8s.io
    #     readOnly: true
    #     volumeAttributes:
    #       secretProviderClass: azure-kvname-system-msi

    # Additional VolumeMounts on the output StatefulSet definition.
    # Required only for AAD based auth
    # volumeMounts:
    # - name: secrets-store-inline
    #   mountPath: "/mnt/secrets-store"
    #   readOnly: true

    containers:
    - name: prom-remotewrite
      image: <CONTAINER-IMAGE>
      imagePullPolicy: Always
      # Required only for AAD based auth
      # volumeMounts:
      #   - name: secrets-store-inline
      #     mountPath: "/mnt/secrets-store"
      #     readOnly: true
      ports:
        - name: rw-port
          containerPort: 8081
      env:
        - name: INGESTION_URL
          value: <METRICS-INGESTION-URL>
        # Default is Prod, if you have MDM account in INT, please use this.
        # - name: CLOUD
        #   value: INT
        - name: LISTENING_PORT
          value: "8081"
        - name: IDENTITY_TYPE
          value: "<IDENTITY-TYPE>"      
        - name: AZURE_CLIENT_ID
          value: "<AZURE-CLIENT-ID>"
        # Required only for AAD based auth
        # - name: AZURE_TENANT_ID
        #   value: "<AZURE-TENANT-ID>"  # TenantId of the AAD app
        # Required only for AAD based auth
        # - name: MDM_CERT_PATH
        #   value: /mnt/secrets-store/<YOUR-CERTIFICATE-NAME>
```

Once you have made the changes, run the following command to apply the changes.

```
helm upgrade -f AzureMonitor-RW.yml prometheus prometheus-community/kube-prometheus-stack
```


## Next steps

- [Learn more about Azure Monitor managed service for Prometheus](prometheus-metrics-overview.md).