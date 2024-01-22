---
title: Installing certificates on the Azure Linux Container Host for AKS
description: How to install certificates on the Azure Linux Container Host for AKS.
author: htaubenfeld
ms.author: htaubenfeld
ms.editor: schaffererin
ms.service: microsoft-linux
ms.topic: how-to
ms.date: 06/30/2023
ms.custom: template-how-to-pattern
---

# Installing certificates on the Azure Linux Container host for AKS

By default, the Azure Linux Container Host for AKS image has a minimal set of root certs to trust certain Microsoft resources, such as packages.microsoft.com. All Microsoft certificates aren't automatically included in our image, which is consistent with the least-privilege principle and gives you the flexibility to opt in to just the root certificates you need and to customize your image.

The `ca-certificates-base` is preinstalled in the container host image and contains certificates from a small set of Microsoft-owned CAs. It consists of certificates from Microsoft's root and intermediate CAs. This package allows your container host to trust a minimal set of servers, all of which were verified and had their certificates issued by Microsoft.

The `ca-certificates` cover the root CAs trust by Microsoft through the [Microsoft Trusted Root Program](/security/trusted-root/participants-list).

The directory `/etc/pki/ca-trust/source/` contains the CA certificates and trust settings in the PEM file format. The trust settings found here are interpreted with a high priority, higher than the ones found in `/usr/share/pki/ca-trust-source/`.

For more information on the Azure Linux Container Host for AKS image certifications, see the [GitHub documentation](https://github.com/microsoft/CBL-Mariner/blob/2.0/toolkit/docs/security/ca-certificates.md).

## Add a certificate in the PEM or DER file format

You can add individual or multiple certificates to your Azure Linux Container Host for AKS image. To add a certificate in the simple PEM or DER file format to the list of CAs trusted on the system, follow these steps:

1. Save your certificate under `etc/pki/ca-trust/source/anchors/`.
1. Run `update-ca-trust` to consolidate CA certificates and associated trust.

## Add a certificate in the extended BEGIN TRUSTED file format

If your certificate is in the extended BEGIN TRUSTED file format (which may contain distrust trust flags or trust flags for usages other than TLS), then follow these steps:

1. Save your certificate under `etc/pki/ca-trust/source/`.
2. Run `update-ca-trust` to consolidate CA certificates and associated trust.

## Next steps

- Learn more about [Azure Linux Container Host core concepts](./concepts-core.md).
- Follow our tutorial to [Deploy, manage, and update applications](./tutorial-azure-linux-create-cluster.md).
- Get started by [Creating an Azure Linux Container Host for AKS cluster using Azure CLI](./quickstart-azure-cli.md).
