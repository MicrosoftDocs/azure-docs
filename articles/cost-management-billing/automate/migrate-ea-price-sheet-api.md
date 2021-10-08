# Migrate from EA Price Sheet API

EA customers who were previously using the Enterprise Reporting consumption.azure.com API to obtain their price sheet need to migrate to a parity Azure Resource Manager API. Instructions to do this are outlined below along with any contract differences between the old API and the new API.

**Assign permissions to an SPN to call the API**

Before calling this API, you need to configure a Service Principal with correct permission. You will use this service principal to call the API. To learn more, see Assign permissions to ACM APIs. \&lt;link needed\&gt;

###

### **Call the Price Sheet API**

Use the following request URIs when calling the new Price Sheet API.

#### **Supported requests**

You can call the API using the following scopes:

- Enrollment: providers/Microsoft.Billing/billingAccounts/{billingAccountId}
- Subscription: subscriptions/{subscriptionId}

[_Get for current Billing Period_](https://docs.microsoft.com/en-us/rest/api/consumption/pricesheet/get)

JSONCopy

[https://management.azure.com/{scope}/providers/Microsoft.Consumption/pricesheets/default?api-version=2019-10-01](https://management.azure.com/%7Bscope%7D/providers/Microsoft.Consumption/pricesheets/default?api-version=2019-10-01)

[_Get for specified Billing Period_](https://docs.microsoft.com/en-us/rest/api/consumption/pricesheet/getbybillingperiod)

JSONCopy

[https://management.azure.com/{scope}/providers/Microsoft.Billing/billingPeriods/{billingPeriodName}/providers/Microsoft.Consumption/pricesheets/default?api-version=2019-10-01](https://management.azure.com/%7Bscope%7D/providers/Microsoft.Billing/billingPeriods/%7BbillingPeriodName%7D/providers/Microsoft.Consumption/pricesheets/default?api-version=2019-10-01)

#### **Response body changes**

_Old response_:

JSONCopy

[{ &quot;id&quot;: &quot;enrollments/57354989/billingperiods/201601/products/343/pricesheets&quot;, &quot;billingPeriodId&quot;: &quot;201704&quot;, &quot;meterId&quot;: &quot;dc210ecb-97e8-4522-8134-2385494233c0&quot;, &quot;meterName&quot;: &quot;A1 VM&quot;, &quot;unitOfMeasure&quot;: &quot;100 Hours&quot;, &quot;includedQuantity&quot;: 0, &quot;partNumber&quot;: &quot;N7H-00015&quot;, &quot;unitPrice&quot;: 0.00, &quot;currencyCode&quot;: &quot;USD&quot; }, { &quot;id&quot;: &quot;enrollments/57354989/billingperiods/201601/products/2884/pricesheets&quot;, &quot;billingPeriodId&quot;: &quot;201404&quot;, &quot;meterId&quot;: &quot;dc210ecb-97e8-4522-8134-5385494233c0&quot;, &quot;meterName&quot;: &quot;Locally Redundant Storage Premium Storage - Snapshots - AU East&quot;, &quot;unitOfMeasure&quot;: &quot;100 GB&quot;, &quot;includedQuantity&quot;: 0, &quot;partNumber&quot;: &quot;N9H-00402&quot;, &quot;unitPrice&quot;: 0.00, &quot;currencyCode&quot;: &quot;USD&quot; }, ...]

_New response_:

Old data is now in the pricesheets field of the new API response. Meter details information is also provided.

JSONCopy

{ &quot;id&quot;: &quot;/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Billing/billingPeriods/201702/providers/Microsoft.Consumption/pricesheets/default&quot;, &quot;name&quot;: &quot;default&quot;, &quot;type&quot;: &quot;Microsoft.Consumption/pricesheets&quot;, &quot;properties&quot;: { &quot;nextLink&quot;: &quot;https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/providers/microsoft.consumption/pricesheets/default?api-version=2018-01-31&amp;$skiptoken=AQAAAA%3D%3D&amp;$expand=properties/pricesheets/meterDetails&quot;, &quot;pricesheets&quot;: [{ &quot;billingPeriodId&quot;: &quot;/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Billing/billingPeriods/201702&quot;, &quot;meterId&quot;: &quot;00000000-0000-0000-0000-000000000000&quot;, &quot;unitOfMeasure&quot;: &quot;100 Hours&quot;, &quot;includedQuantity&quot;: 100, &quot;partNumber&quot;: &quot;XX-11110&quot;, &quot;unitPrice&quot;: 0.00000, &quot;currencyCode&quot;: &quot;EUR&quot;, &quot;offerId&quot;: &quot;OfferId 1&quot;, &quot;meterDetails&quot;: { &quot;meterName&quot;: &quot;Data Transfer Out (GB)&quot;, &quot;meterCategory&quot;: &quot;Networking&quot;, &quot;unit&quot;: &quot;GB&quot;, &quot;meterLocation&quot;: &quot;Zone 2&quot;, &quot;totalIncludedQuantity&quot;: 0, &quot;pretaxStandardRate&quot;: 0.000 } }] }}