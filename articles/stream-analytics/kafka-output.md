---
title: Stream data from Azure Stream Analytics into Kafka
description: Learn about setting up Azure Stream Analytics as a producer to kafka
author: enkrumah
ms.author: ebnkruma
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 11/09/2023
---

# Kafka output from Azure Stream Analytics (Preview)

Azure Stream Analytics allows you to connect directly to Kafka clusters as a producer to output data. The solution is low code and entirely managed by the Azure Stream Analytics team at Microsoft, allowing it to meet business compliance standards. The ASA Kafka output is backward compatible and supports all versions with the latest client release starting from version 0.10. Users can connect to Kafka clusters inside a VNET and Kafka clusters with a public endpoint, depending on the configurations. The configuration relies on existing Kafka configuration conventions.
Supported compression types are None, Gzip, Snappy, LZ4, and Zstd.

## Configuration
The following table lists the property names and their description for creating a Kafka output: 
 
| Property name                | Description                                                                                                             |
|------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| Output Alias            | A friendly name used in queries to reference your output                                                      |
| Bootstrap server addresses   | A list of host/port pairs to establish the connection to the Kafka cluster.                                  |
| Kafka topic                  | A named, ordered, and partitioned stream of data that allows for the publish-subscribe and event-driven processing of messages. |
| Security Protocol            | How you want to connect to your Kafka cluster. Azure Stream Analytics supports mTLS, SASL_SSL, SASL_PLAINTEXT or None. |
| Event Serialization format   | The serialization format (JSON, CSV, Avro) of the outgoing data stream.                                        |
| Partition key                | Azure Stream Analytics assigns partitions using round partitioning.                                                     |
| Kafka event compression type | The compression type used for outgoing data streams, such as Gzip, Snappy, Lz4, Zstd, or None.                            | 

## Authentication and encryption

You can use four types of security protocols to connect to your Kafka clusters:

> [!NOTE]
> For SASL_SSL and SASL_PLAINTEXT, Azure Stream Analytics supports only PLAIN SASL mechanism.
> You must upload certificates as secrets to key vault using Azure CLI.

|Property name   |Description   |
|----------|-----------|
|mTLS     |encryption and authentication       |
|SASL_SSL |It combines two different security mechanisms - SASL (Simple Authentication and Security Layer) and SSL (Secure Sockets Layer) - to ensure both authentication and encryption are in place for data transmission. The mechanism supported is PLAIN. The SASL_SSL protocol doesn't support SCRAM. |
|SASL_PLAINTEXT |standard authentication with username and password without encryption |
|None |The serialization format (JSON, CSV, Avro, Parquet) of the incoming data stream. |


> [!IMPORTANT]
> Confluent Cloud supports authentication using API Keys, OAuth, or SAML single sign-on (SSO). Azure Stream Analytics doesn't support OAuth or SAML single sign-on (SSO) authentication.
> You can connect to the confluent cloud using an API Key with topic-level access via the SASL_SSL security protocol.

For a step-by-step tutorial on connecting to confluent cloud kakfa, visit the documentation: 

* Confluent cloud kafka input: [Stream data from confluent cloud Kafka with Azure Stream Analytics](confluent-kafka-input.md)
* Confluent cloud kafka output: [Stream data from Azure Stream Analytics into confluent cloud](confluent-kafka-output.md)


## Key vault integration

> [!NOTE]
> When using trust store certificates with mTLS or SASL_SSL security protocols, you must have Azure Key vault and managed identity configured for your Azure Stream Analytics job.
>

Azure Stream Analytics integrates seamlessly with Azure Key vault to access stored secrets needed for authentication and encryption when using mTLS or SASL_SSL security protocols. Your Azure Stream Analytics job connects to your Azure Key vault using managed identity to ensure a secure connection and avoid the exfiltration of secrets.
Certificates are stored as secrets in the key vault and must be in PEM format.

### Configure Key vault with permissions

You can create a key vault resource by following the documentation [Quickstart: Create a key vault using the Azure portal](../key-vault/general/quick-create-portal.md)
To upload certificates, you must have "**Key Vault Administrator**"  access to your Key vault. Follow the following to grant admin access.

> [!NOTE]
> You must have "**Owner**" permissions to grant other key vault permissions.

1. Select **Access control (IAM)**.

1. Select **Add** > **Add role assignment** to open the **Add role assignment** page.

1. Assign the role using the following configuration:

 | Setting | Value |
 | --- | --- |
 | Role | Key Vault Administrator |
 | Assign access to | User, group, or service principal |
 | Members | \<Your account information or email> |


### Upload Certificate to Key vault via Azure CLI

> [!IMPORTANT]
> You must have "**Key Vault Administrator**" permissions access to your Key vault for this command to work properly
> You must upload the certificate as a secret. You must use Azure CLI to upload certificates as secrets to your key vault.
> Your Azure Stream Analytics job will fail when the certificate used for authentication expires. To resolve this, you must update/replace the certificate in your key vault and restart your Azure Stream Analytics job.

Make sure you have Azure CLI configured locally with PowerShell.
You can visit this page to get guidance on setting up Azure CLI: [Get started with Azure CLI](https://learn.microsoft.com/cli/azure/get-started-with-azure-cli#how-to-sign-into-the-azure-cli)

**Login to Azure CLI:**
```PowerShell
az login
```

**Connect to your subscription containing your key vault:**
```PowerShell
az account set --subscription <subscription name>
```

**The following command can upload the certificate as a secret to your key vault:**

The `<your key vault>` is the name of the key vault you want to upload the certificate to. `<name of the secret>` is any name you want to give to your secret and how it shows up in the key vault. `<file path to certificate>` is the path to where the certificate your certificate is located. You can right-click and copy the path to the certificate.

```PowerShell
az keyvault secret set --vault-name <your key vault> --name <name of the secret> --file <file path to certificate>
```
For example:

```PowerShell
az keyvault secret set --vault-name mykeyvault --name kafkasecret --file C:\Users\Downloads\certificatefile.pem
```


### Configure Managed identity
Azure Stream Analytics requires you to configure managed identity to access key vault.
You can configure your ASA job to use managed identity by navigating to the **Managed Identity** tab on the left side under **Configure**.

:::image type="content" source="./media/common/stream-analytics-enable-managed-identity-new.png" alt-text="Screenshot showing how to configure managed identity for an ASA job." lightbox="./media/common/stream-analytics-enable-managed-identity-new.png" :::

1.	Click on the **managed identity tab** under **configure**.
2.	Select **Switch Identity** and select the identity to use with the job: system-assigned identity or user-assigned identity.
3.	For user-assigned identity, select the subscription where your user-assigned identity is located and select the name of your identity.
4.	Review and **save**.

### Grant the Stream Analytics job permissions to access the certificate in the key vault

For your Azure Stream Analytics job to read the secret in your key vault, the job must have permission to access the key vault.
Use the following steps to grant special permissions to your stream analytics job: 

1. Select **Access control (IAM)**.

1. Select **Add** > **Add role assignment** to open the **Add role assignment** page.

1. Assign the role using the following configuration:

 | Setting | Value |
 | --- | --- |
 | Role | Key vault secrets user |
 | Managed identity | Stream Analytics job for System-assigned managed identity or User-assigned managed identity |
 | Members | \<Name of your Stream Analytics job> or \<name of user-assigned identity> |

   
### VNET integration

If your Kafka is inside a virtual network (VNET) or behind a firewall, you must configure your Azure Stream Analytics job to access your Kafka topic.
Visit the [Run your Azure Stream Analytics job in an Azure Virtual Network documentation](../stream-analytics/run-job-in-virtual-network.md) for more information.       


### Limitations
* When configuring your Azure Stream Analytics jobs to use VNET/SWIFT, your job must be configured with at least six (6) streaming units or one (1) V2 streaming unit. 
* When using mTLS or SASL_SSL with Azure Key vault, you must convert your Java Key Store to PEM format. 
* The minimum version of Kafka you can configure Azure Stream Analytics to connect to is version 0.10.
* Azure Stream Analytics does not support authentication to confluent cloud using OAuth or SAML single sign-on (SSO). You must use API Key via the SASL_SSL protocol

> [!NOTE]
> For direct help with using the Azure Stream Analytics Kafka output, please reach out to [askasa@microsoft.com](mailto:askasa@microsoft.com).
> 


## Next steps
> [!div class="nextstepaction"]
> [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)
> [Stream data from confluent cloud Kafka with Azure Stream Analytics](confluent-kafka-input.md)
> [Stream data from Azure Stream Analytics into confluent cloud](confluent-kafka-output.md)

<!--Link references-->
[stream.analytics.developer.guide]: ../stream-analytics-developer-guide.md
[stream.analytics.scale.jobs]: stream-analytics-scale-jobs.md
[stream.analytics.introduction]: stream-analytics-introduction.md
[stream.analytics.get.started]: stream-analytics-real-time-fraud-detection.md
[stream.analytics.query.language.reference]: /stream-analytics-query/stream-analytics-query-language-reference
