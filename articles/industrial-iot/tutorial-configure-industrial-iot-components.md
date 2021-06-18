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
* Azure Active Directory (AAD)→App registrations
    * <APP_NAME>-web → Authentication: Manage reply URIs, which is the list of URIs that
can be used as landing pages after authentication succeeds. The deployment script may be unable to configure this automatically under certain scenarios, such as lack of AAD admin rights. You may want to add or modify URIs when changing the hostname of the Web app, for example, the port number used by the localhost for debugging
* App Service
    * Configuration: Manage the environment variables that control the services or UI
* Virtual machine
    * Networking: Configure supported networks and firewall rules
    * Serial console: SSH access to get insights or for debugging, get the credentials from the
output of deployment script or reset the password
* IoT Hub → IoT Edge
    * Manage the identities of the IoT Edge devices that may access the hub, configure which modules are installed and which configuration they use, for example, encoding parameters for the OPC Publisher
* IoT Hub → IoT Edge → \<DEVICE> → Set Modules → OpcPublisher (for standalone OPC Publisher operation only)


## Configuration options

|Configuration Option (shorthand/full name)    |    Description   |
|----------------------------------------------|------------------|
pf/publishfile |The filename to configure the nodes to publish. If this option is specified, it puts OPC Publisher into standalone mode.
lf/logfile |The filename of the logfile to use.
ll/loglevel |The log level to use (allowed: fatal, error, warn, info, debug, verbose).
me/messageencoding |The messaging encoding for outgoing messages allowed values: Json, Uadp
mm/messagingmode |The messaging mode for outgoing messages allowed values: PubSub, Samples
fm/fullfeaturedmessage |The full featured mode for messages (all fields filled in). Default is 'true', for legacy compatibility use 'false'
aa/autoaccept |The publisher trusted all servers it's a connection to
bs/batchsize |The number of OPC UA data-change messages to be cached for batching.
si/iothubsendinterval |The trigger batching interval in seconds.
ms/iothubmessagesize |The maximum size of the (IoT D2C) message.
om/maxoutgressmessages |The maximum size of the (IoT D2C) message egress buffer.
di/diagnosticsinterval |Shows publisher diagnostic info at the specified interval in seconds (need log level info). -1 disables remote diagnostic log and diagnostic output
lt/logflugtimespan |The timespan in seconds when the logfile should be flushed.
ih/iothubprotocol |Protocol to use for communication with the hub. Allowed values: AmqpOverTcp, AmqpOverWebsocket, MqttOverTcp, MqttOverWebsocket, Amqp, Mqtt, Tcp, Websocket, Any
hb/heartbeatinterval |The publisher is using this as default value in seconds for the heartbeat interval setting of nodes without a heartbeat interval setting.
ot/operationtimeout |The operation timeout of the publisher OPC UA client in ms.
ol/opcmaxstringlen |The max length of a string opc can transmit/receive.
oi/opcsamplinginterval |Default value in milliseconds to request the servers to sample values
op/opcpublishinginterval |Default value in milliseconds for the publishing interval setting of the subscriptions against the OPC UA server.
ct/createsessiontimeout |The interval the publisher is sending keep alive messages in seconds to the OPC servers on the endpoints it's connected to.
kt/keepalivethresholt |Specify the number of keep alive packets a server can miss, before the session is disconnected.
tm/trustmyself |The publisher certificate is put into the trusted store automatically.
at/appcertstoretype |The own application cert store type (allowed: Directory, X509Store).


## Next steps
Now that you have learned how to change the default values of the configuration, you can 

> [!div class="nextstepaction"]
> [Pull IIoT data into ADX](tutorial-industrial-iot-azure-data-explorer.md)

> [!div class="nextstepaction"]
> [Visualize and analyze the data using Time Series Insights](tutorial-visualize-data-time-series-insights.md)
