# Create a purchase order in the Azure portal

1. Navigate to **Cost Management + Billing** in the Azure portal.
2. Select a billing profile, locate the **Invoice management** section, and select **Purchase orders**.
3. Select **Create a new purchase order**.
4. Enter a unique name for the purchase order.
5. Select an effective date in UTC.
6. Select an expiration date in UTC.
7. Enter a brief description.
8. Enter the allocated budget for the purchase order.

## Purchase order field reference

| Field | How to use this field |
|---|---|
| Purchase order name | Enter a recognizable identifier that matches the internal procurement record. |
| Effective date | Select the date when the purchase order becomes eligible for allocation. |
| Expiration date | Select the last date when the purchase order can receive charges. |
| Description | Add context for finance and procurement teams. This information is referenced only in the purchase order details. |
| Allocated budget | Enter an approved amount in the currency of your customer billing profile. |
| Status | Set the status to **Active** to make the purchase order available for allocations. Set it to **Inactive** to retain the purchase order but make it unavailable for allocations. |

## Add an initial mapping during creation

Select the **Add a mapping to this PO** checkbox.

1. Select an option from the **Map to** drop-down menu.
2. Enter a publisher name.
3. Enter an offer ID.
4. Select an effective date in UTC. The default is the purchase order’s effective date, but you can select any date after the purchase order becomes effective.
5. Select an expiration date in UTC. The date must not be later than the purchase order’s expiration date.
6. Set the status to **Active** or **Inactive**.

Select **Edit preview** if you want to remove a mapping before creating the purchase order. You can’t change mapping values from the preview. To change a mapping, delete the existing mapping and add a new one.

## View purchase order details

1. Open the **Purchase orders** page to see all existing purchase orders.
2. Review purchase order mappings, utilization, active status, allocated budget, and last update date at a glance.
3. Compare allocated and utilized spend amounts.
4. Apply filters to find specific purchase orders quickly.
5. Select a purchase order to view its details.

## Edit purchase orders

You can edit individual purchase orders one at a time or edit multiple purchase orders in batches. When editing in batches, you can modify one or more fields for all selected purchase orders.

You can create and activate allocations at any time during or after the purchase order has been created. 

## Next step

Map charges to purchase orders.
