---
 title: include file
 description: include file
 author: kgremban
 ms.topic: include
 ms.date: 07/22/2024
 ms.author: kgremban
ms.custom: include file, ignite-2023, devx-track-azurecli
---


1. After signing in, Azure CLI displays all of your subscriptions and indicates your default subscription with an asterisk `*`. To continue with your default subscription, select `Enter`. Otherwise, type the number of the Azure subscription that you want to use.

1. Register the required resource providers in your subscription:

   >[!NOTE]
   >This step only needs to be run once per subscription. To register resource providers, you need permission to do the `/register/action` operation, which is included in subscription Contributor and Owner roles. For more information, see [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md).

   ```azurecli
   az provider register -n "Microsoft.ExtendedLocation"
   az provider register -n "Microsoft.Kubernetes"
   az provider register -n "Microsoft.KubernetesConfiguration"
   az provider register -n "Microsoft.IoTOperations"
   az provider register -n "Microsoft.DeviceRegistry"
   ```

1. Use the [az group create](/cli/azure/group#az-group-create) command to create a resource group in your Azure subscription to store all the resources:

   ```azurecli
   az group create --location $LOCATION --resource-group $RESOURCE_GROUP --subscription $SUBSCRIPTION_ID
   ```

1. Download and install a preview version of the `connectedk8s` extension for Azure CLI.

   ```azurecli
   curl -L -o connectedk8s-1.10.0-py2.py3-none-any.whl https://github.com/AzureArcForKubernetes/azure-cli-extensions/raw/refs/heads/connectedk8s/public/cli-extensions/connectedk8s-1.10.0-py2.py3-none-any.whl   
   az extension add --upgrade --source connectedk8s-1.10.0-py2.py3-none-any.whl
   ```

1. Export environment variables that the `az connectedk8s upgrade` command requires.

   ```bash
   export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
   export HELMREGISTRY=azurearcfork8sdev.azurecr.io/merge/private/azure-arc-k8sagents:0.1.15392-private
   ```

1. Use the [az connectedk8s connect](/cli/azure/connectedk8s#az-connectedk8s-connect) command to Arc-enable your Kubernetes cluster and manage it as part of your Azure resource group:

   ```azurecli
   az connectedk8s connect --name $CLUSTER_NAME -l $LOCATION --resource-group $RESOURCE_GROUP --subscription $SUBSCRIPTION_ID --disable-auto-upgrade --enable-oidc-issuer --enable-workload-identity
   ```

1. Get the cluster's issuer URL.

   ```azurecli
   az connectedk8s show --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME --query oidcIssuerProfile.issuerUrl --output tsv
   ```

   Save the output of this command to use in the next steps.

1. Create a k3s config file.

   ```bash
   nano /etc/rancher/k3s/config.yaml
   ```

1. Add the following content to the `config.yaml` file, replacing the `<SERVICE_ACCOUNT_ISSUER>` placeholder with your cluster's issuer URL.

   ```yml
   kube-apiserver-arg: 'service-account-issuer=<SERVICE_ACCOUNT_ISSUER>'
   ```

1. Save the file and exit the nano editor.

1. Get the `objectId` of the Microsoft Entra ID application that the Azure Arc service uses in your tenant and save it as an environment variable.

   ```azurecli
   export OBJECT_ID=$(az ad sp show --id bc313c14-388c-4e7d-a58e-70017303ee3b --query id -o tsv)
   ```

1. Use the [az connectedk8s enable-features](/cli/azure/connectedk8s#az-connectedk8s-enable-features) command to enable custom location support on your cluster. This command uses the `objectId` of the Microsoft Entra ID application that the Azure Arc service uses. Run this command on the machine where you deployed the Kubernetes cluster:

    ```azurecli
    az connectedk8s enable-features -n $CLUSTER_NAME -g $RESOURCE_GROUP --custom-locations-oid $OBJECT_ID --features cluster-connect custom-locations
    ```

1. Restart K3s.

   ```bash
   systemctl restart k3s
   ```
