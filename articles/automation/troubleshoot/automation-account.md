---
title: Troubleshoot Azure Automation account issues
description: This article tells how to troubleshoot and resolve issues with an Azure account.
services: automation
ms.date: 03/28/2022
ms.topic: troubleshooting
---

# Troubleshoot Azure Automation account issues

This article discusses solutions to problems that you might encounter when you use an Azure Automation account. For general information about Automation accounts, see [Azure Automation account authentication overview](../automation-security-overview.md).

## Scenario: Unable to create an Automation account when GUID is used as account name

### Issue

When you create an Automation account with a GUID as an account name, you encounter an error.

### Cause

An *accountid* is a unique identifier across all Automation accounts in a region and when the account name is a GUID, we keep both Automation *accountid* and *name* as GUID. In this scenario, when you create a new Automation account and specify a GUID (as an account name) and, if it conflicts with any existing Automation *accountid*, you encounter an error.

For example, when you try to create an Automation account with the name *8a2f48c1-9e99-472c-be1b-dcc11429c9ff* and if there is already an existing Automation *accountid* across all Automation accounts in that region, then the account creation will fail and you will see the following error:

 ```error
    {

    "code": "BadRequest",

    "message": Automation account already exists with this account id. AccountId: 8a2f48c1-9e99-472c-be1b-dcc11429c9ff. 

    }

```
 ### Resolution

Ensure that you create an Automation account with a new name.

## <a name="rp-register"></a>Scenario: Unable to register Automation Resource Provider for subscriptions

### Issue

When you work with management features, for example, Update Management, in your Automation account, you encounter the following error:

```error
Error details: Unable to register Automation Resource Provider for subscriptions:
```

### Cause

The Automation Resource Provider isn't registered in the subscription.

### Resolution

To register the Automation Resource Provider, follow these steps in the Azure portal:

1. From your browser, go to the [Azure portal](https://portal.azure.com).

2. Go to **Subscriptions**, and select your subscription.   

3. Under **Settings**, select **Resource Providers**.

4. From the list of resource providers, verify that the **Microsoft.Automation** resource provider is registered.

5. If the provider isn't listed, register it as described in [Resolve errors for resource provider registration](../../azure-resource-manager/templates/error-register-resource-provider.md).

## Next steps

If this article doesn't resolve your issue, try one of the following channels for additional support:

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/).
* Connect with [@AzureSupport](https://twitter.com/azuresupport). This is the official Microsoft Azure account for connecting the Azure community to the right resources: answers, support, and experts.
* File an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/), and select **Get Support**.
