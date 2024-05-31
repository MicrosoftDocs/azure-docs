---
title: Networking overview using SSL and TLS
description: Learn about secure connectivity with Flexible Server using SSL and TLS.
author: GennadNY
ms.author: gennadyk
ms.reviewer: maghan
ms.date: 05/02/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.custom:
  - ignite-2023
---

# Secure connectivity with TLS and SSL in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Azure Database for PostgreSQL flexible server enforces connecting your client applications to Azure Database for PostgreSQL flexible server by using Transport Layer Security (TLS). TLS is an industry-standard protocol that ensures encrypted network connections between your database server and client applications. TLS is an updated protocol of Secure Sockets Layer (SSL).

## What is TLS?

TLS made from Netscape Communications Corp's. Secure Sockets Layer show and has regularly supplanted it, however the terms SSL or SSL/TLS are still sometimes used interchangeably.TLS is made out of two layers: the **TLS record show** and the **TLS handshake show**. The record show gives association security, while the handshake show empowers the server and customer to affirm one another and to coordinate encryption assessments and cryptographic keys before any information is traded.

:::image type="content" source="./media/concepts-networking/tls-1-2.png" alt-text="Diagram that shows typical TLS 1.2 handshake sequence." lightbox="./media/concepts-networking/tls-1-2.png":::

Diagram above shows typical TLS 1.2 handshake sequence, consisting of following:
1. The client starts by sending a message called the *ClientHello*, that essentially expresses willingness to communicate via TLS 1.2 with a set of cipher suites client supports
1. The server receives that and answers with a *ServerHello* that agrees to communication with client via TLS 1.2 using a particular cipher suite
1. Along with that the server sends its key share. The specifics of this key share change based on what cipher suite was selected. The important detail  to note is that for the client and server to agree on a cryptographic key, they need to receive each other's portion, or share.
1. The server sends the  certificate (signed by the CA) and a signature on portions of *ClientHello* and *ServerHello*, including the key share, so that the client knows that those are authentic.
1. After the  client successfully receives above mentioned data, and *then* generates its own key share, mixes it with the server key share, and thus generates the encryption keys for the session.
1. As the final steps, the client sends the server its key share, enables encryption and sends a *Finished* message (which is a hash of a transcript of what happened so far). The server does the same: it mixes the key shares to get the key and sends its own Finished message.
1. At that time application  data can be sent encrypted on the connection.

## Certificate Chains

A **certificate chain** is an ordered list of certificates, containing an SSL/TLS Certificate and Certificate Authority (CA) Certificates, that enables the receiver to verify that the sender and all CA's are trustworthy. The chain or path begins with the SSL/TLS certificate, and each certificate in the chain is signed by the entity identified by the next certificate in the chain.
The chain terminates with a **root CA certificate**. The **root CA certificate** is always signed by the Certificate Authority (CA) itself. The signatures of all certificates in the chain must be verified up to the root CA certificate.
Any certificate that sits between the SSL/TLS certificate and the root CA certificate in the chain is called an intermediate certificate. 


## TLS versions

There are several government entities worldwide that maintain guidelines for TLS regarding network security, including Department of Health and Human Services (HHS) or the National Institute of Standards and Technology (NIST) in the United States. The level of security that TLS provides is most affected by the TLS protocol version and the supported cipher suites. A cipher suite is a set of algorithms, including a cipher, a key-exchange algorithm and a hashing algorithm, which are used together to establish a secure TLS connection. Most TLS clients and servers support multiple alternatives, so they have to negotiate when establishing a secure connection to select a common TLS version and cipher suite.

Azure Database for PostgreSQL supports TLS version 1.2 and later. In [RFC 8996](https://datatracker.ietf.org/doc/rfc8996/), the Internet Engineering Task Force (IETF) explicitly states that TLS 1.0 and TLS 1.1 must not be used. Both protocols were deprecated by the end of 2019.

All incoming connections that use earlier versions of the TLS protocol, such as TLS 1.0 and TLS 1.1, are denied by default.

> [!NOTE]  
> SSL and TLS certificates certify that your connection is secured with state-of-the-art encryption protocols. By encrypting your  connection on the wire, you prevent unauthorized access to your data while in transit. This is why we strongly recommend using latest versions of TLS to encrypt your connections to Azure Database for PostgreSQL flexible server.  
> Although it's not recommended, if needed, you have an option to disable TLS\SSL for connections to Azure Database for PostgreSQL flexible server by updating  the **require_secure_transport** server parameter to OFF. You can also set TLS version by setting **ssl_min_protocol_version** and **ssl_max_protocol_version** server parameters.

[Certificate authentication](https://www.postgresql.org/docs/current/auth-cert.html) is performed using **SSL client certificates** for authentication. In this scenario, PostgreSQL server compares the CN (common name) attribute of the client certificate presented, against the requested database user.
**Azure Database for PostgreSQL flexible server doesn't support SSL certificate based authentication at this time.**

> [!NOTE]
> Azure Database for PostgreSQL - Flexible server doesn't support [custom SSL\TLS certificates](https://www.postgresql.org/docs/current/ssl-tcp.html#SSL-CERTIFICATE-CREATION) at this time.

To determine your current TLS\SSL connection status, you can load the [sslinfo extension](concepts-extensions.md) and then call the `ssl_is_used()` function to determine if SSL is being used. The function returns t if the connection is using SSL, otherwise it returns f. You can also collect all the information about your Azure Database for PostgreSQL flexible server instance's SSL usage by process, client, and application by using the following query:

```sql
SELECT datname as "Database name", usename as "User name", ssl, client_addr, application_name, backend_type
   FROM pg_stat_ssl
   JOIN pg_stat_activity
   ON pg_stat_ssl.pid = pg_stat_activity.pid
   ORDER BY ssl;
```

For testing, you can also use the **openssl** command directly, for example:
```bash
openssl s_client -connect localhost:5432 -starttls postgres
```
This command prints numerous low-level protocol information, including the TLS version, cipher, and so on. You must use the option -starttls postgres, or otherwise this command reports that no SSL is in use. Using this command requires at least OpenSSL 1.1.1. 

> [!NOTE]  
> To enforce **latest, most secure TLS version** for connectivity protection from client to Azure Database for PostgreSQL flexible server set **ssl_min_protocol_version** to **1.3**. That would **require** clients connecting to your Azure Database for PostgreSQL flexible server instance to use **this version of the protocol only** to securely communicate. However, older clients, since they don't support this version, may not be able to communicate with the server.

## Configuring SSL on the Client

By default, PostgreSQL doesn't perform any verification of the server certificate. This means that it's possible to spoof the server identity (for example by modifying a DNS record or by taking over the server IP address) without the client knowing. All SSL options carry overhead in the form of encryption and key-exchange, so there's a trade-off that has to be made between performance and security.
In order to prevent spoofing, SSL certificate verification on the client must be used.
There are many connection parameters for configuring the client for SSL. Few important to us are:
1. **ssl**.  Connect using SSL. This property doesn't need a value associated with it. The mere presence of it specifies an SSL connection. However, for compatibility with future versions, the value "true" is preferred.  In this mode, when establishing an SSL connection the client driver validates the server's identity preventing "man in the middle" attacks. It does this by checking that the server certificate is signed by a trusted authority, and that the host you're connecting to is the same as the hostname in the certificate.
2. **sslmode**. If you require encryption and want the connection to fail if it can't be encrypted then set  **sslmode=require**.  This ensures that the server is configured to accept SSL connections for this Host/IP address and that the server recognizes the client certificate. In other words if the server doesn't accept SSL connections or the client certificate isn't recognized the connection will fail. Table below list values for this setting:

| SSL Mode | Explanation | 
|----------|-------------|
|disable   | Encryption isn't used|
|allow     | Encryption is used if f server settings require\enforce it|
|prefer    | Encryption is used if server settings allow for it|
|require   | Encryption is used. This ensures that the server is configured to accept SSL connections for this Host IP address and that the server recognizes the client certificate.|
|verify-ca| Encryption is used. Moreover, verify the server certificate signature against certificate stored on the client|
|verify-full| Encryption is used. Moreover, verify server certificate signature and host name  against certificate stored on the client|

The default **sslmode** mode used is different between libpq-based clients (such as psql) and JDBC. The libpq-based clients default to *prefer*, and JDBC clients default to *verify-full*.

3. **sslcert**, **sslkey**, and **sslrootcert**. These parameters can override default location of the client certificate, the PKCS-8 client key and root certificate. These defaults to /defaultdir/postgresql.crt, /defaultdir/postgresql.pk8, and /defaultdir/root.crt respectively where defaultdir is ${user.home}/.postgresql/ in *nix systems and %appdata%/postgresql/ on windows. 



**Certificate Authorities (CAs)** are the institutions responsible for issuing certificates. A trusted certificate authority is an entity that’s entitled to verify someone is who they say they are. In order for this model to work, all participants must agree on a set of trusted CAs. All operating systems and most web browsers ship with a set of trusted CAs.

> [!NOTE]  
> Using verify-ca and verify-full **sslmode** configuration settings can also be known as **[certificate pinning](../../security/fundamentals/certificate-pinning.md#how-to-address-certificate-pinning-in-your-application)**. In this case root CA certificates on the PostgreSQL server have to match certificate signature and even host name against certificate on the client. Important to remember, you might periodically need to update client stored certificates when Certificate Authorities change or expire on PostgreSQL server certificates. To determine if you are pinning CAs, please refer to [Certificate pinning and Azure services](../../security/fundamentals/certificate-pinning.md#how-to-address-certificate-pinning-in-your-application). 

For more on SSL\TLS configuration on the client, see [PostgreSQL documentation](https://www.postgresql.org/docs/current/ssl-tcp.html#SSL-CLIENT-CERTIFICATES).

> [!NOTE]
>  For clients that use **verify-ca** and **verify-full** sslmode configuration settings, i.e. certificate pinning, they have to accept **both** root CA certificates:
> * For connectivity to servers deployed to Azure government cloud regions (US Gov Virginia, US Gov Texas, US Gov Arizona):  [DigiCert Global Root G2](https://www.digicert.com/kb/digicert-root-certificates.htm) and [Microsoft RSA Root Certificate Authority 2017](https://www.microsoft.com/pkiops/docs/repository.htm) root CA certificates, as services are migrating from Digicert to Microsoft CA. 
> * For connectivity to servers deployed to Azure public cloud regions worldwide : [Digicert Global Root CA](https://www.digicert.com/kb/digicert-root-certificates.htm) and [Microsoft RSA Root Certificate Authority 2017](https://www.microsoft.com/pkiops/docs/repository.htm), as services are migrating from Digicert to Microsoft CA.

### Downloading Root CA certificates and updating application clients in certificate pinning scenarios

To update client applications in certificate pinning scenarios, you can download certificates from following URIs:
* For connectivity to servers deployed to Azure Government cloud regions (US Gov Virginia, US Gov Texas, US Gov Arizona) download Microsoft RSA Root Certificate Authority 2017 and DigiCert Global Root G2 certificates from following URIs:
 Microsoft RSA Root Certificate Authority 2017  https://www.microsoft.com/pkiops/certs/Microsoft%20RSA%20Root%20Certificate%20Authority%202017.crt, 
 DigiCert Global Root G2  https://cacerts.digicert.com/DigiCertGlobalRootG2.crt.pem.
* For connectivity to servers deployed in Azure public regions worldwide download Microsoft RSA Root Certificate Authority 2017 and DigiCert Global Root CA certificates from following URIs:
Microsoft RSA Root Certificate Authority 2017  https://www.microsoft.com/pkiops/certs/Microsoft%20RSA%20Root%20Certificate%20Authority%202017.crt, Digicert Global Root CA https://cacerts.digicert.com/DigiCertGlobalRootCA.crt
* Optionally, to prevent future disruption, it's also recommended to add the following roots to the trusted store:
  Microsoft ECC Root Certificate Authority 2017 - https://www.microsoft.com/pkiops/certs/Microsoft%20ECC%20Root%20Certificate%20Authority%202017.crt

To import certificates to client certificate stores you may have to **convert certificate .crt files to .pem format**, after downloading certificate files from URIs above. You can use OpenSSL utility to do these file conversions, as shown in example below:

```powershell
openssl x509 -in certificate.crt -out certificate.pem -outform PEM
```

**Detailed information on updating client applications certificate stores with new Root CA certificates has been documented in this [how-to document](../flexible-server/how-to-update-client-certificates-java.md)**. 


> [!IMPORTANT]
> Some of the Postgres client libraries, while using **sslmode=verify-full** setting, may experience connection failures with Root CA certificates that are cross-signed with intermediate certificates, resulting in alternate trust paths. In this case, its recommended explicitly specify **sslrootcert** parameter, explained above, or set the PGSSLROOTCERT environment variable to local path where Microsoft RSA Root Certificate Authority 2017 Root CA certificate is placed, from default value of *%APPDATA%\postgresql\root.crt*. 


### Read Replicas with certificate pinning scenarios

With Root CA migration to [Microsoft RSA Root Certificate Authority 2017](https://www.microsoft.com/pkiops/docs/repository.htm) it's feasible for newly created replicas to be on a newer Root CA certificate than primary server created earlier. 
Therefore, for clients that use **verify-ca** and **verify-full** sslmode configuration settings, that is, certificate pinning, is imperative for interrupted connectivity to accept **both** root CA certificates:
  * For connectivity to servers deployed to Azure Government cloud regions (US Gov Virginia, US Gov Texas, US Gov Arizona):  [DigiCert Global Root G2](https://www.digicert.com/kb/digicert-root-certificates.htm) and [Microsoft RSA Root Certificate Authority 2017](https://www.microsoft.com/pkiops/docs/repository.htm) root CA certificates, as services are migrating from Digicert to Microsoft CA. 
  * For connectivity to servers deployed to Azure public cloud regions worldwide: [Digicert Global Root CA](https://www.digicert.com/kb/digicert-root-certificates.htm) and [Microsoft RSA Root Certificate Authority 2017](https://www.microsoft.com/pkiops/docs/repository.htm), as services are migrating from Digicert to Microsoft CA.

> [!NOTE]
> Azure Database for PostgreSQL - Flexible server doesn't support [certificate based authentication](https://www.postgresql.org/docs/current/auth-cert.html) at this time.

### Testing client certificates by connecting with psql in certificate pinning scenarios

You can use psql command line from your client to test connectivity to the server in  certificate pinning scenarios, as shown in example below:

```bash

$ psql "host=hostname.postgres.database.azure.com port=5432 user=myuser dbname=mydatabase sslmode=verify-full sslcert=client.crt sslkey=client.key sslrootcert=ca.crt"

```
For more on ssl and certificate parameters, you can follow [psql documentation.](https://www.postgresql.org/docs/current/app-psql.html)

## Testing SSL/TLS Connectivity

Before trying to access your SSL enabled server from client application, make sure you can get to it via psql. You should see output similar to the following if you  established an SSL connection.


*psql (14.5)*
*SSL connection (protocol: TLSv1.2, cipher: ECDHE-RSA-AES256-GCM-SHA384, bits: 256, compression: off)*
*Type "help" for help.*

You can also load the **[sslinfo extension](./concepts-extensions.md)** and then call the *ssl_is_used()* function to determine if SSL is being used. The function returns t if the connection is using SSL, otherwise it returns f.



## Cipher Suites

A **cipher suite** is a set of cryptographic algorithms. TLS/SSL protocols use algorithms from a cipher suite to create keys and encrypt information. 
A cipher suite is displayed as a long string of seemingly random information—but each segment of that string contains essential information. Generally, this data string is made up of several key components:
- Protocol (that is, TLS 1.2 or TLS 1.3)
- Key exchange or agreement algorithm
- Digital signature (authentication) algorithm
- Bulk encryption algorithm
- Message authentication code algorithm (MAC)

Different versions of SSL/TLS support different cipher suites. TLS 1.2 cipher suites can’t be negotiated with TLS 1.3 connections and vice versa.
As of this time Azure Database for PostgreSQL flexible server supports many cipher suites with TLS 1.2 protocol version that fall into [HIGH:!aNULL](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-SSL-CIPHERS) category. 

## Troubleshooting SSL\TLS connectivity errors

1. The first step to troubleshoot SSL/TLS protocol version compatibility is to identify the error messages that you or your users are seeing when trying to access your Azure Database for PostgreSQL - Flexible Server under TLS encryption from the client. Depending on the  application and platform, the error messages might be different, but in many cases point to underlying issue. 
2. To be certain of SSL/TLS protocol version compatibility, you should check the SSL/TLS configuration of the database server and the application client to make sure they support compatible versions and cipher suites.
3. Analyze any discrepancies or gaps between the database server and the client's SSL/TLS versions and cipher suites, and try to resolve them by enabling or disabling certain options, upgrading or downgrading software, or changing certificates or keys. For example, you might need to enable or disable specific SSL/TLS versions on the server or the client depending on security and compatibility requirements – such as disabling TLS 1.0 and TLS 1.1, which are considered insecure and deprecated, and enabling TLS 1.2 and TLS 1.3, which are more secure and modern.



## Related content

- Learn how to create an Azure Database for PostgreSQL flexible server instance by using the **Private access (VNet integration)** option in [the Azure portal](how-to-manage-virtual-network-portal.md) or [the Azure CLI](how-to-manage-virtual-network-cli.md).
- Learn how to create an Azure Database for PostgreSQL flexible server instance by using the **Public access (allowed IP addresses)** option in [the Azure portal](how-to-manage-firewall-portal.md) or [the Azure CLI](how-to-manage-firewall-cli.md).
