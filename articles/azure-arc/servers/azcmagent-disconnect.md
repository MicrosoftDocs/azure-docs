---
title: azcmagent disconnect CLI reference
description: Syntax for the azcmagent disconnect command line tool
ms.topic: reference
ms.date: 04/20/2023
---

# azcmagent disconnect

Deletes the Azure Arc-enabled server resource in the cloud and resets the configuration of the local agent. For detailed information on removing extensions and disconnecting and uninstalling the agent, see [uninstall the agent](manage-agent.md#uninstall-the-agent).

## Usage

```
azcmagent disconnect [authentication] [flags]
```

## Examples

Disconnect a server using the default login method (interactive browser or device code).

```
azcmagent disconnect
```

Disconnect a server using a service principal.

```
azcmagent disconnect --service-principal-id "ID" --service-principal-secret "SECRET"
```

Disconnect a server if the corresponding resource in Azure has already been deleted.

```
azcmagent disconnect --force-local-only
```

## Authentication options

There are 4 ways to provide authentication credentials to the Azure connected machine agent. Choose one authentication option and replace the `[authentication]` section in the usage syntax with the recommended flags.

> [!NOTE]
> The account used to disconnect a server must be from the same tenant as the subscription where the server is registered.

### Interactive browser login (Windows-only)

This option is the default on Windows operating systems with a desktop experience. The login page opens in your default web browser. This option might be required if your organization has configured conditional access policies that require you to log in from trusted machines.

No flag is required to use the interactive browser login.

### Device code login

This option generates a code that you can use to log in on a web browser on another device. This is the default option on Windows Server core editions and all Linux distributions. When you execute the connect command, you have 5 minutes to open the specified login URL on an internet-connected device and complete the login flow.

To authenticate with a device code, use the `--use-device-code` flag.

### Service principal

Service principals allow you to authenticate non-interactively and are often used for at-scale operations where the same script is run across multiple servers. It's recommended that you provide service principal information via a configuration file (see `--config`) to avoid exposing the secret in any console logs.

To authenticate with a service principal, provide the service principal's application ID and secret: `--service-principal-id [appid] --service-principal-secret [secret]`

### Access token

Access tokens can also be used for non-interactive authentication, but are short-lived and typically used by automation solutions operating on several servers over a short period of time. You can get an access token with [Get-AzAccessToken](/powershell/module/az.accounts/get-azaccesstoken) or any other Microsoft Entra client.

To authenticate with an access token, use the `--access-token [token]` flag.

## Flags

`--access-token`

Specifies the Microsoft Entra access token used to create the Azure Arc-enabled server resource in Azure. For more information, see [authentication options](#authentication-options).

`-f`, `--force-local-only`

Disconnects the server without deleting the resource in Azure. Primarily used if the Azure resource has already been deleted and the local agent configuration needs to be cleaned up.

`-i`, `--service-principal-id`

Specifies the application ID of the service principal used to create the Azure Arc-enabled server resource in Azure. Must be used with the `--service-principal-secret` and `--tenant-id` flags. For more information, see [authentication options](#authentication-options).

`-p`, `--service-principal-secret`

Specifies the service principal secret. Must be used with the `--service-principal-id` and `--tenant-id` flags. To avoid exposing the secret in console logs, it's recommended to pass in the service principal secret in a configuration file. For more information, see [authentication options](#authentication-options).

`--use-device-code`

Generate a Microsoft Entra device login code that can be entered in a web browser on another computer to authenticate the agent with Azure. For more information, see [authentication options](#authentication-options).

`--user-tenant-id`

The tenant ID for the account used to connect the server to Azure. This field is required when the tenant of the onboarding account isn't the same as the desired tenant for the Azure Arc-enabled server resource.

[!INCLUDE [common-flags](includes/azcmagent-common-flags.md)]
