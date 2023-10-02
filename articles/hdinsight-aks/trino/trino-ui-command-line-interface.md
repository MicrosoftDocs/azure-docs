---
title: Trino CLI
description: Using Trino via CLI
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# Trino CLI

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

The Trino CLI provides a terminal-based, interactive shell for running queries.

## Install on Windows
For Windows, the Trino CLI is installed via an MSI, which gives you access to the CLI through the Windows Command Prompt (CMD) or PowerShell. When installing for Windows Subsystem for Linux (WSL), see [Install on Linux](#install-on-linux).

### Requirements

* [Java 8 or 11](/java/openjdk/install).

* Add java.exe to PATH or define JAVA_HOME environment variable pointing to JRE installation directory, such that `%JAVA_HOME%\bin\java.exe` exists.

### Install or update

The MSI package is used for installing or updating the HDInsight on AKS Trino CLI on Windows.

Download and install the latest release of the Trino CLI. When the installer asks if it can make changes to your computer, click the "Yes" box. After the installation is complete, you'll need to close and reopen any active Windows Command Prompt or PowerShell windows to use the Trino CLI.

Download Trino CLI: https://aka.ms/InstallTrinoCLIWindows

### Run the Trino CLI

You can now run the Trino CLI using “trino-cli” in command prompt, and connect to cluster:
```cmd
trino-cli --server <cluster_endpoint>
```

> [!NOTE]
> If you run on headless OS (no web browser), Trino CLI will prompt to use device code for authentication. You can also specify command line parameter `--auth AzureDeviceCode` to force using device code. In this case, you need to open a browser on another device/OS, input the code displayed and authenticate, and then come back to CLI.


### Troubleshooting

Here are some common problems seen when installing the Trino CLI on Windows.

**Proxy blocks connection**

If you can't download the MSI installer because your proxy is blocking the connection, make sure that you have your proxy properly configured. For Windows 10, these settings are managed in the Settings > Network & Internet > Proxy pane. Contact your system administrator for the required settings, or for situations where your machine may be configuration-managed or require advanced setup.

In order to get the MSI, your proxy needs to allow HTTPS connections to the following addresses:

* `https://aka.ms/`
* `https://hdionaksresources.blob.core.windows.net/`

### Uninstall

You can uninstall the Trino CLI from the Windows "Apps and Features" list. To uninstall:

|Platform|Instructions|
|---|---|
|Windows 10|Start > Settings > App|
|Windows 8 and Windows 7|Start > Control Panel > Programs > Uninstall a program|

Once on this screen, type Trino into the program search bar. The program to uninstall is list as “HDInsight Trino CLI \<version\>.” Select this application, then click the Uninstall button.

## Install on Linux

The Trino CLI provides a terminal-based, interactive shell for running queries. You may manually install the Trino CLI on Linux by selecting the Install script option.

### Requirements

* [Java 8 or 11](/java/openjdk/install).

* Add java to PATH or define JAVA_HOME environment variable pointing to JRE installation directory, such that $JAVA_HOME/bin/java exists.

### Install or update

Both installing and updating the CLI requires rerunning the install script. Install the CLI by running curl.

```bash
curl -L https://aka.ms/InstallTrinoCli | bash
```

The script can also be downloaded and run locally. You may have to restart your shell in order for changes to take effect.

### Run the Trino CLI

You can now run the Trino CLI with the “trino-cli” command from the shell, and connect to the cluster:
```bash
trino-cli --server <cluster_endpoint>
```

> [!NOTE]
> If you run on headless OS (no web browser) Trino CLI will prompt to use device code for authentication. You can also specify command line parameter `--auth AzureDeviceCode` to force using device code. In this case you need to open a browser on another device/OS, input the code displayed and authenticate, and then come back to CLI.

### Troubleshooting

Here are some common problems seen during a manual installation.

**curl "Object Moved" error**

If you get an error from curl related to the -L parameter, or an error message including the text "Object Moved," tries using the full URL instead of the aka.ms redirect:

```bash
curl https://hdionaksresources.blob.core.windows.net/trino/cli/install.sh | bash
```

**trino-cli command not found**

```bash
hash -r
```

The issue can also occur if you didn't restart your shell after installation. Make sure that the location of the trino-cli command ($HOME/bin) is in your $PATH.

**Proxy blocks connection**

In order to get the installation scripts, your proxy needs to allow HTTPS connections to the following addresses:

* `https://aka.ms/`
* `https://hdionaksresources.blob.core.windows.net/`

**Uninstall**

To remove all trino-cli files run:

```bash
rm $HOME/bin/trino-cli
rm -r $HOME/lib/trino-cli
```

## Authentication
Trino CLI supports various methods of Azure Active Directory authentication using command line parameters. The following table describes the important parameters and authentication methods, for more information, see [Authentication](./trino-authentication.md).

Parameters description available in CLI as well:
```bash
trino-cli --help
```

|Parameter|Meaning|Required|Description|
|----|----|----|----|
|auth|Name of authentication method|No|Determines how user credentials are provided. If not specified, uses `AzureDefault`.|
|azure-client|Client ID|Yes for `AzureClientSecret, AzureClientCertificate`.|Client ID of service principal/application.|
|azure-tenant|Tenant ID|Yes for `AzureClientSecret, AzureClientCertificate`.|Azure Active Directory Tenant ID.|
|azure-certificate-path|File path to certificate|Yes for `AzureClientCertificate`.|Path to pfx/pem file with certificate.|
|azure-use-token-cache|Use token cache or not|No|If provided, access token is cached and reused in `AzureDefault, AzureInteractive, AzureDeviceCode` modes.|
|azure-scope|Token scope|No|Azure Active Directory scope string to request a token with.|
|use-device-code|Use device code method or not|No|Equivalent to `--auth AzureDeviceCode`.|
|password|Client secret for service principal|Yes for `AzureClientSecret`.|Secret/password for service principal when using `AzureClientSecret` mode.|
|access-token|JWT access token|No|If access token obtained externally, can be provided using this parameter. In this case, `auth` parameter isn't allowed.|

## Examples
|Description|CLI command|
|----|----|
AzureDefault|`trino-cli --server cluster1.pool1.region.projecthilo.net`
Interactive browser authentication|`trino-cli --server cluster1.pool1.region1.projecthilo.net --auth AzureInteractive`
Use token cache|`trino-cli --server cluster1.pool1.region1.projecthilo.net --auth AzureInteractive --azure-use-token-cache`
Service principal with secret|`trino-cli --server cluster1.pool1.region1.projecthilo.net --auth AzureClientSecret --azure-client 11111111-1111-1111-1111-111111111111 --azure-tenant 11111111-1111-1111-1111-111111111111 --password`
Service principal and protected certificate (password is prompted)|`trino-cli --server cluster1.pool1.region1.projecthilo.net --auth AzureClientCertificate --azure-client 11111111-1111-1111-1111-111111111111 --azure-certificate-path d:\tmp\cert.pfx --azure-tenant 11111111-1111-1111-1111-111111111111 --password`

## Troubleshoot
### MissingAccessToken or InvalidAccessToken
CLI shows either of errors:

```Output
Error running command: Authentication failed: {
  "code": "MissingAccessToken",
  "message": "Unable to find the token or get the required claims from it."
}
```

```Output
Error running command: Error starting query at https://<cluster-endpoint>/v1/statement returned an invalid response: JsonResponse{statusCode=500, statusMessage=, headers={content-type=[application/json; charset=utf-8], date=[Fri, 16 Jun 2023 18:25:23 GMT], strict-transport-security=[max-age=15724800; includeSubDomains]}, hasValue=false} [Error: {
  "code": "InvalidAccessToken",
  "message": "Unable to find the token or get the required claims from it"
}]
```

To resolve the issue, try the following steps:
1. Exit Trino CLI.
2. Run ```az logout```
3. Run ```az login -t <your-trino-cluster-tenantId>```
4. Now this command should work: 
```bash
trino-cli --server <cluster-endpoint>
```
5. Alternatively specify auth/tenant parameters:
```bash
trino-cli --server <cluster-endpoint> --auth AzureInteractive --azure-tenant <trino-cluster-tenantId>
```

### 403 Forbidden
CLI shows error:
```Output
Error running command: Error starting query at  https://<cluster-endpoint>/v1/statement returned an invalid response: JsonResponse{statusCode=403, statusMessage=, headers={content-length=[146], content-type=[text/html], date=[Wed, 25 May 2023 16:49:24 GMT], strict-transport-security=[max-age=15724800; includeSubDomains]}, hasValue=false} [Error: <html>
<head><title>403 Forbidden</title></head>
<body>
<center><h1>403 Forbidden</h1></center>
<hr><center>nginx</center>
</body>
</html>
]
```
To resolve the issue, add user or group to the [authorization profile](../hdinsight-on-aks-manage-authorization-profile.md).
