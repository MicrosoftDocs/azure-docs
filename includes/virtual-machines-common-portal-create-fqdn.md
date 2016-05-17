


When you create a virtual machine in the [Azure portal](https://portal.azure.com) using the **Resource Manager** deployment model, a public IP resource for the virtual machine is automatically created. You can use this IP address to remotely access the virtual machine. Although the portal does not create a [fully qualified domain name](https://en.wikipedia.org/wiki/Fully_qualified_domain_name), or FQDN, by default, it is extremely easy to create one once the virtual machine is created. This article demonstrates the steps to create a DNS name or FQDN.

The article assumes that you have logged in to your subscription in the portal, and created a virtual machine with the available images, using the **Resource Manager**. Follow these steps once your virtual machine starts running.

1.  View the virtual machine settings on the portal and click on the Public IP address.

    ![locate ip resource](./media/virtual-machines-common-portal-create-fqdn/locatePublicIP.PNG)

2.  Note that the DNS name for the Public IP is blank. Click **All settings** for the Public IP blade.

    ![settings ip](./media/virtual-machines-common-portal-create-fqdn/settingsIP.PNG)

3.  Open the **Configuration** tab in the Public IP Settings. Enter the desired DNS name label and **Save** this configuration.

    ![enter dns name label](./media/virtual-machines-common-portal-create-fqdn/dnsNameLabel.PNG)

    The Public IP resource will now show this new DNS label on its blade.

4.  Close the Public IP blades and go back to the virtual machine blade in the portal. Verify that the DNS name/FQDN appears next to the IP address for the Public IP resource.

    ![FQDN is created](./media/virtual-machines-common-portal-create-fqdn/fqdnCreated.PNG)


    You can now connect remotely to the virtual machine using this DNS name. For example, use `ssh adminuser@testdnslabel.centralus.cloudapp.azure.com`, when connecting to a Linux virtual machine which has the fully qualified domain name of `testdnslabel.centralus.cloudapp.azure.com` and user name of `adminuser`.