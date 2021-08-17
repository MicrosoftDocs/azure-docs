---
title: Logz.io troubleshooting - Azure partner solutions
description: Learn about how to troubleshoot the Azure integration with Logz.io.
author: tfitzmac
ms.topic: conceptual
ms.service: partner-services
ms.date: 07/28/2021
ms.author: tomfitz
---

# Troubleshoot Logz.io integration with Azure

This article describes how to troubleshoot the Azure integration with Logz.io.

## Owner role needed to create resource

To set up Logz.io, you must be assigned the [Owner role](../../role-based-access-control/rbac-and-directory-admin-roles.md#azure-roles) in the Azure subscription. Before you begin this integration, [check your access](../../role-based-access-control/check-access.md).

## Single sign-on errors

Errors might occur during SSO setup. For more information about how to set up single sign-on (SSO), see [Set up Logz.io single sign-on](setup-sso.md).

### Unable to save single sign-on settings

This error means there's another enterprise application that's using the Logz.io Security Assertion Markup Language (SAML) identifier. To find out which application, select **Edit** on the **Basic SAML Configuration** section.

To resolve this issue, either disable the enterprise application that's using SAML or use another enterprise application to set up SAML SSO with Logz.io. Make sure the application has the required settings.

### Application not shown in single sign-on

Try to search with the _Application ID_. If no result is shown, then check the SAML settings of the application. The grid only shows existing applications with correct SAML settings. The **Identifier** and the **Reply URL** must be exactly as shown in the following figure.

The blank text boxes allow you to add new values for **Identifier** and the **Reply URL**.

Use the following patterns to add new values:

- **Identifier**: `urn:auth0:logzio:<Application ID>`
- **Reply URL**: `https://logzio.auth0.com/login/callback?connection=<Application ID>`

:::image type="content" source="./media/troubleshoot/basic-saml-config.png" alt-text="Basic SAML configuration settings.":::

## Logs not being sent to Logz.io

Only resources listed in [Azure Monitor resource log categories](../../azure-monitor/essentials/resource-logs-categories.md), will send logs to Logz.io.

To verify whether a resource is sending logs to Logz.io:

1. Go to [Azure diagnostic setting](../../azure-monitor/essentials/diagnostic-settings.md) for the specific resource.
1. Verify that there's a Logz.io diagnostic setting.

:::image type="content" source="./media/troubleshoot/diagnostics.png" alt-text="Diagnostic settings.":::

## Limit reached in monitored resources

Azure Monitor Diagnostics supports a maximum of five diagnostic settings on single resource or subscription. When you reach that limit, the resource will show **Limit reached** in **Monitored resources**. You can't add monitoring with Logz.io.

:::image type="content" source="./media/troubleshoot/limit-monitored-resources.png" alt-text="Limit reached for monitored resources.":::

## VM extension installation failed

A virtual machine (VM) can only be monitored by a single Logz.io account (main or sub). If you try to install the agent on a VM that is already monitored by another account, you see the following error:

:::image type="content" source="./media/troubleshoot/vm-agent-fail.png" alt-text="Virtual machine agent failed installation.":::

## Purchase errors

Purchase fails because a valid credit card isn't connected to the Azure subscription. Or a payment method isn't associated with the subscription.

To resolve a purchase error:

- Use a different Azure subscription.
- Add or update the subscription's credit card or payment method. For more information, see [Add or update a credit card for Azure](../../cost-management-billing/manage/change-credit-card.md).

You can view the error's output from the resource's deployment page, by selecting **Operation Details**.

```json
{
  "status": "Failed",
  "error": {
    "code": "BadRequest",
    "message": "{\"message\":\"Purchase has failed because we couldn't find a valid credit card nor
               a payment method associated with your Azure subscription. Please use a different
               Azure subscription or add\\\\update current credit card or payment method for this
               subscription and retry.\",\"code\":\"BadRequest\"}"
  }
}
```

## Next steps

- Learn how to [manage](manage.md) your Logz.io integration.
- To learn more about SSO, see [Set up Logz.io single sign-on](setup-sso.md).
