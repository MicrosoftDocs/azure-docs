---
title: Troubleshoot custom security attributes in Azure AD (Preview) - Azure Active Directory
description: Learn how to troubleshoot custom security attributes in Azure Active Directory.
services: active-directory
author: rolyon
ms.author: rolyon
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: how-to
ms.date: 09/15/2021
ms.collection: M365-identity-device-management
---

# Troubleshoot custom security attributes in Azure AD (Preview)

> [!IMPORTANT]
> Custom security attributes are currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Symptom - Custom security attributes page is disabled

When signed in to the Azure portal as Global Administrator and you try to access the **Custom security attributes** page, it is disabled.

![Custom security attributes page disabled in Azure portal.](./media/custom-security-attributes-troubleshoot/attributes-disabled.png)

**Cause**

[Global Administrator](../roles/permissions-reference.md#global-administrator) and [Global Reader](../roles/permissions-reference.md#global-reader) do not have permissions to read or manage custom security attributes. To work with custom security attributes, you must be assigned an attribute role.

**Solution**

Assign one of the following roles:

- Attribute Definition Administrator
- Attribute Definition Reader
- Attribute Assignment Administrator
- Attribute Assignment Reader

## Next steps

- [Manage access to custom security attributes in Azure AD](custom-security-attributes-manage.md)
