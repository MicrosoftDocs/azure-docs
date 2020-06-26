---
title: Troubleshoot Azure Automation account issues
description: This article tells how to troubleshoot and resolve issues with an Azure account.
services: automation
author: mgoedtel
ms.author: magoedte
ms.date: 03/24/2020
ms.topic: conceptual
ms.service: automation
manager: carmonm
---
# Troubleshoot Azure Automation account issues

This article discusses solutions to problems that you might encounter when you use an Azure Automation account. For general information about Automation accounts, see [Azure Automation account authentication overview](../automation-security-overview.md).

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

5. If the provider isn't listed, register it as described in [Resolve errors for resource provider registration](/azure/azure-resource-manager/resource-manager-register-provider-errors).

## Next steps

If this article doesn't resolve your issue, try one of the following channels for additional support:

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/).
* Connect with [@AzureSupport](https://twitter.com/azuresupport). This is the official Microsoft Azure account for connecting the Azure community to the right resources: answers, support, and experts.
* File an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/), and select **Get Support**.