---
title: Remove TLS 1.0 and 1.1 from use with Azure Cache for Redis
description: Learn how to remove TLS 1.0 and 1.1 from your application when communicating with Azure Cache for Redis
author: flang-msft
ms.service: cache
ms.topic: conceptual
ms.date: 09/12/2023
ms.author: franlanglois
ms.devlang: csharp, golang, java, javascript, php, python

---

# Remove TLS 1.0 and 1.1 from use with Azure Cache for Redis

To meet the industry-wide push toward the exclusive use of Transport Layer Security (TLS) version 1.2 or later, Azure Cache for Redis is moving toward requiring the use of the TLS 1.2 in October, 2024. TLS versions 1.0 and 1.1 are known to be susceptible to attacks such as BEAST and POODLE, and to have other Common Vulnerabilities and Exposures (CVE) weaknesses.

TLS versions 1.0 and 1.1 also don't support the modern encryption methods and cipher suites recommended by Payment Card Industry (PCI) compliance standards. This [TLS security blog](https://www.acunetix.com/blog/articles/tls-vulnerabilities-attacks-final-part/) explains some of these vulnerabilities in more detail.

> [!IMPORTANT]
> On October 1, 2024, the TLS 1.2 requirement will be enforced.
>
>

As a part of this effort, you can expect the following changes to Azure Cache for Redis:

- _Phase 1_: Azure Cache for Redis stops offering TLS 1.0/1.1 as an option for MinimumTLSVersion setting for new cache creates. Existing cache instances won't be updated at this point. You can still use the Azure portal or other management APIs to [change the minimum TLS version](cache-configure.md#access-ports) to 1.0 or 1.1 for backward compatibility.
- _Phase 2_: Azure Cache for Redis stops supporting TLS 1.1 and TLS 1.0 starting October 1, 2024. After this change, your application must use TLS 1.2 or later to communicate with your cache. The Azure Cache for Redis service will be available while we update the MinimumTLSVerion for all caches to 1.2.

| Date    | Description |
|-------- |-------------|
| September 2023 | TLS 1.0/1.1 retirement announcement |
| March 1, 2024 | Beginning March 1, 2024, you will not be able to set the Minimum TLS version for any cache to 1.0 or 1.1. Existing cache instances won't be updated at this point.
| September 30, 2024 | Ensure that all your applications are connecting to Azure Cache for Redis using TLS 1.2 and Minimum TLS version on your cache settings is set to 1.2
| October 1, 2024 | Minimum TLS version for all cache instances is updated to 1.2. This means Azure Cache for Redis instances will reject connections using TLS 1.0 or 1.1.
  
  > [!IMPORTANT]
  > The content in this article does not apply to Azure Cache for Redis Enterprise/Enterprise Flash because the Enterprise tiers only support TLS 1.2.
  >

As part of this change, Azure Cache for Redis removes support for older cipher suites that aren't secure. Supported cipher suites are restricted to the following suites when the cache is configured with a minimum of TLS 1.2:

- TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384_P384
- TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256_P256

The following sections provide guidance about how to detect dependencies on these earlier TLS versions and remove them from your application.

## Check whether your application is already compliant

You can find out whether your application works with TLS 1.2 by setting the **Minimum TLS version** value to TLS 1.2 on a test or staging cache, then running tests. The **Minimum TLS version** setting is in the [Advanced settings](cache-configure.md#advanced-settings) of your cache instance in the Azure portal.  If the application continues to function as expected after this change, it's probably compliant. You also need to configure the Redis client library used by your application to enable TLS 1.2 to connect to Azure Cache for Redis.

> [!NOTE]
> With your cache open in the portal, select **Advanced** in the resource menu. If the Minimum TLS version for your cache instance is set to **Default**, your Minimum TLS version is set to TLS 1.2. TLS 1.2 is the default value that is assigned to your cache instance when no explicit value is chosen.
>

## Configure your application to use TLS 1.2

Most applications use Redis client libraries to handle communication with their caches. Here are instructions for configuring some of the popular client libraries, in various programming languages and frameworks, to use TLS 1.2.

### .NET Framework

Redis .NET clients use the earliest TLS version by default on .NET Framework 4.5.2 or earlier, and use the latest TLS version on .NET Framework 4.6 or later. If you're using an older version of .NET Framework, enable TLS 1.2 manually:

- _StackExchange.Redis_: Set `ssl=true` and `sslProtocols=tls12` in the connection string.
- _ServiceStack.Redis_: Follow the [ServiceStack.Redis](https://github.com/ServiceStack/ServiceStack.Redis#servicestackredis-ssl-support) instructions and requires ServiceStack.Redis v5.6 at a minimum.

### .NET Core

Redis .NET Core clients default to the OS default TLS version, which depends on the OS itself.

Depending on the OS version and any patches that have been applied, the effective default TLS version can vary. For more information, see [here](/dotnet/framework/network-programming/#support-for-tls-12).

However, if you're using an old OS or just want to be sure, we recommend configuring the preferred TLS version manually through the client.

### Java

Redis Java clients use TLS 1.0 on Java version 6 or earlier. Jedis, Lettuce, and Redisson can't connect to Azure Cache for Redis if TLS 1.0 is disabled on the cache. Upgrade your Java framework to use new TLS versions.

For Java 7, Redis clients don't use TLS 1.2 by default but can be configured for it. Jedis allows you to specify the underlying TLS settings with the following code snippet:

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

### Node.js

Node Redis and IORedis use TLS 1.2 by default.

### PHP

#### Predis

- Versions earlier than PHP 7: Predis supports only TLS 1.0. These versions don't work with TLS 1.2; you must upgrade to use TLS 1.2.

- PHP 7.0 to PHP 7.2.1: Predis uses only TLS 1.0 or 1.1 by default. You can use the following workaround to use TLS 1.2. Specify TLS 1.2 when you create the client instance:

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

- PHP 7.3 and later versions: Predis uses the latest TLS version.

#### PhpRedis

PhpRedis doesn't support TLS on any PHP version.

### Python

Redis-py uses TLS 1.2 by default.

### GO

Redigo uses TLS 1.2 by default.

## Additional information

- [How to configure Azure Cache for Redis](cache-configure.md)
