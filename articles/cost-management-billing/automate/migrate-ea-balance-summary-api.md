# Migrate from EA Balance Summary API

EA customers who were previously using the Enterprise Reporting consumption.azure.com API to obtain their balance summary need to migrate to a parity Azure Resource Manager API. Instructions to do this are outlined below along with any contract differences between the old API and the new API.

**Assign permissions to an SPN to call the API**

Before calling this API, you need to configure a Service Principal with correct permission. You will use this service principal to call the API. To learn more, see Assign permissions to ACM APIs. \&lt;link needed\&gt;

###

### **Call the Balance Summary API**

Use the following request URIs when calling the new Balance Summary API. Your enrollment number should be used as the billingAccountId.

#### **Supported requests**

[Get for Enrollment](https://docs.microsoft.com/en-us/rest/api/consumption/balances/getbybillingaccount)

JSONCopy

[https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/providers/Microsoft.Consumption/balances?api-version=2019-10-01](https://management.azure.com/providers/Microsoft.Billing/billingAccounts/%7BbillingAccountId%7D/providers/Microsoft.Consumption/balances?api-version=2019-10-01)

### **Response body changes**

_Old response body_:

JSONCopy

{ &quot;id&quot;: &quot;enrollments/100/billingperiods/201507/balancesummaries&quot;, &quot;billingPeriodId&quot;: 201507, &quot;currencyCode&quot;: &quot;USD&quot;, &quot;beginningBalance&quot;: 0, &quot;endingBalance&quot;: 1.1, &quot;newPurchases&quot;: 1, &quot;adjustments&quot;: 1.1, &quot;utilized&quot;: 1.1, &quot;serviceOverage&quot;: 1, &quot;chargesBilledSeparately&quot;: 1, &quot;totalOverage&quot;: 1, &quot;totalUsage&quot;: 1.1, &quot;azureMarketplaceServiceCharges&quot;: 1, &quot;newPurchasesDetails&quot;: [{ &quot;name&quot;: &quot;&quot;, &quot;value&quot;: 1 }], &quot;adjustmentDetails&quot;: [{ &quot;name&quot;: &quot;Promo Credit&quot;, &quot;value&quot;: 1.1 }, { &quot;name&quot;: &quot;SIE Credit&quot;, &quot;value&quot;: 1.0 }] }

_New response body_:

The same data is now available in the properties field of the new API response. There might be minor changes to the spelling on some of the field names.

JSONCopy

{ &quot;id&quot;: &quot;/providers/Microsoft.Billing/billingAccounts/123456/providers/Microsoft.Billing/billingPeriods/201702/providers/Microsoft.Consumption/balances/balanceId1&quot;, &quot;name&quot;: &quot;balanceId1&quot;, &quot;type&quot;: &quot;Microsoft.Consumption/balances&quot;, &quot;properties&quot;: { &quot;currency&quot;: &quot;USD &quot;, &quot;beginningBalance&quot;: 3396469.19, &quot;endingBalance&quot;: 2922371.02, &quot;newPurchases&quot;: 0, &quot;adjustments&quot;: 0, &quot;utilized&quot;: 474098.17, &quot;serviceOverage&quot;: 0, &quot;chargesBilledSeparately&quot;: 0, &quot;totalOverage&quot;: 0, &quot;totalUsage&quot;: 474098.17, &quot;azureMarketplaceServiceCharges&quot;: 609.82, &quot;billingFrequency&quot;: &quot;Month&quot;, &quot;priceHidden&quot;: false, &quot;newPurchasesDetails&quot;: [{ &quot;name&quot;: &quot;Promo Purchase&quot;, &quot;value&quot;: 1 }], &quot;adjustmentDetails&quot;: [{ &quot;name&quot;: &quot;Promo Credit&quot;, &quot;value&quot;: 1.1 }, { &quot;name&quot;: &quot;SIE Credit&quot;, &quot;value&quot;: 1 }] }}