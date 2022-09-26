---
author: alkohli
ms.service: storsimple
ms.topic: include
ms.date: 10/26/2018
ms.author: alkohli
---
#### To create public endpoints on the cloud appliance

1. Sign in to the Azure portal.
2. Go to **Virtual Machines**, and then select and click the virtual machine that is being used as your cloud appliance.
    
3. You need to create a network security group (NSG) rule to control the flow of traffic in and out of your virtual machine. Perform the following steps to create an NSG rule.
    1. Select **Network security group**.
        ![Screenshot of the Virtual machine page. In the Settings section, Network security group is highlighted.](./media/storsimple-8000-create-public-endpoints-cloud-appliance/sca-create-public-endpt1.png)

    2. Click the default network security group that is presented.
        ![Screenshot of the Network security group page. The default network security group is highlighted.](./media/storsimple-8000-create-public-endpoints-cloud-appliance/sca-create-public-endpt2.png)

    3. Select **Inbound security rules**.
        ![Screenshot of a page showing the properties of the default network security group. In the navigation pane, Inbound security rules is highlighted.](./media/storsimple-8000-create-public-endpoints-cloud-appliance/sca-create-public-endpt3.png)

    4. Click **+ Add** to create an inbound security rule.
        ![Screenshot of the Inbound security rules page. The plus sign and the word Add are next to each other and are highlighted.](./media/storsimple-8000-create-public-endpoints-cloud-appliance/sca-create-public-endpt4.png)

        In the Add inbound security rule blade:

        1. For the **Name**, type the following name for the endpoint: WinRMHttps.
        
        2. For the **Priority**, select a number lesser than 1000 (which is the priority for the default rule). Higher the value, lower the priority.

        3. Set the **Source** to **Any**.

        4. For the **Service**, select **WinRM**. The **Protocol** is automatically set to **TCP** and the **Port range** is set to **5986**.

        5. Click **OK** to create the rule.

            ![Screenshot of the Add inbound security rule blade. The values are filled in as described in the procedure, and the OK button is highlighted.](./media/storsimple-8000-create-public-endpoints-cloud-appliance/sca-create-public-endpt5.png)

4. Your final step is to associate your network security group with a subnet or a specific network interface. Perform the following steps to associate your network security group with a subnet.
    1. Go to **Subnets**.
    2. Click **+ Associate**.
        ![Screenshot of the Subnets page. The plus sign and the word Associate are next to each other and are highlighted.](./media/storsimple-8000-create-public-endpoints-cloud-appliance/sca-create-public-endpt7.png)

    3. Select your virtual network, and then select the appropriate subnet.
    4. Click **OK** to create the rule.

        ![Screenshot of the Associate subnet page. The virtual network is selected, and the OK button is highlighted.](./media/storsimple-8000-create-public-endpoints-cloud-appliance/sca-create-public-endpt11.png)

After the rule is created, you can view its details to determine the Public Virtual IP (VIP) address. Record this address.


