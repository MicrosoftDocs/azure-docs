---
title: 'Azure ExpressRoute: Configure ExpressRoute Direct'
description: Learn how to use Azure PowerShell to configure Azure ExpressRoute Direct to connect directly to the Microsoft global network.
services: expressroute
author: duongau
ms.service: expressroute
ms.custom:
  - devx-track-azurepowershell
  - ignite-2023
ms.topic: how-to
ms.date: 11/15/2023
ms.author: duau
---

# How to configure ExpressRoute Direct

ExpressRoute Direct gives you the ability to directly connect to Microsoft's global network through peering locations strategically distributed across the world. For more information, see [About ExpressRoute Direct](expressroute-erdirect-about.md).

## Before you begin

Before using ExpressRoute Direct, you must first enroll your subscription. To enroll, run the following command using Azure PowerShell:
1.  Sign in to Azure and select the subscription you wish to enroll.

    ```azurepowershell-interactive
    Connect-AzAccount 

    Select-AzSubscription -Subscription "<SubscriptionID or SubscriptionName>"
    ```

2. Register your subscription using the following command:
    ```azurepowershell-interactive
    Register-AzProviderFeature -FeatureName AllowExpressRoutePorts -ProviderNamespace Microsoft.Network
    ```

Once enrolled, verify the **Microsoft.Network** resource provider is registered to your subscription. Registering a resource provider configures your subscription to work with the resource provider.

## <a name="resources"></a>Create the resource

1. Sign in to Azure and select the subscription. The ExpressRoute Direct resource and ExpressRoute circuits must be in the same subscription.

   ```powershell
   Connect-AzAccount 

   Select-AzSubscription -Subscription "<SubscriptionID or SubscriptionName>"
   ```
   
2. Re-register your subscription to Microsoft.Network to access the expressrouteportslocation and expressrouteport APIs.

   ```powershell
   Register-AzResourceProvider -ProviderNameSpace "Microsoft.Network"
   ```   
3. List all locations where ExpressRoute Direct is supported.
  
   ```powershell
   Get-AzExpressRoutePortsLocation | format-list
   ```

   **Example output**
  
   ```powershell
   Name                : Equinix-Ashburn-DC2
   Id                  : /subscriptions/<subscriptionID>/providers/Microsoft.Network/expressRoutePortsLocations/Equinix-Ashburn-D
                        C2
   ProvisioningState   : Succeeded
   Address             : 21715 Filigree Court, DC2, Building F, Ashburn, VA 20147
   Contact             : support@equinix.com
   AvailableBandwidths : []

   Name                : Equinix-Dallas-DA3
   Id                  : /subscriptions/<subscriptionID>/providers/Microsoft.Network/expressRoutePortsLocations/Equinix-Dallas-DA
                        3
   ProvisioningState   : Succeeded
   Address             : 1950 N. Stemmons Freeway, Suite 1039A, DA3, Dallas, TX 75207
   Contact             : support@equinix.com
   AvailableBandwidths : []

   Name                : Equinix-San-Jose-SV1
   Id                  : /subscriptions/<subscriptionID>/providers/Microsoft.Network/expressRoutePortsLocations/Equinix-San-Jose-
                        SV1
   ProvisioningState   : Succeeded
   Address             : 11 Great Oaks Blvd, SV1, San Jose, CA 95119
   Contact             : support@equinix.com
   AvailableBandwidths : []
   ```
4. Determine if a location listed in the previous step has available bandwidth.

   ```powershell
   Get-AzExpressRoutePortsLocation -LocationName "Equinix-San-Jose-SV1" | format-list
   ```

   **Example output**

   ```powershell
   Name                : Equinix-San-Jose-SV1
   Id                  : /subscriptions/<subscriptionID>/providers/Microsoft.Network/expressRoutePortsLocations/Equinix-San-Jose-
                        SV1
   ProvisioningState   : Succeeded
   Address             : 11 Great Oaks Blvd, SV1, San Jose, CA 95119
   Contact             : support@equinix.com
   AvailableBandwidths : [
                          {
                            "OfferName": "100 Gbps",
                            "ValueInGbps": 100
                          }
                        ]
   ```
   > [!NOTE]
   > If bandwidth is unavailable in the target location, open a [support request in the Azure Portal](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview) and select the ExpressRoute Direct Support Topic. 
   >
5. Create an ExpressRoute Direct resource based on the location in the previous step.

   ExpressRoute Direct supports both QinQ and Dot1Q encapsulation. If QinQ is selected, each ExpressRoute circuit is dynamically assigned an S-Tag and is unique throughout the ExpressRoute Direct resource. Each C-Tag on the circuit must be unique on the circuit, but not across the ExpressRoute Direct.  

   If Dot1Q encapsulation is selected, you must manage uniqueness of the C-Tag (VLAN) across the entire ExpressRoute Direct resource.  

   > [!IMPORTANT]
   > ExpressRoute Direct can only be one encapsulation type. Encapsulation cannot be changed after ExpressRoute Direct creation.
   > 
 
   ```powershell 
   $ERDirect = New-AzExpressRoutePort -Name $Name -ResourceGroupName $ResourceGroupName -PeeringLocation $PeeringLocationName -BandwidthInGbps 100.0 -Encapsulation QinQ | Dot1Q -Location $AzureRegion
   ```

   > [!NOTE]
   > The Encapsulation attribute could also be set to Dot1Q. 
   >

   **Example output:**

   ```powershell
   Name                       : Contoso-Direct
   ResourceGroupName          : Contoso-Direct-rg
   Location                   : westcentralus
   Id                         : /subscriptions/<subscriptionID>/resourceGroups/Contoso-Direct-rg/providers/Microsoft.Network/exp
                               ressRoutePorts/Contoso-Direct
   Etag                       : W/"<etagnumber> "
   ResourceGuid               : <number>
   ProvisioningState          : Succeeded
   PeeringLocation            : Equinix-Seattle-SE2
   BandwidthInGbps            : 100
   ProvisionedBandwidthInGbps : 0
   Encapsulation              : QinQ
   Mtu                        : 1500
   EtherType                  : 0x8100
   AllocationDate             : Saturday, September 1, 2018
   Links                      : [
                                 {
                                   "Name": "link1",
                                   "Etag": "W/\"<etagnumber>\"",
                                   "Id": "/subscriptions/<subscriptionID>/resourceGroups/Contoso-Direct-rg/providers/Microsoft.
                               Network/expressRoutePorts/Contoso-Direct/links/link1",
                                   "RouterName": "tst-09xgmr-cis-1",
                                   "InterfaceName": "HundredGigE2/2/2",
                                   "PatchPanelId": "PPID",
                                   "RackId": "RackID",
                                   "ConnectorType": "SC",
                                   "AdminState": "Disabled",
                                   "ProvisioningState": "Succeeded"
                                 },
                                 {
                                   "Name": "link2",
                                   "Etag": "W/\"<etagnumber>\"",
                                   "Id": "/subscriptions/<subscriptionID>/resourceGroups/Contoso-Direct-rg/providers/Microsoft.
                               Network/expressRoutePorts/Contoso-Direct/links/link2",
                                   "RouterName": "tst-09xgmr-cis-2",
                                   "InterfaceName": "HundredGigE2/2/2",
                                   "PatchPanelId": "PPID",
                                   "RackId": "RackID",
                                   "ConnectorType": "SC",
                                   "AdminState": "Disabled",
                                   "ProvisioningState": "Succeeded"
                                 }
                               ]
   Circuits                   : []
   ```

## <a name="authorization"></a>Generate the Letter of Authorization (LOA)

Reference the recently created ExpressRoute Direct resource, input a customer name to write the LOA to and (optionally) define a file location to store the document. If a file path isn't referenced, the document downloads to the current directory.

### Azure PowerShell

  ```powershell 
   New-AzExpressRoutePortLOA -ExpressRoutePort $ERDirect -CustomerName TestCustomerName -Destination "C:\Users\SampleUser\Downloads" 
   ```
 **Example output**

   ```powershell
   Written Letter of Authorization To: C:\Users\SampleUser\Downloads\LOA.pdf
   ```

### Cloud Shell

1.  Replace the `<USERNAME>` with the username displayed in the prompt, then run the command to generate the Letter of Authorization. Use the exact path define in the command.

    ```azurepowershell-interactive
    New-AzExpressRoutePortLOA -ExpressRoutePort $ERDirect -CustomerName TestCustomerName -Destination /home/USERNAME/loa.pdf
    ```

1. Select the **Upload/Download** button and then select **Download**. Select the `loa.pdf` file and select Download.

    :::image type="content" source="./media/expressroute-howto-erdirect/download.png" alt-text="Screenshot of download button from Azure Cloud Shell.":::

## <a name="state"></a>Change Admin State of links
   
This process should be used to conduct a Layer 1 test, ensuring that each cross-connection is properly patched into each router for primary and secondary.
1. Get ExpressRoute Direct details.

   ```powershell
   $ERDirect = Get-AzExpressRoutePort -Name $Name -ResourceGroupName $ResourceGroupName
   ```
2. Set Link to Enabled. Repeat this step to set each link to enabled.

   Links[0] is the primary port and Links[1] is the secondary port.

   ```powershell
   $ERDirect.Links[0].AdminState = "Enabled"
   Set-AzExpressRoutePort -ExpressRoutePort $ERDirect
   $ERDirect = Get-AzExpressRoutePort -Name $Name -ResourceGroupName $ResourceGroupName
   $ERDirect.Links[1].AdminState = "Enabled"
   Set-AzExpressRoutePort -ExpressRoutePort $ERDirect
   ```
   **Example output:**

   ```powershell
   Name                       : Contoso-Direct
   ResourceGroupName          : Contoso-Direct-rg
   Location                   : westcentralus
   Id                         : /subscriptions/<number>/resourceGroups/Contoso-Direct-rg/providers/Microsoft.Network/exp
                             ressRoutePorts/Contoso-Direct
   Etag                       : W/"<etagnumber> "
   ResourceGuid               : <number>
   ProvisioningState          : Succeeded
   PeeringLocation            : Equinix-Seattle-SE2
   BandwidthInGbps            : 100
   ProvisionedBandwidthInGbps : 0
   Encapsulation              : QinQ
   Mtu                        : 1500
   EtherType                  : 0x8100
   AllocationDate             : Saturday, September 1, 2018
   Links                      : [
                               {
                                 "Name": "link1",
                                 "Etag": "W/\"<etagnumber>\"",
                                 "Id": "/subscriptions/<subscriptionID>/resourceGroups/Contoso-Direct-rg/providers/Microsoft.
                             Network/expressRoutePorts/Contoso-Direct/links/link1",
                                 "RouterName": "tst-09xgmr-cis-1",
                                 "InterfaceName": "HundredGigE2/2/2",
                                 "PatchPanelId": "PPID",
                                 "RackId": "RackID",
                                 "ConnectorType": "SC",
                                 "AdminState": "Enabled",
                                 "ProvisioningState": "Succeeded"
                               },
                               {
                                 "Name": "link2",
                                 "Etag": "W/\"<etagnumber>\"",
                                 "Id": "/subscriptions/<subscriptionID>/resourceGroups/Contoso-Direct-rg/providers/Microsoft.
                             Network/expressRoutePorts/Contoso-Direct/links/link2",
                                 "RouterName": "tst-09xgmr-cis-2",
                                 "InterfaceName": "HundredGigE2/2/2",
                                 "PatchPanelId": "PPID",
                                 "RackId": "RackID",
                                 "ConnectorType": "SC",
                                 "AdminState": "Enabled",
                                 "ProvisioningState": "Succeeded"
                               }
                             ]
   Circuits                   : []
   ```

   Use the same procedure with `AdminState = "Disabled"` to turn down the ports.

## <a name="circuit"></a>Create a circuit

By default, you can create 10 circuits in the subscription where the ExpressRoute Direct resource is. You can increase this limit through a support request. You're responsible for tracking both Provisioned and Utilized Bandwidth. Provisioned bandwidth is the sum of bandwidth of all circuits on the ExpressRoute Direct resource and utilized bandwidth is the physical usage of the underlying physical interfaces.

There are more circuit bandwidths that can be utilized on ExpressRoute Direct port to support only scenarios outlined previously. These bandwidths are 40 Gbps and 100 Gbps.

**SkuTier** can be Local, Standard, or Premium.

**SkuFamily** can only be **MeteredData** at creation. To use **Unlimited** data, you'll need to update the *SkuFamily* after creation.

> [!NOTE]
> Once you change to **Unlimited** data, you won't be able to change it back without recreating the ExpressRoute circuit.

Create a circuit on the ExpressRoute Direct resource.

  ```powershell
  New-AzExpressRouteCircuit -Name $Name -ResourceGroupName $ResourceGroupName -ExpressRoutePort $ERDirect -BandwidthinGbps 100.0  -Location $AzureRegion -SkuTier Premium -SkuFamily MeteredData 
  ```

  Other bandwidths include: 5.0, 10.0, and 40.0

  **Example output:**

  ```powershell
  Name                             : ExpressRoute-Direct-ckt
  ResourceGroupName                : Contoso-Direct-rg
  Location                         : westcentralus
  Id                               : /subscriptions/<subscriptionID>/resourceGroups/Contoso-Direct-rg/providers/Microsoft.Netwo
                                   rk/expressRouteCircuits/ExpressRoute-Direct-ckt
  Etag                             : W/"<etagnumber>"
  ProvisioningState                : Succeeded
  Sku                              : {
                                     "Name": "Premium_MeteredData",
                                     "Tier": "Premium",
                                     "Family": "MeteredData"
                                   }
  CircuitProvisioningState         : Enabled
  ServiceProviderProvisioningState : Provisioned
  ServiceProviderNotes             : 
    ServiceProviderProperties        : null
  ExpressRoutePort                 : {
                                     "Id": "/subscriptions/<subscriptionID>n/resourceGroups/Contoso-Direct-rg/providers/Micros
                                   oft.Network/expressRoutePorts/Contoso-Direct"
                                   }
  BandwidthInGbps                  : 10
  Stag                             : 2
  ServiceKey                       : <number>
  Peerings                         : []
  Authorizations                   : []
  AllowClassicOperations           : False
  GatewayManagerEtag     
  ```
## Delete the resource
Prior to deleting the ExpressRoute Direct resource, you first need to delete any ExpressRoute circuits created on the ExpressRoute Direct port pair.
You can delete the ExpressRoute Direct resource by running the following command:
 ```powershell
   Remove-azexpressrouteport -Name $Name -Resourcegroupname -$ResourceGroupName
   ```

### Enable ExpressRoute Direct and circuits in different subscriptions

ExpressRoute Direct and ExpressRoute circuit(s) in different subscriptions or Microsoft Entra tenants. You create an authorization for your ExpressRoute Direct resource, and redeem the authorization to create an ExpressRoute circuit in a different subscription or Microsoft Entra tenant.

1. Sign in to Azure and select the ExpressRoute Direct subscription. 

   ```powershell
   Connect-AzAccount 

   Select-AzSubscription -Subscription "<SubscriptionID or SubscriptionName>"
   ```

1. . Get ExpressRoute Direct details 

   ```powershell
   Get-AzExpressRoutePort 

   $ERPort = Get-AzExpressRoutePort -Name $Name -ResourceGroupName $ResourceGroupName
   ```

1. Create the ExpressRoute Direct authorization by running the following commands in PowerShell:

    ```powershell
    Add-AzExpressRoutePortAuthorization -Name $AuthName -ExpressRoutePort $ERPort
    ```
   
   Sample output:
    ```powershell
        Name                   : ERDirectAuthorization_1
        Id                     : /subscriptions/72882272-d67e-4aec-af0b-4ab6e110ee46/resourceGroups/erdirect-   rg/providers/Microsoft.Network/expressRoutePorts/erdirect/authorizations/ERDirectAuthorization_1
        Etag                   : W/"24cac874-dfb4-4931-9447-28e67edd5155"
        AuthorizationKey       : 6e1fc16a-0777-4cdc-a206-108f2f0f67e8
        AuthorizationUseStatus : Available
        ProvisioningState      : Succeeded
        CircuitResourceUri     :
    ```

1. Verify the authorization was created successfully and store ExpressRoute Direct authorization into a variable:

    ```powershell
    $ERDirectAuthorization = Get-AzExpressRoutePortAuthorization -ExpressRoutePortObject $ERPort -Name $AuthName
    $ERDirectAuthorization  
    ```
    
    Sample output:
      ```powershell
        Name                   : ERDirectAuthorization_1
        Id                     : /subscriptions/72882272-d67e-4aec-af0b-4ab6e110ee46/resourceGroups/erdirect-                       rg/providers/Microsoft.Network/expressRoutePorts/erdirect/authorizations/ERDirectAuthorization_1
        Etag                   : W/"24cac874-dfb4-4931-9447-28e67edd5155"
        AuthorizationKey       : 6e1fc16a-0777-4cdc-a206-108f2f0f67e8
        AuthorizationUseStatus : Available
        ProvisioningState      : Succeeded
        CircuitResourceUri     :on  
    ```

1. Redeem the authorization to create the ExpressRoute Direct circuit in different subscription or Microsoft Entra tenant with the following command:

    ```powershell
    Select-AzSubscription -Subscription "<SubscriptionID or SubscriptionName>"
    
    New-AzExpressRouteCircuit -Name $Name -ResourceGroupName $RGName -Location $Location -SkuTier $SkuTier -SkuFamily $SkuFamily -BandwidthInGbps $BandwidthInGbps -ExpressRoutePort $ERPort -AuthorizationKey $ERDirectAuthorization.AuthorizationKey
    ```
## Next steps

For more information about ExpressRoute Direct, see the [ExpressRoute Direct overview](expressroute-erdirect-about.md).
