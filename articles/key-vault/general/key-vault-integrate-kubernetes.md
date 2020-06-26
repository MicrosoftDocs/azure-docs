---
title: Integrate Azure Key Vault with Kubernetes
description: In this tutorial, you access and retrieve secrets from your Azure key vault by using the Secrets Store Container Storage Interface (CSI) driver to mount into Kubernetes pods.
author: taytran0
ms.author: t-trtr
ms.service: key-vault
ms.topic: tutorial
ms.date: 06/04/2020
---

# Tutorial: Configure and run the Azure Key Vault provider for the Secrets Store CSI driver on Kubernetes

In this tutorial, you access and retrieve secrets from your Azure key vault by using the Secrets Store Container Storage Interface (CSI) driver to mount the secrets into Kubernetes pods.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a service principal or use managed identities.
> * Deploy an Azure Kubernetes Service (AKS) cluster by using the Azure CLI.
> * Install Helm and the Secrets Store CSI driver.
> * Create an Azure key vault and set your secrets.
> * Create your own SecretProviderClass object.
> * Assign your service principal or use managed identities.
> * Deploy your pod with mounted secrets from your key vault.

## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* Before you start this tutorial, install the [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli-windows?view=azure-cli-latest).

## Create a service principal or use managed identities

If you plan to use managed identities, you can move on to the next section.

Create a service principal to control which resources can be accessed from your Azure key vault. This service principal's access is restricted by the roles assigned to it. This feature gives you control over how the service principal can manage your secrets. In the following example, the name of the service principal is *contosoServicePrincipal*.

```azurecli
az ad sp create-for-rbac --name contosoServicePrincipal --skip-assignment
```
This operation returns a series of key/value pairs:

![Screenshot showing the appId and password for contosoServicePrincipal](../media/kubernetes-key-vault-1.png)

Copy the **appId** and **password** credentials for later use.

## Deploy an Azure Kubernetes Service (AKS) cluster by using the Azure CLI

You don't need to use Azure Cloud Shell. Your command prompt (terminal) with the Azure CLI installed will suffice. 

Complete the "Create a resource group," "Create AKS cluster," and "Connect to the cluster" sections in [Deploy an Azure Kubernetes Service cluster by using the Azure CLI](https://docs.microsoft.com/azure/aks/kubernetes-walkthrough). 

> [!NOTE] 
> If you plan to use a pod identity instead of a service principal, be sure to enable it when you create the Kubernetes cluster, as shown in the following command:
>
> ```azurecli
> az aks create -n contosoAKSCluster -g contosoResourceGroup --kubernetes-version 1.16.9 --node-count 1 --enable-managed-identity
> ```

1. [Set your PATH environment variable](https://www.java.com/en/download/help/path.xml) to the *kubectl.exe* file that you downloaded.
1. Check your Kubernetes version by using the following command, which outputs the client and server version. The client version is the *kubectl.exe* file that you installed, and the server version is the Azure Kubernetes Services (AKS) that your cluster is running on.
    ```azurecli
    kubectl version
    ```
1. Ensure that your Kubernetes version is 1.16.0 or later. The following command upgrades both the Kubernetes cluster and the node pool. The command might take a couple of minutes to execute. In this example, the resource group is *contosoResourceGroup*, and the Kubernetes cluster is *contosoAKSCluster*.
    ```azurecli
    az aks upgrade --kubernetes-version 1.16.9 --name contosoAKSCluster --resource-group contosoResourceGroup
    ```
1. To display the metadata of the AKS cluster that you've created, use the following command. Copy the **principalId**, **clientId**, **subscriptionId**, and **nodeResourceGroup** for later use.

    ```azurecli
    az aks show --name contosoAKSCluster --resource-group contosoResourceGroup
    ```

    The output shows both parameters highlighted:
    
    ![Screenshot of the Azure CLI with principalId and clientId values highlighted](../media/kubernetes-key-vault-2.png)
    ![Screenshot of the Azure CLI with subscriptionId and nodeResourceGroup values highlighted](../media/kubernetes-key-vault-3.png)
    
## Install Helm and the Secrets Store CSI driver

To install the Secrets Store CSI driver, you first need to install [Helm](https://helm.sh/docs/intro/install/).

With the [Secrets Store CSI](https://github.com/Azure/secrets-store-csi-driver-provider-azure/blob/master/charts/csi-secrets-store-provider-azure/README.md) driver interface, you can get the secrets that are stored in your Azure key vault instance and then use the driver interface to mount the secret contents into Kubernetes pods.

1. Check to ensure that the Helm version is v3 or later:
    ```azurecli
    helm version
    ```
1. Install the Secrets Store CSI driver and the Azure Key Vault provider for the driver:
    ```azurecli
    helm repo add csi-secrets-store-provider-azure https://raw.githubusercontent.com/Azure/secrets-store-csi-driver-provider-azure/master/charts

    helm install csi-secrets-store-provider-azure/csi-secrets-store-provider-azure --generate-name
    ```

## Create an Azure key vault and set your secrets

To create your own key vault and set your secrets, follow the instructions in [Set and retrieve a secret from Azure Key Vault by using the Azure CLI](https://docs.microsoft.com/azure/key-vault/secrets/quick-create-cli).

> [!NOTE] 
> You don't need to use Azure Cloud Shell or create a new resource group. You can use the resource group that you created earlier for the Kubernetes cluster.

## Create your own SecretProviderClass object

To create your own custom SecretProviderClass object with provider-specific parameters for the Secrets Store CSI driver, [use this template](https://github.com/Azure/secrets-store-csi-driver-provider-azure/blob/master/examples/v1alpha1_secretproviderclass.yaml). This object will provide identity access to your key vault.

In the sample SecretProviderClass YAML file, fill in the missing parameters. The following parameters are required:

* **userAssignedIdentityID**: The client ID of the service principal
* **keyvaultName**: The name of your key vault
* **objects**: The container for all of the secret content you want to mount
    * **objectName**: The name of the secret content
    * **objectType**: The object type (secret, key, certificate)
* **resourceGroup**: The name of the resource group
* **subscriptionId**: The subscription ID of your key vault
* **tenantID**: The tenant ID, or directory ID, of your key vault

The updated template is shown in the following code. Download it as a YAML file, and fill in the required fields. In this example, the key vault is **contosoKeyVault5**. It has two secrets, **secret1** and **secret2**.

> [!NOTE] 
> If you're using managed identities, set the **usePodIdentity** value as *true*, and set the **userAssignedIdentityID** value as a pair of quotation marks (**""**). 

```yaml
apiVersion: secrets-store.csi.x-k8s.io/v1alpha1
kind: SecretProviderClass
metadata:
  name: azure-kvname
spec:
  provider: azure
  parameters:
    usePodIdentity: "false"         		  # [REQUIRED] Set to "true" if using managed identities
    useVMManagedIdentity: "false"             # [OPTIONAL] if not provided, will default to "false"
    userAssignedIdentityID: "servicePrincipalClientID"       # [REQUIRED] If you're using a service principal, use the client id to specify which user-assigned managed identity to use. If you're using a user-assigned identity as the VM's managed identity, specify the identity's client id. If the value is empty, it defaults to use the system-assigned identity on the VM
                                                             #     az ad sp show --id http://contosoServicePrincipal --query appId -o tsv
                                                             #     the preceding command will return the client ID of your service principal
    keyvaultName: "contosoKeyVault5"          # [REQUIRED] the name of the key vault
                                              #     az keyvault show --name contosoKeyVault5
                                              #     the preceding command will display the key vault metadata, which includes the subscription ID, resource group name, key vault 
    cloudName: ""          			          # [OPTIONAL for Azure] if not provided, Azure environment will default to AzurePublicCloud
    objects:  |
      array:
        - |
          objectName: secret1                 # [REQUIRED] object name
                                              #     az keyvault secret list --vault-name “contosoKeyVault5”
                                              #     the above command will display a list of secret names from your key vault
          objectType: secret                  # [REQUIRED] object types: secret, key, or cert
          objectVersion: ""                   # [OPTIONAL] object versions, default to latest if empty
        - |
          objectName: secret2
          objectType: secret
          objectVersion: ""
    resourceGroup: "contosoResourceGroup"     # [REQUIRED] the resource group name of the key vault
    subscriptionId: "subscriptionID"          # [REQUIRED] the subscription ID of the key vault
    tenantId: "tenantID"                      # [REQUIRED] the tenant ID of the key vault
```
The following image shows the console output for **az keyvault show --name contosoKeyVault5** with the relevant highlighted metadata:

![Screenshot showing the console output for "az keyvault show --name contosoKeyVault5"](../media/kubernetes-key-vault-4.png)

## Assign your service principal or use managed identities

### Assign a service principal

If you're using a service principal, grant permissions for it to access your key vault and retrieve secrets. Assign the *Reader* role, and grant the service principal permissions to *get* secrets from your key vault by doing the following:

1. Assign your service principal to your existing key vault. The **$AZURE_CLIENT_ID** parameter is the **appId** that you copied after you created your service principal.
    ```azurecli
    az role assignment create --role Reader --assignee $AZURE_CLIENT_ID --scope /subscriptions/$SUBID/resourcegroups/$KEYVAULT_RESOURCE_GROUP/providers/Microsoft.KeyVault/vaults/$KEYVAULT_NAME
    ```

    The output of the command is shown in the following image: 

    ![Screenshot showing the principalId value](../media/kubernetes-key-vault-5.png)

1. Grant the service principal permissions to get secrets:
    ```azurecli
    az keyvault set-policy -n $KEYVAULT_NAME --secret-permissions get --spn $AZURE_CLIENT_ID
    ```

1. You've now configured your service principal with permissions to read secrets from your key vault. The **$AZURE_CLIENT_SECRET** is the password of your service principal. Add your service principal credentials as a Kubernetes secret that's accessible by the Secrets Store CSI driver:
    ```azurecli
    kubectl create secret generic secrets-store-creds --from-literal clientid=$AZURE_CLIENT_ID --from-literal clientsecret=$AZURE_CLIENT_SECRET
    ```

> [!NOTE] 
> If you're deploying the Kubernetes pod and you receive an error about an invalid Client Secret ID, you might have an older Client Secret ID that was expired or reset. To resolve this issue, delete your *secrets-store-creds* secret and create a new one with the current Client Secret ID. To delete your *secrets-store-creds*, run the following command:
>
> ```azurecli
> kubectl delete secrets secrets-store-creds
> ```

If you forgot your service principal's Client Secret ID, you can reset it by using the following command:

```azurecli
az ad sp credential reset --name contosoServicePrincipal --credential-description "APClientSecret" --query password -o tsv
```

### Use managed identities

If you're using managed identities, assign specific roles to the AKS cluster you've created. 

1. To create, list, or read a user-assigned managed identity, your AKS cluster needs to be assigned the [Managed Identity Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#managed-identity-contributor) role. Make sure that the **$clientId** is the Kubernetes cluster's clientId.

    ```azurecli
    az role assignment create --role "Managed Identity Contributor" --assignee $clientId --scope /subscriptions/$SUBID/resourcegroups/$NODE_RESOURCE_GROUP
    
    az role assignment create --role "Virtual Machine Contributor" --assignee $clientId --scope /subscriptions/$SUBID/resourcegroups/$NODE_RESOURCE_GROUP
    ```

1. Install the Azure Active Directory (Azure AD) identity into AKS.
    ```azurecli
    helm repo add aad-pod-identity https://raw.githubusercontent.com/Azure/aad-pod-identity/master/charts

    helm install pod-identity aad-pod-identity/aad-pod-identity
    ```

1. Create an Azure AD identity. In the output, copy the **clientId** and **principalId** for later use.
    ```azurecli
    az identity create -g $resourceGroupName -n $identityName
    ```

1. Assign the *Reader* role to the Azure AD identity that you created in the preceding step for your key vault, and then grant the identity permissions to get secrets from your key vault. Use the **clientId** and **principalId** from the Azure AD identity.
    ```azurecli
    az role assignment create --role "Reader" --assignee $principalId --scope /subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/contosoResourceGroup/providers/Microsoft.KeyVault/vaults/contosoKeyVault5

    az keyvault set-policy -n contosoKeyVault5 --secret-permissions get --spn $clientId
    ```

## Deploy your pod with mounted secrets from your key vault

To configure your SecretProviderClass object, run the following command:
```azurecli
kubectl apply -f secretProviderClass.yaml
```

### Use a service principal

If you're using a service principal, use the following command to deploy your Kubernetes pods with the SecretProviderClass and the secrets-store-creds that you configured earlier. Here are the deployment templates:
* For [Linux](https://github.com/Azure/secrets-store-csi-driver-provider-azure/blob/master/examples/nginx-pod-secrets-store-inline-volume-secretproviderclass.yaml)
* For [Windows](https://github.com/Azure/secrets-store-csi-driver-provider-azure/blob/master/examples/windows-pod-secrets-store-inline-volume-secret-providerclass.yaml)

```azurecli
kubectl apply -f updateDeployment.yaml
```

### Use managed identities

If you're using managed identities, create an *AzureIdentity* in your cluster that references the identity that you created earlier. Then, create an *AzureIdentityBinding* that references the AzureIdentity you created. Fill out the parameters in the following template, and then save it as *podIdentityAndBinding.yaml*.  

```yml
apiVersion: aadpodidentity.k8s.io/v1
kind: AzureIdentity
metadata:
    name: "azureIdentityName"               # The name of your Azure identity
spec:
    type: 0                                 # Set type: 0 for managed service identity
    resourceID: /subscriptions/<SUBID>/resourcegroups/<RESOURCEGROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<AZUREIDENTITYNAME>
    clientID: "managedIdentityClientId"     # The clientId of the Azure AD identity that you created earlier
---
apiVersion: aadpodidentity.k8s.io/v1
kind: AzureIdentityBinding
metadata:
    name: azure-pod-identity-binding
spec:
    azureIdentity: "azureIdentityName"      # The name of your Azure identity
    selector: azure-pod-identity-binding-selector
```
    
Run the following command to execute the binding:

```azurecli
kubectl apply -f podIdentityAndBinding.yaml
```

Next, you deploy the pod. The following code is the deployment YAML file, which uses the pod identity binding from the preceding step. Save this file as *podBindingDeployment.yaml*.

```yml
kind: Pod
apiVersion: v1
metadata:
    name: nginx-secrets-store-inline
    labels:
    aadpodidbinding: azure-pod-identity-binding-selector
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
            secretProviderClass: azure-kvname
```

Run the following command to deploy your pod:

```azurecli
kubectl apply -f podBindingDeployment.yaml
```

### Check the pod status and secret content 

To display the pods that you've deployed, run the following command:
```azurecli
kubectl get pods
```

To check the status of your pod, run the following command:
```azurecli
kubectl describe pod/nginx-secrets-store-inline
```

![Screenshot of the Azure CLI output displaying the "Running" state of the pod and showing all events as "Normal" ](../media/kubernetes-key-vault-6.png)

In the output window, the deployed pod should be in the *Running* state. In the **Events** section at the bottom, all event types are displayed as *Normal*.

After you've verified that the pod is running, you can verify that the pod contains the secrets from your key vault.

To display all the secrets that are contained in the pod, run the following command:
```azurecli
kubectl exec -it nginx-secrets-store-inline -- ls /mnt/secrets-store/
```

To display the contents of a specific secret, run the following command:
```azurecli
kubectl exec -it nginx-secrets-store-inline -- cat /mnt/secrets-store/secret1
```

Verify that the contents of the secret are displayed.

## Next steps

To help ensure that your key vault is recoverable, see:
> [!div class="nextstepaction"]
> [Turn on soft delete](https://docs.microsoft.com/azure/key-vault/general/soft-delete-cli)
