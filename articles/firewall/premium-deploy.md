---
title: Deploy and configure Azure Firewall Premium Preview
description: Learn how to deploy and configure Azure Firewall Premium.
author: vhorne
ms.service: firewall
services: firewall
ms.topic: how-to
ms.date: 02/08/2021
ms.author: victorh
---

# Deploy and configure Azure Firewall Premium Preview

> [!IMPORTANT]
> Azure Firewall Premium is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

 Azure Firewall Premium Preview is a next generation firewall with capabilities that are required for highly sensitive and regulated environments. It includes the following features:

- **TLS inspection** - decrypts outbound traffic, processes the data, then encrypts the data and sends it to the destination.
- **IDPS** - A network intrusion detection and prevention system (IDPS) allows you to monitor network activities for malicious activity, log information about this activity, report it, and optionally attempt to block it.
- **URL filtering** - extends Azure Firewall’s FQDN filtering capability to consider an entire URL. For example, `www.contoso.com/a/c` instead of `www.contoso.com`.
- **Web categories** - administrators can allow or deny user access to website categories such as gambling websites, social media websites, and others.

For more information, see [Azure Firewall Premium features](premium-features.md).

You'll deploy a test environment that has a central VNet (10.0.0.0/16) with three subnets:
- a worker subnet (10.0.10.0/24)
- a server subnet (10.0.20.0/24)
- a firewall subnet (10.0.100.0/24)

A single central VNet is used in this test environment for simplicity. For production purposes, a [hub and spoke topology](https://docs.microsoft.com/azure/architecture/reference-architectures/hybrid-networking/hub-spoke) with peered VNets is more common.

:::image type="content" source="media/premium-deploy/premium-topology.png" alt-text="Central VNet topology":::

The worker virtual machine is a client that sends HTTP/S requests to the Internet and the server virtual machine.

The server virtual machine runs a web server on NGINX. It hosts the HTTP/S sites `http://server.2020-private-preview.com` and `https://server.2020-private-preview.com`. The web server response to both HTTP and HTTPS is `HelloWorld`. This web server is available only within the testing perimeter via the worker virtual machine.

When simulating malicious request generation from the worker virtual machine, you'll target these requests to the  server virtual machine rather than an Internet-based commercial web site.

You can use RDP on the standard TCP port 3389 to connect remotely from your computer to the worker virtual machine. The worker virtual machine has a public IP address exposed to the Internet and TCP port 3389 is open for incoming requests. Connections are allowed only from a pre-defined source IP address or range to avoid malicious connectivity attempts.  You configure the public IP address of your on-premises computer as the allowed IP address.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Deploy the infrastructure

[Download](https://aka.ms/AzureFirewalltemplates) the public preview zip file to deploy the test infrastructure. The zip file contains the following files:

- **FirewallTopology1.template.json** - template deployment definition for a single VNet topology
- **FirewallPolicy.template.json** – An Azure Firewall Policy configuration parameters definition
- **CACertificate.template.json** – For easy deployment of a CA certificate in Key Vault
- **cert.sh** - Bash shell script to create the certificates
- **openssl.cnf** - an openSSL configuration file for the Bash shell script


Use the **FirewallTopology1.template.json** template to deploy the virtual network, virtual machines, firewall, Managed Identity, Key Vault, and all the other supporting resources.

You can deploy custom templates using **Template deployment (deploy using custom templates)**, which can be found in the Azure Marketplace. From the Marketplace, search for **template deployment**. When you start your custom deployment, select **Build your own template in the editor** to open an editor where you can paste the contents of the **FirewallTopology1.template.json** file.

For the **Remote Access Address Prefix** parameter, type your own computer public IP address in CIDR notation. For example: x.x.x.x/32. This allows you to access to the worker virtual machine from the Internet. To determine your computer's public IP address, you can use multiple services, such as https://www.whatismyip.com.


:::image type="content" source="media/premium-deploy/deploy-topology.png" alt-text="Deploy the template":::


## Create and install the certificates

You'll need certificates to configure the TLS Inspection and URL Filtering features.

There are three types of certificates used for your deployment setup:

- **Intermediate CA Certificate (CA Certificate)**

- **Server Certificate (Website certificate)**

- **Root CA Certificate (root certificate)**

For addition details about certificates used by Azure Firewall Premium Preview, see [Azure Firewall Premium Preview certificates](premium-certificates.md).


To configure the test certificates:

1. Generate the certificates using a bash script and configuration file.
2. Run the **CACertificate.template.json** ARM template to place a CA certificate in the Key Vault using the Managed Identity created when you ran the **FirewallTopology1.template.json** ARM template.
3. Install the Root CA certificate on the worker virtual machine.

### Generate the certificates

You can run the bash script on any computer or virtual machine running Linux, or you can use the Azure Cloud Shell.

:::image type="content" source="media/premium-deploy/bash-shell.png" alt-text="Azure Cloud Shell":::


1. Open the Azure Cloud Shell, and select the Bash environment.
2. Create a new folder for the certificates.

   `mkdir certs`

1. Upload the `cert.sh` and `openssl.cnf` files (from the zip file) and then move them to the `certs` directory.

   :::image type="content" source="media/premium-deploy/cloud-shell-upload.png" alt-text="Cloud Shell upload":::

   `mv cert.sh openssl.cnf /home/<your dir>/certs`<br>
   `cd certs`<br>
   `ls -l`

4. Give yourself execute permission and run the script:

   `chmod u+x cert.sh `<br>
   `./cert.sh`<br>
   `ls -l`

   :::image type="content" source="media/premium-deploy/cert-script.png" alt-text="cert.sh script":::


   You'll use the content of the interCA.pfx.base64 file as the input parameter in the CACertificate template. This is a PXF of the CA certificate without a password encoded in base64.

   The rootCA.crt file is a root CA certificate that you'll install on the worker virtual machine.

5. Using the Cloud Shell download button, download `rootCA.crt` and `interCA.pfx.base64` to your local machine.

### Install the root certificate

Now you can install the root certificate on the worker virtual machine.

1. Use RDP to connect to the **WorkerVM** virtual machine.
2. Create a folder named **C:\Certs** on WorkerVM.
3. Copy and paste the `rootCA.crt` file from your local machine to the virtual machine **C:\Certs** folder.
4. Open an administrator Windows PowerShell window on **WorkerVM**..
5. Run the following PowerShell cmdlet to install the root certificate to the local machine trusted root certificates folder:<br>
   `Import-Certificate -FilePath c:\certs\rootCA.crt  -CertStoreLocation 'Cert:\LocalMachine\Root' -Verbose`

### Install the CA certificate

Use the CACertificate.template.json template to deploy the CA certificate using the previously deployed Key Vault and Managed Identity resources.

1. Open the `interCA.pfx.base64` file on your local machine and copy the contents of the file.
2. Deploy the CACertificate.template.json template, and paste the contents into the **Ca Certificate** parameter field:
      :::image type="content" source="media/premium-deploy/ca-certificate.png" alt-text="CA Certificate parameter":::

## Deploy the firewall policy template

The FirewallPolicy.template.json template file contains settings to enable TLS Inspection, IDPS, and URL filtering. Open the file to examine the configuration, and then deploy the template.

### TLS Inspection

Now that the certificates are in place, you can deploy the policy template to create rules to configure TLS Inspection and Application rules for specific target URLs. Azure Firewall will do TLS Inspection only to traffic destined to `google.com/maps` and `www.microsoft.com/.../surface-duo` on port 443. Additional rules can be added as required.

TLS Inspection is supported only for HTTPS on port 443, but URL filtering is also supported with HTTP protocol on any given port.

These Policy parameters can be modified as required and then redeployed on the existing Firewall Premium Preview service.

### IDPS

The IDPS service can be applied both on HTTP and encrypted HTTPS traffic. Once HTTPS traffic needs to be inspected, Azure Firewall Premium can use its TLS Inspection capability to decrypt the traffic and reveal potential malicious activity in it. Therefore, to apply IDPS on HTTPS, a specific application rule must be defined with TLS Inspection mode enabled (`terminateTLS": true` in the template).

- IDPS `mode` may contain any of the following values *Alert*, *Deny*, or *Off*. If the parent policy is configured for *Alert* mode, the child policy must be stricter, so it can only be configured in *Deny* mode. *Off* mode means IDPS is disabled, *Alert* means that once malicious traffic is identified the Firewall adds an entry to the log and *Deny* means the firewall blocks any identified malicious traffic.

- The `signatureOverrides` parameter provides the granularity of mode setting as per the signature. Signature `mode` values are the same as the IDPS `mode` values. `id` is the specific signature identification that `mode` should be applied on. In the following example, any traffic match to signature number 2024897 will be blocked and any traffic match to signature number 2024898 will create a new entry in Firewall log.


   ```json
   "signatureOverrides": [ 
      { 
      	"id": "2024897", 
      	"mode": "Deny" 
      }, 
      { 
      	"id": "2024898", 
      	"mode": "Alert" 
      }
   ],
   ```
- `bypassTrafficSettings` is a set of attributes that allow you to define specific traffic pattern criteria where IDPS isn't applied. With inherited policies, these settings are only allowed in the parent policy. In the following example, any TCP traffic sent from 10.0.10.10 or 10.0.10.11 to 1.1.1.1:80 bypasses IDPS service:
   ```json
   "bypassTrafficSettings": [ 
    {
        "name": "MyRule",
        "protocol": "TCP",
        "sourceAddresses": [
            "10.0.10.10",
            "10.0.10.11"
        ],
        "destinationAddresses": [
            "1.1.1.1"
        ],
        "destinationPorts": [
            "80"
        ]
    }
   ]
   ```

   In a false positive scenario, where a legitimate request is blocked by the Firewall with a signature match, you can use the signature ID from the log and add a new Signature Settings rule to bypass this signature (for example, mode=Disabled).

   Another practical use case for the signature setting might be when IDPS mode is set to **Alert**, but there are one or more specific signatures that you want to block its associated traffic. In this case, you might want to add new signature rules with mode=Deny.

## Test the firewall

Now you can test IDPS, TLS inspection, Web filtering, and Web categories.

### Add firewall diagnostics settings

To collect firewall logs, you need to add diagnostics settings to collect firewall logs.

1. Select the **DemoFirewall** and under **Monitoring**, select **Diagnostic settings**.
2. Select **Add diagnostic setting**.
3. For **Diagnostic setting name**, type *fw-diag*.
4. Under **log**, select **AzureFirewallApplicationRule**, and **AzureFirewallNetworkRule**.
5. Under **Destination details**, select **Send to Log Analytics workspace**.
6. Select **Save**.

### IDPS tests

You can use `curl` to control various HTTP headers and simulate malicious traffic.

#### To test IDPS for HTTP traffic:

1. On the WorkerVM virtual machine, open an administrator command prompt window.
2. Type the following command at the command prompt:

   `curl -A "BlackSun" http://server.2020-private-preview.com`
3. You'll see the following response:
   ```html
   <html>
        <body>
                Hello World
        </body>
   </html>
   ```
4. Go to the Firewall Network rule logs on the Azure portal to find an alert similar to the following message:

   :::image type="content" source="media/premium-deploy/alert-message.png" alt-text="Alert message":::

   > [!NOTE]
   > It can take some time for the data to begin showing logs. Give it at least 20 minutes to allow for the logs to begin showing the data.
5. Add a signature rule for signature 2008983:

   1. Select the **DemoFirewallPolicy** and under **Settings** select **IDPS(preview)**.
   1. Select the **Signature rules** tab.
   1. Under **Signature ID**, in the open text box type *2008983*.
   1. Under **Mode**, select **Deny**.
   1. Select **Save**.
   1. Wait for the deployment to complete before proceeding.



6. On WorkerVM, run the `curl` command again:

   `curl -A "BlackSun" http://server.2020-private-preview.com`

   Since the HTTP request is now blocked by the firewall, you'll see the following output after the connection timeout expires:

   `read tcp 10.0.100.5:55734->10.0.20.10:80: read: connection reset by peer`

7. Go to the Monitor logs in the Azure portal and find the message for the blocked request.
<!---8. Now you can bypass the IDPS function using the **Bypass list**.

   1. On the **IDPS (preview)** page, select the **Bypass list** tab.
   2. Edit **MyRule** and set **Destination** to *10.0.20.10, which is the ServerVM private IP address.
   3. Select **Save**.
1. Run the test again: `curl -A "BlackSun" http://server.2020-private-preview.com` and now you should get the `Hello World` response and no log alert. --->

#### To test IDPS for HTTPS traffic

Repeat these curl tests using HTTPS instead of HTTP. For example:

`curl --ssl-no-revoke -A "BlackSun" https://server.2020-private-preview.com`

You should see the same results that you had with the HTTP tests.

### TLS Inspection with URL filtering

Use the following steps to test TLS Inspection with URL filtering.

1. Edit the firewall policy application rule and add a new target URL `www.nytimes.com/section/world` to the **AllowWeb** application rule.

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
4. Under **Rules** for **Name** type *AllowSports*, **Source** *\**, **Protocol** *http, https*, select **TLS inspection**, **Destination Type** select *Web categories (preview)*, **Destination** select *Sports*.
5. Select **Add**.

      :::image type="content" source="media/premium-deploy/web-categories.png" alt-text="Sports web category":::
6. When the deployment completes, go to  **WorkerVM** and open a web browser and browse to `https://www.nfl.com`.

   You should see the NFL web page, and the Application rule log shows that a **Web Category: Sports** rule was matched and the request was allowed.

## Next steps

- [Azure Firewall Premium Preview in the Azure portal](premium-portal.md)
