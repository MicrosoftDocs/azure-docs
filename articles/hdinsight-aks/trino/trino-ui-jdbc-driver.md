---
title: Trino JDBC driver
description: Using the Trino JDBC driver.
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# Trino JDBC driver

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

HDInsight on AKS Trino provides JDBC driver, which supports Azure Active Directory authentication and adds few parameters for it. 

## Install

JDBC driver jar is included in the Trino CLI package, [Install HDInsight on AKS Trino CLI](./trino-ui-command-line-interface.md). If CLI is already installed, you can find it on your file system at following path:
> Windows: `C:\Program Files (x86)\Microsoft SDKs\Azure\TrinoCli-<version>\lib`
>
> Linux: `~/lib/trino-cli`

## Authentication
Trino JDBC driver supports various methods of Azure Active Directory authentication. The following table describes the important parameters and authentication methods. For more information, see [Authentication](./trino-authentication.md).

|Parameter|Meaning|Required|Description|
|----|----|----|----|
|auth|Name of authentication method|No|Determines how user credentials are provided. If not specified, uses `AzureDefault`.|
|azureClient|Client ID of service principal/application|Yes for `AzureClientSecret, AzureClientCertificate`.|
|azureTenant|Azure Active Directory Tenant ID|Yes for `AzureClientSecret, AzureClientCertificate`.|
|azureCertificatePath|File path to certificate|Yes for `AzureClientCertificate`.|Path to pfx/pem file with certificate.|
|azureUseTokenCache|Use token cache or not|No|If provided, access token is cached and reused in `AzureDefault, AzureInteractive, AzureDeviceCode` modes.|
|azureScope|Token scope|No|Azure Active Directory scope string to request a token with.|
|password|Client secret for service principal|Yes for `AzureClientSecret`.|Secret/password for service principal when using `AzureClientSecret` mode.|
|accessToken|JWT access token|No|If access token obtained externally, can be provided using this parameter. In this case, `auth` parameter isn't allowed.|

### Example - connection strings

|Description|JDBC connection string|
|----|----|
|AzureDefault|`jdbc:trino://cluster1.pool1.region1.projecthilo.net`|
|Interactive browser authentication|`jdbc:trino://cluster1.pool1.region1.projecthilo.net?auth=AzureInteractive`|
|Use token cache|`jdbc:trino://cluster1.pool1.region1.projecthilo.net?auth=AzureInteractive&azureUseTokenCache=true`|
|Service principal with secret|`jdbc:trino://cluster1.pool1.region1.projecthilo.net?auth=AzureClientSecret&azureTenant=11111111-1111-1111-1111-111111111111&azureClient=11111111-1111-1111-1111-111111111111&password=placeholder`|

## Using JDBC driver in Java code

Locate JDBC jar file and install it into local maven repository:

```java
mvn install:install-file -Dfile=<trino-jdbc-*.jar> -DgroupId=io.trino -DartifactId=trino-jdbc -Dversion=<trino-jdbc-version> -Dpackaging=jar -DgeneratePom=true
```

Download and unpack [sample java code connecting to Trino using JDBC](https://github.com/Azure-Samples/hdinsight-aks/blob/main/src/trino/JdbcSample.tar.gz). See included README.md for details and examples.
   
## Using open-source Trino JDBC driver

You can also obtain access token externally and pass it to [open source Trino JDBC driver](https://trino.io/docs/current/client/jdbc.html), sample java code with this authentication is included in [using JDBC driver in java code section](#using-jdbc-driver-in-java-code).
