---
title: Certificate rotation for Azure Database for PostgreSQL Single server
description: Learn about the upcoming changes of root certificate changes that will affect Azure Database for PostgreSQL Single server
author: mksuni
ms.author: sumuth
ms.service: postgresql
ms.topic: conceptual
ms.date: 09/02/2020
---

# Understanding the changes in the Root CA change for Azure Database for PostgreSQL Single server

Azure Database for PostgreSQL Single Server successfully completed the root certificate change on **February 15, 2021 (02/15/2021)** as part of standard maintenance and security best practices. This article gives you more details about the changes, the resources affected, and the steps needed to ensure that your application maintains connectivity to your database server.

## Why root certificate update is required?

Azure database for PostgreSQL users can only use the predefined certificate to connect to their PostgreSQL server, which is located [here](https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem). However, [Certificate Authority (CA) Browser forum](https://cabforum.org/) recently published reports of multiple certificates issued by CA vendors to be non-compliant.

As per the industry's compliance requirements, CA vendors began revoking CA certificates for non-compliant CAs, requiring servers to use certificates issued by compliant CAs, and signed by CA certificates from those compliant CAs. Since Azure Database for MySQL used one of these non-compliant certificates, we needed to rotate the certificate to the compliant version to minimize the potential threat to your MySQL servers.

The new certificate is rolled out and in effect starting February 15, 2021 (02/15/2021). 

## What change was performed on February 15, 2021 (02/15/2021)?

On February 15, 2021, the [BaltimoreCyberTrustRoot root certificate](https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem) was replaced with a **compliant version** of the same [BaltimoreCyberTrustRoot root certificate](https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem) to ensure existing customers do not need to change anything and there is no impact to their connections to the server. During this change, the [BaltimoreCyberTrustRoot root certificate](https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem) was **not replaced** with [DigiCertGlobalRootG2](https://cacerts.digicert.com/DigiCertGlobalRootG2.crt.pem) and that change is deferred to allow more time for customers to make the change.

## Do I need to make any changes on my client to maintain connectivity?

There is no change required on client side. if you followed our previous recommendation below, you will still be able to continue to connect as long as **BaltimoreCyberTrustRoot certificate is not removed** from the combined CA certificate. **We recommend to not remove the BaltimoreCyberTrustRoot from your combined CA certificate until further notice to maintain connectivity.**

### Previous Recommendation

*   Download BaltimoreCyberTrustRoot & DigiCertGlobalRootG2 Root CA from links below:
    *   https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem
    *   https://cacerts.digicert.com/DigiCertGlobalRootG2.crt.pem

*   Generate a combined CA certificate store with both **BaltimoreCyberTrustRoot** and **DigiCertGlobalRootG2** certificates are included.
    *   For Java (PostgreSQL JDBC) users using DefaultJavaSSLFactory, execute:

          ```console
          keytool -importcert -alias PostgreSQLServerCACert  -file D:\BaltimoreCyberTrustRoot.crt.pem  -keystore truststore -storepass password -noprompt
          ```

          ```console
          keytool -importcert -alias PostgreSQLServerCACert2  -file D:\DigiCertGlobalRootG2.crt.pem -keystore truststore -storepass password  -noprompt
          ```

          Then replace the original keystore file with the new generated one:
        *   System.setProperty("javax.net.ssl.trustStore","path_to_truststore_file"); 
        *   System.setProperty("javax.net.ssl.trustStorePassword","password");
        
    *   For .NET (Npgsql) users on Windows, make sure **Baltimore CyberTrust Root** and **DigiCert Global Root G2** both exist in Windows Certificate Store, Trusted Root Certification Authorities. If any certificates do not exist, import the missing certificate.

        ![Azure Database for PostgreSQL .net cert](media/overview/netconnecter-cert.png)

    *   For .NET (Npgsql) users on Linux using SSL_CERT_DIR, make sure **BaltimoreCyberTrustRoot** and **DigiCertGlobalRootG2** both exist in the directory indicated by SSL_CERT_DIR. If any certificates do not exist, create the missing certificate file.

    *   For other PostgreSQL client users, you can merge two CA certificate files like this format below

        </br>-----BEGIN CERTIFICATE-----
 </br>(Root CA1: BaltimoreCyberTrustRoot.crt.pem)
 </br>-----END CERTIFICATE-----
 </br>-----BEGIN CERTIFICATE-----
 </br>(Root CA2: DigiCertGlobalRootG2.crt.pem)
 </br>-----END CERTIFICATE-----

*   Replace the original root CA pem file with the combined root CA file and restart your application/client.
*    In future, after the new certificate deployed on the server side, you can change your CA pem file to DigiCertGlobalRootG2.crt.pem.

> [!NOTE]
> Please do not drop or alter **Baltimore certificate** until the cert change is made. We will send a communication once the change is done, after which it is safe for them to drop the Baltimore certificate. 

## Why was BaltimoreCyberTrustRoot certificate not replaced to DigiCertGlobalRootG2 during this change on February 15, 2021?

We evaluated the customer readiness for this change and realized many customers were looking for additional lead time to manage this change. In the interest of providing more lead time to customers for readiness, we have decided to defer the certificate change to DigiCertGlobalRootG2 for at least a year providing sufficient lead time to the customers and end users. 

Our recommendations to users is, use the aforementioned steps to create a combined certificate and connect to your server but do not remove BaltimoreCyberTrustRoot certificate until we send a communication to remove it. 

## What if we removed the BaltimoreCyberTrustRoot certificate?

You will start to connectivity errors while connecting to your Azure Database for PostgreSQL server. You will need to configure SSL with [BaltimoreCyberTrustRoot](https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem) certificate again to maintain connectivity.


## Frequently asked questions

###    1. If I am not using SSL/TLS, do I still need to update the root CA?
No actions required if you are not using SSL/TLS. 

### 2. If I am using SSL/TLS, do I need to restart my database server to update the root CA?
No, you do not need to restart the database server to start using the new certificate. This is a client-side change and the incoming client connections need to use the new certificate to ensure that they can connect to the database server.

### 3. How do I know if I'm using SSL/TLS with root certificate verification?

You can identify whether your connections verify the root certificate by reviewing your connection string.
-    If your connection string includes `sslmode=verify-ca` or `sslmode=verify-full`, you need to update the certificate.
-    If your connection string includes `sslmode=disable`, `sslmode=allow`, `sslmode=prefer`, or `sslmode=require`, you do not need to update certificates. 
-    If your connection string does not specify sslmode, you do not need to update certificates.

If you are using a client that abstracts the connection string away, review the client's documentation to understand whether it verifies certificates. To understand PostgreSQL sslmode review the [SSL mode descriptions](https://www.postgresql.org/docs/11/libpq-ssl.html#ssl-mode-descriptions) in PostgreSQL documentation.

### 4. What is the impact if using App Service with Azure Database for PostgreSQL?
For Azure app services, connecting to Azure Database for PostgreSQL, we can have two possible scenarios and it depends on how on you are using SSL with your application.
*   This new certificate has been added to App Service at platform level. If you are using the SSL certificates included on App Service platform in your application, then no action is needed.
*   If you are explicitly including the path to SSL cert file in your code, then you would need to download the new cert and update the code to use the new cert. A good example of this scenario is when you use custom containers in App Service as shared in the [App Service documentation](../app-service/tutorial-multi-container-app.md#configure-database-variables-in-wordpress)

### 5. What is the impact if using Azure Kubernetes Services (AKS) with Azure Database for PostgreSQL?
If you are trying to connect to the Azure Database for PostgreSQL using Azure Kubernetes Services (AKS), it is similar to access from a dedicated customers host environment. Refer to the steps [here](../aks/ingress-own-tls.md).

### 6. What is the impact if using Azure Data Factory to connect to Azure Database for PostgreSQL?
For connector using Azure Integration Runtime, the connector leverage certificates in the Windows Certificate Store in the Azure-hosted environment. These certificates are already compatible to the newly applied certificates and therefore no action is needed.

For connector using Self-hosted Integration Runtime where you explicitly include the path to SSL cert file in your connection string, you will need to download the [new certificate](https://cacerts.digicert.com/DigiCertGlobalRootG2.crt.pem) and update the connection string to use it.

### 7. Do I need to plan a database server maintenance downtime for this change?
No. Since the change here is only on the client side to connect to the database server, there is no maintenance downtime needed for the database server for this change.

### 8. If I create a new server after February 15, 2021 (02/15/2021), will I be impacted?
For servers created after February 15, 2021 (02/15/2021), you will continue to use the [BaltimoreCyberTrustRoot](https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem) for your applications to connect using SSL.

### 9. How often does Microsoft update their certificates or what is the expiry policy?
These certificates used by Azure Database for PostgreSQL are provided by trusted Certificate Authorities (CA). So the support of these certificates is tied to the support of these certificates by CA. The [BaltimoreCyberTrustRoot](https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem) certificate is scheduled to expire in 2025 so Microsoft will need to perform a certificate change before the expiry. Also in case if there are unforeseen bugs in these predefined certificates, Microsoft will need to make the certificate rotation at the earliest similar to the change performed on February 15, 2021 to ensure the service is secure and compliant at all times.

### 10. If I am using read replicas, do I need to perform this update only on the primary server or the read replicas?
Since this update is a client-side change, if the client used to read data from the replica server, you will need to apply the changes for those clients as well. 

### 11. Do we have server-side query to verify if SSL is being used?
To verify if you are using SSL connection to connect to the server refer [SSL verification](concepts-ssl-connection-security.md#applications-that-require-certificate-verification-for-tls-connectivity).

### 12. Is there an action needed if I already have the DigiCertGlobalRootG2 in my certificate file?
No. There is no action needed if your certificate file already has the **DigiCertGlobalRootG2**.

### 13. What if you are using docker image of PgBouncer sidecar provided by Microsoft?
A new docker image which supports both [**Baltimore**](https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem) and [**DigiCert**](https://cacerts.digicert.com/DigiCertGlobalRootG2.crt.pem) is published to below [here](https://hub.docker.com/_/microsoft-azure-oss-db-tools-pgbouncer-sidecar) (Latest tag). You can pull this new image to avoid any interruption in connectivity starting February 15, 2021. 

### 14. What if I have further questions?
If you have questions, get answers from community experts in [Microsoft Q&A](mailto:AzureDatabaseforPostgreSQL@service.microsoft.com). If you have a support plan and you need technical help,  [contact us](mailto:AzureDatabaseforPostgreSQL@service.microsoft.com)
