---
title: Updating Client SSL/TLS Certificates for Java
description: Learn about updating Java clients with Flexible Server using SSL and TLS.
author: GennadNY
ms.author: gennadyk
ms.reviewer: maghan
ms.date: 04/27/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Update Client TLS Certificates for Application Clients with Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]


## Import Root CA Certificates in Java Key Store on the client for certificate pinning scenarios

Custom-written Java applications  use a default keystore, called *cacerts*, which contains trusted certificate authority (CA) certificates. It's also often known as Java trust store. A certificates file named *cacerts* resides in the security properties directory, java.home\lib\security, where java.home is the runtime environment directory (the jre directory in the SDK or the top-level directory of the Java™ 2 Runtime Environment).
You can use following directions to update client root CA certificates for client certificate pinning scenarios with PostgreSQL Flexible Server:
1. Check *cacerts* java keystore to see if it already contains required certificates. You can list certificates in Java keystore by using following command:
  ```powershell
    keytool -list -v -keystore ..\lib\security\cacerts > outputfile.txt
  ```
If necessary certificates are not present in the java key store on the client,as can be checked in output, you should proceed with following directions:
   
1. Make a backup copy of your custom keystore.
2. Download [certificates](../flexible-server/concepts-networking-ssl-tls.md#downloading-root-ca-certificates-and-updating-application-clients-in-certificate-pinning-scenarios)
3. Generate a combined CA certificate store with both Root CA certificates are included. Example below shows using DefaultJavaSSLFactory for PostgreSQL JDBC users.

     * For connectivity to servers deployed to Azure Government cloud regions (US Gov Virginia, US Gov Texas, US Gov Arizona) 
     ```powershell
 
 
         keytool -importcert -alias PostgreSQLServerCACert  -file D:\ DigiCertGlobalRootG2.crt.pem   -keystore truststore -storepass password -noprompt

         keytool -importcert -alias PostgreSQLServerCACert2  -file "D:\ Microsoft ECC Root Certificate Authority 2017.crt.pem" -keystore truststore -storepass password  -noprompt
      ```
     * For connectivity to servers deployed in Azure public regions worldwide
    ```powershell

         keytool -importcert -alias PostgreSQLServerCACert  -file D:\ DigiCertGlobalRootCA.crt.pem   -keystore truststore -storepass password -noprompt

         keytool -importcert -alias PostgreSQLServerCACert2  -file "D:\ Microsoft ECC Root Certificate Authority 2017.crt.pem" -keystore truststore -storepass password  -noprompt
    ```

 5. Replace the original keystore file with the new generated one:
 
    ```java
    System.setProperty("javax.net.ssl.trustStore","path_to_truststore_file");
    System.setProperty("javax.net.ssl.trustStorePassword","password");
    ```
6. Replace the original root CA pem file with the combined root CA file and restart your application/client.

For more information on configuring client certificates with PostgreSQL JDBC driver, see this [documentation.](https://jdbc.postgresql.org/documentation/ssl/)

> [!NOTE]
> To import certificates to client certificate stores you may have to convert certificate .crt files to .pem format. You ?..can use **[OpenSSL utility to do these file conversions](./concepts-networking-ssl-tls.md#downloading-root-ca-certificates-and-updating-application-clients-in-certificate-pinning-scenarios)**.

## Get list of trusted certificates in Java Key Store programmatically

As stated above, Java, by default, stores the trusted certificates in a special file named *cacerts* that is located inside  Java installation folder on the client.
Example below first reads *cacerts* and loads it into *KeyStore* object:
```java
private KeyStore loadKeyStore() {
    String relativeCacertsPath = "/lib/security/cacerts".replace("/", File.separator);
    String filename = System.getProperty("java.home") + relativeCacertsPath;
    FileInputStream is = new FileInputStream(filename);
    KeyStore keystore = KeyStore.getInstance(KeyStore.getDefaultType());
    String password = "changeit";
    keystore.load(is, password.toCharArray());

    return keystore;
}
```
The default password for *cacerts* is *changeit* , but should be different on real client, as administrators recommend changing password immediately after Java installation.
Once we loaded KeyStore object, we can use the *PKIXParameters* class to read certificates present. 
```java
public void whenLoadingCacertsKeyStore_thenCertificatesArePresent() {
    KeyStore keyStore = loadKeyStore();
    PKIXParameters params = new PKIXParameters(keyStore);
    Set<TrustAnchor> trustAnchors = params.getTrustAnchors();
    List<Certificate> certificates = trustAnchors.stream()
      .map(TrustAnchor::getTrustedCert)
      .collect(Collectors.toList());

    assertFalse(certificates.isEmpty());
}
```
## Update Root CA certificates when using clients in Azure App Services with Azure Database for PostgreSQL - Flexible Server for certificate pinning scenarios

For Azure App services, connecting to Azure Database for PostgreSQL, we can have two possible scenarios on updating client certificates and it depends on how on you're using SSL with your application deployed to Azure App Services.

* Usually new certificates are added to App Service at platform level prior to changes in Azure Database for PostgreSQL - Flexible Server. If you're using the SSL certificates included on App Service platform in your application, then no action is needed. Consult following [Azure App Service documentation](../../app-service/configure-ssl-certificate.md) for more information. 
* If you're explicitly including the path to SSL cert file in your code, then you would need to download the new cert and update the code to use the new cert. A good example of this scenario is when you use custom containers in App Service as shared in the [App Service documentation](../../app-service/tutorial-multi-container-app.md#configure-database-variables-in-wordpress)

 ## Update Root CA certificates when using clients in Azure Kubernetes Service (AKS) with Azure Database for PostgreSQL - Flexible Server for certificate pinning scenarios

If you're trying to connect to the Azure Database for PostgreSQL using applications hosted in  Azure Kubernetes Services (AKS) and pinning certificates, it's similar to access from a dedicated customers host environment. Refer to the steps [here](../../aks/ingress-tls.md).

## Updating Root CA certificates for .NET (Npgsql) users on Windows with Azure Database for PostgreSQL - Flexible Server for certificate pinning scenarios

For .NET (Npgsql) users on Windows, connecting to Azure Database for PostgreSQL - Flexible Servers deployed in Azure Government cloud regions (US Gov Virginia, US Gov Texas, US Gov Arizona)  make sure **both** Microsoft RSA Root Certificate Authority 2017 and DigiCert Global Root G2 both exist in Windows Certificate Store, Trusted Root Certification Authorities. If any certificates don't exist, import the missing certificate.

For .NET (Npgsql) users on Windows, connecting to Azure Database for PostgreSQL - Flexible Servers deployed in Azure public regions worldwide  make sure **both** Microsoft RSA Root Certificate Authority 2017 and DigiCert Global Root CA **both** exist in Windows Certificate Store, Trusted Root Certification Authorities. If any certificates don't exist, import the missing certificate.



## Updating Root CA certificates for other clients for certificate pinning scenarios

For other PostgreSQL client users, you can merge two CA certificate files like this format below.

```azurecli


-----BEGIN CERTIFICATE-----
(Root CA1: DigiCertGlobalRootCA.crt.pem)
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
(Root CA2: Microsoft ECC Root Certificate Authority 2017.crt.pem)
-----END CERTIFICATE-----
```

## Related content

- Learn how to create an Azure Database for PostgreSQL flexible server instance by using the **Private access (VNet integration)** option in [the Azure portal](how-to-manage-virtual-network-portal.md) or [the Azure CLI](how-to-manage-virtual-network-cli.md).
- Learn how to create an Azure Database for PostgreSQL flexible server instance by using the **Public access (allowed IP addresses)** option in [the Azure portal](how-to-manage-firewall-portal.md) or [the Azure CLI](how-to-manage-firewall-cli.md).
