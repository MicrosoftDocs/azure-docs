---
title: Integrate Microsoft Defender for Cloud and Azure Backup using Azure Logic Apps 
description: This article explains how to integrate Microsoft Defender for Cloud and Azure Backup using Azure Logic Apps.
ms.topic: how-to
ms.custom: references_regions
ms.date: 12/15/2022
author: v-amallick
ms.service: backup
ms.author: v-amallick
---

# Integrate Microsoft Defender for Cloud and Azure Backup using Azure Logic Apps

Microsoft Defender for Cloud (MDC) helps detect and resolve threats on resources and services. During a malware or a ransomware attack, MDC helps detect malicious activities against the resource and raise [Security Alerts](../defender-for-cloud/managing-and-responding-alerts.md). When this helps identify malicious activities, backups play a crucial role to help you to recover the workload to a clean state and ensure business continuity.

This article describes how the deployed logic app helps prevent the loss of recovery points in a malware attack by disabling the backup policy (Stop Backup and Retain Data). This ensures that the recovery points don’t expire or are cleaned up based on the schedule  for retention. When the operation on the backup item is complete, the Backup admin receives a notification via email. 

>[!Note]
>This feature is currently supported only for Azure VMs.

## Scope

You can deploy the Azure Logic Apps only at a subscription level, which means that all Azure VMs under the subscription can use the Azure Logic Apps to pause backup pruning during a security alert.

## Flow diagram

:::image type="content" source="./media/backup-azure-integrate-microsoft-defender-using-logic-apps/logic-apps-flow-diagram.png" alt-text="Diagram shows how Microsoft Defender for Cloud and Azure Backup using Logic apps helps protecting the backup data.":::

## Deploy Azure Logic Apps

You need the *Owner* access on the *Subscription* to deploy Azure Logic Apps.

To deploy Azure Logic Apps, follow these steps:

1. Go to [GitHub](https://github.com/Azure/Microsoft-Defender-for-Cloud/tree/main/Workflow%20automation/Protect%20Azure%20VM%20Backup%20from%20Ransomware) and select **Deploy to Azure** or **Deploy to Azure Gov**.

   :::image type="content" source="./media/backup-azure-integrate-microsoft-defender-using-logic-apps/start-azure-logic-apps-deployment.png" alt-text="Screenshot shows how to start Azure Logic Apps from GitHub.":::

2. On the **Custom deployment** pane, enter the following details:

   - **Subscription**: Select the Azure subscription whose e VMs the logic app should govern. 
   - **Name**: Name for the logic app
   - **Region**: Choose the region with which the subscription is associated. 
   - **Email**: The email address of the Backup admin for them to receive alerts when policy is suspended.  
   - **Resource Group**: Logic apps need to be associated with a Resource Group for deployment. Choose any Resource Group for the same. 
   - **Managed Identity**: Create and assign a Managed Identity with the below permissions for the service to perform the *Stop backup and retain data* operation on the backup item automatically in the event of a malware alert. 

     Learn about [how to create a User-defined Managed Identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity).

   - Managed Identity Subscription: Input the name of a Subscription that the Managed Identity should reside in. 
   - Managed Identity Resource Group: Input the name of a Resource Group that the Managed Identity should reside in.
     - **Owner access on the subscription**

   :::image type="content" source="./media/backup-azure-integrate-microsoft-defender-using-logic-apps/enter-details-for azure-logic-apps-deployment.png" alt-text="Screenshot shows how to enter details to deploy Azure Logic Apps.":::

## Trigger Azure Logic Apps

When the logic app deployment is complete, you can trigger it manually or automatically by using the [workflow automation](../defender-for-cloud/workflow-automation.md).

### Trigger manually

To trigger the logic app manually, follow these steps:

1. Go to **Microsoft Defender for Cloud** > **Security Alerts**.

   Alternatively, you can use **Backup center** to view the alerts.

1. Select **Take action**, choose **Trigger automated response**, and then select **Trigger logic app**.

1. Search the deployed logic app by name, and then select **Trigger**.

>[!Note]
>The minimum Azure RBAC permissions needed to trigger an action for the security app are:
>
>-	VM Contributor on the Source VM
>-	Backup Contributor on the RSV
>-	Logic app operator  

### Trigger using workflow automation via Azure portal

Workflow automation ensures that during a security alert, your backups corresponding to the VM facing this issue changes to Stop backup and retain data state, thus suspending policy and recovery point pruning. You can also use Azure Policy to deploy [workflow automation](../defender-for-cloud/workflow-automation.md).

To trigger Azure Logic apps using automatic workflow, follow these steps:

1. Go to **Defender for Cloud** > **Workflow automation**.

1. Select **Add workflow automation** to open the options pane for the new automation.

1. Enter the following details:

   - **Name and Description**: Enter a suitable name for the automation. 
   - **Subscription**: Select the same subscription as the scope of the logic app where you've defined the scope of the automation.
   - **Resource Group**: Choose the resource group in which the automation will reside. 
   - **Defender for Cloud Data Type**: Select Security Alert.
   - **Alert name contains**: Select ‘Malware’ or ‘ransomware’ 
   - **Alert severity**: Select High
   - **Logic app**: Choose the logic app deployed

### Email alerts

When the backup policy on the backup item gets disabled, the logic app also sends an email to the ID you've entered during deployment. You can then investigate the alert and resume the backups when the issue is resolved or if it's a false alarm.

## Monitor the alerts

You can periodically monitor the alerts raised by MDC via the Backup center.

To monitor the alerts via Backup center, follow these steps:

1. Go to **Backup center**, and then select **Active Defender Security Alerts (All time)**.

   This lists the Security alerts related to Azure VMs raised by MDC. 

   :::image type="content" source="./media/backup-azure-integrate-microsoft-defender-using-logic-apps/active-defender-security-alerts.png" alt-text="Screenshot shows how to select Active Defender Security Alerts (All time).":::

2. Select the alert from the list to go to the respective *Security alert* in the *MDC portal* and take necessary steps.

   :::image type="content" source="./media/backup-azure-integrate-microsoft-defender-using-logic-apps/select-alert-to-take-actions.png" alt-text="Screenshot shows how to select alert to take actions.":::

## Next steps

[About backup and restore plan to protect against ransomware](../security/fundamentals/backup-plan-to-protect-against-ransomware.md).