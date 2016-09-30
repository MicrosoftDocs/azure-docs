<properties
	pageTitle="Test Article | Microsoft Azure"
	description="Review detailed troubleshooting steps for remote desktop errors where you cannot to a Windows virtual machines in Azure"
	services="virtual-machines-windows"
	documentationCenter=""
	authors="iainfoulds"
	manager="timlt"
	editor=""
	tags="top-support-issue,azure-service-management,azure-resource-manager"
	keywords="cannot connect to remote desktop, troubleshoot remote desktop, remote desktop cannot connect, remote desktop errors, remote desktop troubleshooting, remote desktop problems
"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="support-article"
	ms.date="09/27/2016"
	ms.author="iainfou"/>

# Migration test article

This article provides detailed troubleshooting steps to diagnose and fix complex Remote Desktop errors for Windows-based Azure virtual machines.

> [AZURE.IMPORTANT] To eliminate the more common Remote Desktop errors, make sure to read [the basic troubleshooting article for Remote Desktop](virtual-machines-windows-troubleshoot-rdp-connection.md) before proceeding.

You may encounter a Remote Desktop error message that does not resemble any of the specific error messages covered in [the basic Remote Desktop troubleshooting guide](virtual-machines-windows-troubleshoot-rdp-connection.md). Follow these steps to determine why the Remote Desktop (RDP) client is unable to connect to the RDP service on the Azure VM.

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-both-include.md)]

If you need more help at any point in this article, you can contact the Azure experts on [the MSDN Azure and the Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can also file an Azure support incident. Go to the [Azure Support site](https://azure.microsoft.com/support/options/) and click **Get Support**. For information about using Azure Support, read the [Microsoft Azure Support FAQ](https://azure.microsoft.com/support/faq/).
