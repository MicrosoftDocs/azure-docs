## <a name="x-sub"></a>Peering across subscriptions
In this scenario you will create a peering between two VNets that exist in different subscriptions.

![cross sub scenario](./media/virtual-networks-create-vnetpeering-scenario-crosssub-include/figure01.PNG)

VNet peering relies on role-based access control (RBAC) for authorization. For cross-subscriptions scenario, you first need to grant sufficient permission to users who will create the peering link.

> [!NOTE]
> If the same user has the privilege over both subscriptions, then you can skip steps 1-4 that follow.
> 
> 

