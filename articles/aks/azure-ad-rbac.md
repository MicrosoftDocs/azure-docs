---
title: Control cluster resources with RBAC and Azure AD in Azure Kubernetes Service
description: Learn how to use Azure Active Directory group membership to restrict access to cluster resources using role-based access controls (RBAC) in Azure Kubernetes Service (AKS)
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: article
ms.date: 04/02/2019
ms.author: iainfou
---

# Control access to cluster resources using role-based access controls and Azure Active Directory identities in Azure Kubernetes Service

Azure Kubernetes Service (AKS) can be configured to use Azure Active Directory (AD) for user authentication. In this configuration, you sign in to an AKS cluster using an Azure AD authentication token. You can also configure Kubernetes role-based access control (RBAC) to limit access to cluster resources based a user's identity or group membership.

This article shows you how to use Azure AD group membership to control access to namespaces and cluster resources using Kubernetes RBAC in an AKS cluster.

## Before you begin

This article assumes that you have an existing AKS cluster enabled with Azure AD integration. If you need an AKS cluster, see [Integrate Azure Active Directory with AKS][azure-ad-aks-cli].

You need the Azure CLI version 2.0.61 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Create demo groups in Azure AD

In this article, let's create two user roles that can be used to show how Kubernetes RBAC and Azure AD control access to cluster resources. The following two example roles are used:

* **Application developer**
    * A user named *aksdev* that is part of the *appdev* group.
* **Site reliability engineer**
    * A user named *akssre* that is part of the *opssre* group.

In production environments, you can use existing users and groups within an Azure AD tenant.

First, get the resource ID of your AKS cluster using the [az aks show][az-aks-show] command. Assign the resource ID to a variable named *AKS_ID* so that it can be referenced in additional commands.

```azurecli-interactive
AKS_ID=$(az aks show \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --query id -o tsv)
```

Create the first example group in Azure AD for the application developers using the [az ad group create][az-ad-group-create] command. The following example creates a group named *appdev*:

```azurecli-interactive
APPDEV_ID=$(az ad group create --display-name appdev --mail-nickname appdev)
```

Now, create an Azure role assignment for the *appdev* group using the [az role assignment create][az-role-assignment-create] command. This assignment grants any member of the group the *Azure Kubernetes Service Cluster User Role* that lets them use `kubectl` to interact with an AKS cluster.

```azurecli-interactive
# Create a role assignment to provide 'Cluster User'
az role assignment create \
  --assignee $APPDEV_ID \
  --role "Azure Kubernetes Service Cluster User Role" \
  --scope $AKS_ID
```

Create a second example group, this one for SREs named *opssre*:

```azurecli-interactive
$OPSSRE_ID=$(az ad group create --display-name opssre --mail-nickname opssre)
```

Again, create an Azure role assignment to grant members of the group the *Azure Kubernetes Service Cluster User Role*:

```azurecli-interactive
# Create a role assignment to provide 'Cluster User'
az role assignment create \
  --assignee $OPSSRE_ID \
  --role "Azure Kubernetes Service Cluster User Role" \
  --scope $AKS_ID
```

## Create demo users in Azure AD

With two example groups created in Azure AD for our application developers and SREs, now create two example users. To test the RBAC integration at the end of the article, you sign in to the AKS cluster with these accounts.

Create the first user account in Azure AD using the [az ad user create][az-ad-user-create] command.

The following example creates a user with the display name *AKS Dev* and the user principal name (UPN) of *aksdev@contoso.com*. Update the UPN to include a verified domain for your Azure AD tenant (replace *contoso.com* with your own domain), and provide your own secure `--password` credential:

```azurecli-interactive
# Create a user for the 'dev' role
AKSDEV_ID=$(az ad user create \
  --display-name "AKS Dev" \
  --user-principal-name aksdev@contoso.com \
  --password P@ssw0rd1 \
  --query objectId -o tsv)
```

Now add the user to the *appdev* group created in the previous section using the [az ad group member add][az-ad-group-member-add] command:

```azurecli-interactive
# Add the user to the 'dev' group
az ad group member add --group appdev --member-id $AKSDEV_ID
```

Create a second user account. The following example creates a user with the display name *AKS SRE* and the user principal name (UPN) of *akssre@contoso.com*. Again, update the UPN to include a verified domain for your Azure AD tenant (replace *contoso.com* with your own domain), and provide your own secure `--password` credential:

```azurecli-interactive
# Create a user for the 'sre' role
AKSSRE_ID=$(az ad user create \
  --display-name "AKS SRE" \
  --user-principal-name akssre@contoso.com \
  --password P@ssw0rd1 \
  --query objectId -o tsv)

# Add the user to the 'sre' group
az ad group member add --group opssre --member-id $AKSSRE_ID
```

## Create AKS cluster resources for the application developers

The Azure AD groups and users are now created. Azure role assignments were created for the group members to connect to an AKS cluster as a regular user. Now, let's configure the AKS cluster to allow these different groups access to specific resources.

First, get the cluster admin credentials using the [az aks get-credentials][az-aks-get-credentials] command. In one of the following sections, you get the regular *user* cluster credentials to see the Azure AD authentication flow in action.

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster --admin
```

Create a namespace in the AKS cluster using the [kubectl create namespace][kubectl-create] command. The following example creates a namespace name *dev*:

```console
kubectl create namespace dev
```

In Kubernetes, *Roles* define the permissions to grant, and *RoleBindings* apply them to desired users or groups. These assignments can be applied to a given namespace, or across the entire cluster. For more information, see [Using RBAC authorization][rbac-authorization].

First, create a role for the dev namespace. This role grants full permissions to the namespace. In production environments, you can change permissions granted for different users or groups.

Create a file named `role-dev-namespace.yaml` and paste the following YAML manifest:

```yaml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1beta1
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

Create the Role using the [kubectl apply][kubectl-apply] command and specify the filename of your YAML manifest:

```console
kubectl apply -f role-dev-namespace.json
```

Next, get the resource ID for the *appdev* group using the [az ad group show][az-ad-group-show] command. This group is set as the subject of a RoleBinding.

```azurecli-interactive
az ad group show --group appdev --query objectId -o tsv
```

Now, create a RoleBinding for the *appdev* group to use the previously created role for namespace access. Create a file named `rolebinding-dev-namespace.yaml` and paste the following YAML manifest. On the last line, replace *<group objectId>*  with the group object ID output from the previous command:

```yaml
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
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
  name: <group objectId>
```

Create the RoleBinding using the [kubectl apply][kubectl-apply] command and specify the filename of your YAML manifest:

```console
kubectl apply -f rolebinding-dev-namespace.yaml
```

## Create AKS cluster resources for the site reliability engineers

Now, repeat the previous steps to create a namespace, Role, and RoleBinding for the SREs.

First, create a namespace using the [kubectl create namespace][kubectl-create] command named *sre*:

```console
kubectl create namespace sre
```

Create a file named `role-sre-namespace.yaml` and paste the following YAML manifest:

```yaml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1beta1
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

Create the Role using the [kubectl apply][kubectl-apply] command and specify the filename of your YAML manifest:

```console
kubectl apply -f role-sre-namespace.json
```

Get the resource ID for the *opssre* group using the [az ad group show][az-ad-group-show] command:

```azurecli-interactive
az ad group show --group opssre --query objectId -o tsv
```

Create a RoleBinding for the *opssre* group to use the previously created role for namespace access. Create a file named `rolebinding-sre-namespace.yaml` and paste the following YAML manifest. On the last line, replace *<group objectId>*  with the group object ID output from the previous command:

```yaml
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: sre-user-access
  namespace: sre
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: sre-user-full-access
subjects:
- kind: Group
  name: 068530e1-6836-4703-8bad-37528d713bda
  namespace: sre
```

Create the RoleBinding using the [kubectl apply][kubectl-apply] command and specify the filename of your YAML manifest:

```console
kubectl apply -f rolebinding-akssre-namespace.json
```

## Create and manage cluster resources using Azure AD identity

Now, let's test the expected permissions work when you create and manage resources in an AKS cluster. In these examples, try to schedule and view pods in the user's assigned namespace. Then, try to schedule and view pods outside of the assigned namespace.

First, reset the kubeconfig context to use the user credentials. In a previous section, you set the context for the cluster admin credentials, which bypasses Azure AD sign in prompts. The user context instead requires all requests to be authenticated using Azure AD.

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster --overwrite-existing
```

Schedule a basic NGINX pod using the [kubectl run][kubectl-run] command in the *dev* namespace:

```console
kubectl run --generator=run-pod/v1 nginx-dev --image=nginx --namespace dev
```

As the sign in prompt, enter the credentials for the *appdev@contoso.com* account created in the first section. Once you are successfully signed in, the account token is cached for future `kubectl` commands.

Now use the [kubectl get pods][kubectl-get] command to view pods in the *dev* namespace.

```console
kubectl get pods --namespace dev
```

As shown in the following example output, the NGINX pod is successfully *Running*:

```console
$ kubectl get pods --namespace dev

NAME        READY   STATUS    RESTARTS   AGE
nginx-dev   1/1     Running   0          4m
```

Now try to view pods outside of the *dev* namespace. Use the [kubectl get pods][kubectl-get] command again, this time to see `--all-namespaces`:

```console
kubectl get pods --all-namespaces
```

The user's group membership does not have a Kubernetes Role that allows this action, as shown in the following example output:

```console
$ kubectl get pods --all-namespaces

Error from server (Forbidden): pods is forbidden: User "aksdev@contoso.com" cannot list resource "pods" in API group "" at the cluster scope
```

In the same way, try to schedule a pod in different namespace, such as the *sre* namespace. The user's group membership does not align with a Kubernetes Role and RoleBinding to grant these permissions, as shown in the following example output:

```console
$ kubectl run --generator=run-pod/v1 nginx-dev --image=nginx --namespace sre

Error from server (Forbidden): pods is forbidden: User "aksdev@contoso.com" cannot create resource "pods" in API group "" in the namespace "sre"
```

### Test the SRE access to the AKS cluster resources

To confirm that our Azure AD group membership and Kubernetes RBAC work correctly between different users and groups, try the previous commands when signed in as the *opssre* user.

Reset the kubeconfig context and force a user sign in:

```azurecli-interactive
az aks get-credentials --resource-group myResourecGroup --name myAKSCluster --overwrite-existing
```

To to schedule and view pods in the assigned SRE namespace. When prompted, sign in with the *opssre@contoso.com* credentials created in the first section. These `kubectl` commands let you successfully create and view the pods:

```console
kubectl run --generator=run-pod/v1 nginx-sre --image=nginx --namespace sre
kubectl get pods --namespace sre
```

Now, try to view or schedule pods outside of assigned SRE namespace. Again, these `kubectl` commands fail, as the user's group membership and Kubernetes Role and RoleBindings don't grant permissions to other namespaces:

```console
kubectl get pods --all-namespaces
kubectl run --generator=run-pod/v1 nginx-sre --image=nginx --namespace dev
```

## Next Steps

Learn more about securing Kubernetes clusters with RBAC with the [Using RBAC Authorization][rbac-authorization] documentation.

<!-- LINKS - external -->
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-run]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#run

<!-- LINKS - internal -->
[az-aks-create]: /cli/azure/aks?view=azure-cli-latest#az-aks-create
[az-aks-get-credentials]: /cli/azure/aks?view=azure-cli-latest#az-aks-get-credentials
[az-group-create]: /cli/azure/group#az-group-create
[open-id-connect]:../active-directory/develop/v1-protocols-openid-connect-code.md
[az-ad-user-show]: /cli/azure/ad/user#az-ad-user-show
[az-ad-app-create]: /cli/azure/ad/app#az-ad-app-create
[az-ad-app-update]: /cli/azure/ad/app#az-ad-app-update
[az-ad-sp-create]: /cli/azure/ad/sp#az-ad-sp-create
[az-ad-app-permission-add]: /cli/azure/ad/app/permission#az-ad-app-permission-add
[az-ad-app-permission-grant]: /cli/azure/ad/app/permission#az-ad-app-permission-grant
[az-ad-app-permission-admin-consent]: /cli/azure/ad/app/permission#az-ad-app-permission-admin-consent
[az-ad-app-show]: /cli/azure/ad/app#az-ad-app-show
[az-group-create]: /cli/azure/group#az-group-create
[az-account-show]: /cli/azure/account#az-account-show
[az-ad-signed-in-user-show]: /cli/azure/ad/signed-in-user#az-ad-signed-in-user-show
[azure-ad-portal]: aad-integration.md
[install-azure-cli]: /cli/azure/install-azure-cli
[az-ad-sp-credential-reset]: /cli/azure/ad/sp/credential#az-ad-sp-credential-reset
[azure-ad-aks-cli]: aad-integration-cli.md
[az-aks-show]:
[az-ad-group-create]:
[az-role-assignment-create]:
[az-ad-user-create]:
[az-ad-group-member-add]:
[az-ad-group-show]:
