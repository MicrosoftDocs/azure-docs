---
title: Set up Prometheus remote write by using Microsoft Entra Workload ID authentication
description: Learn how to set up remote write in Azure Monitor managed service for Prometheus. Use Microsoft Entra Workload ID (preview) authentication to send data from a self-managed Prometheus server to your Azure Monitor workspace.
author: EdB-MSFT
services: azure-monitor
ms.author: edbaynash
ms.topic: conceptual
ms.custom: devx-track-azurecli
ms.date: 4/18/2024
ms.reviewer: rapadman
---

# Send Prometheus data to Azure Monitor by using Microsoft Entra Workload ID (preview) authentication

This article describes how to set up [remote write](prometheus-remote-write.md) to send data from your Azure Monitor managed Prometheus cluster by using Microsoft Entra Workload ID authentication.

## Prerequisites

- Prometheus versions greater than v2.48 are required for Microsoft Entra ID application authentication. 

- A cluster that has feature flags that are specific to OpenID Connect (OIDC) and an OIDC issuer URL:
  - For managed clusters (Azure Kubernetes Service, Amazon Elastic Kubernetes Service, and Google Kubernetes Engine), see [Managed Clusters - Microsoft Entra Workload ID](https://azure.github.io/azure-workload-identity/docs/installation/managed-clusters.html).
  - For self-managed clusters, see [Self-Managed Clusters - Microsoft Entra Workload ID](https://azure.github.io/azure-workload-identity/docs/installation/self-managed-clusters.html).
- An installed mutating admission webhook. For more information, see [Mutating Admission Webhook - Microsoft Entra Workload ID](https://azure.github.io/azure-workload-identity/docs/installation/mutating-admission-webhook.html).
- Prometheus running in the cluster. This article assumes that the Prometheus cluster is set up by using the [kube-prometheus stack](https://azure.github.io/azure-workload-identity/docs/installation/managed-clusters.html), but you can set up Prometheus by using other methods.

## Set up a workload for Microsoft Entra Workload ID

The process to set up Prometheus remote write for a workload by using Microsoft Entra Workload ID authentication involves completing the following tasks:

1. Set up the workload identity.
1. Create a Microsoft Entra application or user-assigned managed identity and grant permissions.
1. Assign the Monitoring Metrics Publisher role on the workspace data collection rule to the application.
1. Create or update your Kubernetes service account Prometheus pod.
1. Establish federated identity credentials between the identity and the service account issuer and subject.
1. Deploy a sidecar container to set up remote write.

The tasks are described in the following sections.

### Set up the workload identity

To set up the workload identity, export the following environment variables:  

```bash
# [OPTIONAL] Set this if you're using a Microsoft Entra application
export APPLICATION_NAME="<your application name>"
    
# [OPTIONAL] Set this only if you're using a user-assigned managed identity
export USER_ASSIGNED_IDENTITY_NAME="<your user-assigned managed identity name>"
    
# Environment variables for the Kubernetes service account and federated identity credential
export SERVICE_ACCOUNT_NAMESPACE="<namespace of Prometheus pod>"
export SERVICE_ACCOUNT_NAME="<name of service account associated with Prometheus pod>"
export SERVICE_ACCOUNT_ISSUER="<your service account issuer URL>"
```  

For `SERVICE_ACCOUNT_NAME`, check to see whether a service account (separate from the *default* service account) is already associated with the Prometheus pod. Look for the value of `serviceaccountName` or `serviceAccount` (deprecated) in the `spec` of your Prometheus pod. Use this value if it exists. If `serviceaccountName` and `serviceAccount` don't exist, enter the name of the service account you want to associate with your Prometheus pod.

### Create a Microsoft Entra application or user-assigned managed identity and grant permissions

Create a Microsoft Entra application or a user-assigned managed identity and grant permission to publish metrics to Azure Monitor workspace:

```azurecli
# create a Microsoft Entra application
az ad sp create-for-rbac --name "${APPLICATION_NAME}"

# create a user-assigned managed identity if you use a user-assigned managed identity for this article
az identity create --name "${USER_ASSIGNED_IDENTITY_NAME}" --resource-group "${RESOURCE_GROUP}"
```

### Assign the Monitoring Metrics Publisher role on the workspace data collection rule to the application or managed identity

For information about assigning the role, see [Assign the Monitoring Metrics Publisher role on the workspace data collection rule to the managed identity](prometheus-remote-write-managed-identity.md#assign-the-monitoring-metrics-publisher-role-on-the-workspace-data-collection-rule-to-the-managed-identity).

### Create or update your Kubernetes service account Prometheus pod

Often, a Kubernetes service account is created and associated with the pod running the Prometheus container. If you're using the kube-prometheus stack, the code automatically creates the prometheus-kube-prometheus-prometheus service account.

If no Kubernetes service account except the default service account is associated with Prometheus, create a new service account specifically for the pod running Prometheus.

To create the service account, run the following kubectl command:

```bash
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: service account
metadata:
  annotations:
    azure.workload.identity/client-id: ${APPLICATION_CLIENT_ID:-$USER_ASSIGNED_IDENTITY_CLIENT_ID}
  name: ${SERVICE_ACCOUNT_NAME}
  namespace: ${SERVICE_ACCOUNT_NAMESPACE}
EOF
```

If a Kubernetes service account other than default service account is associated with your pod, add the following annotation to your service account:

```bash
kubectl annotate sa ${SERVICE_ACCOUNT_NAME} -n ${SERVICE_ACCOUNT_NAMESPACE} azure.workload.identity/client-id="${APPLICATION_OR_USER_ASSIGNED_IDENTITY_CLIENT_ID}" –overwrite
```

If your Microsoft Entra application or user-assigned managed identity isn't in the same tenant as your cluster, add the following annotation to your service account:

```bash
kubectl annotate sa ${SERVICE_ACCOUNT_NAME} -n ${SERVICE_ACCOUNT_NAMESPACE} azure.workload.identity/tenant-id="${APPLICATION_OR_USER_ASSIGNED_IDENTITY_TENANT_ID}" –overwrite
```

### Establish federated identity credentials between the identity and the service account issuer and subject

Create federated credentials by using the Azure CLI.

#### User-assigned managed identity

```cli
az identity federated-credential create \
   --name "kubernetes-federated-credential" \
   --identity-name "${USER_ASSIGNED_IDENTITY_NAME}" \
   --resource-group "${RESOURCE_GROUP}" \
   --issuer "${SERVICE_ACCOUNT_ISSUER}" \
   --subject "system:serviceaccount:${SERVICE_ACCOUNT_NAMESPACE}:${SERVICE_ACCOUNT_NAME}"
```

#### Microsoft Entra application

```cli
# Get the ObjectID of the Microsoft Entra app.

export APPLICATION_OBJECT_ID="$(az ad app show --id ${APPLICATION_CLIENT_ID} --query id -otsv)"

# Add a federated identity credential.

cat <<EOF > params.json
{
  "name": "kubernetes-federated-credential",
  "issuer": "${SERVICE_ACCOUNT_ISSUER}",
  "subject": "system:serviceaccount:${SERVICE_ACCOUNT_NAMESPACE}:${SERVICE_ACCOUNT_NAME}",
  "description": "Kubernetes service account federated credential",
  "audiences": [
    "api://AzureADTokenExchange"
  ]
}
EOF

az ad app federated-credential create --id ${APPLICATION_OBJECT_ID} --parameters @params.json
```

### Deploy a sidecar container to set up remote write

> [!IMPORTANT]
>
>The Prometheus pod must have the following label: `azure.workload.identity/use: "true"`
>
> The remote write sidecar container requires the following environment values:
>
> - `INGESTION_URL`: The metrics ingestion endpoint that's shown on the **Overview** page for the Azure Monitor workspace
> - `LISTENING_PORT`: `8081` (any port is supported)
> - `IDENTITY_TYPE`: `workloadIdentity`

1. Copy the following YAML and save it to a file. The YAML uses port 8081 as the listening port. If you use a different port, modify that value in the YAML.

   [!INCLUDE [prometheus-sidecar-remote-write-workload-identity-yaml](../includes/prometheus-sidecar-remote-write-workload-identity-yaml.md)]

1. Replace the following values in the YAML:
  
    | Value | Description |
    |:---|:---|
    | `<CLUSTER-NAME>` | The name of your AKS cluster. |
    | `<CONTAINER-IMAGE-VERSION>` | [!INCLUDE [version](../includes/prometheus-remotewrite-image-version.md)]<br>The remote write container image version.| 
    | `<INGESTION-URL>` | The value for **Metrics ingestion endpoint** from the **Overview** page for the Azure Monitor workspace. |
   

1. Use Helm to apply the YAML file and update your Prometheus configuration:

    ```azurecli
    # set a context to your cluster 
    az aks get-credentials -g <aks-rg-name> -n <aks-cluster-name> 
 
    # use Helm to update your remote write config 
    helm upgrade -f <YAML-FILENAME>.yml prometheus prometheus-community/kube-prometheus-stack -namespace <namespace where Prometheus pod resides> 
    ```

## Verification and troubleshooting

For verification and troubleshooting information, see [Troubleshooting remote write](/azure/azure-monitor/containers/prometheus-remote-write-troubleshooting)  and [Azure Monitor managed service for Prometheus remote write](prometheus-remote-write.md#verify-remote-write-is-working-correctly).

## Next steps

- [Collect Prometheus metrics from an AKS cluster](../containers/kubernetes-monitoring-enable.md#enable-prometheus-and-grafana)
- [Learn more about Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md)
- [Remote write in Azure Monitor managed service for Prometheus](prometheus-remote-write.md)
- [Send Prometheus data to Azure Monitor by using Microsoft Entra authentication](./prometheus-remote-write-active-directory.md)
- [Send Prometheus data to Azure Monitor by using managed identity authentication](./prometheus-remote-write-managed-identity.md)
- [Send Prometheus data to Azure Monitor by using Microsoft Entra pod-managed identity (preview) authentication](./prometheus-remote-write-azure-ad-pod-identity.md)
