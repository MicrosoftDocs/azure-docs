---
title: Remove use of TLS 1.0 and 1.1 with Azure Cache for Redis | Microsoft Docs
description: Learn how to remove TLS 1.0 and 1.1 from your application when communicating with Azure Cache for Redis
services: cache
documentationcenter: ''
author: yegu-ms
manager: maiye
editor: ''

ms.assetid:
ms.service: cache
ms.workload: tbd
ms.tgt_pltfrm: cache
ms.devlang: na
ms.topic: article
ms.date: 10/22/2019
ms.author: yegu

---

# Remove use of TLS 1.0 and 1.1 with Azure Cache for Redis

There is an industry-wide push towards using TLS 1.2 or higher exclusively. TLS Versions 1.0 and 1.1 are known to be susceptible to attacks such as BEAST and POODLE and have other Common Vulnerabilities and Exposures (CVE) weaknesses. They also do not support the modern encryption methods and cipher suites recommended by PCI compliance standards. This [TLS security blog](https://www.acunetix.com/blog/articles/tls-vulnerabilities-attacks-final-part/) explains some of these vulnerabilities in more details.

While none of these pose immediate problems, you should consider moving away from using TLS 1.0 and 1.1 as early as possible. Azure Cache for Redis will stop supporting these TLS versions starting on March 31, 2020. Your application will be required to use at least TLS 1.2 in order to communicate with your cache after this date.

This article provides general guidance on how to detect and remove these dependencies from your application.

## Check if your application is already compliant

The easiest way to figure out if your application will work with TLS 1.2 is to set the Minimum TLS version on a test or staging cache it uses to TLS 1.2. You can find the Minimum TLS version setting in the [Advanced settings](cache-configure.md#advanced-settings) of your cache instance in the Azure portal. If the application continues to function as expected after this change, it is most likely to be compliant. Some Redis client libraries used by our application may need to be specifically configured to enable TLS 1.2 in order to connect to Azure Cache for Redis over that security protocol.

## Configure your application to use TLS 1.2

Most applications utilize Redis client libraries to handle communication with their caches. Below are instructions on how to configure some of the popular client libraries in various programming languages and frameworks to use TLS 1.2.

### .NET Framework

Redis .NET clients use the lowest TLS version by default on .NET Framework 4.5.2 or below and the highest TLS version on 4.6 or above. If you're using an older version of .NET Framework, you can enable TLS 1.2 manually:

* StackExchange.Redis: set `ssl=true` and `sslprotocls=tls12` in the connection string.
* ServiceStack.Redis: follow [these instructions](https://github.com/ServiceStack/ServiceStack.Redis/pull/247).

### .NET Core

Redis .NET Core clients use the highest TLS version by default.

### Java

Redis Java clients use TLS 1.0 on Java version 6 or below. Jedis, Lettuce and Radisson won't be able to connect to Azure Cache for Redis if TLS 1.0 is disabled on the cache. There is no known workaround currently.

On Java 7 or above, Redis clients don't use TLS 1.2 by default but may be configured for it. Lettuce and Radisson don't support this right now. They will break if the cache only accepts TLS 1.2 connections. Jedis allows you to specify the underlying TLS settings with the following code snippet:

``` Java
SSLSocketFactory sslSocketFactory = (SSLSocketFactory) SSLSocketFactory.getDefault();
SSLParameters sslParameters = new SSLParameters();
sslParameters.setEndpointIdentificationAlgorithm("HTTPS");
sslParameters.setProtocols(new String[]{"TLSv1", "TLSv1.1", "TLSv1.2"});
 
URI uri = URI.create("rediss://host:port");
JedisShardInfo shardInfo = new JedisShardInfo(uri, sslSocketFactory, sslParameters, null);
 
shardInfo.setPassword("cachePassword");
 
Jedis jedis = new Jedis(shardInfo);
```

### Node.js

Node Redis and IORedis use TLS 1.2 by default.

### PHP

Predis on PHP 7 won't work since the latter only supports TLS 1.0. On PHP 7.2.1 or below, Predis uses TLS 1.0 or 1.1 by default. You can specify TLS 1.2 when instantiating the client:

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

On PHP 7.3 or above, Predis uses the latest TLS version.

PhpRedis doesn't support TLS on any PHP version.

### Python

Redis-py uses TLS 1.2 by default.

### GO

Redigo uses TLS 1.2 by default.

## Additional information

- [How to configure Azure Cache for Redis](cache-configure.md)
