---
title: EIoT deployment guide
description: Learn how to deploy EIoT for your Defender for IoT service.
ms.topic: how-to
ms.date: 06/22/2021
---

# Deploy EIoT 

Thank you for joining our EIoT Private Preview program. We appreciate the time and efforts you are investing in order to help us to launch a better product.  

The purpose of this document is to outline all the requirements that are needed to prepare the site before the deployment procedure. 

##  Unified IoT Security - Solution Architecture 

The Azure Defender for IoT (AD-IoT) team at Microsoft is responsible for securing IoT devices end-to-end whether they are on-premises, in the cloud, or in hybrid environments.  

We are now extending agentless capabilities to go beyond operational environments, and advancing into the realm of enterprise environments. Thereby, delivering coverage to the entire breadth of IoT devices in your environment. This includes everything from corporate printers, cameras to purpose-built devices, proprietary, and unique devices.    

:::image type="content" source="media/eiot-deployment/eiot-architecture.png" alt-text="This is a sample of the EIoT architecture.":::

The expansion into the enterprise network, creates a unique opportunity to leverage Microsoft 365 Defender’s asset discovery capabilities.  

The Private Preview of the new Defender for EIoT solution (covering Enterprise, OT, and M365D) includes:  

### Automatic 3T discovery for IT, IoT, and OT

Use passive agentless network monitoring to gain insight into your complete inventory of all your IT, IoT, and OT devices. The discovery process continuously identifies and classifies devices in your network, and resolves all device details. The discovery process is performed with zero impact to the network.  

### Single pane of glass   

A centralized user experience lets the security team visualize, and secure all their IT, IoT, and OT devices regardless of where the devices is located.   

### The power of unified SIEM and XDR  

Azure Defender for IoT shares its high-resolution signal data with Microsoft Defender, and Azure Sentinel. This optimizes the users ability to perform incident response efficiently, and accurately with a complete story that is inclusive of the IoT devices involved. Azure Sentinel customers no longer need to switch consoles to put the story together!  

### Easy deployment for a scalable solution   

Azure Defender for IoT ensures quick and frictionless deployment of network sensors, both physical, or virtual appliances, with the support of our engineering team, and other departments.

## Prerequisites

**Configure a sensor**:

1. Set up a server, or VM.

1. Ensure the minimum resources are set to:
 
    - 4C CPU
    
    - 8-GB ram
    
    - 250 GB HDD
    
    - 2 Network Adapters
    
    - OS: Ubuntu 18.04.1 or higher 

1. Connect a NIC to a switch.

    - **Physical device** - connect a monitoring network interface (NIC) to a switch monitoring (SPAN) port.
    
    - **VM** - Connect a vNIC to a vSwitch in promiscuous mode.
    
1. Validate incoming traffic to the monitoring port with the following command:

    ```bash
    ifconfig <moinitoring interface>
    ```

    If the number of RX packets increases each time, the interface is receiving incoming traffic. Repeat this step for each interface you have. 

**Configure an Azure instance**:

Purchase, and set up an Azure IoTHub. The minimum size needed is the smallest hub ($20).

> [!Note]
> Due to GDPR regulations, EU customers must set their instances to the EU **Europe West** cloud. Any customer outside of the EU, should set their instance to US **US East** cloud.

Onboard a new subscription, and provide the subscription ID to your ADIoT contact to ensure you will not be billed.

## Onboard a new subscription

Create, and onboard a new subscription, even if you already have a current subscription with Azure Defender for IoT.

**To onboard a new subscription**:

1. Navigate to the [Azure portal](https://ms.portal.azure.com/) located at `https://ms.portal.azure.com/?enterpriseiot=true#home`.

    > [!Note]
    > You must select the specific link provided in step #1 or you will not be able to compete the process listed below.

1. On the getting started page, Select **Onboard a subscription**.

    :::image type="content" source="media/eiot-deployment/onboard-subscription.png" alt-text="Select onboard a subscription from the getting started page.":::

1. Select :::image type="icon" source="media/eiot-deployment/onboard-icon.png" border="false":::.

1. In the Onboard subscription window, select your subscription, and set the number of committed devices to **1000**.

1. Select the **Onboard** button.

## Onboard a sensor

Onboard a new sensor for this scenario.

**To onboard a sensor**:

1. Navigate to the [Azure portal](https://ms.portal.azure.com/?enterpriseiot=true#home) at `https://ms.portal.azure.com/?enterpriseiot=true#home`.

1. Select **Onboard sensor**.

    :::image type="content" source="media/eiot-deployment/onboard-sensor.png" alt-text="On the Getting Started page select Onboard sensor.":::

1. Enter a name for the sensor.

1. Select a subscription.

1. In the Deploy for field, select **An enterprise network**.

1. Select an IoTHub.

1. Enter a site name.

1. Select your zone.

1. Select **Register**.

1. On the Download activation file tab, select **Download activation file**.

1. Select **Finish**.

1. (Optional) If you have a firewall enabled, you must open up port 443 to allow the service to operate.

1. (Optional) If you are using a proxy environment, enter your credentials, and set the proxy to allow a connection to Azure. **Proxies without passwords are not supported**.

## Install the sensor

You will need to download a package, and move it, and your activation file to the home directory.

**To install the sensor**:

1. Download the [package](https://eiotdsretemp.blob.core.windows.net/files/eiot-89cbc08bbc.deb?sp=r&st=2021-06-16T13:56:00Z&se=2021-06-16T18:56:00Z&spr=https&sv=2020-02-10&sr=b&sig=G0AStF9o1gJ3wEhCEWW7nu2hKz2q%2B4usYTen33T5Q4E%3D).

1. Locate the package and rename it to `eiot.deb`.

1. Place the activation file you downloaded in the previous steps, and the package in the home directory.

1. Update APT using the following command:

    ```bash
    sudo apt update
    ```

1. Install docker.io with the following command:

    ```bash
    sudo apt install docker.io 
    ```

1. Ensure that traffic monitoring NICs are working.

## Run the Enterprise IoT sensor installation

**To run the Enterprise IoT sensor installation**:

1. Navigate to the home directory on the machine.

1. Run the following command:

    ```bash
    sudo LICENSE_PATH=/home/<user>/<license.zip> apt install -y ./eiot.deb
    ```

1. On the Interface Selection popup screen, set all of the interfaces to **monitor**.

1. (Optional) If you are using a proxy, select **Yes**, and enter a server, port, username, and password for the proxy.

    If you are not using a proxy, select **No**,  and wait for the installation to complete.

## Validate your setup

1. Run the following command to process the sanity of your system.

    ```bash
    sudo docker ps
    ```
1. Ensure the following containers are up:

    - compose_statistics-collector_1
    
    - compose_cloud-communication_1
    
    - compose_horizon_1
    
    - compose_attributes-collector_1
    
    - compose_properties_1

1. Monitor port validation with the following command to see which interface is defined to handle port mirroring.

    ```bash
    sudo docker logs compose_horizon_1
    ````
    :::image type="content" source="media/eiot-deployment/defined-interface.png" alt-text="Run the command to see which interface is defined to handle port monitoring.":::

1. Run the following command to check the traffic D2C sanity

    ```bash
    sudo docker logs -f compose_attributes-collector_1
    ```
    Ensure that a large number of packets is sent to the eventHub. For example, `Sending 100000 messages to eventHub`.

## Remove the sensor (optional)

You can use the following command to Remove the sensor.

```bash
sudo apt purge -y adiot-sensor
```