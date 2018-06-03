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

## Create server application

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

Finally, you need to take note of the application ID and application secret. Back on the AD application, take note of the **Application ID**.

![Create AAD registration](media/aad-integration/application-id.png)

Next, select **Settings** > **Keys**. Add a key description, select an expiration deadline, and select **Save**. Take note of the key value.

![Create AAD registration](media/aad-integration/application-key.png)

## Create client application

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

Back on the AD application, take note of the **Application ID**.

![Create AAD registration](media/aad-integration/application-id-client.png)

## Get tenant ID

Finally, get the ID of your Azure tenant. This value is also used when deploying the AKS cluster.

```azurecli
az account list --query "[].{Name:name,TenantID:tenantId}" -o table
```

Output:

```
Name                                TenantID
----------------------------------  ------------------------------------
Microsoft Internal - Billable       00000000-0000-0000-0000-000000000000
Microsoft Internal - Rate Capped    00000000-0000-0000-0000-000000000000
```

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
