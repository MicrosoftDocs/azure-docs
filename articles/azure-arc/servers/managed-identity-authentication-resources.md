---
title: Authenticate against Azure resources with Arc enabled servers
description: This article describes Azure Instance Metadata Service support for Arc enabled servers and how you can authenticate against Azure resources.
ms.topic: conceptual
ms.date: 11/10/2020
---

# Authenticate against Azure resources with Arc enabled servers

Managed identities for Azure resources provide Azure services with an automatically managed identity in Azure Active Directory. This mechanism allows Azure VMs to authenticate to any Azure service that supports Azure AD authentication by requesting an access token.

Arc enabled servers includes support for this verification method, allowing you to use this identity and authenticate to any service that supports Azure Active Directory (AD) authentication.

While onboarding your server to Azure Arc enabled servers, several actions take place to configure the resource in order to use this identity:

- Creates a resource ID representing the server in Azure Resource Manager.

- Creates a system-assigned identity representing the resource in your Azure Active Directory tenant.

- Configures the Azure Instance Metadata Service (IMDS) for [Windows](../../virtual-machines/windows/instance-metadata-service.md) or [Linux](../../virtual-machines/linux/instance-metadata-service.md), which is a REST endpoint accessible only from within the server using a well-known, non-routable IP address. This service provides a subset of metadata information about the Arc enabled server to help manage and configure it.

## How to find the IMDS endpoint

The IMDS endpoint for an Arc enabled server is available from the address `127.0.0.1:40342`. This address is set in the environment variable **IDMS_ENDPOINT**. 

The system-wide environment setting **IDENTITY_ENDPOINT** is used to discover Identity endpoint (on Azure VMs), by applications

Azure's IMDS is a REST Endpoint that is available at a well-known non-routable IP address (169.254.169.254), it can be accessed only from within the VM. Communication between the VM and IMDS never leaves the Host. It is best practice to have your HTTP clients bypass web proxies within the VM when querying IMDS and treat 169.254.169.254 the same as 168.63.129.16.

IMDS_ENDPOINT and IDENTITY_ENDPOINT environment variables