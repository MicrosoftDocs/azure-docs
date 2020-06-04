---
title: Use Azure AD in Azure Kubernetes Service
description: Learn how to use Azure AD in Azure Kubernetes Service (AKS) 
services: container-service
manager: gwallace
ms.topic: article
ms.date: 06/04/2020
---

# Integrate AKS-managed AAD (Preview)

> [!Note]
> Existing AKS (Azure Kubernetes Service) clusters with AAD (Azure Active Directory) integration are not affected by the new AKS-managed AAD experience.

Azure AD integration with AKS-managed AAD is designed to simplify the Azure AD integration experience, where users were previously required to create a client app, a server app, and required the Azure AD tenant to grant Directory Read permissions. In the new version, the AKS resource provider manages the client and server apps for you.

## Limitations

* You can't currently upgrade an existing AKS AAD-Integrated cluster to the new AKS-managed AAD experience.

> [!IMPORTANT]
> AKS preview features are available on a self-service, opt-in basis. Previews are provided "as-is" and "as available," and are excluded from the Service Level Agreements and limited warranty. AKS previews are partially covered by customer support on a best-effort basis. As such, these features are not meant for production use. For more information, see the following support articles:
>
> - [AKS Support Policies](support-policies.md)
> - [Azure Support FAQ](faq.md)

## Before you begin

* Locate your Azure Account tenant ID by navigating to the Azure portal and select Azure Active Directory > Properties > Directory ID

> [!Important]
> You must use Kubectl with a minimum version of 1.18

You must have the following resources installed:

- The Azure CLI, version 2.5.1 or later
- The aks-preview 0.4.38 extension
- Kubectl with a minimum version of [1.18](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.18.md#v1180)

To install/update the aks-preview  extension or later, use the following Azure CLI commands:

```azurecli
az extension add --name aks-preview
az extension list
```

```azurecli
az extension update --name aks-preview
az extension list
```

To install kubectl, use the following:

```azurecli
sudo az aks install-cli
kubectl version --client
```

Use [these instructions](https://kubernetes.io/docs/tasks/tools/install-kubectl/) for other operating systems.

> [!CAUTION]
> After you register a feature on a subscription, you can't currently unregister that feature. When you enable some preview features, defaults might be used for all AKS clusters created afterward in the subscription. Don't enable preview features on production subscriptions. Instead, use a separate subscription to test preview features and gather feedback.

```azurecli-interactive
az feature register --name AAD-V2 --namespace Microsoft.ContainerService
```

It might take several minutes for the status to show as **Registered**. You can check the registration status by using the [az feature list](https://docs.microsoft.com/cli/azure/feature?view=azure-cli-latest#az-feature-list) command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/AAD-V2')].{Name:name,State:properties.state}"
```

When the status shows as registered, refresh the registration of the `Microsoft.ContainerService` resource provider by using the [az provider register](https://docs.microsoft.com/cli/azure/provider?view=azure-cli-latest#az-provider-register) command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```
## Azure AD authentication overview

Cluster administrators can configure Kubernetes role-based access control (RBAC) based on a user's identity or directory group membership. Azure AD authentication is provided to AKS clusters with OpenID Connect. OpenID Connect is an identity layer built on top of the OAuth 2.0 protocol. For more information on OpenID Connect, see the [Open ID connect documentation][open-id-connect].

From inside of the Kubernetes cluster, Webhook Token Authentication is used to verify authentication tokens. Webhook token authentication is configured and managed as part of the AKS cluster. For more information on Webhook token authentication, see the [webhook authentication documentation][kubernetes-webhook].

## Webhook and API server - TODO

The API server calls the AKS webhook server and peforms various steps:

* AAD client application is used by kubectl to login user into AAD to access "Server application". It corresponds to step 1 and 2 in the chart.
* kubectl sends the access token to APIServer, which is configured with the Authentication Webhook Server. The job of the Authentication Webhook Server is to validate the Access token and tell APIServer who the user is behind the token
* Authentication webhook server performs step 5 and 6 in above chart TODO. In addition, it uses "Server Application" to query Microsoft Graph api to get group membership of logged in user.
* Then it responds to the APIServer with user information such as who he/she is (upn claim of access token), what groups he/she is in
* Finally, APIServer based on the "user info", performs authorization decision based on Kubernetes Role/RoleBinding. This is the step 7 in above chart.
 

## Create an AKS cluster with Azure AD enabled

You can now create an AKS cluster by using the following CLI commands.

Create an Azure resource group:

```azurecli-interactive
# Create an Azure resource group
az group create --name myResourceGroup --location centralus
```

Create an Azure Active Directory (AAD) group for your cluster administrators:

```azurecli-interactive
# Create an AAD group
az ad group create --display-name MyDisplay --mail-nickname MyDisplay
```

Create an AKS cluster, and enable administration access for your AAD group

```azurecli-interactive
# Create an AKS-managed AAD cluster
az aks create -g MyResourceGroup -n MyManagedCluster --enable-aad [--aad-admin-group-object-ids <id>] [--aad-tenant-id <id>]
```

A successful creation of an AKS-managed AAD cluster has the following section in the response body
```
"Azure ADProfile": {
    "adminGroupObjectIds": null,
    "clientAppId": null,
    "managed": true,
    "serverAppId": null,
    "serverAppSecret": null,
    "tenantId": "72f9****-****-****-****-****d011db47"
  }
```

The cluster is created within a few minutes.

## Access an Azure AD enabled cluster
To get the admin credentials to access the cluster:

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name MyManagedCluster --admin
```
Now use the kubectl get nodes command to view nodes in the cluster:

```azurecli-interactive
kubectl get nodes

NAME                       STATUS   ROLES   AGE    VERSION
aks-nodepool1-15306047-0   Ready    agent   102m   v1.15.10
aks-nodepool1-15306047-1   Ready    agent   102m   v1.15.10
aks-nodepool1-15306047-2   Ready    agent   102m   v1.15.10
```

To get the user credentials to access the cluster:
 
```azurecli-interactive
 az aks get-credentials --resource-group myResourceGroup --name MyManagedCluster
```
Follow the instructions to sign in.

You receive: **You must be logged in to the server (Unauthorized)**

The user above gets an error because the user is not a part of a group that has access to the cluster.

## Next steps

* Learn about [Azure AD Role-Based Access Control][azure-ad-rbac].
* Use [kubelogin](https://github.com/Azure/kubelogin) to access features for Azure authentication that are not available in kubectl.

<!-- LINKS - Internal -->
[azure-ad-rbac]: azure-ad-rbac.md
