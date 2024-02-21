---
title: Deploy automatic attack disruption for SAP | Microsoft Sentinel
description: This article describes how to deploy automatic attack disruption in the Microsoft Defender portal for SAP.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.date: 02/21/2024
---

# Deploy automatic attack disruption for SAP

Microsoft Defender XDR correlates millions of individual signals to identify active ransomware campaigns or other sophisticated attacks in the environment with high confidence. While an attack is in progress, Defender XDR disrupts the attack by automatically containing compromised assets that the attacker is using through automatic attack disruption.

Automatic attack disruption limits lateral movement early on and reduces the overall impact of an attack, from associated costs to loss of productivity. At the same time, it leaves security operations teams in complete control of investigating, remediating, and bringing assets back online.

This article describes how to deploy automatic attack disruption in the Microsoft Defender portal for SAP, together with Microsoft Sentinel integrated into the Microsoft Defender portal and the Microsoft Sentinel solution for SAP applications. Deployment includes steps in both Microsoft Sentinel in the Azure portal, and in your SAP environment.

For more information, see [Automatic attack disruption in Microsoft Defender XDR](/microsoft-365/security/defender/automatic-attack-disruption).

## Prerequisites

To deploy automatic attack disruption for SAP, you need the following:

- A SAP agent virtual machine with a managed identity or service principal.

- The *[MSFTSEN_SENTINEL_CONNECTOR_ROLE_V0.0.27.SAP](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP/Sample%20Authorizations%20Role%20File)* SAP agent role assignment in your SAP system. For more information, see [Deploy SAP Change Requests and configure authorization](preparing-sap.md).

- *Owner* rights on your Microsoft Sentinel workspace's Azure resource group. To ensure you have the correct permissions, in Microsoft Sentinel, select **Settings > Settings > Playbook permissions > Configure permissions**. Make sure that your Microsoft Sentinel workspace's resource group is listed under **Current permissions**.

- The Microsoft Sentinel solution for SAP applications [deployed in your Microsoft Sentinel workspace](deployment-overview.md)

- [Microsoft Sentinel integrated into the Microsoft Defender portal](/microsoft-365/security/defender/microsoft-sentinel-onboard)

## Deployed Azure resources

Deploying automatic attack disruption for SAP deploys the following Azure resources to support Microsoft Sentinel's security orchestration, automation, and response (SOAR) capabilities:

|Resource  | Description |
|---------|---------|
|An Azure storage account     |  Used to hold SAP agent queue messages, which are used by the disrupt API and playbooks to orchestrate disrupt operations in the SAP environment.       |
|The *microsoft-internal-attack-disruption-SAP-lock-access* logic app and playbook    | The *disrupt* playbook, responsible for queueing messages needed to lock SAP users, verify success of the lock command with hte agent, and update the Microsoft Sentinel incident with comments on actions taken. <br><br>This playbook is for internal use only and must not be deleted or modified.        |
|The *microsoft-internal-attack-disruption-SAP-unlock-access* logic app and playbook     | Available for Microsoft Sentinel operators to run after an incident has been resolved. Run this playbook from the Microsoft Sentinel alert originally used to lock the SAP user to unlock the user in the SAP system.|

## Deployment steps in Microsoft Sentinel

This section describes the deployment steps for automatic attack disruption for SAP in Microsoft Sentinel.

1. In Microsoft Sentinel, select **Configuration > Data connectors > Microsoft Sentinel for SAP > Open connector page** to open the SAP data connector.

1. Add a new agent, following the instructions on your screen. You'll need to provide the details of your SAP agent managed identity, or the application identity if the agent is on-premises. For more information, see [Create a new agent](deploy-data-connector-agent-container.md#create-a-new-agent).

    To find an application identity object ID, go to the Microsoft Entra portal and select **Enterprise applications**. Search for the name of the App Registration, and copy the object ID value to use with your new agent.

    > [!IMPORTANT]
    > Don't confuse the App Registration object ID listed on the **App Registrations** page with the object ID listed on the **Enterprise Applications** page. Only the object ID from the **Enterprise Applications** page will work.
 
Towards the end of your agent creation, you're provided with a command line to copy to the clipboard. You'll use this command in the next section, as you deploy automatic attack disruption in [in your SAP environment](#deployment-steps-in-your-sap-environment).

If you run into errors, check your Azure resource group's **Deployment** page. You'll also find more details in the ARM deployment logs.

## Deployment steps in your SAP environment

Complete the new agent setup by running the command provided when you [created your agent in Microsoft Sentinel](#deployment-steps-in-microsoft-sentinel) on your agent's virtual machine.

Verify that the deployment successfully granted the following role assignments in the SAP system, required to enable SAP disrupt workflows:

|Azure resource  |Target role assignment  |Target resource  |
|---------|---------|---------|
|*microsoft-internal-attack-disruption-SAP-lock-access*     |  [Microsoft Sentinel Responder ](/azure/role-based-access-control/built-in-roles#microsoft-sentinel-responder)       |   Microsoft Sentinel Resource Group       |
|*microsoft-internal-attack-disruption-SAP-lock-access*     |      [Storage Queue Data Contributor](/azure/role-based-access-control/built-in-roles#storage-queue-data-contributor)    |   Disrupt Storage account       |
|*microsoft-internal-attack-disruption-SAP-unlock-access*     |   [Microsoft Sentinel Reader](/azure/role-based-access-control/built-in-roles#microsoft-sentinel-reader)       |  Microsoft  Sentinel Resource Group      |
|*microsoft-internal-attack-disruption-SAP-unlock-access*     |    Storage Queue Data Contributor      |  Disrupt Storage account        |
|*Agent VM / Service Principal*     |    [Storage Queue Data Message Processor](/azure/role-based-access-control/built-in-roles#storage-queue-data-message-processor)      |    Disrupt Storage account      |


## Related content

- [Automatic attack disruption in Microsoft Defender XDR](/microsoft-365/security/defender/automatic-attack-disruption)
- [Recommended playbooks](../automate-responses-with-playbooks.md#recommended-playbooks)