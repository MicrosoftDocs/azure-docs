---
title: 'Configure Azure ExpressRoute Direct'
description: This article helps you configure ExpressRoute Direct.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: how-to
ms.date: 07/10/2025
ms.author: duau
ms.custom: sfi-image-nochange

# Customer intent: As a network engineer, I want to configure Azure ExpressRoute Direct, so that I can establish a direct connection to Microsoft's global network for improved performance and reliability in data transfer.
---

# Create Azure ExpressRoute Direct

ExpressRoute Direct gives you the ability to directly connect to Microsoft's global network through peering locations strategically distributed across the world. For more information, see [About ExpressRoute Direct Connect](expressroute-erdirect-about.md).

This article shows you how to create ExpressRoute Direct using the Azure Portal, PowerShell and Azure CLI.

## Before you begin

# [**Portal**](#tab/portal)

Before using ExpressRoute Direct, you must enroll your subscription. To enroll, register the **Allow ExpressRoute Direct** feature to your subscription:

1. Sign in to the Azure portal and select the subscription you wish to enroll.

2. Select **Preview features** under *Settings* in the left side menu. Enter **ExpressRoute** into the search box.

3. Select the checkbox next to **Allow ExpressRoute Direct**, then select the **+ Register** button at the top of the page.

    :::image type="content" source="./media/how-to-expressroute-direct-portal/register-expressroute-direct.png" alt-text="Screenshot of registering allow ExpressRoute Direct feature.":::

4. Confirm *Allow ExpressRoute Direct* shows **Registered** under the *State* column.

    :::image type="content" source="./media/how-to-expressroute-direct-portal/registered.png" alt-text="Screenshot of allow ExpressRoute Direct feature registered.":::

# [**PowerShell**](#tab/powershell)

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

# [**Azure CLI**](#tab/cli)

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

---

## Create ExpressRoute Direct Resource

# [**Portal**](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), select **+ Create a resource**.

2. On the **Create a resource** page, enter **ExpressRoute Direct** into the *Search services and marketplace* box.

3. From the results, select **ExpressRoute Direct**.

4. On the **ExpressRoute Direct** page, select **Create** to open the **Create ExpressRoute Direct** page.

5. Complete the fields on the **Basics** page.

    :::image type="content" source="./media/how-to-expressroute-direct-portal/basics.png" alt-text="Screenshot of the basics page for create ExpressRoute Direct.":::

    - **Subscription**: The Azure subscription you want to use to create a new ExpressRoute Direct. The ExpressRoute Direct resource and ExpressRoute circuits created in a later step must be in the same subscription.
    - **Resource group**: The Azure resource group in which the new ExpressRoute Direct resource is created. If you don't have an existing resource group, you can create a new one.
    - **Region**: The Azure public region where the resource is created.
    - **ExpressRoute Direct name**: The name of the new ExpressRoute Direct resource.

6. Complete the fields on the **Configuration** page.

    - **Peering Location**: The peering location where you connect to the ExpressRoute Direct resource. For more information about peering locations, review [ExpressRoute Locations](expressroute-locations-providers.md).
    - **Bandwidth**: The port pair bandwidth that you want to reserve. ExpressRoute Direct supports both 10 Gb and 100-Gb bandwidth options. If your desired bandwidth isn't available at the specified peering location, [open a Support Request in the Azure portal](https://aka.ms/azsupt).
    - **Encapsulation**: ExpressRoute Direct supports both QinQ and Dot1Q encapsulation.
        - If QinQ is selected, each ExpressRoute circuit is dynamically assigned an S-Tag and is unique throughout the ExpressRoute Direct resource.
        - Each C-Tag on the circuit must be unique on the circuit, but not across the ExpressRoute Direct.
        - If Dot1Q encapsulation is selected, you must manage the uniqueness of the C-Tag (VLAN) across the entire ExpressRoute Direct resource.

    > [!IMPORTANT]
    > ExpressRoute Direct can only be one encapsulation type. Encapsulation can't be changed after ExpressRoute Direct creation.

7. Specify any resource tags, then select **Review + create** to validate the ExpressRoute Direct resource settings.

8. Select **Create** once validation passes. You see a message letting you know that your deployment is underway. A status displays on this page when your ExpressRoute Direct resource is created.

# [**PowerShell**](#tab/powershell)

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
   > If bandwidth is unavailable in the target location, open a [support request in the Azure portal](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview) and select the ExpressRoute Direct Support Topic. 
   >
5. Create an ExpressRoute Direct resource based on the location in the previous step.

   ExpressRoute Direct supports both QinQ and Dot1Q encapsulation. If QinQ is selected, each ExpressRoute circuit is dynamically assigned an S-Tag and is unique throughout the ExpressRoute Direct resource. Each C-Tag on the circuit must be unique on the circuit, but not across the ExpressRoute Direct.  

   If Dot1Q encapsulation is selected, you must manage uniqueness of the C-Tag (VLAN) across the entire ExpressRoute Direct resource.  

   > [!IMPORTANT]
   > ExpressRoute Direct can only be one encapsulation type. Encapsulation can't be changed after ExpressRoute Direct creation.
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

# [**Azure CLI**](#tab/cli)

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

---
   
## Generate the letter of authorization (LOA)

# [**Portal**](#tab/portal)

1. Go to the overview page of the ExpressRoute Direct resource and select **Generate Letter of Authorization**.

    :::image type="content" source="./media/how-to-expressroute-direct-portal/overview.png" alt-text="Screenshot of generate letter of authorization button on overview page.":::

2. Enter your company name and select **Download** to generate the letter.

# [**PowerShell**](#tab/powershell)

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

# [**Azure CLI**](#tab/cli)

Input the recently created ExpressRoute Direct resource name, resource group name, and a customer name to write the LOA to and (optionally) define a file location to store the document. If a file path is not referenced, the document will download to the current directory.

```azurecli
az network express-route port generate-loa -n Contoso-Direct -g Contoso-Direct-rg --customer-name Contoso --destination C:\Users\SampleUser\Downloads\LOA.pdf
```

---

## Change Admin State of links

# [**Portal**](#tab/portal)

This process should be used to conduct a Layer 1 test, ensuring that each cross-connection is properly patched into each router for primary and secondary.

1. From the ExpressRoute Direct resource, select **Links** under *Settings* in the left side menu. Toggle the **Admin State** to **Enabled** and select **Save** for *Link 1*.

    :::image type="content" source="./media/how-to-expressroute-direct-portal/link-1.png" alt-text="Screenshot of admin state enabled for Link 1.":::

2. Select the **Link 2** tab. Toggle the **Admin State** to **Enabled** and select **Save** for *Link 2*.

    > [!IMPORTANT]
    > Billing begins when admin state is enabled on either link.

# [**PowerShell**](#tab/powershell)

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

# [**Azure CLI**](#tab/cli)

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

---

## Create a circuit

# [**Portal**](#tab/portal)

By default, you can create 10 circuits in the subscription where the ExpressRoute Direct resource is. You can increase this number by contacting support. You're responsible for tracking both Provisioned and Utilized Bandwidth. Provisioned bandwidth is the sum of bandwidth of all circuits on the ExpressRoute Direct resource. Utilized bandwidth is the physical usage of the underlying physical interfaces.

- There are more circuit bandwidths that can be utilized on ExpressRoute Direct only to support the scenarios outlined. These bandwidths are: 40 Gbps and 100 Gbps.
- `SkuTier` can be Local, Standard, or Premium.
- `SkuFamily` must be MeteredData only. Unlimited isn't supported on ExpressRoute Direct.

The following steps help you create an ExpressRoute circuit from the ExpressRoute Direct workflow. If you prefer, you can also create a circuit using the regular circuit workflow, although there's no advantage in using the regular circuit workflow steps for this configuration. For more information, see [Create and modify an ExpressRoute circuit](expressroute-howto-circuit-portal-resource-manager.md).

1. From the ExpressRoute Direct resource, select **Circuits** under *Settings* in the left side menu, and then select **+ Add**.

2. Complete the fields on the **Basics** page.

    - **Subscription**: The Azure subscription you want to use to create a new ExpressRoute circuit. The ExpressRoute circuit has to be in the same subscription as the ExpressRoute Direct resource.
    - **Resource group**: The Azure resource group in which the new ExpressRoute circuit resource is created. If you don't have an existing resource group, you can create a new one.
    - **Region**: The Azure public region where the resource is created. The region must be the same as the ExpressRoute Direct resource.
    - **Name**: The name of the new ExpressRoute circuit resource.

3. Complete the fields on the **Configuration** page.

    - **Port type**: Select **Direct** as the port type to create a circuit with ExpressRoute Direct.
    - **ExpressRoute Direct resource**: Select the ExpressRoute Direct resource you created in the previous section.
    - **Circuit bandwidth**: Select the bandwidth for the circuit. Ensure to keep track of the bandwidth utilization for the ExpressRoute Direct port.
    - **SKU**: Select the SKU type for the ExpressRoute circuit that best suits your environment.
    - **Billing model**: Only **Metered** billing model circuits are supported with ExpressRoute Direct at creation.

    > [!NOTE]
    > You can change from **Metered** to **Unlimited** after the creation of the circuit. This change is irreversible once completed. To change the billing model, go to the **configuration** page of the ExpressRoute Direct circuit.

4. Specify any resource tags, then select **Review + Create** to validate the settings before creating the resource.

5. Select **Create** once validation passes. You see a message letting you know that your deployment is underway. A status displays on this page when your ExpressRoute circuit resource is created.

# [**PowerShell**](#tab/powershell)

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
  ServiceKey                       : aaaaaaaa-0b0b-1c1c-2d2d-333333333333
  Peerings                         : []
  Authorizations                   : []
  AllowClassicOperations           : False
  GatewayManagerEtag     
  ```

# [**Azure CLI**](#tab/cli)

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

---

### Enable ExpressRoute Direct and circuits in a different subscription

# [**Portal**](#tab/portal)

1. Go to the ExpressRoute Direct resource and select **Authorizations** under *Settings* in the left side menu. Enter a name for a new authorization and select **Save**.

2. Create a new ExpressRoute circuit in a different subscription or Microsoft Entra tenant.

3. Select **Direct** as the port type and check the box for **Redeem authorization**. Enter the resource URI of the ExpressRoute Direct resource and enter the authorization key generated in step 2.

    :::image type="content" source="./media/how-to-expressroute-direct-portal/redeem-authorization.png" alt-text="Screenshot of redeeming authorization when creating a new ExpressRoute circuit.":::

4. Select **Review + Create** to validate the settings before creating the resource. Then select **Create** to deploy the new ExpressRoute circuit.

# [**PowerShell**](#tab/powershell)

You can create an authorization for your ExpressRoute Direct resource, and redeem the authorization to create an ExpressRoute circuit in a different subscription or Microsoft Entra tenant.

1. Sign in to Azure and select the ExpressRoute Direct subscription. 

   ```powershell
   Connect-AzAccount 

   Select-AzSubscription -Subscription "<SubscriptionID or SubscriptionName>"
   ```

1. Get ExpressRoute Direct details:

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
        Id                     : /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/erdirect-rg/providers/Microsoft.Network/expressRoutePorts/erdirect/authorizations/ERDirectAuthorization_1
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
        Id                     : /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/erdirect-rg/providers/Microsoft.Network/expressRoutePorts/erdirect/authorizations/ERDirectAuthorization_1
        Etag                   : W/"24cac874-dfb4-4931-9447-28e67edd5155"
        AuthorizationKey       : aaaaaaaa-0b0b-1c1c-2d2d-333333333333
        AuthorizationUseStatus : Available
        ProvisioningState      : Succeeded
        CircuitResourceUri     :on  
    ```

1. Redeem the authorization to create the ExpressRoute Direct circuit in different subscription or Microsoft Entra tenant with the following command:

    ```powershell
    Select-AzSubscription -Subscription "<SubscriptionID or SubscriptionName>"
    
    New-AzExpressRouteCircuit -Name $Name -ResourceGroupName $RGName -Location $Location -SkuTier $SkuTier -SkuFamily $SkuFamily -BandwidthInGbps $BandwidthInGbps -ExpressRoutePort $ERPort -AuthorizationKey $ERDirectAuthorization.AuthorizationKey
    ```

# [**Azure CLI**](#tab/cli)

You can create an authorization for your ExpressRoute Direct resource, and redeem the authorization to create an ExpressRoute circuit in a different subscription or Microsoft Entra tenant.

1. Sign in to Azure and select the subscription:

   ```azurecli
   az login

   az account set --subscription "<SubscriptionID or SubscriptionName>"

1. Get ExpressRoute Direct details:

    ```azurecli-interactive
    az network express-route port list
    az network express-route port show --name <Name> --resource-group <ResourceGroupName>
    ```

1. Create an authorization for the ExpressRoute Direct resource:

   ```azurecli-interactive
   az network express-route port authorization create --express-route-port <Name> --resource-group <ResourceGroupName> --name <AuthName>
   ```

   Sample output:

   ```
    "name": "ERDirectAuthorization_1",
    "id": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/erdirect-rg/providers/Microsoft.Network/expressRoutePorts/erdirect/authorizations/ERDirectAuthorization_1",
    "authorizationKey": "aaaaaaaa-0b0b-1c1c-2d2d-333333333333",
    "authorizationUseStatus": "Available",
    "provisioningState": "Succeeded"
    // ... other fields
    ```

1. Verify the authorization was created successfully:

    ```azurecli-interactive
    az network express-route port authorization show --express-route-port <Name> --resource-group <ResourceGroupName> --name <AuthName>
    ```

1. Redeem the authorization to create the ExpressRoute Direct circuit in a different subscription or Microsoft Entra tenant:

    ```azurecli-interactive
    az account set --subscription "<TargetSubscriptionID or SubscriptionName>"

    az network express-route create \
        --name <CircuitName> \
        --resource-group <RGName> \
        --location <Location> \
        --bandwidth <BandwidthInGbps> \
        --sku-tier <SkuTier> \
        --sku-family <SkuFamily> \
        --peering-location <PeeringLocation> \
        --express-route-port <ExpressRoutePortResourceId> \
        --authorization-key <AuthorizationKey>
    ```
    
---

## Next steps

- After you create the ExpressRoute circuit, you can [link virtual networks to your ExpressRoute circuit](expressroute-howto-add-gateway-portal-resource-manager.md).
- Learn more about [ExpressRoute Direct](expressroute-erdirect-about.md).
