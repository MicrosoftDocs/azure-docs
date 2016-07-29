## Using Azure Portal

1. Select the VM you wish to redeploy, and click the 'Redeploy' button in the 'Settings' blade:

	![Azure VM blade](./media/virtual-machines-common-redeploy-to-new-node/vmoverview.png)

2. Click the 'Redeploy' button to confirm the operation:

	![Redeploy a VM blade](./media/virtual-machines-common-redeploy-to-new-node/redeployvm.png)

3. You will see the **Status** of the VM change to *Updating* as the VM prepares to redeploy:

	![VM updating](./media/virtual-machines-common-redeploy-to-new-node/vmupdating.png)

4. The **Status** will then change to *Starting* as the VM boots up on a new Azure host:

	![VM starting](./media/virtual-machines-common-redeploy-to-new-node/vmstarting.png)

5. After the VM finishes the boot process, the **Status** will then return to *Running*, indicating the VM has been successfully redeployed:

	![VM running](./media/virtual-machines-common-redeploy-to-new-node/vmrunning.png)