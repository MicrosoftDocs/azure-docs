---
title: Deploy and configure Azure Firewall Premium
description: Learn how to deploy and configure Azure Firewall Premium.
author: vhorne
ms.service: firewall
services: firewall
ms.topic: how-to
ms.date: 02/28/2022
ms.author: victorh
---

# Deploy and configure Azure Firewall Premium


 Azure Firewall Premium is a next generation firewall with capabilities that are required for highly sensitive and regulated environments. It includes the following features:

- **TLS Inspection** - decrypts outbound traffic, processes the data, then encrypts the data and sends it to the destination.
- **IDPS** - A network intrusion detection and prevention system (IDPS) allows you to monitor network activities for malicious activity, log information about this activity, report it, and optionally attempt to block it.
- **URL filtering** - extends Azure Firewall’s FQDN filtering capability to consider an entire URL. For example, `www.contoso.com/a/c` instead of `www.contoso.com`.
- **Web categories** - administrators can allow or deny user access to website categories such as gambling websites, social media websites, and others.

For more information, see [Azure Firewall Premium features](premium-features.md).

You'll use a template to deploy a test environment that has a central VNet (10.0.0.0/16) with three subnets:
- a worker subnet (10.0.10.0/24)
- an Azure Bastion subnet (10.0.20.0/24)
- a firewall subnet (10.0.100.0/24)

> [!IMPORTANT]
> [!INCLUDE [Pricing](../../includes/bastion-pricing.md)]

A single central VNet is used in this test environment for simplicity. For production purposes, a [hub and spoke topology](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke) with peered VNets is more common.

:::image type="content" source="media/premium-deploy/premium-topology.png" alt-text="Central VNet topology":::

The worker virtual machine is a client that sends HTTP/S requests through the firewall.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Deploy the infrastructure

The template deploys a complete testing environment for Azure Firewall Premium enabled with IDPS, TLS Inspection, URL Filtering, and Web Categories:

- a new Azure Firewall Premium and Firewall Policy with predefined settings to allow easy validation of its core capabilities (IDPS, TLS Inspection, URL Filtering, and Web Categories)
- deploys all dependencies including Key Vault and a Managed Identity. In a production environment, these resources may already be created and not needed in the same template.
- generates self-signed Root CA and deploys it on the generated Key Vault
-  generates a derived Intermediate CA and deploys it on a Windows test virtual machine (WorkerVM)
- a Bastion Host (BastionHost) is also deployed and can be used to connect to the Windows testing machine (WorkerVM)



:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Fazurefirewall-premium%2Fazuredeploy.json":::

## Test the firewall

Now you can test IDPS, TLS Inspection, Web filtering, and Web categories.

### Add firewall diagnostics settings

To collect firewall logs, you need to add diagnostics settings to collect firewall logs.

1. Select the **DemoFirewall** and under **Monitoring**, select **Diagnostic settings**.
2. Select **Add diagnostic setting**.
3. For **Diagnostic setting name**, type *fw-diag*.
4. Under **log**, select **AzureFirewallApplicationRule**, and **AzureFirewallNetworkRule**.
5. Under **Destination details**, select **Send to Log Analytics workspace**.
6. Select **Save**.

### IDPS tests

To test IDPS, you should deploy your own internal test Web server with an appropriate server certificate. This test includes sending malicious traffic to a Web server, so it isn't advisable to do this to a public Web server. For more information about Azure Firewall Premium certificate requirements, see [Azure Firewall Premium certificates](premium-certificates.md).

You can use `curl` to control various HTTP headers and simulate malicious traffic.

#### To test IDPS for HTTP traffic:

1. On the WorkerVM virtual machine, open an administrator command prompt window.
2. Type the following command at the command prompt:

   `curl -A "HaxerMen" <your web server address>`
3. You'll see your Web server response.
4. Go to the Firewall Network rule logs on the Azure portal to find an alert similar to the following message:

   ```
   { “msg” : “TCP request from 10.0.100.5:16036 to 10.0.20.10:80. Action: Alert. Rule: 2032081. IDS: 
   USER_AGENTS Suspicious User Agent (HaxerMen). Priority: 1. Classification: A Network Tojan was 
   detected”}
   ```

   > [!NOTE]
   > It can take some time for the data to begin showing in the logs. Give it at least a couple minutes to allow for the logs to begin showing the data.
5. Add a signature rule for signature 2032081:

   1. Select the **DemoFirewallPolicy** and under **Settings** select **IDPS**.
   1. Select the **Signature rules** tab.
   1. Under **Signature ID**, in the open text box type *2032081*.
   1. Under **Mode**, select **Deny**.
   1. Select **Save**.
   1. Wait for the deployment to complete before proceeding.



6. On WorkerVM, run the `curl` command again:

   `curl -A "HaxerMen" <your web server address>`

   Since the HTTP request is now blocked by the firewall, you'll see the following output after the connection timeout expires:

   `read tcp 10.0.100.5:55734->10.0.20.10:80: read: connection reset by peer`

7. Go to the Monitor logs in the Azure portal and find the message for the blocked request.
<!---8. Now you can bypass the IDPS function using the **Bypass list**.

   1. On the **IDPS (preview)** page, select the **Bypass list** tab.
   2. Edit **MyRule** and set **Destination** to *10.0.20.10, which is the ServerVM private IP address.
   3. Select **Save**.
1. Run the test again: `curl -A "HaxerMen" http://server.2020-private-preview.com` and now you should get the `Hello World` response and no log alert. --->

#### To test IDPS for HTTPS traffic

Repeat these curl tests using HTTPS instead of HTTP. For example:

`curl --ssl-no-revoke -A "HaxerMen" <your web server address>`

You should see the same results that you had with the HTTP tests.

### TLS Inspection with URL filtering

Use the following steps to test TLS Inspection with URL filtering.

1. Edit the firewall policy application rules and add a new rule called `AllowURL` to the `AllowWeb` rule collection. Configure the target URL `www.nytimes.com/section/world`, Source IP address **\***, Destination type **URL**, select **TLS Inspection**, and protocols **http, https**.

3. When the deployment completes, open a browser on WorkerVM and go to `https://www.nytimes.com/section/world` and validate that the HTML response is displayed as expected in the browser.
4. In the Azure portal, you can view the entire URL in the Application rule Monitoring logs:

      :::image type="content" source="media/premium-deploy/alert-message-url.png" alt-text="Alert message showing the URL":::

Some HTML pages may look incomplete because they refer to other URLs that are denied. To solve this issue, the following approach can be taken:

- If the HTML page contain links to other domains, you can add these domains to a new application rule with allow access to these FQDNs.
- If the HTML page contain links to sub URLs then you can modify the rule and add an asterisk to the URL. For example: `targetURLs=www.nytimes.com/section/world*`

   Alternatively, you can add a new URL to the rule. For example: 

   `www.nytimes.com/section/world, www.nytimes.com/section/world/*`

### Web categories testing

Let's create an application rule to allow access to sports web sites.
1. From the portal, open your resource group and select **DemoFirewallPolicy**.
2. Select **Application Rules**, and then **Add a rule collection**.
3. For **Name**, type *GeneralWeb*, **Priority** *103*, **Rule collection group** select **DefaultApplicationRuleCollectionGroup**.
4. Under **Rules** for **Name** type *AllowSports*, **Source** *\**, **Protocol** *http, https*, select **TLS Inspection**, **Destination Type** select *Web categories*, **Destination** select *Sports*.
5. Select **Add**.

      :::image type="content" source="media/premium-deploy/web-categories.png" alt-text="Sports web category":::
6. When the deployment completes, go to  **WorkerVM** and open a web browser and browse to `https://www.nfl.com`.

   You should see the NFL web page, and the Application rule log shows that a **Web Category: Sports** rule was matched and the request was allowed.

## Next steps

- [Building a POC for TLS inspection in Azure Firewall](https://techcommunity.microsoft.com/t5/azure-network-security-blog/building-a-poc-for-tls-inspection-in-azure-firewall/ba-p/3676723)
- [Azure Firewall Premium in the Azure portal](premium-portal.md)