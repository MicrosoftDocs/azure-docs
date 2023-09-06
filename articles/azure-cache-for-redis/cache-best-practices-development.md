---
title: Best practices for development
titleSuffix: Azure Cache for Redis
description: Learn how to develop code for Azure Cache for Redis.
author: flang-msft
ms.service: cache
ms.topic: conceptual
ms.date: 04/10/2023
ms.author: franlanglois

---

# Development

## Connection resilience and server load

When developing client applications, be sure to consider the relevant best practices for [connection resilience](cache-best-practices-connection.md) and [managing server load](cache-best-practices-server-load.md).

## Consider more keys and smaller values

Azure Cache for Redis works best with smaller values. Consider dividing bigger chunks of data in to smaller chunks to spread the data over multiple keys. For more information on ideal value size, see this [article](https://stackoverflow.com/questions/55517224/what-is-the-ideal-value-size-range-for-redis-is-100kb-too-large/).

## Large request or response size

A large request/response can cause timeouts. As an example, suppose your timeout value configured on your client is 1 second. Your application requests two keys (for example, 'A' and 'B') at the same time (using the same physical network connection). Most clients support request "pipelining", where both requests 'A' and 'B' are sent one after the other without waiting for their responses. The server sends the responses back in the same order. If response 'A' is large, it can eat up most of the timeout for later requests.

In the following example, request 'A' and 'B' are sent quickly to the server. The server starts sending responses 'A' and 'B' quickly. Because of data transfer times, response 'B' must wait behind response 'A' times out even though the server responded quickly.

```dos
|-------- 1 Second Timeout (A)----------|
|-Request A-|
     |-------- 1 Second Timeout (B) ----------|
     |-Request B-|
            |- Read Response A --------|
                                       |- Read Response B-| (**TIMEOUT**)
```

This request/response is a difficult one to measure. You could instrument your client code to track large requests and responses.

Resolutions for large response sizes are varied but include:

- Optimize your application for a large number of small values, rather than a few large values.
  - The preferred solution is to break up your data into related smaller values.
  - See the post [What is the ideal value size range for redis? Is 100 KB too large?](https://groups.google.com/forum/#!searchin/redis-db/size/redis-db/n7aa2A4DZDs/3OeEPHSQBAAJ) for details on why smaller values are recommended.
- Increase the size of your VM to get higher bandwidth capabilities
  - More bandwidth on your client or server VM may reduce data transfer times for larger responses.
  - Compare your current network usage on both machines to the limits of your current VM size. More bandwidth on only the server or only on the client may not be enough.
- Increase the number of connection objects your application uses.
  - Use a round-robin approach to make requests over different connection objects.

## Key distribution

If you're planning to use Redis clustering, first read [Redis Clustering Best Practices with Keys](https://redislabs.com/blog/redis-clustering-best-practices-with-keys/).

## Use pipelining

Try to choose a Redis client that supports [Redis pipelining](https://redis.io/topics/pipelining). Pipelining helps make efficient use of the network and get the best throughput possible.

## Avoid expensive operations

Some Redis operations, like the [KEYS](https://redis.io/commands/keys) command, are expensive and should be avoided. For some considerations around long running commands, see  [long-running commands](cache-troubleshoot-timeouts.md#long-running-commands).

## Choose an appropriate tier

Use Standard, Premium, Enterprise, or Enterprise Flash tiers for production systems.  Don't use the Basic tier in production. The Basic tier is a single node system with no data replication and no SLA. Also, use at least a C1 cache. C0 caches are only meant for simple dev/test scenarios because:

- they share a CPU core
- use little memory
- are prone to *noisy neighbor* issues

We recommend performance testing to choose the right tier and validate connection settings. For more information, see [Performance testing](cache-best-practices-performance.md).

## Client in same region as cache

Locate your cache instance and your application in the same region. Connecting to a cache in a different region can significantly increase latency and reduce reliability.  

While you can connect from outside of Azure, it isn't recommended *especially when using Redis as a cache*.  If you're using Redis server as just a key/value store, latency may not be the primary concern.

## Rely on hostname not public IP address

The public IP address assigned to your cache can change as a result of a scale operation or backend improvement. We recommend relying on the hostname instead of an explicit public IP address. Here are the recommended forms for the various tiers:

|Tier | Form |
|----|----|
| Basic, Standard, Premium | `<cachename>.redis.cache.windows.net` |
| Enterprise, Enterprise Flash | `<DNS name>.<Azure region>.redisenterprise.cache.azure.net.`  |

## Choose an appropriate Redis version

The default version of Redis that is used when creating a cache can change over time. Azure Cache for Redis might adopt a new version when a new version of open-source Redis is released. If you need a specific version of Redis for your application, we recommend choosing the Redis version explicitly when you create the cache.

## Specific guidance for the Enterprise tiers

Because the _Enterprise_ and _Enterprise Flash_ tiers are built on Redis Enterprise rather than open-source Redis, there are some differences in development best practices. See [Best Practices for the Enterprise and Enterprise Flash tiers](cache-best-practices-enterprise-tiers.md) for more information.

## Use TLS encryption

Azure Cache for Redis requires TLS encrypted communications by default. TLS versions 1.0, 1.1 and 1.2 are currently supported. However, TLS 1.0 and 1.1 are on a path to deprecation industry-wide, so use TLS 1.2 if at all possible.

If your client library or tool doesn't support TLS, then enabling unencrypted connections is possible through the [Azure portal](cache-configure.md#access-ports) or [management APIs](/rest/api/redis/redis/update). In cases where encrypted connections aren't possible, we recommend placing your cache and client application into a virtual network. For more information about which ports are used in the virtual network cache scenario, see this [table](cache-how-to-premium-vnet.md#outbound-port-requirements).

### Azure TLS Certificate Change

Microsoft is updating Azure services to use TLS server certificates from a different set of Certificate Authorities (CAs). This change is rolled out in phases from August 13, 2020 to October 26, 2020 (estimated). Azure is making this change because [the current CA certificates don't  one of the CA/Browser Forum Baseline requirements](https://bugzilla.mozilla.org/show_bug.cgi?id=1649951). The problem was reported on July 1, 2020 and applies to multiple popular Public Key Infrastructure (PKI) providers worldwide. Most TLS certificates used by Azure services today come from the *Baltimore CyberTrust Root* PKI. The Azure Cache for Redis service will continue to be chained to the Baltimore CyberTrust Root. Its TLS server certificates, however, will be issued by new Intermediate Certificate Authorities (ICAs) starting on October 12, 2020.

> [!NOTE]
> This change is limited to services in public [Azure regions](https://azure.microsoft.com/global-infrastructure/geographies/). It excludes sovereign (e.g., China) or government clouds.
>
>

#### Does this change affect me?

We expect that most Azure Cache for Redis customers aren't affected by the change. Your application might be affected if it explicitly specifies a list of acceptable certificates, a practice known as “certificate pinning”. If it's pinned to an intermediate or leaf certificate instead of the Baltimore CyberTrust Root, you should **take immediate actions** to change the certificate configuration. 

Azure Cache for Redis doesn't support [OCSP stapling](https://docs.redis.com/latest/rs/security/certificates/ocsp-stapling/).

The following table provides information about the certificates that are being rolled. Depending on which certificate your application uses, you might need to update it to prevent loss of connectivity to your Azure Cache for Redis instance.

| CA Type | Current | Post Rolling (Oct 12, 2020) | Action |
| ----- | ----- | ----- | ----- |
| Root | Thumbprint: d4de20d05e66fc53fe1a50882c78db2852cae474<br><br> Expiration: Monday, May 12, 2025, 4:59:00 PM<br><br> Subject Name:<br> CN = Baltimore CyberTrust Root<br> OU = CyberTrust<br> O = Baltimore<br> C = IE | Not changing | None |
| Intermediates | Thumbprints:<br> CN = Microsoft IT TLS CA 1<br> Thumbprint: 417e225037fbfaa4f95761d5ae729e1aea7e3a42<br><br> CN = Microsoft IT TLS CA 2<br> Thumbprint: 54d9d20239080c32316ed9ff980a48988f4adf2d<br><br> CN = Microsoft IT TLS CA 4<br> Thumbprint: 8a38755d0996823fe8fa3116a277ce446eac4e99<br><br> CN = Microsoft IT TLS CA 5<br> Thumbprint: Ad898ac73df333eb60ac1f5fc6c4b2219ddb79b7<br><br> Expiration: ‎Friday, ‎May ‎20, ‎2024 5:52:38 AM<br><br> Subject Name:<br> OU = Microsoft IT<br> O = Microsoft Corporation<br> L = Redmond<br> S = Washington<br> C = US<br> | Thumbprints:<br> CN = Microsoft RSA TLS CA 01<br> Thumbprint: 703d7a8f0ebf55aaa59f98eaf4a206004eb2516a<br><br> CN = Microsoft RSA TLS CA 02<br> Thumbprint: b0c2d2d13cdd56cdaa6ab6e2c04440be4a429c75<br><br> Expiration: ‎Tuesday, ‎October ‎8, ‎2024 12:00:00 AM;<br><br> Subject Name:<br> O = Microsoft Corporation<br> C = US<br> | Required |

#### What actions should I take?

If your application uses the operating system certificate store or pins the Baltimore root among others, no action is needed.

If your application pins any intermediate or leaf TLS certificate, we recommend you pin the following roots:

| Certificate | Thumbprint |
| ----- | ----- |
| [Baltimore Root CA](https://cacerts.digicert.com/BaltimoreCyberTrustRoot.crt) | d4de20d05e66fc53fe1a50882c78db2852cae474 |
| [Microsoft RSA Root Certificate Authority 2017](https://www.microsoft.com/pkiops/certs/Microsoft%20RSA%20Root%20Certificate%20Authority%202017.crt) | 73a5e64a3bff8316ff0edccc618a906e4eae4d74 |
| [Digicert Global Root G2](https://cacerts.digicert.com/DigiCertGlobalRootG2.crt) | df3c24f9bfd666761b268073fe06d1cc8d4f82a4 |

> [!TIP]
> Both the intermediate and leaf certificates are expected to change frequently. We recommend not to take a dependency on them. Instead pin your application to a root certificate since it rolls less frequently.
>
>

To continue to pin intermediate certificates, add the following to the pinned intermediate certificates list, which includes few more to minimize future changes:

| Common name of the CA | Thumbprint |
| ----- | ----- |
| [Microsoft RSA TLS CA 01](https://www.microsoft.com/pki/mscorp/Microsoft%20RSA%20TLS%20CA%2001.crt) | 703d7a8f0ebf55aaa59f98eaf4a206004eb2516a |
| [Microsoft RSA TLS CA 02](https://www.microsoft.com/pki/mscorp/Microsoft%20RSA%20TLS%20CA%2002.crt) | b0c2d2d13cdd56cdaa6ab6e2c04440be4a429c75 |
| [Microsoft Azure TLS Issuing CA 01](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20TLS%20Issuing%20CA%2001.cer) | 2f2877c5d778c31e0f29c7e371df5471bd673173 |
| [Microsoft Azure TLS Issuing CA 02](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20TLS%20Issuing%20CA%2002.cer) | e7eea674ca718e3befd90858e09f8372ad0ae2aa |
| [Microsoft Azure TLS Issuing CA 05](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20TLS%20Issuing%20CA%2005.cer) | 6c3af02e7f269aa73afd0eff2a88a4a1f04ed1e5 |
| [Microsoft Azure TLS Issuing CA 06](https://www.microsoft.com/pkiops/certs/Microsoft%20Azure%20TLS%20Issuing%20CA%2006.cer) | 30e01761ab97e59a06b41ef20af6f2de7ef4f7b0 |

If your application validates certificate in code, you need to modify it to recognize the properties --- for example, Issuers, Thumbprint --- of the newly pinned certificates. This extra verification should cover all pinned certificates to be more future-proof.

## Client library-specific guidance

For more information, see [Client libraries](cache-best-practices-client-libraries.md#client-libraries).

## Next steps  

- [Performance testing](cache-best-practices-performance.md)
- [Failover and patching for Azure Cache for Redis](cache-failover.md)
