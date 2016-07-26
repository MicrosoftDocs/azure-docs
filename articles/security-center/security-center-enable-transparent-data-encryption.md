<properties
   pageTitle="Enable Transparent Data Encryption in Azure Security Center | Microsoft Azure"
   description="This document shows you how to implement the Azure Security Center recommendation **Enable Transparent Data Encryption**."
   services="security-center"
   documentationCenter="na"
   authors="TerryLanfear"
   manager="MBaldwin"
   editor=""/>

<tags
   ms.service="security-center"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="07/21/2016"
   ms.author="terrylan"/>

# Enable Transparent Data Encryption in Azure Security Center

Azure Security Center will recommend that you enable Transparent Data Encryption (TDE) on SQL databases if TDE is not already enabled. TDE protects your data and helps you meet compliance requirements by encrypting your database, associated backups, and transaction log files at rest, without requiring changes to your application. To learn more see [Transparent Data Encryption with Azure SQL Database](https://msdn.microsoft.com/library/dn948096).

This recommendation applies to the Azure SQL service only; doesn't include SQL running on your virtual machines.

> [AZURE.NOTE] This document introduces the service by using an example deployment.  This is not a step-by-step guide.

## Implement the recommendation

1. In the **Recommendations** blade, select **Enable Transparent Data Encryption**.
![Enable Transparent Data Encryption][1]

2. This opens the **Enable Transparent Data Encryption on SQL databases** blade. Select a SQL database to enable TDE on.
![Select SQL DB to enable TDE on][2]
3. On the **Transparent data encryption** blade, select **ON** under Data encryption and select **Save** in the top ribbon of the blade.
![Turn on TDE][3]

  Once TDE is enabled on the selected SQL database, the **Encryption status** will change to **Encrypted**.    

  ![Encryption status][4]

## See also

This article showed you how to implement the Security Center recommendation "Enable Transparent Data Encryption." To learn more about SQL TDE, see the following:

- [Transparent Data Encryption with Azure SQL Database](https://msdn.microsoft.com/library/dn948096)
- [Get started with Transparent Data Encryption (TDE)](../sql-data-warehouse/sql-data-warehouse-encryption-tde.md)

To learn more about Security Center, see the following:

- [Setting security policies in Azure Security Center](security-center-policies.md) -- Learn how to configure security policies for your Azure subscriptions and resource groups.
- [Managing security recommendations in Azure Security Center](security-center-recommendations.md) -- Learn how recommendations help you protect your Azure resources.
- [Security health monitoring in Azure Security Center](security-center-monitoring.md) -- Learn how to monitor the health of your Azure resources.
- [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) -- Learn how to manage and respond to security alerts.
- [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md) -- Learn how to monitor the health status of your partner solutions.
- [Azure Security Center FAQ](security-center-faq.md) -- Find frequently asked questions about using the service.
- [Azure Security blog](http://blogs.msdn.com/b/azuresecurity/) -- Get the latest Azure security news and information.

<!--Image references-->
[1]: ./media/security-center-enable-tde-on-sql-databases/enable-tde.png
[2]:./media/security-center-enable-tde-on-sql-databases/transparent-data-encryption-blade.png
[3]: ./media/security-center-enable-tde-on-sql-databases/turn-on-tde.png
[4]: ./media/security-center-enable-tde-on-sql-databases/encrypted.png
