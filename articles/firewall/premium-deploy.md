---
title: Deploy and configure Azure Firewall Premium
description: Learn how to deploy and configure Azure Firewall Premium.
author: duau
ms.author: duau
ms.service: azure-firewall
ms.topic: how-to
ms.date: 03/28/2026
ms.custom: sfi-image-nochange
# Customer intent: As a network security administrator, I want to deploy and configure a next-generation firewall in a testing environment, so that I can validate its capabilities, including TLS inspection and intrusion detection, for sensitive and regulated environments.
---

# Deploy and configure Azure Firewall Premium

Azure Firewall Premium is a next-generation firewall with capabilities that are required for highly sensitive and regulated environments. It includes the following features:

- **TLS Inspection** - decrypts outbound traffic, processes the data, then encrypts the data and sends it to the destination.
- **IDPS** - A network intrusion detection and prevention system (IDPS) that you can use to monitor network activities for malicious activity, log information about this activity, report it, and optionally attempt to block it.
- **URL filtering** - extends Azure Firewall’s FQDN filtering capability to consider an entire URL. For example, `www.contoso.com/a/c` instead of `www.contoso.com`.
- **Web categories** - administrators can allow or deny user access to website categories such as gambling websites, social media websites, and others.

For more information, see [Azure Firewall Premium features](premium-features.md).

Use a template to deploy a test environment that has a central virtual network (10.0.0.0/16) with three subnets:

- A worker subnet (10.0.10.0/24)
- An Azure Bastion subnet (10.0.20.0/24)
- A firewall subnet (10.0.100.0/24)

> [!IMPORTANT]
> [!INCLUDE [Pricing](~/reusable-content/ce-skilling/azure/includes/bastion-pricing.md)]

A single central virtual network is used in this test environment for simplicity. For production purposes, a [hub and spoke topology](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke) with peered virtual networks is more common.

:::image type="content" source="media/premium-deploy/premium-topology.png" alt-text="Diagram showing a central virtual network with worker, Bastion, and firewall subnets." lightbox="media/premium-deploy/premium-topology.png":::

The worker virtual machine is a client that sends HTTP/S requests through the firewall.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

## Deploy the infrastructure

A template deploys a complete testing environment for Azure Firewall Premium enabled with IDPS, TLS Inspection, URL Filtering, and Web Categories:

- A new Azure Firewall Premium and Firewall Policy with predefined settings to allow easy validation of its core capabilities (IDPS, TLS Inspection, URL Filtering, and Web Categories).
- All dependencies, including Key Vault and a Managed Identity. In a production environment, you might already have these resources and not need them in the same template.
- A self-signed Root CA that's generated and deployed on the created Key Vault.
- A derived Intermediate CA that's generated and deployed on a Windows test virtual machine (WorkerVM).
- A Bastion Host (BastionHost) is also deployed and you can use it to connect to the Windows testing machine (WorkerVM).

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Fazurefirewall-premium%2Fazuredeploy.json":::

## Test the firewall

Now you can test IDPS, TLS Inspection, Web filtering, and Web categories.

### Add firewall diagnostics settings

To collect firewall logs, add diagnostics settings to collect firewall logs.

1. Select **DemoFirewall**. Under **Monitoring**, select **Diagnostic settings**.
1. Select **Add diagnostic setting**.
1. For **Diagnostic setting name**, enter *fw-diag*.
1. Under **log**, select **AzureFirewallApplicationRule** and **AzureFirewallNetworkRule**.
1. Under **Destination details**, select **Send to Log Analytics workspace**.
1. Select **Save**.

### IDPS tests

To test IDPS, deploy your own internal test web server with an appropriate server certificate. This test includes sending malicious traffic to a web server, so don't perform this test on a public web server. For more information about Azure Firewall Premium certificate requirements, see [Azure Firewall Premium certificates](premium-certificates.md).

Use `curl` to control various HTTP headers and simulate malicious traffic.

#### To test IDPS for HTTP traffic

1. On the WorkerVM virtual machine, open an administrator command prompt window.
1. Type the following command at the command prompt:

   `curl -A "HaxerMen" <your web server address>`

1. You see your web server response.
1. Go to the Firewall Network rule logs on the Azure portal to find an alert similar to the following message:

   ```
   { “msg” : “TCP request from 10.0.100.5:16036 to 10.0.20.10:80. Action: Alert. Rule: 2032081. IDS:
   USER_AGENTS Suspicious User Agent (HaxerMen). Priority: 1. Classification: A Network Trojan was
   detected”}
   ```

   > [!NOTE]
   > It can take some time for the data to begin showing in the logs. Give it at least a couple minutes to allow for the logs to begin showing the data.

1. Add a signature rule for signature 2032081:

   1. Select the **DemoFirewallPolicy** and under **Settings** select **IDPS**.
   1. Select the **Signature rules** tab.
   1. Under **Signature ID**, in the open text box type *2032081*.
   1. Under **Mode**, select **Deny**.
   1. Select **Save**.
   1. Wait for the deployment to complete before proceeding.

1. On WorkerVM, run the `curl` command again:

   `curl -A "HaxerMen" <your web server address>`

   Since the HTTP request is now blocked by the firewall, you see the following output after the connection timeout expires:

   `read tcp 10.0.100.5:55734->10.0.20.10:80: read: connection reset by peer`

1. Go to the Monitor logs in the Azure portal and find the message for the blocked request.

#### To test IDPS for HTTPS traffic

Repeat these curl tests using HTTPS instead of HTTP. For example:

`curl --ssl-no-revoke -A "HaxerMen" <your web server address>`

You see the same results that you had with the HTTP tests.

### TLS Inspection with URL filtering

Use the following steps to test TLS Inspection with URL filtering.

1. Edit the firewall policy application rules and add a new rule named `AllowURL` to the `AllowWeb` rule collection. Configure the target URL `www.nytimes.com/section/world`, source IP address **\***, destination type **URL**, select **TLS Inspection**, and protocols **http, https**.

1. When the deployment completes, open a browser on WorkerVM and go to `https://www.nytimes.com/section/world`. Validate that the HTML response is displayed as expected in the browser.
1. In the Azure portal, you can view the entire URL in the Application rule Monitoring logs:

   :::image type="content" source="media/premium-deploy/alert-message-url.png" alt-text="Alert message showing the URL":::

Some HTML pages might look incomplete because they refer to other URLs that are denied. To solve this problem, use the following approaches:

- If the HTML page contains links to other domains, add these domains to a new application rule that grants access to these FQDNs.
- If the HTML page contains links to sub URLs, modify the rule and add an asterisk to the URL. For example: `targetURLs=www.nytimes.com/section/world*`

   Alternatively, add a new URL to the rule. For example:

   `www.nytimes.com/section/world, www.nytimes.com/section/world/*`

### Web categories testing

Create an application rule to allow access to sports websites.
1. From the portal, open your resource group and select **DemoFirewallPolicy**.
1. Select **Application Rules**, and then select **Add a rule collection**.
1. For **Name**, enter *GeneralWeb*. Enter *103* for **Priority**. For **Rule collection group**, select **DefaultApplicationRuleCollectionGroup**.
1. Under **Rules**, enter *AllowSports* for **Name**. Enter *\** for **Source**. Enter *http, https* for **Protocol**. Select **TLS Inspection**. For **Destination Type**, select *Web categories*. For **Destination**, select *Sports*.
1. Select **Add**.

1. When the deployment finishes, go to **WorkerVM**, open a web browser, and browse to `https://www.nfl.com`.

   You see the NFL web page, and the Application rule log shows that a **Web Category: Sports** rule was matched and the request was allowed.

## Next steps

- [Building a POC for TLS inspection in Azure Firewall](https://techcommunity.microsoft.com/t5/azure-network-security-blog/building-a-poc-for-tls-inspection-in-azure-firewall/ba-p/3676723)
- [Azure Firewall Premium in the Azure portal](premium-portal.md)
