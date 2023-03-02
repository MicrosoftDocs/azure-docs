---
title: SMB over QUIC with Azure Automanage machine best practices
description: Overview of managing SMB over QUIC with Azure Automanage machine best practices 
author: daniellee-microsoft
ms.service: automanage
ms.workload: infrastructure
ms.topic: conceptual
ms.date: 11/1/2021
ms.author: jol 
---

# SMB over QUIC with Automanage machine best practices

SMB over QUIC offers an "SMB VPN" for telecommuters, mobile device users, and branch offices, providing secure, reliable connectivity to edge file servers over untrusted networks like the Internet. To learn more about SMB over QUIC and how to configure SMB over QUIC, see [SMB over QUIC](/windows-server/storage/file-server/smb-over-quic).

Additionally, SMB over QUIC is integrated with Automanage machine best practices to help make SMB over QUIC management easier. QUIC uses certificates to provide its encryption and organizations often struggle to maintain complex public key infrastructures. Automanage machine best practices ensures that certificates do not expire without warning and that SMB over QUIC stays enabled for maximum continuity of service.

## How to get started

> [!NOTE]
> For prerequisites on using Automanage machine best practices, see [Enable on VMs in the Azure portal](quick-create-virtual-machines-portal.md).

> [!NOTE]
> During the preview phase, you can get started in the Azure portal using [this link](https://aka.ms/automanage-ws-portal-preview).

## Enable Automanage best practices when creating a new VM

To enable Automanage machine best practices for SMB over QUIC on a VM, follow these steps:

1. Sign in to the Azure portal using the preview link above.

2. Create an Azure VM with the _Windows Server 2022 Datacenter: Azure Edition_ image to get the Automanage for Windows Server capabilities, including SMB over QUIC.

3. In the **Management** tab, for the Azure Automanage Environment setting, either choose **Dev/Test** or **Production** to enable Automanage machine best practices.

    :::image type="content" source="media\automanage-smb-over-quic\create-vm-automanage-setting.png" alt-text="Enable Automanage when creating a VM.":::

4. Configure any additional settings as needed and create the VM.

## Enable Automanage best practices on existing VMs

You can also enable Automanage machine best practices for a VM you have previously created. Note that the VM must have been created with the _Windows Server 2022 Datacenter: Azure Edition_ image to get the Automanage for Windows Server capabilities, including SMB over QUIC.

1. Navigate to the VM you have previously created.
2. Select the Automanage menu, choose either the **Dev/Test** or **Production** environment, then click **Enable**.

    :::image type="content" source="media\automanage-smb-over-quic\vm-enable-automanage.png" alt-text="Enable Automanage for an existing VM.":::

## Viewing Automanage best practice compliance

It may take a couple of hours for machine best practices to be configured and then the best practice policies to be assigned and assessed on the VM. Once it is complete, you will see the SMB over QUIC policies and their status as shown below. These policies will continuously be assessed automatically to ensure SMB over QUIC is configured properly and that the certificates used are valid and healthy.

:::image type="content" source="media\automanage-smb-over-quic\vm-automanage-configured.png" alt-text="View SMB over QUIC policies for a VM.":::

## Next steps

> [!div class="nextstepaction"]
> [Learn more about SMB over QUIC](/windows-server/storage/file-server/smb-over-quic)