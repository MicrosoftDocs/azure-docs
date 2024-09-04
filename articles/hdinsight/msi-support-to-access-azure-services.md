---
title: MSI Support to Access Azure services
description: Learn how to provide MSI Support to Access Azure services.
ms.service: azure-hdinsight
ms.topic: how-to
ms.custom: hdinsightactive
ms.date: 07/09/2024
---

# MSI Support to access Azure services

Presently in Azure HDInsight non-ESP cluster, User Job accessing Azure resources like SqlDB, Cosmos DB, EH, KV, Kusto either using username and password or using MSI certificate key. This isn't in line with Microsoft security guidelines.

This article explains the  HDInsight interface and code details to fetch OAuth tokens in a non-ESP cluster.

## Prerequisites

* This feature is available in the latest HDInsight-5.1, 5.0, and 4.0 versions. Make sure you recreated or installed this cluster versions.
* HDInsight Cluster must be with ADL-Gen2 storage as primary storage, which enables MSI based access for this storage. This same MSI used for all job resources access. Ensure the required IAM permissions given to this MSI to access Azure resources.
* IMDS endpoint can't work for HDI worker nodes and the access tokens can be fetched using this HDInsight utility only.

There are two Java client implementations provided to fetch the access token.

* Option 1: HDInsight utility and  API usage to fetch access token.
* Option 2: HDInsight utility, TokenCredential Implementation to fetch Access Token.

> [!NOTE]
> By default, the Scope is “.default”. We will provide a mechanism in the utility API to pass the user supplied scope argument, in future.

## How to download the utility jar from Maven Central

Follow these steps to download client JARs from Maven Central.

Downloading the JAR in a Maven Build from Maven Central directly.

1. Add maven central as one of your repositories to resolve maven dependencies, ignore if already added.

    Add the following code snippet to the `repositories` section of your pom.xml file:

    ```
    <repository>
        <id>central</id>
        <url>https://repo.maven.apache.org/maven2/</url>
        <releases>
            <enabled>true</enabled>
        </releases>
        <snapshots>
            <enabled>true</enabled>
        </snapshots>
    </repository>
    ```
    
1. Following is the sample code snippet of HDInsight OAuth client utility library dependency, add the `dependency` section to your pom.xml

```
<dependency>
  <groupId>com.microsoft.azure.hdinsight</groupId>
  <artifactId>hdi-oauth-token-utils</artifactId>
  <version>1.0.0</version>
</dependency>
```

> [!IMPORTANT]
>
> Make sure the following items are in the class path.
> - Hadoop's `core-site.xml`
> - All the client jars from this cluster location `/usr/hdp/<hdi-version>/hadoop/client/*`
> - `azure-core-1.49.0.jar, okhttp3-4.9.3` and its transitive dependent jars.

### Structure of access token

Access token structure as follows.

```
package com.azure.core.credential;
import java.time.OffsetDateTime;
 
/** Represents an immutable access token with a token string and an expiration time 
* in date format. By default, 24hrs is the expiration time out.
*/
public class AccessToken {
  
  public String getToken();

  public OffsetDateTime getExpiresAt();
}
```


## Option 1 - HDInsight utility and  API usage to fetch access token

Implemented a convenient java utility class to fetch MSI access token by providing target resource URI, which can be EH, KV, Kusto, SqlDB, Cosmos DB etc.

### How to use the API

To fetch the token, you can invoke the API in your job application code.

```
import com.microsoft.azure.hdinsight.oauthtoken.utils.HdiIdentityTokenServiceUtils;
import com.azure.core.credential.AccessToken;

// uri can be EH, Kusto etc. 
// By default, the Scope is “.default”. 
// We will provide a mechanism to take user supplied scope, in future.
String msiResourceUri = https://vault.azure.net/;
HdiIdentityTokenServiceUtils tokenUtils = new HdiIdentityTokenServiceUtils();
AccessToken token = tokenUtils.getAccessToken(msiResourceUri);
```

## Option 2 - HDInsight Utility, TokenCredential implementation to fetch access token

Provided `HdiIdentityTokenCredential` feature java class, which is the standard implementation of `com.azure.core.credential.TokenCredential` interface.

> [!NOTE]
> The HdiIdentityTokenCredential class can be used with various Azure SDK client libraries to authenticate requests and access Azure services without manual access token management.

### Examples

Following are the HDInsight oauth utility examples, which can be used in job applications to fetch access tokens for the given target resource uri:

**If the client is a Key Vault**

For Azure Key Vault, the SecretClient instance uses a TokenCredential to authenticate and fetch the access token:

```
import com.azure.core.credential.TokenCredential;
import com.azure.security.keyvault.secrets.SecretClient;
import com.azure.security.keyvault.secrets.SecretClientBuilder;
import com.microsoft.azure.hdinsight.oauthtoken.credential.HdiIdentityTokenCredential;

// Replace <resource-uri> with your Key Vault URI.
TokenCredential hdiTokenCredential = new HdiIdentityTokenCredential("<resource-uri>");
 
// Create a SecretClient to call the service.
SecretClient secretClient = new SecretClientBuilder()
              .vaultUrl("<your-key-vault-url>") // Replace with your Key Vault URL.
              .credential(hdiTokenCredential) // Add HDI identity token credential.
              .buildClient();

// Retrieve a secret from the Key Vault.
// Replace with your secret name.
KeyVaultSecret secret = secretClient.getSecret("<your-secret-name>");
```

**If the client is a Event Hub**

Example of Azure Event Hubs, which doesn't directly fetch an access token. It uses a TokenCredential to authenticate, and this credential handles fetching the access token.

```
import com.azure.messaging.eventhubs.EventHubClientBuilder;
import com.azure.messaging.eventhubs.EventHubProducerClient;
import com.azure.core.credential.TokenCredential;
import com.microsoft.azure.hdinsight.oauthtoken.credential.HdiIdentityTokenCredential;
HdiIdentityTokenCredential hdiTokenCredential = new HdiIdentityTokenCredential("https://eventhubs.azure.net");
// Create a producer client
EventHubProducerClient producer = new EventHubClientBuilder()
    .credential("<fully-qualified-namespace>", "<event-hub-name>", hdiTokenCredential)
            .buildProducerClient();
 
// Use the producer client ....
```


**If the client is a MySql Database**

Example of Azure Sql Database, which doesn't directly fetch an access token.

Connect using access token callback: The following example demonstrates implementing and setting the accessToken callback

```
    package com.microsoft.azure.hdinsight.oauthtoken;
    
    import com.azure.core.credential.AccessToken;
    import com.microsoft.azure.hdinsight.oauthtoken.utils.HdiIdentityTokenServiceUtils;
    import com.microsoft.sqlserver.jdbc.SQLServerAccessTokenCallback;
    import com.microsoft.sqlserver.jdbc.SqlAuthenticationToken;
    
    public class HdiSQLAccessTokenCallback implements SQLServerAccessTokenCallback {
    
        @Override
        public SqlAuthenticationToken getAccessToken(String spn, String stsurl) {
            try {
    		    HdiIdentityTokenServiceUtils provider = new HdiIdentityTokenServiceUtils();
                AccessToken token = provider.getAccessToken("https://database.windows.net/";);
                return new SqlAuthenticationToken(token.getToken(), token.getExpiresAt().getTime());
            } catch (Exception e) {
                // handle exception... 
                return null;
            }
        }
    }
    
    
    
    package com.microsoft.azure.hdinsight.oauthtoken;
    
    import java.sql.DriverManager;
    
    public class HdiTokenClassBasedConnectionWithDriver {
    
        public static void main(String[] args) throws Exception {
    
    		// Below is the sample code to use hdi sql callback.
    		// Replaces <dbserver> with your server name and replaces <dbname> with your db name.
    		String connectionUrl = "jdbc:sqlserver://<dbserver>.database.windows.net;"
    				+ "database=<dbname>;"
    				+ "accessTokenCallbackClass=com.microsoft.azure.hdinsight.oauthtoken.HdiSQLAccessTokenCallback;"
    				+ "encrypt=true;"
    				+ "trustServerCertificate=false;"
    				+ "loginTimeout=30;";
    
    		DriverManager.getConnection(connectionUrl);
    		
    	}
    
    }
    
    package com.microsoft.azure.hdinsight.oauthtoken;
    
    import com.microsoft.azure.hdinsight.oauthtoken.HdiSQLAccessTokenCallback;
    import com.microsoft.sqlserver.jdbc.SQLServerDataSource;
    import java.sql.Connection;
    
    public class HdiTokenClassBasedConnectionWithDS {
    
        public static void main(String[] args) throws Exception {
    		
    		HdiSQLAccessTokenCallback callback = new HdiSQLAccessTokenCallback();
    
            SQLServerDataSource ds = new SQLServerDataSource();
            ds.setServerName("<db-server>"); // Replaces <db-server> with your server name.
            ds.setDatabaseName("<dbname>"); // Replace <dbname> with your database name.
            ds.setAccessTokenCallback(callback);
    
            ds.getConnection();
    	}
    }
```

    

**If the client is a Kusto**

Example of Azure Sql Database, which doesn't directly fetch an access token.

Connect using tokenproviderCallback:

The following example demonstrates accessToken callback provider,

```
public void createConnection () {

    final String clusterUrl = "https://xyz.eastus.kusto.windows.net";

    ConnectionStringBuilder conStrBuilder = ConnectionStringBuilder.createWithAadTokenProviderAuthentication(clusterUrl, new Callable<String>() {

      public String call() throws Exception {

        // Call HDI util class with scope. This returns the AT and from that get token string and return.
        // AccessToken contains expiry time and user can cache the token once acquired and call for a new one
        // if it is about to expire (Say, <= 30mins for expiry). 
        HdiIdentityTokenServiceUtils hdiUtil = new HdiIdentityTokenServiceUtils();

        AccessToken token = hdiUtil.getAccessToken(clusterUrl);

        return token.getToken();

      }

    });
  }
```

**Connect using pre-fetched Access Token:**

Fetches accesstoken explicitly and pass it as an option.

```
String targetResourceUri = "https://<my-kusto-cluster>";
HdiIdentityTokenServiceUtils tokenUtils = new HdiIdentityTokenServiceUtils();
AccessToken token = tokenUtils.getAccessToken(targetResourceUri);

df.write
  .format("com.microsoft.kusto.spark.datasource")
  .option(KustoSinkOptions.KUSTO_CLUSTER, "MyCluster")
  .option(KustoSinkOptions.KUSTO_DATABASE, "MyDatabase")
  .option(KustoSinkOptions.KUSTO_TABLE, "MyTable")
  .option(KustoSinkOptions.KUSTO_ACCESS_TOKEN, token.getToken())
  .option(KustoOptions., "MyTable")
  .mode(SaveMode.Append)
  .save()
```

> [!NOTE]
> HdiIdentityTokenCredential class can be used in combination with various Azure SDK client libraries to authenticate requests and access Azure services without the need to manage access tokens manually.

### Troubleshooting

Integrated **HdiIdentityTokenCredential** utility into the Spark job but hitting the following exception while accessing the token during runtime (Job execution).

```
User class threw exception: java.lang.NoSuchFieldError: Companion
at okhttp3.internal.Util.<clinit>(Util.kt:70)
at okhttp3.internal.concurrent.TaskRunner.<clinit>(TaskRunner.kt:309)
at okhttp3.ConnectionPool.<init>(ConnectionPool.kt:41)
at okhttp3.ConnectionPool.<init>(ConnectionPool.kt:47)
at okhttp3.OkHttpClient$Builder.<init>(OkHttpClient.kt:471)
at com.microsoft.azure.hdinsight.oauthtoken.utils.HdiIdentityTokenServiceUtils.getAccessToken(HdiIdentityTokenServiceUtils.java:142)
at com.microsoft.azure.hdinsight.oauthtoken.credential.HdiIdentityTokenCredential.getTokenSync(HdiIdentityTokenCredential.java:83)
```
**Answer:**

Following is the maven dependency tree of `hdi-oauth-util` library. User need to make sure that these jars are available at the runtime (in job container).

```
[INFO] +- com.azure:azure-core:jar:1.49.0:compile
[INFO] |  +- com.azure:azure-json:jar:1.1.0:compile
[INFO] |  +- com.azure:azure-xml:jar:1.0.0:compile
[INFO] |  +- com.fasterxml.jackson.core:jackson-annotations:jar:2.13.5:compile
[INFO] |  +- com.fasterxml.jackson.core:jackson-core:jar:2.13.5:compile
[INFO] |  +- com.fasterxml.jackson.datatype:jackson-datatype-jsr310:jar:2.13.5:compile
[INFO] |  \- io.projectreactor:reactor-core:jar:3.4.36:compile
[INFO] |     \- org.reactivestreams:reactive-streams:jar:1.0.4:compile
[INFO] \- com.squareup.okhttp3:okhttp:jar:4.9.3:compile
[INFO]    +- com.squareup.okio:okio:jar:2.8.0:compile
[INFO]    |  \- org.jetbrains.kotlin:kotlin-stdlib-common:jar:1.4.0:compile
[INFO]    \- org.jetbrains.kotlin:kotlin-stdlib:jar:1.4.10:compile
```

When you build the spark uber jar, user need to make sure these jars are shaded and included into the uber jar. Can refer the following plugins.

```xml
    <plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-shade-plugin</artifactId>
    <version>${maven.plugin.shade.version}</version>
    <configuration>
    <createDependencyReducedPom>false</createDependencyReducedPom>
    <relocations>
    <relocation>
    <pattern>okio</pattern>
    <shadedPattern>com.shaded.okio</shadedPattern>
    </relocation>
    <relocation>
    <pattern>okhttp</pattern>
    <shadedPattern>com.shaded.okhttp</shadedPattern>
    </relocation>
    <relocation>
    <pattern>okhttp3</pattern>
    <shadedPattern>com.shaded.okhttp3</shadedPattern>
    </relocation>
    <relocation>
    <pattern>kotlin</pattern>
    <shadedPattern>com.shaded.kotlin</shadedPattern>
    </relocation>
    <relocation>
    <pattern>com.fasterxml.jackson</pattern>
    <shadedPattern>com.shaded.com.fasterxml.jackson</shadedPattern>
    </relocation>
    <relocation>
    <pattern>com.azure</pattern>
    <shadedPattern>com.shaded.com.azure</shadedPattern>
    </relocation>
```
