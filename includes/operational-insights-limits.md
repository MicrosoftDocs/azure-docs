
The following limits apply to each Operational Insights / Log Analytics workspace.

|  | Free | Standard | Premium | Standalone | OMS |
| --- | --- | --- | --- | --- | --- |
| Daily data transfer limit |500 MB<sup>1</sup> |None |None | None | None
| Data retention period |7 days |1 month |12 months | 1 month<sup>2</sup> | 1 month <sup>2</sup>|
| Data storage limit |500 MB * 7 days = 3.5 GB |unlimited |unlimited | unlimited |unlimited | 

<sup>1</sup> When customers reach their 500 MB daily data transfer limit, data analysis stops and resumes at the start of the next day. A day is based on UTC.

<sup>2</sup> The data retention period for the Standalone and OMS pricing plans can be increased to 730 days.

| Category | Limits | Comments
| --- | --- | --- |
| Data Collector API | Maximum size for a single post is 30 MB<br>Maximum size for field values is 32 KB | Split larger volumes into multiple posts<br>Fields longer than 32 KB are truncated. |
| Search API | 5000 records returned for non-aggregated data<br>500000 records for aggregated data | Aggregated data is a search that includes the `measure` command
 
