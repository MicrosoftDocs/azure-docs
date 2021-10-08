# Migrate from EA Reserved Instance Usage Details API

EA customers who were previously using the Enterprise Reporting consumption.azure.com API to obtain reserved instance usage details need to migrate to a parity Azure Resource Manager API. Instructions to do this are outlined below along with any contract differences between the old API and the new API.

**Assign permissions to an SPN to call the API**

Before calling this API, you need to configure a Service Principal with correct permission. You will use this service principal to call the API. To learn more, see Assign permissions to ACM APIs. \&lt;link needed\&gt;

###

### **Call the Reserved instance usage details API**

Microsoft isn&#39;t actively working on synchronous-based Reservation Details APIs. We recommend at you move to the newer SPN-supported asynchronous API call pattern as a part of the migration. Asynchronous requests better handle large amounts of data and will reduce timeout errors.

#### **Supported requests**

Use the following request URIs when calling the new Asynchronous Reservation Details API. Your enrollment number should be used as the billingAccountId. You can call the API with the following scopes:

- Enrollment: providers/Microsoft.Billing/billingAccounts/{billingAccountId}

#### **Sample request to generate a reservation details report**

JSONCopy

POST [https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/providers/Microsoft.CostManagement/generateReservationDetailsReport?startDate={startDate}&amp;endDate={endDate}&amp;api-version=2019-11-01](https://management.azure.com/providers/Microsoft.Billing/billingAccounts/%7BbillingAccountId%7D/providers/Microsoft.CostManagement/generateReservationDetailsReport?startDate=%7BstartDate%7D&amp;endDate=%7BendDate%7D&amp;api-version=2019-11-01)

#### **Sample request to poll report generation status**

JSONCopy

GET[https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/providers/Microsoft.CostManagement/reservationDetailsOperationResults/{operationId}?api-version=2019-11-01](https://management.azure.com/providers/Microsoft.Billing/billingAccounts/%7BbillingAccountId%7D/providers/Microsoft.CostManagement/reservationDetailsOperationResults/%7BoperationId%7D?api-version=2019-11-01)

#### **Sample poll response**

JSONCopy

{ &quot;status&quot;: &quot;Completed&quot;, &quot;properties&quot;: { &quot;reportUrl&quot;: &quot;[https://storage.blob.core.windows.net/details/20200911/00000000-0000-0000-0000-000000000000?sv=2016-05-31&amp;sr=b&amp;sig=jep8HT2aphfUkyERRZa5LRfd9RPzjXbzB%2F9TNiQ](https://storage.blob.core.windows.net/details/20200911/00000000-0000-0000-0000-000000000000?sv=2016-05-31&amp;sr=b&amp;sig=jep8HT2aphfUkyERRZa5LRfd9RPzjXbzB%2F9TNiQ)&quot;, &quot;validUntil&quot;: &quot;2020-09-12T02:56:55.5021869Z&quot; }}

#### **Response body changes**

The response of the older synchronous based Reservation Details API is below.

_Old response_:

JSONCopy

{ &quot;reservationOrderId&quot;: &quot;00000000-0000-0000-0000-000000000000&quot;, &quot;reservationId&quot;: &quot;00000000-0000-0000-0000-000000000000&quot;, &quot;usageDate&quot;: &quot;2018-02-01T00:00:00&quot;, &quot;skuName&quot;: &quot;Standard\_F2s&quot;, &quot;instanceId&quot;: &quot;/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/resourvegroup1/providers/microsoft.compute/virtualmachines/VM1&quot;, &quot;totalReservedQuantity&quot;: 18.000000000000000, &quot;reservedHours&quot;: 432.000000000000000, &quot;usedHours&quot;: 400.000000000000000}

_New response_:

The new API creates a CSV file for you. See the following file fields.

TABLE 3

| **Old Property** | **New Property** | **Notes** |
| --- | --- | --- |
|
 | InstanceFlexibilityGroup | New property for instance flexibility. |
|
 | InstanceFlexibilityRatio | New property for instance flexibility. |
| instanceId | InstanceName |
 |
|
 | Kind | It&#39;s a new property. Value is None, Reservation, or IncludedQuantity. |
| reservationId | ReservationId |
 |
| reservationOrderId | ReservationOrderId |
 |
| reservedHours | ReservedHours |
 |
| skuName | SkuName |
 |
| totalReservedQuantity | TotalReservedQuantity |
 |
| usageDate | UsageDate |
 |
| usedHours | UsedHours |
 |