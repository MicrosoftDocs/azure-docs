# Azure Dedicated Host SKU Retirement

We continue to modernize and optimize Azure Dedicated Host by using the latest innovations in processor and datacenter technologies. Azure Dedicated Host is a combination of a virtual machine (VM) series and a specific Intel or AMD-based physical server. As we innovate and work with our technology partners, we also need to plan how we retire aging technology.

## Migrate your Dsv3-Type1, Dsv3-Type2, Esv3-Type1, and Esv3-Type2 Azure Dedicated Hosts by March 31, 2023

All hardware has a finite lifespan, including the underlying hardware for Azure Dedicated Host. As we continue to modernize Azure datacenters, hardware is decommissioned and eventually retired. The hardware running the Dsv3-Type1, Dsv3-Type2, Esv3-Type1, and Esv3-Type2 SKUs will be reaching end of life, as a result we will be retiring those Dedicated Host SKUs on 31 March, 2023.

## How does the retirement of Azure Dedicated Host SKUs affect you?

The current retirement impacts the following Azure Dedicated Host SKUs:

- Dsv3-Type1
- Esv3-Type1
- Dsv3-Type2
- Esv3-Type2

Note: If you are running a Dsv3-Type3, Dsv3-Type4, an Esv3-Type3, or an Esv3-Type4, you will not be impacted.

## What actions should you take?

You will need to create a Dedicated Host of a newer SKU, stop the VM(s) on your existing Dedicated Host, reassign them to the new host, and start the VM(s). Please refer to the Azure Dedicated Host Migration Guide for more detailed instructions. We recommend moving to the latest generation of Dedicated Host for your VM family.

If you have any questions, please contact us through customer support.

## FAQs

### Q: Will migration result in downtime?

A: Yes, you will need to stop/deallocate your VM(s) before moving the VM(s) to the target host.

### Q: When will the other Dedicated Host SKUs retire?

A: We will announce Dedicated Host SKU retirements 12 months in advance of the official retirement date of a given Dedicated Host SKU.

### Q: What are the milestones for the Dsv3-Type1, Dsv3-Type2, Esv3-Type1, and Esv3-Type1 retirement?

A: 
| Date           | Action                                                                 |
| -------------- | -----------------------------------------------------------------------|
| March 15, 2022 | Dsv3-Type1, Dsv3-Type2, Esv3-Type1, Esv3-Type2 retirement announcement |
| March 31, 2023 | Dsv3-Type1, Dsv3-Type2, Esv3-Type1, Esv3-Type2 retirement              |