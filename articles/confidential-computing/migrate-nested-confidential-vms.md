---

title: How to migrate a Nested Confidential VM from one region to another

description: Migrate nested confidential VMs from one region to another

services: virtual-machines

author: ananyagarg

ms.service: azure-confidential-computing

ms.topic: concept-article

ms.date: 07/07/2025

ms.author: ananyagarg
---
# How to move a Nested Confidential VM from one region to another

**Step1**: Identify the target region.

**Step 2**: Prepare the Source Nested Confidential VM by ensuring all data is backed up.

**Step 3**:  Verify that your subscription has sufficient quota for the target VM in the target region. Request a quota through the [Azure portal](/azure/azure-portal/supportability/per-vm-quota-requests) if needed.

**Step 4**: Navigate to VM you wish to resize in the portal.

**Step 5**: Select the stop button and wait for status of the VM to be Stopped (deallocated).

:::image type="content" source="./media/migrate-nested-cvms/capture-option-azure-portal.png" alt-text="Screenshot of Azure portal showing the Capture option, circled in green, and the Status highlighted.":::


**Step 6**: Find the **Capture** drop down in the overview tab of the VM, then select **Image**.

**When you get to the image creation page**:
* Ensure you select *Automatically delete this Virtual Machine after creating the image* (check image 2).

:::image type="content" source="./media/migrate-nested-cvms/azure-portal-options-for-vm-image-creation.png" alt-text="Screenshot of the Azure portal showing the options to Automatically delete the virtual machine after creating the image, Create new for Target Azure compute gallery, Create new for Target VM image definition, and Version number.":::



* If you don't have a gallery, in the gallery option, select *Create new* and name your gallery.

* Fill in name and other options, create an image definition if none is usable.

* Read the descriptions for specialized vs generalized images and choose your option. (If not sure, generalized should work for most cases.)

* Continue to fill other options. In the replication portion of the image capture option, add the region you wish to *relocate* your VM to.  You need to select the target region drop-down.

:::image type="content" source="./media/migrate-nested-cvms/azure-portal-option-target-region-migrated-vm.png" alt-text="Screenshot of the Azure portal showing the options Target regions.":::


**Fill in all other options and hit *Review + create***.

**Step 7**: Go to your gallery and select the image you captured. In the top left, select **Create a vm**.

**Step 8**: Fill in all options and ensure you select the new region and new size. If you don't see the size you wish to have, ensure 'no infrastructure redundancy is required' is selected and that your requested region supports the size you wish to have.

