---
title: Remediate recommendations in Azure Security Center  | Microsoft Docs
description: This document explains how to remediate recommendations in Azure Security Center to help you protect your Azure resources and stay in compliance with security policies.
services: security-center
documentationcenter: na
author: monhaber
manager: barbkess
editor: ''

ms.assetid: 8be947cc-cc86-421d-87a6-b1e23077fd50
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/04/2019
ms.author: v-mohabe

---
# Remediate recommendations in Azure Security Center

Recommendations give you suggestions on how to better secure your resources.  You implement a recommendation by following the remediation steps provided in the recommendation. 

## Remediation steps <a name="remediation-steps"></a>

After reviewing all the recommendations, decide which one to remediate first. We recommend that you use the [secure score impact](security-center-recommendations.md#monitor-recommendations) to help prioritize what to do first.

1. From the list, click on the recommendation.
1. Follow the instructions in the **Remediation steps** section. Each recommendation has its own set of instructions. The following shows remediation steps for configuring applications to only allow traffic over HTTPS.

    ![Recommendation details](./media/security-center-remediate-recommendations/security-center-remediate-recommendation.png)

1. Once completed, a notification appears informing you if the remediation succeeded.

## One-click fix remediation <a name="one-click"></a>

One-click fix enables you to remediate a recommendation on a bulk of resources, with a single click. It is an option only available for specific recommendations. One-click fix simplifies remediation and enables you to quickly improve your secure score and increase the security in your environment.

To implement one-click remediation:

1. From the list of recommendations that have the **1-Click-fix** label, click on the recommendation.  

   ![Select one-click fix](./media/security-center-remediate-recommendations/one-click-fix-select.png)

2. From the **Unhealthy resources** tab, select the resources that you want to implement the recommendation on, and click **Remediate**. 

    > [!NOTE]
    > Some of the listed resources might be disabled, because you do not have the appropriate permissions to modify them.

3. In the confirmation box, read the remediation details and implications. 

   ![One-click fix](./media/security-center-remediate-recommendations/security-center-one-click-fix.png)

    > [!NOTE]
    > The implications are listed in the grey box in the **Remediate resources** window that opens after clicking **Remediate**. They list what changes happen when proceeding with the 1-click remediation.

4. Insert the relevant parameters if necessary, and approve the remediation.

    > [!NOTE]
    > -It can take several minutes after remediation completes to see the resources in the **Healthy resources** tab. To view the the remediation actions, check the activity log where they are logged.

5. Once completed, a notification appears informing you if the remediation succeeded.

### Recommendations with one-click remediation

|Recommendation|Implication|
|---|---|
|1. Enable auditing on SQL servers|This action will enable SQL auditing on these servers and their databases.Notes: For each region of the selected SQL servers, a storage account for saving audit logs will be created and shared by all the servers in that region.To ensure proper auditing, do not delete or rename the resource group or the storage accounts.|
|2. Audit SQL managed instances without Advanced Data Security|This action will enable SQL Advanced Data Security (ADS) on the selected SQL managed instances. Notes: For each region and resource group of the selected SQL managed instances, a storage account for saving scan results will be created and shared by all the instances in that region.ADS is charged at $15 per SQL managed instance.|
|3. Audit SQL managed instances without Vulnerability Assessment|This action will enable SQL Vulnerability Assessment on the selected SQL managed instances. Notes:SQL Vulnerability Assessment is part of the SQL Advanced Data Security (ADS) package. If ADS is not enabled already it will automatically be enabled on the managed instance. For each region and resource group of the selected SQL managed instances, a storage account for storing scan results will be created and shared by all the instances in that region.ADS is charged at $15 per SQL server.|
|4. Audit SQL servers without Advanced Data Security|This action will enable Advanced Data Security (ADS) on these selected servers and their databases.Notes :For each region and resource group of the selected SQL servers, a storage account for storing scan results will be created and shared by all the servers in that region.ADS is charged at $15 per SQL server.|
|5. Audit SQL servers without Vulnerability Assessment|This action will enable SQL Vulnerability Assessment on these selected servers and their databases.Notes :SQL Vulnerability Assessment is part of the SQL Advanced Data Security (ADS) package. If ADS is not enabled already, it will automatically be enabled on the SQL server. For each region and resource group of the selected SQL servers, a storage account for storing scan results will be created and shared by all the instances in that region.ADS is charged at $15 per SQL server.|
|6. Enable transparent data encryption on SQL databases|This action enables SQL Database Transparent Data Encryption (TDE) on the selected databases. Note: By default, service-managed TDE keys will be used. 
|7, Require secure transfer to storage account|This action updates your storage account security to only allow requests by secure connections. (HTTPS).Notes:Any requests using HTTP will be rejected.When you are using the Azure files service, connection without encryption will fail, including scenarios using SMB 2.1, SMB 3.0 without encryption, and some flavors of the Linux SMB client.  Learn more.|
|8. Web Application should only be accessible over HTTPS|This action will redirect all traffic from HTTP to HTTPS, on the selected resources.   Notes: An HTTPS endpoint which doesn’t have an SSL certificate will show up in the browser with a ‘Privacy Error’. Therefore, users who have a custom domain need to verify they have set up an SSL certificate.Make sure packet and web application firewalls protecting the app service, allow HTTPS sessions forwarding.|
|9. Function App should only be accessible over HTTPS|This action will redirect all traffic from HTTP to HTTPS, on the selected resources.Notes: An HTTPS endpoint which doesn’t have an SSL certificate will show up in the browser with a ‘Privacy Error’. Therefore, users who have a custom domain need to verify they have set up an SSL certificate.Make sure packet and web application firewalls protecting the app service, allow HTTPS sessions forwarding.|
|10. API App should only be accessible over HTTPS|This action will redirect all traffic from HTTP to HTTPS, on the selected resources.Notes: An HTTPS endpoint which doesn’t have an SSL certificate will show up in the browser with a ‘Privacy Error’. Therefore, users who have a custom domain need to verify they have set up an SSL certificate.Make sure packet and web application firewalls protecting the app service, allow HTTPS sessions forwarding.|
|11. Remote debugging should be turned off for WebApp|This action disables remote debugging.|
|12. Remote debugging should be turned off for Function App|This action disables remote debugging.|
|13. Remote debugging should be turned off for API App|This action disables remote debugging.|
|14. CORS should not allow every resource to access your Web Application||This action blocks other domains from accessing your Web Application. To allow specific domains, enter them in the Allowed origins field (separated by commas). Note: Leaving the field empty will block all cross-origin calls.’Param field title: ‘Allowed origins’|
|15. CORS should not allow every resource to access your Function App|This action blocks other domains from accessing your Function Application. To allow specific domains, enter them in the Allowed origins field (separated by commas). Note: Leaving the field empty will block all cross-origin calls.’Param field title: ‘Allowed origins’|
|16. CORS should not allow every resource to access your API App|This action blocks other domains from accessing your API Application. To allow specific domains, enter them in the Allowed origins field (separated by commas). Note: Leaving the field empty will block all cross-origin calls.’Param field title: ‘Allowed origins’|
|17. Install monitoring agent|This action installs a monitoring agent on the selected virtual machines.Select a workspace for the agent to report to.|
|18. Disk encryption |This action will enable disk encryption, learn moreThe key vaults you can select:Reside in the same Azure region and subscription as the VMenabled with disk encryption on the key vault , learn more  if remediation failed, check for failure details in the activity log ||

## Next steps

In this document, you were shown how to remediate recommendations in Security Center. To learn more about Security Center, see the following topics:

* [Setting security policies in Azure Security Center](tutorial-security-policy.md) — Learn how to configure security policies for your Azure subscriptions and resource groups.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md) — Learn how to monitor the health of your Azure resources.
