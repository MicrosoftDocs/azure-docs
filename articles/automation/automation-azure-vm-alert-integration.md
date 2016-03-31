<properties
    pageTitle=" Remediate Azure VM Alerts with Automation Runbooks | Microsoft Azure"
    description="This article describes the integration of Azure Virtual Machine alerts with Azure Automation runbooks."
    services="automation"
    documentationCenter=""
    authors="csand;magoedte"
    manager="stevenka"
    editor="tysonn" />    
<tags
    ms.service="automation"
    ms.devlang="na"
    ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="infrastructure-services"
    ms.date="03/31/2016"
    ms.author="csand;magoedte" />

# Remediate Azure VM Alerts with Automation Runbooks

Azure Automation and Azure Virtual Machines have released the public preview of a new feature allowing you to configure Virtual Machine (VM) alerts to run Automation runbooks. This new capability allows you to automatically perform standard remediation in response to VM alerts, like restarting or stopping the VM.

Previously, during VM alert rule creation you were able to [specify an Automation webhook to a runbook](https://azure.microsoft.com/en-us/blog/using-azure-automation-to-take-actions-on-azure-alerts/) in order to run the runbook whenever the alert triggered. However, this required you to do the work of creating the runbook, creating the webhook for the runbook, and then copying and pasting the webhook during alert rule creation. With this new release, the process is much easier because you can directly choose a runbook from a list during alert rule creation, and you can choose an Automation account which will run the runbook or easily create an account.

In this article, we will show you how easy it is to set up an Azure VM alert and configure an Automation runbook to run whenever the alert triggers. Example scenarios include restarting a VM when the memory usage exceeds some threshold due to an application on the VM with a memory leak, or stopping a VM when the CPU user time has been below 1% for past hour and is not in use. We’ll also explain how the automated creation of a service principal in your Automation account simplifies the use of runbooks in Azure alert remediation.

## Create an alert on a VM

In the Azure portal, navigate to one of your virtual machines (only V2 VMs are supported in this release, but support for classic VMs will be added soon). From the VM dashboard blade select **All settings**, then **Alert rules**, and finally **Add alert**. This opens up the “Add an alert rule” blade, where  you can configure the conditions for the alert and then choose among one or all of these options: send email to someone, use a webhook to call some system, and/or run an Automation runbook.

###Configure a runbook

To configure a runbook to run, select Automation Runbook. In the Configure runbook blade, you can select the runbook to run and the Automation account to run the runbook in.

![Configure an Automation runbook and create a new Automation Account](media/automation-azure-vm-alert-integration/ConfigureRunbookNewAccount.png)

For this preview release you can choose from three runbooks that the service provides – Restart VM, Remove VM, or Stop VM (the ability to choose other runbooks or one of your own runbooks is in our plans).

![Runbooks to choose from](media/automation-azure-vm-alert-integration/RunbooksToChoose.png)

After you choose a runbook, you choose the Automation account where the runbook will run. These runbooks need to run in the context of an [Automation account](https://azure.microsoft.com/en-us/documentation/services/automation/) that is in your Azure subscription. You can select an Automation account that you already own, or you can have a new Automation account created for you.

The runbooks that are provided authenticate to Azure using a service principal. If you choose to run the runbook in one of your existing Automation accounts, we will automatically create the service principal for you. If you choose to create a new Automation account, then we will automatically create the account and the service principal. In both cases, two assets will also be created in the Automation account – a certificate asset named AzureRunAsCertificate and a connection asset named AzureRunAsConnection. The runbooks will use AzureRunAsConnection to authenticate with Azure in order to take the management action against the VM.

Note, the service principal is created in the subscription scope and is assigned the Contributor role. This role is required in order to have permission to run Automation runbooks to manage Azure VMs.

Also note, the creation of an Automaton account and/or service principal is a one-time event. Once these are created, you can use that account to run runbooks for other Azure VM alerts.

When you click **OK** the work will be done to configure the runbook for use in the alert. This can take a few seconds if a new Automation account and/or service principal are being created.

![Runbook being configured](media/automation-azure-vm-alert-integration/RunbookBeingConfigured.png)

After the configuration is completed you will see the name of the runbook appear in the alert rule creation blade.

![Runbook configured](media/automation-azure-vm-alert-integration/RunbookConfigured.png)

Click **OK** in this blade and the alert rule will be created and start operating.

###Enable or disable a runbook

If you have a runbook configured for an alert, you can disable it without removing the runbook configuration. This allows you to keep the alert running and perhaps test some of the alert rules and then later re-enable the runbook.

##Summary

When you configure an alert on an Azure VM, you now have the ability to easily configure an Automation runbook to automatically perform remediation action when the alert triggers. For the Preview release, you can choose from runbooks to restart, stop, or delete a VM depending on your alert scenario. This is just the beginning of enabling scenarios where you control the actions (notification, troubleshooting, remediation) that will be taken automatically when an alert triggers.
