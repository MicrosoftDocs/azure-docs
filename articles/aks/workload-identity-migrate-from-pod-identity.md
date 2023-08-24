---
title: Migrate your Azure Kubernetes Service (AKS) pod to use workload identity
description: In this Azure Kubernetes Service (AKS) article, you learn how to configure your Azure Kubernetes Service pod to authenticate with workload identity.
ms.topic: article
ms.custom: devx-track-azurecli, devx-track-linux
ms.date: 07/31/2023
---

# Migrate from pod managed-identity to workload identity

This article focuses on migrating from a pod-managed identity to Azure Active Directory (Azure AD) workload identity for your Azure Kubernetes Service (AKS) cluster. It also provides guidance depending on the version of the [Azure Identity][azure-identity-supported-versions] client library used by your container-based application.

If you aren't familiar with Azure AD workload identity, see the following [Overview][workload-identity-overview] article.

## Before you begin

The Azure CLI version 2.47.0 or later. Run `az --version` to find the version, and run `az upgrade` to upgrade the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Migration scenarios

This section explains the migration options available depending on what version of the Azure Identity SDK is installed.

For either scenario, you need to have the federated trust set up before you update your application to use the workload identity. The following are the minimum steps required:

- [Create a managed identity](#create-a-managed-identity) credential.
- Associate the managed identity with the kubernetes service account already used for the pod-manged identity or [create a new Kubernetes service account](#create-kubernetes-service-account) and then associate it with the managed identity.
- [Establish a federated trust relationship](#establish-federated-identity-credential-trust) between the managed identity and Azure AD.

### Migrate from latest version

If your cluster is already using the latest version of the Azure Identity SDK, perform the following steps to complete the authentication configuration:

- Deploy workload identity in parallel with pod-managed identity. You can restart your application deployment to begin using the workload identity, where it injects the OIDC annotations into the application automatically.
- After verifying the application is able to authenticate successfully, you can [remove the pod-managed identity](#remove-pod-managed-identity) annotations from your application and then remove the pod-managed identity add-on.

### Migrate from older version

If your cluster isn't using the latest version of the Azure Identity SDK, you have two options:

- You can use a migration sidecar that we provide within your Linux applications, which proxies the IMDS transactions your application makes over to [OpenID Connect][openid-connect-overview] (OIDC). The migration sidecar isn't intended to be a long-term solution, but a way to get up and running quickly on workload identity. Perform the following steps to:

    - [Deploy the workload with migration sidecar](#deploy-the-workload-with-migration-sidecar) to proxy the application IMDS transactions.
    - Verify the authentication transactions are completing successfully.
    - Schedule the work for the applications to update there SDK's to a supported version.
    - Once the SDK's are updated to the supported version, you can remove the proxy sidecar and redeploy the application.

   > [!NOTE]
   > The migration sidecar is **not supported for production use**. This feature is meant to give you time to migrate your application SDK's to a supported version, and not meant or intended to be a long-term solution.
   > The migration sidecar is only available for Linux containers, due to only providing pod-managed identities with Linux node pools.

- Rewrite your application to support the latest version of the [Azure Identity][azure-identity-supported-versions] client library. Afterwards, perform the following steps:

    - Restart your application deployment to begin authenticating using the workload identity.
    - Once you verify the authentication transactions are completing successfully, you can [remove the pod-managed identity](#remove-pod-managed-identity) annotations from your application and then remove the pod-managed identity add-on.

## Create a managed identity

If you don't have a managed identity created and assigned to your pod, perform the following steps to create and grant the necessary permissions to storage, Key Vault, or whatever resources your application needs to authenticate with in Azure.

1. Use the Azure CLI [az account set][az-account-set] command to set a specific subscription to be the current active subscription. Then use the [az identity create][az-identity-create] command to create a managed identity.

    ```azurecli-interactive
    az account set --subscription "subscriptionID"
    ```

    ```azurecli-interactive
    az identity create --name "userAssignedIdentityName" --resource-group "resourceGroupName" --location "location" --subscription "subscriptionID"
    ```

    ```bash
    export USER_ASSIGNED_CLIENT_ID="$(az identity show --resource-group "resourceGroupName" --name "userAssignedIdentityName" --query 'clientId' -otsv)"
    ```

2. Grant the managed identity the permissions required to access the resources in Azure it requires. For information on how to do this, see [Assign a managed identity access to a resource][assign-rbac-managed-identity].

3. To get the OIDC Issuer URL and save it to an environmental variable, run the following command. Replace the default values for the cluster name and the resource group name.

    ```bash
    export AKS_OIDC_ISSUER="$(az aks show -n myAKSCluster -g myResourceGroup --query "oidcIssuerProfile.issuerUrl" -otsv)"
    ```

    The variable should contain the Issuer URL similar to the following example:

    ```output
    https://eastus.oic.prod-aks.azure.com/00000000-0000-0000-0000-000000000000/00000000-0000-0000-0000-000000000000/
    ```

    By default, the Issuer is set to use the base URL `https://{region}.oic.prod-aks.azure.com/{uuid}`, where the value for `{region}` matches the location the AKS cluster is deployed in. The value `{uuid}` represents the OIDC key.

## Create Kubernetes service account

If you don't have a dedicated Kubernetes service account created for this application, perform the following steps to create and then annotate it with the client ID of the managed identity created in the previous step. Use the [az aks get-credentials][az-aks-get-credentials] command and replace the values for the cluster name and the resource group name.

```azurecli-interactive
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
  name: ${SERVICE_ACCOUNT_NAME}
  namespace: ${SERVICE_ACCOUNT_NAMESPACE}
EOF
```

The following output resembles successful creation of the identity:

```output
Serviceaccount/workload-identity-sa created
```

## Establish federated identity credential trust

Use the [az identity federated-credential create][az-identity-federated-credential-create] command to create the federated identity credential between the managed identity, the service account issuer, and the subject. Replace the values `resourceGroupName`, `userAssignedIdentityName`, `federatedIdentityName`, `serviceAccountNamespace`, and `serviceAccountName`.

```azurecli-interactive
az identity federated-credential create --name federatedIdentityName --identity-name userAssignedIdentityName --resource-group resourceGroupName --issuer ${AKS_OIDC_ISSUER} --subject system:serviceaccount:${SERVICE_ACCOUNT_NAMESPACE}:${SERVICE_ACCOUNT_NAME} --audience api://AzureADTokenExchange
```

> [!NOTE]
> It takes a few seconds for the federated identity credential to be propagated after being initially added. If a token request is made immediately after adding the federated identity credential, it might lead to failure for a couple of minutes as the cache is populated in the directory with old data. To avoid this issue, you can add a slight delay after adding the federated identity credential.

## Deploy the workload with migration sidecar

> [!NOTE]
> The migration sidecar is **not supported for production use**.  This feature is meant to give you time to migrate your application SDK's to a supported version, and not meant or intended to be a long-term solution.
> The migration sidecar is only for Linux containers as pod-managed identities was available on Linux node pools only.

If your application is using managed identity and still relies on IMDS to get an access token, you can use the workload identity migration sidecar to start migrating to workload identity. This sidecar is a migration solution and in the long-term applications, you should modify their code to use the latest Azure Identity SDKs that support client assertion.

To update or deploy the workload, add these pod annotations only if you want to use the migration sidecar. You inject the following [annotation][pod-annotations] values to use the sidecar in your pod specification:

* `azure.workload.identity/inject-proxy-sidecar` - value is `true` or `false`
* `azure.workload.identity/proxy-sidecar-port` - value is the desired port for the proxy sidecar. The default value is `8000`.

When a pod with the above annotations is created, the Azure Workload Identity mutating webhook automatically injects the init-container and proxy sidecar to the pod spec.

The webhook that is already running adds the following YAML snippets to the pod deployment. The following is an example of the mutated pod spec:

```yml
apiVersion: v1
kind: Pod
metadata:
  name: httpbin-pod
  labels:
    app: httpbin
    azure.workload.identity/use: "true"
  annotations:
    azure.workload.identity/inject-proxy-sidecar: "true"
spec:
  serviceAccountName: workload-identity-sa
  initContainers:
  - name: init-networking
    image: mcr.microsoft.com/oss/azure/workload-identity/proxy-init:v1.1.0
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
    image: mcr.microsoft.com/oss/azure/workload-identity/proxy:v1.1.0
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
I0926 00:29:29.968723       1 proxy.go:97] proxy "msg"="starting the proxy server" "port"=8080 "userAgent"="azure-workload-identity/proxy/v0.13.0-12-gc8527f3 (linux/amd64) c8527f3/2022-09-26-00:19" 
I0926 00:29:29.972496       1 proxy.go:173] proxy "msg"="received readyz request" "method"="GET" "uri"="/readyz" 
I0926 00:29:30.936769       1 proxy.go:107] proxy "msg"="received token request" "method"="GET" "uri"="/metadata/identity/oauth2/token?resource=https://management.core.windows.net/api-version=2018-02-01&client_id=<client_id>" 
I0926 00:29:31.101998       1 proxy.go:129] proxy "msg"="successfully acquired token" "method"="GET" "uri"="/metadata/identity/oauth2/token?resource=https://management.core.windows.net/api-version=2018-02-01&client_id=<client_id>"
```

## Remove pod-managed identity

After you've completed your testing and the application is successfully able to get a token using the proxy sidecar, you can remove the Azure AD pod-managed identity mapping for the pod from your cluster, and then remove the identity.

1. Run the [az aks pod-identity delete][az-aks-pod-identity-delete] command to remove the identity from your pod. This should only be done after all pods in the namespace using the pod-managed identity mapping have migrated to use the sidecar.

    ```azurecli-interactive
    az aks pod-identity delete --name podIdentityName --namespace podIdentityNamespace --resource-group myResourceGroup --cluster-name myAKSCluster
    ```

## Next steps

This article showed you how to set up your pod to authenticate using a workload identity as a migration option. For more information about Azure AD workload identity, see the following [Overview][workload-identity-overview] article.

<!-- INTERNAL LINKS -->
[pod-annotations]: workload-identity-overview.md#pod-annotations
[az-identity-create]: /cli/azure/identity#az-identity-create
[az-account-set]: /cli/azure/account#az-account-set
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[workload-identity-overview]: workload-identity-overview.md
[az-identity-federated-credential-create]: /cli/azure/identity/federated-credential#az-identity-federated-credential-create
[az-aks-pod-identity-delete]: /cli/azure/aks/pod-identity#az-aks-pod-identity-delete
[azure-identity-supported-versions]: workload-identity-overview.md#dependencies
[azure-identity-libraries]: ../active-directory/develop/reference-v2-libraries.md
[openid-connect-overview]: ../active-directory/develop/v2-protocols-oidc.md
[install-azure-cli]: /cli/azure/install-azure-cli
[assign-rbac-managed-identity]: ../active-directory/managed-identities-azure-resources/howto-assign-access-cli.md

<!-- EXTERNAL LINKS -->
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe
[kubelet-logs]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#logs
