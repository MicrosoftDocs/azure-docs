---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 10/17/2018
 ms.author: cherylmc
 ms.custom: include file
---
You can verify that your connection succeeded by using the 'Get-AzureVNetConnection' cmdlet.

1. Use the following cmdlet example, configuring the values to match your own. The name of the virtual network must be in quotes if it contains spaces.

   ```azurepowershell
   Get-AzureVNetConnection "Group ClassicRG ClassicVNet"
   ```
2. After the cmdlet has finished, view the values. In the example below, the Connectivity State shows as 'Connected' and you can see ingress and egress bytes.

		ConnectivityState         : Connected
		EgressBytesTransferred    : 181664
		IngressBytesTransferred   : 182080
		LastConnectionEstablished : 1/7/2016 12:40:54 AM
		LastEventID               : 24401
		LastEventMessage          : The connectivity state for the local network site 'RMVNetLocal' changed from Connecting to
		                            Connected.
		LastEventTimeStamp        : 1/7/2016 12:40:54 AM
		LocalNetworkSiteName      : RMVNetLocal