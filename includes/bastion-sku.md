---
author: cherylmc
ms.author: cherylmc
ms.date: 03/14/2025
ms.service: azure-bastion
ms.topic: include

---

| Feature |Basic SKU | Standard SKU | Premium SKU | 
|---|---|---|---|
| Connect to target VMs in same virtual network | Yes | Yes | Yes |
| Connect to target VMs in peered virtual networks | [Yes](../articles/bastion/vnet-peering.md) |  [Yes](../articles/bastion/vnet-peering.md)|[Yes](../articles/bastion/vnet-peering.md) |
| Support for concurrent connections | Yes | Yes| Yes |
| Access Linux VM Private Keys in Azure Key Vault (AKV) | Yes | Yes | Yes |
| Connect to Linux VM using SSH | [Yes](../articles/bastion/bastion-connect-vm-ssh-linux.md) | [Yes](../articles/bastion/bastion-connect-vm-ssh-linux.md)|[Yes](../articles/bastion/bastion-connect-vm-ssh-linux.md) |
| Connect to Windows VM using RDP | [Yes](../articles/bastion/bastion-connect-vm-rdp-windows.md) | [Yes](../articles/bastion/bastion-connect-vm-rdp-windows.md)| [Yes](../articles/bastion/bastion-connect-vm-rdp-windows.md)|
| Connect to Linux VM using RDP | No | Yes | Yes |
| Connect to Windows VM using SSH | No  | [Yes](../articles/bastion/bastion-connect-vm-ssh-windows.md)|[Yes](../articles/bastion/bastion-connect-vm-ssh-windows.md)|
| Specify custom inbound port | No | [Yes](../articles/bastion/configuration-settings.md#ports)|[Yes](../articles/bastion/configuration-settings.md#ports)|
| Connect to VMs using Azure CLI | No | [Yes](../articles/bastion/native-client.md)|[Yes](../articles/bastion/native-client.md)|
| Host scaling | No  | [Yes](../articles/bastion/configuration-settings.md#instance) |[Yes](../articles/bastion/configuration-settings.md#instance) |
| Upload or download files | No  | [Yes](../articles/bastion/vm-upload-download-native.md)|[Yes](../articles/bastion/vm-upload-download-native.md)|
| Kerberos authentication | [Yes](../articles/bastion/kerberos-authentication-portal.md) |[Yes](../articles/bastion/kerberos-authentication-portal.md)|[Yes](../articles/bastion/kerberos-authentication-portal.md)|
| Shareable link | No | [Yes](../articles/bastion/shareable-link.md) | [Yes](../articles/bastion/shareable-link.md) |
| Connect to VMs via IP address | No | [Yes](../articles/bastion/connect-ip-address.md)|[Yes](../articles/bastion/connect-ip-address.md)|
| VM audio output | Yes | Yes | Yes |
| Disable copy/paste (web-based clients) | No  | Yes | Yes |
| Session recording | No | No | [Yes](../articles/bastion/session-recording.md) |
| Private-only deployment | No | No | [Yes](../articles/bastion/private-only-deployment.md) |