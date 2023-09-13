---
title: Integrate Azure Active Directory with Azure Kubernetes Service (AKS) (legacy)
description: Learn how to use the Azure CLI to create and Azure Active Directory-enabled Azure Kubernetes Service (AKS) cluster (legacy)
author: TomGeske
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 08/15/2023
ms.author: miwithro
---

# Integrate Azure Active Directory with Azure Kubernetes Service (AKS) using the Azure CLI (legacy)

> [!WARNING]
> The feature described in this document, Azure AD Integration (legacy) was **deprecated on June 1st, 2023**. At this time, no new clusters can be created with Azure AD Integration (legacy). All Azure AD Integration (legacy) AKS clusters will be migrated to AKS-managed Azure AD automatically starting from December 1st, 2023.
>
> AKS has a new improved [AKS-managed Azure AD][managed-aad] experience that doesn't require you to manage server or client applications. If you want to migrate follow the instructions [here][managed-aad-migrate].

Azure Kubernetes Service (AKS) can be configured to use Azure Active Directory (AD) for user authentication. In this configuration, you can log into an AKS cluster using an Azure AD authentication token. Cluster operators can also configure Kubernetes role-based access control (Kubernetes RBAC) based on a user's identity or directory group membership.

This article shows you how to create the required Azure AD components, then deploy an Azure AD-enabled cluster and create a basic Kubernetes role in the AKS cluster.

## Limitations

- Azure AD can only be enabled on Kubernetes RBAC-enabled cluster.
- Azure AD legacy integration can only be enabled during cluster creation.

## Before you begin

You need the Azure CLI version 2.0.61 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

Go to [https://shell.azure.com](https://shell.azure.com) to open Cloud Shell in your browser.

For consistency and to help run the commands in this article, create a variable for your desired AKS cluster name. The following example uses the name *myakscluster*:

```console
aksname="myakscluster"
```

## Azure AD authentication overview

Azure AD authentication is provided to AKS clusters with OpenID Connect. OpenID Connect is an identity layer built on top of the OAuth 2.0 protocol. For more information on OpenID Connect, see the [Open ID connect documentation][open-id-connect].

From inside of the Kubernetes cluster, Webhook Token Authentication is used to verify authentication tokens. Webhook token authentication is configured and managed as part of the AKS cluster. For more information on Webhook token authentication, see the [webhook authentication documentation][kubernetes-webhook].

> [!NOTE]
> When configuring Azure AD for AKS authentication, two Azure AD applications are configured. This operation must be completed by an Azure tenant administrator.

## Create Azure AD server component

To integrate with AKS, you create and use an Azure AD application that acts as an endpoint for the identity requests. The first Azure AD application you need gets Azure AD group membership for a user.

Create the server application component using the [az ad app create][az-ad-app-create] command, then update the group membership claims using the [az ad app update][az-ad-app-update] command. The following example uses the *aksname* variable defined in the [Before you begin](#before-you-begin) section, and creates a variable

```azurecli-interactive
# Create the Azure AD application
serverApplicationId=$(az ad app create \
    --display-name "${aksname}Server" \
    --identifier-uris "https://${aksname}Server" \
    --query appId -o tsv)

# Update the application group membership claims
az ad app update --id $serverApplicationId --set groupMembershipClaims=All
```

Now create a service principal for the server app using the [az ad sp create][az-ad-sp-create] command. This service principal is used to authenticate itself within the Azure platform. Then, get the service principal secret using the [az ad sp credential reset][az-ad-sp-credential-reset] command and assign to the variable named *serverApplicationSecret* for use in one of the following steps:

```azurecli-interactive
# Create a service principal for the Azure AD application
az ad sp create --id $serverApplicationId

# Get the service principal secret
serverApplicationSecret=$(az ad sp credential reset \
    --name $serverApplicationId \
    --credential-description "AKSPassword" \
    --query password -o tsv)
```

The Azure AD service principal needs permissions to perform the following actions:

* Read directory data
* Sign in and read user profile

Assign these permissions using the [az ad app permission add][az-ad-app-permission-add] command:

```azurecli-interactive
az ad app permission add \
    --id $serverApplicationId \
    --api 00000003-0000-0000-c000-000000000000 \
    --api-permissions e1fe6dd8-ba31-4d61-89e7-88639da4683d=Scope 06da0dbc-49e2-44d2-8312-53f166ab848a=Scope 7ab1d382-f21e-4acd-a863-ba3e13f7da61=Role
```

Finally, grant the permissions assigned in the previous step for the server application using the [az ad app permission grant][az-ad-app-permission-grant] command. This step fails if the current account is not a tenant admin. You also need to add permissions for Azure AD application to request information that may otherwise require administrative consent using the [az ad app permission admin-consent][az-ad-app-permission-admin-consent]:

```azurecli-interactive
az ad app permission grant --id $serverApplicationId --api 00000003-0000-0000-c000-000000000000
az ad app permission admin-consent --id  $serverApplicationId
```

## Create Azure AD client component

The second Azure AD application is used when a user logs to the AKS cluster with the Kubernetes CLI (`kubectl`). This client application takes the authentication request from the user and verifies their credentials and permissions. Create the Azure AD app for the client component using the [az ad app create][az-ad-app-create] command:

```azurecli-interactive
clientApplicationId=$(az ad app create \
    --display-name "${aksname}Client" \
    --native-app \
    --reply-urls "https://${aksname}Client" \
    --query appId -o tsv)
```

Create a service principal for the client application using the [az ad sp create][az-ad-sp-create] command:

```azurecli-interactive
az ad sp create --id $clientApplicationId
```

Get the oAuth2 ID for the server app to allow the authentication flow between the two app components using the [az ad app show][az-ad-app-show] command. This oAuth2 ID is used in the next step.

```azurecli-interactive
oAuthPermissionId=$(az ad app show --id $serverApplicationId --query "oauth2Permissions[0].id" -o tsv)
```

Add the permissions for the client application and server application components to use the oAuth2 communication flow using the [az ad app permission add][az-ad-app-permission-add] command. Then, grant permissions for the client application to communication with the server application using the [az ad app permission grant][az-ad-app-permission-grant] command:

```azurecli-interactive
az ad app permission add --id $clientApplicationId --api $serverApplicationId --api-permissions ${oAuthPermissionId}=Scope
az ad app permission grant --id $clientApplicationId --api $serverApplicationId
```

## Deploy the cluster

With the two Azure AD applications created, now create the AKS cluster itself. First, create a resource group using the [az group create][az-group-create] command. The following example creates the resource group in the *EastUS* region:

Create a resource group for the cluster:

```azurecli-interactive
az group create --name myResourceGroup --location EastUS
```

Get the tenant ID of your Azure subscription using the [az account show][az-account-show] command. Then, create the AKS cluster using the [az aks create][az-aks-create] command. The command to create the AKS cluster provides the server and client application IDs, the server application service principal secret, and your tenant ID:

```azurecli-interactive
tenantId=$(az account show --query tenantId -o tsv)

az aks create \
    --resource-group myResourceGroup \
    --name $aksname \
    --node-count 1 \
    --generate-ssh-keys \
    --aad-server-app-id $serverApplicationId \
    --aad-server-app-secret $serverApplicationSecret \
    --aad-client-app-id $clientApplicationId \
    --aad-tenant-id $tenantId
```

Finally, get the cluster admin credentials using the [az aks get-credentials][az-aks-get-credentials] command. In one of the following steps, you get the regular *user* cluster credentials to see the Azure AD authentication flow in action.

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name $aksname --admin
```

## Create Kubernetes RBAC binding

Before an Azure Active Directory account can be used with the AKS cluster, a role binding or cluster role binding needs to be created. *Roles* define the permissions to grant, and *bindings* apply them to desired users. These assignments can be applied to a given namespace, or across the entire cluster. For more information, see [Using Kubernetes RBAC authorization][rbac-authorization].

Get the user principal name (UPN) for the user currently logged in using the [az ad signed-in-user show][az-ad-signed-in-user-show] command. This user account is enabled for Azure AD integration in the next step.

```azurecli-interactive
az ad signed-in-user show --query userPrincipalName -o tsv
```

> [!IMPORTANT]
> If the user you grant the Kubernetes RBAC binding for is in the same Azure AD tenant, assign permissions based on the *userPrincipalName*. If the user is in a different Azure AD tenant, query for and use the *objectId* property instead.

Create a YAML manifest named `basic-azure-ad-binding.yaml` and paste the following contents. On the last line, replace *userPrincipalName_or_objectId*  with the UPN or object ID output from the previous command:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: contoso-cluster-admins
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: User
  name: userPrincipalName_or_objectId
```

Create the ClusterRoleBinding using the [kubectl apply][kubectl-apply] command and specify the filename of your YAML manifest:

```console
kubectl apply -f basic-azure-ad-binding.yaml
```

## Access cluster with Azure AD

Now let's test the integration of Azure AD authentication for the AKS cluster. Set the `kubectl` config context to use regular user credentials. This context passes all authentication requests back through Azure AD.

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name $aksname --overwrite-existing
```

Now use the [kubectl get pods][kubectl-get] command to view pods across all namespaces:

```console
kubectl get pods --all-namespaces
```

You receive a sign in prompt to authenticate using Azure AD credentials using a web browser. After you've successfully authenticated, the `kubectl` command displays the pods in the AKS cluster, as shown in the following example output:

```console
kubectl get pods --all-namespaces
```

```output
To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code BYMK7UXVD to authenticate.

NAMESPACE     NAME                                    READY   STATUS    RESTARTS   AGE
kube-system   coredns-754f947b4-2v75r                 1/1     Running   0          23h
kube-system   coredns-754f947b4-tghwh                 1/1     Running   0          23h
kube-system   coredns-autoscaler-6fcdb7d64-4wkvp      1/1     Running   0          23h
kube-system   heapster-5fb7488d97-t5wzk               2/2     Running   0          23h
kube-system   kube-proxy-2nd5m                        1/1     Running   0          23h
kube-system   kube-svc-redirect-swp9r                 2/2     Running   0          23h
kube-system   kubernetes-dashboard-847bb4ddc6-trt7m   1/1     Running   0          23h
kube-system   metrics-server-7b97f9cd9-btxzz          1/1     Running   0          23h
kube-system   tunnelfront-6ff887cffb-xkfmq            1/1     Running   0          23h
```

The authentication token received for `kubectl` is cached. You are only reprompted to sign in when the token has expired or the Kubernetes config file is re-created.

If you see an authorization error message after you've successfully signed in using a web browser as in the following example output, check the following possible issues:

```output
error: You must be logged in to the server (Unauthorized)
```

* You defined the appropriate object ID or UPN, depending on if the user account is in the same Azure AD tenant or not.
* The user is not a member of more than 200 groups.
* Secret defined in the application registration for server matches the value configured using `--aad-server-app-secret`
* Be sure that only one version of kubectl is installed on your machine at a time. Conflicting versions can cause issues during authorization. To install the latest version, use [az aks install-cli][az-aks-install-cli].

## Frequently asked questions about migration from Azure Active Directory Integration to AKS-managed Azure Active Directory

**1. What is the plan for migration?**

Azure Active Directory Integration (legacy) will be deprecated on 1st June 2023. After this date, you won't be able to create new clusters with Azure Active Directory (legacy). We'll migrate all Azure Active Directory Integration (legacy) AKS clusters to AKS-managed Azure Active Directory automatically starting from 1st August 2023.
We send notification emails to impacted subscription admins biweekly to remind them of migration.

**2. What will happen if I don't take any action?**

Your Azure Active Directory Integration (legacy) AKS clusters will continue working after 1st June 2023. We'll automatically migrate your clusters to AKS-managed Azure Active Directory starting from 1st August 2023. You may experience API server downtime during the migration.

The kubeconfig content changes after the migration. You need to merge the new credentials into the kubeconfig file using the `az aks get-credentials --resource-group <AKS resource group name> --name <AKS cluster name>`.

We recommend updating your AKS cluster to [AKS-managed Azure Active Directory][managed-aad-migrate] manually before 1st August. This way you can manage the downtime during non-business hours when it's more convenient.

**3. Why do I still receive the notification email after manual migration?**

It takes several days for the email to send. If your cluster wasn't migrated before we initiate the email-sending process, you may still receive a notification.

**4. How can I check whether my cluster my cluster is migrated to AKS-managed Azure Active Directory?**

Confirm your AKS cluster is migrated to the AKS-managed Azure Active Directory using the [`az aks show`][az-aks-show] command.

```azurecli
az aks show -g <RGName> -n <ClusterName>  --query "aadProfile"
```

If your cluster is using the AKS-managed Azure Active Directory, the output shows `managed` is `true`.  For example:

```output
    {
      "adminGroupObjectIDs": [
        "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
      ],
      "adminUsers": null,
      "clientAppId": null,
      "enableAzureRbac": null,
      "managed": true,
      "serverAppId": null,
      "serverAppSecret": null,
      "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    }
 ```


## Next steps

For the complete script that contains the commands shown in this article, see the [Azure AD integration script in the AKS samples repo][complete-script].

To use Azure AD users and groups to control access to cluster resources, see [Control access to cluster resources using Kubernetes role-based access control and Azure AD identities in AKS][azure-ad-rbac].

For more information about how to secure Kubernetes clusters, see [Access and identity options for AKS)][rbac-authorization].

For best practices on identity and resource control, see [Best practices for authentication and authorization in AKS][operator-best-practices-identity].

<!-- LINKS - external -->
[kubernetes-webhook]:https://kubernetes.io/docs/reference/access-authn-authz/authentication/#webhook-token-authentication
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get

<!-- LINKS - internal -->
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[az-aks-install-cli]: /cli/azure/aks#az_aks_install_cli
[az-group-create]: /cli/azure/group#az_group_create
[open-id-connect]: ../active-directory/develop/v2-protocols-oidc.md
[az-ad-user-show]: /cli/azure/ad/user#az_ad_user_show
[az-ad-app-create]: /cli/azure/ad/app#az_ad_app_create
[az-ad-app-update]: /cli/azure/ad/app#az_ad_app_update
[az-ad-sp-create]: /cli/azure/ad/sp#az_ad_sp_create
[az-ad-app-permission-add]: /cli/azure/ad/app/permission#az_ad_app_permission_add
[az-ad-app-permission-grant]: /cli/azure/ad/app/permission#az_ad_app_permission_grant
[az-ad-app-permission-admin-consent]: /cli/azure/ad/app/permission#az_ad_app_permission_admin_consent
[az-ad-app-show]: /cli/azure/ad/app#az_ad_app_show
[az-group-create]: /cli/azure/group#az_group_create
[az-account-show]: /cli/azure/account#az_account_show
[az-ad-signed-in-user-show]: /cli/azure/ad/signed-in-user#az_ad_signed_in_user_show
[install-azure-cli]: /cli/azure/install-azure-cli
[az-ad-sp-credential-reset]: /cli/azure/ad/sp/credential#az_ad_sp_credential_reset
[rbac-authorization]: concepts-identity.md#kubernetes-rbac
[operator-best-practices-identity]: operator-best-practices-identity.md
[azure-ad-rbac]: azure-ad-rbac.md
[managed-aad]: managed-azure-ad.md
[managed-aad-migrate]: managed-azure-ad.md#upgrade-a-legacy-azure-ad-cluster-to-aks-managed-azure-ad-integration
[az-aks-show]: /cli/azure/aks#az_aks_show
