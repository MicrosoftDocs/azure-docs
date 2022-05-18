---
title: Understand the enhanced security features of Microsoft Defender for Cloud 
description: Learn about the benefits of enabling enhanced security in Microsoft Defender for Cloud
ms.topic: overview
ms.date: 05/16/2022
ms.custom: references_regions
---

# Microsoft Defender for Cloud's enhanced security features

The enhanced security features are free for the first 30 days. At the end of 30 days, if you decide to continue using the service, we'll automatically start charging for usage.

You can upgrade from the **Environment settings** page, as described in [Quickstart: Enable enhanced security features](enable-enhanced-security.md). For pricing details in your local currency or region, see the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

## What are the benefits of enabling enhanced security features?

Defender for Cloud is offered in two modes:

- **Without enhanced security features** (Free) - Defender for Cloud is enabled for free on all your Azure subscriptions when you visit the workload protection dashboard in the Azure portal for the first time, or if enabled programmatically via API. Using this free mode provides the secure score and its related features: security policy, continuous security assessment, and actionable security recommendations to help you protect your Azure resources.

- **Defender for Cloud with all enhanced security features** - Enabling enhanced security extends the capabilities of the free mode to workloads running in private and other public clouds, providing unified security management and threat protection across your hybrid cloud workloads. Some of the major benefits include:

    - **Microsoft Defender for Endpoint** - Microsoft Defender for Servers includes [Microsoft Defender for Endpoint](https://www.microsoft.com/microsoft-365/security/endpoint-defender) for comprehensive endpoint detection and response (EDR). Learn more about the benefits of using Microsoft Defender for Endpoint together with Defender for Cloud in [Use Defender for Cloud's integrated EDR solution](integration-defender-for-endpoint.md).
    - **Vulnerability assessment for virtual machines, container registries, and SQL resources** - Easily enable vulnerability assessment solutions to discover, manage, and resolve vulnerabilities. View, investigate, and remediate the findings directly from within Defender for Cloud.
    - **Multi-cloud security** - Connect your accounts from Amazon Web Services (AWS) and Google Cloud Platform (GCP) to protect resources and workloads on those platforms with a range of Microsoft Defender for Cloud security features.
    - **Hybrid security** – Get a unified view of security across all of your on-premises and cloud workloads. Apply security policies and continuously assess the security of your hybrid cloud workloads to ensure compliance with security standards. Collect, search, and analyze security data from multiple sources, including firewalls and other partner solutions.
    - **Threat protection alerts** - Advanced behavioral analytics and the Microsoft Intelligent Security Graph provide an edge over evolving cyber-attacks. Built-in behavioral analytics and machine learning can identify attacks and zero-day exploits. Monitor networks, machines, data stores (SQL servers hosted inside and outside Azure, Azure SQL databases, Azure SQL Managed Instance, and Azure Storage) and cloud services for incoming attacks and post-breach activity. Streamline investigation with interactive tools and contextual threat intelligence.
    - **Track compliance with a range of standards** - Defender for Cloud continuously assesses your hybrid cloud environment to analyze the risk factors according to the controls and best practices in [Azure Security Benchmark](/security/benchmark/azure/introduction). When you enable the enhanced security features, you can apply a range of other industry standards, regulatory standards, and benchmarks according to your organization's needs. Add standards and track your compliance with them from the [regulatory compliance dashboard](update-regulatory-compliance-packages.md).
    - **Access and application controls** - Block malware and other unwanted applications by applying machine learning powered recommendations adapted to your specific workloads to create allow and blocklists. Reduce the network attack surface with just-in-time, controlled access to management ports on Azure VMs. Access and application controls drastically reduce exposure to brute force and other network attacks.
    - **Container security features** - Benefit from vulnerability management and real-time threat protection on your containerized environments. Charges are based on the number of unique container images pushed to your connected registry. After an image has been scanned once, you won't be charged for it again unless it's modified and pushed once more.
    - **Breadth threat protection for resources connected to Azure** - Cloud-native threat protection for the Azure services common to all of your resources: Azure Resource Manager, Azure DNS, Azure network layer, and Azure Key Vault. Defender for Cloud has unique visibility into the Azure management layer and the Azure DNS layer, and can therefore protect cloud resources that are connected to those layers.


## FAQ - Pricing and billing 

- [How can I track who in my organization enabled a Microsoft Defender plan in Defender for Cloud?](#how-can-i-track-who-in-my-organization-enabled-a-microsoft-defender-plan-in-defender-for-cloud)
- [What are the plans offered by Defender for Cloud?](#what-are-the-plans-offered-by-defender-for-cloud)
- [How do I enable Defender for Cloud's enhanced security for my subscription?](#how-do-i-enable-defender-for-clouds-enhanced-security-for-my-subscription)
- [Can I enable Microsoft Defender for Servers on a subset of servers in my subscription?](#can-i-enable-microsoft-defender-for-servers-on-a-subset-of-servers-in-my-subscription)
- [If I already have a license for Microsoft Defender for Endpoint can I get a discount for Defender for Servers?](#if-i-already-have-a-license-for-microsoft-defender-for-endpoint-can-i-get-a-discount-for-defender-for-servers)
- [My subscription has Microsoft Defender for Servers enabled, do I pay for not-running servers?](#my-subscription-has-microsoft-defender-for-servers-enabled-do-i-pay-for-not-running-servers)
- [Will I be charged for machines without the Log Analytics agent installed?](#will-i-be-charged-for-machines-without-the-log-analytics-agent-installed)
- [If a Log Analytics agent reports to multiple workspaces, will I be charged twice?](#if-a-log-analytics-agent-reports-to-multiple-workspaces-will-i-be-charged-twice)
- [If a Log Analytics agent reports to multiple workspaces, is the 500 MB free data ingestion available on all of them?](#if-a-log-analytics-agent-reports-to-multiple-workspaces-is-the-500-mb-free-data-ingestion-available-on-all-of-them)
- [Is the 500 MB free data ingestion calculated for an entire workspace or strictly per machine?](#is-the-500-mb-free-data-ingestion-calculated-for-an-entire-workspace-or-strictly-per-machine)
- [What data types are included in the 500 MB data daily allowance?](#what-data-types-are-included-in-the-500-mb-data-daily-allowance)

### How can I track who in my organization enabled a Microsoft Defender plan in Defender for Cloud?
Azure Subscriptions may have multiple administrators with permissions to change the pricing settings. To find out which user made a change, use the Azure Activity Log.

:::image type="content" source="media/enhanced-security-features-overview/logged-change-to-pricing.png" alt-text="Azure Activity log showing a pricing change event.":::

If the user's info isn't listed in the **Event initiated by** column, explore the event's JSON for the relevant details.

:::image type="content" source="media/enhanced-security-features-overview/tracking-pricing-changes-in-activity-log.png" alt-text="Azure Activity log JSON explorer.":::


### What are the plans offered by Defender for Cloud? 
The free offering from Microsoft Defender for Cloud offers the secure score and related tools. Enabling enhanced security turns on all of the Microsoft Defender plans to provide a range of security benefits for all your resources in Azure, hybrid, and multi-cloud environments.  

### How do I enable Defender for Cloud's enhanced security for my subscription? 
You can use any of the following ways to enable enhanced security for your subscription: 

| Method                                          | Instructions                                                                                                                                       |
|-------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| Defender for Cloud pages of the Azure portal    | [Enable enhanced protections](enable-enhanced-security.md)                                                                                         |
| REST API                                        | [Pricings API](/rest/api/securitycenter/pricings)                                                                                                  |
| Azure CLI                                       | [az security pricing](/cli/azure/security/pricing)                                                                                                 |
| PowerShell                                      | [Set-AzSecurityPricing](/powershell/module/az.security/set-azsecuritypricing)                                                                      |
| Azure Policy                                    | [Bundle Pricings](https://github.com/Azure/Azure-Security-Center/blob/master/Pricing%20%26%20Settings/ARM%20Templates/Set-ASC-Bundle-Pricing.json) |


### Can I enable Microsoft Defender for Servers on a subset of servers in my subscription?

No. When you enable [Microsoft Defender for Servers](defender-for-servers-introduction.md) on a subscription, all the machines in the subscription will be protected by Defender for Servers.

An alternative is to enable Microsoft Defender for Servers at the Log Analytics workspace level. If you do this, only servers reporting to that workspace will be protected and billed. However, several capabilities will be unavailable. These include Microsoft Defender for Endpoint, VA solution (TVM/Qualys), just-in-time VM access, and more. 

### If I already have a license for Microsoft Defender for Endpoint can I get a discount for Defender for Servers?

If you've already got a license for **Microsoft Defender for Endpoint for Servers Plan 2**, you won't have to pay for that part of your Microsoft Defender for Servers license. Learn more about [this license](/microsoft-365/security/defender-endpoint/minimum-requirements#licensing-requirements).

To request your discount, [contact Defender for Cloud's support team](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview). You'll need to provide the relevant workspace ID, region, and number of Microsoft Defender for Endpoint for servers licenses applied for machines in the given workspace.

The discount will be effective starting from the approval date, and won't take place retroactively.

### My subscription has Microsoft Defender for Servers enabled, do I pay for not-running servers?

No. When you enable [Microsoft Defender for Servers](defender-for-servers-introduction.md) on a subscription, you won't be charged for any machines that are in the deallocated power state while they're in that state. Machines are billed according to their power state as shown in the following table:

| State        | Description                                                                                                                                      | Instance usage billed |
|--------------|--------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------|
| Starting     | VM is starting up.                                                                                                                               | Not billed            |
| Running      | Normal working state for a VM                                                                                                                    | Billed                |
| Stopping     | This is a transitional state. When completed, it will show as Stopped.                                                                           | Billed                |
| Stopped      | The VM has been shut down from within the guest OS or using the PowerOff APIs. Hardware is still allocated to the VM and it remains on the host. | Billed                |
| Deallocating | Transitional state. When completed, the VM will show as Deallocated.                                                                             | Not billed            |
| Deallocated  | The VM has been stopped successfully and removed from the host.                                                                                  | Not billed            |

:::image type="content" source="media/enhanced-security-features-overview/deallocated-virtual-machines.png" alt-text="Azure Virtual Machines showing a deallocated machine.":::

### If I enable Defender for Clouds Servers plan on the Subscription level, do I need to enable it on the workspace level?

When you enable the Servers plan on the subscription level, Defender for Cloud will enable your default workspace(s) automatically. 

However, if you're using a custom workspace in place of the default workspace, you'll need to enable the Servers plan on all of your custom workspaces. 

If you're using a custom workspace and enable the plan on the subscription level only, the `Microsoft Defender for servers should be enabled on workspaces` recommendation, on the recommendations page. This recommendation will advise you to enable the servers plan on the workspace level as well. Until the workspace has the Servers plan enabled, it will not benefit from the full security coverage (Microsoft Defender for Endpoint, VA solution (TVM/Qualys), just-in-time VM access, and more) offered by the Defender for Cloud, but will still incur the cost.

You will not be charged twice, when you enable the Servers plan on both the workspace and subscription level. The system compares the VM UUID, if they match they'll be treated as one and billed as one.

You may not want to enable the Servers plan on singular workspaces that are connected to cross enabled subscriptions with multiple solutions attached to them that may have multiple VMs connected to them. If you do connect a workspace with multiple attached VMs, that is cross enabled, you'll be billed for each VM that is attached. Therefore you may only want to enable the Servers plan on the workspaces that it will be relevant to.

### Will I be charged for machines without the Log Analytics agent installed?

Yes. When you enable [Microsoft Defender for Servers](defender-for-servers-introduction.md) on a subscription, the machines in that subscription get a range of protections even if you haven't installed the Log Analytics agent. This is applicable for Azure virtual machines, Azure virtual machine scale sets instances, and Azure Arc-enabled servers.

### If a Log Analytics agent reports to multiple workspaces, will I be charged twice?

Yes. If you've configured your Log Analytics agent to send data to two or more different Log Analytics workspaces (multi-homing), you'll be charged for every workspace that has a 'Security' or 'AntiMalware' solution installed.

> [!Note]
> [Antimalware Assessment - Microsoft Azure](https://ms.portal.azure.com/#blade/Microsoft_Azure_Marketplace/GalleryItemDetailsBladeNopdl/id/Microsoft.AntiMalwareOMS/product/%7B%22displayName%22%3A%22Antimalware%20Assessment%22%2C%22itemDisplayName%22%3A%22Antimalware%20Assessment%22%2C%22id%22%3A%22Microsoft.AntiMalwareOMS%22%2C%22bigId%22%3A%22Microsoft.AntiMalwareOMS%22%2C%22offerId%22%3A%22AntiMalwareOMS%22%2C%22publisherId%22%3A%22Microsoft%22%2C%22publisherDisplayName%22%3A%22Microsoft%22%2C%22summary%22%3A%22View%20status%20of%20antivirus%20and%20antimalware%20scans%20across%20your%20servers.%22%2C%22longSummary%22%3A%22%22%2C%22description%22%3A%22%3Cp%3E%3Cb%3EIf%20you%20add%20the%20Antimalware%20solution%20after%20June%2019%2C%202017%2C%20you%20will%20be%20billed%20per%20node%20regardless%20of%20the%20workspace%20pricing%20tier.%3C%2fb%3E%3C%2fp%3E%3Cp%3EOperations%20Management%20Suite%20Antimalware%20Assessment%20Solution%20helps%20you%20identify%20servers%20that%20are%20infected%20or%20at%20increased%20risk%20of%20infection%20by%20malware.%3C%2fp%3E%3Cp%3EServers%20without%20real-time%20antimalware%20software%20increase%20the%20likelihood%20of%20intrusions%20into%20your%20network.%20Malware%20can%20be%20used%20to%20steal%20or%20compromise%20your%20sensitive%20data.%20With%20simple%20out-of-the-box%20dashboards%2C%20you%20can%20quickly%20assess%20which%20servers%20need%20your%20immediate%20attention.%20You%20can%20use%20our%20guided%20search%20to%20get%20more%20information%20about%20the%20malware%20protection%20status%20of%20your%20servers.%3C%2fp%3E%22%2C%22isPrivate%22%3Afalse%2C%22hasPrivateOffer%22%3Afalse%2C%22isMacc%22%3Afalse%2C%22isPreview%22%3Afalse%2C%22isByol%22%3Afalse%2C%22isCSPEnabled%22%3Atrue%2C%22isCSPSelective%22%3Afalse%2C%22isThirdParty%22%3Afalse%2C%22isReseller%22%3Afalse%2C%22hasFreeTrials%22%3Afalse%2C%22marketingMaterial%22%3A%5B%5D%2C%22version%22%3A%221.0.24%22%2C%22metadata%22%3A%7B%22leadGeneration%22%3Anull%2C%22testDrive%22%3Anull%7D%2C%22categoryIds%22%3A%5B%22mgmt%22%2C%22businessApplication%22%2C%22msOmsSolutions%22%2C%22msOmsClassicSolutions%22%5D%2C%22screenshotUris%22%3A%5B%22https%3A%2f%2fcatalogartifact.azureedge.net%2fpublicartifactsmigration%2fMicrosoft.AntiMalwareOMS.1.0.24%2fScreenshots%2fibiza_gallery_01.png%22%5D%2C%22links%22%3A%5B%7B%22id%22%3A%220%22%2C%22displayName%22%3A%22Watch%20Video%22%2C%22uri%22%3A%22https%3A%2f%2fgo.microsoft.com%2ffwlink%2f%3FLinkId%3D699488%20%22%7D%2C%7B%22id%22%3A%221%22%2C%22displayName%22%3A%22Learn%20More%22%2C%22uri%22%3A%22https%3A%2f%2fgo.microsoft.com%2ffwlink%2f%3FLinkId%3D523761%22%7D%2C%7B%22id%22%3A%222%22%2C%22displayName%22%3A%22Documentation%22%2C%22uri%22%3A%22https%3A%2f%2fgo.microsoft.com%2ffwlink%2f%3FLinkID%3D523762%22%7D%5D%2C%22filters%22%3A%5B%5D%2C%22plans%22%3A%5B%7B%22id%22%3A%22AntiMalwareOMS%22%2C%22displayName%22%3A%22Antimalware%20Assessment%22%2C%22summary%22%3A%22View%20status%20of%20antivirus%20and%20antimalware%20scans%20across%20your%20servers.%22%2C%22description%22%3A%22%3Cp%3E%3Cb%3EIf%20you%20add%20the%20Antimalware%20solution%20after%20June%2019%2C%202017%2C%20you%20will%20be%20billed%20per%20node%20regardless%20of%20the%20workspace%20pricing%20tier.%3C%2fb%3E%3C%2fp%3E%3Cp%3EOperations%20Management%20Suite%20Antimalware%20Assessment%20Solution%20helps%20you%20identify%20servers%20that%20are%20infected%20or%20at%20increased%20risk%20of%20infection%20by%20malware.%3C%2fp%3E%3Cp%3EServers%20without%20real-time%20antimalware%20software%20increase%20the%20likelihood%20of%20intrusions%20into%20your%20network.%20Malware%20can%20be%20used%20to%20steal%20or%20compromise%20your%20sensitive%20data.%20With%20simple%20out-of-the-box%20dashboards%2C%20you%20can%20quickly%20assess%20which%20servers%20need%20your%20immediate%20attention.%20You%20can%20use%20our%20guided%20search%20to%20get%20more%20information%20about%20the%20malware%20protection%20status%20of%20your%20servers.%3C%2fp%3E%22%2C%22restrictedAudience%22%3A%7B%7D%2C%22skuId%22%3A%22AntiMalwareOMS%22%2C%22planId%22%3A%22AntiMalwareOMS%22%2C%22legacyPlanId%22%3A%22Microsoft.AntiMalwareOMS%22%2C%22keywords%22%3A%5B%5D%2C%22type%22%3A%22None%22%2C%22leadGeneration%22%3Anull%2C%22testDrive%22%3Anull%2C%22categoryIds%22%3A%5B%22mgmt%22%2C%22businessApplication%22%2C%22msOmsSolutions%22%2C%22msOmsClassicSolutions%22%5D%2C%22conversionPaths%22%3A%5B%5D%2C%22metadata%22%3A%7B%7D%2C%22uiDefinitionUri%22%3A%22https%3A%2f%2fcatalogartifact.azureedge.net%2fpublicartifactsmigration%2fMicrosoft.AntiMalwareOMS.1.0.24%2fUIDefinition.json%22%2C%22artifacts%22%3A%5B%7B%22name%22%3A%22CreateResources%22%2C%22uri%22%3A%22https%3A%2f%2fcatalogartifact.azureedge.net%2fpublicartifactsmigration%2fMicrosoft.AntiMalwareOMS.1.0.24%2fArtifacts%2fCreateResources.json%22%2C%22type%22%3A%22Template%22%7D%2C%7B%22name%22%3A%22Details%22%2C%22uri%22%3A%22https%3A%2f%2fcatalogartifact.azureedge.net%2fpublicartifactsmigration%2fMicrosoft.AntiMalwareOMS.1.0.24%2fArtifacts%2fDetails.json%22%2C%22type%22%3A%22Custom%22%7D%5D%2C%22version%22%3A%221.0.24%22%2C%22itemName%22%3A%22AntiMalwareOMS%22%2C%22isPrivate%22%3Afalse%2C%22isHidden%22%3Afalse%2C%22hasFreeTrials%22%3Afalse%2C%22isByol%22%3Afalse%2C%22isFree%22%3Afalse%2C%22isPayg%22%3Afalse%2C%22isStopSell%22%3Afalse%2C%22cspState%22%3A%22OptIn%22%2C%22isQuantifiable%22%3Afalse%2C%22purchaseDurationDiscounts%22%3A%5B%5D%2C%22upns%22%3A%5B%5D%2C%22hasRI%22%3Afalse%2C%22stackType%22%3A%22ARM%22%7D%5D%2C%22selectedPlanId%22%3A%22AntiMalwareOMS%22%2C%22iconFileUris%22%3A%7B%22large%22%3A%22https%3A%2f%2fcatalogartifact.azureedge.net%2fpublicartifactsmigration%2fMicrosoft.AntiMalwareOMS.1.0.24%2fIcons%2fantimalware_115.png%22%2C%22medium%22%3A%22https%3A%2f%2fcatalogartifact.azureedge.net%2fpublicartifactsmigration%2fMicrosoft.AntiMalwareOMS.1.0.24%2fIcons%2fantimalware_90.png%22%2C%22small%22%3A%22https%3A%2f%2fcatalogartifact.azureedge.net%2fpublicartifactsmigration%2fMicrosoft.AntiMalwareOMS.1.0.24%2fIcons%2fantimalware_40.png%22%2C%22wide%22%3A%22https%3A%2f%2fcatalogartifact.azureedge.net%2fpublicartifactsmigration%2fMicrosoft.AntiMalwareOMS.1.0.24%2fIcons%2fantimalware_255X115.png%22%7D%2C%22itemType%22%3A%22Single%22%2C%22hasNoProducts%22%3Atrue%2C%22hasNoPlans%22%3Afalse%2C%22filledHeartIcon%22%3A%7B%22type%22%3A1%2C%22data%22%3A%22%3Csvg%20viewBox%3D'0%200%2016%2015'%20class%3D'msportalfx-svg-placeholder'%20role%3D'presentation'%20focusable%3D'false'%20xmlns%3Asvg%3D'http%3A%2f%2fwww.w3.org%2f2000%2fsvg'%20xmlns%3Axlink%3D'http%3A%2f%2fwww.w3.org%2f1999%2fxlink'%3E%3Cg%3E%3Ctitle%3E%3C%2ftitle%3E%3Cpath%20d%3D'M14.758%201.242c.276.276.505.578.688.906.188.328.325.669.414%201.024a4.257%204.257%200%200%201-1.103%204.086L8%2014.008l-6.758-6.75a4.269%204.269%200%200%201-.695-.906%204.503%204.503%200%200%201-.414-1.016%204.437%204.437%200%200%201%200-2.164c.094-.354.232-.695.414-1.024A4.302%204.302%200%200%201%202.625.32C3.141.107%203.682%200%204.25%200s1.109.107%201.625.32c.516.214.977.521%201.383.922l.742.75.742-.75A4.292%204.292%200%200%201%2010.125.32C10.641.107%2011.182%200%2011.75%200s1.109.107%201.625.32c.516.214.977.521%201.383.922z'%20class%3D'msportalfx-svg-c19'%2f%3E%3C%2fg%3E%3C%2fsvg%3E%22%7D%2C%22emptyHeartIcon%22%3A%7B%22type%22%3A1%2C%22data%22%3A%22%3Csvg%20viewBox%3D'0%200%2016%2015'%20class%3D'msportalfx-svg-placeholder'%20role%3D'presentation'%20focusable%3D'false'%20xmlns%3Asvg%3D'http%3A%2f%2fwww.w3.org%2f2000%2fsvg'%20xmlns%3Axlink%3D'http%3A%2f%2fwww.w3.org%2f1999%2fxlink'%3E%3Cg%3E%3Ctitle%3E%3C%2ftitle%3E%3Cpath%20d%3D'M11.75%200c.588%200%201.14.112%201.656.336.516.224.966.529%201.352.914.385.38.687.83.906%201.352.224.515.336%201.065.336%201.648%200%20.568-.11%201.112-.328%201.633-.214.52-.518.979-.914%201.375L8%2014.008l-6.758-6.75A4.256%204.256%200%200%201%20.32%205.883%204.263%204.263%200%200%201%200%204.25a4.177%204.177%200%200%201%201.242-3c.386-.385.836-.69%201.352-.914A4.113%204.113%200%200%201%204.25%200c.432%200%20.818.05%201.156.148.339.1.651.237.938.415.291.171.567.38.828.625.266.244.542.513.828.804.286-.291.56-.56.82-.805.266-.244.542-.453.828-.625.292-.177.607-.315.946-.414A4.126%204.126%200%200%201%2011.75%200zm2.297%206.547c.307-.307.541-.659.703-1.055.162-.396.242-.81.242-1.242a3.19%203.19%200%200%200-.25-1.266%203.048%203.048%200%200%200-.695-1.023%203.095%203.095%200%200%200-1.031-.68%203.192%203.192%200%200%200-1.266-.25c-.438%200-.825.07-1.164.211a3.816%203.816%200%200%200-.938.54%207.001%207.001%200%200%200-.828.765c-.26.281-.534.568-.82.86a31.352%2031.352%200%200%201-.82-.852%207.247%207.247%200%200%200-.836-.774%204.017%204.017%200%200%200-.946-.562A2.875%202.875%200%200%200%204.25%201c-.448%200-.87.086-1.266.258A3.222%203.222%200%200%200%201%204.25c0%20.432.08.846.242%201.242.167.396.404.748.711%201.055L8%2012.594l6.047-6.047z'%20class%3D'msportalfx-svg-c19%20msportalfx-svg-c19'%2f%3E%3C%2fg%3E%3C%2fsvg%3E%22%7D%2C%22deleteIcon%22%3A%7B%22type%22%3A17%2C%22options%22%3Anull%7D%2C%22searchId%22%3A%221649337027910_marketplaceOffersBladeSearchContext%22%2C%22searchIndex%22%3A0%2C%22privateBadgeText%22%3Anull%2C%22curationCategoryDisplayName%22%3A%22%22%2C%22menuItemId%22%3A%22home%22%2C%22subMenuItemId%22%3A%22Search%20results%22%2C%22createBladeType%22%3A1%2C%22offerType%22%3A%22None%22%2C%22useEnterpriseContract%22%3Afalse%2C%22hasStandardContractAmendments%22%3Afalse%2C%22standardContractAmendmentsRevisionId%22%3A%2200000000-0000-0000-0000-000000000000%22%2C%22supportUri%22%3Anull%2C%22galleryItemAccess%22%3A0%2C%22privateSubscriptions%22%3A%5B%5D%2C%22isTenantPrivate%22%3Afalse%2C%22hasRIPlans%22%3Afalse%7D/selectionMode//resourceGroupId//resourceGroupLocation//dontDiscardJourney//selectedMenuId/home/launchingContext/%7B%22galleryItemId%22%3A%22Microsoft.AntiMalwareOMS%22%2C%22source%22%3A%5B%22GalleryFeaturedMenuItemPart%22%2C%22VirtualizedTileDetails%22%5D%2C%22menuItemId%22%3A%22home%22%2C%22subMenuItemId%22%3A%22Search%20results%22%7D) and its complete functionality is embedded into the 'security' solution. If you have enabled a workspace, and Antimalware Assessment installed as well, you will be charged for both.
>
> There is no practical reason to have both solutions deployed. We recommend customers to remove Antimalware Assessment and replace it with Defender for Cloud's Servers plan. The price is the same ($15 per VM) and Defender for Cloud's Servers plan offers additional protections and features than the Antimalware Assessment solution.

### If a Log Analytics agent reports to multiple workspaces, is the 500 MB free data ingestion available on all of them?

Yes. If you've configured your Log Analytics agent to send data to two or more different Log Analytics workspaces (multi-homing), you'll get 500 MB free data ingestion. It's calculated per node, per reported workspace, per day, and available for every workspace that has a 'Security' or 'AntiMalware' solution installed. You'll be charged for any data ingested over the 500 MB limit.

### Is the 500 MB free data ingestion calculated for an entire workspace or strictly per machine?

You'll get 500 MB free data ingestion per day, for every VM connected to the workspace. Specifically for the [security data types](#what-data-types-are-included-in-the-500-mb-data-daily-allowance) that are directly collected by Defender for Cloud. 

This data is a daily rate averaged across all nodes. Your total daily free limit is equal to **[number of machines] x 500 MB**. So even if some machines send 100-MB and others send 800-MB, if the total doesn't exceed your total daily free limit, you won't be charged extra.

### What data types are included in the 500 MB data daily allowance?
Defender for Cloud's billing is closely tied to the billing for Log Analytics. [Microsoft Defender for Servers](defender-for-servers-introduction.md) provides a 500 MB/node/day allocation for machines against the following subset of [security data types](/azure/azure-monitor/reference/tables/tables-category#security):

- [SecurityAlert](/azure/azure-monitor/reference/tables/securityalert)
- [SecurityBaseline](/azure/azure-monitor/reference/tables/securitybaseline)
- [SecurityBaselineSummary](/azure/azure-monitor/reference/tables/securitybaselinesummary)
- [SecurityDetection](/azure/azure-monitor/reference/tables/securitydetection)
- [SecurityEvent](/azure/azure-monitor/reference/tables/securityevent)
- [WindowsFirewall](/azure/azure-monitor/reference/tables/windowsfirewall)
- [MaliciousIPCommunication](/azure/azure-monitor/reference/tables/maliciousipcommunication)
- [SysmonEvent](/azure/azure-monitor/reference/tables/sysmonevent)
- [ProtectionStatus](/azure/azure-monitor/reference/tables/protectionstatus)
- [Update](/azure/azure-monitor/reference/tables/update) and [UpdateSummary](/azure/azure-monitor/reference/tables/updatesummary) when the Update Management solution isn't running in the workspace or solution targeting is enabled.

If the workspace is in the legacy Per Node pricing tier, the Defender for Cloud and Log Analytics allocations are combined and applied jointly to all billable ingested data.

## How can I monitor my daily usage

You can view your data usage in two different ways, the Azure portal, or by running a script.

**To view your usage in the Azure portal**:

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Navigate to **Log Analytics workspaces**.

1. Select your workspace.

1. Select **Usage and estimated costs**.

    :::image type="content" source="media/enhanced-security-features-overview/data-usage.png" alt-text="Screenshot of your data usage of your log analytics workspace. " lightbox="media/enhanced-security-features-overview/data-usage.png":::

You can also view estimated costs under different pricing tiers by selecting :::image type="icon" source="media/enhanced-security-features-overview/drop-down-icon.png" border="false"::: for each pricing tier.

:::image type="content" source="media/enhanced-security-features-overview/estimated-costs.png" alt-text="Screenshot showing how to view estimated costs under additional pricing tiers." lightbox="media/enhanced-security-features-overview/estimated-costs.png":::

**To view your usage by using a script**:

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Navigate to **Log Analytics workspaces** > **Logs**.

1. Select your time range. Learn about [time ranges](../azure-monitor/logs/log-analytics-tutorial.md).

1. Copy and past the following query into the **Type your query here** section.

    ```azurecli
    let Unit= 'GB';
    Usage
    | where IsBillable == 'TRUE'
    | where DataType in ('SecurityAlert', 'SecurityBaseline', 'SecurityBaselineSummary', 'SecurityDetection', 'SecurityEvent', 'WindowsFirewall', 'MaliciousIPCommunication', 'SysmonEvent', 'ProtectionStatus', 'Update', 'UpdateSummary')
    | project TimeGenerated, DataType, Solution, Quantity, QuantityUnit
    | summarize DataConsumedPerDataType = sum(Quantity)/1024 by  DataType, DataUnit = Unit
    | sort by DataConsumedPerDataType desc
    ```

1. Select **Run**.

    :::image type="content" source="media/enhanced-security-features-overview/select-run.png" alt-text="Screenshot showing where to enter your query and where the select run button is located." lightbox="media/enhanced-security-features-overview/select-run.png":::

You can learn how to [Analyze usage in Log Analytics workspace](../azure-monitor/logs/analyze-usage.md).

Based on your usage, you won't be billed until you've used your daily allowance. If you're receiving a bill, it's only for the data used after the 500mb has been consumed, or for other service that does not fall under the coverage of Defender for Cloud.

## Next steps
This article explained Defender for Cloud's pricing options. For related material, see:

- [How to optimize your Azure workload costs](https://azure.microsoft.com/blog/how-to-optimize-your-azure-workload-costs/)
- [Pricing details according to currency or region](https://azure.microsoft.com/pricing/details/defender-for-cloud/)
- You may want to manage your costs and limit the amount of data collected for a solution by limiting it to a particular set of agents. Use [solution targeting](../azure-monitor/insights/solution-targeting.md) to apply a scope to the solution and target a subset of computers in the workspace. If you're using solution targeting, Defender for Cloud lists the workspace as not having a solution.
> [!IMPORTANT]
> Solution targeting has been deprecated because the Log Analytics agent is being replaced with the Azure Monitor agent and solutions in Azure Monitor are being replaced with insights. You can continue to use solution targeting if you already have it configured, but it is not available in new regions.
> The feature will not be supported after August 31, 2024.
> Regions that support solution targeting until the deprecation date are:
> 
> | Region code | Region name |
> | :--- | :---------- |
> | CCAN | canadacentral |
> | CHN | switzerlandnorth |
> | CID | centralindia |
> | CQ | brazilsouth |
> | CUS | centralus |
> | DEWC | germanywestcentral |
> | DXB | UAENorth |
> | EA | eastasia |
> | EAU | australiaeast |
> | EJP | japaneast |
> | EUS | eastus |
> | EUS2 | eastus2 |
> | NCUS | northcentralus |
> | NEU | NorthEurope |
> | NOE | norwayeast |
> | PAR | FranceCentral |
> | SCUS | southcentralus |
> | SE | KoreaCentral |
> | SEA | southeastasia |
> | SEAU | australiasoutheast |
> | SUK | uksouth |
> | WCUS | westcentralus |
> | WEU | westeurope |
> | WUS | westus |
> | WUS2 | westus2 |
>
> | Air-gapped clouds | Region code | Region name |
> | :---- | :---- | :---- |
> | UsNat | EXE | usnateast | 
> | UsNat | EXW | usnatwest | 
> | UsGov | FF | usgovvirginia | 
> | China | MC | ChinaEast2 | 
> | UsGov | PHX | usgovarizona | 
> | UsSec | RXE | usseceast | 
> | UsSec | RXW | ussecwest | 
