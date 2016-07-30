## Peering across subscriptions

In this scenario you will create a peering between two VNets belonging to different subscriptions.

![cross sub scenario](./media/virtual-networks-create-vnetpeering-scenario-crosssub-include/figure01.png)

VNet peering relies on Role based access control (RBAC) for authorization. For cross-subscriptions scenario, you first need to grant sufficient permission to users who will create the peering link:
NOTE: if the same user has the privilege over both subscriptions, then you can skip step1-4 below. 