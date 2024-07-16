---
title: Integrate KEDA with your Azure Kubernetes Service cluster
description: How to integrate KEDA with your Azure Kubernetes Service cluster.
author: bwren
ms.author: bwren
services: azure-monitor
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 05/31/2023
--- 


# Integrate KEDA with your Azure Kubernetes Service cluster

KEDA is a Kubernetes-based Event Driven Autoscaler. KEDA lets you drive the scaling of any container in Kubernetes based on the load to be processed, by querying metrics from systems such as Prometheus. Integrate KEDA with your Azure Kubernetes Service (AKS) cluster to scale your workloads based on Prometheus metrics from your Azure Monitor workspace.

To integrate KEDA into your Azure Kubernetes Service, you have to deploy and configure a workload identity or pod identity on your cluster. The identity allows KEDA to authenticate with Azure and retrieve metrics for scaling from your Monitor workspace. 

This article walks you through the steps to integrate KEDA into your AKS cluster using a workload identity.

> [!NOTE]
> We recommend using Microsoft Entra Workload ID. This authentication method replaces pod-managed identity (preview), which integrates with the Kubernetes native capabilities to federate with any external identity providers on behalf of the application.
>
> The open source Microsoft Entra pod-managed identity (preview) in Azure Kubernetes Service has been deprecated as of 10/24/2022, and the project will be archived in Sept. 2023. For more information, see the deprecation notice. The AKS Managed add-on begins deprecation in Sept. 2023.
>
> Azure Managed Prometheus support starts from KEDA v2.10. If you have an older version of KEDA installed, you must upgrade in order to work with Azure Managed Prometheus.

## Prerequisites

+ Azure Kubernetes Service (AKS) cluster
+ Prometheus sending metrics to an Azure Monitor workspace. For more information, see [Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md).

## Set up a workload identity

1. Start by setting up some environment variables. Change the values to suit your AKS cluster.
 
    ```bash
    export RESOURCE_GROUP="rg-keda-integration"
    export LOCATION="eastus"
    export SUBSCRIPTION="$(az account show --query id --output tsv)"
    export USER_ASSIGNED_IDENTITY_NAME="keda-int-identity"
    export FEDERATED_IDENTITY_CREDENTIAL_NAME="kedaFedIdentity" 
    export SERVICE_ACCOUNT_NAMESPACE="keda"
    export SERVICE_ACCOUNT_NAME="keda-operator"
    export AKS_CLUSTER_NAME="aks-cluster-name"
    ```

    + `SERVICE_ACCOUNT_NAME` - KEDA must use the service account that was used to create federated credentials. This can be any user defined name.
    + `AKS_CLUSTER_NAME`- The name of the AKS cluster where you want to deploy KEDA.
    + `SERVICE_ACCOUNT_NAMESPACE` Both KEDA and service account must be in same namespace.
    + `USER_ASSIGNED_IDENTITY_NAME` is the name of the Microsoft Entra identity that's created for KEDA. 
    + `FEDERATED_IDENTITY_CREDENTIAL_NAME` is the name of the credential that's created for KEDA to use to authenticate with Azure.

1. If your AKS cluster hasn't been created with workload-identity or oidc-issuer enabled, you'll need to enable it. If you aren't sure, you can run the following command to check if it's enabled.

    ```azurecli
    az aks show --resource-group $RESOURCE_GROUP --name $AKS_CLUSTER_NAME --query oidcIssuerProfile
    az aks show --resource-group $RESOURCE_GROUP --name $AKS_CLUSTER_NAME --query securityProfile.workloadIdentity
    ```
    
    To enable workload identity and oidc-issuer, run the following command. 
    
    ```azurecli
    az aks update -g $RESOURCE_GROUP -n $AKS_CLUSTER_NAME --enable-workload-identity --enable-oidc-issuer
    ```
    
1. Store the OIDC issuer url in an environment variable to be used later.
    
    ```bash
    export AKS_OIDC_ISSUER="$(az aks show -n $AKS_CLUSTER_NAME -g $RESOURCE_GROUP --query "oidcIssuerProfile.issuerUrl" -otsv)"
    ```
    
1. Create a user assigned identity for KEDA. This identity is used by KEDA to authenticate with Azure Monitor. 
    
    ```azurecli
     az identity create --name $USER_ASSIGNED_IDENTITY_NAME --resource-group $RESOURCE_GROUP --location $LOCATION --subscription $SUBSCRIPTION
    ```
    
    The output will be similar to the following:
    
    ```json
    {
      "clientId": "abcd1234-abcd-abcd-abcd-9876543210ab",
      "id": "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourcegroups/rg-keda-integration/providers/Microsoft.    ManagedIdentity/userAssignedIdentities/keda-int-identity",
      "location": "eastus",
      "name": "keda-int-identity",
      "principalId": "12345678-abcd-abcd-abcd-1234567890ab",
      "resourceGroup": "rg-keda-integration",
      "systemData": null,
      "tags": {},
      "tenantId": "1234abcd-9876-9876-9876-abcdef012345",
      "type": "Microsoft.ManagedIdentity/userAssignedIdentities"
    }
    ```

1. Store the `clientId` and `tenantId` in environment variables to use later.  
    ```bash
    export USER_ASSIGNED_CLIENT_ID="$(az identity show --resource-group $RESOURCE_GROUP --name $USER_ASSIGNED_IDENTITY_NAME --query 'clientId' -otsv)"
    export TENANT_ID="$(az identity show --resource-group $RESOURCE_GROUP --name $USER_ASSIGNED_IDENTITY_NAME --query 'tenantId' -otsv)"
    ```
    
1. Assign the *Monitoring Data Reader* role to the identity for your Azure Monitor workspace. This role allows the identity to read metrics from your workspace. Replace the *Azure Monitor Workspace resource group* and *Azure Monitor Workspace name* with the resource group and name of the Azure Monitor workspace which is configured to collect metrics from the AKS cluster.
    
    ```azurecli
    az role assignment create \
    --assignee $USER_ASSIGNED_CLIENT_ID \
    --role "Monitoring Data Reader" \
    --scope /subscriptions/$SUBSCRIPTION/resourceGroups/<Azure Monitor Workspace resource group>/providers/microsoft.monitor/accounts/<Azure monitor workspace name>
    ```
    
    
1. Create the KEDA namespace, then create Kubernetes service account. This service account is used by KEDA to authenticate with Azure.
    
    ```azurecli
    
    az aks get-credentials -n $AKS_CLUSTER_NAME -g $RESOURCE_GROUP
    
    kubectl create namespace keda
    
    cat <<EOF | kubectl apply -f -
    apiVersion: v1
    kind: ServiceAccount
    metadata:
      annotations:
        azure.workload.identity/client-id: $USER_ASSIGNED_CLIENT_ID
      name: $SERVICE_ACCOUNT_NAME
      namespace: $SERVICE_ACCOUNT_NAMESPACE
    EOF
    ```

1. Check your service account by running
    ```bash
    kubectl describe serviceaccount $SERVICE_ACCOUNT_NAME -n keda
    ```

1. Establish a federated credential between the service account and the user assigned identity. The federated credential allows the service account to use the user assigned identity to authenticate with Azure.

    ```azurecli
    az identity federated-credential create --name $FEDERATED_IDENTITY_CREDENTIAL_NAME --identity-name $USER_ASSIGNED_IDENTITY_NAME --resource-group $RESOURCE_GROUP --issuer $AKS_OIDC_ISSUER --subject     system:serviceaccount:$SERVICE_ACCOUNT_NAMESPACE:$SERVICE_ACCOUNT_NAME --audience api://AzureADTokenExchange
    ```

    > [!Note]
    > It takes a few seconds for the federated identity credential to be propagated after being initially added. If a token request is made immediately after adding the federated identity credential, it might lead to failure for a couple of minutes as the cache is populated in the directory with old data. To avoid this issue, you can add a slight delay after adding the federated identity credential.

## Deploy KEDA

KEDA can be deployed using YAML manifests, Helm charts, or Operator Hub. This article uses Helm charts. For more information on deploying KEDA, see [Deploying KEDA](https://keda.sh/docs/2.10/deploy/)

Add helm repository:

```bash 
helm repo add kedacore https://kedacore.github.io/charts
helm repo update
```

Deploy KEDA using the following command:

```bash 
helm install keda kedacore/keda --namespace keda \
--set serviceAccount.create=false \
--set serviceAccount.name=keda-operator \
--set podIdentity.azureWorkload.enabled=true \
--set podIdentity.azureWorkload.clientId=$USER_ASSIGNED_CLIENT_ID \
--set podIdentity.azureWorkload.tenantId=$TENANT_ID
```
    
Check your deployment by running the following command. 
```bash
kubectl get pods -n keda
```
The output will be similar to the following:

```bash
NAME                                               READY   STATUS    RESTARTS       AGE
keda-admission-webhooks-ffcb8f688-kqlxp            1/1     Running   0              4m
keda-operator-5d9f7d975-mgv7r                      1/1     Running   1 (4m ago)     4m
keda-operator-metrics-apiserver-7dc6f59678-745nz   1/1     Running   0              4m
```

## Scalers

Scalers define how and when KEDA should scale a deployment. KEDA supports a variety of scalers. For more information on scalers, see [Scalers](https://keda.sh/docs/2.10/scalers/prometheus/). Azure Managed Prometheus utilizes already existing Prometheus scaler to retrieve Prometheus metrics from Azure Monitor Workspace. The following yaml file is an example to use Azure Managed Prometheus. 

[!INCLUDE[managed-identity-yaml](../includes/prometheus-sidecar-keda-scaler-yaml.md)]

+ `serverAddress` is the Query endpoint of your Azure Monitor workspace. For more information, see [Query Prometheus metrics using the API and PromQL](../essentials/prometheus-api-promql.md#query-endpoint)
+ `metricName` is the name of the metric you want to scale on. 
+ `query` is the query used to retrieve the metric. 
+ `threshold` is the value at which the deployment scales. 
+ Set the `podIdentity.provider` according to the type of identity you're using. 

## Troubleshooting

The following section provides troubleshooting tips for common issues.

### Federated credentials

Federated credentials can take up to 10 minutes to propagate. If you're having issues with KEDA authenticating with Azure, try the following steps.

The following log excerpt shows an error with the federated credentials.

```
kubectl logs -n keda keda-operator-5d9f7d975-mgv7r

{
 \"error\": \"unauthorized_client\",\n  \"error_description\": \"AADSTS70021: No matching federated identity record found for presented assertion. 
Assertion Issuer: 'https://eastus.oic.prod-aks.azure.com/abcdef01-2345-6789-0abc-def012345678/12345678-abcd-abcd-abcd-1234567890ab/'.
Assertion Subject: 'system:serviceaccount:keda:keda-operator'. 
Assertion Audience: 'api://AzureADTokenExchange'. https://docs.microsoft.com/azure/active-directory/develop/workload-identity-federation
Trace ID: 12dd9ea0-3a65-408f-a41f-5d0403a25100\\r\\nCorrelation ID: 8a2dce68-17f1-4f11-bed2-4bcf9577f2af\\r\\nTimestamp: 2023-05-30 11:11:53Z\",
\"error_codes\": [\n    70021\n  ],\n  \"timestamp\": \"2023-05-30 11:11:53Z\",
\"trace_id\": \"12345678-3a65-408f-a41f-5d0403a25100\",
\"correlation_id\": \"12345678-17f1-4f11-bed2-4bcf9577f2af\",
\"error_uri\": \"https://login.microsoftonline.com/error?code=70021\"\n}
\n--------------------------------------------------------------------------------\n"}
```

Check the values used to create the ServiceAccount and the credentials created with `az identity federated-credential create` and ensure the `subject` value matches the `system:serviceaccount` value. 

### Azure Monitor workspace permissions

If you're having issues with KEDA authenticating with Azure, check the permissions for the Azure Monitor workspace.
The following log excerpt shows that the identity doesn't have read permissions for the Azure Monitor workspace.

```
kubectl logs -n keda keda-operator-5d9f7d975-mgv7r

2023-05-30T11:15:45Z    ERROR   scale_handler   error getting metric for scaler 
{"scaledObject.Namespace": "default", "scaledObject.Name": "azure-managed-prometheus-scaler", "scaler": "prometheusScaler", 
"error": "prometheus query api returned error. status: 403 response: {\"status\":\"error\",
\"errorType\":\"Forbidden\",\"error\":\"User \\u0027abc123ab-1234-1234-abcd-abcdef123456
\\u0027 does not have access to perform any of the following actions 
\\u0027microsoft.monitor/accounts/data/metrics/read, microsoft.monitor/accounts/data/metrics/read
\\u0027 on resource \\u0027/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourcegroups/rg-azmon-ws-01/providers/microsoft.monitor/accounts/azmon-ws-01\\u0027. RequestId: 123456c427f348258f3e5aeeefef834a\"}"}
```

Ensure the identity has the `Monitoring Data Reader` role on the Azure Monitor workspace.
