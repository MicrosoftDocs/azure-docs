---
title: Troubleshoot Azure Automation account issues
description: This article tells how to troubleshoot and resolve issues with an Azure account.
services: automation
ms.date: 03/28/2022
ms.topic: troubleshooting
---

# Troubleshoot Azure Automation account issues

This article discusses solutions to problems that you might encounter when you use an Azure Automation account. For general information about Automation accounts, see [Azure Automation account authentication overview](../automation-security-overview.md).

## Unable to create an Automation account with a unique account name in a subscription

### Issue

The following error displays when creating an Automation account with a provided name (GUID) that's not used as the Automation account name in the same subscription.

    ```error
    {

    "code": "BadRequest",

    "message": Automation account already exists with this account id. AccountId: 8a2f48c1-9e99-472c-be1b-dcc11429c9ff. 

    }

    ```
### Cause

This error appears when the Automation account name (that's GUID) is used as the *accountId* for other Automation account. The *accountId* is a unique identifier across all Automation accounts in a region. For example, if you try to create an Automation account with the name *123abc-123abc-123abc-123abc-123abc*. The creation will fail if this is already used as the *accountid* for an existing Automation account (with a different account name) in that region.


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
