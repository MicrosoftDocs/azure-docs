---
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 06/13/2022
 ms.author: cherylmc
---
You can verify that your connection succeeded by using the 'Get-AzureVNetConnection' cmdlet.

1. Use the following cmdlet example, configuring the values to match your own. The name of the virtual network must be in quotes if it contains spaces.

   ```azurepowershell
   Get-AzureVNetConnection "Group ClassicRG TestVNet1"
   ```
1. After the cmdlet has finished, view the values. In the example below, the Connectivity State shows as 'Connected' and you can see ingress and egress bytes.

   ```output
   ConnectivityState         : Connected
   EgressBytesTransferred    : 181664
   IngressBytesTransferred   : 182080
   LastConnectionEstablished : 10/19/22020 12:40:54 AM
   LastEventID               : 24401
   LastEventMessage          : The connectivity state for the local network site 'F7F7BFC7_SiteVNet4' changed from Connecting to
                               Connected.
   LastEventTimeStamp        : 10/19/2020 12:40:54 AM
   LocalNetworkSiteName      : F7F7BFC7_SiteVNet4
   ```
