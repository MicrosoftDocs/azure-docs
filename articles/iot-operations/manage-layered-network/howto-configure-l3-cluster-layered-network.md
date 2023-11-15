---
title: Configure IoT Layered Network Management level 3 cluster
# titleSuffix: Azure IoT Layered Network Management
description: Configure IoT Layered Network Management level 3 cluster.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 11/07/2023

#CustomerIntent: As an operator, I want to configure Layered Network Management so that I have secure isolate devices.
---

# Configure IoT Layered Network Management level 3 cluster

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

You can configure an Arc-enabled Kubernetes cluster in an isolated network using Azure IoT Layered Network Management. For example, level 3 or lower in the ISA-95 network architecture.

Before you start this process, the Layered Network Management service in the parent level has to be ready for accepting the connection request from this level.

You'll complete the following tasks:
- Set up the host system and install all the required software in an internet facing environment.
- Install the Kubernetes of your choice.
- Move the host to the isolated network environment.
- Use a customized DNS setting to direct the network traffic to the Layered Network Management service in parent level.
- Arc-enable the cluster.

## Configure a Kubernetes cluster

You can choose to use [AKS Edge Essentials](/azure/aks/hybrid/aks-edge-overview) hosted on Windows 11 or a K3S cluster on Ubuntu for the Kubernetes cluster.

# [AKS Edge Essentials](#tab/aksee)

## Prepare Windows 11

You should complete this step in an *internet facing environment* outside of the isolated network. Otherwise, you need to prepare the offline installation package for the following required software.

If you're using VM to create your Windows 11 machines, use the [VM image](https://developer.microsoft.com/windows/downloads/virtual-machines/) that includes Visual Studio preinstalled. Having Visual Studio ensures the required certificates needed by Arc onboarding are included.

1. Install [Windows 11](https://www.microsoft.com/software-download/windows11) on your device.
1. Install [Helm](https://helm.sh/docs/intro/install/) 3.8.0 or later.
1. Install [Kubectl](https://kubernetes.io/docs/tasks/tools/)
1. Install AKS Edge Essentials. Follow the steps in [Prepare your machines for AKS Edge Essentials](/azure/aks/hybrid/aks-edge-howto-setup-machine).
1. Install Azure CLI. Follow the steps in [Install Azure CLI on Windows](/cli/azure/install-azure-cli-windows).
1. Install *connectedk8s* and other extensions.

    ```bash
    az extension add --name connectedk8s
    az extension add --name k8s-extension
    az extension add --name customlocation
    ```
1. [Install Azure CLI extension](/cli/azure/iot/ops).
1. **Certificates:** For Level 3 and lower, you ARC onboard the cluster that isn't connected to the internet. Therefore, you need to install certificates steps in [Prerequisites for AKS Edge Essentials offline installation](/azure/aks/hybrid/aks-edge-howto-offline-install).
1. Install the following optional software if you plan to try IoT Operations quickstarts or MQTT related scenarios.
    - [MQTTUI](https://github.com/EdJoPaTo/mqttui/releases) or other MQTT client
    - [Mosquitto](https://mosquitto.org/)

## Move the device to level 3 isolated network

In your isolated network layer, the DNS server was configured in a prerequisite step using [Create sample network environment](./howto-configure-layered-network.md). Complete the step if you haven't done so.

After the device is moved to L3, configure the DNS setting using the following steps:

1. In **Windows Control Panel** > **Network and Internet** > **Network and Sharing Center**, select the current network connection.
1. In the network properties dialog, select **Properties** > **Internet Protocol Version 4 (TCP/IPv4)** > **Properties**.
1. Select **Use the following DNS server addresses**.
1. Enter the level 3 DNS server local IP address.

    :::image type="content" source="./media/howto-configure-l3-cluster-layered-network/windows-dns-setting.png" alt-text="Screenshot that shows Windows DNS setting with the level 3 DNS server local IP address.":::

## Create the AKS Edge Essentials cluster

To create the AKS Edge Essentials cluster in level 3, use the `aks-ee-config.json` file that was created for [Level 4 AKS Edge Essentials](howto-configure-l4-cluster-layered-network.md) with following modification:

1. In the **Network** section, set the `SkipDnsCheck` property to **true** and add the `DnsServers` property set to the address of the DNS server in the subnet.

    ```json
    "DnsServers": ["<IP ADDRESS OF THE DNS SERVER IN SUBNET>"],
    "SkipDnsCheck": true,
    ```

1. Create the AKS Edge Essentials cluster.

    ```bash
    New-AksEdgeDeployment -JsonConfigFilePath .\aks-ee-config.json
    ```

# [K3S cluster](#tab/k3s)

You should complete this step in an *internet facing environment outside of the isolated network*. Otherwise, you need to prepare the offline installation package for the following software in the next section.

## Prepare an Ubuntu machine

1. Ubuntu 22.04 LTS is the recommended version for the host machine.
1. Install [Helm](https://helm.sh/docs/intro/install/) 3.8.0 or later.
1. Install [Kubectl](https://kubernetes.io/docs/tasks/tools/).
1. Install Azure CLI. Follow the steps in [Install Azure CLI on Linux](/cli/azure/install-azure-cli-linux).
1. Install *connectedk8s* and other extensions.

    ```bash
    az extension add --name connectedk8s
    az extension add --name k8s-extension
    az extension add --name customlocation
    ```
1. [Install Azure CLI extension](/cli/azure/iot/ops).
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

1. For better performance, make sure the [file descriptor limit](https://www.cyberciti.biz/faq/linux-increase-the-maximum-number-of-open-files/) is high enough.

1. Install the following optional software if you plan to try IoT Operations quickstarts or MQTT related scenarios.
    - [MQTTUI](https://github.com/EdJoPaTo/mqttui/releases) or other MQTT client
    - [Mosquitto](https://mosquitto.org/)

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

In your isolated network layer, the DNS server was configured in a prerequisite step using [Create sample network environment](./howto-configure-layered-network.md). Complete the step if you haven't done so.

After the device is moved to L3, configure the DNS setting using the following steps:

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

Follow the steps in [Prepare your Kubernetes cluster](../deploy-iot-ops/howto-prepare-cluster.md) to provision your cluster to Arc.

## Related content

- [Create sample network environment](./howto-configure-layered-network.md)
