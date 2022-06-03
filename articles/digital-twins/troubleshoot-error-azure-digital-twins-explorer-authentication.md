---
title: "Troubleshoot Azure Digital Twins Explorer: Authentication error"
titleSuffix: Azure Digital Twins
description: Learn how to diagnose and resolve authentication errors in Azure Digital Twins Explorer.
ms.service: digital-twins
author: baanders
ms.author: baanders
ms.topic: troubleshooting
ms.date: 03/29/2022
---

# Troubleshoot Azure Digital Twins Explorer: Authentication errors

This article describes causes and resolution steps for receiving authentication errors while running [Azure Digital Twins Explorer](/samples/azure-samples/digital-twins-explorer/digital-twins-explorer/). 

## Symptoms

When running Azure Digital Twins Explorer, you encounter the following error message:

:::image type="content" source="media/troubleshoot-error-azure-digital-twins-explorer-authentication/permission-error.png" alt-text="Screenshot of an error message in the Azure Digital Twins Explorer, entitled Make sure you have the right permissions.":::

## Causes

### Cause #1

This error will occur if your Azure account doesn't have the required Azure role-based access control (Azure RBAC) permissions set on your Azure Digital Twins instance. In order to access data in your instance, you must have the *Azure Digital Twins Data Reader* or *Azure Digital Twins Data Owner* role on the instance you are trying to read or manage, respectively. 

For more information about security and roles in Azure Digital Twins, see [Security for Azure Digital Twins solutions](concepts-security.md).

## Solutions

### Solution #1

Verify that your Azure user has the *Azure Digital Twins Data Reader* role on the Azure Digital Twins instance if you're just trying to read its data, or the *Azure Digital Twins Data Owner* role on the instance if you're trying to manage its data.

Note that this role is different from...
* the former name for this role during preview, *Azure Digital Twins Owner (Preview)* (the role is the same, but the name has changed)
* the *Owner* role on the entire Azure subscription. *Azure Digital Twins Data Owner* is a role within Azure Digital Twins and is scoped to this individual Azure Digital Twins instance.
* the *Owner* role in Azure Digital Twins. These are two distinct Azure Digital Twins management roles, and *Azure Digital Twins Data Owner* is the role that should be used for management.

If you do not have this role, set it up to resolve the issue.

#### Check current setup

[!INCLUDE [digital-twins-setup-verify-role-assignment.md](../../includes/digital-twins-setup-verify-role-assignment.md)]

#### Fix issues 

If you do not have this role assignment, someone with an Owner role in your Azure subscription should run the following command to give your Azure user the appropriate role on the Azure Digital Twins instance. 

If you're an Owner on the subscription, you can run this command yourself. If you're not, contact an Owner to run this command on your behalf. The role name is *Azure Digital Twins Data Owner* for edit access, or *Azure Digital Twins Data Reader* for read access.

```azurecli-interactive
az dt role-assignment create --dt-name <your-Azure-Digital-Twins-instance> --assignee "<your-Azure-AD-email>" --role "<role-name>"
```

For more details about this role requirement and the assignment process, see [Set up your user's access permissions](how-to-set-up-instance-CLI.md#set-up-user-access-permissions).

## Next steps

Read the setup steps for creating and authenticating a new Azure Digital Twins instance:
* [Set up an instance and authentication (CLI)](how-to-set-up-instance-cli.md)

Read more about security and permissions on Azure Digital Twins:
* [Security for Azure Digital Twins solutions](concepts-security.md)