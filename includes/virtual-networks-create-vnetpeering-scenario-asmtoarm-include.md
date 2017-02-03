## <a name="x-model"></a>Peering virtual networks created through different deployment models
In this scenario, you will create a peering between two VNets named **VNET1** and **VNET2**. VNET1 is created through the Resource Manager deployment model, while VNET2 is created through the classic deployment model.

> [!NOTE]
> The virtual networks must be in the same subscription. The ability to create a peering between VNets created through different deployment models is currently in preview release. Preview capabilities do not have the same level of reliability and service level agreement as released capabilities. If you're interested in using the preview capability, you must first register the capability in your Azure subscription by entering the following command from PowerShell:
> 'Register-AzureRmProviderFeature -FeatureName AllowClassicCrossSubscriptionPeering -ProviderNamespace Microsoft.Network'

![asm to arm deployment scenario](./media/virtual-networks-create-vnetpeering-scenario-asmtoarm-include/figure01.PNG)

