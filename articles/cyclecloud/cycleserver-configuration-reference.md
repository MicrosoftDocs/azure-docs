---
title: CycleServer Configuration Reference
description: Configuration reference for cycle_server.properties file
author: atomic-penguin
ms.date: 07/15/2024
ms.author: erwolfe
---

# CycleServer Configuration

CycleCloud uses the _cycle_server.properties_ file to pass configuration parameters to the CycleServer application, and application server (Tomcat). The most common reason for updating this file is to configure SSL for the application server. See the [SSL Configuration How-to Guide](./how-to/ssl-configuration.md) for this specific use case.

> [!IMPORTANT]
> It is important that you first look for pre-existing key-value definitions in the file when editing the _cycle_server.properties_ file. If there is more than one definition, the **last** one is in effect.

## cycle_server.properties options

| Setting | Type | Description | Default value |
| --------- | ---- | ----------- | ------- |
| webServerMaxHeapSize | String | This is a JVM maximum heap size setting for the application server. CycleServer will choose platform specific defaults if setting is left blank. | Linux: `4096M`; Windows: `2048M` |
| webServerJvmOptions | String | This setting is provided for any user configurable JVM settings for the application server. CycleServer will append its default JVM settings regardless of user settings. | Appended Defaults: `-Djava.net.preferIPv4Stack=true -Djava.net.preferIPv4Addresses=true -XX:+HeapDumpOnOutOfMemoryError -Dorg.apache.tomcat.util.buf.UDecoder.ALLOW_ENCODED_SLASH=true'` |
| webServerHostname | String | Allows the user to provide a static route from cluster nodes to the CycleServer, when there are multiple interfaces attached to the CycleServer instance. This should be a hostname or IP address assigned to the CycleServer and is reachable from cluster nodes. | Unset |
| webServerPort | Integer | HTTP listen port for application server | `8080` |
| webServerSslPort | Integer | HTTPS listen port for application server | `8443` |
| webServerClusterPort | Integer | Dedicated listen port for node clusters to communicate with CycleServer. | `9443` |
| webServerContextPath | String | Root context for application server. For instance, if set to `/cycle_server` the effective CycleServer URI would be `http://localhost:8080/cycle_server`. | `/` |
| webServerEnableHttp | Boolean | Enable HTTP listen port. | `true` |
| webServerEnableHttps | Boolean | Enable HTTPS listen port. | `false` |
| webServerRedirectHttp | Boolean | If both HTTPS and HTTP is enabled, controls whether HTTP redirects to HTTPS. | `true` |
| sslEnabledProtocols | String | List of `+` separated TLS protocols to allow. e.g. `TLSv1.2+TLSv1.3` | `TLSv1.3` |
| brokerMaxHeapSize | String | This is a JVM maximum heap size setting for the message queue broker. | Linux: `1024M`; Windows: `512M` |
| brokerJvmOptions | String | This setting is provided for any user configurable JVM settings for the message queue broker. CycleServer only appends the message broker heap size, and port, options. | None |
| brokerPort | Integer | Listen port for the message queue broker. | `5672` |
| brokerJmxPort | Integer | Listen port for Java Management Extensions access to the message queue broker. | `9099` |
| brokerRmiPort | Integer | Listen port for remote method invocation for the message queue broker. | automatically assigned unused port |
| commandPort  | Integer | Listen port for CycleServer administrative commands. | `6400` |
| tomcat.shutdownPort | Integer | The listen port to listen for Tomcat shutdown commands. | `8007` |
