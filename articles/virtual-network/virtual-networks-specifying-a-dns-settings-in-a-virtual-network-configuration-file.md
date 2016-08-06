<properties 
   pageTitle="Specifying DNS Settings in a virtual network configuration file | Microsoft Azure"
   description="How to change DNS server settings in a virtual network using a virtual network configuration file in the classic deployment model"
   services="virtual-network"
   documentationCenter="na"
   authors="jimdial"
   manager="carmonm"
   editor="tysonn" 
   tags="azure-service-management" />
<tags 
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="02/23/2016"
   ms.author="jdial" /> 


# Specifying DNS settings in a virtual network configuration file

A network configuration file has two elements that you can use to specify Domain Name System (DNS) settings: **DnsServers** and **DnsServerRef**. You can add a list of DNS servers by specifying their IP addresses and reference names to the **DnsServers** element. You can then use a **DnsServerRef** element to specify which DNS server entries from the DnsServers element are used for different network sites within your virtual network.

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/azure-arm-classic-important-include.md)] This article covers the classic deployment model.

The network configuration file may contain the following elements. The title of each element is linked to a page that provides additional information about the element value settings.

>[AZURE.IMPORTANT] For information about how to configure the network configuration file, see [Configure a Virtual Network Using a Network Configuration File](virtual-networks-using-network-configuration-file.md). For information about each element contained in the network configuration file, see [Azure Virtual Network Configuration Schema](https://msdn.microsoft.com/library/azure/jj157100.aspx).

[Dns Element](http://go.microsoft.com/fwlink/?LinkId=248093)

    <Dns>
      <DnsServers>
        <DnsServer name="ID1" IPAddress="IPAddress1" />
        <DnsServer name="ID2" IPAddress="IPAddress2" />
        <DnsServer name="ID3" IPAddress="IPAddress3" />
      </DnsServers>
    </Dns>

>[AZURE.WARNING] The **name** attribute in the **DnsServer** element is used only as a reference for the **DnsServerRef** element. It does not represent the host name for the DNS server. Each **DnsServer** attribute value must be unique across the entire Microsoft Azure subscription

[Virtual Network Sites Element](http://go.microsoft.com/fwlink/?LinkId=248093)

	<DnsServersRef>
	  <DnsServerRef name="ID1" />
	  <DnsServerRef name="ID2" />
	  <DnsServerRef name="ID3" />
	</DnsServersRef>

>[AZURE.NOTE] In order to specify this setting for the Virtual Network Sites element, it must be previously defined in the DNS element. The DnsServerRef *name* in the Virtual Network Sites element must refer to a name value specified in the DNS element for DnsServer *name*.

## Next steps

- Understand the [Azure Virtual Network Configuration Schema](http://go.microsoft.com/fwlink/?LinkId=248093).
- Understand the [Azure Service Configuration Schema](https://msdn.microsoft.com/library/windowsazure/ee758710).
- [Configure a virtual network using Network configuration files](virtual-networks-using-network-configuration-file.md).
