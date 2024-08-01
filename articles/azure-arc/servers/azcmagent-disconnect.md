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

There are four ways to provide authentication credentials to the Azure connected machine agent. Choose one authentication option and replace the `[authentication]` section in the usage syntax with the recommended flags.

> [!NOTE]
> The account used to disconnect a server must be from the same tenant as the subscription where the server is registered.

### Interactive browser login (Windows-only)

This option is the default on Windows operating systems with a desktop experience. The login page opens in your default web browser. This option might be required if your organization configured conditional access policies that require you to log in from trusted machines.

No flag is required to use the interactive browser login.

### Device code login

This option generates a code that you can use to log in on a web browser on another device. This is the default option on Windows Server core editions and all Linux distributions. When you execute the connect command, you have 5 minutes to open the specified login URL on an internet-connected device and complete the login flow.

To authenticate with a device code, use the `--use-device-code` flag.

### Service principal with secret

Service principals allow you to authenticate non-interactively and are often used for at-scale operations where the same script is run across multiple servers. It's recommended that you provide service principal information via a configuration file (see `--config`) to avoid exposing the secret in any console logs. The service principal should also be dedicated for Arc onboarding and have as few permissions as possible, to limit the impact of a stolen credential.

To authenticate with a service principal using a secret, provide the service principal's application ID, secret, and tenant ID: `--service-principal-id [appid] --service-principal-secret [secret] --tenant-id [tenantid]`

### Service principal with certificate

Certificate-based authentication is a more secure way to authenticate using service principals. The agent accepts both PCKS #12 (.PFX) files and ASCII-encoded files (such as .PEM) that contain both the private and public keys. The certificate must be available on the local disk and the user running the `azcmagent` command needs read access to the file. Password-protected PFX files are not supported.

To authenticate with a service principal using a certificate, provide the service principal's application ID, tenant ID, and path to the certificate file: `--service-principal-id [appId] --service-principal-cert [pathToPEMorPFXfile] --tenant-id [tenantid]`

For more information, see [create a service principal for RBAC with certificate-based authentication](/cli/azure/azure-cli-sp-tutorial-3).

### Access token

Access tokens can also be used for non-interactive authentication, but are short-lived and typically used by automation solutions operating on several servers over a short period of time. You can get an access token with [Get-AzAccessToken](/powershell/module/az.accounts/get-azaccesstoken) or any other Microsoft Entra client.

To authenticate with an access token, use the `--access-token [token]` flag.

## Flags

`--access-token`

Specifies the Microsoft Entra access token used to create the Azure Arc-enabled server resource in Azure. For more information, see [authentication options](#authentication-options).

`-f`, `--force-local-only`

Disconnects the server without deleting the resource in Azure. Primarily used if the Azure resource was deleted and the local agent configuration needs to be cleaned up.

`-i`, `--service-principal-id`

Specifies the application ID of the service principal used to create the Azure Arc-enabled server resource in Azure. Must be used with the  `--tenant-id` and either the `--service-principal-secret` or `--service-principal-cert` flags. For more information, see [authentication options](#authentication-options).

`--service-principal-cert`

Specifies the path to a service principal certificate file. Must be used with the `--service-principal-id` and `--tenant-id` flags. The certificate must include a private key and can be in a PKCS #12 (.PFX) or ASCII-encoded text (.PEM, .CRT) format. Password-protected PFX files are not supported. For more information, see [authentication options](#authentication-options).

`-p`, `--service-principal-secret`

Specifies the service principal secret. Must be used with the `--service-principal-id` and `--tenant-id` flags. To avoid exposing the secret in console logs, Microsoft recommends providing the service principal secret in a configuration file. For more information, see [authentication options](#authentication-options).

`--use-device-code`

Generate a Microsoft Entra device login code that can be entered in a web browser on another computer to authenticate the agent with Azure. For more information, see [authentication options](#authentication-options).

`--user-tenant-id`

The tenant ID for the account used to connect the server to Azure. This field is required when the tenant of the onboarding account isn't the same as the desired tenant for the Azure Arc-enabled server resource.

[!INCLUDE [common-flags](includes/azcmagent-common-flags.md)]
