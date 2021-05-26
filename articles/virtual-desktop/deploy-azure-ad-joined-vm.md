---
title: Deploy Azure AD joined VMs in Windows Virtual Desktop - Azure
description: How to configure and deploy Azure AD joined VMs in Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr
manager: lizross

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 06/10/2021
ms.author: helohr
---
# Deploy Azure AD joined virtual machines in Windows Virtual Desktop

> [!IMPORTANT]
> Azure AD joined VM support is currently in public preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article will walk you through the process of deploying and accessing Azure Active Directory joined (AADJ) virtual machines in Windows Virtual Desktop. This removes the need to have line-of-sight from the VM to an on-premise Active Directory Domain Controller (DC) or to deploy a DC or Azure AD Domain services (AAD DS) in Azure. In some cases, it can remove the need for a DC entirely, simplifying the deployment and management of the environment. These VMs can also be automatically enrolled in Intune for ease of management.

> [!NOTE]
> Windows Virtual Desktop (Classic) doesn't support this feature.

## Requirements

> [!IMPORTANT]
> During public preview, you must configure your host pool to be in the [validation environment](create-validation-host-pool.md).

Before deploying Azure AD joined VMs, you must have the following setup running in your environment:

* Host pool should only contain AADJ VMs and not a mix
* To access AADJ VMs from a Windows device, ensure the PKU2U protocol is enabled on both the local PC and the session host

## Supported configurations

The following configurations are currently supported with Azure AD joined VMs:

* Deploying Personal Desktops with local profiles
* Deploying Pooled desktop or apps with local profiles, generally used as a jump box or for stateless applications.

## Deploying Azure AD joined VMs

Deploy session hosts

Link to Intune documentation

Assign user permissions

Add users to app group

Assign users to the virtual machine


## Accessing Azure AD joined VMs

You can access AADJ VMs using all the Microsoft Remote Desktop clients and 3rd party Linux clients using the latest SDK. The default configuration 

Enable RDSTLS

> [!NOTE]
> Single sign-on is currently only supported for the Windows and web clients using [Active Directory Federation Services](AHSDHASDHASHD).

## Troubleshooting

"Logon attempt failed"
AUDHASDJKHAJSDJK

"Sign in not supported"

## Next steps

Now that you've deployed some Azure AD joined VMs, you can sign in to a supported Windows Virtual Desktop client to test it as part of a user session. If you want to learn how to connect to a session, check out these articles:

* [Connect with the Windows Desktop client](connect-windows-7-10.md)
* [Connect with the web client](connect-web.md)
