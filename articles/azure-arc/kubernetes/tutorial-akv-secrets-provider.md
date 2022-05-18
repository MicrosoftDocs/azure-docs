---
title: Azure Key Vault Secrets Provider extension
description: Tutorial for setting up Azure Key Vault provider for Secrets Store CSI Driver interface as an extension on Azure Arc enabled Kubernetes cluster
services: azure-arc
ms.service: azure-arc
ms.date: 5/13/2022
ms.topic: article
author: mayurigupta13
ms.author: mayg
---

# Using Azure Key Vault Secrets Provider extension to fetch secrets into Arc clusters

The Azure Key Vault Provider for Secrets Store CSI Driver allows for the integration of Azure Key Vault as a secrets store with a Kubernetes cluster via a [CSI volume](https://kubernetes-csi.github.io/docs/).

## Prerequisites
1. Ensure you have met all the common prerequisites for cluster extensions listed [here](extensions.md#prerequisites).
2. Use az k8s-extension CLI version >= v0.4.0

### Support limitations for Azure Key Vault (AKV) secrets provider extension
- Following Kubernetes distributions are currently supported
    - Cluster API Azure
    - Azure Kubernetes Service on Azure Stack HCI (AKS-HCI)
    - Google Kubernetes Engine
    - OpenShift Kubernetes Distribution
    - Canonical Kubernetes Distribution
    - Elastic Kubernetes Service
    - Tanzu Kubernetes Grid


## Features

- Mounts secrets/keys/certs to pod using a CSI Inline volume
- Supports pod portability with the SecretProviderClass CRD
- Supports Linux and Windows containers
- Supports sync with Kubernetes Secrets
- Supports auto rotation of secrets


## Install AKV secrets provider extension on an Arc enabled Kubernetes cluster

The following steps assume that you already have a cluster with supported Kubernetes distribution connected to Azure Arc.

To deploy using Azure portal, go to the cluster's **Extensions** blade under **Settings**. Click on **+Add** button.

[![Extensions located under Settings for Arc enabled Kubernetes cluster](media/tutorial-akv-secrets-provider/extension-install-add-button.jpg)](media/tutorial-akv-secrets-provider/extension-install-add-button.jpg#lightbox)

From the list of available extensions, select the **Azure Key Vault Secrets Provider** to deploy the latest version of the extension. You can also choose to customize the installation through the portal by changing the defaults on **Configuration** tab.

[![AKV Secrets Provider available as an extension by clicking on Add button on Extensions blade](media/tutorial-akv-secrets-provider/extension-install-new-resource.jpg)](media/tutorial-akv-secrets-provider/extension-install-new-resource.jpg#lightbox)

Alternatively, you can use the CLI experience captured below.

Set the environment variables:
```azurecli-interactive
export CLUSTER_NAME=<arc-cluster-name>
export RESOURCE_GROUP=<resource-group-name>
```

```azurecli-interactive
az k8s-extension create --cluster-name $CLUSTER_NAME --resource-group $RESOURCE_GROUP --cluster-type connectedClusters --extension-type Microsoft.AzureKeyVaultSecretsProvider --name akvsecretsprovider
```

The above will install the Secrets Store CSI Driver and the Azure Key Vault Provider on your cluster nodes. You should see output similar to the output shown below. It may take 3-5 minutes for the actual AKV secrets provider helm chart to get deployed to the cluster.

Note that only one instance of AKV secrets provider extension can be deployed on an Arc connected Kubernetes cluster.

```json
{
  "aksAssignedIdentity": null,
  "autoUpgradeMinorVersion": true,
  "configurationProtectedSettings": {},
  "configurationSettings": {},
  "customLocationSettings": null,
  "errorInfo": null,
  "extensionType": "microsoft.azurekeyvaultsecretsprovider",
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Kubernetes/connectedClusters/$CLUSTER_NAME/providers/Microsoft.KubernetesConfiguration/extensions/akvsecretsprovider",
  "identity": {
    "principalId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "tenantId": null,
    "type": "SystemAssigned"
  },
  "location": null,
  "name": "akvsecretsprovider",
  "packageUri": null,
  "provisioningState": "Succeeded",
  "releaseTrain": "Stable",
  "resourceGroup": "$RESOURCE_GROUP",
  "scope": {
    "cluster": {
      "releaseNamespace": "kube-system"
    },
    "namespace": null
  },
  "statuses": [],
  "systemData": {
    "createdAt": "2022-05-12T18:35:56.552889+00:00",
    "createdBy": null,
    "createdByType": null,
    "lastModifiedAt": "2022-05-12T18:35:56.552889+00:00",
    "lastModifiedBy": null,
    "lastModifiedByType": null
  },
  "type": "Microsoft.KubernetesConfiguration/extensions",
  "version": "1.1.3"
}
```

### Install AKV secrets provider extension using ARM template
After connecting your cluster to Azure Arc, create a json file with the following format, making sure to update the \<cluster-name\> value:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "ConnectedClusterName": {
            "defaultValue": "<cluster-name>",
            "type": "String",
            "metadata": {
                "description": "The Connected Cluster name."
            }
        },
        "ExtensionInstanceName": {
            "defaultValue": "akvsecretsprovider",
            "type": "String",
            "metadata": {
                "description": "The extension instance name."
            }
        },
        "ExtensionVersion": {
            "defaultValue": "",
            "type": "String",
            "metadata": {
                "description": "The version of the extension type."
            }
        },
        "ExtensionType": {
            "defaultValue": "Microsoft.AzureKeyVaultSecretsProvider",
            "type": "String",
            "metadata": {
                "description": "The extension type."
            }
        },
        "ReleaseTrain": {
            "defaultValue": "stable",
            "type": "String",
            "metadata": {
                "description": "The release train."
            }
        }
    },
    "functions": [],
    "resources": [
        {
            "type": "Microsoft.KubernetesConfiguration/extensions",
            "apiVersion": "2021-09-01",
            "name": "[parameters('ExtensionInstanceName')]",
            "properties": {
                "extensionType": "[parameters('ExtensionType')]",
                "releaseTrain": "[parameters('ReleaseTrain')]",
                "version": "[parameters('ExtensionVersion')]"
            },
            "scope": "[concat('Microsoft.Kubernetes/connectedClusters/', parameters('ConnectedClusterName'))]"
        }
    ]
}
```
Now set the environment variables:
```azurecli-interactive
export TEMPLATE_FILE_NAME=<template-file-path>
export DEPLOYMENT_NAME=<desired-deployment-name>
```

Finally, run this command to install the AKV secrets provider extension through az CLI:

```azurecli-interactive
az deployment group create --name $DEPLOYMENT_NAME --resource-group $RESOURCE_GROUP --template-file $TEMPLATE_FILE_NAME
```
Now, you should be able to view the AKV provider resources and use the extension in your cluster.

## Validate the extension installation

Run the following command.

```azurecli-interactive
az k8s-extension show --cluster-type connectedClusters --cluster-name $CLUSTER_NAME --resource-group $RESOURCE_GROUP --name akvsecretsprovider
```

You should see a JSON output similar to the output below:
```json
{
  "aksAssignedIdentity": null,
  "autoUpgradeMinorVersion": true,
  "configurationProtectedSettings": {},
  "configurationSettings": {},
  "customLocationSettings": null,
  "errorInfo": null,
  "extensionType": "microsoft.azurekeyvaultsecretsprovider",
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Kubernetes/connectedClusters/$CLUSTER_NAME/providers/Microsoft.KubernetesConfiguration/extensions/akvsecretsprovider",
  "identity": {
    "principalId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "tenantId": null,
    "type": "SystemAssigned"
  },
  "location": null,
  "name": "akvsecretsprovider",
  "packageUri": null,
  "provisioningState": "Succeeded",
  "releaseTrain": "Stable",
  "resourceGroup": "$RESOURCE_GROUP",
  "scope": {
    "cluster": {
      "releaseNamespace": "kube-system"
    },
    "namespace": null
  },
  "statuses": [],
  "systemData": {
    "createdAt": "2022-05-12T18:35:56.552889+00:00",
    "createdBy": null,
    "createdByType": null,
    "lastModifiedAt": "2022-05-12T18:35:56.552889+00:00",
    "lastModifiedBy": null,
    "lastModifiedByType": null
  },
  "type": "Microsoft.KubernetesConfiguration/extensions",
  "version": "1.1.3"
}
```

## Create or use an existing Azure Key Vault

Set the environment variables:
```azurecli-interactive
export AKV_RESOURCE_GROUP=<resource-group-name>
export AZUREKEYVAULT_NAME=<AKV-name>
export AZUREKEYVAULT_LOCATION=<AKV-location>
```

You will need an Azure Key Vault resource containing the secret content. Keep in mind that the Key Vault's name must be globally unique.

```azurecli
az keyvault create -n $AZUREKEYVAULT_NAME -g $AKV_RESOURCE_GROUP -l $AZUREKEYVAULT_LOCATION
```

Azure Key Vault can store keys, secrets, and certificates. In this example, we'll set a plain text secret called `DemoSecret`:

```azurecli
az keyvault secret set --vault-name $AZUREKEYVAULT_NAME -n DemoSecret --value MyExampleSecret
```

Take note of the following properties for use in the next section:

- Name of secret object in Key Vault
- Object type (secret, key, or certificate)
- Name of your Azure Key Vault resource
- Azure Tenant ID the Subscription belongs to

## Provide identity to access Azure Key Vault

The Secrets Store CSI Driver on Arc connected clusters currently allows for the following methods to access an Azure Key Vault instance:
- Service Principal

Follow the steps below to provide identity to access Azure Key Vault

1. Follow the steps [here](../../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-azure-ad-and-create-a-service-principal) to create a service principal in Azure. Take note of the Client ID and Client Secret generated in this step.
2. Provide Azure Key Vault GET permission to the created service principal by following the steps [here](../../key-vault/general/assign-access-policy.md).
3. Use the client ID and Client Secret from step 1 to create a Kubernetes secret on the Arc connected cluster:
```bash
kubectl create secret generic secrets-store-creds --from-literal clientid="<client-id>" --from-literal clientsecret="<client-secret>"
```
4. Label the created secret:
```bash
kubectl label secret secrets-store-creds secrets-store.csi.k8s.io/used=true
```
5. Create a SecretProviderClass with the following YAML, filling in your values for key vault name, tenant ID, and objects to retrieve from your AKV instance:
```yml
# This is a SecretProviderClass example using service principal to access Keyvault
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: akvprovider-demo
spec:
  provider: azure
  parameters:
    usePodIdentity: "false"
    keyvaultName: <key-vault-name>
    objects:  |
      array:
        - |
          objectName: DemoSecret
          objectType: secret             # object types: secret, key or cert
          objectVersion: ""              # [OPTIONAL] object versions, default to latest if empty
    tenantId: <tenant-Id>                # The tenant ID of the Azure Key Vault instance
```
6. Apply the SecretProviderClass to your cluster:

```bash
kubectl apply -f secretproviderclass.yaml
```
7. Create a pod with the following YAML, filling in the name of your identity:

```yml
# This is a sample pod definition for using SecretProviderClass and service principal to access Keyvault
kind: Pod
apiVersion: v1
metadata:
  name: busybox-secrets-store-inline
spec:
  containers:
    - name: busybox
      image: k8s.gcr.io/e2e-test-images/busybox:1.29
      command:
        - "/bin/sleep"
        - "10000"
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
          secretProviderClass: "akvprovider-demo"
        nodePublishSecretRef:                       
          name: secrets-store-creds
```
8. Apply the pod to your cluster:

```bash
kubectl apply -f pod.yaml
```

## Validate the secrets
After the pod starts, the mounted content at the volume path specified in your deployment YAML is available.
```Bash
## show secrets held in secrets-store
kubectl exec busybox-secrets-store-inline -- ls /mnt/secrets-store/

## print a test secret 'DemoSecret' held in secrets-store
kubectl exec busybox-secrets-store-inline -- cat /mnt/secrets-store/DemoSecret
```

## Additional configuration options
Following configuration settings are available for Azure Key Vault secrets provider extension:

| Configuration Setting | Default | Description |
| --------- | ----------- | ----------- |
| enableSecretRotation | false | Boolean type; Periodically update the pod mount and Kubernetes Secret with the latest content from external secrets store |
| rotationPollInterval | 2m | Secret rotation poll interval duration if `enableSecretRotation` is `true`. This can be tuned based on how frequently the mounted contents for all pods and Kubernetes secrets need to be resynced to the latest |
| syncSecret.enabled | false | Boolean input; In some cases, you may want to create a Kubernetes Secret to mirror the mounted content. This configuration setting allows SecretProviderClass to allow secretObjects field to define the desired state of the synced Kubernetes secret objects |

These settings can be changed either at the time of extension installation using `az k8s-extension create` command or post installation using `az k8s-extension update` command.

Use following command to add configuration settings while creating extension instance:
```azurecli-interactive
az k8s-extension create --cluster-name $CLUSTER_NAME --resource-group $RESOURCE_GROUP --cluster-type connectedClusters --extension-type Microsoft.AzureKeyVaultSecretsProvider --name akvsecretsprovider --configuration-settings secrets-store-csi-driver.enableSecretRotation=true secrets-store-csi-driver.rotationPollInterval=3m secrets-store-csi-driver.syncSecret.enabled=true
```

Use following command to update configuration settings of existing extension instance:
```azurecli-interactive
az k8s-extension update --cluster-name $CLUSTER_NAME --resource-group $RESOURCE_GROUP --cluster-type connectedClusters --name akvsecretsprovider --configuration-settings secrets-store-csi-driver.enableSecretRotation=true secrets-store-csi-driver.rotationPollInterval=3m secrets-store-csi-driver.syncSecret.enabled=true
```

## Uninstall Azure Key Vault secrets provider extension
Use the below command:
```azurecli-interactive
az k8s-extension delete --cluster-type connectedClusters --cluster-name $CLUSTER_NAME --resource-group $RESOURCE_GROUP --name akvsecretsprovider
```
Note that the uninstallation does not delete the CRDs that are created at the time of extension installation.

Verify that the extension instance has been deleted.
```azurecli-interactive
az k8s-extension list --cluster-type connectedClusters --cluster-name $CLUSTER_NAME --resource-group $RESOURCE_GROUP
```
This output should not include AKV secrets provider. If you don't have any other extensions installed on your cluster, it will just be an empty array.

## Reconciliation and Troubleshooting
Azure Key Vault secrets provider extension is self-healing. All extension components that are deployed on the cluster at the time of extension installation are reconciled to their original state in case somebody tries to intentionally or unintentionally change or delete them. The only exception to that is CRDs. In case the CRDs are deleted, they are not reconciled. You can bring them back by using the 'az k8s-exstension create' command again and providing the existing extension instance name.

Some common issues and troubleshooting steps for Azure Key Vault secrets provider are captured in the open source documentation [here](https://azure.github.io/secrets-store-csi-driver-provider-azure/docs/troubleshooting/) for your reference.

Additional troubleshooting steps that are specific to the Secrets Store CSI Driver Interface can be referenced [here](https://secrets-store-csi-driver.sigs.k8s.io/troubleshooting.html).

## Next steps

> **Just want to try things out?**  
> Get started quickly with an [Azure Arc Jumpstart scenario](https://aka.ms/arc-jumpstart-akv-secrets-provider) using Cluster API.
