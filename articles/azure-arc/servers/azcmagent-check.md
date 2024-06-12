---
title: azcmagent check CLI reference
description: Syntax for the azcmagent check command line tool
ms.topic: reference
ms.date: 05/22/2024
---

# azcmagent check

Run a series of network connectivity checks to see if the agent can successfully communicate with required network endpoints. The command outputs a table showing connectivity test results for each required endpoint, including whether the agent used a private endpoint and/or proxy server.

## Usage

```
azcmagent check [flags]
```

## Examples

Check connectivity with the agent's configured cloud and region.

```
azcmagent check
```

Check connectivity with the East US region using public endpoints.

```
azcmagent check --location "eastus"
```

Check connectivity for supported extensions (SQL Server enabled by Azure Arc) using public endpoints:

```
azcmagent check --extensions all
```


Check connectivity with the Central India region using private endpoints.

```
azcmagent check --location "centralindia" --enable-pls-check
```

## Flags

`--cloud`

Specifies the Azure cloud instance. Must be used with the `--location` flag. If the machine is already connected to Azure Arc, the default value is the cloud to which the agent is already connected. Otherwise, the default value is AzureCloud.

Supported values:

* AzureCloud (public regions)
* AzureUSGovernment (Azure US Government regions)
* AzureChinaCloud (Microsoft Azure operated by 21Vianet regions)

`-e`, `--extensions`

Includes extra checks for extension endpoints to help validate end-to-end scenario readiness. This flag is available in agent version 1.41 and later.

Supported values:

* all (checks all supported extension endpoints)
* sql (SQL Server enabled by Azure Arc)

`-l`, `--location`

The Azure region to check connectivity with. If the machine is already connected to Azure Arc, the current region is selected as the default.

Sample value: westeurope

`-p`, `--enable-pls-check`

Checks if supported Azure Arc endpoints resolve to private IP addresses. This flag should be used when you intend to connect the server to Azure using an Azure Arc private link scope.

[!INCLUDE [common-flags](includes/azcmagent-common-flags.md)]
