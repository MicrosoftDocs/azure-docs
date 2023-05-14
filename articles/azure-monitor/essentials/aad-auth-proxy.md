---
title: Azure Active Directory authorization proxy 
description: Azure Active Directory authorization proxy 
ms.topic: conceptual
author: EdB-MSFT
ms.author: edbaynash
ms.date: 07/10/2022
---

# Azure Active Directory authorization proxy 
The azure Active Directory authorization proxy is a reverse proxy which can be used to authenticate requests using Azure Active Directory. This proxy can be used to authenticate requests to any service which supports Azure Active Directory authentication. Use this proxy to authenticate requests to Azure Monitor managed service for Prometheus. 


## Prerequisites

To set up the proxy you must have an Azure Monitor workspace. If you do not have a workspace, create one using the [Azure portal](https://docs.microsoft.com/azure/azure-monitor/learn/quick-create-workspace).


## Getting started

THe proxy can be deployed in custom templates using release image or as helm chart. Both deployments contain the same parameters which can be customized. These parameters are described in the [table below](#parameters).



## Deployment

Use the following YAML file to deploy the proxy. Modify the required fields according to the deployment instructions below.
For mor information on the parameters see [Parameters](#parameters).



## Parameters

| Image Parameter | Helm chart Parameter name | Description | Supported values | Mandatory |
| --------- | --------- | --------------- | --------- | --------- |
|  TARGET_HOST | targetHost | this is the target host where you want to forward the request to. <br>When sending data to an Azure Monitor workspace this is the `Metrics ingestion endpoint` from the workspaces Overview page. <br> When reading data from an Azure Monitor workspace this is the `Data collection rule` from the workspaces Overview page| | Yes |
|  IDENTITY_TYPE | identityType | this is the identity type which will be used to authenticate requests. This proxy supports 3 types of identities. | systemassigned, userassigned, aadapplication | Yes |
| AAD_CLIENT_ID | aadClientId | this is the client_id of the identity used. This is needed for userassigned and aadapplication identity types. Check [Fetch parameters for identities](IDENTITY.md#fetch-parameters-for-identities) on how to fetch client_id | | Yes for userassigned and aadapplication |
| AAD_TENANT_ID | aadTenantId | this is the tenant_id of the identity used. This is needed for aadapplication identity types. Check [Fetch parameters for identities](IDENTITY.md#fetch-parameters-for-identities) on how to fetch tenant_id | | Yes for aadapplication |
| AAD_CLIENT_CERTIFICATE_PATH | aadClientCertificatePath | this is the path where proxy can find the certificate for aadapplication. This path should be accessible by proxy and should be a either a pfx or pem certificate containing private key. Check [CSI driver](IDENTITY.md#set-up-csi-driver-for-certificate-management) for managing certificates. | | Yes for aadapplication |
| AAD_TOKEN_REFRESH_INTERVAL_IN_PERCENTAGE | aadTokenRefreshIntervalInMinutes | token will be refreshed based on the percentage of time till token expiry. Default value is 10% time before expiry. | | No |
| AUDIENCE | audience | this will be the audience for the token | | No |
| LISTENING_PORT | listeningPort | proxy will be listening on this port | | Yes |
| OTEL_SERVICE_NAME | otelServiceName | this will be set as the service name for OTEL traces and metrics. Default value is aad_auth_proxy | | No |
| OTEL_GRPC_ENDPOINT | otelGrpcEndpoint | proxy will push OTEL telemetry to this endpoint. Default values is http://localhost:4317 | | No |


## Liveness and readiness probes
The proxy supports readiness and liveness probes. The sample proxy deployment configuration above, uses these checks to monitor the health of the proxy.

## [Remote write example](#tab/remote-write-example)

> [!NOTE]
> This example shows how to use the proxy to authenticate requests for remote write to Azure Monitor managed service for Prometheus as an example of writing data. Prometheus Remote Write has a dedicated side car for remote writing which is the recommended method for implementing remote write.

Before deploying the proxy, find your managed identity and assign it the `Monitoring Metrics Publisher` role for the Azure Monitor workspace. 

```azurecli
# Get the identity client_id
az aks show -g <AKS-CLUSTER-RESOURCE-GROUP> -n <AKS-CLUSTER-NAME> --query "identityProfile"
```

The output has the following format:
```bash 
{
  "kubeletidentity": {
    "clientId": "abcd1234-1243-abcd-9876-1234abcd5678",
    "objectId": "12345678-abcd-abcd-abcd-1234567890ab",
    "resourceId": "/subscriptions/def0123-1243-abcd-9876-1234abcd5678/resourcegroups/MC_rg-proxytest-01_proxytest-01_eastus/providers/Microsoft.ManagedIdentity/userAssignedIdentities/proxytest-01-agentpool"
  }
```

Assign the `Monitoring Metrics Publisher` role to the identity using the `clientId` from the previous command so it can write to the Azure Monitor workspace. To assign read permissions to the workspace, assign the `Monitoring Data Reader` role to the identity.

```azurecli
#Write permissions to the workspace
az role assignment create --assignee <clientid>  --role "Monitoring Metrics Publisher" --scope <workspace-id>
```

Use the YAML filebelow to deploy the proxy for remote write after modifying the following parameters:


+ `TARGET_HOST` - The target host where you want to forward the request to. When sending data to an Azure Monitor workspace this is the hostname part of the `Metrics ingestion endpoint` from the workspaces Overview page. For example `https://proxy-test-abcd.eastus-1.metrics.ingest.monitor.azure.com`
+ `AAD_CLIENT_ID` - The `clientId` of the managed identity used that was assigned the `Monitoring Metrics Publisher` role.
`AUDIENCE` - For ingesting metrics to Azure Monitor Workspace, set `AUDIENCE` to `https://monitor.azure.com` .

Remove `OTEL_GRPC_ENDPOINT` and `OTEL_SERVICE_NAME` if you aren't using OpenTelemetry.

proxy-ingestion.yaml

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
    labels:
        app: azuremonitor-ingestion
    name: azuremonitor-ingestion
    namespace: observability
spec:
    replicas: 1
    selector:
        matchLabels:
            app: azuremonitor-ingestion
    template:
        metadata:
            labels:
                app: azuremonitor-ingestion
            name: azuremonitor-ingestion
        spec:
            containers:
            - name: aad-auth-proxy
              image: mcr.microsoft.com/azuremonitor/auth-proxy/prod/aad-auth-proxy/images/aad-auth-proxy:aad-auth-proxy-0.1.0-main-04-11-2023-623473b0
              imagePullPolicy: Always
              ports:
              - name: auth-port
                containerPort: 8081
              env:
              - name: AUDIENCE
                value: https://monitor.azure.com
              - name: TARGET_HOST
                value: <YOUR-AZURE-MONITOR-WORKSPACE-ENDPOINT>
              - name: LISTENING_PORT
                value: "8081"
              - name: IDENTITY_TYPE
                value: userAssigned
              - name: AAD_CLIENT_ID
                value: <YOUR-AAD-CLIENT-ID>
              - name: AAD_TOKEN_REFRESH_INTERVAL_IN_PERCENTAGE
                value: "10"
              - name: OTEL_GRPC_ENDPOINT
                value: <YOUR-OTEL-GRPC-ENDPOINT> # "otel-collector.observability.svc.cluster.local:4317"
              - name: OTEL_SERVICE_NAME
                value: <YOUE-SERVICE-NAME>
              livenessProbe:
                httpGet:
                  path: /health
                  port: auth-port
                initialDelaySeconds: 5
                timeoutSeconds: 5
              readinessProbe:
                httpGet:
                  path: /ready
                  port: auth-port
                initialDelaySeconds: 5
                timeoutSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
    name: azuremonitor-ingestion
    namespace: observability
spec:
    ports:
        - port: 80
          targetPort: 8081
    selector:
        app: azuremonitor-ingestion
```



### Deploy the proxy using commands:
```bash
kubectl create namespace  observability 
kubectl apply -f proxy-ingestion.yaml -n observability
```

### Deploy using helm chart

Below sample command can be modified with user specific parameters and deployed as a helm chart.
Modify the command with your oci, `targetHost`, and `aadClientId` parameters.

```bash 
helm install aad-auth-proxy oci://mcr.microsoft.com/azuremonitor/auth-proxy/prod/aad-auth-proxy/helmchart/aad-auth-proxy \
--version 0.1.0 \
-n observability \
--set targetHost=https://proxy-test-abc123.eastus-1.metrics.ingest.monitor.azure.com \
--set identityType=userAssigned \
--set aadClientId= abcd1234-1243-abcd-9876-1234abcd5678 \
--set audience=https://monitor.azure.com
```

```

Configure remote write using the `Metrics ingestion endpoint` from the Azumer Monitor workspace page. For example:

```yml
server:
  remoteWrite:
  - url: "https://proxy-test-abcd.eastus-1.metrics.ingest.monitor.azure.com/dataCollectionRules/dcr-1234567890abcdef01234567890abcdef/streams/Microsoft-PrometheusMetrics/api/v1/write?api-version=2021-11-01-preview"  
```



## [Publish metrics example](#tabpublish-metrics-example)


Before deploying the proxy, find your managed identity and assign it the `Monitoring Metrics Reader` role for the Azure Monitor workspace. 

```azurecli
# Get the identity client_id
az aks show -g <AKS-CLUSTER-RESOURCE-GROUP> -n <AKS-CLUSTER-NAME> --query "identityProfile"
```

The output has the following format:
```bash 
{
  "kubeletidentity": {
    "clientId": "abcd1234-1243-abcd-9876-1234abcd5678",
    "objectId": "12345678-abcd-abcd-abcd-1234567890ab",
    "resourceId": "/subscriptions/def0123-1243-abcd-9876-1234abcd5678/resourcegroups/MC_rg-proxytest-01_proxytest-01_eastus/providers/Microsoft.ManagedIdentity/userAssignedIdentities/proxytest-01-agentpool"
  }
```

Assign the `Monitoring Data Reader` role to the identity using the `clientId` from the previous command so that it can read from the Azure Monitor workspace.

```azurecli
#Read permissions to the workspace
az role assignment create --assignee <clientid>  --role "Monitoring Data Reader" --scope <workspace-id>
```

Use the YAML file below to deploy the proxy for remote write after modifying the following parameters:

+ `TARGET_HOST` - The host that you want to query data from. Use the `Query endpoint` from the Azure monitor workspace Overview page. For example `proxy-test`
+ `AAD_CLIENT_ID` - The `clientId` of the managed identity used that was assigned the `Monitoring Metrics Reader` role.
+ `AUDIENCE` - For querying metrics from Azure Monitor Workspace, set `AUDIENCE` to `https://prometheus.monitor.azure.com`.

proxy-query.yaml

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
    labels:
        app: azuremonitor-query
    name: azuremonitor-query
    namespace: observability
spec:
    replicas: 1
    selector:
        matchLabels:
            app: azuremonitor-query
    template:
        metadata:
            labels:
                app: azuremonitor-query
            name: azuremonitor-query
        spec:
            containers:
            - name: aad-auth-proxy
              image: mcr.microsoft.com/azuremonitor/auth-proxy/prod/aad-auth-proxy/images/aad-auth-proxy:aad-auth-proxy-0.1.0-main-04-11-2023-623473b0
              imagePullPolicy: Always
              ports:
              - name: auth-port
                containerPort: 8082
              env:
              - name: AUDIENCE
                value: https://prometheus.monitor.azure.com
              - name: TARGET_HOST
                value: <Query endpoint>
              - name: LISTENING_PORT
                value: "8082"
              - name: IDENTITY_TYPE
                value: userAssigned
              - name: AAD_CLIENT_ID
                value: <clientId>
              - name: AAD_TOKEN_REFRESH_INTERVAL_IN_PERCENTAGE
                value: "10"
              - name: OTEL_GRPC_ENDPOINT
                value: "otel-collector.observability.svc.cluster.local:4317"
              - name: OTEL_SERVICE_NAME
                value: azuremonitor_query
              livenessProbe:
                httpGet:
                  path: /health
                  port: auth-port
                initialDelaySeconds: 5
                timeoutSeconds: 5
              readinessProbe:
                httpGet:
                  path: /ready
                  port: auth-port
                initialDelaySeconds: 5
                timeoutSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
    name: azuremonitor-query
    namespace: observability
spec:
    ports:
        - port: 80
          targetPort: 8082
    selector:
        app: azuremonitor-query
```



Deploy proxy using command: 
```bash
kubectl apply -f proxy-query.yaml -n observability
```


Test that you can query metrics from the proxy using the following command: <<<<<<<<<<<<<<<>>>>>>>>>>>>>>>

```bash
```
---




## Example scenarios
### [Query prometheus metrics for KEDA or Kubecost](EXAMPLE_SCENARIOS.md#query-prometheus-metrics-for-kubecost)
### [Ingest prometheus metrics via prometheus remote write](EXAMPLE_SCENARIOS.md#ingest-prometheus-metrics-via-remote-write)






Navigate to VMSS with the name aks-agentpool-<ID>-vmss. Select Identity TOC and System assigned tab, and toggle Status to On. This will enable system assigned identity on the underlying VMSS of AKS cluster.
--- there is no `aks-agentpool-<ID>-vmss` but there is alread a system assigned identity on the VMSS
<clustername>-agenpool identity


remote-write.yaml:

apiVersion: apps/v1
kind: Prometheus
server:
  remoteWrite:
  - url: "https://ed-k8s-03-am-workspace-s1ih.eastus-1.metrics.ingest.monitor.azure.com/dataCollectionRules/dcr-43fb76a2148e44049137de65ffc46041/streams/Microsoft-PrometheusMetrics/api/v1/write?api-version=2021-11-01-preview"
  

ed@Azure:~$ kubectl apply -f remote-write.yaml
error: resource mapping not found for name: "" namespace: "" from "remote-write.yaml": no matches for kind "Prometheus" in version "apps/v1"
ensure CRDs are installed first