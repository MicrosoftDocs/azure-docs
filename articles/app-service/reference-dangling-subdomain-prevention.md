---
title: Prevent Subdomain Takeovers
description: Learn how to prevent dangling subdomain takeovers to reduce the threat of malicious activity.
ms.topic: concept-article
ms.date: 12/02/2025
ms.update-cycle: 1095-days
ms.author: msangapu
ms.custom: UpdateFrequency3
author: msangapu-msft
ms.service: azure-app-service

# Customer intent: As an App Service admin, I want to learn options for mitigating subdomain takeovers in Azure App Service so that I can reduce the threat of malicious activity.  

---

# Prevent subdomain takeovers in Azure App Service

Subdomain takeovers are a common threat for organizations that regularly create and delete many resources. A subdomain takeover can occur when you have a DNS record that points to a deprovisioned Azure resource. Such DNS records are also known as "dangling DNS" entries. Subdomain takeovers allow malicious actors to redirect traffic intended for an organization’s domain to a site performing malicious activity.

The risks of subdomain takeover include:

- Loss of control over the content of the subdomain
- Cookie harvesting from unsuspecting visitors
- Phishing campaigns
- Further risks of classic attacks such as XSS, CSRF, or CORS bypass

To learn more about subdomain takeover, see [Prevent dangling DNS entries and avoid subdomain takeover](../security/fundamentals/subdomain-takeover.md).

Azure App Service provides [name reservation](#how-app-service-prevents-subdomain-takeovers), [domain verification tokens](#how-you-can-prevent-subdomain-takeovers), and [secure unique default hostnames](#secure-unique-default-hostnames-recommended) to prevent subdomain takeovers.

## Secure unique default hostnames (recommended)

The most effective way to protect your App Service resources from subdomain takeover is to use **secure unique default hostnames**. This feature is generally available for Web Apps, Function Apps, and Logic Apps (Standard).

When you enable secure unique default hostnames, your app receives a default hostname that includes a randomized hash and a region identifier, making it unique to your organization. This format ensures that no one outside your organization can create a resource with the same default hostname, which eliminates the risk of subdomain takeover through dangling DNS entries.

### How it works

Traditional App Service resources use a default hostname format that is globally predictable:

| | Global (original) | Unique (new) |
|---|---|---|
| **Default hostname** | `<AppName>.azurewebsites.net` | `<AppName>-<Hash>.<Region>.azurewebsites.net` |
| **SCM endpoint** | `<AppName>.scm.azurewebsites.net` | `<AppName>-<Hash>.scm.<Region>.azurewebsites.net` |

For example, a web app named `contoso` deployed to East US might receive:

```
contoso-a6gqaeashthkhkeu.eastus-01.azurewebsites.net
```

The 16-character hash is deterministic within a configurable scope, so you can ensure consistent hostnames across environments when needed.

### Hash scope options

When you create a resource with a unique default hostname, you choose a **scope** that determines how the hash is generated:

| Scope | Description |
|---|---|
| **Tenant Reuse** | Same hash for the same app name across all subscriptions in your Microsoft Entra tenant. Use this when you redeploy resources across subscriptions within the same tenant. |
| **Subscription Reuse** | Same hash for the same app name within the same subscription. |
| **Resource Group Reuse** | Same hash for the same app name within the same resource group. |
| **No Reuse** | Unique hash every time. Maximum isolation. |

> [!TIP]
> If you regularly redeploy resources across environments (for example, from a test subscription to a production subscription under the same tenant), use **Tenant Reuse** to ensure your hostnames remain consistent across subscriptions.

### Deployment slots

Deployment slots follow the same format as the production site, but each slot receives its own distinct hash:

| | Default hostname | Slot hostname |
|---|---|---|
| **Format** | `<AppName>-<Hash>.<Region>.azurewebsites.net` | `<AppName>-<SlotName>-<Hash>.<Region>.azurewebsites.net` |

Slots are always created with the same scope as the production site.

### How to enable

You can enable secure unique default hostnames when creating a new resource through the Azure portal, Azure CLI, ARM templates, or REST API. The feature can only be enabled during resource creation — it can't be applied to existing resources retroactively.

#### [Azure CLI](#tab/cli)

Use the `--domain-name-scope` parameter when creating a new resource to enable secure unique default hostnames.

| Resource type | Command | Reference |
|---|---|---|
| **Web Apps** | `az webapp create --name <AppName> --resource-group <ResourceGroup> --plan <AppServicePlan> --domain-name-scope TenantReuse` | [az webapp create](/cli/azure/webapp#az-webapp-create) |
| **Function Apps** | `az functionapp create --name <AppName> --resource-group <ResourceGroup> --storage-account <StorageAccount> --consumption-plan-location <Region> --domain-name-scope TenantReuse` | [az functionapp create](/cli/azure/functionapp#az-functionapp-create) |
| **Logic Apps (Standard)** | `az logicapp create --name <AppName> --resource-group <ResourceGroup> --storage-account <StorageAccount> --domain-name-scope TenantReuse` | [az logicapp create](/cli/azure/logicapp#az-logicapp-create) |

The `--domain-name-scope` parameter accepts the following values: `NoReuse`, `ResourceGroupReuse`, `SubscriptionReuse`, `TenantReuse`.

#### [Azure portal](#tab/portal)

1. Go to the **Create Web App** page.
2. Toggle the option to enable **Unique default hostname**.
3. Complete the remaining configuration and create the resource.

> [!NOTE]
> Resources created through the Azure portal use **Tenant Reuse** by default. To use a different scope, use the Azure CLI or ARM templates.

#### [ARM template / REST API](#tab/arm)

Add the `AutoGeneratedDomainNameLabelScope` property to the site properties in your ARM template or API request:

```json
{
    "location": "Central US",
    "kind": "app",
    "properties": {
        "serverFarmId": "<AppServicePlanResourceId>",
        "AutoGeneratedDomainNameLabelScope": "TenantReuse"
    }
}
```

The `AutoGeneratedDomainNameLabelScope` property accepts the following values: `TenantReuse`, `SubscriptionReuse`, `ResourceGroupReuse`, `NoReuse`.

---

### Migrating existing resources

Since this feature can only be enabled at creation time, you have two options for existing resources:

- **Clone** a pre-existing app to a new app with secure unique default hostnames enabled.
- **Restore from a backup** to a new app with secure unique default hostnames enabled.

Both options are available in the Azure portal.

### Why adopt this now

Secure unique default hostnames provide **protection by default**. Unlike other mitigation strategies that require ongoing DNS hygiene and manual intervention, this approach builds security directly into the hostname structure. When enabled:

- No external actor can recreate your default hostname.
- Dangling DNS entries can't be exploited for subdomain takeover.
- No additional configuration steps are needed beyond enabling the feature at creation time.

We strongly recommend enabling secure unique default hostnames for all new App Service deployments.

> [!NOTE]
> The region identifier in the hostname (for example, `eastus-01`) may use different number suffixes for future deployments. Don't take hard dependencies on the exact region-number combination.

### Related content

- [Public Preview: Creating Web App with a Unique Default Hostname](https://techcommunity.microsoft.com/blog/appsonazureblog/public-preview-creating-web-app-with-a-unique-default-hostname/4156353)
- [Secure Unique Default Hostnames: GA on App Service Web Apps and Public Preview on Functions](https://techcommunity.microsoft.com/blog/appsonazureblog/secure-unique-default-hostnames-ga-on-app-service-web-apps-and-public-preview-on/4303571)
- [Secure Unique Default Hostnames Now GA for Functions and Logic Apps](https://techcommunity.microsoft.com/blog/appsonazureblog/secure-unique-default-hostnames-now-ga-for-functions-and-logic-apps/4484237)

## How App Service prevents subdomain takeovers

Upon deletion of an App Service app or App Service Environment (ASE), the corresponding DNS is forbidden from reuse except by subscriptions that belong to the tenant of the subscription that originally owned the DNS. Thus, the customer has some time to either clean up any associations or pointers to the said DNS or reclaim the DNS in Azure by recreating the resource with the same name. This behavior is enabled by default on Azure App Service for `*.azurewebsites.net` and `*.appserviceenvironment.net` resources, so it doesn't require any customer configuration.

### Example scenario

Subscription *A* and subscription *B* are the only subscriptions that belong to tenant *AB*. Subscription *A* contains an App Service web app *test* with DNS name `test.azurewebsites.net`. Upon deletion of the app, only subscriptions *A* or *B* are able to immediately reuse the DNS name `test.azurewebsites.net` by creating a web app named *test*. No other subscriptions are allowed to claim the name right after the resource deletion.

## How you can prevent subdomain takeovers

When creating DNS entries for Azure App Service, create an *asuid.{subdomain}* TXT record with the domain verification ID. When such a TXT record exists, no other Azure subscription can validate the custom domain or take it over unless they add their token verification ID to the DNS entries.

These records prevent the creation of another App Service app using the same name from your CNAME entry. Without the ability to prove ownership of the domain name, threat actors can't receive traffic or control the content.

DNS records should be updated before the site deletion to ensure bad actors can't take over the domain between the period of deletion and re-creation.

To get a domain verification ID, see [Set up an existing custom domain in Azure App Service](app-service-web-tutorial-custom-domain.md).
