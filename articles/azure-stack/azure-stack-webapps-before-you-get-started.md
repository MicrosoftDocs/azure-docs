<properties
	pageTitle="Azure Stack App Service Technical Preview 1 Before You Get Started | Microsoft Azure"
	description="Steps to complete before deploying Web Apps on Azure Stack"
	services="azure-stack"
	documentationCenter=""
	authors="apwestgarth"
	manager="stefsch"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="app-service"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/01/2016"
	ms.author="anwestg"/>
	
# Before you get started with Azure Stack Web Apps

You will need a few items to install Azure Stack Web Apps:

- A completed deployment of [Azure Stack Technical Preview 1](azure-stack-run-powershell-script.md)
- Enough space in your Azure Stack system for a small deployment of Azure Stack Web Apps.  The required space is roughly 20GB of disk space.
- [A server that's running SQL Server](#SQL-Server).

>[AZURE.NOTE] The following steps ALL take place on the Client VM.

## Before you deploy Azure Stack Web Apps

To deploy a resource provider, you must run the PowerShell Integrated Scripting Environment(ISE) as an administrator. For this reason, you need to allow cookies and JavaScript in the Internet Explorer profile that you use to sign in to Azure Active Directory.

## Turn off Internet Explorer enhanced security

1.	Sign in to the Azure Stack proof-of-concept (POC) computer as **AzureStack/administrator**, and then open **Server Manager**.
2.	Turn off **Internet Explorer Enhanced Security Configuration** for both admins and users.
3.	Sign in to the ClientVM.AzureStack.local virtual machine as an administrator, and then open **Server Manager**.
4.	Turn off **Internet Explorer Enhanced Security Configuration** for both admins and users.

## Enable cookies

1.	Select **Start**, > **All apps**, > **Windows accessories**. Right-click **Internet Explorer** > **More** > **Run as an administrator**.
2.	If you are prompted, select **Use recommended security**, and then select **OK**.
3.	In Internet Explorer, select **Tools** (the gear icon), > **Internet Options** > **Privacy** > **Advanced**.
4.	Select **Advanced**. Make sure that both **Accept** check boxes are selected, and then select **OK** and **OK** again.
5.	Close Internet Explorer, and restart PowerShell ISE as an administrator.

## Install the latest version of Azure PowerShell

1.	Sign in to the Azure Stack POC computer as **AzureStack/administrator**.
2.	Use the remote desktop connection to sign in to the ClientVM.AzureStack.local virtual machine as an administrator.
3.	Open **Control Panel** and select **Uninstall a program**. 
4.  Right-click on **Microsoft Azure PowerShell - November 2015** and select **Uninstall**.
5.	After uninstall finishes,  reboot the ClientVM.AzureStack.local virtual machine
6.	Download and install the latest [Azure PowerShell](http://aka.ms/azstackpsh).


## SQL Server

By default, the Azure Stack Web Apps installer is set to use the SQL Server that is installed along with the Azure Stack SQL Resource Provider. When you install the SQL Server Resource Provider (SQL RP) ensure you take note of the database administrator username and password. You need both when you install Azure Stack Web Apps.
Note: You will also have the option to deploy and use another server to run SQL Server. You can choose the SQL Server instance to use when you complete the options in the Azure Stack Web Apps installer.
