# Migrate from EA Reserved Instance Recommendations API

EA customers who were previously using the Enterprise Reporting consumption.azure.com API to obtain reserved instance recommendations need to migrate to a parity Azure Resource Manager API. Instructions to do this are outlined below along with any contract differences between the old API and the new API.

**Assign permissions to an SPN to call the API**

Before calling this API, you need to configure a Service Principal with correct permission. You will use this service principal to call the API. To learn more, see Assign permissions to ACM APIs. \&lt;link needed\&gt;

### **Call the reserved instance recommendations API**

Use the following request URIs to call the new Reservation Recommendations API.

#### **Supported requests**

Call the API with the following scopes:

- Enrollment: providers/Microsoft.Billing/billingAccounts/{billingAccountId}
- Subscription: subscriptions/{subscriptionId}
- Resource Groups: subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}

[_Get Recommendations_](https://docs.microsoft.com/en-us/rest/api/consumption/reservationrecommendations/list)

Both the shared and the single scope recommendations are available through this API. You can also filter on the scope as an optional API parameter.

JSONCopy

[https://management.azure.com/providers/Microsoft.Billing/billingAccounts/123456/providers/Microsoft.Consumption/reservationRecommendations?api-version=2019-10-01](https://management.azure.com/providers/Microsoft.Billing/billingAccounts/123456/providers/Microsoft.Consumption/reservationRecommendations?api-version=2019-10-01)

#### **Response body changes**

Recommendations for Shared and Single scopes are combined into one API.

_Old response_:

JSONCopy

[{ &quot;subscriptionId&quot;: &quot;1111111-1111-1111-1111-111111111111&quot;, &quot;lookBackPeriod&quot;: &quot;Last7Days&quot;, &quot;meterId&quot;: &quot;2e3c2132-1398-43d2-ad45-1d77f6574933&quot;, &quot;skuName&quot;: &quot;Standard\_DS1\_v2&quot;, &quot;term&quot;: &quot;P1Y&quot;, &quot;region&quot;: &quot;westus&quot;, &quot;costWithNoRI&quot;: 186.27634908960002, &quot;recommendedQuantity&quot;: 9, &quot;totalCostWithRI&quot;: 143.12931642978083, &quot;netSavings&quot;: 43.147032659819189, &quot;firstUsageDate&quot;: &quot;2018-02-19T00:00:00&quot;}]

_New response_:

JSONCopy

{ &quot;value&quot;: [{ &quot;id&quot;: &quot;billingAccount/123456/providers/Microsoft.Consumption/reservationRecommendations/00000000-0000-0000-0000-000000000000&quot;, &quot;name&quot;: &quot;00000000-0000-0000-0000-000000000000&quot;, &quot;type&quot;: &quot;Microsoft.Consumption/reservationRecommendations&quot;, &quot;location&quot;: &quot;westus&quot;, &quot;sku&quot;: &quot;Standard\_DS1\_v2&quot;, &quot;kind&quot;: &quot;legacy&quot;, &quot;properties&quot;: { &quot;meterId&quot;: &quot;00000000-0000-0000-0000-000000000000&quot;, &quot;term&quot;: &quot;P1Y&quot;, &quot;costWithNoReservedInstances&quot;: 12.0785105, &quot;recommendedQuantity&quot;: 1, &quot;totalCostWithReservedInstances&quot;: 11.4899644807748, &quot;netSavings&quot;: 0.588546019225182, &quot;firstUsageDate&quot;: &quot;2019-07-07T00:00:00-07:00&quot;, &quot;scope&quot;: &quot;Shared&quot;, &quot;lookBackPeriod&quot;: &quot;Last7Days&quot;, &quot;instanceFlexibilityRatio&quot;: 1, &quot;instanceFlexibilityGroup&quot;: &quot;DSv2 Series&quot;, &quot;normalizedSize&quot;: &quot;Standard\_DS1\_v2&quot;, &quot;recommendedQuantityNormalized&quot;: 1, &quot;skuProperties&quot;: [ { &quot;name&quot;: &quot;Cores&quot;, &quot;value&quot;: &quot;1&quot; }, { &quot;name&quot;: &quot;Ram&quot;, &quot;value&quot;: &quot;1&quot; }] } }, ]}