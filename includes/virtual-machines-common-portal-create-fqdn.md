## Quick steps
The article assumes that you have logged in to your subscription in the portal, and created a virtual machine with the available images using the Resource Manager deployment model. Follow these steps once your virtual machine starts running.

1. Select your virtual machine in the portal. The DNS name is blank. Click **Public IP address**:
   
   ![Click Public IP resource in the portal](./media/virtual-machines-common-portal-create-fqdn/locatePublicIP.PNG)

2. Enter the desired DNS name label and then click **Save**.
   
   ![Enter a DNS name label for your public IP resource](./media/virtual-machines-common-portal-create-fqdn/dnsNameLabel.PNG)
   
   The Public IP resource now shows this new DNS label on its blade.

3. Close the Public IP blades and go back to the VM overview blade in the portal. After a few seconds, the portal should update your settings. Verify that the DNS name/FQDN appears next to the IP address for the **Public IP address** resource.
   
   ![Confirm your new DNS label is set](./media/virtual-machines-common-portal-create-fqdn/fqdnCreated.PNG)

