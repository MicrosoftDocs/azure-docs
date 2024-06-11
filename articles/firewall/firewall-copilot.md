---
title: Azure Firewall integration in Microsoft Copilot for Security (preview)
description: Learn about using Microsoft Copilot for Security to investigate traffic flagged by Azure Firewall with IDPS and threat intelligence.
keywords: security copilot, copilot for security, threat intelligence, IDPS, intrusion detection and prevention system, plugin, integration, azure firewall, firewall copilot, open ai, openai co-pilot
author: abhinavsriram
ms.author: victorh
ms.date: 05/20/2024
ms.topic: conceptual
ms.service: firewall
ms.localizationpriority: high
ms.collection: Tier1
---

# Azure Firewall integration in Microsoft Copilot for Security (preview)

> [!IMPORTANT]
> Azure Firewall integration in Microsoft Copilot for Security is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.


Microsoft Copilot for Security is a generative AI-powered security solution that helps increase the efficiency and capabilities of security personnel to improve security outcomes at machine speed and scale. It provides a natural language, assistive copilot experience helping support security professionals in end-to-end scenarios such as incident response, threat hunting, intelligence gathering, and posture management. For more information about what it can do, see [What is Microsoft Copilot for Security?](/copilot/security/microsoft-security-copilot)

## Copilot for Security integrates with Azure Firewall

Azure Firewall is a cloud-native and intelligent network firewall security service that provides best of breed threat protection for your cloud workloads running in Azure. It's a fully stateful firewall as a service with built-in high availability and unrestricted cloud scalability.

The Azure Firewall integration helps analysts perform detailed investigations of the malicious traffic intercepted by the IDPS and/or threat intelligence features of their firewalls across their entire fleet using natural language questions in the Copilot for Security standalone experience.

This article introduces you to Copilot and includes sample prompts that can help Azure Firewall users.

## Know before you begin

- You can use the Azure Firewall integration in Copilot for Security in the [Copilot for Security portal](https://securitycopilot.microsoft.com). For more information, see  [Microsoft Copilot for Security experiences](/copilot/security/experiences-security-copilot).
- Be clear and specific with your prompts. You might get better results if you include specific time frames, resources, and threats in your prompts. It might also help if you add **Azure Firewall** to your prompt.

- Use the example prompts in this article to help guide your interactions with Copilot.  
- Experiment with different prompts and variations to see what works best for your use case. Chat AI models vary, so iterate and refine your prompts based on the results you receive.
- Copilot for Security saves your prompt sessions. To see the previous sessions, from the Copilot [Home menu](/copilot/security/navigating-security-copilot#home-menu), go to **My sessions**.

   :::image type="content" source="media/firewall-copilot/copilot-my-sessions.png" alt-text="Partial screenshot of the Microsoft Copilot for Security Home menu with My sessions highlighted.":::
    
   > [!NOTE]
   > For a Copilot walkthrough, including the pin and share feature, see [Navigate Microsoft Copilot for Security](/copilot/security/navigating-security-copilot).

 
For more information about writing effective Copilot for Security prompts, see [Create effective prompts](/copilot/security/prompting-tips).

## Using the Azure Firewall integration in the Copilot for Security standalone portal

1.  Ensure your Azure Firewall is configured correctly:
    - [Azure Structured Firewall Logs](firewall-structured-logs.md#resource-specific-mode) – the Azure Firewalls to be used with Copilot for Security must be configured with resource specific structured logs for IDPS and these logs must be sent to a Log Analytics workspace.
    - [Role Based Access Control for Azure Firewall](https://techcommunity.microsoft.com/t5/azure-network-security-blog/role-based-access-control-for-azure-firewall/ba-p/2245598) – the users using the Azure Firewall plugin in Copilot for Security must have the appropriate Azure RBAC roles to access the Firewall and associated Log Analytics workspace(s).
2.	Go to [Microsoft Copilot for Security](https://go.microsoft.com/fwlink/?linkid=2247989) and sign in with your credentials.
3.	Ensure that the Azure Firewall plugin is turned on. In the prompt bar, select the **Sources** icon.

    :::image type="content" source="media/firewall-copilot/copilot-prompts-bar-sources.png" alt-text="Screenshot of the prompt bar in Microsoft Copilot for Security with the Sources icon highlighted.":::

  
    In the **Manage sources** pop-up window that appears, confirm that the **Azure Firewall** toggle is turned on, then close the window.

    :::image type="content" source="media/firewall-copilot/azure-firewall-plugin.png" alt-text="Screenshot showing the Azure Firewall plugin.":::    

    > [!NOTE]
    > Some roles can turn the toggle on or off for plugins like Azure Firewall. For more information, see [Manage plugins in Microsoft Copilot for Security](/copilot/security/manage-plugins?tabs=securitycopilotplugin).


4. Enter your prompt in the prompt bar.

## Built-in system features

Copilot for Security has built-in system features that can get data from the different plugins that are turned on.

To view the list of built-in system capabilities for Azure Firewall, use the following procedure:

1.	In the prompt bar, select the **Prompts** icon.

    :::image type="content" source="media/firewall-copilot/copilot-prompts-bar-prompts.png" alt-text="Screenshot of the prompt bar in Microsoft Copilot for Security with the Prompts icon highlighted.":::

2.	Select **See all system capabilities**. The **Azure Firewall** section lists all the available capabilities that you can use.

## Sample prompts for Azure Firewall

There are many prompts you can use to get information from Azure Firewall. This section lists the ones that work best today. They're continuously updated as new capabilities are launched.


### Retrieve the top IDPS signature hits for an Azure Firewall

Get **log information** about the traffic intercepted by the IDPS feature instead of constructing KQL queries manually.

**Sample prompts**:

- Has there been any malicious traffic intercepted by my Firewall _\<Firewall name\>_?
- What are the top 20 IDPS hits from the last seven days for Firewall _\<Firewall name\>_ in resource group _\<resource group name\>_?
- Show me in tabular form the top 50 attacks that targeted Firewall _\<Firewall name\>_ in subscription _\<subscription name\>_ in the past month.


### Enrich the threat profile of an IDPS signature beyond log information

Get **additional details** to enrich the threat information/profile of an IDPS signature instead of compiling it yourself manually.

**Sample prompts**:

- Explain why IDPS flagged the top hit as high severity and the fifth hit as low severity.
- What can you tell me about this attack? What are the other attacks this attacker is known for?
- I see that the third signature ID is associated with CVE _\<CVE number\>_, tell me more about this CVE.

> [!NOTE]
>The Microsoft Defender Threat Intelligence plugin is another source that Copilot for Security may use to provide threat intelligence for IDPS signatures.


### Look for a given IDPS signature across your tenant, subscription, or resource group

Perform a **fleet-wide search** (over any scope) for a threat across all your Firewalls instead of searching for the threat manually.

**Sample prompts**:

- Was signature ID _\<ID number\>_ only stopped by this one Firewall? What about others across this entire tenant?
- Was the top hit seen by any other Firewall in the subscription _\<subscription name\>_?
- Over the past week did any Firewall in resource group _\<resource group name\>_ see signature ID _\<ID number\>_?


### Generate recommendations to secure your environment using Azure Firewall's IDPS feature

Get **information from documentation** about using Azure Firewall's IDPS feature to secure your environment instead of having to look up this information manually.

**Sample prompts**:

- How do I protect myself from future attacks from this attacker across my entire infrastructure?
- If I want to make sure all my Firewalls are protected against attacks from signature ID _\<ID number\>_, how do I do this?
- What is the difference in risk between alert only and alert and block modes for IDPS?

> [!NOTE]
>Copilot for Security may also use the *Ask Microsoft Documentation* capability to provide information on how to use Azure Firewall's IDPS feature to secure your environment.


## Provide feedback

Your feedback is vital to guide the current and planned development of the product. The best way to provide this feedback is directly in the product. Select **How’s this response?** at the bottom of each completed prompt and choose any of the following options:
- **Looks right** - Select if the results are accurate, based on your assessment. 
- **Needs improvement** - Select if any detail in the results is incorrect or incomplete, based on your assessment. 
- **Inappropriate** - Select if the results contain questionable, ambiguous, or potentially harmful information.

For each feedback option, you can provide more information in the next dialog box that appears. Whenever possible, and especially when the result is **Needs improvement**, write a few words explaining what can be done to improve the outcome. If you entered prompts specific to Azure Firewall and the results aren't related, then include that information.

## Data processing and privacy

When you interact with Copilot for Security to get Azure Firewall data, Copilot pulls that data from Azure Firewall. The prompts, the data retrieved, and the output shown in the prompt results are processed and stored within the Copilot service. For more information, see [Privacy and data security in Microsoft Copilot for Security](/copilot/security/privacy-data-security).

## Related content

- [What is Microsoft Copilot for Security?](/copilot/security/microsoft-security-copilot)