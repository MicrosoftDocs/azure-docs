---
title: Migrate to Azure Event Hubs for Apache Kafka
description: This article shows how consumers and producers that use different protocols (AMQP, Apache Kafka, and HTTPS) can exchange events when using Azure Event Hubs. 
ms.topic: article
ms.date: 06/23/2020
---

# Migrate to Azure Event Hubs for Apache Kafka Ecosystems
Azure Event Hubs exposes an Apache Kafka endpoint, which enables you to connect to Event Hubs using the Kafka protocol. By making minimal changes to your existing Kafka application, you can connect to Azure Event Hubs and reap the benefits of the Azure ecosystem. Event Hubs for Kafka support [Apache Kafka version 1.0](https://kafka.apache.org/10/documentation.html) and later.

## Pre-migration 

### Create an Azure account
If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

### Create an Event Hubs namespace
Follow step-by-step instructions in the [Create an event hub](event-hubs-create.md) article to create an Event Hubs namespace and an event hub. 

### Connection string
Follow steps from the [Get connection string from the portal](event-hubs-get-connection-string.md#get-connection-string-from-the-portal) article. And, note down the connection string for later use. 

### Fully qualified domain name (FQDN)
You may also need the FQDN that points to your Event Hub namespace. The FQDN can be found within your connection string as follows:

`Endpoint=sb://`**`mynamespace.servicebus.windows.net`**`/;SharedAccessKeyName=XXXXXX;SharedAccessKey=XXXXXX`

If your Event Hubs namespace is deployed on a non-public cloud, your domain name may differ (for example, \*.servicebus.chinacloudapi.cn, \*.servicebus.usgovcloudapi.net, or \*.servicebus.cloudapi.de).

## Migration 

### Update your Kafka client configuration

To connect to a Kafka-enabled Event Hub, you'll need to update the Kafka client configurations. If you're having trouble finding yours, try searching for where `bootstrap.servers` is set in your application.

Insert the following configs wherever makes sense in your application. Make sure to update the `bootstrap.servers` and `sasl.jaas.config` values to direct the client to your Event Hubs Kafka endpoint with the correct authentication. 

```
bootstrap.servers={MYNAMESPACE}.servicebus.windows.net:9093
request.timeout.ms=60000
security.protocol=SASL_SSL
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="$ConnectionString" password="{CONNECTION STRING TO YOUR NAMESPACE}";
``` 

If `sasl.jaas.config` isn't a supported configuration in your framework, find the configurations that are used to set the SASL username and password and use them instead. Set the username to `$ConnectionString` and the password to your Event Hubs connection string.

## Post-migration
Run your Kafka application that sends events to the event hub. Then, verify that the event hub receives the events using the Azure portal. On the **Overview** page of your Event Hubs namespace, switch to the **Messages** view in the **Metrics** section. Refresh the page to update the chart. It may take a few seconds for it to show that the messages have been received. 

[![Verify that the event hub received the messages](./media/getstarted-dotnet-standard-send-v2/verify-messages-portal.png)](./media/getstarted-dotnet-standard-send-v2/verify-messages-portal.png#lightbox)


## Next steps
To learn more about Event Hubs and Event Hubs for Kafka, see the following articles:  

- [Apache Kafka troubleshooting guide for Event Hubs](apache-kafka-troubleshooting-guide.md)
- [Frequently asked questions - Event Hubs for Apache Kafka](apache-kafka-frequently-asked-questions.md)
- [Apache Kafka developer guide for Azure Event Hubs](apache-kafka-developer-guide.md)
- [Recommended configurations](https://github.com/Azure/azure-event-hubs-for-kafka/blob/master/CONFIGURATION.md)