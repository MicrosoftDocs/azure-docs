---
title: Stream data from Azure Stream Analytics into Kafka
description: Learn about setting up Azure Stream Analytics as a producer to kafka
author: enkrumah
ms.author: ebnkruma
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 09/26/2023
---

# Kafka output from Azure Stream Analytics (Preview)

Azure Stream Analytics allows you to connect directly to Kafka clusters as a producer to output data. The solution is low code and entirely managed by the Azure Stream Analytics team at Microsoft, allowing it to meet business compliance standards. The Kafka Adapters are backward compatible and support all versions with the latest client release starting from version 0.10. Users can connect to Kafka clusters inside a VNET and Kafka clusters with a public endpoint, depending on the configurations. The configuration relies on existing Kafka configuration conventions.
Supported compression types are None, Gzip, Snappy, LZ4, and Zstd.

## Authentication and encryption

You can use four types of security protocols to connect to your Kafka clusters:

|Property name   |Description   |
|----------|-----------|
|mTLS     |encryption and authentication       |
|SASL_SSL |It combines two different security mechanisms - SASL (Simple Authentication and Security Layer) and SSL (Secure Sockets Layer) - to ensure both authentication and encryption are in place for data transmission.   |
|Kafka topic |A unit of your Kafka cluster you want to write events to. |
|SASL_PLAINTEXT |standard authentication with username and password without encryption |
|None |The serialization format (JSON, CSV, Avro, Parquet) of the incoming data stream. |


> [!IMPORTANT]
> Confluent Cloud supports authenticating using API Keys, OAuth, or SAML single sign-on (SSO). Azure Stream Analytics does not currently support these authentication options.
> 


### Key vault integration

> [!NOTE]
> When using trust store certificates with mTLS or SASL_SSL security protocols, you must have Azure Key vault and managed identity configured for your Azure Stream Analytics job.
> 
Azure Stream Analytics integrates seamlessly with Azure Key vault to access stored secrets needed for authentication and encryption when using mTLS or SASL_SSL security protocols. Your Azure Stream Analytics job connects to Azure Key vault using managed identity to ensure a secure connection and avoid the exfiltration of secrets.

You can store the certificates as Key vault certificates or Key vault secrets. Private keys are in PEM format.

### VNET integration
When configuring your Azure Stream Analytics job to connect to your Kafka clusters, depending on your configuration, you may have to configure your job to access your Kafka clusters, which are behind a firewall or inside a virtual network. You can visit the Azure Stream Analytics VNET documentation to learn more about configuring private endpoints to access resources inside a virtual network or behind a firewall.


### Configuration
The following table lists the property names and their description for creating a Kafka output: 
 
| Property name                | Description                                                                                                             |
|------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| Input/Output Alias            | A friendly name used in queries to reference your input or output                                                      |
| Bootstrap server addresses   | A list of host/port pairs to establish the connection to the Kafka cluster.                                  |
| Kafka topic                  | A unit of your Kafka cluster you want to write events to.                                                               |
| Security Protocol            | How you want to connect to your Kafka cluster. Azure Stream Analytics supports mTLS, SASL_SSL, SASL_PLAINTEXT or None. |
| Event Serialization format   | The serialization format (JSON, CSV, Avro) of the outgoing data stream.                                        |
| Partition key                | Azure Stream Analytics assigns partitions using round partitioning.                                                     |
| Kafka event compression type | The compression type used for outgoing data streams, such as Gzip, Snappy, Lz4, Zstd, or None.                            |            

### Limitations
* When configuring your Azure Stream Analytics jobs to use VNET/SWIFT, your job must be configured with at least six (6) streaming units. 
* When using mTLS or SASL_SSL with Azure Key vault, you must convert your Java Key Store to PEM format. 
* The minimum version of Kafka you can configure Azure Stream Analytics to connect to is version 0.10.

> [!NOTE]
> For direct help with using the Azure Stream Analytics Kafka adapter, please reach out to [askasa@microsoft.com](mailto:askasa@microsoft.com).
>

## Next steps
> [!div class="nextstepaction"]
> [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)

<!--Link references-->
[stream.analytics.developer.guide]: ../stream-analytics-developer-guide.md
[stream.analytics.scale.jobs]: stream-analytics-scale-jobs.md
[stream.analytics.introduction]: stream-analytics-introduction.md
[stream.analytics.get.started]: stream-analytics-real-time-fraud-detection.md
[stream.analytics.query.language.reference]: /stream-analytics-query/stream-analytics-query-language-reference
