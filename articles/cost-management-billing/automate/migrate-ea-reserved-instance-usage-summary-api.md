# Migrate from EA Reserved Instance Usage Summary API

EA customers who were previously using the Enterprise Reporting consumption.azure.com API to obtain reserved instance usage summaries need to migrate to a parity Azure Resource Manager API. Instructions to do this are outlined below along with any contract differences between the old API and the new API.

**Assign permissions to an SPN to call the API**

Before calling this API, you need to configure a Service Principal with correct permission. You will use this service principal to call the API. To learn more, see Assign permissions to ACM APIs. \&lt;link needed\&gt;

### **Call the Reserved Instance Usage Summary API**

Use the following request URIs to call the new Reservation Summaries API.

#### **Supported requests**

Call the API with the following scopes:

- Enrollment: providers/Microsoft.Billing/billingAccounts/{billingAccountId}

[_Get Reservation Summary Daily_](https://docs.microsoft.com/en-us/rest/api/consumption/reservationssummaries/list#reservationsummariesdailywithbillingaccountid)

JSONCopy

[https://management.azure.com/{scope}/Microsoft.Consumption/reservationSummaries?grain=daily&amp;$filter=properties/usageDate](https://management.azure.com/%7Bscope%7D/Microsoft.Consumption/reservationSummaries?grain=daily&amp;%24filter=properties/usageDate) ge 2017-10-01 AND properties/usageDate le 2017-11-20&amp;api-version=2019-10-01

[_Get Reservation Summary Monthly_](https://docs.microsoft.com/en-us/rest/api/consumption/reservationssummaries/list#reservationsummariesmonthlywithbillingaccountid)

JSONCopy

[https://management.azure.com/{scope}/Microsoft.Consumption/reservationSummaries?grain=daily&amp;$filter=properties/usageDate](https://management.azure.com/%7Bscope%7D/Microsoft.Consumption/reservationSummaries?grain=daily&amp;%24filter=properties/usageDate) ge 2017-10-01 AND properties/usageDate le 2017-11-20&amp;api-version=2019-10-01

#### **Response body changes**

_Old response_:

JSONCopy

[{ &quot;reservationOrderId&quot;: &quot;00000000-0000-0000-0000-000000000000&quot;, &quot;reservationId&quot;: &quot;00000000-0000-0000-0000-000000000000&quot;, &quot;skuName&quot;: &quot;Standard\_F1s&quot;, &quot;reservedHours&quot;: 24, &quot;usageDate&quot;: &quot;2018-05-01T00:00:00&quot;, &quot;usedHours&quot;: 23, &quot;minUtilizationPercentage&quot;: 0, &quot;avgUtilizationPercentage&quot;: 95.83, &quot;maxUtilizationPercentage&quot;: 100 }]

_New response_:

JSONCopy

{ &quot;value&quot;: [{ &quot;id&quot;: &quot;/providers/Microsoft.Billing/billingAccounts/12345/providers/Microsoft.Consumption/reservationSummaries/reservationSummaries\_Id1&quot;, &quot;name&quot;: &quot;reservationSummaries\_Id1&quot;, &quot;type&quot;: &quot;Microsoft.Consumption/reservationSummaries&quot;, &quot;tags&quot;: null, &quot;properties&quot;: { &quot;reservationOrderId&quot;: &quot;00000000-0000-0000-0000-000000000000&quot;, &quot;reservationId&quot;: &quot;00000000-0000-0000-0000-000000000000&quot;, &quot;skuName&quot;: &quot;Standard\_B1s&quot;, &quot;reservedHours&quot;: 720, &quot;usageDate&quot;: &quot;2018-09-01T00:00:00-07:00&quot;, &quot;usedHours&quot;: 0, &quot;minUtilizationPercentage&quot;: 0, &quot;avgUtilizationPercentage&quot;: 0, &quot;maxUtilizationPercentage&quot;: 0 } }]}