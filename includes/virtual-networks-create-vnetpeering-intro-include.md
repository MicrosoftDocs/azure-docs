VNet Peering is a mechanism to connect two Virtual Networks in the same region through the Azure backbone network. Once peered, the two Virtual Networks will appear like a single Virtual Network for all connectivity purposes. Read the [VNet Peering overview](../articles/virtual-network/virtual-network-peering-overview.md) if you are not familiar with VNet Peering.

VNet Peering is in public preview, to be able to use it you must register using the below command:

> [AZURE.NOTE] Register-AzureRmProviderFeature -FeatureName AllowVnetPeering -ProviderNamespace Microsoft.Network
               Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Network
 