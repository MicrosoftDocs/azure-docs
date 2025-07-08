---

title: How to migrate a Nested Confidential VM from one region to another

description: Migraten nested confidential VMs from one region to another

services: virtual-machines

author: ananyagarg

ms.service: azure-virtual-machines

ms.subservice: azure-confidential-computing

ms.topic: concept-article

ms.date: 07/07/2025

ms.author: ananyagarg
---

**Step1**: Identify the target region

**Step 2**: Prepare the Source Nested Confidential VM by ensuring all data is backed up

**Step 3**:  Verify that your subscription has sufficient quota for the target VM in the target region. Request a quota through the [Azure portal](https://learn.microsoft.com/en-us/azure/azure-portal/supportability/per-vm-quota-requests) if needed.

**Step 4**: Navigate to VM you wish to resize in the portal

**Step 5**: Click the stop button and wait for status of the VM to be Stopped (deallocated)
:::image type="complex" source=".\media\migrate-nested-cvms\image 1.png":::

**Step 6**: Find the **Capture** drop down in the overview tab of the VM, then select **Image**

**When you get to the image creation page**:
* Ensure you select *Automatically delete this Virtual Machine after creating the image* (check image 2)
:::image type="complex" source=".\media\migrate-nested-cvms\image 2.png":::

* If you do not have a gallery, in the gallery option, select *Create new* and name your gallery

* Fill in name and other options, create an image definition if none are usable

* Read the descriptions for specialized vs generalized images and choose your option.  (If not sure, generalized should work for most cases.)

* Continue to fill other options.  In the replication portion of the image capture option, add the region you wish to *relocate* your VM to.  You will need to select the target region drop down
:::image type="complex" source=".\media\migrate-nested-cvms\image 3.png":::

**Fill in all other options and hit *Review + create***

**Step 7**: Go to your gallery and select the image you captured.  In the top left, select **Create a vm**

**Step 8**: Fill in all options and ensure you select the new region and new size.  If you do not see the size you wish to have, ensure no infrastructure redundancy is required is selected and that your requested region supports the size you wish to have.

