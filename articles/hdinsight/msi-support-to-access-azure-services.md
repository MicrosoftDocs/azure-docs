---
title: MSI Support to Access Azure Services
description: Learn how to provide MSI Support to Access Azure Services.
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive
ms.date: 05/29/2024
---

# MSI Support to Access Azure Services

A managed identity is an identity registered in Microsoft Entra whose credentials managed by Azure. With managed identities, you don't need to register service principals in Microsoft Entra ID. Or maintain credentials such as certificates.

This article explains the  HDInsight interface and code details to fetch OAuth tokens in a non-ESP cluster.

## Prerequisites

* This feature is available only in the latest HDInsight-5.1 version 5.1.3000.0.2403290825 onwards. Make sure you recreated or installed this cluster version.
* HDInsight Cluster must be with ADL-Gen2 storage as primary storage, which enables MSI based access for this storage. This same MSI used for all job resources access. Ensure the required IAM permissions given to this MSI to access Azure resources.


There are two methods to implement this task.

* Option 1 HDInsight utility and  API usage to fetch access token.
* Option 2 HDInsight utility, TokenCredential Implementation to fetch Access Token.

## Option 1 - HDInsight utility and  API usage to fetch access token.

Implemented a convenient utility class to fetch MSI access token by providing target resource URI, which can be EH, KV, Kusto, SqlDB, Cosmos DB etc.

### Prerequisites

1. Make sure the Hadoop's core-site.xml and all the client jars from this cluster location /usr/hdp/5.1.5.3/hadoop/client/* in the classpath.
1. Make sure the utility jar dependency is added into the application and compile time dependency. For more information, see []().

### How to use the API

To fetch the token, you can invoke the API in their Job application code.

```
import com.microsoft.azure.hdinsight.oauthtoken.utils.HdiIdentityTokenServiceUtils;
import com.microsoft.azure.hdinsight.oauthtoken.utils.AccessToken;

// uri can be EH, Kusto etc. 
// By default, the Scope is “.default”. 
// We will provide a mechanism to take user supplied scope, in future.
String msiResourceUri = https://vault.azure.net/;
HdiIdentityTokenServiceUtils tokenUtils = new HdiIdentityTokenServiceUtils();
AccessToken token = tokenUtils.getAccessToken(msiResourceUri);
```

### Structure of AccessToken

```
/** Represents an immutable access token with a token string and an expiration time 
* in date format. By default, 24hrs is the expiration time out.
*/
public class AccessToken {
  private final String token;
  private final Date expiresAt;
  
  public String getToken() {
    return this.token;
  }
 
  public Date getExpiresAt() {
    return this.expiresAt;
  }
}
```

### Jar Location of the Utils 
https://hdiconfigactions2.blob.core.windows.net/hdi-oauth-token-utils-jar/oauth-token-utils-shaded-1.0.jar

> [!NOTE] 
> Microsoft Azure Feed available shortly by May 31st, then the jar name, version and location changes.

## Option 2 -DI utility, TokenCredential Implementation to fetch Access Token

Provided `HdiIdentityTokenCredential` feature class, which is the standard implementation of `com.azure.core.credential.TokenCredential` interface.
Make sure, Hadoop's `core-site.xml` and all the client jars from this cluster location `/usr/hdp/5.1.5.3/hadoop/client/*` in classpath.

### Prerequisites

* Make sure Hadoop's core-site.xml, all the client jars from this cluster location `/usr/hdp/5.1.5.3/hadoop/client/*` and azure-core-1.45.0.jar in the classpath.
* Make sure the utility jar dependency is added into the application and compile time dependency. For more information, see []().

### If the client is a KV

We take an example of Azure Key Vault, SecretClient instance, which doesn't directly fetch an access token. It uses a TokenCredential to authenticate, and this credential handles fetching the access token.

```
import com.azure.core.credential.TokenCredential;
import com.azure.security.keyvault.secrets.SecretClient;
import com.azure.security.keyvault.secrets.SecretClientBuilder;
import com.microsoft.azure.hdinsight.oauthtoken.credential.HdiIdentityTokenCredential;
import com.microsoft.azure.hdinsight.oauthtoken.utils.HdiIdentityTokenServiceUtils;

// replace <resource-uri> with your key vault uri
TokenCredential hdiTokenCredential = new HdiIdentityTokenCredential("<resource-uri>");
 
// Create a SecretClient that will be used to call the service.
SecretClient secretClient = new SecretClientBuilder()
              .vaultUrl("<your-key-vault-url>") // replace with your Key Vault URL
              .credential(hdiTokenCredential) // add hdi identity token credential
              .buildClient();

// Retrieve a secret from the key vault.
// Replace with your secret name.
KeyVaultSecret secret = secretClient.getSecret("<your-secret-name>");
```

> [!NOTE]
> This is a standard token credential interface, the Azure resource clients which supported `TokenCredential` is the recommended approach.

Jar Location of the Utils

https://hdiconfigactions2.blob.core.windows.net/hdi-oauth-token-utils-jar/oauth-token-utils-shaded-1.1.jar

:::image type="content" source="./media/msi-support-to-access-azure-services/jar-file-location.png" alt-text="Screenshot showing jar file location." border="true" lightbox="./media/msi-support-to-access-azure-services/jar-file-location.png":::

## How to build application code with this utility

1. Download the utility from the jar location and keep it to the local `.m2` repository location.
   
:::image type="content" source="./media/msi-support-to-access-azure-services/download-jar-file.png" alt-text="Screenshot showing how to download-jar-file." border="true" lightbox="./media/msi-support-to-access-azure-services/download-jar-file.png":::

1. Add dependencies in the application build script pom.xml.

   :::image type="content" source="./media/msi-support-to-access-azure-services/add-dependencies.png" alt-text="Screenshot showing how to add dependencies." border="true" lightbox="./media/msi-support-to-access-azure-services/add-dependencies.png":::

1. Run maven command `mvn clean install -Dskiptests'

    









































