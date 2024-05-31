---
title: Uniform Resource Identifier schemes with the Remote Desktop client for Azure Virtual Desktop
description: Learn how to use Uniform Resource Identifier (URI) schemes with the Remote Desktop client to subscribe and connect to Azure Virtual Desktop
ms.topic: conceptual
author: dknappettmsft
ms.author: daknappe
ms.date: 03/14/2024
---

# Uniform Resource Identifier schemes with the Remote Desktop client for Azure Virtual Desktop 


You can use Uniform Resource Identifier (URI) schemes to invoke the Remote Desktop client with specific commands, parameters, and values for use with Azure Virtual Desktop. For example, you can subscribe to a workspace or connect to a particular desktop or RemoteApp.

This article details the available commands and parameters, along with some examples.

## Supported clients

The following table lists the supported clients for use with the URI schemes:

| Client | Version |
|--|--|
| [Remote Desktop client for Windows](users/connect-windows.md) | 1.2.4065 and later |

## Available URI schemes

There are two URI schemes for supported Remote Desktop clients, *ms-avd* and *ms-rd*. With *ms-avd*, you can specify a particular Azure Virtual Desktop resource and user with which to connect. With *ms-rd*, you can automatically subscribe to a workspace in the Remote Desktop client, rather than having to manually add the workspace.

The following sections detail the commands and parameters you can use with each URI scheme.

### ms-avd

The *ms-avd* Uniform Resource Identifier scheme for Azure Virtual Desktop is now generally available. Here's the list of currently supported commands for *ms-avd* and their corresponding parameters.

#### ms-avd:connect

`ms-avd:connect` locates a specified Azure Virtual Desktop resource and initiates the RDP session, directly connecting a specified user to that resource.


**Command name:** connect

**Command parameters:**

| Parameter | Values | Description |
|--|--|--|
| workspaceid | Object ID (GUID). | Specify the object ID of a valid workspace.<br /><br />To get the object ID value using PowerShell, see [Retrieve the object ID of a host pool, workspace, application group, or application](powershell-module.md#retrieve-the-object-id-of-a-host-pool-workspace-application-group-or-application). You can also use [Desktop Virtualization REST APIs](/rest/api/desktopvirtualization). |
| resourceid | Object ID (GUID). | Specify the object ID of a published resource contained in the workspace. The value can be for a desktop or RemoteApp.<br /><br />To get the object ID value using PowerShell, see [Retrieve the object ID of a host pool, workspace, application group, or application](powershell-module.md#retrieve-the-object-id-of-a-host-pool-workspace-application-group-or-application). You can also use [Desktop Virtualization REST APIs](/rest/api/desktopvirtualization). |
| user | User Principal Name (UPN), for example `user@contoso.com`. | Specify a valid user with access to specified resource. |
| env *(optional)* | **avdarm** (commercial Azure)<br />**avdgov** (Azure Government) | Specify the Azure cloud where resources are located. |
| version | **0** | Specify the version of the connect URI scheme to use. |
| launchpartnerid *(optional)*| GUID. | Specify the partner or customer-provided ID that you can use with [Azure Virtual Desktop Diagnostics](diagnostics-log-analytics.md) to help with troubleshooting. We recommend using a GUID, which you can generate with the [New-Guid](/powershell/module/microsoft.powershell.utility/new-guid) PowerShell cmdlet. |
| peeractivityid *(optional)*| GUID. | Specify the partner or customer-provided ID that you can use with [Azure Virtual Desktop Diagnostics](diagnostics-log-analytics.md) to help with troubleshooting. We recommend using a GUID, which you can generate with the [New-Guid](/powershell/module/microsoft.powershell.utility/new-guid) PowerShell cmdlet. |

**Example:**
```
ms-avd:connect?workspaceId=1638e073-63b2-46d8-bd84-ea02ea905467&resourceid=c2f5facc-196f-46af-991e-a90f3252c185&username=user@contoso.com&version=0
```

### ms-rd

Here's the list of currently supported commands for *ms-rd* and their corresponding parameters.

> [!TIP]
> Using `ms-rd:` without any commands launches the Remote Desktop client.

#### ms-rd:subscribe

`ms-rd:subscribe` launches the Remote Desktop client and starts the subscription process.

**Command name:** subscribe

**Command parameters:**

| Parameter | Values | Description |
|--|--|--|
| url | A valid URL, such as <https://rdweb.wvd.microsoft.com>. | Specify a workspace URL. |

**Example:**

```
ms-rd:subscribe?url=https://rdweb.wvd.microsoft.com
```

## Known Limitations

Here are known limitations with the URI schemes:

- Display properties cannot be configured via URI. You can configure display properties as an admin [on a host pool](customize-rdp-properties.md) or end users can configure display properties in the [Azure Virtual Desktop client](users/remote-desktop-clients-overview.md).


## Next steps

Learn how to [Connect to Azure Virtual Desktop with the Remote Desktop client for Windows](users/connect-windows.md?toc=%2Fazure%2Fvirtual-desktop%2Ftoc.json&bc=%2Fazure%2Fvirtual-desktop%2Fbreadcrumb%2Ftoc.json).