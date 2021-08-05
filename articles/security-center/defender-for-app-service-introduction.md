---
title: Azure Defender for App Service - the benefits and features
description: Learn about the capabilities of Azure Defender for App Service and how to enable it on your subscription
author: memildin
ms.author: memildin
ms.date: 01/25/2021
ms.topic: overview
ms.service: security-center
manager: rkarlin

---

# Protect your web apps and APIs

## Prerequisites

Security Center is natively integrated with App Service, eliminating the need for deployment and onboarding - the integration is transparent.

To protect your Azure App Service plan with Azure Defender for App Service, you'll need:

- A supported App Service plan associated with dedicated machines. Supported plans are listed in [Availability](#availability).

- Azure Defender enabled on your subscription as described in [Quickstart: Enable Azure Defender](enable-azure-defender.md).

    > [!TIP]
    > You can optionally enable individual plans in Azure Defender (like Azure Defender for App Service).

## Availability

| Aspect                       | Details                                                                                                                                                                                        |
|------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Release state:               | General Availability (GA)                                                                                                                                                                      |
| Pricing:                     | [Azure Defender for App Service](azure-defender.md) is billed as shown on [Security Center pricing](https://azure.microsoft.com/pricing/details/security-center/)<br>Billing is according to total compute instances in all plans       |
| Supported App Service plans: | [All App Service plans](https://azure.microsoft.com/pricing/details/app-service/plans/) are supported except [Azure Functions on the consumption plan](../azure-functions/functions-scale.md). |
| Clouds:                      | :::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/no-icon.png"::: National/Sovereign (US Gov, Azure China)                                                     |
|                              |                                                                                                                                                                                                |

## What are the benefits of Azure Defender for App Service?

Azure App Service is a fully managed platform for building and hosting your web apps and APIs. Since the platform is fully managed, you don't have to worry about the infrastructure. It provides management, monitoring, and operational insights to meet enterprise-grade performance, security, and compliance requirements. For more information, see [Azure App Service](https://azure.microsoft.com/services/app-service/).

**Azure Defender for App Service** uses the scale of the cloud to identify attacks targeting applications running over App Service. Attackers probe web applications to find and exploit weaknesses. Before being routed to specific environments, requests to applications running in Azure go through several gateways, where they're inspected and logged. This data is then used to identify exploits and attackers, and to learn new patterns that will be used later.

When you enable Azure Defender for App Service, you immediately benefit from the following services offered by this Azure Defender plan:

- **Secure** - Security Center assesses the resources covered by your App Service plan and generates security recommendations based on its findings. Use the detailed instructions in these recommendations to harden your App Service resources.

- **Detect** - Azure Defender detects a multitude of threats to your App Service resources by monitoring:
    - the VM instance in which your App Service is running, and its management interface
    - the requests and responses sent to and from your App Service apps
    - the underlying sandboxes and VMs
    - App Service internal logs - available thanks to the visibility that Azure has as a cloud provider

As a cloud-native solution, Azure Defender can identify attack methodologies applying to multiple targets. For example, from a single host it would be difficult to identify a distributed attack from a small subset of IPs, crawling to similar endpoints on multiple hosts.

The log data and the infrastructure together can tell the story: from a new attack circulating in the wild to compromises in customer machines. Therefore, even if Security Center is deployed after a web app has been exploited, it might be able to detect ongoing attacks.


## What threats can Azure Defender for App Service detect?

### Threats by MITRE ATT&CK tactics

Azure Defender monitors for many threats to your App Service resources. The alerts cover almost the complete list of MITRE ATT&CK tactics from pre-attack to command and control. Azure Defender can detect:

- **Pre-attack threats** - Defender can detect the execution of multiple types of vulnerability scanners that attackers frequently use to probe applications for weaknesses.

- **Initial access threats** - [Microsoft Threat Intelligence](https://go.microsoft.com/fwlink/?linkid=2128684) powers these alerts that include triggering an alert when a known malicious IP address connects to your Azure App Service FTP interface.

- **Execution threats** - Defender can detect attempts to run high privilege commands, Linux commands on a Windows App Service, fileless attack behavior, digital currency mining tools, and many other suspicious and malicious code execution activities.

### Dangling DNS detection

Azure Defender for App Service also identifies any DNS entries remaining in your DNS registrar when an App Service website is decommissioned - these are known as dangling DNS entries. When you remove a website and don't remove its custom domain from your DNS registrar, the DNS entry is pointing at a non-existent resource and your subdomain is vulnerable to a takeover. Azure Defender doesn't scan your DNS registrar for *existing* dangling DNS entries; it alerts you when an App Service website is decommissioned and its custom domain (DNS entry) isn't deleted.

Subdomain takeovers are a common, high-severity threat for organizations. When a threat actor detects a dangling DNS entry, they create their own site at the destination address. The traffic intended for the organization’s domain is then directed to the threat actor's site, and they can use that traffic for a wide range of malicious activity.

Dangling DNS protection is available whether your domains are managed with Azure DNS or an external domain registrar and applies to App Service on both Windows and Linux.

:::image type="content" source="media/defender-for-app-service-introduction/dangling-dns-alert.png" alt-text="An example of an Azure Defender alert about a discovered dangling DNS entry. Enable Azure Defender for App Service to receive this and other alerts for your environment." lightbox="media/defender-for-app-service-introduction/dangling-dns-alert.png":::

Learn more about dangling DNS and the threat of subdomain takeover, in [Prevent dangling DNS entries and avoid subdomain takeover](../security/fundamentals/subdomain-takeover.md).

For a full list of the Azure App Service alerts, see the [Reference table of alerts](alerts-reference.md#alerts-azureappserv).

> [!NOTE]
> Defender might not trigger dangling DNS alerts if your custom domain doesn't point directly to an App Service resource, or if Defender hasn't monitored traffic to your website since the dangling DNS protection was enabled (because there won't be logs to help identify the custom domain).

## Next steps

In this article, you learned about Azure Defender for App Service. 

For related material, see the following articles: 

- To export your alerts to Azure Sentinel, any third-party SIEM, or any other external tool, follow the instructions in [Stream alerts to a SIEM, SOAR, or IT Service Management solution](export-to-siem.md).
- For a list of the Azure Defender for App Service alerts, see the [Reference table of alerts](alerts-reference.md#alerts-azureappserv).
- For more information on App Service plans, see [App Service plans](https://azure.microsoft.com/pricing/details/app-service/plans/).
> [!div class="nextstepaction"]
> [Enable Azure Defender](enable-azure-defender.md)