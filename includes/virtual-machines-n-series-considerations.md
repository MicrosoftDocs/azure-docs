## General considerations for N-series VMs

* For availability of N-series VMs, see [Products available by region](https://azure.microsoft.com/en-us/regions/services/).

* N-series VMs can only be deployed in the Resource Manager deployment model.

* When creating an N-series VM using the Azure portal, on the **Basics** blade, select a **VM disk type** of **HDD**. To choose an available N-series size, on the **Size** blade, click **View all**.

* N-series VMs do not support VM disks that are backed by Azure premium storage.

* If you want to deploy more than a few N-series VMs, consider a pay-as-you-go subscription or other purchase options. If you're using an [Azure free account](https://azure.microsoft.com/free/), you can use only a limited number of Azure compute cores.

* You might need to increase the cores quota (per region) in your Azure subscription and the separate quota for NC or NV cores. To request a quota increase, [open an online customer support request](../articles/azure-supportability/how-to-create-azure-support-request.md) at no charge. Default limits may vary depending on your subscription category.







