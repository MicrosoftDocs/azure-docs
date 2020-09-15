---
title: Certificate rotation for Azure Database for MariaDB
description: Learn about the upcoming changes of root certificate changes that will affect Azure Database for MariaDB
author: kummanish
ms.author: manishku
ms.service: mariadb
ms.topic: conceptual
ms.date: 09/02/2020
---

# Understanding the changes in the Root CA change for Azure Database for MariaDB

Azure Database for MariaDB will be changing the root certificate for the client application/driver enabled with SSL, use to [connect to the database server](concepts-connectivity-architecture.md). The root certificate currently available is set to expire October 26, 2020 (10/26/2020) as part of standard maintenance and security best practices. This article gives you more details about the upcoming changes, the resources that will be affected, and the steps needed to ensure that your application maintains connectivity to your database server.

## What update is going to happen?

In some cases, applications use a local certificate file generated from a trusted Certificate Authority (CA) certificate file to connect securely. Currently customers can only use the predefined certificate to connect to an Azure Database for MariaDB server, which is located [here](https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem). However, [Certificate Authority (CA) Browser forum](https://cabforum.org/) recently published reports of multiple certificates issued by CA vendors to be non-compliant.

As per the industry’s compliance requirements, CA vendors began revoking CA certificates for non-compliant CAs, requiring servers to use certificates issued by compliant CAs, and signed by CA certificates from those compliant CAs. Since Azure Database for MariaDB currently uses one of these non-compliant certificates, which client applications use to validate their SSL connections, we need to ensure that appropriate actions are taken (described below) to minimize the potential impact to your MariaDB servers.


The new certificate will be used starting October 26, 2020 (10/26/2020).If you use either CA validation or full validation of the server certificate when connecting from a MySQL client (sslmode=verify-ca or sslmode=verify-full), you need to update your application configuration before October 26, 2020 (10/26/2020).

## How do I know if my database is going to be affected?

All applications that use SSL/TLS and verify the root certificate needs to update the root certificate in order to connect to Azure Database for MariaDB. If you are not using SSL/TLS currently, there is no impact to your application availability. You can verify if your client application is trying to use SSL mode with the predefined trusted Certificate Authority (CA) [here](concepts-ssl-connection-security.md#default-settings).

To avoid your application’s availability being interrupted due to certificates being unexpectedly revoked, or to update a certificate, which has been revoked, refer to the [**“What do I need to do to maintain connectivity”**](concepts-certificate-rotation.md#what-do-i-need-to-do-to-maintain-connectivity) section.

## What do I need to do to maintain connectivity

To avoid your application’s availability being interrupted due to certificates being unexpectedly revoked, or to update a certificate, which has been revoked, follow the steps below:

*   Download **BaltimoreCyberTrustRoot** & **DigiCertGlobalRootG2** CA from links below:
    *   https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem
    *   https://cacerts.digicert.com/DigiCertGlobalRootG2.crt.pem

*   Generate a combined CA certificate store with both **BaltimoreCyberTrustRoot** and **DigiCertGlobalRootG2** certificates are included.
    *   For Java (MariaDB Connector/J) users, execute:

          ```azurecli-interactive
          keytool -importcert -alias MariaDBServerCACert  -file D:\BaltimoreCyberTrustRoot.crt.pem  -keystore truststore -storepass password -noprompt
          ```

          ```azurecli-interactive
          keytool -importcert -alias MariaDBServerCACert2  -file D:\DigiCertGlobalRootG2.crt.pem -keystore truststore -storepass password  -noprompt
          ```

          Then replace the original keystore file with the new generated one:
        *   System.setProperty("javax.net.ssl.trustStore","path_to_truststore_file"); 
        *   System.setProperty("javax.net.ssl.trustStorePassword","password");
    *   For .NET (MariaDB Connector/NET, MariaDBConnector) users, make sure **BaltimoreCyberTrustRoot** and **DigiCertGlobalRootG2** both exist in Windows Certificate Store, Trusted Root Certification Authorities. If any certificates do not exist, import the missing certificate.

        ![Azure Database for MariaDB .net cert](media/overview/netconnecter-cert.png)

    *   For .NET users on Linux using SSL_CERT_DIR, make sure **BaltimoreCyberTrustRoot** and **DigiCertGlobalRootG2** both exist in the directory indicated by SSL_CERT_DIR. If any certificates do not exist, create the missing certificate file.

    *   For other (MariaDB Client/MariaDB Workbench/C/C++/Go/Python/Ruby/PHP/NodeJS/Perl/Swift) users, you can merge two CA certificate files like this format below</b>

        </br>-----BEGIN CERTIFICATE-----
 </br>(Root CA1: BaltimoreCyberTrustRoot.crt.pem)
 </br>-----END CERTIFICATE-----
 </br>-----BEGIN CERTIFICATE-----
 </br>(Root CA2: DigiCertGlobalRootG2.crt.pem)
 </br>-----END CERTIFICATE-----

*   Replace the original root CA pem file with the combined root CA file and restart your application/client.
*	In future, after the new certificate deployed on the server side, you can change your CA pem file to DigiCertGlobalRootG2.crt.pem.

## What can be the impact?
If you are using the Azure Database for MariaDB issued certificate as documented here,  your application’s availability might be interrupted since the database will not be reachable. Depending on your application, you may receive a variety of error messages including but not limited to:
*	Invalid certificate/revoked certificate
*	Connection timed out
*	Error if applicable

## Frequently asked questions

###	1. If I am not using SSL/TLS, do I still need to update the root CA?
No actions required if you are not using SSL/TLS. 

### 2. If I am using SSL/TLS, do I need to restart my database server to update the root CA?
No, you do not need to restart the database server to start using the new certificate. This is a client-side change and the incoming client connections need to use the new certificate to ensure that they can connect to the database server.

### 3. What will happen if I do not update the root certificate before October 26, 2020 (10/26/2020)?
If you do not update the root certificate before October 26, 2020, your applications that connect via SSL/TLS and does verification for the root certificate will be unable to communicate to the MariaDB database server and application will experience connectivity issues to your MariaDB database server.

### 4. Do I need to plan a maintenance downtime for this change?<BR>
No. Since the change here is only on the client side to connect to the database server, there is no maintenance downtime needed here for this change.

### 5.  What if I cannot get a scheduled downtime for this change before October 26, 2020 (10/26/2020)?
Since the clients used for connecting to the server needs to be updating the certificate information as described in the fix section [here](./concepts-certificate-rotation.md#what-do-i-need-to-do-to-maintain-connectivity), we do not need to a downtime for the server in this case.

###  6. If I create a new server after October 26, 2020, will I be impacted?
For servers created after October 26, 2020 (10/26/2020), you can use the newly issued certificate for your applications to connect using SSL.

###	7. How often does Microsoft update their certificates or what is the expiry policy?
These certificates used by Azure Database for MariaDB are provided by trusted Certificate Authorities (CA). So the support of these certificates on Azure Database for MariaDB is tied to the support of these certificates by CA. However, as in this case, there can be unforeseen bugs in these predefined certificates, which need to be fixed at the earliest.

###	8. If I am using read replicas, do I need to perform this update only on master server or all the read replicas?
Since this update is a client-side change, if the client used to read data from the replica server, we will need to apply the changes for those clients as well. 

### 9. Do we have server-side query to verify if SSL is being used?
To verify if you are using SSL connection to connect to the server refer [SSL verification](howto-configure-ssl.md#verify-the-ssl-connection).

###	10. What if I have further questions?
If you have questions, get answers from community experts in [Microsoft Q&A](mailto:AzureDatabaseformariadb@service.microsoft.com). If you have a support plan and you need technical help, [contact us](mailto:AzureDatabaseformariadb@service.microsoft.com)
