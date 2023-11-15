---
title: Networking overview - Azure Database for PostgreSQL - Flexible Server using SSL and TLS
description: Learn about secure connectivity with Flexible Server using SSL and TLS
author: GennadNY
ms.author: gennadyk
ms.reviewer: maghan
ms.date: 10/12/2023
ms.service: postgresql
ms.subservice: flexible-server
ms.custom:
  - ignite-2023
ms.topic: conceptual
---

# Secure connectivity with TLS and SSL

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Azure Database for PostgreSQL - Flexible Server enforces connecting your client applications to the PostgreSQL service by using Transport Layer Security (TLS). TLS is an industry-standard protocol that ensures encrypted network connections between your database server and client applications. TLS is an updated protocol of Secure Sockets Layer (SSL).

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

## TLS versions

There are several government entities worldwide that maintain guidelines for TLS with regard to network security, including Department of Health and Human Services (HHS) or the National Institute of Standards and Technology (NIST) in the United States. The level of security that TLS provides is most affected by the TLS protocol version and the supported cipher suites. A cipher suite is a set of algorithms, including a cipher, a key-exchange algorithm and a hashing algorithm, which are used together to establish a secure TLS connection. Most TLS clients and servers support multiple alternatives, so they have to negotiate when establishing a secure connection to select a common TLS version and cipher suite.

Azure Database for PostgreSQL supports TLS version 1.2 and later. In [RFC 8996](https://datatracker.ietf.org/doc/rfc8996/), the Internet Engineering Task Force (IETF) explicitly states that TLS 1.0 and TLS 1.1 must not be used. Both protocols were deprecated by the end of 2019.

All incoming connections that use earlier versions of the TLS protocol, such as TLS 1.0 and TLS 1.1, will be denied by default.

> [!NOTE]  
> SSL and TLS certificates certify that your connection is secured with state-of-the-art encryption protocols. By encrypting your  connection on the wire, you prevent unauthorized access to your data while in transit. This is why we strongly recommend using latest versions of TLS to encrypt your connections to Azure Database for PostgreSQL - Flexible Server.  
> Although it's not recommended, if needed, you have an option to disable TLS\SSL for connections to Azure Database for PostgreSQL - Flexible Server by updating  the **require_secure_transport** server parameter to OFF. You can also set TLS version by setting **ssl_min_protocol_version** and **ssl_max_protocol_version** server parameters.

[Certificate authentication](https://www.postgresql.org/docs/current/auth-cert.html) is performed using **SSL client certificates** for authentication. In this scenario, PostgreSQL server compares the CN (common name) attribute of the client certificate presented, against the requested database user.
**Azure Database for PostgreSQL - Flexible Server does not support SSL certificate based authentication at this time.**

To determine your current TLS\SSL connection status you can load the [sslinfo extension](concepts-extensions.md) and then call the `ssl_is_used()` function to determine if SSL is being used. The function returns t if the connection is using SSL, otherwise it returns f. You can also collect all the information about your Azure Database for PostgreSQL - Flexible Server instance's SSL usage by process, client, and application by using the following query:

```sql
SELECT datname as "Database name", usename as "User name", ssl, client_addr, application_name, backend_type
   FROM pg_stat_ssl
   JOIN pg_stat_activity
   ON pg_stat_ssl.pid = pg_stat_activity.pid
   ORDER BY ssl;
```
## Cipher Suites

A **cipher suite** is a set of cryptographic algorithms. TLS/SSL protocols use algorithms from a cipher suite to create keys and encrypt information. 
A cipher suite is generally displayed as a long string of seemingly random information — but each segment of that string contains essential information. Generally, this data string is made up of several key components:
- Protocol (i.e., TLS 1.2 or TLS 1.3)
- Key exchange or agreement algorithm
- Digital signature (authentication) algorithm
- Bulk encryption algorithm
- Message authentication code algorithm (MAC)

Different versions of SSL/TLS support different cipher suites. TLS 1.2 cipher suites can’t be negotiated with TLS 1.3 connections and vice versa.
As of this time Azure Database for PostgreSQL - Flexible Server supports number of cipher suites with TLS 1.2 protocol version that fall into [HIGH:!aNULL](https://www.postgresql.org/docs/16/runtime-config-connection.html#GUC-SSL-CIPHERS)  category. 


## Related content

- Learn how to create a flexible server by using the **Private access (VNet integration)** option in [the Azure portal](how-to-manage-virtual-network-portal.md) or [the Azure CLI](how-to-manage-virtual-network-cli.md).
- Learn how to create a flexible server by using the **Public access (allowed IP addresses)** option in [the Azure portal](how-to-manage-firewall-portal.md) or [the Azure CLI](how-to-manage-firewall-cli.md).
