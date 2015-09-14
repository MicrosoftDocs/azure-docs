## Scenario

To better illustrate how to create a NSGs, this document will use the scenario below.

![VNet scenario](./media/virtual-networks-create-nsg-scenario-include/figure1.png)

In this scenario you will create an NSG for each scenario in the **TestVNet** virtual network, as described below: 

- **NSG-FrontEnd**. The front end NSG will be applied to the *FrontEnd* subnet, and contain two rules:	
	- **rdp-rule**. This rule will allow RDP traffic to the *FrontEnd* subnet.
	- **web-rule**. This rule will allow HTTP traffic to the *FrontEnd* subnet.
- **NSG-BackEnd**. The back end NSG will be applied to the *BackEnd* subnet, and contain two rules:	
	- **allow-frontend**. This rule allows SQL traffic only between the *BackEnd* and the *FrontEnd* subnets.
	- **block-internet**. This rule denies all internet bound traffic from the *BackEnd* subnet.

The combination of these rules create a DMZ-like scenario, where the back end subnet can only receive incoming traffic for SQL traffic from the front end subnet, and has no access to the Internet, while the front end subnet can communicate with the Internet, and receive incoming HTTP requests only.

The sample steps below expect a simple environment already created based on the scenario above. If you want to run the steps as they are displayed in this document, first build the test environment by deploying [this arm template](https://github.com/Azure/azure-quickstart-templates/tree/master/ACOM-VNet-Storage-VMs).

 