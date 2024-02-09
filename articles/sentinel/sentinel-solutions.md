---
title: About Microsoft Sentinel content and solutions | Microsoft Docs
description: This article describes Microsoft Sentinel content and solutions, which customers can use to find data analysis tools packaged together with data connectors.
author: cwatson-cat
ms.topic: conceptual
ms.date: 06/22/2023
ms.author: cwatson
---

# About Microsoft Sentinel content and solutions

Microsoft Sentinel *content* is Security Information and Event Management (SIEM) solution components that enable customers to ingest data, monitor, alert, hunt, investigate, respond, and connect with different products, platforms, and services.

Content in Microsoft Sentinel includes any of the following types:

- **[Data connectors](connect-data-sources.md)** provide log ingestion from different sources into Microsoft Sentinel
- **[Parsers](normalization-about-parsers.md)** provide log formatting/transformation into [ASIM](normalization.md) formats, supporting usage across various Microsoft Sentinel content types and scenarios
- **[Workbooks](get-visibility.md)** provide monitoring, visualization, and interactivity with data in Microsoft Sentinel, highlighting meaningful insights for users
- **[Analytics rules](detect-threats-built-in.md)** provide alerts that point to relevant SOC actions via incidents
- **[Hunting queries](hunting.md)** are used by SOC teams to proactively hunt for threats in Microsoft Sentinel
- **[Notebooks](notebooks.md)** help SOC teams use advanced hunting features in Jupyter and Azure Notebooks
- **[Watchlists](watchlists.md)** support the ingestion of *specific* data for enhanced threat detection and reduced alert fatigue
- **[Playbooks and Azure Logic Apps custom connectors](automate-responses-with-playbooks.md)** provide features for automated investigation, remediation, and response scenarios in Microsoft Sentinel

Microsoft Sentinel offers these content types as *solutions* and *standalone* items. *Solutions* are packages of Microsoft Sentinel content or Microsoft Sentinel API integrations, which fulfill an end-to-end product, domain, or industry vertical scenario in Microsoft Sentinel. Both solutions and standalone items are discoverable and managed from the Content hub.

You can either customize out-of-the-box (OOTB) content for your own needs, or you can create your own solution with content to share with others in the community. For more information, see the [Microsoft Sentinel Solutions Build Guide](https://aka.ms/sentinelsolutionsbuildguide) for solutions' authoring and publishing.

## Discover and manage Microsoft Sentinel content

Use the Microsoft Sentinel **Content hub** to centrally discover and install out-of-the-box (OOTB) content.

The Microsoft Sentinel Content hub provides in-product discoverability, single-step deployment, and enablement of end-to-end product, domain, and/or vertical OOTB solutions and content in Microsoft Sentinel.

- In the **Content hub**, filter by [categories](#categories-for-microsoft-sentinel-out-of-the-box-content-and-solutions) and other parameters, or use the powerful text search, to find the content that works best for your organization's needs. The **Content hub** also indicates the [support model](#support-models-for-microsoft-sentinel-out-of-the-box-content-and-solutions) applied to each piece of content, as some content is maintained by Microsoft and others are maintained by partners or the community.

    Manage [updates for out-of-the-box content](sentinel-solutions-deploy.md#install-or-update-content) via the Microsoft Sentinel **Content hub**, and for custom content via the **Repositories** page.

- Customize out-of-the-box content for your own needs, or create custom content, including analytics rules, hunting queries, notebooks, workbooks, and more. Manage your custom content directly in your Microsoft Sentinel workspace, via the [Microsoft Sentinel API](/rest/api/securityinsights/), or in your own source control repository, via the Microsoft Sentinel [Repositories](ci-cd.md) page.

### Why content hub solutions?

Microsoft Sentinel *solutions* are packaged integrations that deliver end-to-end product value for one or more domain or vertical scenarios in the content hub.

The solutions experience, powered by [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace), helps you discover and deploy the content you want. For more information on authoring and publishing solutions in the Azure Marketplace, see the [Microsoft Sentinel Solutions Build Guide](https://aka.ms/sentinelsolutionsbuildguide).

- **Packaged content** are collections of one or more components of Microsoft Sentinel content, such as data connectors, workbooks, analytics rules, playbooks, hunting queries, watchlists, parsers, and more.

- **Integrations** include services or tools built using Microsoft Sentinel or Azure Log Analytics APIs that support integrations between Azure and existing customer applications, or migrate data, queries, and more, from those applications into Microsoft Sentinel.

You can also use solutions to install packages of out-of-the-box (OOTB) content in a single step, where the content is often ready to use immediately. Providers and partners use Sentinel solutions to add value to their customers' investments by delivering combined product, domain, or vertical value.

Use the Content hub to centrally discover and deploy solutions and OOTB content in a scenario-driven manner.

For more information, see:

- [Centrally discover and deploy Microsoft Sentinel out-of-the-box content and solutions](sentinel-solutions-deploy.md)
- Microsoft Sentinel solutions catalog in the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps?filters=solution-templates&page=1&search=sentinel)
- [Microsoft Sentinel catalog](sentinel-solutions-catalog.md)

## Categories for Microsoft Sentinel out-of-the-box content and solutions

Microsoft Sentinel out-of-the-box content can be applied with one or more of the following categories. In the **Content hub**, select the categories you want to view to change the content displayed. You can discover community delivered items centrally in Content hub as standalone content or solutions.

### Domain categories

| Category name  | Description |
| ---------- | ----------------------- |
| **Application**  | Web, server-based, SaaS, database, communications, or productivity workload          |
| **Cloud Provider**  | Cloud service|
| **Compliance**   | Compliance product, services, and protocols  |
| **DevOps**       | Development operations tools and services    |
| **Identity**     | Identity service providers and integrations     |
| **Internet of Things (IoT)**    | IoT, OT devices and infrastructure, industrial control services                   |
| **IT Operations**| Products and services managing IT   |
| **Migration**    | Migration enablement products, services, and               |
| **Networking**   | Network products, services, and tools    |
| **Platform**     | Microsoft Sentinel generic or framework components, Cloud infrastructure, and platform|
| **Security - Others**   | Other security products and services with no other clear category           |
| **Security - Threat Intelligence**  | Threat intelligence platforms, feeds, products, and services        |
| **Security - Threat Protection**   | Threat protection, email protection, and XDR and endpoint protection products and services     |
| **Security - 0-day Vulnerability**   | Specialized solutions for zero-day vulnerability attacks like [Nobelium](../security/fundamentals/recover-from-identity-compromise.md) |
| **Security - Automation (SOAR)**   | Security automations, SOAR (Security Operations and Automated Responses), security operations, and incident response products and services.   |
| **Security - Cloud Security** | CASB (Cloud Access Service Broker), CWPP (Cloud workload protection platforms), CSPM (Cloud security posture management and other Cloud Security products and services |
| **Security - Information Protection**   | Information protection and document protection products and services|
| **Security - Insider Threat**  | Insider threat and user and entity behavioral analytics (UEBA) for security products and services                |
| **Security - Network**    | Security network devices, firewall, NDR (network detection and response), NIDP (network intrusion and detection prevention), and network packet capture   |
| **Security - Vulnerability Management** | Vulnerability management products and  services                    |
| **Storage**      | File stores and file sharing products and services                 |
| **Training and Tutorials**  | Training, tutorials, and onboarding assets |
| **User Behavior (UEBA)**    | User behavior analytics products and services|


### Industry vertical categories

| Category name  | Description |
| ---------- | ----------------------- |
| **Aeronautics**  | Products, services, and content specific for the aeronautics industry |
| **Education**    | Products, services, and content specific for the education industry   |
| **Finance**      | Products, services, and content specific for the finance industry     |
| **Healthcare**   | Products, services, and content specific for the healthcare industry  |
| **Manufacturing** | Products, services, and content specific for the manufacturing industry |
| **Retail**       | Products, services, and content specific for the retail industry       |


## Support models for Microsoft Sentinel out-of-the-box content and solutions

Both Microsoft and other organizations author Microsoft Sentinel out-of-the-box content and solutions. Each piece of out-of-the-box content or solution has one of the following support types:

| Support model  | Description |
| ---------- | ----------------------- |
| **Microsoft-supported**| Applies to: <br>- Content/solutions where Microsoft is the data provider, where relevant, and author. <br> - Some Microsoft-authored content/solutions for non-Microsoft data sources. <br><br>    Microsoft supports and maintains content/solutions in this support model in accordance with [Microsoft Azure Support Plans](https://azure.microsoft.com/support/options/#overview). <br>Partners or the Community support content/solutions that are authored by any party other than Microsoft.|
|**Partner-supported** | Applies to content/solutions authored by parties other than Microsoft.  <br><br>   The partner company provides support or maintenance for these pieces of content/solutions. The partner company can be an Independent Software Vendor, a Managed Service Provider (MSP/MSSP), a Systems Integrator (SI), or any organization whose contact information is provided on the Microsoft Sentinel page for the selected content/solutions.<br><br>    For any issues with a partner-supported solution, contact the specified support contact.|
|**Community-supported** |Applies to content/solutions authored by Microsoft or partner developers that don't have listed contacts for support and maintenance in Microsoft Sentinel.<br><br>    For questions or issues with these solutions, [file an issue](https://github.com/Azure/Azure-Sentinel/issues/new/choose) in the [Microsoft Sentinel GitHub community](https://aka.ms/threathunters). |

## Content sources for Microsoft Sentinel content and solutions

Each piece of content or solution has one of the following content sources:

|Content source  |Description  |
|---------|---------|
|**Content hub**   |Solutions deployed by the Content hub that support lifecycle management         |
|**Standalone** |Standalone content deployed by the Content hub that is automatically kept up-to-date |
|**Custom**  |Content or solutions you've customized in your workspace         |
|**Gallery content**     |Content from the feature galleries that don't support lifecycle management. This content source is retiring soon. For more information see [OOTB content centralization changes](sentinel-content-centralize.md).     |
|**Repositories**   |Content or solutions from a repository connected to your workspace      |

## Next steps

After you've learned about Microsoft Sentinel content, discover and install solutions and standalone content from the **Content hub** in your Microsoft Sentinel workspace.

For more information, see:

- [Centrally discover and deploy out-of-the-box content and solutions](sentinel-solutions-deploy.md)
- Microsoft Sentinel solutions catalog in the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps?filters=solution-templates&page=1&search=sentinel)
- [Microsoft Sentinel catalog](sentinel-solutions-catalog.md)
- [Microsoft Sentinel data connectors](connect-data-sources.md)
- [Find your Microsoft Sentinel data connector](data-connectors-reference.md)
