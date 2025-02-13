---
title: Migrate to Azure Event Hubs for Apache Kafka
description: This article explains how to migrate clients from Apache Kafka to Azure Event Hubs. 
ms.topic: article
ms.date: 12/18/2024
---

# Migrate to Azure Event Hubs for Apache Kafka Ecosystems
Azure Event Hubs exposes an Apache Kafka endpoint, which enables you to connect to Event Hubs using the Kafka protocol. By making minimal changes to your existing Kafka application, you can connect to Azure Event Hubs and reap the benefits of the Azure ecosystem. Event Hubs works with many of your existing Kafka applications, including MirrorMaker. For more information, see [Event Hubs for Apache Kafka](azure-event-hubs-apache-kafka-overview.md)

## Pre-migration 

### Create an Azure account
If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

### Create an Event Hubs namespace
 To create an Event Hubs namespace and an event hub, Follow step-by-step instructions in the [Create an event hub](event-hubs-create.md) article. 

### Connection string
Follow steps from the article: [Get connection string from the portal](event-hubs-get-connection-string.md#azure-portal). And, note down the connection string for later use. 

### Fully qualified domain name (FQDN)
You might also need the FQDN that points to your Event Hubs namespace. The FQDN can be found within your connection string as follows:

`Endpoint=sb://`**`mynamespace.servicebus.windows.net`**`/;SharedAccessKeyName=XXXXXX;SharedAccessKey=XXXXXX`

If your Event Hubs namespace is deployed on a non-public cloud, your domain name might differ (for example, \*.servicebus.chinacloudapi.cn, \*.servicebus.usgovcloudapi.net, or \*.servicebus.cloudapi.de).

## Migration 

### Update your Kafka client configuration

To connect to a Kafka-enabled event hub, you need to update the Kafka client configurations. If you're having trouble finding yours, try searching for where `bootstrap.servers` is set in your application.

Insert the following configs wherever makes sense in your application. Make sure to update the `bootstrap.servers` and `sasl.jaas.config` values to direct the client to your Event Hubs Kafka endpoint with the correct authentication. 

```
bootstrap.servers={MYNAMESPACE}.servicebus.windows.net:9093
request.timeout.ms=60000
security.protocol=SASL_SSL
sasl.mechanism=PLAIN
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username="$ConnectionString" password="{CONNECTION STRING TO YOUR NAMESPACE}";
``` 

If `sasl.jaas.config` isn't a supported configuration in your framework, find the configurations that are used to set the Simple Authentication and Security Layer (SASL) username and password and use them instead. Set the username to `$ConnectionString` and the password to your Event Hubs connection string.

## Post-migration
Run your Kafka application that sends events to the event hub. Then, verify that the event hub receives the events using the Azure portal. On the **Overview** page of your Event Hubs namespace, switch to the **Messages** view in the **Metrics** section. Refresh the page to update the chart. It might take a few seconds for it to show that the messages are received. 

[![Verify that the event hub received the messages](./media/getstarted-dotnet-standard-send-v2/verify-messages-portal.png)](./media/getstarted-dotnet-standard-send-v2/verify-messages-portal.png#lightbox)


## Next steps
To learn more about Event Hubs and Event Hubs for Kafka, see the following articles:  

- [Apache Kafka troubleshooting guide for Event Hubs](apache-kafka-troubleshooting-guide.md)
- [Frequently asked questions - Event Hubs for Apache Kafka](apache-kafka-frequently-asked-questions.yml)
- [Apache Kafka developer guide for Azure Event Hubs](apache-kafka-developer-guide.md)
- [Recommended configurations](apache-kafka-configurations.md)