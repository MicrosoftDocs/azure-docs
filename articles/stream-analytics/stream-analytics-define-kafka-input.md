---
title: Ingest Kafka streaming data with Azure Stream Analytics
description: Configure Kafka as an input source for Azure Stream Analytics to ingest streaming data from your Kafka clusters, including managed identity and security setup.
author: AliciaLiMicrosoft
ms.author: ali
ms.service: azure-stream-analytics
ms.custom:
  - ignite-2024
ms.topic: how-to
ms.date: 08/25/2026
ai-usage: ai-assisted

#customer intent: As a data engineer, I want to configure Kafka as an input source for an Azure Stream Analytics job so that I can ingest streaming data from my Kafka clusters.
---

# Stream data from Kafka into Azure Stream Analytics

Apache Kafka is an open-source distributed streaming platform that apps use to publish and subscribe to streams of records as they occur. It's commonly used for messaging, website activity tracking, metrics, log aggregation, and stream processing.

If your data flows through Kafka clusters, you can connect Azure Stream Analytics directly to those clusters to ingest and process that data without building a custom consumer. The Kafka input is low code, fully managed by Microsoft to meet business compliance standards, and backward compatible with client versions starting from 0.10. You can connect to Kafka clusters inside a virtual network or with a public endpoint, by using existing Kafka configuration conventions. Supported compression types are None, Gzip, Snappy, LZ4, and Zstd.

This article shows you how to configure a Kafka cluster as an input source for an Azure Stream Analytics job.


## Set up Kafka as an input source

This article shows how to set up Kafka as an input source for Azure Stream Analytics. It covers the following steps:

1. Create an Azure Stream Analytics job.
1. Configure your Azure Stream Analytics job to use managed identity if you're using mTLS or SASL_SSL security protocols.
1. Configure Azure Key Vault if you're using mTLS or SASL_SSL security protocols.
1. Upload certificates as secrets into Azure Key Vault.
1. Grant Azure Stream Analytics permissions to access the uploaded certificate.
1. Configure Kafka input in your Azure Stream Analytics job.

> [!NOTE]
> Depending on how your Kafka cluster is configured and the type of Kafka cluster you're using, some of these steps might not apply to you. For example, if you're using Confluent Cloud Kafka, you don't need to upload a certificate to use the Kafka connector. If your Kafka cluster is inside a virtual network (VNet) or behind a firewall, you might have to configure your Azure Stream Analytics job to access your Kafka topic by using a private link or a dedicated networking configuration.

## Configure the Kafka input

Configure the Kafka input so that your Azure Stream Analytics job can connect to your Kafka cluster and read from a topic.

> [!IMPORTANT]
> To configure your Kafka cluster as an input, the timestamp type of the input topic should be **LogAppendTime**. The only timestamp type Azure Stream Analytics supports is **LogAppendTime**.
> Azure Stream Analytics supports only numerical decimal format.

1. In your Azure Stream Analytics job, add a Kafka input.
1. Set each input property by using the values described in the following table:

   | Property name | Description |
   | --- | --- |
   | Input/Output Alias | A friendly name used in queries to reference your input or output. |
   | Bootstrap server addresses | A list of host/port pairs to connect to the Kafka cluster. |
   | Kafka topic | A named, ordered, and partitioned stream of data that supports the publish-subscribe and event-driven processing of messages. |
   | Security Protocol | How you want to connect to your Kafka cluster. Azure Stream Analytics supports mTLS, SASL_SSL, SASL_PLAINTEXT, or None. |
   | Consumer Group ID | The name of the Kafka consumer group that the input should be a part of. Azure Stream Analytics assigns it automatically if you don't provide one. |
   | Event Serialization format | The serialization format (JSON, CSV, Avro, Parquet, and Protobuf) of the incoming data stream. |

1. Save the input configuration.

## Set up authentication and encryption

Set up authentication and encryption to secure the connection between your Azure Stream Analytics job and your Kafka cluster. For a step-by-step tutorial on connecting to Confluent Cloud Kafka, see [Stream data from Confluent Cloud Kafka with Azure Stream Analytics](confluent-kafka-input.md) for input and [Stream data from Azure Stream Analytics into Confluent Cloud](confluent-kafka-output.md) for output.

> [!IMPORTANT]
> Confluent Cloud supports authentication by using API Keys, OAuth, or SAML single sign-on (SSO). Azure Stream Analytics doesn't support OAuth or SAML single sign-on (SSO) authentication.
> You can connect to Confluent Cloud by using an API Key with topic-level access via the SASL_SSL security protocol.

1. Choose one of the four supported security protocols that matches your Kafka cluster, as described in the following table:

   | Property name | Description |
   | --- | --- |
   | mTLS | Encryption and authentication. Supports PLAIN, SCRAM-SHA-256, and SCRAM-SHA-512 security mechanisms. |
   | SASL_SSL | Combines two different security mechanisms, SASL (Simple Authentication and Security Layer) and Secure Sockets Layer (SSL), to ensure both authentication and encryption are in place for data transmission. The SASL_SSL protocol supports PLAIN, SCRAM-SHA-256, and SCRAM-SHA-512 security mechanisms. |
   | SASL_PLAINTEXT | Standard authentication with a username but no encryption. |
   | None | No authentication and encryption. |

1. Configure the credentials for the selected protocol in your Azure Stream Analytics job.

## Integrate with Azure Key Vault

Azure Stream Analytics integrates with Azure Key Vault to access stored secrets needed for authentication and encryption when you use mTLS or SASL_SSL security protocols. Your Azure Stream Analytics job connects to your Azure Key Vault by using managed identity to ensure a secure connection and avoid the exfiltration of secrets. Certificates are stored as secrets in the key vault and must be in PEM format. To integrate your Azure Stream Analytics job with Azure Key Vault, complete the following tasks, which the following sections describe in detail.

> [!NOTE]
> When you use trust store certificates with mTLS or SASL_SSL security protocols, you must have Azure Key Vault and managed identity configured for your Azure Stream Analytics job.
> Check your key vault's network settings to ensure **Allow public access from all networks** is selected. If your key vault is in a VNet or allows access only from specific networks, you must inject your Azure Stream Analytics job into a VNet containing the key vault, or inject your Azure Stream Analytics job into a VNet and then connect your key vault to the VNet containing job by using service endpoints.

1. Configure the key vault with the required permissions.
1. Upload your certificate to the key vault as a secret.
1. Configure managed identity for your Azure Stream Analytics job.
1. Grant your Stream Analytics job permission to access the certificate in the key vault.

## Configure the key vault with permissions

To create a key vault resource, see [Quickstart: Create a key vault using the Azure portal](/azure/key-vault/general/quick-create-portal). You need **Key Vault Administrator** access to your key vault to upload certificates. To grant admin access, follow these steps:

> [!NOTE]
> You need **Owner** permissions to grant other key vault permissions.

1. Select **Access control (IAM)**.
1. Select **Add** > **Add role assignment** to open the **Add role assignment** page.
1. Assign the role by using the following configuration:

   | Setting | Value |
   | --- | --- |
   | Role | Key Vault Administrator |
   | Assign access to | User, group, or service principal |
   | Members | \<Your account information or email> |


## Upload the certificate to the key vault

Ensure you have Azure CLI configured locally with PowerShell. For guidance on setting up Azure CLI, see [Get started with Azure CLI](/cli/azure/get-started-with-azure-cli#how-to-sign-into-the-azure-cli).

The following steps upload the certificate as a secret to your key vault.

> [!IMPORTANT]
> You must have **Key Vault Administrator** permissions to your key vault for this command to work properly.
> You must upload the certificate as a secret. You must use Azure CLI to upload certificates as secrets to your key vault.
> Your Azure Stream Analytics job fails when the certificate used for authentication expires. To resolve this issue, update or replace the certificate in your key vault and restart your Azure Stream Analytics job.

1. Sign in to Azure CLI.

   ```powershell
   az login
   ```

1. Connect to the subscription that contains your key vault.

   ```powershell
   az account set --subscription <subscription name>
   ```

1. Upload the certificate as a secret. Replace `<your key vault>` with the name of the key vault, `<name of the secret>` with any name you want to give the secret, and `<file path to certificate>` with the path to your certificate file. You can right-click and copy the path to the certificate.

   ```powershell
   az keyvault secret set --vault-name <your key vault> --name <name of the secret> --file <file path to certificate>
   ```

   For example:

   ```powershell
   az keyvault secret set --vault-name mykeyvault --name kafkasecret --file C:\Users\Downloads\certificatefile.pem
   ```

## Configure managed identity

Azure Stream Analytics requires managed identity to access the key vault. Configure your Azure Stream Analytics job to use managed identity by going to the **Managed Identity** tab under **Configure**.

To configure managed identity, follow these steps:

1. Select the **Managed Identity** tab under **Configure**.

   :::image type="content" source="./media/common/stream-analytics-enable-managed-identity-new.png" alt-text="Screenshot showing how to configure managed identity for an Azure Stream Analytics job." lightbox="./media/common/stream-analytics-enable-managed-identity-new.png":::

1. Select **Switch Identity**, and select the identity to use with the job: system-assigned identity or user-assigned identity.
1. For user-assigned identity, select the subscription where your user-assigned identity is located, and select the name of your identity.
1. Review and select **Save**.

## Grant the Stream Analytics job permissions to access the certificate

For your Azure Stream Analytics job to read the secret in your key vault, the job must have permission to access the key vault.

To grant permissions to your Stream Analytics job, follow these steps:

1. Select **Access control (IAM)**.
1. Select **Add** > **Add role assignment** to open the **Add role assignment** page.
1. Assign the role by using the following configuration:

   | Setting | Value |
   | --- | --- |
   | Role | Key Vault Secrets User |
   | Managed identity | Stream Analytics job for System-assigned managed identity or User-assigned managed identity |
   | Members | \<Name of your Stream Analytics job> or \<name of user-assigned identity> |

## Kafka input limitations and considerations

If your Kafka cluster is inside a virtual network or behind a firewall, configure your Azure Stream Analytics job to access your Kafka topic by using a private link or a dedicated networking configuration. For more information, see [Run your Azure Stream Analytics job in an Azure Virtual Network](run-job-in-virtual-network.md).

Consider the following limitations when you use Kafka as an input source:

1. When you configure your Azure Stream Analytics job to use Virtual Network/SWIFT, configure the job with at least six streaming units or one V2 streaming unit.
1. When you use mTLS or SASL_SSL with Azure Key Vault, you must convert your Java Key Store to PEM format.
1. The minimum version of Kafka that Azure Stream Analytics can connect to is version 0.10.
1. Azure Stream Analytics doesn't support authentication to Confluent Cloud by using OAuth or SAML single sign-on (SSO). You must use an API Key via the SASL_SSL protocol.

For direct help with the Azure Stream Analytics Kafka input, contact [askasa@microsoft.com](mailto:askasa@microsoft.com).

## Related content

* [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)
* [Stream data from Confluent Cloud Kafka with Azure Stream Analytics](confluent-kafka-input.md)
* [Stream data from Azure Stream Analytics into Confluent Cloud](confluent-kafka-output.md)
