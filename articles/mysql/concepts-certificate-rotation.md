---
title: Certificate rotation for Azure Database for MySQL
description: Learn about the upcoming changes of root certificate changes that will affect Azure Database for MySQL Single Server.
author: kummanish
ms.author: manishku
ms.service: mysql
ms.topic: conceptual
ms.date: 09/02/2020
---

# Understanding he changes in the Root CA change for Azure Database for MySQL

Azure Database for MySQL will be changing the root certificate for the client application/driver enabled with SSL, [connecting to the database server](concepts-connectivity-architecture.md). The currently available root certificate is set to expire starting December 1st, 2020 (12/01/2020) as part of standard maintenance and security best practices. This article gives you more details about the upcoming changes, what are the resources getting affected and what are the steps needed to ensure that your application maintains connectivity to your database server.

## What update is going to happen?

In some cases, applications use a local certificate file generated from a trusted Certificate Authority (CA) certificate file to connect securely. Currently customers can only use the predefined certificate to connect to an Azure Database for MySQL server which is located [here](https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem). However, [Certificate Authority (CA) Browser forum](https://cabforum.org/) recently published reports of multiple certificates issued by CA vendors that are used by our customers, Microsoft, and the greater technology community that were out-of-compliance with industry standards for publicly trusted CAs. The reports regarding the non-compliant CAs can be found below -
*  [Bug 1649951](https://bugzilla.mozilla.org/show_bug.cgi?id=1649951)
*  [Bug 1650910](https://bugzilla.mozilla.org/show_bug.cgi?id=1650910)

As per the industry’s compliance requirements, CA vendors began revoking non-compliant CAs and issuing compliant CAs. This requires client application using these certificates re-issued and updated. Since Azure Database for MySQL leverages one of these non-compliant certificates to validation of client application using SSL, we need to ensure that appropriate actions are taken (described below) to minimize the potential impact to Azure Services. 

The new certificate will be used starting December 1st, 2020. If you use full validation of the server certificate you need to update your application configuration before December 1st, 2020.

## How do I know if my database is going to be affected?

All application that use SSL/TLS and verify the root certificate need to update the root certificate in order to connect to Azure Database for MySQL. If you are not using SSL/TLS currently, there is no impact to your application availability. You can verify if your client application is trying to use SSL mode with the predefined trusted Certificate Authority (CA) [here](concepts-ssl-connection-security.md#ssl-default-settings).

To avoid your application’s availability being interrupted due to certificates being unexpectedly revoked, or to update a certificate which has been revoked, please refer to the **“What do I need to do to maintain connectivity”** section.

## What do I need to do to maintain connectivity

To avoid your application’s availability being interrupted due to certificates being unexpectedly revoked, or to update a certificate which has been revoked, follow the steps below:

*   Download BaltimoreCyberTrustRoot & DigiCertGlobalRootG2 Root CA from links below:
    *   https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem
    *   https://cacerts.digicert.com/DigiCertGlobalRootG2.crt.pem

*   Generate a combined CA certificate store with both **BaltimoreCyberTrustRoot** and **DigiCertGlobalRootG2** certificates are included.
    *   For Java (MySQL Connector/J) users, execute:

          ```azurecli-interactive
          keytool -importcert -alias mysqlServerCACert  -file D:\BaltimoreCyberTrustRoot.crt.pem  -keystore truststore -storepass password -noprompt
          ```

          ```azurecli-interactive
          keytool -importcert -alias mysqlServerCACert2  -file D:\DigiCertGlobalRootG2.crt.pem -keystore truststore -storepass password  -noprompt
          ```

          Then replace the original keystore file with the new generated one:
        *   System.setProperty("javax.net.ssl.trustStore","path_to_truststore_file"); 
        *   System.setProperty("javax.net.ssl.trustStorePassword","password");
    *   For .NET (MySQL Connector/NET, MySqlConnector) users, make sure **BaltimoreCyberTrustRoot** and **DigiCertGlobalRootG2** both exist in Windows Certificate Store, Trusted Root Certification Authorities. If any certificates do not exist, please import the missing certificate.

        ![Azure Database for MySQL .net cert](media/overview/netconnecter-cert.png)

    *   For other (MySQL Client/MySQL Workbench/C/C++/Go/Python/Ruby/PHP/NodeJS/Perl/Swift) users, you can merge 2 CA certificate files like this format below</b>

        </br>-----BEGIN CERTIFICATE-----
 </br>(Root CA1: BaltimoreCyberTrustRoot.crt.pem)
 </br>-----END CERTIFICATE-----
 </br>-----BEGIN CERTIFICATE-----
 </br>(Root CA2: DigiCertGlobalRootG2.crt.pem)
 </br>-----END CERTIFICATE-----

*   Replace the original root CA pem file with the combined root CA file and restart your application/client.
*	After the new certificate deployed on the server side, you can change your CA pem file to DigiCertGlobalRootG2.crt.pem.

## What can be the impact?
If you are using the Azure Database for MySQL issued certificate as documented here,  your application’s availability might be interrupted since the database will not be reachable. Depending on your application, you may receive a variety of error messages including but not limited to:
*	Invalid certificate/revoked certificate
*	Connection timed out
*	Error if applicable

## Frequently asked questions

###	1. If I am not using SSL/TLS, do I still need to update the root CA?
No actions required if you are not using SSL/TLS. 

### 2. If I am using SSL/TLS, do I need to restart my database server to update the root CA?
No. You do not need to restart the database server to start using the new Certificate. This is a client-side change and the incoming client connections need to use the new certificate to ensure that they can connect to the database server.

### 3. What will happen if I do not update the root certificate before 30th November?
If you do not update the root certificate before November 30th, 2020, your applications that connect via SSL/TLS and does verification for the root certificate will be unable to communicate to the MySQL database server and application will experience connectivity issues to your MySQL database server. 

### 4. Do I need to plan a maintenance downtime for this change?<BR>
No. Since the change here is only on the client side to connect to the database server, there is no maintenance downtime needed here for this change.

### 5.  What if I cannot get a scheduled downtime for this change before Nov 30st?
Since the clients used for connecting to the server needs to be updating the Certificate information as described in the fix section [here](./concepts-certificate-rotation.md#what-do-i-need-to-do-to-maintain-connectivity), we do not need to a downtime for the server in this case.

###  6. If I create a new server after Nov 30th, will I be impacted?
For server created after Nov 30th, you can use the newly issued Certificate to for your application to connect using SSL. 

###	7. How often does Microsoft update their certificates or what is the expiry policy?
These certificates used by Azure Database for MySQL are provided by trusted Certificate Authorities (CA). So the support of these certificates on Azure Database for MySQL is tied to the support of these certificates by these CA. However, as in this case, there can be unforeseen bugs in these predefined certificates which need to be fixed at the earliest.

###	8. If I am using read replicas, do I need to perform this only on master server or all the read replicas?
Since this is a client side change, if the client used to read data from the replica server, we will need to apply the changes for those clients as well. 

### 9. Do we have server-side query to determine the client connections coming in using this certificate?

###	10. What if I have further questions?
If you have questions, get answers from community experts in [Microsoft Q&A](mailto:AzureDatabaseforMySQL@service.microsoft.com). If you have a support plan and you need technical help,  [contact us](mailto:AzureDatabaseforMySQL@service.microsoft.com)
