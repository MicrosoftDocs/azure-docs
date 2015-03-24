<properties 
   pageTitle="Backing up Azure Automation"
   description="Backing up Azure Automation"
   services="automation"
   documentationCenter=""
   authors="bwren"
   manager="stevenka"
   editor="tysonn" />
<tags 
   ms.service="automation"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="03/16/2015"
   ms.author="bwren" />

# Backing up Azure Automation

When you delete an automation account in Microsoft Azure, all objects in the account are deleted - runbooks, modules, settings, jobs, and the rest. After the account is deleted, the objects cannot be recovered.

Before you delete an automation account, do the following:

- Export your runbooks from the Azure Automation account to a safe location.

- Verify that all original integration modules that you imported into this Automation account are in a safe location outside the Automation account.

- Take notes of all settings (variables, credentials, certificates, connections, and schedules) used by the runbooks in this automation account. They will have to be recreated so that these runbooks can be used in a different automation account. Make sure to take notes of setting names, types, and values.

 - For certificate settings, verify that all original certificates that are imported into Automation are in a safe location outside Azure.
For credential settings, the password field will not be exposed to you in plain text so that you can take note of it. Make sure you know or have written down somewhere the password for each credential setting. For credential settings you do not know the password for, you can retrieve the password with a runbook using the Get-AutomationPSCredential activity.

 - For certificate settings, verify that all original certificates that are imported into Automation are in a safe location outside Azure.

 - For credential settings, the password field will not be exposed to you in plain text so that you can take note of it. Make sure you know or have written down somewhere the password for each credential setting. For credential settings you do not know the password for, you can retrieve the password with a runbook using the **Get-AutomationPSCredential** activity.

