---
 title: include file
 description: include file
 author: dominicbetts
 ms.topic: include
 ms.date: 10/19/2023
 ms.author: dobett
 ms.custom: include file
---

Azure IoT Operations should work on any CNCF-conformant kubernetes cluster. At the current time, Microsoft only supports K3s on Ubuntu Linux.

To prepare a Kubernetes cluster on Ubuntu:

1. Complete the steps in the [K3s quick-start guide](https://docs.k3s.io/quick-start).

1. Create a K3s configuration yaml file in `.kube/config`:

    ```bash
    mkdir ~/.kube
    cp ~/.kube/config ~/.kube/config.back
    sudo KUBECONFIG=~/.kube/config:/etc/rancher/k3s/k3s.yaml kubectl config view --flatten > ~/.kube/merged
    mv ~/.kube/merged ~/.kube/config
    chmod  0600 ~/.kube/config
    export KUBECONFIG=~/.kube/config
    #switch to k3s context
    kubectl config use-context default
    ```

1. Install `nfs-common` on the host machine:

    ```bash
    sudo apt install nfs-common
    ```

1. Run the following command to increase the [user watch/instance limits](https://www.suse.com/support/kb/doc/?id=000020048).

    ```bash
    echo fs.inotify.max_user_instances=8192 | sudo tee -a /etc/sysctl.conf
    echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf

    sudo sysctl -p
    ```

1. For better performance, make sure the [file descriptor limit](https://www.cyberciti.biz/faq/linux-increase-the-maximum-number-of-open-files/) is high enough.

To connect your cluster to Azure Arc:

1. Sign in with Azure CLI. To avoid permission issues later, it's important that the sign in happens interactively by using a browser window:

    ```bash
    az login
    ```

1. Set environment variables for the rest of the setup. Replace values in `<>` with valid values or names of your choice. The `CLUSTER_NAME` and `RESOURCE_GROUP` are created in your Azure subscription based on the names you provide:

    ```bash
    # Id of the subscription where your resource group and Arc-enabled cluster will be created
    export SUBSCRIPTION_ID=<subscription-id>
    # Azure region where the created resource group will be located
    # Currently supported regions: "westus3" or "eastus2"
    export LOCATION="WestUS3"
    # Name of a new resource group to create which will hold the Arc-enabled cluster and Azure IoT Operations resources
    export RESOURCE_GROUP=<resource-group-name>
    # Name of the Arc-enabled cluster to create in your resource group
    export CLUSTER_NAME=<cluster-name>
    ```

1. Set the Azure subscription context for all commands:

    ```bash
    az account set -s $SUBSCRIPTION_ID
    ```

1. Register the required resource providers in your subscription:

    ```bash
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

    ```bash
    az connectedk8s connect -n $CLUSTER_NAME -l $LOCATION -g $RESOURCE_GROUP --subscription $SUBSCRIPTION_ID
    ```

1. Fetch the `objectId` or `id` of the Microsoft Entra ID application that the Azure Arc service uses. The command you use depends on your version of Azure CLI:

    ```bash
    # If you're using an Azure CLI version lower than 2.37.0, use the following command:
    az ad sp show --id bc313c14-388c-4e7d-a58e-70017303ee3b --query objectId -o tsv
    ```

    ```bash
    # If you're using Azure CLI version 2.37.0 or higher, use the following command:
    az ad sp show --id bc313c14-388c-4e7d-a58e-70017303ee3b --query id -o tsv
    ```

1. Use the [az connectedk8s enable-features](/cli/azure/connectedk8s#az-connectedk8s-enable-features) command to enable custom location support on your cluster. Use the `objectId` or `id` value from the previous command to enable custom locations on the cluster:

    ```bash
    az connectedk8s enable-features -n $CLUSTER_NAME -g $RESOURCE_GROUP --custom-locations-oid <objectId/id> --features cluster-connect custom-locations
    ```
