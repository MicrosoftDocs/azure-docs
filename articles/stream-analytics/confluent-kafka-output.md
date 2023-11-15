---
title: Stream data from Azure Stream Analytics into confluent cloud kafka
description: Learn about how to set up an Azure Stream Analytics job as a producer to confluent cloud kafka
author: enkrumah
ms.author: ebnkruma
ms.service: stream-analytics
ms.topic: how-to
ms.date: 11/06/2023
---

# Stream data from Azure Stream Analytics into confluent cloud

This article describes how to connect your Azure Stream Analytics job directly to confluent cloud kafka as an output.


## Prerequisites

- You have a confluent cloud kafka cluster.
- You have an API Key file for your kafka cluster, which contains the API key to use as a username, API Secret to use as a password, and the Bootstrap server address.
- You have an Azure Stream Analytics job. You can create an Azure Stream Analytics job by following the documentation: [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)
- Your confluent cloud kafka cluster must be publicly accessible and not behind a firewall or secured in a virtual network.
- You should have an existing key vault. You can create a key vault resource by following the documentation [Quickstart: Create a key vault using the Azure portal](../key-vault/general/quick-create-portal.md)


## Configure Azure Stream Analytics to use managed identity

Azure Stream Analytics requires you to configure managed identity to access key vault.
You can configure your ASA job to use managed identity by navigating to the **Managed Identity** tab on the left side under **Configure**.

:::image type="content" source="./media/common/stream-analytics-enable-managed-identity-new.png" alt-text="Screenshot showing how to configure managed identity for an ASA job." lightbox="./media/common/stream-analytics-enable-managed-identity-new.png" :::

1.	Click on the **managed identity tab** under **configure**.
2.	Select on **Switch Identity** and select the identity to use with the job: system-assigned identity or user-assigned identity.
3.	For user-assigned identity, select the subscription where your user-assigned identity is located and select the name of your identity.
4.	Review and **save**.


## Download certificate from LetsEncrypt

The stream analytics kafka output is a librdkafka-based client. For the output to connect to confluent cloud, you need TLS certificates that confluent cloud uses for server authentication. 
Confluent cloud uses TLS certificates from Let’s Encrypt, an open certificate authority (CA). 

Download the ISRG Root X1 certificate in **PEM** format on the site of [LetsEncrypt](https://letsencrypt.org/certificates/).

:::image type="content" source="./media/kafka/lets-encrypt-certificate.png" alt-text="Screenshot showing the certificate to download from the website of lets encrypt." lightbox="./media/kafka/lets-encrypt-certificate.png" :::


## Configure Key vault with permissions

Azure Stream Analytics integrates seamlessly with Azure Key vault to access stored secrets needed for authentication and encryption when using mTLS or SASL_SSL security protocols. Your Azure Stream Analytics job connects to your Azure Key vault using managed identity to ensure a secure connection and avoid the exfiltration of secrets. To use the certificate you downloaded, you must upload it to key vault first.

To upload certificates, you must have "**Key Vault Administrator**"  access to your Key vault. Follow the following to grant admin access:

> [!NOTE]
> You must have "**Owner**" permissions to grant other key vault permissions.

1. In your keyvault, select **Access control (IAM)**.

1. Select **Add** > **Add role assignment** to open the **Add role assignment** page.

1. Assign the role using the following configuration:

 | Setting | Value |
 | --- | --- |
 | Role | Key Vault Administrator |
 | Assign access to | User, group, or service principal |
 | Members | \<Your account information or email> |


## Upload certificate to Key vault as a secret via Azure CLI

> [!IMPORTANT]
> You must have "**Key Vault Administrator**" permissions access to your Key vault for this command to work properly
> You must upload the certificate as a secret. You must use Azure CLI to upload certificates as secrets to your key vault.
> Your Azure Stream Analytics job will fail when the certificate used for authentication expires. To resolve this, you must update/replace the certificate in your key vault and restart your Azure Stream Analytics job.

Make sure you have Azure CLI configured and installed locally with PowerShell.
You can visit this page to get guidance on setting up Azure CLI: [Get started with Azure CLI](https://learn.microsoft.com/cli/azure/get-started-with-azure-cli#how-to-sign-into-the-azure-cli)

**Login to Azure CLI:**
```PowerShell
az login
```

**Connect to your subscription containing your key vault:**
```PowerShell
az account set --subscription <subscription name>
```

For example:
```PowerShell
az account set --subscription mymicrosoftsubscription
```

**The following command can upload the certificate as a secret to your key vault:**

The `<your key vault>` is the name of the key vault you want to upload the certificate to. `<name of the secret>` is any name you want to give to your secret and how it shows up in the key vault. `<file path to certificate>` is the path to the location of the downloaded certificate. You can right-click on the certificate and copy the path to the certificate.

```PowerShell
az keyvault secret set --vault-name <your key vault> --name <name of the secret> --file <file path to certificate>
```

For example:

```PowerShell
az keyvault secret set --vault-name mykeyvault --name confluentsecret --file C:\Users\Downloads\isrgrootx1.pem
```

## Grant the Stream Analytics job permissions to access the certificate in the key vault

For your Azure Stream Analytics job to read the secret in your key vault, the job must have permission to access the key vault.
Use the following steps to grant special permissions to your stream analytics job:

1. In your key vault, select **Access control (IAM)**.

1. Select **Add** > **Add role assignment** to open the **Add role assignment** page.

1. Assign the role using the following configuration:

 | Setting | Value |
 | --- | --- |
 | Role | Key vault secrets user |
 | Managed identity | Stream Analytics job for System-assigned managed identity or User-assigned managed identity |
 | Members | \<Name of your Stream Analytics job> or \<name of user-assigned identity> |

   
## Configure kafka output in your stream analytics job

1. In your stream analytics job, select **Outputs** under **Job Topology**

1. Select **Add output** > **Kafka** to open the **Kafka New output** configuration blade.

1. Use the following configuration:

| Property name                | Description                                                                                                             |
|------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| Output Alias            | A friendly name used in queries to reference your input |
| Bootstrap server addresses   | A list of host/port pairs to establish the connection to your confluent cloud kafka cluster. Example: pkc-56d1g.eastus.azure.confluent.cloud:9092 |
| Kafka topic                  | The name of your kafka topic in your confluent cloud kafka cluster.|
| Security Protocol            | Select **SASL_SSL**. The mechanism supported is PLAIN. The SASL_SSL protocol doesn't support SCRAM.  |
| Event Serialization format   | The serialization format (JSON, CSV, Avro, Parquet, Protobuf) of the incoming data stream. |
| Partition key                | Azure Stream Analytics assigns partitions using round partitioning. Keep blank if a key doesn't partition your input |
| Kafka event compression type | The compression type used for outgoing data streams, such as Gzip, Snappy, Lz4, Zstd, or None.                            | 

> [!IMPORTANT]
> Confluent Cloud supports authentication using API Keys, OAuth, or SAML single sign-on (SSO). Azure Stream Analytics does not support authentication using OAuth or SAML single sign-on (SSO).
> You can connect to confluent cloud using an API Key that has topic-level access via the SASL_SSL security protocol.
To authenticate to confluent cloud you will need to use SASL_SSL and configure your job to authenticate to confluent cloud using your API key .

Use the following configuration:

| Setting | Value |
 | --- | --- |
 | Username | confluent cloud API Key |
 | Password | confluent cloud API secret |
 | Key vault name | Name of Azure Key vault with Uploaded certificate |
 | Truststore certificates | name of the key vault secret that holds the ISRG Root X1 certificate |


:::image type="content" source="./media/kafka/kafka-output.png" alt-text="Screenshot showing how to configure kafka output for a stream analytics job." lightbox="./media/kafka/kafka-output.png" :::


### Save configuration and test connection

Save your configuration. Your Azure Stream Analytics job validates using the configuration provided.
A successful test connection shows up in the portal if your stream analytics job can connect to your kafka cluster.

:::image type="content" source="./media/kafka/kafka-output-test-connection.png" alt-text="Screenshot showing successful test connection to confluent kafka output." lightbox="./media/kafka/kafka-output-test-connection.png" :::
   

### Limitations
 
* The certificate you upload to key vault must be in PEM format. 
* The minimum version of kafka must be kafka version 0.10.
* Azure Stream Analytics doesn't support authentication to confluent cloud using OAuth or SAML single sign-on (SSO). You must use API Key via the SASL_SSL protocol.
* You must use Azure CLI to upload certificate as a secret to key vault. You can't upload certificates with multiline secrets to key vault using the Azure portal.

> [!NOTE]
> For direct help with using the Azure Stream Analytics Kafka output, please reach out to [askasa@microsoft.com](mailto:askasa@microsoft.com).
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
