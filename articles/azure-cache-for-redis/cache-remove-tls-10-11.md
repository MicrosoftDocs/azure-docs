---
title: Remove TLS 1.0 and 1.1 from use with Azure Cache for Redis
description: Learn how to remove TLS 1.0 and 1.1 from your application when communicating with Azure Cache for Redis


ms.topic: conceptual
ms.date: 02/05/2025

ms.custom: devx-track-azurepowershell, devx-track-azurecli

---

# Remove TLS 1.0 and 1.1 from use with Azure Cache for Redis

To meet the industry-wide push toward the exclusive use of Transport Layer Security (TLS) version 1.2 or later, Azure Cache for Redis is moving toward requiring the use of the TLS 1.2 in April 2025. TLS versions 1.0 and 1.1 are known to be susceptible to attacks such as BEAST and POODLE, and to have other Common Vulnerabilities and Exposures (CVE) weaknesses.

TLS versions 1.0 and 1.1 also don't support the modern encryption methods and cipher suites recommended by Payment Card Industry (PCI) compliance standards. This [TLS security blog](https://www.acunetix.com/blog/articles/tls-vulnerabilities-attacks-final-part/) explains some of these vulnerabilities in more detail.

> [!IMPORTANT]
> Starting April 1, 2025, the TLS 1.2 requirement will be enforced.

> [!IMPORTANT]
> The TLS 1.0/1.1 retirement content in this article does not apply to Azure Cache for Redis Enterprise/Enterprise Flash because the Enterprise tiers only support TLS 1.2 or newer.

As a part of this effort, you can expect the following changes to Azure Cache for Redis:

- _Phase 1_: Azure Cache for Redis stops offering TLS 1.0/1.1 as an option for _MinimumTLSVersion_ setting for new cache creates. Existing cache instances won't be updated at this point. You can't set the _MinimumTLSVersion_ to 1.0 or 1.1 for your existing cache.
- _Phase 2_: Azure Cache for Redis stops supporting TLS 1.1 and TLS 1.0 starting April 1, 2025. After this change, your application must use TLS 1.2 or later to communicate with your cache. The Azure Cache for Redis service remains available while we update the _MinimumTLSVersion_ for all caches to 1.2.

| Date | Description |
|--|--|
| September 2023 | TLS 1.0/1.1 retirement announcement |
| March 1, 2024 | Beginning March 1, 2024, you can't create new caches with the Minimum TLS version set to 1.0 or 1.1 and you can't set the _MinimumTLSVersion_ to 1.0 or 1.1 for your existing cache. The minimum TLS versions aren't updated automatically for existing caches at this point. |
| March 31, 2025 | Ensure that all your applications are connecting to Azure Cache for Redis using TLS 1.2 and Minimum TLS version on your cache settings is set to 1.2. |
| Starting April 1, 2025 | Minimum TLS version for all cache instances is updated to 1.2. This means Azure Cache for Redis instances reject connections using TLS 1.0 or 1.1 at this point. |

As part of this change, Azure Cache for Redis removes support for older cipher suites that aren't secure. Supported cipher suites are restricted to the following suites when the cache is configured with a minimum of TLS 1.2:

- TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384_P384
- TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256_P256

The following sections provide guidance about how to detect dependencies on these earlier TLS versions and remove them from your application.

## Check TLS versions supported by your Azure Cache for Redis

You can verify that **Minimum TLS version** value is set to TLS 1.2 in the [Advanced settings](cache-configure.md#advanced-settings) of your cache in the Azure portal. If it is any value other than TLS 1.2, then ensure you follow the instructions in section [Configure your Azure Cache for Redis to use TLS 1.2](#configure-your-azure-cache-for-redis-to-use-tls-12). If the value is TLS 1.2, and your client application is able to connect without any errors, then no action is needed.

You can also use this PowerShell script to verify the minimum TLS version supported by your Azure Cache for Redis endpoint. If your Redis instance is virtual network (VNet) injected, you have to run this script from a Virtual Machine in your VNet that has access to the Azure Cache for Redis endpoint. If the result shows `Tls Enabled` and/or `Tls 11 Enabled`, then ensure you follow the instructions in section [Configure your Azure Cache for Redis to use TLS 1.2](#configure-your-azure-cache-for-redis-to-use-tls-12). If the result shows only `Tls12 Enabled` and your client application is able to connect without any errors, then no action is needed.

```powershell
    param(
    [Parameter(Mandatory=$true)]
    [string]$redisCacheName,
    [Parameter(Mandatory=$false)]
    [string]$dnsSuffix = ".redis.cache.windows.net",
    [Parameter(Mandatory=$false)]
    [int]$connectionPort = 6380,
    [Parameter(Mandatory=$false)]
    [int]$timeoutMS = 2000
    )
    $redisEndpoint = "$redisCacheName$dnsSuffix"
    $protocols = @(
        [System.Security.Authentication.SslProtocols]::Tls,
        [System.Security.Authentication.SslProtocols]::Tls11,
        [System.Security.Authentication.SslProtocols]::Tls12
    )
    $protocols | % {
        $ver = $_
        $tcpClientSocket = New-Object Net.Sockets.TcpClient($redisEndpoint, $connectionPort )
        if(!$tcpClientSocket)
        {
            Write-Error "$ver- Error Opening Connection: $port on $computername Unreachable"
            exit 1;
        }
        else
        {
            $tcpstream = $tcpClientSocket.GetStream()
            $sslStream = New-Object System.Net.Security.SslStream($tcpstream,$false)
            $sslStream.ReadTimeout = $timeoutMS
            $sslStream.WriteTimeout = $timeoutMS
            try
            {
                $sslStream.AuthenticateAsClient($redisEndpoint, $null, $ver, $false)
                Write-Host "$ver Enabled"
            }
            catch [System.IO.IOException]
            {
                $null = $_
                #Write-Host "$ver Disabled"
            }
            catch
            {
                $null = $_
                #Write-Error "Unexpected exception $_"
            }
        }
    }
```

## Configure your Azure Cache for Redis to use TLS 1.2

You can configure TLS 1.2 on the cache by setting the **Minimum TLS version** value to TLS 1.2 in the [Advanced settings](cache-configure.md#advanced-settings) of your cache in the Azure portal.

1. To configure your cache to use TLS 1.2, first select **Advanced settings** from the Resource menu of your cache.

1. Select **1.2** in the **Minimum TLS version** in the working pane. Then, select **Save**.

You can also do the same using PowerShell. You need the Az.RedisCache module already installed before running the command.

```powershell
   Set-AzRedisCache -Name <YourRedisCacheName> -MinimumTlsVersion "1.2"
```

For setting the TLS version through CLI, the `--minimum-tls-version` is available only at Redis creation time and changing `minimum-tls-version` on an existing Redis instance isn't supported.

> [!NOTE]
> The Azure Cache for Redis service should be available during the migration to TLS 1.2 or later.

## Check whether your client application is already compliant

You can find out whether your application works with TLS 1.2 by setting the **Minimum TLS version** value to TLS 1.2 as explained earlier, on a test or staging cache and then running tests. If the application continues to function as expected after this change, it's probably compliant. It's possible you might need to [configure the Redis client library](#configure-your-client-application-to-use-tls-12) used by your application to specifically enable TLS 1.2 to connect to Azure Cache for Redis.

## Configure your client application to use TLS 1.2

Most applications use Redis client libraries to handle communication with their caches. Here are instructions for configuring some of the popular client libraries, in various programming languages and frameworks, to use TLS 1.2.

### .NET

Redis .NET clients use the earliest TLS version by default on .NET Framework 4.5.2 or earlier, and use the latest TLS version on .NET Framework 4.6 or later. If you're using an older version of .NET Framework, enable TLS 1.2 manually:

- _StackExchange.Redis_: Set `ssl=true` and `sslProtocols=tls12` in the connection string.
- _ServiceStack.Redis_: Follow the [ServiceStack.Redis](https://github.com/ServiceStack/ServiceStack.Redis#servicestackredis-ssl-support) instructions and requires ServiceStack.Redis v5.6 at a minimum.

### .NET Core

Redis .NET Core clients default to the OS default TLS version, which depends on the OS itself.

Depending on the OS version and any patches that were applied, the effective default TLS version can vary. For more information, see [Transport Layer Security (TLS) best practices with the .NET Framework](/dotnet/framework/network-programming/tls).

However, if you're using an old OS or just want to be sure, we recommend configuring the preferred TLS version manually through the client.

### Java

Redis Java clients use TLS 1.0 on Java version 6 or earlier. Jedis, Lettuce, and Redisson can't connect to Azure Cache for Redis if TLS 1.0 is disabled on the cache. Upgrade your Java framework to use new TLS versions.

For Java 7, Redis clients don't use TLS 1.2 by default but can be configured for it. For example, Jedis allows you to specify the underlying TLS settings with the following code snippet:

```java
SSLSocketFactory sslSocketFactory = (SSLSocketFactory) SSLSocketFactory.getDefault();
SSLParameters sslParameters = new SSLParameters();
sslParameters.setEndpointIdentificationAlgorithm("HTTPS");
sslParameters.setProtocols(new String[]{"TLSv1.2"});
 
URI uri = URI.create("rediss://host:port");
JedisShardInfo shardInfo = new JedisShardInfo(uri, sslSocketFactory, sslParameters, null);
 
shardInfo.setPassword("cachePassword");
 
Jedis jedis = new Jedis(shardInfo);
```

The Lettuce and Redisson clients don't yet support specifying the TLS version. They break if the cache accepts only TLS 1.2 connections. Fixes for these clients are being reviewed, so check with those packages for an updated version with this support.

In Java 8, TLS 1.2 is used by default and shouldn't require updates to your client configuration in most cases. To be safe, test your application.

As of Java 17, TLS 1.3 is used by default.

### Node.js

Node Redis and ioredis both support TLS 1.2 and 1.3.

### PHP

Versions earlier than PHP 7: Predis supports only TLS 1.0. These versions don't work with TLS 1.2; you must upgrade to use TLS 1.2.

PHP 7.0 to PHP 7.2.1: Predis uses only TLS 1.0 or 1.1 by default. You can use the following workaround to use TLS 1.2. Specify TLS 1.2 when you create the client instance:

``` PHP
$redis=newPredis\Client([
    'scheme'=>'tls',
    'host'=>'host',
    'port'=>6380,
    'password'=>'password',
    'ssl'=>[
        'crypto_type'=>STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT,
    ],
]);

```

PHP 7.3 and later versions: Predis uses the latest TLS version.

### PhpRedis

PhpRedis doesn't support TLS on any PHP version.

### Python

Redis-py uses TLS 1.2 by default.

### GO

Redigo uses TLS 1.2 by default.

## Related content

- [How to configure Azure Cache for Redis](cache-configure.md)
