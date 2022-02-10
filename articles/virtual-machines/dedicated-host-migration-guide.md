# Azure Dedicated Host SKU Retirement Migration Guide

As hardware ages, it must be retired and workloads must be migrated to newer, faster, and more efficient Azure Dedicated Host SKUs. The legacy Dedicated Host SKUs should be migrated to newer Dedicated Host SKUs. 
The main differences between the retiring Dedicated Host SKUs and the newly recommended Dedicated Host SKUs are:

- Newer, more efficient processors
- Increased RAM
- Increased available vCPUs
- Greater regional capacity compared to the retiring Dedicated Host SKUs

The next section will go over which Dedicated Host SKUs to migrate to help aid in migration planning and execution.

## Dsv3-Type1 and Dsv3-Type2

The Dsv3-Type1 and Dsv3-Type2 run Dsv3-series VMs, which offer a combination of vCPU, memory, and temporary storage best suited for most general-purpose workloads. 
We recommend migrating your existing VMs to one of the following Dedicated Host SKUs:

- Dsv3-Type3
- Dsv3-Type4

Please note that both Dedicated Host SKUs will not be impacted by the 1 March, 2023 retirement date. We recommend moving to one of the Dedicated Host SKUs listed above based on regional availability, pricing, and your organization’s needs.  

## Esv3-Type1 and Esv3-Type2

The Esv3-Type1 and Esv3-Type2 run Esv3-series VMs, which offer a combination of vCPU, memory, and temporary storage best suited for most memory-intensive workloads. 
We recommend migrating your existing VMs to one of the following Dedicated Host SKUs:

- Esv3-Type3
- Esv3-Type4

Please note that both Dedicated Host SKUs will not be impacted by the 1 March, 2023 retirement date. We recommend moving to one of the Dedicated Host SKUs listed above based on regional availability, pricing, and your organization’s needs.

## Migration steps

To migrate your workloads to avoid Dedicated Host SKU retirement, please go through the following steps:

1.	Choose a target Dedicated Host SKU to migrate to. 
2.	Ensure you have quota for the VM family associated with the target Dedicated Host SKU in your given region.
3.	Provision a new Dedicated Host of the target Dedicated Host SKU in the same Host Group.
4.	Stop and deallocate the VM(s) on your old Dedicated Host.
5.	Reassign the VM(s) to the target Dedicated Host.
6.	Start the VM(s).
7. Delete the old host.

More detailed instructions can be found in the following sections.

### Get quota for the target VM family

Follow this guide to [request an increase in vCPU quota](https://docs.microsoft.com/en-us/azure/azure-portal/supportability/per-vm-quota-requests) for your target VM family in your target region. Select the Dsv3-series or Esv3-series as the VM family, depending on the target Dedicated Host SKU.

### Create a new Dedicated Host

Within the same Host Group as the existing Dedicated Host, [create a Dedicated Host](https://docs.microsoft.com/en-us/azure/virtual-machines/dedicated-hosts-how-to?tabs=portal%2Cportal2#create-a-dedicated-host) of the target Dedicated Host SKU.

### Stop the VM(s)

#### PowerShell

Refer to the PowerShell documentation to [stop a VM through PowerShell](https://docs.microsoft.com/en-us/powershell/module/servicemanagement/azure.service/stop-azurevm?view=azuresmps-4.0.0).

#### Command Line Interface

Refer to the Command Line Interface (CLI) documentation to [stop a VM through CLI](https://docs.microsoft.com/en-us/cli/azure/vm?view=azure-cli-latest#az-vm-stop).

#### Portal

On Azure portal, please go through the following steps:

1.	Navigate to your VM.
2.	On the top navigation bar, click “Stop”.

#### Reassign the VM(s) to the target Dedicated Host

Once the target Dedicated Host has been created and the VM has been stopped, [reassign the VM to the target Dedicated Host](https://docs.microsoft.com/en-us/azure/virtual-machines/dedicated-hosts-how-to?tabs=portal%2Cportal2#add-an-existing-vm).

#### Start the VM(s) on the target Dedicated Host

#### Delete the old Dedicated Host

Once all VMs have been migrated from your old Dedicated Host to the target Dedicated Host, [delete the old Dedicated Host](https://docs.microsoft.com/en-us/azure/virtual-machines/dedicated-hosts-how-to?tabs=portal%2Cportal2#deleting-hosts).

## Help and support

If you have questions, ask community experts in [Microsoft Q&A](https://docs.microsoft.com/en-us/answers/topics/azure-dedicated-host.html).