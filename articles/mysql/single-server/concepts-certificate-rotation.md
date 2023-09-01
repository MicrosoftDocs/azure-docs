---
title: Certificate rotation for Azure Database for MySQL
description: Learn about the upcoming changes of root certificate changes that will affect Azure Database for MySQL
ms.service: mysql
ms.subservice: single-server
ms.topic: conceptual
author: mksuni
ms.author: sumuth
ms.date: 06/20/2022
---

# Understanding the changes in the Root CA change for Azure Database for MySQL single server

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

Azure Database for MySQL single server as part of standard maintenance and security best practices will complete the root certificate change starting October 2022. This article gives you more details about the changes, the resources affected, and the steps needed to ensure that your application maintains connectivity to your database server.

> [!NOTE]
> This article applies to [Azure Database for MySQL - Single Server](single-server-overview.md) ONLY. For [Azure Database for MySQL - Flexible Server](../flexible-server/overview.md), the certificate needed to communicate over SSL is [DigiCert Global Root CA](https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem)
>
> This article contains references to the term *slave*, a term that Microsoft no longer uses. When the term is removed from the software, we'll remove it from this article.
>

#### Why is a root certificate update required?

Azure Database for MySQL users can only use the predefined certificate to connect to their MySQL server, which is located [here](https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem). However, [Certificate Authority (CA) Browser forum](https://cabforum.org/) recently published reports of multiple certificates issued by CA vendors to be non-compliant.

Per the industry's compliance requirements, CA vendors began revoking CA certificates for non-compliant CAs, requiring servers to use certificates issued by compliant CAs, and signed by CA certificates from those compliant CAs. Since Azure Database for MySQL used one of these non-compliant certificates, we needed to rotate the certificate to the compliant version to minimize the potential threat to your MySQL servers.

#### Do I need to make any changes on my client to maintain connectivity?

If you followed steps mentioned under [Create a combined CA certificate](#create-a-combined-ca-certificate) below, you can continue to connect as long as **BaltimoreCyberTrustRoot certificate is not removed** from the combined CA certificate. **To maintain connectivity, we recommend that you retain the BaltimoreCyberTrustRoot in your combined CA certificate until further notice.**

###### Create a combined CA certificate

To avoid interruption of your application's availability as a result of certificates being unexpectedly revoked, or to update a certificate that has been revoked, use the following steps. The idea is to create a new *.pem* file, which combines the current cert and the new one and during the SSL cert validation, one of the allowed values will be used. Refer to the following steps:

1. Download BaltimoreCyberTrustRoot & DigiCertGlobalRootG2 Root CA from the following links:

    * [https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem](https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem)
    * [https://cacerts.digicert.com/DigiCertGlobalRootG2.crt.pem](https://cacerts.digicert.com/DigiCertGlobalRootG2.crt.pem)

2. Generate a combined CA certificate store with both **BaltimoreCyberTrustRoot** and **DigiCertGlobalRootG2** certificates are included.

    * For Java (MySQL Connector/J) users, execute:

      ```console
      keytool -importcert -alias MySQLServerCACert -file D:\BaltimoreCyberTrustRoot.crt.pem -keystore truststore -storepass password -noprompt
      ```

      ```console
      keytool -importcert -alias MySQLServerCACert2 -file D:\DigiCertGlobalRootG2.crt.pem -keystore truststore -storepass password -noprompt
      ```

      Then replace the original keystore file with the new generated one:

      * System.setProperty("javax.net.ssl.trustStore","path_to_truststore_file");
      * System.setProperty("javax.net.ssl.trustStorePassword","password");

    * For .NET (MySQL Connector/NET, MySQLConnector) users, make sure **BaltimoreCyberTrustRoot** and **DigiCertGlobalRootG2** both exist in Windows Certificate Store, Trusted Root Certification Authorities. If any certificates don't exist, import the missing certificate.

      :::image type="content" source="media/overview/netconnecter-cert.png" alt-text="Azure Database for MySQL .NET cert diagram":::

    * For .NET users on Linux using SSL_CERT_DIR, make sure **BaltimoreCyberTrustRoot** and **DigiCertGlobalRootG2** both exist in the directory indicated by SSL_CERT_DIR. If any certificates don't exist, create the missing certificate file.

    * For other (MySQL Client/MySQL Workbench/C/C++/Go/Python/Ruby/PHP/NodeJS/Perl/Swift) users, you can merge two CA certificate files into the following format:

      ```
      -----BEGIN CERTIFICATE-----
      (Root CA1: BaltimoreCyberTrustRoot.crt.pem)
      -----END CERTIFICATE-----
      -----BEGIN CERTIFICATE-----
      (Root CA2: DigiCertGlobalRootG2.crt.pem)
      -----END CERTIFICATE-----
      ```

3. Replace the original root CA pem file with the combined root CA file and restart your application/client.

   In the future, after the new certificate is deployed on the server side, you can change your CA pem file to DigiCertGlobalRootG2.crt.pem.

> [!NOTE]
> Please don't drop or alter **Baltimore certificate** until the cert change is made. We'll send a communication after the change is done and then it will be safe to drop the **Baltimore certificate**.

#### What if we removed the BaltimoreCyberTrustRoot certificate?

You'll start to encounter connectivity errors while connecting to your Azure Database for MySQL server. You'll need to [configure SSL](how-to-configure-ssl.md) with the [BaltimoreCyberTrustRoot](https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem) certificate again to maintain connectivity.

## Frequently asked questions

#### If I'm not using SSL/TLS, do I still need to update the root CA?

No actions are required if you aren't using SSL/TLS.

#### When will my single server instance undergo root certificate change?

The migration from **BaltimoreCyberTrustRoot** to  **DigiCertGlobalRootG2** will be carried out across all regions of Azure starting **October 2022** in phases. 
To make sure that you do not lose connectivity to your server, follow the steps mentioned under [Create a combined CA certificate](#create-a-combined-ca-certificate).
Combined CA certificate will allow connectivity over SSL to your single server instance with either of these two certificates.


#### When can I remove BaltimoreCyberTrustRoot certificate completely?

Once the migration is completed successfully across all Azure regions we'll send a communication post that you're safe to change single CA **DigiCertGlobalRootG2**  certificate.


#### I don't specify any CA cert while connecting to my single server instance over SSL, do I still need to perform [the steps](#create-a-combined-ca-certificate) mentioned above?

If you have both the CA root cert in your [trusted root store](/windows-hardware/drivers/install/trusted-root-certification-authorities-certificate-store), then no further actions are required. This also applies to your client drivers that use local store for accessing root CA certificate.


#### If I'm using SSL/TLS, do I need to restart my database server to update the root CA?

No, you don't need to restart the database server to start using the new certificate. This root certificate is a client-side change and the incoming client connections need to use the new certificate to ensure that they can connect to the database server.

#### How do I know if I'm using SSL/TLS with root certificate verification?

You can identify whether your connections verify the root certificate by reviewing your connection string.

* If your connection string includes `sslmode=verify-ca` or `sslmode=verify-identity`, you need to update the certificate.
* If your connection string includes `sslmode=disable`, `sslmode=allow`, `sslmode=prefer`, or `sslmode=require`, you don't need to update certificates.
* If your connection string doesn't specify sslmode, you don't need to update certificates.

If you're using a client that abstracts the connection string away, review the client's documentation to understand whether it verifies certificates.

#### What is the impact of using App Service with Azure Database for MySQL?

For Azure app services connecting to Azure Database for MySQL, there are two possible scenarios depending on how on you're using SSL with your application.

* This new certificate has been added to App Service at platform level. If you're using the SSL certificates included on App Service platform in your application, then no action is needed. This is the most common scenario.
* If you're explicitly including the path to SSL cert file in your code, then you would need to download the new cert and produce a combined certificate as mentioned above and use the certificate file. A good example of this scenario is when you use custom containers in App Service as shared in the [App Service documentation](../../app-service/tutorial-multi-container-app.md#configure-database-variables-in-wordpress). This is an uncommon scenario but we have seen some users using this.

#### What is the impact of using Azure Kubernetes Services (AKS) with Azure Database for MySQL?

If you're trying to connect to the Azure Database for MySQL using Azure Kubernetes Services (AKS), it's similar to access from a dedicated customers host environment. Refer to the steps [here](../../aks/ingress-own-tls.md).

#### What is the impact of using Azure Data Factory to connect to Azure Database for MySQL?

For a connector using Azure Integration Runtime, the connector uses certificates in the Windows Certificate Store in the Azure-hosted environment. These certificates are already compatible to the newly applied certificates, and therefore no action is needed.

For a connector using Self-hosted Integration Runtime where you explicitly include the path to SSL cert file in your connection string, you'll need to download the [new certificate](https://cacerts.digicert.com/DigiCertGlobalRootG2.crt.pem) and update the connection string to use it.

#### Do I need to plan a database server maintenance downtime for this change?

No. Since the change is only on the client side to connect to the database server, there's no maintenance downtime needed for the database server for this change.

#### How often does Microsoft update their certificates or what is the expiry policy?

These certificates used by Azure Database for MySQL are provided by trusted Certificate Authorities (CA). So the support of these certificates is tied to the support of these certificates by CA. The [BaltimoreCyberTrustRoot](https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem) certificate is scheduled to expire in 2025 so Microsoft will need to perform a certificate change before the expiry. Also in case if there are unforeseen bugs in these predefined certificates, Microsoft will need to make the certificate rotation at the earliest similar to the change performed on February 15, 2021 to ensure the service is secure and compliant at all times.

#### If I'm using read replicas, do I need to perform this update only on source server or the read replicas?

Since this update is a client-side change, if the client used to read data from the replica server, you'll need to apply the changes for those clients as well.

#### If I'm using Data-in replication, do I need to perform any action?

If you're using [Data-in replication](concepts-data-in-replication.md) to connect to Azure Database for MySQL, there are two things to consider:

* If the data-replication is from a virtual machine (on-prem or Azure virtual machine) to Azure Database for MySQL, you need to check if SSL is being used to create the replica. Run **SHOW SLAVE STATUS** and check the following setting.  

    ```azurecli-interactive
    Master_SSL_Allowed            : Yes
    Master_SSL_CA_File            : ~\azure_mysqlservice.pem
    Master_SSL_CA_Path            :
    Master_SSL_Cert               : ~\azure_mysqlclient_cert.pem
    Master_SSL_Cipher             :
    Master_SSL_Key                : ~\azure_mysqlclient_key.pem
    ```

    If you see that the certificate is provided for the CA_file, SSL_Cert, and SSL_Key, you'll need to update the file by adding the [new certificate](https://cacerts.digicert.com/DigiCertGlobalRootG2.crt.pem) and create a combined cert file.

* If the data-replication is between two Azure Database for MySQL servers, then you'll need to reset the replica by executing **CALL mysql.az_replication_change_master** and provide the new dual root certificate as the last parameter [master_ssl_ca](how-to-data-in-replication.md#link-source-and-replica-servers-to-start-data-in-replication).

#### Is there a server-side query to determine whether SSL is being used?

To verify if you're using SSL connection to connect to the server refer [SSL verification](how-to-configure-ssl.md#step-4-verify-the-ssl-connection).

#### Is there an action needed if I already have the DigiCertGlobalRootG2 in my certificate file?

No. There's no action needed if your certificate file already has the **DigiCertGlobalRootG2**.

#### Why do I need to update my root certificate if I am using PHP driver with [enableRedirect](./how-to-redirection.md) ?
To address compliance requirements, the CA certificates of the host server were changed from BaltimoreCyberTrustRoot to DigiCertGlobalRootG2. With this update, database connections using the PHP Client driver with enableRedirect can no longer connect to the server, as the client devices are unaware of the certificate change and the new root CA details. Client devices that use PHP redirection drivers connect directly to the host server, bypassing the gateway. Refer this [link](single-server-overview.md#high-availability) for more on architecture of Azure Database for MySQL single server.

#### What if I have further questions?

For questions, get answers from community experts in [Microsoft Q&A](mailto:AzureDatabaseforMySQL@service.microsoft.com). If you have a support plan and you need technical help, [contact us](mailto:AzureDatabaseforMySQL@service.microsoft.com).
