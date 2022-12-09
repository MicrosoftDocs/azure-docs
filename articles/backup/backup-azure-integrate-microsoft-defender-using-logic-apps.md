---
title: Integrate Microsoft Defender for Cloud and Azure Backup using Logic Apps 
description: This article explains how to integrate Microsoft Defender for Cloud and Azure Backup using Logic Apps.
ms.topic: how-to
ms.custom: references_regions
ms.date: 12/15/2022
author: v-amallick
ms.service: backup
ms.author: v-amallick
---

# Integrate Microsoft Defender for Cloud and Azure Backup using Logic apps

Microsoft Defender for Cloud (MDC) helps detect and resolve threats on resources and services. During a malware or a ransomware attack, MDC helps detect malicious activities against the resource and raise [Security Alerts](../defender-for-cloud/managing-and-responding-alerts.md). When this helps identify malicious activities, backups play a crucial role to help you to recover the workload to a clean state and ensure business continuity.

This article describes how the deployed logic app helps prevent the loss of recovery points in a malware attack by disabling the backup policy (Stop Backup and Retain Data). This ensures that the recovery points don’t expire or are cleaned up based on the schedule  for retention. When the operation on the backup item is complete, the Backup admin receives a notification via email. 

>[!Note]
>This feature is currently supported only for Azure VMs.

## Scope

You can deploy the logic app only at a subscription level, which means that all Azure VMs under the subscription can use the logic app to pause backup pruning during a security alert. 

## Flow diagram

:::image type="content" source="{source}" alt-text="{alt-text}":::

## Deploy the logic app

You need the Owner access on the Subscription to deploy the logic app.

To deploy the logic app, follow these steps:

1. Go to *insert Github link* and select Deploy to Azure’ or ‘Deploy to Azure Gov’.

   :::image type="content" source="{source}" alt-text="{alt-text}"::: 

2. On the deployment pane, enter the following details:

   - **Subscription**: Select the Azure subscription whose e VMs the logic app should govern. 
   - **Name**: Name for the logic app
   - **Region**: Choose the region with which the subscription is associated. 
   - **Email**: Tthe email address of the Backup admin for them to receive alerts when policy is suspended.  
   - **Resource Group**: Logic apps need to be associated with a Resource Group for deployment. Choose any Resource Group for the same. 
   - **Managed Identity**: Create and assign a Managed Identity with the below permissions for the service to perform the operation of ‘Stop backup and retain data’ on the backup item automatically in the event of a malware alert. 

     Learn about [how to create a User-defined Managed Identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity).

   - Managed Identity Subscription: Input the name of a Subscription that the Managed Identity should reside in. 
   - Managed Identity Resource Group: Input the name of a Resource Group that the Managed Identity should reside in.       - **Owner access on the subscription**

   :::image type="content" source="{source}" alt-text="{alt-text}":::

## Trigger the logic app

When the logic app deployment is complete, you can trigger it manually or automatically by using the [workflow automation](../defender-for-cloud/workflow-automation.md).

### Trigger manually

To trigger the logic app manually, follow these steps:








## Next steps

[Configure and manage enhanced soft delete for Azure Backup (preview)](backup-azure-enhanced-soft-delete-configure-manage.md).