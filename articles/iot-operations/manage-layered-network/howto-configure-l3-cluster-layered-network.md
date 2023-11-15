---
title: Configure level 3 cluster in an Azure IoT Layered Network Management isolated network
# titleSuffix: Azure IoT Layered Network Management
description: Prepare a level 3 cluster and connect it to the IoT Layered Network Management service
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 11/07/2023

#CustomerIntent: As an operator, I want to configure Layered Network Management so that I have secure isolate devices.
---

# Configure level 3 cluster in an isolated network

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

You can configure a special isolated network environment for deploying Azure IoT Operations. For example, level 3 or lower in the ISA-95 network architecture. In this article, you set up a Kubernetes cluster to meet all the prerequisites of Azure IoT Operations and Arc-enable the cluster through the Azure IoT Layered Network Management service in the upper level. Before you start this process, the Layered Network Management service has to be ready for accepting the connection request from this level.

You'll complete the following tasks:
- Set up the host system and install all the required software in an internet facing environment.
- Install the Kubernetes of your choice.
- Move the host to the isolated network environment.
- Use a customized DNS setting to direct the network traffic to the Layered Network Management service in parent level.
- Arc-enable the cluster.

## Prerequisites

Follow the guidance for **hardware requirements** and **prerequisites** sections in [Prepare your Azure Arc-enabled Kubernetes cluster](../deploy-iot-ops/howto-prepare-cluster.md).

## Configure a Kubernetes cluster

You can choose to use [AKS Edge Essentials](/azure/aks/hybrid/aks-edge-overview) hosted on Windows 11 or a K3S cluster on Ubuntu for the Kubernetes cluster.

# [AKS Edge Essentials](#tab/aksee)

## Prepare Windows 11

You should complete this step in an *internet facing environment* outside of the isolated network. Otherwise, you need to prepare the offline installation package for the following required software.

If you're using VM to create your Windows 11 machines, use the [VM image](https://developer.microsoft.com/windows/downloads/virtual-machines/) that includes Visual Studio preinstalled. Having Visual Studio ensures the required certificates needed by Arc onboarding are included.

1. Install [Windows 11](https://www.microsoft.com/software-download/windows11) on your device.
1. Install [Helm](https://helm.sh/docs/intro/install/) 3.8.0 or later.
1. Install [Kubectl](https://kubernetes.io/docs/tasks/tools/)
1. Download the [installer for the validated AKS Edge Essentials](https://aka.ms/aks-edge/msi-k3s-1.2.414.0) version.
1. Install AKS Edge Essentials. Follow the steps in [Prepare your machines for AKS Edge Essentials](/azure/aks/hybrid/aks-edge-howto-setup-machine). Be sure to use the installer you downloaded in the previous step and not the most recent version.
1. Install Azure CLI. Follow the steps in [Install Azure CLI on Windows](/cli/azure/install-azure-cli-windows).
1. Install *connectedk8s* and other extensions.

    ```bash
    az extension add --name connectedk8s
    az extension add --name k8s-extension
    az extension add --name customlocation
    ```
1. [Install Azure CLI extension](/cli/azure/iot/ops) using `az extension add --name azure-iot-ops`.
1. **Certificates:** For Level 3 and lower, you ARC onboard the cluster that isn't connected to the internet. Therefore, you need to install certificates steps in [Prerequisites for AKS Edge Essentials offline installation](/azure/aks/hybrid/aks-edge-howto-offline-install).
1. Install the following optional software if you plan to try IoT Operations quickstarts or MQTT related scenarios.
    - [MQTTUI](https://github.com/EdJoPaTo/mqttui/releases) or other MQTT client
    - [Mosquitto](https://mosquitto.org/)

## Create the AKS Edge Essentials cluster

To create the AKS Edge Essentials cluster that's compatible with Azure IoT Operations:

1. Complete the steps in [Create a single machine deployment](/azure/aks/hybrid/aks-edge-howto-single-node-deployment).

    At the end of [Step 1: single machine configuration parameters](/azure/aks/hybrid/aks-edge-howto-single-node-deployment#step-1-single-machine-configuration-parameters), modify the following values in the *aksedge-config.json* file as follows:

    - `Init.ServiceIPRangeSize` = 10
    - `LinuxNode.DataSizeInGB` = 30
    - `LinuxNode.MemoryInMB` = 8192

    In the **Network** section, set the `SkipDnsCheck` property to **true**.Add and set the `DnsServers` to the address of the DNS server in the subnet.

    ```json
    "DnsServers": ["<IP ADDRESS OF THE DNS SERVER IN SUBNET>"],
    "SkipDnsCheck": true,
    ```

1. Install **local-path** storage in the cluster by running the following command:

    ```cmd
    kubectl apply -f https://raw.githubusercontent.com/Azure/AKS-Edge/main/samples/storage/local-path-provisioner/local-path-storage.yaml
    ```

## Move the device to level 3 isolated network

In your isolated network layer, the DNS server was configured in a prerequisite step using [Create sample network environment](./howto-configure-layered-network.md). Complete the step if you haven't done so.

After the device is moved to level 3, configure the DNS setting using the following steps:

1. In **Windows Control Panel** > **Network and Internet** > **Network and Sharing Center**, select the current network connection.
1. In the network properties dialog, select **Properties** > **Internet Protocol Version 4 (TCP/IPv4)** > **Properties**.
1. Select **Use the following DNS server addresses**.
1. Enter the level 3 DNS server local IP address.

    :::image type="content" source="./media/howto-configure-l3-cluster-layered-network/windows-dns-setting.png" alt-text="Screenshot that shows Windows DNS setting with the level 3 DNS server local IP address.":::

# [K3S cluster](#tab/k3s)

You should complete this step in an *internet facing environment outside of the isolated network*. Otherwise, you need to prepare the offline installation package for the following software in the next section.

## Prepare an Ubuntu machine

1. Ubuntu 22.04 LTS is the recommended version for the host machine.

1. Install [Helm](https://helm.sh/docs/intro/install/) 3.8.0 or later.

1. Install [Kubectl](https://kubernetes.io/docs/tasks/tools/).

1. Install `nfs-common` on the host machine.

    ```bash
    sudo apt install nfs-common
    ```
1. Run the following command to increase the [user watch/instance limits](https://www.suse.com/support/kb/doc/?id=000020048).

    ```bash
    echo fs.inotify.max_user_instances=8192 | sudo tee -a /etc/sysctl.conf
    echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf

    sudo sysctl -p
    ```

1. For better performance, increase the file descriptor limit:

    ```bash
    echo fs.file-max = 100000 | sudo tee -a /etc/sysctl.conf
    
    sudo sysctl -p
    ```

1. Install the following optional software if you plan to try IoT Operations quickstarts or MQTT related scenarios.
    - [MQTTUI](https://github.com/EdJoPaTo/mqttui/releases) or other MQTT client
    - [Mosquitto](https://mosquitto.org/)

1. Install the Azure CLI. You can install the Azure CLI directly onto the level 3 machine or on another *developer* or *jumpbox* machine if you plan to access the level 3 cluster remotely. If you choose to access the Kubernetes cluster remotely to keep the cluster host clean, you run the *kubectl* and *az*" related commands from the *developer* machine for the rest of the steps in this article.

    - Install Azure CLI. Follow the steps in [Install Azure CLI on Linux](/cli/azure/install-azure-cli-linux).

    - Install *connectedk8s* and other extensions.

        ```bash
        az extension add --name connectedk8s
        az extension add --name k8s-extension
        az extension add --name customlocation
        ```

    - [Install Azure CLI extension](/cli/azure/iot/ops) using `az extension add --name azure-iot-ops`.

## Create the K3S cluster

1. Install K3S with the following command:
    
    ```bash
    curl -sfL https://get.k3s.io | sh -s - --disable=traefik --write-kubeconfig-mode 644
    ```
    
    > [!IMPORTANT]
    > Be sure to use the `--disable=traefik` parameter to disable treafik. Otherwise, you might have an issue when you try to allocate public IP for the Layered Network Management service in later steps.

    As an alternative, you can configure the K3S offline using the steps in the [Air-Gap Install](https://docs.k3s.io/installation/airgap) documentation *after* you move the device to the isolated network environment.
1. Copy the K3s configuration yaml file to `.kube/config`.

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

## Move the device to level 3 isolated network

After the device is moved to your level 3 isolated network layer, it's required to have a [custom DNS](howto-configure-layered-network.md#configure-custom-dns).
- If you choose the [CoreDNS](howto-configure-layered-network.md#configure-coredns) approach, complete the steps in the instruction and your cluster is ready to connect to Arc.
- If you use a [DNS server](howto-configure-layered-network.md#configure-the-dns-server), you need to have the DNS server ready, then configure the DNS setting of Ubuntu. The following example uses Ubuntu UI:
    1. Open the **Wi-Fi Settings**.
    1. Select the setting of the current connection.
    1. In the IPv4 tab, disable the **Automatic** setting for DNS and enter the local IP of DNS server.

---

## Provision the cluster to Azure Arc

Before provisioning to Azure Arc, use the following command to make sure the DNS server is working as expected:

```bash
dig login.microsoftonline.com
```

The output should be similar to the following example. In the **ANSWER SECTION**, verify the IP address is the IP of **parent level machine** that you set up earlier.

```output
; <<>> DiG 9.18.12-0ubuntu0.22.04.3-Ubuntu <<>> login.microsoftonline.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 28891
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 65494
;; QUESTION SECTION:
;login.microsoftonline.com.     IN      A

;; ANSWER SECTION:
login.microsoftonline.com. 0    IN      A       100.104.0.165
```

### Arc-enable cluster

1. Sign in with Azure CLI. To avoid permission issues later, it's important that the sign in happens interactively using a browser window:

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
    az provider register -n "Microsoft.IoTOperationsOrchestrator"
    az provider register -n "Microsoft.IoTOperationsMQ"
    az provider register -n "Microsoft.IoTOperationsDataProcessor"
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

### Configure cluster network

>[!IMPORTANT]
> These steps are for AKS Edge Essentials only.

After you've deployed Azure IoT Operations to your cluster, enable inbound connections to Azure IoT MQ broker and configure port forwarding:
1. Enable a firewall rule for port 8883:
    ```powershell
    New-NetFirewallRule -DisplayName "Azure IoT MQ" -Direction Inbound -Protocol TCP -LocalPort 8883 -Action Allow
    ```
1. Run the following command and make a note of the IP address for the service called `aio-mq-dmqtt-frontend`:
    ```cmd
    kubectl get svc aio-mq-dmqtt-frontend -n azure-iot-operations -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
    ```
1. Enable port forwarding for port 8883. Replace `<aio-mq-dmqtt-frontend IP address>` with the IP address you noted in the previous step:
    ```cmd
    netsh interface portproxy add v4tov4 listenport=8883 listenaddress=0.0.0.0 connectport=8883 connectaddress=<aio-mq-dmqtt-frontend IP address>
    ```

## Related content

- [Configure IoT Layered Network Management level 4 cluster](./howto-configure-l4-cluster-layered-network.md)
- [Create sample network environment](./howto-configure-layered-network.md)
