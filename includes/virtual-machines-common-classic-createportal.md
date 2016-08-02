

A *custom* virtual machine simply means a virtual machine that you create using the **From Gallery** option because it gives you more configuration choices than the **Quick Create** option. These choices include:

- Connecting the virtual machine to a virtual network.
- Installing the Azure Virtual Machine Agent and Azure Virtual Machine Extensions, such as for antimalware.
- Adding the virtual machine to existing cloud services.
- Adding the virtual machine to an existing Storage account.
- Adding the virtual machine to an availability set.

> [AZURE.IMPORTANT] If you want your virtual machine to use a virtual network so you can connect to it directly by host name or set up cross-premises connections, make sure that you specify the virtual network when you create the virtual machine. A virtual machine can be configured to join a virtual network only when you create the virtual machine. For details on virtual networks, see [Azure Virtual Network overview](../articles/virtual-network/virtual-networks-overview.md).


## To create the virtual machine

