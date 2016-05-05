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
	ms.date="05/05/2016"
	ms.author="anwestg"/>
	
## Installation Prerequisites

To install Azure Stack Web Apps there are a few items that you will need.  Those are:

- A completed deployment of [Azure Stack Technical Preview 1](azure-stack-run-powershell-script.md)
- Enough space in your Azure Stack system to deploy a small deployment of Azure Stack Web Apps.  The space required is roughly 20GB of disk space.
- [A SQL Server](#SQL-Server).

NOTE: The following steps ALL take place on the Client VM.

## Before you Deploy Azure Stack Web Apps

To deploy a resource provider, you must run your PowerShell ISE as an administrator. For this reason, you need to allow cookies and JavaScript in the Internet Explorer profile you use to sign in to Azure Active Directory.

## Turn off Internet Explorer enhanced security

1.	Sign in to the Azure Stack proof-of-concept (POC) machine as **AzureStack/administrator**, and then open **Server Manager**.
2.	Turn off **IE Enhanced Security Configuration** for both admins and users.
3.	Sign in to the ClientVM.AzureStack.local virtual machine as an administrator, and then open **Server Manager**.
4.	Turn off **IE Enhanced Security Configuration** for both admins and users.

## Enable cookies

1.	Select **Start**, then **All apps**, and then **Windows accessories**. Right-click on **Internet Explorer**, and then select **More** and **Run as an administrator**.
2.	If you are prompted, select **Use recommended security**, and then **OK**.
3.	In Internet Explorer, select **Tools** (the gear icon), and then **Internet Options** and the **Privacy** tab.
4.	Select **Advanced**. Make sure that both **Accept** check boxes are selected, and then select **OK** and **OK** again.
5.	Close Internet Explorer and restart PowerShell ISE as an administrator.

## Install the latest version of Azure PowerShell

1.	Sign in to the Azure Stack POC machine as **AzureStack/administrator**.
2.	Use the remote desktop connection to sign in to the ClientVM.AzureStack.local virtual machine as an administrator.
3.	Open **Control Panel** and select **Uninstall a program**. Right-click on **Microsoft Azure PowerShell - November 2015** and select **Uninstall**.
4.	Once uninstalled reboot the ClientVM
5.	Download and install the latest [Azure PowerShell](http://aka.ms/azstackpsh).


## SQL server

By default, the Azure Stack Web Apps installer has defaults set to use the SQL Server that is installed along with the Azure Stack SQL RP. When you install the SQL Server Resource Provider (SQL RP) ensure you take note of the database administrator username and password. Both are needed when installing Azure Stack Web Apps.
Note: You will also have the option of deploying/leveraging another SQL Server. You can choose which SQL Server instance to use when completing the options in the Azure Stack Web Apps Installer.
