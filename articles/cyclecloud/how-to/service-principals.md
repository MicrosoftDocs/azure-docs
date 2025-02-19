---
title: Using a Service Principal
description: How to use a Service Principal with Azure CycleCloud.
author: rokeptne
ms.date: 01/27/2025
ms.author: rokeptne
---

# Using Service Principal

An Azure AD Service Principal may be used to permission Azure CycleCloud to manage clusters in your subscription (as an alternative to using a [Managed Identity](managed-identities.md)).

It is generally recommended to use either a [System-Assigned](/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm#system-assigned-managed-identity) or [User-Assigned Managed Identity](/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm#user-assigned-managed-identity) to grant those permissions rather than a Service Principal. 

## Create a Service Principal

Azure CycleCloud requires a service principal with rights to manage your Azure subscription. If you do not have a service principal available, you can create one using the Azure CLI as shown below.

> [!NOTE]
> Your service principal name **must** be unique.  In the example below, *CycleCloudApp* should be replaced with a unique name.
> If you run the command below with an existing name, it replaces and invalidates the existing Service Principal.

```azurecli-interactive
az ad sp create-for-rbac --name CycleCloudApp --years 1
```

The output will display a series of information. You will need to save the `appId`, `password`, and `tenant`:

``` output
"appId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
"displayName": "CycleCloudApp",
"name": "http://CycleCloudApp",
"password": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
"tenant": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

## Permissions

The simplest option (with sufficient access rights) is to assign the Contributor Role for the Subscription to the new CycleCloud Service Principal.
However, the Contributor Role has a higher privilege level than CycleCloud requires.  A [custom Role](/azure/role-based-access-control/custom-roles) may be created and assigned to the VM.

The [Managed Identity Guide](managed-identities.md) has details on creating an appropriate lower-privilege AD Role for the Service Principal.

To use a Service Principle to give permissions to CycleCloud, ensure that the "App Registration" radio button is selected.

::: moniker range=">=cyclecloud-8"
![Add Subscription Managed Identities](../images/version-8/add-subscription-service-principle-8.7.png)
::: moniker-end
