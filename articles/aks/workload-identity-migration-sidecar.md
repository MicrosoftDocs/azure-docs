---
title: Configure your Azure Kubernetes Service (AKS) cluster with a workload identity sidecar
description: In this Azure Kubernetes Service (AKS) article, you learn how to configure your Azure Kubernetes Service pod to authenticate with the workload identity sidecar.
services: container-service
ms.topic: article
ms.date: 09/13/2022
---

# Managed identity with workload identity sidecar

To ensure a smooth transition using the new API and minimize downtime for your applications, there are two pod annotations you use to configure the behavior when exchanging the service account token for an Azure AD access token. They are:

* `azure.workload.identity/inject-proxy-sidecar`
* `azure.workload.identity/proxy-sidecar-port`

## Create a Managed Identity and grant permissions to access Azure Key Vault

This step is necessary if you need to access secrets, keys, and certificates that are mounted in Azure Key Vault from a pod. Perform the following steps to configure access with a managed identity. These steps assume you have an Azure Key Vault already created and configured in your subscription. If you don't have one, see [Create an Azure Key Vault using the Azure CLI][create-key-vault-azure-cli].

Before proceeding, you need the following information:

* Name of the Key Vault
* Resource group holding the Key Vault

1. Use the Azure CLI [az account set][az-account-set] command to set a specific subscription to be the current active subscription. Then use the [az identity create][az-identity-create] command to create a Managed Identity.

    ```azurecli
    az account set --subscription "subscriptionID
    ```

    ```azurecli
    az identity create --name "userAssignedIdentityName" --resource-group "resourceGroupName" --location "location" --subscription "subscriptionID"
    ```

2. Set an access policy for the Managed Identity to access secrets in your Key Vault by running the following commands:

    ```bash
    export USER_ASSIGNED_CLIENT_ID="$(az identity show --resource-group "resourceGroupName" --name "userAssignedIdentityName" --query 'clientId' -otsv)"
    ```

    ```azurecli
    az keyvault set-policy --name "keyVaultName" --secret-permissions get --spn "${USER_ASSIGNED_CLIENT_ID}"
    ```

## Create Kubernetes service account

Create a Kubernetes service account and annotate it with the client ID of the Managed Identity created in the previous step. Use the [az aks get-credentials][az-aks-get-credentials] command and replace the value `serviceAccountName` and `serviceAccountNamespace` with the Kubernetes service account name and its namespace.

```azurecli
az aks get-credentials -n aks -g MyResourceGroup 
cat <<EOF | kubectl apply -f -
apiVersion: v1
 kind: ServiceAccount
 metadata:
   annotations:
     azure.workload.identity/client-id: ${USER_ASSIGNED_CLIENT_ID}
   labels:
     azure.workload.identity/use: "true"
   name: serviceAccountName
   namespace: serviceAccountNamespace
 EOF
```

The following output resemble successful creation of the identity:

```output
Serviceaccount/workload-identity-sa created
```

## Establish federated identity credential

Use the [az rest][az-rest] command to invoke a custom request to establish the federated identity credential between the Managed Identity, the service account issuer, and the subject. Update the values for `subscriptionID`, `resourceGroupName`, `userAssignedIdentityName`, `federatedIdentityName`, `serviceAccountNamspace`, and `serviceAccountName`.

```azurecli
az rest --method put --url "/subscriptions/subscriptionID/resourceGroups/resourceGroupName/providers/Microsoft.ManagedIdentity/userAssignedIdentities/userAssignedIdentityName}/federatedIdentityCredentials/$federatedIdentityName?api-version=2022-01-31-PREVIEW" --headers "Content-Type=application/json" --body "{'properties':{'issuer':'${AKS_OIDC_ISSUER}','subject':'system:serviceaccount:serviceAccountNamespace:serviceAccountName','audiences':['api://AzureADTokenExchange'] }}"
```

## Update pod annotation

Perform the following steps to update the pod annotation with the sidecare properties, and then update the pod with the annotation.

1. Create a file named `azure-pod.yaml`, and copy in the following manifest.  

    ```yml
    apiVersion: v1
    kind: Pod
    metadata:
      name: httpbin-pod
      labels:
        app: httpbin
    spec:
      serviceAccountName: workload-identity-sa
      initContainers:
      - name: init-networking
        image: mcr.microsoft.com/oss/azure/workload-identity/proxy-init:v0.13.0
        securityContext:
          capabilities:
            add:
            - NET_ADMIN
            drop:
            - ALL
          privileged: true
          runAsUser: 0
        env:
        - name: PROXY_PORT
          value: "8000"
      containers:
      - name: nginx
        image: nginx:alpine
        ports:
        - containerPort: 80
      - name: proxy
        image: azure.workload.identity/proxy-sidecar-port
        ports:
        - containerPort: 8000
    ```

2. Update the pod with the [kubectl apply][kubectl-apply] command, as shown in the following example:

    ```bash
    kubectl apply -f azure-pod.yaml
    ```

## Next steps