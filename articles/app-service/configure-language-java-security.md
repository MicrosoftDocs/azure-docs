---
title: Configure Security for Tomcat, JBoss, or Java SE Apps
description: Learn how to configure security for Tomcat, JBoss, or Java SE apps on Azure App Service, such as authentication, Key Vault references, and Java key store.
keywords: azure app service, web app, windows, oss, java, tomcat, jboss
ms.devlang: java
ms.topic: how-to
ms.date: 03/27/2026
ms.custom: devx-track-java, devx-track-azurecli, devx-track-extended-java, linux-related-content
zone_pivot_groups: app-service-java-hosting
adobe-target: true
author: cephalin
ms.author: cephalin
ms.service: azure-app-service

# customer intent: As a developer, I want to configure security for Tomcat, JBoss, or Java SE apps.

---

# Configure security for a Tomcat, JBoss, or Java SE app in Azure App Service

This article shows how to configure Java-specific security settings in App Service. Java applications that run in App Service have the same set of [security best practices](../security/fundamentals/paas-applications-using-app-services.md) as other applications.

[!INCLUDE [java-variants](includes/configure-language-java/java-variants.md)]

## Authenticate users (Easy Auth)

Set up app authentication in the Azure portal with the **Authentication and Authorization** option. From there, you can enable authentication using Microsoft Entra ID or social sign-ins like Facebook, Google, or GitHub. Azure portal configuration only works when configuring a single authentication provider. For more information, see [Configure your App Service app to use Microsoft Entra sign-in](configure-authentication-provider-aad.md) and the related articles for other identity providers. If you need to enable multiple sign-in providers, see [Customize sign-ins and sign-outs](configure-authentication-customize-sign-in-out.md).

::: zone pivot="java-javase"

Spring Boot developers can use the [Microsoft Entra Spring Boot starter](/java/azure/spring-framework/configure-spring-boot-starter-java-app-with-azure-active-directory) to secure applications using familiar Spring Security annotations and APIs. Be sure to increase the maximum header size in your *application.properties* file. We suggest a value of `16384`.

::: zone-end

::: zone pivot="java-tomcat"

Your Tomcat application can access the user's claims directly from the servlet by casting the Principal object to a Map object. The `Map` object maps each claim type to a collection of the claims for that type. In the following code example, `request` is an instance of `HttpServletRequest`.

```java
Map<String, Collection<String>> map = (Map<String, Collection<String>>) request.getUserPrincipal();
```

Now you can inspect the `Map` object for any specific claim. For example, the following code snippet iterates through all the claim types and prints the contents of each collection.

```java
for (Object key : map.keySet()) {
        Object value = map.get(key);
        if (value != null && value instanceof Collection {
            Collection claims = (Collection) value;
            for (Object claim : claims) {
                System.out.println(claims);
            }
        }
    }
```

To sign out users, use the `/.auth/ext/logout` path. To perform other actions, see [Customize sign-ins and sign-outs](configure-authentication-customize-sign-in-out.md). There's also official documentation on the Tomcat [HttpServletRequest interface](https://tomcat.apache.org/tomcat-5.5-doc/servletapi/javax/servlet/http/HttpServletRequest.html) and its methods. The following servlet methods are also hydrated based on your App Service configuration:

```java
public boolean isSecure()
public String getRemoteAddr()
public String getRemoteHost()
public String getScheme()
public int getServerPort()
```

To disable this feature, create an Application Setting named `WEBSITE_AUTH_SKIP_PRINCIPAL` with a value of `1`. To disable all servlet filters added by App Service, create a setting named `WEBSITE_SKIP_FILTERS` with a value of `1`.

::: zone-end

::: zone pivot="java-jboss"

For JBoss EAP, see the Tomcat tab.

::: zone-end

## Configure TLS

To upload an existing TLS certificate and bind it to your application's domain name, see [Enable HTTPS for a custom domain in Azure App Service](configure-ssl-bindings.md). You can also configure the app to enforce TLS.

## Use Azure Key Vault references

[Azure Key Vault](/azure/key-vault/general/overview) provides centralized secret management with access policies and audit history. You can store secrets, such as passwords or connection strings, in a key vault. You can access these secrets in your application through environment variables.

First, [grant your app access to a key vault](app-service-key-vault-references.md#grant-your-app-access-to-a-key-vault) and [make a Key Vault reference to your secret in an Application Setting](app-service-key-vault-references.md#source-app-settings-from-key-vault). You can validate that the reference resolves to the secret by printing the environment variable while remotely accessing the App Service terminal.

::: zone pivot="java-javase"

For Spring configuration files, see [Externalized Configuration](https://docs.spring.io/spring-boot/reference/features/external-config.html).

To inject these secrets in your Spring configuration file, use environment variable injection syntax (`${MY_ENV_VAR}`).

::: zone-end

::: zone pivot="java-tomcat"

To inject these secrets in your Tomcat configuration file, use environment variable injection syntax (`${MY_ENV_VAR}`).

::: zone-end

## Use the Java key store in Linux

By default, any public or private certificates [uploaded to App Service Linux](configure-ssl-certificate.md) are loaded into the respective Java key stores when the container starts. After uploading your certificate, you'll need to restart your App Service for it to load into the Java key store. Public certificates are loaded into the key store at `$JRE_HOME/lib/security/cacerts`. Private certificates are stored in `$JRE_HOME/lib/security/client.jks`.

More configuration might be necessary for encrypting your JDBC connection with certificates in the Java key store:

- [PostgreSQL](https://jdbc.postgresql.org/documentation/ssl/)
- [SQL Server](/sql/connect/jdbc/connecting-with-ssl-encryption)
- [MongoDB](https://mongodb.github.io/mongo-java-driver/3.4/driver/tutorials/ssl/)
- [Cassandra](https://docs.datastax.com/en/developer/java-driver/4.3/)

### Initialize the Java key store in Linux

To initialize the `import java.security.KeyStore` object, load the keystore file with the password. The default password for both key stores is `changeit`.

```java
KeyStore keyStore = KeyStore.getInstance("jks");
keyStore.load(
    new FileInputStream(System.getenv("JRE_HOME")+"/lib/security/cacerts"),
    "changeit".toCharArray());

KeyStore keyStore = KeyStore.getInstance("pkcs12");
keyStore.load(
    new FileInputStream(System.getenv("JRE_HOME")+"/lib/security/client.jks"),
    "changeit".toCharArray());
```

### Manually load the key store in Linux

You can load certificates manually to the key store. To disable App Service from loading the certificates into the key store automatically, create an app setting, `SKIP_JAVA_KEYSTORE_LOAD`, with a value of `1`. All public certificates uploaded to App Service by using the Azure portal are stored under `/var/ssl/certs/`. Private certificates are stored under `/var/ssl/private/`.

To interact or debug the Java Key Tool, [open an SSH connection](configure-linux-open-ssh-session.md) to your App Service and run the command `keytool`. See the [Key Tool documentation](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/keytool.html) for a list of commands. For more information on the KeyStore API, see [Class KeyStore](https://docs.oracle.com/javase/8/docs/api/java/security/KeyStore.html).

## Related content 

Visit the [Azure for Java Developers](/java/azure/) center to find Azure quickstarts, tutorials, and Java reference documentation.

- [App Service Linux FAQ](faq-app-service-linux.yml)
- [Environment variables and app settings reference](reference-app-settings.md)
