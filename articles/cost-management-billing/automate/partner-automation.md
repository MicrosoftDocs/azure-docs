# Automation for Partners

Content taken from this doc and put into a separate doc here. I have also made some content changes. We should put a reference to this new doc in the original doc.

[Get started with Azure Cost Management for partners | Microsoft Docs](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/get-started-partners#cost-management-rest-apis)

####################

Azure Cost Management is natively available for direct partners who have onboarded their customers to a Microsoft Customer Agreement and have [purchased an Azure Plan.](https://docs.microsoft.com/en-us/partner-center/purchase-azure-plan) Partners and customers can use Cost Management APIs described in the following sections for common tasks. To learn more about non automation scenarios, see [Cost Management for Partners](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/get-started-partners#cost-management-rest-apis).

### **Azure Cost Management APIs - Direct and indirect providers**

Partners with access to billing scopes in a partner tenant can use the following APIs to view invoiced costs.

APIs at the subscription scope can be called by a partner regardless of the cost policy if they have access to the subscription. Other users with access to the subscription, like the customer or reseller, can call the APIs only after the partner enables the cost policy for the customer tenant.

#### **To get a list of billing accounts**

Copy

GET [https://management.azure.com/providers/Microsoft.Billing/billingAccounts?api-version=2019-10-01-preview](https://management.azure.com/providers/Microsoft.Billing/billingAccounts?api-version=2019-10-01-preview)

#### **To get a list of customers**

Copy

GET [https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountName}/customers?api-version=2019-10-01-preview](https://management.azure.com/providers/Microsoft.Billing/billingAccounts/%7BbillingAccountName%7D/customers?api-version=2019-10-01-preview)

#### **To get a list of subscriptions**

Copy

GET [https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountName}/billingSubscriptions?api-version=2019-10-01-preview](https://management.azure.com/providers/Microsoft.Billing/billingAccounts/%7BbillingAccountName%7D/billingSubscriptions?api-version=2019-10-01-preview)

#### **To get a list of invoices for a period of time**

Copy

GET [https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountName}/invoices?api-version=2019-10-01-preview&amp;periodStartDate={periodStartDate}&amp;periodEndDate={periodEndDate](https://management.azure.com/providers/Microsoft.Billing/billingAccounts/%7BbillingAccountName%7D/invoices?api-version=2019-10-01-preview&amp;periodStartDate=%7BperiodStartDate%7D&amp;periodEndDate=%7BperiodEndDate)}

The API call returns an array of invoices that has elements similar to the following JSON code.

Copy

{ &quot;id&quot;: &quot;/providers/Microsoft.Billing/billingAccounts/{billingAccountID}/billingProfiles/{BillingProfileID}/invoices/{InvoiceID}&quot;, &quot;name&quot;: &quot;{InvoiceID}&quot;, &quot;properties&quot;: { &quot;amountDue&quot;: { &quot;currency&quot;: &quot;USD&quot;, &quot;value&quot;: x.xx }, ... }

Use the preceding returned ID field value and replace it in the following example as the scope to query for usage details.

Copy

GET [https://management.azure.com/{id}/providers/Microsoft.Consumption/UsageDetails?api-version=2019-10-01](https://management.azure.com/%7Bid%7D/providers/Microsoft.Consumption/UsageDetails?api-version=2019-10-01)

The example returns the usage records associated with the specific invoice.

#### **To get the policy for customers to view costs**

Copy

GET [https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountName}/customers/{customerID}/policies/default?api-version=2019-10-01-preview](https://management.azure.com/providers/Microsoft.Billing/billingAccounts/%7BbillingAccountName%7D/customers/%7BcustomerID%7D/policies/default?api-version=2019-10-01-preview)

#### **To set the policy for customers to view costs**

Copy

PUT [https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountName}/customers/{customerID}/policies/default?api-version=2019-10-01-preview](https://management.azure.com/providers/Microsoft.Billing/billingAccounts/%7BbillingAccountName%7D/customers/%7BcustomerID%7D/policies/default?api-version=2019-10-01-preview)

#### **To get Azure service usage for a billing account**

We recommend that you configure an Export for these scenarios. To learn more, see Get large usage datasets \&lt;need link\&gt;.

#### **To download a customer&#39;s Azure service usage**

We recommend that you configure an Export for this scenario as well. If you need to download the data on demand, however, you can use the Generate Detailed Cost Report API \&lt;need link\&gt;. To learn more, see get small usage datasets on demand \&lt;need link\&gt;.

#### **To get or download the price sheet for consumed Azure services**

First, use the following post.

Copy

POST [https://management.azure.com/providers/Microsoft.Billing/BillingAccounts/{billingAccountName}/billingProfiles/{billingProfileID}/pricesheet/default/download?api-version=2019-10-01-preview&amp;format=csv](https://management.azure.com/providers/Microsoft.Billing/BillingAccounts/%7BbillingAccountName%7D/billingProfiles/%7BbillingProfileID%7D/pricesheet/default/download?api-version=2019-10-01-preview&amp;format=csv)&quot; -verbose

Then, call the asynchronous operation property value. For example:

Copy

GET [https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountName}/billingProfiles/{billingProfileID}/pricesheetDownloadOperations/{operation}?sessiontoken=0:11186&amp;api-version=2019-10-01-preview](https://management.azure.com/providers/Microsoft.Billing/billingAccounts/%7BbillingAccountName%7D/billingProfiles/%7BbillingProfileID%7D/pricesheetDownloadOperations/%7Boperation%7D?sessiontoken=0:11186&amp;api-version=2019-10-01-preview)

The preceding get call returns the download link containing the price sheet.

#### **To get aggregated costs**

Copy

POST [https://management.azure.com/providers/microsoft.billing/billingAccounts/{billingAccountName}/providers/microsoft.costmanagement/query?api-version=2019-10-01](https://management.azure.com/providers/microsoft.billing/billingAccounts/%7BbillingAccountName%7D/providers/microsoft.costmanagement/query?api-version=2019-10-01)

#### **Create a budget for a partner**

Copy

PUT [https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountName}/providers/Microsoft.CostManagement/budgets/partnerworkshopbudget?api-version=2019-10-01](https://management.azure.com/providers/Microsoft.Billing/billingAccounts/%7BbillingAccountName%7D/providers/Microsoft.CostManagement/budgets/partnerworkshopbudget?api-version=2019-10-01)

#### **Create a budget for a customer**

Copy

PUT [https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountName}/customers/{customerID}/providers/Microsoft.Consumption/budgets/{budgetName}?api-version=2019-10-01](https://management.azure.com/providers/Microsoft.Billing/billingAccounts/%7BbillingAccountName%7D/customers/%7BcustomerID%7D/providers/Microsoft.Consumption/budgets/%7BbudgetName%7D?api-version=2019-10-01)

#### **Delete a budget**

Copy

DELETE https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/providers/Microsoft.CostManagement/budgets/{budgetName}?api-version=2019-10-01