# Cost Management API latency and rate limits

## **Data latency and rate limits**

We recommend that you call the Cost Management APIs no more than once per day. Cost Management data is refreshed every four hours as new usage data is received from Azure resource providers. Calling more frequently doesn&#39;t provide more data. Instead, it creates increased load. To learn more about how often data changes and how data latency is handled, see [Understand cost management data](https://docs.microsoft.com/en-us/azure/cost-management-billing/costs/understand-cost-mgt-data).

### **Error code 429 - Call count has exceeded rate limits**

To enable a consistent experience for all Cost Management subscribers, Cost Management APIs are rate limited. When you reach the limit, you receive the HTTP status code 429: Too many requests. The current throughput limits for our APIs are as follows:

- 30 calls per minute - It&#39;s done per scope, per user, or application.
- 200 calls per minute - It&#39;s done per tenant, per user, or application.