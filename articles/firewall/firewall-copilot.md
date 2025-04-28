---
title: Azure Firewall integration in Microsoft Security Copilot
description: Learn about using Microsoft Security Copilot to investigate traffic flagged by Azure Firewall with Intrusion Detection and Prevention System (IDPS).
keywords: security copilot, copilot for security, threat intelligence, IDPS, intrusion detection and prevention system, plugin, integration, azure firewall, firewall copilot, open ai, openai, co-pilot
author: abhinavsriram
ms.author: asriram
ms.date: 04/25/2025
ms.topic: concept-article
ms.service: azure-firewall
ms.localizationpriority: high
ms.custom:
  - ignite-2024
ms.collection: Tier1, ce-skilling-ai-copilot
---

# Azure Firewall integration in Microsoft Security Copilot

Security Copilot is a generative AI-powered security solution that helps increase the efficiency and capabilities of security personnel to improve security outcomes at machine speed and scale. It provides a natural language, assistive copilot experience helping support security professionals in end-to-end scenarios such as incident response, threat hunting, intelligence gathering, and posture management. For more information about what it can do, see [What is Microsoft Security Copilot?](/copilot/security/microsoft-security-copilot)

## Know before you begin

If you're new to Security Copilot, you should familiarize yourself with it by reading these articles:
- [What is Microsoft Security Copilot?](/security-copilot/microsoft-security-copilot)
- [Microsoft Security Copilot experiences](/security-copilot/experiences-security-copilot)
- [Get started with Microsoft Security Copilot](/security-copilot/get-started-security-copilot)
- [Understand authentication in Microsoft Security Copilot](/security-copilot/authentication)
- [Prompting in Microsoft Security Copilot](/security-copilot/prompting-security-copilot)

## Security Copilot integration in Azure Firewall

Azure Firewall is a cloud-native and intelligent network firewall security service that provides best of breed threat protection for your cloud workloads running in Azure. It's a fully stateful firewall as a service with built-in high availability and unrestricted cloud scalability.

The Azure Firewall integration in Security Copilot helps analysts perform detailed investigations of the malicious traffic intercepted by the IDPS feature of their firewalls across their entire fleet using natural language questions.

You can use this integration in two different experience:

- [Security Copilot portal](https://securitycopilot.microsoft.com) (standalone experience)

    :::image type="content" source="media/firewall-copilot/security-copilot-overview.png" alt-text="Screenshot of the Security Copilot portal with a prompt relevant to Firewall." lightbox="media/firewall-copilot/security-copilot-overview.png":::

- [Copilot in Azure](/azure/copilot/overview) (embedded experience) in the Azure portal:

    :::image type="content" source="media/firewall-copilot/azure-copilot-overview-image.png" alt-text="Screenshot of the Azure portal with a prompt relevant to Firewall." lightbox="media/firewall-copilot/azure-copilot-overview-image.png"::: 

For more information, see  [Microsoft Security Copilot experiences](/security-copilot/experiences-security-copilot) and [Microsoft Copilot in Azure capabilities](/azure/copilot/capabilities).

## Key features

Security Copilot has built-in system features that can get data from the different plugins that are turned on.

To view the list of built-in system capabilities for Azure Firewall, use the following procedure on the Security Copilot portal:

1.	In the prompt bar, select the **Prompts** icon.

2.	Select **See all system capabilities**. 

3. The **Azure Firewall** section lists all the available capabilities that you can use.

## Enable the Azure Firewall integration in Security Copilot

1.  Ensure your Azure Firewall is configured correctly:
 
    - [Azure Firewall Structured Logs](firewall-structured-logs.md#resource-specific-mode) – the Azure Firewalls to be used with Security Copilot must be configured with resource specific structured logs for IDPS and these logs must be sent to a Log Analytics workspace.
    
    - [Role Based Access Control for Azure Firewall](https://techcommunity.microsoft.com/t5/azure-network-security-blog/role-based-access-control-for-azure-firewall/ba-p/2245598) – the users using the Azure Firewall plugin in Security Copilot must have the appropriate Azure Role-based access control roles to access the Firewall and associated Log Analytics workspaces.
    
1.	Go to [Security Copilot](https://go.microsoft.com/fwlink/?linkid=2247989) and sign in with your credentials.

1.	Ensure that the Azure Firewall plugin is turned on. In the prompt bar, select the **Sources** icon. In the **Manage sources** pop-up window that appears, confirm that the **Azure Firewall** toggle is turned on. Then, close the window. No other configuration is necessary. As long as structured logs are being sent to a Log Analytics workspace and you have the right Role-based access control permissions, Copilot finds the data it needs to answer your questions.

    :::image type="content" source="media/firewall-copilot/azure-firewall-plugin.png" alt-text="Screenshot showing the Azure Firewall plugin.":::    

1. Enter your prompt in the prompt bar on either the [Security Copilot portal](https://securitycopilot.microsoft.com) or via the [Copilot in Azure](/azure/copilot/overview) experience in the Azure portal.

    > [!IMPORTANT]
    > Use of Copilot in Azure to query Azure Firewall is included with Security Copilot and requires [security compute units (SCUs)](/security-copilot/get-started-security-copilot#security-compute-units). You can deploy SCUs and increase or decrease them at any time. For more information on SCUs, see [Get started with Microsoft Security Copilot](/security-copilot/get-started-security-copilot).
    > If you don't have Security Copilot properly configured but ask a question relevant to the Azure Firewall capabilities through the Copilot in Azure experience then you'll see an error message.
   
## Sample Azure Firewall prompts

There are many prompts you can use to get information from Azure Firewall. This section lists the ones that work best today. They're continuously updated as new capabilities are launched.

### Retrieve the top IDPS signature hits for a given Azure Firewall

Get **log information** about the traffic intercepted by the IDPS feature instead of constructing KQL queries manually.

:::image type="content" source="media/firewall-copilot/idps-prompts.png" alt-text="Screenshot displaying the capability to retrieve the top IDPS signature hits for an Azure Firewall." lightbox="media/firewall-copilot/idps-prompts-expanded.png":::

**Sample prompts**:

- Has there been any malicious traffic intercepted by my Firewall `<Firewall name>`?
- What are the top 20 IDPS hits from the last seven days for Firewall `<Firewall name>` in resource group `<resource group name>`?
- Show me in tabular form the top 50 attacks that targeted Firewall `<Firewall name>` in subscription `<subscription name>` in the past month.

### Enrich the threat profile of an IDPS signature beyond log information

Get **additional details** to enrich the threat information/profile of an IDPS signature instead of compiling it yourself manually.

:::image type="content" source="media/firewall-copilot/threat-profile.png" alt-text="Screenshot showing the capability to enrich the threat profile of an IDPS signature beyond log information." lightbox="media/firewall-copilot/threat-profile-expanded.png":::

**Sample prompts**:

- Explain why IDPS flagged the top hit as high severity and the fifth hit as low severity.
- What can you tell me about this attack? What are the other attacks this attacker is known for?
- I see that the third signature ID is associated with CVE `<CVE number\>`, tell me more about this CVE.

    > [!NOTE]
    > The Microsoft Threat Intelligence plugin is another source that Security Copilot might use to provide threat intelligence for IDPS signatures.

### Look for a given IDPS signature across your tenant, subscriptions, or resource groups

Perform a **fleet-wide search** (over any scope) for a threat across all your Firewalls instead of searching for the threat manually.

:::image type="content" source="media/firewall-copilot/search-tenant-subscription.png" alt-text="Screenshot showing the capability to search for a given IDPS signature across your tenant, subscriptions, or resource groups." lightbox="media/firewall-copilot/search-tenant-subscription-expanded.png":::

**Sample prompts**:

- Was signature ID `<ID number\>` only stopped by this one Firewall? What about others across this entire tenant?
- Was the top hit seen by any other Firewall in the subscription `<subscription name>`?
- Over the past week did any Firewall in resource group `<resource group name\>` see signature ID `<ID number>`?

### Generate recommendations to secure your environment using Azure Firewall's IDPS feature

Get **information from documentation** about using Azure Firewall's IDPS feature to secure your environment instead of having to look up this information manually.

:::image type="content" source="media/firewall-copilot/recommendations.png" alt-text="Screenshot showing the generated recommendations to secure your environment using Azure Firewall's IDPS feature capability." lightbox="media/firewall-copilot/recommendations-expanded.png":::

**Sample prompts**:

- How do I protect myself from future attacks from this attacker across my entire infrastructure?
- If I want to make sure all my Azure Firewalls are protected against attacks from signature ID `<ID number\>`, how do I accomplish this?
- What is the difference in risk between alert only and alert and block modes for IDPS?

    > [!NOTE]
    > Security Copilot may also use the _Ask Microsoft Documentation_ capability to provide this information and when using this capability via the Copilot in Azure experience, the _Get Information_ capability may be used to provide this information.

## Provide feedback

Your feedback is vital to guide the current and planned development of the product. The best way to provide this feedback is directly in the product. 

### Through Security Copilot

Select **How’s this response?** at the bottom of each completed prompt and choose any of the following options:

- **Looks right** - Select if the results are accurate, based on your assessment. 
- **Needs improvement** - Select if any detail in the results is incorrect or incomplete, based on your assessment. 
- **Inappropriate** - Select if the results contain questionable, ambiguous, or potentially harmful information.

For each feedback option, you can provide additional information in the subsequent dialog box. Whenever possible, and especially when the result is **Needs improvement**, write a few words explaining how the outcome can be improved. If you entered prompts specific to Azure Firewall and the results aren't related, include that information.

### Through Copilot in Azure

Use the **like** and **dislike** buttons at the bottom of each completed prompt. For either feedback option, you can provide additional information in the subsequent dialog box. Whenever possible, and especially when you dislike a response, write a few words explaining how the outcome can be improved. If you entered prompts specific to Azure Firewall and the results aren't related, include that information.

## Privacy and data security in Security Copilot

When you interact with Security Copilot either through the Security Copilot portal or the Copilot in Azure experience to get information, Copilot pulls that data from Azure Firewall. The prompts, the data retrieved, and the output shown in the prompt results are processed and stored within the Copilot service. For more information, see [Privacy and data security in Microsoft Security Copilot](/copilot/security/privacy-data-security).

## Related content

- [What is Microsoft Security Copilot?](/security-copilot/microsoft-security-copilot)
- [Microsoft Security Copilot experiences](/security-copilot/experiences-security-copilot)
- [Get started with Microsoft Security Copilot](/security-copilot/get-started-security-copilot)
- [What is Microsoft Copilot in Azure?](/azure/copilot/overview)
- [Microsoft Copilot in Azure Capabilities](/azure/copilot/capabilities)
