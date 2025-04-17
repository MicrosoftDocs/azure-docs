---

title: 'Azure ExpressRoute: Configure ExpressRoute Direct: CLI'
description: Learn how to use Azure CLI to configure Azure ExpressRoute Direct to connect directly to the Microsoft global network.
services: expressroute
author: duongau

ms.service: azure-expressroute
ms.topic: how-to
ms.date: 12/14/2020
ms.author: duau 
ms.custom: devx-track-azurecli
---

# Configure ExpressRoute Direct by using the Azure CLI

ExpressRoute Direct gives you the ability to directly connect to Microsoft's global network through peering locations strategically distributed across the world. For more information, see [About ExpressRoute Direct Connect](expressroute-erdirect-about.md).

## Before you begin

Before using ExpressRoute Direct, you must first enroll your subscription. Before using ExpressRoute Direct, you must first enroll your subscription. To enroll, please do the following via Azure PowerShell:
1.  Sign in to Azure and select the subscription you wish to enroll.

    ```azurepowershell-interactive
    Connect-AzAccount 

    Select-AzSubscription -Subscription "<SubscriptionID or SubscriptionName>"
    ```

2. Register your subscription for Public Preview using the following command:
    ```azurepowershell-interactive
    Register-AzProviderFeature -FeatureName AllowExpressRoutePorts -ProviderNamespace Microsoft.Network
    ```

Once enrolled, verify that the **Microsoft.Network** resource provider is registered to your subscription. Registering a resource provider configures your subscription to work with the resource provider.

## <a name="resources"></a>Create the resource

1. Sign in to Azure and select the subscription that contains ExpressRoute. The ExpressRoute Direct resource and your ExpressRoute circuits must be in the same subscription. In the Azure CLI, run the following commands:

   ```azurecli
   az login
   ```

   Check the subscriptions for the account: 

   ```azurecli
   az account list 
   ```

   Select the subscription for which you want to create an ExpressRoute circuit:

   ```azurecli
   az account set --subscription "<subscription ID>"
   ```

2. Re-register your subscription to Microsoft.Network to access the expressrouteportslocation and expressrouteport APIs

   ```azurecli
   az provider register --namespace Microsoft.Network
   ```
3. List all locations where ExpressRoute Direct is supported:
    
   ```azurecli
   az network express-route port location list
   ```

   **Example output**
  
   ```output
   [
   {
    "address": "Ashburn, VA",
    "availableBandwidths": [],
    "contact": "support@contoso.com",
    "id": "/subscriptions/<subscriptionID>/providers/Microsoft.Network/expressRoutePortsLocations/Equinix-Ashburn-DC2",
    "location": null,
    "name": "Equinix-Ashburn-DC2",
    "provisioningState": "Succeeded",
    "tags": null,
    "type": "Microsoft.Network/expressRoutePortsLocations"
   },
   {
    "address": "Dallas, TX",
    "availableBandwidths": [],
    "contact": "support@contoso.com",
    "id": "/subscriptions/<subscriptionID>/providers/Microsoft.Network/expressRoutePortsLocations/Equinix-Dallas-DA3",
    "location": null,
    "name": "Equinix-Dallas-DA3",
    "provisioningState": "Succeeded",
    "tags": null,
    "type": "Microsoft.Network/expressRoutePortsLocations"
   },
   {
    "address": "New York, NY",
    "availableBandwidths": [],
    "contact": "support@contoso.com",
    "id": "/subscriptions/<subscriptionID>/providers/Microsoft.Network/expressRoutePortsLocations/Equinix-New-York-NY5",
    "location": null,
    "name": "Equinix-New-York-NY5",
    "provisioningState": "Succeeded",
    "tags": null,
    "type": "Microsoft.Network/expressRoutePortsLocations"
   },
   {
    "address": "San Jose, CA",
    "availableBandwidths": [],
    "contact": "support@contoso.com",
    "id": "/subscriptions/<subscriptionID>/providers/Microsoft.Network/expressRoutePortsLocations/Equinix-San-Jose-SV1",
    "location": null,
    "name": "Equinix-San-Jose-SV1",
    "provisioningState": "Succeeded",
    "tags": null,
    "type": "Microsoft.Network/expressRoutePortsLocations"
   },
   {
    "address": "Seattle, WA",
    "availableBandwidths": [],
    "contact": "support@contoso.com",
    "id": "/subscriptions/<subscriptionID>/providers/Microsoft.Network/expressRoutePortsLocations/Equinix-Seattle-SE2",
    "location": null,
    "name": "Equinix-Seattle-SE2",
    "provisioningState": "Succeeded",
    "tags": null,
    "type": "Microsoft.Network/expressRoutePortsLocations"
   }
   ]
   ```
4. Determine whether one of the locations listed in the preceding step has available bandwidth:

   ```azurecli
   az network express-route port location show -l "Equinix-Ashburn-DC2"
   ```

   **Example output**

   ```output
   {
   "address": "Ashburn, VA",
   "availableBandwidths": [
    {
      "offerName": "100 Gbps",
      "valueInGbps": 100
    }
   ],
   "contact": "support@contoso.com",
   "id": "/subscriptions/<subscriptionID>/providers/Microsoft.Network/expressRoutePortsLocations/Equinix-Ashburn-DC2",
   "location": null,
   "name": "Equinix-Ashburn-DC2",
   "provisioningState": "Succeeded",
   "tags": null,
   "type": "Microsoft.Network/expressRoutePortsLocations"
   }
   ```
5. Create an ExpressRoute Direct resource that's based on the location you chose in the preceding steps.

   ExpressRoute Direct supports both QinQ and Dot1Q encapsulation. If you select QinQ, each ExpressRoute circuit is dynamically assigned an S-Tag and is unique throughout the ExpressRoute Direct resource. Each C-Tag on the circuit must be unique on the circuit but not across the ExpressRoute Direct resource.  

   If you select Dot1Q encapsulation, you must manage uniqueness of the C-Tag (VLAN) across the entire ExpressRoute Direct resource.  

   > [!IMPORTANT]
   > ExpressRoute Direct can be only one encapsulation type. You can't change the encapsulation type after you create the ExpressRoute Direct resource.
   > 
 
   ```azurecli
   az network express-route port create -n $name -g $RGName --bandwidth 100 gbps  --encapsulation QinQ | Dot1Q --peering-location $PeeringLocationName -l $AzureRegion 
   ```

   > [!NOTE]
   > You also can set the **Encapsulation** attribute to **Dot1Q**. 
   >

   **Example output**

   ```output
   {
   "allocationDate": "Wednesday, October 17, 2018",
   "bandwidthInGbps": 100,
   "circuits": null,
   "encapsulation": "Dot1Q",
   "etag": "W/\"<etagnumber>\"",
   "etherType": "0x8100",
   "id": "/subscriptions/<subscriptionID>/resourceGroups/Contoso-Direct-rg/providers/Microsoft.Network/expressRoutePorts/Contoso-Direct",
   "links": [
    {
      "adminState": "Disabled",
      "connectorType": "LC",
      "etag": "W/\"<etagnumber>\"",
      "id": "/subscriptions/<subscriptionID>/resourceGroups/Contoso-Direct-rg/providers/Microsoft.Network/expressRoutePorts/Contoso-Direct/links/link1",
      "interfaceName": "HundredGigE2/2/2",
      "name": "link1",
      "patchPanelId": "PPID",
      "provisioningState": "Succeeded",
      "rackId": "RackID",
      "resourceGroup": "Contoso-Direct-rg",
      "routerName": "tst-09xgmr-cis-1",
      "type": "Microsoft.Network/expressRoutePorts/links"
    },
    {
      "adminState": "Disabled",
      "connectorType": "LC",
      "etag": "W/\"<etagnumber>\"",
      "id": "/subscriptions/<subscriptionID>/resourceGroups/Contoso-Direct-rg/providers/Microsoft.Network/expressRoutePorts/Contoso-Direct/links/link2",
      "interfaceName": "HundredGigE2/2/2",
      "name": "link2",
      "patchPanelId": "PPID",
      "provisioningState": "Succeeded",
      "rackId": "RackID",
      "resourceGroup": "Contoso-Direct-rg",
      "routerName": "tst-09xgmr-cis-2",
      "type": "Microsoft.Network/expressRoutePorts/links"
    }
   ],
   "location": "westus",
   "mtu": "1500",
   "name": "Contoso-Direct",
   "peeringLocation": "Equinix-Ashburn-DC2",
   "provisionedBandwidthInGbps": 0.0,
   "provisioningState": "Succeeded",
   "resourceGroup": "Contoso-Direct-rg",
   "resourceGuid": "02ee21fe-4223-4942-a6bc-8d81daabc94f",
   "tags": null,
   "type": "Microsoft.Network/expressRoutePorts"
   }  
   ```

## <a name="resources"></a>Generate the Letter of Authorization (LOA)

Input the recently created ExpressRoute Direct resource name, resource group name, and a customer name to write the LOA to and (optionally) define a file location to store the document. If a file path is not referenced, the document will download to the current directory.

```azurecli
az network express-route port generate-loa -n Contoso-Direct -g Contoso-Direct-rg --customer-name Contoso --destination C:\Users\SampleUser\Downloads\LOA.pdf
```

## <a name="state"></a>Change AdminState for links

Use this process to conduct a layer 1 test. Ensure that each cross-connection is properly patched into each router in the primary and secondary ports.

1. Set links to **Enabled**. Repeat this step to set each link to **Enabled**.

   Links[0] is the primary port and Links[1] is the secondary port.

   ```azurecli
   az network express-route port update -n Contoso-Direct -g Contoso-Direct-rg --set links[0].adminState="Enabled"
   ```
   ```azurecli
   az network express-route port update -n Contoso-Direct -g Contoso-Direct-rg --set links[1].adminState="Enabled"
   ```
   **Example output**

   ```output
   {
   "allocationDate": "Wednesday, October 17, 2018",
   "bandwidthInGbps": 100,
   "circuits": null,
   "encapsulation": "Dot1Q",
   "etag": "W/\"<etagnumber>\"",
   "etherType": "0x8100",
   "id": "/subscriptions/<subscriptionID>/resourceGroups/Contoso-Direct-rg/providers/Microsoft.Network/expressRoutePorts/Contoso-Direct",
   "links": [
    {
      "adminState": "Enabled",
      "connectorType": "LC",
      "etag": "W/\"<etagnumber>\"",
      "id": "/subscriptions/<subscriptionID>/resourceGroups/Contoso-Direct-rg/providers/Microsoft.Network/expressRoutePorts/Contoso-Direct/links/link1",
      "interfaceName": "HundredGigE2/2/2",
      "name": "link1",
      "patchPanelId": "PPID",
      "provisioningState": "Succeeded",
      "rackId": "RackID",
      "resourceGroup": "Contoso-Direct-rg",
      "routerName": "tst-09xgmr-cis-1",
      "type": "Microsoft.Network/expressRoutePorts/links"
    },
    {
      "adminState": "Enabled",
      "connectorType": "LC",
      "etag": "W/\"<etagnumber>\"",
      "id": "/subscriptions/<subscriptionID>/resourceGroups/Contoso-Direct-rg/providers/Microsoft.Network/expressRoutePorts/Contoso-Direct/links/link2",
      "interfaceName": "HundredGigE2/2/2",
      "name": "link2",
      "patchPanelId": "PPID",
      "provisioningState": "Succeeded",
      "rackId": "RackID",
      "resourceGroup": "Contoso-Direct-rg",
      "routerName": "tst-09xgmr-cis-2",
      "type": "Microsoft.Network/expressRoutePorts/links"
    }
   ],
   "location": "westus",
   "mtu": "1500",
   "name": "Contoso-Direct",
   "peeringLocation": "Equinix-Ashburn-DC2",
   "provisionedBandwidthInGbps": 0.0,
   "provisioningState": "Succeeded",
   "resourceGroup": "Contoso-Direct-rg",
   "resourceGuid": "<resourceGUID>",
   "tags": null,
   "type": "Microsoft.Network/expressRoutePorts"
   }
   ```

   Use the same procedure to down the ports by using `AdminState = "Disabled"`.

## <a name="circuit"></a>Create a circuit

By default, you can create 10 circuits in the subscription that contains the ExpressRoute Direct resource. Microsoft Support can increase the default limit. You're responsible for tracking provisioned and utilized bandwidth. Provisioned bandwidth is the sum of the bandwidth of all the circuits on the ExpressRoute Direct resource. Utilized bandwidth is the physical usage of the underlying physical interfaces.

You can use additional circuit bandwidths on ExpressRoute Direct only to support the scenarios outlined here. The bandwidths are 40 Gbps and 100 Gbps.

**SkuTier** can be Local, Standard, or Premium.

**SkuFamily** can only be MeteredData at creation. You can change to **Unlimited** after the creation of the circuit by updating the `sku-family`.

> [!NOTE]
> Once you change to **Unlimited** data, you can't change back without needing to recreate the ExpressRoute circuit.

Create a circuit on the ExpressRoute Direct resource:

  ```azurecli
  az network express-route create --express-route-port "/subscriptions/<subscriptionID>/resourceGroups/Contoso-Direct-rg/providers/Microsoft.Network/expressRoutePorts/Contoso-Direct" -n "Contoso-Direct-ckt" -g "Contoso-Direct-rg" --sku-family MeteredData --sku-tier Standard --bandwidth 100 Gbps --location $AzureRegion
  ```

  Other bandwidths include 5 Gbps, 10 Gbps, and 40 Gbps.

  **Example output**

  ```output
  {
  "allowClassicOperations": false,
  "allowGlobalReach": false,
  "authorizations": [],
  "bandwidthInGbps": 100.0,
  "circuitProvisioningState": "Enabled",
  "etag": "W/\"<etagnumber>\"",
  "expressRoutePort": {
    "id": "/subscriptions/<subscriptionID>/resourceGroups/Contoso-Direct-rg/providers/Microsoft.Network/expressRoutePorts/Contoso-Direct",
    "resourceGroup": "Contoso-Direct-rg"
  },
  "gatewayManagerEtag": "",
  "id": "/subscriptions/<subscriptionID>/resourceGroups/Contoso-Direct-rg/providers/Microsoft.Network/expressRouteCircuits/ERDirect-ckt-cli",
  "location": "westus",
  "name": "ERDirect-ckt-cli",
  "peerings": [],
  "provisioningState": "Succeeded",
  "resourceGroup": "Contoso-Direct-rg",
  "serviceKey": "<serviceKey>",
  "serviceProviderNotes": null,
  "serviceProviderProperties": null,
  "serviceProviderProvisioningState": "Provisioned",
  "sku": {
    "family": "MeteredData",
    "name": "Standard_MeteredData",
    "tier": "Standard"
  },
  "stag": null,
  "tags": null,
  "type": "Microsoft.Network/expressRouteCircuits"
  }  
  ```

## Next steps

For more information about ExpressRoute Direct, see the [overview](expressroute-erdirect-about.md).
