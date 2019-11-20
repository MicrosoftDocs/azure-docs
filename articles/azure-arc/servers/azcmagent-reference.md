---
title: Azure Connected Machine Agent CLI interface
description: Reference documentation for the Azure Connected Machine agent CLI
author: bobbytreed
manager: carmonm
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-servers
ms.topic: reference
ms.date: 11/04/2019
ms.author: robreed
---
# Azure Connected Machine Agent CLI interface

The `Azcmagent` (Azure Connected Machine Agent) tool is used to configure and troubleshoot a non-azure machines connection to Azure.

The agent itself is a daemon process called `himdsd` on Linux, and a Windows Service called `himds` on Windows.

In normal usage, `azcmagent connect` is used to establish a connection between this machine and Azure, and
`azcmagent disconnect` if you decide you no longer want that connection. The other commands are for troubleshooting
or other special cases.

## Options

```none
  -h, --help      help for azcmagent
  -v, --verbose   Increase logging verbosity to show all logs
```

## SEE ALSO

* [azcmagent connect](#azcmagent-connect) - Connects this machine to Azure
* [azcmagent disconnect](#azcmagent-disconnect) - Disconnects this machine from Azure
* [azcmagent reconnect](#azcmagent-reconnect) - Reconnects this machine to Azure
* [azcmagent show](#azcmagent-show) - Gets machine metadata and Agent status. This is primarily useful for troubleshooting.
* [azcmagent version](#azcmagent-version) - Display the Hybrid Management Agent version

## azcmagent connect

Connects this machine to Azure

### Synopsis

Creates a resource in Azure representing this machine.

This uses the authentication options provided to create a resource in Azure Resource Manager
representing this machine. The resource is in the subscription and resource group requested,
and data about the machine is stored in the Azure region specified by the location parameter.
The default resource name is the hostname of this machine if not overridden.

A certificate corresponding to the System-Assigned Identity of this machine is then downloaded
and stored locally. Once this step completes the **Azure Connected Machine Metadata** Service and Guest
Configuration Agent begin synchronizing with Azure cloud.

Authentication options:

* Access Token
 `azcmagent connect --access-token <> --subscription-id <> --resource-group <> --location <>`
* Service Principal ID and secret 
 `azcmagent connect --service-principal-id <> --service-principal-secret <> --tenant-id <tenantid> --subscription-id <> --resource-group <> --location <>`
* Device sign in (Interactive)
 `azcmagent connect --tenant-id <> --subscription-id <> --resource-group <> --location <>`

### Syntax

```none
azcmagent connect [flags]
```

### Options

```none
      --access-token string               Access token
  -h, --help                              help for connect
  -l, --location string                   Location of the resource [Required]
      --physical-location string          Physical location of the resource
  -g, --resource-group string             Name of the resource group. [Required]
  -n, --resource-name string              Name of the resource. Defaults to Host Name
  -i, --service-principal-id string       Service Principal Id
  -p, --service-principal-secret string   Service Principal Secret
  -s, --subscription-id string            Subscription Id [Required]
  -t, --tags string                       Tags for resource
      --tenant-id string                  Tenant Id
```

## azcmagent disconnect

Disconnects this machine from Azure

### Synopsis

Deletes the resource in Azure that represents this server.

This command uses the authentication options provided to remove the Azure Resource Manager
resource representing this machine. After this point the **Azure Connected Machine Metadata Service**
and Guest Configuration Agent will be disconnected. This command does not stop or remove
the services: remove the package in order to do that.

This command requires higher privileges than the "Azure Connected Machine Onboarding" role.

Once a machine is disconnected, use `azcmagent connect`, not `azcmagent reconnect` if you want to create
a new resource for it in Azure.

Authentication Options:

* Access Token
 `azcmagent disconnect --access-token <>`
* Service Principal ID and secret
 `azcmagent disconnect --service-principal-id <> --service-principal-secret <> --tenant-id <tenantid>`
* Interactive Device sign in
 `azcmagent disconnect --tenant-id <>`

### Syntax

```none
azcmagent disconnect [flags]
```

### Options

```none
      --access-token string               Access token
  -h, --help                              help for disconnect
  -r, --resource-group string             Name of the resource group
  -n, --resource-name string              Name of the resource
  -i, --service-principal-id string       Service Principal Id
  -p, --service-principal-secret string   Service Principal Secret
  -s, --subscription-id string            Subscription Id
  -t, --tenant-id string                  Tenant Id
```

## azcmagent reconnect

Reconnects this machine to Azure

### Synopsis

Reconnect machine with invalid credentials to Azure.

If a machine already has a resource in Azure but is not able to authenticate to it, it can
be reconnected using this command. This is possible if a machine was turned off long enough
for its certificate to expire (at least 45 days).

If a machine was disconnected with `azcmagent disconnect`, use `azcmagent connect` instead.

This command uses the authentication options provided to retrieve new credentials corresponding
to the Azure Resource Manager resource representing this machine.

This command requires higher privileges than the **Azure Connected Machine Onboarding** role.

Authentication Options

* Access Token
 `azcmagent reconnect --access-token <>`
* Service Principal ID and secret
 `azcmagent reconnect --service-principal-id <> --service-principal-secret <> --tenant-id <tenantid>`
* Interactive Device sign in
 `azcmagent reconnect --tenant-id <>`

### Syntax

```none
azcmagent reconnect [flags]
```

### Options

```none
      --access-token string               Access token
  -h, --help                              help for reconnect
  -l, --location string                   Location of the resource
  -g, --resource-group string             Name of the resource group.
  -n, --resource-name string              Name of the resource. Defaults to Host Name
  -i, --service-principal-id string       Service Principal Id
  -p, --service-principal-secret string   Service Principal Secret
  -s, --subscription-id string            Subscription Id
      --tenant-id string                  tenant id
```

## azcmagent show

Gets machine metadata and Agent status. This is primarily useful for troubleshooting.

### Synopsis

Gets machine metadata and Agent status. This is primarily useful for troubleshooting.


### Syntax

```
azcmagent show [flags]
```

### Options

```
  -h, --help   help for show
```

## azcmagent version

Display the Hybrid Management Agent version

### Synopsis

Display the Hybrid Management Agent version

### Syntax

```none
azcmagent version [flags]
```

### Options

```none
  -h, --help   help for version
```
