---
title: "Azure RBAC for Azure Arc enabled Kubernetes clusters"
services: azure-arc
ms.service: azure-arc
ms.date: 04/05/2021
ms.topic: article
author: shashankbarsin
ms.author: shasb
description: "Use Azure RBAC for authorization checks on Azure Arc enabled Kubernetes clusters"
---

# Azure RBAC for Azure Arc enabled Kubernetes clusters

Kubernetes objects of the type ClusterRoleBinding and RoleBinding provide a way to define authorization in a Kubernetes native way. This feature introduces relies on usage of Azure Active Directory (AAD) and role assignments in Azure as an alternative way for controlling authorization checks on the Kubernetes cluster.

## Prerequisites

- [Install or upgrade Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) to version >= 2.16.0
- Install the `connectedk8s` Azure CLI extension of version >= 1.1.0:

    ```azurecli
    az extension add --name connectedk8s
    ```
    
    If the `connectedk8s` extension is already installed, you can update it to the latest version using the following command: 

    ```azurecli
    az extension update --name connectedk8s
    ```

- An existing Azure Arc enabled Kubernetes connected cluster.
    - If you haven't connected a cluster yet, walk through our [Connect an Azure Arc enabled Kubernetes cluster quickstart](quickstart-connect-cluster.md).
    - If you had already created an Azure Arc enabled Kubernetes cluster but had disabled auto upgrade of agents, then you need to [upgrade your agents](agent-upgrade.md#manually-upgrade-agents) to version >= 1.1.0.

- Self managed Kubernetes cluster where access to `apiserver` of the cluster is available.

> [!NOTE]
> This feature can't be set up for managed Kubernetes offerings of cloud providers like Elastic Kubernetes Service or Google Kubernetes Engine. For Azure Kubernetes Service (AKS) clusters, this [feature is available natively](../../aks/manage-azure-rbac.md) and doesn't require the AKS cluster to be connected to Azure Arc.

## Set up AAD applications

### Create server application

1. Create a new AAD application and fetch it's `appId` value which is used in later steps as `serverApplicationId`:

```azurecli
az ad app create --display-name "ArcAzureADServer" --identifier-uris "https://ArcAzureADServer" --query appId -o tsv)
```

2. Update this application to be able to query for user's group membership claims:

```azurecli
az ad app update --id <serverApplicationId> --set groupMembershipClaims=All
az ad app permission add --id <serverApplicationId> --api 00000003-0000-0000-c000-000000000000 --api-permissions e1fe6dd8-ba31-4d61-89e7-88639da4683d=Scope
az ad app permission grant --id <serverApplicationId> --api 00000003-0000-0000-c000-000000000000
```

3. Create a service principal and fetch its `password` field value, which is required later as `serverApplicationSecret` when enabling this feature on the cluster:

```azurecli
az ad sp create --id <serverApplicationId>
az ad sp credential reset --name <serverApplicationId> --credential-description "ArcSecret" --query password -o tsv
```

### Create client application

1. Create a new AAD application and fetch its 'appId' value which is used in later steps as `clientApplicationId`:

```azurecli
az ad app create --display-name "ArcAzureADClient" --native-app --reply-urls "https://ArcAzureADClient" --query appId -o tsv)
```

2. Create a service principal for this client application:

```azurecli
az ad sp create --id <clientApplicationId>
```

3. Fetch the `oAuthPermissionId` for for the server application:

```azurecli
az ad app show --id <serverApplicationId> --query "oauth2Permissions[0].id" -o tsv
```

4. Grant the required permissions for the client application:

```azurecli
az ad app permission add --id <clientApplicationId> --api <serverApplicationId> --api-permissions <oAuthPermissionId>=Scope
az ad app permission grant --id <clientApplicationId> --api <serverApplicationId>
```

## Create role assignment for server application

The server application needs the `Microsoft.Authorization/*/read` permissions to check if the user making the request is authorized (or not) on the Kubernetes objects that are a part of the request.

1. Create a file named accessCheck.json with the following contents:

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

    Don't forget to substitute the `<subscription-id>` with the actual subscription ID.

2. Run the following command to create the new custom role:

    ```azurecli
    az role definition create --role-definition ./accessCheck.json
    ```

3. From the output of above command, note down the value of `id` field, which is used in later steps as `roleId`.

4. Create a role assignment on the server application as assignee using the role created above :

    ```azurecli
    az role assignment create --role <roleId> --assignee <serverApplicationId> --scope /subscriptions/<subscription-id>/*
    ```

## Enable Azure RBAC on cluster

1. Enable Azure RBAC on your Arc enabled Kubernetes cluster by running the following command:

    ```console
    az connectedk8s enable-features -n <clusterName> -g <resourceGroupName> --features azure-rbac --server-id <serverApplicationId> --server-secret <serverApplicationSecret>
    ```
    
    > [!NOTE]
    > 1. Before running the above command you need to ensure that the `kubeconfig` file on the machine is pointing to the cluster on which the Azure RBAC feature needs to be enabled.
    > 2. The optional `--skip-azure-rbac-list` can be used with above command to provide a comma separated list of usernames/email/oid of the users for whom authorization checks should not be done using Azure RBAC, but instead using Kubernetes native ClusterRoleBinding and RoleBinding objects.

1. Update `apiserver` to run in webhook mode for authentication and authorization by running `kubectl edit <apiserver pod name>`:

    1. Add the following under `volumes`:
        ```yml
        - name: check
          secret:
            secretName: azure-arc-guard-manifests
        ```
    1. Add the following under `volumeMounts`:
        ```yml
        - mountPath: /etc/guard
          name: check
          readOnly: true
        ```
    1. Add the following `apiserver` arguments:
        ```yml
        - --authentication-token-webhook-config-file=/etc/guard/guard-authn-webhook.yaml
        - --authentication-token-webhook-cache-ttl=5m0s
        - --authorization-webhook-cache-authorized-ttl=5m0s
        - --authorization-webhook-config-file=/etc/guard/guard-authz-webhook.yaml
        - --authorization-webhook-version=v1
        - --authentication-token-webhook-config-file=/etc/guard/guard-authn-webhook.yaml
        ```
    
        If the Kubernetes cluster is of version >= 1.19.0, then the following additional `apiserver argument` needs to be set:

        ```yml
        - --authentication-token-webhook-version=v1
        ```
    1. Save and exit the editor to update the apiserver pod.
    
## Create role assignments for users to access cluster

Owners of the Azure Arc enabled Kubernetes resource can either use built-in roles or custom roles to grant other users access to the Kubernetes cluster.

### Built-in roles

| Role | Description |
|---|---|
| Azure Arc Kubernetes Viewer | Allows read-only access to see most objects in a namespace. This role does not allow viewing Secrets, since reading the contents of Secrets enables access to ServiceAccount credentials in the namespace, which would allow API access as any ServiceAccount in the namespace (a form of privilege escalation) |
| Azure Arc Kubernetes Writer | Allows read/write access to most objects in a namespace. This role does not allow viewing or modifying roles or role bindings. However, this role allows accessing Secrets and running Pods as any ServiceAccount in the namespace, so it can be used to gain the API access levels of any ServiceAccount in the namespace. |
| Azure Arc Kubernetes Admin | Allows admin access, intended to be granted within a namespace using a RoleBinding. If used in a RoleBinding, allows read/write access to most resources in a namespace, including the ability to create roles and role bindings within the namespace. This role does not allow write access to resource quota or to the namespace itself. |
| Azure Arc Kubernetes Cluster Admin | Allows super-user access to perform any action on any resource. When used in a ClusterRoleBinding, it gives full control over every resource in the cluster and in all namespaces. When used in a RoleBinding, it gives full control over every resource in the role binding's namespace, including the namespace itself.|

Roles assignments scoped to the Arc enabled Kubernetes cluster can be performed on the `Access Control (IAM)` blade of the cluster resource on Azure portal. An alternative option is to use Azure CLI commands as shown below:

```azurecli
az role assignment create --role "Azure Arc Kubernetes Cluster Admin" --assignee <AAD-ENTITY-ID> --scope $ARM_ID
```

where `AAD-ENTITY-ID` could be a username (for example, testuser@mytenant.onmicrosoft.com) or even the `appId` of a service principal.

Here's another example of creating a role assignment scoped to a specific namespace within the cluster -

```azurecli
az role assignment create --role "Azure Arc Kubernetes Viewer" --assignee <AAD-ENTITY-ID> --scope $ARM_ID/namespaces/<namespace-name>
```

> [!NOTE]
> While role assignments that are scoped to the cluster can be created using either the Azure portal or CLI, currently role assignments scoped to namespaces can only be created using the CLI.

### Custom roles

Optionally you may choose to create your own role definition for usage in role assignments.

Below is an example of a role definition that allows a user to only read only deployments. The full list of data actions that can be used to construct a role definition is available [here](../../role-based-access-control/resource-provider-operations#microsoftkubernetes).

Copy the below JSON object into a file called custom-role.json and replace `<subscription-id>` placeholder with the actual subscription ID. The below custom role uses one of the data actions and lets you view all deployments in the scope (cluster/namespace) the role assignment is created at.

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

Create the role definition by running the below command from the folder where you saved custom-role.json

```bash
az role definition create --role-definition @custom-role.json
```

Create a role assignment using this custom role definition:

```bash
az role assignment create --role "Arc Deployment Viewer" --assignee <AAD-ENTITY-ID> --scope $ARM_ID/namespaces/<namespace-name>
```

## Configure kubectl with user credentials

Every user who wants to access the Kubernetes cluster needs to do the following on their machine:

1. Run the following command to set credentials for user:

    ```console
    kubectl config set-credentials <testuser>@<mytenant.onmicrosoft.com> \
    --auth-provider=azure \
    --auth-provider-arg=environment=AzurePublicCloud \
    --auth-provider-arg=client-id=<clientApplicationId> \
    --auth-provider-arg=tenant-id=<tenantId> \
    --auth-provider-arg=apiserver-id=<serverApplicationId>
    ```

2. Open your kubeconfig file you created earlier. Under contexts, update the context associated with cluster to point to the credentials created in step #1.

3. Add **config-mode** setting under user config:
  
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

4. Run any `kubectl` command (for example `kubectl get nodes` or `kubectl get pods`).

5. You'll be prompted for a browser based authentication. Copy the device login URL `https://microsoft.com/devicelogin` and open the same on one of your web browsers.

6. You'll now be prompted to enter the code printed on your console. Copy the code on your terminal and paste the same in the device authentication input prompt.

7. You'll then be prompted to enter the username (testuser@mytenant.onmicrosoft.com) and associated password.

8. After successful validation, one of two things can happen:
    * You'll see the response returned back successfully. This means that Azure was able to confirm that you are authorized to access the requested resource (namespace/pod/...).
    * You'll see an error message similar to the following:

        `Error from server (Forbidden): nodes is forbidden: User "testuser@mytenant.onmicrosoft.com" cannot list resource "nodes" in API group "" at the cluster scope: User does not have access to the resource in Azure. Update role assignment to allow access.`

    In this case, the user making the request was not authorized to access the requested resource. An administrator would have to create a new role assignment authorizing this user to have access on the resource.