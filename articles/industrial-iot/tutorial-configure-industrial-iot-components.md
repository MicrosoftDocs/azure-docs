---
title: Configure Azure Industrial IoT components
description: In this tutorial, you learn how to change the default values of the Azure Industrial IoT configuration.
author: hansgschossmann
ms.author: johanng
ms.service: industrial-iot
ms.topic: tutorial
ms.date: 3/22/2021
---

# Tutorial: Configure Industrial IoT components

The deployment script automatically configures all Azure Industrial IoT components to work with each other using default values. However, you can change the settings to meet your requirements.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Customize the configuration of Azure Industrial IoT components

## Customization settings

Here are some of the more relevant customization settings for the components.

### IoT Hub

* Networking (public access): Configure internet access (for example, IP filters).
* Networking(private endpoint connections): Create an endpoint that's inaccessible through the internet but that can be consumed internally by other Azure services or on-premises devices (for example, through a VPN connection).
* Azure IoT Edge: Manage the configuration of the edge devices that are connected to the OPC Unified Architecture (OPC UA) servers. 

### Azure Cosmos DB

* Replicate data globally: Configure data redundancy.
* Firewall and virtual networks: Configure internet and virtual network access, and IP filters.
* Private endpoint connections: Create an endpoint that's inaccessible through the internet. 

### Azure Key Vault

* Secrets: Manage platform settings.
* Access policies: Manage which applications and users may access the data in the key vault and which operations (for example, read, write, list, delete) they are allowed to perform on the network, firewall, virtual network, and private endpoints.

### Azure Active Directory app registrations

* <APP_NAME>-web (authentication): Manage reply URIs, which are the lists of URIs that can be used as landing pages after authentication succeeds. The deployment script might be unable to configure this automatically under certain scenarios, such as lack of Azure Active Directory (Azure AD) administrator rights. You might want to add or modify URIs when you're changing the hostname of the web app (for example, the port number that's used by the localhost for debugging).

### Azure App Service

* Configuration: Manage the environment variables that control the services or the user interface.

### Azure Virtual Machines

* Networking: Configure supported networks and firewall rules.
* Serial console: Get Secure Shell (SSH) access for insights or for debugging, get the credentials from the output of deployment script, or reset the password.

### Azure IoT Hub → Azure IoT Edge

* Manage the identities of the IoT Edge devices that can access the hub. Also, configure which modules are installed and identify which configuration they use (for example, encoding parameters for OPC Publisher).

### IoT Hub → IoT Edge → \<DEVICE> → Set Modules → OpcPublisher
* This setting applies to *standalone* OPC Publisher operation only.

## Command-line arguments for OPC Publisher version 2.8.2 and later

To establish global settings for OPC Publisher, you can use any of [several command-line arguments](reference-command-line-arguments.md#command-line-arguments-for-version-282-and-later). To learn whether a particular argument applies to *standalone* or *orchestrated* mode, refer to the "Mode" designation in the argument **Description** column of the table. 

## Next steps

Now that you've learned how to change the default values of the configuration, you can: 

> [!div class="nextstepaction"]
> [Pull Industrial IoT data into ADX](tutorial-industrial-iot-azure-data-explorer.md)

> [!div class="nextstepaction"]
> [Visualize and analyze the data by using Time Series Insights](tutorial-visualize-data-time-series-insights.md)
