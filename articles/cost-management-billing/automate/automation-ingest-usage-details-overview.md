# Ingest usage details data

Usage Details are the most granular cost records that are available to you within the Azure ecosystem. Usage details records allow you to correlate the meter-based charges with the specific resources responsible for those charges so that you can properly reconcile your bill.

This document outlines the main solutions available to you if you are looking to work with Usage Details data. You might need to download your Azure cost data to merge it with other datasets. Or you might need to integrate cost data into your own systems. There are different options available depending on the amount of data involved.

You must have Cost Management permissions at the appropriate scope to use APIs and tools in any case. For more information, see [Assign access to data](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/assign-access-acm-data) and ACM API Permissions Overview. \&lt;link needed\&gt;

**How to get usage details**

To learn more about which usage details automation solutions are available to you, see Usage details best practices. \&lt;link needed\&gt;

For Azure Portal download instructions, see [How to get your Azure billing invoice and daily usage data](https://docs.microsoft.com/en-us/azure/cost-management-billing/manage/download-azure-invoice-daily-usage-date). If you have a small usage details dataset from month-to-month, you can open your usage and charges CSV file in Microsoft Excel or another spreadsheet application.

**Usage details data format**

The Azure billing system uses usage details records at the end of the month to generate your bill. Your bill is based off the net charges that have accrued by meter. Usage records contain daily rated usage based on negotiated rates, purchases (for example, reservations, Marketplace fees), and refunds for the specified period. Fees don&#39;t include credits, taxes, or other charges or discounts.

The following table covers which charges are included in your usage details dataset for each account type.

UNDERSTAND THE TERMS IN YOUR AZURE USAGE AND CHARGES FILE

| **Account type** | **Azure usage** | **Marketplace usage** | **Purchases** | **Refunds** |
| --- | --- | --- | --- | --- |
| Enterprise Agreement (EA) | Yes | Yes | Yes | No |
| Microsoft Customer Agreement (MCA) | Yes | Yes | Yes | Yes |
| Pay-as-you-go (PAYG) | Yes | Yes | No | No |

Please keep in mind that a single Azure resource often has multiple meters emitting charges. For example, a VM may have both Compute and Networking related meters.

To understand the fields that are available in usage details records, see Understand usage details fields \&lt;link needed\&gt;.

To learn more about Marketplace orders (also known as external services), see [Understand your Azure external service charges](https://docs.microsoft.com/en-us/azure/cost-management-billing/understand/understand-azure-marketplace-charges).

### A single resource might have multiple records for a single day

Azure resource providers emit usage and charges to the billing system and populate the Additional Info field of the usage records. Occasionally, resource providers might emit usage for a given day and stamp the records with different datacenters in the Additional Info field of the usage records. It can cause multiple records for a meter/resource to be present in your usage file for a single day. In that situation, you aren&#39;t overcharged. The multiple records represent the full cost of the meter for the resource on that day.

**Notes about pricing**  **\&lt;keep content as is but eventually update per Murali\&gt;**

If you want to reconcile usage and charges with your price sheet or invoice, note the following information.

Price Sheet price behavior - The prices shown on the price sheet are the prices that you receive from Azure. They&#39;re scaled to a specific unit of measure. Unfortunately, the unit of measure doesn&#39;t always align to the unit of measure at which the actual resource usage and charges are emitted.

Usage Details price behavior - Usage files show scaled information that may not match precisely with the price sheet. Specifically:

- Unit Price - The price is scaled to match the unit of measure at which the charges are actually emitted by Azure resources. If scaling occurs, then the price won&#39;t match the price seen in the Price Sheet.
- Unit of Measure - Represents the unit of measure at which charges are actually emitted by Azure resources.
- Effective Price / Resource Rate - The price represents the actual rate that you end up paying per unit, after discounts are taken into account. It&#39;s the price that should be used with the Quantity to do Price \* Quantity calculations to reconcile charges. The price takes into account the following scenarios and the scaled unit price that&#39;s also present in the files. As a result, it might differ from the scaled unit price.
  - Tiered pricing - For example: $10 for the first 100 units, $8 for the next 100 units.
  - Included quantity - For example: The first 100 units are free and then $10 per unit.
  - Reservations
  - Rounding that occurs during calculation – Rounding takes into account the consumed quantity, tiered/included quantity pricing, and the scaled unit price.


## **Unexpected usage or charges**

If you have usage or charges that you don&#39;t recognize, there are several things you can do to help understand why:

- Review the invoice that has charges for the resource
- Review your invoiced charges in Cost analysis
- Find people responsible for the resource and engage with them
- Analyze the audit logs
- Analyze user permissions to the resource&#39;s parent scope
- Create an [Azure support request](https://go.microsoft.com/fwlink/?linkid=2083458) to help identify the charges

For more information, see [Analyze unexpected charges](https://docs.microsoft.com/en-us/azure/cost-management-billing/understand/analyze-unexpected-charges).

Note that Azure doesn&#39;t log most user actions. Instead, Microsoft logs resource usage for billing. If you notice a usage spike in the past and you didn&#39;t have logging enabled, Microsoft can&#39;t pinpoint the cause. Enable logging for the service that you want to view the increased usage for so that the appropriate technical team can assist you with the issue.

##


## Next steps

- Learn more about usage details best practices \&lt;Link needed\&gt;
- [Create and manage exported data](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-export-acm-data) in the Azure Portal with Exports.
- [Automate Export creation](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/ingest-azure-usage-at-scale) and ingestion at scale using the API.
- Understand usage details fields \&lt;Link needed\&gt;
- Learn how to get small usage datasets on demand \&lt;Link needed\&gt;