---
author: cherylmc
ms.author: cherylmc
ms.date: 09/08/2023
ms.service: bastion
ms.topic: include

---

| Feature | Developer SKU |Basic SKU | Standard SKU |
|---|---|---|---|
| Connect to target VMs in same virtual network | Yes | Yes | Yes |
| Connect to target VMs in peered virtual networks | No| [Yes](../articles/bastion/vnet-peering.md) |  [Yes](../articles/bastion/vnet-peering.md)|
| Access Linux VM Private Keys in Azure Key Vault (AKV) | No| Yes | Yes |
| Connect to Linux VM using SSH | No| [Yes](../articles/bastion/bastion-connect-vm-ssh-linux.md) | [Yes](../articles/bastion/bastion-connect-vm-ssh-linux.md)|
| Connect to Windows VM using RDP | No| [Yes](../articles/bastion/bastion-connect-vm-rdp-windows.md) | [Yes](../articles/bastion/bastion-connect-vm-rdp-windows.md)|
| Kerberos authentication | No| [Yes](../articles/bastion/kerberos-authentication-portal.md) |[Yes](../articles/bastion/kerberos-authentication-portal.md)|
| VM audio output | No| Yes | Yes |
| Shareable link | No| No | [Yes](../articles/bastion/shareable-link.md) |
| Connect to VMs using a native client | No| No | [Yes](../articles/bastion/native-client.md)|
| Connect to VMs via IP address | No| No | [Yes](../articles/bastion/connect-ip-address.md)
| Host scaling | No|  No  | [Yes](../articles/bastion/configuration-settings.md#instance) |
| Specify custom inbound port | No| No | [Yes](../articles/bastion/configuration-settings.md#ports)|
| Connect to Linux VM using RDP | No|  No | Yes |
| Connect to Windows VM using SSH | No|  No  | [Yes](../articles/bastion/bastion-connect-vm-ssh-windows.md)|
| Upload or download files | No|  No  | [Yes](../articles/bastion/vm-upload-download-native.md)|
| Disable copy/paste (web-based clients) | No|  No  | Yes |
