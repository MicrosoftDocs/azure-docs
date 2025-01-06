---
author: xfz11
description: Code example
ms.service: service-connector
ms.topic: include
ms.date: 1/2/2025
ms.author: xiaofanzhou
---

#### [.NET](#tab/dotnet)

1. Install dependencies.
    ```bash
    dotnet add package Microsoft.Azure.StackExchangeRedis --version 3.2.0
    ```
1. Add the authentication logic with environment variables set by Service Connector. For more information, see [Microsoft.Azure.StackExchangeRedis Extension](https://github.com/Azure/Microsoft.Azure.StackExchangeRedis).
    
    
    ```csharp
    using StackExchange.Redis;
    var cacheHostName = Environment.GetEnvironmentVariable("AZURE_REDIS_HOST");
    var configurationOptions = ConfigurationOptions.Parse($"{cacheHostName}:6380");

    // Uncomment the following lines corresponding to the authentication type you want to use.
    // For system-assigned identity.
    // await configurationOptions.ConfigureForAzureWithTokenCredentialAsync(new DefaultAzureCredential());

    // For user-assigned identity.
    // var managedIdentityClientId = Environment.GetEnvironmentVariable("AZURE_REDIS_CLIENTID");
    // await configurationOptions.ConfigureForAzureWithUserAssignedManagedIdentityAsync(managedIdentityClientId);

    // Service principal secret
    // var clientId = Environment.GetEnvironmentVariable("AZURE_REDIS_CLIENTID");
    // var tenantId = Environment.GetEnvironmentVariable("AZURE_REDIS_TENANTID");
    // var secret = Environment.GetEnvironmentVariable("AZURE_REDIS_CLIENTSECRET");
    // await configurationOptions.ConfigureForAzureWithServicePrincipalAsync(clientId, tenantId, secret);


    var connectionMultiplexer = await ConnectionMultiplexer.ConnectAsync(configurationOptions);
    ```
    
#### [Java](#tab/java)

1. Add the following dependency in your *pom.xml* file:
    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-identity</artifactId>
        <version>1.11.2</version> <!-- {x-version-update;com.azure:azure-identity;dependency} -->
    </dependency>

    <dependency>
        <groupId>redis.clients</groupId>
        <artifactId>jedis</artifactId>
        <version>5.1.0</version>  <!-- {x-version-update;redis.clients:jedis;external_dependency} -->
    </dependency>
    ```
1. Add the authentication logic with environment variables set by Service Connector. For more information, see [Azure-AAD-Authentication-With-Jedis](https://aka.ms/redis/aad/sample-code/java-jedis).
    ```java
    import redis.clients.jedis.DefaultJedisClientConfig;
    import redis.clients.jedis.Jedis;
    import redis.clients.jedis.JedisShardInfo;
    import java.net.URI;
    
    // Uncomment the following lines corresponding to the authentication type you want to use.
    // For system-assigned identity.
    // DefaultAzureCredential defaultAzureCredential = new DefaultAzureCredentialBuilder().build();

    // For user-assigned identity.
    // String clientId = System.getenv("AZURE_REDIS_CLIENTID");
    // DefaultAzureCredential defaultAzureCredential = new DefaultAzureCredentialBuilder().managedIdentityClientId(clientId).build();

    // For AKS workload identity identity.
    // String clientId = System.getenv("AZURE_REDIS_CLIENTID");
    // DefaultAzureCredential defaultAzureCredential = new DefaultAzureCredentialBuilder().workloadIdentityClientId(clientId).build();

    // For service principal.
    // String clientId = System.getenv("AZURE_REDIS_CLIENTID");
    // String secret = System.getenv("AZURE_REDIS_CLIENTSECRET");
    // String tenant = System.getenv("AZURE_REDIS_TENANTID");
    // ClientSecretCredential defaultAzureCredential = new ClientSecretCredentialBuilder().tenantId(tenant).clientId(clientId).clientSecret(secret).build();

    String token = defaultAzureCredential
    .getToken(new TokenRequestContext()
        .addScopes("https://redis.azure.com/.default")).block().getToken();

    // SSL connection is required.
    boolean useSsl = true;
    // TODO: Replace Host Name with Azure Cache for Redis Host Name.
    String username = extractUsernameFromToken(token);
    String cacheHostname = System.getenv("AZURE_REDIS_HOST");

    // Create Jedis client and connect to the Azure Cache for Redis over the TLS/SSL port using the access token as password.
    // Note, Redis Cache Host Name and Port are required below
    Jedis jedis = new Jedis(cacheHostname, 6380, DefaultJedisClientConfig.builder()
        .password(token) // Microsoft Entra access token as password is required.
        .user(username) // Username is Required
        .ssl(useSsl) // SSL Connection is Required
        .build());

    // Set a value against your key in the Redis cache.
    jedis.set("Az:key", "testValue");
    System.out.println(jedis.get("Az:key"));

    // Close the Jedis Client
    jedis.close();
    ```

#### [Python](#tab/python)

1. Install dependencies.
    ```bash
    pip install redis azure-identity
    ```
1. Add the authentication logic with environment variables set by Service Connector. For more information, see [azure-aad-auth-with-redis-py](https://aka.ms/redis/aad/sample-code/python).
    ```python
    import os
    import time
    import logging
    import redis
    import base64
    import json
    from azure.identity import DefaultAzureCredential
    
    host = os.getenv('AZURE_REDIS_HOST')
    scope = "https://redis.azure.com/.default"
    port = 6380  # Required

    def extract_username_from_token(token):
        parts = token.split('.')
        base64_str = parts[1]

        if len(base64_str) % 4 == 2:
            base64_str += "=="
        elif len(base64_str) % 4 == 3:
            base64_str += "="

        json_bytes = base64.b64decode(base64_str)
        json_str = json_bytes.decode('utf-8')
        jwt = json.loads(json_str)

        return jwt['oid']

    def re_authentication():
        _LOGGER = logging.getLogger(__name__)
        # Uncomment the following lines corresponding to the authentication type you want to use.
        # For system-assigned identity.
        # cred = DefaultAzureCredential()

        # For user-assigned identity.
        # client_id = os.getenv('AZURE_REDIS_CLIENTID')
        # cred = DefaultAzureCredential(managed_identity_client_id=client_id)

        # For user-assigned identity.
        # client_id = os.getenv('AZURE_REDIS_CLIENTID')
        # cred = DefaultAzureCredential(managed_identity_client_id=client_id)
        
        # For service principal.
        # tenant_id = os.getenv("AZURE_TENANT_ID")
        # client_id = os.getenv("AZURE_CLIENT_ID")
        # client_secret = os.getenv("AZURE_CLIENT_SECRET")
        # cred = ServicePrincipalCredentials(tenant=tenant_id, client_id=client_id, secret=client_secret)

        token = cred.get_token(scope)
        user_name = extract_username_from_token(token.token)
        r = redis.Redis(host=host,
                        port=port,
                        ssl=True,   # ssl connection is required.
                        username=user_name,
                        password=token.token,
                        decode_responses=True)
        max_retry = 3
        for index in range(max_retry):
            try:
                if _need_refreshing(token):
                    _LOGGER.info("Refreshing token...")
                    tmp_token = cred.get_token(scope)
                    if tmp_token:
                        token = tmp_token
                    r.execute_command("AUTH", user_name, token.token)
                r.set("Az:key1", "value1")
                t = r.get("Az:key1")
                print(t)
                break
            except redis.ConnectionError:
                _LOGGER.info("Connection lost. Reconnecting.")
                token = cred.get_token(scope)
                r = redis.Redis(host=host,
                                port=port,
                                ssl=True,   # ssl connection is required.
                                username=user_name,
                                password=token.token,
                                decode_responses=True)
            except Exception:
                _LOGGER.info("Unknown failures.")
                break


    def _need_refreshing(token, refresh_offset=300):
        return not token or token.expires_on - time.time() < refresh_offset

    if __name__ == '__main__':
        re_authentication()
    ```

#### [NodeJS](#tab/nodejs)

1. Install dependencies.
    ```bash
    npm install redis @azure/identity
    ```
1. Add the authentication logic with environment variables set by Service Connector. For more information, see (Azure Cache for Redis: Microsoft Entra ID with node-redis client library)[https://aka.ms/redis/aad/sample-code/js-noderedis].
    
    ```javascript
    import { createClient } from "redis";
    import { DefaultAzureCredential } from "@azure/identity";

    function extractUsernameFromToken(accessToken: AccessToken): string{
        const base64Metadata = accessToken.token.split(".")[1];
        const { oid } = JSON.parse(
            Buffer.from(base64Metadata, "base64").toString("utf8"),
        );
        return oid;
    }

    async function main() {
        // Uncomment the following lines corresponding to the authentication type you want to use.  
        // For system-assigned identity.
        // const credential = new DefaultAzureCredential();

        // For user-assigned identity.
        // const clientId = process.env.AZURE_REDIS_CLIENTID;
        // const credential = new DefaultAzureCredential({
        //     managedIdentityClientId: clientId
        // });
        
        // For service principal.
        // const tenantId = process.env.AZURE_REDIS_TENANTID;
        // const clientId = process.env.AZURE_REDIS_CLIENTID;
        // const clientSecret = process.env.AZURE_REDIS_CLIENTSECRET;
        // const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

        // Fetch a Microsoft Entra token to be used for authentication. This token will be used as the password.
        const redisScope = "https://redis.azure.com/.default";
        let accessToken = await credential.getToken(redisScope);
        console.log("access Token", accessToken);
        const host = process.env.AZURE_REDIS_HOST;

        // Create redis client and connect to the Azure Cache for Redis over the TLS port using the access token as password.
        const client = createClient({
            username: extractUsernameFromToken(accessToken),
            password: accessToken.token,
            url: `redis://${host}:6380`,
            pingInterval: 100000,
            socket: { 
            tls: true,
            keepAlive: 0 
            },
        });

        client.on("error", (err) => console.log("Redis Client Error", err));
        await client.connect();
        // Set a value against your key in the Azure Redis Cache.
        await client.set("Az:key", "value1312");
        // Get value of your key in the Azure Redis Cache.
        console.log("value-", await client.get("Az:key"));
    }

    main().catch((err) => {
        console.log("error code: ", err.code);
        console.log("error message: ", err.message);
        console.log("error stack: ", err.stack);
    });
    ```

### [Other](#tab/none)

For other languages, you can use the Azure Identity client library and connection information that Service Connector sets to the environment variables to connect to Azure Cache for Redis.