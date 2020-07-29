---
title: Troubleshoot connectivity issues - Azure Event Hubs | Microsoft Docs
description: This article provides information on troubleshooting connectivity issues with Azure Event Hubs. 
services: event-hubs
documentationcenter: na
author: spelluru

ms.service: event-hubs
ms.devlang: na
ms.topic: article
ms.date: 05/27/2020
ms.author: spelluru

---

# Troubleshoot connectivity issues - Azure Event Hubs
There are various reasons for client applications not able to connect to an event hub. The connectivity issues that you experience may be permanent or transient. If the issue happens all the time (permanent), you may want to check the connection string, your organization's firewall settings, IP firewall settings, network security settings (service endpoints, private endpoints, etc.), and more. For transient issues, upgrading to latest version of the SDK, running commands to check dropped packets, and obtaining network traces may help with troubleshooting the issues. 

This article provides tips for troubleshooting connectivity issues with Azure Event Hubs. 

## Troubleshoot permanent connectivity issues
If the application isn't able to connect to the event hub at all, follow steps from this section to troubleshoot the issue. 

### Check if there is a service outage
Check for the Azure Event Hubs service outage on the [Azure service status site](https://azure.microsoft.com/status/).

### Verify the connection string 
Verify that the connection string you are using is correct. See [Get connection string](event-hubs-get-connection-string.md) to get the connection string using the Azure portal, CLI, or PowerShell. 

For Kafka clients, verify that producer.config or consumer.config files are configured properly. For more information, see [Send and receive messages with Kafka in Event Hubs](event-hubs-quickstart-kafka-enabled-event-hubs.md#send-and-receive-messages-with-kafka-in-event-hubs).

### Check if the ports required to communicate with Event Hubs are blocked by organization's firewall
Verify that ports used in communicating with Azure Event Hubs aren't blocked on your organization's firewall. See the following table for the outbound ports you need to open to communicate with Azure Event Hubs. 

| Protocol | Ports | Details | 
| -------- | ----- | ------- | 
| AMQP | 5671 and 5672 | See [AMQP protocol guide](../service-bus-messaging/service-bus-amqp-protocol-guide.md) | 
| HTTP, HTTPS | 80, 443 |  |
| Kafka | 9093 | See [Use Event Hubs from Kafka applications](event-hubs-for-kafka-ecosystem-overview.md)

Here is a sample command that checks whether the 5671 port is blocked.

```powershell
tnc <yournamespacename>.servicebus.windows.net -port 5671
```

On Linux:

```shell
telnet <yournamespacename>.servicebus.windows.net 5671
```

### Verify that IP addresses are allowed in your corporate firewall
When you are working with Azure, sometimes you have to allow specific IP address ranges or URLs in your corporate firewall or proxy to access all Azure services you are using or trying to use. Verify that the traffic is allowed on IP addresses used by Event Hubs. For IP addresses used by Azure Event Hubs: see [Azure IP Ranges and Service Tags - Public Cloud](https://www.microsoft.com/download/details.aspx?id=56519) and [Service tag - EventHub](network-security.md#service-tags).

Also, verify that the IP address for your namespace is allowed. To find the right IP addresses to allow for your connections, follow these steps:

1. Run the following command from a command prompt: 

    ```
    nslookup <YourNamespaceName>.servicebus.windows.net
    ```
2. Note down the IP address returned in `Non-authoritative answer`. The only time it would change is if you restore the namespace on to a different cluster.

If you use the zone redundancy for your namespace, you need to do a few additional steps: 

1. First, you run nslookup on the namespace.

    ```
    nslookup <yournamespace>.servicebus.windows.net
    ```
2. Note down the name in the **non-authoritative answer** section, which is in one of the following formats: 

    ```
    <name>-s1.cloudapp.net
    <name>-s2.cloudapp.net
    <name>-s3.cloudapp.net
    ```
3. Run nslookup for each one with suffixes s1, s2, and s3 to get the IP addresses of all three instances running in three availability zones. 

### Check if the application needs to be running in a specific subnet of a vnet
Confirm that your application is running in a virtual network subnet that has access to the namespace. If it's not, run the application in the subnet that has access to the namespace or add the IP address of the machine on which application is running to the [IP firewall](event-hubs-ip-filtering.md). 

When you create a virtual network service endpoint for an event hub namespace, the namespace accepts traffic only from the subnet that's bound to the service endpoint. There is an exception to this behavior. You can add specific IP addresses in the IP firewall to enable access to the Event Hub public endpoint. For more information, see [Network service endpoints](event-hubs-service-endpoints.md).

### Check the IP Firewall settings for your namespace
Check that your IP address of the machine on which the application is running isn't blocked by the IP firewall.  

By default, Event Hubs namespaces are accessible from internet as long as the request comes with valid authentication and authorization. With IP firewall, you can restrict it further to only a set of IPv4 addresses or IPv4 address ranges in [CIDR (Classless Inter-Domain Routing)](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation.

The IP firewall rules are applied at the Event Hubs namespace level. Therefore, the rules apply to all connections from clients using any supported protocol. Any connection attempt from an IP address that does not match an allowed IP rule on the Event Hubs namespace is rejected as unauthorized. The response does not mention the IP rule. IP filter rules are applied in order, and the first rule that matches the IP address determines the accept or reject action.

For more information, see [Configure IP firewall rules for an Azure Event Hubs namespace](event-hubs-ip-filtering.md). To check whether you have IP filtering, virtual network, or certificate chain issues, see [Troubleshoot network related issues](#troubleshoot-network-related-issues).

#### Find the IP addresses blocked by IP Firewall
Enable diagnostic logs for [Event Hubs virtual network connection events](event-hubs-diagnostic-logs.md#event-hubs-virtual-network-connection-event-schema) by following instructions in the [Enable diagnostic logs](event-hubs-diagnostic-logs.md#enable-diagnostic-logs). You will see the IP address for the connection that's denied.

```json
{
    "SubscriptionId": "0000000-0000-0000-0000-000000000000",
    "NamespaceName": "namespace-name",
    "IPAddress": "1.2.3.4",
    "Action": "Deny Connection",
    "Reason": "IPAddress doesn't belong to a subnet with Service Endpoint enabled.",
    "Count": "65",
    "ResourceId": "/subscriptions/0000000-0000-0000-0000-000000000000/resourcegroups/testrg/providers/microsoft.eventhub/namespaces/namespace-name",
    "Category": "EventHubVNetConnectionEvent"
}
```

### Check if the namespace can be accessed using only a private endpoint
If the Event Hubs namespace is configured to be accessible only via private endpoint, confirm that the client application is accessing the namespace over the private endpoint. 

[Azure Private Link service](../private-link/private-link-overview.md) enables you to access Azure Event Hubs over a **private endpoint** in your virtual network. A private endpoint is a network interface that connects you privately and securely to a service powered by Azure Private Link. The private endpoint uses a private IP address from your VNet, effectively bringing the service into your VNet. All traffic to the service can be routed through the private endpoint, so no gateways, NAT devices, ExpressRoute or VPN connections, or public IP addresses are needed. Traffic between your virtual network and the service traverses over the Microsoft backbone network, eliminating exposure from the public Internet. You can connect to an instance of an Azure resource, giving you the highest level of granularity in access control.

For more information, see [Configure private endpoints](private-link-service.md). 

### Troubleshoot network-related issues
To troubleshoot network-related issues with Event Hubs, follow these steps: 

Browse to or [wget](https://www.gnu.org/software/wget/) `https://<yournamespacename>.servicebus.windows.net/`. It helps with checking whether you have IP filtering or virtual network or certificate chain issues (most common when using Java SDK).

An example of **successful message**:

```xml
<feed xmlns="http://www.w3.org/2005/Atom"><title type="text">Publicly Listed Services</title><subtitle type="text">This is the list of publicly-listed services currently available.</subtitle><id>uuid:27fcd1e2-3a99-44b1-8f1e-3e92b52f0171;id=30</id><updated>2019-12-27T13:11:47Z</updated><generator>Service Bus 1.1</generator></feed>
```

An example of **failure error message**:

```json
<Error>
    <Code>400</Code>
    <Detail>
        Bad Request. To know more visit https://aka.ms/sbResourceMgrExceptions. . TrackingId:b786d4d1-cbaf-47a8-a3d1-be689cda2a98_G22, SystemTracker:NoSystemTracker, Timestamp:2019-12-27T13:12:40
    </Detail>
</Error>
```

## Troubleshoot transient connectivity issues
If you are experiencing intermittent connectivity issues, go through the following sections for troubleshooting tips. 

### Use the latest version of the client SDK
Some of the transient connectivity issues may have been fixed in the later versions of the SDK than what you are using. Ensure that you are using the latest version of client SDKs in your applications. SDKs are continuously improved with new/updated features and bug fixes, so always test with latest package. Check the release notes for issues that are fixed and features added/updated. 

For information about client SDKs, see the [Azure Event Hubs - Client SDKs](sdks.md) article. 

### Run the command to check dropped packets
When there are intermittent connectivity issues, run the following command to check if there are any dropped packets. This command will try to establish 25 different TCP connections every 1 second with the service. Then, you can check how many of them succeeded/failed and also see TCP connection latency. You can download the `psping` tool from [here](/sysinternals/downloads/psping).

```shell
.\psping.exe -n 25 -i 1 -q <yournamespacename>.servicebus.windows.net:5671 -nobanner     
```
You can use equivalent commands if you're using other tools such as `tnc`, `ping`, and so on. 

Obtain a network trace if the previous steps don't help and analyze it using tools such as [Wireshark](https://www.wireshark.org/). Contact [Microsoft Support](https://support.microsoft.com/) if needed. 

### Service upgrades/restarts
Transient connectivity issues may occur because of backend service upgrades and restarts. When they occur, you may see the following symptoms: 

- There may be a drop in incoming messages/requests.
- The log file may contain error messages.
- The applications may be disconnected from the service for a few seconds.
- Requests may be momentarily throttled.

If the application code utilizes SDK, the retry policy is already built in and active. The application will reconnect without significant impact to the application/workflow. Otherwise, retry connecting to the service after a couple of minutes to see if the issues go away. 

## Next steps
See the following articles:

* [Troubleshoot authentication and authorization issues](troubleshoot-authentication-authorization.md)
