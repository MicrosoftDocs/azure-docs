---
title: Use Azure AD and Kubernetes RBAC for clusters
titleSuffix: Azure Kubernetes Service
description: Learn how to use Azure Active Directory group membership to restrict access to cluster resources using Kubernetes role-based access control (Kubernetes RBAC) in Azure Kubernetes Service (AKS)
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 02/13/2023
---

# Use Kubernetes role-based access control with Azure Active Directory in Azure Kubernetes Service

Azure Kubernetes Service (AKS) can be configured to use Azure Active Directory (Azure AD) for user authentication. In this configuration, you sign in to an AKS cluster using an Azure AD authentication token. Once authenticated, you can use the built-in Kubernetes role-based access control (Kubernetes RBAC) to manage access to namespaces and cluster resources based on a user's identity or group membership.

This article shows you how to:

* Control access using Kubernetes RBAC in an AKS cluster based on Azure AD group membership.
* Create example groups and users in Azure AD.
* Create Roles and RoleBindings in an AKS cluster to grant the appropriate permissions to create and view resources.

## Before you begin

* You have an existing AKS cluster with Azure AD integration enabled. If you need an AKS cluster with this configuration, see [Integrate Azure AD with AKS][azure-ad-aks-cli].
* Kubernetes RBAC is enabled by default during AKS cluster creation. To upgrade your cluster with Azure AD integration and Kubernetes RBAC, [Enable Azure AD integration on your existing AKS cluster][enable-azure-ad-integration-existing-cluster].
* Make sure that Azure CLI version 2.0.61 or later is installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
* If using Terraform, install [Terraform][terraform-on-azure] version 2.99.0 or later.

Use the Azure portal or Azure CLI to verify Azure AD integration with Kubernetes RBAC is enabled.

#### [Azure portal](#tab/portal)

To verify using the Azure portal:

* From your browser, sign in to the [Azure portal](https://portal.azure.com).
* Navigate to **Kubernetes services**, and from the left-hand pane select **Cluster configuration**.
* Under the **Authentication and Authorization** section, verify the **Azure AD authentication with Kubernetes RBAC** option is selected.

:::image type="content" source="./media/azure-ad-rbac/rbac-portal.png" alt-text="Example of AKS Authentication and Authorization page in Azure portal." lightbox="./media/azure-ad-rbac/rbac-portal.png":::

#### [Azure CLI](#tab/azure-cli)

You can verify using the Azure CLI `az aks show` command. Replace the value *myResourceGroup* with the resource group name hosting the AKS cluster resource, and replace *myAKSCluster* with the actual name of your AKS cluster.

```azurecli
az aks show --resource-group myResourceGroup --name myAKSCluster
```

If it's enabled, the output shows the value for `enableAzureRbac` is `false`.

---

## Create demo groups in Azure AD

In this article, we'll create two user roles to show how Kubernetes RBAC and Azure AD control access to cluster resources. The following two example roles are used:

* **Application developer**
  * A user named *aksdev* that's part of the *appdev* group.
* **Site reliability engineer**
  * A user named *akssre* that's part of the *opssre* group.

In production environments, you can use existing users and groups within an Azure AD tenant.

1. First, get the resource ID of your AKS cluster using the [`az aks show`][az-aks-show] command. Then, assign the resource ID to a variable named *AKS_ID* so it can be referenced in other commands.

    ```azurecli-interactive
    AKS_ID=$(az aks show \
        --resource-group myResourceGroup \
        --name myAKSCluster \
        --query id -o tsv)
    ```

2. Create the first example group in Azure AD for the application developers using the [`az ad group create`][az-ad-group-create] command. The following example creates a group named *appdev*:

    ```azurecli-interactive
    APPDEV_ID=$(az ad group create --display-name appdev --mail-nickname appdev --query Id -o tsv)
    ```

3. Create an Azure role assignment for the *appdev* group using the [`az role assignment create`][az-role-assignment-create] command. This assignment lets any member of the group use `kubectl` to interact with an AKS cluster by granting them the *Azure Kubernetes Service Cluster User* Role.

    ```azurecli-interactive
    az role assignment create \
      --assignee $APPDEV_ID \
      --role "Azure Kubernetes Service Cluster User Role" \
      --scope $AKS_ID
    ```

> [!TIP]
> If you receive an error such as `Principal 35bfec9328bd4d8d9b54dea6dac57b82 doesn't exist in the directory a5443dcd-cd0e-494d-a387-3039b419f0d5.`, wait a few seconds for the Azure AD group object ID to propagate through the directory then try the `az role assignment create` command again.

4. Create a second example group for SREs named *opssre*.

    ```azurecli-interactive
    OPSSRE_ID=$(az ad group create --display-name opssre --mail-nickname opssre --query objectId -o tsv)
    ```

5. Create an Azure role assignment to grant members of the group the *Azure Kubernetes Service Cluster User* Role.

    ```azurecli-interactive
    az role assignment create \
      --assignee $OPSSRE_ID \
      --role "Azure Kubernetes Service Cluster User Role" \
      --scope $AKS_ID
    ```

## Create demo users in Azure AD

Now that we have two example groups created in Azure AD for our application developers and SREs, we'll create two example users. To test the Kubernetes RBAC integration at the end of the article, you'll sign in to the AKS cluster with these accounts.

### Set the user principal name and password for application developers

Set the user principal name (UPN) and password for the application developers. The UPN must include the verified domain name of your tenant, for example `aksdev@contoso.com`.

The following command prompts you for the UPN and sets it to *AAD_DEV_UPN* so it can be used in a later command:

```azurecli-interactive
echo "Please enter the UPN for application developers: " && read AAD_DEV_UPN
```

The following command prompts you for the password and sets it to *AAD_DEV_PW* for use in a later command:

```azurecli-interactive
echo "Please enter the secure password for application developers: " && read AAD_DEV_PW
```

### Create the user accounts

1. Create the first user account in Azure AD using the [`az ad user create`][az-ad-user-create] command. The following example creates a user with the display name *AKS Dev* and the UPN and secure password using the values in *AAD_DEV_UPN* and *AAD_DEV_PW*:

```azurecli-interactive
AKSDEV_ID=$(az ad user create \
  --display-name "AKS Dev" \
  --user-principal-name $AAD_DEV_UPN \
  --password $AAD_DEV_PW \
  --query objectId -o tsv)
```

2. Add the user to the *appdev* group created in the previous section using the [`az ad group member add`][az-ad-group-member-add] command.

```azurecli-interactive
az ad group member add --group appdev --member-id $AKSDEV_ID
```

3. Set the UPN and password for SREs. The UPN must include the verified domain name of your tenant, for example `akssre@contoso.com`. The following command prompts you for the UPN and sets it to *AAD_SRE_UPN* for use in a later command:

```azurecli-interactive
echo "Please enter the UPN for SREs: " && read AAD_SRE_UPN
```

4. The following command prompts you for the password and sets it to *AAD_SRE_PW* for use in a later command:

```azurecli-interactive
echo "Please enter the secure password for SREs: " && read AAD_SRE_PW
```

5. Create a second user account. The following example creates a user with the display name *AKS SRE* and the UPN and secure password using the values in *AAD_SRE_UPN* and *AAD_SRE_PW*:

```azurecli-interactive
# Create a user for the SRE role
AKSSRE_ID=$(az ad user create \
  --display-name "AKS SRE" \
  --user-principal-name $AAD_SRE_UPN \
  --password $AAD_SRE_PW \
  --query objectId -o tsv)

# Add the user to the opssre Azure AD group
az ad group member add --group opssre --member-id $AKSSRE_ID
```

## Create AKS cluster resources for app devs

We have our Azure AD groups, users, and Azure role assignments created. Now, we'll configure the AKS cluster to allow these different groups access to specific resources.

1. Get the cluster admin credentials using the [`az aks get-credentials`][az-aks-get-credentials] command. In one of the following sections, you get the regular *user* cluster credentials to see the Azure AD authentication flow in action.

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster --admin
```

2. Create a namespace in the AKS cluster using the [`kubectl create namespace`][kubectl-create] command. The following example creates a namespace name *dev*:

```console
kubectl create namespace dev
```

> [!NOTE]
> In Kubernetes, *Roles* define the permissions to grant, and *RoleBindings* apply them to desired users or groups. These assignments can be applied to a given namespace, or across the entire cluster. For more information, see [Using Kubernetes RBAC authorization][rbac-authorization].
>
> If the user you grant the Kubernetes RBAC binding for is in the same Azure AD tenant, assign permissions based on the *userPrincipalName (UPN)*. If the user is in a different Azure AD tenant, query for and use the *objectId* property instead.

3. Create a Role for the *dev* namespace, which grants full permissions to the namespace. In production environments, you can specify more granular permissions for different users or groups. Create a file named `role-dev-namespace.yaml` and paste the following YAML manifest:

```yaml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: dev-user-full-access
  namespace: dev
rules:
- apiGroups: ["", "extensions", "apps"]
  resources: ["*"]
  verbs: ["*"]
- apiGroups: ["batch"]
  resources:
  - jobs
  - cronjobs
  verbs: ["*"]
```

4. Create the Role using the [`kubectl apply`][kubectl-apply] command and specify the filename of your YAML manifest.

```console
kubectl apply -f role-dev-namespace.yaml
```

5. Get the resource ID for the *appdev* group using the [`az ad group show`][az-ad-group-show] command. This group is set as the subject of a RoleBinding in the next step.

```azurecli-interactive
az ad group show --group appdev --query id -o tsv
```

6. Create a RoleBinding for the *appdev* group to use the previously created Role for namespace access. Create a file named `rolebinding-dev-namespace.yaml` and paste the following YAML manifest. On the last line, replace *groupObjectId*  with the group object ID output from the previous command.

```yaml
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: dev-user-access
  namespace: dev
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: dev-user-full-access
subjects:
- kind: Group
  namespace: dev
  name: groupObjectId
```

> [!TIP]
> If you want to create the RoleBinding for a single user, specify *kind: User* and replace *groupObjectId* with the user principal name (UPN) in the above sample.

7. Create the RoleBinding using the [`kubectl apply`][kubectl-apply] command and specify the filename of your YAML manifest:

```console
kubectl apply -f rolebinding-dev-namespace.yaml
```

## Create the AKS cluster resources for SREs

Now, we'll repeat the previous steps to create a namespace, Role, and RoleBinding for the SREs.

1. Create a namespace for *sre* using the [`kubectl create namespace`][kubectl-create] command.

```console
kubectl create namespace sre
```

2. Create a file named `role-sre-namespace.yaml` and paste the following YAML manifest:

```yaml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: sre-user-full-access
  namespace: sre
rules:
- apiGroups: ["", "extensions", "apps"]
  resources: ["*"]
  verbs: ["*"]
- apiGroups: ["batch"]
  resources:
  - jobs
  - cronjobs
  verbs: ["*"]
```

3. Create the Role using the [`kubectl apply`][kubectl-apply] command and specify the filename of your YAML manifest.

```console
kubectl apply -f role-sre-namespace.yaml
```

4. Get the resource ID for the *opssre* group using the [az ad group show][az-ad-group-show] command.

```azurecli-interactive
az ad group show --group opssre --query id -o tsv
```

4. Create a RoleBinding for the *opssre* group to use the previously created Role for namespace access. Create a file named `rolebinding-sre-namespace.yaml` and paste the following YAML manifest. On the last line, replace *groupObjectId*  with the group object ID output from the previous command.

```yaml
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: sre-user-access
  namespace: sre
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: sre-user-full-access
subjects:
- kind: Group
  namespace: sre
  name: groupObjectId
```

5. Create the RoleBinding using the [`kubectl apply`][kubectl-apply] command and specify the filename of your YAML manifest.

```console
kubectl apply -f rolebinding-sre-namespace.yaml
```

## Interact with cluster resources using Azure AD identities

Now, we'll test that the expected permissions work when you create and manage resources in an AKS cluster. In these examples, we'll schedule and view pods in the user's assigned namespace, and try to schedule and view pods outside of the assigned namespace.

1. Reset the *kubeconfig* context using the [`az aks get-credentials`][az-aks-get-credentials] command. In a previous section, you set the context using the cluster admin credentials. The admin user bypasses Azure AD sign-in prompts. Without the `--admin` parameter, the user context is applied that requires all requests to be authenticated using Azure AD.

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster --overwrite-existing
```

2. Schedule a basic NGINX pod using the [`kubectl run`][kubectl-run] command in the *dev* namespace.

```console
kubectl run nginx-dev --image=mcr.microsoft.com/oss/nginx/nginx:1.15.5-alpine --namespace dev
```

3. Enter the credentials for your own `appdev@contoso.com` account created at the start of the article as the sign-in prompt. Once you're successfully signed in, the account token is cached for future `kubectl` commands. The NGINX is successfully schedule, as shown in the following example output:

```console
$ kubectl run nginx-dev --image=mcr.microsoft.com/oss/nginx/nginx:1.15.5-alpine --namespace dev

To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code B24ZD6FP8 to authenticate.

pod/nginx-dev created
```

4. Use the [`kubectl get pods`][kubectl-get] command to view pods in the *dev* namespace.

```console
kubectl get pods --namespace dev
```

5. Ensure the status of the NGINX pod is *Running*. The output will look similar to the following output:

```console
$ kubectl get pods --namespace dev

NAME        READY   STATUS    RESTARTS   AGE
nginx-dev   1/1     Running   0          4m
```

### Create and view cluster resources outside of the assigned namespace

Try to view pods outside of the *dev* namespace. Use the [`kubectl get pods`][kubectl-get] command again, this time to see `--all-namespaces`.

```console
kubectl get pods --all-namespaces
```

The user's group membership doesn't have a Kubernetes Role that allows this action, as shown in the following example output:

```console
Error from server (Forbidden): pods is forbidden: User "aksdev@contoso.com" cannot list resource "pods" in API group "" at the cluster scope
```

In the same way, try to schedule a pod in a different namespace, such as the *sre* namespace. The user's group membership doesn't align with a Kubernetes Role and RoleBinding to grant these permissions, as shown in the following example output:

```console
$ kubectl run nginx-dev --image=mcr.microsoft.com/oss/nginx/nginx:1.15.5-alpine --namespace sre

Error from server (Forbidden): pods is forbidden: User "aksdev@contoso.com" cannot create resource "pods" in API group "" in the namespace "sre"
```

### Test the SRE access to the AKS cluster resources

To confirm that our Azure AD group membership and Kubernetes RBAC work correctly between different users and groups, try the previous commands when signed in as the *opssre* user.

1. Reset the *kubeconfig* context using the [`az aks get-credentials`][az-aks-get-credentials] command that clears the previously cached authentication token for the *aksdev* user.

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster --overwrite-existing
```

2. Try to schedule and view pods in the assigned *sre* namespace. When prompted, sign in with your own `opssre@contoso.com` credentials created at the start of the article.

```console
kubectl run nginx-sre --image=mcr.microsoft.com/oss/nginx/nginx:1.15.5-alpine --namespace sre
kubectl get pods --namespace sre
```

As shown in the following example output, you can successfully create and view the pods:

```console
$ kubectl run nginx-sre --image=mcr.microsoft.com/oss/nginx/nginx:1.15.5-alpine --namespace sre

3. To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code BM4RHP3FD to authenticate.

pod/nginx-sre created

$ kubectl get pods --namespace sre

NAME        READY   STATUS    RESTARTS   AGE
nginx-sre   1/1     Running   0
```

4. Try to view or schedule pods outside of assigned SRE namespace.

```console
kubectl get pods --all-namespaces
kubectl run nginx-sre --image=mcr.microsoft.com/oss/nginx/nginx:1.15.5-alpine --namespace dev
```

These `kubectl` commands fail, as shown in the following example output. The user's group membership and Kubernetes Role and RoleBindings don't grant permissions to create or manager resources in other namespaces.

```console
$ kubectl get pods --all-namespaces
Error from server (Forbidden): pods is forbidden: User "akssre@contoso.com" cannot list pods at the cluster scope

$ kubectl run nginx-sre --image=mcr.microsoft.com/oss/nginx/nginx:1.15.5-alpine --namespace dev
Error from server (Forbidden): pods is forbidden: User "akssre@contoso.com" cannot create pods in the namespace "dev"
```

## Clean up resources

In this article, you created resources in the AKS cluster and users and groups in Azure AD. To clean up all of the resources, run the following commands:

```azurecli-interactive
# Get the admin kubeconfig context to delete the necessary cluster resources.

az aks get-credentials --resource-group myResourceGroup --name myAKSCluster --admin

# Delete the dev and sre namespaces. This also deletes the pods, Roles, and RoleBindings.

kubectl delete namespace dev
kubectl delete namespace sre

# Delete the Azure AD user accounts for aksdev and akssre.

az ad user delete --upn-or-object-id $AKSDEV_ID
az ad user delete --upn-or-object-id $AKSSRE_ID

# Delete the Azure AD groups for appdev and opssre. This also deletes the Azure role assignments.

az ad group delete --group appdev
az ad group delete --group opssre
```

## Next steps

* For more information about how to secure Kubernetes clusters, see [Access and identity options for AKS][rbac-authorization].

* For best practices on identity and resource control, see [Best practices for authentication and authorization in AKS][operator-best-practices-identity].

<!-- LINKS - external -->
[kubectl-create]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#create
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-run]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#run

<!-- LINKS - internal -->
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[install-azure-cli]: /cli/azure/install-azure-cli
[azure-ad-aks-cli]: managed-azure-ad.md
[az-aks-show]: /cli/azure/aks#az_aks_show
[az-ad-group-create]: /cli/azure/ad/group#az_ad_group_create
[az-role-assignment-create]: /cli/azure/role/assignment#az_role_assignment_create
[az-ad-user-create]: /cli/azure/ad/user#az_ad_user_create
[az-ad-group-member-add]: /cli/azure/ad/group/member#az_ad_group_member_add
[az-ad-group-show]: /cli/azure/ad/group#az_ad_group_show
[rbac-authorization]: concepts-identity.md#kubernetes-rbac
[operator-best-practices-identity]: operator-best-practices-identity.md
[terraform-on-azure]: /azure/developer/terraform/overview
[enable-azure-ad-integration-existing-cluster]: managed-azure-ad.md#use-an-existing-cluster