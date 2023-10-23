---
 title: include file
 description: include file
 author: dominicbetts
 ms.topic: include
 ms.date: 10/19/2023
 ms.author: dobett
 ms.custom: include file
---

Azure Kubernetes Service Edge Essentials is an on-premises Kubernetes implementation of Azure Kubernetes Service (AKS) that automates running containerized applications at scale. AKS Edge Essentials includes a Microsoft-supported Kubernetes platform that includes a lightweight Kubernetes distribution with a small footprint and simple installation experience, making it easy for you to deploy Kubernetes on PC-class or "light" edge hardware.

To prepare your machine for AKS Edge Essentials:

1. Download the [installer for the validated AKS Edge Essentials](https://aka.ms/aks-edge/msi-k3s-1.2.414.0) version to your local machine.

1. Complete the steps in [Prepare your machines for AKS Edge Essentials](/azure/aks/hybrid/aks-edge-howto-setup-machine). Be sure to use the installer you downloaded in the previous step and not the most recent version.

To set up an AKS Edge Essentials cluster on your machine:

1. Complete the steps in [Create a single machine deployment](/azure/aks/hybrid/aks-edge-howto-single-node-deployment).

    At the end of [Step 1: single machine configuration parameters](/azure/aks/hybrid/aks-edge-howto-single-node-deployment#step-1-single-machine-configuration-parameters), modify the following values in the _aksedge-config.json_ file as follows:

    ```json
    `Init.ServiceIPRangeSize` = 10
    `LinuxNode.DataSizeInGB` = 30
    `LinuxNode.MemoryInMB` = 8192
    ```

1. Install **local-path** storage in the cluster by running the following command:

    ```cmd
    kubectl apply -f https://raw.githubusercontent.com/Azure/AKS-Edge/main/samples/storage/local-path-provisioner/local-path-storage.yaml
    ```

To connect your cluster to Azure Arc:

1. Sign in with Azure CLI. To avoid permission issues later, it's important that the sign in happens interactively by using a browser window:

    ```powershell
    az login
    ```

1. Set environment variables for the rest of the setup. Replace values in `<>` with valid values or names of your choice. The `CLUSTER_NAME` and `RESOURCE_GROUP` are created based on the names you provide:

    ```powershell
    # Id of the subscription where your resource group and Arc-enabled cluster will be created
    $SUBSCRIPTION_ID = "<subscription-id>"
    # Azure region where the created resource group will be located
    # Currently supported regions: : "westus3" or "eastus2"
    $LOCATION = "WestUS3"
    # Name of a new resource group to create which will hold the Arc-enabled cluster and Azure IoT Operations resources
    $RESOURCE_GROUP = "<resource-group-name>"
    # Name of the Arc-enabled cluster to create in your resource group
    $CLUSTER_NAME = "<cluster-name>"
    ```

1. Set the Azure subscription context for all commands:

    ```powershell
    az account set -s $SUBSCRIPTION_ID
    ```

1. Register the required resource providers in your subscription:

    ```powershell
    az provider register -n "Microsoft.ExtendedLocation"
    az provider register -n "Microsoft.Kubernetes"
    az provider register -n "Microsoft.KubernetesConfiguration"
    az provider register -n "Microsoft.Symphony"
    az provider register -n "Microsoft.Bluefin"
    az provider register -n "Microsoft.DeviceRegistry"
    ```

1. Use the [az group create](/cli/azure/group#az-group-create) command to create a resource group in your Azure subscription to store all the resources:

    ```bash
    az group create --location $LOCATION --resource-group $RESOURCE_GROUP --subscription $SUBSCRIPTION_ID
    ```

1. Use the [az connectedk8s connect](/cli/azure/connectedk8s#az-connectedk8s-connect) command to Arc-enable your Kubernetes cluster and manage it in the resource group you created in the previous step:

    ```powershell
    az connectedk8s connect -n $CLUSTER_NAME -l $LOCATION -g $RESOURCE_GROUP --subscription $SUBSCRIPTION_ID
    ```

    > [!TIP]
    > If the `connectedk8s` commands fail, try using the cmdlets in [Connect your AKS Edge Essentials cluster to Arc](/azure/aks/hybrid/aks-edge-howto-connect-to-arc).

1. Fetch the `objectId` or `id` of the Microsoft Entra ID application that the Azure Arc service uses. The command you use depends on your version of Azure CLI:

    ```powershell
    # If you're using an Azure CLI version lower than 2.37.0, use the following command:
    az ad sp show --id bc313c14-388c-4e7d-a58e-70017303ee3b --query objectId -o tsv
    ```

    ```powershell
    # If you're using Azure CLI version 2.37.0 or higher, use the following command:
    az ad sp show --id bc313c14-388c-4e7d-a58e-70017303ee3b --query id -o tsv
    ```

1. Use the [az connectedk8s enable-features](/cli/azure/connectedk8s#az-connectedk8s-enable-features) command to enable custom location support on your cluster. Use the `objectId` or `id` value from the previous command to enable custom locations on the cluster:

   ```bash
   az connectedk8s enable-features -n $CLUSTER_NAME -g $RESOURCE_GROUP --custom-locations-oid <objectId/id> --features cluster-connect custom-locations
   ```

After you've deployed Azure IoT Operations Preview to your cluster, enable inbound connections to E4K distributed MQTT broker and configure port forwarding:

1. Enable a firewall rule for port 1883. If TLS is enabled, do the same for port 8883:

    ```powershell
    New-NetFirewallRule -DisplayName "Alice Springs MQTT Broker" -Direction Inbound -Protocol TCP -LocalPort 1883 -Action Allow
    ```

1. Run the following command and make a note of the IP address for the service called `azedge-dmqtt-frontend`:

    ```cmd
    kubectl get svc azedge-dmqtt-frontend -n alice-springs -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
    ```

1. Enable port forwarding for port 1883. If TLS is enabled, do the same for port 8883. Replace `<azedge-dmqtt-frontend IP address>` with the IP address you noted in the previous step:

    ```cmd
    netsh interface portproxy add v4tov4 listenport=1883 listenaddress=0.0.0.0 connectport=1883 connectaddress=<azedge-dmqtt-frontend IP address>
    ```
