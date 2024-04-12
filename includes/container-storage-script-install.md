---
 title: include file
 description: include file
 author: khdownie
 ms.service: azure-container-storage
 ms.topic: include
 ms.date: 09/13/2023
 ms.author: kendownie
 ms.custom: include file
---

Follow these instructions to install Azure Container Storage on your AKS cluster using an installation script.

1. Run the `az login` command to sign in to Azure.

1. Download and save [this shell script](https://github.com/Azure-Samples/azure-container-storage-samples/blob/main/acstor-install.sh).

1. Navigate to the directory where the file is saved using the `cd` command. For example, `cd C:\Users\Username\Downloads`.
   
1. Run the following command to change the file permissions:

   ```bash
   chmod +x acstor-install.sh 
   ```

1. Run the installation script and specify the parameters.
   
   | **Flag** | **Parameter**      | **Description** |
   |----------|----------------|-------------|
   | -s   | --subscription | The subscription identifier. Defaults to the current subscription.|
   | -g   | --resource-group | The resource group name.|
   | -c   | --cluster-name | The name of the cluster where Azure Container Storage is to be installed.|
   | -n   | --nodepool-name | The name of the nodepool. Defaults to the first nodepool in the cluster.|
   | -r   | --release-train | The release train for the installation. Defaults to stable.|
   
   For example:

   ```bash
   bash ./acstor-install.sh -g <resource-group-name> -s <subscription-id> -c <cluster-name> -n <nodepool-name> -r <release-train-name>
   ```

Installation takes 10-15 minutes to complete. You can check if the installation completed correctly by running the following command and ensuring that `provisioningState` says **Succeeded**:

```azurecli-interactive
az k8s-extension list --cluster-name <cluster-name> --resource-group <resource-group> --cluster-type managedClusters
```

Congratulations, you've successfully installed Azure Container Storage. You now have new storage classes that you can use for your Kubernetes workloads.