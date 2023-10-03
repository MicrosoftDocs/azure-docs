---
title: Configure remote write for Azure managed service for Prometheus using Azure Active Directory workload identity (preview) 
description: Configure remote write for Azure Monitor managed service for Prometheus using Microsoft Azure Active Directory workload identity (preview)
author: EdB-MSFT
services: azure-monitor
ms.author: edbaynash
ms.topic: how-to
ms.date: 09/10/2023
ms.reviewer: rapadman
---

# Configure remote write for Azure managed service for Prometheus using Azure Active Directory workload identity (preview)

This article describes how to configure [remote-write](prometheus-remote-write.md) to send data from your Azure managed Prometheus cluster using Azure Active Directory workload identity.

## Prerequisites

* The cluster must have OIDC-specific feature flags and an OIDC issuer URL: 
  * For managed clusters (AKS/EKS/GKE), see [Managed Clusters - Azure AD Workload Identity](https://azure.github.io/azure-workload-identity/docs/installation/managed-clusters.html)
  * For self-managed clusters, see [Self-Managed Clusters - Azure AD Workload Identity](https://azure.github.io/azure-workload-identity/docs/installation/self-managed-clusters.html)  
* Installed mutating admission webhook. For more information, see [Mutating Admission Webhook - Azure AD Workload Identity](https://azure.github.io/azure-workload-identity/docs/installation/mutating-admission-webhook.html)
* The cluster already has Prometheus running. This guide assumes that the Prometheus is set up using [kube-prometheus-stack](https://azure.github.io/azure-workload-identity/docs/installation/managed-clusters.html), however, you can set up Prometheus any other way.

## Configure workload identity

1. Export the following environment variables:  

    ```bash
    # [OPTIONAL] Only set this if you're using a Azure AD Application
    export APPLICATION_NAME="<your application name>"
    
    # [OPTIONAL] Only set this if you're using a user-assigned managed identity
    export USER_ASSIGNED_IDENTITY_NAME="<your user-assigned managed identity name>"
    
    # environment variables for the Kubernetes service account & federated identity credential
    export SERVICE_ACCOUNT_NAMESPACE="<namespace of Prometheus pod>"
    export SERVICE_ACCOUNT_NAME="<name of service account associated with Prometheus pod>"
    export SERVICE_ACCOUNT_ISSUER="<your service account issuer url>"
    ```  

    For `SERVICE_ACCOUNT_NAME`, check if there's a service account (apart from the "default" service account) already associated with Prometheus pod, check for the value of `serviceaccountName` or `serviceAccount` (deprecated) in the `spec` of your Prometheus pod and use this value if it exists. If not, provide the name of the service account you would like to associate with your Prometheus pod.

1. Create an Azure Active Directory app or user assigned managed identity and grant permission to publish metrics to Azure Monitor workspace.
    ```azurecli
    # create an Azure Active Directory application
    az ad sp create-for-rbac --name "${APPLICATION_NAME}"

    # create a user-assigned managed identity if using user-assigned managed identity for this tutorial
    az identity create --name "${USER_ASSIGNED_IDENTITY_NAME}" --resource-group "${RESOURCE_GROUP}"
    ```

    Assign the *Monitoring Metrics Publisher* role to the Azure Active Directory app or user-assigned managed identity. For more information, see [Assign Monitoring Metrics Publisher role on the data collection rule to the managed identity](prometheus-remote-write-managed-identity.md#assign-monitoring-metrics-publisher-role-on-the-data-collection-rule-to-the-managed-identity).

1. Create or Update your Kubernetes service account Prometheus pod.  
   Often there's a Kubernetes service account created and associated with the pod running the Prometheus container. If you're using kube-prometheus-stack, it automatically creates `prometheus-kube-prometheus-prometheus` service account.

    If there's no Kubernetes service account associated with Prometheus besides the "default" service account, create a new service account specifically for Pod running Prometheus by running the following kubectl command:
    
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

    If there's a Kubernetes service account associated with your pod other than "default" service account, add the following annotation to your service account:

    ```bash
    kubectl annotate sa ${SERVICE_ACCOUNT_NAME} -n ${SERVICE_ACCOUNT_NAMESPACE} azure.workload.identity/client-id="${APPLICATION_OR_USER_ASSIGNED_IDENTITY_CLIENT_ID}" –overwrite
    ```

    If your Azure Active Directory app or user assigned managed identity isn't in the same tenant as your cluster, add the following annotation to your service account:
    
    ```bash
    kubectl annotate sa ${SERVICE_ACCOUNT_NAME} -n ${SERVICE_ACCOUNT_NAMESPACE} azure.workload.identity/tenant-id="${APPLICATION_OR_USER_ASSIGNED_IDENTITY_TENANT_ID}" –overwrite
    ```

1.	Establish federated identity credentials between the identity and the service account issuer and subject
    
    Create federated credentials (Azure CLI)
    
    * User-Assigned Managed identity
    ```cli    
    az identity federated-credential create \
      --name "kubernetes-federated-credential" \
      --identity-name "${USER_ASSIGNED_IDENTITY_NAME}" \
      --resource-group "${RESOURCE_GROUP}" \
      --issuer "${SERVICE_ACCOUNT_ISSUER}" \
      --subject "system:serviceaccount:${SERVICE_ACCOUNT_NAMESPACE}:${SERVICE_ACCOUNT_NAME}"
	```

    * Azure AD
    ```CLI
	# Get the ObjectID of the Azure Active Directory app.

    export APPLICATION_OBJECT_ID="$(az ad app show --id ${APPLICATION_CLIENT_ID} --query id -otsv)"

    #Add federated identity credential.

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

 ## Deploy the side car container
    
> [!IMPORTANT]
> *	The Prometheus pod must have the following label: `azure.workload.identity/use: "true"`
> *	The remote write sidecar container requires the following environment values:
>     *	`INGESTION_URL` - The metrics ingestion endpoint as shown on the Overview page for the Azure Monitor workspace.
>     *	`LISTENING_PORT` – `8081` (Any port is acceptable).
>     *	`IDENTITY_TYPE` – `workloadIdentity`.

Use the sample yaml below if you're using kube-prometheus-stack:

```yml
prometheus:
  prometheusSpec:
    externalLabels:
          cluster: <AKS-CLUSTER-NAME>
    podMetadata:
        labels:
            azure.workload.identity/use: "true"
    ## https://prometheus.io/docs/prometheus/latest/configuration/configuration/#remote_write    
    remoteWrite:
    - url: 'http://localhost:8081/api/v1/write'

    containers:
    - name: prom-remotewrite
      image: <CONTAINER-IMAGE-VERSION>
      imagePullPolicy: Always
      ports:
        - name: rw-port
          containerPort: 8081
      env:
      - name: INGESTION_URL
        value: <INGESTION_URL>
      - name: LISTENING_PORT
        value: '8081'
      - name: IDENTITY_TYPE
        value: workloadIdentity
```

1. Replace the following values in the YAML.
  
    | Value | Description |
    |:---|:---|
    | `<CLUSTER-NAME>` | Name of your AKS cluster |
    | `<CONTAINER-IMAGE-VERSION>` | `mcr.microsoft.com/azuremonitor/prometheus/promdev/prom-remotewrite:prom-remotewrite-20230906.1` <br>The remote write container image version. |
    | `<INGESTION-URL>` | **Metrics ingestion endpoint** from the **Overview** page for the Azure Monitor workspace |

1. Use helm to apply the YAML file to update your Prometheus configuration with the following CLI commands. 

    ```azurecli
    # set context to your cluster 
    az aks get-credentials -g <aks-rg-name> -n <aks-cluster-name> 
 
    # use helm to update your remote write config 
    helm upgrade -f <YAML-FILENAME>.yml prometheus prometheus-community/kube-prometheus-stack -namespace <namespace where Prometheus pod resides> 
    ```

## Next steps

* [Collect Prometheus metrics from an AKS cluster](../containers/prometheus-metrics-enable.md)
* [Learn more about Azure Monitor managed service for Prometheus](../essentials/prometheus-metrics-overview.md)
* [Remote-write in Azure Monitor Managed Service for Prometheus](prometheus-remote-write.md)
* [Remote-write in Azure Monitor Managed Service for Prometheus using Azure Active Directory](./prometheus-remote-write-active-directory.md)
* [Configure remote write for Azure Monitor managed service for Prometheus using managed identity authentication](./prometheus-remote-write-managed-identity.md)
* [Configure remote write for Azure Monitor managed service for Prometheus using Azure AD pod identity (preview)](./prometheus-remote-write-azure-ad-pod-identity.md)
