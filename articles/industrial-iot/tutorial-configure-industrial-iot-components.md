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


## OPC Publisher 2.8.2 Configuration options for orchestrated mode

The following OPC Publisher configuration can be applied by Command Line Interface (CLI) options or as environment variable settings. When both the environment variable and the CLI argument are provided, the latest will overrule the env variable.

|Configuration Option     |    Description   |   Default  |
|----------------------------------------------|------------------|--------------|
site=VALUE |The site OPC Publisher is assigned to. |Not set
AutoAcceptUntrustedCertificates=VALUE |OPC UA Client Security Config - auto accept untrusted peer certificates. |false
BatchSize=VALUE |The number of OPC UA data-change messages to be cached for batching. When BatchSize is 1 or TriggerInterval is set to 0 batching is disabled. |50
BatchTriggerInterval=VALUE |The trigger batching interval in seconds. When BatchSize is 1 or TriggerInterval is set to 0 batching is disabled. |{00:00:10}
IoTHubMaxMessageSize=VALUE |The maximum size of the (IoT D2C) telemetry message. |0
Transport=VALUE |Protocol to use for communication with the hub. Allowed values: AmqpOverTcp, AmqpOverWebsocket, MqttOverTcp, MqttOverWebsocket, Amqp, Mqtt, Tcp, Websocket, Any. |MqttOverTcp
BypassCertVerification=VALUE |Enables/disables bypass of certificate verification for upstream communication to edgeHub. |false
EnableMetrics=VALUE |Enables/disables upstream metrics propagation. |true
OperationTimeout=VALUE |OPC UA Stack Transport Secure Channel - OPC UA Service call operation timeout |120,000 (2 min)
MaxStringLength=VALUE |OPC UA Stack Transport Secure Channel - Maximum length of a string that can be send/received over the OPC UA Secure channel. |130,816 (128KB - 256)
DefaultSessionTimeout=VALUE |The interval the OPC Publisher is sending keep alive messages in seconds to the OPC servers on the endpoints it's connected to. |0, meaning not set
MinSubscriptionLifetime=VALUE | OPC UA Client Application Config - Minimum subscription lifetime as per OPC UA definition. |0, meaning not set
AddAppCertToTrustedStore=VALUE |OPC UA Client Security Config - automatically copy own certificate's public key to the trusted certificate store |true
ApplicationName=VALUE |OPC UA Client Application Config - Application name as per OPC UA definition. This is used for authentication during communication init handshake and as part of own certificate validation. |"Microsoft.Azure.IIoT" 
ApplicationUri=VALUE | OPC UA Client Application Config - Application URI as per OPC UA definition. |$"urn:localhost:{ApplicationName}:microsoft:"
KeepAliveInterval=VALUE |OPC UA Client Application Config - Keep alive interval as per OPC UA definition. |10,000 (10s)
MaxKeepAliveCount=VALUE |OPC UA Client Application Config - Maximum count of kee alive events as per OPC UA definition. | 50
PkiRootPath=VALUE | OPC UA Client Security Config - PKI certificate store root path. |"pki
ApplicationCertificateStorePath=VALUE |OPC UA Client Security Config - application's own certificate store path. |$"{PkiRootPath}/own"
ApplicationCertificateStoreType=VALUE |The own application cert store type (allowed: Directory, X509Store). |Directory
ApplicationCertificateSubjectName=VALUE |OPC UA Client Security Config - the subject name in the application's own certificate. |"CN=Microsoft.Azure.IIoT, C=DE, S=Bav, O=Microsoft, DC=localhost"
TrustedIssuerCertificatesPath=VALUE |OPC UA Client Security Config - trusted certificate issuer store path. |$"{PkiRootPath}/issuers"
TrustedIssuerCertificatesType=VALUE | OPC UA Client Security Config - trusted issuer certificates store type. |Directory
TrustedPeerCertificatesPath=VALUE | OPC UA Client Security Config - trusted peer certificates store path. |$"{PkiRootPath}/trusted"
TrustedPeerCertificatesType=VALUE | OPC UA Client Security Config - trusted peer certificates store type. |Directory
RejectedCertificateStorePath=VALUE | OPC UA Client Security Config - rejected certificates store path. |$"{PkiRootPath}/rejected"
RejectedCertificateStoreType=VALUE | OPC UA Client Security Config - rejected certificates store type. |Directory
RejectSha1SignedCertificates=VALUE | OPC UA Client Security Config - reject deprecated Sha1 signed certificates. |false
MinimumCertificateKeySize=VALUE | OPC UA Client Security Config - minimum accepted certificates key size. |1024
SecurityTokenLifetime=VALUE | OPC UA Stack Transport Secure Channel - Security token lifetime in milliseconds. |3,600,000 (1h)
ChannelLifetime=VALUE | OPC UA Stack Transport Secure Channel - Channel lifetime in milliseconds. |300,000 (5 min)
MaxBufferSize=VALUE | OPC UA Stack Transport Secure Channel - Max buffer size. |65,535 (64KB -1)
MaxMessageSize=VALUE | OPC UA Stack Transport Secure Channel - Max message size. |4,194,304 (4 MB)
MaxArrayLength=VALUE | OPC UA Stack Transport Secure Channel - Max array length. |65,535 (64KB - 1)
MaxByteStringLength=VALUE | OPC UA Stack Transport Secure Channel - Max byte string length. |1,048,576 (1MB);


## Next steps
Now that you have learned how to change the default values of the configuration, you can 

> [!div class="nextstepaction"]
> [Pull IIoT data into ADX](tutorial-industrial-iot-azure-data-explorer.md)

> [!div class="nextstepaction"]
> [Visualize and analyze the data using Time Series Insights](tutorial-visualize-data-time-series-insights.md)
