---
title: Discover OPC UA data sources using the Akri services
description: How to discover and configure OPC UA data sources at  the edge automatically by using the Akri services
author: dominicbetts
ms.author: dobett
ms.subservice: azure-akri
ms.topic: how-to 
ms.date: 05/15/2024

# CustomerIntent: As an industrial edge IT or operations user, I want to discover and create OPC UA data sources in my industrial edge environment so that I can reduce manual configuration overhead. 
---

# Discover OPC UA data sources using the Akri services

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this article, you learn how to discover OPC UA data sources automatically. After you deploy Azure IoT Operations Preview, you configure the Akri services to discover OPC UA data sources at the edge. The Akri services create custom resources in your Kubernetes cluster that represent the data sources it discovers. The ability to discover OPC UA data sources removes the need to [manually configure them by using the operations experience web UI](howto-manage-assets-remotely.md).

> [!IMPORTANT]
> Currently, you can't use Azure Device Registry to manage the assets that the Akri services discover and create.

The Akri services enable you to detect and create assets in the address space of an OPC UA server. The OPC UA asset detection generates `AssetType` and `Asset` custom resources for [OPC UA Device Integration (DI) specification](https://reference.opcfoundation.org/DI/v104/docs/) compliant assets.

## Prerequisites

- Install Azure IoT Operations Preview. To install Azure IoT Operations for demonstration and exploration purposes, see [Quickstart: Run Azure IoT Operations Preview in Github Codespaces with K3s](../get-started-end-to-end-sample/quickstart-deploy.md).
- Verify that the Akri services pods are properly configured by running the following command:

    ```bash
    kubectl get pods -n azure-iot-operations
    ```

    The output includes a line that shows the Akri agent and discovery pods are running:

    ```output
    NAME                                             READY   STATUS    RESTARTS   AGE
    aio-akri-agent-daemonset-hwpc7                   1/1     Running   0          17mk0s
    aio-opc-asset-discovery-wzlnj                    1/1     Running   0          8m28s
    ```

## Configure the OPC UA discovery handler

To configure the OPC UA discovery handler for asset detection, create a YAML configuration file that contains the values described in this section:

| Name | Mandatory | Datatype | Default | Comment |
| ---- | --------- | -------- | ------- | ------- |
| `EndpointUrl`                     | true    | String   | null    | The OPC UA endpoint URL to use for asset discovery |
| `AutoAcceptUntrustedCertificates` | true ¹ | Boolean  | false   | Should the client autoaccept untrusted certificates? A certificate can only be autoaccepted as trusted if no nonsuppressible errors occurred during chain validation. For example, a certificate with incomplete chain isn't accepted. |
| `UseSecurity`                     | true ¹ | Boolean  | true    | Should the client use a secure connection? |
| `UserName`                        | false             | String   | null    | The username for user authentication. ² |
| `Password`                        | false             | String   | null    | The password for user authentication. ² |

¹ The current version of the discovery handler only supports `UseSecurity=false` and requires `autoAcceptUntrustedCertificates=true`.  
² A temporary implementation until the Akri services can pass Kubernetes secrets.

The following example demonstrates discovery of an OPC PLC server. You can add the asset parameters for multiple OPC PLC servers.

1. To create the YAML configuration file, copy and paste the following content into a new file, and save it as `opcua-configuration.yaml`:

    If you're using the simulated PLC server that was deployed with the Azure IoT Operations Quickstart, you don't need to change the `endpointUrl`. If you have your own OPC UA servers running or are using the simulated PLC servers deployed on Azure, add in your endpoint URL accordingly. Discovery endpoint URLs look like `opc.tcp://<FQDN>:50000/`. To find the FQDNs of your OPC PLC servers, go to your deployment in the Azure portal. For each server, copy and paste the **FQDN** value into your endpoint URLs.

    ```yaml
    apiVersion: akri.sh/v0
    kind: Configuration
    metadata:
      name: aio-akri-opcua-asset
    spec:
      discoveryHandler: 
        name: opcua-asset
        discoveryDetails: "opcuaDiscoveryMethod:\n  - asset:\n      endpointUrl: \"	opc.tcp://opcplc-000000:50000\"\n      useSecurity: false\n      autoAcceptUntrustedCertificates: true\n"
      brokerProperties: {}
      capacity: 1
    ```

1. To apply the configuration, run the following command:

    ```bash
    kubectl apply -f opcua-configuration.yaml -n azure-iot-operations
    ```

> [!TIP]
> In a default Azure IoT Operations deployment, the OPC UA discovery handler is already configured to discover the simulated PLC server. If you want to discover assets connected to additional OPC UA servers, you can add them to the configuration file.

## Verify the configuration

To confirm that the asset discovery container is configured and running:

1. Use the following command to check the pod logs:

    ```bash
    kubectl logs <insert aio-opc-asset-discovery pod name> -n azure-iot-operations
    ```

    A log from the `aio-opc-asset-discovery` pod indicates after a few seconds that the discovery handler registered itself with the Akri services:

    ```2024-08-01T15:04:12.874Z aio-opc-asset-discovery-4nsgs - Akri OPC UA Asset Discovery (1.0.0-preview-20240708+702c5cafeca2ea49fec3fb4dc6645dd0d89016ee) is starting with the process id: 1
    2024-08-01T15:04:12.948Z aio-opc-asset-discovery-4nsgs - OPC UA SDK 1.5.374.70 from 07/20/2024 07:37:16
    2024-08-01T15:04:12.973Z aio-opc-asset-discovery-4nsgs - OPC UA SDK informational version: 1.5.374.70+1ee3beb87993019de4968597d17cb54d5a4dc3c8
    2024-08-01T15:04:12.976Z aio-opc-asset-discovery-4nsgs - Akri agent registration enabled: True
    2024-08-01T15:04:13.475Z aio-opc-asset-discovery-4nsgs - Hosting starting
    2024-08-01T15:04:13.547Z aio-opc-asset-discovery-4nsgs - Overriding HTTP_PORTS '8080' and HTTPS_PORTS ''. Binding to values defined by URLS instead 'http://+:8080'.
    2024-08-01T15:04:13.774Z aio-opc-asset-discovery-4nsgs - Now listening on: http://:8080
    2024-08-01T15:04:13.774Z aio-opc-asset-discovery-4nsgs - Application started. Press Ctrl+C to shut down.
    2024-08-01T15:04:13.774Z aio-opc-asset-discovery-4nsgs - Hosting environment: Production
    2024-08-01T15:04:13.774Z aio-opc-asset-discovery-4nsgs - Content root path: /app
    2024-08-01T15:04:13.774Z aio-opc-asset-discovery-4nsgs - Hosting started
    2024-08-01T15:04:13.881Z aio-opc-asset-discovery-4nsgs - Registering with Agent as HTTP endpoint using own IP from the environment variable POD_IP: 10.42.0.245
    2024-08-01T15:04:14.875Z aio-opc-asset-discovery-4nsgs - Registered with the Akri agent with name opcua-asset for http://10.42.0.245:8080 with type Network and shared True
    2024-08-01T15:04:14.877Z aio-opc-asset-discovery-4nsgs - Successfully re-registered OPC UA Asset Discovery Handler with the Akri agent
    2024-08-01T15:04:14.877Z aio-opc-asset-discovery-4nsgs - Press CTRL+C to exit 
    ```

    After about a minute, the Akri services issue the first discovery request based on the configuration:

    ```output
    2024-08-01T15:04:15.280Z aio-opc-asset-discovery-4nsgs [opcuabroker@311 SpanId:6d3db9751eebfadc, TraceId:e5594cbaf3993749e92b45c88c493377, ParentId:0000000000000000 ConnectionId:0HN5I7CQJPJL0 RequestPath:/v0.DiscoveryHandler/Discover RequestId:0HN5I7CQJPJL0:00000001] - Reading message.
    2024-08-01T15:04:15.477Z aio-opc-asset-discovery-4nsgs [opcuabroker@311 SpanId:6d3db9751eebfadc, TraceId:e5594cbaf3993749e92b45c88c493377, ParentId:0000000000000000 ConnectionId:0HN5I7CQJPJL0 RequestPath:/v0.DiscoveryHandler/Discover RequestId:0HN5I7CQJPJL0:00000001] - Received discovery request from ipv6:[::ffff:10.42.0.241]:48638
    2024-08-01T15:04:15.875Z aio-opc-asset-discovery-4nsgs [opcuabroker@311 SpanId:6d3db9751eebfadc, TraceId:e5594cbaf3993749e92b45c88c493377, ParentId:0000000000000000 ConnectionId:0HN5I7CQJPJL0 RequestPath:/v0.DiscoveryHandler/Discover RequestId:0HN5I7CQJPJL0:00000001] - Start asset discovery
    2024-08-01T15:04:15.882Z aio-opc-asset-discovery-4nsgs [opcuabroker@311 SpanId:6d3db9751eebfadc, TraceId:e5594cbaf3993749e92b45c88c493377, ParentId:0000000000000000 ConnectionId:0HN5I7CQJPJL0 RequestPath:/v0.DiscoveryHandler/Discover RequestId:0HN5I7CQJPJL0:00000001] - Discovering OPC UA     opc.tcp://opcplc-000000:50000 using Asset Discovery
    2024-08-01T15:04:15.882Z aio-opc-asset-discovery-4nsgs [opcuabroker@311 SpanId:6d3db9751eebfadc, TraceId:e5594cbaf3993749e92b45c88c493377, ParentId:0000000000000000 ConnectionId:0HN5I7CQJPJL0 RequestPath:/v0.DiscoveryHandler/Discover RequestId:0HN5I7CQJPJL0:00000001] - Selected AutoAcceptUntrustedCertificates mode: False
    ```

    After the discovery is complete, the discovery handler sends the result back to the Akri services to create an Akri instance custom resource with asset information and observable variables. The discovery handler repeats the discovery every 10 minutes to detect any changes on the server.

1. To view the discovered Akri instances, run the following command:

    ```bash
    kubectl get akrii -n azure-iot-operations
    ```

    The output from the previous command looks like the following example. You might need to wait for a few seconds for the Akri instance to be created:

    ```output
    NAME                      CONFIG             SHARED   NODES                          AGE
    akri-opcua-asset-dbdef0   akri-opcua-asset   true     ["k3d-k3s-default-server-0"]   24h
    ```

    The connector for OPC UA supervisor watches for new Akri instance custom resources of type `opc-ua-asset`, and generates the initial asset types and asset custom resources for them. You can modify asset custom resources by adding settings such as extended publishing for more data points, or connector for OPC UA observability settings.

1. To confirm that the Akri instance properly connected to the connector for OPC UA, run the following command. Replace the placeholder with the name of the Akri instance that was included in the output of the previous command:

    ```bash
    kubectl get akrii <AKRI_INSTANCE_NAME> -n azure-iot-operations -o json
    ```

    The command output includes a section that looks like the following example. The snippet shows the Akri instance `brokerProperties` values and confirms that the connector for OPC UA is connected.

    ```json
    "spec": {
    
            "brokerProperties": {
                "ApplicationUri": "Boiler #2",
                "AssetEndpointProfile": "{\"spec\":{\"uuid\":\"opc-ua-broker-opcplc-000000-azure-iot-operation\"……   
    ```
