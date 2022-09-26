---
title: Modernize your Azure Kubernetes Service (AKS) application with a workload identity sidecar
description: In this Azure Kubernetes Service (AKS) article, you learn how to configure your Azure Kubernetes Service pod to authenticate with the workload identity sidecar.
services: container-service
ms.topic: article
ms.date: 09/26/2022
---

# Modernize application authentication with workload identity sidecar

If your kubernetes application running on Azure Kubernetes Service (AKS) is using an authentication method other than a pod-managed identity to securely access resources in Azure, to ensure a smooth transition using the new Azure Identity API version 1.6 and minimize downtime, you can set up a sidecar. This sidecar intercepts Instance Metadata Service (IMDS) traffic and routes them to Azure Active Directory (Azure AD) using OpenID Connect (OIDC). This enables you to run pod-identity, other credential method, and the Azure AD workload identity (preview) in parallel on the cluster until you have your migration plan ready to completely move to using the Azure AD workload identity.

This article shows you how to set up your pod to authenticate using a workload identity as an short-term migration solution.

## Create a Managed Identity

If you don't have a managed identity already created and assigned to your pod, perform the following steps to create and assign it the necessary rights to storage, Key Vault, or whatever resources your application needs to authenticate with in Azure.

1. Use the Azure CLI [az account set][az-account-set] command to set a specific subscription to be the current active subscription. Then use the [az identity create][az-identity-create] command to create a Managed Identity.

    ```azurecli
    az account set --subscription "subscriptionID"
    ```

    ```azurecli
    az identity create --name "userAssignedIdentityName" --resource-group "resourceGroupName" --location "location" --subscription "subscriptionID"
    ```

2. Grant the managed identity the rights required to access the resources in Azure it requires.

3. To get the OIDC Issuer URL and save it to an environmental variable, run the following command. Replace the default values for the cluster name and the resource group name.

    ```bash
    export AKS_OIDC_ISSUER="$(az aks show -n myAKSCluster -g myResourceGroup --query "oidcIssuerProfile.issuerUrl" -otsv)"
    ```

## Create Kubernetes service account

If you don't already have a dedicated Kubernetes service account created for this application(s), perform the following steps to create and then annotate it with the client ID of the Managed Identity created in the previous step. Use the [az aks get-credentials][az-aks-get-credentials] command and replace the values for the cluster name and the resource group name.

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

> [!NOTE]
> It takes a few seconds for the federated identity credential to be propagated after being initially added. If a token request is made immediately after adding the federated identity credential, it might lead to failure for a couple of minutes as the cache is populated in the directory with old data. To avoid this issue, you can add a slight delay after adding the federated identity credential.

## Deploy the workload

To update or deploy the workload, add these pod annotations only if you want to use the migration sidecar. You add inject the following [annotation][pod-annotations] values in order to leverage the sidecar in your pod specification:

* `azure.workload.identity/inject-proxy-sidecar` - value is `true` or `false`
* `azure.workload.identity/proxy-sidecar-port` - value is the desired port you want the sidecar to communicate with. The default value is `8080`. 

The webhook that is already running adds the following YAML snippets to the pod deployment (Link to example reference in the overview article - table). The following example, is the complete pod annotation:

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
    image: mcr.microsoft.com/oss/azure/workload-identity/proxy:v0.13.0
    ports:
    - containerPort: 8000
```

This configuration applies to any configuration where a pod is being created. After updating or deploying your application, you can verify the pod is in a running state using the [kubectl describe pod][kubectl-describe] command. Replace the value `podName` with the image name of your deployed pod.

```bash
kubectl describe pods podName
```

To verify that pod is passing IMDS transactions, use the [kubectl logs][kubelet-logs] command. Replace the value `podName` with the image name of your deployed pod:

```bash
kubectl logs podName
```

The following log output resembles successful communication through the proxy sidecar. Verify that the logs show a token is successfully acquired and the GET operation is successful.

```output
proxy "msg"="starting the proxy server" "port"=8080 "userAgent"="azure-workload-identity/proxy/v0.13.0-12-gc8527f3
"method"="GET" "uri"="/metadata/identity/oauth2/token?resource=https://management.core.windows.net/api-version=2018-02-01
proxy "msg"="successfully acquired token"
proxy "msg"="received token request"
```

## Next steps

This article showed you how to set up your pod to authenticate using a workload identity as a migration option. For more information about Azure AD workload identity (preview), see the following [Overview][workload-identity-overview] article.

<!-- INTERNAL LINKS -->
[pod-annotations]: workload-identity-overview.md#pod-annotations
[az-identity-create]: /cli/azure/identity#az-identity-create
[az-account-set]: /cli/azure/account#az-account-set
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[workload-identity-overview]: workload-identity-overview.md
[az-identity-federated-credential-create]: /cli/azure/identity/federated-credential#az-identity-federated-credential-create

<!-- EXTERNAL LINKS -->
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe