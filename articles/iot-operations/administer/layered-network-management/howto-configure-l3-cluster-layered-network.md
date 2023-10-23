---
title: Configure IoT Layered Network Management Level 3 Cluster
# titleSuffix: Azure IoT Layered Network Management
description: Configure IoT Layered Network Management Level 3 Cluster.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.date: 10/22/2023

#CustomerIntent: As an operator, I want to configure Layered Network Management so that I have secure isolate devices.
---

# Configure IoT Layered Network Management Level 3 Cluster

This page describes the process to setup an Arc-enable kubernetes cluster in the isolated network. You can shoose to use the AKS EE ([AKS Edge Essentials](https://learn.microsoft.com/en-us/azure/aks/hybrid/aks-edge-overview)) hosted on Windows 11 or a K3S clsuter on Ubuntu.

## Setting Up Kubernetes Cluster

{{< tabpane text=true >}}

{{% tab header="AKS EE" %}}

#### Setup AKS EE cluster
1. **Prepare a Windows 11 Machine**
   > It is recommended to complete this step in an **internet facing environment** (outside of the isolated network). Otherwise, you will need to prepare the offline installation package for the following software.

   > If you are using VM to create your Windows 11 machines, please use the [VM image](https://developer.microsoft.com/en-us/windows/downloads/virtual-machines/) that includes Visual Studio preinstalled. This will ensure the required certificates needed by Arc onboarding are included.

    - Install [Windows 11](https://www.microsoft.com/software-download/windows11) on your device
    - Install Helm 3.8.0 or later
    - Install Kubectl
    - Install AKS EE with the following instruction:
        - [Prepare your machines for AKS Edge Essentials](https://learn.microsoft.com/en-us/azure/aks/hybrid/aks-edge-howto-setup-machine)
   - Install Azure CLI with the following instruction:
        - [Install Azure CLI on Windows](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-windows?tabs=azure-cli)
        - Install connectedk8s:
            ```bash
            az extension add --name connectedk8s
            ```
    - **Certificates:** For Levels 3 and below, we are ARC onboarding the cluster that is not connected to the internet. Therefore, you need to install certificates mentioned in the [Prerequisites for AKS Edge Essentials offline installation](https://learn.microsoft.com/en-us/azure/aks/hybrid/aks-edge-howto-offline-install).            
2. **Move the device to level 3 (isolated network)**  
In your isolated network layer, the DNS server should have been setup with the following instruction.
    - [Setup the DNS server](/e4in/setup-isolated-network/#setup-the-dns-server)  

    After the device is moved to L3, configure the DNS setting:
    1. Control Panel -> Network and Internet -> Network and Sharing Center
    2. Click on the current network connection
    3. In the popup window, Properties -> Internet Protocol Version 4 (TCP/IPv4) -> Properties
    4. Check "Use the following DNS server addresses"
    5. Input the level 3 DNS server local IP address
  
    ![Windows DNS setup](windows_dns.png)

3. **Create the AKS EE cluster**  
To create the AKS EE cluster in the level 3, use the `aks-ee-config.json` file that created for [Level 4 AKS EE](/e4in/setup-l4-cluster/#aks-ee-cluster) with following modification:
    - In the **Network** section, set the `SkipDnsCheck` property to **true**, and added the `DnsServers` property with proper value.
        ```
        "DnsServers": ["<IP ADDRESS OF THE DNS SERVER IN SUBNET>"],
        "SkipDnsCheck": true,
        ```
   Create the AKS EE cluster:
    ```bash
    New-AksEdgeDeployment -JsonConfigFilePath .\aks-ee-config.json
    ```
4. **Refer to the prerequisites for Kubernetes cluster in [Install Project Alice Springs](/docs/quickstart/install/).** Most of the prerequisites should have been covered in the previous steps. However, you need to review the Alice Springs prerequisites and make sure all the steps are completed.

{{% /tab %}}

{{% tab header="K3S" %}}

#### Setup K3S cluster
1. **Prepare a Ubuntu machine**
    - Ubuntu 22.04 LTS is recommended
    - Install Helm 3.8.0 or later
    - Install Kubectl
    - Install Azure CLI with the following instruction:
        - [Install Azure CLI on Windows](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-windows?tabs=azure-cli)
    - Install connectedk8s:  
            ```bash
            az extension add --name connectedk8s
            ```
    - Install `nfs-common` on the host machine.
       ```bash
       sudo apt install nfs-common
       ```
    - Run the following command to increase the [user watch/instance limits](https://www.suse.com/support/kb/doc/?id=000020048).
         ```bash
         echo fs.inotify.max_user_instances=8192 | sudo tee -a /etc/sysctl.conf
         echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf

         sudo sysctl -p
         ```
    - For better performance, make sure the [file descriptor limit](https://www.cyberciti.biz/faq/linux-increase-the-maximum-number-of-open-files/) is high enough.
    - Refer to the [Install Project Alice Springs](/docs/quickstart/install/) to fulfill prerequisite for the host.
      
2. **Move the device to level 3 (isolated network)**
In your isolated network layer, the DNS server should have been setup with the following instruction.
    - [Setup the DNS server](https://github.com/EthanChangAED/alicesprings-preview/blob/real-machine-guide/content/en/docs/E4IN/Setup%20Isolated%20Network/index.md#setup-the-dns-server)  

    After the device is moved to L3, configure the DNS setting:
    - Open the "Wi-Fi Settings"
    - Click setting of the current connection
    - In the IPv4 tab:
        - Disable the "Automatic" setting for DNS
        - Input the local IP of DNS server
3. **Create the K3S cluster**
    - Setup the K3S offline with the following instruction:
        - [Air-Gap Install](https://docs.k3s.io/installation/airgap)
    - Copy the K3s configuration yaml file to `.kube/config`.
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
4. **Refer to the prerequisites for Kubernetes cluster in [Install Project Alice Springs](/docs/quickstart/install/).** Most of the prerequisites should have been covered in the previous steps. However, you need to review the Alice Springs prerequisites and make sure all the steps are completed.

{{% /tab %}}

{{< /tabpane >}}

## Provision the Cluster to Arc
Before provisioning to Arc, use the following command to make sure the DNS server is working as expected.
```bash
dig login.microsoftonline.com
```
The output should be similar to the following example. In the "ANSWER" section, make sure the IP address is the IP of **parent level machine** that you set up previously.
```
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

#### Arc-enable cluster

Refer to [Connect Kubernetes cluster to Azure Arc](/docs/quickstart/install/#connect-kubernetes-cluster-to-azure-arc) to provision you cluster to Arc.

## Related content

TODO: Add your next step link(s)
