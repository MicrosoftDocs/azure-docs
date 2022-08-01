---
title: Configure the Azure Industrial IoT components
description: In this tutorial, you learn how to change the default values of the configuration.
author: jehona-m
ms.author: jemorina
ms.service: industrial-iot
ms.topic: tutorial
ms.date: 3/22/2021
---

# Tutorial: Configure the Industrial IoT components

The deployment script automatically configures all components to work with each other using default values. However, the settings of the default values can be changed to meet your requirements.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Customize the configuration of the components


Here are some of the more relevant customization settings for the components:
* IoT Hub
    * Networking→Public access: Configure Internet access, for example, IP filters
    * Networking → Private endpoint connections: Create an endpoint that's not accessible
    through the Internet and can be consumed internally by other Azure services or on-premises devices (for example, through a VPN connection)
    * IoT Edge: Manage the configuration of the edge devices that are connected to the OPC
UA servers 
* Cosmos DB
    * Replicate data globally: Configure data-redundancy
    * Firewall and virtual networks: Configure Internet and VNET access, and IP filters
    * Private endpoint connections: Create an endpoint that is not accessible through the
Internet 
* Key Vault
    * Secrets: Manage platform settings
    * Access policies: Manage which applications and users may access the data in the Key
Vault and which operations (for example, read, write, list, delete) they are allowed to perform on the network, firewall, VNET, and private endpoints
* Microsoft Azure Active Directory (Azure AD)→App registrations
    * <APP_NAME>-web → Authentication: Manage reply URIs, which is the list of URIs that
can be used as landing pages after authentication succeeds. The deployment script may be unable to configure this automatically under certain scenarios, such as lack of Azure AD admin rights. You may want to add or modify URIs when changing the hostname of the Web app, for example, the port number used by the localhost for debugging
* App Service
    * Configuration: Manage the environment variables that control the services or UI
* Virtual machine
    * Networking: Configure supported networks and firewall rules
    * Serial console: SSH access to get insights or for debugging, get the credentials from the
output of deployment script or reset the password
* IoT Hub → IoT Edge
    * Manage the identities of the IoT Edge devices that may access the hub, configure which modules are installed and which configuration they use, for example, encoding parameters for the OPC Publisher
* IoT Hub → IoT Edge → \<DEVICE> → Set Modules → OpcPublisher (for standalone OPC Publisher operation only)

## Configuration via Command-line Arguments for OPC Publisher 2.8.2 and above

There are [several Command-line Arguments](reference-command-line-arguments.md#opc-publisher-command-line-arguments-for-version-282-and-above) that can be used to set global settings for OPC Publisher.
Refer to the `mode` part in the command line description to check if a Command-line Argument is applicable to orchestrated or standalone mode. 

## Next steps
Now that you have learned how to change the default values of the configuration, you can 

> [!div class="nextstepaction"]
> [Pull IIoT data into ADX](tutorial-industrial-iot-azure-data-explorer.md)

> [!div class="nextstepaction"]
> [Visualize and analyze the data using Time Series Insights](tutorial-visualize-data-time-series-insights.md)
