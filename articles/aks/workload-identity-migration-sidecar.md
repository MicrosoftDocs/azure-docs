---
title: Modernize your Azure Kubernetes Service (AKS) application with a workload identity sidecar
description: In this Azure Kubernetes Service (AKS) article, you learn how to configure your Azure Kubernetes Service pod to authenticate with the workload identity sidecar.
services: container-service
ms.topic: article
ms.date: 09/23/2022
---

# Modernize application authentication with workload identity sidecar

If your kubernetes application running on Azure Kubernetes Service (AKS) is using an authentication method other than a pod-managed identity to securely access resources in Azure, to ensure a smooth transition using the new Azure Identity API version 1.6 and minimize downtime, you can set up a sidecar. This sidecar intercepts Instance Metadata Service (IMDS) traffic and routes them to Azure Active Directory (Azure AD) using OpenID Connect (OIDC). This enables you to run pod-identity, other credential method, and the Azure AD workload identity (preview) in parallel on the cluster until you have your migration plan ready to completely move to using the Azure AD workload identity.

This article shows you how to set up your pod to authenticate using a workload identity as an short-term migration solution.

## Create a Managed Identity

1. Use the Azure CLI [az account set][az-account-set] command to set a specific subscription to be the current active subscription. Then use the [az identity create][az-identity-create] command to create a Managed Identity.

    ```azurecli
    az account set --subscription "subscriptionID"
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

3. To get the OIDC Issuer URL and save it to an environmental variable, run the following command. Replace the default values for the cluster name and the resource group name.

    ```bash
    export AKS_OIDC_ISSUER="$(az aks show -n myAKSCluster -g myResourceGroup --query "oidcIssuerProfile.issuerUrl" -otsv)"
    ```

## Create Kubernetes service account

Create a Kubernetes service account and annotate it with the client ID of the Managed Identity created in the previous step. Use the [az aks get-credentials][az-aks-get-credentials] command and replace the values for the cluster name and the resource group name.

```azurecli
az aks get-credentials -n myAKSCluster -g "${RESOURCE_GROUP}"
```

Copy and paste the following multi-line input in the Azure CLI.

```bash
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ServiceAccount
metadata:
  annotations:
    azure.workload.identity/client-id: ${USER_ASSIGNED_CLIENT_ID}
  labels:
    azure.workload.identity/use: "true"
  name: ${SERVICE_ACCOUNT_NAME}
  namespace: ${SERVICE_ACCOUNT_NAMESPACE}
EOF
```

The following output resemble successful creation of the identity:

```output
Serviceaccount/workload-identity-sa created
```

## Establish federated identity credential

Use the [az identity federated-credential create][az-identity-federated-credential-create] command to create the federated identity credential between the Managed Identity, the service account issuer, and the subject. Replace the values `resourceGroupName`, `userAssignedIdentityName`, `federatedIdentityName`, `serviceAccountNamespace`, and `serviceAccountName`.

```azurecli
az identity federated-credential create --name federatedIdentityName --identity-name userAssignedIdentityName --resource-group resourceGroupName --issuer ${AKS_OIDC_ISSUER} --subject serviceAccountNamespace:serviceAccountName
```

## Deploy the workload

To update or deploy the workload, you add the following [annotation][pod-annotations] in the pod that injects the init container and proxy sidecar:

* `azure.workload.identity/inject-proxy-sidecar`
* `azure.workload.identity/proxy-sidecar-port`

Update the pod with the annotation by performing the following steps.

1. Copy the following manifest snippet of an init container in your Pod specification to specify the proxy port for the workload identity sidecar.

    ```yml
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
    ```

2. Copy the following manifest snippet to specify the injected proxy sidecar for the containers object.

    ```yml
    - name: proxy
      image: mcr.microsoft.com/oss/azure/workload-identity/proxy:v0.13.0
      ports:
      - containerPort: 8000
    ```

## Next steps

This article showed you how to set up your pod to authenticate using a workload identity as a migration option. For more information about Azure AD workload identity (preview), see the following [Overview][workload-identity-overview] article.

<!-- INTERNAL LINKS -->
[pod-annotations]: workload-identity-overview.md#service-account-labels-and-annotations
[create-key-vault-azure-cli]: ../key-vault/general/quick-create-cli.md
[az-identity-create]: /cli/azure/identity#az-identity-create
[az-account-set]: /cli/azure/account#az-account-set
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[workload-identity-overview]: workload-identity-overview.md
[az-identity-federated-credential-create]: /cli/azure/identity/federated-credential#az-identity-federated-credential-create

<!-- EXTERNAL LINKS -->
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe