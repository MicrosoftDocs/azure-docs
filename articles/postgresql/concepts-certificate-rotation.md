---
title: Certificate rotation for Azure Database for PostgreSQL Single server
description: Learn about the upcoming changes of root certificate changes that will affect Azure Database for PostgreSQL Single server
author: kummanish
ms.author: manishku
ms.service: postgresql
ms.topic: conceptual
ms.date: 09/02/2020
---

# Understanding the changes in the Root CA change for Azure Database for PostgreSQL Single server

Azure Database for PostgreSQL will be changing the root certificate for the client application/driver enabled with SSL, used to [connect to the database server](concepts-connectivity-architecture.md). The root certificate currently available is set to expire February 15, 2021 (02/15/2021) as part of standard maintenance and security best practices. This article gives you more details about the upcoming changes, the resources that will be affected, and the steps needed to ensure that your application maintains connectivity to your database server.

>[!NOTE]
> Based on the feedback from customers we have extended the root certificate deprecation for our existing Baltimore Root CA till February 15, 2021 (02/15/2021).

## What update is going to happen?

In some cases, applications use a local certificate file generated from a trusted Certificate Authority (CA) certificate file to connect securely. Currently customers can only use the predefined certificate to connect to an Azure Database for PostgreSQL server, which is located [here](https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem). However, [Certificate Authority (CA) Browser forum](https://cabforum.org/) recently published reports of multiple certificates issued by CA vendors to be non-compliant.

As per the industry’s compliance requirements, CA vendors began revoking CA certificates for non-compliant CAs, requiring servers to use certificates issued by compliant CAs, and signed by CA certificates from those compliant CAs. Since Azure Database for PostgreSQL currently uses one of these non-compliant certificates, which client applications use to validate their SSL connections, we need to ensure that appropriate actions are taken (described below) to minimize the potential impact to your PostgreSQL servers.

The new certificate will be used starting February 15, 2021 (02/15/2021). If you use either CA validation or full validation of the server certificate when connecting from a PostgreSQL client (sslmode=verify-ca or sslmode=verify-full), you need to update your application configuration before February 15, 2021 (02/15/2021).

## How do I know if my database is going to be affected?

All applications that use SSL/TLS and verify the root certificate needs to update the root certificate. You can identify whether your connections verify the root certificate by reviewing your connection string.
-	If your connection string includes `sslmode=verify-ca` or `sslmode=verify-full`, you need to update the certificate.
-	If your connection string includes `sslmode=disable`, `sslmode=allow`, `sslmode=prefer`, or `sslmode=require`, you do not need to update certificates. 
-	If your connection string does not specify sslmode, you do not need to update certificates.

If you are using a client that abstracts the connection string away, review the client’s documentation to understand whether it verifies certificates.

To understand PostgreSQL sslmode review the [SSL mode descriptions](https://www.postgresql.org/docs/11/libpq-ssl.html#ssl-mode-descriptions) in PostgreSQL documentation.

To avoid your application’s availability being interrupted due to certificates being unexpectedly revoked, or to update a certificate, which has been revoked, refer to the [**“What do I need to do to maintain connectivity”**](concepts-certificate-rotation.md#what-do-i-need-to-do-to-maintain-connectivity) section.

## What do I need to do to maintain connectivity

To avoid your application’s availability being interrupted due to certificates being unexpectedly revoked, or to update a certificate, which has been revoked, follow the steps below. The idea is to create a new *.pem* file, which combines the current cert and the new one and during the SSL cert validation once of the allowed values will be used. Refer to the steps below:

*   Download BaltimoreCyberTrustRoot & DigiCertGlobalRootG2 Root CA from links below:
    *   https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem
    *   https://cacerts.digicert.com/DigiCertGlobalRootG2.crt.pem

*   Generate a combined CA certificate store with both **BaltimoreCyberTrustRoot** and **DigiCertGlobalRootG2** certificates are included.
    *   For Java (PostgreSQL JDBC) users using DefaultJavaSSLFactory, execute:

          ```azurecli-interactive
          keytool -importcert -alias PostgreSQLServerCACert  -file D:\BaltimoreCyberTrustRoot.crt.pem  -keystore truststore -storepass password -noprompt
          ```

          ```azurecli-interactive
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
*	In future, after the new certificate deployed on the server side, you can change your CA pem file to DigiCertGlobalRootG2.crt.pem.

## How can you test the changes made for the certificate rotation?
Once you have made the changes to the `*.pem` file, described [here](concepts-certificate-rotation.md#what-do-i-need-to-do-to-maintain-connectivity), you can validate the changes and see it in action. We have pre-created servers in **Japan East** region, which uses the new DigiCertGlobalRootG2.crt.pem certificate. This will give error on using the BaltimoreCyberTrustRoot.crt.pem certificate.

1. Server Name - `pgsqlsslverify.mysql.database.azure.com`
2. User Name - `pguser@pgsqlsslverify`
3. Location - `Japan East`

*   Failure

    ```azurecli-interactive
    C:>psql.exe "host=pgsqlsslverify.mysql.database.azure.com dbname=postgres user=pguser@pgsqlsslverify sslmode=verify-ca sslrootcert=<path to BaltimoreCyberTrustRoot.crt.pem file"
    ```
    **Error** - SSL error: certificate verify failed

    >[!NOTE]
    > This error means that the SSL handshake itself failed due to the mismatch of the cert file being passed. The server only accepts **DigiCertGlobalRootG2.crt.pem** file and the passed cert is the **BaltimoreCyberTrustRoot.crt.pem** file. 

*   Success

    ```azurecli-interactive
    C:>psql.exe "host=pgsqlsslverify.mysql.database.azure.com dbname=postgres user=pguser@pgsqlsslverify sslmode=verify-ca sslrootcert= "<location to DigiCertGlobalRootG2.crt.pem>"
    ```

    **Error** - FATAL:  no pg_hba.conf entry for host "73.83.15.158", user "<username>", database "postgres", SSL on
    
    >[!NOTE]
    > This error is expected since the server is not open for connection from the customers application but the SSL handshake was successfully done.

## What can be the impact of not updating the certificate?
If you are using the Baltimore CyberTrust Root certificate to verify the SSL connection to Azure Database for PostgreSQL as documented here,  your application’s availability might be interrupted since the database will not be reachable. Depending on your application, you may receive a variety of error messages including but not limited to:
*	Invalid certificate/revoked certificate
*	Connection timed out

> [!NOTE]
> Please do not drop or alter **Baltimore certificate** until the cert change is made. We will send a communication once the change is done, after which it is safe for them to drop the Baltimore certificate. 

## Frequently asked questions

###	1. If I am not using SSL/TLS, do I still need to update the root CA?
No actions required if you are not using SSL/TLS. 

### 2. If I am using SSL/TLS, do I need to restart my database server to update the root CA?
No, you do not need to restart the database server to start using the new certificate. This is a client-side change and the incoming client connections need to use the new certificate to ensure that they can connect to the database server.

### 3. What will happen if I do not update the root certificate before February 15, 2021 (02/15/2021)?
If you do not update the root certificate before February 15, 2021 (02/15/2021), your applications that connect via SSL/TLS and does verification for the root certificate will be unable to communicate to the PostgreSQL database server and application will experience connectivity issues to your PostgreSQL database server.

### 4. What is the impact if using App Service with Azure Database for PostgreSQL?
For Azure app services, connecting to Azure Database for PostgreSQL, we can have two possible scenarios and it depends on how on you are using SSL with your application.
*   This new certificate has been added to App Service at platform level. If you are using the SSL certificates included on App Service platform in your application, then no action is needed.
*   If you are explicitly including the path to SSL cert file in your code, then you would need to download the new cert and update the code to use the new cert.

### 5. What is the impact if using Azure Kubernetes Services (AKS) with Azure Database for PostgreSQL?
If you are trying to connect to the Azure Database for PostgreSQL using Azure Kubernetes Services (AKS), it is similar to access from a dedicated customers host environment. Refer to the steps [here](../aks/ingress-own-tls.md).

### 6. What is the impact if using Azure Data Factory to connect to Azure Database for PostgreSQL?
For connector using Azure Integration Runtime, the connector leverage certificates in the Windows Certificate Store in the Azure-hosted environment. These certificates are already compatible to the newly applied certificates and therefore no action is needed.

For connector using Self-hosted Integration Runtime where you explicitly include the path to SSL cert file in your connection string, you will need to download the [new certificate](https://cacerts.digicert.com/DigiCertGlobalRootG2.crt.pem) and update the connection string to use it.

### 7. Do I need to plan a database server maintenance downtime for this change?
No. Since the change here is only on the client side to connect to the database server, there is no maintenance downtime needed for the database server for this change.

### 8.  What if I cannot get a scheduled downtime for this change before February 15, 2021 (02/15/2021)?
Since the clients used for connecting to the server needs to be updating the certificate information as described in the fix section [here](./concepts-certificate-rotation.md#what-do-i-need-to-do-to-maintain-connectivity), we do not need to a downtime for the server in this case.

### 9. If I create a new server after February 15, 2021 (02/15/2021), will I be impacted?
For servers created after February 15, 2021 (02/15/2021), you can use the newly issued certificate for your applications to connect using SSL.

###	10. How often does Microsoft update their certificates or what is the expiry policy?
These certificates used by Azure Database for PostgreSQL are provided by trusted Certificate Authorities (CA). So the support of these certificates on Azure Database for PostgreSQL is tied to the support of these certificates by CA. However, as in this case, there can be unforeseen bugs in these predefined certificates, which need to be fixed at the earliest.

###	11. If I am using read replicas, do I need to perform this update only on the primary server or the read replicas?
Since this update is a client-side change, if the client used to read data from the replica server, you will need to apply the changes for those clients as well. 

### 12. Do we have server-side query to verify if SSL is being used?
To verify if you are using SSL connection to connect to the server refer [SSL verification](concepts-ssl-connection-security.md#applications-that-require-certificate-verification-for-tls-connectivity).

### 13. Is there an action needed if I already have the DigiCertGlobalRootG2 in my certificate file?
No. There is no action needed if your certificate file already has the **DigiCertGlobalRootG2**.

###	14. What if I have further questions?
If you have questions, get answers from community experts in [Microsoft Q&A](mailto:AzureDatabaseforPostgreSQL@service.microsoft.com). If you have a support plan and you need technical help,  [contact us](mailto:AzureDatabaseforPostgreSQL@service.microsoft.com)