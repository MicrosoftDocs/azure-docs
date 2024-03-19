---
title: include file
description: include file
author: dominicbetts
ms.topic: include
ms.date: 02/29/2024
ms.author: dobett
---

Use the following command to add a secret to your Azure Key Vault that contains the client secret you made a note of when you created the service principal. You created the Azure Key Vault in the [Deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster](../get-started/quickstart-deploy.md) quickstart:

```azurecli
az keyvault secret set --vault-name <your-key-vault-name> --name AIOFabricSecret --value <client-secret>
```

To add the secret reference to your Kubernetes cluster, edit the **aio-default-spc** `secretproviderclass` resource:

1. Enter the following command on the machine where your cluster is running to edit the **aio-default-spc** `secretproviderclass` resource. The YAML configuration for the resource opens in your default editor:

    ```console
    kubectl edit secretproviderclass aio-default-spc -n azure-iot-operations
    ```

1. Add a new `AIOFabricSecret` entry to the array of secrets for your new Azure Key Vault secret. Use the `spec` section in the following example for reference:

    ```yaml
    # Edit the object below. Lines beginning with a '#' will be ignored,
    # and an empty file will abort the edit. If an error occurs while saving this file will be
    # reopened with the relevant failures.
    #
    apiVersion: secrets-store.csi.x-k8s.io/v1
    kind: SecretProviderClass
    metadata:
      creationTimestamp: "2023-11-16T11:43:31Z"
      generation: 2
      name: aio-default-spc
      namespace: azure-iot-operations
      resourceVersion: "89083"
      uid: cda6add7-3931-47bd-b924-719cc862ca29
    spec:                                      
      parameters:                              
        keyvaultName: <this is the name of your key vault>         
        objects: |                             
          array:                               
            - |                                
              objectName: azure-iot-operations
              objectType: secret           
              objectVersion: ""            
            - |                            
              objectName: AIOFabricSecret  
              objectType: secret           
              objectVersion: ""            
        tenantId: <this is your tenant ID>
        usePodIdentity: "false"                       
      provider: azure
    ```

1. Save the changes and exit from the editor.

The CSI driver updates secrets by using a polling interval, therefore the new secret isn't available to the pod until the next polling interval. To update a component immediately, restart the pods for the component. For example, to restart the Data Processor component, run the following commands:

```console
kubectl delete pod aio-dp-reader-worker-0 -n azure-iot-operations
kubectl delete pod aio-dp-runner-worker-0 -n azure-iot-operations
```
