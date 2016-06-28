## Using Azure Portal

While this command is running, check your virtual machine in the [Azure portal](https://portal.azure.com). Notice that the VM's **Status** changes as following:

1. Initial **Status** is *Running*

	![Redeploy initial status](./media/virtual-machines-common-redeploy-to-new-node/statusrunning1.png)

2. **Status** changes to *Updating*

	![Redeploy status Updating](./media/virtual-machines-common-redeploy-to-new-node/statusupdating.png)

3. **Status** changes to *Starting*

	![Redeploy status Starting](./media/virtual-machines-common-redeploy-to-new-node/statusstarting.png)

4. **Status** changes back to *Running*

	![Redeploy final status](./media/virtual-machines-common-redeploy-to-new-node/statusrunning2.png)

When the **Status** is back to *Running*, the VM has successfully redeployed. 