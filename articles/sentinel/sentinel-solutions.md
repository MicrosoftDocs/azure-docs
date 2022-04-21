---
title: About Microsoft Sentinel content and solutions | Microsoft Docs
description: This article describes Microsoft Sentinel content and solutions, which customers can use to find data analysis tools packaged together with data connectors.
author: batamig
ms.topic: conceptual
ms.date: 11/09/2021
ms.author: bagol
ms.custom: ignite-fall-2021
---

# About Microsoft Sentinel content and solutions

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

> [!IMPORTANT]
>
> The Microsoft Sentinel **Content hub** and solutions are currently in **PREVIEW**, as are all individual solution packages. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Microsoft Sentinel *content* is Security Information and Event Management (SIEM) content that enables customers to ingest data, monitor, alert, hunt, investigate, respond, and connect with different products, platforms, and services in Microsoft Sentinel.

Content in Microsoft Sentinel includes any of the following types:

- **[Data connectors](connect-data-sources.md)** provide log ingestion from different sources into Microsoft Sentinel
- **[Parsers](normalization-about-parsers.md)** provide log formatting/transformation into [ASIM](normalization.md) formats, supporting usage across various Microsoft Sentinel content types and scenarios
- **[Workbooks](get-visibility.md)** provide monitoring, visualization, and interactivity with data in Microsoft Sentinel, highlighting meaningful insights for users
- **[Analytics rules](detect-threats-built-in.md)** provide alerts that point to relevant SOC actions via incidents
- **[Hunting queries](hunting.md)** are used by SOC teams to proactively hunt for threats in Microsoft Sentinel
- **[Notebooks](notebooks.md)** help SOC teams use advanced hunting features in Jupyter and Azure Notebooks
- **[Watchlists](watchlists.md)** support the ingestion of *specific* data for enhanced threat detection and reduced alert fatigue
- **[Playbooks and Azure Logic Apps custom connectors](automate-responses-with-playbooks.md)** provide features for automated investigations, remediations, and response scenarios in Microsoft Sentinel

Microsoft Sentinel *solutions* are packages of Microsoft Sentinel content or Microsoft Sentinel API integrations, which fulfill an end-to-end product, domain, or industry vertical scenario in Microsoft Sentinel.

> [!TIP]
> You can either customize out-of-the-box content for your own needs, or you can create your own solution with content to share with others in the community. For more information, see the [Microsoft Sentinel Solutions Build Guide](https://aka.ms/sentinelsolutionsbuildguide) for solutions’ authoring and publishing.
>
## Discover and manage Microsoft Sentinel content

Use the Microsoft Sentinel **Content hub** to centrally discover and install out-of-the-box (built-in) content.

The Microsoft Sentinel Content Hub provides in-product discoverability, single-step deployment, and enablement of end-to-end product, domain, and/or vertical out-of-the-box solutions and content in Microsoft Sentinel.

- In the **Content hub**, filter by [categories](#microsoft-sentinel-out-of-the-box-content-and-solution-categories) and other parameters, or use the powerful text search, to find the content that works best for your organization's needs. The **Content hub** also indicates the [support model](#microsoft-sentinel-out-of-the-box-content-and-solution-support-models) applied to each piece of content, as some content is maintained by Microsoft and others are maintained by partners or the community.

    Manage [updates for out-of-the-box content](sentinel-solutions-deploy.md#install-or-update-a-solution) via the Microsoft Sentinel **Content hub**, and for custom content via the **Repositories** page.

- Customize out-of-the-box content for your own needs, or create custom content, including analytics rules, hunting queries, notebooks, workbooks, and more. Manage your custom content directly in your Microsoft Sentinel workspace, via the [Microsoft Sentinel API](/rest/api/securityinsights/), or in your own source control repository, via the Microsoft Sentinel [Repositories](ci-cd.md) page.

### Why content hub and solutions?

Microsoft Sentinel *solutions* are packaged content or integrations that deliver end-to-end product value for one or more domain or vertical scenarios.

The solutions experience is powered by [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace) for solutions’ discoverability and deployment. For more information, see the [Microsoft Sentinel Solutions Build Guide](https://aka.ms/sentinelsolutionsbuildguide) for solutions authoring and publishing.

Microsoft Sentinel solutions provide in-product discoverability, single-step deployment, and enablement of end-to-end product, domain, and/or vertical scenarios in Microsoft Sentinel. This experience is powered by  for solutions’ discoverability, deployment, and enablement, and by  for solutions’ authoring and publishing.

- **Packaged content** are collections of one or more pieces of Microsoft Sentinel content, such as data connectors, workbooks, analytics rules, playbooks, hunting queries, watchlists, parsers, and more.

- **Integrations** include services or tools built using Microsoft Sentinel or Azure Log Analytics APIs that support integrations between Azure and existing customer applications, or migrate data, queries, and more, from those applications into Microsoft Sentinel.

You can also use solutions to install packages of out-of-the-box content in a single step, where the content is often ready to use immediately. Providers and partners can use solutions to productize investments by delivering combined product, domain, or vertical value.

Use the Content hub to centrally discover and deploy solutions and out-of-the-box content in a scenario-driven manner.

For more information, see:

- [Centrally discover and deploy Microsoft Sentinel out-of-the-box content and solutions](sentinel-solutions-deploy.md)
- [Microsoft Sentinel Content hub catalog](sentinel-solutions-catalog.md)

## Microsoft Sentinel out-of-the-box content and solution categories

Microsoft Sentinel out-of-the-box content can be applied with one or more of the following categories. In the **Content hub**, select the categories you want to view to change the content displayed.

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
| **Security – 0-day Vulnerability**   | Specialized solutions for zero-day vulnerability attacks like [Nobelium](../security/fundamentals/recover-from-identity-compromise.md) |
| **Security – Automation (SOAR)**   | Security automations, SOAR (Security Operations and Automated Responses), security operations, and incident response products and services.   |
| **Security – Cloud Security** | CASB (Cloud Access Service Broker), CWPP (Cloud workload protection platforms), CSPM (Cloud security posture management and other Cloud Security products and services |
| **Security – Information Protection**   | Information protection and document protection products and services|
| **Security – Insider Threat**  | Insider threat and user and entity behavioral analytics (UEBA) for security products and services                |
| **Security – Network**    | Security network devices, firewall, NDR (network detection and response), NIDP (network intrusion and detection prevention), and network packet capture   |
| **Security – Vulnerability Management** | Vulnerability management products and  services                    |
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


## Microsoft Sentinel out-of-the-box content and solution support models

Both Microsoft and other organizations author Microsoft Sentinel out-of-the-box content and solutions. Each piece of out-of-the-box content or solution has one of the following support types:

| Support model  | Description |
| ---------- | ----------------------- |
| **Microsoft-supported**| Applies to: <br>- Content/solutions where Microsoft is the data provider, where relevant, and author. <br> - Some Microsoft-authored content/solutions for non-Microsoft data sources. <br><br>    Microsoft supports and maintains content/solutions in this support model in accordance with [Microsoft Azure Support Plans](https://azure.microsoft.com/support/options/#overview). <br>Partners or the Community support content/solutions that are authored by any party other than Microsoft.|
|**Partner-supported** | Applies to content/solutions authored by parties other than Microsoft.  <br><br>   The partner company provides support or maintenance for these pieces of content/solutions. The partner company can be an Independent Software Vendor, a Managed Service Provider (MSP/MSSP), a Systems Integrator (SI), or any organization whose contact information is provided on the Microsoft Sentinel page for the selected content/solutions.<br><br>    For any issues with a partner-supported solution, contact the specified support contact.|
|**Community-supported** |Applies to content/solutions authored by Microsoft or partner developers that don't have listed contacts for support and maintenance in Microsoft Sentinel.<br><br>    For questions or issues with these solutions, [file an issue](https://github.com/Azure/Azure-Sentinel/issues/new/choose) in the [Microsoft Sentinel GitHub community](https://aka.ms/threathunters). |


## Next steps

After you've learned about Microsoft Sentinel content, start managing content and solutions in your Microsoft Sentinel workspace.

Discover and install solutions from the Microsoft Sentinel **Content hub**. For more information, see:

- [Centrally discover and deploy out-of-the-box content and solutions (Public preview)](sentinel-solutions-deploy.md)
- [Microsoft Sentinel content hub catalog](sentinel-solutions-catalog.md)
- [Microsoft Sentinel data connectors](connect-data-sources.md)
- [Find your Microsoft Sentinel data connector](data-connectors-reference.md)
