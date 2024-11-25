---
title: Enable Dedicated Hosting Plan for Azure Monitor for SAP solutions
description: Learn about enabling dedicated hosting plan for your AMS resources
author: vaidehikher18
ms.service: sap-on-azure
ms.subservice: sap-monitor
ms.topic: how-to
ms.date: 11/14/2024
ms.author: vaidehikher
#Customer intent: As an SAP Basis or cloud infrastructure team member, I want to deploy Azure Monitor for SAP solutions with dedicated hosting plan.
---

# Enable Dedicated Hosting Plan

One of the features of Azure Monitor for SAP solutions is that it uses an Azure function to collect and process the data from your SAP systems. The service deploys and manages the Azure function, so you do not need to configure or maintain it. However, you may want to optimize the cost and reliability of the Azure function based on your monitoring needs and usage patterns. 

This new feature allows you to switch the hosting plan of the Azure function that is used inside of Azure Monitor for SAP solutions. With this feature, you can migrate to the dedicated plan for the Azure functions. The hosting plan of the Azure function determines how the function app is scaled and billed.

The Dedicated hosting plan has a significant improvement in cost and scaling efficiency when used on AMS

## Prerequisites
1.	Ensure the storage account has public network access:
    1. Go to the storage account in the AMS managed resource group.
    2. Click on the security and networking tab, then click on the networking tab.
    3. Under public network access, ensure the 'enabled from all networks' option is selected."

2.	Ensure there are no locks on monitor subnet's Resource Group

## Steps to enable dedicated hosting plan
1.	Navigate to Overview Section of the AMS monitor. Verify the hosting option is Elastic Premium. Then click on Edit Option.
 ![Screenshot of Changing Azure Function Hosting Plan in AMS from Overview Section.](https://github.com/user-attachments/assets/3d7ddd86-86ce-4b62-a45f-8daf22b817f1)

2.	In the popup that opens click on Update and then Confirm.
 ![Screenshot of successful migration.](https://github.com/user-attachments/assets/3d304fe4-d13d-45a5-8b3d-1fa8d80c72ea)

3.	When deployment succeeds. Hosting plan is updated in overview section.

## Steps to revert to Elastic Plan on unhealthy AMS
If the deployment fails with code FunctionAppRestoreFailed or if restoration to Elastic Premium Plan is needed after multiple failure, then follow the below steps to revert to Elastic Premium Plan.

1.	Install Azure CLI, refer [Install Azure CLI](https://go.microsoft.com/fwlink/?linkid=2297461).
2.	Run `az account set --subscription "<Subscription Name>"` to set subscription.
3.	Run `az extension add --name workloads` to install Workloads CLI extension.
5.	Execute az monitor create with required properties as per your AMS.
   `az workloads monitor create -g <rg-name> -n <ams_name> -l <location> --app-location <app-location> --managed-rg-name <managed_rg_name> --monitor-subnet <subnet_arm_id> --routing-preference <routing_preference> --identity type=None`
7.	Monitor will be restored once operation completes.

