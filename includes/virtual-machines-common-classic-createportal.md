

A *custom* virtual machine simply means a virtual machine that you create using a **Featured app** from the **Marketplace** because it does much of the work for you. Yet, you can still make configuration choices that include the following items:

* Connecting the virtual machine to a virtual network.
* Installing the Azure Virtual Machine Agent and Azure Virtual Machine Extensions, such as for antimalware.
* Adding the virtual machine to existing cloud services.
* Adding the virtual machine to an existing Storage account.
* Adding the virtual machine to an availability set.

<!--
> [!IMPORTANT]
> If you want your virtual machine to use a virtual network so you can connect to it directly by host name or set up cross-premises connections, make sure that you specify the virtual network when you create the virtual machine. A virtual machine can be configured to join a virtual network only when you create the virtual machine. For details on virtual networks, see [Azure Virtual Network overview](../articles/virtual-network/virtual-networks-overview.md).
>
>
 -->

> [!IMPORTANT]
> If you want your virtual machine to use a virtual network, make sure that you specify the virtual network when you create the virtual machine.

> * Two benefits of using a virtual network are connecting directly to the virtual machine and to set up cross-premises connections.

> * A virtual machine can be configured to join a virtual network only when you create the virtual machine. For details on virtual networks, see [Azure Virtual Network overview](../articles/virtual-network/virtual-networks-overview.md).
>
>

## To create the virtual machine
