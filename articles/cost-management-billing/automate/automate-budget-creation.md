# Automate budget creation

**Pasted content below from here:** [Manage Azure costs with automation | Microsoft Docs](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/manage-automation)

#################################

You can automate budget creation using the [Budgets API](https://docs.microsoft.com/en-us/rest/api/consumption/budgets). You can also create a budget with a [budget template](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/quick-create-budget-template). Templates are an easy way for you to standardize Azure deployments while ensuring cost control is properly configured and enforced.

**Supported locales for budget alert emails**

With budgets, you&#39;re alerted when costs cross a set threshold. You can set up to five email recipients per budget. Recipients receive the email alerts within 24 hours of crossing the budget threshold. However, your recipient might need to receive an email in a different language. You can use the following language culture codes with the Budgets API. Set the culture code with the locale parameter similar to the following example.

JSONCopy

{

&quot;eTag&quot;: &quot;\&quot;1d681a8fc67f77a\&quot;&quot;,

&quot;properties&quot;: {

&quot;timePeriod&quot;: {

&quot;startDate&quot;: &quot;2020-07-24T00:00:00Z&quot;,

&quot;endDate&quot;: &quot;2022-07-23T00:00:00Z&quot;

},

&quot;timeGrain&quot;: &quot;BillingMonth&quot;,

&quot;amount&quot;: 1,

&quot;currentSpend&quot;: {

&quot;amount&quot;: 0,

&quot;unit&quot;: &quot;USD&quot;

},

&quot;category&quot;: &quot;Cost&quot;,

&quot;notifications&quot;: {

&quot;actual\_GreaterThan\_10\_Percent&quot;: {

&quot;enabled&quot;: true,

&quot;operator&quot;: &quot;GreaterThan&quot;,

&quot;threshold&quot;: 20,

&quot;locale&quot;: &quot;en-us&quot;,

&quot;contactEmails&quot;: [

&quot;user@contoso.com&quot;

],

&quot;contactRoles&quot;: [],

&quot;contactGroups&quot;: [],

&quot;thresholdType&quot;: &quot;Actual&quot;

}

}

}

}

Languages supported by a culture code:

| **SUPPORTED LOCALES FOR BUDGET ALERT EMAILS** |
| --- |
| **Culture code** | **Language** |
|
| |
|
| |
| en-us | English (United States) |
| --- | --- |
| ja-jp | Japanese (Japan) |
| --- | --- |
| zh-cn | Chinese (Simplified, China) |
| --- | --- |
| de-de | German (Germany) |
| --- | --- |
| es-es | Spanish (Spain, International) |
| --- | --- |
| fr-fr | French (France) |
| --- | --- |
| it-it | Italian (Italy) |
| --- | --- |
| ko-kr | Korean (Korea) |
| --- | --- |
| pt-br | Portuguese (Brazil) |
| --- | --- |
| ru-ru | Russian (Russia) |
| --- | --- |
| zh-tw | Chinese (Traditional, Taiwan) |
| --- | --- |
| cs-cz | Czech (Czech Republic) |
| --- | --- |
| pl-pl | Polish (Poland) |
| --- | --- |
| tr-tr | Turkish (Turkey) |
| --- | --- |
| da-dk | Danish (Denmark) |
| --- | --- |
| en-gb | English (United Kingdom) |
| --- | --- |
| hu-hu | Hungarian (Hungary) |
| --- | --- |
| nb-no | Norwegian Bokmal (Norway) |
| --- | --- |
| nl-nl | Dutch (Netherlands) |
| --- | --- |
| pt-pt | Portuguese (Portugal) |
| --- | --- |
| sv-se | Swedish (Sweden) |
| --- | --- |

**Common Budgets API configurations**

There are many ways to configure a budget in your Azure environment. Consider your scenario first and then identify the configuration options that enable it. Review the following options:

- **Time Grain**  - Represents the recurring period your budget uses to accrue and evaluate costs. The most common options are Monthly, Quarterly, and Annual.
- **Time Period**  - Represents how long your budget is valid. The budget actively monitors and alerts you only while it remains valid.
- **Notifications**
  - Contact Emails – The email addresses receive alerts when a budget accrues costs and exceeds defined thresholds.
  - Contact Roles - All users who have a matching Azure role on the given scope receive email alerts with this option. For example, Subscription Owners could receive an alert for a budget created at the subscription scope.
  - Contact Groups - The budget calls the configured action groups when an alert threshold is exceeded.
- **Cost dimension filters**  - The same filtering you can do in Cost Analysis or the Query API can also be done on your budget. Use this filter to reduce the range of costs that you&#39;re monitoring with the budget.

After you&#39;ve identified the budget creation options that meet your needs, create the budget using the API. The example below helps get you started with a common budget configuration.

**Create a budget filtered to multiple resources and tags**

Request URL: PUT https://management.azure.com/subscriptions/{SubscriptionId} /providers/Microsoft.Consumption/budgets/{BudgetName}/?api-version=2019-10-01

JSONCopy

{

&quot;eTag&quot;: &quot;\&quot;1d34d016a593709\&quot;&quot;,

&quot;properties&quot;: {

&quot;category&quot;: &quot;Cost&quot;,

&quot;amount&quot;: 100.65,

&quot;timeGrain&quot;: &quot;Monthly&quot;,

&quot;timePeriod&quot;: {

&quot;startDate&quot;: &quot;2017-10-01T00:00:00Z&quot;,

&quot;endDate&quot;: &quot;2018-10-31T00:00:00Z&quot;

},

&quot;filter&quot;: {

&quot;and&quot;: [

{

&quot;dimensions&quot;: {

&quot;name&quot;: &quot;ResourceId&quot;,

&quot;operator&quot;: &quot;In&quot;,

&quot;values&quot;: [

&quot;/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{meterName}&quot;,

&quot;/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{meterName}&quot;

]

}

},

{

&quot;tags&quot;: {

&quot;name&quot;: &quot;category&quot;,

&quot;operator&quot;: &quot;In&quot;,

&quot;values&quot;: [

&quot;Dev&quot;,

&quot;Prod&quot;

]

}

},

{

&quot;tags&quot;: {

&quot;name&quot;: &quot;department&quot;,

&quot;operator&quot;: &quot;In&quot;,

&quot;values&quot;: [

&quot;engineering&quot;,

&quot;sales&quot;

]

}

}

]

},

&quot;notifications&quot;: {

&quot;Actual\_GreaterThan\_80\_Percent&quot;: {

&quot;enabled&quot;: true,

&quot;operator&quot;: &quot;GreaterThan&quot;,

&quot;threshold&quot;: 80,

&quot;contactEmails&quot;: [

&quot;user1@contoso.com&quot;,

&quot;user2@contoso.com&quot;

],

&quot;contactRoles&quot;: [

&quot;Contributor&quot;,

&quot;Reader&quot;

],

&quot;contactGroups&quot;: [

&quot;/subscriptions/{subscriptionID}/resourceGroups/{resourceGroupName}/providers/microsoft.insights/actionGroups/{actionGroupName}

],

&quot;thresholdType&quot;: &quot;Actual&quot;

}

}

}

}

**Configure cost-based orchestration for budget alerts**

You can configure budgets to start automated actions using Azure Action Groups. To learn more about automating actions using budgets, see [Automation with Azure Budgets](https://docs.microsoft.com/en-us/azure/cost-management-billing/manage/cost-management-budget-scenario).