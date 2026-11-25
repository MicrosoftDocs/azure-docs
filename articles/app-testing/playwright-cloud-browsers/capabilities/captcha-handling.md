---
title: Reduce CAPTCHA challenges with Web Bot Auth
titleSuffix: Playwright Workspaces
description: Configure Web Bot Auth to identify browser automation traffic and reduce CAPTCHA challenges in Playwright Workspaces.
ms.topic: how-to
ms.date: 11/18/2026
ms.service: azure-app-testing
ms.subservice: playwright-workspaces
author: Abhinav-Premsekhar
ms.author: apremsekhar
---

# Reduce CAPTCHA challenges with Web Bot Auth (preview)

> [!IMPORTANT]
> Web Bot Auth is in preview. Preview features don't have a service-level agreement and aren't recommended for production workloads. Features, limits, and availability can change.

AI agents that browse the web often run into anti-bot defenses such as CAPTCHA challenges, rate limits, and blocked requests. Sites use these defenses to stop malicious automated traffic, but because they can't reliably tell a legitimate agent from a malicious bot, they often block legitimate agents too. Web Bot Auth addresses this problem by implementing the [IETF draft architecture for HTTP Message Signatures](https://datatracker.ietf.org/doc/html/draft-meunier-web-bot-auth-architecture) for automated traffic.

When you turn on Web Bot Auth for your Playwright workspace, the Playwright workspaces MCP cryptographically signs each browser request with a private key and adds verification headers. Bot management providers verify the signature against a public key directory and apply the access policies that site owners configure. This process gives legitimate automation a standard, verifiable way to identify itself, while site owners keep control over who gets access. Web Bot Auth doesn't solve CAPTCHAs or bypass site policies. It works with prompt and hosted agents, needs no agent code or connection changes, and has no extra cost.

## Choose a key option

| Option | How it works | Provider registration | Best for |
|---|---|---|---|
| Microsoft keys (preview) | Requests use a Microsoft-managed platform identity. | Microsoft registers the workspace after your interest form is approved. | Getting started without managing provider accounts. |
| Customer dedicated keys | Requests use a key pair unique to your workspace. The private key stays in a Microsoft-managed vault, and the public key directory is hosted at your workspace's directory URL. | You submit your directory URL to each provider. | Organizations that want their own verified bot identity. |

You can switch key options later, but traffic is signed with only one option at a time. With customer dedicated keys, all agents in a workspace share one signed identity. Use a separate workspace for each agent if you need separate identities. With Microsoft keys, providers see Microsoft's platform identity rather than your organization's identity.

## How it works

1. Enable Web Bot Auth and select a key option for your workspace.
1. Register with participating bot management providers. Until registration is confirmed, requests might still be challenged.
1. Browser requests include `Signature`, `Signature-Input`, and `Signature-Agent` headers.
1. The provider verifies the signature, caches the result, and applies the website's policy.

## Before you begin

- A Playwright workspace. You can use an existing workspace or [create a workspace](../../playwright-workspaces/quickstart-run-end-to-end-tests.md#create-a-workspace).
- Choose a supported region: East US, East Asia, West US 3, West Europe, Australia East, Japan East, or Switzerland North.
- Decide whether to use Microsoft keys or customer dedicated keys.

Web Bot Auth is off by default.

## Enable Web Bot Auth

In the [Azure portal](https://portal.azure.com/), open your Playwright workspace. Under **Settings** > **Captcha**, set **Captcha (Web Bot Auth)** to **Enabled**, and select **Microsoft keys** or **Customer dedicated keys**.

Alternatively, update the workspace by using the Azure Resource Manager REST API. The following example enables Web Bot Auth with customer dedicated keys. Replace the placeholders with your subscription ID, resource group name, workspace name, and Microsoft Entra access token.

```http
PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.LoadTestService/playwrightWorkspaces/{workspaceName}?api-version=2026-11-10-preview
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "properties": {
    "webBotAuth": {
      "status": "Enabled",
      "signingKey": "Workspace"
    }
  }
}
```

Enabling Web Bot Auth is a long-running operation and can take a few minutes. To verify the setting, send a GET request for the workspace and check that `properties.webBotAuth.status` is `Enabled`.

## Connect your workspace and register with providers

Connect the workspace to your Microsoft Foundry project and add the Browser Automation tool to a prompt or hosted agent. For instructions, see [Use the browser automation tool](/azure/foundry/agents/how-to/tools/browser-automation?tabs=prompt-agents&pivots=python).

Complete registration for the key option you selected:

### Microsoft keys

Complete the [interest form](https://forms.cloud.microsoft/r/feSSnFeQMq). Microsoft reviews your request and registers your workspace with participating providers. Review times vary.

### Customer dedicated keys

1. Copy your public key directory URL from the workspace **Overview** page in the Azure portal. Alternatively, get the workspace by using the REST API and read `properties.webBotAuth.publicKeyDirectoryUri`.
1. Submit the directory URL to each provider. For examples, see [Akamai bot agent registration](https://www.akamai.com/lp/bot-agent-registration) and [Cloudflare bot registration guidance](https://blog.cloudflare.com/botbase-for-operators/). You can register the same URL with multiple providers.
1. Provide the information requested by each provider, such as the bot name, description, category, documentation URL, operator, and contact details.

After registration is confirmed, run your agent against a protected site. If the site's policies allow your signed traffic, the page can load without a CAPTCHA challenge. If access remains blocked, work with the provider or Microsoft, depending on your key option.

## Supported bot management providers

For Microsoft keys, Playwright Workspaces and the Browser Automation tool in Microsoft Foundry support Web Bot Auth with these providers:

- Cloudflare
- Akamai Technologies
- F5

## Turn off Web Bot Auth

In the Azure portal, open your workspace and go to **Settings** > **Captcha**. Turn off the Web Bot Auth setting. New agent sessions stop signing requests, and protected sites might show CAPTCHA challenges again.

## Troubleshoot

| Symptom | Possible cause | What to do |
|---|---|---|
| The agent still receives a CAPTCHA challenge or block page. | Provider registration isn't confirmed, or the site blocks signed bots. | Complete registration with the provider. If the problem persists, contact the provider or Microsoft, depending on your key option. Site owners control access. |
| The `webBotAuth` property is rejected. | The request uses an incorrect API version or property name. | Check the API version and property names in the [REST API example](#enable-web-bot-auth). |

## Frequently asked questions

### Do I need to change my agent code?

No. Web Bot Auth works with prompt and hosted agents without changes to agent code or connections.

### Is provider registration automatic?

No. For Microsoft keys, submit the interest form and wait for approval. For customer dedicated keys, register your directory URL directly with each provider.

### Can I enable Web Bot Auth on an existing workspace?

Yes. You can enable Web Bot Auth on an existing Playwright workspace.

### Is there an extra cost?

No. There's no extra charge for Web Bot Auth.

## Related content

- [Automate browser tasks with the Playwright Workspaces remote MCP server](../quickstart-automate-browser-tasks-remote-mcp.md)
- [Automate browsers with the Playwright Workspaces remote MCP server](../how-to-playwright-workspaces-remote-mcp.md)
