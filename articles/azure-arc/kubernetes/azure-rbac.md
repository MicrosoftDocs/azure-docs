---
title: "Azure RBAC on Azure Arc-enabled Kubernetes clusters (preview)"
ms.date: 05/04/2023
ms.topic: how-to
ms.custom: devx-track-azurecli
description: "Use Azure RBAC for authorization checks on Azure Arc-enabled Kubernetes clusters."
---

# Use Azure RBAC on Azure Arc-enabled Kubernetes clusters (preview)

Kubernetes [ClusterRoleBinding and RoleBinding](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#rolebinding-and-clusterrolebinding) object types help to define authorization in Kubernetes natively. By using this feature, you can use Microsoft Entra ID and role assignments in Azure to control authorization checks on the cluster. Azure role assignments let you granularly control which users can read, write, and delete Kubernetes objects such as deployment, pod, and service.

For a conceptual overview of this feature, see [Azure RBAC on Azure Arc-enabled Kubernetes](conceptual-azure-rbac.md).

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

## Prerequisites

- [Install or upgrade the Azure CLI](/cli/azure/install-azure-cli) to the latest version.

- Install the latest version of `connectedk8s` Azure CLI extension:

    ```azurecli
    az extension add --name connectedk8s
    ```

    If the `connectedk8s` extension is already installed, you can update it to the latest version by using the following command:

    ```azurecli
    az extension update --name connectedk8s
    ```

- Connect an existing Azure Arc-enabled Kubernetes cluster:
  - If you haven't connected a cluster yet, use our [quickstart](quickstart-connect-cluster.md).
  - [Upgrade your agents](agent-upgrade.md#manually-upgrade-agents) to the latest version.

> [!NOTE]
> You can't set up this feature for Red Hat OpenShift, or for managed Kubernetes offerings of cloud providers like Elastic Kubernetes Service or Google Kubernetes Engine where the user doesn't have access to the API server of the cluster. For Azure Kubernetes Service (AKS) clusters, this [feature is available natively](../../aks/manage-azure-rbac.md) and doesn't require the AKS cluster to be connected to Azure Arc. For AKS on Azure Stack HCI, see [Use Azure RBAC for AKS hybrid clusters (preview)](/azure/aks/hybrid/azure-rbac-aks-hybrid).

<a name='set-up-azure-ad-applications'></a>

## Set up Microsoft Entra applications

### [Azure CLI >= v2.3.7](#tab/AzureCLI)

#### Create a server application

1. Create a new Microsoft Entra application and get its `appId` value. This value is used in later steps as `serverApplicationId`.

    ```azurecli
    CLUSTER_NAME="<name-of-arc-connected-cluster>"
    TENANT_ID="<tenant>"
    SERVER_UNIQUE_SUFFIX="<identifier_suffix>"
    SERVER_APP_ID=$(az ad app create --display-name "${CLUSTER_NAME}Server" --identifier-uris "api://${TENANT_ID}/${SERVER_UNIQUE_SUFFIX}" --query appId -o tsv)
    echo $SERVER_APP_ID
    ```

1. To grant "Sign in and read user profile" API permissions to the server application, copy this JSON and save it in a file called oauth2-permissions.json:

    ```json
    {
        "oauth2PermissionScopes": [
            {
                "adminConsentDescription": "Sign in and read user profile",
                "adminConsentDisplayName": "Sign in and read user profile",
                "id": "<paste_the_SERVER_APP_ID>",
                "isEnabled": true,
                "type": "User",
                "userConsentDescription": "Sign in and read user profile",
                "userConsentDisplayName": "Sign in and read user profile",
                "value": "User.Read"
            }
        ]
    }
    ```

1. Update the application's group membership claims. Run the commands in the same directory as the `oauth2-permissions.json` file. RBAC for Azure Arc-enabled Kubernetes requires [`signInAudience` to be set to **AzureADMyOrg**](../../active-directory/develop/supported-accounts-validation.md):

   ```azurecli
   az ad app update --id "${SERVER_APP_ID}" --set groupMembershipClaims=All
   az ad app update --id ${SERVER_APP_ID} --set  api=@oauth2-permissions.json
   az ad app update --id ${SERVER_APP_ID} --set  signInAudience=AzureADMyOrg
   SERVER_OBJECT_ID=$(az ad app show --id "${SERVER_APP_ID}" --query "id" -o tsv)
   az rest --method PATCH --headers "Content-Type=application/json" --uri https://graph.microsoft.com/v1.0/applications/${SERVER_OBJECT_ID}/ --body '{"api":{"requestedAccessTokenVersion": 1}}'
   ```

1. Create a service principal and get its `password` field value. This value is required later as `serverApplicationSecret` when you're enabling this feature on the cluster. This secret is valid for one year by default and will need to be [rotated after that](#refresh-the-secret-of-the-server-application). To set a custom expiration duration, use [`az ad sp credential reset`](/cli/azure/ad/sp/credential?view=azure-cli-latest&preserve-view=true#az-ad-sp-credential-reset):

   ```azurecli
   az ad sp create --id "${SERVER_APP_ID}"
   SERVER_APP_SECRET=$(az ad sp credential reset --id "${SERVER_APP_ID}"  --query password -o tsv) 
   ```

1. Grant "Sign in and read user profile" API permissions to the application by using [`az ad app permission`](/cli/azure/ad/app/permission?view=azure-cli-latest&preserve-view=true##az-ad-app-permission-add-examples):

   ```azurecli
   az ad app permission add --id "${SERVER_APP_ID}" --api 00000003-0000-0000-c000-000000000000 --api-permissions e1fe6dd8-ba31-4d61-89e7-88639da4683d=Scope
   az ad app permission grant --id "${SERVER_APP_ID}" --api 00000003-0000-0000-c000-000000000000 --scope User.Read
   ```

    > [!NOTE]
    > An Azure [application administrator](../../active-directory/roles/permissions-reference.md#application-administrator) has to run this step.
    >
    > For usage of this feature in production, we recommend that you create a different server application for every cluster.  

#### Create a client application

1. Create a new Microsoft Entra application and get its `appId` value. This value is used in later steps as `clientApplicationId`.

   ```azurecli
   CLIENT_UNIQUE_SUFFIX="<identifier_suffix>" 
   CLIENT_APP_ID=$(az ad app create --display-name "${CLUSTER_NAME}Client" --is-fallback-public-client --public-client-redirect-uris "api://${TENANT_ID}/${CLIENT_UNIQUE_SUFFIX}" --query appId -o tsv)
   echo $CLIENT_APP_ID 
   ```

2. Create a service principal for this client application:

    ```azurecli
    az ad sp create --id "${CLIENT_APP_ID}"
    ```

3. Get the `oAuthPermissionId` value for the server application:

    ```azurecli
        az ad app show --id "${SERVER_APP_ID}" --query "api.oauth2PermissionScopes[0].id" -o tsv
    ```

4. Grant the required permissions for the client application. RBAC for Azure Arc-enabled Kubernetes requires [`signInAudience` to be set to **AzureADMyOrg**](../../active-directory/develop/supported-accounts-validation.md):

    ```azurecli
        az ad app permission add --id "${CLIENT_APP_ID}" --api "${SERVER_APP_ID}" --api-permissions <oAuthPermissionId>=Scope
        RESOURCE_APP_ID=$(az ad app show --id "${CLIENT_APP_ID}"  --query "requiredResourceAccess[0].resourceAppId" -o tsv)
        az ad app permission grant --id "${CLIENT_APP_ID}" --api "${RESOURCE_APP_ID}" --scope User.Read
        az ad app update --id ${CLIENT_APP_ID} --set  signInAudience=AzureADMyOrg
        CLIENT_OBJECT_ID=$(az ad app show --id "${CLIENT_APP_ID}" --query "id" -o tsv)
        az rest --method PATCH --headers "Content-Type=application/json" --uri https://graph.microsoft.com/v1.0/applications/${CLIENT_OBJECT_ID}/ --body '{"api":{"requestedAccessTokenVersion": 1}}'
    ```

### [Azure CLI < v2.3.7](#tab/AzureCLI236)

#### Create a server application

1. Create a new Microsoft Entra application and get its `appId` value. This value is used in later steps as `serverApplicationId`.

    ```azurecli
    CLUSTER_NAME="<name-of-arc-connected-cluster>"
    TENANT_ID="<tenant>"
    SERVER_UNIQUE_SUFFIX="<identifier_suffix>"
    SERVER_APP_ID=$(az ad app create --display-name "${CLUSTER_NAME}Server" --identifier-uris "api://${TENANT_ID}/${SERVER_UNIQUE_SUFFIX}" --query appId -o tsv)
    echo $SERVER_APP_ID
    ```

1. Update the application's group membership claims:

   ```azurecli
   az ad app update --id "${SERVER_APP_ID}" --set groupMembershipClaims=All
   ```

1. Create a service principal and get its `password` field value. This value is required later as `serverApplicationSecret` when you're enabling this feature on the cluster. This secret is valid for one year by default and will need to be [rotated after that](#refresh-the-secret-of-the-server-application). To set a custom expiration duration, use [`az ad sp credential reset`](/cli/azure/ad/sp/credential?view=azure-cli-latest&preserve-view=true#az-ad-sp-credential-reset):

    ```azurecli
        az ad sp create --id "${SERVER_APP_ID}"
        SERVER_APP_SECRET=$(az ad sp credential reset --name "${SERVER_APP_ID}" --credential-description "ArcSecret" --query password -o tsv)
    ```

1. Grant "Sign in and read user profile" API permissions to the application by using [`az ad app permission`](/cli/azure/ad/app/permission?view=azure-cli-latest&preserve-view=true##az-ad-app-permission-add-examples):

    ```azurecli
        az ad app permission add --id "${SERVER_APP_ID}" --api 00000003-0000-0000-c000-000000000000 --api-permissions e1fe6dd8-ba31-4d61-89e7-88639da4683d=Scope
        az ad app permission grant --id "${SERVER_APP_ID}" --api 00000003-0000-0000-c000-000000000000 
    ```

    > [!NOTE]
    > An Azure [application administrator](../../active-directory/roles/permissions-reference.md#application-administrator) has to run this step.
    >
    > For usage of this feature in production, we recommend that you create a different server application for every cluster.

#### Create a client application

1. Create a new Microsoft Entra application and get its `appId` value. This value is used in later steps as `clientApplicationId`.

   ```azurecli
   CLIENT_UNIQUE_SUFFIX="<identifier_suffix>" 
   CLIENT_APP_ID=$(az ad app create --display-name "${CLUSTER_NAME}Client" --native-app --reply-urls "api://${TENANT_ID}/${CLIENT_UNIQUE_SUFFIX}" --query appId -o tsv)
   echo $CLIENT_APP_ID
   ```

2. Create a service principal for this client application:

   ```azurecli
   az ad sp create --id "${CLIENT_APP_ID}"
   ```

3. Get the `oAuthPermissionId` value for the server application:

   ```azurecli
   az ad app show --id "${SERVER_APP_ID}" --query "oauth2Permissions[0].id" -o tsv
   ```

4. Grant the required permissions for the client application:

   ```azurecli
   az ad app permission add --id "${CLIENT_APP_ID}" --api "${SERVER_APP_ID}" --api-permissions <oAuthPermissionId>=Scope
   az ad app permission grant --id "${CLIENT_APP_ID}" --api "${SERVER_APP_ID}"
   ```

---

## Create a role assignment for the server application

The server application needs the `Microsoft.Authorization/*/read` permissions so that it can confirm that the user making the request is authorized on the Kubernetes objects that are included in the request.

1. Create a file named *accessCheck.json* with the following contents:

   ```json
   {
   "Name": "Read authorization",
   "IsCustom": true,
   "Description": "Read authorization",
   "Actions": ["Microsoft.Authorization/*/read"],
   "NotActions": [],
   "DataActions": [],
   "NotDataActions": [],
   "AssignableScopes": [
     "/subscriptions/<subscription-id>"
     ]
   }
   ```

    Replace `<subscription-id>` with the actual subscription ID.

2. Run the following command to create the new custom role:

    ```azurecli
    ROLE_ID=$(az role definition create --role-definition ./accessCheck.json --query id -o tsv)
    ```

3. Create a role assignment on the server application as `assignee` by using the role that you created:

    ```azurecli
    az role assignment create --role "${ROLE_ID}" --assignee "${SERVER_APP_ID}" --scope /subscriptions/<subscription-id>
    ```

## Enable Azure RBAC on the cluster

Enable Azure role-based access control (RBAC) on your Azure Arc-enabled Kubernetes cluster by running the following command:

```azurecli
az connectedk8s enable-features -n <clusterName> -g <resourceGroupName> --features azure-rbac --app-id "${SERVER_APP_ID}" --app-secret "${SERVER_APP_SECRET}"
```

> [!NOTE]
> Before you run the preceding command, ensure that the `kubeconfig` file on the machine is pointing to the cluster on which you'll enable the Azure RBAC feature.
>
> Use `--skip-azure-rbac-list` with the preceding command for a comma-separated list of usernames, emails, and OpenID connections undergoing authorization checks by using Kubernetes native `ClusterRoleBinding` and `RoleBinding` objects instead of Azure RBAC.

### Generic cluster where no reconciler is running on the `apiserver` specification

1. SSH into every master node of the cluster and take the following steps:

    **If your `kube-apiserver` is a [static pod](https://kubernetes.io/docs/tasks/configure-pod-container/static-pod/):**

    1. The `azure-arc-guard-manifests` secret in the `kube-system` namespace contains two files: `guard-authn-webhook.yaml` and `guard-authz-webhook.yaml`. Copy these files to the `/etc/guard` directory of the node.

        ```console
        sudo mkdir -p /etc/guard
        kubectl get secrets azure-arc-guard-manifests -n kube-system -o json | jq -r '.data."guard-authn-webhook.yaml"' | base64 -d > /etc/guard/guard-authn-webhook.yaml
        kubectl get secrets azure-arc-guard-manifests -n kube-system -o json | jq -r '.data."guard-authz-webhook.yaml"' | base64 -d > /etc/guard/guard-authz-webhook.yaml
        ```

    1. Open the `apiserver` manifest in edit mode:

       ```console
       sudo vi /etc/kubernetes/manifests/kube-apiserver.yaml
       ```

    1. Add the following specification under `volumes`:

       ```yml
       - name: azure-rbac
           hostPath:
           path: /etc/guard
           type: Directory
       ```

    1. Add the following specification under `volumeMounts`:

       ```yml
       - mountPath: /etc/guard
           name: azure-rbac
           readOnly: true
       ```

    **If your `kube-apiserver` is a not a static pod:**

    1. Open the `apiserver` manifest in edit mode:

       ```console
       sudo vi /etc/kubernetes/manifests/kube-apiserver.yaml
       ```

    1. Add the following specification under `volumes`:

       ```yml
       - name: azure-rbac
           secret:
           secretName: azure-arc-guard-manifests
       ```

    1. Add the following specification under `volumeMounts`:

       ```yml
       - mountPath: /etc/guard
           name: azure-rbac
           readOnly: true
       ```

1. Add the following `apiserver` arguments:

   ```yml
   - --authentication-token-webhook-config-file=/etc/guard/guard-authn-webhook.yaml
   - --authentication-token-webhook-cache-ttl=5m0s
   - --authorization-webhook-cache-authorized-ttl=5m0s
   - --authorization-webhook-config-file=/etc/guard/guard-authz-webhook.yaml
   - --authorization-webhook-version=v1
   - --authorization-mode=Node,RBAC,Webhook
   ```

   If the Kubernetes cluster is version 1.19.0 or later, you also need to set the following `apiserver` argument:

   ```yml
   - --authentication-token-webhook-version=v1
   ```

1. Save and close the editor to update the `apiserver` pod.

### Cluster created by using Cluster API

1. Copy the guard secret that contains authentication and authorization webhook configuration files from the workload cluster onto your machine:

   ```console
   kubectl get secret azure-arc-guard-manifests -n kube-system -o yaml > azure-arc-guard-manifests.yaml
   ```

1. Change the `namespace` field in the *azure-arc-guard-manifests.yaml* file to the namespace within the management cluster where you're applying the custom resources for creation of workload clusters.

1. Apply this manifest:

   ```console
   kubectl apply -f azure-arc-guard-manifests.yaml
   ```

1. Edit the `KubeadmControlPlane` object by running `kubectl edit kcp <clustername>-control-plane`:

   1. Add the following snippet under `files`:

      ```console
      - contentFrom:
          secret:
            key: guard-authn-webhook.yaml
            name: azure-arc-guard-manifests
        owner: root:root
        path: /etc/kubernetes/guard-authn-webhook.yaml
        permissions: "0644"
      - contentFrom:
          secret:
            key: guard-authz-webhook.yaml
            name: azure-arc-guard-manifests
        owner: root:root
        path: /etc/kubernetes/guard-authz-webhook.yaml
        permissions: "0644"
      ```

   1. Add the following snippet under `apiServer` > `extraVolumes`:

      ```console
      - hostPath: /etc/kubernetes/guard-authn-webhook.yaml
          mountPath: /etc/guard/guard-authn-webhook.yaml
          name: guard-authn
          readOnly: true
      - hostPath: /etc/kubernetes/guard-authz-webhook.yaml
          mountPath: /etc/guard/guard-authz-webhook.yaml
          name: guard-authz
          readOnly: true
      ```

   1. Add the following snippet under `apiServer` > `extraArgs`:

      ```console
      authentication-token-webhook-cache-ttl: 5m0s
      authentication-token-webhook-config-file: /etc/guard/guard-authn-webhook.yaml
      authentication-token-webhook-version: v1
      authorization-mode: Node,RBAC,Webhook
      authorization-webhook-cache-authorized-ttl: 5m0s
      authorization-webhook-config-file: /etc/guard/guard-authz-webhook.yaml
      authorization-webhook-version: v1
      ```

   1. Save and close to update the `KubeadmControlPlane` object. Wait for these changes to appear on the workload cluster.

## Create role assignments for users to access the cluster

Owners of the Azure Arc-enabled Kubernetes resource can use either built-in roles or custom roles to grant other users access to the Kubernetes cluster.

### Built-in roles

| Role | Description |
|---|---|
| [Azure Arc Kubernetes Viewer](../../role-based-access-control/built-in-roles.md#azure-arc-kubernetes-viewer) | Allows read-only access to see most objects in a namespace. This role doesn't allow viewing secrets, because `read` permission on secrets would enable access to `ServiceAccount` credentials in the namespace. These credentials would in turn allow API access through that `ServiceAccount` value (a form of privilege escalation). |
| [Azure Arc Kubernetes Writer](../../role-based-access-control/built-in-roles.md#azure-arc-kubernetes-writer) | Allows read/write access to most objects in a namespace. This role doesn't allow viewing or modifying roles or role bindings. However, this role allows accessing secrets and running pods as any `ServiceAccount` value in the namespace, so it can be used to gain the API access levels of any `ServiceAccount` value in the namespace. |
| [Azure Arc Kubernetes Admin](../../role-based-access-control/built-in-roles.md#azure-arc-kubernetes-admin) | Allows admin access. It's intended to be granted within a namespace through `RoleBinding`. If you use it in `RoleBinding`, it allows read/write access to most resources in a namespace, including the ability to create roles and role bindings within the namespace. This role doesn't allow write access to resource quota or to the namespace itself. |
| [Azure Arc Kubernetes Cluster Admin](../../role-based-access-control/built-in-roles.md#azure-arc-kubernetes-cluster-admin) | Allows superuser access to execute any action on any resource. When you use it in `ClusterRoleBinding`, it gives full control over every resource in the cluster and in all namespaces. When you use it in `RoleBinding`, it gives full control over every resource in the role binding's namespace, including the namespace itself.|

You can create role assignments scoped to the Azure Arc-enabled Kubernetes cluster in the Azure portal on the **Access Control (IAM)** pane of the cluster resource. You can also use the following Azure CLI commands:

```azurecli
az role assignment create --role "Azure Arc Kubernetes Cluster Admin" --assignee <AZURE-AD-ENTITY-ID> --scope $ARM_ID
```

In those commands, `AZURE-AD-ENTITY-ID` can be a username (for example, `testuser@mytenant.onmicrosoft.com`) or even the `appId` value of a service principal.

Here's another example of creating a role assignment scoped to a specific namespace within the cluster:

```azurecli
az role assignment create --role "Azure Arc Kubernetes Viewer" --assignee <AZURE-AD-ENTITY-ID> --scope $ARM_ID/namespaces/<namespace-name>
```

> [!NOTE]
> You can create role assignments scoped to the cluster by using either the Azure portal or the Azure CLI. However, only Azure CLI can be used to create role assignments scoped to namespaces.

### Custom roles

You can choose to create your own role definition for use in role assignments.

Walk through the following example of a role definition that allows a user to only read deployments. For more information, see [the full list of data actions that you can use to construct a role definition](../../role-based-access-control/resource-provider-operations.md#microsoftkubernetes).

Copy the following JSON object into a file called *custom-role.json*. Replace the `<subscription-id>` placeholder with the actual subscription ID. The custom role uses one of the data actions and lets you view all deployments in the scope (cluster or namespace) where the role assignment is created.

```json
{
    "Name": "Arc Deployment Viewer",
    "Description": "Lets you view all deployments in cluster/namespace.",
    "Actions": [],
    "NotActions": [],
    "DataActions": [
        "Microsoft.Kubernetes/connectedClusters/apps/deployments/read"
    ],
    "NotDataActions": [],
    "assignableScopes": [
        "/subscriptions/<subscription-id>"
    ]
}
```

1. Create the role definition by running the following command from the folder where you saved *custom-role.json*:

   ```azurecli
   az role definition create --role-definition @custom-role.json
   ```

1. Create a role assignment by using this custom role definition:

   ```azurecli
   az role assignment create --role "Arc Deployment Viewer" --assignee <AZURE-AD-ENTITY-ID> --scope $ARM_ID/namespaces/<namespace-name>
   ```

## Configure kubectl with user credentials

There are two ways to get the *kubeconfig* file that you need to access the cluster:

- You use the [cluster Connect](cluster-connect.md) feature (`az connectedk8s proxy`) of the Azure Arc-enabled Kubernetes cluster.
- The cluster admin shares the *kubeconfig* file with every other user.

### Use cluster connect

Run the following command to start the proxy process:

```azurecli
az connectedk8s proxy -n <clusterName> -g <resourceGroupName>
```

After the proxy process is running, you can open another tab in your console to [start sending your requests to the cluster](#send-requests-to-the-cluster).

### Use a shared kubeconfig file

Using a shared kubeconfig requires slightly different steps depending on your Kubernetes version.

### [Kubernetes version >= 1.26](#tab/kubernetes-latest)

1. Run the following command to set the credentials for the user:

   ```console
   kubectl config set-credentials <testuser>@<mytenant.onmicrosoft.com> \
   --auth-provider=azure \
   --auth-provider-arg=environment=AzurePublicCloud \
   --auth-provider-arg=client-id=<clientApplicationId> \
   --auth-provider-arg=tenant-id=<tenantId> \
   --auth-provider-arg=apiserver-id=<serverApplicationId>
   ```

1. Open the *kubeconfig* file that you created earlier. Under `contexts`, verify that the context associated with the cluster points to the user credentials that you created in the previous step. To set the current context to these user credentials, run the following command:

   ```console
   kubectl config set-context --current=true --user=<testuser>@<mytenant.onmicrosoft.com>
   ```

1. Add the **config-mode** setting under `user` > `config`:
  
   ```console
   name: testuser@mytenant.onmicrosoft.com
   user:
       auth-provider:
       config:
           apiserver-id: $SERVER_APP_ID
           client-id: $CLIENT_APP_ID
           environment: AzurePublicCloud
           tenant-id: $TENANT_ID
           config-mode: "1"
       name: azure
   ```

> [!NOTE]
>[Exec plugin](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins) is a Kubernetes authentication strategy that allows `kubectl` to execute an external command to receive user credentials to send to `apiserver`. Starting with Kubernetes version 1.26, the default Azure authorization plugin is no longer included in `client-go` and `kubectl`. With later versions, in order to use the exec plugin to receive user credentials you must use [Azure Kubelogin](https://azure.github.io/kubelogin/index.html), a `client-go` credential (exec) plugin that implements Azure authentication.

4. Install Azure Kubelogin:

   - For Windows or Mac, follow the [Azure Kubelogin installation instructions](https://azure.github.io/kubelogin/install.html#installation).
   - For Linux or Ubuntu, download the [latest version of kubelogin](https://github.com/Azure/kubelogin/releases), then run the following commands:

     ```bash
     curl -LO https://github.com/Azure/kubelogin/releases/download/"$KUBELOGIN_VERSION"/kubelogin-linux-amd64.zip 

     unzip kubelogin-linux-amd64.zip 

     sudo mv bin/linux_amd64/kubelogin /usr/local/bin/ 

     sudo chmod +x /usr/local/bin/kubelogin 
     ```

5. [Convert](https://azure.github.io/kubelogin/cli/convert-kubeconfig.html) the kubelogin to use the appropriate [login mode](https://azure.github.io/kubelogin/concepts/login-modes.html). For example, for [device code login](https://azure.github.io/kubelogin/concepts/login-modes/devicecode.html) with a Microsoft Entra user, the commands would be as follows:

   ```bash
   export KUBECONFIG=/path/to/kubeconfig

   kubelogin convert-kubeconfig
   ```

### [Kubernetes < v1.26](#tab/Kubernetes-earlier)

1. Run the following command to set the credentials for the user:

   ```console
   kubectl config set-credentials <testuser>@<mytenant.onmicrosoft.com> \
   --auth-provider=azure \
   --auth-provider-arg=environment=AzurePublicCloud \
   --auth-provider-arg=client-id=<clientApplicationId> \
   --auth-provider-arg=tenant-id=<tenantId> \
   --auth-provider-arg=apiserver-id=<serverApplicationId>
   ```

1. Open the *kubeconfig* file that you created earlier. Under `contexts`, verify that the context associated with the cluster points to the user credentials that you created in the previous step. To set the current context to these user credentials, run the following command:

   ```console
   kubectl config set-context --current=true --user=<testuser>@<mytenant.onmicrosoft.com>
   ```

1. Add the **config-mode** setting under `user` > `config`:
  
   ```console
   name: testuser@mytenant.onmicrosoft.com
   user:
       auth-provider:
       config:
           apiserver-id: $SERVER_APP_ID
           client-id: $CLIENT_APP_ID
           environment: AzurePublicCloud
           tenant-id: $TENANT_ID
           config-mode: "1"
       name: azure
   ```

---

## Send requests to the cluster

1. Run any `kubectl` command. For example:

   - `kubectl get nodes`
   - `kubectl get pods`

1. After you're prompted for browser-based authentication, copy the device login URL (`https://microsoft.com/devicelogin`) and open it in your web browser.

1. Enter the code printed on your console. Copy and paste the code on your terminal into the prompt for device authentication input.

1. Enter the username (`testuser@mytenant.onmicrosoft.com`) and the associated password.

1. If you see an error message like this, it means you're unauthorized to access the requested resource:

    ```console
    Error from server (Forbidden): nodes is forbidden: User "testuser@mytenant.onmicrosoft.com" cannot list resource "nodes" in API group "" at the cluster scope: User doesn't have access to the resource in Azure. Update role assignment to allow access.
    ```

    An administrator needs to create a new role assignment that authorizes this user to have access on the resource.

<a name='use-conditional-access-with-azure-ad'></a>

## Use Conditional Access with Microsoft Entra ID

When you're integrating Microsoft Entra ID with your Azure Arc-enabled Kubernetes cluster, you can also use [Conditional Access](../../active-directory/conditional-access/overview.md) to control access to your cluster.

> [!NOTE]
> [Microsoft Entra Conditional Access](../../active-directory/conditional-access/overview.md) is a Microsoft Entra ID P2 capability.

To create an example Conditional Access policy to use with the cluster:

1. At the top of the Azure portal, search for and select **Microsoft Entra ID**.
1. On the menu for Microsoft Entra ID on the left side, select **Enterprise applications**.
1. On the menu for enterprise applications on the left side, select **Conditional Access**.
1. On the menu for Conditional Access on the left side, select **Policies** > **New policy**.

    :::image type="content" source="media/azure-rbac/conditional-access-new-policy.png" alt-text="Screenshot showing how to add a conditional access policy in the Azure portal." lightbox="media/azure-rbac/conditional-access-new-policy.png":::

1. Enter a name for the policy, such as **arc-k8s-policy**.

1. Select **Users and groups**. Under **Include**, choose **Select users and groups**. Then choose the users and groups where you want to apply the policy. For this example, choose the same Microsoft Entra group that has administrative access to your cluster.

    :::image type="content" source="media/azure-rbac/conditional-access-users-groups.png" alt-text="Screenshot that shows selecting users or groups to apply the Conditional Access policy." lightbox="media/azure-rbac/conditional-access-users-groups.png":::

1. Select **Cloud apps or actions**. Under **Include**, choose **Select apps**. Then search for and select the server application that you created earlier.

    :::image type="content" source="media/azure-rbac/conditional-access-apps.png" alt-text="Screenshot showing how to select a server application in the Azure portal." lightbox="media/azure-rbac/conditional-access-apps.png":::


1. Under **Access controls**, select **Grant**. Select **Grant access** > **Require device to be marked as compliant**.

    :::image type="content" source="media/azure-rbac/conditional-access-grant-compliant.png" alt-text="Screenshot showing how to allow only compliant devices in the Azure portal." lightbox="media/azure-rbac/conditional-access-grant-compliant.png":::

1. Under **Enable policy**, select **On** > **Create**.

    :::image type="content" source="media/azure-rbac/conditional-access-enable-policies.png" alt-text="Screenshot showing how to enable a conditional access policy in the Azure portal." lightbox="media/azure-rbac/conditional-access-enable-policies.png":::

Access the cluster again. For example, run the `kubectl get nodes` command to view nodes in the cluster:

```console
kubectl get nodes
```

Follow the instructions to sign in again. An error message states that you're successfully logged in, but your admin requires the device that's requesting access to be managed by Microsoft Entra ID in order to access the resource. Follow these steps:

1. In the Azure portal, go to **Microsoft Entra ID**.
1. Select **Enterprise applications**. Then under **Activity**, select **Sign-ins**.
1. An entry at the top shows **Failed** for **Status** and **Success** for **Conditional Access**. Select the entry, and then select **Conditional Access** in **Details**. Notice that your Conditional Access policy is listed.

    :::image type="content" source="media/azure-rbac/conditional-access-sign-in-activity.png" alt-text="Screenshot showing a failed sign-in entry in the Azure portal." lightbox="media/azure-rbac/conditional-access-sign-in-activity.png":::

<a name='configure-just-in-time-cluster-access-with-azure-ad'></a>

## Configure just-in-time cluster access with Microsoft Entra ID

Another option for cluster access control is to use [Privileged Identity Management (PIM)](../../active-directory/privileged-identity-management/pim-configure.md) for just-in-time requests.

>[!NOTE]
> [Microsoft Entra PIM](../../active-directory/privileged-identity-management/pim-configure.md) is a Microsoft Entra ID P2 capability. For more on Microsoft Entra ID SKUs, see the [pricing guide](https://azure.microsoft.com/pricing/details/active-directory/).

To configure just-in-time access requests for your cluster, complete the following steps:

1. At the top of the Azure portal, search for and select **Microsoft Entra ID**.
1. Take note of the tenant ID. For the rest of these instructions, we'll refer to that ID as `<tenant-id>`.

    :::image type="content" source="media/azure-rbac/jit-get-tenant-id.png" alt-text="Screenshot showing Microsoft Entra ID details in the Azure portal." lightbox="media/azure-rbac/jit-get-tenant-id.png":::

1. On the menu for Microsoft Entra ID on the left side, under **Manage**, select **Groups** > **New group**.

1. Make sure that **Security** is selected for **Group type**.  Enter a group name, such as **myJITGroup**. Under **Microsoft Entra roles can be assigned to this group (Preview)**, select **Yes**. Finally, select **Create**.

    :::image type="content" source="media/azure-rbac/jit-new-group-created.png" alt-text="Screenshot showing details for the new group in the Azure portal." lightbox="media/azure-rbac/jit-new-group-created.png":::

1. You're brought back to the **Groups** page. Select your newly created group and take note of the object ID. For the rest of these instructions, we'll refer to this ID as `<object-id>`.

    :::image type="content" source="media/azure-rbac/jit-get-object-id.png" alt-text="Screenshot showing the object ID for the new group in the Azure portal." lightbox="media/azure-rbac/jit-get-object-id.png":::

1. Back in the Azure portal, on the menu for **Activity** on the left side, select **Privileged Access (Preview)**. Then select **Enable Privileged Access**.

    :::image type="content" source="media/azure-rbac/jit-enabling-priv-access.png" alt-text="Screenshot showing selections for enabling privileged access in the Azure portal." lightbox="media/azure-rbac/jit-enabling-priv-access.png":::

1. Select **Add assignments** to begin granting access.

    :::image type="content" source="media/azure-rbac/jit-add-active-assignment.png" alt-text="Screenshot showing how to add active assignments in the Azure portal." lightbox="media/azure-rbac/jit-add-active-assignment.png":::

1. Select a role of **Member**, and select the users and groups to whom you want to grant cluster access. A group admin can modify these assignments at any time. When you're ready to move on, select **Next**.

    :::image type="content" source="media/azure-rbac/jit-adding-assignment.png" alt-text="Screenshot showing how to add assignments in the Azure portal." lightbox="media/azure-rbac/jit-adding-assignment.png":::

1. Choose an assignment type of **Active**, choose the desired duration, and provide a justification. When you're ready to proceed, select **Assign**. For more on assignment types, see [Assign eligibility for a privileged access group (preview) in Privileged Identity Management](../../active-directory/privileged-identity-management/groups-assign-member-owner.md#assign-an-owner-or-member-of-a-group).

    :::image type="content" source="media/azure-rbac/jit-set-active-assignment.png" alt-text="Screenshot showing assignment properties in the Azure portal." lightbox="media/azure-rbac/jit-set-active-assignment.png":::

After you've made the assignments, verify that just-in-time access is working by accessing the cluster. For example, use the `kubectl get nodes` command to view nodes in the cluster:

```console
kubectl get nodes
```

Note the authentication requirement and follow the steps to authenticate. If authentication is successful, you should see output similar to this:

```output
To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code AAAAAAAAA to authenticate.

NAME      STATUS   ROLES    AGE      VERSION
node-1    Ready    agent    6m36s    v1.18.14
node-2    Ready    agent    6m42s    v1.18.14
node-3    Ready    agent    6m33s    v1.18.14
```

## Refresh the secret of the server application

If the secret for the server application's service principal has expired, you'll need to rotate it.

```azurecli
SERVER_APP_SECRET=$(az ad sp credential reset --name "${SERVER_APP_ID}" --credential-description "ArcSecret" --query password -o tsv)
```

Update the secret on the cluster. Include any optional parameters you configured when the command was originally run.

```azurecli
az connectedk8s enable-features -n <clusterName> -g <resourceGroupName> --features azure-rbac --app-id "${SERVER_APP_ID}" --app-secret "${SERVER_APP_SECRET}"
```

## Next steps

- Securely connect to the cluster by using [Cluster Connect](cluster-connect.md).
- Read about the [architecture of Azure RBAC on Arc-enabled Kubernetes](conceptual-azure-rbac.md).
