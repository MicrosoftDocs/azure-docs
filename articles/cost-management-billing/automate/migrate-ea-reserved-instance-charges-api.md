# Migrate from EA Reserved Instance Charges API

EA customers who were previously using the Enterprise Reporting consumption.azure.com API to obtain reserved instance charges need to migrate to a parity Azure Resource Manager API. Instructions to do this are outlined below along with any contract differences between the old API and the new API.

**Assign permissions to an SPN to call the API**

Before calling this API, you need to configure a Service Principal with correct permission. You will use this service principal to call the API. To learn more, see Assign permissions to ACM APIs. \&lt;link needed\&gt;

### **Call the reserved instance charges API**

Use the following request URIs to call the new Reserved Instance Charges API.

#### **Supported requests**

[_Get Reservation Charges by Date Range_](https://docs.microsoft.com/en-us/rest/api/consumption/reservationtransactions/list)

JSONCopy

[https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/providers/Microsoft.Consumption/reservationTransactions?$filter=properties/eventDate+ge+2020-05-20+AND+properties/eventDate+le+2020-05-30&amp;api-version=2019-10-01](https://management.azure.com/providers/Microsoft.Billing/billingAccounts/%7BbillingAccountId%7D/providers/Microsoft.Consumption/reservationTransactions?%24filter=properties/eventDate+ge+2020-05-20+AND+properties/eventDate+le+2020-05-30&amp;api-version=2019-10-01)

#### **Response body changes**

_Old response_:

JSONCopy

[{ &quot;purchasingEnrollment&quot;: &quot;string&quot;, &quot;armSkuName&quot;: &quot;Standard\_F1s&quot;, &quot;term&quot;: &quot;P1Y&quot;, &quot;region&quot;: &quot;eastus&quot;, &quot;PurchasingsubscriptionGuid&quot;: &quot;00000000-0000-0000-0000-000000000000&quot;, &quot;PurchasingsubscriptionName&quot;: &quot;string&quot;, &quot;accountName&quot;: &quot;string&quot;, &quot;accountOwnerEmail&quot;: &quot;string&quot;, &quot;departmentName&quot;: &quot;string&quot;, &quot;costCenter&quot;: &quot;&quot;, &quot;currentEnrollment&quot;: &quot;string&quot;, &quot;eventDate&quot;: &quot;string&quot;, &quot;reservationOrderId&quot;: &quot;00000000-0000-0000-0000-000000000000&quot;, &quot;description&quot;: &quot;Standard\_F1s eastus 1 Year&quot;, &quot;eventType&quot;: &quot;Purchase&quot;, &quot;quantity&quot;: int, &quot;amount&quot;: double, &quot;currency&quot;: &quot;string&quot;, &quot;reservationOrderName&quot;: &quot;string&quot; }]

_New response_:

JSONCopy

{ &quot;value&quot;: [{ &quot;id&quot;: &quot;/billingAccounts/123456/providers/Microsoft.Consumption/reservationtransactions/201909091919&quot;, &quot;name&quot;: &quot;201909091919&quot;, &quot;type&quot;: &quot;Microsoft.Consumption/reservationTransactions&quot;, &quot;tags&quot;: {}, &quot;properties&quot;: { &quot;eventDate&quot;: &quot;2019-09-09T19:19:04Z&quot;, &quot;reservationOrderId&quot;: &quot;00000000-0000-0000-0000-000000000000&quot;, &quot;description&quot;: &quot;Standard\_DS1\_v2 westus 1 Year&quot;, &quot;eventType&quot;: &quot;Cancel&quot;, &quot;quantity&quot;: 1, &quot;amount&quot;: -21, &quot;currency&quot;: &quot;USD&quot;, &quot;reservationOrderName&quot;: &quot;Transaction-DS1\_v2&quot;, &quot;purchasingEnrollment&quot;: &quot;123456&quot;, &quot;armSkuName&quot;: &quot;Standard\_DS1\_v2&quot;, &quot;term&quot;: &quot;P1Y&quot;, &quot;region&quot;: &quot;westus&quot;, &quot;purchasingSubscriptionGuid&quot;: &quot;11111111-1111-1111-1111-11111111111&quot;, &quot;purchasingSubscriptionName&quot;: &quot;Infrastructure Subscription&quot;, &quot;accountName&quot;: &quot;Microsoft Infrastructure&quot;, &quot;accountOwnerEmail&quot;: &quot;admin@microsoft.com&quot;, &quot;departmentName&quot;: &quot;Unassigned&quot;, &quot;costCenter&quot;: &quot;&quot;, &quot;currentEnrollment&quot;: &quot;123456&quot;, &quot;billingFrequency&quot;: &quot;recurring&quot; } },]}