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

# Getting started

THe proxy can be deployed in custom templates using release image or as helm chart. Both deployments contain same paramenters which can be customized. These parameters are described in the [table below](#parameters).

## Deployment

### Deploy using a release image

Download [sample-proxy-deployment.yaml](../samples/sample-proxy-deployment.yaml). This file can be used as a starting file for your proxy. Modify necessary parameters.
Use the command below  to deploy in the `observability` namespace.

```bash
kubectl apply -f sample-proxy-deployment.yaml -n observability
```

### Deploy using helm chart

Below sample command can be modified with user specific parameters and deployed as a helm chart.
Modify the command with your oci, `targetHost`, and `aadClientId` parameters.

```bash 
helm install aad-auth-proxy oci://nagasharedacr.azurecr.io/helm/aad-auth-proxy \
--version 0.1.0 \
-n observability \
--set targetHost=https://azure-monitor-workspace.eastus.prometheus.monitor.azure.com \
--set identityType=userAssigned \
--set aadClientId=a711a6a4-1052-44eb-aec8-182e2b604c7f \
--set audience=https://monitor.azure.com
```

## Parameters

| Image Parameter | Helm chart Parameter name | Description | Supported values | Mandatory |
| --------- | --------- | --------------- | --------- | --------- |
|  TARGET_HOST | targetHost | this is the target host where you want to forward the request to. | | Yes |
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
The proxy supports readiness and liveness probes. The [sample proxy deployment configuration](../samples/sample-proxy-deployment.yaml) uses these checks to monitor health of the proxy.

## Example scenarios
### [Query prometheus metrics for KEDA or Kubecost](EXAMPLE_SCENARIOS.md#query-prometheus-metrics-for-kubecost)
### [Ingest prometheus metrics via prometheus remote write](EXAMPLE_SCENARIOS.md#ingest-prometheus-metrics-via-remote-write)




sample-proxy-deployment.yaml