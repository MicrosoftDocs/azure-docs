---
author: cynthn
ms.service: virtual-machines
ms.topic: include
ms.date: 10/26/2018
ms.author: cynthn
---
## Use the Azure portal
1. Select the VM you wish to redeploy, then select the *Redeploy* button in the *Settings* blade. You may need to scroll down to see the **Support and Troubleshooting** section that contains the 'Redeploy' button as in the following example:
   
    ![Azure VM blade](./media/virtual-machines-common-redeploy-to-new-node/vmoverview.png)
2. To confirm the operation, select the *Redeploy* button:
   
    ![Redeploy a VM blade](./media/virtual-machines-common-redeploy-to-new-node/redeployvm.png)
3. The **Status** of the VM changes to *Updating* as the VM prepares to redeploy, as shown in the following example:
   
    ![VM updating](./media/virtual-machines-common-redeploy-to-new-node/vmupdating.png)
4. The **Status** then changes to *Starting* as the VM boots up on a new Azure host, as shown in the following example:
   
    ![VM starting](./media/virtual-machines-common-redeploy-to-new-node/vmstarting.png)
5. After the VM finishes the boot process, the **Status** then returns to *Running*, indicating the VM has been successfully redeployed:
   
    ![VM running](./media/virtual-machines-common-redeploy-to-new-node/vmrunning.png)

