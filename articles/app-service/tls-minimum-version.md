---
title: Manage minimum TLS versions for Azure App Service, Azure Functions, and Logic Apps (Standard)
description: Learn how to check, audit, and update the minimum TLS version for Azure App Service, Azure Functions, and Logic Apps (Standard) to enforce TLS 1.2 or later.
author: msangapu-msft
ms.author: msangapu
ms.topic: conceptual
ms.date: 03/30/2026
ms.service: azure-app-service
---

# Manage minimum TLS versions for Azure App Service, Azure Functions, and Logic Apps (Standard)

## Overview

Transport Layer Security (TLS) 1.0 and 1.1 are legacy security protocols with known vulnerabilities. Microsoft recommends configuring your apps to require TLS 1.2 or later for all inbound connections.

You can enforce a minimum TLS version for the following App Service platform resources:

- **Azure App Service** (Web Apps on Windows and Linux)
- **Azure Functions**
- **Azure Logic Apps (Standard)**
- **App Service Environments (ASE)**

New apps are created with a default minimum TLS version of 1.2. If your app is already configured for TLS 1.2 or later, your app meets current security best practices.

## Check your minimum TLS version

Your app has two independent TLS version settings:

- **Minimum Inbound TLS Version**: applies to client traffic to your app (for example, `yourapp.azurewebsites.net`).
- **SCM Minimum Inbound TLS Version**: applies to the SCM (Kudu) site used for deployments, log streaming, and advanced tooling (for example, `yourapp.scm.azurewebsites.net`).

Both settings should be set to TLS 1.2 or later to fully secure your app.

### [Portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), go to your App Service, Functions, or Logic Apps (Standard) app.
1. On the left menu, select **Settings** > **Configuration**.
1. Select the **General settings** tab.
1. Check the values for **Minimum Inbound TLS Version** and **SCM Minimum Inbound TLS Version**.

### [Azure CLI](#tab/cli)

For **App Service**:

```azurecli
az webapp show --name <app-name> --resource-group <resource-group> \
  --query "siteConfig.{siteTls:minTlsVersion, scmTls:scmMinTlsVersion}" \
  --output table
```

For **Azure Functions**:

```azurecli
az functionapp show --name <app-name> --resource-group <resource-group> \
  --query "siteConfig.{siteTls:minTlsVersion, scmTls:scmMinTlsVersion}" \
  --output table
```

For **Logic Apps (Standard)**:

```azurecli
az logicapp show --name <app-name> --resource-group <resource-group> \
  --query "siteConfig.{siteTls:minTlsVersion, scmTls:scmMinTlsVersion}" \
  --output table
```

### [PowerShell](#tab/powershell)

The following command works for App Service, Azure Functions, and Logic Apps (Standard):

```azurepowershell
$app = Get-AzWebApp -Name <app-name> -ResourceGroupName <resource-group>
$app.SiteConfig.MinTlsVersion
```

> [!NOTE]
> `Get-AzWebApp` may return an empty value for `ScmMinTlsVersion` on some resource types. To reliably check both site and SCM minimum TLS versions, use the Azure CLI.

---

> [!NOTE]
> Deployment slots have their own independent TLS settings. Check each slot separately.

## Check for TLS 1.0 and 1.1 traffic

Before updating your minimum TLS version, check whether your app currently receives traffic over TLS 1.0 or 1.1. This helps you identify clients that would be affected by a change.

1. In the [Azure portal](https://portal.azure.com), go to your App Service, Functions, or Logic Apps (Standard) app.
1. Select **Diagnose and Solve Problems** from the left menu.
1. Search for **Minimum TLS Version Checker**.

> [!TIP]
> The detector list may take a moment to load. If the search returns no results, wait a few seconds and try again.

The detector shows:

- Your app's current minimum TLS version setting.
- A summary of requests by TLS version over the last 24 hours.
- Clients that made requests using TLS 1.0 and TLS 1.1.

If you see TLS 1.0 or 1.1 traffic, identify those clients before updating your minimum TLS version. See [Common scenarios that use TLS 1.0 or 1.1](#common-scenarios-that-use-tls-10-or-11) for guidance.

> [!NOTE]
> This detector shows a snapshot from the last 24 hours. Check during peak traffic times for a more complete picture.

## Update your minimum TLS version

After you confirm that your clients support TLS 1.2 or later, update both the site and SCM minimum TLS version settings.

### [Portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), go to your App Service, Functions, or Logic Apps (Standard) app.
1. On the left menu, select **Settings** > **Configuration**.
1. Select the **General settings** tab.
1. Set **Minimum Inbound TLS Version** to **1.2**.
1. Set **SCM Minimum Inbound TLS Version** to **1.2**.
1. Select **Apply**.

### [Azure CLI](#tab/cli)

**Update the site minimum TLS version:**

For **App Service**:

```azurecli
az webapp config set --name <app-name> --resource-group <resource-group> \
  --min-tls-version 1.2
```

For **Azure Functions**:

```azurecli
az functionapp config set --name <app-name> --resource-group <resource-group> \
  --min-tls-version 1.2
```

For **Logic Apps (Standard)**:

The `az logicapp` CLI doesn't support `config set`. Use `az resource update` to update the site minimum TLS version:

```azurecli
az resource update \
  --ids "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Web/sites/<app-name>/config/web" \
  --set properties.minTlsVersion=1.2
```

**Update the SCM site minimum TLS version:**

The following command works for all resource types (App Service, Azure Functions, and Logic Apps Standard):

```azurecli
az resource update \
  --ids "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Web/sites/<app-name>/config/web" \
  --set properties.scmMinTlsVersion=1.2
```

> [!NOTE]
> The `az webapp config set` and `az functionapp config set` commands don't support a `--scm-min-tls-version` parameter. Use `az resource update` to update the SCM minimum TLS version.

### [PowerShell](#tab/powershell)

The following command works for App Service, Azure Functions, and Logic Apps (Standard):

```azurepowershell
Set-AzWebApp -Name <app-name> -ResourceGroupName <resource-group> -MinTlsVersion 1.2
```

> [!NOTE]
> `Set-AzWebApp` does not support updating the SCM minimum TLS version. Use the Azure CLI `az resource update` command to update the SCM minimum TLS version.

---

> [!NOTE]
> Deployment slots have their own independent TLS settings. Update each slot separately.

## Find apps using older TLS versions at scale

Azure Resource Graph and list APIs (such as `az webapp list` and `Get-AzWebApp`) don't return `siteConfig` properties. To audit minimum TLS versions across your subscription, use Azure Policy.

### Audit with Azure Policy

Azure Policy evaluates your resources server-side and reports which apps don't meet the required TLS version, without making any changes.

1. In the [Azure portal](https://portal.azure.com), search for and select **Policy**.
1. Select **Definitions** from the left menu.
1. Search for and assign these **audit** policies:
   - *App Service apps should use the latest TLS version*
   - *App Service app slots should use the latest TLS version*
   - *Function apps should use the latest TLS version*
   - *Function app slots should use the latest TLS version*
1. Set the **Scope** to your subscription or management group.
1. Select **Review + create**, then **Create**.
1. After the policy evaluates (up to 30 minutes for a new assignment), go to **Policy** > **Compliance** to view non-compliant resources.

> [!WARNING]
> Azure Policy also offers remediation policies that start with **"Configure"** (for example, *Configure App Service apps to use the latest TLS version*). These policies use a **DeployIfNotExists** effect and **will actively update your TLS settings**. Only assign remediation policies after you've confirmed that your clients support TLS 1.2 or later.

> [!NOTE]
> The built-in policies audit the main site minimum TLS version (`minTlsVersion`). There is currently no built-in policy for the SCM site minimum TLS version (`scmMinTlsVersion`). Check SCM settings individually using the CLI or PowerShell commands in the [Check your minimum TLS version](#check-your-minimum-tls-version) section.

For the full list of App Service policy definitions, see [Azure Policy built-in definitions for Azure App Service](policy-reference.md).

## Common scenarios that use TLS 1.0 or 1.1

The following are common reasons your app might receive inbound requests using TLS 1.0 or 1.1. If any of these scenarios apply to you, work with the client owner to ensure they support TLS 1.2 or later before you update the minimum TLS version.

| Scenario | What to check | More info |
|----------|--------------|-----------|
| .NET Framework clients calling your app | Versions before 4.7 may default to TLS 1.0 unless explicitly configured | [TLS best practices with .NET Framework](/dotnet/framework/network-programming/tls) |
| Older Java clients calling your app | Older Java versions may not negotiate TLS 1.2 by default | [Solving the TLS 1.0 Problem](/security/engineering/solving-tls1-problem) |
| Older mobile devices calling your app | Older Android and iOS versions may not use TLS 1.2 by default | Test with your target devices |
| IoT or embedded devices calling your API | Device firmware may only support TLS 1.0 or 1.1 | Check with the device manufacturer |
| Third-party services sending webhooks to your app | The caller's stack may use a legacy TLS version | Contact the third party to confirm TLS 1.2 support |
| CI/CD agents deploying to your SCM site | Self-hosted build agents on outdated operating systems | Update the agent machine's OS and tooling |
| Scripts calling your app (PowerShell, curl) | Older scripting runtimes may default to TLS 1.0 | [Solving the TLS 1.0 Problem](/security/engineering/solving-tls1-problem) |

**General guidance for clients connecting to your app:**

- Update client operating systems, libraries, and frameworks to their latest versions.
- Avoid hardcoding TLS protocol versions in client code. Defer to operating system defaults when possible.
- Use [Fiddler](https://www.telerik.com/fiddler) on the client machine to verify which TLS version it negotiates with your app.

## Frequently asked questions

### What happens when I set a higher minimum TLS version?

The App Service platform rejects all inbound connections that use a TLS version below the configured minimum. Clients that attempt to connect with an unsupported TLS version receive a connection error.

### Do I need to update each deployment slot?

Yes. Each deployment slot has its own independent `minTlsVersion` and `scmMinTlsVersion` settings. Update each slot individually.

### Does this affect outbound connections from my app?

No. This change applies to **inbound** connections to your app only. Outbound connections from your app to other services are governed by the target server's TLS requirements and your app's client configuration.

### Does this affect custom domains, or also *.azurewebsites.net?

Both. The minimum TLS version setting applies to all inbound traffic to your app, regardless of the hostname used.

### Does this apply to Azure Functions and Logic Apps?

Yes. Azure Functions and Logic Apps (Standard) run on the App Service platform and support the same TLS version settings. Logic Apps Consumption (multitenant) runs on a separate platform and is not covered in this article.

## Related content

- [What is TLS/SSL in Azure App Service?](overview-tls.md)
- [Configure an App Service app](configure-common.md)
- [Azure Policy built-in definitions for Azure App Service](policy-reference.md)
- [Solving the TLS 1.0 Problem, 2nd Edition](/security/engineering/solving-tls1-problem)
- [Transport Layer Security best practices with .NET Framework](/dotnet/framework/network-programming/tls)
- [Retirement: Update on retirement of TLS 1.0 and TLS 1.1 versions for Azure Services](https://azure.microsoft.com/updates/azure-support-tls-will-end-by-31-october-2024-2/)

