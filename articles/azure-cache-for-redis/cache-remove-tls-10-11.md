---
title: Remove TLS 1.0 and 1.1 from use with Azure Cache for Redis
description: Learn how to remove TLS 1.0 and 1.1 from your application when communicating with Azure Cache for Redis
author: flang-msft
ms.service: cache
ms.topic: conceptual
ms.date: 10/25/2024
ms.author: franlanglois
ms.devlang: csharp, golang, java, javascript, php, python
ms.custom: devx-track-azurepowershell, devx-track-azurecli

---

# Remove TLS 1.0 and 1.1 from use with Azure Cache for Redis

There's an industry-wide push toward the exclusive use of Transport Layer Security (TLS) version 1.2 or later. TLS versions 1.0 and 1.1 are known to be susceptible to attacks such as BEAST and POODLE, and to have other Common Vulnerabilities and Exposures (CVE) weaknesses. They also don't support the modern encryption methods and cipher suites recommended by Payment Card Industry (PCI) compliance standards. This [TLS security blog](https://www.acunetix.com/blog/articles/tls-vulnerabilities-attacks-final-part/) explains some of these vulnerabilities in more detail.

As a part of this effort, we're making the following changes to Azure Cache for Redis:

* **Phase 1:** We configure the default minimum TLS version to be 1.2 for newly created cache instances (previously, it was TLS 1.0). Existing cache instances are not updated at this point. You can still use the Azure portal or other management APIs to [change the minimum TLS version](cache-configure.md#access-ports) to 1.0 or 1.1 for backward compatibility.
* **Phase 2:** We stop supporting TLS 1.1 and TLS 1.0. After this change, your application must use TLS 1.2 or later to communicate with your cache. The Azure Cache for Redis service is expected to be available while we migrate it to support only TLS 1.2 or later.

  > [!NOTE]
  > Phase 2 is postponed because of COVID-19. We strongly recommend that you begin planning for this change now and proactively update clients to support TLS 1.2 or later. 
  >

As part of this change, we'll also remove support for older cypher suites that aren't secure. Our supported cypher suites are restricted to the following suites when the cache is configured with a minimum of TLS 1.2:

* TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384_P384
* TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256_P256

This article provides general guidance about how to detect dependencies on these earlier TLS versions and remove them from your application.

The dates when these changes take effect are:

| Cloud                | Phase 1 Start Date | Phase 2 Start Date         |
|----------------------|--------------------|----------------------------|
| Azure (global)       |  January 13, 2020  | Postponed because of COVID-19  |
| Azure Government     |  March 13, 2020    | Postponed because of COVID-19  |
| Azure Germany        |  March 13, 2020    | Postponed because of COVID-19  |
| Azure China 21Vianet |  March 13, 2020    | Postponed because of COVID-19  |

> [!NOTE]
> Phase 2 is postponed because of COVID-19. This article will be updated when specific dates are set.
>

## Check TLS versions supported by your Azure Redis cache

You can use this PowerShell script to verify the TLS versions supported by your Azure Cache for Redis endpoint. If your Redis instance is VNet injected, you have to run this script from a Virtual Machine in your VNet that has access to the Azure Redis endpoint.

If the result shows "Tls Enabled" and/or "Tls 11 Enabled", then ensure you follow the instructions to [Configure your Azure Redis cache to use TLS 1.2](#Configure-your-Azure-Redis-cache-to-use-TLS-12). If the result shows *only* "Tls12 Enabled" and your client application is able to connect without any errors, then no action is needed. 

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

## Configure your Azure Redis cache to use TLS 1.2

You can configure TLS 1.2 on the cache by setting the **Minimum TLS version** value to TLS 1.2 in the [Advanced settings](cache-configure.md#advanced-settings) of your cache in the Azure portal.

:::image type="content" source="media/cache-remove-tls-10-11/change-redis-tls-version.png" alt-text="Set TLS 1.2 for cache on Azure portal":::

You can also do the same using PowerShell. You need the Az.RedisCache module already installed before running the command.

```powershell
   Set-AzRedisCache -Name <YourRedisCacheName> -MinimumTlsVersion "1.2"
```

For setting the TLS version through CLI, the --minimum-tls-version is available only at Redis creation time and changing minimum-tls-version on an existing Redis instance isn't supported.

>[!NOTE]
>The Azure Cache for Redis service is expected to be available while we migrate it to support >only TLS 1.2 or later.

## Check whether your client application is already compliant

You can find out whether your application works with TLS 1.2 by setting the **Minimum TLS version** value to TLS 1.2 as explained earlier, on a test or staging cache and then running tests. If the application continues to function as expected after this change, it's probably compliant. It's possible you might need to [configure the Redis client library](#configure-your-client-application-to-use-tls-12) used by your application to specifically enable TLS 1.2 to connect to Azure Cache for Redis.

## Configure your client application to use TLS 1.2

Most applications use Redis client libraries to handle communication with their caches. Here are instructions for configuring some of the popular client libraries, in various programming languages and frameworks, to use TLS 1.2.

### .NET Framework

Redis .NET clients use the earliest TLS version by default on .NET Framework 4.5.2 or earlier, and use the latest TLS version on .NET Framework 4.6 or later. If you're using an older version of .NET Framework, enable TLS 1.2 manually:

* **StackExchange.Redis:** Set `ssl=true` and `sslProtocols=tls12` in the connection string.
* **ServiceStack.Redis:** Follow the [ServiceStack.Redis](https://github.com/ServiceStack/ServiceStack.Redis#servicestackredis-ssl-support) instructions and requires ServiceStack.Redis v5.6 at a minimum.

### .NET Core

Redis .NET Core clients default to the OS default TLS version, which depends on the OS itself. 

Depending on the OS version and any patches that are applied, the effective default TLS version can vary. For more information, see [here](/dotnet/framework/network-programming/#support-for-tls-12).

However, if you're using an old OS or just want to be sure, we recommend configuring the preferred TLS version manually through the client.


### Java

Redis Java clients use TLS 1.0 on Java version 6 or earlier. Jedis, Lettuce, and Redisson can't connect to Azure Cache for Redis if TLS 1.0 is disabled on the cache. Upgrade your Java framework to use new TLS versions.

For Java 7, Redis clients don't use TLS 1.2 by default but can be configured for it. Jedis allows you to specify the underlying TLS settings with the following code snippet:

``` Java
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

### Node.js

Node Redis and IORedis use TLS 1.2 by default.

### PHP

#### Predis
 
* Versions earlier than PHP 7: Predis supports only TLS 1.0. These versions don't work with TLS 1.2; you must upgrade to use TLS 1.2.
 
* PHP 7.0 to PHP 7.2.1: Predis uses only TLS 1.0 or 1.1 by default. You can use the following workaround to use TLS 1.2. Specify TLS 1.2 when you create the client instance:

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

* PHP 7.3 and later versions: Predis uses the latest TLS version.

#### PhpRedis

PhpRedis doesn't support TLS on any PHP version.

### Python

Redis-py uses TLS 1.2 by default.

### GO

Redigo uses TLS 1.2 by default.

## Additional information

- [How to configure Azure Cache for Redis](cache-configure.md)
