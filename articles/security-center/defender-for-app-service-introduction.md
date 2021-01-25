---
title: Azure Defender for App Service - the benefits and features
description: Learn about the benefits and features of Azure Defender for App Service.
author: memildin
ms.author: memildin
ms.date: 01/25/2021
ms.topic: overview
ms.service: security-center
manager: rkarlin

---

# Introduction to Azure Defender for App Service

Azure App Service is a fully managed platform for building and hosting your web apps and APIs. Since the platform is fully managed, you don't have to worry about the infrastructure. It provides management, monitoring, and operational insights to meet enterprise-grade performance, security, and compliance requirements. For more information, see [Azure App Service](https://azure.microsoft.com/services/app-service/).

**Azure Defender for App Service** uses the scale of the cloud to identify attacks targeting applications running over App Service. Attackers probe web applications to find and exploit weaknesses. Before being routed to specific environments, requests to applications running in Azure go through several gateways, where they're inspected and logged. This data is then used to identify exploits and attackers, and to learn new patterns that will be used later.


## Availability

|Aspect|Details|
|----|:----|
|Release state:|Generally available (GA)|
|Pricing:|[Azure Defender for App Service](azure-defender.md) is billed as shown on [the pricing page](security-center-pricing.md)|
|Supported App Service plans:|![Yes](./media/icons/yes-icon.png) Basic, Standard, Premium, Isolated, or Linux<br>![No](./media/icons/no-icon.png) Free, Shared, or Consumption<br>[Learn more about App Service Plans](https://azure.microsoft.com/pricing/details/app-service/plans/)|
|Clouds:|![Yes](./media/icons/yes-icon.png) Commercial clouds<br>![No](./media/icons/no-icon.png) National/Sovereign (US Gov, China Gov, Other Gov)|
|||

## What are the benefits of Azure Defender for App Service?

When you enable Azure Defender for App Service, you immediately benefit from the following services offered by this Azure Defender plan:

- **Secure** - Security Center assesses the resources covered by your App Service plan and generates security recommendations based on its findings. Use the detailed instructions in these recommendations to harden your App Service resources.

- **Detect** - Azure Defender detects a multitude of threats to your App Service resources by monitoring:
    - the VM instance in which your App Service is running, and its management interface
    - the requests and responses sent to and from your App Service apps
    - the underlying sandboxes and VMs (App Service on Windows only)
    - App Service internal logs - available thanks to the visibility that Azure has as a cloud provider

As a cloud-native solution, Azure Defender can identify attack methodologies applying to multiple targets. For example, from a single host it would be difficult to identify a distributed attack from a small subset of IPs, crawling to similar endpoints on multiple hosts.

The log data and the infrastructure together can tell the story, from a new attack circulating in the wild to compromises in customer machines. Therefore, even if Security Center is deployed after a web app has been exploited, it might be able to detect ongoing attacks.


## What threats can Azure Defender for App Service detect?

### Threats by MITRE ATT&CK tactics

Azure Defender monitors for many threats to your App Service resources. The alerts cover almost the complete list of MITRE ATT&CK tactics from pre-attack to command and control. Azure Defender can detect:

- **Pre-attack threats** - Defender can detect the execution of multiple types of vulnerability scanners that attackers frequently use to probe applications for weaknesses.

- **Initial access threats** - [Microsoft Threat Intelligence](https://go.microsoft.com/fwlink/?linkid=2128684) powers these alerts that include triggering an alert when a known malicious IP address connects to your Azure App Service FTP interface.

- **Execution threats** - Defender can detect attempts to run high privilege commands, Linux commands on a Windows App Service, fileless attack behavior, digital currency mining tools, and many other suspicious and malicious code execution activities.

### Dangling DNS detection

Azure Defender for App Service also identifies any dangling DNS entries created in your DNS table when an App Service website is decommissioned. At this moment, the DNS entry is pointing at a non-existent resource and your subdomain is vulnerable to a takeover. 

Subdomain takeovers are a common, high-severity threat for organizations. When a threat actor detects a dangling DNS entry, they create their own site at the destination address. The traffic intended for the organization’s domain is now directed to the threat actor's site, and they can use that traffic for a wide range of malicious activity. 

Learn more about dangling DNS and the threat of subdomain takeover, in [Prevent dangling DNS entries and avoid subdomain takeover](../security/fundamentals/subdomain-takeover.md).

For a full list of the Azure App Service alerts, see the [Reference table of alerts](alerts-reference.md#alerts-azureappserv).


## How to protect your Azure App Service web apps and APIs

To protect your Azure App Service plan with Azure Defender for App Service:

1. Ensure you have a supported App Service plan that is associated with dedicated machines. Supported plans are listed above in [Availability](#availability).

2. Enable **Azure Defender** on your subscription as described in [Pricing of Azure Security Center](security-center-pricing.md).

    > [!TIP]
    > You can optionally enable only the **Azure Defender for App Service** plan.

    Security Center is natively integrated with App Service, eliminating the need for deployment and onboarding - the integration is transparent.

>[!NOTE]
> The pricing and settings page lists a number of instances for your **Resource Quantity**. This represents the total number of compute instances, in all App Service plans on this subscription, running at the moment when you opened the pricing tier page.
>
> Azure App Service offers a variety of plans. Your App Service plan defines the set of compute resources for a web app to run. These are equivalent to server farms in conventional web hosting. One or more apps can be configured to run on the same computing resources (or in the same App Service plan).
>
>To validate the count, head to ‘App Service plans’ in the Azure Portal, where you can see the number of compute instances used by each plan. 



## Next steps

In this article, you learned about Azure Defender for App Service. 

For related material, see the following articles: 

- You can export alerts whether it's generated by Security Center, or received *by* Security Center from another security product. To export your alerts to Azure Sentinel, any third-party SIEM, or any other external tool, follow the instructions in [Stream alerts to a SIEM, SOAR, or IT Service Management solution](export-to-siem.md).
- For a list of the Azure App Service alerts, see the [Reference table of alerts](alerts-reference.md#alerts-azureappserv).
- For more information on App Service plans, see [App Service plans](https://azure.microsoft.com/pricing/details/app-service/plans/).
- > [!div class="nextstepaction"]
    > [Enable Azure Defender](security-center-pricing.md)