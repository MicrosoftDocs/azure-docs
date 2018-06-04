---
title: Integrate Azure Active Directrory with Azure Kubernetes Service
description: How to create Azure Active Directrory enabled Azure Kubernetes Service clusters.
services: container-service
author: neilpeterson
manager: jeconnoc

ms.service: container-service
ms.topic: article
ms.date: 6/13/2018
ms.author: nepeters
ms.custom: mvc
---

# Integrate Azure Active Directory with AKS

Azure Kuernetes Service (AKS) includes the capability of integrating authentication services with Azure Active Directory. In this configuration, you can log into an Azure Kubernetes Service cluster using your Azure Active Directory authentication token. Additionally, cluster administrators are also able to configure Kubernetes role-based access control based on a users directory group membership.

This document details creating all necessary prerequisites for AKS and AAD, deplying an AAD enabled cluster, and creating a simple RBAC role in the AKS cluster.

## Authentication details

AAD authentication is provided to Azure Kuberntees Clusters with OpenID Connect. OpenID Connect is an identity layer built on top of the OAuth 2.0 protocol. More information on OpenID Connect can be found [here](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)

From inside of the Kubernetes cluster, Webhook Token Authentication is used to verify authentication token. More information on Webhook token authentication can be found [here](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)

> [!NOTE]
> When configuring AAD for AKS suthentication, two AAD application are configured. This operation must be completed by an Azure tennat administrator.

## Create server application

The first AAD application provides back-end authentication services using OAuth.

Select **Azure Active Directory** > **App registrations** > **New application registration**.

Give the application a name, select **Web app / API** for the application type, and enter any URI formatted value for **Redirect URI**.

Select **Create** when done.

![Create AAD registration](media/aad-integration/app-registration.png)

Select **Manifest** and edit the `groupMembershipClaims` value to `All`.

Select **Save** when complete.

![Create AAD registration](media/aad-integration/edit-manifest.png)

Back on the AAD application, select **Settings** > **Required permissions** > **Add** > **Select an API** > **Microsoft Graph** > **Select**.

Under **APPLICATION PERMISSIONS** place a check next to **Read directory data**.

![Create AAD registration](media/aad-integration/read-directory.png)

Under **DELEGATED PERMISSIONS**, place a check next to **Sign in and read user profile** and **Read directory data**.

Click **Select** when complete.

![Create AAD registration](media/aad-integration/delegated-permissions.png)

Select **Done** and **Grant Permissions** to complete this step.

![Create AAD registration](media/aad-integration/grant-permissions.png)

On the AD application, take note of the **Application ID**. When deploying an AAD enabled AKS cluster, this value is referred to as the `Server application ID`.

![Create AAD registration](media/aad-integration/application-id.png)

Next, select **Settings** > **Keys**. Add a key description, select an expiration deadline, and select **Save**. Take note of the key value. When deploying an AAD enabled AKS cluster, this value is referred to as the `Server application secret`.

![Create AAD registration](media/aad-integration/application-key.png)

## Create client application

The second AAD application is used when logging in with the Kubernetes CLI (kubectl.)

Select **Azure Active Directory** > **App registrations** > **New application registration**.

Give the application a name, select **Native** for the application type, and enter any URI formatted value for **Redirect URI**.

Select **Create** when done.

![Create AAD registration](media/aad-integration/app-registration-client.png)

From the AAD application, select **Settings** > **Required permissions** > **Add** > **Select an API** and search for the name of the server application created in the last step of this document.

![Create AAD registration](media/aad-integration/select-api.png)

Place a check mark next to the application and click **Select**.

![Create AAD registration](media/aad-integration/select-server-app.png)

Select **Done** and **Grant Permissions** to complete this step.

![Create AAD registration](media/aad-integration/grant-permissions-client.png)

Back on the AD application, take note of the **Application ID**. When deploying an AAD enabled AKS cluster, this value is referred to as the `Client application ID`.

![Create AAD registration](media/aad-integration/application-id-client.png)

## Get tenant ID

Finally, get the ID of your Azure tenant. This value is also used when deploying the AKS cluster.

From the Azure portal, select **Azure Active Directory** > **Properties** and take note of the **Directory ID**. When deploying an AAD enabled AKS cluster, this value is referred to as the `Tenant ID`.

![Create AAD registration](media/aad-integration/tenant-id.png)

## Deploy Cluster

TBD

## Create RBAC binding

```
az aks get-credentials --resource-group myAKSCluster --name myAKSCluster --admin
```

```
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
  name: "nepeters@microsoft.com"
```

## Access cluster with AAD

```
az aks get-credentials --resource-group myAKSCluster --name myAKSCluster
```

```
To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code BUJHWDGNL to authenticate.
```
