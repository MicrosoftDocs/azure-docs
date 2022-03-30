---
title: 'About VM connections and features'
titleSuffix: Azure Bastion
description: Learn about VM connections and features when connecting using Azure Bastion.
author: cherylmc
ms.service: bastion
ms.topic: conceptual
ms.date: 03/16/2022
ms.author: cherylmc

---

# About VM connections and features

The sections in this article show you various features and settings that are available when you connect to a VM using Azure Bastion.

## <a name="connect"></a>Connect to a VM

You can use a variety of different methods to connect to a target VM. Some connection types require Bastion to be configured with the Standard SKU. Use the following articles to connect.

[!INCLUDE [Connect articles list](../../includes/bastion-vm-connect-article-list.md)]

## <a name="copy-paste"></a>Copy and paste

For browsers that support the advanced Clipboard API access, you can copy and paste text between your local device and the remote session in the same way you copy and paste between applications on your local device. For other browsers, you can use the Bastion clipboard access tool palette. Only text copy/paste is supported.

For steps and more information, see [Copy and paste - Windows VMs](bastion-vm-copy-paste.md).

## <a name="full-screen"></a>Full screen view

You can change to full screen view and back using your browser. For steps and more information, see [Change to full screen view](bastion-vm-full-screen.md).

## <a name="upload-download"></a>Upload or download files

Azure Bastion offers support for file transfer between your target VM and local computer using Bastion and a native RDP or native SSH client. It may also be possible to use certain third-party clients and tools to upload and download files.

For steps and more information, see [Upload or download files to a VM using a native client](vm-upload-download-native.md).

## <a name="audio"></a>Remote audio

[!INCLUDE [Enable VM audio output](../../includes/bastion-vm-audio.md)]

## <a name="faq"></a>FAQ

For FAQs, see [Bastion FAQ - VM connectons and features](bastion-faq.md#vm).

## Next steps

[Quickstart: Deploy Azure Bastion with default settings](quickstart-host-portal.md)
