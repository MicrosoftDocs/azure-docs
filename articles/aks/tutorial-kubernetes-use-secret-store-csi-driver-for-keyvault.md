---
title: Securing Kubernetes Secrets with Azure Key Vault
titleSuffix: Azure Kubernetes Service
description: Learn how to get Secrets from Azure Key Vault in Azure Kubernetes Service (AKS) using AAD Pod Identity and Secrets Store CSI provider
services: container-service
ms.topic: tutorial
ms.date: 05/03/2020

---

# Securing Kubernetes Secrets with Azure Key Vault

## Introduction

A Secret in Kubernetes is meant to save sensitive and secure data like passwords, certificates and keys. These Secret objects are not really secret or secure! They are just encoded using Base64 and saved into *etcd*. In addition to that, by default, any pod can access to them. One solution to this would be to encrypt data at rest as explained in [Kubernetes documentation](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data). In this case it is recommended to use a Key Management System (KMS) to securely save the encryption keys.
KMS systems themselves have the feature to save the sensitive data like keys, secrets, files and certificates. So, why not simply using it instead! Even more than just encryption, they offer powerful features like key rotation and expiration date.

Now, to access KMS, a password is needed and thus will be saved in a Secret object in *etcd*! We returned back to the same problem. Fortunately, cloud providers have a solution. Instead of using a password to access KMS, the managed Kubernetes cluster will be granted access to KMS. In Azure for example, AKS can connect to Key Vault or SQL Database… using an Identity. That is the opensource [project Pod Identity](https://github.com/Azure/aad-pod-identity). It uses Azure AD to create an Identity and assign the roles and resources.

Now that we have access to Key Vault, we can use its SDK or REST API in the application to retrieve the secrets. The SDK have support for .NET, Java, Python, JS, Ruby, PHP, etc. Or we can retrieve the secrets from a mounted volume. Historically, in Azure, this was doable through [Kubernetes Key Vault Flex Volume](https://github.com/Azure/kubernetes-keyvault-flexvol). Now it is being deprecated. The new solution is [Azure Key Vault provider for Secret Store CSI driver](https://github.com/Azure/secrets-store-csi-driver-provider-azure). Which is the Azure implementation of [Secrets Store CSI driver](https://github.com/kubernetes-sigs/secrets-store-csi-driver).

This tutorial will help you to securely retrieve secrets in Key Vault right from the Pod using Secrets Store CSI and AAD Pod Identity.

## Setting up the environment

To complete this workshop, we need an AKS cluster named “aks-demo”, az, kubectl, helm CLI and Key Vault named “az-key-vault-demo” with the following secrets: “DatabaseLogin: MyDBLoginName” and “DatabasePassword: MyP@ssword123456”.
Then we need to get the following parameters:


```azurecli-interactive
$subscriptionId = (az account show | ConvertFrom-Json).id
$tenantId = (az account show | ConvertFrom-Json).tenantId
$keyVaultName = "az-key-vault-demo"
$keyVault = (az keyvault show -n $keyVaultName | ConvertFrom-Json)
$secret1Name = "DatabaseLogin"
$secret2Name = "DatabasePassword"
$secret1Alias = "DATABASE_LOGIN"
$secret2Alias = "DATABASE_PASSWORD" 
$aksName = "aks-demo"
$identityName = "identity-aks-kv"
$identitySelector = "azure-kv"
$secretProviderClassName = "secret-provider-kv"
$resourceGroupName = (az keyvault show -n $keyVaultName | ConvertFrom-Json).resourceGroup
$aks = (az aks show -n $aksName -g $resourceGroupName | ConvertFrom-Json)
```
> [!IMPORTANT]
> 
> Key Vault, AKS and Identity are in the same resource group
> 

## Installing Secrets Store CSI driver and Key Vault Provider

We’ll start by installing Secrets Store CSI driver using Helm charts into a separate namespace.


```azurecli-interactive
$ helm repo add secrets-store-csi-driver https://raw.githubusercontent.com/kubernetes-sigs/secrets-store-csi-driver/master/charts
"secrets-store-csi-driver" has been added to your repositories
$ kubectl create ns csi-driver
namespace/csi-driver created
$ helm install csi-secrets-store secrets-store-csi-driver/secrets-store-csi-driver --namespace csi-driver
NAMESPACE: csi-driver
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
The Secrets Store CSI Driver is getting deployed to your cluster.
To verify that Secrets Store CSI Driver has started, run:
  kubectl --namespace=csi-driver get pods -l "app=secrets-store-csi-driver"
Now you can follow these steps https://github.com/kubernetes-sigs/secrets-store-csi-driver#use-the-secrets-stor
```
Let's check the new created pods:

```azurecli-interactive
$ kubectl get pods --namespace=csi-driver
NAME                                               READY   STATUS    RESTARTS   AGE
csi-secrets-store-secrets-store-csi-driver-9mqxg   3/3     Running   0          49s
```

## Installing Secrets Store CSI Driver and Key Vault Provider

In this step, we’ll install the Azure driver implementation for CSI, and we should see the pods running on each node.

```azurecli-interactive
$ kubectl apply -f https://raw.githubusercontent.com/Azure/secrets-store-csi-driver-provider-azure/master/deployment/provider-azure-installer.yaml --namespace csi-driver
daemonset.apps/csi-secrets-store-provider-azure created
$ kubectl get pods -n csi-driver
csi-secrets-store-provider-azure-wkhtz             1/1     Running   0          19s
csi-secrets-store-secrets-store-csi-driver-9mqx    3/3     Running   0          64s
```

## Using the Azure Key Vault Provider

Now that we have the driver installed, let's use the SecretProviderClass to configure the Key Vault instance to connect to the specific keys, secrets or certificates to retrieve. Note how we are providing the Key Vault name, resource group, subscription Id, tenant Id and then the name of the secrets.

```azurecli-interactive
$secretProviderKV = @"
apiVersion: secrets-store.csi.x-k8s.io/v1alpha1
kind: SecretProviderClass
metadata:
  name: $($secretProviderClassName)
spec:
  provider: azure
  parameters:
    usePodIdentity: "true"
    useVMManagedIdentity: "false"
    userAssignedIdentityID: ""
    keyvaultName: $keyVaultName
    cloudName: AzurePublicCloud
    objects:  |
      array:
        - |
          objectName: $secret1Name
          objectAlias: $secret1Alias
          objectType: secret
          objectVersion: ""
        - |
          objectName: $secret2Name
          objectAlias: $secret2Alias
          objectType: secret
          objectVersion: ""
    resourceGroup: $resourceGroupName
    subscriptionId: $subscriptionId
    tenantId: $tenantId
"@
$secretProviderKV | kubectl create -f -
secretproviderclass.secrets-store.csi.x-k8s.io/secret-provider-kv created
```

> [!NOTE]
> Note: This sample used only Secrets in Key Vault, but we can also retrieve Keys and Certificates.

## Installing Pod Identity and providing access to Key Vault

The Azure Key Vault Provider offers four modes for accessing a Key Vault instance: Service Principal, Pod Identity, VMSS User Assigned Managed Identity and VMSS System Assigned Managed Identity.
Here we'll be using Pod Identity. Azure AD Pod Identity will be used to create an Identity in AAD and assign the right roles and resources. Let's first install it into the cluster.

## Installing AAD Pod Identity into AKS

We deploy Pod Identity using a YAML config file for a cluster with RBAC enabled. That will install Node Managed Identity (NMI) and Managed Identity Controllers (MIC) on each node.


```azurecli-interactive
$ kubectl apply -f https://raw.githubusercontent.com/Azure/aad-pod-identity/master/deploy/infra/deployment-rbac.yaml
serviceaccount/aad-pod-id-nmi-service-account created
customresourcedefinition.apiextensions.k8s.io/azureassignedidentities.aadpodidentity.k8s.io created
customresourcedefinition.apiextensions.k8s.io/azureidentitybindings.aadpodidentity.k8s.io created
customresourcedefinition.apiextensions.k8s.io/azureidentities.aadpodidentity.k8s.io created
customresourcedefinition.apiextensions.k8s.io/azurepodidentityexceptions.aadpodidentity.k8s.io created
clusterrole.rbac.authorization.k8s.io/aad-pod-id-nmi-role created
daemonset.apps/nmi created
clusterrolebinding.rbac.authorization.k8s.io/aad-pod-id-mic-binding created
deployment.apps/mic created
 $
 $ kubectl get pods
NAME                   READY   STATUS    RESTARTS   AGE
mic-76dd75ddf9-59vgm   1/1     Running   0          6s
mic-76dd75ddf9-qrvr4   1/1     Running   0          6s
nmi-64gfh              1/1     Running   0          7s
```


## Creating Azure User Identity

Create an Azure User Identity with the following command. Get clientId and id from  the output.
 
```azurecli-interactive
$identity = az identity create -g $resourceGroupName -n $identityName | ConvertFrom-Json
 
$identity
{
  "clientId": "a0c038fd-3df3-4eaf-bb34-abdd4f78a0db",
  "clientSecretUrl": "https://control-westeurope.identity.azure.net/subscriptions/<AZURE_SUBSCRIPTION_ID>/resourcegroups/rg-demo/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity-aks-kv/crede
ntials?tid=<AZURE_TENANT_ID>&oid=f8bb59bd-b704-4274-8391-3b0791d7a02c&aid=a0c038fd-3df3-4eaf
  "id": "/subscriptions/<AZURE_SUBSCRIPTION_ID>/resourcegroups/rg-demo/providers/Microsoft.Managed
Identity/userAssignedIdentities/identity-aks-kv",
  "location": "westeurope",
  "name": "identity-aks-kv",
  "principalId": "f8bb59bd-b704-4274-8391-3b0791d7a02c",
  "resourceGroup": "rg-demo",
  "tags": {},
  "tenantId": "<AZURE_TENANT_ID>",
  "type": "Microsoft.ManagedIdentity/userAssignedIdentities"
}
```

## Assigning Reader Role to new Identity for Key Vault

The Identity we created earlier will be used by AKS Pods to read secrets from Key Vault. Thus, it should have permissions to do so. We will assign it the Reader role to the KV scope.

```azurecli-interactive
$ az role assignment create --role "Reader" --assignee $identity.principalId --scope $keyVault.id

{
  "canDelegate": null,
  "id": "/subscriptions/<AZURE_SUBSCRIPTION_ID>/resourcegroups/rg-demo/providers/Microsoft.KeyVault/vaults/
az-key-vault-demo/providers/Microsoft.Authorization/roleAssignments/d6bd00b8-9734-4c53-9de3-5a5b203c3286",
  "name": "d6bd00b8-9734-4c53-9de3-5a5b203c3286",
  "principalId": "f8bb59bd-b704-4274-8391-3b0791d7a02c",
  "principalName": "a0c038fd-3df3-4eaf-bb34-abdd4f78a0db",
  "principalType": "ServicePrincipal",
  "resourceGroup": "rg-demo",
  "roleDefinitionId": "/subscriptions/<AZURE_SUBSCRIPTION_ID>/providers/Microsoft.Authorization/roleDefinit
ions/acdd72a7-3385-48ef-bd42-f606fba81ae7",
  "roleDefinitionName": "Reader",
  "scope": "/subscriptions/<AZURE_SUBSCRIPTION_ID>/resourcegroups/rg-demo/providers/Microsoft.KeyVault/vaul
ts/az-key-vault-demo",
  "type": "Microsoft.Authorization/roleAssignments"
}
```

## Providing required permissions for MIC

We need also to grant permissions to the AKS cluster with role “Managed Identity Operator”. For that we will need the Service Principal (SPN) used with AKS.
 
```azurecli-interactive
$ az role assignment create --role "Managed Identity Operator" --assignee $aks.servicePrincipalProfile.clientId --scope $identity.id

{
  "canDelegate": null,
  "id": "/subscriptions/<AZURE_SUBSCRIPTION_ID>/resourcegroups/rg-demo/providers/Microsoft.ManagedIdentity/
userAssignedIdentities/identity-aks-kv/providers/Microsoft.Authorization/roleAssignments/c018c932-c06b-446c-863e-bc85c68
7cf69",
  "name": "c018c932-c06b-446c-863e-bc85c687cf69",
  "principalId": "2736b5eb-e79e-48fa-9348-19f9c64ce7b3",
  "principalName": "http://aks-demoSP-20200430052736",
  "principalType": "ServicePrincipal",
  "resourceGroup": "rg-demo",
  "roleDefinitionId": "/subscriptions/<AZURE_SUBSCRIPTION_ID>/providers/Microsoft.Authorization/roleDefinit
ions/f1a07417-d97a-45cb-824c-7a7467783830",
  "roleDefinitionName": "Managed Identity Operator",
  "scope": "/subscriptions/<AZURE_SUBSCRIPTION_ID>/resourcegroups/rg-demo/providers/Microsoft.ManagedIdenti
ty/userAssignedIdentities/identity-aks-kv",
  "type": "Microsoft.Authorization/roleAssignments"
}
```


## Setting policy to access secrets in Key Vault

We should tell Key Vault to allow the Identity to perform only specific actions on the secrets like get, delete, update. In our case we need only permissions for GET. This is done by using a Policy.


```azurecli-interactive
$ az keyvault set-policy -n $keyVaultName --secret-permissions get --spn $identity.clientId

{
  "id": "/subscriptions/<AZURE_SUBSCRIPTION_ID>/resourceGroups/demo-rg/providers/Microsoft.KeyVault/vaults/kv-aks-demo",
  "location": "westeurope",
  "name": "kv-aks-demo",
  "properties": {
    "accessPolicies": [
      {
… code removed for brievety …
        "permissions": {
          "certificates": null,
          "keys": null,
          "secrets": [
            "get"

    "softDeleteRetentionInDays": null,
    "tenantId": "<AZURE_TENANT_ID>",
    "vaultUri": "https://kv-aks-demo.vault.azure.net/"
  },
  "resourceGroup": "demo-rg",
  "tags": {},
  "type": "Microsoft.KeyVault/vaults"
}
```

> [!NOTE]
> Note: To set policy to access keys or certs in keyvault, replace *--secret-permissions* by  *--key-permissions* or *--certificate-permissions*.

## Adding AzureIdentity and AzureIdentityBinding

The Pod needs to use the Identity to access to Key Vault. We’ll point to that Identity in AKS using AzureIdentity object and then we’ll assign it to the Pod through AzureIdentityBinding.

```azurecli-interactive
$ $aadPodIdentityAndBinding = @"
apiVersion: aadpodidentity.k8s.io/v1
kind: AzureIdentity
metadata:
  name: $($identityName)
spec:
  type: 0
  resourceID: $($identity.id)
  clientID: $($identity.clientId)
---
apiVersion: aadpodidentity.k8s.io/v1
kind: AzureIdentityBinding
metadata:
  name: $($identityName)-binding
spec:
  azureIdentity: $($identityName)
  selector: $($identitySelector)
"@

$ $aadPodIdentityAndBinding | kubectl apply -f -

azureidentity.aadpodidentity.k8s.io/identity-aks-kv created
azureidentitybinding.aadpodidentity.k8s.io/identity-aks-kv-binding created
```


> [!TIP]
> Note: Set type: 0 for Managed Service Identity; type: 1 for Service Principal. In this case, we are using managed service identity, type: 0.

> [!NOTE]
> Note the selector here as we’ll reuse it later with the pod that needs access to the Identity.

## Accessing Key Vault secrets from a Pod in AKS

At this stage, we can create a Pod and mount CSI driver on which we’ll find the login and password retrieved from Key Vault. Let's deploying a Nginx Pod for testing

```azurecli-interactive
$ $nginxPod = @"
kind: Pod
apiVersion: v1
metadata:
  name: nginx-secrets-store
  labels:
    aadpodidbinding: $($identitySelector)
spec:
  containers:
    - name: nginx
      image: nginx
      volumeMounts:
      - name: secrets-store-inline
        mountPath: "/mnt/secrets-store"
        readOnly: true
  volumes:
    - name: secrets-store-inline
      csi:
        driver: secrets-store.csi.k8s.io
        readOnly: true
        volumeAttributes:
          secretProviderClass: $($secretProviderClassName)
"@

$ $nginxPod | kubectl apply -f -
pod/nginx-secrets-store created
```

## Validating the pod has access to the secrets from Key Vault

Now, we’ll validate all what we have done before. Let’s list and read the content of the mounted CSI volume. If all is fine, we should see the secret values from our Key Vault.

```azurecli-interactive
$ kubectl exec -it nginx-secrets-store ls /mnt/secrets-store/
DATABASE_LOGIN  DATABASE_PASSWORD
$ kubectl exec -it nginx-secrets-store cat /mnt/secrets-store/DATABASE_LOGIN
MyDBLoginName
$ kubectl exec -it nginx-secrets-store cat /mnt/secrets-store/DATABASE_PASSWORD
MyP@ssword123456
```
