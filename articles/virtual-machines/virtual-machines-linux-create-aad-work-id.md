<properties
   pageTitle="Create a work or school identity in AAD | Microsoft Azure"
   description="Learn how to create a work or school identity in Azure Active Directory to use with your Linux virtual machines."
   services="virtual-machines-linux"
   documentationCenter=""
   authors="squillace"
   manager="timlt"
   editor=""
   tags="azure-service-management,azure-resource-manager"/>

<tags
   ms.service="virtual-machines-linux"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="infrastructure"
   ms.date="06/06/2016"
   ms.author="rasquill"/>

# Creating a Work or School identity in Azure Active Directory to use with Linux VMs

If you created a personal Azure account or have a personal MSDN subscription and created the Azure account to take advantage of the MSDN Azure credits -- you used a *Microsoft account* identity to create it. Many great features of Azure -- [resource group templates](../resource-group-overview.md) is one example -- require a work or school account (an identity managed by Azure Active Directory) to work. You can follow the instructions below to create a new work or school account because fortunately, one of the best things about your personal Azure account is that it comes with a default Azure Active Directory domain that you can use to create a new work or school account that you can use with Azure features that require it.

However, recent changes make it possible to manage your subscription with any type of Azure account using the `azure login` interactive login method described [here](../xplat-cli-connect.md). You can either use that mechanism, or you can follow the instructions that follow. You can also [create a work or school identity in Azure Active Directory to use with Windows VMs](virtual-machines-windows-create-aad-work-id.md).

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-both-include.md)]

[AZURE.INCLUDE [virtual-machines-common-create-aad-work-id](../../includes/virtual-machines-common-create-aad-work-id.md)]
