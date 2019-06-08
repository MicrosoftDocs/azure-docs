---
title: Integrate Azure Active Directory with Azure Kubernetes Service
description: How to create Azure Active Directory-enabled Azure Kubernetes Service (AKS) clusters.
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: article
ms.date: 04/26/2019
ms.author: iainfou
---

# Integrate Azure Active Directory with Azure Kubernetes Service

Azure Kubernetes Service (AKS) can be configured to use Azure Active Directory (AD) for user authentication. In this configuration, you can sign in to an AKS cluster using your Azure Active Directory authentication token. Additionally, cluster administrators are able to configure Kubernetes role-based access control (RBAC) based on a user's identity or directory group membership.

This article shows you how to deploy the prerequisites for AKS and Azure AD, then how to deploy an Azure AD-enabled cluster and create a basic RBAC role in the AKS cluster using the Azure portal. You can also [complete these steps using the Azure CLI][azure-ad-cli].

The following limitations apply:

- Azure AD can only be enabled when you create a new, RBAC-enabled cluster. You can't enable Azure AD on an existing AKS cluster.

## Authentication details

Azure AD authentication is provided to AKS clusters with OpenID Connect. OpenID Connect is an identity layer built on top of the OAuth 2.0 protocol. For more information on OpenID Connect, see the [Open ID connect documentation][open-id-connect].

From inside of the Kubernetes cluster, Webhook Token Authentication is used to verify authentication tokens. Webhook token authentication is configured and managed as part of the AKS cluster. For more information on Webhook token authentication, see the [webhook authentication documentation][kubernetes-webhook].

To provide Azure AD authentication for an AKS cluster, two Azure AD applications are created. The first application is a server component that provides the user authentication. The second application is a client component that is used when you are prompted by the CLI for authentication. This client application uses the server application for the actual authentication of the credentials provided by the client.

> [!NOTE]
> When configuring Azure AD for AKS authentication, two Azure AD application are configured. The steps to delegate permissions for each of the applications must be completed by an Azure tenant administrator.

## Create server application

The first Azure AD application is used to get a users Azure AD group membership. Create this application in the Azure portal.

1. Select **Azure Active Directory** > **App registrations** > **New registration**.

    * Give the application a name, such as *AKSAzureADServer*.
    * For **Supported account types**, choose *Accounts in this organizational directory only*.
    * Choose *Web* for the **Redirect URI** type, and enter any URI formatted value such as *https://aksazureadserver*.
    * Select **Register** when done.

1. Select **Manifest** and edit the `groupMembershipClaims` value to `"All"`.

    ![Update group membership to all](media/aad-integration/edit-manifest.png)

    **Save** the updates once complete.

1. On the left-hand navigation of the Azure AD application, select **Certificates & secrets**.

    * Choose **+ New client secret**.
    * Add a key description, such as *AKS Azure AD server*. Choose an expiration time, then select **Add**.
    * Take note of the key value. It's only displayed this initial time. When you deploy an Azure AD-enabled AKS cluster, this value is referred to as the `Server application secret`.

1. On the left-hand navigation of the Azure AD application, select **API permissions**, then choose to **+ Add a permission**.

    * Under **Microsoft APIs**, choose *Microsoft Graph*.
    * Choose **Delegated permissions**, then place a check next to **Directory > Directory.Read.All (Read directory data)**.
        * If a default delegated permission for **User > User.Read (Sign in and read user profile)** doesn't exist, place a check this permission.
    * Choose **Application permissions**, then place a check next to **Directory > Directory.Read.All (Read directory data)**.

        ![Set graph permissions](media/aad-integration/graph-permissions.png)

    * Choose **Add permissions** to save the updates.

    * Under the **Grant consent** section, choose to **Grant admin consent**. This button is greyed out and is unavailable if the current account is not a tenant admin.

        When the permissions have been successfully granted, the following notification is displayed in the portal:

        ![Notification of successful permissions granted](media/aad-integration/permissions-granted.png)

1. On the left-hand navigation of the Azure AD application, select **Expose an API**, then choose to **+ Add a scope**.
    
    * Set a *Scope name*, *admin consent display name*, and *admin consent description*, such as *AKSAzureADServer*.
    * Make sure the **State** is set to *Enabled*.

        ![Expose the server app as an API for use with other services](media/aad-integration/expose-api.png)

    * Choose **Add scope**.

1. Return to the application **Overview** page and take note of the **Application (client) ID**. When you deploy an Azure AD-enabled AKS cluster, this value is referred to as the `Server application ID`.

   ![Get application ID](media/aad-integration/application-id.png)

## Create client application

The second Azure AD application is used when logging in with the Kubernetes CLI (`kubectl`).

1. Select **Azure Active Directory** > **App registrations** > **New registration**.

    * Give the application a name, such as *AKSAzureADClient*.
    * For **Supported account types**, choose *Accounts in this organizational directory only*.
    * Choose *Web* for the **Redirect URI** type, and enter any URI formatted value such as *https://aksazureadclient*.
    * Select **Register** when done.

1. On the left-hand navigation of the Azure AD application, select **API permissions**, then choose to **+ Add a permission**.

    * Select **My APIs**, then choose your Azure AD server application created in the previous step, such as *AKSAzureADServer*.
    * Choose **Delegated permissions**, then place a check next to your Azure AD server app.

        ![Configure application permissions](media/aad-integration/select-api.png)

    * Select **Add permissions**.

    * Under the **Grant consent** section, choose to **Grant admin consent**. This button is greyed out and is unavailable if the current account is not a tenant admin.

        When the permissions have been successfully granted, the following notification is displayed in the portal:

        ![Notification of successful permissions granted](media/aad-integration/permissions-granted.png)

1. On the left-hand navigation of the Azure AD application, select **Authentication**.

    * Under **Default client type**, select **Yes** to *Treat the client as a public client*.

1. On the left-hand navigation of the Azure AD application, take note of the **Application ID**. When deploying an Azure AD-enabled AKS cluster, this value is referred to as the `Client application ID`.

   ![Get the application ID](media/aad-integration/application-id-client.png)

## Get tenant ID

Finally, get the ID of your Azure tenant. This value is used when you create the AKS cluster.

From the Azure portal, select **Azure Active Directory** > **Properties** and take note of the **Directory ID**. When you create an Azure AD-enabled AKS cluster, this value is referred to as the `Tenant ID`.

![Get the Azure tenant ID](media/aad-integration/tenant-id.png)

## Deploy Cluster

Use the [az group create][az-group-create] command to create a resource group for the AKS cluster.

```azurecli
az group create --name myResourceGroup --location eastus
```

Deploy the cluster using the [az aks create][az-aks-create] command. Replace the values in the sample command below with the values collected when creating the Azure AD applications for the server app ID and secret, client app ID, and tenant ID:

```azurecli
az aks create \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --generate-ssh-keys \
  --aad-server-app-id b1536b67-29ab-4b63-b60f-9444d0c15df1 \
  --aad-server-app-secret wHYomLe2i1mHR2B3/d4sFrooHwADZccKwfoQwK2QHg= \
  --aad-client-app-id 8aaf8bd5-1bdd-4822-99ad-02bfaa63eea7 \
  --aad-tenant-id 72f988bf-0000-0000-0000-2d7cd011db47
```

It takes a few minutes to create the AKS cluster.

## Create RBAC binding

Before an Azure Active Directory account can be used with the AKS cluster, a role binding or cluster role binding needs to be created. *Roles* define the permissions to grant, and *bindings* apply them to desired users. These assignments can be applied to a given namespace, or across the entire cluster. For more information, see [Using RBAC authorization][rbac-authorization].

First, use the [az aks get-credentials][az-aks-get-credentials] command with the `--admin` argument to sign in to the cluster with admin access.

```azurecli
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster --admin
```

Next, create a ClusterRoleBinding for an Azure AD account that you want to grant access to the AKS cluster. The following example gives the account full access to all namespaces in the cluster.

- If the user you grant the RBAC binding for is in the same Azure AD tenant, assign permissions based on the user principal name (UPN). Move on to the step to create the YAML manifest for the ClusterRuleBinding.

- If the user is in a different Azure AD tenant, query for and use the *objectId* property instead. If needed, get the *objectId* of the required user account using the [az ad user show][az-ad-user-show] command. Provide the user principal name (UPN) of the required account:

    ```azurecli-interactive
    az ad user show --upn-or-object-id user@contoso.com --query objectId -o tsv
    ```

Create a file, such as *rbac-aad-user.yaml*, and paste the following contents. On the last line, replace *userPrincipalName_or_objectId*  with the UPN or object ID depending on if the user is the same Azure AD tenant or not.

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

Apply the binding using the [kubectl apply][kubectl-apply] command as shown in the following example:

```console
kubectl apply -f rbac-aad-user.yaml
```

A role binding can also be created for all members of an Azure AD group. Azure AD groups are specified using the group object ID, as shown in the following example. Create a file, such as *rbac-aad-group.yaml*, and paste the following contents. Update the group object ID with one from your Azure AD tenant:

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
   kind: Group
   name: "894656e1-39f8-4bfe-b16a-510f61af6f41"
```

Apply the binding using the [kubectl apply][kubectl-apply] command as shown in the following example:

```console
kubectl apply -f rbac-aad-group.yaml
```

For more information on securing a Kubernetes cluster with RBAC, see [Using RBAC Authorization][rbac-authorization].

## Access cluster with Azure AD

Next, pull the context for the non-admin user using the [az aks get-credentials][az-aks-get-credentials] command.

```azurecli
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```

After you run a `kubectl` command, you are prompted to authenticate with Azure. Follow the on-screen instructions to complete the process, as shown in the following example:

```console
$ kubectl get nodes

To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code BUJHWDGNL to authenticate.

NAME                       STATUS    ROLES     AGE       VERSION
aks-nodepool1-79590246-0   Ready     agent     1h        v1.13.5
aks-nodepool1-79590246-1   Ready     agent     1h        v1.13.5
aks-nodepool1-79590246-2   Ready     agent     1h        v1.13.5
```

When complete, the authentication token is cached. You are only reprompted to sign in when the token has expired or the Kubernetes config file re-created.

If you are seeing an authorization error message after signing in successfully, check whether:

```console
error: You must be logged in to the server (Unauthorized)
```

1. You defined the appropriate object ID or UPN, depending on if the user account is in the same Azure AD tenant or not.
2. The user is not a member of more than 200 groups.
3. Secret defined in the application registration for server matches the value configured using `--aad-server-app-secret`

## Next steps

To use Azure AD users and groups to control access to cluster resources, see [Control access to cluster resources using role-based access control and Azure AD identities in AKS][azure-ad-rbac].

For more information about how to secure Kubernetes clusters, see [Access and identity options for AKS)][rbac-authorization].

For best practices on identity and resource control, see [Best practices for authentication and authorization in AKS][operator-best-practices-identity].

<!-- LINKS - external -->
[kubernetes-webhook]:https://kubernetes.io/docs/reference/access-authn-authz/authentication/#webhook-token-authentication
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply

<!-- LINKS - internal -->
[az-aks-create]: /cli/azure/aks?view=azure-cli-latest#az-aks-create
[az-aks-get-credentials]: /cli/azure/aks?view=azure-cli-latest#az-aks-get-credentials
[az-group-create]: /cli/azure/group#az-group-create
[open-id-connect]:../active-directory/develop/v1-protocols-openid-connect-code.md
[az-ad-user-show]: /cli/azure/ad/user#az-ad-user-show
[rbac-authorization]: concepts-identity.md#role-based-access-controls-rbac
[operator-best-practices-identity]: operator-best-practices-identity.md
[azure-ad-rbac]: azure-ad-rbac.md
[azure-ad-cli]: azure-ad-integration-cli.md
