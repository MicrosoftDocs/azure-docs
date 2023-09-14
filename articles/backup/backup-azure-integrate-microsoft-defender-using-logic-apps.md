---
title: Integrate Microsoft Defender's ransomware alerts to preserve Azure Backup recovery points
description: Learn how to integrate Microsoft Defender for Cloud and Azure Backup using logic app.
ms.topic: how-to
ms.custom: references_regions
ms.date: 12/30/2022
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Solution sample to integrate Microsoft Defender's ransomware alerts to preserve Azure Backup recovery points

This article describes the sample solution that demonstrates how to integrate Microsoft Defender's ransomware alerts to preserve Azure Backup recovery points. Assume there has been a breach on the Virtual Machine that is protected by both Defender and Azure Backup. Defender detects the ransomware, raises an alert which includes details of the activity and suggested recommendations to remediate. As soon as a ransomware signal is detected from Defender, ensuring backups are preserved (i.e., paused from expiring) to minimize the data loss is top of our customers’ mind.

Azure Backup provides several security capabilities to help you protect your backup data. [Soft delete](backup-azure-security-feature-cloud.md), [Immutable vaults](backup-azure-immutable-vault-concept.md), [Multi-User Authorization (MUA)](multi-user-authorization-concept.md) are part of a comprehensive data protection strategy for backup data. Soft delete is enabled by default, with option to make it always-on (irreversible). Soft deleted backup data is retained at no additional cost for *14* days, with option to [extend the duration](backup-azure-enhanced-soft-delete-about.md). Enabling immutability on vaults can protect backup data by blocking any operations that could lead to loss of recovery points. You can configure Multi-user authorization (MUA) for Azure Backup as an additional layer of protection to critical operations on your Recovery Services vaults. By default, critical alert for destructive operation (such as stop protection with delete backup data) is raised and an email is sent to subscription owners, admins, and co-admins.

Microsoft Defender for Cloud (MDC) is a Cloud Security Posture Management (CSPM) and Cloud Workload Protection Platform (CWPP) for all of your Azure, on-premises, and multicloud (Amazon AWS and Google GCP) resources. Defender for Cloud generates security alerts when threats are identified in your cloud, hybrid, or on-premises environment. It's available when you enable enhanced security features. Each alert provides details of affected resources along with the information you need to quickly investigate the issue and steps to take to remediate an attack. If a malware or a ransomware attacks on an Azure Virtual Machine, Microsoft Defender for Cloud detects suspicious activity and indicators associated with ransomware on an Azure VM and generates a Security Alert. Examples of the Defender for Cloud Alerts that trigger on a Ransomware detection: *Ransomware indicators detected*, *Behavior similar to ransomware detected*, and so on.

>[!Note]
> This sample solution is scoped to Azure Virtual Machines. You can deployed the logic app only at a subscription level, which means all Azure VMs under the subscription can use the logic app to pause expiry of recovery points in the event of a security alert.

## Solution details

This sample solution demonstrates integration of Azure Backup with Microsoft Defender for Cloud (MDC) for detection and response to alerts to accelerate response. Sample illustrates the following three use cases:

- Ability to send email alerts to the Backup Admin.
- Security Admin to triage and manually trigger logic app to secure backups. 
- Workflow to automatically respond to the alert by performing the *Disable Backup Policy (Stop backup and retain data)* operation.

:::image type="content" source="./media/backup-azure-integrate-microsoft-defender-using-logic-apps/logic-apps-flow-diagram.png" alt-text="Diagram shows how Microsoft Defender for Cloud and Azure Backup using Logic apps helps protecting the backup data.":::

## Prerequisites

- [Enable Azure Backup for Azure virtual machines](tutorial-backup-vm-at-scale.md).
- [Enable Microsoft Defender for Servers Plan 2 for the Subscription](../defender-for-cloud/enable-enhanced-security.md#enable-enhanced-security-features-on-a-subscription).

## Deploy Azure Logic Apps

To deploy Azure Logic Apps, follow these steps:

1. Go to [GitHub](https://github.com/Azure/Microsoft-Defender-for-Cloud/tree/main/Workflow%20automation/Protect%20Azure%20VM%20Backup%20from%20Ransomware) and select **Deploy to Azure**.

   :::image type="content" source="./media/backup-azure-integrate-microsoft-defender-using-logic-apps/start-azure-logic-apps-deployment.png" alt-text="Screenshot shows how to start Azure Logic Apps from GitHub.":::

2. On the **deployment** pane, enter the following details:

   - **Subscription**: Select the subscription whose Azure VMs the logic app should govern.
   - **Name**: Enter a suitable name for the logic app.
   - **Region**: Choose the region with which the subscription is associated.
   - **Email**: Enter the email address of the Backup admin for them to receive alerts when policy is suspended.
   - **Resource group**: Select the resource group with which logic apps need to be associated for deployment. 
   - **Managed Identity**: [Create and assign a Managed Identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity) with the below minimum permissions for the service to perform the *Stop backup and retain data* operation on the backup item automatically during a malware alert.

     - Virtual Machine Contributor on the subscription
     - The Backup Operator on the subscription
     - Security Reader

     >[!Note]
     >To further tighten the security, we recommend you create a custom role and assign that to the Managed Identity instead of the above built-in roles. This ensures that all the calls run with least privileges. For more information on custom role, see the [GitHub article](https://github.com/Azure/Microsoft-Defender-for-Cloud/tree/main/Workflow%20automation/Protect%20Azure%20VM%20Backup%20from%20Ransomware).

   - **Managed Identity Subscription**: Enter the name of a Subscription that the Managed Identity should reside in.
   - **Managed Identity Resource Group**: Enter the name of a resource group that the Managed Identity should reside in.
   
   :::image type="content" source="./media/backup-azure-integrate-microsoft-defender-using-logic-apps/enter-details-for azure-logic-apps-deployment.png" alt-text="Screenshot shows how to enter details to deploy Azure Logic Apps.":::

   >[!Note]
   >You need *Owner* access on the Subscription to deploy the logic app. 

3. Select **Review + Create**.

## Authorize Office 365 for email alerts

To authorize the API connection to Office 365, follow these steps: 

1. Go to the *resource group* you used to deploy the template resources.
2. Select the *Office365 API connection* (which is one of the resources you deployed) and select the *error that appears at the API connection*.
3. Select **Edit API connection**.
4. Select **Authorize**. 

   >[!Note]
   >Ensure that you authenticate against Azure AD.

5. Select **Save**.

## Trigger the logic app

You can trigger the deployed logic app *manually* or *automatically* using [workflow automation](../defender-for-cloud/workflow-automation.md).

### Trigger manually

To trigger the logic app manually, follow these steps:

1. Go to **Microsoft Defender for Cloud**, and then select **Security Alerts** on the left pane.
1. Select the required alert to expand details.
1. Select **Take action**, choose **Trigger automated response**, and then select **Trigger logic app**.
1. Search the deployed logic app by name, and then select **Trigger**.

>[!Note]
>The minimum Azure RBAC permissions needed to trigger an action for the security alert are:
>
>-	Logic app Operator
>-	Security Admin role

### Trigger using workflow automation via Azure portal

Workflow automation ensures that during a security alert, your backups corresponding to the VM facing this issue changes to **Stop backup and retain data** state, thus suspend policy and pause recovery point pruning. You can also use Azure Policy to deploy [workflow automation](../defender-for-cloud/workflow-automation.md).

>[!Note]
>The minimum role required to deploy the workflow automation are:
>
>- Logic app Operator
>- Security Admin

To trigger the logic app using automatic workflow, follow these steps:

1. Go to **Defender for Cloud**, and then select **Workflow automation** on the left pane.
1. Select **Add workflow automation** to open the options pane for the new automation.
1. Enter the following details:

   - **Name and Description**: Enter a suitable name for the automation.
   - **Subscription**: Select the subscription same as the scope of the logic app.
   - **Resource group**: Select the resource group in which the automation will reside.
   - **Defender for Cloud Data Type**: Select *Security Alert*.
   - **Alert name contains**: Select *Malware* or *ransomware*.
   - **Alert severity**: Select *High*.
   - **Logic app**: Select the logic app you deployed.
1. Select **Create**.

## Email alerts

When the backup policy on the backup item gets disabled, the logic app also sends an email to the ID you've entered during deployment. The email ID should ideally be of the *Backup Admin*. You can then investigate the alert and resume the backups when the issue is resolved or if it's a false alarm.

## Next steps

[About backup and restore plan to protect against ransomware](../security/fundamentals/backup-plan-to-protect-against-ransomware.md).