---
title: Baseline policy Require MFA for service management (preview) - Azure Active Directory
description: Conditional Access policy to require MFA for Azure Resource Manager

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 05/16/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: calebb, rogoya

ms.collection: M365-identity-device-management
---
# Baseline policy: Require MFA for service management (preview)

You might be using a variety of Azure services in your organization. These services can be managed through Azure Resource Manager API:

* Azure portal
* Azure PowerShell
* Azure CLI

Using Azure Resource Manager to manage your services is a highly privileged action. Azure Resource Manager can alter tenant-wide configurations, such as service settings and subscription billing. Single factor authentication is vulnerable to a variety of attacks like phishing and password spray. Therefore, it’s important to verify the identity of users wanting to access Azure Resource Manager and update configurations, by requiring multi-factor authentication before allowing access.

**Require MFA for service management** is a [baseline policy](concept-baseline-protection.md) that will require MFA for any user accessing Azure portal, Azure PowerShell, or Azure CLI. This policy applies to all users accessing Azure Resource Manager, regardless of if they’re an administrator.

Once this policy is enabled in a tenant, all users logging into Azure management resources will be challenged with multi-factor authentication. If the user is not registered for MFA, the user will be required to register using the Microsoft Authenticator App in order to proceed.

To perform interactive sign-in using [Azure Powershell](https://docs.microsoft.com/powershell/azure/authenticate-azureps), use the [Connect-AzAccount](https://docs.microsoft.com/powershell/module/az.accounts/connect-azaccount) cmdlet.

```PowerShell
Connect-AzAccount
```

When run, this cmdlet will present a token string. To sign in, copy this string and paste it into [https://microsoft.com/devicelogin](https://microsoft.com/devicelogin) in a browser. Your PowerShell session will be authenticated to connect to Azure.

To perform interactive sign-in using [Azure CLI](https://docs.microsoft.com/cli/azure/authenticate-azure-cli?view=azure-cli-latest), Run the [az login](https://docs.microsoft.com/cli/azure/reference-index?view=azure-cli-latest#az-login) command.

```azurecli
az login
```

If the CLI can open your default browser, it will do so and load a sign-in page. Otherwise, you need to open a browser page and follow the instructions on the command line to enter an authorization code after navigating to [https://aka.ms/devicelogin](https://aka.ms/devicelogin) in your browser. Afterwards, sign in with your account credentials in the browser.

## Deployment considerations

Because the **Require MFA for service management** policy applies to all Azure Resource Manager users, several considerations need to be made to ensure a smooth deployment. These considerations include identifying users and service principles in Azure AD that cannot or should not perform MFA, as well as applications and clients used by your organization that do not support modern authentication.

## Enable the baseline policy

The policy **Baseline policy: Require MFA for service management (preview)** comes pre-configured and will show up at the top when you navigate to the Conditional Access blade in Azure portal.

To enable this policy and protect your administrators:

1. Sign in to the **Azure portal** as global administrator, security administrator, or Conditional Access administrator.
1. Browse to **Azure Active Directory** > **Conditional Access**.
1. In the list of policies, select **Baseline policy: Require MFA for service management (preview)**.
1. Set **Enable policy** to **Use policy immediately**.
1. Click **Save**.

## Next steps

For more information, see:

* [Conditional Access baseline protection policies](concept-baseline-protection.md)
* [Five steps to securing your identity infrastructure](../../security/azure-ad-secure-steps.md)
* [What is Conditional Access in Azure Active Directory?](overview.md)