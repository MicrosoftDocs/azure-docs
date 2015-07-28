The following table describes each of the major quotas, limits, defaults, and throttles in Azure Scheduler.

|Resource|Limit Description|
|---|---|
|**Job size**|The maximum job size is 16K. If a PUT or a PATCH results in a job larger than these limits, a 400 Bad Request status code is returned.|
|**Request URL size**|Maximum size of the request URL is 2048 chars.|
|**Aggregate header size**|Maximum aggregate header size is 4096 chars.|
|**Header count**|Maximum header count is 50 headers.|
|**Body size**|Maximum body size is 8192 chars.|
|**Recurrence span**|Maximum recurrence span is 18 months.|
|**Time to start time**|Maximum “time to start time” is 18 months.|
|**Job history**|Maximum response body stored in job history is 2048 bytes.|
|**Frequency**|The default max frequency quota is 1 hour in a free job collection and 1 minute in a standard job collection. The max frequency is configurable on a job collection to be lower than the maximum. All jobs in the job collection are limited the value set on the job collection. If you attempt to create a job with a higher frequency than the maximum frequency on the job collection then request will fail with a 409 Conflict status code.|
|**Jobs**|The default max jobs quota is 5 jobs in a free job collection and 50 jobs in a standard job collection. The maximum number of jobs is configurable on a job collection. All jobs in the job collection are limited the value set on the job collection. If you attempt to create more jobs than the maximum jobs quota, then the request fails with a 409 Conflict status code.|
|**Job history retention**|Job history is retained for up to 2 months.|
|**Completed and faulted job retention**|Completed and faulted jobs are retailed for 60 days.|
|**Timeout**|There’s a static (not configurable) request timeout of 30 seconds for HTTP actions. For longer running operations, follow HTTP asynchronous protocols; for example, return a 202 immediately but continue working in the background.|
